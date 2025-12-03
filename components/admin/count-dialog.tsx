"use client";

import { useState, useEffect, useActionState } from "react";
import { ClipboardList, CheckCircle2 } from "lucide-react";
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
import { setProductStock } from "@/lib/actions/product";
import { useFormStatus } from "react-dom";

interface Product {
    id: string;
    code: string;
    name: string;
    stock: number;
}

interface CountDialogProps {
    products: Product[];
}

interface ActionState {
    success: boolean;
    message?: string;
    error?: string;
}

const initialState: ActionState = {
    success: false,
    message: "",
    error: ""
};

export function CountDialog({ products }: CountDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [state, formAction] = useActionState(setProductStock, initialState);
    const [selectedProduct, setSelectedProduct] = useState<string>("");

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
                    <ClipboardList className="w-4 h-4" />
                    Sayım Yap
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-white">
                    <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Hızlı Sayım
                    </DialogTitle>
                </DialogHeader>

                <form action={formAction}>
                    <div className="p-6 grid gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="product-count" className="text-sm font-medium text-slate-700">Ürün Seçin</Label>
                            <Select name="productId" required onValueChange={setSelectedProduct}>
                                <SelectTrigger className="rounded-lg border-slate-200">
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

                        <div className="space-y-2">
                            <Label htmlFor="count" className="text-sm font-medium text-slate-700">Sayılan Miktar</Label>
                            <Input
                                id="count"
                                name="quantity"
                                type="number"
                                min="0"
                                required
                                placeholder="Gerçek stok adedi..."
                                className="rounded-lg border-slate-200 text-lg font-semibold"
                            />
                            <p className="text-xs text-slate-500">Mevcut stok miktarı bu değer ile değiştirilecektir.</p>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex flex-row justify-end gap-2">
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
        <Button suppressHydrationWarning type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg shadow-green-600/20" disabled={pending}>
            {pending ? "Kaydediliyor..." : "Güncelle"}
        </Button>
    );
}
