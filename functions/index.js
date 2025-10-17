const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors")({origin: true});

// ⚠️ GÜVENLİK UYARISI: API anahtarlarını environment variables'a taşıyın!
// Firebase Console > Functions > Configuration > Environment variables
// Örnek kullanım: process.env.GEMINI_API_KEYS (JSON string olarak)
// 
// Şimdilik geçici olarak burada, ancak MUTLAKA değiştirin!
// Bu anahtarlar public repository'de SAKLANMAMALI!
const apiKeys = process.env.GEMINI_API_KEYS 
  ? JSON.parse(process.env.GEMINI_API_KEYS)
  : [
      // ⚠️ UYARI: Bu anahtarları GİZLİ tutun ve .env kullanın!
      'AIzaSyAGQ_o5-p4m1OEaWYRHwjQZ30oOpKRrAw8',
      'AIzaSyBmX9hT1HQ4iD8u8fueHoyLFEuBkI5gY-c',
      'AIzaSyDjZ2MhrMV5wsXo-Fh-Fr7V3sO-R2AAwAM',
      'AIzaSyDMI1kFaZOD15NdavWCBm2O_oBFNCWAS5c',
      'AIzaSyDc_aS2n97yAOXRFxBZ-W5oLM9QR5d3yco',
      'AIzaSyDzaNQeSYcRMjfiNbxFkp3ST7lTqTBLXH8',
    ];

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