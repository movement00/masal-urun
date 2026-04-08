import { generateImage } from "./geminiClient";
import type { BookConcept } from "../types";

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

// ═══ HOOK GÖRSELLERİ — 3D Pixar tarzında, doğal ortamda çocuk + kitap ═══
// Çocuğun kitapla doğal bir anını gösteren sıcak sahne.

const HOOK_SCENES = [
  {
    label: "Yatakta Okuyor",
    scene: (c: BookConcept) => `3D Pixar/Disney CGI scene: The SAME Turkish child from the reference portrait (EXACT same face, hair, skin, features — Pixar style) is lying on a cozy bed reading the storybook "${c.baslik}". The child is propped up on pillows, blanket pulled up to waist, holding the open book with both hands, eyes wide with wonder at the story. Warm bedside lamp glow, stuffed animal tucked under one arm. Real-feeling bedroom: slightly messy, toys on the floor, colorful bedsheet with patterns. The book cover is visible showing the front cover from the second reference image. Evening atmosphere, warm golden light. The child is completely absorbed in reading — a tender bedtime moment. Turkish apartment bedroom feeling (radiator visible, curtains, small balcony door in background).`,
  },
  {
    label: "Parkta Okuyor",
    scene: (c: BookConcept) => `3D Pixar/Disney CGI scene: The SAME Turkish child from the reference portrait (EXACT same face, hair, skin, features — Pixar style) is sitting under a tree in a sunny Turkish park, reading the storybook "${c.baslik}". Cross-legged on grass, book open on lap, completely absorbed. Dappled sunlight through leaves, warm afternoon glow. Background: other kids playing in distance (blurred), a playground, Turkish apartment buildings visible beyond the park. Maybe a juice box or snack beside them. The book cover visible showing the front cover from the second reference image. Natural, spontaneous moment — child chose to read outdoors. Warm, inviting, the kind of scene that makes parents smile.`,
  },
  {
    label: "Kahvaltıda Okuyor",
    scene: (c: BookConcept) => `3D Pixar/Disney CGI scene: The SAME Turkish child from the reference portrait (EXACT same face, hair, skin, features — Pixar style) at a Turkish breakfast table, sneaking a read of "${c.baslik}" between bites. One hand on the book propped against a glass, other hand holding bread with cheese. Typical Turkish kahvaltı spread: çay glasses, white cheese, olives, tomatoes, honey, bread. Morning light streaming through kitchen window. Mom's hand blurred reaching for something in background. The book cover visible showing the front cover from the second reference image. Warm, authentic Turkish family morning scene — the child can't put the book down even at breakfast.`,
  },
];

/**
 * Generates ONE hook/lifestyle visual — child naturally living with the book.
 * 3D Pixar CGI style matching the character portrait.
 */
export async function generateHookVisual(
  concept: BookConcept,
  characterPortraitRef: string,
  frontCoverRef: string
): Promise<{ imageUrl: string; prompt: string; label: string }> {
  const hook = pick(HOOK_SCENES);
  const prompt = `${hook.scene(concept)}

3D PIXAR STYLE RULES:
- Same Pixar/Disney CGI quality as the character reference portrait
- Rich subsurface scattering on skin, detailed 3D hair, expressive eyes
- Warm volumetric lighting, soft shadows
- Environment rendered in Pixar style — stylized but believable
- Character MUST be identical to reference portrait — same face, features, hair, skin tone

CRITICAL:
- This is 3D Pixar CGI — NOT a real photograph, NOT 2D illustration
- The child must look like a REAL Turkish child (Pixar-stylized) — dark hair, warm skin as described
- DO NOT change the character's appearance from the reference
- Natural, warm, cozy — a moment parents recognize from their own lives`;

  const imageUrl = await generateImage(prompt, [characterPortraitRef, frontCoverRef], "3:4");
  return { imageUrl, prompt, label: hook.label };
}

/**
 * Generates the conversion/marketing visual showing the book's magic.
 * Split-screen or storytelling visual in 3D Pixar style.
 */
export async function generateConversionVisual(
  concept: BookConcept,
  characterPortraitRef: string,
  frontCoverRef: string
): Promise<{ imageUrl: string; prompt: string }> {
  const prompt = `3D Pixar/Disney CGI marketing visual for "${concept.baslik}" — a personalized Turkish children's storybook.

SCENE: A magical moment showing the power of the personalized book.

The SAME Turkish child from the reference portrait (EXACT same face, hair, skin, features — Pixar style) is sitting and holding the open book. As they read, the story characters and scenes are magically coming alive from the pages — swirling out of the book in a beautiful trail of sparkles, stardust, and warm light.

The child's expression is pure WONDER — mouth slightly open, eyes sparkling with amazement, leaning forward with excitement. They're seeing themselves in the story (a smaller version of themselves as the story hero is visible in the magical swirl coming from the book pages).

VISUAL ELEMENTS:
- The physical book is visible in the child's hands, cover recognizable from the second reference
- Magical particles, stardust, soft glowing light emerging from the open pages
- Story elements floating in the magical trail (elements from the story scenes)
- A miniature Pixar version of the child as the story hero visible in the magic
- Warm, golden, magical atmosphere

COMPOSITION:
- 2:3 vertical format
- Child centered, book open, magic flowing upward
- Background: warm gradient, cozy setting fading into magical bokeh
- Premium, cinematic Pixar quality

BOTTOM TEXT (Turkish, clean warm font):
"Her çocuk kendi hikayesinin kahramanı"
Turkish characters (ş, ğ, ü, ö, ç, ı, İ) PERFECT

3D PIXAR STYLE:
- Same quality as Pixar movie marketing posters
- Rich lighting, volumetric effects, particle magic
- Character identical to reference portrait
- NOT 2D, NOT realistic photo — pure Pixar CGI magic

This is THE conversion image — it shows parents the magical experience their child will have with this personalized book.`;

  const imageUrl = await generateImage(prompt, [characterPortraitRef, frontCoverRef], "2:3");
  return { imageUrl, prompt };
}
