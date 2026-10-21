import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const css=fs.readFileSync(new URL('../docs/theme.css',import.meta.url),'utf8');
const palette=Object.assign({},...[...css.matchAll(/:root\[data-theme=dark\]\{([^}]*)\}/g)].map(m=>Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*(#[\da-f]{6})(?=;|$)/gi)].map(x=>[x[1],x[2]]))));
const luminance=hex=>{const [r,g,b]=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b;};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
test('el texto y los acentos del tema oscuro conservan contraste AA en superficies de lectura',()=>{
 for(const surface of ['bg','paper','soft','selected'])for(const role of ['ink','muted','accent']){
  const ratio=contrast(palette[role],palette[surface]);
  assert.ok(ratio>=4.5,role+' sobre '+surface+': '+ratio.toFixed(2));
 }
 assert.ok(contrast(palette['on-accent'],palette.accent)>=4.5);
 assert.ok(contrast(palette['on-selected'],palette.selected)>=4.5);
});
test('foco, controles y series mantienen contraste en los paneles oscuros',()=>{
 for(const surface of ['bg','paper','soft']){
  for(const role of ['control-line','focus','data-green','data-orange','data-blue'])assert.ok(contrast(palette[role],palette[surface])>=3,role+' sobre '+surface);
 }
});
test('aula y laboratorio cargan el tema después de sus estilos de componentes',()=>{
 for(const file of ['index.html','laboratorio.html']){
  const html=fs.readFileSync(new URL('../docs/'+file,import.meta.url),'utf8');
  const links=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map(m=>m[0]);
  assert.match(links.at(-1),/href="theme.css\?/);
 }
});
