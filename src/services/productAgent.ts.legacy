import { generateImage } from "./geminiClient";
import type { BookConcept, GeneratedVisual } from "../types";
import type { Category } from "../categories";

interface ProductShot {
  type: GeneratedVisual["type"];
  label: string;
  promptBuilder: (concept: BookConcept, category: Category) => string;
  aspectRatio: string;
}

const PRODUCT_SHOTS: ProductShot[] = [
  {
    type: "cover_45",
    label: "Kitap 45° Açı",
    aspectRatio: "1:1",
    promptBuilder: (concept, _category) => `Product photograph of a thin soft-cover A4 children's book at 45-degree angle, showing BOTH the front cover AND the spine/edge thickness simultaneously.

BOOK COVER (MUST MATCH REFERENCE IMAGE EXACTLY):
The book cover is the FIRST reference image. The exact same cover design, title "${concept.baslik}", same character, same colors, same illustration.

CRITICAL: This is a THIN soft-cover children's book like a magazine or activity book — NOT hardcover. Thin flexible covers, ~20-30 pages.

SCENE: Clean pastel background (warm cream or soft pink), studio lighting with gentle shadow on one side. The book stands upright with a slight tilt.

QUALITY SIGNAL: Must demonstrate the book is a real physical printed product. Professional e-commerce detail shot.`,
  },
  {
    type: "open_book",
    label: "Açık Kitap (İç Sayfa)",
    aspectRatio: "4:3",
    promptBuilder: (concept, _category) => `Product photograph of the thin soft-cover children's book OPEN, showing a beautiful illustrated double-page spread.

BOOK IDENTITY (from reference image):
The cover and character design match the first reference image exactly. Title: "${concept.baslik}"

INSIDE PAGES: Show a page spread with the SAME character from the cover (named ${concept.kahraman.isim}) in one of the story scenes. The character on the page MUST look IDENTICAL to the one on the cover — same face, hair, clothing, proportions.

Scene depicted: "${concept.sahneler[Math.floor(concept.sahneler.length / 2)] || concept.sahneler[0]}"

STYLE: Camera looking down at ~45° angle. Pages show real printed paper texture with slight curl. Warm reading-time lighting. The 3D cartoon illustrations are vibrant and clear.

This is a THIN soft-cover book — visible thin flexible pages, not hardcover.`,
  },
  {
    type: "flatlay",
    label: "Flat-Lay (Props ile)",
    aspectRatio: "1:1",
    promptBuilder: (concept, category) => {
      const props = category.group === "boyama"
        ? "colored pencils fanned out, crayons in a cup, an eraser, star stickers, and a small stuffed bunny toy"
        : category.group === "ozel-gun"
        ? "a satin ribbon, scattered confetti stars, a small gift tag, a tiny candle, and pastel tissue paper"
        : "colored pencils, a small stuffed teddy bear, star stickers scattered, a cup of hot cocoa, and a toy figure";

      return `Overhead flat-lay product photograph of the thin soft-cover children's book.

BOOK (from first reference image):
The book cover design matches the reference EXACTLY. Title: "${concept.baslik}". Same character, same art style.

LAYOUT: The book (cover facing up) centered on a soft pastel surface (mint, blush pink, soft yellow, or lavender). Around it, artfully arranged: ${props}.

STYLE: Pinterest-worthy, Instagram mom aesthetic. Clean, bright, joyful. Even overhead lighting with no harsh shadows.

The book looks THIN and flexible — soft cover, not hardcover.`;
    },
  },
  {
    type: "gift",
    label: "Hediye Sunumu",
    aspectRatio: "1:1",
    promptBuilder: (concept, _category) => `Product photograph of the children's book presented as a premium GIFT.

BOOK (from first reference image):
The book cover matches the reference EXACTLY. Title: "${concept.baslik}".

GIFT PRESENTATION: The book sits on tissue paper inside a beautiful gift box, with a satin ribbon beside it. Scattered confetti stars and a small handwritten card visible. The book cover faces the camera. Premium gift-giving moment.

STYLE: Bright, joyful lighting. Warm pastel colors. This should make parents want to buy it as a special gift.`,
  },
  {
    type: "child_holding",
    label: "Çocuk Kitabı Tutuyor",
    aspectRatio: "2:3",
    promptBuilder: (concept, _category) => `Lifestyle photograph of a happy real child (age 4-8) holding the personalized storybook with AMAZED, EXCITED expression.

BOOK (from first reference image):
The child holds the book with the cover facing the camera. Cover design matches reference EXACTLY. Title: "${concept.baslik}". SAME character on the cover as in reference.

CHILD: A real (not AI-looking) Turkish child, age 4-8, mouth slightly open in wonder, eyes wide with genuine joy. Holding the book at chest level, cover fully visible.

SCENE: Warm cozy home environment (living room or bedroom), soft bokeh background, natural window light illuminating the child's face. Shot at f/2.8, 85mm lens, eye-level.

EMOTIONAL FOCUS: This is about the child's JOY of seeing their personalized book, not just the product. Make viewers FEEL the surprise and wonder.`,
  },
];

