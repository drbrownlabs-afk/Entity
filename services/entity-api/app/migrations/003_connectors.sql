CREATE TABLE connectors (id TEXT PRIMARY KEY, manifest TEXT NOT NULL);
CREATE TABLE observations (id TEXT PRIMARY KEY, body TEXT NOT NULL, received_at TEXT NOT NULL);
CREATE TABLE invocations (id TEXT PRIMARY KEY, actor TEXT NOT NULL, body TEXT NOT NULL, result TEXT NOT NULL);
CREATE TABLE connector_audit (id TEXT PRIMARY KEY, actor TEXT NOT NULL, operation TEXT NOT NULL, outcome TEXT NOT NULL, created_at TEXT NOT NULL);
