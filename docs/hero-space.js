import {icon} from './icons.js';
// Original 3D geometry illustrating a concept, not a trained model.
let cleanup=()=>{};
export function heroVisual(){queueMicrotask(()=>mount(document.querySelector('.nexo-space')));return `<figure class="hero-art nexo-space" aria-label="Escena tridimensional de datos, patrones y salidas de IA"><header><span>● INTELIGENCIA EN CONTEXTO</span><span>ML + DL</span></header><div class="space-stage"><div class="space-floor"></div><canvas aria-hidden="true"></canvas><div class="space-depth">${[['rain','01 · DATOS','Lluvia','Series de tiempo','rain'],['soil','01 · DATOS','Suelo','Medidas del campo','soil'],['image','01 · DATOS','Imágenes','Información visual','image'],['predict','03 · SALIDAS','Predicción','Estimar un valor','chart'],['alert','03 · SALIDAS','Alerta','Revisar un caso','alert'],['detect','03 · SALIDAS','Detección','Localizar un objeto','detect']].map(([id,num,title,detail,glyph])=>`<div class="space-card space-${id}"><span class="space-icon" aria-hidden="true">${icon(glyph)}</span><div><small>${num}</small><strong>${title}</strong><span>${detail}</span></div></div>`).join('')}<div class="space-label"><small>02 · PATRONES</small><strong>Conectar.<br>Aprender.</strong></div></div></div><figcaption><span>Datos → modelo → interpretación</span></figcaption></figure>`;}
function mount(root){cleanup();if(!root)return;const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');if(!ctx)return;const stage=root.querySelector('.space-stage'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(pointer: fine)');let frame=0,visible=true,w=0,h=0,x=0,y=0,tx=0,ty=0,phase=0,last=0;
const nodes=Array.from({length:32},(_,i)=>{const a=i*2.39996323,v=1-2*(i+.5)/32,r=Math.sqrt(1-v*v);return [Math.cos(a)*r*105,v*105,Math.sin(a)*r*105];}),edges=[];nodes.forEach((a,i)=>nodes.forEach((b,j)=>{if(j>i&&Math.hypot(...a.map((v,k)=>v-b[k]))<83)edges.push([i,j]);}));
function project(p){const a=.35+phase*.08+x*.4,t=-.18+y*.25,u=p[0]*Math.cos(a)+p[2]*Math.sin(a);let z=-p[0]*Math.sin(a)+p[2]*Math.cos(a),v=p[1]*Math.cos(t)-z*Math.sin(t);z=p[1]*Math.sin(t)+z*Math.cos(t);const s=Math.min(w/520,h/390)*1.16,d=580/(580-z);return {x:w*.5+(u+x*15)*s*d,y:h*.47+(v+y*12)*s*d,z,r:s*d};}
function line(a,b,c,l=1){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=c;ctx.lineWidth=l;ctx.stroke();}
function rings(front){for(let r=0;r<3;r++){let previous;for(let i=0;i<=100;i++){const a=i*Math.PI*2/100,s=145+r*8,q=project(r===0?[Math.cos(a)*s,Math.sin(a)*s*.22,Math.sin(a)*s]:r===1?[Math.cos(a)*s,Math.sin(a)*s,Math.sin(a)*s*.15]:[Math.cos(a)*s*.3,Math.sin(a)*s,Math.cos(a)*s]);if(previous&&((previous.z+q.z)>0)===front)line(previous,q,front?'#d2eaa0b3':'#a4dab32e',front?1.5:.7);previous=q;}}}
function draw(){
  if(!w||!h)return;
  ctx.clearRect(0,0,w,h);
  const center=project([0,0,0]),radius=108*center.r;
  // A wide, low-contrast shadow separates the network from the backdrop.
  ctx.save();
  ctx.translate(center.x,center.y+radius*1.15);
  ctx.scale(1,.3);
  const shadow=ctx.createRadialGradient(0,0,0,0,0,radius*1.6);
  shadow.addColorStop(0,'#07110b38');shadow.addColorStop(.45,'#07110b1a');shadow.addColorStop(1,'#07110b00');
  ctx.fillStyle=shadow;ctx.fillRect(-radius*1.6,-radius*1.6,radius*3.2,radius*3.2);ctx.restore();
  rings(false);
  // Dense at the center, feathered at the rim: volume without a hard circular shell.
  const body=ctx.createRadialGradient(center.x-radius*.1,center.y-radius*.12,radius*.08,center.x,center.y,radius*1.25);
  body.addColorStop(0,'#537e5a');body.addColorStop(.38,'#335b43f5');body.addColorStop(.7,'#244d3bc4');body.addColorStop(.88,'#173e2b66');body.addColorStop(1,'#173e2b00');
  ctx.fillStyle=body;ctx.fillRect(center.x-radius*1.3,center.y-radius*1.3,radius*2.6,radius*2.6);
  const points=nodes.map(project);
  edges.forEach(([a,b],i)=>{
    const front=(points[a].z+points[b].z)>0;
    line(points[a],points[b],front?'#c6f1c2b8':'#8cba9940',front?1.35:.7);
    if(front&&!reduced.matches){const t=(phase*.3+i*.17)%1;ctx.beginPath();ctx.arc(points[a].x+(points[b].x-points[a].x)*t,points[a].y+(points[b].y-points[a].y)*t,1.6,0,Math.PI*2);ctx.fillStyle='#edffd1';ctx.fill();}
  });
  points.sort((a,b)=>a.z-b.z).forEach(p=>{
    const front=p.z>0,r=(front?6.5:4.5)*p.r,g=ctx.createRadialGradient(p.x-r*.35,p.y-r*.4,.2,p.x,p.y,r);
    g.addColorStop(0,front?'#f5ffdc':'#91bb9b');g.addColorStop(.35,front?'#d0f09e':'#5d9277');g.addColorStop(1,'#245e4e');
    ctx.shadowColor='#c5f6a999';ctx.shadowBlur=front?14:0;ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  });
  rings(true);
}
function resize(){const r=stage.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),pw=Math.round(r.width*d),ph=Math.round(r.height*d);if(!pw||!ph||(w===r.width&&h===r.height&&canvas.width===pw&&canvas.height===ph))return;w=r.width;h=r.height;canvas.width=pw;canvas.height=ph;ctx.setTransform(d,0,0,d,0,0);draw();}
function tick(time){frame=0;if(!visible||document.hidden||reduced.matches)return;phase+=Math.min((time-last)/1000,.05)||0;last=time;x+=(tx-x)*.065;y+=(ty-y)*.065;root.style.setProperty('--sx',x.toFixed(3));root.style.setProperty('--sy',y.toFixed(3));draw();frame=requestAnimationFrame(tick);}
function start(){if(reduced.matches){cancelAnimationFrame(frame);frame=0;x=y=0;root.style.setProperty('--sx','0');root.style.setProperty('--sy','0');draw();}else if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
function move(e){if(!fine.matches||reduced.matches)return;const r=stage.getBoundingClientRect();tx=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1));ty=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));}const leave=()=>{tx=ty=0;};
const size=new ResizeObserver(resize),view=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else start();}),detached=new MutationObserver(()=>{if(!root.isConnected)cleanup();});size.observe(stage);view.observe(root);detached.observe(document.querySelector('#main'),{childList:true});root.addEventListener('pointermove',move);root.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',start);reduced.addEventListener('change',start);cleanup=()=>{cancelAnimationFrame(frame);size.disconnect();view.disconnect();detached.disconnect();root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',start);reduced.removeEventListener('change',start);};resize();start();}
