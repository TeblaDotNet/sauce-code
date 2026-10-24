import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createReferencePage, renderReferenceHtml} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v = await loadVocabulary('knowledge');
const ledger = JSON.parse(readFileSync('docs/processes-equipment-batch-6-decisions.json','utf8'));
for (const row of ledger.additions) test('Batch 6 sourced canonical draft: '+row.id, () => {
  const e = v.resolve(row.id,row.kind)[0];
  assert.ok(e);
  assert.deepEqual(e.curation,{origin:'generated',review:'unchecked'});
  assert.deepEqual(e.categories,row.categories);
  assert.equal(e.type_of,row.type_of);
  for (const name of [e.canonical_name,...row.aliases]) assert.deepEqual(v.resolve(name,row.kind).map(x=>x.id),[row.id]);
  const p = createReferencePage(v,row.kind,row.id)!;
  assert.ok(p);
  const html = renderReferenceHtml(p);
  assert.ok(html.includes(row.definition.replaceAll('&','&amp;')));
  for (const source of row.sources) {
    const resource = v.resources.find(r=>r.id===source)!;
    assert.ok(resource);
    assert.ok(html.includes(resource.url.replaceAll('&','&amp;')));
  }
});
test('Batch 6 scoped methods do not claim broad nouns or interchangeability', () => {
  assert.equal(ledger.additions.filter((r: {kind:string})=>r.kind==='equipment').length,15);
  assert.equal(ledger.additions.filter((r: {kind:string})=>r.kind==='process').length,8);
  for (const name of ['fish knife','cleaver','coffee maker','electric beaters','tamis']) assert.deepEqual(v.resolve(name,'equipment'),[],name);
  for (const name of ['meringue','panade','beurre manie','seeding','tabling']) assert.deepEqual(v.resolve(name,'process'),[],name);
  for (const [a,b,kind] of [['seed-temper-chocolate','table-temper-chocolate','process'],['make-beurre-manie','make-roux','process'],['make-french-meringue','make-swiss-meringue','process'],['make-italian-meringue','make-swiss-meringue','process'],['tea-infuser','tea-strainer','equipment'],['bakers-couche','pastry-cloth','equipment'],['pizza-wheel','pastry-wheel','equipment'],['espresso-machine','moka-pot','equipment']]) {
    assert.notEqual(v.resolve(a,kind as 'equipment'|'process')[0].id,v.resolve(b,kind as 'equipment'|'process')[0].id);
  }
  assert.equal(v.resolve('fillet-knife','equipment')[0].type_of,'knife');
  assert.equal(v.resolve('madeleine-pan','equipment')[0].type_of,'baking-pan');
  assert.equal(v.resolve('milk-frothing-jug','equipment')[0].type_of,'jug');
});
test('Batch 6 improves twenty existing drafts without claiming human review', () => {
  assert.equal(ledger.improvements.length,20);
  for (const row of ledger.improvements) {
    const e = v.enrichments.find(e=>e.target.kind===row.kind&&e.target.id===row.id)!;
    assert.ok(e.editorial!.length>=2);
    const block = e.editorial!.find(b=>b.id==='batch-6-distinction')!;
    assert.equal(block.text,row.added);
    assert.ok(block.sources!.length);
    assert.equal(block.review_version,0.1);
    assert.equal(e.review_version,0.1);
  }
});
