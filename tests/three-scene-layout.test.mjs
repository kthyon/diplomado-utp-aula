import test from 'node:test';
import assert from 'node:assert/strict';
import {fitOrthographicBounds,placeOverlayLabel} from '../docs/three-scene-layout.js';

const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≈ ${b}`);
const dot=(a,b)=>a.reduce((sum,value,index)=>sum+value*b[index],0);
const unit=v=>{const size=Math.hypot(...v);return v.map(value=>value/size);};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
function projectedCorners({height,yaw,elevation}){
 const eye=[16*Math.cos(elevation)*Math.sin(yaw),16*Math.sin(elevation),16*Math.cos(elevation)*Math.cos(yaw)];
 const forward=unit(eye.map(value=>-value)),right=unit(cross(forward,[0,1,0])),up=cross(right,forward);
 const points=[];
 for(const x of [-4,4])for(const y of [-.25,height])for(const z of [-2.5,2.5]){
  const p=[x-eye[0],y-eye[1],z-eye[2]];points.push({x:dot(p,right),y:dot(p,up)});
 }
 return points;
}

test('el encuadre contiene base y alturas extremas al cambiar tamaño y punto de vista',()=>{
 for(const width of [192,244,680,752,1034])for(const yaw of [0,.7,1.5,2.7,4.1])for(const elevation of [.25,.7,1.3])for(const height of [1.6,2.05,3.6]){
  const stageHeight=Math.max(240,width*440/740),points=projectedCorners({height,yaw,elevation});
  const frame=fitOrthographicBounds(points,width,stageHeight);assert.ok(frame);
  close((frame.right-frame.left)/(frame.top-frame.bottom),width/stageHeight);
  for(const point of points){
   const px=(point.x-frame.left)/(frame.right-frame.left)*width;
   const py=(frame.top-point.y)/(frame.top-frame.bottom)*stageHeight;
   assert.ok(px>=16-1e-9&&px<=width-16+1e-9,'contenido horizontal completo');
   assert.ok(py>=28-1e-9&&py<=stageHeight-28+1e-9,'contenido vertical completo con espacio para etiquetas');
  }
 }
});

test('el encuadre cambia con los datos sin alterar puntos o estado de cámara del llamador',()=>{
 const short=[{x:-4,y:-1},{x:4,y:2}],tall=[{x:-4,y:-1},{x:4,y:9}],before=structuredClone(short);
 const first=fitOrthographicBounds(short,244,240),second=fitOrthographicBounds(tall,244,240);
 assert.ok(second.top-second.bottom>first.top-first.bottom);assert.deepEqual(short,before);
 const single=fitOrthographicBounds([{x:7,y:2}],192,240);assert.ok(single.right>single.left&&single.top>single.bottom);
 close((single.left+single.right)/2,7);close((single.top+single.bottom)/2,2);
 assert.equal(fitOrthographicBounds([],192,240),null);assert.equal(fitOrthographicBounds(short,0,240),null);assert.equal(fitOrthographicBounds([{x:NaN,y:0}],192,240),null);
});

test('las etiquetas completas permanecen dentro de la escena incluso cerca de los bordes',()=>{
 for(const width of [192,244,680])for(const x of [-2,-1,0,1,2])for(const y of [-2,-1,0,1,2])for(const labelWidth of [40,100,500]){
  const height=240,labelHeight=30,effectiveWidth=Math.min(labelWidth,width-8);
  const placed=placeOverlayLabel({x,y,z:0},width,height,labelWidth,labelHeight);
  assert.equal(placed.hidden,false);
  assert.ok(placed.x-effectiveWidth/2>=4-1e-9);assert.ok(placed.x+effectiveWidth/2<=width-4+1e-9);
  assert.ok(placed.y-labelHeight>=4-1e-9);assert.ok(placed.y<=height-4+1e-9);
 }
 assert.deepEqual(placeOverlayLabel({x:0,y:0,z:2},192,240,80,24),{hidden:true});
 assert.deepEqual(placeOverlayLabel({x:0,y:0,z:-2},192,240,80,24),{hidden:true});
 assert.deepEqual(placeOverlayLabel({x:NaN,y:0,z:0},192,240,80,24),{hidden:true});
});
