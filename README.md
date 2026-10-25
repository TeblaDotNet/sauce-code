# Sauce Code

**Sauce Code — an open, structured language for recipes.**

Recipes remain plain-text `.opensauce` files. Explicit ingredients, actions, equipment and results let applications check structure, link shared terms and render different reading views without hiding the author's source. Ordinary prose describes a recipe to a reader; Sauce Code also gives software useful boundaries. It does not infer missing quantities or prove that a recipe is safe or delicious.

## A small recipe

Save this as `dough.opensauce`:

```opensauce
::recipe
name: Dough preparation
serves: 2

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

Compact renders the instructions as:

> Combine flour and egg yolk to make dough.
> Mix the dough in mixing bowl, then rest for 20 minutes.

`(thing)` identifies an ingredient or equipment reference, `<action>` a process, and `{result}` a recipe-local result. `: yolk` selects a part, `; plain` a variant and `@ Example Mill` an authored product label. Neither a brand nor a local recipe role automatically becomes a shared identity. See the authoritative [specification](SPEC.md).

## Use it

The Windows standalone executable needs no Node, Bun, pnpm or sibling repository at runtime. Obtain a maintainer-provided build with its notices; there is no implied public download or npm release.

```powershell
.\opensauce.exe check dough.opensauce
.\opensauce.exe render dough.opensauce --format compact
.\opensauce.exe render dough.opensauce --format html --theme auto --servings 4
.\opensauce.exe render dough.opensauce --format code-html --theme dark
```

Read [installation](docs/installation.md), [standalone distribution](docs/standalone-cli.md) and [HTML/scaling export](docs/cli-export.md). Windows has native execution evidence; Linux/macOS standalone builds have compile-only evidence, not native validation.

The importable `@open-sauce/core@0.1.0` package supports Node 24+. Its library is separate from CLI argument handling. The portable entry point does not require a filesystem or Bun; explicit Node adapters load files. [API examples and failure contracts](docs/api.md) explain integration.

## What works now

- Source-preserving parser, AST, spans and recoverable diagnostics, with optional vocabulary resolution.
- Canonical ingredients, equipment and processes; supported parts, variants, states and locale-sensitive ambiguity.
- Normalised Sauce Code, Compact and semantic HTML rendering; original source remains separate.
- Conservative serving scaling, same-dimension unit/temperature conversion and precision-aware reading.
- Standalone CLI; completion-only Language Server; VS Code highlighting/autocomplete; dependency-free Vim/Neovim syntax support.
- Explicit optional culinary providers. No automatic provider download or discovery.

Scaling a supported numeric ingredient quantity retains its authored unit even when that unit cannot be converted. Ambiguous cups need a defined basis for volume conversion; mass/volume conversion requires eligible ingredient-specific evidence. Nutrition calculation and arbitrary density conversion are not implemented. See [reading limits](docs/reading-scaling.md). Planned work is in the [roadmap](docs/roadmap.md), not a promise of current behaviour.

## Canonical vocabulary and culinary knowledge

Core owns canonical identity, aliases and relationships. Parsing does not require vocabulary; unresolved/local terms remain valid syntax. Canonical resolution does not require an encyclopaedia article.

**Open Sauce Food — an open culinary encyclopaedia and recipe collection built using Sauce Code.**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/open-sauce-food-wordmark-dark.svg">
  <img src="assets/brand/open-sauce-food-wordmark-light.svg" alt="Open Sauce Food" width="480">
</picture>

[Knowledge](../knowledge/README.md) is the default **optional** culinary provider: articles, sources, photographs, taxonomy and quantitative observations. [Corpus](../corpus/README.md) owns recipes; [Site](../site/README.md) composes the website. Missing articles do not invalidate terms. Editorial categories are browsing choices, not mandatory language semantics.

## Develop and contribute

See the [seven-repository map and setup matrix](docs/ecosystem.md), [contribution guide](CONTRIBUTING.md), [API guide](docs/api.md) and [licensing](LICENSING.md). Cross-repository links assume the local sibling layout; Knowledge is unpublished and Site is private.

Core development uses Node 24+ and pnpm:
```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm test
pnpm corpus
pnpm quality:audit
pnpm docs:check
```

Run `pnpm source:check` in a clean tracked-source export, not by deleting unrelated user files from a working copy. Installed users do not need TypeScript or pnpm.

Development is predominantly AI-assisted, with maintainer-directed requirements and extensive tests; see the [development-process disclosure](CONTRIBUTING.md#development-process). Culinary review status is separate.

Recipe classification metadata is optional: a minimal recipe remains valid without category, dietary, cuisine or region labels. A dietary label is not a guarantee of suitability; check ingredients, substitutions and product labels. No corpus-wide dietary, cuisine or region inference is performed.
