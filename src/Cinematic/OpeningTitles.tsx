import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {SON_YAPRAK} from "../data/son-yaprak";

export const OpeningTitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleScale = spring({fps, frame: frame - 20, config: {damping: 180, stiffness: 70, mass: 1.3}});
  const fade = (start: number, end: number) => interpolate(frame, [start, start + 18, end - 18, end], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)});
  return <AbsoluteFill style={{alignItems: "center", justifyContent: "center", color: "#eee5d4", textAlign: "center", textShadow: "0 4px 34px rgba(0,0,0,.9)", pointerEvents: "none"}}>
    <div style={{position: "absolute", top: "35%", opacity: fade(30, 126), scale: interpolate(titleScale, [0, 1], [0.97, 1]), fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 88, fontWeight: 400, letterSpacing: 18}}>{SON_YAPRAK.title}</div>
    <div style={{position: "absolute", top: "53%", opacity: fade(90, 186), fontFamily: "Arial, sans-serif", fontSize: 25, fontWeight: 500, letterSpacing: 10}}>{SON_YAPRAK.artist}</div>
    <div style={{position: "absolute", top: "60%", opacity: fade(150, 246), fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 22, letterSpacing: 3}}>{SON_YAPRAK.credits}</div>
  </AbsoluteFill>;
};
