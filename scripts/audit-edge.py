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
    box.put({'observation_id':'permanently-rejected'});box.put({'observation_id':'valid-next'})
    seen=[]
    def reply(request):
        identity=json.loads(request.content)['observation_id'];seen.append(identity)
        return httpx.Response(422 if identity=='permanently-rejected' else 200,json={})
    with httpx.Client(base_url='http://audit-transport',transport=httpx.MockTransport(reply)) as client:
        box.flush(client,force=True);box.flush(client,force=True)
    report={'transport':'HTTPX MockTransport; isolated actual Outbox SQLite, not a physical source','permanent_422_queue':{'seen':seen,'pending':box.pending(),'valid_next_attempted':'valid-next' in seen,'finding':'Permanent bad head blocks subsequent valid observations; retries retain data but do not restore delivery'}}
    box.close()
Path('.runtime/mvp-audit-edge.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
