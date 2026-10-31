"""Execute published cells on CPU, both per topic and from top to bottom.

Uses locally installed packages and optional cached YOLO weights. Never edits a
notebook, activates paid services or silently replaces a cell with a test stub.
"""
from __future__ import annotations
import argparse
import ast
import contextlib
import hashlib
import io
import json
import math
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import time
import traceback
import warnings

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
parser.add_argument('--weights', required=True)
parser.add_argument('--package-dir', action='append', default=[])
parser.add_argument('--select', action='append', default=[])
args = parser.parse_args()
WEIGHTS = Path(args.weights).resolve()
for directory in reversed(args.package_dir):
    sys.path.insert(0, str(Path(directory).resolve()))
ROOT = Path(__file__).resolve().parents[1]
OUT = Path(args.output).resolve()
OUT.mkdir(parents=True, exist_ok=True)
os.environ.update(MPLBACKEND='Agg', MPLCONFIGDIR=str(OUT/'mpl'),
                  YOLO_CONFIG_DIR=str(OUT/'yolo-settings'), YOLO_OFFLINE='true',
                  YOLO_AUTOINSTALL='false', CUDA_VISIBLE_DEVICES='', OMP_NUM_THREADS='1')
Path(os.environ['MPLCONFIGDIR']).mkdir(exist_ok=True)
Path(os.environ['YOLO_CONFIG_DIR']).mkdir(exist_ok=True)
attempts = []
def deny_network(sock, address):
    attempts.append(str(address))
    raise PermissionError('Offline verification: '+str(address))
socket.socket.connect = deny_network
socket.socket.connect_ex = deny_network
import numpy as np
import pandas as pd
import matplotlib
import matplotlib.pyplot as plt
import torch
import sklearn
import IPython.display
import ultralytics
torch.set_num_threads(1)
ultralytics.settings.update({'sync': False})
def deny_install(*a, **kw):
    raise PermissionError('Installation is disabled during execution verification')
subprocess.check_call = deny_install
subprocess.check_output = deny_install

def plain(value):
    if isinstance(value, pd.DataFrame): return plain(value.to_dict(orient='records'))
    if isinstance(value, pd.Series): return plain(value.to_dict())
    if isinstance(value, torch.Tensor): return plain(value.detach().cpu().numpy())
    if isinstance(value, np.ndarray): return plain(value.tolist())
    if isinstance(value, (np.integer,np.floating,np.bool_)): return plain(value.item())
    if isinstance(value, dict): return {str(k):plain(v) for k,v in value.items()}
    if isinstance(value, (list,tuple)): return [plain(v) for v in value]
    if isinstance(value,float) and not math.isfinite(value): return None
    if value is None or isinstance(value,(str,int,float,bool)): return value
    return repr(value)

