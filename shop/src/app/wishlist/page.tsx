"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlist-store";
import { ProductGrid } from "@/components/products/product-grid";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
    const [mounted, setMounted] = useState(false);
    const { items, toggle } = useWishlistStore();

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <Heart className="h-16 w-16 mx-auto text-rose-300 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
                <p className="text-muted-foreground mb-6">Save products you love to buy later.</p>
                <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Browse Products
                </Link>
            </div>
        );
    }

    function handleRemove(product: typeof items[number]) {
        toggle(product);
        toast("Removed from wishlist", { icon: "💔" });
    }

    return (
        <div className="container py-8">
            <div className="flex items-center gap-3 mb-6">
                <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                <h1 className="text-3xl font-bold">My Wishlist ({items.length})</h1>
            </div>
            <ProductGrid products={items} showRemoveButton onRemove={handleRemove} />
        </div>
    );
}
