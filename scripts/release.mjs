import fs from 'node:fs';
import {COURSES} from '../docs/content.js';
const target=process.argv[2];
if(!target)throw Error('Falta el destino de habilitación.');
const course=target.split('-')[0],c=COURSES[course];
if(!c)throw Error('Asignatura desconocida.');
const ids=c.classes.flatMap(cl=>cl.topics);let end;
if(target.includes('-clase-')){const num=Number(target.split('-clase-')[1]);if(!Number.isInteger(num)||num<1||num>c.classes.length)throw Error('Clase desconocida.');const cl=c.classes[num-1];end=ids.indexOf(cl.topics.at(-1));}
else end=ids.indexOf(target);
if(end<0)throw Error('Tema desconocido.');
const file=new URL('../docs/releases.json',import.meta.url),config=JSON.parse(fs.readFileSync(file));
config.released[course]=[...new Set([...config.released[course],...ids.slice(0,end+1)])].sort((a,b)=>ids.indexOf(a)-ids.indexOf(b));
config.updatedAt=new Date().toISOString();
fs.writeFileSync(file,JSON.stringify(config,null,2)+'\n');
console.log('Habilitado el recorrido de '+c.title+' hasta '+ids[end]);

