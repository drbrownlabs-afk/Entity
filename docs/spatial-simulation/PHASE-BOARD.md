## Estado vigente — P2-09

**P2-09.1–09.9: ejecución técnica completada, EN VALIDACIÓN (2026-11-09).** Rama exclusiva codex/spatial-simulation; autonomía autorizada por el operador, cada gate ejecutado antes de avanzar. Pipeline real de píxeles simulados→YOLOX-S CPU→Norfair→OSNet-AIN→P1 HTTP/SQLite→P2.6 cámaras convencionales calibradas (hipótesis inicial de panorámicas contrastada),246 imágenes/20s,89 detecciones IoU.50,8Tracks anónimos y5 relaciones provisionales persistidas;0 nuevasPerson/identidades civiles. Run p2-09-vision en el mismo Core/sede,470 entidades incluyendo14Person previas (12demo+2históricas); onboarding intacto. Repetición251 duplicados sin nuevos efectos; reinicioP1 y frontend real desktop/táctil con latencia pasan.110 testsAPI,10Edge,15 frontendP1 y11 lógicaP2 PASS. Maestro/4514 registros originales intactos.

En este único recorrido:39/39 instantes visibles detectados en alguna vista y cubiertos por hipótesis principal que cruza4 cámaras. Límites materiales: recall porvista53.94%,3 fragmentaciones extra, cámara05 recortada/06 lejana; sin validación multipersona, identidadcivil o instalaciónfísica. Pipelinebatch CPU3.82 imágenes/s agregadas (~.64FPS/cámara equivalente), no sostiene2FPS simultáneos por cada fuente; render/UI móvil físico yGPU no certificados. Captura cacheada de ensayo sin posprocesado/sombrasdinámicas, perfil arquitectónico original preservado. CoreHTTPS público no configurado: Pages ofrece escena/grabaciones, no backend/SQLite. RTSP/ONVIF/VMS, reconstrucciónRGB3D, personajes definitivos06/07 yP3 quedan diferidos. Fase10 NO iniciada. Evidencia: docs/spatial-simulation/evidence/p2-09/09.9/integrated.json; ejecución registrada enAGENT-WORKLOG. No aceptación humana automática.

---

Cronología anterior conservada; los estados siguientes son históricos cuando contradigan la actualización vigente de arriba.

**Estado vigente:** Fase04-R1 APROBADA por el operador («Fase 4 aprobada, continúa fase 5»). Maestro SHA256 `ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f`. Fase05 EN CURSO: exportación y visor PlayCanvas aislado. Fase06 pendiente de autorización posterior.

**Estado actual R1:** maestro `office-phase04-revision.blend`; 678 comprobaciones y 21 rutas verificadas. Jardín vertical continuo, luz cálida y vidrio reflectivo. Renders de revisión en ejecución; aceptación humana pendiente. [Galería](REVIEW-PHASE04-REVISION.md).

# Tablero del laboratorio espacial

Base: `a037bb8fcf9e90e510e364edf00452611a8faed8`, rama `codex/spatial-simulation`.
Este tablero pertenece al plan espacial de seis fases, no a las fases históricas de Core.
Se mantiene bajo la carpeta autorizada para conservar intactos los documentos y artefactos de la base.

| Fase | Estado | Gate y evidencia |
|---|---|---|
| 01 — arquitectura y mobiliario original | EN VALIDACIÓN | Cinco pruebas offline y 99 comprobaciones de reapertura PASS; diez renders Cycles inspeccionados y vinculados al hash final. Gate técnico verificado con limitaciones explícitas; aceptación humana pendiente. [Informe](PHASE-01-REPORT.md), [gate](evidence/phase01/gate.json). |
| 02 — arquitectura funcional, accesos y equipamiento | NO INICIADA | Requiere aceptación de Fase 01. Mamparas, Sala E, cafetería, puertas y cuatro TVs pendientes. |
| 03 — materiales, luces y dispositivos | NO INICIADA | Render de referencia de Fase 01 no acredita luminarias/circuitos operables. |
| 04 — PlayCanvas, navegación e interacción | NO INICIADA | Sin aplicación runtime nueva ni prueba de navegador de esa aplicación. |
| 05 — personajes y posesión | NO INICIADA | Sin rig, personajes ni controlador nuevos. |
| 06 — integración y aceptación | NO INICIADA | Sin adaptador Core nuevo ni aceptación integral. |

`AGENTS.md`, sección «Phase-driven execution (authoritative)», exige “present evidence and stop for human review before advancing” y “never self-approve a phase”. La excepción explícita para 09.1–09.9 no se aplica automáticamente a las seis fases del nuevo plan. La presente entrega no aprueba fases ni modifica la autorización histórica de Core.

## Corrección del operador posterior a la entrega inicial

