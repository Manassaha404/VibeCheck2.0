import {
  protectedProcedure,
  publicProcedure,
  router,
  planRestrictedProcedure,
} from "../../trpc";
import { z } from "zod";
import {
  createQuizDto,
  updateQuizDto,
  initDraftQuizDto,
  publishDraftQuizDto,
  archiveItemDto,
  activateItemDto,
  deleteItemDto,
  makeQuizSessionDto,
  getSessionAnalyticsDto,
  getSessionForHostDto,
  emitQuestionDto,
  manuallyActivateSessionDto,
  endSessionDto,
  getSessionInfoForParticipantDto,
  verifySessionPasswordDto,
  getLeaderboardForSessionDto,
  addBonusPointsDto,
  getQuizDashboardDto,
  getQuizForEditDto,
  recordAnswerDto,
} from "@repo/services/quiz/model";
import { quizService } from "../../services";
import { handleRouteError } from "../../utils/error";
import { AppError } from "@repo/error";

export const quizRouter = router({
  initDraftQuiz: protectedProcedure
    .input(initDraftQuizDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.initDraftQuiz(ctx.user.id, input);
        return { message: "Quiz draft initialised", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  publishDraftQuiz: protectedProcedure
    .input(publishDraftQuizDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.publishDraftQuiz(ctx.user.id, input);
        return { message: "Quiz published successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  createQuiz: planRestrictedProcedure("quiz_created")
    .input(createQuizDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.createQuiz(ctx.user.id, input);
        return { message: "Quiz created successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await quizService.getDashboard(ctx.user.id);
      return result;
    } catch (error) {
      handleRouteError(error);
    }
  }),
  getQuizDashboard: protectedProcedure
    .input(getQuizDashboardDto)
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getQuizDashboard(input);
        if (result.quiz.userId !== ctx.user.id) {
          throw new AppError(
            "UNAUTHORIZED",
            "Unauthorized to view this quiz dashboard",
          );
        }
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getQuizForEdit: protectedProcedure
    .input(getQuizForEditDto)
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getQuizForEdit(input);
        if (result.quiz.userId !== ctx.user.id) {
          throw new AppError("UNAUTHORIZED", "Unauthorized to view this quiz");
        }
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  updateQuiz: protectedProcedure
    .input(updateQuizDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.updateQuiz(ctx.user.id, input);
        return { message: "Quiz updated successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  archiveItem: protectedProcedure
    .input(archiveItemDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.archiveItem(ctx.user.id, input);
        return { message: "Quiz archived successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  activateItem: protectedProcedure
    .input(activateItemDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.activateItem(ctx.user.id, input);
        return { message: "Quiz activated successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  deleteItem: protectedProcedure
    .input(deleteItemDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.deleteItem(ctx.user.id, input);
        return { message: "Quiz deleted successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  makeQuizSession: planRestrictedProcedure("quiz_session_created")
    .input(makeQuizSessionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.makeQuizSession(ctx.user.id, input);
        return { message: "Quiz session created successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getSessionAnalytics: protectedProcedure
    .input(getSessionAnalyticsDto)
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getSessionAnalytics(input);
        if (result.quiz.userId !== ctx.user.id) {
          throw new AppError(
            "UNAUTHORIZED",
            "Unauthorized to view this session's analytics",
          );
        }
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getSessionForHost: protectedProcedure
    .input(getSessionForHostDto)
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getSessionForHost(input);
        if (result.quiz.userId !== ctx.user.id) {
          throw new AppError(
            "UNAUTHORIZED",
            "Unauthorized to view this session",
          );
        }
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  emitQuestion: protectedProcedure
    .input(emitQuestionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.emitQuestion(ctx.user.id, input);
        return { message: "Question emitted successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  manuallyActivateSession: protectedProcedure
    .input(manuallyActivateSessionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.manuallyActivateSession(
          ctx.user.id,
          input,
        );
        return { message: "Session activated successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  endSession: protectedProcedure
    .input(endSessionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.endSession(ctx.user.id, input);
        return { message: "Session ended successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getSessionInfoForParticipant: protectedProcedure
    .input(getSessionInfoForParticipantDto)
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getSessionInfoForParticipant(
          ctx.user.id,
          input,
        );
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  verifySessionPassword: protectedProcedure
    .input(verifySessionPasswordDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.verifySessionPassword(
          ctx.user.id,
          input,
        );
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getLeaderboardForSession: protectedProcedure
    .input(getLeaderboardForSessionDto)
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getLeaderboardForSession(input);
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  submitBonusPoints: protectedProcedure
    .input(addBonusPointsDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.addBonusPointsIfCorrect(
          ctx.user.id,
          input,
        );
        return { message: "Bonus points processed", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  submitAnswer: protectedProcedure
    .input(recordAnswerDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.recordAnswer(ctx.user.id, input);
        return { message: "Answer recorded", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
