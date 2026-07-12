"use client";

import { trpc } from "@/trpc/client";

export const useGetQuizDashboard = (quizId: string | null) => {
  const { data, isLoading, isError, error, refetch } =
    trpc.quiz.getQuizDashboard.useQuery(
      { quizId: quizId ?? "" },
      {
        enabled: !!quizId,
        staleTime: 1000 * 60 * 2,
        retry: 1,
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
