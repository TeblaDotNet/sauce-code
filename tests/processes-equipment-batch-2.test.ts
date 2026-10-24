import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createReferencePage, renderReferenceHtml} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v=await loadVocabulary('knowledge');
const ledger=JSON.parse(readFileSync('docs/processes-equipment-batch-2-decisions.json','utf8'));
for(const row of ledger.additions)test('Batch 2 identity and sourced draft: '+row.id,()=>{
 const e=v.resolve(row.id,row.kind)[0];assert.ok(e);assert.deepEqual(e.curation,{origin:'generated',review:'unchecked'});
 assert.ok(e.categories?.length);for(const name of [e.canonical_name,...row.aliases])assert.deepEqual(v.resolve(name,row.kind).map(x=>x.id),[row.id]);
 const p=createReferencePage(v,row.kind,row.id)!;assert.ok(p);const enrichment=v.enrichments.find(x=>x.target.kind===row.kind&&x.target.id===row.id)!;assert.ok(enrichment.editorial?.some(x=>x.sources?.length));assert.ok(enrichment.review_version<1);
});
test('Batch 2 ambiguous senses remain separate',()=>{
 for(const name of ['clarify','bloom','temper','electric beaters'])assert.deepEqual(v.resolve(name,name==='electric beaters'?'equipment':'process'),[],name);
 for(const [a,b,kind]of [['pressure-canner','pressure-cooker','equipment'],['pastry-blender','blender','equipment'],['food-mill','food-processor','equipment'],['dock','pierce','process'],['clarify-butter','clarify-stock','process'],['dry-brine','brine','process']])assert.notEqual(v.resolve(a,kind as 'equipment'|'process')[0].id,v.resolve(b,kind as 'equipment'|'process')[0].id);
});
test('twenty existing drafts retain prior blocks and add sourced distinctions',()=>{
 assert.equal(ledger.improvements.length,20);for(const row of ledger.improvements){const e=v.enrichments.find(x=>x.target.kind===row.kind&&x.target.id===row.id)!;assert.ok(e.editorial!.length>=2);assert.equal(e.editorial!.find(x=>x.id==='batch-2-distinction')!.text,row.added);assert.ok(e.review_version<1);}
});
