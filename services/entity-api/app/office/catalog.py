"""Domain capability declarations. Vendor transforms remain in Núcleo."""
from app.nucleo.capabilities import CapabilityDescriptor,NormalizedResult
from .storage import identity,encode
from .inputs import INPUTS
import json

OPERATIONS={
 'zone.assumeOccupancy':('operate','action','simulation'),
 'device.setPower':('operate','action','device'),'presence.checkout':('receive','action','identity'),
 'reception.interact':('kiosk','action','communication'),'intercom.reply':('reply','action','communication'),'intercom.timeout':('operate','action','communication'),
 'entity.remember':('operate','action','resource'),
 'entity.upsert':('manage','action','resource'), 'relation.add':('manage','action','resource'),
 'membership.set':('manage','action','membership'), 'account.create':('manage','action','identity'),
 'booking.create':('book','action','booking'),'booking.cancel':('book','action','booking'),'booking.reassign':('book','action','booking'),'booking.extend':('book','action','booking'),
 'booking.checkin':('receive','action','booking'),'booking.no_show':('receive','action','booking'),
 'access.checkAuthorization':('read','read','access'),'access.requestEntry':('access','action','access'),
 'visit.register':('receive','action','access'),'visit.link':('receive','action','access'),'visit.checkin':('receive','action','access'),
 'identity.associate':('receive','action','identity'),
 'notification.send':('receive','action','notification'),
 'meeting.start':('receive','action','booking'),'meeting.end':('receive','action','booking'),
 'task.create':('operate','action','operations'),'task.assign':('operate','action','operations'),'task.resolve':('operate','action','operations'),
 'equipment.fail':('operate','action','operations'),'equipment.repair':('operate','action','operations'),
 'zone.close':('operate','action','operations'), 'zone.open':('operate','action','operations'),
 'camera.setStatus':('access','action','cctv'),
 'clock.advance':('simulate','action','simulation'),
 'sensor.read':('read','read','sensor'),'camera.getObservations':('read','read','cctv'),'camera.getStream':('read','read','cctv'),
 'resource.getObject':('read','read','resource'),'booking.getAvailability':('read','read','booking'),
}


def declare(db,site,resource):
    row=db.execute('SELECT kind,attributes FROM office_resources WHERE site=? AND id=?',(site,resource)).fetchone();kind=row['kind'];attributes=json.loads(row['attributes'])
    kinds={
      'device.setPower':{'HVAC','Light','Equipment'},'presence.checkout':{'Person'},'reception.interact':{'Kiosk'},'intercom.reply':{'Intercom'},'intercom.timeout':{'Intercom'},
      'entity.upsert':{'Site'},'relation.add':{'Site'},'account.create':{'Site'},'clock.advance':{'Site'},'visit.register':{'Site'},'task.create':{'Site'},
      'membership.set':{'Person'},'identity.associate':{'Track'},'notification.send':{'Person'},
      'booking.create':{'Desk','Room','Office','EventSpace'},'booking.getAvailability':{'Desk','Room','Office','EventSpace'},
      'access.checkAuthorization':{'AccessPoint'},'access.requestEntry':{'AccessPoint'},
      'visit.link':{'Visit'},'visit.checkin':{'Visit'},'camera.setStatus':{'Camera'},
      'sensor.read':{'Sensor','HVAC','Equipment'},'camera.getObservations':{'Camera'},'camera.getStream':{'Camera'},
      'zone.assumeOccupancy':{'Zone'},'zone.close':{'Zone'},'zone.open':{'Zone'},'equipment.fail':{'HVAC','Equipment','Light'},'equipment.repair':{'HVAC','Equipment','Light'},
      'task.assign':{'Task'},'task.resolve':{'Task'},'meeting.start':{'Meeting'},'meeting.end':{'Meeting'}
    }
    for operation,(permission,modality,category) in OPERATIONS.items():
        allowed=kinds.get(operation,{'Booking'} if operation.startswith('booking.') else {kind})
        if kind not in allowed:continue
        cid=identity('capability',site,resource,operation,'1.0')
        descriptor=CapabilityDescriptor(capability_id=cid,canonical_id=operation,resource_id=resource,category=category,modality=modality,
          input_schema=INPUTS[operation].model_json_schema(),output_schema=NormalizedResult.model_json_schema(),units=({'temperature':'C','co2':'ppm','power':'W'} if operation=='sensor.read' else {}),semantics='ENTITY coworking '+operation,
          permission=permission,availability='unavailable'if attributes.get('declaration_only')and operation not in ['entity.remember','resource.getObject']else'available',provenance={'source':'office-domain-catalog','simulated_provider':True})
        db.execute('INSERT INTO office_capabilities VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET descriptor=excluded.descriptor',(cid,site,resource,operation,descriptor.model_dump_json(),'simulated'))
