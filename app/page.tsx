import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Headphones, PackageCheck, Activity, Syringe, Phone } from "lucide-react";

export default function Home() {
  // Mock Data
  const products = [
    { id: 1, category: "Koruyucu Ekipman", title: "Eldiven Lateks M", code: "GLV-LAT-M", price: 45.50 },
    { id: 2, category: "Sarf Malzeme", title: "Cerrahi Maske 3 Katlı", code: "MSK-SUR-3", price: 12.90 },
    { id: 3, category: "Medikal Cihaz", title: "Dijital Ateş Ölçer", code: "DEV-THR-D", price: 125.00 },
    { id: 4, category: "Koruyucu Ekipman", title: "Yüz Siperliği", code: "PRT-FSH-1", price: 35.00 },
    { id: 5, category: "Sarf Malzeme", title: "Antiseptik Solüsyon 1L", code: "CHM-ANT-1L", price: 85.00 },
    { id: 6, category: "Medikal Cihaz", title: "Tansiyon Aleti", code: "DEV-BPM-1", price: 450.00 },
    { id: 7, category: "Sarf Malzeme", title: "Sargı Bezi 10cm", code: "BND-GZ-10", price: 8.50 },
    { id: 8, category: "Koruyucu Ekipman", title: "Tulum L Beden", code: "PRT-CVR-L", price: 65.00 },
  ];

  const categories = [
    { title: "Koruyucu Ekipman", count: "120+ ürün", icon: ShieldCheck, color: "bg-blue-100 text-blue-600" },
    { title: "Sarf Malzeme", count: "850+ ürün", icon: Syringe, color: "bg-emerald-100 text-emerald-600" },
    { title: "Medikal Cihaz", count: "45+ ürün", icon: Activity, color: "bg-indigo-100 text-indigo-600" },
  ];

  const values = [
    { title: "Hızlı Teslimat", desc: "İzmir içi aynı gün", icon: Truck },
    { title: "Güvenli Alışveriş", desc: "256-bit SSL koruması", icon: ShieldCheck },
    { title: "Geniş Ürün Yelpazesi", desc: "1000+ medikal ürün", icon: PackageCheck },
    { title: "7/24 Destek", desc: "Uzman ekip yanınızda", icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-400 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Medikal İhtiyaçlarınız İçin <br className="hidden md:block" />
              <span className="text-blue-100">Bize Ulaşın</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light">
              Hastaneler, klinikler ve bireysel kullanıcılar için en kaliteli medikal ürünleri en uygun fiyatlarla sunuyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 rounded-full text-white font-bold px-8 py-6 h-auto text-lg">
                  <Phone className="mr-2 h-5 w-5" />
                  İletişime Geç
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-700 border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-full px-8 py-6 h-auto text-lg font-semibold hover:bg-blue-50">
                  Ürünleri İncele
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="container mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Neden Medikalciniz?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Sektördeki 20 yıllık tecrübemizle size en iyi hizmeti sunuyoruz.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Hızlı Teslimat</h3>
              <p className="text-slate-500 text-sm">İzmir içi aynı gün, tüm Türkiye'ye ertesi gün kargo imkanı.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Güvenli Ödeme</h3>
              <p className="text-slate-500 text-sm">256-bit SSL sertifikası ve 3D Secure ile güvenli alışveriş.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <PackageCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Orijinal Ürün</h3>
              <p className="text-slate-500 text-sm">Tüm ürünlerimiz %100 orijinal ve üretici garantilidir.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">7/24 Destek</h3>
              <p className="text-slate-500 text-sm">Uzman ekibimiz sorularınızı yanıtlamak için her zaman hazır.</p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-slate-50 py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Kategoriler</h2>
              <Link href="/categories">
                <Button variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold text-lg">
                  Tümünü Gör <ArrowRight className="ml-1 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/products?category=${encodeURIComponent(cat.title)}`}>
                  <div className="group cursor-pointer h-full">
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all hover:scale-105 flex items-center gap-8 h-full">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${cat.color} transition-transform group-hover:scale-110 shadow-sm`}>
                        <cat.icon className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">{cat.title}</h3>
                        <p className="text-slate-500 font-medium">{cat.count}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Öne Çıkan Ürünler</h2>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full px-6 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">Yeni Gelenler</Button>
              <Button variant="ghost" className="rounded-full px-6 text-slate-500 hover:text-slate-900">Çok Satanlar</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg" className="rounded-full px-10 py-6 h-auto text-lg border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold">
                Tüm Ürünleri İncele
              </Button>
            </Link>
          </div>
        </section>

        {/* B2B Banner */}
        <section className="bg-blue-900 py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kurumsal Çözümler</h2>
                <p className="text-blue-100 text-lg max-w-xl">
                  Hastaneler, klinikler ve toplu alımlar için özel fiyat listelerimizden yararlanmak ister misiniz? Kurumsal üyelik avantajlarını keşfedin.
                </p>
              </div>
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-bold text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 shrink-0">
                Hemen Başvur
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
