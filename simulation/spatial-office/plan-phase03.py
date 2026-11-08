"""Standalone labeled plan from the actual validated room/route/device inventory."""
import html
from common import OUTPUT,HANDOFF,read,write,sha256
E=HANDOFF/'evidence/phase03';m=read(OUTPUT/'phase03-inventory.json');g=read(E/'summary.json')
assert g['passed'] and g['master_sha256']==sha256(OUTPUT/'office-phase03.blend')
def pt(x,z):return ((x+12.5)*42,(z+29)*42+70)
def rect(bounds,fill,stroke='#384b59',opacity=1):
 xl,xr,zl,zr=bounds;a,b=pt(xl,zl);c,d=pt(xr,zr)
 return f'<rect x="{a}" y="{b}" width="{c-a}" height="{d-b}" fill="{fill}" stroke="{stroke}" opacity="{opacity}"/>'
def text(x,z,label,size=16,color='#14232f'):
 a,b=pt(x,z);return f'<text x="{a}" y="{b}" font-size="{size}" fill="{color}" text-anchor="middle">{html.escape(label)}</text>'
svg='<svg xmlns="http://www.w3.org/2000/svg" width="840" height="1490" viewBox="0 0 840 1490"><rect width="840" height="1490" fill="#f5f7fa"/><g font-family="Arial,sans-serif"><text x="30" y="28" font-size="21">ENTITY — Fase 03 · C · distribución propuesta</text><text x="30" y="51" font-size="12">Unidades relativas · dimensiones estimadas · fuentes y anclas conservadas</text>'
svg+=rect([-6.5,4.35,-26.5,2.65],'#e4e7e4')+rect([-12,-6.5,-26.5,-18.2],'#f2d3aa')+rect([-2.85,4.35,-28.6,-26.5],'#e4e7e4')
svg+=rect([-12,-6.5,-5.8,2.65],'#d0e5e2')
svg+=rect([-2.85,-1.5,-28.3,2.5],'#c4e5f1')
svg+=text(-10,-3,'LOUNGE',16)
for rr in m['architecture_C']['rooms'][1:]:
 xl,xr,zl,zr=rr['bounds'];svg+=rect(rr['bounds'],'#d4dee8')+text((xl+xr)/2,(zl+zr)/2,rr['id'].replace('sim:',''),11)
svg+=text(-4.3,1.5,'LOCKERS',10)+text(-4.3,-1.8,'PRINT',10)
for name,path in read(E/'routes.json')['routes'].items():
 points=' '.join(f'{pt(p[0],p[2])[0]},{pt(p[0],p[2])[1]}' for p in path)
 svg+=f'<polyline points="{points}" fill="none" stroke="#23905c" stroke-width="1.5" opacity=".5"/>'
for r in m['layout']['rooms']:
 svg+=rect(r['bounds'],'#faffff','#285769',.85)
 xl,xr,zl,zr=r['bounds'];cx=(xl+xr)/2;cz=(zl+zr)/2
 name='E (nueva)' if r['id']=='sim:ROOM-E' else 'Reuniones' if r['id']=='MEETING-AREA-01' else r['id']
 svg+=text(cx,cz,name,22)
 svg+=text(cx,cz+.50,'Mesa + 6 puestos' if r['id']!='MEETING-AREA-01' else 'Mesa negra existente',11)
 h=r['hinge_z'];a,b=pt(xl,h);_,d=pt(xl,h+r['door_width'])
 svg+=f'<line x1="{a}" y1="{b}" x2="{a}" y2="{d}" stroke="#fff" stroke-width="7"/><line x1="{a-3}" y1="{b}" x2="{a-3}" y2="{d}" stroke="#2079d3" stroke-width="3"/>'
 svg+=text(-2.17,h+.35,'↔',17,'#2065ba')
svg+=text(-9.2,-24.8,'CAFETERÍA',17)+text(-9.2,-24.2,'Barra + equipamiento',11)+text(-4.4,-22.8,'Mesas café',11)
svg+=rect([-10.225,-9.175,-25.125,-19.475],'#a86e37')
for x,z in [[-4.3,-20.5],[-4.3,-24]]:
 a,b=pt(x,z);svg+=f'<circle cx="{a}" cy="{b}" r="25" fill="#b48e68"/>'
svg+=text(-4.7,-16.0,'RECEPCIÓN',12)+text(-4.7,-9.0,'ESPERA',12)+text(-3.25,-18.8,'Rampa',11)
for i,t in enumerate(m['televisions'],1):
 rec=next(r for r in m['objects'] if r['id']==t['id']);x,_,z=rec['position_source'];a,b=pt(x,z)
 svg+=f'<circle cx="{a}" cy="{b}" r="11" fill="#264970"/>'+text(x,z+.1,'TV'+str(i),8,'white')
svg+=text(-2.2,-12.95,'SEG',9,'#a53f28')
svg+='<text x="30" y="1430" font-size="13">Azul: pasillo y puertas · verde: recorridos QA con puertas abiertas</text><text x="30" y="1453" font-size="12">19 puertas independientes · 5 pantallas · rampa a cafetería · E detrás de D · lounge/cabinas/WC/lockers</text><text x="30" y="1475" font-size="12">No certifica escala métrica, evacuación ni operación física; runtime en fases posteriores.</text></g></svg>'
(E/'layout-with-ids.svg').write_text(svg)
print('PLAN_WITH_IDS_SAVED')
