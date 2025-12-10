"use client";

import {
    DollarSign,
    ShoppingBag,
    Package,
    CheckCircle2,
    Clock,
    XCircle,
    TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 2
    }).format(amount);
}

interface CustomerDashboardStatsProps {
    stats: {
        totalOrders: { count: number; amount: number };
        activeOrders: { count: number; amount: number };
        completedOrders: { count: number; amount: number };
        totalPurchases: { count: number; amount: number }; // Alım (Purchase for customer is Sale for us maybe? Client asked for Sales/Purchase amounts. Assuming Customer buys from us -> Sales for us, Purchase for them. But usually in B2B they might also sell to us? Let's assume Sales = their orders from us.)
        // Prompt said: "satış/alım tutarı, miktarı".
        // If they are a customer, "Alım" is what they bought from us (Our Sales). "Satış" might be what they sold to us (if they are also a Supplier) or just how they perceive it.
        // Let's stick to Orders (what they bought).
        // Maybe "Satış" means "Sales to them" and "Alım" means "Purchases from them"?
        // Or "Satış" = Their Sales (if they use system to sell?), "Alım" = Their Purchases (from us).
        // Given context "Medicalciniz", probably B2B.
        // Let's implement based on Order directions if available, or just generic "Orders".
        // The Partner model has 'type' (CUSTOMER, SUPPLIER, BOTH).
        // If CUSTOMER, they have Orders (buying from us).
        // Let's display:
        // 1. Toplam Sipariş (Total Orders)
        // 2. Aktif Siparişler (Active)
        // 3. Tamamlanan Siparişler (Completed)
        // This covers "miktar" (count) and "tutar" (amount).
    };
    userName: string;
}

export function CustomerDashboardStats({ stats, userName }: CustomerDashboardStatsProps) {
    const statCards = [
        {
            title: "Toplam Sipariş",
            count: stats.totalOrders.count,
            amount: stats.totalOrders.amount,
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Aktif Siparişler",
            count: stats.activeOrders.count,
            amount: stats.activeOrders.amount,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "Tamamlanan Siparişler",
            count: stats.completedOrders.count,
            amount: stats.completedOrders.amount,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Hoş Geldiniz, {userName}</h1>
                <p className="text-slate-500 mt-2">Sipariş durumlarınızı buradan takip edebilirsiniz.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.count} Adet</h3>
                                </div>
                                <p className="text-sm font-semibold text-slate-700 mt-1">
                                    {formatCurrency(stat.amount)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
