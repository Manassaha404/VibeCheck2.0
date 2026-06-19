import { create } from 'zustand'

interface UserInfoState {
  userId?: string;
  email?: string;
  fullName?: string;
  username?: string;
  isGoogleDriveConnected?: boolean
  isInitialized: boolean;
  setUserInfo: (info: { userId?: string; email?: string; fullName?: string; username?: string; isGoogleDriveConnected?: boolean }) => void;
  setInitialized: (val: boolean) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userId: undefined,
  email: undefined,
  fullName: undefined,
  username: undefined,
  isGoogleDriveConnected: undefined,
  isInitialized: false,
  setUserInfo: (info) => set((state) => ({ ...state, ...info })),
  setInitialized: (val) => set({ isInitialized: val }),
}));
