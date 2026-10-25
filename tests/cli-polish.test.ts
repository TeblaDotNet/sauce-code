import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseRecipe, renderHtml, renderHtmlDocument, renderCode, renderCompact, scaleRecipeForRendering, readerQuantity, convertReaderUnit, convertReaderDensity } from '../src/index.ts';
import { embedRecipeImages } from '../src/cli/images.ts';
const dir = mkdtempSync(join(tmpdir(), 'opensauce polish 日本語 '));
const source = '::recipe\nname: Dinner <&> 日本語\nserves: 2\nimage: photo.png\nimage-credit: Photographer CC0\n::ingredients\n(flour) !100g\n(water) ~2 cups\n(salt) ~~1/2tsp\n(egg) 2\n(spice) 2 scoops\n(milk) 1kg / 2lb\n(choice) = (butter) 10g -OR- (oil) 10ml\n::instructions\n(water) 1/4 cup <heat, 180c>\n';
const file = join(dir, 'dîner with spaces.opensauce'); writeFileSync(file, source);
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aGaoAAAAASUVORK5CYII=', 'base64');
writeFileSync(join(dir, 'photo.png'), png);
const cli = fileURLToPath(new URL('../src/cli.ts', import.meta.url));
const run = (...args: string[]) => spawnSync(process.execPath, [cli, ...args], { cwd: tmpdir(), encoding: 'utf8' });

test('default HTML fragment is still exactly the pure renderer output', () => {
 const r = run('render',file,'--format','html','--no-knowledge');
 assert.equal(r.status,0,r.stderr); assert.equal(r.stdout, renderHtml(parseRecipe(source,{filename:file})));
 assert.ok(!r.stdout.includes('<!doctype')); assert.match(r.stdout,/src="photo.png"/);
});
for (const theme of ['light','dark','auto'] as const) test('offline '+theme+' document escapes title and retains credit', () => {
 const html=renderHtmlDocument(parseRecipe(source),{theme});
 assert.match(html,/<!doctype html>/); assert.match(html,/<title>Dinner &lt;&amp;&gt; 日本語<\/title>/);
 assert.match(html,/Photographer CC0/); assert.match(html,/<style>/); assert.doesNotMatch(html,/<script|<link/);
 assert.equal(html.includes('@media(prefers-color-scheme:dark)'),theme==='auto');
 const output=join(dir,theme+' output.html'); const r=run('render',file,'--format','html','--theme',theme,'--embed-images','--output',output);
 assert.equal(r.status,0,r.stderr); assert.match(readFileSync(output,'utf8'),/data:image\/png;base64,/); assert.equal(r.stdout,'');
});
test('image adapter resolves against recipe directory, excludes raw source, and preserves original bytes',async()=>{
 const r=await embedRecipeImages(parseRecipe(source+'::source\n<<<\n![secret](private.png)\n>>>\n'),file);
 assert.equal(r.images.get('photo.png'),'data:image/png;base64,'+png.toString('base64')); assert.deepEqual(r.warnings,[]);
 assert.deepEqual(readFileSync(join(dir,'photo.png')),png);
});
test('image adapter rejects traversal, remote, missing, unsupported, signatures and oversize files',async()=>{
 writeFileSync(join(dir,'bad.svg'),'<svg/>');writeFileSync(join(dir,'fake.png'),'not an image');writeFileSync(join(dir,'large.png'),Buffer.alloc(5*1024*1024+1));
 for(const path of ['../outside.png','%2e%2e/outside.png','https://example.com/image.png','missing.png','bad.svg','fake.png','large.png','file:///secret.png']){
  const recipe=parseRecipe('::recipe\nimage: '+path+'\n');const r=await embedRecipeImages(recipe,file);
  assert.equal(r.images.size,0,path);assert.equal(r.warnings.length,1,path);assert.match(r.warnings[0],/Original reference retained/);
 }
});
test('image adapter refuses junction escapes and caps total embedded bytes',async()=>{
 const outside=mkdtempSync(join(tmpdir(),'opensauce image outside '));writeFileSync(join(outside,'secret.png'),png);
 symlinkSync(outside,join(dir,'escape'),process.platform==='win32'?'junction':'dir');
 const r=await embedRecipeImages(parseRecipe('::recipe\nimage: escape/secret.png\n'),file);assert.equal(r.images.size,0);assert.match(r.warnings[0],/escapes/);
 const large=Buffer.alloc(5*1024*1024);png.copy(large);let prose='::story\n';
 for(let i=0;i<5;i++){writeFileSync(join(dir,`total${i}.png`),large);prose+=`![image](total${i}.png)\n`;}
 const total=await embedRecipeImages(parseRecipe(prose),file);assert.equal(total.images.size,4);assert.equal(total.warnings.length,1);
});
test('HTML cannot embed SVG or arbitrary data schemes through supplied map',()=>{
 for(const url of ['data:image/svg+xml;base64,PHN2Zz4=','javascript:alert(1)','data:image/png;base64,AA==" onerror="x']){
  const html=renderHtml(parseRecipe(source),{embeddedImages:new Map([['photo.png',url]])});assert.ok(!html.includes(url));assert.match(html,/src="photo.png"/);
 }
});
test('scaling reuses reading model, preserves units/precision, leaves unsupported amounts and source unchanged',()=>{
 const recipe=parseRecipe(source), before=JSON.stringify(recipe);const result=scaleRecipeForRendering(recipe,3), code=renderCode(result.recipe);
 for(const text of ['!150 g','~3 cups','~~0.75 tsp','(egg) 3','3 scoops','1kg / 2lb','10g -OR-','180c','1/4 cup'])assert.ok(code.includes(text),text+'\n'+code);
 assert.ok(result.warnings.some(w=>w.includes('Unscaled ingredient expression: (milk)')));
 assert.ok(result.warnings.some(w=>w.includes('(choice)')));assert.equal(JSON.stringify(recipe),before);assert.equal(result.recipe.source,source);
 assert.equal(convertReaderUnit(readerQuantity('2 cups')!,'ml'),undefined);
 assert.equal(convertReaderDensity([],readerQuantity('1 US cup')!,{to:'g',target:{kind:'ingredient',id:'flour'}}).ok,false);
 assert.match(renderCode(scaleRecipeForRendering(recipe,4).recipe),/~4 cups/);
});
test('all CLI render formats support scaling with visible diagnostics; no source mutation',()=>{
 for(const format of ['compact','code','html','code-html']){
  const r=run('render',file,'--format',format,'--servings','4');assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/4 cups/);assert.match(r.stderr,/Only supported ingredient declarations/);
 }
 assert.equal(readFileSync(file,'utf8'),source);
 const highlighted=run('render',file,'--format','code-html');assert.match(highlighted.stdout,/os-syntax-value/);assert.match(highlighted.stdout,/os-view-code/);
});
test('missing serves, invalid options and invalid recipe return exit 1 and no output',()=>{
 const missing=join(dir,'missing serves.opensauce');writeFileSync(missing,'::ingredients\n(flour) 100g\n');
 const bad=join(dir,'invalid.opensauce');writeFileSync(bad,'::ingredients\n(broken\n');
 for(const args of [['render',missing,'--format','code','--servings','4'],['render',file,'--format','compact','--theme','dark'],['render',file,'--format','code','--embed-images'],['render',file,'--format','html','--theme','neon'],['check',file,'--servings','4'],['render',file,'--format','code','--servings','0'],['render',bad,'--format','html','--theme','auto'],['check',bad]]){
  const r=run(...args);assert.equal(r.status,1,r.stderr);assert.equal(r.stdout,'');
 }
});
test('Compact moves only bounded structured amounts, retaining ambiguous prose and process meaning',()=>{
 const recipe=parseRecipe('::ingredients\n(water) 1 cup\n::equipment\n(bowl)\n::instructions\n(water) 1/4 cup <heat, ~110f / 43c, bath-water heat>\n{dough} = (water) rest of + (flour)\n(bowl) + (greasing fat) <grease, lightly>\n');
 const text=renderCompact(recipe);assert.match(text,/Heat 1\/4 cup of water \(~110f \/ 43c\) \(bath-water heat\)/);assert.match(text,/water rest of/);assert.match(text,/Combine bowl and greasing fat, then grease the bowl and greasing fat \(lightly\)/);
 const html=renderHtml(recipe,{view:'compact'});assert.match(html,/1\/4 cup/);assert.match(html,/os-ingredient/);
});

