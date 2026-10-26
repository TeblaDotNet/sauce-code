import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {existsWithExactCase} from '../tools/doc-path.ts';

test('documentation paths require exact file and directory casing on every platform', () => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'sauce-doc-path-')));
  try {
    mkdirSync(join(root, 'docs'));
    writeFileSync(join(root, 'docs', 'roadmap.md'), '# Roadmap');
    assert.equal(existsWithExactCase(join(root, 'docs', 'roadmap.md')), true);
    assert.equal(existsWithExactCase(join(root, 'docs', 'ROADMAP.md')), false);
    assert.equal(existsWithExactCase(join(root, 'Docs', 'roadmap.md')), false);
    assert.equal(existsWithExactCase(join(root, 'docs', 'missing.md')), false);
    assert.equal(existsWithExactCase(join(root, 'docs')), true);
  } finally {
    rmSync(root, {recursive: true, force: true});
  }
});
