import React from "react";
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from "remotion";
import {Audio} from "@remotion/media";
import {GeneratedVideoShot} from "../Generated/GeneratedVideoShot";
import {OpeningTitles} from "../Cinematic/OpeningTitles";
import {SON_YAPRAK} from "../data/son-yaprak";
import {GENERATED_SCENES, GENERATED_OVERLAP_SECONDS, GENERATED_SLOT_SECONDS} from "../data/generated-scenes";

const f = (seconds: number) => Math.round(seconds * SON_YAPRAK.fps);

export const Visualizer: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const stepSeconds = GENERATED_SLOT_SECONDS - GENERATED_OVERLAP_SECONDS;

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <Audio src={staticFile(SON_YAPRAK.audio)} />

      {GENERATED_SCENES.map((scene, index) => {
        const startSeconds = index * stepSeconds;
        const from = f(startSeconds);
        const remaining = Math.max(1, durationInFrames - from);
        const duration = Math.min(f(GENERATED_SLOT_SECONDS), remaining);
        return (
          <GeneratedVideoShot
            key={scene.id}
            from={from}
            durationInFrames={duration}
            src={scene.video}
            name={`${String(index + 1).padStart(2, "0")} · ${scene.section} · ${scene.id}`}
            fps={SON_YAPRAK.fps}
          />
        );
      })}

      <Sequence durationInFrames={f(8.2)} name="Açılış jeneriği">
        <OpeningTitles />
      </Sequence>

      <Sequence from={Math.max(0, durationInFrames - f(2.5))} durationInFrames={f(2.5)} name="Final fade">
        <AbsoluteFill style={{backgroundColor: "#000", opacity: 0.38}} />
      </Sequence>
    </AbsoluteFill>
  );
};
