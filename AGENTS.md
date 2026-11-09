# ENTITY — Instrucciones vigentes para agentes
**Este bloque tiene prioridad sobre instrucciones históricas posteriores de este mismo archivo.** No crear archivos de memoria alternativos.

## Secuencia obligatoria de lectura
1. Leer **primero** el bloque canónico al inicio de `docs/ENTITY-MASTER-SPEC.md` y ADR-2026-11-08-001 al inicio de `docs/DECISION-LOG.md`.
2. Identificar el proceso asignado **P1/P2/P3** y leer su sección vigente en `docs/PROJECT-STATUS.md`.
3. Leer únicamente las entradas pertinentes y recientes de `docs/AGENT-WORKLOG.md`, más commits, pruebas y artefactos de ese proceso.
4. Si un plan antiguo contradice el canon o la decisión vigente, tratarlo como **histórico**, nunca ejecutarlo silenciosamente.

## Gobierno de escritura
- Resultado de tarea: actualizar PROJECT-STATUS y AGENT-WORKLOG con evidencia.
- Decisión de proceso: agregar entrada fechada a DECISION-LOG y actualizar estado de ese proceso.
- Cambio de canon: **prohibido sin autorización explícita del operador**; documentar ADR, motivación, impacto, sustituciones y modificar únicamente el canon afectado.
- Nunca declarar gate, CI, despliegue, integración o hardware completado sin prueba.
- No crear `MEMORY.md`, otros documentos maestros o roadmaps globales alternativos.

## Estado de procesos y reasignación
P1: software original hasta Fase 09, sin continuación automática. P2: gemelo operativo integral activo, las fases 01–07 solo describen escena 3D; cámaras/ReID (antigua PHASE-11) pertenecen aquí, junto a integraciones reales de operaciones. P3: IA situada/multiagentes posterior; OpenClaw (antigua PHASE-10) pertenece aquí. Roadmap global 08–15 revocado.

---
## Instrucciones históricas preservadas
**Las instrucciones antiguas de este archivo no prevalecen sobre el bloque vigente anterior ni el canon.** Conservar como evidencia; no seguir secuencias de fases antiguas ni autorizaciones caducadas.

# Codex instructions — ENTITY OS

Build the smallest end-to-end demonstrator. Preserve the proprietary ENTITY core: entities, explicit typed relationships, state, events, persistent memory and capabilities. Do not implement latent/geodesic relation discovery or complex multiagent inference in MVP. Use Scorpio as an external NGSI-LD broker, never vendor its source. Keep the PlayCanvas viewer independent of the backend and all integrations adapter-based. No real footage, credentials or secrets in commits. Work incrementally with tests and documented decisions.


## Canonical ENTITY OS product memory (2026-11-06)
Before implementing or changing ENTITY OS, read `docs/ENTITY-MASTER-SPEC.md`, `docs/EDGE-INTEGRATION-SPEC.md`, and `docs/DECISION-LOG.md`. Treat them as canonical decisions, alongside existing architecture and implementation plans. Maintain a strict distinction between intended architecture, committed implementation, executed tests, and deployed services. For any new product decision, update the master spec and append a dated entry to the decision log in the same development work. Keep hardware actually owned distinct from hypothetical purchases. Core must never depend on Orbbec or any vendor-specific API; adapters and Edge isolate external systems. Keep real pilot and investor simulation as parallel, contract-compatible products.


## Mandatory cross-agent handoff
At task start read `docs/PROJECT-STATUS.md` and recent `docs/AGENT-WORKLOG.md` alongside master spec, Edge spec and decision log. Before task completion append a dated factual entry to `docs/AGENT-WORKLOG.md` with goal, branch/PR/commit references when known, files changed, actual behavior, commands/tests and results, failures, and next steps. Update `docs/PROJECT-STATUS.md` to reflect implemented vs pending vs tested; update `docs/DECISION-LOG.md` for architectural decisions. Include these changes in the same PR/commit as implementation where possible. Never claim an unmerged Codex workspace change exists on GitHub; report the PR/branch and merge status. If worklog update conflicts with another agent, rebase and append without deleting earlier entries. Do not log secrets or private personal information. Do not claim tests passed unless actually run.


## Phase-driven execution (authoritative)
`GOALS.md` defines outcomes and non-goals. `PLANS.md` defines approved phase scope and acceptance criteria. `docs/PHASE-BOARD.md` is the human-facing phase status. `docs/CODEX-OPERATING-MODEL.md` is the execution/debug/handoff protocol. Read all four before beginning work. Work only on the authorized phase and smallest testable increment; present evidence and stop for human review before advancing. Update phase board, project status and agent worklog with actual test results; never self-approve a phase. The older `docs/implementation-plan.md` is historical scaffolding, superseded by `PLANS.md` for phase sequencing. For operator reports use plain Spanish: what works, how to see it, what failed, what is next.


