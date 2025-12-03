"use client";

import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CariDialog } from "@/components/admin/cari-dialog";
import { deletePartner } from "@/lib/actions/partner";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PartnerActionsProps {
    partner: any;
}

export function PartnerActions({ partner }: PartnerActionsProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deletePartner(partner.id);
            if (result.success) {
                toast.success(result.message);
                setShowDeleteDialog(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Silme işlemi sırasında bir hata oluştu.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                    <Eye className="w-4 h-4" />
                </Button>

                {/* Edit Dialog */}
                <CariDialog partner={partner} />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setShowDeleteDialog(true)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cari Hesabı Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                            "{partner.name}" isimli cari hesabı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>İptal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Siliniyor..." : "Sil"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
