import { create } from 'zustand'

interface UserInfoState {
  userId?: string;
  email?: string;
  fullName?: string;
  username?: string;
  googleDriveRefreshToken?: string
  isInitialized: boolean;
  setUserInfo: (info: { userId?: string; email?: string; fullName?: string; username?: string; googleDriveRefreshToken?: string }) => void;
  setInitialized: (val: boolean) => void;
}

export const useUserInfoStore = create<UserInfoState>((set) => ({
  userId: undefined,
  email: undefined,
  fullName: undefined,
  username: undefined,
  googleDriveRefreshToken: undefined,
  isInitialized: false,
  setUserInfo: (info) => set((state) => ({ ...state, ...info })),
  setInitialized: (val) => set({ isInitialized: val }),
}));
