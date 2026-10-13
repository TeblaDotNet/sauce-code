import type { Recipe, Node, Token, Precision } from './model/index.ts';
import { convertIngredientMeasurement } from './vocabulary/measurement.ts';
import type { MeasurementRequest } from './vocabulary/measurement.ts';
import type { MeasurementObservation } from './vocabulary/enrichment.ts';
export interface ReadingPreferences { measurementSystem: 'metric' | 'us'; temperatureUnit: 'c' | 'f' }
export const defaultReadingPreferences: ReadingPreferences = {measurementSystem:'metric',temperatureUnit:'c'};
export function readingPreferences(value: unknown): ReadingPreferences {
 const v=value as Partial<ReadingPreferences>|null;
 return {measurementSystem:v?.measurementSystem==='us'?'us':'metric',temperatureUnit:v?.temperatureUnit==='f'?'f':'c'};
}
type Dimension = 'mass'|'volume'|'count'|'temperature'|'unresolved';
export interface ReaderQuantity { source:string; amount:number; unit:string; dimension:Dimension; precision:Precision }
// International avoirdupois ounce; US liquid measures (not imperial or metric cups).
export const readerUnits: Record<string,{dimension:Dimension; factor:number}> = {
 mg:{dimension:'mass',factor:.001},g:{dimension:'mass',factor:1},kg:{dimension:'mass',factor:1000},oz:{dimension:'mass',factor:28.349523125},lb:{dimension:'mass',factor:453.59237},
 ml:{dimension:'volume',factor:1},l:{dimension:'volume',factor:1000},tsp:{dimension:'volume',factor:4.92892159375},tbsp:{dimension:'volume',factor:14.78676478125},'US fl oz':{dimension:'volume',factor:29.5735295625},'US cup':{dimension:'volume',factor:236.5882365},
 'metric cup':{dimension:'volume',factor:250},'imperial fl oz':{dimension:'volume',factor:28.4130625},
 '':{dimension:'count',factor:1},tin:{dimension:'count',factor:1},can:{dimension:'count',factor:1},'°C':{dimension:'temperature',factor:1},'°F':{dimension:'temperature',factor:1}
};
const aliases:Record<string,string>={grams:'g',gram:'g',kilograms:'kg',millilitres:'ml',milliliters:'ml',litres:'l',liters:'l',pounds:'lb',lbs:'lb',ounces:'oz',teaspoons:'tsp',tablespoons:'tbsp',tins:'tin',cans:'can',c:'°C',f:'°F','°c':'°C','°f':'°F','us cup':'US cup','us cups':'US cup','us fl oz':'US fl oz'};
/** Parse only a complete numeric presentation slot. Unresolved units can scale; conversion still requires a known basis. */
export function readerQuantity(source:string, locale?:string): ReaderQuantity|undefined {
 const m=source.trim().match(/^(!|~~|~)?\s*(\d+(?:\.\d+)?(?:\s+\d+\/\d+|\/\d+)?)\s*([a-z° -]*)$/i);if(!m)return;
 const nums=m[2].split(/\s+/);const number=(s:string)=>s.includes('/')?Number(s.split('/')[0])/Number(s.split('/')[1]):Number(s);
 const amount=nums.reduce((n,s)=>n+number(s),0);if(!Number.isFinite(amount)||amount<0)return;
 let unit=m[3].trim().toLowerCase();unit=aliases[unit]??unit;
 if(/^(cups?|fl oz)$/.test(unit)&&locale?.toLowerCase()==='en-us')unit=unit==='fl oz'?'US fl oz':'US cup';
 const def=Object.hasOwn(readerUnits,unit)?readerUnits[unit]:undefined;
 if(!def){
  // A single unit label is safe; reject prose, compound expressions and durations.
  if(!/^[a-z]+(?:-[a-z]+)*$/i.test(m[3].trim())&&unit!=='fl oz')return;
  if(/^(m|s|h|min|mins|minutes?|seconds?|hours?)$/.test(unit))return;
  unit=m[3].trim();
 }
 return {source,amount,unit,dimension:def?.dimension??'unresolved',precision:m[1]==='!'?'high':m[1]==='~~'?'very-approximate':m[1]==='~'?'approximate':'unspecified'};
}
export function servingScale(authored:number, requested:number):number {
 if(!Number.isFinite(authored)||authored<=0||!Number.isFinite(requested)||requested<=0)throw Error('Servings must be finite and positive');
 const factor=requested/authored;if(!Number.isFinite(factor)||factor<=0)throw Error('Invalid serving scale');return factor;
}
export function scaleReaderQuantity(q:ReaderQuantity,factor:number,ingredient=true):ReaderQuantity {
 if(!Number.isFinite(factor)||factor<=0)throw Error('Invalid serving scale');
 const amount=ingredient&&q.dimension!=='temperature'?q.amount*factor:q.amount;
 if(!Number.isFinite(amount))throw Error('Scaled quantity exceeds supported range');return {...q,amount};
}
export function convertReaderUnit(q:ReaderQuantity,to:string):ReaderQuantity|undefined {
 const target=readerUnits[to];if(!target||target.dimension!==q.dimension)return;
 let amount=q.amount;
 if(q.dimension==='temperature')amount=q.unit===to?q.amount:to==='°F'?q.amount*9/5+32:(q.amount-32)*5/9;
 else amount=q.amount*readerUnits[q.unit].factor/target.factor;
 return {...q,unit:to,amount};
}
/** Explicit opt-in only: reuse existing target/condition/review/source-volume eligibility. */
export function convertReaderDensity(observations:readonly MeasurementObservation[],q:ReaderQuantity,request:Omit<MeasurementRequest,'amount'|'from'|'approximate'>) {
 const base=q.dimension==='mass'?convertReaderUnit(q,'g'):q.dimension==='volume'?convertReaderUnit(q,'ml'):undefined;
 if(!base)return {ok:false as const,reason:'invalid-request'};
 return convertIngredientMeasurement(observations,{...request,amount:base.amount,from:base.dimension==='mass'?'g':'mL',approximate:q.precision==='approximate'||q.precision==='very-approximate'});
}
const fractions=[[0,''],[1/8,'1/8'],[1/4,'1/4'],[1/3,'1/3'],[1/2,'1/2'],[2/3,'2/3'],[3/4,'3/4'],[1,'']] as const;
const cupFractions = fractions.filter(f=>f[0]!==1/8);
const tablespoonFractions = fractions.filter(f=>[0,1/2,1].includes(f[0]));
const teaspoonFractions = fractions.filter(f=>[0,1/4,1/2,3/4,1].includes(f[0]));
function kitchenMixed(value:number, allowed:readonly (readonly [number,string])[]) {
 const whole=Math.floor(value);
 return allowed.map(([fraction,label])=>({value:whole+fraction,text:[whole+(fraction===1?1:0)||'',label].filter(Boolean).join(' ')||'0'}));
}
const cupLabel=(value:number,explicit=false)=>(explicit?'US ':'')+(value>1?'cups':'cup');
const relativeError=(actual:number,expected:number)=>Math.abs(actual-expected)/Math.max(Math.abs(expected),1e-12);
/** Exact first; then <=1% and <=2% error bands, familiarity/simplicity, numerical error. */
export function formatUSVolume(ml:number):{text:string;representedMl:number;unit:string}|undefined {
 if(!Number.isFinite(ml)||ml<=0)return;
 type Candidate={text:string;representedMl:number;unit:string;score:number;error:number};
 const candidates:Candidate[]=[];
 const add=(text:string,representedMl:number,unit:string,score:number)=>{const error=relativeError(representedMl,ml);if(error<=.02+1e-12)candidates.push({text,representedMl,unit,score,error});};
 for(const [unit,allowed,score] of [['US cup',cupFractions,0],['tbsp',tablespoonFractions,2],['tsp',teaspoonFractions,4]] as const){
  for(const x of kitchenMixed(ml/readerUnits[unit].factor,allowed)){
   if(x.value<=0||unit!=='US cup'&&x.value>16)continue;
   add(x.text+' '+(unit==='US cup'?cupLabel(x.value,true):unit),x.value*readerUnits[unit].factor,unit,score);
  }
 }
 // Bounded two-part measures: a familiar cup amount plus tbsp/tsp, or tbsp plus tsp.
 for(const [base,allowed,small,score] of [['US cup',cupFractions,'tbsp',1],['US cup',cupFractions,'tsp',3],['tbsp',tablespoonFractions,'tsp',3]] as const){
  for(const first of kitchenMixed(ml/readerUnits[base].factor,allowed)){
   const remaining=ml-first.value*readerUnits[base].factor;if(first.value<=0||remaining<=0)continue;
   for(const second of kitchenMixed(remaining/readerUnits[small].factor,small==='tbsp'?tablespoonFractions:teaspoonFractions)){
    if(second.value<=0||second.value>4)continue;
    add(first.text+' '+(base==='US cup'?cupLabel(first.value,true):base)+' + '+second.text+' '+small,first.value*readerUnits[base].factor+second.value*readerUnits[small].factor,base+' + '+small,score);
   }
  }
 }
 const band=(error:number)=>error<=1e-10?0:error<=.01?1:2;
 return candidates.sort((a,b)=>band(a.error)-band(b.error)||a.score-b.score||a.error-b.error||a.text.length-b.text.length)[0];
}
/** No unit basis is inferred: only the numerical cup amount is formatted. */
function formatUnresolvedCups(amount:number) {
 const familiar=kitchenMixed(amount,cupFractions).filter(x=>x.value>0&&relativeError(x.value,amount)<=.02).sort((a,b)=>relativeError(a.value,amount)-relativeError(b.value,amount))[0];
 if(familiar)return {text:familiar.text+' '+cupLabel(familiar.value),represented:familiar.value};
 // No cross-unit escape hatch for ambiguous cups. A short decimal is explicitly rounded.
 const short=Number(amount.toPrecision(2));
 const represented=relativeError(short,amount)<=.02?short:Number(amount.toPrecision(3));
 return {text:String(represented)+' '+cupLabel(represented),represented};
}
/** Culinary decimals are display policy only; arithmetic keeps the unrounded amount. */
function culinaryNumber(q:ReaderQuantity,source:ReaderQuantity,scaled:boolean):number {
 if(q.precision==='approximate'||q.precision==='very-approximate')return Number(q.amount.toPrecision(2));
 if(q.dimension==='count'&&scaled)return Number(q.amount.toFixed(1));
 if(['g','kg','ml','l'].includes(q.unit)&&scaled){
  const basis=readerUnits[q.unit].factor;
  const authored=['mg','g','kg','ml','l'].includes(source.unit)?source.amount*readerUnits[source.unit].factor:Math.round(source.amount*readerUnits[source.unit].factor);
  // Preserve the authored sub-unit resolution, including fractions, up to four decimals.
  let places=0;while(places<4&&Math.abs(authored*10**places-Math.round(authored*10**places))>1e-8)places++;
  places=Math.max(places,q.precision==='high'?1:0);
  const rounded=Number((q.amount*basis).toFixed(places))/basis;
  return rounded===0&&q.amount>0?Number(q.amount.toPrecision(1)):rounded;
 }
 return Number(q.amount.toFixed(q.dimension==='temperature'?2:4));
}
const marker=(p:Precision)=>p==='high'?'!':p==='approximate'?'~':p==='very-approximate'?'~~':'';
export interface QuantityDisplay {text:string;source:string;scaledSource:string;precision:Precision;quality:'exact'|'rounded-for-display';converted:boolean;scaled:boolean;quantity:ReaderQuantity;note?:string}
export function displayReaderQuantity(source:ReaderQuantity,preferences:ReadingPreferences,factor=1,ingredient=true):QuantityDisplay {
 const scaled=scaleReaderQuantity(source,factor,ingredient);
 let q=scaled,text:string|undefined,formattedUnit:string|undefined,represented=q.amount;
 if(q.dimension==='unresolved'&&/^cups?$/i.test(q.unit)){const result=formatUnresolvedCups(q.amount);text=result.text;represented=result.represented;}
 else if(q.dimension==='temperature')q=convertReaderUnit(q,preferences.temperatureUnit==='c'?'°C':'°F')!;
 else if(q.dimension==='mass')q=convertReaderUnit(q,preferences.measurementSystem==='metric'?(q.amount*readerUnits[q.unit].factor>=1000?'kg':'g'):'oz')!;
 else if(q.dimension==='volume'){
  const ml=q.amount*readerUnits[q.unit].factor;
  if(preferences.measurementSystem==='us'){const formatted=formatUSVolume(ml);if(formatted){text=formatted.text;formattedUnit=formatted.unit;q={...q,amount:ml,unit:'ml'};represented=formatted.representedMl;}else q=convertReaderUnit(q,ml>=1000?'l':'ml')!;}
  else q=convertReaderUnit(q,ml>=1000?'l':'ml')!;
 }
 if(q.dimension==='mass'&&preferences.measurementSystem==='us'){
  represented=Number(q.amount.toFixed(q.precision==='high'?2:1));
  // Keep tiny positive amounts visible without reverting to metric or inventing zero.
  if(represented===0&&q.amount>0)represented=Number(q.amount.toPrecision(1));
  text=String(represented)+' oz';
 }
 if(!text){represented=culinaryNumber(q,source,ingredient&&factor!==1);text=String(represented)+(q.unit?' '+q.unit:'');}
 const rounded=Math.abs(represented-q.amount)>Math.max(1e-10,Math.abs(q.amount)*1e-10);
 const converted=(formattedUnit??q.unit)!==source.unit;
 return {text:marker(source.precision)+text,source:source.source,scaledSource:marker(source.precision)+String(Number(scaled.amount.toPrecision(12)))+(scaled.unit?' '+scaled.unit:''),precision:source.precision,quality:rounded?'rounded-for-display':'exact',converted,scaled:ingredient&&q.dimension!=='temperature'&&factor!==1,quantity:q,...(rounded?{note:'Rounded for display; use the source measurement for best accuracy.'}:{})};
}
export interface ReadingAmount {id:string;name:string;canonicalId?:string;quantity:ReaderQuantity;discrete:boolean}
export interface ReadingModel {serves?:number;amounts:ReadingAmount[];locale?:string}
export function discretePreferred(token:Token,quantity:ReaderQuantity):boolean {
 return quantity.dimension==='count'&&(quantity.unit==='tin'||quantity.unit==='can'||(!token.parts?.length&&!token.partResolution?.ids.length&&['egg','lemon','lime'].includes(token.canonicalId??'')));
}
/** Only complete one-ingredient declarations: no assignment, alternative, process or packaging-size guesses. */
export function createReadingModel(recipe:Recipe):ReadingModel {
 const metadata=recipe.sections.filter(s=>s.name==='recipe').flatMap(s=>s.children).filter(n=>n.kind==='metadata'&&n.key==='serves');
 const serves=metadata.length===1&&metadata[0].kind==='metadata'&&/^\d+(?:\.\d+)?$/.test(metadata[0].value.trim())?Number(metadata[0].value):undefined;
 const cocktail=recipe.sections.flatMap(s=>s.children).some(n=>n.kind==='metadata'&&n.key==='tags'&&n.value.split(',').some(t=>t.trim()==='cocktail'));
 const amounts:ReadingAmount[]=[];
 const visit=(nodes:Node[])=>{for(const n of nodes){if(n.kind==='group'){visit(n.children);continue;}if(n.kind!=='statement')continue;
 const meaningful=n.tokens.filter(t=>t.raw.trim()),head=meaningful[0];
 if(head?.kind==='thing'&&(head.thingKind==='ingredient'||head.choiceKind==='ingredient')&&meaningful.slice(1).every(t=>t.kind==='text'||t.kind==='operator'&&['!','~','~~','/'].includes(t.raw))){const raw=meaningful.slice(1).map(t=>t.raw).join('').trim();const quantity=readerQuantity(raw,recipe.locale);if(quantity&&cocktail&&quantity.unit==='oz')quantity.dimension='unresolved';if(quantity&&quantity.dimension!=='temperature')amounts.push({id:n.id,name:head.name??'ingredient',canonicalId:head.canonicalId,quantity,discrete:discretePreferred(head,quantity)});}
 visit(n.children);
 }};recipe.sections.filter(s=>s.name==='ingredients').forEach(s=>visit(s.children));
 return {serves:serves&&Number.isFinite(serves)&&amounts.length?serves:undefined,amounts,locale:recipe.locale};
}
export function awkwardAmount(item:ReadingAmount,factor:number):boolean {return item.discrete&&factor!==1&&Math.abs(item.quantity.amount*factor-Math.round(item.quantity.amount*factor))>1e-9;}
export function anchorScale(item:ReadingAmount,whole:number,authoredServes:number) {if(!item.discrete||!Number.isInteger(whole)||whole<1||item.quantity.amount<=0)throw Error('Invalid discrete anchor');const factor=servingScale(item.quantity.amount,whole);return {factor,serves:authoredServes*factor};}
export const methodScalingWarning='This recipe has been scaled from its original serving size. Ingredient quantities have been adjusted, but larger changes may require changes to cooking method, batch size, equipment capacity or timing.';
