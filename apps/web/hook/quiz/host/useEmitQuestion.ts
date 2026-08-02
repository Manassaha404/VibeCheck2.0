"use client";

import { trpc } from "@/trpc/client";
import { useLiveSessionStore } from "@/store/liveSessionStore";
import socket from "@/lib/socket";
import type { LiveQuestion } from "@/store/participantStore";

interface UseEmitQuestionOptions {
  onSuccess?: (questionIndex: number) => void;
}

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
            setCurrentQuestion(data.currentQuestionIndex, timeLimitSecs);

            if (questionPayload) {
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
