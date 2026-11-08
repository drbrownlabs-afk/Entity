# Bitácora del laboratorio espacial

## 2026-11-08 — Codex / reconstrucción Fase 01

- Objetivo: ejecutar el primer gate del plan `docs/spatial-simulation/IMPLEMENTATION-PLAN.md`, preparar entorno Blender reutilizable y conservar la base original.
- Rama/base: el entorno abrió `work` desde `main`/`5ce2519`, sin el plan. Se comprobó `git ls-remote --heads origin`, se obtuvo la rama existente `codex/spatial-simulation` y se comenzó en `a037bb8fcf9e90e510e364edf00452611a8faed8`. Sin worktree ni merge. El SHA de entrega se informa tras el commit; no se presume publicación antes de comprobar el push.
- Archivos nuevos: `simulation/spatial-office/{build.py,common.py,layout.json,validate.py,render.py,gate.py,tests/test_sources.py,README.md,PROVENANCE.md,output/}`; informe, tablero, estado, decisiones, bitácora y evidencias bajo `docs/spatial-simulation/`. Se mantienen todos los documentos y artefactos originales, incluido el plan.
- Comportamiento real: maestro Blender comprimido, 1.139 objetos catalogados/14 cámaras; geometría editable, anclas originales, guía parcial exacta, reconstrucción estimada de envolvente/mobiliario, niveles diferentes de recepción/suelo; A/B/C/D, reunión, espera, recepción y booths representativos. Sin Core nuevo, sin modificar negocios ni reservas.
- Preparación: Blender 4.3.2/Cycles CPU y Python 3.12.14 disponibles; cuatro CPU de cuota. Sin instalaciones, servicios ni secretos. Lectura de configuración falló dos veces y guardado de `start_skill` quedó sin confirmar (`INVALID_ARGUMENT`). Instrucciones en README; no se afirma entorno publicado o nueva instancia validada.
- Comandos/resultados: `python3 -m unittest discover -s simulation/spatial-office/tests -v`, cinco PASS; reproducción temporal del extractor byte-idéntica (56/7/16709/29526). Constructor ejecutado y repetido tras corregir geometría. `blender -b --factory-startup -t 4 --python-exit-code 1 --python simulation/spatial-office/validate.py`, 99 comprobaciones PASS en el maestro final. Ningún archivo de los 578 de la base cambia de contenido.
- Fallos corregidos: denoiser OIDN ausente; dirección numéricamente inestable de una cámara de planta nueva; mueble de A cruzando mesa; planta cortada; superficies C/D inicialmente estimadas donde había cotas calibradas; ajuste de patas al suelo. Se conservaron logs y una imagen rechazada; asertos adicionales evitan repetir los errores. No se debilitaron anclas fuente ni se ocultaron objetos para hacer pasar pruebas.
- Evidencia visual final: diez renders Cycles CPU, 48 muestras sin denoising, examinados directamente y comparados con las capturas fuente. `python3 simulation/spatial-office/gate.py` terminó con código 0: VERIFIED_WITH_DOCUMENTED_LIMITATIONS, cinco tests PASS, 99 comprobaciones Blender PASS, diez imágenes actuales, 578 fuentes originales intactas. Resultados/hashes en `evidence/phase01/{gate.json,gate.txt,visual-review.json,renders.json}`. Prueba negativa separada: el gate rechazó renders incompletos con código 1. Reconstrucción reconocible, sin afirmar coincidencia exacta, medidas certificadas ni acabado premium.
- No ejecutado: suites/servicios backend y frontend anteriores, PlayCanvas nuevo, GLB nuevo, dispositivos operables, personajes, hardware y CI remoto. No se atribuyen pruebas históricas a este lote.
- Decisiones: [DECISION-LOG.md](DECISION-LOG.md). Registros nuevos en esta carpeta para cumplir el aislamiento sin reescribir la memoria histórica.
- Estado: EN VALIDACIÓN, aceptación humana pendiente. Fases 02–06 NO INICIADAS por el control de revisión de `AGENTS.md`. Próxima acción: revisar maestro/capturas e informe y aceptar Fase 01 antes de construir mamparas, Sala E y cafetería.

### Entrega GitHub comprobada — 2026-11-08

