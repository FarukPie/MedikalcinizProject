"use client";

import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
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
import { Loader2, Printer } from "lucide-react";
import { getInvoiceById } from "@/lib/actions/invoice";
import { useReactToPrint } from "react-to-print";

interface InvoiceDetailDialogProps {
    invoiceId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    autoPrint?: boolean;
}

export function InvoiceDetailDialog({ invoiceId, open, onOpenChange, autoPrint = false }: InvoiceDetailDialogProps) {
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: invoice ? `Fatura-${invoice.number}` : 'Fatura',
    });

    useEffect(() => {
        if (open && invoiceId) {
            const fetchInvoice = async () => {
                setIsLoading(true);
                const data = await getInvoiceById(invoiceId);
                setInvoice(data);
                setIsLoading(false);
            };
            fetchInvoice();
        } else {
            setInvoice(null);
        }
    }, [open, invoiceId]);

    // Auto print when data is loaded if requested
    useEffect(() => {
        if (autoPrint && !isLoading && invoice) {
            handlePrint();
        }
    }, [autoPrint, isLoading, invoice, handlePrint]);


    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white z-10 flex-shrink-0">
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {isLoading ? "Yükleniyor..." : invoice ? `${invoice.number} Detayı` : "Fatura Detayı"}
                            {!isLoading && invoice && (
                                <Badge variant="outline" className={`ml-2 ${invoice.type === 'Satış Faturası' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                                    {invoice.type}
                                </Badge>
                            )}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6" ref={printRef}>
                    <style type="text/css" media="print">
                        {`
                           @page { size: auto;  margin: 20mm; }
                           .print-hide { display: none !important; }
                           .print-content { display: block !important; width: 100%; }
                        `}
                    </style>
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : invoice ? (
                        <div className="space-y-8 print-content">
                            {/* Header Info for Print */}
                            <div className="flex justify-between items-start border-b pb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-1">FATURA</h1>
                                    <p className="text-slate-500">{invoice.type}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-lg font-semibold text-slate-900">{invoice.number}</h3>
                                    <p className="text-slate-600">{invoice.date}</p>
                                    <p className="text-sm text-slate-500">Vade: {invoice.dueDate}</p>
                                </div>
                            </div>

                            {/* Parties Info */}
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2 uppercase text-sm tracking-wider">Sayın</h4>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        <p className="font-medium text-slate-900">{invoice.partner?.name}</p>
                                        <p>{invoice.partner?.address || "Adres bilgisi yok"}</p>
                                        <p>{invoice.partner?.phone && `Tel: ${invoice.partner.phone}`}</p>
                                        <p>{invoice.partner?.taxNumber && `VKN: ${invoice.partner.taxNumber}`}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2 uppercase text-sm tracking-wider">Firma</h4>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        <p className="font-medium text-slate-900">Medikalciniz</p>
                                        <p>Örnek Mahallesi, Örnek Cad.</p>
                                        <p>No: 123, İstanbul</p>
                                        <p>Tel: (212) 555 0000</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="mt-8">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-b-2 border-slate-200">
                                            <TableHead className="text-slate-900 font-semibold w-12">#</TableHead>
                                            <TableHead className="text-slate-900 font-semibold">Ürün / Açıklama</TableHead>
                                            <TableHead className="text-right text-slate-900 font-semibold w-24">Miktar</TableHead>
                                            <TableHead className="text-right text-slate-900 font-semibold w-24">Birim</TableHead>
                                            <TableHead className="text-right text-slate-900 font-semibold w-32">B.Fiyat</TableHead>
                                            <TableHead className="text-right text-slate-900 font-semibold w-20">KDV</TableHead>
                                            <TableHead className="text-right text-slate-900 font-semibold w-32">Toplam</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoice.items.map((item: any, index: number) => {
                                            // Calculate line total if not provided (fallback)
                                            const lineTotal = item.quantity * item.price;
                                            const lineTax = lineTotal * (item.taxRate / 100);
                                            const total = lineTotal + lineTax;

                                            return (
                                                <TableRow key={item.id} className="border-b border-slate-100">
                                                    <TableCell className="text-slate-500">{index + 1}</TableCell>
                                                    <TableCell>
                                                        <span className="font-medium text-slate-900">{item.productName}</span>
                                                        {item.description && (
                                                            <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-slate-900">{item.quantity}</TableCell>
                                                    <TableCell className="text-right text-slate-600">{item.unit || 'Adet'}</TableCell>
                                                    <TableCell className="text-right text-slate-900">
                                                        {Number(item.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                    </TableCell>
                                                    <TableCell className="text-right text-slate-600">%{item.taxRate}</TableCell>
                                                    <TableCell className="text-right font-bold text-slate-900">
                                                        {total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end mt-8">
                                <div className="w-64 space-y-2">
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>Ara Toplam:</span>
                                        <span>{Number(invoice.subTotal).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-600">
                                        <span>KDV Toplam:</span>
                                        <span>{Number(invoice.taxTotal).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-200">
                                        <span>Genel Toplam:</span>
                                        <span>{Number(invoice.totalAmount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {invoice.notes && (
                                <div className="mt-8 pt-4 border-t">
                                    <h4 className="font-semibold text-sm text-slate-900 mb-1">Notlar</h4>
                                    <p className="text-sm text-slate-600">{invoice.notes}</p>
                                </div>
                            )}

                            {/* Signature Area */}
                            <div className="grid grid-cols-2 gap-12 mt-16 pt-8 break-inside-avoid">
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-900 mb-8">Teslim Eden</p>
                                    <div className="h-px w-32 bg-slate-300 mx-auto"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-slate-900 mb-8">Teslim Alan</p>
                                    <div className="h-px w-32 bg-slate-300 mx-auto"></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">Veri bulunamadı.</div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex-shrink-0 print-hide">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Kapat</Button>
                    <Button onClick={handlePrint} disabled={isLoading || !invoice} className="gap-2">
                        <Printer className="w-4 h-4" />
                        Yazdır
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
