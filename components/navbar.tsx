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
import { useStore, mockProducts } from "@/lib/store";
import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

function NavbarContent() {
    const { cartItems, favoriteItems } = useStore();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const debouncedSearch = useDebounce(searchQuery, 300);
    const [searchResults, setSearchResults] = useState<typeof mockProducts>([]);
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
        if (debouncedSearch.trim().length > 0) {
            const results = mockProducts.filter(product =>
                product.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                product.category.toLowerCase().includes(debouncedSearch.toLowerCase())
            ).slice(0, 5);
            setSearchResults(results);
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
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
        <header className="w-full flex flex-col">
            {/* Top Bar */}
            <div className="bg-blue-700 text-white text-xs font-medium py-2 px-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>Destek: 0850 XXX XX XX</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Package className="w-3 h-3" />
                        <span>İzmir İçi Aynı Gün Teslimat</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
                <div className="container mx-auto py-4 px-4 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-blue-600 shrink-0">
                        Medikalciniz
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl relative hidden md:block" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Input
                                type="text"
                                placeholder="Ürün, kategori veya barkod ara..."
                                className="w-full rounded-full pl-6 pr-12 border-slate-200 focus-visible:ring-blue-600"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (debouncedSearch.trim().length > 0) setShowDropdown(true);
                                }}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 hover:bg-blue-700 w-8 h-8"
                            >
                                <Search className="w-4 h-4 text-white" />
                            </Button>
                        </form>

                        {/* Autocomplete Dropdown */}
                        {showDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                                {searchResults.length > 0 ? (
                                    <div className="py-2">
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/products/${product.id}`}
                                                onClick={() => setShowDropdown(false)}
                                                className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                                    <ImageIcon className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-slate-900 truncate">{product.title}</h4>
                                                    <p className="text-xs text-slate-500 truncate">{product.category}</p>
                                                </div>
                                                <div className="font-bold text-blue-600 text-sm whitespace-nowrap">
                                                    {product.price.toFixed(2)} TL
                                                </div>
                                            </Link>
                                        ))}
                                        <div className="px-2 pt-2 border-t border-slate-100 mt-2">
                                            <Button
                                                variant="ghost"
                                                className="w-full text-xs text-blue-600 h-8 hover:bg-blue-50"
                                                onClick={() => handleSearchSubmit()}
                                            >
                                                Tüm sonuçları gör ({searchResults.length}+)
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500 text-sm">
                                        Sonuç bulunamadı.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 shrink-0">
                        <Link href="/favorites">
                            <div className="relative">
                                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                                    <Heart className="w-5 h-5" />
                                </Button>
                                {mounted && favoriteItems.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-[10px]">
                                        {favoriteItems.length}
                                    </Badge>
                                )}
                            </div>
                        </Link>

                        <Link href="/cart">
                            <div className="relative">
                                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                                    <ShoppingCart className="w-5 h-5" />
                                </Button>
                                {cartCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-600 text-[10px]">
                                        {cartCount}
                                    </Badge>
                                )}
                            </div>
                        </Link>

                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                                    <User className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Yönetim Paneli</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Çıkış Yap</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div >
        </header >
    );
}

export function Navbar() {
    return (
        <Suspense fallback={<header className="w-full h-20 bg-white border-b border-slate-200" />}>
            <NavbarContent />
        </Suspense>
    );
}
