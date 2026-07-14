import { Server } from "socket.io";
import { publisher, subscriber } from "@repo/redis/pubsub";
const PARTICIPANT_JOIN_CHANNEL_NAME = "redis:quiz:participant:join";
const EMIT_QUESTION_CHANNEL_NAME = "redis:quiz:emit:question";
const SUBMIT_ANSWER_CHANNEL_NAME = "redis:quiz:submit:answer";
const ACTIVATE_SESSION_CHANNEL_NAME = "redis:quiz:session:activate";
const REVEAL_ANSWER_CHANNEL_NAME = "redis:quiz:reveal:answer";
const END_SESSION_CHANNEL_NAME = "redis:quiz:session:end";

async function subscribe() {
  await subscriber.subscribe(
    PARTICIPANT_JOIN_CHANNEL_NAME,
    EMIT_QUESTION_CHANNEL_NAME,
    SUBMIT_ANSWER_CHANNEL_NAME,
    ACTIVATE_SESSION_CHANNEL_NAME,
    REVEAL_ANSWER_CHANNEL_NAME,
    END_SESSION_CHANNEL_NAME,
  );
}

export function registerQuizSocket(io: Server) {
  subscribe().catch((err) => {
    console.error("Failed to subscribe to Redis channels:", err);
  });

  subscriber.on("message", (channel, message) => {
    if (channel === PARTICIPANT_JOIN_CHANNEL_NAME) {
      const { sessionId } = JSON.parse(message);
      io.to(`quiz:session:participant:${sessionId}`).emit("participant:join");
      io.to(`quiz:session:${sessionId}`).emit("participant:join");
    } else if (channel === EMIT_QUESTION_CHANNEL_NAME) {
      const { sessionId, questionIndex, questionPayload } = JSON.parse(message);
      io.to(`quiz:session:participant:${sessionId}`).emit("emit:question", {
        questionPayload,
        questionIndex,
      });
    } else if (channel === SUBMIT_ANSWER_CHANNEL_NAME) {
      const { sessionId, optionIds, questionId, text } = JSON.parse(message);
      io.to(`quiz:session:${sessionId}`).emit("participant:answer", {
        optionIds,
        questionId,
        text,
      });
    } else if (channel === ACTIVATE_SESSION_CHANNEL_NAME) {
      const { sessionId } = JSON.parse(message);
      io.to(`quiz:session:participant:${sessionId}`).emit("activate:session");
    } else if (channel === REVEAL_ANSWER_CHANNEL_NAME) {
      const { sessionId, questionId, correctOptionIds } = JSON.parse(message);
      io.to(`quiz:session:participant:${sessionId}`).emit("reveal:answer", {
        questionId,
        correctOptionIds,
      });
      io.to(`quiz:session:participant:${sessionId}`).emit("update:rank");
    } else if (channel === END_SESSION_CHANNEL_NAME) {
      const { sessionId } = JSON.parse(message);
      io.to(`quiz:session:participant:${sessionId}`).emit("end:session");
    }
  });

  io.on("connection", (socket) => {
    socket.on("join:session", (sessionId) => {
      socket.join(`quiz:session:${sessionId}`);
    });
    socket.on("join:participant:session", async ({ sessionId }) => {
      socket.join(`quiz:session:participant:${sessionId}`);
      await publisher.publish(
        PARTICIPANT_JOIN_CHANNEL_NAME,
        JSON.stringify({ sessionId }),
      );
    });
    socket.on(
      "emit:question",
      async ({ sessionId, questionPayload, questionIndex }) => {
        await publisher.publish(
          EMIT_QUESTION_CHANNEL_NAME,
          JSON.stringify({ sessionId, questionIndex, questionPayload }),
        );
      },
    );
    socket.on(
      "submit:answer",
      async ({ sessionId, optionIds, questionId, text, userId }) => {
        await publisher.publish(
          SUBMIT_ANSWER_CHANNEL_NAME,
          JSON.stringify({ sessionId, optionIds, questionId, text, userId }),
        );
      },
    );
    socket.on("update:rank", ({ sessionId }) => {
      io.to(`quiz:session:participant:${sessionId}`).emit("update:rank");
    });
    socket.on("activate:session", async ({ sessionId }) => {
      await publisher.publish(
        ACTIVATE_SESSION_CHANNEL_NAME,
        JSON.stringify({ sessionId }),
      );
    });
    socket.on(
      "reveal:answer",
      async ({ sessionId, questionId, correctOptionIds }) => {
        await publisher.publish(
          REVEAL_ANSWER_CHANNEL_NAME,
          JSON.stringify({ sessionId, questionId, correctOptionIds }),
        );
      },
    );

    socket.on("end:session", async ({ sessionId }) => {
      await publisher.publish(
        END_SESSION_CHANNEL_NAME,
        JSON.stringify({ sessionId }),
      );
    });

    socket.on("leave:session", (sessionId) => {
      socket.leave(`quiz:session:${sessionId}`);
    });
    socket.on("leave:participant:session", (sessionId) => {
      socket.leave(`quiz:session:participant:${sessionId}`);
    });
  });
}
