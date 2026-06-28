import { serve } from "inngest/express";
import { inngest } from "./client";
import pollFunctions from "./poll-functions";
import petitionFunctions from "./petition-functions";
export const inngestRouter = serve({
  client: inngest,
  functions: [...pollFunctions, ...petitionFunctions],
  serveOrigin: process.env.API_BASE_URL ?? "http://localhost:8000",
});

export { inngest };
