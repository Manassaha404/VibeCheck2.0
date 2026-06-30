import db, { eq, sql, and, inArray } from "@repo/database";
import redis from "../redis";
import {
  tags,
  pollTags,
  petitionTags,
  userTagPreferences,
} from "@repo/database/models";
const SCORE_FOR_CREATE_TAG = 1;
const SCORE_FOR_VIEW = 2;
const SCORE_FOR_SUBMIT = 3;
const TAG_LEADERBOARD_KEY = "tag:leaderboard";
const INCREMENT_SCORE_USER_TAG_PREFERENCE_FOR_VIEW = 2;
const INCREMENT_SCORE_USER_TAG_PREFERENCE_FOR_SUBMIT = 3;
type UserTaskForIncrementTagPreferenceScoreEnum = "view" | "submit";
class TagService {
  public async getTopTags() {
    const data = await redis.zrange(TAG_LEADERBOARD_KEY, 0, 1000);
    return { data };
  }
  static async createNewTag(tag: string) {
    const existingScore = await redis.zscore(TAG_LEADERBOARD_KEY, tag);
    if (existingScore === null) {
      await redis.zadd(TAG_LEADERBOARD_KEY, SCORE_FOR_CREATE_TAG, tag);
      await db
        .insert(tags)
        .values({
          text: tag.trim(),
        })
        .onConflictDoNothing();
    } else {
      await redis.zincrby(TAG_LEADERBOARD_KEY, 1, tag);
    }
    return { message: "create new tag successfully" };
  }

  static async syncPollTags(pollId: string, tagsArray: string[]) {
    const existingPollTags = await db
      .select({ text: tags.text, tagId: pollTags.tagId })
      .from(pollTags)
      .innerJoin(tags, eq(tags.tagId, pollTags.tagId))
      .where(eq(pollTags.pollId, pollId));

    const existingTagTexts = existingPollTags.map((t) => t.text);

    const requestedTags = Array.from(
      new Set(
        (tagsArray || [])
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      )
    );

    const tagsToAdd = requestedTags.filter((t) => !existingTagTexts.includes(t));
    const tagsToRemove = existingPollTags.filter(
      (t) => !requestedTags.includes(t.text)
    );

    if (tagsToRemove.length > 0) {
      const idsToRemove = tagsToRemove.map((t) => t.tagId);
      await db.delete(pollTags).where(
        and(
          eq(pollTags.pollId, pollId),
          inArray(pollTags.tagId, idsToRemove)
        )
      );
    }

    if (tagsToAdd.length > 0) {
      const newTagIds: string[] = [];
      for (const tagText of tagsToAdd) {
        await this.createNewTag(tagText);
        const [existingTag] = await db
          .select()
          .from(tags)
          .where(eq(tags.text, tagText));
        if (existingTag) {
          newTagIds.push(existingTag.tagId);
        }
      }

      if (newTagIds.length > 0) {
        const uniqueTagIds = Array.from(new Set(newTagIds));
        await db.insert(pollTags).values(
          uniqueTagIds.map((tagId) => ({ pollId, tagId }))
        );
      }
    }
  }

  static async syncPetitionTags(petitionId: string, tagsArray: string[]) {
    const existingPetitionTags = await db
      .select({ text: tags.text, tagId: petitionTags.tagId })
      .from(petitionTags)
      .innerJoin(tags, eq(tags.tagId, petitionTags.tagId))
      .where(eq(petitionTags.petitionId, petitionId));

    const existingTagTexts = existingPetitionTags.map((t) => t.text);

    const requestedTags = Array.from(
      new Set(
        (tagsArray || [])
          .map((t) => t.trim())
          .filter((t) => t.length > 0)
      )
    );

    const tagsToAdd = requestedTags.filter((t) => !existingTagTexts.includes(t));
    const tagsToRemove = existingPetitionTags.filter(
      (t) => !requestedTags.includes(t.text)
    );

    if (tagsToRemove.length > 0) {
      const idsToRemove = tagsToRemove.map((t) => t.tagId);
      await db.delete(petitionTags).where(
        and(
          eq(petitionTags.petitionId, petitionId),
          inArray(petitionTags.tagId, idsToRemove)
        )
      );
    }

    if (tagsToAdd.length > 0) {
      const newTagIds: string[] = [];
      for (const tagText of tagsToAdd) {
        await this.createNewTag(tagText);
        const [existingTag] = await db
          .select()
          .from(tags)
          .where(eq(tags.text, tagText));
        if (existingTag) {
          newTagIds.push(existingTag.tagId);
        }
      }

      if (newTagIds.length > 0) {
        const uniqueTagIds = Array.from(new Set(newTagIds));
        await db.insert(petitionTags).values(
          uniqueTagIds.map((tagId) => ({ petitionId, tagId }))
        );
      }
    }
  }

  static async incrementTagScoreForView(tag: string) {
    await redis.zincrby(TAG_LEADERBOARD_KEY, SCORE_FOR_VIEW, tag);
  }
  static async incrementTagScoreForSubmit(tag: string) {
    await redis.zincrby(TAG_LEADERBOARD_KEY, SCORE_FOR_SUBMIT, tag);
  }

  static async incrementUserTagPreference(
    userId: string,
    tagsIdArray: string[],
    task: UserTaskForIncrementTagPreferenceScoreEnum,
  ) {
    if (!tagsIdArray || tagsIdArray.length === 0) return;

    const validTagIds = tagsIdArray.filter((id) => id && id.trim().length > 0);
    const incrementScore =
      task === "view"
        ? INCREMENT_SCORE_USER_TAG_PREFERENCE_FOR_VIEW
        : INCREMENT_SCORE_USER_TAG_PREFERENCE_FOR_SUBMIT;
    if (validTagIds.length > 0) {
      await db
        .insert(userTagPreferences)
        .values(
          validTagIds.map((tagId) => ({
            userId,
            tagId,
            score: incrementScore,
          })),
        )
        .onConflictDoUpdate({
          target: [userTagPreferences.userId, userTagPreferences.tagId],
          set: {
            score: sql`${userTagPreferences.score} + ${incrementScore}`,
          },
        });
    }
  }
}

export default TagService;
