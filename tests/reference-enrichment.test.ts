import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile, mkdtemp, mkdir, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Vocabulary, createReferencePage, renderReferenceHtml, parseRecipe, buildUsageIndex, validReviewVersion, convertIngredientMeasurement, formatMeasurement} from '../src/index.ts';
import type {ReferenceEnrichment, ExternalResource, VocabularyEntry, MeasurementObservation, MeasurementRequest} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const vocabulary = await loadVocabulary('knowledge');
const entries: VocabularyEntry[] = [
  {id:'food',kind:'ingredient',names:{en:'food'},parts:{piece:{names:{en:'piece'},aliases:['pieces']}}},
  {id:'mix',kind:'process',names:{en:'mix'}}, {id:'bowl',kind:'equipment',names:{en:'bowl'}}
];
const resource: ExternalResource = {id:'source',title:'Source',url:'https://example.org/reference',publisher:'Test fixture',type:'article',checked_at:'2026-10-11',review_scope:'text'};
const target = {kind:'ingredient',id:'food'} as const;
const enrichment = (extra: object = {}): ReferenceEnrichment => ({target,review_version:0.1,...extra});
const make = (extra: object = {}, resources: ExternalResource[] = [resource]) => new Vocabulary(entries,{resources,enrichments:[enrichment(extra)]});
const page = (v: Vocabulary) => createReferencePage(v,'ingredient','food')!;
const block = (extra: object = {}) => ({id:'intro',role:'summary',text:'Useful food.',review_version:0.1,...extra});
const observation = (extra: object = {}): MeasurementObservation => ({id:'synthetic-test',target,condition:'packed',original:'Synthetic test fixture: 20 g per 10 mL; not culinary evidence.',source:'source',unit:'g/mL',value:2,source_volume_ml:10,normalisation:'20 / 10',uncertainty:{basis:'Synthetic estimated value for tests only'},approximate:true,review_version:1,conversion_eligible:true,...extra});
const request = (extra: object = {}): MeasurementRequest => ({target,amount:10,from:'mL',to:'g',condition:'packed',...extra});
const convert = (extra: object = {}, observations = [observation()]) => convertIngredientMeasurement(observations,request(extra));

for (const version of [0,0.1,0.75,1,2,3]) test('review maturity accepts ' + version, () => {
  assert.ok(validReviewVersion(version)); assert.equal(make({review_version:version}).enrichments[0].review_version,version);
});
for (const version of [-1,NaN,Infinity,'1',null,{},1.5,4]) test('review maturity rejects ' + String(version), () => {
  assert.equal(validReviewVersion(version),false); assert.throws(()=>make({review_version:version}),/review_version/);
});
test('enrichment maturity and prose never change resolver identity or parser legality', () => {
  const enriched=make({editorial:[block({text:'made-up alias'})]});
  const bare=new Vocabulary(entries);
  assert.deepEqual(enriched.resolve('food','ingredient'),bare.resolve('food','ingredient'));
  assert.deepEqual(enriched.resolve('made-up alias','ingredient'),[]);
  const source='::ingredients\n(food: piece) 1\n::instructions\n(food: piece) <mix>';
  assert.deepEqual(parseRecipe(source,{vocabulary:enriched}),parseRecipe(source,{vocabulary:bare}));
});
test('missing optional sections omit empty enrichment headings; legacy pages still render', () => {
  const html=renderReferenceHtml(page(make()));
  for(const heading of ['About','Learning resources','Contextual associations','Measurement observations','Source details'])assert.ok(!html.includes('<h2>'+heading+'</h2>'));
  assert.ok(renderReferenceHtml(page(new Vocabulary(entries))).includes('food'));
});
test('editorial role order is deterministic and prose/source metadata are escaped', () => {
  const v=make({editorial:[block({id:'care',role:'care',text:'Care second'}),block({text:'<script>alert("x")</script> & text',sources:['source']})]},[{...resource,title:'<source>'}]);
  const html=renderReferenceHtml(page(v));
  assert.ok(html.indexOf('<h2>About')<html.indexOf('<h2>Care'));
  assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;source&gt;'));
  assert.equal(html,renderReferenceHtml(page(v)));
});
for(const extra of [{editorial:[block({sources:['missing']})]},{editorial:[block({role:'html'})]},{editorial:[block({text:''})]},{editorial:[block(),block()]},{reviewed_at:'2026-02-30'}])test('reject malformed editorial/review records '+JSON.stringify(extra),()=>assert.throws(()=>make(extra)));

