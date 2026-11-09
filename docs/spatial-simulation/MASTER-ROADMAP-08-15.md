# ENTITY Spatial Simulation — Plan maestro integral posterior al gemelo 3D
**Decisión del operador: 2026-11-08. Rama exclusiva:** `codex/spatial-simulation`.
**Naturaleza:** memoria persistente de producto, arquitectura, alcance, fases y criterios de aceptación. Este documento rige esta línea de trabajo y NO renumera ni reemplaza las fases de ENTITY OS definidas en `PLANS.md` u otras ramas.

## 0. Decisiones vinculantes
1. **01–07 = gemelo tridimensional.** Fase 05: PlayCanvas funcional y publicación web; Fase 06: personajes humanos Mixamo, identidad, navegación y control; Fase 07: integración y aceptación del escenario 3D. No considerar aprobado un gate sin evidencia y revisión del operador. El trabajo visual de Fase 04.5 se aplaza; preservar sus archivos y parámetros, no consumir más tiempo en renders HQ por defecto.
2. **08 en adelante = coworking operativo real conectado al gemelo.** No son nuevas fases de modelado arquitectónico ni se mezclan con numeraciones de otra rama.
3. **Software auténtico, no imitaciones.** Integrar Google Drive REAL mediante su API y autorización; CRM REAL, agenda/reservas REAL, calendarios y demás sistemas empresariales reales, elegidos tras investigación y decisión de producto. No fabricar un “Drive falso”, “CRM falso”, ni interfaces decorativas. Para pruebas automatizadas se admiten fixtures y mocks de transporte, claramente etiquetados, pero el entregable funcional debe demostrar conectores a servicios reales autorizados.
4. **Excepción física:** cuando no haya cámaras, DVR/NVR, lectores biométricos, cerraduras o sensores físicos, construir gemelos digitales fieles a fabricantes/modelos reales, con parámetros, capacidades, protocolos, estados y comportamiento simulados. Nunca afirmar que un equipo virtual es un dispositivo real conectado. Las integraciones de hardware deben admitir sustitución posterior por dispositivos reales sin cambiar ENTITY Core.
5. **Los subsistemas conservan autoridad y autonomía.** Una reserva no equivale a ocupación observada; un acceso autorizado no demuestra entrada; una detección no prueba identidad. Preservar fuente, timestamp, certeza, procedencia y discrepancias. No alimentar ENTITY con verdad interna omnisciente del simulador como si fuera evidencia de sensores.
6. **ENTITY Core es único y existente:** Entidades, Estado, Relaciones, Eventos, Memoria y capacidades. No duplicar Core ni backend/frontend de otras ramas. Integrar mediante contratos y adaptadores; las modificaciones de Core fuera de esta rama requieren autorización explícita y coordinación con su línea de desarrollo.
7. **Arquitectura de producto:** ENTITY SaaS y lógica central en nube; Edge gestionado únicamente para captura/procesamiento local imprescindible y envío de datos/eventos estructurados. No instalar una copia del SaaS en el cliente.
8. **Rama y entrega:** trabajar solo en `codex/spatial-simulation`; nunca fusionar a `main`, cambiar código protegido, publicar secretos, inventar pruebas ni confundir esta planificación con `PLANS.md`. Registrar cada decisión, proveedor, limitación, prueba y avance en esta misma rama.
9. **No iniciar automáticamente todas las fases por existir este plan.** Este documento autoriza planificación y preparación. Ejecutar únicamente fases expresamente autorizadas por el operador. No bloquear tareas independientes con espera de renders/procesos largos; respetar `AGENTS.md`.
10. **Agente encarnado:** explorar OpenClaw (nombre a verificar frente a “OpenCloud”) como runtime/adaptador, no como sustituto de ENTITY Runtime ni del modelo del mundo. La referencia del operador a “OpenAI o1” es histórica y requiere comprobar vigencia, APIs, autenticación, costos y modelo adecuado antes de implementarla; no asumir acceso API por una suscripción ChatGPT.

