CREATE TABLE IF NOT EXISTS entities (
            id TEXT PRIMARY KEY, type TEXT NOT NULL,
            attributes TEXT NOT NULL, created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS entity_state (
            entity_id TEXT NOT NULL, key TEXT NOT NULL,
            value TEXT NOT NULL, updated_at TEXT NOT NULL,
            PRIMARY KEY(entity_id, key),
            FOREIGN KEY(entity_id) REFERENCES entities(id)
        );
        CREATE TABLE IF NOT EXISTS relations (
            id TEXT PRIMARY KEY, source_id TEXT NOT NULL,
            target_id TEXT NOT NULL, type TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(source_id) REFERENCES entities(id),
            FOREIGN KEY(target_id) REFERENCES entities(id)
        );
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY, entity_id TEXT NOT NULL,
            type TEXT NOT NULL, payload TEXT NOT NULL,
            occurred_at TEXT NOT NULL,
            FOREIGN KEY(entity_id) REFERENCES entities(id)
        );
