import argparse
import json
import os
from pathlib import Path
import httpx
from .pipeline import Edge, HogPeople, Outbox, TemporalTracker, VideoSource


def run():
    parser=argparse.ArgumentParser()
    parser.add_argument('--video')
    parser.add_argument('--zones',required=True)
    parser.add_argument('--outbox',required=True)
    parser.add_argument('--core',default='http://127.0.0.1:8000')
    parser.add_argument('--camera',default='edge-camera')
    parser.add_argument('--limit',type=int,default=60)
    parser.add_argument('--report',required=True)
    parser.add_argument('--disconnect-frame',type=int,default=-1)
    args=parser.parse_args()
    outbox=Outbox(args.outbox)
    simulated=not bool(args.video)
    detector=HogPeople() if not simulated else None
    edge=Edge(outbox,args.camera,'edge-demo',json.loads(Path(args.zones).read_text()),
              simulated=simulated,model=detector.version if detector else 'synthetic-fixture-v1')
    tracker=TemporalTracker()
    totals={'frames':0,'detections':0,'tracked_samples':0,'transitions':0}
    with httpx.Client(base_url=args.core,headers={'Authorization':'Bearer '+os.environ['ENTITY_EDGE_TOKEN']},timeout=10) as client:
        r=client.post('/v1/entities',json={'id':args.camera,'type':'Camera'})
        if r.status_code not in (201,409):r.raise_for_status()
        client.put('/v1/integrations/connectors/edge-demo',json={'connector_id':'edge-demo','version':'1',
            'protocols':['simulation','rest'],'input_event_types':['edge.presence']}).raise_for_status()
        outbox.flush(client)
        source=VideoSource(args.video) if args.video else json.loads((Path(__file__).resolve().parents[3]/'worlds/shopping-mall/fixture.json').read_text())['frames']
        fps = source.capture.get(5) if args.video else 10
        if fps <= 0:fps = 10
        for n,frame in enumerate(source):
            if n>=args.limit:break
            if frame is None or n == args.disconnect_frame:
                from uuid import uuid4
                edge.emit([],status='disconnected')
                tracker=TemporalTracker()
                edge.session=str(uuid4())
                if frame is None:
                    outbox.flush(client)
                    continue
            points=detector.detect(frame) if detector else frame
            tracks=tracker.update(points)
            observation=edge.emit(tracks,frame_index=n,media_time_seconds=n/fps)
            totals['frames']+=1;totals['detections']+=len(points);totals['tracked_samples']+=len(tracks)
            totals['transitions']+=len(observation['payload']['transitions'])
            outbox.flush(client)
        edge.emit([],status='eof')
        outbox.flush(client,force=True)
        totals['pending']=outbox.pending()
        totals['camera_state']=client.get('/v1/entities/'+args.camera).json()['state']
    outbox.close()
    Path(args.report).write_text(json.dumps(totals,indent=2)+'\n')
    print(json.dumps(totals))
    if totals['pending']:raise SystemExit('Pending delivery; rerun to retry durable FIFO')


if __name__=='__main__':run()
