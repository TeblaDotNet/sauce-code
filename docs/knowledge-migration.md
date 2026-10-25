# Stage 1 knowledge ownership contracts

Stage 1 proves a proposed split without relocating knowledge or changing defaults.
Sauce Code owns identities and language behaviour; Open Sauce Food owns optional
culinary articles, quantitative values, media and browsing data.

## Loading and snapshots

`loadVocabulary(root)` retains the combined behaviour. The explicit
`loadCanonicalVocabulary(root)` (or `loadVocabulary(root, {canonicalOnly: true})`)
loads all indexed identities without reading enrichment/source registries. It
removes browsing categories, regional comparisons, quantitative values and
part-group descriptions/sources, retaining structural parts and groups.

`KnowledgeSnapshot` is an optional offline schema-version-1 input. Provider ID,
version, source revision and the compatible canonical SHA-256 digest are required.
Resources, enrichments and reviewed quantitative records are independently optional.
`validateKnowledgeSnapshot(snapshot, vocabulary, expectedDigest)` validates targets,
source relationships, review metadata and conversion eligibility using existing
Core rules. Applications supply their pinned digest and explicitly compose data;
there is no download, discovery, automatic quantity installation or CLI change.
The dry-run digest is SHA-256 of recursively key-sorted canonical entries, preserving
array order and excluding undefined object values. It includes transitional fields.

## Raw ownership and reversible extraction

Run `node tools/migration/dry-run.ts` from the integrated Core checkout. This is a
baseline-specific migration tool: it requires the sibling Stage 0 evidence and
Corpus checkout. It writes only to `../_work/migration-stage-1/`.

Explicit raw schemas classify every field/container as Canonical, Editorial,
Quantitative, Provenance or Compatibility. Unknown fields, unknown files and
structural mismatches fail closed and mark the run unsuccessful. Runtime loading
is not used to collect source fields. Raw YAML is parsed with duplicate-key checks;
comments and formatting are retained as original UTF-8 source alongside the data.

The two projections contain complementary typed field records. Reconstruction
combines those records and verifies semantic equality, including array ordering,
against every source document. Original source archives separately preserve bytes;
semantic reconstruction is not claimed to reproduce YAML formatting. Media stays
in place, represented by hashes, metadata and attribution. The manifest includes
source revision, owner, target where available, field/file hashes and handling.
Repeated runs with the same inputs produce identical evidence files.

The pinned Stage 0 inventory checks every original knowledge/media and Corpus
file hash, all 969 identities, 911 articles, 349 photos and the other inventory
totals. Nineteen unindexed YAML records remain historical evidence. Existing
licences, historical documents and executable reference policy are retained as
file-level provenance. No actual destination repository is created.

## Transitional decisions and Stage 2 gates

- `reference` remains canonical compatibility metadata: moving it now would alter
  token links and reference ranking. Site URL and LSP ranking policy stay unchanged.
- `scope` remains intact pending a definition-versus-advice review.
- Curation, identity evidence, observed forms and legacy alias counts remain with
  canonical provenance; absorbed historical records are preserved recursively.
- Browsing categories and regional comparisons belong to culinary knowledge, but
  the combined loader continues to expose them during this stage.
- Part-group descriptions and sources belong to culinary knowledge; group IDs,
  members and resolution structures remain canonical.

Stage 2 must provide compatibility facades and consumer tests before physically
moving these fields. Zero unclassified raw fields does not mean these transitional
policy decisions have been retired. There is no duplicate editable vocabulary.

## Validation

`node --test tests/knowledge-migration.test.ts` covers canonical loading, resolution,
rendering, snapshots, ownership, unknown fields and reconstruction. Set `OSF_CORPUS`
to the sibling Corpus checkout to require parity for all 490 recipes; otherwise
that external-corpus test explicitly skips. Run the normal Core checks, clean-export
public-source audit, package smoke and standalone CLI parity before committing.
