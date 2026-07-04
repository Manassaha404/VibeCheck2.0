import { useState } from "react";
import { trpc } from "@/trpc/client";
import { useQuizStore } from "@/store/quizStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { uuidToNumber } from "@/utils/uuid";

export function useCreateQuiz() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizStore = useQuizStore();
  const createQuizMutation = trpc.quiz.createQuiz.useMutation();

  const submitQuiz = async () => {
    // Basic validation
    if (!quizStore.info.title.trim()) {
      toast.error("Quiz title is required.");
      return;
    }

    if (quizStore.questions.length === 0) {
      toast.error("Add at least one question to your quiz.");
      return;
    }

    // Format data from store to match DTO
    const payload = {
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
      const result = await createQuizMutation.mutateAsync(payload);
      toast.success("Quiz created successfully!");
      if(!result) {
        throw new Error("Quiz ID is missing in the response.");
      }
      // Optional: reset store after successful creation
      quizStore.reset();
      
      const quizId = result.quizId;
      const quizIdURL = uuidToNumber(quizId); // Convert UUID to number for URL
      router.push(`/dashboard/quiz/${quizIdURL}`); // Update with actual route later
      return result;
    } catch (error: any) {
      toast.error(error.message || "Failed to create quiz.");
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
