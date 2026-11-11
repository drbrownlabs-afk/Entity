// Reuse the frozen capture test verbatim, relocating only outputs and browser.
// No historical script, calibration, camera ID, assertion or actor protocol is edited.
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {execFileSync,spawn} from 'node:child_process';
import path from 'node:path';

const root=fileURLToPath(new URL('../../../',import.meta.url));
const run=process.env.P2_LOCAL_RUN;
if(!run||!/^[a-z0-9][a-z0-9_-]{0,63}$/.test(run))throw Error('Set a new P2_LOCAL_RUN (lowercase letters, numbers, hyphen or underscore)');
const sourcePath='apps/spatial-simulation/tests/perception-sequence.mjs';
const expected='1d2e470a297eb86cfff6dc044994433a848828ab';
const actual=execFileSync('git',['hash-object','--path='+sourcePath,sourcePath],{cwd:root,encoding:'utf8'}).trim();
if(actual!==expected)throw Error('Frozen capture source changed: review before replay');
let source=await readFile(path.join(root,sourcePath),'utf8');
const browser=process.env.P2_CHROMIUM;
if(!browser)throw Error('Set P2_CHROMIUM to a verified local Chromium executable');
await access(browser);
const replacements=[
 ["new URL('../../../',import.meta.url)",`new URL(${JSON.stringify(new URL('../../../',import.meta.url).href)})`],
 ['simulation/spatial-office/.runtime/p2-09-frames/',`simulation/spatial-office/.runtime/local-${run}-frames/`],
 ['simulation/spatial-office/.runtime/p2-09-evaluation/',`simulation/spatial-office/.runtime/local-${run}-evaluation/`],
 ['docs/spatial-simulation/evidence/p2-09/09.4/',`docs/spatial-simulation/evidence/p2-09/09.11/${run}/capture/`],
 ["executablePath:'/usr/bin/chromium'",`executablePath:${JSON.stringify(browser)}`],
];
for(const [from,to]of replacements){
 if(source.split(from).length!==2)throw Error('Capture relocation is ambiguous: '+from);
 source=source.replace(from,to);
}
const evidence=path.join(root,`docs/spatial-simulation/evidence/p2-09/09.11/${run}/capture`);
try{await access(evidence);throw Error('Run already exists; choose a new P2_LOCAL_RUN');}
catch(e){if(e.code!=='ENOENT')throw e;}
const staging=path.join(root,'apps/spatial-simulation/.runtime');
await mkdir(staging,{recursive:true});
const staged=path.join(staging,`capture-${run}.mjs`);
await writeFile(staged,source);
const child=spawn(process.execPath,[staged],{cwd:root,stdio:'inherit',env:process.env});
child.on('error',e=>{console.error(e.message);process.exitCode=1;});
child.on('exit',(code,signal)=>{process.exitCode=code??1;if(signal)console.error('Capture interrupted:',signal);});
