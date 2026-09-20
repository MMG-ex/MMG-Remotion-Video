import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";

export const Atmosphere: React.FC<{rain?: boolean; warmth?: number}> = ({rain = true, warmth = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none"}}>
    {rain ? Array.from({length: 42}).map((_, index) => {
      const x = random(`rain-x-${index}`) * width;
      const speed = 13 + random(`rain-s-${index}`) * 21;
      const y = ((frame * speed + random(`rain-y-${index}`) * height) % (height + 220)) - 110;
      return <div key={index} style={{position: "absolute", left: x, top: y, width: 1.5, height: 46 + random(`rain-h-${index}`) * 96, opacity: 0.07 + random(`rain-o-${index}`) * 0.18, background: "linear-gradient(transparent, rgba(215,232,245,.92))", rotate: "8deg"}} />;
    }) : null}
    <AbsoluteFill style={{opacity: 0.13, backgroundImage: "repeating-radial-gradient(circle at 30% 40%, transparent 0, rgba(255,255,255,.14) 1px, transparent 2px)", backgroundSize: "8px 8px", backgroundPosition: `${frame % 8}px ${(frame * 1.7) % 8}px`, mixBlendMode: "soft-light"}} />
    <AbsoluteFill style={{opacity: interpolate(Math.sin(frame / 63), [-1, 1], [0.08, 0.18]), background: `radial-gradient(circle at ${35 + Math.sin(frame / 83) * 8}% 65%, rgba(220,230,235,.18), transparent 42%)`, filter: "blur(26px)"}} />
    <AbsoluteFill style={{background: `linear-gradient(120deg, rgba(1,12,28,.34), rgba(1,7,18,.12) 55%, rgba(151,83,28,${0.08 + warmth * 0.12}))`}} />
    <AbsoluteFill style={{boxShadow: "inset 0 0 260px 90px rgba(0,0,0,.72)"}} />
  </AbsoluteFill>;
};
