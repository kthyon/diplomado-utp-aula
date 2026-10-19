import {FIRST_FARMS,NEW_FARMS,farmPrediction} from './ml-example-models.js';
const fmt=(v,n=2)=>v.toLocaleString('es-CO',{minimumFractionDigits:n,maximumFractionDigits:n});
export function mountProblemExplorer(el){
  let stage=0,selected='B';
  const labels=['Conocer los datos','Aprender un patrón','Predecir un caso nuevo','Comprobar el resultado'];
  el.innerHTML=`<section class="simulator first-prediction"><div class="sim-header"><h3>De cuatro ejemplos a una predicción</h3><span class="pill">DATOS INVENTADOS</span></div><ol class="case-flow">${labels.map((label,i)=>`<li data-stage="${i}"><span>${i+1}</span>${label}</li>`).join('')}</ol><div id="problem-stage" tabindex="-1"></div><div class="case-actions"><button type="button" id="problem-back" class="button secondary small">Volver</button><button type="button" id="problem-next" class="button small"></button></div><p class="field-note">Lluvia acumulada antes de cosechar, en un mismo periodo. Este patrón se construyó para enseñar el proceso; no representa una relación agronómica causal.</p></section>`;
  const q=s=>el.querySelector(s);
  function render(){
    const farm=NEW_FARMS.find(f=>f.name===selected),model=farmPrediction(farm.rain),error=Math.abs(farm.yield-model.prediction);
    el.querySelectorAll('[data-stage]').forEach((li,i)=>{li.classList.toggle('current',i===stage);if(i===stage)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
    const table=`<div class="learning-table-wrap"><table class="learning-table"><caption>Cuatro fincas históricas: ambas medidas ya se conocen</caption><thead><tr><th scope="col">Finca</th><th scope="col">Entrada: lluvia (mm)</th><th scope="col">Respuesta: rendimiento (t/ha)</th></tr></thead><tbody>${FIRST_FARMS.map(f=>`<tr><th scope="row">${f.name}</th><td>${f.rain}</td><td>${fmt(f.yield)}</td></tr>`).join('')}</tbody></table></div>`;
    const copy=[
      '<p>La cooperativa necesita estimar la cosecha antes de recogerla. Cada fila corresponde a una finca en una temporada. Usaremos la lluvia conocida para estimar el rendimiento que todavía no conocemos.</p>',
      '<p>Comparamos las cuatro parejas. En este ejemplo construido, 100 mm adicionales se acompañan de 0,50 t/ha más. Ajustamos una recta a esas parejas; no usamos todavía la respuesta de ninguna finca nueva.</p><div class="learning-result"><b>Patrón aprendido con estas filas</b><p>Rendimiento estimado = 0,005 × lluvia</p><small>Una regla de este ejemplo, no una recomendación de riego.</small></div>',
      '<p>Ahora usamos la regla con una finca que no estuvo entre los cuatro ejemplos. Conocemos su lluvia; mantenemos su rendimiento reservado para comprobar la predicción.</p>',
      '<p>Revelamos el rendimiento reservado y lo comparamos con la estimación. Este dato no se utilizó para ajustar la recta.</p>'
    ];
    q('#problem-stage').innerHTML=`<h4>${stage+1}. ${labels[stage]}</h4>${copy[stage]}${stage<2?table:`<label class="case-select" for="new-farm">Elige una finca reservada<select id="new-farm">${NEW_FARMS.map(f=>`<option value="${f.name}" ${f.name===selected?'selected':''}>Finca ${f.name} · ${f.rain} mm</option>`).join('')}</select></label><div class="case-facts"><div><small>Entrada conocida</small><strong>${farm.rain} mm</strong></div><div><small>Predicción del modelo</small><strong>${fmt(model.prediction)} t/ha</strong></div><div><small>Rendimiento reservado</small><strong>${stage===3?fmt(farm.yield)+' t/ha':'Sin revelar'}</strong></div></div><p>${fmt(model.slope,3)} × ${farm.rain} = <b>${fmt(model.prediction)} t/ha estimadas</b>.</p>${stage===3?`<div class="learning-result"><b>Error en esta finca: ${fmt(error)} t/ha</b><p>|${fmt(farm.yield)} − ${fmt(model.prediction)}| = ${fmt(error)}. Predecir no es conocer con certeza: incluso un patrón perfecto en las cuatro filas puede fallar en una nueva.</p></div>`:''}`}`;
    q('#problem-back').disabled=stage===0;
    q('#problem-next').textContent=['Aprender con estas cuatro fincas →','Probar en una finca nueva →','Revelar el dato y comparar →','Volver a empezar ↺'][stage];
    q('#new-farm')?.addEventListener('change',e=>{selected=e.target.value;stage=2;render();q('#new-farm').focus();});
  }
  q('#problem-next').onclick=()=>{stage=stage===3?0:stage+1;render();q('#problem-stage').focus();};
  q('#problem-back').onclick=()=>{stage=Math.max(0,stage-1);render();q('#problem-stage').focus();};
  render();
}
