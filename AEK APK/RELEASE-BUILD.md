# Android Release Build Talimatları

Bu proje WebView yerine tamamen yerel (Jetpack Compose + Firebase) olarak yeniden yazılmıştır.

## Gerekli Dosya
- `app/google-services.json` (Firebase konsolundan Android uygulaması için indirin)
  - package name: `com.aek.dashboard` (app/build.gradle defaultConfig.applicationId)

## İmzalama Bilgileri
1. Keystore oluşturun (eğer yoksa):
```bash
keytool -genkey -v -keystore aek-release.keystore -alias aek -keyalg RSA -keysize 2048 -validity 3650
```
2. `gradle.properties` (proje kökünde veya `~/.gradle/gradle.properties`):
```
AEK_STORE_FILE=aek-release.keystore
AEK_STORE_PASSWORD=***
AEK_KEY_ALIAS=aek
AEK_KEY_PASSWORD=***
```
3. `app/build.gradle` içine `signingConfigs` ve `release`e ekleyin (gerekirse):
```
android {
  signingConfigs {
    release {
      storeFile file(System.getenv('AEK_STORE_FILE') ?: project.property('AEK_STORE_FILE'))
      storePassword System.getenv('AEK_STORE_PASSWORD') ?: project.property('AEK_STORE_PASSWORD')
      keyAlias System.getenv('AEK_KEY_ALIAS') ?: project.property('AEK_KEY_ALIAS')
      keyPassword System.getenv('AEK_KEY_PASSWORD') ?: project.property('AEK_KEY_PASSWORD')
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      shrinkResources true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

## Derleme
```bash
./gradlew :app:assembleRelease
```
Çıktı: `app/build/outputs/apk/release/app-release.apk`

## Firebase
- `AEKApp` içinde manuel `FirebaseOptions` ile yapılandırma yapılmıştır; `google-services.json` eklerseniz otomatiğe geçer.
- RTDB yol eşleşmesi: `publicContent/*` (web ile birebir).
- Offline:
  - RTDB `setPersistenceEnabled(true)` etkin.
  - Firestore KTX varsayılan offline etkin.

## İzinler ve Ağ
- `INTERNET`, `ACCESS_NETWORK_STATE` manifestte var.
- `res/xml/network_security_config.xml` mevcut.

## Notlar
- UI: Dashboard, Yol Haritası, temel ekranlar Compose ile yeniden oluşturuldu.
- Donut chart yerel Canvas ile 60fps hedeflenerek çiziliyor.
