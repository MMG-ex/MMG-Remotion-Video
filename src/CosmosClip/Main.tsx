import React from "react";
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from "remotion";
import {Audio} from "@remotion/media";
import {GeneratedVideoShot} from "../Generated/GeneratedVideoShot";
import {OpeningTitles} from "../Cinematic/OpeningTitles";
import {SON_YAPRAK} from "../data/son-yaprak";
import {GENERATED_SCENES} from "../data/generated-scenes";

const COSMOS_SLOT_SECONDS = 189 / 24;
const COSMOS_OVERLAP_SECONDS = 0.317;
const f = (seconds: number) => Math.round(seconds * SON_YAPRAK.fps);

const COSMOS_SCENES = GENERATED_SCENES.map((scene) => ({
  ...scene,
  video: scene.video.replace("generated/", "cosmos-generated/"),
}));

export const CosmosClip: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const stepSeconds = COSMOS_SLOT_SECONDS - COSMOS_OVERLAP_SECONDS;

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <Audio src={staticFile(SON_YAPRAK.audio)} />

      {COSMOS_SCENES.map((scene, index) => {
        const startSeconds = index * stepSeconds;
        const from = f(startSeconds);
        const remaining = Math.max(1, durationInFrames - from);
        const duration = Math.min(f(COSMOS_SLOT_SECONDS), remaining);

        return (
          <GeneratedVideoShot
            key={scene.id}
            from={from}
            durationInFrames={duration}
            src={scene.video}
            name={`${String(index + 1).padStart(2, "0")} · COSMOS · ${scene.section} · ${scene.id}`}
            fps={SON_YAPRAK.fps}
            playbackRate={1}
            fadeSeconds={COSMOS_OVERLAP_SECONDS}
          />
        );
      })}

      <Sequence durationInFrames={f(8.2)} name="Açılış jeneriği">
        <OpeningTitles />
      </Sequence>

      <Sequence
        from={Math.max(0, durationInFrames - f(2.5))}
        durationInFrames={f(2.5)}
        name="Final fade"
      >
        <AbsoluteFill style={{backgroundColor: "#000", opacity: 0.38}} />
      </Sequence>
    </AbsoluteFill>
  );
};
