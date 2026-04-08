import { GoogleGenAI, Type } from "@google/genai";

let apiKey = localStorage.getItem("gemini_api_key") || "";

export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem("gemini_api_key", key);
};

export const getApiKey = () => apiKey;

const ANALYSIS_MODEL = "gemini-3.1-pro-preview";
const IMAGE_GEN_MODEL = "gemini-3.1-flash-image-preview";

const getClient = () => {
  if (!apiKey) throw new Error("API anahtarı ayarlanmadı. Ayarlardan API key girin.");
  return new GoogleGenAI({ apiKey });
};

export { ANALYSIS_MODEL, IMAGE_GEN_MODEL, getClient, Type };

async function _withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try { return await fn(); }
    catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      const isRetryable = msg.includes("503") || msg.includes("UNAVAILABLE") ||
                          msg.includes("high demand") || msg.includes("429") ||
                          msg.includes("RESOURCE_EXHAUSTED");
      if (!isRetryable || i === maxRetries) throw err;
      await new Promise(r => setTimeout(r, Math.min(2000 * Math.pow(2, i), 15000)));
    }
  }
  throw lastError;
}

export async function generateText(
  prompt: string,
  responseSchema?: object
): Promise<string> {
  return _withRetry(async () => {
    const ai = getClient();
    const config: any = {};
    if (responseSchema) {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }
    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config,
    });
    return response.text || "";
  });
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || String(err);
      const isRetryable = msg.includes("503") || msg.includes("UNAVAILABLE") ||
                          msg.includes("high demand") || msg.includes("429") ||
                          msg.includes("RESOURCE_EXHAUSTED") || msg.includes("deadline");
      if (!isRetryable || i === maxRetries) throw err;
      const delay = Math.min(2000 * Math.pow(2, i), 15000);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

export async function generateImage(
  prompt: string,
  referenceImages: string[] = [],
  aspectRatio: string = "2:3"
): Promise<string> {
  return withRetry(async () => {
    const ai = getClient();

    const parts: any[] = [];

    // Reference images FIRST for consistency
    for (const b64 of referenceImages) {
      const matches = b64.match(/^data:([^;]*);base64,(.+)$/);
      if (matches) {
        parts.push({ inlineData: { mimeType: matches[1] || "image/jpeg", data: matches[2] } });
      } else {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: b64 } });
      }
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: IMAGE_GEN_MODEL,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: "2K",
        },
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData
    );
    if (!imagePart?.inlineData) throw new Error("Görsel oluşturulamadı");
    return `data:image/png;base64,${imagePart.inlineData.data}`;
  });
}
