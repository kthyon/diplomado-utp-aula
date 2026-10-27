import {TOPIC_CONTEXT} from './lesson-context.js?v=organizacion-20261027';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const isOrganizedTopic=id=>Object.hasOwn(TOPIC_CONTEXT,id);
export function renderTopicCompass(l,{courseTitle='',classIndex=0,topicIndex=0,purpose='',flowHtml=''}={}){
 if(!isOrganizedTopic(l.id))return '';
 return `<section class="topic-compass" aria-label="Tu guía de este tema"><div class="compass-eyebrow">${esc(courseTitle)} · Encuentro ${classIndex+1} · Tema ${topicIndex+1} de 3</div><h3>Tu meta en este tema</h3><p class="compass-goal">${esc(l.guide.objective)}</p><nav class="lesson-section-nav" aria-label="Muévete por este tema"><button type="button" data-lesson-section="idea-del-tema"><span>01</span> Entiende la idea</button><button type="button" data-lesson-section="ejemplo-del-tema"><span>02</span> Mira un ejemplo</button><button type="button" data-lesson-section="practica-del-tema"><span>03</span> Pruébalo y comprueba</button></nav><details class="compass-context"><summary>Cómo encaja en el encuentro</summary><p>${esc(purpose)}</p></details><details class="compass-location"><summary>Tu ubicación y cómo continuar en Colab</summary>${flowHtml}</details></section>`;
}
export function renderOrganizedFinish(buttonHtml){return `<section class="organized-finish"><div><h3>Registra tu avance</h3><p>Cuando termines de revisar el tema, puedes marcarlo como visto. Este registro es personal y no acredita asistencia.</p></div>${buttonHtml}</section>`;}
export function mountLessonSections(root=document){
 for(const button of root.querySelectorAll('[data-lesson-section]'))button.addEventListener('click',()=>{
  const id=button.dataset.lessonSection;
  if(!['idea-del-tema','ejemplo-del-tema','practica-del-tema'].includes(id))return;
  const section=root.querySelector('#'+id);if(!section)return;
  let parent=section.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}
  const heading=section.querySelector('h2,h3')||section;
  heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});section.scrollIntoView({behavior:'auto',block:'start'});
 });
}
