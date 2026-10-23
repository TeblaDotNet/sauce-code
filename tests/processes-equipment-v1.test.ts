import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {parseRecipe, createReferencePage, nonReferenceProcessCompatibilityIds} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v=await loadVocabulary('knowledge');
const ledger=JSON.parse(readFileSync('docs/processes-equipment-v1-decisions.json','utf8'));
for(const c of ledger.cases.filter((c:any)=>['new','alias','plural'].includes(c.decision)))test(c.kind+' resolves '+c.term,()=>{
 assert.deepEqual(v.resolve(c.term,c.kind).map(e=>e.id),[c.target]);
});
test('new concepts have explicit scope, categories and generated unchecked status',()=>{
 for(const a of ledger.implemented.additions){const e=v.resolve(a.id,a.kind)[0];assert.ok(e);assert.ok(e.categories?.length);assert.deepEqual(e.curation,{origin:'generated',review:'unchecked'});assert.equal(!!createReferencePage(v,a.kind,a.id),a.reference);}
});
test('scope boundaries and deferred terms are not guessed',()=>{
 for(const [name,id]of [['cup','measuring-cup'],['teaspoon','measuring-spoon'],['griddle','gridiron'],['roll out','roll'],['juice','express-citrus-oil']])assert.notEqual(v.resolve(name,name==='roll out'||name==='juice'?'process':'equipment')[0].id,id);
 for(const c of ledger.cases.filter((c:any)=>['local','deferred'].includes(c.decision)))assert.deepEqual(v.resolve(c.term,c.kind),[],c.term);
 assert.equal(v.resolve('microwave','equipment')[0].id,'microwave-oven');assert.equal(v.resolve('microwave','process')[0].id,'microwave');
});
test('generic and composite actions keep identity and valid source-preserving syntax',()=>{
 for(const id of [...ledger.implemented.additions.filter((a:any)=>a.kind==='process'&&!a.reference).map((a:any)=>a.id),...nonReferenceProcessCompatibilityIds]){
 const source='::recipe\nname: Test\n::instructions\n<'+id+'>\n';const recipe=parseRecipe(source,{vocabulary:v});assert.equal(recipe.source,source);assert.deepEqual(recipe.diagnostics,[]);assert.equal(createReferencePage(v,'process',id),undefined);
 }
 for(const id of ['roast','ferment','emulsify','release','roll'])assert.ok(createReferencePage(v,'process',id));
});
test('accepted equipment and process spellings are unambiguous',()=>{
 for(const e of v.entries.filter(e=>e.kind!=='ingredient'))for(const name of [e.id,e.canonical_name,...Object.values(e.names),...Object.values(e.plural_names??{}),...(e.aliases??[]).map(a=>typeof a==='string'?a:a.name)].filter((x):x is string=>!!x))assert.deepEqual(v.resolve(name,e.kind).map(x=>x.id),[e.id],name);
});
