import { readFile } from 'node:fs/promises';
import type { KnowledgeProvider } from './provider.ts';
/** File loading only. composeKnowledge validates the envelope against the caller's vocabulary. */
export async function loadKnowledgeProvider(snapshotPath: string, paths: {
  canonicalManifestPath: string; compatibilityPath?: string; taxonomyPath?: string;
}): Promise<KnowledgeProvider> {
  const read=async(path:string)=>{try{return JSON.parse(await readFile(path,'utf8'));}catch(error){throw new Error('Cannot load knowledge provider file: '+path,{cause:error});}};
  return {snapshot:await read(snapshotPath),canonicalManifest:await read(paths.canonicalManifestPath),
    ...(paths.compatibilityPath?{compatibility:await read(paths.compatibilityPath)}:{}),
    ...(paths.taxonomyPath?{taxonomy:await read(paths.taxonomyPath)}:{})};
}
