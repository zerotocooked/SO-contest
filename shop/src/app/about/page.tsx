import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about ShopNext — our story, mission, and team.",
};

const stats = [
    { value: "10M+", label: "Happy Customers" },
    { value: "194+", label: "Products" },
    { value: "50+", label: "Categories" },
    { value: "99.9%", label: "Uptime" },
];

const team = [
    { name: "Alice Chen", role: "CEO & Co-Founder", seed: "alice" },
    { name: "Bob Smith", role: "CTO", seed: "bob" },
    { name: "Carol Davis", role: "Head of Design", seed: "carol" },
    { name: "David Kim", role: "Head of Products", seed: "david" },
];

const milestones = [
    { year: "2020", text: "Founded in San Francisco with a vision to democratize premium shopping" },
    { year: "2021", text: "Launched with 50+ products and 10,000 early adopters" },
    { year: "2022", text: "Expanded to 100+ categories and 1M+ customers worldwide" },
    { year: "2023", text: "Raised Series B funding and launched mobile apps" },
    { year: "2024", text: "10M+ orders shipped across 150+ countries" },
    { year: "2026", text: "Redefining the future of online shopping with AI-powered discovery" },
];

export default function AboutPage() {
    return (
        <>
            <section className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white py-24 text-center">
                <div className="container max-w-3xl mx-auto">
                    <p className="text-indigo-400 font-semibold uppercase tracking-widest mb-3">Our Story</p>
                    <h1 className="text-5xl font-extrabold mb-6">Shopping, Elevated</h1>
                    <p className="text-slate-300 text-xl leading-relaxed">
                        We started ShopNext because we believed people deserved better — better products, better prices, and a better experience.
                    </p>
                </div>
            </section>

            <section className="bg-white border-b">
                <div className="container py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map(({ value, label }) => (
                            <div key={label} className="text-center">
                                <div className="text-4xl font-extrabold text-primary mb-1">{value}</div>
                                <div className="text-muted-foreground text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container py-16 max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    To make quality products accessible to everyone, everywhere. We partner with the world's best brands and independent creators to bring you an unmatched selection at fair prices.
                </p>
            </section>

            <section className="bg-slate-50 py-16">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-10">Meet the Team</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map(({ name, role, seed }) => (
                            <div key={name} className="text-center">
                                <div className="relative h-24 w-24 rounded-full overflow-hidden mx-auto mb-3 bg-slate-200">
                                    <Image src={`https://robohash.org/${seed}?set=set2`} alt={name} fill className="object-cover" sizes="96px" />
                                </div>
                                <p className="font-semibold text-sm">{name}</p>
                                <p className="text-xs text-muted-foreground">{role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container py-16">
                <h2 className="text-3xl font-bold text-center mb-10">Our Journey</h2>
                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-8">
                        {milestones.map(({ year, text }) => (
                            <div key={year} className="relative flex gap-8 pl-12">
                                <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">✓</div>
                                <div>
                                    <span className="text-sm font-bold text-primary">{year}</span>
                                    <p className="text-muted-foreground text-sm mt-0.5">{text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-16 text-center">
                <h2 className="text-3xl font-bold mb-3">Ready to shop?</h2>
                <p className="text-indigo-200 mb-6">Join millions of happy customers today.</p>
                <Link
                    href="/products"
                    className={cn(buttonVariants({ size: "lg" }), "bg-white text-indigo-700 hover:bg-indigo-50 font-bold")}
                >
                    Explore Products
                </Link>
            </section>
        </>
    );
}
