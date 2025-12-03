

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

import { getOrdersWithStats } from "@/lib/actions/order";
import { DocStatus } from "@prisma/client";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

const STATUS_MAP: Record<string, { label: string, className: string }> = {
    [DocStatus.PENDING]: { label: "Bekliyor", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
    [DocStatus.APPROVED]: { label: "Onaylandı", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
    [DocStatus.SENT]: { label: "Gönderildi", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
    [DocStatus.COMPLETED]: { label: "Tamamlandı", className: "bg-green-100 text-green-700 hover:bg-green-100" },
    [DocStatus.CANCELLED]: { label: "İptal", className: "bg-red-100 text-red-700 hover:bg-red-100" },
    [DocStatus.DRAFT]: { label: "Taslak", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
    [DocStatus.PAID]: { label: "Ödendi", className: "bg-teal-100 text-teal-700 hover:bg-teal-100" },
};

export default async function OrdersPage() {
    const { orders, stats } = await getOrdersWithStats();

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
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Toplam Sipariş</div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">{stats.totalOrders}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Toplam Tutar</div>
                    <div className="text-2xl font-bold text-slate-900 mt-2">
                        {stats.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Bekleyen</div>
                    <div className="text-2xl font-bold text-yellow-600 mt-2">{stats.pendingCount}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm font-medium text-slate-500">Tamamlanan</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-2">{stats.completedCount}</div>
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
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                    Henüz sipariş bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order: any) => (
                                <TableRow key={order.id} className="border-slate-100 hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-900">
                                        {order.number}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {order.partnerName}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {format(new Date(order.createdAt), "d MMM yyyy", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="text-center text-slate-600">{order.itemCount}</TableCell>
                                    <TableCell className="font-bold text-slate-900 text-right">
                                        {order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`rounded-full px-3 py-1 font-medium ${STATUS_MAP[order.status]?.className || "bg-gray-100 text-gray-700"}`}
                                        >
                                            {STATUS_MAP[order.status]?.label || order.status}
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
