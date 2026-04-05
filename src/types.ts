import type { Category } from "./categories";

export interface BookConcept {
  baslik: string;
  kahraman: {
    isim: string;
    yas: number;
    cinsiyet: "erkek" | "kiz";
    fizikselOzellikler: string;
    kiyafet: string;
  };
  ozet: string;
  sahneler: string[];
  kazanimlar: string[];
  yasGrubu: string;
  mood: string;
}

export interface GeneratedVisual {
  id: string;
  type:
    | "ref_portrait" | "ref_fullbody"
    | "hero" | "hero_shot" | "cover_45" | "open_book" | "flatlay" | "kazanimlar_poster"
    | "moment_reading_alone" | "moment_eating" | "moment_sleeping" | "moment_first_reaction"
    | "moment_parent_reading" | "moment_grandma" | "moment_morning" | "moment_showing_friend"
    | "transformation"
    // legacy types retained for backward compat
    | "gift" | "child_holding" | "parent_reading" | "hook" | "infographic" | "reaction";
  label: string;
  imageUrl: string;
  prompt: string;
}

export interface SeoContent {
  urunBasligi: string;
  metaDescription: string;
  kisaAciklama: string;
  uzunAciklama: string;
  anahtarKelimeler: string[];
  kazanimlar: { baslik: string; aciklama: string }[];
  nedenBuKitap: string;
  hediyeOlarak: string;
}

export interface GeneratedBook {
  id: string;
  categoryId: string;
  category: Category;
  concept: BookConcept;
  visuals: GeneratedVisual[];
  seo: SeoContent;
  createdAt: number;
  status: "generating" | "completed" | "error";
  error?: string;
}

export type GenerationStage =
  | "idle"
  | "concept"
  | "char_refs"
  | "cover"
  | "products"
  | "emotional"
  | "marketing"
  | "seo"
  | "done"
  | "error";
