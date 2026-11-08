# ENTITY — Reordenación vinculante de fases 10 y 11

**Decisión del operador, 2026-11-08.** Intercambiar el orden de las antiguas fases 10 y 11, sin cambiar el alcance de la Fase 09.

| Orden vigente | Alcance |
| --- | --- |
| Fase 09 | Integración y aceptación visual/funcional de la interfaz espacial Synthetic Office, Dollhouse, entidades, avatares, CCTV virtual, relaciones, memoria y operaciones |
| **Fase 10 (antes 11)** | **Agentes de IA / runtime de agentes (incluido OpenClaw si es técnicamente adecuado)** integrados con ENTITY Core para consultas situadas, interpretación de estados, eventos y relaciones, memoria, y acciones autorizadas |
| **Fase 11 (antes 10)** | **Cámaras físicas, tracking multicámara, asociación/ReID y calibración de observaciones reales**; aplazada hasta contar con dispositivos y condiciones de prueba |

## Motivo y regla

La prioridad es preguntar a la IA «¿qué está pasando dentro del coworking?» y obtener respuestas fundamentadas en el estado computable del lugar. El piloto dispone de datos y fuentes simuladas; **no depende de disponer de cámaras CCTV físicas**. La fase avanzada de cámaras queda después. No confundir las cámaras virtuales de la Fase 09, que sí deben funcionar, con el tracking multicámara físico de la nueva Fase 11.

## Nueva Fase 10 — contrato funcional

1. Agente de IA situada integrado mediante API/SDK con ENTITY Core, no chatbot independiente ni capa de texto que invente datos.
2. Herramientas tipadas para consultar entidades, estados actuales, relaciones, eventos, memoria histórica, ubicación, ocupación, reservas, cámaras virtuales y procedencia de observaciones.
3. Preguntas demostrables: «¿Qué está pasando en el coworking?», «¿Quién está en la oficina A?», «¿Qué cambió desde las 09:00?», «¿Por qué está ocupada esta sala?», «¿Qué cámara virtual cubre esta zona?», «¿Qué incidentes siguen abiertos?».
4. Cada respuesta debe indicar tiempo/instante, alcance, procedencia, si los datos son **simulados**, y distinguir observación directa de inferencia. Si no hay evidencia suficiente, decirlo.
5. Acciones mediadas por capacidades y permisos de Core, con confirmación humana para acciones sensibles, registro de auditoría y manejo de errores; jamás acceso irrestricto a API, base de datos o shell.
6. Interfaz de consulta integrada con el gemelo digital: preguntas sobre selección actual, resaltado de entidades y relaciones pertinentes, navegación a eventos y cámaras; interfaz textual primero, voz opcional si es viable.
7. Evaluar OpenClaw como runtime/orquestador, pero no acoplar la ontología de ENTITY a un proveedor específico. Reutilizar Fase 05 (IA situada) y los contratos existentes antes de introducir nuevas dependencias.
8. Pruebas end-to-end contra Core de demostración y datasets sintéticos reproducibles: respuestas correctas, abstención ante ausencia de datos, autorizaciones, auditoría, replay temporal, inyección de prompts, y fallos del proveedor. Sin prometer comprensión por visión real ni inferir presencia física a partir de datos simulados.
9. SaaS: Core y aplicación operan en la nube; no instalar ENTITY Core en la sede. La ejecución de agentes debe respetar la arquitectura y aislamiento del SaaS.

## Orden de ejecución

- Terminar y validar los requisitos de Fase 09 antes de marcarla completada.
- Se autoriza **preparar e implementar la nueva Fase 10 en paralelo** solo en componentes aislados, sin romper ni desplazar la integración pendiente de Fase 09; no declarar aceptación de ninguna fase sin pruebas.
- **No iniciar la nueva Fase 11** de tracking multicámara.
- Actualizar cualquier roadmap, backlog, tickets, referencias y documentación donde aparezca el orden antiguo; mantener una nota de equivalencia «Fase 10 anterior → Fase 11 actual» y «Fase 11 anterior → Fase 10 actual» para evitar confusiones históricas.

## Entrega de Fase 10

Código de agente integrado, herramientas de Core, UI para consultar el estado del coworking, pruebas reproducibles y una demostración en la que una pregunta real produce respuesta sustentada por entidades/eventos de Core, no texto ficticio. Documentar proveedor/runtime, configuración segura, coste operativo y limitaciones.
