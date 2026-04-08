import { generateImage } from "./geminiClient";
import type { BookConcept } from "../types";

export interface CharacterReference {
  characterPortrait: string; // 3D Pixar character portrait — reference for all other visuals
}

/**
 * Generates ONE 3D Pixar-style character portrait.
 * This is the "DNA" image — all other visuals reference this for consistency.
 * Shows the character in a warm, natural Turkish child setting.
 */
export async function generateCharacterReferences(
  concept: BookConcept
): Promise<CharacterReference> {
  const { kahraman } = concept;
  const gender = kahraman.cinsiyet === "erkek" ? "boy" : "girl";

  const prompt = `3D Pixar/Disney CGI character portrait of a Turkish child — this is the HERO reference image for a personalized children's storybook.

THE CHARACTER (render EVERY detail with precision):
- ${kahraman.yas}-year-old Turkish ${gender}
- EXACT physical description: ${kahraman.fizikselOzellikler}
- Clothing: ${kahraman.kiyafet}

3D PIXAR STYLE RULES:
- Pixar/Disney CGI quality (Toy Story, Coco, Encanto, Turning Red level)
- Slightly stylized proportions: larger expressive eyes, softer rounder features, Pixar head-to-body ratio
- BUT keep the character recognizably Turkish — olive/warm skin tones, dark features as described
- Rich subsurface scattering on skin (Pixar's signature warm translucent skin)
- Detailed hair with individual strands rendered in 3D (not flat texture)
- Eyes with depth: catchlights, iris detail, natural expression
- Clothing with realistic 3D fabric folds, texture, subtle wear

SETTING — natural Turkish child moment:
- Character in a warm, cozy setting that feels like home (Turkish apartment living room, balcony with plants, kitchen table, a park bench, grandma's garden)
- Warm golden-hour lighting, soft volumetric light
- NOT a studio shot — the character is LIVING in the scene naturally
- Small environmental details that feel Turkish (a çay glass in background, colorful kilim, balcony railing, neighborhood view)

COMPOSITION:
- Portrait/medium shot — character fills ~60-70% of frame
- 3:4 vertical format
- Character looking slightly off-camera or engaged with something — natural, not posed
- Warm, inviting, the kind of image a parent would fall in love with
- Background slightly soft/blurred to keep focus on character

CRITICAL — WHAT THIS IS NOT:
- NOT a book cover (no title, no text, no badge)
- NOT a movie poster
- NOT anime or 2D illustration
- NOT a real photograph — this is clearly 3D Pixar CGI
- NOT a generic Western/European-looking child — this is a TURKISH child with the specific features described above
- NO blonde hair, NO blue eyes unless explicitly stated in the physical description

This portrait establishes the character's visual identity. Every subsequent image in this book will reference this portrait for consistency.`;

  const characterPortrait = await generateImage(prompt, [], "3:4");
  return { characterPortrait };
}
