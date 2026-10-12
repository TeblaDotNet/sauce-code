import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRecipe, renderCode, renderCompact, renderHtml, semanticTokens, Vocabulary } from '../src/index.ts';
import type { Node, Recipe, Token } from '../src/index.ts';
const nodes = (r: Recipe) => {
  const result: Node[] = [];
  const visit = (ns: Node[]) => { for (const n of ns) { result.push(n); if ('children' in n) visit(n.children); } };
  visit(r.preamble); r.sections.forEach(s => visit(s.children)); return result;
};
const tokens = (r: Recipe): Token[] => nodes(r).flatMap(n => n.kind === 'statement' ? semanticTokens(n.tokens) : []);
const source = (body: string) => '::recipe\nname: Product test\n::ingredients\n' + body + '\n';
const vocabulary = new Vocabulary([
  { id: 'gin', kind: 'ingredient', names: { en: 'gin' }, aliases: ['juniper spirit'], variants: { 'london-dry': { names: { en: 'London dry' } } } },
  { id: 'egg', kind: 'ingredient', names: { en: 'egg' }, parts: { white: { names: { en: 'white' } } } },
  { id: 'stir', kind: 'process', names: { en: 'stir' } }
]);
for (const [marker, strength] of [['', 'specified'], ['~', 'approximate'], ['!', 'exact']] as const) {
  test(`product selection ${strength} parses independently and round-trips`, () => {
    const input = source(`(gin @ ${marker}Beefeater) 45ml`);
    for (const options of [{}, { vocabulary }]) {
      const r = parseRecipe(input, options); assert.deepEqual(r.diagnostics, []); assert.equal(r.source, input);
      const t = tokens(r).find(t => t.kind === 'thing')!;
      assert.equal(t.name, 'gin'); assert.equal(t.variant, undefined);
      assert.equal(t.product?.name, 'Beefeater'); assert.equal(t.product?.strength, strength);
      assert.equal(input.slice(t.product!.span.start, t.product!.span.end), t.product?.raw);
      const code = renderCode(r); assert.ok(code.includes(`(gin @ ${marker}Beefeater)`));
      assert.deepEqual(tokens(parseRecipe(code, options)).find(t => t.kind === 'thing')?.product, t.product);
      assert.ok(renderCompact(r).includes(`@ ${marker}Beefeater`));
      for (const view of ['code', 'compact'] as const) {
        const html = renderHtml(r, { view, syntaxSpans: true });
        assert.ok(html.includes(`@ ${marker}Beefeater`)); assert.ok(html.includes(`data-product-strength="${strength}"`));
      }
    }
  });
}
test('type, nested parts, qualifiers and product fields remain separate', () => {
  const r = parseRecipe(source('(gin; London dry @ Beefeater, chilled) 45ml\n(egg: white @ !Unknown Farm, lightly beaten) ~15ml\n(coconut; young: flesh: milk @ Example, cold)'));
  assert.deepEqual(r.diagnostics, []);
  const ts = tokens(r).filter(t => t.kind === 'thing');
  assert.equal(ts[0].variant, 'London dry'); assert.deepEqual(ts[0].qualifiers, ['chilled']);
  assert.deepEqual(ts[1].parts, ['white']); assert.equal(ts[1].product?.name, 'Unknown Farm');
  assert.deepEqual(ts[2].parts, ['flesh', 'milk']); assert.equal(ts[2].variant, 'young');
  const old = tokens(parseRecipe(source('(gin; London dry)\n(egg: white, lightly beaten)'))).filter(t => t.kind === 'thing');
  assert.equal(old[0].variant, 'London dry'); assert.deepEqual(old[1].parts, ['white']); assert.equal(old[1].product, undefined);
});
test('authored labels retain spaces, punctuation, apostrophes and exact Code spelling', () => {
  for (const label of ["Peychaud's", 'Lagavulin 16', 'Campari', 'Herbsaint', 'Unknown & Sons No. 4 / Cask-Strength', 'Maker: Special; Edition']) {
    const input = source(`(spirit  @  ! ${label}  , chilled) !100g`);
    const r = parseRecipe(input); assert.deepEqual(r.diagnostics, []);
    assert.equal(tokens(r).find(t => t.kind === 'thing')?.product?.name, label);
    assert.ok(renderCode(r).includes(`(spirit  @  ! ${label}  , chilled)`));
    assert.equal(r.source, input);
  }
});
test('OR retains authored operators and branches between product-specific and type references', () => {
  const r = parseRecipe(source('(gin @ ~Beefeater) -OR- (gin; London dry)'), { vocabulary });
  assert.deepEqual(r.diagnostics, []);
  const ts = tokens(r); assert.equal(ts.filter(t => t.kind === 'operator' && t.raw === '-OR-').length, 1);
  assert.deepEqual(ts.filter(t => t.kind === 'thing').map(t => [t.name, t.variant, t.product?.strength]), [['gin', undefined, 'approximate'], ['gin', 'London dry', undefined]]);
  assert.ok(renderCompact(r).includes(' or ')); assert.ok(renderCode(r).includes('-OR-'));
  const branch = parseRecipe(source('(gin @ !Beefeater)\n-OR-\n(gin @ Other)'));
  assert.equal(tokens(branch).filter(t => t.raw === '-OR-').length, 1);
});
test('quantity precision is independent of product markers, including nested context', () => {
  const r = parseRecipe(source('(gin @ !Lagavulin 16) !100g\n(gin @ ~Beefeater) ~100g\n(gin @ Other) ~~100g') + '::instructions\n<stir, with (gin @ !Lagavulin 16), ~10s>\n');
  const qs = nodes(r).flatMap(n => n.kind === 'statement' ? n.quantities ?? [] : []);
  assert.deepEqual(qs.map(q => [q.raw, q.precision]), [['!100g', 'high'], ['~100g', 'approximate'], ['~~100g', 'very-approximate'], ['~10s', 'approximate']]);
  const process = tokens(r).find(t => t.kind === 'process')!;
  assert.equal(process.parameterParts?.flatMap(p => p.tokens).find(t => t.kind === 'thing')?.product?.strength, 'exact');
  for (const t of tokens(r)) assert.equal(r.source.slice(t.span.start, t.span.end), t.raw);
});
test('markers outside the product position stay literal or retain their existing quantity role', () => {
  const r = parseRecipe(source('(special! flour)\n(flour, ~fine, @ annotation)\n(flour @ Product ! Note) 100g'));
  const ts = tokens(r).filter(t => t.kind === 'thing');
  assert.equal(ts[0].name, 'special! flour'); assert.equal(ts[0].product, undefined);
  assert.deepEqual(ts[1].qualifiers, ['~fine', '@ annotation']); assert.equal(ts[1].product, undefined);
  assert.equal(ts[2].product?.strength, 'specified'); assert.equal(ts[2].product?.name, 'Product ! Note');
});
test('product names do not create vocabulary aliases, types or automatic substitutes', () => {
  const r = parseRecipe(source('(gin @ !Beefeater)\n(gin @ Other)') + '::instructions\n(gin @ !Beefeater) <stir>\n(gin @ Unknown) <stir>\n(gin) <stir>\n', { vocabulary });
  assert.deepEqual(vocabulary.resolve('Beefeater', 'ingredient'), []);
  const refs = tokens(r).filter(t => t.kind === 'thing');
  assert.equal(refs[0].canonicalId, 'gin'); assert.equal(refs[0].variant, undefined);
  assert.equal(refs[2].thingKind, 'ingredient'); assert.equal(refs[2].declarationIds?.length, 1);
  assert.equal(refs[3].thingKind, 'unresolved'); assert.equal(refs[4].thingKind, 'ambiguous');
  assert.equal(vocabulary.entries.length, 3);
});
test('product can refine a generic local declaration and alias lookup retains culinary identity', () => {
  const r = parseRecipe(source('(gin)') + '::instructions\n(juniper spirit @ ~Beefeater) <stir>\n', { vocabulary });
  assert.deepEqual(r.diagnostics, []);
  const ref = tokens(r).filter(t => t.kind === 'thing')[1];
  assert.equal(ref.canonicalId, 'gin'); assert.equal(ref.product?.strength, 'approximate');
});
test('HTML escapes product content and retains existing ingredient/reference styling', () => {
  const r = parseRecipe(source('(gin; London dry @ !Maker & "Co" <x>, cold) 45ml'), { vocabulary });
  assert.deepEqual(r.diagnostics, []);
  for (const view of ['code', 'compact'] as const) {
    const html = renderHtml(r, { view, syntaxSpans: true, referenceUrl: t => '/ingredient/' + t.canonicalId });
    assert.ok(!html.includes('<x>')); assert.ok(html.includes('&lt;x&gt;'));
    assert.ok(html.includes('href="/ingredient/gin"')); assert.ok(html.includes('data-product-name="Maker &amp; &quot;Co&quot; &lt;x&gt;"'));
    assert.ok(html.includes('data-variant="London dry"'));
    if (view === 'code') { assert.ok(html.includes('os-syntax-ingredient')); assert.ok(html.includes('os-syntax-specificity')); }
  }
});
test('invalid or repeated product selectors diagnose without losing original source', () => {
  for (const head of ['gin @', 'gin @ !', 'gin @ ~', 'gin @ ~~Brand', 'gin @ !~Brand', 'gin @ ! ~Brand', 'gin @ ~ !Brand', 'gin @ One @ Two', '@ Brand']) {
    const input = source(`(${head})`), r = parseRecipe(input);
    assert.ok(r.diagnostics.some(d => d.code === 'INVALID_THING_STRUCTURE'), head); assert.equal(r.source, input);
    assert.ok(renderCode(r).includes(`(${head})`));
  }
});
