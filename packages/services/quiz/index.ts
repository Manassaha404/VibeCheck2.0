import db, { eq } from "@repo/database";
import { quizzes } from "@repo/database/models/quizzes";
import { quizQuestions } from "@repo/database/models/quiz-questions";
import { AppError } from "@repo/error";
import { createQuizDto, CreateQuizInput } from "./model";

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
}

export default QuizService;
