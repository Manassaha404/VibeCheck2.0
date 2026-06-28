import { create } from "zustand";
import { PetitionDraftFormValues } from "../components/petition-builder/schema";

interface PetitionState {
  draft: PetitionDraftFormValues | null;
  currentPetition: any | null; // Placeholder for backend response later
  setDraft: (draft: Partial<PetitionDraftFormValues>) => void;
  setCurrentPetition: (petition: any) => void;
  reset: () => void;
}

const defaultDraft: PetitionDraftFormValues = {
  title: "",
  description: "",
  targetAuthority: "",
  goal: 5000,
  tags: [],
  visibility: "public",
};

export const usePetitionStore = create<PetitionState>()(
  (set) => ({
    draft: null,
    currentPetition: null,
    setDraft: (newDraft) =>
      set((state) => ({
        draft: state.draft
          ? { ...state.draft, ...newDraft }
          : { ...defaultDraft, ...newDraft },
      })),
    setCurrentPetition: (petition) => set({ currentPetition: petition }),
    reset: () => set({ draft: null, currentPetition: null }),
  })
);
