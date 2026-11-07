# Original Synthetic Office assets — intake and access evidence

Scene: https://superspl.at/scene/a972d838 . Original scene only; no replacement building.

2026-11-07: local proxy CONNECT403 happened before SuperSplat, so it cannot establish whether the scene requires authentication. Authorized GitHub Actions Chromium loaded the scene with HTTP200, without login. See docs/evidence/phase09/scene-discovery.json and synthetic-office-browser.png (run42389897089). Actual public assets observed: original Streamed SOG `https://d28zzqy0iyovbz.cloudfront.net/a972d838/v1/lod-meta.json`, its original texture chunks, and scene.voxel.json/bin. The renderer displayed the real office and an existing “6-Person Office Bench System” annotation. Author shown: argenzio, license CC BY-NC4.0; retain attribution and distinguish prototype use from any future commercial license clearance.

The managed desktop reports enabled/unknown, but no interactive control tool, DISPLAY, or X11 socket is exposed in this session. No authenticated operator browser session is available here. No password/cookies are requested in chat. The remote browser inspection is anonymous; it does not claim to use the operator's login. Official Download menu and original viewer configuration are inspected separately.

For an authenticated official export supplied through shared storage, prioritize the complete Vite project ZIP and Streamed SOG with all chunk folders. Put received originals under `.runtime/incoming/synthetic-office/` or supply the uploaded file identifier; do not commit credentials or browser profiles.

Intake command:

```sh
python scripts/import-synthetic-office.py /path/to/original-vite.zip
python scripts/import-synthetic-office.py /path/to/complete-ssog-directory
```

Imports are immutable hashed copies under `.runtime/assets/synthetic-office/`. The importer preserves originals, refuses archive traversal/symlinks/private environment files, records hashes and entrypoints, and does not execute project scripts. Successful intake is not successful rendering/collision/annotation validation. `intake-latest.json` explicitly retains spatial_gate_verified=false until actual scene checks pass. Intake archive safety tests do not generate a substitute visual scene.
