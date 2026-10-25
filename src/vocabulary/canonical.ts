import type { VocabularyEntry } from './index.ts';
import type { IngredientKnowledge } from './knowledge.ts';

/** Opt-in runtime projection, not a source-document migration or lossless serializer. */
export function canonicalEntry(entry: VocabularyEntry): VocabularyEntry {
  const copy = structuredClone(entry);
  // These are discovery/comparison data, never resolver predicates.
  delete copy.categories;
  delete copy.regional_mappings;
  const strip = (value: IngredientKnowledge) => {
    delete value.typical_mass; delete value.reference_density; delete value.nutrition;
    for (const group of Object.values(value.part_groups ?? {})) {
      delete group.description; delete group.sources;
    }
    for (const part of Object.values(value.parts ?? {})) strip(part);
  };
  strip(copy);
  // Keep reference, concise scope, identity evidence and curation as transitional
  // compatibility metadata: token links, editor ranking and diagnostics must agree.
  return copy;
}
