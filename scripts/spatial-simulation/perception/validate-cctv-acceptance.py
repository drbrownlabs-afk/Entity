"""Five independently captured repetitions. Frozen perception; post-hoc GT only.

Local queues overlap capture, inference, evaluator and serialized Core imports.
No evaluator output selects/filter detections or controls which runs enter Core.
Human acceptance is never synthesized by this supervisor.
"""
import concurrent.futures
import hashlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3];os.chdir(ROOT)
PRIVATE=ROOT/'simulation/spatial-office/.runtime'
OUT=ROOT/'docs/spatial-simulation/evidence/p2-09/09.18';OUT.mkdir(parents=True,exist_ok=True)
SCRIPTS=ROOT/'scripts/spatial-simulation/perception'
CPU='/opt/entity-p2/cpu-venv/bin/python';API='/opt/entity-p2/api-venv/bin/python'
STATUS=PRIVATE/'accept18-validation-status.json'
CASES=['accept18-v'+str(i) for i in range(5)]
spec=importlib.util.spec_from_file_location('core_helpers',SCRIPTS/'validate-cctv-core.py')
core=importlib.util.module_from_spec(spec);spec.loader.exec_module(core)


def write(path,value):path.write_text(json.dumps(value,indent=2)+'\n',encoding='utf-8')
def read(path):return json.loads(path.read_text(encoding='utf-8-sig'))


def pinned():
    paths=['apps/spatial-simulation/public/perception/profiles/cctv-c.json',
           'simulation/spatial-office/perception/cctv-c-spatial-graph.json',
           'services/entity-edge/entity_edge/cctv_mot.py','services/entity-edge/entity_edge/cctv_reid.py',
           'services/entity-edge/entity_edge/cctv_mtmc.py','scripts/spatial-simulation/perception/detect-cctv.py',
           'services/entity-api/app/office/observations.py','services/entity-api/app/office/global_perception.py',
           'simulation/spatial-office/.runtime/p2-vision-models/yolox_s.onnx',
           'simulation/spatial-office/.runtime/p2-vision-models/osnet_ain.onnx']
    return {p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in paths}


def wait_capture(case):
    before=time.perf_counter();marker=PRIVATE/f'cctv-trial-{case}/capture-complete.json'
    while not marker.exists():
        try:
            status=read(PRIVATE/'accept18-capture-status.json')
            if status.get('done') and status.get('exit_code')!=0:raise RuntimeError('Capture supervisor failed; original corpora retained')
        except (FileNotFoundError,json.JSONDecodeError):pass
        if time.perf_counter()-before>10800:raise RuntimeError('Capture wait timeout; no duplicate automatic capture')
        time.sleep(2)
    capture=read(marker);assert capture['complete'] and not capture['sample_only']


def evaluate(case):
    folder=OUT/case;folder.mkdir(exist_ok=True)
    runtime=PRIVATE/f'cctv-trial-{case}'
    # Separate privileged cache, never mounted by any ENTITY worker.
    cache=Path('/opt/entity-p2/evaluator-caches')/case
    (cache/'evaluator').mkdir(parents=True,exist_ok=True)
    for image in (runtime/'evaluator').glob('*.png'):shutil.copyfile(image,cache/'evaluator'/image.name)
    (cache/'frames').mkdir(exist_ok=True)
    for image in (Path('/opt/entity-p2/corpora')/case/'frames').iterdir():
        if not (cache/'frames'/image.name).exists():os.link(image,cache/'frames'/image.name)
    with (PRIVATE/f'{case}-evaluation.log').open('w') as log:
        for script,args in [('check-cctv-trial.py',['--run',case,'--phase','09.18','--image-cache',str(cache)]),
                            ('evaluate-cctv-detection.py',['--run',case,'--experiment','accept18','--phase','09.18']),
                            ('evaluate-cctv-mot.py',['--run',case,'--experiment','accept18','--phase','09.18']),
                            ('evaluate-cctv-mtmc.py',['--run',case,'--experiment','accept18','--phase','09.18'])]:
            subprocess.run([CPU,str(SCRIPTS/script),*args],check=True,stdout=log,stderr=log)
    return case


def persist(case,vision_seconds,attempt=''):
    before=time.perf_counter()
    while True:
        tests=(PRIVATE/'api-tests18.log').read_text()
        if '\nOK\n' in tests:break
        if 'FAILED (' in tests:raise RuntimeError('Core regression failed; no import attempted')
        if time.perf_counter()-before>1800:raise RuntimeError('Core regression did not finish')
        time.sleep(1)
    core.RUN='p2-09-'+case+attempt;folder=OUT/case;process=None
    with (PRIVATE/f'{case}-core.log').open('w') as log:
        try:
            process=core.server(log)
            first=core.ingest.execute(core.API,core.RUN,folder/'ingestion.json',experiment='accept18',corpus=case,phase='P2-09.18')
            assert first['duplicate_observations']==0
            replay=core.ingest.execute(core.API,core.RUN,folder/'replay.json',replay=True,experiment='accept18',corpus=case,phase='P2-09.18')
            state=core.state();rss=Path(f'/proc/{process.pid}/status').read_text()
            process.terminate();process.wait(timeout=15);process=None
            process=core.server(log);assert state==core.state()
            result={'phase':'P2-09.18','passed':True,'same_existing_sqlite_database':True,'full_owned_uvicorn_restart':True,
                    'world_relations_memory_identical':True,'exact_duplicate_observations':replay['duplicate_observations'],
                    'vision_stage_wall_seconds':vision_seconds,'core_first_ingress_seconds':first['seconds'],
                    'sum_worker_wall_and_first_ingress_seconds':vision_seconds+first['seconds'],
                    'derived_aggregate_images_per_second':first['frame_observations']/(vision_seconds+first['seconds']),
                    'timing_scope':'sum of case worker wall times plus first HTTP ingress; excludes capture/evaluation/queue; concurrent host workload',
                    'core_peak_rss_kib':int(re.search(r'VmHWM:\s+(\d+)',rss).group(1)),
                    'realtime_validated':False,'human_final_acceptance':False}
            write(folder/'persistence.json',result)
        finally:
            if process is not None and process.poll() is None:process.terminate();process.wait(timeout=15)
    return case


