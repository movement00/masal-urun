---
name: pixar-kapak-prompt
description: MasalSensin kitapları için 3D Pixar tarzı kapak görseli prompt mühendisliği. Use when generating book cover images — ensures professional Pixar CGI quality with Turkish typography.
---

# Pixar Tarzı Kapak Prompt Mühendisliği

Çocuk kitabı kapakları için yüksek kaliteli, profesyonel Pixar CGI tarzı prompt'lar oluşturur.

## Kapak Bileşenleri

Her kapak 5 katmandan oluşur:
1. **Karakter** (büyük, merkezi, ifade zengin)
2. **Ortam/Arka plan** (hikayenin geçtiği yer)
3. **Atmosfer/Işık** (mood'u belirler)
4. **Başlık** (Türkçe, büyük, okunaklı tipografi)
5. **Kompozisyon** (A4 portrait, başlık üstte veya altta)

## Temel Prompt Şablonu

```
Professional children's book cover, Pixar/Disney 3D CGI animated style, A4 portrait format.

CHARACTER (main subject, centered, large):
{karakter_tanimi}
{karakter_kiyafet}
Expression: {ifade} - big expressive eyes, warm smile, engaging pose

ENVIRONMENT (background):
{sahne_tanimi}
{zaman_mood} lighting
Depth of field: character sharp, background slightly soft

STYLE:
- Pixar/DreamWorks 3D CGI quality
- Vibrant saturated colors
- Soft volumetric lighting
- Highly detailed character textures
- Clean professional composition
- NO rough edges, NO amateur look

TITLE TEXT (at top of cover):
"{baslik}"
Bold playful children's book font (like Cooper Black or custom rounded)
Color: {baslik_rengi} with subtle outline/shadow
Turkish characters with CORRECT spelling: ş, ğ, ü, ö, ç, ı, İ

FORMAT:
- A4 vertical portrait (2:3 aspect ratio)
- Title occupies top 25% of cover
- Character + scene fills rest
- Professional children's book cover design
```

## Kategori Varyasyonları

### Macera Hikayeleri
- Dinamik pose (koşan, tırmanan, atlayan karakter)
- Geniş açı arka plan (orman, dağ, deniz)
- Canlı renkler (turkuaz, turuncu, sarı)
- "Macera bekliyor!" hissi

### Öğreten Hikayeler
- Düşünceli/meraklı pose (kitap tutuyor, büyüteçle bakıyor)
- Bilimsel/eğitici arka plan (laboratuvar, uzay, müze)
- Renkler: parlak ama dengeli
- Eğitici araç detayları (kitap, harita, mikroskop)

### Gerçek Hayat
- Doğal günlük pose
- Ev, okul, park gibi tanıdık ortamlar
- Sıcak renk tonları
- Duygusal bağ kurdurucu ifade

### Boyama İlk Renkler (2-5 yaş)
- SİYAH-BEYAZ SADECE
- Çok basit, kalın hatlar
- Büyük basit şekiller (hayvan, araba, meyve)
- Çocuğun boyayabileceği açık alanlar
- Başlık: Büyük, renkli (istisna — sadece başlıkta renk)

### Boyama Renk Ustaları (6-10 yaş)
- SİYAH-BEYAZ SADECE
- Detaylı çizim
- Karmaşık sahneler (manzara, karakter grubu)
- Orta kalınlıkta hatlar
- Başlık: Renkli

### Özel Gün Hediyeleri
- Duygusal ton (kalp, sarılma, gülümseme)
- Kutlama ögeleri (balon, pasta, çiçek, kurdele)
- Pastel + sıcak renkler
- Büyükler de beğensin

## Başlık Tipografisi

Her kategoride farklı font hissi:
- **Macera**: Bold, italik, dinamik hareket
- **Öğreten**: Temiz, modern, okunaklı
- **Gerçek Hayat**: Samimi, el yazısı hissi
- **Boyama**: Büyük, oyuncaklı, renkli
- **Özel Gün**: Dekoratif, sıcak, duygusal

## Kritik Kurallar

1. **Türkçe karakterler**: ş ğ ü ö ç ı İ DOĞRU yazılmalı
2. **Tipografi**: Başlık görseldeki metinle uyumlu, okunaklı
3. **Karakter öne çıksın**: Kapağın %60'ı karakter + yakın sahne
4. **Profesyonel kalite**: Amatör, çocuk çizimi DEĞİL (içerik çocuk için ama görsel profesyonel)
5. **CGI görünümü**: Pixar/Disney/DreamWorks seviyesi

## Anti-Patterns

❌ "Sevimli bir çocuk" — spesifik olmayan tanım
❌ İngilizce başlık
❌ 2D flat illustration (3D CGI olmalı)
❌ Karakter küçük, arka planda kaybolmuş
❌ Düşük doygunluk, soluk renkler
❌ Gemini'nin default CGI gözleri (kayma, asimetrik)

## Kalite Kontrol

Üretimden sonra kontrol:
- [ ] Başlık Türkçe, doğru yazılmış mı?
- [ ] Karakter yüzü netti ve sempatik mi?
- [ ] Arka plan hikayeyi yansıtıyor mu?
- [ ] Renkler canlı ve profesyonel mi?
- [ ] A4 portrait formatı mı?
- [ ] Anime/2D değil, 3D CGI mi?
