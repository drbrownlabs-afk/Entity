# ENTITY — Registro de decisiones y autoridad
**Regla:** decisiones inmutables como registros; una nueva entrada puede sustituir otra indicando ID y fecha. Nunca borrar evidencia histórica. Canon solo cambia con aprobación explícita del operador.

## ADR-2026-11-08-001 — Memoria jerárquica y tres procesos (ACEPTADA)
- **Aprobación:** instrucción explícita del operador de redefinir la memoria, 2026-11-08.
- **Problema:** instrucciones históricas de fases y archivos redundantes producían contradicciones entre canon, procesos y ejecución.
- **Decisión:** ENTITY-MASTER-SPEC.md contiene canon estable; PROJECT-STATUS.md mantiene P1/P2/P3 actualizables; DECISION-LOG.md conserva decisiones y sustituciones; AGENT-WORKLOG.md es evidencia; AGENTS.md solo coordina.
- **Cambio de canon:** únicamente por decisión explícita aprobada, documentada con ID, impacto y sustituciones.
- **Alcance:** P1 termina en Fase 09 (aceptación técnica independiente); P2 gemelo integral activo, con fases 01–07 solo para 3D; P3 agentes posterior. Antiguas PHASE-11 cámaras → P2 y PHASE-10 OpenClaw → P3; roadmap global 08–15 revocado.
- **Regla de resolución:** una instrucción histórica que diga «vinculante» no prevalece sobre el canon y esta decisión.
- **Alternativas descartadas:** nuevos archivos MEMORY.md, documentos maestros paralelos y sobrescritura destructiva de decisiones.
- **Impacto:** cambio documental de coordinación; sin modificación de producto ni aprobación de pruebas.

## ADR-2026-11-08-002 — Núcleo independiente y cartera de tecnologías propietarias (ACEPTADA)
- **Aprobación:** operador solicita incorporar las definiciones recuperadas de la conversación del 2026-11-08 al canon.
- **Corrección crítica:** Núcleo es motor de interoperabilidad universal **independiente de ENTITY Core**, no un nombre alternativo de Core ni un conjunto informal de conectores.
- **Núcleo:** descubrimiento, interpretación y normalización de APIs/SDK/protocolos, catálogo semántico de capacidades, adaptadores, invocación y validación de contratos.
- **Entidadizador automático:** interpretación de datos heterogéneos, correspondencia de identidades, creación/asociación de entidades y normalización semántica con procedencia.
- **ENTITY Core:** modelo del mundo compartido, entidades, estados, relaciones, eventos, memoria y autorización.
- **Constructor de gemelos digitales:** generación/edición de representaciones 3D vinculables al modelo; no equivalente a Core.
- **Spatial Simulation:** laboratorio de escenarios sintéticos para probar comportamientos y contratos antes de implementación; separado de producción y con ground truth aislado de observación/inferencia.
- **Consecuencia:** mantener distinción conceptual y de responsabilidades; no declarar implementación o independencia de despliegue sin evidencia. Complementa ADR-2026-11-08-001 sin sustituir los tres procesos globales.

