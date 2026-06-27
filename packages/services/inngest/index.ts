import { serve } from "inngest/express";
import { inngest } from "./client";
import pollFunctions from "./poll-functions";

export const inngestRouter = serve({
  client: inngest,
  functions: [
    ...pollFunctions
  ],
  serveOrigin: process.env.API_BASE_URL ?? "http://localhost:8000",
});

export { inngest };
