import db, { eq, desc, inArray } from "@repo/database";
import { quizzes } from "@repo/database/models/quizzes";
import { quizQuestions } from "@repo/database/models/quiz-questions";
import { QuizSessions } from "@repo/database/models/quiz-sessions";
import { quizParticipants } from "@repo/database/models/quiz-participants";
import {
  sessionResults,
  LeaderboardEntry,
  QuestionStat,
} from "@repo/database/models/quiz-sessions-result";
import { users } from "@repo/database/models/users";
import { AppError } from "@repo/error";
import {
  createQuizDto,
  CreateQuizInput,
  updateQuizDto,
  UpdateQuizInput,
  initDraftQuizDto,
  InitDraftQuizInput,
  publishDraftQuizDto,
  PublishDraftQuizInput,
  archiveItemDto,
  ArchiveItemDtoType,
  activateItemDto,
  ActivateItemDtoType,
  deleteItemDto,
  DeleteItemDtoType,
  makeQuizSessionDto,
  MakeQuizSessionDtoType,
  getSessionAnalyticsDto,
  GetSessionAnalyticsDtoType,
  getSessionForHostDto,
  GetSessionForHostDtoType,
  emitQuestionDto,
  EmitQuestionDtoType,
  manuallyActivateSessionDto,
  ManuallyActivateSessionDtoType,
  endSessionDto,
  EndSessionDtoType,
  getSessionInfoForParticipantDto,
  GetSessionInfoForParticipantDtoType,
  verifySessionPasswordDto,
  VerifySessionPasswordDtoType,
  getLeaderboardForSessionDto,
  GetLeaderboardForSessionDtoType,
  addBonusPointsDto,
  AddBonusPointsDtoType,
  recordAnswerDto,
  RecordAnswerDtoType,
  getQuizDashboardDto,
  GetQuizDashboardDtoType,
  getQuizForEditDto,
  GetQuizForEditDtoType,
} from "./model";
import { customAlphabet } from "nanoid";
import redis from "../redis";
import { inactivityQueue, autoActiveQueue } from "./queue";

// ── Redis key helpers ────────────────────────────────────────────────────────
// Inactivity tracking key  → quiz:session:inactivity:{sessionId}
// Live session state key   → quiz:session:live:{sessionId}
// Auto-active job id key   → quiz:session:auto-active-job:{sessionId}
// Leaderboard key          → quiz:session:leaderboard:{sessionId}

// Live session state shape stored in Redis while session is active
export interface LiveSessionRedisState {
  currentQuestionIndex: number;
  voteTallies: Record<string, Record<string, number>>; // questionId → optionId → count
}
class QuizService {
  private redisSessionInactivityKey(sessionId: string) {
    return `quiz:session:inactivity:${sessionId}`;
  }
  private redisLiveSessionKey(sessionId: string) {
    return `quiz:session:live:${sessionId}`;
  }
  private redisAutoActiveJobKey(sessionId: string) {
    return `quiz:session:auto-active-job:${sessionId}`;
  }
  private async updateSessionActivity(sessionId: string) {
    const redisKey = this.redisSessionInactivityKey(sessionId);
    await redis.set(
      redisKey,
      JSON.stringify({
        lastCreaTorActivity: new Date().toISOString(),
      }),
    );
  }
  private redisLeaderboardKey(sessionId: string) {
    return `quiz:session:leaderboard:${sessionId}`;
  }

  private async finalizeSessionData(sessionId: string, quizId: string) {
    const liveKey = this.redisLiveSessionKey(sessionId);
    const leaderboardKey = this.redisLeaderboardKey(sessionId);

    const rawLiveState = await redis.get(liveKey);
    const liveState: LiveSessionRedisState | null = rawLiveState
      ? JSON.parse(rawLiveState)
      : null;

    const participantsWithScores = await redis.zrange(
      leaderboardKey,
      0,
      -1,
      "REV",
      "WITHSCORES",
    );
    const userScores: { userId: string; score: number }[] = [];
    for (let i = 0; i < participantsWithScores.length; i += 2) {
      const userId = participantsWithScores[i];
      const scoreStr = participantsWithScores[i + 1];
      if (userId === undefined || scoreStr === undefined) continue;

      userScores.push({
        userId,
        score: parseFloat(scoreStr),
      });
    }

    const totalParticipants = userScores.length;
    let avgScore = 0;
    if (totalParticipants > 0) {
      avgScore = Math.round(
        userScores.reduce((sum, p) => sum + p.score, 0) / totalParticipants,
      );
    }

    let finalLeaderboard: LeaderboardEntry[] = [];
    if (userScores.length > 0) {
      const userIds = userScores.map((p) => p.userId);
      const fetchedUsers = await db
        .select({
          userId: users.userId,
          username: users.username,
          firstName: users.firstName,
        })
        .from(users)
        .where(inArray(users.userId, userIds));

      const userMap = new Map(fetchedUsers.map((u) => [u.userId, u]));

      const dbParticipants = userScores.map((p) => ({
        sessionId,
        userId: p.userId,
        score: p.score,
        correctCount: 0,
      }));

      const inserted = await db
        .insert(quizParticipants)
        .values(dbParticipants)
        .returning({
          participantId: quizParticipants.participantId,
          userId: quizParticipants.userId,
        });

      const participantIdMap = new Map(
        inserted.map((i) => [i.userId, i.participantId]),
      );

      finalLeaderboard = userScores.map((p, index) => {
        const user = userMap.get(p.userId);
        return {
          participantId: participantIdMap.get(p.userId) ?? p.userId,
          username: user?.username || user?.firstName || "Guest",
          totalScore: p.score,
          rank: index + 1,
          correctCount: 0,
        };
      });
    }

    let questionStats: QuestionStat[] = [];
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.orderIndex);

