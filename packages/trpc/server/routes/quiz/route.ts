import { protectedProcedure, router } from "../../trpc";
import { createQuizDto } from "@repo/services/quiz/model";
import { quizService } from "../../services";
import { handleRouteError } from "../../utils/error";

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
});
