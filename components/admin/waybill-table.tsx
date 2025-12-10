"use client";

import {
    Eye,
    Printer,
    Edit2,
    Trash2,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { WaybillDialog } from "@/components/admin/waybill-dialog";
import { deleteWaybill } from "@/lib/actions/waybill";
import { toast } from "sonner";

interface WaybillTableProps {
    data: any[];
    partners: any[];
    products: any[];
}

import { WaybillDetailDialog } from "@/components/admin/waybill-detail-dialog"; // Import new dialog
import { useState } from "react";

export function WaybillTable({ data, partners, products }: WaybillTableProps) {
    const [selectedWaybillId, setSelectedWaybillId] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [autoPrint, setAutoPrint] = useState(false);

    const handleView = (id: string) => {
        setSelectedWaybillId(id);
        setAutoPrint(false);
        setIsDetailOpen(true);
    };

    const handlePrint = (id: string) => {
        setSelectedWaybillId(id);
        setAutoPrint(true);
        setIsDetailOpen(true);
    };
    const handleDelete = async (id: string) => {
        if (confirm("Bu irsaliyeyi silmek istediğinize emin misiniz?")) {
            const result = await deleteWaybill(id);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700">İrsaliye No</TableHead>
                        <TableHead className="font-semibold text-slate-700">Fatura No</TableHead>
                        <TableHead className="font-semibold text-slate-700">Tip</TableHead>
                        <TableHead className="font-semibold text-slate-700">Tarih</TableHead>
                        <TableHead className="font-semibold text-slate-700">Cari</TableHead>
                        <TableHead className="font-semibold text-slate-700">Durum</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                Henüz irsaliye bulunmuyor.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((waybill: any) => (
                            <TableRow key={waybill.id} className="border-slate-100 hover:bg-slate-50/50">
                                <TableCell className="font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        {waybill.number}
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    -
                                </TableCell>
                                <TableCell>
                                    <span className={`font-medium ${waybill.type === "Satış İrsaliyesi" ? "text-emerald-600" : "text-blue-600"
                                        }`}>
                                        {waybill.type}
                                    </span>
                                </TableCell>
                                <TableCell className="text-slate-600">{waybill.date}</TableCell>
                                <TableCell className="font-medium text-slate-900">{waybill.partner.name}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`
                                            ${waybill.status === "SENT" ? "bg-slate-100 text-slate-600 hover:bg-slate-100" : ""}
                                        `}
                                    >
                                        {waybill.status === 'SENT' ? 'Gönderildi' : waybill.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                            onClick={() => handleView(waybill.id)}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                            onClick={() => handlePrint(waybill.id)}
                                        >
                                            <Printer className="w-4 h-4" />
                                        </Button>

                                        {/* Edit Button with Dialog */}
                                        <WaybillDialog
                                            partners={partners}
                                            products={products}
                                            waybillId={waybill.id}
                                            trigger={
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            }
                                        />

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleDelete(waybill.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>


            <WaybillDetailDialog
                waybillId={selectedWaybillId}
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                autoPrint={autoPrint}
            />
        </div >
    );
}
