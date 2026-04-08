import { generateText, Type } from "./geminiClient";
import type { Category } from "../categories";
import type { BookConcept } from "../types";

// ═══ TÜRK DEMOGRAFİSİ — AI'ın "varsayılan sarışın" eğilimini kırmak için ═══
// Gerçek Türk çocuk demografisini yansıtan dağılımlar.
// JS tarafında rastgele seçim yapılır, AI'a bırakılmaz.

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const SAC_RENKLERI = [
  "koyu siyah", "koyu kahverengi", "kestane kahverengi", "koyu kahverengi",
  "siyah", "koyu kestane", "kahverengi", "koyu kahverengi",
  // nadir ama var: %10 civarı
  "açık kahverengi", "bal rengi kahverengi",
];

const SAC_STILLERI = [
  "kısa dağınık", "düz kısa kaküllü", "kısa kenardan ayrılmış",
  "iki örgülü", "at kuyruğu bağlı", "omuz hizası dalgalı", "kıvırcık kısa",
  "kabarık bukleli", "topuz yapılmış", "perçemli düz", "yanlardan kısaltılmış üstü uzun",
  "doğal dalgalı omuz altı", "kısa taranmamış dağınık", "bandana ile tutturulmuş",
];

const GOZ_RENKLERI = [
  "koyu kahverengi", "kahverengi", "siyaha yakın koyu", "ela",
  "kahverengi", "koyu kahverengi", "kestane kahverengi",
  // nadir: %10
  "yeşilimsi ela", "bal rengi",
];

const GOZ_SEKILLERI = [
  "badem şeklinde", "iri yuvarlak", "hafif çekik", "büyük canlı",
  "dar badem", "hafif aşağı kıvrık", "geniş açık",
];

const TEN_TONLARI = [
  "buğday", "açık buğday", "esmer", "buğday", "mat açık",
  "zeytinyağı tonu", "buğday", "açık esmer", "buğday", "esmer",
];

const AYIRT_EDICI_OZELLIKLER = [
  "yanağında birkaç çil", "tek gamze (sol yanak)", "tek gamze (sağ yanak)",
  "ön dişlerde hafif aralık", "diş teli", "yuvarlak gözlük",
  "kulakları hafif kepçe", "burnunda küçük yara izi", "çene çukuru",
  "sol kaşında küçük doğum lekesi", "tombulca yanaklar", "kısa boylu tıknaz",
  "uzun boylu sıska", "alnında küçük bir yara bandı", "saçında renkli toka",
  "ince uzun parmaklar", "burnunun ucunda çiller", "sağ dizinde yara bandı",
  "hafif kalkık burun", "geniş gülümsemeli yüz", "kalın kaşlar",
  "küçük sivri çene", "yuvarlak dolgun yüz", "ince dudaklar geniş ağız",
];

function generateAppearanceDirective(): string {
  const sacRenk = pick(SAC_RENKLERI);
  const sacStil = pick(SAC_STILLERI);
  const gozRenk = pick(GOZ_RENKLERI);
  const gozSekil = pick(GOZ_SEKILLERI);
  const ten = pick(TEN_TONLARI);
  // 2-3 ayırt edici özellik seç (tekrarsız)
  const shuffled = [...AYIRT_EDICI_OZELLIKLER].sort(() => Math.random() - 0.5);
  const ozellikler = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));

  return `ZORUNLU FİZİKSEL ÖZELLİKLER (bunları AYNEN kullan, değiştirme):
  - Saç rengi: ${sacRenk}
  - Saç stili: ${sacStil}
  - Göz rengi: ${gozRenk}
  - Göz şekli: ${gozSekil}
  - Ten tonu: ${ten}
  - Ayırt edici özellikler: ${ozellikler.join(", ")}`;
}

