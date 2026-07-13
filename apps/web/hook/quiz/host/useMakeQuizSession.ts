import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { numberToUuid, uuidToNumber } from "@/utils/uuid";

export const useMakeQuizSession = (
  quizIdParam: string,
  onSuccessCallback?: () => void,
) => {
  const router = useRouter();

  const mutation = trpc.quiz.makeQuizSession.useMutation({
    onSuccess: (data) => {
      if (data?.sessionId) {
        onSuccessCallback?.();
        const sessionIdParam = uuidToNumber(data.sessionId);
        router.push(`/dashboard/quiz/${quizIdParam}/session/${sessionIdParam}`);
      }
    },
    onError: (error) => {
      console.error("Failed to create quiz session", error);
    },
  });

  const handleStartSession = async (sessionName: string) => {
    if (!sessionName.trim()) return;

    // We use mutate instead of mutateAsync here since the success/error handling
    // is now managed by the mutation configuration above.
    mutation.mutate({
      quizId: numberToUuid(quizIdParam),
      sessionName: sessionName.trim(),
    });
  };

  return {
    ...mutation,
    handleStartSession,
  };
};
