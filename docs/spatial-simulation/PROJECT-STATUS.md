**Estado vigente:** Fase04-R1 APROBADA por el operador («Fase 4 aprobada, continúa fase 5»). Maestro SHA256 `ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f`. Fase05 EN CURSO: exportación y visor PlayCanvas aislado. Fase06 pendiente de autorización posterior.

**Estado actual R1:** maestro `office-phase04-revision.blend`; 678 comprobaciones y 21 rutas verificadas. Jardín vertical continuo, luz cálida y vidrio reflectivo. Renders de revisión en ejecución; aceptación humana pendiente. [Galería](REVIEW-PHASE04-REVISION.md).

# Estado del escenario espacial nuevo

2026-11-08. Rama `codex/spatial-simulation`, base `a037bb8`.

Implementado en esta entrega: construcción reproducible de un maestro Blender de Fase 01, suelo parcial de referencia intacto, geometría independiente por ambiente/tipo, anclas originales, inventario de objetos, cámaras de inspección y validación de reapertura. Reconstrucción aproximada, no levantamiento exacto. No es una aplicación operativa de PlayCanvas ni una instalación física.

Ejecución comprobada: Blender 4.3.2/Cycles CPU y Python 3.12.14 instalados en la instancia; cinco pruebas de fuentes PASS; 99 comprobaciones de reapertura PASS; diez renders finales examinados. Gate técnico verificado con limitaciones de reconstrucción/materiales documentadas y hashes actuales, en [gate.json](evidence/phase01/gate.json) e [informe](PHASE-01-REPORT.md). Estado: EN VALIDACIÓN, aceptación humana pendiente.

Integridad: todos los archivos versionados de la base tienen snapshot SHA256; la validación compara su contenido actual. No se modifica backend, frontend anterior, Gaussian, voxels, evidencias previas, handoff ni extractor. El registro de trabajo/decisiones nuevo vive en esta carpeta para respetar el aislamiento del plan.

Entorno reutilizable: no hicieron falta instalaciones ni credenciales para el flujo Blender. Lectura de borrador falló dos veces con `INVALID_ARGUMENT`; guardado de `start_skill` no confirmado por el servicio. Las instrucciones sí están en `simulation/spatial-office/README.md`; no se afirma publicación del entorno ni validación en una instancia nueva.

Pendiente: aceptación de Fase 01 y las fases 02–06 completas. No se declara que el plan esté terminado. La fuente original no tiene malla segmentada; los contornos, dimensiones, caras ocultas y el número de pods desconocidos no se convierten en datos medidos. Las referencias adicionales de mamparas/cafetería mencionadas por el plan no están adjuntas en esta sesión; no se afirma coincidencia exacta con ellas.

## Corrección posterior del operador — cafetería y L

Se reabre la revisión de topología: el rectángulo de la primera entrega era incompleto. El maestro actualizado es `simulation/spatial-office/output/office-cafe-L.blend`, con brazo posterior en el sector de pods y cafetería con mesas normales. Dimensiones del brazo estimadas; forma y destino indicados por el operador. Las referencias 1212/1211 ya se recibieron y se registraron con hashes; la mención anterior a referencias ausentes es histórica. Ver [corrección y pruebas](CAFE-L-CORRECTION.md). Fase 02 tiene únicamente este incremento autorizado en curso de validación; no se aprueba el gate integral ni se presume aceptación de Fase 01.

## Fase 02 autorizada e implementada — 2026-11-08

La orden posterior «continúa con la fase dos» autoriza el incremento completo de arquitectura funcional. Maestro actual: `office-phase02.blend`; [informe](PHASE-02-REPORT.md). A–E y reuniones cerrados con vidrio/perfiles negros y puertas; E nueva detrás de D con seis posiciones, cafetería en L preservada, recepción/espera ampliadas, rampa, cuatro TVs y siete puertas con pivote/hoja/colisionador sincronizados. Ampliación posterior propuesta para E declarada como estimación. 293 comprobaciones PASS y diez rutas geométricas comprobadas; capturas y revisión visual se registran en evidencia phase02. Estado EN VALIDACIÓN, no aceptación humana ni inicio de Fase03. La mención previa a E «pendiente de modelar» queda sustituida por esta implementación.

## Estado vigente tras sincronizar el plan del operador — 2026-11-08

La actualización remota 8490e1a corrige recepción/espera, añade la tercera ala en C y autoriza avanzar 02→03→04 sin pedir aprobación intermedia. d51e2b9 añade únicamente el acceso interactivo futuro a Mixamo y mantiene el bloqueo tras Fase04; no se inicia login ni descarga. Se conserva el plan, sin merge ni sobrescritura.

Maestro actual **office-phase04.blend**. Fase02: 295 comprobaciones y diez rutas; Fase03: 644 comprobaciones y dieciséis rutas; Fase04: 486 comprobaciones, 54 luminarias/17 circuitos, 19 puertas, ocho lockers y cinco pantallas. Cinco swatches PBR exportados/reimportados de forma aislada; ningún GLB arquitectónico definitivo ni PlayCanvas nuevo. Diez renders de aprobación y diez copias OIDN, con originales/hashes preservados. [Revisión completa](REVIEW-PHASE04.md).

