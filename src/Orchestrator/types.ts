export type OrchestratorTransition = "none" | "fade" | "crossfade";

export type OrchestratorScene = {
  scene: string;
  start: number;
  duration: number;
  video_path: string;
  audio_path?: string;
  caption?: string;
  transition?: OrchestratorTransition;
  title?: string;
};

export type OrchestratorManifest = {
  fps: number;
  width: number;
  height: number;
  backgroundColor?: string;
  scenes: OrchestratorScene[];
};

export type OrchestratorFinalProps = {
  manifest: OrchestratorManifest;
};
