# ENTITY OS — Modelo de trabajo de Codex
Basado en prácticas documentadas de Codex: AGENTS.md para reglas persistentes; roadmap y archivos por fase para objetivos, restricciones, pruebas y aprobaciones. Las convenciones de PLANS.md y fases son del proyecto, no requisitos automáticos del producto.

## Inicio de tarea
1. Leer AGENTS.md, GOALS.md, PLANS.md, docs/ENTITY-MASTER-SPEC.md, docs/EDGE-INTEGRATION-SPEC.md, docs/PHASE-BOARD.md, docs/PROJECT-STATUS.md y últimas entradas de docs/AGENT-WORKLOG.md.
2. Inspeccionar branch, cambios sin commit, código y pruebas existentes; no asumir que la documentación demuestra implementación.
3. Elegir SOLO fase autorizada y tarea acotada; describir objetivo, resultados observables, límites, dependencias y plan de validación.
4. Si falta hardware/credenciales o existe una contradicción estructural, señalar el bloqueo y proponer una alternativa simulada sin declarar prueba física.

## Ejecución
- Implementar el incremento mínimo funcional; tests automatizados cuando sea posible.
- No reescribir módulos sanos por estética. No crear dependencias o servicios costosos sin necesidad.
- Documentar los comandos ejecutados y resultados reales; si no pudo ejecutarse una prueba, registrar 'NO EJECUTADA' y motivo.
- Verificar regresiones, permisos, desconexión, errores y reintentos para el alcance de la tarea.
- Nunca poner credenciales, datos privados ni video real en Git.
- Mantener separación entre simulación y producto físico; misma API/contratos.

## Entrega y memoria compartida
- Actualizar docs/AGENT-WORKLOG.md con tarea, fecha, archivos, branch/PR/commit, implementación real, pruebas, limitaciones y próximo paso.
- Actualizar docs/PROJECT-STATUS.md y docs/PHASE-BOARD.md sin declarar 'APROBADA' antes de aceptación humana.
- Si hay decisiones nuevas, actualizar docs/DECISION-LOG.md y la especificación maestra correspondiente.
- Crear commits/PR según permisos y flujo autorizado; distinguir cambios locales de publicados y de fusionados.
- Resumir al operador: QUÉ FUNCIONA, CÓMO LO VEO, QUÉ FALLÓ, QUÉ FALTA, QUÉ SIGUE.
- Detenerse en el límite de la fase/tarea; no iniciar fases posteriores por iniciativa propia.

## Debug por fase
Reproducir fallo -> identificar capa (device/adapter/perception/observation/Core/API/agent/output) -> capturar logs sin secretos -> crear test de regresión -> corregir -> repetir pruebas -> registrar evidencia -> actualizar estado. No ocultar errores ni saltarse una fase.

## Colaboración
GitHub es la fuente compartida de documentos, código, commits, PR y CI. Memorias privadas de ChatGPT/Codex no están sincronizadas automáticamente. Si Codex tiene cambios locales o PR sin fusionar, especificar su ubicación y estado. Evitar editar la misma rama en paralelo; preferir PRs por fase.


## Responsabilidad de publicación autónoma (decisión del operador, 2026-11-06)
Codex se encarga de principio a fin de la tarea autorizada: desarrollo, depuración, pruebas, commits, publicación en GitHub y actualización de memoria compartida. El operador no debe crear PR, hacer push, fusionar ramas ni gestionar Git manualmente. Cuando el flujo requiera PR, Codex lo crea y proporciona su URL; solo fusiona si cuenta con autorización y cumple las protecciones de la rama. Si no dispone de permisos de publicación, informa del bloqueo concreto y solicita autorización, sin trasladar operaciones Git al operador. No declarar trabajo visible en el repositorio mientras solo exista en workspace local. El cierre de una tarea incluye evidencia publicada (SHA, rama, estado de PR/merge, resultados de pruebas). La aprobación de fase sigue siendo humana.


## Excepción operativa autorizada: Fase 09 (2026-11-07)
Para la tarea integral Fase 09, la instrucción general «detenerse al final de la fase/tarea» se aplica **solo al final de 09.9**, no al final de 09.1–09.8. Codex debe ejecutar los gates y correcciones de cada subfase, registrar evidencias y avanzar sin solicitar revisión humana intermedia. Leer docs/phases/PHASE-09.md y docs/PHASE-09-PROGRESS.md. Esta excepción no modifica las autorizaciones de fases anteriores ni habilita fusiones que requieran permisos adicionales.
