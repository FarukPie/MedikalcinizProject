import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 pt-16 pb-8 font-sans">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Brand & Social */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-blue-600">Medikalciniz</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Sağlık sektöründe güvenilir çözüm ortağınız. Kaliteli medikal ürünleri en uygun fiyatlarla sunuyoruz.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8">
                                <Facebook className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8">
                                <Instagram className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8">
                                <Twitter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Hızlı Erişim</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">Ana Sayfa</Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-slate-600 hover:text-blue-600 transition-colors">Ürünler</Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors">Hakkımızda</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-slate-600 hover:text-blue-600 transition-colors">İletişime Geç</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Customer Service */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Müşteri Hizmetleri</h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">Gizlilik Politikası</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">Kullanım Koşulları</Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-slate-600 hover:text-blue-600 transition-colors">Kargo Bilgileri</Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-slate-600 hover:text-blue-600 transition-colors">İade Koşulları</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">İletişim</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3 text-slate-600">
                                <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                                <span>1234. Sokak No:56<br />Alsancak, İzmir</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600">
                                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                                <span>0850 123 45 67</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-600">
                                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                                <span>info@medikalciniz.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <p>© 2025 Medikalciniz. Tüm hakları saklıdır.</p>
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Müşteri verileriniz SSL sertifikası ile korunmaktadır.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
