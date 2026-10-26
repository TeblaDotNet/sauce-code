# Sauce Code

Sauce Code is a plain-text language for writing recipes that software can understand. In a `.opensauce` file, ingredients, equipment, actions and results have explicit roles, so tools can check a recipe, link familiar terms and render it in different ways. The original wording is preserved. Sauce Code won't guess missing quantities or tell you whether a recipe is safe or tastes good.

## A short example

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

The Compact renderer produces:

> Combine flour and egg yolk to make dough.
> Mix the dough in mixing bowl, then rest for 20 minutes.

`(thing)` refers to an ingredient or piece of equipment; `<action>` describes a process; and `{result}` names something made within the recipe. The `: yolk` suffix selects a part, `; plain` a variant, and `@ Example Mill` a product label written by the author. These labels do not automatically create new entries in the shared vocabulary. The full syntax is in the [specification](SPEC.md).

## Use it

The Windows executable runs without Node.js, Bun, pnpm or a local Core checkout. Use a build supplied by the maintainer and keep its licence notices. No public executable download or npm release is claimed here.

```powershell
.\opensauce.exe check dough.opensauce
.\opensauce.exe render dough.opensauce --format compact
.\opensauce.exe render dough.opensauce --format html --theme auto --servings 4
.\opensauce.exe render dough.opensauce --format code-html --theme dark
```

See the [installation guide](docs/installation.md), [standalone distribution notes](docs/standalone-cli.md) and [HTML/scaling export guide](docs/cli-export.md). The Windows executable has been run and tested; Linux and macOS builds have been compiled but not tested on those systems.

For JavaScript applications, `@open-sauce/core@0.1.0` supports Node.js 24+. Its library APIs are independent of the CLI. Portable functions do not need filesystem access or Bun; file loading is handled by the Node adapters. See [API usage and error handling](docs/api.md).

## Features

- Source-preserving parser, AST, spans and recoverable diagnostics, with optional vocabulary resolution.
- Canonical ingredients, equipment and processes; supported parts, variants, states and locale-sensitive ambiguity.
- Normalised Sauce Code, Compact and semantic HTML rendering; original source remains separate.
- Conservative serving scaling, same-dimension unit/temperature conversion and precision-aware reading.
- Standalone CLI; completion-only Language Server; VS Code highlighting/autocomplete; dependency-free Vim/Neovim syntax support.
- Explicit optional culinary providers. No automatic provider download or discovery.

Scaling a supported numeric ingredient quantity keeps the unit written in the recipe, even if Core cannot convert it. Converting cups to a volume requires a known cup standard; converting between mass and volume needs eligible measurements for the specific ingredient. Nutrition calculations and general-purpose density conversion are not available. See [reading and scaling limits](docs/reading-scaling.md) and the [roadmap](docs/roadmap.md).

## Canonical vocabulary and culinary knowledge

Sauce Code defines shared ingredient, equipment and process identities, including their names, aliases and structural relationships. Recipes can still be parsed without that vocabulary, and an unfamiliar or locally named ingredient is not a syntax error. A shared term does not need an encyclopaedia article.

Open Sauce Food is the cookbook and culinary reference project built with Sauce Code.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/brand/open-sauce-food-wordmark-dark.svg">
  <img src="assets/brand/open-sauce-food-wordmark-light.svg" alt="Open Sauce Food" width="480">
</picture>

Its [Knowledge repository](https://github.com/TeblaDotNet/open-sauce-food-knowledge/blob/main/README.md) provides optional articles, sources, photographs, browsing categories and measurements. The [Corpus](https://github.com/TeblaDotNet/open-sauce-food-corpus/blob/main/README.md) holds recipes, while the Site (private contributor path: `../site/README.md`) brings everything together for publication. Open Sauce Food is the recommended knowledge provider, not a requirement for using the language.

## Develop and contribute

Start with the [repository map and setup matrix](docs/ecosystem.md), [contribution guide](CONTRIBUTING.md), [API guide](docs/api.md) or [licensing notes](LICENSING.md). Links to sibling repositories assume a local checkout; Knowledge has not been published and Site source is private.

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

Most of the code has been written with AI tools under the maintainer's direction. The [development-process disclosure](CONTRIBUTING.md#development-process) describes the workflow and review limits; culinary content has its own review status.

Recipe classification metadata is optional: a minimal recipe remains valid without category, dietary, cuisine or region labels. A dietary label is not a guarantee of suitability; check ingredients, substitutions and product labels. No corpus-wide dietary, cuisine or region inference is performed.
