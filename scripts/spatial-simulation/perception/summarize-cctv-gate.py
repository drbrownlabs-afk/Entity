"""Close the optical/editor gate from executed evidence, not planned work."""
import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
PUBLIC=ROOT/'docs/spatial-simulation/evidence/p2-09/09.12'

def load(path):return json.loads(path.read_text())
def pose(profile):
 return {c['id']:{k:c[k] for k in ['device_id','sensor_id','stream_id','position','target','resolution','vfov_deg','model']} for c in profile['cameras']}
def key(point):return tuple(round(v,5) for v in point['feet'])
def private(run):
 path=ROOT/f'simulation/spatial-office/.runtime/cctv-probes-{run}/evaluator'
 meta=load(path/'probes.json');rows=load(path/'measurements.json')
 return meta,{(r['sensor_id'],key(meta['points'][r['probe_index']])):r for r in rows}

def main():
 calibration=load(PUBLIC/'refined3-editor-final/calibration.json')
 matrix=load(PUBLIC/'refined3-editor-final/matrix-checks.json')
 opened=load(PUBLIC/'depth4-open/pixel-coverage.json')
 closed=load(PUBLIC/'depth4-closed/pixel-coverage.json')
 open_meta,open_rows=private('depth4-open');closed_meta,closed_rows=private('depth4-closed')
 canonical=load(ROOT/'apps/spatial-simulation/public/perception/profiles/cctv-c.json')
 common=open_rows.keys()&closed_rows.keys()
 losses=sum(open_rows[k]['useful'] and not closed_rows[k]['useful'] for k in common)
 # Closed cabin interiors are measured and disclosed, not circulation coverage
 # obligations. Derive the enclosure from static partition bounds, retaining
 # every exterior approach point even when its probe name mentions a cabin.
 scene=load(ROOT/'apps/spatial-simulation/public/model/scene.json')
 enclosures=[]
 for name in ['CALL-01','CALL-02']:
  walls=[r['bounds'] for r in scene['records'] if f'sim:{name}:' in r['id'] and r['type']=='Partition' and r.get('bounds')]
  enclosures.append((min(b[0][0] for b in walls),max(b[1][0] for b in walls),min(b[0][2] for b in walls),max(b[1][2] for b in walls)))
 critical=[point for point in open_meta['points'] if not any(x0<=point['feet'][0]<=x1 and z0<=point['feet'][2]<=z1 for x0,x1,z0,z1 in enclosures)]
 covered_points={coords for (_,coords),row in open_rows.items() if row['useful']}
 checks={
  'five_devices_eight_independent_sensors':len(canonical['devices'])==5 and len(canonical['cameras'])==8,
  'canonical_measured_poses_match':pose(canonical)==pose(calibration['profile'])==pose(open_meta['profile'])==pose(closed_meta['profile']),
  'same_static_geometry':len({p['scene_sha256'] for p in [canonical,calibration['profile'],open_meta['profile'],closed_meta['profile']]})==1,
  'explicit_depth_storage':all('explicitly stored depth texture' in m['render_profile'] for m in [open_meta,closed_meta]),
  'actual_camera_matrices':matrix['calibration_matrix_checks_passed'],
  'eight_nonflat_views':matrix['all_nonflat_images'],
  'editor_persistence_and_support':calibration['persistence_roundtrip'] and calibration['central_support_moves_all_heads'],
  'metadata_contract_guards':calibration['metadata_guard_passed'] and all(calibration['nested_metadata_guards']),
  'each_sensor_multiple_useful_probes':all(v>=2 for v in opened['useful_probes_per_sensor'].values()),
  'measured_overlap_connected':opened['overlap_graph_connected'],
  'all_sampled_circulation_regions_covered':all(key(point) in covered_points for point in critical),
  'closed_door_negative_control':losses>0 and 'closed' in closed['door_scenario'],
  'no_browser_errors':not calibration['errors'] and not open_meta['errors'] and not closed_meta['errors'],
 }
 report={'phase':'P2-09.12','technical_gate_passed':all(checks.values()),'checks':checks,
         'profile_id':canonical['profile_id'],'profile_file_sha256':hashlib.sha256((ROOT/'apps/spatial-simulation/public/perception/profiles/cctv-c.json').read_bytes()).hexdigest(),
         'open':{'static_probes':opened['static_probes'],'covered':opened['covered_static_probes'],'blind':opened['blind_static_probes'],'useful_probes_per_sensor':opened['useful_probes_per_sensor']},
         'closed':{'static_probes':closed['static_probes'],'covered':closed['covered_static_probes'],'blind':closed['blind_static_probes']},
         'paired_sensor_point_cases':len(common),'useful_cases_lost_with_closed_doors':int(losses),
         'sampled_circulation_points':len(critical),'sampled_closed_cabin_interior_points':len(open_meta['points'])-len(critical),
         'scope':'Virtual optical/editor calibration, unordered static dummy probes; not detector/MOT/MTMC/real-time acceptance',
         'excluded_from_circulation_requirement':'Closed call cabin interiors remain measured/disclosed; access approaches included',
         'ground_truth':'Private evaluator only; no per-frame poses/masks published or mounted into ENTITY',
         'next':'P2-09.13 static sensor graph only if all checks pass; otherwise correct calibration',
         'human_final_acceptance':False}
 (PUBLIC/'gate.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps(report))
 if not report['technical_gate_passed']:raise SystemExit(1)
if __name__=='__main__':main()