## ADR-2026-11-08-003 — Propiedad exclusiva de P1/P2/P3 y adaptación del software (ACEPTADA)
- **Aprobación:** instrucción explícita del operador, 2026-11-08: conservar esta separación como regla permanente y crear snapshot.
- **P1 = plataforma de software:** backend y frontend de plataforma; ENTITY Core, Núcleo, Entidadizador, APIs, conectores, contratos, interfaces y **todos los cambios/adaptaciones necesarios en ese software**. P1 es el único lugar de desarrollo y mantenimiento de esos componentes compartidos. La anterior detención de fases de P1 no prohíbe mantenimiento o ampliaciones requeridas por P2/P3: no equivale a reabrir la numeración histórica.
- **P2 = caso de uso/demostración del workspace/coworking:** gemelo digital, escena Blender/PlayCanvas, personajes, cámaras, simulación, flujos operativos y validación de integración con sistemas externos. P2 **consume** P1 y desarrolla sus componentes propios de experiencia/simulación; cuando descubre una necesidad de cambio en backend, frontend de plataforma, conectores o entidadización, el cambio se implementa **en P1**, luego se consume y verifica en P2. No crear Core ni backend paralelo en P2.
- **P3 = IA situada:** razonamiento situado, agentes y orquestación contextual sobre el modelo compartido; consume P1 y puede usar P2 como laboratorio. Cambios necesarios en plataforma/contratos se implementan en P1. P3 no se implementa automáticamente por esta decisión.
- **Dependencias:** P2-06 personajes → P2-07 integración de escena → P2-08 conectar/entidadizar mediante P1 → P2-09 sistemas externos → P2-10 sincronización → P2-11 validación. Las integraciones se demuestran en P2; el código compartido vive en P1.
- **Impacto:** precisión de responsabilidades y continuidad, sin reescritura de código ni certificación de funcionalidad por este registro. Complementa ADR-001 y ADR-002; sustituye interpretaciones anteriores que ubicaban desarrollo de Core/frontend de plataforma dentro de P2.
- **Alternativa descartada:** duplicar backend, frontend de plataforma o Entityizer por cada demo o vertical.

---
## Historial previo (conservado, puede contener decisiones sustituidas)
Las entradas siguientes documentan su momento histórico; para saber cuál es vigente aplicar ADR-2026-11-08-001 y el canon.

# ENTITY OS — Registro de decisiones

## 2026-11-06
- Dos líneas paralelas: producto real ENTITY Core/Edge y ENTITY Experience (mockup web funcional para VCs).
- Demo de VC cambia de coworking a ala de centro comercial, para mostrar mayor complejidad comercial sin exigir despliegue físico.
- CCTV virtual y gemelo 3D consumen un único mundo simulado; los eventos actualizan entidades y permiten consultas y acciones.
- Privacidad según contexto y permisos: visitantes anónimos en espacios públicos, identidades vinculadas en instalaciones privadas cuando exista fundamento y autorización.
- ENTITY Edge es componente desplegable local y desacoplado del Core; Orbbec es hardware inicial intercambiable, no dependencia.
- Integraciones prioritarias: Orbbec, RTSP/ONVIF, MQTT, REST/webhooks, puente Home Assistant; futuros NVR/VMS, BACnet, Modbus, OPC UA, Zigbee, Matter.
- Percepción real inicial: detectar y seguir personas, zonas configurables, observaciones normalizadas. No confundir RTSP con analítica ni seguimiento monocámara con identificación multicámara.
- Laboratorio: Orbbec + Smart TV y tres proyectores existentes; smart plugs y cargas son compra propuesta; permitir acciones físicas verificables.
- Core 24/7 preferiblemente VPS económico; video local en Edge; GitHub para fuente de verdad del proyecto, no datos operativos.
- Criterio de prototipo: ver, contextualizar, registrar, consultar, actuar y verificar con hardware/sistemas reales.
- La documentación debe persistir en el repositorio y actualizarse con nuevas decisiones; distinguir decisiones, implementación y pruebas.


## 2026-11-06 — Entrega GitHub totalmente a cargo de Codex
Decisión: el operador no realiza operaciones de Git/PR. Codex debe completar los commits, push/publicación y creación de PR cuando proceda, además de pruebas, depuración y actualización de bitácora. No debe exigir que el operador publique ni fusione manualmente. Si falta autorización de merge, pedir únicamente aprobación o permisos y reportar el bloqueo. La aceptación de fase permanece humana; no avanzar automáticamente.


## 2026-11-06 Ecuador / 2026-11-07 UTC — Core local de Fase 01
- Mantener SQLite en el incremento actual: carga local pequeña, sin consultas geoespaciales ni necesidad distribuida demostrada. PostgreSQL/PostGIS queda como arquitectura objetivo, sujeto a necesidad y presupuesto según PLANS.md. No se afirma soporte PostgreSQL.
- Migraciones SQL versionadas y transaccionales hacia adelante; bloqueo previo a lectura de versión, adopción de base Fase 00 y rechazo de versiones futuras. Restauración de backup compatible para volver atrás, sin downgrade automático.
- Contratos de registros Core v1 con schema_version 1.0 y snapshot OpenAPI versionado; historial, notas y declaraciones de capacidad persistentes. No confundir estos contratos de Core con Observation/Capability interoperables de Fase 02.
- Capacidades solo declarativas con permiso requerido; sin ejecución/autorización de acciones. Procedencia de entrada declarada, no autenticada. Scorpio permanece externo sin conexión en esta entrega. Ver master spec y docs/phases/PHASE-01.md.


