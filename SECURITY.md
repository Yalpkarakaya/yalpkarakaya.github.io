# Güvenlik Politikası

## 🔐 Güvenlik Önlemleri

### API Anahtarları

1. **Asla public repository'ye commit etmeyin**
   - API anahtarları `.env` dosyasında tutulmalı
   - `.env` dosyası `.gitignore`'a eklenmiş olmalı
   - Production ortamında Firebase Environment Variables kullanın

2. **Environment Variables Kullanımı**
   ```bash
   # Firebase Console kullanarak
   firebase functions:config:set gemini.api_keys='["key1","key2"]'
   
   # Lokal geliştirme için .env dosyası
   cp .env.example .env
   # Sonra .env dosyasına gerçek anahtarları girin
   ```

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
