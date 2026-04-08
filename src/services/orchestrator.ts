import { generateBookConcept, generateBookConceptFromPrompt } from "./conceptAgent";
import { generateCharacterReferences } from "./characterReferenceAgent";
import { generateCoverImage, generateBackCover } from "./coverAgent";
import { generateHookVisual, generateConversionVisual } from "./hookAgent";
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

/**
 * 5-visual pipeline — all 3D Pixar style:
 * 1. Character portrait (3D Pixar reference — "DNA" of all visuals)
 * 2. Front cover (3D Pixar book cover)
 * 3. Back cover (matching front cover style)
 * 4. Hook lifestyle (child reading book in natural Turkish setting, Pixar style)
 * 5. Conversion visual (magical marketing image, Pixar style)
 */
async function runPipeline(
  concept: import("../types").BookConcept,
  category: Category,
  onProgress: ProgressCallback
): Promise<GeneratedBook> {
  const bookId = `book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // STAGE 1: 3D Pixar character portrait (reference for all other visuals)
  onProgress({ stage: "character", message: "3D Pixar karakter portresi üretiliyor..." });
  const { characterPortrait } = await generateCharacterReferences(concept);
  const characterVisual: GeneratedVisual = {
    id: "character_portrait", type: "character_portrait", label: "Karakter Portresi (3D Pixar)",
    imageUrl: characterPortrait, prompt: "(Pixar character reference)",
  };
  onProgress({ stage: "character", message: "✅ Karakter portresi hazır", newVisual: characterVisual });

  // STAGE 2: Front cover (uses character portrait for face reference)
  onProgress({ stage: "covers", message: "Ön kapak tasarlanıyor..." });
  const { imageUrl: frontUrl, prompt: frontPrompt } = await generateCoverImage(category, concept, characterPortrait);
  const frontCoverVisual: GeneratedVisual = {
    id: "front_cover", type: "front_cover", label: "Ön Kapak",
    imageUrl: frontUrl, prompt: frontPrompt,
  };
  onProgress({ stage: "covers", message: "✅ Ön kapak hazır", newVisual: frontCoverVisual });

  // STAGE 3: Back cover (uses both character portrait + front cover for consistency)
  onProgress({ stage: "covers", message: "Arka kapak tasarlanıyor..." });
  const { imageUrl: backUrl, prompt: backPrompt } = await generateBackCover(concept, frontUrl, characterPortrait);
  const backCoverVisual: GeneratedVisual = {
    id: "back_cover", type: "back_cover", label: "Arka Kapak",
    imageUrl: backUrl, prompt: backPrompt,
  };
  onProgress({ stage: "covers", message: "✅ Arka kapak hazır", newVisual: backCoverVisual });

  // STAGE 4: Hook lifestyle (child reading book in natural setting, Pixar style)
  onProgress({ stage: "hook", message: "Hook görseli üretiliyor..." });
  const hookResult = await generateHookVisual(concept, characterPortrait, frontUrl);
  const hookVisual: GeneratedVisual = {
    id: "hook_lifestyle", type: "hook_lifestyle", label: `Hook: ${hookResult.label}`,
    imageUrl: hookResult.imageUrl, prompt: hookResult.prompt,
  };
  onProgress({ stage: "hook", message: `✅ ${hookResult.label} hazır`, newVisual: hookVisual });

  // STAGE 5: Conversion visual (magical marketing image)
  onProgress({ stage: "conversion", message: "Dönüşüm görseli üretiliyor..." });
  const convResult = await generateConversionVisual(concept, characterPortrait, frontUrl);
  const convVisual: GeneratedVisual = {
    id: "conversion", type: "conversion", label: "Dönüşüm: Kitabın Büyüsü",
    imageUrl: convResult.imageUrl, prompt: convResult.prompt,
  };
  onProgress({ stage: "conversion", message: "✅ Dönüşüm görseli hazır", newVisual: convVisual });

  // STAGE 6: SEO Content
  onProgress({ stage: "seo", message: "SEO içeriği üretiliyor..." });
  const seo = await generateSeoContent(concept, category);
  onProgress({ stage: "seo", message: "✅ SEO içeriği hazır" });

  const book: GeneratedBook = {
    id: bookId,
    categoryId: category.id,
    category,
    concept,
    visuals: [characterVisual, frontCoverVisual, backCoverVisual, hookVisual, convVisual],
    seo,
    createdAt: Date.now(),
    status: "completed",
  };

  await saveBook(book);
  onProgress({ stage: "done", message: "🎉 5 görsel + SEO tamamlandı!" });
  return book;
}

// ═══ Category-based generation ═══
export async function generateNewBook(
  category: Category,
  onProgress: ProgressCallback
): Promise<GeneratedBook> {
  onProgress({ stage: "concept", message: "Kitap konsepti oluşturuluyor..." });
  const previousTitles = await getPreviousTitles(category.id);
  const concept = await generateBookConcept(category, previousTitles);
  onProgress({ stage: "concept", message: `✅ Konsept hazır: "${concept.baslik}"`, concept });

  return runPipeline(concept, category, onProgress);
}

// ═══ Custom prompt generation ═══
const CUSTOM_CATEGORY: Category = {
  id: "custom",
  group: "hikaye",
  groupLabel: "Özel İstek",
  name: "Özel Hikaye",
  description: "Kullanıcı isteğinden üretilen kişiye özel kitap",
  ageRange: "3-10",
  visualStyle: "pixar-3d",
  emoji: "✨",
  moodKeywords: ["özel", "kişisel", "benzersiz"],
};

export async function generateNewBookFromPrompt(
  userPrompt: string,
  onProgress: ProgressCallback
): Promise<GeneratedBook> {
  onProgress({ stage: "concept", message: "İsteğinden konsept oluşturuluyor..." });
  const concept = await generateBookConceptFromPrompt(userPrompt);
  onProgress({ stage: "concept", message: `✅ Konsept hazır: "${concept.baslik}"`, concept });

  return runPipeline(concept, CUSTOM_CATEGORY, onProgress);
}
