/** Reference enrichment is separate from canonical identity and resolver data. */
export const editorialRoles = ['summary', 'purpose', 'mechanism', 'sensory', 'uses', 'storage', 'judgement', 'mistakes', 'selection', 'care', 'context', 'near-neighbours'] as const;
export const resourceRoles = ['introduction', 'technique-demonstration', 'deeper-explanation', 'specialist-reference', 'maintenance', 'measurement-reference'] as const;
export const associationRelations = ['commonly-used-with', 'used-for', 'contrast-with'] as const;
export interface Review { review_version: number; reviewed_at?: string }
export interface ConceptTarget { kind: 'ingredient' | 'process' | 'equipment'; id: string; parts?: string[] }
export interface EditorialBlock extends Review { id: string; role: typeof editorialRoles[number]; text: string; sources?: string[] }
export interface ExternalResource {
  id: string; title: string; url: string; publisher: string;
  type: 'article' | 'reference' | 'video' | 'tutorial';
  checked_at: string;
  review_scope: 'text' | 'landing-page' | 'video-watched';
  duration_seconds?: number;
  commercial_context?: string; notes?: string;
}
export interface ResourceAttachment extends Review {
  resource: string; role: typeof resourceRoles[number]; order: number; note?: string;
}
export interface ContextualAssociation extends Review {
  relation: typeof associationRelations[number]; target: ConceptTarget; note?: string; sources?: string[];
}
export interface MeasurementObservation extends Review {
  id: string; target: ConceptTarget; product_scope?: string;
  /** Measuring method, not an ingredient preparation state. */
  condition: string;
  original: string; source: string; locator?: string; accessed?: string;
  unit: 'g/mL'; value?: number; approximate: boolean;
  uncertainty: { basis: string; lower?: number; upper?: number };
  reference_temperature_c?: number;
  normalisation: string;
  /** Defined source-volume basis, required even when the original source unit was mL. */
  source_volume_ml?: number;
  conversion_eligible: boolean;
}
export interface ReferenceEnrichment extends Review {
  target: ConceptTarget;
  editorial?: EditorialBlock[];
  resources?: ResourceAttachment[];
  associations?: ContextualAssociation[];
  measurements?: MeasurementObservation[];
}
export interface EnrichmentData {
  resources?: readonly ExternalResource[];
  enrichments?: readonly ReferenceEnrichment[];
}
export function validReviewVersion(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) &&
    ((value >= 0 && value < 1) || value === 1 || value === 2 || value === 3);
}
export function reviewVersionLabel(value: number): string {
  return value < 1 ? 'Draft / generated' : value === 1 ? 'Reviewed' : value === 2 ? 'Deep reviewed' : 'Expert / mature';
}
export function safeResourceUrl(value: unknown): value is string {
  if (typeof value !== 'string' || /[\s\u0000-\u001f\u007f\\]/.test(value)) return false;
  try { const url = new URL(value); return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password; } catch { return false; }
}
const record = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && !!v.trim();
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const positive = (v: unknown): v is number => finite(v) && v > 0;
const date = (v: unknown) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const fail = (message: string): never => { throw new Error('Invalid reference enrichment: ' + message); };
function review(v: Record<string, any>) {
  if (!validReviewVersion(v.review_version) || (v.reviewed_at !== undefined && !date(v.reviewed_at))) fail('review_version / reviewed_at');
}
function optionalText(v: Record<string, any>, keys: string[]) {
  for (const k of keys) if (v[k] !== undefined && !text(v[k])) fail(k);
}
function array(v: unknown): any[] { if (!Array.isArray(v)) fail('expected array'); return v as any[]; }
function unique(values: string[], label: string) { if (new Set(values).size !== values.length) fail('duplicate ' + label); }
/** Validate evidence and links after canonical entries exist. No identity mutation. */
export function validateEnrichment(data: EnrichmentData, validTarget: (target: ConceptTarget) => boolean): void {
  const resources = array(data.resources ?? []);
  unique(resources.map(r => r?.id), 'resource ID');
  const resourceIds = new Set<string>();
  for (const r of resources) {
    if (!record(r) || !text(r.id) || !text(r.title) || !text(r.publisher) || !safeResourceUrl(r.url) ||
      !['article', 'reference', 'video', 'tutorial'].includes(r.type) || !date(r.checked_at) ||
      !['text', 'landing-page', 'video-watched'].includes(r.review_scope)) fail('resource');
    if (r.duration_seconds !== undefined && (r.type !== 'video' || !positive(r.duration_seconds))) fail('video duration');
    if (r.review_scope === 'video-watched' && r.type !== 'video') fail('video review scope');
    optionalText(r, ['commercial_context', 'notes']); resourceIds.add(r.id);
  }
  const source = (id: unknown) => { if (!text(id) || !resourceIds.has(id)) fail('source reference'); };
  const sources = (v: unknown) => { if (v !== undefined) for (const id of array(v)) source(id); };
  const target = (v: unknown) => {
    if (!record(v) || !['ingredient', 'process', 'equipment'].includes(v.kind) || !text(v.id) ||
      (v.parts !== undefined && (!Array.isArray(v.parts) || v.parts.some((p: unknown) => !text(p)))) || !validTarget(v as ConceptTarget)) fail('canonical target');
  };
  const enrichments = array(data.enrichments ?? []);
  unique(enrichments.map(e => JSON.stringify([e?.target?.kind, e?.target?.id, e?.target?.parts ?? []])), 'enrichment target');
  for (const e of enrichments) {
    if (!record(e)) fail('entry'); review(e); target(e.target);
    if (e.target.parts?.length) fail('entry enrichment must target a whole concept');
    const blocks = e.editorial === undefined ? [] : array(e.editorial);
    unique(blocks.map(b => b?.id), 'editorial block ID');
    for (const b of blocks) {
      if (!record(b) || !text(b.id) || !editorialRoles.includes(b.role) || !text(b.text)) fail('editorial block');
      review(b); sources(b.sources);
    }
    for (const a of e.resources === undefined ? [] : array(e.resources)) {
      if (!record(a) || !resourceRoles.includes(a.role) || !Number.isInteger(a.order) || a.order < 0) fail('resource attachment');
      review(a); source(a.resource); optionalText(a, ['note']);
    }
    for (const a of e.associations === undefined ? [] : array(e.associations)) {
      if (!record(a) || !associationRelations.includes(a.relation)) fail('association');
      review(a); target(a.target); sources(a.sources); optionalText(a, ['note']);
    }
    const observations = e.measurements === undefined ? [] : array(e.measurements);
    unique(observations.map(m => m?.id), 'measurement ID');
    for (const m of observations) {
      if (!record(m)) fail('measurement'); review(m); target(m.target); source(m.source);
      if (e.target.kind !== 'ingredient' || m.target.kind !== 'ingredient' || m.target.id !== e.target.id ||
        !text(m.id) || !text(m.condition) || !text(m.original) || !text(m.normalisation) || m.unit !== 'g/mL' ||
        typeof m.approximate !== 'boolean' || typeof m.conversion_eligible !== 'boolean' ||
        !record(m.uncertainty) || !text(m.uncertainty.basis)) fail('measurement observation');
      optionalText(m, ['product_scope', 'locator']);
      if (m.accessed !== undefined && !date(m.accessed)) fail('measurement accessed');
      if (m.value !== undefined && !positive(m.value)) fail('density value');
      if (m.source_volume_ml !== undefined && !positive(m.source_volume_ml)) fail('source volume');
      if (m.reference_temperature_c !== undefined && (!finite(m.reference_temperature_c) || m.reference_temperature_c < -273.15)) fail('reference temperature');
      const {lower, upper} = m.uncertainty;
      if (lower !== undefined || upper !== undefined) {
        if (!positive(lower) || !positive(upper) || lower > upper || !positive(m.value) || m.value < lower || m.value > upper || m.uncertainty.basis.toLowerCase().startsWith('unknown')) fail('density bounds');
      }
      if (m.conversion_eligible && (m.review_version < 1 || !positive(m.value) || !positive(m.source_volume_ml))) fail('unapproved or incomplete conversion record');
    }
  }
}
