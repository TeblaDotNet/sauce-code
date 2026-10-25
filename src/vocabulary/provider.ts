import { Vocabulary } from './index.ts';
import type { VocabularyEntry } from './index.ts';
import { canonicalEntry } from './canonical.ts';
import { validateKnowledgeSnapshot } from './snapshot.ts';
import type { KnowledgeSnapshot } from './snapshot.ts';
import { validateBrowsingTaxonomy } from './categories.ts';

export interface CanonicalManifest { digest: string; entries: readonly VocabularyEntry[] }
export interface KnowledgeProvider {
  snapshot: KnowledgeSnapshot;
  /** Generated pin, never an independently editable vocabulary. */
  canonicalManifest: CanonicalManifest;
  compatibility?: readonly unknown[];
  taxonomy?: unknown;
}
export const stableKnowledgeJson = (value: unknown): string => {
  if (Array.isArray(value)) return '[' + value.map(stableKnowledgeJson).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.entries(value).filter(([,v]) => v !== undefined).sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0).map(([k,v]) => JSON.stringify(k) + ':' + stableKnowledgeJson(v)).join(',') + '}';
  return JSON.stringify(value);
};
export async function knowledgeDigest(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(stableKnowledgeJson(value));
  return Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)), b => b.toString(16).padStart(2,'0')).join('');
}
/** Same runtime field projection as the existing Node adapter. Raw evidence is not serialized through this helper. */
export function runtimeVocabularyEntry(data: VocabularyEntry): VocabularyEntry {
  const entry: VocabularyEntry = {id:data.id,kind:data.kind,canonical_name:data.canonical_name,names:data.names,aliases:data.aliases};
  for (const field of ['exact_names','regional_mappings','canonical_target','scope','categories','states','type_of','plural_names','variants','parts','part_groups','typical_mass','reference_density','nutrition','reference','curation','status','evidence','observed_parameters','observed_qualifiers'] as const)
    if (data[field] !== undefined) Object.assign(entry,{[field]:data[field]});
  return entry;
}
const record = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const fail = (reason: string): never => {throw Error('Invalid knowledge provider: ' + reason);};
const cleanKey = (v: unknown): v is string => typeof v === 'string' && !['__proto__','constructor','prototype'].includes(v);
type Shape = 'string' | { array: Shape } | { object: Record<string,Shape> };
const source: Shape = {object:{citation:'string',url:'string',accessed:'string',note:'string'}};
const categories: Shape = {array:'string'};
const regional: Shape = {array:{object:{name:'string',locale:'string',relation:'string',scope:'string',target:'string',sources:{array:source}}}};
function shapeAt(shape: Shape, path: string[]): Shape {
  for (const key of path) {
    if (typeof shape === 'string') return fail('Child under scalar');
    if ('array' in shape) {if (!/^(0|[1-9][0-9]*)$/.test(key)) return fail('Invalid array index');shape=shape.array;}
    else {if (!Object.hasOwn(shape.object,key)) return fail('Unapproved overlay key');shape=shape.object[key];}
  }
  return shape;
}
function overlay(entries: VocabularyEntry[], fields: readonly unknown[]) {
  const byKey = new Map(entries.map(e=>[e.kind+':'+e.id,e]));
  const seen=new Set<string>();
  const ordered=[...fields];
  for(const f of ordered) if(!record(f)||!Array.isArray(f.path)||!f.path.length||!f.path.every(cleanKey)) fail('Invalid compatibility field');
  ordered.sort((a,b)=>(a as any).path.length-(b as any).path.length);
  for(const value of ordered){
    const f=value as Record<string,any>;
    // Accept Stage 2's original source coordinates, or explicit concept targets.
    const match=typeof f.source==='string'?/^knowledge\/(ingredients|equipment|processes)\/[a-z0-9-]+\.yaml$/.exec(f.source):null;
    const kind=record(f.target)?f.target.kind:match?.[1]==='ingredients'?'ingredient':match?.[1]==='equipment'?'equipment':match?.[1]==='processes'?'process':undefined;
    const id=record(f.target)?f.target.id:f.target;
    const entry=byKey.get(kind+':'+id);if(!entry)fail('Unknown compatibility target');
    const path=f.path as string[];if(path.some(k=>/^[0-9]+$/.test(k)&&Number(k)>fields.length))fail('Out-of-bounds array index');let rest=path.slice(),base:any=entry,shape:Shape;
    while(rest[0]==='parts'){const id=rest[1];if(!id||!base.parts||!Object.hasOwn(base.parts,id))fail('Unknown part');base=base.parts[id];rest=rest.slice(2);}
    if(rest[0]==='part_groups'){
      if(!base.part_groups||!Object.hasOwn(base.part_groups,rest[1]))fail('Unknown part group');
      if(rest[2]==='description')shape='string';else if(rest[2]==='sources')shape={array:source};else fail('Canonical group overwrite');
      rest=rest.slice(3);
    }else if(rest[0]==='categories'&&base===entry){shape=categories;rest=rest.slice(1);}
    else if(rest[0]==='regional_mappings'&&base===entry){shape=regional;rest=rest.slice(1);}
    else fail('Canonical or unsupported overlay field');
    shape=shapeAt(shape!,rest);
    const expected=typeof shape==='string'?'scalar':'array' in shape?'array':'object';
    if(f.form!==expected||(expected==='scalar'?typeof f.value!=='string':Object.hasOwn(f,'value')))fail('Invalid overlay shape/value');
    const key=kind+':'+id+JSON.stringify(path);if(seen.has(key))fail('Duplicate overlay field');seen.add(key);
    let parent:any=entry;for(const k of path.slice(0,-1)){if(!Object.hasOwn(parent,k)||!record(parent[k])&&!Array.isArray(parent[k]))fail('Missing overlay parent');parent=parent[k];}
    Object.defineProperty(parent,path.at(-1)!,{value:expected==='scalar'?f.value:expected==='array'?[]:{},enumerable:true,writable:true,configurable:true});
  }
  // Reject sparse arrays even when ordinary runtime validation might ignore holes.
  const walk=(v:any)=>{if(Array.isArray(v)){for(let i=0;i<v.length;i++){if(!Object.hasOwn(v,i))fail('Sparse overlay array');walk(v[i]);}}else if(record(v))Object.values(v).forEach(walk);};
  entries.forEach(walk);
}
/** Portable and explicit. No file access, network, provider discovery or global defaults. */
export async function composeKnowledge(vocabulary: Vocabulary, provider?: KnowledgeProvider): Promise<Vocabulary> {
  if(provider===undefined)return vocabulary;
  if(!record(provider)||Object.keys(provider).some(k=>!['snapshot','canonicalManifest','compatibility','taxonomy'].includes(k)))fail('Invalid envelope');
  const pin=provider.canonicalManifest;
  if(!record(pin)||!Array.isArray(pin.entries)||typeof pin.digest!=='string'||await knowledgeDigest(pin.entries)!==pin.digest)fail('Invalid canonical manifest digest');
  const actual=vocabulary.entries.map(canonicalEntry),expected=pin.entries.map(e=>canonicalEntry(runtimeVocabularyEntry(e)));
  if(stableKnowledgeJson(actual)!==stableKnowledgeJson(expected))fail('Canonical manifest does not match this vocabulary');
  validateKnowledgeSnapshot(provider.snapshot,vocabulary,pin.digest);
  if(provider.taxonomy!==undefined)validateBrowsingTaxonomy(provider.taxonomy);
  if(provider.compatibility!==undefined&&!Array.isArray(provider.compatibility))fail('Invalid compatibility sidecar');
  const entries=structuredClone(actual);
  overlay(entries,provider.compatibility??[]);
  for(const q of provider.snapshot.quantities??[]){
    let entry:any=entries.find(e=>e.kind===q.target.kind&&e.id===q.target.id)!;
    for(const part of q.target.parts??[])entry=entry.parts[part];
    Object.assign(entry,structuredClone(q.values));
  }
  return new Vocabulary(entries,provider.snapshot,provider.taxonomy);
}
