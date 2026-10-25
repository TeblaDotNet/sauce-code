import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,readdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {Vocabulary,composeKnowledge,knowledgeDigest,parseRecipe,renderCode,renderCompact,renderHtml,renderHtmlDocument,createReferencePage,readerQuantity,scaleReaderQuantity,convertReaderUnit,convertReaderDensity} from '../src/index.ts';
import {loadCanonicalVocabulary,loadKnowledgeProvider,loadBundledCanonicalVocabulary} from '../src/vocabulary/node.ts';
import {canonicalEntry} from '../src/vocabulary/canonical.ts';
import type {KnowledgeProvider} from '../src/vocabulary/provider.ts';
const entries:any[]=[{id:'egg',kind:'ingredient',names:{en:'egg'},parts:{yolk:{names:{en:'yolk'}},white:{names:{en:'white'}}},part_groups:{separated:{process:'separate',parts:['yolk','white']}}},{id:'separate',kind:'process',names:{en:'separate'}}];
const v=new Vocabulary(entries);
const pin={entries,digest:await knowledgeDigest(entries)};
const minimal=():KnowledgeProvider=>({canonicalManifest:structuredClone(pin),snapshot:{schemaVersion:1,provider:{id:'independent-fixture-provider',version:'1',sourceRevision:'fixture'},vocabulary:{digest:pin.digest}}});
const field=(path:string[],form:string,value?:unknown)=>({target:{kind:'ingredient',id:'egg'},path,form,...(form==='scalar'?{value}:{})});
test('absence and independent provider preserve identity and optional dimensions',async()=>{
 assert.equal(await composeKnowledge(v),v);const composed=await composeKnowledge(v,minimal());assert.deepEqual(composed.entries,v.entries);assert.deepEqual(composed.enrichments,[]);
 const p=minimal();p.snapshot.enrichments=[{target:{kind:'ingredient',id:'egg'},review_version:0.1,editorial:[{id:'summary',role:'summary',text:'Synthetic fixture',review_version:0.1}]}];
 assert.equal((await composeKnowledge(v,p)).enrichments.length,1);assert.equal(v.enrichments.length,0);
});
test('manifest digest is bound to actual canonical names, not just a caller string',async()=>{
 const p=minimal();p.canonicalManifest.entries[0].names.en='changed';p.canonicalManifest.digest=await knowledgeDigest(p.canonicalManifest.entries);p.snapshot.vocabulary.digest=p.canonicalManifest.digest;
 await assert.rejects(composeKnowledge(v,p),/does not match/);
 for(const update of [(p:any)=>p.snapshot.schemaVersion=2,(p:any)=>p.snapshot.vocabulary.digest='0'.repeat(64),(p:any)=>p.canonicalManifest.digest='0'.repeat(64),(p:any)=>p.snapshot.enrichments=[{target:{kind:'ingredient',id:'missing'},review_version:0.1}]]){const p=minimal();update(p);await assert.rejects(composeKnowledge(v,p));}
});
test('explicit sidecars restore only approved editorial fields without mutation',async()=>{
 const p=minimal();p.compatibility=[field(['categories'],'array'),field(['categories','0'],'scalar','dairy-and-eggs'),field(['part_groups','separated','description'],'scalar','Separate the components.')];
 const result=await composeKnowledge(v,p);assert.deepEqual(result.entries[0].categories,['dairy-and-eggs']);assert.equal(result.entries[0].part_groups!.separated.description,'Separate the components.');assert.equal(v.entries[0].categories,undefined);
});
test('canonical overwrite, nested smuggling, bad forms and duplicate paths fail closed',async()=>{
 const bad=[field(['id'],'scalar','changed'),field(['names','en'],'scalar','changed'),field(['parts','yolk','names','en'],'scalar','changed'),field(['part_groups','separated','parts'],'array'),field(['part_groups','separated','description','names'],'object'),field(['categories'],'scalar','wrong'),field(['__proto__'],'object'),field(['categories','2'],'scalar','produce')];
 for(const f of bad){const p=minimal();p.compatibility=[f];await assert.rejects(composeKnowledge(v,p));}
 const p=minimal();p.compatibility=[field(['categories'],'array'),field(['categories'],'array')];await assert.rejects(composeKnowledge(v,p),/Duplicate/);
 const q=minimal();q.taxonomy={ingredient:[]};await assert.rejects(composeKnowledge(v,q),/taxonomy/);
});
test('source references, reviews and quantities retain existing safety rules',async()=>{
 const p=minimal();p.snapshot.enrichments=[{target:{kind:'ingredient',id:'egg'},review_version:0.1,editorial:[{id:'summary',role:'summary',text:'Synthetic',review_version:0.1,sources:['missing']}]}];await assert.rejects(composeKnowledge(v,p));
 const q=minimal();q.snapshot.quantities=[{target:{kind:'ingredient',id:'egg',parts:['yolk']},review_version:0.1,values:{typical_mass:[{value:10,unit:'g',approximate:true,source:{citation:'Synthetic test only'}}]}}];const result=await composeKnowledge(v,q);assert.equal(result.entries[0].parts!.yolk.typical_mass![0].value,10);
 assert.equal(v.entries[0].parts!.yolk.typical_mass,undefined);
 for(const factor of [1.5,2])assert.equal(scaleReaderQuantity(readerQuantity('2 cups')!,factor).amount,2*factor);
 assert.equal(scaleReaderQuantity(readerQuantity('2 scoops')!,2).unit,'scoops');assert.equal(convertReaderUnit(readerQuantity('2 cups')!,'ml'),undefined);
 assert.equal(convertReaderDensity([],readerQuantity('1 US cup')!,{target:{kind:'ingredient',id:'egg'},to:'g'}).ok,false);
 assert.equal(convertReaderUnit(readerQuantity('1kg')!,'g')!.amount,1000);
});
test('explicit Node file loading reports missing and invalid JSON, no fallback',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'knowledge-provider-'));const file=join(temp,'snapshot.json');await writeFile(file,'{');await assert.rejects(loadKnowledgeProvider(file,{canonicalManifestPath:file}),/Cannot load/);await assert.rejects(loadKnowledgeProvider(join(temp,'missing'),{canonicalManifestPath:file}),/Cannot load/);
 await writeFile(file,JSON.stringify(minimal().snapshot));const pinPath=join(temp,'pin.json');await writeFile(pinPath,JSON.stringify(pin));assert.equal((await composeKnowledge(v,await loadKnowledgeProvider(file,{canonicalManifestPath:pinPath}))).entries.length,2);
});
test('bundled canonical vocabulary retains language and styled export without provider',async()=>{
 const c=await loadBundledCanonicalVocabulary();assert.equal(c.entries.length,969);assert.deepEqual(c.enrichments,[]);assert.deepEqual(c.resources,[]);
 const recipe=parseRecipe('::recipe\nname: No provider\nserves: 2\n::ingredients\n(egg: yolk) 2\n(flour) !100g\n::instructions\n(egg: yolk) + (flour) <mix>\n',{vocabulary:c});assert.equal(recipe.diagnostics.filter(d=>d.severity==='error').length,0);
 assert.match(renderCode(recipe),/egg/);assert.match(renderCompact(recipe,{vocabulary:c}),/yolk/i);assert.match(renderHtmlDocument(recipe,{vocabulary:c,theme:'dark'}),/<!doctype html>/i);
 assert.equal(createReferencePage(c,'ingredient','egg')!.enrichment,undefined);
});
const knowledge=process.env.OSF_MIGRATION_KNOWLEDGE,baseline=process.env.OSF_STAGE0,corpus=process.env.OSF_CORPUS;
test('Stage 0 independent combined model equals real provider composition and all 490 recipes',{skip:!knowledge||!baseline||!corpus},async()=>{
 const old=await import(pathToFileURL(join(baseline!,'src/index.ts')).href),oldNode=await import(pathToFileURL(join(baseline!,'src/vocabulary/node.ts')).href);
 const original=await oldNode.loadVocabulary(join(baseline!,'knowledge'));
 const canonical=await loadCanonicalVocabulary('knowledge');
 const provider=await loadKnowledgeProvider(join(knowledge!,'dist/snapshot.json'),{canonicalManifestPath:join(knowledge!,'validation/canonical-manifest.json'),compatibilityPath:join(knowledge!,'dist/compatibility.json'),taxonomyPath:join(knowledge!,'dist/taxonomy.json')});
 const combined=await composeKnowledge(canonical,provider);
 assert.deepEqual(combined.entries,original.entries);assert.deepEqual(combined.resources,original.resources);assert.deepEqual(combined.enrichments,original.enrichments);assert.deepEqual(combined.diagnostics,original.diagnostics);
 assert.equal(combined.entries.length,969);assert.equal(combined.enrichments.length,911);assert.equal(combined.resources.length,775);assert.equal(combined.enrichments.filter(e=>e.hero).length,349);
 let refs=0;for(const e of original.entries){const expected=old.createReferencePage(original,e.kind,e.id),actual=createReferencePage(combined,e.kind,e.id);assert.deepEqual(actual,expected,e.id);if(actual)refs++;
  for(const term of [e.id,...Object.values(e.names),...Object.values(e.plural_names??{}),...(e.aliases??[]).map((a:any)=>typeof a==='string'?a:a.name),...(e.exact_names??[]).map((a:any)=>a.name)])for(const locale of [undefined,'en-GB','en-US'])assert.deepEqual(combined.resolve(term as string,e.kind,locale),original.resolve(term,e.kind,locale));
 }assert.equal(refs,913);
 const oldRefs=await import(pathToFileURL(join(baseline!,'src/reference/index.ts')).href);const newRefs=await import('../src/reference/index.ts');assert.deepEqual(newRefs.ingredientCompatibilityRoutes,oldRefs.ingredientCompatibilityRoutes);assert.deepEqual(newRefs.nonReferenceProcessCompatibilityIds,oldRefs.nonReferenceProcessCompatibilityIds);
 const measurements=combined.enrichments.flatMap(e=>e.measurements??[]);assert.equal(measurements.length,1);assert.equal(measurements[0].conversion_eligible,false);assert.equal(convertReaderDensity(measurements,readerQuantity('1 US cup')!,{target:{kind:'ingredient',id:'brown-sugar'},to:'g'}).ok,false);
 const promoted=structuredClone(provider);promoted.snapshot.enrichments!.find(e=>e.measurements?.length)!.measurements![0].conversion_eligible=true;await assert.rejects(composeKnowledge(canonical,promoted));
 const sourceInventory=JSON.parse(await readFile(resolve(corpus!,'../_work/stage-0/content-inventory.json'),'utf8')).corpus;
 const recipes:string[]=[];async function walk(dir:string){for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())await walk(p);else if(p.endsWith('.opensauce'))recipes.push(p);}}await walk(join(corpus!,'examples'));assert.equal(recipes.length,490);
 for(const file of recipes){const bytes=await readFile(file),relative=file.slice(resolve(corpus!).length+1).replaceAll('\\','/');assert.equal(createHash('sha256').update(bytes).digest('hex'),sourceInventory.find((f:any)=>f.path===relative)?.sha256,relative);
  const a=old.parseRecipe(bytes.toString(),{filename:file,vocabulary:original}),b=parseRecipe(bytes.toString(),{filename:file,vocabulary:combined});assert.deepEqual(b,a,file);assert.equal(renderCode(b),old.renderCode(a));assert.equal(renderCompact(b,{vocabulary:combined}),old.renderCompact(a,{vocabulary:original}));for(const view of ['code','compact'] as const)assert.equal(renderHtml(b,{view,vocabulary:combined}),old.renderHtml(a,{view,vocabulary:original}));
 }
});
