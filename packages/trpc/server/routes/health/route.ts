import { publicProcedure, router } from "../../trpc";
import { z, zodUndefinedModel } from "../../schema";
import { handleRouteError } from "../../utils/error";

export const healthRouter = router({
  getHealth: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/health",
        tags: ["health"],
        summary: "Health check",
        description:
          "Returns a simple string confirming the tRPC server is alive.",
      },
    })
    .input(zodUndefinedModel)
    .output(z.string())
    .query(async () => {
      try {
        return "hello from trpc";
      } catch (error) {
        handleRouteError(error);
      }
    }),
});
