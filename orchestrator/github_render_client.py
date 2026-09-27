#!/usr/bin/env python3
import argparse, json, os, pathlib, shutil, subprocess, sys, time, urllib.error, urllib.request, uuid, zipfile, io

API_VERSION = "2026-03-10"

def get_token():
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if token:
        return token.strip()
    gh = shutil.which("gh")
    if gh:
        p = subprocess.run([gh, "auth", "token"], capture_output=True, text=True)
        if p.returncode == 0 and p.stdout.strip():
            return p.stdout.strip()
    raise RuntimeError("GITHUB_AUTH_REQUIRED: set GH_TOKEN/GITHUB_TOKEN or login with gh")

def api(token, method, url, payload=None, raw=False):
    data = None
    headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "X-GitHub-Api-Version": API_VERSION,
        "User-Agent": "MMG-YORE-Orchestrator/1.0",
    }
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            body = r.read()
            if raw:
                return body
            if not body:
                return None
            return json.loads(body.decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GITHUB_API_{e.code}: {method} {url} :: {body[:1200]}") from e

def classify_failure(token, repo, run_id, out_dir):
    jobs = api(token, "GET", f"https://api.github.com/repos/{repo}/actions/runs/{run_id}/jobs?per_page=100")
    failed_steps = []
    for job in (jobs or {}).get("jobs", []):
        for step in job.get("steps", []):
            if step.get("conclusion") == "failure":
                failed_steps.append(step.get("name", "unknown"))
    text = " ".join(failed_steps).lower()
    category = "UNKNOWN"
    if any(x in text for x in ("asset", "prepare deterministic smoke assets")):
        category = "ASSET_MISSING"
    elif "typescript" in text or "dependency" in text or "install dependencies" in text:
        category = "DEPENDENCY"
    elif "render" in text:
        category = "RENDER"
    elif "audio" in text:
        category = "AUDIO_PATH"

    try:
        log_bytes = api(token, "GET", f"https://api.github.com/repos/{repo}/actions/runs/{run_id}/logs", raw=True)
        log_path = out_dir / f"run-{run_id}-logs.zip"
        log_path.write_bytes(log_bytes)
        if zipfile.is_zipfile(io.BytesIO(log_bytes)):
            with zipfile.ZipFile(io.BytesIO(log_bytes)) as z:
                joined = "\n".join(
                    z.read(n).decode("utf-8", errors="replace")
                    for n in z.namelist() if not n.endswith("/")
                ).lower()
            if "composition" in joined and ("not found" in joined or "could not" in joined):
                category = "COMPOSITION_NOT_FOUND"
            elif ("no such file" in joined or "enoent" in joined) and "audio" in joined:
                category = "AUDIO_PATH"
            elif "no such file" in joined or "enoent" in joined:
                category = "ASSET_MISSING"
            elif "cannot find module" in joined or "npm err" in joined:
                category = "DEPENDENCY"
    except Exception as exc:
        print(f"[WARN] FAILURE_LOG_DOWNLOAD={type(exc).__name__}")
    return category, failed_steps

def ffprobe_qc(mp4):
    ffprobe = shutil.which("ffprobe")
    if not ffprobe:
        raise RuntimeError("FFPROBE_NOT_FOUND")
    p = subprocess.run([
        ffprobe, "-v", "error",
        "-show_entries", "stream=codec_type,codec_name,width,height",
        "-show_entries", "format=duration",
        "-of", "json", str(mp4)
    ], capture_output=True, text=True)
    if p.returncode != 0:
        raise RuntimeError(f"FFPROBE_FAILED: {p.stderr[-800:]}")
    meta = json.loads(p.stdout)
    streams = meta.get("streams", [])
    video = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio = next((s for s in streams if s.get("codec_type") == "audio"), None)
    duration = float(meta.get("format", {}).get("duration", 0))
    if not video or video.get("codec_name") != "h264":
        raise RuntimeError(f"QC_VIDEO_CODEC_FAIL: {video}")
    if int(video.get("width", 0)) != 1080 or int(video.get("height", 0)) != 1920:
        raise RuntimeError(f"QC_RESOLUTION_FAIL: {video}")
    if not audio or audio.get("codec_name") != "aac":
        raise RuntimeError(f"QC_AUDIO_CODEC_FAIL: {audio}")
    if duration < 0.5:
        raise RuntimeError(f"QC_DURATION_FAIL: {duration}")
    return {"video":"h264","audio":"aac","width":1080,"height":1920,"duration":duration}

def telegram_send(mp4, caption):
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
    if not token or not chat_id:
        raise RuntimeError("TELEGRAM_CREDENTIAL_REQUIRED")
    boundary = "----MMGYORE" + uuid.uuid4().hex
    crlf = b"\r\n"
    parts = []
    def field(name, value):
        parts.extend([
            f"--{boundary}".encode(), crlf,
            f'Content-Disposition: form-data; name="{name}"'.encode(), crlf, crlf,
            str(value).encode("utf-8"), crlf
        ])
    field("chat_id", chat_id)
    field("caption", caption[:1000])
    parts.extend([
        f"--{boundary}".encode(), crlf,
        f'Content-Disposition: form-data; name="video"; filename="{mp4.name}"'.encode(), crlf,
        b"Content-Type: video/mp4", crlf, crlf,
        mp4.read_bytes(), crlf,
        f"--{boundary}--".encode(), crlf
    ])
    body = b"".join(parts)
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{token}/sendVideo",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        result = json.loads(r.read().decode("utf-8"))
    if not result.get("ok"):
        raise RuntimeError("TELEGRAM_SEND_FAILED")
    return result["result"].get("message_id")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=os.environ.get("GITHUB_REPOSITORY", "MMG-ex/MMG-Remotion-Video"))
    ap.add_argument("--workflow", default="render-orchestrator-final.yml")
    ap.add_argument("--ref", default="main")
    ap.add_argument("--props-json", default="")
    ap.add_argument("--output-name", default="")
    ap.add_argument("--out-dir", default="orchestrator-output")
    ap.add_argument("--timeout", type=int, default=4200)
    ap.add_argument("--poll", type=int, default=5)
    ap.add_argument("--telegram-preview", action="store_true")
    args = ap.parse_args()

    token = get_token()
    out_dir = pathlib.Path(args.out_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)
    output_name = args.output_name or f"MMG-YORE-Orchestrator-{int(time.time())}-{uuid.uuid4().hex[:6]}"
    inputs = {"output_name": output_name}
    if args.props_json:
        parsed = json.loads(args.props_json)
        inputs["props_json"] = json.dumps(parsed, separators=(",", ":"))

    dispatch_url = f"https://api.github.com/repos/{args.repo}/actions/workflows/{args.workflow}/dispatches"
    print(f"[1/6] DISPATCH workflow={args.workflow} ref={args.ref} output={output_name}")
    dispatched = api(token, "POST", dispatch_url, {"ref": args.ref, "inputs": inputs})
    if not isinstance(dispatched, dict) or not dispatched.get("workflow_run_id"):
        raise RuntimeError("DISPATCH_RUN_ID_UNAVAILABLE")
    run_id = int(dispatched["workflow_run_id"])
    print(f"[PASS] DISPATCH=PASS run_id={run_id}")

    print("[2/6] STATUS POLLING")
    deadline = time.time() + args.timeout
    last = None
    run = None
    while time.time() < deadline:
        run = api(token, "GET", f"https://api.github.com/repos/{args.repo}/actions/runs/{run_id}")
        state = (run.get("status"), run.get("conclusion"))
        if state != last:
            print(f"[STATUS] run_id={run_id} status={state[0]} conclusion={state[1]}")
            last = state
        if run.get("status") == "completed":
            break
        time.sleep(max(1, args.poll))
    else:
        raise RuntimeError(f"WORKFLOW_TIMEOUT run_id={run_id}")

    if run.get("conclusion") != "success":
        category, steps = classify_failure(token, args.repo, run_id, out_dir)
        raise RuntimeError(f"RENDER_FAILED category={category} failed_steps={steps} run_id={run_id}")
    print("[PASS] WORKFLOW_COMPLETED=SUCCESS")

    print("[3/6] ARTIFACT LOOKUP")
    artifacts = api(token, "GET", f"https://api.github.com/repos/{args.repo}/actions/runs/{run_id}/artifacts?per_page=100")
    matches = [a for a in artifacts.get("artifacts", []) if a.get("name") == output_name and not a.get("expired")]
    if len(matches) != 1:
        raise RuntimeError(f"ARTIFACT_MATCH_FAIL count={len(matches)} name={output_name}")
    artifact = matches[0]
    print(f"[PASS] ARTIFACT_FOUND id={artifact['id']} size={artifact.get('size_in_bytes')}")

    print("[4/6] ARTIFACT DOWNLOAD")
    zip_bytes = api(token, "GET", f"https://api.github.com/repos/{args.repo}/actions/artifacts/{artifact['id']}/zip", raw=True)
    zip_path = out_dir / f"{output_name}.zip"
    zip_path.write_bytes(zip_bytes)
    extract_dir = out_dir / output_name
    extract_dir.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as z:
        for info in z.infolist():
            dest = (extract_dir / info.filename).resolve()
            if extract_dir not in dest.parents and dest != extract_dir:
                raise RuntimeError("UNSAFE_ARTIFACT_PATH")
        z.extractall(extract_dir)
    mp4s = list(extract_dir.rglob("*.mp4"))
    if len(mp4s) != 1 or mp4s[0].stat().st_size == 0:
        raise RuntimeError(f"FINAL_MP4_MATCH_FAIL count={len(mp4s)}")
    mp4 = mp4s[0]
    print(f"[PASS] FINAL_MP4={mp4}")

    print("[5/6] LOCAL FFPROBE QC")
    qc = ffprobe_qc(mp4)
    print("[PASS] LOCAL_QC=" + json.dumps(qc, separators=(",", ":")))

    print("[6/6] TELEGRAM PREVIEW")
    if args.telegram_preview:
        message_id = telegram_send(mp4, f"MMG YO+RE preview | run {run_id} | QC PASS")
        print(f"[PASS] TELEGRAM_PREVIEW=PASS message_id={message_id}")
    else:
        print("[SAFE] TELEGRAM_PREVIEW=SKIPPED_NOT_REQUESTED")

    report = {
        "status": "PASS", "repo": args.repo, "workflow": args.workflow,
        "run_id": run_id, "artifact_id": artifact["id"], "artifact_name": output_name,
        "final_mp4": str(mp4), "qc": qc,
        "telegram_preview": bool(args.telegram_preview), "auto_publish": False,
    }
    report_path = out_dir / f"ORCHESTRATOR_RENDER_{run_id}.json"
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"[PASS] REPORT={report_path}")
    print("MMG_VIDEO_ORCHESTRATOR_GITHUB_FINALIZER=PASS")
    return 0

if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"[FAIL] {type(exc).__name__}: {exc}", file=sys.stderr)
        print("MMG_VIDEO_ORCHESTRATOR_GITHUB_FINALIZER=FAIL", file=sys.stderr)
        raise SystemExit(1)
