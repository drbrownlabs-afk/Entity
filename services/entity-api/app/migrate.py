"""Forward-only, atomic SQLite migrations, including legacy Phase 00 databases."""
from pathlib import Path

SCHEMA_VERSION = 4


def migrate(db):
    # Lock before reading the version: concurrent starters cannot apply one migration twice.
    db.execute("BEGIN IMMEDIATE")
    try:
        current = db.execute("PRAGMA user_version").fetchone()[0]
        if current > SCHEMA_VERSION:
            raise RuntimeError("Database schema is newer than this application; refusing downgrade")
        for version in range(current + 1, SCHEMA_VERSION + 1):
            path, = Path(__file__).with_name("migrations").glob(f"{version:03d}_*.sql")
            # These bundled migrations contain only simple SQL statements, no triggers.
            for statement in path.read_text().split(";"):
                if statement.strip():
                    db.execute(statement)
            db.execute(f"PRAGMA user_version={version}")
        db.commit()
    except Exception:
        db.rollback()
        raise
