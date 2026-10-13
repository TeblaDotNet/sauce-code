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

Ingredients, processes and equipment may have optional multi-valued `categories` for human browsing. The shared registry in src/vocabulary/categories.ts defines stable IDs, domain eligibility, display names, descriptions and display order. Unknown, cross-domain and duplicate assignments are rejected; missing or empty categories remain valid. Categories never supply aliases, inheritance, type_of, substitution, regional equivalence, parser legality or inferred recipe usage. Processes may also have a concise `scope` explanation. A public process page may have discovery value or explanation value, including regional or contextual ambiguity. Bare temper and proof remain unaliased because resolution is not context-scoped.

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

## Reference enrichment

Optional knowledge/enrichment.yaml contains content records targeting existing canonical kind/ID pairs; knowledge/resources.yaml stores shared sources once. The six initial exemplars are brown-sugar, egg, emulsify, sear, chef-knife and frying-pan. These registries do not alter the domain indexes or resolver identities. The Node loader reads them from the supplied knowledge root and still accepts legacy roots without them. Programmatic consumers can use `new Vocabulary(entries, {resources, enrichments})`; transport all three collections when enrichment is needed.

An enrichment record contains review_version and optional editorial, resources, associations and measurements arrays. Plain-text editorial blocks have stable IDs and typed roles (summary, purpose, mechanism, sensory, uses, storage, judgement, mistakes, selection, care, context and near-neighbours), optional source IDs and their own review_version. Rendering escapes text, uses the fixed role order, preserves authored order within a role and omits empty sections. It never executes authored HTML or interprets prose as parser rules. Existing observation evidence stays separate.

### Writing and selection guidance

Before research, verify canonical existence, public-reference eligibility, absence of duplicate enrichment and fit with the current model. A canonical entry with reference:false is not a candidate public page.

As editorial guidance, ingredient ::about openings use two sentences: first identify what the ingredient is, then explain its culinary use. Process ::about starts with a direct definition; ::purpose explains the intended result and ::how it works explains the mechanism or method. Equipment ::about should identify the object, then explain its common use in a second sentence. Existing pages may not yet follow this convention. Use original, source-supported prose rather than copied definitions. Keep identity separate from advice and avoid taxonomy that does not help the cook.

Depth follows explanatory need. Short concepts stay short; complex methods need useful distinctions and scoped evidence. Do not pad pages to match a template. Every new statement retains review_version 0.1 and appropriate sources; generated content is not human reviewed. Check source scope and publication eligibility before investing in optional images. Images may be omitted when finding a suitable, clearly licensed example would dominate the work.

### Content maturity

review_version is content maturity, not edit count, schema version, Git revision or publication version. Values from 0 inclusive to below 1 are draft/generated; 1 means basic human review, 2 deeper subject/source review, and 3 mature/expert review. Other values are rejected. Integer advancement requires explicit human review; an edit or automated check is not that review. Current enrichment is 0.1 throughout, displayed as “Version 0.1 — machine generated, not yet human reviewed”. The 1/2/3 levels describe future reviewed maturity, not a claim that such pages currently exist. An entry's enrichment maturity is independent of existing canonical identity curation. Evidence-bearing blocks, resource attachments, associations and measurements carry their own maturity; optional reviewed_at uses an ISO calendar date. Display labels are derived, not stored as a second maturity enum.

### Sources and contextual links

Resources have stable ID, title, HTTPS URL, publisher, type, checked_at and review_scope; optional notes, commercial context and known video duration retain limitations. A landing-page check does not mean a video was watched. Omit unknown duration. URLs reject credentials, whitespace, backslashes and non-HTTPS schemes. Resources are attached with learning role, explicit order, contextual note and review_version. Multiple roles/resources are allowed; ties retain authored order. Educational ordering is not an affiliate ranking. No external media is copied.

Associations support commonly-used-with, used-for and contrast-with. Targets contain kind, canonical id and optional canonical ingredient parts. All targets and source IDs are validated. Use egg plus [yolk] or [white], not legacy compatibility IDs, for new evidence-bearing targets. These discovery links do not create aliases, family inheritance, mandatory dependencies, substitutions or recipe backlinks. Actual usage still comes only from resolved recipe tokens in the supplied index. A 14-recipe core sample must not be represented as the full corpus.

### Culinary measurement observations

Measurement records preserve a stable ID, canonical ingredient target, optional product_scope, condition, original source observation, source ID and optional locator/accessed date. Condition describes measuring practice (for example packed), separately from an ingredient preparation state. The unit for a normalised culinary/bulk density is g/mL. value is optional until justified; approximate, uncertainty.basis, normalisation, review_version and conversion_eligible are explicit. Optional positive lower/upper bounds must contain the representative value and have a stated non-unknown basis. Unknown uncertainty has no invented zero-width interval. Optional reference_temperature_c preserves source context; no thermal model is implied.

