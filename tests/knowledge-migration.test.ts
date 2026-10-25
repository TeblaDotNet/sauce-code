import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {parseRecipe,renderCode,renderCompact,renderHtml,createReferencePage,Vocabulary,readerQuantity,scaleReaderQuantity,convertReaderUnit,convertReaderDensity,validateKnowledgeSnapshot} from '../src/index.ts';
import {loadVocabulary,loadCanonicalVocabulary} from '../src/vocabulary/node.ts';
import {canonicalEntry} from '../src/vocabulary/canonical.ts';
import type {VocabularyEntry} from '../src/vocabulary/index.ts';
import {classifyDocument,reconstruct,entryShape,enrichmentShape} from '../tools/migration/ownership.ts';
import {splitDocument,hash,stable} from '../tools/migration/dry-run.ts';
const combined=await loadVocabulary('knowledge'),canonical=await loadCanonicalVocabulary('knowledge');
const digest=hash(stable(canonical.entries));
const fixture='::recipe\nname: Canonical\nserves: 2\n::ingredients\n(egg: yolk) 2\n(flour; plain) 250g\n(heat seasoning) = (red chillies, dried) -OR- (cayenne pepper)\n(self rising flour) 1 cup\n::equipment\n(bowl)\n(mixing bowl)\n::instructions\n(egg: yolk) + (flour) <mix, in (mixing bowl)>\n<wait, 2m>\n';
const snapshot=()=>({schemaVersion:1 as const,provider:{id:'open-sauce-food',version:'fixture',sourceRevision:'fixture'},vocabulary:{digest}});
const normalize=(v:unknown)=>JSON.parse(JSON.stringify(v,(k,x)=>k==='entry'?canonicalEntry(x):x));

test('canonical-only retains 969 identities, compatibility, warnings and projected lexical structures',()=>{
 assert.equal(canonical.entries.length,969);assert.equal(canonical.entries.filter(e=>!e.canonical_target).length,967);
 assert.deepEqual(canonical.entries,combined.entries.map(canonicalEntry));assert.deepEqual(canonical.diagnostics,combined.diagnostics);
 assert.deepEqual(canonical.enrichments,[]);assert.deepEqual(canonical.resources,[]);
 assert.equal(canonical.entries.filter(e=>createReferencePage(canonical,e.kind,e.id)).length,913);
 assert.ok(createReferencePage(canonical,'ingredient','egg'));assert.equal(createReferencePage(canonical,'ingredient','egg')!.enrichment,undefined);
 for(const e of combined.entries){const terms=[e.id,...Object.values(e.names),...Object.values(e.plural_names??{}),...(e.aliases??[]).map(a=>typeof a==='string'?a:a.name),...(e.exact_names??[]).map(n=>n.name)];
  for(const term of terms)for(const locale of [undefined,'en-GB','en-US']){
   assert.deepEqual(canonical.resolve(term,e.kind,locale),combined.resolve(term,e.kind,locale).map(canonicalEntry));
   if(e.kind==='ingredient')assert.deepEqual(normalize(canonical.resolveIngredient(term,undefined,[],locale)),normalize(combined.resolveIngredient(term,undefined,[],locale)));
  }
 }
});

test('canonical loader does not read malformed article/source registries, media, or quantitative values',async()=>{
 const root=await mkdtemp(join(tmpdir(),'canonical-loader-'));
 for(const kind of ['ingredients','equipment','processes']){await mkdir(join(root,kind));await writeFile(join(root,kind,'index.yaml'),JSON.stringify({schema_version:'0.3',entries:kind==='ingredients'?[{file:'fixture.yaml'}]:[]}));}
 await writeFile(join(root,'ingredients','fixture.yaml'),JSON.stringify({id:'fixture',kind:'ingredient',names:{en:'fixture'},nutrition:'invalid editorial values',reference_density:false,parts:{seed:{names:{en:'seed'},typical_mass:'invalid values'}}}));
 await writeFile(join(root,'resources.yaml'),'not: [valid');await writeFile(join(root,'enrichment.yaml'),'not: [valid');
 const v=await loadCanonicalVocabulary(root);assert.equal(v.entries.length,1);assert.equal(v.resolvePartPath('fixture',['seed']).complete,true);assert.equal(v.entries[0].nutrition,undefined);
 await assert.rejects(loadVocabulary(root));
 // Canonical structure is still validated, even though editorial data is optional.
 await writeFile(join(root,'ingredients','fixture.yaml'),JSON.stringify({id:'fixture',kind:'ingredient',names:{en:'fixture'},type_of:'missing'}));await assert.rejects(loadCanonicalVocabulary(root));
});

