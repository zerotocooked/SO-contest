"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/types";

function CartItemRow({ item }: { item: CartItem }) {
    const { removeItem, updateQuantity } = useCartStore();
    const discountedPrice = item.product.price * (1 - (item.product.discountPercentage || 0) / 100);
    const lineTotal = discountedPrice * item.quantity;
    return (
        <div className="flex gap-4 py-4">
            <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-slate-50 border">
                    <Image src={item.product.thumbnail} alt={item.product.title} fill className="object-contain p-2" sizes="80px" />
                </div>
            </Link>
            <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                    <Link href={`/products/${item.product.id}`} className="text-sm font-semibold line-clamp-1 hover:text-primary transition-colors">
                        {item.product.title}
                    </Link>
                    {item.product.brand && <p className="text-xs text-muted-foreground">{item.product.brand}</p>}
                </div>
                <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="flex items-center rounded-lg border">
                        <button
                            className="flex h-8 w-8 items-center justify-center hover:bg-accent transition-colors disabled:opacity-40"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        ><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                            className="flex h-8 w-8 items-center justify-center hover:bg-accent transition-colors"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        ><Plus className="h-3 w-3" /></button>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-sm">${lineTotal.toFixed(2)}</p>
                        {item.quantity > 1 && <p className="text-xs text-muted-foreground">${discountedPrice.toFixed(2)} ea</p>}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.product.id)}
                    ><Trash2 className="h-4 w-4" /></Button>
                </div>
            </div>
        </div>
    );
}

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <span className="text-7xl">🛒</span>
            <div>
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
            </div>
            <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
                Start Shopping
            </Link>
        </div>
    );
}

function CartSummary({ subtotal, count }: { subtotal: number; count: number }) {
    const shipping = subtotal > 50 ? 0 : subtotal > 0 ? 5.99 : 0;
    const total = subtotal + shipping;
    return (
        <div className="rounded-xl border bg-card p-6 space-y-4 sticky top-24 h-fit">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({count} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                    </span>
                </div>
                {shipping > 0 && <p className="text-xs text-muted-foreground">Add ${(50 - subtotal).toFixed(2)} for free shipping</p>}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className={cn(buttonVariants({ size: "lg" }), "w-full text-center font-semibold")}>
                Proceed to Checkout →
            </Link>
            <Link href="/products" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full text-center")}>
                ← Continue Shopping
            </Link>
        </div>
    );
}

export default function CartPage() {
    const [mounted, setMounted] = useState(false);
    const { items, count, total } = useCartStore();
    const itemCount = count();
    const subtotal = total();
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;
    if (items.length === 0) return <div className="container py-8"><EmptyCart /></div>;
    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount} items)</h1>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
                <div className="rounded-xl border bg-card divide-y">
                    {items.map((item) => (
                        <div key={item.product.id} className="px-4">
                            <CartItemRow item={item} />
                        </div>
                    ))}
                </div>
                <CartSummary subtotal={subtotal} count={itemCount} />
            </div>
        </div>
    );
}
