import {
    Filter,
    FileText,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { InvoiceDialog } from "@/components/admin/invoice-dialog";
import { InvoiceTable } from "@/components/admin/invoice-table"; // Import the new component
import { getInvoices, getInvoiceFormData } from "@/lib/actions/invoice";

export default async function InvoicePage() {
    const invoices = await getInvoices();
    const { partners, products } = await getInvoiceFormData();

    const salesInvoices = invoices.filter((i: any) => i.type === "Satış Faturası");
    const purchaseInvoices = invoices.filter((i: any) => i.type === "Alış Faturası");

    const totalSales = salesInvoices.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0);
    const totalPurchase = purchaseInvoices.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0);

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Fatura Yönetimi</h2>
                    <p className="text-muted-foreground">Satış ve alış faturalarınızı yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>
                    <InvoiceDialog partners={partners} products={products} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Toplam Fatura</p>
                            <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Toplam Satış</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {totalSales.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Toplam Alış</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {totalPurchase.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs & Table */}
            <Tabs defaultValue="all" className="w-full space-y-4">
                <TabsList className="w-full justify-start h-auto p-1 bg-slate-100/50 rounded-xl">
                    <TabsTrigger value="all" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
                        Tümü
                    </TabsTrigger>
                    <TabsTrigger value="sales" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
                        Satış Faturaları
                    </TabsTrigger>
                    <TabsTrigger value="purchase" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
                        Alış Faturaları
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    <InvoiceTable data={invoices} />
                </TabsContent>

                <TabsContent value="sales" className="mt-0">
                    <InvoiceTable data={salesInvoices} />
                </TabsContent>
                <TabsContent value="purchase" className="mt-0">
                    <InvoiceTable data={purchaseInvoices} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
