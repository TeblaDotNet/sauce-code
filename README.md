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

For example, `{cake} <bake, 180c> ?= golden brown` records a cook-judged endpoint. One especially useful bit of Sauce Code is `?=`. It means **“judge this action complete when…”**

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

## Writing Sauce Code

You do **not** need any Open Sauce Food software to write Sauce Code.

A `.opensauce` file is just plain text. You can write one in Notepad, VS Code, Vim, another IDE, or any other text editor, save it in a folder and keep your recipe collection that way. The file does not stop being useful if you never run it through a parser or renderer.

That is the simplest level of Open Sauce Food: human-readable recipe files that you own and can organise, copy, version, share or edit with ordinary tools.

### Optional editor support

Editor and IDE integrations can make writing the same plain-text files more convenient without changing the format itself. As those integrations are added, they can provide things such as:

- syntax highlighting;
- diagnostics and useful error messages;
- completion for known ingredients, processes and equipment;
- hover/reference information;
- live preview.

A future VS Code extension is one example of this layer. It should be optional: the underlying file remains ordinary Sauce Code and should still be readable and editable without the extension.

## How the software fits around Sauce Code

The parser, knowledge base and renderer are tools around the language rather than requirements for creating a recipe.

```text
recipe.opensauce
      │
      ▼
   Parser
      │
      ▼
Structured recipe model
      │
      ├──── optional knowledge resolution
      │     ingredients / processes / equipment
      │
      ▼
   Renderer
      │
      ├── Sauce Code reading view
      ├── Compact prose
      └── semantic HTML / application output
```

### Parser

The parser reads Sauce Code and identifies the structure that is already present in the text. It can recognise things such as ingredients, equipment, actions, intermediate results, quantities, alternatives and cook-judged end states, and turns them into a structured recipe model that software can work with.

Parsing does **not** require the shared Knowledge base. A recipe can be valid Sauce Code even if an ingredient or process is not yet known to Open Sauce Food's reference data.

### Knowledge resolution

Knowledge resolution is optional. It can connect things mentioned in a recipe to shared ingredient, process and equipment knowledge: canonical identities, regional names, parts, types, relationships, explanatory pages and other reference information.

The Knowledge base adds context; it is not what makes the recipe itself valid.

### Renderer

The renderer takes the parsed recipe model and turns it into a useful reading or application format.

That can include:

- a **Sauce Code reading view**, keeping the compact notation while allowing reader settings such as serving size, measurement system and temperature display to change without editing the authored recipe;
- **Compact**, generated conventional prose for people who prefer to read the recipe that way;
- **semantic HTML** for websites, editors and other applications.

Authored Sauce Code and rendered Sauce Code are therefore related but not identical concepts. The authored `.opensauce` text is the source. A rendered Sauce Code view is generated from that structured source and can adapt presentation without rewriting it.

## Sauce Code, Compact and Original Source

Sauce Code is the structured recipe language. Compact is a generated prose view of the same parsed recipe. Original Source preserves supplied source material rather than trying to reconstruct it from the parsed recipe.

The example above can render in Compact as:

> Combine flour and egg yolk to make dough.
> Mix the dough in mixing bowl, then rest for 20 minutes.

Reader settings and serving scaling belong to presentation. They can change the rendered Sauce Code and Compact views while leaving the authored recipe text untouched. Reader display and serving scaling APIs are documented in [Reading and scaling](docs/reading-scaling.md).

## Optional Core implementation

The Core repository contains the current parser, renderer, recipe model and shared culinary knowledge used by the Open Sauce Food tooling. You do not need to install Core simply to write or keep `.opensauce` files.

For developers integrating Sauce Code into software, the reusable library lives in [src](src/). Parse a recipe with `parseRecipe`, render Sauce Code with `renderCode`, Compact with `renderCompact`, or semantic HTML with `renderHtml`. The Node-only `loadVocabulary` adapter accepts a knowledge root: `await loadVocabulary('knowledge')`. Parsing does not require a vocabulary. Ordinary recipe text is escaped by the HTML renderer; reference URLs are supplied by the caller.

