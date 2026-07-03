import { serve } from "inngest/express";
import { getClientSubscriptionToken } from "inngest/react";
import { inngest } from "./client";
import pollFunctions from "./poll-functions";
import petitionFunctions from "./petition-functions";
import agentFunctions from "./agent-functions";
export const inngestRouter = serve({
  client: inngest,
  functions: [...pollFunctions, ...petitionFunctions, ...agentFunctions],
  serveOrigin: process.env.API_BASE_URL ?? "http://localhost:8000",
});

export { inngest,getClientSubscriptionToken };
