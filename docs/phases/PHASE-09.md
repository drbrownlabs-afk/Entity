# FASE 09 — ENTITY Spatial Intelligence: Synthetic Office
Estado: PLAN AUTORIZADO PARA EJECUCIÓN AUTÓNOMA 09.1–09.9; implementación no iniciada por este documento.
Escenario: https://superspl.at/scene/a972d838
Continuidad: fases 00–08, ENTITY Core/Edge/Experience, contratos existentes. No borrar ni reemplazar el centro comercial anterior.

## Objetivo de producto
Demostración integral de un centro de trabajo computable: Gaussian Splat realista en dollhouse, personajes, cámaras CCTV, reservas, ocupación, flujos, sensores, climatización, energía, mantenimiento, seguridad, memoria persistente, consultas de IA situada, explicabilidad y escenarios hipotéticos. Todo comparte UNA simulación, UN reloj y el modelo ENTITY (entidades, estado, relaciones, eventos, memoria y capacidades). No construir nueve demos independientes ni un dashboard decorativo.

## Experiencia integral y casos narrativos
- 08:00: preparación basada en reservas, iluminación y HVAC.
- 09:15: llegadas; Luis aparece en CAM-01 y CAM-02 y en el gemelo, accede a DESK-03; diferencia entre identidad autorizada, track anónimo y presencia inferida; no-show de reservas.
- 10:30: reunión de seis personas; sala ocupada, agenda, ventilación, CO2 y confort.
- 11:20: reunión extendida, conflicto de reserva, alternativa, notificación y acción registrada.
- 14:00: avería HVAC, temperatura de zona, puestos/personas/reservas afectados, propuesta de reubicación, ticket de mantenimiento, efecto después de acción.
- 16:00: evento de seguridad por discrepancia entre zona/horario/autorización; CCTV, investigación y evidencias.
- 18:30: salida, ahorro energético, uso histórico, resumen de jornada.
- Exploración libre: seleccionar cualquier persona, puesto, sala, zona, cámara o equipo; ver estado, relaciones, fuentes, historial, reservas y acciones.
- Consultas: ¿Dónde está Luis ahora? ¿Dónde estaba a las 10? ¿Qué pasó hoy aquí? ¿Qué reunión hay a las 16 y 18? ¿Por qué subió la temperatura? ¿Qué cambió desde ayer? ¿Qué equipos y reservas afectó la incidencia?
- Escenarios what-if: cierre de zona, avería HVAC, ocupación inesperada; comparar impacto antes de ejecutar sin contaminar la línea temporal principal.

## Arquitectura no negociable
1. El gemelo digital permanece visible/accesible en TODOS los modos; CCTV en grid con ampliar cámara y alternar foco cámara/dollhouse; sincronización bidireccional de entidad, zona, selección y tiempo.
2. PlayCanvas renderiza la escena, las cámaras y personajes GLB/GLTF animados; Blender solo para preparar assets dinámicos si hace falta, NO para rehacer edificio ni generar colisiones.
3. SuperSplat y splat-transform para optimización SOG/Streamed SOG, anotaciones 3D, voxels y colisiones; utilizar flujo existente/oficial. El acceso a herramientas alojadas puede exigir autorización; no afirmar que se ejecutó si no ocurrió. Inspeccionar el sitio mediante sus vistas y anotaciones, sin volver a pedir benchmarking general del entorno. Adaptar cantidad y tipo de recursos al espacio real; no inventar salas inexistentes.
4. Segmentación por prompts opcional y no bloqueante: si es viable, aislar mobiliario; si no, inventario semántico mediante anotaciones SuperSplat con IDs, coordenadas y metadatos. No inventar un sistema paralelo de anclajes.
5. Conectores CCTV, acceso, reservas, sensores/HVAC y mantenimiento separados, con observaciones sintéticas y contratos intercambiables por integraciones reales; Core agnóstico de render, cámaras y proveedores.
6. Personajes y cámaras usan el mismo estado y reloj, no vídeos inconexos. La correlación entre cámaras requiere evidencia; identidad personal proviene de fuentes autorizadas, no reconocimiento facial supuesto.
7. Memoria de Core: eventos duraderos, snapshots y tracks consultables tras reinicio. Reconstrucción histórica de estados, relaciones, personas, cámaras (observaciones disponibles), logs y métricas. Diferenciar vídeo, reconstrucción e interpolación.
8. IA situada consulta datos reales de la simulación/Core con procedencia y tiempo; no respuestas hardcoded por frase. Acciones autorizadas, resultados y explicaciones auditables. Simulación what-if aislada del estado oficial.
9. Fase MVP: reglas y relaciones explícitas, no motores avanzados de inferencia latente, geodésica, 4DGS en vivo, re-ID biométrico ni multiagente sofisticado.
10. Publicación estática puede funcionar en modo autónomo claramente rotulado; no afirmar persistencia compartida del Core cuando solo exista estado local. Mantener la opción de conexión al Core real.

