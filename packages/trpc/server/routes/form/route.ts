import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  draftFormDto,
  getSavedFieldsDto,
  saveDraftFormDto,
  updateFormSettingsDto,
  getFormAnalyticsDto,
  getFormResponsesDto,
  getPublicFormDto,
  submitStaticFormDto,
  getResumableUploadUrlDto,
  deleteFileDto,
  archiveFormDto,
  deleteFormDto,
  activateFormDto,
} from "@repo/services/form/model";
import { formServices } from "../../services";
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
  updateFormSettings: protectedProcedure
    .input(updateFormSettingsDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formServices.updateFormSettings(ctx.user.id, input);
        return { message: "Form settings updated successfully", form };
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

  getResumableUploadUrl: publicProcedure
    .input(getResumableUploadUrlDto)
    .mutation(async ({ input }) => {
      try {
        return await formServices.getResumableUploadUrl(input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  deleteFile: publicProcedure
    .input(deleteFileDto)
    .mutation(async ({ input }) => {
      try {
        return await formServices.deleteFile(input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await formServices.getDashboardItems(ctx.user.id);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  archiveItem: protectedProcedure
    .input(archiveFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await formServices.archiveItem(ctx.user.id, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  activateItem: protectedProcedure
    .input(activateFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await formServices.activateItem(ctx.user.id, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  deleteItem: protectedProcedure
    .input(deleteFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await formServices.deleteItem(ctx.user.id, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

});