export async function generateBookConcept(
  category: Category,
  previousTitles: string[]
): Promise<BookConcept> {
  const previousList = previousTitles.length > 0
    ? `\n\nGEÇMİŞTE ÜRETİLEN KİTAPLAR (bunlardan FARKLI olmalı):\n${previousTitles.map(t => `- ${t}`).join("\n")}`
    : "";

  const appearanceDirective = generateAppearanceDirective();

  const prompt = `Sen MasalSensin için çocuk kitabı konsept uzmanısın. Kişiye özel çocuk hikaye/boyama/hediye kitapları üretiyoruz.

KATEGORİ BİLGİSİ:
- Grup: ${category.groupLabel}
- Kategori: ${category.name}
- Açıklama: ${category.description}
- Yaş Grubu: ${category.ageRange}
- Mood: ${category.moodKeywords.join(", ")}
${previousList}

GÖREV: Bu kategori için ÖZGÜN bir çocuk kitabı konsepti üret.

TÜRK DEMOGRAFİSİ KRİTİK KURAL:
Bu kitaplar TÜRK çocukları için. Karakter GERÇEK bir Türk çocuğu gibi görünmeli.
Aşağıdaki fiziksel özellikleri fizikselOzellikler alanında AYNEN kullan — bunlar JS tarafında rastgele seçildi:

${appearanceDirective}

ÖZELLİKLER:
- Özgün Türkçe başlık (maks 6 kelime, önceki başlıklardan FARKLI) — MUTLAKA kahramanın ismiyle başlamalı, Türkçe tamlama formatında. Örnekler: "Zeynep'in Okul Macerası", "Can'ın Uzay Yolculuğu", "Elif ve Sihirli Orman", "Mert'in İlk Günü". İsmin eki doğru olmalı (Zeynep'in, Can'ın, Ayşe'nin, Mert'in, Yiğit'in, Defne'nin). İsim başlıkta açıkça geçmezse başlık GEÇERSİZ.
- Gerçek Türk ismi olan bir kahraman (Elif, Ayşe, Can, Yiğit, Defne, Mert, Zeynep, Beren, Arda, Nehir, Kerem, Asya, Ömer, Duru, Emir, Azra, Kaan, Ecrin, Burak, İdil, Deniz, Lina, Atlas, Mira vs.)
- fizikselOzellikler: Yukarıdaki ZORUNLU özellikleri İngilizce olarak detaylı bir paragraf halinde yaz (AI görsel üretimi için). Saç rengi+stili, göz rengi+şekli, ten tonu, ayırt edici özelliklerin TÜMÜ dahil olmalı.
- İfade: doğal mood (utangaç mı, afacan mı, meraklı mı, hayalperest mi)
- Kıyafet tanımı — temaya uygun ve gerçekçi (spor forması, okul üniforması, parti kıyafeti, kışlık mont, tişört + şort, elbise, büyük pantolon, yazlık sandalet, yağmurluk, kolları sıvanmış gömlek vb.)
- 5-7 cümlelik kısa özet
- 5-7 sahne (hikayenin akışı)
- 3-5 çocuk kazanımı (değer, beceri, duygu)
- Ana mood

YASAK:
- Sarışın mavi gözlü karakter üretme (Türk demografisine uygun değil)
- "Brown hair warm smile" gibi generic klişe tanım
- Batılı/Kuzey Avrupalı görünümlü karakter
- Önceki karakterlerle aynı isim

ÖNEMLİ KURALLAR:
- Türkçe doğal, çocuğa okunabilir dil
- fizikselOzellikler İngilizce paragraf olmalı (AI image generation için)
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
  const appearanceDirective = generateAppearanceDirective();

  const prompt = `Sen MasalSensin için kişiye özel çocuk kitabı konsept uzmanısın.

KULLANICI İSTEĞİ: "${userPrompt}"

GÖREV: Bu istekten yola çıkarak tam bir çocuk hikaye kitabı konsepti üret.

TÜRK DEMOGRAFİSİ KRİTİK KURAL:
Bu kitaplar TÜRK çocukları için. Karakter GERÇEK bir Türk çocuğu gibi görünmeli.
Aşağıdaki fiziksel özellikleri fizikselOzellikler alanında AYNEN kullan — bunlar JS tarafında rastgele seçildi:

${appearanceDirective}

ÖZELLİKLER:
- Kullanıcı bir çocuk ismi yazmışsa onu kahraman yap. Yazmamışsa uygun bir Türk ismi seç.
- Kullanıcının belirttiği tema/fikre dayalı özgün bir hikaye kur.
- Başlık MUTLAKA çocuğun ismiyle başlamalı, Türkçe tamlama formatında. Örnekler: "Reha'nın Fenerbahçe Macerası", "Zeynep'in Balerin Hayali". İsmin eki doğru olmalı (Reha'nın, Ayşe'nin, Mert'in, Yiğit'in). Başlık maks 6 kelime. İsim başlıkta GEÇMEZSE başlık GEÇERSİZ.
- fizikselOzellikler: Yukarıdaki ZORUNLU özellikleri İngilizce olarak detaylı bir paragraf halinde yaz (AI görsel üretimi için). Saç rengi+stili, göz rengi+şekli, ten tonu, ayırt edici özelliklerin TÜMÜ dahil olmalı.
- Kullanıcı yaş/cinsiyet yazmamışsa temaya uygun tahmin et
- Kıyafet temaya uygun + gerçekçi detay (forma numarası, yırtılmış diz, kir lekesi, eski sevilen kıyafet)
- 5-7 cümlelik kısa özet
- 5-7 sahne (hikayenin akışı, temaya göre)
- 3-5 çocuk kazanımı
- Ana mood

YASAK:
- Sarışın mavi gözlü karakter üretme (Türk demografisine uygun değil)
- "Brown hair warm smile" gibi generic klişe tanım
- Batılı/Kuzey Avrupalı görünümlü karakter

KURALLAR:
- Türkçe doğal dil, çocuğa okunabilir
- fizikselOzellikler İngilizce paragraf olmalı (AI image generation için)
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
