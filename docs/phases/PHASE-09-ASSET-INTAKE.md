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

## Rechecked access and exact validation limits

On 2026-11-07, managed environment status again reported desktop enabled with state unknown, but the available tool catalogue exposes no desktop JavaScript/browser-control or open-in-desktop tool. DISPLAY is unset and /tmp/.X11-unix is absent. An interactive authenticated download could not be attempted; this does not imply that the operator's authenticated Download menu is unavailable. No authenticated Vite export has been obtained. The incoming directory is currently empty.

The enforced network allowlist omits superspl.at and d28zzqy0iyovbz.cloudfront.net. The prior proxy CONNECT403 is an environment access denial before application authentication, not evidence of an expired SuperSplat session. The authorized Actions browser is a separate anonymous session and successfully loaded the original published SSOG.

Actual original asset integration is recorded in commit baf37b3 and `docs/evidence/phase09/original-integration.json`: desktop 1440px and touch-emulated 390px loaded the original scene, retained all four original annotations, selected the conference-table annotation, enabled native voxel walk mode, and reported no page errors. This verifies loading and native collision availability; it does not certify every walking route, all wall collisions, physical camera coverage, a physical phone, or the complete Phase09 spatial gate.

### Receiving the official exports

Priority: (1) the complete official Vite ZIP, (2) the complete SSOG directory/archive with its referenced chunks, plus original voxel collision files if supplied. Keep directory structure unchanged. No password, cookie jar, browser profile or login token is needed. An individual lod-meta.json is not a complete SSOG download. PLY remains an optional original source, not a substitute office.

Shared files can be placed in `.runtime/incoming/synthetic-office/` or attached through the available shared-storage channel. The agent imports the supplied originals using the commands above, reviews the Vite manifest without executing its scripts, and checks the SSOG references before switching the asset base. The existing integration remains intact.

The current viewer accepts an absolute `VITE_OFFICE_ASSET_BASE` URL ending in `/`; its root must contain `lod-meta.json`, the original chunk directories and `scene.voxel.json` with its corresponding binary. This configuration is only for a complete compatible original SSOG export. If the official Vite export uses a different layout, inspect its settings and preserve those references rather than renaming or manufacturing assets. The imported directory and its receipt stay outside Git; no export has yet been claimed verified.

Command re-executed: `python -m unittest discover -s scripts/tests -p test_scene_intake.py -v` — 3/3 passed. These tests validate safe intake only, not the office scene itself.
