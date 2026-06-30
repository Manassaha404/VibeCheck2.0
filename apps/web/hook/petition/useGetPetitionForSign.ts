"use client";

import { trpc } from "@/trpc/client";

export const useGetPetitionForSign = (username: string, slug: string) => {
  const { data, isLoading, isError, error, refetch } = trpc.petition.getPetitionForSign.useQuery({
    username,
    slug,
  }, {
    enabled: !!username && !!slug,
  });

  return { data, isLoading, isError, error, refetch };
};
