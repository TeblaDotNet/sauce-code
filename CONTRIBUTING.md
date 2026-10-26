# Contributing to Sauce Code and Open Sauce Food

Start with the [repository map and setup matrix](docs/ecosystem.md). Core owns the language; Open Sauce Food owns culinary content and its presentation. Report bugs with a minimal recipe, command/editor version, expected and actual behaviour, diagnostics and platform. Remove private recipes, credentials and personal paths from reports.

## Choose the right contribution

- Propose language changes against [SPEC.md](SPEC.md), with concrete recipe examples and compatibility implications. Do not silently reinterpret existing syntax.
- Propose canonical identities in Core with evidence for aliases, parts, variants, states and relationships. An observed phrase is not automatically a synonym; unresolved ambiguity is preferable to false equivalence.
- Contribute articles, citations, images and observations in [Knowledge](https://github.com/TeblaDotNet/open-sauce-food-knowledge/blob/main/README.md). State uncertainty and review status. Citation is not permission to reproduce prose; record rights and attribution separately.
- Improve conversions in [Corpus](https://github.com/TeblaDotNet/open-sauce-food-corpus/blob/main/README.md), comparing source and structured recipe. Preserve quantities, alternatives, sequence and provenance; do not infer missing steps or silently promote generated work to human-reviewed.
- Change website presentation or release tooling in Site (private contributor path: `../site/README.md`). Local validation grants no production authorization.
- Editor integrations have their own focused READMEs; keep parser semantics in Core.

Classification metadata is optional. Dietary labels are not a guarantee of suitability; check actual ingredients and substitutions.

## Checks and review

For Core run `pnpm check`, `pnpm build`, `pnpm test`, `pnpm corpus`, `pnpm quality:audit` and `pnpm docs:check`. Run `pnpm source:check` on a clean tracked-source export without unrelated user files. Use the matrix for other repositories, including Knowledge's historical prerequisites. Add meaningful behavioural tests for changed behaviour; document exactly which commands passed, failed or were not run.

Preserve original source, source spans and conservative renderer behaviour. [API contracts](docs/api.md) and the parser/renderer phase maps explain the boundaries. Keep generated workspaces and release evidence out of commits. Do not publish private Site source or unpublished Knowledge without approval.

Describe scope, evidence, limitations and rights in contributions. Preserve [licence scopes](LICENSING.md) and third-party notices. Moving a file does not relicense it. Article rights that require an author/rightsholder decision remain a publication gate, not a test to waive.

## Development process

Sauce Code and Open Sauce Food have been developed predominantly using AI coding tools. The maintainer directs requirements, design decisions and acceptance criteria. Extensive automated testing has been performed, but not every line has been independently reviewed by a human. Automated tests and AI assistance do not guarantee correctness. External scrutiny, bug reports and contributions are welcome.

Describe AI assistance honestly: identify what was generated, what you reviewed, which sources were checked and which tests ran. Do not imply manual review where none occurred. Code authorship and code-review evidence are distinct from culinary article/recipe review status; a passing software test does not certify culinary accuracy, safety or reproduction rights.

Recipe classification metadata is optional: a minimal recipe remains valid without category, dietary, cuisine or region labels. A dietary label is not a guarantee of suitability; check ingredients, substitutions and product labels. No corpus-wide dietary, cuisine or region inference is performed.
