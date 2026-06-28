import { protectedProcedure, publicProcedure, router } from "../../trpc";
import { createPetitionDto, getAnalyticsDto } from "@repo/services/petition/model";
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
});
