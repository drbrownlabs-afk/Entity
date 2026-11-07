CREATE TABLE memories (
    id TEXT PRIMARY KEY, entity_id TEXT NOT NULL REFERENCES entities(id),
    content TEXT NOT NULL, source TEXT NOT NULL, created_at TEXT NOT NULL,
    schema_version TEXT NOT NULL
);
CREATE TABLE capabilities (
    id TEXT PRIMARY KEY, entity_id TEXT NOT NULL REFERENCES entities(id),
    operation TEXT NOT NULL, description TEXT NOT NULL,
    parameters TEXT NOT NULL, required_permission TEXT NOT NULL,
    schema_version TEXT NOT NULL, created_at TEXT NOT NULL,
    UNIQUE(entity_id, operation)
);
ALTER TABLE events ADD COLUMN source TEXT NOT NULL DEFAULT 'entity-api';
ALTER TABLE events ADD COLUMN schema_version TEXT NOT NULL DEFAULT '1.0';
CREATE INDEX events_entity_time ON events(entity_id, occurred_at, id);
CREATE INDEX memories_entity_time ON memories(entity_id, created_at, id);
CREATE INDEX relations_target ON relations(target_id);
