import { create } from 'zustand';

interface CreateFormState {
  title: string;
  description: string;
  slug: string;
  isSlugManuallyEdited: boolean;
  passwordNeeded: boolean;
  password?: string;
  isCommentsAllowed: boolean;
  allowResponseEdit: boolean;
  responseLimit?: number;
  expiresAt?: string;
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;
  setSlug: (slug: string) => void;
  setIsSlugManuallyEdited: (val: boolean) => void;
  setPasswordNeeded: (val: boolean) => void;
  setPassword: (val: string) => void;
  setIsCommentsAllowed: (val: boolean) => void;
  setAllowResponseEdit: (val: boolean) => void;
  setResponseLimit: (val: number | undefined) => void;
  setExpiresAt: (val: string | undefined) => void;
}

export const useCreateFormStore = create<CreateFormState>((set) => ({
  title: "",
  description: "",
  slug: "",
  isSlugManuallyEdited: false,
  passwordNeeded: false,
  password: "",
  isCommentsAllowed: true,
  allowResponseEdit: true,
  responseLimit: undefined,
  expiresAt: undefined,
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setSlug: (slug) => set({ slug }),
  setIsSlugManuallyEdited: (val) => set({ isSlugManuallyEdited: val }),
  setPasswordNeeded: (val) => set({ passwordNeeded: val }),
  setPassword: (password) => set({ password }),
  setIsCommentsAllowed: (val) => set({ isCommentsAllowed: val }),
  setAllowResponseEdit: (val) => set({ allowResponseEdit: val }),
  setResponseLimit: (val) => set({ responseLimit: val }),
  setExpiresAt: (val) => set({ expiresAt: val }),
}));
