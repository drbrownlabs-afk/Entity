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
