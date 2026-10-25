import { Vocabulary } from './index.ts';
import type { ConceptTarget, EnrichmentData, Review } from './enrichment.ts';
import { validReviewVersion } from './enrichment.ts';
import type { QuantitativeKnowledge } from './knowledge.ts';
import { validateIngredientKnowledge } from './knowledge.ts';

/** Explicit offline input. No provider discovery, network access or CLI default. */
export interface KnowledgeSnapshot extends EnrichmentData {
  schemaVersion: 1;
  provider: { id: string; version: string; sourceRevision: string };
  vocabulary: { digest: string; revision?: string };
  quantities?: readonly (Review & { target: ConceptTarget; values: QuantitativeKnowledge })[];
}
const object = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && !!v.trim();
function keys(value: Record<string, any>, allowed: readonly string[]) {
  if (Object.keys(value).some(k => !allowed.includes(k))) throw Error('Unknown knowledge snapshot field');
}
/** The caller supplies its pinned canonical digest; absence of a snapshot is valid. */
export function validateKnowledgeSnapshot(value: unknown, vocabulary: Vocabulary, expectedDigest: string): asserts value is KnowledgeSnapshot {
  if (!object(value) || value.schemaVersion !== 1) throw Error('Unsupported knowledge snapshot');
  keys(value, ['schemaVersion','provider','vocabulary','resources','enrichments','quantities']);
  if (!object(value.provider) || !['id','version','sourceRevision'].every(k => text(value.provider[k]))) throw Error('Invalid provider identity');
  keys(value.provider, ['id','version','sourceRevision']);
  if (!object(value.vocabulary) || !/^[a-f0-9]{64}$/.test(expectedDigest) || value.vocabulary.digest !== expectedDigest ||
      (value.vocabulary.revision !== undefined && !text(value.vocabulary.revision))) throw Error('Incompatible vocabulary digest');
  keys(value.vocabulary, ['digest','revision']);
  // Reuse canonical-target, source, review, media and measurement eligibility checks.
  new Vocabulary(vocabulary.entries, value);
  if (value.quantities !== undefined && !Array.isArray(value.quantities)) throw Error('Invalid quantitative records');
  const seen = new Set<string>();
  for (const q of value.quantities ?? []) {
    if (!object(q) || !object(q.target) || !object(q.values) || !validReviewVersion(q.review_version) ||
        (q.reviewed_at !== undefined && (typeof q.reviewed_at !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(q.reviewed_at) ||
         !Number.isFinite(Date.parse(q.reviewed_at)) || new Date(q.reviewed_at).toISOString().slice(0,10) !== q.reviewed_at))) throw Error('Invalid quantitative review');
    keys(q, ['target','values','review_version','reviewed_at']); keys(q.target, ['kind','id','parts']);
    const target = q.target;
    if (target.kind !== 'ingredient' || typeof target.id !== 'string' || (target.parts !== undefined &&
        (!Array.isArray(target.parts) || target.parts.some((p: unknown) => !text(p))))) throw Error('Invalid quantitative target');
    const matches = vocabulary.entries.filter(e => e.kind === target.kind && e.id === target.id);
    if (matches.length !== 1 || matches[0].canonical_target) throw Error('Invalid quantitative target');
    if (target.parts?.length) {
      const resolved = vocabulary.resolvePartPath(target.id, target.parts);
      if (!resolved.complete || JSON.stringify(resolved.ids) !== JSON.stringify(target.parts)) throw Error('Invalid quantitative part');
    }
    const key = JSON.stringify([target.kind,target.id,target.parts ?? []]);
    if (seen.has(key)) throw Error('Duplicate quantitative target'); seen.add(key);
    keys(q.values, ['typical_mass','reference_density','nutrition']);
    validateIngredientKnowledge(q.values, key);
  }
}
