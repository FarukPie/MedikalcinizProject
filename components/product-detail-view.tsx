"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import {
    Check,
    Heart,
    Minus,
    Plus,
    ShieldCheck,
    Truck,
    Image as ImageIcon,
    ShoppingCart
} from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product-card";

interface ProductDetailViewProps {
    product: any; // We'll fix the type later or let it be inferred
    similarProducts: any[];
}

export function ProductDetailView({ product, similarProducts }: ProductDetailViewProps) {
    const { addToCart, toggleFavorite, favoriteItems } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isFavorite = mounted ? favoriteItems.some((item) => item.id === product.id) : false;
    const priceWithVat = Number(product.price) * 1.20;

    // Handle image array vs string
    const mainImage = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : product.image;

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                ...product,
                image: mainImage, // Ensure store gets a string image
                price: Number(product.price)
            });
        }
        toast.custom((t) => (
            <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 min-w-[300px] animate-in slide-in-from-bottom-5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                </div>
                <div>
                    <div className="font-bold">Sepete Eklendi</div>
                    <div className="text-sm text-emerald-100">{quantity} adet {product.name}</div>
                </div>
            </div>
        ), { duration: 2000 });
    };

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <main className="container mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
                <Link href="/" className="hover:text-blue-600 transition-colors hover:underline underline-offset-4">Anasayfa</Link>
                <span className="mx-3 text-slate-300">/</span>
                <Link href={`/products?category=${product.category?.slug || ''}`} className="hover:text-blue-600 transition-colors hover:underline underline-offset-4">{product.category?.name || 'Kategori'}</Link>
                <span className="mx-3 text-slate-300">/</span>
                <span className="text-slate-900 font-medium truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24">
                {/* Left Column: Image */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 flex items-center justify-center aspect-square relative overflow-hidden group shadow-2xl shadow-slate-200/50">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50 via-white to-white opacity-50"></div>
                    {mainImage && !imageError ? (
                        <NextImage
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-contain p-8 transition-transform duration-700 group-hover:scale-110 drop-shadow-xl"
                            priority
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 flex flex-col items-center text-slate-300">
                                <ImageIcon className="w-32 h-32 mb-4 opacity-50" />
                                <span className="text-lg font-medium">Görsel Yok</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Info & Actions */}
                <div className="flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md">
                                {product.category?.name || 'Genel'}
                            </Badge>
                            {product.stock > 0 ? (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-xs font-bold uppercase tracking-wider gap-1.5 rounded-md">
                                    <Check className="w-3 h-3" />
                                    Stokta Var
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-3 py-1 text-xs font-bold uppercase tracking-wider gap-1.5 rounded-md">
                                    <Minus className="w-3 h-3" />
                                    Tükendi
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 leading-[1.1] tracking-tight">
                            {product.name}
                        </h1>
                        <p className="text-slate-500 font-mono text-sm bg-slate-100 w-fit px-3 py-1 rounded-lg">
                            Ürün Kodu: <span className="text-slate-700 font-semibold">{product.sku}</span>
                        </p>
                        <p className="mt-4 text-slate-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <Separator className="mb-8" />

                    <div className="space-y-8">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-bold text-blue-600 tracking-tight">
                                    {Number(product.price).toFixed(2)}
                                    <span className="text-2xl ml-1 text-blue-400">TL</span>
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                    {priceWithVat.toFixed(2)} TL
                                </span>
                                <span>KDV Dahil</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border-2 border-slate-100 rounded-2xl bg-white h-14 w-fit shrink-0 shadow-sm">
                                <button
                                    onClick={decreaseQuantity}
                                    className="w-14 h-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-l-2xl transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-5 h-5" />
                                </button>
                                <div className="w-12 h-full flex items-center justify-center font-bold text-xl text-slate-900 border-x border-slate-50">
                                    {quantity}
                                </div>
                                <button
                                    onClick={increaseQuantity}
                                    className="w-14 h-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-r-2xl transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 flex-1">
                                <Button
                                    className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/20 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    onClick={handleAddToCart}
                                    disabled={product.stock <= 0}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    {product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`h-14 w-14 shrink-0 border-2 rounded-2xl transition-all ${isFavorite ? 'text-red-500 border-red-100 bg-red-50' : 'text-slate-400 border-slate-200 hover:text-red-500 hover:border-red-100 hover:bg-red-50'}`}
                                    onClick={() => toggleFavorite({ ...product, image: mainImage, price: Number(product.price) })}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Trust Icons */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">Hızlı Kargo</h4>
                                    <p className="text-xs text-slate-500">Aynı gün teslimat</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-0.5">Güvenli Ödeme</h4>
                                    <p className="text-xs text-slate-500">256-bit SSL koruması</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <div className="border-t border-slate-200 pt-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Benzer Ürünler</h2>
                        <Link href="/products">
                            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">Tümünü Gör</Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {similarProducts.map((p) => (
                            <ProductCard
                                key={p.id}
                                id={p.id}
                                category={p.category?.name || 'Genel'}
                                title={p.name}
                                code={p.sku}
                                price={Number(p.price)}
                                image={Array.isArray(p.images) ? p.images[0] : p.image}
                            />
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
}
