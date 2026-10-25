# Optional offline knowledge providers (Stage 3)

Status: **provider-ready, ownership cutover deferred**. The active Core combined
sources remain authoritative until Site migration; Knowledge remains the verified
migration candidate. Package and standalone distributions are canonical-only.
No source article, photograph, recipe or identity has been deleted or rewritten.

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

Optional taxonomy must equal the existing registry. Changing taxonomy or migrating
its compatibility implementation is later work; no category IDs or routes change.
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

## Why source ownership cutover is deferred

Site currently copies Core's knowledge and assets directly into its integration
workspace. Its release provenance also identifies only Core, Corpus and Site.
Deleting active Core content now would leave image loading and expected reference
counts broken or give release receipts incomplete input provenance. Stage 4 must
add explicit Knowledge input/commit validation, compose its snapshot/sidecars, map
its images and validate build/routes/browser/release inventory before removal.

Core's original combined loader and source remain operational in the meantime.
Knowledge is not yet the sole writable authority. Retain Stage 0/1/2 rollback refs;
no merge, publication or deployment is part of Stage 3.

## Verification

`tests/knowledge-provider.test.ts` exercises portable/Node APIs and hostile overlays.
Set `OSF_MIGRATION_KNOWLEDGE`, `OSF_STAGE0` (an untouched Stage 0 source export) and
`OSF_CORPUS` to run the independent baseline/reference/490-recipe parity test. It
explicitly skips when those external migration inputs are unavailable. Normal Core
provider tests do not require Knowledge or Corpus. Package smoke and isolated
standalone tests verify installed operation without provider content.
