# Sauce Code

Sauce Code is a plain-text recipe language. It gives ingredients, equipment and cooking steps a structure that software can work with, while keeping the recipe readable and editable as text.

You can check a recipe, turn it into a reading-friendly version, render it as HTML or adjust supported ingredient quantities for a different number of servings.

## Example

Save this small lemon dressing as `dressing.opensauce`:

```opensauce
::recipe
name: Lemon dressing
serves: 2

::ingredients
(olive oil) 3 tbsp
(lemon juice) 1 tbsp
(salt) 1 pinch

::instructions
{dressing} = (olive oil) + (lemon juice) + (salt)
{dressing} <mix>
```

The Compact renderer produces:

> Combine olive oil, lemon juice, and salt to make dressing.
> Mix the dressing.

Parentheses mark ingredients or equipment, angle brackets mark actions, and braces name something made in the recipe. The [specification](SPEC.md) covers the full syntax.

Sauce Code's **Compact** renderer turns structured steps into ordinary recipe instructions. You can also view the structured Code rendering or create an HTML page. Try the example with the commands below.

## Get started

Download a standalone build from [Sauce Code v0.1.0](https://github.com/TeblaDotNet/sauce-code/releases/latest), or [build from source](docs/installation.md). On Windows, extract the standalone distribution and run `opensauce.exe` in PowerShell:

```powershell
.\opensauce.exe check dressing.opensauce
.\opensauce.exe render dressing.opensauce --format compact
.\opensauce.exe render dressing.opensauce --format html --theme auto --servings 4 --output dressing.html
```

The [installation guide](docs/installation.md) also covers the Node.js package and editors. Windows has been tested directly; other standalone targets should be checked against the platform notes before use.

## What it can do

- Parse recipes and report syntax problems while retaining the original source.
- Recognise shared ingredients, equipment and cooking processes, including aliases, parts and variants.
- Render recipes as Sauce Code, Compact instructions or HTML.
- Scale supported ingredient amounts and convert supported units for reading, without changing the source file.
- Provide syntax highlighting and autocomplete in [VS Code](https://github.com/TeblaDotNet/sauce-code-vscode), plus [Vim/Neovim support](https://github.com/TeblaDotNet/sauce-code-vim).

Not every quantity can be converted or scaled safely. See [reading and scaling](docs/reading-scaling.md) for the details.

## Using Sauce Code in software

The `@open-sauce/core` package exposes the parser, renderers and other APIs for Node.js applications. [API documentation](docs/api.md) explains the supported interfaces. Core is independent of the Open Sauce Food website and its culinary articles.

[Open Sauce Food](https://tebla.net/opensaucefood/) is the cookbook and culinary reference project built with Sauce Code. Its [Knowledge repository](https://github.com/TeblaDotNet/open-sauce-food-knowledge) provides articles, photographs and sources; its [Corpus](https://github.com/TeblaDotNet/open-sauce-food-corpus) holds recipes.

## Development

Building Core requires Node.js 24+ and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm test
```

See the [developer setup map](docs/ecosystem.md), [contributing](CONTRIBUTING.md), [roadmap](docs/roadmap.md) and [licences](LICENSING.md). This is an early `0.x` project; bug reports and contributions are welcome.
