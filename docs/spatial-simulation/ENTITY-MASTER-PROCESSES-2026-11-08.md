# ENTITY — Arquitectura y programa maestro por procesos
**Decisión del operador: 2026-11-08 · Rama de documentación: `codex/spatial-simulation`**

## 0. Regla de precedencia
**Este es el documento rector vigente de los tres procesos.** Reemplaza las interpretaciones contradictorias de `MASTER-ROADMAP-08-15.md`, `PROCESOS-CANONICOS.md`, `DECISION-REASIGNACION-10-11.md` y cualquier orden global 01–15. Los planes históricos permanecen como evidencia técnica, no como instrucciones de ejecución cuando contradigan este documento. La numeración de fases es local a cada proceso; no hay fases 10/11 activas en el Proceso 1. No inferir que una fase está validada por aparecer planificada.

## 1. Arquitectura general
**ENTITY** es la plataforma. **ENTITY Spatial Intelligence** es la vertical actual. Su fundamento es **un modelo del mundo computable, persistente y compartido**, no una colección de sistemas paralelos ni una réplica visual que luego recibe datos. El modelo del mundo **contiene y organiza conceptualmente** espacios, geometría, personas, organizaciones, equipos, cámaras, sensores, documentos, contratos, facturas, reservas, eventos, estados, capacidades y relaciones. Los sistemas externos conservan autoridad sobre sus datos de origen; ENTITY los representa mediante contratos y sincronización, sin absorber necesariamente todos los datos binarios ni sustituirlos.

**ENTITY Core ya construido** aporta entidades, identidad, estado, relaciones, eventos, memoria, procedencia, permisos y APIs. El gemelo 3D (Blender/PlayCanvas, y potencialmente Unreal/Omniverse) es una interfaz y motor de simulación del mundo, **no el núcleo ontológico**. Los conectores y el Edge alimentan observaciones y eventos; el agente usa el mismo mundo. Un gemelo digital no exige 3D por definición; aquí se exige explícitamente representación 3D **más** estado operativo sincronizado. No duplicar Core, backend, frontend ni base de datos.

### Esquema de dependencias
Proceso 1: infraestructura ENTITY existente → Proceso 2: coworking digital operativo, mundo conectado, cámaras, percepción, aplicaciones y dispositivos → Proceso 3: inteligencia situada y multiagentes. La secuencia es de integración y validación; el Core sigue siendo el mismo en todos los procesos.

## 2. PROCESO 1 — Software ENTITY (DETENIDO EN FASE 09)
Construcción del backend, frontend, API, Core, contratos, memoria y capacidades de la plataforma. Su programa **termina en Fase 09**. Las antiguas `docs/phases/PHASE-10.md` y `PHASE-11.md` **no son fases por ejecutar aquí**. Se conservan solo como especificaciones históricas: su trabajo se asigna a los Procesos 3 y 2, respectivamente. No activar esas fases ni renumerar este proceso. El operador considera cerrado el bloque de construcción; la evidencia técnica de gates y posibles defectos se consulta por separado, sin afirmar aprobación automática de pruebas pendientes.

## 3. PROCESO 2 — Gemelo digital OPERATIVO del coworking (ACTIVO)
**No termina en Fase 07. No termina con las cámaras.** Su resultado es un coworking digital integral, interactivo, sincronizado y comprobable, con el **modelo del mundo como estructura central que incluye todos los subsistemas**.

### 3.1 Construcción espacial — fases internas históricas 01–07
Seguir `docs/spatial-simulation/IMPLEMENTATION-PLAN.md` para escena Synthetic Office reconstruida en Blender y PlayCanvas, espacios, materiales, dispositivos, interacción y navegación, animaciones y validación. 04.5 estética aplazada, no cancelada. 05: clic/tap para caminar, rutas, colisiones y navegador móvil/escritorio. 06: **aproximadamente doce personajes humanos realistas ya seleccionados de Adobe Mixamo**; dummies geométricos **descartados** por ser demasiado distinguibles en pruebas de cámaras. Personajes con animaciones, rutas, oclusiones e identidades internas persistentes. 07: integración de escena/personajes, **no fin del proceso**. Confirmar evidencias antes de marcar gates.

### 3.2 Cámaras, dispositivos y percepción espacial
Reutilizar el alcance de la **antigua Fase 11** (`docs/phases/PHASE-11.md`) sin su numeración ni su dependencia histórica de agentes. Investigar y elegir cámaras de seguridad comerciales concretas. Construir gemelos de hardware con fabricante/modelo, sensor, lente, FOV, resolución, FPS, codecs, PTZ si aplica, configuración, posición, calibración, cobertura, sincronización y estado. Renderizar observaciones desde el **mismo** coworking y personajes 3D; nunca clips falsos desconectados del mundo. Camera Gateway para ONVIF/RTSP/NVR/VMS/USB/SDK según compatibilidad y autorización. Detección, tracking, ReID visual, TrackGlobal, continuidad multicámara e inferencia contextual por geometría, rutas, puertas, obstáculos, velocidades y tiempo; registrar incertidumbre y alternativas. **Ground truth interno ≠ observación ≠ identidad inferida**. No pasar ID de NPC al detector. No afirmar acceso a cámaras/DVR no disponibles; Orbbec disponible para experimentos y hardware comercial ausente representado como virtual.

