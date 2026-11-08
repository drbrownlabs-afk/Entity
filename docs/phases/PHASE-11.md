# FASE 11 — ENTITY Spatial Intelligence: validación de IA situada sobre mundo espacial operativo
Estado: PLANIFICADA / NO INICIADA. Dependencia estricta: Fase 09 validada y Fase 10 integralmente validada. No implementar ahora, no interrumpir Codex. No es fase multiagente ni integración OpenClaw completa.

## Justificación y distinción con Fase 05/06/09.7
Las fases anteriores prepararon interfaces, consultas, permisos, SDK y pruebas de transporte controlado; NO demuestran que un modelo real interprete el mundo computable con observaciones multicámara reales o sintéticas. La Fase 11 ejecuta una prueba conversacional end-to-end contra el sistema ya funcional: la IA situada responde preguntas sobre quién/qué/dónde/cuándo/por qué, usando únicamente evidencias autorizadas, tiempos, trayectorias e incertidumbre del ENTITY Core. No atribuir respuestas hardcoded o transporte mock a inferencia remota real.

## Arquitectura
Usuario/ENTITY UI → ENTITY Situated AI Gateway (independiente) → proveedor de modelo autenticado → herramientas tipadas read-only de ENTITY Core (estado actual, observaciones, TrackGlobal, hipótesis, rutas, cámara, historial, eventos, calibración) → respuesta con evidencia, incertidumbre y enlaces a objetos del gemelo. Las herramientas/controles del Core deciden acceso y verdad; el modelo no consulta video bruto indiscriminadamente ni crea hechos.

**Autenticación a evaluar como primera opción:** Sign in with ChatGPT y Codex app-server con OAuth, documentado oficialmente por OpenAI para uso de planes de ChatGPT en aplicaciones; OpenClaw demuestra una integración por OAuth pero NO requiere instalar su runtime completo. Investigar elegibilidad, registro/client ID, términos, alcance de modelos, límites, almacenamiento y refresh/revocación de tokens y prueba real de inferencia. Documentación: https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server y https://docs.openclaw.ai/providers/openai/setup . Como alternativas independientes: Codex SDK con login ChatGPT donde corresponda, OpenAI API key (facturación distinta) o modelo local. NO prometer que un token personal arbitrario puede insertarse en cualquier endpoint ni compartir credenciales entre clientes. Nunca copiar auth.json a frontend, Git o servidores multiusuario; almacenamiento seguro y consentimiento del titular.

## Política autónoma — misma fórmula de Fase 09/10
Antes de ejecutar, revisar AGENTS.md, PLANS.md, docs/phases/PHASE-09.md, docs/phases/PHASE-10.md, evidencia de cierre de 10, API Core, seguridad, CI y documentación oficial actualizada. Una vez autorizada Fase 11: ejecutar 11.1→11.8 sin aprobaciones intermedias. Cada gate: implementar→unit/integration/E2E/visual→evaluar PASS/FAIL→corregir y agregar regresión→repetir→registrar logs, comandos, evidencia, SHA y limitaciones→commit/push→continuar. Si falta acceso OAuth o credenciales, registrar NO EJECUTADO y continuar pruebas independientes con proveedor controlado, sin afirmar validación real. Fase integral queda EN VALIDACIÓN para revisión humana.

### 11.1 — Auditoría de IA y contratos
**Objetivo:** inventariar capacidades existentes 05/09.7 y datos reales que aporta 10, sin duplicar.
**Gate:** mapa de consultas, permisos, contratos, fixtures y pruebas de regresión; separar datos observados/inferidos/desconocidos.

### 11.2 — Proveedor y autenticación
**Objetivo:** implementar gateway de modelo con estrategia primaria ChatGPT OAuth/Codex app-server donde sea oficialmente elegible, y fallback de proveedor configurable.
**Gate:** login explícito, sesión, refresh/revocación, errores, cuota y prueba real de turno cuando exista autorización; tests negativos y ningún token expuesto. Sin acceso, NO EJECUTADO para la prueba remota.

### 11.3 — Herramientas de lectura del mundo
**Objetivo:** exponer al modelo consultas tipadas con filtros por sede/rol/tiempo y evidencias.
**Gate:** consultas correctas y denegación de información privada; el modelo no puede ampliar permisos.

