"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthStore {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
            isLoggedIn: () => !!get().user,
        }),
        { name: "auth-store" }
    )
);