An executable record requires conversion_eligible true, review_version at least 1, positive representative density and explicit source_volume_ml establishing the original volume basis. That field is evidence, not a reader setting. A directly sourced g/mL density can declare a 1 mL source basis. These checks cannot replace human verification of the source and method. Legacy reference_density remains unchanged and is never automatically promoted into this contract.

The pure convertIngredientMeasurement helper accepts validated observations and an explicit canonical target, amount, from/to units, condition and optional product scope. It converts volume to grams or grams to volume; a g-to-g request bypasses density. Conditions match exactly; scoped records require the matching product scope. Cup/tablespoon/teaspoon mL definitions must be supplied explicitly, independently of authoring locale. Presentation values in cups or tablespoons are derived from the observation and chosen unit basis; canonical culinary/bulk density remains g/mL. No match, missing unit basis or multiple applicable records returns a reason rather than a guess. The conservative selection policy rejects multiple applicable observations even when one is provisional: editorial selection is required. Source approximation, unknown uncertainty and ranges propagate approximation. formatMeasurement provides modest approximate display precision; arithmetic results remain separate. General unit conversion and reader UI are outside this helper.

The brown-sugar observation retains the published 213 g per packed cup, but has no value or source_volume_ml and remains conversion-ineligible. No 236.6/240/250 mL assumption is made. Other conditions or product scopes receive no inferred density. Provisional evidence renders distinctly from eligible observations; eligible does not mean every recipe request is applicable.

Nutrition, dietary guarantees, automatic substitution, full translation/taxonomy, commerce, thermal modelling, process execution and global Reading settings UI remain deferred. Core reference projection and escaped HTML expose the new content without modifying the sibling site or inferring usage from associations.

Reference enrichment may optionally include `hero` metadata: a local `references/` asset,
source page/file, creator, licence and licence URL, attribution, alt text, dimensions,
review date and derivative changes. Images never determine publication eligibility.
The host supplies `heroUrl` when rendering and copies the corresponding asset locally;
without that callback the image is omitted. Image selection evidence and separate
third-party terms live in `assets/references/`. Image review dates do not promote
culinary content maturity.

Enriched reference pages show the page review version in a banner, retaining field
versions in data and displaying them only when different or inside provenance.
The `::` section labels are presentation, not recipe grammar. Image credits,
measurement evidence and source-check scope remain available in expandable details;
canonical identity metadata and part anchors are retained.

### Browsing categories v1

Categories answer where a cook would look, not what an ingredient biologically is. Membership is explicit and never inherited through families or parts. For example, brown-sugar belongs to sugars-and-sweeteners and baking-ingredients; hand-mixer belongs to mixing and appliances. The ingredient registry includes nuts-and-seeds alongside the initial practical food groups. Existing process category IDs are retained: mixing-and-emulsifying displays as Mixing & aeration, preparation-and-cutting as Preparation & knife skills; coating-and-breading and fire-and-smoke remain useful distinct groups. The exported processCategories API remains available.

The site exposes non-empty public category pages at /ingredients/category/{id}/, /processes/category/{id}/ and /equipment/category/{id}/ beneath its configured base path. Counts are public reference entries, not assignment totals; recipe usage remains the existing count of distinct explicit recipe uses. A–Z always includes uncategorised public entries. reference:false never gains a page through membership. Enrichment remains a separate optional layer.

## Authored commercial selection

Ingredient tokens may carry `product: { name, strength, raw, span }`, with strength `specified`, `approximate` or `exact`. This is recipe occurrence data, not an ingredient vocabulary field. See [commercial selection syntax](../SPEC.md#commercial-product-and-expression-selection). A product label and an ingredient type/part remain separate; resolution of the culinary identity does not consume the product name. There is no product registry, inferred brand hierarchy, alias or substitution rule in v1. HTML reference links continue to identify the culinary ingredient.

### Cocktail foundation prose

Optional `types` and `brands` editorial roles provide explanatory prose. `::types` describes culinary styles/types/subtypes. `::brands` optionally describes representative commercial products or expressions where formulation matters. Brands are not types, a listing is not automatically a recommendation, and products in one broad category may differ greatly. This is not a shopping or affiliate ranking list; it creates no inferred equivalence or resolver aliases. These roles do not create canonical types or commercial identities. All new cocktail enrichment is version 0.1 and remains machine generated and not human reviewed. The existing Beverages, Beverage & bar and Coffee & bar browsing categories are reused.
