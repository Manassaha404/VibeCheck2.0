"use client";

import { trpc } from "@/trpc/client";
import { useLiveSessionStore } from "@/store/liveSessionStore";

interface UseActivateSessionOptions {
  onSuccess?: () => void;
}

export const useActivateSession = (options: UseActivateSessionOptions = {}) => {
  const initSession = useLiveSessionStore((s) => s.initSession);
  const mutation = trpc.quiz.manuallyActivateSession.useMutation({
    onSuccess: (_data, variables) => {
      initSession(variables.sessionId, {
        currentQuestionIndex: -1,
        voteTallies: {},
      });
      options.onSuccess?.();
    },
    onError: (error) => {
      console.error("Failed to activate session:", error.message);
    },
  });

  const activateSession = (sessionId: string) => {
    mutation.mutate({ sessionId });
  };

  return {
    ...mutation,
    activateSession,
  };
};
