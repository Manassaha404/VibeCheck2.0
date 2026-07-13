"use client";
import { useEffect, useRef, useCallback } from "react";
import socket from "@/lib/socket";
import type { LiveQuestion } from "@/store/participantStore";
export function useParticipantSocket(
  sessionId: string | null,
  userId: string | null | undefined,
  onQuestion: (question: LiveQuestion, index: number) => void,
  onSessionEnd: () => void,
  onRankUpdate: () => void,
  onRevealAnswer: (correctOptionIds: string[]) => void,
  onActivateSession: () => void,
  onParticipantJoin: () => void,
) {
  const joinedRef = useRef(false);

  // Stable refs so listeners don't re-register on every render
  const onQuestionRef = useRef(onQuestion);
  const onSessionEndRef = useRef(onSessionEnd);
  const onRankUpdateRef = useRef(onRankUpdate);
  const onRevealAnswerRef = useRef(onRevealAnswer);
  const onActivateSessionRef = useRef(onActivateSession);
  const onParticipantJoinRef = useRef(onParticipantJoin);
  onQuestionRef.current = onQuestion;
  onSessionEndRef.current = onSessionEnd;
  onRankUpdateRef.current = onRankUpdate;
  onRevealAnswerRef.current = onRevealAnswer;
  onActivateSessionRef.current = onActivateSession;
  onParticipantJoinRef.current = onParticipantJoin;

  useEffect(() => {
    if (!sessionId) return;
    if (joinedRef.current) return;

    socket.connect();
    socket.emit("join:participant:session", { sessionId });
    joinedRef.current = true;

    //handel emit question event by host
    const onEmitQuestion = (data: {
      questionPayload: LiveQuestion;
      questionIndex: number;
    }) => {
      onQuestionRef.current(data.questionPayload, data.questionIndex);
    };

    //handel emit end session event by host
    const onEnd = () => {
      onSessionEndRef.current();
    };

    //handel emit rank update event by host
    const onRank = () => {
      onRankUpdateRef.current();
    };

    //handel reveal answer by event the host
    const onReveal = (data: {
      questionId: string;
      correctOptionIds: string[];
    }) => {
      onRevealAnswerRef.current(data.correctOptionIds);
    };

    //handel activate session by event the host
    const onActivate = () => {
      onActivateSessionRef.current();
    };

    //handel participant join event
    const onParticipantJoinEvent = () => {
      onParticipantJoinRef.current();
    };

    socket.on("emit:question", onEmitQuestion);
    socket.on("end:session", onEnd);
    socket.on("update:rank", onRank);
    socket.on("reveal:answer", onReveal);
    socket.on("activate:session", onActivate);
    socket.on("participant:join", onParticipantJoinEvent);

    return () => {
      socket.off("emit:question", onEmitQuestion);
      socket.off("end:session", onEnd);
      socket.off("update:rank", onRank);
      socket.off("reveal:answer", onReveal);
      socket.off("activate:session", onActivate);
      socket.off("participant:join", onParticipantJoinEvent);
      socket.emit("leave:participant:session", sessionId);
      socket.disconnect();
      joinedRef.current = false;
    };
  }, [sessionId]);

  // Emit MCQ answer by the event
  const submitAnswer = useCallback(
    (sessionId: string, questionId: string, optionIds: string[]) => {
      socket.emit("submit:answer", {
        sessionId,
        optionIds,
        questionId,
        userId,
      });
    },
    [userId],
  );

  // Emit OpenEnded answer by the event
  const submitOpenEnded = useCallback(
    (sessionId: string, questionId: string, text: string) => {
      socket.emit("submit:answer", { sessionId, questionId, text, userId });
    },
    [userId],
  );
  return { submitAnswer, submitOpenEnded };
}
