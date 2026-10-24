# Processes & Equipment Knowledge Expansion — Batch 5

Research date: 24 October 2026. Generated drafts; human review remains outstanding.

Adds 15 equipment identities and 8 specific culinary processes, and improves 20 existing enrichment drafts. The focus is pastry tools, sauce preparation and shellfish preparation. No recipes, ingredients, language, parser, schema, renderer or editor behaviour changed. Corpus and Site changes update only integration coverage assertions.

## Coverage

| Measure | Before | After |
| --- | ---: | ---: |
| equipment identities | 210 | 225 |
| equipment aliases | 48 | 50 |
| equipment accepted names including IDs | 415 | 447 |
| equipment human-facing spellings | 275 | 292 |
| equipment eligible reference pages | 209 | 224 |
| equipment categorized identities | 210 | 225 |
| process identities | 276 | 284 |
| process aliases | 27 | 28 |
| process accepted names including IDs | 352 | 368 |
| process human-facing spellings | 302 | 311 |
| process eligible reference pages | 221 | 229 |
| process categorized identities | 238 | 246 |
| Enriched pages | 456 | 479 |
| Equipment enrichment | 156 | 171 |
| Process enrichment | 146 | 154 |
| All eligible reference pages | 844 | 867 |
| Site pages | 1598 | 1621 |
| Corpus equipment occurrences resolved | 2668/2865 | 2668/2865 |
| Corpus equipment distinct forms resolved | 178/265 | 178/265 |
| Corpus process occurrences resolved | 4724/4854 | 4724/4854 |
| Corpus process distinct forms resolved | 241/324 | 241/324 |

All 490 active Corpus recipes parse. Ingredient coverage remains unchanged. No same-domain accepted-name collisions were found. This tranche fills broader domain gaps without forcing aliases onto current Corpus wording. There are 2 new equipment aliases, 1 process alias, 4 equipment subtype edges and 12 contextual associations. No categories were added. All new canonical entries are generated/unchecked; enrichment review_version remains 0.1.

## New identities

### larding-needle (equipment)

A tool for drawing strips of fat into meat during larding. Its purpose differs from a trussing needle, which carries thread to fasten a shape; neither is a generic synonym for every kitchen needle.

