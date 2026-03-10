"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    images: string[];
    thumbnail: string;
    title: string;
}

export function ProductImageGallery({ images, thumbnail, title }: ProductImageGalleryProps) {
    const allImages = images.length > 0 ? images : [thumbnail];
    const [selected, setSelected] = useState(0);

    function prev() {
        setSelected((s) => (s > 0 ? s - 1 : allImages.length - 1));
    }
    function next() {
        setSelected((s) => (s < allImages.length - 1 ? s + 1 : 0));
    }

    return (
        <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border">
                <Image
                    src={allImages[selected]}
                    alt={`${title} - image ${selected + 1}`}
                    fill
                    className="object-contain p-4"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition-all"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white transition-all"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={cn(
                                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 bg-slate-50 transition-all",
                                idx === selected ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
