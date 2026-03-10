import { ProductCard } from "./product-card";
import type { Product } from "@/lib/types";

interface ProductGridProps {
    products: Product[];
    showRemoveButton?: boolean;
    onRemove?: (product: Product) => void;
}

export function ProductGrid({ products, showRemoveButton, onRemove }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <span className="text-6xl">🔍</span>
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    showRemoveButton={showRemoveButton}
                    onRemove={onRemove}
                />
            ))}
        </div>
    );
}
