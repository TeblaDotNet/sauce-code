import { open, realpath } from 'node:fs/promises';
import { dirname, resolve, relative, isAbsolute, extname } from 'node:path';
import type { Node, Recipe } from '../model/index.ts';

const maxFile = 5 * 1024 * 1024, maxTotal = 20 * 1024 * 1024;
/** Bounded local-resource adapter. No network access; no filesystem calls in renderers. */
export async function embedRecipeImages(recipe: Recipe, filename: string): Promise<{ images: Map<string, string>; warnings: string[] }> {
  const root = await realpath(dirname(resolve(filename)));
  const paths = new Set<string>(), images = new Map<string, string>(), warnings: string[] = [];
  function visit(nodes: Node[]): void { for (const n of nodes) {
    if (n.kind === 'metadata' && n.key === 'image') paths.add(n.value);
    if (n.kind === 'prose') for (const m of n.text.matchAll(/!\[([^\]]*)\]\(([^)]*)\)/g)) paths.add(m[2]);
    if (n.kind === 'statement') for (const t of n.tokens) if (t.kind === 'image') paths.add(t.path ?? '');
    if (n.kind === 'statement' || n.kind === 'group') visit(n.children);
  } }
  visit(recipe.preamble); for (const s of recipe.sections) if (!s.originalSource) visit(s.children);
  let total = 0;
  for (const path of paths) {
    try {
      const local = decodeURIComponent(path);
      if (!local || /^[a-z][a-z0-9+.-]*:/i.test(local) || isAbsolute(local) || /[\\:?#\x00-\x1f]/.test(local) || local.split('/').includes('..')) throw Error('not a permitted recipe-relative path (remote images are never fetched)');
      const target = await realpath(resolve(root, local));
      const rel = relative(root, target);
      if (isAbsolute(rel) || rel === '..' || rel.startsWith('../') || rel.startsWith('..\\')) throw Error('path escapes recipe directory');
      const handle = await open(target, 'r');
      try {
        const info = await handle.stat();
        if (!info.isFile() || info.size > maxFile || total + info.size > maxTotal) throw Error('not a regular image within the 5 MiB/file and 20 MiB/export limits');
        // Bounded read even if the file grows after stat.
        const bytes = Buffer.alloc(Math.min(maxFile + 1, maxTotal - total + 1));
        let bytesRead = 0;
        while (bytesRead < bytes.length) {
          const chunk = await handle.read(bytes, bytesRead, bytes.length - bytesRead, bytesRead);
          if (!chunk.bytesRead) break;
          bytesRead += chunk.bytesRead;
        }
        const b = bytes.subarray(0, bytesRead);
        if (bytesRead > maxFile || total + bytesRead > maxTotal) throw Error('image exceeds export limits');
        const ext = extname(local).toLowerCase();
        const mime = ext === '.png' && b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png' :
          ['.jpg','.jpeg'].includes(ext) && b[0] === 255 && b[1] === 216 && b[2] === 255 ? 'jpeg' :
          ext === '.gif' && /^GIF8[79]a$/.test(b.subarray(0,6).toString()) ? 'gif' :
          ext === '.webp' && b.subarray(0,4).toString() === 'RIFF' && b.subarray(8,12).toString() === 'WEBP' ? 'webp' : undefined;
        if (!mime) throw Error('unsupported image or mismatched signature; use PNG, JPEG, GIF or WebP');
        images.set(path, 'data:image/' + mime + ';base64,' + b.toString('base64')); total += bytesRead;
      } finally { await handle.close(); }
    } catch (error) { warnings.push('Image not embedded: ' + path + ' (' + (error instanceof Error && 'code' in error ? 'cannot read local image: ' + String(error.code) : error instanceof Error ? error.message : String(error)) + '). Original reference retained; this image is not portable.'); }
  }
  return { images, warnings };
}
