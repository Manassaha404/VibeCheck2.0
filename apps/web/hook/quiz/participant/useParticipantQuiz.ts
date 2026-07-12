import { useState, useEffect, useCallback } from "react";
import { useParticipantStore, LiveQuestion } from "@/store/participantStore";
import { useGetSessionInfoForParticipant } from "@/hook/quiz/participant/useGetSessionInfoForParticipant";
import { useParticipantSocket } from "@/hook/quiz/participant/useParticipantSocket";
import { trpc } from "@/trpc/client";
import { useUserInfoStore } from "@/store/userInfoStore";

export function useParticipantQuiz(sessionId: string) {
  const userId = useUserInfoStore((s) => s.userId) ?? null;




  //password state
  const [passwordInput, setPasswordInput] = useState("");
  const [submittedPassword, setSubmittedPassword] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);






  //store and all actions 
  const store = useParticipantStore();





  //sessionInfo 
  const { data, isLoading, isError, error, refetch } = useGetSessionInfoForParticipant(sessionId);
  const verifyPasswordMutation = trpc.quiz.verifySessionPassword.useMutation();





  //set session data to store
  useEffect(() => {
    if (data?.session.status) {
      store.setSessionStatus(data.session.status as "waiting" | "active" | "ended");
    }
  }, [data?.session.status]);





  //set rank and score to store
  useEffect(() => {
    if (data?.participantData) {
      store.setRankAndScore(data.participantData.rank, data.participantData.score);
    }
  }, [data?.participantData]);




  //set quiz title to the document 
  useEffect(() => {
    if (data?.quiz.title) {
      document.title = `${data.quiz.title} | VibeCheck`;
    }
  }, [data?.quiz.title]);




  //timer effect
  useEffect(() => {
    if (!store.timerActive || store.timeLeft <= 0) {
      if (store.timeLeft <= 0 && store.timerActive) store.stopTimer();
      return;
    }
    const tick = setTimeout(() => store.tickTimer(), 1000);
    return () => clearTimeout(tick);
  }, [store.timerActive, store.timeLeft, store.tickTimer, store.stopTimer]);





  // socket callbacks 
  const handleQuestion = useCallback((question: LiveQuestion, index: number) => {
    store.resetQuestionState();
    store.setQuestion(question, index);
  }, [store]);

  const handleSessionEnd = useCallback(() => {
    store.setSessionStatus("ended");
    store.stopTimer();
  }, [store]);

  const handleRankUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRevealAnswer = useCallback((correctOptionIds: string[]) => {
    store.setRevealedAnswer(correctOptionIds);
  }, [store]);

  const handleActivateSession = useCallback(() => {
    store.setSessionStatus("active");
    refetch();
  }, [refetch, store]);

  const handleParticipantJoin = useCallback(() => {
    refetch();
  }, [refetch]);




  
  // wire up to socket 
  const { submitAnswer, submitOpenEnded } = useParticipantSocket(
    sessionId,
    userId,
    handleQuestion,
    handleSessionEnd,
    handleRankUpdate,
    handleRevealAnswer,
    handleActivateSession,
    handleParticipantJoin
  );

  //all actions
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setPasswordError(false);
    try {
      await verifyPasswordMutation.mutateAsync({
        sessionId,
        password: passwordInput.trim(),
      });
      setSubmittedPassword(passwordInput.trim());
      refetch();
    } catch (err: any) {
      if (err.message?.includes("started") || err.message?.includes("FORBIDDEN")) {
        refetch();
      } else {
        setPasswordError(true);
      }
    }
  };

  const submitBonusPointsMutation = trpc.quiz.submitBonusPoints.useMutation();

  const handleSubmitMCQ = () => {
    if (store.submitted || !store.currentQuestion) return;
    store.setSubmitted(true);

    const idsToSubmit = store.currentQuestion.allowMultipleCorrect
      ? store.selectedIds
      : store.selectedId
      ? [store.selectedId]
      : [];

    submitAnswer(sessionId, store.currentQuestion!.questionId, idsToSubmit);

    // Calculate bonus points based on milliseconds left
    if (store.questionStartTime) {
      const timeElapsedMs = Date.now() - store.questionStartTime;
      const timeLimitMs = store.currentQuestion.timeLimitSecs * 1000;
      const bonusPoints = Math.floor(Math.max(0, timeLimitMs - timeElapsedMs) / 1000);

      if (bonusPoints > 0) {
        submitBonusPointsMutation.mutate({
          sessionId,
          questionId: store.currentQuestion.questionId,
          optionIds: idsToSubmit,
          bonusPoints
        });
      }
    }
  };

  const handleSubmitOpenEnded = (text: string) => {
    if (store.submitted || !store.currentQuestion) return;
    store.setSubmitted(true);
    submitOpenEnded(sessionId, store.currentQuestion.questionId, text);
  };

  return {
    // Queries
    data,
    isLoading,
    isError,
    error,
    // Form state
    passwordInput,
    setPasswordInput,
    submittedPassword,
    showPassword,
    setShowPassword,
    passwordError,
    setPasswordError,
    handlePasswordSubmit,
    // Store state
    store,
    // Submission
    handleSubmitMCQ,
    handleSubmitOpenEnded,
  };
}
