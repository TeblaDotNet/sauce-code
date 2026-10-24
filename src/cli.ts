#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { loadVocabulary } from './vocabulary/node.ts';
import { runCli, reportCliError } from './cli/run.ts';

runCli(process.argv.slice(2), {
  version: async () => JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')).version,
  loadVocabulary: () => loadVocabulary(fileURLToPath(new URL('../knowledge/', import.meta.url)))
}).catch(reportCliError);
