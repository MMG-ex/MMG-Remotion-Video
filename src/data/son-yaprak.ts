export type CameraMove = "dolly-in" | "dolly-out" | "pan-left" | "pan-right" | "orbit-left" | "orbit-right" | "crane-up" | "follow";

export const SON_YAPRAK = {
  title: "SON YAPRAK",
  artist: "AIYLIN MÜZİK",
  credits: "Söz & Müzik · AIYLIN MÜZİK",
  audio: "audio/son-yaprak-master-320.mp3",
  durationSeconds: 227.056327,
  fps: 30,
} as const;

export const scenePlan = [
  {start: 0, end: 12, section: "Intro", event: "Yağmurlu pencere ve şehir", camera: "dolly-in", asset: "images/01-window.jpg"},
  {start: 11, end: 23, section: "Intro", event: "Islak sokakta yalnız yürüyüş", camera: "follow", asset: "images/02-street.jpg"},
  {start: 22, end: 35, section: "Kıta 1", event: "Anahtar ve papatya yaprağı", camera: "dolly-in", asset: "images/03-key.jpg"},
  {start: 34, end: 48, section: "Kıta 1", event: "Valizle kapıdan ayrılış", camera: "pan-right", asset: "images/04-door.jpg"},
  {start: 47, end: 61, section: "Ön nakarat", event: "Karanlık sokakta takip", camera: "orbit-left", asset: "images/02-street.jpg"},
  {start: 60, end: 74, section: "Ön nakarat", event: "Gece otobüsü", camera: "pan-left", asset: "images/05-bus.jpg"},
  {start: 73, end: 88, section: "Nakarat", event: "Su birikintisinde yapraklar", camera: "crane-up", asset: "images/06-puddle.jpg"},
  {start: 87, end: 102, section: "Nakarat", event: "Boğaz kıyısında yalnızlık", camera: "orbit-right", asset: "images/07-pier.jpg"},
  {start: 101, end: 116, section: "Ara", event: "Papatya ve terk edilmiş valiz", camera: "dolly-out", asset: "images/08-daisy.jpg"},
  {start: 115, end: 130, section: "Kıta 2", event: "Kapı önünde valiz ve anahtar", camera: "dolly-in", asset: "images/09-suitcase.jpg"},
  {start: 129, end: 143, section: "Kıta 2", event: "Açık kapı ve boş koridor", camera: "follow", asset: "images/04-door.jpg"},
  {start: 142, end: 157, section: "Ön nakarat", event: "Yağmurda kararsız yürüyüş", camera: "orbit-right", asset: "images/02-street.jpg"},
  {start: 156, end: 171, section: "Nakarat", event: "Peronda ayrılık", camera: "pan-right", asset: "images/10-train.jpg"},
  {start: 170, end: 184, section: "Köprü", event: "Boş odada kalan papatya", camera: "dolly-out", asset: "images/11-room.jpg"},
  {start: 183, end: 197, section: "Final nakarat", event: "Rüzgârlı iskele ve ufuk", camera: "crane-up", asset: "images/07-pier.jpg"},
  {start: 196, end: 209, section: "Final nakarat", event: "Geceden şafağa geçiş", camera: "dolly-in", asset: "images/12-dawn.jpg"},
  {start: 208, end: 220, section: "Final", event: "Son yaprak", camera: "dolly-in", asset: "images/08-daisy.jpg"},
  {start: 219, end: 227.056327, section: "Outro", event: "Boş oda ve kapanış", camera: "dolly-out", asset: "images/12-dawn.jpg"},
] as const;
