# Vocabulary Quality v1 — Batch 1

Generated implementation review, 23 October 2026. No entry is marked human checked. Core baseline: 21a20f8d4de6429aad72a2587e14a4f7fb6ff99b; Corpus: 4d7a058bd2ace039f1c6858184b057b46c3940a6; Site: 43513b982bd7d884b298f76d61d348464e1ed3cf. Core and Site feature branch: codex/vocabulary-quality-v1-batch-1.

## Implemented scope

Explicit plurals for chicken cuts, spring/red onions, lemons and retained egg-part identities; explicit compound names for garlic clove, basil/rosemary leaf and citrus zest. Two herb leaf parts are added. No independent ingredients, identity merges, inferred English morphology, grammar changes, recipe edits or quantitative knowledge are introduced.

Chicken breast remains distinct from whole chicken and from the separate physical-part identity; lime juice and lemon peel retain their existing product IDs/routes. Generic flour/self-raising flour and olive oil/extra-virgin olive oil remain separate.

## Before and after

| Domain | Before occurrences | After occurrences | Before distinct forms | After distinct forms |
| --- | --- | --- | --- | --- |
| ingredient | 7269/8909 (81.59%) | 7377/8909 (82.80%) | 523/1198 (43.66%) | 535/1198 (44.66%) |
| equipment | 2544/2865 (88.80%) | 2570/2865 (89.70%) | 157/265 (59.25%) | 160/265 (60.38%) |
| process | 4585/4854 (94.46%) | 4585/4854 (94.46%) | 226/324 (69.75%) | 226/324 (69.75%) |

Both runs parse all 490 active recipes/specifications without errors. Denominators are identical: 8,909 ingredient, 2,865 equipment, 4,854 process occurrences and 1,198/265/324 distinct forms. These include declarations and explicit references, including action parameters; raw source/prose are excluded. Local choices (489), ambiguous things (18), and locally unresolved things (10) are excluded from kind-specific coverage. They remain unchanged. FREE_TEXT warnings remain 353; no new vocabulary ambiguity/collision was introduced.

Ingredient resolution gains 108 occurrences and 12 forms; equipment gains 26 occurrences and three forms. Process resolution does not change: eligibility controls links, not identity. The 26 uses of newly suppressed actions still resolve. No gain comes from rewriting recipes or changing measurement methodology.

| Inventory | Before | After |
| --- | --- | --- |
| Independent ingredients / indexed records | 412 / 414 | 412 / 414 |
| Ingredient aliases | 48 | 48 |
| Ingredient accepted strings (low-level resolver) | 703 | 711 |
| Ingredient lexical part strings | 2 | 11 |
| Ingredient parents with parts / part nodes | 9 / 18 | 11 / 20 |
| Equipment aliases / accepted strings | 33 / 286 | 33 / 289 |
| Equipment with categories | 147 / 155 | 152 / 155 |
| Public ingredient / equipment projections | 414 / 154 | 414 / 154 |
| Process IDs / aliases | 241 / 21 | 241 / 21 |
| Public process projections | 205 | 195 |
| Total eligible reference projections | 773 | 763 |
| Non-reference process occurrences | 1282 | 1308 |

Accepted-string inventory deliberately excludes lexical_names because those belong to resolveIngredient, not low-level resolve. Plural-name additions do not inflate the aliases field count. The nine newly accepted compound part strings and eight new low-level ingredient strings are separate mechanisms. All canonical IDs and existing accepted spellings remain available.

## Identity decisions: 41 cases

Full structured evidence is in [the decision ledger](vocabulary-quality-v1-batch-1-decisions.json). Evidence paths below are Corpus-relative; recipe bytes are unchanged. Prose/source mentions are evidence, not counted as semantic occurrences. Deferred cases are not approved additions.

### 1. garlic cloves — Implemented

- Classification: part.
- Existing structure: garlic:clove exists with plural cloves.
- Evidence: examples/public-domain-recipes/almeirim-stone-soup/almeirim-stone-soup.opensauce:26 — (garlic cloves); examples/public-domain-recipes/almeirim-stone-soup/almeirim-stone-soup.opensauce:42 — (garlic cloves)
- Reason: Explicit lexical name; never an alias for the whole bulb.
- Change: Add garlic clove/cloves lexical_names.
- Outstanding decision: None for this bounded change.

### 2. chicken breasts — Implemented

