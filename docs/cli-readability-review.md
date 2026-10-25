# Compact readability review: CLI polish

No recipe sources, parser rules or knowledge data change in this milestone.
The shared Compact phrasing layer changes only complete ingredient quantity
operands inside instruction context. It keeps token identity for HTML references.

| Bread example | Result | Cause and decision |
|---|---|---|
| Heat the water 1/4 cup (~110f / 43c) (bath-water heat). | Heat 1/4 cup of water (~110f / 43c) (bath-water heat). | Renderer placed a complete numeric amount after its ingredient. Move supported mass/volume and ambiguous cup amounts before the ingredient, without conversion. |
| Combine water rest of, yeast mixture, sweetener, salt, and flour to make dough. | Unchanged. | Authored `(water) rest of` is free text. The AST preserves it; no remaining-water calculation is justified. Corpus quality follow-up. |
| Combine bowl and greasing fat, then grease the bowl and greasing fat (lightly). | Unchanged. | Authored `(bowl) + (greasing fat) <grease, lightly>` gives a joint subject. Neither parser nor resolver establishes a destination/tool role. Corpus quality follow-up. |
| (~110f / 43c) (bath-water heat) | Both qualifiers retained. | Authored dual-temperature free text and tactile qualifier are not one canonical parameter. Removing either or merging them speculatively would lose information. |

The change is shared by Compact text and Compact HTML, but does not reorder
ingredient declarations or alter default Code/HTML fragments. Free prose,
unknown-unit instructions, alternatives, equipment and timing remain literal.
Recognized quantities retain precision words, units and ingredient qualifiers.
Other sequencing/redundancy remains governed by existing bounded renderer rules;
this review found no basis for a broad culinary prose rewrite.

Bread does not declare `serves:`; CLI serving scaling therefore fails explicitly
for Bread. An author must supply an actual serving basis before it can scale.
Highlighted Code export reuses the existing HTML syntax spans, without TextMate,
a second grammar or new dependencies.
