import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { useQuizStore, QuestionType } from "@/store/quizStore";

export function useLoadQuizData(quizId: string) {
  const { data, isLoading, isError } = trpc.quiz.getQuizForEdit.useQuery(
    { quizId },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const setInfo = useQuizStore((s) => s.setInfo);
  const setGlobalSettings = useQuizStore((s) => s.setGlobalSettings);
  const reorderQuestions = useQuizStore((s) => s.reorderQuestions);

  useEffect(() => {
    if (data && !isInitialized) {
      setInfo({
        title: data.quiz.title,
        description: data.quiz.description || "",
      });
      setGlobalSettings({
        passwordProtect: data.quiz.passwordNeeded,
        password: data.quiz.password || "",
      });
      const mappedQuestions = data.questions.map((q) => ({
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: (q.isTextAnswer
          ? "text_entry"
          : "multiple_choice") as QuestionType,
        text: q.text,
        options: (q.options || []).map((opt) => ({
          ...opt,
          id:
            (opt.id ? String(opt.id) : null) ||
            `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        })),
        acceptedAnswers: q.acceptedAnswers || "",
        timeLimit: q.timeLimitSecs,
        points: q.points,
        mediaUrl: q.mediaUrl || undefined,
        collapsed: true,
        allowMultipleCorrect: q.allowMultipleCorrect,
      }));

      reorderQuestions(mappedQuestions);
      setIsInitialized(true);
    }
  }, [data, isInitialized, setInfo, setGlobalSettings, reorderQuestions]);

  return { data, isLoading, isError, isInitialized };
}
