import { generateBookConcept } from "./conceptAgent";
import { generateCoverImage } from "./coverAgent";
import { generateProductShots } from "./productAgent";
import { generateSeoContent } from "./seoAgent";
import { getPreviousTitles, saveBook } from "../lib/storage";
import type { Category } from "../categories";
import type { GeneratedBook, GeneratedVisual, GenerationStage } from "../types";

export interface GenerationProgress {
  stage: GenerationStage;
  message: string;
  currentShot?: string;
}

export type ProgressCallback = (progress: GenerationProgress) => void;

export async function generateNewBook(
  category: Category,
  onProgress: ProgressCallback
): Promise<GeneratedBook> {
  const bookId = `book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // STAGE 1: Concept
  onProgress({ stage: "concept", message: "Kitap konsepti oluşturuluyor..." });
  const previousTitles = await getPreviousTitles(category.id);
  const concept = await generateBookConcept(category, previousTitles);
  onProgress({ stage: "concept", message: `✅ Konsept hazır: "${concept.baslik}"` });

  // STAGE 2: Hero Cover (defines character)
  onProgress({ stage: "cover", message: "Kapak tasarlanıyor..." });
  const { imageUrl: heroUrl, prompt: heroPrompt } = await generateCoverImage(category, concept);
  onProgress({ stage: "cover", message: "✅ Kapak hazır — karakter sabitlendi" });

  const heroVisual: GeneratedVisual = {
    id: "hero",
    type: "hero",
    label: "Hero Kapak",
    imageUrl: heroUrl,
    prompt: heroPrompt,
  };

  // STAGE 3: Product Shots (referencing hero for character consistency)
  onProgress({ stage: "products", message: "Ürün fotoğrafları üretiliyor..." });
  const productVisuals = await generateProductShots(
    concept,
    category,
    heroUrl,
    (type, label) => {
      onProgress({
        stage: type === "parent_reading" || type === "reaction" || type === "hook" || type === "infographic" ? "marketing" : "products",
        message: `Üretiliyor: ${label}`,
        currentShot: type,
      });
    }
  );
  onProgress({ stage: "marketing", message: `✅ ${productVisuals.length} görsel tamamlandı` });

  // STAGE 4: SEO Content
  onProgress({ stage: "seo", message: "SEO içeriği üretiliyor..." });
  const seo = await generateSeoContent(concept, category);
  onProgress({ stage: "seo", message: "✅ SEO içeriği hazır" });

  const book: GeneratedBook = {
    id: bookId,
    categoryId: category.id,
    category,
    concept,
    visuals: [heroVisual, ...productVisuals],
    seo,
    createdAt: Date.now(),
    status: "completed",
  };

  // Save to storage
  await saveBook(book);

  onProgress({ stage: "done", message: "🎉 Kitap tamamlandı ve kaydedildi!" });
  return book;
}
