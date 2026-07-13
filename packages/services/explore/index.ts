import db, {
  eq,
  and,
  gte,
  sql,
  desc,
  ilike,
  or,
  inArray,
  count,
} from "@repo/database";
import { polls } from "@repo/database/models/polls";
import { pollVotes } from "@repo/database/models/poll-votes";
import { pollOptions } from "@repo/database/models/poll-options";
import { pollQuestions } from "@repo/database/models/poll-questions";
import { pollTags } from "@repo/database/models/poll-tags";
import { petitions } from "@repo/database/models/petitions";
import { petitionSignatures } from "@repo/database/models/petition-signatures";
import { petitionTags } from "@repo/database/models/petition-tags";
import { tags } from "@repo/database/models/tags";
import { users } from "@repo/database/models/users";
import { userTagPreferences } from "@repo/database/models/user-tag-preferences";
import { QuizSessions } from "@repo/database/models/quiz-sessions";
import { quizzes } from "@repo/database/models/quizzes";
import { quizParticipants } from "@repo/database/models/quiz-participants";
import { AppError } from "@repo/error";
import {
  getTrendingDto,
  GetTrendingDtoType,
  getForYouDto,
  GetForYouDtoType,
  getForYouPageDto,
  GetForYouPageDtoType,
  joinQuizByCodeDto,
  JoinQuizByCodeDtoType,
  searchQuizSessionDto,
  SearchQuizSessionDtoType,
  TrendingResult,
  ForYouResult,
  ForYouPageResult,
  JoinQuizResult,
  QuizSessionSearchItem,
} from "./model";

class ExploreService {
  // ─── Trending Today ───────────────────────────────────────────────────────────

