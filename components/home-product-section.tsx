"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HomeProductSectionProps {
    latestProducts: any[];
    bestSellingProducts: any[];
}

export function HomeProductSection({ latestProducts, bestSellingProducts }: HomeProductSectionProps) {
    const [activeTab, setActiveTab] = useState<'latest' | 'bestsellers'>('latest');

    const displayedProducts = activeTab === 'latest' ? latestProducts : bestSellingProducts;

    return (
        <section className="container mx-auto px-4 py-12 mb-24">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        {activeTab === 'latest' ? 'Son Eklenen Ürünler' : 'Çok Satanlar'}
                    </h2>
                    <p className="text-slate-500">
                        {activeTab === 'latest'
                            ? 'En yeni medikal ürünlerimizi keşfedin'
                            : 'Müşterilerimizin en çok tercih ettiği ürünler'}
                    </p>
                </div>
                <div className="flex gap-3 bg-slate-100 p-1 rounded-full">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('latest')}
                        className={cn(
                            "rounded-full px-6 font-medium transition-all duration-300",
                            activeTab === 'latest'
                                ? "bg-white text-blue-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        Yeni Gelenler
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab('bestsellers')}
                        className={cn(
                            "rounded-full px-6 font-medium transition-all duration-300",
                            activeTab === 'bestsellers'
                                ? "bg-white text-blue-700 shadow-sm"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                    >
                        Çok Satanlar
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        category={product.category?.name || 'Genel'}
                        title={product.name}
                        code={product.code}
                        price={Number(product.price)}
                        image={product.image || undefined}
                    />
                ))}
            </div>

            {displayedProducts.length === 0 && (
                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <p>Bu kategoride henüz ürün bulunmuyor.</p>
                </div>
            )}
        </section>
    );
}
