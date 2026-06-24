import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PollDraftFormValues } from "../components/poll-builder/draft/schema";
import { createPollDto } from "@repo/services/poll/model";
import { z } from "zod";

type CreatePollFormValues = z.infer<typeof createPollDto>;

interface PollState {
  setup: CreatePollFormValues | null;
  draft: PollDraftFormValues | null;
  currentPoll: any | null;
  setSetup: (setup: Partial<CreatePollFormValues>) => void;
  setDraft: (draft: Partial<PollDraftFormValues>) => void;
  setCurrentPoll: (poll: any) => void;
  reset: () => void;
}

const defaultSetup: CreatePollFormValues = {
  title: "",
  description: "",
  isPublic: true,
  isCommentsAllowed: true,
  isMultipleOptionVoteAllowed: false,
};

const defaultDraft: PollDraftFormValues = {
  question: "",
  options: [
    { id: "1", text: "Option 1" },
    { id: "2", text: "Option 2" },
  ],
  tags: [],
  allowMultipleVotes: false,
  visibility: "public",
};

export const usePollStore = create<PollState>()(
  persist(
    (set) => ({
      setup: null,
      draft: null,
      currentPoll: null,
      setSetup: (newSetup) =>
        set((state) => ({
          setup: state.setup
            ? { ...state.setup, ...newSetup }
            : { ...defaultSetup, ...newSetup },
        })),
      setDraft: (newDraft) =>
        set((state) => ({
          draft: state.draft
            ? { ...state.draft, ...newDraft }
            : { ...defaultDraft, ...newDraft },
        })),
      setCurrentPoll: (poll) => set({ currentPoll: poll }),
      reset: () => set({ setup: null, draft: null, currentPoll: null }),
    }),
    {
      name: "vibecheck-poll-store",
    }
  )
);