### 11.4 — Consultas de estado y trayectoria
**Objetivo:** responder «¿Dónde está esta persona?», «¿qué cámaras la observaron?», «¿dónde estuvo entre 09:00 y 09:10?».
**Gate:** respuestas basadas en TrackGlobal y observaciones, con timestamp, procedencia, cobertura y distinción entre posición observada e inferida.

### 11.5 — Explicación contextual de ReID
**Objetivo:** responder «¿por qué crees que es la misma persona?» y «¿por qué rechazaste la asociación de CAM-05?».
**Gate:** reproducir evidencia visual, tiempo, topología, ruta y razones de decisión desde Core; no fabricar probabilidades ni afirmar identidad civil.

### 11.6 — Memoria, incertidumbre y preguntas adversas
**Objetivo:** consultas históricas, observaciones contradictorias, cámaras caídas, personas parecidas, ausencia de evidencia.
**Gate:** declarar desconocido cuando corresponde; no convertir reservas/check-ins declarados en presencia física; replay/reinicio consistentes.

### 11.7 — Interfaz conversacional situada
**Objetivo:** integrar chat/voz opcional en experiencia desktop/móvil con selección de entidades y salto a gemelo/timeline.
**Gate:** consulta desde selección de cámara/persona, enlaces a evidencias, permisos, estado de carga/error, historial y UX móvil; sin generar un segundo Core.

### 11.8 — Prueba integral y entrega
**Objetivo:** usuario observa recorrido CAM-01→02→05 validado en Fase 10, pregunta a IA situada por identidad de seguimiento, recorrido, cámaras, motivos y casos ambiguos; IA responde desde Core y muestra evidencias en SSOG.
**Gate:** proveedor real autenticado si habilitado, CI/regresión 00–10, E2E desktop/móvil, denegación de datos, fallos de proveedor, logs y capturas, matriz PASS/FAIL/NO EJECUTADO. Fase 11 solo se considera validada integralmente tras pruebas reales y revisión humana.

## Fuera de alcance
OpenClaw completo, agentes autónomos, delegación y multiagentes, acciones operativas no autorizadas, reconstrucción del sistema de cámaras, inferencia visual desde cero y funcionalidades comerciales ajenas. La fase posterior podrá estudiar agentes independientes, pero no debe bloquear esta demostración.


## DECISIÓN ARQUITECTÓNICA VINCULANTE — OpenClaw como runtime existente (2026-11-07)
**Sustituye cualquier recomendación previa de crear un 'ENTITY Agent Runtime' o gateway de modelos propio.** Reutilizar OpenClaw oficial (Gateway, runtime embebido, sesiones, proveedor/modelo, onboarding, bootstrap, workspace, skills, plugins/MCP, herramientas, política, sandbox, memoria) como base. Crear **UN SOLO agente OpenClaw con id `entity` y nombre ENTITY**; no múltiples agentes, no framework de agentes nuevo. Su workspace inicial es ENTITY Spatial Intelligence, pero su identidad y runtime no se limitan conceptualmente a este workspace/vertical. No confundir agente con ENTITY Core: Core sigue siendo el mundo computable y fuente de verdad; OpenClaw ejecuta el razonamiento y la conversación.

**Workspace real compatible con OpenClaw:** `AGENTS.md` (operación), `IDENTITY.md` (nombre ENTITY), `SOUL.md` (carácter configurable), `USER.md` (preferencias y tratamiento por organización cuando proceda), `MEMORY.md` y `memory/YYYY-MM-DD.md` (memoria de agente, NO sustituto de eventos/estado Core), `BOOTSTRAP.md` (onboarding de una sola vez, no archivo que se recarga permanentemente), `skills/<nombre>/SKILL.md` (skills con frontmatter). `TOOLS.md` puede documentar convenciones, pero NO concede permisos; `BOOT.md` es opcional si se habilita hook de inicio. No sobreescribir el `AGENTS.md` del repositorio de desarrollo con instrucciones conversacionales: aislar workspace del agente en directorio dedicado y versionar plantillas sin secretos.

**Personalización empresarial:** identidad global ENTITY estable; configurar perfil por organización/sede/rol con personalidad, tono, idioma, estilo de interacción, nombre público autorizado, protocolos de recepción y límites. No permitir que la personalización altere reglas centrales, permisos o veracidad. Diferenciar perfil de empresa (config persistente en Core) de archivo global SOUL; resolver contexto autorizado por sesión/sede, sin mezclar empresas ni reescribir el workspace global ante cada usuario. Bootstrap puede instalar perfiles predeterminados; cambios posteriores auditados y versionados.

