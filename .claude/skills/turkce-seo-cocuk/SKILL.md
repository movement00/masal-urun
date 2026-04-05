---
name: turkce-seo-cocuk
description: Türkçe çocuk ürünleri için SEO metin üretimi (başlık, açıklama, meta, kazanımlar). Use when generating product page content for children's books targeting Turkish parents/gift buyers.
---

# Türkçe Çocuk Ürünleri SEO Metin Üretici

Çocuk kitabı ürün sayfası için Türkçe SEO uyumlu, duygusal ve dönüşüm odaklı metinler üretir.

## Üretilecek Metinler

```json
{
  "urunBasligi": "string (maks 70 karakter, SEO uyumlu)",
  "metaDescription": "string (maks 155 karakter)",
  "kisaAciklama": "string (2-3 cümle, ürün listesi için)",
  "uzunAciklama": "string (HTML formatında, paragraflar + liste)",
  "anahtarKelimeler": ["5-10 adet"],
  "kazanimlar": [
    { "baslik": "string", "aciklama": "string" }
  ],
  "nedenBuKitap": "string (2-3 cümle hook)",
  "hediyeOlarak": "string (hediye alıcısı için metin)"
}
```

## Başlık Formatı

Formül: `[Kitap Başlığı] - [Kategori] Çocuk Hikaye Kitabı - MasalSensin`

Örnekler:
- "Yiğit'in Uzay Macerası - Macera Hikaye Kitabı - MasalSensin"
- "Ayşe ile Renkler - İlk Renkler Boyama Kitabı - MasalSensin"
- "Özel Doğum Günün Kutlu Olsun - Hediye Kitabı - MasalSensin"

Karakter sınırı: 70 karakter (Google listeleme için)

## Meta Description

- Maks 155 karakter
- Ürünün ana değer önermesi
- Call-to-action
- Türkçe SEO anahtar kelimeleri dahil

Örnek:
"Yiğit'in Uzay Macerası, çocuğunuzu cesaret ve keşif ruhuyla büyüten Pixar kalitesinde kişiye özel hikaye kitabı. Hemen keşfedin!"

## Uzun Açıklama Yapısı

HTML formatında, paragraf + liste:

```html
<p>Duygusal hook açılış paragrafı (2-3 cümle)...</p>

<p>Kitap tanıtımı: hikayesi, kahramanı, geçtiği yer...</p>

<h3>Bu Kitap Çocuğunuza Ne Kazandırır?</h3>
<ul>
  <li><strong>[Kazanım 1]:</strong> Açıklama</li>
  <li><strong>[Kazanım 2]:</strong> Açıklama</li>
  <li><strong>[Kazanım 3]:</strong> Açıklama</li>
</ul>

<h3>Kitap Özellikleri</h3>
<ul>
  <li>A4 boyut, yumuşak kapak</li>
  <li>[sayfa sayısı] sayfa, renkli illüstrasyonlar</li>
  <li>Pixar kalitesinde 3D karakter tasarımı</li>
  <li>Kişiye özel: isminizi ve fotoğrafınızı ekliyoruz</li>
</ul>

<p>Hediye mesajı / urgency paragrafı...</p>
```

## Kazanımlar (Çocuk Gelişimi)

Her kitap için 3-5 kazanım belirle. Her biri:
- Başlık: 1-2 kelime (ör: "Özgüven", "Hayal Gücü")
- Açıklama: 1 cümle (neden önemli + bu kitap nasıl katkı sağlar)

Kategori bazlı yaygın kazanımlar:

**Macera**: Cesaret, Keşif, Problem Çözme, Dayanıklılık, Sosyal Beceri
**Öğreten**: Merak, Bilimsel Düşünce, Odaklanma, Genel Kültür
**Gerçek Hayat**: Empati, Duygu Yönetimi, İletişim, Sorumluluk
**Boyama**: Motor Becerisi, Yaratıcılık, Sabır, Renk Algısı
**Özel Gün**: Sevgi, Aile Bağı, Anı Oluşturma, Özel Hissi

## Anahtar Kelimeler

Kategori bazında önerilen anahtar kelimeler:

### Genel
- kişiye özel çocuk kitabı
- kisisel hikaye kitabı
- çocuk hediyesi
- 3D karakter çocuk kitabı
- pixar tarzı çocuk kitabı

### Hikaye Kitapları
- çocuk macera kitabı
- eğitici çocuk kitabı
- çocuk hikaye seti

### Boyama
- çocuk boyama kitabı
- eğitici boyama
- yaş gruplu boyama

### Özel Gün
- doğum günü hediyesi
- anneler günü hediye
- özel gün kitabı
- kişiye özel hediye

## "Neden Bu Kitap" Hook

2-3 cümlede duygusal bağ kur:
- Ebeveynin sorunu/arzusu
- Bu kitabın farkı
- Sonuç (çocuğun hayatında değişim)

Örnek:
"Çocuğunuzun kendini bir kahraman gibi hissetmesini ister misiniz? Yiğit'in Uzay Macerası sadece bir hikaye değil — sizin çocuğunuzun gurur duyacağı, yıllarca sakladığı bir hazine."

## "Hediye Olarak" Metni

Büyükanne/dede veya gift buyer için:
- Duygusal bağ
- Hediye kalitesi
- Teslimat vurgusu

Örnek:
"Torununuza sıradan bir hediye almayın. Bu kişiye özel kitap, adını gördüğünde şaşkınlıktan çığlık atmasını sağlayacak. Özenle paketlenir, 3 gün içinde kapınızda."

## Türkçe Yazım Kuralları

- ş, ğ, ü, ö, ç, ı, İ — DOĞRU yazım
- Büyük/küçük harf kuralları
- Noktalama işaretleri
- Çeviri hissi OLMASIN
- Pazarlama jargon'u dengeli kullan (çok abartma)

## Tone of Voice

- Sıcak ve samimi (ebeveyn-ebeveyn konuşması gibi)
- Güvenilir ve profesyonel
- Duygusal ama manipülatif değil
- Net ve anlaşılır (5. sınıf seviyesi)
- İkinci tekil şahıs (siz/sen değil, "çocuğunuz")

## Prompt Şablonu (Gemini'ye)

```
Sen Türkiye'deki e-ticaret siteleri için SEO uzmanı bir metin yazarısın.

Ürün: Kişiye özel çocuk hikaye kitabı
Başlık: {kitap_basligi}
Kategori: {kategori}
Özet: {ozet}
Yaş grubu: {yas}

Aşağıdaki JSON formatında Türkçe SEO içeriği üret:
{JSON_ŞABLON}

KURALLAR:
- Türkçe karakterler DOĞRU (ş, ğ, ü, ö, ç, ı, İ)
- Duygusal ama gerçekçi
- SEO dostu ama doğal
- Ebeveynler ve hediye alıcıları için
- SADECE JSON döndür
```
