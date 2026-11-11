"""P2-09.10 read-only transfer inventory. Never captures or replaces baseline inputs.

This is preparation evidence, not an inference, isolation, GPU or acceptance gate.
Ground truth is deliberately neither opened nor required by this inventory.
"""
import argparse
import hashlib
import importlib.metadata
import json
import platform
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]


def sha256(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(block)
    return digest.hexdigest()


def inspect_file(folder, name, expected):
    # Check containment before opening: an imported corpus must not redirect reads.
    if not re.fullmatch(r'[A-Za-z0-9_.-]+', name) or name in ('.', '..'):
        return {'file': name, 'status': 'unsafe_path'}
    path = folder / name
    if path.resolve().parent != folder.resolve():
        return {'file': name, 'status': 'unsafe_path'}
    if not path.is_file():
        return {'file': name, 'status': 'missing', 'expected_sha256': expected}
    actual = sha256(path)
    return {'file': name, 'status': 'verified' if actual == expected else 'hash_mismatch',
            'expected_sha256': expected, 'actual_sha256': actual, 'bytes': path.stat().st_size}


def inventory(frames, models, verify_original_corpus=False):
    evidence = ROOT / 'docs/spatial-simulation/evidence/p2-09'
    reference = evidence / '09.4/manifest.json'
    manifest = json.loads(reference.read_text(encoding='utf-8'))
    rows = manifest['frames']
    expected_cameras = {f'CAMERA-PLANNED-{i:02d}' for i in range(1, 7)}
    counts = Counter(row['camera_id'] for row in rows)
    assert len(rows) == 246 and set(counts) == expected_cameras
    assert all(count == 41 for count in counts.values())
    assert len({row['file'] for row in rows}) == 246
    frame_results = [inspect_file(frames, row['file'], row['sha256']) for row in rows]
    manifest_status = inspect_file(frames, 'manifest.json', sha256(reference))
    # Git on Windows may convert line endings; require identical metadata and exact PNG hashes.
    if manifest_status['status'] == 'hash_mismatch':
        try:
            if json.loads((frames / 'manifest.json').read_text(encoding='utf-8')) == manifest:
                manifest_status['status'] = 'verified'
                manifest_status['comparison'] = 'identical JSON metadata; serialization differs'
        except (ValueError, OSError):
            pass
    # Only named legitimate inputs are read; this does not certify filesystem isolation.
    forbidden_names = []
    if frames.is_dir():
        allowed = {row['file'] for row in rows} | {'manifest.json'}
        allowed |= {prefix + cam + '.png' for cam in expected_cameras
                    for prefix in ('background-', 'empty-check-')}
        forbidden_names = sorted(path.name for path in frames.iterdir() if path.name not in allowed)
    model_hashes = {}
    for line in (evidence / '09.9/model-checksums.txt').read_text(encoding='utf-8').splitlines():
        if line.strip():
            name, digest = line.split()
            model_hashes[name] = digest
    reid = json.loads((evidence / '09.7/reid-model.json').read_text(encoding='utf-8'))
    model_hashes['osnet_ain.onnx'] = reid['onnx_sha256']
    model_results = [inspect_file(models, name, digest) for name, digest in model_hashes.items()]
    versions = {}
    for package in ('onnxruntime', 'onnxruntime-gpu', 'opencv-python-headless', 'norfair', 'numpy', 'jsonschema'):
        try:
            versions[package] = importlib.metadata.version(package)
        except importlib.metadata.PackageNotFoundError:
            versions[package] = None
    inputs_verified = (all(row['status'] == 'verified' for row in frame_results + model_results)
                       and manifest_status['status'] == 'verified' and not forbidden_names)
    models_verified = all(row['status'] == 'verified' for row in model_results)
    return {
        'phase': 'P2-09.10', 'generated_at_utc': datetime.now(timezone.utc).isoformat(),
        'inventory_only': True, 'phase_gate_passed': False,
        'gate_note': 'Asset integrity alone cannot certify WSL/GPU/dependencies or 09.11 reproduction.',
        'python': {'version': platform.python_version(), 'platform': sys.platform, 'packages': versions},
        'reference_manifest_sha256': sha256(reference), 'expected_frames': len(rows),
        'execution_mode': 'verify_original_corpus' if verify_original_corpus else 'local_recapture',
        'original_pngs_required': verify_original_corpus,
        'original_pngs_absence_blocks_local_recapture': False,
        'expected_frames_per_camera': dict(sorted(counts.items())),
        'frames_directory_exists': frames.is_dir(), 'models_directory_exists': models.is_dir(),
        'input_manifest': manifest_status, 'unexpected_input_entries': forbidden_names,
        'frame_status_counts': dict(Counter(row['status'] for row in frame_results)),
        'frames': frame_results, 'models': model_results, 'transfer_inputs_verified': inputs_verified,
        'audit_inputs_ready': inputs_verified if verify_original_corpus else models_verified,
        'ground_truth_opened': False, 'baseline_modified': False,
        'licenses_recorded_in': ['simulation/spatial-office/perception/README.md',
                                 'docs/spatial-simulation/evidence/p2-09/09.7/reid-model.json'],
        'limitations': ['Operator authorized repeating capture locally; original PNGs are historical results, not a prerequisite.',
                        'Local captures must have their own manifest/evidence and be compared to the preserved baseline.',
                        'MP4 derivatives are not an equivalent pixel corpus.',
                        'OSNet export must match the recorded hash; export parity alone is insufficient.',
                        'No detector, tracker, Core or GPU benchmark is run by this command.'],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    runtime = ROOT / 'simulation/spatial-office/.runtime'
    parser.add_argument('--frames', type=Path, default=runtime / 'p2-09-frames')
    parser.add_argument('--models', type=Path, default=runtime / 'p2-vision-models')
    parser.add_argument('--verify-original-corpus', action='store_true',
                        help='Optional archival hash comparison; not required for local recapture')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    report = inventory(args.frames, args.models, args.verify_original_corpus)
    # Keep evidence away from mounted inference inputs and frozen historical evidence.
    output = args.output.resolve()
    frozen = (ROOT / 'docs/spatial-simulation/evidence/p2-09').resolve()
    if any(output.is_relative_to(folder.resolve()) for folder in (args.frames, args.models)):
        parser.error('Output must be outside inference input directories')
    if any(output.is_relative_to(frozen / f'09.{i}') for i in range(1, 10)):
        parser.error('Historical baseline evidence is frozen')
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({key: report[key] for key in ('expected_frames', 'frame_status_counts',
                                                'transfer_inputs_verified', 'phase_gate_passed')}))
    return 0 if report['audit_inputs_ready'] else 2


if __name__ == '__main__':
    raise SystemExit(main())
