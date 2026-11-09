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

## 2026-11-08 — Codex / continuidad autorizada hasta Fase04 y checkpoint de revisión

- Autor/ramas: Codex en codex/spatial-simulation. Inicio cd95f96; checkpoint local de arquitectura Fase02 f1092e9 (tras rebase). Commits concurrentes del operador c4ae146..8490e1a y d51e2b9 preservados; sin merge/force-push. El SHA final publicado se informa al cerrar la entrega.
- Cambio de alcance recibido en el plan: recepción blanca/espera negra, tercera ala en C antes de materiales, autonomía 02→04, cuatro horas 08/12/16/20 y bloqueo de PlayCanvas/Mixamo hasta aprobación posterior. Se aplica la nueva secuencia; no se pausa indebidamente entre 02–04 ni se inicia login Mixamo.
- Fase02 actualizada: recepción/counter y TV junto a sillas blancas; sillas negras sustituidas por sofá/espera y TV correspondiente. Los registros originales del handoff siguen históricos; mapa operativo en configuración. 295 comprobaciones PASS/diez rutas y cuatro renders actuales.
- Fase03: maestro C, lounge, dos cabinas con ventilación/mesa/luz, baños opacos sin cámaras, ocho lockers operables adyacentes y estación de impresión. Nueva rampa y cierre elevado secundario evitan bypass del cierre principal. 644 comprobaciones PASS/dieciséis rutas/19 puertas/cinco pantallas. Cuatro renders revisados; se ajustó encuadre de lounge y colgantes/maceteros estimados dentro de las mamparas. Puertas de lockers corregidas para no rozar estantes; punto de aproximación a cabina corregido a suelo libre sin reducir radio QA.
- Fase04: maestro office-phase04.blend, 54 luminarias individuales y 17 circuitos, emisores realmente conmutables, reloj local 24h con ±1/10/60/360×, pausa/scrub/reversa, recuperación y panel Blender registrado/operado en tests. 486 comprobaciones PASS. Ubicación desconocida conservada como null; Astral 3.2 probado con observador sintético, trayectoria artística etiquetada por defecto. Sin observaciones reales generadas por reloj.
- Materiales/visuales: albedo de terrazzo horneado sin iluminación, textura empaquetada y UV. Cinco swatches glTF aislados exportados/reimportados PASS (factores/color/roughness/metallic/transmisión/textura), sin exportar el edificio. Diez renders Cycles de cuatro horas, ON/OFF/una luz y áreas nuevas; diez copias oficiales OIDN, originales intactos y hashes. Brillo medio sRGB sin filtrar de A: todas ON0,4902, una0,2304, OFF0,0047. Es medida de imagen, no lux.
- Fuentes/proveniencia: 577 fuentes originales byte-idénticas; plan actualizado externamente admitido solo por hash/commit exacto en upstream-revisions.json. Ningún cambio backend/frontend/Gaussian/handoff ni evidencia original. Referencias externas tipológicas devolvieron403 del proxy; no se obtuvieron assets ni se finge inspección. Cinco capturas adicionales nombradas upstream no presentes; se usan 1211/1212 provistas. Fuente OIDN oficial HTTPS y hash fijado; API de digest403, no se atribuye digest oficial. Binarios/paquetes en .runtime ignorado, sin secretos.
- Configuración del entorno: setup-lighting.py ejecutado, hashes de locks y archivo OIDN verificados, dependencias locales. Borrador install_script/start_skill no confirmado por INVALID_ARGUMENT; instrucciones probadas sí en repositorio, sin afirmar publicación del entorno o validación en nueva instancia.
- Archivos: scripts/layouts/requirements con hashes/controladores/manifest/maestros e inventarios en simulation/spatial-office; informes02/03/04, REVIEW-PHASE04, planos, capturas/logs/proveniencia y estado específico bajo docs/spatial-simulation. Nada fuera del alcance salvo cache local de dependencias bajo /workspace.
- Estado: gates internos verificados con límites visuales y de escala declarados; Fase04 EN VALIDACIÓN DEL OPERADOR. PlayCanvas y personajes NO INICIADOS; solo la prueba de swatches aislada permitida. Próxima acción: revisión explícita del operador antes de autorizar Fase05. Sin CI remoto, pruebas físicas ni suites legacy atribuidas a este lote.

### Cierre de entrega 2026-11-08 — Git y conservación

