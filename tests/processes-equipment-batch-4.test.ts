import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createReferencePage, renderReferenceHtml} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v = await loadVocabulary('knowledge');
const ledger = JSON.parse(readFileSync('docs/processes-equipment-batch-4-decisions.json','utf8'));
for (const row of ledger.additions) test('Batch 4 sourced canonical draft: '+row.id, () => {
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
test('Batch 4 boundaries retain distinct tools and preparation stages', () => {
  for (const name of ['china cap','probe thermometer','tamis','tandir','electric beaters']) assert.deepEqual(v.resolve(name,'equipment'),[],name);
  for (const [a,b,kind] of [['lard','bard','process'],['par-bake','blind-bake','process'],['pin-bone','debone','process'],['egg-wash','glaze','process'],['oven-thermometer','food-probe-thermometer','equipment'],['bread-lame','razor-blade','equipment'],['spider-strainer','chinois','equipment'],['tortilla-press','comal','equipment']]) {
    assert.notEqual(v.resolve(a,kind as 'equipment'|'process')[0].id,v.resolve(b,kind as 'equipment'|'process')[0].id);
  }
  assert.equal(v.resolve('bamboo-steamer','equipment')[0].type_of,'steaming-basket');
  assert.equal(v.resolve('tandoor','equipment')[0].type_of,'oven');
  assert.equal(v.resolve('food-probe-thermometer','equipment')[0].type_of,'thermometer');
});
test('Batch 4 improves twenty existing drafts without claiming human review', () => {
  assert.equal(ledger.improvements.length,20);
  for (const row of ledger.improvements) {
    const e = v.enrichments.find(e=>e.target.kind===row.kind&&e.target.id===row.id)!;
    assert.ok(e.editorial!.length>=2);
    const block = e.editorial!.find(b=>b.id==='batch-4-distinction')!;
    assert.equal(block.text,row.added);
    assert.ok(block.sources!.length);
    assert.equal(block.review_version,0.1);
    assert.equal(e.review_version,0.1);
  }
});
