import { protectedProcedure, publicProcedure, router } from "../../trpc";
import {
  createPetitionDto,
  getAnalyticsDto,
  getPetitionForSignDto,
  signPetitionDto,
  archivePetitionDto,
  deletePetitionDto,
  activatePetitionDto,
} from "@repo/services/petition/model";
import { petitionService } from "../../services";
import { handleRouteError } from "../../utils/error";

export const petitionRouter = router({
  createPetition: protectedProcedure
    .input(createPetitionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const petition = await petitionService.createPetition(ctx.user.id, input);
        return { message: "Petition created successfully", petition };
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getAnalytics: publicProcedure
    .input(getAnalyticsDto)
    .query(async ({ input }) => {
      try {
        const analytics = await petitionService.getAnalytics(input.slug);
        return analytics;
      } catch (error) {
        handleRouteError(error);
      }
    }),
  getPetitionForSign: publicProcedure
    .input(getPetitionForSignDto)
    .query(async ({ input,ctx }) => {
      try {
        return await petitionService.getPetitionForSign(input.username, input.slug, ctx.user?.id, ctx.guestToken);
      } catch (error) {
        handleRouteError(error);
      }
    }),
  signPetition: publicProcedure
    .input(signPetitionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await petitionService.signPetition(input, ctx.user?.id, ctx.guestToken);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  getDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        return await petitionService.getDashboardItems(ctx.user.id);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  archiveItem: protectedProcedure
    .input(archivePetitionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await petitionService.archiveItem(ctx.user.id, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  activateItem: protectedProcedure
    .input(activatePetitionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await petitionService.activateItem(ctx.user.id, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  deleteItem: protectedProcedure
    .input(deletePetitionDto)
    .mutation(async ({ input, ctx }) => {
      try {
        return await petitionService.deleteItem(ctx.user.id, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
