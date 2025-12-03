"use client";

import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

import { Product, Category } from "@prisma/client";

interface ProductListingProps {
    initialProducts: (Omit<Product, "price" | "buyPrice" | "sellPrice"> & { price: number; buyPrice: number; sellPrice: number; category: Category | null })[];
    categories: Category[];
}

export function ProductListing({ initialProducts, categories }: ProductListingProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        if (categoryParam) {
            // Find the category name based on slug if possible, or just use the param
            // Since we pass categories with name and slug, we can match
            const cat = categories.find(c => c.slug === categoryParam);
            if (cat) {
                setSelectedCategories([cat.slug]);
            } else {
                setSelectedCategories([categoryParam]);
            }
        } else {
            setSelectedCategories([]);
        }
    }, [categoryParam, categories]);

    const toggleCategory = (categorySlug: string) => {
        let newCategories;
        if (selectedCategories.includes(categorySlug)) {
            newCategories = selectedCategories.filter((c) => c !== categorySlug);
        } else {
            // Single select for now as per URL structure ?category=slug
            // If we want multi-select, we need to update server action to accept array
            // For now, let's stick to single category selection behavior to match the simple server action
            newCategories = [categorySlug];
        }
        setSelectedCategories(newCategories);

        if (newCategories.length === 1) {
            router.push(`/products?category=${newCategories[0]}${searchParam ? `&search=${searchParam}` : ''}`);
        } else if (newCategories.length === 0) {
            router.push(`/products${searchParam ? `?search=${searchParam}` : ''}`);
        }
    };

    // Client-side price filtering
    const filteredProducts = initialProducts.filter((product) => {
        const matchesPrice = Number(product.price) >= priceRange[0] && Number(product.price) <= priceRange[1];
        return matchesPrice;
    });

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden md:block w-72 shrink-0">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <Filter className="w-4 h-4 text-blue-600" />
                                        Filtrele
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-xs text-slate-500 hover:text-red-600 font-medium"
                                        onClick={() => {
                                            setSelectedCategories([]);
                                            setPriceRange([0, 5000]);
                                            router.push("/products");
                                        }}
                                    >
                                        Temizle
                                    </Button>
                                </div>

                                <div className="p-4">
                                    <Accordion type="multiple" defaultValue={["categories", "price"]}>
                                        <AccordionItem value="categories" className="border-b-0">
                                            <AccordionTrigger className="py-3 hover:no-underline hover:text-blue-600">
                                                Kategoriler
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-3 pt-1">
                                                    {categories.map((category) => (
                                                        <div key={category.id} className="flex items-center space-x-3 group">
                                                            <Checkbox
                                                                id={category.slug}
                                                                checked={selectedCategories.includes(category.slug)}
                                                                onCheckedChange={() => toggleCategory(category.slug)}
                                                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                            />
                                                            <Label
                                                                htmlFor={category.slug}
                                                                className="text-sm text-slate-600 group-hover:text-blue-600 cursor-pointer transition-colors"
                                                            >
                                                                {category.name}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="price" className="border-b-0 border-t border-slate-100">
                                            <AccordionTrigger className="py-3 hover:no-underline hover:text-blue-600">
                                                Fiyat Aralığı
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-6 pt-2 px-1">
                                                    <Slider
                                                        defaultValue={[0, 5000]}
                                                        max={5000}
                                                        step={100}
                                                        value={priceRange}
                                                        onValueChange={setPriceRange}
                                                        className="py-2"
                                                    />
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1">
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Min</span>
                                                            <div className="border border-slate-200 rounded-md px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50">
                                                                {priceRange[0]} TL
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Max</span>
                                                            <div className="border border-slate-200 rounded-md px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50">
                                                                {priceRange[1]} TL
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Filter Sheet */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button suppressHydrationWarning variant="outline" className="w-full">
                                    <Filter className="mr-2 h-4 w-4" /> Filtrele
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="space-y-8 py-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4">Kategoriler</h3>
                                        <div className="space-y-3">
                                            {categories.map((category) => (
                                                <div key={category.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`mobile-${category.slug}`}
                                                        checked={selectedCategories.includes(category.slug)}
                                                        onCheckedChange={() => toggleCategory(category.slug)}
                                                    />
                                                    <Label htmlFor={`mobile-${category.slug}`}>{category.name}</Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4">Fiyat Aralığı</h3>
                                        <Slider
                                            defaultValue={[0, 5000]}
                                            max={5000}
                                            step={100}
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                            className="py-4"
                                        />
                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <span>{priceRange[0]} TL</span>
                                            <span>{priceRange[1]} TL</span>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Tüm Ürünler
                                <span className="ml-2 text-sm font-normal text-slate-500">
                                    ({filteredProducts.length} ürün)
                                </span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    category={product.category?.name || 'Genel'}
                                    title={product.name}
                                    code={product.code}
                                    price={Number(product.price as any)}
                                    image={product.image || undefined}
                                />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                Aradığınız kriterlere uygun ürün bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
