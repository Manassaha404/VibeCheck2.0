import "dotenv/config"
import { healthRouter } from "./routes/health/route";
import { router } from "./trpc";


export const serverRouter = router({
  health: healthRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
export { openApiDocument } from "./openapi";