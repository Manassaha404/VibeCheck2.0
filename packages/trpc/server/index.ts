import "dotenv/config";
import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { router } from "./trpc";
import { formRouter } from "./routes/form/route";
import { agentRouter } from "./routes/agent/route";
import { pollRouter } from "./routes/poll/route";
import { tagRouter } from "./routes/tag/route";
import { petitionRouter } from "./routes/petition/route";
import { uploadRouter } from "./routes/upload/route";
import { quizRouter } from "./routes/quiz/route";
import { exploreRouter } from "./routes/explore/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  form: formRouter,
  agent: agentRouter,
  poll: pollRouter,
  tag: tagRouter,
  petition: petitionRouter,
  upload: uploadRouter,
  quiz: quizRouter,
  explore: exploreRouter,
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
export { openApiDocument } from "./openapi";
