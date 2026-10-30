import {CLUSTER_POINTS,clusterResult,clusterHull,clusterX,clusterY,changedMembership} from './cluster-model.js';
const fmt=(n,d=1)=>Number(n).toLocaleString('es-CO',{maximumFractionDigits:d});
const color=label=>label<0?'var(--cl-noise)':`var(--cl-${label%8})`;
export function mountClusterExplorer(el){
 const points=CLUSTER_POINTS;
 el.innerHTML=`<section class="simulator cluster-explorer" data-plot-expanded="false"><div class="sim-header"><h3>¿Qué cambia cuando cambia la cercanía?</h3><span class="pill">29 CENTROS SIMULADOS</span></div>
 <p class="cl-intro">Amplía el radio para conectar vecinos. Exige más puntos para formar un núcleo. Selecciona un centro para ver por qué pertenece a un grupo.</p>
 <div class="cl-presets" aria-label="Comparar radios con los mismos datos"><span>Compara</span>${[3,10,50].map(r=>`<button type="button" class="button secondary small" data-cl-radius="${r}">Radio ${r}</button>`).join('')}<button type="button" class="cl-reset" id="cluster-reset">Reiniciar</button></div>
 <div class="cl-controls"><label for="eps"><span>Radio de vecindad <output id="eps-out" for="eps"></output></span><input id="eps" type="range" min="3" max="65" step="1" value="10"><small>Distancia máxima entre vecinos, en puntos porcentuales.</small></label><label for="minpts"><span>Mínimo para ser núcleo <output id="minpts-out" for="minpts"></output></span><input id="minpts" type="range" min="2" max="15" step="1" value="4"><small>Incluye al propio centro. Un mínimo mayor exige más densidad.</small></label></div>
 <div class="cl-summary"><strong id="cluster-count"></strong><span id="cluster-change" role="status" aria-live="polite"></span></div>
 <div class="cl-workspace"><div class="cl-chart"><div class="sim-view-actions"><button type="button" class="button secondary small" data-plot-expand aria-pressed="false">Ampliar etiquetas</button></div><div id="visual"><div class="sim-plot-scroll" tabindex="0" role="region" aria-label="Gráfico de cercanía entre 29 centros"><svg class="plot" viewBox="0 0 640 640" role="group" aria-label="Selecciona un centro para inspeccionar sus vecinos"><defs><clipPath id="cluster-clip"><rect x="72" y="24" width="528" height="528"/></clipPath></defs>
 ${[0,25,50,75,100].map(v=>`<line x1="72" y1="${clusterY(v)}" x2="600" y2="${clusterY(v)}" class="cl-grid"/><line x1="${clusterX(v)}" y1="24" x2="${clusterX(v)}" y2="552" class="cl-grid"/><text x="${clusterX(v)}" y="577" text-anchor="middle" class="cl-tick">${v}</text><text x="58" y="${clusterY(v)+4}" text-anchor="end" class="cl-tick">${v}</text>`).join('')}
 <text x="336" y="617" text-anchor="middle" class="cl-axis">Capacidad utilizada (%)</text><text transform="translate(20 288) rotate(-90)" text-anchor="middle" class="cl-axis">Lotes pendientes (%)</text>
 <g clip-path="url(#cluster-clip)"><g id="cluster-hulls"></g><circle id="cluster-radius" fill="none" class="cl-radius"/><g id="cluster-links"></g></g>
 ${points.map((p,i)=>`<g role="button" tabindex="0" data-cl-point="${i}" aria-label="Inspeccionar centro ${i+1}"><circle id="cluster-dot-${i}" cx="${clusterX(p[0])}" cy="${clusterY(p[1])}" r="6"/><title id="cluster-title-${i}">Centro ${i+1}</title></g>`).join('')}
 <circle id="cluster-selection" r="12" fill="none" class="cl-selection"/><text id="cluster-selected-label" text-anchor="middle" class="cl-selected-label"></text></svg></div></div>
 <div id="cluster-legend" class="cl-legend" aria-label="Grupos encontrados"></div><p class="cl-chart-note">Posiciones fijas · misma escala en ambos ejes. El círculo muestra la cercanía del centro elegido y se recorta al borde del gráfico.</p></div>
 <aside class="cl-inspector"><label for="cluster-point">Inspeccionar un centro<select id="cluster-point">${points.map((_,i)=>`<option value="${i}">Centro ${i+1}</option>`).join('')}</select></label><div class="cl-profile"><strong id="cluster-profile"></strong><span id="cluster-coordinates"></span></div><p id="cluster-reading" role="status" aria-live="polite"></p><div class="cl-neighbor-meter"><span id="cluster-neighbor-fill"></span></div><p id="cluster-comparison"></p><h4>Dentro del radio</h4><div id="cluster-neighbors" class="cl-neighbors"></div><details class="cl-distances"><summary>Ver las distancias de los 29 centros</summary><div class="cl-table-scroll" tabindex="0" role="region" aria-label="Distancias al centro seleccionado"><table><thead><tr><th>Centro</th><th>Distancia</th><th>¿Vecino?</th></tr></thead><tbody id="cluster-distances"></tbody></table></div></details></aside></div>
 <details class="cl-explanation"><summary>Cómo leer los puntos y la cuenta</summary><p>DBSCAN conecta núcleos cercanos: un núcleo alcanza el mínimo de puntos dentro del radio, incluyéndose. Un punto de borde pertenece a un grupo por su cercanía a un núcleo; no alcanza el mínimo. Un punto gris queda sin grupo con esta configuración.</p><p>Dos columnas ficticias: capacidad utilizada (%) y lotes pendientes (%), comparadas con el mismo peso. La distancia combina las diferencias en ambas columnas: √(diferencia X² + diferencia Y²). Un color identifica un grupo; no califica su calidad. Las zonas de color orientan la lectura; la pertenencia la calcula DBSCAN.</p><p id="cluster-distance-example"></p><p>El radio limita la distancia entre vecinos, no entre todos los miembros de un grupo: varios núcleos pueden conectarse en cadena. El explorador conserva los 29 datos de la guía al cambiar los controles.</p></details></section>`;
 const q=s=>el.querySelector(s),eps=q('#eps'),minimum=q('#minpts'),select=q('#cluster-point');
 let previous=null,lastControls='';
 function draw(){
  const state=clusterResult(Number(eps.value),Number(minimum.value),Number(select.value));
  const {selected,groups,neighbors,labels,roles,min}=state,center=points[selected],controlKey=eps.value+'|'+minimum.value;
  q('#eps-out').textContent=state.eps+' pp';eps.setAttribute('aria-valuetext',state.eps+' puntos porcentuales');
  q('#minpts-out').textContent=String(min);minimum.setAttribute('aria-valuetext',min+' puntos, incluido el propio centro');
  q('#cluster-count').textContent=groups.length+' · '+state.noise+' sin grupo';
  q('#cluster-count').setAttribute('aria-label',groups.length+' grupos y '+state.noise+' centros sin grupo');
  const changed=changedMembership(previous,state);
  if(!previous)q('#cluster-change').textContent='Grupos encontrados · selecciona un punto para seguir sus vecinos.';
  else if(controlKey!==lastControls)q('#cluster-change').textContent=changed?`${changed} centros cambiaron de pertenencia respecto al ajuste anterior.`:'La pertenencia no cambió. Observa el radio, los vecinos y el requisito de núcleo.';
  q('#cluster-profile').textContent='Centro '+(selected+1)+' · '+(labels[selected]<0?'sin grupo':'grupo '+(labels[selected]+1));
  q('#cluster-coordinates').textContent=fmt(center[0])+' % de capacidad · '+fmt(center[1])+' % pendiente';
  q('#cluster-reading').textContent=`Centro ${selected+1}: ${neighbors.length} vecinos dentro del radio, incluyéndose a sí mismo. `+(roles[selected]==='núcleo'?`Es núcleo: alcanza el mínimo de ${min}.`:roles[selected]==='borde'?'Es un punto de borde: está conectado a un núcleo, pero no alcanza el mínimo.':'Queda sin grupo: no es núcleo ni está conectado como borde.');
  q('#cluster-comparison').textContent=neighbors.length+' puntos en el radio / '+min+' necesarios para ser núcleo.';
  q('#cluster-neighbor-fill').setAttribute('style','width:'+Math.min(100,neighbors.length/min*100)+'%');
  q('#cluster-radius').setAttribute('cx',clusterX(center[0]));q('#cluster-radius').setAttribute('cy',clusterY(center[1]));q('#cluster-radius').setAttribute('r',state.eps*4.4);
  q('#cluster-selection').setAttribute('cx',clusterX(center[0]));q('#cluster-selection').setAttribute('cy',clusterY(center[1]));
  q('#cluster-selected-label').setAttribute('x',clusterX(center[0]));q('#cluster-selected-label').setAttribute('y',clusterY(center[1])-20);q('#cluster-selected-label').textContent='C'+(selected+1);
  const near=new Set(neighbors.map(v=>v.id));
  points.forEach((p,i)=>{const dot=q('#cluster-dot-'+i);dot.setAttribute('fill',roles[i]==='borde'?'var(--paper)':color(labels[i]));dot.setAttribute('stroke',roles[i]==='borde'?color(labels[i]):'var(--paper)');dot.setAttribute('stroke-width',roles[i]==='borde'?3:1.5);dot.setAttribute('opacity',i===selected||near.has(i)?1:.68);dot.setAttribute('r',i===selected?7.5:6);q('#cluster-title-'+i).textContent=`Centro ${i+1}: ${fmt(p[0])} % de capacidad, ${fmt(p[1])} % pendiente; ${roles[i]}`;});
  q('#cluster-links').innerHTML=neighbors.filter(v=>v.id!==selected).map(v=>`<line x1="${clusterX(center[0])}" y1="${clusterY(center[1])}" x2="${clusterX(points[v.id][0])}" y2="${clusterY(points[v.id][1])}" class="cl-link"/>`).join('');
  q('#cluster-hulls').innerHTML=groups.map(g=>`<polygon points="${clusterHull(g.ids).map(p=>clusterX(p[0])+','+clusterY(p[1])).join(' ')}" fill="${color(g.label)}" stroke="${color(g.label)}" class="cl-hull"/>`).join('');
  q('#cluster-legend').innerHTML=groups.map(g=>`<span><i style="background:${color(g.label)}"></i>Grupo ${g.label+1} · ${g.ids.length}</span>`).join('')+`<span><i style="background:var(--cl-noise)"></i>Sin grupo · ${state.noise}</span>`;
  q('#cluster-neighbors').innerHTML=neighbors.map(v=>`<button type="button" class="cl-neighbor" data-cl-neighbor="${v.id}">C${v.id+1}<small>${v.id===selected?'él mismo':fmt(v.distance)+' pp'}</small></button>`).join('');
  q('#cluster-neighbors').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{select.value=b.dataset.clNeighbor;draw();}));
  q('#cluster-distances').innerHTML=state.distances[selected].map((distance,id)=>({distance,id})).sort((a,b)=>a.distance-b.distance).map(v=>`<tr><td>C${v.id+1}</td><td>${fmt(v.distance,2)} pp</td><td>${v.distance<=state.eps?'Sí':'No'}</td></tr>`).join('');
  const other=neighbors.find(v=>v.id!==selected)||state.distances[selected].map((distance,id)=>({distance,id})).filter(v=>v.id!==selected).sort((a,b)=>a.distance-b.distance)[0];
  const dx=points[other.id][0]-center[0],dy=points[other.id][1]-center[1];
  q('#cluster-distance-example').textContent=`Centro ${selected+1} a centro ${other.id+1}: diferencia X = ${fmt(dx,2)} pp; diferencia Y = ${fmt(dy,2)} pp. Distancia = √((${fmt(dx,2)})² + (${fmt(dy,2)})²) ≈ ${fmt(other.distance,2)} pp. ${other.distance<=state.eps?'Está dentro':'Está fuera'} del radio ${state.eps}. La comparación usa las coordenadas completas, sin redondear.`;
  el.querySelectorAll('[data-cl-radius]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.clRadius)===state.eps)));
  previous=state;lastControls=controlKey;
 }
 let lastInput='';const update=()=>{const key=eps.value+'|'+minimum.value+'|'+select.value;if(lastInput===key)return;lastInput=key;draw();};
 [eps,minimum,select].forEach(control=>{control.addEventListener('input',update);control.addEventListener('change',update);});
 el.querySelectorAll('[data-cl-radius]').forEach(b=>b.addEventListener('click',()=>{eps.value=b.dataset.clRadius;update();}));
 el.querySelectorAll('[data-cl-point]').forEach(b=>{const choose=()=>{select.value=b.dataset.clPoint;update();};b.addEventListener('click',choose);b.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});});
 q('#cluster-reset').addEventListener('click',()=>{eps.value=10;minimum.value=4;select.value=0;previous=null;lastInput='';update();});
 const expand=q('[data-plot-expand]');expand.addEventListener('click',()=>{const section=q('.simulator'),enabled=section.dataset.plotExpanded!=='true';section.dataset.plotExpanded=String(enabled);expand.setAttribute('aria-pressed',String(enabled));expand.textContent=enabled?'Ver gráfico completo':'Ampliar etiquetas';});
 update();
}
