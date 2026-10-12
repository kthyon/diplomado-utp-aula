export const WELCOME_ID='1n4uXQrFrcTKQNsJP2nNaQ9VTA7envI0Jk6DKmeBHQVA';
export const WELCOME_KEY='utp-bienvenida-vista:'+WELCOME_ID;
export const EMBED_URL=`https://docs.google.com/presentation/d/${WELCOME_ID}/embed?start=false&loop=false&delayms=3000`;
export const PROJECT_URL=`https://docs.google.com/presentation/d/${WELCOME_ID}/present`;
let seenThisSession=false;
export function welcomeSeen(storage){try{return seenThisSession||storage.getItem(WELCOME_KEY)==='1'}catch{return seenThisSession}}
export function showWelcome(dialog,storage){
  dialog.classList.add('presentation-dialog');
  dialog.querySelector('#modal-body').innerHTML=`<div class="welcome-popup-header"><div><div class="eyebrow">BIENVENIDA AL CURSO</div><h2 id="modal-title">Generalidades 2</h2></div><div class="welcome-popup-actions"><button class="button secondary small" id="refresh-slides">Actualizar diapositivas ↻</button><a class="button small" href="${PROJECT_URL}" target="_blank" rel="noopener noreferrer">Proyectar ↗</a></div></div><div class="slides-frame"><iframe id="welcome-slides" src="${EMBED_URL}" title="Presentación Generalidades 2" allow="fullscreen" allowfullscreen></iframe></div><div class="welcome-popup-footer"><p>Esta es la presentación original de Google Slides. Tus cambios se consultan al abrirla o actualizarla.</p><button class="button" id="continue-course">Continuar al curso →</button></div>`;
  dialog.querySelector('#refresh-slides').onclick=()=>{dialog.querySelector('#welcome-slides').src=EMBED_URL+'&refresh='+Date.now()};
  dialog.querySelector('#continue-course').onclick=()=>dialog.close();
  if(!dialog.open)dialog.showModal();
  seenThisSession=true;
  try{storage.setItem(WELCOME_KEY,'1')}catch{}
}
export function maybeShowWelcome(route,dialog,storage){if(['curso','tema'].includes(route)&&!dialog.open&&!welcomeSeen(storage))showWelcome(dialog,storage)}

