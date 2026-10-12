import {STUDENT_RECORDS} from './database-config.js';
let portal=null,ready=false,settings=null,loadedId=null,timer=null,pending=false,revision=0;
const origin=new URL(STUDENT_RECORDS.url).origin;
export const studentConnected=()=>Boolean(ready&&portal&&!portal.closed);
function label(text){const b=document.querySelector('#registration-button');if(b)b.textContent=text;}
export function openStudentRegistration(){
 if(!STUDENT_RECORDS.enabled)return;
 portal=window.open(STUDENT_RECORDS.url+'/connect','nexo-mi-registro','popup,width=680,height=820');
 ready=false;loadedId=null;
 label(portal?'Conectar mi registro…':'Registro rápido');
 settings?.notify(portal?'Completa tu registro en la ventana que se abrió.':'Permite abrir la ventana de registro en tu navegador.');
}
export function saveStudentProgress(){
 pending=true;revision++;try{localStorage.setItem('utp-cloud-pending',settings?.read().studentId||'')}catch{}clearTimeout(timer);if(!studentConnected())return;
 timer=setTimeout(()=>{if(studentConnected())portal.postMessage({type:'utp-save',state:settings.read(),requestId:revision},origin);},800);
 label('Guardando mi avance…');
}
export function initStudentRegistration(options){
 settings=options;try{pending=localStorage.getItem('utp-cloud-pending')===settings.read().studentId&&Boolean(settings.read().studentId)}catch{}
 if(!STUDENT_RECORDS.enabled)return;
 const button=document.createElement('button');button.id='registration-button';button.className='button secondary small';button.textContent='Registro rápido';button.onclick=openStudentRegistration;
 document.querySelector('#name-button').before(button);
 window.addEventListener('message',async e=>{
  if(e.origin!==origin||e.source!==portal||!e.data||typeof e.data!=='object')return;
  if(e.data.type==='utp-ready'){portal.postMessage({type:'utp-load'},origin);return;}
  if(e.data.type==='utp-state'){
   const remote=e.data.state;if(!remote?.student?.id||!Array.isArray(remote.completed)||typeof remote.notes!=='object'||!remote.notes)return;
   if(loadedId===remote.student.id&&!e.data.force)return;
   const local=settings.read();
   if(local.studentId===remote.student.id&&pending){ready=true;loadedId=remote.student.id;saveStudentProgress();return;}
   const hasLocal=local.completed?.length||Object.values(local.notes||{}).some(t=>String(t).trim());
   const bringLocal=hasLocal&&local.studentId!==remote.student.id?await settings.chooseImport(remote):false;
   if(bringLocal===null){label('Registro sin conectar');return;}
   loadedId=remote.student.id;ready=true;pending=false;
   settings.apply(bringLocal?{...remote,completed:local.completed,notes:local.notes}:remote);
   if(bringLocal)saveStudentProgress();else label('Mi registro conectado ✓');
   settings.notify('Registro conectado. Mantén su ventana abierta para guardar el avance automáticamente.');
  }
  if(e.data.type==='utp-saved'&&e.data.requestId===revision){pending=false;try{localStorage.removeItem('utp-cloud-pending')}catch{}label('Mi avance guardado ✓');}
  if(e.data.type==='utp-save-error'){pending=true;label('Reintentar guardado');settings.notify(e.data.message||'No pudimos guardar. Conservamos tu avance en este navegador.');}
 });
 setInterval(()=>{if(ready&&(!portal||portal.closed)){ready=false;label(pending?'Conectar para guardar':'Registro rápido');}},1500);
}