## Mandatory autonomous GitHub delivery (operator is non-programmer)
Codex owns the full delivery workflow for every authorized phase task: implement, run tests, debug, commit, push/publish to the authorized GitHub repository, and update shared project memory. Do NOT ask the operator to create a PR, push commits, merge branches, or copy files manually. When a PR workflow is required, Codex must create the PR itself and report its URL; if authorized and safe to merge under repository rules, Codex may complete the merge, otherwise report the actual blocker and request only the necessary approval, never manual Git operations. Prefer a clean, reviewable branch/PR when the environment supports it; do not claim unpublished workspace changes are available in GitHub. At completion provide commit SHA and branch/PR/merge status, test evidence, and remaining blockers. Do not start the next phase without human phase acceptance. If publishing permissions are missing, explicitly report that limitation and request access/authorization rather than telling the operator to execute Git commands.


## Reuse-first and simulation-first execution (mandatory for phases 03–08)
Before writing a new detector, tracker, simulation engine, renderer, LLM/agent framework, device protocol or generic service, inspect existing open-source implementations, pretrained models, SDKs and assets. Prefer integrating and configuring working components through thin, replaceable adapters. Build original code for ENTITY's differentiating world model, entityization, contracts, orchestration and demonstrated integration gaps only; record the reason for any from-scratch implementation. For noncommercial prototypes, record dependency provenance and known licensing constraints without making extensive commercial-license review a prerequisite; do not assume redistribution/commercial rights. Use synthetic observations, recorded video and virtual outputs as primary reproducible tests when physical hardware is unavailable. Physical Orbbec and actuator validation is deferred, not a gate for phase completion; label simulated vs real evidence accurately. Read the updated phases 03–08 in PLANS.md before starting work.


## Current operator authorization: Phase 04 and GitHub CI recovery (2026-11-06)
The operator explicitly authorized proceeding with Phase 04 after reviewing Phase 03. Implement Phase 04 per the current PLANS.md (virtual-first output, observation -> state -> rule -> declared capability -> execution -> verified result, audit, manual control, failures and timeouts). Preserve Phase 00–03 and their tests. Treat the Phase 03 local evidence as sufficient to proceed, not as proof of remote CI or physical hardware validation. Phase 03 PR #1 already exists: https://github.com/drbrownlabs-afk/Entity/pull/1 (draft at creation); inspect its current state rather than creating a duplicate. Update stale phase-board/project-status text to reflect actual operator authorization and evidence; do not mark untested work as approved.

In parallel, diagnose and restore GitHub Actions validation. A Forbidden error in Codex's gh GraphQL/API environment does not establish that the GitHub repository or another authorized connector is inaccessible: PR #1 was created successfully using a separate authorized GitHub connection. Check authentication/account, token permissions and API scopes, REST vs GraphQL, repository Actions settings, workflow triggers/branch/path filters, PR status and actual runs. Retry transient failures with bounded backoff; for persistent Forbidden, change to a legitimate available method rather than repeating the same request or asserting that all GitHub access is impossible. Never bypass authorization or expose credentials. If the specific environment genuinely lacks permission, record the exact failing endpoint/status and continue local tests and Git publication via available authorized methods. Do not make the operator run Git/CI commands. Remote CI must be reported as verified only with an actual run and conclusion, never inferred from workflow YAML or zero results from a PR-only run query. CI troubleshooting must not block virtual-first Phase 04 development.


## Autorización especial: Fase 09 completa (2026-11-07)
El operador autoriza **una sola tarea continua 09.1–09.9**, con verificación automática al cerrar CADA subfase, corrección de fallos y avance inmediato a la siguiente **sin pedir aprobación humana entre 09.x**. Esta autorización EXCEPCIONA para la Fase 09 las reglas generales de detenerse al final de cada fase/subfase, sin modificar los límites de las fases 00–08. Leer `docs/phases/PHASE-09.md` antes de trabajar. Registrar pruebas, resultados y checkpoints en `docs/PHASE-09-PROGRESS.md`; subfase = VERIFICADA AUTOMÁTICAMENTE, nunca APROBADA por humano. Solo la Fase 09 integral pasa a EN VALIDACIÓN para revisión final del operador. Resolver fallos antes de avanzar, sin esconder bloqueos. Conservar publicación autónoma y no fusionar ramas protegidas sin autorización. Si se interrumpe una sesión, dejar checkpoint reanudable y continuar desde el último gate válido al retomarla.


