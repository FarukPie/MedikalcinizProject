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
            <div className="bg-secondary text-primary p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                <CheckCircle className="h-5 w-5 text-primary" />
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
        <Card className="group overflow-hidden border-slate-100 bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 relative h-full flex flex-col rounded-3xl">
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "absolute top-3 right-3 z-10 rounded-full h-10 w-10 hover:bg-white/90 bg-white/60 backdrop-blur-md shadow-sm transition-all active:scale-90",
                    isFavorite ? "text-red-500 hover:text-red-600 bg-red-50/80" : "text-slate-400 hover:text-red-500",
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
                    <Heart className={cn("w-5 h-5 transition-transform active:scale-75", isFavorite && "fill-current")} />
                )}
            </Button>

            <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                    {/* Image Placeholder */}
                    <div className="aspect-[4/5] bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center text-slate-400 relative overflow-hidden p-6">
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                        {product.image && !imageError ? (
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-contain p-4 transition-transform duration-700 group-hover:scale-110 drop-shadow-sm"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
                                    <ImageIcon className="w-8 h-8 text-slate-300" />
                                </div>
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Görsel Yok</span>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                            <Badge variant="secondary" className="bg-blue-50 text-primary hover:bg-blue-100 font-semibold text-[10px] px-2.5 py-1 h-auto w-fit rounded-lg tracking-wide uppercase">
                                {product.category}
                            </Badge>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                {product.code}
                            </span>
                        </div>

                        <div className="space-y-1 flex-1">
                            <h3 className="font-bold text-slate-900 line-clamp-2 min-h-[3rem] text-base leading-snug group-hover:text-primary transition-colors">
                                {product.title}
                            </h3>
                        </div>

                        <div className="pt-2 flex items-baseline gap-1.5 mt-auto">
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                {product.price.toFixed(2)}
                                <span className="text-sm font-semibold ml-1 text-slate-500">TL</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded">
                                +KDV
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="p-5 pt-0 mt-auto">
                <Button
                    className="w-full h-11 bg-secondary hover:bg-secondary/90 text-primary gap-2 shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all duration-300 rounded-xl font-semibold text-sm group-hover:translate-y-0 relative z-20"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-4 h-4" />
                    Sepete Ekle
                </Button>
            </CardFooter>
        </Card>
    );
}