## 1. Meta del laboratorio
Construir un **coworking digital operativo** con arquitectura 3D, personas, empresas, reservas, operaciones, cámaras, seguridad, accesos, dispositivos, archivos, CRM, calendarios y agentes. Cada fuente funciona con sus reglas reales; ENTITY entidadiza la información y mantiene un modelo del mundo computable y consultable. El gemelo PlayCanvas es una interfaz espacial del modelo, no el núcleo inteligente. El laboratorio debe permitir ensayos reproducibles de jornadas, incidentes, conflictos de datos, intervenciones y recuperación.

## 2. Contrato transversal para cualquier integración
Cada conector debe documentar: proveedor/versión/API oficial; autorización OAuth u otro mecanismo legítimo; scopes mínimos; entidades y IDs externos; esquema de capacidades; operaciones de lectura y escritura; eventos/webhooks/polling acotado; sincronización inicial e incremental; idempotencia; errores/rate limits/reintentos; procedencia; latencia; auditoría; revocación; manejo de secretos fuera de Git; prueba real en cuenta de laboratorio autorizada. Usar adaptadores reemplazables con mapeo de IDs externos ↔ IDs ENTITY; jamás duplicar lógica de negocio del proveedor ni asumir permisos que no existen.
Los sistemas deben tener estados **real conectado / dispositivo virtual / fixture de prueba / desconectado** visibles y verificables. Las acciones con efectos externos requieren permisos, confirmaciones y registro. Diseñar consentimiento, minimización de datos, retención y controles de acceso desde el inicio; biometría física real solo con autorización y salvaguardas apropiadas.

## 3. Fases 01–07: bloque espacial existente, SIN RENÚMERAR
- **01–04:** reconstrucción arquitectónica, espacios, materiales, dispositivos, iluminación y maestros Blender (ver `IMPLEMENTATION-PLAN.md`).
- **04.5:** calidad de referencia: **aplazada**; conservar evidencia y pipeline.
- **05:** GLB + PlayCanvas; recorrido tipo SuperSplat **clic/tap para caminar** por ruta transitable, mirada libre, colisiones, selección, puertas/luces, GitHub Pages y enlace probado. La existencia de código no equivale a aceptación.
- **06:** personajes Mixamo (objetivo 12, mínimo 10), rig/animaciones, rutas, colisiones, estados, identidad persistente, selección y cambio de control; sin fingir observaciones de cámaras. Acceso legítimo a Mixamo cuando haga falta.
- **07:** aceptación del gemelo espacial integrado, pruebas de navegador, inventario/IDs, escenas y operaciones 3D; cierre del bloque de construcción 3D, no de ENTITY.

## 4. Fase 08 — Base de interoperabilidad y mapa de sistemas reales
**Objetivo:** inventariar procesos y aplicaciones que usa un coworking real y definir cómo sus datos llegan a ENTITY. Investigar y seleccionar proveedores concretos con APIs utilizables; no suponer que todos ofrecen webhooks o permisos de escritura.
**Entregables:** matriz de proveedores/capacidades (CRM, reservas, calendarios, Drive, facturación, accesos, VMS/NVR, IoT, operaciones); contratos de eventos/entidades; catálogo de credenciales/scopes sin secretos; identidad y vinculación de miembros, empresas, salas, activos y ubicaciones; sandbox/cuentas reales autorizadas; reloj y orquestador de escenarios de laboratorio separados de las fuentes reales; diseño de persistencia/auditoría. Priorizar conectores con APIs documentadas y cuentas de prueba disponibles.
**Gate:** al menos dos sistemas externos reales elegidos y conectables mediante credenciales legítimas, contratos probados y un flujo de eventos trazable sin datos inventados.

## 5. Fase 09 — Software empresarial real y operaciones del coworking
**Objetivo:** integrar **aplicaciones existentes** en vez de recrearlas.
**Ámbitos:** Google Drive real (archivos, metadatos, permisos y cambios permitidos); Google Calendar/Microsoft 365 u otro calendario elegido; reservas de salas/puestos mediante proveedor real o software open source desplegado como producto auténtico; CRM real para empresas, leads y miembros; cuando corresponda facturación, tickets/mantenimiento, inventario y notificaciones a través de productos/APIs reales.
**Diseño:** cada producto sigue siendo sistema de registro de sus datos; ENTITY construye relaciones entre empresa–miembro–reserva–sala–documento–incidencia. No convertir documentos en conocimiento público; respetar permisos y consentimiento.
**Gate:** flujo end-to-end real: crear/modificar una reserva autorizada, relacionar calendario y miembro/empresa, consultar un documento permitido y reflejar eventos/estados en ENTITY y gemelo; verificar escritura/lectura, fallos y revocación. No declarar conectado un servicio solo por mostrar su nombre.

