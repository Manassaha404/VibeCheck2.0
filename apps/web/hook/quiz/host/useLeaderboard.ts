import { useEffect, useRef, useState } from "react";
import { trpc } from "@/trpc/client";
import socket from "@/lib/socket";

export const useLeaderboard = (sessionId: string) => {
  const trpcUtils = trpc.useUtils();
  const query = trpc.quiz.getLeaderboardForSession.useQuery(
    { sessionId },
    {
      enabled: !!sessionId,
    },
  );

  const [revealedInfo, setRevealedInfo] = useState<{
    questionId: string;
    correctOptionIds: string[];
  } | null>(null);

  useEffect(() => {
    if (!revealedInfo) return;
    const t = setTimeout(() => {
      setRevealedInfo(null);
    }, 8000);
    return () => clearTimeout(t);
  }, [revealedInfo]);

  const joinedRef = useRef(false);
  useEffect(() => {
    if (!sessionId || joinedRef.current) return;

    socket.connect();
    socket.emit("join:participant:session", { sessionId });
    joinedRef.current = true;

    const onReveal = (data: {
      questionId: string;
      correctOptionIds: string[];
    }) => {
      setRevealedInfo(data);
      trpcUtils.quiz.getLeaderboardForSession.invalidate({ sessionId });
    };

    const onUpdateRank = () => {
      trpcUtils.quiz.getLeaderboardForSession.invalidate({ sessionId });
    };

    socket.on("reveal:answer", onReveal);
    socket.on("update:rank", onUpdateRank);

    return () => {
      socket.off("reveal:answer", onReveal);
      socket.off("update:rank", onUpdateRank);
      socket.disconnect();
      joinedRef.current = false;
    };
  }, [sessionId, trpcUtils]);

  return {
    ...query,
    revealedInfo,
  };
};
