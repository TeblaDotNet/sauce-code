/** Explicit raw-document schema and ownership, not the runtime loader's whitelist. */
export type Classification = 'Canonical'|'Editorial'|'Quantitative'|'Provenance'|'Compatibility'|'Unresolved';
export type Owner = 'sauce-code'|'open-sauce-food';
export interface Rule { classification: Classification; owner: Owner; handling: string }
export interface Shape { form: 'scalar'|'object'|'array'|'dictionary'|'union'; fields?: Record<string,Shape>; item?: Shape; choices?: Shape[]; rule?: Rule }
const rule = (classification: Classification, owner: Owner, handling: string): Rule => ({classification,owner,handling});
export const canonical = rule('Canonical','sauce-code','Retain canonical identity; no language changes.');
export const editorial = rule('Editorial','open-sauce-food','Project only; combined runtime remains authoritative in Stage 1.');
export const quantitative = rule('Quantitative','open-sauce-food','Values move later; interpretation and eligibility remain Core contracts.');
export const provenance = rule('Provenance','sauce-code','Preserve vocabulary evidence and historical paths, not resolver aliases.');
export const culinaryProvenance = rule('Provenance','open-sauce-food','Preserve sources, licences and review without promotion.');
export const compatibility = rule('Compatibility','sauce-code','Retain transitional metadata; reference policy, diagnostics and concise identity scope unchanged.');
const scalar: Shape = {form:'scalar'};
const obj = (fields: Record<string,Shape>, r?: Rule): Shape => ({form:'object',fields,rule:r});
const array = (item: Shape, r?: Rule): Shape => ({form:'array',item,rule:r});
const dict = (item: Shape): Shape => ({form:'dictionary',item});
const marked = (shape: Shape, r: Rule): Shape => ({...shape,rule:r});
const scalars = (names: string): Record<string,Shape> => Object.fromEntries(names.split(' ').map(n=>[n,scalar]));
const strings = array(scalar);
const source = obj(scalars('citation url accessed note'));
const review = {review_version:marked(scalar,culinaryProvenance),reviewed_at:marked(scalar,culinaryProvenance)};
const target = obj({...scalars('kind id'),parts:strings});
const quantity = obj({...scalars('value unit approximate locale state'),source});
const quantities = {
 typical_mass:array(quantity,quantitative),reference_density:array(quantity,quantitative),
 nutrition:obj({per_100g:dict(quantity)},quantitative)
};
const observed = array(obj(scalars('value count')));
const named = {...scalars('canonical_id'),names:dict(scalar),aliases:strings};
const part: Shape = obj({});
const ingredient = {
 names:dict(scalar),plural_names:dict(scalar),lexical_names:strings,
 variants:dict(obj(named)),parts:dict(part),
 part_groups:dict(obj({process:scalar,parts:strings,description:marked(scalar,editorial),sources:array(source,culinaryProvenance)})),...quantities
};
part.fields={...ingredient,aliases:strings};
const entry: Shape = obj({},canonical);
const evidence: Shape = obj({},provenance);
evidence.fields={...scalars('canonicalisation current_observation_count current_recipe_count decision definition legacy_observation_count migration review_note scope'),
 legacy_terms:array(obj(scalars('term count'))),observed_terms:array(obj(scalars('term count'))),seen_in:strings,
 sources:array(obj(scalars('title url'))),canonicalisation:obj({...scalars('baseline_commit confidence pass reason review'),absorbed_entries:array(entry)})};
entry.fields={...scalars('id kind canonical_name'),...ingredient,
 aliases:array({form:'union',choices:[scalar,obj({...scalars('name type warning'),observed_count:marked(scalar,provenance),legacy_count:marked(scalar,provenance)})]}),
 states:dict(obj({names:dict(scalar),aliases:strings})),type_of:scalar,
 exact_names:array(obj({name:scalar,locale:scalar,scope:marked(scalar,provenance),sources:array(source,provenance)})),
 canonical_target:obj({ingredient:scalar,parts:strings}),
 regional_mappings:array(obj({...scalars('name locale relation scope target'),sources:array(source,culinaryProvenance)}),editorial),
 categories:array(scalar,editorial),reference:marked(scalar,compatibility),scope:marked(scalar,compatibility),
 curation:obj(scalars('origin review'),provenance),status:marked(scalar,provenance),evidence,
 observed_parameters:marked(observed,provenance),observed_qualifiers:marked(observed,provenance),
 observed_forms:array(obj(scalars('syntax count')),provenance),seen_in:marked(strings,provenance),legacy_observation:marked(scalar,provenance)
};
export const entryShape=entry;
export const indexShape=obj({...scalars('schema schema_version canonical_concept_count'),
 status:marked(scalar,provenance),current_recipe_count:marked(scalar,provenance),legacy_evidence:marked(scalar,provenance),
 entries:array(obj({...scalars('id canonical_name file'),aliases:marked(scalar,provenance)}))},canonical);
