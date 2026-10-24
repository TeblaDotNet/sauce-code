# Processes & Equipment Knowledge Expansion — Batch 6

Research date: 24 October 2026. Generated drafts; human review remains outstanding.

Adds 15 equipment identities and 8 specific culinary processes, and improves 20 existing enrichment drafts. The focus is coffee brewing equipment, specialist cutting tools, bread and pastry tools, chocolate methods and meringue preparation. No recipes, ingredients, language, parser, schema, renderer or editor behaviour changed. Corpus and Site changes update only integration coverage assertions.

## Coverage

| Measure | Before | After |
| --- | ---: | ---: |
| equipment identities | 225 | 240 |
| equipment aliases | 50 | 51 |
| equipment accepted names including IDs | 447 | 478 |
| equipment human-facing spellings | 292 | 308 |
| equipment eligible reference pages | 224 | 239 |
| equipment categorized identities | 225 | 240 |
| process identities | 284 | 292 |
| process aliases | 28 | 28 |
| process accepted names including IDs | 368 | 384 |
| process human-facing spellings | 311 | 319 |
| process eligible reference pages | 229 | 237 |
| process categorized identities | 246 | 254 |
| Enriched pages | 479 | 502 |
| Equipment enrichment | 171 | 186 |
| Process enrichment | 154 | 162 |
| All eligible reference pages | 867 | 890 |
| Site pages | 1621 | 1644 |
| Corpus equipment occurrences resolved | 2668/2865 | 2668/2865 |
| Corpus equipment distinct forms resolved | 178/265 | 178/265 |
| Corpus process occurrences resolved | 4724/4854 | 4724/4854 |
| Corpus process distinct forms resolved | 241/324 | 241/324 |

All 490 active Corpus recipes parse. Ingredient coverage remains unchanged. No same-domain accepted-name collisions were found. This tranche fills broader domain gaps without forcing aliases onto current Corpus wording. There are 1 new equipment alias, no new process aliases, 10 equipment subtype edges and 12 contextual associations. No categories were added. All new canonical entries are generated/unchecked; enrichment review_version remains 0.1.

## New identities

### pour-over-dripper (equipment)

A holder that supports a coffee filter and grounds while poured water drains through them into a vessel below. Its shape and openings influence the flow; the dripper is distinct from the filter it holds.

