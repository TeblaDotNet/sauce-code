import assert from 'node:assert/strict';
import test from 'node:test';
import {parseRecipe,renderHtml,Vocabulary} from '../src/index.ts';
import {readerQuantity as quantity,displayReaderQuantity as display,servingScale,scaleReaderQuantity,convertReaderUnit,formatUSVolume,createReadingModel,awkwardAmount,anchorScale,convertReaderDensity} from '../src/reading.ts';
import type {MeasurementObservation} from '../src/vocabulary/enrichment.ts';
const metric={measurementSystem:'metric',temperatureUnit:'c'} as const,us={measurementSystem:'us',temperatureUnit:'f'} as const;
const vocabulary=new Vocabulary([{id:'egg',kind:'ingredient',names:{en:'egg'}},{id:'flour',kind:'ingredient',names:{en:'flour'}},{id:'tomato',kind:'ingredient',names:{en:'tomato'}}]);
const source='::recipe\nname: Test\nserves: 2\n::ingredients\n(egg) 1\n(flour @ !Mill) !200g\n(tomato) 1 tin\n(water) ~100ml\n(salt) to taste\n(herbs) ~~1 handful\n::equipment\n(pan) 2l\n::instructions\n{mix} <bake, 180c, 20m> ?= golden\n::notes\nWait 5 minutes.';
const recipe=parseRecipe(source,{vocabulary});
test('serving scale validates positive finite inputs',()=>{assert.equal(servingScale(2,3),1.5);for(const n of [0,-1,NaN,Infinity])assert.throws(()=>servingScale(2,n));});
for(const raw of ['200g','100ml','1','1 tin'])test('numeric ingredient scales '+raw,()=>{const q=quantity(raw)!;assert.equal(scaleReaderQuantity(q,1.5).amount,q.amount*1.5);assert.equal(q.source,raw);});
test('projection leaves authored AST, Code, equipment, time, judgement, product and prose intact',()=>{const before=JSON.stringify(recipe),code=renderHtml(recipe);const model=createReadingModel(recipe);assert.equal(model.serves,2);assert.equal(model.amounts.length,5);for(const a of model.amounts)display(a.quantity,us,1.5);assert.equal(JSON.stringify(recipe),before);assert.equal(renderHtml(recipe),code);assert.equal(recipe.source,source);assert.equal(scaleReaderQuantity(quantity('180c')!,1.5).amount,180);for(const raw of ['20m','to taste','as needed','rinse','1-2g','1 cup / 200g'])assert.equal(quantity(raw),undefined,raw);});
for(const [mark,precision] of [['!','high'],['','unspecified'],['~','approximate'],['~~','very-approximate']] as const)test('authored precision retained '+precision,()=>{const q=quantity(mark+'250ml')!;const result=display(q,us,1.5);assert.equal(result.precision,precision);assert.equal(result.quantity.precision,precision);assert.equal(result.source,mark+'250ml');assert.equal(result.scaledSource,mark+'375 ml');assert.ok(result.text.startsWith(mark));if(!mark)assert.ok(!result.text.startsWith('~'));assert.equal(scaleReaderQuantity(q,1.5).precision,precision);});
test('discrete amounts and independent anchors rescale every quantity',()=>{const model=createReadingModel(recipe),egg=model.amounts[0],tin=model.amounts[2];assert.equal(display(egg.quantity,metric,1.5).text,'1.5');assert.ok(awkwardAmount(egg,1.5));assert.ok(awkwardAmount(tin,1.5));assert.equal(awkwardAmount(egg,1),false);const anchor=anchorScale(egg,2,2);assert.deepEqual(anchor,{factor:2,serves:4});assert.equal(display(model.amounts[1].quantity,metric,anchor.factor).text,'!400 g');const fractional={...egg,quantity:quantity('1.5')!};assert.equal(awkwardAmount(fractional,1),false);assert.notEqual(anchorScale(fractional,2,2).factor,anchorScale(tin,2,2).factor);});
test('same-dimension conversion uses explicit definitions',()=>{assert.equal(convertReaderUnit(quantity('28.349523125g')!,'oz')!.amount,1);assert.equal(convertReaderUnit(quantity('1oz')!,'g')!.amount,28.349523125);assert.equal(display(quantity('180c')!,us,2).text,'356 °F');assert.equal(convertReaderUnit(quantity('1kg')!,'ml'),undefined);assert.equal(quantity('1 cup')!.dimension,'unresolved');assert.equal(quantity('1 cup','en-US')!.unit,'US cup');assert.notEqual(convertReaderUnit(quantity('1 metric cup')!,'ml')!.amount,convertReaderUnit(quantity('1 US cup')!,'ml')!.amount);});
test('bounded kitchen fractions and honest fallback',()=>{assert.equal(formatUSVolume(250)!.text,'1 US cup + 1 tbsp');assert.equal(display(quantity('!250ml')!,us).quality,'rounded-for-display');assert.equal(display(quantity('~250ml')!,us).precision,'approximate');for(const n of [1,2,10,37,100,250,500]){const result=display(quantity(n+'ml')!,us);assert.ok(!/11\/20|1\.057/.test(result.text));for(const match of result.text.matchAll(/\d+\/(\d+)/g))assert.ok(['2','3','4','8'].includes(match[1]));}assert.equal(display(quantity('1g')!,us).text,'0.04 oz');});
test('density uses reviewed condition-matching observations only',()=>{const obs:MeasurementObservation={id:'test',target:{kind:'ingredient',id:'flour'},condition:'packed',original:'Fixture',source:'fixture',unit:'g/mL',value:2,source_volume_ml:10,approximate:true,uncertainty:{basis:'fixture'},normalisation:'fixture',review_version:1,conversion_eligible:true};const request={target:obs.target,to:'mL' as const,condition:'packed'};assert.equal(convertReaderDensity([obs],quantity('100g')!,request).ok,true);assert.equal(convertReaderDensity([],quantity('100g')!,request).ok,false);assert.equal(convertReaderDensity([{...obs,conversion_eligible:false}],quantity('100g')!,request).ok,false);assert.equal(convertReaderDensity([obs],quantity('100g')!,{...request,condition:'loose'}).ok,false);assert.equal(convertReaderDensity([{...obs,source_volume_ml:undefined}],quantity('100g')!,request).ok,false);});
test('serves ranges and cocktail ambiguous ounces do not invent semantics',()=>{assert.equal(createReadingModel(parseRecipe(source.replace('serves: 2','serves: 2-4'),{vocabulary})).serves,undefined);assert.equal(createReadingModel(parseRecipe('::recipe\ntags: cocktail\n::ingredients\n(gin) 1 oz')).amounts[0].quantity.dimension,'unresolved');});
test('reading annotation supports Code and Compact without changing the AST',()=>{const before=JSON.stringify(recipe);assert.match(renderHtml(recipe,{readingAnnotations:true}),/data-reading-value/);assert.equal(JSON.stringify(recipe),before);assert.match(renderHtml(recipe,{view:'compact',readingAnnotations:true}),/data-reading-value/);});

