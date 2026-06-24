import "dotenv/config"
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { router } from "./trpc";
import { formRouter } from "./routes/form/route";
import { agentRouter } from "./routes/agent/route";
import { pollRouter } from "./routes/poll/route";
import { tagRouter } from "./routes/tag/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  agent: agentRouter,
  poll: pollRouter,
  tag: tagRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
export { openApiDocument } from "./openapi";