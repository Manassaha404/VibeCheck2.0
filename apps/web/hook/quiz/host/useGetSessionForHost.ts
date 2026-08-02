"use client";

import { trpc } from "@/trpc/client";

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
