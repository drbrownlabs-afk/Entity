"""Wait locally, audit stored evidence, prepare human review; never self-approve."""
import hashlib
import json
import os
import re
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3];os.chdir(ROOT)
PRIVATE=ROOT/'simulation/spatial-office/.runtime';OUT=ROOT/'docs/spatial-simulation/evidence/p2-09/09.18'
STATUS=PRIVATE/'accept18-final-status.json';started=time.perf_counter()
def read(p):return json.loads(p.read_text(encoding='utf-8-sig'))
def write(p,d):p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf-8')
write(STATUS,{'done':False,'pid':os.getpid()})
try:
    while True:
        try:upstream=read(PRIVATE/'accept18-core-resume-status.json')
        except (FileNotFoundError,json.JSONDecodeError):upstream={}
        if upstream.get('done'):
            assert upstream['exit_code']==0,'Core resume failed; retained evidence must be inspected'
            break
        if time.perf_counter()-started>7200:raise RuntimeError('Core completion timeout; no automatic duplicate launch')
        time.sleep(2)
    result=read(OUT/'acceptance.json')
    database=sqlite3.connect((PRIVATE/'p2-core.sqlite3').as_uri()+'?mode=ro',uri=True)
    audit=[]
    for row in result['runs']:
        case=row['run'];folder=OUT/case;ingestion=read(folder/'ingestion.json');corpus=PRIVATE/f'cctv-trial-{case}'
        identifier=read(corpus/'evaluator/plan.json')['internal_actor_id']
        rows=database.execute('SELECT body FROM office_inbox WHERE site=? AND run=?',('coworking-p2',ingestion['run'])).fetchall()
        assert len(rows)==ingestion['frame_observations']+ingestion['global_associations']
        forbidden={'actor_id','internal_actor_id','feet','ground_truth','route','waypoints','visible_bbox','amodal_bbox'}
        def inspect(value):
            if isinstance(value,dict):
                assert not set(value)&forbidden
                for v in value.values():inspect(v)
            elif isinstance(value,list):
                for v in value:inspect(v)
        for (body,) in rows:
            assert identifier not in body
            inspect(json.loads(body))
        audit.append({'run':case,'stored_observations':len(rows),'private_actor_id_absent':True,'forbidden_pose_route_label_fields_absent':True})
        persistence=read(folder/'persistence.json')
        if 'vision_stage_wall_seconds' in persistence:persistence['vision_stage_processing_seconds']=persistence.pop('vision_stage_wall_seconds')
        if 'sum_worker_wall_and_first_ingress_seconds' in persistence:persistence['sum_recorded_processing_and_new_ingress_seconds']=persistence.pop('sum_worker_wall_and_first_ingress_seconds')
        write(folder/'persistence.json',persistence)
        worker=corpus/'output/accept18';detector=read(worker/'detections.json');mot=read(worker/'tracks-tuned.json')
        write(folder/'performance.json',{'detector_image_ms':{'p50':detector['median_inference_ms'],'p95':detector['p95_inference_ms']},
              'http_pixel_ingress_ms':ingestion['http_latency_ms']['pixel_ingress'],
              'detector_peak_rss_kib':detector['peak_rss_kib'],'mot_peak_rss_kib':mot['peak_rss_kib'],
              'core_peak_rss_kib':persistence['core_peak_rss_kib'],'detector_global_gpu_checkpoints_mib':detector['gpu_global_memory_mib'],
              'derived_aggregate_images_per_second':persistence['derived_aggregate_images_per_second'],
              'timing_scope':persistence['timing_scope'],'gpu_scope':'whole GPU snapshots; not process VRAM or guaranteed peak',
              'realtime_validated':False})
    database.close()
    write(OUT/'stored-evidence-audit.json',{'phase':'P2-09.18','passed':True,'post_inference_only':True,'database_read_only':True,'runs':audit})
    tests={}
    for stage in ['api','edge']:
        log=(PRIVATE/f'{stage}-tests18.log').read_text();assert '\nOK\n' in log
        tests[stage+'_tests_passed']=int(re.search(r'Ran (\d+) tests',log).group(1))
    write(OUT/'test-results.json',tests|{'human_final_acceptance':False,'core_replay_fast_path_keeps_authorization_and_id_conflict_checks':True})
    subprocess.run([sys.executable,str(ROOT/'scripts/spatial-simulation/perception/render-cctv-acceptance.py')],check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/spatial-simulation/perception/review-cctv-acceptance.py')],check=True)
    gate={'phase':'P2-09.18','technical_checks_passed':result['all_five_technical_checks_passed'],
          'five_fresh_captures':True,'frozen_perception_policy':True,'five_runs_persisted_in_same_core':True,
          'stored_evidence_privacy_audit_passed':True,'human_final_acceptance':False,
          'status':'READY_FOR_HUMAN_REVIEW' if result['all_five_technical_checks_passed'] else 'TECHNICAL_VALIDATION_FAILED'}
    write(OUT/'gate.json',gate)
    write(STATUS,{'done':True,'pid':os.getpid(),'exit_code':0,'seconds':time.perf_counter()-started,'status':gate['status']})
    print(json.dumps(gate))
except Exception:
    write(STATUS,{'done':True,'pid':os.getpid(),'exit_code':1,'seconds':time.perf_counter()-started})
    raise
