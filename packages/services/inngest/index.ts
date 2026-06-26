import { serve } from "inngest/express";
import { inngest } from "./client";
import { helloWorld } from "./functions";
import { pollView } from "./poll-functions";

export const inngestRouter = serve({
  client: inngest,
  functions: [
    helloWorld,
    pollView,
  ],
  serveOrigin: process.env.API_BASE_URL ?? "http://localhost:8000",
});

export { inngest };
