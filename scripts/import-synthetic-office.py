"""Quarantine original SuperSplat Vite/SSOG exports. Never executes imported project scripts.

Accept a downloaded archive, SSOG/SOG/PLY file, or a complete exported directory.
Originals stay unchanged; imported copies and hashes stay outside Git in .runtime.
"""
import argparse
import hashlib
import json
from pathlib import Path,PurePosixPath
import shutil
import stat
import tempfile
import zipfile

MAX_BYTES=2*1024**3
MAX_FILES=30000
SCENE_URL='https://superspl.at/scene/a972d838'


def sha(path):
    value=hashlib.sha256()
    with path.open('rb') as stream:
        while block:=stream.read(1024*1024):value.update(block)
    return value.hexdigest()


def safe_name(name):
    if '\\' in name or ':' in name or name.startswith('/') or '..' in PurePosixPath(name).parts:raise ValueError('Unsafe archive path')
    return PurePosixPath(name)


def import_original(source,destination):
    source=Path(source).resolve();destination=Path(destination).resolve()
    if not source.exists():raise ValueError('Original export not found')
    destination.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='intake-',dir=destination) as temp:
        stage=Path(temp);files=[]
        if source.is_dir():
            if destination==source or source in destination.parents:raise ValueError('Destination must be outside input directory')
            total=0
            for item in sorted(source.rglob('*')):
                if item.is_symlink():raise ValueError('Symlinks are not accepted')
                if item.is_file():
                    name=item.relative_to(source).as_posix();safe_name(name)
                    if any(part in ['.git','node_modules','.env','Cookies','Login Data'] for part in Path(name).parts):raise ValueError('Export contains private/runtime material; provide a clean official export')
                    total+=item.stat().st_size
                    if total>MAX_BYTES or len(files)>=MAX_FILES:raise ValueError('Export exceeds intake limits')
                    target=stage/name;target.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(item,target);files.append(name)
        elif source.suffix.lower()=='.zip':
            with zipfile.ZipFile(source) as archive:
                members=archive.infolist()
                if len(members)>MAX_FILES or sum(x.file_size for x in members)>MAX_BYTES:raise ValueError('Archive exceeds intake limits')
                for info in members:
                    name=safe_name(info.filename)
                    if stat.S_ISLNK(info.external_attr>>16):raise ValueError('Archive symlinks are not accepted')
                    if info.is_dir():continue
                    if any(part in ['.git','node_modules','.env','Cookies','Login Data'] for part in name.parts):raise ValueError('Archive contains private/runtime material')
                    target=stage/str(name);target.parent.mkdir(parents=True,exist_ok=True)
                    with archive.open(info) as incoming,target.open('wb') as outgoing:shutil.copyfileobj(incoming,outgoing)
                    files.append(str(name))
        elif source.suffix.lower() in ['.sog','.ssog','.ply','.spz','.json','.bin','.webp']:
            if source.stat().st_size>MAX_BYTES:raise ValueError('Asset exceeds intake limit')
            shutil.copyfile(source,stage/source.name);files=[source.name]
        else:raise ValueError('Provide original Vite ZIP/directory, SSOG/SOG or PLY export')
        entries=[{'path':name,'bytes':(stage/name).stat().st_size,'sha256':sha(stage/name)} for name in sorted(files)]
        digest=hashlib.sha256(json.dumps(entries,sort_keys=True).encode()).hexdigest()
        target=destination/digest[:16]
        if not target.exists():shutil.copytree(stage,target)
        entrypoints=[name for name in files if Path(name).name in ['index.html','package.json','lod-meta.json','meta.json']]
        assets=[name for name in files if Path(name).suffix.lower() in ['.sog','.ssog','.ply','.spz'] or Path(name).name in ['lod-meta.json','meta.json']]
        report={'scene_url':SCENE_URL,'source_name':source.name,'source_sha256':sha(source) if source.is_file() else None,
                'content_sha256':digest,'directory':str(target),'files':entries,'entrypoints':entrypoints,'asset_candidates':assets,
                'status':'received-awaiting-scene-inspection','scripts_executed':False,'spatial_gate_verified':False,
                'note':'Intake is not scene/collision/annotation validation. No substitute scene was generated.'}
        (destination/'intake-latest.json').write_text(json.dumps(report,indent=2)+'\n')
        return report


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('source');parser.add_argument('--destination',default='.runtime/assets/synthetic-office')
    args=parser.parse_args();print(json.dumps(import_original(args.source,args.destination),indent=2))
