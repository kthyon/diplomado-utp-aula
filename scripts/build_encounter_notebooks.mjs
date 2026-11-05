import {STUDENT_RECORDS} from '../docs/database-config.js';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DL_FOUNDATIONS,BIAS_EXPLANATION} from '../docs/dl-foundations.js';
import {COURSES,LESSONS} from '../docs/content.js';
import {ENCOUNTER_NOTEBOOKS} from '../docs/encounter-notebooks.js';
import {SOURCE_NOTEBOOK_PATHS,NOTEBOOK_PATHS,PRIMARY_NOTEBOOK_PRACTICES} from '../docs/notebook-paths.js';
import {DL_LEARNING_PATHS} from '../docs/dl-learning-paths.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../docs/notebooks');
const source=c=>Array.isArray(c.source)?c.source.join(''):c.source;
const originals=new Map();
function original(file){if(!originals.has(file))originals.set(file,JSON.parse(fs.readFileSync(path.join(root,file),'utf8')));return originals.get(file);}
const custom={
 'lab01-calculo':`# Una neurona con parámetros dados: esta celda funciona por sí sola.
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from IPython.display import display

entradas = np.array([2., 1.])
pesos = np.array([.5, -1.])
sesgo = .5
contribuciones = entradas * pesos
z = float(contribuciones.sum() + sesgo)
h = max(0., z)  # ReLU: conserva lo positivo y cambia lo negativo a cero.
display(pd.DataFrame({'Parte':['Entrada 1 × peso 1','Entrada 2 × peso 2','Sesgo b'],
                     'Aporte a la suma':[contribuciones[0], contribuciones[1], sesgo]}))
print('Suma z =', z, '· salida ReLU h =', h)
fig,ax = plt.subplots(figsize=(7,3))
ax.bar(['2 × 0,5','1 × (−1)','Sumar b'],[*contribuciones,sesgo],
       color=['#397ca4','#b6631f','#8455ad'])
ax.axhline(0,color='black',lw=.8)
ax.set(title='Cada entrada aporta; el bias se añade',ylabel='Aporte a la suma interna')
plt.show()
print('Entradas abstractas y parámetros inventados. Ningún valor es una probabilidad de calidad.')
print('Los pesos están fijados: ejecutar la cuenta no los entrena.')
`,
 'capas-en-cadena':`# La salida de una capa se convierte en entrada de la siguiente.
import numpy as np
import pandas as pd
from IPython.display import display

# Repetimos la definición del caso para que esta celda también sea independiente.
entradas = np.array([2., 1.])
pesos = np.array([.5, -1.]); sesgo = .5
z_primera = float(entradas @ pesos + sesgo)
h = max(0., z_primera)
z_salida = 2*h - 1
p = 1/(1+np.exp(-z_salida))
display(pd.DataFrame({
    'Etapa':['Entradas','Primera suma','Activación ReLU','Segunda suma','Sigmoide final'],
    'Operación':['x₁=2; x₂=1','2×0,5 + 1×(−1) + 0,5','máximo(0, z)','2×h − 1','1/(1+exp(−z_salida))'],
    'Resultado':['2; 1',z_primera,h,z_salida,p]}))
print('h =',h,'viaja a la siguiente capa; su suma es',z_salida,'y la salida final es',p)
print('Es un fragmento mínimo de dos capas con valores dados, no una red ya entrenada.')
`,
 'comparar-activaciones':`# Aplicamos la misma señal a todas las funciones, sin entrenar una red.
import pandas as pd
import torch
from IPython.display import display

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
 'curvas-activaciones':`# Cuatro alternativas para la misma señal, no una cadena de cuatro activaciones.
import numpy as np
import matplotlib.pyplot as plt

SENAL = -2.0  # Usa la misma señal que elegiste en la tabla anterior.
valores = np.linspace(-4,4,161)
funciones = [('Identidad',lambda z:z),
             ('Sigmoide',lambda z:1/(1+np.exp(-z))),
             ('tanh',np.tanh),('ReLU',lambda z:np.maximum(0,z))]
fig,axs=plt.subplots(1,4,figsize=(12,3.2))
for ax,(nombre,funcion),color in zip(axs,funciones,['#397ca4','#278071','#8455ad','#b6631f']):
    salida=float(funcion(SENAL))
    ax.plot(valores,funcion(valores),color=color)
    ax.scatter([SENAL],[salida],s=55,color=color,zorder=3)
    ax.axvline(SENAL,ls=':',color='gray');ax.axhline(0,color='gray',lw=.7)
    ax.set(title=f'{nombre}: {salida:.3f}',xlabel='Misma suma z',ylabel='Salida f(z)')
    ax.grid(alpha=.15)
plt.tight_layout();plt.show()
print('Punto = entrada elegida y su salida; curva = respuestas de esa función a otras entradas.')
print('ReLU puede superar 1; no todas las salidas se interpretan como probabilidades.')
`,
 'un-paso-gradiente':`# Comparamos UN paso desde el mismo inicio; no son dos pasos consecutivos.
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from IPython.display import display

INICIO=-2.;OBJETIVO=3.;TASA=.10  # Cambia solo TASA y ejecuta otra vez desde el mismo inicio.
def un_paso(tasa):
    gradiente=2*(INICIO-OBJETIVO)
    nuevo=INICIO-tasa*gradiente
    return {'Tasa':tasa,'Inicio':INICIO,'Gradiente':gradiente,
            'Parámetro nuevo':nuevo,'Pérdida inicial':(INICIO-OBJETIVO)**2,
            'Pérdida nueva':(nuevo-OBJETIVO)**2}
paso_elegido=un_paso(TASA)
comparacion_pasos=pd.DataFrame([un_paso(.10),un_paso(1.10)])
display(comparacion_pasos)
print('Tu tasa elegida:',TASA,'· un paso:',INICIO,'→',paso_elegido['Parámetro nuevo'])
print('Pérdida:',paso_elegido['Pérdida inicial'],'→',paso_elegido['Pérdida nueva'])
curva=np.linspace(-3,max(10,paso_elegido['Parámetro nuevo']+1),200)
fig,ax=plt.subplots(figsize=(8,3.5))
ax.plot(curva,(curva-OBJETIVO)**2,color='#397ca4',label=f'Pérdida (parámetro − {OBJETIVO:g})²')
perdida_inicial=(INICIO-OBJETIVO)**2
ax.scatter([INICIO],[perdida_inicial],color='black',s=55,label=f'Mismo inicio: {INICIO:g}, pérdida {perdida_inicial:g}',zorder=4)
for tasa,color in [(.10,'#278071'),(1.10,'#bf3978')]:
    r=un_paso(tasa);n=r['Parámetro nuevo'];perdida=r['Pérdida nueva']
    ax.annotate('',xy=(n,perdida),xytext=(INICIO,perdida_inicial),arrowprops={'arrowstyle':'->','color':color,'lw':2})
    ax.scatter([n],[perdida],color=color,s=55,label=f'Tasa {tasa:.2f}: {n:g}, pérdida {perdida:g}')
ax.set(xlabel='Parámetro',ylabel='Pérdida',title='El tamaño del paso puede ayudar o sobrepasar el objetivo')
ax.legend(fontsize=8);plt.show()
print('Retropropagación calcula gradientes; aquí usamos la derivada de una pérdida sencilla.')
print('La red del bloque siguiente usa otros datos y otra pérdida: sus números no serán 25,16 y36.')
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
const CUSTOM_GUIDES={
 'lab01-calculo':'### 1 · Reconstruye los aportes de una neurona\n\nLa tabla separa lo que multiplica cada entrada de la cantidad fija que añade el bias. La salida ReLU es un número intermedio, no una categoría. Esta celda tiene sus propias importaciones y datos.',
 'capas-en-cadena':'### 2 · Sigue la salida hasta la siguiente capa\n\nLa primera salida h se convierte en entrada de otra unidad. Repetimos los parámetros del ejemplo para que puedas ejecutar esta celda por sí sola. Observa qué recibe cada capa y qué transformación entrega.',
 'comparar-activaciones':'### 1 · Compara cuatro respuestas para una misma señal\n\nEmpieza con SENAL = −2. Las filas de la tabla representan alternativas: ninguna recibe la salida de la anterior. La identidad sirve de comparación sin transformación.',
 'curvas-activaciones':'### 2 · Ubica esa misma señal en las curvas\n\nEl punto conserva la misma entrada en los cuatro gráficos. Si cambias SENAL en la tabla, pon el mismo valor en esta celda para repetir la comparación. Las curvas no entrenan un modelo.',
 'un-paso-gradiente':'### 1 · Comprueba un solo ajuste antes de entrenar una red\n\nCada fila vuelve a empezar en −2. La tasa 0,10 produce −1 y pérdida 16; la tasa 1,10 produce 9 y pérdida 36. Compara estos resultados con el inicio, pérdida 25. La celda imprime la cuenta elegida, la tabla y las dos flechas.'
};
function dlIntro(item,route){
 return `## ${route.section}\n\n**Lo que vas a poder hacer:** ${item.goal}\n\n### Entiende la idea\n\n${item.definition}\n\n${item.terms.map(([term,meaning])=>'**'+term+':** '+meaning).join('\n\n')}\n\n### Un caso pequeño antes del programa\n\n**${item.example.question}**\n\n${item.example.intro}\n\n**Cómo leerlo:** ${item.example.reading}\n\n**Para recordar:** ${item.example.takeaway}\n\n### Ahora identifica los datos de esta práctica\n\n${item.colab.goal}\n\n${item.colab.steps.map((step,i)=>(i+1)+'. '+step).join('\n')}\n\n**Antes de ejecutar:** este tema incluye su preparación. Ejecuta las celdas en orden; no requiere los temas anteriores. Las celdas nuevas de cuentas pequeñas incluyen sus propias importaciones y datos.\n\n**Qué cambiar y qué conservar:** ${route.tip}`;
}
function topicCells(id){
 const lesson=LESSONS.find(l=>l.id===id),g=lesson.guide,p={...SOURCE_NOTEBOOK_PATHS[id],...PRIMARY_NOTEBOOK_PRACTICES[id]},route=NOTEBOOK_PATHS[id],dl=DL_LEARNING_PATHS[id];
 const cells=dl?[md('tema-'+id,dlIntro(dl,route))]:[md('tema-'+id,`## ${route.section}\n\n**Lo que vas a poder hacer:** ${g.objective}\n\n${g.relevance}\n\n### Entiende la idea\n\n${g.concept}\n\n### Un caso pequeño antes del programa\n\n**${g.case.title}**\n\n${g.case.context}\n\n${g.case.columns?.length?table(g.case.columns,g.case.rows):''}\n\n${g.case.reasoning.map((s,i)=>(i+1)+'. '+s).join('\n')}\n\n**Qué demuestra:** ${g.case.conclusion}\n\n### Ahora identifica los datos de esta práctica\n\n${p.observe}\n\nEl caso pequeño y la ejecución pueden usar conjuntos diferentes: interpreta las cifras con las unidades y filas declaradas en cada uno.\n\n**Antes de ejecutar:** este tema incluye su preparación. Ejecuta sus celdas en orden; no requiere ejecutar los temas anteriores. Si repites un tema, comienza desde su primera celda.\n\n**Qué cambiar y qué conservar:** ${p.tip}`)];
 const foundation=DL_FOUNDATIONS[id];
 if(foundation&&!dl){
  if(id==='dl-redes'){
   const b=BIAS_EXPLANATION;
   cells.push(md('sesgo-con-ejemplo-real','### '+b.title+'\n\n'+[b.meaning,b.purpose,b.learning,'**'+b.exampleTitle+'**',b.context,b.mapping,b.comparison,b.question,b.answer,'[Operación real documentada]('+b.source+')'].join('\n\n')));
  }
  const intro=cells[0].source;
  cells[0].source=intro.replace('### Entiende la idea', '### Antes de seguir: tres ideas necesarias\n\n'+foundation.before.map(([term,meaning])=>'**'+term+':** '+meaning).join('\n\n')+'\n\n### Entiende la idea');
  cells.push(md('fundamento-'+id,'### '+foundation.why+'\n\n'+foundation.reason+'\n\n**Sigue este recorrido:**\n\n'+foundation.flow.map(([title,value],i)=>(i+1)+'. **'+title+':** '+value).join('\n')+'\n\n'+foundation.read+'\n\n[Consultar el fundamento]('+foundation.source+')'));
 }
 if(g.lab.context&&!dl)cells.push(md('alcance-'+id,'### Qué cambia entre el ejemplo y esta práctica\n\n'+g.lab.context));
 const explained=new Set();
 const isReading=text=>/^###\s+(?:Lectura|Después de ejecutar|Lee las figuras)/i.test(text.trim());
 const addExplanation=(notebook,index,cellId)=>{
  const originalCell=notebook.cells[index],key=p.file+':'+originalCell.id;
  if(explained.has(key))return;
  explained.add(key);const text=source(originalCell);cells.push(md(cellId+'-lectura-'+index,dl?text.replace(/^(###)\s+\d+(?:\.\d+)?[A-Z]?\s*[·.:]\s*/gm,'$1 '):text));
 };
 const identifiers=dl?[...route.prepareIds,...route.codeIds].map(full=>full.slice(id.length+2)):[...p.prepareIds,...p.codeIds];
 for(const identifier of identifiers){
  const notebook=original(p.file),index=notebook.cells.findIndex(c=>c.id===identifier);
  const c=notebook.cells[index];
  if(!c&&!custom[identifier])throw new Error(id+': celda ausente '+identifier);
  const fullId=id+'--'+identifier;
  // Introductions belong BEFORE their own code, not after the previous cell.
  if(c&&!(dl&&custom[identifier])){let first=index;while(first>0&&notebook.cells[first-1].cell_type==='markdown')first--;
   for(let n=first;n<index;n++){
    const text=source(notebook.cells[n]).trim();
    if(text.startsWith('### ')&&!isReading(text))addExplanation(notebook,n,fullId);
   }
  }
  if(dl&&CUSTOM_GUIDES[identifier])cells.push(md(fullId+'-orientacion',CUSTOM_GUIDES[identifier]));
  cells.push(code(fullId,custom[identifier]||source(c),{notebook:p.file,cell:identifier,kind:custom[identifier]?'encounter-practice':'canonical'}));
  // Only genuine result readings follow code. A new numbered section is for the next code cell.
  if(c&&!(dl&&custom[identifier])){let n=index+1;while(n<notebook.cells.length&&notebook.cells[n].cell_type==='markdown'){
   const text=source(notebook.cells[n]).trim();
   if(/^#{1,2}\s/m.test(text)||(/^###\s/m.test(text)&&!isReading(text)))break;
   if(!isReading(text)&&n===index+1)break;
   addExplanation(notebook,n,fullId);n++;
  }}
 }
 if(dl){
  const topics=COURSES.dl.classes.flatMap(m=>m.topics),next=topics[topics.indexOf(id)+1],aula=new URL('/aula/',STUDENT_RECORDS.url).href;
  cells.push(md('comprueba-'+id,`### Lee, comprueba y explica\n\n**Qué debes poder comprobar:** ${dl.colab.check}\n\n**Prueba pequeña:** ${p.tip}\n\n**Pregunta:** ${dl.example.check.question}\n\n**Respuesta razonada:** ${dl.example.check.answer}\n\n**Registra en tu copia:** qué cambiaste, qué observaste y por qué ocurrió. No es una entrega ni una calificación.\n\n[Volver al tema del aula](${aula}#tema/${id})${next?'\n\n[Siguiente tema: '+LESSONS.find(l=>l.id===next).title+']('+aula+'#tema/'+next+')':''}`));
 }else cells.push(md('comprueba-'+id,`### Lee, comprueba y explica\n\n${p.observe}\n\n**Prueba pequeña:** ${p.tip}\n\n**Vuelve al caso:** ${g.takeaway}\n\n${g.understanding?'**Pregunta:** '+g.understanding.question+'\n\n**Respuesta razonada:** '+g.understanding.answer:''}\n\n**Registra en tu copia:** qué representan las filas, qué valores cambiaste, qué observaste y qué límite tiene la conclusión. No es una entrega ni una calificación.\n\n[Volver al tema del aula](https://kthyon.github.io/diplomado-utp-aula/#tema/${id})`));
 if(foundation&&!dl)cells.push(md('razona-'+id,'### Anticipa y explica\n\n'+foundation.question+'\n\n<details><summary>Comparar mi razonamiento</summary>\n\n'+foundation.answer+'\n\n</details>\n'));
 return cells;
}
export function buildEncounterNotebooks({check=false}={}){
 const outputs=[];
 for(const meeting of ENCOUNTER_NOTEBOOKS){
  const cls=COURSES[meeting.course].classes[meeting.index];
  const cells=[md('bienvenida',`# ${meeting.title}\n\n${cls.title}\n\n**Tu copia personal:** en Colab elige **Archivo → Guardar una copia en Drive**. Conserva esa copia para los tres temas del encuentro.\n\nTrabaja en CPU. Estas prácticas no requieren contratar GPU, claves de API ni servicios de pago. La primera preparación puede descargar bibliotecas ausentes; las prácticas de detección descargan los pesos del modelo si no están disponibles.\n\n## Tu recorrido\n\n${meeting.topics.map((id,i)=>`${i+1}. [${LESSONS.find(l=>l.id===id).title}](#scrollTo=tema-${id})`).join('\n')}\n\nCada tema reúne **idea → caso explicado → preparación → ejecución → lectura y comprobación**. Puedes ejecutar todo el cuaderno o empezar por un tema: cada uno vuelve a preparar sus datos y herramientas. No mezcles las cifras de conjuntos diferentes.\n\nLos datos inventados se identifican como simulaciones. Las fotos de detección son demostraciones y no incluyen una evaluación anotada de sus objetos. Las comprobaciones son voluntarias y sin nota.`),...meeting.topics.flatMap(topicCells),md('cierre',`## Cierra el encuentro con una explicación\n\n${meeting.topics.map((id,i)=>`${i+1}. **${LESSONS.find(l=>l.id===id).title}:** ${DL_LEARNING_PATHS[id]?.example.takeaway||LESSONS.find(l=>l.id===id).guide.takeaway}`).join('\n')}\n\nEn cada resultado identifica entrada, salida, unidad o significado, forma de comprobarlo y límite. Guarda tu copia personal. Colab no registra automáticamente tu avance en el aula.`)];
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
