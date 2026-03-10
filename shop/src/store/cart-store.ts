"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

interface CartStore {
    items: CartItem[];
    addItem: (product: Product, qty?: number) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, qty: number) => void;
    clearCart: () => void;
    total: () => number;
    count: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, qty = 1) => {
                const existing = get().items.find((i) => i.product.id === product.id);
                if (existing) {
                    set({
                        items: get().items.map((i) =>
                            i.product.id === product.id
                                ? { ...i, quantity: i.quantity + qty }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...get().items, { product, quantity: qty }] });
                }
            },
            removeItem: (id) =>
                set({ items: get().items.filter((i) => i.product.id !== id) }),
            updateQuantity: (id, qty) => {
                if (qty <= 0) {
                    set({ items: get().items.filter((i) => i.product.id !== id) });
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.product.id === id ? { ...i, quantity: qty } : i
                        ),
                    });
                }
            },
            clearCart: () => set({ items: [] }),
            total: () =>
                get().items.reduce(
                    (acc, i) =>
                        acc +
                        i.product.price *
                        (1 - (i.product.discountPercentage || 0) / 100) *
                        i.quantity,
                    0
                ),
            count: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
        }),
        { name: "cart-store" }
    )
);
