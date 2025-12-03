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
import { getFinanceData } from "@/lib/actions/finance";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { TransactionType } from "@prisma/client";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(amount);
}

export default async function StatementsPage() {
    const { stats, transactions } = await getFinanceData();

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
                            <h3 className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(stats.totalDebt)}</h3>
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
                            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(stats.totalCredit)}</h3>
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
                                <h3 className={`text-2xl font-bold mt-1 ${stats.currentBalance >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {formatCurrency(Math.abs(stats.currentBalance))}
                                </h3>
                                <span className="text-xs font-medium text-slate-400">
                                    {stats.currentBalance >= 0 ? 'Borç' : 'Alacak'}
                                </span>
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
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.transactionCount}</h3>
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
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                    Henüz işlem bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((transaction: any) => (
                                <TableRow key={transaction.id} className="hover:bg-slate-50/50 border-slate-100">
                                    <TableCell className="font-medium text-slate-900">
                                        {format(new Date(transaction.date), "d MMM yyyy", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{transaction.partnerName}</TableCell>
                                    <TableCell className="text-slate-600">
                                        {transaction.description}
                                        {transaction.invoiceNumber && ` #${transaction.invoiceNumber}`}
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-mono text-xs">
                                        {transaction.orderNumber || '-'}
                                    </TableCell>
                                    <TableCell>
                                        {transaction.type === TransactionType.CREDIT ? (
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
                                    <TableCell className={`text-right font-bold ${transaction.type === TransactionType.CREDIT ? "text-emerald-600" : "text-red-600"
                                        }`}>
                                        {transaction.type === TransactionType.CREDIT ? "-" : "+"}{formatCurrency(transaction.amount)}
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${transaction.balance >= 0 ? "text-red-600" : "text-emerald-600"}`}>
                                        {formatCurrency(Math.abs(transaction.balance))}
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