## Addendum Núcleo — Fase 09 (2026-11-07)
Leer y aplicar `docs/phases/PHASE-09-NUCLEO-ADDENDUM.md` como decisión arquitectónica complementaria durante la ejecución autónoma de 09.1–09.9. Núcleo (nombre propio) normaliza capacidades de conectores/adaptadores; ENTITY Core conserva entidades, estados, relaciones, eventos y memoria. No detener ni reiniciar la fase, ni ampliar alcance a normalización universal o autodetección de cualquier API. Integrar progresivamente, conservar implementaciones válidas y probar intercambio de adaptadores.


## Corrección operativa vinculante — Fase 09 (2026-11-07)
La escena Synthetic Office ORIGINAL ya está integrada y renderizada desde su SSOG publicado (evidencia `baf37b3` y `docs/evidence/phase09/original-integration.json`). **No exigir, perseguir ni esperar el export Vite ZIP, descarga autenticada, SSOG local o sesión de navegador como prerequisito**. El operador ya posee Vite, pero NO se solicita ni se necesita para continuar; únicamente consultar una exportación si el operador lo pide explícitamente más adelante. Un bloqueo de descarga/exportación NO bloquea 09.1–09.9. Seguir usando los recursos originales remotos y los voxels; verificar las rutas, anclas y colisiones restantes con evidencia real. No sustituir la escena.

La asignación espacial vinculante está en `docs/phases/PHASE-09.md` («Zonificación operativa confirmada»). Dos conjuntos contiguos de seis puestos son **dos oficinas privadas**, no doce escritorios individuales públicos; la mesa negra junto a la pared es la reunión; dos sillas negras aisladas son recepción provisional; otro grupo de sillas es espera; el resto son puestos individuales reservables. La posición geométrica exacta de cada grupo sin ancla validada queda pendiente de inspección, nunca inventada. Corregir inventario/bootstrap y probar reservas/roles acorde con esta topología.

Continuar autónomamente desde el checkpoint de 09.1, cerrar gates con pruebas y seguir 09.2–09.9 sin detenerse por Vite ni pedir nueva aprobación entre subfases. El checkpoint no es finalización de fase. Mantener evidencias, commits y publicación GitHub según las reglas existentes.


## Corrección crítica del inventario espacial — Fase 09
Las CUATRO anotaciones originales de SuperSplat NO son un inventario exhaustivo. Hay más mesas y conjuntos de seis sillas visibles en la escena sin anotaciones. **Prohibido** derivar el número de mesas, oficinas o puestos únicamente de `settings.annotations` o clasificar automáticamente los dos `Office Bench` anotados como las dos oficinas privadas. Inspeccionar el SSOG completo visualmente desde vistas elevadas/dollhouse, desplazamientos y cámaras de detalle; identificar TODOS los grupos de mesas, sillas, zonas y accesos, incluidos los no anotados. Registrar evidencia visual por grupo, identificadores estables y confianza/procedencia de su localización. El operador confirma que los DOS grupos contiguos a la mesa negra de reuniones son oficinas privadas; los demás grupos de trabajo son puestos individuales. Las sillas negras aisladas son recepción provisional y otro grupo de sillas es espera. Crear anotaciones semánticas propias solo después de verificar la geometría; no inventar posiciones. El bootstrap actual, que recorre solo anotaciones, es insuficiente y debe corregirse. No declarar 09.1 verificada sin cobertura visual de la escena completa y pruebas de que los grupos no anotados también existen en el inventario.


## Precisión final del operador — correspondencia inequívoca de oficinas privadas
Las DOS anotaciones originales tituladas `6-Person Office Bench System` **SÍ corresponden exactamente a las dos oficinas privadas de seis puestos**. Esta identificación está confirmada por el operador y sustituye la advertencia anterior que cuestionaba esa correspondencia. Se pueden usar esas dos anotaciones como anclas verificadas de los dos ambientes privados; no asignar cuál se llama Oficina 01 o 02 por orden sin necesidad (usar IDs estables por anotación). **Las demás mesas de seis puestos NO anotadas** son coworking individual y deben inventariarse inspeccionando toda la escena. Las cuatro anotaciones originales siguen siendo incompletas como inventario global, pero las dos `Office Bench` son referencias correctas para las oficinas privadas. Corregir el bootstrap: cada grupo anotado `Office Bench` = oficina privada con seis puestos internos NO reservables individualmente al público. No omitir los grupos no anotados.


