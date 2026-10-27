import {ML_DEFINITIONS} from './definition-catalog-ml.js';
import {DL_DEFINITIONS} from './definition-catalog-dl.js';
import {SUPPORT_DEFINITIONS} from './definition-catalog-support.js';

export const DEFINITIONS=[...ML_DEFINITIONS,...DL_DEFINITIONS,...SUPPORT_DEFINITIONS];
const norm=value=>String(value).replace(/α/g,'alpha').replace(/γ/g,'gamma').replace(/ε/g,'epsilon').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').replace(/²/g,'2').replace(/[^a-z0-9]/g,'');
const byId=new Map(DEFINITIONS.map(d=>[d.id,d]));
export const getDefinition=id=>byId.get(id);
export function findDefinition(term){const key=norm(term);return key?DEFINITIONS.find(d=>[d.term,...d.aliases].some(a=>norm(a)===key)):undefined;}
export function definitionName(d){return d.expansion?`${d.term}: ${d.expansion} (${d.translation}). `:d.translation&&norm(d.translation)!==norm(d.term)?`${d.term}: ${d.translation}. `:'';}
export function definitionText(d,{example=true}={}){return definitionName(d)+d.meaning+' '+d.reading+(example?' '+d.example:'');}
export function reviewedGlossary(base){
 const used=new Set(),rows=[];
 for(const [term,meaning] of base){const d=findDefinition(term);if(!d){rows.push([term,meaning]);continue;}if(used.has(d.id))continue;used.add(d.id);rows.push(glossaryRow(d));}
 for(const d of DEFINITIONS)if(!used.has(d.id))rows.push(glossaryRow(d));
 return rows;
}
function glossaryRow(d){return [d.term+(d.translation&&norm(d.translation)!==norm(d.term)?' · '+d.translation:''),definitionText(d),d.aliases.join(' ')];}

// Los dos primeros encuentros se consultan en la biblioteca común, sin alterar sus páginas.
export const MEETING_DEFINITION_IDS={
 'ml-1':['ml','mae','ols','rmse','nan'],
 'ml-2':['tp','fp','fn','tn','precision','recall','accuracy','f1','knn','svm'],
 'ml-3':['dbscan','pca','pc','mae','rmse','r2'],
 'ml-4':['mae','rl','q-learning','alpha','gamma','epsilon'],
 'dl-1':['dl','relu','tanh','mse','bce','bce-logits','adam'],
 'dl-2':['cnn','rgb','yolo','coco','cpu'],
 'dl-3':['rnn','lstm','mae','qkv','softmax','transformer'],
 'dl-4':['yolo','iou','tp','fp','fn','ap','map','csv','json']
};
export const TOPIC_DEFINITION_IDS={
 'ml-problema':['ml'], 'ml-preparacion':['nan'], 'ml-regresion':['mae','ols','rmse'],
 'ml-clasificacion':['knn','svm'], 'ml-metricas':['tp','fp','fn','tn','precision','recall','accuracy','f1'], 'ml-umbral':['precision','recall'],
 'ml-clustering':['dbscan','k-means','mean-shift'], 'ml-pca':['pca','pc','varianza','varianza-explicada'],
 'ml-ensambles':['mae','rmse','r2','bagging','boosting','random-forest'], 'ml-series':['mae'],
 'ml-refuerzo':['rl','q-learning','alpha','gamma','epsilon'], 'ml-integracion':['mae'],
 'dl-redes':['dl','relu','sigmoide'], 'dl-activaciones':['relu','sigmoide','tanh'],
 'dl-entrenamiento':['mse','bce','bce-logits','adam','gradiente','retropropagacion','tasa-aprendizaje'],
 'dl-vision':['rgb','yolo'], 'dl-cnn':['cnn','relu'], 'dl-transferencia':['yolo','coco'],
 'dl-secuencias':['rnn','lstm','mae'], 'dl-atencion':['qkv','softmax'], 'dl-transformers':['transformer','token','embedding'],
 'dl-yolo':['yolo','coco','nms'], 'dl-evaluacion':['iou','tp','fp','fn','ap','map'], 'dl-integracion':[]
};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderGlossary(rows,{open=false}={}){return `<div class="glossary">${rows.map(([term,meaning])=>{const d=findDefinition(term.split(' · ')[0]);return `<details${d?' id="definition-'+esc(d.id)+'"':''}${open?' open':''}><summary>${esc(term)}</summary>${d?`${d.expansion?`<p class="definition-expansion"><b>Nombre en inglés:</b> ${esc(d.expansion)}</p>`:''}<p>${esc(d.meaning)}</p><p><b>Cómo leerlo:</b> ${esc(d.reading)}</p><p><b>Ejemplo:</b> ${esc(d.example)}</p><a class="inline-link" href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">Consultar la fuente ↗</a>`:`<p>${esc(meaning)}</p>`}</details>`;}).join('')}</div>`;}
export function renderMeetingDefinitions(courseId,index){
 const key=courseId+'-'+(index+1);if(['ml-1','ml-2'].includes(key))return '';
 const ids=MEETING_DEFINITION_IDS[key];if(!ids)return '';
 return `<details class="meeting-definitions"><summary>Siglas y términos de este encuentro</summary><p>El nombre completo, su significado y una forma de leerlo. También puedes buscarlos en Mi biblioteca.</p><div class="definition-cards">${ids.map(id=>{const d=getDefinition(id);if(!d)return '';return `<article><h4>${esc(d.term)}${d.translation?' · '+esc(d.translation):''}</h4>${d.expansion?`<p class="definition-expansion">${esc(d.expansion)}</p>`:''}<p>${esc(d.meaning)}</p><p><b>Cómo leerlo:</b> ${esc(d.reading)}</p><p><b>Ejemplo:</b> ${esc(d.example)}</p><a class="inline-link" href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">Consultar la fuente ↗</a></article>`;}).join('')}</div></details>`;
}
