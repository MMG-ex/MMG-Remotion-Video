import React from "react";
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from "remotion";
import {Audio} from "@remotion/media";
import {MovingVideoShot} from "../Cinematic/MovingVideoShot";
import {OpeningTitles} from "../Cinematic/OpeningTitles";
import {SON_YAPRAK} from "../data/son-yaprak";

const f = (seconds: number) => Math.round(seconds * SON_YAPRAK.fps);

type Shot = {
  start: number;
  end: number;
  src: string;
  playbackRate?: number;
  brightness?: number;
  saturation?: number;
  contrast?: number;
  zoomFrom?: number;
  zoomTo?: number;
  name: string;
};

const shots: Shot[] = [
  {start: 0, end: 15.8, src: "video/01-lonely-rain-window.mp4", playbackRate: 0.82, brightness: 0.68, saturation: 0.62, contrast: 1.14, name: "01 · Şimdi · yağmurlu camda yalnızlık"},
  {start: 15.0, end: 32.2, src: "video/02-empty-chair.mp4", playbackRate: 0.78, brightness: 0.82, saturation: 0.66, contrast: 1.10, name: "02 · Yokluk · boş kalan yer"},
  {start: 31.4, end: 42.8, src: "video/03-old-photos.mp4", playbackRate: 0.84, brightness: 0.88, saturation: 0.72, contrast: 1.08, name: "03 · Hatıra · eski fotoğraflar"},
  {start: 42.0, end: 57.2, src: "video/04-couple-rain.mp4", playbackRate: 0.88, brightness: 0.96, saturation: 0.92, contrast: 1.03, name: "04 · Geçmiş · yağmurda birlikte"},
  {start: 56.4, end: 76.0, src: "video/05-couple-hug.mp4", playbackRate: 0.86, brightness: 1.00, saturation: 1.00, contrast: 1.02, name: "05 · Nakarat · sarılmanın hatırası"},
  {start: 75.2, end: 90.1, src: "video/06-couple-night.mp4", playbackRate: 0.86, brightness: 0.82, saturation: 0.86, contrast: 1.08, name: "06 · Anı · gece yürüyüşü"},
  {start: 89.3, end: 104.1, src: "video/07-couple-watch-rain.mp4", playbackRate: 0.80, brightness: 0.88, saturation: 0.82, contrast: 1.08, name: "07 · Anı · yağmuru birlikte izlemek"},
  {start: 103.3, end: 119.3, src: "video/08-old-letter.mp4", playbackRate: 0.76, brightness: 0.80, saturation: 0.68, contrast: 1.12, name: "08 · Hatıra · bulunan eski mektup"},
  {start: 118.5, end: 130.8, src: "video/09-lonely-window.mp4", playbackRate: 0.78, brightness: 0.70, saturation: 0.58, contrast: 1.14, name: "09 · Şimdi · yeniden yalnız"},
  {start: 130.0, end: 141.3, src: "video/02-empty-chair.mp4", playbackRate: 0.68, brightness: 0.74, saturation: 0.56, contrast: 1.14, zoomFrom: 1.05, zoomTo: 1.01, name: "10 · Yokluk · dönmeyen sevgili"},
  {start: 140.5, end: 150.8, src: "video/03-old-photos.mp4", playbackRate: 0.72, brightness: 0.78, saturation: 0.60, contrast: 1.13, name: "11 · Yükseliş · fotoğraflara son bakış"},
  {start: 150.0, end: 159.8, src: "video/05-couple-hug.mp4", playbackRate: 0.76, brightness: 0.96, saturation: 0.94, contrast: 1.04, zoomFrom: 1.02, zoomTo: 1.06, name: "12 · Final nakarat · en sıcak anı"},
  {start: 159.0, end: 169.8, src: "video/09-lonely-window.mp4", playbackRate: 0.70, brightness: 0.66, saturation: 0.52, contrast: 1.16, name: "13 · Şimdi · anının ardından boşluk"},
  {start: 169.0, end: 176.8, src: "video/02-empty-chair.mp4", playbackRate: 0.62, brightness: 0.76, saturation: 0.58, contrast: 1.12, zoomFrom: 1.03, zoomTo: 1.0, name: "14 · Kabul · boş kalan sandalye"},
  {start: 176.0, end: SON_YAPRAK.durationSeconds, src: "video/10-dawn-walk.mp4", playbackRate: 0.82, brightness: 1.02, saturation: 0.84, contrast: 1.03, zoomFrom: 1.02, zoomTo: 1.0, name: "15 · Çıkış · özlemle yürümeye devam"},
];

export const Visualizer: React.FC = () => {
  const {durationInFrames: totalDurationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <Audio src={staticFile(SON_YAPRAK.audio)} />

      {shots.map((shot) => {
        const from = f(shot.start);
        const end = Math.min(f(shot.end), totalDurationInFrames);
        const shotFrames = Math.max(1, end - from);

        return (
          <Sequence key={shot.name} from={from} durationInFrames={shotFrames} name={shot.name}>
            <MovingVideoShot
              src={shot.src}
              durationInFrames={shotFrames}
              playbackRate={shot.playbackRate}
              brightness={shot.brightness}
              saturation={shot.saturation}
              contrast={shot.contrast}
              zoomFrom={shot.zoomFrom}
              zoomTo={shot.zoomTo}
            />
          </Sequence>
        );
      })}

      <Sequence durationInFrames={f(7.4)} name="Açılış jeneriği">
        <OpeningTitles />
      </Sequence>
    </AbsoluteFill>
  );
};
