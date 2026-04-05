---
name: kitap-konsept-uretici
description: MasalSensin kategorileri için özgün kitap konsepti üretme. Use when generating a new book concept (title, character, story arc) for a specific category, ensuring uniqueness from previously generated books.
---

# Kitap Konsept Üretici

Her kategori için özgün, geçmişten farklı kitap konsepti üretir.

## Girdi

```json
{
  "kategori": "Macera Hikayeleri",
  "ana_grup": "Hikaye Kitapları",
  "gecmis_baslikar": ["Elif'in Orman Macerası", "Can ve Kayıp Hazine"]
}
```

## Çıktı (JSON)

```json
{
  "baslik": "Mavi Gezegen'in Gizli Hazinesi",
  "kahraman": {
    "isim": "Yiğit",
    "yas": 7,
    "cinsiyet": "erkek",
    "fiziksel_ozellikler": "Kısa siyah saçlı, kahverengi gözlü, güneşten yanmış ten, maceraperest",
    "kiyafet": "Mavi astronot tulumu, kırmızı baret, kahverengi çizmeler"
  },
  "ozet": "Yiğit bahçede kazı yaparken eski bir uzay haritası bulur ve...",
  "sahneler": [
    "Yiğit bahçede harita buluyor",
    "Uzay gemisine biniyor",
    "Mavi gezegene iniş",
    "Yabancı dostlar tanışması",
    "Hazineyi buluyor"
  ],
  "kazanimlar": ["Cesaret", "Merak", "Arkadaşlık", "Keşif ruhu"],
  "yas_grubu": "5-8",
  "mood": "heyecanlı, ilham verici"
}
```

## Kategoriye Özel Kurallar

### Hikaye Kitapları
**Macera**: Fiziksel maceralar, keşif, cesaret, problem çözme
**Öğreten**: Bilim, matematik, doğa, tarih — eğlenceli şekilde öğretim
**Gerçek Hayat**: Okul, kardeş, arkadaşlık, duygular, günlük sorunlar

Yaş grubu: 4-10
Karakter: 3D Pixar tarzı çocuk karakter
Sahne sayısı: 5-7

### Boyama Kitapları
**İlk Renkler (2-5)**: Büyük, basit, az detaylı şekiller. Hayvanlar, meyveler, araçlar
**Renk Ustaları (6-10)**: Detaylı sahneler, manzara, kompleks karakterler

Karakter: Siyah-beyaz kalın hatlı çizgi
Sayfa sayısı: 20-30
Tema: Yaş grubuna göre basit/karmaşık

### Özel Gün Hediyeleri
**Doğum Günü**: Kutlama, pasta, hediye, şaşkınlık
**Anneler/Babalar Günü**: Sevgi, teşekkür, aile
**Mezuniyet**: Başarı, yolculuk, yeni dönem
**Sevgililer**: Kalp, gülümseme, sıcaklık
**Evlilik Teklifi**: Romantik, özel an, söz

Mood: Duygusal, sıcak, kutlayıcı

## Özgünlük Kuralı

Yeni konsept ÜRETMEDEN ÖNCE:
1. Kategorideki tüm önceki başlıklara bak
2. Karakter isimlerini not et (aynı isim tekrarlanmasın)
3. Tema örtüşmesi kontrol et
4. En az 3 anahtar unsur FARKLI olmalı (karakter, ortam, problem)

## Türkçe Doğallık

- Gerçek Türk isimleri kullan: Elif, Ayşe, Zeynep, Ahmet, Can, Yiğit, Mert, Defne
- Kültürel ögeleri yerine göre ekle (bayram, yemek, oyun)
- Basit, akıcı Türkçe — çocuğa okunacak dil
- Çeviri hissi ASLA olmasın

## Prompt Şablonu (Gemini'ye)

```
Sen bir çocuk kitabı konsept uzmanısın. MasalSensin için yeni bir "{kategori}" kitabı konsepti oluştur.

GEÇMİŞTE ÜRETİLEN KİTAPLAR (çakışma OLMASIN):
{gecmis_baslikar}

ÇIKTI GEREKSINIMLERI:
- Özgün Türkçe başlık (maks 6 kelime)
- Yeni bir çocuk kahraman (önceki isimlerden FARKLI)
- Karakterin tam fiziksel tanımı (görsel üretimi için)
- 5-7 sahne ile hikaye arc'ı
- Çocuğa kazandırdığı 3-5 değer

Kategori: {kategori}
Yaş grubu: {yas_grubu}
Mood: {mood}

SADECE JSON döndür, başka açıklama yok.
```
