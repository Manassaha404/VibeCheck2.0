import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useQuizStore } from "@/store/quizStore";
import { useRouter } from "next/navigation";
import { uuidToNumber } from "@/utils/uuid";

/**
 * Step 1 hook — reads title/description/settings from the quiz store,
 * calls initDraftQuiz to create a DB draft, then navigates to Step 2.
 */
export function useInitDraftQuiz() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizStore = useQuizStore();
  const initDraftMutation = trpc.quiz.initDraftQuiz.useMutation();

  const initDraft = async () => {
    if (!quizStore.info.title.trim()) {
      return;
    }

    const payload = {
      info: {
        title: quizStore.info.title.trim(),
        description: quizStore.info.description.trim() || undefined,
      },
      globalSettings: quizStore.globalSettings,
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
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { initDraft, isSubmitting };
}
