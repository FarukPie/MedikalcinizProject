"use client";

import Link from "next/link";
import { Search, Heart, ShoppingCart, User, Package, Phone, LogOut, Settings, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Product, Category } from "@prisma/client";

function NavbarContent() {
    const { cartItems, favoriteItems } = useStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [searchResults, setSearchResults] = useState<(Product & { category: Category })[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearch.trim().length > 0) {
                try {
                    // Import dynamically to avoid server action issues in some contexts if needed, 
                    // but standard import should work.
                    const { getProducts } = await import("@/lib/actions/product");
                    const results = await getProducts({ search: debouncedSearch });
                    setSearchResults(results.slice(0, 5));
                    setShowDropdown(true);
                } catch (error) {
                    console.error("Failed to fetch search suggestions:", error);
                    setSearchResults([]);
                }
            } else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        };

        fetchSuggestions();
    }, [debouncedSearch]);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        setShowDropdown(false);
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const cartCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <>
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground text-xs font-medium py-2.5 px-4 shadow-sm relative z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
                            <Phone className="w-3.5 h-3.5" />
                            <span>+90 555 123 45 67</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="w-1 h-1 rounded-full bg-secondary"></span>
                            <span>support@medikalciniz.com</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center gap-2 opacity-90">
                            <span>Pzt-Cum: 9:00-18:00</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-90">
                            <Package className="w-3.5 h-3.5" />
                            <span>Hızlı Teslimat</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="sticky top-0 left-0 right-0 z-40 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm transition-all duration-300">
                <div className="container mx-auto py-4 px-4 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-bold text-xl">M</span>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            Medikalciniz
                        </span>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl relative hidden md:block" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Medikal ürünlerde ara..."
                                className="w-full h-12 rounded-full pl-12 pr-14 border-slate-200 bg-slate-50/50 focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all duration-300 shadow-sm hover:shadow-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (debouncedSearch.trim().length > 0) setShowDropdown(true);
                                }}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-secondary hover:bg-secondary/90 text-primary-foreground w-9 h-9 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                            >
                                <Search className="w-4 h-4" />
                            </Button>
                        </form>

                        {/* Autocomplete Dropdown */}
                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                                {searchResults.length > 0 ? (
                                    <div className="py-2">
                                        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Sonuçlar
                                        </div>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50/50 transition-colors group/item"
                                            >
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                                                    <ImageIcon className="w-6 h-6 text-slate-400 group-hover/item:text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-slate-900 truncate group-hover/item:text-primary transition-colors">{product.name}</h4>
                                                    <p className="text-xs text-slate-500 truncate">{product.category?.name}</p>
                                                </div>
                                                <div className="font-bold text-primary text-sm whitespace-nowrap bg-blue-50 px-2 py-1 rounded-lg group-hover/item:bg-blue-100 transition-colors">
                                                    {Number(product.price).toFixed(2)} TL
                                                </div>
                                            </Link>
                                        ))}
                                        <div className="p-2 mt-2 border-t border-slate-50">
                                            <Button
                                                variant="ghost"
                                                className="w-full text-sm text-primary h-10 hover:bg-blue-50 rounded-xl font-medium"
                                                onClick={() => handleSearchSubmit()}
                                            >
                                                Tüm sonuçları gör ({searchResults.length}+)
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center flex flex-col items-center justify-center text-slate-500">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="font-medium text-slate-900">Sonuç bulunamadı</p>
                                        <p className="text-sm mt-1">Lütfen farklı anahtar kelimeler deneyin.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link href="/favorites">
                            <div className="relative group">
                                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-slate-600 hover:text-secondary hover:bg-secondary/10 transition-all duration-300">
                                    <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
                                </Button>
                                {mounted && favoriteItems.length > 0 && (
                                    <Badge className="absolute top-0 right-0 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/90 text-[10px] border-2 border-white shadow-sm animate-in zoom-in">
                                        {favoriteItems.length}
                                    </Badge>
                                )}
                            </div>
                        </Link>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <div className="relative group cursor-pointer">
                                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-slate-600 hover:text-secondary hover:bg-secondary/10 transition-all duration-300">
                                        <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                                    </Button>
                                    {cartCount > 0 && (
                                        <Badge className="absolute top-0 right-0 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/90 text-[10px] border-2 border-white shadow-sm animate-in zoom-in">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                    <h4 className="font-semibold text-slate-900">Sepetim ({cartCount})</h4>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto p-2">
                                    {cartItems.length > 0 ? (
                                        <div className="space-y-1">
                                            {cartItems.map((item) => (
                                                <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors group/item">
                                                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                                                        ) : (
                                                            <ImageIcon className="w-5 h-5 text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-sm font-medium text-slate-900 truncate group-hover/item:text-primary transition-colors">{item.title}</h5>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{item.quantity} adet</span>
                                                            <span className="text-sm font-bold text-primary">{(item.price * item.quantity).toFixed(2)} TL</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center flex flex-col items-center justify-center text-slate-400">
                                            <ShoppingCart className="w-10 h-10 mb-3 opacity-20" />
                                            <p className="text-sm font-medium text-slate-600">Sepetiniz boş</p>
                                            <p className="text-xs mt-1">Alışverişe başlamak için ürünleri inceleyin.</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-slate-600">Toplam Tutar</span>
                                        <span className="text-lg font-bold text-primary">
                                            {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)} TL
                                        </span>
                                    </div>
                                    <Link href="/cart" className="w-full">
                                        <Button className="w-full bg-primary hover:bg-blue-700 text-white font-semibold h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                            Sepet Detayları
                                        </Button>
                                    </Link>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/login">
                            <div className="relative group cursor-pointer">
                                <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-slate-600 hover:text-secondary hover:bg-secondary/10 transition-all duration-300">
                                    <User className="w-6 h-6 transition-transform group-hover:scale-110" />
                                </Button>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export function Navbar() {
    return (
        <Suspense fallback={<header className="w-full h-20 bg-white border-b border-slate-200" />}>
            <NavbarContent />
        </Suspense>
    );
}
