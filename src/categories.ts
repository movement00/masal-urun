export type CategoryGroup = "hikaye" | "boyama" | "ozel-gun";

export interface Category {
  id: string;
  group: CategoryGroup;
  groupLabel: string;
  name: string;
  description: string;
  ageRange: string;
  visualStyle: "pixar-3d" | "coloring-simple" | "coloring-detailed" | "gift-emotional";
  emoji: string;
  moodKeywords: string[];
}

export const CATEGORIES: Category[] = [
  // ═══ HİKAYE KİTAPLARI (3D Pixar) ═══
  {
    id: "macera",
    group: "hikaye",
    groupLabel: "Hikaye Kitapları",
    name: "Macera Hikayeleri",
    description: "Heyecan dolu keşif ve cesaret hikayeleri",
    ageRange: "4-10",
    visualStyle: "pixar-3d",
    emoji: "🗺️",
    moodKeywords: ["heyecanlı", "cesur", "keşif", "macera", "dinamik"],
  },
  {
    id: "ogreten",
    group: "hikaye",
    groupLabel: "Hikaye Kitapları",
    name: "Öğreten Hikayeler",
    description: "Eğlenceli şekilde öğreten, bilgilendiren hikayeler",
    ageRange: "4-10",
    visualStyle: "pixar-3d",
    emoji: "🎓",
    moodKeywords: ["meraklı", "akıllı", "keşfedici", "bilgi", "eğitici"],
  },
  {
    id: "gercek-hayat",
    group: "hikaye",
    groupLabel: "Hikaye Kitapları",
    name: "Gerçek Hayat Hikayeleri",
    description: "Okul, arkadaşlık, aile, duygular",
    ageRange: "4-10",
    visualStyle: "pixar-3d",
    emoji: "🏡",
    moodKeywords: ["sıcak", "gerçekçi", "duygusal", "samimi", "aile"],
  },

  // ═══ BOYAMA KİTAPLARI (siyah-beyaz) ═══
  {
    id: "ilk-renkler",
    group: "boyama",
    groupLabel: "Boyama Kitapları",
    name: "İlk Renkler",
    description: "Basit, büyük, boyaması kolay sahneler",
    ageRange: "2-5",
    visualStyle: "coloring-simple",
    emoji: "🖍️",
    moodKeywords: ["basit", "büyük şekiller", "sevimli", "temel"],
  },
  {
    id: "renk-ustalari",
    group: "boyama",
    groupLabel: "Boyama Kitapları",
    name: "Renk Ustaları",
    description: "Detaylı, karmaşık boyama sayfaları",
    ageRange: "6-10",
    visualStyle: "coloring-detailed",
    emoji: "🎨",
    moodKeywords: ["detaylı", "karmaşık", "yaratıcı", "zorlayıcı"],
  },

  // ═══ ÖZEL GÜN HEDİYELERİ ═══
  {
    id: "dogum-gunu",
    group: "ozel-gun",
    groupLabel: "Özel Gün Hediyeleri",
    name: "Doğum Günü",
    description: "Doğum günü kutlaması temalı özel kitap",
    ageRange: "3-12",
    visualStyle: "gift-emotional",
    emoji: "🎂",
    moodKeywords: ["kutlama", "neşeli", "pasta", "hediye", "sürpriz"],
  },
  {
    id: "anneler-gunu",
    group: "ozel-gun",
    groupLabel: "Özel Gün Hediyeleri",
    name: "Anneler Günü",
    description: "Anneye sevgi ve teşekkür temalı",
    ageRange: "3-12",
    visualStyle: "gift-emotional",
    emoji: "💐",
    moodKeywords: ["sevgi", "anne", "teşekkür", "sıcak", "duygusal"],
  },
  {
    id: "babalar-gunu",
    group: "ozel-gun",
    groupLabel: "Özel Gün Hediyeleri",
    name: "Babalar Günü",
    description: "Babaya sevgi ve paylaşım temalı",
    ageRange: "3-12",
    visualStyle: "gift-emotional",
    emoji: "👨‍👧",
    moodKeywords: ["baba", "paylaşım", "güç", "sevgi", "kahraman"],
  },
  {
    id: "mezuniyet",
    group: "ozel-gun",
    groupLabel: "Özel Gün Hediyeleri",
    name: "Mezuniyet",
    description: "Başarı ve yeni dönem hediyesi",
    ageRange: "5-18",
    visualStyle: "gift-emotional",
    emoji: "🎓",
    moodKeywords: ["başarı", "gurur", "kep", "diploma", "yolculuk"],
  },
  {
    id: "sevgililer-gunu",
    group: "ozel-gun",
    groupLabel: "Özel Gün Hediyeleri",
    name: "Sevgililer Günü",
    description: "Sevgi ve romantik duygu temalı",
    ageRange: "0-99",
    visualStyle: "gift-emotional",
    emoji: "💝",
    moodKeywords: ["sevgi", "kalp", "romantik", "tatlı", "sıcak"],
  },
  {
    id: "evlilik-teklifi",
    group: "ozel-gun",
    groupLabel: "Özel Gün Hediyeleri",
    name: "Evlilik Teklifi",
    description: "Özel evlilik teklifi anı için",
    ageRange: "18+",
    visualStyle: "gift-emotional",
    emoji: "💍",
    moodKeywords: ["romantik", "yüzük", "söz", "özel", "duygusal"],
  },
];

export const CATEGORY_GROUPS = [
  { id: "hikaye" as CategoryGroup, label: "Hikaye Kitapları", emoji: "📚" },
  { id: "boyama" as CategoryGroup, label: "Boyama Kitapları", emoji: "🎨" },
  { id: "ozel-gun" as CategoryGroup, label: "Özel Gün Hediyeleri", emoji: "🎁" },
];

export const getCategoriesByGroup = (group: CategoryGroup) =>
  CATEGORIES.filter(c => c.group === group);

export const getCategoryById = (id: string) =>
  CATEGORIES.find(c => c.id === id);
