import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {COURSES,LESSONS} from '../docs/content.js';
import {ENCOUNTER_NOTEBOOKS} from '../docs/encounter-notebooks.js';
import {SOURCE_NOTEBOOK_PATHS,NOTEBOOK_PATHS} from '../docs/notebook-paths.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../docs/notebooks');
const source=c=>Array.isArray(c.source)?c.source.join(''):c.source;
const originals=new Map();
function original(file){if(!originals.has(file))originals.set(file,JSON.parse(fs.readFileSync(path.join(root,file),'utf8')));return originals.get(file);}
const custom={
 'comparar-activaciones':`# Aplicamos la misma señal a todas las funciones, sin entrenar una red.
SENAL = -2.0  # Cambia solo esta entrada y vuelve a ejecutar esta celda.
senal = torch.tensor(SENAL)
comparacion_activaciones = pd.DataFrame({
    'Función': ['Identidad', 'Sigmoide', 'tanh', 'ReLU'],
    'Entrada': [SENAL]*4,
    'Salida': [SENAL, torch.sigmoid(senal).item(), torch.tanh(senal).item(), torch.relu(senal).item()]})
display(comparacion_activaciones)
print('La entrada es una señal numérica interna, no una cantidad negativa de productos.')
print('Cambiar la señal utiliza las funciones existentes; no ajusta pesos ni entrena un modelo.')
`,
 'comprobar-imputacion':`# La preparación aprende solo con entrenamiento; no usa las respuestas de prueba.
mediana_entrenamiento = X_tr['lluvia_mm'].median()
mediana_aprendida = base[0].statistics_[0]
assert np.isclose(mediana_aprendida, mediana_entrenamiento)
print('Mediana aprendida en entrenamiento:', round(mediana_aprendida, 3), 'mm')
print('Ausencias en entrenamiento:', X_tr.lluvia_mm.isna().sum())
print('Ausencias en prueba:', X_te.lluvia_mm.isna().sum())
preparacion_prueba = pd.DataFrame(base[0].transform(X_te), columns=X_te.columns, index=X_te.index)
assert not preparacion_prueba.isna().any().any()
display(pd.DataFrame({'lluvia_original_mm': X_te.lluvia_mm,
                      'lluvia_preparada_mm': preparacion_prueba.lluvia_mm}).head(8))
print('Completar una ausencia permite calcular; no recupera la medición que falta.')
`,
 'comparar-umbrales-plantas':`# Las mismas diez plantas del aula: 1 = con plaga, 0 = sin plaga.
# Las puntuaciones están dadas para explicar decisiones; aquí no se ajusta un modelo.
real = np.array([1,1,1,1,0,0,0,0,0,0])
puntuaciones = np.array([.90,.80,.70,.40,.75,.55,.30,.20,.10,.05])
CAPACIDAD = 4
UMBRAL = .70  # Cambia solo este valor y vuelve a ejecutar la celda.
def evaluar_corte(corte):
    alertas = puntuaciones >= corte
    return {'Umbral': corte, 'Alertas': int(alertas.sum()),
            'Falsas alertas': int(((real == 0) & alertas).sum()),
            'Omisiones': int(((real == 1) & ~alertas).sum()),
            'Cabe en 4 revisiones': bool(alertas.sum() <= CAPACIDAD)}
comparacion_umbrales = pd.DataFrame([evaluar_corte(c) for c in [.30,.50,.70]])
display(comparacion_umbrales)
assert comparacion_umbrales['Alertas'].tolist() == [7,5,4]
assert comparacion_umbrales['Falsas alertas'].tolist() == [3,2,1]
assert comparacion_umbrales['Omisiones'].tolist() == [0,1,1]
decisiones = pd.DataFrame({'Planta': ['P'+str(i+1) for i in range(10)],
    'Realidad': np.where(real == 1, 'Con plaga', 'Sin plaga'),
    'Puntuación': puntuaciones, 'Alerta': puntuaciones >= UMBRAL})
display(decisiones)
display(pd.DataFrame([evaluar_corte(UMBRAL)]))
plt.figure(figsize=(9,4))
plt.bar(decisiones.Planta, puntuaciones, color=np.where(real == 1, '#a34d32', '#567447'))
plt.axhline(UMBRAL, color='black', linestyle='--', label=f'Umbral {UMBRAL:.2f}: se incluye la igualdad')
plt.ylabel('Puntuación dada'); plt.xlabel('Planta'); plt.ylim(0,1)
plt.title('Conservar puntuaciones y cambiar decisiones'); plt.legend(); plt.show()
print('Color = realidad conocida; altura = puntuación; la línea determina la alerta.')
print('Cumplir la capacidad no demuestra que se hayan detectado todas las plagas.')
`
};
function md(id,text){return {cell_type:'markdown',id,metadata:{},source:text.trim()+'\n'};}
function code(id,text,origin){return {cell_type:'code',id,metadata:{utp_source:origin},source:text,execution_count:null,outputs:[]};}
const table=(columns,rows)=>'| '+columns.join(' | ')+' |\n| '+columns.map(()=>'---').join(' | ')+' |\n'+rows.map(r=>'| '+r.join(' | ')+' |').join('\n');
function topicCells(id){
 const lesson=LESSONS.find(l=>l.id===id),g=lesson.guide,p=SOURCE_NOTEBOOK_PATHS[id],route=NOTEBOOK_PATHS[id];
 const cells=[md('tema-'+id,`## ${route.section}\n\n**Lo que vas a poder hacer:** ${g.objective}\n\n${g.relevance}\n\n### Entiende la idea\n\n${g.concept}\n\n### Un caso pequeño antes del programa\n\n**${g.case.title}**\n\n${g.case.context}\n\n${g.case.columns?.length?table(g.case.columns,g.case.rows):''}\n\n${g.case.reasoning.map((s,i)=>(i+1)+'. '+s).join('\n')}\n\n**Qué demuestra:** ${g.case.conclusion}\n\n### Ahora identifica los datos de esta práctica\n\n${p.observe}\n\nEl caso pequeño y la ejecución pueden usar conjuntos diferentes: interpreta las cifras con las unidades y filas declaradas en cada uno.\n\n**Antes de ejecutar:** este tema incluye su preparación. Ejecuta sus celdas en orden; no requiere ejecutar los temas anteriores. Si repites un tema, comienza desde su primera celda.\n\n**Qué cambiar y qué conservar:** ${p.tip}`)];
 const explained=new Set();
 const isReading=text=>/^###\s+(?:Lectura|Después de ejecutar|Lee las figuras)/i.test(text.trim());
 const addExplanation=(notebook,index,cellId)=>{
  const originalCell=notebook.cells[index],key=p.file+':'+originalCell.id;
  if(explained.has(key))return;
  explained.add(key);cells.push(md(cellId+'-lectura-'+index,source(originalCell)));
 };
 for(const identifier of [...p.prepareIds,...p.codeIds]){
  const notebook=original(p.file),index=notebook.cells.findIndex(c=>c.id===identifier);
  const c=notebook.cells[index];
  if(!c&&!custom[identifier])throw new Error(id+': celda ausente '+identifier);
  const fullId=id+'--'+identifier;
  // Introductions belong BEFORE their own code, not after the previous cell.
  if(c){let first=index;while(first>0&&notebook.cells[first-1].cell_type==='markdown')first--;
   for(let n=first;n<index;n++){
    const text=source(notebook.cells[n]).trim();
    if(text.startsWith('### ')&&!isReading(text))addExplanation(notebook,n,fullId);
   }
  }
  cells.push(code(fullId,custom[identifier]||source(c),{notebook:p.file,cell:identifier,kind:c?'canonical':'encounter-practice'}));
  // Only genuine result readings follow code. A new numbered section is for the next code cell.
  if(c){let n=index+1;while(n<notebook.cells.length&&notebook.cells[n].cell_type==='markdown'){
   const text=source(notebook.cells[n]).trim();
   if(/^#{1,2}\s/m.test(text)||(/^###\s/m.test(text)&&!isReading(text)))break;
   if(!isReading(text)&&n===index+1)break;
   addExplanation(notebook,n,fullId);n++;
  }}
 }
 cells.push(md('comprueba-'+id,`### Lee, comprueba y explica\n\n${p.observe}\n\n**Prueba pequeña:** ${p.tip}\n\n**Vuelve al caso:** ${g.takeaway}\n\n${g.understanding?'**Pregunta:** '+g.understanding.question+'\n\n**Respuesta razonada:** '+g.understanding.answer:''}\n\n**Registra en tu copia:** qué representan las filas, qué valores cambiaste, qué observaste y qué límite tiene la conclusión. No es una entrega ni una calificación.\n\n[Volver al tema del aula](https://kthyon.github.io/diplomado-utp-aula/#tema/${id})`));
 return cells;
}
export function buildEncounterNotebooks({check=false}={}){
 const outputs=[];
 for(const meeting of ENCOUNTER_NOTEBOOKS){
  const cls=COURSES[meeting.course].classes[meeting.index];
  const cells=[md('bienvenida',`# ${meeting.title}\n\n${cls.title}\n\n**Tu copia personal:** en Colab elige **Archivo → Guardar una copia en Drive**. Conserva esa copia para los tres temas del encuentro.\n\nTrabaja en CPU. Estas prácticas no requieren contratar GPU, claves de API ni servicios de pago. La primera preparación puede descargar bibliotecas ausentes; las prácticas de detección descargan los pesos del modelo si no están disponibles.\n\n## Tu recorrido\n\n${meeting.topics.map((id,i)=>`${i+1}. [${LESSONS.find(l=>l.id===id).title}](#scrollTo=tema-${id})`).join('\n')}\n\nCada tema reúne **idea → caso explicado → preparación → ejecución → lectura y comprobación**. Puedes ejecutar todo el cuaderno o empezar por un tema: cada uno vuelve a preparar sus datos y herramientas. No mezcles las cifras de conjuntos diferentes.\n\nLos datos inventados se identifican como simulaciones. Las fotos de detección son demostraciones y no incluyen una evaluación anotada de sus objetos. Las comprobaciones son voluntarias y sin nota.`),...meeting.topics.flatMap(topicCells),md('cierre',`## Cierra el encuentro con una explicación\n\n${meeting.topics.map((id,i)=>`${i+1}. **${LESSONS.find(l=>l.id===id).title}:** ${LESSONS.find(l=>l.id===id).guide.takeaway}`).join('\n')}\n\nEn cada resultado identifica entrada, salida, unidad o significado, forma de comprobarlo y límite. Guarda tu copia personal. Colab no registra automáticamente tu avance en el aula.`)];
  const routes=Object.fromEntries(meeting.topics.map(id=>[id,cells.filter(c=>c.cell_type==='code'&&c.id.startsWith(id+'--')).map(c=>c.id)]));
  const notebook={nbformat:4,nbformat_minor:5,metadata:{colab:{provenance:[],name:meeting.title+'.ipynb'},kernelspec:{display_name:'Python 3',language:'python',name:'python3'},language_info:{name:'python'},utp:{course:meeting.course,encounter:meeting.index+1,topics:meeting.topics,routes}},cells};
  const text=JSON.stringify(notebook,null,1)+'\n',target=path.join(root,meeting.file);
  if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==text)throw new Error(meeting.file+' necesita regeneración');}
  else fs.writeFileSync(target,text);
  outputs.push({file:meeting.file,topics:meeting.topics,cells:cells.length,code:cells.filter(c=>c.cell_type==='code').length});
 }
 return outputs;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(buildEncounterNotebooks({check:process.argv.includes('--check')}),null,2));
