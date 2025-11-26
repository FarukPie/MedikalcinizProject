# Medikalciniz Frontend Projesi

Bu proje Next.js 14, Tailwind CSS ve shadcn/ui kullanılarak "Medikalciniz" e-ticaret sitesi için oluşturulmuş modern bir frontend çalışmasıdır.

## Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Gereksinimler
Bilgisayarınızda [Node.js](https://nodejs.org/) (Sürüm 18 veya üzeri) kurulu olmalıdır.

### 2. Bağımlılıkları Yükleme
Terminali açın ve proje klasöründe şu komutu çalıştırın:

```bash
npm install
```

### 3. Geliştirme Sunucusunu Başlatma
Kurulum tamamlandıktan sonra projeyi ayağa kaldırmak için:

```bash
npm run dev
```

### 4. Tarayıcıda Görüntüleme
Tarayıcınızı açın ve şu adrese gidin:
[http://localhost:3000](http://localhost:3000)

## Proje Yapısı

- `app/page.tsx`: Ana sayfa (Hero, Kategoriler, Ürünler).
- `components/navbar.tsx`: Üst bar ve navigasyon.
- `components/product-card.tsx`: Ürün kartı bileşeni.
- `components/ui`: shadcn/ui bileşenleri (Button, Input, vb.).

## Kullanılan Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Stil**: Tailwind CSS
- **UI Kütüphanesi**: shadcn/ui
- **İkonlar**: Lucide React
- **Font**: Plus Jakarta Sans
