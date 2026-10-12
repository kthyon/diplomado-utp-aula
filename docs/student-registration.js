import {STUDENT_RECORDS} from './database-config.js';
const serviceOrigin=new URL(STUDENT_RECORDS.url).origin;
const connectedView=location.origin===serviceOrigin;
let settings,registered=false,revision=0,timer=null,pending=false,queue=Promise.resolve();
export const studentConnected=()=>registered&&connectedView;
function label(s){const b=document.querySelector('#registration-button');if(b)b.textContent=s;}
async function api(method='GET',value){const r=await fetch('/api/me',{method,headers:value?{'content-type':'application/json'}:{},body:value?JSON.stringify(value):undefined});const v=await r.json();if(!r.ok)throw Error(v.error||'No pudimos guardar.');return v;}
async function useRemote(remote){
 if(!remote?.student)return;
 const local=settings.read();
 if(local.studentId===remote.student.id&&pending){registered=true;saveStudentProgress();return;}
 const hasLocal=local.completed?.length||Object.values(local.notes||{}).some(t=>String(t).trim());
 const bringLocal=hasLocal&&local.studentId!==remote.student.id?await settings.chooseImport(remote):false;
 if(bringLocal===null){label('Conectar mi registro');return;}
 registered=true;pending=false;
 settings.apply(bringLocal?{...remote,completed:local.completed,notes:local.notes}:remote);
 if(bringLocal)saveStudentProgress();else label('Mi registro conectado ✓');
 settings.notify('Registro conectado. Tu avance se guardará en la base del curso.');
}
export function openStudentRegistration(){
 if(!STUDENT_RECORDS.enabled)return;
 if(!connectedView){location.assign(STUDENT_RECORDS.url+'/aula/?registro=1'+location.hash);return;}
 settings.openForm(async identity=>{const remote=await api('POST',{identity});await useRemote(remote);});
}
export function saveStudentProgress(){
 if(!studentConnected())return;
 pending=true;revision++;try{localStorage.setItem('utp-cloud-pending',settings.read().studentId||'')}catch{}
 clearTimeout(timer);label('Guardando mi avance…');
 timer=setTimeout(()=>{
  const snapshot=structuredClone(settings.read()),version=revision;
  queue=queue.catch(()=>{}).then(async()=>{
   try{await api('PUT',snapshot);if(version===revision){pending=false;try{localStorage.removeItem('utp-cloud-pending')}catch{}label('Mi avance guardado ✓');}}
   catch(e){pending=true;label('Reintentar guardado');settings.notify('No pudimos guardar en la base. El avance permanece en este navegador.');}
  });
 },800);
}
export function initStudentRegistration(options){
 settings=options;if(!STUDENT_RECORDS.enabled)return;
 try{pending=localStorage.getItem('utp-cloud-pending')===settings.read().studentId&&Boolean(settings.read().studentId)}catch{}
 const button=document.createElement('button');button.id='registration-button';button.className='button secondary small';button.textContent='Registro rápido';button.onclick=openStudentRegistration;
 document.querySelector('#name-button').before(button);
 if(connectedView)api().then(async remote=>{if(remote.student)await useRemote(remote);else if(new URLSearchParams(location.search).has('registro'))openStudentRegistration();}).catch(e=>settings.notify(e.message));
}
