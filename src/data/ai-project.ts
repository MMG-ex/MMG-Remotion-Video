export const AI_PROJECT = {
  title: "ÖZLÜYORUM",
  lyricCredit: "Söz: M. Murat GÜVENOĞLU",
  musicCredit: "Müzik: Suno.com",
  audio: "audio/1 numara manus_ Özlüyorum (Üni).wav",
  durationSeconds: 184.045283,
  fps: 30,
} as const;

export type AISceneMode = "present" | "memory" | "transition";

export type AIScene = {
  id: string;
  start: number;
  end: number;
  src: string;
  mode: AISceneMode;
  playbackRate: number;
  name: string;
};

export const AI_SCENES: AIScene[] = [
  {id:"01",start:0,end:13.5,src:"ai-video/01-present-fireplace.mp4",mode:"present",playbackRate:0.74,name:"01 · Soğuk şimdi · şömine ve boş sandalye"},
  {id:"02",start:12.5,end:25,src:"ai-video/02-memory-fireplace.mp4",mode:"memory",playbackRate:0.80,name:"02 · Sıcak anı · şömine başında"},
  {id:"03",start:24,end:37,src:"ai-video/03-empty-chair-clock.mp4",mode:"present",playbackRate:0.77,name:"03 · Zaman · boş sandalye"},
  {id:"04",start:36,end:48,src:"ai-video/04-i-cannot-forget.mp4",mode:"present",playbackRate:0.83,name:"04 · Ben unutamam · fotoğraf"},
  {id:"05",start:47,end:60,src:"ai-video/05-wind-leaf-transition.mp4",mode:"transition",playbackRate:0.77,name:"05 · Rüzgâr ve yaprak"},
  {id:"06",start:59,end:72,src:"ai-video/06-her-smile.mp4",mode:"memory",playbackRate:0.77,name:"06 · Gülüşünü · yakın anı"},
  {id:"07",start:71,end:84,src:"ai-video/07-couple-wind-walk.mp4",mode:"memory",playbackRate:0.77,name:"07 · Birlikte · rüzgârda yürüyüş"},
  {id:"08",start:83,end:96,src:"ai-video/08-reflection-memory.mp4",mode:"present",playbackRate:0.77,name:"08 · Yansıma · bir anlığına"},
  {id:"09",start:95,end:108,src:"ai-video/09-touch-memory.mp4",mode:"memory",playbackRate:0.77,name:"09 · Dokunuş · omuzdaki el"},
  {id:"10",start:107,end:119,src:"ai-video/10-run-to-door.mp4",mode:"present",playbackRate:0.83,name:"10 · Kapıya koşuş"},
  {id:"11",start:118,end:130,src:"ai-video/11-empty-doorway.mp4",mode:"present",playbackRate:0.83,name:"11 · Boş kapı · kimse yok"},
  {id:"12",start:129,end:141.5,src:"ai-video/12-scent-scarf-room.mp4",mode:"present",playbackRate:0.80,name:"12 · Kokun hâlâ odada · atkı"},
  {id:"13",start:140.5,end:153.5,src:"ai-video/13-hands-memory.mp4",mode:"memory",playbackRate:0.77,name:"13 · Eller · sıcak anı"},
  {id:"14",start:152.5,end:165.5,src:"ai-video/14-empty-hands.mp4",mode:"present",playbackRate:0.77,name:"14 · Sensiz ellerim"},
  {id:"15",start:164.5,end:177,src:"ai-video/15-embrace-to-empty.mp4",mode:"memory",playbackRate:0.80,name:"15 · Sarılma anısı · boşluğa dönüş"},
  {id:"16",start:176,end:AI_PROJECT.durationSeconds,src:"ai-video/16-dawn-acceptance.mp4",mode:"present",playbackRate:1.0,name:"16 · Şafak · kabulleniş"},
];