### 3.3 Seguridad, accesos y biometría
Modelar y conectar lectores, controladoras, cerraduras, puertas, permisos, alarmas, credenciales y dispositivos biométricos de productos reales. Hardware ausente: gemelo funcional documentado y etiquetado como virtual. Hardware presente: API/SDK autorizado. No inventar registros biométricos reales; aplicar consentimiento, minimización y protección de datos. Distinguir acceso permitido, puerta abierta, persona observada e identidad autenticada.

### 3.4 Operación empresarial con productos REALES
**No desarrollar clones de software de negocio.** Investigar el stack real utilizado por el coworking **Impacto** (proveedores concretos, reservas, membresías, facturación, accesos, CRM y pagos); **no atribuir productos sin verificar**. Integrar por APIs oficiales y credenciales autorizadas:
- Agendamiento, calendarios, reservas, disponibilidad, cancelaciones, recursos y conflictos.
- CRM, clientes, prospectos, empresas, membresías, contratos, servicios.
- Facturación, planes, consumo, comprobantes, pagos, vencimientos y conciliación según proveedor.
- Google Drive real, carpetas, archivos, contratos, metadatos y permisos.
- Recepción, visitantes, tickets, mantenimiento, limpieza, notificaciones y operaciones.
- Infraestructura de red, routers, switches, Wi-Fi, conectividad, dispositivos, salud y fallos; integraciones autorizadas.
Cada aplicación mantiene su fuente de verdad. ENTITY representa sus objetos, estados, eventos y relaciones en **un solo modelo del mundo**. Fixtures solo para tests y siempre etiquetados; nunca presentar un mock de CRM, Drive o facturación como integración real.

### 3.5 Experiencia live y contratos
El visor 3D refleja estado actual y procedencia: salas ocupadas, reservas, accesos, personas observadas, cámaras, facturas, documentos, red, incidentes. Debe permitir consultas y acciones autorizadas sobre sistemas de origen, con trazabilidad, actualización, reconexión y manejo de discrepancias. Distinguir `real conectado`, `simulado`, `replay`, `pendiente de credenciales`, `pendiente de hardware`, `error`. No afirmar tiempo real cuando sea polling o replay. Mantener identidad y relaciones estables entre todos los subsistemas.

### 3.6 Criterio de cierre del Proceso 2
Demostración de coworking 3D navegable con personajes realistas, cámaras observando el mismo mundo, seguimiento multicámara y Core compartido; seguridad y biometría mediante dispositivos reales autorizados o gemelos documentados; conectores reales operativos de agenda, CRM, documentos y facturación con pruebas y permisos; estado y eventos coherentes en visor/API; observabilidad y pruebas de errores, desconexiones, conflictos y privacidad. **Una integración sin credenciales o hardware no se declara completa**: dejar explícito el bloqueo y su evidencia. El cierre requiere aceptación del operador; no imponer un número global de fases.

## 4. PROCESO 3 — Inteligencia situada y multiagentes (POSTERIOR)
Recupera el alcance de la **antigua Fase 10** (`docs/phases/PHASE-10.md`) sin ejecutar ni reabrir una Fase 10 del Proceso 1. Agente ENTITY con runtime OpenClaw conforme a evaluación técnica vigente; herramientas tipadas sobre capacidades Core, permisos, sesiones, identidad, memoria y auditoría. La IA situada interpreta el **mismo modelo del mundo** que alimenta el Proceso 2, no otro grafo.

**Arquitectura multiagente prevista:** agentes especializados en seguridad/accesos, reservas/recepción, facturación/finanzas, CRM/comercial, redes/infraestructura y mantenimiento. Comparten mundo y contexto, pero operan con roles, herramientas, límites y aprobaciones propios. Coordinación y resolución de conflictos auditables; no otorgar acceso general a datos privados ni acciones irreversibles sin autorización. No construir agentes como condición para que el Proceso 2 funcione.

## 5. Límites operativos y continuidad para Codex
- Leer **este documento primero**, después `AGENTS.md`, `IMPLEMENTATION-PLAN.md`, especificaciones históricas 10/11 y evidencias de código. Si contradicen este documento, prevalece esta arquitectura y consultar al operador antes de cambiar alcance.
- No editar `main`, fusionar ramas, alterar Core de otra línea ni duplicar servicios sin autorización.
- SaaS ENTITY centralizado en nube; Edge solo captura/preprocesamiento local indispensable.
- Registrar por entregable: estado, proveedor/modelo real, simulación vs conexión, contratos, pruebas, capturas/logs, limitaciones, commit y próximos pasos.
- El documento define arquitectura y secuencia conceptual; **no autoriza por sí solo implementar todo ni declarar gates aprobados**.
