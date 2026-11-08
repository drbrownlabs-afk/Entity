# ENTITY Spatial Intelligence — contrato de producto e implementación de Fase 09

**Decisión vinculante del operador (2026-11-07).** Este documento define qué estamos construyendo y prevalece sobre descripciones anteriores que reduzcan la aplicación a un visor SuperSplat, un recorrido 3D o un panel administrativo separado.

## 1. Qué es cada cosa

- **Lugar de referencia:** Synthetic Office es la captura de un lugar físico existente, presentada como referencia espacial del piloto. No afirmar que los sucesos, personas, sensores o instalaciones simulados ocurrieron allí.
- **Gemelo digital:** representación espacial tridimensional de ese lugar, basada en la captura SSOG/Gaussian Splatting y, cuando haga falta, geometría auxiliar. El modo **Dollhouse**, con techo recortado/oculto para comprender el interior, es la vista principal; caminar dentro es secundario.
- **Interfaz del software:** el gemelo digital **es la interfaz espacial principal de ENTITY Spatial Intelligence**, no una página de demostración del renderer. Desde la escena se seleccionan personas, cámaras, oficinas, puestos y recursos para inspeccionar entidades, estados, relaciones, eventos, memoria y acciones.
- **ENTITY Core:** modelo computable operable del lugar, fuente de verdad para entidades, identidad, estado, relaciones, eventos, memoria y capacidades. El gemelo digital representa el modelo, pero no es el Core.
- **Fuentes simuladas:** en este piloto **no hay cámaras CCTV físicas conectadas al lugar**. Cámaras virtuales, personas simuladas, movimientos, reservas y observaciones sintéticas sustituyen temporalmente señales reales; **no sustituyen la arquitectura**. El Core recibe eventos normalizados por los mismos contratos que se usarán con integraciones físicas futuras.
- **Cámaras virtuales:** deben existir como entidades con posición, orientación, campo de visión, cobertura, estado, relaciones y feed 3D coherente con el mismo mundo/tiempo simulado. Etiquetar como **SIMULADA**. No confundir una vista de cámara del renderer con una observación conectada al Core.
- **Personas simuladas:** avatares vinculados a entidades Person/Track, poses, trayectorias, eventos y relaciones del Core. Etiquetar claramente la simulación. No colocar modelos decorativos sin identidad/estado ni inventar coordenadas.
- **Producción futura:** en una instalación real, cámaras, sensores, accesos, reservas y otros sistemas alimentarán los conectores del Core. La interfaz espacial conservará su lógica aunque cambien las fuentes.

## 2. Distribución del lugar — confirmación del operador

En una fila, de **derecha a izquierda**: **mesa negra de reuniones → A → B → C → D**. La mesa negra NO es una quinta mesa de trabajo. **A y B** son las dos mesas de trabajo con anotaciones existentes, y representan **oficinas privadas completas**. **C y D** son las otras dos mesas de trabajo, sin anotaciones originales, para **puestos individuales públicos**. No hay mesa E ni mesa C de staff. Calibrar coordenadas y cantidad de puestos por evidencia geométrica; la identidad de las cuatro mesas está resuelta.

## 3. Contrato de interacción obligatorio

1. Abrir la app y ver Dollhouse utilizable del lugar con sus cuatro agrupaciones correctas; ningún panel de SuperSplat, anotación de calibración, retícula ni formulario de configuración técnica.
2. Seleccionar una persona 3D visible: resolver ID en Core y mostrar estado, ubicación, relaciones, eventos y memoria; resaltar relaciones en escena.
3. Seleccionar una cámara virtual visible: mostrar su posición, orientación/cobertura y feed del mismo mundo, con personajes sincronizados; distinguir claramente **SIMULADA**.
4. Seleccionar A/B: consultar reserva y ocupación de oficina completa. Seleccionar C/D y sus puestos: consultar reserva/ocupación individual según los asientos realmente identificados.
5. Cambiar/reproducir tiempo: sincronizar estado Core, avatares, feeds, reservas, eventos y timeline; la UI no debe inventar resultados.
6. Entrar en vista interior y regresar a Dollhouse sin perder selección ni estado.

## 4. Instrucciones de implementación para Codex

**Trabajar en** `drbrownlabs-afk/Entity`, rama `codex/phase-09-autonomous-plan`. **No iniciar fase 10/11.** Revisar implementaciones y tests existentes antes de modificar. La integración, no otro documento, es el entregable.

### Auditoría técnica inicial, breve y con evidencia
- Trazar desde `apps/web/src/office/main.js` hasta `operations.js`, `visuals.js`, API, escena, personajes, cámaras y datos. Identificar por qué el usuario ve únicamente SuperSplat y formulario de Core, sin avatares ni CCTV.
- Identificar cuáles componentes están implementados pero no montados, cuáles dependen de Core inaccesible desde GitHub Pages y cuáles faltan. Registrar archivos, condiciones de carga y errores concretos. No confundir test verde con demo publicada.
- Revisar `services/entity-api/app/office/provision.py`, `scripts/bootstrap-office.py`, simulación, permisos, reservas y tests por supuestos obsoletos C staff / D-E públicas; corregir con migración sin pérdida de datos.

### Implementar e integrar
- Transformar `office.html` y su aplicación en interfaz propia ENTITY con Dollhouse como estado inicial. Usar el SSOG original y el SDK como motor interno si es adecuado. Resolver ocultamiento/recorte de techo sin destruir la captura, y comprobarlo visualmente.
- Eliminar UI de SuperSplat de producto (`ui:true`, anotaciones públicas, inventario de calibración, reticle, etc.); conservar herramientas bajo modo diagnóstico explícito si hacen falta.
- Montar render visible de personajes y cámaras, con picking/selección de entidad, panel contextual de relaciones y memoria, feeds virtuales, timeline, reservas y operaciones. La fuente de verdad es Core; sincronizar eventos y escenas.
- Crear experiencia pública de prueba sin pedir URL/usuario/contraseña. Para datos vivos y persistentes se requiere Core demo HTTPS con acceso controlado; si eso no está disponible, permitir un **modo sintético autónomo explícitamente etiquetado** con estado/eventos coherentes, sin fingir conexión o persistencia del Core. El SaaS de producción sigue en la nube; no instalar ENTITY Core en la sede del cliente.
- Responsive móvil y escritorio. Sin interfaces de inspección que se presenten como producto.

### Pruebas y criterios de aceptación
- Ejecutar tests de Core y frontend, E2E visual y funcional, y abrir **la URL realmente publicada** desde escritorio y móvil.
- Evidencia: capturas del Dollhouse sin techo, personajes visibles, cámaras/feeds, panel de entidad con relaciones, cuatro mesas correctas, timeline, y pruebas de sincronización Core/UI.
- Documentar URL, commit, entorno backend utilizado, limitaciones reales y cualquier función pendiente. **No declarar Fase 09 completa** sin aceptación visual y funcional.

## 5. Regla arquitectónica

**No construir un visor con funcionalidades añadidas. Construir la interfaz del software de inteligencia espacial que utiliza el gemelo digital del lugar como superficie principal de interacción.** Las cámaras y personas de este piloto son simuladas, pero deben entrar al modelo de mundo mediante contratos reales, sustituibles después por fuentes físicas.
