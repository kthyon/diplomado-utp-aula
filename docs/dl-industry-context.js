// Fuentes primarias consultadas el 9 de noviembre de 2026.
// Los ejemplos de clase no se presentan como instalaciones industriales.
export const INDUSTRY_CONTEXT={
 'dl-secuencias':{
  scenario:'La cooperativa podría usar su historial de entregas para anticipar la recepción del próximo día y preparar espacio; es un uso propuesto.',
  why:'El orden permite estudiar relaciones temporales; nuestra regla de memoria solo explica un resumen, todavía no pronostica.',
  when:'Si hay registros fechados representativos y un modelo entrenado mejora frente a repetir la última entrega en días reservados.',
  source:{title:'Nature · Global prediction of extreme floods in ungauged watersheds (2024)',url:'https://www.nature.com/articles/s41586-024-07145-1'}
 },
 'dl-atencion':{
  scenario:'Para estudiar esa misma recepción, la cooperativa podría combinar registros de días disponibles según una consulta concreta; es una propuesta, no un sistema instalado.',
  why:'Permite construir distintos contextos sin cambiar los registros; cada aporte se puede seguir, pero la mezcla no decide por sí sola.',
  when:'Si una media fija no basta y hay datos para aprender y comprobar qué combinaciones ayudan a la tarea.',
  source:{title:"Google Research · Google's Neural Machine Translation System: Bridging the Gap between Human and Machine Translation (2016)",url:'https://research.google/pubs/googles-neural-machine-translation-system-bridging-the-gap-between-human-and-machine-translation/'}
 },
 'dl-transformers':{
  scenario:'Con el mismo diario de recepción, un Transformer podría aprender una tarea sobre las entregas; aquí solo estudiamos su estructura, no desplegamos un modelo.',
  why:'Permite representar posiciones y relaciones antes de producir una respuesta que debe comprobarse.',
  when:'Para comparar nuestros dos extremos basta una regla; solo se justifica explorar esta arquitectura con tareas más complejas, datos suficientes y evaluación frente a alternativas sencillas.',
  source:{title:'Google Research · Recent Advances in Google Translate (2020)',url:'https://research.google/blog/recent-advances-in-google-translate/'}
 },
 'dl-yolo':{
  scenario:'Al recibir esa cosecha, la cooperativa podría localizar frutos en las fotos y conservar sus propuestas en un registro; es una aplicación propuesta.',
  why:'Relaciona cada caja con su imagen, categoría y puntuación para poder revisarla después; no confirma automáticamente el inventario.',
  when:'Si necesitas ubicación, hay imágenes anotadas representativas y compruebas errores y velocidad frente a conteo manual o sensores sencillos.',
  source:{title:'Ultralytics · Computer vision in manufacturing',url:'https://www.ultralytics.com/solutions/computer-vision-in-manufacturing'}
 },
 'dl-evaluacion':{
  scenario:'Antes de usar ese registro de recepción, la cooperativa debería comparar las cajas propuestas con objetos anotados; nuestra comparación sigue siendo sintética.',
  why:'IoU permite comprobar ubicación y, junto con la categoría, distinguir aciertos, propuestas incorrectas y objetos omitidos.',
  when:'Si necesitas localizar y tienes referencias fiables de lotes representativos; para comprobar solo presencia, compara también con un clasificador o una regla sencilla.',
  source:{title:'Ultralytics · Performance Metrics Deep Dive',url:'https://docs.ultralytics.com/guides/yolo-performance-metrics/'}
 },
 'dl-integracion':{
  scenario:'Tras registrar y comprobar la recepción, la cooperativa podría decidir qué granos revisar; las puntuaciones de defecto del ejercicio son dadas, distintas de las de YOLO.',
  why:'Permite comparar carga de revisión y defectos aceptados antes de elegir una política; los puntos de clase no son precios reales.',
  when:'Si se miden costes, errores y capacidad, comparando con revisar todo o reglas simples y validando el umbral para ese proceso.',
  source:{title:'AWS · Amazon Textract: Best Practices',url:'https://docs.aws.amazon.com/textract/latest/dg/textract-best-practices.html'}
 }
};

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderIndustryContext(id){
 const item=Object.hasOwn(INDUSTRY_CONTEXT,id)?INDUSTRY_CONTEXT[id]:null;if(!item)return '';
 return `<div class="dl-industry" data-dl-industry="${esc(id)}"><h3>Dónde sirve en la industria</h3><p><strong>Escenario:</strong> ${esc(item.scenario)}</p><p><strong>Por qué usarlo:</strong> ${esc(item.why)}</p><p><strong>Cuándo tiene sentido:</strong> ${esc(item.when)}</p><p class="dl-industry-source">Misma idea en industria: <a href="${esc(item.source.url)}" title="${esc(item.source.title)}" target="_blank" rel="noopener noreferrer">Ver una aplicación documentada ↗</a></p></div>`;
}
