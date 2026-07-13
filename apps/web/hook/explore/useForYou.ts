"use client";

import { useEffect, useRef, useCallback } from "react";
import { trpc } from "@/trpc/client";

const PAGE_SIZE = 8;

/**
 * useForYou
 *
 * Infinite-scroll paginated feed of personalised (or latest public) polls
 * and petitions.
 *
 * tRPC v11: useInfiniteQuery passes `cursor` into the input automatically
 * via `initialCursor`. The `limit` field is the stable part of the input.
 *
 * Usage:
 *   const { items, isLoading, isFetchingNextPage, hasNextPage, sentinelRef } = useForYou();
 */
export function useForYou(limit = PAGE_SIZE, type?: "poll" | "petition") {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
    error,
  } = trpc.explore.getForYouPage.useInfiniteQuery(
    { limit, type },
    {
      getNextPageParam: (lastPage) =>
        lastPage?.nextCursor != null ? lastPage.nextCursor : undefined,
      initialCursor: 0,
      staleTime: 1000 * 60 * 3,
      refetchOnWindowFocus: false,
    },
  );

  const allItems = data?.pages.flatMap((p) => p?.items ?? []) ?? [];
  const isPersonalised = data?.pages[0]?.isPersonalised ?? false;

  // IntersectionObserver — fires fetchNextPage when sentinel scrolls into view
  const fetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNext();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNext]);

  return {
    items: allItems,
    isPersonalised,
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    sentinelRef,
    isError,
    error,
  };
}
