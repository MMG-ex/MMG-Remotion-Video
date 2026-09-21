import React from "react";
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Video} from "@remotion/media";

type MovingVideoShotProps = {
  src: string;
  durationInFrames: number;
  fadeFrames?: number;
  playbackRate?: number;
  brightness?: number;
  saturation?: number;
  contrast?: number;
  zoomFrom?: number;
  zoomTo?: number;
};

export const MovingVideoShot: React.FC<MovingVideoShotProps> = ({
  src,
  durationInFrames,
  fadeFrames = 18,
  playbackRate = 1,
  brightness = 0.88,
  saturation = 0.82,
  contrast = 1.08,
  zoomFrom = 1.02,
  zoomTo = 1.055,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, fadeFrames, Math.max(fadeFrames + 1, durationInFrames - fadeFrames), durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  const scale = interpolate(
    frame,
    [0, Math.max(1, durationInFrames)],
    [zoomFrom, zoomTo],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );

  return (
    <AbsoluteFill style={{opacity, backgroundColor: "#000", overflow: "hidden"}}>
      <Video
        src={staticFile(src)}
        loop
        volume={0}
        playbackRate={playbackRate}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale,
          filter: `brightness(${brightness}) saturate(${saturation}) contrast(${contrast})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(2,5,10,0.08) 0%, rgba(2,5,10,0.02) 42%, rgba(2,5,10,0.34) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 180px rgba(0,0,0,0.45)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
