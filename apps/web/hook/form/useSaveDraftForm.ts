import { useState } from "react";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { saveDraftFormDto } from "@repo/services/form/model";

type SaveDraftFormDtoType = z.infer<typeof saveDraftFormDto>;

export const useSaveDraftForm = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  
  const { mutateAsync: saveDraftMutation, isPending: isSaving } = trpc.form.saveDraft.useMutation();

  const handleSaveDraft = async (data: SaveDraftFormDtoType) => {
    setApiError(null);
    try {
      const response = await saveDraftMutation(data);
      if (response?.form) {
        return true;
      }
      return false;
    } catch (error: any) {
      setApiError(error.message || "Failed to save draft. Please try again.");
      return false;
    }
  };

  return { handleSaveDraft, apiError, isSaving, setApiError };
};
