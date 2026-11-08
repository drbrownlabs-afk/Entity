"""Reopen corrected master, check L/cafe and render review evidence. No original master writes."""
import sys,math
from pathlib import Path
import bpy
from mathutils import Vector
sys.path.insert(0,str(Path(__file__).resolve().parent))
from common import OUTPUT,HANDOFF,ROOT,read,write,sha256,protected_changes,to_blender
E=HANDOFF/'evidence/cafe-correction'
master=OUTPUT/'office-cafe-L.blend'; manifest=read(OUTPUT/'cafe-inventory.json')
bpy.ops.wm.open_mainfile(filepath=str(master));scene=bpy.context.scene
checks=[]
def check(name,ok):
 checks.append({'name':name,'passed':bool(ok)})
 assert ok,name
check('reopens',scene.camera.name=='view:cafe-dollhouse')
check('master-hash',sha256(master)==manifest['master_sha256'])
check('phase01-master-intact',sha256(OUTPUT/'office-phase01.blend')==manifest['source_master_sha256'])
check('578-original-files-intact',not protected_changes())
ids=[o.get('stable_id') for o in bpy.data.objects if o.get('stable_id')]
check('unique-ids',len(ids)==len(set(ids)))
check('no-reconstructed-pods',not any(o.name.startswith('sim:p1:pod:') for o in bpy.data.objects))
check('two-normal-cafe-tables',sum(o.get('semantic_type')=='CafeTable' for o in bpy.data.objects)==2)
check('eight-cafe-chairs',sum(o.name.startswith('sim:cafe:table:') and o.name.endswith(':seat') for o in bpy.data.objects)==8)
for id in ['bar-cabinet','bar-counter','espresso-machine','back-storage','fridge','floor-wing','floor-join','floor-cafe-rear-fill']:
 check('exists:'+id,'sim:cafe:'+id in bpy.data.objects)
# New wing must be distinct from the old long rectangle and joined on its rear edge.
f=bpy.data.objects['sim:cafe:floor-wing']
check('L-wing-beyond-old-shell',f.location.x-f.dimensions.x/2 < -11.99 and abs(f.location.x+f.dimensions.x/2+6.5)<1e-4)
check('wing-only-at-rear',abs(f.location.y-f.dimensions.y/2-18.2)<1e-4)
check('floor-cafe-level',abs(f.location.z+f.dimensions.z/2+1.55)<1e-4)
# Counter -> rear worktop retains a working aisle; layout units aren't certified meters.
bar=bpy.data.objects['sim:cafe:bar-cabinet'];back=bpy.data.objects['sim:cafe:back-storage']
check('bar-working-clearance',bar.location.x-bar.dimensions.x/2-(back.location.x+back.dimensions.x/2)>1)
for r in read(HANDOFF/'SPACE-INVENTORY.json')['inventory']:
 if r['position'] is not None and r['kind']!='Camera':
  o=bpy.data.objects['ref:'+r['id']]
  check('anchor:'+r['id'],(o.location-Vector(to_blender(r['position']))).length<2e-5)
write(E/'checks.json',{'checks':checks,'passed':all(c['passed'] for c in checks),'master_sha256':sha256(master),'human_approval':False,'full_phase02_complete':False})
renders=[]
for view in ['cafe-dollhouse','cafe-plan','cafe-interior']:
 scene.camera=bpy.data.objects['view:'+view];top=view!='cafe-interior'
 for o in bpy.data.objects:
  if o.get('semantic_type') in ['Ceiling','CeilingDetail']:o.hide_render=top
 scene.render.resolution_x=1200;scene.render.resolution_y=800;scene.render.image_settings.file_format='PNG'
 scene.render.filepath=str(E/(view+'.png'));bpy.ops.render.render(write_still=True)
 renders.append({'view':view,'sha256':sha256(E/(view+'.png')),'master_sha256':sha256(master)})
 write(E/'renders.json',renders)
print('CAFE_CHECKS_PASS',len(checks),'RENDERS',len(renders))
