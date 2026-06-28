"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { createPetitionDto } from "@repo/services/petition/model";

type CreatePetitionDtoType = z.infer<typeof createPetitionDto>;

export const useCreatePetition = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync: createPetitionMutation, isPending: isCreating } =
    trpc.petition.createPetition.useMutation();

  const handleCreate = async (data: CreatePetitionDtoType) => {
    setApiError(null);
    try {
      const response = await createPetitionMutation(data);
      if (response?.petition) {
        router.replace(`/dashboard/analytics/petition/${response.petition.slug}`);
        return response.petition;
      }
      return null;
    } catch (error: any) {
      setApiError(error.message || "Failed to create petition. Please try again.");
      return null;
    }
  };

  return { handleCreate, apiError, isCreating, setApiError };
};
