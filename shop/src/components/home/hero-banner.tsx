import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ArrowRight, Tag, Truck, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";

interface HeroBannerProps {
    featuredProduct?: Product;
}

export function HeroBanner({ featuredProduct }: HeroBannerProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Subtle background texture */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container relative py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Left — Copy */}
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium text-primary-foreground/90">
                            <Tag className="h-3.5 w-3.5 text-primary" />
                            Up to 40% off — Limited time deals
                        </div>

                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                                Shop the{" "}
                                <span className="text-primary">Best Deals</span>
                                <br />
                                Online
                            </h1>
                            <p className="mt-4 text-slate-300 text-lg max-w-md">
                                Discover 190+ products across all categories. Premium quality, unbeatable prices.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className={cn(
                                    buttonVariants({ size: "lg" }),
                                    "bg-primary text-white hover:bg-primary/90 font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300"
                                )}
                            >
                                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/products?sort=discount"
                                className={cn(
                                    buttonVariants({ variant: "outline", size: "lg" }),
                                    "border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white bg-transparent transition-all"
                                )}
                            >
                                View Deals
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-5 pt-1">
                            {[
                                { icon: Truck, text: "Free shipping over $50" },
                                { icon: ShieldCheck, text: "Secure checkout" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                                    <Icon className="h-4 w-4 text-slate-500" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Featured Product */}
                    {featuredProduct && (
                        <div className="hidden md:block">
                            <Link
                                href={`/products/${featuredProduct.id}`}
                                className="group relative block"
                            >
                                {/* Product image card */}
                                <div className="relative mx-auto max-w-sm">
                                    {/* Glow effect */}
                                    <div className="absolute inset-4 bg-primary/20 rounded-3xl blur-2xl" />

                                    <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur">
                                        <div className="relative aspect-square">
                                            <Image
                                                src={featuredProduct.thumbnail}
                                                alt={featuredProduct.title}
                                                fill
                                                className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                                                sizes="400px"
                                                priority
                                            />
                                        </div>

                                        {/* Product info overlay */}
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5">
                                            {featuredProduct.brand && (
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-0.5">
                                                    {featuredProduct.brand}
                                                </p>
                                            )}
                                            <p className="font-semibold text-white text-sm line-clamp-1">
                                                {featuredProduct.title}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xl font-bold text-primary">
                                                    ${(featuredProduct.price * (1 - featuredProduct.discountPercentage / 100)).toFixed(2)}
                                                </span>
                                                {featuredProduct.discountPercentage > 5 && (
                                                    <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                                        -{Math.round(featuredProduct.discountPercentage)}% OFF
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
