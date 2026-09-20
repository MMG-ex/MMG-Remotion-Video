import React from "react";
import {AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {CameraMove} from "../data/son-yaprak";
import {Atmosphere} from "./Atmosphere";

type Props = {from?: number; durationInFrames: number; src: string; camera: CameraMove; name: string; warmth?: number; rain?: boolean; fadeInFrames?: number; fadeOutFrames?: number};

const ShotBody: React.FC<Omit<Props, "from" | "name">> = ({src, camera, durationInFrames, warmth = 0, rain = true, fadeInFrames = 24, fadeOutFrames = 24}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
  const opacity = interpolate(frame, [0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames - 1], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const handheldX = Math.sin(frame / 31) * 2.4 + Math.sin(frame / 13) * 0.7;
  const handheldY = Math.cos(frame / 37) * 1.6;
  const movement = {
    "dolly-in": {scale: 1.06 + progress * 0.12, x: -18 + progress * 28, y: handheldY, rotateY: 0},
    "dolly-out": {scale: 1.19 - progress * 0.12, x: 18 - progress * 28, y: handheldY, rotateY: 0},
    "pan-left": {scale: 1.13, x: 78 - progress * 156, y: handheldY, rotateY: 0},
    "pan-right": {scale: 1.13, x: -78 + progress * 156, y: handheldY, rotateY: 0},
    "orbit-left": {scale: 1.13 + Math.sin(progress * Math.PI) * 0.035, x: 54 - progress * 108, y: handheldY, rotateY: 2.2 - progress * 4.4},
    "orbit-right": {scale: 1.13 + Math.sin(progress * Math.PI) * 0.035, x: -54 + progress * 108, y: handheldY, rotateY: -2.2 + progress * 4.4},
    "crane-up": {scale: 1.15 - progress * 0.04, x: handheldX, y: 46 - progress * 92, rotateY: 0},
    follow: {scale: 1.09 + progress * 0.08, x: -34 + progress * 68 + handheldX, y: 13 - progress * 20 + handheldY, rotateY: 0},
  }[camera];
  return <AbsoluteFill style={{backgroundColor: "#02050a", overflow: "hidden", opacity, perspective: 1600}}>
    <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", scale: movement.scale, translate: `${movement.x}px ${movement.y}px`, rotate: `${Math.sin(frame / 97) * 0.18}deg`, transform: `rotateY(${movement.rotateY}deg)`, filter: `contrast(1.12) saturate(${0.76 + warmth * 0.1}) brightness(${0.78 + Math.sin(frame / 71) * 0.018})`}} />
    <AbsoluteFill style={{opacity: 0.22, scale: 1.035, translate: `${-movement.x * 0.22}px ${-movement.y * 0.18}px`, background: "linear-gradient(105deg, transparent 20%, rgba(230,239,245,.16) 49%, transparent 70%)", mixBlendMode: "screen"}} />
    <Atmosphere rain={rain} warmth={warmth} />
    <div style={{position: "absolute", inset: "auto 0 0", height: 92, background: "linear-gradient(transparent, rgba(0,0,0,.64))"}} />
  </AbsoluteFill>;
};

export const CinematicShot: React.FC<Props> = ({from = 0, durationInFrames, name, ...rest}) => <Sequence from={from} durationInFrames={durationInFrames} name={name} layout="absolute-fill"><ShotBody durationInFrames={durationInFrames} {...rest} /></Sequence>;