- Classification: plural.
- Existing structure: chicken-breast independent ID; chicken:breast also exists.
- Evidence: examples/public-domain-recipes/cheddar-crusted-chicken/cheddar-crusted-chicken.opensauce:23 — (chicken breasts); examples/public-domain-recipes/cheddar-crusted-chicken/cheddar-crusted-chicken.opensauce:45 — (chicken breasts)
- Reason: Plural of the existing culinary-cut identity, not an identity merge.
- Change: Add chicken-breast plural_names.
- Outstanding decision: Part-versus-product reconciliation remains separate.

### 3. chicken thighs — Implemented

- Classification: plural.
- Existing structure: chicken-thigh independent ID; chicken:thigh also exists.
- Evidence: examples/public-domain-recipes/chicken-paprikash/chicken-paprikash.opensauce:23 — (chicken thighs, bone-in; skin-on); examples/public-domain-recipes/chicken-paprikash/chicken-paprikash.opensauce:46 — (chicken thighs)
- Reason: Keep the cut distinct from whole chicken.
- Change: Add chicken-thigh plural_names.
- Outstanding decision: Do not equate prepared cuts with all physical parts.

### 4. kosher salt — Deferred

- Classification: missing subtype.
- Existing structure: salt and sea-salt; no exact kosher-salt concept.
- Evidence: examples/public-domain-recipes/coleslaw/coleslaw.opensauce:31 — (kosher salt); examples/public-domain-recipes/coleslaw/coleslaw.opensauce:54 — (kosher salt)
- Reason: Do not collapse crystal/product distinctions into generic salt.
- Change: None.
- Outstanding decision: Define product scope and type relationship before adding a concept.

### 5. green onions — Implemented

- Classification: plural.
- Existing structure: spring-onion accepts green onion and scallions.
- Evidence: examples/public-domain-recipes/creamy-mashed-potatoes/creamy-mashed-potatoes.opensauce:27 — (green onions); examples/public-domain-recipes/creamy-mashed-potatoes/creamy-mashed-potatoes.opensauce:59 — (green onions)
- Reason: Explicit regional plural of existing identity.
- Change: Add en-GB spring onions and en-US green onions plurals.
- Outstanding decision: None for this bounded change.

### 6. meat — Rejected

- Classification: local role.
- Existing structure: No generic meat identity; varied recipe choices.
- Evidence: examples/public-domain-recipes/frittata/frittata.opensauce:29 — (meat, thinly sliced, optional); examples/public-domain-recipes/frittata/frittata.opensauce:46 — (meat)
- Reason: A broad ingredient role is not one usable product.
- Change: No placeholder ID.
- Outstanding decision: Individual recipes may eventually declare explicit choices; unchanged here.

### 7. yellow onion — Deferred

- Classification: missing subtype.
- Existing structure: onion, red-onion and white-onion exist.
- Evidence: examples/public-domain-recipes/basic-meatballs/basic-meatballs.opensauce:26 — (yellow onion, diced); examples/public-domain-recipes/basic-meatballs/basic-meatballs.opensauce:51 — (yellow onion)
- Reason: A color-specific onion should not become an unqualified onion alias.
- Change: None.
- Outstanding decision: Approve subtype scope and regional naming in a small expansion batch.

### 8. basil leaves — Implemented

- Classification: part.
- Existing structure: basil exists; no leaf part before batch.
- Evidence: examples/public-domain-recipes/chipolata-in-balsamic-vinegar/chipolata-in-balsamic-vinegar.opensauce:27 — (basil leaves, fresh); examples/public-domain-recipes/chipolata-in-balsamic-vinegar/chipolata-in-balsamic-vinegar.opensauce:59 — (basil leaves)
- Reason: The explicitly authored leaf is not the whole herb plant.
- Change: Add leaf/leaves part and basil leaf/leaves lexical names.
- Outstanding decision: None for this bounded change.

### 9. basmati rice — Deferred

- Classification: missing subtype.
- Existing structure: rice exists; no basmati variant.
- Evidence: examples/public-domain-recipes/hakka-style-meatballs/hakka-style-meatballs.opensauce:30 — (basmati rice); examples/public-domain-recipes/hakka-style-meatballs/hakka-style-meatballs.opensauce:49 — (basmati rice)
- Reason: Basmati is more specific than generic rice.
- Change: None.
- Outstanding decision: Choose variant versus stable subtype with evidence.

### 10. sausages — Deferred

