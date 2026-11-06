import {neuronExample,sequenceState,attentionExample,detectionExample} from './dl-example-models.js';

// Original diagrams. Geometry explains calculations; no result is presented as a trained model.
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,d=3)=>Number(n).toLocaleString('es-CO',{maximumFractionDigits:d});
const t=(x,y,value,cls='',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${esc(value)}</text>`;
const lines=(x,y,values,cls='',gap=25)=>values.map((v,i)=>t(x,y+i*gap,v,cls)).join('');
const box=(x,y,w,h,kind,values)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" class="dl-topic-box dl-topic-${kind}"/>${lines(x+w/2,y+h/2-(values.length-1)*12+6,values,'dl-topic-value')}`;
const circle=(x,y,r,kind,values)=>`<circle cx="${x}" cy="${y}" r="${r}" class="dl-topic-box dl-topic-${kind}"/>${lines(x,y-(values.length-1)*12+6,values,'dl-topic-value')}`;
const arrow=(id,path,kind='operation',extra='')=>`<path d="${path}" class="dl-topic-arrow dl-topic-${kind}" marker-end="url(#${id}-${kind})" ${extra}/>`;
const grid=(left,top,values,size,kind='input',selected=()=>false)=>values.map((row,r)=>row.map((v,c)=>`<rect x="${left+c*size}" y="${top+r*size}" width="${size-2}" height="${size-2}" class="dl-topic-pixel dl-topic-${kind} ${v?'dl-topic-pixel-on':''} ${selected(r,c)?'dl-topic-selected':''}"/>${t(left+c*size+(size-2)/2,top+r*size+size/2+5,fmt(v),'dl-topic-cell-value')}`).join('')).join('');

function network(id){
 const r=neuronExample();
 return {height:365,kind:'converging',label:'Dos entradas multiplicadas por sus pesos, sesgo añadido a la suma y activación ReLU de una neurona.',body:
 `<rect x="325" y="105" width="280" height="158" rx="20" class="dl-topic-unit"/>${t(465,287,'Una neurona = suma + activación','dl-topic-label dl-topic-parameter-text')}
 ${arrow(id,'M105 105 H174','input')}${arrow(id,'M105 250 H174','input')}${arrow(id,'M280 105 L350 174')}${arrow(id,'M280 250 L350 201')}${arrow(id,'M390 76 V143','parameter')}${arrow(id,'M432 188 H466')}${arrow(id,'M573 188 H633','result')}
 ${circle(63,105,40,'input',['x₁ = 2'])}${circle(63,250,40,'input',['x₂ = 1'])}
 ${box(175,75,105,60,'parameter',['× 0,5',`= ${fmt(r.products[0])}`])}${box(175,220,105,60,'parameter',['× (−1)',`= ${fmt(r.products[1])}`])}
 ${box(326,15,128,61,'parameter',['Bias b',`+ ${fmt(r.bias)}`])}${circle(390,188,42,'operation',['Suma z',fmt(r.sum)])}${box(468,151,105,74,'operation',['ReLU',fmt(r.output)])}${box(636,151,105,74,'result',['Salida',fmt(r.output)])}
 ${t(227,50,'Peso y aporte','dl-topic-label')}${t(688,259,'Puede entrar a','dl-topic-small')}${t(688,283,'otra capa','dl-topic-small')}
 ${t(380,342,'2 × 0,5 + 1 × (−1) + 0,5 = 0,5 → ReLU conserva 0,5','dl-topic-equation')}`,
 caption:'Azul: entradas. Morado: pesos y bias. Naranja: operaciones dentro de la unidad. Verde: salida. Señales sin unidades y parámetros dados para comprobar la cuenta; no hay entrenamiento. ReLU conserva una suma positiva y devuelve 0 si es negativa.'};
}

function activations(id){
 const z=-2;
 return {height:330,kind:'parallel',label:'La misma suma menos dos se envía por separado a ReLU, sigmoide y tanh: son tres alternativas, no una cadena.',body:
 `${circle(83,165,47,'input',['Misma z','−2'])}
 ${arrow(id,'M132 165 H200 V68 H260')}${arrow(id,'M132 165 H260')}${arrow(id,'M200 165 V262 H260')}
 ${box(264,25,210,86,'operation',['ReLU',`máximo(0, −2)`])}${box(264,122,210,86,'operation',['Sigmoide','1 / (1 + e²)'])}${box(264,219,210,86,'operation',['tanh','tanh(−2)'])}
 ${arrow(id,'M477 68 H555','result')}${arrow(id,'M477 165 H555','result')}${arrow(id,'M477 262 H555','result')}
 ${box(560,34,172,68,'result',['0'])}${box(560,131,172,68,'result',[`≈ ${fmt(1/(1+Math.exp(-z)))}`])}${box(560,228,172,68,'result',[`≈ ${fmt(Math.tanh(z))}`])}
 ${t(643,19,'Salidas diferentes','dl-topic-small')}`,
 caption:'El ramal naranja elige una función alternativa para la misma suma z = −2; no se aplica una función sobre la salida de otra. Verde: salida calculada. Estos valores son adimensionales. Estar entre 0 y 1 no convierte por sí solo una salida en una probabilidad validada.'};
}

function training(id){
 const worse=`<rect x="400" y="350" width="340" height="70" rx="12" class="dl-topic-box" style="stroke:var(--dl-topic-error);fill:color-mix(in srgb,var(--dl-topic-error) 6%,var(--dl-topic-surface))"/>${lines(570,379,['Pérdida: (9 − 3)² = 36','Empeora frente a 25'],'dl-topic-value')}`;
 return {height:465,kind:'learning-rate-comparison',label:'Las dos alternativas parten del mismo parámetro menos dos, pérdida veinticinco y gradiente menos diez. Tasa cero coma uno llega a menos uno y pérdida dieciséis. Tasa uno coma uno llega a nueve y pérdida treinta y seis.',body:
 `${box(20,20,150,90,'parameter',['Inicio θ','−2'])}${box(220,20,190,90,'operation',['Pérdida elegida','(−2 − 3)² = 25'])}${box(470,20,262,90,'operation',['Gradiente común','2 × (−2 − 3) = −10'])}
 ${arrow(id,'M174 65 H216')}${arrow(id,'M414 65 H466')}${arrow(id,'M601 114 V140 H380 V170','parameter')}
 ${arrow(id,'M380 170 H190 V216','parameter')}${arrow(id,'M380 170 H570 V216','parameter')}${t(380,199,'Las dos tasas parten de θ = −2 y L = 25.','dl-topic-small')}
 ${box(20,220,340,105,'parameter',['Paso pequeño · tasa 0,1','−2 − 0,1 × (−10) = −1'])}${box(400,220,340,105,'parameter',['Paso excesivo · tasa 1,1','−2 − 1,1 × (−10) = 9'])}
 ${arrow(id,'M190 329 V346','result')}${arrow(id,'M570 329 V346','operation')}${box(20,350,340,70,'result',['Pérdida: (−1 − 3)² = 16','Mejora frente a 25'])}${worse}
 ${t(380,451,'Son alternativas desde el mismo inicio, no pasos consecutivos.','dl-topic-small')}`,
 caption:'Morado: inicio y actualizaciones propuestas; verde: pérdida menor; rojo: pérdida mayor. Ambas alternativas usan el mismo gradiente −10 y el objetivo fijo 3. Cambia solamente la tasa. Es una cuenta ficticia de un parámetro: la tasa grande se pasa del objetivo y empeora. Al continuar, el siguiente paso parte del nuevo valor elegido, no vuelve a −2.'};
}

function vision(id){
 const picture=(x,y,mode)=>`<rect x="${x}" y="${y}" width="170" height="100" rx="8" class="dl-topic-image-field"/>${[32,85,138].map((cx,i)=>`<circle cx="${x+cx}" cy="${y+54}" r="19" class="${mode==='mask'?'dl-topic-mask-'+i:'dl-topic-object'}"/>${mode==='box'?`<rect x="${x+cx-24}" y="${y+28}" width="48" height="51" class="dl-topic-detection-box"/>`:''}`).join('')}`;
 return {height:405,kind:'parallel',label:'La misma imagen ilustrada de tres frutos puede producir una etiqueta global, tres cajas o tres máscaras de instancia; son tareas distintas.',body:
 `${picture(20,154,'input')}${t(104,132,'Misma imagen','dl-topic-label')}${arrow(id,'M193 204 H240 V77 H281')}${arrow(id,'M240 204 H281')}${arrow(id,'M240 204 V330 H281')}
 ${box(285,34,190,86,'operation',['Clasificación','Para toda la foto'])}${box(285,161,190,86,'operation',['Detección','Localiza objetos'])}${box(285,287,190,86,'operation',['Segmentación','Delimita píxeles'])}
 ${arrow(id,'M479 77 H531','result')}${arrow(id,'M479 204 H531','result')}${arrow(id,'M479 330 H531','result')}
 ${box(536,40,191,74,'result',['«Hay frutos»'])}${picture(547,154,'box')}${picture(547,280,'mask')}
 ${t(630,274,'Caja por objeto','dl-topic-small')}${t(630,400,'Color distinto: una instancia','dl-topic-small')}`,
 caption:'Azul: la misma imagen de entrada. Los tres ramales son tareas alternativas; una etiqueta no se convierte automáticamente en cajas ni en máscaras. Rectángulos: localización. Regiones de colores: instancias separadas. Son marcas ilustrativas originales, no predicciones de un modelo ejecutado.'};
}

function convolution(id){
 const input=[[0,0,0,0,0],[0,0,0,0,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]],kernel=[[-1,-1,-1],[0,0,0],[1,1,1]],output=[[3,3,3],[3,3,3],[0,0,0]];
 return {height:360,kind:'sliding-window',label:'Una ventana de tres por tres en una imagen de cinco por cinco se multiplica por un filtro fijo; la suma tres ocupa una celda del mapa de tres por tres.',body:
 `${t(117,24,'Imagen 5 × 5','dl-topic-label')}${grid(20,44,input,39,'input',(r,c)=>r<3&&c<3)}
 ${t(342,24,'Mismo filtro 3 × 3','dl-topic-label')}${grid(271,44,kernel,47,'parameter')}${t(342,220,'9 productos','dl-topic-small')}${t(342,247,'0 + 0 + 3 = 3','dl-topic-equation')}
 ${arrow(id,'M221 128 H261')}${arrow(id,'M422 128 H507','result')}
 ${t(617,24,'Mapa 3 × 3','dl-topic-label')}${grid(535,44,output,55,'result',(r,c)=>r===0&&c===0)}
 <path d="M20 44H135V159H20Z" class="dl-topic-window"/>
 ${t(380,310,'La misma regla se aplica en cada ventana.','dl-topic-label')}${t(380,343,'Con paso 1 y sin relleno: 5 − 3 + 1 = 3 posiciones por eje.','dl-topic-small')}`,
 caption:'Azul: intensidades ficticias 0/1 de un canal. Morado: pesos de un filtro fijado para enseñar la operación. La ventana naranja se conecta con la celda verde que recibe la suma. Un valor 3 indica respuesta al patrón, no tres objetos. Una CNN entrenada aprende sus filtros.'};
}

function transfer(id){
 return {height:600,kind:'reuse',label:'Usar el modelo conserva sus pesos. Al adaptar una cabeza nueva, solo la imagen entra al extractor congelado. La cabeza produce una predicción que se compara con una etiqueta externa para calcular la pérdida y ajustar la cabeza.',body:
 `${t(20,30,'Usar lo ya aprendido','dl-topic-label','start')}${box(20,55,155,84,'input',['Nueva imagen'])}${box(227,55,234,84,'parameter',['Modelo previo','Pesos sin cambios'])}${box(520,55,212,84,'result',['Categorías que','ya reconoce'])}
 ${arrow(id,'M178 97 H223')}${arrow(id,'M465 97 H516','result')}
 ${t(20,202,'Adaptar a otra tarea: entrenar una cabeza nueva','dl-topic-label','start')}${box(20,220,155,80,'input',['Nueva imagen'])}${box(227,220,234,80,'parameter',['Extractor previo','Se mantiene fijo'])}${box(520,220,212,80,'operation',['Cabeza nueva','Parámetros ajustables'])}
 ${arrow(id,'M178 260 H223','input')}${arrow(id,'M465 260 H516')}${arrow(id,'M626 304 V336','result')}
 ${box(520,340,212,68,'result',['Predicción'])}${box(20,340,250,68,'input',['Etiqueta conocida','No entra al extractor'])}
 ${arrow(id,'M626 412 V431 H380 V446','result')}${arrow(id,'M145 412 V485 H281','input')}${box(285,450,190,70,'operation',['Compara y','calcula pérdida'])}
 ${arrow(id,'M380 524 V552 H750 V260 H736')}${t(535,578,'La pérdida guía el ajuste de la cabeza.','dl-topic-small')}`,
 caption:'Azul: imagen y etiqueta, con recorridos separados. Morado: extractor congelado, cuyos parámetros permanecen fijos. Naranja: cabeza que se entrena y comparación con la etiqueta externa. La actualización usa gradientes de la pérdida; la etiqueta no es una entrada del extractor. Esta adaptación es ilustrativa: el Colab del tema solo ejecuta inferencia. Ajuste fino también puede actualizar parte del extractor.'};
}

function sequence(id){
 const normal=sequenceState(),reverse=sequenceState([30,20,10]);
 return {height:350,kind:'ordered-state',label:'Entradas diez, veinte y treinta actualizan el estado cero a cinco, doce coma cinco y veintiuno coma veinticinco; al invertir el orden termina en trece coma setenta y cinco.',body:
 `${[10,20,30].map((v,i)=>box(190+i*210,30,150,62,'input',[`${v} cajas`])).join('')}
 ${circle(66,181,42,'parameter',['s₀','0'])}${normal.steps.map((s,i)=>circle(265+i*210,181,58,'parameter',[`s${i+1}`,fmt(s.state)])).join('')}
 ${arrow(id,'M111 181 H201','parameter')}${arrow(id,'M326 181 H411','parameter')}${arrow(id,'M536 181 H621','parameter')}${[265,475,685].map(x=>arrow(id,`M${x} 95 V118`,'input')).join('')}
 ${t(380,280,'Estado nuevo = 0,5 × estado anterior + 0,5 × entrada','dl-topic-equation')}${t(380,321,`Orden inverso 30 → 20 → 10: estado final ${fmt(reverse.final)}. Misma media: 20.`,'dl-topic-small')}`,
 caption:'Cada entrada azul llega en su orden. El estado morado se transforma y viaja al paso siguiente: no es la predicción de una entrega futura. La mezcla usa coeficientes 0,5 dados y estados expresados en cajas ficticias. Ilustra memoria recurrente; no representa todas las compuertas de una LSTM.'};
}

function attention(id){
 const r=attentionExample();
 return {height:505,kind:'weighted-merge',label:'La consulta y las claves generan pesos de atención cero coma seis seis nueve ocho y cero coma tres tres cero dos; multiplican los valores diez y veinte, aportan seis coma seis nueve ocho y seis coma seis cero cinco y suman trece coma tres cero dos cajas.',body:
 `${box(20,20,220,76,'input',['Consulta Q','[1, 0]'])}${box(20,115,220,76,'input',['Claves K','A [1,0] · B [0,1]'])}
 ${arrow(id,'M244 58 H264 V104 H281')}${arrow(id,'M244 153 H281')}${box(285,56,215,100,'operation',['Compara Q con K','Divide entre √2','y aplica softmax'])}
 ${arrow(id,'M504 104 H528 V50 H551','parameter')}${arrow(id,'M504 132 H528 V160 H551','parameter')}
 ${box(555,15,180,70,'parameter',['Peso A','≈ '+fmt(r.weights[0],5)])}${box(555,125,180,70,'parameter',['Peso B','≈ '+fmt(r.weights[1],5)])}
 ${arrow(id,'M738 50 H750 V228 H190 V266','parameter')}${arrow(id,'M645 199 V240 H550 V266','parameter')}
 ${t(380,254,'Peso × valor V','dl-topic-label')}
 ${box(40,270,300,90,'result',[`A: ${fmt(r.weights[0],5)} × 10`,`≈ ${fmt(r.contributions[0],4)} cajas`])}${box(400,270,300,90,'result',[`B: ${fmt(r.weights[1],5)} × 20`,`≈ ${fmt(r.contributions[1],4)} cajas`])}
 ${arrow(id,'M190 364 V436 H256','result')}${arrow(id,'M550 364 V436 H504','result')}${box(260,400,240,75,'result',['Suma de aportes',`≈ ${fmt(r.output,4)} cajas`])}`,
 caption:'Q y K son vectores ficticios sin unidades. Los pesos morados suman 1 y se aplican a los valores V: A contiene 10 cajas y B, 20. Un peso del 67 % no significa que A aporte el 67 % de la salida: los aportes aquí son aproximadamente 6,6976 y 6,6048 cajas. Los pesos se recalculan para la consulta, no son aquí parámetros aprendidos. Mostramos redondeos; el cálculo conserva su precisión. La suma conserva la unidad de V.'};
}

function transformer(id){
 return {height:650,kind:'contextual-sequence',label:'Cada una de las cuatro cantidades se representa como un vector y se combina con su posición. Un bloque Transformer transforma esos vectores. La cabeza lee las posiciones y produce dos puntuaciones para decidir clase cero o uno. La clase se compara con una etiqueta externa: uno, porque dos es menor que tres. No se inventa la predicción de la red.',body:
 `${[3,1,7,2].map((v,i)=>box(23+i*185,25,157,67,'input',[`Cantidad ${v}`])+box(23+i*185,104,157,57,'parameter',[`Posición ${i+1}`])).join('')}
 ${[101,286,471,656].map(x=>arrow(id,`M${x} 164 V188`,'input')).join('')}
 ${box(23,192,712,58,'parameter',['Representación: vector de cada cantidad + posición'])}${arrow(id,'M379 254 V277','parameter')}
 <rect x="23" y="281" width="712" height="76" rx="15" class="dl-topic-unit"/>${t(379,309,'Bloque Transformer','dl-topic-label')}${t(379,337,'Autoatención + transformaciones por posición','dl-topic-value')}
 ${arrow(id,'M379 361 V386')}${box(167,390,424,58,'operation',['Cabeza: lee las posiciones → 2 puntuaciones'])}
 ${arrow(id,'M379 452 V466 H187 V477','result')}${box(20,481,335,68,'result',['Predicción','Clase elegida: 0 o 1'])}
 ${box(405,481,330,68,'input',['Etiqueta esperada: 1','Porque 2 < 3'])}
 ${arrow(id,'M187 553 V601 H281','result')}${arrow(id,'M570 553 V601 H479','input')}${box(285,566,190,70,'operation',['Compara la clase','con la etiqueta'])}`,
 caption:'Cada cantidad se convierte en un vector (embedding) y se combina con su posición. El bloque transforma esos vectores; la cabeza del cuaderno conserva la lectura de las posiciones para producir dos puntuaciones. La etiqueta se calcula con la regla última < primera y solo entra en la comparación externa, nunca en el bloque. La predicción real se observa al ejecutar la práctica. Se omiten conexiones residuales y normalización para situar el recorrido básico.'};
}

function yolo(id){
 return {height:400,kind:'proposal-gate',label:'En una imagen ficticia de cien por cien píxeles, la caja va de veinte,veinte a sesenta,sesenta y mide cuarenta por cuarenta píxeles. La propuesta tiene categoría fruto y puntuación cero coma ochenta. Un corte cero coma cincuenta la conserva para revisión.',body:
 `<rect x="18" y="54" width="220" height="220" class="dl-topic-image-field"/><circle cx="106" cy="142" r="34" class="dl-topic-object"/><rect x="62" y="98" width="88" height="88" data-image-box="20,20,60,60" class="dl-topic-detection-box"/>
 ${t(128,32,'Imagen 100 × 100 px','dl-topic-label')}${t(23,77,'(0,0)','dl-topic-small','start')}${t(58,91,'(20,20)','dl-topic-small','start')}${t(155,205,'(60,60)','dl-topic-small','start')}
 ${arrow(id,'M242 166 H302')}${box(307,56,213,83,'result',['Categoría propuesta','«fruto»'])}${box(307,155,213,83,'result',['Caja [x₁,y₁,x₂,y₂]','[20,20,60,60] px'])}${box(307,254,213,83,'result',['Puntuación dada','0,80'])}
 ${arrow(id,'M524 297 H562 V166 H587')}${box(591,123,144,87,'operation',['Corte 0,50','Se conserva'])}
 ${t(642,253,'0,80 ≥ 0,50','dl-topic-equation')}${t(128,310,'x crece hacia la derecha','dl-topic-small')}${t(128,335,'y crece hacia abajo','dl-topic-small')}${t(380,382,'La caja mide (60 − 20) × (60 − 20) = 40 × 40 px.','dl-topic-equation')}`,
 caption:'Imagen, categoría, caja y puntuación son inventadas. El origen (0,0) está arriba a la izquierda; las dos esquinas señaladas coinciden con las coordenadas del registro. La imagen mantiene la misma escala en ambos ejes. El umbral se elige después de puntuar; conservar una propuesta no verifica categoría ni ubicación. La regla didáctica usa ≥; Ultralytics filtra > conf y puede diferir con igualdad exacta.'};
}

function evaluation(id){
 const r=detectionExample();
 return {height:380,kind:'overlap-and-match',label:'Dos cajas de cuarenta por cuarenta píxeles desplazadas diez píxeles comparten mil doscientos píxeles cuadrados; la unión ocupa dos mil y su IoU es cero coma sesenta.',body:
 `<rect x="35" y="54" width="210" height="210" class="dl-topic-truth"/><rect x="87.5" y="54" width="210" height="210" class="dl-topic-proposal"/><rect x="87.5" y="54" width="157.5" height="210" class="dl-topic-overlap"/>
 ${t(140,29,'Referencia','dl-topic-label dl-topic-input-text')}${t(295,290,'Propuesta','dl-topic-label dl-topic-operation-text')}${t(165,136,'Intersección','dl-topic-value')}${t(165,166,'1200 px²','dl-topic-value')}${t(160,323,'Unión: 2000 px²','dl-topic-value')}
 ${arrow(id,'M321 161 H359')}${box(364,55,183,94,'operation',['IoU',`1200 / 2000 = ${fmt(r.iou,2)}`])}${box(364,185,183,98,'operation',['Regla elegida','IoU ≥ 0,50','Misma categoría'])}${arrow(id,'M550 234 H587','result')}${box(591,186,145,97,'result',['Coincide','TP = 1'])}
 ${t(550,342,'Con esta única referencia: FP = 0; FN = 0.','dl-topic-small')}`,
 caption:'Relleno azul: referencia. Contorno naranja: propuesta. Verde: área compartida, no una puntuación del detector. Las dos cajas miden 40 × 40 px; una se desplaza 10 px. Coincidir exige categoría correcta e IoU suficiente. El umbral de IoU comprueba ubicación; el de puntuación conserva propuestas.'};
}

function integration(id){
 return {height:375,kind:'decision-cost',label:'Diez granos se evalúan con dos políticas: corte cero coma treinta revisa seis y omite cero defectos, coste seis; corte cero coma cincuenta revisa cuatro y omite un defecto, coste doce.',body:
 `${circle(75,180,57,'input',['Los mismos','10 granos'])}${arrow(id,'M135 180 H188 V92 H225')}${arrow(id,'M188 180 V271 H225')}
 ${box(229,44,168,94,'operation',['Corte 0,30','6 revisiones','0 omitidos'])}${box(229,223,168,94,'operation',['Corte 0,50','4 revisiones','1 omitido'])}
 ${arrow(id,'M401 92 H449','result')}${arrow(id,'M401 271 H449','result')}${box(454,44,280,94,'result',['6 × 1 + 0 × 8','Coste = 6'])}${box(454,223,280,94,'result',['4 × 1 + 1 × 8','Coste = 12'])}
 ${t(380,24,'Revisar: 1 punto · aceptar un defecto: 8 puntos','dl-topic-equation')}${t(380,360,'Referencia: revisar los 10 cuesta 10 puntos.','dl-topic-small')}`,
 caption:'Azul: el mismo conjunto ficticio. Naranja: regla de revisión; verde: consecuencia calculada. Costes en puntos supuestos, con revisión perfecta para aislar la cuenta. El umbral cambia la acción, no las puntuaciones. Elegir una política requiere validación; el resultado final se comprueba con otros casos reservados.'};
}

const diagrams={
 'dl-redes':network,'dl-activaciones':activations,'dl-entrenamiento':training,
 'dl-vision':vision,'dl-cnn':convolution,'dl-transferencia':transfer,
 'dl-secuencias':sequence,'dl-atencion':attention,'dl-transformers':transformer,
 'dl-yolo':yolo,'dl-evaluacion':evaluation,'dl-integracion':integration
};
export const DL_DIAGRAM_TOPICS=Object.freeze(Object.keys(diagrams));
export const DL_DIAGRAM_SOURCES=Object.freeze({
 'dl-redes':'https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html',
 'dl-activaciones':'https://docs.pytorch.org/docs/stable/nn.html#non-linear-activations-weighted-sum-nonlinearity',
 'dl-entrenamiento':'https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html',
 'dl-vision':'https://docs.ultralytics.com/tasks/segment/',
 'dl-cnn':'https://docs.pytorch.org/docs/stable/generated/torch.nn.Conv2d.html',
 'dl-transferencia':'https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html',
 'dl-secuencias':'https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html',
 'dl-atencion':'https://arxiv.org/abs/1706.03762','dl-transformers':'https://arxiv.org/abs/1706.03762',
 'dl-yolo':'https://docs.ultralytics.com/modes/predict/','dl-evaluacion':'https://docs.ultralytics.com/guides/yolo-performance-metrics/',
 'dl-integracion':'https://scikit-learn.org/stable/modules/classification_threshold.html'
});
export function renderDLTopicDiagram(topic){
 const render=diagrams[topic];if(!render)return '';
 const id=`dl-topic-${topic}`,d=render(id);
 const defs=['input','parameter','operation','result'].map(kind=>`<marker id="${id}-${kind}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 1L9 5L0 9Z" class="dl-topic-marker dl-topic-${kind}"/></marker>`).join('');
 return `<figure class="dl-topic-diagram" data-dl-diagram="${topic}" data-diagram-kind="${d.kind}"><div class="dl-diagram-frame" role="region" tabindex="0" aria-label="Gráfico del ejemplo. Si no cabe, desplázalo horizontalmente para leer todas las etiquetas."><svg viewBox="0 0 760 ${d.height}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${esc(d.label)}</title><defs>${defs}</defs>${d.body}</svg></div><figcaption>${esc(d.caption)}</figcaption></figure>`;
}
