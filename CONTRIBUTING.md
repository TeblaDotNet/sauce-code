# Contributing

Sauce Code is still early in development. Bug reports, examples of recipes it struggles with, documentation fixes and code contributions are all useful.

If you find a problem, open an issue with a small `.opensauce` example, what you expected, what happened, and the command or editor version you're using. Please remove personal information, credentials and private recipes before posting.

## Where changes belong

- **Language, parser, rendering and shared ingredient/equipment/process names:** [Sauce Code](README.md). For syntax changes, include an example and explain what happens to existing recipes.
- **Recipes and conversions:** [Open Sauce Food Corpus](https://github.com/TeblaDotNet/open-sauce-food-corpus). Check changes against the original recipe and keep its source credit.
- **Culinary articles, measurements and photographs:** [Open Sauce Food Knowledge](https://github.com/TeblaDotNet/open-sauce-food-knowledge). Include sources, attribution and licensing information.
- **Editor support:** the [Language Server](https://github.com/TeblaDotNet/sauce-code-language-server), [VS Code](https://github.com/TeblaDotNet/sauce-code-vscode) or [Vim/Neovim](https://github.com/TeblaDotNet/sauce-code-vim) repositories.

Don't fill missing recipe details by guessing. A conversion passing the parser doesn't necessarily mean it's faithful to its source, and a culinary article being present doesn't mean it has been reviewed.

## Development checks

For Core, start with:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm test
pnpm docs:check
```

The [developer setup guide](docs/ecosystem.md) lists the additional checks, prerequisites and repository relationships. Please say which tests you actually ran. Preserve existing provenance and [licence terms](LICENSING.md), including individual photograph and recipe-source licences.

## How this project is developed

I've built Sauce Code and Open Sauce Food with extensive help from AI coding tools. I decide what to build, work through the design and test the results, but I haven't personally read every line of generated code. Automated tests catch a lot, not everything. That's one reason I'd welcome outside review and contributions.

If you use AI tools for a contribution, that's fine — just be clear about what you generated, reviewed and tested. For culinary content, keep factual review and permission to reuse someone else's writing or images separate from software test results.
