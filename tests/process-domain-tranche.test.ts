import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {parse as yaml} from 'yaml';
import {Vocabulary,processCategories,parseRecipe,renderCode,renderCompact,renderHtml,createReferencePage,renderReferenceHtml} from '../src/index.ts';
import type {VocabularyEntry} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const added='emulsify dredge baste deep-fry shallow-fry parboil pressure-cook shock fillet autolyse blind-bake brine pickle lacto-ferment sous-vide barbecue cure temper-chocolate temper-eggs temper-spices'.split(' ');
const clarified='grill broil prove scald brown toast'.split(' ');
const v=await loadVocabulary('knowledge');
for(const id of added)test('approved process resolves with useful public scope: '+id,()=>{
 const entries=v.resolve(id,'process');assert.equal(entries.length,1);assert.equal(entries[0].id,id);assert.equal(entries[0].type_of,undefined);
 const page=createReferencePage(v,'process',id)!;assert.ok(page);assert.ok(page.scope!.length>60);assert.ok(page.categories!.length);assert.match(renderReferenceHtml(page),/<h2>Scope<\/h2>/);assert.match(renderReferenceHtml(page),/<h2>Browsing categories<\/h2>/);
});
test('ambiguous bare heads stay unresolved; bbq is purely lexical',()=>{
 assert.deepEqual(v.resolve('temper','process'),[]);assert.deepEqual(v.resolve('proof','process'),[]);
 assert.equal(v.resolve('bbq','process')[0].id,'barbecue');
 for(const id of ['temper-chocolate','temper-eggs','temper-spices'])assert.equal(v.resolve(id.replaceAll('-',' '),'process')[0].id,id);
});
test('near neighbours retain independent identities',()=>{
 for(const group of [['grill','broil','barbecue','smoke'],['deep-fry','fry','shallow-fry','pan-fry'],['parboil','blanch','shock'],['brine','pickle','cure','marinate'],['fillet','debone']]){
  assert.deepEqual(group.map(id=>v.resolve(id,'process').map(e=>e.id)),group.map(id=>[id]));
 }
});
test('categories are optional domain-validated sets, not relationships',()=>{
 const entry:VocabularyEntry={id:'example',kind:'process',names:{en:'example'}};
 assert.equal(new Vocabulary([entry]).entries[0].categories,undefined);
 const multi={...entry,categories:['modernist','moist-heat-cooking'] as const};
 assert.deepEqual(new Vocabulary([{...multi,categories:[...multi.categories]}]).resolve('example','process')[0].categories,multi.categories);
 for(const categories of ['frying',[null],['unknown'],['frying','frying'],null])assert.throws(()=>new Vocabulary([{...entry,categories} as unknown as VocabularyEntry]),/categories/);
 for(const kind of ['ingredient','equipment'] as const)assert.throws(()=>new Vocabulary([{...entry,kind,categories:['frying']}]),/categories/);
 assert.throws(()=>new Vocabulary([{...entry,type_of:'fry'}]),/type_of/);
 assert.equal(processCategories.length,12);
 for(const scope of [null,12,' '])assert.throws(()=>new Vocabulary([{...entry,scope} as unknown as VocabularyEntry]),/scope/);
});
test('metadata does not alter recipe parsing, identity or renderer output',()=>{
 const bare=new Vocabulary(v.entries.map(({categories,scope,...entry})=>entry));
 const source='::ingredients\n(egg) 1\n::instructions\n(egg) <temper eggs>\n    <emulsify>\n';
 const a=parseRecipe(source,{vocabulary:v}),b=parseRecipe(source,{vocabulary:bare});assert.deepEqual(a,b);
 for(const render of [renderCode,renderCompact,renderHtml])assert.equal(render(a),render(b));
 const page=createReferencePage(new Vocabulary([{id:'example',kind:'process',names:{en:'example'},scope:'<script>&"',categories:['modernist']}]),'process','example')!;
 const html=renderReferenceHtml(page);assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>'));
 const projected=createReferencePage(v,'process','sous-vide')!;projected.categories!.push('frying');assert.deepEqual(createReferencePage(v,'process','sous-vide')!.categories,['modernist','moist-heat-cooking']);
});
test('only approved concepts acquire editorial metadata and counts match indexes',async()=>{
 assert.equal(v.entries.length,969);assert.equal(v.entries.filter(e=>e.kind==='process').length,300);
 assert.equal(v.entries.filter(e=>e.kind==='process'&&e.reference!==false).length,245);
 assert.equal(v.entries.filter(e=>e.reference!==false).length,913);
 for(const entry of v.entries.filter(e=>e.scope!==undefined))assert.ok([...added,...clarified].includes(entry.id));
 for(const id of clarified)assert.ok(createReferencePage(v,'process',id)!.scope);
 const index=yaml(await readFile('knowledge/processes/index.yaml','utf8'));assert.equal(index.canonical_concept_count,300);assert.equal(index.entries.length,300);assert.equal(new Set(index.entries.map((e:{id:string})=>e.id)).size,300);
 // Existing unindexed legacy records must not become additional concepts.
 assert.equal(v.entries.some(e=>e.kind==='process'&&e.id==='bring-to-boil'),false);
 assert.equal(v.entries.some(e=>e.kind==='process'&&e.id==='stir-in'),false);
});