## Fase 02 — 2026-11-06 Ecuador / 2026-11-07 UTC
Perfil local v1 de Manifest/Observation/Capability/Invocation, registry manual persistente y entrada REST para fuentes reales/simuladas. Simulador set_state verifica por lectura SQLite; no hardware. Autorización Bearer por permisos server-side solo para integraciones; Core antiguo sigue local sin autenticación. Migración aditiva 003, deduplicación e idempotencia durables; no MQTT ni Edge. Contratos y límites en docs/phases/PHASE-02.md. EN VALIDACIÓN; Fase 03 no iniciada.


## Fase 03 — 2026-11-06 Ecuador / 2026-11-07 UTC
Fase 02 aceptada explícitamente por operador; merge main 1e6b29f/cabd969 conservando fases anteriores. Selección práctica OpenCV HOG/SVM preentrenado y captura + Norfair (asociación/Kalman); alternativas revisadas documentalmente YOLO y Frigate, no comparadas en precisión. Adaptadores delgados Edge, fixture determinista, zonas normalizadas y Outbox SQLite hacia Observation v1. Proyección Core genérica edge.presence crea PersonTrack/Zone y estado por cámara sin vendor API. Sesiones no son identidad; snapshots tardíos no rebobinan estado. Hardware Orbbec diferido no bloqueante; no prueba física. Evidencia, licencias y restricciones: docs/phases/PHASE-03.md. Fase 03 EN VALIDACIÓN, Fase 04 no iniciada.


## Fase 04 — 2026-11-06 Ecuador / 2026-11-07 UTC
Autorizada tras revisión de Fase 03; main 5ce2519 integrado. Output virtual con pantalla HTML/browser, FastAPI, SQLite y asyncio, sin renderer/protocolo físico nuevos. Regla presencia→capacidad declarada display.set_scene→ejecución y readback; modos manual/automático, idempotencia, auditoría y errores simulados. Migración aditiva 004. Hardware eléctrico/TV/proyector diferido; EN VALIDACIÓN, Fase 05 no iniciada. CI histórico comprobado Success por web: bloqueo api.github.com en CONNECT no demuestra token inválido. Ver docs/phases/PHASE-04.md y docs/audits/GITHUB-ACTIONS-RECOVERY.md.


## Fase 05 — 2026-11-06 Ecuador / 2026-11-07 UTC
IA situada como adaptador del SDK oficial OpenAI 2.8.1/function tools + sustituto controlado reproducible. Sin nuevo framework/MCP/modelo. Scope de entidad explícito y envelope de acción exacto, permisos server-side y capacidades declaradas; respuesta factual derivada de evidencia Core, no prosa libre del modelo. Trazas/idempotencia persistentes en migración 005, salida virtual por Output. Proveedor real no validado por ausencia de clave; SDK real validado con transporte controlado. Decisión compatible con sustituto permitido por PLANS.md; límites y evidencia en docs/phases/PHASE-05.md. EN VALIDACIÓN, no Fase 06.


## Fase 06 — 2026-11-06 Ecuador / 2026-11-07 UTC
Autorizada integración de instalaciones mediante adaptadores existentes. MediaMTX/FFmpeg/OpenCV para RTSP TCP local real y Eclipse Mosquitto/Paho para MQTT; HTTPX para reservas fixture. Perfiles Edge normalizan a Observation v1 con deduplicación/cola existente, sin cambiar código/schema/endpoints Core. Sensores/reservas persisten como eventos con procedencia, no estado materializado. ONVIF, Frigate y NVR/VMS físicos solo evaluación documental/matriz; no acceso ajeno ni hardware supuesto. Docker fijado por digest, licencias y límites en docs/phases/PHASE-06.md. EN VALIDACIÓN; Fase 07 no iniciada.


