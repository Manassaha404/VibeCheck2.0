import { protectedProcedure, router } from "../../trpc";
import { z } from "zod";
import { createQuizDto, updateQuizDto } from "@repo/services/quiz/model";
import { quizService } from "../../services";
import { handleRouteError } from "../../utils/error";
import { AppError } from "@repo/error";

export const quizRouter = router({
  createQuiz: protectedProcedure
    .input(createQuizDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.createQuiz(ctx.user.id, input);
        return { message: "Quiz created successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const result = await quizService.getDashboard(ctx.user.id);
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getQuizDashboard: protectedProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getQuizDashboard(input.quizId);
        if (result.quiz.userId !== ctx.user.id) {
          throw new AppError("UNAUTHORIZED", "Unauthorized to view this quiz dashboard");
        }
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getQuizForEdit: protectedProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      try {
        const result = await quizService.getQuizForEdit(input.quizId);
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
    .input(z.object({ quizId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.archiveItem(ctx.user.id, input.quizId);
        return { message: "Quiz archived successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  activateItem: protectedProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.activateItem(ctx.user.id, input.quizId);
        return { message: "Quiz activated successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  deleteItem: protectedProcedure
    .input(z.object({ quizId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await quizService.deleteItem(ctx.user.id, input.quizId);
        return { message: "Quiz deleted successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
