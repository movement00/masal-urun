import { generateImage } from "./geminiClient";
import type { BookConcept } from "../types";

export interface CharacterReference {
  refPortrait: string;  // iPhone-style close-up portrait
  refFullBody: string;  // iPhone-style full-body shot
}

/**
 * Generates 2 consistent iPhone-amateur-style realistic reference photos
 * of the child character. These are used as visual references for all
 * subsequent generation (cover, emotional moments, product shots) to
 * ensure the character looks identical everywhere.
 *
 * Output: real-photo aesthetic (NOT 3D/Pixar). Pixar-ification happens
 * on the cover; here we establish the "real child" baseline.
 */
export async function generateCharacterReferences(
  concept: BookConcept
): Promise<CharacterReference> {
  const { kahraman } = concept;
  const genderEn = kahraman.cinsiyet === "erkek" ? "boy" : "girl";

  const commonLook = `A ${kahraman.yas}-year-old Turkish ${genderEn} named ${kahraman.isim}. ${kahraman.fizikselOzellikler}. Wearing: ${kahraman.kiyafet}.`;

  const iphoneAestheticRules = `
PHOTOGRAPHIC STYLE — amateur iPhone snapshot, NOT studio photography:
- Shot handheld on a recent iPhone in candid natural moment
- Slightly imperfect framing, natural home lighting (window light, warm lamps)
- Mild iPhone computational-photo look: slightly crisp, minor grain, realistic skin texture
- NOT overly polished, NOT studio lit, NOT professional portrait
- Authentic parent-taken photograph feel — the kind a mom would send in a family WhatsApp group
- Real child, real textures, real imperfections. Eyes have genuine catchlights.
- ABSOLUTELY NO 3D CGI, NO Pixar look, NO illustration, NO anime. Photorealistic only.
- Turkish household aesthetic: warm wood, knit blankets, cozy pastel interior`;

  // Reference 1: Portrait close-up (3:4)
  const portraitPrompt = `iPhone snapshot — CLOSE-UP PORTRAIT of a real child.

SUBJECT: ${commonLook}
Expression: natural, candid. A small genuine smile or gentle curiosity — NOT a forced posed smile. Looking slightly off-camera or directly at parent holding phone.

FRAMING: Chest-up portrait. Face clearly visible, sharp focus on eyes. Soft natural indoor background (blurred living room or bedroom).

${iphoneAestheticRules}`;

  // Reference 2: Full body (3:4)
  const fullBodyPrompt = `iPhone snapshot — FULL-BODY CANDID of the same real child.

SUBJECT: ${commonLook}
This MUST be the EXACT same child as the portrait reference — same face, same features, same clothing.

ACTION: Standing or moving naturally in a home environment (living room, play area). Doing something casual: looking at a toy, walking, mid-step. NOT posed.

FRAMING: Full body visible head-to-toe. Slightly wide angle like a parent capturing a moment. Natural household background.

${iphoneAestheticRules}`;

  // Generate portrait first (establishes the face)
  const refPortrait = await generateImage(portraitPrompt, [], "3:4");

  // Generate full-body with portrait as reference for face consistency
  const refFullBody = await generateImage(fullBodyPrompt, [refPortrait], "3:4");

  return { refPortrait, refFullBody };
}
