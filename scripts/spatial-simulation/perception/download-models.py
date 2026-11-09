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
extra={
 'osnet_ain.py':('https://raw.githubusercontent.com/KaiyangZhou/deep-person-reid/f8cd150fdf77e8d9e1ed143b7f308c2c609ded50/torchreid/models/osnet_ain.py','a43b495866a4b1645cd134a30c3011592e8c6826ba4781955a135588cf46cd25'),
 'osnet_ain_ms_d_c_wtsonly.pth':('https://raw.githubusercontent.com/levan92/deep_sort_realtime/3341f823ee0ad20aa58c906079a37f3d43b42bbe/deep_sort_realtime/embedder/weights/osnet_ain_ms_d_c_wtsonly.pth','482f09440f28ac92b7aa215a56323430f03aaf2657273269af02a670d3c8440a')}
for name,(url,digest)in extra.items():
 file=root/name
 if not file.exists():subprocess.run(['curl','--fail','--location','--max-time','90',url,'--output',str(file)],check=True)
 assert hashlib.sha256(file.read_bytes()).hexdigest()==digest,'Source/model checksum mismatch: '+name
 print(name,digest)
