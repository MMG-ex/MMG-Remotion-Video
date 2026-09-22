# Son Yaprak FREE AI Video Generator
# Runs on Kaggle free GPU and creates genuine motion video clips.
import gc
import json
import os
import subprocess
import sys
from pathlib import Path

BATCH_SIZE = 5
BUNDLED_MANIFEST = None
WORK = Path("/kaggle/working")
OUT = WORK / "generated"
OUT.mkdir(parents=True, exist_ok=True)

STYLE = (
    " Photorealistic cinematic drama, real continuous motion, natural human body movement, "
    "realistic cloth and hair physics, physically plausible rain wind water and reflections, "
    "subtle handheld 35mm cinema camera, shallow depth of field, soft filmic contrast, "
    "emotionally restrained acting, no text, no subtitles, no logo."
)
NEGATIVE = (
    "static still image, frozen frame, no motion, slideshow, morphing face, deformed hands, "
    "extra limbs, duplicate people, warped body, flicker, jitter, text, subtitles, watermark, "
    "cartoon, illustration, oversaturated colors, low detail"
)

if not BUNDLED_MANIFEST:
    raise RuntimeError("BUNDLED_MANIFEST was not injected by the GitHub orchestrator")

manifest = BUNDLED_MANIFEST
batch = manifest.get("scenes", [])[:BATCH_SIZE]

if not batch:
    (WORK / "generation-report.json").write_text(json.dumps({"status":"complete","generated":[]}, indent=2), encoding="utf-8")
    print("All scenes already generated.")
    raise SystemExit(0)

print("Batch:", [s["id"] for s in batch])

subprocess.check_call([
    sys.executable, "-m", "pip", "install", "-q", "-U",
    "diffusers>=0.30.1", "transformers>=4.44.0", "accelerate>=0.33.0",
    "imageio-ffmpeg>=0.5.1", "sentencepiece", "protobuf"
])

import torch
from diffusers import CogVideoXPipeline
from diffusers.utils import export_to_video

print("CUDA:", torch.cuda.is_available())
if torch.cuda.is_available():
    print("GPU:", torch.cuda.get_device_name(0))
    print("VRAM GB:", round(torch.cuda.get_device_properties(0).total_memory / 1024**3, 2))

model_id = manifest.get("model", "zai-org/CogVideoX-2b")
print("Loading model:", model_id)
pipe = CogVideoXPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe.enable_model_cpu_offload()
pipe.enable_sequential_cpu_offload()
pipe.vae.enable_slicing()
pipe.vae.enable_tiling()

results = []
for scene in batch:
    scene_id = scene["id"]
    raw_path = OUT / f"{scene_id}-raw.mp4"
    final_path = WORK / f"{scene_id}.mp4"
    prompt = scene["prompt"] + STYLE
    print("\n=== GENERATING", scene_id, "===")
    print(prompt)

    try:
        generator = torch.Generator(device="cuda").manual_seed(int(scene["seed"]))
        frames = pipe(
            prompt=prompt,
            negative_prompt=NEGATIVE,
            num_videos_per_prompt=1,
            num_inference_steps=35,
            num_frames=49,
            guidance_scale=6,
            generator=generator,
        ).frames[0]

        export_to_video(frames, str(raw_path), fps=8)

        # CogVideoX-2B is 720x480. Crop to 16:9 and upscale to a Remotion-friendly 1280x720 H.264 file.
        subprocess.check_call([
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(raw_path),
            "-vf", "crop=720:404:0:38,scale=1280:720:flags=lanczos",
            "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart",
            str(final_path)
        ])
        results.append({"id":scene_id, "status":"ok", "file":final_path.name, "seed":scene["seed"]})
        print("DONE:", final_path)
    except Exception as e:
        results.append({"id":scene_id, "status":"failed", "error":repr(e), "seed":scene["seed"]})
        print("FAILED:", scene_id, repr(e))
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

report = {
    "status": "batch-finished",
    "model": model_id,
    "batch": [s["id"] for s in batch],
    "results": results,
}
(WORK / "generation-report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps(report, indent=2, ensure_ascii=False))
