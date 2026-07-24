"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import socket from "@/lib/socket";
import { useLiveSessionStore, VoteTallies } from "@/store/liveSessionStore";
import type { FeedMessage } from "@/components/live-session/LiveFeedMasonry";

export function useHostSocket(
  sessionId: string | null,
  initialParticipantCount: number = 0,
  setOpenEndedMessages?: React.Dispatch<React.SetStateAction<FeedMessage[]>>,
) {
  const [participantCount, setParticipantCount] = useState(
    initialParticipantCount,
  );

  useEffect(() => {
    setParticipantCount(initialParticipantCount);
  }, [initialParticipantCount]);

  const mergeVoteTallies = useLiveSessionStore((s) => s.mergeVoteTallies);
  
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;
    if (joinedRef.current) return;

    
    socket.connect();
    socket.emit("join:session", sessionId);
    joinedRef.current = true;

    
    const onParticipantJoin = () => {
      setParticipantCount((c) => c + 1);
    };

    
    const onParticipantAnswer = (payload: {
      optionIds?: string[];
      questionId?: string;
      text?: string;
    }) => {
      if (
        payload.questionId &&
        payload.optionIds &&
        payload.optionIds.length > 0
      ) {
        
        const questionTallies: Record<string, number> = {};
        for (const id of payload.optionIds) {
          questionTallies[id] = 1;
        }
        const incoming: VoteTallies = { [payload.questionId]: questionTallies };
        mergeVoteTallies(incoming);
      } else if (payload.text && setOpenEndedMessages) {
        
        const feedMsg: FeedMessage = {
          id: `${Date.now()}-${Math.random()}`,
          authorInitial: "?",
          authorName: "Participant",
          text: payload.text,
          colorClass: "bg-[var(--color-sky-blue)]",
          isRightAligned: false,
        };
        setOpenEndedMessages((prev) => [feedMsg, ...prev]);
      }
    };

    socket.on("participant:join", onParticipantJoin);
    socket.on("participant:answer", onParticipantAnswer);

    return () => {
      socket.emit("leave:session", sessionId);
      socket.off("participant:join", onParticipantJoin);
      socket.off("participant:answer", onParticipantAnswer);
      socket.disconnect();
      joinedRef.current = false;
    };
  }, [sessionId, mergeVoteTallies, setOpenEndedMessages]);

  /**
   * Emit a reveal:answer event from the host.
   * The socket server relays it to all participants so they can highlight the correct option(s).
   */
  const revealAnswer = useCallback(
    (sessionId: string, questionId: string, correctOptionIds: string[]) => {
      socket.emit("reveal:answer", { sessionId, questionId, correctOptionIds });
    },
    [],
  );

  const emitSessionActivated = useCallback((sessionId: string) => {
    socket.emit("activate:session", { sessionId });
  }, []);

  const emitSessionEnded = useCallback((sessionId: string) => {
    socket.emit("end:session", { sessionId });
  }, []);

  return {
    participantCount,
    revealAnswer,
    emitSessionActivated,
    emitSessionEnded,
  };
}
