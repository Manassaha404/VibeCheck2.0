import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { draftFormDto } from "@repo/services/form/model";

type DraftFormDtoType = z.infer<typeof draftFormDto>;

export const useDraftForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutateAsync: draftMutation, isPending: isDrafting } =
    trpc.form.createForm.useMutation();

  const handleDraft = async (data: DraftFormDtoType) => {
    setApiError(null);
    try {
      const response = await draftMutation(data);
      if (response?.form) {
        return true;
      }
      return false;
    } catch (error: any) {
      if (error.message === "slug already exists") {
        throw error;
      }
      setApiError(error.message || "Failed to draft form. Please try again.");
      return false;
    }
  };

  return { handleDraft, apiError, isDrafting, setApiError };
};
