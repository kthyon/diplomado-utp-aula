// Datos y etiquetas inventados exclusivamente para estas demostraciones.
export const sigmoid = z => 1 / (1 + Math.exp(-z));
export const initialNetwork = () => ({w:[[.6,-.2],[-.4,.8],[.5,.3]],b:[-.1,.2,-.3],v:[.3,-.2,.1],c:-1});
export function forward(net,x){
  const h=net.w.map((w,j)=>sigmoid(w[0]*x[0]+w[1]*x[1]+net.b[j]));
  return {h,p:sigmoid(h.reduce((s,a,j)=>s+a*net.v[j],net.c))};
}
export const loss=(p,y)=>-y*Math.log(Math.max(1e-12,p))-(1-y)*Math.log(Math.max(1e-12,1-p));
export function gradients(net,x,y){
  const {h,p}=forward(net,x),delta=p-y;
  const hidden=h.map((a,j)=>delta*net.v[j]*a*(1-a));
  return {w:hidden.map(d=>x.map(v=>d*v)),b:hidden,v:h.map(a=>delta*a),c:delta};
}
export function learn(net,x,y,rate=.5){
  const g=gradients(net,x,y);
  return {w:net.w.map((w,j)=>w.map((v,k)=>v-rate*g.w[j][k])),b:net.b.map((v,j)=>v-rate*g.b[j]),v:net.v.map((v,j)=>v-rate*g.v[j]),c:net.c-rate*g.c};
}
export const PEOPLE=[
  {id:'A',age:22,income:4000000,buy:0},{id:'B',age:24,income:4500000,buy:0},
  {id:'C',age:26,income:4100000,buy:0},{id:'D',age:42,income:3000000,buy:1},
  {id:'E',age:44,income:5300000,buy:1},{id:'F',age:46,income:2700000,buy:1}
];
export function scalingStats(rows=PEOPLE){
  return ['age','income'].map(key=>{
    const mean=rows.reduce((s,r)=>s+r[key],0)/rows.length;
    return {mean,sd:Math.sqrt(rows.reduce((s,r)=>s+(r[key]-mean)**2,0)/rows.length)||1};
  });
}
export function neighbors(query,k=3,scaled=false,rows=PEOPLE){
  const stats=scalingStats(rows);
  const ranked=rows.map(r=>({...r,distance:Math.hypot((r.age-query.age)/(scaled?stats[0].sd:1),(r.income-query.income)/(scaled?stats[1].sd:1))})).sort((a,b)=>a.distance-b.distance||a.id.localeCompare(b.id));
  const selected=ranked.slice(0,k),yes=selected.reduce((s,r)=>s+r.buy,0);
  return {selected,ranked,yes,prediction:yes>k/2?1:yes<k/2?0:null,stats};
}
export const PIECES=Array.from({length:100},(_,i)=>({id:i+1,defect:i===99,score:i===99?.82:i===98?.90:i===97?.84:.02+(i%20)*.025}));
export function evaluate(threshold,rows=PIECES){
  let tp=0,fp=0,tn=0,fn=0;
  const items=rows.map(r=>{const alert=r.score>=threshold;const kind=r.defect?(alert?'tp':'fn'):(alert?'fp':'tn');if(kind==='tp')tp++;if(kind==='fp')fp++;if(kind==='tn')tn++;if(kind==='fn')fn++;return {...r,alert,kind};});
  return {tp,fp,tn,fn,items,accuracy:(tp+tn)/rows.length,recall:tp+fn?tp/(tp+fn):null,precision:tp+fp?tp/(tp+fp):null};
}
