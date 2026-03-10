import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Category } from "@/lib/types";

const categoryEmojis: Record<string, string> = {
    smartphones: "📱",
    laptops: "💻",
    fragrances: "🌸",
    skincare: "✨",
    groceries: "🥑",
    "home-decoration": "🏠",
    furniture: "🪑",
    tops: "👕",
    "womens-dresses": "👗",
    "womens-shoes": "👠",
    "mens-shirts": "👔",
    "mens-shoes": "👟",
    "mens-watches": "⌚",
    "womens-watches": "⌚",
    "womens-bags": "👜",
    "womens-jewellery": "💍",
    sunglasses: "🕶️",
    automotive: "🚗",
    motorcycle: "🏍️",
    lighting: "💡",
    tablets: "📲",
    beauty: "💄",
    sports: "⚽",
    vehicle: "🚙",
};

const categoryColors = [
    "from-blue-500 to-indigo-600",
    "from-pink-500 to-rose-600",
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-sky-600",
    "from-red-500 to-rose-600",
    "from-lime-500 to-green-600",
];

function formatCategoryName(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

interface CategoryCardsProps {
    categories: Category[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
    const displayCategories = categories.slice(0, 8);

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
                    const gradient = categoryColors[idx % categoryColors.length];
                    const emoji = categoryEmojis[cat.slug] || "🛍️";
                    const displayName = formatCategoryName(cat.name || cat.slug);

                    return (
                        <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
                            <Card
                                className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                            >
                                <div className="p-6 flex flex-col items-center gap-2 text-center">
                                    <span className="text-4xl">{emoji}</span>
                                    <span className="font-semibold text-sm">{displayName}</span>
                                </div>
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
