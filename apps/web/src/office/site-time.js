// Display and resolve the site's civil time; Core remains the only simulation clock.
function parts(iso,timezone){return Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(iso)).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));}
export function siteWallTime(iso,timezone){const p=parts(iso,timezone);return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute+':'+p.second;}
export function siteDateTimeToUtc(value,timezone){
 const match=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value);if(!match)throw Error('Fecha y hora local inválidas.');
 const [year,month,day,hour,minute,second]=match.slice(1,7).map(v=>Number(v||0)),millisecond=Number((match[7]||'').padEnd(3,'0')||0);
 const target=Date.UTC(year,month-1,day,hour,minute,second,millisecond),date=new Date(target);if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day||date.getUTCHours()!==hour||date.getUTCMinutes()!==minute||date.getUTCSeconds()!==second)throw Error('Fecha y hora local inválidas.');let candidate=target;
 const wall=stamp=>{const p=parts(stamp,timezone);return Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second,new Date(stamp).getUTCMilliseconds());};
 for(let i=0;i<4;i++)candidate-=wall(candidate)-target;
 if(wall(candidate)!==target)throw Error('Esta hora local no existe en la zona horaria de la sede.');
 for(const delta of [-7200000,-3600000,-1800000,1800000,3600000,7200000])if(wall(candidate+delta)===target)throw Error('Hora local ambigua por cambio horario; selecciona otro instante.');
 return new Date(candidate).toISOString();
}
export function atSiteHour(clock,time,timezone){return siteDateTimeToUtc(siteWallTime(clock,timezone).slice(0,10)+'T'+time,timezone);}
