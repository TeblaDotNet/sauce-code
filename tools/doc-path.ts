import {existsSync, readdirSync} from 'node:fs';
import {dirname, basename, resolve} from 'node:path';

/** Check every component exactly, even on case-insensitive filesystems. */
export function existsWithExactCase(path: string): boolean {
  let current = resolve(path);
  if (!existsSync(current)) return false;
  while (dirname(current) !== current) {
    const parent = dirname(current);
    if (!readdirSync(parent).includes(basename(current))) return false;
    current = parent;
  }
  return true;
}
