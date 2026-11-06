import test from 'node:test';
import assert from 'node:assert/strict';
import {DL_DIAGRAM_TOPICS,renderDLTopicDiagram} from '../docs/dl-topic-diagrams.js';

const attributes=tag=>Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const elements=(html,name)=>[...html.matchAll(new RegExp(`<${name}\\b[^>]*>`,'g'))].map(m=>attributes(m[0]));
const near=(actual,expected,label)=>assert.ok(Math.abs(actual-expected)<1e-8,`${label}: ${actual} ≠ ${expected}`);
const rectangle=r=>({x:Number(r.x||0),y:Number(r.y||0),width:Number(r.width),height:Number(r.height)});
const contains=(r,p,gap=0)=>p.x>=r.x-gap&&p.x<=r.x+r.width+gap&&p.y>=r.y-gap&&p.y<=r.y+r.height+gap;
function nodeWithText(html,label,{last=false}={}){
 const texts=[...html.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)].filter(m=>m[2]===label);
 assert.ok(texts.length,`etiqueta visible: ${label}`);
 const text=last?texts.at(-1):texts[0],a=attributes(text[1]);
 const node=elements(html,'rect').map(rectangle).find(r=>contains(r,{x:Number(a.x),y:Number(a.y)}));
 assert.ok(node,`el texto ${label} pertenece a una caja`);return node;
}
function arrowEndpoints(path){
 const tokens=path.match(/[MHLV]|-?\d+(?:\.\d+)?/g);let i=0,x=0,y=0,first;
 while(i<tokens.length){
  const command=tokens[i++];
  if(command==='M'||command==='L'){x=Number(tokens[i++]);y=Number(tokens[i++]);}
  else if(command==='H')x=Number(tokens[i++]);
  else if(command==='V')y=Number(tokens[i++]);
  else assert.fail(`comando inesperado en una flecha de recorrido: ${command}`);
  first??={x,y};
 }
 return {first,last:{x,y}};
}
const connected=(html,from,to)=>elements(html,'path')
 .filter(p=>p.class?.split(' ').includes('dl-topic-arrow'))
 .map(p=>arrowEndpoints(p.d))
 .some(p=>contains(from,p.first,8)&&contains(to,p.last,8));

test('las formas de los doce diagramas quedan dentro del espacio de su figura',()=>{
 for(const topic of DL_DIAGRAM_TOPICS){
  const html=renderDLTopicDiagram(topic),svg=elements(html,'svg')[0];
  const [left,top,width,height]=svg.viewBox.split(/\s+/).map(Number);
  for(const r of elements(html,'rect')){
   const x=Number(r.x||0),y=Number(r.y||0),w=Number(r.width),h=Number(r.height);
   assert.ok(x>=left&&y>=top&&x+w<=left+width&&y+h<=top+height,`${topic}: rectángulo fuera del viewBox`);
  }
  for(const c of elements(html,'circle')){
   const x=Number(c.cx),y=Number(c.cy),r=Number(c.r);
   assert.ok(x-r>=left&&y-r>=top&&x+r<=left+width&&y+r<=top+height,`${topic}: círculo fuera del viewBox`);
  }
 }
});

test('la caja de YOLO se dibuja con las mismas coordenadas que su fila en píxeles',()=>{
 const html=renderDLTopicDiagram('dl-yolo');
 const rectangles=elements(html,'rect');
 const image=rectangles.find(r=>r.class?.split(' ').includes('dl-topic-image-field'));
 const box=rectangles.find(r=>r.class?.split(' ').includes('dl-topic-detection-box'));
 assert.ok(image&&box);
 near(Number(image.width),Number(image.height),'misma escala para ambos ejes');
 const coordinates=[(Number(box.x)-Number(image.x))/Number(image.width)*100,
  (Number(box.y)-Number(image.y))/Number(image.height)*100,
  (Number(box.x)+Number(box.width)-Number(image.x))/Number(image.width)*100,
  (Number(box.y)+Number(box.height)-Number(image.y))/Number(image.height)*100];
 assert.deepEqual(coordinates.map(n=>Math.round(n*1e8)/1e8),[20,20,60,60]);
 assert.match(html,/100\s*[×x]\s*100/,'la escala de la imagen debe estar declarada');
 assert.match(html,/\[20,\s*20,\s*60,\s*60\]/,'la misma caja aparece en el registro');
});

test('la etiqueta supervisada se compara con la predicción, sin entrar al extractor congelado',()=>{
 const html=renderDLTopicDiagram('dl-transferencia');
 const image=nodeWithText(html,'Nueva imagen',{last:true}),extractor=nodeWithText(html,'Extractor previo');
 const head=nodeWithText(html,'Cabeza nueva'),prediction=nodeWithText(html,'Predicción');
 const label=nodeWithText(html,'Etiqueta conocida'),loss=nodeWithText(html,'calcula pérdida');
 assert.notDeepEqual(image,label,'imagen y etiqueta usan nodos distintos');
 for(const [from,to] of [[image,extractor],[extractor,head],[head,prediction],[prediction,loss],[label,loss],[loss,head]]){
  assert.ok(connected(html,from,to),'se conserva el recorrido de datos, comparación y actualización');
 }
 assert.equal(connected(html,label,extractor),false,'la etiqueta no es una entrada del extractor');
 assert.equal(connected(html,label,head),false,'la etiqueta llega a la pérdida, no como característica');
});

test('Transformer representa los datos antes del bloque y usa una cabeza antes de comparar con la etiqueta externa',()=>{
 const html=renderDLTopicDiagram('dl-transformers');
 const representation=nodeWithText(html,'Representación: vector de cada cantidad + posición');
 const encoder=nodeWithText(html,'Bloque Transformer');
 const head=nodeWithText(html,'Cabeza: lee las posiciones → 2 puntuaciones');
 const prediction=nodeWithText(html,'Predicción'),label=nodeWithText(html,'Etiqueta esperada: 1');
 const comparison=nodeWithText(html,'Compara la clase');
 assert.ok(representation.y<encoder.y&&encoder.y<head.y&&head.y<prediction.y,'orden de las etapas del modelo');
 for(const [from,to] of [[representation,encoder],[encoder,head],[head,prediction],[prediction,comparison],[label,comparison]]){
  assert.ok(connected(html,from,to),'las flechas conectan las etapas de representación, cálculo y comprobación');
 }
 assert.equal(connected(html,label,encoder),false,'la referencia no se entrega al bloque');
 assert.equal(connected(html,label,head),false,'la referencia no produce las puntuaciones');
 assert.match(html,/no se inventa|no inventa|predicción real se observa/i);
});
