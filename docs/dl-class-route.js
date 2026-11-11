// Ruta de la clase de los encuentros 3 y 4 de Deep Learning: qué se hace y en qué orden.
// Cada paso corresponde, en el mismo orden, a un bloque de SESSION_BLOCKS.dl; las horas solo se muestran al docente.
import {getSessionPlan} from './session-plans.js?v=1';
import {encounterForTopic,colabNotebookUrl} from './encounter-notebooks.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const notebook=id=>colabNotebookUrl(encounterForTopic(id).file,id);
const KIND_LABEL={apertura:'Apertura',tema:'Explicación',pausa:'Pausa',practica:'Práctica',cierre:'Cierre'};

export const CLASS_ROUTES={
 2:{number:3,lead:'Siete pasos. Primero se explican los tres temas con sus figuras; después se practican los tres en un mismo cuaderno.',steps:[
  {kind:'apertura',short:'Apertura',title:'Apertura',does:'Pregunta inicial: «No es malo, es buenísimo» frente a «No es buenísimo, es malo». Repaso de dos ideas del encuentro 2: representación y salida.',href:'#tema/dl-secuencias',cta:'Abrir la pregunta'},
  {kind:'tema',short:'RNN y LSTM',topic:'dl-secuencias',title:'Tema 1 · RNN y LSTM',does:'Idea y teléfono roto → figura de la memoria que se desvanece → figura de las tres compuertas → vocabulario.',href:'#tema/dl-secuencias',cta:'Abrir el tema'},
  {kind:'tema',short:'Atención',topic:'dl-atencion',title:'Tema 2 · Atención',does:'Idea y biblioteca → figura de la consulta sobre cuatro registros → matriz de autoatención → vocabulario.',href:'#tema/dl-atencion',cta:'Abrir el tema'},
  {kind:'pausa',short:'Pausa',title:'Pausa',does:''},
  {kind:'tema',short:'Transformer',topic:'dl-transformers',title:'Tema 3 · Transformer',does:'Idea y mesa redonda → recorrido en seis etapas → experimento sin posición → vocabulario.',href:'#tema/dl-transformers',cta:'Abrir el tema'},
  {kind:'practica',short:'Colab',title:'Práctica en Colab',does:'Cuaderno del encuentro 3, un tema a la vez: LSTM con ventana de 12 lecturas, atención con Q, K y V, y Transformer entrenado.',colab:'dl-secuencias',cta:'Abrir el cuaderno'},
  {kind:'cierre',short:'Cierre',title:'Cierre',does:'Seis tarjetas de repaso sin nota y glosario del encuentro.',href:'#tema/dl-transformers',cta:'Ir al tema con el cierre'}]},
 3:{number:4,lead:'Siete pasos. Se explican detección y evaluación con la misma canastilla, se construye la regla de revisión y se practica todo en un mismo cuaderno.',steps:[
  {kind:'apertura',short:'Apertura',title:'Apertura',does:'Pregunta inicial: ¿cuántos frutos hay en la canastilla y de qué tipo? Repaso del encuentro 3 en una frase.',href:'#tema/dl-yolo',cta:'Abrir la pregunta'},
  {kind:'tema',short:'YOLO',topic:'dl-yolo',title:'Tema 1 · YOLO',does:'Idea y cinta sobre la foto → figura de las 12 propuestas: corte de confianza, rejilla y repetidas → vocabulario.',href:'#tema/dl-yolo',cta:'Abrir el tema'},
  {kind:'pausa',short:'Pausa',title:'Pausa',does:''},
  {kind:'tema',short:'IoU, precisión y recall',topic:'dl-evaluacion',title:'Tema 2 · IoU, precisión y recall',does:'Idea y hoja de respuestas → figura de IoU con caja arrastrable → precisión y recall sobre la canastilla → vocabulario.',href:'#tema/dl-evaluacion',cta:'Abrir el tema'},
  {kind:'tema',short:'Integración',topic:'dl-integracion',title:'Tema 3 · Integración',does:'Idea y filtro de aeropuerto → figura del corte y los costes → vocabulario.',href:'#tema/dl-integracion',cta:'Abrir el tema'},
  {kind:'practica',short:'Colab',title:'Práctica en Colab',does:'Cuaderno del encuentro 4, un tema a la vez: detectar en una foto real, calcular IoU y errores, y comparar costes de revisión.',colab:'dl-yolo',cta:'Abrir el cuaderno'},
  {kind:'cierre',short:'Cierre',title:'Cierre',does:'Seis tarjetas de repaso sin nota, glosario del encuentro y cierre del diplomado.',href:'#tema/dl-integracion',cta:'Ir al tema con el cierre'}]}
};
export const classRouteIndex=topicId=>{for(const [index,route] of Object.entries(CLASS_ROUTES))if(route.steps.some(s=>s.topic===topicId))return Number(index);return null;};

// Ruta completa para la página de la asignatura: línea de tiempo sobria. Con docente y horario, cada paso muestra su hora.
export function renderClassRoute(index,{teacher=false,meeting=null}={}){
 const route=CLASS_ROUTES[index];if(!route)return '';
 const plan=teacher&&meeting?getSessionPlan('dl',index,meeting):null;
 return `<div class="class-route" data-class-route="${route.number}"><h4>Ruta de la clase</h4><p class="class-route-lead">${esc(route.lead)}</p><ol class="class-route-list">${route.steps.map((s,i)=>{const row=plan?.rows[i],link=s.colab?notebook(s.colab):s.href;
  return `<li class="class-route-step is-${s.kind}"><span class="class-route-number" aria-hidden="true">${i+1}</span><div class="class-route-body"><p class="class-route-kind">${KIND_LABEL[s.kind]}</p><strong>${esc(s.title)}</strong>${s.does?`<p>${esc(s.does)}</p>`:''}${link?`<a href="${esc(link)}"${s.colab?' target="_blank" rel="noopener"':''}>${esc(s.cta)} →</a>`:''}</div>${row?`<span class="class-route-time"><b>${row.from}–${row.to}</b><small>${row.minutes} min</small></span>`:''}</li>`;}).join('')}</ol></div>`;
}

// Franja compacta para la página de cada tema: una sola línea con los siete pasos y el actual.
export function renderTopicRoute(topicId){
 const index=classRouteIndex(topicId);if(index===null)return '';
 const route=CLASS_ROUTES[index],at=route.steps.findIndex(s=>s.topic===topicId);
 return `<nav class="class-route is-compact" data-class-route="${route.number}" aria-label="Ruta de la clase del encuentro ${route.number}"><p class="class-route-title">Ruta de la clase · Encuentro ${route.number} · Paso ${at+1} de ${route.steps.length}</p><ol class="class-route-line">${route.steps.map((s,i)=>{const inner=`<span class="class-route-dot" aria-hidden="true">${i+1}</span><span class="class-route-label">${esc(s.short)}</span>`,cls=i<at?'is-done':i===at?'is-current':'is-ahead';
  return `<li class="${cls}"${i===at?' aria-current="step"':''}>${s.topic&&i!==at?`<a href="#tema/${s.topic}">${inner}</a>`:`<span class="class-route-item">${inner}</span>`}</li>`;}).join('')}</ol></nav>`;
}
