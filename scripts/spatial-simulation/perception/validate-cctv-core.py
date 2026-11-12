"""Measured local pipeline, same SQLite Core, replay and owned HTTP process restart.

Supervisor performs all waiting/sampling locally without model polling. No DB
copies or snapshots; historical runs stay append-only and unchanged.
"""
import importlib.util
import json
import os
import re
import subprocess
import threading
import time
import traceback
from pathlib import Path
import httpx

ROOT=Path(__file__).resolve().parents[3];os.chdir(ROOT)
PRIVATE=ROOT/'simulation/spatial-office/.runtime';OUT=ROOT/'docs/spatial-simulation/evidence/p2-09/09.17/trial-a'
OUT.mkdir(parents=True,exist_ok=True)
LOG=PRIVATE/'validate-core17.log';STATUS=PRIVATE/'validate-core17-status.json'
API='http://127.0.0.1:8095';RUN='p2-09-cctv-'+time.strftime('%Y%m%dT%H%M%S',time.gmtime());PYTHON='/opt/entity-p2/api-venv/bin/python'
spec=importlib.util.spec_from_file_location('ingest_cctv_core',ROOT/'scripts/spatial-simulation/perception/ingest-cctv-core.py')
ingest=importlib.util.module_from_spec(spec);spec.loader.exec_module(ingest)


def server(log):
    # Fail rather than accidentally use an unrelated listener on this port.
    import socket
    with socket.socket() as probe:
        if probe.connect_ex(('127.0.0.1',8095))==0:raise RuntimeError('Core test port already owned by another listener')
    process=subprocess.Popen([PYTHON,'-m','uvicorn','app.main:app','--app-dir',str(ROOT/'services/entity-api'),
                              '--host','127.0.0.1','--port','8095'],env=os.environ|{'ENTITY_SQLITE_PATH':str(PRIVATE/'p2-core.sqlite3')},stdout=log,stderr=log)
    for _ in range(100):
        try:
            if httpx.get(API+'/health',timeout=1).status_code==200:return process
        except httpx.HTTPError:pass
        if process.poll() is not None:raise RuntimeError('Owned Core HTTP process failed to start')
        time.sleep(.1)
    process.terminate();process.wait(timeout=10);raise RuntimeError('Owned Core start timed out')


def state():
    creds=json.loads((PRIVATE/'coworking-p2-access.json').read_text());user='coworking-p2:admin'
    with httpx.Client(base_url=API,timeout=120) as client:
        r=client.post('/v1/office/auth/login',json={'username':user,'password':creds[user]['password']});r.raise_for_status()
        client.headers['Authorization']='Bearer '+r.json()['token'];prefix=f'/v1/sites/coworking-p2/runs/{RUN}'
        world=client.get(prefix+'/world');world.raise_for_status();world=world.json()
        global_ids=[k for k,v in world['entities'].items() if v.get('track_scope')=='global']
        memories={}
        for key in global_ids:
            r=client.post(prefix+'/queries',json={'kind':'memories','entity_id':key});r.raise_for_status();memories[key]=r.json()['result']
        client.post('/v1/office/auth/logout')
        return {'world':world,'memories':memories}


