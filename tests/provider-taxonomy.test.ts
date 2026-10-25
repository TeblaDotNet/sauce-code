import test from 'node:test';
import assert from 'node:assert/strict';
import {Vocabulary,composeKnowledge,knowledgeDigest,browsingCategories,browsingCategoryRegistry,createReferencePage,renderReferenceHtml} from '../src/index.ts';
import {loadCanonicalVocabulary} from '../src/vocabulary/node.ts';

test('canonical-only Core retains identities and has no implicit editorial taxonomy',async()=>{
 const v=await loadCanonicalVocabulary('knowledge');
 assert.equal(v.entries.length,969);assert.equal(v.entries.filter(e=>!e.canonical_target).length,967);
 assert.equal(v.entries.filter(e=>createReferencePage(v,e.kind,e.id)).length,913);
 assert.deepEqual(v.enrichments,[]);assert.deepEqual(v.resources,[]);assert.deepEqual(v.taxonomy,{ingredient:[],equipment:[],process:[]});
 for(const e of v.entries){assert.equal(e.categories,undefined);assert.equal(e.regional_mappings,undefined);assert.equal(e.reference_density,undefined);}
 assert.deepEqual(browsingCategories('ingredient'),[]);assert.deepEqual(browsingCategoryRegistry,v.taxonomy);
 assert.equal(v.resolveIngredient('egg-yolk')[0].entry.id,'egg');
});
test('provider taxonomy is instance-local, structurally validated and cannot alter identity',async()=>{
 const entries=[{id:'sample',kind:'ingredient' as const,names:{en:'sample'}}],v=new Vocabulary(entries),digest=await knowledgeDigest(entries);
 const provider={canonicalManifest:{entries,digest},snapshot:{schemaVersion:1 as const,provider:{id:'fixture',version:'1',sourceRevision:'fixture'},vocabulary:{digest}},taxonomy:{ingredient:[['test-group','Test label','Synthetic fixture description']] as [string,string,string][],process:[],equipment:[]},compatibility:[{target:{kind:'ingredient',id:'sample'},path:['categories'],form:'array'},{target:{kind:'ingredient',id:'sample'},path:['categories','0'],form:'scalar',value:'test-group'}]};
 const result=await composeKnowledge(v,provider);assert.equal(result.resolve('sample','ingredient')[0].id,'sample');
 assert.match(renderReferenceHtml(createReferencePage(result,'ingredient','sample')!),/Test label/);
 assert.deepEqual(v.taxonomy,browsingCategoryRegistry);assert.equal(v.entries[0].categories,undefined);
 const changed=structuredClone(provider);changed.taxonomy.ingredient[0][1]='Another label';assert.equal((await composeKnowledge(v,changed)).taxonomy.ingredient[0][1],'Another label');assert.equal(result.taxonomy.ingredient[0][1],'Test label');
 for(const taxonomy of [{}, {...provider.taxonomy,ingredient:[['test-group','','']]}, {...provider.taxonomy,ingredient:[...provider.taxonomy.ingredient,...provider.taxonomy.ingredient]}])await assert.rejects(composeKnowledge(v,{...provider,taxonomy}));
 await assert.rejects(composeKnowledge(v,{...provider,taxonomy:{ingredient:[],process:[],equipment:[]}}),/categories/);
});
