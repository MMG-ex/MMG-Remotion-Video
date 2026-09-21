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
  {start: 0, end: 15.8, src: "video/01-rain-window.mp4", playbackRate: 0.86, brightness: 0.72, saturation: 0.72, contrast: 1.12, name: "01 · Yağmurlu cam · geçmişe açılan giriş"},
  {start: 15.0, end: 32.2, src: "video/02-campus-walk.mp4", playbackRate: 0.92, brightness: 0.92, saturation: 0.82, contrast: 1.06, name: "02 · Üniversite kampüsü · yürüyen öğrenciler"},
  {start: 31.4, end: 42.8, src: "video/03-notebook.mp4", playbackRate: 0.88, brightness: 0.88, saturation: 0.76, contrast: 1.08, name: "03 · Defter · yarım kalan cümleler"},
  {start: 42.0, end: 57.2, src: "video/04-classroom.mp4", playbackRate: 0.82, brightness: 0.90, saturation: 0.74, contrast: 1.08, name: "04 · Boş sınıf · sessiz hatıralar"},
  {start: 56.4, end: 76.0, src: "video/05-campus-friends.mp4", playbackRate: 0.94, brightness: 0.96, saturation: 0.88, contrast: 1.04, name: "05 · Arkadaşlar · kampüs günleri"},
  {start: 75.2, end: 90.1, src: "video/06-old-photos.mp4", playbackRate: 0.82, brightness: 0.86, saturation: 0.66, contrast: 1.10, name: "06 · Eski fotoğraflar · özlem"},
  {start: 89.3, end: 104.1, src: "video/07-sunset-friends.mp4", playbackRate: 0.88, brightness: 0.90, saturation: 0.84, contrast: 1.06, name: "07 · Günbatımı · birlikte yürüyüş"},
  {start: 103.3, end: 119.3, src: "video/03-notebook.mp4", playbackRate: 0.72, brightness: 0.82, saturation: 0.68, contrast: 1.10, zoomFrom: 1.08, zoomTo: 1.02, name: "08 · Hatıra defteri · ikinci bakış"},
  {start: 118.5, end: 130.8, src: "video/08-train-departure.mp4", playbackRate: 0.90, brightness: 0.82, saturation: 0.76, contrast: 1.10, name: "09 · Tren · ayrılık"},
  {start: 130.0, end: 141.3, src: "video/04-classroom.mp4", playbackRate: 0.68, brightness: 0.78, saturation: 0.62, contrast: 1.12, zoomFrom: 1.06, zoomTo: 1.02, name: "10 · Boş sınıf · geri dönüş"},
  {start: 140.5, end: 150.8, src: "video/09-campus-leave.mp4", playbackRate: 0.90, brightness: 0.80, saturation: 0.72, contrast: 1.12, name: "11 · Kampüsten çıkış · yollar ayrılıyor"},
  {start: 150.0, end: 159.8, src: "video/08-train-departure.mp4", playbackRate: 1.0, brightness: 0.76, saturation: 0.70, contrast: 1.13, zoomFrom: 1.03, zoomTo: 1.07, name: "12 · Final nakarat · tren uzaklaşıyor"},
  {start: 159.0, end: 169.8, src: "video/06-old-photos.mp4", playbackRate: 0.72, brightness: 0.82, saturation: 0.62, contrast: 1.12, zoomFrom: 1.06, zoomTo: 1.02, name: "13 · Eski fotoğraflar · son kez"},
  {start: 169.0, end: 176.8, src: "video/07-sunset-friends.mp4", playbackRate: 0.72, brightness: 0.88, saturation: 0.80, contrast: 1.08, name: "14 · Kıyı · geçmişe bakış"},
  {start: 176.0, end: SON_YAPRAK.durationSeconds, src: "video/02-campus-walk.mp4", playbackRate: 0.78, brightness: 1.0, saturation: 0.88, contrast: 1.03, zoomFrom: 1.03, zoomTo: 1.0, name: "15 · Çıkış · hayat devam ediyor"},
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
