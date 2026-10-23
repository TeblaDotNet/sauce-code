# Processes & Equipment v1

Generated review, 23 October 2026. Local continuation of Vocabulary Quality Batch 1; not human culinary approval. No grammar, ingredient or recipe changes.

## Scope and decisions

Reviewed **29 equipment cases** (26 unresolved forms plus three category questions) and **30 process cases** (25 unresolved heads plus five page-policy cases). See the [decision ledger](processes-equipment-v1-decisions.json) for context, evidence, rationale and deferrals.

Added 10 equipment identities and 11 process/action identities. Seven new processes are technique pages; return, enjoy, push and eat remain non-reference. Existing place accepts put; break accepts break up; dip accepts dunk; pierce accepts prick. Explicit equipment plurals and names are independent of any global morphology rule. Names are not new concepts. All new records have definitions, categories and generated/unchecked curation.

New equipment: cup, cauldron, clay-casserole, work-surface, stove, teaspoon, squeeze-bottle, mixing-bowl, microwave-oven, platter. Cup and teaspoon are utensils, not calibrated measures. Griddle resolves to existing metal-griddle; oven dish to baking-dish, never baking-tray. Clay material does not imply stovetop capability.

New culinary actions: roll-out, butter, oil, flour, pat-dry, juice, sieve. Roll-out is independent of rolling logs or rolling food in coatings. Material-specific butter/oil/flour are not blanket aliases for grease/dust. Sieve covers dry and liquid passage through a sieve; future sift naming still needs an explicit boundary decision.

Suppressed feed, retain, chop-or-shred, grate-or-slice and scrape-or-break reference pages. Canonical IDs and names remain valid. Existing URLs use the established noindex compatibility landing pages linking to the process index, not new HTTP redirects. Borderline release remains public: releasing pressure may need specific guidance and should not be removed by a generic-verb heuristic. Roll, roast, ferment and emulsify remain public.

Local flour bowl, egg bowl, draining bowl and broccoli pot remain unresolved roles rather than global aliases. Electric beaters remains ambiguous; autumn-soup is unchanged. Set, rise, warm, let, bring and turn off are deferred because their scope depends on context or is narrower/broader than candidate identities.

## Comparable measurements

The established audit script was rerun before and after with the same token traversal, locale handling and denominators. It excludes original-source/prose and separates local/ambiguous things. Audit snapshots are retained under `_work/audits/processes-equipment-v1-{before,after}.json`; they include source hashes and evidence.

| Domain | Occurrences before | After | Distinct forms before | After |
|---|---:|---:|---:|---:|
| equipment | 2570/2865 (89.70%) | 2660/2865 (92.84%) | 160/265 (60.38%) | 174/265 (65.66%) |
| process | 4585/4854 (94.46%) | 4724/4854 (97.32%) | 226/324 (69.75%) | 241/324 (74.38%) |

| Inventory | Equipment before → after | Process before → after |
|---|---:|---:|
| Canonical IDs | 155 → 165 | 241 → 252 |
| Explicit aliases | 33 → 38 | 21 → 25 |
| Distinct accepted strings, including IDs | 289 → 321 | 299 → 316 |
| Human-name spellings | 193 → 220 | 261 → 276 |
| Page-eligible identities | 154 → 164 | 195 → 197 |
| Categorised identities | 152 → 165 | 203 → 214 |

Equipment gains 90 occurrences and 14 forms; actions gain 139 occurrences and 15 forms. Remaining gaps: equipment 205 occurrences / 91 forms; processes 130 / 83. These include intentional local roles and ambiguous expressions, not just missing concepts. Process coverage includes ordinary actions; it is not technique completeness. Ingredient coverage remains 7,377/8,909 and 535/1,198 forms. All 490 recipes/specifications parse without errors. The same 489 local-choice, 18 ambiguous and 10 locally unresolved things remain; warning diagnostics are unchanged (353 FREE_TEXT). Same-domain accepted-name collisions remain zero.

All 396 original equipment/process identities and their accepted names are retained. No ingredient inventory change. All 2,260 untouched Corpus tracked files and seven known user files match baseline hashes; the only five Corpus file changes are integration test expectations. No recipe or original-source payload was rewritten.

## Category decisions

Two narrow browsing groups: tableware-and-serving (plate, soup-plate and new serving utensils) and fuel-and-smoking-materials (cooking-wood). Existing storage-and-containers still handles general vessels. All 165 equipment records now have categories. Categories express discovery, not capabilities, food safety, material compatibility or conversion semantics. No global recategorisation was attempted.

## Beyond-Corpus gap inventory

The [structured gap inventory](processes-equipment-v1-gaps.json) separates A common candidates, B specialist later work, C regional research and D existing names/variants requiring reconciliation. This is a bounded desk review, not a comprehensive cultural survey. External checks were used where identity boundaries mattered; no dependencies were installed.

The local inventory already covers knives/boards, mixers, major pan/pot types, ovens, baking tins, thermometers/scales, storage, steaming, fermentation vessels and bar tools. Existing processes cover wet and dry heat, cutting, mixing, dough work, preservation and finishing. Gaps worth reviewing include can openers, timers, kettles, salad spinners, citrus presses, pastry brushes, funnels, food mills, dehydrators and preservation equipment; technique candidates include laminating, docking, clarification and spatchcocking. Regional candidates remain research questions, not invented aliases.

