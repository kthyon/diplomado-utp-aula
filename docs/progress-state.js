import {LESSONS} from './content.js';
import {validFullName} from './access-policy.js';
const record=value=>value&&typeof value==='object'&&!Array.isArray(value);
const known=id=>typeof id==='string'&&LESSONS.some(l=>l.id===id);
export function normalizeProgress(value){
 const v=record(value)?value:{};
 return {name:typeof v.name==='string'?v.name.slice(0,120):'',email:typeof v.email==='string'?v.email.slice(0,254):'',studentId:typeof v.studentId==='string'?v.studentId:'',completed:[...new Set((Array.isArray(v.completed)?v.completed:[]).filter(known))],notes:Object.fromEntries(Object.entries(record(v.notes)?v.notes:{}).filter(([id,t])=>known(id)&&typeof t==='string').map(([id,t])=>[id,t.slice(0,10000)])),quiz:Object.fromEntries(Object.entries(record(v.quiz)?v.quiz:{}).filter(([id,v])=>known(id)&&typeof v==='boolean'))};
}
export function importProgress(value,current){
 if(!record(value)||!validFullName(value.name)||!Array.isArray(value.completed)||!record(value.notes)||value.completed.some(id=>!known(id))||Object.entries(value.notes).some(([id,t])=>!known(id)||typeof t!=='string'||t.length>10000))throw Error('Ese archivo no tiene un nombre completo y un progreso válido del aula.');
 // Una copia de progreso nunca cambia la identidad ni la cuenta conectada.
 const imported=normalizeProgress(value);
 return {...normalizeProgress(current),completed:imported.completed,notes:imported.notes,quiz:imported.quiz};
}
export function decodeSearch(value){try{return decodeURIComponent(value)}catch{return value}}
