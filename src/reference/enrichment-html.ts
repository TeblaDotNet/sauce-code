import { escapeHtml as escape, safeUrl } from '../renderer/html.ts';
import { editorialRoles, reviewVersionLabel, safeResourceUrl } from '../vocabulary/enrichment.ts';
import type { ReferencePage } from './index.ts';
const titles: Record<string, string> = {summary:'About', purpose:'Purpose', mechanism:'How it works', sensory:'Flavour and texture', uses:'Typical uses', storage:'Storage', judgement:'Judgement cues', mistakes:'Common mistakes', selection:'Choosing and alternatives', care:'Care', context:'Context and scope', 'near-neighbours':'Related but different'};
const maturity = (v: number) => '<small>Content review ' + escape(String(v)) + ' · ' + escape(reviewVersionLabel(v)) + '</small>';
const section = (title: string, body: string) => body ? '<section class="ref-enrichment"><h2>' + escape(title) + '</h2>' + body + '</section>' : '';
export function renderReferenceEnrichment(page: ReferencePage): string {
  const e = page.enrichment;
  if (!e) return '';
  const link = (id: string) => {
    const r = page.resources?.find(r => r.id === id);
    return r ? (safeResourceUrl(r.url) ? '<a href="' + escape(r.url) + '">' + escape(r.title) + '</a>' : escape(r.title)) : escape(id);
  };
  const sources = (ids: readonly string[] = []) => ids.length ? '<p class="ref-source">Sources: ' + ids.map(link).join('; ') + '</p>' : '';
  const editorial = [...(e.editorial ?? [])].sort((a,b) => editorialRoles.indexOf(a.role) - editorialRoles.indexOf(b.role));
  const blocks = editorialRoles.map(role => section(titles[role], editorial.filter(b => b.role === role)
    .map(b => '<p>' + escape(b.text) + '</p>' + sources(b.sources) + maturity(b.review_version)).join(''))).join('');
  const associations = (e.associations ?? []).map((a,i) => {
    const target = page.contextualLinks?.[i];
    // Projection URLs may use local paths, but never trust them as markup.
    const name = target?.name ?? a.target.id;
    const url = target?.url === undefined ? undefined : safeUrl(target.url);
    const linked = url ? '<a href="' + escape(url) + '">' + escape(name) + '</a>' : escape(name);
    return '<li>' + escape(a.relation.replaceAll('-', ' ')) + ': ' + linked +
      (a.note ? '<p>' + escape(a.note) + '</p>' : '') + sources(a.sources) + maturity(a.review_version) + '</li>';
  }).join('');
  const measurements = (e.measurements ?? []).map(m => '<li><strong>' + escape(m.condition) + '</strong> · ' +
    (m.conversion_eligible ? 'Eligible observation; conversion still requires an applicable target, condition and defined unit.' : 'Provisional evidence — not eligible for automatic conversion.') +
    '<p>Original observation: ' + escape(m.original) + '</p>' +
    (m.product_scope ? '<p>Product scope: ' + escape(m.product_scope) + '</p>' : '') +
    (m.value !== undefined ? '<p>Culinary / bulk density: ' + (m.approximate ? '~' : '') + escape(String(m.value)) + ' g/mL</p>' : '') +
    '<p>Normalisation: ' + escape(m.normalisation) + '</p><p>Uncertainty: ' + escape(m.uncertainty.basis) +
    (m.uncertainty.lower !== undefined ? ' (' + escape(String(m.uncertainty.lower)) + '–' + escape(String(m.uncertainty.upper)) + ' g/mL)' : '') + '</p>' +
    (m.reference_temperature_c !== undefined ? '<p>Source reference temperature: ' + escape(String(m.reference_temperature_c)) + ' °C</p>' : '') +
    sources([m.source]) + (m.locator ? '<p>Source location: ' + escape(m.locator) + '</p>' : '') +
    (m.accessed ? '<p>Accessed: ' + escape(m.accessed) + '</p>' : '') + maturity(m.review_version) + '</li>').join('');
  const learning = [...(e.resources ?? [])].sort((a,b) => a.order - b.order).map(a => '<li>' + link(a.resource) + ' · ' + escape(a.role.replaceAll('-', ' ')) +
    (a.note ? '<p>' + escape(a.note) + '</p>' : '') + maturity(a.review_version) + '</li>').join('');
  const registry = (page.resources ?? []).map(r => '<li>' + link(r.id) + ' · ' + escape(r.publisher) + ' · ' + escape(r.type) +
    '<p>Checked ' + escape(r.checked_at) + ' · ' + escape(r.review_scope) +
    (r.type === 'video' ? (r.duration_seconds === undefined ? ' · duration unknown' : ' · ' + escape(String(r.duration_seconds)) + ' seconds') : '') + '</p>' +
    (r.commercial_context ? '<p>' + escape(r.commercial_context) + '</p>' : '') + (r.notes ? '<p>' + escape(r.notes) + '</p>' : '') + '</li>').join('');
  return '<p class="ref-content-review">' + maturity(e.review_version) + ' (enrichment only; canonical identity review is separate)</p>' + blocks +
    section('Contextual associations', associations ? '<p>Discovery links, not identity, required equipment, substitutions or inferred recipe usage.</p><ul>' + associations + '</ul>' : '') +
    section('Measurement observations', measurements ? '<ul>' + measurements + '</ul>' : '') +
    section('Learning resources', learning ? '<ul>' + learning + '</ul>' : '') +
    section('Source details', registry ? '<ul>' + registry + '</ul>' : '');
}
