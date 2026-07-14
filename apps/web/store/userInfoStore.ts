import { create } from "zustand";

interface UserInfoState {
  userId?: string;
  email?: string;
  fullName?: string;
  username?: string;
  isGoogleDriveConnected?: boolean;
  isInitialized: boolean;
  avatarUrl?: string | null;
  setUserInfo: (info: {
    userId?: string;
    email?: string;
    fullName?: string;
    username?: string;
    isGoogleDriveConnected?: boolean;
    avatarUrl?: string | null;
  }) => void;
  setInitialized: (val: boolean) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userId: undefined,
  email: undefined,
  fullName: undefined,
  username: undefined,
  isGoogleDriveConnected: undefined,
  avatarUrl: null,
  isInitialized: false,
  setUserInfo: (info) => set((state) => ({ ...state, ...info })),
  setInitialized: (val) => set({ isInitialized: val }),
}));
