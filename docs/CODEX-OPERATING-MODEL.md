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
