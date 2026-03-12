import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

const BASE = "https://dummyjson.com";

async function getCategoryThumb(slug: string): Promise<string | null> {
    try {
        const res = await fetch(
            `${BASE}/products/category/${encodeURIComponent(slug)}?limit=1&select=thumbnail`,
            { next: { revalidate: 86400 } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return data.products?.[0]?.thumbnail ?? null;
    } catch {
        return null;
    }
}

function formatCategoryName(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

interface CategoryCardsProps {
    categories: Category[];
}

export async function CategoryCards({ categories }: CategoryCardsProps) {
    const displayCategories = categories.slice(0, 8);

    const thumbs = await Promise.all(
        displayCategories.map((cat) => getCategoryThumb(cat.slug))
    );

    return (
        <section className="container py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Shop by Category</h2>
                <Link
                    href="/products"
                    className="text-sm text-primary hover:underline font-medium"
                >
                    View All →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {displayCategories.map((cat, idx) => {
                    const thumb = thumbs[idx];
                    const displayName = formatCategoryName(cat.name || cat.slug);

                    return (
                        <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            className="group relative block overflow-hidden rounded-xl aspect-[4/3] bg-slate-100 hover:shadow-lg transition-all duration-300"
                        >
                            {thumb ? (
                                <Image
                                    src={thumb}
                                    alt={displayName}
                                    fill
                                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 bg-white"
                                    sizes="(max-width: 640px) 50vw, 25vw"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-slate-200" />
                            )}
                            {/* Bottom label bar */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-8 pb-3 px-3">
                                <p className="text-white font-semibold text-sm truncate">
                                    {displayName}
                                </p>
                            </div>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 ring-2 ring-inset ring-transparent group-hover:ring-primary/50 rounded-xl transition-all duration-300" />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
