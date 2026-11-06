# Deployment and source of truth

GitHub repository `drbrownlabs-afk/Entity` is the canonical home for code, schemas, migration scripts, container manifests, docs, deterministic synthetic fixtures and test automation. Codex cloud sessions are disposable build/test environments. They are **not** guaranteed to provide an always-on production server.

Persisted database records, container volumes, credentials, real sensor recordings and runtime logs do not automatically live in GitHub. Store secrets in a secure environment secret manager; store real runtime state on durable disks/backups once hosted.

Development workflow: pull main → create a branch → implement and run tests → commit → open PR or merge after review. Keep dependencies/image versions pinned. Verify a clean clone can reproduce the environment.

Security: bind development ports to localhost, use synthetic demo data, and do not expose unauthenticated mutation endpoints to the Internet.
