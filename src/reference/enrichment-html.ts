import { escapeHtml as escape, safeUrl } from '../renderer/html.ts';
import { editorialRoles, safeResourceUrl, safeHeroAsset } from '../vocabulary/enrichment.ts';
import type { ReferencePage } from './index.ts';
const titles: Record<string, string> = {summary:'about', types:'types', brands:'brands', purpose:'purpose', mechanism:'how it works', sensory:'flavour', uses:'uses', storage:'storage', judgement:'judgement', mistakes:'mistakes', selection:'selection', care:'care', context:'context', 'near-neighbours':'related'};
export const reviewBannerText = (v: number) => 'Version ' + v + ' — ' + (v < 1 ? 'machine generated, not yet human reviewed' : v === 1 ? 'human reviewed' : v === 2 ? 'in-depth human review' : 'expert reviewed');
const maturity = (v: number) => '<small class="ref-field-review">' + escape(reviewBannerText(v)) + '</small>';
const section = (title: string, body: string) => body ? '<section class="ref-enrichment"><h2 class="ref-section-heading">::' + escape(title) + '</h2>' + body + '</section>' : '';
export function renderReferenceEnrichment(page: ReferencePage, heroUrl?: (asset: string) => string | undefined): string {
  const e = page.enrichment;
  if (!e) return '';
  const fieldMaturity = (v: number) => v === e.review_version ? '' : maturity(v);
  const h = e.hero;
  const imageUrl = h && safeHeroAsset(h.asset) ? heroUrl?.(h.asset) : undefined;
  const hero = h && imageUrl && safeUrl(imageUrl) ? '<figure class="ref-hero"><img src="' + escape(imageUrl) + '" alt="' + escape(h.alt) + '" width="' + escape(String(h.width)) + '" height="' + escape(String(h.height)) + '" decoding="async">' +
    '<figcaption>' + (h.caption ? '<p>' + escape(h.caption) + '</p>' : '') + '<details><summary>Image credit and licence</summary><p>' + escape(h.attribution_text) + ' · ' +
    (safeResourceUrl(h.source_page) ? '<a href="' + escape(h.source_page) + '">Source image</a>' : 'Source image') + ' · ' +
    (safeResourceUrl(h.licence_url) ? '<a rel="license" href="' + escape(h.licence_url) + '">' + escape(h.licence) + '</a>' : escape(h.licence)) +
    '</p><p>' + escape(h.changes) + '</p></details></figcaption></figure>' : '';
  const link = (id: string) => {
    const r = page.resources?.find(r => r.id === id);
    return r ? (safeResourceUrl(r.url) ? '<a href="' + escape(r.url) + '">' + escape(r.title) + '</a>' : escape(r.title)) : escape(id);
  };
  const sources = (ids: readonly string[] = []) => ids.length ? '<details class="ref-block-sources"><summary>Sources</summary><p>' + ids.map(link).join('; ') + '</p></details>' : '';
  const editorial = [...(e.editorial ?? [])].sort((a,b) => editorialRoles.indexOf(a.role) - editorialRoles.indexOf(b.role));
  const blocks = editorialRoles.map(role => section(titles[role], editorial.filter(b => b.role === role)
    .map(b => '<p>' + escape(b.text) + '</p>' + sources(b.sources) + fieldMaturity(b.review_version)).join(''))).join('');
  const associations = (e.associations ?? []).map((a,i) => {
    const target = page.contextualLinks?.[i];
    // Projection URLs may use local paths, but never trust them as markup.
    const name = target?.name ?? a.target.id;
    const url = target?.url === undefined ? undefined : safeUrl(target.url);
    const linked = url ? '<a href="' + escape(url) + '">' + escape(name) + '</a>' : escape(name);
    return '<li>' + escape({'commonly-used-with':'Often paired with', 'used-for':'Useful for', 'contrast-with':'Compare with'}[a.relation]) + ': ' + linked +
      (a.note ? '<p>' + escape(a.note) + '</p>' : '') + sources(a.sources) + fieldMaturity(a.review_version) + '</li>';
  }).join('');
  const measurements = (e.measurements ?? []).map(m => {
    const explanation = m.conversion_eligible ? 'Available for conversion when the measuring method and units match.' :
      !m.source_volume_ml ? 'Not currently used for automatic conversion because the source does not define ' + (/\bcup\b/i.test(m.original) ? 'the cup volume.' : 'the source volume in mL.') :
      'Not currently used for automatic conversion; this observation still needs review.';
    return '<li><h3>' + escape(m.condition.charAt(0).toUpperCase() + m.condition.slice(1) + ' ' + page.name) + '</h3>' +
      '<p>Published reference: ' + escape(m.original) + '</p><p class="ref-measure-status">' + (m.conversion_eligible ? '' : 'Provisional reference. ') + explanation + '</p>' +
      fieldMaturity(m.review_version) + '<details class="ref-measure-details"><summary>Measurement source and details</summary>' +
      (m.product_scope ? '<p>Product scope: ' + escape(m.product_scope) + '</p>' : '') +
      (m.value !== undefined ? '<p>Culinary / bulk density: ' + (m.approximate ? '~' : '') + escape(String(m.value)) + ' g/mL</p>' : '') +
      '<p>Normalisation: ' + escape(m.normalisation) + '</p><p>Uncertainty: ' + escape(m.uncertainty.basis) +
      (m.uncertainty.lower !== undefined ? ' (' + escape(String(m.uncertainty.lower)) + '–' + escape(String(m.uncertainty.upper)) + ' g/mL)' : '') + '</p>' +
      (m.reference_temperature_c !== undefined ? '<p>Source reference temperature: ' + escape(String(m.reference_temperature_c)) + ' °C</p>' : '') +
      sources([m.source]) + (m.locator ? '<p>Source location: ' + escape(m.locator) + '</p>' : '') +
      (m.accessed ? '<p>Accessed: ' + escape(m.accessed) + '</p>' : '') + maturity(m.review_version) + '</details></li>';
  }).join('');
  const learning = [...(e.resources ?? [])].sort((a,b) => a.order - b.order).map(a => '<li>' + link(a.resource) + ' · ' + escape(a.role.replaceAll('-', ' ')) +
    (a.note ? '<p>' + escape(a.note) + '</p>' : '') + fieldMaturity(a.review_version) + '</li>').join('');
  const registry = (page.resources ?? []).map(r => '<li><details><summary>' + escape(r.title) + ' · ' + escape(r.publisher) + '</summary><p>' + link(r.id) + ' · ' + escape(r.type) + '</p>' +
    '<p>Checked ' + escape(r.checked_at) + ' · ' + escape(r.review_scope) +
    (r.type === 'video' ? (r.duration_seconds === undefined ? ' · duration unknown' : ' · ' + escape(String(r.duration_seconds)) + ' seconds') : '') + '</p>' +
    (r.commercial_context ? '<p>' + escape(r.commercial_context) + '</p>' : '') + (r.notes ? '<p>' + escape(r.notes) + '</p>' : '') + '</details></li>').join('');
  return '<aside class="ref-content-review" aria-label="Review maturity"><strong>' + escape(reviewBannerText(e.review_version)) + '</strong></aside>' + hero + blocks +
    section('connections', associations ? '<ul>' + associations + '</ul>' : '') +
    section('measure', measurements ? '<ul>' + measurements + '</ul>' : '') +
    section('learn', learning ? '<ul class="ref-learning">' + learning + '</ul>' : '') +
    section('sources', registry ? '<ul>' + registry + '</ul>' : '');
}
