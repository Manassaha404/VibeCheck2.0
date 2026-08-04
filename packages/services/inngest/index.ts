import { serve } from "inngest/express";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "./client";
import pollFunctions from "./poll-functions";
import petitionFunctions from "./petition-functions";
import agentFunctions from "./agent-functions";
import langchainFunctions from "./langchain-functions";
import { env } from "../env";
export const inngestRouter = serve({
  client: inngest,
  functions: [
    ...pollFunctions,
    ...petitionFunctions,
    ...agentFunctions,
    ...langchainFunctions,
  ],
  serveOrigin: env.INNGEST_SERVE_ORIGIN ?? env.API_BASE_URL ?? "http://localhost:8000",
});

export { inngest, getClientSubscriptionToken };
