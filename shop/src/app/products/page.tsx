import { Suspense } from "react";
import { ProductGridSkeleton } from "@/components/products/product-skeleton";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { Pagination } from "@/components/ui/pagination";
import { getProducts, getProductsByCategory, getCategories, sortProducts } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop All Products",
    description: "Browse 190+ products across all categories with best prices.",
};

interface Props {
    searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
    const params = await searchParams;
    const { category, sort, page: pageStr } = params;
    const page = Math.max(1, parseInt(pageStr || "1", 10));
    const skip = (page - 1) * 20;

    const [data, categories] = await Promise.all([
        category
            ? getProductsByCategory(category, 20, skip)
            : getProducts(20, skip),
        getCategories(),
    ]);

    const sorted = sortProducts(data.products, sort);

    const SORT_LABELS: Record<string, string> = {
        "price-asc": "Price: Low → High",
        "price-desc": "Price: High → Low",
        rating: "Top Rated",
        discount: "Best Discount",
        name: "Name A → Z",
    };

    return (
        <div className="container py-8">
            {/* Page header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {category
                        ? category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                        : "All Products"}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {data.total} products{sort ? ` · Sorted by ${SORT_LABELS[sort]}` : ""}
                </p>
            </div>

            <div className="flex gap-8">
                {/* Desktop Sidebar + Mobile Filter Button */}
                <Suspense fallback={null}>
                    <ProductFilters categories={categories} selectedCategory={category} />
                </Suspense>

                <div className="flex-1 min-w-0">
                    <Suspense fallback={<ProductGridSkeleton count={20} />}>
                        <ProductGrid products={sorted} />
                    </Suspense>

                    <Suspense fallback={null}>
                        <Pagination total={data.total} page={page} limit={20} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
