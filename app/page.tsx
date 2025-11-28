import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Headphones, PackageCheck, Activity, Syringe, Phone } from "lucide-react";
import { getFeaturedProducts, getAllCategories } from "@/lib/actions/product";

export default async function Home() {
  const [products, categoriesData] = await Promise.all([
    getFeaturedProducts(),
    getAllCategories(),
  ]);

  // Map DB categories to UI styles
  const styleMap: Record<string, { icon: any, color: string, gradient: string }> = {
    "Koruyucu Ekipman": { icon: ShieldCheck, color: "bg-blue-100 text-blue-600", gradient: "from-blue-500 to-blue-600" },
    "Sarf Malzeme": { icon: Syringe, color: "bg-emerald-100 text-emerald-600", gradient: "from-emerald-500 to-emerald-600" },
    "Medikal Cihazlar": { icon: Activity, color: "bg-indigo-100 text-indigo-600", gradient: "from-indigo-500 to-indigo-600" },
    "Laboratuvar": { icon: PackageCheck, color: "bg-purple-100 text-purple-600", gradient: "from-purple-500 to-purple-600" },
    "İlk Yardım": { icon: Headphones, color: "bg-red-100 text-red-600", gradient: "from-red-500 to-red-600" },
  };

  const categories = categoriesData.map((cat) => {
    const style = styleMap[cat.name] || { icon: PackageCheck, color: "bg-slate-100 text-slate-600", gradient: "from-slate-500 to-slate-600" };
    return {
      title: cat.name,
      count: "Ürünleri İncele",
      icon: style.icon,
      color: style.color,
      gradient: style.gradient,
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-blue-800 text-white overflow-hidden pb-32 pt-10 lg:pt-20 rounded-b-[4rem] shadow-2xl shadow-primary/20">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
          </div>

          <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  <span className="text-sm font-medium text-blue-50">Güvenilir Medikal Tedarikçiniz</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                  Medikal İhtiyaçlarınız <br />
                  <span className="text-secondary">İçin Bize Ulaşın</span>
                </h1>

                <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                  Hastaneler, klinikler ve bireysel kullanıcılar için en kaliteli medikal ürünleri,
                  en uygun fiyatlarla ve güvenilir hizmet anlayışıyla sunuyoruz.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                  <Link href="/products">
                    <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl shadow-secondary/20 transition-all duration-300 hover:scale-105 rounded-full px-10 py-7 h-auto text-lg font-bold">
                      Alışverişe Başla
                      <ArrowRight className="ml-2.5 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" className="bg-transparent text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105 rounded-full px-10 py-7 h-auto text-lg font-semibold">
                      İletişime Geç
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Image Composition Placeholder */}
              <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  {/* Main Image Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-secondary/20 rounded-full blur-3xl"></div>
                  <div className="relative z-10 grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform translate-y-12">
                      <div className="w-full h-32 bg-white/20 rounded-2xl mb-4"></div>
                      <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-white/20 rounded"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transform -translate-y-4">
                      <div className="w-full h-32 bg-white/20 rounded-2xl mb-4"></div>
                      <div className="h-4 w-3/4 bg-white/20 rounded mb-2"></div>
                      <div className="h-3 w-1/2 bg-white/20 rounded"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 col-span-2 transform -translate-y-8 w-3/4 mx-auto">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary-foreground font-bold">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="h-4 w-32 bg-white/20 rounded mb-1"></div>
                          <div className="h-3 w-20 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section (Overlapping) */}
        <section className="container mx-auto px-4 -mt-24 relative z-20 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Hızlı Teslimat</h3>
              <p className="text-slate-500 text-sm leading-relaxed">İzmir içi aynı gün, tüm Türkiye'ye ertesi gün kargo imkanı.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Güvenli Ödeme</h3>
              <p className="text-slate-500 text-sm leading-relaxed">256-bit SSL sertifikası ve 3D Secure ile güvenli alışveriş.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <PackageCheck className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Kolay İade</h3>
              <p className="text-slate-500 text-sm leading-relaxed">14 gün içinde koşulsuz iade ve değişim garantisi.</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <Headphones className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">7/24 Destek</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Uzman ekibimiz sorularınızı yanıtlamak için her zaman hazır.</p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 mb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Kategoriler</h2>
                <p className="text-slate-500">İhtiyacınız olan ürün grubunu seçin</p>
              </div>
              <Link href="/categories">
                <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-blue-50 p-0 h-auto font-semibold text-lg gap-2 px-4 py-2 rounded-full">
                  Tümünü Gör <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <Link key={idx} href={`/products?category=${encodeURIComponent(cat.title)}`}>
                  <div className="group cursor-pointer h-full relative overflow-hidden rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 border border-slate-100">
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10`}></div>

                    <div className="relative z-20 p-8 flex items-center gap-6 h-full">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${cat.color} bg-opacity-20 transition-all duration-500 group-hover:scale-110 group-hover:shadow-md shadow-sm shrink-0`}>
                        <cat.icon className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">{cat.title}</h3>
                        <div className="inline-flex items-center text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full group-hover:shadow-sm transition-all">
                          {cat.count}
                        </div>
                      </div>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto px-4 py-12 mb-24">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Öne Çıkan Ürünler</h2>
              <p className="text-slate-500">En çok tercih edilen medikal ürünler</p>
            </div>
            <div className="flex gap-3 hidden md:flex">
              <Button variant="outline" className="rounded-full px-6 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium">Yeni Gelenler</Button>
              <Button variant="ghost" className="rounded-full px-6 text-slate-500 hover:text-slate-900 hover:bg-slate-100">Çok Satanlar</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                category={product.category.name}
                title={product.name}
                code={product.sku}
                price={Number(product.price)}
                image={product.images[0]}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/products">
              <Button variant="outline" size="lg" className="rounded-full px-12 py-7 h-auto text-lg border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-700 hover:bg-blue-50 font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                Tüm Ürünleri İncele
              </Button>
            </Link>
          </div>
        </section>

        {/* B2B Banner */}
        <section className="container mx-auto px-4 mb-24">
          <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-slate-900/20">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl mix-blend-overlay translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl mix-blend-overlay -translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div className="max-w-2xl">
                <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-sm font-semibold mb-6 border border-blue-500/20">
                  Kurumsal İş Ortaklığı
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Kurumsal Çözümler ve <br />
                  <span className="text-blue-400">Toptan Alım Fırsatları</span>
                </h2>
                <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                  Hastaneler, klinikler ve toplu alımlar için özel fiyat listelerimizden yararlanmak ister misiniz? Kurumsal üyelik avantajlarını keşfedin.
                </p>
              </div>
              <Link href="/contact">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50 font-bold text-lg px-10 py-8 h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 shrink-0 border-4 border-white/10 bg-clip-padding">
                  Hemen Başvur
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
