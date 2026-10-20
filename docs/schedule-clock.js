import {colombiaDay} from './access-policy.js';
import {getCalendarMoment} from './journey-models.js';

export function referenceOffset(headers,started,finished){
 const date=Date.parse(headers.get('date')||'');
 if(!Number.isFinite(date))return null;
 const age=Number(headers.get('age')||0);
 return date+(Number.isFinite(age)&&age>0?age*1000:0)+(finished-started)/2-finished;
}
export async function readReferenceOffset(fetcher=fetch,now=Date.now){
 const started=now();
 try{
  const response=await fetcher('./?reloj='+started,{method:'HEAD',cache:'no-store',signal:AbortSignal.timeout(4000)});
  return response.ok?referenceOffset(response.headers,started,now()):null;
 }catch{return null}
}
export function nextScheduleDelay(courses,now=new Date()){
 const instant=now.getTime(),day=colombiaDay(now);
 const midnight=Date.parse(day+'T00:00:00-05:00')+86400000;
 const moments=getCalendarMoment(courses,now).calendar.flatMap(c=>[Date.parse(c.start),Date.parse(c.end)]).filter(t=>Number.isFinite(t)&&t>instant);
 return Math.max(50,Math.min(60000,Math.min(midnight,...moments)-instant+50));
}
