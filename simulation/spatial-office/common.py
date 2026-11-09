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
    supplement = HANDOFF / 'evidence/upstream-revisions.json'
    if supplement.exists():
        import subprocess
        for path, revision in read(supplement).items():
            assert path in {'docs/spatial-simulation/IMPLEMENTATION-PLAN.md', 'AGENTS.md', 'docs/ENTITY-MASTER-SPEC.md', 'docs/DECISION-LOG.md', 'docs/PROJECT-STATUS.md', 'docs/AGENT-WORKLOG.md', '.github/workflows/pages.yml', 'apps/web/index.html', 'services/entity-api/app/office/api.py', 'services/entity-api/app/office/observations.py', 'services/entity-api/app/edge_projection.py', 'services/entity-edge/entity_edge/pipeline.py', 'services/entity-edge/README.md', 'services/entity-api/app/office/catalog.py', 'services/entity-api/app/office/inputs.py', 'services/entity-api/app/office/queries.py', 'services/entity-api/app/office/service.py', 'services/entity-api/app/office/storage.py', 'services/entity-api/app/office/graph.py', 'scripts/provision-office-site.py'}
            assert snapshot['sha256'][path] == revision['base_sha256']
            data = subprocess.check_output(['git', 'show', revision['commit'] + ':' + path], cwd=ROOT)
            assert hashlib.sha256(data).hexdigest() == revision['sha256']
            snapshot['sha256'][path] = revision['sha256']
    return [p for p, digest in snapshot['sha256'].items()
            if not (ROOT / p).is_file() or sha256(ROOT / p) != digest]
