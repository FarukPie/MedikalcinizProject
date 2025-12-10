"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Printer } from "lucide-react";
import { InvoiceDetailDialog } from "@/components/admin/invoice-detail-dialog";

interface InvoiceTableProps {
    data: any[];
}

export function InvoiceTable({ data }: InvoiceTableProps) {
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [autoPrint, setAutoPrint] = useState(false);

    const handleView = (id: string) => {
        setSelectedInvoiceId(id);
        setAutoPrint(false);
        setDetailOpen(true);
    };

    const handlePrint = (id: string) => {
        setSelectedInvoiceId(id);
        setAutoPrint(true);
        setDetailOpen(true);
    };

    return (
        <>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                            <TableHead className="font-semibold text-slate-700">Fatura No</TableHead>
                            <TableHead className="font-semibold text-slate-700">Tip</TableHead>
                            <TableHead className="font-semibold text-slate-700">Cari</TableHead>
                            <TableHead className="font-semibold text-slate-700">Tarih</TableHead>
                            <TableHead className="font-semibold text-slate-700">Vade</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">Tutar</TableHead>
                            <TableHead className="font-semibold text-slate-700">Durum</TableHead>
                            <TableHead className="font-semibold text-slate-700 text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                    Henüz fatura bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((invoice: any) => (
                                <TableRow key={invoice.id} className="border-slate-100 hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-slate-900">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            {invoice.number}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`font-medium ${invoice.type === "Satış Faturası" ? "text-emerald-600" : "text-red-600"
                                            }`}>
                                            {invoice.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">{invoice.partner.name}</TableCell>
                                    <TableCell className="text-slate-600">{invoice.date}</TableCell>
                                    <TableCell className="text-slate-600">{invoice.dueDate}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-900">
                                        {invoice.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                                            {invoice.status === 'PENDING' ? 'Bekliyor' : invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                                                onClick={() => handleView(invoice.id)}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                                onClick={() => handlePrint(invoice.id)}
                                            >
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

            <InvoiceDetailDialog
                invoiceId={selectedInvoiceId}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                autoPrint={autoPrint}
            />
        </>
    );
}