- Classification: missing product family.
- Existing structure: chorizo and other specific meats, no sausage identity.
- Evidence: examples/public-domain-recipes/aussie-snags/aussie-snags.opensauce:22 — (sausages, thin); examples/public-domain-recipes/aussie-snags/aussie-snags.opensauce:40 — (sausages)
- Reason: Not an alias for pork or any one sausage product.
- Change: None.
- Outstanding decision: Define broad family and subtype boundaries.

### 11. cherry tomatoes — Deferred

- Classification: missing subtype.
- Existing structure: tomato and plum-tomato exist.
- Evidence: examples/public-domain-recipes/babas-feta-pasta/babas-feta-pasta.opensauce:29 — (cherry tomatoes, finely sliced); examples/public-domain-recipes/babas-feta-pasta/babas-feta-pasta.opensauce:73 — (cherry tomatoes)
- Reason: Do not erase the named type.
- Change: None.
- Outstanding decision: Choose variant or independent subtype.

### 12. smoked paprika — Deferred

- Classification: processed product.
- Existing structure: paprika exists without smoked variant.
- Evidence: examples/public-domain-recipes/cannellini-bean-salad/cannellini-bean-salad.opensauce:26 — (smoked paprika); examples/public-domain-recipes/cannellini-bean-salad/cannellini-bean-salad.opensauce:40 — (smoked paprika)
- Reason: Processing distinction has culinary meaning.
- Change: None.
- Outstanding decision: Define state/product identity and avoid generic alias.

### 13. ground beef — Deferred

- Classification: preparation/product.
- Existing structure: beef exists; no ground state.
- Evidence: examples/public-domain-recipes/chili-con-carne/chili-con-carne.opensauce:24 — (ground beef); examples/public-domain-recipes/chili-con-carne/chili-con-carne.opensauce:45 — (ground beef)
- Reason: A common preparation is not automatically a global alias.
- Change: None.
- Outstanding decision: Decide explicit state or culinary product representation.

### 14. anglerfish — Deferred

- Classification: missing ingredient.
- Existing structure: fish and fish-fillet are broad existing concepts.
- Evidence: examples/public-domain-recipes/fried-anglerfish-fillet/fried-anglerfish-fillet.opensauce:20 — (anglerfish); examples/public-domain-recipes/fried-anglerfish-fillet/fried-anglerfish-fillet.opensauce:36 — (anglerfish)
- Reason: No safe exact target; not interchangeable with generic fish.
- Change: None.
- Outstanding decision: Confirm species/commercial-name scope before addition.

### 15. red wine — Deferred

- Classification: missing subtype.
- Existing structure: wine and white-wine exist.
- Evidence: examples/public-domain-recipes/gluehwein/gluehwein.opensauce:22 — (red wine); examples/public-domain-recipes/gluehwein/gluehwein.opensauce:38 — (red wine)
- Reason: Red/white distinctions must survive.
- Change: None.
- Outstanding decision: Approve subtype scope, not alias to generic wine.

### 16. mozzarella cheese — Deferred

- Classification: missing ingredient.
- Existing structure: cheese and other named cheeses; no mozzarella.
- Evidence: examples/public-domain-recipes/baked-mostaccioli/baked-mostaccioli.opensauce:26 — (mozzarella cheese, shredded); examples/public-domain-recipes/baked-mostaccioli/baked-mostaccioli.opensauce:41 — (mozzarella cheese)
- Reason: Distinct product, not a synonym for generic cheese.
- Change: None.
- Outstanding decision: Define mozzarella identity/type coverage.

### 17. pork butt — Deferred

- Classification: regional cut.
- Existing structure: pork-shoulder exists.
- Evidence: examples/public-domain-recipes/chicharrones/chicharrones.opensauce:18 — (pork butt, with fat); examples/public-domain-recipes/chicharrones/chicharrones.opensauce:37 — (pork butt)
- Reason: Cut equivalence may depend on regional butchery.
- Change: None.
- Outstanding decision: Human adjudication of exact/broader/narrower relationship.

### 18. peppercorns — Deferred

- Classification: part/product ambiguity.
- Existing structure: pepper, black-pepper, white-pepper.
- Evidence: examples/public-domain-recipes/cacio-e-pepe/cacio-e-pepe.opensauce:22 — (peppercorns); examples/public-domain-recipes/cacio-e-pepe/cacio-e-pepe.opensauce:37 — (peppercorns)
- Reason: Color and whole-versus-ground scope are unspecified.
- Change: None.
- Outstanding decision: Do not silently choose black pepper.

