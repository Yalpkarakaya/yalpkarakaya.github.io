# AEK Dashboard - Android APK

## 📱 Akıllı Eldiven Projesi - Android Uygulaması

Bu Android APK, AEK Dashboard web uygulamasını WebView ile çalıştırır.

---

## 🚀 Kurulum

### Android Studio'da Açma

1. **Android Studio'yu açın**
2. **File → Open** → `android-apk` klasörünü seçin
3. Gradle sync bekleyin

### APK Build

```bash
# Debug APK
./gradlew assembleDebug

# Release APK (imzalı)
./gradlew assembleRelease
```

**Çıktı:** `app/build/outputs/apk/debug/app-debug.apk`

---

## 🔧 Özellikler

### ✅ WebView Ayarları

- **JavaScript** ✅ Etkin
- **DOM Storage** ✅ Etkin (Firebase için)
- **File Access** ✅ Etkin (Assets için)
- **Mixed Content** ✅ İzin veriliyor
- **Internet** ✅ İzin var

### 📦 İçerikler

```
app/src/main/
├── AndroidManifest.xml     # Internet izinleri
├── java/com/aek/dashboard/
│   └── MainActivity.java   # WebView yapılandırması
├── res/
│   ├── layout/
│   │   └── activity_main.xml
│   └── values/
│       ├── strings.xml
│       └── themes.xml
└── assets/
    ├── site.html           # Ana HTML
    ├── manifest.json       # PWA manifest
    ├── favicon.ico
    └── assets/
        ├── css/
        │   └── akilli-eldiven.css
        └── js/
            └── akilli-eldiven.js
```

---

## 🌐 Internet Bağımlılıkları

Uygulama şu CDN'leri kullanır:
- Tailwind CSS
- Chart.js
- KaTeX
- Firebase SDK
- Google Fonts

**⚠️ Internet bağlantısı olmadan çalışmaz!**

---

## 🐛 Sorun Giderme

### İçerik Görünmüyor

1. **Chrome Remote Debug:**
   - Chrome'da: `chrome://inspect`
   - Cihazı seçin → WebView'u inceleyin
   - Console'da hataları kontrol edin

2. **Internet İzni:**
   - `AndroidManifest.xml` kontrol edin
   - `<uses-permission android:name="android.permission.INTERNET" />` olmalı

3. **JavaScript Hatası:**
   - `MainActivity.java` → `setJavaScriptEnabled(true)` olmalı

### APK Çalışmıyor

```bash
# Logcat ile hataları görün
adb logcat | grep -i "chromium\|webview\|aek"
```

---

## 📊 Minimum Gereksinimler

- **Android**: 7.0 (API 24) ve üzeri
- **Internet**: Gerekli
- **Depolama**: ~5 MB

---

## 🔐 Güvenlik

- API anahtarları Firebase Functions'ta
- Frontend'de API key yok
- HTTPS bağlantıları destekleniyor

---

## 📝 Geliştirici Notları

### WebView Debugging

```java
// MainActivity.java içinde ekleyin:
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

### Assets Güncelleme

1. Ana proje root'ta değişiklik yapın:
   - `index.html` → `android-apk/app/src/main/assets/site.html`
   - `assets/` → `android-apk/app/src/main/assets/assets/`

2. Mutlak yolları relative'e çevirin:
   - `/manifest.json` → `manifest.json`
   - `/assets/css/` → `assets/css/`

3. APK'yı rebuild edin

---

## 🎯 Versiyon

- **v1.0** - İlk sürüm
- WebView tabanlı
- Firebase entegrasyonu
- Tam responsive design

---

## 📞 İletişim

**Proje:** AEK - Akıllı Eldiven Drone Kontrolcüsü  
**Website:** https://yalpkarakaya.github.io/
