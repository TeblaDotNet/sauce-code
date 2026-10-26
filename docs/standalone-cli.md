# Standalone Core CLI v1

The standalone executable validates and renders Sauce Code without Node.js, npm,
pnpm, Bun, a Core checkout or external knowledge YAML at runtime. It is an optional
adapter around the same Core implementation used by the Node-compatible package.
No GUI is included. Download unsigned archives and SHA-256 checksums from [GitHub Releases](https://github.com/TeblaDotNet/sauce-code/releases/latest). Windows x64 is native-tested; Linux/macOS targets are cross-compiled only.

## Install and use on Windows

Use the `standalone/windows-x64/` distribution produced by the build below. Keep its
licence and notice files alongside `opensauce.exe`; only the executable is needed
for operation. Copy the distribution to a folder you control, such as
`$HOME\Apps\OpenSauceFood`. In PowerShell from that folder:

```powershell
.\opensauce.exe --version
.\opensauce.exe --help
.\opensauce.exe check "C:\Recipes\dinner.opensauce"
.\opensauce.exe render "C:\Recipes\dinner.opensauce" --format compact
.\opensauce.exe render "C:\Recipes\dinner.opensauce" --format code
.\opensauce.exe render "C:\Recipes\dinner.opensauce" --format html --output "C:\Recipes\dinner.html"
```

Optionally add that folder to your **user** PATH through Windows Environment
Variables, then open a new terminal and run `opensauce --version`. No administrator
installation is required. To update, close running commands and replace the
executable and accompanying notices with a newly verified build. Compare the
executable's SHA-256 against `manifest.json`, for example with
`Get-FileHash .\opensauce.exe -Algorithm SHA256`. A locally supplied checksum detects
accidental changes; these builds are not signed and have no installer or updater.

HTML remains an unstyled semantic fragment by default. Opt in to an offline document with `--theme`; see [export options](cli-export.md).
`--no-knowledge` disables resolution. Unknown culinary terms do not make a recipe
invalid. Parse errors prevent rendering; warnings are printed to stderr. Output
files may be replaced, but the input and its hardlink aliases are protected.
There is no runtime network lookup. External source/reference URLs in knowledge
are retained as metadata; knowledge-base photographs are not embedded. Explicit `--embed-images` includes eligible local recipe images; it never downloads them.

## Platform status

| Target | Compiled | Executed | CLI parity |
|---|---|---|---|
| Windows x64 | Yes | Yes | Byte-for-byte stdout/stderr/status and output files (latest receipt under `work/standalone-evidence/`) |
| Linux x64 | Yes | No | Untested |
| Linux ARM64 | Yes | No | Untested |
| macOS x64 | Yes | No | Untested |
| macOS ARM64 | Yes | No | Untested |

Only Windows x64 has runtime acceptance evidence. Other targets are experimental
cross-builds, not verified platform support. Bun documents Windows 10 version 1809+
and macOS 13+ requirements; native-host testing remains necessary. See the
[official installation requirements](https://bun.sh/docs/installation).
The Windows isolation test uses a fresh external folder and an empty runtime PATH,
with no Core installation, knowledge directory or development files in that folder.
It is a restricted-environment test on the development host, not a fresh VM.

## Developer builds

Use Node 24+, the existing locked Core development dependencies, Git and **Bun
1.4.4**. Bun is a build-time tool only; Core's dependencies and package exports are
unchanged. Install Bun using its [official instructions](https://bun.sh/docs/installation).
`OSF_BUN` may identify an absolute compiler executable without changing PATH.

```powershell
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm standalone:build windows-x64
pnpm standalone:smoke
pnpm standalone:library
pnpm standalone:build linux-x64 linux-arm64 darwin-x64 darwin-arm64
```

For additional real-recipe parity fixtures, set `OSF_CORPUS` to a local Corpus
checkout before `pnpm standalone:smoke`. Without it, the smoke test uses Core's
retained bread fixture and a Unicode/quantity edge case. Corpus is never needed
by the distributed executable. Run the commands from Core; `standalone:smoke`
accepts an optional executable path as its first argument.

The Node build tool generates a JSON snapshot through the existing
`loadCanonicalVocabulary` loader and compiles a tiny adapter with Bun's supported
[`Bun.build({compile: ...})`](https://bun.sh/docs/bundler/executables) API. The
snapshot is regenerated from canonical sources, never maintained by hand. The
compiler version is pinned and nearby dotenv/Bun configuration auto-loading is
disabled in the distributed executable. Generated inputs and evidence stay under
ignored `work/`; distributions stay under ignored `standalone/<target>/`.

Each distribution records Core Git revision, tracked-dirty state, build-source
hashes, compiler version/revision, host, target, package/dependency versions,
knowledge snapshot hash, executable size/hash and a complete file inventory.
A dirty build is explicitly labelled; a release should be rebuilt after committing.
Commands and source snapshots are reproducible; do not assume cross-host binary
bit-for-bit reproducibility without comparing the recorded hashes.

## Behaviour and future GUI reuse

`src/cli/run.ts` contains the shared command adapter. The Node entry point injects
package version and filesystem knowledge loading; the generated standalone entry
injects version and an embedded snapshot reconstructed with the portable
`Vocabulary` class. Neither adds another parser, resolver or renderer.

The public `@open-sauce/core` API remains importable independently. It does not
import CLI argument handling, stdout/stderr plumbing or Bun APIs. Reading/scaling,
quantity conversion and reference rendering remain library APIs that a future GUI
can call directly. The CLI now exposes serving scaling through `render --servings`;
conversion and reference operations remain library APIs.
A separate compiled library probe exercises these APIs and compares the complete
snapshot against canonical Node-loaded knowledge. No language-server repository,
GUI, recipe source or website change is included.

The Node package uses generated canonical-only JSON and requires Node 24+. Neither distribution bundles encyclopaedia articles, source registries or photographs.
`pnpm package:smoke` verifies a packed external installation and public imports.
Help also documents opt-in styled HTML, local image embedding and serving scaling.

## Licences and limitations

Keep `LICENSE`, `LICENSING.md`, `LICENSES/` and `THIRD-PARTY-NOTICES.txt` with any
redistributed build. [Bun's pinned upstream notice](../LICENSES/Bun-1.4.4.md)
includes linked-library terms and JavaScriptCore relinking instructions. Core's
layered code/knowledge/source terms continue to apply. The YAML parser is a build
input for the snapshot, not a standalone runtime dependency.

Executables are large because they include a JavaScript runtime (roughly 91–117 MB
in this trial). Native Linux/macOS acceptance, signing and installers
remain future work. No network service, automatic update or GUI was added.

Original standalone-v1 build evidence: [validation receipt](standalone-cli-validation.json).
For current exports and limits see [CLI exports](cli-export.md); current executable
checksums and source commits are recorded in the generated distribution manifests. Each generated distribution manifest records its actual build revision; pre-commit trial manifests explicitly identify tracked changes.
