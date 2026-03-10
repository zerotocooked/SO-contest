import type { MockOrder } from "@/lib/types";

export const mockOrders: MockOrder[] = [
    {
        id: "ORD-1741600000001",
        date: "2026-02-28",
        status: "Delivered",
        total: 47.97,
        shippingAddress: "123 Main St, New York, NY 10001",
        items: [
            { title: "Essence Mascara Lash Princess", qty: 1, price: 9.99, thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png" },
            { title: "Eyeshadow Palette with Mirror", qty: 2, price: 19.99 },
        ],
    },
    {
        id: "ORD-1741200000002",
        date: "2026-02-14",
        status: "Delivered",
        total: 129.99,
        shippingAddress: "456 Oak Ave, Los Angeles, CA 90210",
        items: [
            { title: "iPhone X", qty: 1, price: 899.99 },
        ],
    },
    {
        id: "ORD-1740800000003",
        date: "2026-01-30",
        status: "Shipped",
        total: 35.98,
        shippingAddress: "789 Elm Rd, Chicago, IL 60601",
        items: [
            { title: "Dior J'adore", qty: 1, price: 22.99 },
            { title: "Gucci Bloom", qty: 1, price: 12.99 },
        ],
    },
    {
        id: "ORD-1740400000004",
        date: "2026-01-15",
        status: "Delivered",
        total: 74.97,
        shippingAddress: "321 Pine St, Houston, TX 77001",
        items: [
            { title: "Samsung Universe 9", qty: 1, price: 1249.99 },
        ],
    },
    {
        id: "ORD-1739800000005",
        date: "2025-12-29",
        status: "Processing",
        total: 19.99,
        shippingAddress: "654 Maple Dr, Phoenix, AZ 85001",
        items: [
            { title: "Nail Polish Set", qty: 3, price: 6.99 },
        ],
    },
];
