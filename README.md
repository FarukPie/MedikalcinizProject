# 🚀 Modern ERP & Yönetim Paneli (Next.js 15 & React 19)

Bu proje, **Next.js 15 (App Router)** ve **React 19** mimarisi üzerine inşa edilmiş, yüksek performanslı ve tam kapsamlı bir yönetim paneli (ERP) çözümüdür. Stok takibi, sipariş yönetimi ve faturalandırma süreçleri için geliştirilmiş olup, en güncel web teknolojilerini barındırır.

![Project Banner](https://via.placeholder.com/1200x400?text=Proje+Ekran+G%C3%B6r%C3%BCnt%C3%BCs%C3%BC+Buraya)

## ✨ Öne Çıkan Özellikler

* **🛡️ Rol Tabanlı Erişim Kontrolü (RBAC):** Dinamik izinler ve rol yönetimi ile güvenli erişim.
* **📊 Admin Dashboard:** Stok, Siparişler ve Faturalar için ERP benzeri kapsamlı yönetim özellikleri.
* **⚡ Dinamik Veri Tabloları:** Gelişmiş filtreleme, sayfalama ve etkileşimli veri yönetimi.
* **🖨️ Fatura Yazdırma:** `React-to-Print` entegrasyonu ile fatura ve irsaliyeler için doğrudan yazdırma desteği.
* **📈 Veri Görselleştirme:** `Recharts` ile anlık grafik ve analiz raporları.

---

## 🛠️ Kullanılan Teknolojiler

Proje, endüstri standardı ve en yeni nesil kütüphaneler kullanılarak geliştirilmiştir.

### 🚀 Core Framework & Language
* **Next.js 15+** (App Router & Server Components)
* **React 19** (Server Actions & Latest Hooks)
* **TypeScript** (Tip güvenli, ölçeklenebilir geliştirme)

### 🎨 UI & Styling
* **Tailwind CSS v4** (Utility-first modern stil sistemi)
* **Radix UI** (Erişilebilir, headless UI bileşenleri - Dialog, Dropdown vb.)
* **Lucide React** (Modern ve temiz ikon seti)
* **Sonner** (Şık toast bildirimleri)
* **Recharts** (Veri görselleştirme ve grafikler)

### 🗄️ Backend & Database
* **Prisma ORM** (Tip güvenli veritabanı etkileşimi)
* **PostgreSQL** (Güçlü ve ölçeklenebilir ilişkisel veritabanı)
* **NextAuth.js (v5 Beta)** (Güvenli kimlik doğrulama ve oturum yönetimi)
* **Server Actions** (Form gönderimleri ve mutasyonlar için modern yaklaşım)

### 🛠️ Yardımcı Araçlar (Utilities)
* **Zustand** (Hafif ve hızlı state yönetimi)
* **React-to-Print** (Yazdırma işlemleri)
* **Date-fns** (Tarih formatlama ve manipülasyon)
* **Bcryptjs** (Güvenli şifreleme)

---

## ⚙️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1.  **Repoyu klonlayın:**
    ```bash
    git clone [https://github.com/kullaniciadi/proje-adi.git](https://github.com/kullaniciadi/proje-adi.git)
    cd proje-adi
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    # veya
    yarn install
    ```

3.  **Çevresel Değişkenleri (.env) Ayarlayın:**
    Kök dizinde `.env` dosyası oluşturun ve gerekli veritabanı/auth anahtarlarını girin:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    AUTH_SECRET="gizli-anahtariniz"
    ```

4.  **Veritabanını Hazırlayın (Prisma):**
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```

Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyebilirsiniz.

---

## 📸 Ekran Görüntüleri

<img width="1912" height="948" alt="screencapture-localhost-3000-admin-products-2025-12-08-16_51_45" src="https://github.com/user-attachments/assets/9f5d4ac3-3b85-4c6b-854f-466a0666b33a" />
<img width="1912" height="3888" alt="screencapture-localhost-3000-2025-12-08-16_50_00" src="https://github.com/user-attachments/assets/c64e8a37-992e-4433-8c15-4e163de2ec80" />
<img width="1912" height="1331" alt="screencapture-localhost-3000-cart-2025-12-08-16_50_30" src="https://github.com/user-attachments/assets/daea11ca-25c9-44af-8bf5-66a632e5c859" />
<img width="1912" height="948" alt="screencapture-localhost-3000-login-2025-12-08-16_50_41" src="https://github.com/user-attachments/assets/c99ecbdf-3782-47ed-95af-ef0f49d5dd21" />


---

## 📄 Lisans

Bu proje [MIT](LICENSE) lisansı ile lisanslanmıştır.
