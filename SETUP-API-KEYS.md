# 🔐 API Anahtarları Kurulum Rehberi

Bu rehber, API anahtarlarınızı güvenli bir şekilde yapılandırmanız için detaylı talimatlar içerir.

## ⚠️ ÖNEMLİ UYARI

**API anahtarlarınızı ASLA git repository'ye commit etmeyin!**

- ❌ Kodda hardcode yapmayın
- ❌ Public dosyalara yazmayın  
- ✅ Environment variables kullanın
- ✅ .env dosyası .gitignore'da olmalı

---

## 🚀 Hızlı Kurulum (Otomatik)

### Yöntem 1: Setup Script (Önerilen)

```bash
# 1. Script'i çalıştır
./setup-firebase-keys.sh

# 2. API anahtarlarınızı girin (virgülle ayırarak)
# Örnek: AIzaSyXXX,AIzaSyYYY,AIzaSyZZZ

# 3. Deploy edin
firebase deploy --only functions
```

---

## 🔧 Manuel Kurulum

### Yöntem 2: Firebase Console (Production)

#### Adım 1: Firebase CLI ile Login

```bash
firebase login
```

#### Adım 2: Proje Seçimi

```bash
firebase use --add
# Projenizi listeden seçin
```

#### Adım 3: API Anahtarlarını Ayarlama

**Tek anahtar için:**
```bash
firebase functions:config:set gemini.api_keys='["AIzaSyXXXXXXXXXXXXXXXXXXXXXX"]'
```

**Birden fazla anahtar için (önerilen):**
```bash
firebase functions:config:set gemini.api_keys='["AIzaSyXXX","AIzaSyYYY","AIzaSyZZZ","AIzaSyAAA","AIzaSyBBB","AIzaSyCCC"]'
```

#### Adım 4: Kontrol

```bash
# Ayarları görüntüle
firebase functions:config:get

# Sadece gemini anahtarlarını göster
firebase functions:config:get gemini.api_keys
```

#### Adım 5: Deploy

```bash
firebase deploy --only functions
```

---

### Yöntem 3: Yerel Geliştirme (.env dosyası)

#### Adım 1: .env Dosyası Oluştur

```bash
cd functions
cp .env.example .env
```

#### Adım 2: API Anahtarlarını Ekle

`.env` dosyasını açın ve gerçek anahtarlarınızı ekleyin:

```env
GEMINI_API_KEYS=["AIzaSyXXXXXXXXXXXX","AIzaSyYYYYYYYYYYYY","AIzaSyZZZZZZZZZZZZ"]
```

#### Adım 3: Test

```bash
# Functions emulator'ü başlat
firebase emulators:start --only functions

# Veya
npm run serve
```

---

## 🔍 Doğrulama

### Kurulum Kontrolü

```bash
# Firebase config'i kontrol et
firebase functions:config:get gemini

# Çıktı şöyle olmalı:
# {
#   "api_keys": ["AIzaSy...", "AIzaSy...", ...]
# }
```

### Fonksiyon Testi

```bash
# Local emulator ile test
firebase emulators:start

# Production'da test
curl -X POST https://your-region-your-project.cloudfunctions.net/geminiProxy \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent","contents":[{"parts":[{"text":"test"}]}]}'
```

---

## 🔄 Anahtar Güncelleme

### Mevcut Anahtarları Güncelleme

```bash
# 1. Mevcut anahtarları görüntüle
firebase functions:config:get gemini.api_keys

# 2. Yeni anahtarları ayarla (eskiler silinir)
firebase functions:config:set gemini.api_keys='["YENİ_KEY1","YENİ_KEY2"]'

# 3. Deploy et
firebase deploy --only functions
```

### Anahtar Ekleme (Mevcut anahtarlar korunur)

```bash
# 1. Mevcut anahtarları al
current=$(firebase functions:config:get gemini.api_keys)

# 2. Yeni anahtar ekle ve güncelle
firebase functions:config:set gemini.api_keys='["ESKİ_KEY1","ESKİ_KEY2","YENİ_KEY3"]'

# 3. Deploy et
firebase deploy --only functions
```

---

## 🗑️ Anahtar Silme

```bash
# Tüm gemini config'i sil
firebase functions:config:unset gemini

# Sadece api_keys'i sil
firebase functions:config:unset gemini.api_keys

# Deploy et
firebase deploy --only functions
```

---

## 🔐 Güvenlik En İyi Uygulamaları

### ✅ Yapılması Gerekenler

1. **Birden Fazla Anahtar Kullanın**
   - Load balancing için
   - Rate limiting'i aşmak için
   - Minimum 3-6 anahtar önerilir

2. **API Anahtarlarını Kısıtlayın**
   - Google Cloud Console > Credentials
   - HTTP referrers ekleyin
   - IP adresi kısıtlamaları yapın
   - Sadece gerekli API'leri etkinleştirin

3. **Düzenli Rotation**
   - Anahtarları her 3-6 ayda bir değiştirin
   - Eski anahtarları devre dışı bırakın
   - Yeni anahtarlar ekledikten sonra deploy edin

4. **Monitoring**
   - Firebase Console > Functions > Logs
   - API kullanımını izleyin
   - Anormal aktiviteleri kontrol edin

### ❌ Yapılmaması Gerekenler

1. ❌ API anahtarlarını kodda yazmayın
2. ❌ Git repository'ye commit etmeyin
3. ❌ Public dosyalarda saklamayın
4. ❌ Slack, Discord gibi platformlarda paylaşmayın
5. ❌ Screenshot alırken göstermeyin
6. ❌ Log dosyalarında bırakmayın

---

## 🐛 Sorun Giderme

### Hata: "API Keys are not configured"

**Sebep**: API anahtarları environment'ta bulunamıyor

**Çözüm**:
```bash
# 1. Config'i kontrol et
firebase functions:config:get gemini

# 2. Yoksa ekle
firebase functions:config:set gemini.api_keys='["KEY1","KEY2"]'

# 3. Deploy et
firebase deploy --only functions
```

### Hata: "No API key configured in the function"

**Sebep**: Fonksiyon API anahtarlarına erişemiyor

**Çözüm**:
```bash
# Local test için .env dosyası oluştur
cd functions
echo 'GEMINI_API_KEYS=["KEY1","KEY2"]' > .env

# Production için Firebase config kullan
firebase functions:config:set gemini.api_keys='["KEY1","KEY2"]'
firebase deploy --only functions
```

### Hata: "Error parsing GEMINI_API_KEYS"

**Sebep**: JSON format hatası

**Çözüm**: Format şöyle olmalı:
```json
["key1","key2","key3"]
```

**Yanlış formatlar:**
```json
❌ ['key1','key2']      // Tek tırnak kullanılmış
❌ [key1,key2]           // Tırnak yok
❌ "key1,key2"           // String olarak verilmiş
❌ {"keys":["key1"]}     // Object olarak verilmiş
```

---

## 📞 Destek

Sorun yaşarsanız:

1. **Logları kontrol edin:**
   ```bash
   firebase functions:log
   ```

2. **Emulator ile test edin:**
   ```bash
   firebase emulators:start --only functions --inspect-functions
   ```

3. **Config'i doğrulayın:**
   ```bash
   firebase functions:config:get
   ```

---

## 🎓 Ek Kaynaklar

- [Firebase Environment Configuration](https://firebase.google.com/docs/functions/config-env)
- [Google Cloud API Keys Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Son Güncelleme**: 2025-10-17

✅ Kurulum tamamlandıktan sonra bu dosyayı saklayın!
