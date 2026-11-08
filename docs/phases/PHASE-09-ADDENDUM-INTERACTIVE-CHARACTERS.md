# ADDENDUM FASE 09 — Personajes interactivos, NPCs y percepción espacial
Fecha: 2026-11-08
Estado: REQUISITO DEL OPERADOR — implementar dentro de Fase 09, antes de declarar 09.2/09.3/09.9 completos.
Rama de trabajo: codex/phase-09-autonomous-plan. No iniciar fases 10/11.

## Decisión y objetivo
Synthetic Office debe ser una simulación espacial INTERACTIVA y persistente, no una secuencia de animaciones o replay de un guion. El operador rechaza la apariencia de los avatares Rocketbox actuales y su comportamiento limitado. Sustituir su representación por humanoides/maniquíes blancos, neutros, sin rasgos ni ropa detallada, con rig funcional y animaciones de locomoción/acción, preferiblemente assets gratuitos de licencia compatible (investigar y verificar asset y licencia exactos antes de integrar; Quaternius Universal Base Characters como candidato, NO elección definitiva sin inspección visual). GLB es formato válido; no asumir que los clips predefinidos impiden interactividad. No reconstruir el coworking original.

## Dos categorías simultáneas
1. Tres personajes controlables, con selección y cambio de control:
   - José: administrador del coworking, rol administrativo con acceso total a las capacidades de administración definidas y autorizadas en ENTITY Core (sin bypass de autenticación, auditoría o controles).
   - Carlos: trabajador/miembro del coworking; permisos y recursos de miembro/trabajador, distintos de José.
   - Visitante: persona externa, identidad de visita, permisos restringidos, acceso condicionado por invitación/check-in/autorización.
   Estos tres son entidades distintas y persistentes, con IDs estables, identidad y relaciones. Los nombres son perfiles de la simulación, no identidades biométricas inferidas de cámaras.
2. NPCs autónomos de fondo que circulan, ocupan puestos, esperan, entran/salen y realizan acciones dentro del mismo mundo, reloj, navegación, cámaras y Core. Sus rutas pueden ser dinámicas y comportamientos autónomos; escenarios guionizados se conservan exclusivamente como pruebas/reproducciones opcionales, no como motor único de la experiencia.

## Interacción real
- Control tipo videojuego en desktop y móvil: seleccionar José/Carlos/Visitante; click/tap-to-move y, cuando sea viable, teclado/joystick virtual; navegación y colisiones reales sobre el SSOG/collider original. Cámara de navegación y selección no deben interferir.
- Acciones contextuales: caminar, detenerse, girar, sentarse/levantarse, entrar/salir, interactuar con puesto, recepción, sala y puertas/accesos disponibles; acciones de negocio (reserva, check-in, autorización, etc.) mediante capacidades reales de Core con identidad del actor y permisos correctos. No inventar puertas u objetos no existentes.
- Animaciones de locomoción conectadas a velocidad/dirección/estado, no posiciones fijas en clips. Root motion no debe desincronizar la pose autoritativa; usar estado locomotor y animación sobre pose de simulación.
- Los NPCs siguen funcionando mientras se controla uno de los tres personajes. Los cambios no están previstos en un guion y deben producir resultados observables y persistentes.

## Cámaras virtuales: requisito crítico
- Las cámaras virtuales existentes en el coworking son sensores operativos, no fondos ni videos ni observaciones precalculadas. Deben derivar observaciones de la escena actual (campo de visión, oclusión/cobertura según capacidad real implementada, tiempo y fuente), incluyendo los movimientos no guionizados de personajes controlables y NPCs.
- El motor de simulación mantiene ground truth de posición/acción; ENTITY Core no debe confundirlo con conocimiento observado. ENTITY Edge/adaptador entrega observaciones con procedencia; Core procesa identidad, estado, relaciones, eventos y memoria por contratos existentes. Sin identificación biométrica automática injustificada.
- El circuito de aceptación es: input del operador -> motor espacial -> cámara virtual -> observación real de esa escena -> Core HTTP persistente -> estado/memoria -> Experience sincronizada. Las observaciones deben reflejar qué cámara realmente ve al personaje y cuándo deja de verlo.

## Integración y restricciones
- Reutilizar SuperSplat/PlayCanvas originales, collider/navegación oficial, cámara virtual, API, contratos y base de datos Core; no crear una segunda escena, un Core paralelo o un estado de negocio local simulado.
- El sistema debe funcionar E2E con backend Core ejecutado localmente en el PC (Docker/WSL2 es válido), accesible desde la interfaz. GitHub Pages no aloja FastAPI/DB; no confundir replay público con prueba persistente.
- Mantener compatibilidad de entidades/eventos previos y documentar migraciones si cambian IDs o modelos. Antes de tocar código, leer últimos commits/diffs, docs/PHASE-09-PROGRESS.md y docs/CHATGPT-CODEX-HANDOFF.md, respetar trabajo concurrente. Continuar Fase 09 autónomamente, no esperar aprobaciones intermedias.
- Evaluar rendimiento móvil/desktop, límites de personajes simultáneos, rig y animaciones; optimizar sin sustituir el SSOG ni degradar cámaras/observaciones.

