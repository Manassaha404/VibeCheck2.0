import { AppError } from "@repo/error";
import { protectedProcedure, router } from "../../trpc";
import { formBuilderAgentServices } from "../../services";
import { generateFormDto, clearHistoryDto } from "./model";

export const agentRouter = router({
  generateForm: protectedProcedure
    .input(generateFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formBuilderAgentServices.runFormMakerAgent(
          ctx.user.id,
          input.formId,
          input.prompt,
          input.currentFields,
        );
        return { form };
      } catch (error) {
        if (
          error instanceof Error &&
          (error.constructor.name === "InputGuardrailTripwireTriggered" ||
            error.constructor.name === "OutputGuardrailTripwireTriggered")
        ) {
          throw new AppError("BAD_REQUEST", error.message);
        }
        throw error;
      }
    }),

  clearFormBuilderAgentHistory: protectedProcedure
    .input(clearHistoryDto)
    .mutation(async ({ input, ctx }) => {
      await formBuilderAgentServices.clearHistory(ctx.user.id, input.formId);
      return { message: "Conversation history cleared" };
    }),
});
