# MEMORY — ENTITY | Memoria persistente del proyecto
**Actualización:** 2026-11-08. **Rama:** `codex/spatial-simulation`.
**Función:** conservar decisiones aprobadas, decisiones descartadas, arquitectura y continuidad entre sesiones de ChatGPT/Codex. **Leer este archivo al iniciar trabajo** y contrastarlo con código, documentación y últimas instrucciones del operador. No es una transcripción completa de conversaciones ni sustituye pruebas técnicas.

## 1. Decisiones vigentes e innegociables
- Marca principal: **ENTITY**; vertical actual: **ENTITY Spatial Intelligence**.
- Arquitectura: **un único modelo del mundo computable, persistente y compartido**, que representa y relaciona **todo**: espacios, geometría, personas, organizaciones, cámaras, dispositivos, documentos, CRM, facturación, reservas, accesos, seguridad, biometría, redes, eventos y memoria. **El modelo del mundo no es un subsistema más** ni una simple copia 3D. Los sistemas externos conservan autoridad sobre sus datos.
- ENTITY Core existente = entidades/identidad, estado, relaciones, eventos, memoria, capacidades, procedencia, permisos y API. No reconstruirlo ni duplicarlo. El 3D es interfaz y simulación, no el Core. Un gemelo digital no requiere 3D por definición, pero este producto sí exige escena 3D y sincronización operativa.
- **Tres procesos, no una numeración global de fases**:
  1. **Proceso 1 — Software ENTITY:** construcción original detenida en **Fase 09**. No existen Fases 10 ni 11 por ejecutar aquí. El operador da por concluido ese bloque; verificar por separado gates y defectos técnicos.
  2. **Proceso 2 — Gemelo digital operativo del coworking:** ACTIVO. Incluye **todo** el coworking digital, no solo Blender/PlayCanvas, no solo cámaras. Las fases históricas 01–07 son únicamente construcción del entorno 3D; **no cierran el proceso**. Después siguen cámaras, percepción, dispositivos, seguridad, biometría, reservas, CRM, facturación, Drive, redes y operación real sincronizada.
  3. **Proceso 3 — Inteligencia situada y multiagentes:** POSTERIOR. Agentes especializados en seguridad, facturación, reservas, CRM, redes, mantenimiento, etc. Trabajan sobre **el mismo modelo del mundo** con permisos, memoria, herramientas y acciones auditadas.
- La **antigua Fase 11** del software (`docs/phases/PHASE-11.md`: Camera Gateway, calibración, ReID, TrackGlobal e inferencia espacial) se **reasigna como alcance técnico al Proceso 2**, sin conservar su número ni dependencia de agentes.
- La **antigua Fase 10** del software (`docs/phases/PHASE-10.md`: agente ENTITY con OpenClaw) se **reasigna como alcance técnico al Proceso 3**, sin reabrir Fase 10 del Proceso 1.
- Los documentos con secuencias globales de Fases 08–15 están **obsoletos**. La especificación rectora consolidada es `docs/spatial-simulation/ENTITY-MASTER-PROCESSES-2026-11-08.md`. Este archivo MEMORY registra la decisión, no debe contradecirla.

