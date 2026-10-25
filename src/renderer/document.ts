import type { Recipe } from '../model/index.ts';
import { escapeHtml, renderHtml, type HtmlRenderOptions } from './html.ts';

export interface HtmlDocumentOptions extends HtmlRenderOptions {
  theme?: 'light' | 'dark' | 'auto';
  /** Plain text notices, e.g. partial scaling or unavailable images. */
  notices?: readonly string[];
}
const light = 'color-scheme:light;--paper:#faf9f6;--ink:#262825;--muted:#62685f;--line:#d3d8cf;--ingredient:#286736;--equipment:#355a9c;--process:#8c403b;--result:#75528d;--value:#805b20';
const dark = 'color-scheme:dark;--paper:#212420;--ink:#e8ece5;--muted:#b4bdaf;--line:#51594d;--ingredient:#afd49a;--equipment:#adc8ed;--process:#efb5a9;--result:#d3b8e8;--value:#e1cf91';
/** Offline document shell; no filesystem, CLI, runtime or browser dependency. */
export function renderHtmlDocument(recipe: Recipe, options: HtmlDocumentOptions = {}): string {
  const theme = options.theme ?? 'auto';
  if (!['light', 'dark', 'auto'].includes(theme)) throw Error('Unknown document theme');
  const titleNode = recipe.sections.filter(s => s.name === 'recipe').flatMap(s => s.children)
    .find(n => n.kind === 'metadata' && n.key === 'name');
  const title = titleNode?.kind === 'metadata' ? titleNode.value : 'Recipe';
  const css = `:root{${theme === 'dark' ? dark : light}}
${theme === 'auto' ? '@media(prefers-color-scheme:dark){:root{' + dark + '}}' : ''}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:1rem/1.65 system-ui,sans-serif}
main{max-width:52rem;margin:auto;padding:clamp(1rem,4vw,3rem);overflow-wrap:anywhere}
h1{font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.2;letter-spacing:-.035em}h2{font-size:1.25rem;margin-top:2rem;border-bottom:1px solid var(--line);padding-bottom:.4rem}
a{color:inherit;text-underline-offset:.2em}li{margin:.5rem 0}.os-image{display:block;max-width:100%;height:auto;max-height:32rem;object-fit:contain;margin:1rem 0}
.os-metadata{font-size:.9rem}.os-metadata dt{color:var(--muted)}.os-metadata dd{margin:0 0 .6rem}.os-comment,.os-notice{border-left:2px solid var(--line);padding-left:1rem;color:var(--muted)}
.os-group{margin:1rem 0;padding-left:1rem;border-left:2px solid var(--line)}pre{white-space:pre-wrap}.os-view-code{font-family:ui-monospace,monospace}
.os-ingredient{color:var(--ingredient)}.os-equipment{color:var(--equipment)}.os-process{color:var(--process)}.os-result{color:var(--result)}.os-syntax-value{color:var(--value)}
@media print{body{background:white;color:black}main{max-width:none;padding:0}.os-image{max-height:20rem}}`;
  return '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + escapeHtml(title) + '</title><style>' + css + '</style></head><body><main>' +
    (options.notices ?? []).map(n => '<p class="os-notice">' + escapeHtml(n) + '</p>').join('') +
    renderHtml(recipe, { ...options, view: options.view ?? 'compact' }) + '</main></body></html>\n';
}
