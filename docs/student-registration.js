import {validFullName} from './access-policy.js';
import {STUDENT_RECORDS} from './database-config.js';
const serviceOrigin=new URL(STUDENT_RECORDS.url).origin;
export const isConnectedView=location.origin===serviceOrigin;
let settings,registered=false,revision=0,timer=null,pending=false,failed=false,queue=Promise.resolve(),lastLabel='Avance en este navegador';
export const studentConnected=()=>registered&&isConnectedView;
function label(s){lastLabel=s;for(const selector of ['#profile-status','[data-save-status]']){const b=document.querySelector(selector);if(b)b.textContent=s;}const retry=document.querySelector('[data-retry-save]');if(retry)retry.hidden=!failed;}
export const refreshStudentSaveStatus=()=>label(lastLabel);
export const retryStudentProgress=()=>saveStudentProgress();
async function request(url,options={}){try{return await fetch(url,{...options,signal:AbortSignal.timeout(12000)})}catch(e){if(e.name==='TimeoutError'||e.name==='AbortError')throw Error('La conexión está tardando demasiado. Tu avance permanece en este navegador; vuelve a intentarlo.');throw Error('No pudimos conectar con tu registro. Tu avance permanece en este navegador.')}}
async function api(method='GET',value){const r=await request('/api/me',{method,headers:value?{'content-type':'application/json'}:{},body:value?JSON.stringify(value):undefined});const v=await r.json();if(!r.ok)throw Error(v.error||'No pudimos guardar.');return v;}
async function useRemote(remote){
 if(!remote?.student)return;
 const local=settings.read();
 if(local.studentId===remote.student.id&&pending){registered=true;settings.apply({...remote,completed:local.completed,notes:local.notes});saveStudentProgress();return;}
 const hasLocal=local.completed?.length||Object.values(local.notes||{}).some(t=>String(t).trim());
 const bringLocal=hasLocal&&local.studentId!==remote.student.id?await settings.chooseImport(remote):false;
 if(bringLocal===null){label('Avance en este navegador');return;}
 registered=true;pending=false;failed=false;
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
 clearTimeout(timer);failed=false;label('Guardando mi avance…');
 timer=setTimeout(()=>{
  const snapshot=structuredClone(settings.read()),version=revision;
  queue=queue.catch(()=>{}).then(async()=>{
   try{await api('PUT',snapshot);if(version===revision){pending=false;failed=false;try{localStorage.removeItem('utp-cloud-pending')}catch{}label('Avance sincronizado');}}
   catch(e){pending=true;failed=true;label('Guardado pendiente');settings.notify('No pudimos guardar en la base. El avance permanece en este navegador. Puedes reintentar desde Mi progreso.');}
  });
 },800);
}
export async function initStudentRegistration(options){
 settings=options;if(!STUDENT_RECORDS.enabled)return;
 try{pending=localStorage.getItem('utp-cloud-pending')===settings.read().studentId&&Boolean(settings.read().studentId)}catch{}
 label('Avance en este navegador');
 if(!isConnectedView)return {role:'student'};
 try{const response=await request('/api/session',{cache:'no-store'});if(!response.ok)throw Error('No pudimos verificar tu sesión. Recarga el aula para volver a intentarlo.');const session=await response.json();
 const route=new URLSearchParams(location.search).get('ruta');if(route&&/^#(?:inicio|curso\/|tema\/|explorar|biblioteca|progreso|docente|buscar)/.test(route))history.replaceState(null,'',location.pathname+location.search+route);
 if(session.role==='teacher'){label('Docente · acceso completo');return session}
 const remote=await api();if(remote.student)await useRemote(remote);return session;
 }catch(e){settings.notify(e.message);return {role:'student'}}
}
window.addEventListener('online',()=>{if(studentConnected()&&pending)saveStudentProgress()});
