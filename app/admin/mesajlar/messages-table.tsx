"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, MailOpen, Eye } from "lucide-react";
import { markMessageAsRead, deleteMessage } from "@/lib/actions/contact";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ContactMessage {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string | null;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

interface MessagesTableProps {
    initialMessages: ContactMessage[];
}

export function MessagesTable({ initialMessages }: MessagesTableProps) {
    const [messages, setMessages] = useState<ContactMessage[]>(initialMessages);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleMarkAsRead = async (id: string) => {
        const result = await markMessageAsRead(id);
        if (result.success) {
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, isRead: true } : msg
            ));
            toast.success("Mesaj okundu olarak işaretlendi.");
        } else {
            toast.error("Bir hata oluştu.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

        const result = await deleteMessage(id);
        if (result.success) {
            setMessages(messages.filter(msg => msg.id !== id));
            toast.success("Mesaj silindi.");
        } else {
            toast.error("Bir hata oluştu.");
        }
    };

    const handleViewMessage = (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsDialogOpen(true);
        if (!message.isRead) {
            handleMarkAsRead(message.id);
        }
    };

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Durum</TableHead>
                            <TableHead>Ad Soyad</TableHead>
                            <TableHead>E-posta</TableHead>
                            <TableHead>Konu</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Henüz mesaj bulunmuyor.
                                </TableCell>
                            </TableRow>
                        ) : (
                            messages.map((message) => (
                                <TableRow key={message.id} className={!message.isRead ? "bg-blue-50/50" : ""}>
                                    <TableCell>
                                        <div className="flex items-center justify-center">
                                            <div className={`w-3 h-3 rounded-full ${!message.isRead ? "bg-blue-600" : "bg-slate-300"}`} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {message.firstName} {message.lastName}
                                    </TableCell>
                                    <TableCell>{message.email}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {message.subject || "-"}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(message.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Menü</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleViewMessage(message)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Görüntüle
                                                </DropdownMenuItem>
                                                {!message.isRead && (
                                                    <DropdownMenuItem onClick={() => handleMarkAsRead(message.id)}>
                                                        <MailOpen className="mr-2 h-4 w-4" />
                                                        Okundu İşaretle
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(message.id)}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Mesaj Detayı</DialogTitle>
                        <DialogDescription>
                            Gönderen: {selectedMessage?.firstName} {selectedMessage?.lastName} ({selectedMessage?.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-slate-500">Konu</h4>
                            <p className="text-slate-900">{selectedMessage?.subject || "-"}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-slate-500">Mesaj</h4>
                            <div className="bg-slate-50 p-4 rounded-lg text-slate-700 whitespace-pre-wrap">
                                {selectedMessage?.message}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-slate-500">Tarih</h4>
                            <p className="text-slate-900">
                                {selectedMessage && format(new Date(selectedMessage.createdAt), "d MMMM yyyy HH:mm", { locale: tr })}
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
