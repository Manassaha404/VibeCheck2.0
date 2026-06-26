import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { createPollDto, savePollDraftDto, getPollAnalyticsDto, submitVoteDto } from "@repo/services/poll/model";
import { pollService } from "../../services";
import { handleRouteError } from "../../utils/error";
import { z } from "zod";

export const pollRouter = router({
  createPoll: protectedProcedure
    .input(createPollDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const poll = await pollService.createPoll(ctx.user.id, input);
        return { message: "Poll created successfully", poll };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  saveDraft: protectedProcedure
    .input(z.object({ pollId: z.string().uuid(), data: savePollDraftDto }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await pollService.saveDraft(ctx.user.id, input.pollId, input.data);
        return { message: "Draft saved successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  setPollActive: protectedProcedure
    .input(z.object({ pollId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await pollService.setPollActive(ctx.user.id, input.pollId);
        return { message: "Poll published successfully", ...result };
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getPollBySlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        return await pollService.getPollBySlug(ctx.user.id, input.slug);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getPublicPollBySlug: publicProcedure
    .input(z.object({ username: z.string(), slug: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const userId = (ctx as any).user?.id ?? null;
        const guestToken = ctx.guestToken ?? null;
        return await pollService.getPublicPollBySlug(input.username, input.slug, userId, guestToken);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getPublicPollResultsBySlug: publicProcedure
    .input(z.object({ username: z.string(), slug: z.string() }))
    .query(async ({ input }) => {
      try {
        return await pollService.getPublicPollResultsBySlug(input.username, input.slug);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getPublicPollCommentsBySlug: publicProcedure
    .input(z.object({ username: z.string(), slug: z.string() }))
    .query(async ({ input }) => {
      try {
        return await pollService.getPublicPollCommentsBySlug(input.username, input.slug);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  submitVote: publicProcedure
    .input(submitVoteDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = (ctx as any).user?.id ?? null;
        const guestToken = ctx.guestToken ?? null;
        return await pollService.submitVote(userId, guestToken, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getAnalytics: protectedProcedure
    .input(getPollAnalyticsDto)
    .query(async ({ input, ctx }) => {
      try {
        return await pollService.getPollAnalytics(ctx.user.id, input.slug);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  newView: publicProcedure
    .input(z.object({ pollId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = (ctx as any).user?.id ?? null;
        const guestToken = ctx.guestToken ?? null;
        await pollService.newView(input.pollId, userId, guestToken);
        return { success: true };
      } catch (error) {
        handleRouteError(error);
      }
    }),
});