# Open Sauce Food Recipe Format

## Sauce Code — Draft 8

Open Sauce Food is a human-readable recipe language and shared culinary knowledge base, designed for personal recipe collection, versioning, remixing and collaboration.

Recipe files use the `.opensauce` extension.

The basic idea is simple:

A recipe should still make sense if you open it in a plain text editor, while containing enough structure for software to understand useful things about it.

That means Open Sauce Food sits somewhere between ordinary recipe prose and a programming language.

It is not an attempt to make dinner executable by a robot. Humans are still expected to know roughly what “golden brown” looks like.

## The three recipe views

Open Sauce Food recipes can be shown in three ways:

**Sauce Code**

The actual .opensauce recipe. This is the primary representation and source of truth.

**Compact**

A more conventional recipe view generated from the Sauce Code.

**Original Source**

Where an imported recipe retains its original source text, that can be viewed unchanged alongside the converted recipe.

The Original Source is provenance, not another interpretation of the Sauce Code.

## Core syntax

A small number of visual conventions carry most of the structure:

```text
::section             recipe section

(thing)               ingredient or equipment
{result}              something made during the recipe
<action>              action or cooking process
[ ... ]               grouped instructions

+                     add/combine
=                     define/assign
-OR-                  alternative
?=                    cook-judged completion condition

~                     approximate quantity
~~                    very approximate quantity
!                     measure accurately
/                     equivalent quantity or setting

# comment             maintainer/author comment
```

The aim is that most of these should be understandable before reading a manual.

## Sections

A recipe can contain:

```text
::recipe
::ingredients
::equipment
::instructions
::story
::notes
::source
```

`::ingredients` and `::instructions` contain the main recipe.

`::equipment` lists equipment worth stating explicitly.

`::story` contains history, context or personal narrative.

`::notes` contains practical cook-facing information such as storage, substitutions or serving suggestions.

`::source` can preserve the original imported recipe verbatim.

Comments beginning with # are for authoring, conversion and maintenance information rather than normal published prose.

## Ingredients and equipment

Ingredients and equipment both use parentheses:

```opensauce
::ingredients

(onion) 2
(olive oil) 1tbsp

::equipment

(frying pan)
(chef knife)
```

The section tells Open Sauce Food whether the thing is an ingredient or equipment.

Qualifiers can be added with commas:

```opensauce
::ingredients
(onion, finely chopped)
::equipment
(frying pan, large)
```

Not every obvious tool needs to be declared. A recipe usually does not need to tell you that chopping requires a knife.

Specific or important equipment should be declared when it materially helps someone follow the recipe.

## Types, parts, products and qualifiers

Sauce Code can distinguish between an ingredient itself, a type of it, a part of it, and loose descriptive qualifiers.

The full shape is:

```text
(base [; variant] [: part [: subpart ...]] [@ [~|!] product] [, qualifiers...])
```

For example:

```opensauce ingredients
(flour; plain)
(egg: yolk)
(lemon: juice)
(chicken: thigh: skin)
(chicken; free range: thigh: skin)
```

The punctuation has different meanings:

```text
;    type / variant
:    part or derived culinary product
@    named commercial product / expression
,    loose qualifier, preparation, state, role, size, etc.
```

So these are deliberately different ideas:

```opensauce ingredients
(egg: yolk)
(egg, beaten)
```

One says which part of the egg. The other says something about its current preparation.

The knowledge base can understand these relationships without requiring every combination to become its own separate ingredient.

Qualifiers stay authored text. Explicit recognised preparation states may be annotated by the knowledge base; no implicit state transition is inferred. See [the vocabulary schema](docs/knowledge.md) for the implemented relationship model.

## Commercial product and expression selection

Use `@` to name a commercial product or expression separately from the ingredient type:

```opensauce ingredients
(gin; London dry @ Beefeater)
(gin @ ~Beefeater)
(cocktail bitters @ !Peychaud's)
(whisky @ Lagavulin 16)
(gin @ ~Beefeater) -OR- (gin; London dry)
```

