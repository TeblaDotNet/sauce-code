import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {parseRecipe,renderCode,renderCompact,renderHtml} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const manifest=JSON.parse(await readFile('tests/fixtures/curated-examples.json','utf8'));
const vocabulary=await loadVocabulary('knowledge');
for(const item of manifest.recipes as {path:string;sha256:string}[])test('pinned representative recipe: '+item.path,async()=>{
 const bytes=await readFile(item.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256);
 const source=bytes.toString('utf8'),recipe=parseRecipe(source,{vocabulary});assert.deepEqual(recipe.diagnostics.filter(d=>d.severity==='error'),[]);
 assert.equal(recipe.source,source);assert.ok(renderCompact(recipe));assert.ok(renderHtml(recipe));
 assert.deepEqual(parseRecipe(renderCode(recipe)).diagnostics.filter(d=>d.severity==='error'),[]);
});
test('public README wordmarks retain both real SVG sources',async()=>{
 const readme=await readFile('README.md','utf8');
 for(const variant of ['light','dark']){const p='assets/brand/open-sauce-food-wordmark-'+variant+'.svg';assert.ok(readme.includes(p));assert.match(await readFile(p,'utf8'),/<svg\b/);}
});
