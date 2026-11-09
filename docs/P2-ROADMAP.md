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
| 08 | **Conexión P2 ↔ backend P1 y entidadización del gemelo** | Utilizar backend y frontend funcionales existentes de P1, sin duplicarlos. Conectar PlayCanvas y personajes a las APIs/capacidades de ENTITY Core. Entidadizar salas, zonas, puertas, mobiliario, personajes, cámaras virtuales y objetos con identidad, estado, relaciones, eventos, memoria y correspondencia espacial. Núcleo resuelve interoperabilidad; Entidadizador transforma semánticamente; Core mantiene el modelo compartido. Pruebas bidireccionales, persistencia, autorización y trazabilidad. |
| 09 | **Entidadización e integración de fuentes y sistemas** | Registrar/entidadizar cámaras y sensores (simulados o reales), CRM, reservas, calendario, Drive/documentos, accesos, seguridad, membresías, contratos, facturación, red/IT y mantenimiento. Conectores a sistemas externos mediante Núcleo y APIs oficiales; Entityizer resuelve identidad y significado; Core unifica relaciones y eventos. Integración incremental por adaptadores sin construir clones de sistemas ni exigir proveedores no disponibles. |
| 10 | **Sincronización operacional integral** | Gemelo, backend y sistemas conectados operan sobre el mismo Core: eventos y cambios reflejados en 3D y vistas de operación, acciones autorizadas con resultado verificable, conflictos entre fuentes, errores, reconexión, deduplicación y procedencia. Diferenciar fuente externa autoritativa, simulación, replay, observación e inferencia. |
| 11 | **Validación de entidadización e interoperabilidad** | Casos E2E de persona→espacio→reserva→acceso→cámara→CRM/documentos y cambios de estado; probar relaciones, continuidad, memoria, permisos, persistencia, trazas y recuperación. Matriz de sistemas reales/simulados/no conectados. **Gate obligatorio**: demostrar integración funcional del conjunto antes de iniciar capas avanzadas. |
| 12 | Percepción espacial y continuidad multicámara | Con cámaras ya entidadizadas, incorporar calibración, cobertura, detección, tracking, ReID contextual y restricciones físicas/temporales. No usar IDs internos de NPC como si fueran detecciones reales; medir incertidumbre y falsos positivos. |
| 13 | Escenarios operativos y automatización | Reglas, incidencias, reservas, seguridad, accesos, atención, mantenimiento y acciones sobre capacidades de sistemas conectados; sin reimplementar sus aplicaciones. Auditar resultados y distinguir intención de efecto comprobado. |
| 14 | Evaluación de inteligencia espacial y capacidades situadas | Consultas y análisis contextual basados en el modelo del mundo, escenarios complejos, predicciones experimentales y evaluación de utilidad; **no implementar P3 multiagentes/OpenClaw sin autorización separada**. |
| 15 | Validación integral de P2 y piloto | Escenarios completos, regresión, seguridad, fallos, persistencia, rendimiento desktop/móvil, procedencia, límites de simulación y aceptación explícita del operador. |

## Orden y aceptación
- **Estado inmediato:** 01–05 preservar; 05 construida según operador; 06 personajes Mixamo/NPCs; 07 integración y validación visual de la escena.
- **Dependencia arquitectónica:** 08 conecta gemelo + personajes al **backend funcional existente de P1** y entidadiza el mundo 3D; 09 integra y entidadiza sistemas externos; 10 sincroniza la operación; 11 valida esa interoperabilidad. **No avanzar a percepción avanzada, automatizaciones ni otras capas sin completar este bloque.**
- Entidadizar no significa convertir todo en geometría 3D: cada entidad puede tener identidad, estado, relaciones, eventos, memoria, capacidades y representación espacial cuando corresponda.
- **No construir otro Core ni clones de CRM, Drive, CCTV, reservas o facturación.** Núcleo integra interfaces; Entidadizador normaliza significado; ENTITY Core mantiene el modelo del mundo; las fuentes externas conservan autoridad sobre sus datos.
- Distinguir simulación, replay, fuente real, ground truth, observación e inferencia. Hardware no disponible no se presenta como instalado.
- Fases 08–15 son planificación interna P2, **no** la numeración global 08–15 revocada del antiguo P1. No se ejecutan automáticamente ni se declara aceptación sin evidencia.
- P3 IA situada/multiagentes sigue separado y requiere autorización propia.
- Cada fase aporta commits, pruebas, pendientes, decisiones y aceptación; preservar los archivos existentes.