test('shared resources are stored once, support multiple roles, and round-trip with enrichment', () => {
  const a={resource:'source',role:'introduction',order:2,review_version:0.1} as const;
  const v=new Vocabulary(entries,{resources:[resource],enrichments:[enrichment({resources:[a,{...a,role:'specialist-reference',order:1}]}),{target:{kind:'process',id:'mix'},review_version:0.1,resources:[a]}]});
  assert.equal(v.resources.length,1);assert.equal(v.enrichments.length,2);
  const restored=new Vocabulary(JSON.parse(JSON.stringify(v.entries)),JSON.parse(JSON.stringify({resources:v.resources,enrichments:v.enrichments})));
  assert.deepEqual(createReferencePage(restored,'ingredient','food'),page(v));
  const html=renderReferenceHtml(page(v));assert.ok(html.indexOf('specialist reference')<html.indexOf('introduction'));
  assert.equal(page(v).resources?.length,1);
});
test('video landing-page check does not imply watched status or invent duration',()=>{
  const v=make({resources:[{resource:'source',role:'technique-demonstration',order:0,review_version:0.1}]},[{...resource,type:'video',review_scope:'landing-page'}]);
  const html=renderReferenceHtml(page(v));assert.ok(html.includes('duration unknown'));assert.ok(html.includes('landing-page'));assert.equal(v.resources[0].duration_seconds,undefined);
});
for(const url of ['javascript:alert(1)','data:text/html,bad','http://example.org','//example.org','https://user:pass@example.org','https://example.org/ bad','https://example.org/\\evil'])test('unsafe resource URL rejected '+url,()=>assert.throws(()=>make({},[{...resource,url}])));
for(const extra of [{duration_seconds:-1},{duration_seconds:30},{checked_at:'today'},{review_scope:'trusted'},{review_scope:'video-watched'}])test('resource metadata rejected '+JSON.stringify(extra),()=>assert.throws(()=>make({},[{...resource,...extra} as ExternalResource])));

test('canonical part associations resolve safe links but never identity, inheritance or usage',()=>{
  const v=make({associations:[{relation:'commonly-used-with',target:{...target,parts:['piece']},note:'<not required>',sources:['source'],review_version:0.1}]});
  const p=page(v);assert.equal(p.contextualLinks?.[0].url,'/reference/ingredient/food#part-piece');
  assert.ok(renderReferenceHtml(p).includes('&lt;not required&gt;'));
  const usage=buildUsageIndex([{id:'r',name:'Recipe',recipe:parseRecipe('::ingredients\n(food)',{vocabulary:v})}]);
  assert.deepEqual(Object.keys(usage.concepts),['["ingredient","food"]']);
  assert.equal(createReferencePage(v,'ingredient','food',usage)?.parts[0].usage?.length,0);
  assert.equal(p.typeOf,undefined);assert.deepEqual(v.resolve('piece','ingredient'),[]);
});
for(const badTarget of [{kind:'ingredient',id:'missing'},{kind:'process',id:'food'},{...target,parts:['pieces']},{...target,parts:['missing']},{kind:'equipment',id:'bowl',parts:['piece']}])test('invalid canonical association target '+JSON.stringify(badTarget),()=>assert.throws(()=>make({associations:[{relation:'used-for',target:badTarget,review_version:0.1}]}),/target/));
test('aliases cannot replace canonical egg part targets in new associations',()=>{
  assert.throws(()=>new Vocabulary(vocabulary.entries,{enrichments:[{target:{kind:'process',id:'mix'},review_version:0.1,associations:[{relation:'commonly-used-with',target:{kind:'ingredient',id:'egg-yolk'},review_version:0.1}]}]}),/target/);
});

