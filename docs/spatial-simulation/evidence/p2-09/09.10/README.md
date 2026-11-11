# P2-09.10 — preparación local, 2026-11-10 America/New_York

Estado: **EN CURSO; gate no superado**. Fuente inspeccionada: `61e037d503999dcb28d7cc8bb7de3a899e4eb2ea`, rama `codex/spatial-simulation`. Evidencia generada el 2026-11-11 UTC, todavía 2026-11-10 en el equipo del operador.

## Autoridad y continuidad

Leídos íntegramente la especificación P2-09, PROJECT-STATUS, DECISION-LOG y AGENT-WORKLOG, además del canon y AGENTS. Prevalece la instrucción operativa consolidada. El operador precisó durante esta ejecución que los PNG anteriores son resultados históricos: **repetir captura y test localmente; su transferencia no es prerrequisito**. Preservar los archivos, métricas y configuración anteriores; capturas/evaluaciones locales nuevas deben usar carpetas y manifiestos nuevos y comparar diferencias. No ejecutar los scripts históricos que escriben directamente en 09.4–09.9 sobre la evidencia congelada.

Referencia visual entregada por el operador: `WhatsApp Image 2026-11-10 at 19.09.06.jpeg`, inspeccionada. C central, cuatro cabezales independientes; C1/C2 diagonales cruzadas del corredor; C3/C4 alas y transiciones. Es orientación conceptual, no planta métrica ni poses certificadas. Ajustar con geometría PlayCanvas, capturas, oclusiones, escala de persona en píxeles y solapamientos en 09.12, después de los gates previos. No se ha configurado todavía el perfil nuevo.

## Equipo y preparación efectivamente ejecutada

`windows.json` proviene de `audit-windows.ps1`, auditoría de solo lectura. MATRIX, Dell XPS15 9510; Windows11 Pro build26200; i9-11900H, 8 núcleos/16 hilos; RAM16886083584B; NVIDIA RTX3050Ti Laptop4096MiB, driver610.60; virtualización de firmware reportada activa; aproximadamente541GB libres en C durante la medición. `nvidia-smi` funciona en Windows, **no acredita CUDA en WSL**.

WSL inicialmente ausente. `wsl --install` y `--install --no-distribution --web-download` devolvieron el mensaje del stub sin instalarlo. `winget install --id Microsoft.WSL --exact --source winget --silent --accept-package-agreements --accept-source-agreements --disable-interactivity` verificó el hash y falló sin elevación: `0x80073d28`. Repetición mediante proceso elevado UAC: éxito, WSL2.7.14.0/kernel6.18.33.2-2 instalados. Se habilitó **solo VirtualMachinePlatform** usando `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`: **3010, reinicio requerido**. Marcadores/log de resultados adjuntos; no se reinició Windows. No se instaló driver NVIDIA Linux ni se modificó el driver Windows. Ubuntu/GPU-Linux/namespaces no certificados.

Intento adicional `wsl --install --distribution Ubuntu-24.04 --no-launch --web-download`: el proceso devolvió0, pero su mensaje exige elevación y dice que los cambios solo tendrán efecto tras reiniciar. No tomar ese código0 como instalación funcional de Ubuntu; verificar distribuciones e inicialización después del reinicio.

Git2.56.0.windows.4 y Node24.22.1 disponibles. `python` de PATH es un alias Store; localizado Python3.12.14 del runtime de Codex. Venv privado `simulation/spatial-office/.runtime/p2-audit-venv`: ensurepip falló inicialmente; creado el intérprete y resuelto el arranque mediante `python -m pip --python <venv>/Scripts/python.exe install jsonschema==4.26.0` desde el runtime existente. Dependencias registradas por `transfer.json`. No se alteró el Python compartido.

`npm` ausente del PATH; pnpm11.25.0 del runtime permitió `pnpm dlx npm@11.6.2 --prefix apps/spatial-simulation ci --cache simulation/spatial-office/.runtime/npm-cache --no-audit --no-fund`. Lockfile intacto. Build Vite8.3.6 pasa con aviso de chunk grande. Es compilación, no prueba de render/óptica ni percepción. Clon parcial/sparse: código/documentos presentes, binarios grandes diferidos; no se afirma migración completa por clonar. Dos transferencias redundantes detenidas, sin cambiar ninguna referencia remota.

