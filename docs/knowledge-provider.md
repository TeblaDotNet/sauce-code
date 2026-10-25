# Optional offline knowledge providers

Core owns canonical identities; Knowledge owns active editorial content, taxonomy and photographs. Package and standalone distributions are canonical-only. Open Sauce Food Knowledge is the default optional provider, but nothing selects or downloads it implicitly. Missing articles do not invalidate canonical concepts. See [ownership](knowledge-ownership.md) and [ecosystem](ecosystem.md).

## APIs

The portable `composeKnowledge` API is async because it verifies a SHA-256 canonical
manifest using standard Web Crypto. It has no filesystem, CLI, Bun or network APIs.
Omitting the provider returns the supplied vocabulary unchanged.

```ts
import { composeKnowledge } from '@open-sauce/core';
import {
  loadBundledCanonicalVocabulary, loadKnowledgeProvider,
} from '@open-sauce/core/vocabulary/node';

const canonical = await loadBundledCanonicalVocabulary();
const provider = await loadKnowledgeProvider('knowledge/dist/snapshot.json', {
  canonicalManifestPath: 'knowledge/validation/canonical-manifest.json',
  compatibilityPath: 'knowledge/dist/compatibility.json',
  taxonomyPath: 'knowledge/dist/taxonomy.json',
});
const combined = await composeKnowledge(canonical, provider);
```

`loadCanonicalVocabulary(root)` still loads canonical YAML from a supplied source
root. `loadVocabulary(root)` retains its combined-loader behaviour and never searches
for an external repository. `loadBundledCanonicalVocabulary()` reads the installed
canonical resource; its development fallback loads only canonical local YAML.

Filesystem loading reads only the explicit JSON paths. Missing or malformed files
fail clearly. Composition then validates schema, targets, source references, review
status, eligibility and the vocabulary pin. The pin's entries hash must equal its
digest, and its runtime canonical projection must match the actual supplied
vocabulary. Matching a caller-provided digest string alone is not sufficient.

A portable application can supply the same `KnowledgeProvider` object directly.
Its canonical manifest is generated validation input, never an editable vocabulary.
No specific provider ID is required. Open Sauce Food is the recommended default
culinary provider for applications choosing one; nothing downloads or selects it
implicitly. Another provider can supply the same schema/version and canonical pin.

## Dimensions and sidecars

The Stage 1 snapshot contract is retained. Articles, sources, image metadata and
reviewed quantities remain independently optional. Quantitative values are attached
to their exact canonical ingredient/part; no conversion eligibility is inferred.
Recipe-local image embedding is independent of reference photography.

Compatibility records accept Stage 2 source/target coordinates or explicit
`{kind, id}` targets, typed `form` and `path` nodes. Only category membership,
regional comparisons and existing part-group descriptions/source citations can be
overlaid. Every nested key, container form, parent and array position is checked.
Names, aliases, IDs, states, variants, part identities, group members and reference
eligibility cannot be overwritten. Quantities use the snapshot's validated quantity
records instead of arbitrary sidecar overlays. Input data is not mutated.

Optional taxonomy is validated and supplied explicitly by the provider. Browsing categories are editorial data, not mandatory language semantics.
Provider absence supplies no articles/measurements, but all canonical identities,
renderers, supported conversions and same-unit scaling remain usable.

## CLI and packaging

`--no-knowledge` still disables vocabulary-backed resolution; it has not been
redefined as an encyclopaedia switch. No new CLI flags were added. Recipe renderings
remain identical with the canonical-only resource. The package includes
`dist/canonical-vocabulary.json`, generated during build/prepack. It no longer ships
the mixed knowledge YAML directory. The standalone adapter embeds canonical entries
and empty resource/enrichment arrays; it does not bundle the encyclopaedia.

An application or future standalone distribution may explicitly load and compose
an offline provider through these APIs, or inject a composed vocabulary through
`CliRuntime`. That distribution must separately include the snapshot/media and
relevant attribution. There is no mandatory Knowledge dependency, provider download,
install hook or new provider CLI option. Existing licence notices are retained.

## Verification

Core tests/knowledge-provider.test.ts covers synthetic portable/Node composition and hostile overlays without requiring Knowledge. Historical real-content parity moved to Knowledge tests/editorial/provider-baseline.test.ts; use Knowledge README prerequisites, including frozen Stage 0 history and Corpus. Site four-input integration now consumes the provider explicitly. Source ownership cutover completed in Stage 4B.
