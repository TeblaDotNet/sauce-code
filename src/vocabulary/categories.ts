/** Structural provider contract. Labels, descriptions and memberships belong to the provider. */
export type BrowsingDomain = 'ingredient'|'process'|'equipment';
export type BrowsingCategoryId = string;
export type ProcessCategory = string;
export type BrowsingTaxonomy = Record<BrowsingDomain, readonly (readonly [string,string,string])[]>;
/** Historical identifiers only, retained for compatibility validation; no editorial display data. */
export const browsingCompatibilityIds = {
  "ingredient": [
    "produce",
    "meat-and-poultry",
    "fish-and-seafood",
    "dairy-and-eggs",
    "grains-and-flours",
    "pulses",
    "nuts-and-seeds",
    "herbs-and-spices",
    "fats-and-oils",
    "sugars-and-sweeteners",
    "sauces-and-condiments",
    "fermented-foods",
    "baking-ingredients",
    "beverages",
    "pantry-products"
  ],
  "process": [
    "preparation-and-cutting",
    "mixing-and-emulsifying",
    "coating-and-breading",
    "dry-heat-cooking",
    "moist-heat-cooking",
    "frying",
    "baking-and-pastry",
    "preservation-and-fermentation",
    "fire-and-smoke",
    "beverage-and-bar",
    "modernist",
    "general-cooking"
  ],
  "equipment": [
    "knives-and-cutting",
    "preparation-tools",
    "cookware",
    "bakeware",
    "measuring",
    "mixing",
    "appliances",
    "preservation-and-fermentation",
    "coffee-and-bar",
    "storage-and-containers",
    "tableware-and-serving",
    "fuel-and-smoking-materials"
  ]
} as const;
export const processCategories = [...browsingCompatibilityIds.process];
/** Canonical-only default: no implicit editorial taxonomy. */
export const browsingCategoryRegistry: BrowsingTaxonomy = {ingredient:[],process:[],equipment:[]};
export function validateBrowsingTaxonomy(value: unknown): asserts value is BrowsingTaxonomy {
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join(',')!=='equipment,ingredient,process')throw Error('Invalid browsing taxonomy');
 for(const kind of ['ingredient','process','equipment'] as const){const rows=(value as BrowsingTaxonomy)[kind];if(!Array.isArray(rows))throw Error('Invalid browsing taxonomy');const seen=new Set();for(const row of rows){if(!Array.isArray(row)||row.length!==3||row.some(x=>typeof x!=='string'||!x.trim())||!(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/).test(row[0])||seen.has(row[0]))throw Error('Invalid browsing taxonomy');seen.add(row[0]);}}
}
export function browsingCategories(kind: BrowsingDomain,membership?:readonly string[],taxonomy:BrowsingTaxonomy=browsingCategoryRegistry){return taxonomy[kind].filter(([id])=>membership===undefined||membership.includes(id)).map(([id,name,description])=>({id,name,description}));}
export function validateBrowsingCategories(kind: BrowsingDomain,value:unknown,id:string,taxonomy?:BrowsingTaxonomy):void {
 if(value===undefined)return;
 const allowed:readonly string[]=taxonomy?taxonomy[kind].map(r=>r[0]):browsingCompatibilityIds[kind];
 if(!Array.isArray(value)||value.some(c=>typeof c!=='string'||!allowed.includes(c))||new Set(value).size!==value.length)throw Error('Invalid browsing categories on '+kind+':'+id);
}
