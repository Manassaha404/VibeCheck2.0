import { Queue } from "bullmq";

export const inactivityQueue = new Queue("inactivity-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

export const autoActiveQueue = new Queue("auto-active-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