## Decisión operativa final — recepción digital y ambientes A–E (2026-11-07)
El operador confirma recepción DIGITAL (función Core/API para check-in, visitas, acceso y escalamiento al staff; no mostrador ni puesto físico obligatorio). Distribución: A y B son los dos `6-Person Office Bench System` anotados, oficinas privadas de seis posiciones reservadas como ambiente completo. C es el conjunto de seis posiciones con un MUEBLE SEPARADOR AL FRENTE: ambiente de STAFF, no reservable al público. D y E son los únicos dos ambientes de coworking individual: D1–D6 y E1–E6, exactamente 12 puestos individuales comercialmente reservables, NO 18. Mesa negra junto a pared = reuniones, reservable completa. Booths de descanso (aproximadamente cuatro, verificar visualmente) y pasillos son entidades espaciales no reservables. No crear C1–C6 como puestos públicos. Identificar C por la característica visual del separador; no asignar coordenadas sin inspección. Si la escena muestra mobiliario adicional, inventariarlo sin crear nuevos puestos comerciales automáticamente; consultar al operador antes de ampliar la oferta de 12. Esta decisión sustituye las instrucciones anteriores que clasificaban C como coworking o permitían crear F/G automáticamente.


## Decisión de recepción inteligente presencial — 2026-11-07
Recepción inteligente: kiosco/pantalla física de voz y táctil en sector de DOS SILLAS NEGRAS aisladas; sin recepcionista humano y sin teléfono obligatorio. El kiosco es interfaz del MISMO Núcleo y grafo ENTITY, no chatbot independiente. Verifica citas e identidad por mecanismos autorizados, hace check-in auditable, notifica anfitrión y orienta al visitante. No asumir reconocimiento facial ni inventar coordenadas. Esta decisión sustituye «recepción digital sin ubicación física obligatoria».


## Intercomunicación contextual — 2026-11-07
Añadir red de intercomunicación inteligente ENTITY: recepción y ambientes A/B/C con terminales de voz o dispositivos de comunicación, todos clientes del mismo Núcleo/grafo, no asistentes independientes. Caso: Daniel hace check-in para reunión de las 16:00; ENTITY contacta a Carlos (anfitrión) por intercom del Ambiente A: «Carlos, Daniel está aquí para la reunión. ¿Estás listo?». Carlos responde «Sí, dile que pase» o «en cinco minutos»; ENTITY registra respuesta/evento, actualiza visita, informa a Daniel por kiosco y orienta/gestiona espera. Resolver destinatario, canal y permisos desde relaciones tipadas, presencia y estado; no asumir ubicación ni difundir datos personales en altavoz público. Distinguir mensajes ambientales de comunicaciones privadas; tener fallback si no responde. Simulación sincronizada con personajes, tiempo y grafo.


## Coordinación obligatoria ChatGPT ↔ Codex — 2026-11-07
Antes de comenzar trabajo en esta rama, leer `docs/CHATGPT-CODEX-HANDOFF.md` y `docs/PHASE-09-PROGRESS.md`, además de este archivo. ChatGPT puede implementar y commitear cambios directamente en el repositorio; Codex debe inspeccionar el árbol y commits recientes antes de editar para evitar sobrescrituras o duplicación. Registrar autor, SHA, archivos, pruebas ejecutadas y pendientes en el handoff compartido al terminar cada lote. Los cambios de ChatGPT no deben asumirse probados si no hay evidencia de ejecución. La arquitectura móvil es la MISMA interfaz/estado de ENTITY adaptada a dispositivo y permisos (José operador, Carlos miembro); los permisos se validan en servidor, no solo en UI.


## Secuencia futura vinculante — 2026-11-08: Fase 10 OpenClaw / Fase 11 cámaras
Prioridad absoluta: completar y validar Fase 09 antes de iniciar otra fase. Al terminar 09, consultar docs/phases/PHASE-10.md (agente único `entity` con OpenClaw oficial, adaptador delgado a capacidades ENTITY Core, permisos por usuario y sede, memoria Core separada de sesiones de agente). NO construir otro runtime, otro mundo ni otra lógica de reservas. El modelo del mundo mismo es entidad computable; coworking es entidad del dominio y NO raíz del modelo. La antigua Fase 10 de Camera Gateway, registro y ReID queda íntegramente diferida a docs/phases/PHASE-11.md; no usar falta de cámaras como bloqueo de 10. Se sustituyen instrucciones anteriores que asignaban cámaras a 10 y OpenClaw a 11. Esta decisión NO autoriza iniciar Fase 10 ahora. Ver PLANS.md, docs/PHASE-BOARD.md, docs/DECISION-LOG.md y handoff.


