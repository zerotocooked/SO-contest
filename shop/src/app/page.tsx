import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryCards } from "@/components/home/category-cards";
import { ProductGrid } from "@/components/products/product-grid";
import { getProducts, getCategories } from "@/lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShopNext — Premium Online Shopping",
  description: "Shop 194+ products across all categories. Best prices, fast delivery.",
};

export default async function HomePage() {
  const [productsData, categories] = await Promise.all([
    getProducts(8, 0),
    getCategories(),
  ]);

  const featured = productsData.products;
  const flashSale = [...productsData.products]
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);

  return (
    <>
      <HeroBanner />

      {/* Flash Sale */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 border-y">
        <div className="container py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500" />
              <h2 className="text-2xl font-bold">Flash Deals</h2>
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white animate-pulse">LIVE</span>
            </div>
            <Link href="/products?sort=discount" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              See all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={flashSale} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Featured Products</h2>
          </div>
          <Link href="/products" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      {/* Category Cards */}
      <div className="bg-slate-50">
        <CategoryCards categories={categories} />
      </div>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
        <div className="container py-12 text-center">
          <h2 className="text-3xl font-bold mb-2">Get 20% Off Your First Order</h2>
          <p className="text-indigo-200 mb-6 max-w-md mx-auto">Subscribe to get exclusive deals, new arrivals, and shopping tips.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" required className="flex-1 h-11 rounded-full px-5 text-sm text-foreground outline-none focus:ring-2 focus:ring-white border-0" />
            <button type="submit" className={cn(buttonVariants({ size: "lg" }), "rounded-full bg-white text-indigo-700 hover:bg-indigo-50 font-semibold px-6")}>
              Subscribe →
            </button>
          </form>
          <p className="mt-3 text-xs text-indigo-300">Unsubscribe anytime. No spam.</p>
        </div>
      </section>
    </>
  );
}
