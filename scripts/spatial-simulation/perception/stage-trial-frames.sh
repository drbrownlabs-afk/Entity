#!/usr/bin/env bash
set -euo pipefail
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
: "${P2_TRIAL_RUN:?Set trial run}"
[[ "$P2_TRIAL_RUN" =~ ^[a-z0-9_-]+$ ]] || exit 2
source_frames="$repo_root/simulation/spatial-office/.runtime/cctv-trial-$P2_TRIAL_RUN/frames"
cache_frames="/opt/entity-p2/corpora/$P2_TRIAL_RUN/frames"
test -f "$source_frames/manifest.json"
mkdir -p "$cache_frames"
if test -f "$cache_frames/manifest.json";then cmp "$source_frames/manifest.json" "$cache_frames/manifest.json";fi
cp -a "$source_frames/." "$cache_frames/"
/opt/entity-p2/cpu-venv/bin/python - "$cache_frames" "$repo_root/packages/contracts/perception/v1/FrameManifest.json" <<'PY'
import hashlib,json,sys
from pathlib import Path
import jsonschema
frames=Path(sys.argv[1]);manifest=json.loads((frames/'manifest.json').read_text());jsonschema.validate(manifest,json.loads(Path(sys.argv[2]).read_text()))
for row in manifest['frames']:
 path=frames/row['file'];assert path.parent==frames and not path.is_symlink();assert hashlib.sha256(path.read_bytes()).hexdigest()==row['sha256']
assert not (frames/'truth.json').exists() and not (frames/'plan.json').exists()
print(json.dumps({'cache':'WSL ext4 camera frames only','images':len(manifest['frames']),'all_hashes_verified':True,'manifest_sha256':hashlib.sha256((frames/'manifest.json').read_bytes()).hexdigest()}))
PY