- Implementación y evidencias: [`90ea7700b0f8656c9ae4b3bc005aa971ae5cd065`](https://github.com/drbrownlabs-afk/Entity/commit/90ea7700b0f8656c9ae4b3bc005aa971ae5cd065).
- `git push -u origin HEAD:codex/spatial-simulation` terminó con código 0 y publicó `a037bb8..90ea770` en la rama autorizada. Sin merge ni PR nuevo. No se afirma ejecución de CI remoto.
- Comprobación previa al commit: 45 archivos añadidos exclusivamente bajo rutas autorizadas, ninguno supera 5 MB; `git diff --cached --check` PASS. Árbol limpio tras publicar.
- Este apunte documental se guarda después de confirmar la publicación; no cambia el maestro, hashes, resultados ni aprobación pendiente.

## 2026-11-08 — Codex / corrección solicitada de cafetería y L

- Base: `96a2d0a`, misma rama `codex/spatial-simulation`, sin merge.
- Instrucción del operador: incorporar la L en el extremo de los pods, cafetería al fondo y sustituir pods por mesas normales; referencias 1212/1211 ahora suministradas.
- Implementado: `build-cafe.py`, `check-cafe.py`, `cafe-layout.json`, maestro separado `office-cafe-L.blend` e inventario. Ala posterior estimada, continuidad del suelo elevado, dos mesas/ocho sillas, barra/cuatro taburetes, máquina de café, almacenamiento, frigorífico, vitrina, estantes, plantas y luz cálida. 225 objetos nuevos catalogados; pods reconstruidos ausentes en el nuevo maestro. Maestro Phase01 y 578 archivos originales intactos.
- Evidencias: `docs/spatial-simulation/evidence/cafe-correction/`; reapertura y verificaciones estructurales ejecutadas en Blender separado; renders Cycles reales de planta, general e interior. Resultados concretos y revisión en CAFE-L-CORRECTION.md/checks.json/renders.json.
- Archivos: nuevos scripts, parámetros, maestro/inventario, dos referencias provistas por operador con hashes, renders/logs, informe y actualizaciones en documentación específica del escenario. Backend, frontend previo y Gaussian sin cambios.
- Limitaciones: extensión dimensionada como diseño, no levantamiento medido; lenguaje visual inspirado en referencias, sin prometer equivalencia fotográfica. Iluminación todavía de referencia; mamparas, puertas, Sala E, cuatro TVs y navegación pertenecen a gates posteriores. No se acepta automáticamente Fase01/Gate02 ni se prueban dispositivos físicos o runtime.
- Próximo paso: revisar la planta corregida y continuar el incremento de cerramientos funcionales pendiente, conservando la nueva topología.

## 2026-11-08 — Codex / revisión de mesa adicional al fondo

- Solicitud: comprobar si la mesa adicional solicitada pertenece a Fase01 y conservar su ubicación al fondo.
- Rama/base: codex/spatial-simulation, `0586de5132d878147de8285a7d7ebd72c0bd23e3`.
- Revisión ejecutada: búsqueda de Fase01/Fase02/Sala E en IMPLEMENTATION-PLAN.md y lectura de ambos inventarios generados. La nueva agrupación Sala E está prevista en Fase02; no existe en el modelo actual. Las dos mesas de cafetería son un incremento distinto.
- Cambio: PHASE-BOARD.md registra ubicación al fondo y mantiene E pendiente, con circulación y separación de cafetería como comprobaciones futuras. No se modifican plan fuente, geometría, backend, frontend ni Gaussian.
- Validación: inspección documental/inventarios; sin tests de ejecución adicionales por cambio solo documental. No se presenta la mesa como implementada.
- Próximo paso: modelar la agrupación E al fondo con namespace de simulación y validar acceso, mamparas y ausencia de intersecciones dentro de Fase02.

## 2026-11-08 — Codex / Fase 02 completa autorizada

- Objetivo: ejecutar arquitectura funcional y Gate02 por orden explícita «continúa con la fase dos».
- Rama/base: codex/spatial-simulation, `cd95f96`, sin merge.
- Implementación: nuevo maestro `office-phase02.blend`; constructor, controlador local de puertas, checker geométrico/navegación, renderer, inventario completo y plano SVG. A–E/reuniones con mamparas transparentes/perfiles negros, E al fondo con seis posiciones, recepción/espera, rampa, cuatro televisores con materiales/UV/texturas propios, siete puertas con pivotes/proxies y estados simulados. Cafetería en L y dos mesas preservadas, sin pods. Ninguna entidad comercial Core nueva.
- Archivos: `simulation/spatial-office/{phase02-layout.json,build-phase02.py,check-phase02.py,doors.py,render-phase02.py,inventory-phase02.py,plan-phase02.py,output/office-phase02.blend,output/phase02-inventory.json,output/phase02-full-inventory.json}`; informe, evidencia y memoria específica del escenario bajo docs/spatial-simulation; README actualizado.
- Pruebas reales: Blender 4.3.2/Cycles CPU. Reapertura separada, 293 comprobaciones PASS, cero mamparas cruzando muebles/columnas, barrido completo de siete puertas sin choque, matrices de colisionadores sincronizadas, bloqueo que detiene animación pendiente y deniega apertura, comandos individuales, cuatro TVs con UV/texturas empaquetadas. Diez rutas sobre suelo BVH real con escalones limitados; seguridad cerrada impide ruta al fondo y abierta la permite. Anclas y mesas/asientos A–D preservados; 578 archivos originales y maestro café conservados por hash.
- Fallos corregidos: puerta de reunión rozaba silla (bisagra desplazada, sin mover silla); duplicación de pared compartida D/E (panel único y cierre posterior correcto), con prueba adicional; checker ejecutado demasiado pronto y error de indentación corregidos. Logs e imagen rechazada conservados. Se refinó bloqueo y se añadieron UV/texturas de prueba; no se redujeron asertos para pasar gates.
- Evidencia visual: plano con IDs y rutas, renders Cycles de planta/general/interior/E, hashes y revisión final en evidence/phase02. Resultados definitivos se consolidan antes de publicar.
- Límites: extensión trasera para E es diseño estimado; unidades no certificadas; material/luz CPU de referencia, sin apariencia premium validada. No PlayCanvas nuevo ni pruebas físicas/CI remoto ni suites backend/frontend; no se atribuyen resultados históricos al lote. Interacción local Blender, no control físico de acceso.
- Estado: EN VALIDACIÓN para revisión del operador. Fase03 no iniciada. Próximo paso: material/luminarias/circuitos y dispositivos según el gate siguiente, tras revisión.
