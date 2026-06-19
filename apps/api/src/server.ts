import express from "express";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext, openApiDocument } from "@repo/trpc/server";

import { env } from "./env";
import cookieParser from "cookie-parser";
import authRouter from "./authRouter";

export const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());



// JSON parser for all other routes (default 100 kb limit is fine)
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ message: "server is running.." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "VibeCheck server is healthy", healthy: true });
});


app.use("/auth", authRouter);

app.get("/api/openapi.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.json(openApiDocument);
});


app.use(
  "/docs",
  apiReference({
    theme: "purple",
    spec: {
      url: "/api/openapi.json",
    },
  }),
);



app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
