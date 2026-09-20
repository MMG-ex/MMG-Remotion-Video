import {ALL_FORMATS, Input, UrlSource} from "mediabunny";
import {Composition, staticFile} from "remotion";
import {Visualizer} from "./Visualizer/Main";
import {SON_YAPRAK} from "./data/son-yaprak";

export const RemotionRoot: React.FC = () => <Composition
  id="Visualizer"
  component={Visualizer}
  width={1920}
  height={1080}
  durationInFrames={Math.ceil(SON_YAPRAK.durationSeconds * SON_YAPRAK.fps)}
  fps={SON_YAPRAK.fps}
  calculateMetadata={async () => {
    const input = new Input({source: new UrlSource(staticFile(SON_YAPRAK.audio)), formats: ALL_FORMATS});
    const durationInSeconds = await input.computeDuration();
    return {durationInFrames: Math.ceil(durationInSeconds * SON_YAPRAK.fps), fps: SON_YAPRAK.fps};
  }}
/>;
