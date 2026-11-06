# Entity API — first vertical slice

Minimal FastAPI implementation of persistent entities, state, explicit typed relations and event history. The state-change operation automatically appends a historical event.

## Local run

```bash
cd services/entity-api
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt httpx
uvicorn app.main:app --reload
```

Open `http://localhost:8000/docs` for interactive API documentation. Run tests with `python -m unittest discover -s tests -v`.

SQLite is an **initial local development store**, not the production storage architecture. Planned: PostgreSQL/PostGIS, Scorpio NGSI-LD projection, versioned contracts, capability authorization and device adapters. The API is not production-hardened; do not expose it publicly without authentication and access control.
