import { generateImage } from "./geminiClient";
import type { BookConcept, GeneratedVisual } from "../types";

interface ShowcaseShot {
  type: GeneratedVisual["type"];
  label: string;
  aspectRatio: string;
  promptBuilder: (concept: BookConcept) => string;
}

const SOFT_COVER_NOTE = `This is a THIN SOFT-COVER children's storybook — flexible cover like a magazine or activity book, ~20-30 pages. NOT hardcover, NOT thick novel. Realistic printed paper texture.`;

const SHOWCASE_SHOTS: ShowcaseShot[] = [
  {
    type: "cover_45",
    label: "Kitap 45° Açı",
    aspectRatio: "1:1",
    promptBuilder: (c) => `Product photograph of the thin soft-cover A4 children's book at exactly 45-degree angle, showing BOTH the front cover AND the thin spine/edge thickness.

BOOK: Cover design matches the first reference image EXACTLY. Title "${c.baslik}" visible, character from cover visible.

SCENE: Clean pastel background (warm cream, soft pink, or mint). Studio-quality lighting with gentle shadow on one side. Book stands upright with slight tilt. Professional e-commerce detail shot.

${SOFT_COVER_NOTE}`,
  },
  {
    type: "open_book",
    label: "Açık Kitap İç Sayfa",
    aspectRatio: "4:3",
    promptBuilder: (c) => `Product photograph of the children's book OPEN, showing a beautiful illustrated double-page spread.

BOOK IDENTITY: Cover design matches the reference image exactly. Title: "${c.baslik}"

INSIDE PAGES: Show a double-page spread with the SAME character (${c.kahraman.isim}) from the cover engaged in this scene: "${c.sahneler[Math.floor(c.sahneler.length / 2)] || c.sahneler[0]}"
Character on pages MUST look IDENTICAL to cover — same face, hair, clothing, proportions.

STYLE: Camera looking down at ~45°. Pages show real printed paper texture with slight curl. Warm reading-time lighting. Vivid 3D cartoon illustrations.

${SOFT_COVER_NOTE}`,
  },
  {
    type: "flatlay",
    label: "Flat-Lay",
    aspectRatio: "1:1",
    promptBuilder: (c) => `Overhead flat-lay photograph of the thin soft-cover children's book.

BOOK: Cover matches reference EXACTLY. Title "${c.baslik}". Same character, same art style.

LAYOUT: Book centered on soft pastel surface (mint, blush pink, or lavender). Around it: colored pencils, a small stuffed bear, star stickers, a cup of warm milk, a toy figure — arranged artfully.

STYLE: Pinterest-worthy, clean, bright, joyful. Even overhead lighting, no harsh shadows.

${SOFT_COVER_NOTE}`,
  },
  {
    type: "kazanimlar_poster",
    label: "Kazanımlar Posteri",
    aspectRatio: "1:1",
    promptBuilder: (c) => {
      const kazanimlarList = c.kazanimlar.slice(0, 6).join(" • ");
      return `Premium marketing poster showcasing what the child will GAIN from this book.

CENTER: The soft-cover book standing upright, cover facing viewer. Title "${c.baslik}" clearly visible. Character from cover visible.

HEADLINE AT TOP (large Turkish text):
"Bu kitap ${c.kahraman.isim}'e neler katacak?"

AROUND THE BOOK: 4-6 benefit badges arranged in a circle/grid around the book, connected with thin decorative lines. Each badge has:
- An icon (heart, star, shield, light bulb, hands, sparkle — matched to the benefit)
- A short Turkish benefit word
- Rounded pastel badge color (warm cream, sage, soft pink, gold)

BENEFITS TO FEATURE: ${kazanimlarList}

BACKGROUND: Soft pastel gradient (cream to warm beige). Clean, premium, parent-friendly.

TYPOGRAPHY: Friendly bold sans-serif for headline, clean rounded font for badges. Turkish characters (ş, ğ, ü, ö, ç, ı, İ) PERFECT.

This is the "reason to buy" visual — shows parents the educational value.`;
    },
  },
  {
    type: "hero_shot",
    label: "Hero Ürün Çekimi",
    aspectRatio: "2:3",
    promptBuilder: (c) => `Premium hero product shot of the thin soft-cover children's book — main e-commerce listing image.

BOOK: The book stands slightly angled (15-20°) on a soft pastel surface, cover fully facing camera. Title "${c.baslik}" sharp and readable. Cover illustration CRYSTAL CLEAR and sharp. Cover matches reference exactly.

SCENE: Warm directional light from the left, gentle shadows. Background soft bokeh with warm tones. Camera at ~30° elevation, 3/4 view.

${SOFT_COVER_NOTE}
This is the MAIN e-commerce listing image — must be scroll-stopping.`,
  },
];

export async function generateProductShowcase(
  concept: BookConcept,
  heroCoverUrl: string,
  onVisualReady?: (visual: GeneratedVisual) => void
): Promise<GeneratedVisual[]> {
  const results: GeneratedVisual[] = [];

  for (const shot of SHOWCASE_SHOTS) {
    try {
      const prompt = shot.promptBuilder(concept);
      const imageUrl = await generateImage(prompt, [heroCoverUrl], shot.aspectRatio);
      const visual: GeneratedVisual = {
        id: shot.type,
        type: shot.type,
        label: shot.label,
        imageUrl,
        prompt,
      };
      results.push(visual);
      onVisualReady?.(visual);
    } catch (err: any) {
      console.error(`Failed to generate ${shot.type}:`, err);
    }
  }

  return results;
}
