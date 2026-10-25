# CLI recipe exports

Existing `check`, `--help`, `--version`, `--no-knowledge` and output-file behaviour
remain available. Parse errors return exit code 1 and prevent output; warnings go
to stderr. The executable needs no runtime installation; see
[standalone installation](standalone-cli.md).

## HTML documents and images

```sh
opensauce render dinner.opensauce --format html --theme auto --embed-images --output dinner.html
opensauce render dinner.opensauce --format html --theme light --output dinner-light.html
opensauce render dinner.opensauce --format html --theme dark --output dinner-dark.html
opensauce render dinner.opensauce --format code-html --embed-images --output dinner-code.html
```

`--format html` alone retains the existing unstyled semantic fragment and relative
image paths. `--theme light|dark|auto` explicitly selects a complete responsive
Compact document with inline CSS. Auto follows the viewer's system theme.
`code-html` selects a highlighted rendered Sauce Code document using Core's
existing semantic/syntax spans; its default theme is auto. This is normalized
rendered Code, not a byte-for-byte source facsimile. Plain `--format code` is
unchanged. No JavaScript, fonts, framework or CDN is needed.

Use `--embed-images` when saving HTML outside the recipe's directory. Local PNG,
JPEG, GIF and WebP files resolve relative to the input recipe, not the terminal
or output directory. Their bytes become data URLs. Metadata and attribution stay
in the document; embedding does not grant a licence to redistribute an image.
The option also works explicitly on an unstyled HTML fragment.

Files must stay within the recipe directory, including resolved symbolic links.
Traversal, absolute paths, remote URLs, SVG and unsupported/mismatched signatures
are not embedded. Limits are 5 MiB per file and 20 MiB per export before base64
encoding. Base64 increases size by about one third. Missing/rejected images keep
the original safe reference (or the renderer's visible unavailable placeholder),
with a stderr warning and a notice in styled documents. Those images are **not**
portable. Remote images are never fetched by the CLI; a viewer may still load a
retained remote reference when online. Fully offline images require successful
embedding of every active image. Raw `::source` payloads are never treated as
resource requests. Recipe images and source files are never modified.

## Serving scaling

```sh
opensauce render dinner.opensauce --format compact --servings 6
opensauce render dinner.opensauce --format code --servings 6
opensauce render dinner.opensauce --format html --theme auto --servings 6 --embed-images
```

The recipe must have exactly one positive numeric `serves:` metadata value and
at least one eligible ingredient declaration. Missing, ranged or unknown original
servings fail explicitly. `servings:` is not an alias for the authored `serves:`
field; the CLI option is named `--servings`.

Scaling uses Core's existing reading model and proportional scaling API. It
supports complete numeric declaration amounts, fractions, `!`, `~`, `~~`, and
safe single custom units. It retains the original unit spelling, including
ambiguous cups, and never performs conversion or density inference. For example,
2 cups at 2 servings becomes 3 cups at 3 servings. Temperatures are not scaled.

Mixed-unit expressions, packaging descriptions, inline quantities in choice
definitions, prose and instruction amounts remain authored. Each unsupported
ingredient expression is reported; all scaling runs warn that instructions need
review. An eligible quantity on a local ingredient choice reference can scale;
the quantities inside its alternative definition cannot. Output is a **partial
reading projection**, not a fully recalculated recipe suitable for overwriting
the source. CLI safeguards prevent overwriting the input, including hardlink aliases.
Fractional results use numeric notation with at most 12 significant digits;
rounding is reported, while precision markers remain. No cooking-time or equipment
adjustments are inferred. A target equal to the source servings leaves output alone.

All four render formats accept scaling. Styled documents include the warnings;
other formats report them on stderr. Review these warnings before sharing output.
The source `.opensauce` and original-source payload remain unchanged.

## Reusable Core APIs

`renderHtmlDocument(recipe, options)` is pure document generation.
`scaleRecipeForRendering(recipe, servings)` returns a render-only recipe projection
and warnings; it retains authored `source`, and projected token spans must not be
used for source editing. `renderHtml` accepts an explicit raster `embeddedImages`
map, with data URLs restricted to the supported raster MIME types. Resource loading
lives in the CLI adapter, separate from parsing, reading and rendering. None of
these portable Core APIs requires CLI argument handling, terminal output or Bun.
