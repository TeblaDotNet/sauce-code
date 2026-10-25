import test from 'node:test';import assert from 'node:assert/strict';
import {readerQuantity,scaleReaderQuantity,convertReaderUnit,convertReaderDensity} from '../src/index.ts';
import {classifyDocument,reconstruct,entryShape,enrichmentShape} from '../tools/migration/ownership.ts';
import {splitDocument,stable} from '../tools/migration/dry-run.ts';
test('provider absence does not change scaling or relax conversion eligibility',()=>{
 for(const [factor,value]of [[2,4],[1.5,3]])assert.equal(scaleReaderQuantity(readerQuantity('2 cups')!,factor).amount,value);
 const custom=scaleReaderQuantity(readerQuantity('2 scoops')!,2);assert.equal(custom.unit,'scoops');assert.equal(custom.amount,4);
 assert.equal(convertReaderUnit(readerQuantity('2 cups')!,'ml'),undefined);assert.equal(convertReaderUnit(readerQuantity('1kg')!,'g')!.amount,1000);
 assert.equal(convertReaderDensity([],readerQuantity('1 US cup')!,{target:{kind:'ingredient',id:'flour'},to:'g'}).ok,false);
});
test('raw ownership includes legacy fields/comments and round trips ordered editorial values',()=>{
 const text='# provenance comment\nid: sample\nkind: ingredient\nnames:\n  en: sample\naliases:\n- name: old sample\n  legacy_count: 2\nparts:\n  seed:\n    names:\n      en: seed\n    typical_mass:\n    - value: 1\n      unit: g\n      approximate: true\n      source: {citation: Fixture}\n';
 const split=splitDocument('fixture.yaml',text,entryShape);assert.deepEqual(split.unresolved,[]);assert.equal(split.originalText,text);
 assert.ok(split.fields.some(f=>f.path.includes('legacy_count')&&f.classification==='Provenance'));
 assert.ok(split.fields.some(f=>f.path.includes('typical_mass')&&f.owner==='open-sauce-food'));
 const a=split.fields.filter(f=>f.owner==='sauce-code'),b=split.fields.filter(f=>f.owner==='open-sauce-food');assert.deepEqual(reconstruct([...a,...b]),split.value);
 const article=[{target:{kind:'ingredient',id:'egg'},review_version:0.1,editorial:[{id:'b',role:'uses',text:'Second\nline',review_version:0.1},{id:'a',role:'summary',text:'First literal <tag>',review_version:0.1}]}];
 const raw=classifyDocument('article',article,enrichmentShape);assert.deepEqual(reconstruct(raw.fields),article);assert.equal(stable(raw),stable(classifyDocument('article',article,enrichmentShape)));
 assert.throws(()=>reconstruct([...raw.fields,...raw.fields]));assert.throws(()=>reconstruct(raw.fields.slice(1)));
 assert.throws(()=>splitDocument('duplicate','id: one\nid: two',entryShape));
});
test('unknown nested/legacy fields fail closed rather than disappearing',()=>{
 for(const value of [{id:'x',unexpected:'value'},{id:'x',parts:{seed:{names:{en:'seed'},unknown:true}}},{id:'x',evidence:{unclassified:42}},{id:'x',aliases:[{name:'y',unknown:1}]}]){
  for(const legacy of [false,true])assert.ok(classifyDocument('fixture',value,entryShape,legacy).unresolved.length);
 }
});
