"use client";

import { useState, useEffect } from "react";
import { Plus, Shield } from "lucide-react";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";

// Module Definitions
const MODULES = [
    { id: "dashboard", name: "Dashboard", description: "Genel bakış ve istatistikler" },
    { id: "users", name: "Kullanıcılar", description: "Kullanıcı yönetimi ve yetkilendirme" },
    { id: "roles", name: "Roller", description: "Rol ve izin yönetimi" },
    { id: "products", name: "Ürünler", description: "Ürün kataloğu ve stok takibi" },
    { id: "warehouse", name: "Depo", description: "Depo giriş/çıkış işlemleri" },
    { id: "offers", name: "Teklif", description: "Müşteri teklifleri oluşturma" },
    { id: "waybills", name: "İrsaliye", description: "Sevk irsaliyesi işlemleri" },
    { id: "invoices", name: "Fatura", description: "Fatura kesme ve görüntüleme" },
    { id: "accounts", name: "Cariler", description: "Müşteri ve tedarikçi cari hesapları" },
    { id: "orders", name: "Siparişler", description: "Sipariş yönetimi ve takibi" },
    { id: "statements", name: "Ekstre", description: "Hesap ekstreleri ve raporlar" },
];

const PERMISSIONS = [
    { id: "menu", label: "Menü", code: "M" },
    { id: "view", label: "Görüntüle", code: "G" },
    { id: "add", label: "Ekle", code: "E" },
    { id: "edit", label: "Düzenle", code: "D" },
    { id: "delete", label: "Sil", code: "S" },
];

import { createRole, updateRole } from "@/lib/actions/role";
import { toast } from "sonner";
import { Role } from "@prisma/client";

interface RoleDialogProps {
    roleToEdit?: Role;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function RoleDialog({ roleToEdit, open, onOpenChange }: RoleDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Matrix State: { [moduleId]: { [permissionId]: boolean } }
    const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({});

    // Sync internal state with external prop if provided
    useEffect(() => {
        if (open !== undefined) {
            setIsDialogOpen(open);
        }
    }, [open]);

    // Initialize matrix and form
    useEffect(() => {
        if (isDialogOpen) {
            if (roleToEdit) {
                setRoleName(roleToEdit.name);
                setDescription(roleToEdit.description || "");
                setMatrix((roleToEdit.permissions as Record<string, Record<string, boolean>>) || {});
            } else {
                const initialMatrix: Record<string, Record<string, boolean>> = {};
                MODULES.forEach(module => {
                    initialMatrix[module.id] = {};
                    PERMISSIONS.forEach(perm => {
                        initialMatrix[module.id][perm.id] = false;
                    });
                });
                setMatrix(initialMatrix);
                setRoleName("");
                setDescription("");
            }
        }
    }, [isDialogOpen, roleToEdit]);

    const handleOpenChange = (val: boolean) => {
        setIsDialogOpen(val);
        if (onOpenChange) {
            onOpenChange(val);
        }
    };

    const handlePermissionChange = (moduleId: string, permId: string, checked: boolean) => {
        setMatrix(prev => ({
            ...prev,
            [moduleId]: {
                ...prev[moduleId],
                [permId]: checked
            }
        }));
    };

    const handleRowSelectAll = (moduleId: string, checked: boolean) => {
        setMatrix(prev => {
            const newModulePerms: Record<string, boolean> = {};
            PERMISSIONS.forEach(perm => {
                newModulePerms[perm.id] = checked;
            });
            return {
                ...prev,
                [moduleId]: newModulePerms
            };
        });
    };

    const isRowFullySelected = (moduleId: string) => {
        if (!matrix[moduleId]) return false;
        return PERMISSIONS.every(perm => matrix[moduleId][perm.id]);
    };

    const handleSubmit = async () => {
        if (!roleName.trim()) {
            toast.error("Lütfen rol adını giriniz.");
            return;
        }

        setIsLoading(true);
        try {
            let result;
            if (roleToEdit) {
                result = await updateRole(roleToEdit.id, {
                    name: roleName,
                    description,
                    permissions: matrix
                });
            } else {
                result = await createRole({
                    name: roleName,
                    description,
                    permissions: matrix
                });
            }

            if (result.success) {
                toast.success(result.message || "İşlem başarılı.");
                handleOpenChange(false);
            } else {
                toast.error(result.error || "Bir hata oluştu.");
            }
        } catch (error) {
            toast.error("Beklenmedik bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {roleToEdit ? (
                    <Button suppressHydrationWarning variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button suppressHydrationWarning className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                        <Plus className="w-4 h-4" />
                        Rol Ekle
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-5xl p-0 overflow-hidden gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        {roleToEdit ? "Rolü Düzenle" : "Yeni Rol Oluştur"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    <div className="grid gap-6 mb-6">
                        <div className="space-y-2">
                            <Label htmlFor="roleName" className="text-sm font-medium text-slate-700">Rol Adı <span className="text-red-500">*</span></Label>
                            <Input
                                id="roleName"
                                placeholder="Örn: Satış Yöneticisi"
                                className="rounded-lg border-slate-200"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-slate-700">Açıklama</Label>
                            <Textarea
                                id="description"
                                placeholder="Rol hakkında kısa bir açıklama..."
                                className="rounded-lg border-slate-200 min-h-[80px] resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Yetki Matrisi</h3>
                                <p className="text-xs text-slate-500">Bu rolün erişebileceği modülleri ve işlem yetkilerini belirleyin.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow className="hover:bg-transparent border-slate-100">
                                        <TableHead className="w-[300px] font-semibold text-slate-700">Modül</TableHead>
                                        {PERMISSIONS.map(perm => (
                                            <TableHead key={perm.id} className="text-center font-semibold text-slate-700 w-[80px]">{perm.label}</TableHead>
                                        ))}
                                        <TableHead className="text-center font-semibold text-slate-700 w-[80px]">Hepsi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {MODULES.map((module) => (
                                        <TableRow key={module.id} className="hover:bg-slate-50/50 border-slate-100">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-slate-900">{module.name}</div>
                                                        <div className="text-xs text-slate-500">{module.description}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            {PERMISSIONS.map(perm => (
                                                <TableCell key={perm.id} className="text-center">
                                                    <div className="flex justify-center">
                                                        <Checkbox
                                                            checked={matrix[module.id]?.[perm.id] || false}
                                                            onCheckedChange={(checked) => handlePermissionChange(module.id, perm.id, checked as boolean)}
                                                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                        />
                                                    </div>
                                                </TableCell>
                                            ))}
                                            <TableCell className="text-center bg-slate-50/30">
                                                <div className="flex justify-center">
                                                    <Checkbox
                                                        checked={isRowFullySelected(module.id)}
                                                        onCheckedChange={(checked) => handleRowSelectAll(module.id, checked as boolean)}
                                                        className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-gray-50 sm:justify-between">
                    <div className="flex gap-2 text-xs text-gray-500 items-center">
                        {PERMISSIONS.map(perm => (
                            <Badge key={perm.id} variant="outline" className="bg-white text-slate-500 border-slate-200 font-mono text-[10px]">
                                {perm.code}: {perm.label}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50">İptal</Button>
                        </DialogClose>
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20" disabled={isLoading}>
                            {isLoading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
