import { create } from "zustand";
import { Plan } from "@repo/database/models/payment&subscription/plans";

interface SubscriptionState {
  availablePlans: Plan[];
  setAvailablePlans: (plans: Plan[]) => void;
  canUseQuizAI: (userPlan?: Plan | null) => boolean;
  canUseFormAI: (userPlan?: Plan | null) => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  availablePlans: [],
  setAvailablePlans: (plans) => set({ availablePlans: plans }),
  canUseQuizAI: (userPlan) => !!userPlan?.aiFeaturesForQuizEnabled,
  canUseFormAI: (userPlan) => !!userPlan?.aiFeaturesForFormsEnabled,
}));
