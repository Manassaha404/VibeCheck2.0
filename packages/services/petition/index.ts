import db, { eq, and, sql, desc } from "@repo/database";
import { petitions } from "@repo/database/models/petitions";
import { petitionSignatures } from "@repo/database/models/petition-signatures";
import { createPetitionDto, createPetitionType, getAnalyticsDto, GetAnalyticsResponseType, getPetitionForSignDto, signPetitionDto, signPetitionType, GetPetitionForSignResponseType } from "./model";
import { AppError } from "@repo/error";
import { users } from "@repo/database/models/users";
import * as crypto from "node:crypto";
import { inngest } from "../inngest";

class PetitionService {
  private async generateUniqueSlug(userId: string, title: string): Promise<string> {
    let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (!baseSlug) baseSlug = "petition";
    
    let slug = baseSlug;
    let isUnique = false;
    let maxAttempts = 10;
    
    while (!isUnique && maxAttempts > 0) {
      const [existing] = await db
        .select()
        .from(petitions)
        .where(and(eq(petitions.userId, userId), eq(petitions.slug, slug)));
        
      if (existing) {
        slug = `${baseSlug}-${crypto.randomBytes(4).toString("hex")}`;
        maxAttempts--;
      } else {
        isUnique = true;
      }
    }

    if (!isUnique) {
      throw new AppError("INTERNAL_SERVER_ERROR", "Failed to generate unique slug");
    }

    return slug;
  }

  public async createPetition(userId: string, payload: createPetitionType) {
    const { title, description, targetAuthority, goal, tags, visibility } =
      await createPetitionDto.parseAsync(payload);
    const slug = await this.generateUniqueSlug(userId, title);

    const isPublic = visibility === "public";

    const petition = await db.transaction(async (tx) => {
      const [newPetition] = await tx
        .insert(petitions)
        .values({
          userId,
          title,
          description,
          slug,
          targetAuthority,
          signaturesTarget: goal,
          isPublic,
          status: "active",
          isPublished: true,
        })
        .returning();

      if (!newPetition) {
        throw new AppError(
          "INTERNAL_SERVER_ERROR",
          "Failed to create petition",
        );
      }

      if (tags && tags.length > 0) {
        await inngest.send({name:"create/petition", data:{
            petitionId:newPetition.petitionId,
            tagsArray:tags
        }})
      }

      return newPetition;
    });

    return petition;
  }

  public async getAnalytics(slug: string): Promise<GetAnalyticsResponseType> {
    const parsed = await getAnalyticsDto.parseAsync({ slug });

    // 1. Get petition
    const [petition] = await db
      .select({
        petitionId: petitions.petitionId,
        title: petitions.title,
        slug: petitions.slug,
        status: petitions.status,
        signaturesTarget: petitions.signaturesTarget,
        username: users.username,
      })
      .from(petitions)
      .innerJoin(users, eq(petitions.userId, users.userId))
      .where(eq(petitions.slug, parsed.slug));

    if (!petition) {
      throw new AppError("NOT_FOUND", "Petition not found");
    }

    // 2. Total signatures
    const totalResult = await db.execute(sql`
      SELECT COUNT(*)::int as count 
      FROM ${petitionSignatures} 
      WHERE petition_id = ${petition.petitionId}
    `);
    const totalSignatures = (totalResult.rows[0]?.count as number) || 0;

    // 3. 7-Day Growth (Daily signatures for the last 7 days)
    // Coalesce dates so we group correctly. We'll format the output as string 'Mon', 'Tue' etc.
    const growthResult = await db.execute(sql`
      WITH recent_days AS (
        SELECT current_date - i AS date
        FROM generate_series(0, 6) i
      )
      SELECT 
        TO_CHAR(d.date, 'Dy') as day,
        COUNT(s.petition_signature_id)::int as signatures
      FROM recent_days d
      LEFT JOIN ${petitionSignatures} s 
        ON DATE(s.created_at) = d.date AND s.petition_id = ${petition.petitionId}
      GROUP BY d.date
      ORDER BY d.date ASC
    `);
    const growth = growthResult.rows as { day: string; signatures: number }[];

    // 4. Hubs (all cities by signature count)
    const topHubsResult = await db.execute(sql`
      SELECT city, country, COUNT(*)::int as count
      FROM ${petitionSignatures}
      WHERE petition_id = ${petition.petitionId}
        AND city IS NOT NULL 
        AND country IS NOT NULL
      GROUP BY city, country
      ORDER BY count DESC
    `);
    const topHubs = topHubsResult.rows as { city: string; country: string; count: number }[];

    // 5. Recent Signatures for Live Feed
    const recentSignatures = await db
      .select({
        firstName: petitionSignatures.firstName,
        lastName: petitionSignatures.lastName,
        createdAt: petitionSignatures.createdAt,
        city: petitionSignatures.city,
      })
      .from(petitionSignatures)
      .where(eq(petitionSignatures.petitionId, petition.petitionId))
      .orderBy(desc(petitionSignatures.createdAt))
      .limit(20);

    return {
      petition: {
        title: petition.title,
        slug: petition.slug,
        status: petition.status,
        signaturesTarget: petition.signaturesTarget,
        totalSignatures,
        username: petition.username,
      },
      growth,
      recentSignatures,
      topHubs,
    };
  }