- `;` specifies culinary type/style; it does not name a brand.
- Bare `@ Product` means **specified**: the source names it without making a stronger substitutability claim.
- `@ ~Product` means **approximate product match**: this is the reference product and a close substitute is acceptable, not merely something the author likes.
- `@ !Product` means **exact product intended**: substituting materially changes the intended spec.
- `-OR-` remains an explicit authored alternative. Neither a product name nor its strength creates inferred alternatives.

Product selection follows any type and part path, before comma qualifiers:

```opensauce ingredients
(chocolate; dark @ ~Example Maker 70%, chopped)
(egg: white @ Example Farm, pasteurised)
(hot sauce; sriracha @ Example Brand)
(soy sauce @ !Example Reserve)
(flour; plain @ Example Mill)
```

These illustrative labels need no registry entry. The feature applies to any commercially meaningful ingredient, not just cocktails. `:` continues to identify a part or derived culinary product; `@` selects a commercial one.

One `@` and at most one leading `~` or `!` are allowed in the identity head. The product label must be nonempty. Spaces, apostrophes, periods, hyphens, slashes, colons and semicolons in a product label are retained. Commas still start qualifiers, and parentheses delimit the thing; v1 introduces no quoted-label escape syntax. Put type/part fields before `@`: punctuation after it belongs to the product label. An additional `@` is diagnosed rather than interpreted as another selection. Existing text that used `@` literally in an identity head now opts into this syntax; `@` in a comma qualifier stays literal.

The parser records `product.name` and `product.strength` (`specified`, `approximate`, or `exact`), plus the exact selection `raw` text and source `span`. This is independent of vocabulary resolution. Unknown products remain legal; canonical ingredient resolution uses the base, type and parts only. No brand, type, alias or substitution relationship is created. Explicit product names can distinguish local declarations; a different named product does not silently match one, even when marked approximate. A bare reference remains ambiguous when several product declarations match. No product marker is inherited or invented in the source.

`!100g`, `~100g` and `~~100g` retain their existing quantity-precision meanings. Only the marker immediately following `@` describes product exactness. For example, `(flour @ !Example Mill) ~100g` selects an exact product while keeping the amount approximate.

Sauce Code preserves authored punctuation, marker, label and spacing inside the token. Compact uses an English ingredient label and retains `@`, `~` or `!` visibly (for example, `London dry gin @ Beefeater`). HTML escapes product text and uses the existing specificity colour; any reference link still targets the culinary ingredient, not a resolved product page. Product registries and automatic substitution remain outside v1.

## Results

Curly braces name things created during the recipe:

```opensauce
{sauce}
{dough}
{batter}
{filling}
```

Results can be defined with =:

```opensauce
{dressing} = (olive oil) + (vinegar) + (mustard)
```

and then used later:

```opensauce
{dressing} <mix>
{salad} + {dressing}
```

Sauce Code does not require every obvious physical state change to be formally modelled.

If batter goes into the oven and the next line calls it {cake}, that is fine. People can cope.

## Actions and processes

Actions use angle brackets:

```opensauce
(onion) <chop>
(onion) <fry, medium heat, 5m>
{cake} <bake, 180C, 40m>
```

One important authoring rule is:

One `<...>` token should represent one action head.

So this:

```opensauce
{rice} <cook, 12m>
    <stir, occasionally>
```

is preferred to burying two separate actions inside one process token.

Angle brackets are used for both significant cooking techniques and ordinary verbs.

That does not mean every verb needs its own knowledge page. `<braise>` may deserve one; `<put>` probably does not.

The vocabulary can therefore recognise an action without publishing a separate reference page for it.

## Judgement conditions

Recipes often finish a cooking step using human judgement rather than a stopwatch.

Sauce Code represents that with `?=`:

```opensauce
<roast, 180C, 20m> ?= golden brown
```

or:

```opensauce
{sauce} <simmer, 15m> ?= thick enough to coat a spoon
```

Compact rendering can turn the first example into:

Roast at 180°C for 20 minutes, until golden brown.

The judgement remains human-readable rather than becoming another controlled vocabulary.

This is intentional: cooking contains quite a lot of “you'll know it when you see it.”

## Adding and combining

+ handles straightforward addition or combination:

```opensauce
{dressing} = (oil) + (vinegar) + (mustard)
```

