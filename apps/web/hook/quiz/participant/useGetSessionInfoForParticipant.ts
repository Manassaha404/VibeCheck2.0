"use client";

import { trpc } from "@/trpc/client";


export const useGetSessionInfoForParticipant = (
  sessionId: string | null,
) => {
  const { data, isLoading, isError, error, refetch } =
    trpc.quiz.getSessionInfoForParticipant.useQuery(
      { sessionId: sessionId ?? "" },
      {
        enabled: !!sessionId,
        staleTime: 1000 * 60 * 5, 
        retry: false,
      }
    );

  return {
    data: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
