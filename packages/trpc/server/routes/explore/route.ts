import { publicProcedure, router } from "../../trpc";
import {
  getTrendingDto,
  getForYouPageDto,
  joinQuizByCodeDto,
  searchQuizSessionDto,
} from "@repo/services/explore/model";
import { exploreService } from "../../services";
import { handleRouteError } from "../../utils/error";

export const exploreRouter = router({
  /** Trending polls & petitions for today — public, no auth needed */
  getTrending: publicProcedure
    .input(getTrendingDto)
    .query(async ({ input }) => {
      try {
        return await exploreService.getTrendingToday(input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  /**
   * Personalised "For You" feed — paginated (cursor = offset).
   * Falls back to latest public items when not authenticated.
   */
  getForYouPage: publicProcedure
    .input(getForYouPageDto)
    .query(async ({ input, ctx }) => {
      try {
        const userId = (ctx as any).user?.id ?? null;
        return await exploreService.getForYouPage(userId, input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  /** Look up a quiz session by its 6-char join code */
  joinQuizByCode: publicProcedure
    .input(joinQuizByCodeDto)
    .mutation(async ({ input }) => {
      try {
        return await exploreService.joinQuizByCode(input);
      } catch (error) {
        handleRouteError(error);
      }
    }),

  /** Live search for open quiz sessions by join code or name */
  searchQuizSession: publicProcedure
    .input(searchQuizSessionDto)
    .query(async ({ input }) => {
      try {
        return await exploreService.searchQuizSession(input);
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
