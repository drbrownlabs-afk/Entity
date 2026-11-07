# Fase 09 — Checkpoints y evidencia
Estado global: EN CURSO. Integradas implementaciones 943ff31 y reglas actualizadas 14c33fe.
Rama de planificación: `codex/phase-09-autonomous-plan`.
El acceso HTTP del ejecutor obtuvo403; el operador confirma la escena disponible. Se investiga mediante Chromium autorizado en GitHub Actions, sin inferir inexistencia del recurso.

| Subfase | Estado | Pruebas/evidencia | Commit/PR | Siguiente |
|---|---|---|---|---|
| 09.1 | EN CURSO | HTTP200 en Chromium remoto, escena original/collision/SSOG localizados; SSOG original remoto integrado; Vite opcional, no bloqueante | merge2d73e1d | SSOG original, anotaciones y modo walk ya verificados en baf37b3; faltan recorridos espaciales completos y zonificación operativa; Vite NO es dependencia |
| 09.2 | PENDIENTE | — | — | Implementar y ejecutar gate 09.2 |
| 09.3 | PENDIENTE | — | — | Implementar y ejecutar gate 09.3 |
| 09.4 | PENDIENTE | — | — | Implementar y ejecutar gate 09.4 |
| 09.5 | PENDIENTE | — | — | Implementar y ejecutar gate 09.5 |
| 09.6 | PENDIENTE | — | — | Implementar y ejecutar gate 09.6 |
| 09.7 | PENDIENTE | — | — | Implementar y ejecutar gate 09.7 |
| 09.8 | PENDIENTE | — | — | Implementar y ejecutar gate 09.8 |
| 09.9 | PENDIENTE | — | — | Implementar y ejecutar gate 09.9 |

## Regla de registro
En cada gate, añadir fecha, comandos exactos, resultado PASS/FAIL/NO EJECUTADO, capturas/logs sin secretos, problemas y correcciones, SHA, estado GitHub, dependencias y próxima acción. Nunca inventar pruebas. Al reiniciar Codex, leer este documento y retomar el primer gate no verificado.

## Checkpoint de implementación y acceso — 2026-11-07

- Original SSOG: `baf37b3`, informe `docs/evidence/phase09/original-integration.json`, escritorio1440/táctil emulado390 PASS; 4 anotaciones originales, walk nativo habilitado, sin escena sustituta. No equivale a validación de todos los recorridos/colisiones ni de teléfono físico.
- Receptor oficial Vite/SSOG: 3/3 tests de archivo PASS. Escritorio interactivo sin herramienta disponible y sin sesión autenticada utilizable; no se ha descargado un export Vite autenticado. CONNECT403 corresponde al proxy, no prueba fallo de autenticación. Directorio de entrada vacío. Protocolo en PHASE-09-ASSET-INTAKE.md.
- Checkpoint parcial de backend/API: módulos Office y Núcleo, permisos por sede/rol, reservas concurrentes, visitantes/host, observaciones anónimas con deduplicación, sensores, incidencias, tareas, memoria temporal y ramas what-if implementados. `PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v`: 47/47 PASS (14 Office y33 regresión); salida conservada en `docs/evidence/phase09/backend-regression.txt` (incluye advertencia de deprecación Starlette/httpx). Tests de API/SQLite y transporte controlado, no validación espacial ni hardware.
- Interfaz operativa enlazada al Core por API configurable, sin token persistido en navegador; compilación Vite comprobada. Su E2E con Core HTTP sigue pendiente. Bootstrap toma posiciones del archivo original; no afirma calibración individual de puestos, equipos o accesos.
- La tabla conserva los gates 09.2–09.9 PENDIENTES: existe implementación parcial, pero todavía no se han verificado integralmente ni se autoriza confundir tests unitarios con cierre de subfase. Pendientes personajes/recorridos originales, CCTV sincronizado completo, escenario diario, adaptadores de prueba y entrega integral. Ninguna aprobación solicitada ni concedida.


## Corrección de prioridad y zonificación — 2026-11-07 (decisión del operador)

**Continuación autorizada, sin Vite.** El viewer ya utiliza el SSOG original publicado y sus voxels (pruebas `baf37b3`). La búsqueda/descarga de Vite ZIP autenticado fue una prioridad errónea y queda expresamente retirada del camino crítico. El operador ya tiene Vite y NO necesita suministrarlo. No detenerse ni volver a investigar login, proxy o descarga para avanzar 09.1–09.9. El estado de 09.1 permanece EN CURSO porque faltan comprobaciones espaciales, no por falta de Vite. Las subfases 09.2–09.9 no están verificadas, aunque hay backend/UI parcial. El próximo trabajo es continuar implementación y pruebas, no emitir otro informe de descarga.

**Topología funcional fijada:** mesa negra junto a pared = reunión; conjunto de seis puestos contiguo = oficina privada 01; siguiente conjunto de seis = oficina privada 02; restantes puestos = individuales; dos sillas negras aisladas = recepción provisional; otro grupo de sillas = espera. Consultar `docs/phases/PHASE-09.md` para política y validación de anclas. El bootstrap actual clasifica erróneamente los dos grupos `Office Bench` como puestos individuales; corregir esa semántica y probar reservas privadas vs públicas sin inventar coordenadas ni borrar datos existentes.

**Siguiente gate ejecutable:** (a) revisar SSOG real y anclas; (b) corregir inventario/bootstrap/roles/recursos y validar espacialmente 09.1; (c) probar y cerrar el gate 09.1 con evidencia; (d) avanzar de inmediato por 09.2–09.9 con las pruebas de cada gate, sin aprobaciones intermedias. No marcar gate superado hasta ejecutarlo. La copia local SSOG y el ZIP Vite quedan opcionales y fuera de bloqueos.


## Hallazgo de cobertura espacial — 2026-11-07
El operador confirma MÁS conjuntos de mesas de seis sillas en la escena que los dos `Office Bench` anotados. El bootstrap actual itera solo cuatro anotaciones y por tanto **subrepresenta la escena**. Corrección obligatoria antes de cerrar 09.1: inspección visual integral del SSOG, inventario de mobiliario y grupos NO anotados, diferenciación por adyacencia de dos oficinas privadas junto a mesa negra y resto de puestos individuales; recepción y espera independientes. Registrar capturas y anclas verificables; no inferir coordenadas ni cantidades no observadas. No convertir dos anotaciones en dos oficinas privadas sin comprobar su ubicación. No depender de Vite. Esta modificación documental NO afirma que el inventario visual ni el bootstrap estén ya corregidos.
