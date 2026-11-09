# ENTITY — Procesos de trabajo (decisión vigente, 2026-11-08)

**No existe una secuencia global de fases 01–15. No mezclar las fases de ramas distintas.**

## Proceso 1 — Software ENTITY
Backend, frontend y ENTITY Core existentes. Su propia planificación histórica llegó a Fase 09; la Fase 10 de ESA línea estaba destinada a agentes y quedó pendiente. No renumerarla ni reconstruir el software. Verificar gates técnicos en su propia rama, sin presumir certificación.

## Proceso 2 — Gemelo digital 3D
Blender y PlayCanvas del coworking en `codex/spatial-simulation`. Sus fases internas 01–07 permanecen en `IMPLEMENTATION-PLAN.md`. 04.5 visual aplazada; 05 navegación clic/tap y publicación; 06 personajes humanos realistas de Adobe Mixamo (aprox. 12 ya seleccionados, NO dummies simplificados descartados), animaciones, rutas, control e IDs; 07 integración y validación del escenario 3D. No declarar completado sin evidencia.

## Proceso 3 — Inteligencia situada
**Proceso independiente, sin continuar la numeración del gemelo digital.** Prioridades: (A) **PRIMERO cámaras y percepción espacial**: modelos comerciales documentados, gemelos configurables (fabricante/modelo, firmware, lente, sensor, FOV, FPS, PTZ, resolución, protocolos, orientación, calibración, cobertura), observación del mismo coworking y personajes realistas, tracking, ReID y continuidad multicámara; separar ground truth de observaciones y confianza. CCTV/DVR/NVR reales cuando exista acceso autorizado, de otro modo dispositivos virtuales claramente identificados. (B) Seguridad y acceso: lectores, cerraduras, credenciales, biometría, alarmas; hardware real o gemelos fieles. (C) **Software empresarial REAL**, no clones: Google Drive, CRM, reservas, calendarios y otros servicios mediante APIs y permisos oficiales. (D) Agente encarnado sobre el modelo del mundo compartido, con herramientas, memoria, permisos y acciones auditables; evaluar OpenClaw y modelos OpenAI sin asumir tecnología elegida. Pruebas operativas y piloto después.

ENTITY Core existente conserva Entidades, Estado, Relaciones, Eventos y Memoria. Gemelo 3D = interfaz espacial; cámaras = fuentes de observación; conectores = interoperabilidad; agente = inteligencia situada. SaaS en nube, Edge para procesamiento local indispensable. No modificar `main`, duplicar Core ni mezclar planes de ramas. **El antiguo `MASTER-ROADMAP-08-15.md` contiene un orden y numeración revocados y no debe usarse como plan vigente.** Este archivo prevalece para la organización de los procesos. No autoriza ejecución automática del Proceso 3.
