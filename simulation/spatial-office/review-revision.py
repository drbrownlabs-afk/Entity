"""Generate a review gallery only from hash-verified, actually captured images of this master."""
import sys
from common import OUTPUT,HANDOFF,read,sha256
E=HANDOFF/'evidence/phase04-revision';draft='--draft' in sys.argv;folder=E/('draft' if draft else 'renders')
gate=read(E/'summary.json');master=OUTPUT/'office-phase04-revision.blend';h=sha256(master)
assert gate['passed'] and gate['master_sha256']==h
raw={r['name']:r for r in read(folder/'renders.json') if r['master_sha256']==h}
filtered={r['name']:r for r in read(folder/'denoised/manifest.json')['images'] if r['master_sha256']==h}
names=['lounge','vertical-garden','garden-detail','office','computer-detail','glass-detail','glass','lighting-corner','comedor','waiting','reception','cafe','WC','services','booths','corridor','general-12','general-08','general-16','general-20','lounge-20','lounge-lights-on-20','lounge-lights-one-20','lounge-lights-off-20']
labels={'lounge':'Lounge: mobiliario y luz indirecta','office':'Puestos: vidrio, equipos y jardineras','computer-detail':'Equipos a escala cercana','glass-detail':'Mamparas: reflexión a ángulo oblicuo','glass':'Vidrio y transparencia','lighting-corner':'Esquina: perfiles y luz cálida','comedor':'Comedor: más mesas y sillas','waiting':'Sofás en lugar de las sillas blancas','reception':'Recepción y acabados','cafe':'Cafetería y barra','WC':'Baño: inspección desde fuera, puerta abierta','services':'Acceso al baño y lockers','booths':'Dos cabinas telefónicas','corridor':'Vista general interior','general-12':'Planta C — 12:00','general-08':'Planta C — 08:00','general-16':'Planta C — 16:00','general-20':'Planta C — 20:00','lounge-20':'Lounge — 20:00'}
labels.update({'lounge-lights-on-20':'Misma cámara: todas las luces del lounge ON','lounge-lights-one-20':'Misma cámara: solo LED vertical ON','lounge-lights-off-20':'Misma cámara: luminarias OFF, pantallas independientes'})
labels.update({'vertical-garden':'Jardín vertical: cobertura completa','garden-detail':'Jardín vertical a escala cercana'})
title='Pruebas de acabado — candidato en proceso' if draft else 'Revisión arquitectónica — Fase04-R1'
lines=[f'# {title}','', '**Maestro:** [office-phase04-revision.blend](../../simulation/spatial-office/output/office-phase04-revision.blend).', '',
 'Cuatro mesas y catorce sillas de comedor, más cuatro taburetes; sillas blancas de visita sustituidas por dos sofás; lounge equipado; pantalla grande de reuniones; baño y cabinas identificados.', '',
 f'**Gate:** {gate["checks"]} comprobaciones / 21 recorridos. **71 luces en 17 circuitos**, luz de trabajo a 3200 K y acentos a 2700 K; 135 piezas de vidrio con reflexión/transmisión. Arquitectura y posiciones heredadas conservadas. [Plano con baño/cabinas](evidence/phase04-revision/layout-with-ids.svg) · [Informe](PHASE-04-REVISION-REPORT.md).', '',
 'Las imágenes siguientes son renders reales de este maestro, con filtrado OIDN y pases de albedo/normales. Las referencias del operador son objetivos visuales; nunca sustituyen capturas. Aceptación humana pendiente.']
if draft:lines += ['', '**Borradores de 900 × 600 / hasta 24 muestras. Las capturas de revisión de mayor resolución están pendientes.**']
elif len(set(raw)&set(filtered))<23:lines += ['', '**Galería en actualización: se añaden las capturas conforme terminan. La entrega visual completa sigue en proceso.**']
for name in names:
    if name not in raw or name not in filtered:continue
    r=raw[name];f=filtered[name]
    assert sha256(folder/r['path'])==r['sha256'] and sha256(folder/f['filtered'])==f['filtered_sha256']
    p=str(folder.relative_to(HANDOFF))
    lines += ['',f'## {labels.get(name,name)}','',f'![{labels.get(name,name)}]({p}/{f["filtered"]})','',f'[Original Cycles sin filtrar]({p}/{r["path"]}) · hora {r["hour"]:02}:00 · {r.get("resolution","resolución en registro")} · hasta {r["samples_max"]} muestras.']
lines += ['', '## Objetivos visuales proporcionados por el operador', '',
 '| Lounge | Puestos | Recepción |','|---|---|---|',
 '| ![Objetivo lounge](references/1290-lounge-target.jpg) | ![Objetivo puestos](references/1288-office-target.jpg) | ![Objetivo recepción](references/1286-reception-target.jpg) |','',
 'Revisar textura, diseño de luz cálida, reflejos del vidrio y detalle a escala humana. Son referencias de calidad, no evidencia de la escena ejecutada.', '',
 'Para abrir los controles locales, ejecutar el texto **START ENTITY visual controls** dentro del maestro en el checkout. La integración PlayCanvas y la exportación arquitectónica definitiva siguen pendientes de autorización tras esta revisión.']
(HANDOFF/'REVIEW-PHASE04-REVISION.md').write_text('\n'.join(lines)+'\n')
print('VERIFIED_GALLERY',len(set(raw)&set(filtered)),'images','DRAFT' if draft else 'REVIEW',h)
