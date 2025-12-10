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
import { getWaybillById } from "@/lib/actions/waybill";
import { useReactToPrint } from "react-to-print";

interface WaybillDetailDialogProps {
    waybillId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    autoPrint?: boolean;
}

export function WaybillDetailDialog({ waybillId, open, onOpenChange, autoPrint = false }: WaybillDetailDialogProps) {
    const [waybill, setWaybill] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: waybill ? `Irsaliye-${waybill.number}` : 'Irsaliye',
    });

    useEffect(() => {
        if (open && waybillId) {
            const fetchWaybill = async () => {
                setIsLoading(true);
                const data = await getWaybillById(waybillId);
                setWaybill(data);
                setIsLoading(false);
            };
            fetchWaybill();
        } else {
            setWaybill(null);
        }
    }, [open, waybillId]);

    // Auto print when data is loaded if requested
    useEffect(() => {
        if (autoPrint && !isLoading && waybill) {
            handlePrint();
        }
    }, [autoPrint, isLoading, waybill, handlePrint]);

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white z-10 flex-shrink-0">
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {isLoading ? "Yükleniyor..." : waybill ? `${waybill.number} Detayı` : "İrsaliye Detayı"}
                            {!isLoading && waybill && (
                                <Badge variant="outline" className="ml-2">
                                    {waybill.status === 'SENT' ? 'Gönderildi' : waybill.status}
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
                    ) : waybill ? (
                        <div className="space-y-8 print-content">
                            {/* Header Info for Print */}
                            <div className="flex justify-between items-start border-b pb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 mb-1">İRSALİYE</h1>
                                    <p className="text-slate-500">{waybill.type}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-lg font-semibold text-slate-900">{waybill.number}</h3>
                                    <p className="text-slate-600">{waybill.date}</p>
                                </div>
                            </div>

                            {/* Parties Info */}
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2 uppercase text-sm tracking-wider">Müşteri</h4>
                                    <div className="text-sm text-slate-600 space-y-1">
                                        <p className="font-medium text-slate-900">{waybill.partner?.name}</p>
                                        <p>{waybill.partner?.address || "Adres bilgisi yok"}</p>
                                        <p>{waybill.partner?.phone && `Tel: ${waybill.partner.phone}`}</p>
                                        <p>{waybill.partner?.taxNumber && `VKN: ${waybill.partner.taxNumber}`}</p>
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
                                            <TableHead className="text-right text-slate-900 font-semibold w-32">Miktar</TableHead>
                                            <TableHead className="text-right text-slate-900 font-semibold w-32">Birim</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {waybill.items.map((item: any, index: number) => (
                                            <TableRow key={item.id} className="border-b border-slate-100">
                                                <TableCell className="text-slate-500">{index + 1}</TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-slate-900">{item.productName}</span>
                                                    {item.description && (
                                                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-slate-900">{item.quantity}</TableCell>
                                                <TableCell className="text-right text-slate-600">{item.unit}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Notes */}
                            {waybill.notes && (
                                <div className="mt-8 pt-4 border-t">
                                    <h4 className="font-semibold text-sm text-slate-900 mb-1">Notlar</h4>
                                    <p className="text-sm text-slate-600">{waybill.notes}</p>
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
                    <Button onClick={handlePrint} disabled={isLoading || !waybill} className="gap-2">
                        <Printer className="w-4 h-4" />
                        Yazdır
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
