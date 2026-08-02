"use client";

import { trpc } from "@/trpc/client";

export const useGetPlans = (interval?: "monthly" | "yearly") => {
  const { data, isLoading, isError, error, refetch } =
    trpc.subscription.getAllPlans.useQuery(
      { interval },
      {
        staleTime: 1000 * 60 * 5,
        retry: 2,
      },
    );

  return {
    plans: data?.plans ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
