const BASE='recursos/dl-encuentro-2/';
const TOPIC_EXAMPLES={'dl-vision':1,'dl-cnn':4,'dl-transferencia':7};

export function renderDLExtraResources(courseId,encounterIndex){
 if(courseId!=='dl'||encounterIndex!==1)return '';
 return `<section class="dl-extra-resource" aria-label="Recurso adicional de Deep Learning, Encuentro 2"><h4>Apoyo visual adicional del Encuentro 2</h4><p>Explora píxeles, filtros y transferencia con ejemplos que puedes cambiar. Complementa los tres temas del encuentro y conserva un botón para volver al aula.</p><a class="button secondary" href="${BASE}#ejemplo-4">Abrir apoyo visual del Encuentro 2 →</a></section>`;
}

export function renderDLTopicExtraResource(topicId){
 const example=TOPIC_EXAMPLES[topicId];if(!example)return '';
 return `<p class="dl-extra-resource-link"><a class="button secondary" href="${BASE}#ejemplo-${example}">Abrir apoyo visual del Encuentro 2 →</a></p>`;
}
