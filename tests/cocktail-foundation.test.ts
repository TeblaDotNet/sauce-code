import assert from 'node:assert/strict';
import test from 'node:test';
import {parseRecipe,renderCode,renderCompact,renderHtml,semanticTokens,createReferencePage,renderReferenceHtml,Vocabulary} from '../src/index.ts';
import type {Recipe,Node} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const v=await loadVocabulary('knowledge');
const added={ingredient:['gin','vodka','rum','rye-whiskey','vermouth','simple-syrup','bitters','absinthe','amaro'],process:['muddle','fine-strain'],equipment:['mixing-glass','bar-spoon','jigger']} as const;
const tokens=(r:Recipe)=>{const ns:Node[]=[];const walk=(nodes:Node[])=>{for(const n of nodes){ns.push(n);if('children' in n)walk(n.children);}};r.sections.forEach(s=>walk(s.children));return ns.flatMap(n=>n.kind==='statement'?semanticTokens(n.tokens):[]);};
test('cocktail foundation resolves once, enriches every new concept and reuses browsing groups',()=>{
 for(const kind of ['ingredient','process','equipment'] as const)for(const id of added[kind]){
  const entry=v.entries.find(e=>e.id===id&&e.kind===kind)!;assert.ok(entry,id);assert.equal(v.entries.filter(e=>e.id===id&&e.kind===kind).length,1);
  assert.equal(v.resolve(entry.names.en,kind).length,1);const page=createReferencePage(v,kind,id)!;assert.equal(page.enrichment?.review_version,0.1);
  assert.ok(page.categories?.includes(kind==='ingredient'?'beverages':kind==='process'?'beverage-and-bar':'coffee-and-bar'));
  const html=renderReferenceHtml(page);for(const title of ['about','learn','sources'])assert.ok(html.includes('::'+title),id+title);
  assert.ok(html.includes('Version 0.1 — machine generated, not yet human reviewed'));
  if(kind==='ingredient'){const sentences=page.enrichment!.editorial!.find(b=>b.role==='summary')!.text.split(/(?<=[.!?])\s+/);assert.equal(sentences.length,2,id);assert.match(sentences[0],/\b(?:is|are)\b/);}
 }
});
test('brands and style prose are optional and never aliases or canonical types',()=>{
 const gin=createReferencePage(v,'ingredient','gin')!;assert.ok(renderReferenceHtml(gin).includes('::brands'));assert.ok(renderReferenceHtml(gin).includes('::types'));
 assert.ok(!renderReferenceHtml(createReferencePage(v,'ingredient','simple-syrup')!).includes('::brands'));
 for(const name of ['Beefeater','Peychaud\'s','Nonino','La Fée Parisienne'])assert.deepEqual(v.resolve(name,'ingredient'),[]);
 assert.ok(v.entries.find(e=>e.id==='gin'&&e.kind==='ingredient')!.variants?.['london-dry']);assert.ok(!gin.types?.some(t=>t.name==='Beefeater'));
 const bare=new Vocabulary(v.entries);assert.deepEqual(v.resolve('gin','ingredient'),bare.resolve('gin','ingredient'));
});
const source=`::recipe
name: Sazerac
subtitle: Authoring contract fixture
category: drink
::ingredients
(gin) 10ml
(gin; London dry) 10ml
(gin; London dry @ Beefeater) !10ml
(reference gin) = (gin @ ~Beefeater) ~10ml -OR- (gin; London dry) ~10ml
(bitters @ !Peychaud's) ~~2 dashes
(Scotch whisky @ Lagavulin 16) 7.5ml
::equipment
(mixing glass)
::instructions
<stir, in (mixing glass)>
`;
test('cocktail-shaped product strengths, alternatives and quantity precision remain independent',()=>{
 const r=parseRecipe(source,{vocabulary:v});assert.equal(r.modelVersion,1);assert.deepEqual(r.diagnostics,[]);
 const ts=tokens(r),products=ts.filter(t=>t.product);assert.deepEqual(products.map(t=>t.product!.strength),['specified','approximate','exact','specified']);
 assert.equal(products[0].variant,'London dry');assert.equal(products[2].canonicalId,'bitters');assert.equal(products[3].product!.name,'Lagavulin 16');
 assert.ok(ts.some(t=>t.raw==='-OR-'));assert.equal(r.source,source);
 for(const raw of ['!10ml','~10ml','~~2 dashes'])assert.ok(renderCode(r).includes(raw));
 const code=renderCode(r);assert.equal(renderCode(parseRecipe(code,{vocabulary:v})),code);
 assert.ok(renderCompact(r).includes("@ !Peychaud's"));
 for(const view of ['code','compact'] as const){const html=renderHtml(r,{view,syntaxSpans:true});for(const strength of ['specified','approximate','exact'])assert.ok(html.includes('data-product-strength="'+strength+'"'));assert.ok(html.includes('Peychaud&#39;s'));}
});
test('same title is legal with distinct caller IDs; subtitle stays optional metadata',()=>{
 const a=parseRecipe(source),b=parseRecipe('::recipe\nname: Sazerac\n::ingredients\n(brandy) 50ml\n');
 assert.equal(a.modelVersion,b.modelVersion);assert.deepEqual(b.diagnostics,[]);assert.equal(b.sections[0].children.some(n=>n.kind==='metadata'&&n.key==='subtitle'),false);
 assert.ok(renderCode(a).includes('subtitle: Authoring contract fixture'));
});
test('contextual Spec / Method prose labels leave Code and ordinary recipes unchanged and escaped',()=>{
 const r=parseRecipe(source);const labels={recipe:'Spec details',instructions:'Method'};
 assert.ok(renderHtml(r,{view:'compact',sectionLabels:labels}).includes('>Method</h2>'));
 assert.ok(renderHtml(r,{view:'compact',sectionLabels:labels,collapsedSections:['recipe']}).includes('<summary>Spec details</summary>'));
 assert.ok(renderHtml(r,{view:'code',sectionLabels:labels}).includes('>::instructions</h2>'));
 assert.ok(renderHtml(r,{view:'compact'}).includes('>Instructions</h2>'));
 assert.ok(renderHtml(r,{view:'compact',sectionLabels:{instructions:'<script>'}}).includes('&lt;script&gt;'));
});