  public async getTrendingToday(
    payload: GetTrendingDtoType,
  ): Promise<TrendingResult> {
    const { limit } = getTrendingDto.parse(payload);

    // Start-of-today in UTC
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    // ── Trending Polls ────────────────────────────────────────────────────────
    // Count votes on poll_votes that happened today, grouped by poll
    const trendingPollRows = await db
      .select({
        pollId: polls.pollId,
        title: polls.title,
        slug: polls.slug,
        userId: polls.userId,
        todayVotes: sql<number>`COUNT(DISTINCT CASE WHEN ${pollVotes.createdAt} >= ${todayStart} THEN ${pollVotes.pollVoteId} END)::int`,
        totalVotes: sql<number>`COUNT(DISTINCT ${pollVotes.pollVoteId})::int`,
      })
      .from(polls)
      .innerJoin(pollQuestions, eq(pollQuestions.pollId, polls.pollId))
      .innerJoin(
        pollOptions,
        eq(pollOptions.questionId, pollQuestions.pollQuestionId),
      )
      .leftJoin(pollVotes, eq(pollVotes.optionId, pollOptions.pollOptionId))
      .where(
        and(
          eq(polls.isPublic, true),
          eq(polls.isPublished, true),
          eq(polls.status, "active"),
        ),
      )
      .groupBy(polls.pollId, polls.title, polls.slug, polls.userId)
      .orderBy(
        desc(
          sql<number>`COUNT(DISTINCT CASE WHEN ${pollVotes.createdAt} >= ${todayStart} THEN ${pollVotes.pollVoteId} END)`,
        ),
        desc(sql<number>`COUNT(DISTINCT ${pollVotes.pollVoteId})`),
      )
      .limit(limit);

    // Fetch usernames + tags for these polls
    const pollIds = trendingPollRows.map((r) => r.pollId);
    const pollUserIds = [...new Set(trendingPollRows.map((r) => r.userId))];

    const [pollUsersRows, pollTagRows] = await Promise.all([
      pollUserIds.length > 0
        ? db
            .select({ userId: users.userId, username: users.username })
            .from(users)
            .where(inArray(users.userId, pollUserIds))
        : Promise.resolve([]),
      pollIds.length > 0
        ? db
            .select({ pollId: pollTags.pollId, text: tags.text })
            .from(pollTags)
            .innerJoin(tags, eq(tags.tagId, pollTags.tagId))
            .where(inArray(pollTags.pollId, pollIds))
        : Promise.resolve([]),
    ]);

    const pollUserMap = new Map(
      pollUsersRows.map((u) => [u.userId, u.username]),
    );
    const pollTagMap = new Map<string, string[]>();
    for (const row of pollTagRows) {
      if (!pollTagMap.has(row.pollId)) pollTagMap.set(row.pollId, []);
      pollTagMap.get(row.pollId)!.push(row.text);
    }

    const trendingPolls = trendingPollRows.map((r) => ({
      pollId: r.pollId,
      title: r.title,
      slug: r.slug,
      username: pollUserMap.get(r.userId) ?? "",
      tags: pollTagMap.get(r.pollId) ?? [],
      todayVotes: r.todayVotes,
      totalVotes: r.totalVotes,
    }));

    // ── Trending Petitions ────────────────────────────────────────────────────
    const trendingPetitionRows = await db
      .select({
        petitionId: petitions.petitionId,
        title: petitions.title,
        slug: petitions.slug,
        userId: petitions.userId,
        signaturesTarget: petitions.signaturesTarget,
        todaySignatures: sql<number>`COUNT(DISTINCT CASE WHEN ${petitionSignatures.createdAt} >= ${todayStart} THEN ${petitionSignatures.petitionSignatureId} END)::int`,
        totalSignatures: sql<number>`COUNT(DISTINCT ${petitionSignatures.petitionSignatureId})::int`,
      })
      .from(petitions)
      .leftJoin(
        petitionSignatures,
        eq(petitionSignatures.petitionId, petitions.petitionId),
      )
      .where(
        and(
          eq(petitions.isPublic, true),
          eq(petitions.isPublished, true),
          eq(petitions.status, "active"),
        ),
      )
      .groupBy(
        petitions.petitionId,
        petitions.title,
        petitions.slug,
        petitions.userId,
        petitions.signaturesTarget,
      )
      .orderBy(
        desc(
          sql<number>`COUNT(DISTINCT CASE WHEN ${petitionSignatures.createdAt} >= ${todayStart} THEN ${petitionSignatures.petitionSignatureId} END)`,
        ),
        desc(
          sql<number>`COUNT(DISTINCT ${petitionSignatures.petitionSignatureId})`,
        ),
      )
      .limit(limit);

    const petitionIds = trendingPetitionRows.map((r) => r.petitionId);
    const petitionUserIds = [
      ...new Set(trendingPetitionRows.map((r) => r.userId)),
    ];

    const [petitionUsersRows, petitionTagRows] = await Promise.all([
      petitionUserIds.length > 0
        ? db
            .select({ userId: users.userId, username: users.username })
            .from(users)
            .where(inArray(users.userId, petitionUserIds))
        : Promise.resolve([]),
      petitionIds.length > 0
        ? db
            .select({ petitionId: petitionTags.petitionId, text: tags.text })
            .from(petitionTags)
            .innerJoin(tags, eq(tags.tagId, petitionTags.tagId))
            .where(inArray(petitionTags.petitionId, petitionIds))
        : Promise.resolve([]),
    ]);

    const petitionUserMap = new Map(
      petitionUsersRows.map((u) => [u.userId, u.username]),
    );
    const petitionTagMap = new Map<string, string[]>();
    for (const row of petitionTagRows) {
      if (!petitionTagMap.has(row.petitionId))
        petitionTagMap.set(row.petitionId, []);
      petitionTagMap.get(row.petitionId)!.push(row.text);
    }

    const trendingPetitions = trendingPetitionRows.map((r) => ({
      petitionId: r.petitionId,
      title: r.title,
      slug: r.slug,
      username: petitionUserMap.get(r.userId) ?? "",
      tags: petitionTagMap.get(r.petitionId) ?? [],
      signaturesTarget: r.signaturesTarget,
      todaySignatures: r.todaySignatures,
      totalSignatures: r.totalSignatures,
    }));

    return { polls: trendingPolls, petitions: trendingPetitions };
  }

  // ─── For You ─────────────────────────────────────────────────────────────────

