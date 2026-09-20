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
    <CinematicShot durationInFrames={f(12)} src="images/01-window.jpg" camera="dolly-in" name="01 · Intro · Yağmurlu pencere" warmth={0.2} />
    <CinematicShot from={f(11)} durationInFrames={f(12)} src="images/02-street.jpg" camera="follow" name="02 · Intro · Sokakta yürüyüş" />
    <CinematicShot from={f(22)} durationInFrames={f(13)} src="images/03-key.jpg" camera="dolly-in" name="03 · Kıta · Anahtar ve yaprak" warmth={0.35} />
    <CinematicShot from={f(34)} durationInFrames={f(14)} src="images/04-door.jpg" camera="pan-right" name="04 · Kıta · Kapıdan ayrılış" warmth={0.45} />
    <CinematicShot from={f(47)} durationInFrames={f(14)} src="images/02-street.jpg" camera="orbit-left" name="05 · Ön nakarat · Takip" />
    <CinematicShot from={f(60)} durationInFrames={f(14)} src="images/05-bus.jpg" camera="pan-left" name="06 · Ön nakarat · Gece otobüsü" warmth={0.25} />
    <CinematicShot from={f(73)} durationInFrames={f(15)} src="images/06-puddle.jpg" camera="crane-up" name="07 · Nakarat · Papatya yaprakları" />
    <CinematicShot from={f(87)} durationInFrames={f(15)} src="images/07-pier.jpg" camera="orbit-right" name="08 · Nakarat · Boğaz kıyısı" />
    <CinematicShot from={f(101)} durationInFrames={f(15)} src="images/08-daisy.jpg" camera="dolly-out" name="09 · Ara · Papatya ve valiz" warmth={0.2} rain={false} />
    <CinematicShot from={f(115)} durationInFrames={f(15)} src="images/09-suitcase.jpg" camera="dolly-in" name="10 · Kıta · Valiz ve anahtar" warmth={0.5} rain={false} />
    <CinematicShot from={f(129)} durationInFrames={f(14)} src="images/04-door.jpg" camera="follow" name="11 · Kıta · Boş koridor" warmth={0.35} />
    <CinematicShot from={f(142)} durationInFrames={f(15)} src="images/02-street.jpg" camera="orbit-right" name="12 · Ön nakarat · Kararsız yürüyüş" />
    <CinematicShot from={f(156)} durationInFrames={f(15)} src="images/10-train.jpg" camera="pan-right" name="13 · Nakarat · Peron" warmth={0.15} />
    <CinematicShot from={f(170)} durationInFrames={f(14)} src="images/11-room.jpg" camera="dolly-out" name="14 · Köprü · Boş oda" warmth={0.3} rain={false} />
    <CinematicShot from={f(183)} durationInFrames={f(14)} src="images/07-pier.jpg" camera="crane-up" name="15 · Final nakarat · İskele" />
    <CinematicShot from={f(196)} durationInFrames={f(13)} src="images/12-dawn.jpg" camera="dolly-in" name="16 · Final nakarat · Şafak" warmth={0.7} rain={false} />
    <CinematicShot from={f(208)} durationInFrames={f(12)} src="images/08-daisy.jpg" camera="dolly-in" name="17 · Final · Son yaprak" warmth={0.6} rain={false} />
    <CinematicShot from={f(219)} durationInFrames={Math.max(1, durationInFrames - f(219))} src="images/12-dawn.jpg" camera="dolly-out" name="18 · Outro · Kapanış" warmth={0.8} rain={false} fadeOutFrames={f(2.2)} />
    <Sequence durationInFrames={f(8.2)} name="Açılış jeneriği"><OpeningTitles /></Sequence>
  </AbsoluteFill>;
};
