"""Reproducible public model download, TLS/proxy retained, exact release SHA checked."""
import hashlib,subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[3]/'simulation/spatial-office/.runtime/p2-vision-models';root.mkdir(parents=True,exist_ok=True)
models={'yolox_nano.onnx':'c789161ed43c8269fcd4e67c67eeeb4e80c622da2eb296a20bc6007bd18a0b7d','yolox_s.onnx':'c5c2d13e59ae883e6af3b45daea64af4833a4951c92d116ec270d9ddbe998063'}
for name,digest in models.items():
 file=root/name
 if not file.exists():subprocess.run(['curl','--fail','--location','--max-time','90','https://github.com/Megvii-BaseDetection/YOLOX/releases/download/0.1.1rc0/'+name,'--output',str(file)],check=True)
 assert hashlib.sha256(file.read_bytes()).hexdigest()==digest,'Model checksum mismatch: '+name
 print(name,digest)
