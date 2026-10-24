import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync,linkSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root=fileURLToPath(new URL('../',import.meta.url));
const executable=resolve(process.argv[2]??join(root,'standalone/windows-x64/opensauce.exe'));
const external=mkdtempSync(join(tmpdir(),'opensauce standalone isolated '));
const emptyPath=join(external,'empty path');mkdirSync(emptyPath);
const isolatedExe=join(external,process.platform==='win32'?'opensauce.exe':'opensauce');copyFileSync(executable,isolatedExe);
const env:NodeJS.ProcessEnv={PATH:emptyPath,HOME:external,USERPROFILE:external,TEMP:external,TMP:external};
for(const key of ['SystemRoot','WINDIR','ComSpec'])if(process.env[key])env[key]=process.env[key];
for(const command of ['node','bun','npm','pnpm'])assert.ok(spawnSync(command,['--version'],{cwd:external,env}).error,command+' unexpectedly available');
assert.ok(!existsSync(join(external,'node_modules'))&&!existsSync(join(external,'knowledge'))&&!existsSync(join(external,'src')));
// Compiled adapters must not auto-load nearby Bun configuration or dotenv files.
writeFileSync(join(external,'bunfig.toml'),'preload = ["./must-not-be-loaded.js"]\n');
writeFileSync(join(external,'.env'),'NODE_OPTIONS=--invalid-standalone-test-option\n');
const cli=join(root,'dist/cli.js');assert.ok(existsSync(cli),'Run pnpm build first');
const cases:{args:string[];status:number;stdout_sha256:string;stderr_sha256:string}[]=[];
const mismatches:string[]=[];
const hash=(s:Buffer)=>createHash('sha256').update(s).digest('hex');
function compare(args:string[],output?:string){
 const options={cwd:external,env,timeout:30000,maxBuffer:16*1024*1024,windowsHide:true};
 const node=spawnSync(process.execPath,[cli,...args],options);const nodeFile=output&&node.status===0?readFileSync(join(external,output)):undefined;
 const standalone=spawnSync(isolatedExe,args,options);const standaloneFile=output&&standalone.status===0?readFileSync(join(external,output)):undefined;
 if(node.error||standalone.error||node.status!==standalone.status||!node.stdout.equals(standalone.stdout)||!node.stderr.equals(standalone.stderr)||(nodeFile&&!nodeFile.equals(standaloneFile!)))mismatches.push(JSON.stringify({args,node:{status:node.status,error:node.error?.message,stdout:node.stdout.toString(),stderr:node.stderr.toString()},standalone:{status:standalone.status,error:standalone.error?.message,stdout:standalone.stdout.toString(),stderr:standalone.stderr.toString()}}));
 cases.push({args,status:standalone.status??-1,stdout_sha256:hash(standalone.stdout),stderr_sha256:hash(standalone.stderr)});
 return standalone;
}
compare(['--help']);compare(['--version']);
const fixtures=[{name:'bread with spaces.opensauce',bytes:readFileSync(join(root,'tests/fixtures/no-knead-bread.opensauce'))},
 {name:'crème 日本語.opensauce',bytes:Buffer.from('::recipe\nname: Crème brûlée 日本語\nservings: 6\n::ingredients\n(flour) ~250g\n(water) 2 cups\n(egg: yolk) 2\n::instructions\n{pâte} = (flour) + (water)\n{pâte} <mix>\n{pâte} <bake, 180c>\n') }];
if(process.env.OSF_CORPUS){const corpus=resolve(process.env.OSF_CORPUS);for(const id of ['desert-roses','ravioli','mayonnaise-or-aioli','hakka-style-meatballs','no-knead-bread'])fixtures.push({name:id+'.opensauce',bytes:readFileSync(join(corpus,'examples/public-domain-recipes',id,id+'.opensauce'))});fixtures.push({name:'cointreau-margarita.opensauce',bytes:readFileSync(join(corpus,'examples/cocktail-specs/cointreau-margarita/cointreau-margarita.opensauce'))});}
for(const fixture of fixtures){
 writeFileSync(join(external,fixture.name),fixture.bytes);compare(['check',fixture.name]);
 for(const format of ['compact','code','html']){
  const result=compare(['render',fixture.name,'--format',format]);assert.equal(result.status,0,result.stderr.toString());
  compare(['render',fixture.name,'--format',format,'--no-knowledge']);
  const output='output '+format+'.txt';writeFileSync(join(external,output),'old output that must be replaced');
  compare(['render',fixture.name,'--format',format,'--output',output],output);
 }
 assert.deepEqual(readFileSync(join(external,fixture.name)),fixture.bytes);
}
writeFileSync(join(external,'invalid.opensauce'),'::instructions\n(flour\n');
for(const args of [[],['unknown'],['check'],['check','missing.opensauce'],['check','.'],['check','invalid.opensauce'],['render','invalid.opensauce','--format','html'],['render',fixtures[0].name],['render',fixtures[0].name,'--format','pdf'],['check',fixtures[0].name,'--oops'],['render',fixtures[0].name,'--format'],['check',fixtures[0].name,'--output','out'],['render',fixtures[0].name,'--format','code','--servings','12'],['render',fixtures[0].name,'--format','html','--output','absent/output.html'],['render',fixtures[0].name,'--format','html','--output',fixtures[0].name]])assert.equal(compare(args).status,1);
linkSync(join(external,fixtures[0].name),join(external,'alias.opensauce'));assert.equal(compare(['render',fixtures[0].name,'--format','html','--output','alias.opensauce']).status,1);
assert.deepEqual(readFileSync(join(external,fixtures[0].name)),fixtures[0].bytes);
const receipt={platform:process.platform,arch:process.arch,executable_sha256:hash(readFileSync(isolatedExe)),runtime_path:'empty directory; Node/Bun/npm/pnpm command discovery failed as required',isolated_contents:readdirSync(external),cases:cases.length,fixtures:fixtures.map(f=>({name:f.name,sha256:hash(f.bytes)})),byte_for_byte_parity:mismatches.length===0,mismatches,results:cases,limitations:'Fresh external directory and restricted environment on the Windows host, not a fresh VM. Scaling/conversion/reference APIs are library operations, not CLI commands.'};
writeFileSync(join(external,'parity-results.json'),JSON.stringify(receipt,null,2)+'\n');
mkdirSync(join(root,'work/standalone-evidence'),{recursive:true});
writeFileSync(join(root,'work/standalone-evidence/parity-results.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({external,cases:cases.length,parity:mismatches.length?'FAILED':'passed',receipt:join(external,'parity-results.json')}));
assert.deepEqual(mismatches,[],'Node/standalone discrepancy; inspect retained receipt');
