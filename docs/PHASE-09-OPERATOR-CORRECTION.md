# Fase 09 — corrección vinculante del operador

## Rechazo de la demo publicada
El operador observa que https://drbrownlabs-afk.github.io/Entity/office.html presenta la interfaz y anotaciones de SuperSplat, sin cámaras, personajes ni entidades visibles. No es una demostración aprobada de ENTITY. Las pruebas anteriores de carga no prueban la experiencia integrada.

## Inventario definitivo
**Exactamente cuatro conjuntos de mesas A/B/C/D. A y B son oficinas privadas completas. C y D son conjuntos públicos de puestos individuales.** No existe E ni conjunto interno de staff C. Esta decisión reemplaza la anterior sobre A/B privadas, C staff, D/E públicas. Determinar puestos por asientos realmente visibles sin inventar cantidad. Migrar recursos y reservas con compatibilidad histórica; no borrar datos persistentes ni cambiar IDs silenciosamente.

## Implementación obligatoria
- Eliminar de la experiencia pública toda interfaz, botones, ayuda, retícula y anotaciones de SuperSplat. SSOG, voxels y SDK pueden permanecer como motor interno; herramientas de inspección solo bajo modo diagnóstico explícito.
- Mostrar interfaz propia ENTITY: cámaras CCTV operables y visibles, personajes 3D conectados a Person/Track, fichas de entidades, selección, estado, timeline y operaciones.
- Revisar `apps/web/src/office/main.js`: importa `@playcanvas/supersplat-viewer/viewer.css`, ejecuta `createViewer(..., ui:true, reticle:true)`, agrega anotaciones y crea un panel de inventario visible. Investigar `operations.js` y `visuals.js`: su importación no demuestra que haya render real.
- Corregir inventario en `services/entity-api/app/office/provision.py`, `scripts/bootstrap-office.py`, perfiles de simulación, permisos, reservas, API, frontend y tests.
- Si GitHub Pages no tiene Core remoto HTTPS, presentar explícitamente una demo sintética coherente y operativa o conectar un Core de pruebas; nunca fingir conexión.
- Probar en URL pública, desktop y móvil: sin UI SuperSplat, con personas/cámaras/entidades efectivamente visibles, navegación y selección sincronizadas, cuatro conjuntos correctos, recepción/reservas/memoria funcionales. Adjuntar capturas verificables y E2E.

**Estado:** corrección registrada; implementación y pruebas pendientes. No declarar Fase 09 completada.
