const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({origin: true});

// 🔐 API Anahtarları - SADECE Environment Variables'dan okunur
// Firebase Console > Functions > Configuration
// VEYA yerel geliştirme için .env dosyası
const apiKeys = (() => {
  // Firebase environment config'den oku
  const firebaseConfig = functions.config().gemini?.api_keys;
  if (firebaseConfig) {
    return Array.isArray(firebaseConfig) ? firebaseConfig : [firebaseConfig];
  }
  
  // Yerel geliştirme için process.env'den oku
  if (process.env.GEMINI_API_KEYS) {
    try {
      return JSON.parse(process.env.GEMINI_API_KEYS);
    } catch (error) {
      console.error("Error parsing GEMINI_API_KEYS:", error);
      return [];
    }
  }
  
  // Hiç anahtar yoksa hata fırlat
  console.error("🔴 FATAL: No API keys configured!");
  console.error("Please set API keys using one of these methods:");
  console.error("1. Firebase: firebase functions:config:set gemini.api_keys='[\"key1\",\"key2\"]'");
  console.error("2. Local: Add GEMINI_API_KEYS to .env file");
  return [];
})();

// 2. Anahtar döndürme mantığı da burada. Rastgele seçim yapacağız.
function getNextApiKey() {
  if (apiKeys.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  return apiKeys[randomIndex];
}

exports.geminiProxy = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }
    
    const selectedApiKey = getNextApiKey();
    if (!selectedApiKey) {
        return response.status(500).send("API Keys are not configured in the function.");
    }
    
    const targetUrl = request.body.targetUrl;
    if (!targetUrl || !targetUrl.startsWith("https://generativelanguage.googleapis.com")) {
        return response.status(400).send("Invalid target URL provided.");
    }

    try {
        const geminiResponse = await fetch(`${targetUrl}?key=${selectedApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: request.body.contents,
                systemInstruction: request.body.systemInstruction
            }),
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json();
            return response.status(geminiResponse.status).send(errorBody);
        }

        const responseData = await geminiResponse.json();
        return response.status(200).send(responseData);

    } catch (error) {
        console.error("Proxy Error:", error);
        return response.status(500).send("An error occurred in the proxy function.");
    }
  });
});