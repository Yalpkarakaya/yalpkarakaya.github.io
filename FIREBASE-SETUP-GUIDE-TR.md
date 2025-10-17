# 🔐 Firebase API Anahtarları Kurulum Rehberi (Türkçe)

## 📋 Ön Hazırlık

### Gereken Bilgiler
- ✅ 6 adet Gemini API anahtarı (hazır)
- ✅ Firebase CLI yüklü
- ✅ Firebase projesine erişim yetkisi

---

## 🎯 Yöntem 1: Otomatik Kurulum (ÖNERİLEN) ⚡

### Adım 1: Terminal/Command Prompt Açın

**Windows:**
- Başlat > cmd veya PowerShell

**Mac/Linux:**
- Terminal uygulamasını açın

### Adım 2: Proje Klasörüne Gidin

```bash
cd /workspace
# veya projenizin bulunduğu klasör
```

### Adım 3: Firebase'e Giriş Yapın

```bash
firebase login
```

**Ne olacak:**
- Tarayıcı açılacak
- Google hesabınızla giriş yapın
- "Firebase CLI wants to access your Google Account" → **Allow** tıklayın
- Terminal'de "✔ Success!" göreceksiniz

### Adım 4: Proje Seçimi (Gerekirse)

```bash
firebase use akillieldiven
# veya projenizin ID'si
```

**Proje ID'nizi bilmiyorsanız:**
```bash
firebase projects:list
```

### Adım 5: Setup Scriptini Çalıştırın

```bash
chmod +x setup-firebase-keys.sh
./setup-firebase-keys.sh
```

### Adım 6: API Anahtarlarını Girin

Script size soracak:
```
📝 API anahtarlarınızı girin (virgülle ayırın):
API Keys: 
```

**Şöyle yapıştırın** (virgülle ayırarak):
```
AIzaSyXXXXX,AIzaSyYYYYY,AIzaSyZZZZZ,AIzaSyAAAAA,AIzaSyBBBBB,AIzaSyCCCCC
```

**ENTER**'a basın.

### Adım 7: Onaylayın

Script anahtarları Firebase'e yükleyecek ve şöyle bir çıktı göreceksiniz:

```
✅ API anahtarları başarıyla yüklendi!

📋 Yüklenen anahtarlar:
{
  "gemini": {
    "api_keys": ["AIzaSy...", "AIzaSy...", ...]
  }
}

⚠️  Değişikliklerin aktif olması için deploy etmeniz gerekiyor:
   firebase deploy --only functions
```

### Adım 8: Deploy Edin

```bash
firebase deploy --only functions
```

**Bekleme süresi:** 2-3 dakika

**Başarılı olursa:**
```
✔  Deploy complete!
Function URL (geminiProxy): https://us-central1-akillieldiven.cloudfunctions.net/geminiProxy
```

### ✅ Tamamlandı!

---

## 🎯 Yöntem 2: Manuel Kurulum (Script Çalışmazsa)

### Adım 1-4: Yukarıdaki ile Aynı
(Firebase login, use project)

### Adım 5: Anahtarları JSON Formatına Çevirin

**6 anahtarınızı alın:**
```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
AIzaSyYYYYYYYYYYYYYYYYYYYYYYYY
AIzaSyZZZZZZZZZZZZZZZZZZZZZZZZ
AIzaSyAAAAAAAAAAAAAAAAAAAAAA
AIzaSyBBBBBBBBBBBBBBBBBBBBBBBB
AIzaSyCCCCCCCCCCCCCCCCCCCCCCCC
```

**JSON array formatına çevirin:**
```json
["AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX","AIzaSyYYYYYYYYYYYYYYYYYYYYYYYY","AIzaSyZZZZZZZZZZZZZZZZZZZZZZZZ","AIzaSyAAAAAAAAAAAAAAAAAAAAAA","AIzaSyBBBBBBBBBBBBBBBBBBBBBBBB","AIzaSyCCCCCCCCCCCCCCCCCCCCCCCC"]
```