### Optional CLI

A [standalone executable](docs/standalone-cli.md) is now available as a local development build for Windows x64. It needs no Node.js or Bun installation. The existing Node package below remains supported for developers; other executable targets are compiled but not yet runtime-tested.


The CLI validates and renders ordinary plain-text `.opensauce` files. It is optional; no editor integration is required. Node 24+ and npm are needed to install a prepared archive, but pnpm, TypeScript, a source checkout, Corpus and Site are not.

The package retains the development name `@open-sauce/core` at version `0.1.0`. It has **not been published to npm**; registry/name availability remains a publication follow-up. Given a locally prepared archive:

```sh
npm install -g ./open-sauce-core-0.1.0.tgz
opensauce check dinner.opensauce
opensauce render dinner.opensauce --format compact
opensauce render dinner.opensauce --format code
opensauce render dinner.opensauce --format html --output dinner.html
opensauce --help
opensauce --version
```

`check` requires no knowledge resolution. Rendering uses the bundled canonical vocabulary JSON, resolved from the installed package; `--no-knowledge` disables resolution. Unknown culinary terms do not by themselves make a recipe invalid. Bundled vocabulary does not include encyclopaedia articles, source registries or photographs. Applications can explicitly compose an optional offline provider; see [knowledge providers](docs/knowledge-provider.md).

HTML output is an unstyled semantic **fragment**, using the renderer's Sauce Code view. It is not a complete styled webpage. Compact and Code write plain text. Output goes to stdout unless `--output` is supplied; diagnostics go to stderr. Parse errors stop rendering and return a non-zero status; warnings do not. The CLI refuses to overwrite its input, including file aliases. Other existing output files are replaced.

The library exports `@open-sauce/core` and the Node-only `@open-sauce/core/vocabulary/node` adapter, with built JavaScript and TypeScript declarations. No consumer build step is needed. Library knowledge loading remains explicit through `loadVocabulary(root)`.

## Developing Open Sauce Food Core

The following setup is for people working on the Core implementation itself. It is **not required to write Sauce Code recipes**.

Node 24+ and pnpm are currently required for Core development. Run `pnpm install`, `pnpm check`, `pnpm build`, `pnpm test`, `pnpm corpus` and `pnpm quality:audit` from this directory. Core validation needs no website, full corpus or sibling checkout. Run `pnpm docs:check` for documentation links and examples. `pnpm source:check` checks a clean source export; it intentionally rejects private work folders and archives rather than filtering them out of a user working copy.

To prepare a local archive, run `npm pack` after installing development dependencies; its prepack hook builds Core. Run `pnpm package:smoke` to build, pack, install into a fresh external temporary folder using npm, and exercise the installed CLI and library without pnpm or TypeScript on its runtime path. The test retains the archive and installation for inspection. It normally uses npm from PATH; `OSF_NPM_CLI` can optionally identify an npm CLI JavaScript entry point in managed development environments.

## Explore and contribute

- [Sauce Code specification](SPEC.md)
- [Knowledge model and contribution fields](docs/knowledge.md)
- [Design principles](docs/design-principles.md)
- [Roadmap](docs/roadmap.md)
- [Prior art and naming](docs/prior-art.md)
- [Contribution guidance](CONTRIBUTING.md)
- [Representative examples](examples/public-domain-recipes/) and [retained source provenance](examples/provenance/)
- [Licensing and attribution](LICENSING.md)

The Core repository contains a pinned representative sample, not the full recipe collection. The `open-sauce-food-corpus` project owns the full collection, source and review history. The `open-sauce-food-site` project owns the Tebla demonstration application and hosting. Those projects consume Core; Core does not depend on them.

Conversion maturity, authorship and human review are separate. Reworked examples are not automatically human-reviewed recipes. No recipe was rewritten or promoted by this extraction.

Recipe classification metadata is optional: a minimal recipe remains valid without category, dietary, cuisine or region labels. A dietary label is not a guarantee of suitability; check ingredients, substitutions and product labels. No corpus-wide dietary, cuisine or region inference is performed.
