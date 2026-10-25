# Install and use Sauce Code

Choose one entry point; editors are optional. No GUI or web editor is required.

## Windows standalone

Obtain the maintainer-provided Windows build, retaining its LICENSES and notices. Public release hosting is not established by this guide. Copy the distribution into a directory you own; [standalone instructions](standalone-cli.md) cover the existing installation paths and optional PATH setup.

From the executable directory, with the README recipe saved as dough.opensauce:
```powershell
.\opensauce.exe --version
.\opensauce.exe --help
.\opensauce.exe check dough.opensauce
.\opensauce.exe render dough.opensauce --format compact
.\opensauce.exe render dough.opensauce --format code
.\opensauce.exe render dough.opensauce --format html --theme light
.\opensauce.exe render dough.opensauce --format html --theme dark
.\opensauce.exe render dough.opensauce --format html --theme auto --embed-images
.\opensauce.exe render dough.opensauce --format code-html --servings 4
```

Output goes to stdout unless an output option is supplied; diagnostics go to stderr. Check errors prevent render. HTML without a theme is a fragment; themed HTML is a styled Compact document. code-html is a syntax-highlighted document. Original source is not rewritten. Scaling needs a single positive numeric serves value and supported ingredient quantities; inspect warnings for unscaled expressions. It does not scale cooking times or equipment.

Embedding accepts bounded local raster images relative to the input recipe; remote URLs and SVG are not embedded. Warnings and retained URLs can mean the result is not fully offline. See [export limits and options](cli-export.md). Embedding does not grant image rights.

Windows executable execution has been tested. Linux/macOS target compilation alone is not native runtime validation.

## Node package

Requires Node 24+. From a Core checkout with development dependencies installed, `npm pack` creates the local package. Outside the repository, install its actual tarball path with `npm install -g <path-to-open-sauce-core-0.1.0.tgz>`. Replace the placeholder with the produced path; this is not a registry-install claim. Run `opensauce --help`. The installed package needs Node and its bundled/package runtime dependencies, not pnpm, TypeScript, Corpus or Site. Library users can install the same tarball locally and import `@open-sauce/core`; see [API examples](api.md).

## Editors

[VS Code](../../vscode-extension/README.md): use Extensions → Install from VSIX, selecting the provided open-sauce-food-0.3.1.vsix. The identifier remains `tebla-local.open-sauce-food`. Syntax support and bundled completion are implemented; preview, diagnostics, formatting and navigation are not claimed. No external Core/Node installation is needed for the packaged extension.

[Vim/Neovim](../../vim-plugin/README.md): install the runtime directory using native package loading; syntax, comments and basic indentation need no external software. The [standalone LSP](../../language-server/README.md) is optional for completion. Neovim's native LSP configuration requires the documented supported version; Vim syntax itself is not an LSP client.

No package publication or editor installation into your normal profile is performed by reading this guide.
