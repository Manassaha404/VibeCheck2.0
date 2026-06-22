import express from "express";
import cors from "cors";

import * as trpcExpress from "@trpc/server/adapters/express";

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
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});


import rateLimiter from "@repo/services/utils/rateLimiting";
import logger from "@repo/logger/logger";

app.use(express.json());
app.use(rateLimiter);

app.get("/", (req, res) => {
  return res.json({ message: "server is running.." });
});

app.get("/health", (req, res) => {
  return res.json({ message: "VibeCheck server is healthy", healthy: true });
});


app.use("/auth", authRouter);


app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  }),
);

export default app;
