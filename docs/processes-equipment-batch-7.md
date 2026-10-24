# Processes & Equipment Knowledge Expansion — Batch 7

Research date: 24 October 2026. Generated drafts; human review remains outstanding.

Adds 15 equipment identities and 8 specific culinary processes, and improves 20 existing enrichment drafts. The focus is opening and preparation tools, wok utensils, pasta and sausage forming, vegetable treatment and sauce thickening. No recipes, ingredients, language, parser, schema, renderer or editor behaviour changed. Corpus and Site changes update only integration coverage assertions.

## Coverage

| Measure | Before | After |
| --- | ---: | ---: |
| equipment identities | 240 | 255 |
| equipment aliases | 51 | 51 |
| equipment accepted names including IDs | 478 | 507 |
| equipment human-facing spellings | 308 | 323 |
| equipment eligible reference pages | 239 | 254 |
| equipment categorized identities | 240 | 255 |
| process identities | 292 | 300 |
| process aliases | 28 | 28 |
| process accepted names including IDs | 384 | 399 |
| process human-facing spellings | 319 | 327 |
| process eligible reference pages | 237 | 245 |
| process categorized identities | 254 | 262 |
| Enriched pages | 502 | 525 |
| Equipment enrichment | 186 | 201 |
| Process enrichment | 162 | 170 |
| All eligible reference pages | 890 | 913 |
| Site pages | 1644 | 1667 |
| Corpus equipment occurrences resolved | 2668/2865 | 2668/2865 |
| Corpus equipment distinct forms resolved | 178/265 | 178/265 |
| Corpus process occurrences resolved | 4724/4854 | 4724/4854 |
| Corpus process distinct forms resolved | 241/324 | 241/324 |

All 490 active Corpus recipes parse. Ingredient coverage remains unchanged. No same-domain accepted-name collisions were found. This tranche fills broader domain gaps without forcing aliases onto current Corpus wording. There are no new aliases, 4 equipment subtype edges and 12 contextual associations. No categories were added. All new canonical entries are generated/unchecked; enrichment review_version remains 0.1.

## New identities

### corkscrew (equipment)

A tool with a spiral worm that engages a cork so it can be withdrawn from a bottle. Lever and winged mechanisms provide different ways to lift it. Removing a cork is distinct from levering off a crown cap.

