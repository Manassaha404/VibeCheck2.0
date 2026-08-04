import { Queue } from "bullmq";
import { env } from "../env";

export const inactivityQueue = new Queue("inactivity-queue", {
  connection: {
    host:env.REDIS_HOST || "localhost",
    port: 6379,
  },
});

export const autoActiveQueue = new Queue("auto-active-queue", {
  connection: {
    host:env.REDIS_HOST || "localhost",
    port: 6379,
  }
});
