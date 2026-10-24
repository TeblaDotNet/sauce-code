import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parse} from 'yaml';
import {loadVocabulary} from '../src/vocabulary/node.ts';
import {createReferencePage,renderReferenceHtml} from '../src/index.ts';
import type {ConceptTarget} from '../src/index.ts';
const v=await loadVocabulary('knowledge');
const ledger=JSON.parse(readFileSync('docs/ingredient-enrichment-batch-2.json','utf8'));
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
for(const row of ledger.pages) test('Ingredient batch 2 sourced provisional render: '+row.id,()=>{
  const item=v.enrichments.find(e=>e.target.kind===row.kind&&e.target.id===row.id)!;
  assert.ok(item);assert.equal(item.review_version,0.1);assert.equal(item.reviewed_at,undefined);
  const page=createReferencePage(v,row.kind,row.id)!;assert.ok(page);
  const html=renderReferenceHtml(page);
  assert.equal(item.editorial?.length,2);
  for(const block of item.editorial??[]){assert.equal(block.review_version,0.1);assert.ok(block.sources?.length);assert.ok(html.includes(escape(block.text)));}
  for(const source of row.sources){assert.ok(v.resources.some(r=>r.id===source.id&&r.url===source.url));assert.ok(html.includes(escape(source.url)));}
});
test('Ingredient batch 2 leaves canonical knowledge files byte-identical',()=>{
  for(const [path,hash] of Object.entries(ledger.canonicalFileHashes))assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),hash,path);
});
test('Ingredient batch 2 selection and historical eligible backlog agree',()=>{
  assert.equal(ledger.pages.length,50);
  assert.ok(ledger.pages.every((p:ConceptTarget)=>p.kind==='ingredient'));
  const snapshot=v.enrichments.slice(0,ledger.after.enriched);
  const missing=v.entries.filter(e=>e.kind==='ingredient'&&createReferencePage(v,e.kind,e.id)&&!snapshot.some(x=>x.target.kind===e.kind&&x.target.id===e.id));
  assert.deepEqual(missing.map(e=>e.kind+':'+e.id).sort(),ledger.backlog.map((e:ConceptTarget)=>e.kind+':'+e.id).sort());
  assert.equal(missing.length,180);
  assert.equal(v.entries.length,969);assert.equal(v.entries.filter(e=>createReferencePage(v,e.kind,e.id)).length,913);
});

test('Ingredient batch 2 preserves every previous enrichment and source record',()=>{
  for(const [file,snapshot]of Object.entries(ledger.previousRegistrySnapshots) as [string,{count:number;sha256:string}][]){
    const current=parse(readFileSync(file,'utf8')).slice(0,snapshot.count);
    assert.equal(createHash('sha256').update(JSON.stringify(current)).digest('hex'),snapshot.sha256,file);
  }
});
