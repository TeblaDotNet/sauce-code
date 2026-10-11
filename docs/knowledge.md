# Culinary knowledge

Knowledge connects authored recipe words to shared culinary concepts without changing the recipe source. Ingredients, equipment and processes have stable IDs. The files in knowledge/ are grouped by domain; each index.yaml explicitly identifies canonical entries. Unindexed legacy files are evidence, not additional runtime concepts.

## Identity and names

An entry has `id`, `kind` and locale-keyed `names`, with optional `canonical_name`, `plural_names` and explicit `aliases`. Aliases can be strings or named records with locale/evidence. Only explicit aliases participate in resolution. Observed phrases, qualifiers and parameters are evidence, never aliases merely because they occurred in a recipe. Prefer a small number of meaningful concepts over duplicate IDs, while retaining useful names.

`curation.origin` describes manual/generated provenance; `curation.review` describes checked/unchecked review. These axes are independent. Retain sources and qualify uncertainty. Quantitative values require units, basis and source context; do not invent nutrition, density or typical mass from incidental recipes.

## Relationships, parts and states

`type_of` expresses an explicit semantic subtype relationship for ingredients/equipment. It is not a browsing category. Parent and child concepts remain distinct; aliases are not a substitute for relations. Relationships must target valid concepts and must not form cycles.

Ingredient `parts` may nest. Part paths keep the parent context; `part_groups` describe named groupings and associated processes. A reference to egg yolk targets the egg concept and its yolk anchor, not an invented separate ingredient. Unknown suffixes remain authored text.

Preparation `states` annotate explicitly recognised authored qualifiers. They do not create implicit transformations, nutritional equivalence or automatic transitions. Parts, types and preparation are different concepts. Ordinary descriptive qualifiers remain text.

Equipment subtype relationships express identity, not suitability guarantees. Processes resolve action heads while retaining authored context; nested ingredient/equipment/result references belong to that context. Do not absorb whole instructions into canonical names.

## Reference eligibility and local roles

`reference: false` preserves a known concept without giving it a shared reference page. Local ingredient roles/choices can remain unresolved and still have ingredient semantics. Colour follows semantic role; links and underline require an actual shared target. Reference eligibility is separate from vocabulary membership.

## Contributing data

Follow the adjacent entries and the typed model in src/vocabulary/index.ts for exact field shapes; tests exercise validation and rendering. Keep IDs stable, update the domain index deliberately and run core checks. The Node loader takes the directory containing ingredients/equipment/processes; pass knowledge/ in this repository. Its generic root contract is unchanged.

Processes may have optional multi-valued `categories` for human browsing and a concise `scope` explanation. Categories are validated against the exported processCategories list, never aliases, inheritance, type_of or parser legality. Only the approved first process tranche is categorised; equipment categories remain future work and ingredient taxonomy awaits research. A public process page may have discovery value or explanation value, including regional or contextual ambiguity. Bare temper and proof remain unaliased because resolution is not context-scoped.

Historical evidence paths inside unchanged knowledge records are corpus-relative provenance identifiers. Resolve examples/public-domain-recipes paths against the full corpus project, not the curated core sample. The extraction deliberately does not rewrite evidence or identities.
