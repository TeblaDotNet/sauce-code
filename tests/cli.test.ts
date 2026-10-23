import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { mkdtempSync, readFileSync, writeFileSync, linkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const dir = mkdtempSync(join(tmpdir(), 'opensauce cli tests '));
after(() => rmSync(dir, { recursive: true, force: true }));
const cli = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
const file = join(dir, 'dinner with spaces.opensauce');
const source = '::recipe\nname: Dinner & tea\n\n::ingredients\n(flour) 100g\n\n::instructions\n(flour) <mix>\n';
writeFileSync(file, source);
const run = (...args: string[]) => spawnSync(process.execPath, [cli, ...args], { cwd: dir, encoding: 'utf8' });

test('CLI help and package version', () => {
  const help = run('--help'); assert.equal(help.status, 0); assert.match(help.stdout, /opensauce check/);
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(run('--version').stdout.trim(), pkg.version);
});
test('CLI check succeeds without knowledge and preserves source', () => {
  const result = run('check', file); assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout, 'OK ' + file + '\n'); assert.equal(readFileSync(file, 'utf8'), source);
});
test('CLI reports parse errors with filename, position and message; render produces nothing', () => {
  const bad = join(dir, 'bad.opensauce'); writeFileSync(bad, '::instructions\n(flour\n');
  for (const args of [['check', bad], ['render', bad, '--format', 'code']]) {
    const result = run(...args); assert.equal(result.status, 1);
    assert.ok(result.stderr.includes(bad + ':2:')); assert.match(result.stderr, /error/); assert.equal(result.stdout, '');
  }
});
test('CLI rejects invalid commands, missing/unreadable files, formats and options', () => {
  for (const args of [[], ['unknown'], ['check'], ['check', join(dir, 'missing')],
    ['check', dir], ['render', file, '--format', 'pdf'], ['render', file],
    ['check', file, '--output', 'bad'], ['render', file, '--format'], ['check', file, '--oops']]) {
    const result = run(...args); assert.notEqual(result.status, 0); assert.ok(result.stderr); assert.equal(result.stdout, '');
  }
});
for (const format of ['compact', 'code', 'html']) test('CLI renders ' + format + ' to stdout and file', () => {
  const result = run('render', file, '--format', format); assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(format === 'html' ? 'Dinner &amp; tea' : 'Dinner & tea'));
  if (format === 'code') assert.ok(result.stdout.includes('(flour)'));
  if (format === 'compact') assert.match(result.stdout, /Mix/i);
  if (format === 'html') assert.match(result.stdout, /<article/);
  const output = join(dir, format + ' output.txt'); writeFileSync(output, 'old content that must be replaced');
  const written = run('render', file, '--format', format, '--output', output);
  assert.equal(written.status, 0, written.stderr); assert.equal(written.stdout, '');
  assert.equal(readFileSync(output, 'utf8'), result.stdout);
  assert.equal(run('render', file, '--format', format, '--no-knowledge').status, 0);
});
test('CLI refuses direct and hardlink source overwrites and reports write failure', () => {
  const alias = join(dir, 'input alias.opensauce'); linkSync(file, alias);
  for (const target of [file, alias]) {
    const result = run('render', file, '--format', 'html', '--output', target);
    assert.equal(result.status, 1); assert.match(result.stderr, /Refusing to overwrite/);
    assert.equal(readFileSync(file, 'utf8'), source);
  }
  const result = run('render', file, '--format', 'html', '--output', join(dir, 'absent', 'out.html'));
  assert.equal(result.status, 1); assert.ok(result.stderr);
});
