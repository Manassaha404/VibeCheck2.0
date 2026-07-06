import db, { eq, desc, inArray } from "@repo/database";
import { quizzes } from "@repo/database/models/quizzes";
import { quizQuestions } from "@repo/database/models/quiz-questions";
import { QuizSessions } from "@repo/database/models/quiz-sessions";
import { quizParticipants } from "@repo/database/models/quiz-participants";
import { users } from "@repo/database/models/users";
import { AppError } from "@repo/error";
import { createQuizDto, CreateQuizInput, updateQuizDto, UpdateQuizInput } from "./model";

class QuizService {
  /**
   * Generate a unique 6-character alphanumeric join code.
   * Simple retry logic to ensure uniqueness.
   */
  

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
          password: data.globalSettings.passwordProtect ? data.globalSettings.password : null,
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

  public async getQuizForEdit(quizId: string) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.quizId, quizId));
    if (!quiz) {
      throw new AppError("NOT_FOUND", "Quiz not found");
    }

    const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId)).orderBy(quizQuestions.orderIndex);

    return {
      quiz,
      questions,
    };
  }

  public async updateQuiz(userId: string, payload: UpdateQuizInput) {
    const data = updateQuizDto.parse(payload);

    return await db.transaction(async (tx) => {
      // 1. Verify and update the main quiz record
      const [existingQuiz] = await tx.select().from(quizzes).where(eq(quizzes.quizId, data.quizId));
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
          password: data.globalSettings.passwordProtect ? data.globalSettings.password : null,
        })
        .where(eq(quizzes.quizId, data.quizId));

      // 2. Delete old questions
      await tx.delete(quizQuestions).where(eq(quizQuestions.quizId, data.quizId));

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

  public async getQuizDashboard(quizId: string) {
    
    
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.quizId, quizId));
    if (!quiz) {
      throw new AppError("NOT_FOUND", "Quiz not found");
    }

    
    

    const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));
    const totalQuestions = questions.length;
    const totalTimeLimitSecs = questions.reduce((sum, q) => sum + q.timeLimitSecs, 0);

    
    let sessions: any[] = [];
    try {
      sessions = await db
        .select()
        .from(QuizSessions)
        .where(eq(QuizSessions.quizId, quizId))
        .orderBy(desc(QuizSessions.createdAt));
    } catch (err: any) {
      console.error("QuizSessions Query Error:", err);
      throw new AppError("INTERNAL_SERVER_ERROR", `QuizSessions query failed: ${err.message}`);
    }


    let totalParticipants = 0;
    let leaderboardRaw: any[] = [];
    const previousSessions: any[] = [];

    const sessionIds = sessions.map(s => s.sessionId);

    
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
        const displayName = p.username || (p.firstName ? `${p.firstName} ${p.lastName}` : "Guest");
        
        if (!uniqueParticipantsMap.has(key) || uniqueParticipantsMap.get(key).score < p.score) {
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

      for (const s of sessions) {
        if (s.status === "ended") {
          const sessionParticipantsCount = participants.filter(p => p.sessionId === s.sessionId).length;
          previousSessions.push({
            sessionId: s.sessionId,
            name: s.name,
            date: s.createdAt,
            participantsCount: sessionParticipantsCount,
          });
        }
      }
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
          
        const sessionParticipantCounts = participants.reduce((acc, p) => {
          acc[p.sessionId] = (acc[p.sessionId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        sessionRecords.forEach((s) => {
          quizParticipantCounts[s.quizId] = (quizParticipantCounts[s.quizId] || 0) + (sessionParticipantCounts[s.sessionId] || 0);
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
  public async archiveItem(userId: string, quizId: string) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.quizId, quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId) throw new AppError("UNAUTHORIZED", "Unauthorized to archive this quiz");
    
    await db.update(quizzes).set({ status: "archived" }).where(eq(quizzes.quizId, quizId));
    return { success: true };
  }

  public async activateItem(userId: string, quizId: string) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.quizId, quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId) throw new AppError("UNAUTHORIZED", "Unauthorized to activate this quiz");
    
    await db.update(quizzes).set({ status: "active" }).where(eq(quizzes.quizId, quizId));
    return { success: true };
  }

  public async deleteItem(userId: string, quizId: string) {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.quizId, quizId));
    if (!quiz) throw new AppError("NOT_FOUND", "Quiz not found");
    if (quiz.userId !== userId) throw new AppError("UNAUTHORIZED", "Unauthorized to delete this quiz");
    
    await db.delete(quizzes).where(eq(quizzes.quizId, quizId));
    return { success: true };
  }
}

export default QuizService;
