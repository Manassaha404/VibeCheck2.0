"use client";

import { trpc } from "@/trpc/client";

export const useGetSessionAnalytics = (sessionId: string | null) => {
  const { data, isLoading, isError, error, refetch } =
    trpc.quiz.getSessionAnalytics.useQuery(
      { sessionId: sessionId ?? "" },
      {
        enabled: !!sessionId,
        staleTime: 1000 * 60 * 2,
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
