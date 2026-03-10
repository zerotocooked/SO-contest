"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    ShoppingBag, ShoppingCart, Heart, Search, User, LogOut, Package, X, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Category } from "@/lib/types";

function SearchBar({ className }: { className?: string }) {
    const [query, setQuery] = useState("");
    const router = useRouter();
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    return (
        <form onSubmit={handleSubmit} className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
                type="search"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 w-full rounded-full border border-input bg-background pl-9 pr-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-all"
            />
        </form>
    );
}

interface CategoryNavProps { categories: Category[]; }

function CategoryNav({ categories }: CategoryNavProps) {
    const pathname = usePathname();
    return (
        <div className="border-t bg-background">
            <div className="container">
                <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
                    <Link
                        href="/products"
                        className={cn(
                            "flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                            pathname === "/products" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        )}
                    >All</Link>
                    {categories.slice(0, 12).map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/products?category=${cat.slug}`}
                            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors capitalize text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface HeaderProps { categories?: Category[]; }

export function Header({ categories = [] }: HeaderProps) {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const storeCount = useCartStore((s) => s.count());
    const wishItems = useWishlistStore((s) => s.items);
    const { user, logout } = useAuthStore();
    useEffect(() => { setCartCount(storeCount); }, [storeCount]);
    useEffect(() => { setWishlistCount(wishItems.length); }, [wishItems]);

    function handleLogout() {
        logout();
        toast.success("Logged out successfully");
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center gap-4">
                <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-2">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold hidden sm:block">ShopNext</span>
                </Link>

                <SearchBar className="hidden md:block flex-1 max-w-xl" />

                <div className="flex items-center gap-1 ml-auto">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
                        {mobileSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
                    </Button>

                    {/* Wishlist */}
                    <Link href="/wishlist" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}>
                        <Heart className="h-5 w-5" />
                        {wishlistCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">{wishlistCount}</span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link href="/cart" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative")}>
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{cartCount > 9 ? "9+" : cartCount}</span>
                        )}
                    </Link>

                    {/* User */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger render={
                                <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:flex">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <span className="text-sm font-medium max-w-[80px] truncate">{user.firstName}</span>
                                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                            } />
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => router.push("/account")}>
                                    <User className="h-4 w-4 mr-2" />My Account
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/account/orders")}>
                                    <Package className="h-4 w-4 mr-2" />Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                                    <Heart className="h-4 w-4 mr-2" />Wishlist
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                    <LogOut className="h-4 w-4 mr-2" />Log Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "hidden sm:flex")}>
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            {mobileSearchOpen && (
                <div className="container pb-3 md:hidden">
                    <SearchBar />
                </div>
            )}

            {categories.length > 0 && <CategoryNav categories={categories} />}
        </header>
    );
}
