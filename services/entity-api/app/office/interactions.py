"""One contextual reception/intercom workflow over the persistent ENTITY graph."""
import hashlib,secrets,hmac,json
from datetime import datetime,timedelta
from fastapi import HTTPException
from .storage import identity,utc
from .graph import targets

def credential_hash(code,salt):return hashlib.pbkdf2_hmac('sha256',code.encode(),bytes.fromhex(salt),600000).hex()
def issue_credential(db,site,invitation,person,code,expires):
    salt=secrets.token_hex(16)
    db.execute('INSERT INTO office_credentials VALUES(?,?,?,?,?,?,?,NULL) ON CONFLICT(site,invitation) DO UPDATE SET person=excluded.person,salt=excluded.salt,code_hash=excluded.code_hash,expires_at=excluded.expires_at,used_by=NULL',
      (site,invitation,person,salt,credential_hash(code,salt),utc(expires),'authorized-synthetic-invitation'))

def plan(db,site,run,actor,items,clock,op,target,data,cid,get,add):
    changes={};details={};evidence=[]
    def device(key,kind):
        d=get(key)
        if d['kind']!=kind:raise HTTPException(422,'Wrong interface type')
        if d.get('connectivity')!='connected':raise HTTPException(503,'Interface disconnected')
        return d
    def change(key,**patch):changes[key]={**changes.get(key,{}),**patch}
    def message(conversation,text,**patch):
        change(conversation['id'],message=text,message_at=clock,**patch)
    if op=='reception.interact':
        kiosk=device(target,'Kiosk')
        if actor['role']=='kiosk' and actor['person']!=target:raise HTTPException(403,'Kiosk bound to another terminal')
        key=data['conversation_id'];action=data['action']
        if action=='start':
            invitation=get(data['invitation_id'])
            if invitation['kind']!='Invitation':raise HTTPException(422,'Invitation required')
            meeting=get(invitation['meeting_id'])
            if meeting['status']!='scheduled':raise HTTPException(409,'Meeting not available for reception')
            if not datetime.fromisoformat(meeting['starts_at'])-timedelta(hours=1)<=datetime.fromisoformat(clock)<datetime.fromisoformat(meeting['ends_at']):raise HTTPException(409,'Outside reception window')
            conversation=add(key,'Conversation',{'kiosk_id':target,'invitation_id':invitation['id'],'meeting_id':meeting['id'],'status':'verification_required',
                'message':'Confirma tu invitación con el código autorizado. Una declaración verbal no confirma identidad.','message_at':clock,'identity_status':'unverified','operator_org_id':kiosk.get('operator_org_id'),'simulated':True})
            changes[key]=conversation
            details['reply']={k:conversation.get(k) for k in ['id','status','message','identity_status']}
        else:
            conversation=get(key)
            if conversation.get('kind')!='Conversation' or conversation.get('kiosk_id')!=target:raise HTTPException(403,'Conversation belongs to another terminal')
            if action=='status':
                details['reply']={k:conversation.get(k) for k in ['id','status','message','identity_status','retry_at']}
                return changes,details,evidence
            if conversation['status']!='verification_required':raise HTTPException(409,'Conversation already checked in')
            invitation=get(conversation['invitation_id']);meeting=get(invitation['meeting_id'])
            if meeting['status']!='scheduled' or clock>=meeting['ends_at']:raise HTTPException(409,'Meeting no longer available')
            credential=db.execute('SELECT * FROM office_credentials WHERE site=? AND invitation=?',(site,invitation['id'])).fetchone()
            if not credential or credential['expires_at']<=clock or credential['used_by'] or not hmac.compare_digest(credential_hash(data.get('verification_code',''),credential['salt']),credential['code_hash']):raise HTTPException(403,'Identity verification failed; contact authorized Cowork staff')
            person=get(credential['person']) if credential['person'] else None
            waiting=get(kiosk.get('waiting_area'))
            if waiting.get('kind')!='WaitingArea':raise HTTPException(422,'Configure kiosk waiting area')
            count=sum(x.get('kind')=='Visit' and x.get('waiting_area')==waiting['id'] and x.get('status')=='waiting' for x in items.values())
            if count>=waiting.get('capacity',1):raise HTTPException(409,'Waiting area full')
            visit_id='visit-'+identity(site,key)
            visit=add(visit_id,'Visit',{'meeting_id':meeting['id'],'invitation_id':invitation['id'],'person_id':person['id'] if person else None,
                'status':'waiting','identity_status':'verified-invitation','verification_source':credential['source'],'registered_at':clock,'waiting_area':waiting['id'],'access':'waiting_only'})
            changes[visit_id]=visit
            db.execute('UPDATE office_credentials SET used_by=? WHERE site=? AND invitation=?',(key,site,invitation['id']))
            host=get(meeting['host_id']);organization_ids=targets(items,host['id'],'belongsTo',clock)
            candidates=[]
            for organization in organization_ids:
                for terminal in targets(items,organization,'communicatesThrough',clock):
                    d=get(terminal)
                    if d['kind']=='Intercom' and d.get('privacy')=='private-addressed' and d.get('connectivity')=='connected' and d.get('zone_id')==host.get('zone_id') and host.get('presence')=='confirmed' and host.get('freshness')=='fresh':candidates.append(d)
            changes[key]={'visit_id':visit_id,'person_id':person['id'] if person else None,'host_id':host['id'],'identity_status':'verified-invitation','status':'awaiting_host','contacted_at':clock}
            if candidates:
                channel=candidates[0];name=person.get('name') if person else 'Tu visitante'
                text=host.get('name','Anfitrión')+', '+name+' está aquí para la reunión. ¿Estás listo?'
                notice=add('notification-'+cid,'Notification',{'recipient':host['id'],'message':text,'channel_id':channel['id'],'privacy':'private-addressed','status':'delivered','simulated':True,'conversation_id':key,'sent_at':clock})
                from .personal_app import setup as setup_personal
                setup_personal(db)
                for account in db.execute('SELECT username FROM office_accounts WHERE site=? AND person=? AND enabled=1',(site,host['id'])).fetchall():
                    mid=identity(site,notice['id'],account['username'])
                    db.execute('INSERT INTO office_personal_messages VALUES(?,?,?,?,?,?,?,?,?,?)',(mid,site,account['username'],name,meeting['starts_at'],meeting.get('name','Reunión'), 'pending',None,clock,None))
                    db.execute('INSERT INTO office_personal_links VALUES(?,?,?,?,?)',(mid,site,run,key,channel['id']))
                changes[notice['id']]=notice;change(key,channel_id=channel['id'],message='Identidad verificada. Estoy contactando al anfitrión por su canal privado.',message_at=clock)
                change(channel['id'],last_message=text,last_recipient=host['id'],last_contact_at=clock,conversation_id=key)
                details['routing']={'host_id':host['id'],'channel_id':channel['id'],'basis':'Meeting.hostedBy → Person.belongsTo → Organization.communicatesThrough; fresh observed presence','public_announcement':False}
            else:
                change(key,status='staff_fallback',message='Llegada registrada. No puedo confirmar un canal privado y la presencia del anfitrión; solicité apoyo a Cowork.',message_at=clock)
                task=add('task-'+cid,'Task',{'description':'Verificar llegada de anfitrión sin difundir datos personales','status':'open','organization_id':conversation.get('operator_org_id'),'conversation_id':key})
                changes[task['id']]=task
            details['reply']={**{k:changes[key].get(k) for k in ['status','message','identity_status']},'id':key}
            evidence=[invitation['id'],meeting['id']]
    else:
        terminal=device(target,'Intercom');conversation=get(data['conversation_id'])
        if conversation.get('kind')!='Conversation' or conversation.get('channel_id')!=target:raise HTTPException(403,'Conversation routed to another channel')
        if conversation['status'] not in ['awaiting_host','waiting_host']:raise HTTPException(409,'No pending host response')
        host=get(conversation['host_id']);meeting=get(conversation['meeting_id'])
        if op=='intercom.reply':
            if actor.get('person')!=host['id']:raise HTTPException(403,'Only the addressed host may respond')
            if actor.get('channel')!='personal-web' and (host.get('freshness')!='fresh' or host.get('presence')!='confirmed' or host.get('zone_id')!=terminal.get('zone_id')):raise HTTPException(409,'Host presence at terminal not confirmed')
            if meeting['status']=='cancelled' or clock>=meeting['ends_at']:raise HTTPException(409,'Meeting no longer available')
            answer=data['response']
            if answer=='ready':
                message(conversation,host.get('name','El anfitrión')+' confirmó que está listo. Tu autorización se limita a esta reunión.',status='host_ready')
                change(conversation['visit_id'],status='host_ready',access='authorized_meeting_only',host_approved_at=clock)
            elif answer=='wait':
                retry=(datetime.fromisoformat(clock)+timedelta(minutes=data.get('minutes',5))).isoformat()
                message(conversation,host.get('name','El anfitrión')+' solicita '+str(data.get('minutes',5))+' minutos. Puedes esperar aquí.',status='waiting_host',retry_at=retry)
                change(conversation['visit_id'],status='waiting',access='waiting_only')
            else:message(conversation,'El anfitrión indicó que no está disponible. Cowork te ayudará.',status='staff_fallback')
            origin='authenticated-personal-client' if actor.get('channel')=='personal-web' else 'synthetic-character' if actor['actor'].startswith('synthetic-character:') else 'authenticated-intercom-client'
            change(conversation['id'],last_reply_origin=origin,host_reply_at=clock)
            details['host_response']={'response':answer,'person_id':host['id'],'at':clock,
                'response_origin':'authenticated-personal-client' if actor.get('channel')=='personal-web' else 'synthetic-character' if actor['actor'].startswith('synthetic-character:') else 'authenticated-intercom-client',
                'physical_presence_inferred_from_reply':False,'world_is_simulated':True}
        elif op=='intercom.timeout':
            if datetime.fromisoformat(clock)-datetime.fromisoformat(conversation['contacted_at'])<timedelta(seconds=60):raise HTTPException(409,'Response window has not elapsed')
            message(conversation,'Sin respuesta confirmada del anfitrión. Cowork recibirá la solicitud.',status='staff_fallback')
        if changes[conversation['id']]['status']=='staff_fallback':
            task=add('task-'+cid,'Task',{'description':'Atender visita sin respuesta disponible del anfitrión','organization_id':conversation.get('operator_org_id'),'conversation_id':conversation['id'],'status':'open'});changes[task['id']]=task
        from .personal_app import setup as setup_personal
        setup_personal(db)
        response_status=changes[conversation['id']]['status']
        db.execute("UPDATE office_personal_messages SET status=?,response=?,responded_at=? WHERE id IN(SELECT message_id FROM office_personal_links WHERE site=? AND run=? AND conversation=?)",
            ('answered' if response_status=='host_ready' else 'waiting' if response_status=='waiting_host' else 'expired',
             'ready' if response_status=='host_ready' else 'five_minutes' if response_status=='waiting_host' else None,clock,site,run,conversation['id']))
        details['reply']={**changes[conversation['id']],'id':conversation['id']}
        evidence=[conversation['id'],meeting['id']]
    return changes,details,evidence
