"""Review diagram from the current validated layout and computed routes; dimensions estimated."""
import html
from common import OUTPUT,HANDOFF,HERE,read,sha256
E=HANDOFF/'evidence/phase04-revision';cfg=read(HERE/'revision-layout.json');m=read(OUTPUT/'phase03-inventory.json');gate=read(E/'summary.json')
assert gate['passed'] and gate['master_sha256']==sha256(OUTPUT/'office-phase04-revision.blend')
def pt(x,z):return ((x+12.6)*44,(z+29)*44+80)
def rect(b,fill,stroke='#4b6269'):
    xl,xr,zl,zr=b;a,c=pt(xl,zl);d,e=pt(xr,zr)
    return f'<rect x="{a}" y="{c}" width="{d-a}" height="{e-c}" fill="{fill}" stroke="{stroke}"/>'
def label(x,z,s,size=13,color='#203438'):
    a,b=pt(x,z);return f'<text x="{a}" y="{b}" font-size="{size}" fill="{color}" text-anchor="middle">{html.escape(s)}</text>'
svg='<svg xmlns="http://www.w3.org/2000/svg" width="840" height="1580" viewBox="0 0 840 1580"><rect width="840" height="1580" fill="#faf8f2"/><g font-family="Arial,sans-serif"><text x="28" y="30" font-size="23">ENTITY · revisión de mobiliario / acabados</text><text x="28" y="53" font-size="13">Planta C conservada · unidades relativas · no escala métrica certificada</text>'
svg+=rect([-6.5,4.35,-26.5,2.65],'#e4e6de')+rect([-12,-6.5,-26.5,-18.2],'#e7d3b6')+rect([-2.85,4.35,-28.6,-26.5],'#e4e6de')+rect([-12,-6.5,-5.8,2.65],'#d9e5df')
svg+=rect([-2.85,-1.5,-28.3,2.5],'#c9e3e9')
for room in m['layout']['rooms']:
    b=room['bounds'];svg+=rect(b,'#f7fbfa');xl,xr,zl,zr=b;name='E · mesa al fondo' if room['id']=='sim:ROOM-E' else 'REUNIONES' if room['id']=='MEETING-AREA-01' else room['id']
    svg+=label((xl+xr)/2,(zl+zr)/2,name,17)
    if room['id']=='MEETING-AREA-01':svg+=label((xl+xr)/2,(zl+zr)/2+.55,'TV grande',12)
for name,path in read(E/'routes.json')['routes'].items():
    points=' '.join(f'{pt(p[0],p[2])[0]},{pt(p[0],p[2])[1]}' for p in path)
    svg+=f'<polyline points="{points}" stroke="#4a9b77" stroke-width="1.4" fill="none" opacity=".4"/>'
svg+=label(-9.4,-24,'CAFETERÍA',15)+label(-9.4,-23.4,'Barra / 4 taburetes',11)
for i,r in enumerate(cfg['dining'],1):
    x,z=r['center'];a,b=pt(x,z);svg+=f'<circle cx="{a}" cy="{b}" r="{r["radius"]*44}" fill="#bda384" stroke="#725a41"/>'
    svg+=label(x,z+.08,str(i),11)
    for j in range(r['chairs']):
        import math
        ang=j*math.tau/r['chairs'];radius=.9 if r['chairs']==4 else .76;a,b=pt(x+math.cos(ang)*radius,z+math.sin(ang)*radius)
        svg+=f'<circle cx="{a}" cy="{b}" r="8" fill="#6c7d65"/>'
svg+=label(-4.7,-18.9,'COMEDOR',13)+label(-4.7,-18.5,'4 mesas / 14 sillas',10)
svg+=label(-4.7,-14.1,'ESPERA / RECEPCIÓN',11)+label(-4.7,-14.6,'Sofás en lugar de sillas blancas',9)
for r in cfg['waiting_sofas']:
    x,z=r['center'];svg+=rect([x-.28,x+.28,z-r['width']/2,z+r['width']/2],'#b9a88e')
svg+=label(-4.8,-9,'ESPERA · sofá conservado',10)
svg+=label(-9.3,-3.2,'LOUNGE',16)+label(-9.3,-2.6,'Sofás · butaca · mesas · plantas',10)
for room in m['architecture_C']['rooms'][1:]:
    b=room['bounds'];iswc=room['id']=='sim:WC';svg+=rect(b,'#edc7a7' if iswc else '#c0d2d2','#86552c' if iswc else '#4b6269')
    xl,xr,zl,zr=b;svg+=label((xl+xr)/2,(zl+zr)/2,'BAÑO / WC' if iswc else room['id'].replace('sim:CALL-','CABINA '),11)
svg+=label(-6.9,-.2,'↑ ACCESO AL BAÑO',11,'#8e4e23')+label(-4.25,1.6,'LOCKERS',10)+label(-4.25,-1.8,'IMPRESIÓN',10)
svg+='<text x="28" y="1510" font-size="13">Verde: 21 recorridos QA · azul: pasillo principal · marrón: baño identificado</text><text x="28" y="1534" font-size="12">71 luces / 17 circuitos · 19 puertas · 6 pantallas · privacidad interior WC conservada</text><text x="28" y="1557" font-size="12">Diagrama para revisión; no certifica evacuación, accesibilidad ni ubicación geográfica.</text></g></svg>'
(E/'layout-with-ids.svg').write_text(svg)
print('REVISION_PLAN_SAVED')
