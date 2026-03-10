import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton className="aspect-square rounded-none" />
            <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-8 w-full" />
            </div>
        </Card>
    );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="container py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Skeleton className="aspect-square rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        </div>
    );
}
