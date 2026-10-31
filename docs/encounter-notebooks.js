// Un cuaderno autocontenido por encuentro; los originales siguen como apoyo.
export const ENCOUNTER_NOTEBOOKS = [
 {course:'ml',index:0,file:'ml-encuentro-1.ipynb',title:'ML · Encuentro 1 · Datos y primera predicción',topics:['ml-problema','ml-preparacion','ml-regresion']},
 {course:'ml',index:1,file:'ml-encuentro-2.ipynb',title:'ML · Encuentro 2 · Clasificar y comprobar alertas',topics:['ml-clasificacion','ml-metricas','ml-umbral']},
 {course:'ml',index:2,file:'ml-encuentro-3.ipynb',title:'ML · Encuentro 3 · Agrupación, PCA y ensambles',topics:['ml-clustering','ml-pca','ml-ensambles']},
 {course:'ml',index:3,file:'ml-encuentro-4.ipynb',title:'ML · Encuentro 4 · Tiempo, acciones y evidencia',topics:['ml-series','ml-refuerzo','ml-integracion']},
 {course:'dl',index:0,file:'dl-encuentro-1.ipynb',title:'DL · Encuentro 1 · Neurona, activaciones y entrenamiento',topics:['dl-redes','dl-activaciones','dl-entrenamiento']},
 {course:'dl',index:1,file:'dl-encuentro-2.ipynb',title:'DL · Encuentro 2 · Imágenes, CNN y transferencia',topics:['dl-vision','dl-cnn','dl-transferencia']},
 {course:'dl',index:2,file:'dl-encuentro-3.ipynb',title:'DL · Encuentro 3 · Secuencias, atención y Transformer',topics:['dl-secuencias','dl-atencion','dl-transformers']},
 {course:'dl',index:3,file:'dl-encuentro-4.ipynb',title:'DL · Encuentro 4 · Detección, evaluación y revisión',topics:['dl-yolo','dl-evaluacion','dl-integracion']}
];
export const encounterForTopic=id=>ENCOUNTER_NOTEBOOKS.find(meeting=>meeting.topics.includes(id));
export function colabNotebookUrl(file,topic=''){
 const meeting=ENCOUNTER_NOTEBOOKS.find(item=>item.file===file);
 const anchor=meeting?.topics.includes(topic)?'#scrollTo=tema-'+topic:'';
 return 'https://colab.research.google.com/github/kthyon/diplomado-utp-aula/blob/main/docs/notebooks/'+encodeURIComponent(file)+anchor;
}
