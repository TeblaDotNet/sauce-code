#!/usr/bin/env node
import { readFile, open, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { parseRecipe } from './parser/index.ts';
import { renderCode, renderCompact } from './renderer/index.ts';
import { renderHtml } from './renderer/html.ts';
import { loadVocabulary } from './vocabulary/node.ts';

const help = `Usage:
  opensauce check <file>
  opensauce render <file> --format compact|code|html [--output <path>] [--no-knowledge]
  opensauce --help
  opensauce --version

Examples:
  opensauce check dinner.opensauce
  opensauce render dinner.opensauce --format compact
  opensauce render dinner.opensauce --format html --output dinner.html

Requires Node 24+. Render writes to stdout unless --output is supplied.
HTML is an unstyled semantic fragment. Rendering uses bundled knowledge;
--no-knowledge disables resolution. Check never requires knowledge.
Parse errors prevent rendering. Warnings go to stderr and do not fail.
`;

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { help: { type: 'boolean' }, version: { type: 'boolean' },
      format: { type: 'string' }, output: { type: 'string' }, 'no-knowledge': { type: 'boolean' } }
  });
  if (values.help) { process.stdout.write(help); return; }
  if (values.version) {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    process.stdout.write(pkg.version + '\n'); return;
  }
  const [command, filename] = positionals;
  if (!command) throw new Error('Missing command. Run opensauce --help.');
  if (!['check', 'render'].includes(command)) throw new Error('Unknown command: ' + command + '. Run opensauce --help.');
  if (!filename || positionals.length !== 2) throw new Error('Expected exactly one input file. Run opensauce --help.');
  if (command === 'check' && (values.format !== undefined || values.output !== undefined || values['no-knowledge']))
    throw new Error('Render options cannot be used with check.');
  if (command === 'render' && !['compact', 'code', 'html'].includes(values.format ?? ''))
    throw new Error('Specify --format compact, code or html.');
  const input = resolve(filename);
  const inputStat = await stat(input);
  if (!inputStat.isFile()) throw new Error('Input is not a regular file: ' + filename);
  const source = await readFile(input, 'utf8');
  // Basic validity is independent of shared culinary knowledge.
  const parsed = parseRecipe(source, { filename });
  for (const d of parsed.diagnostics)
    process.stderr.write(`${filename}:${d.span.line}:${d.span.column}: ${d.severity} ${d.code}: ${d.message}\n`);
  if (parsed.diagnostics.some(d => d.severity === 'error')) { process.exitCode = 1; return; }
  if (command === 'check') { process.stdout.write('OK ' + filename + '\n'); return; }
  const vocabulary = values['no-knowledge'] ? undefined :
    await loadVocabulary(fileURLToPath(new URL('../knowledge/', import.meta.url)));
  const recipe = vocabulary ? parseRecipe(source, { filename, vocabulary }) : parsed;
  const output = values.format === 'compact' ? renderCompact(recipe, { vocabulary }) :
    values.format === 'code' ? renderCode(recipe) : renderHtml(recipe, { vocabulary });
  if (values.output === undefined) { process.stdout.write(output); return; }
  const target = resolve(values.output);
  if (target === input) throw new Error('Refusing to overwrite the input source: ' + values.output);
  // Open without truncation, then check file identity to protect symlink/hardlink aliases.
  const handle = await open(target, constants.O_CREAT | constants.O_RDWR);
  try {
    const targetStat = await handle.stat();
    if (targetStat.dev === inputStat.dev && targetStat.ino === inputStat.ino)
      throw new Error('Refusing to overwrite the input source: ' + values.output);
    if (!targetStat.isFile()) throw new Error('Output is not a regular file: ' + values.output);
    await handle.truncate(0);
    await handle.writeFile(output, 'utf8');
  } finally { await handle.close(); }
}

main().catch((error: unknown) => {
  process.stderr.write('opensauce: ' + (error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
});
