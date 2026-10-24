import assert from 'node:assert/strict';
import test from 'node:test';
import { Vocabulary, parseRecipe, buildUsageIndex, createReferencePage, recipeReferenceUrl, regionalRelations } from '../src/index.ts';
import type { VocabularyEntry } from '../src/index.ts';
import { loadVocabulary } from '../src/vocabulary/node.ts';
const vocabulary = await loadVocabulary('knowledge');
const ingredient = (id: string, extra: Partial<VocabularyEntry> = {}): VocabularyEntry => ({id, kind: 'ingredient', names: {en: id}, ...extra});
const things = (source: string, v = vocabulary) => {
  const recipe = parseRecipe(source, {vocabulary: v});
  const tokens = recipe.sections.flatMap(s => s.children.flatMap(n => n.kind === 'statement' ? n.tokens.filter(t => t.kind === 'thing') : []));
  return {recipe, tokens};
};
const sirloin = new Vocabulary([
  ingredient('uk-sirloin', {exact_names: [{name: 'sirloin', locale: 'en-GB', scope: 'UK cut fixture'}], regional_mappings: [
    {name: 'US sirloin', target: 'us-sirloin', locale: 'en-US', relation: 'overlapping', sources: [{citation: 'Boundary pilot: illustrative non-exact cut comparison; not a cut crosswalk.'}]}]}),
  ingredient('us-sirloin', {exact_names: [{name: 'sirloin', locale: 'en-US'}]})
]);

test('optional locale is retained without rewriting source or changing syntax legality', () => {
  for (const locale of [undefined, 'en-GB', 'en-US']) {
    const source = '::recipe\nname: Test\n' + (locale ? 'locale: ' + locale + '\n' : '') + '::ingredients\n(eggplant) 1';
    const {recipe, tokens} = things(source);
    assert.equal(recipe.locale, locale); assert.equal(recipe.source, source);
    assert.equal(tokens[0].raw, '(eggplant)'); assert.equal(tokens[0].canonicalId, 'aubergine');
    assert.deepEqual(recipe.diagnostics.filter(d => d.severity === 'error'), []);
    const plain = parseRecipe(source);
    assert.equal(plain.locale, locale); assert.equal(plain.source, source);
    assert.deepEqual(plain.diagnostics.filter(d => d.severity === 'error'), []);
  }
});
for (const [locale, name, id] of [
  ['en-US', 'eggplant', 'aubergine'], ['en-GB', 'aubergine', 'aubergine'],
  ['en-US', 'zucchini', 'courgette'], ['en-US', 'powdered sugar', 'icing-sugar'],
  ['en-US', 'cilantro', 'coriander-leaves']
]) test(locale + ' exact control: ' + name, () => {
  const {recipe, tokens} = things('::recipe\nlocale: ' + locale + '\n::ingredients\n(' + name + ')');
  assert.equal(tokens[0].canonicalId, id); assert.equal(tokens[0].name, name);
  assert.equal(recipe.locale, locale);
  assert.deepEqual(vocabulary.resolveIngredient(name, undefined, [], locale).map(t => t.entry.id), [id]);
});

test('scoped sirloin needs locale to disambiguate; legacy names stay unscoped', () => {
  for (const [locale, id] of [['en-GB', 'uk-sirloin'], ['en-US', 'us-sirloin']]) {
    const {tokens} = things('::recipe\nlocale: ' + locale + '\n::ingredients\n(sirloin)\n::instructions\n(sirloin)', sirloin);
    assert.deepEqual(tokens.map(t => t.canonicalId), [id, id]);
    assert.equal(tokens[1].declarationIds?.length, 1);
  }
  const ambiguous = things('::ingredients\n(sirloin)', sirloin);
  assert.equal(ambiguous.tokens[0].canonicalId, undefined);
  assert.ok(ambiguous.recipe.diagnostics.some(d => d.code === 'AMBIGUOUS_VOCABULARY'));
  assert.equal(sirloin.resolveIngredient('sirloin').length, 2);
  assert.equal(sirloin.resolveIngredient('sirloin', undefined, [], 'fr-FR').length, 0);
  const v = new Vocabulary([ingredient('a', {aliases: ['old'], exact_names: [{name: 'English', locale: 'en'}, {name: 'unscoped'}]})]);
  assert.equal(v.resolveIngredient('old', undefined, [], 'fr-FR')[0].entry.id, 'a');
  assert.equal(v.resolveIngredient('unscoped')[0].entry.id, 'a');
  assert.equal(v.resolveIngredient('English', undefined, [], 'EN-us')[0].entry.id, 'a');
});

test('all research mapping relations are descriptive, never alias expansion', () => {
  const mappings = regionalRelations.map(relation => ({name: relation + ' wording', relation, locale: 'en-US'}));
  const v = new Vocabulary([ingredient('plain-flour', {regional_mappings: [
    ...mappings, {name: 'all-purpose flour', relation: 'approximate-equivalent', scope: 'Formulation equivalence not established.'}
  ]})]);
  for (const name of [...mappings.map(m => m.name), 'all-purpose flour'])
    for (const locale of [undefined, 'en-US']) assert.deepEqual(v.resolveIngredient(name, undefined, [], locale), []);
  const page = createReferencePage(v, 'ingredient', 'plain-flour')!;
  assert.equal(page.regionalMappings?.length, 6);
  assert.equal(createReferencePage(sirloin, 'ingredient', 'uk-sirloin')?.regionalMappings?.[0].target, 'us-sirloin');
});

