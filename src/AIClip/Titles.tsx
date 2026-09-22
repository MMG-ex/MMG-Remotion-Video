import React from "react";
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {AI_PROJECT} from "../data/ai-project";

export const AITitles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({fps, frame: frame - 16, config: {damping: 180, stiffness: 70, mass: 1.2}});
  const fade = (start: number, end: number) =>
    interpolate(frame, [start, start + 16, end - 16, end], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });

  return (
    <AbsoluteFill style={{
      alignItems: "center",
      justifyContent: "center",
      color: "#f2eadf",
      textAlign: "center",
      textShadow: "0 4px 32px rgba(0,0,0,.92)",
      pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute",
        top: "36%",
        opacity: fade(20, 122),
        scale: interpolate(scale, [0,1], [0.97,1]),
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: 88,
        fontWeight: 400,
        letterSpacing: 18,
      }}>{AI_PROJECT.title}</div>
      <div style={{
        position: "absolute",
        top: "54%",
        opacity: fade(88, 174),
        fontFamily: "Arial, sans-serif",
        fontSize: 24,
        letterSpacing: 4,
      }}>{AI_PROJECT.lyricCredit}</div>
      <div style={{
        position: "absolute",
        top: "60%",
        opacity: fade(132, 216),
        fontFamily: "Arial, sans-serif",
        fontSize: 22,
        letterSpacing: 4,
      }}>{AI_PROJECT.musicCredit}</div>
    </AbsoluteFill>
  );
};
