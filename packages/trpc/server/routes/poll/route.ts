import { protectedProcedure, router } from "../../trpc";
import { createPollDto, savePollDraftDto } from "@repo/services/poll/model";
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
});