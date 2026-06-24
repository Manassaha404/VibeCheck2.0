"use client";

import { trpc } from "@/trpc/client";

export const useTopTags = () => {
  return trpc.tag.getTopTags.useQuery(undefined, {
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes
  });
};