Category: coffee-and-bar. Aliases: none. Source: [Which Type of Wine Bottle Opener is Right for You?](https://www.oxo.com/blog/coffee-and-beverages/which-wine-opener-is-right-for-you).

### bottle-opener (equipment)

A tool for lifting a crown cap from a bottle. Some designs also carry a can-piercing point; that additional feature does not make every opener a can opener or a corkscrew.

Category: coffee-and-bar. Aliases: none. Source: [Steel Bottle Opener](https://www.oxo.com/oxo-stl-bottle-opener.html).

### apple-corer (equipment)

A tool with a cutting ring that removes the central core of an apple. It leaves the surrounding fruit largely intact; a combined divider that also cuts wedges performs an additional operation.

Category: preparation-tools. Aliases: none. Source: [Kitchen Utensils and Cookware 2023: fish scaler and fruit corer](https://www.roesle.com/media/fe/fe/1f/1673941906/ROESLE_Katalog_Kueche_2023_ENG_ohne_Preise.pdf).

### splatter-screen (equipment)

A perforated cover placed above a pan to intercept cooking splashes. Its openings distinguish it from a solid lid. Fit and handle design vary; it is not a sealed cooking enclosure.

Category: cookware. Aliases: none. Source: [Splatter Screen With Folding Handle](https://www.oxo.com/shop/kitchenware/cooking-baking/cookware/oxo-gg-splatter-screen.html?yoReviewsPage=3).

### sushi-rolling-mat (equipment)

A flexible mat used to support and shape a sushi roll as it is rolled up. Bamboo is a common construction. The mat is a shaping aid rather than a serving placemat or a baking surface.

Category: preparation-tools. Aliases: none. Source: [Bamboo Sushi Mat](https://townfood.com/product/bamboo-sushi-mat-9-1-2x9-1-2/).

### wok-spatula (equipment)

A shovel-shaped cooking utensil used with a wok. Its head moves and lifts food, while a wok ladle has a bowl for holding liquid. Tool size should suit the wok; regional names are not assumed to be universal aliases.

Category: preparation-tools. Aliases: none. Subtype of spatula. Source: [How to accessorize your wok range](https://townfood.com/wok-range/how-to-accessorize-your-wok-range/).

### wok-ladle (equipment)

A long-handled, bowl-headed utensil used in wok cooking. It can carry liquid as well as move ingredients. A wok shovel and a wok ladle are separate tools even when sold as a matched set.

Category: preparation-tools. Aliases: none. Subtype of ladle. Source: [How to accessorize your wok range](https://townfood.com/wok-range/how-to-accessorize-your-wok-range/).

### meat-grinder (equipment)

A device that cuts meat and forces it through a perforated grinding plate. Plate openings influence the resulting texture. It may be a separate machine or an attachment; grinding and filling sausage casings are distinct operations.

Category: appliances. Aliases: none. Source: [Food Grinders](https://www.kitchenaid.co.uk/mixers/food-grinders).

### sausage-stuffer (equipment)

A device that feeds prepared sausage mixture through a tube into a casing. A stuffer may attach to a grinder, but the filling tube performs a different task from the grinding plate. No curing or cooking step is implied.

Category: preparation-tools. Aliases: none. Source: [Using with the Sausage Stuffer Attachment](https://www.kitchenaid.com/content/dam/global/documents/202404/product-guide-w11668759-revA.pdf).

### cheese-plane (equipment)

A handled tool with a slotted cutting blade drawn across cheese to produce thin slices. Suitability depends on the cheese texture and blade. This identity covers the plane form, not every wire or knife sold as a cheese slicer.

Category: knives-and-cutting. Aliases: none. Source: [Cheese Slicer Amigo](https://www.boska.com/en/products/cheese-slicer-amigo).

### fish-scaler (equipment)

A toothed or serrated tool that loosens scales from the outside of a fish. It works on the skin surface, unlike a fillet knife or fish-bone tongs. Removing scales is not the same operation as removing the skin.

Category: preparation-tools. Aliases: none. Source: [Kitchen Utensils and Cookware 2023: fish scaler and fruit corer](https://www.roesle.com/media/fe/fe/1f/1673941906/ROESLE_Katalog_Kueche_2023_ENG_ohne_Preise.pdf).

### carving-knife (equipment)

A long, relatively narrow knife used to cut slices from a roast or other large food. Its shape favours slicing strokes rather than heavy chopping. A carving knife is distinct from a cleaver or a narrow boning knife.

Category: knives-and-cutting. Aliases: none. Subtype of knife. Source: [Classic Ikon 9-inch Carving Knife](https://wusthof.com/products/classic-ikon-9-inch-carving-knife).

### grilling-basket (equipment)

A basket that supports small pieces of food on a grill. Openings admit heat while the sides help contain the pieces. Construction and grill compatibility vary; it does not replace the grill that supplies heat.

Category: cookware. Aliases: none. Source: [Deluxe Grilling Basket](https://www.weber.com/US/en/accessories/grill-tools-and-cookware/deluxe-grilling-basket-6434/6434.html).

### vegetable-spiralizer (equipment)

A cutting device that turns vegetables against blades to form long spirals or ribbons. Blade choice changes the shape. It cuts existing vegetable flesh rather than extruding a mixed pasta dough.

Category: knives-and-cutting. Aliases: none. Source: [Tabletop Spiralizer](https://www.oxo.com/tabletop-spiralizer.html).

### pasta-extruder (equipment)

A device that presses pasta dough through a shaped die. The die forms the cross-section and a cutter controls length. This differs from thinning a sheet between pasta rollers before cutting it.

Category: preparation-tools. Aliases: none. Subtype of pasta-machine. Source: [Gourmet Pasta Press](https://www.kitchenaid.com/countertop-appliances/stand-mixers/attachments/p.gourmet-pasta-press.KSMPEXTA.html).

### glaze-vegetables (process)

Cook vegetables with a small amount of liquid, butter and sugar so the reducing liquid forms a coating. The endpoint may be pale or browned. This scoped method is distinct from icing a cake or brushing a glaze onto cooked meat.

Category: moist-heat-cooking. Aliases: none. Source: [Glacer](https://chefsimon.com/articles/lexique-glacer).

### salt-drain-vegetables (process)

Salt prepared vegetables to draw out some of their water, then drain as the recipe directs. This moisture-removal step differs from simply seasoning the finished dish. Rinsing and final seasoning remain recipe-specific; no preservation guarantee is implied.

Category: preparation-and-cutting. Aliases: none. Source: [Degorger](https://chefsimon.com/articles/lexique-degorger).

### singer (process)

Sprinkle flour over ingredients already cooked in fat, cook the flour briefly, then add liquid to form a thickened sauce. The sequence distinguishes this method from flouring raw food before frying or preparing a separate roux.

Category: general-cooking. Aliases: none. Source: [Singer](https://chefsimon.com/articles/lexique-singer).

### make-starch-slurry (process)

Disperse starch in cold liquid before incorporating it into a hot preparation for thickening. Preparing the dispersion is separate from the later cooking stage. The starch type and recipe determine proportions and treatment.

Category: general-cooking. Aliases: none. Source: [Liaison](https://chefsimon.com/articles/lexique-liaison).

### coil-fold-dough (process)

Use coil folds to build structure in bread dough during bulk fermentation. This gentle folding method is distinct from stretching an edge over the dough or laminating it out broadly. It is a dough-development step, not the final shaping of the loaf.

Category: baking-and-pastry. Aliases: none. Source: [Bulk Fermentation Handling](https://thesourdoughjourney.com/faq-bulk-fermentation-handling/).

### extrude-pasta (process)

Press pasta dough through a shaped die and cut the emerging pasta to length. The die determines the profile. Rolling a sheet and cutting strips can produce pasta too, but uses a different forming method.

Category: preparation-and-cutting. Aliases: none. Source: [Gourmet Pasta Press](https://www.kitchenaid.com/countertop-appliances/stand-mixers/attachments/p.gourmet-pasta-press.KSMPEXTA.html).

### spiralize-vegetables (process)

Cut vegetables into long spiral strands or ribbons by turning them against a suitable blade. The vegetable itself supplies the strand; this is not extrusion of flour-based dough, even when the result is served like noodles.

Category: preparation-and-cutting. Aliases: none. Source: [Tabletop Spiralizer](https://www.oxo.com/tabletop-spiralizer.html).

### stuff-sausage-casings (process)

Feed prepared sausage mixture through a filling tube into a casing while guiding the casing as it fills. Grinding the ingredients precedes this forming step where needed. Stuffing alone neither cooks nor preserves the sausage.

Category: preparation-and-cutting. Aliases: none. Source: [Using with the Sausage Stuffer Attachment](https://www.kitchenaid.com/content/dam/global/documents/202404/product-guide-w11668759-revA.pdf).

## Existing drafts improved

- **equipment/can-opener:** A bottle opener releases a crown cap; a can-piercing point may be included on the same tool. A combined design does not make those operations equivalent to cutting around a can lid. Source: [Steel Bottle Opener](https://www.oxo.com/oxo-stl-bottle-opener.html).
- **equipment/ladle:** Wok ladles are sized for wok cooking and differ from shovel-headed utensils used alongside them. A shared handle style does not make a ladle bowl and a lifting blade interchangeable. Source: [How to accessorize your wok range](https://townfood.com/wok-range/how-to-accessorize-your-wok-range/).
- **equipment/frying-pan:** A perforated splatter screen intercepts splashes while leaving openings. A solid lid provides a different enclosure; selecting one in place of the other changes how the vessel is covered. Source: [Splatter Screen With Folding Handle](https://www.oxo.com/shop/kitchenware/cooking-baking/cookware/oxo-gg-splatter-screen.html?yoReviewsPage=3).
- **equipment/wok:** Wok shovels and ladles have different head shapes, and manufacturers offer sizes matched to different wok arrangements. The pan name alone does not specify a suitable utensil size. Source: [How to accessorize your wok range](https://townfood.com/wok-range/how-to-accessorize-your-wok-range/).
- **equipment/pasta-roller:** An extruder forms dough through a die; a roller thins dough between rollers. Both prepare pasta, but a die profile and a roller gap control different aspects of its shape. Source: [Gourmet Pasta Press](https://www.kitchenaid.com/countertop-appliances/stand-mixers/attachments/p.gourmet-pasta-press.KSMPEXTA.html).
- **equipment/stand-mixer:** A grinder attachment adds cutting and perforated-plate functions to a mixer. Those functions are not supplied by the ordinary mixing bowl and beater, and attachment compatibility must be checked separately. Source: [Food Grinders](https://www.kitchenaid.co.uk/mixers/food-grinders).
- **equipment/julienne-peeler:** A spiralizer forms continuous spiral strands by rotation. Producing narrow strips with a peeler does not establish the same shape or movement, even when both preparations are described as vegetable noodles. Source: [Tabletop Spiralizer](https://www.oxo.com/tabletop-spiralizer.html).
- **equipment/fillet-knife:** A scaler removes scales from the skin surface. Filleting separates flesh from the skeleton; neither tool name implies that the other preparation has already been completed. Source: [Kitchen Utensils and Cookware 2023: fish scaler and fruit corer](https://www.roesle.com/media/fe/fe/1f/1673941906/ROESLE_Katalog_Kueche_2023_ENG_ohne_Preise.pdf).
- **equipment/grill:** A grilling basket holds smaller pieces on the cooking surface. It is an accessory supported by the grill, not an independent heat source; its dimensions and fit remain separate considerations. Source: [Deluxe Grilling Basket](https://www.weber.com/US/en/accessories/grill-tools-and-cookware/deluxe-grilling-basket-6434/6434.html).
- **equipment/paring-knife:** A dedicated corer removes a central section with a shaped cutting tool. Using a knife to cut around a core is another approach, but does not make the two tools identical. Source: [Corer](https://www.oxo.com/corer-475.html).
- **process/glaze:** Vegetable glazing can reduce its cooking liquid into a coating. Cake icing and brushing a cooked roast with juices are other meanings of glaze; the broad verb does not identify one recipe sequence. Source: [Glacer](https://chefsimon.com/articles/lexique-glacer).
- **process/drain:** Salting vegetables can release liquid before draining. Draining removes that liquid, while the preceding salting step changes how much water is available to remove. Source: [Degorger](https://chefsimon.com/articles/lexique-degorger).
- **process/dry-brine:** Salting vegetables specifically to remove released water has its own preparation goal. Do not treat every salt-and-rest instruction as an interchangeable dry-brining method. Source: [Degorger](https://chefsimon.com/articles/lexique-degorger).
- **process/reduce:** Adding a starch slurry thickens by introducing starch rather than by evaporating more liquid. A recipe may use either or both; a thickened sauce is not evidence that it has been reduced. Source: [Liaison](https://chefsimon.com/articles/lexique-liaison).
- **process/dredge:** Singer adds flour after ingredients have cooked in fat and before liquid is added. Dredging food before frying follows a different sequence; both use flour but are not interchangeable instructions. Source: [Singer](https://chefsimon.com/articles/lexique-singer).
- **process/make-roux:** Singer cooks flour around ingredients already in the pan. A separate roux prepares the flour-fat mixture independently before it is combined with liquid or other ingredients. Source: [Singer](https://chefsimon.com/articles/lexique-singer).
- **process/grind:** In a meat grinder, the cutting mechanism and perforated plate produce the ground texture. Changing the plate differs from passing mixture through a sausage-filling tube, whose purpose is to fill the casing. Source: [Food Grinders](https://www.kitchenaid.co.uk/mixers/food-grinders).
- **process/shape:** Sausage stuffing forms a prepared mixture within a casing using a filling tube. Forming a patty by hand follows another method; a shared mixture does not make their shaping instructions equivalent. Source: [Using with the Sausage Stuffer Attachment](https://www.kitchenaid.com/content/dam/global/documents/202404/product-guide-w11668759-revA.pdf).
- **process/stretch-and-fold:** Coil folding is another dough-handling method used during bulk fermentation. It places more emphasis on gentle folding; a recipe may combine methods rather than treating their names as exact synonyms. Source: [Bulk Fermentation Handling](https://thesourdoughjourney.com/faq-bulk-fermentation-handling/).
- **process/laminate:** Bread-dough lamination can be combined with coil folds during bulk fermentation. A broad stretch and folding the dough in place are different handling stages, even when both contribute to dough structure. Source: [Bulk Fermentation Handling](https://thesourdoughjourney.com/faq-bulk-fermentation-handling/).

## Relationship decisions

- corkscrew: contrast-with → equipment/bottle-opener. Context only, not identity equivalence or substitution permission.
- wok-spatula: contrast-with → equipment/wok-ladle. Context only, not identity equivalence or substitution permission.
- sausage-stuffer: used-for → process/stuff-sausage-casings. Context only, not identity equivalence or substitution permission.
- fish-scaler: used-for → process/descale. Context only, not identity equivalence or substitution permission.
- carving-knife: contrast-with → equipment/boning-knife. Context only, not identity equivalence or substitution permission.
- grilling-basket: commonly-used-with → equipment/grill. Context only, not identity equivalence or substitution permission.
- vegetable-spiralizer: used-for → process/spiralize-vegetables. Context only, not identity equivalence or substitution permission.
- pasta-extruder: used-for → process/extrude-pasta. Context only, not identity equivalence or substitution permission.
- salt-drain-vegetables: commonly-used-with → process/drain. Context only, not identity equivalence or substitution permission.
- singer: contrast-with → process/make-roux. Context only, not identity equivalence or substitution permission.
- make-starch-slurry: contrast-with → process/make-beurre-manie. Context only, not identity equivalence or substitution permission.
- coil-fold-dough: contrast-with → process/stretch-and-fold. Context only, not identity equivalence or substitution permission.

## Deferred and bounded decisions

- **cheese slicer / corer / spiralizer:** Keep scoped identities; broad slicer and corer names cover multiple mechanisms. No blanket aliases.
- **degorger / glacer:** French terms span several preparations. Add scoped vegetable methods without mapping every use of the broader French terms to them.
- **chuan / hoak:** Manufacturer transliterations identify examples, not sufficient evidence for universal regional aliases.
- **tamis / china cap / electric beaters / cold-smoke:** Earlier boundary and safety questions remain deferred; no equivalence or operating schedules invented.

Source records describe text research, not video viewing or image rights. Existing exact-URL resources are reused; 19 new resources were registered. Manufacturer examples establish tool identity, not universal material, size, operating limit or interchangeability. Manufacturer documentation supports the equipment distinctions. The Roesle catalogue is a dated example of scaler and corer construction. The Sourdough Journey source was read as text; its embedded demonstrations were not watched. Definitions and distinctions are original concise editorial summaries. No universal cooking schedule, preservation guarantee, fermentation timing or interchangeable tool-use claim is supplied.

## Validation

- Core: type check, build, 742 tests, documentation check (18 documents), quality audit (14 samples, zero parser errors).
- Corpus: 395 tests; all 490 active recipes/specifications parse.
- Site: type check, 128 tests, full build and link/path validation; ordinary preview HTTP 200/HTML checks for all 1,667 generated pages and 16 compatibility pages. No browser visual validation claimed.
- Strict clean staged-source audit: 1,217 files, 969 canonical entries and 14 curated samples; exclusions and notices pass. The unrelated ignored archive is absent from the export.
- Integrity: hashes match for 1,140 unaffected Core files, 2,210 Corpus files and 74 Site files; all 502 prior enrichment objects retain their content and the seven user-owned untracked files are unchanged.
- Git whitespace checks pass in all three repositories. Local continuation branches only; no main merge, push, publication, deployment or production access.

## Next work

Prioritise human review of scoped vegetable methods, sauce-thickening sequences and pasta-forming distinctions. Drum sieves and broader regional tool names still need focused evidence. Continue improving concise existing drafts without creating pages for generic verbs solely to increase counts.

The [decision ledger](processes-equipment-batch-7-decisions.json) records additions, improvements, sources, relationships and deferred candidates.