## Subfases y puertas de calidad (gate automático)
### 09.1 — Espacio computable
Implementar Synthetic Office, calidad web, dollhouse/interior, colisiones voxelizadas, navegación, cámaras y anotaciones SuperSplat. Inventariar escritorios, mesas, salas reales, pasillos, accesos, zonas, sensores y equipos con IDs estables.
Gate: escena carga, se navega sin atravesar paredes/suelo en rutas principales; IDs seleccionables y ubicados correctamente; capturas/evidencia de cámara y anclajes; no regresión viewer anterior.

### 09.2 — Mundo simulado compartido
Reloj determinista, personas ficticias animadas, rutas, entradas/salidas, ocupación, simulación de conectores y eventos Core.
Gate: pausa/reinicio/replay deterministas; posición de personaje coincide en vistas y estado; eventos con timestamps; tests de sincronía.

### 09.3 — Seguridad y CCTV
Grid, fullscreen, cambio a gemelo, selección sincronizada, cobertura, accesos, alertas y tracking no biométrico.
Gate: persona atraviesa dos cámaras y dollhouse sin divergencia; alerta justificada por observación + autorización; histórico recuperable.

### 09.4 — Reservas, agenda, ocupación y flujos
Puestos/salas, check-in, no-show, conflictos, extensión, reasignación, circulación y densidad.
Gate: reserva cambia disponibilidad; ocupación no equivale automáticamente a reserva; conflicto y resolución producen eventos y estados coherentes.

### 09.5 — Confort, energía y mantenimiento
Sensores sintéticos por zona (temperatura, humedad, CO2, iluminación), HVAC, energía estimada, equipos, fallos y tickets.
Gate: fallo HVAC afecta solo dependencias espaciales pertinentes, crea ticket, identifica reservas/personas afectadas y permite resolución auditada.

### 09.6 — Memoria persistente y timeline
Snapshots/eventos/tracks; reconstrucción por tiempo; filtros por entidad/zona/evento; logs y cámaras históricas; métricas históricas.
Gate: reinicio no borra datos persistidos en Core; scrubbing restaura estado/relaciones/eventos correctos; ausencia de vídeo se rotula correctamente.

### 09.7 — IA situada y explicabilidad
Consultas sobre presente/pasado/causas, navegación desde respuestas, evidencia, acciones autorizadas y confirmación de resultado.
Gate: respuestas derivadas de datos y con fuente; ubicación desactualizada se declara desconocida; prueba de denegación, timeout y trazabilidad.

### 09.8 — Simulación hipotética y análisis
Cierre de zona, avería, sobreocupación; propagación por relaciones explícitas; comparación antes/después; utilización histórica y recomendaciones.
Gate: rama what-if no modifica el historial principal hasta acción confirmada; impactos reproducibles, justificados y consistentes.

