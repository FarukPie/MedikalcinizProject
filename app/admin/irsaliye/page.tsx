import {
    Filter,
    Truck,
    Clock,
    CheckCircle,
    FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { WaybillDialog } from "@/components/admin/waybill-dialog";
import { WaybillTable } from "@/components/admin/waybill-table";
import { getWaybills, getWaybillFormData } from "@/lib/actions/waybill";

export default async function WaybillPage() {
    const waybills = await getWaybills();
    const { partners, products } = await getWaybillFormData();

    const salesWaybills = waybills.filter((w: any) => w.type === "Satış İrsaliyesi");
    const purchaseWaybills = waybills.filter((w: any) => w.type === "Alış İrsaliyesi");

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">İrsaliye Yönetimi</h2>
                    <p className="text-muted-foreground">Onaylanan faturalardan irsaliye oluşturun ve yönetin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white">
                        <Filter className="w-4 h-4" />
                        Filtreler
                    </Button>
                    <WaybillDialog partners={partners} products={products} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Toplam İrsaliye</p>
                            <p className="text-2xl font-bold text-slate-900">{waybills.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Bekleyen</p>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Kargoda</p>
                            <p className="text-2xl font-bold text-slate-900">0</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-white">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Teslim Edildi</p>
                            <p className="text-2xl font-bold text-slate-900">0</p>
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
                        Satış İrsaliyeleri
                    </TabsTrigger>
                    <TabsTrigger value="purchase" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm transition-all">
                        Alış İrsaliyeleri
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    <WaybillTable data={waybills} partners={partners} products={products} />
                </TabsContent>

                <TabsContent value="sales" className="mt-0">
                    <WaybillTable data={salesWaybills} partners={partners} products={products} />
                </TabsContent>
                <TabsContent value="purchase" className="mt-0">
                    <WaybillTable data={purchaseWaybills} partners={partners} products={products} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
