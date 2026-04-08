import { generateImage } from "./geminiClient";
import type { Category } from "../categories";
import type { BookConcept } from "../types";

function getStylePromptForCategory(category: Category, concept: BookConcept): string {
  const { baslik, kahraman, sahneler } = concept;
  const firstScene = sahneler[0] || "";

  const characterDesc = `The character is ${kahraman.isim}, a ${kahraman.yas}-year-old Turkish ${kahraman.cinsiyet === "erkek" ? "boy" : "girl"}. Use the reference portrait to match the child's face, hair, skin tone, distinctive features, and proportions EXACTLY — maintain the same Pixar 3D style. Wearing: ${kahraman.kiyafet}. Physical details: ${kahraman.fizikselOzellikler}`;

  const baseInstructions = `
SIMPLE SOFT-COVER CHILDREN'S STORYBOOK COVER — 2:3 portrait format, thin flexible magazine-style book (NOT hardcover, NOT thick novel).

TITLE TEXT (top of cover, clearly readable):
"${baslik}"
TYPOGRAPHY — friendly children's book lettering:
  - Character's name in playful hand-lettered script with warm color + small decorative touches (stars, hearts, or underline swash)
  - Rest of the title in chunky friendly display font with contrasting weight
  - Turkish characters PERFECT (ş, ğ, ü, ö, ç, ı, İ)
  - NOT Comic Sans, NOT flat Arial — must feel like a published Turkish children's storybook
Title occupies top ~20% with breathing room

PERSONALIZATION BADGE (REQUIRED — small circular or ribbon badge on cover, visible but not overwhelming):
Turkish text: "Bu kitap ${kahraman.isim} için özel olarak üretilmiştir"
Placement: small corner badge (top-right or bottom-left), warm color (gold/soft red/mint), readable but subtle. Like a sticker.

CHARACTER (personalized — MUST match reference portrait):
${characterDesc}
The character is IN the story scene, experiencing the moment naturally — not posing. Warm, engaging expression matching the mood.

CRITICAL — TURKISH CHILD APPEARANCE:
- The character must look like a REAL Turkish child (in Pixar style) — NOT a generic Western/European child
- Dark hair, warm skin tones, features as described in the physical description
- DO NOT lighten the hair color, DO NOT change eye color, DO NOT make skin lighter than described
- Match the reference portrait EXACTLY

COMPOSITION — simple children's book cover (NOT cinematic movie poster):
- 2:3 vertical portrait
- Title at top (~20%), character + scene fills middle (~60%), badge + optional scene ground (~20% bottom)
- Character is the focal point but integrated into a simple illustrated scene backdrop
- Clean, warm, child-friendly — think published Turkish/European children's book, not Hollywood poster
- Book should look like a THIN soft-cover — visual language of a simple flexible storybook`;

  switch (category.visualStyle) {
    case "pixar-3d":
      return `${baseInstructions}

ART STYLE: 3D Pixar/Disney CGI — same quality and style as the reference portrait.
- Pixar/Disney CGI quality (Toy Story, Coco, Encanto, Turning Red level)
- Character face MUST match reference portrait — same features, same style, same Pixar proportions
- Vibrant warm colors, soft volumetric lighting, rich subsurface scattering on skin
- Simple illustrated 3D backdrop evoking: ${firstScene}
- Mood: ${concept.mood}
- NO anime, NO 2D flat illustration, NO realistic photo style

Category: ${category.name} — ${category.description}`;

    case "coloring-simple":
      return `${baseInstructions.replace(/COMPOSITION.*$/s, "")}

ART STYLE: Simple black-and-white coloring book cover for ages 2-5.
- BOLD thick BLACK outlines on WHITE background
- Character outline based on reference portrait (simplified to chunky shapes)
- Only TITLE and BADGE can have color (bright playful)
- Very simple shapes, large basic forms
- Character outline only, NO shading, NO color fill
- Simplified scene: ${firstScene} (basic shapes only)

This is a COLORING BOOK cover — toddler-friendly, high clarity.`;

    case "coloring-detailed":
      return `${baseInstructions.replace(/COMPOSITION.*$/s, "")}

ART STYLE: Detailed black-and-white coloring book cover for ages 6-10.
- Medium BLACK outlines on WHITE background
- Character and scene outlines based on reference portrait (detailed but uncolored)
- Only TITLE and BADGE can have color
- Intricate patterns, textures, decorative elements
- Scene: ${firstScene} (detailed line art)

This is a detailed COLORING BOOK cover for older children.`;

    case "gift-emotional":
      return `${baseInstructions}

ART STYLE: Emotional gift book cover — 3D Pixar character + warm gift atmosphere.
- Character face MUST match reference portrait — same Pixar 3D style
- Warm heartwarming atmosphere with gift elements (ribbons, hearts, soft glow)
- Pastel warm colors, gold highlights, magical soft lighting
- Character expressing love/celebration matching: ${category.moodKeywords.join(", ")}
- Simple children's book presentation (not complex poster)
- Scene: ${firstScene}

GIFT BOOK — appeals to both children AND parents/grandparents buying it.`;

    default:
      return baseInstructions;
  }
}

