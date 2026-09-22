#!/usr/bin/env python3
import argparse, hashlib, json, math, os, subprocess, sys
from pathlib import Path

def sh(cmd):
    return subprocess.check_output(cmd, text=True).strip()

def ffprobe(path):
    raw = sh([
        "ffprobe","-v","error","-print_format","json",
        "-show_format","-show_streams",str(path)
    ])
    return json.loads(raw)

def parse_fps(value):
    if not value:
        return 0.0
    if "/" in value:
        a,b=value.split("/",1)
        try:
            return float(a)/float(b)
        except Exception:
            return 0.0
    try:
        return float(value)
    except Exception:
        return 0.0

def gray_frame(path, t, w=64, h=36):
    p = subprocess.run([
        "ffmpeg","-hide_banner","-loglevel","error","-ss",f"{t:.3f}",
        "-i",str(path),"-frames:v","1","-vf",f"scale={w}:{h},format=gray",
        "-f","rawvideo","pipe:1"
    ], capture_output=True, check=True)
    expected=w*h
    if len(p.stdout) < expected:
        raise RuntimeError(f"short frame read {len(p.stdout)} < {expected}")
    return p.stdout[:expected]

def motion_score(path, duration):
    times=[duration*x for x in (0.12,0.32,0.52,0.72,0.90)]
    frames=[gray_frame(path,t) for t in times]
    diffs=[]
    for a,b in zip(frames,frames[1:]):
        diffs.append(sum(abs(x-y) for x,y in zip(a,b))/len(a))
    return sum(diffs)/len(diffs)

def dhash(path, duration):
    frame=gray_frame(path,duration*0.5,9,8)
    bits=[]
    for y in range(8):
        row=frame[y*9:(y+1)*9]
        for x in range(8):
            bits.append(1 if row[x] > row[x+1] else 0)
    value=0
    for bit in bits:
        value=(value<<1)|bit
    return value

def hamming(a,b):
    return (a^b).bit_count()

def sha256(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--dir",required=True)
    ap.add_argument("--plan",required=True)
    ap.add_argument("--report",required=True)
    args=ap.parse_args()

    root=Path(args.dir)
    plan=json.load(open(args.plan,encoding="utf-8"))
    scenes=plan["scenes"]
    report={"project":plan.get("project"),"scenes":[],"warnings":[],"failures":[]}
    seen_sha={}
    hashes=[]

    for scene in scenes:
        path=root/scene["file"]
        item={"id":scene["id"],"file":scene["file"],"path":str(path)}
        if not path.exists() or path.stat().st_size < 100_000:
            report["failures"].append(f"{scene['id']}: missing or tiny file {path}")
            report["scenes"].append(item)
            continue
        try:
            meta=ffprobe(path)
            v=next(s for s in meta["streams"] if s.get("codec_type")=="video")
            duration=float(meta["format"]["duration"])
            width=int(v.get("width",0)); height=int(v.get("height",0))
            fps=parse_fps(v.get("avg_frame_rate") or v.get("r_frame_rate"))
            codec=v.get("codec_name","")
            digest=sha256(path)
            motion=motion_score(path,duration)
            ph=dhash(path,duration)
            item.update({
                "duration":duration,"width":width,"height":height,"fps":fps,
                "codec":codec,"sha256":digest,"motionScore":round(motion,3),
                "dhash":f"{ph:016x}"
            })

            if duration < 7.0:
                report["failures"].append(f"{scene['id']}: duration {duration:.2f}s < 7.0s")
            if width < 1280 or height < 720:
                report["failures"].append(f"{scene['id']}: resolution {width}x{height} below 1280x720")
            if fps < 23:
                report["failures"].append(f"{scene['id']}: fps {fps:.2f} < 23")
            if motion < 0.75:
                report["failures"].append(f"{scene['id']}: motion score {motion:.3f} too low; looks static")
            if digest in seen_sha:
                report["failures"].append(f"{scene['id']}: exact duplicate of scene {seen_sha[digest]}")
            else:
                seen_sha[digest]=scene["id"]

            for other_id,other_ph in hashes:
                dist=hamming(ph,other_ph)
                if dist <= 2:
                    report["failures"].append(f"{scene['id']}: visual duplicate/near-duplicate of scene {other_id} (dHash {dist})")
                elif dist <= 6:
                    report["warnings"].append(f"{scene['id']}: visually similar to scene {other_id} (dHash {dist})")
            hashes.append((scene["id"],ph))
        except Exception as e:
            report["failures"].append(f"{scene['id']}: probe/quality error: {e!r}")
        report["scenes"].append(item)

    expected={s["file"] for s in scenes}
    actual={p.name for p in root.glob("*.mp4")}
    extras=sorted(actual-expected)
    missing=sorted(expected-actual)
    if extras:
        report["warnings"].append("extra clips: "+", ".join(extras))
    if missing:
        report["failures"].append("missing clips: "+", ".join(missing))

    Path(args.report).parent.mkdir(parents=True,exist_ok=True)
    json.dump(report,open(args.report,"w",encoding="utf-8"),ensure_ascii=False,indent=2)
    print(json.dumps(report,ensure_ascii=False,indent=2))
    if report["failures"]:
        print(f"QUALITY GATE FAILED: {len(report['failures'])} failure(s)",file=sys.stderr)
        return 1
    print("QUALITY GATE PASSED")
    return 0

if __name__=="__main__":
    raise SystemExit(main())
