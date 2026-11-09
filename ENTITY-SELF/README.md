# ENTITY-SELF — realidad computable de ENTITY

Dominio independiente, en la raíz del **mismo repositorio**, para entidadizar a ENTITY como organización, plataforma, producto, historia, investigación y empresa. **No es otro Core ni otro backend.** Consume el P1 ENTITY Core y no comparte entidades con el coworking salvo relaciones explícitas.

## Archivos operativos

- [Corpus inicial](corpus/ENTITY-CORPUS-AND-ENTITYIZATION.md): fuentes y alcance.
- [Síntesis julio–noviembre](corpus/HISTORIA-RELACIONES-Y-SUSTITUCIONES-2026.md): cronología, dependencias, reemplazos y decisiones.
- [Entidades](entities/entities.json): 63 entidades con IDs estables, estados y fuente.
- [Relaciones](entities/relations.json): 109 relaciones tipadas, incluidas sustituciones y dependencias.
- [Importador P1](ingestion/import_to_core.py): usa la API real de ENTITY Core sin duplicar software.

## Importación al Core P1

En un entorno que tenga acceso a la API real del Core:

```bash
python3 ENTITY-SELF/ingestion/import_to_core.py --url http://127.0.0.1:8000
python3 ENTITY-SELF/ingestion/import_to_core.py --url http://127.0.0.1:8000 --apply
```

La primera instrucción valida el corpus sin escribir; la segunda crea entidades y relaciones mediante `POST /v1/entities` y `POST /v1/relations`. El importador evita repetir triples existentes y conserva entidades ya presentes; no actualiza sus atributos automáticamente. La API P1 debe estar accesible y lista. **La ejecución de importación aún no se ha realizado ni verificado desde esta conversación**.

## Gobierno y seguridad

Precedencia: `docs/ENTITY-MASTER-SPEC.md` → `docs/DECISION-LOG.md` / `docs/PROJECT-STATUS.md` → evidencia. ENTITY-SELF no altera esos documentos ni sustituye su autoridad. Las fuentes históricas deben etiquetarse según vigencia, procedencia y confidencialidad. No subir transcripciones privadas, white papers confidenciales o datos de personas sin verificar visibilidad y permisos del repositorio.

## Cobertura

La síntesis recupera antecedentes de julio, agosto, octubre y noviembre de 2026, pero **no certifica que se hayan recuperado todas las conversaciones ni todos los archivos originales**. Los datos estructurados son el comienzo de una ingesta integral, sin límite artificial de entidades; las fuentes pendientes se añadirán con deduplicación y trazabilidad.
