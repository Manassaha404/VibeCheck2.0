"use client";

import { trpc } from "@/trpc/client";

/**
 * useDashboard
 *
 * Fires three separate tRPC queries in parallel — one per content type —
 * each calling its own dedicated service method so the DB queries stay
 * focused and easy to extend independently.
 */
export function useDashboard() {
  // useQueries fires all three in parallel — same as Promise.all semantics
  // but hook-safe (no await, no async wrapper needed)
  const [pollsQuery, formsQuery, petitionsQuery] = trpc.useQueries((t) => [
    t.poll.getDashboard(undefined, { staleTime: 1000 * 60 * 2, retry: 1 }),
    t.form.getDashboard(undefined, { staleTime: 1000 * 60 * 2, retry: 1 }),
    t.petition.getDashboard(undefined, { staleTime: 1000 * 60 * 2, retry: 1 }),
  ]);

  const isLoading =
    pollsQuery.isLoading || formsQuery.isLoading || petitionsQuery.isLoading;

  const isError =
    pollsQuery.isError || formsQuery.isError || petitionsQuery.isError;

  // ── Aggregate stats ────────────────────────────────────────────
  const totalPolls = pollsQuery.data?.total ?? 0;
  const totalForms = formsQuery.data?.total ?? 0;
  const totalPetitions = petitionsQuery.data?.total ?? 0;

  const totalResponses =
    (pollsQuery.data?.polls ?? []).reduce((s, p) => s + p.totalVotes, 0) +
    (formsQuery.data?.forms ?? []).reduce((s, f) => s + f.totalResponses, 0) +
    (petitionsQuery.data?.petitions ?? []).reduce(
      (s, p) => s + p.totalSignatures,
      0,
    );

  // ── Unified content list (sorted newest first) ─────────────────
  type ContentStatus = "draft" | "active" | "closed" | "archived";

  const allItems = [
    ...(pollsQuery.data?.polls ?? []).map((p) => ({
      id: p.pollId,
      type: "poll" as const,
      title: p.title,
      description: p.description,
      slug: p.slug,
      status: p.status as ContentStatus,
      responses: p.totalVotes,
      createdAt: p.createdAt,
    })),
    ...(formsQuery.data?.forms ?? []).map((f) => ({
      id: f.formId,
      type: "form" as const,
      title: f.title,
      description: f.description,
      slug: f.slug,
      status: f.status as ContentStatus,
      responses: f.totalResponses,
      createdAt: f.createdAt,
    })),
    ...(petitionsQuery.data?.petitions ?? []).map((p) => ({
      id: p.petitionId,
      type: "petition" as const,
      title: p.title,
      description: p.description,
      slug: p.slug,
      status: p.status as ContentStatus,
      responses: p.totalSignatures,
      createdAt: p.createdAt,
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return {
    // Raw per-type data
    polls: pollsQuery.data?.polls ?? [],
    forms: formsQuery.data?.forms ?? [],
    petitions: petitionsQuery.data?.petitions ?? [],

    // Unified + sorted list
    allItems,

    // Aggregate stats
    totalPolls,
    totalForms,
    totalPetitions,
    totalResponses,

    // Loading / error states
    isLoading,
    isError,

    // Refetch all
    refetch: () => {
      pollsQuery.refetch();
      formsQuery.refetch();
      petitionsQuery.refetch();
    },
  };
}
