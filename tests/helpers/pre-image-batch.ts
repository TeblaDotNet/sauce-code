import {readFileSync} from 'node:fs';
const ids = new Set<string>(JSON.parse(readFileSync('docs/knowledge-images-batch-1.json','utf8')).pages.map((r:{id:string})=>r.id));
// Reconstruct the historical content snapshot, excluding only the 30 later image additions.
// The image-batch suite independently pins every new hero and the complete pre-image registry.
export function preImageBatch<T extends {target?:{kind:string;id:string};hero?:unknown}>(records:T[]):T[]{
 return records.map(item=>{if(item.target?.kind!=='ingredient'||!ids.has(item.target.id))return item;
 const copy={...item};delete copy.hero;return copy;});
}