## Gates de aceptación obligatorios
A. Operador puede elegir y controlar libremente a José, Carlos y Visitante; cada uno tiene identidad, rol, pose y acciones independientes. NPCs continúan autónomos.
B. Movimiento a destino arbitrario transitable (no precalculado) con colisión y animación coherente; cambio de control no borra estado.
C. Un mismo intento de acción administrativa es permitido para José y denegado a Carlos/Visitante si carecen del permiso, con evidencia Core; el visitante respeta acceso y check-in.
D. Mover a Carlos manualmente entre zonas/cámaras produce observaciones distintas en función de cobertura; las cámaras no reportan posiciones invisibles ni eventos inventados.
E. Observaciones, acciones y cambios de estado quedan persistidos en Core y se recuperan tras reinicio; sincronización de dos clientes y reconstrucción histórica.
F. E2E automatizado y evidencia visual desktop/móvil con SSOG original, más prueba manual documentada de control; distinguir fallos, no declarar completado por QA de GLB o replay.
G. No cerrar Fase 09 ni iniciar 10/11 hasta validar estos gates junto a los previos.

## Nota para Codex
Este addendum sustituye el enfoque de 'personajes que reproducen la jornada' como UX principal, pero conserva replay determinista como herramienta de QA. Antes de continuar rutas predefinidas, adaptar el trabajo de navegación existente a movimiento por órdenes de usuario. Registrar avances y bloqueos verificables en PHASE-09-PROGRESS.md y CHATGPT-CODEX-HANDOFF.md.

## Entorno de desarrollo y pruebas integrado — GitHub Codespaces (obligatorio evaluar y habilitar)
La Fase 09 es una fase de DESARROLLO Y PRUEBAS, NO un lanzamiento ni despliegue comercial SaaS. Preparar GitHub Codespaces como entorno reproducible donde ejecutar conjuntamente frontend y backend reales, sin exigir que el operador mantenga su PC encendido. No convertir esta tarea en diseño de infraestructura de producción.

- Revisar primero la estructura existente, Docker/Compose, scripts, puertos y tests; reutilizarla. Añadir o adaptar configuración `.devcontainer/devcontainer.json` y, solo si es necesario, Compose/devcontainer Dockerfile. Evitar romper el arranque local existente.
- En el Codespace iniciar ENTITY Core FastAPI, base de datos persistente de pruebas y frontend PlayCanvas/SuperSplat/Synthetic Office. Publicar/reenviar puertos de frontend y API mediante Codespaces; comprobar conectividad real desde el navegador del operador y móvil cuando sea viable. No confundir URLs de Codespaces con GitHub Pages.
- Configurar la URL de API que usa el frontend para apuntar al backend real del mismo Codespace. Comprobar CORS, origen HTTPS, autenticación, cookies/tokens y SSE/eventos; evitar mixed content (frontend HTTPS llamando API HTTP). No publicar puertos sensibles innecesariamente; usar visibilidad privada/autenticada por defecto y no exponer credenciales.
- Asegurar que el Core guarda observaciones, acciones, eventos, estados y memoria en volumen o almacenamiento del Codespace, con backups/exportación de datos de prueba y restauración verificable. Codespaces puede detenerse por inactividad o eliminarse por políticas de retención: no asumir servicio 24/7 ni durabilidad indefinida; automatizar bootstrap y seed de pruebas reproducibles.
- Proporcionar un comando/documentación breve para abrir Codespace, iniciar servicios, abrir el coworking y controlar José/Carlos/Visitante; incluir diagnóstico de puertos, API, base de datos y conexión del visor. Medir límites de CPU/RAM y rendimiento, ya que el render WebGL corre en el dispositivo cliente y los servicios en Codespaces.
- Gate: sesión Codespaces nueva -> arranque reproducible -> interfaz conectada al Core HTTP real -> mover personaje no guionizado -> observación de cámara virtual -> evento/memoria persistente -> segundo cliente ve actualización -> reinicio de servicios conserva datos. Pruebas desktop/móvil y evidencia; no considerar un replay local o GitHub Pages estático como cumplimiento.
- Codespaces es entorno de pruebas opcional respecto a la ejecución local si limitaciones de cuenta/cuota impiden utilizarlo; documentar límites y preservar un arranque equivalente local. No bloquear desarrollo por costes inesperados ni activar servicios de pago sin autorización.

## Reutilización de controlador PlayCanvas
Antes de construir un controlador desde cero, evaluar el controlador oficial de tercera persona de PlayCanvas (`scripts/esm/third-person-controller.mjs` del repositorio playcanvas/engine), sus dependencias, licencia, versión y compatibilidad con el AppBase de SuperSplat y collider/navegación existentes. Reutilizarlo o adaptar sus patrones cuando sea técnicamente viable; no imponer física incompatible ni sustituir el visor. Conectar locomoción a animaciones, navegación, selección y controles desktop/móvil. Los NPCs pueden aprovechar A* y máquinas de estados existentes. No integrar OpenClaw en Fase 09: corresponde a Fase 10 y no es motor de locomoción.
