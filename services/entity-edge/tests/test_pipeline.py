import json
from pathlib import Path
import tempfile
import unittest
import httpx
from entity_edge.pipeline import Edge, Outbox, TemporalTracker, ZoneMapper, VideoSource

ZONES=json.loads((Path(__file__).parents[1]/'zones.json').read_text())


class EdgeTests(unittest.TestCase):
    def test_tracking_zone_crossing_loss_and_new_session(self):
        with tempfile.TemporaryDirectory() as tmp:
            box=Outbox(str(Path(tmp)/'queue.db'))
            edge=Edge(box,'camera','edge-demo',ZONES,simulated=True,session='test')
            tracker=TemporalTracker(); messages=[]
            for i in range(17):messages.append(edge.emit(tracker.update([(.1+i*.05,.7)])))
            self.assertTrue(all(m['payload']['tracks'][0]['local_track_id']=='test:1' for m in messages))
            changes=[t for m in messages for t in m['payload']['transitions']]
            self.assertIn('left',[t['zone_id'] for t in changes if t['type']=='zone.exited'])
            self.assertIn('right',[t['zone_id'] for t in changes if t['type']=='zone.entered'])
            lost=edge.emit(tracker.update([]))
            self.assertEqual(lost['payload']['tracks'],[])
            self.assertEqual(lost['payload']['transitions'][0]['type'],'zone.exited')
            edge.emit([],status='disconnected')
            edge.session='reconnected'
            self.assertTrue(edge.emit(TemporalTracker().update([(.2,.7)]))['payload']['tracks'][0]['local_track_id'].startswith('reconnected:'))
            box.close()

    def test_durable_outbox_failure_recovery_same_body(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=str(Path(tmp)/'queue.db'); box=Outbox(path)
            message=Edge(box,'camera','demo',ZONES,simulated=True).emit([])
            def fail(req):raise httpx.ConnectError('offline')
            with httpx.Client(base_url='http://test',transport=httpx.MockTransport(fail)) as client:
                self.assertEqual(box.flush(client),0)
            box.close(); box=Outbox(path)
            seen=[]
            def ok(req):
                seen.append(json.loads(req.content));return httpx.Response(200,json={'duplicate':False})
            with httpx.Client(base_url='http://test',transport=httpx.MockTransport(ok)) as client:
                self.assertEqual(box.flush(client,force=True),1)
            self.assertEqual(seen,[message]);self.assertEqual(box.pending(),0);box.close()

    def test_invalid_source_and_zone(self):
        with self.assertRaises(OSError):VideoSource('/nonexistent/video.avi')
        with self.assertRaises(ValueError):ZoneMapper([{'id':'bad','polygon':[[2,0],[0,0],[0,1]]}])

    def test_stream_disconnect_reopens_via_capture_adapter(self):
        from unittest.mock import patch
        import numpy as np
        frame=np.zeros((64,64,3),dtype=np.uint8)
        class Capture:
            def __init__(self):self.reads=0
            def isOpened(self):return True
            def read(self):
                self.reads+=1
                return (True,frame) if self.reads==1 else (False,None)
            def release(self):pass
        with patch('entity_edge.pipeline.cv2.VideoCapture',side_effect=lambda _:Capture()), patch('entity_edge.pipeline.time.sleep'):
            stream=iter(VideoSource('rtsp://synthetic-adapter'))
            self.assertIs(next(stream),frame)
            self.assertIsNone(next(stream))
            self.assertIs(next(stream),frame)
            stream.close()
