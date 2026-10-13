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
type Dimension = 'mass'|'volume'|'count'|'temperature';
export interface ReaderQuantity { source:string; amount:number; unit:string; dimension:Dimension; precision:Precision }
// International avoirdupois ounce; US liquid measures (not imperial or metric cups).
export const readerUnits: Record<string,{dimension:Dimension; factor:number}> = {
 mg:{dimension:'mass',factor:.001},g:{dimension:'mass',factor:1},kg:{dimension:'mass',factor:1000},oz:{dimension:'mass',factor:28.349523125},lb:{dimension:'mass',factor:453.59237},
 ml:{dimension:'volume',factor:1},l:{dimension:'volume',factor:1000},tsp:{dimension:'volume',factor:4.92892159375},tbsp:{dimension:'volume',factor:14.78676478125},'US fl oz':{dimension:'volume',factor:29.5735295625},'US cup':{dimension:'volume',factor:236.5882365},
 'metric cup':{dimension:'volume',factor:250},'imperial fl oz':{dimension:'volume',factor:28.4130625},
 '':{dimension:'count',factor:1},tin:{dimension:'count',factor:1},can:{dimension:'count',factor:1},'°C':{dimension:'temperature',factor:1},'°F':{dimension:'temperature',factor:1}
};
const aliases:Record<string,string>={grams:'g',gram:'g',kilograms:'kg',millilitres:'ml',milliliters:'ml',litres:'l',liters:'l',pounds:'lb',lbs:'lb',ounces:'oz',teaspoons:'tsp',tablespoons:'tbsp',tins:'tin',cans:'can',c:'°C',f:'°F','°c':'°C','°f':'°F','us cup':'US cup','us cups':'US cup','us fl oz':'US fl oz'};
/** Parse only a complete numeric presentation slot. Bare cups/fl oz need an explicit authored US locale. */
export function readerQuantity(source:string, locale?:string): ReaderQuantity|undefined {
 const m=source.trim().match(/^(!|~~|~)?\s*(\d+(?:\.\d+)?(?:\s+\d+\/\d+|\/\d+)?)\s*([a-z° ]*)$/i);if(!m)return;
 const nums=m[2].split(/\s+/);const number=(s:string)=>s.includes('/')?Number(s.split('/')[0])/Number(s.split('/')[1]):Number(s);
 const amount=nums.reduce((n,s)=>n+number(s),0);if(!Number.isFinite(amount)||amount<0)return;
 let unit=m[3].trim().toLowerCase();unit=aliases[unit]??unit;
 if(/^(cups?|fl oz)$/.test(unit)){if(locale?.toLowerCase()!=='en-us')return;unit=unit==='fl oz'?'US fl oz':'US cup';}
 const def=readerUnits[unit];if(!def)return;
 return {source,amount,unit,dimension:def.dimension,precision:m[1]==='!'?'high':m[1]==='~~'?'very-approximate':m[1]==='~'?'approximate':'unspecified'};
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
function mixed(value:number):{value:number;text:string} {
 const whole=Math.floor(value);const fraction=fractions.reduce((a,b)=>Math.abs(b[0]-(value-whole))<Math.abs(a[0]-(value-whole))?b:a);
 const n=whole+(fraction[0]===1?1:0);return {value:whole+fraction[0],text:[n||'',fraction[1]].filter(Boolean).join(' ')||'0'};
}
/** Familiar fractions only, <=2% relative error. Never force a poor approximation. */
export function formatUSVolume(ml:number):{text:string;representedMl:number;unit:string}|undefined {
 const candidates:{text:string;representedMl:number;unit:string;score:number}[]=[];
 for(const unit of ['US cup','tbsp','tsp']){const measure=readerUnits[unit].factor;const x=mixed(ml/measure);if(x.value<=0)continue;const error=Math.abs(x.value*measure-ml)/Math.max(ml,1e-12);if(error<=.02+1e-12)candidates.push({unit,text:x.text+' '+unit,representedMl:x.value*measure,score:(unit==='US cup'?0:unit==='tbsp'?2:4)+(x.value>16?10:0)});}
 const cups=Math.floor(ml/readerUnits['US cup'].factor);if(cups>0){const remaining=ml-cups*readerUnits['US cup'].factor;for(const unit of ['tbsp','tsp']){const x=mixed(remaining/readerUnits[unit].factor),representedMl=cups*readerUnits['US cup'].factor+x.value*readerUnits[unit].factor;if(x.value>0&&x.value<=4&&Math.abs(representedMl-ml)/ml<=.02)candidates.push({unit:'US cup + '+unit,text:cups+' US cup + '+x.text+' '+unit,representedMl,score:unit==='tbsp'?1:3});}}
 return candidates.sort((a,b)=>a.score-b.score||Math.abs(a.representedMl-ml)-Math.abs(b.representedMl-ml))[0];
}
const marker=(p:Precision)=>p==='high'?'!':p==='approximate'?'~':p==='very-approximate'?'~~':'';
export interface QuantityDisplay {text:string;source:string;scaledSource:string;precision:Precision;quality:'exact'|'rounded-for-display';converted:boolean;scaled:boolean;quantity:ReaderQuantity;note?:string}
export function displayReaderQuantity(source:ReaderQuantity,preferences:ReadingPreferences,factor=1,ingredient=true):QuantityDisplay {
 const scaled=scaleReaderQuantity(source,factor,ingredient);
 let q=scaled,text:string|undefined,formattedUnit:string|undefined,represented=q.amount;
 if(q.dimension==='temperature')q=convertReaderUnit(q,preferences.temperatureUnit==='c'?'°C':'°F')!;
 else if(q.dimension==='mass')q=convertReaderUnit(q,preferences.measurementSystem==='metric'?(q.amount*readerUnits[q.unit].factor>=1000?'kg':'g'):(q.amount*readerUnits[q.unit].factor>=453.59237?'lb':'oz'))!;
 else if(q.dimension==='volume'){
  const ml=q.amount*readerUnits[q.unit].factor;
  if(preferences.measurementSystem==='us'){const formatted=formatUSVolume(ml);if(formatted){text=formatted.text;formattedUnit=formatted.unit;q={...q,amount:ml,unit:'ml'};represented=formatted.representedMl;}else q=convertReaderUnit(q,ml>=1000?'l':'ml')!;}
  else q=convertReaderUnit(q,ml>=1000?'l':'ml')!;
 }
 if(q.dimension==='mass'&&preferences.measurementSystem==='us'){const friendly=mixed(q.amount);if(q.amount===0||Math.abs(friendly.value-q.amount)/q.amount<=.02){text=friendly.text+' '+q.unit;represented=friendly.value;}else q=convertReaderUnit(q,scaled.amount*readerUnits[scaled.unit].factor>=1000?'kg':'g')!;}
 if(!text){represented=Number(q.precision==='approximate'||q.precision==='very-approximate'?q.amount.toPrecision(2):q.amount.toFixed(q.dimension==='temperature'?2:4));text=String(represented)+(q.unit?' '+q.unit:'');}
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
 if(head?.kind==='thing'&&(head.thingKind==='ingredient'||head.choiceKind==='ingredient')&&meaningful.slice(1).every(t=>t.kind==='text'||t.kind==='operator'&&['!','~','~~','/'].includes(t.raw))){const raw=meaningful.slice(1).map(t=>t.raw).join('').trim();const quantity=readerQuantity(raw,recipe.locale);if(quantity&&quantity.dimension!=='temperature'&&!(cocktail&&quantity.unit==='oz'))amounts.push({id:n.id,name:head.name??'ingredient',canonicalId:head.canonicalId,quantity,discrete:discretePreferred(head,quantity)});}
 visit(n.children);
 }};recipe.sections.filter(s=>s.name==='ingredients').forEach(s=>visit(s.children));
 return {serves:serves&&Number.isFinite(serves)&&amounts.length?serves:undefined,amounts,locale:recipe.locale};
}
export function awkwardAmount(item:ReadingAmount,factor:number):boolean {return item.discrete&&factor!==1&&Math.abs(item.quantity.amount*factor-Math.round(item.quantity.amount*factor))>1e-9;}
export function anchorScale(item:ReadingAmount,whole:number,authoredServes:number) {if(!item.discrete||!Number.isInteger(whole)||whole<1||item.quantity.amount<=0)throw Error('Invalid discrete anchor');const factor=servingScale(item.quantity.amount,whole);return {factor,serves:authoredServes*factor};}
export const methodScalingWarning='This recipe has been scaled from its original serving size. Ingredient quantities have been adjusted, but larger changes may require changes to cooking method, batch size, equipment capacity or timing.';
