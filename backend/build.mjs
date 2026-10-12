import {mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
const src=await readFile('worker.js','utf8'),catalog=await readFile('catalog.json','utf8');await writeFile('dist/server/index.js',src.replace('/*CATALOG*/ null',catalog));await copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Servicio privado preparado');
