"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { convertProposalToOrder, getProposalById } from "@/lib/actions/proposal";
import { Loader2, CheckCircle, X } from "lucide-react";

interface ProposalDetailDialogProps {
    proposalId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProposalDetailDialog({ proposalId, open, onOpenChange }: ProposalDetailDialogProps) {
    const [proposal, setProposal] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);

    useEffect(() => {
        if (open && proposalId) {
            const fetchProposal = async () => {
                setIsLoading(true);
                const data = await getProposalById(proposalId);
                setProposal(data);
                setIsLoading(false);
            };
            fetchProposal();
        } else {
            setProposal(null);
        }
    }, [open, proposalId]);

    const handleConvert = async () => {
        if (!proposalId) return;

        setIsConverting(true);
        try {
            const result = await convertProposalToOrder(proposalId);
            if (result.success) {
                toast.success(result.message);
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsConverting(false);
        }
    };

    if (!open) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white z-10 flex-shrink-0">
                    <div className="flex items-center justify-between mr-8">
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {isLoading ? "Yükleniyor..." : proposal ? `${proposal.number} Detayı` : "Teklif Detayı"}
                                {!isLoading && proposal && (
                                    <Badge variant="outline" className="ml-2">
                                        {proposal.status === 'DRAFT' ? 'Taslak' :
                                            proposal.status === 'APPROVED' ? 'Onaylandı' :
                                                proposal.status}
                                    </Badge>
                                )}
                            </DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : proposal ? (
                        <div className="space-y-6">
                            {/* Info Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Cari Hesap</p>
                                    <p className="font-semibold text-slate-900">{proposal.partner.name}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Tarih</p>
                                    <p className="font-medium text-slate-900">{proposal.date}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Geçerlilik</p>
                                    <p className="font-medium text-slate-900">{proposal.validUntil}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 mb-1">Tutar</p>
                                    <p className="font-bold text-blue-600">
                                        {proposal.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </p>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>Ürün</TableHead>
                                            <TableHead className="text-right">Miktar</TableHead>
                                            <TableHead className="text-right">Birim Fiyat</TableHead>
                                            <TableHead className="text-right">Toplam</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {proposal.items.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.productName}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">
                                                    {item.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {item.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">Veri bulunamadı.</div>
                    )}
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Kapat</Button>
                    {!isLoading && proposal && proposal.status === 'DRAFT' && (
                        <Button
                            onClick={handleConvert}
                            disabled={isConverting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                        >
                            {isConverting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Onayla ve Siparişe Dönüştür
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
