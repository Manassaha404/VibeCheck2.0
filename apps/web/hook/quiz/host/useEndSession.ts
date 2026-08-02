"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useLiveSessionStore } from "@/store/liveSessionStore";

interface UseEndSessionOptions {
  quizId: string;
  redirectPath?: string;
  onSuccessCallback?: (sessionId: string) => void;
}

export const useEndSession = ({
  quizId,
  redirectPath,
  onSuccessCallback,
}: UseEndSessionOptions) => {
  const router = useRouter();
  const reset = useLiveSessionStore((s) => s.reset);

  const mutation = trpc.quiz.endSession.useMutation({
    onSuccess: (_data, variables) => {
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