  public async getForYou(
    userId: string,
    payload: GetForYouDtoType,
  ): Promise<ForYouResult> {
    const { limit, type } = getForYouDto.parse(payload);

    // Fetch user's top tag preferences
    const userPrefs = await db
      .select({
        tagId: userTagPreferences.tagId,
        score: userTagPreferences.score,
      })
      .from(userTagPreferences)
      .where(eq(userTagPreferences.userId, userId))
      .orderBy(desc(userTagPreferences.score))
      .limit(20);

    if (userPrefs.length === 0) {
      // No preferences → fall back to latest public polls + petitions
      return this._getLatestPublicItems(limit, type);
    }

    const topTagIds = userPrefs.map((p) => p.tagId);
    const scoreMap = new Map(userPrefs.map((p) => [p.tagId, p.score]));

    // ── Polls matching user tags ──────────────────────────────────────────────
    const pollRows =
      type === "poll" || !type
        ? await db
            .select({
              pollId: polls.pollId,
              title: polls.title,
              slug: polls.slug,
              userId: polls.userId,
              tagId: pollTags.tagId,
              totalVotes: sql<number>`COUNT(DISTINCT ${pollVotes.pollVoteId})::int`,
            })
            .from(polls)
            .innerJoin(pollTags, eq(pollTags.pollId, polls.pollId))
            .innerJoin(pollQuestions, eq(pollQuestions.pollId, polls.pollId))
            .innerJoin(
              pollOptions,
              eq(pollOptions.questionId, pollQuestions.pollQuestionId),
            )
            .leftJoin(
              pollVotes,
              eq(pollVotes.optionId, pollOptions.pollOptionId),
            )
            .where(
              and(
                eq(polls.isPublic, true),
                eq(polls.isPublished, true),
                eq(polls.status, "active"),
                inArray(pollTags.tagId, topTagIds),
              ),
            )
            .groupBy(
              polls.pollId,
              polls.title,
              polls.slug,
              polls.userId,
              pollTags.tagId,
            )
            .limit(limit * 3)
        : [];

    // Aggregate polls — sum relevance scores across tags, deduplicate
    const pollMap = new Map<
      string,
      {
        pollId: string;
        title: string;
        slug: string;
        userId: string;
        tagIds: string[];
        relevanceScore: number;
        totalVotes: number;
      }
    >();
    for (const row of pollRows) {
      const score = scoreMap.get(row.tagId) ?? 0;
      const existing = pollMap.get(row.pollId);
      if (existing) {
        existing.relevanceScore += score;
        existing.tagIds.push(row.tagId);
      } else {
        pollMap.set(row.pollId, {
          pollId: row.pollId,
          title: row.title,
          slug: row.slug,
          userId: row.userId,
          tagIds: [row.tagId],
          relevanceScore: score,
          totalVotes: row.totalVotes,
        });
      }
    }

    // ── Petitions matching user tags ──────────────────────────────────────────
    const petitionRows =
      type === "petition" || !type
        ? await db
            .select({
              petitionId: petitions.petitionId,
              title: petitions.title,
              slug: petitions.slug,
              userId: petitions.userId,
              signaturesTarget: petitions.signaturesTarget,
              tagId: petitionTags.tagId,
              totalSignatures: sql<number>`COUNT(DISTINCT ${petitionSignatures.petitionSignatureId})::int`,
            })
            .from(petitions)
            .innerJoin(
              petitionTags,
              eq(petitionTags.petitionId, petitions.petitionId),
            )
            .leftJoin(
              petitionSignatures,
              eq(petitionSignatures.petitionId, petitions.petitionId),
            )
            .where(
              and(
                eq(petitions.isPublic, true),
                eq(petitions.isPublished, true),
                eq(petitions.status, "active"),
                inArray(petitionTags.tagId, topTagIds),
              ),
            )
            .groupBy(
              petitions.petitionId,
              petitions.title,
              petitions.slug,
              petitions.userId,
              petitions.signaturesTarget,
              petitionTags.tagId,
            )
            .limit(limit * 3)
        : [];

    const petitionMap = new Map<
      string,
      {
        petitionId: string;
        title: string;
        slug: string;
        userId: string;
        tagIds: string[];
        relevanceScore: number;
        totalSignatures: number;
        signaturesTarget: number;
      }
    >();
    for (const row of petitionRows) {
      const score = scoreMap.get(row.tagId) ?? 0;
      const existing = petitionMap.get(row.petitionId);
      if (existing) {
        existing.relevanceScore += score;
        existing.tagIds.push(row.tagId);
      } else {
        petitionMap.set(row.petitionId, {
          petitionId: row.petitionId,
          title: row.title,
          slug: row.slug,
          userId: row.userId,
          tagIds: [row.tagId],
          relevanceScore: score,
          totalSignatures: row.totalSignatures,
          signaturesTarget: row.signaturesTarget,
        });
      }
    }

    // Resolve usernames + tag text for all items
    const allUserIds = [
      ...new Set([
        ...Array.from(pollMap.values()).map((p) => p.userId),
        ...Array.from(petitionMap.values()).map((p) => p.userId),
      ]),
    ];
    const allTagIds = [...new Set([...topTagIds])];

    const [usersRows, tagsRows] = await Promise.all([
      allUserIds.length > 0
        ? db
            .select({ userId: users.userId, username: users.username })
            .from(users)
            .where(inArray(users.userId, allUserIds))
        : Promise.resolve([]),
      allTagIds.length > 0
        ? db
            .select({ tagId: tags.tagId, text: tags.text })
            .from(tags)
            .where(inArray(tags.tagId, allTagIds))
        : Promise.resolve([]),
    ]);

    const userMap = new Map(usersRows.map((u) => [u.userId, u.username]));
    const tagTextMap = new Map(tagsRows.map((t) => [t.tagId, t.text]));

    // Build unified + sorted array
    const items: ForYouResult["items"] = [];

    for (const p of pollMap.values()) {
      items.push({
        type: "poll",
        id: p.pollId,
        title: p.title,
        slug: p.slug,
        username: userMap.get(p.userId) ?? "",
        tags: p.tagIds.map((id) => tagTextMap.get(id) ?? "").filter(Boolean),
        relevanceScore: p.relevanceScore,
        totalVotes: p.totalVotes,
      });
    }

    for (const p of petitionMap.values()) {
      items.push({
        type: "petition",
        id: p.petitionId,
        title: p.title,
        slug: p.slug,
        username: userMap.get(p.userId) ?? "",
        tags: p.tagIds.map((id) => tagTextMap.get(id) ?? "").filter(Boolean),
        relevanceScore: p.relevanceScore,
        totalSignatures: p.totalSignatures,
        signaturesTarget: p.signaturesTarget,
      });
    }

    items.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return { items: items.slice(0, limit), isPersonalised: true };
  }

