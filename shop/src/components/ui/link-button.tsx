// Re-export Button from button and add a LinkButton convenience component
export { Button } from "@/components/ui/button";
export { buttonVariants } from "@/components/ui/button-variants";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface LinkButtonProps
    extends VariantProps<typeof buttonVariants> {
    href: string;
    children: React.ReactNode;
    className?: string;
    target?: string;
    rel?: string;
}

export function LinkButton({
    href,
    children,
    className,
    variant = "default",
    size = "default",
    ...props
}: LinkButtonProps) {
    return (
        <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props}>
            {children}
        </Link>
    );
}
