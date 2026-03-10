export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
  tags?: string[];
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode?: string;
    qrCode?: string;
  };
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  token: string;
  refreshToken?: string;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface MockOrder {
  id: string;
  date: string;
  status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
  items: { title: string; qty: number; price: number; thumbnail?: string }[];
  total: number;
  shippingAddress?: string;
}
