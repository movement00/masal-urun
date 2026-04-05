import { generateText, Type } from "./geminiClient";
import type { Category } from "../categories";
import type { BookConcept } from "../types";

export async function generateBookConcept(
  category: Category,
  previousTitles: string[]
): Promise<BookConcept> {
  const previousList = previousTitles.length > 0
    ? `\n\nGEÇMİŞTE ÜRETİLEN KİTAPLAR (bunlardan FARKLI olmalı):\n${previousTitles.map(t => `- ${t}`).join("\n")}`
    : "";

  const prompt = `Sen MasalSensin için çocuk kitabı konsept uzmanısın. Kişiye özel çocuk hikaye/boyama/hediye kitapları üretiyoruz.

KATEGORİ BİLGİSİ:
- Grup: ${category.groupLabel}
- Kategori: ${category.name}
- Açıklama: ${category.description}
- Yaş Grubu: ${category.ageRange}
- Mood: ${category.moodKeywords.join(", ")}
${previousList}

GÖREV: Bu kategori için ÖZGÜN bir çocuk kitabı konsepti üret.

ÖZELLİKLER:
- Özgün Türkçe başlık (maks 6 kelime, önceki başlıklardan FARKLI) — MUTLAKA kahramanın ismiyle başlamalı, Türkçe tamlama formatında. Örnekler: "Zeynep'in Okul Macerası", "Can'ın Uzay Yolculuğu", "Elif ve Sihirli Orman", "Mert'in İlk Günü". İsmin eki doğru olmalı (Zeynep'in, Can'ın, Ayşe'nin, Mert'in, Yiğit'in, Defne'nin). İsim başlıkta açıkça geçmezse başlık GEÇERSİZ.
- Gerçek Türk ismi olan bir kahraman (Elif, Ayşe, Can, Yiğit, Defne, Mert vs.)
- Karakterin DETAYLI ve ÖZGÜN fiziksel tanımı (AI görsel üretimi için):
  * Yaş, cinsiyet — belirt
  * Saç: renk + stil + özellik (dağınık kıvırcık siyah, düz kısa kahverengi kaküllü, at kuyruğu bağlı sarı, iki örgülü bal rengi, kel tıraşlı, alnına düşen perçemli vs.) — varyasyon şart
  * Göz: renk + şekil (badem siyah, büyük kahverengi, çekik ela, gri-mavi, iri yeşil)
  * Ten: açık/buğday/esmer/bronz
  * EN AZ 2 AYIRT EDİCİ ÖZELLİK ZORUNLU (non-negotiable): çil, gamze, diş aralığı, diş teli, gözlük, kulak kepçesi, burnunda küçük yara izi, çene çukuru, doğum lekesi, tek gamze, kısa boy, tombulca, uzun boylu sıska, ince parmaklar, yara/morluk, band-aid, renkli toka, vb. — KLİŞEDEN KAÇIN
  * İfade: doğal mood (utangaç mı, afacan mı, meraklı mı, hayalperest mi)
  * "Brown hair warm smile" tarzı klişe YASAK — her karakter özel olsun
- Kıyafet tanımı — temaya uygun ve gerçekçi (sadece pijama/t-shirt değil: spor forması, okul üniforması, parti kıyafeti, kışlık mont, tişört + şort, elbise, pareo, abla kazağı, büyük pantolon, uzun kollu çiçekli)
- 5-7 cümlelik kısa özet
- 5-7 sahne (hikayenin akışı)
- 3-5 çocuk kazanımı (değer, beceri, duygu)
- Ana mood

ÖNEMLİ KURALLAR:
- Önceki karakterlerden FARKLI isim kullan
- Türkçe doğal, çocuğa okunabilir dil
- ${category.visualStyle === "coloring-simple" ? "2-5 yaş için basit, büyük karakter" : ""}
- ${category.visualStyle === "coloring-detailed" ? "6-10 yaş için detaylı sahne" : ""}
- ${category.group === "ozel-gun" ? "Duygusal, hediye atmosferi yansıtan tema" : ""}

SADECE JSON döndür.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      baslik: { type: Type.STRING },
      kahraman: {
        type: Type.OBJECT,
        properties: {
          isim: { type: Type.STRING },
          yas: { type: Type.NUMBER },
          cinsiyet: { type: Type.STRING },
          fizikselOzellikler: { type: Type.STRING },
          kiyafet: { type: Type.STRING },
        },
        required: ["isim", "yas", "cinsiyet", "fizikselOzellikler", "kiyafet"],
      },
      ozet: { type: Type.STRING },
      sahneler: { type: Type.ARRAY, items: { type: Type.STRING } },
      kazanimlar: { type: Type.ARRAY, items: { type: Type.STRING } },
      yasGrubu: { type: Type.STRING },
      mood: { type: Type.STRING },
    },
    required: ["baslik", "kahraman", "ozet", "sahneler", "kazanimlar", "yasGrubu", "mood"],
  };

  const responseText = await generateText(prompt, schema);
  return JSON.parse(responseText) as BookConcept;
}

/**
 * Generate a book concept from a free-text user prompt.
 * e.g. "Reha Fenerbahçe Kaptanı" → full story concept with Reha as the hero.
 * The user prompt MAY include the child's name and theme — concept agent extracts
 * them and builds everything else.
 */
export async function generateBookConceptFromPrompt(
  userPrompt: string
): Promise<BookConcept> {
  const prompt = `Sen MasalSensin için kişiye özel çocuk kitabı konsept uzmanısın.

KULLANICI İSTEĞİ: "${userPrompt}"

GÖREV: Bu istekten yola çıkarak tam bir çocuk hikaye kitabı konsepti üret.

ÖZELLİKLER:
- Kullanıcı bir çocuk ismi yazmışsa onu kahraman yap. Yazmamışsa uygun bir Türk ismi seç.
- Kullanıcının belirttiği tema/fikre dayalı özgün bir hikaye kur.
- Başlık MUTLAKA çocuğun ismiyle başlamalı, Türkçe tamlama formatında. Örnekler: "Reha'nın Fenerbahçe Macerası", "Zeynep'in Balerin Hayali". İsmin eki doğru olmalı (Reha'nın, Ayşe'nin, Mert'in, Yiğit'in). Başlık maks 6 kelime. İsim başlıkta GEÇMEZSE başlık GEÇERSİZ.
- Karakter fiziksel tanımı DETAYLI + ÖZGÜN olmalı:
  * Saç: renk+stil+özellik varyasyonu (dağınık kıvırcık, kısa kaküllü, at kuyruğu, örgülü, tıraşlı, perçemli)
  * Göz: renk+şekil (badem/büyük/çekik/iri)
  * Ten: açık/buğday/esmer/bronz
  * EN AZ 2 AYIRT EDİCİ ÖZELLİK ZORUNLU: çil, gamze, diş aralığı, gözlük, kulak kepçesi, yara izi, doğum lekesi, band-aid, renkli toka, tombulca, ince uzun vs. KLİŞE YASAK.
  * "Brown hair warm smile" gibi generic tanım YASAK
- Kullanıcı yaş/cinsiyet yazmamışsa temaya uygun tahmin et
- Kıyafet temaya uygun + gerçekçi detay (forma numarası, yırtılmış diz, kir lekesi, eski sevilen kıyafet)
- 5-7 cümlelik kısa özet
- 5-7 sahne (hikayenin akışı, temaya göre)
- 3-5 çocuk kazanımı
- Ana mood

KURALLAR:
- Türkçe doğal dil, çocuğa okunabilir
- Kullanıcının fikrini genişlet ama özünü değiştirme

SADECE JSON döndür.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      baslik: { type: Type.STRING },
      kahraman: {
        type: Type.OBJECT,
        properties: {
          isim: { type: Type.STRING },
          yas: { type: Type.NUMBER },
          cinsiyet: { type: Type.STRING },
          fizikselOzellikler: { type: Type.STRING },
          kiyafet: { type: Type.STRING },
        },
        required: ["isim", "yas", "cinsiyet", "fizikselOzellikler", "kiyafet"],
      },
      ozet: { type: Type.STRING },
      sahneler: { type: Type.ARRAY, items: { type: Type.STRING } },
      kazanimlar: { type: Type.ARRAY, items: { type: Type.STRING } },
      yasGrubu: { type: Type.STRING },
      mood: { type: Type.STRING },
    },
    required: ["baslik", "kahraman", "ozet", "sahneler", "kazanimlar", "yasGrubu", "mood"],
  };

  const responseText = await generateText(prompt, schema);
  return JSON.parse(responseText) as BookConcept;
}
