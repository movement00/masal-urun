---
name: karakter-tutarliligi
description: MasalSensin Ürün Stüdyosu için görseller arası karakter tutarlılığını sağlama. Use when generating multiple images of the same book product that must share the same main character.
---

# Karakter Tutarlılığı (Character Consistency)

Bir kitabın tüm pazarlama görsellerinde karakter aynı görünmeli. Çocuk kitaplarında tutarsız karakter, ürünü amatör gösterir.

## Strateji: Referans Zinciri

1. **İlk üretim:** Hero kapak görseli ÖNCE üretilir
2. **Karakter sabitleme:** Bu kapak "karakter DNA'sı" olarak saklanır
3. **Sonraki üretimler:** Hero kapak HER görsel üretiminde ilk referans olarak gönderilir
4. **Prompt disciplinesi:** "EXACT same character from reference image 1" açıkça belirtilir

## Prompt Kuralları

### Hero Kapak Prompt'u (İlk, referanssız)
Karakter detaylarını AÇIK şekilde yaz:
- Yaş ve cinsiyet
- Saç rengi ve stili
- Göz rengi
- Ten tonu
- Tipik kıyafet veya aksesuar
- Karakter kişiliği (mutlu, meraklı, cesur)

Örnek: "A 6-year-old Turkish girl named Elif with dark brown curly hair in two braids, bright green eyes, warm olive skin, wearing a yellow rain jacket and red boots, curious and brave expression..."

### Sonraki Görseller (Referanslı)
Referans görselden karakteri KOPYALA talimatı:

```
CRITICAL CHARACTER CONSISTENCY:
The child character in this image MUST look IDENTICAL to the character on the book cover (first reference image). 
Same face, same hair, same eyes, same skin tone, same clothing style.
Do NOT change any character features. 
This is the SAME child from the book cover.
```

## Görsel Sıralaması

Üretim sırası önemli — hata yapılmasın:
1. Hero kapak (karakter sabitlenir)
2. Açık kitap sayfası (iç sayfalarda karakter macerada)
3. Flat-lay ürün
4. Çocuk kitabı tutuyor (gerçek çocuk fotoğrafı — kitap kapağında AI karakter)
5. Ebeveyn+çocuk okuma
6. Hook görseli
7. İnfografik

Referans görsel ZİNCİRİ:
- Shot 2-7: hero_cover = referans 1
- Shot 3 (flat-lay): hero_cover + shot 2 = referans
- Shot 5 (lifestyle): hero_cover = referans (çocuk gerçek, karakter kitapta)

## Anti-Patterns (Yapma)

❌ Her görseli sıfırdan üretmek
❌ Farklı görsellerde farklı karakter tanımlamak
❌ Referans görseli unutmak
❌ "Similar character" demek — "SAME character" de
❌ Kapağı en son üretmek (karakter önce belirlenmeli)

## Doğrulama

Üretimden sonra kontrol et:
- Karakterin saç rengi tüm görsellerde aynı mı?
- Kıyafet tarzı tutarlı mı?
- Yüz özellikleri (göz, burun, ağız) benzer mi?
- Kitap kapağındaki karakter ile iç sayfadaki karakter uyumlu mu?

Tutarsızlık tespit edilirse: ilgili görseli hero kapak referansıyla YENİDEN üret.
