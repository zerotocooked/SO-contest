// Pagination component
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    total: number;
    page: number;
    limit?: number;
}

export function Pagination({ total, page, limit = 20 }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const totalPages = Math.ceil(total / limit);

    if (totalPages <= 1) return null;

    function goTo(newPage: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`/products?${params.toString()}`);
    }

    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push("...");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-2 py-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => goTo(page - 1)}
                disabled={page <= 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-muted-foreground">…</span>
                ) : (
                    <Button
                        key={p}
                        variant={p === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => goTo(p as number)}
                    >
                        {p}
                    </Button>
                )
            )}

            <Button
                variant="outline"
                size="icon"
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}

// Rating stars display component
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
    rating: number;
    total?: number;
    size?: "sm" | "md" | "lg";
}

export function RatingStars({ rating, total, size = "sm" }: RatingStarsProps) {
    const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };
    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={cn(
                            sizes[size],
                            i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                        )}
                    />
                ))}
            </div>
            <span className={cn("font-medium", size === "sm" ? "text-xs" : "text-sm")}>
                {rating.toFixed(1)}
            </span>
            {total !== undefined && (
                <span className="text-muted-foreground text-xs">({total})</span>
            )}
        </div>
    );
}
