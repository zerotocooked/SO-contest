"use client";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export function WishlistButtonClientWrapper({ product }: { product: Product }) {
    const { toggle, has } = useWishlistStore();
    const isWishlisted = has(product.id);

    function handleClick() {
        toggle(product);
        toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
            icon: isWishlisted ? "💔" : "❤️",
        });
    }

    return (
        <Button
            variant="outline"
            size="lg"
            className={cn(
                "w-full border-2 transition-all",
                isWishlisted
                    ? "border-red-300 text-red-500 hover:bg-red-50"
                    : "hover:border-red-300 hover:text-red-500"
            )}
            onClick={handleClick}
        >
            <Heart className={cn("mr-2 h-5 w-5", isWishlisted && "fill-current")} />
            {isWishlisted ? "Wishlisted ♥" : "Add to Wishlist"}
        </Button>
    );
}