  public async getPetitionForSign(username: string, slug: string, viewerUserId:string | undefined, guestToken: string | undefined): Promise<GetPetitionForSignResponseType> {
    const parsed = await getPetitionForSignDto.parseAsync({ username, slug });
    const [petition] = await db
      .select({
        petitionId: petitions.petitionId,
        title: petitions.title,
        description: petitions.description,
        status: petitions.status,
        signaturesTarget: petitions.signaturesTarget,
        username: users.username,
        slug: petitions.slug,
      })
      .from(petitions)
      .innerJoin(users, eq(petitions.userId, users.userId))
      .where(and(eq(petitions.slug, parsed.slug), eq(users.username, parsed.username)));

    if (!petition) {
      throw new AppError("NOT_FOUND", "Petition not found");
    }

    const totalResult = await db.execute(sql`
      SELECT COUNT(*)::int as count 
      FROM ${petitionSignatures} 
      WHERE petition_id = ${petition.petitionId}
    `);
    const totalSignatures = (totalResult.rows[0]?.count as number) || 0;

    let hasSigned = false;
    if (guestToken) {
      const [existingSignature] = await db
        .select()
        .from(petitionSignatures)
        .where(
          and(
            eq(petitionSignatures.petitionId, petition.petitionId),
            eq(petitionSignatures.guestToken, guestToken)
          )
        )
        .limit(1);
      
      if (existingSignature) {
        hasSigned = true;
      }
    }

    const recentSignatures = await db
      .select({
        firstName: petitionSignatures.firstName,
        lastName: petitionSignatures.lastName,
        createdAt: petitionSignatures.createdAt,
        city: petitionSignatures.city,
      })
      .from(petitionSignatures)
      .where(eq(petitionSignatures.petitionId, petition.petitionId))
      .orderBy(desc(petitionSignatures.createdAt))
      .limit(5);
    await inngest.send({
      name:"petition/view", 
      data:{
        petitionId:petition.petitionId,
        userId:viewerUserId
      },
    })
    return {
      petition,
      totalSignatures,
      recentSignatures,
      hasSigned,
    };
  }

  public async signPetition(payload: signPetitionType, viewerUserId:string | undefined, guestToken:string) {
    const data = await signPetitionDto.parseAsync(payload);

    await db.insert(petitionSignatures).values({
      petitionId: data.petitionId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      city: data.city,
      country: data.country,
      guestToken,
    });
    await inngest.send({
      name: "petition/sign", 
      data: {
        petitionId: data.petitionId,
        userId: viewerUserId
      }
    });

    return { success: true };
  }
}

export default PetitionService;
