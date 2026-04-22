import { generateText, Type } from "./geminiClient";
import type { Category } from "../categories";
import type { BookConcept, SeoContent } from "../types";

export async function generateSeoContent(
  concept: BookConcept,
  category: Category
): Promise<SeoContent> {
  const prompt = `Sen Türkiye'deki e-ticaret siteleri için SEO uzmanı bir metin yazarısın. MasalSensin adlı kişiye özel çocuk kitabı markası için ürün sayfası içeriği üreteceksin.

ÜRÜN BİLGİSİ:
- Kitap Başlığı: ${concept.baslik}
- Kategori: ${category.name} (${category.groupLabel})
- Açıklama: ${category.description}
- Kahraman: ${concept.kahraman.isim} (${concept.kahraman.yas} yaşında)
- Yaş Grubu: ${concept.yasGrubu}
- Mood: ${concept.mood}
- Özet: ${concept.ozet}
- Sahneler: ${concept.sahneler.join(", ")}
- Kazanımlar: ${concept.kazanimlar.join(", ")}

GÖREV: Aşağıdaki JSON formatında TÜRKÇE SEO içeriği üret.

ÖNEMLİ KURALLAR:
- Türkçe karakterler MUTLAKA doğru: ş, ğ, ü, ö, ç, ı, İ
- Duygusal ama gerçekçi ton (ebeveyn-ebeveyn konuşması)
- SEO dostu ama doğal
- Ebeveynler VE hediye alıcıları (büyükanne, teyze) için
- Çocuğun NE kazandığını vurgula
- "Kişiye özel" unique value prop
- Uzun açıklama HTML formatında (p, ul, li, strong, h3)

URUN BAŞLIĞI FORMATI:
"${concept.baslik} - ${category.name} Çocuk Kitabı - MasalSensin" (70 karakter altı)

META DESCRIPTION: Maks 155 karakter, call-to-action içersin

UZUN AÇIKLAMA YAPISI:
<p>Duygusal hook (2-3 cümle)</p>
<p>Hikaye tanıtımı</p>
<h3>Bu Kitap Çocuğunuza Ne Kazandırır?</h3>
<ul>
  <li><strong>[Kazanım]:</strong> Açıklama</li>
</ul>
<h3>Kitap Özellikleri</h3>
<ul>
  <li>A4 yumuşak kapak</li>
  <li>Renkli Pixar kalitesinde illüstrasyonlar</li>
  <li>Kişiye özel isim ve fotoğraf entegrasyonu</li>
</ul>
<p>Hediye/urgency mesajı</p>

SADECE JSON döndür.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      urunBasligi: { type: Type.STRING },
      metaDescription: { type: Type.STRING },
      kisaAciklama: { type: Type.STRING },
      uzunAciklama: { type: Type.STRING },
      anahtarKelimeler: { type: Type.ARRAY, items: { type: Type.STRING } },
      kazanimlar: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            baslik: { type: Type.STRING },
            aciklama: { type: Type.STRING },
          },
          required: ["baslik", "aciklama"],
        },
      },
      nedenBuKitap: { type: Type.STRING },
      hediyeOlarak: { type: Type.STRING },
    },
    required: ["urunBasligi", "metaDescription", "kisaAciklama", "uzunAciklama", "anahtarKelimeler", "kazanimlar", "nedenBuKitap", "hediyeOlarak"],
  };

  const responseText = await generateText(prompt, schema);
  return JSON.parse(responseText) as SeoContent;
}