  // ─── For You (Paginated / Infinite Scroll) ────────────────────────────────────

  public async getForYouPage(
    userId: string | null,
    payload: GetForYouPageDtoType,
  ): Promise<ForYouPageResult> {
    const { limit, cursor, type } = getForYouPageDto.parse(payload);

    const baseResult = userId
      ? await this.getForYou(userId, { limit: limit + cursor, type })
      : await this._getLatestPublicItems(limit + cursor, type);

    const sliced = baseResult.items.slice(cursor, cursor + limit);
    const nextCursor = sliced.length === limit ? cursor + limit : null;

    return {
      items: sliced,
      nextCursor,
      isPersonalised: baseResult.isPersonalised,
    };
  }

  private async _getLatestPublicItems(
    limit: number,
    type?: "poll" | "petition",
  ): Promise<ForYouResult> {
    const [latestPolls, latestPetitions] = await Promise.all([
      type === "poll" || !type
        ? db
            .select({
              pollId: polls.pollId,
              title: polls.title,
              slug: polls.slug,
              userId: polls.userId,
            })
            .from(polls)
            .where(
              and(
                eq(polls.isPublic, true),
                eq(polls.isPublished, true),
                eq(polls.status, "active"),
              ),
            )
            .orderBy(desc(polls.createdAt))
            .limit(Math.ceil(limit / (type ? 1 : 2)))
        : Promise.resolve([]),
      type === "petition" || !type
        ? db
            .select({
              petitionId: petitions.petitionId,
              title: petitions.title,
              slug: petitions.slug,
              userId: petitions.userId,
              signaturesTarget: petitions.signaturesTarget,
            })
            .from(petitions)
            .where(
              and(
                eq(petitions.isPublic, true),
                eq(petitions.isPublished, true),
                eq(petitions.status, "active"),
              ),
            )
            .orderBy(desc(petitions.createdAt))
            .limit(Math.ceil(limit / (type ? 1 : 2)))
        : Promise.resolve([]),
    ]);

    const allUserIds = [
      ...new Set([
        ...latestPolls.map((p) => p.userId),
        ...latestPetitions.map((p) => p.userId),
      ]),
    ];
    const usersRows =
      allUserIds.length > 0
        ? await db
            .select({ userId: users.userId, username: users.username })
            .from(users)
            .where(inArray(users.userId, allUserIds))
        : [];
    const userMap = new Map(usersRows.map((u) => [u.userId, u.username]));

    const items: ForYouResult["items"] = [
      ...latestPolls.map((p) => ({
        type: "poll" as const,
        id: p.pollId,
        title: p.title,
        slug: p.slug,
        username: userMap.get(p.userId) ?? "",
        tags: [] as string[],
        relevanceScore: 0,
        totalVotes: 0,
      })),
      ...latestPetitions.map((p) => ({
        type: "petition" as const,
        id: p.petitionId,
        title: p.title,
        slug: p.slug,
        username: userMap.get(p.userId) ?? "",
        tags: [] as string[],
        relevanceScore: 0,
        totalSignatures: 0,
        signaturesTarget: p.signaturesTarget,
      })),
    ];

    return { items: items.slice(0, limit), isPersonalised: false };
  }

