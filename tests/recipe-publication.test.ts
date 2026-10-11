
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { parseRecipe, isPublished, conversionStages, renderCode, buildUsageIndex, createReferencePage } from '../src/index.ts';
import { loadVocabulary } from '../src/vocabulary/node.ts';
const vocabulary = await loadVocabulary('knowledge');
for (const stage of conversionStages) test('conversion stage ' + stage + ' is independent of curation', () => {
  for (const review of ['checked', 'unchecked']) {
    const source = '::recipe\nname: Test\nconversion stage: ' + stage + '\ncuration origin: generated\ncuration review: ' + review;
    const r = parseRecipe(source);
    assert.equal(r.conversionStage, stage); assert.equal(r.curation?.review, review);
    assert.equal(isPublished(r), stage === 'reworked'); assert.equal(r.source, source); assert.equal(parseRecipe(renderCode(r)).conversionStage, stage);
  }
});
for (const field of ['conversion stage: gold', 'conversion stage: second-pass', 'conversion stage: v2', 'conversion stage:', 'conversion stage: reworked\nconversion stage: reworked', 'conversion stage: reworked\nconversion stage: invalid']) test('invalid conversion metadata stays literal and fails closed: ' + field, () => {
  const source = '::recipe\nname: Test\n' + field;
  const r = parseRecipe(source); assert.equal(r.conversionStage, undefined);
  assert.ok(r.diagnostics.some(d => d.code === 'INVALID_CONVERSION_STAGE' && d.severity === 'warning'));
  assert.equal(r.source, source); assert.equal(isPublished(r), false);
});
test('missing stage is unknown and hidden; explicit metadata alone can promote or demote', () => {
  assert.equal(isPublished(parseRecipe('::recipe\nname: Test')), false);
  for (const name of ['Orange Glorious', 'New recipe']) for (const stage of conversionStages)
    assert.equal(isPublished(parseRecipe('::recipe\nname: ' + name + '\nconversion stage: ' + stage)), stage === 'reworked');
});