test('approved synthetic g/mL record supports volume to mass and inverse',()=>{
  make({measurements:[observation()]});
  assert.deepEqual(convert(),{ok:true,value:20,unit:'g',observation:'synthetic-test',approximate:true});
  const inverse=convert({amount:20,from:'g',to:'mL'});assert.ok(inverse.ok);assert.equal(inverse.value,10);
});
test('condition, target and product scope must match',()=>{
  for(const mismatch of [{condition:'loose'},{condition:undefined},{target:{...target,parts:['piece']}},{target:{...target,id:'other'}}])assert.deepEqual(convert(mismatch),{ok:false,reason:'no-applicable-record'});
  assert.deepEqual(convert({},[observation({product_scope:'specific'})]),{ok:false,reason:'no-applicable-record'});
  assert.ok(convert({product_scope:'specific'},[observation({product_scope:'specific'})]).ok);
});
test('unknown source cup and unknown reader cup both prevent conversion',()=>{
  assert.deepEqual(convert({from:'cup'}),{ok:false,reason:'unknown-volume-unit'});
  assert.ok(convert({from:'cup',volume_definitions:{cup:250}}).ok);
  assert.deepEqual(convert({},[observation({source_volume_ml:undefined,conversion_eligible:false})]),{ok:false,reason:'no-applicable-record'});
  assert.throws(()=>make({measurements:[observation({source_volume_ml:undefined})]}),/conversion/);
});
test('conflicting applicable records never select first, including provisional alternatives',()=>{
  for(const records of [[observation(),observation({id:'other',value:3})],[observation({id:'other',value:3}),observation()],[observation(),observation({id:'draft',conversion_eligible:false,review_version:0.1})]])assert.deepEqual(convert({},records),{ok:false,reason:'conflicting-records'});
});
test('approximation propagates and display avoids misleading decimals',()=>{
  const a=convert({amount:1.234,approximate:true},[observation({approximate:false})]);assert.ok(a.ok);assert.ok(a.approximate);assert.equal(formatMeasurement(a),'~2.5 g');
  const b=convert({},[observation({approximate:false,uncertainty:{basis:'Unknown: no range supplied'}})]);assert.ok(b.ok);assert.ok(b.approximate);assert.equal(b.bounds,undefined);
});
test('bounds retain basis and invert in the correct order',()=>{
  const m=observation({uncertainty:{basis:'Synthetic observed spread',lower:1,upper:3}});make({measurements:[m]});
  const a=convert({},[m]);assert.ok(a.ok);assert.deepEqual(a.bounds,{lower:10,upper:30,basis:'Synthetic observed spread'});
  const b=convert({amount:30,from:'g',to:'mL'},[m]);assert.ok(b.ok);assert.deepEqual(b.bounds,{lower:10,upper:30,basis:'Synthetic observed spread'});
});
for(const fields of [{value:0},{unit:'g/cup'},{value:NaN},{review_version:0.1},{source_volume_ml:0},{uncertainty:{basis:'unknown',lower:1,upper:3}},{uncertainty:{basis:'test',lower:3,upper:1}},{uncertainty:{basis:'test',lower:3,upper:4}},{uncertainty:{basis:'test',lower:1}},{uncertainty:{basis:''}},{reference_temperature_c:-300},{source:'missing'}])test('invalid measurement '+JSON.stringify(fields),()=>assert.throws(()=>make({measurements:[observation(fields)]})));
test('legacy density is retained but not executable; optional temperature is metadata',()=>{
  const legacy={value:2,unit:'g/mL',approximate:true,source:{citation:'Legacy test'}};
  const v=new Vocabulary([{...entries[0],reference_density:[legacy]}]);
  assert.deepEqual(createReferencePage(v,'ingredient','food')?.reference_density,[legacy]);
  assert.deepEqual(convert({},[legacy as unknown as MeasurementObservation]),{ok:false,reason:'no-applicable-record'});
  assert.ok(convert({},[observation({reference_temperature_c:20})]).ok);
  assert.ok(convert({},[observation()]).ok);
});
test('gram-authored mass remains unchanged without density, even with conflicting records',()=>{
  assert.deepEqual(convert({from:'g',to:'g',amount:213,condition:undefined},[]),{ok:true,value:213,unit:'g',approximate:false});
  assert.deepEqual(convert({from:'g',to:'g',amount:213,approximate:true},[observation(),observation()]),{ok:true,value:213,unit:'g',approximate:true});
});

