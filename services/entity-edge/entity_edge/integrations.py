"""Thin REST/Paho adapters to the existing Observation v1 and durable FIFO."""
import json
import math
import threading
from datetime import datetime
from uuid import UUID, uuid5, NAMESPACE_URL
from .pipeline import Outbox


def timestamp(value):
    if not isinstance(value,str):raise ValueError('Timestamp must be text')
    parsed=datetime.fromisoformat(value.replace('Z','+00:00'))
    if parsed.tzinfo is None:raise ValueError('Timestamp requires timezone')
    return parsed.isoformat()


def measurement(record,source_id,connector_id,simulated=True):
    if not isinstance(record,dict):raise ValueError('Measurement must be an object')
    units={'temperature':'C','humidity':'percent','co2':'ppm','presence':'boolean'}
    kind=record['name'];value=record['value']
    if kind not in units or record['unit']!=units[kind]:raise ValueError('Unsupported measurement/unit')
    if kind=='presence':
        if not isinstance(value,bool):raise ValueError('Presence must be boolean')
    elif isinstance(value,bool) or not isinstance(value,(int,float)) or abs(value)>1e100 or not math.isfinite(value):
        raise ValueError('Measurement must be finite numeric')
    return {'schema_version':'1.0','observation_id':str(UUID(record['id'])),'site_id':'integration-lab','source_id':source_id,
        'observed_at':timestamp(record['observed_at']),'type':'sensor.measurement',
        'payload':{'name':kind,'value':value,'unit':record['unit']},
        'provenance':{'connector_id':connector_id,'model_version':'paho-mqtt-profile-v1','simulated':simulated}}


def reservation(record,source_id,connector_id,simulated=True):
    if not isinstance(record,dict):raise ValueError('Reservation must be an object')
    identity=record['id'];revision=record['revision']
    if not isinstance(identity,str) or not 0<len(identity)<=128:raise ValueError('Invalid reservation ID')
    if isinstance(revision,bool) or not isinstance(revision,int) or revision<0:raise ValueError('Invalid revision')
    if record['status'] not in ('confirmed','cancelled'):raise ValueError('Invalid reservation status')
    start=timestamp(record['starts_at']);end=timestamp(record['ends_at'])
    if datetime.fromisoformat(end)<=datetime.fromisoformat(start):raise ValueError('Invalid reservation interval')
    return {'schema_version':'1.0','observation_id':str(uuid5(NAMESPACE_URL,json.dumps([connector_id,source_id,identity,revision]))),
        'site_id':'integration-lab','source_id':source_id,'observed_at':timestamp(record['updated_at']),
        'type':'business.reservation','payload':{'external_id':identity,'revision':revision,'status':record['status'],
            'starts_at':start,'ends_at':end},
        'provenance':{'connector_id':connector_id,'model_version':'rest-reservations-profile-v1','simulated':simulated}}


def poll_reservations(client,path,outbox,source_id,connector_id,simulated=True):
    response=client.get(path);response.raise_for_status()
    records=response.json()
    if not isinstance(records,list) or len(records)>1000:raise ValueError('Expected bounded reservation list')
    normalized=[reservation(r,source_id,connector_id,simulated) for r in records]
    for item in normalized:outbox.put(item)
    return len(normalized)


class MqttSensor:
    """QoS1 ACK only after durable enqueue, callbacks open their own SQLite connection."""
    def __init__(self,outbox_path,topic,source_id,connector_id,simulated=True,client_id='entity-edge'):
        import paho.mqtt.client as mqtt
        self.client=mqtt.Client(mqtt.CallbackAPIVersion.VERSION2,client_id=client_id,clean_session=False,manual_ack=True)
        self.client.reconnect_delay_set(min_delay=1,max_delay=8)
        self.client.on_connect=self._connect
        self.client.on_message=self._message
        self.subscribed=threading.Event()
        self.client.on_subscribe=lambda *args:self.subscribed.set()
        self.client.on_disconnect=lambda *args:self.subscribed.clear()
        self.path,self.topic,self.source_id,self.connector_id=outbox_path,topic,source_id,connector_id
        self.simulated=simulated;self.error=None;self.connected=False;self.received=0

    def _connect(self,client,userdata,flags,reason,properties):
        self.connected=not reason.is_failure
        if self.connected:client.subscribe(self.topic,qos=1)

    def _message(self,client,userdata,message):
        if message.topic!=self.topic:return
        try:
            if len(message.payload)>16000:raise ValueError('Message too large')
            observation=measurement(json.loads(message.payload),self.source_id,self.connector_id,self.simulated)
            box=Outbox(self.path)
            try:box.put(observation)
            finally:box.close()
            if message.qos:client.ack(message.mid,message.qos)
            self.received+=1
        except (ValueError,KeyError,TypeError):
            self.error='invalid_sensor_message' # no payload/credentials in diagnostics; no ACK on invalid input

    def start(self,host,port,tls=False,username=None,password=None):
        if username is not None:self.client.username_pw_set(username,password)
        if tls:self.client.tls_set() # default certificate/hostname verification stays enabled
        self.client.connect_async(host,port,keepalive=10)
        self.client.loop_start()

    def close(self):
        self.client.disconnect();self.client.loop_stop()
