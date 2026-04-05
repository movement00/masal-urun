# MasalSensin Ürün Stüdyosu - Agent Talimatları

Kişiselleştirilmiş çocuk kitabı e-ticaret sitesi için otomatik **ürün sayfası görseli** üretim sistemi.

## Proje Amacı

Fiziksel kitap üretilmez. Bu uygulama, websitede sergilenecek **örnek ürün görselleri** ve SEO içeriği üretir. Müşteri sipariş verdiğinde gerçek kitap ayrı bir uygulamada çocuğun fotoğrafına göre üretilir.

## Kategori Yapısı

```
HİKAYE KİTAPLARI (3D Pixar karakter)
├── Macera Hikayeleri
├── Öğreten Hikayeler
└── Gerçek Hayat Hikayeleri

BOYAMA KİTAPLARI (siyah-beyaz çizgi)
├── İlk Renkler (2-5 Yaş)
└── Renk Ustaları (6-10 Yaş)

ÖZEL GÜN HEDİYELERİ (duygusal hediye)
├── Doğum Günü
├── Anneler Günü
├── Babalar Günü
├── Mezuniyet
├── Sevgililer Günü
└── Evlilik Teklifi
```

## Her Kategori Farklı Logic

**Hikaye Kitapları**: 3D Pixar CGI tarzı karakter, macera/bilgi/yaşam sahneleri, renkli canlı
**Boyama Kitapları**: Siyah-beyaz kalın hatlı çizgi karakterler, yaşa göre detay seviyesi (2-5: çok basit, 6-10: orta detay)
**Özel Gün**: Duygusal tonlar, hediye atmosferi, yetişkin alıcıları da göz önünde bulundur

## Üretim Akışı (Tek Kitap)

1. **Konsept** → Kategori için yeni bir kitap fikri (AI, geçmişten farklı)
2. **Hero Kapak** → İlk görsel, karakter burada belirlenir
3. **Ürün Fotoğrafları (5)** → Hero kapak referans, karakter TUTARLI
   - Kapak düz (beyaz zemin)
   - Kapak 45° açı (kalite)
   - Açık kitap (iç sayfalar)
   - Flat-lay (props ile)
   - Hediye sunumu
4. **Pazarlama Görselleri (3)** → Duygusal bağlam
   - Çocuk kitabı görüyor (şaşkın ifade)
   - Ebeveyn+çocuk okuyor
   - Hook görseli (sorun-çözüm)
5. **İnfografik (1)** → Kazanımlar (özgüven, hayal gücü, okuma)
6. **SEO Metin** → Başlık, açıklama, meta, anahtar kelimeler, kazanımlar

## Karakter Tutarlılığı KRİTİK

Tüm görseller arasında karakter aynı görünmeli. Strateji:
1. Hero kapak ilk üretilir — karakter orada sabitlenir
2. Diğer tüm görseller: hero kapak = referans görsel
3. Prompt'ta: "EXACT same character from reference image"
4. Gemini Image API'de reference images ilk sırada

## Veri Saklama

- **IndexedDB** (veya localStorage): Tüm üretilen kitaplar
- Her kitap: `{ id, kategori, konsept, hero, visuals[], seo, uretimTarihi }`
- AI yeni konsept üretirken mevcut kitapların başlıklarına bakar → çakışma yok

## Teknik Stack

- React + TypeScript + Vite
- Tailwind CSS
- Gemini API (text + image generation)
- IndexedDB via idb-keyval
- Deploy: Vercel

## Önemli Kurallar

1. **Küçük adımlarla ilerle** — tek değişiklik, test, sonra devam (memory'de notlandı)
2. **Prompt değişikliği öncesi onay al** — özellikle image generation prompts
3. **API key env variable'da** — source code'a ASLA ekleme
4. **Karakter tutarlılığı** — referans zinciri bozulmasın
5. **Geçmiş korunmalı** — üretilen kitaplar silinmez

## Dosya Yapısı

```
src/
├── categories/        # Kategori tanımları + prompt'lar
├── services/
│   ├── conceptAgent.ts      # Konsept üretici
│   ├── coverAgent.ts        # Kapak üretici
│   ├── productAgent.ts      # Ürün fotoğrafı üretici
│   ├── marketingAgent.ts    # Pazarlama görseli
│   └── seoAgent.ts          # SEO metni
├── lib/
│   └── storage.ts           # IndexedDB wrapper
├── components/
│   ├── CategoryGrid.tsx     # Ana sayfa
│   ├── CategoryDetail.tsx   # Kategori içi sayfa
│   ├── BookGenerator.tsx    # Üretim akışı
│   └── BookPreview.tsx      # Önizleme
└── App.tsx
```