    if (liveState && liveState.voteTallies) {
      questionStats = questions.map((q) => {
        const tallies = liveState.voteTallies[q.questionId] || {};
        let correctVotes = 0;
        let totalVotes = 0;
        const distribution: number[] = [];
        const options = (q.options ?? []) as {
          id: string;
          isCorrect: boolean;
        }[];

        options.forEach((opt) => {
          const count = tallies[opt.id] || 0;
          distribution.push(count);
          totalVotes += count;
          if (opt.isCorrect) {
            correctVotes += count;
          }
        });

        const correctRate = totalVotes > 0 ? correctVotes / totalVotes : 0;
        return {
          questionId: q.questionId,
          orderIndex: q.orderIndex,
          distribution,
          correctRate,
        };
      });
    } else {
      questionStats = questions.map((q) => ({
        questionId: q.questionId,
        orderIndex: q.orderIndex,
        distribution: ((q.options as any[]) ?? []).map(() => 0),
        correctRate: 0,
      }));
    }

    await db.insert(sessionResults).values({
      sessionId,
      finalLeaderboard,
      questionStats,
      totalParticipants,
      avgScore,
    });

    // Clear Redis live state and leaderboard after successful persistence
    await redis.del(liveKey);
    await redis.del(leaderboardKey);
  }

  public async initDraftQuiz(userId: string, payload: InitDraftQuizInput) {
    const data = initDraftQuizDto.parse(payload);
    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        userId,
        title: data.info.title,
        description: data.info.description ?? null,
        status: "draft",
      })
      .returning();

    if (!newQuiz) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Failed to initialise quiz draft",
      );
    }
    return {
      success: true,
      quizId: newQuiz.quizId,
    };
  }

  public async publishDraftQuiz(
    userId: string,
    payload: PublishDraftQuizInput,
  ) {
    const data = publishDraftQuizDto.parse(payload);

    return await db.transaction(async (tx) => {
      // 1. Verify the draft exists and belongs to this user
      const [existingQuiz] = await tx
        .select()
        .from(quizzes)
        .where(eq(quizzes.quizId, data.quizId));

      if (!existingQuiz) {
        throw new AppError("NOT_FOUND", "Quiz draft not found");
      }
      if (existingQuiz.userId !== userId) {
        throw new AppError("UNAUTHORIZED", "Unauthorized to publish this quiz");
      }

      // 2. Insert questions
      const questionsToInsert = data.questions.map((q, index) => ({
        quizId: data.quizId,
        orderIndex: index,
        text: q.text,
        options: q.options,
        acceptedAnswers: q.acceptedAnswers ?? null,
        isTextAnswer: q.type === "text_entry",
        allowMultipleCorrect: q.allowMultipleCorrect,
        mediaUrl: q.mediaUrl ?? null,
        timeLimitSecs: q.timeLimit,
        points: q.points,
      }));

      await tx.insert(quizQuestions).values(questionsToInsert);

      // 3. Save global settings + set status to active in one update.
      // Previously only { status: "active" } was set, so isBonusPointsEnabled,
      // passwordNeeded and password were never persisted from the draft flow.
      await tx
        .update(quizzes)
        .set({
          status: "active",
          isBonusPointsEnabled: data.globalSettings.isBonusPointsEnabled,
          passwordNeeded: data.globalSettings.passwordProtect,
          password: data.globalSettings.passwordProtect
            ? (data.globalSettings.password ?? null)
            : null,
        })
        .where(eq(quizzes.quizId, data.quizId));

      return {
        success: true,
        quizId: data.quizId,
      };
    });
  }


  public async createQuiz(userId: string, payload: CreateQuizInput) {
    const data = createQuizDto.parse(payload);

    return await db.transaction(async (tx) => {
      // 1. Insert the main quiz record
      const [newQuiz] = await tx
        .insert(quizzes)
        .values({
          userId,
          title: data.info.title,
          description: data.info.description ?? null,
          status: "active",
          passwordNeeded: data.globalSettings.passwordProtect,
          password: data.globalSettings.passwordProtect
            ? data.globalSettings.password
            : null,
          isBonusPointsEnabled: data.globalSettings.isBonusPointsEnabled,
        })
        .returning();

      if (!newQuiz) {
        throw new AppError("INTERNAL_SERVER_ERROR", "Failed to create quiz");
      }

      // 2. Insert all questions
      if (data.questions.length > 0) {
        const questionsToInsert = data.questions.map((q, index) => ({
          quizId: newQuiz.quizId,
          orderIndex: index,
          text: q.text,
          options: q.options,
          acceptedAnswers: q.acceptedAnswers ?? null,
          isTextAnswer: q.type === "text_entry",
          allowMultipleCorrect: q.allowMultipleCorrect,
          mediaUrl: q.mediaUrl ?? null,
          timeLimitSecs: q.timeLimit,
          points: q.points,
        }));

        await tx.insert(quizQuestions).values(questionsToInsert);
      }

      return {
        success: true,
        quizId: newQuiz.quizId,
      };
    });
  }

  public async getQuizForEdit(payload: GetQuizForEditDtoType) {
    const data = getQuizForEditDto.parse(payload);
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quizId, data.quizId));
    if (!quiz) {
      throw new AppError("NOT_FOUND", "Quiz not found");
    }

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, data.quizId))
      .orderBy(quizQuestions.orderIndex);

    return {
      quiz,
      questions,
    };
  }

  public async updateQuiz(userId: string, payload: UpdateQuizInput) {
    const data = updateQuizDto.parse(payload);

    return await db.transaction(async (tx) => {
      // 1. Verify and update the main quiz record
      const [existingQuiz] = await tx
        .select()
        .from(quizzes)
        .where(eq(quizzes.quizId, data.quizId));
      if (!existingQuiz) {
        throw new AppError("NOT_FOUND", "Quiz not found");
      }
      if (existingQuiz.userId !== userId) {
        throw new AppError("UNAUTHORIZED", "Unauthorized to update this quiz");
      }

      await tx
        .update(quizzes)
        .set({
          title: data.info.title,
          description: data.info.description ?? null,
          passwordNeeded: data.globalSettings.passwordProtect,
          password: data.globalSettings.passwordProtect
            ? data.globalSettings.password
            : null,
          isBonusPointsEnabled: data.globalSettings.isBonusPointsEnabled,
        })
        .where(eq(quizzes.quizId, data.quizId));

      // 2. Delete old questions
      await tx
        .delete(quizQuestions)
        .where(eq(quizQuestions.quizId, data.quizId));

      // 3. Insert new questions
      if (data.questions.length > 0) {
        const questionsToInsert = data.questions.map((q, index) => ({
          quizId: data.quizId,
          orderIndex: index,
          text: q.text,
          options: q.options,
          acceptedAnswers: q.acceptedAnswers ?? null,
          isTextAnswer: q.type === "text_entry",
          allowMultipleCorrect: q.allowMultipleCorrect,
          mediaUrl: q.mediaUrl ?? null,
          timeLimitSecs: q.timeLimit,
          points: q.points,
        }));

        await tx.insert(quizQuestions).values(questionsToInsert);
      }

      return {
        success: true,
        quizId: data.quizId,
      };
    });
  }

  public async getQuizDashboard(payload: GetQuizDashboardDtoType) {
    const data = getQuizDashboardDto.parse(payload);

    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quizId, data.quizId));
    if (!quiz) {
      throw new AppError("NOT_FOUND", "Quiz not found");
    }

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, data.quizId));
    const totalQuestions = questions.length;
    const totalTimeLimitSecs = questions.reduce(
      (sum, q) => sum + q.timeLimitSecs,
      0,
    );

    let sessions: any[] = [];
    try {
      sessions = await db
        .select()
        .from(QuizSessions)
        .where(eq(QuizSessions.quizId, data.quizId))
        .orderBy(desc(QuizSessions.createdAt));
    } catch (err: any) {
      console.error("QuizSessions Query Error:", err);
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        `QuizSessions query failed: ${err.message}`,
      );
    }

    let totalParticipants = 0;
    let leaderboardRaw: any[] = [];
    const previousSessions: any[] = [];

    const sessionIds = sessions.map((s) => s.sessionId);

    if (sessionIds.length > 0) {
      let participants: any[] = [];
      try {
        participants = await db
          .select({
            participantId: quizParticipants.participantId,
            score: quizParticipants.score,
            correctCount: quizParticipants.correctCount,
            sessionId: quizParticipants.sessionId,
            userId: quizParticipants.userId,
            firstName: users.firstName,
            lastName: users.lastName,
            username: users.username,
          })
          .from(quizParticipants)
          .leftJoin(users, eq(quizParticipants.userId, users.userId))
          .where(inArray(quizParticipants.sessionId, sessionIds));
      } catch (err) {
        console.error("!!! DB QUERY ERROR !!!", err);
        throw err;
      }

      totalParticipants = participants.length;

      const uniqueParticipantsMap = new Map();

      for (const p of participants) {
        const key = p.userId || p.participantId;
        const displayName =
          p.username ||
          (p.firstName ? `${p.firstName} ${p.lastName}` : "Guest");

        if (
          !uniqueParticipantsMap.has(key) ||
          uniqueParticipantsMap.get(key).score < p.score
        ) {
          uniqueParticipantsMap.set(key, {
            id: key,
            name: displayName,
            score: p.score,
            correctCount: p.correctCount,
          });
        }
      }

      leaderboardRaw = Array.from(uniqueParticipantsMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }

    // Include all sessions
    for (const s of sessions) {
      previousSessions.push({
        sessionId: s.sessionId,
        name: s.name,
        date: s.createdAt,
        status: s.status,
      });
    }

    return {
      quiz,
      stats: {
        totalQuestions,
        totalTimeLimitSecs,
        totalParticipants,
      },
      previousSessions,
      leaderboard: leaderboardRaw,
    };
  }

  public async getDashboard(userId: string) {
    const userQuizzes = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.userId, userId))
      .orderBy(desc(quizzes.createdAt));

    const total = userQuizzes.length;
    let quizParticipantCounts: Record<string, number> = {};

    if (total > 0) {
      const quizIds = userQuizzes.map((q) => q.quizId);

      const sessionRecords = await db
        .select({
          quizId: QuizSessions.quizId,
          sessionId: QuizSessions.sessionId,
        })
        .from(QuizSessions)
        .where(inArray(QuizSessions.quizId, quizIds));

      const sessionIds = sessionRecords.map((s) => s.sessionId);

      if (sessionIds.length > 0) {
        const participants = await db
          .select({
            sessionId: quizParticipants.sessionId,
          })
          .from(quizParticipants)
          .where(inArray(quizParticipants.sessionId, sessionIds));

        const sessionParticipantCounts = participants.reduce(
          (acc, p) => {
            acc[p.sessionId] = (acc[p.sessionId] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        sessionRecords.forEach((s) => {
          quizParticipantCounts[s.quizId] =
            (quizParticipantCounts[s.quizId] || 0) +
            (sessionParticipantCounts[s.sessionId] || 0);
        });
      }
    }

    const quizzesData = userQuizzes.map((q) => ({
      quizId: q.quizId,
      title: q.title,
      description: q.description ?? "",
      slug: q.quizId,
      status: q.status,
      createdAt: q.createdAt,
      totalParticipants: quizParticipantCounts[q.quizId] || 0,
    }));

    return {
      quizzes: quizzesData,
      total,
    };
  }
  public async archiveItem(userId: string, payload: ArchiveItemDtoType) {
    const data = archiveItemDto.parse(payload);
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quizId, data.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId)
      throw new AppError("UNAUTHORIZED", "Unauthorized to archive this quiz");

    await db
      .update(quizzes)
      .set({ status: "archived" })
      .where(eq(quizzes.quizId, data.quizId));
    return { success: true };
  }

  public async activateItem(userId: string, payload: ActivateItemDtoType) {
    const data = activateItemDto.parse(payload);
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quizId, data.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId)
      throw new AppError("UNAUTHORIZED", "Unauthorized to activate this quiz");

    await db
      .update(quizzes)
      .set({ status: "active" })
      .where(eq(quizzes.quizId, data.quizId));
    return { success: true };
  }

  public async deleteItem(userId: string, payload: DeleteItemDtoType) {
    const data = deleteItemDto.parse(payload);
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quizId, data.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId)
      throw new AppError("UNAUTHORIZED", "Unauthorized to delete this quiz");

    await db.delete(quizzes).where(eq(quizzes.quizId, data.quizId));
    return { success: true };
  }

  public async makeQuizSession(
    userId: string,
    payload: MakeQuizSessionDtoType,
  ) {
    const data = makeQuizSessionDto.parse(payload);
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quizId, data.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId)
      throw new AppError(
        "UNAUTHORIZED",
        "Unauthorized to create session for this quiz",
      );
    const joinCode = customAlphabet(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      8,
    )();
    // Always start in "waiting" — auto-activates after 30 min via autoActiveQueue
    const [newSession] = await db
      .insert(QuizSessions)
      .values({
        quizId: data.quizId,
        name: data.sessionName,
        joinCode,
        status: "waiting",
      })
      .returning();
    if (!newSession)
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Failed to create quiz session",
      );
    const sessionKey = this.redisSessionInactivityKey(newSession.sessionId);
    await redis.set(
      sessionKey,
      JSON.stringify({
        lastCreaTorActivity: new Date().toISOString(),
      }),
    );
    // Schedule inactivity cleanup after 1 hour
    await inactivityQueue.add(
      "check-inactivity",
      { sessionId: newSession.sessionId },
      { delay: 60 * 60 * 1000 },
    );
    // Schedule auto-activation after 30 minutes
    const autoActiveJob = await autoActiveQueue.add(
      "auto-activate",
      { sessionId: newSession.sessionId },
      { delay: 30 * 60 * 1000 },
    );
    // Store the auto-active job ID in Redis so we can cancel it on manual activation
    await redis.set(
      this.redisAutoActiveJobKey(newSession.sessionId),
      autoActiveJob.id ?? "",
    );
    return { success: true, sessionId: newSession.sessionId, joinCode };
  }
  public async endQuizSessionForInactivity(sessionId: string) {
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Quiz session not found");
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    await db
      .update(QuizSessions)
      .set({ status: "ended", endedAt: new Date() })
      .where(eq(QuizSessions.sessionId, sessionId));

    try {
      await this.finalizeSessionData(sessionId, session.quizId);
    } catch (err) {
      console.error("Failed to finalize session data:", err);
    }

    const redisKey = this.redisSessionInactivityKey(sessionId);
    await redis.del(redisKey);
    return { success: true };
  }

  public async getSessionAnalytics(payload: GetSessionAnalyticsDtoType) {
    const data = getSessionAnalyticsDto.parse(payload);
    // 1. Fetch session
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    // 2. Fetch quiz title
    const [quiz] = await db
      .select({
        title: quizzes.title,
        quizId: quizzes.quizId,
        userId: quizzes.userId,
      })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");

    // 3. Fetch pre-computed session results (leaderboard + question stats)
    const [result] = await db
      .select()
      .from(sessionResults)
      .where(eq(sessionResults.sessionId, data.sessionId));

    // 4. Fetch quiz questions for titles (to enrich questionStats)
    const questions = await db
      .select({
        questionId: quizQuestions.questionId,
        orderIndex: quizQuestions.orderIndex,
        text: quizQuestions.text,
        isTextAnswer: quizQuestions.isTextAnswer,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, session.quizId))
      .orderBy(quizQuestions.orderIndex);

    // 5. Fetch participants with user info for live/fallback leaderboard
    const participants = await db
      .select({
        participantId: quizParticipants.participantId,
        score: quizParticipants.score,
        correctCount: quizParticipants.correctCount,
        userId: quizParticipants.userId,
        firstName: users.firstName,
        lastName: users.lastName,
        username: users.username,
      })
      .from(quizParticipants)
      .leftJoin(users, eq(quizParticipants.userId, users.userId))
      .where(eq(quizParticipants.sessionId, data.sessionId));

    const totalParticipants = participants.length;
    const avgScore =
      totalParticipants > 0
        ? Math.round(
            participants.reduce((sum, p) => sum + p.score, 0) /
              totalParticipants,
          )
        : 0;

    // Build leaderboard — prefer stored result, fallback to live participants
    let leaderboard: {
      rank: number;
      name: string;
      username: string;
      score: number;
      avatar: string;
    }[] = [];

    if (result?.finalLeaderboard && result.finalLeaderboard.length > 0) {
      leaderboard = result.finalLeaderboard.map((entry) => ({
        rank: entry.rank,
        name: entry.username ?? "Guest",
        username: entry.username
          ? `@${entry.username}`
          : `#${entry.participantId.slice(0, 6)}`,
        score: entry.totalScore,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(entry.username ?? entry.participantId)}`,
      }));
    } else {
      leaderboard = participants
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((p, i) => {
          const displayName =
            p.username ||
            (p.firstName
              ? `${p.firstName} ${p.lastName ?? ""}`.trim()
              : "Guest");
          return {
            rank: i + 1,
            name: displayName,
            username: p.username
              ? `@${p.username}`
              : `#${p.participantId.slice(0, 6)}`,
            score: p.score,
            avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
          };
        });
    }

    // Build question insights — enrich questionStats with question text
    type InsightStatus = "High Pass" | "Pass" | "Warning" | "Fail";
    const getStatus = (rate: number): InsightStatus => {
      if (rate >= 85) return "High Pass";
      if (rate >= 65) return "Pass";
      if (rate >= 45) return "Warning";
      return "Fail";
    };

    const questionInsights =
      result?.questionStats && result.questionStats.length > 0
        ? result.questionStats.map((stat) => {
            const question = questions.find(
              (q) => q.questionId === stat.questionId,
            );
            const percentage = Math.round(stat.correctRate * 100);
            return {
              id: stat.questionId,
              title: question?.text ?? `Question ${stat.orderIndex + 1}`,
              status: getStatus(percentage) as InsightStatus,
              percentage,
              isTextAnswer: question?.isTextAnswer ?? false,
            };
          })
        : questions.map((q) => ({
            id: q.questionId,
            title: q.text,
            status: "Pass" as InsightStatus,
            percentage: 0,
            isTextAnswer: q.isTextAnswer,
          }));

    return {
      session: {
        sessionId: session.sessionId,
        name: session.name,
        date: session.createdAt,
        status: session.status,
      },
      quiz: {
        quizId: quiz.quizId,
        title: quiz.title,
        userId: quiz.userId,
      },
      stats: {
        averageScore: result?.avgScore ?? avgScore,
        totalParticipants: result?.totalParticipants ?? totalParticipants,
      },
      leaderboard,
      questionInsights,
    };
  }
  public async makeSessionActive({ sessionId }: { sessionId: string }) {
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Quiz session not found");
    await db
      .update(QuizSessions)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(QuizSessions.sessionId, sessionId));
    await this.updateSessionActivity(sessionId);
    // Init live state in Redis
    const liveKey = this.redisLiveSessionKey(sessionId);
    const liveState: LiveSessionRedisState = {
      currentQuestionIndex: -1,
      voteTallies: {},
    };
    await redis.set(liveKey, JSON.stringify(liveState));
    return { success: true };
  }

  public async getSessionForHost(payload: GetSessionForHostDtoType) {
    const data = getSessionForHostDto.parse(payload);
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    const [quiz] = await db
      .select({
        quizId: quizzes.quizId,
        title: quizzes.title,
        description: quizzes.description,
        userId: quizzes.userId,
      })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, session.quizId))
      .orderBy(quizQuestions.orderIndex);

    // Read live state from Redis (only populated when active)
    let liveState: LiveSessionRedisState | null = null;
    if (session.status === "active") {
      const raw = await redis.get(this.redisLiveSessionKey(data.sessionId));
      if (raw) liveState = JSON.parse(raw) as LiveSessionRedisState;
    }

    // Compute waiting-stage countdown info
    const AUTO_ACTIVE_DELAY_MS = 30 * 60 * 1000;
    const autoActivatesAt = new Date(
      session.createdAt.getTime() + AUTO_ACTIVE_DELAY_MS,
    );
    const participantCount = await redis.zcard(
      this.redisLeaderboardKey(data.sessionId),
    );

    return {
      session: {
        sessionId: session.sessionId,
        name: session.name,
        status: session.status,
        joinCode: session.joinCode,
        createdAt: session.createdAt,
        startedAt: session.startedAt,
        autoActivatesAt,
        currentQuestionIndex: session.currentQuestionIndex,
      },
      quiz: {
        quizId: quiz.quizId,
        title: quiz.title,
        description: quiz.description,
        userId: quiz.userId,
      },
      participantCount,
      questions: questions.map((q) => ({
        questionId: q.questionId,
        orderIndex: q.orderIndex,
        text: q.text,
        options: (q.options ?? []) as {
          id?: string;
          text: string;
          isCorrect: boolean;
        }[],
        isTextAnswer: q.isTextAnswer,
        allowMultipleCorrect: q.allowMultipleCorrect,
        timeLimitSecs: q.timeLimitSecs,
        points: q.points,
        mediaUrl: q.mediaUrl ?? null,
      })),
      liveState,
    };
  }

  public async manuallyActivateSession(
    userId: string,
    payload: ManuallyActivateSessionDtoType,
  ) {
    const data = manuallyActivateSessionDto.parse(payload);
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    const [quiz] = await db
      .select({ userId: quizzes.userId })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId)
      throw new AppError(
        "UNAUTHORIZED",
        "Unauthorized to activate this session",
      );

    if (session.status !== "waiting") {
      throw new AppError("BAD_REQUEST", "Session is not in waiting state");
    }
    const autoActiveJobId = await redis.get(
      this.redisAutoActiveJobKey(data.sessionId),
    );
    if (autoActiveJobId) {
      await autoActiveQueue.remove(autoActiveJobId);
      await redis.del(this.redisAutoActiveJobKey(data.sessionId));
    }
    await db
      .update(QuizSessions)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(QuizSessions.sessionId, data.sessionId));
    await this.updateSessionActivity(data.sessionId);

    const liveKey = this.redisLiveSessionKey(data.sessionId);
    const liveState: LiveSessionRedisState = {
      currentQuestionIndex: -1,
      voteTallies: {},
    };
    await redis.set(liveKey, JSON.stringify(liveState));

    return { success: true };
  }

  //should done by inngest
  public async emitQuestion(userId: string, payload: EmitQuestionDtoType) {
    const data = emitQuestionDto.parse(payload);
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    const [quiz] = await db
      .select({ userId: quizzes.userId })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId)
      throw new AppError(
        "UNAUTHORIZED",
        "Unauthorized to emit questions in this session",
      );

    if (session.status !== "active") {
      throw new AppError("BAD_REQUEST", "Session is not active");
    }

    // Update DB
    await db
      .update(QuizSessions)
      .set({ currentQuestionIndex: data.questionIndex })
      .where(eq(QuizSessions.sessionId, data.sessionId));

    // Update Redis live state
    const liveKey = this.redisLiveSessionKey(data.sessionId);
    const raw = await redis.get(liveKey);
    const current: LiveSessionRedisState = raw
      ? JSON.parse(raw)
      : { currentQuestionIndex: -1, voteTallies: {} };

    current.currentQuestionIndex = data.questionIndex;
    await redis.set(liveKey, JSON.stringify(current));
    await this.updateSessionActivity(data.sessionId);

    return {
      success: true,
      currentQuestionIndex: data.questionIndex,
      liveState: current,
    };
  }

  public async endSession(userId: string, payload: EndSessionDtoType) {
    const data = endSessionDto.parse(payload);
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    const [quiz] = await db
      .select({ userId: quizzes.userId })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId)
      throw new AppError("UNAUTHORIZED", "Unauthorized to end this session");

    await db
      .update(QuizSessions)
      .set({ status: "ended", endedAt: new Date() })
      .where(eq(QuizSessions.sessionId, data.sessionId));

    try {
      await this.finalizeSessionData(data.sessionId, session.quizId);
    } catch (err) {
      console.error("Failed to finalize session data:", err);
    }

    // Clear Redis session tracking key
    await redis.del(this.redisSessionInactivityKey(data.sessionId));
    return { success: true };
  }

  public async verifySessionPassword(
    userId: string,
    payload: VerifySessionPasswordDtoType,
  ) {
    const data = verifySessionPasswordDto.parse(payload);
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    const [quiz] = await db
      .select({
        quizId: quizzes.quizId,
        passwordNeeded: quizzes.passwordNeeded,
        password: quizzes.password,
      })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");

    if (quiz.passwordNeeded) {
      if (!data.password)
        throw new AppError("UNAUTHORIZED", "Password required");
      if (data.password !== quiz.password)
        throw new AppError("UNAUTHORIZED", "Incorrect password");
    }

    const redisLeaderboardKey = this.redisLeaderboardKey(data.sessionId);
    const exitingScore = await redis.zscore(redisLeaderboardKey, `${userId}`);
    const isParticipant = exitingScore !== null;

    if (session.status === "active" && !isParticipant) {
      throw new AppError(
        "FORBIDDEN",
        "Session has already started, you cannot join now.",
      );
    }

    if (!isParticipant) {
      await redis.zadd(redisLeaderboardKey, 0, `${userId}`);
    }

    return { success: true };
  }

  public async recordAnswer(
    userId: string,
    payload: RecordAnswerDtoType,
  ): Promise<{ correct: boolean; pointsAwarded: number }> {
    const data = recordAnswerDto.parse(payload);
    if (!data.optionIds || data.optionIds.length === 0)
      return { correct: false, pointsAwarded: 0 };

    // 1. Fetch question options + points from DB
    const [question] = await db
      .select({
        questionId: quizQuestions.questionId,
        options: quizQuestions.options,
        points: quizQuestions.points,
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.questionId, data.questionId));

    if (!question) return { correct: false, pointsAwarded: 0 };

    const options = (question.options ?? []) as {
      id: string;
      isCorrect: boolean;
    }[];
    const correctOptionIds = options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);

    // Calculate if exactly all correct options and no incorrect options are selected
    const isCorrect =
      data.optionIds.every((id) => correctOptionIds.includes(id)) &&
      correctOptionIds.every((id) => data.optionIds.includes(id));

    // 2. Update vote tallies in Redis live state
    const liveKey = this.redisLiveSessionKey(data.sessionId);
    const raw = await redis.get(liveKey);
    if (raw) {
      const liveState: LiveSessionRedisState = JSON.parse(raw);
      const tally = liveState.voteTallies[data.questionId] || {};
      for (const id of data.optionIds) {
        tally[id] = (tally[id] ?? 0) + 1;
      }
      liveState.voteTallies[data.questionId] = tally;
      await redis.set(liveKey, JSON.stringify(liveState));
    }

    // 3. Award points if correct
    let pointsAwarded = 0;
    if (isCorrect) {
      pointsAwarded = question.points;
      const leaderboardKey = this.redisLeaderboardKey(data.sessionId);
      await redis.zincrby(leaderboardKey, pointsAwarded, userId);
    }

    return { correct: isCorrect, pointsAwarded };
  }

  public async addBonusPointsIfCorrect(
    userId: string,
    payload: AddBonusPointsDtoType,
  ): Promise<{ success: boolean; pointsAwarded: number }> {
    const data = addBonusPointsDto.parse(payload);
    if (!data.optionIds || data.optionIds.length === 0 || data.bonusPoints <= 0)
      return { success: false, pointsAwarded: 0 };
    const [question] = await db
      .select({ options: quizQuestions.options })
      .from(quizQuestions)
      .where(eq(quizQuestions.questionId, data.questionId));
    if (!question) return { success: false, pointsAwarded: 0 };
    const options = (question.options ?? []) as {
      id: string;
      isCorrect: boolean;
    }[];
    const correctOptionIds = options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);
    const isCorrect =
      data.optionIds.length === correctOptionIds.length &&
      data.optionIds.every((id) => correctOptionIds.includes(id));
    if (isCorrect) {
      const leaderboardKey = this.redisLeaderboardKey(data.sessionId);
      await redis.zincrby(leaderboardKey, data.bonusPoints, userId);
      return { success: true, pointsAwarded: data.bonusPoints };
    }
    return { success: false, pointsAwarded: 0 };
  }

  public async getSessionInfoForParticipant(
    userId: string,
    payload: GetSessionInfoForParticipantDtoType,
  ) {
    const data = getSessionInfoForParticipantDto.parse(payload);
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    const [quiz] = await db
      .select({
        quizId: quizzes.quizId,
        title: quizzes.title,
        description: quizzes.description,
        passwordNeeded: quizzes.passwordNeeded,
        isBonusPointsEnabled: quizzes.isBonusPointsEnabled,
      })
      .from(quizzes)
      .where(eq(quizzes.quizId, session.quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");

    const redisLeaderboardKey = this.redisLeaderboardKey(data.sessionId);

    // Participant count (non-host participants)
    let participantCount = 0;
    if (session.status === "ended") {
      const participants = await db
        .select({ participantId: quizParticipants.participantId })
        .from(quizParticipants)
        .where(eq(quizParticipants.sessionId, data.sessionId));
      participantCount = participants.length;
    } else {
      participantCount = await redis.zcard(redisLeaderboardKey);
    }

    // Read current live state from Redis (null when waiting)
    let liveState: LiveSessionRedisState | null = null;
    if (session.status === "active") {
      const raw = await redis.get(this.redisLiveSessionKey(data.sessionId));
      if (raw) liveState = JSON.parse(raw) as LiveSessionRedisState;
    }

    let exitingScore = await redis.zscore(redisLeaderboardKey, `${userId}`);
    let isParticipant = exitingScore !== null;
    let score = exitingScore ? parseFloat(exitingScore) : 0;
    let rank: number | null = null;

    if (isParticipant) {
      const rankIndex = await redis.zrevrank(redisLeaderboardKey, `${userId}`);
      rank = rankIndex !== null ? rankIndex + 1 : null;
    }

    const notAllowedToJoin =
      (session.status === "active" || session.status === "ended") &&
      !isParticipant;

    if (
      !quiz.passwordNeeded &&
      session.status === "waiting" &&
      !isParticipant
    ) {
      await redis.zadd(redisLeaderboardKey, 0, `${userId}`);
      isParticipant = true;
      score = 0;
      const rankIndex = await redis.zrevrank(redisLeaderboardKey, `${userId}`);
      rank = rankIndex !== null ? rankIndex + 1 : null;
      participantCount++;
    }

    return {
      session: {
        sessionId: session.sessionId,
        status: session.status,
        joinCode: session.joinCode,
        name: session.name,
        createdAt: session.createdAt,
      },
      quiz: {
        quizId: quiz.quizId,
        title: quiz.title,
        description: quiz.description ?? null,
        passwordNeeded: quiz.passwordNeeded,
        isBonusPointsEnabled: quiz.isBonusPointsEnabled,
      },
      participantCount,
      liveState,
      isParticipant,
      notAllowedToJoin,
      participantData: {
        score,
        rank,
      },
    };
  }

  public async getLeaderboardForSession(
    payload: GetLeaderboardForSessionDtoType,
  ) {
    const data = getLeaderboardForSessionDto.parse(payload);
    const [session] = await db
      .select()
      .from(QuizSessions)
      .where(eq(QuizSessions.sessionId, data.sessionId));
    if (!session) throw new AppError("NOT_FOUND", "Session not found");

    if (session.status === "ended") {
      const [result] = await db
        .select()
        .from(sessionResults)
        .where(eq(sessionResults.sessionId, data.sessionId));
      if (result?.finalLeaderboard) {
        return result.finalLeaderboard.map((entry) => ({
          rank: entry.rank,
          name: entry.username ?? "Guest",
          username: entry.username
            ? `@${entry.username}`
            : `#${entry.participantId.slice(0, 6)}`,
          score: entry.totalScore,
          avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(entry.username ?? entry.participantId)}`,
          userId: entry.participantId,
        }));
      }
    }

    // Active or waiting or no result
    const redisLeaderboardKey = this.redisLeaderboardKey(data.sessionId);
    const participantsWithScores = await redis.zrange(
      redisLeaderboardKey,
      0,
      -1,
      "REV",
      "WITHSCORES",
    );

    const userScores: { userId: string; score: number }[] = [];
    for (let i = 0; i < participantsWithScores.length; i += 2) {
      const userId = participantsWithScores[i];
      const scoreStr = participantsWithScores[i + 1];
      if (userId && scoreStr) {
        userScores.push({ userId, score: parseFloat(scoreStr) });
      }
    }

    if (userScores.length === 0) return [];

    const userIds = userScores.map((u) => u.userId);
    const fetchedUsers = await db
      .select({
        userId: users.userId,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(users)
      .where(inArray(users.userId, userIds));

    const userMap = new Map(fetchedUsers.map((u) => [u.userId, u]));

    return userScores.map((p, index) => {
      const user = userMap.get(p.userId);
      const displayName =
        user?.username ||
        (user?.firstName
          ? `${user.firstName} ${user.lastName ?? ""}`.trim()
          : "Guest");
      return {
        rank: index + 1,
        name: displayName,
        username: user?.username
          ? `@${user.username}`
          : `#${p.userId.slice(0, 6)}`,
        score: p.score,
        avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        userId: p.userId,
      };
    });
  }
}

export default QuizService;
