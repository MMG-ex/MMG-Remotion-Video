#!/usr/bin/env python3
import argparse
import base64
import json
import os
import subprocess
import time
from pathlib import Path
from typing import Any

import requests

ENDPOINT = "https://ai.api.nvidia.com/v1/genai/nvidia/cosmos3-nano"
POLL_BASE = "https://api.nvcf.nvidia.com/v2/nvcf/pexec/status"

STYLE = (
    "Photorealistic cinematic drama. Preserve the same person, clothing, age, body proportions, "
    "environment layout and object identity from the reference image. Real continuous human motion, "
    "natural gait and hand movement, realistic cloth physics, physically plausible rain, wind, water, "
    "reflections and depth. Restrained acting, 35mm cinema lens, shallow depth of field, subtle film grain, "
    "soft natural contrast, realistic exposure, coherent lighting, no jump cuts inside the shot. "
    "Keep the face turned away, obscured, or too distant to identify. No text, no subtitles, no logo, "
    "no watermark-like graphics, no extra people, no duplicate limbs, no morphing."
)

def sh(*args: str) -> str:
    p = subprocess.run(args, check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    return p.stdout.strip()

def probe_duration(path: Path) -> float:
    return float(sh("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)))

def probe_video(path: Path) -> tuple[str, int, int]:
    out = sh(
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=codec_name,width,height", "-of", "json", str(path)
    )
    s = json.loads(out)["streams"][0]
    return str(s["codec_name"]), int(s["width"]), int(s["height"])

def image_data_uri(path: Path) -> str:
    ext = path.suffix.lower()
    mime = {
        ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"
    }.get(ext)
    if not mime:
        raise ValueError(f"Unsupported image type: {path}")
    data = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{data}"

def extract_result(resp: requests.Response, headers: dict[str, str], timeout_s: int) -> dict[str, Any]:
    if resp.status_code == 200:
        return resp.json()
    if resp.status_code != 202:
        raise RuntimeError(f"HTTP {resp.status_code}: {resp.text[:2000]}")
    try:
        body = resp.json()
    except Exception:
        body = {}
    req_id = (
        body.get("reqId") or body.get("request_id") or body.get("requestId")
        or resp.headers.get("NVCF-REQID") or resp.headers.get("nvcf-reqid")
    )
    if not req_id:
        raise RuntimeError(f"HTTP 202 without request id: {resp.text[:1000]}")
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        time.sleep(5)
        poll = requests.get(f"{POLL_BASE}/{req_id}", headers=headers, timeout=60)
        if poll.status_code == 202:
            continue
        if poll.status_code == 200:
            return poll.json()
        raise RuntimeError(f"Poll HTTP {poll.status_code}: {poll.text[:2000]}")
    raise TimeoutError(f"Timed out polling request {req_id}")

def generate_one(
    api_key: str,
    scene: dict[str, Any],
    out_dir: Path,
    resolution: str,
    num_frames: int,
    fps: int,
    steps: int,
    request_timeout_s: int,
) -> dict[str, Any]:
    sid = scene["id"]
    final_path = out_dir / f"{sid}.mp4"
    if final_path.exists() and final_path.stat().st_size > 300_000:
        try:
            d = probe_duration(final_path)
            codec, w, h = probe_video(final_path)
            if 7.0 <= d <= 8.5 and codec == "h264" and w == 1280 and h == 720:
                print(f"SKIP valid existing {sid}: {d:.3f}s {w}x{h}")
                return {"id": sid, "status": "existing", "duration": d, "bytes": final_path.stat().st_size}
        except Exception:
            pass

    source = Path("public") / scene["source"]
    if not source.exists():
        raise FileNotFoundError(f"{sid}: source image missing: {source}")

    raw_path = out_dir / f"{sid}-cosmos-raw.mp4"
    payload = {
        "prompt": scene["prompt"] + " " + STYLE,
        "image": image_data_uri(source),
        "negative_prompt": (
            "ugly, static with no motion, motion blur, oversaturated, shaky, low resolution, "
            "grainy, pixelated, poorly lit, underexposed, overexposed, choppy, jerky motion, "
            "artifacting, unnatural transitions, jump cuts, visual noise, flicker, distorted hands, "
            "extra limbs, duplicate people, face morphing, text, subtitles, logo, watermark"
        ),
        "resolution": resolution,
        "num_output_frames": num_frames,
        "fps": float(fps),
        "steps": steps,
        "guidance_scale": 4.0,
        "seed": int(scene["seed"]),
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    last_error = None
    for attempt in range(1, 6):
        print(f"\n=== {sid} attempt {attempt}/5 ===")
        try:
            r = requests.post(ENDPOINT, headers=headers, json=payload, timeout=request_timeout_s)
            if r.status_code in (429, 500, 502, 503, 504):
                wait = min(120, 20 * attempt)
                print(f"Transient HTTP {r.status_code}; retrying in {wait}s")
                time.sleep(wait)
                continue
            result = extract_result(r, headers, request_timeout_s)
            b64_video = result.get("b64_video") or result.get("video") or result.get("output")
            if not b64_video:
                raise RuntimeError("No b64_video in response: " + json.dumps(result)[:1500])
            if b64_video.startswith("data:"):
                b64_video = b64_video.split(",", 1)[-1]
            raw_path.write_bytes(base64.b64decode(b64_video))

            if raw_path.stat().st_size < 100_000:
                raise RuntimeError(f"Raw video too small: {raw_path.stat().st_size} bytes")

            subprocess.check_call([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(raw_path),
                "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24",
                "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(final_path),
            ])
            d = probe_duration(final_path)
            codec, w, h = probe_video(final_path)
            size = final_path.stat().st_size
            if not (7.0 <= d <= 8.5):
                raise RuntimeError(f"Unexpected duration {d:.3f}s")
            if codec != "h264" or w != 1280 or h != 720:
                raise RuntimeError(f"Unexpected normalized video: {codec} {w}x{h}")
            if size < 300_000:
                raise RuntimeError(f"Normalized video too small: {size} bytes")
            raw_path.unlink(missing_ok=True)
            print(f"DONE {sid}: {d:.3f}s {size} bytes")
            return {"id": sid, "status": "ok", "duration": d, "bytes": size}
        except Exception as e:
            last_error = repr(e)
            print(f"FAILED {sid} attempt {attempt}: {last_error}")
            final_path.unlink(missing_ok=True)
            raw_path.unlink(missing_ok=True)
            if attempt < 5:
                time.sleep(min(120, 20 * attempt))

    return {"id": sid, "status": "failed", "error": last_error}

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", default="ai-video/scenes.json")
    ap.add_argument("--out", default="public/cosmos-generated")
    ap.add_argument("--resolution", default="720_16_9")
    ap.add_argument("--num-frames", type=int, default=189)
    ap.add_argument("--fps", type=int, default=24)
    ap.add_argument("--steps", type=int, default=35)
    ap.add_argument("--request-timeout", type=int, default=900)
    ap.add_argument("--scene-id", action="append", default=[])
    ap.add_argument("--report", default="out/cosmos-generation-report.json")
    args = ap.parse_args()

    api_key = os.environ.get("NVIDIA_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("NVIDIA_API_KEY is missing")

    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    scenes = manifest["scenes"]
    if args.scene_id:
        wanted = set(args.scene_id)
        scenes = [s for s in scenes if s["id"] in wanted]
        missing = wanted - {s["id"] for s in scenes}
        if missing:
            raise SystemExit(f"Unknown scene id(s): {sorted(missing)}")
    if not scenes:
        raise SystemExit("No scenes selected")
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for scene in scenes:
        result = generate_one(
            api_key, scene, out_dir, args.resolution, args.num_frames, args.fps,
            args.steps, args.request_timeout
        )
        results.append(result)

    report = {
        "project": manifest.get("project", "SON YAPRAK"),
        "model": "nvidia/cosmos3-nano",
        "endpoint": ENDPOINT,
        "resolution": args.resolution,
        "num_frames": args.num_frames,
        "fps": args.fps,
        "results": results,
    }
    report_path = Path(args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    failed = [r for r in results if r["status"] == "failed"]
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if failed:
        raise SystemExit(f"{len(failed)} scene(s) failed: {[r['id'] for r in failed]}")

if __name__ == "__main__":
    main()
