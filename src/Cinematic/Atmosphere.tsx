import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";

export const Atmosphere: React.FC<{rain?: boolean; warmth?: number}> = ({rain = true, warmth = 0}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill style={{overflow: "hidden", pointerEvents: "none"}}>
      {rain ? Array.from({length: 78}).map((_, index) => {
        const x = random(`rain-x-${index}`) * (width + 260) - 130;
        const speed = 18 + random(`rain-s-${index}`) * 34;
        const y = ((frame * speed + random(`rain-y-${index}`) * height) % (height + 300)) - 150;
        const depth = 0.45 + random(`rain-d-${index}`) * 1.25;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 1.2 * depth,
              height: (44 + random(`rain-h-${index}`) * 118) * depth,
              opacity: 0.07 + random(`rain-o-${index}`) * 0.25,
              background: "linear-gradient(transparent, rgba(218,235,248,.96))",
              transform: "rotate(9deg)",
              filter: depth > 1.25 ? "blur(.5px)" : undefined,
            }}
          />
        );
      }) : null}

      {Array.from({length: 13}).map((_, index) => {
        const baseX = random(`mist-x-${index}`) * width;
        const baseY = random(`mist-y-${index}`) * height;
        const x = baseX + Math.sin((frame + index * 23) / (48 + index * 2)) * 80;
        const y = baseY + Math.cos((frame + index * 31) / (66 + index * 3)) * 28;
        return (
          <div
            key={`mist-${index}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 180 + random(`mist-w-${index}`) * 320,
              height: 70 + random(`mist-h-${index}`) * 150,
              borderRadius: "50%",
              background: "rgba(214,228,238,.055)",
              filter: "blur(32px)",
              transform: `scale(${0.8 + Math.sin((frame + index * 11) / 58) * 0.15})`,
            }}
          />
        );
      })}

      <AbsoluteFill
        style={{
          opacity: 0.12,
          backgroundImage: "repeating-radial-gradient(circle at 30% 40%, transparent 0, rgba(255,255,255,.16) 1px, transparent 2px)",
          backgroundSize: "8px 8px",
          backgroundPosition: `${frame % 8}px ${(frame * 1.9) % 8}px`,
          mixBlendMode: "soft-light",
        }}
      />

      <AbsoluteFill
        style={{
          opacity: interpolate(Math.sin(frame / 47), [-1, 1], [0.07, 0.19]),
          background: `radial-gradient(circle at ${32 + Math.sin(frame / 43) * 12}% ${60 + Math.cos(frame / 51) * 8}%, rgba(220,230,235,.22), transparent 44%)`,
          filter: "blur(24px)",
        }}
      />

      <AbsoluteFill
        style={{
          background: `linear-gradient(120deg, rgba(1,12,28,.34), rgba(1,7,18,.10) 55%, rgba(151,83,28,${0.08 + warmth * 0.12}))`,
        }}
      />

      <AbsoluteFill style={{boxShadow: "inset 0 0 250px 84px rgba(0,0,0,.67)"}} />
    </AbsoluteFill>
  );
};
