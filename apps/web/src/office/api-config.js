// The public API URL is shared between clients. Credentials stay in memory only.
export function rememberApi(value){
 const url=new URL(value.trim());
 if(!['http:','https:'].includes(url.protocol)||url.username||url.password)throw Error('Introduce una URL HTTP/HTTPS de API sin credenciales.');
 const base=url.href.replace(/\/$/,'');localStorage.setItem('entity-office-api',base);return base;
}
export function configuredApi(){
 const saved=localStorage.getItem('entity-office-api')||import.meta.env.VITE_ENTITY_API_URL;
 if(saved)return saved;
 return ['127.0.0.1','localhost','[::1]'].includes(location.hostname)?'http://127.0.0.1:8010':'';
}
