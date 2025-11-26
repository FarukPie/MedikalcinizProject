"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockProducts, useStore } from "@/lib/store";
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
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProductCard } from "@/components/product-card";

export default function ProductDetailPage() {
    const params = useParams();
    const { addToCart, toggleFavorite, favoriteItems } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const product = mockProducts.find((p) => p.id === Number(params.id));

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 font-sans">
                <Navbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Ürün Bulunamadı</h1>
                    <Link href="/products">
                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                            Ürünlere Dön
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isFavorite = mounted ? favoriteItems.some((item) => item.id === product.id) : false;
    const priceWithVat = product.price * 1.20;

    const similarProducts = mockProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.custom((t) => (
            <div className="bg-emerald-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
                <Check className="h-5 w-5 text-white" />
                <div className="font-bold">Başarılı! {quantity} adet ürün sepete eklendi.</div>
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
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Anasayfa</Link>
                    <span className="mx-2">&gt;</span>
                    <Link href={`/products?category=${product.category}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
                    <span className="mx-2">&gt;</span>
                    <span className="text-slate-900 font-medium truncate">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
                    {/* Left Column: Image */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 flex items-center justify-center aspect-square relative overflow-hidden group">
                        {product.image && !imageError ? (
                            <NextImage
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
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
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-slate-500 font-mono text-sm">
                                Ürün Kodu: {product.code}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1 text-sm font-medium gap-1.5 hover:bg-emerald-100">
                                <Check className="w-4 h-4" />
                                Stokta Var (150 adet)
                            </Badge>
                        </div>

                        <Separator />

                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-blue-700">
                                    {product.price.toFixed(2)} TL
                                </span>
                                <span className="text-lg text-slate-400 font-medium">
                                    / adet
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-medium text-slate-900">
                                    {priceWithVat.toFixed(2)} TL
                                </span>
                                <span>KDV Dahil</span>
                                <Badge variant="secondary" className="text-[10px] h-5 bg-slate-100 text-slate-600">
                                    +KDV (%20)
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-slate-200 rounded-lg bg-white h-12 w-fit shrink-0">
                                <button
                                    onClick={decreaseQuantity}
                                    className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-l-lg transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="w-12 h-full flex items-center justify-center font-bold text-slate-900 border-x border-slate-100">
                                    {quantity}
                                </div>
                                <button
                                    onClick={increaseQuantity}
                                    className="w-12 h-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-r-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 flex-1">
                                <Button
                                    className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Sepete Ekle
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`h-12 w-12 shrink-0 border-slate-200 ${isFavorite ? 'text-red-500 border-red-200 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50'}`}
                                    onClick={() => toggleFavorite(product)}
                                >
                                    <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </Button>
                            </div>
                        </div>

                        {/* Trust Icons */}
                        <div className="grid grid-cols-2 gap-4 pt-6">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Hızlı Kargo</h4>
                                    <p className="text-xs text-slate-500">Aynı gün teslimat</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Güvenli Ödeme</h4>
                                    <p className="text-xs text-slate-500">256-bit SSL koruması</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div className="border-t border-slate-200 pt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Benzer Ürünler</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProducts.map((p) => (
                                <ProductCard key={p.id} {...p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