**ÖNEMLİ:**
- Her anahtar **çift tırnak** içinde
- Anahtarlar **virgül** ile ayrılmış
- Tüm liste **köşeli parantez** içinde
- Boşluk olmamalı (veya olabilir)

### Adım 6: Firebase'e Yükleyin

```bash
firebase functions:config:set gemini.api_keys='["ANAHTAR1","ANAHTAR2","ANAHTAR3","ANAHTAR4","ANAHTAR5","ANAHTAR6"]'
```

**Örnek (gerçek anahtarlarla):**
```bash
firebase functions:config:set gemini.api_keys='["AIzaSyXXX...","AIzaSyYYY...","AIzaSyZZZ...","AIzaSyAAA...","AIzaSyBBB...","AIzaSyCCC..."]'
```

### Adım 7: Doğrulayın

```bash
firebase functions:config:get gemini
```

**Beklenen çıktı:**
```json
{
  "api_keys": [
    "AIzaSy...",
    "AIzaSy...",
    "AIzaSy...",
    "AIzaSy...",
    "AIzaSy...",
    "AIzaSy..."
  ]
}
```

**Eğer hata varsa:**
```bash
# Ayarı sil ve tekrar dene
firebase functions:config:unset gemini.api_keys
firebase functions:config:set gemini.api_keys='[...]'
```

### Adım 8: Deploy Edin

```bash
firebase deploy --only functions
```

### ✅ Tamamlandı!

---

## 🎯 Yöntem 3: Firebase Console (Web Arayüzü)

### Adım 1: Firebase Console'a Gidin

Tarayıcınızda açın:
```
https://console.firebase.google.com
```

### Adım 2: Projenizi Seçin

- **"akillieldiven"** (veya proje adınız) projesine tıklayın

### Adım 3: Functions Sayfasına Gidin

Sol menüden:
- **Build** > **Functions** tıklayın

### Adım 4: Configuration'a Gidin

Üst menüden:
- **Configuration** sekmesine tıklayın

### Adım 5: Environment Variable Ekleyin

- **Add variable** butonuna tıklayın
- **Key:** `gemini.api_keys`
- **Value:** JSON array formatında anahtarlarınızı girin:
```json
["ANAHTAR1","ANAHTAR2","ANAHTAR3","ANAHTAR4","ANAHTAR5","ANAHTAR6"]
```
- **Save** tıklayın

### Adım 6: Functions'u Yeniden Deploy Edin

Terminal'de:
```bash
firebase deploy --only functions
```

---

## ✅ Kontrol ve Test

### 1. Config'i Doğrulayın

```bash
firebase functions:config:get
```

**Görmeli siniz:**
```json
{
  "gemini": {
    "api_keys": [
      "AIzaSy...",
      "AIzaSy...",
      ...
    ]
  }
}
```

### 2. Functions Loglarını Kontrol Edin

```bash
firebase functions:log --limit 10
```

**Hata varsa görürsünüz:**
- `🔴 FATAL: No API keys configured!` → Anahtarlar yüklenmemiş
- `Error parsing GEMINI_API_KEYS` → JSON format hatası

### 3. Web Sitesinde Test Edin

1. Web sitenizi açın: `https://akillieldiven.web.app`
2. AI Inspector'ı açın (herhangi bir bağlantıya tıklayın)
3. Bir soru sorun
4. Cevap gelirse ✅ başarılı!

**Hata alırsanız:**
- Browser Console açın (F12)
- Network sekmesine bakın
- `geminiProxy` çağrısına bakın
- Error mesajını okuyun

---

## 🐛 Sorun Giderme

### Hata 1: "Firebase CLI not found"

```bash
# Firebase CLI'yi yükleyin
npm install -g firebase-tools

# Veya
curl -sL https://firebase.tools | bash
```

### Hata 2: "Permission denied"

```bash
# Tekrar login yapın
firebase logout
firebase login
```

