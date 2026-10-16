import {validFullName} from './access-policy.js';
import {STUDENT_RECORDS} from './database-config.js';
const serviceOrigin=new URL(STUDENT_RECORDS.url).origin;
export const isConnectedView=location.origin===serviceOrigin;
let settings,registered=false,revision=0,timer=null,pending=false,queue=Promise.resolve();
export const studentConnected=()=>registered&&isConnectedView;
function label(s){const b=document.querySelector('#profile-status');if(b)b.textContent=s;}
async function api(method='GET',value){const r=await fetch('/api/me',{method,headers:value?{'content-type':'application/json'}:{},body:value?JSON.stringify(value):undefined});const v=await r.json();if(!r.ok)throw Error(v.error||'No pudimos guardar.');return v;}
async function useRemote(remote){
 if(!remote?.student)return;
 const local=settings.read();
 if(local.studentId===remote.student.id&&pending){registered=true;saveStudentProgress();return;}
 const hasLocal=local.completed?.length||Object.values(local.notes||{}).some(t=>String(t).trim());
 const bringLocal=hasLocal&&local.studentId!==remote.student.id?await settings.chooseImport(remote):false;
 if(bringLocal===null){label('Avance en este navegador');return;}
 registered=true;pending=false;
 settings.apply(bringLocal?{...remote,completed:local.completed,notes:local.notes}:remote);
 if(bringLocal)saveStudentProgress();else label('Avance sincronizado');
 settings.notify('Registro conectado. Tu avance se guardará en la base del curso.');
}
export function openStudentRegistration(){
 if(!STUDENT_RECORDS.enabled)return;
 if(!isConnectedView){location.assign(STUDENT_RECORDS.url+'/aula/?registro=1&ruta='+encodeURIComponent(location.hash));return;}
 settings.openForm();
}
export async function registerStudent(identity){if(!validFullName(identity.full_name))throw Error('Escribe tu nombre y apellidos completos.');identity.full_name=identity.full_name.trim().replace(/\s+/g,' ');if(isConnectedView){await useRemote(await api('POST',identity))}else settings.applyLocal(identity)}
export function saveStudentProgress(){
 if(!studentConnected())return;
 pending=true;revision++;try{localStorage.setItem('utp-cloud-pending',settings.read().studentId||'')}catch{}
 clearTimeout(timer);label('Guardando mi avance…');
 timer=setTimeout(()=>{
  const snapshot=structuredClone(settings.read()),version=revision;
  queue=queue.catch(()=>{}).then(async()=>{
   try{await api('PUT',snapshot);if(version===revision){pending=false;try{localStorage.removeItem('utp-cloud-pending')}catch{}label('Avance sincronizado');}}
   catch(e){pending=true;label('Reintentar guardado');settings.notify('No pudimos guardar en la base. El avance permanece en este navegador.');}
  });
 },800);
}
export async function initStudentRegistration(options){
 settings=options;if(!STUDENT_RECORDS.enabled)return;
 try{pending=localStorage.getItem('utp-cloud-pending')===settings.read().studentId&&Boolean(settings.read().studentId)}catch{}
 label('Avance en este navegador');
 if(!isConnectedView)return {role:'student'};
 try{const response=await fetch('/api/session',{cache:'no-store'});if(!response.ok)throw Error('No pudimos verificar tu sesión. Recarga el aula para volver a intentarlo.');const session=await response.json();
 const route=new URLSearchParams(location.search).get('ruta');if(route&&/^#(?:inicio|curso\/|tema\/|explorar|biblioteca|progreso|docente|buscar)/.test(route))history.replaceState(null,'',location.pathname+location.search+route);
 if(session.role==='teacher'){label('Docente · acceso completo');return session}
 const remote=await api();if(remote.student)await useRemote(remote);return session;
 }catch(e){settings.notify(e.message);return {role:'student'}}
}
