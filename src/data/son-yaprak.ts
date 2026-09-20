export type CameraMove = "dolly-in" | "dolly-out" | "pan-left" | "pan-right" | "orbit-left" | "orbit-right" | "crane-up" | "follow";

export const SON_YAPRAK = {
  title: "ÖZLÜYORUM",
  artist: "MANUS",
  credits: "Üniversite yıllarına",
  audio: "audio/1 numara manus_ Özlüyorum (Üni).wav",
  durationSeconds: 184.045283,
  fps: 30,
} as const;

export const scenePlan = [
  {start: 0, end: 15.2, section: "Giriş", event: "Yağmurlu camın ardından kampüse dönüş", camera: "dolly-in", asset: "images/01-window.jpg"},
  {start: 14.4, end: 31.5, section: "Kıta 1", event: "Boş kampüs yolunda yalnız yürüyüş", camera: "follow", asset: "images/02-street.jpg"},
  {start: 30.6, end: 42.2, section: "Kıta 1", event: "Eski anahtar ve öğrenci kimliği", camera: "dolly-in", asset: "images/03-key.jpg"},
  {start: 41.3, end: 56.5, section: "Yükseliş", event: "Açılan kapı ve boş koridor", camera: "pan-right", asset: "images/04-door.jpg"},
  {start: 55.6, end: 75.4, section: "Nakarat", event: "Gece otobüsünde geçmişe yolculuk", camera: "pan-left", asset: "images/05-bus.jpg"},
  {start: 74.5, end: 89.5, section: "Nakarat", event: "Yağmur birikintisinde eski fotoğraflar", camera: "crane-up", asset: "images/06-puddle.jpg"},
  {start: 88.6, end: 103.5, section: "Nakarat", event: "Arkadaşlarla yürünmüş kıyı", camera: "orbit-right", asset: "images/07-pier.jpg"},
  {start: 102.6, end: 118.7, section: "Ara", event: "Solmuş papatya ve hatıra defteri", camera: "dolly-out", asset: "images/08-daisy.jpg"},
  {start: 117.8, end: 130.0, section: "Kıta 2", event: "Eski valiz ve yarım kalmış vedalar", camera: "dolly-in", asset: "images/09-suitcase.jpg"},
  {start: 129.1, end: 140.5, section: "Kıta 2", event: "Sessiz sınıf ve boş sıralar", camera: "follow", asset: "images/11-room.jpg"},
  {start: 139.6, end: 150.0, section: "Yükseliş", event: "Yağmur altında kampüsten çıkış", camera: "orbit-left", asset: "images/02-street.jpg"},
  {start: 149.1, end: 159.0, section: "Final nakarat", event: "Peronda ayrılan arkadaşlar", camera: "pan-right", asset: "images/10-train.jpg"},
  {start: 158.1, end: 169.0, section: "Final nakarat", event: "Boş odada kalan anılar", camera: "dolly-out", asset: "images/11-room.jpg"},
  {start: 168.1, end: 176.0, section: "Final", event: "Kıyıda geçmişe son bakış", camera: "crane-up", asset: "images/07-pier.jpg"},
  {start: 175.1, end: 184.045283, section: "Çıkış", event: "Şafakta yeni güne yürüyüş", camera: "dolly-in", asset: "images/12-dawn.jpg"},
] as const;
