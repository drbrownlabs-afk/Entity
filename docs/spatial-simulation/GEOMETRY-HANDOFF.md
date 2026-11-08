# Synthetic Office — entrega geométrica y semántica para Blender

Fecha:2026-11-08. Fuente geométrica versionada: `40850d120a82a431b3e6ccc824e7bc734c379e5f`. Escena original [a972d838](https://superspl.at/scene/a972d838), autor argenzio, licencia registrada CC BY-NC4.0. No se reconstruyó el edificio ni se modificaron backend, escena o interfaz. No hubo descargas nuevas: esta entrega utiliza únicamente archivos/evidencias existentes.

## Abrir primero

- [SPACE-INVENTORY.json](SPACE-INVENTORY.json):56 entradas con IDs, posiciones, procedencia, relaciones, límites y campos desconocidos explícitos.
- [ANNOTATIONS-MAP.json](ANNOTATIONS-MAP.json):4 anotaciones originales intactas +3 overlays semánticos; cámaras originales, poses interiores y bookmarks de producto conservados.
- [WALKABLE-FLOOR.obj](WALKABLE-FLOOR.obj):16.709 vértices de suelo medido y29.526 triángulos. **Muestreo parcial del suelo transitable**, no malla completa del suelo, paredes ni edificio. Huecos pueden representar muebles, obstáculos, ausencia de muestreo o sectores desconectados; no convertirlos automáticamente en paredes/puertas.

## Fuentes exactas y qué contienen

| Archivo/ruta | Contenido recuperado | Límite |
|---|---|---|
| `worlds/synthetic-office/original-viewer-settings.json` | contentUrl, collisionUrl, cuatro anotaciones y sus cámaras position/target/fov, cámara inicial y ajustes | No inventario exhaustivo ni medidas de objetos |
| `worlds/synthetic-office/manifest.json` | IDs/URL original, autor/licencia y referencias | Metadatos, no malla |
| `docs/evidence/phase09/source-voxels/scene.voxel.json` y `.bin` | Collider original local byte-idéntico, octree, bounds y resolución | Ocupación geométrica sin etiquetas por pared/columna/mueble |
| `docs/evidence/phase09/source-voxels/PROVENANCE.json` | URLs, bytes, SHA256 y ejecución42474773621 | Verificación de origen, no certificado de escala |
| `worlds/synthetic-office/calibrated-resources.json` | Anclas C/D y doce superficies de sillas mediante collider y revisión visual | Una superficie de silla no es pose humana, esquina de mesa ni su dimensión |
| `worlds/synthetic-office/semantic-annotations.json` | Espera, booths y dos sillas negras/recepción; coordenadas de picks y evidencia | Anclas de grupo, no contornos ni montajes de kiosco |
| `worlds/synthetic-office/observed-inventory.json` | Correspondencia de grupos no anotados con C y D | Son referencias a los mismos grupos, NO dos mesas adicionales |
| `docs/evidence/phase09/office-navigation.json` |16.709 muestras de suelo, aristas bloqueadas, rutas/parciales, rayos de recepción y suelo bajo sillas | Envolvente de búsqueda y clearance, no levantamiento arquitectónico completo |
| `docs/evidence/phase09/voxel-ground.json` | Rayos originales de suelo, cápsulas y recorrido de pasillo | Solo los puntos ensayados |
| `worlds/synthetic-office/corridor-route.json`, `daily-spatial-profile.json` | Rutas/personajes de QA sobre pasillo calibrado | No indican límites de habitaciones ni nueva geometría |
| `worlds/synthetic-office/inspection-cameras.json`, `view-bookmarks.json`, `product-views.json` | Vistas interiores/dollhouse y cámaras de inspección | Posiciones de observador, no instalaciones físicas |
| `docs/evidence/phase09/survey/` | Capturas/picks: table-c-seats.jpg, table-d-seats.jpg, wall-from-a/b.jpg, original-plan-near-clipped.jpg, original-plan-far.jpg, rear-hall.jpg, walk-2.jpg, survey-cd-seats.json, survey-seat-picks.json | Referencias visuales; no deducir medidas certificadas de perspectiva |

El Gaussian Splatting original **no es un GLB ni una malla segmentada**. La implementación lo carga desde:

```
https://d28zzqy0iyovbz.cloudfront.net/a972d838/v1/lod-meta.json
https://d28zzqy0iyovbz.cloudfront.net/a972d838/v1/scene.voxel.json
https://d28zzqy0iyovbz.cloudfront.net/a972d838/v1/scene.voxel.bin
```

`lod-meta.json` es la entrada de la escena streamed/LOD, no un archivo SSOG único local. No se ha añadido aquí una copia de todos sus chunks ni se afirma haber exportado PLY/Vite. La geometría original de colisión sí está local, sin modificación. `scene.voxel.bin` tiene617.220bytes y SHA256 `bdd74616236bdefe326fa46c3f60fa21e9aae3a206a24d0262f97c754abf827d`.

## Coordenadas, escala, orientación y alturas

Sistema original PlayCanvas: mano derecha, +Y arriba, plano horizontal X/Z. Cámara definida por position y target; dirección normalizada=target−position. El eje frontal de una cámara PlayCanvas es −Z local. No hay norte geográfico verificado, origen topográfico ni conversión a metros acreditada. **No usar los nombres “metros” del SDK como prueba de escala métrica real.** Mantener unidades relativas1:1.

Conversión rígida a Blender Z-up recomendada: `(x,y,z) → (x,−z,y)`, rotación+90° sobre X, sin espejo ni escala. Importar OBJ manteniendo ejes originales y aplicar esta rotación exactamente una vez; si el importador ya convierte Y-up→Z-up, no repetirla. Conservar coordenadas originales en metadatos y matriz inversa `(xb,yb,zb) → (xb,zb,−yb)`. No centrar/escalar por objeto perdiendo la transformación global.

- Bounds del grid de colisión: min `[-9.6,−3.6,−29.4]`, max `[5.6,7.2,2.4]`.
- Bounds declarados de escena: min `[-17.09414995,−14.09831671,−32.24982658]`, max `[12.78636935,10.84916137,7.83042858]`.
- Esos bounds incluyen datos/captura y posibles artefactos; **no son esquinas del recinto ni alturas de techo**.
- Resolución original voxel `.05` unidades relativas. Muestreo navegable `.1`. Cápsula conservadora1.8 de alto/.2 de radio: parámetros de prueba, no escala humana medida del edificio.
- Hay rayos de suelo ordinario cerca de Y−1.8/−1.75 y suelo elevado de recepción cerca de−1.55; no forzar todo a un plano único. OBJ usa las alturas de muestras existentes (pueden incluir clearance de.05), no un nivel arquitectónico inventado.
- C tiene ancla de superficie de mesa aproximadamente Y−.6; sus sillas tienen otras alturas. No interpretar estas anclas como centros de volumen. Altura del techo y dimensiones completas de muebles: desconocidas.

## Correspondencia funcional definitiva

Orden confirmado del operador: **mesa negra junto al muro vegetal → A → B → C → D**. No hay grupo E ni C de staff en el contrato espacial vigente. Las decisiones antiguas A–E se conservan en historia pero no deben guiar esta reconstrucción.

| Elemento | Referencia existente | Interpretación |
|---|---|---|
| A | annotation0, `A`, annotation-0 | Oficina privada completa, seis posiciones lógicas A-INTERNAL-1..6, sin coordenadas individuales verificadas |
| B | annotation2, `B`, annotation-2 | Oficina privada completa, seis posiciones lógicas B-INTERNAL-1..6, sin coordenadas individuales verificadas |
| C | C/ZONE-C, C1..C6 | Grupo de seis puestos individuales con superficies de sillas verificadas |
| D | D/ZONE-D, D1..D6 | Segundo grupo público, seis puestos verificados |
| Mesa negra | annotation1/MEETING-AREA-01/annotation-1 | Mesa de reuniones; título original dice8personas, sin contar de nuevo todos sus asientos |
| Muro vegetal | annotation3/annotation-3 “Fito Wall” | Punto original; no plano, altura ni ancho de muro |
| Dos sillas negras | RECEPTION | Sector con ancla revisada. No posición medida de pantalla/kiosco ni de cada silla |
| Espera | WAITING-AREA | Tres sillas claras por evidencia visual existente; ancla grupal |
| Booths/pods | REST-AREA | Grupo localizado; número/contornos/orientaciones individuales no verificados. No inventar4pods por una estimación histórica |
| Recreación | handoff:unmapped:recreation | No existe delimitación geométrica independiente verificada |
| Pasillo | CIRCULATION-01 | Muestras/rutas reales; no polígono completo de circulación |
| Acceso | ACCESS-01 | Entidad lógica de ensayo, sin correspondencia física calibrada con puerta |

`CAM-01..04` se derivan de cámaras de las anotaciones originales. `CAM-ROUTE-1/2` reutilizan las poses de inspección indicadas en bootstrap. Ninguna es prueba de cámara CCTV instalada físicamente. Las demás cámaras lógicas CAM-05/06/RECEPTION no tienen pose geométrica verificada: no situarlas por conveniencia. Los bookmarks son vistas, no objetos adicionales.

El inventario utiliza IDs existentes en provision/bootstrap/calibración. Los identificadores `handoff:unmapped:*` son marcadores de trabajo de esta entrega, explícitamente **no entidades Core**. Los dos OBSERVED-WORKGROUP son referencias de evidencia de C/D, sin duplicar capacidad. Las relaciones `referenceFor` de entrega son correspondencias de anotación, no nuevas relaciones operativas que se hayan escrito en Core.

## Qué se extrajo y qué no puede reconstruirse automáticamente

Se extrajeron todos los puntos/cámaras/anotaciones estructurados de las fuentes indicadas, la cuadrícula navegable y sus alturas, bounds y anclas de mobiliario. En C/D se calcula la envolvente entre seis anclas de silla como **dispersión de muestras**, nunca como tamaño de mesa/oficina. Dimensiones/orientaciones de muebles quedan null cuando no hay medida existente; no se producen estimaciones visuales nuevas.

Las paredes, techo, columnas, ventanas y mobiliario forman parte de la ocupación/escena original, pero **no existe segmentación semántica ni malla individual de esos componentes en los datos estructurados disponibles**. No hay información suficiente para entregar dimensiones por columna, marcos de ventana, espesores, puertas, orientación de cada silla o caras ocultas. El agente Blender puede usar los voxels y capturas como referencia y modelar esas piezas, registrando sus nuevas mediciones como trabajo posterior. No debe llamar “recuperación exacta” a esa reconstrucción.

El OBJ omite celdas con aristas bloqueadas, muestras faltantes o salto de altura mayor a.1. Es una representación simplificada reproducible de evidencia, no sustitución del escenario ni navmesh final. No se completaron accesos ni se repararon huecos usando geometría inventada. El trabajo interactivo no publicado del otro checkout no se adopta como nueva medición validada.

## Reproducir y comprobar sin red ni servicios

Desde la raíz:

```bash
python scripts/spatial-simulation/extract-handoff.py
```

Solo biblioteca estándar Python. Lee los archivos versionados y reescribe exclusivamente los tres artefactos de datos/OBJ de esta carpeta. Valida IDs únicos, doce puestos C/D y referencias internas; añade hashesSHA256 de fuentes. No llama a Core ni consulta servicios. Para nuevas mediciones, reutilizar `scripts/phase09/measure-office-navigation.mjs`, `calibrate-floor.mjs`, `survey-office.mjs` y collider oficial del SDK fijado; esos procedimientos requieren sus dependencias y no se volvieron a ejecutar aquí.

Resultado ejecutado:56entradas,7anotaciones,16.709vértices,29.526triángulos; IDs únicos y referencias internas válidas. Esta validación es estructural y de reproducción de evidencia existente; no nueva validación visual, láser ni métrica. No se abrió Blender ni se acredita importación visual en él.

## Secuencia de traspaso

1. Revisar capturas originales y el mapa de anotaciones; conservar una colección de referencias sin editar.
2. Importar OBJ como guía parcial, aplicar una sola conversión de ejes y comprobar A/B/C/D contra sus anclas.
3. Modelar piezas editables en colecciones separadas, conservando stableID original y asset/version/frame. No asociar automáticamente hueco de suelo a puerta.
4. Mantener desconocidos los componentes no medidos hasta medirlos; documentar cada nueva aproximación.
5. Integrar posteriormente mediante contratos Core por sede; consultar la auditoría backend antes de conectar simulación. Esta entrega no autoriza construir otra lógica de reservas ni otra DB.
