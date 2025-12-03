"use client";

import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Activity,
    ArrowUp,
    ArrowDown,
    Filter,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Mock Data
const TRANSACTIONS = [
    {
        id: 1,
        date: "03 Kas 2024",
        account: "Sağlık Malzemeleri Ltd.",
        description: "Ödeme Alındı - Havale",
        orderNo: "-",
        type: "credit", // Alacak
        amount: 9800.00,
        balance: 2000.00
    },
    {
        id: 2,
        date: "02 Kas 2024",
        account: "Tıbbi Cihazlar",
        description: "Tahsilat Makbuzu #1234",
        orderNo: "-",
        type: "credit", // Alacak
        amount: 45000.00,
        balance: 11800.00
    },
    {
        id: 3,
        date: "02 Kas 2024",
        account: "Medikalciniz A.Ş.",
        description: "Fatura #FTR-2024-089",
        orderNo: "SIP-2024-002",
        type: "debt", // Borç
        amount: 12300.00,
        balance: 56800.00
    },
    {
        id: 4,
        date: "01 Kas 2024",
        account: "Özel Klinik",
        description: "Fatura #FTR-2024-088",
        orderNo: "SIP-2024-001",
        type: "debt",
        amount: 4500.00,
        balance: 44500.00
    },
    {
        id: 5,
        date: "30 Eki 2024",
        account: "Şehir Hastanesi",
        description: "Ödeme Alındı - EFT",
        orderNo: "-",
        type: "credit",
        amount: 15000.00,
        balance: 40000.00
    },
    {
        id: 6,
        date: "28 Eki 2024",
        account: "Medikal Depo A.Ş.",
        description: "Fatura #FTR-2024-085",
        orderNo: "SIP-2024-003",
        type: "debt",
        amount: 8450.50,
        balance: 55000.00
    },
    {
        id: 7,
        date: "25 Eki 2024",
        account: "Sağlık Malzemeleri Ltd.",
        description: "Fatura #FTR-2024-082",
        orderNo: "SIP-2024-005",
        type: "debt",
        amount: 3200.00,
        balance: 46549.50
    },
    {
        id: 8,
        date: "24 Eki 2024",
        account: "Tıbbi Cihazlar",
        description: "Ödeme Alındı - Kredi Kartı",
        orderNo: "-",
        type: "credit",
        amount: 2500.00,
        balance: 43349.50
    },
    {
        id: 9,
        date: "20 Eki 2024",
        account: "Medikalciniz A.Ş.",
        description: "Açılış Bakiyesi",
        orderNo: "-",
        type: "debt",
        amount: 45849.50,
        balance: 45849.50
    }
];

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(amount);
}

export default function StatementsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ekstre</h2>
                    <p className="text-muted-foreground">Borç/Alacak takibi ve bakiye detayları</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtrele
                    </Button>
                    <Button variant="outline" className="gap-2 bg-white">
                        <Download className="w-4 h-4" />
                        Dışa Aktar
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Toplam Borç</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">₺100.300,00</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Toplam Alacak</p>
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">₺98.300,00</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Güncel Bakiye</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-red-600 mt-1">₺2.000,00</h3>
                                <span className="text-xs font-medium text-slate-400">Borç</span>
                            </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-slate-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">İşlem Sayısı</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">9</h3>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-slate-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Transaction History Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">İşlem Geçmişi</h3>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-semibold text-slate-700">Tarih</TableHead>
                            <TableHead className="font-semibold text-slate-700">Cari</TableHead>
                            <TableHead className="font-semibold text-slate-700">Açıklama</TableHead>
                            <TableHead className="font-semibold text-slate-700">Sipariş No</TableHead>
                            <TableHead className="font-semibold text-slate-700">Tür</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">Tutar</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">Bakiye</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {TRANSACTIONS.map((transaction) => (
                            <TableRow key={transaction.id} className="hover:bg-slate-50/50 border-slate-100">
                                <TableCell className="font-medium text-slate-900">{transaction.date}</TableCell>
                                <TableCell className="text-slate-600">{transaction.account}</TableCell>
                                <TableCell className="text-slate-600">{transaction.description}</TableCell>
                                <TableCell className="text-slate-600 font-mono text-xs">{transaction.orderNo}</TableCell>
                                <TableCell>
                                    {transaction.type === "credit" ? (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 pl-1 pr-2">
                                            <ArrowDown className="w-3 h-3" />
                                            Alacak
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 gap-1 pl-1 pr-2">
                                            <ArrowUp className="w-3 h-3" />
                                            Borç
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className={`text-right font-bold ${transaction.type === "credit" ? "text-emerald-600" : "text-red-600"
                                    }`}>
                                    {transaction.type === "credit" ? "-" : "+"}{formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell className="text-right font-bold text-red-600">
                                    {formatCurrency(transaction.balance)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