test('approximate conversion never presents a long falsely precise decimal',()=>{assert.equal(display(quantity('~1oz')!,metric).text,'~28 g');assert.equal(display(quantity('~1oz')!,metric).quality,'rounded-for-display');});

test('fraction formatting in the same unit is not unit conversion',()=>{assert.equal(display(quantity('1.5 US cup')!,us).converted,false);assert.equal(display(quantity('1.5 tsp')!,us).converted,true);assert.equal(display(quantity('1g')!,us).converted,true);});

for(const [raw,factor,expected] of [['100g',7/6,'117 g'],['250g',7/6,'292 g'],['100g',1.4,'140 g'],['0.5g',1,'0.5 g'],['0.5g',1.4,'0.7 g'],['!100g',7/6,'!116.7 g'],['~100g',7/6,'~120 g'],['100ml',7/6,'117 ml'],['0.5ml',1.4,'0.7 ml'],['2',7/6,'2.3'],['1',1.5,'1.5'],['2',1.5,'3']] as const)test('culinary display '+raw+' x '+factor,()=>{assert.equal(display(quantity(raw)!,metric,factor).text,expected);});
test('Code has independent temperature and serving slots; Original Source stays literal',()=>{const r=parseRecipe(source+'\n::source\n<<<\nLiteral 100g\n>>>',{vocabulary});const before=JSON.stringify(r);const code=renderHtml(r,{readingAnnotations:true,syntaxSpans:true});assert.match(code,/data-reading-serves/);assert.match(code,/data-reading-value>[^<]*180c/);assert.equal(renderHtml(r,{view:'originalSource',readingAnnotations:true}),renderHtml(r,{view:'originalSource'}));assert.equal(JSON.stringify(r),before);});

test('conversion constants do not invent authored sub-gram precision',()=>{assert.equal(display(quantity('1oz')!,metric,2).text,'57 g');assert.equal(display(quantity('1kg')!,metric,7/6).text,'1.167 kg');});