export async function generateCoverImage(
  category: Category,
  concept: BookConcept,
  characterPortraitRef?: string
): Promise<{ imageUrl: string; prompt: string }> {
  const prompt = getStylePromptForCategory(category, concept);
  const refs = characterPortraitRef ? [characterPortraitRef] : [];
  const imageUrl = await generateImage(prompt, refs, "2:3");
  return { imageUrl, prompt };
}

export async function generateBackCover(
  concept: BookConcept,
  frontCoverUrl: string,
  characterPortraitRef?: string
): Promise<{ imageUrl: string; prompt: string }> {
  const { baslik, kahraman, ozet, kazanimlar } = concept;
  const kazanimList = kazanimlar.slice(0, 5).map((k, i) => `${i + 1}. ${k}`).join("\n");

  const prompt = `BACK COVER of a thin soft-cover Turkish children's storybook. 2:3 portrait format.

This is the REVERSE SIDE of the front cover shown in the reference image. Same book, same visual language, same 3D Pixar CGI art style.

THE CHARACTER — MUST match the reference portrait exactly:
- Same Turkish child, same face, same hair, same skin tone, same distinctive features
- Same 3D Pixar/Disney CGI style
- Physical details: ${kahraman.fizikselOzellikler}

LAYOUT (top to bottom):
— TOP 30%: A small illustrated scene vignette (character from the story in a warm moment, same Pixar 3D style as front cover). This should be a DIFFERENT scene than the front cover but same character. Show the child in a natural, cozy Turkish setting.

— MIDDLE 45%:
ÖZET (story summary in warm, inviting Turkish):
"${ozet}"

KAZANIMLAR (what the child gains — Turkish text, each with small icon):
${kazanimList}

— BOTTOM 25%:
Personalization badge: "Bu kitap ${kahraman.isim} için özel olarak hazırlanmıştır ❤️"
Small MasalSensin logo placeholder
Barcode placeholder area (small, bottom-right)

TYPOGRAPHY:
- Summary in warm serif or friendly sans-serif
- Kazanimlar in clean rounded sans with small icons (star, heart, lightbulb, shield, smiley)
- Badge text in handwritten script
- Turkish characters PERFECT (ş, ğ, ü, ö, ç, ı, İ)

STYLE: Same pastel/warm tone as front cover. Professional published book back cover. Clean, readable, parent-friendly. NOT cluttered.

Title reference: "${baslik}"`;

  // Use both character portrait and front cover as references for maximum consistency
  const refs = characterPortraitRef
    ? [characterPortraitRef, frontCoverUrl]
    : [frontCoverUrl];
  const imageUrl = await generateImage(prompt, refs, "2:3");
  return { imageUrl, prompt };
}
