"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { createPollDto } from "@repo/services/poll/model";
import { usePollStore } from "@/store/pollStore";

type CreatePollDtoType = z.infer<typeof createPollDto>;

export const useCreatePoll = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync: createPollMutation, isPending: isCreating } =
    trpc.poll.createPoll.useMutation();

  const handleCreate = async (data: CreatePollDtoType) => {
    setApiError(null);
    try {
      const response = await createPollMutation(data);
      if (response?.poll) {
        usePollStore.getState().setCurrentPoll(response.poll);
        router.replace(`/create/poll/draft/${response.poll.slug}`);
        return response.poll;
      }
      return null;
    } catch (error: any) {
      setApiError(error.message || "Failed to create poll. Please try again.");
      return null;
    }
  };

  return { handleCreate, apiError, isCreating, setApiError };
};
