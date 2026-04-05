import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY not set");
}

const ANALYSIS_MODEL = "gemini-3.1-pro-preview";
const IMAGE_GEN_MODEL = "gemini-3.1-flash-image-preview";

const getClient = () => new GoogleGenAI({ apiKey });

export { ANALYSIS_MODEL, IMAGE_GEN_MODEL, getClient, Type };

export async function generateText(
  prompt: string,
  responseSchema?: object
): Promise<string> {
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
}

export async function generateImage(
  prompt: string,
  referenceImages: string[] = [],
  aspectRatio: string = "2:3"
): Promise<string> {
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
}
