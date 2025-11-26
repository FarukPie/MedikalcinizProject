---
description: Projeyi Vercel'e deploy etme rehberi
---

# Projeyi Canlıya Alma (Vercel ile)

Bu rehber, Next.js projenizi Vercel kullanarak ücretsiz ve hızlı bir şekilde nasıl canlıya alacağınızı anlatır.

## Ön Hazırlık

1.  Projenizin bir GitHub deposunda (repository) olduğundan emin olun.
2.  Eğer yoksa, [GitHub](https://github.com) üzerinde yeni bir depo oluşturun ve kodlarınızı oraya yükleyin.

## Adım Adım Kurulum

1.  **Vercel Hesabı Oluşturun**:
    *   [vercel.com](https://vercel.com) adresine gidin.
    *   "Sign Up" butonuna tıklayın.
    *   "Continue with GitHub" seçeneğini seçerek GitHub hesabınızla giriş yapın.

2.  **Yeni Proje Ekleyin**:
    *   Dashboard ekranında "Add New..." butonuna tıklayın ve "Project"i seçin.
    *   "Import Git Repository" listesinde projenizin bulunduğu GitHub deposunu bulun ve "Import" butonuna tıklayın.

3.  **Ayarları Yapılandırın**:
    *   **Project Name**: Projenize bir isim verin (otomatik gelecektir).
    *   **Framework Preset**: "Next.js" olarak seçili olduğundan emin olun.
    *   **Root Directory**: `./` olarak kalabilir.
    *   **Environment Variables**: Eğer projenizde `.env` dosyasında özel anahtarlar varsa (örneğin veritabanı URL'i), bunları buraya ekleyin. (Şu anki projenizde sadece mock data kullandığımız için buna gerek yok).

4.  **Deploy Edin**:
    *   "Deploy" butonuna tıklayın.
    *   Vercel projenizi derleyecek ve birkaç dakika içinde yayına alacaktır.

5.  **Sonuç**:
    *   İşlem bittiğinde size `https://medicalciniz.vercel.app` gibi bir URL verecektir.
    *   Bu linki patronunuzla paylaşabilirsiniz.

## Alternatif: Lokal Sunum (İnternetsiz)

Eğer internete yüklemek istemiyor, sadece kendi bilgisayarınızda "gerçek" modda göstermek istiyorsanız:

1.  Terminali açın.
2.  Şu komutu çalıştırın: `npm run build` (Bu işlem projenin optimize edilmiş halini oluşturur).
3.  Bittiğinde şu komutu çalıştırın: `npm run start`.
4.  Tarayıcıda `http://localhost:3000` adresine gidin. Bu artık geliştirme modu değil, canlı modun aynısıdır.