def validate(topic, n):
    if topic == 'ml-problema':
        assert len(n['X']) == len(n['y']) == 240
        assert n['X'].shape[1] == 3
        return {'simulated_rows':240,'inputs':n['X'].columns.tolist()}
    if topic == 'ml-preparacion':
        assert len(n['X_tr']) == 180 and len(n['X_te']) == 60
        assert np.isclose(n['mediana_aprendida'],n['X_tr'].lluvia_mm.median())
        assert not n['preparacion_prueba'].isna().any().any()
        return {'train':180,'test':60,'training_median_mm':n['mediana_aprendida']}
    if topic in ('ml-regresion','ml-integracion'):
        assert len(n['comparacion']) == 60
        assert n['resultados'].MAE_t_ha.ge(0).all()
        assert n['resultados'].MAE_t_ha.iloc[1] < n['resultados'].MAE_t_ha.iloc[0]
        return {'comparison':n['resultados'],'first_cases':n['comparacion'].head()}
    if topic == 'ml-clasificacion':
        estimators=[v for v in n.values() if isinstance(v,sklearn.linear_model.LogisticRegression)]
        assert estimators and all(hasattr(v,'classes_') for v in estimators)
        return {'fitted_logistic_models':len(estimators)}
    if topic == 'ml-metricas':
        assert np.array_equal(n['cm'],[[4,2],[1,3]])
        return {'confusion_matrix':n['cm']}
    if topic == 'ml-umbral':
        d=n['comparacion_umbrales'];assert d.Alertas.tolist() == [7,5,4]
        assert d['Falsas alertas'].tolist() == [3,2,1]
        assert d.Omisiones.tolist() == [0,1,1]
        return {'thresholds':d,'selected':n['UMBRAL']}
    if topic == 'ml-clustering':
        assert len(n['etiquetas']) == 123
        assert len(set(n['etiquetas'])-{-1}) >= 2
        return {'points':123,'groups':pd.Series(n['etiquetas']).value_counts()}
    if topic == 'ml-pca':
        assert np.isclose(n['productos'].sum(),n['X_pca'][0,0])
        assert np.isclose(n['pca'].explained_variance_ratio_.sum(),1)
        return {'rows':len(n['df']),'variance':n['pca'].explained_variance_ratio_,'manual_pc1':n['productos'].sum()}
    if topic == 'ml-ensambles':
        assert len(n['X_te']) == 60 and len(n['tabla']) == 4
        return {'same_test_rows':60,'comparison':n['tabla']}
    if topic == 'ml-series':
        assert len(n['pasado']) == 60 and len(n['futuro']) == 24
        assert all(len(p)==24 for p in n['pronosticos'].values())
        return {'past':60,'future':24,'mae':{k:n['mean_absolute_error'](n['futuro'],p) for k,p in n['pronosticos'].items()}}
    if topic == 'ml-refuerzo':
        assert n['grid'][n['trajectory'][-1]] == 'G'
        assert np.isfinite(n['Q']).all() and len(n['returns']) == 2000
        return {'episodes':2000,'trajectory':n['trajectory'],'return':n['total']}
    if topic in ('dl-redes','dl-activaciones'):
        assert np.isclose(n['z'].item(),.5) and np.isclose(n['p'].item(),1/(1+np.exp(-.5)))
        if topic == 'dl-activaciones':
            assert np.allclose(n['comparacion_activaciones'].Salida,[-2,1/(1+np.exp(2)),np.tanh(-2),0])
        return {'z':n['z'].item(),'sigmoid':n['p'].item(),'same_signal_comparison':n.get('comparacion_activaciones')}
    if topic == 'dl-entrenamiento':
        assert len(n['historial']) == 40 and n['historial'][-1] < n['historial'][0]
        assert len(n['probs']) == len(n['yte']) == 80
        return {'epochs':40,'loss_start':n['historial'][0],'loss_end':n['historial'][-1],'reserved_accuracy':n['accuracy_score'](n['yte'],n['probs']>=.5)}
    if topic == 'dl-vision':
        assert n['mascara'].ndim == 2 and n['mascara'].sum()>0
        return {'illustrative_mask_shape':n['mascara'].shape}
    if topic == 'dl-cnn':
        assert len(n['pred']) == len(n['yte']) == 450
        return {'reserved_images':450,'accuracy':n['accuracy_score'](n['yte'],n['pred'])}
    if topic in ('dl-transferencia','dl-yolo'):
        assert len(n['tabla']) == len(n['resultado'].boxes)
        if topic == 'dl-yolo':
            assert all((n['SALIDA']/file).is_file() for file in ['detecciones.csv','conteo.csv','configuracion.json'])
        return {'proposals':len(n['tabla']),'categories':n['tabla'].categoria.tolist()}
    if topic == 'dl-secuencias':
        assert int(np.sum(n['test'])) == 60 and n['VENTANA'] == 12
        return {'window':12,'reserved_steps':60,'mae':n['mean_absolute_error'](n['objetivos'][n['test']],n['p'])}
    if topic == 'dl-atencion':
        assert np.allclose(n['atencion'].sum(axis=1),1)
        assert np.isclose(n['mezclas'][2,0],15)
        return {'weights':n['atencion'],'mixtures':n['mezclas']}
    if topic == 'dl-transformers':
        assert not n['compartidas'] and len(n['Xte']) == len(n['pred'])
        return {'shared_patterns':0,'test_patterns':len(n['Xte']),'accuracy':n['accuracy_score'](n['yte'],n['pred'])}
    if topic == 'dl-evaluacion':
        assert np.allclose([r[0] for r in n['filas']],[.6,1/7,.6])
        assert [r[1:] for r in n['filas']] == [[1,0,0],[0,1,1],[0,0,1]]
        return {'iou_and_counts':n['filas']}
    if topic == 'dl-integracion':
        assert n['resultado']['Costo ilustrativo'].tolist() == [6,12,11,25]
        return {'costs':n['resultado'],'review_all':10}
    raise ValueError('Missing numerical check: '+topic)

