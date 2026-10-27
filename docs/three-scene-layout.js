// Camera-space arithmetic: independent of Three.js and usable when WebGL is unavailable.
export function fitOrthographicBounds(points,width,height,{paddingX=16,paddingY=28,minSpan=1}={}){
 if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return null;
 const valid=points.filter(point=>Number.isFinite(point.x)&&Number.isFinite(point.y));
 if(!valid.length)return null;
 const xs=valid.map(point=>point.x),ys=valid.map(point=>point.y);
 const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const usableWidth=Math.max(width*.2,width-2*Math.max(0,paddingX));
 const usableHeight=Math.max(height*.2,height-2*Math.max(0,paddingY));
 const unitsPerPixel=Math.max((maxX-minX)/usableWidth,(maxY-minY)/usableHeight,minSpan/Math.min(usableWidth,usableHeight));
 const halfWidth=unitsPerPixel*width/2,halfHeight=unitsPerPixel*height/2;
 const centerX=(minX+maxX)/2,centerY=(minY+maxY)/2;
 return {left:centerX-halfWidth,right:centerX+halfWidth,top:centerY+halfHeight,bottom:centerY-halfHeight};
}

export function placeOverlayLabel(point,width,height,labelWidth,labelHeight,{margin=4}={}){
 if(![point.x,point.y,point.z,width,height,labelWidth,labelHeight].every(Number.isFinite)||width<=0||height<=0||point.z < -1||point.z > 1)return {hidden:true};
 const halfWidth=Math.min(Math.max(0,labelWidth),Math.max(0,width-2*margin))/2;
 const topSpace=Math.min(Math.max(0,labelHeight),Math.max(0,height-2*margin));
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 return {hidden:false,x:clamp((point.x+1)*width/2,margin+halfWidth,width-margin-halfWidth),y:clamp((1-point.y)*height/2,margin+topSpace,height-margin)};
}
