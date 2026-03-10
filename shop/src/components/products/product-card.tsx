"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

interface ProductCardProps {
    product: Product;
    showRemoveButton?: boolean;
    onRemove?: (product: Product) => void;
}

export function ProductCard({ product, showRemoveButton, onRemove }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const { toggle, has } = useWishlistStore();
    const [isAdding, setIsAdding] = useState(false);
    const isWishlisted = has(product.id);
    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

    async function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault();
        setIsAdding(true);
        addItem(product);
        toast.success(`${product.title} added to cart!`, { duration: 2000 });
        setTimeout(() => setIsAdding(false), 600);
    }

    function handleWishlist(e: React.MouseEvent) {
        e.preventDefault();
        toggle(product);
        toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist", {
            icon: isWishlisted ? "💔" : "❤️",
            duration: 1500,
        });
    }

    return (
        <Link href={`/products/${product.id}`}>
            <Card className="group relative overflow-hidden border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                {product.discountPercentage > 5 && (
                    <div className="absolute top-2 left-2 z-10">
                        <Badge className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5">
                            -{Math.round(product.discountPercentage)}%
                        </Badge>
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-white shadow-sm transition-all",
                        isWishlisted && "text-red-500"
                    )}
                    onClick={handleWishlist}
                >
                    <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
                </Button>

                <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                </div>

                <div className="p-3 flex flex-col flex-1 gap-1">
                    {product.brand && (
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</p>
                    )}
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                    </div>

                    <div className="mt-auto pt-1">
                        <span className="text-base font-bold text-foreground">${discountedPrice.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                            <span className="ml-1.5 text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                        )}
                    </div>

                    {showRemoveButton ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-1 text-destructive border-destructive/30 hover:bg-destructive/5"
                            onClick={(e) => { e.preventDefault(); onRemove?.(product); }}
                        >
                            Remove
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className={cn("w-full mt-1 transition-all duration-300", isAdding && "bg-green-600 hover:bg-green-600")}
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                            {isAdding ? "Added!" : "Add to Cart"}
                        </Button>
                    )}
                </div>
            </Card>
        </Link>
    );
}
