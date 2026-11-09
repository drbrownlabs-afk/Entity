# P2 — Fases del gemelo digital operativo de coworking

**Formalización:** 2026-11-08. Planificación específica de P2, subordinada al canon y ADR vigentes. No confundir con numeración antigua de P1. No iniciar fases automáticamente. El gemelo digital existente no se reconstruye.

| Fase P2 | Objetivo | Alcance y salida |
|---|---|---|
| 01 | Reconstrucción arquitectónica | Conservar trabajo previo. |
| 02 | Distribución funcional | Conservar trabajo previo. |
| 03 | Organización y ampliación de escena | Conservar trabajo previo. |
| 04 | Materiales, iluminación y automatización | Conservar trabajo previo. |
| 05 | Gemelo integrado en PlayCanvas | CONSTRUIDO según confirmación del operador; no reconstruir. |
| 06 | Personajes Mixamo y NPCs | SIGUIENTE: ~12 humanos realistas, animaciones, rutas, estados, colisiones y continuidad visual. Aceptar tras pruebas en escena existente. |
| 07 | Integración y aceptación de escenario | Integrar escena, personajes, navegación, animaciones y rendimiento desktop/móvil; pruebas reproducibles. |
| 08 | **Integración funcional con backend existente de P1 (ENTITY Core)** | Conectar PlayCanvas y simulación a API real del Core existente; mapear zonas, personas, objetos y cámaras a entidades/identidades; sincronizar estados, relaciones, eventos, reloj y memoria; comprobar lectura/escritura autorizada, persistencia tras reinicio, errores, reconexión, trazabilidad y separación ground truth/observación/inferencia. **No construir otro backend/Core.** Resolver o documentar bloqueos reales de P1 antes de aprobar esta fase. |
| 09 | Cámaras y cobertura | CCTV virtual, FOV, posiciones, calibración, oclusiones, vistas sincronizadas; preparar adaptadores RTSP/ONVIF/NVR/Orbbec sin inventar acceso físico. |
| 10 | Percepción y continuidad multicámara | Detección, tracking, ReID contextual, incertidumbre y restricciones espaciales/temporales; no usar identidad NPC como resultado del detector. |
| 11 | Seguridad, accesos y autorización | Visitantes, personal, puertas, permisos, incidentes, alertas y auditoría; biometría solo con fundamento y controles. |
| 12 | Reservas y operación de espacios | Calendarios, ocupación, salas, escritorios, membresías, check-in y recepción; discrepancias entre reservas y observación. |
| 13 | CRM, contratos, facturación y documentos | Integrar APIs oficiales y datos de negocio vía Núcleo/Entidadizador hacia Core; permisos, idempotencia, trazabilidad. |
| 14 | Infraestructura y mantenimiento | Red, IT, equipos, sensores, HVAC si procede, incidencias, disponibilidad y acciones verificables; simular lo inaccesible. |
| 15 | Validación integral y piloto | Escenarios E2E, sincronización, persistencia, replay, errores, seguridad, rendimiento y matriz real/simulado; aceptación explícita. |

## Orden y aceptación
- Fases 01–05: preservar; fase 05 construida **según el operador**, sin certificación técnica adicional en esta edición.
- **Ahora fase 06**, sobre el gemelo existente: personajes realistas, animaciones y rutas; luego fase 07 para integración y validación del escenario completo.
- **Dependencia obligatoria:** fase 08 integra P2 con el backend de P1 ANTES de iniciar cámaras y operaciones. P2 no duplica el Core. Fases 08–15: planificación futura de P2. No ejecutarlas ni declararlas terminadas por el solo hecho de documentarlas. Cada fase requiere revisión del operador.
- No confundir Núcleo (interoperabilidad universal), Entidadizador (semántica de datos) y ENTITY Core (único modelo computable). El gemelo 3D es una interfaz, no otro Core.
- Simulación, replay e integración real deben estar etiquetados y ser distinguibles. Sin proveedores inventados, cámaras supuestamente instaladas ni resultados de pruebas no ejecutadas.
- P3 IA situada/multiagentes permanece separado y posterior. OpenClaw no forma parte de estas fases P2.
- Evidencia de cada entrega: commit/artefactos, pruebas ejecutadas, pendientes, aceptación. No sobrescribir el trabajo previo.