## Assets y licencias

Ejecutado `python scripts/spatial-simulation/perception/download-models.py`: YOLOX Nano/S, fuente OSNet y pesos OSNet descargados de las URLs públicas fijadas; **cuatro SHA256 coincidentes** con 09.9/model-checksums.txt. Permanecen en `.runtime`, fuera de Git. OSNet ONNX aún sin exportar; referencia de comparación en 09.7/reid-model.json. Preparar exportación/paridad en entorno separado y guardar reporte nuevo; `prepare-reid.py` histórico escribe en 09.7 y no debe invocarse sin redirigir su evidencia.

Inventario/licencias existentes: YOLOX Apache2.0; TorchReid y DeepSORT realtime MIT, pesos/datasets con condiciones propias; dummy temporal Rocketbox MIT; Cesium histórico CC-BY4.0, personajes definitivos pendientes. Estas son procedencias registradas, sin certificación comercial nueva. Referencias: simulation/spatial-office/perception/README.md, 09.7/reid-model.json y licencias de assets versionadas. No se descargaron nuevos personajes, no se entrenó modelo ni se conectó CCTV físico.

`transfer.json` lista ausencia de originales como comparación **opcional**, no bloqueo del modo `local_recapture`. El código de inventario no abre GT ni ejecuta inferencia. No confundirlo con prueba de aislamiento de runtime. Pipeline existente requiere Linux `resource`, bash y bubblewrap con PID/red/FS aislados; no se ejecutará en Windows quitando esas barreras.

## Validación realizada

- `python -m unittest discover -s services/entity-edge/tests -p test_frame_contract.py -v`: **3 PASS**; contrato rechaza campos GT/ruta/identidad y paths indebidos. Log adjunto. No demuestra aún inferencia con GT desconectado ni invariancia de IDs.
- `python -m unittest discover -s scripts/spatial-simulation/perception/tests -v`: **4 PASS**; hash corrupto/ausente, traversal, captura nueva sin PNG históricos y rechazo de sobrescritura de evidencia congelada. Primera ejecución falló por permisos del TEMP del sandbox; se corrigió a temporales privados del workspace y se repitió:4PASS.
- `node --test apps/spatial-simulation/tests/*.test.js`: **11 PASS**, 0 omitidas. Primer intento:5PASS y error de importación pathfinding; instalación fijada resuelve el fallo. Resultados finales de lógica:4.107s. No prueba cobertura de cámaras.
- `pnpm dlx npm@11.6.2 --prefix apps/spatial-simulation run build -- --base=/Entity/spatial-simulation/`: **PASS**, aviso de chunk grande. No modificación de código del visor.
- `audit-transfer.py --output docs/spatial-simulation/evidence/p2-09/09.10/transfer.json`: salida2 esperada por OSNet ONNX ausente; cuatro recursos descargados verificados. Ningún gate certificado por generar documentación.

## Reanudación concreta

1. Reiniciar Windows cuando lo autorice el operador; verificar VirtualMachinePlatform/WSL2, instalar/inicializar Ubuntu24.04 y comprobar `nvidia-smi` desde Linux. No asumir que el reinicio por sí solo demuestra GPU funcional.
2. Entornos Linux privados con versiones fijadas, bubblewrap operativo y dependencias CUDA/ONNX Runtime inventariadas; registrar proveedores realmente disponibles y consumo de VRAM. Preservar requisito de diagnóstico antes de cambios importantes adicionales.
3. Completar assets del mismo gemelo y export OSNet en nuevas rutas de evidencia, comprobar hashes/procedencia/paridad. No modificar geometría maestra ni CoreP1.
4. Superado09.10,09.11 repite **captura local** con las seis cámaras históricas y el mismo protocolo; salidas nuevas separadas, comparación de246frames/cadencia/metadatos y diferenciasCPU/GPU. No exigir archivos PNG antiguos ni convertir resultados nuevos en baseline histórico. Después gates09.12–09.18, nuevo perfil5dispositivos/8sensores y la referencia visual entregada.

No se ejecutaron aún captura/inferencia/MOT/ReID/Core/benchmarkGPU ni tests completos anti-leakage de esta iteración. 09.11–09.18 siguen pendientes. La aceptación humana final09.18 no se presume.