## Fase 07 — 2026-11-07 UTC
Experience autorizada: PlayCanvas 2.23.3 + Vite estático, siete tiendas, cuatro CCTV y vista principal desde el mismo estado/revisión. Se extrae sin alterar el fixture Edge a JSON compartido; desfases de la misma trayectoria para visitantes anónimos, sin otro motor de simulación. Geometrías primitivas de PlayCanvas; tres acciones locales con readback, consultas deterministas y export Observation v1. Adaptador opcional Core con API real y modos separados, token solo memoria, errores sin fallback; CORS explícito por variable de entorno, desactivado por defecto. Publicación Pages por gh-pages y Actions, con prueba de SHA y navegación real sobre URL. Hardware, calibración y despliegue Core público no acreditados. EN VALIDACIÓN; no Fase 08. Evidencia y límites en docs/phases/PHASE-07.md.


## Fase 08 — 2026-11-07 UTC
Continuación autorizada por operador. Entrega compone frameworks existentes (unittest/HTTPX/Playwright/SQLite/GitHub Actions) con el fixture del visor y Outbox vigente: escenario HTTP aislado, memoria/contexto, acción virtual, permisos, interrupción, reinicio y backup/restore. Sin nuevos servicios genéricos ni cambio de contratos/schema Core. Paquetes de fuente comprometida y web estática con manifiesto/checksums, instalados desde extracción limpia en CI. No incluye dependencias offline ni DB/secretos. Runbook del operador y backlog por prioridad/dependencias/esfuerzo; EN VALIDACIÓN hasta aceptación humana, hardware/LLM remoto/producción siguen sin acreditar. Ver docs/phases/PHASE-08.md.


## Auditoría integral MVP — 2026-11-07 UTC
Auditoría independiente de recorridos felices sobre701da12. Probes nuevos HTTP real, Outbox y Chromium detectan autenticación Core incompleta, falta de ámbitos por fuente, colisión de IDs cámara/track, congelación temporal por timestamp futuro, cola bloqueada por422 permanente, sensores solo como eventos, respuesta de agente fija y escena Core/Experience divergente. Informe docs/audits/MVP-INDEPENDENT-2026-11-07.md. Se corrigen únicamente números JSON no finitos, Bearer no ASCII y validación/procedencia de exportación del visor; sin nueva arquitectura, migración ni funcionalidades. La auditoría sustituye interpretaciones de «plataforma plenamente integrada» basadas solo en demos verdes. Fases no autoaprobadas, Fase08 EN VALIDACIÓN; piloto/producción sin validar.


## Fase09 — Frontera Núcleo y checkpoint Office (2026-11-07)
Aplicación incremental del addendum: `app/nucleo` normaliza descriptores y resultados; `app/office` conserva políticas, entidades, eventos append-only, estado, memoria y persistencia dentro de ENTITY Core. Tablas Office aditivas versionadas; no se altera contrato heredado ni se vende compatibilidad universal. La presencia de una sede Office activa bloqueo de rutas heredadas no acotadas; las nuevas APIs exigen sesión/sede/rol. Adaptadores simulado y REST de servicio de prueba permanecen rotulados como simulados. Su prueba compatible no certifica proveedores físicos.

Representación espacial: reutilizar SuperSplat viewer1.42.1 y SSOG/voxels publicados por argenzio CC BY-NC4.0. Mantener las cuatro anotaciones reales; mesa de conferencias abierta es EventSpace, no inventar sala cerrada. Puestos usan anclas de grupo aún sin calibración individual; accesos/HVAC/espera lógicos sin ubicación física verificada. Recepción de Vite/SSOG autenticados mediante importación inmutable y hashes; no ejecutar scripts recibidos. La verificación de archivo no equivale a validación espacial. No cambia la aprobación de ninguna fase.


