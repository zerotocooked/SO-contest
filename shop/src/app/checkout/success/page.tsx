"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

function SuccessContent() {
    const params = useSearchParams();
    const orderId = params.get("orderId") || `ORD-${Date.now()}`;
    const total = params.get("total") || "0.00";
    const name = params.get("name") || "there";

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 5);

    return (
        <div className="container py-16 max-w-lg mx-auto text-center">
            <div className="flex justify-center mb-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
            </div>

            <h1 className="text-3xl font-extrabold mb-2">Order Confirmed! 🎉</h1>
            <p className="text-muted-foreground text-lg mb-6">
                Thank you, <span className="font-semibold text-foreground">{name}</span>! Your order has been placed.
            </p>

            <div className="rounded-xl border bg-card p-6 text-left space-y-4 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Order number</p>
                        <p className="font-bold text-lg font-mono">{orderId}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total paid</p>
                        <p className="font-bold text-lg">${parseFloat(total).toFixed(2)}</p>
                    </div>
                </div>

                <div className="rounded-lg bg-green-50/80 border border-green-200 p-4 flex gap-3">
                    <Package className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-green-800">Estimated Delivery</p>
                        <p className="text-sm text-green-700">
                            {estimatedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                        </p>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    This is a demo — no actual order was placed or email sent.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/products" className={cn(buttonVariants({ size: "lg" }))}>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Continue Shopping
                </Link>
                <Link href="/account/orders" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                    View Orders
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="container py-16 text-center text-muted-foreground">Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