### 19. seasoning — Rejected

- Classification: local role.
- Existing structure: Recipe permits salt/pepper/cayenne/paprika choices.
- Evidence: examples/public-domain-recipes/chicken-tenders-airfried/chicken-tenders-airfried.opensauce:26 — (seasoning, salt and pepper with cayenne or paprika; optional); examples/public-domain-recipes/chicken-tenders-airfried/chicken-tenders-airfried.opensauce:37 — (seasoning)
- Reason: Generic role rather than a fixed ingredient.
- Change: No canonical placeholder.
- Outstanding decision: Retain authored wording.

### 20. button mushrooms — Deferred

- Classification: possible synonym.
- Existing structure: champignon-mushroom and mushrooms exist.
- Evidence: examples/public-domain-recipes/full-english-breakfast/full-english-breakfast.opensauce:28 — (button mushrooms); examples/public-domain-recipes/full-english-breakfast/full-english-breakfast.opensauce:44 — (button mushrooms)
- Reason: Potential alias needs scope review against maturity/species terms.
- Change: None.
- Outstanding decision: Confirm intended exact equivalence.

### 21. sour cream / soured cream — Deferred

- Classification: near duplicate.
- Existing structure: sour-cream and soured-cream retained.
- Evidence: examples/public-domain-recipes/chicken-paprikash/chicken-paprikash.opensauce:33 — (sour cream, optional); examples/public-domain-recipes/chicken-paprikash/chicken-paprikash.opensauce:72 — (sour cream)
- Reason: No supplied scope evidence settles regional formulations.
- Change: Retain IDs/routes.
- Outstanding decision: Confirm equivalence and compatibility mapping.

### 22. cooking spray / nonstick spray — Deferred

- Classification: near duplicate.
- Existing structure: cooking-spray and nonstick-spray retained.
- Evidence: examples/public-domain-recipes/baked-salmon/baked-salmon.opensauce:24 — (cooking spray); examples/public-domain-recipes/bread/bread.opensauce:26 — (nonstick spray)
- Reason: Nonstick blends may contain additional ingredients.
- Change: Retain IDs/routes.
- Outstanding decision: Review product scope, not spelling alone.

### 23. parmesan cheese / Parmigiano Reggiano — Rejected

- Classification: generic/specific product.
- Existing structure: parmesan-cheese and parmigiano-reggiano retained.
- Evidence: examples/public-domain-recipes/baked-pasta-with-broccoli/baked-pasta-with-broccoli.opensauce:25 — (parmesan cheese, optional); examples/public-domain-recipes/baked-pasta-with-broccoli/baked-pasta-with-broccoli.opensauce:62 — (parmesan cheese)
- Reason: Generic and specific product designations are not a safe exact alias.
- Change: No merge.
- Outstanding decision: A sourced subtype relationship may be proposed later.

### 24. lime juice / lime:juice — Deferred

- Classification: product/part.
- Existing structure: lime-juice and lime:juice retained.
- Evidence: examples/cocktail-specs/cointreau-margarita/cointreau-margarita.opensauce:19 — (lime: juice, fresh); examples/cocktail-specs/difford-hemingway-daiquiri/difford-hemingway-daiquiri.opensauce:20 — (lime: juice, fresh)
- Reason: Authored juice may be prepared/bottled, not always freshly separated.
- Change: No mapping; existing routes remain.
- Outstanding decision: Confirm normalization policy without losing product scope.

### 25. lemon peel / lemon:peel — Deferred

- Classification: product/part.
- Existing structure: lemon-peel and lemon:peel retained.
- Evidence: examples/cocktail-specs/cointreau-sidecar/cointreau-sidecar.opensauce:19 — (lemon: juice, fresh); examples/cocktail-specs/difford-bramble/difford-bramble.opensauce:17 — (lemon: juice, fresh)
- Reason: Processed peel versus physical part remains under-specified.
- Change: No mapping.
- Outstanding decision: Agree scope and old-route strategy.

### 26. chicken breast / chicken:breast — Deferred

- Classification: cut/part.
- Existing structure: chicken-breast and chicken:breast retained.
- Evidence: examples/public-domain-recipes/arroz-chaufa/arroz-chaufa.opensauce:27 — (chicken); examples/public-domain-recipes/arroz-chaufa/arroz-chaufa.opensauce:34 — (chicken)
- Reason: Culinary cut and anatomy should not be auto-merged.
- Change: Only plural expansion, no mapping.
- Outstanding decision: Review cut scope separately.