La planta rectangular queda sustituida por una reconstrucción en L en el maestro `office-cafe-L.blend`. Revisión de Fase 01 reabierta por topología; cafetería de Fase 02 implementada como incremento expresamente solicitado (mesas normales, barra, equipamiento y retirada de pods solo en el diseño nuevo). El resto de Fase 02 permanece pendiente. Referencias visuales recibidas: 1212/1211. Ver [CAFE-L-CORRECTION.md](CAFE-L-CORRECTION.md); no se concede aprobación humana automática.

## Precisión del operador — mesa adicional al fondo

El operador recuerda que solicitó una mesa/agrupación de trabajo adicional al fondo. Corresponde a **Sala E, Fase 02**, ya prevista en IMPLEMENTATION-PLAN.md: nueva agrupación de mesas con mamparas de la misma familia y circulación viable. La ubicación al fondo queda como restricción explícita del operador para ese incremento; registrar posición estimada y comprobar acceso/separación de cafetería, mobiliario y columnas antes de validar el gate. Las dos mesas redondas de la cafetería **no sustituyen** esta agrupación adicional. Inspección del inventario actual: A–D conservadas; Sala E todavía no modelada. Esta revisión documental no acredita implementación ni pruebas geométricas de E.

## Fase 02 — ejecución autorizada posteriormente

| Fase | Estado actual | Evidencia |
|---|---|---|
| 02 | EN VALIDACIÓN | Orden explícita del operador para continuar. A–E/reuniones con mamparas y acceso, agrupación E nueva al fondo, recepción/espera, cafetería sin pods, rampa, siete puertas simuladas y cuatro TVs. 293 comprobaciones PASS, diez rutas. [Informe](PHASE-02-REPORT.md). Revisión visual/aceptación humana final, sin autoaprobar. |
| 03 | NO INICIADA | Materiales/circuitos y control de luces con verificación PlayCanvas, tras revisión de Fase02. |

Esta entrada sustituye los estados anteriores «Fase02 pendiente» y «solo cafetería». Conserva el historial y no atribuye aprobación humana a ninguna verificación automática.

## Tablero vigente — plan actualizado del operador

| Fase espacial | Estado actual | Evidencia |
|---|---|---|
| 02 — arquitectura funcional | VERIFICADA INTERNAMENTE | 295 comprobaciones, diez rutas, A–E/reuniones, puertas, TVs y semántica recepción blanca/espera negra corregida |
| 03 — tercera ala / C | VERIFICADA INTERNAMENTE | 644 comprobaciones, dieciséis rutas, lounge, dos cabinas, baños, ocho lockers, impresión; 19 puertas en total |
| 04 — material/luz/tiempo | EN VALIDACIÓN DEL OPERADOR | 486 comprobaciones; 54 luminarias/17 circuitos; 08/12/16/20; luces ON/OFF/individual; cinco swatches PBR y diez pares de renders. [Revisión](REVIEW-PHASE04.md) |
| 05 — PlayCanvas | BLOQUEADA POR APROBACIÓN PREVIA | No iniciar implementación ni exportación arquitectónica definitiva hasta aprobación explícita tras Fase04 |
| 06 — humanos Mixamo / NPCs | NO AUTORIZADA TODAVÍA | Acceso interactivo futuro registrado en el plan; no se inició sesión ni se descargaron modelos |
| 07 — integración/aceptación | PENDIENTE | Según plan vigente |

Esta secuencia sustituye la numeración antigua de seis fases y la pausa que antes se aplicaba entre 02–04. No equivale a aprobación humana. La excepción de autonomía se toma del plan actualizado por el operador, preservado en la rama; no se extiende a modificar Core/frontend/Gaussian o fusionar ramas.

## Fase04-R1 · refinamiento solicitado

- Modelo/materiales/mobiliario: implementados en maestro separado.
- Gate geométrico/controles: 656 PASS, 21 rutas.
- Capturas finales/comparación con1290/1288/1286: EN CURSO.
- Aceptación premium humana: PENDIENTE.
- PlayCanvas05/Mixamo06: NO INICIADOS.

### Actualización posterior — luz cálida y vidrio

Maestro R1 actual: e1dc0225fd957c55d38c06ca785667b70d50e544744d68d0477796aac0058e03. Gate 676 PASS / 21 rutas. 71 luminarias/17 circuitos (3200 K trabajo, 2700 K acentos), 135 piezas de vidrio con reflexión/transmisión, treinta equipos detallados. [Revisión](REVIEW-PHASE04-REVISION.md). Capturas finales EN CURSO; no aceptación humana ni PlayCanvas. La entrega base y los archivos originales siguen intactos.

### Candidato con jardín vertical completo

Última petición: cobertura vegetal continua como el Gaussian. Vista original front-return.jpg inspeccionada; fuente intacta. Maestro R1 ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f, 678 PASS / 21 rutas, 2170 grupos vegetales pequeños instanciados, 71 luminarias/17 circuitos y 135 piezas de vidrio. [Galería](REVIEW-PHASE04-REVISION.md) y [plano](evidence/phase04-revision/layout-with-ids.svg). Borradores actuales disponibles; renders de revisión en ejecución. No aceptación humana ni inicio de PlayCanvas.

