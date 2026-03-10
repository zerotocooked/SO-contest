"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Search, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Shop", icon: Grid3X3 },
    { href: "/search", label: "Search", icon: Search },
    { href: "/cart", label: "Cart", icon: ShoppingCart, showBadge: true },
    { href: "/account", label: "Account", icon: User },
];

export function MobileNav() {
    const pathname = usePathname();
    const [count, setCount] = useState(0);
    const storeCount = useCartStore((s) => s.count());

    useEffect(() => { setCount(storeCount); }, [storeCount]);

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map(({ href, label, icon: Icon, showBadge }) => {
                    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="relative">
                                <Icon className="h-5 w-5" />
                                {showBadge && count > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                                        {count > 9 ? "9+" : count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
