# ⚠️ KRİTİK GÜVENLİK UYARISI - API ANAHTARLARI

## 🔴 ACIL DURUM: Frontend'de API Anahtarları Tespit Edildi!

**Dosya**: `assets/js/akilli-eldiven.js`  
**Satırlar**: 389-397, 1921  
**Durum**: 🔴 KRİTİK GÜVENLİK AÇIĞI

---

## 📍 Tespit Edilen Sorunlar

### 1. Base64 Encoded Gemini API Keys (Satır 389-397)

```javascript
// ❌ KRİTİK GÜVENLİK AÇIĞI!
const apiKeysEncoded = [
    'QUl6YVN5QUdRX281LXA0bTFPRWFXWVJId2pRWjMwb09wS1JyQXc4',
    'QUl6YVN5Qm1YOWhUMUhRNGlEOHU4ZnVlSG95TEZFdUJrSTVnWS1j',
    'QUl6YVN5RGpaMk1ock1WNXdzWG8tRmgtRnI3VjNzTy1SMkFBd0FN',
    'QUl6YVN5RE1JMWtGYVpPRDE1TmRhdldDQm0yT19vQkZOQ1dBUzVj',
    'QUl6YVN5RGNfYVMybjk3eUFPWFJGeEJaLVc1b0xNOVFSNWQzeWNv',
    'QUl6YVN5RHphTlFlU1ljUk1qZmlOYnhGa3AzU1Q3bFRxVEJMWEg4',
];
```

**Sorun**: Base64 encoding GÜVENLİK SAĞLAMAZ! Bu anahtarlar herkes tarafından decode edilebilir:

```bash
echo "QUl6YVN5QUdRX281LXA0bTFPRWFXWVJId2pRWjMwb09wS1JyQXc4" | base64 -d
# Çıktı: AIzaSyAGQ_o5-p4m1OEaWYRHwjQZ30oOpKRrAw8
```

### 2. Frontend'den Direkt API Çağrısı (Satır 1916-1963)

```javascript
// ❌ Güvensiz: Frontend direkt Gemini API'yi çağırıyor
const finalUrl = `${modelUrl}?key=${apiKey}`;
const response = await fetch(finalUrl, {...});
```

**Sorun**: API anahtarları browser'da görünür ve herkes kullanabilir!

### 3. Firebase Web API Key (Satır 372)

```javascript
apiKey: "AIzaSyBRcjPzkljNjXVRM1jn_KGCheXhQY54fcs"
```

**Not**: Bu Firebase Web API key'i, Gemini'den farklı. Public olabilir AMA:
- Firebase Console'dan domain restrictions eklenmelidir
- Firebase Security Rules aktif olmalıdır

---

## 🎯 GÜVENLİK RİSKLERİ

### Yüksek Riskli

1. **API Kötüye Kullanımı**: Herkes bu anahtarları kullanabilir
2. **Maliyet Patlaması**: Limitsi API çağrıları → Binlerce dolar fatura
3. **Quota Tükenmesi**: Anahtarlar hızla limit dolabilir
4. **Data Breach**: Hassas veriler sızdırılabilir

### Orta Riskli

5. **Firebase Config Kötüye Kullanımı**: Domain restrictions yoksa riskli
6. **Rate Limiting Bypass**: 6 anahtar rotasyonu ile limitler aşılabilir

---

## ✅ ÇÖZÜM: Firebase Functions Proxy Kullanımı

### Mimari Değişiklik

**ÖNCE** (Güvensiz):
```
Browser → Gemini API (direkt)
         ↑ API key açıkta
```

**SONRA** (Güvenli):
```
Browser → Firebase Functions → Gemini API
                ↑ API key güvende
```

### Uygulama Adımları

#### 1. Firebase Functions Güncelleme (✅ Tamamlandı)

```javascript
// functions/index.js - ZATEN GÜVENLİ!
exports.geminiProxy = functions.https.onRequest((request, response) => {
  // API anahtarları environment variables'da
  const apiKeys = functions.config().gemini?.api_keys;
  // Güvenli proxy işlemi
});
```

#### 2. Frontend Güncelleme (❌ GEREKLİ!)

**Kaldırılacak Kod**:
```javascript
// ❌ SİL
const apiKeysEncoded = [...];
function getNextApiKeyAndDecode() {...}
```

**Eklenecek Kod**:
```javascript
// ✅ EKLE
const FUNCTIONS_URL = 'https://us-central1-akillieldiven.cloudfunctions.net';

async function callGemini(history, systemInstruction, modelUrl) {
    const response = await fetch(`${FUNCTIONS_URL}/geminiProxy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            targetUrl: modelUrl,
            contents: history,
            systemInstruction: systemInstruction
        })
    });
    return await response.json();
}
```

---

## ⚡ HEMEN YAPILMASI GEREKENLER

### 1. Mevcut Anahtarları İptal Et (5 dakika)

```bash
# Google Cloud Console'a git
# https://console.cloud.google.com/apis/credentials

