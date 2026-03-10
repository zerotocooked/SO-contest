import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Heart, Package, Shield, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductReviews } from "@/components/products/product-reviews";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { WishlistButtonClientWrapper } from "@/components/products/wishlist-button-client";
import { getProduct, getDiscountedPrice } from "@/lib/api";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const product = await getProduct(Number(id));
        return {
            title: product.title,
            description: product.description.slice(0, 155),
            openGraph: { images: [product.thumbnail] },
        };
    } catch {
        return { title: "Product Not Found" };
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params;
    let product;
    try {
        product = await getProduct(Number(id));
        if (!product?.id) notFound();
    } catch {
        notFound();
    }

    const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);
    const hasDiscount = product.discountPercentage > 1;

    return (
        <div className="container py-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-foreground">Home</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href="/products" className="hover:text-foreground">Products</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <Link href={`/products?category=${product.category}`} className="hover:text-foreground capitalize">
                    {product.category.replace(/-/g, " ")}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground font-medium truncate max-w-[180px]">{product.title}</span>
            </nav>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                {/* Image gallery */}
                <ProductImageGallery
                    images={product.images || []}
                    thumbnail={product.thumbnail}
                    title={product.title}
                />

                {/* Product info */}
                <div className="space-y-5">
                    {product.brand && (
                        <div className="text-sm font-semibold uppercase tracking-wider text-primary">
                            {product.brand}
                        </div>
                    )}

                    <h1 className="text-3xl font-bold text-foreground">{product.title}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.reviews?.length || 0} reviews)</span>
                    </div>

                    <Separator />

                    {/* Price */}
                    <div className="flex items-end gap-3">
                        <span className="text-4xl font-extrabold">${discountedPrice.toFixed(2)}</span>
                        {hasDiscount && (
                            <>
                                <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                                <Badge className="bg-red-500 text-white font-bold">
                                    -{Math.round(product.discountPercentage)}% OFF
                                </Badge>
                            </>
                        )}
                    </div>

                    {/* Stock status */}
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${(product.stock || 0) > 0 ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-sm font-medium">
                            {(product.stock || 0) > 0 ? `${product.stock} in stock` : "Out of Stock"}
                        </span>
                        {product.availabilityStatus && (
                            <Badge variant="outline" className="text-xs">{product.availabilityStatus}</Badge>
                        )}
                    </div>

                    {/* Add to cart */}
                    <AddToCartButton product={product} />

                    {/* Wishlist */}
                    <WishlistButtonClientWrapper product={product} />

                    {/* Trust badges */}
                    <Separator />
                    <div className="grid grid-cols-3 gap-3 text-center">
                        {[
                            { icon: Truck, text: "Free Shipping", sub: "Over $50" },
                            { icon: Shield, text: "Secure", sub: "Payment" },
                            { icon: Package, text: "Easy Return", sub: "30 days" },
                        ].map(({ icon: Icon, text, sub }) => (
                            <div key={text} className="space-y-1 rounded-lg bg-muted/30 p-3">
                                <Icon className="h-5 w-5 mx-auto text-primary" />
                                <p className="text-xs font-medium">{text}</p>
                                <p className="text-[10px] text-muted-foreground">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product tabs */}
            <div className="mt-12">
                <Tabs defaultValue="description">
                    <TabsList className="w-full justify-start">
                        <TabsTrigger value="description">Description</TabsTrigger>
                        <TabsTrigger value="specs">Specifications</TabsTrigger>
                        <TabsTrigger value="reviews">
                            Reviews ({product.reviews?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="description" className="mt-6">
                        <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {product.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="specs" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { label: "Category", value: product.category },
                                { label: "Brand", value: product.brand },
                                { label: "SKU / Barcode", value: product.meta?.barcode },
                                { label: "Stock", value: product.stock },
                                { label: "Min. Order", value: product.minimumOrderQuantity },
                                { label: "Weight", value: product.weight ? `${product.weight} kg` : undefined },
                                { label: "Warranty", value: product.warrantyInformation },
                                { label: "Shipping", value: product.shippingInformation },
                                { label: "Return Policy", value: product.returnPolicy },
                            ]
                                .filter((row) => row.value)
                                .map(({ label, value }) => (
                                    <div key={label} className="flex gap-3 rounded-lg bg-muted/30 p-3">
                                        <span className="text-sm font-medium min-w-[110px] text-muted-foreground">{label}</span>
                                        <span className="text-sm">{String(value)}</span>
                                    </div>
                                ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-6">
                        {(product.reviews?.length ?? 0) > 0 ? (
                            <ProductReviews reviews={product.reviews!} rating={product.rating} />
                        ) : (
                            <p className="text-muted-foreground">No reviews yet.</p>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
