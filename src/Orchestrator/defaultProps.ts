import type {OrchestratorFinalProps} from "./types";

export const ORCHESTRATOR_SMOKE_PROPS: OrchestratorFinalProps = {
  manifest: {
    fps: 30,
    width: 1080,
    height: 1920,
    backgroundColor: "#050505",
    scenes: [
      {
        scene: "smoke-01",
        start: 0,
        duration: 4,
        video_path: "orchestrator/smoke-scene.mp4",
        audio_path: "orchestrator/smoke-audio.wav",
        title: "MMG VIDEO ORCHESTRATOR",
        caption: "REMOTION FINALIZER · JSON SCENE ASSEMBLY",
        transition: "fade",
      },
    ],
  },
};
