# ENTITY Office — ejecución reproducible de Fase 09

Estado: desarrollo en curso, no aceptación de fase ni certificación de piloto. Synthetic Office usa el archivo original remoto de argenzio, CC BY-NC4.0; no hay un edificio sustituto. No se necesita una exportación Vite ni iniciar sesión en SuperSplat.

## Arranque

Requisitos: Docker con Compose y Node24 o superior; acceso de red para dependencias y los recursos originales. Desde la fuente entregada:

```bash
bash scripts/start-office.sh
```

El script construye la API con dependencias fijadas, provisiona sin borrar la base existente y abre el frontend compilado en `http://127.0.0.1:4175/office.html`. No necesita Python instalado en el equipo anfitrión. API: `http://127.0.0.1:8010`; salud `/health`, disponibilidad `/ready`, contrato `/docs`. `--api-only` prepara únicamente el servicio persistente. En un entorno con CA de proxy, se admite `ENTITY_BUILD_CA_FILE=/ruta/al/bundle-publico.pem`; TLS sigue verificado y el certificado se monta solo durante la construcción.

Las contraseñas generadas permanecen en `.runtime/office/access.json`, permiso0600. No publicar ese archivo. Cuentas sintéticas: `admin` administra y controla el reloj; `jose` opera sus recursos asignados; `carlos` accede a su persona/organización y reservas permitidas; `entity-kiosk` utiliza la recepción; `luis` y `mateo` tienen sus respectivos permisos. Abrir `/personal.html` para José/Carlos y `/kiosk.html` para la terminal. Introducir la misma API en las interfaces. Solo se recuerda la dirección; tokens y contraseñas no se guardan en localStorage.

En Office, conectar como admin, preparar la jornada y pulsar «Reproducir reloj». Se puede pausar, avanzar a una hora civil de la sede o crear «Nueva jornada / replay». El replay conserva el historial anterior. Las interfaces siguen la jornada activa, salvo selección explícita de otra ejecución; un kiosco con `?run=...` queda fijado a esa ejecución para ensayos aislados. Reiniciar el servicio deja el reloj pausado en el último instante confirmado y no añade tiempo fuera de servicio.

Si la ejecución antigua ya pasó de08:00 y no tiene guion, utilizar el replay; no alterar ni borrar su historial. Los relojes de la interfaz representan la zona horaria configurada en la sede, no la del navegador. La demo diaria termina18:30. Un fallo de adaptador pausa la reproducción y deja un evento: reparar el componente antes de reanudar. Respuesta personal autenticada prevalece sobre el personaje del guion y no constituye una prueba de presencia física.

## Qué se puede comprobar

- Reservas:12puestos comerciales D1–D6/E1–E6; A/B como ambientes privados completos; C interno no reservable. Reserva y ocupación son estados distintos.
- Recepción: invitación y código autorizado → check-in → intercom de Carlos → respuesta desde app personal → actualización de visita y eventos. No existe reconocimiento facial supuesto ni teléfono obligatorio. El guion tiene llegadaDaniel15:50/reunión16:00. Para ensayar manualmente una verificación, un administrador debe emitir un código mediante el endpoint de credencial para la invitación existente; no se publica un código universal en la aplicación.
- Operaciones: falloHVAC-D, impacto acotado, ticket, reparación y reasignación de reserva, registrados por los servicios.
- Memoria: filtrar entidad/zona/tipo/intervalo, recorrer eventos y reconstruir el estado. La relación espacial del filtro se evalúa en el instante del evento. Se muestran hasta1000resultados por página y se permite continuar por cursor. El fondo es el escaneo original, no vídeo histórico.
- Cámaras: vistas virtuales del mismo PlayCanvas; las personas aparecen solo si Core tiene una pose calibrada y vigente. Las observaciones del guion son fuentes sintéticas lógicas y no equivalen a detecciones desde el renderer. El botón de administrador registra una captura virtual anónima con procedencia. Pausar antes de capturar evita mezclar instantes durante la lectura del GPU.

La instancia de esta sesión tiene activa demo-phase09-20261108, pausada a09:15:05Guayaquil, con reservaD3 y pose deLuis en el pasillo; live-demo.json verifica persistencia tras reinicio real. El tramo físico calibrado de Luis es09:15:00–09:15:10, sobre los voxels originales. Fuera de los intervalos con una ruta verificada no se inventa su posición. Seleccionar esas horas y reconstruir permite reproducir la evidencia acotada. No se presenta ese tramo como una jornada entera de desplazamientos.

## Verificación técnica

```bash
PYTHONPATH=services/entity-api .venv/bin/python -m unittest discover -s services/entity-api/tests -v
npm --prefix apps/web test
npm --prefix apps/web run build
CHROMIUM_PATH=/usr/bin/chromium .venv/bin/python scripts/phase09/demo-reception-http.py
.venv/bin/python scripts/phase09/smoke-office-docker.py
```

Los comandos de desarrollo Python requieren el entorno creado por `scripts/setup-demo.sh` (Python3.12). El arranque Docker anterior no lo requiere. Las pruebas de escena original y física se ejecutan también en Actions mediante `phase09-original.yml` y `phase09-spatial.yml`, con navegador autorizado y evidencia vinculada a su SHA/run. Un403 del proxy local no prueba inexistencia ni necesidad de autenticación del archivo original.

La entrega CI genera fuente comprometida, ZIPweb, manifiesto/checksums y prueba desde extracción limpia. Los archivos de datos/credenciales no forman parte del paquete. El ZIP contiene el visor, no una copia offline del SSOG.

## Publicación y límites reales

Visor estático: https://drbrownlabs-afk.github.io/Entity/office.html. Para operar desde esa URL se necesita una API accesible y configurada, con CORS explícito; Pages por sí solo no aloja Core ni proporciona credenciales. No hay un Core públicoHTTPS acreditado. Las capturas y conclusiones actuales están en `docs/evidence/phase09`, con el progreso en `docs/PHASE-09-PROGRESS.md`.

Pendientes: asignación geométrica completa C/D/E y asientos, rutas de toda la jornada, revisión integral del flujo espacial, prueba de voz/micrófono y Android físico, WebPush, proveedor LLM remoto y hardware real. No se deducen posiciones a partir del inventario funcional. Los seis personajes, dispositivos y sensores demostrados son sintéticos. Las fases10/11 planificadas no están autorizadas por este arranque.
