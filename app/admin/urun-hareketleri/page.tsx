import {
    Activity,
    Filter,
    Calendar,
    ArrowRight
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
import { getProductHistory } from "@/lib/actions/history";

export default async function ProductMovementsPage() {
    const history = await getProductHistory(100);

    const getBadgeVariant = (action: string) => {
        switch (action) {
            case 'CREATE':
                return "bg-green-50 text-green-700 hover:bg-green-100 border-green-200";
            case 'UPDATE':
                return "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200";
            case 'PRICE_CHANGE':
                return "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";
            case 'STOCK_ENTRY':
                return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
            case 'STOCK_EXIT':
                return "bg-red-50 text-red-700 hover:bg-red-100 border-red-200";
            case 'STOCK_CORRECTION':
                return "bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200";
            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const getActionLabel = (action: string) => {
        switch (action) {
            case 'CREATE': return "Ürün Oluşturma";
            case 'UPDATE': return "Güncelleme";
            case 'PRICE_CHANGE': return "Fiyat Değişikliği";
            case 'STOCK_ENTRY': return "Stok Girişi";
            case 'STOCK_EXIT': return "Stok Çıkışı";
            case 'STOCK_CORRECTION': return "Sayım Düzeltme";
            default: return action;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Ürün Hareketleri</h2>
                    <h3 className="text-slate-500 mt-1">Stok giriş-çıkışları ve fiyat değişiklikleri</h3>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-semibold text-slate-700">Tarih</TableHead>
                            <TableHead className="font-semibold text-slate-700">İşlem</TableHead>
                            <TableHead className="font-semibold text-slate-700">Ürün</TableHead>
                            <TableHead className="font-semibold text-slate-700">Açıklama</TableHead>
                            <TableHead className="font-semibold text-slate-700">Değişiklik</TableHead>
                            <TableHead className="font-semibold text-slate-700">Kullanıcı</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.length > 0 ? (
                            history.map((item: any) => (
                                <TableRow key={item.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {new Date(item.createdAt).toLocaleDateString('tr-TR')} {new Date(item.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`font-medium border-0 px-2.5 py-0.5 rounded-md ${getBadgeVariant(item.action)}`}>
                                            {getActionLabel(item.action)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">
                                        {item.product.name}
                                        <span className="block text-xs text-slate-500 font-normal">{item.product.code}</span>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{item.description || '-'}</TableCell>
                                    <TableCell>
                                        {(item.oldValue || item.newValue) ? (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-slate-500 line-through">{item.oldValue}</span>
                                                {item.oldValue && item.newValue && <ArrowRight className="w-3 h-3 text-slate-400" />}
                                                <span className="font-medium text-slate-900">{item.newValue}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {item.user?.[0]?.toUpperCase() || 'S'}
                                            </div>
                                            {item.user}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    Henüz işlem kaydı bulunmuyor.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
