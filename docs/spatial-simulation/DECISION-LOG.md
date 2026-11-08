# Decisiones de ejecución del plan espacial

## 2026-11-08 — Codex: aislamiento y primera fase

- El entorno abrió `main`/`work` en `5ce2519`, sin plan espacial. `git ls-remote --heads origin` identificó `codex/spatial-simulation`; se obtuvo su commit `a037bb8` y se usó esa rama existente como base. Sin worktree, merge ni cambio de la rama remota `main`.
- Se prioriza el alcance explícito del plan y del operador: exclusivamente archivos nuevos en `simulation/` y `docs/spatial-simulation/`. Los registros de estado, bitácora y decisiones se añaden aquí, sin reescribir memorias históricas ni fuentes protegidas.
- Blender 4.3.2 y Cycles existentes se reutilizan para modelado, modificadores, cámaras y render. No se implementa motor, segmentador, servicio, segundo Core ni base de datos. Las primitivas editables son una reconstrucción necesaria: los datos fuente no contienen malla segmentada.
- Conversión rígida `(x,y,z)->(x,-z,y)` aplicada una vez al leer OBJ/coordenadas. Se guardan los puntos originales e inversa. Unidades relativas, sin certificación métrica.
- Las formas se parametrizan en `simulation/spatial-office/layout.json`, con procedencia y limitaciones. A/B conservan sus anclas y puestos lógicos sin atribuir coordenadas medidas a las sillas nuevas. C/D conservan las doce superficies calibradas. Se distinguen suelo medido, slab estimado, dos niveles y geometría no conocida.
- Se entrega Fase 01 para revisión antes de iniciar Fase 02, por el control humano requerido en `AGENTS.md`. No se extiende la excepción histórica 09.x a otro plan ni se marca aprobación humana.
- Estrategia de binarios: maestro `.blend` comprimido pequeño y renders de evidencia versionados en la rama; scripts permiten regenerarlos. Sin chunks Gaussian descargados ni binarios masivos/LFS requeridos para esta entrega.
- La compilación disponible no tiene OpenImageDenoise. Se conserva el fallo inicial y se usa Cycles CPU sin denoising, 48 muestras/cuatro hilos. Es una limitación visual de los renders de referencia, no un cambio en las fuentes.

## 2026-11-08 — Corrección posterior: cafetería en brazo de la L

El operador rechaza la simplificación a un rectángulo: confirma un brazo posterior en L en el sector de los pods, destinado a cafetería con mesas normales, y entrega las referencias 1212 (cafetería) y 1211 (mamparas). Se crea un maestro derivado separado; se conservan Gaussian, evidencia, anclas y maestro anterior. La localización se vincula al sector REST-AREA, sin reflejar el sistema de coordenadas para adaptar una palabra direccional dependiente del punto de vista. Los límites del ala nueva siguen siendo parámetros de diseño estimados. La corrección de cafetería queda autorizada por esta solicitud; no implica aprobar el resto de gates ni declarar terminadas las mamparas de todas las salas.

## 2026-11-08 — Fase 02 autorizada y disposición E

El operador autoriza continuar toda la Fase02. Se conserva la L/cafetería; E se ubica detrás de D sin mover sus superficies calibradas. Se extiende el límite posterior estimado 2,1 unidades relativas (hasta Z−28,6, en X−2,85..4,35) para encajar seis posiciones y acceso. No se presenta como geometría medida. Mamparas hasta techo con perfiles delgados y una sola pared compartida D/E; siete puertas con pivot/hoja/proxy sincronizados y bloqueo exclusivamente simulado. Se reutilizan animación y matrices de Blender para controles locales, sin Core ni runtime físico nuevos; PlayCanvas funcional continúa en sus gates. QA de circulación usa BVH de suelos reales, caja conservadora de obstáculos y búsqueda de rutas solo como prueba del modelo. Registro de poses actuales separado de la procedencia original evita reescribir anclas. Se conservan maestros previos, backend/frontend/Gaussian y evidencia de fallos. Fase02 EN VALIDACIÓN; no inicio de Fase03 ni autoaceptación.

## 2026-11-08 — Incorporación de decisiones remotas y ejecución 02–04

Se detectaron commits concurrentes del operador c4ae146..8490e1a y, después, d51e2b9, todos sobre el plan espacial. Se preservan por rebase, sin merge ni force-push. Sustituyen la pausa entre 02–04, la L como forma final y la correspondencia antigua recepción negra/espera blanca. La C añade un ala social/servicios; el nuevo reloj visual usa un solo parámetro de hora para sol/cielo/exposición y política de todas las luces. Sin datos de ubicación del edificio, se usa una trayectoria artística explícita y se prepara Astral parametrizable; no se inventa geografía. Las pruebas de Astral usan un observador sintético identificado como QA.

Se reutilizan Blender/Cycles/BVH/glTF y Astral 3.2; luz artificial es mutable por dispositivo/circuito, incluidos emisores de barra. Solo se hornea albedo, no iluminación. La prueba glTF aislada contiene cinco cubos de material, no exportación final del edificio. Para revisión se conservan PNGs crudos y copias de OIDN 2.3.3 oficial fijado por hash tras descarga HTTPS verificada; filtro de ruido, no reconstrucción creativa ni edición de las referencias del usuario.

El snapshot histórico original no se reescribe: una revisión complementaria admite solo el hash exacto del plan remoto verificado con Git, mientras conserva los otros 577 archivos. No se ignoran cambios arbitrarios del plan ni se excluyen fuentes del guard. Backend/UI/Gaussian y handoff inmutables. Se detiene obligatoriamente tras Fase04, para aprobación antes del visor y Mixamo.
