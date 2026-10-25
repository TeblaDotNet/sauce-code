/** Build a canonical-only package resource. Active combined source is retained for Stage 4. */
import {writeFile,mkdir} from 'node:fs/promises';
import {loadCanonicalVocabulary} from '../src/vocabulary/node.ts';
const v=await loadCanonicalVocabulary('knowledge');
await mkdir('dist',{recursive:true});
await writeFile('dist/canonical-vocabulary.json',JSON.stringify({entries:v.entries})+'\n');
