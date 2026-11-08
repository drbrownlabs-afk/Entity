# Synthetic Office — reconstrucción editable, Fase 01

**Versión actual tras la corrección del operador:** [office-cafe-L.blend](output/office-cafe-L.blend), con cafetería y brazo posterior en L. [Informe actualizado](../../docs/spatial-simulation/CAFE-L-CORRECTION.md). El maestro Phase01 indicado a continuación queda como evidencia histórica.

Maestro: [output/office-phase01.blend](output/office-phase01.blend).
Inventario: [output/object-inventory.json](output/object-inventory.json).
Resultados y límites: [informe del gate](../../docs/spatial-simulation/PHASE-01-REPORT.md).

## Reproducir

Desde `/workspace/Entity`, con Python 3.12 y Blender 4.3.2 (Cycles CPU):

```sh
python3 -m unittest discover -s simulation/spatial-office/tests -v
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/build.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/validate.py
blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/render.py
python3 simulation/spatial-office/gate.py
```

Las pruebas reproducen el extractor **en una copia temporal**. No ejecutar el extractor original sobre el checkout: reescribe el handoff protegido. La reconstrucción escribe solo en `simulation/spatial-office/output/`; validación y renders en `docs/spatial-simulation/evidence/phase01/`. No inicia servicios ni conecta a Core.

`gate.py` exige la revisión visual registrada y rechaza imágenes incompletas, hashes obsoletos o cambios en fuentes protegidas. Si se cambia el maestro, se debe volver a renderizar e inspeccionar antes de actualizar `visual-review.json`; no actualizar ese registro sin ver las imágenes. El gate técnico no otorga aprobación humana.

Blender del entorno tiene Cycles CPU y no tiene OpenImageDenoise: 48 muestras, cuatro hilos, sin denoising. No se necesitan paquetes Python, npm, GPU, credenciales ni nuevas descargas para esta fase. `--python-exit-code 1` es obligatorio para propagar errores de scripts (Blender puede terminar con código cero tras una excepción si se omite).

## Inspección y edición

Abrir el `.blend` en Blender 4.3.2 o posterior. La cámara activa muestra el dollhouse; el techo está oculto para esta vista. Los objetos están enlazados a colecciones por ambiente y por tipo semántico. Seleccionar un objeto permite editar su transformación sin mover los demás. Los campos personalizados incluyen `stable_id`, `semantic_type`, `environment_id`, `source_position`, `source_frame`, `geometry_origin` y `meters_verified=false`.

`00 Source references - read only` guarda anclas originales y el suelo parcial, ocultos de render y viewport. Activarlos en el Outliner para comparar. No confundir el slab de diseño con el muestreo parcial original. Las cámaras `view:annotation:0..6` y las cámaras de survey conservan las poses originales; el script de renders activa el techo para interiores y lo recorta para plantas. Los nombres `reference:*` son iluminación de referencia de render, sin promesa de controles ni circuitos operables.

Todo objeto geométrico nuevo usa `sim:p1:*`. Las anclas originales usan `ref:*` y guardan `source_entity_id`; no se crean entidades Core. Los puestos privados A/B sin localización medida no reciben posiciones Core: sus sillas visuales son estimaciones separadas. Las superficies de asiento C1–C6/D1–D6 conservan las coordenadas del handoff. Los metadatos desconocidos permanecen desconocidos en el inventario de origen.

## Alcance

Esta entrega reconstruye el escenario original con aproximaciones documentadas en `layout.json`; no aplica aún el rediseño de mamparas, Sala E, cafetería o controles. Los dos booths representativos son una suposición de modelado, no un recuento certificado del original. La recepción elevada y el suelo general se mantienen a niveles diferentes. El entorno no es un levantamiento arquitectónico, y las unidades relativas 1:1 no acreditan metros.

No hay archivo Gaussian segmentado: se usan el OBJ parcial, las anclas, los hashes de voxels y las capturas existentes. La geometría editable se construye con primitivas/modificadores de Blender, no con un motor nuevo ni segmentación inventada. Las piezas no segmentadas requieren aproximaciones visuales explícitas. No se distribuyen fotografías nuevas ni texturas externas.

La aceptación humana de fase queda pendiente. Las fases 02–06 y su aplicación PlayCanvas se ejecutan después de esa revisión, conforme a `AGENTS.md`.

## Revisión posterior: L y cafetería

El operador corrigió la topología y suministró las dos referencias visuales. El maestro de trabajo actualizado es **`output/office-cafe-L.blend`**; el maestro Phase01 se conserva como evidencia histórica. Ver [corrección L/cafetería](../../docs/spatial-simulation/CAFE-L-CORRECTION.md) para parámetros, renders y comandos. Este incremento reemplaza pods por mesas normales en el diseño nuevo y añade el brazo posterior en L; no acredita por sí mismo el Gate 02 completo.

## Fase 02 — versión actual

**Maestro de trabajo: [output/office-phase02.blend](output/office-phase02.blend)**. Incluye A–E/reuniones con mamparas y puertas, E al fondo, cafetería en L, recepción/espera, rampa, cuatro TVs y siete puertas con controles locales simulados. [Informe y comandos](../../docs/spatial-simulation/PHASE-02-REPORT.md), [plano con IDs](../../docs/spatial-simulation/evidence/phase02/layout-with-ids.svg). Los maestros anteriores se conservan como evidencia histórica. La interacción web y los circuitos luminosos no se atribuyen a esta entrega.
