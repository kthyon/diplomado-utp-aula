// Original scene geometry. The animation illustrates the decision; it is not a growth model.
export async function createPlantScene(host){
 let dispose=()=>{},update=()=>{};
 try{
  const T=await import('three');if(!host.isConnected)return {host,dispose,update};
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(32,1,.1,60);
  camera.position.set(3.1,2.8,5.8);camera.lookAt(.15,1.25,0);
  const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.domElement.setAttribute('aria-hidden','true');
  host.prepend(renderer.domElement);host.querySelector('.plant-fallback').hidden=true;
  scene.add(new T.HemisphereLight('#e3e8c9','#244744',3));const sunlight=new T.DirectionalLight('#ffdda0',3);sunlight.position.set(-3,5,4);scene.add(sunlight);
  const material=color=>new T.MeshStandardMaterial({color,roughness:.8});
  const mesh=(geometry,color,x,y,z,parent=scene)=>{const m=new T.Mesh(geometry,material(color));m.position.set(x,y,z);parent.add(m);return m;};
  const stem=(points,radius,color,parent=scene)=>{const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(new T.TubeGeometry(curve,20,radius,8,false),color,0,0,0,parent);};
  const shadow=new T.Mesh(new T.CircleGeometry(.9,40),new T.MeshBasicMaterial({color:'#0b2926',transparent:true,opacity:.22}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-.03;scene.add(shadow);
  mesh(new T.CylinderGeometry(.66,.47,.78,48),'#b77953',0,.39,0);
  mesh(new T.TorusGeometry(.64,.055,12,48),'#d19a70',0,.79,0).rotation.x=Math.PI/2;
  const soil=mesh(new T.CylinderGeometry(.60,.60,.04,40),'#51412e',0,.79,0);
  stem([[0,.8,0],[-.03,1.35,0],[.02,1.9,0],[-.04,2.42,0]],.026,'#75916a');
  for(let i=0;i<7;i++){
   const side=i%2?-1:1,y=1.08+i*.18,z=i%3===0?.18:-.03;
   const leafGroup=new T.Group();leafGroup.position.set(0,y,z);scene.add(leafGroup);
   const shape=new T.Shape();shape.moveTo(0,0);shape.bezierCurveTo(.19,.32,.59,.35,.72,.13);shape.bezierCurveTo(.51,-.04,.2,-.13,0,0);
   const geo=new T.ShapeGeometry(shape,20);const pos=geo.attributes.position;
   for(let k=0;k<pos.count;k++)pos.setZ(k,Math.sin(pos.getX(k)/.72*Math.PI)*.1);
   geo.computeVertexNormals();const leaf=new T.Mesh(geo,new T.MeshStandardMaterial({color:i%3?'#98b879':'#688d6a',side:T.DoubleSide,roughness:.8}));leafGroup.add(leaf);
   leafGroup.rotation.set(-.2,side===-1?Math.PI:0,-.22-i*.035);
   stem([[0,0,.005],[.33,.11,.1],[.69,.13,.005]],.007,'#bcc998',leafGroup);
  }
  const sensor=mesh(new T.BoxGeometry(.15,.23,.10),'#add6c2',-.43,.96,.22);
  mesh(new T.BoxGeometry(.08,.04,.02),'#405a53',-.43,1.01,.28);
  mesh(new T.CylinderGeometry(.017,.017,.4,8),'#839a92',-.43,.7,.22);
  stem([[1,.04,-.3],[1,1.8,-.3],[.25,1.8,-.3],[.25,1.58,-.3]],.038,'#b7b8a1');
  mesh(new T.TorusGeometry(.075,.018,8,20),'#c89663',1,1.37,-.3);
  const drops=Array.from({length:5},()=>mesh(new T.SphereGeometry(.035,10,8),'#a4e1d7',.25,1.5,-.3));
  let alive=true,watering=false,moving=false,dry=.9,visible=true,raf=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const render=()=>{soil.material.color.set(dry>.6?'#51412e':'#354a3d');drops.forEach(d=>{d.visible=watering;});renderer.render(scene,camera);};
  const fit=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);render();};
  const resize=new ResizeObserver(fit);resize.observe(host);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(host);
  const loop=time=>{if(!alive)return;if(visible&&!document.hidden&&watering&&moving&&!reduced.matches){drops.forEach((d,i)=>{d.position.y=1.55-((time+i*180)%1000)/1000*.7;});renderer.render(scene,camera);}raf=requestAnimationFrame(loop);};
  update=(d,on,play)=>{dry=d;watering=on;moving=play;drops.forEach((drop,i)=>drop.position.y=1.5-i*.13);render();};
  dispose=()=>{alive=false;cancelAnimationFrame(raf);resize.disconnect();observer.disconnect();scene.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});renderer.dispose();renderer.domElement.remove();};
  fit();raf=requestAnimationFrame(loop);
 }catch{host.querySelector('.plant-fallback')?.removeAttribute('hidden');}
 return {host,dispose,update};
}
