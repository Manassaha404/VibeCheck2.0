import "dotenv/config"
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { router } from "./trpc";


import { formRouter } from "./routes/form/route";
import { agentRouter } from "./routes/agent/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  agent:agentRouter
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
export { openApiDocument } from "./openapi";