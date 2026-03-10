import { Suspense } from "react";
import { Search } from "lucide-react";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductGridSkeleton } from "@/components/products/product-skeleton";
import { searchProducts } from "@/lib/api";
import type { Metadata } from "next";

interface Props {
    searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const { q } = await searchParams;
    return {
        title: q ? `Search: "${q}"` : "Search Products",
        description: q
            ? `Search results for "${q}" — find the best products at ShopNext.`
            : "Search our catalog of 190+ products.",
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const { q = "" } = await searchParams;

    if (!q.trim()) {
        return (
            <div className="container py-16 text-center">
                <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Search Products</h1>
                <p className="text-muted-foreground">Use the search bar above to find what you're looking for.</p>
            </div>
        );
    }

    const data = await searchProducts(q);

    return (
        <div className="container py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Search: <span className="text-primary">"{q}"</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                    {data.total === 0
                        ? "No results found"
                        : `Found ${data.total} product${data.total !== 1 ? "s" : ""}`}
                </p>
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid products={data.products} />
            </Suspense>
        </div>
    );
}
