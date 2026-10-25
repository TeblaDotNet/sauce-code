# Core API contracts

Use the exports of `@open-sauce/core`, with explicit Node adapters from `@open-sauce/core/vocabulary/node`. Version 0.1.0 is an early API, not a promise that every internal helper is stable. Examples below run after installing the local package; source developers can substitute the corresponding src entry point.

## Parse, inspect, render

```js
import {parseRecipe, renderCode, renderCompact, renderHtml} from '@open-sauce/core';

const source = '::recipe\nname: Dough\nserves: 2\n\n::ingredients\n(flour) 250g\n';
const recipe = parseRecipe(source);
if (recipe.diagnostics.some(d => d.severity === 'error')) {
  console.error(recipe.diagnostics);
} else {
  console.log(renderCode(recipe));
  console.log(renderCompact(recipe));
  console.log(renderHtml(recipe));
}
console.assert(recipe.source === source);
```

Parsing returns a Recipe with diagnostics rather than throwing for ordinary malformed recipe syntax. Recovery can leave useful nodes beside errors; consumers must decide whether to render that partial result. The CLI refuses error-bearing recipes. Invalid programmatic inputs are not a supported substitute for syntax diagnostics.

Source offsets refer to the original JavaScript string (UTF-16 code units), not encoded byte offsets. Span ends are exclusive; line and column are one-based. Preserve source and spans for editing; do not calculate edits from rendered strings. Code rendering normalises layout and applies visibility options; it is not a byte-preserving save. Original upstream raw fences are separate from the full recipe.source string.

Read the phase maps in [parser](../src/parser/index.ts) and [Compact renderer](../src/renderer/compact.ts): section/raw-fence precedence, recovery, explicit groups, declaration indexing and optional resolution precede conservative phrasing. Compact must not invent missing action targets or remaining quantities.

## Canonical identity and ambiguity

```js
import {parseRecipe} from '@open-sauce/core';
import {loadBundledCanonicalVocabulary} from '@open-sauce/core/vocabulary/node';

const vocabulary = await loadBundledCanonicalVocabulary();
const matches = vocabulary.resolve('egg', 'ingredient');
const yolks = vocabulary.resolveIngredient('egg', undefined, ['yolk']);
const recipe = parseRecipe('::ingredients\n(egg: yolk) 2\n', {vocabulary});
console.assert(matches.length === 1 && yolks.length === 1);
console.assert(recipe.source.includes('(egg: yolk)'));
```

resolve returns an array: zero means unresolved, multiple candidates mean ambiguity. Do not silently choose the first. Locale can narrow eligible mappings; it is not permission to invent universal equivalences. resolveIngredient distinguishes part paths and variants; authored product labels and local roles are not aliases. Preparation states are separate from identities/variants; parsers retain authored spelling and only annotate supported resolution.

loadCanonicalVocabulary(root) explicitly reads canonical YAML; loadBundledCanonicalVocabulary reads the package resource. loadVocabulary remains a legacy combined loader for an explicit root, not provider discovery. File/JSON/YAML errors reject; invalid vocabulary can throw during construction. The portable Vocabulary constructor takes supplied entries. Treat vocabulary and AST inputs as read-only; public readonly typing is not a deep freeze.

## Reading, scaling and failure

```js
import {parseRecipe, scaleRecipeForRendering, renderCompact,
  readerQuantity, scaleReaderQuantity, convertReaderUnit} from '@open-sauce/core';
const recipe = parseRecipe('::recipe\nserves: 2\n::ingredients\n(flour) 250g\n');
const scaled = scaleRecipeForRendering(recipe, 4);
console.log(renderCompact(scaled.recipe));
console.assert(scaled.recipe.source === recipe.source);
const cups = readerQuantity('2 cups');
console.assert(cups && scaleReaderQuantity(cups, 1.5).amount === 3);
console.assert(cups && convertReaderUnit(cups, 'ml') === undefined);
const grams = readerQuantity('1000g');
console.assert(grams && convertReaderUnit(grams, 'kg').amount === 1);
```

readerQuantity returns undefined for unsupported expressions. Same-unit numeric scaling may work even if unit conversion cannot. convertReaderUnit returns undefined for unsupported/incompatible units. servingScale and scaleRecipeForRendering throw for invalid servings or unavailable serving metadata. The render-only projection can reuse the original Recipe when factor is one; never depend on new object identity. Projected token spans are not edit coordinates.

createReadingModel builds presentation data, not a rewritten source recipe. Scaling affects supported ingredient declarations; inline choices, instruction amounts, timing and equipment may remain authored and require review. Warnings are part of the result. Conversion must retain approximation and cannot manufacture precision. Density conversion uses explicit evidence, exact target/condition, review eligibility and source-volume basis; refusal is a structured unsuccessful result, not an inferred answer. No arbitrary cup-to-grams or nutrition calculation is promised. See [reading details](reading-scaling.md) and public [measurement contracts](../src/vocabulary/measurement.ts).

## Optional provider and portability

[Provider composition](knowledge-provider.md) contains an executable Node loading example. composeKnowledge(vocabulary) returns the same vocabulary when no provider is supplied. Supplying one validates schema, canonical digest/content, targets, source references and eligibility, then returns a composed vocabulary without mutating inputs. Invalid supplied content rejects rather than being silently ignored. Missing optional knowledge is normal; malformed explicitly supplied knowledge is an error.

composeKnowledge uses standard Web Crypto, not filesystem, network or Bun. Node loadKnowledgeProvider reads only explicit JSON paths and rejects missing/invalid files. Bundled canonical loading and CLI file/image operations are Node adapters; browser/GUI applications should supply data to portable APIs. Reference and HTML renderers escape ordinary recipe text; application URL callbacks still need appropriate trusted routing policies.
