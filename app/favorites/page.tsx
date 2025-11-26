"use client";

import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeartOff } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

function FavoritesContent() {
    const { favoriteItems } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />

            {/* Header */}
            <div className="bg-slate-50 border-b border-slate-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Favori Ürünlerim</h1>
                    <p className="text-slate-600">
                        Kaydettiğiniz ürünleri burada bulabilir, dilediğiniz zaman sepete ekleyebilirsiniz.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12">
                {favoriteItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {favoriteItems.map((product) => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                showRemoveOnHover={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <HeartOff className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Henüz favori ürününüz yok.</h2>
                        <p className="text-slate-500 mb-8 max-w-md">
                            Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilerinize ekleyebilir ve daha sonra kolayca ulaşabilirsiniz.
                        </p>
                        <Link href="/products">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                                Ürünleri Keşfet
                            </Button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function FavoritesPage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <FavoritesContent />
        </Suspense>
    );
}
