"""Compare repeat inference to09.15/16 without importing evaluator labels."""
import json
from pathlib import Path
import numpy as np

ROOT=Path(__file__).resolve().parents[3]
base=ROOT/'simulation/spatial-office/.runtime/cctv-trial-trial-a/output'
old=json.loads((base/'tiles025/tracks-tuned.json').read_text())
new=json.loads((base/'core17/tracks-tuned.json').read_text())
assert len(old['frames'])==len(new['frames'])==2008
maximum_box_difference=maximum_confidence_difference=0.
observations=0
for a,b in zip(old['frames'],new['frames']):
    for key in ['camera_id','frame_index','observed_at','media_time_seconds','frame_sha256','image_size']:assert a[key]==b[key]
    assert len(a['tracks'])==len(b['tracks'])
    for x,y in zip(a['tracks'],b['tracks']):
        for key in ['local_track_id','position_anchor','confirmed_at_frame_index','association_confirmation_evidence_at',
                    'association_confirmation_media_seconds','associated_after_confirmation']:assert x[key]==y[key]
        maximum_box_difference=max(maximum_box_difference,float(np.max(np.abs(np.asarray(x['bbox'])-y['bbox']))))
        maximum_confidence_difference=max(maximum_confidence_difference,abs(x['confidence']-y['confidence']))
        assert np.allclose(x['bbox'],y['bbox'],atol=.001,rtol=0)
        assert np.allclose(x['position'],y['position'],atol=1e-5,rtol=0)
        assert abs(x['confidence']-y['confidence'])<=1e-5
        observations+=1
report={'phase':'P2-09.17','passed':True,'frames':2008,'observations':observations,
        'sources_timestamps_frame_hashes_and_local_ids_invariant':True,
        'confirmation_timestamps_invariant':True,'bbox_tolerance_pixels':.001,
        'maximum_bbox_difference_pixels':maximum_box_difference,'maximum_confidence_difference':maximum_confidence_difference,
        'evaluator_or_actor_truth_read':False}
folder=ROOT/'docs/spatial-simulation/evidence/p2-09/09.17/trial-a'
folder.mkdir(parents=True,exist_ok=True);(folder/'repeat-inference.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report))
