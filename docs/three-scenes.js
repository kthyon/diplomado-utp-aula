import {FARMS,PLANTS,result} from './scene-models.js';
let libraries;
const instances=new WeakMap();
const load=()=>libraries??=Promise.all([import('three'),import('three/addons/controls/OrbitControls.js')]);
const names={prediction:FARMS.map(f=>'Finca '+f.name),alerts:PLANTS.map(p=>p.name),missing:['Estación A','Estación B','Estación C','Estación D'],signal:['Entrada','Función','Salida'],adjustment:['Parámetro'],vision:['Fruto 1','Fruto 2','Fruto 3']};
export async function renderThreeScene(host,id,params,onInspect){
 if(!host||host.dataset.failed)return;
 let record=instances.get(host);
 if(!record){record={latest:{id,params,onInspect},loading:true};instances.set(host,record);
  try{const [THREE,{OrbitControls}]=await load();if(!host.isConnected)return;record.engine=new ClassroomScene(host,THREE,OrbitControls);record.loading=false;const next=record.latest;record.engine.update(next.id,next.params,next.onInspect);}
  catch{host.dataset.failed='true';host.closest('.iso-stage')?.classList.remove('three-ready');}
 }else{record.latest={id,params,onInspect};if(record.engine)record.engine.update(id,params,onInspect);}
}
class ClassroomScene{
 constructor(host,T,OrbitControls){
  this.host=host;this.T=T;this.labels=[];this.tweens=[];this.pickables=[];this.visible=true;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  host.innerHTML='<div class="three-stage"><div class="three-labels"></div></div><div class="three-loss" data-loss hidden></div><div class="three-tools"><span>Arrastra para cambiar el punto de vista</span><button type="button" data-camera>Vista inicial ↺</button><button type="button" data-scheme>Ver esquema 2D</button></div><div class="three-objects" aria-label="Inspeccionar objetos"></div>';
  this.stage=host.querySelector('.three-stage');this.overlay=host.querySelector('.three-labels');
  this.dirty=true;this.scene=new T.Scene();this.scene.background=new T.Color('#f4f7ed');
  this.camera=new T.OrthographicCamera(-5.8,5.8,4,-4,.1,100);this.camera.position.set(9,9,11);this.camera.lookAt(0,.8,0);
  this.renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFShadowMap;this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=.95;this.renderer.setClearColor('#f4f7ed');
  this.renderer.domElement.setAttribute('aria-label','Escena tridimensional: usa los botones inferiores para inspeccionar cada objeto.');this.renderer.domElement.setAttribute('role','img');this.stage.prepend(this.renderer.domElement);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,.8,0);this.controls.enableDamping=!this.reduced;this.controls.dampingFactor=.13;this.controls.enablePan=false;this.controls.minZoom=.7;this.controls.maxZoom=1.5;this.controls.minPolarAngle=.25;this.controls.maxPolarAngle=Math.PI/2.2;this.controls.update();this.controls.saveState();this.controls.addEventListener('change',()=>this.dirty=true);
  this.scene.add(new T.HemisphereLight('#fff9ec','#65816b',2.2));const light=new T.DirectionalLight('#fff2d1',3.2);light.position.set(-4,12,7);light.castShadow=true;light.shadow.mapSize.set(1024,1024);light.shadow.camera.left=-8;light.shadow.camera.right=8;light.shadow.camera.top=8;light.shadow.camera.bottom=-8;light.shadow.normalBias=.025;this.scene.add(light);
  this.content=new T.Group();this.scene.add(this.content);
  this.resize=new ResizeObserver(()=>this.fit());this.resize.observe(this.stage);
  this.intersection=new IntersectionObserver(([e])=>{this.visible=e.isIntersecting;});this.intersection.observe(host);
  host.querySelector('[data-camera]').onclick=()=>this.controls.reset();host.querySelector('[data-scheme]').onclick=()=>{host.closest('.iso-stage').classList.toggle('three-ready');host.querySelector('[data-scheme]').textContent=host.closest('.iso-stage').classList.contains('three-ready')?'Ver esquema 2D':'Volver a la vista 3D';};
  let start;
  this.renderer.domElement.addEventListener('pointerdown',e=>start=[e.clientX,e.clientY]);this.renderer.domElement.addEventListener('pointerup',e=>{if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>7)return;const b=this.renderer.domElement.getBoundingClientRect(),pointer=new T.Vector2((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1),ray=new T.Raycaster();ray.setFromCamera(pointer,this.camera);let hit=ray.intersectObjects(this.pickables,true)[0]?.object;while(hit&&hit.userData.index===undefined)hit=hit.parent;if(hit)this.inspect(hit.userData.index);});
  host.closest('.iso-stage').classList.add('three-ready');this.fit();this.tick();
 }
 fit(){const w=this.stage.clientWidth,h=this.stage.clientHeight;if(!w||!h)return;const aspect=w/h;this.camera.left=-4.1*aspect;this.camera.right=4.1*aspect;this.camera.top=4.1;this.camera.bottom=-4.1;this.camera.updateProjectionMatrix();this.renderer.setSize(w,h,false);this.dirty=true;}
 mat(color){return new this.T.MeshStandardMaterial({color,roughness:.82,metalness:0});}
 mesh(geometry,color,x=0,y=0,z=0,parent=this.content){const m=new this.T.Mesh(geometry,this.mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 box(w,h,d,color,x=0,y=0,z=0,parent){return this.mesh(new this.T.BoxGeometry(w,h,d),color,x,y,z,parent);}
 group(index,x,z){const g=new this.T.Group();g.position.set(x,0,z);g.userData.index=index;this.content.add(g);this.pickables.push(g);return g;}
 label(group,text,offset=new this.T.Vector3(0,1.4,0)){const el=document.createElement('span');el.className='three-tag';el.textContent=text;this.overlay.append(el);this.labels.push({group,offset,el});}
 plant(parent,plague=false,scale=1){
  const T=this.T,g=new T.Group();g.scale.setScalar(scale);parent.add(g);this.mesh(new T.CylinderGeometry(.032,.045,.65,7),'#42734d',0,.45,0,g);
  for(let i=0;i<4;i++){let m=this.mesh(new T.SphereGeometry(.26,12,8),plague?'#bd8052':i%2?'#79a962':'#458252',(i%2?1:-1)*.16,.47+i*.13,0,g);m.scale.set(1,.38,.55);m.rotation.z=(i%2?1:-1)*.5;}
  return g;
 }
 base(w=7,d=5){this.box(w,.22,d,'#9bb987',0,-.13,0);this.box(w,.08,d,'#d4e4b5',0,.02,0);}
 cabin(){const g=new this.T.Group();g.position.set(-3.4,0,-.1);this.content.add(g);this.box(1,.8,.85,'#fff0d6',0,.47,0,g);const roof=this.mesh(new this.T.ConeGeometry(.85,.55,4),'#c3815b',0,1.14,0,g);roof.rotation.y=Math.PI/4;this.box(.23,.45,.02,'#60775e',0,.3,.435,g);}
 bar(g,key,height,color,x,z){const m=this.box(.27,1,.3,color,x,0,z,g);m.scale.y=Math.max(.01,height);m.position.y=.13+m.scale.y/2;m.userData.barKey=key;return m;}
 tweenBar(mesh,value){this.tweens.push({mesh,from:mesh.scale.y,to:Math.max(.01,value),start:performance.now()});}
 lossPlot(id,r){const el=this.host.querySelector('[data-loss]');el.hidden=id!=='adjustment';if(el.hidden)return;const max=Math.max(25,...r.history),n=Math.max(10,r.steps),pts=r.history.map((v,i)=>(45+i/n*510)+','+(66-v/max*43)).join(' ');el.innerHTML='<svg viewBox="0 0 600 90" role="img" aria-label="Pérdida frente a pasos de ajuste"><text x="12" y="14" font-size="10" fill="#62765a">Pérdida (sin unidades)</text><path d="M45 23V66H555" stroke="#ccd7c2" fill="none"/><polyline points="'+pts+'" fill="none" stroke="#4d7d5c" stroke-width="2"/><text x="35" y="28" text-anchor="end" font-size="9">'+max.toFixed(1)+'</text><text x="35" y="69" text-anchor="end" font-size="9">0</text><text x="45" y="81" text-anchor="middle" font-size="9">0</text><text x="555" y="81" text-anchor="middle" font-size="9">'+n+'</text><text x="300" y="87" text-anchor="middle" font-size="9">Pasos de ajuste</text></svg>';}
 clear(){this.content.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});this.content.clear();this.overlay.innerHTML='';this.labels=[];this.tweens=[];this.pickables=[];}
 inspect(index){this.onInspect?.(index);this.host.querySelectorAll('[data-object]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.object)===index)));}
 update(id,p,onInspect){this.dirty=true;this.onInspect=onInspect;const r=result(id,p);this.lossPlot(id,r);
  if(this.id===id&&this.bars){this.tweens=[];
   if(id==='prediction')this.bars.forEach((m,i)=>{this.tweenBar(m,r.estimates[i]*.34);this.labels[i].offset.y=Math.max(FARMS[i].y,r.estimates[i])*.34+.52;});
   else if(id==='missing')this.bars.forEach((m,i)=>this.tweenBar(m,[p.rainA,r.estimate,p.rainC,p.rainD][i]/550));
   else if(id==='signal'){this.tweenBar(this.bars[0],Math.abs(p.signal)*.35+.04);this.tweenBar(this.bars[1],Math.abs(r.output)*.35+.04);this.labels[0].el.textContent='Entrada '+p.signal.toFixed(1);this.labels[1].el.textContent=p.function;this.labels[2].el.textContent='Salida '+r.output.toFixed(3);}
   else if(id==='adjustment'){this.tweens.push({mesh:this.runner,from:this.runner.position.x,to:Math.max(-3.4,Math.min(3.4,(r.position-1.5)*.42)),start:performance.now(),axis:'x'});this.labels[0].el.textContent='Parámetro '+r.position.toFixed(2);}
   else this.rebuild(id,p,r);
   return;
  }
  this.rebuild(id,p,r);
 }
 rebuild(id,p,r){this.clear();this.id=id;this.bars=null;const T=this.T;
  if(id==='prediction'){
   this.base(8,5);this.cabin();this.bars=[];
   FARMS.forEach((f,i)=>{const g=this.group(i,i%3*1.8-1.5,Math.floor(i/3)*2-1);this.box(1.5,.09,1.65,'#afc58a',0,.13,0,g);const leaf=new T.Group();leaf.position.set(-.45,.1,-.44);g.add(leaf);this.plant(leaf,false,.8);this.bar(g,'observed',f.y*.34,'#4b7b55',-.2,.3);this.bars.push(this.bar(g,'estimated',r.estimates[i]*.34,'#69a9c1',.27,.3));this.label(g,'Finca '+f.name,new T.Vector3(.05,Math.max(f.y,r.estimates[i])*.34+.52,.35));});
  }else if(id==='alerts'){
   this.base(8,4.5);this.cabin();PLANTS.forEach((v,i)=>{const g=this.group(i,i%5*1.28-2.2,Math.floor(i/5)*1.7-.8);this.plant(g,v.plague,1.03);if(r.alerts[i]){const ring=this.mesh(new T.TorusGeometry(.42,.035,8,32),'#d68545',0,.14,0,g);ring.rotation.x=Math.PI/2;}this.label(g,v.name,new T.Vector3(0,1.27,0));});
  }else if(id==='missing'){
   this.base();this.cabin();this.bars=[];['A','B','C','D'].forEach((n,i)=>{const g=this.group(i,i%2*2.6-.9,Math.floor(i/2)*2-1);this.box(1.7,.12,1.4,'#c0d3a0',0,.12,0,g);this.bars.push(this.bar(g,'rain',[p.rainA,r.estimate,p.rainC,p.rainD][i]/550,i===1?'#d79964':'#69a9c1',0,0));this.label(g,i===1?'B · estimado':'Estación '+n,new T.Vector3(0,2.05,0));});
  }else if(id==='signal'){
   this.base(8,3);this.bars=[];const groups=[this.group(0,-2.5,0),this.group(1,0,0),this.group(2,2.5,0)];groups.forEach(g=>this.box(1.4,.16,1.25,'#e5e8df',0,.17,0,g));this.bars.push(this.bar(groups[0],'input',Math.abs(p.signal)*.35+.04,'#769db7',0,0));this.box(.85,1,.85,'#a58cbc',0,.76,0,groups[1]);this.bars.push(this.bar(groups[2],'output',Math.abs(r.output)*.35+.04,'#4f8972',0,0));this.label(groups[0],'Entrada '+p.signal.toFixed(1),new T.Vector3(0,2,0));this.label(groups[1],p.function,new T.Vector3(0,2,0));this.label(groups[2],'Salida '+r.output.toFixed(3),new T.Vector3(0,2,0));for(const x of [-1.3,1.3])this.content.add(new T.ArrowHelper(new T.Vector3(1,0,0),new T.Vector3(x-.4,.6,0),.8,'#8caa90',.15,.09));
  }else if(id==='adjustment'){
   this.bars=[];this.base(8,3.3);this.box(7,.04,.2,'#89a47a',0,.09,0);this.runner=this.group(0,Math.max(-3.4,Math.min(3.4,(r.position-1.5)*.42)),0);this.mesh(new T.SphereGeometry(.25,24,16),'#69a4c2',0,.4,0,this.runner);this.label(this.runner,'Parámetro '+r.position.toFixed(2),new T.Vector3(0,1.1,0));const goal=new T.Group();goal.position.x=(3-1.5)*.42;this.content.add(goal);this.box(.05,1.1,.05,'#4b7452',0,.65,0,goal);this.box(.6,.32,.04,'#92b86e',.3,1.05,0,goal);this.label(goal,'Objetivo 3',new T.Vector3(0,1.6,0));
  }else{
   this.base(8,3.5);this.box(6.8,.24,1.8,'#90a69c',0,.32,0);this.box(.12,2.1,.12,'#315d51',-.7,1.25,-.8);this.box(.12,2.1,.12,'#315d51',-.7,1.25,.8);this.box(.2,.12,1.9,'#4e7d6b',-.7,2.35,0);
   [0,1,2].forEach((v,i)=>{const g=this.group(i,i*2-2,0);const fruit=this.mesh(new T.SphereGeometry(.44,24,16),p.task==='segmentation'?['#bb8acc','#76b5c9','#e9a55d'][i]:['#aac772','#d5ad62','#92b46d'][i],0,.93,0,g);fruit.scale.y=1.25;const leaf=this.mesh(new T.SphereGeometry(.18,12,8),'#457450',.16,1.52,0,g);leaf.scale.set(1.5,.2,.7);this.label(g,p.task==='classification'?'Fruto dibujado':'Fruto '+(i+1),new T.Vector3(0,1.9,0));if(p.task==='detection'){const el=document.createElement('span');el.className='three-detection';this.overlay.append(el);this.labels.push({group:g,offset:new T.Vector3(0,.95,0),el,box:true});}});
  }
  const objects=this.host.querySelector('.three-objects');objects.innerHTML='';names[id].forEach((name,i)=>{const b=document.createElement('button');b.type='button';b.dataset.object=i;b.textContent=name;b.onclick=()=>this.inspect(i);objects.append(b);});
 }
 tick(){if(!this.host.isConnected){this.dispose();return;}this.frame=requestAnimationFrame(()=>this.tick());if(document.hidden||!this.visible)return;this.controls.update();if(!this.dirty&&!this.tweens.length)return;this.dirty=false;const now=performance.now();this.tweens=this.tweens.filter(t=>{const u=this.reduced?1:Math.min(1,(now-t.start)/380),v=1-(1-u)**3;if(t.axis==='x')t.mesh.position.x=t.from+(t.to-t.from)*v;else{t.mesh.scale.y=t.from+(t.to-t.from)*v;t.mesh.position.y=.13+t.mesh.scale.y/2;}return u<1;});
  this.renderer.render(this.scene,this.camera);const w=this.stage.clientWidth,h=this.stage.clientHeight;
  for(const l of this.labels){const pos=l.group.localToWorld(l.offset.clone()).project(this.camera),x=(pos.x+1)*w/2,y=(1-pos.y)*h/2;l.el.style.left=x+'px';l.el.style.top=y+'px';if(l.box){const b=new this.T.Box3().setFromObject(l.group),corners=[];for(const xx of [b.min.x,b.max.x])for(const yy of [b.min.y,b.max.y])for(const zz of [b.min.z,b.max.z])corners.push(new this.T.Vector3(xx,yy,zz).project(this.camera));const xs=corners.map(p=>(p.x+1)*w/2),ys=corners.map(p=>(1-p.y)*h/2),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);l.el.style.left=(left+right)/2+'px';l.el.style.top=(top+bottom)/2+'px';l.el.style.width=(right-left+5)+'px';l.el.style.height=(bottom-top+5)+'px';}}
 }
 dispose(){cancelAnimationFrame(this.frame);this.resize.disconnect();this.intersection.disconnect();this.controls.dispose();this.clear();this.renderer.dispose();this.renderer.forceContextLoss();}
}
