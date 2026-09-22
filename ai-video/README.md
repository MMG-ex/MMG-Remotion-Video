# Son Yaprak — FREE Real AI Video Pipeline

Bu dal, fotoğraf slaytı üretmez. Gerçek hareketli sahneler ücretsiz GPU üzerinde üretilir.

## Mimari

1. ChatGPT/GitHub: sahne planı ve promptlar.
2. Kaggle free GPU: CogVideoX-2B ile 6 saniyelik gerçek hareketli MP4 klipler.
3. GitHub scheduled workflow: tamamlanan klipleri `public/generated/` içine toplar.
4. 30 klip tamamlanınca Remotion şarkıyla senkron final 1080p MP4 üretir.
5. Final MP4 GitHub Release + Actions artifact olarak yayınlanır.

## Neden CogVideoX-2B?

- FP16 ile düşük VRAM kullanır.
- Resmî model kartı free-tier T4 sınıfı GPU'larda düşük bellekli çalışma yolunu belgeler.
- 6 saniye / 8 fps / 720x480 gerçek video üretir.
- Bu sistem finalde 16:9'a kırpıp 1280x720'e ölçekler; Remotion 1920x1080 final çıkarır.

## Tek seferlik gereken GitHub ayarı

Repository Settings > Secrets and variables > Actions:

- Secret: `KAGGLE_API_TOKEN`
- Variable: `KAGGLE_USERNAME`

Sonra Actions > **Son Yaprak FREE AI Video Pipeline** > Run workflow.

Pipeline iki saatte bir otomatik kontrol eder. Kaggle işi sürüyorsa bekler; bitmişse çıktıyı toplar ve sıradaki batch'i başlatır.

## Final jenerik

- Söz: M. Murat Güvenoğlu
- Müzik: Suno.com