Se conservó por rebase la actualización externa d51e2b9 (únicamente instrucciones futuras de login Mixamo; sin iniciar Fase06), junto con las revisiones anteriores del plan. Checkpoint de implementación posterior al rebase: 27d7dce. El guard comprueba 577 archivos originales idénticos y la revisión exacta del plan d51e2b9 por SHA256/Git, sin exclusiones amplias. Gate consolidado: 295/644/486 comprobaciones, renders vinculados al maestro por hash, configuración local repetida correctamente. Entrega en rama codex/spatial-simulation, sin merge a main; publicar y comprobar SHA remoto forman el último paso. Fase04 EN VALIDACIÓN; requiere aprobación humana antes de Fase05. El servicio de borrador del entorno devolvió INVALID_ARGUMENT: pasos locales guardados/probados, persistencia cloud no confirmada.

Publicación comprobada: commit `d6c740ba1d08aa5899b286d01c1c2649eb6e3f33` disponible en `origin/codex/spatial-simulation`; `git ls-remote` coincide con HEAD y árbol limpio antes de este cierre documental. No fusionado a main. Gate final PASS y aceptación humana pendiente.

## 2026-11-08 — revisión de calidad arquitectónica solicitada por el operador

Base publicada e75987f, misma rama codex/spatial-simulation, sin merge. Se solicita más comedor, retirada de sillas blancas, lounge equipado, TV grande y baño visible; después se exige acabado premium y se reciben JPG1290/1288/1286 como mínimo visual. Se mantienen arquitectura y poses del maestro anterior; el reemplazo del grupo blanco prevalece sobre su etiqueta anterior de recepción. Maestro derivado office-phase04-revision.blend, SHA256 `42d4c2e810b19158cfff48f623e927638649d174473c9c2b6876b05a3746ed89`, fuente office-phase04.blend intacta. Se integran seis modelos profesionales Khronos con licencias/atribución y HDRI CC0; no se sustituyen capturas por las referencias. Cuatro mesas/catorce sillas más cuatro taburetes; dos nuevos sofás de espera; lounge detallado, pantalla reuniones, sanitarios y señalización. Materiales/vidrio/indirecta, teclas y respaldos refinados; 64 luces/17 circuitos/19 puertas/6 pantallas.

Ejecutado: build-revision.py, check-revision.py: **656 PASS**, 21 rutas con radio .18/paso .1/salto .06; mamparas/muebles, once muestras por puerta, collider/hoja, matriz de elementos heredados, original protegido, control de todas las luces y panel embebido. Error inicial del checker al sumar PackedFile sin bool corregido; registro checker-packedfile-type-error.txt. Iteraciones de cámara/UV TV invertida/emisor oculto/vegetación y pruebas draft registradas; aún no equivalen a aceptación premium. Render de revisión 1680x1120, hasta128 muestras adaptativas, en curso; preservará PNG crudo más filtrado OIDN con albedo/normal reales. Siguiente: revisar capturas finales contra objetivos, registrar diferencias, cerrar gate de evidencias y publicar. Sin iniciar PlayCanvas/Mixamo, sin CI remoto ni hardware.

### Continuación — especificación de realismo y aclaración de vidrio

El operador pide concentrar acabado en LED cálido oculto, esquina, plantas, detalle de equipos y aclara que la reflectividad prioritaria es de los vidrios arquitectónicos. Se cancela render frío obsoleto (render-hero.txt; no frame final atribuible), se implementan perfiles continuos, 2700/3200 K, jardineras luminosas, equipos completos y auditoría de135 vidrios. Maestro actual e1dc0225fd957c55d38c06ca785667b70d50e544744d68d0477796aac0058e03, gate 676 PASS, 21 rutas. Assets/licencias publicados b8de90e; implementación/capturas en cierre, sin merge. Inspección BabylonJS/Assets3798844 no localiza modelo de escritorio en su índice; cuerpos/soportes de monitores refinados como geometría original, manteniendo poses. No se importan modelos sin procedencia. Se mantiene comparación conJPG del operador separada de evidencia.

### Candidato con jardín vertical completo