## Fase 09 — Corrección de dependencia y topología del coworking (2026-11-07)
Decisión explícita del operador: el SSOG original ya integrado es suficiente para continuar 09.1–09.9. El ZIP Vite ya está en posesión del operador pero no se requiere ni debe bloquear la ejecución; retirar la búsqueda de exportación autenticada del camino crítico. Zonificación: mesa negra junto a pared = reunión; conjunto contiguo de seis puestos = oficina privada 01; siguiente conjunto de seis = oficina privada 02; otros puestos = coworking individual; dos sillas negras aisladas = recepción provisional; otro grupo de sillas = espera. No reconstruir geometría. Anclas/posiciones exactas pendientes de validación visual. Corregir el bootstrap que publica puestos privados como individuales, preservando datos y añadiendo pruebas. La Fase 09 continúa EN CURSO y autorizada autónomamente.


## Fase 09 — decisión posterior de producto: recepción digital y 12 puestos (2026-11-07)
El operador fija recepción digital sin estación física obligatoria; A/B = oficinas privadas completas con seis posiciones, correspondientes a las dos anotaciones originales `6-Person Office Bench System`; C = área staff (mesa con mueble separador frontal), no reservable; D/E = coworking individual con D1–D6 y E1–E6, doce puestos públicos en total. Mesa negra = reuniones; booths = descanso no agendable; pasillos = circulación. Esta decisión sustituye la clasificación anterior de C como seis puestos comerciales y la ampliación automática de oferta a F/G. Requiere actualización de código y validación visual sin inventar coordenadas; no depende de Vite.


## Decisión de recepción inteligente presencial — 2026-11-07
Se sustituye «recepción digital sin ubicación física» por kiosco inteligente físico en zona de dos sillas negras, sin recepcionista. Misma IA situada/Núcleo, check-in por voz/pantalla, identidad verificada, reservas, relaciones, eventos y escalamiento a Cowork.


## Intercomunicación contextual — 2026-11-07
Se aprueba intercomunicación inteligente bidireccional en la simulación: ENTITY puede contactar proactivamente a empleados/anfitriones por dispositivo de ambiente o canal personal según contexto, recibir respuesta y actuar. Caso Daniel–Carlos–reunión 16:00. Compartir Núcleo, grafo, reloj, estado y eventos; respetar privacidad.


## 2026-11-08 — Reloj y jornada activa de Fase09
Core es el único productor del reloj persistente de simulación; clientes observan y controlan con permiso simulate. Reiniciar pausa sin aplicar tiempo offline. El replay crea un run independiente y cambia active_run_id en configuración de sede de forma transaccional, con eventos en ambas ejecuciones; nunca borra la anterior. Interfaces siguen esa ejecución por defecto y permiten seleccionar otras explícitamente. Mensajes vinculados se filtran por run; kiosco puede leer únicamente ID/reloj de ejecución activa. Hora presentada se interpreta en timezone de sede, manteniendo UTC en almacenamiento. Es configuración del simulador existente, no un segundo motor ni un asistente nuevo. No modifica aprobación de fase.


## 2026-11-08 — Interfaz espacial nativa y demo pública sin falsas conexiones
Se aplica el contrato del operador y sus referencias desktop/móvil: A/B oficinas completas, C/D públicos, no E ni Cstaff. El inventario antiguo se retira de forma no destructiva. Renderer oficial headless, recorte horizontal de splats por cámara para Dollhouse; interior/feed conserva captura completa. Prueba visual pendiente. Se reutiliza la simulación y exportación Core como traza pública de estado/eventos/rutas, no otra simulación empresarial. Adaptadores ReplayWorld (sesión explícitamente sintética) y CoreWorld (API autenticada real) separan fuentes sin fingir persistencia. Cambios locales no llegan al servidor ni afirman hacerlo. Herramientas anteriores bajo diagnóstico explícito.


