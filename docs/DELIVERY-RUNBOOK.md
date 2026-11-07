# Demostración de ENTITY OS — guía del operador

Estado: Fase 08 EN VALIDACIÓN, pendiente de aceptación humana. No representa una instalación física ni un servicio productivo.

## Demostración pública, sin instalar nada

1. Abre https://drbrownlabs-afk.github.io/Entity/ en Chrome o Edge actualizado. Debes ver el centro comercial y el aviso de simulación. No necesitas Python, Core ni credenciales.
2. Pulsa **Pausar**. El reloj y los visitantes se detienen. **+1 paso** los hace avanzar. La vista principal y cuatro CCTV representan las mismas personas en el mismo instante.
3. Elige **Acceso norte/sur** o toca una tienda. Cambia el punto de vista. En móvil puedes recorrer la página y tocar los mismos controles.
4. Pulsa **Activar escena de alerta**. Cambia el color de la señalización, el estado de SIGNAL-01 y aparece el resultado del evento. Las cuatro cámaras conservan la misma revisión.
5. Cambia climatización o cierra la unidad seleccionada. El modelo, indicadores y eventos deben coincidir. Son acciones simuladas, no controles de un edificio.
6. Consulta «¿Qué ocurre en recepción?», «¿Cuántas tiendas están abiertas?» o «¿Cuál es la escena?». La respuesta indica **Simulación local**, basada en el estado visible. No es un LLM remoto.
7. **Exportar Observation v1** descarga una observación compatible con ENTITY Core. No contiene nombres personales. Recargar la página reinicia la demostración: la memoria persistente del Core se prueba por separado.

Resultado esperado: una experiencia navegable, visitantes anónimos, cinco vistas sincronizadas y acciones locales verificables. La geometría es ilustrativa, no un levantamiento del edificio. El rendimiento en un teléfono físico todavía requiere revisión.

## Demostración integrada con Core, preparada para trasladar

La entrega contiene `entity-source.tar.gz`, `entity-experience.zip` y `manifest.json` con versión y huellas de integridad. Están en el artefacto **entity-delivery** de la ejecución CI enlazada desde docs/phases/PHASE-08.md; descargar artefactos requiere iniciar sesión en GitHub. El código también está publicado en la rama indicada en ese informe. No necesitas crear commits, PR ni hacer push.

Con apoyo técnico, prepara Linux con Python 3.12, Node 24/npm, conexión para descargar dependencias y herramientas normales de descompresión. La entrega no incluye un instalador Windows/macOS ni dependencias para trabajar sin Internet. Descomprime el archivo fuente, abre una terminal en su carpeta `Entity` y ejecuta:

```bash
bash scripts/setup-demo.sh
bash scripts/demo-entity.sh
```

El primer comando prepara las dependencias fijadas y construye la web. El segundo realiza automáticamente la demostración completa, sin claves privadas ni hardware:

- Arranca un Core nuevo en un puerto local libre y comprueba salud/base de datos.
- Usa las observaciones del mismo estado de Experience, crea tracks y zonas, y activa una pantalla virtual.
- Consulta estado, relaciones y memoria con el proveedor controlado; ejecuta una acción permitida, verifica su resultado y rechaza un usuario sin permiso.
- Interrumpe el Core y reinicia Edge; comprueba cola durable, reconexión sin duplicados e historial persistente.
- Interrumpe y recupera la fuente; comprueba que no se inventa presencia durante el corte.
- Restaura una copia en otra base de datos y compara el mundo, historial y trazas.

Cada comprobación imprime **OK**. El informe termina con `status: passed` en `.runtime/release-demo/latest.json`; si falla, aparece `failed` con el nombre del fallo. Cada ejecución conserva su carpeta nueva y su informe, sin borrar datos anteriores. Las credenciales son efímeras, no se imprimen ni se incluyen en paquetes. Los servicios de esta demostración se detienen automáticamente; la web pública permanece disponible.

Para abrir el visor local después de preparar las dependencias: `bash scripts/demo-experience.sh`, y visita http://127.0.0.1:5173 . Para detenerlo, usa Ctrl+C. El ZIP estático se puede publicar en un alojamiento web sin Python; abrir index.html directamente como archivo local no es una prueba soportada.

## Qué prueba cada evidencia

| Evidencia | Qué demuestra | Qué no demuestra |
|---|---|---|
| Experience pública y Chromium | Mundo virtual, consultas/acciones y navegación escritorio/táctil | Vídeo físico, identidad de personas, calibración o teléfonos físicos |
| demo-entity | HTTP real, SQLite, contratos, memoria, permisos, actuación virtual, reinicio y restore | Orbbec, actuadores físicos, LLM externo o servidor productivo |
| demo-edge / CI | OpenCV HOG y Norfair sobre vídeo grabado, zonas y recuperación | Precisión validada en una instalación nueva o identidad entre cámaras |
| demo-integrations / CI | RTSP y MQTT locales reales, REST de prueba, reinicios y deduplicación | Autorización/acceso al CCTV de terceros o protocolo de un fabricante concreto |
| Paquetes + manifest | Versión exacta y archivos íntegros, fuente instalable en otra ruta | Instalación offline o compatibilidad universal de sistemas operativos |

Las latencias del informe son mediciones locales de 20 observaciones; no representan un SLA ni una prueba de carga de 12 cámaras. El rendimiento móvil anterior se midió por software en servidor, no sobre un teléfono físico.

## Conectar un Core existente (opcional)

El modo público autónomo ya funciona. Para la conexión opcional, un técnico debe proporcionar un Core por HTTPS, su token y entidad existente. El Core debe permitir `ENTITY_ALLOWED_ORIGINS=https://drbrownlabs-afk.github.io`. En **Conectar ENTITY Core** introduce esos datos; el token queda solo en memoria del navegador. **Conectar / actualizar** lee un snapshot; no es transmisión en vivo. Las consultas y acciones utilizan la API real y muestran los errores sin sustituirlos por simulación. Las CCTV siguen siendo virtuales; tiendas/HVAC permanecen como geometría de demostración. Esta entrega no publica un Core en Internet.

## Si algo falla

| Síntoma | Qué hacer / interpretación |
|---|---|
| Página vacía o WebGL no disponible | Recarga y prueba Chrome/Edge actualizado con aceleración gráfica; guarda captura y navegador para soporte. No equivale a fallo del Core. |
| HTTP 401/403 al conectar Core | Revisar token y permisos con el responsable técnico. No repetir acciones suponiendo que se ejecutaron. |
| Error HTTPS/CORS | Revisar URL y origen permitido del backend. No desactivar TLS ni exponer el Core de desarrollo para resolverlo. |
| Preparación falla descargando dependencias | Conservar el mensaje y revisar conexión, proxy, versiones y CA. No cambiar las versiones fijadas sin validación. |
| Core no inicia en demo-entity | Revisar `core.log` de la carpeta de esa ejecución. La prueba termina con error y no borra bases previas. |
| Una comprobación imprime fallo | Conservar latest.json y logs locales; revisar con soporte antes de declarar la demostración aprobada. No compartir logs privados sin revisión. |

No ejecutes limpieza de volúmenes ni borres bases para repetir la demo: usa una nueva ejecución. GitHub conserva código y evidencia, no sustituye las copias de seguridad de una futura instalación.

## Revisión humana

Comprobar los siete pasos de la web, revisar los resultados de CI/integración y los límites de docs/DELIVERY-BACKLOG.md. Registrar aceptación o incidencias con la versión revisada; EN VALIDACIÓN no significa APROBADA. No se habilita hardware ni uso productivo por aprobar esta simulación.
