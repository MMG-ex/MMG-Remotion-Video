import {ALL_FORMATS, Input, UrlSource} from "mediabunny";
import {Composition, staticFile} from "remotion";
import {Visualizer} from "./Visualizer/Main";
import {AIClip} from "./AIClip/Main";
import {CosmosClip} from "./CosmosClip/Main";
import {SON_YAPRAK} from "./data/son-yaprak";
import {AI_PROJECT} from "./data/ai-project";

const metadataFor = (audio: string, fps: number) => async () => {
  const input = new Input({source: new UrlSource(staticFile(audio)), formats: ALL_FORMATS});
  const durationInSeconds = await input.computeDuration();
  return {durationInFrames: Math.ceil(durationInSeconds * fps), fps};
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
      id="CosmosClip"
      component={CosmosClip}
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
  </>
);
