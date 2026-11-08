# Revisión arquitectónica — Fase04-R1

**Maestro:** [office-phase04-revision.blend](../../simulation/spatial-office/output/office-phase04-revision.blend).

Cuatro mesas y catorce sillas de comedor, más cuatro taburetes; sillas blancas de visita sustituidas por dos sofás; lounge equipado; pantalla grande de reuniones; baño y cabinas identificados.

**Gate:** 678 comprobaciones / 21 recorridos. **71 luces en 17 circuitos**, luz de trabajo a 3200 K y acentos a 2700 K; 135 piezas de vidrio con reflexión/transmisión. Arquitectura y posiciones heredadas conservadas. [Plano con baño/cabinas](evidence/phase04-revision/layout-with-ids.svg) · [Informe](PHASE-04-REVISION-REPORT.md).

Las imágenes siguientes son renders reales de este maestro, con filtrado OIDN y pases de albedo/normales. Las referencias del operador son objetivos visuales; nunca sustituyen capturas. Aceptación humana pendiente.

**Galería en actualización: se añaden las capturas conforme terminan. La entrega visual completa sigue en proceso.**

## Lounge: mobiliario y luz indirecta

![Lounge: mobiliario y luz indirecta](evidence/phase04-revision/renders/denoised/lounge.png)

[Original Cycles sin filtrar](evidence/phase04-revision/renders/lounge.png) · hora 12:00 · [1440, 960] · hasta 96 muestras.

## Jardín vertical: cobertura completa

![Jardín vertical: cobertura completa](evidence/phase04-revision/renders/denoised/vertical-garden.png)

[Original Cycles sin filtrar](evidence/phase04-revision/renders/vertical-garden.png) · hora 12:00 · [1440, 960] · hasta 96 muestras.

## Jardín vertical a escala cercana

![Jardín vertical a escala cercana](evidence/phase04-revision/renders/denoised/garden-detail.png)

[Original Cycles sin filtrar](evidence/phase04-revision/renders/garden-detail.png) · hora 12:00 · [1440, 960] · hasta 96 muestras.

## Puestos: vidrio, equipos y jardineras

![Puestos: vidrio, equipos y jardineras](evidence/phase04-revision/renders/denoised/office.png)

[Original Cycles sin filtrar](evidence/phase04-revision/renders/office.png) · hora 12:00 · [1440, 960] · hasta 96 muestras.

## Equipos a escala cercana

![Equipos a escala cercana](evidence/phase04-revision/renders/denoised/computer-detail.png)

[Original Cycles sin filtrar](evidence/phase04-revision/renders/computer-detail.png) · hora 12:00 · [1440, 960] · hasta 96 muestras.

## Mamparas: reflexión a ángulo oblicuo

![Mamparas: reflexión a ángulo oblicuo](evidence/phase04-revision/renders/denoised/glass-detail.png)

[Original Cycles sin filtrar](evidence/phase04-revision/renders/glass-detail.png) · hora 12:00 · [1440, 960] · hasta 96 muestras.

## Objetivos visuales proporcionados por el operador

| Lounge | Puestos | Recepción |
|---|---|---|
| ![Objetivo lounge](references/1290-lounge-target.jpg) | ![Objetivo puestos](references/1288-office-target.jpg) | ![Objetivo recepción](references/1286-reception-target.jpg) |

Revisar textura, diseño de luz cálida, reflejos del vidrio y detalle a escala humana. Son referencias de calidad, no evidencia de la escena ejecutada.

Modelos y texturas profesionales: [atribución, licencias y modificaciones](../../simulation/spatial-office/assets/archviz/ASSETS-NOTICE.md).

Para abrir los controles locales, ejecutar el texto **START ENTITY visual controls** dentro del maestro en el checkout. La integración PlayCanvas y la exportación arquitectónica definitiva siguen pendientes de autorización tras esta revisión.