## Orden vigente del operador — 2026-11-09

Fase04.5: trabajos pendientes cancelados por prioridad funcional; no aprobada. Fase05: Walk Mode de clic/toque implementado, pruebas Node PASS y navegador en validación. Publicación desde codex/spatial-simulation bloqueada por política del entorno GitHub Pages (run42554503726); no afirmar URL pública funcional. Fase06 BLOQUEADA hasta revisión y aprobación personal de Fase05 en navegador; esta orden posterior sustituye la autorización previa 06→07 para esta tarea.

### Resultado funcional final — 2026-11-09

Once pruebas Node PASS, incluidas 21 rutas aprobadas y activación táctil sin duplicados/scroll/teclado/inputs. Build Vite PASS. Chromium: **21 comprobaciones PASS**, ratón y toque nativo en viewport móvil; rutas, mirada libre, TV, puertas, luces y vista general; sin errores de navegador ni recursos fallidos. Render desactivado solamente en el harness funcional, sin acreditar calidad visual o FPS móvil físico. Evidencias en `evidence/phase05-walk/`. GitHub Pages permanece BLOQUEADO por protección del entorno, sin URL nueva verificada. Requiere permitir `codex/spatial-simulation` en `github-pages`; no se modificó main/gh-pages. Fase05 EN REVISIÓN, no aprobada; Fase06 bloqueada.

## Orden más reciente — P2-06 (2026-11-09)

El operador dice «Fase 6»: autorización explícita para iniciar personajes; sustituye la prohibición anterior de comenzar 06, sin inferir aprobación de calidad ni despliegue 05. Inventario de 12 personajes/roles de animación preparado; sin recursos Mixamo descargados. Bloqueo de acceso interactivo documentado en evidence/phase06/access.json; no afirmar navegador abierto ni autenticación. Gate06 ABIERTO, Fase07 no iniciada. No dummies, sustituciones o duplicación de Core.

## 2026-11-09 — Orden vigente: P2-08 y retirada Mall

06/07 pendientes hasta mañana; no Mixamo/avatares/animaciones. P2-08 implementada y probada con P1 local real (memoria, eventos, estados, relaciones, mapa espacial, frontend y reinicio). 17 ubicaciones + dos personas lógicas placeholders sin identidad/presencia real. Mall retirado del sitio público: workflow42563938970 SUCCESS, historial/fuentes conservados. Core público HTTPS no desplegado/configurado; el estático exige conexión explícita a API autorizada. P2-08 EN VALIDACIÓN, no autoaprobada. Evidencias: phase08.

## Estado vigente — addendum8.1/8.2/8.2.1

P2-08 EN VALIDACIÓN:66 entidades/146 relaciones en P1 local; raíz Coworking con identidad/estado/memoria;12 personas lógicas, organizaciones, catálogo y planes sintéticos.30 referencias a escena existente.7 pruebas estructurales,5 compatibilidad de identidad, reinicio HTTP y reimportación0 cambios PASS. Funcionalidad previa conservada; no nuevos flujos operativos ni pagos/check-ins/confirmaciones, reservas o cámaras. CoreHTTPS público pendiente; sin aceptación humana.06/07 pendientes hasta mañana;09 NO iniciada. Evidencia vigente: phase08/structural.

### Precisión8.3 — estado final de esta entrega

66 entidades/146 relaciones activas;12 personas de demo, Daniel reutiliza visitante12.8 tests estructurales PASS. Guion preparado exclusivamente dentro del simulador, no ejecutado: sin avatares, outputsCore, cámaras, detecciones, MOT/MTMC-ReID ni check-ins. Escenarios8.2 declarativos futuros, memoria/IDs/grafo persistentes reales P1 local. Funciones anteriores conservadas, sin operaciones nuevas ni09.06/07 pendientes hasta mañana. P2-08 EN VALIDACIÓN, no aprobada.

## Estado vigente — 8.4

**Estado verificado P2-08 (addendum8.4, 2026-11-09):**460 entidades de alcance/1185 relaciones en P1 Core local real;12 personas de demo y dos identidades técnicas históricas adicionales preservadas. Inventario digital, ocho cámaras previstas sin feeds/calibración,101 tipos de catálogo de cardinalidad desconocida, operadora sin identificar y servicios futuros sin conexiones.290 mapeos PlayCanvas verificados;18 tests de regresión/infraestructura PASS y suite nueva5 PASS; reimportación0 cambios, reinicio HTTP PASS. Geometría/maestro intactos. Sin operaciones, proveedores, percepción, personajes ni09. Core HTTPS público pendiente.06/07 pendientes; P2-08 EN VALIDACIÓN, no aprobada. Evidencia: docs/spatial-simulation/evidence/phase08/infrastructure. Sustituye los conteos históricos de8.1–8.3, no sus evidencias.
