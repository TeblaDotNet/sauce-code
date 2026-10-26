# Roadmap

Sauce Code is usable today as a recipe language, parser, renderer and command-line tool. It also has autocomplete support in VS Code and other LSP-compatible editors.

The next work is about making Sauce Code better to **write** and more useful with **real recipes**:

- **VS Code live Compact preview:** show readable instructions alongside the source while editing.
- **Editor diagnostics:** explain problems in incomplete or invalid recipes without overwhelming people as they type.
- **Recipe quality:** improve conversions in the [Open Sauce Food Corpus](https://github.com/TeblaDotNet/open-sauce-food-corpus) and use the difficult cases to guide language changes.
- **Measurements:** gradually add evidence-backed ingredient masses and densities so more useful conversions become possible.
- **Vocabulary and reference material:** expand ingredient coverage and improve the [Open Sauce Food Knowledge](https://github.com/TeblaDotNet/open-sauce-food-knowledge) articles.

Longer-term ideas include baker's percentages, nutrition, richer branching instructions and easier recipe editing. These aren't current features or commitments to a release date.

Sauce Code will remain usable independently of the Open Sauce Food website. For the current technical details, see the [specification](../SPEC.md), [API guide](api.md) and [reading/scaling notes](reading-scaling.md).
