# Contributing to Open Sauce Food

Open Sauce Food is in early development. Discussion, concrete recipe examples and careful culinary review are useful contributions. Explain the problem before proposing a broad language change; preserve the distinction between authored text and shared knowledge.

For a code change, run `pnpm check`, `pnpm build`, `pnpm test`, `pnpm corpus`, `pnpm quality:audit` and `pnpm docs:check`. Add focused behavioral tests. Keep the parser source-preserving and independent of vocabulary. Do not silently rewrite recipes or infer missing quantities.

For knowledge, read [the knowledge model](docs/knowledge.md). Include evidence for aliases, parts, preparation states and relationships. An observed phrase is not automatically a synonym; ambiguous terms should remain unresolved. Do not mark automated work as human-checked. Keep IDs stable and canonical index entries explicit.

Recipes in core are representative pinned examples. Full-corpus work belongs in the corpus project with source provenance and its regression suite. Website presentation and deployment belong in the separate site project. No production action is part of a core contribution.

Preserve source-author credits, provenance and the [applicable licenses](LICENSING.md). Useful references: [Spec](SPEC.md), [design principles](docs/design-principles.md), [roadmap](docs/roadmap.md).

Recipe classification metadata is optional: a minimal recipe remains valid without category, dietary, cuisine or region labels. A dietary label is not a guarantee of suitability; check ingredients, substitutions and product labels. No corpus-wide dietary, cuisine or region inference is performed.
