"""Replay the existing P1 ingestion with local inputs and measured counts.

No new Core, contracts or business facts. Historical fixture cardinalities are
compared with the actual local inputs, never manufactured to match old reports.
"""
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--local-run', required=True)
a, remaining = p.parse_known_args()
if not re.fullmatch(r'[a-z0-9][a-z0-9_-]{0,63}', a.local_run):
    p.error('Invalid run ID')
source = ROOT / 'scripts/spatial-simulation/perception/ingest-core.py'
code = source.read_text()
replacements = [
    ('simulation/spatial-office/.runtime/p2-09-frames/manifest.json',
     f'simulation/spatial-office/.runtime/local-{a.local_run}-frames/manifest.json'),
    ("initial_revision=world['revision'];existing=world['entities']",
     "initial_revision=world['revision'];initial_people={e['id'] for e in world['entities'].values() if e['kind']=='Person'};existing=world['entities']"),
    ('assert len(people)==14', "assert {e['id'] for e in people}==initial_people"),
    ('assert len(actual)==8', "assert len(actual)==len({t['local_track_id'] for f in tracks['frames'] for t in f['tracks']})"),
    ('89 observed detections,8 local tracks',
     '{sum(len(f["detections"]) for f in det["frames"])} observed detections,{len(actual)} local tracks'),
    ('logical_people_including_two_historical', 'logical_people_preserved'),
]
for before, after in replacements:
    if code.count(before) != 1:
        raise RuntimeError('Historical ingestion changed: review ' + before)
    code = code.replace(before, after)
sys.argv = [str(source), '--run', a.local_run, '--worker-output',
            str(ROOT / f'simulation/spatial-office/.runtime/local-{a.local_run}-output'), *remaining]
exec(compile(code, str(source), 'exec'), {'__file__': str(source), '__name__': '__main__'})
