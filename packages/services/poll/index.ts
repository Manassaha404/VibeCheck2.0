import db, { eq, and } from "@repo/database";
import { polls } from "@repo/database/models/polls";
import { pollQuestions } from "@repo/database/models/poll-questions";
import { pollOptions } from "@repo/database/models/poll-options";
import { tags } from "@repo/database/models/tags";
import { pollTags } from "@repo/database/models/poll-tags";
import { AppError } from "@repo/error";
import { createPollDto, CreatePollDtoType, SavePollDraftDtoType, savePollDraftDto } from "./model";

class PollService {
  private toSlug(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  private async generateUniqueSlug(userId: string, title: string): Promise<string> {
    const baseSlug = this.toSlug(title);

    const [existing] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.userId, userId), eq(polls.slug, baseSlug)));

    if (!existing) {
      return baseSlug;
    }

    const salt = Math.random().toString(36).slice(2, 7);
    const saltedSlug = this.toSlug(`${title} ${salt}`);
    return saltedSlug;
  }

  public async createPoll(userId: string, payload: CreatePollDtoType) {
    const data = createPollDto.parse(payload);

    const slug = await this.generateUniqueSlug(userId, data.title);

    const [newPoll] = await db
      .insert(polls)
      .values({
        userId,
        title: data.title,
        description: data.description ?? null,
        slug,
        isPublic: data.isPublic,
        isCommentsAllowed: data.isCommentsAllowed,
        isMultipleOptionVoteAllowed: data.isMultipleOptionVoteAllowed,
        status: "draft",
        isPublished: false,
      })
      .returning();

    if (!newPoll) {
      throw new AppError("INTERNAL_SERVER_ERROR", "Failed to create poll");
    }

    return newPoll;
  }

  public async saveDraft(userId: string, pollId: string, payload: SavePollDraftDtoType) {
    const data = savePollDraftDto.parse(payload);

    return await db.transaction(async (tx) => {
      // Verify poll exists and belongs to user
      const [existingPoll] = await tx
        .select()
        .from(polls)
        .where(and(eq(polls.pollId, pollId), eq(polls.userId, userId)));

      if (!existingPoll) {
        throw new AppError("NOT_FOUND", "Poll not found");
      }

      // Update poll settings
      await tx
        .update(polls)
        .set({
          isPublic: data.isPublic ?? existingPoll.isPublic,
          isCommentsAllowed: data.isCommentsAllowed ?? existingPoll.isCommentsAllowed,
          isMultipleOptionVoteAllowed:
            data.isMultipleOptionVoteAllowed ?? existingPoll.isMultipleOptionVoteAllowed,
          isPublished: data.isPublished ?? existingPoll.isPublished,
          status: data.status ?? existingPoll.status,
        })
        .where(eq(polls.pollId, pollId));

      // Handle Question Upsert
      let questionId = data.question.id;
      if (questionId) {
        // Update existing question
        await tx
          .update(pollQuestions)
          .set({ text: data.question.text })
          .where(eq(pollQuestions.pollQuestionId, questionId));
      } else {
        // Find existing question if any
        const [existingQuestion] = await tx
          .select()
          .from(pollQuestions)
          .where(eq(pollQuestions.pollId, pollId));

        if (existingQuestion) {
          questionId = existingQuestion.pollQuestionId;
          await tx
            .update(pollQuestions)
            .set({ text: data.question.text })
            .where(eq(pollQuestions.pollQuestionId, questionId));
        } else {
          // Insert new question
          const [newQ] = await tx
            .insert(pollQuestions)
            .values({ pollId, text: data.question.text })
            .returning();
          questionId = newQ?.pollQuestionId;
        }
      }

      // Handle Options (Delete and reinsert for drafts to easily handle removed/reordered options)
      if (questionId) {
        await tx.delete(pollOptions).where(eq(pollOptions.questionId, questionId));
        
        if (data.question.options.length > 0) {
          await tx.insert(pollOptions).values(
            data.question.options.map((opt, i) => ({
              questionId: questionId as string,
              text: opt.text,
              orderIndex: opt.orderIndex ?? i,
            }))
          );
        }
      }

      return { success: true, pollId };
    });
  }

  public async setPollActive(userId: string, pollId: string) {
    const [existingPoll] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.pollId, pollId), eq(polls.userId, userId)));

    if (!existingPoll) {
      throw new AppError("NOT_FOUND", "Poll not found");
    }

    await db
      .update(polls)
      .set({ isPublished: true, status: "active" })
      .where(eq(polls.pollId, pollId));

    return { success: true };
  }

  public async getPollBySlug(userId: string, slug: string) {
    const [poll] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.slug, slug), eq(polls.userId, userId)));

    if (!poll) {
      throw new AppError("NOT_FOUND", "Poll not found");
    }

    const [question] = await db
      .select()
      .from(pollQuestions)
      .where(eq(pollQuestions.pollId, poll.pollId));

    let options: any[] = [];
    if (question) {
      options = await db
        .select()
        .from(pollOptions)
        .where(eq(pollOptions.questionId, question.pollQuestionId))
        .orderBy(pollOptions.orderIndex);
    }

    const pollTagsData = await db
      .select({ text: tags.text })
      .from(pollTags)
      .innerJoin(tags, eq(tags.tagId, pollTags.tagId))
      .where(eq(pollTags.pollId, poll.pollId));

    const tagsArray = pollTagsData.map((t) => t.text);

    return {
      poll,
      question,
      options,
      tags: tagsArray,
    };
  }
}

export default PollService;
