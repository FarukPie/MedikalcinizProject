"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Shield,
    Package,
    Warehouse,
    FileText,
    Truck,
    Receipt,
    Briefcase,
    ShoppingCart,
    CreditCard,
    Menu,
    Bell,
    Search,
    LogOut,
    Mail,
    Activity
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin", roles: ["ADMIN", "CUSTOMER", "SALES"] },
    { icon: Users, label: "Kullanıcılar", href: "/admin/users", roles: ["ADMIN"] },
    { icon: Shield, label: "Roller", href: "/admin/roles", roles: ["ADMIN"] },
    { icon: Package, label: "Ürünler", href: "/admin/products", roles: ["ADMIN", "SALES"] },
    { icon: Activity, label: "Ürün Hareketleri", href: "/admin/urun-hareketleri", roles: ["ADMIN", "SALES"] },
    { icon: Warehouse, label: "Depo", href: "/admin/depo", roles: ["ADMIN", "SALES"] },
    { icon: FileText, label: "Teklif", href: "/admin/teklif", roles: ["ADMIN", "SALES", "CUSTOMER"] },
    { icon: Truck, label: "İrsaliye", href: "/admin/irsaliye", roles: ["ADMIN", "SALES"] },
    { icon: Receipt, label: "Fatura", href: "/admin/fatura", roles: ["ADMIN", "SALES"] },
    { icon: Briefcase, label: "Cariler", href: "/admin/cariler", roles: ["ADMIN", "SALES"] },
    { icon: ShoppingCart, label: "Siparişlerim", href: "/admin/siparisler", roles: ["ADMIN", "SALES", "CUSTOMER"] },
    { icon: CreditCard, label: "Ekstre", href: "/admin/ekstre", roles: ["ADMIN", "CUSTOMER"] },
    { icon: Mail, label: "Mesajlar", href: "/admin/mesajlar", roles: ["ADMIN", "SALES"] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role as string || "CUSTOMER"; // Default to restricted if unknown

    // Filter items based on role
    const filteredItems = sidebarItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    });

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 fixed inset-y-0 left-0 z-50">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <span className="font-bold text-lg">M</span>
                        </div>
                        <span className="text-xl font-bold text-white">Medikalciniz</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
                    {filteredItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 h-11 rounded-xl transition-all duration-200 ${isActive
                                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20"
                                        : "hover:bg-slate-800 hover:text-white"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                    <span className="font-medium">{item.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                <div className="px-3 py-2">
                    <Button
                        variant="ghost"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full justify-start gap-3 h-11 rounded-xl hover:bg-red-950/30 hover:text-red-400 text-slate-400 transition-all duration-200"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Anasayfaya Dön</span>
                    </Button>
                </div>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-slate-700">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{session?.user?.name || "Kullanıcı"}</p>
                            <p className="text-xs text-slate-500 truncate">{session?.user?.email || ""}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button suppressHydrationWarning variant="ghost" size="icon" className="lg:hidden">
                                    <Menu className="w-6 h-6 text-slate-600" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0 bg-slate-900 text-slate-300 border-r-slate-800">
                                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                            <span className="font-bold text-lg">M</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">Medikalciniz</span>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                                    {filteredItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link key={item.href} href={item.href}>
                                                <Button
                                                    variant="ghost"
                                                    className={`w-full justify-start gap-3 h-11 rounded-xl transition-all duration-200 ${isActive
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "hover:bg-slate-800 hover:text-white"
                                                        }`}
                                                >
                                                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                                    <span className="font-medium">{item.label}</span>
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="hidden md:flex items-center relative max-w-md w-full">
                            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Admin panelinde ara..."
                                className="pl-10 bg-slate-50 border-slate-200 w-[300px] focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button suppressHydrationWarning variant="ghost" className="gap-2 pl-2 pr-4 hover:bg-slate-50 rounded-full border border-transparent hover:border-slate-200">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:block text-sm font-medium text-slate-700">{session?.user?.name || "Kullanıcı"}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                    onClick={() => signOut({ callbackUrl: "/login" })}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Çıkış Yap
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
