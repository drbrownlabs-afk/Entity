# ENTITY Edge

OpenCV HOG pretrained people detector + Norfair tracking, camera-local IDs, image zones,
durable observations and REST delivery to ENTITY Core. Separate Python environment.

From repository root:

```sh
bash scripts/setup-cloud.sh  # Core, if needed
bash scripts/setup-edge.sh
bash scripts/demo-edge.sh
```

The demo prints numerical results and leaves local SQLite world/event history and reports
under `.runtime/edge-demo`. Public test video stays ignored and checksum verified.
See [Phase 03](../../docs/phases/PHASE-03.md) for evidence, provenance, licenses and limitations.
No Orbbec hardware or personal identity is assumed. Synthetic and video sources are labelled.
