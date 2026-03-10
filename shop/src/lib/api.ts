import type { Product, ProductsResponse, Category, User } from "./types";

const BASE = "https://dummyjson.com";

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
    const res = await fetch(`${BASE}/products?limit=${limit}&skip=${skip}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export async function getProduct(id: number): Promise<Product> {
    const res = await fetch(`${BASE}/products/${id}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
    return res.json();
}

export async function searchProducts(query: string): Promise<ProductsResponse> {
    const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(query)}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to search products");
    return res.json();
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE}/products/categories`, {
        next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export async function getProductsByCategory(
    category: string,
    limit = 20,
    skip = 0
): Promise<ProductsResponse> {
    const res = await fetch(
        `${BASE}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`,
        { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Failed to fetch products by category ${category}`);
    return res.json();
}

export async function loginUser(username: string, password: string): Promise<User & { message?: string }> {
    const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, expiresInMins: 60 }),
        cache: "no-store",
    });
    return res.json();
}

export function sortProducts(products: Product[], sort?: string): Product[] {
    if (!sort) return products;
    const sorted = [...products];
    switch (sort) {
        case "price-asc":
            return sorted.sort((a, b) => a.price - b.price);
        case "price-desc":
            return sorted.sort((a, b) => b.price - a.price);
        case "rating":
            return sorted.sort((a, b) => b.rating - a.rating);
        case "discount":
            return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
        case "name":
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sorted;
    }
}

export function getDiscountedPrice(price: number, discount: number): number {
    return price * (1 - discount / 100);
}
