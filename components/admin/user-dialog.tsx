"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, EyeOff, Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createUser, updateUser } from "@/lib/actions/user";
import { User } from "@prisma/client";

interface UserDialogProps {
    userToEdit?: User;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function UserDialog({ userToEdit, open, onOpenChange }: UserDialogProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Sync internal state with external prop if provided
    useEffect(() => {
        if (open !== undefined) {
            setIsDialogOpen(open);
        }
    }, [open]);

    const handleOpenChange = (val: boolean) => {
        setIsDialogOpen(val);
        if (onOpenChange) {
            onOpenChange(val);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            let result;
            if (userToEdit) {
                formData.append("id", userToEdit.id);
                result = await updateUser(formData);
            } else {
                result = await createUser(formData);
            }

            if (result.success) {
                toast.success(result.message);
                handleOpenChange(false);
                if (!userToEdit) {
                    (e.target as HTMLFormElement).reset();
                }
            } else {
                toast.error(result.message);
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
                {userToEdit ? (
                    <Button suppressHydrationWarning variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button suppressHydrationWarning className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                        <Plus className="w-4 h-4" />
                        Kullanıcı Ekle
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-6 rounded-2xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold text-slate-900">
                        {userToEdit ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-2">
                        {/* Row 1 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Ad <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={userToEdit?.name}
                                    placeholder="Adınızı giriniz"
                                    className="rounded-lg border-slate-200"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="surname" className="text-sm font-medium text-slate-700">Soyad <span className="text-red-500">*</span></Label>
                                <Input
                                    id="surname"
                                    name="surname"
                                    defaultValue={userToEdit?.surname}
                                    placeholder="Soyadınızı giriniz"
                                    className="rounded-lg border-slate-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">E-posta <span className="text-red-500">*</span></Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={userToEdit?.email}
                                placeholder="ornek@medikalciniz.com"
                                className="rounded-lg border-slate-200"
                                required
                            />
                        </div>

                        {/* Row 3 */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Telefon</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={userToEdit?.phone || ""}
                                placeholder="+90 212 555 0000"
                                className="rounded-lg border-slate-200"
                            />
                        </div>

                        {/* Row 4 */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Şifre {userToEdit ? "" : <span className="text-red-500">*</span>}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder={userToEdit ? "Değiştirmek için yazın" : "********"}
                                    className="rounded-lg border-slate-200 pr-10"
                                    required={!userToEdit}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Row 5 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-medium text-slate-700">Rol <span className="text-red-500">*</span></Label>
                                <Select name="role" defaultValue={userToEdit?.role?.toLowerCase()} required>
                                    <SelectTrigger className="rounded-lg border-slate-200">
                                        <SelectValue placeholder="Rol seçiniz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Yönetici</SelectItem>
                                        <SelectItem value="sales">Satışçı</SelectItem>
                                        <SelectItem value="customer">Müşteri</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company" className="text-sm font-medium text-slate-700">Şirket</Label>
                                <Select name="company" defaultValue={userToEdit?.company || ""}>
                                    <SelectTrigger className="rounded-lg border-slate-200">
                                        <SelectValue placeholder="Şirket seçilmedi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="medikalciniz">Medikalciniz</SelectItem>
                                        <SelectItem value="other">Diğer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 6 */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium text-slate-700">Açıklama</Label>
                            <Textarea
                                id="description"
                                name="description"
                                // defaultValue={userToEdit?.description || ""} // Description not in User model yet
                                placeholder="Kullanıcı hakkında açıklama..."
                                className="rounded-lg border-slate-200 min-h-[100px] resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" className="rounded-lg border-slate-200 hover:bg-slate-50">İptal</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20" disabled={isLoading}>
                            {isLoading ? "Kaydediliyor..." : "Kaydet"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
