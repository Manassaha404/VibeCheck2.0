import { AppError } from "@repo/error";
import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { formBuilderAgentServices, formRespondentAgentService } from "../../services";
import { generateFormDto, clearHistoryDto } from "./model";
import { agentChatDto, agentClearSessionDto, agentGetSessionDto } from "@repo/services/form/model";
import { handleRouteError } from "../../utils/error";

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
  
  respondentAgentChat: publicProcedure
    .input(agentChatDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const guestToken = ctx.guestToken;
        if (!guestToken) throw new Error("Guest token missing");
        return await formRespondentAgentService.chat(
          input.formId,
          guestToken,
          input.message,
        );
      } catch (error) {
        handleRouteError(error);
      }
    }),

  respondentAgentGetSession: publicProcedure
    .input(agentGetSessionDto)
    .query(async ({ input, ctx }) => {
      try {
        const guestToken = ctx.guestToken;
        if (!guestToken) return { hasSession: false, isCompleted: false, collectedAnswers: [], currentFieldId: null };
        return await formRespondentAgentService.getSession(input.formId, guestToken);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  respondentAgentClearSession: publicProcedure
    .input(agentClearSessionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const guestToken = ctx.guestToken;
        if (!guestToken) return { message: "No session to clear" };
        await formRespondentAgentService.clearSession(input.formId, guestToken);
        return { message: "Session cleared" };
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
