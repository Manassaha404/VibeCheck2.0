"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { z } from "zod";
import { savePollDraftDto } from "@repo/services/poll/model";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type SavePollDraftDtoType = z.infer<typeof savePollDraftDto>;

export const usePublishPoll = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync: saveDraftMutation } = trpc.poll.saveDraft.useMutation();
  const { mutateAsync: addTagsMutation } = trpc.tag.addTagsToPolls.useMutation();
  const { mutateAsync: setPollActiveMutation } = trpc.poll.setPollActive.useMutation();
  
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async (pollId: string, draftData: SavePollDraftDtoType, tags: string[]) => {
    setApiError(null);
    setIsPublishing(true);
    try {
      // 1. Save Poll
      await saveDraftMutation({ pollId, data: draftData });
      
      // 2. Add Tags
      await addTagsMutation({ pollId, tags });
      
      // 3. Change status to active
      await setPollActiveMutation({ pollId });
      
      toast.success("Poll published successfully!");
      return true;
    } catch (error: any) {
      const msg = error.message || "Failed to publish poll. Please try again.";
      setApiError(msg);
      toast.error(msg);
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  return { handlePublish, apiError, isPublishing, setApiError };
};
