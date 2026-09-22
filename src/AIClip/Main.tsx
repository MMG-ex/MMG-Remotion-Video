import React from "react";
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from "remotion";
import {Audio} from "@remotion/media";
import {MovingVideoShot} from "../Cinematic/MovingVideoShot";
import {AI_PROJECT, AI_SCENES} from "../data/ai-project";
import {AITitles} from "./Titles";

const f = (seconds: number) => Math.round(seconds * AI_PROJECT.fps);

const grade = (mode: "present" | "memory" | "transition") => {
  if (mode === "memory") {
    return {brightness: 1.0, saturation: 0.98, contrast: 1.02, zoomFrom: 1.015, zoomTo: 1.045};
  }
  if (mode === "transition") {
    return {brightness: 0.84, saturation: 0.72, contrast: 1.1, zoomFrom: 1.02, zoomTo: 1.04};
  }
  return {brightness: 0.76, saturation: 0.62, contrast: 1.14, zoomFrom: 1.015, zoomTo: 1.035};
};

export const AIClip: React.FC = () => {
  const {durationInFrames: totalDurationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <Audio src={staticFile(AI_PROJECT.audio)} />

      {AI_SCENES.map((scene) => {
        const from = f(scene.start);
        const end = Math.min(f(scene.end), totalDurationInFrames);
        const durationInFrames = Math.max(1, end - from);
        const g = grade(scene.mode);

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames} name={scene.name}>
            <MovingVideoShot
              src={scene.src}
              durationInFrames={durationInFrames}
              playbackRate={scene.playbackRate}
              brightness={g.brightness}
              saturation={g.saturation}
              contrast={g.contrast}
              zoomFrom={g.zoomFrom}
              zoomTo={g.zoomTo}
            />
          </Sequence>
        );
      })}

      <Sequence durationInFrames={f(7.2)} name="AI açılış jeneriği">
        <AITitles />
      </Sequence>
    </AbsoluteFill>
  );
};
