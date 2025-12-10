import {
    DollarSign,
    Users,
    ShoppingBag,
    CreditCard,
    Package,
    FileText,
    TrendingUp,
    TrendingDown,
    MoreHorizontal,
    CheckCircle2,
    Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardChart } from "@/components/admin/dashboard-chart";
import { getDashboardStats, getCustomerDashboardStats } from "@/lib/actions/dashboard";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { auth } from "@/auth";
import { CustomerDashboardStats } from "@/components/admin/customer-dashboard-stats";
import { UserRole } from "@prisma/client";

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        maximumFractionDigits: 0
    }).format(amount);
}

export default async function AdminDashboard() {
    const session = await auth();
    const userRole = session?.user?.role;
    const userEmail = session?.user?.email;

    if (userRole === UserRole.CUSTOMER) {
        if (!userEmail) {
            return (
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-red-600">Hata</h1>
                    <p className="text-slate-600">Kullanıcı e-posta adresi bulunamadı.</p>
                </div>
            );
        }

        const customerStats = await getCustomerDashboardStats(userEmail);

        if (customerStats) {
            return <CustomerDashboardStats stats={customerStats} userName={session?.user?.name || "Sayın Müşterimiz"} />;
        }
    }

    const { stats, recentOrders, chartData } = await getDashboardStats();

    const statCards = [
        { title: "Toplam Stok Değeri", value: formatCurrency(stats.totalStockValue), icon: Package, trend: "+12%", trendUp: true, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Aktif Müşteri Sayısı", value: stats.activeCustomers.toString(), icon: Users, trend: "+2", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Günlük Satış Tutarı", value: formatCurrency(stats.dailySales), icon: DollarSign, trend: "0%", trendUp: true, color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "Aylık Satış Tutarı", value: formatCurrency(stats.monthlySales), icon: CreditCard, trend: "0%", trendUp: true, color: "text-purple-600", bg: "bg-purple-50" },
        { title: "Günlük Alış Tutarı", value: formatCurrency(stats.dailyPurchase), icon: ShoppingBag, trend: "0%", trendUp: true, color: "text-orange-600", bg: "bg-orange-50" },
        { title: "Aylık Alış Tutarı", value: formatCurrency(stats.monthlyPurchase), icon: ShoppingBag, trend: "0%", trendUp: true, color: "text-pink-600", bg: "bg-pink-50" },
        { title: "Toplam Ürün Sayısı", value: stats.totalProducts.toString(), icon: Package, trend: "+4", trendUp: true, color: "text-cyan-600", bg: "bg-cyan-50" },
        { title: "Aktif Teklif Sayısı", value: stats.activeProposals.toString(), icon: FileText, trend: "-1", trendUp: false, color: "text-slate-600", bg: "bg-slate-100" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">İşletmenizin genel durumunu buradan takip edebilirsiniz.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                {/* <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {stat.trend}
                                </div> */}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts & Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart */}
                <Card className="lg:col-span-2 border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-slate-900">Satış ve Alış Trendi</CardTitle>
                        <Button variant="outline" size="sm" className="h-8 text-xs">Raporu İndir</Button>
                    </CardHeader>
                    <CardContent>
                        <DashboardChart data={chartData} />
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="border-slate-100 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-bold text-slate-900">Son Siparişler</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {recentOrders.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">Henüz sipariş bulunmuyor.</p>
                            ) : (
                                recentOrders.map((order: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' :
                                                order.status === 'APPROVED' ? 'bg-blue-50 text-blue-600' :
                                                    order.status === 'PENDING' ? 'bg-orange-50 text-orange-600' :
                                                        'bg-red-50 text-red-600'
                                                }`}>
                                                {order.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{order.customer}</p>
                                                <p className="text-xs text-slate-500 font-mono">{order.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-900">{formatCurrency(order.amount)}</p>
                                            <span className="text-[10px] text-slate-500">
                                                {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Button variant="outline" className="w-full mt-6 text-xs h-9">Tüm Siparişleri Gör</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