def summarize(frozen):
    rows=[]
    for case in CASES:
        folder=OUT/case;d=read(folder/'accept18/detection-checks.json');m=read(folder/'accept18/mot-tracks-tuned.json')
        g=read(folder/'evaluation.json');c=read(folder/'corpus-checks.json');p=read(folder/'persistence.json')
        checks={'corpus_valid':c['gate_passed'],'detector_recall_95':d['detection_target_passed'],
                'zero_local_id_switches':m['continuous_visible_id_switches']==0,
                'global_continuity':g['technical_gate_passed'],'core_persistence_replay':p['passed']}
        row={'run':case,'images':c['images'],'valid_opportunities':d['valid_opportunities'],
             'detector_matched':d['matched'],'detector_recall':d['recall'],'detector_false_boxes':d['false_positive_boxes'],
             'mot_false_observations':m['false_track_observations'],'local_id_switches':m['continuous_visible_id_switches'],
             'global_actor_id_count':g['actor_global_id_count'],'global_fragmentations':g['residual_actor_fragmentations'],
             'global_hypotheses_total':g['global_groups'],'additional_unmatched_or_duplicate_global_hypotheses':g['additional_unmatched_or_duplicate_global_hypotheses'],
             'unresolved_geometry_instants':sum(len(x['unresolved_view_geometry_instants']) for x in g['continuity']),
             'checks':checks,'technical_checks_passed':all(checks.values())}
        rows.append(row)
    assert pinned()==frozen,'Frozen policy/model changed during acceptance batch'
    result={'phase':'P2-09.18','five_runs_complete':len(rows)==5,'runs':rows,
            'all_five_technical_checks_passed':all(x['technical_checks_passed'] for x in rows),
            'perception_policy_changed_during_batch':False,'human_final_acceptance':False,
            'status':'READY_FOR_HUMAN_REVIEW' if all(x['technical_checks_passed'] for x in rows) else 'TECHNICAL_VALIDATION_FAILED',
            'limitations':['Five fresh repetitions of same geometric route with speed variants; not five unseen buildings/routes',
                           'Variant0 repeats tuning stimulus with a fresh capture; no statistical held-out claim',
                           'Single actor; multiperson false merge rate unmeasured','Offline batch; not live/civil identity/resource occupancy']}
    write(OUT/'acceptance.json',result);return result


def main():
    start=time.perf_counter();frozen=pinned()
    existing=OUT/'frozen-policy.json'
    if existing.exists():assert read(existing)['sha256']==frozen,'Previously frozen policy differs; do not silently restart'
    else:write(existing,{'phase':'P2-09.18','sha256':frozen,'cases':CASES,'detector_threshold':.25,
                         'native_tile_sensors':['C1-S1','C2-S1'],'source_case_fields_never_enter_worker':['variant','actor_id','feet','route','labels'],
                         'human_final_acceptance':False})
    evaluations=[];core_jobs=[]
    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as evaluator,concurrent.futures.ThreadPoolExecutor(max_workers=1) as database:
            for case in CASES:
                write(STATUS,{'done':False,'pid':os.getpid(),'current':case,'stage':'waiting capture'})
                wait_capture(case);assert pinned()==frozen
                folder=OUT/case;folder.mkdir(exist_ok=True)
                env=os.environ|{'P2_TRIAL_RUN':case,'P2_EXPERIMENT':'accept18','P2_DETECTOR_PROVIDER':'cuda','P2_DETECT_THRESHOLD':'0.25','P2_TILE_SENSORS':'C1-S1,C2-S1'}
                with (PRIVATE/f'{case}-vision.log').open('w') as log:
                    subprocess.run(['bash',str(SCRIPTS/'stage-trial-frames.sh')],env=env,check=True,stdout=log,stderr=log)
                    began=time.perf_counter()
                    for worker in ['detect','mot-tuned','reid','mtmc']:
                        write(STATUS,{'done':False,'pid':os.getpid(),'current':case,'stage':worker})
                        subprocess.run(['bash',str(SCRIPTS/'run-cctv-isolated.sh')],env=env|{'P2_VISION_WORKER':worker},check=True,stdout=log,stderr=log)
                    seconds=time.perf_counter()-began
                evaluations.append(evaluator.submit(evaluate,case))
                core_jobs.append(database.submit(persist,case,seconds))
            for job in evaluations+core_jobs:job.result()
        result=summarize(frozen)
        write(STATUS,{'done':True,'pid':os.getpid(),'exit_code':0,'seconds':time.perf_counter()-start,'status':result['status']})
        print(json.dumps(result))
    except Exception:
        write(STATUS,{'done':True,'pid':os.getpid(),'exit_code':1,'seconds':time.perf_counter()-start})
        raise


if __name__=='__main__':main()
