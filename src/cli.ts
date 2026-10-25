#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { loadBundledCanonicalVocabulary } from './vocabulary/node.ts';
import { runCli, reportCliError } from './cli/run.ts';

runCli(process.argv.slice(2), {
  version: async () => JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')).version,
  loadVocabulary: loadBundledCanonicalVocabulary
}).catch(reportCliError);