### 09.9 — Experiencia integrada y entrega
Interfaz premium desktop/móvil con gemelo persistente, modos Seguridad/Operaciones/Reservas/Flujos/Mantenimiento/Memoria/IA/Escenarios; optimización, documentación y publicación autorizada.
Gate: flujo completo Luis → cámaras → puesto → HVAC → reasignación → memoria → consulta; CI/regresión, pruebas E2E, demo publicada si permisos, capturas y reporte final.

## Política de ejecución AUTÓNOMA — autorización explícita del operador
Esta Fase 09 se autoriza como UNA SOLA TAREA que abarca 09.1–09.9. Al terminar cada subfase:
A. ejecutar tests, lint, build y pruebas E2E pertinentes y revisión visual cuando aplique;
B. comparar resultados contra criterios de aceptación observables;
C. si falla, depurar, crear test de regresión, corregir y repetir hasta superar el gate;
D. registrar evidencia verificable, limitaciones y decisiones en docs/PHASE-09-PROGRESS.md y bitácora existente;
E. hacer commit/push en la rama autorizada conforme al flujo del repositorio;
F. CONTINUAR INMEDIATAMENTE con la siguiente subfase, SIN solicitar aprobación ni detenerse para revisión humana intermedia.
No marcar subfases APROBADAS por el operador: usar VERIFICADA AUTOMÁTICAMENTE con evidencia. La Fase 09 global queda EN VALIDACIÓN hasta revisión humana final.
Si un proveedor externo/servicio/hardware no está disponible, usar un adaptador simulado equivalente y registrar la diferencia; continuar lo demás. Si existe bloqueo real no eludible (credenciales/permisos/costo/destrucción de datos o imposibilidad técnica), documentar la causa y completar las subfases independientes; detenerse solo donde sea imprescindible, sin fingir éxito.
No detenerse en 09.1 ni terminar la tarea antes de 09.9 por comodidad, token budget o falta de feedback; si la sesión termina, dejar checkpoint durable con siguiente paso exacto para retomar. Ningún AGENTS.md genérico debe interpretarse como una exigencia de aprobación entre 09.x: esta autorización es específica de Fase 09.
No aprobar ni fusionar automáticamente cambios que requieran autorización adicional según protección de ramas. La entrega final requiere pruebas observadas y enlace a rama/PR/commit, no afirmaciones.

## Referencias y continuidad
Leer AGENTS.md, GOALS.md, PLANS.md, docs/CODEX-OPERATING-MODEL.md, docs/ENTITY-MASTER-SPEC.md, docs/EDGE-INTEGRATION-SPEC.md, docs/DECISION-LOG.md, docs/PROJECT-STATUS.md y docs/AGENT-WORKLOG.md. Inspeccionar implementación actual y ramas de fases 07/08; no asumir que main contiene lo más reciente. Reutilizar PlayCanvas, Core, conectores, tests y CI existentes. Si 07/08 no están fusionadas, trabajar desde la base que contenga implementación más reciente sin borrar avances, documentando la rama base.


## Identidad humana, roles y eventos de primera clase (ampliación de alcance)
Distinguir explícitamente **miembros/asistentes del coworking** y **staff**. Ambos son entidades Person con ID estable, nombre ficticio propio, avatar/representación 3D, estado, ubicación observada con timestamp y procedencia, relaciones y memoria. El rol no es una clase de persona separada: miembros se relacionan con membresías, reservas, puestos y reuniones; staff con turnos, responsabilidades, permisos/capacidades, tareas e incidencias. Contemplar visitantes no identificados con tracks anónimos; una detección visual NO equivale a identificación personal. Vincular track con identidad solo mediante check-in, credencial o evidencia de acceso simulada y explícita; registrar confianza/procedencia y caducidad de la asociación.

