"""Validate actual JS viewer export against unmodified Core/Output, using temporary data."""
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
from unittest.mock import patch

root=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(root/'services/entity-api'))
from fastapi.testclient import TestClient
from app import main

export=subprocess.check_output(['node','--input-type=module','-e',
    "import {Experience} from './apps/web/src/world.js';const w=new Experience();w.setTick(6);console.log(JSON.stringify(w.observation()));"],cwd=root,text=True)
observation=json.loads(export)
previous=main.DB_PATH
with tempfile.TemporaryDirectory() as directory,patch.dict(os.environ,ENTITY_AGENT_PROVIDER='controlled',ENTITY_CONNECTOR_TOKENS=json.dumps([
    {'token':'contract-fixture-only','actor':'experience-test','permissions':['registry:write','observe:write','agent:read','output:write']}])):
    main.DB_PATH=Path(directory)/'core.sqlite3'
    try:
        with TestClient(main.app) as client:
            headers={'Authorization':'Bearer contract-fixture-only'}
            for identity,kind in [('experience-camera','Camera'),('experience-screen','Display')]:
                client.post('/v1/entities',json={'id':identity,'type':kind}).raise_for_status()
            client.put('/v1/integrations/connectors/experience',headers=headers,json={'connector_id':'experience','version':'1','protocols':['simulation'],'input_event_types':['edge.presence']}).raise_for_status()
            cap=client.post('/v1/entities/experience-screen/capabilities',json={'operation':'display.set_scene','description':'Virtual signage','required_permission':'output:write'}).json()['id']
            client.put('/v1/output/displays/experience-screen',headers=headers,json={}).raise_for_status()
            client.put('/v1/output/rules/experience',headers=headers,json={'camera_id':'experience-camera','capability_id':cap}).raise_for_status()
            response=client.post('/v1/integrations/observations',headers=headers,json=observation);response.raise_for_status()
            assert not response.json()['duplicate']
            camera=client.get('/v1/entities/experience-camera').json()
            assert len(camera['state']['edge.presence']['tracks'])==len(observation['payload']['tracks'])
            assert client.get('/v1/entities/experience-screen').json()['state']['display.scene']=='welcome'
            assert client.post('/v1/integrations/observations',headers=headers,json=observation).json()['duplicate']
            assert len(client.get('/v1/entities/experience-camera/events').json())==1
            report={'viewer_export_contract':'passed','core_projection':'passed','output_rule':'verified','deduplication':'passed','simulated':True,'tracks':len(observation['payload']['tracks'])}
            (root/'.runtime/experience-contract.json').write_text(json.dumps(report,indent=2)+'\n')
            print(json.dumps(report))
    finally:main.DB_PATH=previous
