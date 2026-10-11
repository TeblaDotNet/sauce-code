import type { ConceptTarget, MeasurementObservation } from './enrichment.ts';
import { validReviewVersion } from './enrichment.ts';
export type MeasurementUnit = 'g' | 'mL' | 'cup' | 'tbsp' | 'tsp';
export interface MeasurementRequest {
  target: ConceptTarget; amount: number; from: MeasurementUnit; to: MeasurementUnit;
  condition?: string; product_scope?: string; approximate?: boolean;
  /** Explicit caller-supplied unit definitions. No locale-based cup assumption. */
  volume_definitions?: Partial<Record<'cup' | 'tbsp' | 'tsp', number>>;
}
export type MeasurementResult = { ok: true; value: number; unit: MeasurementUnit; approximate: boolean; observation?: string; bounds?: {lower: number; upper: number; basis: string} } |
  { ok: false; reason: 'invalid-request' | 'unknown-volume-unit' | 'no-applicable-record' | 'conflicting-records' };
const positive = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;
const sameTarget = (a: ConceptTarget, b: ConceptTarget) => a.kind === b.kind && a.id === b.id && JSON.stringify(a.parts ?? []) === JSON.stringify(b.parts ?? []);
/** Pure conversion over validated canonical observations. Legacy reference_density is deliberately not an input. */
export function convertIngredientMeasurement(observations: readonly MeasurementObservation[], request: MeasurementRequest): MeasurementResult {
  const {amount, from, to} = request;
  if (!Number.isFinite(amount) || amount < 0 || request.target.kind !== 'ingredient' || !request.target.id ||
      !['g', 'mL', 'cup', 'tbsp', 'tsp'].includes(from) || !['g', 'mL', 'cup', 'tbsp', 'tsp'].includes(to)) return {ok: false, reason: 'invalid-request'};
  if (from === 'g' && to === 'g') return {ok: true, value: amount, unit: 'g', approximate: request.approximate ?? false};
  if (from !== 'g' && to !== 'g') return {ok: false, reason: 'invalid-request'};
  const volumeUnit = from === 'g' ? to : from;
  const ml = volumeUnit === 'mL' ? 1 : request.volume_definitions?.[volumeUnit as 'cup' | 'tbsp' | 'tsp'];
  if (!positive(ml)) return {ok: false, reason: 'unknown-volume-unit'};
  const applicable = observations.filter(m => m?.target && sameTarget(m.target, request.target) && m.condition === request.condition &&
    (m.product_scope === undefined || m.product_scope === request.product_scope));
  // A second applicable observation is an unresolved selection decision, even if one is provisional.
  if (applicable.length > 1) return {ok: false, reason: 'conflicting-records'};
  const m = applicable[0];
  if (!m || !m.conversion_eligible || !validReviewVersion(m.review_version) || m.review_version < 1 ||
      m.unit !== 'g/mL' || !positive(m.value) || !positive(m.source_volume_ml)) return {ok: false, reason: 'no-applicable-record'};
  const value = from === 'g' ? amount / m.value / ml : amount * ml * m.value;
  if (!Number.isFinite(value)) return {ok: false, reason: 'invalid-request'};
  const result: Extract<MeasurementResult, {ok:true}> = {ok: true, value, unit: to, observation: m.id,
    approximate: !!request.approximate || m.approximate || m.uncertainty.basis.toLowerCase().startsWith('unknown') || m.uncertainty.lower !== undefined};
  const {lower, upper, basis} = m.uncertainty;
  if (lower !== undefined && upper !== undefined) result.bounds = from === 'g'
    ? {lower: amount / upper / ml, upper: amount / lower / ml, basis}
    : {lower: amount * ml * lower, upper: amount * ml * upper, basis};
  return result;
}
/** Deliberately modest display precision for approximate culinary values; arithmetic stays separate. */
export function formatMeasurement(result: Extract<MeasurementResult, {ok:true}>): string {
  return (result.approximate ? '~' : '') + String(result.approximate ? Number(result.value.toPrecision(2)) : result.value) + ' ' + result.unit;
}
