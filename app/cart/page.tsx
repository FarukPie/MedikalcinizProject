"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const vat = subtotal * 0.20;
    const total = subtotal + vat;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-8">Alışveriş Sepetim</h1>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                            <ShoppingBag className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Sepetiniz Boş</h2>
                        <p className="text-slate-500 mb-8">Henüz sepetinize ürün eklemediniz.</p>
                        <Link href="/products">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                                Alışverişe Başla
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <Card key={item.id} className="border-slate-200 shadow-sm">
                                    <CardContent className="p-4 flex gap-4 items-center">
                                        {/* Image Placeholder */}
                                        <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                            <span className="text-[10px] text-slate-400 font-medium">Görsel Yok</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-900 truncate">{item.title}</h3>
                                            <p className="text-xs text-slate-500 mb-2">Kod: {item.code}</p>
                                            <div className="font-bold text-blue-700">
                                                {item.price.toFixed(2)} TL
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center border border-slate-200 rounded-lg">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none rounded-l-lg hover:bg-slate-50"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-none rounded-r-lg hover:bg-slate-50"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="border-slate-200 shadow-sm sticky top-24">
                                <CardContent className="p-6 space-y-4">
                                    <h2 className="font-bold text-lg text-slate-900">Sipariş Özeti</h2>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-slate-600">
                                            <span>Ara Toplam</span>
                                            <span>{subtotal.toFixed(2)} TL</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600">
                                            <span>KDV (%20)</span>
                                            <span>{vat.toFixed(2)} TL</span>
                                        </div>
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span>Kargo</span>
                                            <span>Ücretsiz</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-slate-900">Toplam</span>
                                        <span className="font-bold text-xl text-blue-700">{total.toFixed(2)} TL</span>
                                    </div>

                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-medium shadow-lg shadow-blue-600/20">
                                        Ödemeye Git <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
