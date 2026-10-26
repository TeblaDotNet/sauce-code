# Standalone command-line tool

The `opensauce` executable checks `.opensauce` files and renders them as text or HTML. Start with the [installation guide](installation.md) for a short introduction.

## Using it on Windows

Download the Windows distribution from [GitHub Releases](https://github.com/TeblaDotNet/sauce-code/releases/latest), extract it and keep the included licence and notice files. From PowerShell in that folder:

```powershell
.\opensauce.exe --version
.\opensauce.exe check "C:\Recipes\dinner.opensauce"
.\opensauce.exe render "C:\Recipes\dinner.opensauce" --format compact
.\opensauce.exe render "C:\Recipes\dinner.opensauce" --format html --theme auto --output "C:\Recipes\dinner.html"
```

You can optionally put the folder on your user `PATH`. You don't need an installer or administrator privileges.

The executable leaves the input recipe alone. Syntax errors prevent rendering; warnings appear in the terminal. Use `--no-knowledge` to check or render without matching ingredient and equipment names to the bundled vocabulary.

For image embedding, styled HTML, exact CLI options and serving-size scaling, see [CLI exports](cli-export.md).

## Platforms and updates

Windows x64 has native test coverage. Linux x64/ARM64 and macOS x64/ARM64 distributions have been cross-compiled, but the previously recorded checks do not establish native execution on those systems. The binaries are unsigned and do not update automatically.

When updating a local installation, replace the distribution with the new verified files and keep the accompanying notices. You can check an archive or executable against its published SHA-256 checksum; in PowerShell, use `Get-FileHash`.

## Building from source

Building the standalone tool requires Node.js 24+, pnpm, Git and Bun 1.4.4. Bun is needed to **build** the executable, not to run it.

From the Core repository:

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm standalone:build windows-x64
pnpm standalone:smoke
pnpm standalone:library
```

Cross-build commands (where supported by the current toolchain):

```sh
pnpm standalone:build linux-x64 linux-arm64 darwin-x64 darwin-arm64
```

`OSF_BUN` can point to the Bun executable. `OSF_CORPUS` optionally enables extra real-recipe smoke fixtures. Generated distributions are under `standalone/<target>/`; ignored `work/` contains build evidence. Release builds should use clean, committed source, and distribution manifests record their source revision, tool versions and hashes.

Keep `LICENSE`, `LICENSING.md`, `LICENSES/` and the third-party notices with redistributed builds. Published archives also contain a relinkable application bundle; [Bun’s notice](../LICENSES/Bun-1.4.4.md) explains the linked-library terms and relinking. Core’s [layered licensing](../LICENSING.md) still applies.

The implementation shares the parser and renderers with the Node package: there is no separate standalone recipe engine. Advanced packaging and runtime isolation checks are in the build scripts and tests under `tools/`.