### 27. chicken thigh / chicken:thigh — Deferred

- Classification: cut/part.
- Existing structure: chicken-thigh and chicken:thigh retained.
- Evidence: examples/public-domain-recipes/arroz-chaufa/arroz-chaufa.opensauce:27 — (chicken); examples/public-domain-recipes/arroz-chaufa/arroz-chaufa.opensauce:34 — (chicken)
- Reason: Bone/skin/prepared product context can matter.
- Change: Only plural expansion, no mapping.
- Outstanding decision: Review cut scope separately.

### 28. garlic clove — Implemented

- Classification: part.
- Existing structure: garlic:clove.
- Evidence: examples/public-domain-recipes/fondue/fondue.opensauce:23 — (garlic clove)
- Reason: Singular and plural compound names use the same explicit part mechanism.
- Change: Add lexical_names; no morphology rule.
- Outstanding decision: None for this bounded change.

### 29. rosemary leaves — Implemented

- Classification: part.
- Existing structure: rosemary exists; authored rosemary:leaves currently incomplete.
- Evidence: examples/public-domain-recipes/tomato-flavored-hamburger-macaroni/tomato-flavored-hamburger-macaroni.opensauce:35 — (rosemary leaves)
- Reason: Named leaves warrant an explicit local part.
- Change: Add leaf/leaves with rosemary leaf/leaves lexical_names.
- Outstanding decision: None for this bounded change.

### 30. lemons — Implemented

- Classification: plural.
- Existing structure: lemon exists.
- Evidence: examples/public-domain-recipes/limoncini/limoncini.opensauce:31 — (lemons, untreated; edible skin); examples/public-domain-recipes/limoncini/limoncini.opensauce:52 — (lemons)
- Reason: Ordinary whole-fruit plural.
- Change: Add plural_names.
- Outstanding decision: None for this bounded change.

### 31. red onions — Implemented

- Classification: plural.
- Existing structure: red-onion exists.
- Evidence: examples/public-domain-recipes/spicy-sausage-pasta/spicy-sausage-pasta.opensauce:24 — (red onions, chopped); examples/public-domain-recipes/spicy-sausage-pasta/spicy-sausage-pasta.opensauce:44 — (red onions)
- Reason: Plural preserves the named onion identity.
- Change: Add plural_names.
- Outstanding decision: None for this bounded change.

### 32. egg yolks — Implemented

- Classification: plural compatibility.
- Existing structure: egg-yolk canonical_target already points to egg:yolk.
- Evidence: examples/public-domain-recipes/omelet/omelet.opensauce:27 — (egg yolks, beaten until thick); examples/public-domain-recipes/omelet/omelet.opensauce:49 — (egg yolks)
- Reason: Reuse existing compatibility target; no additional identity.
- Change: Add plural_names on retained compatibility record.
- Outstanding decision: None for this bounded change.

### 33. egg whites — Implemented

- Classification: plural compatibility.
- Existing structure: egg-white canonical_target already points to egg:white.
- Evidence: examples/public-domain-recipes/omelet/omelet.opensauce:28 — (egg whites, beaten stiff); examples/public-domain-recipes/omelet/omelet.opensauce:55 — (egg whites)
- Reason: Reuse existing compatibility target.
- Change: Add plural_names on retained compatibility record.
- Outstanding decision: None for this bounded change.

### 34. lemon juice — Investigated; already supported

- Classification: existing part name.
- Existing structure: lemon:juice has explicit lexical_names.
- Evidence: examples/public-domain-recipes/aljotta/aljotta.opensauce:28 — (lemon juice); examples/public-domain-recipes/apple-pie/apple-pie.opensauce:21 — (lemon juice)
- Reason: Existing behavior already preserves juice versus whole lemon.
- Change: No change.
- Outstanding decision: None for this bounded change.

### 35. lemon zest — Implemented

- Classification: part.
- Existing structure: lemon:zest exists.
- Evidence: examples/cocktail-specs/difford-sazerac/difford-sazerac.opensauce:32 — <express citrus oil, from lemon zest twist over the drink>; examples/cocktail-specs/iba-americano/iba-americano.opensauce:25 — <garnish, with half an orange slice and lemon zest>
- Reason: Explicit compound name retains zest, not peel or whole fruit.
- Change: Add lexical_names on zest.
- Outstanding decision: None for this bounded change.

