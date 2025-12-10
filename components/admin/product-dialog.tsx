"use client";

import { useState, useEffect } from "react";
import { Plus, Upload, X, History } from "lucide-react";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createProduct, updateProduct, getAllCategories, getWarehouses } from "@/lib/actions/product";
import { getStockMovements } from "@/lib/actions/stock-movement";
import { Product, Category, Warehouse, StockMovementType } from "@prisma/client";

interface ProductDialogProps {
    productToEdit?: Product;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ProductDialog({ productToEdit, open, onOpenChange }: ProductDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

    // Stock History State
    const [movements, setMovements] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("details");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        barcode: "",
        unit: "Adet",
        categoryId: "",
        buyPrice: "",
        sellPrice: "",
        taxRate: "20",
        warehouseId: "",
        stock: "",
        minStock: "",
        status: "active",
        description: "",
        image: ""
    });

    // Fetch dependencies
    useEffect(() => {
        const fetchData = async () => {
            const [cats, whs] = await Promise.all([
                getAllCategories(),
                getWarehouses()
            ]);
            setCategories(cats);
            setWarehouses(whs);
        };
        fetchData();
    }, []);

    // Sync internal state with external prop if provided
    useEffect(() => {
        if (open !== undefined) {
            setIsDialogOpen(open);
        }
    }, [open]);

    // Initialize state when dialog opens or productToEdit changes
    useEffect(() => {
        if (productToEdit) {
            setFormData({
                name: productToEdit.name,
                code: productToEdit.code,
                barcode: productToEdit.barcode || "",
                unit: productToEdit.unit,
                categoryId: productToEdit.categoryId || "",
                buyPrice: productToEdit.buyPrice.toString(),
                sellPrice: productToEdit.sellPrice.toString(),
                taxRate: productToEdit.taxRate.toString(),
                warehouseId: productToEdit.warehouseId || "",
                stock: productToEdit.stock.toString(),
                minStock: productToEdit.minStock.toString(),
                status: productToEdit.isActive ? "active" : "passive",
                description: productToEdit.description || "",
                image: productToEdit.image || ""
            });

            // Initial fetch or fetch on activeTab change if needed, 
            // but let's just fetch when dialog logic runs or strictly when tab is history
            if (activeTab === 'history') {
                getStockMovements(productToEdit.id).then(setMovements);
            }
        } else {
            setFormData({
                name: "",
                code: "",
                barcode: "",
                unit: "Adet",
                categoryId: "",
                buyPrice: "",
                sellPrice: "",
                taxRate: "20",
                warehouseId: "",
                stock: "",
                minStock: "",
                status: "active",
                description: "",
                image: ""
            });
            setMovements([]);
        }
    }, [productToEdit, isDialogOpen, activeTab]);

    const handleOpenChange = (val: boolean) => {
        setIsDialogOpen(val);
        if (onOpenChange) {
            onOpenChange(val);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submitData = {
                ...formData,
                isActive: formData.status === 'active'
            };

            let result;
            if (productToEdit) {
                result = await updateProduct(productToEdit.id, submitData);
            } else {
                result = await createProduct(submitData);
            }

            if (result.success) {
                toast.success(result.message);
                handleOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {productToEdit ? null : (
                    <Button suppressHydrationWarning className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                        <Plus className="w-4 h-4" />
                        Ürün Ekle
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-4xl p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 py-4 border-b bg-white z-10">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        {productToEdit ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
                    {productToEdit && (
                        <div className="px-6 pt-2 bg-slate-50 border-b border-slate-200">
                            <TabsList className="bg-transparent p-0 gap-4">
                                <TabsTrigger
                                    value="details"
                                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 rounded-t-lg px-4 py-2"
                                >
                                    Ürün Bilgileri
                                </TabsTrigger>
                                <TabsTrigger
                                    value="history"
                                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm border border-transparent data-[state=active]:border-slate-200 rounded-t-lg px-4 py-2 gap-2"
                                >
                                    <History className="w-4 h-4" />
                                    Stok Geçmişi
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    )}

                    <TabsContent value="details" className="flex flex-col flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto px-6 py-6">
                                <div className="grid gap-6">
                                    {/* Row 1: Basic Info */}
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2 space-y-2">
                                            <Label htmlFor="name" className="text-sm font-medium text-slate-700">Ürün Adı <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="name"
                                                required
                                                value={formData.name}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                placeholder="Örn: Latex Muayene Eldiveni"
                                                className="rounded-lg border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="code" className="text-sm font-medium text-slate-700">Ürün Kodu <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="code"
                                                required
                                                value={formData.code}
                                                onChange={(e) => handleChange("code", e.target.value)}
                                                placeholder="Örn: GLV-LAT-M"
                                                className="rounded-lg border-slate-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Identifiers & Unit */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="barcode" className="text-sm font-medium text-slate-700">Barkod</Label>
                                            <Input
                                                id="barcode"
                                                value={formData.barcode}
                                                onChange={(e) => handleChange("barcode", e.target.value)}
                                                placeholder="869..."
                                                className="rounded-lg border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="unit" className="text-sm font-medium text-slate-700">Birim <span className="text-red-500">*</span></Label>
                                            <Select required value={formData.unit} onValueChange={(val) => handleChange("unit", val)}>
                                                <SelectTrigger className="rounded-lg border-slate-200">
                                                    <SelectValue placeholder="Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Adet">Adet</SelectItem>
                                                    <SelectItem value="Kutu">Kutu</SelectItem>
                                                    <SelectItem value="Paket">Paket</SelectItem>
                                                    <SelectItem value="Koli">Koli</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Row 3: Categories */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="category" className="text-sm font-medium text-slate-700">Kategori</Label>
                                            <Select value={formData.categoryId} onValueChange={(val) => handleChange("categoryId", val)}>
                                                <SelectTrigger className="rounded-lg border-slate-200">
                                                    <SelectValue placeholder="Kategori Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Row 4: Pricing */}
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-900 mb-2">Fiyatlandırma</h3>
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="buyPrice" className="text-sm font-medium text-slate-700">Alış Fiyatı</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₺</span>
                                                    <Input
                                                        id="buyPrice"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.buyPrice}
                                                        onChange={(e) => handleChange("buyPrice", e.target.value)}
                                                        placeholder="0.00"
                                                        className="pl-7 rounded-lg border-slate-200"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sellPrice" className="text-sm font-medium text-slate-700">Satış Fiyatı</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₺</span>
                                                    <Input
                                                        id="sellPrice"
                                                        type="number"
                                                        step="0.01"
                                                        value={formData.sellPrice}
                                                        onChange={(e) => handleChange("sellPrice", e.target.value)}
                                                        placeholder="0.00"
                                                        className="pl-7 rounded-lg border-slate-200"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="vat" className="text-sm font-medium text-slate-700">KDV Oranı (%)</Label>
                                                <Input
                                                    id="vat"
                                                    type="number"
                                                    value={formData.taxRate}
                                                    onChange={(e) => handleChange("taxRate", e.target.value)}
                                                    className="rounded-lg border-slate-200"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 5: Location */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="warehouse" className="text-sm font-medium text-slate-700">Depo</Label>
                                            <Select value={formData.warehouseId} onValueChange={(val) => handleChange("warehouseId", val)}>
                                                <SelectTrigger className="rounded-lg border-slate-200">
                                                    <SelectValue placeholder="Depo Seçiniz" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {warehouses.map((wh) => (
                                                        <SelectItem key={wh.id} value={wh.id}>{wh.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Row 6: Stock */}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="stock" className="text-sm font-medium text-slate-700">Stok Miktarı</Label>
                                            <Input
                                                id="stock"
                                                type="number"
                                                value={formData.stock}
                                                onChange={(e) => handleChange("stock", e.target.value)}
                                                placeholder="0"
                                                className="rounded-lg border-slate-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="minStock" className="text-sm font-medium text-slate-700">Minimum Stok</Label>
                                            <Input
                                                id="minStock"
                                                type="number"
                                                value={formData.minStock}
                                                onChange={(e) => handleChange("minStock", e.target.value)}
                                                placeholder="10"
                                                className="rounded-lg border-slate-200"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 7: Status */}
                                    <div className="space-y-2">
                                        <Label htmlFor="status" className="text-sm font-medium text-slate-700">Durum</Label>
                                        <Select value={formData.status} onValueChange={(val) => handleChange("status", val)}>
                                            <SelectTrigger className="rounded-lg border-slate-200">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Aktif</SelectItem>
                                                <SelectItem value="passive">Pasif</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Row 8: Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-sm font-medium text-slate-700">Açıklama</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                            placeholder="Ürün hakkında detaylı açıklama..."
                                            className="rounded-lg border-slate-200 min-h-[100px] resize-none"
                                        />
                                    </div>

                                    {/* Row 9: Image */}
                                    <div className="space-y-2">
                                        <Label htmlFor="image" className="text-sm font-medium text-slate-700">Ürün Görseli URL</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="image"
                                                value={formData.image}
                                                onChange={(e) => handleChange("image", e.target.value)}
                                                placeholder="https://..."
                                                className="rounded-lg border-slate-200"
                                            />
                                            <Button type="button" variant="outline" size="icon" className="shrink-0">
                                                <Upload className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="px-6 py-4 border-t bg-gray-50 sm:justify-between z-10 shrink-0">
                                <div className="text-xs text-slate-500 flex items-center">
                                    <span className="text-red-500 mr-1">*</span> Zorunlu alanlar
                                </div>
                                <div className="flex gap-2">
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button" className="rounded-lg border-slate-200 hover:bg-slate-50">İptal</Button>
                                    </DialogClose>
                                    <Button suppressHydrationWarning type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20" disabled={isLoading}>
                                        {isLoading ? "Kaydediliyor..." : "Kaydet"}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="history" className="flex flex-col flex-1 overflow-hidden mt-0 data-[state=inactive]:hidden">
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tarih</TableHead>
                                        <TableHead>İşlem Tipi</TableHead>
                                        <TableHead>Miktar</TableHead>
                                        <TableHead>Eski Stok</TableHead>
                                        <TableHead>Yeni Stok</TableHead>
                                        <TableHead>Açıklama</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {movements.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                                Stok hareketi bulunamadı.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        movements.map((move) => (
                                            <TableRow key={move.id}>
                                                <TableCell className="text-xs text-slate-500">{move.createdAt}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs">
                                                        {move.type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={move.quantity > 0 ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                                                        {move.quantity > 0 ? "+" : ""}{move.quantity}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-slate-600">{move.oldStock}</TableCell>
                                                <TableCell className="text-slate-900 font-bold">{move.newStock}</TableCell>
                                                <TableCell className="text-xs text-slate-500">{move.description || "-"}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-end z-10 shrink-0">
                            <DialogClose asChild>
                                <Button variant="outline" type="button" className="rounded-lg border-slate-200 hover:bg-slate-50">Kapat</Button>
                            </DialogClose>
                        </DialogFooter>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
