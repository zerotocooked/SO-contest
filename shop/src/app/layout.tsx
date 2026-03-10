import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Toaster } from "sonner";
import { getCategories } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: { default: "ShopNext — Premium Shopping", template: "%s | ShopNext" },
  description: "Your one-stop premium shopping destination with 194+ products across all categories.",
  keywords: ["shopping", "ecommerce", "products", "deals"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: import("@/lib/types").Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    // categories optional for layout
  }

  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="antialiased">
        <Providers>
          <Header categories={categories} />
          <main className="min-h-[calc(100vh-4rem)] pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <MobileNav />
          <Toaster richColors position="top-right" closeButton />
        </Providers>
      </body>
    </html>
  );
}
