// Read authorized Actions REST metadata/logs; publish only bounded redacted failure summaries.
import fs from 'node:fs';
const repository=process.env.GITHUB_REPOSITORY,run=process.env.INSPECT_RUN||'42421775240';
const headers={Authorization:'Bearer '+process.env.GH_TOKEN,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
async function get(path){const response=await fetch('https://api.github.com/repos/'+repository+path,{headers});if(!response.ok)throw Error('Actions REST '+response.status);return response;}
const metadata=await(await get('/actions/runs/'+run)).json();const jobs=(await(await get('/actions/runs/'+run+'/jobs?per_page=100')).json()).jobs;
const report={inspected_run:'https://github.com/'+repository+'/actions/runs/'+run,tested_commit:metadata.head_sha,status:metadata.status,conclusion:metadata.conclusion,jobs:[]};
for(const job of jobs){
 const item={name:job.name,status:job.status,conclusion:job.conclusion,failed_steps:job.steps.filter(s=>s.conclusion==='failure').map(s=>s.name)};
 if(item.failed_steps.length){
  const log=await(await get('/actions/jobs/'+job.id+'/logs')).text();
  item.failure_summary=log.split('\n').filter(line=>/AssertionError|Error:|FAILED|FAIL:|ERROR:|Expected:|Received:|Timeout|waiting|verify-reception|Process completed with exit/i.test(line)&&!(/password|credential|secret|Bearer|token/i.test(line))).slice(-25).map(line=>line.replace(/[A-Za-z0-9_\-]{20,}/g,'[redacted]').slice(0,500));
 }
 report.jobs.push(item);
}
fs.writeFileSync('docs/evidence/phase09/ci-diagnostic.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
