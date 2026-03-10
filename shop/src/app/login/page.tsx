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
import { loginUser } from "@/lib/api";
import { toast } from "sonner";
import { ShoppingBag, Eye, EyeOff, Info } from "lucide-react";

const loginSchema = z.object({
    username: z.string().min(2, "Username required"),
    password: z.string().min(4, "Password required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

    async function onSubmit(data: LoginFormData) {
        setLoading(true);
        setErrorMsg("");
        try {
            const result = await loginUser(data.username, data.password);
            if (result.token) {
                login(result);
                toast.success(`Welcome back, ${result.firstName}! 👋`);
                router.push("/account");
            } else {
                setErrorMsg(result.message || "Invalid credentials");
            }
        } catch {
            setErrorMsg("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function fillDemo(username: string, password: string) {
        setValue("username", username);
        setValue("password", password);
    }

    return (
        <div className="container py-16 max-w-md mx-auto">
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                    <ShoppingBag className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">ShopNext</span>
                </Link>
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-muted-foreground mt-1">Welcome back to ShopNext</p>
            </div>

            {/* Demo credentials tip */}
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 mb-6">
                <div className="flex gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-blue-800">Demo Credentials</p>
                </div>
                <div className="space-y-1.5">
                    {[
                        { username: "emilys", password: "emilyspass", label: "Emily (demo user 1)" },
                        { username: "michaelw", password: "michaelwpass", label: "Michael (demo user 2)" },
                    ].map(({ username, password, label }) => (
                        <button
                            key={username}
                            onClick={() => fillDemo(username, password)}
                            className="w-full text-left rounded-lg bg-white border border-blue-200 px-3 py-2 text-xs hover:bg-blue-50 transition-colors"
                        >
                            <span className="font-semibold">{label}</span>
                            <span className="text-muted-foreground ml-2">({username} / {password})</span>
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border bg-card p-6 space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" {...register("username")} placeholder="emilys" autoComplete="username" />
                    {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword((s) => !s)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                </div>

                {errorMsg && (
                    <div className="rounded-lg bg-destructive/10 text-destructive px-3 py-2 text-sm">
                        {errorMsg}
                    </div>
                )}

                <Button type="submit" size="lg" className="w-full font-semibold" disabled={loading}>
                    {loading ? "Signing in…" : "Sign In"}
                </Button>

                <Separator />
                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Create one
                    </Link>
                </p>
            </form>
        </div>
    );
}
