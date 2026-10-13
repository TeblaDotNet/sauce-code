import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {loadVocabulary} from '../src/vocabulary/node.ts';
import {createReferencePage,renderReferenceHtml,parseRecipe} from '../src/index.ts';
import type {ReferenceKind} from '../src/index.ts';
const v=await loadVocabulary('knowledge');
const batch: {kind:ReferenceKind,id:string,status:string}[]=JSON.parse(await readFile('tests/fixtures/cocktail-foundation-v2.json','utf8'));
test('v2 enriches existing skeletal targets and clear new identities without duplicates',()=>{
 assert.equal(batch.length,43);assert.equal(batch.filter(p=>p.status==='existing-skeletal').length,13);
 for(const {kind,id}of batch){assert.equal(v.entries.filter(e=>e.kind===kind&&e.id===id).length,1,id);const p=createReferencePage(v,kind,id)!;assert.equal(p.enrichment?.review_version,0.1,id);assert.ok(p.enrichment.editorial!.length>=3,id);const html=renderReferenceHtml(p);for(const label of ['::about','::learn','::sources','Version 0.1 — machine generated, not yet human reviewed'])assert.ok(html.includes(label),id+label);}
});
test('v2 preserves existing identities, separates products and gives source styles stable keys',()=>{
 for(const name of ['bourbon','sherry','pineapple juice'])assert.equal(v.resolve(name,'ingredient').length,1);
 assert.equal(v.resolve('agave syrup','ingredient')[0]?.id,'agave');
 for(const name of ['Campari','Aperol','Chartreuse Verte','Seedlip Grove 42','Cointreau'])assert.equal(v.resolve(name,'ingredient').length,0);
 const r=parseRecipe('::recipe\nname: V2 identity proof\n::ingredients\n(orange liqueur; curaçao @ Ferrand Dry Curaçao) 10ml\n(liqueur; herbal @ !Chartreuse Verte) 10ml\n(rum; Jamaican @ ~Smith & Cross) 10ml\n',{vocabulary:v});assert.deepEqual(r.diagnostics,[]);
 assert.ok(v.entries.find(e=>e.id==='rum'&&e.kind==='ingredient')?.variants?.jamaican);
 assert.ok(v.entries.find(e=>e.id==='orange-liqueur')?.variants?.curacao);
});
