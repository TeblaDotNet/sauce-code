import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {loadVocabulary} from '../src/vocabulary/node.ts';
// Run against a clean source export. User worktrees are not silently filtered.
const files:string[]=[];
function walk(dir:string){for(const e of readdirSync(dir,{withFileTypes:true})){
 const p=join(dir,e.name);assert.ok(!e.isSymbolicLink(),'Symlink: '+p);
 if(e.isDirectory()){if(['.git','node_modules','dist'].includes(e.name))continue;assert.ok(!['work','hosting-work','site-dist','.integration','.codex','.agents','History'].includes(e.name),'Private directory: '+p);walk(p);}
 else {assert.ok(!/\.(zip|7z|tar|gz|log)$/i.test(p),'Archive/log: '+p);files.push(p);}
}}walk('.');
const excluded=JSON.parse(readFileSync('examples/provenance/release-exclusions.json','utf8')).records.map((r:{slug:string})=>r.slug) as string[];
for(const f of files){if(!/\.(md|json|yaml|yml|ts|js|html|css|opensauce|txt)$/.test(f))continue;
 const text=readFileSync(f,'utf8');assert.ok(!/[A-Z]:[\\/](?:Users|Projects)[\\/]/.test(text),'Machine path: '+f);
 assert.ok(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16}/.test(text),'Credential pattern: '+f);
 if(!f.endsWith('release-exclusions.json'))assert.ok(!excluded.some(s=>text.includes(s)),'Excluded identifier: '+f);
}
const v=await loadVocabulary('knowledge');assert.equal(v.entries.length,780);
const samples=JSON.parse(readFileSync('tests/fixtures/curated-examples.json','utf8')).recipes as {path:string;sha256:string}[];
for(const x of samples)assert.equal(createHash('sha256').update(readFileSync(x.path)).digest('hex'),x.sha256,x.path);
assert.equal(files.filter(f=>f.replaceAll('\\','/').startsWith('examples/public-domain-recipes/')&&f.endsWith('.opensauce')).length,samples.length);
for(const p of ['LICENSE','LICENSING.md','LICENSES/MIT.txt','LICENSES/CC0-1.0.txt','LICENSES/CC-BY-4.0.txt','LICENSES/GPL-2.0-or-later.txt','examples/provenance/UPSTREAM-LICENSE.md'])assert.ok(existsSync(p),p);
console.log(JSON.stringify({files:files.length,knowledge:v.entries.length,samples:samples.length,exclusions:'passed',notices:'present'}));
