"use client";

import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Package, Activity, FlaskConical, Stethoscope, Syringe, Thermometer, Bandage } from "lucide-react";
import Link from "next/link";

const categories = [
    { id: 1, name: "Koruyucu Ekipman", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 2, name: "Sarf Malzeme", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: 3, name: "Medikal Cihaz", icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
    { id: 4, name: "Laboratuvar", icon: FlaskConical, color: "text-purple-600", bg: "bg-purple-50" },
    { id: 5, name: "Ortopedi", icon: Stethoscope, color: "text-orange-600", bg: "bg-orange-50" },
    { id: 6, name: "Enjeksiyon", icon: Syringe, color: "text-red-600", bg: "bg-red-50" },
    { id: 7, name: "Tanı Cihazları", icon: Thermometer, color: "text-cyan-600", bg: "bg-cyan-50" },
    { id: 8, name: "İlk Yardım", icon: Bandage, color: "text-rose-600", bg: "bg-rose-50" },
];

export default function CategoriesPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Tüm Kategoriler</h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/products?category=${category.name}`}>
                            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-slate-200 h-full">
                                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4 h-full">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${category.bg} ${category.color}`}>
                                        <category.icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