**Skills iniciales de ENTITY (mínimas, propias y read-only):** `entity-world-query` (entidades/estado/relaciones), `entity-camera-evidence` (Camera/Stream/Observation/TrackLocal/TrackGlobal, cobertura y calibración), `entity-spatial-reasoning` (rutas/zonas/hipótesis de asociación, no inventar observaciones), `entity-timeline` (eventos y memoria histórica), `entity-operations-read` (reservas/ocupación/incidencias). Definir cada SKILL.md como guía de uso de herramientas realmente disponibles; no crear herramientas falsas. Las operaciones con efectos (reservar, abrir acceso, notificar, controlar HVAC) serán capacidades separadas y deshabilitadas por defecto, con autorización del Core, auditoría y confirmación cuando aplique.

**Integración de herramientas:** publicar adaptador delgado ENTITY Core → herramientas tipadas OpenClaw, preferentemente MCP existente/bundle MCP o plugin compatible; reutilizar API/MCP de Fase 05 y Core, sin duplicar ontología ni permisos. Contratos con site_id, actor_id, roles, ventana temporal, provenance, evidence_ids, expiración, incertidumbre. El backend valida identidad, scopes y acciones por solicitud. No otorgar shell, filesystem amplio, browser, gateway admin, cron, nodes, sesiones cruzadas o mensajería a este agente por defecto. Aplicar allowlist concreta en OpenClaw y `tools.gatewayPolicy` si está disponible; no confiar en prompts. Sandbox y secretos separados, logs sin tokens.

**Modelos intercambiables:** usar `openclaw models` y auth oficial del proveedor, incluyendo login ChatGPT/Codex OAuth cuando sea compatible con el despliegue y permisos vigentes; Anthropic y modelos locales como alternativas. El workspace, skills, permisos y ENTITY Core permanecen constantes. Ejecutar pruebas con dos proveedores y comparar resultados, sin suponer paridad ni reutilizar tokens de forma no autorizada.

**Orden de ejecución revisado en 11.1–11.8:**
- 11.1 auditar OpenClaw instalado/versión, APIs Core, riesgos y contratos, comparar con documentación oficial actual; NO implementar runtime nuevo.
- 11.2 instalar/configurar Gateway oficial, crear único agente `entity`, configurar workspace y onboarding/identidad; verificar «¿quién eres?» responde ENTITY tras reinicio.
- 11.3 crear skills propias y exponer herramientas Core vía adaptador MCP/plugin, aplicar políticas de acceso reales; probar denegaciones y aislamiento por sede.
- 11.4 autenticar proveedor OpenAI vía opción ChatGPT OAuth oficial si elegible, probar Claude/local alternativo; cambiar modelo manteniendo identidad y herramientas.
- 11.5 consultas actuales e históricas del mundo, cámaras y trayectorias con evidencia.
- 11.6 explicaciones ReID contextual, incertidumbre, preguntas adversas, fallos y memoria.
- 11.7 integrar interfaz desktop/móvil con Gateway por backend seguro, perfiles empresariales, sesiones aisladas y personalización de SOUL/perfil sin elevar privilegios.
- 11.8 E2E completo, CI/regresión, 2 proveedores cuando estén disponibles, persistencia, seguridad, experiencia, métricas, documentación y revisión humana.

**Gates transversales:** al cerrar cada subfase ejecutar pruebas y corregir hasta PASS; guardar evidencia/commits; continuar automáticamente. La Fase 11 no inicia antes del cierre de Fases 09 y 10, pero el diseño y plantillas pueden prepararse ahora. El agente es UNO, llamado ENTITY; no construir OpenClaw alternativo ni posponer esta elección. Si una capacidad concreta de OpenClaw no existe en la versión instalada, documentar la brecha y adaptar únicamente esa interfaz, nunca duplicar Gateway/sesiones/memoria/skills.

**Documentación oficial consultada:** https://docs.openclaw.ai/concepts/agent ; https://docs.openclaw.ai/concepts/agent-workspace ; https://docs.openclaw.ai/start/bootstrapping ; https://docs.openclaw.ai/tools/skills ; https://docs.openclaw.ai/gateway/config-tools/tool-policy ; https://docs.openclaw.ai/gateway/config-agents/entries-and-multi-agent ; https://docs.openclaw.ai/gateway/security/tool-permissions .
