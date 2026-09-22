export type CameraMove = "dolly-in" | "dolly-out" | "pan-left" | "pan-right" | "orbit-left" | "orbit-right" | "crane-up" | "follow";

export const SON_YAPRAK = {
  title: "ÖZLÜYORUM",
  artist: "MANUS",
  credits: "Bir özlem hikâyesi",
  audio: "audio/1 numara manus_ Özlüyorum (Üni).wav",
  durationSeconds: 184.045283,
  fps: 30,
} as const;

export const scenePlan = [
  {start: 0, end: 15.8, section: "Giriş", event: "Yağmurlu camda yalnızlık", camera: "dolly-in", asset: "video/01-lonely-rain-window.mp4"},
  {start: 15.0, end: 32.2, section: "Kıta 1", event: "Boş kalan sandalye", camera: "dolly-out", asset: "video/02-empty-chair.mp4"},
  {start: 31.4, end: 42.8, section: "Kıta 1", event: "Eski fotoğraflar", camera: "dolly-in", asset: "video/03-old-photos.mp4"},
  {start: 42.0, end: 57.2, section: "Yükseliş", event: "Yağmurda birlikte yürüyüş hatırası", camera: "follow", asset: "video/04-couple-rain.mp4"},
  {start: 56.4, end: 76.0, section: "Nakarat", event: "Sevgiliyle sarılma hatırası", camera: "orbit-right", asset: "video/05-couple-hug.mp4"},
  {start: 75.2, end: 90.1, section: "Nakarat", event: "Gece birlikte yürüyüş", camera: "follow", asset: "video/06-couple-night.mp4"},
  {start: 89.3, end: 104.1, section: "Nakarat", event: "Yağmuru birlikte izlemek", camera: "dolly-in", asset: "video/07-couple-watch-rain.mp4"},
  {start: 103.3, end: 119.3, section: "Ara", event: "Kitap arasından çıkan eski mektup", camera: "dolly-in", asset: "video/08-old-letter.mp4"},
  {start: 118.5, end: 130.8, section: "Kıta 2", event: "Yeniden yalnızlık", camera: "dolly-out", asset: "video/09-lonely-window.mp4"},
  {start: 130.0, end: 141.3, section: "Kıta 2", event: "Dönmeyen sevgilinin boş yeri", camera: "dolly-out", asset: "video/02-empty-chair.mp4"},
  {start: 140.5, end: 150.8, section: "Yükseliş", event: "Fotoğraflara son kez bakış", camera: "dolly-in", asset: "video/03-old-photos.mp4"},
  {start: 150.0, end: 159.8, section: "Final nakarat", event: "En sıcak sarılma hatırası", camera: "orbit-left", asset: "video/05-couple-hug.mp4"},
  {start: 159.0, end: 169.8, section: "Final nakarat", event: "Hatıradan gerçeğe dönüş", camera: "dolly-out", asset: "video/09-lonely-window.mp4"},
  {start: 169.0, end: 176.8, section: "Final", event: "Boş sandalye ile kabulleniş", camera: "dolly-out", asset: "video/02-empty-chair.mp4"},
  {start: 176.0, end: 184.045283, section: "Çıkış", event: "Şafakta tek başına yürümek", camera: "follow", asset: "video/10-dawn-walk.mp4"},
] as const;
