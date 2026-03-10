"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

const registerSchema = z.object({
    firstName: z.string().min(2, "First name too short"),
    lastName: z.string().min(2, "Last name too short"),
    email: z.string().email("Valid email required"),
    username: z.string().min(3, "Username must be at least 3 chars"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

    async function onSubmit(data: RegisterFormData) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        const mockUser = {
            id: Date.now(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
            image: `https://robohash.org/${data.username}?set=set2`,
            token: `mock-token-${Date.now()}`,
        };
        login(mockUser);
        toast.success(`Welcome to ShopNext, ${data.firstName}! 🎉`);
        router.push("/account");
    }

    return (
        <div className="container py-16 max-w-md mx-auto">
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">ShopNext</span>
                </Link>
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-muted-foreground mt-1">Join ShopNext today</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border bg-card p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" {...register("firstName")} placeholder="John" />
                        {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                        {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" {...register("username")} placeholder="johndoe123" />
                    {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...register("password")} placeholder="Min. 6 characters" />
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="Repeat password" />
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" size="lg" className="w-full font-semibold" disabled={loading}>
                    {loading ? "Creating account…" : "Create Account"}
                </Button>

                <Separator />
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">Sign In</Link>
                </p>
            </form>
        </div>
    );
}
