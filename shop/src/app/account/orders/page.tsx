"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { mockOrders } from "@/lib/mock-orders";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    Delivered: "bg-green-100 text-green-800",
    Shipped: "bg-blue-100 text-blue-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push("/login?from=/account/orders");
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="container py-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
                <Link href="/account" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                    ← Account
                </Link>
                <h1 className="text-2xl font-bold">Order History</h1>
            </div>

            {mockOrders.length === 0 ? (
                <div className="text-center py-16">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                    <Link href="/products" className={cn(buttonVariants({ size: "default" }))}>
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {mockOrders.map((order) => (
                        <div key={order.id} className="rounded-xl border bg-card overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-muted/30">
                                <div className="grid grid-cols-3 gap-6 text-sm flex-1">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Order</p>
                                        <p className="font-mono font-semibold">{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Date</p>
                                        <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total</p>
                                        <p className="font-bold">${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                                <Badge className={STATUS_COLORS[order.status]}>{order.status}</Badge>
                            </div>
                            <div className="p-4 space-y-2">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span className="text-muted-foreground line-clamp-1">{item.title} × {item.qty}</span>
                                        <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            {order.shippingAddress && (
                                <div className="border-t px-4 py-3 text-xs text-muted-foreground">
                                    📦 Shipped to: {order.shippingAddress}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
