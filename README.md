Documentation note: The current documentation is provisional and largely placeholder text from the initial development/release process. I plan to rewrite the public-facing docs as the project settles.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/open-sauce-food-wordmark-dark.svg">
  <img src="assets/brand/open-sauce-food-wordmark-light.svg" alt="Open Sauce Food" width="480">
</picture>

**Open Sauce Food is in early development.**

Open Sauce Food is a human-readable recipe language and shared culinary knowledge base, designed for personal recipe collection, versioning, remixing and collaboration.

Recipes are written in **Sauce Code**, using plain-text `.opensauce` files. The idea is that Sauce Code should still look enough like a recipe that you can read and edit it directly, while giving software enough structure to understand ingredients, equipment, actions, results, alternatives and other useful relationships.

A small piece of Sauce Code looks like this:

```opensauce
::recipe
name: Dough preparation

::ingredients
(flour; plain @ Example Mill) 250g
(egg: yolk) 2

::equipment
(mixing bowl)

::instructions
{dough} = (flour) + (egg: yolk)
{dough} <mix, in (mixing bowl)>
    <rest, 20m>
```

Inside parentheses, the base name comes first: `;` adds a type/style, `:` a part, `@` a named product and `,` a qualifier such as preparation or state. Here, plain is the flour type and Example Mill is an illustrative product name. Naming it makes no stronger substitution claim; `@ ~Product` allows a suitable substitute within the declared ingredient/type scope, while `@ !Product` means the exact product is intended.

One of the main reasons for Sauce Code is simple: for some people — sample size currently at least one — it can be faster to read a recipe this way than to parse the same instructions from ordinary prose.

Ingredients, actions, results, alternatives and end states are visually distinct, so the useful structure is there at a glance instead of being hidden inside sentences.

The punctuation is deliberately visual. The browser uses six semantic colours; the coloured squares below mirror them in a way that also survives on GitHub:

| Colour | Sauce Code | Meaning |
|---|---|---|
| 🟩 | `(flour)` | Ingredient |
| 🟦 | `(mixing bowl)` | Equipment |
| 🟨 | `(flour; plain)` / `(egg: yolk)` | Variant or part |
| 🟥 | `<mix>` | Process / action |
| 🟪 | `{dough}` | Something made during the recipe |
| 🟧 | `20m` | Value |
| 🟧 | `?= golden brown` | Cook-judged end state |

For example, `{cake} <bake, 180c> ?= golden brown` records a cook-judged endpoint. One especially useful bit of Sauce Code is `?=`. It means **“judge this action complete when…”**:


The time, temperature or other setting belongs to the action; `?=` records the state a cook is actually looking for. That distinction is useful both to people and to software, and avoids hiding an important endpoint inside free prose like “cook until done”.

The rest of the grammar stays mostly neutral:

| Form | Meaning |
|---|---|
| `+` | Add / combine |
| `=` | Define or assign |
| `-OR-` | Alternative |
| `@ Product` / `@ ~Product` / `@ !Product` | Named / reference with suitable substitution / exact product |
| `/` | Equivalent quantity or setting |
| `!100g` | Measure closely |
| `~100g` | Approximate |
| `~~100g` | Very approximate |
| `[ ... ]` | Grouped instruction block |
| `Meanwhile [ ... ]` | Overlapping work |
| `Optional [ ... ]` | Optional block |
| `Repeat [ ... ]` | Repeated block |
| `# comment` | Maintainer/import/commentary comment |
| `::ingredients`, `::equipment`, `::instructions` | Sections |

Precision belongs to the quantity expression rather than being guessed from prose. The full rules are in the [Draft 8 specification](SPEC.md).


Cocktails use the same recipe model and parser. The demonstration site gives them a separate browse section and uses Spec / Method labels; their ingredient, process and equipment links lead into the shared Knowledge base. Knowledge pages can include sourced explanations and learning resources, with browsing categories separate from culinary identity.

## Code and Compact

Sauce Code is the structured recipe language. Its rendered reading view and Compact can reflect reader settings and serving scaling without editing authored text. Original Source preserves the supplied source rather than reconstructing it. The example above renders as:

> Combine flour and egg yolk to make dough.
> Mix the dough in mixing bowl, then rest for 20 minutes.

## Using the project

Node 24+ and pnpm are required. Run `pnpm install`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm corpus` and `pnpm quality:audit` from this directory. Core validation needs no website, full corpus or sibling checkout. Run `pnpm docs:check` for documentation links and examples. `pnpm source:check` checks a clean source export; it intentionally rejects private work folders and archives rather than filtering them out of a user working copy.

The reusable library lives in [src](src/). Parse a recipe with `parseRecipe`, render Sauce Code with `renderCode`, Compact with `renderCompact`, or semantic HTML with `renderHtml`. The Node-only `loadVocabulary` adapter accepts a knowledge root: `await loadVocabulary('knowledge')`. Parsing does not require a vocabulary. Ordinary recipe text is escaped by the HTML renderer; reference URLs are supplied by the caller.

This is a private development package today. The build emits JavaScript and declarations in dist; the package files allowlist still contains dist only. Knowledge packaging/publication is a later decision, not implied by this restructure.

## Explore and contribute

- [Sauce Code specification](SPEC.md)
- [Knowledge model and contribution fields](docs/knowledge.md)
- [Design principles](docs/design-principles.md)
- [Roadmap](docs/roadmap.md)
- [Prior art and naming](docs/prior-art.md)
- [Contribution guidance](CONTRIBUTING.md)
- [Representative examples](examples/public-domain-recipes/) and [retained source provenance](examples/provenance/)
- [Licensing and attribution](LICENSING.md)

The core contains a pinned representative sample, not the full recipe collection. The local open-sauce-food-corpus project owns the full collection, source and review history. The open-sauce-food-site project owns the Tebla demonstration application and hosting. Those projects consume core; core does not depend on them.

Conversion maturity, authorship and human review are separate. Reworked examples are not automatically human-reviewed recipes. No recipe was rewritten or promoted by this extraction.

Recipe classification metadata is optional: a minimal recipe remains valid without category, dietary, cuisine or region labels. A dietary label is not a guarantee of suitability; check ingredients, substitutions and product labels. No corpus-wide dietary, cuisine or region inference is performed.

Reader display and serving scaling APIs are documented in [Reading and scaling](docs/reading-scaling.md).
