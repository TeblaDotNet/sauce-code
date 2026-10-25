import { readFile, open, stat } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { parseRecipe } from '../parser/index.ts';
import { renderCode, renderCompact } from '../renderer/index.ts';
import { renderHtml } from '../renderer/html.ts';
import { renderHtmlDocument } from '../renderer/document.ts';
import { scaleRecipeForRendering } from '../reading-export.ts';
import { embedRecipeImages } from './images.ts';
import type { Vocabulary } from '../vocabulary/index.ts';

/** Distribution adapters provide resources; parsing and rendering remain reusable Core APIs. */
export interface CliRuntime {
  version(): Promise<string>;
  loadVocabulary(): Promise<Vocabulary>;
}

const help = `Usage:
  opensauce check <file>
  opensauce render <file> --format compact|code|html|code-html [--output <path>] [--no-knowledge]
  opensauce render <file> --format html --theme light|dark|auto [--embed-images]
  opensauce render <file> --format compact|code|html|code-html --servings <number>
  opensauce --help
  opensauce --version

Examples:
  opensauce check dinner.opensauce
  opensauce render dinner.opensauce --format compact
  opensauce render dinner.opensauce --format html --output dinner.html

The Node package needs Node 24+; standalone builds need no JavaScript runtime.
Render writes to stdout unless --output is supplied.
HTML is an unstyled semantic fragment unless --theme selects an offline document.
--embed-images embeds bounded local raster images relative to the input directory.
code-html produces a highlighted Code document (default theme: auto).
--servings scales supported ingredient declarations, keeping authored units;
unsupported amounts and instruction quantities stay literal, with warnings.
Rendering uses bundled canonical vocabulary;
--no-knowledge disables resolution. Check never requires knowledge.
Parse errors prevent rendering. Warnings go to stderr and do not fail.
`;

export async function runCli(args: string[], runtime: CliRuntime): Promise<void> {
  const { values, positionals } = parseArgs({
    args, allowPositionals: true,
    options: { help: { type: 'boolean' }, version: { type: 'boolean' },
      theme: { type: 'string' }, servings: { type: 'string' }, 'embed-images': { type: 'boolean' },
      format: { type: 'string' }, output: { type: 'string' }, 'no-knowledge': { type: 'boolean' } }
  });
  if (values.help) { process.stdout.write(help); return; }
  if (values.version) {
    process.stdout.write(await runtime.version() + '\n'); return;
  }
  const [command, filename] = positionals;
  if (!command) throw new Error('Missing command. Run opensauce --help.');
  if (!['check', 'render'].includes(command)) throw new Error('Unknown command: ' + command + '. Run opensauce --help.');
  if (!filename || positionals.length !== 2) throw new Error('Expected exactly one input file. Run opensauce --help.');
  if (command === 'check' && (values.format !== undefined || values.output !== undefined || values['no-knowledge'] || values.theme !== undefined || values.servings !== undefined || values['embed-images']))
    throw new Error('Render options cannot be used with check.');
  if (command === 'render' && !['compact', 'code', 'html', 'code-html'].includes(values.format ?? ''))
    throw new Error('Specify --format compact, code, html or code-html.');
  if (values.theme !== undefined && !['light','dark','auto'].includes(values.theme)) throw Error('Theme must be light, dark or auto.');
  if ((values.theme !== undefined || values['embed-images']) && !['html','code-html'].includes(values.format ?? '')) throw Error('Theme and image embedding require an HTML format.');
  if (values.servings !== undefined && (!/^\d+(?:\.\d+)?$/.test(values.servings) || !Number.isFinite(Number(values.servings)) || Number(values.servings) <= 0)) throw Error('Servings must be a positive finite number.');
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
    await runtime.loadVocabulary();
  let recipe = vocabulary ? parseRecipe(source, { filename, vocabulary }) : parsed;
  const notices: string[] = [];
  if (values.servings !== undefined) {
    const scaled = scaleRecipeForRendering(recipe, Number(values.servings)); recipe = scaled.recipe; notices.push(...scaled.warnings);
  }
  const media = values['embed-images'] ? await embedRecipeImages(recipe, input) : undefined;
  notices.push(...(media?.warnings ?? []));
  for (const notice of notices) process.stderr.write('opensauce: warning: ' + notice + '\n');
  const htmlOptions = { vocabulary, embeddedImages: media?.images };
  const output = values.format === 'compact' ? renderCompact(recipe, { vocabulary }) :
    values.format === 'code' ? renderCode(recipe) : values.theme !== undefined || values.format === 'code-html' ? renderHtmlDocument(recipe, { ...htmlOptions, theme: values.theme as 'light'|'dark'|'auto'|undefined, notices, ...(values.format === 'code-html' ? { view: 'code' as const, syntaxSpans: true } : {}) }) : renderHtml(recipe, htmlOptions);
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


export function reportCliError(error: unknown): void {
  process.stderr.write('opensauce: ' + (error instanceof Error ? error.message : String(error)) + '\n');
  process.exitCode = 1;
}
