import db, { eq } from "@repo/database";
import redis from "../redis";
import { tags, pollTags, petitionTags } from "@repo/database/models";
const SCORE_FOR_CREATE_TAG = 1;
const SCORE_FOR_VIEW_POLLS = 2;
const SCORE_FOR_SUBMIT_POLL = 3;
const TAG_LEADERBOARD_KEY = "tag:leaderboard";

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





  static async addTagsToPolls(pollId: string, tagsArray: string[]) {
    // First delete existing associations
    await db.delete(pollTags).where(eq(pollTags.pollId, pollId));

    if (!tagsArray || tagsArray.length === 0)
      return { message: "Tags cleared" };

    const tagIds: string[] = [];

    for (const tagText of tagsArray) {
      const trimmedTag = tagText.trim();
      if (!trimmedTag) continue;

      // Ensure tag exists and update leaderboard
      await this.createNewTag(trimmedTag);

      // Fetch the tag to get its ID
      const [existingTag] = await db
        .select()
        .from(tags)
        .where(eq(tags.text, trimmedTag));
      if (existingTag) {
        tagIds.push(existingTag.tagId);
      }
    }

    // Insert into pollTags
    if (tagIds.length > 0) {
      await db.insert(pollTags).values(
        tagIds.map((tagId) => ({
          pollId,
          tagId,
        })),
      );
    }
    return { message: "Tags added to poll successfully" };
  }






  static async addTagsToPetitions(petitionId: string, tagsArray: string[]) {
    // First delete existing associations
    await db
      .delete(petitionTags)
      .where(eq(petitionTags.petitionId, petitionId));

    if (!tagsArray || tagsArray.length === 0)
      return { message: "Tags cleared" };

    const tagIds: string[] = [];

    for (const tagText of tagsArray) {
      const trimmedTag = tagText.trim();
      if (!trimmedTag) continue;

      // Ensure tag exists and update leaderboard
      await this.createNewTag(trimmedTag);

      // Fetch the tag to get its ID
      const [existingTag] = await db
        .select()
        .from(tags)
        .where(eq(tags.text, trimmedTag));
      if (existingTag) {
        tagIds.push(existingTag.tagId);
      }
    }

    // Insert into petitionTags
    if (tagIds.length > 0) {
      await db.insert(petitionTags).values(
        tagIds.map((tagId) => ({
          petitionId,
          tagId,
        })),
      );
    }
    return { message: "Tags added to petition successfully" };
  }




  static async incrementTagScoreForView(tag: string) {
    await redis.zincrby(TAG_LEADERBOARD_KEY, SCORE_FOR_VIEW_POLLS, tag);
  }
  static async incrementTagScoreForSubmitPoll(tag: string) {
    await redis.zincrby(TAG_LEADERBOARD_KEY, SCORE_FOR_SUBMIT_POLL, tag);
  }
}

export default TagService;
