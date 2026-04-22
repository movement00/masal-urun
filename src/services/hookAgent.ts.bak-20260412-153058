import { generateImage } from "./geminiClient";
import type { BookConcept } from "../types";

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const HOOK_SCENES = [
  {
    label: "Yemek Yerken",
    scene: (c: BookConcept) => `iPhone candid photo: the child (from reference photo — EXACT same child, same face, same features) sitting at a dinner table, eating, with the thin soft-cover storybook "${c.baslik}" propped open beside the plate. Child keeps glancing at the book between bites. Spoon mid-air. Mom's hand blurred reaching across. Real Turkish family dinner table — çorba or makarna on plate, bread basket, water glass. Evening kitchen light, slightly warm tungsten. iPhone handheld by dad, slightly tilted. NOT staged — real messy table, real dinner moment. The book is JUST THERE in their life, not presented.`,
  },
  {
    label: "Uyurken Kitapla",
    scene: (c: BookConcept) => `iPhone photo taken by a parent in dim bedroom light: the child (from reference photo — EXACT same child) has fallen asleep mid-read. The soft-cover book "${c.baslik}" rests open on their chest, one hand still loosely holding a page. Blanket half-kicked off. Pillow slightly crooked. Bedside lamp glow only. Child's face peaceful, mouth slightly open, breathing. Stuffed animal squished under one arm. Real bedroom mess — other toys on floor, glass of water on nightstand. iPhone flash did NOT fire — low light, slight grain, soft focus. Parent captured this tender moment quietly. Utterly real.`,
  },
];

/**
 * Generates ONE hook/kanca lifestyle photo — child naturally living with the book.
 * Uses the real-child reference photo for face consistency.
 */
export async function generateHookVisual(
  concept: BookConcept,
  realPhotoRef: string,
  frontCoverRef: string
): Promise<{ imageUrl: string; prompt: string; label: string }> {
  const hook = pick(HOOK_SCENES);
  const prompt = `${hook.scene(concept)}

REALISM RULES (same as character photo):
- Real skin with pores, imperfections, redness
- Real fabric wrinkles, stains
- Real environment — messy, lived-in
- iPhone computational photo look — not studio
- NO AI tells: no waxy skin, no perfect symmetry, no merged fingers
- The child must look IDENTICAL to the reference photo — same face, same features

The book in the scene must show the cover from the second reference image.`;

  const imageUrl = await generateImage(prompt, [realPhotoRef, frontCoverRef], "3:4");
  return { imageUrl, prompt, label: hook.label };
}

/**
 * Generates the transformation visual: real photo → Pixar story character.
 * Split-screen marketing image.
 */
export async function generateTransformationVisual(
  concept: BookConcept,
  realPhotoRef: string,
  frontCoverRef: string
): Promise<{ imageUrl: string; prompt: string }> {
  const prompt = `Split-screen marketing visual for "${concept.baslik}" — a personalized children's book.

LAYOUT: Clean vertical split (50/50).

LEFT SIDE — "Gerçek":
A polaroid-frame snapshot of the real child (from FIRST reference image — same child, same face). Polaroid slightly tilted, with a small handwritten caption: "Senin çocuğun". Warm, analog, authentic feel. The real iPhone photo aesthetic.

RIGHT SIDE — "Kahraman":
The same child transformed into their 3D Pixar-style storybook character as seen on the book cover (SECOND reference image). Same recognizable features but Pixar-ified: bigger eyes, softer proportions, vibrant cartoon world around them. Small caption: "Onun hikayesi"

CENTER TRANSITION:
Soft sparkle/magic dust effect connecting the two sides. A gentle glowing arrow "→" or stardust trail.

BACKGROUND: Clean warm cream gradient. Premium, minimal.

BOTTOM TEXT (Turkish, clean modern font):
"Her çocuk kendi hikayesinin kahramanı"

Turkish characters (ş, ğ, ü, ö, ç, ı, İ) PERFECT. This is THE marketing image — shows parents exactly what the product does.`;

  const imageUrl = await generateImage(prompt, [realPhotoRef, frontCoverRef], "2:3");
  return { imageUrl, prompt };
}
