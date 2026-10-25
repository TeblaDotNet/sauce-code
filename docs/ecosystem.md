# Sauce Code and Open Sauce Food ecosystem

Sauce Code is the language and tooling. Open Sauce Food is the culinary encyclopaedia and recipe collection built using it. This is the current local development contract, not a claim that all inputs are publicly downloadable.

## Ownership and dependency direction

| Local directory | Authority | Dependencies |
| --- | --- | --- |
| core | Grammar, AST, canonical vocabulary, renderers, reading algorithms, CLI | No sibling at runtime or for ordinary development |
| language-server | Stdio completion protocol | Pinned packaged Core in vendor; no Knowledge or Site |
| vscode-extension | VS Code syntax and completion client | Pinned server artifact; syntax works independently |
| vim-plugin | Vim/Neovim runtime syntax and editing defaults | None; LSP optional and separately configured |
| knowledge | Articles, sources, photos, quantitative observations, browsing taxonomy | Core contracts and generated canonical pin; no second editable vocabulary |
| corpus | Recipe text, source provenance, publication/review metadata | Core for validation; Knowledge only for explicit provider tests |
| site | Website presentation and publication tooling | Core + Knowledge + Corpus + Site, four explicit inputs |

Portable Core may compose a validated provider supplied by an application. It never discovers or downloads one. Open Sauce Food Knowledge is the default optional provider, not a requirement for parsing or canonical resolution. An identity may have an article, measurements, images, any combination, or none.

Versions are independent: Core package 0.1.0, LSP 0.2.1, extension 0.3.1 and Knowledge provider 0.1.0-stage-2 need not match. Provider schema version, content digest and Git revision are different identifiers. Builds must obey their actual pins, not assume all latest checkouts are interchangeable.

## Contributor setup matrix

Use Node 24+ and pnpm for JavaScript/TypeScript development unless noted. Install each repo's dependencies with `pnpm install --frozen-lockfile`; Knowledge and Vim have no package dependency installation step. Node users of the built Core package need its runtime YAML dependency, not TypeScript or pnpm. Standalone users need neither.

| Repo | Setup and checks | Inputs and generated output |
| --- | --- | --- |
| Core | `pnpm check`, `build`, `test`, `corpus`, `quality:audit`, `docs:check`; `source:check` on clean export; `package:smoke` for packaging | Independent. Ignored node_modules, dist, standalone. Bun 1.4.4 / OSF_BUN only for standalone build; Windows native checks, other targets compile-only |
| Knowledge | `node tools/build.mjs`; `pnpm test`; `node tools/source-check.mjs` on clean export | OSF_CORE + exact OSF_CORE_REVISION; Core dependencies. Full tests require OSF_CORPUS + OSF_CORPUS_REVISION, retained Git history, tar and directory-link support. Ignored dist/work. See its README for frozen pins |
| Corpus | `pnpm check`, `test`, `corpus`; optional `test:knowledge` | OSF_CORE (default ../core), OSF_CORPUS; provider tests additionally OSF_KNOWLEDGE and OSF_CORE_REVISION. Ignored .integration/run-* and node_modules |
| Site | `pnpm check`, `build`, `test`, `site:build`, `site:validate`, `browser` | OSF_CORE, OSF_KNOWLEDGE, OSF_CORPUS; four OSF_*_REVISION pins including SITE. Core/Knowledge dependencies required. Ignored .integration, node_modules; generated site-dist lives in derived workspace |
| LSP | `pnpm install --frozen-lockfile --ignore-scripts`; `pnpm check`, `build`, `test` | Checked-in vendor Core archive and core-input.json, not current sibling Core. OSF_CORPUS enables real-corpus coverage. Ignored dist/standalone/node_modules; Bun only for standalone build |
| VS Code | `pnpm check`, `test`, `build`, `package` | Build reads ../language-server/dist and enforces server-input.json. Use an isolated sibling pair with the exact pinned server revision; current server HEAD may deliberately differ. Ignored dist/server/node_modules and VSIX under ../_work |
| Vim | `vim -Nu NONE -n -es -S tests/run.vim`; `nvim --headless -u NONE -S tests/run.vim` | Only installed editor needed. No Core/Node/LSP dependency; use both hosts when available |

For Site browser checks install Playwright/browser locally or supply NODE_PATH and OSF_BROWSER_EXECUTABLE for an installed Chromium/Edge. Unset SITE_TEST_ORIGIN: this command deliberately accepts local preview only. These are developer requirements, not static-site visitor dependencies.

Integration workspaces reproduce old Core-shaped paths for retained tests. They record input provenance and are disposable, never editing sources. Do not modify generated knowledge copies or use them as a second authority. Knowledge's tests additionally reconstruct immutable historical fixtures; shallow exports without the required Git objects cannot run full migration parity.

## Where to make a change

Language syntax, canonical IDs/aliases and measurement algorithms belong in Core. Article wording, evidence, photos and editorial taxonomy belong in Knowledge. Recipe conversions and their provenance belong in Corpus. HTML/CSS and release operations belong in Site. Protocol completion belongs in LSP; editor-specific activation and grammar belong in the respective editor repository. Run the affected repo's checks and any consuming integration checks; preserve authored recipe meaning and unresolved ambiguity.

## Naming and publication status

Directory names above are current local names. Existing historical GitHub names still contain open-sauce-food; this documentation does not rename them. Knowledge's proposed destination is `TeblaDotNet/open-sauce-food-knowledge`, currently unpublished. Future Sauce Code repository naming is a Stage 7 decision, not a live link. Site remains private. No public-only clone/build recipe for the complete ecosystem is promised.

[Contribution and AI-development policy](../CONTRIBUTING.md) · [API contracts](api.md) · [Knowledge testing](../../knowledge/README.md) · [Site runbook](../../site/hosting/RUNBOOK.md)