test('ambiguous cups scale in their own unit without permitting conversion',()=>{
 const q=quantity('2 cups')!;
 assert.equal(display(q,metric,2).text,'4 cups');
 assert.equal(display(q,us,1.5).text,'3 cups');
 assert.equal(display(q,metric,2).converted,false);
 assert.equal(convertReaderUnit(q,'ml'),undefined);
 assert.equal(convertReaderUnit(q,'g'),undefined);
 assert.equal(q.source,'2 cups');assert.equal(q.amount,2);
});
test('safe custom labels and tiny numeric units retain their spelling during scaling',()=>{
 for(const unit of ['House-scoops','cups','dash','handful']){
  const q=quantity('2 '+unit)!;assert.equal(display(q,metric,1.5).text,'3 '+unit);
  assert.equal(convertReaderUnit(q,'ml'),undefined);
 }
 assert.equal(quantity('2 large scoops of flour'),undefined);
 const r=parseRecipe('::recipe\nserves: 2\n::ingredients\n(flour) 2 cups\n(water) 2 House-scoops');
 assert.equal(createReadingModel(r).amounts.length,2);
});
test('cup-to-mass needs both a cup basis and eligible density',()=>{
 const obs:MeasurementObservation={id:'test',target:{kind:'ingredient',id:'flour'},condition:'packed',original:'Fixture',source:'fixture',unit:'g/mL',value:2,source_volume_ml:10,approximate:true,uncertainty:{basis:'fixture'},normalisation:'fixture',review_version:1,conversion_eligible:true};
 const request={target:obs.target,to:'g' as const,condition:'packed'};
 assert.equal(convertReaderDensity([obs],quantity('2 cups')!,request).ok,false);
 assert.equal(convertReaderDensity([],quantity('2 US cup')!,request).ok,false);
 assert.equal(convertReaderDensity([{...obs,conversion_eligible:false}],quantity('2 US cup')!,request).ok,false);
 assert.equal(convertReaderDensity([obs],quantity('2 US cup')!,request).ok,true);
});

for(const [raw,expected] of [['3.333333 cups','3 1/3 cups'],['1.5 cups','1 1/2 cups'],['0.666666 cup','2/3 cup'],['0.5 cup','1/2 cup'],['0.25 cup','1/4 cup'],['1 cups','1 cup']] as const)test('familiar cup display '+raw,()=>{assert.equal(display(quantity(raw)!,us).text,expected);});
test('exact same-unit ratio stays exact and independent of unit basis',()=>{
 const q=quantity('2 cups')!;const shown=display(q,us,servingScale(6,10));
 assert.equal(shown.text,'3 1/3 cups');assert.equal(shown.quality,'exact');assert.equal(shown.converted,false);assert.equal(shown.source,'2 cups');
 assert.equal(display(q,metric,5/3).text,shown.text);assert.equal(convertReaderUnit(q,'ml'),undefined);
});
test('US measures prefer familiar singles and bounded compounds',()=>{
 const cup=236.5882365;
 assert.equal(formatUSVolume(cup*.125)!.text,'2 tbsp');
 assert.equal(formatUSVolume(cup*1.0625)!.text,'1 US cup + 1 tbsp');
 assert.equal(formatUSVolume(cup*1.5)!.text,'1 1/2 US cups');
 assert.equal(formatUSVolume(readerUnitMl(7))!.text,'2 tbsp + 1 tsp');
 function readerUnitMl(teaspoons:number){return teaspoons*4.92892159375;}
 for(let ml=1;ml<1000;ml+=7){const shown=formatUSVolume(ml);if(!shown)continue;assert.ok(Math.abs(shown.representedMl-ml)/ml<=.020000000001);assert.ok(!/4\/7|11\/20|5\/12|1\/7/.test(shown.text));}
 for(const raw of ['4/7 cup','11/20 cup']){const shown=display(quantity(raw)!,us);assert.ok(!shown.text.includes(raw.split(' ')[0]));assert.equal(shown.quality,raw==='4/7 cup'?'rounded-for-display':'exact');assert.equal(shown.converted,false);}
 assert.equal(display(quantity('0.125 cup')!,us).text,'0.125 cup'); // No assumed cup/tbsp basis.
});

for(const [raw,factor,expected] of [['100g',7/6,'4.1 oz'],['140g',1,'4.9 oz'],['35g',1,'1.2 oz'],['250g',7/6,'10.3 oz'],['40g',1,'1.4 oz'],['28.349523125g',1,'1 oz'],['500g',1,'17.6 oz'],['!100g',7/6,'!4.12 oz']] as const)test('decimal US mass '+raw,()=>{
 const q=quantity(raw)!;const result=display(q,us,factor);assert.equal(result.text,expected);assert.ok(!result.text.includes('/'));assert.equal(result.precision,q.precision);assert.equal(result.source,raw);
});
test('valid mass conversion never falls back to metric for formatting',()=>{for(const grams of [.001,1,15,40,100,207.87,500,2000]){const result=display(quantity(grams+'g')!,us);assert.match(result.text,/ oz$/);assert.ok(!result.text.includes('~'));assert.equal(result.converted,true);}assert.equal(display(quantity('40g')!,us).quality,'rounded-for-display');});
