"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { mockOrders } from "@/lib/mock-orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Package, Heart, User, LogOut, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
    Delivered: "bg-green-100 text-green-800",
    Shipped: "bg-blue-100 text-blue-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
};

function AccountSidebar() {
    const { logout, user } = useAuthStore();
    const router = useRouter();
    function handleLogout() {
        logout();
        toast.success("Logged out successfully");
        router.push("/");
    }
    const nav = [
        { href: "/account", label: "Dashboard", icon: User },
        { href: "/account/orders", label: "My Orders", icon: Package },
        { href: "/wishlist", label: "Wishlist", icon: Heart },
    ];
    return (
        <aside className="w-64 flex-shrink-0 hidden md:block">
            <div className="rounded-xl border bg-card p-4 sticky top-24">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                        {user?.image ? (
                            <Image src={user.image} alt={user.firstName} fill className="object-cover" />
                        ) : (
                            <User className="h-6 w-6 text-primary absolute inset-0 m-auto" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                </div>
                <nav className="space-y-1">
                    {nav.map(({ href, label, icon: Icon }) => (
                        <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors">
                            <Icon className="h-4 w-4 text-muted-foreground" />{label}
                        </Link>
                    ))}
                    <Separator className="my-2" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                        <LogOut className="h-4 w-4" />Sign Out
                    </button>
                </nav>
            </div>
        </aside>
    );
}

export default function AccountPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const wishlistCount = useWishlistStore((s) => s.items.length);
    useEffect(() => {
        if (!user) router.push("/login?from=/account");
    }, [user, router]);
    if (!user) return null;
    const recentOrders = mockOrders.slice(0, 3);
    return (
        <div className="container py-8">
            <div className="flex gap-8">
                <AccountSidebar />
                <div className="flex-1 min-w-0 space-y-6">
                    <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-6 flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
                            {user.image ? (
                                <Image src={user.image} alt={user.firstName} fill className="object-cover" />
                            ) : (
                                <User className="h-8 w-8 text-white absolute inset-0 m-auto" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Welcome back, {user.firstName}!</h1>
                            <p className="text-indigo-200 text-sm">@{user.username}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: Package, label: "Orders", value: mockOrders.length, href: "/account/orders" },
                            { icon: Heart, label: "Wishlist", value: wishlistCount, href: "/wishlist" },
                            { icon: ShoppingBag, label: "Shop", value: "194+", href: "/products" },
                        ].map(({ icon: Icon, label, value, href }) => (
                            <Link key={label} href={href}>
                                <div className="rounded-xl border bg-card p-5 hover:shadow-md transition-shadow text-center">
                                    <Icon className="h-6 w-6 mx-auto text-primary mb-2" />
                                    <div className="text-2xl font-bold">{value}</div>
                                    <div className="text-xs text-muted-foreground">{label}</div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-bold">Recent Orders</h2>
                            <Link href="/account/orders" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="rounded-xl border bg-card p-4 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="font-mono text-sm font-semibold">{order.id}</p>
                                        <p className="text-xs text-muted-foreground">{order.date}</p>
                                        <p className="text-xs text-muted-foreground">{order.items.length} items · ${order.total.toFixed(2)}</p>
                                    </div>
                                    <Badge className={STATUS_COLORS[order.status]}>{order.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
