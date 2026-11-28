var gd=Object.defineProperty;var vd=(i,t,e)=>t in i?gd(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var lt=(i,t,e)=>vd(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Qr=["Kx","Ky","Kz","Krx","Kry","Krz"];function Br(i){return!!i.k&&i.k.some(t=>t>0)}const Gh=["P","V2","V3","T","M2","M3"],_d=[!1,!1,!1,!1,!0,!0],xd=[!1,!1,!1,!0,!0,!0],yd=_d;function hl(i,t){if(!i||!t)return null;const e=Gh.slice(0,4).filter((n,s)=>i[s]&&t[s]);return e.length?`${e.join(", ")} cannot be released at both ends – the member would be unstable (a mechanism).`:null}function zr(i){if(!i||!i.some(Boolean))return"None";const t=[];return i[0]&&t.push("P"),i[1]&&t.push("V2"),i[2]&&t.push("V3"),i[3]&&t.push("T"),i[4]&&t.push("M2"),i[5]&&t.push("M3"),t.join(" ")}const Sd=new Set(["P","U1","AXIAL","V2","U2","V3","U3","T","R1","TORSION","M2","R2","M3","R3"]);function Md(i){if(!i)return;const t=i.trim().toUpperCase();if(!t||t==="NONE"||t==="NO"||t==="FIXED"||t==="RIGID")return;if(t==="PIN"||t==="PINNED"||t==="HINGE")return[!1,!1,!1,!1,!0,!0];const e=new Set(t.split(/[\s,;|+]+/).map(r=>r.trim().toUpperCase()).filter(Boolean)),n=[...e].filter(r=>!Sd.has(r));if(n.length)throw new Error(`unknown release '${n.join(" ")}'. Use None, Pin, or any of P V2 V3 T M2 M3.`);const s=[e.has("P")||e.has("U1")||e.has("AXIAL"),e.has("V2")||e.has("U2"),e.has("V3")||e.has("U3"),e.has("T")||e.has("R1")||e.has("TORSION"),e.has("M2")||e.has("R2"),e.has("M3")||e.has("R3")];return s.some(Boolean)?s:void 0}const Hh=["GRAV","GX","GY","GZ","L1","L2","L3"],sa={GRAV:"Gravity (−Z)",GX:"Global X",GY:"Global Y",GZ:"Global Z",L1:"Local 1",L2:"Local 2",L3:"Local 3"},Wh=["Dead","Live","Other"],ul=[!1,!1,!1,!1,!1,!1],$h=[!0,!0,!0,!0,!0,!0],bd=[!0,!0,!0,!1,!1,!1],Ed=[!1,!1,!0,!1,!1,!1],sn=["UX","UY","UZ","RX","RY","RZ"];function dl(){return{settings:{gridSpacing:1,gridLines:10,workPlane:"XY",elevation:0,selfWeight:!0},materials:[{name:"STEEL",E:2e8,nu:.3,gamma:76.98},{name:"C30",E:25743e3,nu:.2,gamma:23.56}],sections:[{name:"R300x500",shape:"rect",dims:[.5,.3]},{name:"IWF300",shape:"I",dims:[.3,.15,.009,.0065]},{name:"PIPE168",shape:"pipe",dims:[.1683,.0071]}],supportTypes:[{name:"Fixed",r:[...$h]},{name:"Pinned",r:[...bd]},{name:"Roller Z",r:[...Ed]},{name:"Free",r:[...ul]}],joints:[],frames:[],areas:[],loadCases:jh(),loadCombos:Xh(),jointLoads:[],jointDisplacements:[],framePointLoads:[],frameUniformLoads:[],areaLoads:[]}}const kr="DEAD",Vr="LIVE";function jh(){return[{name:kr,type:"Dead"},{name:Vr,type:"Live"}]}function Xh(){return[{name:"COMBO1",factors:[{case:kr,factor:1.2},{case:Vr,factor:1.6}]}]}function Gr(i){(!Array.isArray(i.loadCases)||i.loadCases.length===0)&&(i.loadCases=jh()),Array.isArray(i.loadCombos)||(i.loadCombos=Xh()),Array.isArray(i.jointDisplacements)||(i.jointDisplacements=[]);const t=new Set(i.loadCases.map(n=>n.name)),e=i.loadCases[0].name;for(const n of[i.jointLoads,i.jointDisplacements,i.framePointLoads,i.frameUniformLoads,i.areaLoads])for(const s of n??[])(!s.case||!t.has(s.case))&&(s.case=e);for(const n of i.loadCombos)n.factors=(n.factors??[]).filter(s=>t.has(s.case)&&Number.isFinite(s.factor));return i}const bn=1e-6;class $l{constructor(t){lt(this,"data");lt(this,"undoStack",[]);lt(this,"redoStack",[]);lt(this,"listeners",new Set);lt(this,"batchDepth",0);lt(this,"maxUndo",100);this.data=Gr(t??dl())}onChange(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(t){for(const e of this.listeners)e(t)}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}commit(t,e){if(this.batchDepth>0)return e(this.data);const n=JSON.stringify(this.data);this.batchDepth++;let s;try{s=e(this.data)}catch(r){throw this.data=JSON.parse(n),r}finally{this.batchDepth--}return JSON.stringify(this.data)!==n&&(this.undoStack.push(n),this.undoStack.length>this.maxUndo&&this.undoStack.shift(),this.redoStack=[],this.emit(t)),s}undo(){const t=this.undoStack.pop();t&&(this.redoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("undo"))}redo(){const t=this.redoStack.pop();t&&(this.undoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("redo"))}load(t){this.data=Gr(t),this.undoStack=[],this.redoStack=[],this.emit("load")}joint(t){return this.data.joints.find(e=>e.id===t)}frame(t){return this.data.frames.find(e=>e.id===t)}area(t){return this.data.areas.find(e=>e.id===t)}jointMap(){return new Map(this.data.joints.map(t=>[t.id,t]))}frameLength(t){const e=this.joint(t.i),n=this.joint(t.j);return!e||!n?0:Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z)}nextId(t){let e=0;for(const n of t)n.id>e&&(e=n.id);return e+1}findJointAt(t,e,n){return this.data.joints.find(s=>Math.abs(s.x-t)<bn&&Math.abs(s.y-e)<bn&&Math.abs(s.z-n)<bn)}addJoint(t,e,n){const s=o=>Math.round(o*1e9)/1e9;t=s(t),e=s(e),n=s(n);const r=this.findJointAt(t,e,n);return r?r.id:this.commit("add joint",o=>{const a=this.nextId(o.joints);return o.joints.push({id:a,x:t,y:e,z:n,r:[...ul]}),a})}addFrame(t,e){if(t===e||!this.joint(t)||!this.joint(e))return null;const n=this.data.frames.find(s=>s.i===t&&s.j===e||s.i===e&&s.j===t);return n?n.id:this.commit("add frame",s=>{var o,a;const r=this.nextId(s.frames);return s.frames.push({id:r,i:t,j:e,material:((o=s.materials[0])==null?void 0:o.name)??"",section:((a=s.sections[0])==null?void 0:a.name)??"",beta:0}),r})}addArea(t){const e=t.filter((n,s)=>t.indexOf(n)===s);return e.length<3?null:this.commit("add area",n=>{const s=this.nextId(n.areas);return n.areas.push({id:s,joints:e,distribution:"two-way"}),s})}deleteObjects(t,e,n){const s=new Set(t),r=new Set(e),o=new Set(n);this.commit("delete",a=>{for(const l of a.frames)(s.has(l.i)||s.has(l.j))&&r.add(l.id);for(const l of a.areas)l.joints.some(c=>s.has(c))&&o.add(l.id);a.joints=a.joints.filter(l=>!s.has(l.id)),a.frames=a.frames.filter(l=>!r.has(l.id)),a.areas=a.areas.filter(l=>!o.has(l.id)),a.jointLoads=a.jointLoads.filter(l=>!s.has(l.joint)),a.jointDisplacements=a.jointDisplacements.filter(l=>!s.has(l.joint)),a.framePointLoads=a.framePointLoads.filter(l=>!r.has(l.frame)),a.frameUniformLoads=a.frameUniformLoads.filter(l=>!r.has(l.frame)),a.areaLoads=a.areaLoads.filter(l=>!o.has(l.area))})}jointsOf(t,e,n){var r;const s=new Set(t);for(const o of e){const a=this.frame(o);a&&(s.add(a.i),s.add(a.j))}for(const o of n)(r=this.area(o))==null||r.joints.forEach(a=>s.add(a));return s}moveJoints(t,e,n,s){const r=this.data.joints.filter(o=>t.has(o.id));for(const o of r){const a=this.findJointAt(o.x+e,o.y+n,o.z+s);if(a&&!t.has(a.id))return`Joint ${o.id} would overlap joint ${a.id}`}return this.commit("move",()=>{for(const o of r)o.x+=e,o.y+=n,o.z+=s}),null}replicate(t,e,n,s,r,o,a){const l={joints:[],frames:[],areas:[]};return this.commit("replicate",c=>{const h=this.jointsOf(t,e,n);for(let d=1;d<=a;d++){const u=new Map;for(const f of h){const p=this.joint(f),g=this.addJoint(p.x+s*d,p.y+r*d,p.z+o*d),m=this.joint(g);m.r=[...p.r],p.k&&(m.k=[...p.k]),u.set(f,g),l.joints.push(g)}for(const f of e){const p=this.frame(f),g=this.addFrame(u.get(p.i),u.get(p.j));if(g!=null){const m=this.frame(g);m.material=p.material,m.section=p.section,m.beta=p.beta,p.relI&&(m.relI=[...p.relI]),p.relJ&&(m.relJ=[...p.relJ]),l.frames.push(g);for(const v of c.framePointLoads.filter(M=>M.frame===f))c.framePointLoads.push({...v,frame:g});for(const v of c.frameUniformLoads.filter(M=>M.frame===f))c.frameUniformLoads.push({...v,frame:g})}}for(const f of n){const p=this.area(f),g=this.addArea(p.joints.map(m=>u.get(m)));if(g!=null){this.area(g).distribution=p.distribution,l.areas.push(g);for(const m of c.areaLoads.filter(v=>v.area===f))c.areaLoads.push({...m,area:g})}}for(const f of t){for(const p of c.jointLoads.filter(g=>g.joint===f))c.jointLoads.push({...p,joint:u.get(f),f:[...p.f]});for(const p of c.jointDisplacements.filter(g=>g.joint===f))c.jointDisplacements.push({...p,joint:u.get(f),d:[...p.d]})}}}),l}divideFrame(t,e){e<2||this.splitFrameAt(t,Array.from({length:e-1},(n,s)=>(s+1)/e))}splitFrameAt(t,e){const n=this.frame(t);if(!n)return null;const s=this.joint(n.i),r=this.joint(n.j);if(!s||!r)return null;const o=[...new Set(e.filter(a=>a>0&&a<1))].sort((a,l)=>a-l);return o.length?this.commit("split frame",a=>{const l=[n.i],c=[0];for(const p of o){const g=this.addJoint(s.x+(r.x-s.x)*p,s.y+(r.y-s.y)*p,s.z+(r.z-s.z)*p);g===l[l.length-1]||g===n.j||(l.push(g),c.push(p))}if(l.length===1)return null;l.push(n.j),c.push(1);const h=a.frameUniformLoads.filter(p=>p.frame===t),d=a.framePointLoads.filter(p=>p.frame===t);a.frames=a.frames.filter(p=>p.id!==t),a.frameUniformLoads=a.frameUniformLoads.filter(p=>p.frame!==t),a.framePointLoads=a.framePointLoads.filter(p=>p.frame!==t);const u=l.length-1,f=[];for(let p=0;p<u;p++){const g=this.addFrame(l[p],l[p+1]),m=this.frame(g);m.material=n.material,m.section=n.section,m.beta=n.beta,p===0&&n.relI&&(m.relI=[...n.relI]),p===u-1&&n.relJ&&(m.relJ=[...n.relJ]),f.push(g);for(const v of h)a.frameUniformLoads.push({...v,frame:g})}for(const p of d){let g=0;for(;g<u-1&&p.rd>c[g+1];)g++;const m=(p.rd-c[g])/(c[g+1]-c[g]);a.framePointLoads.push({...p,frame:f[g],rd:Math.min(1,Math.max(0,m))})}return{joints:l.slice(1,-1),frames:f}}):null}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fl="170",wd=0,jl=1,Ad=2,qh=1,Td=2,Fn=3,ai=0,Xe=1,dn=2,ri=0,Ki=1,Xl=2,ql=3,Yl=4,Cd=5,_i=100,Rd=101,Ld=102,Pd=103,Dd=104,Id=200,Ud=201,Nd=202,Fd=203,ra=204,oa=205,Od=206,Bd=207,zd=208,kd=209,Vd=210,Gd=211,Hd=212,Wd=213,$d=214,aa=0,la=1,ca=2,ns=3,ha=4,ua=5,da=6,fa=7,Yh=0,jd=1,Xd=2,oi=0,qd=1,Yd=2,Jd=3,Zd=4,Kd=5,Qd=6,tf=7,Jh=300,is=301,ss=302,pa=303,ma=304,to=306,ga=1e3,yi=1001,va=1002,gn=1003,ef=1004,qs=1005,wn=1006,ho=1007,Si=1008,Gn=1009,Zh=1010,Kh=1011,Ns=1012,pl=1013,bi=1014,zn=1015,Vs=1016,ml=1017,gl=1018,rs=1020,Qh=35902,tu=1021,eu=1022,mn=1023,nu=1024,iu=1025,Qi=1026,os=1027,su=1028,vl=1029,ru=1030,_l=1031,xl=1033,Pr=33776,Dr=33777,Ir=33778,Ur=33779,_a=35840,xa=35841,ya=35842,Sa=35843,Ma=36196,ba=37492,Ea=37496,wa=37808,Aa=37809,Ta=37810,Ca=37811,Ra=37812,La=37813,Pa=37814,Da=37815,Ia=37816,Ua=37817,Na=37818,Fa=37819,Oa=37820,Ba=37821,Nr=36492,za=36494,ka=36495,ou=36283,Va=36284,Ga=36285,Ha=36286,nf=3200,sf=3201,au=0,rf=1,ti="",Ze="srgb",cs="srgb-linear",eo="linear",le="srgb",Di=7680,Jl=519,of=512,af=513,lf=514,lu=515,cf=516,hf=517,uf=518,df=519,Wa=35044,Zl="300 es",kn=2e3,Hr=2001;class hs{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Kl=1234567;const ws=Math.PI/180,Fs=180/Math.PI;function An(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]).toLowerCase()}function Ce(i,t,e){return Math.max(t,Math.min(e,i))}function yl(i,t){return(i%t+t)%t}function ff(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function pf(i,t,e){return i!==t?(e-i)/(t-i):0}function As(i,t,e){return(1-e)*i+e*t}function mf(i,t,e,n){return As(i,t,1-Math.exp(-e*n))}function gf(i,t=1){return t-Math.abs(yl(i,t*2)-t)}function vf(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function _f(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function xf(i,t){return i+Math.floor(Math.random()*(t-i+1))}function yf(i,t){return i+Math.random()*(t-i)}function Sf(i){return i*(.5-Math.random())}function Mf(i){i!==void 0&&(Kl=i);let t=Kl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function bf(i){return i*ws}function Ef(i){return i*Fs}function wf(i){return(i&i-1)===0&&i!==0}function Af(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Tf(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Cf(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*p,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*p,a*c);break;case"ZYZ":i.set(l*p,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function fn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function oe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const gi={DEG2RAD:ws,RAD2DEG:Fs,generateUUID:An,clamp:Ce,euclideanModulo:yl,mapLinear:ff,inverseLerp:pf,lerp:As,damp:mf,pingpong:gf,smoothstep:vf,smootherstep:_f,randInt:xf,randFloat:yf,randFloatSpread:Sf,seededRandom:Mf,degToRad:bf,radToDeg:Ef,isPowerOfTwo:wf,ceilPowerOfTwo:Af,floorPowerOfTwo:Tf,setQuaternionFromProperEuler:Cf,normalize:oe,denormalize:fn};class vt{constructor(t=0,e=0){vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $t{constructor(t,e,n,s,r,o,a,l,c){$t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],g=s[0],m=s[3],v=s[6],M=s[1],_=s[4],S=s[7],P=s[2],A=s[5],T=s[8];return r[0]=o*g+a*M+l*P,r[3]=o*m+a*_+l*A,r[6]=o*v+a*S+l*T,r[1]=c*g+h*M+d*P,r[4]=c*m+h*_+d*A,r[7]=c*v+h*S+d*T,r[2]=u*g+f*M+p*P,r[5]=u*m+f*_+p*A,r[8]=u*v+f*S+p*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,p=e*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/p;return t[0]=d*g,t[1]=(s*c-h*n)*g,t[2]=(a*n-s*o)*g,t[3]=u*g,t[4]=(h*e-s*l)*g,t[5]=(s*r-a*e)*g,t[6]=f*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(uo.makeScale(t,e)),this}rotate(t){return this.premultiply(uo.makeRotation(-t)),this}translate(t,e){return this.premultiply(uo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const uo=new $t;function cu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Wr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Rf(){const i=Wr("canvas");return i.style.display="block",i}const Ql={};function Ms(i){i in Ql||(Ql[i]=!0,console.warn(i))}function Lf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Pf(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Df(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Qt={enabled:!0,workingColorSpace:cs,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===le&&(i.r=Vn(i.r),i.g=Vn(i.g),i.b=Vn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===le&&(i.r=ts(i.r),i.g=ts(i.g),i.b=ts(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===ti?eo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Vn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ts(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const tc=[.64,.33,.3,.6,.15,.06],ec=[.2126,.7152,.0722],nc=[.3127,.329],ic=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),sc=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Qt.define({[cs]:{primaries:tc,whitePoint:nc,transfer:eo,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:ec,workingColorSpaceConfig:{unpackColorSpace:Ze},outputColorSpaceConfig:{drawingBufferColorSpace:Ze}},[Ze]:{primaries:tc,whitePoint:nc,transfer:le,toXYZ:ic,fromXYZ:sc,luminanceCoefficients:ec,outputColorSpaceConfig:{drawingBufferColorSpace:Ze}}});let Ii;class If{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ii===void 0&&(Ii=Wr("canvas")),Ii.width=t.width,Ii.height=t.height;const n=Ii.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ii}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Wr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Vn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Vn(e[n]/255)*255):e[n]=Vn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Uf=0;class hu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=An(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(fo(s[o].image)):r.push(fo(s[o]))}else r=fo(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function fo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?If.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Nf=0;class Ge extends hs{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,n=yi,s=yi,r=wn,o=Si,a=mn,l=Gn,c=Ge.DEFAULT_ANISOTROPY,h=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=An(),this.name="",this.source=new hu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new vt(0,0),this.repeat=new vt(1,1),this.center=new vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Jh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ga:t.x=t.x-Math.floor(t.x);break;case yi:t.x=t.x<0?0:1;break;case va:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ga:t.y=t.y-Math.floor(t.y);break;case yi:t.y=t.y<0?0:1;break;case va:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Jh;Ge.DEFAULT_ANISOTROPY=1;class ce{constructor(t=0,e=0,n=0,s=1){ce.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],g=l[2],m=l[6],v=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+v-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(c+1)/2,S=(f+1)/2,P=(v+1)/2,A=(h+u)/4,T=(d+g)/4,L=(p+m)/4;return _>S&&_>P?_<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(_),s=A/n,r=T/n):S>P?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=A/s,r=L/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=T/r,s=L/r),this.set(n,s,r,e),this}let M=Math.sqrt((m-p)*(m-p)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-p)/M,this.y=(d-g)/M,this.z=(u-h)/M,this.w=Math.acos((c+f+v-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ff extends hs{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ce(0,0,t,e),this.scissorTest=!1,this.viewport=new ce(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ge(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new hu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ei extends Ff{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class uu extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Of extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Gs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=r[o+0],f=r[o+1],p=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=f,t[e+2]=p,t[e+3]=g;return}if(d!==g||l!==u||c!==f||h!==p){let m=1-a;const v=l*u+c*f+h*p+d*g,M=v>=0?1:-1,_=1-v*v;if(_>Number.EPSILON){const P=Math.sqrt(_),A=Math.atan2(P,v*M);m=Math.sin(m*A)/P,a=Math.sin(a*A)/P}const S=a*M;if(l=l*m+u*S,c=c*m+f*S,h=h*m+p*S,d=d*m+g*S,m===1-a){const P=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=P,c*=P,h*=P,d*=P}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-a*f,t[e+2]=c*p+h*f+a*u-l*d,t[e+3]=h*p-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ce(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(t=0,e=0,n=0){I.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(rc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(rc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return po.copy(this).projectOnVector(t),this.sub(po)}reflect(t){return this.sub(po.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const po=new I,rc=new Gs;class Wn{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,an):an.fromBufferAttribute(r,o),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ys.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ys.copy(n.boundingBox)),Ys.applyMatrix4(t.matrixWorld),this.union(Ys)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(gs),Js.subVectors(this.max,gs),Ui.subVectors(t.a,gs),Ni.subVectors(t.b,gs),Fi.subVectors(t.c,gs),Xn.subVectors(Ni,Ui),qn.subVectors(Fi,Ni),ci.subVectors(Ui,Fi);let e=[0,-Xn.z,Xn.y,0,-qn.z,qn.y,0,-ci.z,ci.y,Xn.z,0,-Xn.x,qn.z,0,-qn.x,ci.z,0,-ci.x,-Xn.y,Xn.x,0,-qn.y,qn.x,0,-ci.y,ci.x,0];return!mo(e,Ui,Ni,Fi,Js)||(e=[1,0,0,0,1,0,0,0,1],!mo(e,Ui,Ni,Fi,Js))?!1:(Zs.crossVectors(Xn,qn),e=[Zs.x,Zs.y,Zs.z],mo(e,Ui,Ni,Fi,Js))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Pn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Pn=[new I,new I,new I,new I,new I,new I,new I,new I],an=new I,Ys=new Wn,Ui=new I,Ni=new I,Fi=new I,Xn=new I,qn=new I,ci=new I,gs=new I,Js=new I,Zs=new I,hi=new I;function mo(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){hi.fromArray(i,r);const a=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),l=t.dot(hi),c=e.dot(hi),h=n.dot(hi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const Bf=new Wn,vs=new I,go=new I;class Li{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Bf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;vs.subVectors(t,this.center);const e=vs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(vs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(go.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(vs.copy(t.center).add(go)),this.expandByPoint(vs.copy(t.center).sub(go))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Dn=new I,vo=new I,Ks=new I,Yn=new I,_o=new I,Qs=new I,xo=new I;class Sl{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){vo.copy(t).add(e).multiplyScalar(.5),Ks.copy(e).sub(t).normalize(),Yn.copy(this.origin).sub(vo);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ks),a=Yn.dot(this.direction),l=-Yn.dot(Ks),c=Yn.lengthSq(),h=Math.abs(1-o*o);let d,u,f,p;if(h>0)if(d=o*l-a,u=o*a-l,p=r*h,d>=0)if(u>=-p)if(u<=p){const g=1/h;d*=g,u*=g,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(vo).addScaledVector(Ks,u),f}intersectSphere(t,e){Dn.subVectors(t.center,this.origin);const n=Dn.dot(this.direction),s=Dn.dot(Dn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,n,s,r){_o.subVectors(e,t),Qs.subVectors(n,t),xo.crossVectors(_o,Qs);let o=this.direction.dot(xo),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Yn.subVectors(this.origin,t);const l=a*this.direction.dot(Qs.crossVectors(Yn,Qs));if(l<0)return null;const c=a*this.direction.dot(_o.cross(Yn));if(c<0||l+c>o)return null;const h=-a*Yn.dot(xo);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ae{constructor(t,e,n,s,r,o,a,l,c,h,d,u,f,p,g,m){ae.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,f,p,g,m)}set(t,e,n,s,r,o,a,l,c,h,d,u,f,p,g,m){const v=this.elements;return v[0]=t,v[4]=e,v[8]=n,v[12]=s,v[1]=r,v[5]=o,v[9]=a,v[13]=l,v[2]=c,v[6]=h,v[10]=d,v[14]=u,v[3]=f,v[7]=p,v[11]=g,v[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ae().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Oi.setFromMatrixColumn(t,0).length(),r=1/Oi.setFromMatrixColumn(t,1).length(),o=1/Oi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,f=o*d,p=a*h,g=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-g*c,e[9]=-a*l,e[2]=g-u*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u+g*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=g+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u-g*a,e[4]=-o*d,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=g-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,f=o*d,p=a*h,g=a*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+g,e[1]=l*d,e[5]=g*c+u,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,f=o*c,p=a*l,g=a*c;e[0]=l*h,e[4]=g-u*d,e[8]=p*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-g*d}else if(t.order==="XZY"){const u=o*l,f=o*c,p=a*l,g=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+g,e[5]=o*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=a*h,e[10]=g*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(zf,t,kf)}lookAt(t,e,n){const s=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),Jn.crossVectors(n,Ye),Jn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),Jn.crossVectors(n,Ye)),Jn.normalize(),tr.crossVectors(Ye,Jn),s[0]=Jn.x,s[4]=tr.x,s[8]=Ye.x,s[1]=Jn.y,s[5]=tr.y,s[9]=Ye.y,s[2]=Jn.z,s[6]=tr.z,s[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],g=n[6],m=n[10],v=n[14],M=n[3],_=n[7],S=n[11],P=n[15],A=s[0],T=s[4],L=s[8],x=s[12],y=s[1],E=s[5],D=s[9],N=s[13],F=s[2],W=s[6],O=s[10],z=s[14],V=s[3],ot=s[7],at=s[11],ht=s[15];return r[0]=o*A+a*y+l*F+c*V,r[4]=o*T+a*E+l*W+c*ot,r[8]=o*L+a*D+l*O+c*at,r[12]=o*x+a*N+l*z+c*ht,r[1]=h*A+d*y+u*F+f*V,r[5]=h*T+d*E+u*W+f*ot,r[9]=h*L+d*D+u*O+f*at,r[13]=h*x+d*N+u*z+f*ht,r[2]=p*A+g*y+m*F+v*V,r[6]=p*T+g*E+m*W+v*ot,r[10]=p*L+g*D+m*O+v*at,r[14]=p*x+g*N+m*z+v*ht,r[3]=M*A+_*y+S*F+P*V,r[7]=M*T+_*E+S*W+P*ot,r[11]=M*L+_*D+S*O+P*at,r[15]=M*x+_*N+S*z+P*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],g=t[7],m=t[11],v=t[15];return p*(+r*l*d-s*c*d-r*a*u+n*c*u+s*a*f-n*l*f)+g*(+e*l*f-e*c*u+r*o*u-s*o*f+s*c*h-r*l*h)+m*(+e*c*d-e*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+v*(-s*a*h-e*l*d+e*a*u+s*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],g=t[13],m=t[14],v=t[15],M=d*m*c-g*u*c+g*l*f-a*m*f-d*l*v+a*u*v,_=p*u*c-h*m*c-p*l*f+o*m*f+h*l*v-o*u*v,S=h*g*c-p*d*c+p*a*f-o*g*f-h*a*v+o*d*v,P=p*d*l-h*g*l-p*a*u+o*g*u+h*a*m-o*d*m,A=e*M+n*_+s*S+r*P;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return t[0]=M*T,t[1]=(g*u*r-d*m*r-g*s*f+n*m*f+d*s*v-n*u*v)*T,t[2]=(a*m*r-g*l*r+g*s*c-n*m*c-a*s*v+n*l*v)*T,t[3]=(d*l*r-a*u*r-d*s*c+n*u*c+a*s*f-n*l*f)*T,t[4]=_*T,t[5]=(h*m*r-p*u*r+p*s*f-e*m*f-h*s*v+e*u*v)*T,t[6]=(p*l*r-o*m*r-p*s*c+e*m*c+o*s*v-e*l*v)*T,t[7]=(o*u*r-h*l*r+h*s*c-e*u*c-o*s*f+e*l*f)*T,t[8]=S*T,t[9]=(p*d*r-h*g*r-p*n*f+e*g*f+h*n*v-e*d*v)*T,t[10]=(o*g*r-p*a*r+p*n*c-e*g*c-o*n*v+e*a*v)*T,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*f-e*a*f)*T,t[12]=P*T,t[13]=(h*g*s-p*d*s+p*n*u-e*g*u-h*n*m+e*d*m)*T,t[14]=(p*a*s-o*g*s-p*n*l+e*g*l+o*n*m-e*a*m)*T,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*u+e*a*u)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,p=r*d,g=o*h,m=o*d,v=a*d,M=l*c,_=l*h,S=l*d,P=n.x,A=n.y,T=n.z;return s[0]=(1-(g+v))*P,s[1]=(f+S)*P,s[2]=(p-_)*P,s[3]=0,s[4]=(f-S)*A,s[5]=(1-(u+v))*A,s[6]=(m+M)*A,s[7]=0,s[8]=(p+_)*T,s[9]=(m-M)*T,s[10]=(1-(u+g))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Oi.set(s[0],s[1],s[2]).length();const o=Oi.set(s[4],s[5],s[6]).length(),a=Oi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],ln.copy(this);const c=1/r,h=1/o,d=1/a;return ln.elements[0]*=c,ln.elements[1]*=c,ln.elements[2]*=c,ln.elements[4]*=h,ln.elements[5]*=h,ln.elements[6]*=h,ln.elements[8]*=d,ln.elements[9]*=d,ln.elements[10]*=d,e.setFromRotationMatrix(ln),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=kn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let f,p;if(a===kn)f=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===Hr)f=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=kn){const l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),u=(e+t)*c,f=(n+s)*h;let p,g;if(a===kn)p=(o+r)*d,g=-2*d;else if(a===Hr)p=r*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=g,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Oi=new I,ln=new ae,zf=new I(0,0,0),kf=new I(1,1,1),Jn=new I,tr=new I,Ye=new I,oc=new ae,ac=new Gs;class Tn{constructor(t=0,e=0,n=0,s=Tn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ce(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ce(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ce(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ce(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ce(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return oc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(oc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ac.setFromEuler(this),this.setFromQuaternion(ac,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Tn.DEFAULT_ORDER="XYZ";class Ml{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Vf=0;const lc=new I,Bi=new Gs,In=new ae,er=new I,_s=new I,Gf=new I,Hf=new Gs,cc=new I(1,0,0),hc=new I(0,1,0),uc=new I(0,0,1),dc={type:"added"},Wf={type:"removed"},zi={type:"childadded",child:null},yo={type:"childremoved",child:null};class be extends hs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vf++}),this.uuid=An(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=be.DEFAULT_UP.clone();const t=new I,e=new Tn,n=new Gs,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new $t}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=be.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ml,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.multiply(Bi),this}rotateOnWorldAxis(t,e){return Bi.setFromAxisAngle(t,e),this.quaternion.premultiply(Bi),this}rotateX(t){return this.rotateOnAxis(cc,t)}rotateY(t){return this.rotateOnAxis(hc,t)}rotateZ(t){return this.rotateOnAxis(uc,t)}translateOnAxis(t,e){return lc.copy(t).applyQuaternion(this.quaternion),this.position.add(lc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(cc,t)}translateY(t){return this.translateOnAxis(hc,t)}translateZ(t){return this.translateOnAxis(uc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?er.copy(t):er.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(_s,er,this.up):In.lookAt(er,_s,this.up),this.quaternion.setFromRotationMatrix(In),s&&(In.extractRotation(s.matrixWorld),Bi.setFromRotationMatrix(In),this.quaternion.premultiply(Bi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(dc),zi.child=t,this.dispatchEvent(zi),zi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Wf),yo.child=t,this.dispatchEvent(yo),yo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),In.multiply(t.parent.matrixWorld)),t.applyMatrix4(In),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(dc),zi.child=t,this.dispatchEvent(zi),zi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,t,Gf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,Hf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}be.DEFAULT_UP=new I(0,1,0);be.DEFAULT_MATRIX_AUTO_UPDATE=!0;be.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const cn=new I,Un=new I,So=new I,Nn=new I,ki=new I,Vi=new I,fc=new I,Mo=new I,bo=new I,Eo=new I,wo=new ce,Ao=new ce,To=new ce;class pn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),cn.subVectors(t,e),s.cross(cn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){cn.subVectors(s,e),Un.subVectors(n,e),So.subVectors(t,e);const o=cn.dot(cn),a=cn.dot(Un),l=cn.dot(So),c=Un.dot(Un),h=Un.dot(So),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,p=(o*h-a*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Nn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Nn.x),l.addScaledVector(o,Nn.y),l.addScaledVector(a,Nn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return wo.setScalar(0),Ao.setScalar(0),To.setScalar(0),wo.fromBufferAttribute(t,e),Ao.fromBufferAttribute(t,n),To.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(wo,r.x),o.addScaledVector(Ao,r.y),o.addScaledVector(To,r.z),o}static isFrontFacing(t,e,n,s){return cn.subVectors(n,e),Un.subVectors(t,e),cn.cross(Un).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return cn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),cn.cross(Un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return pn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return pn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return pn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return pn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return pn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ki.subVectors(s,n),Vi.subVectors(r,n),Mo.subVectors(t,n);const l=ki.dot(Mo),c=Vi.dot(Mo);if(l<=0&&c<=0)return e.copy(n);bo.subVectors(t,s);const h=ki.dot(bo),d=Vi.dot(bo);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(ki,o);Eo.subVectors(t,r);const f=ki.dot(Eo),p=Vi.dot(Eo);if(p>=0&&f<=p)return e.copy(r);const g=f*c-l*p;if(g<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(Vi,a);const m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return fc.subVectors(r,s),a=(d-h)/(d-h+(f-p)),e.copy(s).addScaledVector(fc,a);const v=1/(m+g+u);return o=g*v,a=u*v,e.copy(n).addScaledVector(ki,o).addScaledVector(Vi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const du={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zn={h:0,s:0,l:0},nr={h:0,s:0,l:0};function Co(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Jt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Qt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Qt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Qt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Qt.workingColorSpace){if(t=yl(t,1),e=Ce(e,0,1),n=Ce(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Co(o,r,t+1/3),this.g=Co(o,r,t),this.b=Co(o,r,t-1/3)}return Qt.toWorkingColorSpace(this,s),this}setStyle(t,e=Ze){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ze){const n=du[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Vn(t.r),this.g=Vn(t.g),this.b=Vn(t.b),this}copyLinearToSRGB(t){return this.r=ts(t.r),this.g=ts(t.g),this.b=ts(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ze){return Qt.fromWorkingColorSpace(Be.copy(this),t),Math.round(Ce(Be.r*255,0,255))*65536+Math.round(Ce(Be.g*255,0,255))*256+Math.round(Ce(Be.b*255,0,255))}getHexString(t=Ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Qt.workingColorSpace){Qt.fromWorkingColorSpace(Be.copy(this),e);const n=Be.r,s=Be.g,r=Be.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Qt.workingColorSpace){return Qt.fromWorkingColorSpace(Be.copy(this),e),t.r=Be.r,t.g=Be.g,t.b=Be.b,t}getStyle(t=Ze){Qt.fromWorkingColorSpace(Be.copy(this),t);const e=Be.r,n=Be.g,s=Be.b;return t!==Ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Zn),this.setHSL(Zn.h+t,Zn.s+e,Zn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Zn),t.getHSL(nr);const n=As(Zn.h,nr.h,e),s=As(Zn.s,nr.s,e),r=As(Zn.l,nr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Be=new Jt;Jt.NAMES=du;let $f=0;class us extends hs{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$f++}),this.uuid=An(),this.name="",this.blending=Ki,this.side=ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ra,this.blendDst=oa,this.blendEquation=_i,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Jt(0,0,0),this.blendAlpha=0,this.depthFunc=ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Di,this.stencilZFail=Di,this.stencilZPass=Di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ki&&(n.blending=this.blending),this.side!==ai&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ra&&(n.blendSrc=this.blendSrc),this.blendDst!==oa&&(n.blendDst=this.blendDst),this.blendEquation!==_i&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ns&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Di&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Di&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Di&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Ts extends us{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.combine=Yh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Se=new I,ir=new vt;class vn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Wa,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ir.fromBufferAttribute(this,e),ir.applyMatrix3(t),this.setXY(e,ir.x,ir.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=fn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=oe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fn(e,this.array)),e}setX(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fn(e,this.array)),e}setY(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fn(e,this.array)),e}setW(t,e){return this.normalized&&(e=oe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),s=oe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),s=oe(s,this.array),r=oe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Wa&&(t.usage=this.usage),t}}class fu extends vn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class pu extends vn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class me extends vn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let jf=0;const en=new ae,Ro=new be,Gi=new I,Je=new Wn,xs=new Wn,Ae=new I;class Re extends hs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=An(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(cu(t)?pu:fu)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new $t().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return Ro.lookAt(t),Ro.updateMatrix(),this.applyMatrix4(Ro.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gi).negate(),this.translate(Gi.x,Gi.y,Gi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new me(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Je.setFromBufferAttribute(r),this.morphTargetsRelative?(Ae.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(Ae),Ae.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(Ae)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];xs.setFromBufferAttribute(a),this.morphTargetsRelative?(Ae.addVectors(Je.min,xs.min),Je.expandByPoint(Ae),Ae.addVectors(Je.max,xs.max),Je.expandByPoint(Ae)):(Je.expandByPoint(xs.min),Je.expandByPoint(xs.max))}Je.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ae.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ae));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Ae.fromBufferAttribute(a,c),l&&(Gi.fromBufferAttribute(t,c),Ae.add(Gi)),s=Math.max(s,n.distanceToSquared(Ae))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new vn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new I,l[L]=new I;const c=new I,h=new I,d=new I,u=new vt,f=new vt,p=new vt,g=new I,m=new I;function v(L,x,y){c.fromBufferAttribute(n,L),h.fromBufferAttribute(n,x),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,L),f.fromBufferAttribute(r,x),p.fromBufferAttribute(r,y),h.sub(c),d.sub(c),f.sub(u),p.sub(u);const E=1/(f.x*p.y-p.x*f.y);isFinite(E)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(E),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(E),a[L].add(g),a[x].add(g),a[y].add(g),l[L].add(m),l[x].add(m),l[y].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let L=0,x=M.length;L<x;++L){const y=M[L],E=y.start,D=y.count;for(let N=E,F=E+D;N<F;N+=3)v(t.getX(N+0),t.getX(N+1),t.getX(N+2))}const _=new I,S=new I,P=new I,A=new I;function T(L){P.fromBufferAttribute(s,L),A.copy(P);const x=a[L];_.copy(x),_.sub(P.multiplyScalar(P.dot(x))).normalize(),S.crossVectors(A,x);const E=S.dot(l[L])<0?-1:1;o.setXYZW(L,_.x,_.y,_.z,E)}for(let L=0,x=M.length;L<x;++L){const y=M[L],E=y.start,D=y.count;for(let N=E,F=E+D;N<F;N+=3)T(t.getX(N+0)),T(t.getX(N+1)),T(t.getX(N+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new vn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new I,r=new I,o=new I,a=new I,l=new I,c=new I,h=new I,d=new I;if(t)for(let u=0,f=t.count;u<f;u+=3){const p=t.getX(u+0),g=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ae.fromBufferAttribute(t,e),Ae.normalize(),t.setXYZ(e,Ae.x,Ae.y,Ae.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,p=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*h;for(let v=0;v<h;v++)u[p++]=c[f++]}return new vn(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Re,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pc=new ae,ui=new Sl,sr=new Li,mc=new I,rr=new I,or=new I,ar=new I,Lo=new I,lr=new I,gc=new I,cr=new I;class Te extends be{constructor(t=new Re,e=new Ts){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){lr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(Lo.fromBufferAttribute(d,t),o?lr.addScaledVector(Lo,h):lr.addScaledVector(Lo.sub(e),h))}e.add(lr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),sr.copy(n.boundingSphere),sr.applyMatrix4(r),ui.copy(t.ray).recast(t.near),!(sr.containsPoint(ui.origin)===!1&&(ui.intersectSphere(sr,mc)===null||ui.origin.distanceToSquared(mc)>(t.far-t.near)**2))&&(pc.copy(r).invert(),ui.copy(t.ray).applyMatrix4(pc),!(n.boundingBox!==null&&ui.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ui)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,g=u.length;p<g;p++){const m=u[p],v=o[m.materialIndex],M=Math.max(m.start,f.start),_=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,P=_;S<P;S+=3){const A=a.getX(S),T=a.getX(S+1),L=a.getX(S+2);s=hr(this,v,t,n,c,h,d,A,T,L),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let m=p,v=g;m<v;m+=3){const M=a.getX(m),_=a.getX(m+1),S=a.getX(m+2);s=hr(this,o,t,n,c,h,d,M,_,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,g=u.length;p<g;p++){const m=u[p],v=o[m.materialIndex],M=Math.max(m.start,f.start),_=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,P=_;S<P;S+=3){const A=S,T=S+1,L=S+2;s=hr(this,v,t,n,c,h,d,A,T,L),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let m=p,v=g;m<v;m+=3){const M=m,_=m+1,S=m+2;s=hr(this,o,t,n,c,h,d,M,_,S),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Xf(i,t,e,n,s,r,o,a){let l;if(t.side===Xe?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ai,a),l===null)return null;cr.copy(a),cr.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(cr);return c<e.near||c>e.far?null:{distance:c,point:cr.clone(),object:i}}function hr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,rr),i.getVertexPosition(l,or),i.getVertexPosition(c,ar);const h=Xf(i,t,e,n,rr,or,ar,gc);if(h){const d=new I;pn.getBarycoord(gc,rr,or,ar,d),s&&(h.uv=pn.getInterpolatedAttribute(s,a,l,c,d,new vt)),r&&(h.uv1=pn.getInterpolatedAttribute(r,a,l,c,d,new vt)),o&&(h.normal=pn.getInterpolatedAttribute(o,a,l,c,d,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new I,materialIndex:0};pn.getNormal(rr,or,ar,u.normal),h.face=u,h.barycoord=d}return h}class ds extends Re{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(h,3)),this.setAttribute("uv",new me(d,2));function p(g,m,v,M,_,S,P,A,T,L,x){const y=S/T,E=P/L,D=S/2,N=P/2,F=A/2,W=T+1,O=L+1;let z=0,V=0;const ot=new I;for(let at=0;at<O;at++){const ht=at*E-N;for(let At=0;At<W;At++){const Tt=At*y-D;ot[g]=Tt*M,ot[m]=ht*_,ot[v]=F,c.push(ot.x,ot.y,ot.z),ot[g]=0,ot[m]=0,ot[v]=A>0?1:-1,h.push(ot.x,ot.y,ot.z),d.push(At/T),d.push(1-at/L),z+=1}}for(let at=0;at<L;at++)for(let ht=0;ht<T;ht++){const At=u+ht+W*at,Tt=u+ht+W*(at+1),q=u+(ht+1)+W*(at+1),G=u+(ht+1)+W*at;l.push(At,Tt,G),l.push(Tt,q,G),V+=6}a.addGroup(f,V,x),f+=V,u+=z}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ds(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function as(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ke(i){const t={};for(let e=0;e<i.length;e++){const n=as(i[e]);for(const s in n)t[s]=n[s]}return t}function qf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function mu(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Qt.workingColorSpace}const bl={clone:as,merge:ke};var Yf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Jf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Hn extends us{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Yf,this.fragmentShader=Jf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=as(t.uniforms),this.uniformsGroups=qf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class gu extends be{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=kn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Kn=new I,vc=new vt,_c=new vt;class nn extends gu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Fs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Fs*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Kn.x,Kn.y).multiplyScalar(-t/Kn.z),Kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Kn.x,Kn.y).multiplyScalar(-t/Kn.z)}getViewSize(t,e){return this.getViewBounds(t,vc,_c),e.subVectors(_c,vc)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ws*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Hi=-90,Wi=1;class Zf extends be{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new nn(Hi,Wi,t,e);s.layers=this.layers,this.add(s);const r=new nn(Hi,Wi,t,e);r.layers=this.layers,this.add(r);const o=new nn(Hi,Wi,t,e);o.layers=this.layers,this.add(o);const a=new nn(Hi,Wi,t,e);a.layers=this.layers,this.add(a);const l=new nn(Hi,Wi,t,e);l.layers=this.layers,this.add(l);const c=new nn(Hi,Wi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Hr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class vu extends Ge{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:is,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Kf extends Ei{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new vu(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:wn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ds(5,5,5),r=new Hn({name:"CubemapFromEquirect",uniforms:as(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xe,blending:ri});r.uniforms.tEquirect.value=e;const o=new Te(s,r),a=e.minFilter;return e.minFilter===Si&&(e.minFilter=wn),new Zf(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const Po=new I,Qf=new I,tp=new $t;class On{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=Po.subVectors(n,e).cross(Qf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Po),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||tp.getNormalMatrix(t),s=this.coplanarPoint(Po).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const di=new Li,ur=new I;class El{constructor(t=new On,e=new On,n=new On,s=new On,r=new On,o=new On){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=kn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],f=s[8],p=s[9],g=s[10],m=s[11],v=s[12],M=s[13],_=s[14],S=s[15];if(n[0].setComponents(l-r,u-c,m-f,S-v).normalize(),n[1].setComponents(l+r,u+c,m+f,S+v).normalize(),n[2].setComponents(l+o,u+h,m+p,S+M).normalize(),n[3].setComponents(l-o,u-h,m-p,S-M).normalize(),n[4].setComponents(l-a,u-d,m-g,S-_).normalize(),e===kn)n[5].setComponents(l+a,u+d,m+g,S+_).normalize();else if(e===Hr)n[5].setComponents(a,d,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),di.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),di.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(di)}intersectsSprite(t){return di.center.set(0,0,0),di.radius=.7071067811865476,di.applyMatrix4(t.matrixWorld),this.intersectsSphere(di)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(ur.x=s.normal.x>0?t.max.x:t.min.x,ur.y=s.normal.y>0?t.max.y:t.min.y,ur.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ur)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function _u(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function ep(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],g=d[f];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++u,d[u]=g)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const g=d[f];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class no extends Re{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],p=[],g=[],m=[];for(let v=0;v<h;v++){const M=v*u-o;for(let _=0;_<c;_++){const S=_*d-r;p.push(S,-M,0),g.push(0,0,1),m.push(_/a),m.push(1-v/l)}}for(let v=0;v<l;v++)for(let M=0;M<a;M++){const _=M+c*v,S=M+c*(v+1),P=M+1+c*(v+1),A=M+1+c*v;f.push(_,S,A),f.push(S,P,A)}this.setIndex(f),this.setAttribute("position",new me(p,3)),this.setAttribute("normal",new me(g,3)),this.setAttribute("uv",new me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new no(t.width,t.height,t.widthSegments,t.heightSegments)}}var np=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ip=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,sp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,op=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ap=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,cp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,up=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,dp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,mp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,gp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,_p=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Sp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,bp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ep=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,wp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ap=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Tp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Cp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Rp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Dp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ip=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Up=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Np=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Fp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Op=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Gp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Hp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Wp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$p=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Xp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,qp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Yp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Jp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Zp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Kp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,tm=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,em=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nm=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,im=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sm=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,rm=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,om=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,am=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,hm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,um=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fm=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,_m=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ym=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Sm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Em=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Am=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Tm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Rm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Lm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Pm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Dm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Im=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Um=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Fm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Om=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Bm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,km=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Vm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Gm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Hm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wm=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$m=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Xm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ym=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Qm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,tg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const eg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ng=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,sg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,og=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ag=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,lg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,hg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ug=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,gg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_g=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,yg=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Mg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,bg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Eg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ag=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tg=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Cg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Lg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ig=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ug=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qt={alphahash_fragment:np,alphahash_pars_fragment:ip,alphamap_fragment:sp,alphamap_pars_fragment:rp,alphatest_fragment:op,alphatest_pars_fragment:ap,aomap_fragment:lp,aomap_pars_fragment:cp,batching_pars_vertex:hp,batching_vertex:up,begin_vertex:dp,beginnormal_vertex:fp,bsdfs:pp,iridescence_fragment:mp,bumpmap_pars_fragment:gp,clipping_planes_fragment:vp,clipping_planes_pars_fragment:_p,clipping_planes_pars_vertex:xp,clipping_planes_vertex:yp,color_fragment:Sp,color_pars_fragment:Mp,color_pars_vertex:bp,color_vertex:Ep,common:wp,cube_uv_reflection_fragment:Ap,defaultnormal_vertex:Tp,displacementmap_pars_vertex:Cp,displacementmap_vertex:Rp,emissivemap_fragment:Lp,emissivemap_pars_fragment:Pp,colorspace_fragment:Dp,colorspace_pars_fragment:Ip,envmap_fragment:Up,envmap_common_pars_fragment:Np,envmap_pars_fragment:Fp,envmap_pars_vertex:Op,envmap_physical_pars_fragment:qp,envmap_vertex:Bp,fog_vertex:zp,fog_pars_vertex:kp,fog_fragment:Vp,fog_pars_fragment:Gp,gradientmap_pars_fragment:Hp,lightmap_pars_fragment:Wp,lights_lambert_fragment:$p,lights_lambert_pars_fragment:jp,lights_pars_begin:Xp,lights_toon_fragment:Yp,lights_toon_pars_fragment:Jp,lights_phong_fragment:Zp,lights_phong_pars_fragment:Kp,lights_physical_fragment:Qp,lights_physical_pars_fragment:tm,lights_fragment_begin:em,lights_fragment_maps:nm,lights_fragment_end:im,logdepthbuf_fragment:sm,logdepthbuf_pars_fragment:rm,logdepthbuf_pars_vertex:om,logdepthbuf_vertex:am,map_fragment:lm,map_pars_fragment:cm,map_particle_fragment:hm,map_particle_pars_fragment:um,metalnessmap_fragment:dm,metalnessmap_pars_fragment:fm,morphinstance_vertex:pm,morphcolor_vertex:mm,morphnormal_vertex:gm,morphtarget_pars_vertex:vm,morphtarget_vertex:_m,normal_fragment_begin:xm,normal_fragment_maps:ym,normal_pars_fragment:Sm,normal_pars_vertex:Mm,normal_vertex:bm,normalmap_pars_fragment:Em,clearcoat_normal_fragment_begin:wm,clearcoat_normal_fragment_maps:Am,clearcoat_pars_fragment:Tm,iridescence_pars_fragment:Cm,opaque_fragment:Rm,packing:Lm,premultiplied_alpha_fragment:Pm,project_vertex:Dm,dithering_fragment:Im,dithering_pars_fragment:Um,roughnessmap_fragment:Nm,roughnessmap_pars_fragment:Fm,shadowmap_pars_fragment:Om,shadowmap_pars_vertex:Bm,shadowmap_vertex:zm,shadowmask_pars_fragment:km,skinbase_vertex:Vm,skinning_pars_vertex:Gm,skinning_vertex:Hm,skinnormal_vertex:Wm,specularmap_fragment:$m,specularmap_pars_fragment:jm,tonemapping_fragment:Xm,tonemapping_pars_fragment:qm,transmission_fragment:Ym,transmission_pars_fragment:Jm,uv_pars_fragment:Zm,uv_pars_vertex:Km,uv_vertex:Qm,worldpos_vertex:tg,background_vert:eg,background_frag:ng,backgroundCube_vert:ig,backgroundCube_frag:sg,cube_vert:rg,cube_frag:og,depth_vert:ag,depth_frag:lg,distanceRGBA_vert:cg,distanceRGBA_frag:hg,equirect_vert:ug,equirect_frag:dg,linedashed_vert:fg,linedashed_frag:pg,meshbasic_vert:mg,meshbasic_frag:gg,meshlambert_vert:vg,meshlambert_frag:_g,meshmatcap_vert:xg,meshmatcap_frag:yg,meshnormal_vert:Sg,meshnormal_frag:Mg,meshphong_vert:bg,meshphong_frag:Eg,meshphysical_vert:wg,meshphysical_frag:Ag,meshtoon_vert:Tg,meshtoon_frag:Cg,points_vert:Rg,points_frag:Lg,shadow_vert:Pg,shadow_frag:Dg,sprite_vert:Ig,sprite_frag:Ug},mt={common:{diffuse:{value:new Jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new Jt(16777215)},opacity:{value:1},center:{value:new vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},je={basic:{uniforms:ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:qt.meshbasic_vert,fragmentShader:qt.meshbasic_frag},lambert:{uniforms:ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Jt(0)}}]),vertexShader:qt.meshlambert_vert,fragmentShader:qt.meshlambert_frag},phong:{uniforms:ke([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new Jt(0)},specular:{value:new Jt(1118481)},shininess:{value:30}}]),vertexShader:qt.meshphong_vert,fragmentShader:qt.meshphong_frag},standard:{uniforms:ke([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new Jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag},toon:{uniforms:ke([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new Jt(0)}}]),vertexShader:qt.meshtoon_vert,fragmentShader:qt.meshtoon_frag},matcap:{uniforms:ke([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:qt.meshmatcap_vert,fragmentShader:qt.meshmatcap_frag},points:{uniforms:ke([mt.points,mt.fog]),vertexShader:qt.points_vert,fragmentShader:qt.points_frag},dashed:{uniforms:ke([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qt.linedashed_vert,fragmentShader:qt.linedashed_frag},depth:{uniforms:ke([mt.common,mt.displacementmap]),vertexShader:qt.depth_vert,fragmentShader:qt.depth_frag},normal:{uniforms:ke([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:qt.meshnormal_vert,fragmentShader:qt.meshnormal_frag},sprite:{uniforms:ke([mt.sprite,mt.fog]),vertexShader:qt.sprite_vert,fragmentShader:qt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qt.background_vert,fragmentShader:qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:qt.backgroundCube_vert,fragmentShader:qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qt.cube_vert,fragmentShader:qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qt.equirect_vert,fragmentShader:qt.equirect_frag},distanceRGBA:{uniforms:ke([mt.common,mt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qt.distanceRGBA_vert,fragmentShader:qt.distanceRGBA_frag},shadow:{uniforms:ke([mt.lights,mt.fog,{color:{value:new Jt(0)},opacity:{value:1}}]),vertexShader:qt.shadow_vert,fragmentShader:qt.shadow_frag}};je.physical={uniforms:ke([je.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new Jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new Jt(0)},specularColor:{value:new Jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:qt.meshphysical_vert,fragmentShader:qt.meshphysical_frag};const dr={r:0,b:0,g:0},fi=new Tn,Ng=new ae;function Fg(i,t,e,n,s,r,o){const a=new Jt(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function p(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function g(M){let _=!1;const S=p(M);S===null?v(a,l):S&&S.isColor&&(v(S,1),_=!0);const P=i.xr.getEnvironmentBlendMode();P==="additive"?n.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,_){const S=p(_);S&&(S.isCubeTexture||S.mapping===to)?(h===void 0&&(h=new Te(new ds(1,1,1),new Hn({name:"BackgroundCubeMaterial",uniforms:as(je.backgroundCube.uniforms),vertexShader:je.backgroundCube.vertexShader,fragmentShader:je.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),fi.copy(_.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ng.makeRotationFromEuler(fi)),h.material.toneMapped=Qt.getTransfer(S.colorSpace)!==le,(d!==S||u!==S.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=S,u=S.version,f=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new Te(new no(2,2),new Hn({name:"BackgroundMaterial",uniforms:as(je.background.uniforms),vertexShader:je.background.vertexShader,fragmentShader:je.background.fragmentShader,side:ai,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=Qt.getTransfer(S.colorSpace)!==le,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||u!==S.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=S,u=S.version,f=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function v(M,_){M.getRGB(dr,mu(i)),n.buffers.color.setClear(dr.r,dr.g,dr.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),l=_,v(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,v(a,l)},render:g,addToRenderList:m}}function Og(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(y,E,D,N,F){let W=!1;const O=d(N,D,E);r!==O&&(r=O,c(r.object)),W=f(y,N,D,F),W&&p(y,N,D,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,S(y,E,D,N),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function d(y,E,D){const N=D.wireframe===!0;let F=n[y.id];F===void 0&&(F={},n[y.id]=F);let W=F[E.id];W===void 0&&(W={},F[E.id]=W);let O=W[N];return O===void 0&&(O=u(l()),W[N]=O),O}function u(y){const E=[],D=[],N=[];for(let F=0;F<e;F++)E[F]=0,D[F]=0,N[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:D,attributeDivisors:N,object:y,attributes:{},index:null}}function f(y,E,D,N){const F=r.attributes,W=E.attributes;let O=0;const z=D.getAttributes();for(const V in z)if(z[V].location>=0){const at=F[V];let ht=W[V];if(ht===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(ht=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(ht=y.instanceColor)),at===void 0||at.attribute!==ht||ht&&at.data!==ht.data)return!0;O++}return r.attributesNum!==O||r.index!==N}function p(y,E,D,N){const F={},W=E.attributes;let O=0;const z=D.getAttributes();for(const V in z)if(z[V].location>=0){let at=W[V];at===void 0&&(V==="instanceMatrix"&&y.instanceMatrix&&(at=y.instanceMatrix),V==="instanceColor"&&y.instanceColor&&(at=y.instanceColor));const ht={};ht.attribute=at,at&&at.data&&(ht.data=at.data),F[V]=ht,O++}r.attributes=F,r.attributesNum=O,r.index=N}function g(){const y=r.newAttributes;for(let E=0,D=y.length;E<D;E++)y[E]=0}function m(y){v(y,0)}function v(y,E){const D=r.newAttributes,N=r.enabledAttributes,F=r.attributeDivisors;D[y]=1,N[y]===0&&(i.enableVertexAttribArray(y),N[y]=1),F[y]!==E&&(i.vertexAttribDivisor(y,E),F[y]=E)}function M(){const y=r.newAttributes,E=r.enabledAttributes;for(let D=0,N=E.length;D<N;D++)E[D]!==y[D]&&(i.disableVertexAttribArray(D),E[D]=0)}function _(y,E,D,N,F,W,O){O===!0?i.vertexAttribIPointer(y,E,D,F,W):i.vertexAttribPointer(y,E,D,N,F,W)}function S(y,E,D,N){g();const F=N.attributes,W=D.getAttributes(),O=E.defaultAttributeValues;for(const z in W){const V=W[z];if(V.location>=0){let ot=F[z];if(ot===void 0&&(z==="instanceMatrix"&&y.instanceMatrix&&(ot=y.instanceMatrix),z==="instanceColor"&&y.instanceColor&&(ot=y.instanceColor)),ot!==void 0){const at=ot.normalized,ht=ot.itemSize,At=t.get(ot);if(At===void 0)continue;const Tt=At.buffer,q=At.type,G=At.bytesPerElement,nt=q===i.INT||q===i.UNSIGNED_INT||ot.gpuType===pl;if(ot.isInterleavedBufferAttribute){const tt=ot.data,ut=tt.stride,Ct=ot.offset;if(tt.isInstancedInterleavedBuffer){for(let Pt=0;Pt<V.locationSize;Pt++)v(V.location+Pt,tt.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let Pt=0;Pt<V.locationSize;Pt++)m(V.location+Pt);i.bindBuffer(i.ARRAY_BUFFER,Tt);for(let Pt=0;Pt<V.locationSize;Pt++)_(V.location+Pt,ht/V.locationSize,q,at,ut*G,(Ct+ht/V.locationSize*Pt)*G,nt)}else{if(ot.isInstancedBufferAttribute){for(let tt=0;tt<V.locationSize;tt++)v(V.location+tt,ot.meshPerAttribute);y.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let tt=0;tt<V.locationSize;tt++)m(V.location+tt);i.bindBuffer(i.ARRAY_BUFFER,Tt);for(let tt=0;tt<V.locationSize;tt++)_(V.location+tt,ht/V.locationSize,q,at,ht*G,ht/V.locationSize*tt*G,nt)}}else if(O!==void 0){const at=O[z];if(at!==void 0)switch(at.length){case 2:i.vertexAttrib2fv(V.location,at);break;case 3:i.vertexAttrib3fv(V.location,at);break;case 4:i.vertexAttrib4fv(V.location,at);break;default:i.vertexAttrib1fv(V.location,at)}}}}M()}function P(){L();for(const y in n){const E=n[y];for(const D in E){const N=E[D];for(const F in N)h(N[F].object),delete N[F];delete E[D]}delete n[y]}}function A(y){if(n[y.id]===void 0)return;const E=n[y.id];for(const D in E){const N=E[D];for(const F in N)h(N[F].object),delete N[F];delete E[D]}delete n[y.id]}function T(y){for(const E in n){const D=n[E];if(D[y.id]===void 0)continue;const N=D[y.id];for(const F in N)h(N[F].object),delete N[F];delete D[y.id]}}function L(){x(),o=!0,r!==s&&(r=s,c(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:x,dispose:P,releaseStatesOfGeometry:A,releaseStatesOfProgram:T,initAttributes:g,enableAttribute:m,disableUnusedAttributes:M}}function Bg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let p=0;p<d;p++)f+=h[p];e.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)o(c[p],h[p],u[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g]*u[g];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function zg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==mn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const L=T===Vs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Gn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==zn&&!L)}function l(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),_=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=p>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:M,maxVaryings:_,maxFragmentUniforms:S,vertexTextures:P,maxSamples:A}}function kg(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new On,a=new $t,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,v=i.get(d);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const M=r?0:n,_=M*4;let S=v.clippingState||null;l.value=S,S=h(p,u,_,f);for(let P=0;P!==_;++P)S[P]=e[P];v.clippingState=S,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){const g=d!==null?d.length:0;let m=null;if(g!==0){if(m=l.value,p!==!0||m===null){const v=f+g*4,M=u.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<v)&&(m=new Float32Array(v));for(let _=0,S=f;_!==g;++_,S+=4)o.copy(d[_]).applyMatrix4(M,a),o.normal.toArray(m,S),m[S+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function Vg(i){let t=new WeakMap;function e(o,a){return a===pa?o.mapping=is:a===ma&&(o.mapping=ss),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===pa||a===ma)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Kf(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class wl extends gu{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ji=4,xc=[.125,.215,.35,.446,.526,.582],xi=20,Do=new wl,yc=new Jt;let Io=null,Uo=0,No=0,Fo=!1;const vi=(1+Math.sqrt(5))/2,$i=1/vi,Sc=[new I(-vi,$i,0),new I(vi,$i,0),new I(-$i,0,vi),new I($i,0,vi),new I(0,vi,-$i),new I(0,vi,$i),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class Mc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Io=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),No=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ec(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Io,Uo,No),this._renderer.xr.enabled=Fo,t.scissorTest=!1,fr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===is||t.mapping===ss?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Io=this._renderer.getRenderTarget(),Uo=this._renderer.getActiveCubeFace(),No=this._renderer.getActiveMipmapLevel(),Fo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:wn,minFilter:wn,generateMipmaps:!1,type:Vs,format:mn,colorSpace:cs,depthBuffer:!1},s=bc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Gg(r)),this._blurMaterial=Hg(r,t,e)}return s}_compileMaterial(t){const e=new Te(this._lodPlanes[0],t);this._renderer.compile(e,Do)}_sceneToCubeUV(t,e,n,s){const a=new nn(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(yc),h.toneMapping=oi,h.autoClear=!1;const f=new Ts({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),p=new Te(new ds,f);let g=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,g=!0):(f.color.copy(yc),g=!0);for(let v=0;v<6;v++){const M=v%3;M===0?(a.up.set(0,l[v],0),a.lookAt(c[v],0,0)):M===1?(a.up.set(0,0,l[v]),a.lookAt(0,c[v],0)):(a.up.set(0,l[v],0),a.lookAt(0,0,c[v]));const _=this._cubeSize;fr(s,M*_,v>2?_:0,_,_),h.setRenderTarget(s),g&&h.render(p,a),h.render(t,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===is||t.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=wc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ec());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Te(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;fr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Do)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Sc[(s-r-1)%Sc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Te(this._lodPlanes[s],c),u=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*xi-1),g=r/p,m=isFinite(r)?1+Math.floor(h*g):xi;m>xi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${xi}`);const v=[];let M=0;for(let T=0;T<xi;++T){const L=T/g,x=Math.exp(-L*L/2);v.push(x),T===0?M+=x:T<m&&(M+=2*x)}for(let T=0;T<v.length;T++)v[T]=v[T]/M;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=v,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:_}=this;u.dTheta.value=p,u.mipInt.value=_-n;const S=this._sizeLods[s],P=3*S*(s>_-Ji?s-_+Ji:0),A=4*(this._cubeSize-S);fr(e,P,A,3*S,2*S),l.setRenderTarget(e),l.render(d,Do)}}function Gg(i){const t=[],e=[],n=[];let s=i;const r=i-Ji+1+xc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-Ji?l=xc[o-i+Ji-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,p=6,g=3,m=2,v=1,M=new Float32Array(g*p*f),_=new Float32Array(m*p*f),S=new Float32Array(v*p*f);for(let A=0;A<f;A++){const T=A%3*2/3-1,L=A>2?0:-1,x=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];M.set(x,g*p*A),_.set(u,m*p*A);const y=[A,A,A,A,A,A];S.set(y,v*p*A)}const P=new Re;P.setAttribute("position",new vn(M,g)),P.setAttribute("uv",new vn(_,m)),P.setAttribute("faceIndex",new vn(S,v)),t.push(P),s>Ji&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function bc(i,t,e){const n=new Ei(i,t,e);return n.texture.mapping=to,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function fr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Hg(i,t,e){const n=new Float32Array(xi),s=new I(0,1,0);return new Hn({name:"SphericalGaussianBlur",defines:{n:xi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Ec(){return new Hn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function wc(){return new Hn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Al(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Wg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===pa||l===ma,h=l===is||l===ss;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new Mc(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Mc(i)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function $g(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ms("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function jg(i,t,e,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);for(const p in u.morphAttributes){const g=u.morphAttributes[p];for(let m=0,v=g.length;m<v;m++)t.remove(g[m])}u.removeEventListener("dispose",o),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const p in u)t.update(u[p],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const p in f){const g=f[p];for(let m=0,v=g.length;m<v;m++)t.update(g[m],i.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,p=d.attributes.position;let g=0;if(f!==null){const M=f.array;g=f.version;for(let _=0,S=M.length;_<S;_+=3){const P=M[_+0],A=M[_+1],T=M[_+2];u.push(P,A,A,T,T,P)}}else if(p!==void 0){const M=p.array;g=p.version;for(let _=0,S=M.length/3-1;_<S;_+=3){const P=_+0,A=_+1,T=_+2;u.push(P,A,A,T,T,P)}}else return;const m=new(cu(u)?pu:fu)(u,1);m.version=g;const v=r.get(d);v&&t.remove(v),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function Xg(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){i.drawElements(n,f,r,u*o),e.update(f,n,1)}function c(u,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,u*o,p),e.update(f,n,p))}function h(u,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,p);let m=0;for(let v=0;v<p;v++)m+=f[v];e.update(m,n,1)}function d(u,f,p,g){if(p===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<u.length;v++)c(u[v]/o,f[v],g[v]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,g,0,p);let v=0;for(let M=0;M<p;M++)v+=f[M]*g[M];e.update(v,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function qg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Yg(i,t,e){const n=new WeakMap,s=new ce;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let x=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",x)};u!==void 0&&u.texture.dispose();const f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],v=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let _=0;f===!0&&(_=1),p===!0&&(_=2),g===!0&&(_=3);let S=a.attributes.position.count*_,P=1;S>t.maxTextureSize&&(P=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const A=new Float32Array(S*P*4*d),T=new uu(A,S,P,d);T.type=zn,T.needsUpdate=!0;const L=_*4;for(let y=0;y<d;y++){const E=m[y],D=v[y],N=M[y],F=S*P*4*y;for(let W=0;W<E.count;W++){const O=W*L;f===!0&&(s.fromBufferAttribute(E,W),A[F+O+0]=s.x,A[F+O+1]=s.y,A[F+O+2]=s.z,A[F+O+3]=0),p===!0&&(s.fromBufferAttribute(D,W),A[F+O+4]=s.x,A[F+O+5]=s.y,A[F+O+6]=s.z,A[F+O+7]=0),g===!0&&(s.fromBufferAttribute(N,W),A[F+O+8]=s.x,A[F+O+9]=s.y,A[F+O+10]=s.z,A[F+O+11]=N.itemSize===4?s.w:1)}}u={count:d,texture:T,size:new vt(S,P)},n.set(a,u),a.addEventListener("dispose",x)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let g=0;g<c.length;g++)f+=c[g];const p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Jg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class xu extends Ge{constructor(t,e,n,s,r,o,a,l,c,h=Qi){if(h!==Qi&&h!==os)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Qi&&(n=bi),n===void 0&&h===os&&(n=rs),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:gn,this.minFilter=l!==void 0?l:gn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const yu=new Ge,Ac=new xu(1,1),Su=new uu,Mu=new Of,bu=new vu,Tc=[],Cc=[],Rc=new Float32Array(16),Lc=new Float32Array(9),Pc=new Float32Array(4);function fs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Tc[s];if(r===void 0&&(r=new Float32Array(s),Tc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function we(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function io(i,t){let e=Cc[t];e===void 0&&(e=new Int32Array(t),Cc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Zg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Kg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),we(e,t)}}function Qg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),we(e,t)}}function t0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),we(e,t)}}function e0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),we(e,t)}else{if(Ee(e,n))return;Pc.set(n),i.uniformMatrix2fv(this.addr,!1,Pc),we(e,n)}}function n0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),we(e,t)}else{if(Ee(e,n))return;Lc.set(n),i.uniformMatrix3fv(this.addr,!1,Lc),we(e,n)}}function i0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),we(e,t)}else{if(Ee(e,n))return;Rc.set(n),i.uniformMatrix4fv(this.addr,!1,Rc),we(e,n)}}function s0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function r0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),we(e,t)}}function o0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),we(e,t)}}function a0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),we(e,t)}}function l0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function c0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),we(e,t)}}function h0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),we(e,t)}}function u0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),we(e,t)}}function d0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ac.compareFunction=lu,r=Ac):r=yu,e.setTexture2D(t||r,s)}function f0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Mu,s)}function p0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||bu,s)}function m0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Su,s)}function g0(i){switch(i){case 5126:return Zg;case 35664:return Kg;case 35665:return Qg;case 35666:return t0;case 35674:return e0;case 35675:return n0;case 35676:return i0;case 5124:case 35670:return s0;case 35667:case 35671:return r0;case 35668:case 35672:return o0;case 35669:case 35673:return a0;case 5125:return l0;case 36294:return c0;case 36295:return h0;case 36296:return u0;case 35678:case 36198:case 36298:case 36306:case 35682:return d0;case 35679:case 36299:case 36307:return f0;case 35680:case 36300:case 36308:case 36293:return p0;case 36289:case 36303:case 36311:case 36292:return m0}}function v0(i,t){i.uniform1fv(this.addr,t)}function _0(i,t){const e=fs(t,this.size,2);i.uniform2fv(this.addr,e)}function x0(i,t){const e=fs(t,this.size,3);i.uniform3fv(this.addr,e)}function y0(i,t){const e=fs(t,this.size,4);i.uniform4fv(this.addr,e)}function S0(i,t){const e=fs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function M0(i,t){const e=fs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function b0(i,t){const e=fs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function E0(i,t){i.uniform1iv(this.addr,t)}function w0(i,t){i.uniform2iv(this.addr,t)}function A0(i,t){i.uniform3iv(this.addr,t)}function T0(i,t){i.uniform4iv(this.addr,t)}function C0(i,t){i.uniform1uiv(this.addr,t)}function R0(i,t){i.uniform2uiv(this.addr,t)}function L0(i,t){i.uniform3uiv(this.addr,t)}function P0(i,t){i.uniform4uiv(this.addr,t)}function D0(i,t,e){const n=this.cache,s=t.length,r=io(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||yu,r[o])}function I0(i,t,e){const n=this.cache,s=t.length,r=io(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Mu,r[o])}function U0(i,t,e){const n=this.cache,s=t.length,r=io(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||bu,r[o])}function N0(i,t,e){const n=this.cache,s=t.length,r=io(e,s);Ee(n,r)||(i.uniform1iv(this.addr,r),we(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||Su,r[o])}function F0(i){switch(i){case 5126:return v0;case 35664:return _0;case 35665:return x0;case 35666:return y0;case 35674:return S0;case 35675:return M0;case 35676:return b0;case 5124:case 35670:return E0;case 35667:case 35671:return w0;case 35668:case 35672:return A0;case 35669:case 35673:return T0;case 5125:return C0;case 36294:return R0;case 36295:return L0;case 36296:return P0;case 35678:case 36198:case 36298:case 36306:case 35682:return D0;case 35679:case 36299:case 36307:return I0;case 35680:case 36300:case 36308:case 36293:return U0;case 36289:case 36303:case 36311:case 36292:return N0}}class O0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=g0(e.type)}}class B0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=F0(e.type)}}class z0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Oo=/(\w+)(\])?(\[|\.)?/g;function Dc(i,t){i.seq.push(t),i.map[t.id]=t}function k0(i,t,e){const n=i.name,s=n.length;for(Oo.lastIndex=0;;){const r=Oo.exec(n),o=Oo.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){Dc(e,c===void 0?new O0(a,i,t):new B0(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new z0(a),Dc(e,d)),e=d}}}class Fr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);k0(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function Ic(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const V0=37297;let G0=0;function H0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Uc=new $t;function W0(i){Qt._getMatrix(Uc,Qt.workingColorSpace,i);const t=`mat3( ${Uc.elements.map(e=>e.toFixed(4))} )`;switch(Qt.getTransfer(i)){case eo:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Nc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+H0(i.getShaderSource(t),o)}else return s}function $0(i,t){const e=W0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function j0(i,t){let e;switch(t){case qd:e="Linear";break;case Yd:e="Reinhard";break;case Jd:e="Cineon";break;case Zd:e="ACESFilmic";break;case Qd:e="AgX";break;case tf:e="Neutral";break;case Kd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const pr=new I;function X0(){Qt.getLuminanceCoefficients(pr);const i=pr.x.toFixed(4),t=pr.y.toFixed(4),e=pr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function q0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(bs).join(`
`)}function Y0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function J0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function bs(i){return i!==""}function Fc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Oc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Z0=/^[ \t]*#include +<([\w\d./]+)>/gm;function $a(i){return i.replace(Z0,Q0)}const K0=new Map;function Q0(i,t){let e=qt[t];if(e===void 0){const n=K0.get(t);if(n!==void 0)e=qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return $a(e)}const tv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bc(i){return i.replace(tv,ev)}function ev(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function zc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function nv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===qh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Td?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function iv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case is:case ss:t="ENVMAP_TYPE_CUBE";break;case to:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ss:t="ENVMAP_MODE_REFRACTION";break}return t}function rv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yh:t="ENVMAP_BLENDING_MULTIPLY";break;case jd:t="ENVMAP_BLENDING_MIX";break;case Xd:t="ENVMAP_BLENDING_ADD";break}return t}function ov(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function av(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=nv(e),c=iv(e),h=sv(e),d=rv(e),u=ov(e),f=q0(e),p=Y0(r),g=s.createProgram();let m,v,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(bs).join(`
`),m.length>0&&(m+=`
`),v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(bs).join(`
`),v.length>0&&(v+=`
`)):(m=[zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(bs).join(`
`),v=[zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==oi?"#define TONE_MAPPING":"",e.toneMapping!==oi?qt.tonemapping_pars_fragment:"",e.toneMapping!==oi?j0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",qt.colorspace_pars_fragment,$0("linearToOutputTexel",e.outputColorSpace),X0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(bs).join(`
`)),o=$a(o),o=Fc(o,e),o=Oc(o,e),a=$a(a),a=Fc(a,e),a=Oc(a,e),o=Bc(o),a=Bc(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,v=["#define varying in",e.glslVersion===Zl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Zl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const _=M+m+o,S=M+v+a,P=Ic(s,s.VERTEX_SHADER,_),A=Ic(s,s.FRAGMENT_SHADER,S);s.attachShader(g,P),s.attachShader(g,A),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function T(E){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(g).trim(),N=s.getShaderInfoLog(P).trim(),F=s.getShaderInfoLog(A).trim();let W=!0,O=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,P,A);else{const z=Nc(s,P,"vertex"),V=Nc(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+D+`
`+z+`
`+V)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(N===""||F==="")&&(O=!1);O&&(E.diagnostics={runnable:W,programLog:D,vertexShader:{log:N,prefix:m},fragmentShader:{log:F,prefix:v}})}s.deleteShader(P),s.deleteShader(A),L=new Fr(s,g),x=J0(s,g)}let L;this.getUniforms=function(){return L===void 0&&T(this),L};let x;this.getAttributes=function(){return x===void 0&&T(this),x};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(g,V0)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=G0++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=P,this.fragmentShader=A,this}let lv=0;class cv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new hv(t),e.set(t,n)),n}}class hv{constructor(t){this.id=lv++,this.code=t,this.usedTimes=0}}function uv(i,t,e,n,s,r,o){const a=new Ml,l=new cv,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return c.add(x),x===0?"uv":`uv${x}`}function m(x,y,E,D,N){const F=D.fog,W=N.geometry,O=x.isMeshStandardMaterial?D.environment:null,z=(x.isMeshStandardMaterial?e:t).get(x.envMap||O),V=z&&z.mapping===to?z.image.height:null,ot=p[x.type];x.precision!==null&&(f=s.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const at=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ht=at!==void 0?at.length:0;let At=0;W.morphAttributes.position!==void 0&&(At=1),W.morphAttributes.normal!==void 0&&(At=2),W.morphAttributes.color!==void 0&&(At=3);let Tt,q,G,nt;if(ot){const re=je[ot];Tt=re.vertexShader,q=re.fragmentShader}else Tt=x.vertexShader,q=x.fragmentShader,l.update(x),G=l.getVertexShaderID(x),nt=l.getFragmentShaderID(x);const tt=i.getRenderTarget(),ut=i.state.buffers.depth.getReversed(),Ct=N.isInstancedMesh===!0,Pt=N.isBatchedMesh===!0,Ot=!!x.map,et=!!x.matcap,ct=!!z,U=!!x.aoMap,Rt=!!x.lightMap,J=!!x.bumpMap,Mt=!!x.normalMap,pt=!!x.displacementMap,Bt=!!x.emissiveMap,Et=!!x.metalnessMap,R=!!x.roughnessMap,b=x.anisotropy>0,$=x.clearcoat>0,Z=x.dispersion>0,st=x.iridescence>0,Q=x.sheen>0,K=x.transmission>0,dt=b&&!!x.anisotropyMap,gt=$&&!!x.clearcoatMap,Gt=$&&!!x.clearcoatNormalMap,rt=$&&!!x.clearcoatRoughnessMap,xt=st&&!!x.iridescenceMap,Dt=st&&!!x.iridescenceThicknessMap,zt=Q&&!!x.sheenColorMap,wt=Q&&!!x.sheenRoughnessMap,Zt=!!x.specularMap,Xt=!!x.specularColorMap,he=!!x.specularIntensityMap,B=K&&!!x.transmissionMap,_t=K&&!!x.thicknessMap,Y=!!x.gradientMap,it=!!x.alphaMap,bt=x.alphaTest>0,yt=!!x.alphaHash,Ht=!!x.extensions;let ve=oi;x.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(ve=i.toneMapping);const Fe={shaderID:ot,shaderType:x.type,shaderName:x.name,vertexShader:Tt,fragmentShader:q,defines:x.defines,customVertexShaderID:G,customFragmentShaderID:nt,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:Pt,batchingColor:Pt&&N._colorsTexture!==null,instancing:Ct,instancingColor:Ct&&N.instanceColor!==null,instancingMorph:Ct&&N.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:tt===null?i.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:cs,alphaToCoverage:!!x.alphaToCoverage,map:Ot,matcap:et,envMap:ct,envMapMode:ct&&z.mapping,envMapCubeUVHeight:V,aoMap:U,lightMap:Rt,bumpMap:J,normalMap:Mt,displacementMap:u&&pt,emissiveMap:Bt,normalMapObjectSpace:Mt&&x.normalMapType===rf,normalMapTangentSpace:Mt&&x.normalMapType===au,metalnessMap:Et,roughnessMap:R,anisotropy:b,anisotropyMap:dt,clearcoat:$,clearcoatMap:gt,clearcoatNormalMap:Gt,clearcoatRoughnessMap:rt,dispersion:Z,iridescence:st,iridescenceMap:xt,iridescenceThicknessMap:Dt,sheen:Q,sheenColorMap:zt,sheenRoughnessMap:wt,specularMap:Zt,specularColorMap:Xt,specularIntensityMap:he,transmission:K,transmissionMap:B,thicknessMap:_t,gradientMap:Y,opaque:x.transparent===!1&&x.blending===Ki&&x.alphaToCoverage===!1,alphaMap:it,alphaTest:bt,alphaHash:yt,combine:x.combine,mapUv:Ot&&g(x.map.channel),aoMapUv:U&&g(x.aoMap.channel),lightMapUv:Rt&&g(x.lightMap.channel),bumpMapUv:J&&g(x.bumpMap.channel),normalMapUv:Mt&&g(x.normalMap.channel),displacementMapUv:pt&&g(x.displacementMap.channel),emissiveMapUv:Bt&&g(x.emissiveMap.channel),metalnessMapUv:Et&&g(x.metalnessMap.channel),roughnessMapUv:R&&g(x.roughnessMap.channel),anisotropyMapUv:dt&&g(x.anisotropyMap.channel),clearcoatMapUv:gt&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:Gt&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:zt&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:wt&&g(x.sheenRoughnessMap.channel),specularMapUv:Zt&&g(x.specularMap.channel),specularColorMapUv:Xt&&g(x.specularColorMap.channel),specularIntensityMapUv:he&&g(x.specularIntensityMap.channel),transmissionMapUv:B&&g(x.transmissionMap.channel),thicknessMapUv:_t&&g(x.thicknessMap.channel),alphaMapUv:it&&g(x.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Mt||b),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!W.attributes.uv&&(Ot||it),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:ut,skinning:N.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:At,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&E.length>0,shadowMapType:i.shadowMap.type,toneMapping:ve,decodeVideoTexture:Ot&&x.map.isVideoTexture===!0&&Qt.getTransfer(x.map.colorSpace)===le,decodeVideoTextureEmissive:Bt&&x.emissiveMap.isVideoTexture===!0&&Qt.getTransfer(x.emissiveMap.colorSpace)===le,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===dn,flipSided:x.side===Xe,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Ht&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ht&&x.extensions.multiDraw===!0||Pt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Fe.vertexUv1s=c.has(1),Fe.vertexUv2s=c.has(2),Fe.vertexUv3s=c.has(3),c.clear(),Fe}function v(x){const y=[];if(x.shaderID?y.push(x.shaderID):(y.push(x.customVertexShaderID),y.push(x.customFragmentShaderID)),x.defines!==void 0)for(const E in x.defines)y.push(E),y.push(x.defines[E]);return x.isRawShaderMaterial===!1&&(M(y,x),_(y,x),y.push(i.outputColorSpace)),y.push(x.customProgramCacheKey),y.join()}function M(x,y){x.push(y.precision),x.push(y.outputColorSpace),x.push(y.envMapMode),x.push(y.envMapCubeUVHeight),x.push(y.mapUv),x.push(y.alphaMapUv),x.push(y.lightMapUv),x.push(y.aoMapUv),x.push(y.bumpMapUv),x.push(y.normalMapUv),x.push(y.displacementMapUv),x.push(y.emissiveMapUv),x.push(y.metalnessMapUv),x.push(y.roughnessMapUv),x.push(y.anisotropyMapUv),x.push(y.clearcoatMapUv),x.push(y.clearcoatNormalMapUv),x.push(y.clearcoatRoughnessMapUv),x.push(y.iridescenceMapUv),x.push(y.iridescenceThicknessMapUv),x.push(y.sheenColorMapUv),x.push(y.sheenRoughnessMapUv),x.push(y.specularMapUv),x.push(y.specularColorMapUv),x.push(y.specularIntensityMapUv),x.push(y.transmissionMapUv),x.push(y.thicknessMapUv),x.push(y.combine),x.push(y.fogExp2),x.push(y.sizeAttenuation),x.push(y.morphTargetsCount),x.push(y.morphAttributeCount),x.push(y.numDirLights),x.push(y.numPointLights),x.push(y.numSpotLights),x.push(y.numSpotLightMaps),x.push(y.numHemiLights),x.push(y.numRectAreaLights),x.push(y.numDirLightShadows),x.push(y.numPointLightShadows),x.push(y.numSpotLightShadows),x.push(y.numSpotLightShadowsWithMaps),x.push(y.numLightProbes),x.push(y.shadowMapType),x.push(y.toneMapping),x.push(y.numClippingPlanes),x.push(y.numClipIntersection),x.push(y.depthPacking)}function _(x,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),x.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),x.push(a.mask)}function S(x){const y=p[x.type];let E;if(y){const D=je[y];E=bl.clone(D.uniforms)}else E=x.uniforms;return E}function P(x,y){let E;for(let D=0,N=h.length;D<N;D++){const F=h[D];if(F.cacheKey===y){E=F,++E.usedTimes;break}}return E===void 0&&(E=new av(i,y,x,r),h.push(E)),E}function A(x){if(--x.usedTimes===0){const y=h.indexOf(x);h[y]=h[h.length-1],h.pop(),x.destroy()}}function T(x){l.remove(x)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:v,getUniforms:S,acquireProgram:P,releaseProgram:A,releaseShaderCache:T,programs:h,dispose:L}}function dv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function fv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function kc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Vc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,u,f,p,g,m){let v=i[t];return v===void 0?(v={id:d.id,object:d,geometry:u,material:f,groupOrder:p,renderOrder:d.renderOrder,z:g,group:m},i[t]=v):(v.id=d.id,v.object=d,v.geometry=u,v.material=f,v.groupOrder=p,v.renderOrder=d.renderOrder,v.z=g,v.group=m),t++,v}function a(d,u,f,p,g,m){const v=o(d,u,f,p,g,m);f.transmission>0?n.push(v):f.transparent===!0?s.push(v):e.push(v)}function l(d,u,f,p,g,m){const v=o(d,u,f,p,g,m);f.transmission>0?n.unshift(v):f.transparent===!0?s.unshift(v):e.unshift(v)}function c(d,u){e.length>1&&e.sort(d||fv),n.length>1&&n.sort(u||kc),s.length>1&&s.sort(u||kc)}function h(){for(let d=t,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function pv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new Vc,i.set(n,[o])):s>=r.length?(o=new Vc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function mv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Jt};break;case"SpotLight":e={position:new I,direction:new I,color:new Jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Jt,groundColor:new Jt};break;case"RectAreaLight":e={color:new Jt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function gv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let vv=0;function _v(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function xv(i){const t=new mv,e=gv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new ae,o=new ae;function a(c){let h=0,d=0,u=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let f=0,p=0,g=0,m=0,v=0,M=0,_=0,S=0,P=0,A=0,T=0;c.sort(_v);for(let x=0,y=c.length;x<y;x++){const E=c[x],D=E.color,N=E.intensity,F=E.distance,W=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)h+=D.r*N,d+=D.g*N,u+=D.b*N;else if(E.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(E.sh.coefficients[O],N);T++}else if(E.isDirectionalLight){const O=t.get(E);if(O.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const z=E.shadow,V=e.get(E);V.shadowIntensity=z.intensity,V.shadowBias=z.bias,V.shadowNormalBias=z.normalBias,V.shadowRadius=z.radius,V.shadowMapSize=z.mapSize,n.directionalShadow[f]=V,n.directionalShadowMap[f]=W,n.directionalShadowMatrix[f]=E.shadow.matrix,M++}n.directional[f]=O,f++}else if(E.isSpotLight){const O=t.get(E);O.position.setFromMatrixPosition(E.matrixWorld),O.color.copy(D).multiplyScalar(N),O.distance=F,O.coneCos=Math.cos(E.angle),O.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),O.decay=E.decay,n.spot[g]=O;const z=E.shadow;if(E.map&&(n.spotLightMap[P]=E.map,P++,z.updateMatrices(E),E.castShadow&&A++),n.spotLightMatrix[g]=z.matrix,E.castShadow){const V=e.get(E);V.shadowIntensity=z.intensity,V.shadowBias=z.bias,V.shadowNormalBias=z.normalBias,V.shadowRadius=z.radius,V.shadowMapSize=z.mapSize,n.spotShadow[g]=V,n.spotShadowMap[g]=W,S++}g++}else if(E.isRectAreaLight){const O=t.get(E);O.color.copy(D).multiplyScalar(N),O.halfWidth.set(E.width*.5,0,0),O.halfHeight.set(0,E.height*.5,0),n.rectArea[m]=O,m++}else if(E.isPointLight){const O=t.get(E);if(O.color.copy(E.color).multiplyScalar(E.intensity),O.distance=E.distance,O.decay=E.decay,E.castShadow){const z=E.shadow,V=e.get(E);V.shadowIntensity=z.intensity,V.shadowBias=z.bias,V.shadowNormalBias=z.normalBias,V.shadowRadius=z.radius,V.shadowMapSize=z.mapSize,V.shadowCameraNear=z.camera.near,V.shadowCameraFar=z.camera.far,n.pointShadow[p]=V,n.pointShadowMap[p]=W,n.pointShadowMatrix[p]=E.shadow.matrix,_++}n.point[p]=O,p++}else if(E.isHemisphereLight){const O=t.get(E);O.skyColor.copy(E.color).multiplyScalar(N),O.groundColor.copy(E.groundColor).multiplyScalar(N),n.hemi[v]=O,v++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=mt.LTC_FLOAT_1,n.rectAreaLTC2=mt.LTC_FLOAT_2):(n.rectAreaLTC1=mt.LTC_HALF_1,n.rectAreaLTC2=mt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const L=n.hash;(L.directionalLength!==f||L.pointLength!==p||L.spotLength!==g||L.rectAreaLength!==m||L.hemiLength!==v||L.numDirectionalShadows!==M||L.numPointShadows!==_||L.numSpotShadows!==S||L.numSpotMaps!==P||L.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=m,n.point.length=p,n.hemi.length=v,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=_,n.pointShadowMap.length=_,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=_,n.spotLightMatrix.length=S+P-A,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=T,L.directionalLength=f,L.pointLength=p,L.spotLength=g,L.rectAreaLength=m,L.hemiLength=v,L.numDirectionalShadows=M,L.numPointShadows=_,L.numSpotShadows=S,L.numSpotMaps=P,L.numLightProbes=T,n.version=vv++)}function l(c,h){let d=0,u=0,f=0,p=0,g=0;const m=h.matrixWorldInverse;for(let v=0,M=c.length;v<M;v++){const _=c[v];if(_.isDirectionalLight){const S=n.directional[d];S.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),d++}else if(_.isSpotLight){const S=n.spot[f];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),f++}else if(_.isRectAreaLight){const S=n.rectArea[p];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),o.identity(),r.copy(_.matrixWorld),r.premultiply(m),o.extractRotation(r),S.halfWidth.set(_.width*.5,0,0),S.halfHeight.set(0,_.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),p++}else if(_.isPointLight){const S=n.point[u];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),u++}else if(_.isHemisphereLight){const S=n.hemi[g];S.direction.setFromMatrixPosition(_.matrixWorld),S.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function Gc(i){const t=new xv(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function yv(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Gc(i),t.set(s,[a])):r>=o.length?(a=new Gc(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class Sv extends us{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=nf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Mv extends us{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const bv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ev=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function wv(i,t,e){let n=new El;const s=new vt,r=new vt,o=new ce,a=new Sv({depthPacking:sf}),l=new Mv,c={},h=e.maxTextureSize,d={[ai]:Xe,[Xe]:ai,[dn]:dn},u=new Hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new vt},radius:{value:4}},vertexShader:bv,fragmentShader:Ev}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new Re;p.setAttribute("position",new vn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Te(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qh;let v=this.type;this.render=function(A,T,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const x=i.getRenderTarget(),y=i.getActiveCubeFace(),E=i.getActiveMipmapLevel(),D=i.state;D.setBlending(ri),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const N=v!==Fn&&this.type===Fn,F=v===Fn&&this.type!==Fn;for(let W=0,O=A.length;W<O;W++){const z=A[W],V=z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ot=V.getFrameExtents();if(s.multiply(ot),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ot.x),s.x=r.x*ot.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ot.y),s.y=r.y*ot.y,V.mapSize.y=r.y)),V.map===null||N===!0||F===!0){const ht=this.type!==Fn?{minFilter:gn,magFilter:gn}:{};V.map!==null&&V.map.dispose(),V.map=new Ei(s.x,s.y,ht),V.map.texture.name=z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const at=V.getViewportCount();for(let ht=0;ht<at;ht++){const At=V.getViewport(ht);o.set(r.x*At.x,r.y*At.y,r.x*At.z,r.y*At.w),D.viewport(o),V.updateMatrices(z,ht),n=V.getFrustum(),S(T,L,V.camera,z,this.type)}V.isPointLightShadow!==!0&&this.type===Fn&&M(V,L),V.needsUpdate=!1}v=this.type,m.needsUpdate=!1,i.setRenderTarget(x,y,E)};function M(A,T){const L=t.update(g);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Ei(s.x,s.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(T,null,L,u,g,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(T,null,L,f,g,null)}function _(A,T,L,x){let y=null;const E=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(E!==void 0)y=E;else if(y=L.isPointLight===!0?l:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const D=y.uuid,N=T.uuid;let F=c[D];F===void 0&&(F={},c[D]=F);let W=F[N];W===void 0&&(W=y.clone(),F[N]=W,T.addEventListener("dispose",P)),y=W}if(y.visible=T.visible,y.wireframe=T.wireframe,x===Fn?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:d[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const D=i.properties.get(y);D.light=L}return y}function S(A,T,L,x,y){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===Fn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const N=t.update(A),F=A.material;if(Array.isArray(F)){const W=N.groups;for(let O=0,z=W.length;O<z;O++){const V=W[O],ot=F[V.materialIndex];if(ot&&ot.visible){const at=_(A,ot,x,y);A.onBeforeShadow(i,A,T,L,N,at,V),i.renderBufferDirect(L,null,N,at,A,V),A.onAfterShadow(i,A,T,L,N,at,V)}}}else if(F.visible){const W=_(A,F,x,y);A.onBeforeShadow(i,A,T,L,N,W,null),i.renderBufferDirect(L,null,N,W,A,null),A.onAfterShadow(i,A,T,L,N,W,null)}}const D=A.children;for(let N=0,F=D.length;N<F;N++)S(D[N],T,L,x,y)}function P(A){A.target.removeEventListener("dispose",P);for(const L in c){const x=c[L],y=A.target.uuid;y in x&&(x[y].dispose(),delete x[y])}}}const Av={[aa]:la,[ca]:da,[ha]:fa,[ns]:ua,[la]:aa,[da]:ca,[fa]:ha,[ua]:ns};function Tv(i,t){function e(){let B=!1;const _t=new ce;let Y=null;const it=new ce(0,0,0,0);return{setMask:function(bt){Y!==bt&&!B&&(i.colorMask(bt,bt,bt,bt),Y=bt)},setLocked:function(bt){B=bt},setClear:function(bt,yt,Ht,ve,Fe){Fe===!0&&(bt*=ve,yt*=ve,Ht*=ve),_t.set(bt,yt,Ht,ve),it.equals(_t)===!1&&(i.clearColor(bt,yt,Ht,ve),it.copy(_t))},reset:function(){B=!1,Y=null,it.set(-1,0,0,0)}}}function n(){let B=!1,_t=!1,Y=null,it=null,bt=null;return{setReversed:function(yt){if(_t!==yt){const Ht=t.get("EXT_clip_control");_t?Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.ZERO_TO_ONE_EXT):Ht.clipControlEXT(Ht.LOWER_LEFT_EXT,Ht.NEGATIVE_ONE_TO_ONE_EXT);const ve=bt;bt=null,this.setClear(ve)}_t=yt},getReversed:function(){return _t},setTest:function(yt){yt?tt(i.DEPTH_TEST):ut(i.DEPTH_TEST)},setMask:function(yt){Y!==yt&&!B&&(i.depthMask(yt),Y=yt)},setFunc:function(yt){if(_t&&(yt=Av[yt]),it!==yt){switch(yt){case aa:i.depthFunc(i.NEVER);break;case la:i.depthFunc(i.ALWAYS);break;case ca:i.depthFunc(i.LESS);break;case ns:i.depthFunc(i.LEQUAL);break;case ha:i.depthFunc(i.EQUAL);break;case ua:i.depthFunc(i.GEQUAL);break;case da:i.depthFunc(i.GREATER);break;case fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}it=yt}},setLocked:function(yt){B=yt},setClear:function(yt){bt!==yt&&(_t&&(yt=1-yt),i.clearDepth(yt),bt=yt)},reset:function(){B=!1,Y=null,it=null,bt=null,_t=!1}}}function s(){let B=!1,_t=null,Y=null,it=null,bt=null,yt=null,Ht=null,ve=null,Fe=null;return{setTest:function(re){B||(re?tt(i.STENCIL_TEST):ut(i.STENCIL_TEST))},setMask:function(re){_t!==re&&!B&&(i.stencilMask(re),_t=re)},setFunc:function(re,rn,Rn){(Y!==re||it!==rn||bt!==Rn)&&(i.stencilFunc(re,rn,Rn),Y=re,it=rn,bt=Rn)},setOp:function(re,rn,Rn){(yt!==re||Ht!==rn||ve!==Rn)&&(i.stencilOp(re,rn,Rn),yt=re,Ht=rn,ve=Rn)},setLocked:function(re){B=re},setClear:function(re){Fe!==re&&(i.clearStencil(re),Fe=re)},reset:function(){B=!1,_t=null,Y=null,it=null,bt=null,yt=null,Ht=null,ve=null,Fe=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],p=null,g=!1,m=null,v=null,M=null,_=null,S=null,P=null,A=null,T=new Jt(0,0,0),L=0,x=!1,y=null,E=null,D=null,N=null,F=null;const W=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,z=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(V)[1]),O=z>=1):V.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),O=z>=2);let ot=null,at={};const ht=i.getParameter(i.SCISSOR_BOX),At=i.getParameter(i.VIEWPORT),Tt=new ce().fromArray(ht),q=new ce().fromArray(At);function G(B,_t,Y,it){const bt=new Uint8Array(4),yt=i.createTexture();i.bindTexture(B,yt),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ht=0;Ht<Y;Ht++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(_t,0,i.RGBA,1,1,it,0,i.RGBA,i.UNSIGNED_BYTE,bt):i.texImage2D(_t+Ht,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,bt);return yt}const nt={};nt[i.TEXTURE_2D]=G(i.TEXTURE_2D,i.TEXTURE_2D,1),nt[i.TEXTURE_CUBE_MAP]=G(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),nt[i.TEXTURE_2D_ARRAY]=G(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),nt[i.TEXTURE_3D]=G(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),tt(i.DEPTH_TEST),o.setFunc(ns),J(!1),Mt(jl),tt(i.CULL_FACE),U(ri);function tt(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function ut(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Ct(B,_t){return d[B]!==_t?(i.bindFramebuffer(B,_t),d[B]=_t,B===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=_t),B===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=_t),!0):!1}function Pt(B,_t){let Y=f,it=!1;if(B){Y=u.get(_t),Y===void 0&&(Y=[],u.set(_t,Y));const bt=B.textures;if(Y.length!==bt.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let yt=0,Ht=bt.length;yt<Ht;yt++)Y[yt]=i.COLOR_ATTACHMENT0+yt;Y.length=bt.length,it=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,it=!0);it&&i.drawBuffers(Y)}function Ot(B){return p!==B?(i.useProgram(B),p=B,!0):!1}const et={[_i]:i.FUNC_ADD,[Rd]:i.FUNC_SUBTRACT,[Ld]:i.FUNC_REVERSE_SUBTRACT};et[Pd]=i.MIN,et[Dd]=i.MAX;const ct={[Id]:i.ZERO,[Ud]:i.ONE,[Nd]:i.SRC_COLOR,[ra]:i.SRC_ALPHA,[Vd]:i.SRC_ALPHA_SATURATE,[zd]:i.DST_COLOR,[Od]:i.DST_ALPHA,[Fd]:i.ONE_MINUS_SRC_COLOR,[oa]:i.ONE_MINUS_SRC_ALPHA,[kd]:i.ONE_MINUS_DST_COLOR,[Bd]:i.ONE_MINUS_DST_ALPHA,[Gd]:i.CONSTANT_COLOR,[Hd]:i.ONE_MINUS_CONSTANT_COLOR,[Wd]:i.CONSTANT_ALPHA,[$d]:i.ONE_MINUS_CONSTANT_ALPHA};function U(B,_t,Y,it,bt,yt,Ht,ve,Fe,re){if(B===ri){g===!0&&(ut(i.BLEND),g=!1);return}if(g===!1&&(tt(i.BLEND),g=!0),B!==Cd){if(B!==m||re!==x){if((v!==_i||S!==_i)&&(i.blendEquation(i.FUNC_ADD),v=_i,S=_i),re)switch(B){case Ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xl:i.blendFunc(i.ONE,i.ONE);break;case ql:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Yl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case Ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Xl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case ql:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Yl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}M=null,_=null,P=null,A=null,T.set(0,0,0),L=0,m=B,x=re}return}bt=bt||_t,yt=yt||Y,Ht=Ht||it,(_t!==v||bt!==S)&&(i.blendEquationSeparate(et[_t],et[bt]),v=_t,S=bt),(Y!==M||it!==_||yt!==P||Ht!==A)&&(i.blendFuncSeparate(ct[Y],ct[it],ct[yt],ct[Ht]),M=Y,_=it,P=yt,A=Ht),(ve.equals(T)===!1||Fe!==L)&&(i.blendColor(ve.r,ve.g,ve.b,Fe),T.copy(ve),L=Fe),m=B,x=!1}function Rt(B,_t){B.side===dn?ut(i.CULL_FACE):tt(i.CULL_FACE);let Y=B.side===Xe;_t&&(Y=!Y),J(Y),B.blending===Ki&&B.transparent===!1?U(ri):U(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),r.setMask(B.colorWrite);const it=B.stencilWrite;a.setTest(it),it&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Bt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?tt(i.SAMPLE_ALPHA_TO_COVERAGE):ut(i.SAMPLE_ALPHA_TO_COVERAGE)}function J(B){y!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),y=B)}function Mt(B){B!==wd?(tt(i.CULL_FACE),B!==E&&(B===jl?i.cullFace(i.BACK):B===Ad?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ut(i.CULL_FACE),E=B}function pt(B){B!==D&&(O&&i.lineWidth(B),D=B)}function Bt(B,_t,Y){B?(tt(i.POLYGON_OFFSET_FILL),(N!==_t||F!==Y)&&(i.polygonOffset(_t,Y),N=_t,F=Y)):ut(i.POLYGON_OFFSET_FILL)}function Et(B){B?tt(i.SCISSOR_TEST):ut(i.SCISSOR_TEST)}function R(B){B===void 0&&(B=i.TEXTURE0+W-1),ot!==B&&(i.activeTexture(B),ot=B)}function b(B,_t,Y){Y===void 0&&(ot===null?Y=i.TEXTURE0+W-1:Y=ot);let it=at[Y];it===void 0&&(it={type:void 0,texture:void 0},at[Y]=it),(it.type!==B||it.texture!==_t)&&(ot!==Y&&(i.activeTexture(Y),ot=Y),i.bindTexture(B,_t||nt[B]),it.type=B,it.texture=_t)}function $(){const B=at[ot];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function Z(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function st(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Q(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function K(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function dt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function gt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Gt(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function rt(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function xt(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function zt(B){Tt.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),Tt.copy(B))}function wt(B){q.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),q.copy(B))}function Zt(B,_t){let Y=c.get(_t);Y===void 0&&(Y=new WeakMap,c.set(_t,Y));let it=Y.get(B);it===void 0&&(it=i.getUniformBlockIndex(_t,B.name),Y.set(B,it))}function Xt(B,_t){const it=c.get(_t).get(B);l.get(_t)!==it&&(i.uniformBlockBinding(_t,it,B.__bindingPointIndex),l.set(_t,it))}function he(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ot=null,at={},d={},u=new WeakMap,f=[],p=null,g=!1,m=null,v=null,M=null,_=null,S=null,P=null,A=null,T=new Jt(0,0,0),L=0,x=!1,y=null,E=null,D=null,N=null,F=null,Tt.set(0,0,i.canvas.width,i.canvas.height),q.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:tt,disable:ut,bindFramebuffer:Ct,drawBuffers:Pt,useProgram:Ot,setBlending:U,setMaterial:Rt,setFlipSided:J,setCullFace:Mt,setLineWidth:pt,setPolygonOffset:Bt,setScissorTest:Et,activeTexture:R,bindTexture:b,unbindTexture:$,compressedTexImage2D:Z,compressedTexImage3D:st,texImage2D:xt,texImage3D:Dt,updateUBOMapping:Zt,uniformBlockBinding:Xt,texStorage2D:Gt,texStorage3D:rt,texSubImage2D:Q,texSubImage3D:K,compressedTexSubImage2D:dt,compressedTexSubImage3D:gt,scissor:zt,viewport:wt,reset:he}}function Hc(i,t,e,n){const s=Cv(n);switch(e){case tu:return i*t;case nu:return i*t;case iu:return i*t*2;case su:return i*t/s.components*s.byteLength;case vl:return i*t/s.components*s.byteLength;case ru:return i*t*2/s.components*s.byteLength;case _l:return i*t*2/s.components*s.byteLength;case eu:return i*t*3/s.components*s.byteLength;case mn:return i*t*4/s.components*s.byteLength;case xl:return i*t*4/s.components*s.byteLength;case Pr:case Dr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ir:case Ur:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case xa:case Sa:return Math.max(i,16)*Math.max(t,8)/4;case _a:case ya:return Math.max(i,8)*Math.max(t,8)/2;case Ma:case ba:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ea:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Aa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ta:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ca:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Ra:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case La:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Pa:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Da:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ia:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Na:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Fa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Oa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ba:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Nr:case za:case ka:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ou:case Va:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ga:case Ha:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Cv(i){switch(i){case Gn:case Zh:return{byteLength:1,components:1};case Ns:case Kh:case Vs:return{byteLength:2,components:1};case ml:case gl:return{byteLength:2,components:4};case bi:case pl:case zn:return{byteLength:4,components:1};case Qh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function Rv(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new vt,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(R,b){return f?new OffscreenCanvas(R,b):Wr("canvas")}function g(R,b,$){let Z=1;const st=Et(R);if((st.width>$||st.height>$)&&(Z=$/Math.max(st.width,st.height)),Z<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Q=Math.floor(Z*st.width),K=Math.floor(Z*st.height);d===void 0&&(d=p(Q,K));const dt=b?p(Q,K):d;return dt.width=Q,dt.height=K,dt.getContext("2d").drawImage(R,0,0,Q,K),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+Q+"x"+K+")."),dt}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),R;return R}function m(R){return R.generateMipmaps}function v(R){i.generateMipmap(R)}function M(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(R,b,$,Z,st=!1){if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Q=b;if(b===i.RED&&($===i.FLOAT&&(Q=i.R32F),$===i.HALF_FLOAT&&(Q=i.R16F),$===i.UNSIGNED_BYTE&&(Q=i.R8)),b===i.RED_INTEGER&&($===i.UNSIGNED_BYTE&&(Q=i.R8UI),$===i.UNSIGNED_SHORT&&(Q=i.R16UI),$===i.UNSIGNED_INT&&(Q=i.R32UI),$===i.BYTE&&(Q=i.R8I),$===i.SHORT&&(Q=i.R16I),$===i.INT&&(Q=i.R32I)),b===i.RG&&($===i.FLOAT&&(Q=i.RG32F),$===i.HALF_FLOAT&&(Q=i.RG16F),$===i.UNSIGNED_BYTE&&(Q=i.RG8)),b===i.RG_INTEGER&&($===i.UNSIGNED_BYTE&&(Q=i.RG8UI),$===i.UNSIGNED_SHORT&&(Q=i.RG16UI),$===i.UNSIGNED_INT&&(Q=i.RG32UI),$===i.BYTE&&(Q=i.RG8I),$===i.SHORT&&(Q=i.RG16I),$===i.INT&&(Q=i.RG32I)),b===i.RGB_INTEGER&&($===i.UNSIGNED_BYTE&&(Q=i.RGB8UI),$===i.UNSIGNED_SHORT&&(Q=i.RGB16UI),$===i.UNSIGNED_INT&&(Q=i.RGB32UI),$===i.BYTE&&(Q=i.RGB8I),$===i.SHORT&&(Q=i.RGB16I),$===i.INT&&(Q=i.RGB32I)),b===i.RGBA_INTEGER&&($===i.UNSIGNED_BYTE&&(Q=i.RGBA8UI),$===i.UNSIGNED_SHORT&&(Q=i.RGBA16UI),$===i.UNSIGNED_INT&&(Q=i.RGBA32UI),$===i.BYTE&&(Q=i.RGBA8I),$===i.SHORT&&(Q=i.RGBA16I),$===i.INT&&(Q=i.RGBA32I)),b===i.RGB&&$===i.UNSIGNED_INT_5_9_9_9_REV&&(Q=i.RGB9_E5),b===i.RGBA){const K=st?eo:Qt.getTransfer(Z);$===i.FLOAT&&(Q=i.RGBA32F),$===i.HALF_FLOAT&&(Q=i.RGBA16F),$===i.UNSIGNED_BYTE&&(Q=K===le?i.SRGB8_ALPHA8:i.RGBA8),$===i.UNSIGNED_SHORT_4_4_4_4&&(Q=i.RGBA4),$===i.UNSIGNED_SHORT_5_5_5_1&&(Q=i.RGB5_A1)}return(Q===i.R16F||Q===i.R32F||Q===i.RG16F||Q===i.RG32F||Q===i.RGBA16F||Q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Q}function S(R,b){let $;return R?b===null||b===bi||b===rs?$=i.DEPTH24_STENCIL8:b===zn?$=i.DEPTH32F_STENCIL8:b===Ns&&($=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===bi||b===rs?$=i.DEPTH_COMPONENT24:b===zn?$=i.DEPTH_COMPONENT32F:b===Ns&&($=i.DEPTH_COMPONENT16),$}function P(R,b){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==gn&&R.minFilter!==wn?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function A(R){const b=R.target;b.removeEventListener("dispose",A),L(b),b.isVideoTexture&&h.delete(b)}function T(R){const b=R.target;b.removeEventListener("dispose",T),y(b)}function L(R){const b=n.get(R);if(b.__webglInit===void 0)return;const $=R.source,Z=u.get($);if(Z){const st=Z[b.__cacheKey];st.usedTimes--,st.usedTimes===0&&x(R),Object.keys(Z).length===0&&u.delete($)}n.remove(R)}function x(R){const b=n.get(R);i.deleteTexture(b.__webglTexture);const $=R.source,Z=u.get($);delete Z[b.__cacheKey],o.memory.textures--}function y(R){const b=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(b.__webglFramebuffer[Z]))for(let st=0;st<b.__webglFramebuffer[Z].length;st++)i.deleteFramebuffer(b.__webglFramebuffer[Z][st]);else i.deleteFramebuffer(b.__webglFramebuffer[Z]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[Z])}else{if(Array.isArray(b.__webglFramebuffer))for(let Z=0;Z<b.__webglFramebuffer.length;Z++)i.deleteFramebuffer(b.__webglFramebuffer[Z]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Z=0;Z<b.__webglColorRenderbuffer.length;Z++)b.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[Z]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const $=R.textures;for(let Z=0,st=$.length;Z<st;Z++){const Q=n.get($[Z]);Q.__webglTexture&&(i.deleteTexture(Q.__webglTexture),o.memory.textures--),n.remove($[Z])}n.remove(R)}let E=0;function D(){E=0}function N(){const R=E;return R>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+s.maxTextures),E+=1,R}function F(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function W(R,b){const $=n.get(R);if(R.isVideoTexture&&pt(R),R.isRenderTargetTexture===!1&&R.version>0&&$.__version!==R.version){const Z=R.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q($,R,b);return}}e.bindTexture(i.TEXTURE_2D,$.__webglTexture,i.TEXTURE0+b)}function O(R,b){const $=n.get(R);if(R.version>0&&$.__version!==R.version){q($,R,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,$.__webglTexture,i.TEXTURE0+b)}function z(R,b){const $=n.get(R);if(R.version>0&&$.__version!==R.version){q($,R,b);return}e.bindTexture(i.TEXTURE_3D,$.__webglTexture,i.TEXTURE0+b)}function V(R,b){const $=n.get(R);if(R.version>0&&$.__version!==R.version){G($,R,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture,i.TEXTURE0+b)}const ot={[ga]:i.REPEAT,[yi]:i.CLAMP_TO_EDGE,[va]:i.MIRRORED_REPEAT},at={[gn]:i.NEAREST,[ef]:i.NEAREST_MIPMAP_NEAREST,[qs]:i.NEAREST_MIPMAP_LINEAR,[wn]:i.LINEAR,[ho]:i.LINEAR_MIPMAP_NEAREST,[Si]:i.LINEAR_MIPMAP_LINEAR},ht={[of]:i.NEVER,[df]:i.ALWAYS,[af]:i.LESS,[lu]:i.LEQUAL,[lf]:i.EQUAL,[uf]:i.GEQUAL,[cf]:i.GREATER,[hf]:i.NOTEQUAL};function At(R,b){if(b.type===zn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===wn||b.magFilter===ho||b.magFilter===qs||b.magFilter===Si||b.minFilter===wn||b.minFilter===ho||b.minFilter===qs||b.minFilter===Si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,ot[b.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,ot[b.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,ot[b.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,at[b.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,at[b.minFilter]),b.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,ht[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===gn||b.minFilter!==qs&&b.minFilter!==Si||b.type===zn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Tt(R,b){let $=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",A));const Z=b.source;let st=u.get(Z);st===void 0&&(st={},u.set(Z,st));const Q=F(b);if(Q!==R.__cacheKey){st[Q]===void 0&&(st[Q]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,$=!0),st[Q].usedTimes++;const K=st[R.__cacheKey];K!==void 0&&(st[R.__cacheKey].usedTimes--,K.usedTimes===0&&x(b)),R.__cacheKey=Q,R.__webglTexture=st[Q].texture}return $}function q(R,b,$){let Z=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Z=i.TEXTURE_3D);const st=Tt(R,b),Q=b.source;e.bindTexture(Z,R.__webglTexture,i.TEXTURE0+$);const K=n.get(Q);if(Q.version!==K.__version||st===!0){e.activeTexture(i.TEXTURE0+$);const dt=Qt.getPrimaries(Qt.workingColorSpace),gt=b.colorSpace===ti?null:Qt.getPrimaries(b.colorSpace),Gt=b.colorSpace===ti||dt===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);let rt=g(b.image,!1,s.maxTextureSize);rt=Bt(b,rt);const xt=r.convert(b.format,b.colorSpace),Dt=r.convert(b.type);let zt=_(b.internalFormat,xt,Dt,b.colorSpace,b.isVideoTexture);At(Z,b);let wt;const Zt=b.mipmaps,Xt=b.isVideoTexture!==!0,he=K.__version===void 0||st===!0,B=Q.dataReady,_t=P(b,rt);if(b.isDepthTexture)zt=S(b.format===os,b.type),he&&(Xt?e.texStorage2D(i.TEXTURE_2D,1,zt,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,zt,rt.width,rt.height,0,xt,Dt,null));else if(b.isDataTexture)if(Zt.length>0){Xt&&he&&e.texStorage2D(i.TEXTURE_2D,_t,zt,Zt[0].width,Zt[0].height);for(let Y=0,it=Zt.length;Y<it;Y++)wt=Zt[Y],Xt?B&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,wt.width,wt.height,xt,Dt,wt.data):e.texImage2D(i.TEXTURE_2D,Y,zt,wt.width,wt.height,0,xt,Dt,wt.data);b.generateMipmaps=!1}else Xt?(he&&e.texStorage2D(i.TEXTURE_2D,_t,zt,rt.width,rt.height),B&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt.width,rt.height,xt,Dt,rt.data)):e.texImage2D(i.TEXTURE_2D,0,zt,rt.width,rt.height,0,xt,Dt,rt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Xt&&he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,_t,zt,Zt[0].width,Zt[0].height,rt.depth);for(let Y=0,it=Zt.length;Y<it;Y++)if(wt=Zt[Y],b.format!==mn)if(xt!==null)if(Xt){if(B)if(b.layerUpdates.size>0){const bt=Hc(wt.width,wt.height,b.format,b.type);for(const yt of b.layerUpdates){const Ht=wt.data.subarray(yt*bt/wt.data.BYTES_PER_ELEMENT,(yt+1)*bt/wt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,yt,wt.width,wt.height,1,xt,Ht)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,wt.width,wt.height,rt.depth,xt,wt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,zt,wt.width,wt.height,rt.depth,0,wt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xt?B&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,wt.width,wt.height,rt.depth,xt,Dt,wt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,zt,wt.width,wt.height,rt.depth,0,xt,Dt,wt.data)}else{Xt&&he&&e.texStorage2D(i.TEXTURE_2D,_t,zt,Zt[0].width,Zt[0].height);for(let Y=0,it=Zt.length;Y<it;Y++)wt=Zt[Y],b.format!==mn?xt!==null?Xt?B&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,wt.width,wt.height,xt,wt.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,zt,wt.width,wt.height,0,wt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?B&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,wt.width,wt.height,xt,Dt,wt.data):e.texImage2D(i.TEXTURE_2D,Y,zt,wt.width,wt.height,0,xt,Dt,wt.data)}else if(b.isDataArrayTexture)if(Xt){if(he&&e.texStorage3D(i.TEXTURE_2D_ARRAY,_t,zt,rt.width,rt.height,rt.depth),B)if(b.layerUpdates.size>0){const Y=Hc(rt.width,rt.height,b.format,b.type);for(const it of b.layerUpdates){const bt=rt.data.subarray(it*Y/rt.data.BYTES_PER_ELEMENT,(it+1)*Y/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,it,rt.width,rt.height,1,xt,Dt,bt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,xt,Dt,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,zt,rt.width,rt.height,rt.depth,0,xt,Dt,rt.data);else if(b.isData3DTexture)Xt?(he&&e.texStorage3D(i.TEXTURE_3D,_t,zt,rt.width,rt.height,rt.depth),B&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,xt,Dt,rt.data)):e.texImage3D(i.TEXTURE_3D,0,zt,rt.width,rt.height,rt.depth,0,xt,Dt,rt.data);else if(b.isFramebufferTexture){if(he)if(Xt)e.texStorage2D(i.TEXTURE_2D,_t,zt,rt.width,rt.height);else{let Y=rt.width,it=rt.height;for(let bt=0;bt<_t;bt++)e.texImage2D(i.TEXTURE_2D,bt,zt,Y,it,0,xt,Dt,null),Y>>=1,it>>=1}}else if(Zt.length>0){if(Xt&&he){const Y=Et(Zt[0]);e.texStorage2D(i.TEXTURE_2D,_t,zt,Y.width,Y.height)}for(let Y=0,it=Zt.length;Y<it;Y++)wt=Zt[Y],Xt?B&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,xt,Dt,wt):e.texImage2D(i.TEXTURE_2D,Y,zt,xt,Dt,wt);b.generateMipmaps=!1}else if(Xt){if(he){const Y=Et(rt);e.texStorage2D(i.TEXTURE_2D,_t,zt,Y.width,Y.height)}B&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,xt,Dt,rt)}else e.texImage2D(i.TEXTURE_2D,0,zt,xt,Dt,rt);m(b)&&v(Z),K.__version=Q.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function G(R,b,$){if(b.image.length!==6)return;const Z=Tt(R,b),st=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+$);const Q=n.get(st);if(st.version!==Q.__version||Z===!0){e.activeTexture(i.TEXTURE0+$);const K=Qt.getPrimaries(Qt.workingColorSpace),dt=b.colorSpace===ti?null:Qt.getPrimaries(b.colorSpace),gt=b.colorSpace===ti||K===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const Gt=b.isCompressedTexture||b.image[0].isCompressedTexture,rt=b.image[0]&&b.image[0].isDataTexture,xt=[];for(let it=0;it<6;it++)!Gt&&!rt?xt[it]=g(b.image[it],!0,s.maxCubemapSize):xt[it]=rt?b.image[it].image:b.image[it],xt[it]=Bt(b,xt[it]);const Dt=xt[0],zt=r.convert(b.format,b.colorSpace),wt=r.convert(b.type),Zt=_(b.internalFormat,zt,wt,b.colorSpace),Xt=b.isVideoTexture!==!0,he=Q.__version===void 0||Z===!0,B=st.dataReady;let _t=P(b,Dt);At(i.TEXTURE_CUBE_MAP,b);let Y;if(Gt){Xt&&he&&e.texStorage2D(i.TEXTURE_CUBE_MAP,_t,Zt,Dt.width,Dt.height);for(let it=0;it<6;it++){Y=xt[it].mipmaps;for(let bt=0;bt<Y.length;bt++){const yt=Y[bt];b.format!==mn?zt!==null?Xt?B&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt,0,0,yt.width,yt.height,zt,yt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt,Zt,yt.width,yt.height,0,yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Xt?B&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt,0,0,yt.width,yt.height,zt,wt,yt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt,Zt,yt.width,yt.height,0,zt,wt,yt.data)}}}else{if(Y=b.mipmaps,Xt&&he){Y.length>0&&_t++;const it=Et(xt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,_t,Zt,it.width,it.height)}for(let it=0;it<6;it++)if(rt){Xt?B&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,xt[it].width,xt[it].height,zt,wt,xt[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Zt,xt[it].width,xt[it].height,0,zt,wt,xt[it].data);for(let bt=0;bt<Y.length;bt++){const Ht=Y[bt].image[it].image;Xt?B&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt+1,0,0,Ht.width,Ht.height,zt,wt,Ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt+1,Zt,Ht.width,Ht.height,0,zt,wt,Ht.data)}}else{Xt?B&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,zt,wt,xt[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,Zt,zt,wt,xt[it]);for(let bt=0;bt<Y.length;bt++){const yt=Y[bt];Xt?B&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt+1,0,0,zt,wt,yt.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,bt+1,Zt,zt,wt,yt.image[it])}}}m(b)&&v(i.TEXTURE_CUBE_MAP),Q.__version=st.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function nt(R,b,$,Z,st,Q){const K=r.convert($.format,$.colorSpace),dt=r.convert($.type),gt=_($.internalFormat,K,dt,$.colorSpace),Gt=n.get(b),rt=n.get($);if(rt.__renderTarget=b,!Gt.__hasExternalTextures){const xt=Math.max(1,b.width>>Q),Dt=Math.max(1,b.height>>Q);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,Q,gt,xt,Dt,b.depth,0,K,dt,null):e.texImage2D(st,Q,gt,xt,Dt,0,K,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),Mt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,st,rt.__webglTexture,0,J(b)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,st,rt.__webglTexture,Q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function tt(R,b,$){if(i.bindRenderbuffer(i.RENDERBUFFER,R),b.depthBuffer){const Z=b.depthTexture,st=Z&&Z.isDepthTexture?Z.type:null,Q=S(b.stencilBuffer,st),K=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=J(b);Mt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,Q,b.width,b.height):$?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,Q,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Q,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,R)}else{const Z=b.textures;for(let st=0;st<Z.length;st++){const Q=Z[st],K=r.convert(Q.format,Q.colorSpace),dt=r.convert(Q.type),gt=_(Q.internalFormat,K,dt,Q.colorSpace),Gt=J(b);$&&Mt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Gt,gt,b.width,b.height):Mt(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Gt,gt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,gt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ut(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(b.depthTexture);Z.__renderTarget=b,(!Z.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),W(b.depthTexture,0);const st=Z.__webglTexture,Q=J(b);if(b.depthTexture.format===Qi)Mt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0);else if(b.depthTexture.format===os)Mt(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function Ct(R){const b=n.get(R),$=R.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==R.depthTexture){const Z=R.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Z){const st=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Z.removeEventListener("dispose",st)};Z.addEventListener("dispose",st),b.__depthDisposeCallback=st}b.__boundDepthTexture=Z}if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");ut(b.__webglFramebuffer,R)}else if($){b.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[Z]),b.__webglDepthbuffer[Z]===void 0)b.__webglDepthbuffer[Z]=i.createRenderbuffer(),tt(b.__webglDepthbuffer[Z],R,!1);else{const st=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Q=b.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,Q),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,Q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),tt(b.__webglDepthbuffer,R,!1);else{const Z=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,st),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,st)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Pt(R,b,$){const Z=n.get(R);b!==void 0&&nt(Z.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),$!==void 0&&Ct(R)}function Ot(R){const b=R.texture,$=n.get(R),Z=n.get(b);R.addEventListener("dispose",T);const st=R.textures,Q=R.isWebGLCubeRenderTarget===!0,K=st.length>1;if(K||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=b.version,o.memory.textures++),Q){$.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(b.mipmaps&&b.mipmaps.length>0){$.__webglFramebuffer[dt]=[];for(let gt=0;gt<b.mipmaps.length;gt++)$.__webglFramebuffer[dt][gt]=i.createFramebuffer()}else $.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){$.__webglFramebuffer=[];for(let dt=0;dt<b.mipmaps.length;dt++)$.__webglFramebuffer[dt]=i.createFramebuffer()}else $.__webglFramebuffer=i.createFramebuffer();if(K)for(let dt=0,gt=st.length;dt<gt;dt++){const Gt=n.get(st[dt]);Gt.__webglTexture===void 0&&(Gt.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Mt(R)===!1){$.__webglMultisampledFramebuffer=i.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let dt=0;dt<st.length;dt++){const gt=st[dt];$.__webglColorRenderbuffer[dt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,$.__webglColorRenderbuffer[dt]);const Gt=r.convert(gt.format,gt.colorSpace),rt=r.convert(gt.type),xt=_(gt.internalFormat,Gt,rt,gt.colorSpace,R.isXRRenderTarget===!0),Dt=J(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,xt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,$.__webglColorRenderbuffer[dt])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&($.__webglDepthRenderbuffer=i.createRenderbuffer(),tt($.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Q){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),At(i.TEXTURE_CUBE_MAP,b);for(let dt=0;dt<6;dt++)if(b.mipmaps&&b.mipmaps.length>0)for(let gt=0;gt<b.mipmaps.length;gt++)nt($.__webglFramebuffer[dt][gt],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,gt);else nt($.__webglFramebuffer[dt],R,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);m(b)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(K){for(let dt=0,gt=st.length;dt<gt;dt++){const Gt=st[dt],rt=n.get(Gt);e.bindTexture(i.TEXTURE_2D,rt.__webglTexture),At(i.TEXTURE_2D,Gt),nt($.__webglFramebuffer,R,Gt,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,0),m(Gt)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(dt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,Z.__webglTexture),At(dt,b),b.mipmaps&&b.mipmaps.length>0)for(let gt=0;gt<b.mipmaps.length;gt++)nt($.__webglFramebuffer[gt],R,b,i.COLOR_ATTACHMENT0,dt,gt);else nt($.__webglFramebuffer,R,b,i.COLOR_ATTACHMENT0,dt,0);m(b)&&v(dt),e.unbindTexture()}R.depthBuffer&&Ct(R)}function et(R){const b=R.textures;for(let $=0,Z=b.length;$<Z;$++){const st=b[$];if(m(st)){const Q=M(R),K=n.get(st).__webglTexture;e.bindTexture(Q,K),v(Q),e.unbindTexture()}}}const ct=[],U=[];function Rt(R){if(R.samples>0){if(Mt(R)===!1){const b=R.textures,$=R.width,Z=R.height;let st=i.COLOR_BUFFER_BIT;const Q=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=n.get(R),dt=b.length>1;if(dt)for(let gt=0;gt<b.length;gt++)e.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,K.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,K.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,K.__webglFramebuffer);for(let gt=0;gt<b.length;gt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),dt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,K.__webglColorRenderbuffer[gt]);const Gt=n.get(b[gt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Gt,0)}i.blitFramebuffer(0,0,$,Z,0,0,$,Z,st,i.NEAREST),l===!0&&(ct.length=0,U.length=0,ct.push(i.COLOR_ATTACHMENT0+gt),R.depthBuffer&&R.resolveDepthBuffer===!1&&(ct.push(Q),U.push(Q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,U)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),dt)for(let gt=0;gt<b.length;gt++){e.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,K.__webglColorRenderbuffer[gt]);const Gt=n.get(b[gt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,K.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,Gt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,K.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const b=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function J(R){return Math.min(s.maxSamples,R.samples)}function Mt(R){const b=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function pt(R){const b=o.render.frame;h.get(R)!==b&&(h.set(R,b),R.update())}function Bt(R,b){const $=R.colorSpace,Z=R.format,st=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||$!==cs&&$!==ti&&(Qt.getTransfer($)===le?(Z!==mn||st!==Gn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),b}function Et(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=N,this.resetTextureUnits=D,this.setTexture2D=W,this.setTexture2DArray=O,this.setTexture3D=z,this.setTextureCube=V,this.rebindTextures=Pt,this.setupRenderTarget=Ot,this.updateRenderTargetMipmap=et,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=Ct,this.setupFrameBufferTexture=nt,this.useMultisampledRTT=Mt}function Lv(i,t){function e(n,s=ti){let r;const o=Qt.getTransfer(s);if(n===Gn)return i.UNSIGNED_BYTE;if(n===ml)return i.UNSIGNED_SHORT_4_4_4_4;if(n===gl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Qh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Zh)return i.BYTE;if(n===Kh)return i.SHORT;if(n===Ns)return i.UNSIGNED_SHORT;if(n===pl)return i.INT;if(n===bi)return i.UNSIGNED_INT;if(n===zn)return i.FLOAT;if(n===Vs)return i.HALF_FLOAT;if(n===tu)return i.ALPHA;if(n===eu)return i.RGB;if(n===mn)return i.RGBA;if(n===nu)return i.LUMINANCE;if(n===iu)return i.LUMINANCE_ALPHA;if(n===Qi)return i.DEPTH_COMPONENT;if(n===os)return i.DEPTH_STENCIL;if(n===su)return i.RED;if(n===vl)return i.RED_INTEGER;if(n===ru)return i.RG;if(n===_l)return i.RG_INTEGER;if(n===xl)return i.RGBA_INTEGER;if(n===Pr||n===Dr||n===Ir||n===Ur)if(o===le)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Pr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ur)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Pr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Dr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ir)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ur)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===_a||n===xa||n===ya||n===Sa)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===_a)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===xa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ya)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Sa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ma||n===ba||n===Ea)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ma||n===ba)return o===le?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ea)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===wa||n===Aa||n===Ta||n===Ca||n===Ra||n===La||n===Pa||n===Da||n===Ia||n===Ua||n===Na||n===Fa||n===Oa||n===Ba)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===wa)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Aa)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ta)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ca)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ra)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===La)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Pa)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Da)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ia)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ua)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Na)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fa)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Oa)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ba)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Nr||n===za||n===ka)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Nr)return o===le?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ka)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ou||n===Va||n===Ga||n===Ha)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Nr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Va)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ga)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ha)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===rs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Pv extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Mn extends be{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Dv={type:"move"};class Bo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Mn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Mn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Mn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),v=this._getHandJoint(c,g);m!==null&&(v.matrix.fromArray(m.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=m.radius),v.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Dv)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Mn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Iv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Uv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Nv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ge,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Hn({vertexShader:Iv,fragmentShader:Uv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Te(new no(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Fv extends hs{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null;const g=new Nv,m=e.getContextAttributes();let v=null,M=null;const _=[],S=[],P=new vt;let A=null;const T=new nn;T.viewport=new ce;const L=new nn;L.viewport=new ce;const x=[T,L],y=new Pv;let E=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let G=_[q];return G===void 0&&(G=new Bo,_[q]=G),G.getTargetRaySpace()},this.getControllerGrip=function(q){let G=_[q];return G===void 0&&(G=new Bo,_[q]=G),G.getGripSpace()},this.getHand=function(q){let G=_[q];return G===void 0&&(G=new Bo,_[q]=G),G.getHandSpace()};function N(q){const G=S.indexOf(q.inputSource);if(G===-1)return;const nt=_[G];nt!==void 0&&(nt.update(q.inputSource,q.frame,c||o),nt.dispatchEvent({type:q.type,data:q.inputSource}))}function F(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",W);for(let q=0;q<_.length;q++){const G=S[q];G!==null&&(S[q]=null,_[q].disconnect(G))}E=null,D=null,g.reset(),t.setRenderTarget(v),f=null,u=null,d=null,s=null,M=null,Tt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){r=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",F),s.addEventListener("inputsourceschange",W),m.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(P),s.renderState.layers===void 0){const G={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,G),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new Ei(f.framebufferWidth,f.framebufferHeight,{format:mn,type:Gn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let G=null,nt=null,tt=null;m.depth&&(tt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,G=m.stencil?os:Qi,nt=m.stencil?rs:bi);const ut={colorFormat:e.RGBA8,depthFormat:tt,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(ut),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new Ei(u.textureWidth,u.textureHeight,{format:mn,type:Gn,depthTexture:new xu(u.textureWidth,u.textureHeight,nt,void 0,void 0,void 0,void 0,void 0,void 0,G),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Tt.setContext(s),Tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function W(q){for(let G=0;G<q.removed.length;G++){const nt=q.removed[G],tt=S.indexOf(nt);tt>=0&&(S[tt]=null,_[tt].disconnect(nt))}for(let G=0;G<q.added.length;G++){const nt=q.added[G];let tt=S.indexOf(nt);if(tt===-1){for(let Ct=0;Ct<_.length;Ct++)if(Ct>=S.length){S.push(nt),tt=Ct;break}else if(S[Ct]===null){S[Ct]=nt,tt=Ct;break}if(tt===-1)break}const ut=_[tt];ut&&ut.connect(nt)}}const O=new I,z=new I;function V(q,G,nt){O.setFromMatrixPosition(G.matrixWorld),z.setFromMatrixPosition(nt.matrixWorld);const tt=O.distanceTo(z),ut=G.projectionMatrix.elements,Ct=nt.projectionMatrix.elements,Pt=ut[14]/(ut[10]-1),Ot=ut[14]/(ut[10]+1),et=(ut[9]+1)/ut[5],ct=(ut[9]-1)/ut[5],U=(ut[8]-1)/ut[0],Rt=(Ct[8]+1)/Ct[0],J=Pt*U,Mt=Pt*Rt,pt=tt/(-U+Rt),Bt=pt*-U;if(G.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Bt),q.translateZ(pt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),ut[10]===-1)q.projectionMatrix.copy(G.projectionMatrix),q.projectionMatrixInverse.copy(G.projectionMatrixInverse);else{const Et=Pt+pt,R=Ot+pt,b=J-Bt,$=Mt+(tt-Bt),Z=et*Ot/R*Et,st=ct*Ot/R*Et;q.projectionMatrix.makePerspective(b,$,Z,st,Et,R),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function ot(q,G){G===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(G.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let G=q.near,nt=q.far;g.texture!==null&&(g.depthNear>0&&(G=g.depthNear),g.depthFar>0&&(nt=g.depthFar)),y.near=L.near=T.near=G,y.far=L.far=T.far=nt,(E!==y.near||D!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),E=y.near,D=y.far),T.layers.mask=q.layers.mask|2,L.layers.mask=q.layers.mask|4,y.layers.mask=T.layers.mask|L.layers.mask;const tt=q.parent,ut=y.cameras;ot(y,tt);for(let Ct=0;Ct<ut.length;Ct++)ot(ut[Ct],tt);ut.length===2?V(y,T,L):y.projectionMatrix.copy(T.projectionMatrix),at(q,y,tt)};function at(q,G,nt){nt===null?q.matrix.copy(G.matrixWorld):(q.matrix.copy(nt.matrixWorld),q.matrix.invert(),q.matrix.multiply(G.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(G.projectionMatrix),q.projectionMatrixInverse.copy(G.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Fs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(q){l=q,u!==null&&(u.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(y)};let ht=null;function At(q,G){if(h=G.getViewerPose(c||o),p=G,h!==null){const nt=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let tt=!1;nt.length!==y.cameras.length&&(y.cameras.length=0,tt=!0);for(let Ct=0;Ct<nt.length;Ct++){const Pt=nt[Ct];let Ot=null;if(f!==null)Ot=f.getViewport(Pt);else{const ct=d.getViewSubImage(u,Pt);Ot=ct.viewport,Ct===0&&(t.setRenderTargetTextures(M,ct.colorTexture,u.ignoreDepthValues?void 0:ct.depthStencilTexture),t.setRenderTarget(M))}let et=x[Ct];et===void 0&&(et=new nn,et.layers.enable(Ct),et.viewport=new ce,x[Ct]=et),et.matrix.fromArray(Pt.transform.matrix),et.matrix.decompose(et.position,et.quaternion,et.scale),et.projectionMatrix.fromArray(Pt.projectionMatrix),et.projectionMatrixInverse.copy(et.projectionMatrix).invert(),et.viewport.set(Ot.x,Ot.y,Ot.width,Ot.height),Ct===0&&(y.matrix.copy(et.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),tt===!0&&y.cameras.push(et)}const ut=s.enabledFeatures;if(ut&&ut.includes("depth-sensing")){const Ct=d.getDepthInformation(nt[0]);Ct&&Ct.isValid&&Ct.texture&&g.init(t,Ct,s.renderState)}}for(let nt=0;nt<_.length;nt++){const tt=S[nt],ut=_[nt];tt!==null&&ut!==void 0&&ut.update(tt,G,c||o)}ht&&ht(q,G),G.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:G}),p=null}const Tt=new _u;Tt.setAnimationLoop(At),this.setAnimationLoop=function(q){ht=q},this.dispose=function(){}}}const pi=new Tn,Ov=new ae;function Bv(i,t){function e(m,v){m.matrixAutoUpdate===!0&&m.updateMatrix(),v.value.copy(m.matrix)}function n(m,v){v.color.getRGB(m.fogColor.value,mu(i)),v.isFog?(m.fogNear.value=v.near,m.fogFar.value=v.far):v.isFogExp2&&(m.fogDensity.value=v.density)}function s(m,v,M,_,S){v.isMeshBasicMaterial||v.isMeshLambertMaterial?r(m,v):v.isMeshToonMaterial?(r(m,v),d(m,v)):v.isMeshPhongMaterial?(r(m,v),h(m,v)):v.isMeshStandardMaterial?(r(m,v),u(m,v),v.isMeshPhysicalMaterial&&f(m,v,S)):v.isMeshMatcapMaterial?(r(m,v),p(m,v)):v.isMeshDepthMaterial?r(m,v):v.isMeshDistanceMaterial?(r(m,v),g(m,v)):v.isMeshNormalMaterial?r(m,v):v.isLineBasicMaterial?(o(m,v),v.isLineDashedMaterial&&a(m,v)):v.isPointsMaterial?l(m,v,M,_):v.isSpriteMaterial?c(m,v):v.isShadowMaterial?(m.color.value.copy(v.color),m.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(m,v){m.opacity.value=v.opacity,v.color&&m.diffuse.value.copy(v.color),v.emissive&&m.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(m.map.value=v.map,e(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.bumpMap&&(m.bumpMap.value=v.bumpMap,e(v.bumpMap,m.bumpMapTransform),m.bumpScale.value=v.bumpScale,v.side===Xe&&(m.bumpScale.value*=-1)),v.normalMap&&(m.normalMap.value=v.normalMap,e(v.normalMap,m.normalMapTransform),m.normalScale.value.copy(v.normalScale),v.side===Xe&&m.normalScale.value.negate()),v.displacementMap&&(m.displacementMap.value=v.displacementMap,e(v.displacementMap,m.displacementMapTransform),m.displacementScale.value=v.displacementScale,m.displacementBias.value=v.displacementBias),v.emissiveMap&&(m.emissiveMap.value=v.emissiveMap,e(v.emissiveMap,m.emissiveMapTransform)),v.specularMap&&(m.specularMap.value=v.specularMap,e(v.specularMap,m.specularMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest);const M=t.get(v),_=M.envMap,S=M.envMapRotation;_&&(m.envMap.value=_,pi.copy(S),pi.x*=-1,pi.y*=-1,pi.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),m.envMapRotation.value.setFromMatrix4(Ov.makeRotationFromEuler(pi)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=v.reflectivity,m.ior.value=v.ior,m.refractionRatio.value=v.refractionRatio),v.lightMap&&(m.lightMap.value=v.lightMap,m.lightMapIntensity.value=v.lightMapIntensity,e(v.lightMap,m.lightMapTransform)),v.aoMap&&(m.aoMap.value=v.aoMap,m.aoMapIntensity.value=v.aoMapIntensity,e(v.aoMap,m.aoMapTransform))}function o(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,v.map&&(m.map.value=v.map,e(v.map,m.mapTransform))}function a(m,v){m.dashSize.value=v.dashSize,m.totalSize.value=v.dashSize+v.gapSize,m.scale.value=v.scale}function l(m,v,M,_){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.size.value=v.size*M,m.scale.value=_*.5,v.map&&(m.map.value=v.map,e(v.map,m.uvTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function c(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.rotation.value=v.rotation,v.map&&(m.map.value=v.map,e(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function h(m,v){m.specular.value.copy(v.specular),m.shininess.value=Math.max(v.shininess,1e-4)}function d(m,v){v.gradientMap&&(m.gradientMap.value=v.gradientMap)}function u(m,v){m.metalness.value=v.metalness,v.metalnessMap&&(m.metalnessMap.value=v.metalnessMap,e(v.metalnessMap,m.metalnessMapTransform)),m.roughness.value=v.roughness,v.roughnessMap&&(m.roughnessMap.value=v.roughnessMap,e(v.roughnessMap,m.roughnessMapTransform)),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)}function f(m,v,M){m.ior.value=v.ior,v.sheen>0&&(m.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),m.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(m.sheenColorMap.value=v.sheenColorMap,e(v.sheenColorMap,m.sheenColorMapTransform)),v.sheenRoughnessMap&&(m.sheenRoughnessMap.value=v.sheenRoughnessMap,e(v.sheenRoughnessMap,m.sheenRoughnessMapTransform))),v.clearcoat>0&&(m.clearcoat.value=v.clearcoat,m.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(m.clearcoatMap.value=v.clearcoatMap,e(v.clearcoatMap,m.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,e(v.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(m.clearcoatNormalMap.value=v.clearcoatNormalMap,e(v.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Xe&&m.clearcoatNormalScale.value.negate())),v.dispersion>0&&(m.dispersion.value=v.dispersion),v.iridescence>0&&(m.iridescence.value=v.iridescence,m.iridescenceIOR.value=v.iridescenceIOR,m.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(m.iridescenceMap.value=v.iridescenceMap,e(v.iridescenceMap,m.iridescenceMapTransform)),v.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=v.iridescenceThicknessMap,e(v.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),v.transmission>0&&(m.transmission.value=v.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),v.transmissionMap&&(m.transmissionMap.value=v.transmissionMap,e(v.transmissionMap,m.transmissionMapTransform)),m.thickness.value=v.thickness,v.thicknessMap&&(m.thicknessMap.value=v.thicknessMap,e(v.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=v.attenuationDistance,m.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(m.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(m.anisotropyMap.value=v.anisotropyMap,e(v.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=v.specularIntensity,m.specularColor.value.copy(v.specularColor),v.specularColorMap&&(m.specularColorMap.value=v.specularColorMap,e(v.specularColorMap,m.specularColorMapTransform)),v.specularIntensityMap&&(m.specularIntensityMap.value=v.specularIntensityMap,e(v.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,v){v.matcap&&(m.matcap.value=v.matcap)}function g(m,v){const M=t.get(v).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function zv(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,_){const S=_.program;n.uniformBlockBinding(M,S)}function c(M,_){let S=s[M.id];S===void 0&&(p(M),S=h(M),s[M.id]=S,M.addEventListener("dispose",m));const P=_.program;n.updateUBOMapping(M,P);const A=t.render.frame;r[M.id]!==A&&(u(M),r[M.id]=A)}function h(M){const _=d();M.__bindingPointIndex=_;const S=i.createBuffer(),P=M.__size,A=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,P,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,S),S}function d(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const _=s[M.id],S=M.uniforms,P=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let A=0,T=S.length;A<T;A++){const L=Array.isArray(S[A])?S[A]:[S[A]];for(let x=0,y=L.length;x<y;x++){const E=L[x];if(f(E,A,x,P)===!0){const D=E.__offset,N=Array.isArray(E.value)?E.value:[E.value];let F=0;for(let W=0;W<N.length;W++){const O=N[W],z=g(O);typeof O=="number"||typeof O=="boolean"?(E.__data[0]=O,i.bufferSubData(i.UNIFORM_BUFFER,D+F,E.__data)):O.isMatrix3?(E.__data[0]=O.elements[0],E.__data[1]=O.elements[1],E.__data[2]=O.elements[2],E.__data[3]=0,E.__data[4]=O.elements[3],E.__data[5]=O.elements[4],E.__data[6]=O.elements[5],E.__data[7]=0,E.__data[8]=O.elements[6],E.__data[9]=O.elements[7],E.__data[10]=O.elements[8],E.__data[11]=0):(O.toArray(E.__data,F),F+=z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,D,E.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(M,_,S,P){const A=M.value,T=_+"_"+S;if(P[T]===void 0)return typeof A=="number"||typeof A=="boolean"?P[T]=A:P[T]=A.clone(),!0;{const L=P[T];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return P[T]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function p(M){const _=M.uniforms;let S=0;const P=16;for(let T=0,L=_.length;T<L;T++){const x=Array.isArray(_[T])?_[T]:[_[T]];for(let y=0,E=x.length;y<E;y++){const D=x[y],N=Array.isArray(D.value)?D.value:[D.value];for(let F=0,W=N.length;F<W;F++){const O=N[F],z=g(O),V=S%P,ot=V%z.boundary,at=V+ot;S+=ot,at!==0&&P-at<z.storage&&(S+=P-at),D.__data=new Float32Array(z.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=S,S+=z.storage}}}const A=S%P;return A>0&&(S+=P-A),M.__size=S,M.__cache={},this}function g(M){const _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),_}function m(M){const _=M.target;_.removeEventListener("dispose",m);const S=o.indexOf(_.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[_.id]),delete s[_.id],delete r[_.id]}function v(){for(const M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:v}}class kv{constructor(t={}){const{canvas:e=Rf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const p=new Uint32Array(4),g=new Int32Array(4);let m=null,v=null;const M=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ze,this.toneMapping=oi,this.toneMappingExposure=1;const S=this;let P=!1,A=0,T=0,L=null,x=-1,y=null;const E=new ce,D=new ce;let N=null;const F=new Jt(0);let W=0,O=e.width,z=e.height,V=1,ot=null,at=null;const ht=new ce(0,0,O,z),At=new ce(0,0,O,z);let Tt=!1;const q=new El;let G=!1,nt=!1;const tt=new ae,ut=new ae,Ct=new I,Pt=new ce,Ot={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let et=!1;function ct(){return L===null?V:1}let U=n;function Rt(w,k){return e.getContext(w,k)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${fl}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",bt,!1),e.addEventListener("webglcontextcreationerror",yt,!1),U===null){const k="webgl2";if(U=Rt(k,w),U===null)throw Rt(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let J,Mt,pt,Bt,Et,R,b,$,Z,st,Q,K,dt,gt,Gt,rt,xt,Dt,zt,wt,Zt,Xt,he,B;function _t(){J=new $g(U),J.init(),Xt=new Lv(U,J),Mt=new zg(U,J,t,Xt),pt=new Tv(U,J),Mt.reverseDepthBuffer&&u&&pt.buffers.depth.setReversed(!0),Bt=new qg(U),Et=new dv,R=new Rv(U,J,pt,Et,Mt,Xt,Bt),b=new Vg(S),$=new Wg(S),Z=new ep(U),he=new Og(U,Z),st=new jg(U,Z,Bt,he),Q=new Jg(U,st,Z,Bt),zt=new Yg(U,Mt,R),rt=new kg(Et),K=new uv(S,b,$,J,Mt,he,rt),dt=new Bv(S,Et),gt=new pv,Gt=new yv(J),Dt=new Fg(S,b,$,pt,Q,f,l),xt=new wv(S,Q,Mt),B=new zv(U,Bt,Mt,pt),wt=new Bg(U,J,Bt),Zt=new Xg(U,J,Bt),Bt.programs=K.programs,S.capabilities=Mt,S.extensions=J,S.properties=Et,S.renderLists=gt,S.shadowMap=xt,S.state=pt,S.info=Bt}_t();const Y=new Fv(S,U);this.xr=Y,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const w=J.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=J.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return V},this.setPixelRatio=function(w){w!==void 0&&(V=w,this.setSize(O,z,!1))},this.getSize=function(w){return w.set(O,z)},this.setSize=function(w,k,j=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=w,z=k,e.width=Math.floor(w*V),e.height=Math.floor(k*V),j===!0&&(e.style.width=w+"px",e.style.height=k+"px"),this.setViewport(0,0,w,k)},this.getDrawingBufferSize=function(w){return w.set(O*V,z*V).floor()},this.setDrawingBufferSize=function(w,k,j){O=w,z=k,V=j,e.width=Math.floor(w*j),e.height=Math.floor(k*j),this.setViewport(0,0,w,k)},this.getCurrentViewport=function(w){return w.copy(E)},this.getViewport=function(w){return w.copy(ht)},this.setViewport=function(w,k,j,X){w.isVector4?ht.set(w.x,w.y,w.z,w.w):ht.set(w,k,j,X),pt.viewport(E.copy(ht).multiplyScalar(V).round())},this.getScissor=function(w){return w.copy(At)},this.setScissor=function(w,k,j,X){w.isVector4?At.set(w.x,w.y,w.z,w.w):At.set(w,k,j,X),pt.scissor(D.copy(At).multiplyScalar(V).round())},this.getScissorTest=function(){return Tt},this.setScissorTest=function(w){pt.setScissorTest(Tt=w)},this.setOpaqueSort=function(w){ot=w},this.setTransparentSort=function(w){at=w},this.getClearColor=function(w){return w.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor.apply(Dt,arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha.apply(Dt,arguments)},this.clear=function(w=!0,k=!0,j=!0){let X=0;if(w){let H=!1;if(L!==null){const ft=L.texture.format;H=ft===xl||ft===_l||ft===vl}if(H){const ft=L.texture.type,St=ft===Gn||ft===bi||ft===Ns||ft===rs||ft===ml||ft===gl,It=Dt.getClearColor(),Ut=Dt.getClearAlpha(),Vt=It.r,Wt=It.g,Nt=It.b;St?(p[0]=Vt,p[1]=Wt,p[2]=Nt,p[3]=Ut,U.clearBufferuiv(U.COLOR,0,p)):(g[0]=Vt,g[1]=Wt,g[2]=Nt,g[3]=Ut,U.clearBufferiv(U.COLOR,0,g))}else X|=U.COLOR_BUFFER_BIT}k&&(X|=U.DEPTH_BUFFER_BIT),j&&(X|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",bt,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),gt.dispose(),Gt.dispose(),Et.dispose(),b.dispose(),$.dispose(),Q.dispose(),he.dispose(),B.dispose(),K.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Ol),Y.removeEventListener("sessionend",Bl),li.stop()};function it(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function bt(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const w=Bt.autoReset,k=xt.enabled,j=xt.autoUpdate,X=xt.needsUpdate,H=xt.type;_t(),Bt.autoReset=w,xt.enabled=k,xt.autoUpdate=j,xt.needsUpdate=X,xt.type=H}function yt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ht(w){const k=w.target;k.removeEventListener("dispose",Ht),ve(k)}function ve(w){Fe(w),Et.remove(w)}function Fe(w){const k=Et.get(w).programs;k!==void 0&&(k.forEach(function(j){K.releaseProgram(j)}),w.isShaderMaterial&&K.releaseShaderCache(w))}this.renderBufferDirect=function(w,k,j,X,H,ft){k===null&&(k=Ot);const St=H.isMesh&&H.matrixWorld.determinant()<0,It=fd(w,k,j,X,H);pt.setMaterial(X,St);let Ut=j.index,Vt=1;if(X.wireframe===!0){if(Ut=st.getWireframeAttribute(j),Ut===void 0)return;Vt=2}const Wt=j.drawRange,Nt=j.attributes.position;let ee=Wt.start*Vt,ue=(Wt.start+Wt.count)*Vt;ft!==null&&(ee=Math.max(ee,ft.start*Vt),ue=Math.min(ue,(ft.start+ft.count)*Vt)),Ut!==null?(ee=Math.max(ee,0),ue=Math.min(ue,Ut.count)):Nt!=null&&(ee=Math.max(ee,0),ue=Math.min(ue,Nt.count));const fe=ue-ee;if(fe<0||fe===1/0)return;he.setup(H,X,It,j,Ut);let We,ie=wt;if(Ut!==null&&(We=Z.get(Ut),ie=Zt,ie.setIndex(We)),H.isMesh)X.wireframe===!0?(pt.setLineWidth(X.wireframeLinewidth*ct()),ie.setMode(U.LINES)):ie.setMode(U.TRIANGLES);else if(H.isLine){let Ft=X.linewidth;Ft===void 0&&(Ft=1),pt.setLineWidth(Ft*ct()),H.isLineSegments?ie.setMode(U.LINES):H.isLineLoop?ie.setMode(U.LINE_LOOP):ie.setMode(U.LINE_STRIP)}else H.isPoints?ie.setMode(U.POINTS):H.isSprite&&ie.setMode(U.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)ie.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(J.get("WEBGL_multi_draw"))ie.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ft=H._multiDrawStarts,Ln=H._multiDrawCounts,se=H._multiDrawCount,on=Ut?Z.get(Ut).bytesPerElement:1,Pi=Et.get(X).currentProgram.getUniforms();for(let qe=0;qe<se;qe++)Pi.setValue(U,"_gl_DrawID",qe),ie.render(Ft[qe]/on,Ln[qe])}else if(H.isInstancedMesh)ie.renderInstances(ee,fe,H.count);else if(j.isInstancedBufferGeometry){const Ft=j._maxInstanceCount!==void 0?j._maxInstanceCount:1/0,Ln=Math.min(j.instanceCount,Ft);ie.renderInstances(ee,fe,Ln)}else ie.render(ee,fe)};function re(w,k,j){w.transparent===!0&&w.side===dn&&w.forceSinglePass===!1?(w.side=Xe,w.needsUpdate=!0,Xs(w,k,j),w.side=ai,w.needsUpdate=!0,Xs(w,k,j),w.side=dn):Xs(w,k,j)}this.compile=function(w,k,j=null){j===null&&(j=w),v=Gt.get(j),v.init(k),_.push(v),j.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(v.pushLight(H),H.castShadow&&v.pushShadow(H))}),w!==j&&w.traverseVisible(function(H){H.isLight&&H.layers.test(k.layers)&&(v.pushLight(H),H.castShadow&&v.pushShadow(H))}),v.setupLights();const X=new Set;return w.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const ft=H.material;if(ft)if(Array.isArray(ft))for(let St=0;St<ft.length;St++){const It=ft[St];re(It,j,H),X.add(It)}else re(ft,j,H),X.add(ft)}),_.pop(),v=null,X},this.compileAsync=function(w,k,j=null){const X=this.compile(w,k,j);return new Promise(H=>{function ft(){if(X.forEach(function(St){Et.get(St).currentProgram.isReady()&&X.delete(St)}),X.size===0){H(w);return}setTimeout(ft,10)}J.get("KHR_parallel_shader_compile")!==null?ft():setTimeout(ft,10)})};let rn=null;function Rn(w){rn&&rn(w)}function Ol(){li.stop()}function Bl(){li.start()}const li=new _u;li.setAnimationLoop(Rn),typeof self<"u"&&li.setContext(self),this.setAnimationLoop=function(w){rn=w,Y.setAnimationLoop(w),w===null?li.stop():li.start()},Y.addEventListener("sessionstart",Ol),Y.addEventListener("sessionend",Bl),this.render=function(w,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(k),k=Y.getCamera()),w.isScene===!0&&w.onBeforeRender(S,w,k,L),v=Gt.get(w,_.length),v.init(k),_.push(v),ut.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),q.setFromProjectionMatrix(ut),nt=this.localClippingEnabled,G=rt.init(this.clippingPlanes,nt),m=gt.get(w,M.length),m.init(),M.push(m),Y.enabled===!0&&Y.isPresenting===!0){const ft=S.xr.getDepthSensingMesh();ft!==null&&co(ft,k,-1/0,S.sortObjects)}co(w,k,0,S.sortObjects),m.finish(),S.sortObjects===!0&&m.sort(ot,at),et=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,et&&Dt.addToRenderList(m,w),this.info.render.frame++,G===!0&&rt.beginShadows();const j=v.state.shadowsArray;xt.render(j,w,k),G===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=m.opaque,H=m.transmissive;if(v.setupLights(),k.isArrayCamera){const ft=k.cameras;if(H.length>0)for(let St=0,It=ft.length;St<It;St++){const Ut=ft[St];kl(X,H,w,Ut)}et&&Dt.render(w);for(let St=0,It=ft.length;St<It;St++){const Ut=ft[St];zl(m,w,Ut,Ut.viewport)}}else H.length>0&&kl(X,H,w,k),et&&Dt.render(w),zl(m,w,k);L!==null&&(R.updateMultisampleRenderTarget(L),R.updateRenderTargetMipmap(L)),w.isScene===!0&&w.onAfterRender(S,w,k),he.resetDefaultState(),x=-1,y=null,_.pop(),_.length>0?(v=_[_.length-1],G===!0&&rt.setGlobalState(S.clippingPlanes,v.state.camera)):v=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function co(w,k,j,X){if(w.visible===!1)return;if(w.layers.test(k.layers)){if(w.isGroup)j=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(k);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||q.intersectsSprite(w)){X&&Pt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ut);const St=Q.update(w),It=w.material;It.visible&&m.push(w,St,It,j,Pt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||q.intersectsObject(w))){const St=Q.update(w),It=w.material;if(X&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Pt.copy(w.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Pt.copy(St.boundingSphere.center)),Pt.applyMatrix4(w.matrixWorld).applyMatrix4(ut)),Array.isArray(It)){const Ut=St.groups;for(let Vt=0,Wt=Ut.length;Vt<Wt;Vt++){const Nt=Ut[Vt],ee=It[Nt.materialIndex];ee&&ee.visible&&m.push(w,St,ee,j,Pt.z,Nt)}}else It.visible&&m.push(w,St,It,j,Pt.z,null)}}const ft=w.children;for(let St=0,It=ft.length;St<It;St++)co(ft[St],k,j,X)}function zl(w,k,j,X){const H=w.opaque,ft=w.transmissive,St=w.transparent;v.setupLightsView(j),G===!0&&rt.setGlobalState(S.clippingPlanes,j),X&&pt.viewport(E.copy(X)),H.length>0&&js(H,k,j),ft.length>0&&js(ft,k,j),St.length>0&&js(St,k,j),pt.buffers.depth.setTest(!0),pt.buffers.depth.setMask(!0),pt.buffers.color.setMask(!0),pt.setPolygonOffset(!1)}function kl(w,k,j,X){if((j.isScene===!0?j.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new Ei(1,1,{generateMipmaps:!0,type:J.has("EXT_color_buffer_half_float")||J.has("EXT_color_buffer_float")?Vs:Gn,minFilter:Si,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qt.workingColorSpace}));const ft=v.state.transmissionRenderTarget[X.id],St=X.viewport||E;ft.setSize(St.z,St.w);const It=S.getRenderTarget();S.setRenderTarget(ft),S.getClearColor(F),W=S.getClearAlpha(),W<1&&S.setClearColor(16777215,.5),S.clear(),et&&Dt.render(j);const Ut=S.toneMapping;S.toneMapping=oi;const Vt=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),G===!0&&rt.setGlobalState(S.clippingPlanes,X),js(w,j,X),R.updateMultisampleRenderTarget(ft),R.updateRenderTargetMipmap(ft),J.has("WEBGL_multisampled_render_to_texture")===!1){let Wt=!1;for(let Nt=0,ee=k.length;Nt<ee;Nt++){const ue=k[Nt],fe=ue.object,We=ue.geometry,ie=ue.material,Ft=ue.group;if(ie.side===dn&&fe.layers.test(X.layers)){const Ln=ie.side;ie.side=Xe,ie.needsUpdate=!0,Vl(fe,j,X,We,ie,Ft),ie.side=Ln,ie.needsUpdate=!0,Wt=!0}}Wt===!0&&(R.updateMultisampleRenderTarget(ft),R.updateRenderTargetMipmap(ft))}S.setRenderTarget(It),S.setClearColor(F,W),Vt!==void 0&&(X.viewport=Vt),S.toneMapping=Ut}function js(w,k,j){const X=k.isScene===!0?k.overrideMaterial:null;for(let H=0,ft=w.length;H<ft;H++){const St=w[H],It=St.object,Ut=St.geometry,Vt=X===null?St.material:X,Wt=St.group;It.layers.test(j.layers)&&Vl(It,k,j,Ut,Vt,Wt)}}function Vl(w,k,j,X,H,ft){w.onBeforeRender(S,k,j,X,H,ft),w.modelViewMatrix.multiplyMatrices(j.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),H.onBeforeRender(S,k,j,X,w,ft),H.transparent===!0&&H.side===dn&&H.forceSinglePass===!1?(H.side=Xe,H.needsUpdate=!0,S.renderBufferDirect(j,k,X,H,w,ft),H.side=ai,H.needsUpdate=!0,S.renderBufferDirect(j,k,X,H,w,ft),H.side=dn):S.renderBufferDirect(j,k,X,H,w,ft),w.onAfterRender(S,k,j,X,H,ft)}function Xs(w,k,j){k.isScene!==!0&&(k=Ot);const X=Et.get(w),H=v.state.lights,ft=v.state.shadowsArray,St=H.state.version,It=K.getParameters(w,H.state,ft,k,j),Ut=K.getProgramCacheKey(It);let Vt=X.programs;X.environment=w.isMeshStandardMaterial?k.environment:null,X.fog=k.fog,X.envMap=(w.isMeshStandardMaterial?$:b).get(w.envMap||X.environment),X.envMapRotation=X.environment!==null&&w.envMap===null?k.environmentRotation:w.envMapRotation,Vt===void 0&&(w.addEventListener("dispose",Ht),Vt=new Map,X.programs=Vt);let Wt=Vt.get(Ut);if(Wt!==void 0){if(X.currentProgram===Wt&&X.lightsStateVersion===St)return Hl(w,It),Wt}else It.uniforms=K.getUniforms(w),w.onBeforeCompile(It,S),Wt=K.acquireProgram(It,Ut),Vt.set(Ut,Wt),X.uniforms=It.uniforms;const Nt=X.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Nt.clippingPlanes=rt.uniform),Hl(w,It),X.needsLights=md(w),X.lightsStateVersion=St,X.needsLights&&(Nt.ambientLightColor.value=H.state.ambient,Nt.lightProbe.value=H.state.probe,Nt.directionalLights.value=H.state.directional,Nt.directionalLightShadows.value=H.state.directionalShadow,Nt.spotLights.value=H.state.spot,Nt.spotLightShadows.value=H.state.spotShadow,Nt.rectAreaLights.value=H.state.rectArea,Nt.ltc_1.value=H.state.rectAreaLTC1,Nt.ltc_2.value=H.state.rectAreaLTC2,Nt.pointLights.value=H.state.point,Nt.pointLightShadows.value=H.state.pointShadow,Nt.hemisphereLights.value=H.state.hemi,Nt.directionalShadowMap.value=H.state.directionalShadowMap,Nt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Nt.spotShadowMap.value=H.state.spotShadowMap,Nt.spotLightMatrix.value=H.state.spotLightMatrix,Nt.spotLightMap.value=H.state.spotLightMap,Nt.pointShadowMap.value=H.state.pointShadowMap,Nt.pointShadowMatrix.value=H.state.pointShadowMatrix),X.currentProgram=Wt,X.uniformsList=null,Wt}function Gl(w){if(w.uniformsList===null){const k=w.currentProgram.getUniforms();w.uniformsList=Fr.seqWithValue(k.seq,w.uniforms)}return w.uniformsList}function Hl(w,k){const j=Et.get(w);j.outputColorSpace=k.outputColorSpace,j.batching=k.batching,j.batchingColor=k.batchingColor,j.instancing=k.instancing,j.instancingColor=k.instancingColor,j.instancingMorph=k.instancingMorph,j.skinning=k.skinning,j.morphTargets=k.morphTargets,j.morphNormals=k.morphNormals,j.morphColors=k.morphColors,j.morphTargetsCount=k.morphTargetsCount,j.numClippingPlanes=k.numClippingPlanes,j.numIntersection=k.numClipIntersection,j.vertexAlphas=k.vertexAlphas,j.vertexTangents=k.vertexTangents,j.toneMapping=k.toneMapping}function fd(w,k,j,X,H){k.isScene!==!0&&(k=Ot),R.resetTextureUnits();const ft=k.fog,St=X.isMeshStandardMaterial?k.environment:null,It=L===null?S.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:cs,Ut=(X.isMeshStandardMaterial?$:b).get(X.envMap||St),Vt=X.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,Wt=!!j.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Nt=!!j.morphAttributes.position,ee=!!j.morphAttributes.normal,ue=!!j.morphAttributes.color;let fe=oi;X.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(fe=S.toneMapping);const We=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ie=We!==void 0?We.length:0,Ft=Et.get(X),Ln=v.state.lights;if(G===!0&&(nt===!0||w!==y)){const tn=w===y&&X.id===x;rt.setState(X,w,tn)}let se=!1;X.version===Ft.__version?(Ft.needsLights&&Ft.lightsStateVersion!==Ln.state.version||Ft.outputColorSpace!==It||H.isBatchedMesh&&Ft.batching===!1||!H.isBatchedMesh&&Ft.batching===!0||H.isBatchedMesh&&Ft.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Ft.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Ft.instancing===!1||!H.isInstancedMesh&&Ft.instancing===!0||H.isSkinnedMesh&&Ft.skinning===!1||!H.isSkinnedMesh&&Ft.skinning===!0||H.isInstancedMesh&&Ft.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Ft.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Ft.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Ft.instancingMorph===!1&&H.morphTexture!==null||Ft.envMap!==Ut||X.fog===!0&&Ft.fog!==ft||Ft.numClippingPlanes!==void 0&&(Ft.numClippingPlanes!==rt.numPlanes||Ft.numIntersection!==rt.numIntersection)||Ft.vertexAlphas!==Vt||Ft.vertexTangents!==Wt||Ft.morphTargets!==Nt||Ft.morphNormals!==ee||Ft.morphColors!==ue||Ft.toneMapping!==fe||Ft.morphTargetsCount!==ie)&&(se=!0):(se=!0,Ft.__version=X.version);let on=Ft.currentProgram;se===!0&&(on=Xs(X,k,H));let Pi=!1,qe=!1,ps=!1;const pe=on.getUniforms(),xn=Ft.uniforms;if(pt.useProgram(on.program)&&(Pi=!0,qe=!0,ps=!0),X.id!==x&&(x=X.id,qe=!0),Pi||y!==w){pt.buffers.depth.getReversed()?(tt.copy(w.projectionMatrix),Pf(tt),Df(tt),pe.setValue(U,"projectionMatrix",tt)):pe.setValue(U,"projectionMatrix",w.projectionMatrix),pe.setValue(U,"viewMatrix",w.matrixWorldInverse);const $n=pe.map.cameraPosition;$n!==void 0&&$n.setValue(U,Ct.setFromMatrixPosition(w.matrixWorld)),Mt.logarithmicDepthBuffer&&pe.setValue(U,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&pe.setValue(U,"isOrthographic",w.isOrthographicCamera===!0),y!==w&&(y=w,qe=!0,ps=!0)}if(H.isSkinnedMesh){pe.setOptional(U,H,"bindMatrix"),pe.setOptional(U,H,"bindMatrixInverse");const tn=H.skeleton;tn&&(tn.boneTexture===null&&tn.computeBoneTexture(),pe.setValue(U,"boneTexture",tn.boneTexture,R))}H.isBatchedMesh&&(pe.setOptional(U,H,"batchingTexture"),pe.setValue(U,"batchingTexture",H._matricesTexture,R),pe.setOptional(U,H,"batchingIdTexture"),pe.setValue(U,"batchingIdTexture",H._indirectTexture,R),pe.setOptional(U,H,"batchingColorTexture"),H._colorsTexture!==null&&pe.setValue(U,"batchingColorTexture",H._colorsTexture,R));const ms=j.morphAttributes;if((ms.position!==void 0||ms.normal!==void 0||ms.color!==void 0)&&zt.update(H,j,on),(qe||Ft.receiveShadow!==H.receiveShadow)&&(Ft.receiveShadow=H.receiveShadow,pe.setValue(U,"receiveShadow",H.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(xn.envMap.value=Ut,xn.flipEnvMap.value=Ut.isCubeTexture&&Ut.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&k.environment!==null&&(xn.envMapIntensity.value=k.environmentIntensity),qe&&(pe.setValue(U,"toneMappingExposure",S.toneMappingExposure),Ft.needsLights&&pd(xn,ps),ft&&X.fog===!0&&dt.refreshFogUniforms(xn,ft),dt.refreshMaterialUniforms(xn,X,V,z,v.state.transmissionRenderTarget[w.id]),Fr.upload(U,Gl(Ft),xn,R)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Fr.upload(U,Gl(Ft),xn,R),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&pe.setValue(U,"center",H.center),pe.setValue(U,"modelViewMatrix",H.modelViewMatrix),pe.setValue(U,"normalMatrix",H.normalMatrix),pe.setValue(U,"modelMatrix",H.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const tn=X.uniformsGroups;for(let $n=0,jn=tn.length;$n<jn;$n++){const Wl=tn[$n];B.update(Wl,on),B.bind(Wl,on)}}return on}function pd(w,k){w.ambientLightColor.needsUpdate=k,w.lightProbe.needsUpdate=k,w.directionalLights.needsUpdate=k,w.directionalLightShadows.needsUpdate=k,w.pointLights.needsUpdate=k,w.pointLightShadows.needsUpdate=k,w.spotLights.needsUpdate=k,w.spotLightShadows.needsUpdate=k,w.rectAreaLights.needsUpdate=k,w.hemisphereLights.needsUpdate=k}function md(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(w,k,j){Et.get(w.texture).__webglTexture=k,Et.get(w.depthTexture).__webglTexture=j;const X=Et.get(w);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=j===void 0,X.__autoAllocateDepthBuffer||J.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,k){const j=Et.get(w);j.__webglFramebuffer=k,j.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(w,k=0,j=0){L=w,A=k,T=j;let X=!0,H=null,ft=!1,St=!1;if(w){const Ut=Et.get(w);if(Ut.__useDefaultFramebuffer!==void 0)pt.bindFramebuffer(U.FRAMEBUFFER,null),X=!1;else if(Ut.__webglFramebuffer===void 0)R.setupRenderTarget(w);else if(Ut.__hasExternalTextures)R.rebindTextures(w,Et.get(w.texture).__webglTexture,Et.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Nt=w.depthTexture;if(Ut.__boundDepthTexture!==Nt){if(Nt!==null&&Et.has(Nt)&&(w.width!==Nt.image.width||w.height!==Nt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(w)}}const Vt=w.texture;(Vt.isData3DTexture||Vt.isDataArrayTexture||Vt.isCompressedArrayTexture)&&(St=!0);const Wt=Et.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Wt[k])?H=Wt[k][j]:H=Wt[k],ft=!0):w.samples>0&&R.useMultisampledRTT(w)===!1?H=Et.get(w).__webglMultisampledFramebuffer:Array.isArray(Wt)?H=Wt[j]:H=Wt,E.copy(w.viewport),D.copy(w.scissor),N=w.scissorTest}else E.copy(ht).multiplyScalar(V).floor(),D.copy(At).multiplyScalar(V).floor(),N=Tt;if(pt.bindFramebuffer(U.FRAMEBUFFER,H)&&X&&pt.drawBuffers(w,H),pt.viewport(E),pt.scissor(D),pt.setScissorTest(N),ft){const Ut=Et.get(w.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+k,Ut.__webglTexture,j)}else if(St){const Ut=Et.get(w.texture),Vt=k||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Ut.__webglTexture,j||0,Vt)}x=-1},this.readRenderTargetPixels=function(w,k,j,X,H,ft,St){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=Et.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&St!==void 0&&(It=It[St]),It){pt.bindFramebuffer(U.FRAMEBUFFER,It);try{const Ut=w.texture,Vt=Ut.format,Wt=Ut.type;if(!Mt.textureFormatReadable(Vt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Mt.textureTypeReadable(Wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=w.width-X&&j>=0&&j<=w.height-H&&U.readPixels(k,j,X,H,Xt.convert(Vt),Xt.convert(Wt),ft)}finally{const Ut=L!==null?Et.get(L).__webglFramebuffer:null;pt.bindFramebuffer(U.FRAMEBUFFER,Ut)}}},this.readRenderTargetPixelsAsync=async function(w,k,j,X,H,ft,St){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=Et.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&St!==void 0&&(It=It[St]),It){const Ut=w.texture,Vt=Ut.format,Wt=Ut.type;if(!Mt.textureFormatReadable(Vt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Mt.textureTypeReadable(Wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(k>=0&&k<=w.width-X&&j>=0&&j<=w.height-H){pt.bindFramebuffer(U.FRAMEBUFFER,It);const Nt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Nt),U.bufferData(U.PIXEL_PACK_BUFFER,ft.byteLength,U.STREAM_READ),U.readPixels(k,j,X,H,Xt.convert(Vt),Xt.convert(Wt),0);const ee=L!==null?Et.get(L).__webglFramebuffer:null;pt.bindFramebuffer(U.FRAMEBUFFER,ee);const ue=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Lf(U,ue,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Nt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,ft),U.deleteBuffer(Nt),U.deleteSync(ue),ft}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,k=null,j=0){w.isTexture!==!0&&(Ms("WebGLRenderer: copyFramebufferToTexture function signature has changed."),k=arguments[0]||null,w=arguments[1]);const X=Math.pow(2,-j),H=Math.floor(w.image.width*X),ft=Math.floor(w.image.height*X),St=k!==null?k.x:0,It=k!==null?k.y:0;R.setTexture2D(w,0),U.copyTexSubImage2D(U.TEXTURE_2D,j,0,0,St,It,H,ft),pt.unbindTexture()},this.copyTextureToTexture=function(w,k,j=null,X=null,H=0){w.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,w=arguments[1],k=arguments[2],H=arguments[3]||0,j=null);let ft,St,It,Ut,Vt,Wt,Nt,ee,ue;const fe=w.isCompressedTexture?w.mipmaps[H]:w.image;j!==null?(ft=j.max.x-j.min.x,St=j.max.y-j.min.y,It=j.isBox3?j.max.z-j.min.z:1,Ut=j.min.x,Vt=j.min.y,Wt=j.isBox3?j.min.z:0):(ft=fe.width,St=fe.height,It=fe.depth||1,Ut=0,Vt=0,Wt=0),X!==null?(Nt=X.x,ee=X.y,ue=X.z):(Nt=0,ee=0,ue=0);const We=Xt.convert(k.format),ie=Xt.convert(k.type);let Ft;k.isData3DTexture?(R.setTexture3D(k,0),Ft=U.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(R.setTexture2DArray(k,0),Ft=U.TEXTURE_2D_ARRAY):(R.setTexture2D(k,0),Ft=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,k.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,k.unpackAlignment);const Ln=U.getParameter(U.UNPACK_ROW_LENGTH),se=U.getParameter(U.UNPACK_IMAGE_HEIGHT),on=U.getParameter(U.UNPACK_SKIP_PIXELS),Pi=U.getParameter(U.UNPACK_SKIP_ROWS),qe=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,fe.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,fe.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ut),U.pixelStorei(U.UNPACK_SKIP_ROWS,Vt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Wt);const ps=w.isDataArrayTexture||w.isData3DTexture,pe=k.isDataArrayTexture||k.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const xn=Et.get(w),ms=Et.get(k),tn=Et.get(xn.__renderTarget),$n=Et.get(ms.__renderTarget);pt.bindFramebuffer(U.READ_FRAMEBUFFER,tn.__webglFramebuffer),pt.bindFramebuffer(U.DRAW_FRAMEBUFFER,$n.__webglFramebuffer);for(let jn=0;jn<It;jn++)ps&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Et.get(w).__webglTexture,H,Wt+jn),w.isDepthTexture?(pe&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Et.get(k).__webglTexture,H,ue+jn),U.blitFramebuffer(Ut,Vt,ft,St,Nt,ee,ft,St,U.DEPTH_BUFFER_BIT,U.NEAREST)):pe?U.copyTexSubImage3D(Ft,H,Nt,ee,ue+jn,Ut,Vt,ft,St):U.copyTexSubImage2D(Ft,H,Nt,ee,ue+jn,Ut,Vt,ft,St);pt.bindFramebuffer(U.READ_FRAMEBUFFER,null),pt.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else pe?w.isDataTexture||w.isData3DTexture?U.texSubImage3D(Ft,H,Nt,ee,ue,ft,St,It,We,ie,fe.data):k.isCompressedArrayTexture?U.compressedTexSubImage3D(Ft,H,Nt,ee,ue,ft,St,It,We,fe.data):U.texSubImage3D(Ft,H,Nt,ee,ue,ft,St,It,We,ie,fe):w.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,H,Nt,ee,ft,St,We,ie,fe.data):w.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,H,Nt,ee,fe.width,fe.height,We,fe.data):U.texSubImage2D(U.TEXTURE_2D,H,Nt,ee,ft,St,We,ie,fe);U.pixelStorei(U.UNPACK_ROW_LENGTH,Ln),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,se),U.pixelStorei(U.UNPACK_SKIP_PIXELS,on),U.pixelStorei(U.UNPACK_SKIP_ROWS,Pi),U.pixelStorei(U.UNPACK_SKIP_IMAGES,qe),H===0&&k.generateMipmaps&&U.generateMipmap(Ft),pt.unbindTexture()},this.copyTextureToTexture3D=function(w,k,j=null,X=null,H=0){return w.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture3D function signature has changed."),j=arguments[0]||null,X=arguments[1]||null,w=arguments[2],k=arguments[3],H=arguments[4]||0),Ms('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,k,j,X,H)},this.initRenderTarget=function(w){Et.get(w).__webglFramebuffer===void 0&&R.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),pt.unbindTexture()},this.resetState=function(){A=0,T=0,L=null,pt.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Qt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Qt._getUnpackColorSpace()}}class Vv extends be{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Tn,this.environmentIntensity=1,this.environmentRotation=new Tn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Gv{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Wa,this.updateRanges=[],this.version=0,this.uuid=An()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=An()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=An()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const ze=new I;class ii{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=fn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=oe(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=oe(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=fn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=fn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=fn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=fn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),s=oe(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=oe(e,this.array),n=oe(n,this.array),s=oe(s,this.array),r=oe(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new vn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ii(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Or extends us{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Jt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Wc=new ae,ja=new Sl,mr=new Li,gr=new I;class zo extends be{constructor(t=new Re,e=new Or){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere),mr.applyMatrix4(s),mr.radius+=r,t.ray.intersectsSphere(mr)===!1)return;Wc.copy(s).invert(),ja.copy(t.ray).applyMatrix4(Wc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=u,g=f;p<g;p++){const m=c.getX(p);gr.fromBufferAttribute(d,m),$c(gr,m,l,s,t,e,this)}}else{const u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let p=u,g=f;p<g;p++)gr.fromBufferAttribute(d,p),$c(gr,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function $c(i,t,e,n,s,r,o){const a=ja.distanceSqToPoint(i);if(a<e){const l=new I;ja.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Hv extends Ge{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Cn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],u=n[s+1]-h,f=(o-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new vt:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new I,s=[],r=[],o=[],a=new I,l=new ae;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new I)}r[0]=new I,o[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(Ce(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Ce(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Tl extends Cn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new vt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Wv extends Tl{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Cl(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,s(o,a,u,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const vr=new I,ko=new Cl,Vo=new Cl,Go=new Cl;class $v extends Cn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(vr.subVectors(s[0],s[1]).add(s[0]),c=vr);const d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(vr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=vr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);g<1e-4&&(g=1),p<1e-4&&(p=g),m<1e-4&&(m=g),ko.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,g,m),Vo.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,g,m),Go.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,g,m)}else this.curveType==="catmullrom"&&(ko.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Vo.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Go.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(ko.calc(l),Vo.calc(l),Go.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function jc(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function jv(i,t){const e=1-i;return e*e*t}function Xv(i,t){return 2*(1-i)*i*t}function qv(i,t){return i*i*t}function Cs(i,t,e,n){return jv(i,t)+Xv(i,e)+qv(i,n)}function Yv(i,t){const e=1-i;return e*e*e*t}function Jv(i,t){const e=1-i;return 3*e*e*i*t}function Zv(i,t){return 3*(1-i)*i*i*t}function Kv(i,t){return i*i*i*t}function Rs(i,t,e,n,s){return Yv(i,t)+Jv(i,e)+Zv(i,n)+Kv(i,s)}class Eu extends Cn{constructor(t=new vt,e=new vt,n=new vt,s=new vt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new vt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Rs(t,s.x,r.x,o.x,a.x),Rs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Qv extends Cn{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Rs(t,s.x,r.x,o.x,a.x),Rs(t,s.y,r.y,o.y,a.y),Rs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wu extends Cn{constructor(t=new vt,e=new vt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new vt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new vt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class t_ extends Cn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Au extends Cn{constructor(t=new vt,e=new vt,n=new vt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new vt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Cs(t,s.x,r.x,o.x),Cs(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class e_ extends Cn{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Cs(t,s.x,r.x,o.x),Cs(t,s.y,r.y,o.y),Cs(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tu extends Cn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new vt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(jc(a,l.x,c.x,h.x,d.x),jc(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new vt().fromArray(s))}return this}}var Xa=Object.freeze({__proto__:null,ArcCurve:Wv,CatmullRomCurve3:$v,CubicBezierCurve:Eu,CubicBezierCurve3:Qv,EllipseCurve:Tl,LineCurve:wu,LineCurve3:t_,QuadraticBezierCurve:Au,QuadraticBezierCurve3:e_,SplineCurve:Tu});class n_ extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Xa[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Xa[s.type]().fromJSON(s))}return this}}class $r extends n_{constructor(t){super(),this.type="Path",this.currentPoint=new vt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new wu(this.currentPoint.clone(),new vt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Au(this.currentPoint.clone(),new vt(t,e),new vt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new Eu(this.currentPoint.clone(),new vt(t,e),new vt(n,s),new vt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Tu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new Tl(t,e,n,s,r,o,a,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Rl extends Re{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const g=[],m=n/2;let v=0;M(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new me(d,3)),this.setAttribute("normal",new me(u,3)),this.setAttribute("uv",new me(f,2));function M(){const S=new I,P=new I;let A=0;const T=(e-t)/n;for(let L=0;L<=r;L++){const x=[],y=L/r,E=y*(e-t)+t;for(let D=0;D<=s;D++){const N=D/s,F=N*l+a,W=Math.sin(F),O=Math.cos(F);P.x=E*W,P.y=-y*n+m,P.z=E*O,d.push(P.x,P.y,P.z),S.set(W,T,O).normalize(),u.push(S.x,S.y,S.z),f.push(N,1-y),x.push(p++)}g.push(x)}for(let L=0;L<s;L++)for(let x=0;x<r;x++){const y=g[x][L],E=g[x+1][L],D=g[x+1][L+1],N=g[x][L+1];(t>0||x!==0)&&(h.push(y,E,N),A+=3),(e>0||x!==r-1)&&(h.push(E,D,N),A+=3)}c.addGroup(v,A,0),v+=A}function _(S){const P=p,A=new vt,T=new I;let L=0;const x=S===!0?t:e,y=S===!0?1:-1;for(let D=1;D<=s;D++)d.push(0,m*y,0),u.push(0,y,0),f.push(.5,.5),p++;const E=p;for(let D=0;D<=s;D++){const F=D/s*l+a,W=Math.cos(F),O=Math.sin(F);T.x=x*O,T.y=m*y,T.z=x*W,d.push(T.x,T.y,T.z),u.push(0,y,0),A.x=W*.5+.5,A.y=O*.5*y+.5,f.push(A.x,A.y),p++}for(let D=0;D<s;D++){const N=P+D,F=E+D;S===!0?h.push(F,F+1,N):h.push(F+1,F,N),L+=3}c.addGroup(v,L,S===!0?1:2),v+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rl(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ls extends Rl{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Ls(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Qn extends $r{constructor(t){super(t),this.uuid=An(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new $r().fromJSON(s))}return this}}const i_={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Cu(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,d,u,f;if(n&&(r=l_(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let p=e;p<s;p+=e)d=i[p],u=i[p+1],d<a&&(a=d),u<l&&(l=u),d>c&&(c=d),u>h&&(h=u);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return Os(r,o,e,a,l,f,0),o}};function Cu(i,t,e,n,s){let r,o;if(s===x_(i,t,e,n)>0)for(r=t;r<e;r+=n)o=Xc(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=Xc(r,i[r],i[r+1],o);return o&&so(o,o.next)&&(zs(o),o=o.next),o}function wi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(so(e,e.next)||ge(e.prev,e,e.next)===0)){if(zs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Os(i,t,e,n,s,r,o){if(!i)return;!o&&r&&f_(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?r_(i,n,s,r):s_(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),zs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=o_(wi(i),t,e),Os(i,t,e,n,s,r,2)):o===2&&a_(i,t,e,n,s,r):Os(wi(i),t,e,n,s,r,1);break}}}function s_(i){const t=i.prev,e=i,n=i.next;if(ge(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,d=a<l?a<c?a:c:l<c?l:c,u=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c;let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&Zi(s,a,r,l,o,c,p.x,p.y)&&ge(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function r_(i,t,e,n){const s=i.prev,r=i,o=i.next;if(ge(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,u=o.y,f=a<l?a<c?a:c:l<c?l:c,p=h<d?h<u?h:u:d<u?d:u,g=a>l?a>c?a:c:l>c?l:c,m=h>d?h>u?h:u:d>u?d:u,v=qa(f,p,t,e,n),M=qa(g,m,t,e,n);let _=i.prevZ,S=i.nextZ;for(;_&&_.z>=v&&S&&S.z<=M;){if(_.x>=f&&_.x<=g&&_.y>=p&&_.y<=m&&_!==s&&_!==o&&Zi(a,h,l,d,c,u,_.x,_.y)&&ge(_.prev,_,_.next)>=0||(_=_.prevZ,S.x>=f&&S.x<=g&&S.y>=p&&S.y<=m&&S!==s&&S!==o&&Zi(a,h,l,d,c,u,S.x,S.y)&&ge(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;_&&_.z>=v;){if(_.x>=f&&_.x<=g&&_.y>=p&&_.y<=m&&_!==s&&_!==o&&Zi(a,h,l,d,c,u,_.x,_.y)&&ge(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;S&&S.z<=M;){if(S.x>=f&&S.x<=g&&S.y>=p&&S.y<=m&&S!==s&&S!==o&&Zi(a,h,l,d,c,u,S.x,S.y)&&ge(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function o_(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!so(s,r)&&Ru(s,n,n.next,r)&&Bs(s,r)&&Bs(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),zs(n),zs(n.next),n=i=r),n=n.next}while(n!==i);return wi(n)}function a_(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&g_(o,a)){let l=Lu(o,a);o=wi(o,o.next),l=wi(l,l.next),Os(o,t,e,n,s,r,0),Os(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function l_(i,t,e,n){const s=[];let r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=Cu(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(m_(c));for(s.sort(c_),r=0;r<s.length;r++)e=h_(s[r],e);return e}function c_(i,t){return i.x-t.x}function h_(i,t){const e=u_(i,t);if(!e)return t;const n=Lu(e,i);return wi(n,n.next),wi(e,e.next)}function u_(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const u=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=r&&u>n&&(n=u,s=e.x<e.next.x?e:e.next,u===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let h=1/0,d;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Zi(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(d=Math.abs(o-e.y)/(r-e.x),Bs(e,i)&&(d<h||d===h&&(e.x>s.x||e.x===s.x&&d_(s,e)))&&(s=e,h=d)),e=e.next;while(e!==a);return s}function d_(i,t){return ge(i.prev,i,t.prev)<0&&ge(t.next,i,i.next)<0}function f_(i,t,e,n){let s=i;do s.z===0&&(s.z=qa(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,p_(s)}function p_(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function qa(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function m_(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Zi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function g_(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!v_(i,t)&&(Bs(i,t)&&Bs(t,i)&&__(i,t)&&(ge(i.prev,i,t.prev)||ge(i,t.prev,t))||so(i,t)&&ge(i.prev,i,i.next)>0&&ge(t.prev,t,t.next)>0)}function ge(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function so(i,t){return i.x===t.x&&i.y===t.y}function Ru(i,t,e,n){const s=xr(ge(i,t,e)),r=xr(ge(i,t,n)),o=xr(ge(e,n,i)),a=xr(ge(e,n,t));return!!(s!==r&&o!==a||s===0&&_r(i,e,t)||r===0&&_r(i,n,t)||o===0&&_r(e,i,n)||a===0&&_r(e,t,n))}function _r(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function xr(i){return i>0?1:i<0?-1:0}function v_(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Ru(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Bs(i,t){return ge(i.prev,i,i.next)<0?ge(i,t,i.next)>=0&&ge(i,i.prev,t)>=0:ge(i,t,i.prev)<0||ge(i,i.next,t)<0}function __(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Lu(i,t){const e=new Ya(i.i,i.x,i.y),n=new Ya(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Xc(i,t,e,n){const s=new Ya(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function zs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ya(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function x_(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Ps{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ps.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];qc(t),Yc(n,t);let o=t.length;e.forEach(qc);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Yc(n,e[l]);const a=i_.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function qc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Yc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Ll extends Re{constructor(t=new Qn([new vt(.5,.5),new vt(-.5,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new me(s,3)),this.setAttribute("uv",new me(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const v=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:y_;let _,S=!1,P,A,T,L;v&&(_=v.getSpacedPoints(h),S=!0,u=!1,P=v.computeFrenetFrames(h,!1),A=new I,T=new I,L=new I),u||(m=0,f=0,p=0,g=0);const x=a.extractPoints(c);let y=x.shape;const E=x.holes;if(!Ps.isClockWise(y)){y=y.reverse();for(let et=0,ct=E.length;et<ct;et++){const U=E[et];Ps.isClockWise(U)&&(E[et]=U.reverse())}}const N=Ps.triangulateShape(y,E),F=y;for(let et=0,ct=E.length;et<ct;et++){const U=E[et];y=y.concat(U)}function W(et,ct,U){return ct||console.error("THREE.ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(ct,U)}const O=y.length,z=N.length;function V(et,ct,U){let Rt,J,Mt;const pt=et.x-ct.x,Bt=et.y-ct.y,Et=U.x-et.x,R=U.y-et.y,b=pt*pt+Bt*Bt,$=pt*R-Bt*Et;if(Math.abs($)>Number.EPSILON){const Z=Math.sqrt(b),st=Math.sqrt(Et*Et+R*R),Q=ct.x-Bt/Z,K=ct.y+pt/Z,dt=U.x-R/st,gt=U.y+Et/st,Gt=((dt-Q)*R-(gt-K)*Et)/(pt*R-Bt*Et);Rt=Q+pt*Gt-et.x,J=K+Bt*Gt-et.y;const rt=Rt*Rt+J*J;if(rt<=2)return new vt(Rt,J);Mt=Math.sqrt(rt/2)}else{let Z=!1;pt>Number.EPSILON?Et>Number.EPSILON&&(Z=!0):pt<-Number.EPSILON?Et<-Number.EPSILON&&(Z=!0):Math.sign(Bt)===Math.sign(R)&&(Z=!0),Z?(Rt=-Bt,J=pt,Mt=Math.sqrt(b)):(Rt=pt,J=Bt,Mt=Math.sqrt(b/2))}return new vt(Rt/Mt,J/Mt)}const ot=[];for(let et=0,ct=F.length,U=ct-1,Rt=et+1;et<ct;et++,U++,Rt++)U===ct&&(U=0),Rt===ct&&(Rt=0),ot[et]=V(F[et],F[U],F[Rt]);const at=[];let ht,At=ot.concat();for(let et=0,ct=E.length;et<ct;et++){const U=E[et];ht=[];for(let Rt=0,J=U.length,Mt=J-1,pt=Rt+1;Rt<J;Rt++,Mt++,pt++)Mt===J&&(Mt=0),pt===J&&(pt=0),ht[Rt]=V(U[Rt],U[Mt],U[pt]);at.push(ht),At=At.concat(ht)}for(let et=0;et<m;et++){const ct=et/m,U=f*Math.cos(ct*Math.PI/2),Rt=p*Math.sin(ct*Math.PI/2)+g;for(let J=0,Mt=F.length;J<Mt;J++){const pt=W(F[J],ot[J],Rt);tt(pt.x,pt.y,-U)}for(let J=0,Mt=E.length;J<Mt;J++){const pt=E[J];ht=at[J];for(let Bt=0,Et=pt.length;Bt<Et;Bt++){const R=W(pt[Bt],ht[Bt],Rt);tt(R.x,R.y,-U)}}}const Tt=p+g;for(let et=0;et<O;et++){const ct=u?W(y[et],At[et],Tt):y[et];S?(T.copy(P.normals[0]).multiplyScalar(ct.x),A.copy(P.binormals[0]).multiplyScalar(ct.y),L.copy(_[0]).add(T).add(A),tt(L.x,L.y,L.z)):tt(ct.x,ct.y,0)}for(let et=1;et<=h;et++)for(let ct=0;ct<O;ct++){const U=u?W(y[ct],At[ct],Tt):y[ct];S?(T.copy(P.normals[et]).multiplyScalar(U.x),A.copy(P.binormals[et]).multiplyScalar(U.y),L.copy(_[et]).add(T).add(A),tt(L.x,L.y,L.z)):tt(U.x,U.y,d/h*et)}for(let et=m-1;et>=0;et--){const ct=et/m,U=f*Math.cos(ct*Math.PI/2),Rt=p*Math.sin(ct*Math.PI/2)+g;for(let J=0,Mt=F.length;J<Mt;J++){const pt=W(F[J],ot[J],Rt);tt(pt.x,pt.y,d+U)}for(let J=0,Mt=E.length;J<Mt;J++){const pt=E[J];ht=at[J];for(let Bt=0,Et=pt.length;Bt<Et;Bt++){const R=W(pt[Bt],ht[Bt],Rt);S?tt(R.x,R.y+_[h-1].y,_[h-1].x+U):tt(R.x,R.y,d+U)}}}q(),G();function q(){const et=s.length/3;if(u){let ct=0,U=O*ct;for(let Rt=0;Rt<z;Rt++){const J=N[Rt];ut(J[2]+U,J[1]+U,J[0]+U)}ct=h+m*2,U=O*ct;for(let Rt=0;Rt<z;Rt++){const J=N[Rt];ut(J[0]+U,J[1]+U,J[2]+U)}}else{for(let ct=0;ct<z;ct++){const U=N[ct];ut(U[2],U[1],U[0])}for(let ct=0;ct<z;ct++){const U=N[ct];ut(U[0]+O*h,U[1]+O*h,U[2]+O*h)}}n.addGroup(et,s.length/3-et,0)}function G(){const et=s.length/3;let ct=0;nt(F,ct),ct+=F.length;for(let U=0,Rt=E.length;U<Rt;U++){const J=E[U];nt(J,ct),ct+=J.length}n.addGroup(et,s.length/3-et,1)}function nt(et,ct){let U=et.length;for(;--U>=0;){const Rt=U;let J=U-1;J<0&&(J=et.length-1);for(let Mt=0,pt=h+m*2;Mt<pt;Mt++){const Bt=O*Mt,Et=O*(Mt+1),R=ct+Rt+Bt,b=ct+J+Bt,$=ct+J+Et,Z=ct+Rt+Et;Ct(R,b,$,Z)}}}function tt(et,ct,U){l.push(et),l.push(ct),l.push(U)}function ut(et,ct,U){Pt(et),Pt(ct),Pt(U);const Rt=s.length/3,J=M.generateTopUV(n,s,Rt-3,Rt-2,Rt-1);Ot(J[0]),Ot(J[1]),Ot(J[2])}function Ct(et,ct,U,Rt){Pt(et),Pt(ct),Pt(Rt),Pt(ct),Pt(U),Pt(Rt);const J=s.length/3,Mt=M.generateSideWallUV(n,s,J-6,J-3,J-2,J-1);Ot(Mt[0]),Ot(Mt[1]),Ot(Mt[3]),Ot(Mt[1]),Ot(Mt[2]),Ot(Mt[3])}function Pt(et){s.push(l[et*3+0]),s.push(l[et*3+1]),s.push(l[et*3+2])}function Ot(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return S_(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Xa[s.type]().fromJSON(s)),new Ll(n,t.options)}}const y_={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new vt(r,o),new vt(a,l),new vt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],p=t[s*3+2],g=t[r*3],m=t[r*3+1],v=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new vt(o,1-l),new vt(c,1-d),new vt(u,1-p),new vt(g,1-v)]:[new vt(a,1-l),new vt(h,1-d),new vt(f,1-p),new vt(m,1-v)]}};function S_(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Pl extends Re{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new I,u=new I,f=[],p=[],g=[],m=[];for(let v=0;v<=n;v++){const M=[],_=v/n;let S=0;v===0&&o===0?S=.5/e:v===n&&l===Math.PI&&(S=-.5/e);for(let P=0;P<=e;P++){const A=P/e;d.x=-t*Math.cos(s+A*r)*Math.sin(o+_*a),d.y=t*Math.cos(o+_*a),d.z=t*Math.sin(s+A*r)*Math.sin(o+_*a),p.push(d.x,d.y,d.z),u.copy(d).normalize(),g.push(u.x,u.y,u.z),m.push(A+S,1-_),M.push(c++)}h.push(M)}for(let v=0;v<n;v++)for(let M=0;M<e;M++){const _=h[v][M+1],S=h[v][M],P=h[v+1][M],A=h[v+1][M+1];(v!==0||o>0)&&f.push(_,S,A),(v!==n-1||l<Math.PI)&&f.push(S,P,A)}this.setIndex(f),this.setAttribute("position",new me(p,3)),this.setAttribute("normal",new me(g,3)),this.setAttribute("uv",new me(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pl(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class M_ extends Re{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new I,r=new I;if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let p=u,g=u+f;p<g;p+=3)for(let m=0;m<3;m++){const v=a.getX(p+m),M=a.getX(p+(m+1)%3);s.fromBufferAttribute(o,v),r.fromBufferAttribute(o,M),Jc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,d),Jc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new me(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Jc(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class Zc extends us{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Jt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=au,this.normalScale=new vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Tn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Pu extends be{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Jt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class b_ extends Pu{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Jt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ho=new ae,Kc=new I,Qc=new I;class E_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new vt(512,512),this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new El,this._frameExtents=new vt(1,1),this._viewportCount=1,this._viewports=[new ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Kc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Kc),Qc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Qc),e.updateMatrixWorld(),Ho.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ho),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ho)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class w_ extends E_{constructor(){super(new wl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class A_ extends Pu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(be.DEFAULT_UP),this.updateMatrix(),this.target=new be,this.shadow=new w_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class T_ extends Re{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Ja extends Gv{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const th=new ae;class C_{constructor(t,e,n=0,s=1/0){this.ray=new Sl(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new Ml,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return th.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(th),this}intersectObject(t,e=!0,n=[]){return Za(t,this,n,e),n.sort(eh),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Za(t[s],this,n,e);return n.sort(eh),n}}function eh(i,t){return i.distance-t.distance}function Za(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)Za(r[o],t,e,!0)}}const nh=new I,yr=new I;class R_{constructor(t=new I,e=new I){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){nh.subVectors(t,this.start),yr.subVectors(this.end,this.start);const n=yr.dot(yr);let r=yr.dot(nh)/n;return e&&(r=Ce(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fl);const ih=new Wn,Sr=new I;class Du extends T_{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new me(t,3)),this.setAttribute("uv",new me(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Ja(e,6,1);return this.setAttribute("instanceStart",new ii(n,3,0)),this.setAttribute("instanceEnd",new ii(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Ja(e,6,1);return this.setAttribute("instanceColorStart",new ii(n,3,0)),this.setAttribute("instanceColorEnd",new ii(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new M_(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),ih.setFromBufferAttribute(e),this.boundingBox.union(ih))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Li),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Sr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Sr)),Sr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Sr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}mt.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new vt(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};je.line={uniforms:bl.merge([mt.common,mt.fog,mt.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class Ka extends Hn{static get type(){return"LineMaterial"}constructor(t){super({uniforms:bl.clone(je.line.uniforms),vertexShader:je.line.vertexShader,fragmentShader:je.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Wo=new ce,sh=new I,rh=new I,Le=new ce,Pe=new ce,yn=new ce,$o=new I,jo=new ae,Ie=new R_,oh=new I,Mr=new Wn,br=new Li,Sn=new ce;let En,Mi;function ah(i,t,e){return Sn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),Sn.multiplyScalar(1/Sn.w),Sn.x=Mi/e.width,Sn.y=Mi/e.height,Sn.applyMatrix4(i.projectionMatrixInverse),Sn.multiplyScalar(1/Sn.w),Math.abs(Math.max(Sn.x,Sn.y))}function L_(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){Ie.start.fromBufferAttribute(s,a),Ie.end.fromBufferAttribute(r,a),Ie.applyMatrix4(e);const c=new I,h=new I;En.distanceSqToSegment(Ie.start,Ie.end,h,c),h.distanceTo(c)<Mi*.5&&t.push({point:h,pointOnLine:c,distance:En.origin.distanceTo(h),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function P_(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),d=-t.near;En.at(1,yn),yn.w=1,yn.applyMatrix4(t.matrixWorldInverse),yn.applyMatrix4(n),yn.multiplyScalar(1/yn.w),yn.x*=r.x/2,yn.y*=r.y/2,yn.z=0,$o.copy(yn),jo.multiplyMatrices(t.matrixWorldInverse,o);for(let u=0,f=h;u<f;u++){if(Le.fromBufferAttribute(l,u),Pe.fromBufferAttribute(c,u),Le.w=1,Pe.w=1,Le.applyMatrix4(jo),Pe.applyMatrix4(jo),Le.z>d&&Pe.z>d)continue;if(Le.z>d){const _=Le.z-Pe.z,S=(Le.z-d)/_;Le.lerp(Pe,S)}else if(Pe.z>d){const _=Pe.z-Le.z,S=(Pe.z-d)/_;Pe.lerp(Le,S)}Le.applyMatrix4(n),Pe.applyMatrix4(n),Le.multiplyScalar(1/Le.w),Pe.multiplyScalar(1/Pe.w),Le.x*=r.x/2,Le.y*=r.y/2,Pe.x*=r.x/2,Pe.y*=r.y/2,Ie.start.copy(Le),Ie.start.z=0,Ie.end.copy(Pe),Ie.end.z=0;const g=Ie.closestPointToPointParameter($o,!0);Ie.at(g,oh);const m=gi.lerp(Le.z,Pe.z,g),v=m>=-1&&m<=1,M=$o.distanceTo(oh)<Mi*.5;if(v&&M){Ie.start.fromBufferAttribute(l,u),Ie.end.fromBufferAttribute(c,u),Ie.start.applyMatrix4(o),Ie.end.applyMatrix4(o);const _=new I,S=new I;En.distanceSqToSegment(Ie.start,Ie.end,S,_),e.push({point:S,pointOnLine:_,distance:En.origin.distanceTo(S),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class D_ extends Te{constructor(t=new Du,e=new Ka({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)sh.fromBufferAttribute(e,o),rh.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+sh.distanceTo(rh);const r=new Ja(s,2,1);return t.setAttribute("instanceDistanceStart",new ii(r,1,0)),t.setAttribute("instanceDistanceEnd",new ii(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;En=t.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;Mi=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),br.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=Mi*.5;else{const d=Math.max(s.near,br.distanceToPoint(En.origin));c=ah(s,d,l.resolution)}if(br.radius+=c,En.intersectsSphere(br)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),Mr.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=Mi*.5;else{const d=Math.max(s.near,Mr.distanceToPoint(En.origin));h=ah(s,d,l.resolution)}Mr.expandByScalar(h),En.intersectsBox(Mr)!==!1&&(n?L_(this,e):P_(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(Wo),this.material.uniforms.resolution.value.set(Wo.z,Wo.w))}}class I_ extends be{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new vt(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}}const ji=new I,lh=new ae,ch=new ae,hh=new I,uh=new I;class U_{constructor(t={}){const e=this;let n,s,r,o;const a={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:n,height:s}},this.render=function(p,g){p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld(),g.parent===null&&g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),lh.copy(g.matrixWorldInverse),ch.multiplyMatrices(g.projectionMatrix,lh),h(p,p,g),f(p)},this.setSize=function(p,g){n=p,s=g,r=n/2,o=s/2,l.style.width=p+"px",l.style.height=g+"px"};function c(p){p.isCSS2DObject&&(p.element.style.display="none");for(let g=0,m=p.children.length;g<m;g++)c(p.children[g])}function h(p,g,m){if(p.visible===!1){c(p);return}if(p.isCSS2DObject){ji.setFromMatrixPosition(p.matrixWorld),ji.applyMatrix4(ch);const v=ji.z>=-1&&ji.z<=1&&p.layers.test(m.layers)===!0,M=p.element;M.style.display=v===!0?"":"none",v===!0&&(p.onBeforeRender(e,g,m),M.style.transform="translate("+-100*p.center.x+"%,"+-100*p.center.y+"%)translate("+(ji.x*r+r)+"px,"+(-ji.y*o+o)+"px)",M.parentNode!==l&&l.appendChild(M),p.onAfterRender(e,g,m));const _={distanceToCameraSquared:d(m,p)};a.objects.set(p,_)}for(let v=0,M=p.children.length;v<M;v++)h(p.children[v],g,m)}function d(p,g){return hh.setFromMatrixPosition(p.matrixWorld),uh.setFromMatrixPosition(g.matrixWorld),hh.distanceToSquared(uh)}function u(p){const g=[];return p.traverseVisible(function(m){m.isCSS2DObject&&g.push(m)}),g}function f(p){const g=u(p).sort(function(v,M){if(v.renderOrder!==M.renderOrder)return M.renderOrder-v.renderOrder;const _=a.objects.get(v).distanceToCameraSquared,S=a.objects.get(M).distanceToCameraSquared;return _-S}),m=g.length;for(let v=0,M=g.length;v<M;v++)g[v].element.style.zIndex=m-v}}}const Iu={rect:["Depth d","Width b"],circle:["Diameter D"],pipe:["Outer diameter D","Wall thickness t"],I:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],box:["Depth d","Width b","Flange thick. tf","Web thick. tw"],unp:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],C:["Depth d","Flange width b","Lip length c","Thickness t"],general:["A","I33","I22","J"]},jr=(i,t)=>i==="general"?t===0?"A":"L4":"L",Ds={rect:"Rectangle",circle:"Circle",pipe:"Pipe",I:"I / Wide flange",box:"Box / Tube",unp:"UNP / Channel",C:"C / Lipped channel",general:"General"};function N_(i,t){const e=Math.max(i,t),n=Math.min(i,t);return e<=0?0:e*n**3*(1/3-.21*(n/e)*(1-n**4/(12*e**4)))}function Uu(i){const t=i.dims;if(i.shape==="unp"){const[o,a,l,c]=t;return[[0,c,-o/2+l,o/2-l],[0,a,o/2-l,o/2],[0,a,-o/2,-o/2+l]]}const[e,n,s,r]=t;return[[0,r,-e/2,e/2],[r,n,e/2-r,e/2],[r,n,-e/2,-e/2+r],[n-r,n,e/2-s,e/2-r],[n-r,n,-e/2+r,-e/2+s]]}function Nu(i){let t=0,e=0;for(const[a,l,c,h]of i){const d=(l-a)*(h-c);t+=d,e+=d*(a+l)/2}const n=t>0?e/t:0;let s=0,r=0,o=0;for(const[a,l,c,h]of i){const d=l-a,u=h-c,f=d*u,p=(c+h)/2,g=(a+l)/2-n;s+=d*u**3/12+f*p*p,r+=u*d**3/12+f*g*g,o+=Math.max(d,u)*Math.min(d,u)**3/3}return{A:t,I33:s,I22:r,J:o,xc:n}}function F_(i){return i.shape==="unp"||i.shape==="C"?Nu(Uu(i)).xc:0}function Fu(i){if(i.shape!=="unp"&&i.shape!=="C")return null;const t=F_(i);let e;if(i.shape==="unp"){const[n,s,r,o]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[o,-n/2+r],[o,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}else{const[n,s,r,o]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[s-o,-n/2+r],[s-o,-n/2+o],[o,-n/2+o],[o,n/2-o],[s-o,n/2-o],[s-o,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}return e.map(([n,s])=>[n-t,s])}function Ai(i){const t=Dl(i),e=i.props;return!e||i.shape==="general"?t:{...t,A:e.A,I33:e.I33,I22:e.I22,J:e.J}}function Dl(i){const t=i.dims;switch(i.shape){case"rect":{const[e,n]=t,s=n*e;return{A:s,I33:n*e**3/12,I22:e*n**3/12,J:N_(e,n),As2:5/6*s,As3:5/6*s,depth:e,width:n}}case"circle":{const[e]=t,n=Math.PI*e**4/64,s=Math.PI*e*e/4;return{A:s,I33:n,I22:n,J:2*n,As2:.9*s,As3:.9*s,depth:e,width:e}}case"pipe":{const[e,n]=t,s=Math.max(e-2*n,0),r=Math.PI*(e**4-s**4)/64,o=Math.PI*(e*e-s*s)/4;return{A:o,I33:r,I22:r,J:2*r,As2:o/2,As3:o/2,depth:e,width:e}}case"I":{const[e,n,s,r]=t,o=e-2*s;return{A:2*n*s+o*r,I33:(n*e**3-(n-r)*o**3)/12,I22:2*s*n**3/12+o*r**3/12,J:(2*n*s**3+(e-s)*r**3)/3,As2:e*r,As3:5/3*n*s,depth:e,width:n}}case"box":{const[e,n,s,r]=t,o=e-2*s,a=n-2*r,l=n*r+e*s-r*r-s*s;return{A:n*e-a*o,I33:(n*e**3-a*o**3)/12,I22:(e*n**3-o*a**3)/12,J:l>0?2*r*s*(n-r)**2*(e-s)**2/l:0,As2:2*e*r,As3:2*n*s,depth:e,width:n}}case"unp":case"C":{const e=Nu(Uu(i)),[n,s]=i.shape==="unp"?[t[2],t[3]]:[t[3],t[3]];return{A:e.A,I33:e.I33,I22:e.I22,J:e.J,As2:t[0]*s,As3:5/3*t[1]*n,depth:t[0],width:t[1]}}case"general":{const[e,n,s,r]=t,o=Math.sqrt(Math.max(e,1e-6));return{A:e,I33:n,I22:s,J:r,As2:0,As3:0,depth:o,width:o}}}}function Qa(i){const t=Iu[i.shape].length;if(i.dims.length<t)return"Missing dimensions";if(i.dims.slice(0,t).some(n=>!(n>0)))return"All dimensions must be positive";if(i.shape==="pipe"&&2*i.dims[1]>=i.dims[0])return"Wall too thick for diameter";if((i.shape==="I"||i.shape==="box")&&2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.shape==="I"&&i.dims[3]>=i.dims[1])return"Web thicker than flange width";if(i.shape==="box"&&2*i.dims[3]>=i.dims[1])return"Webs too thick for width";if(i.shape==="unp"){if(2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.dims[3]>=i.dims[1])return"Web thicker than flange width"}if(i.shape==="C"){const[n,s,r,o]=i.dims;if(2*o>=n)return"Thickness too large for depth";if(2*o>=s)return"Thickness too large for flange width";if(r<=o)return"Lip must be longer than the thickness";if(2*r>=n)return"Lips too long for depth"}const e=i.props;return e&&![e.A,e.I33,e.I22,e.J].every(n=>Number.isFinite(n)&&n>0)?"Published A, I33, I22 and J must be positive":null}const Is=(i,t)=>[i[0]-t[0],i[1]-t[1],i[2]-t[2]],Bn=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],si=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],ks=i=>Math.hypot(i[0],i[1],i[2]),ei=(i,t)=>[i[0]*t,i[1]*t,i[2]*t],dh=(i,t)=>[i[0]+t[0],i[1]+t[1],i[2]+t[2]],Xr=i=>ei(i,1/ks(i));function tl(i,t,e){const n=Is(t,i),s=ks(n),r=ei(n,1/s);let o,a;if(Math.hypot(n[0],n[1])<=1e-6*s?(o=[1,0,0],a=Xr(si(r,o)),o=si(a,r)):(a=Xr(si(r,[0,0,1])),o=si(a,r)),e){const l=e*Math.PI/180,c=Math.cos(l),h=Math.sin(l),d=dh(ei(o,c),ei(a,h)),u=dh(ei(o,-h),ei(a,c));o=d,a=u}return[r,o,a]}function qr(i,t,e,n,s){return n>0&&t>0?12*i*e/(t*n*s*s):0}function O_(i,t,e,n,s,r,o,a=0,l=0){const c=new Float64Array(144),h=(v,M,_)=>{c[v*12+M]=_,c[M*12+v]=_},d=i*e/o;h(0,0,d),h(0,6,-d),h(6,6,d);const u=t*r/o;h(3,3,u),h(3,9,-u),h(9,9,u);const f=qr(i,t,s,a,o),p=i*s/(o**3*(1+f));h(1,1,12*p),h(1,5,6*p*o),h(1,7,-12*p),h(1,11,6*p*o),h(5,5,(4+f)*p*o*o),h(5,7,-6*p*o),h(5,11,(2-f)*p*o*o),h(7,7,12*p),h(7,11,-6*p*o),h(11,11,(4+f)*p*o*o);const g=qr(i,t,n,l,o),m=i*n/(o**3*(1+g));return h(2,2,12*m),h(2,4,-6*m*o),h(2,8,-12*m),h(2,10,-6*m*o),h(4,4,(4+g)*m*o*o),h(4,8,6*m*o),h(4,10,(2-g)*m*o*o),h(8,8,12*m),h(8,10,6*m*o),h(10,10,(4+g)*m*o*o),c}function B_(i){return[...i[0],...i[1],...i[2]]}function z_(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s*3]*t[n*3]+i[s*3+1]*t[n*3+1]+i[s*3+2]*t[n*3+2];return e}function fh(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s]*t[n*3]+i[3+s]*t[n*3+1]+i[6+s]*t[n*3+2];return e}function ph(i,t){const e=new Float64Array(144);for(let r=0;r<4;r++)for(let o=0;o<3;o++)for(let a=0;a<3;a++)e[(r*3+o)*12+r*3+a]=t[o*3+a];const n=new Float64Array(144);for(let r=0;r<12;r++)for(let o=0;o<12;o++){let a=0;for(let l=0;l<12;l++)a+=i[r*12+l]*e[l*12+o];n[r*12+o]=a}const s=new Float64Array(144);for(let r=0;r<12;r++)for(let o=0;o<12;o++){let a=0;for(let l=0;l<12;l++)a+=e[l*12+r]*n[l*12+o];s[r*12+o]=a}return s}function mh(i,t,e,n,s=0,r=0){const o=e-t;n[0]+=-i[0]*o/e,n[6]+=-i[0]*t/e;const a=h=>{const d=e*e*(1+h),u=t*o*(o+h*e/2)/d,f=t*o*(t+h*e/2)/d;return{mi:u,mj:f,vi:o/e+(u-f)/e,vj:t/e-(u-f)/e}},l=a(s);n[1]+=-i[1]*l.vi,n[5]+=-i[1]*l.mi,n[7]+=-i[1]*l.vj,n[11]+=i[1]*l.mj;const c=a(r);n[2]+=-i[2]*c.vi,n[4]+=i[2]*c.mi,n[8]+=-i[2]*c.vj,n[10]+=-i[2]*c.mj}const Ou=[{x:-Math.sqrt(3/5),w:5/9},{x:0,w:8/9},{x:Math.sqrt(3/5),w:5/9}];function k_(i,t){var r;const e=i.length;if(e===0)return[];const n=((r=t[0])==null?void 0:r.length)??0,s=Array.from({length:e},(o,a)=>[...i[a],...t[a]]);for(let o=0;o<e;o++){let a=o,l=Math.abs(s[o][o]);for(let h=o+1;h<e;h++){const d=Math.abs(s[h][o]);d>l&&(l=d,a=h)}if(l<1e-12)return null;if(a!==o){const h=s[o];s[o]=s[a],s[a]=h}const c=s[o][o];for(let h=o;h<e+n;h++)s[o][h]/=c;for(let h=0;h<e;h++){if(h===o)continue;const d=s[h][o];if(!(Math.abs(d)<1e-18))for(let u=o;u<e+n;u++)s[h][u]-=d*s[o][u]}}return s.map(o=>o.slice(e))}function V_(i,t,e){const n=[],s=[];for(let g=0;g<6;g++)t&&t[g]?n.push(g):s.push(g);for(let g=0;g<6;g++)e&&e[g]?n.push(6+g):s.push(6+g);if(n.length===0)return{retained:s,released:n,W:[],invKee:[],klCondensed:new Float64Array(i)};if(s.length===0)return null;const r=n.length,o=s.length,a=Array.from({length:r},(g,m)=>Array.from({length:r},(v,M)=>i[n[m]*12+n[M]])),l=Array.from({length:r},(g,m)=>Array.from({length:o},(v,M)=>i[n[m]*12+s[M]])),c=Array.from({length:r},(g,m)=>Array.from({length:r},(v,M)=>m===M?1:0)),h=l.map((g,m)=>[...g,...c[m]]),d=k_(a,h);if(!d)return null;const u=d.map(g=>g.slice(0,o)),f=d.map(g=>g.slice(o)),p=new Float64Array(144);for(let g=0;g<o;g++){const m=s[g];for(let v=0;v<o;v++){const M=s[v];let _=0;for(let S=0;S<r;S++)_+=l[S][g]*u[S][v];p[m*12+M]=i[m*12+M]-_}}for(let g=0;g<o;g++){const m=s[g];for(let v=g+1;v<o;v++){const M=s[v],_=.5*(p[m*12+M]+p[M*12+m]);p[m*12+M]=_,p[M*12+m]=_}}return{retained:s,released:n,W:u,invKee:f,klCondensed:p}}function G_(i,t){if(t.released.length===0)return new Float64Array(i);const e=t.released.length,n=t.retained.length,s=new Array(e);for(let o=0;o<e;o++)s[o]=i[t.released[o]];const r=new Float64Array(12);for(let o=0;o<n;o++){const a=t.retained[o];let l=0;for(let c=0;c<e;c++)l+=t.W[c][o]*s[c];r[a]=i[a]-l}return r}function H_(i,t,e){if(e.released.length===0)return new Float64Array(i);const n=e.released.length,s=e.retained.length,r=new Array(s);for(let c=0;c<s;c++)r[c]=i[e.retained[c]];const o=new Array(n);for(let c=0;c<n;c++)o[c]=t[e.released[c]];const a=new Array(n);for(let c=0;c<n;c++){let h=0;for(let u=0;u<n;u++)h+=e.invKee[c][u]*o[u];let d=0;for(let u=0;u<s;u++)d+=e.W[c][u]*r[u];a[c]=-h-d}const l=new Float64Array(12);for(let c=0;c<s;c++)l[e.retained[c]]=r[c];for(let c=0;c<n;c++)l[e.released[c]]=a[c];return l}function Bu(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a,c=l>0?Math.min(1,Math.max(0,((i-e)*o+(t-n)*a)/l)):0;return Math.hypot(i-e-o*c,t-n-a*c)}function W_(i,t,e,n){const s=[t.x-i.x,t.y-i.y,t.z-i.z],r=[n.x-e.x,n.y-e.y,n.z-e.z],o=[i.x-e.x,i.y-e.y,i.z-e.z],a=Bn(s,s),l=Bn(r,r),c=Bn(r,o),h=m=>Math.min(1,Math.max(0,m));let d,u;if(a<1e-24&&l<1e-24)d=u=0;else if(a<1e-24)d=0,u=h(c/l);else{const m=Bn(s,o);if(l<1e-24)u=0,d=h(-m/a);else{const v=Bn(s,r),M=a*l-v*v;d=M>1e-24*a*l?h((v*c-m*l)/M):0,u=(v*d+c)/l,u<0?(u=0,d=h(-m/a)):u>1&&(u=1,d=h((v-m)/a))}}const f=i.x+s[0]*d-(e.x+r[0]*u),p=i.y+s[1]*d-(e.y+r[1]*u),g=i.z+s[2]*d-(e.z+r[2]*u);return{s:d,t:u,dist:Math.hypot(f,p,g)}}function $_(i,t,e,n){const s=W_(i,t,e,n);if(s.dist>bn)return null;const r=Math.hypot(t.x-i.x,t.y-i.y,t.z-i.z),o=Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z);return s.s*r<=bn||(1-s.s)*r<=bn||s.t*o<=bn||(1-s.t)*o<=bn?null:{x:i.x+(t.x-i.x)*s.s,y:i.y+(t.y-i.y)*s.s,z:i.z+(t.z-i.z)*s.s,ta:s.s,tb:s.t}}const gh=9.80665,Xo=.0044482216152605,ls=[{id:"kN-m",label:"kN, m",force:"kN",length:"m",kF:1,kL:1,small:"mm",kSmall:.001},{id:"N-mm",label:"N, mm",force:"N",length:"mm",kF:.001,kL:.001,small:"mm",kSmall:.001},{id:"tonf-m",label:"ton, m",force:"tonf",length:"m",kF:gh,kL:1,small:"mm",kSmall:.001},{id:"kgf-mm",label:"kg, mm",force:"kgf",length:"mm",kF:gh/1e3,kL:.001,small:"mm",kSmall:.001},{id:"kip-ft",label:"kip, ft",force:"kip",length:"ft",kF:Xo*1e3,kL:.3048,small:"in",kSmall:.0254},{id:"kip-in",label:"kip, in",force:"kip",length:"in",kF:Xo*1e3,kL:.0254,small:"in",kSmall:.0254},{id:"lb-in",label:"lb, in",force:"lb",length:"in",kF:Xo,kL:.0254,small:"in",kSmall:.0254}],el=ls[0],j_={L:[0,1],F:[1,0],M:[1,1],FL:[1,-1],FA:[1,-2],FV:[1,-3],A:[0,2],L4:[0,4],MR:[1,1]},zu="structapp3d.units";function ku(i){return ls.find(t=>t.id===i)}function X_(){var i;try{return ku((i=globalThis.localStorage)==null?void 0:i.getItem(zu))??el}catch{return el}}let Ti=X_();const nl=new Set,Ve=()=>Ti;function vh(i){var e;const t=ku(i);if(!(!t||t===Ti)){Ti=t;try{(e=globalThis.localStorage)==null||e.setItem(zu,i)}catch{}for(const n of nl)n(t)}}function q_(i){return nl.add(i),()=>nl.delete(i)}function Vu(i,t=Ti){const[e,n]=j_[i];return t.kF**e*t.kL**n}const Il=(i,t,e=Ti)=>i/Vu(t,e),Gu=(i,t,e=Ti)=>i*Vu(t,e),Y_={2:"²",3:"³",4:"⁴"};function Yt(i,t=Ti,e=!1){const n=t.force,s=t.length,r=o=>e?String(o):Y_[o];switch(i){case"L":return s;case"F":return n;case"M":return`${n}${e?"-":"·"}${s}`;case"FL":return`${n}/${s}`;case"FA":return`${n}/${s}${r(2)}`;case"FV":return`${n}/${s}${r(3)}`;case"A":return`${s}${r(2)}`;case"L4":return`${s}${r(4)}`;case"MR":return`${n}${e?"-":"·"}${s}/rad`}}function Qe(i,t=4){if(!Number.isFinite(i))return"—";if(Math.abs(i)<1e-12)return"0";const e=Math.abs(i);return e>=1e5||e<.001?i.toExponential(t-1):String(Number(i.toPrecision(t)))}const jt=(i,t,e=4)=>Qe(Il(i,t),e),ye=(i,t,e=4)=>`${jt(i,t,e)} ${Yt(t)}`,J_=(i,t)=>Number(Il(i,t).toPrecision(10)),Ue=(i,t)=>`${i}:${t}`;function Yr(i){const[t,e]=i.split(":");return{kind:t,id:Number(e)}}const il=["P","V2","V3","T","M2","M3"],Hu={bg:988970,grid:1976635,gridMajor:3359061,joint:3718648,frame:14870768,area:2278750,sel:16096779,load:16007006,support:2278750,reaction:11032055,pos:3900150,neg:15680580,deformed:16436245,ghost:4674921},Z_={bg:16317180,grid:14870768,gridMajor:13358561,joint:165063,frame:1976635,area:1483594,sel:15357964,load:14753096,support:1409085,reaction:8266446,pos:2450411,neg:14427686,deformed:13273604,ghost:9741240},_h=[9741240,6333946,16020150,3462041,16498468,10980346,16486972,3003583],Kt=i=>Array.isArray(i)?new I(i[0],i[1],i[2]):new I(i.x,i.y,i.z),Er=i=>[i.x,i.y,i.z];function xh(i,t){switch(i){case"GX":return new I(1,0,0);case"GY":return new I(0,1,0);case"GZ":return new I(0,0,1);case"GRAV":return new I(0,0,-1);case"L1":return Kt(t[0]);case"L2":return Kt(t[1]);case"L3":return Kt(t[2])}}function ro(i){const t=document.createElement("canvas");t.width=t.height=64;const e=t.getContext("2d");i(e);const n=new Hv(t);return n.colorSpace=Ze,n}function K_(){return ro(i=>{i.beginPath(),i.arc(32,32,28,0,Math.PI*2),i.fillStyle="#fff",i.fill(),i.lineWidth=6,i.strokeStyle="rgba(0,0,0,0.55)",i.stroke()})}function Q_(){return ro(i=>{i.beginPath(),i.moveTo(32,5),i.lineTo(60,56),i.lineTo(4,56),i.closePath(),i.fillStyle="#fff",i.fill(),i.lineWidth=5,i.strokeStyle="rgba(0,0,0,0.55)",i.stroke()})}function tx(){return ro(i=>{i.lineCap="round";for(const[t,e]of[[18,"rgba(0,0,0,0.55)"],[10,"#fff"]])i.beginPath(),i.moveTo(10,10),i.lineTo(54,54),i.moveTo(54,10),i.lineTo(10,54),i.lineWidth=t,i.strokeStyle=e,i.stroke()})}function ex(){return ro(i=>{i.beginPath(),i.arc(32,32,20,0,Math.PI*2),i.fillStyle="rgba(15, 23, 42, 0.9)",i.fill(),i.lineWidth=8,i.strokeStyle="#38bdf8",i.stroke()})}function nx(i){const t=i.dims,e=(n,s,r)=>{r.moveTo(-n/2,-s/2),r.lineTo(n/2,-s/2),r.lineTo(n/2,s/2),r.lineTo(-n/2,s/2),r.closePath()};switch(i.shape){case"rect":{const n=new Qn;return e(t[1],t[0],n),n}case"circle":{const n=new Qn;return n.absarc(0,0,t[0]/2,0,Math.PI*2,!1),n}case"pipe":{const n=new Qn;n.absarc(0,0,t[0]/2,0,Math.PI*2,!1);const s=new $r;return s.absarc(0,0,t[0]/2-t[1],0,Math.PI*2,!0),n.holes.push(s),n}case"box":{const n=new Qn;e(t[1],t[0],n);const s=new $r;return e(t[1]-2*t[3],t[0]-2*t[2],s),n.holes.push(s),n}case"I":{const[n,s,r,o]=t,a=new Qn,l=[[-s/2,-n/2],[s/2,-n/2],[s/2,-n/2+r],[o/2,-n/2+r],[o/2,n/2-r],[s/2,n/2-r],[s/2,n/2],[-s/2,n/2],[-s/2,n/2-r],[-o/2,n/2-r],[-o/2,-n/2+r],[-s/2,-n/2+r]];a.moveTo(...l[0]);for(const c of l.slice(1))a.lineTo(...c);return a.closePath(),a}case"unp":case"C":{const n=Fu(i),s=new Qn;s.moveTo(...n[0]);for(const r of n.slice(1))s.lineTo(...r);return s.closePath(),s}case"general":{const n=Ai(i),s=new Qn;return e(n.width,n.depth,s),s}}}class ix{constructor(t){lt(this,"renderer");lt(this,"labels");lt(this,"scene",new Vv);lt(this,"persp",new nn(45,1,.01,1e5));lt(this,"ortho",new wl(-1,1,1,-1,.001,1e6));lt(this,"camera",this.persp);lt(this,"useOrtho",!1);lt(this,"target",new I);lt(this,"azimuth",-Math.PI/3);lt(this,"elevation",Math.PI/6);lt(this,"distance",20);lt(this,"theme",Hu);lt(this,"width",1);lt(this,"height",1);lt(this,"lineMats",[]);lt(this,"gridGroup",new Mn);lt(this,"modelGroup",new Mn);lt(this,"resultGroup",new Mn);lt(this,"overlayGroup",new Mn);lt(this,"jointTex",K_());lt(this,"hingeTex",ex());lt(this,"midTex",Q_());lt(this,"crossTex",tx());lt(this,"renderQueued",!1);lt(this,"animStart",0);lt(this,"deformed",null);lt(this,"data",null);lt(this,"selection",new Set);lt(this,"results",null);lt(this,"display",{jointLabels:!1,frameLabels:!1,areaLabels:!1,showLoads:!0,loadValues:!0,extruded:!1,showSupports:!0});lt(this,"resultOpts",{view:"none",deformScale:1,forceScale:1,animate:!1,showValues:!0});lt(this,"autoDeformScale",1);lt(this,"span",10);this.host=t,this.renderer=new kv({antialias:!0,alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.domElement.className="viewport-canvas",t.appendChild(this.renderer.domElement),this.labels=new U_,this.labels.domElement.className="viewport-labels",t.appendChild(this.labels.domElement),this.persp.up.set(0,0,1),this.ortho.up.set(0,0,1),this.scene.add(new b_(16777215,3359061,1.6));const e=new A_(16777215,1.4);e.position.set(1,-2,3),this.scene.add(e),this.scene.add(this.gridGroup,this.modelGroup,this.resultGroup,this.overlayGroup),new ResizeObserver(()=>this.resize()).observe(t),this.resize()}get canvas(){return this.renderer.domElement}setTheme(t){this.theme=t,this.rebuildAll()}resize(){const t=this.host.getBoundingClientRect();this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer.setSize(this.width,this.height),this.labels.setSize(this.width,this.height);for(const e of this.lineMats)e.resolution.set(this.width,this.height);this.updateCamera()}viewDir(){const t=Math.cos(this.elevation);return new I(t*Math.cos(this.azimuth),t*Math.sin(this.azimuth),Math.sin(this.elevation))}updateCamera(){const t=this.viewDir(),e=this.width/this.height,n=this.distance*Math.tan(gi.degToRad(this.persp.fov/2));this.persp.aspect=e,this.persp.near=Math.max(this.distance/2e3,1e-4),this.persp.far=this.distance*50+this.span*20,this.persp.position.copy(this.target).addScaledVector(t,this.distance),this.persp.lookAt(this.target),this.persp.updateProjectionMatrix();const s=this.distance+this.span*10;this.ortho.left=-n*e,this.ortho.right=n*e,this.ortho.top=n,this.ortho.bottom=-n,this.ortho.near=.001,this.ortho.far=s*2+this.span*10,this.ortho.position.copy(this.target).addScaledVector(t,s),this.ortho.lookAt(this.target),this.ortho.updateProjectionMatrix(),this.camera=this.useOrtho?this.ortho:this.persp,this.requestRender()}setOrtho(t){this.useOrtho=t,this.updateCamera()}orbit(t,e){this.azimuth-=t*.008,this.elevation=gi.clamp(this.elevation+e*.008,-Math.PI/2+.002,Math.PI/2-.002),this.updateCamera()}worldPerPixel(){return 2*this.distance*Math.tan(gi.degToRad(this.persp.fov/2))/this.height}pan(t,e){const n=this.worldPerPixel(),s=this.camera;s.updateMatrixWorld();const r=new I().setFromMatrixColumn(s.matrixWorld,0),o=new I().setFromMatrixColumn(s.matrixWorld,1);this.target.addScaledVector(r,-t*n).addScaledVector(o,e*n),this.updateCamera()}zoom(t,e,n){t=gi.clamp(t,.2,5);const s=gi.clamp(this.distance*t,this.span*.001+.001,this.span*200+100);if(t=s/this.distance,e!==void 0&&n!==void 0){const r=this.pointOnTargetPlane(e,n);r&&this.target.add(r.sub(this.target).multiplyScalar(1-t))}this.distance=s,this.updateCamera()}ndc(t,e){const n=this.canvas.getBoundingClientRect();return new vt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1)}ray(t,e){const n=new C_;return n.setFromCamera(this.ndc(t,e),this.camera),n.ray}pointOnTargetPlane(t,e){const n=new On().setFromNormalAndCoplanarPoint(this.viewDir(),this.target);return this.ray(t,e).intersectPlane(n,new I)}workPlanePoint(t,e,n){if(!this.data)return null;const{workPlane:s}=this.data.settings,r=n??this.data.settings.elevation,o=s==="XY"?new I(0,0,1):s==="XZ"?new I(0,1,0):new I(1,0,0),a=new On(o,-r),l=this.ray(t,e);return Math.abs(l.direction.dot(o))<1e-4?null:l.intersectPlane(a,new I)}toScreen(t){const e=this.canvas.getBoundingClientRect(),n=t.clone().project(this.camera);return{x:e.left+(n.x+1)/2*e.width,y:e.top+(1-n.y)/2*e.height,behind:n.z>1||n.z<-1}}bounds(){const t=new Wn;if(this.data&&this.data.joints.length)for(const e of this.data.joints)t.expandByPoint(Kt(e));else{const e=this.data?this.data.settings.gridSpacing*Math.min(this.data.settings.gridLines,5):5;t.set(new I(-e,-e,0),new I(e,e,0))}return t}fit(){const e=this.bounds().getBoundingSphere(new Li),n=Math.max(e.radius,1);this.target.copy(e.center);const s=gi.degToRad(this.persp.fov/2),r=this.width/this.height,o=n/Math.sin(s),a=n/Math.sin(Math.atan(Math.tan(s)*r));this.distance=Math.max(o,a)*1.08,this.updateCamera()}viewPreset(t){const e={top:[-Math.PI/2,Math.PI/2-.002],front:[-Math.PI/2,0],side:[0,0],iso:[-Math.PI/3,Math.PI/6]};[this.azimuth,this.elevation]=e[t],this.fit()}requestRender(){this.renderQueued||(this.renderQueued=!0,requestAnimationFrame(t=>{if(this.renderQueued=!1,this.resultOpts.animate&&this.deformed){const e=(1+Math.cos((t-this.animStart)/1400*Math.PI*2))/2;this.applyDeformation(e),this.requestRender()}this.renderer.render(this.scene,this.camera),this.labels.render(this.scene,this.camera)}))}clearGroup(t){const e=[...t.children];for(const n of e)t.remove(n),n.traverse(s=>{var a;const r=s;(a=r.geometry)==null||a.dispose();const o=r.material;if(o)for(const l of Array.isArray(o)?o:[o])l!==void 0&&(l instanceof Ka&&(this.lineMats=this.lineMats.filter(c=>c!==l)),l.dispose())})}lineMat(t,e,n={}){const s=new Ka({color:t??16777215,linewidth:e,vertexColors:t===null,transparent:(n.opacity??1)<1,opacity:n.opacity??1,dashed:n.dashed??!1,dashSize:this.span*.02,gapSize:this.span*.015});return s.resolution.set(this.width,this.height),this.lineMats.push(s),s}lines(t,e,n,s,r){const o=new Du;o.setPositions(t),s&&o.setColors(s);const a=new D_(o,this.lineMat(e,n,r));return r!=null&&r.dashed&&a.computeLineDistances(),a}label(t,e,n=""){const s=document.createElement("div");s.className="lbl "+n,s.textContent=t;const r=new I_(s);return r.position.copy(e),r}setData(t,e,n){this.data=t,this.selection=e,this.results=n,this.rebuildAll()}rebuildAll(){if(!this.data)return;this.scene.background=new Jt(this.theme.bg);const t=this.bounds();this.span=Math.max(t.getSize(new I).length(),this.data.settings.gridSpacing*2,.001),this.computeAutoScales(),this.buildGrid(),this.buildModel(),this.buildResults(),this.requestRender()}glyph(){return this.span*.035}buildGrid(){this.clearGroup(this.gridGroup);const t=this.data,{gridSpacing:e,gridLines:n,workPlane:s,elevation:r}=t.settings,o=[],a=[],l=e*n,c=(u,f)=>s==="XY"?[u,f,r]:s==="XZ"?[u,r,f]:[r,u,f];for(let u=-n;u<=n;u++)(u===0?a:o).push(...c(u*e,-l),...c(u*e,l),...c(-l,u*e),...c(l,u*e));this.gridGroup.add(this.lines(o,this.theme.grid,1)),this.gridGroup.add(this.lines(a,this.theme.gridMajor,1.5));const h=Math.max(e,this.span*.08),d=this.lines([0,0,0,h,0,0,0,0,0,0,h,0,0,0,0,0,0,h],null,3,[1,.25,.25,1,.25,.25,.3,.85,.3,.3,.85,.3,.3,.5,1,.3,.5,1]);this.gridGroup.add(d),this.gridGroup.add(this.label("X",new I(h*1.15,0,0),"axis x")),this.gridGroup.add(this.label("Y",new I(0,h*1.15,0),"axis y")),this.gridGroup.add(this.label("Z",new I(0,0,h*1.15),"axis z"))}buildModel(){this.clearGroup(this.modelGroup);const t=this.data,e=this.theme,n=this.selection,s=new Map(t.joints.map(h=>[h.id,h])),r=this.results&&this.resultOpts.view!=="none"&&this.resultOpts.view!=="reactions",o=new Jt(e.sel);for(const h of t.areas){const d=h.joints.map(m=>s.get(m)).filter(Boolean).map(m=>Kt(m));if(d.length<3)continue;const u=[];for(let m=1;m<d.length-1;m++)u.push(...d[0].toArray(),...d[m].toArray(),...d[m+1].toArray());const f=new Re;f.setAttribute("position",new me(u,3));const p=n.has(Ue("a",h.id)),g=new Te(f,new Ts({color:p?e.sel:e.area,transparent:!0,opacity:r?.08:p?.45:.22,side:dn,depthWrite:!1}));if(g.renderOrder=-1,this.modelGroup.add(g),this.display.areaLabels){const m=d.reduce((v,M)=>v.add(M),new I).multiplyScalar(1/d.length);this.modelGroup.add(this.label("A"+h.id,m,"area"))}}const a=[],l=[],c=new Jt(r?e.ghost:e.frame);for(const h of t.frames){const d=s.get(h.i),u=s.get(h.j);if(!d||!u)continue;a.push(d.x,d.y,d.z,u.x,u.y,u.z);const f=n.has(Ue("f",h.id))?o:c;l.push(f.r,f.g,f.b,f.r,f.g,f.b),this.display.frameLabels&&this.modelGroup.add(this.label("F"+h.id,Kt(d).add(Kt(u)).multiplyScalar(.5),"frame"))}if(a.length&&(this.display.extruded&&!r?this.buildExtruded(t,s):this.modelGroup.add(this.lines(a,null,this.display.extruded?2:3,l)),this.display.extruded&&!r)){const h=[];for(const d of t.frames){if(!n.has(Ue("f",d.id)))continue;const u=s.get(d.i),f=s.get(d.j);h.push(u.x,u.y,u.z,f.x,f.y,f.z)}h.length&&this.modelGroup.add(this.lines(h,e.sel,4))}if(!r){const h=[];for(const d of t.frames){const u=s.get(d.i),f=s.get(d.j);if(!u||!f)continue;const p=f.x-u.x,g=f.y-u.y,m=f.z-u.z,v=Math.hypot(p,g,m);if(v<=1e-6)continue;const M=Math.min(.08,.3/v);d.relI&&d.relI.some(Boolean)&&h.push(u.x+p*M,u.y+g*M,u.z+m*M),d.relJ&&d.relJ.some(Boolean)&&h.push(f.x-p*M,f.y-g*M,f.z-m*M)}if(h.length){const d=new Re;d.setAttribute("position",new me(h,3));const u=new zo(d,new Or({size:11,sizeAttenuation:!1,map:this.hingeTex,transparent:!0,alphaTest:.1,depthTest:!1}));this.modelGroup.add(u)}}if(t.joints.length){const h=[],d=[],u=new Jt(e.joint);for(const g of t.joints){h.push(g.x,g.y,g.z);const m=n.has(Ue("j",g.id))?o:u;if(d.push(m.r,m.g,m.b),this.display.jointLabels){const v=this.label(String(g.id),Kt(g),"joint");this.modelGroup.add(v)}}const f=new Re;f.setAttribute("position",new me(h,3)),f.setAttribute("color",new me(d,3));const p=new zo(f,new Or({size:13,sizeAttenuation:!1,map:this.jointTex,vertexColors:!0,alphaTest:.5,transparent:!0,depthTest:!1}));p.renderOrder=10,this.modelGroup.add(p)}this.display.showSupports&&this.buildSupports(t),this.display.showLoads&&!(this.results&&this.resultOpts.view!=="none")&&(this.buildLoads(t,s),this.buildDisplacements(t,s))}buildExtruded(t,e){const n=new Map(t.sections.map((o,a)=>[o.name,a])),s=new Map,r=(o,a)=>{let l=s.get(o);return l||(l=new Zc({color:a,roughness:.6,metalness:.1}),s.set(o,l)),l};for(const o of t.frames){const a=e.get(o.i),l=e.get(o.j),c=t.sections.find(M=>M.name===o.section);if(!a||!l||!c)continue;const h=nx(c);if(!h)continue;const d=Math.hypot(l.x-a.x,l.y-a.y,l.z-a.z),u=new Ll(h,{depth:d,bevelEnabled:!1,curveSegments:16}),f=tl(Er(a),Er(l),o.beta),g=this.selection.has(Ue("f",o.id))?this.theme.sel:_h[(n.get(c.name)??0)%_h.length],m=new Te(u,r(String(g),g)),v=new ae().makeBasis(Kt(f[2]).negate(),Kt(f[1]),Kt(f[0]));v.setPosition(a.x,a.y,a.z),m.applyMatrix4(v),this.modelGroup.add(m)}}arrow(t,e,n,s=2,r=!1){const o=new Mn,a=e.clone().sub(t),l=a.length();if(l<1e-12)return o;a.normalize();const c=Math.min(l*.35,this.glyph()*.6),h=c*.35,d=e.clone().addScaledVector(a,-c*(r?1.6:.9));o.add(this.lines([...t.toArray(),...d.toArray()],n,s));const u=new Ts({color:n}),f=r?[e,e.clone().addScaledVector(a,-c*.8)]:[e];for(const p of f){const g=new Te(new Ls(h,c,12),u.clone());g.position.copy(p).addScaledVector(a,-c/2),g.quaternion.setFromUnitVectors(new I(0,1,0),a),o.add(g)}return u.dispose(),o}buildSupports(t){const e=this.glyph(),n=this.theme.support;for(const s of t.joints){if(s.k&&this.buildSprings(s,e,n),!s.r.some(Boolean))continue;const r=s.r[0]&&s.r[1]&&s.r[2],o=s.r[3]&&s.r[4]&&s.r[5],a=Kt(s),l=new Zc({color:n,roughness:.7});let c;if(r&&o)c=new Te(new ds(e*1.6,e*1.6,e*.5),l),c.position.copy(a).add(new I(0,0,-e*.25));else if(r){const h=new Te(new Ls(e*.7,e*1.1,4),l);h.rotation.x=Math.PI/2,h.position.copy(a).add(new I(0,0,-e*.55)),c=h}else{const h=new Mn,d=new Te(new Ls(e*.55,e*.8,4),l);d.rotation.x=Math.PI/2,d.position.set(0,0,-e*.4);const u=new Te(new Pl(e*.22,12,8),l);u.position.set(0,0,-e*1),h.add(d,u),h.position.copy(a),c=h}this.modelGroup.add(c)}}buildSprings(t,e,n){const s=Kt(t),r=[new I(1,0,0),new I(0,1,0),new I(0,0,1)],o=a=>Math.abs(a.z)>.9?new I(1,0,0):new I(0,0,1);for(let a=0;a<3;a++){if(!(t.k[a]>0)||t.r[a])continue;const l=r[a].clone().negate(),c=o(l),h=e*1.8,d=6,u=[s.clone(),s.clone().addScaledVector(l,h*.15)];for(let m=1;m<d;m++)u.push(s.clone().addScaledVector(l,h*(.15+.7*m/d)).addScaledVector(c,(m%2?1:-1)*e*.3));u.push(s.clone().addScaledVector(l,h*.85),s.clone().addScaledVector(l,h));const f=[];for(let m=0;m<u.length-1;m++)f.push(...u[m].toArray(),...u[m+1].toArray());const p=s.clone().addScaledVector(l,h),g=new I().crossVectors(l,c);for(const m of[c,g])f.push(...p.clone().addScaledVector(m,-e*.4).toArray(),...p.clone().addScaledVector(m,e*.4).toArray());this.modelGroup.add(this.lines(f,n,2))}for(let a=3;a<6;a++){if(!(t.k[a]>0)||t.r[a])continue;const l=r[a-3],c=o(l),h=new I().crossVectors(l,c),d=[];let u=null;for(let f=0;f<=40;f++){const p=f/40*Math.PI*4,g=e*(.15+.55*f/40),m=s.clone().addScaledVector(c,Math.cos(p)*g).addScaledVector(h,Math.sin(p)*g).addScaledVector(l,e*.4);u&&d.push(...u.toArray(),...m.toArray()),u=m}this.modelGroup.add(this.lines(d,n,1.5))}}buildDisplacements(t,e){const n=this.glyph(),s=11032055,r=n*3,o=new Map;for(const a of t.jointDisplacements){const l=e.get(a.joint);if(!l)continue;const c=Kt(l),h=new I(a.d[0],a.d[1],a.d[2]),d=h.lengthSq()>0,u=d?h.clone().normalize():new I(0,0,1);d&&this.modelGroup.add(this.arrow(c,c.clone().addScaledVector(u,r*.8),s,2.5,!0));const f=a.case?`${a.case}: `:"",p=a.d.map((m,v)=>m?`${f}${sn[v]} ${v<3?ye(m,"L",3):Qe(m,4)+" rad"}`:"").filter(Boolean);if(!p.length)continue;let g=o.get(a.joint);g||o.set(a.joint,g={p:c,dir:u,lines:[]}),g.lines.push(...p)}if(this.display.loadValues)for(const a of o.values())this.modelGroup.add(this.label(a.lines.join(`
`),a.p.clone().addScaledVector(a.dir,r),"load disp"))}buildLoads(t,e){const n=this.glyph(),s=this.theme.load,r=n*3,o=this.display.loadValues,a=new Map,l=new Map;for(const M of t.jointLoads){const _=e.get(M.joint);if(!_)continue;const S=Kt(_),P=M.case?`${M.case}: `:"",A=new I(M.f[0],M.f[1],M.f[2]);if(A.lengthSq()>0){const L=A.clone().normalize();this.modelGroup.add(this.arrow(S.clone().addScaledVector(L,-r),S,s,2.5));let x=a.get(M.joint);x||(x={p:S,dir:L,lines:[]},a.set(M.joint,x)),x.lines.push(`${P}${ye(A.length(),"F")}`)}const T=new I(M.f[3],M.f[4],M.f[5]);if(T.lengthSq()>0){const L=T.clone().normalize();this.modelGroup.add(this.arrow(S,S.clone().addScaledVector(L,r*.9),s,2.5,!0));let x=l.get(M.joint);x||(x={p:S,dir:L,lines:[]},l.set(M.joint,x)),x.lines.push(`${P}${ye(T.length(),"M")}`)}}if(o){for(const M of a.values())this.modelGroup.add(this.label(M.lines.join(`
`),M.p.clone().addScaledVector(M.dir,-r*1.1),"load"));for(const M of l.values())this.modelGroup.add(this.label(M.lines.join(`
`),M.p.clone().addScaledVector(M.dir,r),"load"))}const c=new Map(t.frames.map(M=>[M.id,M])),h=M=>{const _=e.get(M.i),S=e.get(M.j);return{a:Kt(_),b:Kt(S),ax:tl(Er(_),Er(S),M.beta)}},d=new Map;for(const M of t.framePointLoads){const _=c.get(M.frame);if(!_||!e.has(_.i)||!e.has(_.j))continue;const{a:S,b:P,ax:A}=h(_),T=S.clone().lerp(P,M.rd),L=xh(M.dir,A).multiplyScalar(Math.sign(M.P)||1);this.modelGroup.add(this.arrow(T.clone().addScaledVector(L,-r),T,s,2.5));const x=`${_.id}_${Math.round(M.rd*1e3)}`;let y=d.get(x);y||(y={p:T,dir:L,lines:[]},d.set(x,y));const E=M.case?`${M.case}: `:"";y.lines.push(`${E}${ye(Math.abs(M.P),"F")}`)}if(o)for(const M of d.values())this.modelGroup.add(this.label(M.lines.join(`
`),M.p.clone().addScaledVector(M.dir,-r*1.1),"load"));const u=16486972,f=new Map,p=new Map;for(const M of t.frameUniformLoads){const _=c.get(M.frame);if(!_||!e.has(_.i)||!e.has(_.j))continue;const{a:S,b:P,ax:A}=h(_),T=p.get(_.id)??0;p.set(_.id,T+1);const L=xh(M.dir,A).multiplyScalar(Math.sign(M.w)||1),x=r*.7*(1+T*.25),y=6,E=[];for(let F=0;F<=y;F++){const W=S.clone().lerp(P,F/y),O=W.clone().addScaledVector(L,-x);E.push(...O.toArray()),F>0&&F<y&&E.push(...O.toArray()),this.modelGroup.add(this.arrow(O,W,u,1.5))}this.modelGroup.add(this.lines(E,u,2));let D=f.get(_.id);D||(D={mid:S.clone().lerp(P,.5).addScaledVector(L,-r*.7*1.15),lines:[]},f.set(_.id,D));const N=M.case?`${M.case}: `:"";D.lines.push(`${N}${ye(Math.abs(M.w),"FL")}`)}if(o)for(const M of f.values())this.modelGroup.add(this.label(M.lines.join(`
`),M.mid,"load uload"));const g=new Map(t.areas.map(M=>[M.id,M])),m=new Map,v=new Set;for(const M of t.areaLoads){const _=g.get(M.area);if(!_)continue;const S=_.joints.map(x=>e.get(x)).filter(Boolean).map(x=>Kt(x));if(S.length<3)continue;const P=S.reduce((x,y)=>x.add(y),new I).multiplyScalar(1/S.length),A=new I(0,0,Math.sign(M.q)>=0?-1:1);if(!v.has(_.id)){v.add(_.id);const x=[P,...S.map(y=>y.clone().lerp(P,.45))];for(const y of x)this.modelGroup.add(this.arrow(y.clone().addScaledVector(A,-r*.8),y,1357990,1.5))}let T=m.get(_.id);T||(T={c:P,dir:A,lines:[]},m.set(_.id,T));const L=M.case?`${M.case}: `:"";T.lines.push(`${L}${ye(Math.abs(M.q),"FA")}`)}if(o)for(const M of m.values()){const _=M.c.clone().addScaledVector(M.dir,-r*.95);this.modelGroup.add(this.label(M.lines.join(`
`),_,"load aload"))}}computeAutoScales(){const t=this.results;this.autoDeformScale=t&&t.stats.maxDisp>1e-15?this.span*.08/t.stats.maxDisp:1}setResults(t){this.results=t,this.computeAutoScales()}setResultOptions(t){const e=this.resultOpts.view;Object.assign(this.resultOpts,t),t.animate&&(this.animStart=performance.now()),e!==this.resultOpts.view&&this.buildModel(),!this.resultOpts.animate&&this.deformed&&this.applyDeformation(1),this.buildResults(),this.requestRender()}applyDeformation(t){const e=this.deformed,n=e.geo.attributes.instanceStart,s=n.data.array;for(let r=0;r<s.length;r++)s[r]=e.base[r]+e.delta[r]*t;n.data.needsUpdate=!0,e.geo.computeBoundingSphere()}buildResults(){this.clearGroup(this.resultGroup),this.deformed=null;const t=this.results,e=this.data;if(!t||!e)return;const n=this.resultOpts.view;n==="deformed"?this.buildDeformed(t,e):il.includes(n)?this.buildDiagram(t,n):n==="reactions"&&this.buildReactions(t,e)}buildDeformed(t,e){const n=this.resultOpts.deformScale,s=new Map(e.joints.map(c=>[c.id,c])),r=[],o=[];for(const c of t.frames){const h=e.frames.find(f=>f.id===c.id);if(!h)continue;const d=Kt(s.get(h.i)),u=Kt(c.axes[0]);for(let f=0;f<c.x.length-1;f++)for(const p of[f,f+1]){const g=d.clone().addScaledVector(u,c.x[p]);r.push(g.x,g.y,g.z);const m=c.disp[p];o.push(m[0]*n,m[1]*n,m[2]*n)}}if(!r.length)return;const a=r.map((c,h)=>c+o[h]),l=this.lines(a,this.theme.deformed,3);if(this.resultGroup.add(l),this.deformed={geo:l.geometry,base:new Float32Array(r),delta:new Float32Array(o)},this.resultOpts.showValues){let c=-1,h=0;for(const[u,f]of Object.entries(t.disp)){const p=Math.hypot(f[0],f[1],f[2]);p>c&&(c=p,h=Number(u))}const d=s.get(h);if(d&&c>0){const u=t.disp[h],f=Kt(d).add(new I(u[0],u[1],u[2]).multiplyScalar(n));this.resultGroup.add(this.label(`max ${Qe(c/Ve().kSmall)} ${Ve().small} (J${h})`,f,"result"))}}}diagramSize(){return this.span*.12*this.resultOpts.forceScale}buildDiagram(t,e){const n=this.data,s=new Map(n.joints.map(g=>[g.id,g]));let r=0;for(const g of t.frames)for(const m of g[e])r=Math.max(r,Math.abs(m));if(r<1e-9){this.resultGroup.add(this.label(`${e} = 0 everywhere`,this.target.clone(),"result"));return}const o=this.diagramSize()/r,a=e==="P"||e==="V2"||e==="V3"?"F":"M",l=[],c=[],h=[],d=new Jt(this.theme.pos),u=new Jt(this.theme.neg);for(const g of t.frames){const m=n.frames.find(L=>L.id===g.id);if(!m)continue;const v=Kt(s.get(m.i)),M=Kt(g.axes[0]),_=e==="M3"?Kt(g.axes[1]).negate():Kt(e==="M2"||e==="V3"?g.axes[2]:g.axes[1]),S=g[e],P=L=>v.clone().addScaledVector(M,g.x[L]),A=L=>P(L).addScaledVector(_,S[L]*o);for(let L=0;L<g.x.length-1;L++){const x=P(L),y=P(L+1),E=A(L),D=A(L+1),N=S[L]>=0?d:u,F=S[L+1]>=0?d:u;l.push(...x.toArray(),...E.toArray(),...y.toArray(),...E.toArray(),...D.toArray(),...y.toArray());for(const W of[N,N,F,N,F,F])c.push(W.r,W.g,W.b);h.push(...E.toArray(),...D.toArray())}h.push(...P(0).toArray(),...A(0).toArray());const T=g.x.length-1;if(h.push(...P(T).toArray(),...A(T).toArray()),this.resultOpts.showValues){const L=new Set([0,T]);let x=0;for(let y=1;y<T;y++)Math.abs(S[y])>Math.abs(S[x])&&(x=y);Math.abs(S[x])>Math.max(Math.abs(S[0]),Math.abs(S[T]))*1.02&&L.add(x);for(const y of L)Math.abs(S[y])<r*.01||this.resultGroup.add(this.label(jt(S[y],a,3),A(y),"result small"))}}const f=new Re;f.setAttribute("position",new me(l,3)),f.setAttribute("color",new me(c,3));const p=new Te(f,new Ts({vertexColors:!0,transparent:!0,opacity:.45,side:dn,depthWrite:!1}));this.resultGroup.add(p),this.resultGroup.add(this.lines(h,this.theme.frame,1.5,void 0,{opacity:.8}))}buildReactions(t,e){const n=new Map(e.joints.map(h=>[h.id,h])),s=this.glyph()*3,r=this.theme.reaction;let o=0;for(const h of Object.values(t.reactions))o=Math.max(o,Math.abs(h[0]),Math.abs(h[1]),Math.abs(h[2]));const a=Math.max(o*1e-6,1e-9),l=[new I(1,0,0),new I(0,1,0),new I(0,0,1)],c=["FX","FY","FZ","MX","MY","MZ"];for(const[h,d]of Object.entries(t.reactions)){const u=n.get(Number(h));if(!u)continue;const f=Kt(u),p=[];for(let g=0;g<3;g++){if(Math.abs(d[g])<=a)continue;const m=l[g].clone().multiplyScalar(Math.sign(d[g]));this.resultGroup.add(this.arrow(f.clone().addScaledVector(m,-s),f,r,3)),p.push(`${c[g]} ${ye(d[g],"F")}`)}for(let g=3;g<6;g++){if(Math.abs(d[g])<=a)continue;const m=l[g-3].clone().multiplyScalar(Math.sign(d[g]));this.resultGroup.add(this.arrow(f,f.clone().addScaledVector(m,s*.8),r,3,!0)),p.push(`${c[g]} ${ye(d[g],"M")}`)}this.resultOpts.showValues&&p.length&&this.resultGroup.add(this.label(`J${h}
`+p.join(`
`),f.clone().add(new I(0,0,-s*.6)),"result react"))}}setOverlay(t,e,n="joint"){if(this.clearGroup(this.overlayGroup),t&&t.length){const s=[];for(const[o,a]of t)s.push(...o.toArray(),...a.toArray());const r=this.lines(s,this.theme.sel,2,void 0,{dashed:!0});this.overlayGroup.add(r)}if(e){const s=new Re;s.setAttribute("position",new me(e.toArray(),3));const r=new zo(s,new Or({size:n==="mid"||n==="cross"?24:20,sizeAttenuation:!1,map:n==="mid"?this.midTex:n==="cross"?this.crossTex:this.jointTex,color:this.theme.sel,transparent:!0,opacity:n==="mid"||n==="cross"?.9:.6,depthTest:!1}));r.renderOrder=20,this.overlayGroup.add(r)}this.requestRender()}pick(t,e,n){const s=this.data;if(!s)return null;let r=null,o=n;for(const h of s.joints){const d=this.toScreen(Kt(h));if(d.behind)continue;const u=Math.hypot(d.x-t,d.y-e);u<o&&(o=u,r=Ue("j",h.id))}if(r)return r;const a=new Map(s.joints.map(h=>[h.id,h]));o=n;for(const h of s.frames){const d=a.get(h.i),u=a.get(h.j);if(!d||!u)continue;const f=this.toScreen(Kt(d)),p=this.toScreen(Kt(u));if(f.behind&&p.behind)continue;const g=Bu(t,e,f.x,f.y,p.x,p.y);g<o&&(o=g,r=Ue("f",h.id))}if(r)return r;let l=1/0;const c=this.camera.position;for(const h of s.areas){const d=h.joints.map(g=>a.get(g)).filter(Boolean);if(d.length<3)continue;const u=d.map(g=>this.toScreen(Kt(g)));if(u.some(g=>g.behind)||!sx(t,e,u))continue;const p=d.reduce((g,m)=>g.add(Kt(m)),new I).multiplyScalar(1/d.length).distanceTo(c);p<l&&(l=p,r=Ue("a",h.id))}return r}boxPick(t,e,n,s,r){const o=this.data;if(!o)return[];const a=Math.min(t,n),l=Math.max(t,n),c=Math.min(e,s),h=Math.max(e,s),d=g=>!g.behind&&g.x>=a&&g.x<=l&&g.y>=c&&g.y<=h,u=new Map(o.joints.map(g=>[g.id,this.toScreen(Kt(g))])),f=[];for(const g of o.joints)d(u.get(g.id))&&f.push(Ue("j",g.id));const p=(g,m)=>rx(g.x,g.y,m.x,m.y,a,c,l,h);for(const g of o.frames){const m=u.get(g.i),v=u.get(g.j);!m||!v||(r?d(m)||d(v)||p(m,v):d(m)&&d(v))&&f.push(Ue("f",g.id))}for(const g of o.areas){const m=g.joints.map(M=>u.get(M)).filter(Boolean);if(!m.length)continue;(r?m.some(d)||m.some((M,_)=>p(M,m[(_+1)%m.length])):m.every(d))&&f.push(Ue("a",g.id))}return f}jointScreen(t){return this.toScreen(Kt(t))}}function sx(i,t,e){let n=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const o=e[s],a=e[r];o.y>t!=a.y>t&&i<(a.x-o.x)*(t-o.y)/(a.y-o.y)+o.x&&(n=!n)}return n}function wr(i,t,e,n,s,r,o,a){const l=(c,h,d,u,f,p)=>Math.sign((d-c)*(p-h)-(u-h)*(f-c));return l(i,t,e,n,s,r)!==l(i,t,e,n,o,a)&&l(s,r,o,a,i,t)!==l(s,r,o,a,e,n)}function rx(i,t,e,n,s,r,o,a){return wr(i,t,e,n,s,r,o,r)||wr(i,t,e,n,o,r,o,a)||wr(i,t,e,n,o,a,s,a)||wr(i,t,e,n,s,a,s,r)}const ox=550;class ax{constructor(t,e){lt(this,"pts",new Map);lt(this,"mode","idle");lt(this,"lpTimer");lt(this,"lastPinch",0);lt(this,"lastMid",{x:0,y:0});lt(this,"down",t=>{var e,n;if(this.el.setPointerCapture(t.pointerId),this.pts.set(t.pointerId,{x:t.clientX,y:t.clientY,sx:t.clientX,sy:t.clientY,t:performance.now(),type:t.pointerType,button:t.button}),this.pts.size===1)this.mode="pending",t.pointerType!=="mouse"&&(this.lpTimer=window.setTimeout(()=>{var s;this.mode==="pending"&&this.pts.size===1&&(this.mode="done",(s=navigator.vibrate)==null||s.call(navigator,15),this.h.longPress(t.clientX,t.clientY,t))},ox));else if(this.pts.size===2){this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.mode="multi";const[s,r]=[...this.pts.values()];this.lastPinch=Math.hypot(s.x-r.x,s.y-r.y),this.lastMid={x:(s.x+r.x)/2,y:(s.y+r.y)/2}}t.preventDefault()});lt(this,"move",t=>{var r,o,a,l;const e=this.pts.get(t.pointerId);if(!e){t.pointerType==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}const n=t.clientX-e.x,s=t.clientY-e.y;if(e.x=t.clientX,e.y=t.clientY,this.mode==="multi"&&this.pts.size>=2){const[c,h]=[...this.pts.values()],d=Math.hypot(c.x-h.x,c.y-h.y),u={x:(c.x+h.x)/2,y:(c.y+h.y)/2};this.h.pan(u.x-this.lastMid.x,u.y-this.lastMid.y),this.lastPinch>0&&d>0&&this.h.zoom(this.lastPinch/d,u.x,u.y),this.lastPinch=d,this.lastMid=u;return}if(this.mode==="pending"){if(Math.hypot(t.clientX-e.sx,t.clientY-e.sy)<this.slop(e.type)){e.type==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}this.clearLP(),!t.shiftKey&&(e.type==="mouse"?e.button===2:!0)&&this.h.drag&&((o=(r=this.h).wantsDrag)!=null&&o.call(r,e.sx,e.sy,t))?(this.mode="drag",this.h.drag(e.sx,e.sy,"start")):e.button===1||e.button===2||t.shiftKey?this.mode="pan":this.h.wantsBox(t)?this.mode="box":this.mode="orbit"}this.mode==="orbit"?this.h.orbit(n,s):this.mode==="pan"?this.h.pan(n,s):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"move"):this.mode==="drag"&&((l=(a=this.h).drag)==null||l.call(a,t.clientX,t.clientY,"move"))});lt(this,"up",t=>{var n,s;const e=this.pts.get(t.pointerId);e&&(this.pts.delete(t.pointerId),this.clearLP(),this.mode==="pending"&&this.pts.size===0?e.button===2&&e.type==="mouse"?this.h.longPress(t.clientX,t.clientY,t):(e.button===0||e.type!=="mouse")&&this.h.tap(t.clientX,t.clientY,t):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"end"):this.mode==="drag"&&((s=(n=this.h).drag)==null||s.call(n,t.clientX,t.clientY,"end")),this.pts.size===0?this.mode="idle":this.mode==="multi"&&this.pts.size===1&&(this.mode="done"))});lt(this,"cancel",t=>{var e,n;this.pts.delete(t.pointerId),this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.pts.size===0&&(this.mode="idle")});lt(this,"wheel",t=>{t.preventDefault();let e=t.deltaY;t.deltaMode===1&&(e*=30);const n=t.ctrlKey?.01:.0015;this.h.zoom(Math.exp(e*n),t.clientX,t.clientY)});this.el=t,this.h=e,t.style.touchAction="none",t.addEventListener("pointerdown",this.down),t.addEventListener("pointermove",this.move),t.addEventListener("pointerup",this.up),t.addEventListener("pointercancel",this.cancel),t.addEventListener("lostpointercapture",n=>this.pts.has(n.pointerId)&&this.cancel(n)),t.addEventListener("wheel",this.wheel,{passive:!1}),t.addEventListener("contextmenu",n=>n.preventDefault());for(const n of["gesturestart","gesturechange","gestureend"])t.addEventListener(n,s=>s.preventDefault())}slop(t){return t==="mouse"?4:10}clearLP(){this.lpTimer!==void 0&&clearTimeout(this.lpTimer),this.lpTimer=void 0}}function C(i,t=null,...e){const n=document.createElement(i);if(t)for(const[s,r]of Object.entries(t))r==null||r===!1||(s.startsWith("on")&&typeof r=="function"?n.addEventListener(s.slice(2).toLowerCase(),r):s==="class"?n.className=String(r):s==="style"&&typeof r=="object"?Object.assign(n.style,r):s in n&&typeof r!="string"?n[s]=r:n.setAttribute(s,r===!0?"":String(r)));for(const s of e)s!=null&&s!==!1&&n.append(s);return n}const Lt=(i,t,e="small")=>C("button",{class:"btn "+e,type:"button",onclick:t},i);function _e(i,t,e=!1){return C("div",{class:"table-wrap"},C("table",{class:e?"grid-table compact":"grid-table"},C("thead",null,C("tr",null,...i.map(n=>C("th",null,n)))),C("tbody",null,...t.map(n=>C("tr",null,...n.map(s=>C("td",null,s)))))))}function yh(i){const t=i.trim().replace(/\s/g,"").replace(",",".");return t===""?NaN:Number(t)}function ne(i,t,e={}){const n=e.q,s=c=>String(n?J_(c,n):c),r=C("input",{type:"text",inputmode:"decimal",autocomplete:"off",spellcheck:"false",value:t===null||!Number.isFinite(t)?"":s(t),placeholder:e.mixed?"(mixed)":e.placeholder??""}),o=C("div",{class:"field-err"}),a=C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},r,e.unit||n?C("span",{class:"unit"},n?Yt(n):e.unit):null),o),l=()=>{const c=yh(r.value);let h="";return r.value.trim()===""&&e.mixed?h="":Number.isFinite(c)?e.positive&&c<=0?h="Must be > 0":e.min!==void 0&&c<e.min?h=`Must be ≥ ${e.min}`:e.max!==void 0&&c>e.max&&(h=`Must be ≤ ${e.max}`):h="Enter a number",o.textContent=h,a.classList.toggle("invalid",!!h),!h};return r.addEventListener("input",l),r.addEventListener("focus",()=>r.select()),{row:a,input:r,get:()=>{if(!l())return NaN;const c=yh(r.value);return n&&Number.isFinite(c)?Gu(c,n):c},set:c=>{r.value=s(c),l()}}}function Hs(i,t){const e=C("input",{type:"text",value:t,autocomplete:"off",spellcheck:"false"});return{row:C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},e)),input:e,get:()=>e.value.trim(),set:s=>e.value=s}}function He(i,t,e){const n=C("select",null,...t.map(([r,o])=>C("option",{value:r,selected:r===e},o)));return{row:C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},n)),input:n,get:()=>n.value,set:r=>n.value=r}}function oo(i,t){const e=C("input",{type:"checkbox",checked:t});return{row:C("label",{class:"check"},e,C("span",null,i)),input:e,get:()=>e.checked,set:s=>e.checked=s}}let sl=0;const lx=()=>sl>0;function te(i){const t=C("div",{class:"dlg-backdrop"}),e=()=>{var l;t.isConnected&&(t.remove(),sl--,document.removeEventListener("keydown",o,!0),(l=i.onClose)==null||l.call(i))},n=async l=>{(l.action?await l.action():void 0)!==!1&&e()},s=i.buttons.map(l=>C("button",{class:"btn "+(l.kind??"plain"),type:"button",onclick:()=>n(l)},l.label)),r=C("div",{class:"dlg"+(i.wide?" wide":""),role:"dialog","aria-modal":"true","aria-label":i.title},C("div",{class:"dlg-head"},C("h2",null,i.title),C("button",{class:"icon-btn","aria-label":"Close",onclick:e},"✕")),C("div",{class:"dlg-body"},i.body),C("div",{class:"dlg-foot"},...s));t.append(r),t.addEventListener("pointerdown",l=>{l.target===t&&e()});const o=l=>{if(l.key==="Escape")l.stopPropagation(),e();else if(l.key==="Enter"&&!(l.target instanceof HTMLTextAreaElement)&&!(l.target instanceof HTMLButtonElement)){const c=i.buttons.find(h=>h.kind==="primary");c&&(l.preventDefault(),l.stopPropagation(),n(c))}};if(document.addEventListener("keydown",o,!0),document.body.append(t),sl++,!("ontouchstart"in window||navigator.maxTouchPoints&&navigator.maxTouchPoints>0)&&matchMedia("(pointer: fine)").matches){const l=r.querySelector('.dlg-body input:not([type="checkbox"]):not([type="radio"])');l==null||l.focus()}return{close:e,el:r}}function Ci(i,t,e="OK",n=!1){return new Promise(s=>{let r=!1;te({title:i,body:C("p",{class:"msg"},t),buttons:[{label:"Cancel"},{label:e,kind:n?"danger":"primary",action:()=>void(r=!0)}],onClose:()=>s(r)})})}function un(i,t){return new Promise(e=>{te({title:i,body:typeof t=="string"?C("p",{class:"msg"},t):t,buttons:[{label:"OK",kind:"primary"}],onClose:()=>e()})})}let Ar=null;function kt(i,t="info",e=3200){Ar||(Ar=C("div",{class:"toasts","aria-live":"polite"}),document.body.append(Ar));const n=C("div",{class:"toast "+t},i);Ar.append(n),setTimeout(()=>{n.classList.add("out"),setTimeout(()=>n.remove(),300)},e)}let ni=null;document.addEventListener("change",i=>{i.target instanceof HTMLSelectElement&&i.target.blur()},!0);function Jr(){var i,t;(t=(i=document.activeElement)==null?void 0:i.blur)==null||t.call(i),ni==null||ni.close()}function Sh(i,t,e,n){var d,u;Jr();const s=C("div",{class:"popup-menu",role:"menu"});for(const f of i){if(f.separator){s.append(C("div",{class:"sep"}));continue}if(f.heading){s.append(C("div",{class:"menu-heading"},f.heading));continue}const p=((d=f.disabled)==null?void 0:d.call(f))??!1,g=(u=f.checked)==null?void 0:u.call(f),m=C("button",{class:"menu-item",role:"menuitem",type:"button",disabled:p,onclick:()=>{var v;Jr(),(v=f.action)==null||v.call(f)}},C("span",{class:"mi-check"},g===void 0?"":g?"✓":""),C("span",{class:"mi-label"},f.label??""),C("span",{class:"mi-short"},f.shortcut??""));s.append(m)}s.addEventListener("contextmenu",f=>f.preventDefault()),document.body.append(s);const r=s.getBoundingClientRect();let o=t,a=e;if(n){const f=n.getBoundingClientRect();o=f.left,a=f.bottom+2}o=Math.max(4,Math.min(o,window.innerWidth-r.width-4)),a+r.height>window.innerHeight-4&&(a=Math.max(4,(n?n.getBoundingClientRect().top:e)-r.height-2)),s.style.left=o+"px",s.style.top=Math.max(4,a)+"px",s.style.maxHeight=window.innerHeight-8+"px";const l=f=>{!s.contains(f.target)&&f.target!==n&&h()},c=f=>{f.key==="Escape"&&h()},h=()=>{s.remove(),document.removeEventListener("pointerdown",l,!0),document.removeEventListener("keydown",c,!0),n==null||n.classList.remove("open"),(ni==null?void 0:ni.el)===s&&(ni=null)};setTimeout(()=>{document.addEventListener("pointerdown",l,!0),document.addEventListener("keydown",c,!0)},0),n==null||n.classList.add("open"),ni={el:s,close:h}}const cx=i=>i.classList.contains("open");function Mh(i,t,e,n){const s=r=>Math.round(Math.round(r/e)*e*1e9)/1e9;return t==="XY"?i.set(s(i.x),s(i.y),n):t==="XZ"?i.set(s(i.x),n,s(i.z)):i.set(n,s(i.y),s(i.z))}const Wu={select:"Tap an object to select it. Drag to rotate, two fingers to pan/zoom. Long-press for options. Drag a selected joint (right-drag with a mouse) to move it.",joint:"Tap the grid to place joints (snaps to grid and existing joints).",frame:"Tap start and end points to draw frames; drawing continues from the last point. Tap Done to stop.",area:"Tap the corner points of the area, then tap the first point again or Done to close it.",box:"Drag a box: left→right selects objects fully inside, right→left selects anything touched."};class hx{constructor(t){lt(this,"tool","select");lt(this,"multi",!1);lt(this,"chain",[]);lt(this,"hoverSnap",null);lt(this,"boxEl");lt(this,"dragState",null);this.app=t,this.boxEl=document.createElement("div"),this.boxEl.className="select-box",this.boxEl.hidden=!0,document.body.append(this.boxEl)}setTool(t){this.finishChain(!1),this.tool=t,this.hoverSnap=null,this.updateOverlay(),this.app.onToolChanged()}tol(t){return t.pointerType==="mouse"?12:24}snap(t,e,n){const s=this.app.viewer,r=this.app.model.data;let o=null,a=this.tol(n);for(const u of r.joints){const f=s.jointScreen(u);if(f.behind)continue;const p=Math.hypot(f.x-t,f.y-e);p<a&&(a=p,o={pos:new I(u.x,u.y,u.z),joint:u.id,kind:"joint"})}if(o||(o=this.frameSnap(t,e,this.tol(n)),o))return o;const l=s.workPlanePoint(t,e);if(!l)return null;const{gridSpacing:c,workPlane:h,elevation:d}=r.settings;return Mh(l,h,c,Math.round(d*1e9)/1e9),{pos:l,joint:null,kind:"grid"}}frameSnap(t,e,n){var d;const s=this.app.viewer,r=this.app.model,o=r.jointMap(),a=u=>s.toScreen(new I(u.x,u.y,u.z));let l=null,c=n;const h=[];for(const u of r.data.frames){const f=o.get(u.i),p=o.get(u.j);if(!f||!p)continue;const g=a(f),m=a(p);if(g.behind&&m.behind||Bu(t,e,g.x,g.y,m.x,m.y)>n)continue;h.push({id:u.id,a:f,b:p});const v={x:(f.x+p.x)/2,y:(f.y+p.y)/2,z:(f.z+p.z)/2},M=a(v),_=Math.hypot(M.x-t,M.y-e);!M.behind&&_<c&&(c=_,l={pos:new I(v.x,v.y,v.z),joint:null,kind:"mid",split:[{frame:u.id,t:.5}]})}for(let u=0;u<h.length;u++)for(let f=u+1;f<h.length;f++){const p=h[u],g=h[f],m=$_(p.a,p.b,g.a,g.b);if(!m)continue;const v=a(m),M=Math.hypot(v.x-t,v.y-e);!v.behind&&M<=c&&(c=M,l={pos:new I(m.x,m.y,m.z),joint:null,kind:"cross",split:[{frame:p.id,t:m.ta},{frame:g.id,t:m.tb}]})}if(l){const u=l.pos;l.joint=((d=r.findJointAt(u.x,u.y,u.z))==null?void 0:d.id)??null}return l}jointAt(t){var n;const e=this.app.model;return(n=t.split)!=null&&n.length?e.commit(t.kind==="cross"?"split frames at crossing":"split frame at midpoint",()=>{const s=e.addJoint(t.pos.x,t.pos.y,t.pos.z);for(const r of t.split){const o=e.frame(r.frame);o&&o.i!==s&&o.j!==s&&e.splitFrameAt(r.frame,[r.t])}return s}):t.joint??e.addJoint(t.pos.x,t.pos.y,t.pos.z)}tap(t,e,n){const s=this.app.model;switch(this.tool){case"select":case"box":{const r=this.app.viewer.pick(t,e,this.tol(n)),o=this.multi||n.shiftKey||n.ctrlKey||n.metaKey;r?this.app.select([r],o?"toggle":"replace"):o||this.app.select([],"replace");break}case"joint":{const r=this.snap(t,e,n);if(!r)return kt("Point is not on the work plane – rotate the view or change the work plane.","warn");const o=this.jointAt(r);this.app.select([Ue("j",o)],"replace");break}case"frame":{const r=this.snap(t,e,n);if(!r)return kt("Point is not on the work plane – rotate the view or change the work plane.","warn");s.commit("draw frame",()=>{const o=this.jointAt(r),a=this.chain[0];if(a!==void 0&&a!==o){const l=s.addFrame(a,o);l!==null&&this.app.select([Ue("f",l)],"replace")}this.chain=[o]});break}case"area":{const r=this.snap(t,e,n);if(!r)return kt("Point is not on the work plane – rotate the view or change the work plane.","warn");if(r.joint!==null&&this.chain.length>=3&&r.joint===this.chain[0]){this.finishChain(!0);break}if(r.joint!==null&&this.chain.includes(r.joint))return kt("Joint already used in this area","warn");this.chain.push(this.jointAt(r));break}}this.updateOverlay(),this.app.updateStatus()}hover(t,e,n){var s,r;if(this.tool==="joint"||this.tool==="frame"||this.tool==="area"){const o=this.hoverSnap;this.hoverSnap=this.snap(t,e,n);const a=this.hoverSnap;a&&a.kind!=="grid"&&(!o||o.kind!==a.kind||!o.pos.equals(a.pos))&&((s=navigator.vibrate)==null||s.call(navigator,15)),this.updateOverlay(),this.app.setCoordReadout(((r=this.hoverSnap)==null?void 0:r.pos)??null)}}wantsBox(t){return this.tool==="box"||this.tool==="select"&&t.pointerType==="mouse"&&(t.ctrlKey||t.metaKey)}box(t,e,n,s,r){const o=this.boxEl;if(r==="cancel"){o.hidden=!0;return}const a=n<t;if(r==="move"){o.hidden=!1,o.classList.toggle("crossing",a),Object.assign(o.style,{left:Math.min(t,n)+"px",top:Math.min(e,s)+"px",width:Math.abs(n-t)+"px",height:Math.abs(s-e)+"px"});return}o.hidden=!0;const l=this.app.viewer.boxPick(t,e,n,s,a);this.app.select(l,this.multi?"add":"replace"),kt(`${l.length} object(s) ${a?"touched":"inside box"}`,"info",1500)}wantsDrag(t,e,n){if(this.chain.length)return!1;const s=[...this.app.selection];if(s.length!==1)return!1;const{kind:r,id:o}=Yr(s[0]);if(r!=="j")return!1;const a=this.app.model.joint(o);if(!a)return!1;const l=this.app.viewer.jointScreen(a);return!l.behind&&Math.hypot(l.x-t,l.y-e)<=this.tol(n)}dragTarget(t,e,n){const s=this.app.model.joint(t);if(!s)return null;const{gridSpacing:r,workPlane:o}=this.app.model.data.settings,a=o==="XY"?s.z:o==="XZ"?s.y:s.x,l=this.app.viewer.workPlanePoint(e,n,a);return l?Mh(l,o,r,a):null}drag(t,e,n){if(n==="start"){const{id:d}=Yr([...this.app.selection][0]);this.dragState={id:d,target:null};return}const s=this.dragState;if(!s)return;const r=this.app.model;if(n==="cancel"){this.dragState=null,this.updateOverlay(),this.app.setCoordReadout(null);return}if(n==="move"){if(s.target=this.dragTarget(s.id,t,e)??s.target,!s.target)return;const d=[],u=r.jointMap(),f=p=>{const g=u.get(p);return p===s.id?s.target:new I(g.x,g.y,g.z)};for(const p of r.data.frames)(p.i===s.id||p.j===s.id)&&d.push([f(p.i),f(p.j)]);for(const p of r.data.areas){const g=p.joints.indexOf(s.id);if(g<0)continue;const m=p.joints.length;d.push([f(p.joints[(g+m-1)%m]),s.target],[s.target,f(p.joints[(g+1)%m])])}this.app.viewer.setOverlay(d,s.target),this.app.setCoordReadout(s.target);return}this.dragState=null;const o=r.joint(s.id);if(this.updateOverlay(),this.app.setCoordReadout(null),!o||!s.target)return;const a=s.target.x-o.x,l=s.target.y-o.y,c=s.target.z-o.z;if(Math.abs(a)+Math.abs(l)+Math.abs(c)<1e-12)return;const h=r.moveJoints(new Set([s.id]),a,l,c);h&&kt(h,"warn")}finishChain(t=!0){if(this.tool==="area"&&t&&this.chain.length>=3){const e=this.app.model.addArea(this.chain);e!==null&&this.app.select([Ue("a",e)],"replace")}else this.tool==="area"&&t&&this.chain.length>0&&kt("An area needs at least 3 points","warn");this.chain=[],this.updateOverlay(),this.app.updateStatus()}cancel(){this.chain.length?(this.chain=[],this.updateOverlay()):this.app.select([],"replace"),this.app.updateStatus()}updateOverlay(){var a;const t=this.app.viewer,e=this.app.model,n=this.chain.map(l=>e.joint(l)).filter(Boolean).map(l=>new I(l.x,l.y,l.z)),s=[],r=(a=this.hoverSnap)==null?void 0:a.pos;if(this.tool==="frame"&&n.length&&r&&s.push([n[0],r]),this.tool==="area"&&n.length){for(let c=0;c+1<n.length;c++)s.push([n[c],n[c+1]]);const l=r??n[n.length-1];r&&s.push([n[n.length-1],r]),n.length>=2&&s.push([l,n[0]])}let o=null;(this.tool==="joint"||this.tool==="frame"||this.tool==="area")&&(o=r??(n.length?n[n.length-1]:null)),t.setOverlay(s,o,r?this.hoverSnap.kind:"joint")}statusText(){return this.tool==="frame"&&this.chain.length?`Frame from joint ${this.chain[0]} – tap the next point, or Done to stop.`:this.tool==="area"&&this.chain.length?`Area: ${this.chain.length} point(s) [${this.chain.join(", ")}] – tap the next point, the first point, or Done.`:Wu[this.tool]}}function qo(i,t){let e;switch(i){case"L1":return[1,0,0];case"L2":return[0,1,0];case"L3":return[0,0,1];case"GX":e=[1,0,0];break;case"GY":e=[0,1,0];break;case"GZ":e=[0,0,1];break;case"GRAV":e=[0,0,-1];break}return[Bn(t[0],e),Bn(t[1],e),Bn(t[2],e)]}function $u(i){let t=0,e=0,n=0;for(let s=0;s<i.length;s++){const r=i[s],o=i[(s+1)%i.length];t+=(r[1]-o[1])*(r[2]+o[2]),e+=(r[2]-o[2])*(r[0]+o[0]),n+=(r[0]-o[0])*(r[1]+o[1])}return Math.hypot(t,e,n)/2}function ux(i,t,e){const n=Is(t,i),s=ks(n),r=[n[0]/s,n[1]/s,n[2]/s],o=Math.min(Math.max(Bn(Is(e,i),r),0),s),a=ks(si(Is(e,i),r));return[[0,0],[o,a],[s,0]]}function dx(i){let t=0;for(let e=0;e+1<i.length;e++)t+=(i[e+1][0]-i[e][0])*(i[e][1]+i[e+1][1])/2;return t}function fx(i,t,e,n){const s=i.length,r=i.map((c,h)=>ks(Is(i[(h+1)%s],c)));let o;if(s===4&&t==="one-way"){const c=(r[0]+r[2])/2,h=(r[1]+r[3])/2,d=c>=h,u=d?h:c;o=r.map((f,p)=>p%2===0===d?[[0,u/2],[f,u/2]]:[[0,0],[f,0]])}else if(s===4){const h=Math.min((r[0]+r[2])/2,(r[1]+r[3])/2)/2;o=r.map(d=>d>2*h?[[0,0],[h,h],[d-h,h],[d,0]]:[[0,0],[d/2,d/2],[d,0]])}else{t==="one-way"&&e.push(`Area ${n}: one-way distribution needs 4 joints; two-way used.`);let c;if(s===3){const[h,d,u]=i,f=r[1],p=r[2],g=r[0],m=f+p+g;c=[(f*h[0]+p*d[0]+g*u[0])/m,(f*h[1]+p*d[1]+g*u[1])/m,(f*h[2]+p*d[2]+g*u[2])/m]}else{c=[0,0,0];for(const h of i)c[0]+=h[0]/s,c[1]+=h[1]/s,c[2]+=h[2]/s}o=i.map((h,d)=>ux(h,i[(d+1)%s],c))}const a=o.reduce((c,h)=>c+dx(h),0),l=$u(i);if(a>0){const c=l/a;for(const h of o)for(const d of h)d[1]*=c}return o}function px(i,t,e){const n=new Map,s=new Map;for(const o of i.frames)s.set(`${o.i}-${o.j}`,o),s.set(`${o.j}-${o.i}`,o);const r=new Map;for(const o of i.areaLoads)r.set(o.area,(r.get(o.area)??0)+o.q);for(const o of i.areas){const a=r.get(o.id)??0;if(!a)continue;const l=o.joints.map(u=>t.get(u));if(l.some(u=>!u)){e.push(`Area ${o.id}: references a missing joint; load ignored.`);continue}const c=l.map(u=>[u.x,u.y,u.z]),h=fx(c,o.distribution,e,o.id),d=c.length;for(let u=0;u<d;u++){const f=h[u];if(f.every(S=>S[1]===0))continue;const p=o.joints[u],g=o.joints[(u+1)%d],m=s.get(`${p}-${g}`);if(!m){e.push(`Area ${o.id}: edge ${p}-${g} has no frame; its share of the load is ignored.`);continue}const v=m.i!==p,M=h[u][f.length-1][0],_=n.get(m.id)??[];for(let S=0;S+1<f.length;S++){const[P,A]=f[S],[T,L]=f[S+1];T-P<=1e-12||(v?_.push({x1:M-T,x2:M-P,w1:a*L,w2:a*A}):_.push({x1:P,x2:T,w1:a*A,w2:a*L}))}n.set(m.id,_)}}return n}class mx{constructor(t){lt(this,"n");lt(this,"maxa");lt(this,"heights");lt(this,"a");lt(this,"diag0",null);this.n=t.length,this.heights=t,this.maxa=new Int32Array(this.n+1);for(let e=0;e<this.n;e++)this.maxa[e+1]=this.maxa[e]+t[e]+1;this.a=new Float64Array(this.maxa[this.n])}add(t,e,n){if(t>e){const r=t;t=e,e=r}const s=e-t;if(s>this.heights[e])throw new Error("Skyline profile violated");this.a[this.maxa[e]+s]+=n}factor(t=1e-10){const{n:e,maxa:n,heights:s,a:r}=this;this.diag0=new Float64Array(e);let o=0;for(let l=0;l<e;l++)this.diag0[l]=r[n[l]],o=Math.max(o,Math.abs(r[n[l]]));const a=o*1e-15;for(let l=0;l<e;l++){const c=l-s[l],h=n[l];for(let f=c+1;f<l;f++){const p=f-s[f],g=Math.max(p,c),m=n[f];let v=r[h+(l-f)];for(let M=g;M<f;M++)v-=r[m+(f-M)]*r[h+(l-M)];r[h+(l-f)]=v}let d=r[h];for(let f=c;f<l;f++){const p=h+(l-f),g=r[p],m=g/r[n[f]];d-=m*g,r[p]=m}const u=Math.abs(this.diag0[l]);if(!(d>t*u)||!(d>a))return l;r[h]=d}return-1}solve(t){const{n:e,maxa:n,heights:s,a:r}=this;for(let o=0;o<e;o++){const a=n[o];let l=t[o];for(let c=o-s[o];c<o;c++)l-=r[a+(o-c)]*t[c];t[o]=l}for(let o=0;o<e;o++)t[o]/=r[n[o]];for(let o=e-1;o>=0;o--){const a=n[o],l=t[o];for(let c=o-s[o];c<o;c++)t[c]-=r[a+(o-c)]*l}return t}}function gx(i){const t=i.length,e=new Uint8Array(t),n=[],s=i.map(o=>o.length),r=[...Array(t).keys()].sort((o,a)=>s[o]-s[a]);for(const o of r){if(e[o])continue;e[o]=1;const a=[o];for(let l=0;l<a.length;l++){const c=a[l];n.push(c);const h=i[c].filter(d=>!e[d]).sort((d,u)=>s[d]-s[u]);for(const d of h)e[d]=1,a.push(d)}}return n.reverse()}class $e extends Error{}const bh=40,Yo=1e-9;function vx(i,t,e=0,n=0){const s=new Float64Array(12);for(const r of i.points)mh(r.p,r.a,t,s,e,n);for(const r of i.dists){const o=(r.x2-r.x1)/2,a=(r.x1+r.x2)/2;for(const l of Ou){const c=a+l.x*o,h=r.x2>r.x1?(c-r.x1)/(r.x2-r.x1):0,d=(r.w1+(r.w2-r.w1)*h)*l.w*o;mh([r.d[0]*d,r.d[1]*d,r.d[2]*d],c,t,s,e,n)}}return s}function _x(i,t,e){const n=[0,0,0],s=[0,0,0],r=(o,a)=>{n[0]+=o[0],n[1]+=o[1],n[2]+=o[2];const l=a-t;s[1]+=-l*o[2],s[2]+=l*o[1]};for(const o of i.points)(o.a<t||e&&o.a===t)&&r(o.p,o.a);for(const o of i.dists){const a=Math.min(o.x2,t);if(a<=o.x1)continue;const l=(a-o.x1)/2,c=(o.x1+a)/2;for(const h of Ou){const d=c+h.x*l,u=o.x2>o.x1?(d-o.x1)/(o.x2-o.x1):0,f=(o.w1+(o.w2-o.w1)*u)*h.w*l;r([o.d[0]*f,o.d[1]*f,o.d[2]*f],d)}}return{F:n,M:s}}function xx(i){const t=i.length,e=i.map(s=>[...s]),n=Array.from({length:t},(s,r)=>Array.from({length:t},(o,a)=>r===a?1:0));for(let s=0;s<50;s++){let r=0;for(let o=0;o<t;o++)for(let a=o+1;a<t;a++)r+=e[o][a]*e[o][a];if(r<1e-30*(1+e.reduce((o,a,l)=>o+a[l]*a[l],0)))break;for(let o=0;o<t;o++)for(let a=o+1;a<t;a++){if(e[o][a]===0)continue;const l=(e[a][a]-e[o][o])/(2*e[o][a]),c=Math.sign(l||1)/(Math.abs(l)+Math.sqrt(l*l+1)),h=1/Math.sqrt(c*c+1),d=c*h;for(let u=0;u<t;u++){const f=e[u][o],p=e[u][a];e[u][o]=h*f-d*p,e[u][a]=d*f+h*p}for(let u=0;u<t;u++){const f=e[o][u],p=e[a][u];e[o][u]=h*f-d*p,e[a][u]=d*f+h*p}for(let u=0;u<t;u++){const f=n[u][o],p=n[u][a];n[u][o]=h*f-d*p,n[u][a]=d*f+h*p}}}return{values:e.map((s,r)=>s[r]),vectors:n}}function rl(i,t){const e=[0];for(let n=1;n<i.length;n++)e.push(e[n-1]+(i[n]-i[n-1])*(t[n]+t[n-1])/2);return e}function Eh(i,t,e,n,s){const r=rl(i,t),o=s?r.map((h,d)=>h+s[d]):r,a=rl(i,o),l=i[i.length-1],c=(n-e-a[a.length-1])/l;return a.map((h,d)=>h+e+c*i[d])}function yx(i,t,e,n,s,r){const o=new Map,a=c=>{var h;return(c.case??((h=i.loadCases[0])==null?void 0:h.name))===t},l=px({...i,areaLoads:i.areaLoads.filter(a)},s,r);for(const c of n){const h={points:[],dists:[]};for(const u of i.framePointLoads)if(u.frame===c.id&&u.P&&a(u)){const f=qo(u.dir,c.axes);h.points.push({a:Math.min(Math.max(u.rd,0),1)*c.L,p:ei(f,u.P)})}for(const u of i.frameUniformLoads)u.frame===c.id&&u.w&&a(u)&&h.dists.push({x1:0,x2:c.L,w1:u.w,w2:u.w,d:qo(u.dir,c.axes)});const d=qo("GRAV",c.axes);for(const u of l.get(c.id)??[])h.dists.push({...u,d});e&&c.selfWeight>0&&h.dists.push({x1:0,x2:c.L,w1:c.selfWeight,w2:c.selfWeight,d}),o.set(c.id,h)}return o}function Sx(i,t){const e=c=>{const h=c(i);if(!h)return;const d=h.map(()=>0);for(const[u,f]of t){const p=c(u);if(p)for(let g=0;g<d.length;g++)d[g]+=f*p[g]}return d},n={};for(const c of Object.keys(i.disp))n[+c]=e(h=>h.disp[+c]);const s={};for(const c of Object.keys(i.reactions))s[+c]=e(h=>h.reactions[+c]);let r=0;for(const c of Object.values(n))r=Math.max(r,Math.hypot(c[0],c[1],c[2]));const o=i.frames.map((c,h)=>{const d=p=>e(g=>g.frames[h][p]),u=c.disp.map((p,g)=>{const m=[0,0,0];for(const[v,M]of t)for(let _=0;_<3;_++)m[_]+=M*v.frames[h].disp[g][_];return r=Math.max(r,Math.hypot(m[0],m[1],m[2])),m}),f={points:[],dists:[]};for(const[p,g]of t)if(g){for(const m of p.frames[h].loads.points)f.points.push({a:m.a,p:ei(m.p,g)});for(const m of p.frames[h].loads.dists)f.dists.push({...m,w1:m.w1*g,w2:m.w2*g})}return{id:c.id,L:c.L,axes:c.axes,endForces:e(p=>p.frames[h].endForces),x:[...c.x],P:d("P"),V2:d("V2"),V3:d("V3"),T:d("T"),M2:d("M2"),M3:d("M3"),disp:u,loads:f}}),a=c=>{const h=[0,0,0];for(const[d,u]of t)for(let f=0;f<3;f++)h[f]+=u*c(d)[f];return h},l=[...new Set(t.filter(([,c])=>c!==0).flatMap(([c])=>c.warnings))];return{disp:n,reactions:s,frames:o,warnings:l,stats:{...i.stats,maxDisp:r,sumLoad:a(c=>c.stats.sumLoad),sumReaction:a(c=>c.stats.sumReaction)}}}function Mx(i,t){var n;if(!((n=i.loadCases)!=null&&n.length))throw new $e("Define at least one load case.");const e=new Set;for(const s of i.loadCases){if(e.has(s.name))throw new $e(`Load case name "${s.name}" is used more than once.`);e.add(s.name)}for(const s of t){if(e.has(s.name))throw new $e(`Load combination name "${s.name}" is already used by another case or combination.`);e.add(s.name);for(const r of s.factors)if(!i.loadCases.some(o=>o.name===r.case))throw new $e(`Load combination ${s.name} refers to unknown load case "${r.case}".`)}}function bx(i,t){var L;const e=[],n=new Map(i.joints.map(x=>[x.id,x])),s=new Map(i.materials.map(x=>[x.name,x])),r=new Map(i.sections.map(x=>[x.name,x]));if(i.frames.length===0)throw new $e("The model has no frames to analyze.");Mx(i,t);const o=new Set;for(const x of i.frames){if(!n.has(x.i)||!n.has(x.j))throw new $e(`Frame ${x.id} references a missing joint.`);o.add(x.i),o.add(x.j)}for(const x of i.joints)if(!o.has(x.id)&&i.jointLoads.some(y=>y.joint===x.id&&y.f.some(E=>E!==0))&&e.push(`Joint ${x.id} is not connected to any frame; its load is ignored.`),!o.has(x.id)&&Br(x)&&e.push(`Joint ${x.id} is not connected to any frame; its springs are ignored.`),!o.has(x.id)&&(i.jointDisplacements??[]).some(y=>y.joint===x.id&&y.d.some(E=>E!==0))&&e.push(`Joint ${x.id} is not connected to any frame; its prescribed displacement is ignored.`),o.has(x.id)&&x.k){const y=sn.filter((E,D)=>x.r[D]&&x.k[D]>0);y.length&&e.push(`Joint ${x.id}: ${y.join(", ")} is restrained and also has a spring; the restraint is used and the spring is ignored.`)}const a=i.joints.filter(x=>o.has(x.id)),l=new Map(a.map((x,y)=>[x.id,y])),c=a.length,h=[];for(const x of i.frames){const y=n.get(x.i),E=n.get(x.j),D=[y.x,y.y,y.z],N=[E.x,E.y,E.z],F=Math.hypot(N[0]-D[0],N[1]-D[1],N[2]-D[2]);if(F<1e-9)throw new $e(`Frame ${x.id} has zero length.`);const W=s.get(x.material);if(!W)throw new $e(`Frame ${x.id}: material "${x.material}" is not defined.`);const O=r.get(x.section);if(!O)throw new $e(`Frame ${x.id}: section "${x.section}" is not defined.`);const z=Ai(O);if(!(W.E>0))throw new $e(`Material ${W.name}: E must be positive.`);if(!(z.A>0&&z.I22>0&&z.I33>0&&z.J>0))throw new $e(`Section ${O.name}: A, I22, I33 and J must be positive.`);const V=W.E/(2*(1+W.nu)),ot=tl(D,N,x.beta),at=O_(W.E,V,z.A,z.I22,z.I33,z.J,F,z.As2,z.As3),ht=hl(x.relI,x.relJ);if(ht)throw new $e(`Frame ${x.id}: ${ht}`);const At=V_(at,x.relI,x.relJ);if(!At)throw new $e(`Frame ${x.id}: Invalid end releases cause an element mechanism (e.g. releasing axial or torsion at both ends).`);h.push({id:x.id,ji:l.get(x.i),jj:l.get(x.j),L:F,axes:ot,R:B_(ot),kl:at,klCondensed:At.klCondensed,condInfo:At,E:W.E,A:z.A,I22:z.I22,I33:z.I33,G:V,As2:z.As2,As3:z.As3,phi2:qr(W.E,V,z.I33,z.As2,F),phi3:qr(W.E,V,z.I22,z.As3,F),selfWeight:W.gamma>0?W.gamma*z.A:0})}const d=Array.from({length:c},()=>[]);for(const x of h)d[x.ji].push(x.jj),d[x.jj].push(x.ji);const u=gx(d),f=new Int32Array(c*6).fill(-1);let p=0;for(const x of u){const y=a[x];for(let E=0;E<6;E++)y.r[E]||(f[x*6+E]=p++)}const g=x=>{const y=new Int32Array(12);for(let E=0;E<6;E++)y[E]=f[x.ji*6+E],y[6+E]=f[x.jj*6+E];return y};let m=null;if(p>0){const x=new Int32Array(p),y=h.map(g);for(const F of y){let W=1/0;for(const O of F)O>=0&&O<W&&(W=O);for(const O of F)O>=0&&(x[O]=Math.max(x[O],O-W))}m=new mx(x);const E=new Float64Array(c*9);let D=0;if(h.forEach((F,W)=>{const O=ph(F.klCondensed,F.R);for(const[V,ot]of[[F.ji,3],[F.jj,9]])for(let at=0;at<3;at++){for(let ht=0;ht<3;ht++)E[V*9+at*3+ht]+=O[(ot+at)*12+ot+ht];D=Math.max(D,Math.abs(F.kl[(ot+at)*12+ot+at]))}const z=y[W];for(let V=0;V<12;V++){const ot=z[V];if(!(ot<0))for(let at=0;at<12;at++){const ht=z[at];ht<0||ht<ot||m.add(ot,ht,O[V*12+at])}}}),a.forEach((F,W)=>{if(F.k)for(let O=0;O<6;O++){const z=F.k[O],V=f[W*6+O];!(z>0)||V<0||(m.add(V,V,z),O>=3&&(E[W*9+(O-3)*4]+=z))}}),D>0){const F=1e-9*D,W=1e-9*D,O=[];for(let z=0;z<c;z++){const V=[0,1,2].filter(Tt=>f[z*6+3+Tt]>=0);if(!V.length)continue;const ot=V.map(Tt=>V.map(q=>E[z*9+Tt*3+q])),{values:at,vectors:ht}=xx(ot);let At=!1;at.forEach((Tt,q)=>{if(!(Tt>=F)){At=!0;for(let G=0;G<V.length;G++)for(let nt=0;nt<V.length;nt++){const tt=f[z*6+3+V[G]],ut=f[z*6+3+V[nt]];ut<tt||m.add(tt,ut,W*ht[G][q]*ht[nt][q])}}}),At&&O.push(String(a[z].id))}if(O.length){const z=O.length>10?`${O.slice(0,10).join(", ")} … (${O.length} total)`:O.join(", ");e.push(`Joint rotation not resisted by any member at joint(s) ${z}; stabilised automatically (joint moments there are not carried).`)}}const N=m.factor();if(N>=0){let F=`equation ${N}`;for(let W=0;W<c;W++)for(let O=0;O<6;O++)f[W*6+O]===N&&(F=`joint ${a[W].id} (${sn[O]})`);throw new $e(`The structure is unstable (mechanism) at ${F}. Check supports and connectivity.`)}}else e.push("All degrees of freedom are restrained.");const v=i.settings.selfWeight?(L=i.loadCases.find(x=>x.type==="Dead"))==null?void 0:L.name:void 0;i.settings.selfWeight&&!v&&e.push("Self weight is on but there is no Dead load case; it was ignored.");const M=new Map,_=new Map;for(const x of i.loadCases){const y=[];_.set(x.name,yx(i,x.name,x.name===v,h,n,y)),M.set(x.name,y)}const S=new Map;for(const x of h){const y=[];for(let D=0;D<=bh;D++)y.push({x:x.L*D/bh,inc:!0});const E=[];for(const D of _.values())for(const N of D.get(x.id).points)N.a>1e-9&&N.a<x.L-1e-9&&!E.some(F=>Math.abs(F-N.a)<1e-12)&&(E.push(N.a),y.push({x:N.a,inc:!1},{x:N.a,inc:!0}));y.sort((D,N)=>D.x-N.x||Number(D.inc)-Number(N.inc)),S.set(x.id,y)}const P={};for(const x of i.loadCases){const y=_.get(x.name),E=[...e,...M.get(x.name)],D=h.map(G=>vx(y.get(G.id),G.L,G.phi2,G.phi3)),N=h.map((G,nt)=>G_(D[nt],G.condInfo)),F=new Float64Array(c*6);for(const G of i.jointLoads){if((G.case??i.loadCases[0].name)!==x.name)continue;const nt=l.get(G.joint);if(nt!==void 0)for(let tt=0;tt<6;tt++)F[nt*6+tt]+=G.f[tt]}const W=Float64Array.from(F),O=[0,0,0];for(let G=0;G<c;G++)for(let nt=0;nt<3;nt++)O[nt]+=F[G*6+nt];h.forEach((G,nt)=>{const tt=fh(G.R,N[nt]);for(let ut=0;ut<6;ut++)F[G.ji*6+ut]-=tt[ut],F[G.jj*6+ut]-=tt[6+ut];for(let ut=0;ut<3;ut++)O[ut]-=tt[ut]+tt[6+ut]});const z=new Float64Array(c*6);let V=!1;for(const G of i.jointDisplacements??[]){if((G.case??i.loadCases[0].name)!==x.name)continue;const nt=l.get(G.joint);if(nt!==void 0){for(let tt=0;tt<6;tt++)if(G.d[tt]){if(f[nt*6+tt]>=0){E.push(`Joint ${G.joint}: prescribed ${sn[tt]} is ignored because that DOF is not restrained.`);continue}z[nt*6+tt]+=G.d[tt],V=!0}}}if(V)for(const G of h){const nt=new Float64Array(12);let tt=!1;for(let Ct=0;Ct<6;Ct++)nt[Ct]=z[G.ji*6+Ct],nt[6+Ct]=z[G.jj*6+Ct],(nt[Ct]||nt[6+Ct])&&(tt=!0);if(!tt)continue;const ut=ph(G.klCondensed,G.R);for(let Ct=0;Ct<12;Ct++){let Pt=0;for(let Ot=0;Ot<12;Ot++)Pt+=ut[Ct*12+Ot]*nt[Ot];F[(Ct<6?G.ji:G.jj)*6+Ct%6]-=Pt}}if(m){const G=new Float64Array(p);for(let nt=0;nt<c*6;nt++)f[nt]>=0&&(G[f[nt]]=F[nt]);m.solve(G);for(let nt=0;nt<c*6;nt++)f[nt]>=0&&(z[nt]=G[f[nt]])}const ot=new Float64Array(c*6),at=[];let ht=0;for(let G=0;G<c;G++)ht=Math.max(ht,Math.hypot(z[G*6],z[G*6+1],z[G*6+2]));h.forEach((G,nt)=>{const tt=y.get(G.id),ut=new Float64Array(12);for(let K=0;K<6;K++)ut[K]=z[G.ji*6+K],ut[6+K]=z[G.jj*6+K];const Ct=z_(G.R,ut),Pt=H_(Ct,D[nt],G.condInfo),Ot=new Float64Array(12);for(let K=0;K<12;K++){let dt=D[nt][K];for(let gt=0;gt<12;gt++)dt+=G.kl[K*12+gt]*Pt[gt];Ot[K]=dt}let et=0;for(const K of[0,1,2,6,7,8])et=Math.max(et,Math.abs(Ot[K]));let ct=et*G.L;for(const K of[3,4,5,9,10,11])ct=Math.max(ct,Math.abs(Ot[K]));const U=K=>Yo*(K%6<3?et:ct);for(const K of G.condInfo.released)Math.abs(Ot[K])<U(K)&&(Ot[K]=0);const Rt=fh(G.R,Ot);for(let K=0;K<6;K++)ot[G.ji*6+K]+=Rt[K],ot[G.jj*6+K]+=Rt[6+K];const J={id:G.id,L:G.L,axes:G.axes,endForces:Array.from(Ot),x:[],P:[],V2:[],V3:[],T:[],M2:[],M3:[],disp:[],loads:tt};for(const{x:K,inc:dt}of S.get(G.id)){const{F:gt,M:Gt}=_x(tt,K,dt),rt=[-(Ot[0]+gt[0]),-(Ot[1]+gt[1]),-(Ot[2]+gt[2])],xt=-K,Dt=[Ot[3],Ot[4]+-xt*Ot[2],Ot[5]+xt*Ot[1]],zt=[-(Dt[0]+Gt[0]),-(Dt[1]+Gt[1]),-(Dt[2]+Gt[2])];J.x.push(K),J.P.push(rt[0]),J.V2.push(rt[1]),J.V3.push(rt[2]),J.T.push(zt[0]),J.M2.push(zt[1]),J.M3.push(zt[2])}{const K=rt=>rt.reduce((xt,Dt)=>Dt.reduce((zt,wt)=>Math.max(zt,Math.abs(wt)),xt),0),dt=Math.max(et,K([J.P,J.V2,J.V3])),gt=Math.max(ct,dt*G.L,K([J.T,J.M2,J.M3])),Gt=(rt,xt)=>{for(let Dt=0;Dt<rt.length;Dt++)Math.abs(rt[Dt])<xt&&(rt[Dt]=0)};for(const rt of[J.P,J.V2,J.V3])Gt(rt,Yo*dt);for(const rt of[J.T,J.M2,J.M3])Gt(rt,Yo*gt)}const Mt=rl(J.x,J.P.map(K=>K/(G.E*G.A))),pt=(Pt[6]-Pt[0]-Mt[Mt.length-1])/G.L,Bt=J.x.map((K,dt)=>Pt[0]+Mt[dt]+pt*K),Et=G.As2>0?J.V2.map(K=>K/(G.G*G.As2)):void 0,R=G.As3>0?J.V3.map(K=>K/(G.G*G.As3)):void 0,b=Eh(J.x,J.M3.map(K=>K/(G.E*G.I33)),Pt[1],Pt[7],Et),$=Eh(J.x,J.M2.map(K=>-K/(G.E*G.I22)),Pt[2],Pt[8],R),[Z,st,Q]=G.axes;for(let K=0;K<J.x.length;K++){const dt=[Z[0]*Bt[K]+st[0]*b[K]+Q[0]*$[K],Z[1]*Bt[K]+st[1]*b[K]+Q[1]*$[K],Z[2]*Bt[K]+st[2]*b[K]+Q[2]*$[K]];J.disp.push(dt),ht=Math.max(ht,Math.hypot(dt[0],dt[1],dt[2]))}at.push(J)});const At={},Tt={},q=[0,0,0];a.forEach((G,nt)=>{if(At[G.id]=Array.from(z.subarray(nt*6,nt*6+6)),G.r.some(Boolean)||Br(G)){const tt=[0,0,0,0,0,0];for(let ut=0;ut<6;ut++)G.r[ut]?tt[ut]=ot[nt*6+ut]-W[nt*6+ut]:G.k&&G.k[ut]>0&&(tt[ut]=-G.k[ut]*z[nt*6+ut]);Tt[G.id]=tt;for(let ut=0;ut<3;ut++)q[ut]+=tt[ut]}});for(const G of i.joints)At[G.id]||(At[G.id]=[0,0,0,0,0,0]);P[x.name]={disp:At,reactions:Tt,frames:at,warnings:[...new Set(E)],stats:{joints:c,frames:h.length,equations:p,maxDisp:ht,sumLoad:O,sumReaction:q}}}const A=i.loadCases.map(x=>({name:x.name,kind:"case"})),T=P[i.loadCases[0].name];for(const x of t){const y=Sx(T,x.factors.map(E=>[P[E.case],E.factor]));x.factors.length===0&&y.warnings.push(`Load combination ${x.name} has no load cases.`),P[x.name]=y,A.push({name:x.name,kind:"combo"})}return{items:A,results:P}}function Ex(i){const t=Gr(JSON.parse(JSON.stringify(i)));return bx(t,t.loadCombos)}let hn=null,wx=0;const Es=new Map;function Ax(){if(hn)return hn;try{hn=new Worker(new URL(""+new URL("worker-BZYxH_qK.js",import.meta.url).href,import.meta.url),{type:"module"}),hn.onmessage=i=>{const t=Es.get(i.data.id);t&&(Es.delete(i.data.id),i.data.ok?t.resolve(i.data.results):t.reject(new Error(i.data.error)))},hn.onerror=i=>{for(const t of Es.values())t.reject(new Error(i.message||"Analysis worker failed"));Es.clear(),hn==null||hn.terminate(),hn=null}}catch{hn=null}return hn}function Tx(i){const t=Ax();if(!t)return new Promise((n,s)=>{setTimeout(()=>{try{n(Ex(i))}catch(r){s(r instanceof Error?r:new Error(String(r)))}},0)});const e=++wx;return new Promise((n,s)=>{Es.set(e,{resolve:n,reject:s}),t.postMessage({id:e,data:i})})}function ju(i,t,e,n=1e-9){const s=i.length;if(!s)return{left:0,right:0};if(e<=i[0]+n){let r=0;for(;r+1<s&&i[r+1]<=i[0]+n;)r++;return{left:t[0],right:t[r]}}if(e>=i[s-1]-n){let r=s-1;for(;r>0&&i[r-1]>=i[s-1]-n;)r--;return{left:t[r],right:t[s-1]}}for(let r=1;r<s;r++){if(Math.abs(i[r]-e)<=n){let o=r;for(;o+1<s&&Math.abs(i[o+1]-e)<=n;)o++;return{left:t[r],right:t[o]}}if(i[r]>e){const o=i[r]-i[r-1],a=o<=n?t[r]:t[r-1]+(t[r]-t[r-1])*(e-i[r-1])/o;return{left:a,right:a}}}return{left:t[s-1],right:t[s-1]}}function Cx(i,t,e){const n=i.axes[t],s=i.disp.map(a=>a[0]*n[0]+a[1]*n[1]+a[2]*n[2]);if(!e||s.length<2||i.L<=0)return s;const r=s[0],o=s[s.length-1];return s.map((a,l)=>a-(r+(o-r)*i.x[l]/i.L))}const Rx={TON:"TONF",KG:"KGF",KIPS:"KIP",LBF:"LB",LBS:"LB",FEET:"FT",INCH:"IN"};function Lx(i){const[t,e]=i.split(/[\s,;/-]+/).filter(Boolean).map(n=>{const s=n.toUpperCase();return Rx[s]??s});return ls.find(n=>n.force.toUpperCase()===t&&n.length.toUpperCase()===e)}const Px="StructApp3D",Dx="1.0";class xe extends Error{}const Jo=`\r
`,Ix=["rect","circle","pipe","I","box","unp","C","general"],Ux=["XY","XZ","YZ"];function Xu(i){let t=typeof i=="number"?Nx(i):typeof i=="boolean"?i?"Yes":"No":i;return(/[",\r\n]/.test(t)||/^\s|\s$/.test(t))&&(t='"'+t.replace(/"/g,'""')+'"'),t}function Nx(i){return!Number.isFinite(i)||Math.abs(i)<1e-300?"0":String(Number(i.toPrecision(12)))}function Zo(i){return i.map(Xu).join(",")}function Me(i,t,e){return[Zo(["TABLE",i]),Zo(t),...e.map(Zo)].join(Jo)+Jo+Jo}const Ko=i=>i?1:0,Xi=(i,t,e)=>ju(i,t,e).left;function wh(i,t,e=new Date,n=Ve()){const s=(u,f)=>Il(u,f,n),r=u=>Yt(u,n,!0),o=r("F"),a=r("M"),l=r("L");let c="";c+=Me("PROGRAM",["Program","Version","Units","Saved"],[[Px,Dx,`${n.force}, ${n.length}, C`,e.toISOString()]]);const h=i.settings;c+=Me("SETTINGS",["GridSpacing","GridLines","WorkPlane","Elevation","SelfWeight"],[[s(h.gridSpacing,"L"),h.gridLines,h.workPlane,s(h.elevation,"L"),Ko(h.selfWeight)]]),c+=Me("MATERIALS",["Name",`E (${r("FA")})`,"Poisson",`UnitWeight (${r("FV")})`],i.materials.map(u=>[u.name,s(u.E,"FA"),u.nu,s(u.gamma,"FV")])),c+=Me("SECTIONS",["Name","Shape","Dim1","Dim2","Dim3","Dim4",`A (${r("A")})`,`I33 (${r("L4")})`,`I22 (${r("L4")})`,`J (${r("L4")})`,`As2 (${r("A")})`,`As3 (${r("A")})`,"Override","Catalog","Mass (kg/m)"],i.sections.map(u=>{const f=Ai(u),p=[0,1,2,3].map(m=>u.dims[m]===void 0?"":s(u.dims[m],jr(u.shape,m))),g=!!u.props&&u.shape!=="general";return[u.name,u.shape,...p,s(f.A,"A"),s(f.I33,"L4"),s(f.I22,"L4"),s(f.J,"L4"),s(f.As2,"A"),s(f.As3,"A"),g,u.catalog??"",u.mass??""]})),c+=Me("SUPPORT TYPES",["Name",...sn],i.supportTypes.map(u=>[u.name,...u.r.map(Ko)])),c+=Me("JOINTS",["ID",`X (${l})`,`Y (${l})`,`Z (${l})`],i.joints.map(u=>[u.id,s(u.x,"L"),s(u.y,"L"),s(u.z,"L")])),c+=Me("JOINT RESTRAINTS",["Joint",...sn],i.joints.filter(u=>u.r.some(Boolean)).map(u=>[u.id,...u.r.map(Ko)])),c+=Me("SPRINGS",["Joint",...Qr.map((u,f)=>`${u} (${r(f<3?"FL":"MR")})`)],i.joints.filter(Br).map(u=>[u.id,...u.k.map((f,p)=>s(f,p<3?"FL":"MR"))]));const d=new Map(i.joints.map(u=>[u.id,u]));if(c+=Me("FRAMES",["ID","JointI","JointJ","Material","Section","Beta (deg)","Rel_I","Rel_J",`Length (${l})`],i.frames.map(u=>{const f=d.get(u.i),p=d.get(u.j),g=f&&p?Math.hypot(p.x-f.x,p.y-f.y,p.z-f.z):0;return[u.id,u.i,u.j,u.material,u.section,u.beta,zr(u.relI),zr(u.relJ),s(g,"L")]})),c+=Me("AREAS",["ID","Joints","Distribution","NumJoints"],i.areas.map(u=>[u.id,u.joints.join(" "),u.distribution,u.joints.length])),c+=Me("LOAD CASES",["Name","Type"],i.loadCases.map(u=>[u.name,u.type])),c+=Me("LOAD COMBOS",["Combo","LoadCase","Factor"],i.loadCombos.flatMap(u=>u.factors.length?u.factors.map(f=>[u.name,f.case,f.factor]):[[u.name,"",""]])),c+=Me("JOINT LOADS",["Joint",`FX (${o})`,`FY (${o})`,`FZ (${o})`,`MX (${a})`,`MY (${a})`,`MZ (${a})`,"LoadCase"],i.jointLoads.map(u=>[u.joint,...u.f.map((f,p)=>s(f,p<3?"F":"M")),u.case])),c+=Me("JOINT DISPLACEMENTS",["Joint",`UX (${l})`,`UY (${l})`,`UZ (${l})`,"RX (rad)","RY (rad)","RZ (rad)","LoadCase"],(i.jointDisplacements??[]).map(u=>[u.joint,...u.d.map((f,p)=>p<3?s(f,"L"):f),u.case])),c+=Me("FRAME POINT LOADS",["Frame","Direction",`P (${o})`,"RelDist","LoadCase"],i.framePointLoads.map(u=>[u.frame,u.dir,s(u.P,"F"),u.rd,u.case])),c+=Me("FRAME UNIFORM LOADS",["Frame","Direction",`W (${r("FL")})`,"LoadCase"],i.frameUniformLoads.map(u=>[u.frame,u.dir,s(u.w,"FL"),u.case])),c+=Me("AREA LOADS",["Area",`Q (${r("FA")}, downward)`,"LoadCase"],i.areaLoads.map(u=>[u.area,s(u.q,"FA"),u.case])),t){const u=t.items.map(p=>[p.name,t.results[p.name]]).filter(([,p])=>p);c+=Me("RESULTS JOINT DISPLACEMENTS",["Case","Joint",`UX (${l})`,`UY (${l})`,`UZ (${l})`,"RX (rad)","RY (rad)","RZ (rad)"],u.flatMap(([p,g])=>Object.entries(g.disp).map(([m,v])=>[p,Number(m),...v.map((M,_)=>_<3?s(M,"L"):M)]))),c+=Me("RESULTS JOINT REACTIONS",["Case","Joint",`FX (${o})`,`FY (${o})`,`FZ (${o})`,`MX (${a})`,`MY (${a})`,`MZ (${a})`],u.flatMap(([p,g])=>Object.entries(g.reactions).map(([m,v])=>[p,Number(m),...v.map((M,_)=>s(M,_<3?"F":"M"))])));const f=[];for(const[p,g]of u)for(const m of g.frames)for(let M=0;M<=10;M++){const _=m.L*M/10;f.push([p,m.id,s(_,"L"),s(Xi(m.x,m.P,_),"F"),s(Xi(m.x,m.V2,_),"F"),s(Xi(m.x,m.V3,_),"F"),s(Xi(m.x,m.T,_),"M"),s(Xi(m.x,m.M2,_),"M"),s(Xi(m.x,m.M3,_),"M")])}c+=Me("RESULTS FRAME FORCES",["Case","Frame",`Station (${l})`,`P (${o})`,`V2 (${o})`,`V3 (${o})`,`T (${a})`,`M2 (${a})`,`M3 (${a})`],f)}return c}function qu(i,t=Ul(i)){i.charCodeAt(0)===65279&&(i=i.slice(1));const e=[];let n=[],s="",r=!1;for(let o=0;o<i.length;o++){const a=i[o];r?a==='"'?i[o+1]==='"'?(s+='"',o++):r=!1:s+=a:a==='"'?r=!0:a===t?(n.push(s),s=""):a===`
`||a==="\r"?(a==="\r"&&i[o+1]===`
`&&o++,n.push(s),e.push(n),n=[],s=""):s+=a}return(s!==""||n.length)&&(n.push(s),e.push(n)),e}function Yu(i,t=!1){let e=i.replace(/[\s\u00a0']/g,"");return e===""?NaN:(t&&e.includes(",")?e=e.replace(/\./g,"").replace(",","."):e=e.replace(/,/g,""),Number(e))}function Ul(i){i.charCodeAt(0)===65279&&(i=i.slice(1));const t=i.slice(0,i.search(/\r?\n|$/)).replace(/"[^"]*"/g,""),e=n=>t.split(n).length-1;return e(";")>e(",")?";":","}function Fx(i){const t=[];let e=null,n=!1;return i.forEach((s,r)=>{const o=s.map(a=>a.trim());for(;o.length&&o[o.length-1]==="";)o.pop();if(!o.length){e=null;return}if(o[0].toUpperCase()==="TABLE"){e={name:(o[1]??"").toUpperCase(),header:[],rows:[]},t.push(e),n=!0;return}if(e){if(n){e.header=o.map(a=>a.replace(/\s*\(.*\)\s*$/,"").trim().toUpperCase()),n=!1;return}e.rows.push({cells:o,line:r+1})}}),t}class Ox{constructor(t,e,n,s=!1){this.t=t,this.cells=e,this.line=n,this.decimalComma=s}idx(t,e){const n=this.t.header.indexOf(t.toUpperCase());return n>=0?n:e}str(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new xe(`Line ${this.line} (${this.t.name}): missing ${t}`)}return s}num(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new xe(`Line ${this.line} (${this.t.name}): missing ${t}`)}const r=Yu(s,this.decimalComma);if(!Number.isFinite(r))throw new xe(`Line ${this.line} (${this.t.name}): "${s}" is not a number (${t})`);return r}bool(t,e){const n=(this.cells[this.idx(t,e)]??"").toUpperCase();return n==="1"||n==="YES"||n==="TRUE"||n==="Y"}}function Ah(i,t){const e=Fx(qu(i));if(!e.length)throw new xe('No tables found. A .sav file must contain rows like "TABLE,JOINTS".');const n=Ul(i)===";",s=_=>e.find(S=>S.name===_),r=_=>{const S=s(_);return S?S.rows.map(P=>new Ox(S,P.cells,P.line,n)):[]},o=dl(),a=r("PROGRAM")[0],l=a?a.str("Units",2,""):"",c=l?Lx(l):el;if(!c)throw new xe(`PROGRAM: unknown units "${l}". Use one of: ${ls.map(_=>`${_.force}, ${_.length}`).join(" / ")}`);t&&l&&(t.units=c.id);const h=(_,S)=>Gu(_,S,c),d=r("SETTINGS")[0];if(d){o.settings.gridSpacing=d.num("GridSpacing",0,NaN),Number.isFinite(o.settings.gridSpacing)?o.settings.gridSpacing=h(o.settings.gridSpacing,"L"):o.settings.gridSpacing=1,o.settings.gridLines=Math.round(d.num("GridLines",1,10));const _=d.str("WorkPlane",2,"XY").toUpperCase();o.settings.workPlane=Ux.includes(_)?_:"XY",o.settings.elevation=h(d.num("Elevation",3,0),"L"),o.settings.selfWeight=d.bool("SelfWeight",4)}s("MATERIALS")&&(o.materials=r("MATERIALS").map(_=>({name:_.str("Name",0),E:h(_.num("E",1),"FA"),nu:_.num("Poisson",2,.3),gamma:h(_.num("UnitWeight",3,0),"FV")}))),s("SECTIONS")&&(o.sections=r("SECTIONS").map(_=>{const S=_.str("Shape",1),P=Ix.find(y=>y.toUpperCase()===S.toUpperCase());if(!P)throw new xe(`Line ${_.line} (SECTIONS): unknown shape "${S}"`);const A=[];for(let y=1;y<=4;y++){const E=_.num("Dim"+y,1+y,NaN);if(Number.isFinite(E))A.push(h(E,jr(P,y-1)));else break}const T={name:_.str("Name",0),shape:P,dims:A};P!=="general"&&_.bool("Override",-1)&&(T.props={A:h(_.num("A",6),"A"),I33:h(_.num("I33",7),"L4"),I22:h(_.num("I22",8),"L4"),J:h(_.num("J",9),"L4")});const L=_.str("Catalog",-1,"");L&&(T.catalog=L);const x=_.num("Mass",-1,NaN);return x>0&&(T.mass=x),T})),s("SUPPORT TYPES")&&(o.supportTypes=r("SUPPORT TYPES").map(_=>({name:_.str("Name",0),r:sn.map((S,P)=>_.bool(S,P+1))}))),o.joints=r("JOINTS").map(_=>({id:_.num("ID",0),x:h(_.num("X",1),"L"),y:h(_.num("Y",2),"L"),z:h(_.num("Z",3),"L"),r:[!1,!1,!1,!1,!1,!1]}));const u=new Map(o.joints.map(_=>[_.id,_]));if(u.size!==o.joints.length)throw new xe("JOINTS: duplicate joint IDs");for(const _ of r("JOINT RESTRAINTS")){const S=_.num("Joint",0),P=u.get(S);if(!P)throw new xe(`Line ${_.line} (JOINT RESTRAINTS): joint ${S} does not exist`);P.r=sn.map((A,T)=>_.bool(A,T+1))}for(const _ of r("SPRINGS")){const S=_.num("Joint",0),P=u.get(S);if(!P)throw new xe(`Line ${_.line} (SPRINGS): joint ${S} does not exist`);const A=Qr.map((T,L)=>h(_.num(T,L+1,0),L<3?"FL":"MR"));if(A.some(T=>T<0))throw new xe(`Line ${_.line} (SPRINGS): spring stiffness must not be negative`);A.some(T=>T>0)&&(P.k=A)}const f=(_,S,P)=>{if(!u.has(_))throw new xe(`Line ${S.line} (${P}): joint ${_} does not exist`);return _};o.frames=r("FRAMES").map(_=>{var x,y;const S=E=>{try{return Md(_.str(E,-1,"None"))}catch(D){throw new xe(`Line ${_.line} (FRAMES): ${D.message} (column ${E})`)}},P=S("Rel_I"),A=S("Rel_J"),T=hl(P,A);if(T)throw new xe(`Line ${_.line} (FRAMES): ${T}`);const L={id:_.num("ID",0),i:f(_.num("JointI",1),_,"FRAMES"),j:f(_.num("JointJ",2),_,"FRAMES"),material:_.str("Material",3,((x=o.materials[0])==null?void 0:x.name)??""),section:_.str("Section",4,((y=o.sections[0])==null?void 0:y.name)??""),beta:_.num("Beta",5,0)};return P&&(L.relI=P),A&&(L.relJ=A),L});const p=new Set(o.frames.map(_=>_.id));if(p.size!==o.frames.length)throw new xe("FRAMES: duplicate frame IDs");o.areas=r("AREAS").map(_=>{const S=_.str("Joints",1).split(/[\s;|]+/).filter(Boolean).map(Number);S.forEach(A=>f(A,_,"AREAS"));const P=_.str("Distribution",2,"two-way").toLowerCase();return{id:_.num("ID",0),joints:S,distribution:P==="one-way"?"one-way":"two-way"}});const g=new Set(o.areas.map(_=>_.id)),m=_=>{const S=_.str("Direction",1).toUpperCase();if(!Hh.includes(S))throw new xe(`Line ${_.line}: unknown load direction "${S}"`);return S},v=(_,S)=>{if(!p.has(_))throw new xe(`Line ${S.line}: frame ${_} does not exist`);return _};if(s("LOAD CASES")&&(o.loadCases=r("LOAD CASES").map(_=>{const S=_.str("Type",1,"Other"),P=Wh.find(A=>A.toUpperCase()===S.toUpperCase())??"Other";return{name:_.str("Name",0),type:P}}),new Set(o.loadCases.map(_=>_.name)).size!==o.loadCases.length))throw new xe("LOAD CASES: duplicate names");if(s("LOAD COMBOS")){o.loadCombos=[];for(const _ of r("LOAD COMBOS")){const S=_.str("Combo",0);let P=o.loadCombos.find(T=>T.name===S);P||o.loadCombos.push(P={name:S,factors:[]});const A=_.str("LoadCase",1,"");if(A){if(!o.loadCases.some(T=>T.name===A))throw new xe(`Line ${_.line} (LOAD COMBOS): load case "${A}" does not exist`);P.factors.push({case:A,factor:_.num("Factor",2)})}}}const M=_=>{const S=_.str("LoadCase",99,"");if(S&&!o.loadCases.some(P=>P.name===S))throw new xe(`Line ${_.line}: load case "${S}" does not exist`);return S};return o.jointLoads=r("JOINT LOADS").map(_=>({case:M(_),joint:f(_.num("Joint",0),_,"JOINT LOADS"),f:["FX","FY","FZ","MX","MY","MZ"].map((S,P)=>h(_.num(S,P+1,0),P<3?"F":"M"))})),o.jointDisplacements=r("JOINT DISPLACEMENTS").map(_=>({case:M(_),joint:f(_.num("Joint",0),_,"JOINT DISPLACEMENTS"),d:sn.map((S,P)=>P<3?h(_.num(S,P+1,0),"L"):_.num(S,P+1,0))})),o.framePointLoads=r("FRAME POINT LOADS").map(_=>({case:M(_),frame:v(_.num("Frame",0),_),dir:m(_),P:h(_.num("P",2),"F"),rd:Math.min(1,Math.max(0,_.num("RelDist",3,.5)))})),o.frameUniformLoads=r("FRAME UNIFORM LOADS").map(_=>({case:M(_),frame:v(_.num("Frame",0),_),dir:m(_),w:h(_.num("W",2),"FL")})),o.areaLoads=r("AREA LOADS").map(_=>{const S=_.num("Area",0);if(!g.has(S))throw new xe(`Line ${_.line} (AREA LOADS): area ${S} does not exist`);return{case:M(_),area:S,q:h(_.num("Q",1),"FA")}}),Gr(o),o}const Ju={sav:[{description:"StructApp 3D model",accept:{"text/csv":[".sav"]}}],csv:[{description:"CSV table (Excel)",accept:{"text/csv":[".csv"]}}],dxf:[{description:"DXF drawing",accept:{"application/dxf":[".dxf"]}}]},Zu=i=>i instanceof DOMException&&i.name==="AbortError";function Th(i,t="sav"){i=i.trim()||(t==="csv"?"table":"model");const e="."+t;return i.toLowerCase().endsWith(e)?i:i.replace(/\.[^.]*$/,"")+e}async function Zr(i,t,e,n="sav"){const s=window;if(s.showSaveFilePicker)try{const c=e??await s.showSaveFilePicker({suggestedName:Th(t,n),types:Ju[n]}),h=await c.createWritable();return await h.write(i),await h.close(),{name:c.name,handle:c}}catch(c){if(Zu(c))return null;console.warn("File System Access save failed, falling back to download",c)}const r=Th(t,n),o=new Blob([i],{type:n==="dxf"?"application/dxf":"text/csv;charset=utf-8"}),a=URL.createObjectURL(o),l=document.createElement("a");return l.href=a,l.download=r,document.body.appendChild(l),l.click(),l.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e4),{name:r,handle:null}}const Bx=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;async function ol(i="sav"){const t=window;if(t.showOpenFilePicker)try{const[e]=await t.showOpenFilePicker({types:Ju[i]}),n=await e.getFile();return{name:n.name,text:await n.text(),handle:e}}catch(e){if(Zu(e))return null;console.warn("File System Access open failed, falling back to input",e)}return new Promise(e=>{const n=document.createElement("input");n.type="file",Bx()||(n.accept=i==="dxf"?".dxf,application/dxf,image/vnd.dxf":".sav,.csv,text/csv,text/plain"),n.style.display="none",document.body.appendChild(n);let s=!1;n.addEventListener("change",async()=>{var o;s=!0;const r=(o=n.files)==null?void 0:o[0];if(n.remove(),!r)return e(null);e({name:r.name,text:await r.text(),handle:null})}),n.addEventListener("cancel",()=>{s||e(null),n.remove()}),n.click()})}const Nl="structapp3d.autosave";function zx(i,t){try{localStorage.setItem(Nl,JSON.stringify({text:i,name:t,time:Date.now()}))}catch{}}function kx(){try{const i=localStorage.getItem(Nl);return i?JSON.parse(i):null}catch{return null}}function ys(){try{localStorage.removeItem(Nl)}catch{}}class Ch extends Error{}function Vx(i){return{1:.0254,2:.3048,3:1609.344,4:.001,5:.01,6:1,7:1e3,8:254e-10,9:254e-7,10:.9144,11:1e-10,12:1e-9,13:1e-6,14:.1}[i]??null}function Gx(i){const t=e=>Math.abs(i-e)<e*1e-9;return t(1)?6:t(.001)?4:t(.3048)?2:t(.0254)?1:t(.01)?5:0}function Rh(i){const t=Math.hypot(i[0],i[1],i[2]);if(t<1e-12||Math.abs(i[0])<1e-12&&Math.abs(i[1])<1e-12&&i[2]>0)return r=>r;const e=[i[0]/t,i[1]/t,i[2]/t],n=Xr(Math.abs(e[0])<1/64&&Math.abs(e[1])<1/64?si([0,1,0],e):si([0,0,1],e)),s=Xr(si(e,n));return([r,o,a])=>[r*n[0]+o*s[0]+a*e[0],r*n[1]+o*s[1]+a*e[1],r*n[2]+o*s[2]+a*e[2]]}function Hx(i){var f,p;if(i.startsWith("AutoCAD Binary DXF"))throw new Ch("Binary DXF is not supported. Save the drawing as ASCII DXF.");const t=i.replace(/^\uFEFF/,"").split(/\r?\n/),e=[];for(let g=0;g+1<t.length;g+=2){const m=Number(t[g].trim());if(!Number.isInteger(m))throw new Ch(`Not a valid ASCII DXF file (bad group code on line ${g+1}).`);e.push([m,t[g+1].trim()])}const n={insUnits:0,entities:[],layers:{},skipped:{},bulges:0},s=g=>n.skipped[g]=(n.skipped[g]??0)+1,r=g=>{n.entities.push(g),n.layers[g.layer]=(n.layers[g.layer]??0)+1};let o="",a=0;const l=[];for(;a<e.length;){const[g,m]=e[a];if(g===0&&m==="SECTION"){o=((f=e[a+1])==null?void 0:f[0])===2?e[a+1][1].toUpperCase():"",a+=2;continue}if(g===0&&m==="ENDSEC"){o="",a++;continue}if(g===0&&m==="EOF")break;if(o==="HEADER"&&g===9&&m==="$INSUNITS"){const v=e[a+1];v&&v[0]===70&&(n.insUnits=Number(v[1])||0),a+=2;continue}if(o==="ENTITIES"&&g===0){const v=[];for(a++;a<e.length&&e[a][0]!==0;)v.push(e[a++]);l.push({type:m.toUpperCase(),g:v});continue}a++}const c=(g,m,v=0)=>{const M=g.find(S=>S[0]===m),_=M?Number(M[1]):v;return Number.isFinite(_)?_:v},h=g=>{var m;return((m=g.find(v=>v[0]===8))==null?void 0:m[1])??"0"},d=(g,m)=>[c(g,10+m),c(g,20+m),c(g,30+m)],u=g=>[c(g,210),c(g,220),c(g,230,1)];for(let g=0;g<l.length;g++){const{type:m,g:v}=l[g],M=h(v);switch(m){case"LINE":r({kind:"line",layer:M,pts:[d(v,0),d(v,1)],closed:!1});break;case"POINT":r({kind:"point",layer:M,pts:[d(v,0)],closed:!1});break;case"3DFACE":{const _=[d(v,0),d(v,1),d(v,2),d(v,3)];((P,A)=>P[0]===A[0]&&P[1]===A[1]&&P[2]===A[2])(_[3],_[2])&&_.pop(),r({kind:"face",layer:M,pts:_,closed:!0});break}case"LWPOLYLINE":{const _=c(v,38),S=Rh(u(v)),P=[];let A=null;for(const[T,L]of v)T===10?A=Number(L):T===20&&A!==null?(P.push(S([A,Number(L),_])),A=null):T===42&&Number(L)!==0&&n.bulges++;P.length>=2&&r({kind:"poly",layer:M,pts:P,closed:(c(v,70)&1)===1});break}case"POLYLINE":{const _=c(v,70),S=[];for(;g+1<l.length&&l[g+1].type==="VERTEX";)S.push(l[++g].g);if(((p=l[g+1])==null?void 0:p.type)==="SEQEND"&&g++,_&80){s(_&64?"POLYLINE (polyface mesh)":"POLYLINE (polygon mesh)");break}const P=(_&8)!==0,A=P?x=>x:Rh(u(v)),T=c(v,30),L=[];for(const x of S){if(c(x,70)&16)continue;c(x,42)!==0&&n.bulges++;const y=d(x,0);L.push(A(P?y:[y[0],y[1],T]))}L.length>=2&&r({kind:"poly",layer:M,pts:L,closed:(_&1)===1});break}case"VERTEX":case"SEQEND":break;default:s(m)}}return n}const Qo=i=>Qu(i).toUpperCase(),Ku=i=>/^(SA3D_)?AREA/i.test(i);function Wx(i,t,e){const n=Math.max(e.mergeTol??bn,bn),s=e.scale,r={joints:0,frames:0,areas:0,duplicates:0,zeroLength:0,unmatchedLayers:[]};return i.commit("import DXF",o=>{e.replace&&(o.joints=[],o.frames=[],o.areas=[],o.jointLoads=[],o.jointDisplacements=[],o.framePointLoads=[],o.frameUniformLoads=[],o.areaLoads=[]);const a=new Map,l=x=>Math.floor(x/n),c=(x,y,E,D)=>{const N=`${l(y)},${l(E)},${l(D)}`,F=a.get(N);F?F.push({id:x,x:y,y:E,z:D}):a.set(N,[{id:x,x:y,y:E,z:D}])};for(const x of o.joints)c(x.id,x.x,x.y,x.z);let h=o.joints.reduce((x,y)=>Math.max(x,y.id),0)+1;const d=x=>{const y=at=>Math.round(at*s*1e9)/1e9,E=y(x[0]),D=y(x[1]),N=y(x[2]),F=l(E),W=l(D),O=l(N);let z=-1,V=1/0;for(let at=-1;at<=1;at++)for(let ht=-1;ht<=1;ht++)for(let At=-1;At<=1;At++)for(const Tt of a.get(`${F+at},${W+ht},${O+At}`)??[]){const q=Math.hypot(Tt.x-E,Tt.y-D,Tt.z-N);q<=n&&q<V&&(V=q,z=Tt.id)}if(z>=0)return z;const ot=h++;return o.joints.push({id:ot,x:E,y:D,z:N,r:[...ul]}),c(ot,E,D,N),r.joints++,ot},u=new Map(o.sections.map(x=>[Qo(x.name),x.name])),f=new Map(o.materials.map(x=>[Qo(x.name),x.name])),p=new Map,g=new Set,m=x=>{var E,D;let y=p.get(x);if(!y){y={section:((E=o.sections[0])==null?void 0:E.name)??"",material:((D=o.materials[0])==null?void 0:D.name)??""};let N=!1;for(const F of x.split("@").map(Qo)){const W=u.get(F),O=f.get(F);W&&(y.section=W),O&&(y.material=O),N||(N=!!(W||O))}N||g.add(x),p.set(x,y)}return y},v=(x,y)=>x<y?`${x}-${y}`:`${y}-${x}`,M=new Set(o.frames.map(x=>v(x.i,x.j)));let _=o.frames.reduce((x,y)=>Math.max(x,y.id),0)+1;const S=(x,y,E)=>{if(x===y)return void r.zeroLength++;const D=v(x,y);if(M.has(D))return void r.duplicates++;M.add(D);const N=m(E);o.frames.push({id:_++,i:x,j:y,material:N.material,section:N.section,beta:0}),r.frames++},P=x=>[...x].sort((y,E)=>y-E).join(","),A=new Set(o.areas.map(x=>P(x.joints)));let T=o.areas.reduce((x,y)=>Math.max(x,y.id),0)+1;const L=x=>{const y=x.map(d).filter((D,N,F)=>F.indexOf(D)===N);if(y.length<3)return void r.zeroLength++;const E=P(y);if(A.has(E))return void r.duplicates++;A.add(E),o.areas.push({id:T++,joints:y,distribution:"two-way"}),r.areas++};for(const x of t.entities)if(!(e.layers&&!e.layers.has(x.layer)))if(x.kind==="point")d(x.pts[0]);else if(x.kind==="face"||x.kind==="poly"&&x.closed&&Ku(x.layer))L(x.pts);else{const y=x.pts.map(d);for(let E=0;E+1<y.length;E++)S(y[E],y[E+1],x.layer);x.closed&&y.length>2&&S(y[y.length-1],y[0],x.layer)}r.unmatchedLayers=[...g].sort()}),r}function Qu(i){return i.trim().replace(/[\s<>/\\":;?*|=,`']+/g,"_")||"0"}const $x={P:4,V2:3,V3:3,T:6,M2:5,M3:5};function jx(i,t){const e=[],n=(v,M)=>e.push(String(v),typeof M=="number"?s(M):M),s=v=>{const M=Number(v.toPrecision(12));return Object.is(M,-0)?"0":String(M)},r=(v,M=0)=>{n(10+M,v[0]/t.kL),n(20+M,v[1]/t.kL),n(30+M,v[2]/t.kL)},o=new Map,a=[],l=(v,M)=>(o.has(v)||o.set(v,M),v),c=(v,M,_)=>a.push(()=>{n(0,"LINE"),n(8,v),r(M),r(_,1)}),h=(v,M,_)=>a.push(()=>{n(0,"POLYLINE"),n(8,v),n(66,1),r([0,0,0]),n(70,8|(_?1:0));for(const S of M)n(0,"VERTEX"),n(8,v),r(S),n(70,32);n(0,"SEQEND"),n(8,v)}),d=(v,M,_,S)=>a.push(()=>{n(0,"TEXT"),n(8,v),r(M),n(40,_/t.kL),n(1,S)}),u=new Map(i.joints.map(v=>[v.id,v])),f=v=>{const M=u.get(v);return[M.x,M.y,M.z]},p=l("SA3D_JOINTS",2);for(const v of i.joints)a.push(()=>{n(0,"POINT"),n(8,p),r([v.x,v.y,v.z])});for(const v of i.frames)!u.has(v.i)||!u.has(v.j)||c(l(Qu(`${v.section}@${v.material}`),7),f(v.i),f(v.j));const g=l("SA3D_AREAS",8);for(const v of i.areas){const M=v.joints.filter(_=>u.has(_)).map(f);M.length<3||(M.length<=4?a.push(()=>{n(0,"3DFACE"),n(8,g);for(let _=0;_<4;_++)r(M[Math.min(_,M.length-1)],_)}):h(g,M,!0))}const m=t.results;if(m){const v=new Map(i.frames.map(A=>[A.id,A])),M=(A,T)=>{const L=v.get(A.id);if(!L||!u.has(L.i))return null;const x=f(L.i),y=A.axes[0];return[x[0]+y[0]*A.x[T],x[1]+y[1]*A.x[T],x[2]+y[2]*A.x[T]]};if(t.deformScale!==void 0){const A=l("SA3D_RESULT_DEFORMED",1);for(const T of m.frames){const L=[];for(let x=0;x<T.x.length;x++){const y=M(T,x);if(!y)break;const E=T.disp[x],D=[y[0]+E[0]*t.deformScale,y[1]+E[1]*t.deformScale,y[2]+E[2]*t.deformScale],N=L[L.length-1];(!N||Math.hypot(D[0]-N[0],D[1]-N[1],D[2]-N[2])>1e-12)&&L.push(D)}L.length>=2&&h(A,L,!1)}}const _=t.diagramSize??1,S=t.textHeight??_*.15,P=t.label??(A=>String(Number(A.toPrecision(4))));for(const A of t.forceComps??[]){let T=0;for(const E of m.frames)for(const D of E[A])T=Math.max(T,Math.abs(D));if(T<1e-9)continue;const L=l(`SA3D_RESULT_${A}`,$x[A]),x=_/T,y=A==="P"||A==="V2"||A==="V3"?"F":"M";for(const E of m.frames){const[,D,N]=E.axes,F=A==="M3"?[-D[0],-D[1],-D[2]]:A==="M2"||A==="V3"?N:D,W=E[A],O=Tt=>{const q=M(E,Tt);return q&&[q[0]+F[0]*W[Tt]*x,q[1]+F[1]*W[Tt]*x,q[2]+F[2]*W[Tt]*x]},z=E.x.length-1,V=M(E,0),ot=M(E,z);if(!V||!ot)continue;const at=[];for(let Tt=0;Tt<=z;Tt++)at.push(O(Tt));c(L,V,at[0]),h(L,at,!1),c(L,ot,at[z]);const ht=new Set([0,z]);let At=0;for(let Tt=1;Tt<z;Tt++)Math.abs(W[Tt])>Math.abs(W[At])&&(At=Tt);Math.abs(W[At])>Math.max(Math.abs(W[0]),Math.abs(W[z]))*1.02&&ht.add(At);for(const Tt of ht)Math.abs(W[Tt])>=T*.01&&d(L,at[Tt],S,P(W[Tt],y))}}}n(0,"SECTION"),n(2,"HEADER"),n(9,"$ACADVER"),n(1,"AC1009"),n(9,"$INSUNITS"),n(70,Gx(t.kL)),n(0,"ENDSEC"),n(0,"SECTION"),n(2,"TABLES"),n(0,"TABLE"),n(2,"LTYPE"),n(70,1),n(0,"LTYPE"),n(2,"CONTINUOUS"),n(70,0),n(3,"Solid line"),n(72,65),n(73,0),n(40,0),n(0,"ENDTAB"),n(0,"TABLE"),n(2,"LAYER"),n(70,o.size);for(const[v,M]of o)n(0,"LAYER"),n(2,v),n(70,0),n(62,M),n(6,"CONTINUOUS");n(0,"ENDTAB"),n(0,"ENDSEC"),n(0,"SECTION"),n(2,"ENTITIES");for(const v of a)v();return n(0,"ENDSEC"),n(0,"EOF"),e.join(`\r
`)+`\r
`}const Tr=i=>i/1e3;function Cr(i,t){return{name:i,source:"builtin",entries:t.map(([e,n,s,r,o,a])=>({name:e,shape:"I",dims:[Tr(n),Tr(s),Tr(r),Tr(o)],mass:a}))}}const td=[Cr("EN IPE",[["IPE 100",100,55,5.7,4.1,8.1],["IPE 120",120,64,6.3,4.4,10.4],["IPE 140",140,73,6.9,4.7,12.9],["IPE 160",160,82,7.4,5,15.8],["IPE 180",180,91,8,5.3,18.8],["IPE 200",200,100,8.5,5.6,22.4],["IPE 220",220,110,9.2,5.9,26.2],["IPE 240",240,120,9.8,6.2,30.7],["IPE 270",270,135,10.2,6.6,36.1],["IPE 300",300,150,10.7,7.1,42.2],["IPE 330",330,160,11.5,7.5,49.1],["IPE 360",360,170,12.7,8,57.1],["IPE 400",400,180,13.5,8.6,66.3],["IPE 450",450,190,14.6,9.4,77.6],["IPE 500",500,200,16,10.2,90.7],["IPE 550",550,210,17.2,11.1,106],["IPE 600",600,220,19,12,122]]),Cr("EN HEA",[["HEA 100",96,100,8,5,16.7],["HEA 120",114,120,8,5,19.9],["HEA 140",133,140,8.5,5.5,24.7],["HEA 160",152,160,9,6,30.4],["HEA 180",171,180,9.5,6,35.5],["HEA 200",190,200,10,6.5,42.3],["HEA 220",210,220,11,7,50.5],["HEA 240",230,240,12,7.5,60.3],["HEA 260",250,260,12.5,7.5,68.2],["HEA 280",270,280,13,8,76.4],["HEA 300",290,300,14,8.5,88.3]]),Cr("EN HEB",[["HEB 100",100,100,10,6,20.4],["HEB 120",120,120,11,6.5,26.7],["HEB 140",140,140,12,7,33.7],["HEB 160",160,160,13,8,42.6],["HEB 180",180,180,14,8.5,51.2],["HEB 200",200,200,15,9,61.3],["HEB 220",220,220,16,9.5,71.5],["HEB 240",240,240,17,10,83.2],["HEB 260",260,260,17.5,10,93],["HEB 280",280,280,18,10.5,103],["HEB 300",300,300,19,11,117]]),Cr("WF (JIS / SNI)",[["WF 100x50x5x7",100,50,7,5,9.3],["WF 125x60x6x8",125,60,8,6,13.2],["WF 150x75x5x7",150,75,7,5,14],["WF 200x100x5.5x8",200,100,8,5.5,21.3],["WF 250x125x6x9",250,125,9,6,29.6],["WF 300x150x6.5x9",300,150,9,6.5,36.7],["WF 350x175x7x11",350,175,11,7,49.6],["WF 400x200x8x13",400,200,13,8,66],["WF 450x200x9x14",450,200,14,9,76],["WF 500x200x10x16",500,200,16,10,89.6],["WF 600x200x11x17",600,200,17,11,106]])],ed="structapp3d.catalogs",nd=()=>{try{return typeof localStorage>"u"?null:localStorage}catch{return null}};function ao(){var i;try{const t=(i=nd())==null?void 0:i.getItem(ed),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>n&&typeof n.name=="string"&&Array.isArray(n.entries)).map(n=>({...n,source:"user"})):[]}catch{return[]}}function id(i){const t=nd();if(!t)return!1;try{return t.setItem(ed,JSON.stringify(i)),!0}catch{return!1}}function Us(i=ao()){const t=new Set(i.map(e=>e.name.toLowerCase()));return[...i,...td.filter(e=>!t.has(e.name.toLowerCase()))]}function Xx(i){const t=new Set(i.map(s=>s.name.toLowerCase())),e=Date.now(),n=[...ao().filter(s=>!t.has(s.name.toLowerCase())),...i.map(s=>({...s,source:"user",imported:e}))];return id(n)}function qx(i){return id(ao().filter(t=>t.name!==i))}const Lh=i=>i.toLowerCase().replace(/\s+/g,"");function Yx(i,t=Us(),e=60){const n=i.toLowerCase().split(/\s+/).filter(Boolean),s=[];for(const r of t){const o=Lh(r.name);for(const a of r.entries){const l=Lh(a.name)+"|"+o;if(n.every(c=>l.includes(c))&&(s.push({catalog:r,entry:a}),s.length>=e))return s}}return s}function Jx(i,t,e=i.name){const n={name:e,shape:i.shape,dims:[...i.dims],catalog:t};return i.props&&i.shape!=="general"&&(n.props={...i.props}),i.mass&&(n.mass=i.mass),n}const al={mm:.001,cm:.01,m:1,in:.0254},Zx=1.48816394,Kx={i:"I",w:"I",wf:"I",iwf:"I",h:"I",hwf:"I",ipe:"I",ipn:"I",hea:"I",heb:"I",hem:"I",ub:"I",uc:"I",box:"box",shs:"box",rhs:"box",hss:"box",tube:"box",pipe:"pipe",chs:"pipe",unp:"unp",upn:"unp",u:"unp",channel:"unp",pfc:"unp",mc:"unp",c:"C",lipped:"C",lippedchannel:"C",clc:"C",cfs:"C",rect:"rect",rectangle:"rect",circle:"circle",round:"circle",bar:"circle",general:"general"};function Qx(i){return Kx[i.toLowerCase().replace(/[\s_-]+/g,"")]}const ll={I:["d","bf","tf","tw"],box:["d","bf","tf","tw"],unp:["d","bf","tf","tw"],rect:["d","bf"],circle:["d"],pipe:["d","t"],C:["d","bf","c","t"],general:["a","i33","i22","j"]},ty={b:"bf",t:"tw",kg:"mass","kg/m":"mass",weight:"mass","lb/ft":"mass"};function ey(i){for(const t of i.split(/\r?\n/)){const e=t.replace(/"[^"]*"/g,"");if(/\bname\b/i.test(e)&&/\bshape\b/i.test(e))return e.split(";").length>e.split(",").length?";":","}return Ul(i)}function ny(i,t){const e=ey(i),n=e===";",s=[],r=[],o=new Map;let a="",l="",c=null,h=1;return qu(i,e).forEach((d,u)=>{const f=u+1,p=d.map(O=>O.trim());for(;p.length&&p[p.length-1]==="";)p.pop();if(!p.length||p[0].startsWith("#"))return;const g=p.map(O=>O.toLowerCase());if(!c){const O=g.map(z=>z.replace(/\s*\(.*\)\s*$/,"").trim());if(O.includes("name")&&O.includes("shape"))c=O.map(z=>ty[z]??z),g.some(z=>z.includes("lb/ft"))&&(h=Zx);else if(O[0]==="units"){const z=(p[1]??"").toLowerCase().replace(/^inch(es)?$/,"in");z in al?a=z:s.push({line:f,msg:`unknown units "${p[1]??""}" (use mm, cm, m or in)`})}else O[0]==="catalog"&&p[1]&&(l=p[1]);return}const m=c,v=O=>{const z=m.indexOf(O);return z>=0?p[z]??"":""},M=v("name");if(!M)return void s.push({line:f,msg:"missing Name"});const _=`${M}: `;if(/[,;"]/.test(M))return void s.push({line:f,msg:_+"name cannot contain commas, semicolons or quotes"});const S=Qx(v("shape"));if(!S)return void s.push({line:f,msg:_+`unknown shape "${v("shape")}"`});let P="";const A=O=>{const z=v(O),V=Yu(z,n);return z!==""&&!Number.isFinite(V)&&!P&&(P=`"${z}" is not a number (${O})`),V},T=al[a||"mm"],L=[A("a")*T*T,A("i33")*T**4,A("i22")*T**4,A("j")*T**4],x=ll[S].map(O=>O==="t"?Number.isFinite(A("tw"))?A("tw"):A("tf"):A(O));if(P)return void s.push({line:f,msg:_+P});const y=ll[S].filter((O,z)=>!Number.isFinite(x[z]));if(y.length)return void s.push({line:f,msg:_+`missing ${y.join(", ")} for shape ${S}`});const E={name:M,shape:S,dims:S==="general"?L:x.map(O=>O*T)};if(S!=="general"){const O=L.filter(z=>Number.isFinite(z)).length;if(O){const z=Dl({shape:S,dims:E.dims}),V={A:L[0],I33:L[1],I22:L[2],J:L[3]};O<4&&(r.push({line:f,msg:_+"some of A, I33, I22, J are empty; they are computed from the dimensions"}),Number.isFinite(V.A)||(V.A=z.A),Number.isFinite(V.I33)||(V.I33=z.I33),Number.isFinite(V.I22)||(V.I22=z.I22),Number.isFinite(V.J)||(V.J=z.J)),z.A>0&&Math.abs(V.A/z.A-1)>.25&&r.push({line:f,msg:_+`published A differs from the dimensions by ${Math.round((V.A/z.A-1)*100)}% — check the units`}),E.props=V}}const D=Qa({shape:S,dims:E.dims,props:E.props});if(D)return void s.push({line:f,msg:_+D});const N=A("mass");N>0&&(E.mass=N*h);const F=v("catalog")||l||t;if(/[,;"]/.test(F))return void s.push({line:f,msg:_+"catalog name cannot contain commas, semicolons or quotes"});let W=o.get(F.toLowerCase());if(W||o.set(F.toLowerCase(),W={name:F,source:"user",entries:[]}),W.entries.some(O=>O.name.toLowerCase()===M.toLowerCase()))return void s.push({line:f,msg:_+`duplicate name in catalog "${F}", row skipped`});W.entries.push(E)}),c?a||r.push({line:0,msg:'no "Units" row; dimensions are read as mm'}):s.push({line:0,msg:'no header row found (it needs at least "Name" and "Shape" columns)'}),{catalogs:[...o.values()],errors:s,warnings:r,unit:a||"mm"}}const qi=i=>i===void 0||!Number.isFinite(i)?"":Number(i.toPrecision(10));function sd(i,t="mm",e="StructApp3D section catalog"){const n=al[t],s=[[e],["# Edit in Excel and save as CSV. One row per section. Dimensions in the Units below. A in unit^2 and I33 / I22 / J in unit^4."],["# Columns per shape: I / box / unp: d bf tf tw | rect: d bf | circle: d | pipe: d tw(wall) | C: d bf c(lip) tw(thickness) | general: A I33 I22 J only."],["# A, I33, I22, J are optional for other shapes: when filled in they replace the values computed from the dimensions."],["# Shapes: I, box, pipe, unp, C, rect, circle, general (also W, WF, H, IPE, HEA, HEB, SHS, RHS, HSS, CHS, UNP, PFC)."],["Units",t],["Catalog","Name","Shape","d","bf","tf","tw","c",`A (${t}2)`,`I33 (${t}4)`,`I22 (${t}4)`,`J (${t}4)`,"Mass (kg/m)"]];for(const r of i)for(const o of r.entries){const a=d=>qi(o.dims[d]!==void 0?o.dims[d]/n:void 0),l={d:"",bf:"",tf:"",tw:"",c:""},c=ll[o.shape];o.shape!=="general"&&c.forEach((d,u)=>l[d==="t"?"tw":d]=a(u));const h=o.shape==="general"?{A:o.dims[0],I33:o.dims[1],I22:o.dims[2],J:o.dims[3]}:o.props;s.push([r.name,o.name,o.shape,l.d,l.bf,l.tf,l.tw,l.c,qi(h?h.A/n**2:void 0),qi(h?h.I33/n**4:void 0),qi(h?h.I22/n**4:void 0),qi(h?h.J/n**4:void 0),qi(o.mass)])}return s.map(r=>r.map(o=>Xu(o)).join(",")).join(`\r
`)+`\r
`}function iy(){const i=n=>n/1e3,t=[i(300),i(150),i(9),i(6.5)],e=[{name:"WF 300x150x6.5x9",shape:"I",dims:t,props:{A:.004678,I33:721e-7,I22:508e-8,J:Dl({shape:"I",dims:t}).J},mass:36.7},{name:"SHS 100x100x4",shape:"box",dims:[i(100),i(100),i(4),i(4)]},{name:"CHS 168.3x7.1",shape:"pipe",dims:[i(168.3),i(7.1)]},{name:"UNP 200",shape:"unp",dims:[i(200),i(75),i(11.5),i(8.5)]},{name:"C 150x65x20x2.3",shape:"C",dims:[i(150),i(65),i(20),i(2.3)]},{name:"R 300x500",shape:"rect",dims:[i(500),i(300)]},{name:"D 400",shape:"circle",dims:[i(400)]},{name:"My general",shape:"general",dims:[.01,1e-4,1e-5,1e-6]}];return sd([{name:"My catalog",source:"user",entries:e}],"mm")}const sy="http://www.w3.org/2000/svg",Ss=360,mi=96,Rr=14,Lr=14;function De(i,t){const e=document.createElementNS(sy,i);for(const[n,s]of Object.entries(t))e.setAttribute(n,String(s));return e}let Ke=null,rd="major",od=!1;const Yi=(i,t,e)=>({title:i,ys:t,conv:n=>jt(n,e),unit:Yt(e)});function ry(i,t,e){const n=Ve(),s=(r,o)=>({title:`Deflection ${o}${e?" (relative to chord)":""}`,ys:Cx(i,r,e),conv:a=>Qe(a/n.kSmall),unit:n.small});return t==="axial"?[Yi("Axial force P",i.P,"F"),Yi("Torsion T",i.T,"M")]:t==="major"?[Yi("Shear V2",i.V2,"F"),{...Yi("Moment M3",i.M3,"M"),reversed:!0},s(1,"δ2 (local 2)")]:[Yi("Shear V3",i.V3,"F"),{...Yi("Moment M2",i.M2,"M"),reversed:!0},s(2,"δ3 (local 3)")]}function oy(i,t,e){const n=i.x,s=i.L||1;let r=Math.min(0,...t.ys),o=Math.max(0,...t.ys);o-r<1e-12&&(r=-1,o=1);const a=E=>Rr+(Ss-2*Rr)*E/s,l=E=>t.reversed?Lr+(mi-2*Lr)*(E-r)/(o-r):Lr+(mi-2*Lr)*(o-E)/(o-r),c=De("svg",{viewBox:`0 0 ${Ss} ${mi}`,class:"fd-svg",preserveAspectRatio:"none"}),h="fdg_"+Math.random().toString(36).slice(2,9),d=l(0),u=Math.min(Math.max(d/mi*100,0),100).toFixed(2),f=t.reversed?"var(--neg)":"var(--pos)",p=t.reversed?"var(--pos)":"var(--neg)",g=De("defs",{}),m=De("linearGradient",{id:`${h}_f`,gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:mi});m.append(De("stop",{offset:"0%","stop-color":f,"stop-opacity":.35}),De("stop",{offset:`${u}%`,"stop-color":f,"stop-opacity":.35}),De("stop",{offset:`${u}%`,"stop-color":p,"stop-opacity":.35}),De("stop",{offset:"100%","stop-color":p,"stop-opacity":.35}));const v=De("linearGradient",{id:`${h}_l`,gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:mi});v.append(De("stop",{offset:"0%","stop-color":f,"stop-opacity":1}),De("stop",{offset:`${u}%`,"stop-color":f,"stop-opacity":1}),De("stop",{offset:`${u}%`,"stop-color":p,"stop-opacity":1}),De("stop",{offset:"100%","stop-color":p,"stop-opacity":1})),g.append(m,v),c.append(g);const M=n.map((E,D)=>`${a(E).toFixed(2)},${l(t.ys[D]).toFixed(2)}`);c.append(De("polygon",{points:`${a(0)},${l(0)} ${M.join(" ")} ${a(s)},${l(0)}`,class:"fd-fill",fill:`url(#${h}_f)`}),De("line",{x1:a(0),y1:l(0),x2:a(s),y2:l(0),class:"fd-axis"}),De("polyline",{points:M.join(" "),class:"fd-line",stroke:`url(#${h}_l)`}));let _=0,S=0;t.ys.forEach((E,D)=>{E>t.ys[_]&&(_=D),E<t.ys[S]&&(S=D)});const P=(E,D)=>{if(Math.abs(t.ys[E])<1e-12)return;const N=Math.min(Math.max(a(n[E]),30),Ss-30),F=De("text",{x:N,y:l(t.ys[E])+(D?-3:11),class:"fd-val","text-anchor":"middle"});F.textContent=t.conv(t.ys[E]),c.append(F)};P(_,!t.reversed),S!==_&&P(S,!!t.reversed);const A=De("line",{x1:0,y1:2,x2:0,y2:mi-2,class:"fd-cursor",visibility:"hidden"});c.append(A);const T=E=>{const D=c.getBoundingClientRect(),N=(E.clientX-D.left)/D.width*Ss;e(Math.min(Math.max((N-Rr)/(Ss-2*Rr)*s,0),s))};c.addEventListener("pointerdown",E=>{E.preventDefault(),c.setPointerCapture(E.pointerId),T(E);const D=F=>T(F),N=()=>{c.removeEventListener("pointermove",D),c.removeEventListener("pointerup",N),c.removeEventListener("pointercancel",N)};c.addEventListener("pointermove",D),c.addEventListener("pointerup",N),c.addEventListener("pointercancel",N)});const L=C("span",{class:"fd-readout"}),x=E=>{let D="",N="";if(E===null)A.setAttribute("visibility","hidden");else{A.setAttribute("x1",String(a(E))),A.setAttribute("x2",String(a(E))),A.removeAttribute("visibility");const F=ju(n,t.ys,E),W=Math.abs(F.left)>=Math.abs(F.right)?F.left:F.right;Math.abs(W)>1e-12&&(N=W>0?"var(--pos)":"var(--neg)"),D=Math.abs(F.left-F.right)>1e-9*Math.max(1,Math.abs(F.left),Math.abs(F.right))?`${t.conv(F.left)} / ${t.conv(F.right)} ${t.unit} (left / right)`:`${t.conv(F.left)} ${t.unit}`}L.textContent=D,L.style.color=N};return{el:C("div",{class:"fd-plot"},C("div",{class:"fd-plot-head"},C("span",{class:"fd-plot-title"},`${t.title} [${t.unit}]`),L),c),setCursor:x}}function es(){var h;if(!Ke)return;const i=Ke,t=i.app.resultSet;if(!t)return Kr();t.results[i.caseName]||(i.caseName=i.app.resultName);const e=(h=t.results[i.caseName])==null?void 0:h.frames.find(d=>d.id===i.frameId);if(!e)return Kr();i.cursor!==null&&(i.cursor=Math.min(i.cursor,e.L));const n=C("select",{class:"fd-case","aria-label":"Load case or combination"},...t.items.map(d=>C("option",{value:d.name},`${d.kind==="combo"?"Combo":"Case"}: ${d.name}`)));n.value=i.caseName,n.addEventListener("change",()=>{i.caseName=n.value,es()});const s=C("select",{class:"fd-view","aria-label":"Diagram"},C("option",{value:"axial"},"Axial P & torsion T"),C("option",{value:"major"},"Major: V2, M3, deflection"),C("option",{value:"minor"},"Minor: V3, M2, deflection"));s.value=i.view,s.addEventListener("change",()=>{i.view=rd=s.value,es()});const r=C("div",{class:"fd-controls"},n,s);if(i.view!=="axial"){const d=C("select",{class:"fd-rel","aria-label":"Deflection reference"},C("option",{value:"abs"},"Absolute deflection"),C("option",{value:"rel"},"Relative to chord"));d.value=i.relative?"rel":"abs",d.addEventListener("change",()=>{i.relative=od=d.value==="rel",es()}),r.append(d)}const o=C("div",{class:"fd-pos muted small"}),a=()=>{o.textContent=i.cursor===null?"Tap or drag on a diagram to read values.":`x = ${jt(i.cursor,"L")} ${Yt("L")} from joint i (L = ${jt(e.L,"L")} ${Yt("L")})`;for(const d of c)d.setCursor(i.cursor)},l=d=>{i.cursor=d,a()},c=ry(e,i.view,i.relative).map(d=>oy(e,d,l));a(),i.body.replaceChildren(r,o,...c.map(d=>d.el)),i.el.querySelector(".fd-title").textContent=`Frame ${i.frameId} diagrams`}function ay(i,t){t.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;e.preventDefault();const n=i.getBoundingClientRect(),s=e.clientX-n.left,r=e.clientY-n.top;t.setPointerCapture(e.pointerId);const o=l=>{const c=Math.min(Math.max(l.clientX-s,0),window.innerWidth-60),h=Math.min(Math.max(l.clientY-r,0),window.innerHeight-40);i.style.left=`${c}px`,i.style.top=`${h}px`,i.style.right="auto",i.style.bottom="auto"},a=()=>{t.removeEventListener("pointermove",o),t.removeEventListener("pointerup",a),t.removeEventListener("pointercancel",a)};t.addEventListener("pointermove",o),t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a)})}function cl(i,t){if(!i.resultSet)return;if(Ke){Ke.frameId=t,Ke.cursor=null,Ke.caseName=i.resultName,es();return}const e=C("div",{class:"fd-body"}),n=C("button",{class:"fd-close","aria-label":"Close diagrams",title:"Close"},"✕"),s=C("div",{class:"fd-head"},C("span",{class:"fd-title"}),n),r=C("div",{class:"frame-diagrams",role:"dialog","aria-label":"Frame diagrams"},s,e);for(const o of["contextmenu","selectstart","dragstart"])r.addEventListener(o,a=>a.preventDefault());r.addEventListener("pointerdown",o=>o.stopPropagation()),r.addEventListener("wheel",o=>o.stopPropagation()),n.addEventListener("click",()=>Kr()),ay(r,s),document.body.append(r),Ke={app:i,frameId:t,caseName:i.resultName,view:rd,relative:od,cursor:null,el:r,body:e},es()}function Kr(){Ke==null||Ke.el.remove(),Ke=null}function Ph(i){Ke&&(Ke.app=i,es())}const ly=(i,t)=>i.every((e,n)=>e===t[n]),Fl=i=>i.some(Boolean)?sn.filter((t,e)=>i[e]).join(" "):"Free";function Ws(i,t,e){return i?/[,;"\r\n]/.test(i)?`${e} name cannot contain commas, semicolons or quotes`:t.includes(i)?`${e} "${i}" already exists`:null:`${e} name is required`}const de=i=>(kt(i,"error"),!1);function cy(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(_e(["Name",`E (${Yt("FA")})`,"ν",`γ (${Yt("FV")})`,"Used by",""],t.data.materials.map(o=>{const a=t.data.frames.filter(l=>l.material===o.name).length;return[o.name,jt(o.E,"FA",5),String(o.nu),jt(o.gamma,"FV",5),a?`${a} frame(s)`:"–",C("span",{class:"row-btns"},Lt("Edit",()=>r(o)),Lt("Delete",()=>s(o),"small danger"))]})),C("div",{class:"dlg-actions"},Lt("+ Add material",()=>r(null),"primary")))},s=async o=>{const a=t.data.frames.filter(l=>l.material===o.name).length;if(a)return void un("Cannot delete",`Material "${o.name}" is assigned to ${a} frame(s). Assign another material to them first.`);await Ci("Delete material",`Delete material "${o.name}"?`,"Delete",!0)&&(t.commit("delete material",l=>{l.materials=l.materials.filter(c=>c.name!==o.name)}),n())},r=o=>{const a=Hs("Name",(o==null?void 0:o.name)??`MAT${t.data.materials.length+1}`),l=ne("Elastic modulus E",(o==null?void 0:o.E)??2e8,{q:"FA",positive:!0}),c=ne("Poisson's ratio ν",(o==null?void 0:o.nu)??.3,{min:0,max:.4999}),h=ne("Unit weight γ",(o==null?void 0:o.gamma)??78.5,{q:"FV",min:0}),d=C("div",{class:"chips"},C("span",{class:"muted"},"Presets: "),Lt("Steel",()=>(l.set(2e8),c.set(.3),h.set(76.98))),Lt("Concrete C30",()=>(l.set(25743e3),c.set(.2),h.set(23.56))),Lt("Aluminium",()=>(l.set(7e7),c.set(.33),h.set(26.6))),Lt("Timber",()=>(l.set(11e6),c.set(.3),h.set(5))));te({title:o?`Edit material ${o.name}`:"Add material",body:C("div",{class:"form"},a.row,l.row,c.row,h.row,d),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const u=a.get(),f=Ws(u,t.data.materials.filter(g=>g!==o).map(g=>g.name),"Material"),p=[l.get(),c.get(),h.get()];if(f)return de(f);if(p.some(g=>!Number.isFinite(g)))return de("Fix the highlighted fields");t.commit(o?"edit material":"add material",g=>{const m={name:u,E:p[0],nu:p[1],gamma:p[2]};if(o){const v=o.name,M=g.materials.findIndex(_=>_.name===v);if(g.materials[M]=m,v!==u)for(const _ of g.frames)_.material===v&&(_.material=u)}else g.materials.push(m)}),n()}}]})};n(),te({title:"Define materials",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function hy(i){const t="http://www.w3.org/2000/svg",e=document.createElementNS(t,"svg");e.setAttribute("viewBox","-60 -60 120 120"),e.setAttribute("class","sketch");const n=Ai(i),s=i.dims,o=80/Math.max(n.depth,n.width,1e-9),a=(h,d)=>{const u=document.createElementNS(t,h);for(const[f,p]of Object.entries(d))u.setAttribute(f,String(p));return e.append(u),u},l={class:"sk-shape","fill-rule":"evenodd"},c=(h,d,u=0,f=0)=>`M${u-h/2},${f-d/2}h${h}v${d}h${-h}z`;switch(i.shape){case"rect":a("path",{...l,d:c(s[1]*o,s[0]*o)});break;case"circle":a("circle",{...l,r:s[0]/2*o});break;case"pipe":{const h=s[0]/2*o,d=Math.max(h-s[1]*o,0);a("path",{...l,d:`M${-h},0a${h},${h} 0 1,0 ${2*h},0a${h},${h} 0 1,0 ${-2*h},0zM${-d},0a${d},${d} 0 1,0 ${2*d},0a${d},${d} 0 1,0 ${-2*d},0z`});break}case"I":{const[h,d,u,f]=s.map(p=>p*o);a("path",{...l,d:c(d,u,0,-h/2+u/2)+c(d,u,0,h/2-u/2)+c(f,h-2*u)});break}case"box":{const[h,d,u,f]=s.map(p=>p*o);a("path",{...l,d:c(d,h)+c(Math.max(d-2*f,0),Math.max(h-2*u,0))});break}case"unp":case"C":{const h=Fu(i);a("path",{...l,d:"M"+h.map(([d,u])=>`${d*o},${-u*o}`).join("L")+"z"});break}case"general":a("text",{x:0,y:4,"text-anchor":"middle",class:"sk-text"}).textContent="General";break}return a("line",{x1:0,y1:0,x2:0,y2:-52,class:"sk-axis"}),a("line",{x1:0,y1:0,x2:-52,y2:0,class:"sk-axis"}),a("text",{x:4,y:-48,class:"sk-text"}).textContent="2",a("text",{x:-54,y:-4,class:"sk-text"}).textContent="3",e}function uy(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(_e(["Name","Shape",`Dimensions (${Yt("L")})`,`A (${Yt("A")})`,`I33 (${Yt("L4")})`,"Used by",""],t.data.sections.map(o=>{const a=Ai(o),l=t.data.frames.filter(c=>c.section===o.name).length;return[o.name,Ds[o.shape]+(o.catalog?` (${o.catalog})`:""),o.dims.map((c,h)=>jt(c,jr(o.shape,h),4)).join(" × "),jt(a.A,"A",4),jt(a.I33,"L4",4),l?`${l} frame(s)`:"–",C("span",{class:"row-btns"},Lt("Edit",()=>r(o)),Lt("Delete",()=>s(o),"small danger"))]})),C("div",{class:"dlg-actions"},Lt("+ Add section",()=>r(null),"primary"),Lt("Section catalogs…",()=>ad())))},s=async o=>{const a=t.data.frames.filter(l=>l.section===o.name).length;if(a)return void un("Cannot delete",`Section "${o.name}" is assigned to ${a} frame(s). Assign another section to them first.`);await Ci("Delete section",`Delete section "${o.name}"?`,"Delete",!0)&&(t.commit("delete section",l=>{l.sections=l.sections.filter(c=>c.name!==o.name)}),n())},r=o=>{const a=Hs("Name",(o==null?void 0:o.name)??`SEC${t.data.sections.length+1}`),l=Object.keys(Ds),c=He("Shape",l.map(y=>[y,Ds[y]]),(o==null?void 0:o.shape)??"rect"),h=C("div",{class:"form"}),d=C("div",{class:"props"}),u=C("div",{class:"sketch-box"});let f=[];const p={rect:[.5,.3],circle:[.4],pipe:[.1683,.0071],I:[.3,.15,.009,.0065],box:[.2,.2,.008,.008],unp:[.2,.075,.0115,.0085],C:[.15,.065,.02,.0023],general:[.01,1e-4,1e-5,1e-6]};let g=o?{catalog:o.catalog,props:o.props,mass:o.mass}:{};const m=()=>{const y={name:a.get(),shape:c.get(),dims:f.map(E=>E.get())};return g.catalog&&(y.catalog=g.catalog),g.props&&y.shape!=="general"&&(y.props={...g.props}),g.mass&&(y.mass=g.mass),y},v=C("div",{class:"muted small"}),M=()=>{if(!g.catalog&&!g.props)return void v.replaceChildren();const y=g.props?"published A, I33, I22, J used":"properties computed from the dimensions",E=g.mass?` · ${Qe(g.mass,4)} kg/m`:"";v.replaceChildren(`Catalog: ${g.catalog??"–"} — ${y}${E} `,Lt("Unlink",()=>{g={},M(),S()}))},_=()=>{!g.catalog&&!g.props&&!g.mass||(g={},M())},S=()=>{const y=m(),E=y.dims.some(N=>!Number.isFinite(N))?"Enter all dimensions":Qa(y);if(u.replaceChildren(E?C("div",{class:"field-err"},E):hy(y)),E)return void d.replaceChildren();const D=Ai(y);d.replaceChildren(_e([`A (${Yt("A")})`,`I33 (${Yt("L4")})`,`I22 (${Yt("L4")})`,`J (${Yt("L4")})`,`As2 (${Yt("A")})`,`As3 (${Yt("A")})`],[[jt(D.A,"A"),jt(D.I33,"L4"),jt(D.I22,"L4"),jt(D.J,"L4"),jt(D.As2,"A"),jt(D.As3,"A")]]))},P=y=>{const E=c.get();f=Iu[E].map((D,N)=>ne(D,y[N],{q:jr(E,N),positive:!0})),h.replaceChildren(...f.map(D=>D.row));for(const D of f)D.input.addEventListener("input",()=>{_(),S()});S()};c.input.addEventListener("change",()=>{_(),P(p[c.get()])}),P(o?o.dims:p[c.get()]),M();const A=C("input",{type:"search",placeholder:"Search catalog, e.g. IPE 200, WF 300, HEA",autocomplete:"off",spellcheck:"false"}),T=C("div",{class:"cat-results"}),L=(y,E)=>{const D=Jx(E,y.name),N=t.data.sections.some(F=>F!==o&&F.name===D.name);N||a.set(D.name),c.set(D.shape),g={catalog:D.catalog,props:D.props,mass:D.mass},P(D.dims),M(),A.value="",T.replaceChildren(),N&&kt(`Section "${D.name}" already exists; enter another name`,"warn")};A.addEventListener("input",()=>{const y=A.value.trim();if(!y)return void T.replaceChildren();const E=Yx(y,Us(),40);T.replaceChildren(...E.length?E.map(({catalog:D,entry:N})=>C("button",{class:"btn small cat-hit",type:"button",onclick:()=>L(D,N)},N.name,C("span",{class:"muted"}," · "+D.name))):[C("div",{class:"muted small"},"No match. Import your own table under Define → Section catalogs….")])});const x=C("label",{class:"field"},C("span",{class:"field-label"},"From catalog"),C("span",{class:"field-input"},A));te({title:o?`Edit section ${o.name}`:"Add frame section",wide:!0,body:C("div",{class:"two-col"},C("div",{class:"form"},x,T,v,a.row,c.row,h),C("div",null,u,d,C("p",{class:"muted small"},"Local axis 2 is the section depth direction (up for horizontal members); local 3 is the width direction."))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const y=m(),E=Ws(y.name,t.data.sections.filter(D=>D!==o).map(D=>D.name),"Section")??(y.dims.some(D=>!Number.isFinite(D))?"Enter all dimensions":Qa(y));if(E)return de(E);t.commit(o?"edit section":"add section",D=>{if(o){const N=o.name;if(D.sections[D.sections.findIndex(F=>F.name===N)]=y,N!==y.name)for(const F of D.frames)F.section===N&&(F.section=y.name)}else D.sections.push(y)}),n()}}]})};n(),te({title:"Define frame sections",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}const dy=()=>/(^|-)(in|ft)$/.test(Ve().id)?"in":"mm",fy=i=>i.replace(/[\\/:*?"<>|]+/g,"_").trim()||"catalog";function ad(){const i=C("div"),t=async(r,o)=>{try{const a=await Zr(sd(r,dy()),o,null,"csv");a&&kt(`Saved ${a.name}`,"ok")}catch(a){un("Export failed",String(a))}},e=()=>{const r=ao(),o=new Set(td.map(a=>a.name.toLowerCase()));i.replaceChildren(C("p",{class:"muted small"},"Catalogs are tables of sections you can pick from in Define → Frame sections. Export one to see the format, edit or extend it in Excel (save as CSV), then import it. Imported catalogs are kept in this browser; models remain self-contained because each section stores its own values."),_e(["Catalog","Source","Sections",""],Us(r).map(a=>{const l=a.source==="user"&&o.has(a.name.toLowerCase()),c=a.source==="builtin"?"Built-in":`Imported${a.imported?" "+new Date(a.imported).toLocaleDateString():""}${l?" (replaces built-in)":""}`;return[a.name,c,String(a.entries.length),C("span",{class:"row-btns"},Lt("Export",()=>t([a],fy(a.name)+".csv")),a.source==="user"?Lt(l?"Restore built-in":"Delete",()=>n(a),"small danger"):"")]})),C("div",{class:"dlg-actions"},Lt("Import CSV…",()=>s(),"primary"),Lt("Download template",()=>Zr(iy(),"section-catalog-template.csv",null,"csv")),Lt("Export all",()=>t(Us(),"section-catalogs.csv"))))},n=async r=>{await Ci("Delete catalog",`Delete imported catalog "${r.name}" (${r.entries.length} sections) from this browser? Sections already in models are not affected.`,"Delete",!0)&&(qx(r.name)||kt("Could not update browser storage","error"),e())},s=async()=>{const r=await ol("csv");if(!r)return;const o=ny(r.text,r.name.replace(/\.[^.]*$/,"")||"Imported"),a=new Set(Us().map(d=>d.name.toLowerCase())),l=o.catalogs.reduce((d,u)=>d+u.entries.length,0),c=d=>C("li",null,(d.line?`Line ${d.line}: `:"")+d.msg),h=C("div",{class:"form"},C("p",null,`${r.name} — units ${o.unit}, ${l} valid section(s).`),o.catalogs.length?_e(["Catalog","Sections",""],o.catalogs.map(d=>[d.name,String(d.entries.length),a.has(d.name.toLowerCase())?"replaces existing":"new"])):"",o.errors.length?C("div",null,C("strong",null,`${o.errors.length} row(s) skipped:`),C("ul",{class:"issues err"},...o.errors.slice(0,100).map(c))):"",o.warnings.length?C("div",null,C("strong",null,`${o.warnings.length} warning(s):`),C("ul",{class:"issues"},...o.warnings.slice(0,100).map(c))):"");te({title:"Import section catalog",wide:!0,body:h,buttons:[{label:"Cancel"},{label:l?`Import ${l} section(s)`:"Nothing to import",kind:"primary",action:()=>{if(l){if(!Xx(o.catalogs))return de("Could not save to browser storage (full or disabled)");kt(`Imported ${l} section(s)`,"ok"),e()}}}]})};e(),te({title:"Section catalogs",body:i,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function ld(i){const t=sn.map((n,s)=>oo(n,i[s]));return{el:C("div",{class:"restraints"},C("div",{class:"muted small"},"Translations"),C("div",{class:"chk-row"},...t.slice(0,3).map(n=>n.row)),C("div",{class:"muted small"},"Rotations"),C("div",{class:"chk-row"},...t.slice(3).map(n=>n.row))),checks:t,get:()=>t.map(n=>n.get()),set:n=>t.forEach((s,r)=>s.set(n[r]))}}function Dh(i,t){const e=i?[...i]:[!1,!1,!1,!1,!1,!1],n=Gh.map((r,o)=>oo(r,e[o]));return{el:C("div",{class:"releases-group"},t?C("div",{class:"muted small"},t):null,C("div",{class:"chk-row"},...n.map(r=>r.row))),checks:n,get:()=>{const r=n.map(o=>o.get());return r.some(Boolean)?r:void 0},set:r=>{const o=r??[!1,!1,!1,!1,!1,!1];n.forEach((a,l)=>a.set(o[l]))}}}function py(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(_e(["Name","Restrained DOF",""],t.data.supportTypes.map(o=>[o.name,Fl(o.r),C("span",{class:"row-btns"},Lt("Edit",()=>r(o)),Lt("Delete",()=>s(o),"small danger"))])),C("div",{class:"dlg-actions"},Lt("+ Add support type",()=>r(null),"primary")),C("p",{class:"muted small"},"Support types are presets. Assign them to joints with Assign → Joint supports."))},s=o=>{t.commit("delete support type",a=>{a.supportTypes=a.supportTypes.filter(l=>l.name!==o.name)}),n()},r=o=>{const a=Hs("Name",(o==null?void 0:o.name)??`Support${t.data.supportTypes.length+1}`),l=ld((o==null?void 0:o.r)??[!0,!0,!0,!1,!1,!1]);te({title:o?`Edit support ${o.name}`:"Add support type",body:C("div",{class:"form"},a.row,l.el),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=a.get(),h=Ws(c,t.data.supportTypes.filter(d=>d!==o).map(d=>d.name),"Support");if(h)return de(h);t.commit("edit support type",d=>{const u={name:c,r:l.get()};o?d.supportTypes[d.supportTypes.findIndex(f=>f.name===o.name)]=u:d.supportTypes.push(u)}),n()}}]})};n(),te({title:"Define support types",body:e,buttons:[{label:"Close",kind:"primary"}]})}function Ih(i){const t=i.model.data.settings,e=ne("Grid spacing",t.gridSpacing,{q:"L",positive:!0}),n=ne("Grid lines each side",t.gridLines,{min:1,max:200}),s=He("Work plane",[["XY","XY (plan, horizontal)"],["XZ","XZ (elevation)"],["YZ","YZ (elevation)"]],t.workPlane),r=ne("Plane offset (Z for XY, Y for XZ, X for YZ)",t.elevation,{q:"L"});te({title:"Grid & work plane",body:C("div",{class:"form"},e.row,n.row,s.row,r.row,C("p",{class:"muted small"},"New joints snap to this grid on the work plane. Tap an existing joint to snap to it instead.")),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const o=[e.get(),n.get(),r.get()];if(o.some(a=>!Number.isFinite(a)))return de("Fix the highlighted fields");i.model.commit("grid",a=>{a.settings.gridSpacing=o[0],a.settings.gridLines=Math.round(o[1]),a.settings.workPlane=s.get(),a.settings.elevation=o[2]})}}]})}function _n(i,t){const e=i.selected()[t];return e.length?e:(kt(`Select one or more ${t} first`,"warn"),null)}function ta(i,t){const e=_n(i,"frames");if(!e)return;const n=i.model.data,s=n.frames.filter(a=>e.includes(a.id)),r=a=>s.every(l=>a(l)===a(s[0]))?a(s[0]):null;let o;if(t==="material"){if(!n.materials.length)return void kt("Define a material first","warn");o=He("Material",n.materials.map(a=>[a.name,a.name]),r(a=>a.material)??n.materials[0].name)}else if(t==="section"){if(!n.sections.length)return void kt("Define a section first","warn");o=He("Section",n.sections.map(a=>[a.name,`${a.name} (${Ds[a.shape]})`]),r(a=>a.section)??n.sections[0].name)}else o=ne("Local axis angle β",r(a=>a.beta),{unit:"°",mixed:!0});te({title:`Assign ${t==="beta"?"local axis angle":t} to ${e.length} frame(s)`,body:C("div",{class:"form"},o.row,t==="beta"?C("p",{class:"muted small"},"β rotates the section (local axes 2 and 3) about the member axis 1."):null),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const a=o.get();if(typeof a=="number"&&!Number.isFinite(a))return de("Enter an angle");i.model.commit("assign "+t,l=>{for(const c of l.frames)e.includes(c.id)&&(c[t]=a)}),kt(`Assigned to ${e.length} frame(s)`,"ok")}}]})}function my(i){const t=_n(i,"frames");if(!t)return;const n=i.model.data.frames.find(l=>l.id===t[0]),s=Dh(n.relI,"End I releases (Joint I)"),r=Dh(n.relJ,"End J releases (Joint J)"),o=(l,c)=>{s.set(l),r.set(c)},a=C("div",{class:"chips"},Lt("Rigid - Rigid (Continuous)",()=>o(void 0,void 0)),Lt("Pin - Pin (Truss)",()=>o(xd,yd)),Lt("Pin - Rigid (Hinge at I)",()=>o([!1,!1,!1,!1,!0,!0],void 0)),Lt("Rigid - Pin (Hinge at J)",()=>o(void 0,[!1,!1,!1,!1,!0,!0])));te({title:`Assign end releases to ${t.length} frame(s)`,body:C("div",{class:"form"},C("div",{class:"muted small"},"Presets"),a,s.el,r.el,C("p",{class:"muted small"},"Checked DOFs are released (zero moment / shear / axial / torsion). P, V2, V3 and T cannot be released at both ends. Truss preset releases T at End I only.")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const l=s.get(),c=r.get(),h=hl(l,c);if(h)return de(h);i.model.commit("assign releases",d=>{for(const u of d.frames)t.includes(u.id)&&(l?u.relI=[...l]:delete u.relI,c?u.relJ=[...c]:delete u.relJ)}),kt(`Assigned releases to ${t.length} frame(s)`,"ok")}}]})}function gy(i){const t=_n(i,"joints");if(!t)return;const e=i.model.data,n=e.joints.find(o=>o.id===t[0]),s=ld(n.r),r=C("div",{class:"chips"},...e.supportTypes.map(o=>Lt(o.name,()=>s.set(o.r))));te({title:`Assign supports to ${t.length} joint(s)`,body:C("div",{class:"form"},C("div",{class:"muted small"},"Support type"),r,s.el),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const o=s.get();i.model.commit("assign supports",l=>{for(const c of l.joints)t.includes(c.id)&&(c.r=[...o])});const a=e.supportTypes.find(l=>ly(l.r,o));kt(`${a?a.name:Fl(o)} assigned to ${t.length} joint(s)`,"ok")}}]})}const vy=i=>i&&i.some(t=>t>0)?Qr.map((t,e)=>i[e]>0?`${t} ${jt(i[e],e<3?"FL":"MR")}`:"").filter(Boolean).join(", "):"None";function _y(i){const t=_n(i,"joints");if(!t)return;const n=i.model.data.joints.filter(o=>t.includes(o.id)),s=o=>n.every(a=>{var l,c;return(((l=a.k)==null?void 0:l[o])??0)===(((c=n[0].k)==null?void 0:c[o])??0)}),r=Qr.map((o,a)=>{var l;return ne(o,s(a)?((l=n[0].k)==null?void 0:l[a])??0:null,{q:a<3?"FL":"MR",min:0,mixed:!s(a)})});te({title:`Joint springs on ${t.length} joint(s)`,body:C("div",{class:"form"},C("p",{class:"muted small"},"Elastic supports along / about the global axes (0 = no spring). A spring on a DOF that is also restrained is ignored."),C("div",{class:"muted small"},"Translational"),C("div",{class:"grid2"},...r.slice(0,3).map(o=>o.row)),C("div",{class:"muted small"},"Rotational"),C("div",{class:"grid2"},...r.slice(3).map(o=>o.row))),buttons:[{label:"Cancel"},{label:"Clear",kind:"danger",action:()=>{i.model.commit("clear springs",o=>{for(const a of o.joints)t.includes(a.id)&&delete a.k}),kt(`Springs cleared on ${t.length} joint(s)`,"ok")}},{label:"Assign",kind:"primary",action:()=>{const o=r.map(a=>a.input.value.trim()===""?null:a.get());if(o.some(a=>a!==null&&!(Number.isFinite(a)&&a>=0)))return de("Fix the highlighted fields");i.model.commit("assign springs",a=>{for(const l of a.joints){if(!t.includes(l.id))continue;const c=o.map((h,d)=>{var u;return h===null?((u=l.k)==null?void 0:u[d])??0:h});c.some(h=>h>0)?l.k=c:delete l.k}}),kt(`Springs assigned to ${t.length} joint(s)`,"ok")}}]})}function xy(i){var n;const t=_n(i,"areas");if(!t)return;const e=He("Load distribution",[["two-way","Two-way (to all edges, tributary)"],["one-way","One-way (to the two longer edges)"]],((n=i.model.area(t[0]))==null?void 0:n.distribution)??"two-way");te({title:`Area load distribution (${t.length} area(s))`,body:C("div",{class:"form"},e.row,C("p",{class:"muted small"},"Areas have no stiffness; their loads are transferred to the frames along their edges (or to the corner joints when an edge has no frame).")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{i.model.commit("assign distribution",s=>{for(const r of s.areas)t.includes(r.id)&&(r.distribution=e.get())})}}]})}const lo=()=>He("Option",[["add","Add to existing loads"],["replace","Replace loads of this case"],["delete","Delete loads of this case"]],"add");function $s(i){const t=i.model.data.loadCases,e=t.some(n=>n.name===i.lastLoadCase)?i.lastLoadCase:t[0].name;return He("Load case",t.map(n=>[n.name,`${n.name} (${n.type})`]),e)}function cd(i="GRAV"){return He("Direction",Hh.map(t=>[t,sa[t]]),i)}function yy(i){const t=_n(i,"joints");if(!t)return;const n=["Force FX","Force FY","Force FZ","Moment MX","Moment MY","Moment MZ"].map((o,a)=>ne(o,0,{q:a<3?"F":"M"})),s=$s(i),r=lo();te({title:`Joint loads on ${t.length} joint(s)`,body:C("div",{class:"form"},C("p",{class:"muted small"},"Global axes. Use a negative FZ for downward loads."),s.row,C("div",{class:"grid2"},...n.map(o=>o.row)),r.row),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const o=n.map(c=>c.get()),a=r.get(),l=i.lastLoadCase=s.get();if(a!=="delete"&&o.some(c=>!Number.isFinite(c)))return de("Fix the highlighted fields");i.model.commit("joint loads",c=>{if(a!=="add"&&(c.jointLoads=c.jointLoads.filter(h=>h.case!==l||!t.includes(h.joint))),!(a==="delete"||o.every(h=>h===0)))for(const h of t){const d=a==="add"?c.jointLoads.find(u=>u.joint===h&&u.case===l):void 0;d?d.f=d.f.map((u,f)=>u+o[f]):c.jointLoads.push({case:l,joint:h,f:[...o]})}}),kt(a==="delete"?"Joint loads deleted":`Load applied to ${t.length} joint(s)`,"ok")}}]})}function Sy(i){const t=_n(i,"joints");if(!t)return;const n=["Translation UX","Translation UY","Translation UZ","Rotation RX","Rotation RY","Rotation RZ"].map((o,a)=>a<3?ne(o,0,{q:"L"}):ne(o,0,{unit:"rad"})),s=$s(i),r=He("Option",[["replace","Replace displacements of this case"],["delete","Delete displacements of this case"]],"replace");te({title:`Joint displacement on ${t.length} joint(s)`,body:C("div",{class:"form"},C("p",{class:"muted small"},"Prescribed displacement (e.g. support settlement) in global axes. It acts only on restrained DOFs; values on free DOFs are ignored with a warning. Use a negative UZ for settlement."),s.row,C("div",{class:"grid2"},...n.map(o=>o.row)),r.row),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const o=n.map(h=>h.get()),a=r.get(),l=i.lastLoadCase=s.get();if(a!=="delete"&&o.some(h=>!Number.isFinite(h)))return de("Fix the highlighted fields");if(i.model.commit("joint displacements",h=>{if(h.jointDisplacements=h.jointDisplacements.filter(d=>d.case!==l||!t.includes(d.joint)),!(a==="delete"||o.every(d=>d===0)))for(const d of t)h.jointDisplacements.push({case:l,joint:d,d:[...o]})}),a==="delete")return void kt("Joint displacements deleted","ok");const c=i.model.data.joints.filter(h=>t.includes(h.id)&&o.some((d,u)=>d!==0&&!h.r[u]));c.length?kt(`${c.length} joint(s) have displacement on unrestrained DOFs — those values are ignored`,"warn"):kt(`Displacement applied to ${t.length} joint(s)`,"ok")}}]})}function My(i){const t=_n(i,"frames");if(!t)return;const e=cd(),n=ne("Load P",10,{q:"F"}),s=ne("Relative distance from end I",.5,{min:0,max:1}),r=$s(i),o=lo();te({title:`Frame point load on ${t.length} frame(s)`,body:C("div",{class:"form"},r.row,e.row,n.row,s.row,o.row,C("p",{class:"muted small"},"Gravity loads act downward (−Z) for positive values. Relative distance 0 = end I, 1 = end J.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const a=n.get(),l=s.get(),c=o.get(),h=i.lastLoadCase=r.get();if(c!=="delete"&&(!Number.isFinite(a)||!Number.isFinite(l)))return de("Fix the highlighted fields");i.model.commit("frame point loads",d=>{if(c!=="add"&&(d.framePointLoads=d.framePointLoads.filter(u=>u.case!==h||!t.includes(u.frame))),!(c==="delete"||a===0))for(const u of t)d.framePointLoads.push({case:h,frame:u,dir:e.get(),P:a,rd:l})}),kt(c==="delete"?"Point loads deleted":`Point load applied to ${t.length} frame(s)`,"ok")}}]})}function by(i){const t=_n(i,"frames");if(!t)return;const e=cd(),n=ne("Uniform load w",5,{q:"FL"}),s=$s(i),r=lo();te({title:`Frame uniform load on ${t.length} frame(s)`,body:C("div",{class:"form"},s.row,e.row,n.row,r.row,C("p",{class:"muted small"},"Load per unit length along the full member. Gravity loads act downward for positive values.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const o=n.get(),a=r.get(),l=i.lastLoadCase=s.get();if(a!=="delete"&&!Number.isFinite(o))return de("Enter a load value");i.model.commit("frame uniform loads",c=>{if(a!=="add"&&(c.frameUniformLoads=c.frameUniformLoads.filter(h=>h.case!==l||!t.includes(h.frame))),!(a==="delete"||o===0))for(const h of t)c.frameUniformLoads.push({case:l,frame:h,dir:e.get(),w:o})}),kt(a==="delete"?"Uniform loads deleted":`Uniform load applied to ${t.length} frame(s)`,"ok")}}]})}function Ey(i){const t=_n(i,"areas");if(!t)return;const e=ne("Uniform pressure q (gravity)",5,{q:"FA"}),n=$s(i),s=lo();te({title:`Area load on ${t.length} area(s)`,body:C("div",{class:"form"},n.row,e.row,s.row,C("p",{class:"muted small"},"Positive values act downward. The load is distributed to the surrounding frames.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const r=e.get(),o=s.get(),a=i.lastLoadCase=n.get();if(o!=="delete"&&!Number.isFinite(r))return de("Enter a load value");i.model.commit("area loads",l=>{if(o!=="add"&&(l.areaLoads=l.areaLoads.filter(c=>c.case!==a||!t.includes(c.area))),!(o==="delete"||r===0))for(const c of t){const h=o==="add"?l.areaLoads.find(d=>d.area===c&&d.case===a):void 0;h?h.q+=r:l.areaLoads.push({case:a,area:c,q:r})}}),kt(o==="delete"?"Area loads deleted":`Area load applied to ${t.length} area(s)`,"ok")}}]})}async function Uh(i){const t=i.selected(),e=t.joints.length+t.frames.length+t.areas.length;if(!e)return void kt("Select objects first","warn");await Ci("Clear loads",`Delete all loads (all load cases) on the ${e} selected object(s)?`,"Delete loads",!0)&&i.model.commit("clear loads",n=>{n.jointLoads=n.jointLoads.filter(s=>!t.joints.includes(s.joint)),n.jointDisplacements=n.jointDisplacements.filter(s=>!t.joints.includes(s.joint)),n.framePointLoads=n.framePointLoads.filter(s=>!t.frames.includes(s.frame)),n.frameUniformLoads=n.frameUniformLoads.filter(s=>!t.frames.includes(s.frame)),n.areaLoads=n.areaLoads.filter(s=>!t.areas.includes(s.area))})}function Nh(i){const t=ne("X",0,{q:"L"}),e=ne("Y",0,{q:"L"}),n=ne("Z",0,{q:"L"});te({title:"Add joint by coordinates",body:C("div",{class:"form"},C("div",{class:"grid3"},t.row,e.row,n.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const s=[t.get(),e.get(),n.get()];if(s.some(a=>!Number.isFinite(a)))return de("Fix the highlighted fields");const r=i.model.data.joints.length,o=i.model.addJoint(s[0],s[1],s[2]);return kt(i.model.data.joints.length>r?`Joint ${o} added`:`Joint ${o} already exists there`,"ok"),!1}}]})}function wy(i){const t=ne("Joint I",null,{min:1}),e=ne("Joint J",null,{min:1});te({title:"Add frame between joints",body:C("div",{class:"form"},C("div",{class:"grid2"},t.row,e.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const n=t.get(),s=e.get();if(!i.model.joint(n)||!i.model.joint(s))return de("Both joints must exist");const r=i.model.addFrame(n,s);return r===null?de("Joints I and J must be different"):(kt(`Frame ${r} (${n}–${s})`,"ok"),!1)}}]})}function hd(i){return[ne(i+"X",0,{q:"L"}),ne(i+"Y",0,{q:"L"}),ne(i+"Z",0,{q:"L"})]}function Fh(i){const t=i.selected(),e=i.model.jointsOf(t.joints,t.frames,t.areas);if(!e.size)return void kt("Select objects to move","warn");const n=hd("Δ");te({title:`Move ${e.size} joint(s)`,body:C("div",{class:"form"},C("div",{class:"grid3"},...n.map(s=>s.row))),buttons:[{label:"Cancel"},{label:"Move",kind:"primary",action:()=>{const s=n.map(o=>o.get());if(s.some(o=>!Number.isFinite(o)))return de("Fix the highlighted fields");const r=i.model.moveJoints(e,s[0],s[1],s[2]);if(r)return de(r)}}]})}function Oh(i){const t=i.selected();if(!t.joints.length&&!t.frames.length&&!t.areas.length)return void kt("Select objects to replicate","warn");const e=hd("Δ"),n=ne("Number of copies",1,{min:1,max:100});te({title:"Replicate (linear copy)",body:C("div",{class:"form"},C("div",{class:"grid3"},...e.map(s=>s.row)),n.row,C("p",{class:"muted small"},"Copies selected objects with their properties, supports and loads.")),buttons:[{label:"Cancel"},{label:"Replicate",kind:"primary",action:()=>{const s=e.map(a=>a.get()),r=Math.round(n.get());if(s.some(a=>!Number.isFinite(a))||!(r>=1))return de("Fix the highlighted fields");if(s.every(a=>a===0))return de("Enter a non-zero offset");const o=i.model.replicate(t.joints,t.frames,t.areas,s[0],s[1],s[2],r);kt(`Created ${o.joints.length} joint(s), ${o.frames.length} frame(s), ${o.areas.length} area(s)`,"ok")}}]})}function Ay(i){const t=_n(i,"frames");if(!t)return;const e=ne("Divide each frame into",2,{min:2,max:100});te({title:`Divide ${t.length} frame(s)`,body:C("div",{class:"form"},e.row),buttons:[{label:"Cancel"},{label:"Divide",kind:"primary",action:()=>{const n=Math.round(e.get());if(!(n>=2))return de("Enter 2 or more");i.model.commit("divide frames",()=>{for(const s of t)i.model.divideFrame(s,n)}),i.select([],"replace")}}]})}function ea(i){const t=i.results;if(!t)return void kt("Run the analysis first","warn");const e=[["Joint displacements",()=>_e(["Joint",...["UX","UY","UZ"].map(l=>`${l} (${Yt("L")})`),"RX (rad)","RY (rad)","RZ (rad)"],i.model.data.joints.map(l=>[String(l.id),...(t.disp[l.id]??[]).map((c,h)=>h<3?jt(c,"L",4):Qe(c,4))]))],["Support reactions",()=>_e(["Joint",...["FX","FY","FZ"].map(l=>`${l} (${Yt("F")})`),...["MX","MY","MZ"].map(l=>`${l} (${Yt("M")})`)],Object.entries(t.reactions).map(([l,c])=>[l,...c.map((h,d)=>jt(h,d<3?"F":"M",4))]))],["Frame end forces",()=>_e(["Frame","End",...["P","V2","V3"].map(l=>`${l} (${Yt("F")})`),...["T","M2","M3"].map(l=>`${l} (${Yt("M")})`)],t.frames.flatMap(l=>{const c=l.x.length-1,h=d=>[l.P[d],l.V2[d],l.V3[d],l.T[d],l.M2[d],l.M3[d]].map((u,f)=>jt(u,f<3?"F":"M",4));return[[String(l.id),"I",...h(0)],["","J",...h(c)]]}))]],n=C("div",{class:"tab-content"}),s=C("div",{class:"tabs"}),r=l=>{n.replaceChildren(e[l][1]()),[...s.children].forEach((c,h)=>c.classList.toggle("active",h===l))};e.forEach(([l],c)=>s.append(C("button",{class:"tab",type:"button",onclick:()=>r(c)},l))),r(0);const o=t.stats,a=C("p",{class:"muted small"},`Applied load ΣF = (${o.sumLoad.map(l=>jt(l,"F",4)).join(", ")}) ${Yt("F")} · Reactions ΣR = (${o.sumReaction.map(l=>jt(l,"F",4)).join(", ")}) ${Yt("F")} · Max displacement ${ye(o.maxDisp,"L",4)}`);te({title:`Analysis results — ${i.resultName}`,wide:!0,body:C("div",null,a,s,n),buttons:[{label:"Close",kind:"primary"}]})}function Bh(){const t=C("div",null,_e(["Action","Touch (iPad/Android)","Mouse & keyboard"],[["Select","Tap object","Click object"],["Add to selection","Multi tool, then tap","Shift/Ctrl + click"],["Box select","Box tool, drag (→ window, ← crossing)","Box tool or Ctrl + drag"],["Rotate view","One-finger drag","Left drag"],["Pan","Two-finger drag","Right/middle drag or Shift + drag"],["Zoom","Pinch","Mouse wheel / trackpad pinch"],["Context menu","Long-press","Right-click"],["Finish frame/area","Done button","Enter or Done"],["Cancel / clear selection","—","Esc"],["Delete","Delete button","Delete key"],["Undo / Redo","Undo / Redo buttons","Ctrl+Z / Ctrl+Y"],["Fit view","Fit button","F"],["Rotate work plane (XY → XZ → YZ)","Plane button (passes through a single selected joint)","P"],["Shift work plane ± grid spacing","Up / Down plane buttons","PgUp / PgDn"]].map(e=>e)),C("ol",{class:"small"},C("li",null,"Define → Materials, Sections and Support types."),C("li",null,"Draw joints, frames and areas on the grid. Use the plane buttons in the toolbar (or Define → Grid & work plane) to change the plane and its offset."),C("li",null,"Select objects and use Assign to set materials, sections and supports."),C("li",null,"Apply loads from the Loads menu."),C("li",null,"Analyze → Run analysis, then pick a result view and adjust the scale."),C("li",null,"File → Save writes a comma-separated .sav file that opens in Excel.")),C("p",{class:"muted small"},`Current units: ${["F","L","FL","FA","M"].map(e=>Yt(e)).join(", ")} (${Ve().label}) — change them with the units selector at the bottom-right. Z is vertical (up).`));te({title:"Help",wide:!0,body:t,buttons:[{label:"Close",kind:"primary"}]})}const zh=(i,t)=>i.jointLoads.filter(e=>e.case===t).length+i.jointDisplacements.filter(e=>e.case===t).length+i.framePointLoads.filter(e=>e.case===t).length+i.frameUniformLoads.filter(e=>e.case===t).length+i.areaLoads.filter(e=>e.case===t).length,Ty=i=>i.factors.length?i.factors.map((t,e)=>`${e?t.factor<0?"− ":"+ ":t.factor<0?"−":""}${Qe(Math.abs(t.factor),3)} ${t.case}`).join(" "):"(empty)";function Cy(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(_e(["Name","Type","Loads",""],t.data.loadCases.map((o,a)=>[o.name,o.type+(a===t.data.loadCases.findIndex(l=>l.type==="Dead")&&t.data.settings.selfWeight?" + self weight":""),String(zh(t.data,o.name)),C("span",{class:"row-btns"},Lt("Edit",()=>r(o)),Lt("Delete",()=>void s(o),"small danger"))])),C("div",{class:"dlg-actions"},Lt("+ Add load case",()=>r(null),"primary")),C("p",{class:"muted small"},"Each load case is analysed separately. Self weight (if enabled) is added to the first Dead case. Combine cases with Loads → Load combinations."))},s=async o=>{if(t.data.loadCases.length<=1)return void kt("At least one load case is required","warn");const a=zh(t.data,o.name);a&&!await Ci("Delete load case",`Load case "${o.name}" has ${a} load(s). Delete the case and its loads?`,"Delete",!0)||(t.commit("delete load case",l=>{const c=h=>h.case!==o.name;l.loadCases=l.loadCases.filter(h=>h.name!==o.name),l.jointLoads=l.jointLoads.filter(c),l.jointDisplacements=l.jointDisplacements.filter(c),l.framePointLoads=l.framePointLoads.filter(c),l.frameUniformLoads=l.frameUniformLoads.filter(c),l.areaLoads=l.areaLoads.filter(c);for(const h of l.loadCombos)h.factors=h.factors.filter(d=>d.case!==o.name)}),n())},r=o=>{const a=Hs("Name",(o==null?void 0:o.name)??`CASE${t.data.loadCases.length+1}`),l=He("Type",Wh.map(c=>[c,c]),(o==null?void 0:o.type)??"Other");te({title:o?`Edit load case ${o.name}`:"Add load case",body:C("div",{class:"form"},a.row,l.row),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=a.get(),h=[...t.data.loadCases.filter(u=>u!==o).map(u=>u.name),...t.data.loadCombos.map(u=>u.name)],d=Ws(c,h,"Load case");if(d)return de(d);t.commit(o?"edit load case":"add load case",u=>{if(!o)return void u.loadCases.push({name:c,type:l.get()});const f=u.loadCases.find(p=>p.name===o.name);if(f.type=l.get(),c!==o.name){f.name=c;for(const p of[u.jointLoads,u.jointDisplacements,u.framePointLoads,u.frameUniformLoads,u.areaLoads])for(const g of p)g.case===o.name&&(g.case=c);for(const p of u.loadCombos)for(const g of p.factors)g.case===o.name&&(g.case=c)}}),o&&i.lastLoadCase===o.name&&(i.lastLoadCase=c),n()}}]})};n(),te({title:"Load cases",body:e,buttons:[{label:"Close",kind:"primary"}]})}function Ry(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(t.data.loadCombos.length?_e(["Name","Combination",""],t.data.loadCombos.map(o=>[o.name,Ty(o),C("span",{class:"row-btns"},Lt("Edit",()=>r(o)),Lt("Delete",()=>s(o),"small danger"))])):C("p",{class:"muted"},"No load combinations. Results are shown per load case."),C("div",{class:"dlg-actions"},Lt("+ Add combination",()=>r(null),"primary")),C("p",{class:"muted small"},"Combination results are the factored sum of the load case results (linear superposition)."))},s=o=>{t.commit("delete load combination",a=>{a.loadCombos=a.loadCombos.filter(l=>l.name!==o.name)}),n()},r=o=>{const a=Hs("Name",(o==null?void 0:o.name)??`COMBO${t.data.loadCombos.length+1}`),l=t.data.loadCases.map(c=>{var h;return{lc:c,f:ne(`× ${c.name}`,o?((h=o.factors.find(d=>d.case===c.name))==null?void 0:h.factor)??0:0,{placeholder:"0"})}});te({title:o?`Edit combination ${o.name}`:"Add load combination",body:C("div",{class:"form"},a.row,C("p",{class:"muted small"},"Scale factor for each load case (0 = not included)."),C("div",{class:"grid2"},...l.map(c=>c.f.row))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=a.get(),h=[...t.data.loadCombos.filter(p=>p!==o).map(p=>p.name),...t.data.loadCases.map(p=>p.name)],d=Ws(c,h,"Combination");if(d)return de(d);const u=l.map(p=>({case:p.lc.name,factor:p.f.input.value.trim()===""?0:p.f.get()}));if(u.some(p=>!Number.isFinite(p.factor)))return de("Fix the highlighted fields");const f=u.filter(p=>p.factor!==0);if(!f.length)return de("Enter at least one non-zero factor");t.commit(o?"edit load combination":"add load combination",p=>{const g={name:c,factors:f};o?p.loadCombos[p.loadCombos.findIndex(m=>m.name===o.name)]=g:p.loadCombos.push(g)}),n()}}]})};n(),te({title:"Load combinations",body:e,buttons:[{label:"Close",kind:"primary"}]})}const Ri=i=>C("dl",{class:"kv"},...i.flatMap(([t,e])=>[C("dt",null,t),C("dd",null,e)])),Ne=(i,...t)=>C("section",{class:"insp-sec"},C("h3",null,i),...t);function na(i,t){const e=i.selected(),n=e.joints.length+e.frames.length+e.areas.length;t.replaceChildren(),n===0?t.append(...Ly(i)):n===1&&e.joints.length?t.append(...Py(i,e.joints[0])):n===1&&e.frames.length?t.append(...Dy(i,e.frames[0])):n===1&&e.areas.length?t.append(...Iy(i,e.areas[0])):t.append(...Uy(i,e))}function Ly(i){const t=i.model.data,e=[Ne("Model",Ri([["Joints",String(t.joints.length)],["Frames",String(t.frames.length)],["Areas",String(t.areas.length)],["Supported joints",String(t.joints.filter(s=>s.r.some(Boolean)).length)],["Spring joints",String(t.joints.filter(Br).length)],["Loads",String(t.jointLoads.length+t.jointDisplacements.length+t.framePointLoads.length+t.frameUniformLoads.length+t.areaLoads.length)],["Self weight",t.settings.selfWeight?"Included":"Off"]]))],n=i.results;return n&&(e.push(Ne(`Analysis results — ${i.resultName}`,Ri([["Equations",String(n.stats.equations)],["Max displacement",ye(n.stats.maxDisp,"L",4)],["ΣLoad (X,Y,Z)",n.stats.sumLoad.map(s=>jt(s,"F",4)).join(", ")+" "+Yt("F")],["ΣReaction (X,Y,Z)",n.stats.sumReaction.map(s=>jt(s,"F",4)).join(", ")+" "+Yt("F")]]),Lt("Show result tables…",()=>i.cmd("resultsTables")))),n.warnings.length&&e.push(Ne("Warnings",C("ul",{class:"warn-list"},...n.warnings.map(s=>C("li",null,s)))))),e.push(C("p",{class:"muted small"},"Tap a joint, frame or area to see and edit its properties.")),e}function ud(i,t,e){return Lt(t,()=>{const n=i.map(r=>r.get());if(n.some(r=>!Number.isFinite(r)))return kt("Fix the highlighted fields","error");const s=e(n);s&&kt(s,"error")},"small primary")}function Py(i,t){const e=i.model,n=e.joint(t),s=ne("X",n.x,{q:"L"}),r=ne("Y",n.y,{q:"L"}),o=ne("Z",n.z,{q:"L"}),a=sn.map((p,g)=>oo(p,n.r[g]));for(const p of a)p.input.addEventListener("change",()=>e.commit("restraint",()=>{e.joint(t).r=a.map(g=>g.get())}));const l=C("div",{class:"chips"},...e.data.supportTypes.map(p=>Lt(p.name,()=>e.commit("support",()=>{e.joint(t).r=[...p.r]})))),c=e.data.jointLoads.filter(p=>p.joint===t),h=e.data.jointDisplacements.filter(p=>p.joint===t),d=[C("h2",{class:"insp-title"},`Joint ${t}`),Ne("Coordinates",C("div",{class:"grid3"},s.row,r.row,o.row),ud([s,r,o],"Apply",p=>e.moveJoints(new Set([t]),p[0]-n.x,p[1]-n.y,p[2]-n.z))),Ne("Support ("+Fl(n.r)+")",l,C("div",{class:"chk-row wrap"},...a.map(p=>p.row))),Ne("Springs",C("p",{class:"muted small"},vy(n.k)+(n.k?` (${Yt("FL")}, ${Yt("MR")})`:"")),C("div",{class:"row-btns"},Lt("Edit springs…",()=>i.cmd("assignSpring")),n.k?Lt("Remove",()=>e.commit("clear springs",()=>{delete e.joint(t).k}),"small danger"):null)),Ne("Joint loads",c.length?_e(["Case",...["FX","FY","FZ"].map(p=>`${p} (${Yt("F")})`),...["MX","MY","MZ"].map(p=>`${p} (${Yt("M")})`)],c.map(p=>[p.case,...p.f.map((g,m)=>jt(g,m<3?"F":"M",4))]),!0):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},Lt("Add load…",()=>i.cmd("jointLoad")),c.length?Lt("Delete loads",()=>e.commit("delete joint loads",p=>{p.jointLoads=p.jointLoads.filter(g=>g.joint!==t)}),"small danger"):null))];h.length&&d.push(Ne("Prescribed displacements",_e(["Case",...["UX","UY","UZ"].map(p=>`${p} (${Yt("L")})`),"RX","RY","RZ"],h.map(p=>[p.case,...p.d.map((g,m)=>m<3?jt(g,"L",4):Qe(g,4))]),!0),C("div",{class:"row-btns"},Lt("Edit…",()=>i.cmd("jointDisp")),Lt("Delete",()=>e.commit("delete joint displacements",p=>{p.jointDisplacements=p.jointDisplacements.filter(g=>g.joint!==t)}),"small danger"))));const u=e.data.frames.filter(p=>p.i===t||p.j===t).map(p=>p.id);d.push(Ri([["Connected frames",u.length?u.join(", "):"None"]]));const f=i.results;if(f&&f.disp[t]){const p=f.disp[t];d.push(Ne(`Displacement — ${i.resultName}`,_e(["UX","UY","UZ"].map(m=>`${m} (${Yt("L")})`),[p.slice(0,3).map(m=>jt(m,"L",4))],!0),_e(["RX (rad)","RY (rad)","RZ (rad)"],[p.slice(3).map(m=>Qe(m,4))],!0)));const g=f.reactions[t];g&&d.push(Ne("Support reaction",_e(["FX","FY","FZ"].map(m=>`${m} (${Yt("F")})`),[g.slice(0,3).map(m=>jt(m,"F",4))],!0),_e(["MX","MY","MZ"].map(m=>`${m} (${Yt("M")})`),[g.slice(3).map(m=>jt(m,"M",4))],!0)))}return d}function Dy(i,t){var p;const e=i.model,n=e.data,s=e.frame(t),r=He("Material",n.materials.map(g=>[g.name,g.name]),s.material),o=He("Section",n.sections.map(g=>[g.name,`${g.name} (${Ds[g.shape]})`]),s.section),a=ne("Angle β",s.beta,{unit:"°"});r.input.addEventListener("change",()=>e.commit("assign material",()=>void(e.frame(t).material=r.get()))),o.input.addEventListener("change",()=>e.commit("assign section",()=>void(e.frame(t).section=o.get())));const l=n.sections.find(g=>g.name===s.section),c=l?Ai(l):null,h=n.framePointLoads.filter(g=>g.frame===t),d=n.frameUniformLoads.filter(g=>g.frame===t),u=[C("h2",{class:"insp-title"},`Frame ${t}`),Ri([["Joints I → J",`${s.i} → ${s.j}`],["Length",ye(e.frameLength(s),"L",4)]]),Ne("Properties",r.row,o.row,c?C("p",{class:"muted small"},`A = ${ye(c.A,"A",4)}, I33 = ${ye(c.I33,"L4",4)}, I22 = ${ye(c.I22,"L4",4)}, J = ${ye(c.J,"L4",4)}, As2 = ${ye(c.As2,"A",4)}, As3 = ${ye(c.As3,"A",4)}`):null,l!=null&&l.catalog?C("p",{class:"muted small"},`Catalog: ${l.catalog}${l.props?" (published properties)":""}${l.mass?`, ${Qe(l.mass,4)} kg/m`:""}`):null,a.row,ud([a],"Apply β",g=>void e.commit("beta",()=>void(e.frame(t).beta=g[0])))),Ne("End releases",Ri([["End I (Joint "+s.i+")",zr(s.relI)],["End J (Joint "+s.j+")",zr(s.relJ)]]),C("div",{class:"row-btns"},Lt("Edit releases…",()=>i.cmd("assignReleases")),s.relI||s.relJ?Lt("Set continuous",()=>{e.commit("clear releases",()=>{delete e.frame(t).relI,delete e.frame(t).relJ})}):null)),Ne("Frame loads",h.length||d.length?_e(["Case","Type","Direction","Value","Position"],[...h.map(g=>[g.case,"Point",sa[g.dir],ye(g.P,"F",4),"rd = "+Qe(g.rd,3)]),...d.map(g=>[g.case,"Uniform",sa[g.dir],ye(g.w,"FL",4),"full length"])],!0):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},Lt("Point load…",()=>i.cmd("framePoint")),Lt("Uniform load…",()=>i.cmd("frameUniform")),h.length||d.length?Lt("Delete loads",()=>e.commit("delete frame loads",g=>{g.framePointLoads=g.framePointLoads.filter(m=>m.frame!==t),g.frameUniformLoads=g.frameUniformLoads.filter(m=>m.frame!==t)}),"small danger"):null))],f=(p=i.results)==null?void 0:p.frames.find(g=>g.id===t);if(f){const g=f.x.length-1,m=["P","V2","V3","T","M2","M3"],v=P=>P<3?"F":"M",M=m.map((P,A)=>{const T=f[P],L=v(A);return[`${P} (${Yt(L)})`,jt(T[0],L,4),jt(T[g],L,4),jt(Math.max(...T),L,4),jt(Math.min(...T),L,4)]});let _=0;for(const P of f.disp)_=Math.max(_,Math.hypot(...P));u.push(Ne(`Internal forces — ${i.resultName}`,_e(["","End I","End J","Max","Min"],M,!0),C("p",{class:"muted small"},`Max displacement along member: ${ye(_,"L",4)}`),Lt("Diagrams…",()=>cl(i,t))));const S=C("details",null,C("summary",null,"Station values"),_e([`x (${Yt("L")})`,...m.map((P,A)=>`${P} (${Yt(v(A))})`)],f.x.map((P,A)=>[jt(P,"L",4),...m.map((T,L)=>jt(f[T][A],v(L),4))]),!0));u.push(S)}return u}function Iy(i,t){const e=i.model,n=e.area(t),s=e.jointMap(),r=n.joints.map(c=>s.get(c)).filter(Boolean),o=$u(r.map(c=>[c.x,c.y,c.z])),a=He("Load distribution",[["two-way","Two-way"],["one-way","One-way"]],n.distribution);a.input.addEventListener("change",()=>e.commit("distribution",()=>void(e.area(t).distribution=a.get())));const l=e.data.areaLoads.filter(c=>c.area===t);return[C("h2",{class:"insp-title"},`Area ${t}`),Ri([["Joints",n.joints.join(", ")],["Area",ye(o,"A",4)]]),Ne("Properties",a.row,C("p",{class:"muted small"},"Areas carry no stiffness; loads are transferred to the edge frames.")),Ne("Area loads",l.length?_e(["Case",`q (${Yt("FA")}, down)`],l.map(c=>[c.case,jt(c.q,"FA",4)]),!0):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},Lt("Add load…",()=>i.cmd("areaLoad")),l.length?Lt("Delete loads",()=>e.commit("delete area loads",c=>{c.areaLoads=c.areaLoads.filter(h=>h.area!==t)}),"small danger"):null))]}function Uy(i,t){const e=[C("h2",{class:"insp-title"},"Selection"),Ri([["Joints",t.joints.length?t.joints.join(", "):"–"],["Frames",t.frames.length?t.frames.join(", "):"–"],["Areas",t.areas.length?t.areas.join(", "):"–"]])],n=[];return t.joints.length&&n.push(Lt("Supports…",()=>i.cmd("assignSupport")),Lt("Springs…",()=>i.cmd("assignSpring")),Lt("Joint load…",()=>i.cmd("jointLoad"))),t.frames.length&&n.push(Lt("Material…",()=>i.cmd("assignMaterial")),Lt("Section…",()=>i.cmd("assignSection")),Lt("End releases…",()=>i.cmd("assignReleases")),Lt("Point load…",()=>i.cmd("framePoint")),Lt("Uniform load…",()=>i.cmd("frameUniform"))),t.areas.length&&n.push(Lt("Area load…",()=>i.cmd("areaLoad"))),n.push(Lt("Move…",()=>i.cmd("move")),Lt("Replicate…",()=>i.cmd("replicate")),Lt("Delete",()=>i.cmd("delete"),"small danger")),e.push(Ne("Quick actions",C("div",{class:"chips"},...n))),e}const Ny="1.2.2",Fy="2026-11-28",Oy=[{version:"1.2.2",date:"2026-11-28",changes:["New Clear button below Multi in the toolbar clears the selection (same as Esc)","Portrait / narrow screens: the hidden Properties panel no longer covers the status bar or blocks taps on it","Replicate now copies frame end releases to the new frames","Frame diagrams: dragging along a plot now moves the cursor and readouts continuously (before, only taps worked)","Extruded view: ghost frames are drawn once with thin lines instead of twice","Code cleanup: shared geometry and UI helpers, dead code removed, one less model copy per analysis run"]},{version:"1.2.1",date:"2026-11-26",changes:["Midpoint (triangle marker) and frame-crossing (X marker) snaps while drawing; placing a joint there splits the frame(s) so the new member is connected, in one undo step","Short vibration when a snap locks (Android)","Divide frames… now keeps end releases on the outer ends and moves point loads to the right piece","File → Import DXF…: lines, polylines, 3D faces and points from CAD; choose units, layers, merge tolerance and add/replace; section@material layers assign properties","File → Export DXF…: model geometry plus deformed shape and force diagrams (with values) on separate layers, in the current length unit"]},{version:"1.2.0",date:"2026-11-24",changes:["Section catalogs: search and pick a standard section (IPE, HEA, HEB, WF) in Define ▸ Frame sections","Define ▸ Section catalogs… imports your own tables from CSV files edited in Excel (comma or semicolon, decimal point or comma)","Export any catalog or download a template to see the format; import shows a report of skipped rows and warnings","Published A, I33, I22 and J from a catalog override the values computed from the dimensions",".sav SECTIONS table gains Override, Catalog and Mass columns (older files still open)"]},{version:"1.1.8",date:"2026-11-20",changes:["Elastic joint springs: Assign ▸ Joint springs… sets Kx, Ky, Kz (force/length) and Krx, Kry, Krz (moment/rad) per joint","Prescribed joint displacements (support settlement) per load case: Loads ▸ Joint displacement…","Reactions include spring forces, so reactions still balance the loads","Analysis warnings for a spring on a restrained DOF and for a displacement on a free DOF","New .sav tables SPRINGS and JOINT DISPLACEMENTS (older files still open)","Spring (coil / spiral) and prescribed-displacement glyphs in the 3D view; springs and displacements shown in the inspector"]},{version:"1.1.7",date:"2026-11-19",changes:["Pin-jointed trusses no longer need restrained joint rotations: unresisted joint rotations are stabilised automatically (with a warning)","Pin - Pin (Truss) preset now releases T at End I only (M2 M3 at both ends)","Releasing P, V2, V3 or T at both ends is blocked in the dialog, the analysis and the .sav reader","Unknown end-release text in a .sav file is now an error with the line number","Released end values are computed, not forced to zero (only round-off is cleaned)","Support and release dialogs: Translations / Rotations (and End I / End J) checkboxes now sit on their own rows under their labels"]},{version:"1.1.6",date:"2026-11-18",changes:["Prevent Android soft keyboard flashing when selecting dropdown options or opening dialogs"]},{version:"1.1.5",date:"2026-11-18",changes:["Shear deformation (Timoshenko) in frame elements using shear modulus G and shear areas As2/As3","Shear areas As2/As3 shown in section dialog, inspector and .sav SECTIONS table",'"Include self weight" is now checked by default for new models',"New Analyze ▸ Frame diagram… menu item","Fixed diagram fill showing positive colour over negative values","Joint labels are easier to read (background pill, offset from joint dot)","Version history added to the About dialog"]},{version:"1.1.4",date:"2026-11-17",changes:["Compact multiline load labels, grouped like reaction labels"]},{version:"1.1.3",date:"2026-11-17",changes:["Stacked load labels per load case with case-name prefixes","Matching 2D/3D diagram colours","Inverted moment axis in diagrams"]},{version:"1.1.2",date:"2026-11-17",changes:["Isolated 3D viewport stacking context so labels no longer bleed through dialogs"]},{version:"1.1.1",date:"2026-11-16",changes:["Load dialog dropdown shows load case name and type"]},{version:"1.1.0",date:"2026-11-15",changes:["Member end releases (Phase 1.1) with hinge markers in the 3D view"]},{version:"1.0.0",date:"2026-11-12",changes:["Load cases (Dead, Live, custom) and load combinations (default 1.2D + 1.6L)","Frame diagrams window: axial, torsion, V2/M3, V3/M2 and deflection with tap-to-read values","UNP and C frame shapes","Drag a selected joint to move it (snaps to grid)","Unit systems selector (kN-m, N-mm, ton-m, kg-mm, imperial)","Work plane rotate/offset shortcut buttons"]},{version:"Initial",date:"2026-11-07",changes:["Touch-friendly 3D modelling canvas: joints, frames and areas","Materials, sections, supports and joint/frame loads","Linear static 3D frame analysis with forces, reactions and deformed shape","Save/open models as comma-separated .sav files (Excel friendly)"]}],By={XY:"Z",XZ:"Y",YZ:"X"},kh=[["none","Undeformed"],["deformed","Deformed shape"],["P","Axial P"],["V2","Shear V2"],["V3","Shear V3"],["T","Torsion T"],["M2","Moment M2"],["M3","Moment M3"],["reactions","Support reactions"]],zy={select:'<path d="M5 3l14 8-6 2-3 6z"/>',joint:'<circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',frame:'<circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="5" r="2.2"/><path d="M6.5 17.5l11-11"/>',area:'<path d="M4 18l4-12h12l-4 12z" fill="currentColor" fill-opacity=".25"/>',box:'<rect x="4" y="5" width="16" height="14" rx="1" stroke-dasharray="3 2"/>',multi:'<rect x="3" y="7" width="11" height="11" rx="2"/><path d="M10 4h8a2 2 0 0 1 2 2v8"/>',clear:'<rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="3 2"/><path d="M9 9l6 6M15 9l-6 6"/>',done:'<path d="M5 12.5l4.5 4.5L19 7"/>',fit:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',undo:'<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',redo:'<path d="M15 7l5 5-5 5"/><path d="M20 12H10a6 6 0 0 0 0 12"/>',del:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',plane:'<path d="M3 15l6-5h12l-6 5z" fill="currentColor" fill-opacity=".2"/><path d="M17 4a5 5 0 0 1 3 4.5M20 8.5l.2-2.6M20 8.5l-2.5-.7"/>',planeUp:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 12V3M8.5 6.5L12 3l3.5 3.5"/>',planeDown:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 3v9M8.5 8.5L12 12l3.5-3.5"/>',run:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'},ia=i=>{const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("class","ico"),t.innerHTML=zy[i],t};class ky{constructor(t){lt(this,"model",new $l);lt(this,"viewer");lt(this,"tools");lt(this,"selection",new Set);lt(this,"resultSet",null);lt(this,"resultName","");lt(this,"lastLoadCase","");lt(this,"fileName","Untitled.sav");lt(this,"fileHandle",null);lt(this,"dirty",!1);lt(this,"includeResults",!0);lt(this,"deformRel",0);lt(this,"forceRel",0);lt(this,"theme","light");lt(this,"busy",!1);lt(this,"root");lt(this,"viewport");lt(this,"panel");lt(this,"panelBody");lt(this,"statusEl");lt(this,"coordEl");lt(this,"unitsEl");lt(this,"fileEl");lt(this,"hintEl");lt(this,"resultsBar");lt(this,"toolButtons",new Map);lt(this,"autosaveTimer",0);lt(this,"suppressDirty",!1);lt(this,"rb");lt(this,"planeOffsets",{});lt(this,"commands",{jointLoad:()=>yy(this),framePoint:()=>My(this),frameUniform:()=>by(this),areaLoad:()=>Ey(this),assignSupport:()=>gy(this),assignSpring:()=>_y(this),jointDisp:()=>Sy(this),assignMaterial:()=>ta(this,"material"),assignSection:()=>ta(this,"section"),assignBeta:()=>ta(this,"beta"),assignReleases:()=>my(this),assignArea:()=>xy(this),move:()=>Fh(this),replicate:()=>Oh(this),divide:()=>Ay(this),delete:()=>void this.deleteSelected(),resultsTables:()=>ea(this)});this.root=t;const e=localStorage.getItem("structapp.theme");(e==="light"||e==="dark")&&(this.theme=e),this.buildLayout(),this.viewer=new ix(this.viewport),this.tools=new hx(this),this.applyTheme(),new ax(this.viewer.canvas,{tap:(n,s,r)=>this.tools.tap(n,s,r),longPress:(n,s)=>this.contextMenu(n,s),hover:(n,s,r)=>this.tools.hover(n,s,r),orbit:(n,s)=>this.viewer.orbit(n,s),pan:(n,s)=>this.viewer.pan(n,s),zoom:(n,s,r)=>this.viewer.zoom(n,s,r),wantsBox:n=>this.tools.wantsBox(n),box:(n,s,r,o,a)=>this.tools.box(n,s,r,o,a),wantsDrag:(n,s,r)=>this.tools.wantsDrag(n,s,r),drag:(n,s,r)=>this.tools.drag(n,s,r)}),this.model.onChange(n=>this.onModelChange(n)),this.installKeyboard(),window.addEventListener("beforeunload",n=>{this.dirty&&(n.preventDefault(),n.returnValue="")}),this.refresh(),this.viewer.fit(),this.onToolChanged(),this.offerRecovery()}get results(){var t;return((t=this.resultSet)==null?void 0:t.results[this.resultName])??null}buildLayout(){const e=[["File",()=>this.fileMenu()],["Edit",()=>this.editMenu()],["Define",()=>this.defineMenu()],["Draw",()=>this.drawMenu()],["Assign",()=>this.assignMenu()],["Loads",()=>this.loadsMenu()],["Analyze",()=>this.analyzeMenu()],["Display",()=>this.displayMenu()],["Help",()=>this.helpMenu()]].map(([u,f])=>{const p=C("button",{class:"menu-btn",type:"button"},u);return p.addEventListener("click",g=>{if(g.stopPropagation(),cx(p))return Jr();const m=p.getBoundingClientRect();Sh(f(),m.left,m.bottom+2,p)}),p});this.fileEl=C("span",{class:"file-name"});const n=C("button",{class:"btn primary run-btn",type:"button",title:"Run analysis (F5)",onclick:()=>void this.analyze()},ia("run"),C("span",null,"Run")),s=C("button",{class:"icon-btn",type:"button",title:"Show/hide properties panel",onclick:()=>this.togglePanel()},ia("panel")),r=C("header",{class:"menubar"},C("div",{class:"brand"},"StructApp 3D"),C("nav",{class:"menus"},...e),C("div",{class:"spacer"}),this.fileEl,n,s),o=(u,f,p,g)=>{const m=C("button",{class:"tool-btn",type:"button",title:p,"aria-label":p,onclick:g},ia(u),C("span",null,f));return this.toolButtons.set(u,m),m},a=C("nav",{class:"toolbar"},o("select","Select","Select (S)",()=>this.tools.setTool("select")),o("box","Box","Box/window select (B)",()=>this.tools.setTool("box")),o("multi","Multi","Multi-select: taps add to selection (M)",()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()}),o("clear","Clear","Clear selection (Esc)",()=>this.select([],"replace")),C("div",{class:"tb-sep"}),o("joint","Joint","Draw joints (J)",()=>this.tools.setTool("joint")),o("frame","Frame","Draw frames (L)",()=>this.tools.setTool("frame")),o("area","Area","Draw areas (A)",()=>this.tools.setTool("area")),o("done","Done","Finish frame chain / close area (Enter)",()=>this.tools.finishChain(!0)),C("div",{class:"tb-sep"}),o("fit","Fit","Zoom to fit (F)",()=>this.viewer.fit()),o("undo","Undo","Undo (Ctrl+Z)",()=>this.undo()),o("redo","Redo","Redo (Ctrl+Y)",()=>this.redo()),o("del","Delete","Delete selected (Del)",()=>void this.deleteSelected()),C("div",{class:"tb-sep"}),o("plane","XY","Rotate work plane XY → XZ → YZ (P)",()=>this.rotateWorkPlane()),o("planeUp","Up","Shift work plane +1 grid spacing (PgUp)",()=>this.shiftWorkPlane(1)),o("planeDown","Down","Shift work plane −1 grid spacing (PgDn)",()=>this.shiftWorkPlane(-1)));this.viewport=C("div",{class:"viewport"}),this.hintEl=C("div",{class:"tool-hint"}),this.resultsBar=this.buildResultsBar();const l=C("div",{class:"viewport-wrap"},this.viewport,this.hintEl,this.resultsBar),c=u=>{const f=u.target;f&&(this.viewport.contains(f)||f===this.viewport)&&u.preventDefault()};l.addEventListener("contextmenu",c,!0),l.addEventListener("selectstart",c,!0),l.addEventListener("dragstart",c,!0),this.panelBody=C("div",{class:"panel-body"});const h=C("div",{class:"sheet-grip",onclick:()=>this.togglePanel()});this.panel=C("aside",{class:"panel"},h,C("div",{class:"panel-head"},C("span",null,"Properties"),C("button",{class:"icon-btn small",type:"button",title:"Close",onclick:()=>this.togglePanel(!1)},"✕")),this.panelBody),(localStorage.getItem("structapp.panel")==="closed"||window.innerWidth<700)&&this.panel.classList.add("collapsed"),this.statusEl=C("span",{class:"status-text"}),this.coordEl=C("span",{class:"coord"}),this.unitsEl=C("select",{class:"units",title:"Units for all input and output values","aria-label":"Units"},C("optgroup",{label:"Metric"},...ls.slice(0,4).map(u=>C("option",{value:u.id},u.label))),C("optgroup",{label:"Imperial"},...ls.slice(4).map(u=>C("option",{value:u.id},u.label)))),this.unitsEl.value=Ve().id,this.unitsEl.addEventListener("change",()=>vh(this.unitsEl.value)),q_(()=>this.onUnitsChanged());const d=C("footer",{class:"statusbar"},this.statusEl,C("div",{class:"spacer"}),this.coordEl,this.unitsEl);this.root.replaceChildren(r,C("div",{class:"main"},a,l,this.panel),d)}buildResultsBar(){const t=C("select",{class:"rb-view","aria-label":"Result display"},...kh.map(([d,u])=>C("option",{value:d},u)));t.addEventListener("change",()=>this.setResultView(t.value));const e=C("input",{type:"range",min:"-3",max:"3",step:"0.05",value:"0","aria-label":"Deformation scale"});e.addEventListener("input",()=>{this.deformRel=Number(e.value),this.applyDeformScale()});const n=C("input",{type:"text",inputmode:"decimal",class:"rb-scale","aria-label":"Deformation scale factor"});n.addEventListener("change",()=>{const d=Number(n.value.replace(",","."));if(!(d>0)||!Number.isFinite(d)){kt("Scale must be a positive number","error"),this.syncResultsBar();return}this.deformRel=Math.log10(d/this.viewer.autoDeformScale),this.applyDeformScale(!1)});const s=C("button",{class:"btn small",type:"button",onclick:()=>(this.deformRel=0,this.applyDeformScale())},"Auto"),r=C("input",{type:"range",min:"-1",max:"1",step:"0.05",value:"0","aria-label":"Diagram scale"});r.addEventListener("input",()=>{this.forceRel=Number(r.value),this.viewer.setResultOptions({forceScale:10**this.forceRel})});const o=C("input",{type:"checkbox"});o.addEventListener("change",()=>this.viewer.setResultOptions({animate:o.checked}));const a=C("input",{type:"checkbox",checked:!0});a.addEventListener("change",()=>this.viewer.setResultOptions({showValues:a.checked}));const l=C("div",{class:"rb-group"},C("label",null,"Scale"),e,n,s,C("label",{class:"check"},o,C("span",null,"Animate"))),c=C("div",{class:"rb-group"},C("label",null,"Size"),r),h=C("select",{class:"rb-case","aria-label":"Load case or combination"});return h.addEventListener("change",()=>this.setResultCase(h.value)),this.rb={rcase:h,view:t,slider:e,scale:n,forceSlider:r,animate:o,values:a,deformGroup:l,forceGroup:c},C("div",{class:"results-bar",hidden:!0},h,t,l,c,C("label",{class:"check"},a,C("span",null,"Values")),C("button",{class:"btn small",type:"button",onclick:()=>ea(this)},"Tables"),C("button",{class:"icon-btn small",type:"button",title:"Hide results",onclick:()=>this.setResultView("none")},"✕"))}applyDeformScale(t=!0){this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(t)}syncResultsBar(t=!0){var o;const e=this.rb,n=this.viewer.resultOpts.view,s=((o=this.resultSet)==null?void 0:o.items)??[],r=s.map(a=>a.kind+":"+a.name).join("|");e.rcase.dataset.sig!==r&&(e.rcase.dataset.sig=r,e.rcase.replaceChildren(...s.map(a=>C("option",{value:a.name},(a.kind==="combo"?"Combo: ":"Case: ")+a.name)))),e.rcase.value=this.resultName,e.view.value=n,t&&(e.slider.value=String(Math.max(-3,Math.min(3,this.deformRel)))),e.scale.value=Qe(this.viewer.autoDeformScale*10**this.deformRel,4),e.forceSlider.value=String(this.forceRel),e.animate.checked=this.viewer.resultOpts.animate,e.values.checked=this.viewer.resultOpts.showValues,e.deformGroup.hidden=n==="none"||n==="reactions",e.forceGroup.hidden=!il.includes(n)&&n!=="reactions",this.resultsBar.hidden=!this.results}clearResults(t=!0){this.resultSet=null,this.viewer.setResults(null),this.viewer.setResultOptions({view:"none",animate:!1}),Kr(),t&&this.refresh()}setResultCase(t){var e;(e=this.resultSet)!=null&&e.results[t]&&(this.resultName=t,this.viewer.setResults(this.results),this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.refresh())}setResultView(t){if(!this.results&&t!=="none")return void kt("Run the analysis first","warn");this.viewer.setResultOptions({view:t,deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(),this.viewer.requestRender()}togglePanel(t){const e=t===void 0?!this.panel.classList.contains("collapsed"):!t;this.panel.classList.toggle("collapsed",e),localStorage.setItem("structapp.panel",e?"closed":"open")}applyTheme(){var t;document.documentElement.dataset.theme=this.theme,this.viewer.setTheme(this.theme==="dark"?Hu:Z_),(t=document.querySelector('meta[name="theme-color"]'))==null||t.setAttribute("content",this.theme==="dark"?"#0f172a":"#f8fafc")}onModelChange(t){this.resultSet&&this.clearResults(!1);for(const e of[...this.selection]){const{kind:n,id:s}=Yr(e);(n==="j"?this.model.joint(s):n==="f"?this.model.frame(s):this.model.area(s))||this.selection.delete(e)}t==="load"&&this.tools.cancel(),this.suppressDirty||(this.dirty=!0,this.scheduleAutosave()),this.refresh()}scheduleAutosave(){clearTimeout(this.autosaveTimer),this.autosaveTimer=window.setTimeout(()=>{try{zx(wh(this.model.data),this.fileName)}catch{}},1200)}onUnitsChanged(){this.unitsEl.value=Ve().id,this.coordEl.textContent="",this.viewer.rebuildAll(),na(this,this.panelBody),this.updateStatus(),Ph(this),this.dirty&&this.scheduleAutosave(),kt(`Units: ${Ve().label}`)}refresh(){this.viewer.setData(this.model.data,this.selection,this.results),na(this,this.panelBody),this.updateStatus(),this.syncResultsBar(),Ph(this)}select(t,e){if(e==="replace")this.selection=new Set(t);else if(e==="add")for(const n of t)this.selection.add(n);else for(const n of t)this.selection.has(n)?this.selection.delete(n):this.selection.add(n);this.viewer.setData(this.model.data,this.selection,this.results),na(this,this.panelBody),this.selection.size&&window.innerWidth>=700&&localStorage.getItem("structapp.panel")!=="closed"&&this.togglePanel(!0),this.updateStatus()}selected(){const t={joints:[],frames:[],areas:[]};for(const e of this.selection){const{kind:n,id:s}=Yr(e);(n==="j"?t.joints:n==="f"?t.frames:t.areas).push(s)}for(const e of Object.values(t))e.sort((n,s)=>n-s);return t}selectAll(){const t=this.model.data;this.select([...t.joints.map(e=>Ue("j",e.id)),...t.frames.map(e=>Ue("f",e.id)),...t.areas.map(e=>Ue("a",e.id))],"replace")}onToolChanged(){var t,e;for(const n of["select","joint","frame","area","box"])(t=this.toolButtons.get(n))==null||t.classList.toggle("active",this.tools.tool===n);(e=this.toolButtons.get("multi"))==null||e.classList.toggle("active",this.tools.multi),this.viewer.canvas.dataset.tool=this.tools.tool,this.hintEl.textContent=Wu[this.tools.tool],this.hintEl.hidden=this.tools.tool==="select",this.updateStatus()}updateStatus(){const t=this.model.data,e=this.selected(),n=e.joints.length+e.frames.length+e.areas.length,s=[this.tools.statusText(),`${t.joints.length} joints · ${t.frames.length} frames · ${t.areas.length} areas`];n&&s.push(`${n} selected`),this.results&&s.push(`analysed, max disp ${Qe(this.results.stats.maxDisp/Ve().kSmall,3)} ${Ve().small}`),this.statusEl.textContent=s.filter(Boolean).join("  |  "),this.fileEl.textContent=(this.dirty?"● ":"")+this.fileName,document.title=`${this.dirty?"* ":""}${this.fileName} – StructApp 3D`,this.toolButtons.get("undo").disabled=!this.model.canUndo,this.toolButtons.get("redo").disabled=!this.model.canRedo,this.toolButtons.get("del").disabled=n===0,this.toolButtons.get("clear").disabled=n===0;const r=this.tools.chain.length>0;this.toolButtons.get("done").disabled=!r;const{workPlane:o,elevation:a}=t.settings,l=By[o],c=(h,d)=>{var f;const u=(f=this.toolButtons.get(h))==null?void 0:f.querySelector("span");u&&(u.textContent=d)};c("plane",`${o} ${l}=${jt(a,"L",4)}`),c("planeUp",`${l} +`),c("planeDown",`${l} −`)}setWorkPlane(t,e){const n=this.model.data.settings;n.workPlane===t&&n.elevation===e||(n.workPlane=t,n.elevation=e,this.planeOffsets[t]=e,this.dirty=!0,this.scheduleAutosave(),this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}rotateWorkPlane(){const t=["XY","XZ","YZ"],e=this.model.data.settings,n=t[(t.indexOf(e.workPlane)+1)%t.length],{joints:s}=this.selected(),r=s.length===1?this.model.joint(s[0]):void 0,o=r?n==="XY"?r.z:n==="XZ"?r.y:r.x:void 0;this.setWorkPlane(n,o??this.planeOffsets[n]??0)}shiftWorkPlane(t){const e=this.model.data.settings;this.setWorkPlane(e.workPlane,Number((e.elevation+t*e.gridSpacing).toFixed(9)))}setCoordReadout(t){this.coordEl.textContent=t?`X ${jt(t.x,"L",4)}  Y ${jt(t.y,"L",4)}  Z ${jt(t.z,"L",4)} ${Yt("L")}`:""}cmd(t){var e,n;(n=(e=this.commands)[t])==null||n.call(e)}undo(){this.model.canUndo&&(this.tools.finishChain(!1),this.keepWorkPlane(()=>this.model.undo()))}keepWorkPlane(t){const{workPlane:e,elevation:n}=this.model.data.settings;t();const s=this.model.data.settings;(s.workPlane!==e||s.elevation!==n)&&(s.workPlane=e,s.elevation=n,this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}redo(){this.model.canRedo&&this.keepWorkPlane(()=>this.model.redo())}async deleteSelected(){const t=this.selected(),e=t.joints.length+t.frames.length+t.areas.length;e&&(this.model.commit("delete",()=>this.model.deleteObjects(t.joints,t.frames,t.areas)),this.selection.clear(),this.refresh(),kt(`Deleted ${e} object${e>1?"s":""} (Undo to restore)`,"info"))}async analyze(){if(this.busy)return;this.tools.finishChain(!0);const t=this.model.data;if(!t.frames.length)return void un("Nothing to analyse","Draw at least one frame and assign supports before running the analysis.");this.busy=!0,document.body.classList.add("busy");const e=performance.now();try{const n=await Tx(t),s=n.items.find(a=>a.name===this.resultName);this.resultSet=n,this.resultName=s?s.name:(n.items.find(a=>a.kind==="combo")??n.items[0]).name;const r=this.results;this.viewer.setResults(r),this.deformRel=0,this.viewer.setResultOptions({view:"deformed",deformScale:this.viewer.autoDeformScale}),this.refresh();const o=[...new Set(n.items.flatMap(a=>n.results[a.name].warnings))];kt(`Analysis complete in ${Math.round(performance.now()-e)} ms – ${r.stats.equations} equations, ${n.items.length} cases/combos`,"ok"),o.length&&kt(o.slice(0,3).join(`
`)+(o.length>3?`
(+${o.length-3} more)`:""),"warn",7e3)}catch(n){un("Analysis failed",n instanceof Error?n.message:String(n))}finally{this.busy=!1,document.body.classList.remove("busy")}}loadData(t,e,n){this.suppressDirty=!0;try{this.selection.clear(),this.model.load(t)}finally{this.suppressDirty=!1}this.fileName=e,this.fileHandle=n,this.planeOffsets={},this.dirty=!1,this.refresh(),this.viewer.fit()}async confirmDiscard(){return this.dirty?Ci("Unsaved changes",`Discard unsaved changes to ${this.fileName}?`,"Discard",!0):!0}async newModel(){await this.confirmDiscard()&&(this.loadData(dl(),"Untitled.sav",null),ys())}async open(){if(await this.confirmDiscard())try{const t=await ol();if(!t)return;const e={},n=Ah(t.text,e);this.loadData(n,t.name,t.handle),ys(),e.units&&vh(e.units),kt(`Opened ${t.name} (${Ve().label})`,"ok")}catch(t){un("Cannot open file",t instanceof xe||t instanceof Error?t.message:String(t))}}async save(t=!1){this.tools.finishChain(!0);try{const e=wh(this.model.data,this.includeResults?this.resultSet:null),n=this.fileName.toLowerCase().endsWith(".sav")?this.fileName:this.fileName+".sav",s=await Zr(e,n,t?null:this.fileHandle);if(!s)return;this.fileName=s.name,this.fileHandle=s.handle,this.dirty=!1,ys(),this.updateStatus(),kt(`Saved ${s.name}`,"ok")}catch(e){un("Save failed",e instanceof Error?e.message:String(e))}}async importDxf(){var u;this.tools.finishChain(!0);let t,e;try{const f=await ol("dxf");if(!f)return;e=f.name,t=Hx(f.text)}catch(f){un("Cannot read DXF",f instanceof Error?f.message:String(f));return}const n=Object.entries(t.skipped).map(([f,p])=>`${f} ×${p}`).join(", ");if(!t.entities.length){un("Nothing to import",`${e} has no LINE, POLYLINE, LWPOLYLINE, 3DFACE or POINT entities.`+(n?` Skipped: ${n}.`:""));return}const s=[["1","m"],["0.001","mm"],["0.01","cm"],["0.3048","ft"],["0.0254","in"]],r=Vx(t.insUnits);r!==null&&!s.some(([f])=>Number(f)===r)&&s.push([String(r),`file units (${r} m)`]);const o=r??Ve().kL,a=He("Drawing units",s,((u=s.find(([f])=>Math.abs(Number(f)-o)<o*1e-9))==null?void 0:u[0])??"1"),l=He("Mode",[["add","Add to current model"],["replace","Replace geometry & loads"]],this.model.data.joints.length?"add":"replace"),c=ne("Merge tolerance",.001,{q:"L",positive:!0}),h=Object.entries(t.layers).sort(([f],[p])=>f.localeCompare(p)).map(([f,p])=>({layer:f,f:oo(`${f} (${p})${Ku(f)?" – areas":""}`,!/^SA3D_RESULT/i.test(f))})),d=C("p",{class:"hint"},`${t.entities.length} entities on ${h.length} layer(s). File units: ${r===null?"not set":r+" m"}.`+(t.bulges?` ${t.bulges} arc segment(s) will be straight.`:"")+(n?` Skipped: ${n}.`:"")+' Layer names like "IPE300@S275" assign the matching section and material.');te({title:`Import DXF – ${e}`,body:C("div",null,d,a.row,l.row,c.row,C("h3",null,"Layers"),...h.map(f=>f.f.row)),buttons:[{label:"Cancel"},{label:"Import",kind:"primary",action:()=>{const f=c.get();if(!Number.isFinite(f))return!1;const p=new Set(h.filter(M=>M.f.get()).map(M=>M.layer));if(!p.size)return kt("Select at least one layer","warn"),!1;const g=l.get()==="replace";g&&this.selection.clear();const m=Wx(this.model,t,{scale:Number(a.get()),layers:p,replace:g,mergeTol:f});this.viewer.fit();const v=[`${m.joints} joints`,`${m.frames} frames`,`${m.areas} areas`];m.duplicates&&v.push(`${m.duplicates} duplicates skipped`),m.zeroLength&&v.push(`${m.zeroLength} zero-length skipped`),kt(`Imported ${v.join(", ")}`,"ok",5e3),m.unmatchedLayers.length&&m.frames&&kt(`No section/material match for layer(s): ${m.unmatchedLayers.join(", ")} – default section used`,"warn",6e3)}}]})}async exportDxf(){this.tools.finishChain(!0);const t=this.results,e=this.viewer.resultOpts.view,n=il,s=t?n.includes(e)?[e]:n:[];try{const r=jx(this.model.data,{kL:Ve().kL,results:t,deformScale:t?this.viewer.autoDeformScale*10**this.deformRel:void 0,forceComps:s,diagramSize:this.viewer.diagramSize(),label:(l,c)=>jt(l,c,3)}),o=this.fileName.replace(/\.[^.]*$/,"")||"model",a=await Zr(r,o+".dxf",null,"dxf");a&&kt(`Exported ${a.name} (${Ve().length})`+(t?` with ${this.resultName} results`:""),"ok")}catch(r){un("DXF export failed",r instanceof Error?r.message:String(r))}}async offerRecovery(){const t=kx();if(!t)return;let e;try{e=Ah(t.text)}catch{ys();return}if(!e.joints.length)return;const n=new Date(t.time).toLocaleString();await Ci("Recover unsaved work?",`An auto-saved copy of "${t.name}" from ${n} was found (${e.joints.length} joints, ${e.frames.length} frames).`,"Recover")?(this.loadData(e,t.name,null),this.dirty=!0,this.updateStatus()):ys()}async loadExample(){if(!await this.confirmDiscard())return;const t=new $l,e=[0,6,12],n=[0,5],s=[0,3.5,7];t.commit("example",r=>{r.sections.push({name:"WF400",shape:"I",dims:[.4,.2,.013,.008]});const o=(a,l,c)=>t.addJoint(a,l,c);for(let a=0;a<s.length;a++)for(const l of e)for(const c of n){const h=o(l,c,s[a]);a===0&&(t.joint(h).r=[...$h])}for(let a=1;a<s.length;a++){for(const l of e)for(const c of n){const h=t.addFrame(o(l,c,s[a-1]),o(l,c,s[a]));t.frame(h).section="WF400",t.frame(h).material="STEEL"}for(const l of n)for(let c=0;c<e.length-1;c++){const h=t.addFrame(o(e[c],l,s[a]),o(e[c+1],l,s[a]));t.frame(h).section="IWF300",t.frame(h).material="STEEL"}for(const l of e){const c=t.addFrame(o(l,0,s[a]),o(l,5,s[a]));t.frame(c).section="IWF300",t.frame(c).material="STEEL"}for(let l=0;l<e.length-1;l++){const c=t.addArea([o(e[l],0,s[a]),o(e[l+1],0,s[a]),o(e[l+1],5,s[a]),o(e[l],5,s[a])]);r.areaLoads.push({case:kr,area:c,q:1.5},{case:Vr,area:c,q:2.5})}for(const l of n)r.jointLoads.push({case:"WIND",joint:o(0,l,s[a]),f:[5*a,0,0,0,0,0]})}r.loadCases.push({name:"WIND",type:"Other"}),r.loadCombos.push({name:"COMBO2",factors:[{case:kr,factor:1.2},{case:Vr,factor:1},{case:"WIND",factor:1}]}),r.settings.gridSpacing=1,r.settings.gridLines=15,r.settings.selfWeight=!0}),this.loadData(t.data,"Example-2storey.sav",null),kt("Example loaded – tap Run to analyse","ok")}toggle(t,e,n){return{label:t,checked:e,action:()=>n(!e())}}disp(t,e){return this.toggle(t,()=>this.viewer.display[e],n=>{this.viewer.display[e]=n,this.viewer.rebuildAll()})}fileMenu(){return[{label:"New",shortcut:"Ctrl+N",action:()=>void this.newModel()},{label:"Open .sav…",shortcut:"Ctrl+O",action:()=>void this.open()},{label:"Save",shortcut:"Ctrl+S",action:()=>void this.save()},{label:"Save As…",shortcut:"Ctrl+Shift+S",action:()=>void this.save(!0)},{separator:!0},this.toggle("Include results in .sav",()=>this.includeResults,t=>this.includeResults=t),{separator:!0},{label:"Import DXF…",action:()=>void this.importDxf()},{label:"Export DXF…",action:()=>void this.exportDxf()},{separator:!0},{label:"Load example model",action:()=>void this.loadExample()}]}editMenu(){const t=()=>this.selection.size===0;return[{label:"Undo",shortcut:"Ctrl+Z",action:()=>this.undo(),disabled:()=>!this.model.canUndo},{label:"Redo",shortcut:"Ctrl+Y",action:()=>this.redo(),disabled:()=>!this.model.canRedo},{separator:!0},{label:"Select all",shortcut:"Ctrl+A",action:()=>this.selectAll()},{label:"Clear selection",shortcut:"Esc",action:()=>this.select([],"replace"),disabled:t},{label:"Delete selected",shortcut:"Del",action:()=>void this.deleteSelected(),disabled:t},{separator:!0},{label:"Move…",action:()=>Fh(this),disabled:t},{label:"Replicate…",action:()=>Oh(this),disabled:t},{label:"Divide frames…",action:()=>this.cmd("divide"),disabled:()=>!this.selected().frames.length}]}defineMenu(){return[{label:"Materials…",action:()=>cy(this)},{label:"Frame sections…",action:()=>uy(this)},{label:"Section catalogs…",action:()=>ad()},{label:"Support types…",action:()=>py(this)},{separator:!0},{label:"Grid & work plane…",action:()=>Ih(this)}]}drawMenu(){const t=(e,n,s)=>({label:n,shortcut:s,checked:()=>this.tools.tool===e,action:()=>this.tools.setTool(e)});return[t("select","Select","S"),t("joint","Draw joint","J"),t("frame","Draw frame","L"),t("area","Draw area","A"),t("box","Box select","B"),{separator:!0},{label:"Add joint by coordinates…",action:()=>Nh(this)},{label:"Add frame by joints…",action:()=>wy(this)},{separator:!0},{label:"Grid & work plane…",action:()=>Ih(this)}]}assignMenu(){return[{heading:"Joints"},{label:"Support / restraints…",action:()=>this.cmd("assignSupport")},{label:"Joint springs…",action:()=>this.cmd("assignSpring")},{heading:"Frames"},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"Local axis angle β…",action:()=>this.cmd("assignBeta")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{heading:"Areas"},{label:"Load distribution…",action:()=>this.cmd("assignArea")}]}loadsMenu(){return[{label:"Joint point load…",action:()=>this.cmd("jointLoad")},{label:"Joint displacement…",action:()=>this.cmd("jointDisp")},{label:"Frame point load…",action:()=>this.cmd("framePoint")},{label:"Frame uniform load…",action:()=>this.cmd("frameUniform")},{label:"Area uniform load…",action:()=>this.cmd("areaLoad")},{separator:!0},{label:"Load cases…",action:()=>Cy(this)},{label:"Load combinations…",action:()=>Ry(this)},{separator:!0},this.toggle("Include self weight",()=>this.model.data.settings.selfWeight,t=>this.model.commit("self weight",e=>void(e.settings.selfWeight=t))),{separator:!0},{label:"Clear loads on selection…",action:()=>void Uh(this),disabled:()=>this.selection.size===0}]}analyzeMenu(){const t=()=>!this.results,e=(n,s)=>({label:s,checked:()=>this.viewer.resultOpts.view===n,disabled:t,action:()=>this.setResultView(n)});return[{label:"Run analysis",shortcut:"F5",action:()=>void this.analyze()},{heading:"Show"},...kh.map(([n,s])=>e(n,s)),{separator:!0},{label:"Frame diagram…",disabled:t,action:()=>{const n=this.selected().frames;n.length===1?cl(this,n[0]):kt(n.length?"Select only one frame to show its diagrams":"Select one frame first, then choose Analyze ▸ Frame diagram","warn")}},{label:"Result tables…",action:()=>ea(this),disabled:t},{label:"Clear results",disabled:t,action:()=>this.clearResults()}]}displayMenu(){const t=this.viewer;return[{heading:"View"},{label:"Fit all",shortcut:"F",action:()=>t.fit()},{label:"3D (isometric)",shortcut:"0",action:()=>t.viewPreset("iso")},{label:"Top (X-Y)",shortcut:"1",action:()=>t.viewPreset("top")},{label:"Front (X-Z)",shortcut:"2",action:()=>t.viewPreset("front")},{label:"Side (Y-Z)",shortcut:"3",action:()=>t.viewPreset("side")},this.toggle("Orthographic",()=>t.useOrtho,e=>t.setOrtho(e)),{heading:"Show"},this.disp("Joint labels","jointLabels"),this.disp("Frame labels","frameLabels"),this.disp("Area labels","areaLabels"),this.disp("Loads","showLoads"),this.disp("Load values","loadValues"),this.disp("Supports","showSupports"),this.disp("Extruded sections","extruded"),{separator:!0},this.toggle("Dark theme",()=>this.theme==="dark",e=>{this.theme=e?"dark":"light",localStorage.setItem("structapp.theme",this.theme),this.applyTheme()}),this.toggle("Properties panel",()=>!this.panel.classList.contains("collapsed"),e=>this.togglePanel(e))]}helpMenu(){return[{label:"Quick guide",shortcut:"F1",action:()=>Bh()},{label:"Load example model",action:()=>void this.loadExample()},{separator:!0},{label:"About",action:()=>void un("About StructApp 3D",C("div",{class:"about"},C("p",{class:"msg"},`StructApp 3D v${Ny} (${Fy})
Light Weight 3D frame structural analysis (linear static, 12-DOF space frame elements with member end releases and shear deformation).
For more information, contact me at: `,C("a",{href:"mailto:rama.ditasuwita@shimz.biz"},"rama.ditasuwita@shimz.biz")),C("h3",null,"Version history"),C("div",{class:"changelog",tabindex:"0","aria-label":"Version history"},...Oy.map(t=>C("section",null,C("h4",null,/^\d/.test(t.version)?`v${t.version}`:`${t.version} release`,C("span",{class:"date"},t.date)),C("ul",null,...t.changes.map(e=>C("li",null,e))))))))}]}contextMenu(t,e){this.tools.finishChain(!0);const n=this.viewer.pick(t,e,24);n&&!this.selection.has(n)&&this.select([n],this.tools.multi?"add":"replace");const s=this.selected(),r=[];if(s.joints.length&&r.push({heading:`Joints (${s.joints.length})`},{label:"Support…",action:()=>this.cmd("assignSupport")},{label:"Springs…",action:()=>this.cmd("assignSpring")},{label:"Joint load…",action:()=>this.cmd("jointLoad")},{label:"Displacement…",action:()=>this.cmd("jointDisp")}),s.frames.length===1&&this.results){const o=s.frames[0];r.push({heading:`Frame ${o} results`},{label:"Frame diagrams…",action:()=>cl(this,o)})}s.frames.length&&r.push({heading:`Frames (${s.frames.length})`},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{label:"Point load…",action:()=>this.cmd("framePoint")},{label:"Uniform load…",action:()=>this.cmd("frameUniform")},{label:"Divide…",action:()=>this.cmd("divide")}),s.areas.length&&r.push({heading:`Areas (${s.areas.length})`},{label:"Area load…",action:()=>this.cmd("areaLoad")},{label:"Distribution…",action:()=>this.cmd("assignArea")}),this.selection.size?r.push({separator:!0},{label:"Properties",action:()=>this.togglePanel(!0)},{label:"Move…",action:()=>this.cmd("move")},{label:"Replicate…",action:()=>this.cmd("replicate")},{label:"Clear loads…",action:()=>void Uh(this)},{label:"Delete",action:()=>void this.deleteSelected()},{label:"Clear selection",action:()=>this.select([],"replace")}):r.push({label:"Fit all",action:()=>this.viewer.fit()},{label:"Add joint…",action:()=>Nh(this)},{label:"Select all",action:()=>this.selectAll()},{label:"Run analysis",action:()=>void this.analyze()}),Sh(r,t,e)}installKeyboard(){window.addEventListener("keydown",t=>{const e=t.target;if(lx()||["INPUT","TEXTAREA","SELECT"].includes(e.tagName)||e.isContentEditable)return;const n=t.key.toLowerCase(),s=t.ctrlKey||t.metaKey,r=o=>{t.preventDefault(),o()};if(s){n==="z"&&!t.shiftKey?r(()=>this.undo()):n==="y"||n==="z"&&t.shiftKey?r(()=>this.redo()):n==="s"?r(()=>void this.save(t.shiftKey)):n==="o"?r(()=>void this.open()):n==="n"?r(()=>void this.newModel()):n==="a"&&r(()=>this.selectAll());return}if(!t.altKey)switch(n){case"delete":case"backspace":return r(()=>void this.deleteSelected());case"escape":return r(()=>{Jr(),this.tools.chain.length?this.tools.cancel():this.tools.tool!=="select"?this.tools.setTool("select"):this.select([],"replace")});case"enter":return r(()=>this.tools.finishChain(!0));case"f":return r(()=>this.viewer.fit());case"p":return r(()=>this.rotateWorkPlane());case"pageup":return r(()=>this.shiftWorkPlane(1));case"pagedown":return r(()=>this.shiftWorkPlane(-1));case"s":return r(()=>this.tools.setTool("select"));case"j":return r(()=>this.tools.setTool("joint"));case"l":return r(()=>this.tools.setTool("frame"));case"a":return r(()=>this.tools.setTool("area"));case"b":return r(()=>this.tools.setTool("box"));case"m":return r(()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()});case"f5":return r(()=>void this.analyze());case"f1":return r(()=>Bh());case"0":return r(()=>this.viewer.viewPreset("iso"));case"1":return r(()=>this.viewer.viewPreset("top"));case"2":return r(()=>this.viewer.viewPreset("front"));case"3":return r(()=>this.viewer.viewPreset("side"))}})}}let Vh=0;document.addEventListener("touchend",i=>{const t=Date.now(),e=i.target;t-Vh<350&&!e.closest("input, textarea, select")&&i.preventDefault(),Vh=t},{passive:!1});const dd=document.getElementById("app");if(!dd)throw new Error("#app element missing");const Vy=new ky(dd);window.structApp=Vy;
