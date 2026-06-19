import { trpc } from "@/trpc/client";

export const useFormAnalytics = (formSlug: string | null) => {
  const { data, isLoading, isError, error, refetch } =
    trpc.form.getFormAnalytics.useQuery(
      { formSlug: formSlug ?? "" },
      {
        enabled: !!formSlug,
        staleTime: 1000 * 60 * 2, 
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
