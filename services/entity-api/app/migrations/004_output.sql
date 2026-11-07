CREATE TABLE virtual_outputs (entity_id TEXT PRIMARY KEY REFERENCES entities(id), scene TEXT NOT NULL DEFAULT 'idle', manual INTEGER NOT NULL DEFAULT 0, behavior TEXT NOT NULL DEFAULT 'normal');
CREATE TABLE output_rules (id TEXT PRIMARY KEY, camera_id TEXT NOT NULL REFERENCES entities(id), capability_id TEXT NOT NULL REFERENCES capabilities(id), active_scene TEXT NOT NULL, idle_scene TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1);
CREATE TABLE output_runs (id TEXT PRIMARY KEY, fingerprint TEXT NOT NULL, result TEXT NOT NULL);
