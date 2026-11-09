# SNAPSHOT — ENTITY: arquitectura, memoria y simulación — 2026-11-08

- **ID:** ENTITY-SNAPSHOT-2026-11-08-ARQUITECTURA-MEMORIA
- **Tipo:** snapshot de contexto y decisiones, transversal a P1/P2/P3; **solicitado explícitamente por el operador**.
- **Fecha:** 2026-11-08 (día UTC; hora exacta no verificada).
- **Repositorio:** `drbrownlabs-afk/Entity`
- **Rama de origen:** `codex/spatial-simulation`
- **Commit base verificado por escritura previa:** `ae816d6e7cbbd0c7f61f31c6b57c524a5cd8e40b`.
- **Commit del manifiesto:** consultar el historial Git del archivo; el SHA exacto del commit que lo incorpora se entrega al operador después de verificar la escritura.
- **Canon aplicable:** `docs/ENTITY-MASTER-SPEC.md` en el commit base indicado.
- **Decisiones:** ADR-2026-11-08-001 y ADR-2026-11-08-002 en `docs/DECISION-LOG.md`.
- **Cobertura:** recuperación conceptual y documental de la conversación actual. No es checkpoint de runtime, dump de base de datos, copia de activos 3D ni auditoría completa del código.

## 1. Conceptos arquitectónicos que no deben confundirse

**ENTITY** es la plataforma/marca global; **ENTITY Spatial Intelligence** es la vertical actual. Es un producto SaaS centralizado en la nube, con Edge solo para tareas locales indispensables.

**Núcleo — motor universal de interoperabilidad propietario, separado de ENTITY Core.** Descubre sistemas y capacidades externas, interpreta APIs/SDK/protocolos, normaliza contratos de interfaces, mantiene catálogo semántico de capacidades y adaptadores, valida e invoca operaciones autorizadas. No es el Core, ni un mero paquete de conectores.

**ENTITY Core — modelo computable del mundo.** Mantiene entidades/identidades, estados, relaciones tipadas, eventos, memoria, capacidades, políticas de autorización, procedencia y API compartida. Es la representación operacional persistente, no la escena 3D.

**Entidadizador automático — motor propietario distinto de Núcleo y Core.** Reconoce qué representan los datos heterogéneos, resuelve correspondencias, asocia o crea entidades, normaliza atributos/estados/relaciones y preserva procedencia e incertidumbre. Normalizar interfaces (Núcleo) no equivale a entidadizar información.

**Constructor/generador de gemelos digitales — subsistema propietario.** Facilita producir representaciones espaciales tridimensionales vinculables a entidades a partir de fuentes geométricas compatibles, planos y modelos; no se afirma que exista reconstrucción universal automática implementada.

**ENTITY Spatial Simulation — laboratorio de experimentación preimplementación.** Permite ensayar espacios, personas, dispositivos, cámaras, reservas, accesos, fallos, flujos y sistemas empresariales antes del despliegue. Los escenarios sintéticos usan contratos compatibles con el mismo modelo computable; se separan datos sintéticos, ground truth, observación, inferencia y producción. No es solo una demo visual, ni reemplaza las integraciones reales.

**Relación funcional:** Núcleo descubre cómo operar sistemas; Entidadizador interpreta datos; Core sostiene el mundo computable; Constructor espacial crea su representación; Simulation experimenta con comportamientos y escenarios.

## 2. Procesos y límites

- **P1 — Software ENTITY:** línea original detenida por alcance en Fase 09. La aceptación técnica depende de pruebas/gates verificables, no solo del número de fase.
- **P2 — Gemelo digital operativo de coworking:** proceso activo, mucho más amplio que la escena Blender/PlayCanvas. Incluye humanos realistas, cámaras y percepción, seguridad, accesos, biometría, reservas, calendario, CRM, membresías, contratos, facturación, documentos/Drive, redes/IT, mantenimiento y operaciones. Las fases 01–07 son únicamente subproyecto 3D.
- **P3 — IA situada/multiagentes:** trabajo posterior, todavía no autorizado para implementación. OpenClaw es candidato a runtime, nunca sustituto del Core.
- **Spatial Simulation:** laboratorio con separación de desarrollo/aceptación respecto de la integración operativa; no se declara automáticamente como cuarto proceso global. Las antiguas fases globales 08–15 están revocadas; la antigua fase de cámaras corresponde a P2 y la de agentes a P3.

