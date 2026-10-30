import {dbscan} from './math.js';
// The original 29 simulated profiles from the classroom explorer, unchanged.
export const CLUSTER_POINTS=[...[0,1].flatMap(g=>Array.from({length:13},(_,i)=>[g*50+23+Math.cos(i*2.4)*((i%4)+2)*2,g*40+25+Math.sin(i*2.4)*((i%4)+2)*2])),[5,80],[95,10],[55,95]];
export const CLUSTER_GEOMETRY={size:640,left:72,top:24,side:528,min:-10,max:110,scale:4.4};
export const clusterX=x=>72+(x+10)*4.4;
export const clusterY=y=>24+(110-y)*4.4;
export function clusterResult(eps=10,min=4,selected=0){
 const points=CLUSTER_POINTS,labels=dbscan(points,eps,min);
 const distances=points.map(p=>points.map(q=>Math.hypot(p[0]-q[0],p[1]-q[1])));
 const counts=distances.map(ds=>ds.filter(d=>d<=eps).length);
 const groups=[...new Set(labels.filter(l=>l>=0))].map(label=>({label,ids:labels.flatMap((v,i)=>v===label?[i]:[])}));
 const roles=labels.map((l,i)=>counts[i]>=min?'núcleo':l>=0?'borde':'sin grupo');
 const neighbors=distances[selected].flatMap((distance,id)=>distance<=eps?[{id,distance}]:[]).sort((a,b)=>a.distance-b.distance||a.id-b.id);
 return {eps,min,selected,labels,counts,groups,roles,neighbors,distances,noise:labels.filter(l=>l<0).length};
}
export function changedMembership(before,after){
 if(!before)return 0;
 const membership=(r,i)=>r.labels[i]<0?'sin grupo':r.groups.find(g=>g.label===r.labels[i]).ids.join(',');
 return after.labels.reduce((n,_,i)=>n+Number(membership(before,i)!==membership(after,i)),0);
}
export function clusterHull(ids){
 const pts=ids.map(i=>CLUSTER_POINTS[i]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 if(pts.length<3)return pts;
 const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
 const half=arr=>{const out=[];for(const p of arr){while(out.length>=2&&cross(out.at(-2),out.at(-1),p)<=0)out.pop();out.push(p);}return out;};
 return [...half(pts).slice(0,-1),...half([...pts].reverse()).slice(0,-1)];
}
