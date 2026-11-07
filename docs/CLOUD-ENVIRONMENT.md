# Entorno cloud — base reproducible y Core de Fase 01

La máquina actual es válida para desarrollar, ejecutar Docker y depurar. GitHub conserva código, configuración y resultados; las bases de datos y procesos siguen siendo locales.

Cada tarea cloud ya está aislada. Utilizar `/workspace/Entity`; no crear worktrees salvo petición explícita. Leer AGENTS.md y la memoria compartida antes de modificar el proyecto. Fase 01 autorizada y EN VALIDACIÓN; no iniciar Fase 02 sin aprobación.

## Instalación

```sh
cd /workspace/Entity
bash scripts/setup-cloud.sh
```

Este script es una copia exacta del install_script ya ejecutado en la máquina: instala versiones fijadas, comprueba dependencias, crea `.runtime/cloud-compose.yaml`, construye la imagen con la CA del sistema montada como secreto BuildKit y ejecuta las pruebas. Mantiene TLS activo y no copia certificados ni credenciales a la imagen. Requiere Python 3.12, Docker/Compose y conectividad permitida a los registros de paquetes e imágenes. El override y venv son locales e ignorados por Git.

## Arranque de procesos

Los archivos y dependencias pueden conservarse en una instantánea; los procesos deben iniciarse nuevamente:

```sh
cd /workspace/Entity
docker compose -f compose.yaml up -d --wait --wait-timeout 60
curl --fail --silent http://127.0.0.1:8000/health
curl --fail --silent http://127.0.0.1:8000/ready
```

Respuesta esperada: `{"status":"ok","service":"entity-api"}`. Health comprueba vida del servicio, no integridad completa de la base. No se ofrece enlace de preview cloud.

## Comprobaciones disponibles

```sh
cd /workspace/Entity/services/entity-api
../../.venv/bin/python -m unittest discover -s tests -v
cd /workspace/Entity
python3 scripts/smoke-docker.py
```

El smoke escribe registros sintéticos con identificadores únicos en el volumen de desarrollo, reinicia entity-api y compara datos e historial. Los conserva; no ejecutarlo contra producción. `docker compose down` conserva el volumen; no usar `down -v` sin autorización de borrado.

Scorpio no se inicia ni se valida en esta base. La evidencia de base está en `docs/audits/PHASE-00-2026-11-06.md`; la entrega actual y sus límites en `docs/phases/PHASE-01.md`. El borrador de configuración del entorno contiene install_script y start_skill; su guardado no equivale a publicación de una instantánea. Este documento y el script permiten consultar los mismos pasos desde GitHub, independientemente de ese borrador.
