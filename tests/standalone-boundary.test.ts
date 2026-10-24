import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
test('public Core import graph remains independent of command adapters and Bun',()=>{
 const seen=new Set<string>();
 function visit(file:string){if(seen.has(file))return;seen.add(file);const text=readFileSync(file,'utf8');
  assert.ok(!file.includes('/cli/')&&!file.endsWith('/cli.ts'),file);
  assert.doesNotMatch(text,/\bBun\.|from ['"]bun['"]|process\.(?:argv|stdout|stderr|exit)/,file);
  for(const match of text.matchAll(/(?:from|import)\s*['"]([^'"]+)['"]/g))if(match[1].startsWith('.'))visit(resolve(dirname(file),match[1]).replaceAll('\\','/'));
 }
 visit(resolve(root,'src/index.ts').replaceAll('\\','/'));
 assert.ok(seen.size>10);
});
test('shared CLI adapter is inert on import and version does not load knowledge',()=>{
 const module=new URL('../src/cli/run.ts',import.meta.url).href;
 const inert=spawnSync(process.execPath,['--input-type=module','-e',`await import(${JSON.stringify(module)})`],{encoding:'utf8'});
 assert.equal(inert.status,0,inert.stderr);assert.equal(inert.stdout,'');assert.equal(inert.stderr,'');
 const version=spawnSync(process.execPath,['--input-type=module','-e',`const {runCli}=await import(${JSON.stringify(module)});await runCli(['--version'],{version:async()=>'adapter-test',loadVocabulary:async()=>{throw Error('must not load')}});`],{encoding:'utf8'});
 assert.equal(version.status,0,version.stderr);assert.equal(version.stdout,'adapter-test\n');
});
