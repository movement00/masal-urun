import { generateImage } from "./geminiClient";
import type { BookConcept, GeneratedVisual } from "../types";
import type { CharacterReference } from "./characterReferenceAgent";

interface EmotionalMoment {
  type: GeneratedVisual["type"];
  label: string;
  aspectRatio: string;
  promptBuilder: (concept: BookConcept) => string;
}

const PHOTO_AESTHETIC = `
PHOTOGRAPHIC STYLE — natural parent-taken moment, iPhone-style:
- Shot on iPhone, handheld, candid — NOT staged studio photography
- Natural home lighting (window, warm lamps), real imperfections
- Documentary family moment feel — like a mom captured it without the child noticing
- Photorealistic, warm, intimate. NO CGI, NO Pixar, NO illustration. Real people.
- Turkish household: warm wood, knit blankets, pastel interior, everyday life`;

const EMOTIONAL_MOMENTS: EmotionalMoment[] = [
  {
    type: "moment_reading_alone",
    label: "Çocuk Tek Başına Okurken",
    aspectRatio: "3:4",
    promptBuilder: (c) => `Candid iPhone photo of the child (from reference images — SAME child, same face, same features as the reference) sitting cross-legged on a cozy living room rug, COMPLETELY absorbed in the soft-cover storybook.

BOOK: Title "${c.baslik}" visible on cover. Thin flexible soft-cover children's book.
CHILD: Age ${c.kahraman.yas}, eyes locked onto the pages, finger tracing a line. Slight smile of discovery.
SCENE: Afternoon light through a window, knit blanket nearby, a toy bear off to the side. Quiet magical moment.
${PHOTO_AESTHETIC}`,
  },
  {
    type: "moment_eating",
    label: "Yemek Yerken Kitap Yanında",
    aspectRatio: "3:4",
    promptBuilder: (c) => `Candid iPhone photo of the child (from reference images — exact same child) at the family dining table eating breakfast, with the soft-cover storybook propped open beside the plate.

BOOK: Title "${c.baslik}" visible. Child glances at the book while eating.
CHILD: Age ${c.kahraman.yas}, spoon mid-air, eyes on the book instead of the food, mother's blurred arm in background.
SCENE: Sunny morning kitchen, warm wood table, milk glass, fruit plate. Everyday life.
${PHOTO_AESTHETIC}`,
  },
  {
    type: "moment_sleeping",
    label: "Kitapla Uykuya Dalmış",
    aspectRatio: "3:4",
    promptBuilder: (c) => `Tender iPhone photo of the child (from reference images — same child) fallen asleep in bed with the storybook resting on their chest, one hand still holding a page.

BOOK: Title "${c.baslik}" visible on the soft-cover. Thin flexible book.
CHILD: Age ${c.kahraman.yas}, peaceful sleeping face, small smile, slightly messy hair on pillow.
SCENE: Bedside lamp warm glow, soft patterned bedsheet, a stuffed animal nearby. Quiet bedtime moment a parent would photograph.
${PHOTO_AESTHETIC}`,
  },
  {
    type: "moment_first_reaction",
    label: "İlk Gördüğü An (Dönüşüm)",
    aspectRatio: "9:16",
    promptBuilder: (c) => `Emotional iPhone photo capturing the MOMENT the child (from reference images — same child) sees their personalized book for the first time.

BOOK: Title "${c.baslik}" — the child is holding it, seeing their own name on the cover.
CHILD: Age ${c.kahraman.yas}, wide-eyed shock, mouth open in "Bu BENİM!" realization, hand covering cheek. Parent's hand visible at edge having just handed it over.
SCENE: Living room or bedroom, soft window light on the face, close-up on child's expression with book visible. Pure wonder.
${PHOTO_AESTHETIC}
This is THE emotional hook — the "that's ME!" moment parents pay to create.`,
  },
  {
    type: "moment_parent_reading",
    label: "Anne/Baba ile Okuma Anı",
    aspectRatio: "4:3",
    promptBuilder: (c) => `Intimate iPhone photo of a Turkish parent reading the storybook with the child (from reference images — same child) snuggled beside them on the couch.

BOOK: Open in the parent's lap, title "${c.baslik}" visible on the cover. Child pointing at an illustration excitedly.
SCENE: Evening warm light, soft throw blanket, child leaning into parent's shoulder. Safe, loving, nostalgic moment.
${PHOTO_AESTHETIC}
The kind of photo grandparents share.`,
  },
  {
    type: "moment_grandma",
    label: "Büyükanne Hediyesi",
    aspectRatio: "3:4",
    promptBuilder: (c) => `iPhone photo of a Turkish grandmother (babaanne/anneanne) giving the personalized book to her grandchild (from reference images — same child).

BOOK: Grandmother holds it out to the child, title "${c.baslik}" visible. Wrapping paper partially torn off at the edge.
MOMENT: Two generations locked in eye contact — grandmother smiling knowingly, child's face lighting up. Intergenerational love.
SCENE: Grandmother's warm living room, doilies on a table, framed family photos blurred in background.
${PHOTO_AESTHETIC}`,
  },
  {
    type: "moment_morning",
    label: "Sabah İlk Aradığı Kitap",
    aspectRatio: "3:4",
    promptBuilder: (c) => `Candid iPhone photo of the child (from reference images — same child) just woken up, pajamas on, reaching for the storybook on the nightstand before even getting out of bed.

BOOK: Title "${c.baslik}" visible. Child's hand stretching toward it.
CHILD: Age ${c.kahraman.yas}, sleepy eyes, messy morning hair, pajamas. Genuine "I want MY book" gesture.
SCENE: Morning light through curtain, messy bed, the storybook almost within reach.
${PHOTO_AESTHETIC}
Shows the book is the child's favorite — first thought of the day.`,
  },
  {
    type: "moment_showing_friend",
    label: "Arkadaşına Gösterirken",
    aspectRatio: "4:3",
    promptBuilder: (c) => `iPhone photo of the child (from reference images — same child) proudly showing the personalized book to a friend at a park bench or playroom.

BOOK: Title "${c.baslik}" visible, child pointing at their own name with excitement.
CHILDREN: Proud hero-child and curious friend, heads close together over the book, genuine kid friendship moment.
SCENE: Playground or bright playroom, natural daylight.
${PHOTO_AESTHETIC}
Social proof — kids showing off personalized products to friends.`,
  },
];

