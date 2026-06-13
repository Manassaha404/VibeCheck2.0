import { protectedProcedure, router } from "../../trpc";
import { draftFormDto } from "@repo/services/form/model";
import { formServices } from "../../services";
import { handleRouteError } from "../../utils/error";

export const formRouter = router({
  draft: protectedProcedure
    .input(draftFormDto)
    .mutation(async ({ input, ctx }) => {
      try {
        const form = await formServices.draftForm(ctx.user.id, input);
        return { message: "Form drafted successfully", form };
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
