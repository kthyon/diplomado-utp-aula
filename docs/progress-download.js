let previous;

/** Keep a native download link available when an automatic Blob download is blocked. */
export function offerProgressDownload(progress,{documentRef=document,urlAPI=URL,timer=setTimeout}={}){
 previous?.();
 const blob=new Blob([JSON.stringify(progress,null,2)],{type:'application/json'});
 const href=urlAPI.createObjectURL(blob),anchor=documentRef.createElement('a');
 anchor.id='progress-download-link';anchor.href=href;anchor.download='mi-progreso-utp.json';
 anchor.className='inline-link';anchor.textContent='Guardar mi archivo de progreso ↓';
 const host=documentRef.querySelector('#transfer-status')||documentRef.querySelector('#export-progress')?.parentElement||documentRef.body;
 host.append(anchor);
 const cleanup=()=>{anchor.remove();urlAPI.revokeObjectURL(href);};
 previous=cleanup;
 // Some browsers ignore programmatic downloads. The visible native link remains usable.
 anchor.click();timer(cleanup,60000);
 return anchor;
}
