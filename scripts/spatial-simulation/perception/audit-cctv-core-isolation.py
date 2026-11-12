"""Post-inference audit: Core replay invariant with evaluator disconnected/ID changed.

Only this privileged auditor accesses the evaluator; ingress has no such input.
"""
import hashlib
import importlib.util
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
spec=importlib.util.spec_from_file_location('core_validation',ROOT/'scripts/spatial-simulation/perception/validate-cctv-core.py')
core=importlib.util.module_from_spec(spec);spec.loader.exec_module(core)
private=core.PRIVATE;folder=core.OUT
stage=json.loads((folder/'gate.json').read_text())
assert stage.get('core_stage_checks_passed',stage['technical_gate_passed'])
baseline=json.loads((folder/'ingestion.json').read_text())
core.RUN=baseline['run']
trial=private/'cctv-trial-trial-a';truth=trial/'evaluator';backup=trial/'evaluator.audit17-backup'
assert truth.resolve().is_relative_to(ROOT.resolve()) and backup.resolve().is_relative_to(ROOT.resolve())
assert truth.parent==backup.parent and truth.name=='evaluator' and not backup.exists()
original=(truth/'truth.json').read_bytes();original_sha=hashlib.sha256(original).hexdigest()
process=None
with (private/'audit-core17-http.log').open('w') as log:
    try:
        process=core.server(log)
        truth.rename(backup)
        try:
            disconnected=core.ingest.execute(core.API,core.RUN,private/'core17-gt-disconnected.json',replay=True)
            truth.mkdir();changed=json.loads(original);changed['internal_actor_id']='private-id-audit17-variation'
            (truth/'truth.json').write_text(json.dumps(changed))
            changed_id=core.ingest.execute(core.API,core.RUN,private/'core17-gt-changed-id.json',replay=True)
        finally:
            if truth.exists():
                assert {p.name for p in truth.iterdir()}=={'truth.json'},'Original retained in backup; unexpected audit content'
                (truth/'truth.json').unlink();truth.rmdir()
            backup.rename(truth)
        assert hashlib.sha256((truth/'truth.json').read_bytes()).hexdigest()==original_sha
        for report in [disconnected,changed_id]:
            assert report['world_sha256']==baseline['world_sha256'] and report['memory_sha256']==baseline['memory_sha256']
            assert report['world_unchanged'] and report['duplicate_observations']==2009
        report={'phase':'P2-09.17','passed':True,'actual_http_replay':True,
                'states':['original evaluator outside pipeline','actual evaluator directory disconnected','private actor ID changed'],
                'all_2009_messages_exact_duplicates_in_each_replay':True,'world_relations_memory_invariant':True,
                'original_evaluator_restored_exact_hash':True,'ingress_uses_no_evaluator_paths':True}
        (folder/'isolation.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
    finally:
        if process is not None and process.poll() is None:process.terminate();process.wait(timeout=15)