Category: preparation-tools. Aliases: none. Source: [Larder](https://chefsimon.com/articles/lexique-larder).

### fish-bone-tongs (equipment)

Gripping tongs designed to extract individual bones from fish flesh. The gripping edges grasp the bone rather than cut a fillet away from the skeleton. Shape and size vary; ordinary serving tongs are not necessarily suitable.

Category: preparation-tools. Aliases: none. Subtype of tongs. Source: [Triangle Flat Edge Fish Bone Tongs](https://matferbourgeatusa.com/product/triangle-flat-edge-fish-bone-tongs/).

### oyster-knife (equipment)

A short, sturdy knife designed to open oyster shells. Its blade works at the shell joint rather than slicing a piece of food; the specialised construction should not be inferred from the word knife alone.

Category: knives-and-cutting. Aliases: none. Subtype of knife. Source: [Oyster Knife](https://www.oxo.com/oyster-knife.html).

### cherry-pitter (equipment)

A tool that holds a cherry while a plunger pushes out its stone. Some designs also accommodate olives, but that capability does not make every fruit pitter interchangeable or establish an unrestricted olive-pitter alias.

Category: preparation-tools. Aliases: none. Source: [Cherry & Olive Pitter](https://www.oxo.com/oxo-gg-cherry-and-olive-pitter-black.html).

### fat-separator (equipment)

A vessel that lets fat rise above cooking juices and dispenses the liquid beneath it. A lower outlet or suitable spout separates the layers; a top strainer removes solids, which is a different task from separating fat.

Category: preparation-tools. Aliases: none. Source: [Good Gravy Fat Separator](https://www.oxo.com/good-gravy-fat-separator-4-cup.html).

### bulb-baster (equipment)

A tube with a squeezable bulb for drawing up cooking juices and releasing them over food. It transfers liquid onto the surface; it is not a syringe for injecting liquid into the interior.

Category: preparation-tools. Aliases: none. Source: [Angled Baster With Cleaning Brush](https://www.oxo.com/angled-baster-with-cleaning-brush.html).

### egg-slicer (equipment)

A hinged slicer with a holder for an egg and a set of parallel cutting wires. It portions a cooked egg into slices; it does not separate raw egg white from yolk. Slice thickness depends on the tool.

Category: knives-and-cutting. Aliases: none. Source: [Egg Slicer](https://www.oxo.com/egg-slicer.html).

### julienne-peeler (equipment)

A hand tool with a divided cutting edge that draws narrow strips from vegetables. It produces strips rather than a broad peel; their dimensions depend on the blade, so the tool name does not promise a particular classical knife-cut size.

Category: knives-and-cutting. Aliases: none. Subtype of vegetable-peeler. Source: [Julienne Peeler](https://www.oxo.com/shop/kitchenware/utensils/julienne-peeler.html).

### piping-tip (equipment)

A shaped outlet fitted to a piping bag. Round, star and other openings shape the material leaving the bag; the tip is distinct from the bag itself.

Category: preparation-tools. Aliases: piping nozzle. Source: [Ateco catalogue: pastry wheels and dough docker, pages 73–76](https://www.atecousa.com/assets/ateco_catalog.pdf).

### cake-turntable (equipment)

A rotating platform that supports a cake during decoration. Rotation brings successive surfaces within reach without repeatedly lifting the cake.

Category: preparation-tools. Aliases: revolving cake stand. Source: [Ateco catalogue: pastry wheels and dough docker, pages 73–76](https://www.atecousa.com/assets/ateco_catalog.pdf).

### tart-ring (equipment)

An open-bottomed frame supporting the sides of a tart or assembled pastry. It needs a separate supporting surface beneath it; it is not a pie dish with an integral base. Ring dimensions and shapes vary.

Category: bakeware. Aliases: none. Source: [Matfer Bourgeat catalogue: frames and rings, page 49](https://matferbourgeatusa.com/catalog-2019/Matfer_Bourgeat_Inc_2019_Catalog_LR.pdf).

### pie-weights (equipment)

Weights placed over a liner in an unfilled pastry case during baking. They support the base and sides against puffing or slumping. Coverage matters: weighing down only the centre does not necessarily support the walls.

Category: bakeware. Aliases: none. Source: [Baking trials: prepping a pie crust for prebaking](https://www.kingarthurbaking.com/blog/2025/10/08/prebake-pie-weights).

### silicone-baking-mat (equipment)

A reusable silicone baking liner laid on a tray. It is distinct from a pastry cloth used for rolling dough and from disposable baking paper.

Category: bakeware. Aliases: none. Source: [Ateco catalogue: pastry wheels and dough docker, pages 73–76](https://www.atecousa.com/assets/ateco_catalog.pdf).

### pastry-cloth (equipment)

A fabric work surface for rolling pastry or dough. A matching rolling-pin cover is a separate piece; the cloth is not an oven liner.

Category: preparation-tools. Aliases: none. Subtype of cloth. Source: [Ateco catalogue: pastry wheels and dough docker, pages 73–76](https://www.atecousa.com/assets/ateco_catalog.pdf).

### cannoli-form (equipment)

A cylindrical form supporting a cannoli shell during shaping and cooking. The removable form establishes the hollow centre; it is not part of the finished food.

Category: preparation-tools. Aliases: none. Source: [Ateco catalogue: pastry wheels and dough docker, pages 73–76](https://www.atecousa.com/assets/ateco_catalog.pdf).

### fraisage (process)

Smear portions of pastry dough against the work surface with the heel of the hand to combine its ingredients, then gather them together. This short blending operation differs from prolonged bread kneading aimed at developing elasticity.

Category: baking-and-pastry. Aliases: none. Source: [Fraiser](https://chefsimon.com/articles/lexique-fraiser).

### make-roux (process)

Cook flour with fat to prepare a base for thickening a sauce or soup. The chosen colour affects flavour and thickening strength. This is different from adding a raw flour slurry or finishing a sauce by emulsifying butter into it.

Category: general-cooking. Aliases: none. Source: [Professional Cooking, ninth edition: roux, page 178](https://resources.escoffier.edu/textbooks/gisslen/professional_cooking_09.pdf).

### mount-with-butter (process)

Incorporate pieces of butter into a sauce to form a smooth emulsion as a finishing step. It differs from cooking flour in fat for a roux or simply melting butter on its own; excessive heat can separate the finished emulsion.

Category: mixing-and-emulsifying. Aliases: monter au beurre. Source: [Monter au Beurre, Glorious French Food](https://app.ckbk.com/reference/glor42769c00s001e028/monter-au-beurre).

### devein-prawns (process)

Remove the intestinal tract from a prawn along its back. This preparation is distinct from removing its shell or butterflying the flesh, even when those operations occur in the same sequence.

Category: preparation-and-cutting. Aliases: none. Source: [How to devein a prawn](https://www.greatbritishchefs.com/how-to-cook/how-to-devein-a-prawn).

### shuck-oysters (process)

Open an oyster shell and release the flesh from its attachment using an oyster knife. This is a preparation operation, not cooking or a guarantee that an oyster is safe to eat raw. The scoped name avoids conflating it with husking corn.

Category: preparation-and-cutting. Aliases: none. Source: [How to open an oyster](https://www.greatbritishchefs.com/how-to-cook/how-to-open-an-oyster).

### make-tangzhong (process)

Cook a portion of a bread recipe’s flour and liquid together into a paste before incorporating it into the dough. This pre-gelatinises starch; it differs from making yudane by pouring boiling water over flour. Neither method is a fermented starter.

Category: baking-and-pastry. Aliases: none. Source: [A closer look at tangzhong](https://www.kingarthurbaking.com/blog/2021/02/05/tangzhong-method-soft-pillowy-cinnamon-rolls).

### make-yudane (process)

Scald a portion of flour with boiling water to prepare an addition to bread dough. Unlike tangzhong, this method uses the poured hot water rather than cooking a flour-liquid mixture together in a pan. Recipe proportions remain important; the two pastes are not automatic one-for-one substitutes.

Category: baking-and-pastry. Aliases: none. Source: [A closer look at tangzhong](https://www.kingarthurbaking.com/blog/2021/02/05/tangzhong-method-soft-pillowy-cinnamon-rolls).

### beat-to-ribbon (process)

Beat an egg mixture, commonly eggs and sugar, until it becomes pale and voluminous and falls from the whisk in trails that briefly remain visible. This observable endpoint differs from stiff peaks in egg whites; elapsed beating time alone does not establish it.

Category: mixing-and-emulsifying. Aliases: none. Source: [What does ribbon stage mean?](https://www.kingarthurbaking.com/blog/2020/09/16/what-does-ribbon-stage-mean).

## Existing drafts improved

- **equipment/piping-bag:** The bag holds the mixture; a fitted tip shapes its exit. Changing the tip changes the pattern without changing the bag. Source: [Ateco catalogue: pastry wheels and dough docker, pages 73–76](https://www.atecousa.com/assets/ateco_catalog.pdf).
- **equipment/baking-paper:** When blind-baking, a paper liner separates pastry from loose weights and helps lift the weights out. The liner itself supplies little support; the weight and its distribution perform that job. Source: [Baking trials: prepping a pie crust for prebaking](https://www.kingarthurbaking.com/blog/2025/10/08/prebake-pie-weights).
- **equipment/pie-dish:** A tart ring supplies side support without a base. A pie dish supports both base and sides, so replacing it with a ring also requires a suitable surface beneath the pastry. Source: [Matfer Bourgeat catalogue: frames and rings, page 49](https://matferbourgeatusa.com/catalog-2019/Matfer_Bourgeat_Inc_2019_Catalog_LR.pdf).
- **equipment/vegetable-peeler:** A julienne blade divides the removed layer into narrow strips. A plain peeling blade removes a broader ribbon; the same hand motion does not make the resulting cuts equivalent. Source: [Julienne Peeler](https://www.oxo.com/shop/kitchenware/utensils/julienne-peeler.html).
- **equipment/tongs:** Fish-bone tongs use gripping edges to hold individual bones. Serving tongs are designed around holding larger pieces of food, so a generic tongs reference does not establish the precision needed for bone removal. Source: [Triangle Flat Edge Fish Bone Tongs](https://matferbourgeatusa.com/product/triangle-flat-edge-fish-bone-tongs/).
- **equipment/knife:** An oyster knife opens a shell joint under leverage. A thin slicing blade is a different tool; the shared label knife should not be read as approval to use any knife for shucking. Source: [How to open an oyster](https://www.greatbritishchefs.com/how-to-cook/how-to-open-an-oyster).
- **equipment/egg-separator:** Separating raw white from yolk and slicing a cooked egg are different operations. An egg slicer portions the whole cooked egg; it does not replace a separator in preparing a raw egg mixture. Source: [Egg Slicer](https://www.oxo.com/egg-slicer.html).
- **equipment/ladle:** Ladling fat from the surface and dispensing liquid from beneath a settled fat layer approach separation from opposite sides. A fat separator is designed for the latter; an ordinary ladle does not provide its lower outlet. Source: [Good Gravy Fat Separator](https://www.oxo.com/good-gravy-fat-separator-4-cup.html).
- **equipment/whisk:** The ribbon test observes mixture falling from a lifted whisk and briefly marking the surface. It describes the mixture’s condition, rather than a particular whisk design or a fixed number of strokes. Source: [What does ribbon stage mean?](https://www.kingarthurbaking.com/blog/2020/09/16/what-does-ribbon-stage-mean).
- **equipment/hand-mixer:** An electric mixer can reach ribbon stage faster than hand whisking, but the endpoint remains visual. A speed setting or a timer alone does not confirm that the egg mixture has enough volume and body. Source: [What does ribbon stage mean?](https://www.kingarthurbaking.com/blog/2020/09/16/what-does-ribbon-stage-mean).
- **process/knead:** Fraisage briefly smears pastry to bring its ingredients together. It should not be treated as a request for the sustained kneading used to develop a bread dough’s elasticity. Source: [Fraiser](https://chefsimon.com/articles/lexique-fraiser).
- **process/emulsify:** Mounting a sauce with butter is one finishing application of emulsification. It incorporates butter into the liquid rather than using flour to bind it, and the resulting sauce can separate if its emulsion is disrupted. Source: [Monter au Beurre, Glorious French Food](https://app.ckbk.com/reference/glor42769c00s001e028/monter-au-beurre).
- **process/reduce:** A roux thickens through cooked flour, whereas reduction concentrates liquid by evaporation. Choosing one does not silently authorise the other: reducing a sauce also changes its concentration. Source: [Professional Cooking, ninth edition: roux, page 178](https://resources.escoffier.edu/textbooks/gisslen/professional_cooking_09.pdf).
- **process/melt:** Melting butter changes its physical state; mounting a sauce with butter also disperses it into another liquid. A pool of melted butter is therefore not proof that the finishing emulsion has formed. Source: [Monter au Beurre, Glorious French Food](https://app.ckbk.com/reference/glor42769c00s001e028/monter-au-beurre).
- **process/butterfly:** Removing a prawn’s intestinal tract does not by itself butterfly the flesh. Treat deveining as a separate preparation decision rather than silently inferring a wider opening cut. Source: [How to devein a prawn](https://www.greatbritishchefs.com/how-to-cook/how-to-devein-a-prawn).
- **process/peel:** For prawns, removing the shell and removing the intestinal tract address different structures. A peeled prawn is not necessarily already deveined. Source: [How to devein a prawn](https://www.greatbritishchefs.com/how-to-cook/how-to-devein-a-prawn).
- **process/blind-bake:** Weights need to support the pastry sides as well as restrain the base. A small pile in the middle can leave the walls free to slump; docking and weighting perform different jobs. Source: [Baking trials: prepping a pie crust for prebaking](https://www.kingarthurbaking.com/blog/2025/10/08/prebake-pie-weights).
- **process/whip:** Ribbon stage describes an egg mixture falling in trails that linger briefly on its surface. It is not the same visual test as peaks formed by whipped whites or cream. Source: [What does ribbon stage mean?](https://www.kingarthurbaking.com/blog/2020/09/16/what-does-ribbon-stage-mean).
- **process/autolyse:** A tangzhong or yudane paste is prepared with heat before entering the dough. This is distinct from an autolyse rest; resting flour and water alone does not reproduce the cooked paste. Source: [A closer look at tangzhong](https://www.kingarthurbaking.com/blog/2021/02/05/tangzhong-method-soft-pillowy-cinnamon-rolls).
- **process/lard:** A larding needle carries strips of fat into the meat. This is an insertion tool, not a thread-carrying trussing needle; using a pointed utensil does not make the two preparations equivalent. Source: [Larder](https://chefsimon.com/articles/lexique-larder).

## Relationship decisions

- larding-needle: used-for → process/lard. Context only, not identity equivalence or substitution permission.
- fish-bone-tongs: used-for → process/pin-bone. Context only, not identity equivalence or substitution permission.
- oyster-knife: used-for → process/shuck-oysters. Context only, not identity equivalence or substitution permission.
- egg-slicer: contrast-with → equipment/egg-separator. Context only, not identity equivalence or substitution permission.
- julienne-peeler: used-for → process/julienne. Context only, not identity equivalence or substitution permission.
- piping-tip: commonly-used-with → equipment/piping-bag. Context only, not identity equivalence or substitution permission.
- tart-ring: contrast-with → equipment/pie-dish. Context only, not identity equivalence or substitution permission.
- pie-weights: used-for → process/blind-bake. Context only, not identity equivalence or substitution permission.
- fraisage: contrast-with → process/knead. Context only, not identity equivalence or substitution permission.
- make-roux: contrast-with → process/mount-with-butter. Context only, not identity equivalence or substitution permission.
- make-tangzhong: contrast-with → process/make-yudane. Context only, not identity equivalence or substitution permission.
- beat-to-ribbon: commonly-used-with → equipment/whisk. Context only, not identity equivalence or substitution permission.

## Deferred and bounded decisions

- **tamis / drum sieve:** Keep the previously identified broad French versus narrower English boundary unresolved; no generic tamis alias.
- **fish-bone tweezers:** This pass establishes fish-bone tongs from a manufacturer source; no blanket equivalence between all tweezer and tong constructions or unqualified tweezers alias.
- **shuck / devein:** Unqualified verbs have wider uses. Add scoped oyster and prawn operations only.
- **water roux / tangzhong / yudane:** Do not use water roux as an alias or merge the two preparation methods. Do not add the paste nouns as process aliases.
- **baster / injector:** Add the bulb transfer tool only; do not infer equivalence with an injection syringe or brush.
- **electric beaters / china cap / regional tandoor names / cold-smoke:** Previously deferred identity and safety questions remain deferred; this pass provides no new evidence resolving them.

Source records describe text research, not video viewing or image rights. Existing exact-URL resources are reused; 16 new resources were registered. Manufacturer examples establish tool identity, not universal material, size, operating limit or interchangeability. Ateco catalogue evidence is on printed pages 7, 16–17, 35 and 45–46; the Matfer catalogue ring evidence is on printed page 49. Definitions and distinctions are original concise editorial summaries. No preservation schedule, raw-shellfish safety assurance, universal bread formula or guaranteed shelf life is supplied.

## Validation

- Core: type checking, build and all 692 tests passed, including 25 focused Batch 5 tests. Documentation checks passed; the 14-sample quality audit had zero parser errors.
- Corpus: all 395 tests passed; all 490 active recipes parsed successfully.
- Site: type checking, all 128 tests, full site build and complete link validation passed. Ordinary local site-preview.ts HTTP checks passed for all 1,621 pages and 16 compatibility routes. Visual browser validation was not run.
- Strict public-source audit passed against the staged tracked-source export: 1,164 files, 923 vocabulary entries, 14 samples, exclusions and notices passed. User-owned untracked files and the ignored ZIP were absent from the export; the ZIP was not opened or changed.
- Preservation checks passed for 1,090 unaffected Core files, 2,210 Corpus files and 74 Site files, including the seven known Core user files. All 456 previous enrichment objects retained their existing content. Recipe sources, ingredients and parser/renderer code are unchanged.
- Git whitespace checks passed in all three repositories. The initial Core depth-fixture assertion and Site testing-page counts were adjusted to reflect the added context/counts; all reruns passed without loosening behaviour assertions.
- Work remains on codex/processes-equipment-batch-5 with local commits only. No main merge, push, publication or deployment.

## Next work

Prioritise human review of the sauce and dough preparation boundaries and specialist tool naming. Drum sieves and broader shellfish-tool naming still need focused evidence. Continue improving concise existing drafts without creating pages for generic verbs solely to increase counts.

The [decision ledger](processes-equipment-batch-5-decisions.json) records additions, improvements, sources, relationships and deferred candidates.
