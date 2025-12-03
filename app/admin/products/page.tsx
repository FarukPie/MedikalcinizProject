import {
    Filter,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { ProductDialog } from "@/components/admin/product-dialog";
import { StockDialog } from "@/components/admin/stock-dialog";
import { CountDialog } from "@/components/admin/count-dialog";
import { ProductActions } from "@/components/admin/product-actions";
import prisma from "@/lib/prisma";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(amount);
}

async function getProducts() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            category: true,
            warehouse: true
        }
    });
    return products;
}

export default async function ProductsPage() {
    const rawProducts = await getProducts();
    const products = JSON.parse(JSON.stringify(rawProducts));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Ürün Yönetimi</h2>
                    <h3 className="text-slate-500 mt-1">Ürün kataloğunu ve stok bilgilerini yönetin</h3>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>

                    <CountDialog products={products} />
                    <StockDialog products={products} />
                    <ProductDialog />
                </div>
            </div>

            {/* Search & Stats Bar (Optional but good for UX) */}
            <div className="grid sm:grid-cols-4 gap-4">
                <div className="sm:col-span-4 bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center">
                    <Search className="w-5 h-5 text-slate-400 ml-3" />
                    <Input
                        placeholder="Ürün adı, kodu veya barkod ile arama yapın..."
                        className="border-0 focus-visible:ring-0 shadow-none bg-transparent"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-semibold text-slate-700">Ürün Kodu</TableHead>
                            <TableHead className="font-semibold text-slate-700">Ürün Adı</TableHead>
                            <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                            <TableHead className="font-semibold text-slate-700">Depo</TableHead>
                            <TableHead className="font-semibold text-slate-700">Miktar</TableHead>
                            <TableHead className="font-semibold text-slate-700">Birim</TableHead>
                            <TableHead className="font-semibold text-slate-700">Satış Fiyatı</TableHead>
                            <TableHead className="font-semibold text-slate-700">KDV</TableHead>
                            <TableHead className="font-semibold text-slate-700">Durum</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product: any) => (
                            <TableRow key={product.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                <TableCell className="font-mono text-slate-600 text-xs">{product.code}</TableCell>
                                <TableCell>
                                    <div className="font-bold text-slate-900">{product.name}</div>
                                </TableCell>
                                <TableCell className="text-slate-600">{product.category?.name || "-"}</TableCell>
                                <TableCell className="text-slate-600">{product.warehouse?.name || "-"}</TableCell>
                                <TableCell>
                                    <span className="font-bold text-slate-900">{product.stock}</span>
                                </TableCell>
                                <TableCell className="text-slate-600">{product.unit}</TableCell>
                                <TableCell className="font-medium text-slate-900">{formatCurrency(Number(product.sellPrice))}</TableCell>
                                <TableCell className="text-slate-600">%{product.taxRate}</TableCell>
                                <TableCell>
                                    {product.isActive ? (
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                                            Aktif
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200">
                                            Pasif
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <ProductActions product={product} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
