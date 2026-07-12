import { Worker, Job } from "bullmq";
import redis from "../redis";
import { inactivityQueue } from "./queue";
import QuizService from ".";
const INACTIVITY_TIMEOUT = 60 * 60 * 1000;
const quizService = new QuizService();

export const inactivityQueueWorker = new Worker(
  "inactivity-queue",
  async (job: Job) => {
    const { sessionId } = job.data;

    try {
      const sessionKey = `quiz:${sessionId}`;
      const sessionData = await redis.get(sessionKey);

      if (!sessionData) {
        console.log(`No session data found for session: ${sessionId}`);
        return;
      }

      const parsedData = JSON.parse(sessionData);
      const lastActivity = new Date(parsedData.lastCreaTorActivity);
      const now = new Date();
      const timeDiff = now.getTime() - lastActivity.getTime();

      if (timeDiff > INACTIVITY_TIMEOUT) {
        console.log(`Session ${sessionId} is inactive.`);
        await quizService.endQuizSessionForInactivity(sessionId);
        await redis.del(sessionKey);
      } else {
        inactivityQueue.add(
          "check-inactivity",
          { sessionId },
          { delay: INACTIVITY_TIMEOUT - timeDiff },
        );
        console.log(
          `Session ${sessionId} is still active. Re-adding to queue.`,
        );
      }
    } catch (error) {
      console.error(
        `Error handling inactivity for session ${sessionId}:`,
        error,
      );
      throw error;
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

export const autoActiveQueueWorker = new Worker(
  "auto-active-queue",
  async (job: Job) => {
    try {
      const { sessionId } = job.data;
      await quizService.makeSessionActive({ sessionId });
    } catch (error) {
      console.error(
        `Error making session active for session ${job.data.sessionId}:`,
        error,
      );
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);

inactivityQueueWorker.on("completed", (job) => {
  console.log(
    `Inactivity job ${job.id} for session ${job.data.sessionId} has completed!`,
  );
});

autoActiveQueueWorker.on("completed", (job) => {
  console.log(
    `Auto-active job ${job.id} for session ${job.data.sessionId} has completed!`,
  );
});
