# Güvenlik Politikası

## 🔐 Güvenlik Önlemleri

### API Anahtarları

**🔴 KRİTİK DEĞİŞİKLİK**: API anahtarları artık KODDA BULUNMUYOR!

#### Güvenli Yapılandırma

**1. Otomatik Kurulum (Önerilen)**
```bash
./setup-firebase-keys.sh
# Script sizden anahtarları isteyecek ve güvenli şekilde Firebase'e yükleyecek
```

**2. Manuel Kurulum**

**Production (Firebase):**
```bash
firebase functions:config:set gemini.api_keys='["KEY1","KEY2","KEY3","KEY4","KEY5","KEY6"]'
firebase deploy --only functions
```

**Yerel Geliştirme (.env):**
```bash
cd functions
cp .env.example .env
# .env dosyasını açıp GEMINI_API_KEYS değişkenine anahtarlarınızı ekleyin
```

#### Doğrulama

```bash
# Firebase config'i kontrol edin
firebase functions:config:get gemini.api_keys

# Yerel .env'yi test edin
cd functions && firebase emulators:start
```

**📖 Tam Dokümantasyon**: `SETUP-API-KEYS.md` dosyasına bakın

3. **API Anahtarı Rotasyonu**
   - Düzenli olarak API anahtarlarınızı yenileyin
   - Eski anahtarları devre dışı bırakın
   - Birden fazla anahtar kullanarak yük dengeleme yapın

### Firebase Security Rules

Firestore veya Realtime Database kullanıyorsanız, güvenlik kurallarını ayarlayın:

```javascript
// firestore.rules örneği
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### CORS Yapılandırması

Cloud Functions'ta sadece güvenilir originlere izin verin:

```javascript
const cors = require("cors")({
  origin: [
    "https://akilli-eldiven-proje.web.app",
    "http://localhost:5000"
  ]
});
```

## 🐛 Güvenlik Açığı Bildirimi

Bir güvenlik açığı bulduysanız:

1. **HEMEN** proje sahibiyle iletişime geçin
2. Public issue açmayın (güvenlik riski)
3. Açığın detaylarını özel mesajla gönderin

## 📋 Güvenlik Kontrol Listesi

### Geliştirme Öncesi
- [ ] `.env.example` dosyası oluşturulmuş
- [ ] `.gitignore` yapılandırılmış
- [ ] API anahtarları environment variables'a taşınmış

### Deploy Öncesi
- [ ] Tüm hassas veriler temizlenmiş
- [ ] Firebase security rules test edilmiş
- [ ] CORS ayarları doğru yapılandırılmış
- [ ] Rate limiting aktif

### Production'da
- [ ] HTTPS zorunlu
- [ ] API anahtarları düzenli rotate ediliyor
- [ ] Loglar düzenli kontrol ediliyor
- [ ] Firewall kuralları aktif

## 🔒 En İyi Uygulamalar

1. **Minimum Yetki Prensibi**
   - Her servis sadece ihtiyacı olan yetkilere sahip olmalı
   - Geniş kapsamlı Admin yetkilerinden kaçının

2. **Input Validation**
   - Tüm kullanıcı girdilerini doğrulayın
   - SQL injection, XSS gibi saldırılara karşı korunun

3. **Rate Limiting**
   - API'lere rate limit uygulayın
   - DDoS saldırılarına karşı koruma

4. **Monitoring**
   - Anormal aktiviteleri izleyin
   - Firebase Console'dan logs kontrol edin

5. **Düzenli Güncellemeler**
   - Bağımlılıkları güncel tutun
   - `npm audit` düzenli çalıştırın

## 📞 İletişim

Güvenlik ile ilgili sorularınız için: [Proje Sahibi İletişim Bilgileri]

---

Son Güncelleme: 2025-10-17