test('only six exemplar enrichments load; all draft records stay below human review',()=>{
  assert.deepEqual(vocabulary.enrichments.map(e=>e.target.id).sort(),['brown-sugar','chef-knife','egg','emulsify','frying-pan','sear']);
  assert.equal(vocabulary.entries.length,766);
  for(const e of vocabulary.enrichments){assert.equal(e.review_version,0.1);for(const r of [...e.editorial??[],...e.resources??[],...e.associations??[],...e.measurements??[]])assert.equal(r.review_version,0.1);assert.ok(renderReferenceHtml(createReferencePage(vocabulary,e.target.kind,e.target.id)!).includes('Content review 0.1'));}
});
test('brown sugar original observation has no density number or executable conversion',()=>{
  const e=vocabulary.enrichments.find(e=>e.target.id==='brown-sugar')!;const m=e.measurements![0];
  assert.equal(m.value,undefined);assert.equal(m.source_volume_ml,undefined);assert.equal(m.conversion_eligible,false);
  const html=renderReferenceHtml(createReferencePage(vocabulary,'ingredient','brown-sugar')!);
  assert.ok(html.includes('213 g per 1 cup'));assert.ok(html.includes('not eligible for automatic conversion'));assert.ok(!html.includes('Culinary / bulk density:'));
});
test('egg links and usage converge on canonical parts; contextual links do not infer usage',()=>{
  const eggHtml=renderReferenceHtml(createReferencePage(vocabulary,'ingredient','egg')!);
  for(const part of ['yolk','white','shell'])assert.ok(eggHtml.includes('href="#part-'+part+'"'));
  const em=createReferencePage(vocabulary,'process','emulsify')!;assert.ok(em.contextualLinks?.some(l=>l.url==='/reference/ingredient/egg#part-yolk'));
  const r=parseRecipe('::ingredients\n(egg yolk)\n::instructions\n(egg: yolk)',{vocabulary});
  const usage=buildUsageIndex([{id:'r',name:'r',recipe:r}]);
  assert.equal(createReferencePage(vocabulary,'ingredient','egg',usage)?.parts.find(p=>p.id==='yolk')?.usage?.length,1);
  assert.deepEqual(createReferencePage(vocabulary,'process','emulsify',usage)?.usage,[]);
  assert.deepEqual(createReferencePage(vocabulary,'equipment','whisk',usage)?.usage,[]);
});
test('equipment family navigation stays canonical; material associations are not substitutions',()=>{
  assert.equal(createReferencePage(vocabulary,'equipment','chef-knife')?.typeOf?.id,'knife');
  const pan=createReferencePage(vocabulary,'equipment','frying-pan')!;
  assert.deepEqual(pan.types?.map(t=>t.id).sort(),['carbon-steel-frying-pan','cast-iron-frying-pan','non-stick-frying-pan','stainless-steel-frying-pan']);
  assert.ok(pan.enrichment?.editorial?.some(b=>b.text.includes('not a universal substitution')));
  assert.ok(pan.enrichment?.associations?.every(a=>a.relation==='used-for'));
});
test('all legacy identities are identical without enrichment; retained samples parse identically',async()=>{
  const bare=new Vocabulary(vocabulary.entries);
  for(const e of vocabulary.entries)assert.deepEqual(vocabulary.resolve(e.id,e.kind),bare.resolve(e.id,e.kind));
  const fixtures=JSON.parse(await readFile('tests/fixtures/curated-examples.json','utf8')).recipes;
  for(const f of fixtures){const source=await readFile(f.path,'utf8');assert.deepEqual(parseRecipe(source,{vocabulary}),parseRecipe(source,{vocabulary:bare}));}
});
test('arbitrary-root loader validates optional registries instead of ignoring malformed resources',async()=>{
  const root=await mkdtemp(join(tmpdir(),'osf-enrichment-'));
  try {
    for(const folder of ['ingredients','equipment','processes']){await mkdir(join(root,folder));await writeFile(join(root,folder,'index.yaml'),'schema_version: "0.3"\nentries: []\n');}
    await writeFile(join(root,'resources.yaml'),'null');await assert.rejects(()=>loadVocabulary(root),/resource registry/);
    await writeFile(join(root,'resources.yaml'),'[]');await writeFile(join(root,'enrichment.yaml'),'null');await assert.rejects(()=>loadVocabulary(root),/enrichment registry/);
  } finally {await rm(root,{recursive:true,force:true});}
});

test('contextual reference URLs honour relative overrides and suppress unsafe schemes',()=>{
  const v=make({associations:[{relation:'used-for',target:{kind:'process',id:'mix'},review_version:0.1}]});
  const relative=createReferencePage(v,'ingredient','food',undefined,{referenceUrl:(_kind,id)=>id+'.html'})!;
  assert.ok(renderReferenceHtml(relative).includes('href="mix.html"'));
  const unsafe=createReferencePage(v,'ingredient','food',undefined,{referenceUrl:()=> 'javascript:alert(1)'})!;
  assert.ok(!renderReferenceHtml(unsafe).includes('href="javascript:'));
});
test('projection is detached from source enrichment and source resource metadata',()=>{
  const p=createReferencePage(vocabulary,'ingredient','brown-sugar')!;
  const before=JSON.stringify({e:vocabulary.enrichments,r:vocabulary.resources});
  p.enrichment!.editorial![0].text='changed';p.resources![0].title='changed';
  assert.equal(JSON.stringify({e:vocabulary.enrichments,r:vocabulary.resources}),before);
});
