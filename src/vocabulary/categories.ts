/** Cook-facing discovery groups. Order is editorial; membership has no semantic effect. */
export const browsingCategoryRegistry = {
  ingredient: [
    ['produce','Produce','Fruit, vegetables, mushrooms and other fresh produce.'],
    ['meat-and-poultry','Meat & poultry','Meat, poultry and familiar meat products.'],
    ['fish-and-seafood','Fish & seafood','Fish, shellfish and seafood ingredients.'],
    ['dairy-and-eggs','Dairy & eggs','Milk products, cheeses and eggs.'],
    ['grains-and-flours','Grains & flours','Grains, flours, breads, pasta and noodles.'],
    ['pulses','Pulses','Beans, peas and lentils used as pulses.'],
    ['nuts-and-seeds','Nuts & seeds','Culinary nuts, edible seeds and their pastes.'],
    ['herbs-and-spices','Herbs & spices','Herbs, spices and seasoning blends.'],
    ['fats-and-oils','Fats & oils','Cooking fats, oils and spreads.'],
    ['sugars-and-sweeteners','Sugars & sweeteners','Sugars, syrups and other sweetening ingredients.'],
    ['sauces-and-condiments','Sauces & condiments','Sauces, pastes, dressings and table condiments.'],
    ['fermented-foods','Fermented foods','Familiar fermented foods and fermentation starters.'],
    ['baking-ingredients','Baking ingredients','Flours, leaveners, pastry and other baking staples.'],
    ['beverages','Beverages','Drinks and ingredients commonly used to make them.'],
    ['pantry-products','Pantry products','Prepared staples, stocks and other cupboard ingredients.']
  ],
  process: [
    ['preparation-and-cutting','Preparation & knife skills','Cutting, cleaning and preparing ingredients.'],
    ['mixing-and-emulsifying','Mixing & aeration','Combining mixtures, forming emulsions and incorporating air.'],
    ['coating-and-breading','Coating & breading','Covering food with a coating, glaze or crumbs.'],
    ['dry-heat-cooking','Dry-heat cooking','Cooking and browning with dry heat.'],
    ['moist-heat-cooking','Moist-heat cooking','Cooking with liquid or steam.'],
    ['frying','Frying','Cooking in hot fat, from shallow to deep frying.'],
    ['baking-and-pastry','Baking & pastry','Dough, pastry and baking techniques.'],
    ['preservation-and-fermentation','Preservation & fermentation','Drying, curing, pickling and fermentation methods.'],
    ['fire-and-smoke','Fire & smoke','Cooking over fire and working with smoke.'],
    ['beverage-and-bar','Beverage & bar','Preparing and mixing drinks.'],
    ['modernist','Modernist','Techniques using closely controlled or specialised processes.'],
    ['general-cooking','General cooking','Everyday handling, heating and finishing actions.']
  ],
  equipment: [
    ['knives-and-cutting','Knives & cutting','Knives, cutting surfaces and slicing tools.'],
    ['preparation-tools','Preparation tools','Hand tools and utensils for preparing food.'],
    ['cookware','Cookware','Pans, pots and vessels used for cooking.'],
    ['bakeware','Bakeware','Tins, trays and tools used in baking.'],
    ['measuring','Measuring','Tools for measuring quantities and temperature.'],
    ['mixing','Mixing','Tools and appliances for combining ingredients.'],
    ['appliances','Appliances','Powered kitchen equipment and cooking appliances.'],
    ['preservation-and-fermentation','Preservation & fermentation','Equipment used for fermenting, preserving and storing preparations.'],
    ['coffee-and-bar','Coffee & bar','Tools for coffee, tea and mixed drinks.'],
    ['storage-and-containers','Storage & containers','Containers, covers and wrapping for food.'],
    ['tableware-and-serving','Tableware & serving','Objects used for serving and eating; no heat resistance is implied.'],
    ['fuel-and-smoking-materials','Fuel & smoking materials','Materials used to provide cooking heat or smoke; not ingredient equivalents.']
  ]
} as const;
export type BrowsingDomain = keyof typeof browsingCategoryRegistry;
export type BrowsingCategoryId = typeof browsingCategoryRegistry[BrowsingDomain][number][0];
export type ProcessCategory = typeof browsingCategoryRegistry.process[number][0];
/** Retained API and IDs from the initial process tranche. */
export const processCategories = browsingCategoryRegistry.process.map(([id]) => id);
export function browsingCategories(kind: BrowsingDomain, membership?: readonly string[]) {
  return browsingCategoryRegistry[kind].filter(([id]) => membership === undefined || membership.includes(id))
    .map(([id,name,description]) => ({id,name,description}));
}
export function validateBrowsingCategories(kind: BrowsingDomain, value: unknown, id: string): void {
  if (value === undefined) return;
  const allowed = browsingCategories(kind).map(c => c.id as string);
  if (!Array.isArray(value) || value.some(c => typeof c !== 'string' || !allowed.includes(c)) || new Set(value).size !== value.length)
    throw new Error('Invalid browsing categories on ' + kind + ':' + id);
}
