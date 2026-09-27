import React from "react";
import {Audio, Video} from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type {OrchestratorFinalProps, OrchestratorScene} from "./types";

const mediaSrc = (src: string) =>
  /^https?:\/\//i.test(src) ? src : staticFile(src.replace(/^\/+/, ""));

const SceneLayer: React.FC<{
  scene: OrchestratorScene;
  durationInFrames: number;
}> = ({scene, durationInFrames}) => {
  const frame = useCurrentFrame();
  const fadeFrames = Math.max(1, Math.min(12, Math.floor(durationInFrames / 3)));
  const usesFade = scene.transition === "fade" || scene.transition === "crossfade";
  const opacity = usesFade
    ? interpolate(
        frame,
        [0, fadeFrames, Math.max(fadeFrames, durationInFrames - fadeFrames), durationInFrames - 1],
        [0, 1, 1, 0],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
      )
    : 1;

  return (
    <AbsoluteFill style={{backgroundColor: "#000", opacity}}>
      <Video
        src={mediaSrc(scene.video_path)}
        durationInFrames={durationInFrames}
        muted={Boolean(scene.audio_path)}
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />

      {scene.audio_path ? (
        <Audio
          src={mediaSrc(scene.audio_path)}
          durationInFrames={durationInFrames}
        />
      ) : null}

      {scene.title ? (
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 92,
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontWeight: 800,
            fontSize: 54,
            letterSpacing: 1.5,
            textShadow: "0 3px 18px rgba(0,0,0,.85)",
          }}
        >
          {scene.title}
        </div>
      ) : null}

      {scene.caption ? (
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            bottom: 120,
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontWeight: 700,
            fontSize: 42,
            lineHeight: 1.18,
            textAlign: "center",
            padding: "20px 28px",
            borderRadius: 20,
            backgroundColor: "rgba(0,0,0,.52)",
            textShadow: "0 2px 12px rgba(0,0,0,.9)",
          }}
        >
          {scene.caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const OrchestratorFinal: React.FC<OrchestratorFinalProps> = ({manifest}) => {
  const {fps, durationInFrames: totalFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: manifest.backgroundColor ?? "#000"}}>
      {manifest.scenes.map((scene, index) => {
        const from = Math.max(0, Math.round(scene.start * fps));
        const requestedFrames = Math.max(1, Math.round(scene.duration * fps));
        const durationInFrames = Math.max(1, Math.min(requestedFrames, totalFrames - from));

        if (from >= totalFrames) {
          return null;
        }

        return (
          <Sequence
            key={`${scene.scene}-${index}`}
            from={from}
            durationInFrames={durationInFrames}
            name={scene.scene}
          >
            <SceneLayer scene={scene} durationInFrames={durationInFrames} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
