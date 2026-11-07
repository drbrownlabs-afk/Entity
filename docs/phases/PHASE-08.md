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

Pruebas locales adicionales ejecutadas:

- `python scripts/package-release.py` dos veces + `cmp` de manifest: igualdad aprobada después de fijar timestamps de metadatos ZIP; hashes/allowlists del tar/ZIP comprobados.
- Fuente 9c601af extraída en otra carpeta /tmp sin .git ni dependencias previas; `bash scripts/setup-demo.sh` terminó correctamente, `bash scripts/demo-entity.sh` aprobó 20/20. La CI final también verifica la revisión posterior del paquete.
- ZIP 3978a9f extraído y servido con host temporal Node (sin Python/Core), `PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium node apps/web/scripts/check-bundle.mjs ...`: aprobado 1280 y 390 px táctil; siete tiendas, cinco cámaras/revisión, acción/consulta sin red tras cargar y cero errores/llamadas Core. Sin garantía de recarga offline.
- Medida del escenario inicial: arranque 0.626 s, reinicios 0.591/0.487 s; 20 observaciones con mediana 5.41 ms/p95 8.80 ms/máximo 9.15 ms. 22 observaciones (20 de replay + corte/recuperación). Son muestras locales, no SLA ni carga multi-cámara.
- PR REST POST /repos/drbrownlabs-afk/Entity/pulls: Forbidden por entorno, igual que en fases anteriores. Git push autorizado funciona; no PR nuevo ni merge, no Git manual trasladado al operador.

Correcciones: ruta fija de setup-cloud, empaquetador inicialmente exigía un dist previo en vez de construir desde checkout limpio (detectado en revisión antes del primer CI), timestamps ZIP fijados para repetibilidad. No se detectó defecto de Core en el escenario. Los fallos simulados de Output/percepción/red siguen probándose en regresión previa de CI.

## Cierre verificado tras recuperar el entorno

La interrupción de sesión no invalidó las pruebas ni los commits: se retomó la misma rama y se conservaron todos los archivos pendientes. No se reconstruyeron componentes ni se repitieron pruebas ya aprobadas. Cambios de cierre exclusivamente documentales y de evidencia.

- Código probado/publicado: [3978a9f02b9db4972738af6481c26ee8b498da03](https://github.com/drbrownlabs-afk/Entity/commit/3978a9f02b9db4972738af6481c26ee8b498da03), rama `codex/phase-08-delivery`; fases anteriores preservadas y main incorporado. No fusionado a main.
- [CI final 42333312084](https://github.com/drbrownlabs-afk/Entity/actions/runs/42333312084): **Success**, 2m49s; api-tests 49s, edge-tests 1m44s, experience-tests 1m07s, delivery 57s. Sin anotaciones en el resumen observado. Resultado consultado nuevamente tras recuperar el ejecutor, no supuesto por el workflow.
- Regresión aprobada en ese run: 29 Core, 7 Edge, 4 Node y 3 Playwright; Docker/health/persistencia, detector/vídeo/recuperación, Output/errores, agente controlado, RTSP/MQTT/REST y exportación del visor al Core. Escenario integrado de 20 comprobaciones ejecutado en edge-tests y de nuevo desde la fuente empaquetada en delivery.
- Delivery aprobó dos construcciones con manifiestos idénticos, ZIP real en escritorio/táctil con acciones offline tras cargar y fuente extraída en una ruta nueva con dependencias instaladas desde cero mediante setup-demo/demo-entity. No es solo una compilación.
- Artefactos de ese mismo run: **entity-delivery** (951 KB), **experience-evidence** (826 KB), **edge-report** (3.57 KB). Descargar desde la sección Artifacts del enlace CI (requiere sesión GitHub). Entity-delivery contiene entity-source.tar.gz, entity-experience.zip, manifest.json y static-verification.json. Digest del artefacto completo: `sha256:8ab38742bdd0a39615ae9c44fc18ca41dcb9e6eb1fb05d236ef8b719dc755a92`.
- Evidencia versionada: `docs/evidence/phase08-ci-final.json`, `phase08-integrated.json`, `phase08-clean-install.json`, `phase08-static-bundle.json`, `phase08-package-manifest.json`. Los informes locales y sus SHA de origen se distinguen de la conclusión remota. Los hashes de los dos paquetes locales conservados se comprobaron de nuevo contra su manifiesto; no se atribuyen como descarga del artefacto remoto.
- Gestión de PR todavía limitada: nueva consulta REST de PR por rama devuelve Forbidden desde api.github.com; Git fetch/push y consulta pública de Actions funcionan. No se creó un PR nuevo ni se realizó merge durante este cierre. No se solicitan operaciones Git manuales al operador.

[Guía del operador](../DELIVERY-RUNBOOK.md) y [backlog priorizado](../DELIVERY-BACKLOG.md) quedan publicados junto a esta evidencia. Demo pública conservada: https://drbrownlabs-afk.github.io/Entity/ (modo autónomo simulado, versión de aplicación de Fase07 sin cambios en esta fase; prueba pública histórica enlazada arriba).

**Fase 08 EN VALIDACIÓN, pendiente de aceptación humana.** Límites pendientes: Orbbec/actuadores y calibración físicos, teléfonos/Safari físicos, proveedor LLM remoto, instalación offline/otros sistemas operativos y Core productivo público. No bloquean la revisión del demostrador virtual autorizado y no se presentan como probados. La recuperación del entorno resuelve el bloqueo de ejecución anterior; permanece la limitación API para PR. No se autoriza una fase nueva ni se declara APROBADA.
