import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Review } from "@/lib/types";

interface ProductReviewsProps {
    reviews: Review[];
    rating: number;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-200"
                        }`}
                />
            ))}
        </div>
    );
}

export function ProductReviews({ reviews, rating }: ProductReviewsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="text-center">
                    <div className="text-5xl font-bold">{rating.toFixed(1)}</div>
                    <StarRating rating={rating} />
                    <div className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                {reviews.map((review, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{review.reviewerName}</span>
                            <StarRating rating={review.rating} />
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground/60">
                            {new Date(review.date).toLocaleDateString()}
                        </p>
                        {idx < reviews.length - 1 && <Separator className="mt-3" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
