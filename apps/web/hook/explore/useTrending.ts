"use client";

import { trpc } from "@/trpc/client";

/**
 * useTrending
 *
 * Fetches today's trending polls and petitions (most votes/signatures today).
 * Cached for 5 minutes, refetched on window focus.
 */
export function useTrending(limit = 6) {
  const query = trpc.explore.getTrending.useQuery(
    { limit },
    {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  );

  return {
    polls: query.data?.polls ?? [],
    petitions: query.data?.petitions ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
