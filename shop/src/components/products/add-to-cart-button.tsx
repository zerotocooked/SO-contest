"use client";
import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((s) => s.addItem);
    const [qty, setQty] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    function increment() {
        setQty((q) => Math.min(q + 1, product.stock || 99));
    }
    function decrement() {
        setQty((q) => Math.max(1, q - 1));
    }

    async function handleAdd() {
        setIsAdding(true);
        addItem(product, qty);
        toast.success(`${product.title} added to cart!`, {
            description: `Quantity: ${qty}`,
            duration: 2500,
        });
        setTimeout(() => setIsAdding(false), 800);
    }

    const inStock = (product.stock || 0) > 0;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border">
                    <button
                        onClick={decrement}
                        className="flex h-10 w-10 items-center justify-center hover:bg-accent transition-colors disabled:opacity-50"
                        disabled={qty <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-medium text-sm">{qty}</span>
                    <button
                        onClick={increment}
                        className="flex h-10 w-10 items-center justify-center hover:bg-accent transition-colors disabled:opacity-50"
                        disabled={qty >= (product.stock || 99)}
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>
                <p className="text-xs text-muted-foreground">
                    {inStock ? `${product.stock} in stock` : "Out of stock"}
                </p>
            </div>

            <Button
                size="lg"
                className={cn(
                    "w-full text-base font-semibold transition-all duration-300",
                    isAdding && "bg-green-600 hover:bg-green-600"
                )}
                onClick={handleAdd}
                disabled={!inStock}
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAdding ? "Added to Cart! ✓" : inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
        </div>
    );
}
