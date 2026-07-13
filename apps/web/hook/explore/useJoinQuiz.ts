"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

import { uuidToNumber } from "@/utils/uuid";

export function useJoinQuiz() {
  const router = useRouter();

  // ── Join by code ────────────────────────────────────────────────────────────
  const [joinCode, setJoinCode] = useState("");
  const joinMutation = trpc.explore.joinQuizByCode.useMutation();

  const handleJoin = useCallback(async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) {
      return;
    }

    try {
      const result = await joinMutation.mutateAsync({ joinCode: code });

      if (result?.status === "ended") {
        return;
      }

      if (result?.status === "waiting" || result?.status === "active") {
        const shortId = uuidToNumber(result.sessionId);
        router.replace(`/q/${shortId}`);
      }
    } catch (err: any) {
      const msg = err?.message ?? "";
      if (msg.includes("NOT_FOUND")) {
        // toast.error("No session found with that code. Check and try again.");
      } else {
        // toast.error("Something went wrong. Please try again.");
      }
    }
  }, [joinCode, joinMutation, router]);

  return {
    joinCode,
    setJoinCode,
    isJoining: joinMutation.isPending,
    handleJoin,
  };
}
