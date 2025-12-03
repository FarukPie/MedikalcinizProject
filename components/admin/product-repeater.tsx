"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface ProductRow {
    id: string | number;
    productCode: string;
    productName: string;
    quantity: number;
    unit: string;
    description: string;
}

interface ProductRepeaterProps {
    value: ProductRow[];
    onChange: (rows: ProductRow[]) => void;
}

export function ProductRepeater({ value, onChange }: ProductRepeaterProps) {
    const handleAddRow = () => {
        const newRow: ProductRow = {
            id: Math.random().toString(36).substr(2, 9),
            productCode: "",
            productName: "",
            quantity: 1,
            unit: "Adet",
            description: ""
        };
        onChange([...value, newRow]);
    };

    const handleRemoveRow = (id: string | number) => {
        onChange(value.filter(row => row.id !== id));
    };

    const handleRowChange = (id: string | number, field: keyof ProductRow, newValue: ProductRow[keyof ProductRow]) => {
        onChange(value.map(row => {
            if (row.id === id) {
                return { ...row, [field]: newValue };
            }
            return row;
        }));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Label className="text-base font-bold text-slate-900">Ürünler <span className="text-red-500">*</span></Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddRow}
                    className="h-8 gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                    <Plus className="w-3 h-3" />
                    Ürün Ekle
                </Button>
            </div>

            {/* Rows Container */}
            <div className="flex flex-col gap-4">
                {value.map((row, index) => (
                    <div key={row.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            {/* Col 1: Product Code */}
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs text-slate-500">Ürün Kodu</Label>
                                <Input
                                    placeholder="Kod"
                                    value={row.productCode}
                                    onChange={(e) => handleRowChange(row.id, "productCode", e.target.value)}
                                    className="h-9 border-slate-200"
                                />
                            </div>

                            {/* Col 2: Product Name */}
                            <div className="md:col-span-3 space-y-1.5">
                                <Label className="text-xs text-slate-500">Ürün Adı <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Ürün adı giriniz"
                                    value={row.productName}
                                    onChange={(e) => handleRowChange(row.id, "productName", e.target.value)}
                                    className="h-9 border-slate-200"
                                />
                            </div>

                            {/* Col 3: Quantity */}
                            <div className="md:col-span-1 space-y-1.5">
                                <Label className="text-xs text-slate-500">Miktar</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={row.quantity}
                                    onChange={(e) => handleRowChange(row.id, "quantity", Number(e.target.value))}
                                    className="h-9 border-slate-200"
                                />
                            </div>

                            {/* Col 4: Unit */}
                            <div className="md:col-span-2 space-y-1.5">
                                <Label className="text-xs text-slate-500">Birim</Label>
                                <Select
                                    value={row.unit}
                                    onValueChange={(val) => handleRowChange(row.id, "unit", val)}
                                >
                                    <SelectTrigger className="h-9 border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Adet">Adet</SelectItem>
                                        <SelectItem value="Kutu">Kutu</SelectItem>
                                        <SelectItem value="Paket">Paket</SelectItem>
                                        <SelectItem value="Kg">Kg</SelectItem>
                                        <SelectItem value="Lt">Lt</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Col 5: Description */}
                            <div className="md:col-span-3 space-y-1.5">
                                <Label className="text-xs text-slate-500">Açıklama</Label>
                                <Input
                                    placeholder="Açıklama (Opsiyonel)"
                                    value={row.description}
                                    onChange={(e) => handleRowChange(row.id, "description", e.target.value)}
                                    className="h-9 border-slate-200"
                                />
                            </div>

                            {/* Col 6: Delete Action */}
                            <div className="md:col-span-1 flex justify-end pb-0.5">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveRow(row.id)}
                                    className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    disabled={value.length === 1} // Prevent deleting the last row if desired, or remove this prop
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
