import { trpc } from "@/trpc/client";
import { useState } from "react";

export type SavedFilterType = "ALL" | "POLLS" | "FORMS" | "PETITIONS";

export const useSaved = () => {
  const [filter, setFilter] = useState<SavedFilterType>("ALL");

  const { data, isLoading, error, refetch } = trpc.auth.getSavedItems.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  const savedItems = data?.data || [];

  const filteredItems = savedItems.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "POLLS") return !!item.polls;
    if (filter === "FORMS") return !!item.forms;
    if (filter === "PETITIONS") return !!item.petitions;
    return true;
  });

  return {
    savedItems: filteredItems,
    isLoading,
    error,
    filter,
    setFilter,
    refetch,
  };
};