### 36. lime zest — Implemented

- Classification: part.
- Existing structure: lime:zest exists.
- Evidence: examples/cocktail-specs/cointreau-margarita/cointreau-margarita.opensauce:30 — <garnish, with lime zest>
- Reason: Same scoped mechanism; no juice mapping.
- Change: Add lexical_names on zest.
- Outstanding decision: None for this bounded change.

### 37. orange zest — Implemented

- Classification: part.
- Existing structure: orange:zest exists.
- Evidence: examples/cocktail-specs/cointreau-sidecar/cointreau-sidecar.opensauce:28 — <garnish, with orange zest>; examples/cocktail-specs/difford-adonis/difford-adonis.opensauce:35 — <express citrus oil, from orange zest over the drink> <discard, zest>
- Reason: Preserve distinction from peel and whole orange.
- Change: Add lexical_names on zest.
- Outstanding decision: None for this bounded change.

### 38. giner syrup — Deferred

- Classification: source spelling.
- Existing structure: giner-syrup existing ID and source both spell giner.
- Evidence: examples/public-domain-recipes/tomato-and-grilled-paprika-soup/tomato-and-grilled-paprika-soup.opensauce:30 — (giner syrup); examples/public-domain-recipes/tomato-and-grilled-paprika-soup/tomato-and-grilled-paprika-soup.opensauce:46 — (giner syrup)
- Reason: Original source repeats the spelling, so correction is not independently established.
- Change: Retain accepted name and ID.
- Outstanding decision: Confirm ginger syrup is intended before adding corrected display name/alias.

### 39. carrots — Investigated; already supported

- Classification: existing plural.
- Existing structure: carrot plural_names already contains carrots.
- Evidence: examples/public-domain-recipes/autumn-soup/autumn-soup.opensauce:26 — (carrots); examples/public-domain-recipes/autumn-soup/autumn-soup.opensauce:42 — (carrots)
- Reason: Control case: no new plural needed.
- Change: No change.
- Outstanding decision: None for this bounded change.

### 40. bay leaves — Investigated; already supported

- Classification: existing plural.
- Existing structure: bay-leaf plural_names already contains bay leaves.
- Evidence: examples/public-domain-recipes/bebek-mropol/bebek-mropol.opensauce:27 — (bay leaves); examples/public-domain-recipes/bebek-mropol/bebek-mropol.opensauce:49 — (bay leaves)
- Reason: Control case: do not manufacture duplicate aliases.
- Change: No change.
- Outstanding decision: None for this bounded change.

### 41. citrus rind — Deferred

- Classification: ambiguous part.
- Existing structure: lemon/lime/orange have separate zest and peel.
- Evidence: examples/public-domain-recipes/orange-pudding/orange-pudding.opensauce:41 — (orange: rind); examples/public-domain-recipes/orange-pudding/orange-pudding.opensauce:41 — (lime: rind)
- Reason: Rind can be used inconsistently for outer zest versus full peel.
- Change: No automatic rind alias.
- Outstanding decision: Review authored meaning per recipe before choosing a part.

## Process/action review

Ten generic heads are marked reference:false: move, open, close, use, wait, insert, lift, slide, handle and test. Each retains its canonical ID, names, syntax and resolver identity. They express ordinary manipulation, instruction or waiting rather than a distinct technique needing a knowledge page; test does not prescribe a technique or endpoint by itself. Their action parameters remain literal. Roast, ferment and emulsify are retained and tested; borderline rest, heat, drain, line, shape and similar techniques are not blanket-suppressed.

Site previously only handled the lemon-juice compatibility route. Batch 1 reuses that small static-page pattern: each /opensaucefood/processes/<id>/ URL still returns an explanatory noindex HTML page, canonicalizing/linking to the process index. This is a compatibility landing page, not an HTTP redirect or a replacement culinary entry. Removed entries are absent from indexes, canonical reference projections and new recipe links. The list is exported from Core reference utilities so Site and tests share it. No server routing framework, production configuration or generic verb vocabulary is added.

