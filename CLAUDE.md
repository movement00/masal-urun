# MasalSensin Ürün Stüdyosu - Agent Talimatları

Kişiselleştirilmiş çocuk kitabı e-ticaret sitesi için otomatik **ürün sayfası görseli** üretim sistemi.

## Proje Amacı

Fiziksel kitap üretilmez. Bu uygulama, websitede sergilenecek **örnek ürün görselleri** ve SEO içeriği üretir. Müşteri sipariş verdiğinde gerçek kitap ayrı bir uygulamada çocuğun fotoğrafına göre üretilir.

## Görsel Stil: 3D Pixar CGI

**TÜM görseller 3D Pixar/Disney CGI tarzında üretilir.** Gerçekçi fotoğraf, 2D illüstrasyon veya anime KULLANILMAZ.

- Pixar/Disney film kalitesi (Toy Story, Coco, Encanto, Turning Red seviyesi)
- Stilize oranlar: büyük ifadeli gözler, yumuşak yuvarlak hatlar, Pixar baş-vücut oranı
- Zengin subsurface scattering (Pixar'ın imza sıcak yarı saydam cilt efekti)
- Detaylı 3D saç, derinlikli gözler, gerçekçi kumaş kıvrımları
- Sıcak volumetrik aydınlatma, yumuşak gölgeler

## Karakter Çeşitliliği — KRİTİK

**AI modelleri varsayılan olarak sarışın, mavi gözlü Batılı çocuklar üretir. Bu YASAKTIR.**

Türk çocuk demografisini yansıtmak için karakter özellikleri JS tarafında rastgele seçilir (AI'a bırakılmaz):

### Saç Rengi Dağılımı (~%90 koyu tonlar)
- Koyu siyah, siyah, koyu kahverengi, kestane kahverengi, kahverengi
- Nadir (~%10): Açık kahverengi, bal rengi kahverengi

### Göz Rengi Dağılımı (~%90 koyu tonlar)
- Koyu kahverengi, kahverengi, siyaha yakın koyu, ela, kestane kahverengi
- Nadir (~%10): Yeşilimsi ela, bal rengi

### Ten Tonu Dağılımı
- Buğday, açık buğday, esmer, mat açık, zeytinyağı tonu, açık esmer

### Ayırt Edici Özellikler (en az 2 zorunlu)
- Çil, gamze, diş aralığı, diş teli, gözlük, kulak kepçesi, yara izi, doğum lekesi, tombulca yanaklar, kalın kaşlar vb.

**conceptAgent.ts** içinde `generateAppearanceDirective()` fonksiyonu bu seçimi yapar ve AI'a "AYNEN kullan" talimatı verir.

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
**Özel Gün**: Pixar karakter + duygusal hediye atmosferi, yetişkin alıcıları da göz önünde bulundur

## Üretim Pipeline'ı (Tek Kitap — 5 Görsel + SEO)

```
1. KONSEPT           → Kategori için yeni kitap fikri (AI, geçmişten farklı, Türk demografisi zorunlu)
2. KARAKTER PORTRESİ  → 3D Pixar karakter portresi (doğal Türk ortamında) — TÜM görsellerin referansı
3. ÖN KAPAK           → 3D Pixar kitap kapağı (karakter portresinden referans)
4. ARKA KAPAK          → Aynı stil, özet + kazanımlar (karakter + ön kapak referans)
5. HOOK GÖRSELİ       → Çocuk doğal ortamda kitap okuyor (3D Pixar, karakter + kapak referans)
6. DÖNÜŞÜM GÖRSELİ    → Kitabın büyüsü — sayfalardan hikaye çıkıyor (3D Pixar, pazarlama)
7. SEO İÇERİĞİ        → Başlık, açıklama, meta, anahtar kelimeler, kazanımlar
```

## Karakter Tutarlılığı

Tüm görseller arasında karakter aynı görünmeli. Strateji:

1. **Karakter portresi** ilk üretilir — karakter orada sabitlenir (3D Pixar tarzında)
2. **Ön kapak**: karakter portresi = referans görsel
3. **Arka kapak**: karakter portresi + ön kapak = referans görseller
4. **Hook**: karakter portresi + ön kapak = referans görseller
5. **Dönüşüm**: karakter portresi + ön kapak = referans görseller
6. Prompt'ta: "EXACT same character from reference portrait — same face, hair, skin, features"
7. Gemini Image API'de reference images İLK sırada

## Hook Görseli Sahneleri

Doğal Türk çocuk ortamları (JS tarafında rastgele seçilir):
- **Yatakta Okuyor**: Yatakta yastıklara yaslanmış, battaniye altında, oyuncak ayı kolunda
- **Parkta Okuyor**: Ağaç altında çimlerde oturmuş, güneşli öğleden sonra
- **Kahvaltıda Okuyor**: Türk kahvaltı masasında, çay bardağı yanında, peynir-zeytin

## Dönüşüm Görseli

Kitabın büyüsünü gösteren pazarlama görseli:
- Çocuk kitabı tutuyor, sayfalardan hikaye sihirli toz ve ışıkla canlanıyor
- Çocuğun hayranlık ifadesi
- Hikaye kahramanı (çocuğun kendisi) büyülü akışta görünüyor
- Alt yazı: "Her çocuk kendi hikayesinin kahramanı"

## Veri Saklama

- **IndexedDB** (via idb-keyval): Tüm üretilen kitaplar
- Her kitap: `{ id, kategori, konsept, visuals[5], seo, uretimTarihi }`
- AI yeni konsept üretirken mevcut kitapların başlıklarına bakar → çakışma yok

## Teknik Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Gemini API (text: gemini-3.1-pro-preview, image: gemini-3.1-flash-image-preview)
- IndexedDB via idb-keyval
- Deploy: Vercel

## Dosya Yapısı

```
src/
├── services/
│   ├── conceptAgent.ts           # Konsept üretici (Türk demografisi zorunlu)
│   ├── characterReferenceAgent.ts # 3D Pixar karakter portresi
│   ├── coverAgent.ts             # Ön kapak + arka kapak
│   ├── hookAgent.ts              # Hook + dönüşüm görseli
│   ├── seoAgent.ts               # SEO metni
│   ├── orchestrator.ts           # Pipeline yönetici
│   └── geminiClient.ts           # Gemini API wrapper
├── lib/
│   └── storage.ts                # IndexedDB wrapper
├── categories.ts                 # Kategori tanımları
├── types.ts                      # TypeScript arayüzleri
├── App.tsx                       # Ana React UI
└── main.tsx                      # Entry point
```

## Önemli Kurallar

1. **Küçük adımlarla ilerle** — tek değişiklik, test, sonra devam
2. **Prompt değişikliği öncesi onay al** — özellikle image generation prompts
3. **API key env variable'da** — source code'a ASLA ekleme
4. **Karakter tutarlılığı** — referans zinciri bozulmasın
5. **Geçmiş korunmalı** — üretilen kitaplar silinmez
6. **Türk demografisi zorunlu** — sarışın/mavi göz YASAK (JS tarafında kontrol)
7. **3D Pixar stil** — tüm görseller tutarlı Pixar/Disney CGI tarzında
8. **Doğal ortamlar** — çocuklar gerçek Türk ev/park/okul ortamlarında
