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
    | "real_photo"
    | "front_cover"
    | "back_cover"
    | "hook_lifestyle"
    | "transformation"
    | "flat_lay"
    | "note_page"
    | "cover_duo";
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
  altTexts?: {
    realPhoto: string;
    frontCover: string;
    backCover: string;
    hookLifestyle: string;
    transformation: string;
    flatLay?: string;
    notePage?: string;
    coverDuo?: string;
  };
  faq?: { soru: string; cevap: string }[];
  slug?: string;
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
  | "real_photo"
  | "covers"
  | "hook"
  | "product"
  | "seo"
  | "done"
  | "error";
