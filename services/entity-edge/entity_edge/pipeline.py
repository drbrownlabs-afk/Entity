import json
import sqlite3
import time
from datetime import datetime, timezone
from uuid import uuid4
import cv2
import numpy as np
from norfair import Detection, Tracker


class VideoSource:
    """OpenCV file/URL capture. Explicit EOF/error; reopening creates a new tracking session."""
    def __init__(self, location):
        self.location = location
        self.reconnects = 0
        self.capture = cv2.VideoCapture(location)
        if not self.capture.isOpened():
            raise OSError('Video source unavailable')

    def __iter__(self):
        try:
            while True:
                ok, frame = self.capture.read()
                if not ok:
                    if '://' not in str(self.location):
                        break # finite recording has ended
                    self.capture.release()
                    yield None # explicit interrupted-source marker; never a person frame
                    if self.reconnects >= 3:
                        raise OSError('Video stream reconnection exhausted')
                    self.reconnects += 1
                    time.sleep(min(2, .25 * 2**self.reconnects))
                    self.capture = cv2.VideoCapture(self.location)
                    continue
                yield frame
        finally:
            self.capture.release()


class HogPeople:
    version = 'opencv-4.11-hog-default-people-svm'
    def __init__(self):
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

    def detect(self, frame):
        boxes, scores = self.hog.detectMultiScale(frame, winStride=(8,8), padding=(8,8), scale=1.05)
        return [(float(x+w/2)/frame.shape[1], float(y+h)/frame.shape[0])
                for (x,y,w,h), score in zip(boxes,scores) if float(score) >= .5]


class TemporalTracker:
    """Norfair association/Kalman filter; positions normalized to camera image."""
    def __init__(self, hit_counter_max=3):
        self.tracker = Tracker(distance_function='euclidean', distance_threshold=.15,
                               initialization_delay=0, hit_counter_max=hit_counter_max)

    def update(self, points):
        detections = [Detection(np.array([[x,y]])) for x,y in points]
        objects = self.tracker.update(detections)
        # Do not report stale predictions as observed people.
        return [(str(obj.id), obj.estimate[0].tolist()) for obj in objects if any(obj.last_detection is detection for detection in detections)]


class ZoneMapper:
    def __init__(self, zones):
        self.zones = zones
        for zone in zones:
            if len(zone['polygon']) < 3:
                raise ValueError('Zone needs three or more normalized points')
            if any(not 0 <= value <= 1 for point in zone['polygon'] for value in point):
                raise ValueError('Zone coordinates must be normalized')

    def locate(self, point):
        for zone in self.zones:
            if cv2.pointPolygonTest(np.array(zone['polygon'], dtype=np.float32), tuple(point), False) >= 0:
                return zone['id']
        return None


class Outbox:
    """Durable FIFO, same UUID/body on retries; never discard rejected messages silently."""
    def __init__(self, path):
        self.db = sqlite3.connect(path)
        self.db.execute('CREATE TABLE IF NOT EXISTS queue (seq INTEGER PRIMARY KEY, body TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, next_attempt REAL NOT NULL DEFAULT 0)')
        self.db.commit()

    def put(self, observation):
        with self.db:
            self.db.execute('INSERT INTO queue(body) VALUES(?)', (json.dumps(observation),))

    def flush(self, client, force=False):
        delivered = 0
        for seq, body, attempts, due in self.db.execute('SELECT * FROM queue ORDER BY seq').fetchall():
            if not force and due > time.time():
                break
            try:
                response = client.post('/v1/integrations/observations', json=json.loads(body))
                response.raise_for_status()
            except Exception:
                with self.db:
                    self.db.execute('UPDATE queue SET attempts=?,next_attempt=? WHERE seq=?',
                                    (attempts+1,time.time()+min(60,2**min(attempts,6)),seq))
                break
            with self.db:
                self.db.execute('DELETE FROM queue WHERE seq=?',(seq,))
            delivered += 1
        return delivered

    def pending(self):
        return self.db.execute('SELECT count(*) FROM queue').fetchone()[0]

    def close(self):
        self.db.close()


class Edge:
    def __init__(self, outbox, camera, connector, zones, simulated=False, model='synthetic-fixture-v1', session=None):
        self.outbox,self.camera,self.connector = outbox,camera,connector
        self.zones = ZoneMapper(zones)
        self.simulated,self.model = simulated,model
        self.session = session or str(uuid4())
        self.previous = {}

    def emit(self, tracked, status='connected', frame_index=None, media_time_seconds=None):
        tracks = [{'local_track_id': f'{self.session}:{tid}', 'zone_id':self.zones.locate(point),
                   'position':point} for tid,point in tracked]
        current = {t['local_track_id']:t['zone_id'] for t in tracks}
        transitions = []
        for tid, zone in self.previous.items():
            if tid not in current or current[tid] != zone:
                transitions.append({'type':'zone.exited','local_track_id':tid,'zone_id':zone})
        for tid, zone in current.items():
            if tid not in self.previous or self.previous[tid] != zone:
                transitions.append({'type':'zone.entered','local_track_id':tid,'zone_id':zone})
        self.previous = current
        message = {'observation_id':str(uuid4()),'schema_version':'1.0','site_id':'edge-demo',
                   'source_id':self.camera,'observed_at':datetime.now(timezone.utc).isoformat(),
                   'type':'edge.presence','payload':{'tracks':tracks,'transitions':transitions,'source_status':status,'frame_index':frame_index,'media_time_seconds':media_time_seconds},
                   'provenance':{'connector_id':self.connector,'model_version':self.model,'simulated':self.simulated}}
        self.outbox.put(message)
        return message
