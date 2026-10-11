import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {loadVocabulary} from '../src/vocabulary/node.ts';
test('knowledge adapter keeps an explicit arbitrary root and excludes unindexed observations',async()=>{
 const root=await mkdtemp(join(tmpdir(),'osf-knowledge-root-'));
 try{
  for(const folder of ['ingredients','equipment','processes']){
   await mkdir(join(root,folder));await writeFile(join(root,folder,'index.yaml'),'schema_version: "0.3"\nentries: '+(folder==='ingredients'?'\n  - file: canonical.yaml\n':'[]\n'));
  }
  await writeFile(join(root,'ingredients','canonical.yaml'),'id: courgette\nkind: ingredient\nnames:\n  en: courgette\naliases:\n  - zucchini\nobserved_qualifiers:\n  - value: tiny green\n    count: 1\n');
  await writeFile(join(root,'ingredients','unindexed.yaml'),'id: accidental\nkind: ingredient\nnames:\n  en: accidental\n');
  const v=await loadVocabulary(root);assert.equal(v.entries.length,1);
  assert.equal(v.resolve('zucchini','ingredient')[0].id,'courgette');
  assert.deepEqual(v.resolve('tiny green','ingredient'),[]);assert.deepEqual(v.resolve('accidental','ingredient'),[]);
 }finally{await rm(root,{recursive:true,force:true});}
});
