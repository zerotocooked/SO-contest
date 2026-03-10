"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { CreditCard, Truck, Lock } from "lucide-react";
import { useEffect } from "react";

const checkoutSchema = z.object({
    email: z.string().email("Valid email required"),
    phone: z.string().min(9, "Phone must be at least 9 digits"),
    firstName: z.string().min(2, "First name too short"),
    lastName: z.string().min(2, "Last name too short"),
    address: z.string().min(5, "Address too short"),
    city: z.string().min(2, "City required"),
    zip: z.string().min(4, "Zip code required"),
    country: z.string().min(2, "Country required"),
    paymentMethod: z.enum(["card", "cod"]),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { items, count, total, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const itemCount = count();
    const subtotal = total();
    const shipping = subtotal > 50 ? 0 : 5.99;
    const grandTotal = subtotal + shipping;

    useEffect(() => {
        setMounted(true);
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CheckoutForm>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            email: user?.email || "",
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            paymentMethod: "card",
            country: "United States",
        },
    });

    const paymentMethod = watch("paymentMethod");

    async function onSubmit(data: CheckoutForm) {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        clearCart();
        const orderId = `ORD-${Date.now()}`;
        router.push(`/checkout/success?orderId=${orderId}&total=${grandTotal.toFixed(2)}&name=${data.firstName}`);
    }

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <Link href="/products" className={cn(buttonVariants())}>Shop Now</Link>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                Secure Checkout
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
                    {/* Form */}
                    <div className="space-y-6">
                        {/* Contact */}
                        <div className="rounded-xl border bg-card p-6 space-y-4">
                            <h2 className="text-lg font-bold">Contact Information</h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" type="tel" {...register("phone")} placeholder="+1 555-0100" />
                                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="rounded-xl border bg-card p-6 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" /> Shipping Address
                            </h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" {...register("firstName")} />
                                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" {...register("lastName")} />
                                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                                </div>
                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="address">Street Address</Label>
                                    <Input id="address" {...register("address")} placeholder="123 Main Street" />
                                    {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" {...register("city")} />
                                    {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input id="zip" {...register("zip")} placeholder="10001" />
                                    {errors.zip && <p className="text-xs text-destructive">{errors.zip.message}</p>}
                                </div>
                                <div className="sm:col-span-2 space-y-1.5">
                                    <Label htmlFor="country">Country</Label>
                                    <Input id="country" {...register("country")} />
                                    {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="rounded-xl border bg-card p-6 space-y-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" /> Payment
                            </h2>

                            {/* Payment toggle */}
                            <div className="grid grid-cols-2 gap-3">
                                {(["card", "cod"] as const).map((method) => (
                                    <label
                                        key={method}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors",
                                            paymentMethod === method ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
                                        )}
                                    >
                                        <input type="radio" value={method} {...register("paymentMethod")} className="sr-only" />
                                        <div className={cn("h-4 w-4 rounded-full border-2 flex-shrink-0", paymentMethod === method ? "border-primary bg-primary" : "border-muted-foreground/40")} />
                                        <span className="text-sm font-medium">
                                            {method === "card" ? "💳 Credit Card" : "💵 Cash on Delivery"}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {paymentMethod === "card" && (
                                <div className="space-y-4 mt-2">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <Input id="cardNumber" {...register("cardNumber")} placeholder="4111 1111 1111 1111" maxLength={19} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="expiry">Expiry</Label>
                                            <Input id="expiry" {...register("expiry")} placeholder="MM/YY" maxLength={5} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input id="cvv" {...register("cvv")} placeholder="123" maxLength={4} type="password" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Lock className="h-3 w-3" /> This is a demo. No real payment is processed.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-card p-6 sticky top-24 space-y-4">
                            <h2 className="text-lg font-bold">Order Summary</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {items.map((item) => {
                                    const price = item.product.price * (1 - (item.product.discountPercentage || 0) / 100);
                                    return (
                                        <div key={item.product.id} className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 rounded-md overflow-hidden bg-slate-50 border flex-shrink-0">
                                                <Image src={item.product.thumbnail} alt={item.product.title} fill className="object-contain p-1" sizes="48px" />
                                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium line-clamp-1">{item.product.title}</p>
                                            </div>
                                            <p className="text-sm font-bold">${(price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <Separator />
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${grandTotal.toFixed(2)}</span>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full font-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Processing…
                                    </span>
                                ) : (
                                    `Place Order · $${grandTotal.toFixed(2)}`
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
