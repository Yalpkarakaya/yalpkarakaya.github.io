# AEK Projesi - Akıllı Eldiven Drone Kontrolcüsü

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)

## 🎯 Proje Hakkında

DJI drone'lar için el hareketleriyle sezgisel, düşük gecikmeli ve yüksek hassasiyetli kontrol sağlayan, giyilebilir yeni nesil bir insan-makine arayüzü.

### ✨ Özellikler

- **🤲 Sezgisel Kontrol**: Doğal el hareketleri ile drone kontrolü
- **⚡ Düşük Gecikme**: <200ms hedef gecikme süresi
- **🎯 Yüksek Doğruluk**: >95% jest tanıma doğruluğu
- **🔬 Teknoloji Füzyonu**: Rezonant endüktif kuplaj + IMU sensör entegrasyonu

### 🛠️ Teknolojiler

- **Frontend**: HTML5, TailwindCSS, JavaScript (ES6+)
- **Backend**: Firebase Cloud Functions
- **AI**: Google Gemini API
- **Analitik**: Chart.js, KaTeX
- **Sensörler**: BNO085 IMU, Rezonant LC Devre

## 🚀 Kurulum

### Gereksinimler

- Node.js 22+
- Firebase CLI (`npm install -g firebase-tools`)
- Git

### Adımlar

1. **Projeyi Klonlayın**
   ```bash
   git clone <repo-url>
   cd akilli-eldiven-proje
   ```

2. **Firebase Functions Bağımlılıklarını Yükleyin**
   ```bash
   cd functions
   npm install
   cd ..
   ```

3. **API Anahtarlarını Yapılandırın** (KRİTİK!)
   
   **Otomatik (Önerilen):**
   ```bash
   ./setup-firebase-keys.sh
   ```
   
   **Manuel:**
   ```bash
   # Production
   firebase functions:config:set gemini.api_keys='["KEY1","KEY2","KEY3"]'
   
   # Yerel geliştirme
   cd functions && cp .env.example .env
   # .env dosyasını düzenleyin
   ```
   
   **📖 Detaylı rehber**: `SETUP-API-KEYS.md`

4. **Firebase'e Deploy**
   ```bash
   firebase login
   firebase deploy
   ```

## 🔐 Güvenlik Uyarıları

### ⚠️ API Anahtarları - KRİTİK!

**🔴 ÖNEMLİ**: API anahtarları KODDAN TAMAMEN KALDIRILMIŞTIR!

Proje artık **SADECE** environment variables ile çalışır. API anahtarlarınızı yapılandırmak için:

#### Otomatik Kurulum (Önerilen) 🚀

```bash
# Setup script'i çalıştırın
./setup-firebase-keys.sh

# Anahtarlarınızı girin ve deploy edin
firebase deploy --only functions
```

#### Manuel Kurulum

**Production için (Firebase):**
```bash
firebase functions:config:set gemini.api_keys='["KEY1","KEY2","KEY3","KEY4","KEY5","KEY6"]'
firebase deploy --only functions
```

**Yerel geliştirme için (.env):**
```bash
cd functions
cp .env.example .env
# .env dosyasını açıp gerçek anahtarlarınızı ekleyin
```

**📖 Detaylı Kurulum Rehberi**: `SETUP-API-KEYS.md` dosyasına bakın

## 📁 Proje Yapısı

```
akilli-eldiven-proje/
├── assets/
│   ├── css/
│   │   └── akilli-eldiven.css    # Ana stil dosyası
│   └── js/
│       └── akilli-eldiven.js     # Ana JavaScript mantığı
├── functions/
│   ├── index.js                  # Firebase Cloud Functions
│   └── package.json              # Function bağımlılıkları
├── _includes/                    # Jekyll include dosyaları
├── _layouts/                     # Jekyll layout dosyaları
├── index.html                    # Ana sayfa
├── firebase.json                 # Firebase yapılandırması
└── README.md                     # Bu dosya
```

## 🎨 Özellikler

### 1. İnteraktif Gösterge Paneli
- Gerçek zamanlı metrik görselleştirme
- Mimari karşılaştırma grafikleri
- Donanım malzeme analizi

### 2. Teknik Kılavuzlar
- **Donanım Montaj**: Devre şemaları ve bağlantı detayları
- **Yazılım Algoritması**: Akış şemaları ve kod mantığı
- **Komponent Raporu**: Malzeme listesi yönetimi

### 3. AI Asistanı
- Google Gemini entegrasyonu
- Bağlantı analizi
- Akıllı komponent önerileri

### 4. Yol Haritası
- 6 fazlı proje planlaması
- Durum takibi (Planlanan/Devam Ediyor/Tamamlandı)
- Risk analizi ve zaman çizelgesi

## 🔧 Geliştirme

### Yerel Geliştirme

```bash
# Firebase emülatörünü başlat
firebase emulators:start

# Veya sadece functions
firebase emulators:start --only functions
```

### Linting

```bash
cd functions
npm run lint
```

## 📊 Sistem Mimarisi

### Donanım
- **Verici**: Si5351A (Saat), TLV9061 (Q-Multiplier)
- **Alıcı**: TLV9064 (Buffer), AD8307 (Log Detector), MCP3204 (ADC)
- **Kontrol**: ESP32 (İşlemci), BNO085 (IMU)
- **Güç**: MP2307 (Buck) + LDO

### Yazılım
- **Eldiven Firmware**: ESP32 (C++)
- **Android App**: DJI Mobile SDK
- **Web Dashboard**: Modern JavaScript

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit'leyin (`git commit -m 'feat: Add amazing feature'`)
4. Push'layın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje özel bir projedir. Ticari kullanım için izin gereklidir.

## 👥 İletişim

Proje Sahibi - AEK Projesi

Web: [https://akilli-eldiven-proje.web.app](https://akilli-eldiven-proje.web.app)

## 🙏 Teşekkürler

- Google Gemini AI
- Firebase Platform
- DJI Mobile SDK
- Chart.js & KaTeX

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
