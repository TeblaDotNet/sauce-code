import {readFile,writeFile,mkdir,cp,readdir} from 'node:fs/promises';
import {resolve,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {loadVocabulary} from '../src/vocabulary/node.ts';

const root=fileURLToPath(new URL('../',import.meta.url));
const targets=['windows-x64','linux-x64','linux-arm64','darwin-x64','darwin-arm64'];
const requested=process.argv.slice(2);
if(!requested.length)requested.push('windows-x64');
if(requested.some(t=>!targets.includes(t)))throw Error('Targets: '+targets.join(', '));
const compiler=process.env.OSF_BUN??'bun';
function command(exe:string,args:string[],cwd=root){
 const r=spawnSync(exe,args,{cwd,encoding:'utf8',windowsHide:true,maxBuffer:16*1024*1024});
 if(r.error||r.status!==0)throw Error(`${exe}: ${r.error?.message??r.stderr??r.stdout}`);
 return r.stdout.trim();
}
const compilerVersion=command(compiler,['--version']);
if(compilerVersion!=='1.4.4')throw Error('Use the validated Bun 1.4.4 compiler (OSF_BUN may name its executable).');
const compilerRevision=command(compiler,['--revision']);
const hash=(data:string|Buffer)=>createHash('sha256').update(data).digest('hex');
const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
const vocabulary=await loadVocabulary(join(root,'knowledge'));
const snapshot={version:pkg.version,entries:vocabulary.entries,resources:vocabulary.resources,enrichments:vocabulary.enrichments};
const generated=join(root,'work/standalone-generated');await mkdir(generated,{recursive:true});
const snapshotText=JSON.stringify(snapshot)+'\n';await writeFile(join(generated,'knowledge.json'),snapshotText);
// This adapter imports the same command implementation and portable Vocabulary constructor.
// There are no Bun APIs, file lookups or network requests in the embedded knowledge loader.
await writeFile(join(generated,'entry.js'),`import {runCli,reportCliError} from '../../src/cli/run.ts';
import {Vocabulary} from '../../src/vocabulary/index.ts';
import snapshot from './knowledge.json';
runCli(process.argv.slice(2),{version:async()=>snapshot.version,loadVocabulary:async()=>new Vocabulary(snapshot.entries,snapshot)}).catch(reportCliError);
`);
const sourceFiles:Record<string,string>={};
async function inventory(dir:string){for(const e of (await readdir(join(root,dir),{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
 if(e.isSymbolicLink())throw Error('Source symlink: '+dir+'/'+e.name);
 const p=dir+'/'+e.name;if(e.isDirectory())await inventory(p);else sourceFiles[p]=hash(await readFile(join(root,p)));
}}
for(const dir of ['src','knowledge','LICENSES'])await inventory(dir);
for(const file of ['package.json','pnpm-lock.yaml','tsconfig.json','tools/build-standalone.ts','LICENSE','LICENSING.md'])sourceFiles[file]=hash(await readFile(join(root,file)));
const gitRevision=command('git',['rev-parse','HEAD']);
const dirty=command('git',['status','--porcelain','--untracked-files=no'])!=='';
for(const target of [...new Set(requested)]){
 const output=join(root,'standalone',target);await mkdir(output,{recursive:true});
 const executable=target.startsWith('windows-')?'opensauce.exe':'opensauce';
 const script=`const result=await Bun.build({entrypoints:[${JSON.stringify(join(generated,'entry.js'))}],compile:{target:${JSON.stringify('bun-'+target)},outfile:${JSON.stringify(join(output,executable))},autoloadDotenv:false,autoloadBunfig:false,autoloadTsconfig:false,autoloadPackageJson:false},minify:true});if(!result.success){console.error(result.logs);process.exit(1);}`;
 await writeFile(join(generated,'compile.js'),script);
 console.log(command(compiler,['--no-env-file',join(generated,'compile.js')]));
 for(const file of ['LICENSE','LICENSING.md'])await cp(join(root,file),join(output,file));
 await cp(join(root,'LICENSES'),join(output,'LICENSES'),{recursive:true});
 await writeFile(join(output,'THIRD-PARTY-NOTICES.txt'),'Includes the Bun 1.4.4 runtime. Its licence, linked-library notices and relinking instructions are in LICENSES/Bun-1.4.4.md. Core knowledge retains its layered terms in LICENSING.md. The embedded snapshot contains knowledge metadata and source/credit links, not third-party photographs. No YAML parser, compiler, test fixtures or repository checkout is required at runtime.\n');
 const bytes=await readFile(join(output,executable));
 const manifest={schema:1,package:pkg.name,version:pkg.version,core_revision:gitRevision,tracked_changes:dirty,source_sha256:sourceFiles,compiler:{name:'Bun',version:compilerVersion,revision:compilerRevision},build_host:{platform:process.platform,arch:process.arch,node:process.version},target:'bun-'+target,dependencies:{yaml:JSON.parse(await readFile(join(root,'node_modules/yaml/package.json'),'utf8')).version},knowledge:{entries:vocabulary.entries.length,resources:vocabulary.resources.length,enrichments:vocabulary.enrichments.length,snapshot_sha256:hash(snapshotText)},executable:{file:executable,bytes:bytes.length,sha256:hash(bytes)},validation:'Compilation only; execution/parity results are recorded separately.'};
 await writeFile(join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 const files:Record<string,{bytes:number;sha256:string}>={};
 async function scan(dir:string){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await scan(p);else if(e.name!=='inventory.json'){const b=await readFile(p);files[relative(output,p).replaceAll('\\','/')]={bytes:b.length,sha256:hash(b)};}}}
 await scan(output);
 const allowed=new Set([executable,'manifest.json','LICENSE','LICENSING.md','THIRD-PARTY-NOTICES.txt',...(await readdir(join(root,'LICENSES'))).map(f=>'LICENSES/'+f)]);
 for(const file of Object.keys(files))if(!allowed.has(file))throw Error('Unexpected distribution file: '+file);
 if(bytes.includes(Buffer.from(root))||bytes.includes(Buffer.from(root.replaceAll('\\','/'))))throw Error('Build contains an absolute source checkout path');
 await writeFile(join(output,'inventory.json'),JSON.stringify(files,null,2)+'\n');
 console.log(JSON.stringify({target,executable:resolve(output,executable),bytes:bytes.length,sha256:hash(bytes),core_revision:gitRevision,tracked_changes:dirty}));
}