or:

```opensauce
{pot} + (water) + (salt)
```

For simple additions, + is usually clearer than repeatedly writing `<add>`.

## Alternatives

-OR- represents a genuine choice:

```opensauce ingredients
(soured cream)
-OR-
(crème fraîche)
```

Multi-step alternative methods can use blocks:

```opensauce
[
    {dough} <knead, 10m>
    {dough} <prove, 1h>
]
-OR-
[
    {dough} <mix, stand mixer, 6m>
    {dough} <prove, 45m>
]
```

For small local choices, the alternative should stay as local as possible rather than duplicating a whole method unnecessarily.

Intended authoring improvement, not a fully structured alternative in the current implementation:

```text
{ravioli} <cut, between seams, with (pasta cutter) -OR- (knife) -OR- (pizza cutter)>
```

Keeping the choice local is preferable to repeating the entire cutting procedure. Currently only the first tool in this example is recognised as a structured reference; the remaining alternatives are preserved as literal context. Use a named local equipment choice today, or branch-level `-OR-` when the method or sequence genuinely differs.

## Named choices

A local choice can also be given a name:

```opensauce ingredients
(seasoning) =
    (MSG)
    -OR-
    (chicken bouillon)
    -OR-
    (mushroom seasoning)
```

Later:

```opensauce
{sauce} + (seasoning)
```

This is useful when the recipe needs to refer repeatedly to whichever option was selected.

The same idea can be used for equipment.

## Indented continuation

Indentation can avoid repeating the same subject:

```opensauce
(noodles) <cover, boiling water>
    <soak, 5m>
    <drain>
```

The indented actions inherit (noodles).

Result definitions can also establish a continuation subject:

```opensauce
{batter} = (butter) + (sugar)
    <beat> ?= incorporated
    + (egg: yolk)
    <beat>
```

Indentation means continuation of the current subject, not “these things happen simultaneously.”

## Grouped instructions

Square brackets group related instructions:

```text
[
    ...
]
```

The thing outside the block explains why they are grouped.

For example:

```text
Meanwhile [
    ...
]
Repeat [
    ...
]
Optional [
    ...
]
```

or:

```text
[
    method A
]
-OR-
[
    method B
]
```

The brackets themselves deliberately have very little meaning.

## Structured references inside actions

Ingredients and equipment can appear inside action context:

The declarations below supply the local ingredient/equipment roles used by the action references.

```opensauce
::ingredients
(water)
(salt)
(onion)
(olive oil)
::equipment
(plastic wrap)
(frying pan)
::instructions
{dough} <cover, with (plastic wrap)>
{ravioli} <cook, in (water, boiling) + (salt)> ?= they float
(onion) <fry, in (frying pan) + (olive oil)>
```

Those references remain real ingredients/equipment rather than disappearing into an opaque sentence.

This lets the site link them to the shared knowledge base while leaving the surrounding cooking language readable.

## Quantity precision

Recipes often imply different levels of precision.

Sauce Code can make that explicit:

```opensauce ingredients
(flour) !500g
(water) ~325g
(spinach) ~~1 handful
```

Meaning:

```text
!     measure this carefully
~     approximately
~~    very approximately
```

No marker means the recipe has not specified a precision level.

These markers are deliberately descriptive rather than mathematical error bounds.

Nobody needs `~~1 handful` converted into 31.742g.

Precision belongs to the quantity expression, not the ingredient. Unit conversion and serving scaling are not implemented here; a future conversion must preserve the source precision rather than introduce falsely precise decimals.

## Equivalent quantities

/ can give equivalent forms of the same quantity:

```opensauce ingredients
(flour) 2 cups / ~240g
```

or equivalent appliance settings:

```opensauce
(oven) <heat, 200C / 180C fan>
```

It does not mean an ingredient choice. Choices use -OR-.

## Human-readable quantities

Sauce Code does not insist everything become a number:

```opensauce ingredients
(salt) to taste
(oil) as needed
(sesame seeds) extra for serving
```

A recipe language that could not express “salt to taste” would be solving the wrong problem.

## Recipe metadata

`::recipe` contains recipe-level metadata such as:

