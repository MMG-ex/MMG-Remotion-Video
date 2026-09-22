import React from "react";
import {AbsoluteFill, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";

type Props = {
  from: number;
  durationInFrames: number;
  src: string;
  name: string;
  fps: number;
};

const ShotBody: React.FC<Omit<Props, "from" | "name">> = ({durationInFrames, src, fps}) => {
  const frame = useCurrentFrame();
  const fadeFrames = Math.max(8, Math.round(fps * 0.45));
  const opacity = interpolate(
    frame,
    [0, fadeFrames, Math.max(fadeFrames + 1, durationInFrames - fadeFrames), durationInFrames - 1],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  return (
    <AbsoluteFill style={{backgroundColor: "#000", overflow: "hidden", opacity}}>
      <OffthreadVideo
        src={staticFile(src)}
        muted
        playbackRate={0.765}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.012)",
        }}
      />
      <AbsoluteFill style={{boxShadow: "inset 0 0 150px 42px rgba(0,0,0,.34)"}} />
    </AbsoluteFill>
  );
};

export const GeneratedVideoShot: React.FC<Props> = ({from, durationInFrames, name, ...rest}) => (
  <Sequence from={from} durationInFrames={durationInFrames} name={name} layout="absolute-fill">
    <ShotBody durationInFrames={durationInFrames} {...rest} />
  </Sequence>
);
