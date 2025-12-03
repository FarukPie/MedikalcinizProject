"use client";

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

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const stats = [
    { title: "Toplam Stok Değeri", value: "₺82.140", icon: Package, trend: "+12%", trendUp: true, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Aktif Müşteri Sayısı", value: "3", icon: Users, trend: "+2", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Günlük Satış Tutarı", value: "₺0", icon: DollarSign, trend: "0%", trendUp: true, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Aylık Satış Tutarı", value: "₺0", icon: CreditCard, trend: "0%", trendUp: true, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Günlük Alış Tutarı", value: "₺0", icon: ShoppingBag, trend: "0%", trendUp: true, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Aylık Alış Tutarı", value: "₺0", icon: ShoppingBag, trend: "0%", trendUp: true, color: "text-pink-600", bg: "bg-pink-50" },
    { title: "Toplam Ürün Sayısı", value: "9", icon: Package, trend: "+4", trendUp: true, color: "text-cyan-600", bg: "bg-cyan-50" },
    { title: "Aktif Teklif Sayısı", value: "3", icon: FileText, trend: "-1", trendUp: false, color: "text-slate-600", bg: "bg-slate-100" },
];

const chartData = [
    { name: 'Oca', satis: 4000, alis: 2400 },
    { name: 'Şub', satis: 3000, alis: 1398 },
    { name: 'Mar', satis: 2000, alis: 9800 },
    { name: 'Nis', satis: 2780, alis: 3908 },
    { name: 'May', satis: 1890, alis: 4800 },
    { name: 'Haz', satis: 2390, alis: 3800 },
    { name: 'Tem', satis: 3490, alis: 4300 },
];

const recentOrders = [
    { id: "SIP-2024-003", customer: "Ahmet Yılmaz", amount: "₺1,250.00", status: "Tamamlandı", date: "2 saat önce" },
    { id: "SIP-2024-002", customer: "Medikal Park", amount: "₺15,400.00", status: "İşleniyor", date: "5 saat önce" },
    { id: "SIP-2024-001", customer: "Şehir Hastanesi", amount: "₺42,000.00", status: "Beklemede", date: "1 gün önce" },
    { id: "SIP-2023-099", customer: "Mehmet Demir", amount: "₺850.00", status: "Tamamlandı", date: "2 gün önce" },
    { id: "SIP-2023-098", customer: "Özel Klinik", amount: "₺3,200.00", status: "İptal", date: "3 gün önce" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">İşletmenizin genel durumunu buradan takip edebilirsiniz.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {stat.trend}
                                </div>
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
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSatis" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorAlis" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                                    />
                                    <Area type="monotone" dataKey="satis" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorSatis)" name="Satış" />
                                    <Area type="monotone" dataKey="alis" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAlis)" name="Alış" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
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
                            {recentOrders.map((order, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${order.status === 'Tamamlandı' ? 'bg-emerald-50 text-emerald-600' :
                                            order.status === 'İşleniyor' ? 'bg-blue-50 text-blue-600' :
                                                order.status === 'Beklemede' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-red-50 text-red-600'
                                            }`}>
                                            {order.status === 'Tamamlandı' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{order.customer}</p>
                                            <p className="text-xs text-slate-500 font-mono">{order.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-900">{order.amount}</p>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${order.status === 'Tamamlandı' ? 'bg-emerald-100 text-emerald-700' :
                                            order.status === 'İşleniyor' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'Beklemede' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-6 text-xs h-9">Tüm Siparişleri Gör</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
