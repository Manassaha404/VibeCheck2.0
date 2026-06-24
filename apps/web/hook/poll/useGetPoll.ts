"use client";

import { trpc } from "@/trpc/client";

export const useGetPoll = (slug: string, enabled: boolean = true) => {
  return trpc.poll.getPollBySlug.useQuery(
    { slug },
    {
      enabled: enabled && !!slug,
      retry: 1,
    }
  );
};
