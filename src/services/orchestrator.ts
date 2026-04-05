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
  newVisual?: GeneratedVisual;
  concept?: import("../types").BookConcept;
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
  onProgress({ stage: "concept", message: `✅ Konsept hazır: "${concept.baslik}"`, concept });

  // STAGE 2: Hero Cover (defines character)
  onProgress({ stage: "cover", message: "Kapak tasarlanıyor..." });
  const { imageUrl: heroUrl, prompt: heroPrompt } = await generateCoverImage(category, concept);

  const heroVisual: GeneratedVisual = {
    id: "hero",
    type: "hero",
    label: "Hero Kapak",
    imageUrl: heroUrl,
    prompt: heroPrompt,
  };
  onProgress({ stage: "cover", message: "✅ Kapak hazır — karakter sabitlendi", newVisual: heroVisual });

  // STAGE 3: Product Shots (referencing hero for character consistency)
  onProgress({ stage: "products", message: "Ürün fotoğrafları üretiliyor..." });
  const productVisuals = await generateProductShots(
    concept,
    category,
    heroUrl,
    (visual) => {
      onProgress({
        stage: visual.type === "parent_reading" || visual.type === "reaction" || visual.type === "hook" || visual.type === "infographic" ? "marketing" : "products",
        message: `✅ ${visual.label} hazır`,
        currentShot: visual.type,
        newVisual: visual,
      });
    }
  );
  onProgress({ stage: "marketing", message: `✅ ${productVisuals.length + 1} görsel tamamlandı` });

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
