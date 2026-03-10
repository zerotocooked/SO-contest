import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center container py-16">
            <div className="relative">
                <span className="text-[120px] font-extrabold text-muted-foreground/10 select-none leading-none">
                    404
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl">😕</span>
                </div>
            </div>
            <div>
                <h1 className="text-3xl font-bold mb-2">Oops! Page Not Found</h1>
                <p className="text-muted-foreground max-w-md">
                    The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                </p>
            </div>
            <div className="flex gap-3">
                <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
                    Go Home
                </Link>
                <Link href="/products" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                    Browse Products
                </Link>
            </div>
        </div>
    );
}
