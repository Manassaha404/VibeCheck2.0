import { trpc } from "@/trpc/client";

interface UseFormResponsesOptions {
  formSlug: string | null;
  page?: number;
  limit?: number;
  search?: string;
}

export const useFormResponses = ({
  formSlug,
  page = 1,
  limit = 10,
  search = "",
}: UseFormResponsesOptions) => {
  const { data, isLoading, isError, error, refetch } =
    trpc.form.getFormResponses.useQuery(
      {
        formSlug: formSlug ?? "",
        page,
        limit,
        search: search || undefined,
      },
      {
        enabled: !!formSlug,
        staleTime: 1000 * 60, // 1 minute
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
