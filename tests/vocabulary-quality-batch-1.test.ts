import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRecipe, renderHtml, recipeReferenceUrl, createReferencePage, nonReferenceProcessCompatibilityIds, Vocabulary } from '../src/index.ts';
import { loadVocabulary } from '../src/vocabulary/node.ts';
const v = await loadVocabulary('knowledge');
const plurals = [
  ['chicken breasts','chicken-breast'], ['chicken thighs','chicken-thigh'],
  ['green onions','spring-onion'], ['spring onions','spring-onion'], ['red onions','red-onion'],
  ['lemons','lemon'], ['egg yolks','egg'], ['egg whites','egg'],
] as const;
const parts = [
  ['garlic clove','garlic','clove'], ['garlic cloves','garlic','clove'],
  ['basil leaf','basil','leaf'], ['basil leaves','basil','leaf'],
  ['rosemary leaf','rosemary','leaf'], ['rosemary leaves','rosemary','leaf'],
  ['lemon zest','lemon','zest'], ['lime zest','lime','zest'], ['orange zest','orange','zest'],
  ['egg yolks','egg','yolk'], ['egg whites','egg','white'],
] as const;
function ingredient(name: string) {
  const source = '::recipe\nname: Proof\n::ingredients\n(' + name + ') 2\n::instructions\n(' + name + ') <mix>\n';
  const recipe = parseRecipe(source, {vocabulary:v});
  assert.equal(recipe.source,source);
  assert.deepEqual(recipe.diagnostics,[]);
  const node=recipe.sections.find(s=>s.name==='ingredients')!.children.find(n=>n.kind==='statement')!;
  assert.equal(node.kind,'statement');
  if(node.kind!=='statement')throw Error('Missing declaration');
  return {recipe, token:node.tokens.find(t=>t.kind==='thing')!};
}
for(const [name,id] of plurals)test('explicit plural: '+name,()=>assert.equal(ingredient(name).token.canonicalId,id));
for(const [name,id,part] of parts)test('compound part retains parent and anchor: '+name,()=>{
  const {recipe,token}=ingredient(name);
  assert.equal(token.canonicalId,id);
  assert.deepEqual(token.partResolution,{ids:[part],complete:true});
  assert.equal(token.raw,'('+name+')');
  for(const view of ['code','compact'] as const)
    assert.ok(renderHtml(recipe,{view,referenceUrl:recipeReferenceUrl}).includes('/reference/ingredient/'+id+'#part-'+part));
});
test('physical parts do not erase independent products or invent English plural rules',()=>{
  assert.equal(ingredient('chicken breasts').token.canonicalId,'chicken-breast');
  assert.equal(ingredient('chicken: breasts').token.canonicalId,'chicken');
  assert.deepEqual(ingredient('chicken: breasts').token.partResolution,{ids:['breast'],complete:true});
  assert.equal(ingredient('lime juice').token.canonicalId,'lime-juice');
  assert.equal(ingredient('lime: juice').token.canonicalId,'lime');
  assert.equal(ingredient('cloves').token.canonicalId,'cloves');
  assert.deepEqual(v.resolveIngredient('leaves'),[]);
  assert.deepEqual(v.resolveIngredient('garlic clovess'),[]);
  assert.equal(v.resolvePartPath('lemon',['rind']).complete,false);
  assert.equal(v.resolve('self-raising flour','ingredient')[0].id,'self-raising-flour');
  assert.notEqual(v.resolve('olive oil','ingredient')[0].id,v.resolve('extra virgin olive oil','ingredient')[0].id);
});
test('lexical part collisions remain rejected, not resolved by order',()=>{
  assert.throws(()=>new Vocabulary([
    {id:'garlic',kind:'ingredient',names:{en:'garlic'},parts:{clove:{names:{en:'clove'},lexical_names:['garlic cloves']}}},
    {id:'other',kind:'ingredient',names:{en:'garlic cloves'}}
  ]),/Ambiguous part lexical_names/);
});
test('current accepted names have no newly ambiguous same-domain matches',()=>{
  for(const e of v.entries)for(const name of [e.id,...Object.values(e.names),...Object.values(e.plural_names??{}),...(e.aliases??[]).map(a=>typeof a==='string'?a:a.name)])
    assert.deepEqual(v.resolve(name,e.kind).map(x=>x.id),[e.id],name);
  assert.equal(v.entries.filter(e=>e.kind==='ingredient').length,414);
  assert.equal(v.entries.filter(e=>e.kind==='ingredient'&&!e.canonical_target).length,412);
});
test('generic actions retain syntax, identity and semantic colour without reference links',()=>{
  assert.equal(nonReferenceProcessCompatibilityIds.length,15);
  for(const id of nonReferenceProcessCompatibilityIds){
    const recipe=parseRecipe('::recipe\nname: Action\n::instructions\n<'+id+'>',{vocabulary:v});
    assert.deepEqual(recipe.diagnostics,[]);
    const n=recipe.sections[1].children[0];
    assert.equal(n.kind,'statement');
    if(n.kind!=='statement')throw Error('Missing action');
    assert.equal(n.tokens[0].canonicalId,id);
    assert.equal(n.tokens[0].reference,false);
    assert.equal(createReferencePage(v,'process',id),undefined);
    const html=renderHtml(recipe,{syntaxSpans:true,referenceUrl:recipeReferenceUrl});
    assert.ok(html.includes('os-syntax-process'));
    assert.ok(!html.includes('/reference/process/'+id));
  }
  for(const id of ['roast','ferment','emulsify'])assert.ok(createReferencePage(v,'process',id));
});
test('equipment plurals and bounded categories use existing identities',()=>{
  for(const [name,id] of [['baking trays','baking-tray'],['baking sheets','baking-tray'],['paper towels','paper-towel']])
    assert.deepEqual(v.resolve(name,'equipment').map(e=>e.id),[id]);
  for(const [id,category] of [['cutter','knives-and-cutting'],['dish','storage-and-containers'],['grease-pan','bakeware'],['tray','storage-and-containers'],['vessel','storage-and-containers']])
    assert.deepEqual(v.resolve(id,'equipment')[0].categories,[category]);
  for(const id of ['plate','soup-plate'])assert.deepEqual(v.resolve(id,'equipment')[0].categories,['tableware-and-serving']);
  assert.deepEqual(v.resolve('cooking-wood','equipment')[0].categories,['fuel-and-smoking-materials']);
});
