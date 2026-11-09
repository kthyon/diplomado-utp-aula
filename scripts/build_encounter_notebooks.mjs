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
// The last two encounters begin with an action rather than a second textbook.
const PRACTICAL_NOTEBOOK_GUIDES={
 'dl-secuencias':{
  problem:'¿Una red puede anticipar la siguiente lectura mejor que repetir la última?',
  data:'Usaremos una serie artificial de 240 lecturas sin unidades físicas. Cada entrada contiene las 12 lecturas anteriores; la respuesta buscada es la lectura que sigue. El corte temporal reserva los últimos 60 instantes para comprobar, uno por uno.',
  predict:'Dibuja una subida. Si el pronóstico repite la última lectura disponible, ¿quedará por encima o por debajo de la siguiente si la subida continúa? Escribe tu predicción sin mirar la salida.',
  run:'Ejecuta las dos celdas de preparación de este tema y después «Una LSTM real». Espera al gráfico y a los dos números MAE.',
  compare:'Elige el mismo instante en las tres líneas: Real simulado, LSTM y Último valor. Compara quién queda más cerca en una subida y en una bajada. Después compara los dos MAE; menor significa menor distancia media en esta reserva, no acierto garantizado en cada instante.',
  explain:'«En este instante la entrada es el pasado disponible; la respuesta real es…; el pronóstico de… queda más cerca porque…».',
  bridge:'La regla de mitades de la web muestra cómo actualizar un resumen. Aquí una LSTM (memoria de largo y corto plazo) sí aprende parámetros y una capa de salida produce un pronóstico. Son datos y resultados diferentes.',
  change:'Conserva primero datos, semilla y entrenamiento. Cambia el instante que observas y compara los mismos tres valores. No ejecutes de nuevo solo para buscar un resultado que te guste.',
  check:'El estado resume lo leído; la capa de salida produce el pronóstico. Un MAE menor significa menor distancia media sobre la misma reserva, sin garantizar que el modelo gane en cada instante. Usa los dos números que obtuviste para justificar tu comparación.'
 },
 'dl-atencion':{
  problem:'¿Cómo cambia una mezcla si consultamos de otra forma los mismos dos registros?',
  data:'A contiene 10 cajas ficticias y B contiene 20. Las claves K son [1,0] y [0,1]. Las consultas Q son [1,0], [0,1] y [0,0]. Los valores V que se mezclan son 10 y 20. Todos estos números están dados; aquí no se entrena una red.',
  predict:'Para la consulta [0,0], ambas fuentes recibirán el mismo peso. Calcula por tu cuenta mitad de 10 + mitad de 20. Para [1,0], ¿esperas una mezcla más cerca de 10 o de 20?',
  run:'Ejecuta la preparación de este tema y la celda de las dos fuentes. No necesitas ejecutar la LSTM anterior.',
  compare:'Compara las filas [1,0] y [0,0] del mapa: cuánto participa A, cuánto B y cuánto suman. Sigue esas participaciones hasta las barras de mezcla. Comprueba con tus números la fila neutra antes de leer las demás.',
  explain:'«Cambió Q; K y V se conservaron. La fuente… recibió más participación y por eso la mezcla se acercó a…».',
  bridge:'Atención compara Q con K, calcula participaciones y mezcla V. Es una operación que luego puede formar parte de un Transformer; la LSTM no se convierte en Transformer al ejecutar esta celda.',
  change:'Conserva claves y valores. El código ya calcula tres consultas para que compares únicamente ese cambio.',
  check:'La consulta neutra da participaciones 0,5/0,5 y mezcla 15. La primera consulta acerca la mezcla a 10 y la segunda a 20. Cambian los pesos de atención; los valores y los parámetros dados se conservan.'
 },
 'dl-transformers':{
  problem:'¿La respuesta de una red coincide con una regla que tú puedes comprobar?',
  data:'La tarea pregunta únicamente «¿el último número es menor que el primero?». Clase 1 significa sí y clase 0 significa no. Se entrena un Transformer pequeño con secuencias artificiales de cuatro números; los patrones de prueba no se comparten con entrenamiento.',
  predict:'Resuelve estas cuatro filas mirando solo los extremos: [1,2,3,4], [4,3,2,1], [2,7,1,3] y [3,1,7,2]. Anota una etiqueta 0 o 1 por fila antes de ejecutar. Una subida intermedia no cambia la pregunta.',
  run:'Ejecuta la preparación de este tema y el Transformer. Espera a que termine el entrenamiento y aparezcan las cuatro comparaciones.',
  compare:'En cada fila, separa «respuesta conocida» de «respuesta de la red». Marca coincidencia o error. La puntuación de clase 1 es la preferencia calculada para sí; no es la etiqueta correcta. El acierto en prueba resume otros patrones reservados.',
  explain:'«La referencia de esta fila es… porque comparé… con…; la red respondió…; por tanto aquí acertó/falló».',
  bridge:'El modelo representa números, añade información de posición, relaciona elementos mediante atención y calcula dos puntuaciones de clase. La web usa puntuaciones dadas para aprender a leerlas; aquí sí se calculan con parámetros entrenados.',
  change:'Conserva primero los cuatro casos y compara sus respuestas. No confundas «último menor que primero» con «todos los pasos disminuyen». En esta prueba se excluyen extremos iguales.',
  check:'Las referencias manuales son 0, 1, 0 y 1. Solo después de ejecutar sabes qué respondió esta red entrenada. Compara cada predicción con su referencia; su puntuación de clase 1 por sí sola no certifica que acertó.'
 },
 'dl-yolo':{
  problem:'¿Cómo seguimos un objeto propuesto desde la foto hasta un registro que podamos revisar?',
  data:'Usaremos bus.jpg, una foto incluida en la biblioteca, y un detector preentrenado con categorías de COCO. Bus y persona pertenecen a su catálogo; defectos del café no se aprenden al cambiar un nombre.',
  predict:'Antes de pedir predicciones, mira la foto y nombra dos objetos que buscarías. Después predice qué cambiará al elevar el umbral: ¿los píxeles originales o las propuestas conservadas?',
  run:'Ejecuta las celdas de este tema en orden: preparación, catálogo, foto, detección, tabla, conteo, umbrales y guardado. Lee la foto original antes de ejecutar la detección.',
  compare:'Elige una caja y encuentra una fila con la misma categoría y coordenadas aproximadas. Compara después las tres fotos de umbrales 0,15, 0,50 y 0,85: identifica una propuesta que permanezca o desaparezca, además del total.',
  explain:'«La fila propone… en la zona… con puntuación…; el corte… la conserva/descarta. Todavía falta comprobar…».',
  bridge:'La web usa puntuaciones dadas para aprender el filtro. Aquí el modelo calcula propuestas sobre una foto real. El registro guarda propuestas conservadas, todavía no un inventario confirmado.',
  change:'Conserva foto y modelo; compara únicamente los umbrales del bloque. Tanto esta biblioteca como el nuevo ejercicio de la web conservan puntuaciones estrictamente mayores que el corte. Igualar el corte no basta para conservar una propuesta.',
  check:'El corte filtra propuestas, conserva los píxeles de entrada y no entrena de nuevo. Cada fila corresponde a una propuesta conservada. Para comprobar calidad hacen falta referencias anotadas; la foto marcada y su conteo no bastan.'
 },
 'dl-evaluacion':{
  problem:'¿Una propuesta conservada está bien localizada o deja un objeto sin detectar?',
  data:'Cambiamos de la foto real a dos cajas inventadas con referencia conocida. Ambas miden 40×40 píxeles y tienen la misma categoría. La propuesta vale 0,80. Esta práctica evalúa esas cajas; no calcula la calidad del detector sobre bus.jpg.',
  predict:'Con el corte de puntuación en 0,50 y la IoU mínima en 0,50, ¿desplazar la propuesta 30 píxeles puede producir una falsa propuesta y una omisión a la vez? Dibuja qué quedaría sin emparejar.',
  run:'Ejecuta la preparación de este tema y la evaluación de cajas. Observa los tres escenarios de la misma figura.',
  compare:'Primero compara desplazamientos de 10 y 30 píxeles: área compartida e IoU. Después compara 10 píxeles con corte 0,50 y con corte 0,90: la ubicación es la misma, pero la propuesta se filtra. Justifica cada TP, FP y FN con una caja concreta.',
  explain:'«La propuesta se conserva/descarta porque…; coincide/no coincide porque…; la referencia queda…; por eso los conteos son…».',
  bridge:'El tema anterior obtenía propuestas sin anotaciones. Ahora añadimos una referencia inventada para aprender a comprobar ubicación. IoU mide superposición; la puntuación del modelo sirve para filtrar. Son números diferentes.',
  change:'Conserva inicialmente los tres escenarios del código. Compara una sola diferencia cada vez. Una referencia se empareja como máximo una vez.',
  check:'Con la configuración inicial, los tres escenarios producen TP/FP/FN de 1/0/0, 0/1/1 y 0/0/1. La propuesta mal ubicada es falsa y deja sin detectar la referencia. Filtrarla elimina esa falsa propuesta, pero la referencia sigue omitida.'
 },
 'dl-integracion':{
  problem:'¿Qué regla de revisión conviene si revisar y dejar pasar defectos tienen consecuencias diferentes?',
  data:'Tenemos diez granos ficticios con puntuaciones dadas de defecto. Aquí 1 significa defectuoso y 0 significa sin defecto. Revisar cuesta 1 punto; aceptar un defecto cuesta inicialmente 8. Suponemos revisión perfecta; los puntos no son dinero real.',
  predict:'Con corte 0,50 se revisan cuatro granos y se acepta un defecto. Separa la cuenta en coste de revisar + coste de omitir. ¿Podría salir más caro que revisar los diez?',
  run:'Ejecuta la preparación de este tema y la tabla de costes. Guarda la comparación inicial. Cambia solo COSTO_DEFECTO_ACEPTADO de 8 a 1 y vuelve a ejecutar la celda completa.',
  compare:'Para los cortes 0,30 y 0,50, compara revisiones, defectos omitidos y coste. Después compara las dos ejecuciones: las dos primeras cantidades no cambian; cambia su valoración. Si hay empate, compara también cuántas revisiones exige cada regla.',
  explain:'«Con estos costes prefiero… porque supone… revisiones y… defectos aceptados. Si cambia…, la comparación…».',
  bridge:'Esta es otra tarea: decidir revisión de unidades conocidas mediante puntuaciones de defecto dadas. Estas puntuaciones no son la confianza de presencia de YOLO ni salen del detector de autobuses.',
  change:'Mantén los diez granos, sus etiquetas, sus puntuaciones y el coste de revisión. Cambia solo el coste de omisión. Las etiquetas conocidas sirven para evaluar; una regla real se elige con validación y se comprueba después con prueba reservada.',
  check:'Con coste de omisión 8, el corte 0,30 cuesta 6 puntos y el 0,50 cuesta 12; revisar todos cuesta 10. Al cambiar a 1 se conserva cuántos granos revisa y omite cada regla, pero cambia el total. Compara también carga de trabajo y supuestos, especialmente ante un empate.'
 }
};
const practicalIntro=(guide,route)=>`## ${route.section}\n\n**Lo que vas a poder hacer:** ${guide.problem}\n\n${guide.data}\n\n### Predice antes de ejecutar\n\n${guide.predict}\n\n### Ejecuta y compara\n\n1. ${guide.run}\n2. ${guide.compare}\n\n### Explica con tus palabras\n\n${guide.explain}\n\n**Cómo conecta con el aula:** ${guide.bridge}\n\n**Antes de ejecutar:** este tema incluye su preparación. Ejecuta sus celdas en orden; no requiere los temas anteriores. Si repites el tema desde cero, comienza por su preparación.\n\n**Qué cambiar y qué conservar:** ${guide.change}`;
// Clarify the principal reading without changing the preserved support notebook.
const DL_READING_CLARIFICATIONS={
 'dl-secuencias':{
  'paso-lab11-lstm':`### Pon una pregunta junto al gráfico

Ejecuta la celda. Cuando termine, elige un instante de subida y compara las tres lecturas en ese mismo punto. Las doce lecturas anteriores son la entrada; la siguiente es la respuesta que queremos anticipar. La LSTM actualiza un estado y una capa de salida lo convierte en pronóstico.`,
  'lectura-lab11-lstm':`### Después de ejecutar: construye el error paso a paso

Primero compara las líneas **Real simulado**, **LSTM** y **Último valor** en el mismo instante. Estar más cerca de la línea real significa cometer un error menor en ese instante.

**MAE** significa error absoluto medio. Se construye así, con un ejemplo independiente del gráfico:

1. Una respuesta real de 1 y un pronóstico de 0,7 dejan una diferencia de 1−0,7=0,3.
2. Tomamos su magnitud: |0,3|=0,3. Si el pronóstico fuera 1,3, |1−1,3|=0,3 también. Los errores por encima y por debajo no se cancelan.
3. Si tres errores fueran 0,3; 0,1 y 0,2, los sumamos: 0,3+0,1+0,2=0,6.
4. Repartimos entre los tres casos: 0,6÷3=0,2. Esa es la distancia media de ese ejemplo, no el resultado de la LSTM.

Ahora lee los **dos MAE que imprime tu ejecución**. Se calcularon sobre los mismos instantes reservados: menor MAE significa menor distancia media en esa reserva. El promedio puede mejorar aunque un punto concreto empeore. Los valores no tienen unidades físicas ni son porcentajes.

Son 60 comprobaciones de un paso usando el pasado disponible en cada instante, no un pronóstico recursivo de los 60 pasos a partir de una sola ventana. Si eliges parámetros mirando repetidamente esta reserva, pasa a ser validación y necesitas otra prueba final.`
 },
 'dl-atencion':{
  'defs-atencion-20261027':`### Tres nombres para seguir la cuenta

**Q, consulta:** lista de números que determina qué comparamos. **K, claves:** listas de cada fuente con las que se compara Q. **V, valores:** cantidades que se mezclan después. Una lista de números se llama vector; [1,0] tiene dos componentes, no es una fracción.

**Softmax** convierte las comparaciones en participaciones positivas cuya suma es 1. Verás sus operaciones con números en el paso siguiente.`,
  'utp-60cef2918a69df7e':`### De comparar a mezclar: una sola consulta

Sigue Q=[1,0], K de A=[1,0], K de B=[0,1], V de A=10 y V de B=20. Son números dados para enseñar la operación.

| Paso | Sustituye los números | Qué significa |
| --- | --- | --- |
| Comparar con A | 1×1 + 0×0 = 1 | Multiplicar componentes del mismo lugar y sumar se llama producto punto. |
| Comparar con B | 1×0 + 0×1 = 0 | La misma consulta se compara con la otra clave. |
| Ajustar la escala | 1÷√2≈0,7071; 0÷√2=0 | d=2 es el número de componentes de cada clave. √2≈1,4142. Este ajuste forma parte de esta atención. |
| Preparar una cuenta estable | 0,7071−0,7071=0; 0−0,7071≈−0,7071 | Restamos el mayor a ambos. Evita números enormes al usar exponenciales y conserva el reparto final. |
| Convertir a cantidades positivas | exp(0)=1; exp(−0,7071)≈0,4931 | exp es la función exponencial; usa calculadora o el programa, no necesitas resolverla mentalmente. |
| Sumar las partes | 1+0,4931≈1,4931 | Total antes de repartir. |
| Dividir cada parte por el total | A: 1÷1,4931≈0,6698; B: 0,4931÷1,4931≈0,3302 | Participaciones aproximadas del 66,98 % y 33,02 %; suman 100 %. |
| Calcular aportes y sumarlos | 0,6698×10 + 0,3302×20≈13,302 | Cada participación multiplica su valor; la suma es el contexto o mezcla. |

El código conserva más decimales que esta tabla. La mezcla queda más cerca de 10 porque A participa más. Estos pesos cambian con Q; no son parámetros entrenados ni demuestran una causa.`,
  'paso-lab12-atencion':`### Ahora comprueba tu predicción

Ejecuta la celda y busca primero Q=[0,0]. ¿Coincide con la mezcla que calculaste antes? Después compara Q=[1,0] con Q=[0,1] sin cambiar las claves ni los valores.`,
  'lectura-lab12-atencion':`### Después de ejecutar: une la fila con la barra

En Q=[0,0], la participación es 0,5 y 0,5; los aportes son 0,5×10=5 y 0,5×20=10; la mezcla es 5+10=15. Q=[1,0] produce una mezcla cercana a 13,302 y Q=[0,1] una cercana a 16,698.

Cada fila del mapa debe sumar 100 %. Cada barra representa una mezcla, no un porcentaje ni una cantidad de objetos detectados. Aquí Q, K y V estaban dados y no hubo entrenamiento. El tema siguiente usa atención dentro de otra arquitectura y entrena una tarea diferente.`
 },
 'dl-transformers':{
  'paso-lab12-transformer':`### Conserva tus cuatro etiquetas junto a la salida

Antes de ejecutar, anota tus etiquetas 0/1 de las cuatro secuencias de la introducción. El programa entrena una red; tus etiquetas manuales sirven para comprobar sus respuestas, no para sustituirlas.`,
  'lectura-lab12-transformer':`### Después de ejecutar: comprueba cada respuesta

Las cuatro referencias son **0, 1, 0, 1**: en cada fila se compara únicamente el último número con el primero. Una subida intermedia no cambia la tarea. Busca para cada fila la «respuesta de la red» y marca si coincide; una puntuación alta también puede acompañar un error.

**Cómo leer la puntuación:** el modelo calcula dos valores y softmax los transforma en dos participaciones que suman 1. El programa imprime la de clase 1. Por ejemplo, si imprimiera 0,80 para clase 1, la de clase 0 sería 1−0,80=0,20. Elegiría 1 porque 0,80 es mayor que 0,20. Es un ejemplo de lectura, no una salida prometida. El código elige la mayor; en empate exacto elige clase 0.

**Cómo leer «Accuracy en prueba»:** cuenta respuestas correctas y divide entre los casos reservados. Ejemplo independiente: 3 aciertos÷4 casos=0,75, equivalente al 75 %. El valor que imprime tu ejecución procede de los patrones reservados, no solo de estas cuatro filas. La curva de pérdida pertenece al entrenamiento y no es ese porcentaje.

El modelo del cuaderno representa cada número, añade posición, aplica un bloque con atención y otras transformaciones y calcula la salida. Su lectura final también conserva las posiciones; esta práctica no aísla el efecto de añadir posición. El resultado comprueba esta tarea artificial, no tareas de conversación ni lenguaje.`
 },
 'dl-yolo':{
  'defs-yolo-20261027':`### Herramientas que vas a usar

**YOLO** (You Only Look Once, solo se mira una vez) es una familia de detectores. **COCO** (Common Objects in Context, objetos comunes en contexto) es el conjunto de categorías del modelo usado. **CPU** es el procesador; esta práctica no necesita GPU. **RGB** significa rojo, verde y azul: son los tres canales de la foto.

Ejecuta la preparación y mira la foto original antes de pedir propuestas.`,
  'defs-formatos-20261027':`### Guarda qué se propuso y con qué configuración

**CSV** (valores separados por comas) guarda las filas de detecciones y conteos como tablas. **JSON** (notación de objetos de JavaScript) guarda nombres y valores de la configuración, como modelo y umbral. Guardar archivos permite revisar la ejecución; no demuestra que las detecciones sean correctas.`
 },
 'dl-evaluacion':{
  'defs-yolo-20261027':`### Prepara este tema de forma independiente

Ejecuta las dos celdas de preparación aunque no hayas abierto el tema anterior. La evaluación siguiente utiliza cajas dadas: no necesita entrenar un modelo ni evaluar objetos de una foto.`,
  'defs-evaluacion-20261027':`### Construye la superposición antes de contar errores

La referencia es [10,20,50,60]: esquina izquierda-superior (10,20) y derecha-inferior (50,60). Ancho=50−10=40 píxeles; alto=60−20=40; área=40×40=1600 píxeles cuadrados. La propuesta mide lo mismo.

Para desplazar **10 píxeles** a la derecha:

1. La propuesta queda en [20,20,60,60].
2. El ancho común es 50−20=30; alto común=40; área común=30×40=1200.
3. Sumamos áreas y restamos lo común para no contarlo dos veces: 1600+1600−1200=2000.
4. **IoU** (intersección sobre unión)=área común÷área de la unión=1200÷2000=0,60. No tiene unidades.

Para desplazar **30 píxeles**: ancho común=10; área común=10×40=400; unión=1600+1600−400=2800; IoU=400÷2800≈0,143.

La puntuación 0,80 se compara con el corte para conservar la propuesta. Después, la categoría correcta y una IoU de al menos 0,50 permiten emparejarla con la referencia.

- **TP, verdadero positivo:** propuesta y referencia emparejadas correctamente.
- **FP, falso positivo:** propuesta conservada sin coincidencia válida.
- **FN, falso negativo:** objeto de referencia que quedó sin una propuesta válida.

Una propuesta mal ubicada puede generar un FP y dejar un FN al mismo tiempo. Esta cuenta pequeña no calcula AP ni mAP, métricas agregadas que requieren otro protocolo y más anotaciones.`
 },
 'dl-integracion':{
  'utp-2edbf927925d5fd5':`### Separa decisión y consecuencia

En esta celda **real_defecto=1 significa defectuoso** y 0 significa sin defecto. Las puntuaciones p_defecto están dadas; no provienen de YOLO ni de una red entrenada aquí. La etiqueta real sirve para comprobar después qué defecto se omitió.

Para el corte 0,50:

1. Se revisa si p_defecto≥0,50. Eso selecciona los granos 2, 5, 7 y 8: **4 revisiones**.
2. Entre los aceptados queda el grano 4, que era defectuoso: **1 defecto omitido**.
3. Coste de revisar=4 revisiones×1 punto por revisión=**4 puntos**.
4. Coste de omitir=1 defecto×8 puntos por defecto=**8 puntos**.
5. Total=coste de revisar+coste de omitir=4+8=**12 puntos**.

No se cuenta como omitido un defecto revisado: suponemos que la revisión lo identifica correctamente. Esta revisión perfecta y estos costes son supuestos del ejercicio, no resultados medidos de una operación.`,
  'paso-lab14-costos':`### Compara dos valoraciones de los mismos casos

Ejecuta con COSTO_DEFECTO_ACEPTADO=8 y conserva la tabla. Después cambia solo ese coste a 1 y vuelve a ejecutar la celda. Aquí positivo significa defectuoso, aunque otros ejemplos del curso usaran 1 para sano.`,
  'lectura-lab14-costos':`### Después de ejecutar: explica el coste y la carga de trabajo

Con coste de omisión 8, el corte 0,30 produce 6 revisiones×1+0 omisiones×8=**6 puntos**. El corte 0,50 produce 4×1+1×8=**12 puntos**. Revisar todos cuesta 10×1=**10 puntos**.

Con coste de omisión 1, el corte 0,70 revisa 3 y omite 1: 3×1+1×1=**4**. El corte 0,90 revisa 1 y omite 3: 1×1+3×1=**4**. Empatan en puntos, pero requieren distintas revisiones y aceptan distintos defectos.

Las puntuaciones y etiquetas se conservaron; cambió una consecuencia. En una aplicación real habría que medir capacidad, costes y errores de la revisión. La validación ayuda a elegir la regla y una prueba reservada permite comprobarla después; estas diez filas didácticas no hacen ambas funciones de manera independiente.`
 },
 'dl-entrenamiento':{
  'lectura-lab09-entrenar':`### Después de ejecutar: tres comprobaciones pequeñas

**Datos reservados:** de los 320 casos simulados, 240 entrenan la red y 80 quedan para comprobarla. Aquí 1 significa sano y 0, defectuoso.

**Pérdida y aciertos:** el primer punto de la curva resume las pérdidas de los lotes durante la primera época; no es la pérdida antes de aprender. Compáralo con la última época sin convertirlo a porcentaje. La salida «Accuracy en prueba» sí es una proporción de aciertos entre 0 y 1: por ejemplo, 0,95 equivale al 95 %.

**Cómo leer el mapa:** el fondo representa la puntuación de la red para sano: tonos rojos para valores bajos y verdes para altos. Los puntos representan las etiquetas conocidas de los casos reservados: rojo = defectuoso; verde = sano. Compara cada punto con el fondo de su zona; un punto no es la predicción del modelo.

Si pruebas otra tasa, registra la comparación. Elegir con esa reserva la convierte en validación, no en una prueba final nueva.`
 },
 'dl-cnn':{
  'utp-99a3c1dce2d23643':`### De los cuadritos a la respuesta

La CNN recibe una imagen de 8×8 y aplica ocho filtros de 3×3 cuyos pesos aprende. Producen ocho mapas de respuestas. ReLU cambia a cero las respuestas negativas. MaxPool toma el máximo de cada zona y reduce los mapas de 8×8 a 4×4. Al final, la red calcula diez puntuaciones, una por dígito, y elige la mayor. Esas puntuaciones se llaman logits, no son diez objetos.

**Cómo leer las figuras:** compara «Real» y «pred.» para cada imagen. Después observa el mapa de un filtro fijo que compara izquierda y derecha; es distinto de los ocho filtros aprendidos y del filtro del aula que compara filas. Sus colores representan respuestas numéricas, no clases de dígitos ni probabilidades.

**Qué probar:** cambia solo EPOCAS de 12 a 1 y vuelve a ejecutar la celda entera. Compara respuestas y pérdida sin prometer que cada imagen empeorará. Si eliges una versión mirando repetidamente la misma reserva, la estás usando como validación. Para reutilizar pesos, continúa en el **Tema 3 de este mismo cuaderno**: carga otro modelo para otra tarea; no convierte esta CNN de dígitos en detector.`
 }
};
function dlIntro(item,route,id){
 if(PRACTICAL_NOTEBOOK_GUIDES[id])return practicalIntro(PRACTICAL_NOTEBOOK_GUIDES[id],route);
 return `## ${route.section}\n\n**Lo que vas a poder hacer:** ${item.goal}\n\n### Entiende la idea\n\n${item.definition}\n\n${item.terms.map(([term,meaning])=>'**'+term+':** '+meaning).join('\n\n')}\n\n### Un caso pequeño antes del programa\n\n**${item.example.question}**\n\n${item.example.intro}\n\n**Cómo leerlo:** ${item.example.reading}\n\n**Para recordar:** ${item.example.takeaway}\n\n### Ahora identifica los datos de esta práctica\n\n${item.colab.goal}\n\n${item.colab.steps.map((step,i)=>(i+1)+'. '+step).join('\n')}\n\n**Antes de ejecutar:** este tema incluye su preparación. Ejecuta las celdas en orden; no requiere los temas anteriores. Las celdas nuevas de cuentas pequeñas incluyen sus propias importaciones y datos.\n\n**Qué cambiar y qué conservar:** ${route.tip}`;
}
function topicCells(id){
 const lesson=LESSONS.find(l=>l.id===id),g=lesson.guide,p={...SOURCE_NOTEBOOK_PATHS[id],...PRIMARY_NOTEBOOK_PRACTICES[id]},route=NOTEBOOK_PATHS[id],dl=DL_LEARNING_PATHS[id];
 const cells=dl?[md('tema-'+id,dlIntro(dl,route,id))]:[md('tema-'+id,`## ${route.section}\n\n**Lo que vas a poder hacer:** ${g.objective}\n\n${g.relevance}\n\n### Entiende la idea\n\n${g.concept}\n\n### Un caso pequeño antes del programa\n\n**${g.case.title}**\n\n${g.case.context}\n\n${g.case.columns?.length?table(g.case.columns,g.case.rows):''}\n\n${g.case.reasoning.map((s,i)=>(i+1)+'. '+s).join('\n')}\n\n**Qué demuestra:** ${g.case.conclusion}\n\n### Ahora identifica los datos de esta práctica\n\n${p.observe}\n\nEl caso pequeño y la ejecución pueden usar conjuntos diferentes: interpreta las cifras con las unidades y filas declaradas en cada uno.\n\n**Antes de ejecutar:** este tema incluye su preparación. Ejecuta sus celdas en orden; no requiere ejecutar los temas anteriores. Si repites un tema, comienza desde su primera celda.\n\n**Qué cambiar y qué conservar:** ${p.tip}`)];
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
  // This optional support-only block precedes lab14 but is not part of its lesson.
  if(dl&&originalCell.id==='extensiones')return;
  if(explained.has(key))return;
  explained.add(key);const text=DL_READING_CLARIFICATIONS[id]?.[originalCell.id]||source(originalCell);cells.push(md(cellId+'-lectura-'+index,dl?text.replace(/^(###)\s+\d+(?:\.\d+)?[A-Z]?\s*[·.:]\s*/gm,'$1 '):text));
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
  const practical=PRACTICAL_NOTEBOOK_GUIDES[id];
  cells.push(md('comprueba-'+id,`### Lee, comprueba y explica\n\n**Qué debes poder comprobar:** ${practical?practical.compare:dl.colab.check}\n\n**Prueba pequeña:** ${practical?practical.change:p.tip}\n\n**Pregunta:** ${practical?practical.problem:dl.example.check.question}\n\n**Respuesta razonada:** ${practical?practical.check:dl.example.check.answer}\n\n**Registra en tu copia:** ${practical?practical.explain:'qué cambiaste, qué observaste y por qué ocurrió.'} No es una entrega ni una calificación.\n\n[Volver al tema del aula](${aula}#tema/${id})${next?'\n\n[Siguiente tema: '+LESSONS.find(l=>l.id===next).title+']('+aula+'#tema/'+next+')':''}`));
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
