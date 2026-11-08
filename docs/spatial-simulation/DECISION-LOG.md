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
