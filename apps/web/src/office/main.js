const params=new URLSearchParams(location.search);
if(params.has('diagnostic')||params.has('survey')||params.get('projection')==='personal')await import('./diagnostic.js');
else await import('./experience.js');
