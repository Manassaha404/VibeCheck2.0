"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { signPetitionDto } from "@repo/services/petition/model";

type SignPetitionDtoType = z.infer<typeof signPetitionDto>;

export const useSignPetition = () => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutateAsync: signPetitionMutation, isPending: isSigning } =
    trpc.petition.signPetition.useMutation();

  const handleSign = async (data: SignPetitionDtoType) => {
    setApiError(null);
    try {
      const response = await signPetitionMutation(data);
      return response;
    } catch (error: any) {
      setApiError(error.message || "Failed to sign petition. Please try again.");
      return null;
    }
  };

  return { handleSign, apiError, isSigning, setApiError };
};
