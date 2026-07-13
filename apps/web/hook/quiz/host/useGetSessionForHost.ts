"use client";

import { trpc } from "@/trpc/client";

/**
 * Fetches all data the host session page needs:
 * - Session info (status, joinCode, autoActivatesAt, currentQuestionIndex)
 * - Quiz info (title, description)
 * - Questions array
 * - Redis live state (when session is active)
 *
 * Polls every 5 seconds so that:
 *  - Waiting stage: status change to "active" is picked up automatically
 *  - Active stage: currentQuestionIndex stays in sync
 */
export const useGetSessionForHost = (sessionId: string | null) => {
  const { data, isLoading, isError, error, refetch } =
    trpc.quiz.getSessionForHost.useQuery(
      { sessionId: sessionId ?? "" },
      {
        enabled: !!sessionId,
        refetchInterval: 20000,
        staleTime: 0,
        retry: 1,
      },
    );

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
