import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  dueDate: string;
  babyGender: string;
  avatarUrl: string;

  setDueDate: (date: string) => void;
  setBabyGender: (gender: string) => void;
  setAvatar: (gender: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      dueDate: "",
      babyGender: "",
      avatarUrl: "https://ftp.goit.study/img/common/women-default-avatar.jpg",

      setDueDate: (date: string) => set(() => ({ dueDate: date })),
      setBabyGender: (gender: string) => set(() => ({ babyGender: gender })),
      setAvatar: (userPhoto: string) => set(() => ({ avatarUrl: userPhoto })),
    }),
    {
      name: "onboarding-storage",
    }
  )
);
