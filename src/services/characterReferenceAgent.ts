import { generateImage } from "./geminiClient";
import type { BookConcept } from "../types";

export interface CharacterReference {
  refPortrait: string;  // iPhone-style close-up portrait
  refFullBody: string;  // iPhone-style full-body shot
}

// ═══ Variety pools (picked randomly per book to avoid monotony) ═══

const PORTRAIT_SCENES = [
  "grandmother's living room with floral wallpaper and doilies",
  "school classroom near a window with drawings taped to the glass",
  "backyard garden with grass and scattered toys",
  "family car back seat, seatbelt on, window light",
  "apartment stairwell with chipped paint and natural shadows",
  "kitchen counter corner while mom cooks in blurred background",
  "bedroom with messy sheets and stuffed animals scattered",
  "park bench with trees blurred behind",
  "shopping mall food court with bright artificial light",
  "balcony with laundry drying on a rack in background",
  "grandma's kitchen with gas stove and old wooden table",
  "hallway of apartment building with mailboxes visible",
];

const FULLBODY_SCENES = [
  "running in a park with fallen autumn leaves",
  "jumping on a trampoline, mid-air, hair flying",
  "climbing a playground structure, one foot on the rung",
  "riding a scooter on a cracked sidewalk",
  "standing in front of school gate with backpack straps twisted",
  "squatting on kitchen floor examining an ant",
  "dancing awkwardly in the living room to music",
  "trying to reach a high shelf, on tiptoes",
  "splashing in a puddle wearing too-big rubber boots",
  "sitting on curb eating ice cream, shirt slightly stained",
  "pushing a stroller-sized toy across a sidewalk",
  "holding hands with an out-of-frame adult crossing a street",
];

const AMATEUR_DEFECTS = [
  "slightly off-center framing (subject not perfectly centered), mild motion blur on one hand",
  "flash hotspot on forehead, slight red-eye catch, crooked horizon",
  "parent's thumb visible at edge of frame, subject slightly cropped at elbow",
  "back-lit (window behind subject) so face is slightly underexposed, real-life lighting",
  "overhead fluorescent light casting unflattering shadow, amateur framing",
  "subject looking away mid-action (not posing), slightly out of focus",
  "low angle from parent crouching, tilted frame, kid mid-sentence with mouth open",
  "too-close crop cutting top of head, candid unposed expression",
  "window reflection or lens flare on corner, dust specks",
  "wide shot with subject small in frame, real messy environment around",
];

const LIGHTING_CONDITIONS = [
  "harsh midday sun through window",
  "warm golden-hour sidelight",
  "overcast diffused daylight",
  "indoor yellowish tungsten bulb light",
  "mixed fluorescent + daylight",
  "dim evening lamp light",
  "overhead kitchen LED",
  "dappled shade through trees",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const CORE_RULES = `
PHOTOGRAPHIC STYLE — real iPhone snapshot by a distracted parent, NOT staged:
- Shot handheld on iPhone in real life — captured BEFORE the child was ready
- Photorealistic, natural skin texture with pores, real hair strands
- iPhone computational look (slightly crisp but realistic, not over-sharp)
- NO CGI, NO Pixar, NO illustration, NO 3D render, NO anime, NO studio portrait
- Ordinary Turkish family life — nothing overly aesthetic or Instagram-curated
- Real wear: scuffed shoes, slightly dirty hands, messy hair, pajama wrinkles, snot if appropriate
- The kid is a REAL individual with the EXACT distinctive features described — make them unmistakably unique`;

export async function generateCharacterReferences(
  concept: BookConcept
): Promise<CharacterReference> {
  const { kahraman } = concept;
  const genderEn = kahraman.cinsiyet === "erkek" ? "boy" : "girl";

  const commonLook = `A ${kahraman.yas}-year-old Turkish ${genderEn} named ${kahraman.isim}. DISTINCTIVE FEATURES (render EXACTLY): ${kahraman.fizikselOzellikler}. Wearing: ${kahraman.kiyafet}.`;

  // Pick random variety elements for this specific book
  const portraitScene = pickRandom(PORTRAIT_SCENES);
  const fullBodyScene = pickRandom(FULLBODY_SCENES);
  const portraitDefect = pickRandom(AMATEUR_DEFECTS);
  const fullBodyDefect = pickRandom(AMATEUR_DEFECTS);
  const lighting1 = pickRandom(LIGHTING_CONDITIONS);
  const lighting2 = pickRandom(LIGHTING_CONDITIONS);

  // Reference 1: Portrait (3:4)
  const portraitPrompt = `Real iPhone photo — candid close-up of a child caught in a real moment.

SUBJECT: ${commonLook}
Their distinctive features MUST be clearly visible — this is a specific real individual, not a generic child.

LOCATION: ${portraitScene}
LIGHTING: ${lighting1}
EXPRESSION: natural, unposed — caught mid-sentence, mid-thought, or reacting to something off-camera. NOT smiling at the camera unless it's a genuine reaction.

AMATEUR PARENT-PHOTO IMPERFECTIONS (apply these): ${portraitDefect}
${CORE_RULES}`;

  // Reference 2: Full body (3:4)
  const fullBodyPrompt = `Real iPhone photo — candid full-body of the SAME child from the portrait reference.

SUBJECT: ${commonLook}
This MUST be the EXACT same child as the portrait reference — same face, same distinctive features (freckles, gap teeth, whatever was specified), same clothing or clearly their same wardrobe style.

ACTION & LOCATION: ${fullBodyScene}
LIGHTING: ${lighting2}

AMATEUR PARENT-PHOTO IMPERFECTIONS (apply these): ${fullBodyDefect}
${CORE_RULES}`;

  const refPortrait = await generateImage(portraitPrompt, [], "3:4");
  const refFullBody = await generateImage(fullBodyPrompt, [refPortrait], "3:4");

  return { refPortrait, refFullBody };
}