Última petición: cobertura vegetal continua como el Gaussian. Vista original front-return.jpg inspeccionada; fuente intacta. Maestro R1 ea1fe5c8b7ea1f9800e31b419516b0808436d0f5903977c27e53e52fef3b802f, 678 PASS / 21 rutas, 2170 grupos vegetales pequeños instanciados, 71 luminarias/17 circuitos y 135 piezas de vidrio. [Galería](REVIEW-PHASE04-REVISION.md) y [plano](evidence/phase04-revision/layout-with-ids.svg). Borradores actuales disponibles; renders de revisión en ejecución. No aceptación humana ni inicio de PlayCanvas.

## 2026-11-08 · autorización explícita de Fase05

Operador aprueba Fase04-R1 y ordena continuar Fase05. Se conserva maestro aprobado y seis renders finales publicados. Batch opcional Cycles detenido al renderizar comedor; captura parcial excluida, no se declara galería de 23 terminada. Se inicia exportación derivada y aplicación separada en apps/spatial-simulation; fuentes protegidas intactas.

## 2026-11-09 · Fase05, revisión visual todavía abierta

Operador rechaza transferencia inicial y exige comparación iterativa con Cycles. Se investigó SDK real: omisión de techos escondidos para overview, recolor RGBToBW no exportable, límites de instancias reiniciados por RenderComponent, conversión lineal/sRGB incorrecta en luces/emisores y sobrescritura de parámetros de vidrio. Corregidos en pipeline existente. Bakes HDR ambientales y base indirecta artificial separada, UV1 explícita; ganancia por circuito llega a cero en OFF. La respuesta indirecta individual es aproximada por circuito. Capturas anteriores rechazadas conservadas. Captura corregida y comparación en curso; NO se declara fidelidad aprobada, 30 FPS móvil físico ni gate05 completo. Backend/frontend/Gaussian y maestro aprobado preservados.

## 2026-11-09 · Prioridad: equivalencia de iluminación

Se detienen nuevas capturas y ajustes de materiales por instrucción del operador. Auditoría directa de controladores Blender/PlayCanvas identifica fórmula automática distinta, parámetros solares distintos y exposición variable. Corregidos sin tocar geometría/maestro ni añadir luces. Cinco pruebas unitarias ejecutadas PASS. Ambiente HDR, transporte indirecto por superficie y conversión fotométrica de áreas siguen sin equivalencia acreditada; detalles en PHASE-05-LIGHTING-AUDIT.md. Gate05 abierto.

## 2026-11-09 · Inicio de Fase04.5 autorizada

Leídos plan y PHASE-04-5-QUALITY-REFERENCE.md desde actualización remota 45af25a. Avance directo de la misma rama, sin merge de ramas ni main. Implementado perfil máximo reversible y scripts Golden Hour; render Cycles y captura PlayCanvas iniciados. Compilación y pruebas unitarias ejecutadas. Alcance completo aún pendiente según PHASE-04-5-PROGRESS.md; no aprobación visual ni equivalencia declarada.

## 2026-11-09 · Addendum transferible Fase04.5

Incorporado literalmente como requisitos normativos en PHASE-04-5-QUALITY-REFERENCE.md. Exportados parámetros reales Golden Hour con Blender sin guardar maestro, y conectada la condición al perfil de referencia existente. La condición compartida no acredita transporte equivalente: conversión de potencia y bases HDR Golden Hour permanecen pendientes. Capturas iniciadas previamente etiquetadas diagnóstico. No aprobación ni optimización móvil.

## 2026-11-09 · Revisión Blender primero, calidad alta y cobertura integral

El operador exige máxima calidad Blender y su aprobación visual antes de continuar PlayCanvas. Se crea perfil reproducible 1920×1280, Cycles256 adaptativo0.015/mín64, transporte12 rebotes y guías reales de denoising, con quince encuadres de toda la C. Inventario de materiales fuente generado; sin reemplazar materiales ni simplificar geometría. Cola Blender iniciada; las imágenes HQ no se declaran terminadas. Se preservan maestros, y no se realizan nuevas calibraciones PlayCanvas. Compilación Python comprobada. Referencia transferible integral sigue pendiente; este perfil no la acredita por sí solo.

## 2026-11-09 · Corrección del operador: una imagen primero

Se cancela la cola de quince vistas y se detienen dos ejecuciones duplicadas detectadas del propio renderizador. Reinicio único explícito `-- lounge`; aún no había imagen HQ terminada. Configuración por defecto de una vista y bloqueo de lotes adicionales hasta aprobación visual. Se conservan cámaras y cobertura futura. No se ha aprobado la imagen ni la fase.
