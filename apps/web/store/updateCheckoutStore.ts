import { create } from "zustand";

export type UpgradeStatus =
  "idle" | "loading" | "success" | "checkout_required" | "error";

interface UpdateCheckoutState {
  couponInput: string | null;
  upgradeStatus: UpgradeStatus;
  showOverlay: boolean;

  setCouponInput: (input: string | null) => void;
  setUpgradeStatus: (status: UpgradeStatus) => void;
  setShowOverlay: (show: boolean) => void;

  reset: () => void;
}

export const useUpdateCheckoutStore = create<UpdateCheckoutState>((set) => ({
  couponInput: null,
  upgradeStatus: "idle",
  showOverlay: false,

  setCouponInput: (input) => set({ couponInput: input }),
  setUpgradeStatus: (status) => set({ upgradeStatus: status }),
  setShowOverlay: (show) => set({ showOverlay: show }),

  reset: () =>
    set({ couponInput: null, upgradeStatus: "idle", showOverlay: false }),
}));
