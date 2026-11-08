"""Pure coordinate and provenance helpers; no Blender or service dependency."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
HANDOFF = ROOT / 'docs/spatial-simulation'
EVIDENCE = HANDOFF / 'evidence/phase01'
OUTPUT = HERE / 'output'


def read(path):
    return json.loads(Path(path).read_text())


def write(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def to_blender(point):
    x, y, z = point
    return (x, -z, y)


def to_source(point):
    x, y, z = point
    return (x, z, -y)


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def protected_changes():
    snapshot = read(EVIDENCE / 'protected-files.json')
    return [p for p, digest in snapshot['sha256'].items()
            if not (ROOT / p).is_file() or sha256(ROOT / p) != digest]