const MARKETING_SHOTS: ProductShot[] = [
  {
    type: "parent_reading",
    label: "Ebeveyn + Çocuk Okuma",
    aspectRatio: "4:3",
    promptBuilder: (concept, _category) => `Warm lifestyle photograph of a Turkish parent and child (age 3-7) reading the personalized storybook together on a couch or bed.

BOOK (from first reference image):
The open book shows the illustration style from the reference. Title visible: "${concept.baslik}".

SCENE: Mother (or father) sitting on comfortable couch/bed with child snuggled beside them. Both looking at the book pages together. Warm intimate family bedtime story moment. Soft blanket, plush pillows in background, warm side lamp lighting.

EMOTIONAL TONE: Safe, loving, nostalgic. The kind of photo that makes grandparents want to buy this book for their grandchildren. Shot at f/4, natural composition.`,
  },
  {
    type: "reaction",
    label: "İlk Tepki (Çocuk Görüyor)",
    aspectRatio: "9:16",
    promptBuilder: (concept, _category) => `Emotional photograph capturing the MOMENT a child sees their personalized storybook for the first time.

BOOK (from first reference image):
The book cover visible in the scene. Title: "${concept.baslik}".

CHILD'S REACTION: Mouth wide open in surprise, hands covering cheeks in disbelief, eyes sparkling with pure wonder. This is the "OH MY GOD that's ME!" moment — the emotional hook that sells personalized products.

SCENE: Bedroom or living room, the book has just been handed to the child or placed in front of them. Parent's hand visible at edge (unwrapping or presenting). Soft warm lighting, close-up on child's face with book.

CAPTURE THE MAGIC: This is the #1 marketing image — parents WANT to create this moment for their child.`,
  },
  {
    type: "hook",
    label: "Hook Görseli",
    aspectRatio: "9:16",
    promptBuilder: (concept, category) => {
      const hooks: Record<string, string> = {
        "hikaye": "Çocuğunuzun yüzündeki ifadeyi görmelisiniz... kendi adını kitap kapağında ilk kez gördüğünde!",
        "boyama": "Çocuğunuz boyama yapmıyor mu? Kendi ismi yazan kitapta boyama yapmak istemeyen çocuk olamaz!",
        "ozel-gun": "Unutamayacakları bir anı bırakın. Yılardır saklanacak bir hediye.",
      };
      const hookText = hooks[category.group] || hooks.hikaye;

      return `Emotional marketing Instagram Story image for a personalized children's book.

BOOK (from first reference image):
Show the book cover prominently. Title: "${concept.baslik}".

TEXT OVERLAY (LARGE, BOLD, TOP OF IMAGE):
"${hookText}"

Turkish characters (ş, ğ, ü, ö, ç, ı, İ) must be PERFECTLY rendered.
White text with dark outline/shadow for readability.
Clean modern sans-serif font.

BOTTOM: "MasalSensin - Senin çocuğun, senin hikayen"

VISUAL: Warm, emotional scene. The book is the hero element. Pastel gradient background. Aspect ratio 9:16 vertical (Instagram Story).

GOAL: Stop the scroll with emotional hook. Parent should feel "I NEED to see how my child reacts to this".`;
    },
  },
  {
    type: "infographic",
    label: "Kazanımlar İnfografiği",
    aspectRatio: "1:1",
    promptBuilder: (concept, _category) => {
      const kazanimlarList = concept.kazanimlar.slice(0, 4).join("\n- ");

      return `Clean infographic image showcasing benefits of a personalized children's book.

BOOK (from first reference image):
The book cover in the center of the image. Title: "${concept.baslik}".

LAYOUT: The book centered, with 4 benefit badges/bubbles around it (one in each corner), connected by thin decorative lines.

BENEFIT BADGES (TURKISH TEXT):
- ${kazanimlarList}

BADGE STYLE: Rounded pastel-colored rectangles with white text, small icons (heart, star, book, smiley), clean modern design.

BACKGROUND: Soft pastel gradient (warm cream or pink), minimal distractions.

Turkish characters must be PERFECT. Clean, parent-friendly, educational visual.`;
    },
  },
];

export async function generateProductShots(
  concept: BookConcept,
  category: Category,
  heroCoverUrl: string,
  onVisualReady?: (visual: GeneratedVisual) => void
): Promise<GeneratedVisual[]> {
  const results: GeneratedVisual[] = [];
  const allShots = [...PRODUCT_SHOTS, ...MARKETING_SHOTS];

  for (const shot of allShots) {
    try {
      const prompt = shot.promptBuilder(concept, category);
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
