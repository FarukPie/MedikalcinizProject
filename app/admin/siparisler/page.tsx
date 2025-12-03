"use client";

import {
    Search,
    Filter,
    Eye,
    Printer,
    Edit2,
    Trash2,
    ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock Data
const ORDERS = [
    {
        id: "SIP-2024-001",
        customer: "Bayram YAĞCI",
        date: "03 Kas 2024",
        total: 1250.00,
        status: "pending",
        items: 5
    },
    {
        id: "SIP-2024-002",
        customer: "Şehir Hastanesi",
        date: "02 Kas 2024",
        total: 45000.00,
        status: "approved",
        items: 12
    },
    {
        id: "SIP-2024-003",
        customer: "Medikal Depo A.Ş.",
        date: "01 Kas 2024",
        total: 8450.50,
        status: "shipped",
        items: 8
    },
    {
        id: "SIP-2024-004",
        customer: "Özel Klinik",
        date: "30 Eki 2024",
        total: 3200.00,
        status: "delivered",
        items: 3
    },
];

const STATUS_MAP: Record<string, { label: string, className: string }> = {
    pending: { label: "Bekliyor", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    approved: { label: "Onaylandı", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    shipped: { label: "Kargolandı", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
    delivered: { label: "Teslim Edildi", className: "bg-green-100 text-green-700 hover:bg-green-100" },
    cancelled: { label: "İptal", className: "bg-red-100 text-red-700 hover:bg-red-100" },
};

export default function OrdersPage() {
    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Siparişler</h2>
                    <p className="text-muted-foreground">Gelen siparişleri yönetin ve takip edin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>
                    {/* <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                        <Plus className="w-4 h-4" />
                        Sipariş Oluştur
                    </Button> */}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-700">Sipariş No</TableHead>
                            <TableHead className="font-semibold text-slate-700">Müşteri</TableHead>
                            <TableHead className="font-semibold text-slate-700">Tarih</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-center">Ürün Sayısı</TableHead>
                            <TableHead className="font-bold text-slate-900 text-right">Tutar</TableHead>
                            <TableHead className="font-semibold text-slate-700">Durum</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ORDERS.map((order) => (
                            <TableRow key={order.id} className="border-slate-100 hover:bg-slate-50/50">
                                <TableCell className="font-medium text-slate-900">
                                    {order.id}
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    {order.customer}
                                </TableCell>
                                <TableCell className="text-slate-600">{order.date}</TableCell>
                                <TableCell className="text-center text-slate-600">{order.items}</TableCell>
                                <TableCell className="font-bold text-slate-900 text-right">
                                    {order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        className={`rounded-full px-3 py-1 font-medium ${STATUS_MAP[order.status].className}`}
                                    >
                                        {STATUS_MAP[order.status].label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                            <Printer className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
