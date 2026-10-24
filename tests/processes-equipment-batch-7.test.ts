import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {createReferencePage, renderReferenceHtml} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v = await loadVocabulary('knowledge');
const ledger = JSON.parse(readFileSync('docs/processes-equipment-batch-7-decisions.json','utf8'));
for (const row of ledger.additions) test('Batch 7 sourced canonical draft: '+row.id, () => {
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
test('Batch 7 distinguishes mechanisms and scoped preparations', () => {
  assert.equal(ledger.additions.filter((r: {kind:string})=>r.kind==='equipment').length,15);
  assert.equal(ledger.additions.filter((r: {kind:string})=>r.kind==='process').length,8);
  for (const name of ['cheese slicer','chuan','hoak','electric beaters','tamis']) assert.deepEqual(v.resolve(name,'equipment'),[],name);
  for (const name of ['degorger','glacer','slurry','sausage']) assert.deepEqual(v.resolve(name,'process'),[],name);
  for (const [a,b,kind] of [['corkscrew','bottle-opener','equipment'],['wok-spatula','wok-ladle','equipment'],['pasta-extruder','pasta-roller','equipment'],['fish-scaler','fillet-knife','equipment'],['singer','make-roux','process'],['glaze-vegetables','glaze','process'],['salt-drain-vegetables','dry-brine','process'],['coil-fold-dough','stretch-and-fold','process'],['extrude-pasta','spiralize-vegetables','process']]) {
    assert.notEqual(v.resolve(a,kind as 'equipment'|'process')[0].id,v.resolve(b,kind as 'equipment'|'process')[0].id);
  }
  assert.equal(v.resolve('carving-knife','equipment')[0].type_of,'knife');
  assert.equal(v.resolve('wok-ladle','equipment')[0].type_of,'ladle');
  assert.equal(v.resolve('pasta-extruder','equipment')[0].type_of,'pasta-machine');
});
test('Batch 7 improves twenty existing drafts without claiming human review', () => {
  assert.equal(ledger.improvements.length,20);
  for (const row of ledger.improvements) {
    const e = v.enrichments.find(e=>e.target.kind===row.kind&&e.target.id===row.id)!;
    assert.ok(e.editorial!.length>=2);
    const block = e.editorial!.find(b=>b.id==='batch-7-distinction')!;
    assert.equal(block.text,row.added);
    assert.ok(block.sources!.length);
    assert.equal(block.review_version,0.1);
    assert.equal(e.review_version,0.1);
  }
});
