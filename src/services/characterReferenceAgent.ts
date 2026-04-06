import { generateImage } from "./geminiClient";
import type { BookConcept } from "../types";

export interface CharacterReference {
  realPhoto: string; // The "real child" iPhone photo — this IS a deliverable visual
}

// JS-side random pick — prevents AI from always choosing the same "safe" option
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const SCENES = [
  "sitting on a worn-out leather couch, TV remote on the cushion, toy on the floor",
  "at a cluttered kitchen table with crumbs, a half-eaten sandwich on a plate nearby",
  "on a scuffed wooden playground bench, jacket unzipped, one shoe untied",
  "in the back seat of a car, seatbelt slightly twisted, window smudged with fingerprints",
  "standing in a grocery store aisle, hand reaching toward a shelf, fluorescent light above",
  "on grandma's old floral armchair, doily on the armrest, framed photos behind",
  "in a school hallway with scuffed floor tiles, backpack half-open, fluorescent ceiling tubes",
  "sitting on apartment building stairs, concrete steps, chipped railing paint",
  "at a park picnic table, grass stains on clothes, crumpled juice box beside them",
  "in bathroom doorway, wet hair, towel around shoulders, steam in background",
  "on a messy bed with wrinkled sheets, pajama bottoms too long, stuffed animal squished under arm",
  "crouching in a garden digging dirt, fingernails dirty, sun hat crooked",
];

const ACTIONS = [
  "caught mid-blink, mouth slightly open, talking to someone off-frame",
  "looking down at something in their hands, distracted, not aware of camera",
  "turning their head toward camera, surprised, caught off-guard expression",
  "laughing hard at something, eyes squinting, one hand blurry from motion",
  "picking their nose or scratching their ear — real kid behavior",
  "yawning widely, eyes watery, mid-stretch",
  "chewing food, cheek puffed out, looking sideways",
  "frowning slightly, concentrating on something on the ground",
  "waving hand blurry in front of face, trying to block the photo",
  "holding up a random object (toy/stick/leaf) with a proud grin",
];

const DEFECTS = [
  "iPhone lens has a tiny smudge in one corner causing slight soft glow",
  "subject is 15% off-center to the left, empty space on right — bad composition",
  "slight motion blur on the child's hands (they moved), face sharp",
  "harsh flash fired — flat lighting, slight red-eye, hard shadow behind on wall",
  "backlit from window — face slightly underexposed, halo around hair",
  "photo taken through a slightly dirty glass door/window — subtle reflections",
  "timestamp burn in bottom-right corner (like old iPhone): '14:23'",
  "another person's elbow or shoulder barely visible at frame edge — cropped out",
  "slightly tilted horizon (3-5 degrees) — parent didn't hold phone straight",
  "focus locked on background accidentally — child slightly soft, background sharp",
];

/**
 * Generates ONE hyper-realistic "iPhone parent photo" of the child.
 * This image serves as: (a) visual reference for all other generations,
 * and (b) a deliverable itself — the "real child photo" in the catalog.
 *
 * GOAL: This must pass as a REAL photograph. No AI tells whatsoever.
 */
export async function generateCharacterReferences(
  concept: BookConcept
): Promise<CharacterReference> {
  const { kahraman } = concept;
  const gender = kahraman.cinsiyet === "erkek" ? "boy" : "girl";

  const scene = pick(SCENES);
  const action = pick(ACTIONS);
  const defect = pick(DEFECTS);

  const prompt = `A single iPhone 13 photograph of a real Turkish child. This is a REAL PHOTO — not AI, not illustration, not CGI.

THE CHILD:
- ${kahraman.yas}-year-old ${gender}
- EXACT physical description (render EVERY detail): ${kahraman.fizikselOzellikler}
- Clothing: ${kahraman.kiyafet}
- Each distinctive feature MUST be visible and recognizable

WHERE: ${scene}
WHAT THEY'RE DOING: ${action}
CAMERA DEFECT TO APPLY: ${defect}

MANDATORY REALISM RULES — violate ANY of these and the image FAILS:

SKIN: Visible pores on nose/cheeks. Uneven skin tone. Dry lips or chapped corner. Real capillaries near nostrils. Slight redness on cheeks/ears from activity. Small imperfections: a mosquito bite, a scratch, dry skin patch, mild acne if age-appropriate. Skin reflects environment light unevenly.

HAIR: Individual stray strands visible. Not every hair in place — flyaways, cowlicks. Hair has different thickness areas. If long, some tangles or knots. Slight oiliness near roots if end of day.

EYES: Visible blood vessels in sclera (whites). Catchlight from actual light source in scene (window, lamp). Iris has natural striations. Eyelashes have varying lengths, some clumped. Under-eye area slightly darker (kids get tired too).

HANDS & FINGERS: Correct anatomy — 5 fingers, proper proportions. Slightly dirty fingernails (kid!). Cuticles visible. Knuckle wrinkles. Band-aid possible.

CLOTHING: Real fabric wrinkles at elbows/knees. Slight pilling on cotton. Faded print or stretched collar. A stain, a loose thread, a size slightly too big or small. Tag sticking out at neck. Real seam lines visible.

ENVIRONMENT: Genuinely messy/lived-in. Dust visible in light beams. Scuff marks on furniture. Real objects that belong in a Turkish home (not decorative staging).

TECHNICAL:
- iPhone 13 computational photography look (Smart HDR, slight processing)
- EXIF-like characteristics: f/1.6, slight depth-of-field, 26mm equivalent
- Color science: slightly warm, not oversaturated
- Noise/grain in shadow areas (not perfectly clean)
- JPEG compression artifacts in dark gradients

ANTI-AI CHECKLIST (the image must PASS all):
✗ No waxy/plastic skin
✗ No symmetrical face (humans are asymmetric)
✗ No perfect teeth alignment
✗ No impossibly clean environment
✗ No merged/melted fingers
✗ No floating objects
✗ No text anywhere
✗ No uncanny valley eyes
✗ No over-saturated "HDR painting" look
✗ No uniform background blur (real bokeh has shape and imperfections)

This must look like a photo you'd find on a Turkish mom's phone — mundane, imperfect, real.`;

  const realPhoto = await generateImage(prompt, [], "3:4");
  return { realPhoto };
}
