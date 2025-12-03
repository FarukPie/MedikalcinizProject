"use client";

import { useState, useEffect, useActionState } from "react";
import { Box, ArrowRightLeft } from "lucide-react";
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
import { updateProductStock } from "@/lib/actions/product";
import { useFormStatus } from "react-dom";

import { Product } from "@prisma/client";

interface StockDialogProps {
    products: Product[];
}

const initialState: { success: boolean; message?: string; error?: string } = {
    success: false,
    message: "",
    error: ""
};

export function StockDialog({ products }: StockDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [state, formAction] = useActionState(updateProductStock, initialState);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [transactionType, setTransactionType] = useState<string>("in");

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            setIsDialogOpen(false);
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button suppressHydrationWarning variant="outline" className="gap-2 bg-white">
                    <Box className="w-4 h-4" />
                    Stok Ekle/Çıkar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden sm:rounded-2xl">
                <DialogHeader className="px-8 py-4 border-b bg-white">
                    <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                        Stok Hareketi
                    </DialogTitle>
                </DialogHeader>

                <form action={formAction}>
                    <div className="p-8 grid gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="product" className="text-sm font-medium text-slate-700">Ürün Seçin</Label>
                            <Select name="productId" required onValueChange={setSelectedProduct}>
                                <SelectTrigger className="rounded-xl border-slate-200 h-11 shadow-sm focus:border-blue-500 transition-colors">
                                    <SelectValue placeholder="Ürün arayın veya seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.code} - {product.name} (Stok: {product.stock})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-700">İşlem Tipi</Label>
                                <Select name="type" value={transactionType} onValueChange={setTransactionType}>
                                    <SelectTrigger className="rounded-xl border-slate-200 h-11 shadow-sm focus:border-blue-500 transition-colors">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="in">Stok Girişi (+)</SelectItem>
                                        <SelectItem value="out">Stok Çıkışı (-)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">Miktar</Label>
                                <Input
                                    id="quantity"
                                    name="quantity"
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="0"
                                    className="rounded-xl border-slate-200 h-11 shadow-sm focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="note" className="text-sm font-medium text-slate-700">Açıklama / Not</Label>
                            <Input id="note" name="description" placeholder="İşlem nedeni..." className="rounded-xl border-slate-200 h-11 shadow-sm focus:border-blue-500 transition-colors" />
                        </div>
                    </div>

                    <DialogFooter className="px-8 py-4 border-t bg-gray-50 flex flex-row justify-end gap-2 sm:rounded-b-2xl">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" className="rounded-lg border-slate-200 hover:bg-slate-50">İptal</Button>
                        </DialogClose>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button suppressHydrationWarning type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20" disabled={pending}>
            {pending ? "Kaydediliyor..." : "Kaydet"}
        </Button>
    );
}
