import {readFileSync} from 'node:fs';
const idsFor=(batch:number)=>new Set<string>(JSON.parse(readFileSync('docs/knowledge-images-batch-'+batch+'.json','utf8')).pages.map((r:{id:string})=>r.id));
const first=idsFor(1),second=idsFor(2);
type RecordWithHero={target?:{kind:string;id:string};hero?:unknown};
function without<T extends RecordWithHero>(records:readonly T[],ids:Set<string>):T[]{
 return records.map(item=>{if(item.target?.kind!=='ingredient'||!ids.has(item.target.id))return item;
 const copy={...item};delete copy.hero;return copy;});
}
// Historical snapshots exclude only explicitly ledgered additions; batch suites pin the images.
export function preImageBatch<T extends RecordWithHero>(records:readonly T[]):T[]{return without(without(records,second),first);}
export function preImageBatch2<T extends RecordWithHero>(records:readonly T[]):T[]{return without(records,second);}
