"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

interface WishlistStore {
    items: Product[];
    toggle: (product: Product) => void;
    has: (id: number) => boolean;
    remove: (id: number) => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            toggle: (product) => {
                const has = get().items.find((p) => p.id === product.id);
                set({
                    items: has
                        ? get().items.filter((p) => p.id !== product.id)
                        : [...get().items, product],
                });
            },
            has: (id) => !!get().items.find((p) => p.id === id),
            remove: (id) => set({ items: get().items.filter((p) => p.id !== id) }),
        }),
        { name: "wishlist-store" }
    )
);