// Transformation visual: real photo → Pixar character (split screen)
const TRANSFORMATION: EmotionalMoment = {
  type: "transformation",
  label: "Dönüşüm: Gerçek → Kahraman",
  aspectRatio: "2:3",
  promptBuilder: (c) => `Split-screen marketing visual showing the transformation from real child to book character.

LAYOUT: Vertical split (50/50).
LEFT SIDE: A polaroid-style photo of the real child (from reference images — SAME child, iPhone snapshot aesthetic). Caption beneath: "Senin çocuğun"
RIGHT SIDE: The exact same child transformed into their 3D Pixar-stylized book character on the cover of "${c.baslik}". Same face features recognizable — bigger eyes, softer Pixar proportions. Caption beneath: "Onun hikayesi"

CENTER: A glowing arrow "→" or soft sparkle transition effect connecting the two sides.

BACKGROUND: Soft warm cream gradient. Clean, premium, easy to understand.

Turkish captions PERFECT. Polaroid side feels real and handmade; Pixar side feels magical and cinematic. This image shows parents EXACTLY what they'll get.`,
};

export async function generateEmotionalMoments(
  concept: BookConcept,
  characterRefs: CharacterReference,
  heroCoverUrl: string,
  onVisualReady?: (visual: GeneratedVisual) => void
): Promise<GeneratedVisual[]> {
  const results: GeneratedVisual[] = [];
  const refs = [characterRefs.refPortrait, characterRefs.refFullBody];
  const refsWithCover = [...refs, heroCoverUrl];

  // All moments use character refs + cover (for book consistency)
  const allMoments = [...EMOTIONAL_MOMENTS, TRANSFORMATION];

  for (const moment of allMoments) {
    try {
      const prompt = moment.promptBuilder(concept);
      // Transformation uses refs + cover, others use refs + cover for book visibility
      const imageUrl = await generateImage(prompt, refsWithCover, moment.aspectRatio);
      const visual: GeneratedVisual = {
        id: moment.type,
        type: moment.type,
        label: moment.label,
        imageUrl,
        prompt,
      };
      results.push(visual);
      onVisualReady?.(visual);
    } catch (err: any) {
      console.error(`Failed to generate ${moment.type}:`, err);
    }
  }

  return results;
}
