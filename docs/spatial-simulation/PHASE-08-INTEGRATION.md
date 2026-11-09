# P2-08 — Integración con P1 y retirada del demo anterior

## Alcance implementado

Se reutiliza el mismo servicio P1, SQLite, entidades, relaciones, eventos, proyecciones Office, sesiones y Núcleo. No otro backend/Core. Configuración explícita de sede `coworking-p2` en el mismo Core; conserva el sitio histórico P1 y evita reasignar sus recursos porque su inventario C/D y estado de E contradicen la escena actual. No se afirma integración con una instalación de producción: se verifica una instancia real local de P1.

Registro espacial: A–E; D1–D6; E1, E5, E6; RECEPTION, CAFE, LOUNGE. E2/E3/E4 no se añaden como puestos operativos solicitados. Los IDs lógicos se resuelven a Core IDs por el mecanismo UUID existente. Coordenadas de `scene.json`, marco Y-up de PlayCanvas, hashes del maestro/índice y lista de objetos. Dn usa la silla n del maestro; En usa la silla de índice n−1. Convención explícita de correspondencia, no levantamiento de puestos físicos certificado. Se conserva toda geometría.

Dos registros lógicos `PERSON-LOGICAL-01/02` sin identificar, etiquetados placeholders no verificados; posición y avatar nulos. No representan personas reales presentes. La interfaz permite registrar identidades lógicas con IDs explícitos. Ninguna ocupación, reserva o identidad observada se inventa. Estado inicial `unknown`; las ediciones se rotulan declaradas por operador, sin verificación física.

Cada entidad tiene relaciones partOf y evento de registro persistente. El indexador HTTP añade memoria de procedencia idempotente a las 19 entidades solicitadas. La nueva capacidad P1 `entity.remember` usa tablas de memoria Core existentes y la transacción/comando de Núcleo; no API paralela. Consulta `memories` en la API de consultas existente y con visibilidad/sede actuales. No se simulan consultas históricas de memoria: se rechazan hasta disponer de contrato temporal correspondiente.

P1 frontend ofrece `OfficeCoreClient` reutilizable; P2 lo consume. Login y token solo en memoria, password borrada del formulario. API configurable, errores explícitos sin mocks/fallback. Consulta de mundo/revisión cada 2 s independiente del render, lectura de historia y memoria, selección vinculada a objetos, enfoque espacial, escritura de memoria/estado declarado y alta lógica de personas. Los controles visuales locales de luces/puertas siguen marcados simulación y no se presentan como operaciones Core.

## Ejecución reproducible

```
python scripts/spatial-simulation/prepare-core.py --output simulation/spatial-office/.runtime/core-site.json --clock 2026-11-09T12:00:00Z
python scripts/provision-office-site.py simulation/spatial-office/.runtime/core-site.json --database simulation/spatial-office/.runtime/p2-core.sqlite3
ENTITY_SQLITE_PATH=$PWD/simulation/spatial-office/.runtime/p2-core.sqlite3 ENTITY_ALLOWED_ORIGINS=http://127.0.0.1:5190 python -m uvicorn app.main:app --app-dir services/entity-api --host 127.0.0.1 --port 8092
python scripts/spatial-simulation/index-core.py --api http://127.0.0.1:8092 --credentials simulation/spatial-office/.runtime/coworking-p2-access.json
```

Credenciales aleatorias en archivo privado 0600 e ignorado; no publicarlas. La fecha explícita es reloj de laboratorio, no evidencia operativa. Provisionar otra vez la misma configuración conserva el sitio; diferencias requieren cambios revisados. Un frontend Pages HTTPS necesita una API HTTPS accesible y CORS configurado; el backend local no se publica automáticamente con el estático.

## Retirada de ENTITY Experience / Mall Lab

Origen activo anterior: `apps/web/index.html` → `src/main.js` → scene/model/fixture de `worlds/shopping-mall`, publicado por pages.yml. Se conserva fuente/fixtures y módulos Office de P1 para reutilización y pruebas históricas. La entrada index redirige al coworking. No se borra Core, Núcleo, APIs, frontend Office ni Gaussian.

Único publicador activo: publish-coworking.yml. Reemplaza el árbol de artefactos publicados por coworking en `/Entity/spatial-simulation/`, una raíz/404 de entrada y manifiesto SHA. Retira los HTML/assets antiguos del despliegue, conservados en Git. Deshabilita pages.yml y spatial-pages.yml mediante la API autorizada del runner para que versiones anteriores en otras ramas no vuelvan a publicar. Sus archivos de la rama actual solo anuncian su retirada. Concurrencia compartida entity-pages.

No se atribuye éxito remoto por escribir el workflow: los resultados reales se registran en evidencia. Sin tareas de Mixamo, avatares, animaciones, vídeo, cámaras ni nuevos pisos. P2-06/07 pendientes por orden del operador.

## Resultados ejecutados

5 pruebas de integración/actualización/atomicidad P1 PASS; 11 contratos Core PASS; 49 Office PASS; 15 frontend P1 PASS; 11 lógica P2 PASS. Chromium/P1 HTTP real: 11 checks PASS y21 navegación/regresión PASS (desktop y emulación táctil). Reinicio completo Uvicorn: entidades/relaciones/estado/memorias idénticos. No benchmark físico móvil ni garantía de calidad visual por estas pruebas. Registro inicial de memoria usa referencia compacta al mapa, no una copia completa de todos los objetos, para respetar el contrato de4000 caracteres.

Retirada pública: workflow42563938970 SUCCESS; rama de artefactos solo contiene coworking y entrada/404/manifest. El navegador remoto de pruebas real P2 llama P1 local por HTTP/CORS; no hay backend HTTPS de producción configurado en Pages. No fingir conexión pública ni desplegar credenciales en estático.
