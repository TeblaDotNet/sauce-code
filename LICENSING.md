# Licensing and attribution

Copyright © 2026 Tebla and Open Sauce Food contributors, for their respective
contributions. These grants apply only to rights the contributors hold. The root
[LICENSE](LICENSE) is a scope pointer, not a blanket grant over third-party material.

| Material / paths | Terms |
|---|---|
| Original parser, model, renderers, vocabulary/reference tooling in `src/`; TypeScript/JavaScript tooling in `tools/`; test code in `tests/`; `demo/app.js`; build/package configuration and GitHub workflow configuration | [MIT](LICENSES/MIT.txt) |
| Demo presentation: `demo/index.html`, `demo/style.css`, `demo/theme-init.js`, `demo/dark-mode.js` | [GPL-2.0-or-later](LICENSES/GPL-2.0-or-later.txt): version 2 or, at your option, any later version |
| Project-owned canonical YAML in `knowledge/ingredients/`, `knowledge/equipment/`, `knowledge/processes/`; project-owned structured report/observation data and selection/arrangement | [CC0 1.0](LICENSES/CC0-1.0.txt), to the extent rights apply; copied evidence is excepted |
| Authored specification, guides, root/docs Markdown, explanatory material, issue/PR templates and original screenshot contributions | [CC BY 4.0](LICENSES/CC-BY-4.0.txt), except separately identified source material and notices |
| Open Sauce Food-authored structural encoding and annotations in `.opensauce`, including test fixtures | [CC BY 4.0](LICENSES/CC-BY-4.0.txt), to the extent copyright or related rights apply |
| Imported source text, images, author records and source expression reproduced in recipes, fixtures, reports, screenshots or metadata | Upstream Public Domain Recipes public-domain / [Unlicense declaration](examples/provenance/UPSTREAM-LICENSE.md); provenance retained, not relicensed by this project |
| Manrope and Fira Code font binaries | SIL OFL 1.1; existing font credits and notices retained with the extracted site project |

For CC BY material, credit **Tebla and Open Sauce Food contributors**, identify Open
Sauce Food and the source/version you used, link the licence and indicate your changes.
Preserve supplied source-author credits independently. The final repository URL will
be chosen before publication; none is invented here.

## Presentation provenance and GPL scope

The presentation layer is adapted from the Tebla theme, a custom child theme
developed on WordPress Twenty Twenty-Five. Some predecessor presentation code
predates the current Tebla Git history. No audited Open Sauce Food presentation
code was positively identified as copied from WordPress core or Twenty Twenty-Five;
GPL-2.0-or-later is used conservatively for this presentation layer. This does not
automatically apply GPL to the independently scoped MIT parser/tooling. Source for
the presentation is retained in the extracted site project under `demo/`; font terms remain separate. See
design provenance in the extracted site project.

## Layered recipe and data terms

Underlying imported material retains its upstream declaration and source provenance.
The CC BY offer covers our structural encoding/annotations only to the extent rights
apply; it does not manufacture copyright in purely factual or mechanical material.
The upstream site-wide dedication does not itself establish a complete rights chain
for every third-party-derived item. Five cases are excluded: see
the compact record and data sources retained with the public corpus project.

CC0 covers project-owned selection, arrangement and contributions only. It does not
relicense embedded/copied third-party evidence. Future FoodOn, USDA, Wikidata or other
external data must retain its own applicable terms and attribution. No such numerical
dataset is integrated today.

Dependencies keep their own licences: `yaml` is ISC, TypeScript is Apache-2.0 and
`@types/node` is MIT. They are not bundled in this source export. Do not replace
their notices when distributing dependencies.

Licence texts: [GNU GPL 2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html),
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/legalcode),
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/legalcode).
The unmodified texts are retained locally; the GPL “or later” option is granted above.

## Reference hero photographs

Optional images in `assets/references/` retain their individual public-domain, CC0, CC BY or CC BY-SA terms. They are not relicensed under the knowledge CC0 grant. See [image credits](assets/references/ATTRIBUTION.md) and the adjacent selection register for creators, source pages, licence links and derivative details.

## Standalone runtime packaging

Standalone builds also embed Bun 1.4.4. Its upstream runtime and linked-library notices, including JavaScriptCore relinking instructions, are retained in [Bun-1.4.4.md](LICENSES/Bun-1.4.4.md) and copied into each distribution. Core's existing terms are unchanged. Generated snapshots embed knowledge metadata, not reference photograph bytes. Keep all supplied licence and notice files with redistributed executables.
