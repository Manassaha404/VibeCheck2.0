import { useState, useEffect } from "react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface UseSaveItemProps {
  formId?: string;
  pollId?: string;
  petitionId?: string;
}

export const useSaveItem = ({
  formId,
  pollId,
  petitionId,
}: UseSaveItemProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.auth.checkSavedStatus.useQuery(
    { formId, pollId, petitionId },
    {
      enabled: !!(formId || pollId || petitionId),
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (data !== undefined) {
      setIsSaved(data.isSaved);
    }
  }, [data]);

  const toggleMutation = trpc.auth.toggleSaveItem.useMutation({
    onMutate: async () => {
      // Optimistic update
      setIsSaved((prev) => !prev);
    },
    onSuccess: (result) => {
      if (!result) return;
      setIsSaved(result.isSaved);
      if (result.isSaved) {
        toast.success(result.message || "Saved successfully");
      } else {
        toast.success(result.message || "Removed from saves");
      }
      utils.auth.getSavedItems.invalidate();
    },
    onError: (err) => {
      // Revert on error
      setIsSaved((prev) => !prev);
      toast.error(err.message || "Something went wrong");
    },
  });

  const toggleSave = () => {
    if (formId || pollId || petitionId) {
      toggleMutation.mutate({ formId, pollId, petitionId });
    }
  };

  return {
    isSaved,
    isLoading,
    toggleSave,
    isToggling: toggleMutation.isPending,
  };
};
