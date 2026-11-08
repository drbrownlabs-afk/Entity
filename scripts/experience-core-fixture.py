"""Controlled backend only for real browser connection tests. Never used by the static build."""
import os
from pathlib import Path
import sys
import tempfile
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'services/entity-api'))
os.environ['ENTITY_ALLOWED_ORIGINS']='http://127.0.0.1:4173'
os.environ['ENTITY_AGENT_PROVIDER']='controlled'
os.environ['ENTITY_CONNECTOR_TOKENS']='[{"token":"playwright-fixture-only","actor":"browser-fixture","permissions":["agent:read","output:write"]}]'
from app import main
from app.output import configure,DisplayConfig
import uvicorn
with tempfile.TemporaryDirectory() as directory:
    main.DB_PATH=Path(directory)/'fixture.sqlite3';main.initialize()
    main.create_entity(main.EntityCreate(id='browser-camera',type='Camera'))
    main.update_state('browser-camera',main.StateUpdate(key='edge.presence',value={'tracks':[{'local_track_id':'synthetic-1','zone_id':'north','position':[.3,.7]}],'observed_at':'2026-11-06T12:00:00Z','simulated':True}))
    main.create_entity(main.EntityCreate(id='browser-display',type='Display'))
    main.declare_capability('browser-display',main.CapabilityCreate(operation='display.set_scene',description='Browser fixture',required_permission='output:write'))
    configure('browser-display',DisplayConfig(),actor='fixture')
    uvicorn.run(main.app,host='127.0.0.1',port=4174,log_level='warning')