const heroFields=scalars('asset title source_page source_file creator licence licence_url attribution_text alt reviewed_at width height changes caption');
export const enrichmentShape=array(obj({target,...review,hero:obj(heroFields,culinaryProvenance),
 editorial:array(obj({...scalars('id role text'),sources:strings,...review})),
 resources:array(obj({...scalars('resource role order note'),...review})),
 associations:array(obj({...scalars('relation note'),target,sources:strings,...review})),
 measurements:array(obj({...scalars('id product_scope condition original source locator accessed unit value approximate reference_temperature_c normalisation source_volume_ml conversion_eligible'),target,...review,uncertainty:obj(scalars('basis lower upper'))}),quantitative)
}),editorial);
export const resourcesShape=array(obj(scalars('id title url publisher type checked_at review_scope duration_seconds commercial_context notes')),culinaryProvenance);
export const selectionShape=obj({method:scalar,candidates:array(obj({...heroFields,...scalars('concept selected attribution_required source_site original_width original_height checked_at notes acquired_from asset_sha256')}))},culinaryProvenance);
export interface Field extends Rule { source: string; path: string[]; form: 'scalar'|'object'|'array'; value?: unknown }
export interface UnknownField { source: string; path: string[]; reason: string }
/** Every mapping key, array position and container is accounted for. Dynamic keys
 * exist only in explicit dictionaries (locale labels, part IDs, nutrient IDs). */
export function classifyDocument(source: string, value: unknown, shape: Shape, legacy=false) {
 const fields: Field[]=[], unresolved: UnknownField[]=[];
 const visit=(v: unknown,s: Shape|undefined,path:string[],inherited:Rule,forced?:Rule)=>{
  if(!s){unresolved.push({source,path,reason:'Unclassified source field'});return;}
  const effective=forced??s.rule??inherited;
  if(s.form==='union')s=s.choices!.find(c=>c.form==='scalar'?v===null||typeof v!=='object':!!v&&typeof v==='object'&&!Array.isArray(v));
  const actual=v===null||typeof v!=='object'?'scalar':Array.isArray(v)?'array':'object';
  if(!s||(s.form==='dictionary'?'object':s.form)!==actual){unresolved.push({source,path,reason:'Unexpected source shape'});return;}
  fields.push({...effective,source,path,form:actual,...(actual==='scalar'?{value:v}:{})});
  const force=forced??(path.includes('evidence')?provenance:undefined);
  if(actual==='array')(v as unknown[]).forEach((x,i)=>visit(x,s!.item,[...path,String(i)],effective,force));
  if(actual==='object')for(const [k,x]of Object.entries(v as Record<string,unknown>)){
   if(['__proto__','constructor','prototype'].includes(k)){unresolved.push({source,path:[...path,k],reason:'Unsafe mapping key'});continue;}
   visit(x,s.form==='dictionary'?s.item:s.fields?.[k],[...path,k],effective,force);
  }
 };
 visit(value,shape,[],shape.rule??canonical,legacy?{...provenance,handling:'Unindexed legacy evidence; preserve but never activate.'}:undefined);
 return {fields,unresolved};
}
/** Reassemble typed nodes, not the preserved source text. Missing parents,
 * duplicate paths, sparse arrays and unsafe keys are rejected. */
export function reconstruct(fields: readonly Field[]): unknown {
 const nodes=new Map<string,any>();
 for(const f of [...fields].sort((a,b)=>a.path.length-b.path.length)){
  const key=JSON.stringify(f.path);if(nodes.has(key))throw Error('Duplicate field');
  if(f.path.some(k=>['__proto__','constructor','prototype'].includes(k)))throw Error('Unsafe field');
  const v=f.form==='array'?[]:f.form==='object'?{}:structuredClone(f.value);
  if(f.path.length){const parent=nodes.get(JSON.stringify(f.path.slice(0,-1)));if(!parent||typeof parent!=='object')throw Error('Missing parent');Object.defineProperty(parent,f.path.at(-1)!,{value:v,writable:true,enumerable:true,configurable:true});}
  nodes.set(key,v);
 }
 if(!nodes.has('[]'))throw Error('Missing root');
 const check=(v:any)=>{if(Array.isArray(v)){for(let i=0;i<v.length;i++){if(!Object.hasOwn(v,i))throw Error('Sparse reconstruction');check(v[i]);}}else if(v&&typeof v==='object')Object.values(v).forEach(check);};
 check(nodes.get('[]'));return nodes.get('[]');
}