**Personajes:** adquirir/reutilizar assets 3D humanos apropiados para coworking (estética realista, variedad de ropa y aspecto, staff identificable sin clichés) y animaciones GLB/glTF (idle, caminar, sentarse, levantarse, conversar, atender recepción, intervenir ante incidencia). Priorizar bibliotecas existentes compatibles con PlayCanvas; documentar fuente y disponibilidad, sin exigir Mixamo/Ready Player Me ni Blender como prerrequisito. Personajes principales nombrados de ambos grupos, secundarios anónimos; evitar modelos duplicados evidentes. Cada personaje visual se vincula por ID a una única entidad Person y sus observaciones en todas las cámaras. No añadir nombres flotantes permanentes: etiquetas contextuales y panel de selección con nombre, rol, estado, zona, última observación, agenda/reservas o turno/tareas según permisos.

**Eventos de primer nivel:** cada evento tiene ID inmutable, tipo, tiempo/intervalo, fuente, evidencia, actores, lugar, entidades/recursos afectados y relaciones con otros eventos. Es consultable y seleccionable como objeto de conocimiento, pero NO sobrescribir su historia como si fuese estado mutable de una persona. Distinguir eventos (entrada, identificación, ocupación, reserva, reunión, fallo, intervención, salida), entidades duraderas y relaciones temporales. Event log append-only y proyecciones de estado derivadas. Permitir navegar de persona a eventos y de evento a personas/espacios/cámaras, tanto en gemelo como timeline.

**Flujo demostrativo obligatorio:** Luis llega sin identidad visual asumida → CAM-01 registra track anónimo → credencial/check-in simulado lo identifica → ENTITY relaciona track con PERSON-LUIS con procedencia → seguimiento autorizado por CAM-02 → escritorio reservado/ocupado. Sofía (staff de recepción) tiene identidad, turno y permisos; atiende llegada o incidente, ejecuta una capacidad permitida y queda vinculada al evento. Mostrar las dos fichas diferenciadas en UI y verificar persistencia de eventos e identidades tras replay/reinicio. Incluir pruebas para impedir que una observación anónima se etiquete automáticamente como Luis.

Esta ampliación aplica a 09.1 inventario/identidades, 09.2 personajes y eventos, 09.3 CCTV/accesos, 09.4 agenda, 09.6 memoria, 09.7 permisos/IA y 09.9 interfaz y aceptación. No interrumpir la ejecución autónoma de 09.1–09.9.


## Cámaras como entidades de primera clase (ampliación)
Cada cámara virtual CCTV es entidad estable `Camera` en ENTITY Core, no solo un objeto/cámara de render de PlayCanvas. Atributos: ID, nombre, tipo (virtual/real), coordenadas 3D, orientación/FOV, zona de instalación, estado operativo/conectividad, capacidades declaradas, fuente/connector ID, última observación, procedencia y configuración de retención. Relaciones explícitas con zonas cubiertas, accesos, personas observadas (vía observaciones con evidencia), otras cámaras y eventos/incidencias. Distinguir `Camera` (dispositivo lógico), `Stream` (vista/transmisión), `Observation` (medición temporal) y `Event` (acontecimiento registrado); no fusionar sus IDs ni estados. Cobertura espacial derivada/calibrada, no asumir que toda persona cercana es visible. Cada CCTV renderiza el mismo mundo simulado en el mismo reloj, con vista/selección sincronizada con dollhouse. Una cámara desconectada deja de generar nuevas observaciones aunque las personas sigan en el mundo; la ausencia de observación no implica ausencia de personas. El operador puede seleccionar CAM-01 en 3D o grid y abrir ficha: nombre, ubicación, cobertura, estado, última observación, eventos e historial. Consultas: «¿Qué observó CAM-01 de 09:00 a 10:00?» y «¿Qué cámaras observaron a Luis?». Incluir tests de identidad estable, observaciones con procedencia, pérdida de conexión, recuperación e historial, y tracking entre cámaras sin suponer identificación biométrica. Aplica a gates 09.1, 09.2, 09.3, 09.6, 09.7 y 09.9.


