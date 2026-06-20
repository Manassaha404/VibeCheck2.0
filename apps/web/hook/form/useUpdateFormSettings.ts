import { useState } from "react";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { updateFormSettingsDto } from "@repo/services/form/model";
import { toast } from "sonner";

type UpdateFormSettingsDtoType = z.infer<typeof updateFormSettingsDto>;

export const useUpdateFormSettings = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  
  const { mutateAsync: updateSettingsMutation, isPending: isUpdating } = trpc.form.updateFormSettings.useMutation();

  const handleUpdateSettings = async (data: UpdateFormSettingsDtoType) => {
    setApiError(null);
    try {
      const response = await updateSettingsMutation(data);
      if (response?.form) {
        toast.success("Settings updated successfully!");
        return true;
      }
      return false;
    } catch (error: any) {
      const msg = error.message || "Failed to update settings. Please try again.";
      setApiError(msg);
      toast.error(msg);
      return false;
    }
  };

  return { handleUpdateSettings, apiError, isUpdating, setApiError };
};