```opensauce recipe
name: Lentil Soup
serves: 4
category: soup/stew
tags: lentils, warming
dietary: vegetarian
cuisine: italian
region: sicily
```

Current metadata can also preserve:

- source
- source author
- source license
- ingredient locale
- units
- yield
- active time
- total time
- image
- conversion stage
- curation origin
- curation review

Most of this metadata is optional. A minimal recipe remains valid without category, dietary, cuisine or region metadata. No corpus-wide dietary, cuisine or region inference is performed by the parser.

Dietary labels are author-supplied guidance, not a guarantee of suitability. Ingredients and product labels still need checking.

### Optional authoring locale

Within `::recipe`, `locale: en-GB` (or another valid language tag such as en-US) declares the locale used to interpret ingredient names. It is optional and does not change token grammar or authored wording. The model retains it independently of reader presentation preferences. Invalid or duplicate declarations warn and are not applied. See [ingredient naming and identity](docs/knowledge.md#ingredient-naming-authoring-locale-and-identity) for exact-name scoping and compatibility rules.

## Original source preservation

Imported recipes can retain the original source text verbatim:

```opensauce
::source
<<<
Original source recipe here.
Nothing inside this block is interpreted as Sauce Code.
>>>
```

This makes conversion auditable.

The original recipe can remain available next to the structured version instead of being quietly replaced by it.

## Culinary knowledge

Sauce Code is only one part of Open Sauce Food.

Ingredients, equipment and processes can resolve against a shared version-controlled culinary knowledge base.

That knowledge can describe things such as:

- aliases and regional names
- ingredient families
- ingredient parts
- preparation states
- equipment subtypes
- cooking techniques
- links between recipes and the concepts they use

For example:

- self-raising flour  → type of flour
- paring knife        → type of knife
- cast-iron frying pan → type of frying pan

An identity can exist in the knowledge base without needing a public reference page.

Conversely, a useful reference page can exist even before the recipe corpus happens to use the concept much.

Recipe syntax remains legal independently of whether something is already known to the vocabulary.

## Reference pages

Reference pages are intended to become useful culinary resources in their own right.

For processes, a page may be useful because the term has:

- discovery value — finding recipes that use the technique
- explanation value — explaining what the technique means

Equipment also has a third possible reason:

recommendation value — helping people understand useful types or good examples of a tool

Eventually these pages can also link to carefully selected external articles and videos.

The aim is useful curation, not turning every verb and spoon into an encyclopedia entry.

## Publication and conversion status

Imported recipes are not automatically treated as finished recipes merely because the parser accepts them.

Conversion stage is currently one of:

- initial
- reworked
- blocked

reworked recipes are the normal public browsing set.

initial and blocked recipes may remain directly accessible for development/review but are kept out of normal discovery.

This is independent of parser validity and of any automated quality score.

## Git and openness

Open Sauce Food does not invent its own version-control system.

Recipes are plain text, so ordinary Git works rather well.

They can be:

- committed
- diffed
- forked
- reviewed
- remixed
- contributed through pull requests

The same principle applies to the shared culinary vocabularies.

If somebody knows that a tool, ingredient or technique has a different name where they live, that is exactly the sort of useful contribution the project should eventually make easy.

## Design principles

The language is still experimental, but a few principles have become fairly stable:

- Human-readable source comes first.
- Structure should be understandable by inspection where practical.
- Real recipe problems should justify new syntax.
- Natural cooking language is allowed where formalisation adds little.
- Parser legality must not depend on whether the vocabulary already knows a term.
- Ingredients, equipment and processes are shared knowledge, not rigid source-code enums.
- Regional differences should be represented rather than guessed away.
- Git handles versioning; Open Sauce Food does not need to reinvent Git badly.
- Sauce Code should encode useful structure without pretending cooking is a robot program.
- A recipe can still be badly written. The file extension is not magic.

## Status

Draft 8 is implemented and actively being tested against a growing recipe corpus.

The format is deliberately still allowed to change.

New syntax should be driven by real recipes, not by an attempt to predict every culinary edge case in advance.

That has already proved considerably more useful than designing an immaculate language for imaginary soup.
