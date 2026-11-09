> Estado vigente: aplicar addendum hasta8.2.1.66 entidades/146 relaciones; etapa estructural/declarativa, sin nuevos flujos operativos. Las secciones iniciales describen trabajo anterior conservado, no autorización para ejecutar operaciones ahora.

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

## 2026-11-09 — P2-08 addendum vigente: identidad, entidad madre y grafo (8.1/8.2/8.2.1)

Leído addendum autorizado y actualizaciones concurrentes hasta309b7f4. Se preservan decisiones canónicas y separación P1/P2/P3; sin snapshots automáticos ni fase09. 06/07 pendientes hasta mañana. Se aplica la restricción de no construir ni ejecutar flujos operativos nuevos; se conserva la implementación funcional anterior según precisión8.1, sin repetir sus pruebas operativas en esta etapa.

Resultado actual en P1 real local: **66 entidades del modelo y146 aristas activas**, 30 correspondencias a nodos/zonas reales de PlayCanvas, mismo maestro/4514 registros. Raíz local site de tipoSite/space_type Coworking, CoreUUID estable: entidad madre del espacio, NO raíz de todo ENTITY; estado propio unknown, referencia a escena completa, eventos y memoria propios (1 memoria raíz comprobada). Persona→registeredIn expresa registro lógico, no contención física. Se cierran aristas autoderivadas anteriores sin borrar historial. CONTIENE se resuelve como inversa de partOf para no duplicar hechos; UBICADO_EN=locatedIn; adjacentTo/connectedTo solo con prueba de partición D/E y cruces de rutas existentes por vanos reales; conexión geométrica no autoriza tránsito actual.

Población de demo EXACTAMENTE12: staff3, Entity2(Carlos/Santiago), Inmerso2 provisionales, habituales3 y visitantes2. Se reutilizan los cuatro IDs lógicos iniciales; se añaden solo los ocho faltantes. Dos identidades de pruebas técnicas anteriores se conservan fuera de la población de demo, no se borran ni duplican. Core local tiene68 registros contando esas dos historias; evidencia actual exporta66 del modelo vigente. Entity/Inmerso son Organization, distintas del Site/Office/Person y del Core tecnológico. A/B assignedTo organizaciones según definición del operador, sin occupants/presencia; compañeros derivables de pertenencia común, no relaciones personales fabricadas. Operadora no identificada: no se inventa relación laboral de staff. D1–D6/E1/E5/E6 indexados; E2–E4 previstos, sin retirarlos si existen.

8.2.1 se representa como declaraciones/planes sintéticos para futuras pruebas: planes/membresías anual, mensual vencida y horas; pase/sesión con10h contratadas de ejemplo y0 consumidas; renovación/orden/pago/factura simulada y plan de nueva membresía; visita comercial/oportunidad y reunión/invitación/visita previstas. Importe100USD rotulado ejemplo no comercial real; no pricing real verificado. Pago pendiente de confirmación, renovación no pagada, factura borrador no emitido/no fiscal/no SRI, vigencia nueva nula; confirmar pago/emitir factura/renovar se describen como secuencia FUTURA, no se ejecutan. Emisor desconocido hasta identificar operadora. VisitPlan/MeetingPlan/InvitationPlan son datos de planificación en el MISMO Core/P1, no invocaciones ni clones de los flujos Visit/Meeting/Invitation existentes. Reunión usa sala de reuniones porque no hay autorización individual definida para A; llegada nula, no check-in/reserva/ocupación inventados. Referencias a pago/pase/orden son neutrales (references...), no efectos de pago o consumo.

P1: extensiones tipadas de metadatos/relaciones en servicios existentes, upsert conserva atributos/estado ajenos, aprovisionador admite relaciones con prueba. P2: importación aditiva en dos pasos (identidades antes de referencias), sin borrar recursos, IDs estables. Reimportación aplica0 comandos. Pruebas de esta etapa: **7 tests estructurales PASS**, 5 compatibilidad de identidad/memoria PASS; inspección técnica HTTP y reinicio completo P1 conservaIDs/tipos/relaciones/estados; navegador técnico valida30 mapeos contra nodos cargados y preservación de UI anterior SIN acciones operativas. Persistencia real SQLite P1, no mock. Fuente de evidencia: docs/spatial-simulation/evidence/phase08/structural/index.json y logs próximos. Ninguna cámara/vídeo/piso/avatar ni integración externa creada.

Retirada Mall previa preservada: publicador único coworking; corrección idempotente de desactivación por IDs/estado evita fallo al encontrar workflows ya retirados. Publicación remota/CI se reporta con conclusión observada, no solo push. La API HTTPS de P1 de producción sigue sin configurarse: estas verificaciones usan Core local real, no acreditan servicio público de Core. P2-08 EN VALIDACIÓN, sin aceptación humana automática y sin avance a09.

## 2026-11-09 — Addendum8.3 incorporado: simulador aislado, percepción pendiente

Leída actualización ab8bb73 en la misma rama; se conserva modelo8.1/8.2 sin reversión ni fase09. Preparado simulation/spatial-office/simulator-behaviors.json: guiones locales de Daniel/recepción/espera/reunión y desplazamientos de otros actores, con referencias a geometría ya existente. Solo declaraciones; cero avatares enlazados, cero acciones ejecutadas, cero fotogramas/cámaras nuevos y cero eventos de llegada/check-in/detección emitidos aCore. IDs simActor separados de los IDs Core y ausentes de la configuración de entidadización; sin canal de salida hacia Core. Ground truth no generado; aislamiento efectivo de almacenamiento/runtime deberá implementarse y comprobarse cuando existan actores/percepción, no se declara resuelto por el JSON. MOT, MTMC/ReID e identidad visual/civil siguen pendientes.

Daniel es la identidad visitante de reunión ya existente PERSON-LOGICAL-12: se actualiza nombre definido por el operador, no se crea persona13. Plan de reunión referencia16:00 local sin inventar zona horaria física ni llegada. Datos de dominio enCore provienen de declaración del operador/administración legítima, no del guion. Se mantiene procedencia sintética exigida por canon/8.2; usar contratos funcionales neutrales no significa ocultar origen ni convertir ground truth en observaciones.

Resultado final vigente:66 entidades de alcance/146 relaciones activas,12 personas de demo,30 referencias reales a escena, entidad madre con estado y memoria propios.8 tests estructurales PASS (incluye guion sin avatar/puenteCore y referencias reales);5 pruebas de compatibilidad identidad/memoria PASS; persistencia HTTP/reinicio PASS y segunda importación0 cambios. Se preservan las dos identidades técnicas históricas fuera de población de demo (Core68 registros), sin borrar memorias. No nuevas pruebas/flujos operativos de reservas, pagos, visitas o consultas. Implementación8.3 e19ad68; modelo/escenarios88985ca y correccionesbd1d986; no se autoaprueba P2-08.06/07 pendientes hasta mañana;09 no iniciada. CoreHTTPS de producción no configurado; pruebas enP1 local real.