def run(file, nb, name, ids, topics, figures=False):
    work=(OUT/'runs'/name).resolve()
    assert work.is_relative_to(OUT)
    work.mkdir(parents=True,exist_ok=True)
    os.chdir(work)
    shutil.copy2(WEIGHTS,work/'yolo26n.pt')
    tables=[];plots=[]
    def display(*objects,**kwargs):
        for obj in objects:
            if isinstance(obj,(pd.DataFrame,pd.Series)):tables.append(plain(obj))
    def show(*a,**kw):
        for number in plt.get_fignums():
            fig=plt.figure(number)
            info={'axes':[{'title':ax.get_title(),'x':ax.get_xlabel(),'y':ax.get_ylabel()} for ax in fig.axes]}
            if figures:
                target=work/('figure-'+str(len(plots)+1)+'.png')
                fig.savefig(target,dpi=100,bbox_inches='tight');info['path']=str(target)
            plots.append(info)
        plt.close('all')
    IPython.display.display=display;plt.show=show
    ns={'__name__':'__main__','display':display}
    by_id={c['id']:c for c in nb['cells']}
    record={'name':name,'notebook':file,'fresh_namespace':True,'cells':[],'checks':{},'status':'ok'}
    started=time.monotonic()
    for identifier in ids:
        c=by_id[identifier];s=c['source'];s=''.join(s) if isinstance(s,list) else s
        ast.parse(s)
        output=io.StringIO();error=None
        with contextlib.redirect_stdout(output),contextlib.redirect_stderr(output),warnings.catch_warnings(record=True) as caught:
            warnings.simplefilter('always')
            try:exec(compile(s,file+':'+identifier,'exec'),ns)
            except Exception:error=traceback.format_exc()
        record['cells'].append({'id':identifier,'status':'failed' if error else 'ok','error':error,'stdout':output.getvalue()[-22000:],'warnings':list(dict.fromkeys(str(w.message) for w in caught))})
        if error:record['status']='failed';break
        for topic in topics:
            if nb['metadata']['utp']['routes'][topic][-1] == identifier:
                try:record['checks'][topic]=plain(validate(topic,ns))
                except Exception:record['status']='failed';record['error']=traceback.format_exc();break
        if record['status']=='failed':break
    record.update(seconds=round(time.monotonic()-started,3),tables=tables,plots=plots)
    plt.close('all')
    return record

report={'versions':{'python':sys.version.split()[0],'numpy':np.__version__,'pandas':pd.__version__,'sklearn':sklearn.__version__,'matplotlib':matplotlib.__version__,'torch':torch.__version__,'ultralytics':ultralytics.__version__},'cpu_only':True,'network_allowed':False,'runs':[]}
for file in sorted((ROOT/'docs/notebooks').glob('*.ipynb')):
    nb=json.loads(file.read_text(encoding='utf-8'))
    topics=nb.get('metadata',{}).get('utp',{}).get('topics',[])
    jobs=[(file.stem,[c['id'] for c in nb['cells'] if c['cell_type']=='code'],topics,bool(topics))]
    jobs += [(topic,nb['metadata']['utp']['routes'][topic],[topic],False) for topic in topics]
    for name,ids,checks,figures in jobs:
        if args.select and name not in args.select:continue
        record=run(file.name,nb,name,ids,checks,figures)
        report['runs'].append(record)
        report['passed']=sum(r['status']=='ok' for r in report['runs'])
        report['failed']=sum(r['status']!='ok' for r in report['runs'])
        report['network_attempts']=attempts
        (OUT/'execution-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf-8')
        print(name,record['status'],record['seconds'],flush=True)
        if record['status']!='ok':print(record.get('error') or record['cells'][-1].get('error'),flush=True)
print('RESULT',report['passed'],'passed;',report['failed'],'failed',flush=True)
raise SystemExit(bool(report['failed']))
