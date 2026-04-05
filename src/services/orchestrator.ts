import { generateBookConcept, generateBookConceptFromPrompt } from "./conceptAgent";
import { generateCharacterReferences } from "./characterReferenceAgent";
import { generateCoverImage } from "./coverAgent";
import { generateEmotionalMoments } from "./emotionalMomentsAgent";
import { generateProductShowcase } from "./productShowcaseAgent";
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

  // STAGE 2: Character References (2 iPhone-style real photos — locks character identity)
  onProgress({ stage: "char_refs", message: "Karakter referans fotoğrafları üretiliyor..." });
  const characterRefs = await generateCharacterReferences(concept);

  const refPortraitVisual: GeneratedVisual = {
    id: "ref_portrait",
    type: "ref_portrait",
    label: "Karakter Ref — Portre",
    imageUrl: characterRefs.refPortrait,
    prompt: "(iPhone-style close-up portrait reference)",
  };
  const refFullBodyVisual: GeneratedVisual = {
    id: "ref_fullbody",
    type: "ref_fullbody",
    label: "Karakter Ref — Tam Boy",
    imageUrl: characterRefs.refFullBody,
    prompt: "(iPhone-style full-body reference)",
  };
  onProgress({ stage: "char_refs", message: "✅ Portre hazır", newVisual: refPortraitVisual });
  onProgress({ stage: "char_refs", message: "✅ Tam boy hazır — karakter sabitlendi", newVisual: refFullBodyVisual });

  // STAGE 3: Hero Cover (uses refs for face consistency + badge)
  onProgress({ stage: "cover", message: "Kapak tasarlanıyor..." });
  const { imageUrl: heroUrl, prompt: heroPrompt } = await generateCoverImage(category, concept, characterRefs);

  const heroVisual: GeneratedVisual = {
    id: "hero",
    type: "hero",
    label: "Hero Kapak",
    imageUrl: heroUrl,
    prompt: heroPrompt,
  };
  onProgress({ stage: "cover", message: "✅ Kapak hazır", newVisual: heroVisual });

  // STAGE 4: Product Showcase (shots of the physical book using cover)
  onProgress({ stage: "products", message: "Ürün fotoğrafları üretiliyor..." });
  const productVisuals = await generateProductShowcase(
    concept,
    heroUrl,
    (visual) => {
      onProgress({
        stage: "products",
        message: `✅ ${visual.label}`,
        currentShot: visual.type,
        newVisual: visual,
      });
    }
  );

  // STAGE 5: Emotional Moments (life scenes with child + book, using refs + cover)
  onProgress({ stage: "emotional", message: "Duygusal anlar üretiliyor..." });
  const emotionalVisuals = await generateEmotionalMoments(
    concept,
    characterRefs,
    heroUrl,
    (visual) => {
      onProgress({
        stage: "emotional",
        message: `✅ ${visual.label}`,
        currentShot: visual.type,
        newVisual: visual,
      });
    }
  );

  // STAGE 6: SEO Content
  onProgress({ stage: "seo", message: "SEO içeriği üretiliyor..." });
  const seo = await generateSeoContent(concept, category);
  onProgress({ stage: "seo", message: "✅ SEO içeriği hazır" });

  const book: GeneratedBook = {
    id: bookId,
    categoryId: category.id,
    category,
    concept,
    visuals: [
      refPortraitVisual,
      refFullBodyVisual,
      heroVisual,
      ...productVisuals,
      ...emotionalVisuals,
    ],
    seo,
    createdAt: Date.now(),
    status: "completed",
  };

  // Save to storage
  await saveBook(book);

  onProgress({ stage: "done", message: "🎉 Kitap tamamlandı ve kaydedildi!" });
  return book;
}

// Synthetic "custom" category for user-prompt-driven books
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

/**
 * Generate a book from a free-text user prompt.
 * e.g. userPrompt = "Reha Fenerbahçe Kaptanı" → full book.
 */
export async function generateNewBookFromPrompt(
  userPrompt: string,
  onProgress: ProgressCallback
): Promise<GeneratedBook> {
  const bookId = `book-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // STAGE 1: Concept from user prompt
  onProgress({ stage: "concept", message: "İsteğinden kitap konsepti oluşturuluyor..." });
  const concept = await generateBookConceptFromPrompt(userPrompt);
  onProgress({ stage: "concept", message: `✅ Konsept hazır: "${concept.baslik}"`, concept });

  // STAGE 2: Character References
  onProgress({ stage: "char_refs", message: "Karakter referans fotoğrafları üretiliyor..." });
  const characterRefs = await generateCharacterReferences(concept);

  const refPortraitVisual: GeneratedVisual = {
    id: "ref_portrait", type: "ref_portrait", label: "Karakter Ref — Portre",
    imageUrl: characterRefs.refPortrait, prompt: "(iPhone-style close-up portrait reference)",
  };
  const refFullBodyVisual: GeneratedVisual = {
    id: "ref_fullbody", type: "ref_fullbody", label: "Karakter Ref — Tam Boy",
    imageUrl: characterRefs.refFullBody, prompt: "(iPhone-style full-body reference)",
  };
  onProgress({ stage: "char_refs", message: "✅ Portre hazır", newVisual: refPortraitVisual });
  onProgress({ stage: "char_refs", message: "✅ Tam boy hazır — karakter sabitlendi", newVisual: refFullBodyVisual });

  // STAGE 3: Hero Cover
  onProgress({ stage: "cover", message: "Kapak tasarlanıyor..." });
  const { imageUrl: heroUrl, prompt: heroPrompt } = await generateCoverImage(CUSTOM_CATEGORY, concept, characterRefs);

  const heroVisual: GeneratedVisual = {
    id: "hero", type: "hero", label: "Hero Kapak", imageUrl: heroUrl, prompt: heroPrompt,
  };
  onProgress({ stage: "cover", message: "✅ Kapak hazır", newVisual: heroVisual });

  // STAGE 4: Product Showcase
  onProgress({ stage: "products", message: "Ürün fotoğrafları üretiliyor..." });
  const productVisuals = await generateProductShowcase(concept, heroUrl, (visual) => {
    onProgress({ stage: "products", message: `✅ ${visual.label}`, currentShot: visual.type, newVisual: visual });
  });

  // STAGE 5: Emotional Moments
  onProgress({ stage: "emotional", message: "Duygusal anlar üretiliyor..." });
  const emotionalVisuals = await generateEmotionalMoments(concept, characterRefs, heroUrl, (visual) => {
    onProgress({ stage: "emotional", message: `✅ ${visual.label}`, currentShot: visual.type, newVisual: visual });
  });

  // STAGE 6: SEO Content
  onProgress({ stage: "seo", message: "SEO içeriği üretiliyor..." });
  const seo = await generateSeoContent(concept, CUSTOM_CATEGORY);
  onProgress({ stage: "seo", message: "✅ SEO içeriği hazır" });

  const book: GeneratedBook = {
    id: bookId,
    categoryId: "custom",
    category: CUSTOM_CATEGORY,
    concept,
    visuals: [refPortraitVisual, refFullBodyVisual, heroVisual, ...productVisuals, ...emotionalVisuals],
    seo,
    createdAt: Date.now(),
    status: "completed",
  };

  await saveBook(book);
  onProgress({ stage: "done", message: "🎉 Özel kitabın hazır!" });
  return book;
}
