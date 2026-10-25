import type { Node, Recipe } from './model/index.ts';
import { createReadingModel, servingScale, scaleReaderQuantity, methodScalingWarning } from './reading.ts';

/** Render-only projection. Authored source remains intact; projected token spans are not editing offsets. */
export function scaleRecipeForRendering(recipe: Recipe, servings: number): { recipe: Recipe; warnings: string[] } {
  const model = createReadingModel(recipe);
  if (!model.serves) throw Error('Scaling requires one positive numeric serves value and a supported ingredient quantity.');
  const factor = servingScale(model.serves, servings);
  if (factor === 1) return { recipe, warnings: [] };
  const amounts = new Map(model.amounts.map(a => [a.id, a]));
  const warnings = [methodScalingWarning, 'Only supported ingredient declarations are scaled. Instruction quantities, choices with inline amounts and other unsupported expressions remain authored; review them before cooking.'];
  const visit = (nodes: Node[], ingredients: boolean): Node[] => nodes.map(n => {
    if (n.kind === 'group') return { ...n, children: visit(n.children, ingredients) };
    if (n.kind !== 'statement') return n;
    const a = amounts.get(n.id);
    if (!a) {
      if (ingredients && n.tokens.some(t => t.kind === 'thing')) warnings.push('Unscaled ingredient expression: ' + n.tokens.map(t => t.raw).join('').trim());
      return { ...n, children: visit(n.children, ingredients) };
    }
    const q = scaleReaderQuantity(a.quantity, factor);
    // Preserve the authored unit spelling and precision marker; never convert units.
    const m = a.quantity.source.match(/^(!|~~|~)?\s*\d+(?:\.\d+)?(?:\s+\d+\/\d+|\/\d+)?\s*(.*?)\s*$/)!;
    const value = Number(q.amount.toPrecision(12));
    if (value !== q.amount) warnings.push('Rounded scaled display for ' + a.name + '; original quantity remains in the source.');
    const raw = (m[1] ?? '') + value + (m[2] ? ' ' + m[2] : '');
    const headIndex = n.tokens.findIndex(t => t.kind === 'thing');
    const head = n.tokens[headIndex];
    return { ...n, tokens: [...n.tokens.slice(0, headIndex + 1), { kind: 'text' as const, raw: ' ' + raw, span: head.span }],
      quantities: undefined, children: visit(n.children, ingredients) };
  });
  return { recipe: { ...recipe, preamble: visit(recipe.preamble, false), sections: recipe.sections.map(s => ({ ...s,
    children: visit(s.children, s.name === 'ingredients').map(n => s.name === 'recipe' && n.kind === 'metadata' && n.key === 'serves' ? { ...n, value: String(servings) } : n)
  })) }, warnings };
}
