import {validFullName} from './access-policy.js';

export function laboratoryDestination(search){
 const value=new URLSearchParams(search).get('destino');
 return /^laboratorio\.html(?:#(?:red|vecinos|metricas|riego))?$/.test(value||'')?value:null;
}

export async function checkLabAccess({origin,recordsURL,storage,fetcher=fetch,timeout=12000}){
 if(origin!==new URL(recordsURL).origin){
  try{return {status:validFullName(JSON.parse(storage.getItem('utp-aula-v1')||'{}').name)?'ready':'registration'}}catch{return {status:'registration'}}
 }
 async function read(path){
  const response=await fetcher(path,{cache:'no-store',signal:AbortSignal.timeout(timeout)});
  if(!response.ok)throw Error('session_unavailable');
  return response.json();
 }
 try{
  const session=await read('/api/session');
  if(session.role==='teacher')return {status:'ready'};
  if(session.role!=='student')return {status:'unavailable'};
  const record=await read('/api/me');
  return {status:record.student&&validFullName(record.name)?'ready':'registration'};
 }catch{return {status:'unavailable'}}
}
