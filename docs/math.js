export const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
export const mae=(a,b)=>mean(a.map((v,i)=>Math.abs(v-b[i])));
export const median=a=>{const s=[...a].sort((x,y)=>x-y);return s.length%2?s[(s.length-1)/2]:(s[s.length/2-1]+s[s.length/2])/2};
export function ols(x,y){const mx=mean(x),my=mean(y);const d=x.reduce((s,v)=>s+(v-mx)**2,0);const slope=d?x.reduce((s,v,i)=>s+(v-mx)*(y[i]-my),0)/d:0;return {slope,intercept:my-slope*mx}}
export const sigmoid=x=>1/(1+Math.exp(-x));
export const activation=(x,type)=>type==='relu'?Math.max(0,x):type==='tanh'?Math.tanh(x):sigmoid(x);
export function confusion(real,prob,t){let tp=0,fp=0,tn=0,fn=0;real.forEach((v,i)=>{const p=prob[i]>=t;v?(p?tp++:fn++):(p?fp++:tn++)});return {tp,fp,tn,fn,precision:tp+fp?tp/(tp+fp):null,recall:tp+fn?tp/(tp+fn):null,accuracy:(tp+tn)/real.length}}
export function dbscan(points,eps,minPts){const labels=points.map(()=>null);const near=i=>points.flatMap((p,j)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1])<=eps?[j]:[]);let cluster=0;for(let i=0;i<points.length;i++){if(labels[i]!==null)continue;let ns=near(i);if(ns.length<minPts){labels[i]=-1;continue}labels[i]=cluster;const queue=[...ns],seen=new Set(queue);for(let k=0;k<queue.length;k++){let j=queue[k];if(labels[j]===-1)labels[j]=cluster;if(labels[j]!==null)continue;labels[j]=cluster;let nn=near(j);if(nn.length>=minPts)for(const v of nn)if(!seen.has(v)){queue.push(v);seen.add(v)}}cluster++}return labels}
export function projectionVariance(points,degrees){const x=points.map(p=>p[0]),y=points.map(p=>p[1]),mx=mean(x),my=mean(y),t=degrees*Math.PI/180;const centered=points.map(p=>[p[0]-mx,p[1]-my]);const total=centered.reduce((s,p)=>s+p[0]**2+p[1]**2,0);const projected=centered.map(p=>p[0]*Math.cos(t)+p[1]*Math.sin(t));return {ratio:projected.reduce((s,v)=>s+v*v,0)/total,projected,centered}}
export function gradientStep(theta,rate){return theta-rate*2*(theta-3)}
export function canAccess(id,releases,lessons,completed){const course=id.split('-')[0],ids=lessons.filter(l=>l.id.startsWith(course+'-')).map(l=>l.id),index=ids.indexOf(id);return index>=0&&releases.released[course]?.includes(id)&&ids.slice(0,index).every(x=>completed.includes(x))}