## 2. Proceso 2 — Alcance integral
**Escenario:** Synthetic Office/coworking reconstruido en Blender y PlayCanvas, con espacios, materiales, iluminación, puertas, mobiliario, navegación web, dispositivos y personas. La mejora visual 04.5 se aplazó, no se canceló. Validar fase 05 (incluido clic/tap al suelo para caminar), fase 06 (personajes), fase 07 (integración de escena); no inventar gates aprobados.
**Personajes:** los dummies geométricos fueron **DESCARTADOS** porque resultaban demasiado fáciles de distinguir para pruebas de visión. El operador **seleccionó aproximadamente 12 personajes humanos realistas de Adobe Mixamo**. No volver a proponer dummies como decisión vigente. Animaciones, rutas, oclusiones, persistencia de identidad interna; los algoritmos de cámaras no reciben ID interno del NPC.
**Cámaras PRIMERO después del bloque 3D:** seleccionar modelos comerciales reales y documentar fabricante/modelo, lente, sensor, FOV, resolución, FPS, codecs, PTZ si existe, configuración, pose, calibración y cobertura. Simular cámaras ausentes con gemelos fieles y observaciones renderizadas **desde la misma escena**, no clips ficticios desconectados. Camera Gateway para ONVIF/RTSP/NVR/VMS/USB/SDK según compatibilidad. Detección, tracking, ReID, TrackGlobal, inferencia contextual (rutas, tiempos, obstáculos, puertas), métricas, incertidumbre y trazabilidad. Separar ground truth, observación e inferencia.
**Todo lo demás también forma parte del mismo Proceso 2:** seguridad, cerraduras, control de acceso, alarmas, biometría, calendarios, agendamiento, reservas, membresías, CRM, facturación/pagos, documentos/Google Drive, recepción, mantenimiento, infraestructura de red y operaciones. **Integrar software empresarial REAL mediante APIs oficiales**: no crear clones de CRM, Drive, calendarios o facturación. Hardware físico ausente sí puede representarse mediante gemelos de modelos comerciales documentados; identificar virtual vs real.
**Impacto:** investigar específicamente qué plataformas/proveedores usa realmente el coworking Impacto para reservas, CRM, membresías, facturación, accesos y pagos. No inventar su stack; verificar con evidencia antes de decidir conectores.
**Operación live:** un solo mundo con estados, relaciones, eventos y memoria; visualización 3D conectada; fuentes con procedencia, latencia, permisos y manejo de conflictos. Diferenciar conectado real / virtual / replay / sin credenciales / sin hardware / error. No declarar tiempo real si solo hay replay o polling.
**Cierre del Proceso 2:** coworking digital operativo integral con evidencia de funcionamiento de sus integraciones y de su modelo del mundo, sin depender de agentes autónomos. Pendientes por credenciales/hardware deben declararse, nunca presentarse como terminados.

## 3. Proceso 3 — Alcance posterior
Reutilizar especificación histórica del agente ENTITY/OpenClaw como runtime, **no como sustituto de ENTITY Core**. Diseñar coordinación multiagente especializada: seguridad, reservas, facturación, redes, CRM y mantenimiento. Cada agente consulta y actúa sobre el mismo modelo del mundo con rol, herramientas, permisos, confirmaciones y auditoría. No empezar a construir un segundo Core, un segundo grafo ni agentes que simulen integraciones inexistentes.

## 4. Reglas de trabajo y memoria
- **Nunca confundir decisiones iniciales con decisiones finales.** Registrar explícitamente: `DECISIÓN VIGENTE`, `DESCARTADO`, `PENDIENTE`, `VERIFICADO` y fecha; cuando cambie algo, conservar la trazabilidad y marcar la decisión sustituida.
- **Al comenzar sesión:** leer `MEMORY.md`, el documento maestro, `AGENTS.md`, `docs/spatial-simulation/IMPLEMENTATION-PLAN.md`, trabajo y pruebas reales; verificar rama y estado antes de ejecutar.
- **Al terminar sesión/cambio:** actualizar esta memoria con decisiones nuevas, trabajo completado, evidencias, bloqueos y próxima acción. No atribuirse lectura íntegra de chats no disponibles.
- No fusionar ni modificar `main` sin autorización; no modificar backend/frontend del Proceso 1 desde la rama 3D sin permiso; no guardar credenciales o biometría sensible en Git.
- Distinguir explícitamente `planificado`, `implementado`, `probado`, `desplegado`, `aprobado`.
- Arquitectura SaaS centralizada en nube; Edge solo para captura/procesamiento local imprescindible.

## 5. Fuentes de referencia
- `docs/spatial-simulation/ENTITY-MASTER-PROCESSES-2026-11-08.md`: **documento maestro vigente**.
- `docs/spatial-simulation/IMPLEMENTATION-PLAN.md`: fases internas históricas 01–07 del bloque 3D; no cierra el Proceso 2.
- `docs/phases/PHASE-11.md`: referencia técnica de cámaras, **ahora Proceso 2**.
- `docs/phases/PHASE-10.md`: referencia técnica de agente, **ahora Proceso 3**.
- `docs/spatial-simulation/DECISION-REASIGNACION-10-11.md`: decisión de reasignación.
- `docs/spatial-simulation/MASTER-ROADMAP-08-15.md`: **OBSOLETO, NO EJECUTAR**.

## 6. Estado y próxima acción
**Proceso 2 activo** en construcción/validación del coworking 3D. Tras el bloque 3D, priorizar cámaras comerciales y percepción; **continuar** con todas las integraciones operativas y dispositivos para completar el gemelo digital integral. Proceso 3 queda posterior. El registro de esta memoria **no certifica** nuevas implementaciones, pruebas ni aprobación de gates.
