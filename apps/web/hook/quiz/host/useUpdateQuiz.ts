import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useQuizStore } from "@/store/quizStore";

import { useRouter } from "next/navigation";
import { uuidToNumber } from "@/utils/uuid";

export function useUpdateQuiz(quizId: string) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizStore = useQuizStore();
  const updateQuizMutation = trpc.quiz.updateQuiz.useMutation();
  const trpcUtils = trpc.useUtils();

  const submitQuiz = async () => {
    
    if (!quizStore.info.title.trim()) {
      return;
    }

    if (quizStore.questions.length === 0) {
      return;
    }

    const payload = {
      quizId,
      info: {
        title: quizStore.info.title.trim(),
        description: quizStore.info.description.trim() || undefined,
      },
      globalSettings: quizStore.globalSettings,
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
      const result = await updateQuizMutation.mutateAsync(payload);

      if (!result) {
        throw new Error("Quiz ID is missing in the response.");
      }

      quizStore.reset();

      trpcUtils.quiz.getDashboard.invalidate();
      trpcUtils.quiz.getQuizDashboard.invalidate({ quizId });
      trpcUtils.quiz.getQuizForEdit.invalidate({ quizId });

      const quizIdURL = uuidToNumber(quizId);
      router.push(`/dashboard/quiz/${quizIdURL}`);
      return result;
    } catch (error: any) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitQuiz,
    isSubmitting,
  };
}
