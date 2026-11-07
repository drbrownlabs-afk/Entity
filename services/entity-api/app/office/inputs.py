"""Typed public inputs for declared capabilities; no arbitrary vendor payloads in Core."""
from typing import Literal
from pydantic import create_model,Field,AwareDatetime
from app.schemas import CoreRecord,NonBlank

def typed(model_name,**fields):return create_model(model_name,__base__=CoreRecord,**fields)
Empty=typed('NoInputs')
S=NonBlank
T=AwareDatetime
INPUTS={
 'zone.assumeOccupancy':typed('HypotheticalOccupancy',count=(int,Field(ge=0,le=1000))),
 'device.setPower':typed('DevicePower',on=(bool,...)),
 'presence.checkout':Empty,
 'reception.interact':typed('ReceptionInteract',conversation_id=(S,...),action=(Literal['start','check_in','status'],...),invitation_id=(str|None,None),verification_code=(str|None,Field(default=None,max_length=128))),
 'intercom.reply':typed('IntercomReply',conversation_id=(S,...),response=(Literal['ready','wait','unavailable'],...),minutes=(int,Field(default=5,ge=1,le=30))),
 'intercom.timeout':typed('IntercomTimeout',conversation_id=(S,...)),
 'entity.upsert':typed('ResourceUpsert',id=(S,...),kind=(S,...),attributes=(dict,Field(default_factory=dict))),
 'relation.add':typed('RelationAdd',source=(S,...),target=(S,...),type=(S,...),valid_to=(T|None,None)),
 'membership.set':typed('MembershipChange',status=(S,...),until=(T,...)),
 'account.create':typed('AccountCreate',username=(S,...),password=(str,Field(min_length=12,max_length=1024)),role=(S,...),person=(str|None,None)),
 'booking.create':typed('BookingCreate',booking_id=(S,...),person_id=(S,...),starts_at=(T,...),ends_at=(T,...),party_size=(int,Field(default=1,ge=1,le=1000)),meeting_id=(str|None,None),expected_guests=(list[dict],Field(default_factory=list))),
 'booking.cancel':Empty,
 'booking.reassign':typed('BookingReassign',resource_id=(S,...)),
 'booking.extend':typed('BookingExtend',ends_at=(T,...)),
 'booking.checkin':Empty,'booking.no_show':Empty,
 'access.checkAuthorization':typed('AccessCheck',person_id=(str|None,None),visit_id=(str|None,None),escorted=(bool,False)),
 'access.requestEntry':typed('AccessRequest',person_id=(str|None,None),visit_id=(str|None,None),escorted=(bool,False)),
 'visit.register':typed('VisitRegister',visit_id=(S,...),meeting_id=(S,...),track_id=(S,...),statement=(str,Field(default='',max_length=2000))),
 'visit.link':typed('VisitLink',meeting_id=(S,...)),
 'visit.checkin':typed('VisitCheckIn',waiting_area=(S,...)),
 'identity.associate':typed('IdentityEvidence',person_id=(S,...),credential_verified=(bool,...),evidence_type=(S,...)),
 'notification.send':typed('Notify',message=(str,Field(min_length=1,max_length=2000))),
 'meeting.start':typed('MeetingStart',participants=(list[str],Field(default_factory=list))),
 'meeting.end':Empty,
 'task.create':typed('TaskCreate',task_id=(S,...),resource_id=(S,...),description=(str,Field(min_length=1,max_length=2000))),
 'task.assign':typed('TaskAssign',person_id=(S,...)),
 'task.resolve':typed('TaskResolve',resolution=(str,Field(min_length=1,max_length=2000))),
 'equipment.fail':Empty,'equipment.repair':Empty,'zone.close':Empty,'zone.open':Empty,
 'camera.setStatus':typed('CameraStatus',status=(S,...)),
 'clock.advance':typed('AdvanceClock',to=(T,...)),
 'sensor.read':typed('SensorRead',name=(S,...),value=(float,...),unit=(S,...)),
 'camera.getObservations':Empty,'camera.getStream':Empty,'resource.getObject':Empty,
 'booking.getAvailability':typed('Availability',starts_at=(T,...),ends_at=(T,...)),
}
