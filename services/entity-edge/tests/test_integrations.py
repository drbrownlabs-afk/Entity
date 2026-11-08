import json
from pathlib import Path
import tempfile
import unittest
from uuid import uuid4
import httpx
from entity_edge.integrations import measurement,reservation,poll_reservations,MqttSensor
from entity_edge.pipeline import Outbox


class IntegrationTests(unittest.TestCase):
    def sensor(self):return {'id':str(uuid4()),'name':'temperature','value':24.5,'unit':'C','observed_at':'2026-11-06T12:00:00Z'}
    def booking(self):return {'id':'test-booking','revision':1,'status':'confirmed','starts_at':'2026-11-06T12:00:00Z','ends_at':'2026-11-06T13:00:00Z','updated_at':'2026-11-06T11:00:00Z','customer_name':'discarded-private-field'}

    def test_profiles_privacy_stable_ids_and_validation(self):
        record=self.sensor();a=measurement(record,'sensor','mqtt');self.assertEqual(a,measurement(record,'sensor','mqtt'))
        self.assertTrue(a['provenance']['simulated'])
        record['value']=float('nan')
        with self.assertRaises(ValueError):measurement(record,'sensor','mqtt')
        record=self.sensor();record['observed_at']='2026-11-06T12:00:00'
        with self.assertRaises(ValueError):measurement(record,'sensor','mqtt')
        record=self.booking();a=reservation(record,'room','rest');self.assertNotIn('customer_name',json.dumps(a))
        self.assertEqual(a,reservation(record,'room','rest'))
        record['revision']=2;self.assertNotEqual(a['observation_id'],reservation(record,'room','rest')['observation_id'])

    def test_rest_http_error_and_atomic_validation(self):
        with tempfile.TemporaryDirectory() as tmp:
            box=Outbox(str(Path(tmp)/'q.sqlite3'))
            with httpx.Client(base_url='http://fixture',transport=httpx.MockTransport(lambda r:httpx.Response(503))) as client:
                with self.assertRaises(httpx.HTTPStatusError):poll_reservations(client,'/bookings',box,'room','rest')
            bad=self.booking();bad['status']='invalid'
            with httpx.Client(base_url='http://fixture',transport=httpx.MockTransport(lambda r:httpx.Response(200,json=[self.booking(),bad]))) as client:
                with self.assertRaises(ValueError):poll_reservations(client,'/bookings',box,'room','rest')
            self.assertEqual(box.pending(),0);box.close()

    def test_mqtt_callback_durability_and_poison_message(self):
        from types import SimpleNamespace
        class Ack:
            def __init__(self):self.acks=[]
            def ack(self,*args):self.acks.append(args)
        with tempfile.TemporaryDirectory() as tmp:
            path=str(Path(tmp)/'q.sqlite3');sensor=MqttSensor(path,'demo/sensor','sensor','mqtt');client=Ack()
            message=SimpleNamespace(topic='demo/sensor',payload=json.dumps(self.sensor()).encode(),qos=1,mid=1)
            sensor._message(client,None,message)
            box=Outbox(path);self.assertEqual(box.pending(),1);box.close();self.assertEqual(client.acks,[(1,1)])
            message.payload=b'bad';sensor._message(client,None,message)
            self.assertEqual(client.acks,[(1,1)]);self.assertEqual(sensor.error,'invalid_sensor_message')
            sensor.connected=True;sensor.subscribed.set();sensor._disconnect()
            self.assertFalse(sensor.connected);self.assertFalse(sensor.subscribed.is_set())