## 6. Fase 10 — Seguridad, cámaras y control de acceso
**Objetivo:** reproducir un sistema CCTV/accesos comercial creíble y conectable a hardware real.
**Cámaras:** investigar marcas ampliamente instaladas (p. ej. Hikvision, Dahua, Axis) y elegir modelos exactos según documentación; catálogo de fabricante, firmware, resolución, sensor, lente, FOV, orientación, intrínsecos/extrínsecos, PTZ, FPS, codec, streams, exposición, red, capacidades ONVIF/RTSP y APIs reales cuando existan. Colocar cada cámara como entidad con transform `T_world_camera`, cobertura, oclusiones y relaciones con espacios. Integrar VMS/NVR/DVR existentes por interfaces soportadas; no prometer acceso a grabadores sin credenciales autorizadas. Para cámaras ausentes, emular configuración/telemetría y generar vistas sintéticas etiquetadas.
**Accesos:** modelar lectores, cerraduras, credenciales, permisos, puertas, alarmas, logs y biometría **simulada** con especificaciones de productos reales. No crear bases de huellas o rostros de personas reales sin necesidad/consentimiento. Si hay hardware autorizado, conectar mediante SDK/API y registrar límites.
**Gate:** configurar una cámara virtual de modelo documentado y un dispositivo de acceso, ver cobertura y parámetros en 3D, generar eventos trazables; demostrar un adaptador real de protocolo/API cuando haya dispositivo o servicio accesible; distinguir claramente virtual de físico.

## 7. Fase 11 — Percepción espacial y continuidad multicámara
**Objetivo:** convertir streams/vistas sintéticas o reales autorizadas en observaciones, sin acceso privilegiado a IDs internos de NPC.
**Capacidades:** detección, tracking por cámara, calibración, mapeo al espacio, asociación temporal, ReID multicámara con confianza, oclusiones, cruces, pérdida/recuperación de seguimiento, ocupación y alertas. Separar `ground truth` de simulación, observaciones, inferencias y estado confirmado. Registrar errores, falsas asociaciones y desconocidos.
**Gate:** escenario reproducible con varias cámaras, personas similares y oclusiones; métricas de tracking/ReID, latencia y procedencia; eventos de ocupación y discrepancias con reservas/accesos. No afirmar reidentificación perfecta.

## 8. Fase 12 — ENTITY Core: modelo del mundo compartido
**Objetivo:** consumir datos de todas las fuentes anteriores en el Core existente mediante contratos, sin duplicarlo.
**Modelo:** entidad/identidad, estado temporal, relaciones explícitas, eventos, memoria, capacidades, fuente, confianza y políticas. Ejemplos: reserva activa pero sala vacía; acceso válido sin observación; persona observada sin reserva; incidencia de mantenimiento que afecta disponibilidad; archivo relacionado con contrato y miembro. Separar simulación y fuentes reales en toda consulta.
**Gate:** consultas y línea temporal multi-fuente verificables, resolución explícita de conflictos y operaciones autorizadas de retorno a sistemas de origen. El gemelo visualiza el estado computable sin hacerse fuente de verdad universal.

