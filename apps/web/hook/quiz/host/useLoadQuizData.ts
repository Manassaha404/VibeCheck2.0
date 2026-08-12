import { useState, useEffect, useRef } from "react";
import { trpc } from "@/trpc/client";
import { useQuizStore, QuestionType } from "@/store/quizStore";

export function useLoadQuizData(quizId: string) {
  const { data, isLoading, isError } = trpc.quiz.getQuizForEdit.useQuery(
    { quizId },
    {
      // Allow tRPC to fetch fresh data every time the page mounts.
      // Previously refetchOnMount:false caused the page to show stale/empty
      // data on navigation and only work after a hard refresh.
      refetchOnWindowFocus: false,
    },
  );
  const [isInitialized, setIsInitialized] = useState(false);

  const setInfo = useQuizStore((s) => s.setInfo);
  const setGlobalSettings = useQuizStore((s) => s.setGlobalSettings);
  const reorderQuestions = useQuizStore((s) => s.reorderQuestions);
  const reset = useQuizStore((s) => s.reset);

  // Track the previous quizId so we only reset when it genuinely changes
  // (not on initial mount — which would race with the data-loader effect).
  const prevQuizIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (prevQuizIdRef.current !== null && prevQuizIdRef.current !== quizId) {
      // User navigated to a different quiz — clear the store so stale data
      // from the previous quiz doesn't flash while the new data loads.
      reset();
      setIsInitialized(false);
    }
    prevQuizIdRef.current = quizId;
  }, [quizId, reset]);

  useEffect(() => {
    if (data && !isInitialized) {
      setInfo({
        title: data.quiz.title,
        description: data.quiz.description || "",
      });

      // Derive sensible defaults for the global settings panel from the first
      // question so the UI reflects what's actually saved rather than store defaults.
      const firstQ = data.questions[0];
      const derivedTimeLimit = firstQ?.timeLimitSecs ?? 30;
      const derivedPoints = firstQ?.points ?? 10;

      setGlobalSettings({
        passwordProtect: data.quiz.passwordNeeded,
        password: data.quiz.password || "",
        // isBonusPointsEnabled is now correctly persisted via publishDraftQuiz.
        isBonusPointsEnabled: data.quiz.isBonusPointsEnabled ?? false,
        defaultTimeLimit: derivedTimeLimit,
        defaultPoints: derivedPoints,
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
