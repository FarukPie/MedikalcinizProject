import {
    Search,
    Filter,
    MoreVertical,
    Edit2,
    Trash2,
    Package,
    Layers,
    LayoutGrid,
    Box,
    Warehouse
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { WarehouseDialog } from "@/components/admin/warehouse-dialog";
import { getWarehousesWithStats, deleteWarehouse } from "@/lib/actions/warehouse";
import { WarehouseDeleteButton } from "@/components/admin/warehouse-delete-button";
import { toast } from "sonner";

interface WarehouseProduct {
    id: string;
    code: string;
    name: string;
    stock: number;
    minStock: number;
    unit: string;
    sellPrice: number;
    category?: {
        name: string;
    } | null;
}

interface WarehouseWithStats {
    id: string;
    name: string;
    description: string | null;
    shelfCount: number;
    rowCount: number;
    totalProducts: number;
    totalStock: number;
    products: WarehouseProduct[];
    createdAt: Date;
    updatedAt: Date;
}

export default async function WarehousePage() {
    const warehouses = await getWarehousesWithStats();

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Depolar</h2>
                    <p className="text-muted-foreground">Depo ekleme, düzenleme ve ürün takibi</p>
                </div>
                <WarehouseDialog />
            </div>

            {/* Main Content */}
            {warehouses.length > 0 ? (
                <Tabs defaultValue={warehouses[0]?.id} className="w-full space-y-6">
                    <TabsList className="w-full justify-start h-auto p-1 bg-slate-100/50 rounded-xl overflow-x-auto">
                        {warehouses.map((warehouse: WarehouseWithStats) => (
                            <TabsTrigger
                                key={warehouse.id}
                                value={warehouse.id}
                                className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all"
                            >
                                {warehouse.name} ({warehouse.totalProducts})
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {warehouses.map((warehouse: WarehouseWithStats) => (
                        <TabsContent key={warehouse.id} value={warehouse.id} className="space-y-6 mt-0">
                            {/* Info Card */}
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-bold text-slate-900">{warehouse.name}</h3>
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                                                    Aktif
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm">{warehouse.description || "Açıklama yok"}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <LayoutGrid className="w-4 h-4 text-slate-400" />
                                                    <span>{warehouse.shelfCount || 0} Raf</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Layers className="w-4 h-4 text-slate-400" />
                                                    <span>{warehouse.rowCount || 0} Sıra</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Package className="w-4 h-4 text-slate-400" />
                                                    <span>{warehouse.totalProducts} Ürün</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <WarehouseDialog warehouseToEdit={warehouse} />

                                            <WarehouseDeleteButton id={warehouse.id} hasProducts={warehouse.totalProducts > 0} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="border-slate-200 shadow-sm bg-white">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium">Toplam Ürün Sayısı</p>
                                            <p className="text-2xl font-bold text-slate-900">{warehouse.totalProducts}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-slate-200 shadow-sm bg-white">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                            <Box className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 font-medium">Toplam Stok Miktarı</p>
                                            <p className="text-2xl font-bold text-slate-900">{warehouse.totalStock}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Product List or Empty State */}
                            {warehouse.products && warehouse.products.length > 0 ? (
                                <Card className="border-slate-200 shadow-sm">
                                    <CardContent className="p-0">
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full caption-bottom text-sm text-left">
                                                <thead className="[&_tr]:border-b">
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Ürün Kodu</th>
                                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Ürün Adı</th>
                                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Kategori</th>
                                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Miktar</th>
                                                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Fiyat</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="[&_tr:last-child]:border-0">
                                                    {warehouse.products.map((product) => (
                                                        <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                            <td className="p-4 align-middle font-medium">{product.code}</td>
                                                            <td className="p-4 align-middle">{product.name}</td>
                                                            <td className="p-4 align-middle">
                                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                                    {product.category?.name || '-'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-middle">
                                                                <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : 'text-slate-900'}`}>
                                                                    {product.stock} {product.unit}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-middle">{Number(product.sellPrice).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-slate-50/50">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <Package className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Bu depoda ürün bulunmamaktadır</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">
                                        Bu depoya henüz ürün eklenmemiş. Ürün eklemek için ürün yönetimi sayfasını kullanabilirsiniz.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            ) : (
                <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Warehouse className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Henüz hiç depo yok</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-center mb-4">
                        Sisteme ürün ekleyebilmek için önce bir depo oluşturmalısınız.
                    </p>
                    <WarehouseDialog />
                </div>
            )}
        </div>
    );
}


