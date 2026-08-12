//perfectly fine

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useQuizStore } from "@/store/quizStore";
import { useRouter } from "next/navigation";
import { uuidToNumber } from "@/utils/uuid";
import { useSubscriptionGuard } from "@/providers/subscription-guard-provider";

export function useInitDraftQuiz() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizStore = useQuizStore();
  const initDraftMutation = trpc.quiz.initDraftQuiz.useMutation();
  const { showLimitAlert } = useSubscriptionGuard();

  const initDraft = async () => {
    if (!quizStore.info.title.trim()) {
      return;
    }
    const payload = {
      info: {
        title: quizStore.info.title.trim(),
        description: quizStore.info.description.trim() || undefined,
      },
    };

    try {
      setIsSubmitting(true);
      const result = await initDraftMutation.mutateAsync(payload);

      if (!result) {
        throw new Error("Failed to create quiz draft.");
      }

      const quizId = result.quizId;
      const quizIdURL = uuidToNumber(quizId);
      router.push(`/create/quiz/draft/${quizIdURL}`);
      return result;
    } catch (error: any) {
      const message: string = error?.message ?? "";
      if (message.startsWith("PLAN_LIMIT_EXCEEDED:")) {
        showLimitAlert(message.replace("PLAN_LIMIT_EXCEEDED:", "").trim());
        return;
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { initDraft, isSubmitting };
}