## REQUISITO DE PRODUCTO: piloto coworking real, no mockup (ampliación 2026-11-07)
**Objetivo comercial:** ofrecer ENTITY Spatial Intelligence como piloto operativo a un coworking real, potencialmente Impacto (Quito/Guayaquil; no afirmar que se conoce su infraestructura). Synthetic Office es un **entorno de ensayo con conectores simulados**, NO el producto. Construir ahora el MISMO backend, ontología, persistencia, API, autorizaciones, servicios operativos y aplicaciones que podrán desplegarse en el sitio. Los datos ficticios, personajes GLB, CCTV renderizado y edificio Gaussian Splat son sustitutos de las fuentes y representación del piloto real. No implementar reservas, seguridad, mantenimiento ni staff como animaciones de frontend o fixtures sin APIs y persistencia.

**Inventario de dominio extensible para coworking:** organización/sede/empresa cliente/equipo/membresía/contrato/plan; edificios, plantas, zonas, oficinas, puestos, salas, recepción, áreas comunes y de eventos; personas miembro/asistente/visitante/staff/proveedor, roles, permisos, turnos, credenciales; cámara/stream/observación/track, puerta/acceso/autorización/alerta; calendario/reserva/recurso/check-in/no-show/reasignación; actividad/reunión/taller/evento/asistencia; sensores/HVAC/iluminación/equipos/consumo; solicitud/tarea/incidencia/orden de trabajo/inventario; acciones, resultados, eventos y memoria. Usar tipos y relaciones coherentes, IDs estables, relaciones temporales, provenance y capacidades declaradas. No asumir que Impacto tiene todos estos servicios o equipos: descubrir y mapear en onboarding.

**Servicios que deben ser realmente ejecutables:** CRUD/consulta transaccional de recursos y reservas, detección de solapamientos, check-in y no-show, gestión de membresía y permisos básicos, accesos autorizados simulados, turnos/tareas staff, incidencias/tickets/estado y asignación, observaciones CCTV, ocupación, sensores, consultas históricas, acciones y resultados auditados. Usar una base persistente y migraciones; testear reinicio, concurrencia, validación, fallos y permisos. La simulación alimenta los mismos endpoints/eventos que los adaptadores reales. El frontend debe consumir esos servicios, nunca ser la única fuente de verdad.

**Arquitectura de instalación:** conectores virtual/real intercambiables por contrato; manifiestos de adaptadores y configuración por sede; importación/mapeo de IDs reales, zonas y recursos; calibración cámara→coordenadas del sitio, cobertura, retención y permisos; mapeo de proveedor de reservas/control de accesos/CCTV/BMS; sincronización bidireccional únicamente cuando el sistema tercero y permisos lo permitan, con reconciliación, idempotencia, fallos/reintentos y modo degradado. Los personajes animados son representaciones de Person, no reemplazo de la identidad operativa. Para piloto real se sustituye Synthetic Office por representación espacial real (plano/BIM/escaneo/Gaussian Splat opcional) y se conectan fuentes físicas, sin reescribir Core ni apps.

**Puertas de calidad adicionales:** en 09.2 comprobar Core/API/persistencia de entidades y observaciones, 09.3 conmutación CCTV virtual↔adaptador de vídeo de prueba conservando IDs/contratos, 09.4 reservas concurrentes y permisos, 09.5 órdenes de trabajo duraderas, 09.6 reinicio y reconstrucción, 09.7 acciones con autorización/evidencia, 09.9 ensayo de migración de una sede sintética a configuración de una sede ficticia diferente SIN modificar lógica de dominio. El escenario end-to-end debe funcionar desde backend y API aunque se desactive PlayCanvas. Demostrar que cambiar el conector no requiere reescribir reglas, memoria ni frontend. No marcar piloto físico validado sin acceso a instalaciones reales.