# Her 6 anahtar için:
1. API Keys bölümüne git
2. İlgili anahtarı bul (AIzaSyAGQ... ile başlayan)
3. "Delete" veya "Disable" tıkla
4. Onayla
```

### 2. Yeni Anahtarlar Oluştur (10 dakika)

```bash
# Google Cloud Console
1. "Create Credentials" > "API Key"
2. Restrictions ekle:
   - Application restrictions: None (Functions'tan erişecek)
   - API restrictions: Generative Language API
3. 6 yeni anahtar oluştur
```

### 3. Firebase Functions'a Yükle (2 dakika)

```bash
./setup-firebase-keys.sh
# Yeni anahtarları gir

firebase deploy --only functions
```

### 4. Frontend'i Güncelle (30 dakika)

```bash
# assets/js/akilli-eldiven.js dosyasını düzenle
# apiKeysEncoded array'ini sil
# callGemini fonksiyonunu Firebase Functions'a yönlendir
# Test et
# Deploy et
```

---

## 📊 Güvenlik Durumu

| Bileşen | Durum | Risk Seviyesi |
|---------|-------|---------------|
| **Backend (functions/)** | ✅ Güvenli | 🟢 Düşük |
| **Frontend (assets/js/)** | ❌ Açık | 🔴 Yüksek |
| **Firebase Config** | ⚠️ Kısıtlı değil | 🟡 Orta |
| **Git History** | ⚠️ Anahtarlar var | 🟡 Orta |

---

## 🎓 Öğrenilen Dersler

### ❌ Yapılmaması Gerekenler

1. API anahtarlarını frontend kodunda saklama
2. Base64 encoding ile "güvenlik" sağlamaya çalışma
3. Browser'dan direkt 3rd party API çağrısı
4. Git history'de hassas veri bırakma

### ✅ Yapılması Gerekenler

1. API anahtarlarını backend'de tut
2. Frontend → Backend → 3rd Party API mimarisi
3. Firebase Functions gibi serverless çözümler
4. Environment variables kullan
5. API key restrictions ekle
6. Rate limiting uygula
7. Monitoring ve alerting kur

---

## 📞 Acil Durum Kontakları

**Bu dosya tespit edildiğinde**:
- ✅ functions/index.js - Zaten güvenli
- ❌ assets/js/akilli-eldiven.js - Acil düzeltme gerekli
- ⚠️ Firebase config - Domain restrictions ekle

**Öncelik Sırası**:
1. 🔴 Mevcut API anahtarlarını İPTAL ET
2. 🔴 Yeni anahtarlar oluştur ve Functions'a yükle
3. 🟡 Frontend'i güncelle ve deploy et
4. 🟡 Firebase Console'dan restrictions ekle
5. 🟢 Git history'yi temizle (opsiyonel)

---

**Son Güncelleme**: 2025-10-17  
**Durum**: 🔴 ACIL MÜDAHALE GEREKLİ

---

## 🛠️ Hızlı Fix Scripti

```bash
#!/bin/bash
# quick-security-fix.sh

echo "🔴 ACİL GÜVENLİK FİX BAŞLATILIYOR..."

# 1. Yeni anahtarlar oluştur (manuel)
echo "1️⃣  Google Cloud Console'dan 6 yeni API key oluştur"
echo "    https://console.cloud.google.com/apis/credentials"
read -p "Devam etmek için ENTER'a bas..."

# 2. Firebase'e yükle
echo "2️⃣  Yeni anahtarları Firebase'e yüklüyoruz..."
./setup-firebase-keys.sh

# 3. Deploy
echo "3️⃣  Functions deploy ediliyor..."
firebase deploy --only functions

# 4. Eski anahtarları iptal et
echo "4️⃣  ESKİ ANAHTARLARI İPTAL ET:"
echo "    - AIzaSyAGQ_o5-p4m1OEaWYRHwjQZ30oOpKRrAw8"
echo "    - AIzaSyBmX9hT1HQ4iD8u8fueHoyLFEuBkI5gY-c"
echo "    - AIzaSyDjZ2MhrMV5wsXo-Fh-Fr7V3sO-R2AAwAM"
echo "    - AIzaSyDMI1kFaZOD15NdavWCBm2O_oBFNCWAS5c"
echo "    - AIzaSyDc_aS2n97yAOXRFxBZ-W5oLM9QR5d3yco"
echo "    - AIzaSyDzaNQeSYcRMjfiNbxFkp3ST7lTqTBLXH8"

echo ""
echo "✅ Backend güvenli! Frontend güncelleme devam ediyor..."
```

---

Bu doküman **ASLA** git'e commit edilmemelidir!
