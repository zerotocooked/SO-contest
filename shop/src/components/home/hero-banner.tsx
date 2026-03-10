import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { ArrowRight, ShoppingBag, Tag, Truck } from "lucide-react";

export function HeroBanner() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
            </div>

            <div className="container relative py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium">
                            <Tag className="h-4 w-4" />
                            Up to 40% off — Limited time deals
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                            Shop the{" "}
                            <span className="text-yellow-300">Best Deals</span>
                            <br />
                            Online
                        </h1>

                        <p className="text-indigo-100 text-lg max-w-md">
                            Discover 190+ products across all categories. Premium quality, unbeatable prices, fast delivery.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className={cn(
                                    buttonVariants({ size: "lg" }),
                                    "bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                                )}
                            >
                                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/products?sort=discount"
                                className={cn(
                                    buttonVariants({ variant: "outline", size: "lg" }),
                                    "border-white/50 text-white hover:bg-white/10 bg-transparent transition-all"
                                )}
                            >
                                View Deals
                            </Link>
                        </div>

                        <div className="flex flex-wrap gap-6 pt-2">
                            {[
                                { icon: Truck, text: "Free shipping over $50" },
                                { icon: ShoppingBag, text: "194+ products" },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-1.5 text-sm text-indigo-200">
                                    <Icon className="h-4 w-4" />
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex justify-center items-center">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-72 h-72 bg-white/5 rounded-full" />
                            </div>
                            <div className="relative grid grid-cols-2 gap-4 p-4">
                                {[
                                    { emoji: "📱", label: "Electronics", bg: "bg-blue-500/20" },
                                    { emoji: "👟", label: "Fashion", bg: "bg-pink-500/20" },
                                    { emoji: "💎", label: "Jewelry", bg: "bg-yellow-500/20" },
                                    { emoji: "🏠", label: "Home", bg: "bg-green-500/20" },
                                ].map(({ emoji, label, bg }) => (
                                    <Link
                                        key={label}
                                        href={`/products?category=${label.toLowerCase()}`}
                                        className={`flex flex-col items-center gap-2 rounded-2xl ${bg} backdrop-blur-sm p-6 hover:scale-105 transition-transform`}
                                    >
                                        <span className="text-4xl">{emoji}</span>
                                        <span className="text-sm font-medium text-white">{label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
