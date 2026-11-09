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

## P2-09 pixel worker (sequential gates, in validation)

`entity_edge/vision.py` is a thin adapter of the pretrained Megvii YOLOX ONNX COCO detector using ONNX Runtime CPU and OpenCV preprocessing/NMS. It takes only validated PNG manifests, never simulator IDs/poses/paths. `scripts/spatial-simulation/perception/run-isolated.sh` runs it in read-only mounts with PID/network namespaces: no complete workspace, scene scripts, evaluator or credentials are mounted. Ground truth read attempts fail. Run outside an outer command sandbox that blocks user-namespace UID maps; do not silently fall back to unrestricted evaluation.

Megvii weights/models and algorithms: https://github.com/Megvii-BaseDetection/YOLOX (Apache-2.0). ONNX release binaries are pinned by SHA in evidence; verify their actual input contract rather than assuming helper code under a release tag matches an uploaded binary. Both Nano and S were compared. Threshold stays0.25; no GT-based replacement of misses. Recorded camera images are simulated; the neural inference is real. This does not certify accuracy on physical cameras or identify a civil person.
