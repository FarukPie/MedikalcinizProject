"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, FileText, Loader2 } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createInvoice } from "@/lib/actions/invoice";

interface InvoiceDialogProps {
    partners: any[];
    products: any[];
}

export function InvoiceDialog({ partners, products }: InvoiceDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        partnerId: "",
        type: "Satış Faturası",
        date: new Date().toISOString().split('T')[0],
        dueDate: "",
        notes: ""
    });

    const [items, setItems] = useState<any[]>([
        { productId: "", code: "", productName: "", quantity: 1, price: 0, taxRate: 18, unit: "Adet", total: 0 }
    ]);

    const [totals, setTotals] = useState({
        subTotal: 0,
        taxTotal: 0,
        grandTotal: 0
    });

    // Calculate totals whenever items change
    useEffect(() => {
        let sub = 0;
        let tax = 0;

        items.forEach(item => {
            const lineTotal = item.quantity * item.price;
            const lineTax = lineTotal * (item.taxRate / 100);
            sub += lineTotal;
            tax += lineTax;
        });

        setTotals({
            subTotal: sub,
            taxTotal: tax,
            grandTotal: sub + tax
        });
    }, [items]);

    const handleAddItem = () => {
        setItems([...items, { productId: "", code: "", productName: "", quantity: 1, price: 0, taxRate: 18, unit: "Adet", total: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        if (items.length > 1) {
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];

        if (field === "productId") {
            const product = products.find(p => p.id === value);
            if (product) {
                newItems[index] = {
                    ...newItems[index],
                    productId: product.id,
                    code: product.code,
                    productName: product.name,
                    price: product.sellPrice,
                    taxRate: product.taxRate,
                    unit: product.unit
                };
            }
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }

        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (!formData.partnerId) {
            toast.error("Lütfen bir cari seçin.");
            return;
        }

        if (items.some(item => !item.productId || item.quantity <= 0)) {
            toast.error("Lütfen tüm ürün satırlarını eksiksiz doldurun.");
            return;
        }

        setLoading(true);
        try {
            const result = await createInvoice({ ...formData, items });

            if (result.success) {
                toast.success(result.message);
                setOpen(false);
                // Reset form
                setFormData({
                    partnerId: "",
                    type: "Satış Faturası",
                    date: new Date().toISOString().split('T')[0],
                    dueDate: "",
                    notes: ""
                });
                setItems([{ productId: "", code: "", productName: "", quantity: 1, price: 0, taxRate: 18, unit: "Adet", total: 0 }]);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Plus className="w-4 h-4" />
                    Fatura Oluştur
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b bg-white shrink-0">
                    <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Yeni Fatura Oluştur
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Header Fields */}
                    {/* Header Fields */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <Label className="mb-2 block text-sm font-medium text-slate-500">Cari Hesap</Label>
                                <Select
                                    value={formData.partnerId}
                                    onValueChange={(val) => setFormData({ ...formData, partnerId: val })}
                                >
                                    <SelectTrigger className="h-11 w-full bg-white border-slate-200">
                                        <SelectValue placeholder="Cari seçin..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {partners.map(p => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block text-sm font-medium text-slate-500">Fatura Tipi</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger className="h-11 w-full bg-white border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Satış Faturası">Satış Faturası</SelectItem>
                                        <SelectItem value="Alış Faturası">Alış Faturası</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block text-sm font-medium text-slate-500">Fatura Tarihi</Label>
                                <Input
                                    type="date"
                                    className="h-11 w-full bg-white border-slate-200"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="mb-2 block text-sm font-medium text-slate-500">Vade Tarihi</Label>
                                <Input
                                    type="date"
                                    className="h-11 w-full bg-white border-slate-200"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <Label className="mb-2 block text-sm font-medium text-slate-500">Notlar</Label>
                        <Input
                            placeholder="Fatura notu..."
                            className="h-11 w-full border-slate-200"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {/* Items Table */}
                    {/* Items List */}
                    <div className="space-y-4">
                        {items.map((item, index) => {
                            const lineTotal = item.quantity * item.price;
                            const lineTax = lineTotal * (item.taxRate / 100);
                            const total = lineTotal + lineTax;

                            return (
                                <div key={index} className="relative border border-slate-200 rounded-2xl p-5 bg-slate-50/50 mb-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 text-red-500 hover:bg-red-100 rounded-full h-8 w-8"
                                        onClick={() => handleRemoveItem(index)}
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div className="space-y-4">
                                        <div className="space-y-2 pr-12">
                                            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ürün / Hizmet</Label>
                                            <Select
                                                value={item.productId}
                                                onValueChange={(val) => handleItemChange(index, "productId", val)}
                                            >
                                                <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                                                    <SelectValue placeholder="Ürün seçin..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.name} ({p.code})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-2 space-y-2">
                                                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Miktar</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    className="h-11 rounded-xl border-slate-200 bg-white"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Birim</Label>
                                                <Input
                                                    className="h-11 rounded-xl border-slate-200 bg-white"
                                                    value={item.unit}
                                                    onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                                    placeholder="Adet"
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Birim Fiyat</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    className="h-11 rounded-xl border-slate-200 bg-white"
                                                    value={item.price}
                                                    onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">KDV %</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    className="h-11 rounded-xl border-slate-200 bg-white"
                                                    value={item.taxRate}
                                                    onChange={(e) => handleItemChange(index, "taxRate", Number(e.target.value))}
                                                />
                                            </div>
                                            <div className="col-span-3 space-y-2">
                                                <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Satır Toplamı</Label>
                                                <Input
                                                    readOnly
                                                    className="h-11 rounded-xl border-slate-200 bg-slate-100 font-bold text-slate-900"
                                                    value={`${total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <Button
                            variant="outline"
                            onClick={handleAddItem}
                            className="w-full py-6 border-dashed border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl gap-2 h-auto transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Yeni Satır Ekle
                        </Button>
                    </div>

                    {/* Totals Summary */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-2 bg-slate-50 p-4 rounded-lg border">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Ara Toplam:</span>
                                <span>{totals.subTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>KDV Toplam:</span>
                                <span>{totals.taxTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg text-slate-900 pt-2 border-t border-slate-200">
                                <span>Genel Toplam:</span>
                                <span>{totals.grandTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
                    <DialogClose asChild>
                        <Button variant="outline">İptal</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Save className="w-4 h-4" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
