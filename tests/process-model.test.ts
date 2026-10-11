
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {Vocabulary, parseRecipe, semanticTokens, renderHtml, createReferencePage, buildUsageIndex} from '../src/index.ts';
import type {Node, Recipe, Token} from '../src/index.ts';
import {loadVocabulary} from '../src/vocabulary/node.ts';
const vocabulary = await loadVocabulary('knowledge');
const demoted = ['transfer','pour','reserve','set-aside','serve','arrange','cover','uncover'];
const aliases = {'air-fry':'air fry','hard-boil':'hard boil',thaw:'defrost'};
const added = {blanch:'blanch',braise:'braise',julienne:'julienne',confit:'confit',flambe:'flambé',render:'render'};
const visit = (nodes: Node[]): Token[] => nodes.flatMap(n => [
  ...(n.kind === 'statement' ? semanticTokens(n.tokens) : []),
  ...('children' in n ? visit(n.children) : []),
  ...(n.kind === 'group' && n.condition ? visit([n.condition]) : [])]);
const tokens = (r: Recipe) => [...visit(r.preamble),...r.sections.flatMap(s => visit(s.children))];
const referenceUrl = (t: {canonicalId: string}) => '/processes/' + t.canonicalId + '/';
const source = (head: string) => '::instructions\r\n  <' + head + ', gently> ?= ready';

test('ordinary canonical actions retain semantic styling without reference affordances', () => {
  for (const id of [...demoted,'add','place','remove']) {
    const name = vocabulary.entries.find(e => e.kind === 'process' && e.id === id)!.names.en;
    const r = parseRecipe(source(name),{vocabulary}), t = tokens(r).find(t => t.kind === 'process')!;
    assert.equal(t.canonicalId,id); assert.equal(t.reference,false);
    for (const view of ['code','compact'] as const) {
      const html = renderHtml(r,{view,syntaxSpans:true,referenceUrl});
      assert.match(html,/os-token os-process/);
      if (view === 'code') assert.match(html,/os-syntax-process/);
      assert.doesNotMatch(html,/<a\b/);
    }
    assert.equal(createReferencePage(vocabulary,'process',id),undefined);
    assert.deepEqual(Object.keys(buildUsageIndex([{id:'one',name:'One',recipe:r}]).concepts),[]);
  }
});

test('lexical aliases and new techniques resolve uniquely without rewriting raw heads or spans', () => {
  for (const [id,name] of Object.entries({...aliases,...added})) {
    const matches = vocabulary.resolve(name,'process');
    assert.equal(matches.length,1,name); assert.equal(matches[0].id,id);
    const text = source(name), r = parseRecipe(text,{vocabulary});
    const t = tokens(r).find(t => t.kind === 'process')!;
    assert.equal(t.canonicalId,id); assert.equal(t.name,name);
    assert.equal(t.raw,'<' + name + ', gently>'); assert.equal(text.slice(t.span.start,t.span.end),t.raw);
    const bare = tokens(parseRecipe(text)).find(t => t.kind === 'process')!;
    const copy = {...t}; delete copy.canonicalId;
    assert.deepEqual(copy,bare);
    const html = renderHtml(r,{syntaxSpans:true,referenceUrl});
    assert.match(html,/os-syntax-process/); assert.ok(html.includes('href="/processes/' + id + '/"'));
    assert.ok(createReferencePage(vocabulary,'process',id));
  }
});

test('unknown actions and existing techniques keep their established behavior', () => {
  for (const name of ['unregistered-action','put','return','bake','whisk','reduce','grill','broil']) {
    const r = parseRecipe(source(name),{vocabulary});
    assert.equal(r.diagnostics.filter(d => d.severity === 'error').length,0);
    const html = renderHtml(r,{syntaxSpans:true,referenceUrl}); assert.match(html,/os-syntax-process/);
    assert.equal(html.includes('<a '),['bake','whisk','reduce','grill','broil'].includes(name));
  }
  assert.equal(vocabulary.resolve('reduce heat','process')[0].id,'reduce-heat');
  assert.equal(vocabulary.resolve('slash','process')[0].id,'slash');
  assert.equal(vocabulary.resolve('barbecue','process')[0].id,'barbecue');
  assert.equal(vocabulary.resolve('bbq','process')[0].id,'barbecue');
});