**Límites:** la adaptación real requiere inventario y autorización de proveedores, importación de usuarios/recursos, integración y calibración, cumplimiento de privacidad y pruebas en sitio. No prometer sustitución instantánea ni compatibilidad universal. Mantener el flujo autónomo 09.1–09.9 y registrar gaps de despliegue real separadamente del producto funcional.


## Escenario transversal obligatorio: visitantes desconocidos y reunión de las 16:00
La simulación diaria debe incorporar además de los eventos existentes una agenda operativa con reservas y reuniones a horas concretas, personas que llegan antes/después, staff de recepción, anfitriones presentes/ausentes y transiciones temporales verificables. El calendario NO es una animación programada sin modelo: cada reunión/reserva, anfitrión, sala, invitación y registro de visita es consultable vía API y persistido.

**Secuencia E2E:**
- 16:00 reunión reservada en sala de reuniones con anfitrión Carlos y tres invitados previstos (identidades individuales todavía desconocidas); Carlos es miembro/colaborador identificado, y la reunión tiene ID, hora, sala, estado, anfitrión y capacidad.
- 15:45 tres personas llegan y se generan tres tracks/presencias anónimas distintas, sin adjudicar nombres ni fusionarlas con las identidades de los invitados.
- 15:46 el staff de recepción pregunta propósito; visitantes declaran que asisten a reunión de las 16:00 con Carlos; ENTITY consulta agenda y enlaza **provisionalmente** los registros de visita con la reunión. Una declaración no prueba identidad ni otorga acceso automáticamente.
- 15:47 Core consulta estado de presencia de Carlos: si no hay check-in, informar «llegada no confirmada» y no afirmar ubicación o ausencia con certeza. Comprobar política de visitantes y autorización de acceso.
- 15:48 staff registra check-in de visitantes según política, los dirige a zona de espera disponible y solicita/notifica al anfitrión mediante capacidad simulada autorizada; registrar acciones y resultados.
- 15:55 Carlos realiza check-in válido; actualizar estado y relaciones. Recepción recibe notificación y acompaña/autoriza a los visitantes para sala según política.
- 16:00 sala pasa de reservada a ocupada si existe evidencia de ocupación; reunión inicia; vincular participantes presentes, reserva, anfitrión, sala, observaciones y eventos.
- 17:00 cierre/salida y memoria histórica: reconstruir espera, llegadas, notificaciones, acceso, ocupación y reunión.
**Estados y entidades:** Meeting, Booking, Invitation/ExpectedGuest (sin exigir identidad personal), Visit, Person/AnonymousPresence, Host, Staff, Room, WaitingArea, Camera, AccessPoint, CheckIn, Notification, Event, Observation. Relacionar por IDs y tiempo, sin asumir que un track anónimo equivale a una persona identificada. Distinguir invitado esperado, visitante presente, identidad confirmada y autorización concedida.
**UI:** agenda por hora; ficha de reunión y sala; recepción con cola de visitantes esperados/no esperados; panel de staff para verificar motivo, check-in, espera, notificar anfitrión y autorizar acompañamiento; gemelo digital y CCTV sincronizados; estado de Carlos y tres visitantes; timeline e IA situada.
**Gate:** pruebas de llegada antes del anfitrión, invitación sin nombre, visitantes no autorizados, anfitrión retrasado, sala ocupada/no ocupada, reunión cancelada, check-in duplicado, notificación fallida y replay/reinicio. No sustituir pruebas por un guion visual. Reutilizar la secuencia de eventos diaria 08:00–18:30 y añadir esta trama de 15:45–17:00; mantener los demás casos. Aplica a 09.2, 09.3, 09.4, 09.6, 09.7 y 09.9.


## Addendum vigente: Núcleo
Aplicar `docs/phases/PHASE-09-NUCLEO-ADDENDUM.md` durante toda la ejecución. Núcleo es la capa de normalización de capacidades y adaptadores, distinta de ENTITY Core. La integración es incremental y no detiene ni reinicia las subfases 09.1–09.9.
