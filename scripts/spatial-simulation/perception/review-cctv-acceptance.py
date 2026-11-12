"""Human review document from completed aggregate evaluation, never inference input."""
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
OUT=ROOT/'docs/spatial-simulation/evidence/p2-09/09.18'
report=json.loads((OUT/'acceptance.json').read_text())
assert len(report['runs'])==5
total=sum(r['images'] for r in report['runs']);valid=sum(r['valid_opportunities'] for r in report['runs']);matched=sum(r['detector_matched'] for r in report['runs'])
lines=['# P2-09.18 — Cinco repeticiones para revisión humana','',
       '**Estado:** '+('controles técnicos de las cinco ejecuciones superados; aceptación humana pendiente.' if report['all_five_technical_checks_passed'] else 'EN VALIDACIÓN: hay controles técnicos fallidos; no solicitar aceptación como si hubieran pasado.'),'',
       f'Se capturaron de nuevo **{total} imágenes**. El detector encontró{matched}/{valid}oportunidades ópticas válidas ({matched/valid:.2%}agregado). El gate se exige en cada ejecución: un promedio no sustituye un ensayo fallido.','',
       '| Ensayo | Imágenes | Recall | FP detector | FP/duplicados MOT | Cambios ID local | IDs del actor | Hipótesis globales totales | Fragmentaciones | Geometría sin resolver | Core |',
       '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|']
for row in report['runs']:
    case=row['run'];folder=OUT/case
    core=json.loads((folder/'ingestion.json').read_text());replay=json.loads((folder/'replay.json').read_text());persist=json.loads((folder/'persistence.json').read_text())
    lines.append(f"| [{case}]({case}/evaluation.json) | {row['images']} | {row['detector_recall']:.2%} | {row['detector_false_boxes']} | {row['mot_false_observations']} | {row['local_id_switches']} | {row['global_actor_id_count']} | {row['global_hypotheses_total']} | {row['global_fragmentations']} | {row['unresolved_geometry_instants']} | {'PASS' if persist['passed'] else 'FAIL'} |")
lines+=['','## Qué se ha comprobado','',
        'Cada ensayo mantiene una identidad visual del actor entre ocho sensores independientes. **v2 y v3 conservan además una hipótesis global espuria/duplicada cada uno: Core contiene2grupos en esos ensayos, no una segunda persona real.** v2 incluye dos observaciones sin soporte del actor; v3 contiene un track duplicado del mismo sensor/instante. No se eliminan usando GT. El gate de continuidad cuenta la identidad del actor; la tabla informa también todas las hipótesis y falsos positivos. El grafo restringe desplazamientos posibles y la apariencia aporta evidencia; compartir cámara o estar conectado en el grafo operativo no convierte dos tracks en una misma persona. Las relaciones de identidad son tipadas y provisionales. No se proporciona al algoritmo la cantidad esperada de actores.','',
        'Se conservaron sensor, timestamp original, hash y detección que soporta cada observación. Los intervalos sin vista no se rellenan como trayectoria observada. Las discrepancias de geometría permanecen explícitas; los falsos positivos/duplicados se cuentan y no se eliminan usando etiquetas. La posición global sigue desconocida en Core.','',
        'Los cinco corpus ingresan al mismo sitio/SQLite de P1, en runs separados. En cada uno se consulta grafo/memoria, se repiten exactamente los mensajes sin nuevos efectos y se reinicia el proceso HTTP comprobando mundo/relaciones/memoria. Las personas previas y los mundos históricos permanecen iguales. No se crean personas civiles, reservas, pagos ni ocupación de puestos.','',
        'La política de percepción, modelos, calibración y grafo quedaron congelados antes de evaluar los cinco corpus; ver [frozen-policy.json](frozen-policy.json). Los117testsCore y34Edge están en [test-results.json](test-results.json). Se optimizó únicamente el replay exacto de Core: mantiene autorización y conflicto de IDs, y evita reconstruir el mundo para un mensaje ya validado.','',
        '## Evidencia visual para revisar','',
        'Las láminas contienen píxeles sintéticos originales y cajas/IDs del modelo, sin GT. Cada sensor tiene un timestamp diferente, indicado en la imagen: no es una captura simultánea. Las líneas temporales muestran observaciones reales del modelo, sin interpolación.']
for row in report['runs']:
    case=row['run'];lines+=['',f'### {case}', '',f'[Continuidad temporal]({case}/continuity.svg) · [Core y replay]({case}/persistence.json) · [Ingreso HTTP]({case}/ingestion.json)', '',f'![Vistas independientes de {case}]({case}/camera-evidence.jpg)']
    if (OUT/case/'extra-hypotheses.jpg').exists():lines+=['',f'![Hipótesis adicionales que no deben contarse como personas confirmadas]({case}/extra-hypotheses.jpg)']
lines+=['','## Reproducción y separación','',
        'El planificador del simulador produce cinco variantes del estímulo(0–4), con velocidades1.0–1.2unidades nativas/s, pausas, giros, oclusiones y reapariciones. capture-acceptance.ps1 abre sesiones nativas de navegador nuevas y conserva corpus completos. validate-cctv-acceptance.py encadena trabajadores Bubblewrap sin red/workspace/evaluador, evaluación posterior y una cola serial de ingresos Core. El evaluador mantiene sus etiquetas y referencias en un directorio/caché privado diferente, nunca montado en ENTITY.','',
        'Los cinco ingresos originales se detuvieron por una validación incorrecta de metadatos heredados: un run nuevo hereda el hash del corpus anterior desde el inventario del sitio, pero aún no tiene observaciones. Se corrige el enrolamiento del corpus nuevo; el cold guard protege runs existentes y el replay exige el hash original. Los intentos fallidos quedan conservados. resume-cctv-acceptance-core.py repite solo Core en IDs-r2, con las mismas salidas de percepción. No se recaptura ni reajusta el modelo usando GT.','',
        'La inferencia y evaluación ya completadas no deben repetirse para reanudar. Consultar una vez los marcadores privados accept18-capture-status.json, accept18-validation-status.json y accept18-core-resume-status.json y los JSON públicos. Si un supervisor sigue activo, no lanzar una segunda copia. Los scripts rechazan sobrescrituras de corpus y modificaciones de la política congelada.','',
        '## Límites y aceptación pendiente','',
        'Son cinco capturas/ejecuciones nuevas del mismo recorrido geométrico, con distinta velocidad. La variante0 repite el estímulo de ajuste; no son cinco edificios o rutas inéditas ni una prueba estadística de generalización. Un actor no permite medir falsas fusiones multipersona. El dummy está en pose de validación, no es el personaje final animado.','',
        'El circuito es batch, no causal en vivo ni tiempo real. Los tiempos combinados del reintento Core suman procesamiento de inferencia registrado e ingreso nuevo; no son walltime de un único intento. No se inventa precisión mundial, identidad civil ni ocupación de una silla. Persistir una inferencia no elimina sus falsos positivos.','',
        '**La aceptación humana final no está otorgada.** Revisar si la continuidad, las fuentes, las pérdidas/reapariciones y los límites documentados son aceptables para cerrar P2-09. No iniciar múltiples personas ni P3 sin nueva autorización.']
(OUT/'README.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(f'Review document generated for {len(report["runs"])} runs; human acceptance remains false')
