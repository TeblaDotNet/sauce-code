# Reading and serving scaling v1

Reader presentation is separate from authored Sauce Code. Pure APIs in `src/reading.ts` calculate serving factors, parse supported complete quantity slots, convert units, format display amounts, identify awkward discrete counts and derive an anchor factor. They never mutate a Recipe or its source. The Site applies adjustments in Compact; Sauce Code and Original Source remain literal.

Reading preferences are Metric/US customary and °C/°F (default Metric/°C). Site stores these preferences in browser local storage without an account. Servings are local page state, starting from one unambiguous positive numeric `serves` value. Ranges, textual yields and missing serves do not get a serving control.

Only complete single-ingredient declaration amounts are scaled. Supported mass, volume and numeric counts scale proportionally. Alternatives, assignments, ranges, equivalent quantities, packaging-size expressions, process durations, judgements, equipment/capacities, prose and qualitative/tiny measures (handful, dash, drop, barspoon, rinse) stay literal. Unsupported amounts remain unchanged; this is stated beside the control. Temperatures convert independently and never scale with servings. No source semantics or parser grammar changed.

Units use the international avoirdupois ounce (28.349523125 g) and pound (453.59237 g), with US liquid gallon subdivisions: US cup 236.5882365 ml, US fl oz 29.5735295625 ml, tbsp 14.78676478125 ml and tsp 4.92892159375 ml. Metric cup (250 ml) and imperial fl oz (28.4130625 ml) are distinct explicit units. Bare cups/fl oz require authored en-US locale; otherwise they remain unchanged. Cocktail bare oz remains unchanged because the source does not establish mass versus volume. No ingredient-dependent guess is made.

US display uses familiar fractions 1/8, 1/4, 1/3, 1/2, 2/3 and 3/4 with at most 2% relative error. It prefers larger clean units or a cup-plus-tablespoon expression over a longer teaspoon expression. If no acceptable kitchen fraction exists, metric remains visible. No arbitrary denominator is emitted. Approximate numeric display uses at most two significant digits. Other numeric display is capped at four decimals (two for temperature), with separate `rounded-for-display` metadata when that changes the numeric value. The original quantity remains available under Source; scaled amounts also retain the proportional quantity in the original unit, before display conversion. Authored `!`, ordinary, `~` and `~~` are never exchanged or invented to describe display rounding.

Same-dimension conversion never requires ingredient density. `convertReaderDensity` is an explicit opt-in API that delegates to the existing reviewed observation/condition/target/source-volume eligibility rules; the Site does not automatically substitute volume for mass. Brown sugar's unresolved packed-cup observation remains non-executable.

The small discrete pilot is a pure presentation policy: whole canonical egg, lemon and lime counts (not parts), plus explicit tin/can count units. No vocabulary data is edited. Fractional amounts are valid. At authored servings no corrective prompt appears, including authored fractional counts. At a changed scale each fractional pilot amount gets a textual notice and independent action. Choosing one whole-unit anchor recomputes the entire recipe factor and serving count; other awkward ingredients are not optimised.

The method warning is:

> This recipe has been scaled from its original serving size. Ingredient quantities have been adjusted, but larger changes may require changes to cooking method, batch size, equipment capacity or timing.

Not implemented: automatic method scaling or rewriting, an optimiser across several discrete ingredients, nutrition, universal mass-volume conversion, reader-facing ingredient locale selection, or baker's percentages.
