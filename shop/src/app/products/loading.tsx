import { ProductGridSkeleton } from "@/components/products/product-skeleton";

export default function Loading() {
    return (
        <div className="container py-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded mb-6" />
            <ProductGridSkeleton count={20} />
        </div>
    );
}
