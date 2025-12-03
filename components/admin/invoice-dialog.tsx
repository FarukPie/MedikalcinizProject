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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label>Cari Hesap</Label>
                            <Select
                                value={formData.partnerId}
                                onValueChange={(val) => setFormData({ ...formData, partnerId: val })}
                            >
                                <SelectTrigger>
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
                            <Label>Fatura Tipi</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Satış Faturası">Satış Faturası</SelectItem>
                                    <SelectItem value="Alış Faturası">Alış Faturası</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Fatura Tarihi</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Vade Tarihi</Label>
                            <Input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-4">
                            <Label>Notlar</Label>
                            <Input
                                placeholder="Fatura notu..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white border rounded-lg p-4">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-3 mb-2 text-sm font-medium text-gray-500">
                            <div className="col-span-3">Ürün / Hizmet</div>
                            <div className="col-span-2">Kod</div>
                            <div className="col-span-1">Miktar</div>
                            <div className="col-span-1">Birim</div>
                            <div className="col-span-2">Birim Fiyat</div>
                            <div className="col-span-1">KDV %</div>
                            <div className="col-span-1 text-right">Toplam</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Rows */}
                        <div className="space-y-2">
                            {items.map((item, index) => {
                                const lineTotal = item.quantity * item.price;
                                const lineTax = lineTotal * (item.taxRate / 100);
                                const total = lineTotal + lineTax;

                                return (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-center">
                                        <div className="col-span-3">
                                            <Select
                                                value={item.productId}
                                                onValueChange={(val) => handleItemChange(index, "productId", val)}
                                            >
                                                <SelectTrigger className="h-10 w-full min-w-0 border-slate-200">
                                                    <SelectValue placeholder="Ürün seç..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                className="h-10 w-full min-w-0 bg-slate-50 text-xs"
                                                readOnly
                                                value={item.code || '-'}
                                                placeholder="Kod"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                type="number"
                                                min="1"
                                                className="h-10 w-full min-w-0"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                className="h-10 w-full min-w-0"
                                                value={item.unit}
                                                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                                placeholder="Birim"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="h-10 w-full min-w-0"
                                                value={item.price}
                                                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                className="h-10 w-full min-w-0"
                                                value={item.taxRate}
                                                onChange={(e) => handleItemChange(index, "taxRate", Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-1 text-right font-medium text-sm">
                                            {total.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 text-red-500 hover:bg-red-50"
                                                onClick={() => handleRemoveItem(index)}
                                                disabled={items.length === 1}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-3 bg-slate-50 border-t">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAddItem}
                                className="gap-2 text-blue-600 hover:text-blue-700 h-9"
                            >
                                <Plus className="w-4 h-4" />
                                Satır Ekle
                            </Button>
                        </div>
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
