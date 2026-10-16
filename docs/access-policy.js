export const TIME_ZONE='America/Bogota';
export function colombiaDay(now=new Date()){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:TIME_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const part=type=>parts.find(p=>p.type===type).value;
 return `${part('year')}-${part('month')}-${part('day')}`;
}
export function scheduleReleases(courses,day=colombiaDay(),teacher=false){
 return {mode:'schedule',timeZone:TIME_ZONE,day,released:Object.fromEntries(Object.values(courses).map(c=>[c.id,c.classes.filter(cl=>teacher||cl.iso<=day).flatMap(cl=>cl.topics)]))};
}
export const validFullName=value=>typeof value==='string'&&value.trim().length<=120&&/^[\p{L}\p{M}][\p{L}\p{M}.'’\-]*\s+[\p{L}\p{M}][\p{L}\p{M}.'’\-\s]*$/u.test(value.trim());
export function mayEnter(name,teacher=false){return teacher||validFullName(name)}
