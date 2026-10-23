import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Retain the external archive and installation for inspection.
const repo = fileURLToPath(new URL('../', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'opensauce package smoke '));
const env = { ...process.env };
delete env.NODE_PATH; delete env.NODE_OPTIONS; delete env.OSF_CORE; delete env.OSF_CORPUS;
function npm(args: string[], cwd = temp) {
  const cli = process.env.OSF_NPM_CLI;
  const windowsShell = process.platform === 'win32' && !cli;
  const command = cli ? process.execPath : windowsShell ? 'npm.cmd' : 'npm';
  const argv = cli ? [cli, ...args] : windowsShell ? args.map(a => '"' + a + '"') : args;
  const result = spawnSync(command, argv, {cwd,env,encoding:'utf8',shell:windowsShell});
  assert.equal(result.status, 0, JSON.stringify({args,error:result.error?.message,stderr:result.stderr,stdout:result.stdout}));
  return result.stdout;
}
npm(['run','build'], repo);
const packed = JSON.parse(npm(['pack','--json','--pack-destination',temp], repo))[0];
const archive = join(temp, packed.filename);
const files: string[] = packed.files.map((f: {path:string}) => f.path);
assert.ok(files.includes('dist/cli.js') && files.includes('dist/index.d.ts'));
assert.ok(files.includes('knowledge/ingredients/index.yaml'));
assert.ok(files.every(f => !/^(src|tests|tools|examples|node_modules|\.git)\//.test(f)));
writeFileSync(join(temp,'package.json'), JSON.stringify({name:'opensauce-install-smoke',private:true,type:'module'}));
npm(['install','--ignore-scripts','--omit=dev','--no-audit','--no-fund',archive]);
assert.ok(!existsSync(join(temp,'node_modules','typescript')));
const fixture = join(temp,'dinner with spaces.opensauce');
writeFileSync(fixture,readFileSync(join(repo,'tests/fixtures/no-knead-bread.opensauce')));
const bin = join(temp,'node_modules','.bin',process.platform === 'win32' ? 'opensauce.cmd' : 'opensauce');
assert.ok(existsSync(bin));
const runtimeEnv = {...env};
delete runtimeEnv.Path;
runtimeEnv.PATH = dirname(process.execPath);
function cli(args: string[]) {
  const result = process.platform === 'win32'
    ? spawnSync(process.env.ComSpec ?? 'cmd.exe',['/d','/s','/c','""' + bin + '" ' + args.map(a => '"' + a + '"').join(' ') + '"'],{cwd:temp,env:runtimeEnv,encoding:'utf8',windowsVerbatimArguments:true})
    : spawnSync(bin,args,{cwd:temp,env:runtimeEnv,encoding:'utf8'});
  assert.equal(result.status,0,result.stderr); return result.stdout;
}
assert.match(cli(['check',fixture]),/OK/);
for(const format of ['compact','code','html']) {
  const output=cli(['render',fixture,'--format',format]); assert.ok(output.length>50);
  if(format==='html') assert.match(output,/<article/);
  if(format==='code') assert.match(output,/::ingredients/);
}
assert.ok(cli(['render',fixture,'--format','compact','--no-knowledge']).length>50);
writeFileSync(join(temp,'library.mjs'),`import {parseRecipe,renderCompact} from '@open-sauce/core'; import {loadVocabulary} from '@open-sauce/core/vocabulary/node'; if(typeof loadVocabulary!=='function'||!renderCompact(parseRecipe('::recipe\\nname: Test')).includes('Test')) throw Error('Library exports failed');`);
const library=spawnSync(process.execPath,['library.mjs'],{cwd:temp,env:runtimeEnv,encoding:'utf8'});
assert.equal(library.status,0,library.stderr);
console.log(JSON.stringify({temp,archive,files:files.length,bytes:packed.unpackedSize,cleanInstall:'passed',commands:'check, compact, code, html, no-knowledge, library exports'}));
