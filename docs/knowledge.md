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

## Ingredient naming, authoring locale and identity

Canonical English ingredient names use UK culinary English by default where genuinely competing English names exist: aubergine, courgette and icing sugar. This is an editorial convention, not an automatic rename rule. Culturally specific names such as gochujang, miso and paneer retain their natural names.

Optional `locale: en-GB` or `locale: en-US` belongs in `::recipe`. The model retains the authored locale and source text; resolution uses the locale without changing spelling. Invalid or repeated locale metadata produces a warning and is not applied. Absent locale preserves legacy resolution. Reader locale is a separate, future global presentation preference; no reader UI or automatic translation is introduced.

Ingredient entries may add scoped exact names:

```yaml
exact_names:
  - name: powdered sugar
    locale: en-US
    scope: Exact regional culinary name.
```

An omitted locale accepts the name everywhere. A language scope such as en includes en-GB and en-US; a regional scope such as en-US does not include en-GB. Scope prose is editorial, not a matching predicate. Without authoring locale, all potentially matching exact names are considered: multiple identities remain ambiguous rather than selecting by order. Existing names, plural names and aliases retain their historical unscoped matching, including locale-keyed display labels. Use exact_names for new interpretation-sensitive regional names. Canonical IDs remain stable lookup keys.

The resolver API accepts locale as the fourth argument to `resolveIngredient(name, variant, parts, locale)` (or the third to `resolve(term, kind, locale)`). Cilantro continues to identify coriander leaves only, never seeds or roots.

### Regional comparisons are not aliases

`regional_mappings` records comparisons separately. Each record has a name, relation, optional locale, scope, canonical ingredient target and sources (citation plus optional URL, accessed date and note). Relations are directional from this entry to the named target: exact, broader, narrower, overlapping, or approximate-equivalent. An approximate equivalent is a practical culinary comparison, not identical composition or an automatic substitution instruction. It may eventually display as ~.

All mapping records are descriptive and non-resolving, including research-only exact comparisons. Promote reviewed exact wording to exact_names to enable resolution. Broader, narrower, overlapping and approximate-equivalent mappings never supply aliases. The focused tests demonstrate separate UK/US sirloin concepts and a plain-flour/all-purpose-flour comparison; they are model fixtures, not an authoritative cut crosswalk or a claim of exact flour formulation equivalence.

Self-rising flour remains accepted for backwards compatibility with existing authored recipes. Its former en-US display-name entry is now an explicit legacy alias carrying a warning; recipe resolution reports INGREDIENT_COMPATIBILITY. A separate approximate-equivalent mapping records the regional comparison with formulation equivalence unestablished. This grandfathered resolver exception must not be used as a precedent for adding new non-exact aliases. Self-raising flour and the old unhyphenated spelling remain unchanged.

### Promoted names and nested parts

The retained egg-yolk and egg-white entries declare `canonical_target: { ingredient: egg, parts: [yolk] }` (or white). Semantic ingredient resolution normalises both the compound name and structured part syntax to egg plus the same part path. Authored names and parts are unchanged. Targets must reference an existing canonical part path; chains and cycles are rejected.

Low-level entry lookup retains the old IDs for compatibility, but recipe links and usage analytics use the normalised egg-part target. Reference projections expose canonicalTarget; compatibility pages project the same part backlinks, while egg retains nested-part navigation. This preserves old accepted forms without maintaining two independent semantic targets. exactNames and regionalMappings are also available in the reference data projection; presentation is left to consumers.
