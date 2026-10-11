import type { Provenance } from './knowledge.ts';
export interface ExactIngredientName { name: string; locale?: string; scope?: string; sources?: Provenance[] }
export const regionalRelations = ['exact', 'broader', 'narrower', 'overlapping', 'approximate-equivalent'] as const;
/** Descriptive/research relationships, never resolver aliases. Direction is from this entry to the target. */
export interface RegionalMapping extends ExactIngredientName { relation: typeof regionalRelations[number]; target?: string }
export interface CanonicalIngredientTarget { ingredient: string; parts: string[] }
export function validLocale(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim() || value !== value.trim()) return false;
  try { return Intl.getCanonicalLocales(value).length === 1; } catch { return false; }
}
export function matchesLocale(scoped: string | undefined, authored: string | undefined): boolean {
  if (!scoped || !authored) return true;
  if (!validLocale(authored)) return false;
  const scope = Intl.getCanonicalLocales(scoped)[0].toLowerCase();
  const locale = Intl.getCanonicalLocales(authored)[0].toLowerCase();
  return locale === scope || locale.startsWith(scope + '-');
}
/** Validate optional records at the data boundary, including provenance retained for editorial review. */
export function validateNames(value: unknown, mappings = false): void {
  if (!Array.isArray(value)) throw new Error('Ingredient names/mappings must be arrays');
  const text = (v: unknown) => typeof v === 'string' && !!v.trim();
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item) || !text(item.name) ||
        (!mappings && (item.relation !== undefined || item.target !== undefined)) ||
        (item.locale !== undefined && !validLocale(item.locale)) ||
        (item.scope !== undefined && !text(item.scope)) ||
        (mappings && (!regionalRelations.includes(item.relation) || (item.target !== undefined && !text(item.target)))))
      throw new Error('Invalid ingredient name/mapping');
    if (item.sources !== undefined && (!Array.isArray(item.sources) || item.sources.some((s: Record<string, unknown>) =>
      !s || typeof s !== 'object' || !text(s.citation) || ['url', 'accessed', 'note'].some(k => s[k] !== undefined && !text(s[k])))))
      throw new Error('Invalid ingredient name/mapping provenance');
  }
}