test('Code, Compact, HTML, part aliases, variants and ambiguous resolution are unchanged',()=>{
 const a=parseRecipe(fixture,{vocabulary:combined}),b=parseRecipe(fixture,{vocabulary:canonical});assert.deepEqual(b,a);
 assert.equal(renderCode(b),renderCode(a));assert.equal(renderCompact(b,{vocabulary:canonical}),renderCompact(a,{vocabulary:combined}));
 for(const view of ['code','compact'] as const)assert.equal(renderHtml(b,{view,vocabulary:canonical}),renderHtml(a,{view,vocabulary:combined}));
 assert.deepEqual(normalize(canonical.resolveIngredient('egg-yolk')),normalize(combined.resolveIngredient('egg-yolk')));
 const entries:VocabularyEntry[]=[{id:'left',kind:'ingredient',names:{en:'same'},variants:{fine:{names:{en:'fine'}}},parts:{outer:{names:{en:'outer'},parts:{inner:{names:{en:'inner'}}}}}},{id:'right',kind:'ingredient',names:{en:'same'}}];
 const full=new Vocabulary(entries),bare=new Vocabulary(entries.map(canonicalEntry));assert.equal(bare.resolve('same','ingredient').length,2);assert.deepEqual(bare.resolvePartPath('left',['outer','inner']),full.resolvePartPath('left',['outer','inner']));assert.deepEqual(bare.resolveIngredient('same','fine'),full.resolveIngredient('same','fine'));
});

test('provider absence does not change scaling or relax conversion eligibility',()=>{
 for(const [factor,value]of [[2,4],[1.5,3]])assert.equal(scaleReaderQuantity(readerQuantity('2 cups')!,factor).amount,value);
 const custom=scaleReaderQuantity(readerQuantity('2 scoops')!,2);assert.equal(custom.unit,'scoops');assert.equal(custom.amount,4);
 assert.equal(convertReaderUnit(readerQuantity('2 cups')!,'ml'),undefined);assert.equal(convertReaderUnit(readerQuantity('1kg')!,'g')!.amount,1000);
 assert.equal(convertReaderDensity([],readerQuantity('1 US cup')!,{target:{kind:'ingredient',id:'flour'},to:'g'}).ok,false);
});

test('snapshot supports no article, only sources, only hero, or only provisional observation',()=>{
 validateKnowledgeSnapshot(snapshot(),canonical,digest);
 validateKnowledgeSnapshot({...snapshot(),resources:combined.resources},canonical,digest);
 const hero=combined.enrichments.find(e=>e.hero)!;validateKnowledgeSnapshot({...snapshot(),enrichments:[{target:hero.target,review_version:0.1,hero:hero.hero}]},canonical,digest);
 const measurement=combined.enrichments.find(e=>e.measurements?.length)!;
 validateKnowledgeSnapshot({...snapshot(),resources:combined.resources,enrichments:[{target:measurement.target,review_version:0.1,measurements:measurement.measurements}]},canonical,digest);
 validateKnowledgeSnapshot({...snapshot(),resources:combined.resources,enrichments:combined.enrichments},canonical,digest);
 const quantities=[{target:{kind:'ingredient',id:'egg',parts:['yolk']},review_version:0.1,values:{typical_mass:[{value:10,unit:'g',approximate:true,source:{citation:'Synthetic fixture only'}}]}}];validateKnowledgeSnapshot({...snapshot(),quantities},canonical,digest);
 assert.throws(()=>validateKnowledgeSnapshot({...snapshot(),quantities:[quantities[0],quantities[0]]},canonical,digest));
 assert.throws(()=>validateKnowledgeSnapshot({...snapshot(),quantities:[{...quantities[0],target:{kind:'ingredient',id:'egg',parts:['missing']}}]},canonical,digest));
});

test('snapshot fails on mismatched compatibility, targets, source links and false conversion eligibility',()=>{
 for(const patch of [{schemaVersion:2},{extra:true},{provider:{id:''}},{vocabulary:{digest:'0'.repeat(64)}},{enrichments:[{target:{kind:'ingredient',id:'missing'},review_version:0.1}]},{enrichments:[{target:{kind:'ingredient',id:'egg-yolk'},review_version:0.1}]},{enrichments:[{target:{kind:'ingredient',id:'egg'},review_version:0.1,editorial:[{id:'summary',role:'summary',text:'test',sources:['missing'],review_version:0.1}]}]}])assert.throws(()=>validateKnowledgeSnapshot({...snapshot(),...patch},canonical,digest));
 const original=combined.enrichments.find(e=>e.measurements?.length)!;const changed=structuredClone(original);changed.measurements![0].conversion_eligible=true;
 assert.throws(()=>validateKnowledgeSnapshot({...snapshot(),resources:combined.resources,enrichments:[changed]},canonical,digest));
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

const corpus=process.env.OSF_CORPUS;
test('all 490 Corpus recipes have identical AST/diagnostics, resolution and recipe renderings',{skip:!corpus},async()=>{
 const files:string[]=[];async function walk(dir:string){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await walk(p);else if(p.endsWith('.opensauce'))files.push(p);}}
 await walk(resolve(corpus!,'examples'));assert.equal(files.length,490);
 for(const file of files.sort()){
  const source=await readFile(file,'utf8'),a=parseRecipe(source,{filename:file,vocabulary:combined}),b=parseRecipe(source,{filename:file,vocabulary:canonical});
  assert.deepEqual(b,a,file);assert.equal(b.diagnostics.filter(d=>d.severity==='error').length,0,file);
  assert.equal(renderCode(b),renderCode(a),file);assert.equal(renderCompact(b,{vocabulary:canonical}),renderCompact(a,{vocabulary:combined}),file);
  for(const view of ['code','compact'] as const)assert.equal(renderHtml(b,{view,vocabulary:canonical}),renderHtml(a,{view,vocabulary:combined}),file);
 }
});
