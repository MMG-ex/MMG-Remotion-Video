import React from "react";
import {AbsoluteFill, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";
import {CameraMove} from "../data/son-yaprak";
import {Atmosphere} from "./Atmosphere";

type Props = {
  from?: number;
  durationInFrames: number;
  src: string;
  camera: CameraMove;
  name: string;
  warmth?: number;
  rain?: boolean;
  fadeInFrames?: number;
  fadeOutFrames?: number;
};

const ShotBody: React.FC<Omit<Props, "from" | "name">> = ({
  src,
  camera,
  durationInFrames,
  warmth = 0,
  rain = true,
  fadeInFrames = 18,
  fadeOutFrames = 20,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)}
  );

  const opacity = interpolate(
    frame,
    [0, fadeInFrames, Math.max(fadeInFrames + 1, durationInFrames - fadeOutFrames), durationInFrames - 1],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  const breathe = Math.sin(frame / 18) * 4 + Math.sin(frame / 41) * 2;
  const driftY = Math.cos(frame / 27) * 3.2;
  const sway = Math.sin(frame / 34) * 0.55;

  const movement = {
    "dolly-in":   {scale: 1.08 + progress * 0.22, x: -46 + progress * 92,  y: 18 - progress * 36,  ry: -1.2 + progress * 2.4},
    "dolly-out":  {scale: 1.30 - progress * 0.20, x: 52 - progress * 104,  y: -16 + progress * 34, ry: 1.2 - progress * 2.4},
    "pan-left":   {scale: 1.22,                  x: 160 - progress * 320, y: driftY,             ry: 1.8 - progress * 3.6},
    "pan-right":  {scale: 1.22,                  x: -160 + progress * 320,y: driftY,             ry: -1.8 + progress * 3.6},
    "orbit-left": {scale: 1.18 + Math.sin(progress * Math.PI) * 0.09, x: 118 - progress * 236, y: 22 - progress * 44, ry: 4.5 - progress * 9},
    "orbit-right":{scale: 1.18 + Math.sin(progress * Math.PI) * 0.09, x: -118 + progress * 236,y: 22 - progress * 44, ry: -4.5 + progress * 9},
    "crane-up":   {scale: 1.24 - progress * 0.10, x: breathe,            y: 110 - progress * 220,ry: sway},
    "follow":     {scale: 1.10 + progress * 0.18, x: -74 + progress * 148 + breathe, y: 42 - progress * 76 + driftY, ry: -1.5 + progress * 3},
  }[camera];

  const bgX = -movement.x * 0.22 + Math.sin(frame / 53) * 8;
  const bgY = -movement.y * 0.16 + Math.cos(frame / 61) * 5;
  const fgX = movement.x * 1.04;
  const fgY = movement.y * 1.04;

  return (
    <AbsoluteFill style={{backgroundColor: "#02050a", overflow: "hidden", opacity, perspective: 1500}}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: "-6%",
          width: "112%",
          height: "112%",
          objectFit: "cover",
          transform: `translate3d(${bgX}px,${bgY}px,-90px) scale(${1.18 + progress * 0.035}) rotate(${-sway * 0.25}deg)`,
          filter: "blur(12px) brightness(.43) saturate(.72)",
          opacity: 0.88,
        }}
      />

      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transformOrigin: "50% 50%",
          transform: `translate3d(${fgX}px,${fgY}px,0) scale(${movement.scale}) rotateY(${movement.ry}deg) rotateZ(${sway}deg)`,
          filter: `contrast(1.14) saturate(${0.82 + warmth * 0.12}) brightness(${0.80 + Math.sin(frame / 47) * 0.035})`,
        }}
      />

      <AbsoluteFill
        style={{
          opacity: 0.23,
          transform: `translate3d(${-movement.x * 0.38}px,${-movement.y * 0.24}px,0) scale(1.08)`,
          background: "linear-gradient(105deg, transparent 14%, rgba(235,242,248,.24) 45%, transparent 67%)",
          mixBlendMode: "screen",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: 0.13,
          transform: `translateX(${-420 + ((frame * 8) % 2800)}px) skewX(-18deg)`,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,230,185,.44) 48%, transparent 100%)",
          filter: "blur(34px)",
          width: 420,
        }}
      />

      <Atmosphere rain={rain} warmth={warmth} />

      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 240px 64px rgba(0,0,0,.48)",
          background: `radial-gradient(circle at ${46 + Math.sin(frame / 44) * 8}% ${44 + Math.cos(frame / 37) * 7}%, rgba(255,255,255,.035), transparent 42%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "auto 0 0",
          height: 110,
          background: "linear-gradient(transparent, rgba(0,0,0,.66))",
        }}
      />
    </AbsoluteFill>
  );
};

export const CinematicShot: React.FC<Props> = ({from = 0, durationInFrames, name, ...rest}) => (
  <Sequence from={from} durationInFrames={durationInFrames} name={name} layout="absolute-fill">
    <ShotBody durationInFrames={durationInFrames} {...rest} />
  </Sequence>
);
