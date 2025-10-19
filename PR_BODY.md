## Summary
- Scaffold a clean Android Studio project `AEK_WebView_Projesi` (Gradle Kotlin DSL)
- `MainActivity` hosts a WebView loading `site.html` from assets
- All vendor libs moved to CDN: Chart.js, ChartDataLabels, KaTeX, Inter font
- Firebase compat SDKs loaded from CDN and initialized in `assets/js/akilli-eldiven.js`
- Placeholders for `tailwind.generated.css` and `akilli-eldiven.css`
- Copied `favicon.ico` and `manifest.json` into assets

## Why
- Eliminates 404/MIME issues from missing local `vendor/` assets
- Ensures `renderMathInElement` and Firebase Database work reliably
- Keeps `assets/` minimal and easy to maintain

## Test plan
- Open project in Android Studio
- Build APK and install on device/emulator with internet access
- Verify dashboard loads; KaTeX renders; charts display; no console 404/MIME
- Set Firebase config in `assets/js/akilli-eldiven.js` and verify database reads
