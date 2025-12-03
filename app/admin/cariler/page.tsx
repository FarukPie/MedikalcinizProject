"use client";

import {
    Search,
    Filter,
    Eye,
    Printer,
    Edit2,
    Trash2,
    Briefcase
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
import { CariDialog } from "@/components/admin/cari-dialog";

// Mock Data
const ACCOUNTS = [
    {
        id: "1",
        type: "Müşteri",
        name: "Bayram YAĞCI",
        vkn: "1234567890",
        contact: "Bayram Yağcı",
        email: "bayram@example.com",
        debit: 43000.00,
        credit: 0
    },
    {
        id: "2",
        type: "Tedarikçi",
        name: "Hastane Donatımları A.Ş.",
        vkn: "9876543210",
        contact: "Ahmet Yılmaz",
        email: "info@hastanedonatimlari.com",
        debit: 0,
        credit: 25000.00
    },
    {
        id: "3",
        type: "Müşteri & Tedarikçi",
        name: "Tıbbi Cihazlar San.",
        vkn: "5555555555",
        contact: "Mehmet Demir",
        email: "satis@tibbicihazlar.com",
        debit: 12500.50,
        credit: 5000.00
    },
];

export default function AccountsPage() {
    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Cari Hesaplar</h2>
                    <p className="text-muted-foreground">Müşteri ve tedarikçi bilgilerini yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>
                    <CariDialog />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-700">Cari Tipi</TableHead>
                            <TableHead className="font-semibold text-slate-700">Cari Adı</TableHead>
                            <TableHead className="font-semibold text-slate-700">VKN</TableHead>
                            <TableHead className="font-semibold text-slate-700">Sorumlu</TableHead>
                            <TableHead className="font-semibold text-slate-700">Email</TableHead>
                            <TableHead className="font-bold text-slate-900 text-right">Borç</TableHead>
                            <TableHead className="font-bold text-slate-900 text-right">Alacak</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ACCOUNTS.map((account) => (
                            <TableRow key={account.id} className="border-slate-100 hover:bg-slate-50/50">
                                <TableCell>
                                    <Badge
                                        className={`rounded-full px-3 py-1 font-medium
                                            ${account.type === "Müşteri" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : ""}
                                            ${account.type === "Tedarikçi" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                            ${account.type === "Müşteri & Tedarikçi" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : ""}
                                        `}
                                    >
                                        {account.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">
                                    {account.name}
                                </TableCell>
                                <TableCell className="text-slate-600">{account.vkn}</TableCell>
                                <TableCell className="text-slate-600">{account.contact}</TableCell>
                                <TableCell className="text-slate-600">{account.email}</TableCell>
                                <TableCell className="text-right font-medium text-red-600">
                                    {account.debit > 0 ? account.debit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : '-'}
                                </TableCell>
                                <TableCell className="text-right font-medium text-emerald-600">
                                    {account.credit > 0 ? account.credit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
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
