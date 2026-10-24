import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {loadVocabulary} from '../src/vocabulary/node.ts';
import {createReferencePage,renderReferenceHtml} from '../src/index.ts';
import type {ConceptTarget} from '../src/index.ts';
const v=await loadVocabulary('knowledge');
const ledger=JSON.parse(readFileSync('docs/existing-page-enrichment-batch-1.json','utf8'));
const escape=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
for(const row of ledger.pages) test('Existing-page batch 1 sourced provisional render: '+row.id,()=>{
  const item=v.enrichments.find(e=>e.target.kind===row.kind&&e.target.id===row.id)!;
  assert.ok(item);assert.equal(item.review_version,0.1);assert.equal(item.reviewed_at,undefined);
  const page=createReferencePage(v,row.kind,row.id)!;assert.ok(page);
  const html=renderReferenceHtml(page);
  assert.equal(item.editorial?.length,2);
  for(const block of item.editorial??[]){assert.equal(block.review_version,0.1);assert.ok(block.sources?.length);assert.ok(html.includes(escape(block.text)));}
  for(const source of row.sources){assert.ok(v.resources.some(r=>r.id===source.id&&r.url===source.url));assert.ok(html.includes(escape(source.url)));}
});
test('Existing-page batch 1 leaves canonical knowledge files byte-identical',()=>{
  for(const [path,hash] of Object.entries(ledger.canonicalFileHashes))assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),hash,path);
});
test('Existing-page batch 1 selection and complete eligible backlog agree',()=>{
  assert.equal(ledger.pages.length,30);
  for(const kind of ['equipment','process'])assert.equal(ledger.pages.filter((p:ConceptTarget)=>p.kind===kind).length,15);
  const missing=v.entries.filter(e=>['equipment','process'].includes(e.kind)&&createReferencePage(v,e.kind,e.id)&&!v.enrichments.some(x=>x.target.kind===e.kind&&x.target.id===e.id));
  assert.deepEqual(missing.map(e=>e.kind+':'+e.id).sort(),ledger.backlog.map((e:ConceptTarget)=>e.kind+':'+e.id).sort());
  assert.equal(missing.filter(e=>e.kind==='equipment').length,38);assert.equal(missing.filter(e=>e.kind==='process').length,60);
  assert.equal(v.entries.length,969);assert.equal(v.entries.filter(e=>createReferencePage(v,e.kind,e.id)).length,913);
});
