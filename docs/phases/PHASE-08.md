# Fase 08 — Integración, pruebas y entrega

2026-11-07 UTC. EN VALIDACIÓN; aceptación humana pendiente. Rama `codex/phase-08-delivery`, conserva íntegramente fases 00–07. Continuación autorizada por «Fase 8»; no autoaprueba fases anteriores ni un despliegue productivo.

## Alcance implementado

Se revisaron PLANS/AGENTS, objetivos, operación y memoria canónica. Se reutilizan unittest, HTTPX, uvicorn, SQLite backup, Outbox existente, estado/fixture de Experience, Playwright y GitHub Actions. No se añade motor, detector, modelo, protocolo o framework nuevo. La composición propia mínima es un escenario de entrega y empaquetado auditable.

- `scripts/demo-entity.sh` / `demo-release.py`: arranque nuevo y aislado, 20 observaciones exportadas del visor real, HTTP Core, tracks/zonas/relaciones, memoria/contexto, consulta con proveedor controlado, acción autorizada verificada y denegación sin permiso, trazas, reinicios de Core/Outbox y deduplicación, pérdida/reconexión de fuente, backup/restore a otra base y comparación exacta. 20 comprobaciones en un mismo recorrido; resultados por ejecución en .runtime/release-demo, sin tocar bases/servicios previos.
- `scripts/setup-demo.sh`: preparación portable Linux Python 3.12/Node24 con locks existentes. `setup-cloud.sh` corregido para resolver la raíz del repositorio desde el script, en vez de exigir /workspace/Entity.
- `scripts/package-release.py`: fuente comprometida y paquete web autónomo con SHA/manifest/checksums. Rechaza árbol sucio y recompila para no atribuir dist antiguo a un SHA nuevo. No incluye .runtime, DB, vídeos reales, tokens, venv ni node_modules. No es instalador offline. El ZIP estático usa solo index/assets y metadatos públicos.
- CI añade el escenario integrado y job delivery dependiente de toda la regresión; extrae la fuente en otra ruta limpia, instala y ejecuta la demostración desde ese paquete. Conserva archivos y checksums en artefacto entity-delivery.
- Guía sin programación en docs/DELIVERY-RUNBOOK.md, checklist de demostración, fallos/recuperación, distinción de evidencia y backlog con dependencias/esfuerzo en docs/DELIVERY-BACKLOG.md. Vídeo opcional no generado; se conservan capturas y demo pública.

## Evidencia local inicial

`bash scripts/demo-entity.sh`: 20/20 comprobaciones aprobadas, base nueva esquema5, proveedor controlled-fixture y HTTP real. Restauración íntegra y trace/idempotencia verificadas. Las medidas y el informe final se publican en docs/evidence/phase08-* tras validar el paquete y CI. Ninguna prueba física o inferencia remota se deduce de ese resultado.

## Sitio y límites

https://drbrownlabs-afk.github.io/Entity/ conserva la experiencia funcional de Fase 07; no se reimplementa la web por esta fase. Publicación verificada anteriormente por run 42331518986, versión de aplicación 1f1a3b3. No se publica Core a Internet. CORS/HTTPS opcionales, protocolos externos locales, vídeo grabado y hardware diferido conservan los límites de cada fase.

Pruebas pendientes al iniciar esta entrega: CI de rama, instalación desde paquete limpio y comprobación remota de publicación. No confundir tests escritos o evidencias históricas con ejecución nueva. Este apartado se actualiza al cierre.
