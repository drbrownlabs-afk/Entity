# P2-09.18 — EN VALIDACIÓN

Cinco capturas nuevas completas:9288imágenes. Percepción de los cinco corpus evaluada con política congelada: recall98.05–98.88%, cero cambios locales deID y una identidad global del actor en cada uno, sin fragmentación. Esto todavía no declara aceptación humana.

El primer supervisor terminó la percepción y falló el ingreso Core: el nuevo run heredaba el hash del corpus anterior desde el inventario del sitio. Se corrigió exclusivamente el enrolamiento; runs existentes siguen protegidos por cold guard y hash de replay. No se recaptura, no se ajusta el modelo usando GT ni se borran los intentos fallidos. El supervisor resume-cctv-acceptance-core.py procesa los cinco runs-r2; finish-cctv-acceptance.py espera y prepara auditoría/informe final.

Reanudación: consultar UNA VEZ los marcadores privados bajo simulation/spatial-office/.runtime: accept18-capture-status.json, accept18-validation-status.json, accept18-core-resume-status.json y accept18-final-status.json. Capturas y primera inferencia ya terminaron; NO volver a lanzarlas. Si los supervisores de Core/final siguen activos, no duplicarlos. Logs accept18-core-resume.log y accept18-final.log. Scripts de reanudación rechazan cambios de política y preservan resultados. No se publican credenciales, SQLite, etiquetas ni poses privadas.

117testsCorePASS. La nueva prueba verifica que replay exacto evite reconstruir el mundo sin saltarse autorización/conflicto de IDs. La regresión Edge34 se exige al cerrar el reintento. Vistas camera-evidence.jpg y líneas continuity.svg en cada subcarpeta se construyen únicamente de píxeles y observaciones del modelo, sin leer GT.

Son cinco ejecuciones del mismo recorrido geométrico con velocidades1.0–1.2nativas/s; variante0 repite el estímulo de ajuste mediante captura nueva. No son cinco rutas inéditas, no certifican generalización multipersona ni identidad civil, ocupación de puestos o tiempo real. El escenario mantiene puertas de seguridad abiertas; el grafo usa una hipótesis de puertas, no una lectura de accesos físicos. La aceptación humana final permanece pendiente.
