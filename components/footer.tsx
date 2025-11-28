import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-20 pb-10 font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    {/* Column 1: Brand & Newsletter (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <span className="font-bold text-lg">M</span>
                            </div>
                            <span className="text-2xl font-bold text-slate-900">Medikalciniz</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Sağlık sektöründe güvenilir çözüm ortağınız. Kaliteli medikal ürünleri en uygun fiyatlarla, hızlı ve güvenli bir şekilde sunuyoruz.
                        </p>

                        <div className="pt-4">
                            <h5 className="font-semibold text-slate-900 mb-3 text-sm">Bültenimize Abone Olun</h5>
                            <div className="flex gap-2">
                                <Input placeholder="E-posta adresiniz" className="bg-slate-50 border-slate-200 rounded-xl" />
                                <Button size="icon" className="rounded-xl bg-blue-600 hover:bg-blue-700 shrink-0">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links (Span 2) */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-bold text-slate-900 mb-6 text-base">Hızlı Erişim</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></span>
                                    Ana Sayfa
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></span>
                                    Ürünler
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></span>
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-blue-600 transition-colors"></span>
                                    İletişime Geç
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Service (Span 2) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-slate-900 mb-6 text-base">Müşteri Hizmetleri</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/privacy" className="text-slate-500 hover:text-blue-600 transition-colors">Gizlilik Politikası</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-slate-500 hover:text-blue-600 transition-colors">Kullanım Koşulları</Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-slate-500 hover:text-blue-600 transition-colors">Kargo Bilgileri</Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-slate-500 hover:text-blue-600 transition-colors">İade Koşulları</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact (Span 3) */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-slate-900 mb-6 text-base">İletişim</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-4 text-slate-500 group">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="leading-relaxed">1234. Sokak No:56<br />Alsancak, İzmir</span>
                            </li>
                            <li className="flex items-center gap-4 text-slate-500 group">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span>0850 123 45 67</span>
                            </li>
                            <li className="flex items-center gap-4 text-slate-500 group">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span>info@medikalciniz.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-400">
                    <p>© 2025 Medikalciniz. Tüm hakları saklıdır.</p>

                    <div className="flex gap-4">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-9 w-9">
                            <Facebook className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-9 w-9">
                            <Instagram className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-9 w-9">
                            <Twitter className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                        <Lock className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs font-medium text-slate-500">256-bit SSL Güvenli Ödeme</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
