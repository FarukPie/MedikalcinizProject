import {
    Filter,
    Shield,
    Users,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { RoleDialog } from "@/components/admin/role-dialog";
import { RoleActionsCell } from "@/components/admin/role-actions-cell";

import prisma from "@/lib/prisma";

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

async function getRoles() {
    const roles = await prisma.role.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { users: true } } }
    });
    return roles;
}

export default async function RolesPage() {
    const roles = await getRoles();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Roller</h2>
                    <h3 className="text-slate-500 mt-1">Sistem rollerini ve yetkilerini yönetin</h3>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>

                    <RoleDialog />
                </div>
            </div>

            {/* Roles Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-semibold text-slate-700">Rol Adı</TableHead>
                            <TableHead className="font-semibold text-slate-700">Açıklama</TableHead>
                            <TableHead className="font-semibold text-slate-700">Kullanıcı Sayısı</TableHead>
                            <TableHead className="font-semibold text-slate-700">Yetkiler</TableHead>
                            <TableHead className="font-semibold text-slate-700">Oluşturulma</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((role: any) => (
                            <TableRow key={role.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600 border-blue-100">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-slate-900">{role.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">{role.description}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        {role._count.users}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-mono text-xs">
                                        {Object.keys(role.permissions as object).length} Modül
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {formatDate(role.createdAt)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <RoleActionsCell role={role} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
