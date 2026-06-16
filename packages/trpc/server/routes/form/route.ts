import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  draftFormDto,
  getSavedFieldsDto,
  saveDraftFormDto,
  getFormAnalyticsDto,
  getFormResponsesDto,
  getPublicFormDto,
  agentChatDto,
  agentGetSessionDto,
  agentClearSessionDto,
  submitStaticFormDto,
} from "@repo/services/form/model";
import { formServices, formRespondentAgentService } from "../../services";
import { handleRouteError } from "../../utils/error";

export const formRouter = router({
  createForm: protectedProcedure
    .input(draftFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formServices.createForm(ctx.user.id, input);
        return { message: "Form drafted successfully", form };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  saveDraft: protectedProcedure
    .input(saveDraftFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formServices.saveDraft(ctx.user.id, input);
        return { message: "Form saved successfully", form };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  loadSaveDraft: protectedProcedure
    .input(getSavedFieldsDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const formData = await formServices.getSavedFields(ctx.user.id, input);
        return { message: "Form loaded successfully", ...formData };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  publishForm: protectedProcedure
    .input(saveDraftFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        // First save the current draft state
        await formServices.saveDraft(ctx.user.id, input);

        // Then publish the form
        const form = await formServices.publishForm(ctx.user.id, { formSlug: input.formSlug });
        return { message: "Form published successfully", form };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getFormAnalytics: protectedProcedure
    .input(getFormAnalyticsDto)
    .query(async ({ input, ctx }) => {
      try {
        const analytics = await formServices.getFormAnalytics(ctx.user.id, input);
        return analytics;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getFormResponses: protectedProcedure
    .input(getFormResponsesDto)
    .query(async ({ input, ctx }) => {
      try {
        const result = await formServices.getFormResponses(ctx.user.id, input);
        return result;
      } catch (error) {
        handleRouteError(error);
      }
    }),

  // ── Public: fetch a published form by username + slug ──────────────────
  getPublicForm: publicProcedure
    .input(getPublicFormDto)
    .query(async ({ input, ctx }) => {
      try {
        return await formServices.getPublicForm(input, ctx.guestToken);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  submitStaticForm: publicProcedure
    .input(submitStaticFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const guestToken = ctx.guestToken;
        if (!guestToken) throw new Error("Guest token missing");
        return await formServices.submitStaticForm(input, guestToken);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  // ── Public: AI respondent agent chat ───────────────────────────────────
  agentChat: publicProcedure
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

  agentGetSession: publicProcedure
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

  agentClearSession: publicProcedure
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


