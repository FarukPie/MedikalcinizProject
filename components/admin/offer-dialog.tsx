"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createProposal } from "@/lib/actions/proposal";

interface Partner {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    unit: string;
    sellPrice: number;
    taxRate: number;
}

interface OfferDialogProps {
    partners: Partner[];
    products: Product[];
}

interface ProductRow {
    id: string;
    productId: string;
    productName?: string;
    quantity: number;
    unit: string;
    price: number;
    taxRate: number;
    total: number;
}

export function OfferDialog({ partners = [], products = [] }: OfferDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [offerType, setOfferType] = useState("Satış Teklifi");
    const [partnerId, setPartnerId] = useState("");
    const [offerDate, setOfferDate] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        setOfferDate(new Date().toISOString().split('T')[0]);
        setValidUntil(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }, []);

    // Products State
    const [rows, setRows] = useState<ProductRow[]>([
        { id: "1", productId: "", quantity: 1, unit: "Adet", price: 0, taxRate: 20, total: 0 }
    ]);

    // Totals State
    const [subTotal, setSubTotal] = useState(0);
    const [taxTotal, setTaxTotal] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);

    // Calculate totals whenever rows change
    useEffect(() => {
        let newSubTotal = 0;
        let newTaxTotal = 0;

        rows.forEach(row => {
            newSubTotal += row.total;
            newTaxTotal += row.total * (row.taxRate / 100);
        });

        setSubTotal(newSubTotal);
        setTaxTotal(newTaxTotal);
        setGrandTotal(newSubTotal + newTaxTotal);
    }, [rows]);

    const handleAddRow = () => {
        setRows([...rows, {
            id: Math.random().toString(36).substr(2, 9),
            productId: "",
            quantity: 1,
            unit: "Adet",
            price: 0,
            taxRate: 20,
            total: 0
        }]);
    };

    const handleRemoveRow = (id: string) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const handleProductChange = (rowId: string, productId: string) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setRows(rows.map(row => {
                if (row.id === rowId) {
                    const total = row.quantity * product.sellPrice;
                    return {
                        ...row,
                        productId,
                        productName: product.name,
                        unit: product.unit,
                        price: product.sellPrice,
                        taxRate: product.taxRate,
                        total
                    };
                }
                return row;
            }));
        }
    };

    const handleRowChange = (rowId: string, field: keyof ProductRow, value: ProductRow[keyof ProductRow]) => {
        setRows(rows.map(row => {
            if (row.id === rowId) {
                const updatedRow = { ...row, [field]: value };
                // Recalculate total for this row
                if (field === 'quantity' || field === 'price') {
                    updatedRow.total = Number(updatedRow.quantity) * Number(updatedRow.price);
                }
                return updatedRow;
            }
            return row;
        }));
    };

    const handleSubmit = async () => {
        console.log('handleSubmit: Called');
        console.log('handleSubmit: Data', { partnerId, rows });
        if (!partnerId) {
            toast.error("Lütfen bir cari seçiniz.");
            return;
        }

        if (rows.some(row => !row.productId)) {
            toast.error("Lütfen tüm satırlar için ürün seçiniz.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await createProposal({
                partnerId,
                date: offerDate,
                validUntil,
                type: offerType,
                notes,
                items: rows
            });

            if (result.success) {
                toast.success(result.message);
                setIsDialogOpen(false);
                // Reset form
                setRows([{ id: "1", productId: "", quantity: 1, unit: "Adet", price: 0, taxRate: 20, total: 0 }]);
                setNotes("");
                setPartnerId("");
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Beklenmedik bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button suppressHydrationWarning className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4" />
                    Teklif Ekle
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-4xl p-0 overflow-hidden gap-0">
                {/* Fixed Header */}
                <DialogHeader className="px-6 py-4 border-b bg-white z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Yeni Teklif Oluştur</DialogTitle>
                    </div>
                </DialogHeader>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50">
                    <div className="space-y-6">
                        {/* Header Info */}
                        {/* Header Info */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <Label className="mb-2 block text-sm font-medium text-slate-500">Cari Hesap</Label>
                                    <Select value={partnerId} onValueChange={setPartnerId}>
                                        <SelectTrigger className="h-11 w-full bg-white border-slate-200">
                                            <SelectValue placeholder="Cari seçiniz..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {partners.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="mb-2 block text-sm font-medium text-slate-500">Teklif Tipi</Label>
                                    <Select value={offerType} onValueChange={setOfferType}>
                                        <SelectTrigger className="h-11 w-full bg-white border-slate-200">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Satış Teklifi">Satış Teklifi</SelectItem>
                                            <SelectItem value="Satın Alma Teklifi">Satın Alma Teklifi</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="mb-2 block text-sm font-medium text-slate-500">Teklif Tarihi</Label>
                                    <Input
                                        type="date"
                                        value={offerDate}
                                        onChange={(e) => setOfferDate(e.target.value)}
                                        className="h-11 w-full bg-white border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="mb-2 block text-sm font-medium text-slate-500">Geçerlilik Tarihi</Label>
                                    <Input
                                        type="date"
                                        value={validUntil}
                                        onChange={(e) => setValidUntil(e.target.value)}
                                        className="h-11 w-full bg-white border-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <Calculator className="w-4 h-4 text-blue-600" />
                                    Ürünler ve Hizmetler
                                </h3>
                                <Button size="sm" variant="outline" onClick={handleAddRow} className="h-8 gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                                    <Plus className="w-3 h-3" />
                                    Ürün Ekle
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {rows.map((row, index) => (
                                    <div key={row.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-white rounded-xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-colors">
                                        <div className="col-span-4 space-y-1.5">
                                            <Label className="text-xs text-slate-500">Ürün / Hizmet</Label>
                                            <Select
                                                value={row.productId}
                                                onValueChange={(val) => handleProductChange(row.id, val)}
                                            >
                                                <SelectTrigger className="h-9 border-slate-200">
                                                    <SelectValue placeholder="Ürün seçin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-1.5">
                                            <Label className="text-xs text-slate-500">Miktar</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={row.quantity}
                                                onChange={(e) => handleRowChange(row.id, 'quantity', Number(e.target.value))}
                                                className="h-9 border-slate-200"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1.5">
                                            <Label className="text-xs text-slate-500">Birim</Label>
                                            <Select
                                                value={row.unit}
                                                onValueChange={(val) => handleRowChange(row.id, 'unit', val)}
                                            >
                                                <SelectTrigger className="h-9 border-slate-200">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Adet">Adet</SelectItem>
                                                    <SelectItem value="Kutu">Kutu</SelectItem>
                                                    <SelectItem value="Paket">Paket</SelectItem>
                                                    <SelectItem value="Kg">Kg</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2 space-y-1.5">
                                            <Label className="text-xs text-slate-500">Birim Fiyat</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                value={row.price}
                                                onChange={(e) => handleRowChange(row.id, 'price', Number(e.target.value))}
                                                className="h-9 border-slate-200"
                                            />
                                        </div>
                                        <div className="col-span-1 space-y-1.5">
                                            <Label className="text-xs text-slate-500">KDV %</Label>
                                            <Input
                                                type="number"
                                                value={row.taxRate}
                                                onChange={(e) => handleRowChange(row.id, 'taxRate', Number(e.target.value))}
                                                className="h-9 border-slate-200"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-end pb-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveRow(row.id)}
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                disabled={rows.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end">
                            <div className="w-full md:w-1/3 bg-slate-100/50 rounded-xl p-4 space-y-3 border border-slate-200">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Ara Toplam</span>
                                    <span className="font-medium">{subTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>KDV Tutarı</span>
                                    <span className="font-medium">{taxTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                                </div>
                                <div className="h-px bg-slate-200 my-2"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-slate-900">Genel Toplam</span>
                                    <span className="text-xl font-bold text-blue-600">{grandTotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-slate-700">Notlar</Label>
                            <Textarea
                                placeholder="Teklif ile ilgili notlar..."
                                className="min-h-[80px] border-slate-200 resize-none"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center w-full z-10">
                    <DialogClose asChild>
                        <Button variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50">İptal</Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={(e) => {
                            console.log('Button clicked');
                            handleSubmit();
                        }}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20"
                    >
                        {isLoading ? "Oluşturuluyor..." : "Teklif Oluştur"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
