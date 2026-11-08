# Estado del escenario espacial nuevo

2026-11-08. Rama `codex/spatial-simulation`, base `a037bb8`.

Implementado en esta entrega: construcción reproducible de un maestro Blender de Fase 01, suelo parcial de referencia intacto, geometría independiente por ambiente/tipo, anclas originales, inventario de objetos, cámaras de inspección y validación de reapertura. Reconstrucción aproximada, no levantamiento exacto. No es una aplicación operativa de PlayCanvas ni una instalación física.

Ejecución comprobada: Blender 4.3.2/Cycles CPU y Python 3.12.14 instalados en la instancia; cinco pruebas de fuentes PASS; 99 comprobaciones de reapertura PASS; diez renders finales examinados. Gate técnico verificado con limitaciones de reconstrucción/materiales documentadas y hashes actuales, en [gate.json](evidence/phase01/gate.json) e [informe](PHASE-01-REPORT.md). Estado: EN VALIDACIÓN, aceptación humana pendiente.

Integridad: todos los archivos versionados de la base tienen snapshot SHA256; la validación compara su contenido actual. No se modifica backend, frontend anterior, Gaussian, voxels, evidencias previas, handoff ni extractor. El registro de trabajo/decisiones nuevo vive en esta carpeta para respetar el aislamiento del plan.

Entorno reutilizable: no hicieron falta instalaciones ni credenciales para el flujo Blender. Lectura de borrador falló dos veces con `INVALID_ARGUMENT`; guardado de `start_skill` no confirmado por el servicio. Las instrucciones sí están en `simulation/spatial-office/README.md`; no se afirma publicación del entorno ni validación en una instancia nueva.

Pendiente: aceptación de Fase 01 y las fases 02–06 completas. No se declara que el plan esté terminado. La fuente original no tiene malla segmentada; los contornos, dimensiones, caras ocultas y el número de pods desconocidos no se convierten en datos medidos. Las referencias adicionales de mamparas/cafetería mencionadas por el plan no están adjuntas en esta sesión; no se afirma coincidencia exacta con ellas.

## Corrección posterior del operador — cafetería y L

Se reabre la revisión de topología: el rectángulo de la primera entrega era incompleto. El maestro actualizado es `simulation/spatial-office/output/office-cafe-L.blend`, con brazo posterior en el sector de pods y cafetería con mesas normales. Dimensiones del brazo estimadas; forma y destino indicados por el operador. Las referencias 1212/1211 ya se recibieron y se registraron con hashes; la mención anterior a referencias ausentes es histórica. Ver [corrección y pruebas](CAFE-L-CORRECTION.md). Fase 02 tiene únicamente este incremento autorizado en curso de validación; no se aprueba el gate integral ni se presume aceptación de Fase 01.
