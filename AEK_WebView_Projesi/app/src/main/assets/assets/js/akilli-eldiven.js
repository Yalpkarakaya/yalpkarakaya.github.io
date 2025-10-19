// -------------------------------------------------------------------
// KRİTİK BAŞLATMA KODU
// 'Service database is not available' hatasını çözmek için
// Bu kod, HTML'de yüklenen Firebase CDN 'compat' scriptlerini kullanır.
// -------------------------------------------------------------------

// !!! KULLANICI EYLEMİ GEREKLİ !!!
// Bu yapılandırma nesnesini KENDİ Firebase proje bilgilerinizle doldurun.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Firebase'i başlat
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Auth ve Database servislerini GLOBAL olarak kullanılabilir hale getir
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const database = typeof firebase !== 'undefined' ? firebase.database() : null;

// -------------------------------------------------------------------
// KULLANICININ MEVCUT akilli-eldiven.js KODU BURADAN BAŞLAR
// -------------------------------------------------------------------
// Örnek:
// document.addEventListener('DOMContentLoaded', () => {
//   if (window.renderMathInElement) {
//     renderMathInElement(document.body, {});
//   }
//   if (database) {
//     const someRef = database.ref('path/to/data');
//     someRef.on('value', (snapshot) => {
//       const data = snapshot.val();
//       console.log(data);
//     });
//   }
// });