Fase04 **EN VALIDACIÓN DEL OPERADOR**. Fases05/06 bloqueadas hasta sus autorizaciones. Recepción vigente en sillas blancas y espera con sofá en sector de negras; los IDs del handoff conservan su procedencia histórica. L inicial queda como etapa intermedia, sustituida por la C del maestro actual.

577 archivos originales intactos; el único archivo del snapshot inicial actualizado externamente es el plan del operador, validado por revisión y SHA exactos en evidence/upstream-revisions.json. Backend/frontend/Gaussian/handoff y evidencias originales sin cambios. Borrador de entorno no confirmado (`INVALID_ARGUMENT`); setup reproducible sí está en Git, sin afirmar publicación de snapshot ni instancia nueva probada.

## Revisión actual del operador — Fase04-R1

Se conserva la entrega anterior y se añade `office-phase04-revision.blend` con mobiliario profesional y acabados PBR, sin mover arquitectura ni mesas/asientos heredados. Cuatro mesas y catorce sillas de comedor (+ cuatro taburetes), sillas blancas sustituidas por dos sofás, lounge equipado, TV de reuniones, WC señalizado/equipado y cabinas mantenidas. Gate geométrico y controles: 656 PASS / 21 rutas. Render/revisión visual premium EN CURSO, basado en referencias del operador1290/1288/1286; no aprobación automática. [Informe R1](PHASE-04-REVISION-REPORT.md). No se inicia Fase05.

### Actualización posterior — luz cálida y vidrio

Maestro R1 actual: e1dc0225fd957c55d38c06ca785667b70d50e544744d68d0477796aac0058e03. Gate 676 PASS / 21 rutas. 71 luminarias/17 circuitos (3200 K trabajo, 2700 K acentos), 135 piezas de vidrio con reflexión/transmisión, treinta equipos detallados. [Revisión](REVIEW-PHASE04-REVISION.md). Capturas finales EN CURSO; no aceptación humana ni PlayCanvas. La entrega base y los archivos originales siguen intactos.

### Candidato con jardín vertical completo

Última petición: cobertura vegetal continua como el Gaussian. Vista original front-return.jpg inspeccionada; fuente intacta. Maestro R1 ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f, 678 PASS / 21 rutas, 2170 grupos vegetales pequeños instanciados, 71 luminarias/17 circuitos y 135 piezas de vidrio. [Galería](REVIEW-PHASE04-REVISION.md) y [plano](evidence/phase04-revision/layout-with-ids.svg). Borradores actuales disponibles; renders de revisión en ejecución. No aceptación humana ni inicio de PlayCanvas.

## Estado vigente — Fase04.5, revisión individual Blender (2026-11-09)

Fase04-R1 fue aprobada posteriormente por el operador; la Fase05 existente está cuestionada por pérdida visual al transferir a PlayCanvas. La Fase04.5 permanece abierta. La orden vigente exige una sola imagen Blender de calidad para revisión humana antes de renderizar otros ambientes o continuar calibración PlayCanvas. El render individual está en ejecución; no se declara entregado ni aceptado. Perfil máximo preservado, sin optimización móvil. Maestro R1 y recursos originales intactos. [Progreso vigente](PHASE-04-5-PROGRESS.md).

## Prioridad vigente — Fase05 funcional (2026-11-09)

Cancelados los trabajos pendientes de 04.5 por orden del operador. Walk Mode clic/toque integrado en el visor existente (A*, colisiones, puertas dinámicas, mirada libre y selección independiente), sin joystick/flechas. Diez pruebas Node y build PASS; evidencia de navegador en validación. Publicación intentada exclusivamente desde la rama de trabajo; GitHub la rechaza porque `github-pages` no admite codex/spatial-simulation. Sin modificaciones a main ni a gh-pages. Fase06 no iniciada y bloqueada hasta revisión personal de Fase05. Ver [informe](PHASE-05-WALK.md).

### Resultado funcional final — 2026-11-09

Once pruebas Node PASS, incluidas 21 rutas aprobadas y activación táctil sin duplicados/scroll/teclado/inputs. Build Vite PASS. Chromium: **21 comprobaciones PASS**, ratón y toque nativo en viewport móvil; rutas, mirada libre, TV, puertas, luces y vista general; sin errores de navegador ni recursos fallidos. Render desactivado solamente en el harness funcional, sin acreditar calidad visual o FPS móvil físico. Evidencias en `evidence/phase05-walk/`. GitHub Pages permanece BLOQUEADO por protección del entorno, sin URL nueva verificada. Requiere permitir `codex/spatial-simulation` en `github-pages`; no se modificó main/gh-pages. Fase05 EN REVISIÓN, no aprobada; Fase06 bloqueada.
