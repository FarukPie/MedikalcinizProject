

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

import { getPartners } from "@/lib/actions/partner";
import { PartnerActions } from "@/components/admin/partner-actions";

export default async function AccountsPage() {
    const partners = await getPartners();

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
                        {partners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                    Henüz cari hesap bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            partners.map((account: any) => (
                                <TableRow key={account.id} className="border-slate-100 hover:bg-slate-50/50">
                                    <TableCell>
                                        <Badge
                                            className={`rounded-full px-3 py-1 font-medium
                                                ${account.type === "CUSTOMER" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : ""}
                                                ${account.type === "SUPPLIER" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                                                ${account.type === "BOTH" ? "bg-purple-100 text-purple-700 hover:bg-purple-100" : ""}
                                            `}
                                        >
                                            {account.type === "CUSTOMER" ? "Müşteri" : account.type === "SUPPLIER" ? "Tedarikçi" : "Müşteri & Tedarikçi"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">
                                        {account.name}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{account.taxNumber || '-'}</TableCell>
                                    <TableCell className="text-slate-600">{account.contactName || '-'}</TableCell>
                                    <TableCell className="text-slate-600">{account.email || '-'}</TableCell>
                                    <TableCell className="text-right font-medium text-red-600">
                                        {account.balance > 0 ? account.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-emerald-600">
                                        {account.balance < 0 ? Math.abs(account.balance).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <PartnerActions partner={account} />
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
