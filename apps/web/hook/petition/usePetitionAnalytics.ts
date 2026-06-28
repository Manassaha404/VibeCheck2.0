import { trpc } from "@/trpc/client";

export const usePetitionAnalytics = (slug: string | null) => {
  const { data, isLoading, isError, error, refetch } =
    trpc.petition.getAnalytics.useQuery(
      { slug: slug ?? "" },
      {
        enabled: !!slug,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 1,
      },
    );

  return {
    analytics: data ?? null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