## 3. Arquitectura de memoria y recuperación

La memoria es **jerárquica**:
1. `docs/ENTITY-MASTER-SPEC.md` — canon vigente.
2. `docs/DECISION-LOG.md` — ADR y sustituciones.
3. `docs/PROJECT-STATUS.md` — estados de P1/P2/P3.
4. `docs/AGENT-WORKLOG.md` — historial/evidencia.
5. `AGENTS.md` — punto de entrada y procedimiento; no crea un canon paralelo.

**Orden de recuperación:** cuando el operador diga «entra en la memoria de GitHub» o equivalente, el agente debe localizar `drbrownlabs-afk/Entity`, abrir `AGENTS.md`, seguir el índice, leer canon/ADR, presentar selección de proceso si procede y reconstruir continuidad desde estado y evidencias. No pedir al operador que recuerde nombres, frases mágicas ni archivos. No suponer lectura automática de GitHub por una sesión nueva.

**Regla de autoridad:** canon aprobado > ADR vigente > estado comprobado > bitácora > notas históricas. Cambios canónicos requieren aprobación explícita.

## 4. Política de snapshots: exclusivamente bajo demanda

Un snapshot **solo se crea cuando el operador lo pide expresamente** («entra al repositorio y crea un snapshot» o equivalente). No hay generación automática, cron, triggers por fase ni iniciativa del agente.

Al recibir la orden, el agente lee el procedimiento en `AGENTS.md`, determina alcance, verifica GitHub, registra fecha, rama, SHA, canon, ADR, estado, evidencias, bloqueos y exclusiones, guarda un manifiesto versionado en `docs/snapshots/`, lo relee y devuelve enlace/ID. Si el alcance es ambiguo, pregunta qué proceso capturar; en esta ocasión el operador **sí definió alcance transversal**.

Recuperar un snapshot significa leer manifiesto y sus referencias. **No** significa restaurar código, sobrescribir archivos ni reiniciar servicios. Esas acciones requieren instrucciones separadas.

## 5. Evidencia y estado de este snapshot

**Comprobado en esta operación:** los cinco documentos existentes fueron leídos de GitHub en `codex/spatial-simulation`; contenían el canon, ADR-001/002, estados P1/P2/P3 y el procedimiento de snapshots. El commit base indicado corresponde a la última actualización confirmada de `AGENTS.md`.

**No verificado aquí:** ejecución de servicios, pruebas CI actuales, integración real de cámaras o aplicaciones, bases de datos, runtime de simulación, activos locales, existencia de módulos propietarios separados o métricas de desempeño. Las pruebas históricas mencionadas en los documentos no equivalen a una auditoría nueva.

**Decidido:** responsabilidades separadas de Núcleo/Core/Entidadizador/Constructor/Simulation; memoria jerárquica; snapshots manuales bajo orden.

**Implementado en esta secuencia:** documentación de arquitectura y memoria, protocolo de recuperación y procedimiento de snapshot. **No se implementó software de producto.**

**Pendiente:** auditoría de límites reales entre subsistemas, definición de contratos y validación técnica de cada motor, implementación y pruebas de escenarios de simulación, posible promoción de canon a `main` solo con autorización.

## 6. Recuperación y continuación

1. Abrir `AGENTS.md` en `codex/spatial-simulation` y seguir su protocolo.
2. Leer este manifiesto y el commit base `ae816d6e7cbbd0c7f61f31c6b57c524a5cd8e40b`.
3. Consultar canon, ADR-001/002, estados P1/P2/P3 y bitácora en esa referencia.
4. Mostrar la selección de procesos o continuar con el proceso que indique el operador.
5. Antes de actuar sobre código, comparar con HEAD actual y distinguir cambios posteriores.
6. Para restauración técnica, verificar dependencias y artefactos; no asumir que este snapshot de contexto incluye datos externos.

**Exclusiones explícitas:** no se han exportado DB, secretos, entornos, modelos Blender, escenas PlayCanvas, sensores ni estado en vivo; no se creó tag porque la herramienta conectada de esta sesión no ofrece acción de creación de tags. El propio archivo versionado y su commit Git son la referencia persistente.
