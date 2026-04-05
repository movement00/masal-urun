import { generateImage } from "./geminiClient";
import type { Category } from "../categories";
import type { BookConcept } from "../types";

function getStylePromptForCategory(category: Category, concept: BookConcept): string {
  const { baslik, kahraman, sahneler } = concept;
  const firstScene = sahneler[0] || "";

  const characterDesc = `A ${kahraman.yas}-year-old Turkish ${kahraman.cinsiyet === "erkek" ? "boy" : "girl"} named ${kahraman.isim}. ${kahraman.fizikselOzellikler}. Wearing: ${kahraman.kiyafet}.`;

  const baseInstructions = `
PROFESSIONAL CHILDREN'S BOOK COVER DESIGN, A4 portrait format (2:3 aspect ratio).

TITLE TEXT (at top of cover, clearly visible and readable):
"${baslik}"
Use bold playful children's book font with Turkish characters PERFECTLY rendered (ş, ğ, ü, ö, ç, ı, İ)
Title should occupy top 20-25% of cover

CHARACTER (main subject, large, centered in middle portion):
${characterDesc}
Expression: warm, engaging, child-friendly
Big expressive eyes, welcoming smile, appealing pose

COMPOSITION:
- A4 vertical portrait
- Title at top
- Character dominates the middle
- Scene/background at bottom 30-40%
- Clean professional children's book design`;

  switch (category.visualStyle) {
    case "pixar-3d":
      return `${baseInstructions}

ART STYLE: Pixar/Disney 3D CGI animated movie style.
- High quality 3D rendering (like Toy Story, Finding Nemo, Encanto)
- Vibrant saturated colors
- Soft volumetric lighting
- Highly detailed character textures and subsurface scattering on skin
- Professional studio lighting with rim lights
- NO anime, NO 2D flat illustration
- Background scene: ${firstScene}
- Mood: ${concept.mood}

Category: ${category.name} — ${category.description}`;

    case "coloring-simple":
      return `${baseInstructions}

ART STYLE: Simple black-and-white coloring book cover for ages 2-5.
- BOLD thick BLACK outlines on WHITE background
- Very simple shapes — a toddler should be able to color inside
- Large, chunky character design
- Minimal detail, high clarity
- Only the TITLE can have color (bright and playful)
- Character outline only, NO shading, NO color fill
- Large basic shapes: circles, simple faces, chunky bodies

Scene: ${firstScene} (simplified to basic shapes)

This is a COLORING BOOK cover — designed for young children to color in.`;

    case "coloring-detailed":
      return `${baseInstructions}

ART STYLE: Detailed black-and-white coloring book cover for ages 6-10.
- Medium-thickness BLACK outlines on WHITE background
- More detailed scene with patterns, textures, and intricate elements
- Complex character design with detailed clothing/features
- Only the TITLE can have color
- Character and scene outline only, NO shading, NO color fill
- Intricate patterns, mandala elements, detailed environments

Scene: ${firstScene} (detailed with textures)

This is a COLORING BOOK cover — designed for older children who enjoy detailed coloring.`;

    case "gift-emotional":
      return `${baseInstructions}

ART STYLE: Emotional gift book cover — Pixar/Disney 3D CGI style with gift/celebration theme.
- Warm, emotional, heartwarming atmosphere
- Gift-related visual elements (ribbons, hearts, flowers, balloons, etc. based on category)
- Pastel warm colors with gold/soft highlights
- Character expressing love, celebration, or emotional warmth
- Soft bokeh lighting, magical feeling

Specific elements for "${category.name}": ${category.moodKeywords.join(", ")}
Scene: ${firstScene}

This is a GIFT BOOK — must appeal to both children AND adults who will purchase it.`;

    default:
      return baseInstructions;
  }
}

export async function generateCoverImage(
  category: Category,
  concept: BookConcept
): Promise<{ imageUrl: string; prompt: string }> {
  const prompt = getStylePromptForCategory(category, concept);
  const imageUrl = await generateImage(prompt, [], "2:3");
  return { imageUrl, prompt };
}