  // ─── Join Quiz by Code ────────────────────────────────────────────────────────

  public async joinQuizByCode(
    payload: JoinQuizByCodeDtoType,
  ): Promise<JoinQuizResult> {
    const { joinCode } = joinQuizByCodeDto.parse(payload);

    const [session] = await db
      .select({
        sessionId: QuizSessions.sessionId,
        status: QuizSessions.status,
        name: QuizSessions.name,
        joinCode: QuizSessions.joinCode,
        quizId: QuizSessions.quizId,
      })
      .from(QuizSessions)
      .where(eq(QuizSessions.joinCode, joinCode.toUpperCase()));

    if (!session) {
      throw new AppError("NOT_FOUND", "No session found with this join code");
    }

    const [quiz] = await db
      .select({ title: quizzes.title })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));

    const participantCountRows = await db
      .select({ participantCount: count() })
      .from(quizParticipants)
      .where(eq(quizParticipants.sessionId, session.sessionId));

    const participantCount = participantCountRows[0]?.participantCount ?? 0;

    return {
      sessionId: session.sessionId,
      status: session.status as "waiting" | "active" | "ended",
      quizTitle: quiz?.title ?? "Quiz",
      sessionName: session.name,
      joinCode: session.joinCode,
      participantCount,
    };
  }

  // ─── Search Quiz Session ──────────────────────────────────────────────────────

  public async searchQuizSession(
    payload: SearchQuizSessionDtoType,
  ): Promise<QuizSessionSearchItem[]> {
    const { query } = searchQuizSessionDto.parse(payload);

    const rows = await db
      .select({
        sessionId: QuizSessions.sessionId,
        status: QuizSessions.status,
        name: QuizSessions.name,
        joinCode: QuizSessions.joinCode,
        quizId: QuizSessions.quizId,
      })
      .from(QuizSessions)
      .where(
        and(
          eq(QuizSessions.joinCode, query.toUpperCase().trim()),
          or(
            eq(QuizSessions.status, "waiting"),
            eq(QuizSessions.status, "active"),
          ),
        ),
      )
      .orderBy(desc(QuizSessions.createdAt))
      .limit(10);

    if (rows.length === 0) return [];

    const quizIds = [...new Set(rows.map((r) => r.quizId))];
    const sessionIds = rows.map((r) => r.sessionId);

    const [quizRows, participantRows] = await Promise.all([
      quizIds.length > 0
        ? db
            .select({ quizId: quizzes.quizId, title: quizzes.title })
            .from(quizzes)
            .where(inArray(quizzes.quizId, quizIds))
        : Promise.resolve([]),
      sessionIds.length > 0
        ? db
            .select({ sessionId: quizParticipants.sessionId, cnt: count() })
            .from(quizParticipants)
            .where(inArray(quizParticipants.sessionId, sessionIds))
            .groupBy(quizParticipants.sessionId)
        : Promise.resolve([]),
    ]);

    const quizMap = new Map(quizRows.map((q) => [q.quizId, q.title]));
    const participantMap = new Map(
      participantRows.map((p) => [p.sessionId, p.cnt]),
    );

    return rows.map((r) => ({
      sessionId: r.sessionId,
      quizTitle: quizMap.get(r.quizId) ?? "Quiz",
      sessionName: r.name,
      joinCode: r.joinCode,
      status: r.status as "waiting" | "active" | "ended",
      participantCount: participantMap.get(r.sessionId) ?? 0,
    }));
  }
}

export default ExploreService;
