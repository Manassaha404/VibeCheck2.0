import { Server } from "socket.io";
import { subscriber } from "@repo/redis/pubsub";

const AGENT_STATUS_CHANNEL_NAME = "redis:agent:status";
const QUIZ_AGENT_STATUS_CHANNEL_NAME = "redis:quiz-agent:status";

async function subscribe() {
  await subscriber.subscribe(
    AGENT_STATUS_CHANNEL_NAME,
    QUIZ_AGENT_STATUS_CHANNEL_NAME,
  );
}

export function registerAgentSocket(io: Server) {
  subscribe().catch((err) => {
    console.error("Failed to subscribe to Redis agent channels:", err);
  });

  subscriber.on("message", (channel, message) => {
    if (channel === AGENT_STATUS_CHANNEL_NAME) {
      const { jobId, topic, payload } = JSON.parse(message);
      io.to(`agent:${jobId}`).emit(topic, payload);
    } else if (channel === QUIZ_AGENT_STATUS_CHANNEL_NAME) {
      const { quizId, topic, payload } = JSON.parse(message);
      io.to(`quiz-agent:${quizId}`).emit(topic, payload);
    }
  });

  io.on("connection", (socket) => {
    socket.on("join:agent", (jobId: string) => {
      socket.join(`agent:${jobId}`);
    });
    socket.on("leave:agent", (jobId: string) => {
      socket.leave(`agent:${jobId}`);
    });
    socket.on("join:quiz-agent", (quizId: string) => {
      socket.join(`quiz-agent:${quizId}`);
    });
    socket.on("leave:quiz-agent", (quizId: string) => {
      socket.leave(`quiz-agent:${quizId}`);
    });
  });
}