## NORMA OPERATIVA OBLIGATORIA — CERO VIGILIA DE PROCESOS LARGOS (2026-11-08)

**REGLA VINCULANTE PARA TODOS LOS AGENTES DE ESTE REPOSITORIO, ESPECIALMENTE FASE 04.5.** La inferencia del agente no se usa como temporizador ni supervisor continuo de Blender/Cycles, bakes, compilaciones, entrenamientos, pruebas o exportaciones. Evitar gasto de cuota por consultas repetitivas de estado sin cambios.

1. **Antes de lanzar:** estimar duración mediante un benchmark corto representativo cuando sea posible; comunicar al operador estimación y grado de incertidumbre, archivo de salida y qué trabajo independiente puede hacerse. No inventar ETA.
2. **Ejecutar sin vigilia:** usar un proceso autónomo y persistente solo cuando el entorno realmente lo permita; registrar PID o identificador, comando, carpeta de trabajo, log, código de salida, ruta de artefactos y timestamp. Usar mecanismos de finalización/eventos del sistema o un script supervisor local SIN llamadas al modelo. Un script local puede esperar, registrar salida y producir marcador `done`/`failed`; eso no justifica que el modelo consulte el marcador continuamente.
3. **Ceder control:** tras comprobar el arranque, dejar de usar `wait`, `write_stdin`, sleeps o lecturas periódicas desde el agente. No emitir mensajes “faltan X minutos” ni reabrir turnos para decir que no hay cambios. Si el entorno no mantiene procesos después de ceder el control, explicitar la limitación y usar una alternativa persistente autorizada; nunca afirmar que el render continuará sin verificarlo.
4. **Aprovechar el tiempo:** adelantar trabajo independiente que no compita por los mismos recursos ni altere entradas congeladas del render. Si no hay trabajo útil, cerrar la intervención y esperar la señal del operador o una notificación real de finalización. No abrir otros agentes solo para vigilar.
5. **Reanudación:** al recibir señal de fin o nueva solicitud del operador, hacer UNA verificación de estado, revisar código de salida, logs y artefactos, y continuar. Si el trabajo falló, diagnosticar con evidencia y limitar reintentos. No relanzar automáticamente renders duplicados.
6. **Excepción limitada:** monitoreo activo únicamente cuando sea técnicamente indispensable por seguridad, riesgo de corrupción o fallos que exijan intervención inmediata; justificarlo, fijar intervalo mínimo y presupuesto de comprobaciones, y no utilizar el modelo para polling si puede resolverlo un script local.
7. **Aplicación transversal:** rige también para subagentes y tareas de otros planes/fases, sin alterar la rama autorizada ni la política de aprobación. Las instrucciones de fases que soliciten “supervisión”, “progreso” o “esperar hasta terminar” deben interpretarse conforme a esta norma: notificación por evento o checkpoint, no vigilia de IA.

**Criterio de cumplimiento:** ningún ciclo de inferencia cuya única información nueva sea “el proceso sigue ejecutándose”. Un render de 30 minutos debe consumir cuota de agente por preparación, decisiones y análisis de resultados, no por 30 minutos de espera.

## Actualización de memoria canónica — 2026-11-08
**OBLIGATORIO:** antes de planificar o modificar ENTITY, leer `docs/ENTITY-MASTER-SPEC.md`, `docs/DECISION-LOG.md`, `docs/PROJECT-STATUS.md` y las entradas recientes de `docs/AGENT-WORKLOG.md`. Al cerrar, actualizar **esos mismos archivos**, sin crear un `MEMORY.md` paralelo ni otro master spec.

Decisiones rectoras: **tres procesos independientes**: software original hasta Fase 09; gemelo digital **integral y operativo** del coworking (activo, mucho más que las fases 01–07 de 3D); inteligencia situada/multiagentes posterior. Antigua PHASE-11 cámaras → Proceso 2; antigua PHASE-10 agentes/OpenClaw → Proceso 3. El roadmap global 08–15 no es plan vigente. **Un solo modelo del mundo** computable, persistente y compartido: Core no se duplica, el 3D es interfaz. Proceso 2 incluye cámaras/percepción, seguridad, accesos, biometría, reservas, CRM, facturación, Drive, redes y mantenimiento, con integraciones empresariales reales por API; no inventar stack de Impacto. Personajes objetivo: ~12 humanos Mixamo; dummies descartados. SaaS nube, Edge limitado. Ver detalles y estados en el master spec y decision log.

Al resolver contradicciones, privilegiar la decisión vigente fechada y evidencias reales sobre roadmaps históricos. No convertir un plan en estado implementado ni ejecutar el Proceso 3 sin autorización.
