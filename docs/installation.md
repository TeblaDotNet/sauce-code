# Installing Sauce Code

There are a few ways to use Sauce Code. For checking and rendering recipes, start with the command-line tool. For writing recipes in an editor, see the VS Code and Vim/Neovim options below.

## Windows command-line tool

Download the Windows x64 distribution from [Sauce Code Releases](https://github.com/TeblaDotNet/sauce-code/releases/latest). Extract the archive, keep the accompanying licence files, and open PowerShell in the extracted folder.

With the [README example](../README.md) saved as `dressing.opensauce`:

```powershell
.\opensauce.exe --help
.\opensauce.exe check dressing.opensauce
.\opensauce.exe render dressing.opensauce --format compact
.\opensauce.exe render dressing.opensauce --format code
.\opensauce.exe render dressing.opensauce --format html --theme auto --output dressing.html
.\opensauce.exe render dressing.opensauce --format code-html --servings 4 --output dressing-code.html
```

`check` reports syntax problems. `render` writes to the terminal unless you give an output file. It doesn't edit the recipe you opened. The HTML options, image embedding and scaling limits are covered in the [export guide](cli-export.md).

You can add the executable's folder to your user `PATH` to run `opensauce` from elsewhere. See the [standalone CLI guide](standalone-cli.md) for platform status and details.

## Node.js package

If you're developing a JavaScript application or want to use the Core library, start with the [API guide](api.md).

The package is called `@open-sauce/core` and requires Node.js 24+. To make a package from source, install Core's development dependencies and run `npm pack`. Install the resulting tarball from its actual path:

```sh
npm install -g /path/to/open-sauce-core-0.1.0.tgz
opensauce --help
```

That command installs a **locally built tarball**, not a package from npm's public registry. The same tarball can be installed in an application that imports `@open-sauce/core`.

## Editors

- **[VS Code](https://github.com/TeblaDotNet/sauce-code-vscode):** syntax highlighting, editor shortcuts and autocomplete. Download a VSIX from its [Releases page](https://github.com/TeblaDotNet/sauce-code-vscode/releases/latest) and choose *Extensions → Install from VSIX*.
- **[Vim / Neovim](https://github.com/TeblaDotNet/sauce-code-vim):** highlighting, comments and indentation. Autocomplete is available separately through the [Sauce Code Language Server](https://github.com/TeblaDotNet/sauce-code-language-server).

## Other platforms

Standalone builds have been produced for Linux and macOS, but the established native execution tests were on Windows x64. Check the notes for the particular release before relying on another platform's binary.
