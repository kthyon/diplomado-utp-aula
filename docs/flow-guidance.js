const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const WELCOME_MESSAGES=[
 'Una pregunta puede ser un buen comienzo. Cambia un dato, mira qué ocurre y trae tus hallazgos a la próxima clase.',
 'Este es tu espacio para probar ideas. Explora un ejemplo, compara dos escenarios y busca qué explica la diferencia.',
 'Vamos de la curiosidad a la práctica. Elige algo que quieras entender y juega con sus datos: el gráfico puede darte una pista.'
];
export function getWelcome({name='',now=new Date(),variant=0}={}){
 const hour=now.getHours();
 const period=hour>=5&&hour<12?'morning':hour>=12&&hour<18?'afternoon':'night';
 const salutation={morning:'Buenos días',afternoon:'Buenas tardes',night:'Buenas noches'}[period];
 const firstName=String(name??'').trim().replace(/^(?:ing\.?|dr\.?|dra\.?|prof\.?)\s+/i,'').split(/\s+/)[0];
 const index=Number.isInteger(variant)?((variant%WELCOME_MESSAGES.length)+WELCOME_MESSAGES.length)%WELCOME_MESSAGES.length:0;
 return {period,heading:'¡'+salutation+(firstName?', '+firstName:'')+'!',message:WELCOME_MESSAGES[index]};
}
export function renderFlowGuide(options={}){
 const welcome=getWelcome(options);
 const symbol=welcome.period==='night'?'<path d="M20 15.3A8.5 8.5 0 0 1 8.7 4 8.5 8.5 0 1 0 20 15.3Z"/>':welcome.period==='morning'?'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>':'<path d="M3 16h18M6 13a6 6 0 0 1 12 0M12 2v2M4 6l2 2m14-2-2 2M5 20h14"/>';
 return `<section class="flow-guide welcome-card" aria-labelledby="flow-guide-title"><div class="welcome-heading"><span class="welcome-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${symbol}</svg></span><div><span class="welcome-eyebrow">¿QUÉ VAS A DESCUBRIR HOY?</span><h2 id="flow-guide-title">${esc(welcome.heading)}</h2></div></div><p class="welcome-message">${esc(welcome.message)}</p><details class="welcome-help"><summary>¿Necesitas una mano para empezar?</summary><ol class="flow-steps"><li><b>1 · Entra con tu nombre</b><span>Tu avance queda en este navegador. El registro conectado permite guardarlo en el curso; consulta su estado en tu perfil.</span></li><li><b>2 · Elige una asignatura</b><span>Consulta sus encuentros y calendario. Los materiales abiertos permanecen disponibles.</span></li><li><b>3 · Recorre un tema</b><span>Lee el concepto y sigue el ejemplo resuelto.</span></li><li><b>4 · Prueba y construye</b><span>Usa la práctica guiada y el bloque indicado de Colab. Si ya tienes una copia personal del mismo cuaderno, continúa en ella.</span></li><li><b>5 · Registra tu avance</b><span>Pulsa «Marcar como visto» y consulta tu porcentaje en Mi progreso.</span></li></ol><p class="flow-note"><strong>El porcentaje registra temas marcados como vistos.</strong> No comprueba asistencia, ejecución de Colab ni entregas.</p><details class="flow-spaces"><summary>¿Qué espacio de práctica elijo?</summary><dl><div><dt>Práctica guiada del tema</dt><dd>Conecta el ejemplo con una construcción en tu copia de Colab y tu bitácora.</dd></div><div><dt>Explora una idea</dt><dd>Casos breves para cambiar valores y leer qué ocurre en el gráfico.</dd></div><div><dt>Laboratorio visual</dt><dd>Tres experimentos para seguir cálculos de aprendizaje, distancias y decisiones.</dd></div></dl><p>Estos apoyos no marcan temas como vistos automáticamente. Puedes volver a ellos cuando los necesites; no son entregas obligatorias.</p></details></details></section>`;
}

export function renderLessonFlow({courseId,courseTitle,classIndex,topicIndex,topicCount=3}={}){
 const meeting=Number.isInteger(classIndex)&&classIndex>=0?classIndex+1:null;
 const topic=Number.isInteger(topicIndex)&&topicIndex>=0?topicIndex+1:null;
 const count=Number.isInteger(topicCount)&&topicCount>0?topicCount:3;
 const courseLink=['ml','dl'].includes(courseId)?`<a href="#curso/${esc(courseId)}">${esc(courseTitle||courseId.toUpperCase())}</a>`:esc(courseTitle||'Tu asignatura');
 return `<section class="flow-lesson" aria-label="Tu lugar en el recorrido"><p class="flow-position">${courseLink}${meeting?' <span aria-hidden="true">·</span> Encuentro '+meeting:''}${topic?' <span aria-hidden="true">·</span> Tema '+topic+' de '+count:''}</p><p class="flow-study"><b>Para estudiar:</b> concepto → ejemplo resuelto → práctica guiada → registra lo que observaste.</p><details><summary>Cómo continuar en Colab y guardar el avance</summary><p>Abre el cuaderno indicado. La primera vez, guarda una copia personal en Drive. Si otro tema usa el mismo cuaderno, reutiliza esa copia y ve al bloque señalado: no necesitas crear otra.</p><p>La bitácora y las comprobaciones te ayudan a revisar lo aprendido; no son entregas obligatorias. Cuando hayas recorrido el tema, usa «Marcar como visto». El porcentaje refleja ese registro, no asistencia ni una verificación automática de tu trabajo en Colab.</p></details></section>`;
}