for (const part of ['yolk', 'white']) test('egg ' + part + ' shares the nested semantic target and backlinks', () => {
  const a = vocabulary.resolveIngredient('egg ' + part)[0], b = vocabulary.resolveIngredient('egg', undefined, [part])[0];
  assert.equal(a.entry.id, b.entry.id); assert.deepEqual(a.parts, b.parts); assert.ok(a.compatibility);
  assert.equal(vocabulary.resolveIngredient('egg-' + part)[0].entry.id, 'egg');
  const source = '::ingredients\n(egg ' + part + ') 1\n::instructions\n(egg: ' + part + ')';
  const {recipe, tokens} = things(source);
  assert.equal(recipe.source, source); assert.deepEqual(tokens[0].parts, []);
  assert.deepEqual(tokens.map(t => t.canonicalId), ['egg', 'egg']);
  assert.equal(tokens[1].declarationIds?.length, 1);
  assert.equal(recipeReferenceUrl({kind: 'ingredient', canonicalId: tokens[0].canonicalId!, token: tokens[0]}), '/reference/ingredient/egg#part-' + part);
  const usage = buildUsageIndex([{id: part, name: part, recipe}]);
  assert.deepEqual(Object.keys(usage.concepts), ['["ingredient","egg"]']);
  const page = createReferencePage(vocabulary, 'ingredient', 'egg', usage)!;
  assert.equal(page.parts.find(p => p.id === part)?.usage?.length, 1);
  const legacy = createReferencePage(vocabulary, 'ingredient', 'egg-' + part, usage)!;
  assert.deepEqual(legacy.canonicalTarget, {ingredient: 'egg', parts: [part]});
  assert.equal(legacy.usage?.length, 1);
  assert.equal(vocabulary.resolve('egg-' + part, 'ingredient')[0].id, 'egg-' + part);
  const inverse = things('::ingredients\n(egg: ' + part + ') 1\n::instructions\n(egg ' + part + ')');
  assert.equal(inverse.tokens[1].declarationIds?.length, 1);
  assert.equal(inverse.tokens[1].canonicalId, 'egg');
  assert.deepEqual(inverse.tokens[1].partResolution?.ids, [part]);
});

test('legacy self-rising wording is accepted with explicit compatibility warning, not asserted exact', () => {
  const source = '::recipe\nlocale: en-US\n::ingredients\n(self-rising flour)';
  const {recipe, tokens} = things(source);
  assert.equal(recipe.source, source); assert.equal(tokens[0].canonicalId, 'self-raising-flour');
  assert.ok(recipe.diagnostics.some(d => d.code === 'INGREDIENT_COMPATIBILITY'));
  const entry = vocabulary.resolve('self-raising-flour', 'ingredient')[0];
  assert.equal(entry.names['en-US'], undefined);
  assert.equal(entry.regional_mappings?.[0].relation, 'approximate-equivalent');
  assert.equal(vocabulary.resolveIngredient('self-rising flour')[0].warnings?.length, 1);
  assert.equal(vocabulary.resolveIngredient('self raising flour')[0].warnings, undefined);
});

test('loader/index and JSON transport preserve new metadata without changing entry count', () => {
  assert.equal(vocabulary.entries.length, 969);
  const copy = new Vocabulary(JSON.parse(JSON.stringify(vocabulary.entries)));
  assert.equal(copy.resolveIngredient('powdered sugar', undefined, [], 'en-US')[0].entry.id, 'icing-sugar');
  assert.equal(copy.resolveIngredient('powdered sugar', undefined, [], 'en-GB').length, 0);
  assert.deepEqual(copy.resolveIngredient('egg white')[0].parts, ['white']);
  assert.deepEqual(createReferencePage(copy, 'ingredient', 'icing-sugar')?.exactNames, vocabulary.resolve('icing-sugar', 'ingredient')[0].exact_names);
});

test('invalid and repeated locales warn, remain source-preserved and do not change legality', () => {
  for (const metadata of ['locale: nonsense_locale', 'locale:', 'locale: en-GB\nlocale: en-US']) {
    const source = '::recipe\n' + metadata + '\n::ingredients\n(sirloin)';
    const {recipe, tokens} = things(source, sirloin);
    assert.equal(recipe.source, source); assert.equal(recipe.locale, undefined);
    assert.ok(recipe.diagnostics.some(d => d.code === 'INVALID_LOCALE'));
    assert.equal(tokens[0].canonicalId, undefined);
    assert.deepEqual(recipe.diagnostics.filter(d => d.severity === 'error'), []);
  }
});

for (const extra of [
  {exact_names: [{name: 'a', relation: 'approximate-equivalent'}]}, {exact_names: null}, {exact_names: [{name: ''}]}, {exact_names: [{name: 'a', locale: 'en_US'}]},
  {regional_mappings: [{name: 'a', relation: 'synonym'}]},
  {regional_mappings: [{name: 'a', relation: 'exact', target: 'missing'}]},
  {exact_names: [{name: 'a', sources: [{url: 'citation missing'}]}]},
  {canonical_target: {ingredient: 'egg', parts: ['missing']}},
  {canonical_target: {ingredient: 'egg', parts: []}},
  {canonical_target: {ingredient: 'egg', parts: ['yolks']}},
  {canonical_target: {ingredient: 'egg-yolk', parts: ['x']}}
]) test('invalid localisation schema rejected: ' + JSON.stringify(extra), () => {
  assert.throws(() => new Vocabulary([...vocabulary.entries, ingredient('invalid', extra as Partial<VocabularyEntry>)]));
});
test('localisation fields reject non-ingredients and compatibility cycles', () => {
  assert.throws(() => new Vocabulary([{id: 'pan', kind: 'equipment', names: {en: 'pan'}, exact_names: []}]));
  assert.throws(() => new Vocabulary([ingredient('a', {parts: {p: {names: {en: 'p'}}}, canonical_target: {ingredient: 'a', parts: ['p']}})]));
});
