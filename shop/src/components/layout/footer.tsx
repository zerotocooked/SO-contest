import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Twitter, Instagram, Facebook, Github } from "lucide-react";

const footerLinks = {
    Shop: [
        { label: "All Products", href: "/products" },
        { label: "New Arrivals", href: "/products?sort=latest" },
        { label: "Sale", href: "/products?sort=discount" },
        { label: "Wishlist", href: "/wishlist" },
    ],
    Support: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/about" },
        { label: "Shipping Info", href: "/about" },
        { label: "Returns", href: "/about" },
    ],
    Company: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/about" },
        { label: "Careers", href: "/about" },
        { label: "Privacy Policy", href: "/about" },
    ],
};

const socials = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300">
            <div className="container py-12">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <ShoppingBag className="h-6 w-6 text-indigo-400" />
                            <span className="text-xl font-bold text-white">ShopNext</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-4">
                            Your premium shopping destination. Quality products, competitive prices.
                        </p>
                        <div className="flex gap-3">
                            {socials.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-indigo-600 transition-colors"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-white mb-3">{title}</h4>
                            <ul className="space-y-2">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-slate-400 hover:text-white transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8 bg-slate-800" />

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} ShopNext. All rights reserved.
                    </p>
                    <p className="text-xs text-slate-600">
                        Powered by DummyJSON API · Next.js 15 · shadcn/ui
                    </p>
                </div>
            </div>
        </footer>
    );
}
