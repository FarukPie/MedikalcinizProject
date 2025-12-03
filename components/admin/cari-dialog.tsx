"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function CariDialog() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [type, setType] = useState("musteri");
    const [vkn, setVkn] = useState("");
    const [contactName, setContactName] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!name) {
            toast.error("Lütfen cari adını giriniz.");
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success("Cari başarıyla oluşturuldu.");
            setIsDialogOpen(false);

            // Reset form
            setName("");
            setType("musteri");
            setVkn("");
            setContactName("");
            setContactPhone("");
            setContactEmail("");
            setAddress("");
            setDescription("");
        } catch (error) {
            toast.error("Beklenmedik bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button suppressHydrationWarning className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4" />
                    Cari Ekle
                </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-3xl p-0 overflow-hidden gap-0">
                {/* Fixed Header */}
                <DialogHeader className="px-6 py-4 border-b bg-white z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users className="w-4 h-4" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900">Yeni Cari Ekle</DialogTitle>
                    </div>
                </DialogHeader>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-slate-50/50">
                    <div className="space-y-6">
                        {/* Row 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase">Cari Adı <span className="text-red-500">*</span></Label>
                                <Input
                                    placeholder="Örn: Bayram YAĞCI"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-white border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase">Cari Tipi <span className="text-red-500">*</span></Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="bg-white border-slate-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="musteri">Müşteri</SelectItem>
                                        <SelectItem value="tedarikci">Tedarikçi</SelectItem>
                                        <SelectItem value="hepsi">Müşteri & Tedarikçi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase">VKN / TC No</Label>
                                <Input
                                    placeholder="Vergi Kimlik No"
                                    value={vkn}
                                    onChange={(e) => setVkn(e.target.value)}
                                    className="bg-white border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase">Sorumlu Adı Soyadı</Label>
                                <Input
                                    placeholder="İlgili Kişi"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    className="bg-white border-slate-200"
                                />
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase">Sorumlu Tel</Label>
                                <Input
                                    placeholder="05XX XXX XX XX"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    className="bg-white border-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-semibold text-slate-500 uppercase">Sorumlu Email</Label>
                                <Input
                                    type="email"
                                    placeholder="ornek@email.com"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="bg-white border-slate-200"
                                />
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase">Adres</Label>
                            <Textarea
                                placeholder="Açık adres bilgisi..."
                                className="min-h-[80px] bg-white border-slate-200 resize-none"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Row 5 */}
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase">Açıklama</Label>
                            <Textarea
                                placeholder="Cari hakkında notlar..."
                                className="min-h-[80px] bg-white border-slate-200 resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center w-full z-10">
                    <DialogClose asChild>
                        <Button variant="outline" className="rounded-lg border-slate-200 hover:bg-slate-50">İptal</Button>
                    </DialogClose>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-600/20"
                    >
                        {isLoading ? "Kaydediliyor..." : "Kaydet"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
