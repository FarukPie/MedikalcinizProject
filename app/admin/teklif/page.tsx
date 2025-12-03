import {
    Search,
    Filter,
    Eye,
    Printer,
    FileText,
    MoreHorizontal
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
import { OfferDialog } from "@/components/admin/offer-dialog";
import { getProposalFormData, getProposals } from "@/lib/actions/proposal";

export default async function OffersPage() {
    const { partners, products } = await getProposalFormData();
    const proposals = await getProposals();

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Teklif Yönetimi</h2>
                    <p className="text-muted-foreground">Satış ve satın alma tekliflerini yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>
                    <OfferDialog partners={partners} products={products} />
                </div>
            </div>

            {/* Content */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-700">Teklif No</TableHead>
                            <TableHead className="font-semibold text-slate-700">Tipi</TableHead>
                            <TableHead className="font-semibold text-slate-700">Tarih</TableHead>
                            <TableHead className="font-semibold text-slate-700">Cari Adı</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">Toplam Tutar</TableHead>
                            <TableHead className="font-semibold text-slate-700">Durum</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {proposals.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                    Henüz teklif bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            proposals.map((proposal: any) => (
                                <TableRow key={proposal.id} className="border-slate-100 hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-900">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            {proposal.number}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`font-normal ${proposal.type === "Satış Teklifi"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : "bg-orange-50 text-orange-700 border-orange-200"
                                                }`}
                                        >
                                            {proposal.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{proposal.date}</TableCell>
                                    <TableCell className="font-medium text-slate-900">{proposal.partner.name}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-900">
                                        {proposal.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            className={`
                                                ${proposal.status === "COMPLETED" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : ""}
                                                ${proposal.status === "DRAFT" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" : ""}
                                                ${proposal.status === "APPROVED" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : ""}
                                                ${proposal.status === "CANCELLED" ? "bg-red-100 text-red-700 hover:bg-red-100" : ""}
                                            `}
                                        >
                                            {proposal.status === 'DRAFT' ? 'Taslak' :
                                                proposal.status === 'APPROVED' ? 'Onaylandı' :
                                                    proposal.status === 'COMPLETED' ? 'Tamamlandı' :
                                                        proposal.status === 'CANCELLED' ? 'İptal' : proposal.status}
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
