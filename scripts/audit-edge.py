"""Queue poisoning and scoped identity probes using existing Outbox and a controlled HTTP transport."""
import json
from pathlib import Path
import sys
import tempfile
import httpx
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'services/entity-edge'))
from entity_edge.pipeline import Outbox

with tempfile.TemporaryDirectory() as tmp:
    box=Outbox(str(Path(tmp)/'queue.sqlite3'))
    bad_id='00000000-0000-4000-8000-000000000001'
    good_id='00000000-0000-4000-8000-000000000002'
    valid={'schema_version':'1.0','observation_id':good_id,'site_id':'audit-site','source_id':'audit-camera',
           'observed_at':'2026-11-07T00:00:00Z','type':'edge.presence',
           'payload':{'tracks':[],'transitions':[],'source_status':'connected'},
           'provenance':{'connector_id':'audit','model_version':'audit-profile','simulated':True}}
    invalid={**valid,'observation_id':bad_id,'payload':{'tracks':'invalid'}}
    box.put(invalid);box.put(valid)
    seen=[]
    def reply(request):
        identity=json.loads(request.content)['observation_id'];seen.append(identity)
        return httpx.Response(422 if identity==bad_id else 200,json={})
    with httpx.Client(base_url='http://audit-transport',transport=httpx.MockTransport(reply)) as client:
        box.flush(client,force=True);box.flush(client,force=True)
    report={'transport':'HTTPX MockTransport; isolated actual Outbox SQLite, not a physical source','permanent_422_queue':{'seen':seen,'queued_bodies':[invalid,valid],'pending':box.pending(),'valid_next_attempted':good_id in seen,'finding':'Permanent bad head blocks subsequent valid observations; retries retain data but do not restore delivery'}}
    box.close()
Path('.runtime/mvp-audit-edge.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