| Action | Corpus occurrences before suppression | Decision |
| --- | ---: | --- |
| move | 7 | Generic; keep compatibility URL and action identity |
| open | 2 | Generic; keep compatibility URL and action identity |
| close | 2 | Generic; keep compatibility URL and action identity |
| use | 2 | Generic; keep compatibility URL and action identity |
| wait | 5 | Generic; keep compatibility URL and action identity |
| insert | 1 | Generic; keep compatibility URL and action identity |
| lift | 2 | Generic; keep compatibility URL and action identity |
| slide | 3 | Generic; keep compatibility URL and action identity |
| handle | 0 | Generic; keep compatibility URL and action identity |
| test | 2 | Generic; keep compatibility URL and action identity |

## Eight equipment category decisions

| Record | Evidence / scope | Decision |
| --- | --- | --- |
| cooking-wood | baby-back-ribs:29; smoking fuel, not a tool/container | Deferred: no suitable fuel/fire category; do not force cookware |
| cutter | Existing observed qualifiers round / 5cm; generic cutting implement | knives-and-cutting; does not imply a knife or narrow cookie-cutter alias |
| dish | bread-pudding:31/48 and pulled-rabbit:62; general containing vessel | storage-and-containers; do not promise oven safety |
| grease-pan | creme-brulee:35/45–47; pan containing ramekins and water in oven | bakeware; no speculative rename to roasting pan |
| plate | Existing serving/holding uses across recipes | Deferred: tableware is not well represented; avoid storage-only classification |
| soup-plate | Existing pudding serving/holding evidence | Deferred with plate; no new category in this batch |
| tray | pho-soup:43; potato-and-eggplant-curry:37; differing uses | storage-and-containers, not blanket oven-safe bakeware |
| vessel | pretzels:36 explicitly heat-safe/chemically non-reactive | storage-and-containers; qualifiers remain author responsibility |

Secondary fixes: explicit baking trays/baking sheets plural_names on baking-tray; paper towels on paper-towel. Generic cup, cauldron, clay casserole, flour bowl, work surface and oven dish remain unresolved rather than receiving guessed aliases. Electric beaters remains deliberately unresolved.

## Validation

Core: typecheck, build, 559 tests, documentation checks and quality audit passed. Corpus: 395 existing integration tests passed. Site: 128 integration tests passed, including full generated link/path validation and the ten new noindex compatibility-page assertions. Focused Core tests cover 24 cases, source preservation, exact part anchors, retained distinctions, malformed plural rejection, collision rejection, action semantics and categories. Full browser acceptance is not claimed; static generation/routing tests cover this batch. The working-tree public-source check stopped on the pre-existing ignored examples/open-sauce-chatgpt-batch-1.zip. That user archive remains untouched; a clean approved-source export is audited separately without weakening the checker. Final diff checks passed. The unchanged Core checker passed against a clean approved-source export (1,035 files, 810 vocabulary records, 14 curated samples), using existing Core dependencies without installing anything. Site type checking and its local build/full link validation also passed. Integrity hashes confirm all 2,265 Corpus files and seven known user files unchanged.

## Reproduction

The audit scripts remain outside repositories in _work/audits. vocabulary-quality-v1-measure.mjs and vocabulary-quality-v1-measure-after.mjs are the original knowledge-base-v1-audit.mjs with only output JSON filenames changed. Before/after snapshots preserve file hashes, all ranked queues and metrics. The before run used the baseline data above; do not overwrite it by running the before script on modified data. The after script reads the current checked-out Core and unchanged Corpus.

Run pnpm check, pnpm build, pnpm test, pnpm docs:check and pnpm quality:audit in Core; pnpm test in Corpus and Site. Integration commands create ignored test workspaces. No network or dependency installation is needed with the installed dependencies. No recipe sources are modified.

## Next: Processes & Equipment v1

Measured post-batch gaps remain 295 equipment occurrences / 105 distinct forms and 269 action occurrences / 98 forms. Equipment resolution is about 90% by usage but only 60% by distinct form, so it is not close to reliable broad autocomplete completeness. Actions resolve about 94% by usage but 70% by distinct head; frequent everyday verbs dominate, while missing techniques and multiword forms remain. Neither domain has a defensible universal completeness percentage.

Propose a bounded 20–30 equipment-term review (plural forms, vessels, cookware, local roles), a 20–30 action-head review (put/return versus roll out, rise, warm, and alternative heads), and a tableware/fuel category decision. Use completion candidates only from explicitly accepted names; keep generic actions distinguishable from page-eligible techniques and never infer culinary equivalence from similar words. Review remaining generic pages and compatibility URLs before broader publication. Confirm scope/aliases, source evidence and ambiguity tests per term. No autocomplete/LSP implementation belongs to this batch.