## 2026-11-08 — Fase 10 OpenClaw; cámaras a Fase 11 (decisión del operador)
El trabajo actual de Fase 09 Synthetic Office no está suficientemente terminado ni validado: **no iniciar nuevas implementaciones**. Guardar ahora la comprensión y especificación de integración, para ejecutar después. Fase 10 pasa a ser un único agente `entity` con OpenClaw oficial, que opera ENTITY mediante capacidades existentes expuestas por API/SDK/MCP/plugin; adaptador mínimo, identidad/rol/sede por sesión, consultas y mutaciones autorizadas, evidencia, idempotencia y continuidad. ENTITY Core es la fuente de verdad (entidades, estados, relaciones, eventos, memoria, capacidades); el modelo del mundo es una entidad computable, el coworking es una entidad del dominio, no la raíz arquitectónica del modelo. OpenClaw aporta razonamiento/sesiones/modelos, no reemplaza el mundo ni la memoria operativa. Las capacidades de cámaras, calibración y ReID de la antigua Fase 10 se conservan en Fase 11, como ajuste posterior no bloqueante, sin asumir hardware disponible. La anterior Fase 11 de agente conversacional se sustituye por la integración OpenClaw de 10. Especificaciones: docs/phases/PHASE-10.md y docs/phases/PHASE-11.md. **Solo planificación: ninguna prueba OpenClaw/cámara ejecutada por este cambio.**


## 2026-11-08 — Decisión posterior del operador: laboratorio nativo, auditoría previa
Se suspende el desarrollo del frontend basado en Gaussian Splatting, conservando código e historial. El siguiente laboratorio será editable en Blender y ejecutado en PlayCanvas, con ENTITY Core como fuente de verdad. Esta orden sustituye la prioridad de continuar personajes/NPCs sobreSSOG. La tarea actual es exclusivamente auditoría/diagnóstico/plan de correcciones; no construir el laboratorio ni comenzar10/11. Informe y evidencia: docs/audits/ENTITY-BACKEND-READINESS.md, rama codex/backend-readiness-audit.

## 2026-11-08 — Consolidación de procesos, gemelo integral y continuidad
- **VIGENTE:** ENTITY (marca general) / ENTITY Spatial Intelligence (vertical). Modelo del mundo único, computable y persistente; Core no se duplica; gemelo 3D es interfaz, no inteligencia.
- **VIGENTE:** tres procesos independientes: (1) software original hasta Fase 09, (2) gemelo digital operativo integral de coworking, activo y más allá de las fases 01–07 de escena, (3) inteligencia situada y multiagentes, posterior.
- **REASIGNADO:** antigua PHASE-11 (cámaras/ReID) al Proceso 2; antigua PHASE-10 (OpenClaw/agente) al Proceso 3. **REVOCADO:** roadmap 08–15 como numeración global.
- **VIGENTE:** el gemelo del coworking integra cámaras y percepción, seguridad, biometría, accesos, reservas, calendarios, CRM, membresías, facturación, Drive/documentos, redes y mantenimiento, en el mismo mundo. Integrar servicios empresariales reales por API; hardware ausente puede simularse con modelos comerciales documentados. No inventar stack de Impacto.
- **DESCARTADO:** dummies geométricos como personajes objetivo de visión. **SELECCIONADO:** ~12 humanos realistas Mixamo, animados, con ground truth aislado de la percepción.
- **VIGENTE:** SaaS centralizado; Edge solo tareas locales indispensables. Orbbec disponible; ocho analógicas/DVR no disponibles, fueron hipotéticas.
- **VIGENTE:** memoria documental compartida ya existente (master spec, decision log, project status, agent worklog, AGENTS). **DESCARTADO:** archivo adicional MEMORY.md y segundo documento maestro creado por error; ambos eliminados en commit `2a723211`. No duplicar fuentes de verdad.

## 2026-11-09 — Ejecución P2-08 y retirada del demo Mall (decisión de proceso, sin cambio de canon)

El operador autoriza adelantar P2-08 con06/07 pendientes y retirar la demostración Mall de aplicación/despliegue. Se preservan fuentes reutilizables P1 y datos históricos. Adaptaciones compartidas viven en P1: memoria declarada mediante Núcleo/API Office, cliente autenticado común; P2 solo vincula escena y consume. Sede P2 explícita en el mismo Core evita reescribir topología histórica incompatible. Identidades lógicas sin verificar no afirman personas reales ni presencia. Publicador único de coworking; no reapertura de P3 ni de fases pospuestas.

