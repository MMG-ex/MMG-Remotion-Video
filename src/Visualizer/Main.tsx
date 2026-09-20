import React from "react";
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from "remotion";
import {Audio} from "@remotion/media";
import {CinematicShot} from "../Cinematic/CinematicShot";
import {OpeningTitles} from "../Cinematic/OpeningTitles";
import {SON_YAPRAK} from "../data/son-yaprak";

const f = (seconds: number) => Math.round(seconds * SON_YAPRAK.fps);

export const Visualizer: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  return <AbsoluteFill style={{backgroundColor: "#000"}}>
    <Audio src={staticFile(SON_YAPRAK.audio)} />
    <CinematicShot durationInFrames={f(15.2)} src="images/01-window.jpg" camera="dolly-in" name="01 · Giriş · Kampüse dönüş" warmth={0.15} />
    <CinematicShot from={f(14.4)} durationInFrames={f(17.1)} src="images/02-street.jpg" camera="follow" name="02 · Kıta · Boş kampüs yolu" />
    <CinematicShot from={f(30.6)} durationInFrames={f(11.6)} src="images/03-key.jpg" camera="dolly-in" name="03 · Kıta · Eski anahtar" warmth={0.35} />
    <CinematicShot from={f(41.3)} durationInFrames={f(15.2)} src="images/04-door.jpg" camera="pan-right" name="04 · Yükseliş · Boş koridor" warmth={0.45} />
    <CinematicShot from={f(55.6)} durationInFrames={f(19.8)} src="images/05-bus.jpg" camera="pan-left" name="05 · Nakarat · Gece otobüsü" warmth={0.25} />
    <CinematicShot from={f(74.5)} durationInFrames={f(15)} src="images/06-puddle.jpg" camera="crane-up" name="06 · Nakarat · Eski fotoğraflar" />
    <CinematicShot from={f(88.6)} durationInFrames={f(14.9)} src="images/07-pier.jpg" camera="orbit-right" name="07 · Nakarat · Kıyı anıları" />
    <CinematicShot from={f(102.6)} durationInFrames={f(16.1)} src="images/08-daisy.jpg" camera="dolly-out" name="08 · Ara · Hatıra defteri" warmth={0.25} rain={false} />
    <CinematicShot from={f(117.8)} durationInFrames={f(12.2)} src="images/09-suitcase.jpg" camera="dolly-in" name="09 · Kıta · Yarım kalan vedalar" warmth={0.5} rain={false} />
    <CinematicShot from={f(129.1)} durationInFrames={f(11.4)} src="images/11-room.jpg" camera="follow" name="10 · Kıta · Boş sınıf" warmth={0.35} rain={false} />
    <CinematicShot from={f(139.6)} durationInFrames={f(10.4)} src="images/02-street.jpg" camera="orbit-left" name="11 · Yükseliş · Kampüsten çıkış" />
    <CinematicShot from={f(149.1)} durationInFrames={f(9.9)} src="images/10-train.jpg" camera="pan-right" name="12 · Final · Peronda ayrılık" warmth={0.15} />
    <CinematicShot from={f(158.1)} durationInFrames={f(10.9)} src="images/11-room.jpg" camera="dolly-out" name="13 · Final · Boş odada anılar" warmth={0.3} rain={false} />
    <CinematicShot from={f(168.1)} durationInFrames={f(7.9)} src="images/07-pier.jpg" camera="crane-up" name="14 · Final · Geçmişe son bakış" />
    <CinematicShot from={f(175.1)} durationInFrames={Math.max(1, durationInFrames - f(175.1))} src="images/12-dawn.jpg" camera="dolly-in" name="15 · Çıkış · Yeni gün" warmth={0.8} rain={false} fadeOutFrames={f(2.1)} />
    <Sequence durationInFrames={f(8.2)} name="Açılış jeneriği"><OpeningTitles /></Sequence>
  </AbsoluteFill>;
};
