// Calendar access depends only on date/verified role; progress never unlocks a class.
const completedSet=completed=>new Set(Array.isArray(completed)?completed:[]);
function orderedCalendar(courses){
 return Object.values(courses).flatMap(course=>course.classes.map((meeting,index)=>({
  ...meeting,course,index,classId:`${course.id}-${index+1}`,href:`#tema/${meeting.topics[0]}`
 }))).sort((a,b)=>a.iso.localeCompare(b.iso)||a.course.id.localeCompare(b.course.id)||a.index-b.index);
}

/** Session hours are separate from midnight material releases. Colombia is UTC−05:00. */
export function getCalendarMoment(courses,now=new Date()){
 const instant=now instanceof Date?now.getTime():new Date(now).getTime();
 const calendar=orderedCalendar(courses).map(meeting=>{
  const hours=typeof meeting.time==='string'?meeting.time.match(/(?:^|\s)([01]\d|2[0-3]):([0-5]\d)\s*[–-]\s*([01]\d|2[0-3]):([0-5]\d)(?:\s|$)/):null;
  const start=hours?Date.parse(`${meeting.iso}T${hours[1]}:${hours[2]}:00-05:00`):NaN;
  const end=hours?Date.parse(`${meeting.iso}T${hours[3]}:${hours[4]}:00-05:00`):NaN;
  const valid=Number.isFinite(start)&&Number.isFinite(end)&&end>start;
  return {...meeting,start:valid?new Date(start).toISOString():null,end:valid?new Date(end).toISOString():null};
 });
 const timed=calendar.filter(meeting=>meeting.start!==null).sort((a,b)=>Date.parse(a.start)-Date.parse(b.start));
 return {calendar,current:Number.isFinite(instant)?timed.find(meeting=>Date.parse(meeting.start)<=instant&&instant<Date.parse(meeting.end))||null:null,
  upcoming:Number.isFinite(instant)?timed.find(meeting=>Date.parse(meeting.start)>instant)||null:null};
}

/** completed is the current saved state. Unknown IDs and duplicates never add progress. */
export function getJourney(courses,completed=[],day='',teacher=false){
 const seen=completedSet(completed);
 const calendar=orderedCalendar(courses).map(meeting=>{
  const pendingTopics=meeting.topics.filter(id=>!seen.has(id));
  return {...meeting,open:teacher||meeting.iso<=day,pendingTopics,seen:meeting.topics.length-pendingTopics.length,total:meeting.topics.length};
 });
 const available=calendar.filter(meeting=>meeting.open),upcoming=calendar.find(meeting=>meeting.iso>day)||null;
 const pendingClass=available.find(meeting=>meeting.pendingTopics.length),topicId=pendingClass?.pendingTopics[0]||null;
 const resume=pendingClass?{...pendingClass,topicId,href:`#tema/${topicId}`}:null;
 const total=calendar.reduce((sum,meeting)=>sum+meeting.total,0),count=calendar.reduce((sum,meeting)=>sum+meeting.seen,0);
 const fallback=available.at(-1)||calendar[0]||null;
 return {calendar,available,upcoming,resume,allAvailableSeen:available.every(meeting=>meeting.pendingTopics.length===0),
  hasAvailable:available.length>0,seen:count,total,complete:total>0&&count===total,
  href:resume?.href||(fallback?`#curso/${fallback.course.id}`:'#inicio')};
}

/** Day changes or removing a topic do not announce newly available content. */
export function hasNewTopics(before,after){
 const ids=value=>Object.values(value?.released||{}).flat();
 const previous=new Set(ids(before));
 return ids(after).some(id=>!previous.has(id));
}

/** Call AFTER updating completed. Merely visiting the last topic is not a course completion. */
export function getTopicCompletion(courses,completed=[],id){
 const calendar=orderedCalendar(courses),meeting=calendar.find(cl=>cl.topics.includes(id));
 if(!meeting)return null;
 const seen=completedSet(completed),courseClasses=calendar.filter(cl=>cl.course.id===meeting.course.id);
 const courseTopics=courseClasses.flatMap(cl=>cl.topics),allTopics=calendar.flatMap(cl=>cl.topics);
 const index=courseTopics.indexOf(id),nextId=courseTopics[index+1]||null;
 const nextClass=nextId?courseClasses.find(cl=>cl.topics.includes(nextId)):null;
 const next=nextId?{id:nextId,topicId:nextId,href:`#tema/${nextId}`,classId:nextClass.classId,meeting:nextClass,sameClass:nextClass.classId===meeting.classId}:null;
 const courseSeen=courseTopics.filter(topic=>seen.has(topic)).length,totalSeen=allTopics.filter(topic=>seen.has(topic)).length;
 const pendingId=courseTopics.find(topic=>!seen.has(topic))||null;
 return {id,course:meeting.course,meeting,next,isLastTopic:next===null,
  classComplete:meeting.topics.every(topic=>seen.has(topic)),courseComplete:courseSeen===courseTopics.length,
  complete:allTopics.length>0&&totalSeen===allTopics.length,courseSeen,courseTotal:courseTopics.length,totalSeen,total:allTopics.length,
  pendingId,pendingHref:pendingId?`#tema/${pendingId}`:null};
}
