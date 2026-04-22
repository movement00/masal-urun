// KIE.ai browser client — fallback when Gemini hits rate limit.
// API key is read from localStorage('kie_api_key').
//
// Interface mirrors geminiClient.generateImage:
//   generateImage(prompt, referenceImages: string[] (URLs or data URLs), aspectRatio: string)
//   → returns Promise<string> (data URL of generated PNG)

const KIE_API_BASE = "https://api.kie.ai";
const KIE_UPLOAD_BASE = "https://kieai.redpandaai.co";
const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 240000; // 4 minutes

function getApiKey(): string {
  const k = localStorage.getItem("kie_api_key");
  if (!k) throw new Error("KIE API key missing — set localStorage.kie_api_key");
  return k;
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    "Content-Type": "application/json",
  };
}

async function uploadDataUrlToKie(dataUrl: string): Promise<string> {
  const fileName = `urunstudio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.png`;
  const r = await fetch(`${KIE_UPLOAD_BASE}/api/file-base64-upload`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ base64Data: dataUrl, uploadPath: "urunstudio/refs", fileName }),
  });
  const d: any = await r.json();
  if (!d.success && d.code !== 200) throw new Error(`KIE upload failed: ${d.msg || JSON.stringify(d)}`);
  const url = d.data?.downloadUrl;
  if (!url) throw new Error("KIE upload: no downloadUrl in response");
  return url;
}

async function ensureHttpUrl(ref: string): Promise<string> {
  if (ref.startsWith("http")) return ref;
  if (ref.startsWith("data:image")) return uploadDataUrlToKie(ref);
  throw new Error("Unknown reference image format: " + ref.slice(0, 40));
}

async function createTask(prompt: string, imageUrls: string[], aspectRatio: string): Promise<string> {
  // nano-banana-2 supports aspect_ratio + resolution; fall back to edit model when refs present
  const useEdit = imageUrls.length > 0;
  const body: any = useEdit
    ? {
        model: "google/nano-banana-edit",
        input: { prompt, image_urls: imageUrls.slice(0, 8) },
      }
    : {
        model: "nano-banana-2",
        input: { prompt, aspect_ratio: aspectRatio || "2:3", resolution: "2K", output_format: "png" },
      };

  const r = await fetch(`${KIE_API_BASE}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const d: any = await r.json();
  if (d.code !== 200) throw new Error(`KIE createTask failed: ${d.msg || JSON.stringify(d)}`);
  return d.data.taskId as string;
}

async function pollTask(taskId: string): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < POLL_TIMEOUT_MS) {
    const r = await fetch(`${KIE_API_BASE}/api/v1/jobs/recordInfo?taskId=${taskId}`, {
      headers: authHeaders(),
    });
    const d: any = await r.json();
    const state = d.data?.state;
    if (state === "success") {
      const result = JSON.parse(d.data.resultJson);
      const url = result.resultUrls?.[0];
      if (!url) throw new Error("KIE: no resultUrl");
      return url as string;
    }
    if (state === "fail") throw new Error(`KIE generation failed: ${d.data?.failMsg || "unknown"}`);
    await new Promise((res) => setTimeout(res, POLL_INTERVAL_MS));
  }
  throw new Error("KIE polling timeout");
}

async function urlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function kieGenerateImage(
  prompt: string,
  referenceImages: string[] = [],
  aspectRatio: string = "2:3"
): Promise<string> {
  // Convert data URL refs to KIE-hosted HTTPS URLs (HTTP refs pass through)
  const httpRefs: string[] = [];
  for (const ref of referenceImages) {
    httpRefs.push(await ensureHttpUrl(ref));
  }
  const taskId = await createTask(prompt, httpRefs, aspectRatio);
  const resultUrl = await pollTask(taskId);
  return await urlToDataUrl(resultUrl);
}
