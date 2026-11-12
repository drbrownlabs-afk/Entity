"""Publish bounded development measurements; never approve a perception gate."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/spatial-simulation/evidence/p2-09/09.19'
PRIVATE=ROOT/'simulation/spatial-office/.runtime'
cases=[]
for short in ['smoke2','smoke3','smoke4','smoke5','reg-v0a','reg-v0b']:
    run='p2-09-causal19-'+short;folder=PRIVATE/('causal19-'+run)
    if not (folder/'report.json').exists():continue
    report=json.loads((folder/'report.json').read_text())
    ready=json.loads((folder/'ready.json').read_text());evaluation=folder/'evaluation.json'
    cases.append({'run':run,'report':report,'worker_ready':ready,
        'effective_detector_threshold':.25 if short=='reg-v0b' else .10,
        'comparable_to_frozen_detector_policy':short=='reg-v0b',
        'evaluation':json.loads(evaluation.read_text()) if evaluation.exists() else None})
result={'phase':'P2-09.19','scope':'Intermediate development attempts, not sustained acceptance',
    'implementation_approved_by_operator':True,'cases':cases,'phase_gate_passed':False,
    'limitations':['Incorrect threshold .10 in early attempts, fixed to frozen .25 for reg-v0b',
        'Host concurrent work/cold-start differs across attempts; not a controlled optimization comparison',
        'Lossless backpressure admits late source release; zero drops does not establish real-time capacity',
        'Five corrected corpora, ten-minute paced/live gates and Edge failure recovery remain pending']}
(OUT/'causal-development.json').write_text(json.dumps(result,indent=2)+'\n')
gate=json.loads((OUT/'gate.json').read_text())
gate.update(status='APPROVED_IMPLEMENTATION_IN_VALIDATION',implementation_approval_received=True,
    substantial_refactor_implemented=True,causal_incremental_paced_replay_executed=True,
    live_causal_perception_demonstrated=False,sixteen_images_per_second_continuous_demonstrated=False,
    production_perception_policy_changed=False,historical_baseline_unchanged=True,
    new_causal_policy_under_validation=True,human_final_acceptance=False,
    location_query_semantics_issue_observed=True,location_query_semantics_fixed_in_code=True,
    outstanding=['Five corrected quality regressions','Sustained 10-minute throughput/latency',
        'Integrated virtual live source','Edge/Core interruption and recovery proof'])
(OUT/'gate.json').write_text(json.dumps(gate,indent=2)+'\n')
print(json.dumps({'published_development_cases':len(cases),'phase_gate_passed':False}))