Cambridge supports the [flat metal griddle sense](https://dictionary.cambridge.org/dictionary/english/griddle) and [cauldron vessel scope](https://dictionary.cambridge.org/us/dictionary/english/cauldron?topic=creating-and-producing). Preservation evidence from [NCHFP](https://nchfp.uga.edu/how/can/general-canning-information/recommended-canners/) distinguishes canners from smaller pressure saucepans; [Illinois Extension](https://extension.illinois.edu/food-preservation/equipment) identifies dedicated water-bath, pressure-canning and fermentation equipment. These sources support boundary checks and the follow-up inventory, not a claim that every proposed entry is fully researched. No safety instructions or timings are introduced.

## Practical v1 targets

Do not aim at a universal identity count. Start from 165 equipment IDs and 252 action IDs (197 page-eligible), with 321/316 accepted lookup strings. Review the 13 A equipment candidates and four A technique candidates individually: if all prove distinct, the resulting ceilings for that queue are 178 equipment and 256 action identities, not quotas or promises of completeness. Synonyms and narrowed variants must reduce those estimates. Accepted-name targets should be explicit canonical labels plus attested regional names and useful plurals for each approved concept, with zero ambiguous same-domain names.

For Corpus resolution, preserve at least the current 2,660/2,865 equipment and 4,724/4,854 action matches without regressions. The next target is adjudication of all remaining 91/83 forms: classify every one as a safe match, local role, ambiguous construction or researched missing concept. Require every approved safe match to resolve; do not demand 100% global resolution of recipe-local roles. Report occurrence and distinct-form measures separately after each batch.

Beyond Corpus, require one reviewed coverage matrix spanning the requested preparation, mixing, heat, baking, measurement, serving, storage, preservation and regional areas. Each gap needs evidence, identity scope and an explicit decision before inclusion. No universal completeness percentage is defensible from 490 recipes.

## Smallest reliable autocomplete architecture

Use Core as the sole vocabulary owner. A small provider can enumerate Vocabulary.entries (kind, ID, canonical_name, names, plural_names, aliases, reference, categories and type_of), use the existing resolver for equivalence, and use parsed declarations for local scope. JSON transport already preserves these fields; no new schema or language server is necessary for a first provider. The Node loader supplies indexed YAML to editor integrations; browser clients can consume the serialised vocabulary.

For equipment declarations suggest canonical equipment types with aliases as searchable labels, deduplicated by kind+ID. Within a recipe, rank already declared equipment first and insert its authored local name; do not replace flour bowl with a global bowl suggestion. Within angle brackets suggest process/action heads only. Give meaningful culinary techniques and observed ordinary actions appropriate context-based ranking; downrank enjoy/eat and composite compatibility heads. Reference false must not mean invalid or automatically excluded. Use Corpus frequency as a secondary ranking signal, never as proof of identity or a universal popularity ranking.

Acceptance targets: no cross-domain suggestions in typed contexts; one candidate per identity; exact authored local labels retained; no suggestion silently turns an ambiguous term into an alias; source unchanged until the author accepts a completion. Lexical cursor/context detection must tolerate incomplete syntax, then reuse Core parsing once viable rather than build a second recipe parser. Prototype this separately in the existing VS Code extension; no editor changes were made here.

## Follow-up roadmap

1. Vocabulary: review the A queue in bounded batches, then adjudicate remaining Corpus forms with explicit local-role exclusions.
2. Decisions: resolve set/rise/warm and historical equipment scopes; research comal/tawa/tagine/tandoor and regional techniques without blanket equivalence. Review consistency of material-specific coating pages versus generic grease/dust policy.
3. Autocomplete: implement a small Core-backed, kind-filtered provider with declaration-aware ranking and incomplete-input tests; no LSP prerequisite.
4. Optional depth: add sourced explanatory knowledge to useful techniques and equipment independently of adding IDs; generated records remain unchecked until human review.

## Validation

Passed: Core type check/build; 592 Core tests (including 33 new focused cases); 395 Corpus tests; 128 Site tests; Site type check, build and complete generated-file validation; Core documentation and quality audits; all three diff checks. Ordinary local site-preview.ts returned HTTP 200 with HTML for all 1,529 generated pages, including 16 compatibility pages (15 process, one pre-existing ingredient route). Process compatibility pages retain noindex and process-index destinations. Playwright is unavailable, so the full browser acceptance suite was not run and no dependency was installed.

The strict public-source check is run against a clean tracked-source export, excluding unrelated untracked/ignored user files. The existing ignored user ZIP is not opened, moved, deleted or staged. Detailed logs and integrity results are under _work/audits/pe-* and processes-equipment-v1-*. Corpus changes are restricted to five inventory-count test files; Site changes are validation/count/compatibility tests and browser count expectations. Existing shared Site compatibility generation consumes the extended Core list without a new routing system.

No merge to main, push, publication or deployment. Continuation branches retain Batch 1 ancestry.
