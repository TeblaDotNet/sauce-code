import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createReferencePage, renderReferenceHtml} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v = await loadVocabulary('knowledge');
const ledger = JSON.parse(readFileSync('docs/processes-equipment-batch-3-decisions.json','utf8'));
for (const row of ledger.additions) test('Batch 3 sourced canonical draft: '+row.id, () => {
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
test('Batch 3 scoped concepts do not introduce ambiguous aliases or erase boundaries', () => {
  for (const name of ['dough scraper','pastry cutter','Microplane','electric beaters']) assert.deepEqual(v.resolve(name,'equipment'),[],name);
  for (const name of ['concasse','supreme']) assert.deepEqual(v.resolve(name,'process'),[],name);
  for (const [child,parent] of [['bench-scraper','scraper'],['bowl-scraper','scraper'],['pasta-roller','pasta-machine'],['rasp-grater','grater']]) {
    assert.equal(v.resolve(child,'equipment')[0].type_of,parent);
    assert.notEqual(v.resolve(child,'equipment')[0].id,v.resolve(parent,'equipment')[0].id);
  }
  for (const id of ['comal','tawa','tagine']) assert.equal(v.resolve(id,'equipment')[0].type_of,undefined);
});
test('Batch 3 improves twenty existing drafts without claiming human review', () => {
  assert.equal(ledger.improvements.length,20);
  for (const row of ledger.improvements) {
    const e = v.enrichments.find(e=>e.target.kind===row.kind&&e.target.id===row.id)!;
    assert.ok(e.editorial!.length>=2);
    const block = e.editorial!.find(b=>b.id==='batch-3-distinction')!;
    assert.equal(block.text,row.added);
    assert.ok(block.sources!.length);
    assert.equal(block.review_version,0.1);
    assert.equal(e.review_version,0.1);
  }
});
