"use client";

import { trpc } from "@/trpc/client";
import { useLiveSessionStore } from "@/store/liveSessionStore";

interface UseActivateSessionOptions {
  onSuccess?: () => void;
}

/**
 * Manually activates a waiting session.
 * Calls the server to cancel the pending auto-active queue job and sets status to "active".
 * On success, also resets the liveSessionStore to a fresh active state.
 */
export const useActivateSession = (options: UseActivateSessionOptions = {}) => {
  const initSession = useLiveSessionStore((s) => s.initSession);

  const mutation = trpc.quiz.manuallyActivateSession.useMutation({
    onSuccess: (_data, variables) => {
      // Re-init live session store for the now-active session
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
