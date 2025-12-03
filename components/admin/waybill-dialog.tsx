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
import { createWaybill, updateWaybill, getWaybillById } from "@/lib/actions/waybill";

interface WaybillDialogProps {
    partners: any[];
    products: any[];
    waybillId?: string; // Optional ID for edit mode
    trigger?: React.ReactNode; // Custom trigger button
}

export function WaybillDialog({ partners, products, waybillId, trigger }: WaybillDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false); // For fetching initial data
    const [formData, setFormData] = useState({
        partnerId: "",
        type: "Satış İrsaliyesi",
        date: new Date().toISOString().split('T')[0],
        notes: ""
    });

    const [items, setItems] = useState<any[]>([
        { productId: "", code: "", productName: "", quantity: 1, unit: "Adet", description: "" }
    ]);

    // Fetch data when dialog opens if in edit mode
    useEffect(() => {
        if (open && waybillId) {
            setFetching(true);
            getWaybillById(waybillId)
                .then((data) => {
                    if (data) {
                        setFormData({
                            partnerId: data.partnerId,
                            type: data.type,
                            date: data.date,
                            notes: data.notes || ""
                        });
                        if (data.items && data.items.length > 0) {
                            setItems(data.items.map((item: any) => ({
                                productId: item.productId,
                                code: products.find(p => p.id === item.productId)?.code || "",
                                productName: item.productName,
                                quantity: item.quantity,
                                unit: item.unit,
                                description: item.description || ""
                            })));
                        }
                    } else {
                        toast.error("İrsaliye bilgileri alınamadı.");
                        setOpen(false);
                    }
                })
                .catch(() => {
                    toast.error("Bir hata oluştu.");
                    setOpen(false);
                })
                .finally(() => setFetching(false));
        } else if (open && !waybillId) {
            // Reset form for create mode
            setFormData({
                partnerId: "",
                type: "Satış İrsaliyesi",
                date: new Date().toISOString().split('T')[0],
                notes: ""
            });
            setItems([{ productId: "", code: "", productName: "", quantity: 1, unit: "Adet", description: "" }]);
        }
    }, [open, waybillId, products]);

    const handleAddItem = () => {
        setItems([...items, { productId: "", code: "", productName: "", quantity: 1, unit: "Adet", description: "" }]);
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
            let result;
            if (waybillId) {
                result = await updateWaybill(waybillId, { ...formData, items });
            } else {
                result = await createWaybill({ ...formData, items });
            }

            if (result.success) {
                toast.success(result.message);
                setOpen(false);
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
                {trigger ? trigger : (
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Plus className="w-4 h-4" />
                        İrsaliye Ekle
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b bg-white shrink-0">
                    <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        {waybillId ? "İrsaliye Düzenle" : "Yeni İrsaliye Oluştur"}
                    </DialogTitle>
                </DialogHeader>

                {fetching ? (
                    <div className="flex-1 flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Header Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <Label>İrsaliye Tipi</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Satış İrsaliyesi">Satış İrsaliyesi</SelectItem>
                                        <SelectItem value="Alış İrsaliyesi">Alış İrsaliyesi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tarih</Label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Notlar</Label>
                                <Input
                                    placeholder="İrsaliye notu..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-700 font-medium">
                                    <tr>
                                        <th className="p-3 w-[35%]">Ürün</th>
                                        <th className="p-3 w-[15%]">Miktar</th>
                                        <th className="p-3 w-[15%]">Birim</th>
                                        <th className="p-3 w-[30%]">Açıklama</th>
                                        <th className="p-3 w-[5%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item, index) => (
                                        <tr key={index} className="bg-white">
                                            <td className="p-2">
                                                <Select
                                                    value={item.productId}
                                                    onValueChange={(val) => handleItemChange(index, "productId", val)}
                                                >
                                                    <SelectTrigger className="h-9 border-slate-200">
                                                        <SelectValue placeholder="Ürün seç..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {products.map(p => (
                                                            <SelectItem key={p.id} value={p.id}>
                                                                {p.code} - {p.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    className="h-9"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    className="h-9 bg-slate-50"
                                                    readOnly
                                                    value={item.unit}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    className="h-9"
                                                    placeholder="Açıklama..."
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                    onClick={() => handleRemoveItem(index)}
                                                    disabled={items.length === 1}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-2 bg-slate-50 border-t">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddItem}
                                    className="gap-2 text-blue-600 hover:text-blue-700"
                                >
                                    <Plus className="w-3 h-3" />
                                    Satır Ekle
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
                    <DialogClose asChild>
                        <Button variant="outline">İptal</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={loading || fetching} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                        <Save className="w-4 h-4" />
                        {loading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