test('all supported raster signatures and encoded local filenames embed without network loading', async () => {
 const cases: [string, Buffer, string][] = [
  ['crème photo.png',png,'png'], ['small.jpg',Buffer.from([255,216,255,224]),'jpeg'],
  ['small.gif',Buffer.from('GIF89a'),'gif'], ['small.webp',Buffer.from('RIFF0000WEBP'),'webp']
 ];
 for (const [name,bytes,mime] of cases) {
  writeFileSync(join(dir,name),bytes);const path=encodeURI(name);
  const result=await embedRecipeImages(parseRecipe('::recipe\nimage: '+path+'\n'),file);
  assert.deepEqual(result.warnings,[]);assert.equal(result.images.get(path),'data:image/'+mime+';base64,'+bytes.toString('base64'));
 }
});
test('scaling rejects ranged, duplicate and unknown authored serving bases', () => {
 for (const metadata of ['serves: 2-4','serves: 2\nserves: 3','servings: 2','serves: unknown']) {
  assert.throws(()=>scaleRecipeForRendering(parseRecipe('::recipe\n'+metadata+'\n::ingredients\n(flour) 100g\n'),4),/Scaling requires/);
 }
});

test('quantity placement never treats equipment capacity or unresolved objects as ingredient amounts', () => {
 const text=renderCompact(parseRecipe('::equipment\n(pan)\n::instructions\n(pan) 2l <heat>\n(mystery object) 100g <move>\n'));
 assert.match(text,/Heat the pan 2l/);assert.match(text,/Move the mystery object 100g/);assert.doesNotMatch(text,/of pan|of mystery/);
});
