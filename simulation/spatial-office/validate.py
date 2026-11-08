"""Reopen .blend and validate Phase 01 evidence (run in a separate Blender process)."""
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import EVIDENCE, HANDOFF, OUTPUT, protected_changes, read, sha256, to_blender, to_source, write

checks=[]


def check(name, condition, detail):
    checks.append({'name':name, 'passed':bool(condition), 'detail':detail})
    if not condition:
        raise AssertionError(name + ': ' + str(detail))


def close(a,b,eps=2e-5):
    return len(a)==len(b) and all(abs(x-y)<eps for x,y in zip(a,b))


try:
    bpy.ops.wm.open_mainfile(filepath=str(OUTPUT/'office-phase01.blend'))
    check('blend-reopens',bpy.context.scene.get('phase','').startswith('01'),bpy.app.version_string)
    check('original-files-unchanged',not protected_changes(),protected_changes())
    manifest=read(OUTPUT/'object-inventory.json')
    records=manifest['objects']
    ids=[o['id'] for o in records]
    check('stable-ids-unique',len(ids)==len(set(ids)),len(ids))
    check('manifest-matches-blend',set(ids)=={o['stable_id'] for o in bpy.data.objects if 'geometry_origin' in o},len(ids))
    required=['stable_id','semantic_type','environment_id','geometry_origin','source_position','source_frame','meters_verified']
    check('metadata-complete',all(all(k in bpy.data.objects[i] for k in required) for i in ids),required)
    check('dimensions-positive',all(all(d>=0 for d in o['source_dimensions']) for o in records),len(records))
    check('relative-units-only',not bpy.context.scene['meters_verified'] and all(not bpy.data.objects[i]['meters_verified'] for i in ids),'No certified meters')
    source=read(HANDOFF/'SPACE-INVENTORY.json')['inventory']
    positioned=[r for r in source if r['position'] is not None and r['kind']!='Camera']
    for r in positioned:
        obj=bpy.data.objects['ref:'+r['id']]
        check('exact-anchor:'+r['id'],close(obj.location,to_blender(r['position'])),list(obj.location))
    guide=bpy.data.objects['ref:WALKABLE-FLOOR']
    original_vertices=[]
    original_faces=[]
    for line in (HANDOFF/'WALKABLE-FLOOR.obj').read_text().splitlines():
        if line.startswith('v '): original_vertices.append(tuple(map(float,line.split()[1:])))
        if line.startswith('f '): original_faces.append(tuple(int(i)-1 for i in line.split()[1:]))
    check('floor-topology',len(guide.data.vertices)==16709 and len(guide.data.polygons)==29526,'16709 vertices; 29526 triangles')
    check('floor-every-vertex-converted-once',all(close(v.co,to_blender(p)) for v,p in zip(guide.data.vertices,original_vertices)),len(original_vertices))
    check('floor-triangle-indices',all(tuple(poly.vertices)==f for poly,f in zip(guide.data.polygons,original_faces)),len(original_faces))
    check('floor-guide-hidden-not-filled',guide.hide_render and guide.get('source_sha256')==sha256(HANDOFF/'WALKABLE-FLOOR.obj'),'Measured guide separate from estimated design slab')
    for r in source:
        if r['kind']=='Desk' and r['id'][0] in ['C','D'] and r['position'] is not None:
            id=f'sim:p1:{r["id"][0]}:chair:{r["id"][1:]}:seat'
            seat=bpy.data.objects[id]
            surface=list(to_source(seat.location))
            surface[1]+=.055
            check('chair-surface:'+r['id'],close(surface,r['position']),surface)
    check('levels-preserved',close([bpy.data.objects['sim:p1:floor-main'].location.z+.09,bpy.data.objects['sim:p1:floor-reception-raised'].location.z+.15],[-1.85,-1.55]),'0.30 relative unit step, no flattening')
    for env in ['C','D']:
        anchor=next(r for r in source if r['id']==env)['position']
        table=bpy.data.objects[f'sim:p1:{env}:desktop']
        check('measured-table-surface:'+env,abs(table.location.z+.035-anchor[1])<2e-5,'Top surface follows calibrated C/D group anchor')
    for env in ['A','B','C','D']:
        leg=bpy.data.objects[f'sim:p1:{env}:table-leg:0']
        check('table-legs-reach-floor:'+env,abs(leg.location.z-leg.dimensions.z/2+1.85)<2e-5,'No floating table legs')
    for c in manifest['cameras']:
        obj=bpy.data.objects[c['id']]
        check('camera-position:'+c['id'],close(to_source(obj.location),c['source_position']),c['source_position'])
        check('camera-fov:'+c['id'],abs(math.degrees(obj.data.angle)-c['fov_vertical'])<1e-4 and obj.data.sensor_fit=='VERTICAL',c['fov_vertical'])
        if c['source_target']:
            direction=(Vector(to_blender(c['source_target']))-obj.location).normalized()
            actual=obj.matrix_world.to_quaternion() @ Vector((0,0,-1))
            check('camera-direction:'+c['id'],close(direction,actual),list(actual))
    # A furniture move must not drag other parts or source references.
    obj=bpy.data.objects['sim:p1:C:desktop']
    peers=[o for o in bpy.data.objects if o!=obj]
    positions=[o.location.copy() for o in peers]
    initial=obj.location.copy()
    obj.location.x+=1.234
    bpy.context.view_layer.update()
    check('independent-editable-object',all(close(o.location,p) for o,p in zip(peers,positions)),obj.name)
    obj.location=initial
    bpy.context.view_layer.update()
    check('new-architecture-not-started',not any('sim:p2:' in i for i in ids),'No E, partitions or cafe replacement before Phase 02')
    def aabb(obj):
        points=[obj.matrix_world @ Vector(p) for p in obj.bound_box]
        return ([min(p[i] for p in points) for i in range(3)], [max(p[i] for p in points) for i in range(3)])
    for env in ['A','B','D']:
        lo1,hi1=aabb(bpy.data.objects[f'sim:p1:{env}:desktop'])
        lo2,hi2=aabb(bpy.data.objects[f'sim:p1:{env}:storage'])
        overlaps=all(lo1[i]<hi2[i] and lo2[i]<hi1[i] for i in range(3))
        check('storage-does-not-intersect-table:'+env,not overlaps,'Desktop/storage world-space bounds')
    from bpy_extras.object_utils import world_to_camera_view
    plan=bpy.data.objects['view:plan']
    corners=[to_blender((x,-1.85,z)) for x in [-6.5,4.35] for z in [-26.5,2.65]]
    projections=[world_to_camera_view(bpy.context.scene,plan,Vector(p)) for p in corners]
    check('plan-shows-entire-floor',all(.01<p.x<.99 and .01<p.y<.99 and p.z>0 for p in projections),[list(p) for p in projections])
    check('render-ready',bpy.context.scene.render.engine=='CYCLES' and len(bpy.data.lights)>0,'Cycles CPU reference lighting; operational circuits deferred')
finally:
    write(EVIDENCE/'validation.json',{'blend_sha256':sha256(OUTPUT/'office-phase01.blend'),'checks':checks,'passed':bool(checks) and all(c['passed'] for c in checks),'human_approval':False})
print('PHASE01_VALIDATION_PASS',len(checks))
