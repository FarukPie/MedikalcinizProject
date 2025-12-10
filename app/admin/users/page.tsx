import {
    Filter,
    Building2,
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
import { UserDialog } from "@/components/admin/user-dialog";
import { UserActionsCell } from "@/components/admin/user-actions-cell";
import { getUsers } from "@/lib/actions/user";
import { getRoles } from "@/lib/actions/role";
import { UserRole } from "@prisma/client";

export default async function UsersPage() {
    const users = await getUsers();
    const roles = await getRoles();

    const getBadgeVariant = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return "bg-red-50 text-red-600 hover:bg-red-100 border-red-100";
            case UserRole.SALES:
                return "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100";
            case UserRole.CUSTOMER:
                return "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200";
            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const getRoleLabel = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return "Yönetici";
            case UserRole.SALES:
                return "Satışçı";
            case UserRole.CUSTOMER:
                return "Müşteri";
            default:
                return role;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Kullanıcılar</h2>
                    <h3 className="text-slate-500 mt-1">Kullanıcı Yönetimi</h3>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>

                    <UserDialog roles={roles} />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-semibold text-slate-700">Ad Soyad</TableHead>
                            <TableHead className="font-semibold text-slate-700">E-posta</TableHead>
                            <TableHead className="font-semibold text-slate-700">Telefon</TableHead>
                            <TableHead className="font-semibold text-slate-700">Rol</TableHead>
                            <TableHead className="font-semibold text-slate-700">Şirket</TableHead>
                            <TableHead className="font-semibold text-slate-700">Kayıt Tarihi</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{user.name} {user.surname}</span>
                                            <span className="text-xs text-slate-500">{getRoleLabel(user.role)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{user.email}</TableCell>
                                    <TableCell className="text-slate-600">{user.phone || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`font-medium border-0 px-2.5 py-0.5 rounded-md ${getBadgeVariant(user.role)}`}>
                                            {getRoleLabel(user.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Building2 className="w-4 h-4 text-slate-400" />

                                            {user.company === 'medikalciniz' ? 'Medikalciniz' :
                                                user.company === 'other' ? 'Diğer' :
                                                    user.company || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <UserActionsCell user={{
                                            ...user,
                                            createdAt: user.createdAt.toISOString(),
                                            updatedAt: user.updatedAt.toISOString()
                                        }} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                                    Kullanıcı bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
