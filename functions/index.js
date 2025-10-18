const functions = require("firebase-functions");

// Cloud Functions çalışma zamanlarında (Node >=18) fetch globaldir, ek paket gerekmez.

// Ortam değişkenleri
// - GEMINI_API_KEYS: Virgülle ayrılmış API anahtarları
// - ALLOWED_ORIGINS: Virgülle ayrılmış izinli origin listesi
const API_KEYS = (process.env.GEMINI_API_KEYS || "").split(",").map(s => s.trim()).filter(Boolean);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "https://akillieldiven.web.app,https://akillieldiven.firebaseapp.com,http://localhost:4000,http://127.0.0.1:4000")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)] || null;
}

// Basit IP-bazlı hız sınırlama (in-memory, düşük ölçekli kullanım için)
const recentCallsByIp = new Map();
const RATE_LIMIT_MS = 1000; // aynı IP için 1 sn arayla

exports.geminiProxy = functions.https.onRequest(async (request, response) => {
  const origin = request.headers.origin;
  response.setHeader("Vary", "Origin");

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  }
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (request.method === "OPTIONS") {
    return response.status(204).send("");
  }

  if (request.method !== "POST") {
    return response.status(405).send("Method Not Allowed");
  }

  // Orijin kontrolü
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return response.status(403).send("CORS: Origin not allowed");
  }

  // Rate limit
  const ip = request.headers["x-forwarded-for"]?.split(",")[0]?.trim() || request.ip || "unknown";
  const now = Date.now();
  const last = recentCallsByIp.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    return response.status(429).send("Too Many Requests");
  }
  recentCallsByIp.set(ip, now);

  const targetUrl = request.body?.targetUrl;
  const contents = request.body?.contents;
  const systemInstruction = request.body?.systemInstruction;

  if (!targetUrl || typeof targetUrl !== "string" || !targetUrl.startsWith("https://generativelanguage.googleapis.com")) {
    return response.status(400).send("Invalid target URL provided.");
  }

  if (!Array.isArray(contents)) {
    return response.status(400).send("'contents' must be an array");
  }

  const apiKey = pickRandom(API_KEYS);
  if (!apiKey) {
    return response.status(500).send("API keys are not configured.");
  }

  try {
    const geminiResponse = await fetch(`${targetUrl}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, systemInstruction })
    });

    const textBody = await geminiResponse.text();

    if (!geminiResponse.ok) {
      try {
        return response.status(geminiResponse.status).send(JSON.parse(textBody));
      } catch (_) {
        return response.status(geminiResponse.status).send({ error: { message: textBody } });
      }
    }

    try {
      return response.status(200).send(JSON.parse(textBody));
    } catch (_) {
      // Beklenmedik düz metin dönerse
      return response.status(200).send({ text: textBody });
    }
  } catch (error) {
    console.error("Proxy Error:", error);
    return response.status(500).send("An error occurred in the proxy function.");
  }
});