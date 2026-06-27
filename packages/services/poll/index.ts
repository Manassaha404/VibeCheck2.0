import db, { eq, and, sql, count, desc, or } from "@repo/database";
import { inngest } from "../inngest/client";
import { polls } from "@repo/database/models/polls";
import { pollQuestions } from "@repo/database/models/poll-questions";
import { pollOptions } from "@repo/database/models/poll-options";
import { pollVotes } from "@repo/database/models/index";
import { pollComments } from "@repo/database/models/poll-comments";
import { pollViews } from "@repo/database/models/poll-views";
import { tags } from "@repo/database/models/tags";
import { pollTags } from "@repo/database/models/poll-tags";
import { users } from "@repo/database/models/users";
import { AppError } from "@repo/error";
import {
  createPollDto,
  CreatePollDtoType,
  SavePollDraftDtoType,
  savePollDraftDto,
  submitVoteDto,
  SubmitVoteDtoType,
  type PollAnalyticsResult,
} from "./model";

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

  private async generateUniqueSlug(
    userId: string,
    title: string,
  ): Promise<string> {
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

  public async saveDraft(
    userId: string,
    pollId: string,
    payload: SavePollDraftDtoType,
  ) {
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
          isCommentsAllowed:
            data.isCommentsAllowed ?? existingPoll.isCommentsAllowed,
          isMultipleOptionVoteAllowed:
            data.isMultipleOptionVoteAllowed ??
            existingPoll.isMultipleOptionVoteAllowed,
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
        await tx
          .delete(pollOptions)
          .where(eq(pollOptions.questionId, questionId));

        if (data.question.options.length > 0) {
          await tx.insert(pollOptions).values(
            data.question.options.map((opt, i) => ({
              questionId: questionId as string,
              text: opt.text,
              orderIndex: opt.orderIndex ?? i,
            })),
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

  public async getPublicPollBySlug(
    username: string,
    slug: string,
    userId: string | null = null,
    guestToken: string | null = null,
  ) {
    const [user] = await db
      .select({ userId: users.userId })
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new AppError("NOT_FOUND", "User not found");
    }

    const [poll] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.slug, slug), eq(polls.userId, user.userId)));

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

    // Check if user has already voted
    let userVoteId: string | null = null;
    if ((userId || guestToken) && question) {
      const conditions = [];
      if (userId) conditions.push(eq(pollVotes.userId, userId));
      if (guestToken) conditions.push(eq(pollVotes.guestToken, guestToken));

      const [existingVote] = await db
        .select({ optionId: pollVotes.optionId })
        .from(pollVotes)
        .where(
          and(
            eq(pollVotes.questionId, question.pollQuestionId),
            or(...conditions),
          ),
        )
        .limit(1);

      if (existingVote) {
        userVoteId = existingVote.optionId;
      }
    }

    let results = null;
    if (userVoteId) {
      results = await this.getPublicPollResultsBySlug(username, slug);
    }

    return {
      poll,
      question,
      options,
      tags: tagsArray,
      userVoteId,
      results,
    };
  }

  public async getPublicPollResultsBySlug(username: string, slug: string) {
    const [user] = await db
      .select({ userId: users.userId })
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new AppError("NOT_FOUND", "User not found");
    }

    const [poll] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.slug, slug), eq(polls.userId, user.userId)));

    if (!poll) {
      throw new AppError("NOT_FOUND", "Poll not found");
    }

    const [question] = await db
      .select()
      .from(pollQuestions)
      .where(eq(pollQuestions.pollId, poll.pollId));

    if (!question) {
      throw new AppError("NOT_FOUND", "Question not found");
    }

    const optionRows = await db
      .select({
        pollOptionId: pollOptions.pollOptionId,
        text: pollOptions.text,
        orderIndex: pollOptions.orderIndex,
        voteCount: count(pollVotes.pollVoteId),
      })
      .from(pollOptions)
      .leftJoin(pollVotes, eq(pollVotes.optionId, pollOptions.pollOptionId))
      .where(eq(pollOptions.questionId, question.pollQuestionId))
      .groupBy(pollOptions.pollOptionId)
      .orderBy(pollOptions.orderIndex);

    const totalVotes = optionRows.reduce((s, o) => s + Number(o.voteCount), 0);

    const options = optionRows.map((o) => ({
      pollOptionId: o.pollOptionId,
      text: o.text,
      votes: Number(o.voteCount),
      percentage:
        totalVotes > 0
          ? Math.round((Number(o.voteCount) / totalVotes) * 100)
          : 0,
    }));

    return options;
  }

  public async getPublicPollCommentsBySlug(username: string, slug: string) {
    const [user] = await db
      .select({ userId: users.userId })
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new AppError("NOT_FOUND", "User not found");
    }

    const [poll] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.slug, slug), eq(polls.userId, user.userId)));

    if (!poll) {
      throw new AppError("NOT_FOUND", "Poll not found");
    }

    const commentRows = await db
      .select({
        id: pollComments.pollCommentId,
        username: users.username,
        text: pollComments.text,
        createdAt: pollComments.createdAt,
      })
      .from(pollComments)
      .leftJoin(users, eq(users.userId, pollComments.userId))
      .where(eq(pollComments.pollId, poll.pollId))
      .orderBy(desc(pollComments.createdAt))
      .limit(50);

    const now = Date.now();
    const comments = commentRows.map((c) => {
      const diffMs = now - new Date(c.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60_000);
      const timeAgo =
        diffMins < 1
          ? "just now"
          : diffMins < 60
            ? `${diffMins}m ago`
            : diffMins < 1440
              ? `${Math.floor(diffMins / 60)}h ago`
              : `${Math.floor(diffMins / 1440)}d ago`;

      return {
        id: c.id,
        username: c.username ? `@${c.username}` : "Anonymous",
        text: c.text,
        timeAgo,
      };
    });

    return comments;
  }

  public async submitVote(
    userId: string | null,
    guestToken: string | null,
    payload: SubmitVoteDtoType,
  ) {
    const data = submitVoteDto.parse(payload);

    const [option] = await db
      .select()
      .from(pollOptions)
      .where(eq(pollOptions.pollOptionId, data.optionId));

    if (!option) {
      throw new AppError("NOT_FOUND", "Option not found");
    }

    await db.transaction(async (tx) => {
      // 1. Insert vote
      await tx.insert(pollVotes).values({
        questionId: option.questionId,
        optionId: data.optionId,
        userId: userId ?? null,
        guestToken: guestToken ?? null,
      });

      // 2. Insert comment if provided
      if (data.comment && data.comment.trim().length > 0) {
        await tx.insert(pollComments).values({
          pollId: data.pollId,
          userId: userId ?? null,
          guestToken: guestToken ?? null,
          text: data.comment.trim(),
        });
      }
      await inngest.send({
        name: "poll/submit",
        data: {
          pollId: data.pollId,
        },
      });
    });

    return { success: true };
  }

  public async getPollAnalytics(
    userId: string,
    slug: string,
  ): Promise<PollAnalyticsResult> {
    // ── 1. Fetch poll (must belong to calling user) ──────────────────────────
    const [poll] = await db
      .select({
        pollId: polls.pollId,
        slug: polls.slug,
        status: polls.status,
        createdAt: polls.createdAt,
        isCommentsAllowed: polls.isCommentsAllowed,
      })
      .from(polls)
      .where(and(eq(polls.slug, slug), eq(polls.userId, userId)));

    if (!poll) {
      throw new AppError("NOT_FOUND", "Poll not found");
    }

    // ── 2. Fetch author username ─────────────────────────────────────────────
    const [author] = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.userId, userId));

    // ── 3. Fetch question ────────────────────────────────────────────────────
    const [question] = await db
      .select()
      .from(pollQuestions)
      .where(eq(pollQuestions.pollId, poll.pollId));

    if (!question) {
      throw new AppError("NOT_FOUND", "Poll question not found");
    }

    // ── 4. Fetch options with vote counts via a single grouped query ─────────
    const optionRows = await db
      .select({
        pollOptionId: pollOptions.pollOptionId,
        text: pollOptions.text,
        orderIndex: pollOptions.orderIndex,
        voteCount: count(pollVotes.pollVoteId),
      })
      .from(pollOptions)
      .leftJoin(pollVotes, eq(pollVotes.optionId, pollOptions.pollOptionId))
      .where(eq(pollOptions.questionId, question.pollQuestionId))
      .groupBy(pollOptions.pollOptionId)
      .orderBy(pollOptions.orderIndex);

    const totalVotes = optionRows.reduce((s, o) => s + Number(o.voteCount), 0);

    const options = optionRows.map((o) => ({
      id: o.pollOptionId,
      text: o.text,
      votes: Number(o.voteCount),
      percentage:
        totalVotes > 0
          ? Math.round((Number(o.voteCount) / totalVotes) * 100)
          : 0,
    }));

    // ── 5. Top answer ────────────────────────────────────────────────────────
    const topOption = [...options].sort((a, b) => b.votes - a.votes)[0];
    const topAnswer = topOption?.text ?? "";

    // ── 6. Engagement rate = unique voters / total views (capped at 100) ─────
    const [viewsRow] = await db
      .select({ total: count(pollViews.pollViewId) })
      .from(pollViews)
      .where(eq(pollViews.pollId, poll.pollId));

    const totalViews = Number(viewsRow?.total ?? 0);
    const engagementRate =
      totalViews > 0
        ? Math.min(100, Math.round((totalVotes / totalViews) * 100))
        : 0;

    // ── 7. Recent comments (last 10) ─────────────────────────────────────────
    const commentRows = await db
      .select({
        pollCommentId: pollComments.pollCommentId,
        text: pollComments.text,
        createdAt: pollComments.createdAt,
        username: users.username,
      })
      .from(pollComments)
      .leftJoin(users, eq(users.userId, pollComments.userId))
      .where(eq(pollComments.pollId, poll.pollId))
      .orderBy(desc(pollComments.createdAt))
      .limit(10);

    const now = Date.now();
    const comments = commentRows.map((c) => {
      const diffMs = now - new Date(c.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60_000);
      const timeAgo =
        diffMins < 1
          ? "just now"
          : diffMins < 60
            ? `${diffMins}m ago`
            : `${Math.floor(diffMins / 60)}h ago`;

      return {
        id: c.pollCommentId,
        username: c.username ? `@${c.username}` : "Anonymous",
        text: c.text,
        timeAgo,
      };
    });

    // ── 8. Vote timeline — grouped into up to 8 equal buckets ────────────────
    const voteTimelineRows = await db
      .select({
        hour: sql<string>`date_trunc('hour', ${pollVotes.createdAt})`,
        voteCount: count(pollVotes.pollVoteId),
      })
      .from(pollVotes)
      .where(eq(pollVotes.questionId, question.pollQuestionId))
      .groupBy(sql`date_trunc('hour', ${pollVotes.createdAt})`)
      .orderBy(sql`date_trunc('hour', ${pollVotes.createdAt})`);

    let cumulative = 0;
    const voteTimeline = voteTimelineRows.map((r) => {
      const v = Number(r.voteCount);
      cumulative += v;
      const d = new Date(r.hour);
      const label = `${d.getHours()}:00`;
      return { time: label, votes: v, cumulative };
    });

    // ── 9. Demographic data (same as options, for the radar chart) ────────────
    const demographicData = options.map((o) => ({
      label: o.text.length > 20 ? o.text.slice(0, 20) + "…" : o.text,
      value: o.percentage,
    }));

    // ── 10. Started-at label ─────────────────────────────────────────────────
    const pollCreatedAt = new Date(poll.createdAt);
    const diffMins = Math.floor(
      (Date.now() - pollCreatedAt.getTime()) / 60_000,
    );
    const startedAt =
      diffMins < 1
        ? "just now"
        : diffMins < 60
          ? `${diffMins} mins ago`
          : diffMins < 1440
            ? `${Math.floor(diffMins / 60)} hrs ago`
            : `${Math.floor(diffMins / 1440)} days ago`;

    return {
      pollId: poll.pollId,
      slug: poll.slug,
      username: author?.username ?? userId,
      question: question.text,
      startedAt,
      isLive: poll.status === "active",
      totalVotes,
      totalViews,
      engagementRate,
      topAnswer,
      options,
      comments,
      voteTimeline,
      demographicData,
    };
  }
  public async newView(
    pollId: string,
    userId: string | null,
    guestToken: string | null,
  ) {
    await inngest.send({
      name: "poll/view",
      data: {
        pollId,
        userId,
        guestToken,
      },
    });
  }
}

export default PollService;