Category: coffee-and-bar. Aliases: none. Source: [V60 Ceramic Coffee Dripper](https://www.hario-usa.com/products/v60-coffee-dripper-02-ceramic).

### french-press (equipment)

A coffee brewer with a vessel and plunger-mounted filter. Grounds steep in the water before the filter is lowered to retain them for pouring. This immersion arrangement differs from water passing through a separate pour-over dripper.

Category: coffee-and-bar. Aliases: none. Source: [French press coffee maker instructions](https://d9pl0lig74xnv.cloudfront.net/product_manuals/z/p/zp2019-000001_frenchpress_coffeemakers_v1-20190308_pages.pdf).

### coffee-grinder (equipment)

A tool that reduces roasted coffee beans to particles for brewing. Grind adjustment and mechanism vary; a grinder prepares grounds but does not brew the drink. The documented burr grinder is one example, not a definition of every coffee grinder.

Category: coffee-and-bar. Aliases: none. Source: [Encore product specifications, March 2020](https://ep-shopify.s3.amazonaws.com/related-documents/baratza/encore/baratza-encore-specs.pdf).

### espresso-machine (equipment)

A machine that extracts coffee by passing pressurised hot water through prepared grounds. A steam wand, when fitted, performs a separate milk-texturing task. A built-in grinder or automatic milk system is not implied by the name.

Category: coffee-and-bar. Aliases: none. Source: [The Bambino espresso machine](https://www.breville.com/en-us/product/bes450).

### milk-frothing-jug (equipment)

A handled jug used to hold milk during texturing and pour it into a drink. A shaped spout helps control pouring; the jug itself is distinct from the steam wand or powered frother that aerates the milk.

Category: coffee-and-bar. Aliases: none. Subtype of jug. Source: [Temp Control Milk Jug](https://www.breville.com/en-us/product/bes003xl).

### tea-infuser (equipment)

A perforated holder that keeps loose tea together while water circulates through it during steeping. It can be removed with the leaves inside. This differs from catching leaves in a strainer as already brewed tea is poured.

Category: coffee-and-bar. Aliases: none. Source: [Twisting Tea Ball](https://oxoaustralia.com.au/products/twisting-tea-ball).

### bakers-couche (equipment)

A cloth folded into channels to support shaped bread dough during its final rise. The dough is then transferred to a baking surface. Its proofing role differs from a pastry cloth used under a rolling pin.

Category: bakeware. Aliases: none. Subtype of cloth. Source: [Baker’s Couche](https://shop.kingarthurbaking.com/items/bakers-couche).

### baguette-pan (equipment)

A baking pan with long channels supporting baguettes. Perforated examples let moisture escape through the pan; not every pan shares the same material or coating. It is a baking vessel, unlike a cloth used only for proofing.

Category: bakeware. Aliases: none. Subtype of baking-pan. Source: [French Baguette Pan](https://shop.kingarthurbaking.com/items/french-baguette-pan).

### madeleine-pan (equipment)

A baking pan containing shallow shell-shaped cavities for madeleines. The cavities form the characteristic outline and ridges; their count and capacity vary. A muffin tin does not provide the same shape.

Category: bakeware. Aliases: none. Subtype of baking-pan. Source: [Madeleine Pan](https://www.usapan.com/madeleine-pan-1297md).

### boning-knife (equipment)

A narrow-bladed knife for working closely around bones and trimming meat. It separates flesh from bone through controlled cuts; its name does not imply a heavy blade for chopping through bones.

Category: knives-and-cutting. Aliases: none. Subtype of knife. Source: [Knife Finder: boning and fillet knives](https://www.wusthof.com.au/pages/knife-finder).

### fillet-knife (equipment)

A long, narrow-bladed knife suited to following a fish’s backbone and separating or skinning fillets. Flexibility varies with design. It is distinct from gripping tongs used to extract individual pin bones.

Category: knives-and-cutting. Aliases: fish filleting knife. Subtype of knife. Source: [Knife Finder: boning and fillet knives](https://www.wusthof.com.au/pages/knife-finder).

### meat-cleaver (equipment)

A broad, sturdy knife intended for heavy chopping during meat preparation. It differs from a thin slicing knife with a similar rectangular outline. Bone-cutting suitability depends on the particular blade; the unqualified word cleaver is not treated as a universal synonym.

Category: knives-and-cutting. Aliases: none. Subtype of knife. Source: [7-inch Cleaver](https://wusthof.com/products/7-inch-cleaver).

### pizza-wheel (equipment)

A handled circular blade that rolls through pizza crust and toppings. Wheel size and clearance matter for thick toppings. Its rolling action resembles a pastry wheel, but the two tool identities are not automatically interchangeable.

Category: knives-and-cutting. Aliases: none. Subtype of cutter. Source: [4-inch Pizza Wheel](https://www.oxo.com/4-in-pizza-wheel.html).

### ice-cube-tray (equipment)

A tray divided into cavities for freezing water into separate pieces of ice. Cavity shape and size vary; a cover is an optional design feature. The tray shapes ice but does not itself provide refrigeration.

Category: coffee-and-bar. Aliases: none. Subtype of tray. Source: [Ice Cube Tray](https://www.oxo.com/shop/coffee-beverage/barware/ice-cube-tray.html).

### chocolate-dipping-fork (equipment)

A small supporting fork for lowering a centre into chocolate, lifting it out and releasing it onto a setting surface. It supports the centre while surplus coating drains, rather than piercing it like a serving fork.

Category: preparation-tools. Aliases: none. Subtype of fork. Source: [Hand-dipped chocolates: how to](https://www.callebaut.com/en-GB/hand-dipped-chocolates-how).

### enrobe-chocolate (process)

Cover a prepared centre with a chocolate shell. Hand dipping is one way to apply the coating; the chocolate’s fluidity and removal of excess affect shell thickness. Applying the shell is distinct from tempering the chocolate beforehand.

Category: coating-and-breading. Aliases: none. Source: [Hand-dipped chocolates: how to](https://www.callebaut.com/en-GB/hand-dipped-chocolates-how).

### seed-temper-chocolate (process)

Temper melted chocolate by stirring in previously tempered chocolate that supplies suitable cocoa-butter crystals. The seed’s condition matters; this is not simply adding any cold chocolate. Check the resulting temper rather than relying only on temperature.

Category: baking-and-pastry. Aliases: none. Source: [Tempering: seeding method](https://guittard.com/chocolate-studio/fundamentals/tempering).

### table-temper-chocolate (process)

Move part of the melted chocolate over a cool worktop until it begins to crystallise, then combine it with the remaining chocolate. Time, temperature and movement work together; spreading chocolate out to cool is not by itself proof of successful tempering.

Category: baking-and-pastry. Aliases: none. Source: [Tempering: tabling chocolate](https://www.callebaut.com/en-RU/chocolate-video/technique/tempering/table).

### make-beurre-manie (process)

Work softened butter and flour together without first cooking them into a roux. The resulting paste can be incorporated into a sauce for thickening. Preparing this paste and cooking out the flour in the sauce are separate stages.

Category: general-cooking. Aliases: none. Source: [Beurre manie](https://chefsimon.com/articles/lexique-beurre-manie).

### cook-choux-panade (process)

Cook flour into the hot liquid-and-fat mixture that forms the first stage of choux pastry, stirring until the paste comes together and loses moisture. Eggs are incorporated later; this operation is not the final bake of the shaped pastry.

Category: baking-and-pastry. Aliases: none. Source: [Baking and Pastry Arts 2024: Pate a Choux](https://www.skillsusa.org/wp-content/uploads/2024/02/2024_3-Pate-a-Choux.pdf).

### make-french-meringue (process)

Whip egg whites with sugar without a preliminary heating stage. The foam is then baked or used as directed in the recipe. This method differs from heating whites with sugar or adding hot syrup during whipping.

Category: mixing-and-emulsifying. Aliases: none. Source: [Different Types of Meringue](https://www.chsugar.com/baking-tips-how-tos/different-types-meringue).

### make-swiss-meringue (process)

Warm egg whites and sugar together over hot water to dissolve the sugar, then whip the mixture. The heating sequence distinguishes this preparation from French and Italian meringue; the method name alone does not certify pasteurisation.

Category: mixing-and-emulsifying. Aliases: none. Source: [Different Types of Meringue](https://www.chsugar.com/baking-tips-how-tos/different-types-meringue).

### make-italian-meringue (process)

Whip hot sugar syrup into beaten egg whites to form a meringue. The syrup is prepared separately, unlike Swiss meringue’s combined heating step. Syrup temperature alone does not establish the final egg mixture’s safety.

Category: mixing-and-emulsifying. Aliases: none. Source: [Different Types of Meringue](https://www.chsugar.com/baking-tips-how-tos/different-types-meringue).

## Existing drafts improved

- **equipment/coffee-filter:** A dripper supports the filter and the bed of grounds. The filter retains particles, while the supporting dripper supplies the shape and drainage opening; naming one does not necessarily identify the other. Source: [V60 Ceramic Coffee Dripper](https://www.hario-usa.com/products/v60-coffee-dripper-02-ceramic).
- **equipment/tea-strainer:** An infuser holds leaves during their contact with water. A strainer can instead catch leaves when the brewed tea is poured; these are different positions in the brewing sequence. Source: [Twisting Tea Ball](https://oxoaustralia.com.au/products/twisting-tea-ball).
- **equipment/moka-pot:** An espresso machine supplies controlled pressurised extraction and may provide a separate steam wand. Do not infer those capabilities merely because a stovetop coffee pot produces a concentrated drink. Source: [The Bambino espresso machine](https://www.breville.com/en-us/product/bes450).
- **equipment/spice-grinder:** Coffee grinders may provide adjustments intended for particular brewing methods. A shared grinding action does not establish that a spice grinder offers the same particle-size control or is an equivalent coffee-brewing accessory. Source: [Encore product specifications, March 2020](https://ep-shopify.s3.amazonaws.com/related-documents/baratza/encore/baratza-encore-specs.pdf).
- **equipment/jug:** A milk-frothing jug is a specialised holding and pouring vessel with a spout suited to controlled pouring. The vessel is separate from the device supplying steam or agitation; a jug alone is not a powered frother. Source: [Temp Control Milk Jug](https://www.breville.com/en-us/product/bes003xl).
- **equipment/proving-basket:** A folded couche can support several elongated dough pieces in adjacent channels before transfer to a baking surface. That arrangement differs from the shaped enclosure of a proving basket. Source: [Baker’s Couche](https://shop.kingarthurbaking.com/items/bakers-couche).
- **equipment/pastry-cloth:** A couche supports already shaped dough during proofing, whereas a pastry cloth provides a surface for rolling. Shared fabric construction does not make their preparation roles identical. Source: [Baker’s Couche](https://shop.kingarthurbaking.com/items/bakers-couche).
- **equipment/loaf-tin:** A baguette pan provides long channels for narrow loaves, often with a perforated surface. Pan geometry affects the supported shape; a loaf tin and a baguette pan are not equivalent merely because both hold bread dough. Source: [French Baguette Pan](https://shop.kingarthurbaking.com/items/french-baguette-pan).
- **equipment/chef-knife:** Boning and filleting knives use narrower blades to follow bones closely. A general chef’s knife may perform many preparation tasks, but its broad profile does not duplicate those specialist blade shapes. Source: [Knife Finder: boning and fillet knives](https://www.wusthof.com.au/pages/knife-finder).
- **equipment/fork:** A chocolate dipping fork supports a centre from below so excess coating can leave it before placement. This differs from using table-fork tines to pierce food; support and release are the important operations. Source: [Hand-dipped chocolates: how to](https://www.callebaut.com/en-GB/hand-dipped-chocolates-how).
- **process/temper-chocolate:** Tabling cools and moves part of the chocolate on a worktop before recombining it. Seeding instead introduces already crystallised chocolate. These are method choices within tempering, not aliases for simply melting chocolate. Source: [Tempering: tabling chocolate](https://www.callebaut.com/en-RU/chocolate-video/technique/tempering/table).
- **process/melt:** Melting chocolate can remove the crystal structure needed for a well-set coating. Seeding deliberately introduces suitable crystals afterwards, so fluid melted chocolate is not necessarily ready for moulding or coating. Source: [Tempering: seeding method](https://guittard.com/chocolate-studio/fundamentals/tempering).
- **process/coat:** Chocolate enrobing is a specific coating task in which the excess is controlled before the shell sets. Covering a food with chocolate and preparing that chocolate’s temper remain separate operations. Source: [Hand-dipped chocolates: how to](https://www.callebaut.com/en-GB/hand-dipped-chocolates-how).
- **process/dip:** Hand dipping a chocolate centre includes lifting it out and shedding excess coating before placement. The amount left on the centre depends on handling and chocolate fluidity, not just whether it was submerged. Source: [Hand-dipped chocolates: how to](https://www.callebaut.com/en-GB/hand-dipped-chocolates-how).
- **process/whip:** French, Swiss and Italian meringues all use whipping, but place sugar and heat into the sequence differently. Whipping alone does not specify which meringue method is intended. Source: [Different Types of Meringue](https://www.chsugar.com/baking-tips-how-tos/different-types-meringue).
- **process/beat:** In Italian meringue, beaten whites receive separately prepared hot syrup. This differs from the combined warming of whites and sugar used for Swiss meringue. Source: [Different Types of Meringue](https://www.chsugar.com/baking-tips-how-tos/different-types-meringue).
- **process/make-roux:** Beurre manie combines flour and softened butter without preliminary cooking. Roux cooks the flour-fat mixture before it is used; similar ingredients do not make these preparations the same stage or technique. Source: [Beurre manie](https://chefsimon.com/articles/lexique-beurre-manie).
- **process/pipe:** Choux is cooked first as a panade, then eggs are incorporated before the finished paste is shaped. Piping controls the shape of that prepared paste; it does not replace the earlier pan-cooking step. Source: [Baking and Pastry Arts 2024: Pate a Choux](https://www.skillsusa.org/wp-content/uploads/2024/02/2024_3-Pate-a-Choux.pdf).
- **process/prove:** A couche supports shaped baguettes during the final rise and is followed by transfer to a baking surface. Supporting the dough during proofing is a separate function from containing it during baking. Source: [Baker’s Couche](https://shop.kingarthurbaking.com/items/bakers-couche).
- **process/fillet:** A narrow fillet knife can follow the backbone and separate a fish fillet. Removing small retained bones afterwards is another task; the blade operation does not guarantee that every pin bone has been extracted. Source: [Knife Finder: boning and fillet knives](https://www.wusthof.com.au/pages/knife-finder).

## Relationship decisions

- pour-over-dripper: commonly-used-with → equipment/coffee-filter. Context only, not identity equivalence or substitution permission.
- french-press: contrast-with → equipment/pour-over-dripper. Context only, not identity equivalence or substitution permission.
- milk-frothing-jug: commonly-used-with → equipment/espresso-machine. Context only, not identity equivalence or substitution permission.
- tea-infuser: contrast-with → equipment/tea-strainer. Context only, not identity equivalence or substitution permission.
- bakers-couche: contrast-with → equipment/baguette-pan. Context only, not identity equivalence or substitution permission.
- boning-knife: used-for → process/debone. Context only, not identity equivalence or substitution permission.
- fillet-knife: used-for → process/fillet. Context only, not identity equivalence or substitution permission.
- chocolate-dipping-fork: used-for → process/enrobe-chocolate. Context only, not identity equivalence or substitution permission.
- seed-temper-chocolate: contrast-with → process/table-temper-chocolate. Context only, not identity equivalence or substitution permission.
- make-beurre-manie: contrast-with → process/make-roux. Context only, not identity equivalence or substitution permission.
- make-french-meringue: contrast-with → process/make-swiss-meringue. Context only, not identity equivalence or substitution permission.
- make-italian-meringue: contrast-with → process/make-swiss-meringue. Context only, not identity equivalence or substitution permission.

## Deferred and bounded decisions

- **cleaver / Chinese cleaver:** Add the scoped heavy meat-cleaver identity only. Rectangular slicing and chopping knives must not be merged by silhouette; no blanket bone-cutting claim.
- **fish knife:** Can denote a table utensil or preparation blade. Only fish filleting knife is admitted as an alias.
- **coffee maker / press / dripper:** Broad names do not establish espresso, immersion or pour-over identity. Do not register unqualified aliases.
- **meringue / panade / beurre manie:** Food and mixture nouns remain distinct from scoped preparation verbs. No noun-only process aliases or universal safety schedules.
- **tamis / cold-smoke / electric beaters / china cap:** Previously deferred scope, safety and equivalence questions remain unresolved.

Source records describe text research, not video viewing or image rights. Existing exact-URL resources are reused; 19 new resources were registered. Manufacturer examples establish tool identity, not universal material, size, operating limit or interchangeability. Manufacturer documentation supports the equipment distinctions. The Callebaut page supplies written tabling instructions; its embedded video was not reviewed. The Baratza sheet is a dated example of a burr grinder, not a claim about every current grinder. Definitions and distinctions are original concise editorial summaries. No universal tempering temperature, meringue pasteurisation guarantee, storage schedule or interchangeable blade-use claim is supplied.

## Validation

- Core: type checking, build and all 717 tests passed, including 25 focused Batch 6 tests. Documentation checks passed for 16 documents; the 14-sample quality audit had zero parser errors.
- Corpus: all 395 tests passed; all 490 active recipes parsed successfully.
- Site: type checking, all 128 tests, full site build and complete link validation passed. Ordinary local site-preview.ts HTTP checks passed for all 1,644 pages and 16 compatibility routes. Visual browser validation was not run.
- Strict public-source audit passed against the staged tracked-source export: 1,190 files, 946 vocabulary entries, 14 samples, exclusions and notices passed. User-owned untracked files and the ignored ZIP were absent from the export; the ZIP was not opened or changed.
- Preservation checks passed for 1,115 unaffected Core files, 2,210 Corpus files and 74 Site files, including the seven known Core user files. All 479 previous enrichment objects retained their existing content. Recipes, ingredient data and parser/renderer code are unchanged.
- Git whitespace checks passed in all three repositories. Corpus and Site changes are coverage assertions only; no runtime behaviour changed.
- Work remains on codex/processes-equipment-batch-6 with local commits only. No main merge, push, publication or deployment.

## Next work

Prioritise human review of the chocolate and meringue method boundaries, coffee equipment names and specialist blade distinctions. Drum sieves and broader regional tool names still need focused evidence. Continue improving concise existing drafts without creating pages for generic verbs solely to increase counts.

The [decision ledger](processes-equipment-batch-6-decisions.json) records additions, improvements, sources, relationships and deferred candidates.
