// P1 reusable authenticated Office API client. No world model, fixtures or credential storage.
export class OfficeCoreClient {
 constructor(){this.epoch=0;this.world=null;this.token=null;this.sequence=0;}
 async request(path,body){const epoch=this.epoch,response=await fetch(this.base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(this.token?{Authorization:'Bearer '+this.token}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(10000),cache:'no-store'}),value=await response.json();if(epoch!==this.epoch)throw Error('Sesión cambiada');if(!response.ok)throw Error('Core HTTP '+response.status+': '+JSON.stringify(value.detail));return value;}
 async connect(base,username,password){this.disconnect();const url=new URL(base);if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw Error('URL de API inválida');this.base=url.href.replace(/\/$/,'');const auth=await this.request('/v1/office/auth/login',{username,password});this.token=auth.token;this.site=auth.site_id;this.role=auth.role;await this.refresh();return this.world;}
 disconnect(){this.epoch++;this.token=null;this.world=null;this.site=null;this.run=null;}
 prefix(){return '/v1/sites/'+encodeURIComponent(this.site)+'/runs/'+encodeURIComponent(this.run);}
 async refresh(){if(!this.token)throw Error('Sin sesión Core');const seq=++this.sequence,active=await this.request('/v1/sites/'+encodeURIComponent(this.site)+'/active-run'),run=active.id;const w=await this.request('/v1/sites/'+encodeURIComponent(this.site)+'/runs/'+encodeURIComponent(run)+'/world');if(seq!==this.sequence)throw Error('Respuesta anterior descartada');this.run=run;this.world=w;return w;}
 query(kind,id){return this.request(this.prefix()+'/queries',{kind,entity_id:id});}
 async command(operation,target,inputs){if(!this.world)throw Error('Sin estado Core');const result=await this.request(this.prefix()+'/commands',{id:crypto.randomUUID(),operation,target,inputs,expected_revision:this.world.revision});await this.refresh();return result;}
 async logout(){const base=this.base,token=this.token;this.disconnect();if(token){const response=await fetch(base+'/v1/office/auth/logout',{method:'POST',headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Core HTTP '+response.status+' al revocar sesión');}}
}
