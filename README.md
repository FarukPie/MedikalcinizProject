# 🩺 Medikalciniz | Yeni Nesil E-Ticaret Platformu

**Medikalciniz**, tıbbi ürünlerin satışı ve operasyonel yönetimi için geliştirilmiş, yüksek performanslı bir B2B/B2C e-ticaret çözümüdür. **Next.js 15** ve **React 19** mimarisi üzerinde koşan bu platform, sadece bir vitrin değil; arka planda stok, sipariş ve fatura süreçlerini yöneten güçlü bir **ERP (Kurumsal Kaynak Planlama)** altyapısına sahiptir.


## ✨ Öne Çıkan Özellikler

Bu proje, modern bir e-ticaret sitesinin ihtiyaç duyduğu hız ve güvenliği, kurumsal yönetim araçlarıyla birleştirir.

* **🛒 Gelişmiş E-Ticaret Deneyimi:** Hızlı ürün listeleme, sepet yönetimi ve güvenli ödeme altyapısı.
* **🛡️ Rol Tabanlı Erişim (RBAC):** Müşteriler, yöneticiler ve depo sorumluları için ayrıştırılmış dinamik yetki yönetimi.
* **📊 Entegre ERP & Admin Paneli:** Ürün stokları, gelen siparişler ve faturalandırma süreçleri için merkezi yönetim paneli.
* **⚡ Dinamik Veri Yönetimi:** Binlerce ürün ve sipariş arasında anlık filtreleme, sayfalama ve hızlı işlem yeteneği.
* **🖨️ Otomatik Fatura & İrsaliye:** `React-to-Print` ile siparişlerin tek tıkla resmi evraka (fatura/irsaliye) dönüştürülmesi ve yazdırılması.
* **📈 Satış Analitiği:** `Recharts` ile günlük/aylık satış grafiklerinin ve ciro analizlerinin görselleştirilmesi.

---

## 🛠️ Kullanılan Teknolojiler

Platform, e-ticaretin gerektirdiği ölçeklenebilirlik, güvenlik ve SEO performansı için en güncel teknoloji yığınını kullanır.

### 🚀 Core Framework & Language
* **Next.js 15+** (App Router & Server Components - SEO ve Hız odaklı)
* **React 19** (Server Actions ile form ve veri yönetimi)
* **TypeScript** (Hatasız ve güvenli kod yapısı)

### 🎨 UI & Styling
* **Tailwind CSS v4** (Modern ve hızlı stil motoru)
* **Radix UI** (Erişilebilir, headless UI bileşenleri - Dialog, Dropdown vb.)
* **Lucide React** (Temiz ikon seti)
* **Sonner** (Kullanıcı bilgilendirme ve toast mesajları)
* **Recharts** (Admin paneli için veri görselleştirme)

### 🗄️ Backend & Database
* **Prisma ORM** (Tip güvenli veritabanı iletişimi)
* **PostgreSQL** (Güvenilir ilişkisel veritabanı)
* **NextAuth.js (v5 Beta)** (Müşteri ve Yönetici oturum yönetimi)
* **Server Actions** (API route yazmadan doğrudan sunucu tarafı işlemler)

### 🛠️ Yardımcı Araçlar (Utilities)
* **Zustand** (Sepet ve uygulama durumu yönetimi)
* **React-to-Print** (Fatura yazdırma modülü)
* **Date-fns** (Sipariş tarihleri ve formatlama)
* **Bcryptjs** (Kullanıcı verilerinin şifrelenmesi)

---

## ⚙️ Kurulum ve Geliştirme

Projeyi yerel ortamınızda ayağa kaldırmak için:

1.  **Repoyu klonlayın:**
    ```bash
    git clone [https://github.com/kullaniciadi/medikalciniz.git](https://github.com/kullaniciadi/medikalciniz.git)
    cd medikalciniz
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Çevresel Değişkenleri (.env) Ayarlayın:**
    Kök dizinde `.env` dosyasını oluşturun:
    ```env
    DATABASE_URL="postgresql://user:pass@localhost:5432/medikalciniz_db"
    AUTH_SECRET="super-gizli-anahtar"
    ```

4.  **Veritabanını Hazırlayın:**
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

Tarayıcınızda `http://localhost:3000` adresine giderek **Medikalciniz** platformunu görüntüleyebilirsiniz.

---

## 📸 Ekran Görüntüleri

<img width="1912" height="948" alt="screencapture-localhost-3000-admin-products-2025-12-08-16_51_45" src="https://github.com/user-attachments/assets/9f5d4ac3-3b85-4c6b-854f-466a0666b33a" />
<img width="1912" height="3888" alt="screencapture-localhost-3000-2025-12-08-16_50_00" src="https://github.com/user-attachments/assets/c64e8a37-992e-4433-8c15-4e163de2ec80" />
<img width="1912" height="1331" alt="screencapture-localhost-3000-cart-2025-12-08-16_50_30" src="https://github.com/user-attachments/assets/daea11ca-25c9-44af-8bf5-66a632e5c859" />
<img width="1912" height="948" alt="screencapture-localhost-3000-login-2025-12-08-16_50_41" src="https://github.com/user-attachments/assets/c99ecbdf-3782-47ed-95af-ef0f49d5dd21" />

---

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır.


