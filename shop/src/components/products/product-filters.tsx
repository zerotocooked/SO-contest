"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/lib/types";

interface ProductFiltersProps {
    categories: Category[];
    selectedCategory?: string;
}

const SORT_OPTIONS = [
    { value: "", label: "Default" },
    { value: "price-asc", label: "Price: Low → High" },
    { value: "price-desc", label: "Price: High → Low" },
    { value: "rating", label: "Top Rated" },
    { value: "discount", label: "Best Discount" },
    { value: "name", label: "Name A → Z" },
];

function FilterContent({ categories, selectedCategory }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "";

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set(key, value);
        else params.delete(key);
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    }

    return (
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-sm mb-3">Sort By</h4>
                <div className="space-y-1">
                    {SORT_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => updateParam("sort", opt.value)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${sort === opt.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="font-semibold text-sm mb-3">Category</h4>
                <div className="space-y-1">
                    <Link
                        href="/products"
                        className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${!selectedCategory ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground"
                            }`}
                    >
                        All Products
                    </Link>
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => updateParam("category", cat.slug)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors capitalize ${selectedCategory === cat.slug ? "bg-primary/10 text-primary font-medium" : "hover:bg-accent text-muted-foreground"
                                }`}
                        >
                            {cat.name || cat.slug}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ProductFilters({ categories, selectedCategory }: ProductFiltersProps) {
    const searchParams = useSearchParams();
    const hasFilters = searchParams.get("category") || searchParams.get("sort");

    return (
        <>
            <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-1.5">
                            <Filter className="h-4 w-4" /> Filters
                        </h3>
                        {hasFilters && (
                            <Link href="/products" className="text-xs text-primary hover:underline flex items-center gap-1">
                                <X className="h-3 w-3" /> Clear
                            </Link>
                        )}
                    </div>
                    <FilterContent categories={categories} selectedCategory={selectedCategory} />
                </div>
            </aside>

            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger render={
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                            {hasFilters && (
                                <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">!</Badge>
                            )}
                        </Button>
                    } />
                    <SheetContent side="left" className="w-72">
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                            <FilterContent categories={categories} selectedCategory={selectedCategory} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
