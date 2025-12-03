"use client";

import { useState, useEffect, useActionState } from "react";
import { Plus, Warehouse as WarehouseIcon, Edit2 } from "lucide-react";
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
import { toast } from "sonner";
import { createWarehouse, updateWarehouse } from "@/lib/actions/warehouse";
import { useFormStatus } from "react-dom";
import { Warehouse } from "@prisma/client";

interface WarehouseDialogProps {
    warehouseToEdit?: Warehouse;
}

const initialState: { success: boolean; message?: string; error?: string } = {
    success: false,
    message: "",
    error: ""
};

export function WarehouseDialog({ warehouseToEdit }: WarehouseDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [state, formAction] = useActionState(warehouseToEdit ? updateWarehouse : createWarehouse, initialState);

    // Form states
    const [name, setName] = useState("");
    const [shelfCount, setShelfCount] = useState("");
    const [rowCount, setRowCount] = useState("");
    const [description, setDescription] = useState("");

    // Pre-fill form when editing
    useEffect(() => {
        if (warehouseToEdit && isDialogOpen) {
            setName(warehouseToEdit.name || "");
            setShelfCount(warehouseToEdit.shelfCount?.toString() || "");
            setRowCount(warehouseToEdit.rowCount?.toString() || "");
            setDescription(warehouseToEdit.description || "");
        } else if (!warehouseToEdit && isDialogOpen) {
            // Reset form for create mode
            setName("");
            setShelfCount("");
            setRowCount("");
            setDescription("");
        }
    }, [warehouseToEdit, isDialogOpen]);

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
                {warehouseToEdit ? (
                    <Button variant="outline" className="gap-2 text-slate-600 hover:text-slate-900">
                        <Edit2 className="w-4 h-4" />
                        Düzenle
                    </Button>
                ) : (
                    <Button suppressHydrationWarning className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                        <Plus className="w-4 h-4" />
                        Depo Ekle
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-lg p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <WarehouseIcon className="w-4 h-4" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">
                            {warehouseToEdit ? "Depoyu Düzenle" : "Yeni Depo Ekle"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <form action={formAction} className="flex flex-col flex-1 overflow-hidden">
                    {warehouseToEdit && <input type="hidden" name="id" value={warehouseToEdit.id} />}

                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Depo Adı <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Örn: Ana Depo"
                                    className="rounded-lg border-slate-200"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="shelfCount" className="text-sm font-medium text-slate-700">Raf Sayısı</Label>
                                    <Input
                                        id="shelfCount"
                                        name="shelfCount"
                                        type="number"
                                        placeholder="0"
                                        className="rounded-lg border-slate-200"
                                        value={shelfCount}
                                        onChange={(e) => setShelfCount(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rowCount" className="text-sm font-medium text-slate-700">Sıra Sayısı</Label>
                                    <Input
                                        id="rowCount"
                                        name="rowCount"
                                        type="number"
                                        placeholder="0"
                                        className="rounded-lg border-slate-200"
                                        value={rowCount}
                                        onChange={(e) => setRowCount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-slate-700">Açıklama</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Depo hakkında açıklama..."
                                    className="rounded-lg border-slate-200 min-h-[100px] resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center w-full">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" className="rounded-lg border-slate-200 hover:bg-slate-50">İptal</Button>
                        </DialogClose>
                        <SubmitButton isEditing={!!warehouseToEdit} />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20"
        >
            {pending ? (isEditing ? "Güncelleniyor..." : "Ekleniyor...") : (isEditing ? "Güncelle" : "Ekle")}
        </Button>
    );
}