## 9. Fase 13 — IA situada y agente encarnado
**Objetivo:** agente con contexto actualizado del coworking, capaz de percibir, razonar, consultar y actuar con permisos; no solo chatbot conectado a APIs.
**Investigación obligatoria:** revisar OpenClaw, su arquitectura/seguridad/licencia y compatibilidad con ENTITY Runtime; evaluar adaptador de herramientas y runtime sin acoplar el Core; verificar opciones actuales de modelos de OpenAI, APIs, autenticación y costos (incluida la referencia histórica del operador a o1). La suscripción ChatGPT no implica automáticamente créditos API. No elegir tecnología sin comprobación.
**Operación:** herramientas tipadas para consultar modelo del mundo, agenda, CRM, Drive, dispositivos y seguridad; identidad del agente, memoria de decisiones, permisos, confirmación para efectos externos, logs y explicación de procedencia. La encarnación es espacial/operativa: sabe dónde actúa y qué entidades/relaciones afecta. OpenClaw, si se utiliza, es adaptador/runt​ime de agente, no reemplazo de ENTITY.
**Gate:** agente resuelve escenarios contextualizados y propone/ejecuta acciones autorizadas verificables; fallos y ambigüedad reconocidos, sin permisos implícitos.

## 10. Fase 14 — Operaciones, escenarios y evaluación integral
**Objetivo:** jornada completa de coworking en laboratorio con sistemas reales conectados, personajes y dispositivos virtuales donde falte hardware.
**Escenarios:** llegada de miembro y validación de acceso; reserva vs ocupación; reunión retrasada; visitante no identificado; alarma falsa; puerta bloqueada; avería; sobreocupación; cambios de calendario; documentos restringidos; desconexión de cámara; datos contradictorios; recuperación de conexión; acción de agente con aprobación.
**Gate:** pruebas repetibles de extremo a extremo, métricas de precisión/latencia, trazabilidad, seguridad, fallos, degradación y recuperación, coste operacional, demostración accesible en web y documentación reproducible.

## 11. Fase 15 — Preparación de piloto real y escalabilidad
**Objetivo:** sustituir fuentes virtuales por conectores a coworking autorizado sin reconstruir ENTITY.
**Entregables:** inventario de equipos reales y acceso legítimo, compatibilidad y límites de VMS/NVR, diseño Edge por ambiente si se requiere, red/privacidad, plan de despliegue SaaS, multi-sede, permisos, observabilidad, soporte y costos. No afirmar propiedad de cámaras/DVR no disponibles; el equipo Orbbec y los dispositivos futuros deben distinguirse.
**Gate:** plan de piloto ejecutable con pruebas de integración y aceptación de seguridad; cualquier instalación física queda sujeta a autorización del lugar.

## 12. Dependencias y límites de ejecución
Secuencia lógica: 05→06→07→08→09/10 (pueden avanzar en paralelo tras contratos)→11→12→13→14→15. El Core puede conectarse incrementalmente desde 08, sin esperar artificialmente hasta 12; la Fase 12 consolida y valida integración completa. La percepción multicámara no debe bloquear Drive/CRM/reservas. No implementar motores avanzados de inferencia geodésica, relaciones latentes o multiagente sofisticado como requisito del primer piloto; mantener extensibilidad. Cada fase entrega código, configuración, pruebas reales/virtuales diferenciadas, documentación, enlace o demo cuando proceda y estado del gate.

## 13. Estado de ejecución y próxima acción
**Actual:** validar Fase 05 publicada, luego Fase 06 personajes y Fase 07 cierre del gemelo 3D, conforme a las autorizaciones más recientes del operador. Este plan posterior NO certifica ninguna de esas fases ni ordena iniciar 08–15 de inmediato.
**Próxima preparación documental:** investigar aplicaciones comerciales reales y estándares de CCTV/accesos, contrastar capacidades y licencias, presentar selección concreta antes de comprometer proveedores. Nunca sustituir silenciosamente integración real por simulador de software.

## 14. Reglas de continuidad entre agentes
Al iniciar cualquier trabajo en esta rama: leer **este archivo**, `IMPLEMENTATION-PLAN.md`, `AGENT-WORKLOG.md` y `AGENTS.md`; contrastar el estado real de código, no inferir completitud de una conversación. Al cerrar: registrar decisiones y evidencia en repositorio, actualizar estados y próximos pasos; no repetir propuestas aprobadas como ideas nuevas. Si hay contradicción entre planes de distintas ramas, este documento rige **únicamente** la línea `codex/spatial-simulation`; solicitar decisión del operador antes de modificar otra línea.
