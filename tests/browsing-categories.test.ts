import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {Vocabulary,browsingCategories,browsingCategoryRegistry,createReferencePage,renderReferenceHtml,parseRecipe,buildUsageIndex} from '../src/index.ts';
import type {VocabularyEntry} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v=await loadVocabulary('knowledge');
const sample:VocabularyEntry={kind:'ingredient',id:'test-food',names:{en:'test food'}};
test('browsing categories are optional, multi-valued and domain-validated',()=>{
  assert.equal(new Vocabulary([sample]).entries[0].categories,undefined);
  assert.deepEqual(new Vocabulary([{...sample,categories:[]}]).entries[0].categories,[]);
  assert.equal(new Vocabulary([{...sample,categories:['produce','baking-ingredients']}]).entries[0].categories?.length,2);
  for(const categories of [['unknown'],['cookware'],['produce','produce'],'produce',null,[1]])
    assert.throws(()=>new Vocabulary([{...sample,categories} as VocabularyEntry]),/categories/);
  for(const kind of ['process','equipment'] as const)
    assert.throws(()=>new Vocabulary([{...sample,kind,categories:['produce']}]),/categories/);
});
test('registry order is deterministic and independent of assignment order',()=>{
  assert.deepEqual(browsingCategories('ingredient',['baking-ingredients','produce']),browsingCategories('ingredient',['produce','baking-ingredients']));
  for(const kind of ['ingredient','process','equipment'] as const){
    const ids=browsingCategoryRegistry[kind].map(c=>c[0]);assert.equal(new Set(ids).size,ids.length);
    for(const [id,name,description] of browsingCategoryRegistry[kind]){assert.match(id,/^[a-z]+(?:-[a-z]+)*$/);assert.ok(name&&description);}
  }
});
test('categories cannot affect resolution, family/part identity, parsing or recipe backlinks',async()=>{
  const bare=new Vocabulary(v.entries.map(({categories,...entry})=>entry));
  for(const entry of v.entries){
    const strip=(matches:VocabularyEntry[])=>matches.map(({categories,...e})=>e);
    assert.deepEqual(strip(v.resolve(entry.id,entry.kind)),bare.resolve(entry.id,entry.kind));
    const a=createReferencePage(v,entry.kind,entry.id),b=createReferencePage(bare,entry.kind,entry.id);
    assert.deepEqual(a?.typeOf,b?.typeOf);assert.deepEqual(a?.parts,b?.parts);
  }
  const fixture=JSON.parse(await readFile('tests/fixtures/curated-examples.json','utf8'));
  for(const f of fixture.recipes){const text=await readFile(f.path,'utf8');const a=parseRecipe(text,{vocabulary:v}),b=parseRecipe(text,{vocabulary:bare});assert.deepEqual(a,b);assert.deepEqual(buildUsageIndex([{id:f.path,name:f.path,recipe:a}]),buildUsageIndex([{id:f.path,name:f.path,recipe:b}]));}
  const usage=buildUsageIndex([{id:'one',name:'one',recipe:parseRecipe('::ingredients\n(tomato)',{vocabulary:v})}]);
  assert.deepEqual(createReferencePage(v,'ingredient','apple',usage)?.usage,[]);
  assert.deepEqual(new Vocabulary([{...sample,categories:['produce']}]).resolve('produce','ingredient'),[]);
});
test('hidden and uncategorised concepts retain eligibility and rendering behaviour',()=>{
  const hidden:VocabularyEntry={kind:'equipment',id:'hidden',names:{en:'hidden'},reference:false,categories:['mixing']};
  assert.equal(createReferencePage(new Vocabulary([hidden]),'equipment','hidden'),undefined);
  const page=createReferencePage(new Vocabulary([sample]),'ingredient','test-food')!;
  assert.ok(renderReferenceHtml(page).includes('test food'));assert.ok(!renderReferenceHtml(page).includes('Browsing categories'));
});
test('category labels and safe links render in registry order without semantic parentage',()=>{
  const page=createReferencePage(new Vocabulary([{...sample,categories:['baking-ingredients','produce']}]),'ingredient','test-food')!;
  const html=renderReferenceHtml(page,{categoryUrl:(kind,id)=>'/'+kind+'/category/'+id+'/'});
  assert.ok(html.indexOf('>Produce</a>')<html.indexOf('>Baking ingredients</a>'));
  assert.ok(!html.includes('Type of:'));assert.ok(!html.includes('A kind of'));
  assert.ok(!renderReferenceHtml(page,{categoryUrl:()=> 'javascript:alert(1)'}).includes('javascript:'));
});
