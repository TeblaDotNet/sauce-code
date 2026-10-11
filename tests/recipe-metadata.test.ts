
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { parseRecipe, renderCode, renderHtml, recipeCategories, dietaryDisclaimer } from '../src/index.ts';
import { loadVocabulary } from '../src/vocabulary/node.ts';

for (const category of recipeCategories) test('optional category: ' + category, () => {
  const source = '::recipe\nname: Example\ncategory: ' + category + '\n';
  const recipe = parseRecipe(source);
  assert.equal(recipe.category, category);
  assert.deepEqual(recipe.diagnostics, []);
  assert.equal(recipe.source, source);
  assert.equal(parseRecipe(renderCode(recipe)).category, category);
});
for (const value of ['sauce', 'baking', 'soup', 'dip', 'Main', 'main, side', '', 'main\ncategory: main', 'main\ncategory: side']) test('invalid category stays literal: ' + value, () => {
  const source = '::recipe\nname: Example\ncategory: ' + value + '\n';
  const recipe = parseRecipe(source);
  assert.equal(recipe.category, undefined);
  assert.deepEqual(recipe.diagnostics.map(d => [d.severity, d.code]), [['warning', 'INVALID_CATEGORY']]);
  assert.equal(recipe.source, source);
});
test('minimal recipes need no classification metadata', () => {
  const recipe = parseRecipe('::recipe\nname: Minimal\n::ingredients\n(water) 1 cup');
  for (const key of ['category', 'dietary', 'cuisine', 'region'] as const) assert.equal(recipe[key], undefined);
  assert.deepEqual(recipe.diagnostics, []);
});
test('dietary lists are extensible, ordered, trimmed and exact-deduplicated', () => {
  const recipe = parseRecipe('::recipe\nname: Example\ndietary: vegan, nut-free, gluten-free\ndietary: vegan, dairy-free, family-specific\n');
  assert.deepEqual(recipe.dietary, ['vegan', 'nut-free', 'gluten-free', 'dairy-free', 'family-specific']);
  assert.deepEqual(recipe.diagnostics, []);
  for (const value of ['', 'vegan,', ',vegan', 'vegan,,nut-free']) {
    const invalid = parseRecipe('::recipe\nname: Example\ndietary: ' + value);
    assert.equal(invalid.dietary, undefined);
    assert.ok(invalid.diagnostics.some(d => d.code === 'INVALID_DIETARY'));
  }
});
test('plain-text cuisine/region preserve arbitrary values; duplicates warn', () => {
  const recipe = parseRecipe('::recipe\nname: Example\ncuisine: Family <fusion> & friends\nregion: Somewhere / anywhere\n');
  assert.equal(recipe.cuisine, 'Family <fusion> & friends');
  assert.equal(recipe.region, 'Somewhere / anywhere');
  assert.deepEqual(recipe.diagnostics, []);
  const html = renderHtml(recipe);
  assert.ok(html.includes('Family &lt;fusion&gt; &amp; friends'));
  for (const key of ['cuisine', 'region'] as const) for (const fields of [key + ':', key + ': one\n' + key + ': two']) {
    const invalid = parseRecipe('::recipe\nname: Example\n' + fields);
    assert.equal(invalid[key], undefined);
    assert.ok(invalid.diagnostics.some(d => d.code === 'INVALID_' + key.toUpperCase()));
  }
});
test('classification is independent of conversion and curation and ignores original payload metadata', () => {
  const source = '::recipe\nname: Example\ncategory: main\nconversion stage: blocked\ncuration origin: generated\ncuration review: checked\n::source\n<<<\ncategory: dessert\ndietary: vegan\ncuisine: historic\n>>>\n';
  const recipe = parseRecipe(source);
  assert.equal(recipe.category, 'main');
  assert.equal(recipe.dietary, undefined);
  assert.equal(recipe.cuisine, undefined);
  assert.equal(recipe.conversionStage, 'blocked');
  assert.deepEqual(recipe.curation, {origin: 'generated', review: 'checked'});
  assert.equal(recipe.source, source);
  assert.deepEqual(recipe.diagnostics, []);
});
test('dietary HTML carries advisory wording in Code and Compact; values stay escaped', () => {
  const recipe = parseRecipe('::recipe\nname: Example\ndietary: nut-free, <script>alert(1)</script>');
  for (const view of ['code', 'compact'] as const) {
    const html = renderHtml(recipe, {view});
    assert.ok(html.includes(dietaryDisclaimer));
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(!html.includes('<script>'));
    assert.match(html, /Check ingredients, substitutions and product labels/);
  }
  assert.ok(!renderHtml(parseRecipe('::recipe\nname: Example')).includes('os-dietary-notice'));
});