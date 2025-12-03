import {
    Filter,
    FileText,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Eye,
    Printer,
    Edit2,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { InvoiceDialog } from "@/components/admin/invoice-dialog";
import { getInvoices, getInvoiceFormData } from "@/lib/actions/invoice";

export default async function InvoicePage() {
    const invoices = await getInvoices();
    const { partners, products } = await getInvoiceFormData();

    const salesInvoices = invoices.filter((i: any) => i.type === "Satış Faturası");
    const purchaseInvoices = invoices.filter((i: any) => i.type === "Alış Faturası");

    const totalSales = salesInvoices.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0);
    const totalPurchase = purchaseInvoices.reduce((acc: number, curr: any) => acc + curr.totalAmount, 0);

    const InvoiceTable = ({ data }: { data: any[] }) => (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-700">Fatura No</TableHead>
                        <TableHead className="font-semibold text-slate-700">Tip</TableHead>
                        <TableHead className="font-semibold text-slate-700">Cari</TableHead>
                        <TableHead className="font-semibold text-slate-700">Tarih</TableHead>
                        <TableHead className="font-semibold text-slate-700">Vade</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">Tutar</TableHead>
                        <TableHead className="font-semibold text-slate-700">Durum</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">İşlemler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                Henüz fatura bulunmuyor.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((invoice: any) => (
                            <TableRow key={invoice.id} className="border-slate-100 hover:bg-slate-50/50">
                                <TableCell className="font-medium text-slate-900">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        {invoice.number}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`font-medium ${invoice.type === "Satış Faturası" ? "text-emerald-600" : "text-red-600"
                                        }`}>
                                        {invoice.type}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">{invoice.partner.name}</TableCell>
                                <TableCell className="text-slate-600">{invoice.date}</TableCell>
                                <TableCell className="text-slate-600">{invoice.dueDate}</TableCell>
                                <TableCell className="text-right font-bold text-slate-900">
                                    {invoice.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                                        {invoice.status === 'PENDING' ? 'Bekliyor' : invoice.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                                            <Printer className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

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
