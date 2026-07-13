"use client";

import { trpc } from "@/trpc/client";
import { useLiveSessionStore } from "@/store/liveSessionStore";
import socket from "@/lib/socket";
import type { LiveQuestion } from "@/store/participantStore";

interface UseEmitQuestionOptions {
  /** Called after the question is successfully emitted */
  onSuccess?: (questionIndex: number) => void;
}

/**
 * Emits a specific question to all participants.
 *
 * 1. Calls the tRPC mutation to persist the new `currentQuestionIndex` in DB + Redis.
 * 2. On tRPC success, updates the `liveSessionStore` (resets the per-question timer).
 * 3. Also emits the `emit:question` socket event so participants receive the full
 *    question payload in real-time — no polling required.
 *
 * @param timeLimitSecs  - The time limit (seconds) for the question being emitted.
 *                         Should be updated to match the question that will be emitted.
 * @param options        - Optional callbacks
 */
export const useEmitQuestion = (options: UseEmitQuestionOptions = {}) => {
  const setCurrentQuestion = useLiveSessionStore((s) => s.setCurrentQuestion);

  const mutation = trpc.quiz.emitQuestion.useMutation({
    onSuccess: (data, variables) => {
      if (data?.currentQuestionIndex !== undefined) {
        options.onSuccess?.(data.currentQuestionIndex);
      }
    },
    onError: (error) => {
      console.error("Failed to emit question:", error.message);
    },
  });

  /**
   * Call to emit a question.
   * @param sessionId       - The UUID of the session
   * @param questionIndex   - The 0-based index of the question to emit
   * @param timeLimitSecs   - The time limit (seconds) for the question being emitted
   * @param questionPayload - The full question object to broadcast via socket
   */
  const emitQuestion = (
    sessionId: string,
    questionIndex: number,
    timeLimitSecs: number,
    questionPayload?: LiveQuestion | null,
  ) => {
    mutation.mutate(
      { sessionId, questionIndex },
      {
        onSuccess: (data) => {
          if (data?.currentQuestionIndex !== undefined) {
            // 1. Update local store (starts the countdown timer)
            setCurrentQuestion(data.currentQuestionIndex, timeLimitSecs);

            if (questionPayload) {
              // Broadcast to participants via socket immediately after tRPC succeeds
              socket.emit("emit:question", {
                sessionId,
                questionPayload,
                questionIndex: data.currentQuestionIndex,
              });
            }
          }
        },
      },
    );
  };

  return {
    ...mutation,
    emitQuestion,
  };
};
