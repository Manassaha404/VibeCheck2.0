import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { tagService } from "../../services";
import { z } from "zod";
import { handleRouteError } from "../../utils/error";

export const tagRouter = router({
  getTopTags: publicProcedure.query(async () => {
    try {
      return await tagService.getTopTags();
    } catch (error) {
      handleRouteError(error);
    }
  }),
  createNewTag: protectedProcedure
    .input(z.object({ tag: z.string().trim().min(1) }))
    .mutation(async ({ input }) => {
      try {
        return await tagService.createNewTag(input.tag);
      } catch (error) {
        handleRouteError(error);
      }
    }),

});