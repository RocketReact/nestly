import { User } from "@/types/user";
import { create } from "zustand";

interface AuthStore {
	user: null | User;
	isAuthenticated: boolean;
	isAuthLoading: boolean;
	setUser: (user: User) => void;
	clearIsAuthenticated: () => void;
	setAuthLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
	isAuthenticated: false,
	user: null,
	isAuthLoading: true,
	setUser: (user: User) =>
		set(() => ({
			user,
			isAuthenticated: true,
			isAuthLoading: false,
		})),
	clearIsAuthenticated: () =>
		set(() => ({
			user: null,
			isAuthenticated: false,
			isAuthLoading: false,
		})),
	setAuthLoading: (loading: boolean) =>
		set(() => ({ isAuthLoading: loading })),
}));
