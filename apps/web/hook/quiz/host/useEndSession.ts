"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useLiveSessionStore } from "@/store/liveSessionStore";

interface UseEndSessionOptions {
  quizId: string;
  /** Override redirect path; defaults to analytics page */
  redirectPath?: string;
  onSuccessCallback?: (sessionId: string) => void;
}

/**
 * Ends the active quiz session.
 *
 * 1. Calls the tRPC mutation to mark the session as "ended" in DB + Redis finalization.
 * 2. On success, calls the onSuccessCallback so the caller can emit the socket event.
 * 3. Clears the liveSessionStore and redirects the host to the session analytics page.
 */
export const useEndSession = ({ quizId, redirectPath, onSuccessCallback }: UseEndSessionOptions) => {
  const router = useRouter();
  const reset = useLiveSessionStore((s) => s.reset);

  const mutation = trpc.quiz.endSession.useMutation({
    onSuccess: (_data, variables) => {
      // Notify all participants via socket
      if (onSuccessCallback) {
        onSuccessCallback(variables.sessionId);
      }

      reset();
      const target =
        redirectPath ??
        `/dashboard/quiz/${quizId}/session/analytics/${variables.sessionId}`;
      router.replace(target);
    },
    onError: (error) => {
      console.error("Failed to end session:", error.message);
    },
  });

  const endSession = (sessionId: string) => {
    mutation.mutate({ sessionId });
  };

  return {
    ...mutation,
    endSession,
  };
};