### Hata 3: "Invalid project"

```bash
# Proje listesine bakın
firebase projects:list

# Doğru projeyi seçin
firebase use PROJECT_ID
```

### Hata 4: "Functions not deployed"

```bash
# Deploy'u tekrar deneyin
firebase deploy --only functions

# Hala hata varsa, tüm logs'u görün
firebase deploy --only functions --debug
```

### Hata 5: "API key format error"

JSON formatınızı kontrol edin:
```bash
# Yanlış ❌
firebase functions:config:set gemini.api_keys='[key1,key2]'
firebase functions:config:set gemini.api_keys="['key1','key2']"

# Doğru ✅
firebase functions:config:set gemini.api_keys='["key1","key2"]'
```

### Hata 6: "quota exceeded" (Test Ederken)

```bash
# Anahtarların doğru yüklendiğini kontrol edin
firebase functions:config:get gemini.api_keys

# Farklı bir anahtar ekleyin
firebase functions:config:set gemini.api_keys='["KEY1","KEY2","KEY3","KEY4","KEY5","KEY6","KEY7"]'
```

---

## 📝 Özet Komutlar (Kopyala-Yapıştır)

### Hızlı Kurulum (Otomatik)

```bash
# 1. Login
firebase login

# 2. Proje seç
firebase use akillieldiven

# 3. Script çalıştır
chmod +x setup-firebase-keys.sh
./setup-firebase-keys.sh

# 4. Deploy
firebase deploy --only functions

# 5. Kontrol
firebase functions:config:get gemini.api_keys
```

### Hızlı Kurulum (Manuel)

```bash
# 1-2. Login ve proje seç (yukarıdaki ile aynı)

# 3. Anahtarları ayarla (kendi anahtarlarınızı yazın)
firebase functions:config:set gemini.api_keys='["AIzaSyXXX","AIzaSyYYY","AIzaSyZZZ","AIzaSyAAA","AIzaSyBBB","AIzaSyCCC"]'

# 4. Doğrula
firebase functions:config:get gemini.api_keys

# 5. Deploy
firebase deploy --only functions

# 6. Log kontrol
firebase functions:log --limit 5
```

---

## 🎓 Ek Bilgiler

### Firebase Environment Config Nedir?

- Firebase Functions'da ortam değişkenleri
- Deploy sonrası otomatik yüklenir
- `functions.config()` ile erişilir
- Güvenli ve şifreli

### Neden JSON Array Formatı?

```javascript
// Backend'de şöyle kullanılıyor:
const apiKeys = functions.config().gemini?.api_keys;
// apiKeys = ["key1", "key2", "key3"]

// Rotation için:
const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
```

### Anahtarları Güncelleme

```bash
# Tüm anahtarları değiştir
firebase functions:config:set gemini.api_keys='["YENİ1","YENİ2","YENİ3"]'

# Sadece bir anahtar ekle (mevcut anahtarlar korunur)
# Önce mevcut anahtarları al, sonra yenisini ekle
firebase functions:config:set gemini.api_keys='["ESKI1","ESKI2","ESKI3","YENİ4"]'

# Deploy et
firebase deploy --only functions
```

### Anahtarları Silme

```bash
# Sadece gemini.api_keys sil
firebase functions:config:unset gemini.api_keys

# Tüm gemini config sil
firebase functions:config:unset gemini

# Deploy et
firebase deploy --only functions
```

---

## ✅ Başarı Kriterleri

İşlem başarılı oldu mu?

- [ ] `firebase functions:config:get gemini.api_keys` çıktı veriyor
- [ ] `firebase deploy --only functions` başarılı
- [ ] Functions URL'si çalışıyor
- [ ] Web sitesinde AI cevap veriyor
- [ ] Console'da hata yok

Hepsi ✅ ise **BAŞARILI!** 🎉

---

**Yardıma ihtiyacınız olursa, bu rehberi takip edin veya bana sorun!**

**Son Güncelleme:** 2025-10-17
