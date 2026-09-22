#!/usr/bin/env python3
import argparse, json, os, sys, time, urllib.request
from pathlib import Path

FORBIDDEN={"pexels","stock","slideshow"}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--plan",required=True)
    ap.add_argument("--sources",required=True)
    ap.add_argument("--out",required=True)
    args=ap.parse_args()

    plan=json.load(open(args.plan,encoding="utf-8"))
    srcs=json.load(open(args.sources,encoding="utf-8"))
    out=Path(args.out)
    out.mkdir(parents=True,exist_ok=True)

    scene_by_id={s["id"]:s for s in plan["scenes"]}
    allowed=set(plan["providerPolicy"]["allowed"])

    failures=[]
    for item in srcs["scenes"]:
        sid=item["id"]
        provider=item.get("provider","").strip().lower()
        url=item.get("sourceUrl","").strip()
        if sid not in scene_by_id:
            failures.append(f"unknown scene id {sid}")
            continue
        if provider in FORBIDDEN or provider not in allowed:
            failures.append(f"{sid}: provider {provider!r} not allowed")
            continue
        if not url.startswith("https://"):
            failures.append(f"{sid}: missing/invalid HTTPS sourceUrl")
            continue

        target=out/scene_by_id[sid]["file"]
        req=urllib.request.Request(url,headers={"User-Agent":"MMG-AI-Video-Pipeline/1.0"})
        last=None
        for attempt in range(1,4):
            try:
                with urllib.request.urlopen(req,timeout=180) as r, open(target,"wb") as f:
                    while True:
                        chunk=r.read(1024*1024)
                        if not chunk: break
                        f.write(chunk)
                if target.stat().st_size < 100_000:
                    raise RuntimeError(f"downloaded file too small: {target.stat().st_size}")
                print(f"{sid}: downloaded {target.name} ({target.stat().st_size} bytes) from {provider}")
                last=None
                break
            except Exception as e:
                last=e
                time.sleep(4*attempt)
        if last is not None:
            failures.append(f"{sid}: download failed: {last!r}")

    expected={s["id"] for s in plan["scenes"]}
    provided={s["id"] for s in srcs["scenes"]}
    missing=sorted(expected-provided)
    if missing:
        failures.append("source manifest missing scene ids: "+", ".join(missing))

    if failures:
        for f in failures:
            print("ERROR:",f,file=sys.stderr)
        return 1
    return 0

if __name__=="__main__":
    raise SystemExit(main())
