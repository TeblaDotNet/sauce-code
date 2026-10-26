import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {existsWithExactCase} from './doc-path.ts';
import {parseRecipe,renderCompact} from '../src/index.ts';
const docs=['README.md','SPEC.md','CONTRIBUTING.md','LICENSING.md',...readdirSync('docs').filter(f=>f.endsWith('.md')).map(f=>'docs/'+f)];
const missing:string[]=[];
for(const p of docs){const t=readFileSync(p,'utf8').replace(/```[\s\S]*?```/g,'').replace(/`[^`\n]+`/g,'');for(const m of t.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){const target=m[1].split('#')[0];if(!target||/^[a-z]+:/i.test(target))continue;if(!existsWithExactCase(resolve(dirname(p),decodeURIComponent(target))))missing.push(p+': '+target);}}
assert.deepEqual(missing,[]);
const readme=readFileSync('README.md','utf8'),example=readme.match(/```opensauce\r?\n([\s\S]*?)```/)![1];
const recipe=parseRecipe(example);assert.deepEqual(recipe.diagnostics,[]);
const compact=readme.match(/The Compact renderer produces:\r?\n\r?\n((?:>[^\n]*\n?)+)/);
assert.ok(compact,'README must retain its matching Compact example');assert.equal(renderCompact(recipe).split('Instructions:\n')[1].trim(),compact[1].trimEnd().replace(/^> /gm,'').replaceAll('\r',''));
console.log(JSON.stringify({documents:docs.length,missing,readmeExample:'passed'}));
