import {ALL_FORMATS, Input, UrlSource} from "mediabunny";
import {Composition, staticFile} from "remotion";
import {Visualizer} from "./Visualizer/Main";
import {AIClip} from "./AIClip/Main";
import {OrchestratorFinal} from "./Orchestrator/Main";
import {ORCHESTRATOR_SMOKE_PROPS} from "./Orchestrator/defaultProps";
import type {OrchestratorFinalProps} from "./Orchestrator/types";
import {SON_YAPRAK} from "./data/son-yaprak";
import {AI_PROJECT} from "./data/ai-project";

const metadataFor = (audio: string, fps: number) => async () => {
  const input = new Input({source: new UrlSource(staticFile(audio)), formats: ALL_FORMATS});
  const durationInSeconds = await input.computeDuration();
  return {durationInFrames: Math.ceil(durationInSeconds * fps), fps};
};

const orchestratorMetadata = ({props}: {props: OrchestratorFinalProps}) => {
  const {manifest} = props;
  const endSeconds = manifest.scenes.reduce(
    (max, scene) => Math.max(max, scene.start + scene.duration),
    0,
  );

  return {
    durationInFrames: Math.max(1, Math.ceil(endSeconds * manifest.fps)),
    fps: manifest.fps,
    width: manifest.width,
    height: manifest.height,
  };
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Visualizer"
      component={Visualizer}
      width={1920}
      height={1080}
      durationInFrames={Math.ceil(SON_YAPRAK.durationSeconds * SON_YAPRAK.fps)}
      fps={SON_YAPRAK.fps}
      calculateMetadata={metadataFor(SON_YAPRAK.audio, SON_YAPRAK.fps)}
    />
    <Composition
      id="AIClip"
      component={AIClip}
      width={1920}
      height={1080}
      durationInFrames={Math.ceil(AI_PROJECT.durationSeconds * AI_PROJECT.fps)}
      fps={AI_PROJECT.fps}
      calculateMetadata={metadataFor(AI_PROJECT.audio, AI_PROJECT.fps)}
    />
    <Composition
      id="OrchestratorFinal"
      component={OrchestratorFinal}
      width={ORCHESTRATOR_SMOKE_PROPS.manifest.width}
      height={ORCHESTRATOR_SMOKE_PROPS.manifest.height}
      fps={ORCHESTRATOR_SMOKE_PROPS.manifest.fps}
      durationInFrames={ORCHESTRATOR_SMOKE_PROPS.manifest.fps * 4}
      defaultProps={ORCHESTRATOR_SMOKE_PROPS}
      calculateMetadata={orchestratorMetadata}
    />
  </>
);