## 2026-11-09 — P2-08 addendum8.1/8.2/8.2.1 (decisión de proceso)

Se formaliza Coworking como entidad madre del espacioSite, no raíz del modelo mundial completo ni Core paralelo. Contención inversa partOf sin aristas redundantes; personas registeredIn (registro lógico no ubicación física). Población inicial12 y dos organizaciones según definición del operador; condiciones comerciales solo sintéticas/declarativas, no se ejecutan flujos nuevos. P1 amplía tipos/relaciones de su contrato de registro, P2 consume y verifica. Se preservan funciones ya realizadas; planes de visitas/reuniones/pagos no equivalen a llegadas, reservas, confirmaciones o emisión fiscal. Sin P2-09 ni canon nuevo.

## 2026-11-09 — Límite simulador/percepción de addendum8.3 (procesoP2)

Guiones visuales/ground truth pertenecen al simulador/evaluador y no producen hechos Core por sí mismos. Core consume futura percepción funcional o interfaces legítimas; no se inyectan IDs de avatar, poses privilegiadas, trayectorias o llegadas falsas. Se preservan datos sintéticos declarados8.2 con su procedencia; neutralidad de contratos no equivale a presentarlos como observados. Sin cámaras ni pipeline MOT/MTMC-ReID implementados; aislamiento efectivo de runtimeGT pendiente. No cambia canon ni inicia09.

## Decisión de proceso P2-08/8.4 — 2026-11-09

Ejecutar la ampliación declarativa autorizada en444d087 sobre los contratos P1 existentes. CatalogEntry representa tipos con cardinalidad desconocida; no se convierte en un dispositivo instalado. Nuevas Camera previstas tienen capacidades no disponibles, posición/cobertura pendientes y cero feeds. Se conservan las capacidades funcionales previas del kiosco. El estado existente_verificado especifica evidencia digital/definición del operador, nunca instalación o presencia real. Registrar operadora desconocida como rol organizativo sin nombre legal supuesto. Separar puesto lógico de silla física; completar E2–E4 por evidencia de geometría ya existente y respetar doce puestos públicos. Mantener objetos principales sin identificar sin correspondencia espacial; CredentialType/AccessPolicy no otorgan acceso. P1 conserva identidad/persistencia/grafo único; ninguna conexión, operación, percepción ni fase09 autorizada por este modelado. No modifica canon ni aprueba P2-08. Evidencia: phase08/infrastructure.


## 2026-11-09 — Proceso 2 / P2-09: cámaras y percepción espacial (reordenación)
El operador confirma la secuencia P2-09.1–09.9: medición y auditoría del sitio; investigación y montaje virtual de cámaras con fichas técnicas reales; calibración, solapamiento y sincronización espacial/temporal con gemelo; validación de imágenes con dummy temporal sin login; detección real; MOT; re-ID/MTMC real; integración con el mismo ENTITY Core; validación integral. El rango de diseño es de 6 a 8 cámaras en total, sin cantidad definitiva. Dos panorámicas 180° enfrentadas y cuatro a seis convencionales son una hipótesis inicial, sujeta a análisis por el agente de geometría, cobertura, solapamientos, oclusiones y detalle necesario; la selección final debe justificarse. Montaje en techo/pared se decide con geometría y especificaciones, no por regla arbitraria. Ground truth del simulador queda aislado de la percepción; NVIDIA es alternativa, no requisito ni dependencia GPU. Personajes definitivos pausados. RTSP/ONVIF/VMS/Edge y reconstrucción 3D RGB multivista quedan en bitácora para etapa posterior. Esta es numeración **P2** del Proceso 2, no la Fase 09 histórica de P1; no se cambian gates/aprobaciones de P1 ni P3. Plan docs/P2-09.1-CAMERAS-VMS-SPEC.md; checkpoint comparado con P2-08.4 en docs/spatial-simulation/snapshots/P2-09-2026-11-09-BASELINE.md. Cambio exclusivamente documental, sin pruebas de implementación.
