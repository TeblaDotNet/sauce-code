import {readFileSync} from 'node:fs';
const keysFor=(batch:number)=>new Set<string>(JSON.parse(readFileSync('docs/knowledge-images-batch-'+batch+'.json','utf8')).pages.map((r:{kind:string;id:string})=>r.kind+':'+r.id));
const first=keysFor(1),second=keysFor(2),third=keysFor(3),fourth=keysFor(4);
type RecordWithHero={target?:{kind:string;id:string};hero?:unknown};
function without<T extends RecordWithHero>(records:readonly T[],keys:Set<string>):T[]{
 return records.map(item=>{if(!item.target||!keys.has(item.target.kind+':'+item.target.id))return item;
 const copy={...item};delete copy.hero;return copy;});
}
// Reconstruct each historical registry by removing only later ledgered image additions.
export function preImageBatch3<T extends RecordWithHero>(records:readonly T[]):T[]{return without(preImageBatch4(records),third);}
export function preImageBatch2<T extends RecordWithHero>(records:readonly T[]):T[]{return without(preImageBatch3(records),second);}
export function preImageBatch<T extends RecordWithHero>(records:readonly T[]):T[]{return without(preImageBatch2(records),first);}

export function preImageBatch4<T extends RecordWithHero>(records:readonly T[]):T[]{return without(records,fourth); }
