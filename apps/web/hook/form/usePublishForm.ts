import { useState } from "react";
import { trpc } from "@/trpc/client";
import { success, z } from "zod";
import { saveDraftFormDto } from "@repo/services/form/model";
import { toast } from "sonner";

type SaveDraftFormDtoType = z.infer<typeof saveDraftFormDto>;

export const usePublishForm = () => {
  
  const [apiError, setApiError] = useState<string | null>(null);
  
  const { mutateAsync: publishFormMutation, isPending: isPublishing } = trpc.form.publishForm.useMutation();

  const handlePublishForm = async (data: SaveDraftFormDtoType) => {
    setApiError(null);
    try {
      const response = await publishFormMutation(data);
      if (response?.form) {
        return {success: true, formSlug: response.form.slug}
      }
      return {success:false}
    } catch (error: any) {
      const msg = error.message || "Failed to publish form. Please try again.";
      setApiError(msg);
      toast.error(msg);
      return {success:false}
    }
  };

  return { handlePublishForm, apiError, isPublishing, setApiError };
};
