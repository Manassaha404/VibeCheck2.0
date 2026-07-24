//perfectly fine
import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useQuizStore } from "@/store/quizStore";
import { useRouter } from "next/navigation";
import { uuidToNumber } from "@/utils/uuid";

export function usePublishDraftQuiz(quizId: string) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizStore = useQuizStore();
  const publishMutation = trpc.quiz.publishDraftQuiz.useMutation();
  const trpcUtils = trpc.useUtils();

  const publishQuiz = async () => {
    if (quizStore.questions.length === 0) {
      return;
    }

    const payload = {
      quizId,
      questions: quizStore.questions.map((q) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.options,
        acceptedAnswers: q.acceptedAnswers || undefined,
        timeLimit: q.timeLimit,
        points: q.points,
        mediaUrl: q.mediaUrl,
        allowMultipleCorrect: q.allowMultipleCorrect,
      })),
    };

    try {
      setIsSubmitting(true);
      const result = await publishMutation.mutateAsync(payload);

      if (!result) {
        throw new Error("Failed to publish quiz.");
      }

      quizStore.reset();

      trpcUtils.quiz.getDashboard.invalidate();

      const quizIdURL = uuidToNumber(quizId);
      router.push(`/dashboard/quiz/${quizIdURL}`);
      return result;
    } catch (error: any) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { publishQuiz, isSubmitting };
}
