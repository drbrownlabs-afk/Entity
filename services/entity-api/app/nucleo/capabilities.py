from typing import Literal
from pydantic import Field
from app.schemas import CoreRecord,NonBlank
from fastapi import HTTPException
import httpx

class NormalizedResult(CoreRecord):
    status:Literal['verified','failed','timed_out','verification_failed']
    value:dict|None=None
    simulated:bool
    provenance:dict
    idempotency_key:str|None=None


class CapabilityDescriptor(CoreRecord):
    capability_id:NonBlank
    canonical_id:NonBlank
    version:Literal['1.0']='1.0'
    resource_id:NonBlank
    category:NonBlank
    modality:Literal['read','action']
    input_schema:dict
    output_schema:dict
    units:dict=Field(default_factory=dict)
    semantics:NonBlank
    restrictions:dict=Field(default_factory=dict)
    permission:NonBlank
    availability:Literal['available','unavailable']='available'
    provenance:dict
    errors:list[str]=Field(default_factory=lambda:['unavailable','timeout','invalid_input','version_mismatch','verification_failed'])
    timeout_seconds:float=Field(default=2,gt=0,le=10)


def normalize_sensor(value):
    kind=value.get('name');unit=value.get('unit');number=value.get('value')
    if isinstance(number,bool) or not isinstance(number,(float,int)):raise HTTPException(422,'Numeric sensor value required')
    import math
    if not math.isfinite(number):raise HTTPException(422,'Finite sensor value required')
    if kind=='temperature' and unit=='F':number=(number-32)*5/9;unit='C'
    allowed={'temperature':'C','humidity':'percent','co2':'ppm','illuminance':'lux','power':'W'}
    if kind not in allowed or unit!=allowed[kind]:raise HTTPException(422,'Unsupported sensor semantics/units')
    return {**value,'value':round(number,6),'unit':unit}


class SimulatedAdapter:
    name='simulated'
    def execute(self,descriptor,inputs,key):
        if inputs.get('_behavior')=='timeout':return {'status':'timed_out','simulated':True,'provenance':{'adapter':self.name}}
        if inputs.get('_behavior')=='fail':return {'status':'failed','simulated':True,'provenance':{'adapter':self.name}}
        if inputs.get('_behavior')=='mismatch':return {'status':'verification_failed','simulated':True,'provenance':{'adapter':self.name}}
        data=normalize_sensor(inputs) if descriptor.canonical_id=='sensor.read' else inputs
        return {'status':'verified','value':data,'simulated':True,'provenance':{'adapter':self.name,'capability_version':descriptor.version},'idempotency_key':key}


class RestTestAdapter:
    """Explicit test/provider base URL supplied by operator configuration, never by an action body."""
    name='rest-test'
    def __init__(self,url,transport=None):self.url=url;self.transport=transport
    def execute(self,descriptor,inputs,key):
        try:
            with httpx.Client(transport=self.transport,timeout=descriptor.timeout_seconds) as client:
                response=client.post(self.url,json={'operation':descriptor.canonical_id,'inputs':inputs},headers={'Idempotency-Key':key})
                response.raise_for_status();data=response.json()
        except httpx.TimeoutException:return {'status':'timed_out','simulated':True,'provenance':{'adapter':self.name}}
        except (httpx.HTTPError,ValueError):return {'status':'failed','simulated':True,'provenance':{'adapter':self.name}}
        value=normalize_sensor(data['value']) if descriptor.canonical_id=='sensor.read' else data.get('value')
        status='verified' if data.get('confirmed') is True else 'verification_failed'
        return {'status':status,'value':value,'simulated':True,'provenance':{'adapter':self.name,'provider_mode':'test-service'},'idempotency_key':key}


def execute(descriptor,inputs,key,adapter):
    if descriptor.version!='1.0':raise HTTPException(409,'Capability version mismatch')
    if descriptor.availability!='available':raise HTTPException(503,'Capability unavailable')
    try:return NormalizedResult.model_validate(adapter.execute(descriptor,inputs,key)).model_dump(mode='json',exclude_none=True)
    except ValueError:raise HTTPException(502,'Adapter returned incompatible normalized result')
