"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { savePollDraftDto } from "@repo/services/poll/model";
import { toast } from "sonner";

type SavePollDraftDtoType = z.infer<typeof savePollDraftDto>;

export const useSaveDraft = () => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { mutateAsync: saveDraftMutation, isPending: isSaving } =
    trpc.poll.saveDraft.useMutation();

  const handleSave = async (pollId: string, data: SavePollDraftDtoType) => {
    setApiError(null);
    try {
      const response = await saveDraftMutation({ pollId, data });
      if (response?.success) {
        toast.success("Draft saved successfully!");
        return response;
      }
      return null;
    } catch (error: any) {
      const msg = error.message || "Failed to save draft. Please try again.";
      setApiError(msg);
      toast.error(msg);
      return null;
    }
  };

  return { handleSave, apiError, isSaving, setApiError };
};