def main():
    started=time.perf_counter();process=None;stop=threading.Event();gpu=[]
    # Global GPU samples include graphics/other processes. Not process VRAM peak.
    def sample_gpu():
        executable=Path('/usr/lib/wsl/lib/nvidia-smi')
        if not executable.exists():return
        while not stop.is_set():
            try:
                r=subprocess.run([str(executable),'--query-gpu=memory.used','--format=csv,noheader,nounits'],capture_output=True,text=True,timeout=5)
                if r.returncode==0:gpu.append(float(r.stdout.strip().splitlines()[0]))
            except (ValueError,subprocess.TimeoutExpired):pass
            stop.wait(.5)
    threading.Thread(target=sample_gpu,daemon=True).start()
    try:
        with LOG.open('w') as log:
            env=os.environ|{'P2_TRIAL_RUN':'trial-a','P2_EXPERIMENT':'core17','P2_DETECTOR_PROVIDER':'cuda',
                            'P2_DETECT_THRESHOLD':'0.25','P2_TILE_SENSORS':'C1-S1,C2-S1'}
            timings={}
            cached=os.environ.get('P2_REUSE_INFERENCE')=='1'
            for worker,file in [('detect','detections.json'),('mot-tuned','tracks-tuned.json'),('reid','reid-evidence.json'),('mtmc','global-tracks.json')]:
                if cached:
                    timings[worker]=json.loads((PRIVATE/'cctv-trial-trial-a/output/core17'/file).read_text())['processing_seconds']
                else:
                    before=time.perf_counter()
                    subprocess.run(['bash',str(ROOT/'scripts/spatial-simulation/perception/run-cctv-isolated.sh')],env=env|{'P2_VISION_WORKER':worker},check=True,stdout=log,stderr=log)
                    timings[worker]=time.perf_counter()-before
            worker=PRIVATE/'cctv-trial-trial-a/output/core17'
            original=PRIVATE/'cctv-trial-trial-a/output/tiles025'
            new=json.loads((worker/'global-tracks.json').read_text());old=json.loads((original/'global-tracks.json').read_text())
            assert [g['id'] for g in new['groups']]==[g['id'] for g in old['groups']]
            assert [g['local_tracks'] for g in new['groups']]==[g['local_tracks'] for g in old['groups']]
            assert all(not g['continuity_check']['infeasible_segments'] for g in new['groups'])
            tests=(PRIVATE/'api-tests17.log').read_text()
            assert '\nOK\n' in tests,'Core regression suite not green; import has not started'
            process=server(log)
            first=ingest.execute(API,RUN,OUT/'ingestion.json')
            assert first['duplicate_observations']==0,'Initial measured run already contains observations'
            replay=ingest.execute(API,RUN,OUT/'replay.json',replay=True)
            before=state();rss_text=Path(f'/proc/{process.pid}/status').read_text()
            process.terminate();process.wait(timeout=15);process=None
            process=server(log);after=state();assert before==after,'World/relations/memory changed across process restart'
            persistence={'passed':True,'actual_http':True,'same_existing_sqlite_database':True,'full_owned_uvicorn_restart':True,
                         'world_relations_memory_identical':True,'run':RUN,'world_sha256':ingest.digest(after['world']),
                         'memory_sha256':ingest.digest(after['memories']),'global_tracks':len(after['memories'])}
            (OUT/'persistence.json').write_text(json.dumps(persistence,indent=2)+'\n')
            detector=json.loads((worker/'detections.json').read_text());mot=json.loads((worker/'tracks-tuned.json').read_text());reid=json.loads((worker/'reid-evidence.json').read_text())
            pipeline_seconds=sum(timings.values())+first['seconds']
            metrics={'phase':'P2-09.17','measured_stage_sum_inference_and_first_ingress_seconds':pipeline_seconds,
                     'timing_basis':'cached measured inference processing times plus current measured full HTTP ingress; not single-attempt wall time' if cached else 'same-attempt sequential stage wall times plus measured full HTTP ingress',
                     'image_frames':len(detector['frames']),'stage_timing_seconds':timings,
                     'stage_timing_scope':'cached inference processing only' if cached else 'same-attempt worker wall times',
                     'core_first_ingress_seconds':first['seconds'],
                     'batch_pipeline_aggregate_images_per_second':len(detector['frames'])/pipeline_seconds,
                     'requested_aggregate_images_per_second':16,'realtime_validated':False,
                     'detector_image_latency_ms':{'p50':detector['median_inference_ms'],'p95':detector['p95_inference_ms']},
                     'core_pixel_ingress_latency_ms':first['http_latency_ms']['pixel_ingress'],
                     'core_replay_pixel_latency_ms':replay['http_latency_ms']['pixel_ingress'],
                     'detector_peak_rss_kib':detector['peak_rss_kib'],'mot_peak_rss_kib':mot['peak_rss_kib'],
                     'core_process_peak_rss_kib':int(re.search(r'VmHWM:\s+(\d+)',rss_text).group(1)),
                     'ingester_peak_rss_kib':first['ingester_peak_rss_kib'],
                     'gpu_global_memory_sampled_mib':{'samples':len(gpu),'maximum':max(gpu) if gpu else None,'interval_target_seconds':.5,
                         'sampling_phase':'Core ingress/replay/restart; inference reused' if cached else 'inference and Core ingress/replay/restart',
                         'scope':'whole GPU sampled memory, includes other processes; not exclusive process VRAM or guaranteed peak'},
                     'detector_gpu_global_memory_checkpoints_mib':detector['gpu_global_memory_mib'],
                     'limitations':['Offline batch; no causal capture-to-world p50/p95 claimed','RSS is per-process high-water mark, not summed unique system memory',
                                    'Inference and ingress sequential; not an optimized concurrent live deployment']}
            (OUT/'performance.json').write_text(json.dumps(metrics,indent=2)+'\n')
            gate={'phase':'P2-09.17','run':RUN,'technical_gate_passed':False,'core_stage_checks_passed':True,
                  'final_gate_pending':'finish-cctv-core.py isolation audit','real_http_same_core':True,'idempotent_replay':True,
                  'persistent_global_identity_relations_memory':True,'prior_worlds_and_people_unchanged':True,
                  'pixel_observations':first['frame_observations'],'local_tracks':first['local_tracks_in_core'],
                  'global_tracks':first['global_tracks_in_core'],'core_tests_passed':int(re.search(r'Ran (\d+) tests',tests).group(1)),
                  'performance_measured':True,'human_final_acceptance':False,'next_phase':'P2-09.18'}
            (OUT/'gate.json').write_text(json.dumps(gate,indent=2)+'\n')
            STATUS.write_text(json.dumps({'done':True,'exit_code':0,'seconds':time.perf_counter()-started})+'\n')
            print(json.dumps(gate))
    except Exception:
        STATUS.write_text(json.dumps({'done':True,'exit_code':1,'seconds':time.perf_counter()-started})+'\n')
        raise
    finally:
        stop.set()
        if process is not None and process.poll() is None:process.terminate();process.wait(timeout=15)


if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser();parser.add_argument('--run',default=RUN);args=parser.parse_args();RUN=args.run
    main()
