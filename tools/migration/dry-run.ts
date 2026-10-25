import {readFile,readdir,mkdir,writeFile,lstat} from 'node:fs/promises';
import {resolve,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {parseDocument} from 'yaml';
import {classifyDocument,reconstruct,entryShape,indexShape,enrichmentShape,resourcesShape,selectionShape} from './ownership.ts';
import type {Field,UnknownField} from './ownership.ts';
import {canonicalEntry} from '../../src/vocabulary/canonical.ts';
import {Vocabulary} from '../../src/vocabulary/index.ts';
import type {VocabularyEntry} from '../../src/vocabulary/index.ts';
import {validateKnowledgeSnapshot} from '../../src/vocabulary/snapshot.ts';
import type {KnowledgeSnapshot} from '../../src/vocabulary/snapshot.ts';
import {createReferencePage,ingredientCompatibilityRoutes,nonReferenceProcessCompatibilityIds} from '../../src/reference/index.ts';
import {browsingCategoryRegistry} from '../../src/vocabulary/categories.ts';
const baseline='bc6060a29223a2a52443ad62f5e566a2114ffcc6';
export const hash=(value:string|Buffer)=>createHash('sha256').update(value).digest('hex');
export const json=(v:unknown)=>JSON.stringify(v,null,2)+'\n';
export function stable(value:unknown):string {
 if(Array.isArray(value))return '['+value.map(stable).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>JSON.stringify(k)+':'+stable(v)).join(',')+'}';
 return JSON.stringify(value);
}
export function splitDocument(source:string,text:string,shape:Parameters<typeof classifyDocument>[2],legacy=false){
 const doc=parseDocument(text,{uniqueKeys:true});if(doc.errors.length)throw Error(source+': '+doc.errors.map(e=>e.message).join('; '));
 const value=doc.toJS();const classified=classifyDocument(source,value,shape,legacy);
 return {value,...classified,originalText:text};
}
/** Dry-run only. Never writes under Core/Corpus/Site or copies image binaries. */
export async function dryRun(){
 const root=fileURLToPath(new URL('../../',import.meta.url));
 const output=resolve(root,'../_work/migration-stage-1');await mkdir(output,{recursive:true});
 const save=(name:string,value:unknown)=>writeFile(join(output,name),json(value));
 await save('status.json',{ok:false,reason:'Dry run in progress; projections are not authoritative until verification passes.'});
 const git=(...args:string[])=>execFileSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:20*1024*1024}).trim();
 const stage0=JSON.parse(await readFile(resolve(root,'../_work/stage-0/content-inventory.json'),'utf8')) as Record<string,{path:string;bytes:number;sha256:string}[]>;
 assert.equal(hash(await readFile(resolve(root,'../_work/stage-0/content-inventory.json'))),'70098d853c2328edb776817d8330319b886e42142d8e4f1dfaa4b079d4afe96b','Stage 0 inventory changed');
 const unresolved:UnknownField[]=[],fields:Field[]=[],sources:Record<string,{sha256:string;text:string;value:unknown}>=Object.create(null);
 const fileManifest:any[]=[],entries:VocabularyEntry[]=[],unindexed:string[]=[];
 async function inspect(path:string,shape:Parameters<typeof classifyDocument>[2],legacy=false){
  const b=await readFile(join(root,path)),text=b.toString('utf8');assert.ok(Buffer.from(text).equals(b),'Non-UTF8 source');
  const d=splitDocument(path,text,shape,legacy);fields.push(...d.fields);unresolved.push(...d.unresolved);sources[path]={sha256:hash(b),text,value:d.value};return d.value as any;
 }
 const folders=await readdir(join(root,'knowledge'));
 for(const name of folders)if(!['ingredients','equipment','processes','enrichment.yaml','resources.yaml'].includes(name))unresolved.push({source:'knowledge/'+name,path:[],reason:'Unclassified knowledge file'});
 for(const domain of ['ingredients','equipment','processes']){
  const dir='knowledge/'+domain,index=await inspect(dir+'/index.yaml',indexShape);
  assert.equal(index.schema_version,'0.3');const names=new Set<string>(index.entries.map((e:any)=>e.file));assert.equal(names.size,index.entries.length);
  for(const name of [...names].sort()){
   assert.ok(/^[a-z0-9-]+\.yaml$/.test(name),'Unsafe index path');const e=await inspect(dir+'/'+name,entryShape);
   const item=index.entries.find((i:any)=>i.file===name);assert.equal(e.id,item.id);assert.equal(e.kind,domain==='ingredients'?'ingredient':domain==='processes'?'process':'equipment');entries.push(e);
  }
  for(const name of (await readdir(join(root,dir))).sort())if(name!=='index.yaml'&&name!=='README.md'&&!names.has(name)){
   const p=dir+'/'+name;if(!name.endsWith('.yaml')){unresolved.push({source:p,path:[],reason:'Unclassified domain file'});continue;}
   unindexed.push(p);await inspect(p,entryShape,true);
  }
 }
 const enrichments=await inspect('knowledge/enrichment.yaml',enrichmentShape),resources=await inspect('knowledge/resources.yaml',resourcesShape);
 await inspect('assets/references/selection.json',selectionShape);
 const assets=(await readdir(join(root,'assets/references'))).sort();
 for(const name of assets){const p='assets/references/'+name;if((await lstat(join(root,p))).isSymbolicLink())throw Error('Unexpected symlink');
  if(!/\.(jpg|png|webp)$/.test(name)&&!['ATTRIBUTION.md','selection.json'].includes(name))unresolved.push({source:p,path:[],reason:'Unclassified reference asset'});
  const bytes=await readFile(join(root,p));fileManifest.push({source:p,originalOwner:'core',originalRevision:baseline,destinationOwnership:'open-sauce-food',classification:'Provenance',sourceHash:hash(bytes),projectedHash:hash(bytes),bytes:bytes.length,handling:'Unchanged in place; bytes referenced by hash, not migrated.'});
 }
 // Historical reports and executable policy remain preserved file-level evidence.
 const support=git('ls-tree','-r','--name-only',baseline,'--','docs','LICENSE','LICENSING.md','LICENSES','src/vocabulary/categories.ts','src/reference/index.ts','knowledge/ingredients/README.md','knowledge/equipment/README.md','knowledge/processes/README.md').split('\n').filter(p=>p&&(!p.startsWith('docs/')||/knowledge|enrichment|vocabulary|processes-equipment/.test(p)));
 const supportSources=[];
 for(const p of support){const b=await readFile(join(root,p));supportSources.push({source:p,text:b.toString('utf8'),sha256:hash(b)});fileManifest.push({source:p,originalOwner:'core',originalRevision:baseline,destinationOwnership:'retained-provenance',classification:'Compatibility',sourceHash:hash(b),projectedHash:hash(b),bytes:b.length,handling:'Preserve entire historical/licensing/policy artifact; no source-code or documentation relocation in Stage 1.'});}
 await save('unresolved-fields.json',{fields:unresolved,blocking:unresolved.length>0,transitionalDecisions:['reference retained for token links and LSP ranking','scope retained pending definition/advice review','canonical curation/evidence retained as vocabulary provenance','regional comparisons and browsing categories projected only','part-group descriptions/sources projected only; structural group remains canonical']});
 if(unresolved.length){await save('status.json',{ok:false,reason:'Unclassified fields/files',count:unresolved.length});throw Error('Unclassified knowledge: see unresolved-fields.json');}
 for(const item of stage0.core)assert.equal(hash(await readFile(join(root,item.path))),item.sha256,'Changed Stage 0 source '+item.path);
 for(const item of stage0.corpus)assert.equal(hash(await readFile(resolve(root,'../corpus',item.path))),item.sha256,'Changed Corpus source '+item.path);
 const combined=new Vocabulary(entries,{resources,enrichments}),canonicalEntries=entries.map(canonicalEntry),canonical=new Vocabulary(canonicalEntries);
 const digest=hash(stable(canonicalEntries));
 const snapshot:KnowledgeSnapshot={schemaVersion:1,provider:{id:'open-sauce-food',version:'stage-1-dry-run',sourceRevision:baseline},vocabulary:{digest,revision:baseline},resources,enrichments};
 validateKnowledgeSnapshot(snapshot,canonical,digest);
 const manifest=fields.map(f=>({...f,originalOwner:'core',originalRevision:baseline,target:(sources[f.source].value as any)?.id??(f.source.endsWith('enrichment.yaml')?(sources[f.source].value as any)[Number(f.path[0])]?.target:undefined),sourceHash:sources[f.source].sha256,projectedHash:hash(stable({form:f.form,...(f.form==='scalar'?{value:f.value}:{})}))}));
 const canonicalProjection={schemaVersion:1,digest,entries:canonicalEntries,fields:manifest.filter(f=>f.owner==='sauce-code')};
 const culinaryProjection={schemaVersion:1,snapshot,browsingCategoryRegistry,fields:manifest.filter(f=>f.owner==='open-sauce-food')};
 const checks=[];
 for(const [source,data]of Object.entries(sources)){
  const restored=reconstruct([...canonicalProjection.fields,...culinaryProjection.fields].filter(f=>f.source===source));assert.deepEqual(restored,data.value,source);
  checks.push({source,semanticHash:hash(stable(restored)),semanticEqual:true,sourceHash:data.sha256,sourceArchiveByteEqual:hash(Buffer.from(data.text))===data.sha256});
 }
 const refs=entries.map(e=>createReferencePage(combined,e.kind,e.id)).filter(Boolean);
 const heroes=enrichments.filter((e:any)=>e.hero).map((e:any)=>({target:e.target,...e.hero,sha256:fileManifest.find(f=>f.source==='assets/'+e.hero.asset)?.sourceHash}));assert.ok(heroes.every((h:any)=>h.sha256));
 const counts={indexed:entries.length,independent:entries.filter(e=>!e.canonical_target).length,references:refs.length,articles:enrichments.filter((e:any)=>e.editorial?.length).length,sources:resources.length,blocks:enrichments.flatMap((e:any)=>e.editorial??[]).length,attachments:enrichments.flatMap((e:any)=>e.resources??[]).length,associations:enrichments.flatMap((e:any)=>e.associations??[]).length,photos:new Set(heroes.map((h:any)=>h.asset)).size,observations:enrichments.flatMap((e:any)=>e.measurements??[]).length,eligible:enrichments.flatMap((e:any)=>e.measurements??[]).filter((m:any)=>m.conversion_eligible).length,recipes:stage0.corpus.filter(f=>f.path.endsWith('.opensauce')).length,legacy:unindexed.length,compatibilityRoutes:ingredientCompatibilityRoutes.length+nonReferenceProcessCompatibilityIds.length};
 assert.deepEqual(counts,{indexed:969,independent:967,references:913,articles:911,sources:775,blocks:2256,attachments:1144,associations:162,photos:349,observations:1,eligible:0,recipes:490,legacy:19,compatibilityRoutes:16});
 const routeInventory={ingredient:ingredientCompatibilityRoutes,process:nonReferenceProcessCompatibilityIds};assert.equal(hash(JSON.stringify(routeInventory)),'4dd97692095d32cfdd6b968a4da955bf7adfc4d20e10880d6f491ce93866a12f');
 await save('canonical-projection.json',canonicalProjection);await save('culinary-projection.json',culinaryProjection);
 await save('ownership-manifest.json',{schemaVersion:1,baseline,fields:manifest,files:fileManifest,unindexed});
 await save('source-provenance.json',{documents:Object.entries(sources).map(([source,d])=>({source,sha256:d.sha256,text:d.text})),supportSources,attribution:{text:await readFile(join(root,'assets/references/ATTRIBUTION.md'),'utf8')}});
 await save('round-trip.json',{semanticEquality:true,sourceBytes:'Original text retained separately; no claim of byte-identical YAML reserialization.',documents:checks});
 await save('inventory-comparison.json',{baseline,counts,heroes,compatibilityRoutes:routeInventory,allStage0KnowledgeAndCorpusHashesEqual:true});
 await save('status.json',{ok:true,baseline,counts,canonicalDigest:digest,unresolved:0});
 console.log(json({ok:true,output,counts,fields:manifest.length}));
}
if(import.meta.main)await dryRun();
