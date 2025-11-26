"use client";

import { useState } from "react";

import { ShoppingCart, Image as ImageIcon, Heart, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore, Product } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps extends Product {
    showRemoveOnHover?: boolean;
}

export function ProductCard({ showRemoveOnHover = false, ...product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const { addToCart, toggleFavorite, favoriteItems } = useStore();
    const isFavorite = favoriteItems.some((item) => item.id === product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast.custom((t) => (
            <div className="bg-emerald-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                <CheckCircle className="h-5 w-5 text-white" />
                <div className="font-bold">Başarılı! Ürün sepete eklendi.</div>
            </div>
        ), { duration: 2000 });
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    };

    return (
        <Card className="group overflow-hidden border-slate-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative h-full flex flex-col">
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "absolute top-2 right-2 z-10 rounded-full hover:bg-white/80 bg-white/50 backdrop-blur-sm transition-all active:scale-90",
                    isFavorite ? "text-red-500 hover:text-red-600" : "text-slate-400 hover:text-red-500",
                    showRemoveOnHover && isFavorite && "group/fav hover:bg-red-100 hover:text-red-600"
                )}
                onClick={handleToggleFavorite}
            >
                {showRemoveOnHover && isFavorite ? (
                    <>
                        <Heart className="w-5 h-5 fill-current group-hover/fav:hidden" />
                        <Trash2 className="w-5 h-5 hidden group-hover/fav:block" />
                    </>
                ) : (
                    <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
                )}
            </Button>

            <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                    {/* Image Placeholder */}
                    <div className="aspect-square bg-slate-100 flex flex-col items-center justify-center text-slate-400 group-hover:bg-slate-50 transition-colors relative overflow-hidden">
                        {product.image && !imageError ? (
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <>
                                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                <span className="text-xs font-medium">Görsel Yok</span>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-[10px] px-2 py-0.5 h-auto w-fit">
                            {product.category}
                        </Badge>

                        <div className="space-y-1 flex-1">
                            <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[3rem] text-sm leading-tight group-hover:text-blue-600 transition-colors">
                                {product.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono">
                                Kod: {product.code}
                            </p>
                        </div>

                        <div className="pt-2 flex items-baseline gap-1 mt-auto">
                            <span className="text-xl font-bold text-blue-700">
                                {product.price.toFixed(2)} TL
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                                +KDV (%20)
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="p-4 pt-0 mt-auto">
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 group-hover:shadow-lg group-hover:shadow-blue-600/20 transition-all"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-4 h-4" />
                    Sepete Ekle
                </Button>
            </CardFooter>
        </Card>
    );
}
