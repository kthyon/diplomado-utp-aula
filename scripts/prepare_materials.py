import json
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
workspace=root.parent
source=workspace/'output/ml_revision'
dest=root/'docs/notebooks'
dest.mkdir(parents=True,exist_ok=True)
mapping={**{f'nb{i}_revisado.ipynb':f'{name}.ipynb' for i,name in enumerate(['regresion','clasificacion','clustering','pca','refuerzo'])},'Laboratorio_ML_Complementario_Explicado.ipynb':'laboratorio-ml.ipynb','dl_1e948K0wdBLFS9tgJuJJY0e-KlAjrF2Ny.ipynb':'laboratorio-dl.ipynb','dl_1AEQuucmDe8-tSnHSML68MY4AjRzjtHQZ.ipynb':'yolo-registro.ipynb'}
for original,target in mapping.items():
    n=json.loads((source/original).read_text(encoding='utf-8'))
    n['cells'].insert(0,{'cell_type':'markdown','metadata':{},'source':'# Tu copia personal · Aula UTP\n\nEste cuaderno se abre desde GitHub. En Colab elige **Archivo → Guardar una copia en Drive** antes de conservar cambios. Renombra esa copia y ejecuta de arriba abajo. Cada estudiante trabaja en su propio archivo y entorno.\n\nLos ejemplos son didácticos: sigue la sección indicada por Cristian para esta clase. Las comprobaciones son voluntarias, sin entregas ni notas.'})
    for c in n['cells']:
        if c['cell_type']=='code':c['outputs']=[];c['execution_count']=None
        if c['cell_type']=='markdown':
            t=''.join(c['source'])
            t=t.replace('Para tu entrega, conserva un gráfico, una métrica de prueba y una comparación con una solución simple.','Para la conversación de clase, revisa un gráfico, una métrica de prueba y una comparación con una solución simple.')
            c['source']=t
    n['metadata'].pop('widgets',None)
    (dest/target).write_text(json.dumps(n,ensure_ascii=False,indent=1),encoding='utf-8')
for original,target in [('01_aprendizaje_red_neuronal.png','red-neuronal.webp'),('02_clasificacion_deteccion_segmentacion.png','tareas-vision.webp'),('03_atencion_transformer_conceptual.png','atencion.webp')]:
    im=Image.open(workspace/'output/infografias'/original).convert('RGB')
    im.thumbnail((1800,1800))
    im.save(root/'docs/assets'/target,'WEBP',quality=88,method=6)
    print(target,(root/'docs/assets'/target).stat().st_size)
print('Ocho notebooks preparados sin outputs; tres apoyos visuales conservados.')

