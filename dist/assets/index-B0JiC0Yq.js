var Vu=Object.defineProperty;var Gu=(i,t,e)=>t in i?Vu(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var ot=(i,t,e)=>Gu(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const bh=["P","V2","V3","T","M2","M3"],Hu=[!1,!1,!1,!1,!0,!0],Wu=[!1,!1,!1,!0,!0,!0],Xu=Hu;function Ja(i,t){if(!i||!t)return null;const e=bh.slice(0,4).filter((n,s)=>i[s]&&t[s]);return e.length?`${e.join(", ")} cannot be released at both ends – the member would be unstable (a mechanism).`:null}function Nr(i){if(!i||!i.some(Boolean))return"None";const t=[];return i[0]&&t.push("P"),i[1]&&t.push("V2"),i[2]&&t.push("V3"),i[3]&&t.push("T"),i[4]&&t.push("M2"),i[5]&&t.push("M3"),t.join(" ")}const $u=new Set(["P","U1","AXIAL","V2","U2","V3","U3","T","R1","TORSION","M2","R2","M3","R3"]);function ju(i){if(!i)return;const t=i.trim().toUpperCase();if(!t||t==="NONE"||t==="NO"||t==="FIXED"||t==="RIGID")return;if(t==="PIN"||t==="PINNED"||t==="HINGE")return[!1,!1,!1,!1,!0,!0];const e=new Set(t.split(/[\s,;|+]+/).map(r=>r.trim().toUpperCase()).filter(Boolean)),n=[...e].filter(r=>!$u.has(r));if(n.length)throw new Error(`unknown release '${n.join(" ")}'. Use None, Pin, or any of P V2 V3 T M2 M3.`);const s=[e.has("P")||e.has("U1")||e.has("AXIAL"),e.has("V2")||e.has("U2"),e.has("V3")||e.has("U3"),e.has("T")||e.has("R1")||e.has("TORSION"),e.has("M2")||e.has("R2"),e.has("M3")||e.has("R3")];return s.some(Boolean)?s:void 0}const Eh=["GRAV","GX","GY","GZ","L1","L2","L3"],qo={GRAV:"Gravity (−Z)",GX:"Global X",GY:"Global Y",GZ:"Global Z",L1:"Local 1",L2:"Local 2",L3:"Local 3"},wh=["Dead","Live","Other"],Ah=[!1,!1,!1,!1,!1,!1],Th=[!0,!0,!0,!0,!0,!0],qu=[!0,!0,!0,!1,!1,!1],Yu=[!1,!1,!0,!1,!1,!1],ii=["UX","UY","UZ","RX","RY","RZ"];function Za(){return{settings:{gridSpacing:1,gridLines:10,workPlane:"XY",elevation:0,selfWeight:!0},materials:[{name:"STEEL",E:2e8,nu:.3,gamma:76.98},{name:"C30",E:25743e3,nu:.2,gamma:23.56}],sections:[{name:"R300x500",shape:"rect",dims:[.5,.3]},{name:"IWF300",shape:"I",dims:[.3,.15,.009,.0065]},{name:"PIPE168",shape:"pipe",dims:[.1683,.0071]}],supportTypes:[{name:"Fixed",r:[...Th]},{name:"Pinned",r:[...qu]},{name:"Roller Z",r:[...Yu]},{name:"Free",r:[...Ah]}],joints:[],frames:[],areas:[],loadCases:Ch(),loadCombos:Rh(),jointLoads:[],framePointLoads:[],frameUniformLoads:[],areaLoads:[]}}const Fr="DEAD",Or="LIVE";function Ch(){return[{name:Fr,type:"Dead"},{name:Or,type:"Live"}]}function Rh(){return[{name:"COMBO1",factors:[{case:Fr,factor:1.2},{case:Or,factor:1.6}]}]}function Br(i){(!Array.isArray(i.loadCases)||i.loadCases.length===0)&&(i.loadCases=Ch()),Array.isArray(i.loadCombos)||(i.loadCombos=Rh());const t=new Set(i.loadCases.map(n=>n.name)),e=i.loadCases[0].name;for(const n of[i.jointLoads,i.framePointLoads,i.frameUniformLoads,i.areaLoads])for(const s of n??[])(!s.case||!t.has(s.case))&&(s.case=e);for(const n of i.loadCombos)n.factors=(n.factors??[]).filter(s=>t.has(s.case)&&Number.isFinite(s.factor));return i}const to=1e-6;class Rl{constructor(t){ot(this,"data");ot(this,"undoStack",[]);ot(this,"redoStack",[]);ot(this,"listeners",new Set);ot(this,"batchDepth",0);ot(this,"maxUndo",100);this.data=Br(t??Za())}onChange(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(t){for(const e of this.listeners)e(t)}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}commit(t,e){if(this.batchDepth>0)return e(this.data);const n=JSON.stringify(this.data);this.batchDepth++;let s;try{s=e(this.data)}catch(r){throw this.data=JSON.parse(n),r}finally{this.batchDepth--}return JSON.stringify(this.data)!==n&&(this.undoStack.push(n),this.undoStack.length>this.maxUndo&&this.undoStack.shift(),this.redoStack=[],this.emit(t)),s}undo(){const t=this.undoStack.pop();t&&(this.redoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("undo"))}redo(){const t=this.redoStack.pop();t&&(this.undoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("redo"))}load(t){this.data=Br(t),this.undoStack=[],this.redoStack=[],this.emit("load")}joint(t){return this.data.joints.find(e=>e.id===t)}frame(t){return this.data.frames.find(e=>e.id===t)}area(t){return this.data.areas.find(e=>e.id===t)}jointMap(){return new Map(this.data.joints.map(t=>[t.id,t]))}frameLength(t){const e=this.joint(t.i),n=this.joint(t.j);return!e||!n?0:Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z)}nextId(t){let e=0;for(const n of t)n.id>e&&(e=n.id);return e+1}findJointAt(t,e,n){return this.data.joints.find(s=>Math.abs(s.x-t)<to&&Math.abs(s.y-e)<to&&Math.abs(s.z-n)<to)}addJoint(t,e,n){const s=o=>Math.round(o*1e9)/1e9;t=s(t),e=s(e),n=s(n);const r=this.findJointAt(t,e,n);return r?r.id:this.commit("add joint",o=>{const a=this.nextId(o.joints);return o.joints.push({id:a,x:t,y:e,z:n,r:[...Ah]}),a})}addFrame(t,e){if(t===e||!this.joint(t)||!this.joint(e))return null;const n=this.data.frames.find(s=>s.i===t&&s.j===e||s.i===e&&s.j===t);return n?n.id:this.commit("add frame",s=>{var o,a;const r=this.nextId(s.frames);return s.frames.push({id:r,i:t,j:e,material:((o=s.materials[0])==null?void 0:o.name)??"",section:((a=s.sections[0])==null?void 0:a.name)??"",beta:0}),r})}addArea(t){const e=t.filter((n,s)=>t.indexOf(n)===s);return e.length<3?null:this.commit("add area",n=>{const s=this.nextId(n.areas);return n.areas.push({id:s,joints:e,distribution:"two-way"}),s})}deleteObjects(t,e,n){const s=new Set(t),r=new Set(e),o=new Set(n);this.commit("delete",a=>{for(const l of a.frames)(s.has(l.i)||s.has(l.j))&&r.add(l.id);for(const l of a.areas)l.joints.some(c=>s.has(c))&&o.add(l.id);a.joints=a.joints.filter(l=>!s.has(l.id)),a.frames=a.frames.filter(l=>!r.has(l.id)),a.areas=a.areas.filter(l=>!o.has(l.id)),a.jointLoads=a.jointLoads.filter(l=>!s.has(l.joint)),a.framePointLoads=a.framePointLoads.filter(l=>!r.has(l.frame)),a.frameUniformLoads=a.frameUniformLoads.filter(l=>!r.has(l.frame)),a.areaLoads=a.areaLoads.filter(l=>!o.has(l.area))})}jointsOf(t,e,n){var r;const s=new Set(t);for(const o of e){const a=this.frame(o);a&&(s.add(a.i),s.add(a.j))}for(const o of n)(r=this.area(o))==null||r.joints.forEach(a=>s.add(a));return s}moveJoints(t,e,n,s){const r=this.data.joints.filter(o=>t.has(o.id));for(const o of r){const a=this.findJointAt(o.x+e,o.y+n,o.z+s);if(a&&!t.has(a.id))return`Joint ${o.id} would overlap joint ${a.id}`}return this.commit("move",()=>{for(const o of r)o.x+=e,o.y+=n,o.z+=s}),null}replicate(t,e,n,s,r,o,a){const l={joints:[],frames:[],areas:[]};return this.commit("replicate",c=>{const h=this.jointsOf(t,e,n);for(let d=1;d<=a;d++){const u=new Map;for(const f of h){const p=this.joint(f),g=this.addJoint(p.x+s*d,p.y+r*d,p.z+o*d),m=this.joint(g);m.r=[...p.r],u.set(f,g),l.joints.push(g)}for(const f of e){const p=this.frame(f),g=this.addFrame(u.get(p.i),u.get(p.j));if(g!=null){const m=this.frame(g);m.material=p.material,m.section=p.section,m.beta=p.beta,l.frames.push(g);for(const v of c.framePointLoads.filter(_=>_.frame===f))c.framePointLoads.push({...v,frame:g});for(const v of c.frameUniformLoads.filter(_=>_.frame===f))c.frameUniformLoads.push({...v,frame:g})}}for(const f of n){const p=this.area(f),g=this.addArea(p.joints.map(m=>u.get(m)));if(g!=null){this.area(g).distribution=p.distribution,l.areas.push(g);for(const m of c.areaLoads.filter(v=>v.area===f))c.areaLoads.push({...m,area:g})}}for(const f of t)for(const p of c.jointLoads.filter(g=>g.joint===f))c.jointLoads.push({...p,joint:u.get(f),f:[...p.f]})}}),l}divideFrame(t,e){const n=this.frame(t);!n||e<2||this.commit("divide frame",s=>{const r=this.joint(n.i),o=this.joint(n.j),a=[n.i];for(let d=1;d<e;d++){const u=d/e;a.push(this.addJoint(r.x+(o.x-r.x)*u,r.y+(o.y-r.y)*u,r.z+(o.z-r.z)*u))}a.push(n.j);const l=s.frameUniformLoads.filter(d=>d.frame===t);s.frames=s.frames.filter(d=>d.id!==t),s.frameUniformLoads=s.frameUniformLoads.filter(d=>d.frame!==t);const c=s.framePointLoads.filter(d=>d.frame===t);s.framePointLoads=s.framePointLoads.filter(d=>d.frame!==t);const h=[];for(let d=0;d<e;d++){const u=this.addFrame(a[d],a[d+1]),f=this.frame(u);f.material=n.material,f.section=n.section,f.beta=n.beta,h.push(u);for(const p of l)s.frameUniformLoads.push({...p,frame:u})}for(const d of c){const u=d.rd*e,f=Math.min(Math.floor(u),e-1);s.framePointLoads.push({...d,frame:h[f],rd:u-f})}})}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ka="170",Ju=0,Ll=1,Zu=2,Lh=1,Ku=2,Dn=3,si=0,je=1,cn=2,ei=0,Ji=1,Pl=2,Dl=3,Il=4,Qu=5,mi=100,td=101,ed=102,nd=103,id=104,sd=200,rd=201,od=202,ad=203,Yo=204,Jo=205,ld=206,cd=207,hd=208,ud=209,dd=210,fd=211,pd=212,md=213,gd=214,Zo=0,Ko=1,Qo=2,Qi=3,ta=4,ea=5,na=6,ia=7,Ph=0,vd=1,_d=2,ni=0,xd=1,Md=2,yd=3,Sd=4,bd=5,Ed=6,wd=7,Dh=300,ts=301,es=302,sa=303,ra=304,$r=306,oa=1e3,_i=1001,aa=1002,fn=1003,Ad=1004,$s=1005,Mn=1006,eo=1007,xi=1008,Bn=1009,Ih=1010,Uh=1011,Us=1012,Qa=1013,Si=1014,Nn=1015,ks=1016,tl=1017,el=1018,ns=1020,Nh=35902,Fh=1021,Oh=1022,dn=1023,Bh=1024,zh=1025,Zi=1026,is=1027,kh=1028,nl=1029,Vh=1030,il=1031,sl=1033,Tr=33776,Cr=33777,Rr=33778,Lr=33779,la=35840,ca=35841,ha=35842,ua=35843,da=36196,fa=37492,pa=37496,ma=37808,ga=37809,va=37810,_a=37811,xa=37812,Ma=37813,ya=37814,Sa=37815,ba=37816,Ea=37817,wa=37818,Aa=37819,Ta=37820,Ca=37821,Pr=36492,Ra=36494,La=36495,Gh=36283,Pa=36284,Da=36285,Ia=36286,Td=3200,Cd=3201,Hh=0,Rd=1,Kn="",Xe="srgb",as="srgb-linear",jr="linear",re="srgb",Li=7680,Ul=519,Ld=512,Pd=513,Dd=514,Wh=515,Id=516,Ud=517,Nd=518,Fd=519,Ua=35044,Nl="300 es",Fn=2e3,zr=2001;class ls{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fl=1234567;const Es=Math.PI/180,Ns=180/Math.PI;function yn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]).toLowerCase()}function Ce(i,t,e){return Math.max(t,Math.min(e,i))}function rl(i,t){return(i%t+t)%t}function Od(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Bd(i,t,e){return i!==t?(e-i)/(t-i):0}function ws(i,t,e){return(1-e)*i+e*t}function zd(i,t,e,n){return ws(i,t,1-Math.exp(-e*n))}function kd(i,t=1){return t-Math.abs(rl(i,t*2)-t)}function Vd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Gd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Hd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Wd(i,t){return i+Math.random()*(t-i)}function Xd(i){return i*(.5-Math.random())}function $d(i){i!==void 0&&(Fl=i);let t=Fl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function jd(i){return i*Es}function qd(i){return i*Ns}function Yd(i){return(i&i-1)===0&&i!==0}function Jd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Zd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Kd(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),d=r((t-n)/2),u=o((t-n)/2),f=r((n-t)/2),p=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*d,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*d,a*c);break;case"ZXZ":i.set(l*d,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*p,l*f,a*c);break;case"YXY":i.set(l*f,a*h,l*p,a*c);break;case"ZYZ":i.set(l*p,l*f,a*h,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function hn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const fi={DEG2RAD:Es,RAD2DEG:Ns,generateUUID:yn,clamp:Ce,euclideanModulo:rl,mapLinear:Od,inverseLerp:Bd,lerp:ws,damp:zd,pingpong:kd,smoothstep:Vd,smootherstep:Gd,randInt:Hd,randFloat:Wd,randFloatSpread:Xd,seededRandom:$d,degToRad:jd,radToDeg:qd,isPowerOfTwo:Yd,ceilPowerOfTwo:Jd,floorPowerOfTwo:Zd,setQuaternionFromProperEuler:Kd,normalize:ie,denormalize:hn};class mt{constructor(t=0,e=0){mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Vt{constructor(t,e,n,s,r,o,a,l,c){Vt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],g=s[0],m=s[3],v=s[6],_=s[1],M=s[4],x=s[7],I=s[2],T=s[5],R=s[8];return r[0]=o*g+a*_+l*I,r[3]=o*m+a*M+l*T,r[6]=o*v+a*x+l*R,r[1]=c*g+h*_+d*I,r[4]=c*m+h*M+d*T,r[7]=c*v+h*x+d*R,r[2]=u*g+f*_+p*I,r[5]=u*m+f*M+p*T,r[8]=u*v+f*x+p*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,p=e*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/p;return t[0]=d*g,t[1]=(s*c-h*n)*g,t[2]=(a*n-s*o)*g,t[3]=u*g,t[4]=(h*e-s*l)*g,t[5]=(s*r-a*e)*g,t[6]=f*g,t[7]=(n*l-c*e)*g,t[8]=(o*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(no.makeScale(t,e)),this}rotate(t){return this.premultiply(no.makeRotation(-t)),this}translate(t,e){return this.premultiply(no.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const no=new Vt;function Xh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Qd(){const i=kr("canvas");return i.style.display="block",i}const Ol={};function Ms(i){i in Ol||(Ol[i]=!0,console.warn(i))}function tf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function ef(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function nf(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Zt={enabled:!0,workingColorSpace:as,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===re&&(i.r=On(i.r),i.g=On(i.g),i.b=On(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===re&&(i.r=Ki(i.r),i.g=Ki(i.g),i.b=Ki(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Kn?jr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function On(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Bl=[.64,.33,.3,.6,.15,.06],zl=[.2126,.7152,.0722],kl=[.3127,.329],Vl=new Vt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gl=new Vt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Zt.define({[as]:{primaries:Bl,whitePoint:kl,transfer:jr,toXYZ:Vl,fromXYZ:Gl,luminanceCoefficients:zl,workingColorSpaceConfig:{unpackColorSpace:Xe},outputColorSpaceConfig:{drawingBufferColorSpace:Xe}},[Xe]:{primaries:Bl,whitePoint:kl,transfer:re,toXYZ:Vl,fromXYZ:Gl,luminanceCoefficients:zl,outputColorSpaceConfig:{drawingBufferColorSpace:Xe}}});let Pi;class sf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Pi===void 0&&(Pi=kr("canvas")),Pi.width=t.width,Pi.height=t.height;const n=Pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=kr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=On(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(On(e[n]/255)*255):e[n]=On(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let rf=0;class $h{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=yn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(io(s[o].image)):r.push(io(s[o]))}else r=io(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function io(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?sf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let of=0;class Ge extends ls{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,n=_i,s=_i,r=Mn,o=xi,a=dn,l=Bn,c=Ge.DEFAULT_ANISOTROPY,h=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:of++}),this.uuid=yn(),this.name="",this.source=new $h(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new mt(0,0),this.repeat=new mt(1,1),this.center=new mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Vt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Dh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case oa:t.x=t.x-Math.floor(t.x);break;case _i:t.x=t.x<0?0:1;break;case aa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case oa:t.y=t.y-Math.floor(t.y);break;case _i:t.y=t.y<0?0:1;break;case aa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Dh;Ge.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],g=l[2],m=l[6],v=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+v-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,x=(f+1)/2,I=(v+1)/2,T=(h+u)/4,R=(d+g)/4,P=(p+m)/4;return M>x&&M>I?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=R/n):x>I?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=T/s,r=P/s):I<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(I),n=R/r,s=P/r),this.set(n,s,r,e),this}let _=Math.sqrt((m-p)*(m-p)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(m-p)/_,this.y=(d-g)/_,this.z=(u-h)/_,this.w=Math.acos((c+f+v-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class af extends ls{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ge(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new $h(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends af{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class jh extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class lf extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=r[o+0],f=r[o+1],p=r[o+2],g=r[o+3];if(a===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(a===1){t[e+0]=u,t[e+1]=f,t[e+2]=p,t[e+3]=g;return}if(d!==g||l!==u||c!==f||h!==p){let m=1-a;const v=l*u+c*f+h*p+d*g,_=v>=0?1:-1,M=1-v*v;if(M>Number.EPSILON){const I=Math.sqrt(M),T=Math.atan2(I,v*_);m=Math.sin(m*T)/I,a=Math.sin(a*T)/I}const x=a*_;if(l=l*m+u*x,c=c*m+f*x,h=h*m+p*x,d=d*m+g*x,m===1-a){const I=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=I,c*=I,h*=I,d*=I}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[o],u=r[o+1],f=r[o+2],p=r[o+3];return t[e]=a*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-a*f,t[e+2]=c*p+h*f+a*u-l*d,t[e+3]=h*p-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),d=a(r/2),u=l(n/2),f=l(s/2),p=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-s)*f}else if(n>a&&n>d){const f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+c)/f}else if(a>d){const f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-a);this._w=(o-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ce(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Hl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Hl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=s+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return so.copy(this).projectOnVector(t),this.sub(so)}reflect(t){return this.sub(so.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ce(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const so=new D,Hl=new Vs;class Vn{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,sn):sn.fromBufferAttribute(r,o),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),js.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),js.copy(n.boundingBox)),js.applyMatrix4(t.matrixWorld),this.union(js)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ps),qs.subVectors(this.max,ps),Di.subVectors(t.a,ps),Ii.subVectors(t.b,ps),Ui.subVectors(t.c,ps),Xn.subVectors(Ii,Di),$n.subVectors(Ui,Ii),oi.subVectors(Di,Ui);let e=[0,-Xn.z,Xn.y,0,-$n.z,$n.y,0,-oi.z,oi.y,Xn.z,0,-Xn.x,$n.z,0,-$n.x,oi.z,0,-oi.x,-Xn.y,Xn.x,0,-$n.y,$n.x,0,-oi.y,oi.x,0];return!ro(e,Di,Ii,Ui,qs)||(e=[1,0,0,0,1,0,0,0,1],!ro(e,Di,Ii,Ui,qs))?!1:(Ys.crossVectors(Xn,$n),e=[Ys.x,Ys.y,Ys.z],ro(e,Di,Ii,Ui,qs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Tn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Tn=[new D,new D,new D,new D,new D,new D,new D,new D],sn=new D,js=new Vn,Di=new D,Ii=new D,Ui=new D,Xn=new D,$n=new D,oi=new D,ps=new D,qs=new D,Ys=new D,ai=new D;function ro(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){ai.fromArray(i,r);const a=s.x*Math.abs(ai.x)+s.y*Math.abs(ai.y)+s.z*Math.abs(ai.z),l=t.dot(ai),c=e.dot(ai),h=n.dot(ai);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const cf=new Vn,ms=new D,oo=new D;class Ci{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):cf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ms.subVectors(t,this.center);const e=ms.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ms,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(oo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ms.copy(t.center).add(oo)),this.expandByPoint(ms.copy(t.center).sub(oo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Cn=new D,ao=new D,Js=new D,jn=new D,lo=new D,Zs=new D,co=new D;class ol{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ao.copy(t).add(e).multiplyScalar(.5),Js.copy(e).sub(t).normalize(),jn.copy(this.origin).sub(ao);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Js),a=jn.dot(this.direction),l=-jn.dot(Js),c=jn.lengthSq(),h=Math.abs(1-o*o);let d,u,f,p;if(h>0)if(d=o*l-a,u=o*a-l,p=r*h,d>=0)if(u>=-p)if(u<=p){const g=1/h;d*=g,u*=g,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ao).addScaledVector(Js,u),f}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,r){lo.subVectors(e,t),Zs.subVectors(n,t),co.crossVectors(lo,Zs);let o=this.direction.dot(co),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;jn.subVectors(this.origin,t);const l=a*this.direction.dot(Zs.crossVectors(jn,Zs));if(l<0)return null;const c=a*this.direction.dot(lo.cross(jn));if(c<0||l+c>o)return null;const h=-a*jn.dot(co);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,n,s,r,o,a,l,c,h,d,u,f,p,g,m){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,d,u,f,p,g,m)}set(t,e,n,s,r,o,a,l,c,h,d,u,f,p,g,m){const v=this.elements;return v[0]=t,v[4]=e,v[8]=n,v[12]=s,v[1]=r,v[5]=o,v[9]=a,v[13]=l,v[2]=c,v[6]=h,v[10]=d,v[14]=u,v[3]=f,v[7]=p,v[11]=g,v[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ni.setFromMatrixColumn(t,0).length(),r=1/Ni.setFromMatrixColumn(t,1).length(),o=1/Ni.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=o*h,f=o*d,p=a*h,g=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-g*c,e[9]=-a*l,e[2]=g-u*c,e[6]=p+f*c,e[10]=o*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u+g*a,e[4]=p*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-p,e[6]=g+u*a,e[10]=o*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u-g*a,e[4]=-o*d,e[8]=p+f*a,e[1]=f+p*a,e[5]=o*h,e[9]=g-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const u=o*h,f=o*d,p=a*h,g=a*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+g,e[1]=l*d,e[5]=g*c+u,e[9]=f*c-p,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const u=o*l,f=o*c,p=a*l,g=a*c;e[0]=l*h,e[4]=g-u*d,e[8]=p*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-g*d}else if(t.order==="XZY"){const u=o*l,f=o*c,p=a*l,g=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+g,e[5]=o*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=a*h,e[10]=g*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(hf,t,uf)}lookAt(t,e,n){const s=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),qn.crossVectors(n,Ye),qn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),qn.crossVectors(n,Ye)),qn.normalize(),Ks.crossVectors(Ye,qn),s[0]=qn.x,s[4]=Ks.x,s[8]=Ye.x,s[1]=qn.y,s[5]=Ks.y,s[9]=Ye.y,s[2]=qn.z,s[6]=Ks.z,s[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],g=n[6],m=n[10],v=n[14],_=n[3],M=n[7],x=n[11],I=n[15],T=s[0],R=s[4],P=s[8],S=s[12],y=s[1],A=s[5],V=s[9],F=s[13],k=s[2],j=s[6],G=s[10],q=s[14],W=s[3],st=s[7],rt=s[11],dt=s[15];return r[0]=o*T+a*y+l*k+c*W,r[4]=o*R+a*A+l*j+c*st,r[8]=o*P+a*V+l*G+c*rt,r[12]=o*S+a*F+l*q+c*dt,r[1]=h*T+d*y+u*k+f*W,r[5]=h*R+d*A+u*j+f*st,r[9]=h*P+d*V+u*G+f*rt,r[13]=h*S+d*F+u*q+f*dt,r[2]=p*T+g*y+m*k+v*W,r[6]=p*R+g*A+m*j+v*st,r[10]=p*P+g*V+m*G+v*rt,r[14]=p*S+g*F+m*q+v*dt,r[3]=_*T+M*y+x*k+I*W,r[7]=_*R+M*A+x*j+I*st,r[11]=_*P+M*V+x*G+I*rt,r[15]=_*S+M*F+x*q+I*dt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],g=t[7],m=t[11],v=t[15];return p*(+r*l*d-s*c*d-r*a*u+n*c*u+s*a*f-n*l*f)+g*(+e*l*f-e*c*u+r*o*u-s*o*f+s*c*h-r*l*h)+m*(+e*c*d-e*a*f-r*o*d+n*o*f+r*a*h-n*c*h)+v*(-s*a*h-e*l*d+e*a*u+s*o*d-n*o*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],g=t[13],m=t[14],v=t[15],_=d*m*c-g*u*c+g*l*f-a*m*f-d*l*v+a*u*v,M=p*u*c-h*m*c-p*l*f+o*m*f+h*l*v-o*u*v,x=h*g*c-p*d*c+p*a*f-o*g*f-h*a*v+o*d*v,I=p*d*l-h*g*l-p*a*u+o*g*u+h*a*m-o*d*m,T=e*_+n*M+s*x+r*I;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return t[0]=_*R,t[1]=(g*u*r-d*m*r-g*s*f+n*m*f+d*s*v-n*u*v)*R,t[2]=(a*m*r-g*l*r+g*s*c-n*m*c-a*s*v+n*l*v)*R,t[3]=(d*l*r-a*u*r-d*s*c+n*u*c+a*s*f-n*l*f)*R,t[4]=M*R,t[5]=(h*m*r-p*u*r+p*s*f-e*m*f-h*s*v+e*u*v)*R,t[6]=(p*l*r-o*m*r-p*s*c+e*m*c+o*s*v-e*l*v)*R,t[7]=(o*u*r-h*l*r+h*s*c-e*u*c-o*s*f+e*l*f)*R,t[8]=x*R,t[9]=(p*d*r-h*g*r-p*n*f+e*g*f+h*n*v-e*d*v)*R,t[10]=(o*g*r-p*a*r+p*n*c-e*g*c-o*n*v+e*a*v)*R,t[11]=(h*a*r-o*d*r-h*n*c+e*d*c+o*n*f-e*a*f)*R,t[12]=I*R,t[13]=(h*g*s-p*d*s+p*n*u-e*g*u-h*n*m+e*d*m)*R,t[14]=(p*a*s-o*g*s-p*n*l+e*g*l+o*n*m-e*a*m)*R,t[15]=(o*d*s-h*a*s+h*n*l-e*d*l-o*n*u+e*a*u)*R,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,p=r*d,g=o*h,m=o*d,v=a*d,_=l*c,M=l*h,x=l*d,I=n.x,T=n.y,R=n.z;return s[0]=(1-(g+v))*I,s[1]=(f+x)*I,s[2]=(p-M)*I,s[3]=0,s[4]=(f-x)*T,s[5]=(1-(u+v))*T,s[6]=(m+_)*T,s[7]=0,s[8]=(p+M)*R,s[9]=(m-_)*R,s[10]=(1-(u+g))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ni.set(s[0],s[1],s[2]).length();const o=Ni.set(s[4],s[5],s[6]).length(),a=Ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],rn.copy(this);const c=1/r,h=1/o,d=1/a;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=h,rn.elements[5]*=h,rn.elements[6]*=h,rn.elements[8]*=d,rn.elements[9]*=d,rn.elements[10]*=d,e.setFromRotationMatrix(rn),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=Fn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let f,p;if(a===Fn)f=-(o+r)/(o-r),p=-2*o*r/(o-r);else if(a===zr)f=-o/(o-r),p=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Fn){const l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(o-r),u=(e+t)*c,f=(n+s)*h;let p,g;if(a===Fn)p=(o+r)*d,g=-2*d;else if(a===zr)p=r*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=g,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ni=new D,rn=new se,hf=new D(0,0,0),uf=new D(1,1,1),qn=new D,Ks=new D,Ye=new D,Wl=new se,Xl=new Vs;class bn{constructor(t=0,e=0,n=0,s=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Ce(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ce(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ce(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ce(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Ce(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Ce(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Wl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Wl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xl.setFromEuler(this),this.setFromQuaternion(Xl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class al{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let df=0;const $l=new D,Fi=new Vs,Rn=new se,Qs=new D,gs=new D,ff=new D,pf=new Vs,jl=new D(1,0,0),ql=new D(0,1,0),Yl=new D(0,0,1),Jl={type:"added"},mf={type:"removed"},Oi={type:"childadded",child:null},ho={type:"childremoved",child:null};class Se extends ls{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:df++}),this.uuid=yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Se.DEFAULT_UP.clone();const t=new D,e=new bn,n=new Vs,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new Vt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=Se.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new al,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(jl,t)}rotateY(t){return this.rotateOnAxis(ql,t)}rotateZ(t){return this.rotateOnAxis(Yl,t)}translateOnAxis(t,e){return $l.copy(t).applyQuaternion(this.quaternion),this.position.add($l.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(jl,t)}translateY(t){return this.translateOnAxis(ql,t)}translateZ(t){return this.translateOnAxis(Yl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Qs.copy(t):Qs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(gs,Qs,this.up):Rn.lookAt(Qs,gs,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Rn),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Jl),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(mf),ho.child=t,this.dispatchEvent(ho),ho.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Jl),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,t,ff),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,pf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),p=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Se.DEFAULT_UP=new D(0,1,0);Se.DEFAULT_MATRIX_AUTO_UPDATE=!0;Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const on=new D,Ln=new D,uo=new D,Pn=new D,Bi=new D,zi=new D,Zl=new D,fo=new D,po=new D,mo=new D,go=new le,vo=new le,_o=new le;class un{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),on.subVectors(t,e),s.cross(on);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){on.subVectors(s,e),Ln.subVectors(n,e),uo.subVectors(t,e);const o=on.dot(on),a=on.dot(Ln),l=on.dot(uo),c=Ln.dot(Ln),h=Ln.dot(uo),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-a*h)*u,p=(o*h-a*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pn)===null?!1:Pn.x>=0&&Pn.y>=0&&Pn.x+Pn.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Pn.x),l.addScaledVector(o,Pn.y),l.addScaledVector(a,Pn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return go.setScalar(0),vo.setScalar(0),_o.setScalar(0),go.fromBufferAttribute(t,e),vo.fromBufferAttribute(t,n),_o.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(go,r.x),o.addScaledVector(vo,r.y),o.addScaledVector(_o,r.z),o}static isFrontFacing(t,e,n,s){return on.subVectors(n,e),Ln.subVectors(t,e),on.cross(Ln).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return on.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),on.cross(Ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return un.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return un.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;Bi.subVectors(s,n),zi.subVectors(r,n),fo.subVectors(t,n);const l=Bi.dot(fo),c=zi.dot(fo);if(l<=0&&c<=0)return e.copy(n);po.subVectors(t,s);const h=Bi.dot(po),d=zi.dot(po);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Bi,o);mo.subVectors(t,r);const f=Bi.dot(mo),p=zi.dot(mo);if(p>=0&&f<=p)return e.copy(r);const g=f*c-l*p;if(g<=0&&c>=0&&p<=0)return a=c/(c-p),e.copy(n).addScaledVector(zi,a);const m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return Zl.subVectors(r,s),a=(d-h)/(d-h+(f-p)),e.copy(s).addScaledVector(Zl,a);const v=1/(m+g+u);return o=g*v,a=u*v,e.copy(n).addScaledVector(Bi,o).addScaledVector(zi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const qh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},tr={h:0,s:0,l:0};function xo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class jt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Xe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Zt.workingColorSpace){if(t=rl(t,1),e=Ce(e,0,1),n=Ce(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=xo(o,r,t+1/3),this.g=xo(o,r,t),this.b=xo(o,r,t-1/3)}return Zt.toWorkingColorSpace(this,s),this}setStyle(t,e=Xe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Xe){const n=qh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=On(t.r),this.g=On(t.g),this.b=On(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Xe){return Zt.fromWorkingColorSpace(Oe.copy(this),t),Math.round(Ce(Oe.r*255,0,255))*65536+Math.round(Ce(Oe.g*255,0,255))*256+Math.round(Ce(Oe.b*255,0,255))}getHexString(t=Xe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.fromWorkingColorSpace(Oe.copy(this),e);const n=Oe.r,s=Oe.g,r=Oe.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Zt.workingColorSpace){return Zt.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=Xe){Zt.fromWorkingColorSpace(Oe.copy(this),t);const e=Oe.r,n=Oe.g,s=Oe.b;return t!==Xe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(tr);const n=ws(Yn.h,tr.h,e),s=ws(Yn.s,tr.s,e),r=ws(Yn.l,tr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new jt;jt.NAMES=qh;let gf=0;class cs extends ls{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gf++}),this.uuid=yn(),this.name="",this.blending=Ji,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Yo,this.blendDst=Jo,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new jt(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ul,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ji&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Yo&&(n.blendSrc=this.blendSrc),this.blendDst!==Jo&&(n.blendDst=this.blendDst),this.blendEquation!==mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ul&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class As extends cs{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new jt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Ph,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const xe=new D,er=new mt;class pn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ua,this.updateRanges=[],this.gpuType=Nn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)er.fromBufferAttribute(this,e),er.applyMatrix3(t),this.setXY(e,er.x,er.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix3(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix4(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyNormalMatrix(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.transformDirection(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ua&&(t.usage=this.usage),t}}class Yh extends pn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Jh extends pn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class fe extends pn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let vf=0;const Ke=new se,Mo=new Se,ki=new D,Je=new Vn,vs=new Vn,we=new D;class Re extends ls{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vf++}),this.uuid=yn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Xh(t)?Jh:Yh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Vt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return Mo.lookAt(t),Mo.updateMatrix(),this.applyMatrix4(Mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new fe(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Je.setFromBufferAttribute(r),this.morphTargetsRelative?(we.addVectors(this.boundingBox.min,Je.min),this.boundingBox.expandByPoint(we),we.addVectors(this.boundingBox.max,Je.max),this.boundingBox.expandByPoint(we)):(this.boundingBox.expandByPoint(Je.min),this.boundingBox.expandByPoint(Je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ci);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(Je.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];vs.setFromBufferAttribute(a),this.morphTargetsRelative?(we.addVectors(Je.min,vs.min),Je.expandByPoint(we),we.addVectors(Je.max,vs.max),Je.expandByPoint(we)):(Je.expandByPoint(vs.min),Je.expandByPoint(vs.max))}Je.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)we.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(we));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)we.fromBufferAttribute(a,c),l&&(ki.fromBufferAttribute(t,c),we.add(ki)),s=Math.max(s,n.distanceToSquared(we))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let P=0;P<n.count;P++)a[P]=new D,l[P]=new D;const c=new D,h=new D,d=new D,u=new mt,f=new mt,p=new mt,g=new D,m=new D;function v(P,S,y){c.fromBufferAttribute(n,P),h.fromBufferAttribute(n,S),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,P),f.fromBufferAttribute(r,S),p.fromBufferAttribute(r,y),h.sub(c),d.sub(c),f.sub(u),p.sub(u);const A=1/(f.x*p.y-p.x*f.y);isFinite(A)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(A),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(A),a[P].add(g),a[S].add(g),a[y].add(g),l[P].add(m),l[S].add(m),l[y].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let P=0,S=_.length;P<S;++P){const y=_[P],A=y.start,V=y.count;for(let F=A,k=A+V;F<k;F+=3)v(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const M=new D,x=new D,I=new D,T=new D;function R(P){I.fromBufferAttribute(s,P),T.copy(I);const S=a[P];M.copy(S),M.sub(I.multiplyScalar(I.dot(S))).normalize(),x.crossVectors(T,S);const A=x.dot(l[P])<0?-1:1;o.setXYZW(P,M.x,M.y,M.z,A)}for(let P=0,S=_.length;P<S;++P){const y=_[P],A=y.start,V=y.count;for(let F=A,k=A+V;F<k;F+=3)R(t.getX(F+0)),R(t.getX(F+1)),R(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new pn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new D,r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,d=new D;if(t)for(let u=0,f=t.count;u<f;u+=3){const p=t.getX(u+0),g=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,g),o.fromBufferAttribute(e,m),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(p,a.x,a.y,a.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)we.fromBufferAttribute(t,e),we.normalize(),t.setXYZ(e,we.x,we.y,we.z)}toNonIndexed(){function t(a,l){const c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h);let f=0,p=0;for(let g=0,m=l.length;g<m;g++){a.isInterleavedBufferAttribute?f=l[g]*a.data.stride+a.offset:f=l[g]*h;for(let v=0;v<h;v++)u[p++]=c[f++]}return new pn(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Re,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=t(l,n);e.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,h=o.length;c<h;c++){const d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Kl=new se,li=new ol,nr=new Ci,Ql=new D,ir=new D,sr=new D,rr=new D,yo=new D,or=new D,tc=new D,ar=new D;class Te extends Se{constructor(t=new Re,e=new As){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){or.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=a[l],d=r[l];h!==0&&(yo.fromBufferAttribute(d,t),o?or.addScaledVector(yo,h):or.addScaledVector(yo.sub(e),h))}e.add(or)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(r),li.copy(t.ray).recast(t.near),!(nr.containsPoint(li.origin)===!1&&(li.intersectSphere(nr,Ql)===null||li.origin.distanceToSquared(Ql)>(t.far-t.near)**2))&&(Kl.copy(r).invert(),li.copy(t.ray).applyMatrix4(Kl),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,li)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let p=0,g=u.length;p<g;p++){const m=u[p],v=o[m.materialIndex],_=Math.max(m.start,f.start),M=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=_,I=M;x<I;x+=3){const T=a.getX(x),R=a.getX(x+1),P=a.getX(x+2);s=lr(this,v,t,n,c,h,d,T,R,P),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),g=Math.min(a.count,f.start+f.count);for(let m=p,v=g;m<v;m+=3){const _=a.getX(m),M=a.getX(m+1),x=a.getX(m+2);s=lr(this,o,t,n,c,h,d,_,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let p=0,g=u.length;p<g;p++){const m=u[p],v=o[m.materialIndex],_=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=_,I=M;x<I;x+=3){const T=x,R=x+1,P=x+2;s=lr(this,v,t,n,c,h,d,T,R,P),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let m=p,v=g;m<v;m+=3){const _=m,M=m+1,x=m+2;s=lr(this,o,t,n,c,h,d,_,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function _f(i,t,e,n,s,r,o,a){let l;if(t.side===je?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===si,a),l===null)return null;ar.copy(a),ar.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(ar);return c<e.near||c>e.far?null:{distance:c,point:ar.clone(),object:i}}function lr(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,ir),i.getVertexPosition(l,sr),i.getVertexPosition(c,rr);const h=_f(i,t,e,n,ir,sr,rr,tc);if(h){const d=new D;un.getBarycoord(tc,ir,sr,rr,d),s&&(h.uv=un.getInterpolatedAttribute(s,a,l,c,d,new mt)),r&&(h.uv1=un.getInterpolatedAttribute(r,a,l,c,d,new mt)),o&&(h.normal=un.getInterpolatedAttribute(o,a,l,c,d,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:l,c,normal:new D,materialIndex:0};un.getNormal(ir,sr,rr,u.normal),h.face=u,h.barycoord=d}return h}class hs extends Re{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,e,t,o,r,0),p("z","y","x",1,-1,n,e,-t,o,r,1),p("x","z","y",1,1,t,n,e,s,o,2),p("x","z","y",1,-1,t,n,-e,s,o,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(d,2));function p(g,m,v,_,M,x,I,T,R,P,S){const y=x/R,A=I/P,V=x/2,F=I/2,k=T/2,j=R+1,G=P+1;let q=0,W=0;const st=new D;for(let rt=0;rt<G;rt++){const dt=rt*A-F;for(let Ut=0;Ut<j;Ut++){const Wt=Ut*y-V;st[g]=Wt*_,st[m]=dt*M,st[v]=k,c.push(st.x,st.y,st.z),st[g]=0,st[m]=0,st[v]=T>0?1:-1,h.push(st.x,st.y,st.z),d.push(Ut/R),d.push(1-rt/P),q+=1}}for(let rt=0;rt<P;rt++)for(let dt=0;dt<R;dt++){const Ut=u+dt+j*rt,Wt=u+dt+j*(rt+1),U=u+(dt+1)+j*(rt+1),J=u+(dt+1)+j*rt;l.push(Ut,Wt,J),l.push(Wt,U,J),W+=6}a.addGroup(f,W,S),f+=W,u+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ss(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=ss(i[e]);for(const s in n)t[s]=n[s]}return t}function xf(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Zh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}const ll={clone:ss,merge:ze};var Mf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zn extends cs{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Mf,this.fragmentShader=yf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ss(t.uniforms),this.uniformsGroups=xf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Kh extends Se{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=Fn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new D,ec=new mt,nc=new mt;class Qe extends Kh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ns*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ns*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z)}getViewSize(t,e){return this.getViewBounds(t,ec,nc),e.subVectors(nc,ec)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Es*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vi=-90,Gi=1;class Sf extends Se{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qe(Vi,Gi,t,e);s.layers=this.layers,this.add(s);const r=new Qe(Vi,Gi,t,e);r.layers=this.layers,this.add(r);const o=new Qe(Vi,Gi,t,e);o.layers=this.layers,this.add(o);const a=new Qe(Vi,Gi,t,e);a.layers=this.layers,this.add(a);const l=new Qe(Vi,Gi,t,e);l.layers=this.layers,this.add(l);const c=new Qe(Vi,Gi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(const c of e)this.remove(c);if(t===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===zr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Qh extends Ge{constructor(t,e,n,s,r,o,a,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ts,super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class bf extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Qh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Mn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new hs(5,5,5),r=new zn({name:"CubemapFromEquirect",uniforms:ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:je,blending:ei});r.uniforms.tEquirect.value=e;const o=new Te(s,r),a=e.minFilter;return e.minFilter===xi&&(e.minFilter=Mn),new Sf(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}const So=new D,Ef=new D,wf=new Vt;class In{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=So.subVectors(n,e).cross(Ef.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(So),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||wf.getNormalMatrix(t),s=this.coplanarPoint(So).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new Ci,cr=new D;class cl{constructor(t=new In,e=new In,n=new In,s=new In,r=new In,o=new In){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Fn){const n=this.planes,s=t.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],f=s[8],p=s[9],g=s[10],m=s[11],v=s[12],_=s[13],M=s[14],x=s[15];if(n[0].setComponents(l-r,u-c,m-f,x-v).normalize(),n[1].setComponents(l+r,u+c,m+f,x+v).normalize(),n[2].setComponents(l+o,u+h,m+p,x+_).normalize(),n[3].setComponents(l-o,u-h,m-p,x-_).normalize(),n[4].setComponents(l-a,u-d,m-g,x-M).normalize(),e===Fn)n[5].setComponents(l+a,u+d,m+g,x+M).normalize();else if(e===zr)n[5].setComponents(a,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(t){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(cr.x=s.normal.x>0?t.max.x:t.min.x,cr.y=s.normal.y>0?t.max.y:t.min.y,cr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(cr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function tu(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Af(i){const t=new WeakMap;function e(a,l){const c=a.array,h=a.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,a),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],g=d[f];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++u,d[u]=g)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const g=d[f];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class qr extends Re{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,d=t/a,u=e/l,f=[],p=[],g=[],m=[];for(let v=0;v<h;v++){const _=v*u-o;for(let M=0;M<c;M++){const x=M*d-r;p.push(x,-_,0),g.push(0,0,1),m.push(M/a),m.push(1-v/l)}}for(let v=0;v<l;v++)for(let _=0;_<a;_++){const M=_+c*v,x=_+c*(v+1),I=_+1+c*(v+1),T=_+1+c*v;f.push(M,x,T),f.push(x,I,T)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qr(t.width,t.height,t.widthSegments,t.heightSegments)}}var Tf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Cf=`#ifdef USE_ALPHAHASH
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
#endif`,Rf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Df=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,If=`#ifdef USE_AOMAP
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
#endif`,Uf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Nf=`#ifdef USE_BATCHING
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
#endif`,Ff=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Of=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,kf=`#ifdef USE_IRIDESCENCE
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
#endif`,Vf=`#ifdef USE_BUMPMAP
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
#endif`,Gf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Hf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$f=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,jf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,qf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Yf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Jf=`#define PI 3.141592653589793
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
} // validated`,Zf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Kf=`vec3 transformedNormal = objectNormal;
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
#endif`,Qf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,tp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ep=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,np=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ip="gl_FragColor = linearToOutputTexel( gl_FragColor );",sp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rp=`#ifdef USE_ENVMAP
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
#endif`,op=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ap=`#ifdef USE_ENVMAP
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
#endif`,lp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cp=`#ifdef USE_ENVMAP
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
#endif`,hp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,up=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,pp=`#ifdef USE_GRADIENTMAP
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
}`,mp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,vp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_p=`uniform bool receiveShadow;
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
#endif`,xp=`#ifdef USE_ENVMAP
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
#endif`,Mp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ep=`PhysicalMaterial material;
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
#endif`,wp=`struct PhysicalMaterial {
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
}`,Ap=`
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
#endif`,Tp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Cp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Rp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Pp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ip=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Up=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Np=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Fp=`#if defined( USE_POINTS_UV )
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
#endif`,Op=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,kp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Gp=`#ifdef USE_MORPHTARGETS
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
#endif`,Hp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Wp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Xp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$p=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Yp=`#ifdef USE_NORMALMAP
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
#endif`,Jp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Zp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Kp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Qp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,em=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,nm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,im=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,om=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,am=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,cm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,um=`float getShadowMask() {
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
}`,dm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fm=`#ifdef USE_SKINNING
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
#endif`,pm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mm=`#ifdef USE_SKINNING
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
#endif`,gm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_m=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,xm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mm=`#ifdef USE_TRANSMISSION
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
#endif`,ym=`#ifdef USE_TRANSMISSION
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
#endif`,Sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Em=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,wm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Am=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Tm=`uniform sampler2D t2D;
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
}`,Cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Rm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dm=`#include <common>
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
}`,Im=`#if DEPTH_PACKING == 3200
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
}`,Um=`#define DISTANCE
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
}`,Nm=`#define DISTANCE
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
}`,Fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Om=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bm=`uniform float scale;
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
}`,zm=`uniform vec3 diffuse;
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
}`,km=`#include <common>
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
}`,Vm=`uniform vec3 diffuse;
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
}`,Gm=`#define LAMBERT
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
}`,Hm=`#define LAMBERT
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
}`,Wm=`#define MATCAP
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
}`,Xm=`#define MATCAP
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
}`,$m=`#define NORMAL
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
}`,jm=`#define NORMAL
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
}`,qm=`#define PHONG
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
}`,Ym=`#define PHONG
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
}`,Jm=`#define STANDARD
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
}`,Zm=`#define STANDARD
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
}`,Km=`#define TOON
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
}`,Qm=`#define TOON
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
}`,tg=`uniform float size;
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
}`,eg=`uniform vec3 diffuse;
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
}`,ng=`#include <common>
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
}`,ig=`uniform vec3 color;
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
}`,sg=`uniform float rotation;
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
}`,rg=`uniform vec3 diffuse;
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
}`,Ht={alphahash_fragment:Tf,alphahash_pars_fragment:Cf,alphamap_fragment:Rf,alphamap_pars_fragment:Lf,alphatest_fragment:Pf,alphatest_pars_fragment:Df,aomap_fragment:If,aomap_pars_fragment:Uf,batching_pars_vertex:Nf,batching_vertex:Ff,begin_vertex:Of,beginnormal_vertex:Bf,bsdfs:zf,iridescence_fragment:kf,bumpmap_pars_fragment:Vf,clipping_planes_fragment:Gf,clipping_planes_pars_fragment:Hf,clipping_planes_pars_vertex:Wf,clipping_planes_vertex:Xf,color_fragment:$f,color_pars_fragment:jf,color_pars_vertex:qf,color_vertex:Yf,common:Jf,cube_uv_reflection_fragment:Zf,defaultnormal_vertex:Kf,displacementmap_pars_vertex:Qf,displacementmap_vertex:tp,emissivemap_fragment:ep,emissivemap_pars_fragment:np,colorspace_fragment:ip,colorspace_pars_fragment:sp,envmap_fragment:rp,envmap_common_pars_fragment:op,envmap_pars_fragment:ap,envmap_pars_vertex:lp,envmap_physical_pars_fragment:xp,envmap_vertex:cp,fog_vertex:hp,fog_pars_vertex:up,fog_fragment:dp,fog_pars_fragment:fp,gradientmap_pars_fragment:pp,lightmap_pars_fragment:mp,lights_lambert_fragment:gp,lights_lambert_pars_fragment:vp,lights_pars_begin:_p,lights_toon_fragment:Mp,lights_toon_pars_fragment:yp,lights_phong_fragment:Sp,lights_phong_pars_fragment:bp,lights_physical_fragment:Ep,lights_physical_pars_fragment:wp,lights_fragment_begin:Ap,lights_fragment_maps:Tp,lights_fragment_end:Cp,logdepthbuf_fragment:Rp,logdepthbuf_pars_fragment:Lp,logdepthbuf_pars_vertex:Pp,logdepthbuf_vertex:Dp,map_fragment:Ip,map_pars_fragment:Up,map_particle_fragment:Np,map_particle_pars_fragment:Fp,metalnessmap_fragment:Op,metalnessmap_pars_fragment:Bp,morphinstance_vertex:zp,morphcolor_vertex:kp,morphnormal_vertex:Vp,morphtarget_pars_vertex:Gp,morphtarget_vertex:Hp,normal_fragment_begin:Wp,normal_fragment_maps:Xp,normal_pars_fragment:$p,normal_pars_vertex:jp,normal_vertex:qp,normalmap_pars_fragment:Yp,clearcoat_normal_fragment_begin:Jp,clearcoat_normal_fragment_maps:Zp,clearcoat_pars_fragment:Kp,iridescence_pars_fragment:Qp,opaque_fragment:tm,packing:em,premultiplied_alpha_fragment:nm,project_vertex:im,dithering_fragment:sm,dithering_pars_fragment:rm,roughnessmap_fragment:om,roughnessmap_pars_fragment:am,shadowmap_pars_fragment:lm,shadowmap_pars_vertex:cm,shadowmap_vertex:hm,shadowmask_pars_fragment:um,skinbase_vertex:dm,skinning_pars_vertex:fm,skinning_vertex:pm,skinnormal_vertex:mm,specularmap_fragment:gm,specularmap_pars_fragment:vm,tonemapping_fragment:_m,tonemapping_pars_fragment:xm,transmission_fragment:Mm,transmission_pars_fragment:ym,uv_pars_fragment:Sm,uv_pars_vertex:bm,uv_vertex:Em,worldpos_vertex:wm,background_vert:Am,background_frag:Tm,backgroundCube_vert:Cm,backgroundCube_frag:Rm,cube_vert:Lm,cube_frag:Pm,depth_vert:Dm,depth_frag:Im,distanceRGBA_vert:Um,distanceRGBA_frag:Nm,equirect_vert:Fm,equirect_frag:Om,linedashed_vert:Bm,linedashed_frag:zm,meshbasic_vert:km,meshbasic_frag:Vm,meshlambert_vert:Gm,meshlambert_frag:Hm,meshmatcap_vert:Wm,meshmatcap_frag:Xm,meshnormal_vert:$m,meshnormal_frag:jm,meshphong_vert:qm,meshphong_frag:Ym,meshphysical_vert:Jm,meshphysical_frag:Zm,meshtoon_vert:Km,meshtoon_frag:Qm,points_vert:tg,points_frag:eg,shadow_vert:ng,shadow_frag:ig,sprite_vert:sg,sprite_frag:rg},pt={common:{diffuse:{value:new jt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Vt}},envmap:{envMap:{value:null},envMapRotation:{value:new Vt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Vt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Vt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Vt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Vt},normalScale:{value:new mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Vt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Vt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Vt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Vt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new jt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new jt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0},uvTransform:{value:new Vt}},sprite:{diffuse:{value:new jt(16777215)},opacity:{value:1},center:{value:new mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Vt},alphaMap:{value:null},alphaMapTransform:{value:new Vt},alphaTest:{value:0}}},$e={basic:{uniforms:ze([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:ze([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:ze([pt.common,pt.specularmap,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,pt.lights,{emissive:{value:new jt(0)},specular:{value:new jt(1118481)},shininess:{value:30}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:ze([pt.common,pt.envmap,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.roughnessmap,pt.metalnessmap,pt.fog,pt.lights,{emissive:{value:new jt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:ze([pt.common,pt.aomap,pt.lightmap,pt.emissivemap,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.gradientmap,pt.fog,pt.lights,{emissive:{value:new jt(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:ze([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,pt.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:ze([pt.points,pt.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:ze([pt.common,pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:ze([pt.common,pt.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:ze([pt.common,pt.bumpmap,pt.normalmap,pt.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:ze([pt.sprite,pt.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Vt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Vt}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distanceRGBA:{uniforms:ze([pt.common,pt.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distanceRGBA_vert,fragmentShader:Ht.distanceRGBA_frag},shadow:{uniforms:ze([pt.lights,pt.fog,{color:{value:new jt(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};$e.physical={uniforms:ze([$e.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Vt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Vt},clearcoatNormalScale:{value:new mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Vt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Vt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Vt},sheen:{value:0},sheenColor:{value:new jt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Vt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Vt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Vt},transmissionSamplerSize:{value:new mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Vt},attenuationDistance:{value:0},attenuationColor:{value:new jt(0)},specularColor:{value:new jt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Vt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Vt},anisotropyVector:{value:new mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Vt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};const hr={r:0,b:0,g:0},hi=new bn,og=new se;function ag(i,t,e,n,s,r,o){const a=new jt(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function p(_){let M=_.isScene===!0?_.background:null;return M&&M.isTexture&&(M=(_.backgroundBlurriness>0?e:t).get(M)),M}function g(_){let M=!1;const x=p(_);x===null?v(a,l):x&&x.isColor&&(v(x,1),M=!0);const I=i.xr.getEnvironmentBlendMode();I==="additive"?n.buffers.color.setClear(0,0,0,1,o):I==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,M){const x=p(M);x&&(x.isCubeTexture||x.mapping===$r)?(h===void 0&&(h=new Te(new hs(1,1,1),new zn({name:"BackgroundCubeMaterial",uniforms:ss($e.backgroundCube.uniforms),vertexShader:$e.backgroundCube.vertexShader,fragmentShader:$e.backgroundCube.fragmentShader,side:je,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(I,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),hi.copy(M.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(og.makeRotationFromEuler(hi)),h.material.toneMapped=Zt.getTransfer(x.colorSpace)!==re,(d!==x||u!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Te(new qr(2,2),new zn({name:"BackgroundMaterial",uniforms:ss($e.background.uniforms),vertexShader:$e.background.vertexShader,fragmentShader:$e.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Zt.getTransfer(x.colorSpace)!==re,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||u!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function v(_,M){_.getRGB(hr,Zh(i)),n.buffers.color.setClear(hr.r,hr.g,hr.b,M,o)}return{getClearColor:function(){return a},setClearColor:function(_,M=1){a.set(_),l=M,v(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,v(a,l)},render:g,addToRenderList:m}}function lg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(y,A,V,F,k){let j=!1;const G=d(F,V,A);r!==G&&(r=G,c(r.object)),j=f(y,F,V,k),j&&p(y,F,V,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,x(y,A,V,F),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function d(y,A,V){const F=V.wireframe===!0;let k=n[y.id];k===void 0&&(k={},n[y.id]=k);let j=k[A.id];j===void 0&&(j={},k[A.id]=j);let G=j[F];return G===void 0&&(G=u(l()),j[F]=G),G}function u(y){const A=[],V=[],F=[];for(let k=0;k<e;k++)A[k]=0,V[k]=0,F[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:V,attributeDivisors:F,object:y,attributes:{},index:null}}function f(y,A,V,F){const k=r.attributes,j=A.attributes;let G=0;const q=V.getAttributes();for(const W in q)if(q[W].location>=0){const rt=k[W];let dt=j[W];if(dt===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(dt=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(dt=y.instanceColor)),rt===void 0||rt.attribute!==dt||dt&&rt.data!==dt.data)return!0;G++}return r.attributesNum!==G||r.index!==F}function p(y,A,V,F){const k={},j=A.attributes;let G=0;const q=V.getAttributes();for(const W in q)if(q[W].location>=0){let rt=j[W];rt===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(rt=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(rt=y.instanceColor));const dt={};dt.attribute=rt,rt&&rt.data&&(dt.data=rt.data),k[W]=dt,G++}r.attributes=k,r.attributesNum=G,r.index=F}function g(){const y=r.newAttributes;for(let A=0,V=y.length;A<V;A++)y[A]=0}function m(y){v(y,0)}function v(y,A){const V=r.newAttributes,F=r.enabledAttributes,k=r.attributeDivisors;V[y]=1,F[y]===0&&(i.enableVertexAttribArray(y),F[y]=1),k[y]!==A&&(i.vertexAttribDivisor(y,A),k[y]=A)}function _(){const y=r.newAttributes,A=r.enabledAttributes;for(let V=0,F=A.length;V<F;V++)A[V]!==y[V]&&(i.disableVertexAttribArray(V),A[V]=0)}function M(y,A,V,F,k,j,G){G===!0?i.vertexAttribIPointer(y,A,V,k,j):i.vertexAttribPointer(y,A,V,F,k,j)}function x(y,A,V,F){g();const k=F.attributes,j=V.getAttributes(),G=A.defaultAttributeValues;for(const q in j){const W=j[q];if(W.location>=0){let st=k[q];if(st===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(st=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(st=y.instanceColor)),st!==void 0){const rt=st.normalized,dt=st.itemSize,Ut=t.get(st);if(Ut===void 0)continue;const Wt=Ut.buffer,U=Ut.type,J=Ut.bytesPerElement,ft=U===i.INT||U===i.UNSIGNED_INT||st.gpuType===Qa;if(st.isInterleavedBufferAttribute){const K=st.data,Lt=K.stride,It=st.offset;if(K.isInstancedInterleavedBuffer){for(let wt=0;wt<W.locationSize;wt++)v(W.location+wt,K.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let wt=0;wt<W.locationSize;wt++)m(W.location+wt);i.bindBuffer(i.ARRAY_BUFFER,Wt);for(let wt=0;wt<W.locationSize;wt++)M(W.location+wt,dt/W.locationSize,U,rt,Lt*J,(It+dt/W.locationSize*wt)*J,ft)}else{if(st.isInstancedBufferAttribute){for(let K=0;K<W.locationSize;K++)v(W.location+K,st.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let K=0;K<W.locationSize;K++)m(W.location+K);i.bindBuffer(i.ARRAY_BUFFER,Wt);for(let K=0;K<W.locationSize;K++)M(W.location+K,dt/W.locationSize,U,rt,dt*J,dt/W.locationSize*K*J,ft)}}else if(G!==void 0){const rt=G[q];if(rt!==void 0)switch(rt.length){case 2:i.vertexAttrib2fv(W.location,rt);break;case 3:i.vertexAttrib3fv(W.location,rt);break;case 4:i.vertexAttrib4fv(W.location,rt);break;default:i.vertexAttrib1fv(W.location,rt)}}}}_()}function I(){P();for(const y in n){const A=n[y];for(const V in A){const F=A[V];for(const k in F)h(F[k].object),delete F[k];delete A[V]}delete n[y]}}function T(y){if(n[y.id]===void 0)return;const A=n[y.id];for(const V in A){const F=A[V];for(const k in F)h(F[k].object),delete F[k];delete A[V]}delete n[y.id]}function R(y){for(const A in n){const V=n[A];if(V[y.id]===void 0)continue;const F=V[y.id];for(const k in F)h(F[k].object),delete F[k];delete V[y.id]}}function P(){S(),o=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:S,dispose:I,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:g,enableAttribute:m,disableUnusedAttributes:_}}function cg(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function o(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function a(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let p=0;p<d;p++)f+=h[p];e.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)o(c[p],h[p],u[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g]*u[g];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function hg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(R){return!(R!==dn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const P=R===ks&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Bn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Nn&&!P)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=p>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:_,maxVaryings:M,maxFragmentUniforms:x,vertexTextures:I,maxSamples:T}}function ug(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new In,a=new Vt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,v=i.get(d);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const _=r?0:n,M=_*4;let x=v.clippingState||null;l.value=x,x=h(p,u,M,f);for(let I=0;I!==M;++I)x[I]=e[I];v.clippingState=x,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){const g=d!==null?d.length:0;let m=null;if(g!==0){if(m=l.value,p!==!0||m===null){const v=f+g*4,_=u.matrixWorldInverse;a.getNormalMatrix(_),(m===null||m.length<v)&&(m=new Float32Array(v));for(let M=0,x=f;M!==g;++M,x+=4)o.copy(d[M]).applyMatrix4(_,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function dg(i){let t=new WeakMap;function e(o,a){return a===sa?o.mapping=ts:a===ra&&(o.mapping=es),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===sa||a===ra)if(t.has(o)){const l=t.get(o).texture;return e(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new bf(l.height);return c.fromEquirectangularTexture(i,o),t.set(o,c),o.addEventListener("dispose",s),e(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=t.get(a);l!==void 0&&(t.delete(a),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class hl extends Kh{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const qi=4,ic=[.125,.215,.35,.446,.526,.582],gi=20,bo=new hl,sc=new jt;let Eo=null,wo=0,Ao=0,To=!1;const pi=(1+Math.sqrt(5))/2,Hi=1/pi,rc=[new D(-pi,Hi,0),new D(pi,Hi,0),new D(-Hi,0,pi),new D(Hi,0,pi),new D(0,pi,-Hi),new D(0,pi,Hi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class oc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Eo=this._renderer.getRenderTarget(),wo=this._renderer.getActiveCubeFace(),Ao=this._renderer.getActiveMipmapLevel(),To=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Eo,wo,Ao),this._renderer.xr.enabled=To,t.scissorTest=!1,ur(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ts||t.mapping===es?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Eo=this._renderer.getRenderTarget(),wo=this._renderer.getActiveCubeFace(),Ao=this._renderer.getActiveMipmapLevel(),To=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:ks,format:dn,colorSpace:as,depthBuffer:!1},s=ac(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ac(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=fg(r)),this._blurMaterial=pg(r,t,e)}return s}_compileMaterial(t){const e=new Te(this._lodPlanes[0],t);this._renderer.compile(e,bo)}_sceneToCubeUV(t,e,n,s){const a=new Qe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(sc),h.toneMapping=ni,h.autoClear=!1;const f=new As({name:"PMREM.Background",side:je,depthWrite:!1,depthTest:!1}),p=new Te(new hs,f);let g=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,g=!0):(f.color.copy(sc),g=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(a.up.set(0,l[v],0),a.lookAt(c[v],0,0)):_===1?(a.up.set(0,0,l[v]),a.lookAt(0,c[v],0)):(a.up.set(0,l[v],0),a.lookAt(0,0,c[v]));const M=this._cubeSize;ur(s,_*M,v>2?M:0,M,M),h.setRenderTarget(s),g&&h.render(p,a),h.render(t,a)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ts||t.mapping===es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=cc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=lc());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Te(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const l=this._cubeSize;ur(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,bo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=rc[(s-r-1)%rc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Te(this._lodPlanes[s],c),u=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*gi-1),g=r/p,m=isFinite(r)?1+Math.floor(h*g):gi;m>gi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${gi}`);const v=[];let _=0;for(let R=0;R<gi;++R){const P=R/g,S=Math.exp(-P*P/2);v.push(S),R===0?_+=S:R<m&&(_+=2*S)}for(let R=0;R<v.length;R++)v[R]=v[R]/_;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=v,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:M}=this;u.dTheta.value=p,u.mipInt.value=M-n;const x=this._sizeLods[s],I=3*x*(s>M-qi?s-M+qi:0),T=4*(this._cubeSize-x);ur(e,I,T,3*x,2*x),l.setRenderTarget(e),l.render(d,bo)}}function fg(i){const t=[],e=[],n=[];let s=i;const r=i-qi+1+ic.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let l=1/a;o>i-qi?l=ic[o-i+qi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,p=6,g=3,m=2,v=1,_=new Float32Array(g*p*f),M=new Float32Array(m*p*f),x=new Float32Array(v*p*f);for(let T=0;T<f;T++){const R=T%3*2/3-1,P=T>2?0:-1,S=[R,P,0,R+2/3,P,0,R+2/3,P+1,0,R,P,0,R+2/3,P+1,0,R,P+1,0];_.set(S,g*p*T),M.set(u,m*p*T);const y=[T,T,T,T,T,T];x.set(y,v*p*T)}const I=new Re;I.setAttribute("position",new pn(_,g)),I.setAttribute("uv",new pn(M,m)),I.setAttribute("faceIndex",new pn(x,v)),t.push(I),s>qi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ac(i,t,e){const n=new bi(i,t,e);return n.texture.mapping=$r,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ur(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function pg(i,t,e){const n=new Float32Array(gi),s=new D(0,1,0);return new zn({name:"SphericalGaussianBlur",defines:{n:gi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ul(),fragmentShader:`

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
		`,blending:ei,depthTest:!1,depthWrite:!1})}function lc(){return new zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ul(),fragmentShader:`

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
		`,blending:ei,depthTest:!1,depthWrite:!1})}function cc(){return new zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ul(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function ul(){return`

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
	`}function mg(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===sa||l===ra,h=l===ts||l===es;if(c||h){let d=t.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new oc(i)),d=c?e.fromEquirectangular(a,d):e.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),d.texture;if(d!==void 0)return d.texture;{const f=a.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new oc(i)),d=c?e.fromEquirectangular(a):e.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,t.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function gg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ms("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function vg(i,t,e,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);for(const p in u.morphAttributes){const g=u.morphAttributes[p];for(let m=0,v=g.length;m<v;m++)t.remove(g[m])}u.removeEventListener("dispose",o),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const p in u)t.update(u[p],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const p in f){const g=f[p];for(let m=0,v=g.length;m<v;m++)t.update(g[m],i.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,p=d.attributes.position;let g=0;if(f!==null){const _=f.array;g=f.version;for(let M=0,x=_.length;M<x;M+=3){const I=_[M+0],T=_[M+1],R=_[M+2];u.push(I,T,T,R,R,I)}}else if(p!==void 0){const _=p.array;g=p.version;for(let M=0,x=_.length/3-1;M<x;M+=3){const I=M+0,T=M+1,R=M+2;u.push(I,T,T,R,R,I)}}else return;const m=new(Xh(u)?Jh:Yh)(u,1);m.version=g;const v=r.get(d);v&&t.remove(v),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:a,update:l,getWireframeAttribute:h}}function _g(i,t,e){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,f){i.drawElements(n,f,r,u*o),e.update(f,n,1)}function c(u,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,u*o,p),e.update(f,n,p))}function h(u,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,p);let m=0;for(let v=0;v<p;v++)m+=f[v];e.update(m,n,1)}function d(u,f,p,g){if(p===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<u.length;v++)c(u[v]/o,f[v],g[v]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,g,0,p);let v=0;for(let _=0;_<p;_++)v+=f[_]*g[_];e.update(v,n,1)}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function xg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Mg(i,t,e){const n=new WeakMap,s=new le;function r(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let S=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",S)};u!==void 0&&u.texture.dispose();const f=a.morphAttributes.position!==void 0,p=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],v=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let M=0;f===!0&&(M=1),p===!0&&(M=2),g===!0&&(M=3);let x=a.attributes.position.count*M,I=1;x>t.maxTextureSize&&(I=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const T=new Float32Array(x*I*4*d),R=new jh(T,x,I,d);R.type=Nn,R.needsUpdate=!0;const P=M*4;for(let y=0;y<d;y++){const A=m[y],V=v[y],F=_[y],k=x*I*4*y;for(let j=0;j<A.count;j++){const G=j*P;f===!0&&(s.fromBufferAttribute(A,j),T[k+G+0]=s.x,T[k+G+1]=s.y,T[k+G+2]=s.z,T[k+G+3]=0),p===!0&&(s.fromBufferAttribute(V,j),T[k+G+4]=s.x,T[k+G+5]=s.y,T[k+G+6]=s.z,T[k+G+7]=0),g===!0&&(s.fromBufferAttribute(F,j),T[k+G+8]=s.x,T[k+G+9]=s.y,T[k+G+10]=s.z,T[k+G+11]=F.itemSize===4?s.w:1)}}u={count:d,texture:R,size:new mt(x,I)},n.set(a,u),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let f=0;for(let g=0;g<c.length;g++)f+=c[g];const p=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function yg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:o}}class eu extends Ge{constructor(t,e,n,s,r,o,a,l,c,h=Zi){if(h!==Zi&&h!==is)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Zi&&(n=Si),n===void 0&&h===is&&(n=ns),super(null,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:fn,this.minFilter=l!==void 0?l:fn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const nu=new Ge,hc=new eu(1,1),iu=new jh,su=new lf,ru=new Qh,uc=[],dc=[],fc=new Float32Array(16),pc=new Float32Array(9),mc=new Float32Array(4);function us(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=uc[s];if(r===void 0&&(r=new Float32Array(s),uc[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function be(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ee(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Yr(i,t){let e=dc[t];e===void 0&&(e=new Int32Array(t),dc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Sg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function bg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2fv(this.addr,t),Ee(e,t)}}function Eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(be(e,t))return;i.uniform3fv(this.addr,t),Ee(e,t)}}function wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4fv(this.addr,t),Ee(e,t)}}function Ag(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;mc.set(n),i.uniformMatrix2fv(this.addr,!1,mc),Ee(e,n)}}function Tg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;pc.set(n),i.uniformMatrix3fv(this.addr,!1,pc),Ee(e,n)}}function Cg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(be(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ee(e,t)}else{if(be(e,n))return;fc.set(n),i.uniformMatrix4fv(this.addr,!1,fc),Ee(e,n)}}function Rg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Lg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2iv(this.addr,t),Ee(e,t)}}function Pg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3iv(this.addr,t),Ee(e,t)}}function Dg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4iv(this.addr,t),Ee(e,t)}}function Ig(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ug(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(be(e,t))return;i.uniform2uiv(this.addr,t),Ee(e,t)}}function Ng(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(be(e,t))return;i.uniform3uiv(this.addr,t),Ee(e,t)}}function Fg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(be(e,t))return;i.uniform4uiv(this.addr,t),Ee(e,t)}}function Og(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(hc.compareFunction=Wh,r=hc):r=nu,e.setTexture2D(t||r,s)}function Bg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||su,s)}function zg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ru,s)}function kg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||iu,s)}function Vg(i){switch(i){case 5126:return Sg;case 35664:return bg;case 35665:return Eg;case 35666:return wg;case 35674:return Ag;case 35675:return Tg;case 35676:return Cg;case 5124:case 35670:return Rg;case 35667:case 35671:return Lg;case 35668:case 35672:return Pg;case 35669:case 35673:return Dg;case 5125:return Ig;case 36294:return Ug;case 36295:return Ng;case 36296:return Fg;case 35678:case 36198:case 36298:case 36306:case 35682:return Og;case 35679:case 36299:case 36307:return Bg;case 35680:case 36300:case 36308:case 36293:return zg;case 36289:case 36303:case 36311:case 36292:return kg}}function Gg(i,t){i.uniform1fv(this.addr,t)}function Hg(i,t){const e=us(t,this.size,2);i.uniform2fv(this.addr,e)}function Wg(i,t){const e=us(t,this.size,3);i.uniform3fv(this.addr,e)}function Xg(i,t){const e=us(t,this.size,4);i.uniform4fv(this.addr,e)}function $g(i,t){const e=us(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function jg(i,t){const e=us(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function qg(i,t){const e=us(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Yg(i,t){i.uniform1iv(this.addr,t)}function Jg(i,t){i.uniform2iv(this.addr,t)}function Zg(i,t){i.uniform3iv(this.addr,t)}function Kg(i,t){i.uniform4iv(this.addr,t)}function Qg(i,t){i.uniform1uiv(this.addr,t)}function tv(i,t){i.uniform2uiv(this.addr,t)}function ev(i,t){i.uniform3uiv(this.addr,t)}function nv(i,t){i.uniform4uiv(this.addr,t)}function iv(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||nu,r[o])}function sv(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||su,r[o])}function rv(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||ru,r[o])}function ov(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);be(n,r)||(i.uniform1iv(this.addr,r),Ee(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||iu,r[o])}function av(i){switch(i){case 5126:return Gg;case 35664:return Hg;case 35665:return Wg;case 35666:return Xg;case 35674:return $g;case 35675:return jg;case 35676:return qg;case 5124:case 35670:return Yg;case 35667:case 35671:return Jg;case 35668:case 35672:return Zg;case 35669:case 35673:return Kg;case 5125:return Qg;case 36294:return tv;case 36295:return ev;case 36296:return nv;case 35678:case 36198:case 36298:case 36306:case 35682:return iv;case 35679:case 36299:case 36307:return sv;case 35680:case 36300:case 36308:case 36293:return rv;case 36289:case 36303:case 36311:case 36292:return ov}}class lv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Vg(e.type)}}class cv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=av(e.type)}}class hv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Co=/(\w+)(\])?(\[|\.)?/g;function gc(i,t){i.seq.push(t),i.map[t.id]=t}function uv(i,t,e){const n=i.name,s=n.length;for(Co.lastIndex=0;;){const r=Co.exec(n),o=Co.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){gc(e,c===void 0?new lv(a,i,t):new cv(a,i,t));break}else{let d=e.map[a];d===void 0&&(d=new hv(a),gc(e,d)),e=d}}}class Dr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);uv(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function vc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const dv=37297;let fv=0;function pv(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const _c=new Vt;function mv(i){Zt._getMatrix(_c,Zt.workingColorSpace,i);const t=`mat3( ${_c.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(i)){case jr:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function xc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+pv(i.getShaderSource(t),o)}else return s}function gv(i,t){const e=mv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function vv(i,t){let e;switch(t){case xd:e="Linear";break;case Md:e="Reinhard";break;case yd:e="Cineon";break;case Sd:e="ACESFilmic";break;case Ed:e="AgX";break;case wd:e="Neutral";break;case bd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const dr=new D;function _v(){Zt.getLuminanceCoefficients(dr);const i=dr.x.toFixed(4),t=dr.y.toFixed(4),e=dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ys).join(`
`)}function Mv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function yv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function ys(i){return i!==""}function Mc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function yc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Sv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Na(i){return i.replace(Sv,Ev)}const bv=new Map;function Ev(i,t){let e=Ht[t];if(e===void 0){const n=bv.get(t);if(n!==void 0)e=Ht[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Na(e)}const wv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Sc(i){return i.replace(wv,Av)}function Av(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function bc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Tv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Lh?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ku?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Dn&&(t="SHADOWMAP_TYPE_VSM"),t}function Cv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ts:case es:t="ENVMAP_TYPE_CUBE";break;case $r:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Rv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case es:t="ENVMAP_MODE_REFRACTION";break}return t}function Lv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ph:t="ENVMAP_BLENDING_MULTIPLY";break;case vd:t="ENVMAP_BLENDING_MIX";break;case _d:t="ENVMAP_BLENDING_ADD";break}return t}function Pv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Dv(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=Tv(e),c=Cv(e),h=Rv(e),d=Lv(e),u=Pv(e),f=xv(e),p=Mv(r),g=s.createProgram();let m,v,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ys).join(`
`),m.length>0&&(m+=`
`),v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ys).join(`
`),v.length>0&&(v+=`
`)):(m=[bc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ys).join(`
`),v=[bc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ni?"#define TONE_MAPPING":"",e.toneMapping!==ni?Ht.tonemapping_pars_fragment:"",e.toneMapping!==ni?vv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,gv("linearToOutputTexel",e.outputColorSpace),_v(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ys).join(`
`)),o=Na(o),o=Mc(o,e),o=yc(o,e),a=Na(a),a=Mc(a,e),a=yc(a,e),o=Sc(o),a=Sc(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,v=["#define varying in",e.glslVersion===Nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=_+m+o,x=_+v+a,I=vc(s,s.VERTEX_SHADER,M),T=vc(s,s.FRAGMENT_SHADER,x);s.attachShader(g,I),s.attachShader(g,T),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function R(A){if(i.debug.checkShaderErrors){const V=s.getProgramInfoLog(g).trim(),F=s.getShaderInfoLog(I).trim(),k=s.getShaderInfoLog(T).trim();let j=!0,G=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,I,T);else{const q=xc(s,I,"vertex"),W=xc(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+V+`
`+q+`
`+W)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(F===""||k==="")&&(G=!1);G&&(A.diagnostics={runnable:j,programLog:V,vertexShader:{log:F,prefix:m},fragmentShader:{log:k,prefix:v}})}s.deleteShader(I),s.deleteShader(T),P=new Dr(s,g),S=yv(s,g)}let P;this.getUniforms=function(){return P===void 0&&R(this),P};let S;this.getAttributes=function(){return S===void 0&&R(this),S};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(g,dv)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=fv++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=I,this.fragmentShader=T,this}let Iv=0;class Uv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Nv(t),e.set(t,n)),n}}class Nv{constructor(t){this.id=Iv++,this.code=t,this.usedTimes=0}}function Fv(i,t,e,n,s,r,o){const a=new al,l=new Uv,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,y,A,V,F){const k=V.fog,j=F.geometry,G=S.isMeshStandardMaterial?V.environment:null,q=(S.isMeshStandardMaterial?e:t).get(S.envMap||G),W=q&&q.mapping===$r?q.image.height:null,st=p[S.type];S.precision!==null&&(f=s.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const rt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,dt=rt!==void 0?rt.length:0;let Ut=0;j.morphAttributes.position!==void 0&&(Ut=1),j.morphAttributes.normal!==void 0&&(Ut=2),j.morphAttributes.color!==void 0&&(Ut=3);let Wt,U,J,ft;if(st){const ne=$e[st];Wt=ne.vertexShader,U=ne.fragmentShader}else Wt=S.vertexShader,U=S.fragmentShader,l.update(S),J=l.getVertexShaderID(S),ft=l.getFragmentShaderID(S);const K=i.getRenderTarget(),Lt=i.state.buffers.depth.getReversed(),It=F.isInstancedMesh===!0,wt=F.isBatchedMesh===!0,Xt=!!S.map,Q=!!S.matcap,lt=!!q,L=!!S.aoMap,at=!!S.lightMap,nt=!!S.bumpMap,Et=!!S.normalMap,ut=!!S.displacementMap,Nt=!!S.emissiveMap,bt=!!S.metalnessMap,w=!!S.roughnessMap,b=S.anisotropy>0,H=S.clearcoat>0,Z=S.dispersion>0,et=S.iridescence>0,O=S.sheen>0,gt=S.transmission>0,ht=b&&!!S.anisotropyMap,_t=H&&!!S.clearcoatMap,Ft=H&&!!S.clearcoatNormalMap,it=H&&!!S.clearcoatRoughnessMap,vt=et&&!!S.iridescenceMap,Dt=et&&!!S.iridescenceThicknessMap,Ot=O&&!!S.sheenColorMap,At=O&&!!S.sheenRoughnessMap,Jt=!!S.specularMap,Gt=!!S.specularColorMap,ce=!!S.specularIntensityMap,N=gt&&!!S.transmissionMap,xt=gt&&!!S.thicknessMap,Y=!!S.gradientMap,tt=!!S.alphaMap,St=S.alphaTest>0,Mt=!!S.alphaHash,zt=!!S.extensions;let _e=ni;S.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&(_e=i.toneMapping);const Ne={shaderID:st,shaderType:S.type,shaderName:S.name,vertexShader:Wt,fragmentShader:U,defines:S.defines,customVertexShaderID:J,customFragmentShaderID:ft,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:wt,batchingColor:wt&&F._colorsTexture!==null,instancing:It,instancingColor:It&&F.instanceColor!==null,instancingMorph:It&&F.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:K===null?i.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:as,alphaToCoverage:!!S.alphaToCoverage,map:Xt,matcap:Q,envMap:lt,envMapMode:lt&&q.mapping,envMapCubeUVHeight:W,aoMap:L,lightMap:at,bumpMap:nt,normalMap:Et,displacementMap:u&&ut,emissiveMap:Nt,normalMapObjectSpace:Et&&S.normalMapType===Rd,normalMapTangentSpace:Et&&S.normalMapType===Hh,metalnessMap:bt,roughnessMap:w,anisotropy:b,anisotropyMap:ht,clearcoat:H,clearcoatMap:_t,clearcoatNormalMap:Ft,clearcoatRoughnessMap:it,dispersion:Z,iridescence:et,iridescenceMap:vt,iridescenceThicknessMap:Dt,sheen:O,sheenColorMap:Ot,sheenRoughnessMap:At,specularMap:Jt,specularColorMap:Gt,specularIntensityMap:ce,transmission:gt,transmissionMap:N,thicknessMap:xt,gradientMap:Y,opaque:S.transparent===!1&&S.blending===Ji&&S.alphaToCoverage===!1,alphaMap:tt,alphaTest:St,alphaHash:Mt,combine:S.combine,mapUv:Xt&&g(S.map.channel),aoMapUv:L&&g(S.aoMap.channel),lightMapUv:at&&g(S.lightMap.channel),bumpMapUv:nt&&g(S.bumpMap.channel),normalMapUv:Et&&g(S.normalMap.channel),displacementMapUv:ut&&g(S.displacementMap.channel),emissiveMapUv:Nt&&g(S.emissiveMap.channel),metalnessMapUv:bt&&g(S.metalnessMap.channel),roughnessMapUv:w&&g(S.roughnessMap.channel),anisotropyMapUv:ht&&g(S.anisotropyMap.channel),clearcoatMapUv:_t&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:Ft&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:Dt&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ot&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:At&&g(S.sheenRoughnessMap.channel),specularMapUv:Jt&&g(S.specularMap.channel),specularColorMapUv:Gt&&g(S.specularColorMap.channel),specularIntensityMapUv:ce&&g(S.specularIntensityMap.channel),transmissionMapUv:N&&g(S.transmissionMap.channel),thicknessMapUv:xt&&g(S.thicknessMap.channel),alphaMapUv:tt&&g(S.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Et||b),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!j.attributes.uv&&(Xt||tt),fog:!!k,useFog:S.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Lt,skinning:F.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:dt,morphTextureStride:Ut,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:_e,decodeVideoTexture:Xt&&S.map.isVideoTexture===!0&&Zt.getTransfer(S.map.colorSpace)===re,decodeVideoTextureEmissive:Nt&&S.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(S.emissiveMap.colorSpace)===re,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===cn,flipSided:S.side===je,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:zt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&S.extensions.multiDraw===!0||wt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function v(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const A in S.defines)y.push(A),y.push(S.defines[A]);return S.isRawShaderMaterial===!1&&(_(y,S),M(y,S),y.push(i.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function _(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function M(S,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),S.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),S.push(a.mask)}function x(S){const y=p[S.type];let A;if(y){const V=$e[y];A=ll.clone(V.uniforms)}else A=S.uniforms;return A}function I(S,y){let A;for(let V=0,F=h.length;V<F;V++){const k=h[V];if(k.cacheKey===y){A=k,++A.usedTimes;break}}return A===void 0&&(A=new Dv(i,y,S,r),h.push(A)),A}function T(S){if(--S.usedTimes===0){const y=h.indexOf(S);h[y]=h[h.length-1],h.pop(),S.destroy()}}function R(S){l.remove(S)}function P(){l.dispose()}return{getParameters:m,getProgramCacheKey:v,getUniforms:x,acquireProgram:I,releaseProgram:T,releaseShaderCache:R,programs:h,dispose:P}}function Ov(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Bv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ec(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function wc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(d,u,f,p,g,m){let v=i[t];return v===void 0?(v={id:d.id,object:d,geometry:u,material:f,groupOrder:p,renderOrder:d.renderOrder,z:g,group:m},i[t]=v):(v.id=d.id,v.object=d,v.geometry=u,v.material=f,v.groupOrder=p,v.renderOrder=d.renderOrder,v.z=g,v.group=m),t++,v}function a(d,u,f,p,g,m){const v=o(d,u,f,p,g,m);f.transmission>0?n.push(v):f.transparent===!0?s.push(v):e.push(v)}function l(d,u,f,p,g,m){const v=o(d,u,f,p,g,m);f.transmission>0?n.unshift(v):f.transparent===!0?s.unshift(v):e.unshift(v)}function c(d,u){e.length>1&&e.sort(d||Bv),n.length>1&&n.sort(u||Ec),s.length>1&&s.sort(u||Ec)}function h(){for(let d=t,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:h,sort:c}}function zv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new wc,i.set(n,[o])):s>=r.length?(o=new wc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function kv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new jt};break;case"SpotLight":e={position:new D,direction:new D,color:new jt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new jt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new jt,groundColor:new jt};break;case"RectAreaLight":e={color:new jt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function Vv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Gv=0;function Hv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Wv(i){const t=new kv,e=Vv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);const s=new D,r=new se,o=new se;function a(c){let h=0,d=0,u=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,p=0,g=0,m=0,v=0,_=0,M=0,x=0,I=0,T=0,R=0;c.sort(Hv);for(let S=0,y=c.length;S<y;S++){const A=c[S],V=A.color,F=A.intensity,k=A.distance,j=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=V.r*F,d+=V.g*F,u+=V.b*F;else if(A.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(A.sh.coefficients[G],F);R++}else if(A.isDirectionalLight){const G=t.get(A);if(G.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const q=A.shadow,W=e.get(A);W.shadowIntensity=q.intensity,W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=A.shadow.matrix,_++}n.directional[f]=G,f++}else if(A.isSpotLight){const G=t.get(A);G.position.setFromMatrixPosition(A.matrixWorld),G.color.copy(V).multiplyScalar(F),G.distance=k,G.coneCos=Math.cos(A.angle),G.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),G.decay=A.decay,n.spot[g]=G;const q=A.shadow;if(A.map&&(n.spotLightMap[I]=A.map,I++,q.updateMatrices(A),A.castShadow&&T++),n.spotLightMatrix[g]=q.matrix,A.castShadow){const W=e.get(A);W.shadowIntensity=q.intensity,W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,n.spotShadow[g]=W,n.spotShadowMap[g]=j,x++}g++}else if(A.isRectAreaLight){const G=t.get(A);G.color.copy(V).multiplyScalar(F),G.halfWidth.set(A.width*.5,0,0),G.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=G,m++}else if(A.isPointLight){const G=t.get(A);if(G.color.copy(A.color).multiplyScalar(A.intensity),G.distance=A.distance,G.decay=A.decay,A.castShadow){const q=A.shadow,W=e.get(A);W.shadowIntensity=q.intensity,W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,W.shadowCameraNear=q.camera.near,W.shadowCameraFar=q.camera.far,n.pointShadow[p]=W,n.pointShadowMap[p]=j,n.pointShadowMatrix[p]=A.shadow.matrix,M++}n.point[p]=G,p++}else if(A.isHemisphereLight){const G=t.get(A);G.skyColor.copy(A.color).multiplyScalar(F),G.groundColor.copy(A.groundColor).multiplyScalar(F),n.hemi[v]=G,v++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=pt.LTC_FLOAT_1,n.rectAreaLTC2=pt.LTC_FLOAT_2):(n.rectAreaLTC1=pt.LTC_HALF_1,n.rectAreaLTC2=pt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const P=n.hash;(P.directionalLength!==f||P.pointLength!==p||P.spotLength!==g||P.rectAreaLength!==m||P.hemiLength!==v||P.numDirectionalShadows!==_||P.numPointShadows!==M||P.numSpotShadows!==x||P.numSpotMaps!==I||P.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=m,n.point.length=p,n.hemi.length=v,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=x+I-T,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,P.directionalLength=f,P.pointLength=p,P.spotLength=g,P.rectAreaLength=m,P.hemiLength=v,P.numDirectionalShadows=_,P.numPointShadows=M,P.numSpotShadows=x,P.numSpotMaps=I,P.numLightProbes=R,n.version=Gv++)}function l(c,h){let d=0,u=0,f=0,p=0,g=0;const m=h.matrixWorldInverse;for(let v=0,_=c.length;v<_;v++){const M=c[v];if(M.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),d++}else if(M.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const x=n.rectArea[p];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),x.halfWidth.set(M.width*.5,0,0),x.halfHeight.set(0,M.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),p++}else if(M.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),u++}else if(M.isHemisphereLight){const x=n.hemi[g];x.direction.setFromMatrixPosition(M.matrixWorld),x.direction.transformDirection(m),g++}}}return{setup:a,setupView:l,state:n}}function Ac(i){const t=new Wv(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function Xv(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new Ac(i),t.set(s,[a])):r>=o.length?(a=new Ac(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class $v extends cs{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Td,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class jv extends cs{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const qv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Yv=`uniform sampler2D shadow_pass;
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
}`;function Jv(i,t,e){let n=new cl;const s=new mt,r=new mt,o=new le,a=new $v({depthPacking:Cd}),l=new jv,c={},h=e.maxTextureSize,d={[si]:je,[je]:si,[cn]:cn},u=new zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new mt},radius:{value:4}},vertexShader:qv,fragmentShader:Yv}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new Re;p.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Te(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Lh;let v=this.type;this.render=function(T,R,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const S=i.getRenderTarget(),y=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),V=i.state;V.setBlending(ei),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const F=v!==Dn&&this.type===Dn,k=v===Dn&&this.type!==Dn;for(let j=0,G=T.length;j<G;j++){const q=T[j],W=q.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const st=W.getFrameExtents();if(s.multiply(st),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/st.x),s.x=r.x*st.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/st.y),s.y=r.y*st.y,W.mapSize.y=r.y)),W.map===null||F===!0||k===!0){const dt=this.type!==Dn?{minFilter:fn,magFilter:fn}:{};W.map!==null&&W.map.dispose(),W.map=new bi(s.x,s.y,dt),W.map.texture.name=q.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const rt=W.getViewportCount();for(let dt=0;dt<rt;dt++){const Ut=W.getViewport(dt);o.set(r.x*Ut.x,r.y*Ut.y,r.x*Ut.z,r.y*Ut.w),V.viewport(o),W.updateMatrices(q,dt),n=W.getFrustum(),x(R,P,W.camera,q,this.type)}W.isPointLightShadow!==!0&&this.type===Dn&&_(W,P),W.needsUpdate=!1}v=this.type,m.needsUpdate=!1,i.setRenderTarget(S,y,A)};function _(T,R){const P=t.update(g);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new bi(s.x,s.y)),u.uniforms.shadow_pass.value=T.map.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,P,u,g,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,P,f,g,null)}function M(T,R,P,S){let y=null;const A=P.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(A!==void 0)y=A;else if(y=P.isPointLight===!0?l:a,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const V=y.uuid,F=R.uuid;let k=c[V];k===void 0&&(k={},c[V]=k);let j=k[F];j===void 0&&(j=y.clone(),k[F]=j,R.addEventListener("dispose",I)),y=j}if(y.visible=R.visible,y.wireframe=R.wireframe,S===Dn?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:d[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,P.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const V=i.properties.get(y);V.light=P}return y}function x(T,R,P,S,y){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===Dn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,T.matrixWorld);const F=t.update(T),k=T.material;if(Array.isArray(k)){const j=F.groups;for(let G=0,q=j.length;G<q;G++){const W=j[G],st=k[W.materialIndex];if(st&&st.visible){const rt=M(T,st,S,y);T.onBeforeShadow(i,T,R,P,F,rt,W),i.renderBufferDirect(P,null,F,rt,T,W),T.onAfterShadow(i,T,R,P,F,rt,W)}}}else if(k.visible){const j=M(T,k,S,y);T.onBeforeShadow(i,T,R,P,F,j,null),i.renderBufferDirect(P,null,F,j,T,null),T.onAfterShadow(i,T,R,P,F,j,null)}}const V=T.children;for(let F=0,k=V.length;F<k;F++)x(V[F],R,P,S,y)}function I(T){T.target.removeEventListener("dispose",I);for(const P in c){const S=c[P],y=T.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}const Zv={[Zo]:Ko,[Qo]:na,[ta]:ia,[Qi]:ea,[Ko]:Zo,[na]:Qo,[ia]:ta,[ea]:Qi};function Kv(i,t){function e(){let N=!1;const xt=new le;let Y=null;const tt=new le(0,0,0,0);return{setMask:function(St){Y!==St&&!N&&(i.colorMask(St,St,St,St),Y=St)},setLocked:function(St){N=St},setClear:function(St,Mt,zt,_e,Ne){Ne===!0&&(St*=_e,Mt*=_e,zt*=_e),xt.set(St,Mt,zt,_e),tt.equals(xt)===!1&&(i.clearColor(St,Mt,zt,_e),tt.copy(xt))},reset:function(){N=!1,Y=null,tt.set(-1,0,0,0)}}}function n(){let N=!1,xt=!1,Y=null,tt=null,St=null;return{setReversed:function(Mt){if(xt!==Mt){const zt=t.get("EXT_clip_control");xt?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT);const _e=St;St=null,this.setClear(_e)}xt=Mt},getReversed:function(){return xt},setTest:function(Mt){Mt?K(i.DEPTH_TEST):Lt(i.DEPTH_TEST)},setMask:function(Mt){Y!==Mt&&!N&&(i.depthMask(Mt),Y=Mt)},setFunc:function(Mt){if(xt&&(Mt=Zv[Mt]),tt!==Mt){switch(Mt){case Zo:i.depthFunc(i.NEVER);break;case Ko:i.depthFunc(i.ALWAYS);break;case Qo:i.depthFunc(i.LESS);break;case Qi:i.depthFunc(i.LEQUAL);break;case ta:i.depthFunc(i.EQUAL);break;case ea:i.depthFunc(i.GEQUAL);break;case na:i.depthFunc(i.GREATER);break;case ia:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}tt=Mt}},setLocked:function(Mt){N=Mt},setClear:function(Mt){St!==Mt&&(xt&&(Mt=1-Mt),i.clearDepth(Mt),St=Mt)},reset:function(){N=!1,Y=null,tt=null,St=null,xt=!1}}}function s(){let N=!1,xt=null,Y=null,tt=null,St=null,Mt=null,zt=null,_e=null,Ne=null;return{setTest:function(ne){N||(ne?K(i.STENCIL_TEST):Lt(i.STENCIL_TEST))},setMask:function(ne){xt!==ne&&!N&&(i.stencilMask(ne),xt=ne)},setFunc:function(ne,en,wn){(Y!==ne||tt!==en||St!==wn)&&(i.stencilFunc(ne,en,wn),Y=ne,tt=en,St=wn)},setOp:function(ne,en,wn){(Mt!==ne||zt!==en||_e!==wn)&&(i.stencilOp(ne,en,wn),Mt=ne,zt=en,_e=wn)},setLocked:function(ne){N=ne},setClear:function(ne){Ne!==ne&&(i.clearStencil(ne),Ne=ne)},reset:function(){N=!1,xt=null,Y=null,tt=null,St=null,Mt=null,zt=null,_e=null,Ne=null}}}const r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],p=null,g=!1,m=null,v=null,_=null,M=null,x=null,I=null,T=null,R=new jt(0,0,0),P=0,S=!1,y=null,A=null,V=null,F=null,k=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,q=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(W)[1]),G=q>=1):W.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),G=q>=2);let st=null,rt={};const dt=i.getParameter(i.SCISSOR_BOX),Ut=i.getParameter(i.VIEWPORT),Wt=new le().fromArray(dt),U=new le().fromArray(Ut);function J(N,xt,Y,tt){const St=new Uint8Array(4),Mt=i.createTexture();i.bindTexture(N,Mt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let zt=0;zt<Y;zt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(xt,0,i.RGBA,1,1,tt,0,i.RGBA,i.UNSIGNED_BYTE,St):i.texImage2D(xt+zt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,St);return Mt}const ft={};ft[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),ft[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ft[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ft[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),K(i.DEPTH_TEST),o.setFunc(Qi),nt(!1),Et(Ll),K(i.CULL_FACE),L(ei);function K(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Lt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function It(N,xt){return d[N]!==xt?(i.bindFramebuffer(N,xt),d[N]=xt,N===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=xt),N===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=xt),!0):!1}function wt(N,xt){let Y=f,tt=!1;if(N){Y=u.get(xt),Y===void 0&&(Y=[],u.set(xt,Y));const St=N.textures;if(Y.length!==St.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let Mt=0,zt=St.length;Mt<zt;Mt++)Y[Mt]=i.COLOR_ATTACHMENT0+Mt;Y.length=St.length,tt=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,tt=!0);tt&&i.drawBuffers(Y)}function Xt(N){return p!==N?(i.useProgram(N),p=N,!0):!1}const Q={[mi]:i.FUNC_ADD,[td]:i.FUNC_SUBTRACT,[ed]:i.FUNC_REVERSE_SUBTRACT};Q[nd]=i.MIN,Q[id]=i.MAX;const lt={[sd]:i.ZERO,[rd]:i.ONE,[od]:i.SRC_COLOR,[Yo]:i.SRC_ALPHA,[dd]:i.SRC_ALPHA_SATURATE,[hd]:i.DST_COLOR,[ld]:i.DST_ALPHA,[ad]:i.ONE_MINUS_SRC_COLOR,[Jo]:i.ONE_MINUS_SRC_ALPHA,[ud]:i.ONE_MINUS_DST_COLOR,[cd]:i.ONE_MINUS_DST_ALPHA,[fd]:i.CONSTANT_COLOR,[pd]:i.ONE_MINUS_CONSTANT_COLOR,[md]:i.CONSTANT_ALPHA,[gd]:i.ONE_MINUS_CONSTANT_ALPHA};function L(N,xt,Y,tt,St,Mt,zt,_e,Ne,ne){if(N===ei){g===!0&&(Lt(i.BLEND),g=!1);return}if(g===!1&&(K(i.BLEND),g=!0),N!==Qu){if(N!==m||ne!==S){if((v!==mi||x!==mi)&&(i.blendEquation(i.FUNC_ADD),v=mi,x=mi),ne)switch(N){case Ji:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pl:i.blendFunc(i.ONE,i.ONE);break;case Dl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Il:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Dl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Il:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,M=null,I=null,T=null,R.set(0,0,0),P=0,m=N,S=ne}return}St=St||xt,Mt=Mt||Y,zt=zt||tt,(xt!==v||St!==x)&&(i.blendEquationSeparate(Q[xt],Q[St]),v=xt,x=St),(Y!==_||tt!==M||Mt!==I||zt!==T)&&(i.blendFuncSeparate(lt[Y],lt[tt],lt[Mt],lt[zt]),_=Y,M=tt,I=Mt,T=zt),(_e.equals(R)===!1||Ne!==P)&&(i.blendColor(_e.r,_e.g,_e.b,Ne),R.copy(_e),P=Ne),m=N,S=!1}function at(N,xt){N.side===cn?Lt(i.CULL_FACE):K(i.CULL_FACE);let Y=N.side===je;xt&&(Y=!Y),nt(Y),N.blending===Ji&&N.transparent===!1?L(ei):L(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);const tt=N.stencilWrite;a.setTest(tt),tt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Nt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?K(i.SAMPLE_ALPHA_TO_COVERAGE):Lt(i.SAMPLE_ALPHA_TO_COVERAGE)}function nt(N){y!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),y=N)}function Et(N){N!==Ju?(K(i.CULL_FACE),N!==A&&(N===Ll?i.cullFace(i.BACK):N===Zu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Lt(i.CULL_FACE),A=N}function ut(N){N!==V&&(G&&i.lineWidth(N),V=N)}function Nt(N,xt,Y){N?(K(i.POLYGON_OFFSET_FILL),(F!==xt||k!==Y)&&(i.polygonOffset(xt,Y),F=xt,k=Y)):Lt(i.POLYGON_OFFSET_FILL)}function bt(N){N?K(i.SCISSOR_TEST):Lt(i.SCISSOR_TEST)}function w(N){N===void 0&&(N=i.TEXTURE0+j-1),st!==N&&(i.activeTexture(N),st=N)}function b(N,xt,Y){Y===void 0&&(st===null?Y=i.TEXTURE0+j-1:Y=st);let tt=rt[Y];tt===void 0&&(tt={type:void 0,texture:void 0},rt[Y]=tt),(tt.type!==N||tt.texture!==xt)&&(st!==Y&&(i.activeTexture(Y),st=Y),i.bindTexture(N,xt||ft[N]),tt.type=N,tt.texture=xt)}function H(){const N=rt[st];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Z(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function et(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function O(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function gt(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ht(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _t(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function it(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function vt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Dt(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ot(N){Wt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Wt.copy(N))}function At(N){U.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),U.copy(N))}function Jt(N,xt){let Y=c.get(xt);Y===void 0&&(Y=new WeakMap,c.set(xt,Y));let tt=Y.get(N);tt===void 0&&(tt=i.getUniformBlockIndex(xt,N.name),Y.set(N,tt))}function Gt(N,xt){const tt=c.get(xt).get(N);l.get(xt)!==tt&&(i.uniformBlockBinding(xt,tt,N.__bindingPointIndex),l.set(xt,tt))}function ce(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},st=null,rt={},d={},u=new WeakMap,f=[],p=null,g=!1,m=null,v=null,_=null,M=null,x=null,I=null,T=null,R=new jt(0,0,0),P=0,S=!1,y=null,A=null,V=null,F=null,k=null,Wt.set(0,0,i.canvas.width,i.canvas.height),U.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:K,disable:Lt,bindFramebuffer:It,drawBuffers:wt,useProgram:Xt,setBlending:L,setMaterial:at,setFlipSided:nt,setCullFace:Et,setLineWidth:ut,setPolygonOffset:Nt,setScissorTest:bt,activeTexture:w,bindTexture:b,unbindTexture:H,compressedTexImage2D:Z,compressedTexImage3D:et,texImage2D:vt,texImage3D:Dt,updateUBOMapping:Jt,uniformBlockBinding:Gt,texStorage2D:Ft,texStorage3D:it,texSubImage2D:O,texSubImage3D:gt,compressedTexSubImage2D:ht,compressedTexSubImage3D:_t,scissor:Ot,viewport:At,reset:ce}}function Tc(i,t,e,n){const s=Qv(n);switch(e){case Fh:return i*t;case Bh:return i*t;case zh:return i*t*2;case kh:return i*t/s.components*s.byteLength;case nl:return i*t/s.components*s.byteLength;case Vh:return i*t*2/s.components*s.byteLength;case il:return i*t*2/s.components*s.byteLength;case Oh:return i*t*3/s.components*s.byteLength;case dn:return i*t*4/s.components*s.byteLength;case sl:return i*t*4/s.components*s.byteLength;case Tr:case Cr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Rr:case Lr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ca:case ua:return Math.max(i,16)*Math.max(t,8)/4;case la:case ha:return Math.max(i,8)*Math.max(t,8)/2;case da:case fa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case pa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ma:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ga:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case va:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case _a:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case xa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Ma:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ya:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Sa:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ba:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ea:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case wa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ta:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ca:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Pr:case Ra:case La:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Gh:case Pa:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Da:case Ia:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Qv(i){switch(i){case Bn:case Ih:return{byteLength:1,components:1};case Us:case Uh:case ks:return{byteLength:2,components:1};case tl:case el:return{byteLength:2,components:4};case Si:case Qa:case Nn:return{byteLength:4,components:1};case Nh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function t0(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new mt,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,b){return f?new OffscreenCanvas(w,b):kr("canvas")}function g(w,b,H){let Z=1;const et=bt(w);if((et.width>H||et.height>H)&&(Z=H/Math.max(et.width,et.height)),Z<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const O=Math.floor(Z*et.width),gt=Math.floor(Z*et.height);d===void 0&&(d=p(O,gt));const ht=b?p(O,gt):d;return ht.width=O,ht.height=gt,ht.getContext("2d").drawImage(w,0,0,O,gt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+O+"x"+gt+")."),ht}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),w;return w}function m(w){return w.generateMipmaps}function v(w){i.generateMipmap(w)}function _(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(w,b,H,Z,et=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let O=b;if(b===i.RED&&(H===i.FLOAT&&(O=i.R32F),H===i.HALF_FLOAT&&(O=i.R16F),H===i.UNSIGNED_BYTE&&(O=i.R8)),b===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(O=i.R8UI),H===i.UNSIGNED_SHORT&&(O=i.R16UI),H===i.UNSIGNED_INT&&(O=i.R32UI),H===i.BYTE&&(O=i.R8I),H===i.SHORT&&(O=i.R16I),H===i.INT&&(O=i.R32I)),b===i.RG&&(H===i.FLOAT&&(O=i.RG32F),H===i.HALF_FLOAT&&(O=i.RG16F),H===i.UNSIGNED_BYTE&&(O=i.RG8)),b===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(O=i.RG8UI),H===i.UNSIGNED_SHORT&&(O=i.RG16UI),H===i.UNSIGNED_INT&&(O=i.RG32UI),H===i.BYTE&&(O=i.RG8I),H===i.SHORT&&(O=i.RG16I),H===i.INT&&(O=i.RG32I)),b===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(O=i.RGB8UI),H===i.UNSIGNED_SHORT&&(O=i.RGB16UI),H===i.UNSIGNED_INT&&(O=i.RGB32UI),H===i.BYTE&&(O=i.RGB8I),H===i.SHORT&&(O=i.RGB16I),H===i.INT&&(O=i.RGB32I)),b===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(O=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(O=i.RGBA16UI),H===i.UNSIGNED_INT&&(O=i.RGBA32UI),H===i.BYTE&&(O=i.RGBA8I),H===i.SHORT&&(O=i.RGBA16I),H===i.INT&&(O=i.RGBA32I)),b===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(O=i.RGB9_E5),b===i.RGBA){const gt=et?jr:Zt.getTransfer(Z);H===i.FLOAT&&(O=i.RGBA32F),H===i.HALF_FLOAT&&(O=i.RGBA16F),H===i.UNSIGNED_BYTE&&(O=gt===re?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(O=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(O=i.RGB5_A1)}return(O===i.R16F||O===i.R32F||O===i.RG16F||O===i.RG32F||O===i.RGBA16F||O===i.RGBA32F)&&t.get("EXT_color_buffer_float"),O}function x(w,b){let H;return w?b===null||b===Si||b===ns?H=i.DEPTH24_STENCIL8:b===Nn?H=i.DEPTH32F_STENCIL8:b===Us&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Si||b===ns?H=i.DEPTH_COMPONENT24:b===Nn?H=i.DEPTH_COMPONENT32F:b===Us&&(H=i.DEPTH_COMPONENT16),H}function I(w,b){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==fn&&w.minFilter!==Mn?Math.log2(Math.max(b.width,b.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?b.mipmaps.length:1}function T(w){const b=w.target;b.removeEventListener("dispose",T),P(b),b.isVideoTexture&&h.delete(b)}function R(w){const b=w.target;b.removeEventListener("dispose",R),y(b)}function P(w){const b=n.get(w);if(b.__webglInit===void 0)return;const H=w.source,Z=u.get(H);if(Z){const et=Z[b.__cacheKey];et.usedTimes--,et.usedTimes===0&&S(w),Object.keys(Z).length===0&&u.delete(H)}n.remove(w)}function S(w){const b=n.get(w);i.deleteTexture(b.__webglTexture);const H=w.source,Z=u.get(H);delete Z[b.__cacheKey],o.memory.textures--}function y(w){const b=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(b.__webglFramebuffer[Z]))for(let et=0;et<b.__webglFramebuffer[Z].length;et++)i.deleteFramebuffer(b.__webglFramebuffer[Z][et]);else i.deleteFramebuffer(b.__webglFramebuffer[Z]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[Z])}else{if(Array.isArray(b.__webglFramebuffer))for(let Z=0;Z<b.__webglFramebuffer.length;Z++)i.deleteFramebuffer(b.__webglFramebuffer[Z]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Z=0;Z<b.__webglColorRenderbuffer.length;Z++)b.__webglColorRenderbuffer[Z]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[Z]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const H=w.textures;for(let Z=0,et=H.length;Z<et;Z++){const O=n.get(H[Z]);O.__webglTexture&&(i.deleteTexture(O.__webglTexture),o.memory.textures--),n.remove(H[Z])}n.remove(w)}let A=0;function V(){A=0}function F(){const w=A;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),A+=1,w}function k(w){const b=[];return b.push(w.wrapS),b.push(w.wrapT),b.push(w.wrapR||0),b.push(w.magFilter),b.push(w.minFilter),b.push(w.anisotropy),b.push(w.internalFormat),b.push(w.format),b.push(w.type),b.push(w.generateMipmaps),b.push(w.premultiplyAlpha),b.push(w.flipY),b.push(w.unpackAlignment),b.push(w.colorSpace),b.join()}function j(w,b){const H=n.get(w);if(w.isVideoTexture&&ut(w),w.isRenderTargetTexture===!1&&w.version>0&&H.__version!==w.version){const Z=w.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{U(H,w,b);return}}e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+b)}function G(w,b){const H=n.get(w);if(w.version>0&&H.__version!==w.version){U(H,w,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+b)}function q(w,b){const H=n.get(w);if(w.version>0&&H.__version!==w.version){U(H,w,b);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+b)}function W(w,b){const H=n.get(w);if(w.version>0&&H.__version!==w.version){J(H,w,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+b)}const st={[oa]:i.REPEAT,[_i]:i.CLAMP_TO_EDGE,[aa]:i.MIRRORED_REPEAT},rt={[fn]:i.NEAREST,[Ad]:i.NEAREST_MIPMAP_NEAREST,[$s]:i.NEAREST_MIPMAP_LINEAR,[Mn]:i.LINEAR,[eo]:i.LINEAR_MIPMAP_NEAREST,[xi]:i.LINEAR_MIPMAP_LINEAR},dt={[Ld]:i.NEVER,[Fd]:i.ALWAYS,[Pd]:i.LESS,[Wh]:i.LEQUAL,[Dd]:i.EQUAL,[Nd]:i.GEQUAL,[Id]:i.GREATER,[Ud]:i.NOTEQUAL};function Ut(w,b){if(b.type===Nn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Mn||b.magFilter===eo||b.magFilter===$s||b.magFilter===xi||b.minFilter===Mn||b.minFilter===eo||b.minFilter===$s||b.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,st[b.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,st[b.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,st[b.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,rt[b.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,rt[b.minFilter]),b.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,dt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===fn||b.minFilter!==$s&&b.minFilter!==xi||b.type===Nn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Wt(w,b){let H=!1;w.__webglInit===void 0&&(w.__webglInit=!0,b.addEventListener("dispose",T));const Z=b.source;let et=u.get(Z);et===void 0&&(et={},u.set(Z,et));const O=k(b);if(O!==w.__cacheKey){et[O]===void 0&&(et[O]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),et[O].usedTimes++;const gt=et[w.__cacheKey];gt!==void 0&&(et[w.__cacheKey].usedTimes--,gt.usedTimes===0&&S(b)),w.__cacheKey=O,w.__webglTexture=et[O].texture}return H}function U(w,b,H){let Z=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Z=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Z=i.TEXTURE_3D);const et=Wt(w,b),O=b.source;e.bindTexture(Z,w.__webglTexture,i.TEXTURE0+H);const gt=n.get(O);if(O.version!==gt.__version||et===!0){e.activeTexture(i.TEXTURE0+H);const ht=Zt.getPrimaries(Zt.workingColorSpace),_t=b.colorSpace===Kn?null:Zt.getPrimaries(b.colorSpace),Ft=b.colorSpace===Kn||ht===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ft);let it=g(b.image,!1,s.maxTextureSize);it=Nt(b,it);const vt=r.convert(b.format,b.colorSpace),Dt=r.convert(b.type);let Ot=M(b.internalFormat,vt,Dt,b.colorSpace,b.isVideoTexture);Ut(Z,b);let At;const Jt=b.mipmaps,Gt=b.isVideoTexture!==!0,ce=gt.__version===void 0||et===!0,N=O.dataReady,xt=I(b,it);if(b.isDepthTexture)Ot=x(b.format===is,b.type),ce&&(Gt?e.texStorage2D(i.TEXTURE_2D,1,Ot,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Ot,it.width,it.height,0,vt,Dt,null));else if(b.isDataTexture)if(Jt.length>0){Gt&&ce&&e.texStorage2D(i.TEXTURE_2D,xt,Ot,Jt[0].width,Jt[0].height);for(let Y=0,tt=Jt.length;Y<tt;Y++)At=Jt[Y],Gt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,At.width,At.height,vt,Dt,At.data):e.texImage2D(i.TEXTURE_2D,Y,Ot,At.width,At.height,0,vt,Dt,At.data);b.generateMipmaps=!1}else Gt?(ce&&e.texStorage2D(i.TEXTURE_2D,xt,Ot,it.width,it.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,it.width,it.height,vt,Dt,it.data)):e.texImage2D(i.TEXTURE_2D,0,Ot,it.width,it.height,0,vt,Dt,it.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Gt&&ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,Ot,Jt[0].width,Jt[0].height,it.depth);for(let Y=0,tt=Jt.length;Y<tt;Y++)if(At=Jt[Y],b.format!==dn)if(vt!==null)if(Gt){if(N)if(b.layerUpdates.size>0){const St=Tc(At.width,At.height,b.format,b.type);for(const Mt of b.layerUpdates){const zt=At.data.subarray(Mt*St/At.data.BYTES_PER_ELEMENT,(Mt+1)*St/At.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,Mt,At.width,At.height,1,vt,zt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,At.width,At.height,it.depth,vt,At.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Ot,At.width,At.height,it.depth,0,At.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Gt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,At.width,At.height,it.depth,vt,Dt,At.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,Ot,At.width,At.height,it.depth,0,vt,Dt,At.data)}else{Gt&&ce&&e.texStorage2D(i.TEXTURE_2D,xt,Ot,Jt[0].width,Jt[0].height);for(let Y=0,tt=Jt.length;Y<tt;Y++)At=Jt[Y],b.format!==dn?vt!==null?Gt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,At.width,At.height,vt,At.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,Ot,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Gt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,At.width,At.height,vt,Dt,At.data):e.texImage2D(i.TEXTURE_2D,Y,Ot,At.width,At.height,0,vt,Dt,At.data)}else if(b.isDataArrayTexture)if(Gt){if(ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,xt,Ot,it.width,it.height,it.depth),N)if(b.layerUpdates.size>0){const Y=Tc(it.width,it.height,b.format,b.type);for(const tt of b.layerUpdates){const St=it.data.subarray(tt*Y/it.data.BYTES_PER_ELEMENT,(tt+1)*Y/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,tt,it.width,it.height,1,vt,Dt,St)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,vt,Dt,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,it.width,it.height,it.depth,0,vt,Dt,it.data);else if(b.isData3DTexture)Gt?(ce&&e.texStorage3D(i.TEXTURE_3D,xt,Ot,it.width,it.height,it.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,vt,Dt,it.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,it.width,it.height,it.depth,0,vt,Dt,it.data);else if(b.isFramebufferTexture){if(ce)if(Gt)e.texStorage2D(i.TEXTURE_2D,xt,Ot,it.width,it.height);else{let Y=it.width,tt=it.height;for(let St=0;St<xt;St++)e.texImage2D(i.TEXTURE_2D,St,Ot,Y,tt,0,vt,Dt,null),Y>>=1,tt>>=1}}else if(Jt.length>0){if(Gt&&ce){const Y=bt(Jt[0]);e.texStorage2D(i.TEXTURE_2D,xt,Ot,Y.width,Y.height)}for(let Y=0,tt=Jt.length;Y<tt;Y++)At=Jt[Y],Gt?N&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,vt,Dt,At):e.texImage2D(i.TEXTURE_2D,Y,Ot,vt,Dt,At);b.generateMipmaps=!1}else if(Gt){if(ce){const Y=bt(it);e.texStorage2D(i.TEXTURE_2D,xt,Ot,Y.width,Y.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,vt,Dt,it)}else e.texImage2D(i.TEXTURE_2D,0,Ot,vt,Dt,it);m(b)&&v(Z),gt.__version=O.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function J(w,b,H){if(b.image.length!==6)return;const Z=Wt(w,b),et=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+H);const O=n.get(et);if(et.version!==O.__version||Z===!0){e.activeTexture(i.TEXTURE0+H);const gt=Zt.getPrimaries(Zt.workingColorSpace),ht=b.colorSpace===Kn?null:Zt.getPrimaries(b.colorSpace),_t=b.colorSpace===Kn||gt===ht?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);const Ft=b.isCompressedTexture||b.image[0].isCompressedTexture,it=b.image[0]&&b.image[0].isDataTexture,vt=[];for(let tt=0;tt<6;tt++)!Ft&&!it?vt[tt]=g(b.image[tt],!0,s.maxCubemapSize):vt[tt]=it?b.image[tt].image:b.image[tt],vt[tt]=Nt(b,vt[tt]);const Dt=vt[0],Ot=r.convert(b.format,b.colorSpace),At=r.convert(b.type),Jt=M(b.internalFormat,Ot,At,b.colorSpace),Gt=b.isVideoTexture!==!0,ce=O.__version===void 0||Z===!0,N=et.dataReady;let xt=I(b,Dt);Ut(i.TEXTURE_CUBE_MAP,b);let Y;if(Ft){Gt&&ce&&e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Jt,Dt.width,Dt.height);for(let tt=0;tt<6;tt++){Y=vt[tt].mipmaps;for(let St=0;St<Y.length;St++){const Mt=Y[St];b.format!==dn?Ot!==null?Gt?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St,0,0,Mt.width,Mt.height,Ot,Mt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St,Jt,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St,0,0,Mt.width,Mt.height,Ot,At,Mt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St,Jt,Mt.width,Mt.height,0,Ot,At,Mt.data)}}}else{if(Y=b.mipmaps,Gt&&ce){Y.length>0&&xt++;const tt=bt(vt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,xt,Jt,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(it){Gt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,vt[tt].width,vt[tt].height,Ot,At,vt[tt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Jt,vt[tt].width,vt[tt].height,0,Ot,At,vt[tt].data);for(let St=0;St<Y.length;St++){const zt=Y[St].image[tt].image;Gt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St+1,0,0,zt.width,zt.height,Ot,At,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St+1,Jt,zt.width,zt.height,0,Ot,At,zt.data)}}else{Gt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Ot,At,vt[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Jt,Ot,At,vt[tt]);for(let St=0;St<Y.length;St++){const Mt=Y[St];Gt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St+1,0,0,Ot,At,Mt.image[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,St+1,Jt,Ot,At,Mt.image[tt])}}}m(b)&&v(i.TEXTURE_CUBE_MAP),O.__version=et.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function ft(w,b,H,Z,et,O){const gt=r.convert(H.format,H.colorSpace),ht=r.convert(H.type),_t=M(H.internalFormat,gt,ht,H.colorSpace),Ft=n.get(b),it=n.get(H);if(it.__renderTarget=b,!Ft.__hasExternalTextures){const vt=Math.max(1,b.width>>O),Dt=Math.max(1,b.height>>O);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,O,_t,vt,Dt,b.depth,0,gt,ht,null):e.texImage2D(et,O,_t,vt,Dt,0,gt,ht,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Et(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,et,it.__webglTexture,0,nt(b)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Z,et,it.__webglTexture,O),e.bindFramebuffer(i.FRAMEBUFFER,null)}function K(w,b,H){if(i.bindRenderbuffer(i.RENDERBUFFER,w),b.depthBuffer){const Z=b.depthTexture,et=Z&&Z.isDepthTexture?Z.type:null,O=x(b.stencilBuffer,et),gt=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ht=nt(b);Et(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ht,O,b.width,b.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ht,O,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,O,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,gt,i.RENDERBUFFER,w)}else{const Z=b.textures;for(let et=0;et<Z.length;et++){const O=Z[et],gt=r.convert(O.format,O.colorSpace),ht=r.convert(O.type),_t=M(O.internalFormat,gt,ht,O.colorSpace),Ft=nt(b);H&&Et(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ft,_t,b.width,b.height):Et(b)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ft,_t,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,_t,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Lt(w,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(b.depthTexture);Z.__renderTarget=b,(!Z.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),j(b.depthTexture,0);const et=Z.__webglTexture,O=nt(b);if(b.depthTexture.format===Zi)Et(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,O):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(b.depthTexture.format===is)Et(b)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,O):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function It(w){const b=n.get(w),H=w.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==w.depthTexture){const Z=w.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Z){const et=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Z.removeEventListener("dispose",et)};Z.addEventListener("dispose",et),b.__depthDisposeCallback=et}b.__boundDepthTexture=Z}if(w.depthTexture&&!b.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Lt(b.__webglFramebuffer,w)}else if(H){b.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[Z]),b.__webglDepthbuffer[Z]===void 0)b.__webglDepthbuffer[Z]=i.createRenderbuffer(),K(b.__webglDepthbuffer[Z],w,!1);else{const et=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,O=b.__webglDepthbuffer[Z];i.bindRenderbuffer(i.RENDERBUFFER,O),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,O)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),K(b.__webglDepthbuffer,w,!1);else{const Z=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,et)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(w,b,H){const Z=n.get(w);b!==void 0&&ft(Z.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&It(w)}function Xt(w){const b=w.texture,H=n.get(w),Z=n.get(b);w.addEventListener("dispose",R);const et=w.textures,O=w.isWebGLCubeRenderTarget===!0,gt=et.length>1;if(gt||(Z.__webglTexture===void 0&&(Z.__webglTexture=i.createTexture()),Z.__version=b.version,o.memory.textures++),O){H.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer[ht]=[];for(let _t=0;_t<b.mipmaps.length;_t++)H.__webglFramebuffer[ht][_t]=i.createFramebuffer()}else H.__webglFramebuffer[ht]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer=[];for(let ht=0;ht<b.mipmaps.length;ht++)H.__webglFramebuffer[ht]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(gt)for(let ht=0,_t=et.length;ht<_t;ht++){const Ft=n.get(et[ht]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=i.createTexture(),o.memory.textures++)}if(w.samples>0&&Et(w)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ht=0;ht<et.length;ht++){const _t=et[ht];H.__webglColorRenderbuffer[ht]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[ht]);const Ft=r.convert(_t.format,_t.colorSpace),it=r.convert(_t.type),vt=M(_t.internalFormat,Ft,it,_t.colorSpace,w.isXRRenderTarget===!0),Dt=nt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Dt,vt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ht,i.RENDERBUFFER,H.__webglColorRenderbuffer[ht])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),K(H.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(O){e.bindTexture(i.TEXTURE_CUBE_MAP,Z.__webglTexture),Ut(i.TEXTURE_CUBE_MAP,b);for(let ht=0;ht<6;ht++)if(b.mipmaps&&b.mipmaps.length>0)for(let _t=0;_t<b.mipmaps.length;_t++)ft(H.__webglFramebuffer[ht][_t],w,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,_t);else ft(H.__webglFramebuffer[ht],w,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);m(b)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(gt){for(let ht=0,_t=et.length;ht<_t;ht++){const Ft=et[ht],it=n.get(Ft);e.bindTexture(i.TEXTURE_2D,it.__webglTexture),Ut(i.TEXTURE_2D,Ft),ft(H.__webglFramebuffer,w,Ft,i.COLOR_ATTACHMENT0+ht,i.TEXTURE_2D,0),m(Ft)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let ht=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ht=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ht,Z.__webglTexture),Ut(ht,b),b.mipmaps&&b.mipmaps.length>0)for(let _t=0;_t<b.mipmaps.length;_t++)ft(H.__webglFramebuffer[_t],w,b,i.COLOR_ATTACHMENT0,ht,_t);else ft(H.__webglFramebuffer,w,b,i.COLOR_ATTACHMENT0,ht,0);m(b)&&v(ht),e.unbindTexture()}w.depthBuffer&&It(w)}function Q(w){const b=w.textures;for(let H=0,Z=b.length;H<Z;H++){const et=b[H];if(m(et)){const O=_(w),gt=n.get(et).__webglTexture;e.bindTexture(O,gt),v(O),e.unbindTexture()}}}const lt=[],L=[];function at(w){if(w.samples>0){if(Et(w)===!1){const b=w.textures,H=w.width,Z=w.height;let et=i.COLOR_BUFFER_BIT;const O=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=n.get(w),ht=b.length>1;if(ht)for(let _t=0;_t<b.length;_t++)e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let _t=0;_t<b.length;_t++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),ht){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,gt.__webglColorRenderbuffer[_t]);const Ft=n.get(b[_t]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ft,0)}i.blitFramebuffer(0,0,H,Z,0,0,H,Z,et,i.NEAREST),l===!0&&(lt.length=0,L.length=0,lt.push(i.COLOR_ATTACHMENT0+_t),w.depthBuffer&&w.resolveDepthBuffer===!1&&(lt.push(O),L.push(O),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,lt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ht)for(let _t=0;_t<b.length;_t++){e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,gt.__webglColorRenderbuffer[_t]);const Ft=n.get(b[_t]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,gt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.TEXTURE_2D,Ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const b=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function nt(w){return Math.min(s.maxSamples,w.samples)}function Et(w){const b=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ut(w){const b=o.render.frame;h.get(w)!==b&&(h.set(w,b),w.update())}function Nt(w,b){const H=w.colorSpace,Z=w.format,et=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||H!==as&&H!==Kn&&(Zt.getTransfer(H)===re?(Z!==dn||et!==Bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),b}function bt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=V,this.setTexture2D=j,this.setTexture2DArray=G,this.setTexture3D=q,this.setTextureCube=W,this.rebindTextures=wt,this.setupRenderTarget=Xt,this.updateRenderTargetMipmap=Q,this.updateMultisampleRenderTarget=at,this.setupDepthRenderbuffer=It,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=Et}function e0(i,t){function e(n,s=Kn){let r;const o=Zt.getTransfer(s);if(n===Bn)return i.UNSIGNED_BYTE;if(n===tl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===el)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Nh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ih)return i.BYTE;if(n===Uh)return i.SHORT;if(n===Us)return i.UNSIGNED_SHORT;if(n===Qa)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===Nn)return i.FLOAT;if(n===ks)return i.HALF_FLOAT;if(n===Fh)return i.ALPHA;if(n===Oh)return i.RGB;if(n===dn)return i.RGBA;if(n===Bh)return i.LUMINANCE;if(n===zh)return i.LUMINANCE_ALPHA;if(n===Zi)return i.DEPTH_COMPONENT;if(n===is)return i.DEPTH_STENCIL;if(n===kh)return i.RED;if(n===nl)return i.RED_INTEGER;if(n===Vh)return i.RG;if(n===il)return i.RG_INTEGER;if(n===sl)return i.RGBA_INTEGER;if(n===Tr||n===Cr||n===Rr||n===Lr)if(o===re)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Tr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Tr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Lr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===la||n===ca||n===ha||n===ua)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===la)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ca)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ha)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ua)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===da||n===fa||n===pa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===da||n===fa)return o===re?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===pa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ma||n===ga||n===va||n===_a||n===xa||n===Ma||n===ya||n===Sa||n===ba||n===Ea||n===wa||n===Aa||n===Ta||n===Ca)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ma)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ga)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===va)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===_a)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ma)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ya)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Sa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ba)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ea)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===wa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Aa)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ta)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ca)return o===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Pr||n===Ra||n===La)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Pr)return o===re?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ra)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===La)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Gh||n===Pa||n===Da||n===Ia)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Pr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Pa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Da)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ia)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ns?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class n0 extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class _n extends Se{constructor(){super(),this.isGroup=!0,this.type="Group"}}const i0={type:"move"};class Ro{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _n,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _n,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _n,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),v=this._getHandJoint(c,g);m!==null&&(v.matrix.fromArray(m.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=m.radius),v.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(i0)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new _n;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const s0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,r0=`
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

}`;class o0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ge,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new zn({vertexShader:s0,fragmentShader:r0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Te(new qr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class a0 extends ls{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null;const g=new o0,m=e.getContextAttributes();let v=null,_=null;const M=[],x=[],I=new mt;let T=null;const R=new Qe;R.viewport=new le;const P=new Qe;P.viewport=new le;const S=[R,P],y=new n0;let A=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let J=M[U];return J===void 0&&(J=new Ro,M[U]=J),J.getTargetRaySpace()},this.getControllerGrip=function(U){let J=M[U];return J===void 0&&(J=new Ro,M[U]=J),J.getGripSpace()},this.getHand=function(U){let J=M[U];return J===void 0&&(J=new Ro,M[U]=J),J.getHandSpace()};function F(U){const J=x.indexOf(U.inputSource);if(J===-1)return;const ft=M[J];ft!==void 0&&(ft.update(U.inputSource,U.frame,c||o),ft.dispatchEvent({type:U.type,data:U.inputSource}))}function k(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",j);for(let U=0;U<M.length;U++){const J=x[U];J!==null&&(x[U]=null,M[U].disconnect(J))}A=null,V=null,g.reset(),t.setRenderTarget(v),f=null,u=null,d=null,s=null,_=null,Wt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(I.width,I.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){a=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",k),s.addEventListener("inputsourceschange",j),m.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(I),s.renderState.layers===void 0){const J={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,J),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new bi(f.framebufferWidth,f.framebufferHeight,{format:dn,type:Bn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let J=null,ft=null,K=null;m.depth&&(K=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=m.stencil?is:Zi,ft=m.stencil?ns:Si);const Lt={colorFormat:e.RGBA8,depthFormat:K,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(Lt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new bi(u.textureWidth,u.textureHeight,{format:dn,type:Bn,depthTexture:new eu(u.textureWidth,u.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Wt.setContext(s),Wt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function j(U){for(let J=0;J<U.removed.length;J++){const ft=U.removed[J],K=x.indexOf(ft);K>=0&&(x[K]=null,M[K].disconnect(ft))}for(let J=0;J<U.added.length;J++){const ft=U.added[J];let K=x.indexOf(ft);if(K===-1){for(let It=0;It<M.length;It++)if(It>=x.length){x.push(ft),K=It;break}else if(x[It]===null){x[It]=ft,K=It;break}if(K===-1)break}const Lt=M[K];Lt&&Lt.connect(ft)}}const G=new D,q=new D;function W(U,J,ft){G.setFromMatrixPosition(J.matrixWorld),q.setFromMatrixPosition(ft.matrixWorld);const K=G.distanceTo(q),Lt=J.projectionMatrix.elements,It=ft.projectionMatrix.elements,wt=Lt[14]/(Lt[10]-1),Xt=Lt[14]/(Lt[10]+1),Q=(Lt[9]+1)/Lt[5],lt=(Lt[9]-1)/Lt[5],L=(Lt[8]-1)/Lt[0],at=(It[8]+1)/It[0],nt=wt*L,Et=wt*at,ut=K/(-L+at),Nt=ut*-L;if(J.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(Nt),U.translateZ(ut),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert(),Lt[10]===-1)U.projectionMatrix.copy(J.projectionMatrix),U.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const bt=wt+ut,w=Xt+ut,b=nt-Nt,H=Et+(K-Nt),Z=Q*Xt/w*bt,et=lt*Xt/w*bt;U.projectionMatrix.makePerspective(b,H,Z,et,bt,w),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}}function st(U,J){J===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(J.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;let J=U.near,ft=U.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(ft=g.depthFar)),y.near=P.near=R.near=J,y.far=P.far=R.far=ft,(A!==y.near||V!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),A=y.near,V=y.far),R.layers.mask=U.layers.mask|2,P.layers.mask=U.layers.mask|4,y.layers.mask=R.layers.mask|P.layers.mask;const K=U.parent,Lt=y.cameras;st(y,K);for(let It=0;It<Lt.length;It++)st(Lt[It],K);Lt.length===2?W(y,R,P):y.projectionMatrix.copy(R.projectionMatrix),rt(U,y,K)};function rt(U,J,ft){ft===null?U.matrix.copy(J.matrixWorld):(U.matrix.copy(ft.matrixWorld),U.matrix.invert(),U.matrix.multiply(J.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(J.projectionMatrix),U.projectionMatrixInverse.copy(J.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Ns*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(U){l=U,u!==null&&(u.fixedFoveation=U),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=U)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(y)};let dt=null;function Ut(U,J){if(h=J.getViewerPose(c||o),p=J,h!==null){const ft=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let K=!1;ft.length!==y.cameras.length&&(y.cameras.length=0,K=!0);for(let It=0;It<ft.length;It++){const wt=ft[It];let Xt=null;if(f!==null)Xt=f.getViewport(wt);else{const lt=d.getViewSubImage(u,wt);Xt=lt.viewport,It===0&&(t.setRenderTargetTextures(_,lt.colorTexture,u.ignoreDepthValues?void 0:lt.depthStencilTexture),t.setRenderTarget(_))}let Q=S[It];Q===void 0&&(Q=new Qe,Q.layers.enable(It),Q.viewport=new le,S[It]=Q),Q.matrix.fromArray(wt.transform.matrix),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.projectionMatrix.fromArray(wt.projectionMatrix),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert(),Q.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),It===0&&(y.matrix.copy(Q.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),K===!0&&y.cameras.push(Q)}const Lt=s.enabledFeatures;if(Lt&&Lt.includes("depth-sensing")){const It=d.getDepthInformation(ft[0]);It&&It.isValid&&It.texture&&g.init(t,It,s.renderState)}}for(let ft=0;ft<M.length;ft++){const K=x[ft],Lt=M[ft];K!==null&&Lt!==void 0&&Lt.update(K,J,c||o)}dt&&dt(U,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),p=null}const Wt=new tu;Wt.setAnimationLoop(Ut),this.setAnimationLoop=function(U){dt=U},this.dispose=function(){}}}const ui=new bn,l0=new se;function c0(i,t){function e(m,v){m.matrixAutoUpdate===!0&&m.updateMatrix(),v.value.copy(m.matrix)}function n(m,v){v.color.getRGB(m.fogColor.value,Zh(i)),v.isFog?(m.fogNear.value=v.near,m.fogFar.value=v.far):v.isFogExp2&&(m.fogDensity.value=v.density)}function s(m,v,_,M,x){v.isMeshBasicMaterial||v.isMeshLambertMaterial?r(m,v):v.isMeshToonMaterial?(r(m,v),d(m,v)):v.isMeshPhongMaterial?(r(m,v),h(m,v)):v.isMeshStandardMaterial?(r(m,v),u(m,v),v.isMeshPhysicalMaterial&&f(m,v,x)):v.isMeshMatcapMaterial?(r(m,v),p(m,v)):v.isMeshDepthMaterial?r(m,v):v.isMeshDistanceMaterial?(r(m,v),g(m,v)):v.isMeshNormalMaterial?r(m,v):v.isLineBasicMaterial?(o(m,v),v.isLineDashedMaterial&&a(m,v)):v.isPointsMaterial?l(m,v,_,M):v.isSpriteMaterial?c(m,v):v.isShadowMaterial?(m.color.value.copy(v.color),m.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(m,v){m.opacity.value=v.opacity,v.color&&m.diffuse.value.copy(v.color),v.emissive&&m.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(m.map.value=v.map,e(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.bumpMap&&(m.bumpMap.value=v.bumpMap,e(v.bumpMap,m.bumpMapTransform),m.bumpScale.value=v.bumpScale,v.side===je&&(m.bumpScale.value*=-1)),v.normalMap&&(m.normalMap.value=v.normalMap,e(v.normalMap,m.normalMapTransform),m.normalScale.value.copy(v.normalScale),v.side===je&&m.normalScale.value.negate()),v.displacementMap&&(m.displacementMap.value=v.displacementMap,e(v.displacementMap,m.displacementMapTransform),m.displacementScale.value=v.displacementScale,m.displacementBias.value=v.displacementBias),v.emissiveMap&&(m.emissiveMap.value=v.emissiveMap,e(v.emissiveMap,m.emissiveMapTransform)),v.specularMap&&(m.specularMap.value=v.specularMap,e(v.specularMap,m.specularMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest);const _=t.get(v),M=_.envMap,x=_.envMapRotation;M&&(m.envMap.value=M,ui.copy(x),ui.x*=-1,ui.y*=-1,ui.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),m.envMapRotation.value.setFromMatrix4(l0.makeRotationFromEuler(ui)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=v.reflectivity,m.ior.value=v.ior,m.refractionRatio.value=v.refractionRatio),v.lightMap&&(m.lightMap.value=v.lightMap,m.lightMapIntensity.value=v.lightMapIntensity,e(v.lightMap,m.lightMapTransform)),v.aoMap&&(m.aoMap.value=v.aoMap,m.aoMapIntensity.value=v.aoMapIntensity,e(v.aoMap,m.aoMapTransform))}function o(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,v.map&&(m.map.value=v.map,e(v.map,m.mapTransform))}function a(m,v){m.dashSize.value=v.dashSize,m.totalSize.value=v.dashSize+v.gapSize,m.scale.value=v.scale}function l(m,v,_,M){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.size.value=v.size*_,m.scale.value=M*.5,v.map&&(m.map.value=v.map,e(v.map,m.uvTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function c(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.rotation.value=v.rotation,v.map&&(m.map.value=v.map,e(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function h(m,v){m.specular.value.copy(v.specular),m.shininess.value=Math.max(v.shininess,1e-4)}function d(m,v){v.gradientMap&&(m.gradientMap.value=v.gradientMap)}function u(m,v){m.metalness.value=v.metalness,v.metalnessMap&&(m.metalnessMap.value=v.metalnessMap,e(v.metalnessMap,m.metalnessMapTransform)),m.roughness.value=v.roughness,v.roughnessMap&&(m.roughnessMap.value=v.roughnessMap,e(v.roughnessMap,m.roughnessMapTransform)),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)}function f(m,v,_){m.ior.value=v.ior,v.sheen>0&&(m.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),m.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(m.sheenColorMap.value=v.sheenColorMap,e(v.sheenColorMap,m.sheenColorMapTransform)),v.sheenRoughnessMap&&(m.sheenRoughnessMap.value=v.sheenRoughnessMap,e(v.sheenRoughnessMap,m.sheenRoughnessMapTransform))),v.clearcoat>0&&(m.clearcoat.value=v.clearcoat,m.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(m.clearcoatMap.value=v.clearcoatMap,e(v.clearcoatMap,m.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,e(v.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(m.clearcoatNormalMap.value=v.clearcoatNormalMap,e(v.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===je&&m.clearcoatNormalScale.value.negate())),v.dispersion>0&&(m.dispersion.value=v.dispersion),v.iridescence>0&&(m.iridescence.value=v.iridescence,m.iridescenceIOR.value=v.iridescenceIOR,m.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(m.iridescenceMap.value=v.iridescenceMap,e(v.iridescenceMap,m.iridescenceMapTransform)),v.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=v.iridescenceThicknessMap,e(v.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),v.transmission>0&&(m.transmission.value=v.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),v.transmissionMap&&(m.transmissionMap.value=v.transmissionMap,e(v.transmissionMap,m.transmissionMapTransform)),m.thickness.value=v.thickness,v.thicknessMap&&(m.thicknessMap.value=v.thicknessMap,e(v.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=v.attenuationDistance,m.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(m.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(m.anisotropyMap.value=v.anisotropyMap,e(v.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=v.specularIntensity,m.specularColor.value.copy(v.specularColor),v.specularColorMap&&(m.specularColorMap.value=v.specularColorMap,e(v.specularColorMap,m.specularColorMapTransform)),v.specularIntensityMap&&(m.specularIntensityMap.value=v.specularIntensityMap,e(v.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,v){v.matcap&&(m.matcap.value=v.matcap)}function g(m,v){const _=t.get(v).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function h0(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,M){const x=M.program;n.uniformBlockBinding(_,x)}function c(_,M){let x=s[_.id];x===void 0&&(p(_),x=h(_),s[_.id]=x,_.addEventListener("dispose",m));const I=M.program;n.updateUBOMapping(_,I);const T=t.render.frame;r[_.id]!==T&&(u(_),r[_.id]=T)}function h(_){const M=d();_.__bindingPointIndex=M;const x=i.createBuffer(),I=_.__size,T=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,I,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,x),x}function d(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const M=s[_.id],x=_.uniforms,I=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,R=x.length;T<R;T++){const P=Array.isArray(x[T])?x[T]:[x[T]];for(let S=0,y=P.length;S<y;S++){const A=P[S];if(f(A,T,S,I)===!0){const V=A.__offset,F=Array.isArray(A.value)?A.value:[A.value];let k=0;for(let j=0;j<F.length;j++){const G=F[j],q=g(G);typeof G=="number"||typeof G=="boolean"?(A.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,V+k,A.__data)):G.isMatrix3?(A.__data[0]=G.elements[0],A.__data[1]=G.elements[1],A.__data[2]=G.elements[2],A.__data[3]=0,A.__data[4]=G.elements[3],A.__data[5]=G.elements[4],A.__data[6]=G.elements[5],A.__data[7]=0,A.__data[8]=G.elements[6],A.__data[9]=G.elements[7],A.__data[10]=G.elements[8],A.__data[11]=0):(G.toArray(A.__data,k),k+=q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(_,M,x,I){const T=_.value,R=M+"_"+x;if(I[R]===void 0)return typeof T=="number"||typeof T=="boolean"?I[R]=T:I[R]=T.clone(),!0;{const P=I[R];if(typeof T=="number"||typeof T=="boolean"){if(P!==T)return I[R]=T,!0}else if(P.equals(T)===!1)return P.copy(T),!0}return!1}function p(_){const M=_.uniforms;let x=0;const I=16;for(let R=0,P=M.length;R<P;R++){const S=Array.isArray(M[R])?M[R]:[M[R]];for(let y=0,A=S.length;y<A;y++){const V=S[y],F=Array.isArray(V.value)?V.value:[V.value];for(let k=0,j=F.length;k<j;k++){const G=F[k],q=g(G),W=x%I,st=W%q.boundary,rt=W+st;x+=st,rt!==0&&I-rt<q.storage&&(x+=I-rt),V.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=x,x+=q.storage}}}const T=x%I;return T>0&&(x+=I-T),_.__size=x,_.__cache={},this}function g(_){const M={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(M.boundary=4,M.storage=4):_.isVector2?(M.boundary=8,M.storage=8):_.isVector3||_.isColor?(M.boundary=16,M.storage=12):_.isVector4?(M.boundary=16,M.storage=16):_.isMatrix3?(M.boundary=48,M.storage=48):_.isMatrix4?(M.boundary=64,M.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),M}function m(_){const M=_.target;M.removeEventListener("dispose",m);const x=o.indexOf(M.__bindingPointIndex);o.splice(x,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function v(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:l,update:c,dispose:v}}class u0{constructor(t={}){const{canvas:e=Qd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const p=new Uint32Array(4),g=new Int32Array(4);let m=null,v=null;const _=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Xe,this.toneMapping=ni,this.toneMappingExposure=1;const x=this;let I=!1,T=0,R=0,P=null,S=-1,y=null;const A=new le,V=new le;let F=null;const k=new jt(0);let j=0,G=e.width,q=e.height,W=1,st=null,rt=null;const dt=new le(0,0,G,q),Ut=new le(0,0,G,q);let Wt=!1;const U=new cl;let J=!1,ft=!1;const K=new se,Lt=new se,It=new D,wt=new le,Xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Q=!1;function lt(){return P===null?W:1}let L=n;function at(E,B){return e.getContext(E,B)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ka}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",St,!1),e.addEventListener("webglcontextcreationerror",Mt,!1),L===null){const B="webgl2";if(L=at(B,E),L===null)throw at(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let nt,Et,ut,Nt,bt,w,b,H,Z,et,O,gt,ht,_t,Ft,it,vt,Dt,Ot,At,Jt,Gt,ce,N;function xt(){nt=new gg(L),nt.init(),Gt=new e0(L,nt),Et=new hg(L,nt,t,Gt),ut=new Kv(L,nt),Et.reverseDepthBuffer&&u&&ut.buffers.depth.setReversed(!0),Nt=new xg(L),bt=new Ov,w=new t0(L,nt,ut,bt,Et,Gt,Nt),b=new dg(x),H=new mg(x),Z=new Af(L),ce=new lg(L,Z),et=new vg(L,Z,Nt,ce),O=new yg(L,et,Z,Nt),Ot=new Mg(L,Et,w),it=new ug(bt),gt=new Fv(x,b,H,nt,Et,ce,it),ht=new c0(x,bt),_t=new zv,Ft=new Xv(nt),Dt=new ag(x,b,H,ut,O,f,l),vt=new Jv(x,O,Et),N=new h0(L,Nt,Et,ut),At=new cg(L,nt,Nt),Jt=new _g(L,nt,Nt),Nt.programs=gt.programs,x.capabilities=Et,x.extensions=nt,x.properties=bt,x.renderLists=_t,x.shadowMap=vt,x.state=ut,x.info=Nt}xt();const Y=new a0(x,L);this.xr=Y,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=nt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=nt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(E){E!==void 0&&(W=E,this.setSize(G,q,!1))},this.getSize=function(E){return E.set(G,q)},this.setSize=function(E,B,X=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=E,q=B,e.width=Math.floor(E*W),e.height=Math.floor(B*W),X===!0&&(e.style.width=E+"px",e.style.height=B+"px"),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(G*W,q*W).floor()},this.setDrawingBufferSize=function(E,B,X){G=E,q=B,W=X,e.width=Math.floor(E*X),e.height=Math.floor(B*X),this.setViewport(0,0,E,B)},this.getCurrentViewport=function(E){return E.copy(A)},this.getViewport=function(E){return E.copy(dt)},this.setViewport=function(E,B,X,$){E.isVector4?dt.set(E.x,E.y,E.z,E.w):dt.set(E,B,X,$),ut.viewport(A.copy(dt).multiplyScalar(W).round())},this.getScissor=function(E){return E.copy(Ut)},this.setScissor=function(E,B,X,$){E.isVector4?Ut.set(E.x,E.y,E.z,E.w):Ut.set(E,B,X,$),ut.scissor(V.copy(Ut).multiplyScalar(W).round())},this.getScissorTest=function(){return Wt},this.setScissorTest=function(E){ut.setScissorTest(Wt=E)},this.setOpaqueSort=function(E){st=E},this.setTransparentSort=function(E){rt=E},this.getClearColor=function(E){return E.copy(Dt.getClearColor())},this.setClearColor=function(){Dt.setClearColor.apply(Dt,arguments)},this.getClearAlpha=function(){return Dt.getClearAlpha()},this.setClearAlpha=function(){Dt.setClearAlpha.apply(Dt,arguments)},this.clear=function(E=!0,B=!0,X=!0){let $=0;if(E){let z=!1;if(P!==null){const ct=P.texture.format;z=ct===sl||ct===il||ct===nl}if(z){const ct=P.texture.type,yt=ct===Bn||ct===Si||ct===Us||ct===ns||ct===tl||ct===el,Tt=Dt.getClearColor(),Ct=Dt.getClearAlpha(),Bt=Tt.r,kt=Tt.g,Rt=Tt.b;yt?(p[0]=Bt,p[1]=kt,p[2]=Rt,p[3]=Ct,L.clearBufferuiv(L.COLOR,0,p)):(g[0]=Bt,g[1]=kt,g[2]=Rt,g[3]=Ct,L.clearBufferiv(L.COLOR,0,g))}else $|=L.COLOR_BUFFER_BIT}B&&($|=L.DEPTH_BUFFER_BIT),X&&($|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",St,!1),e.removeEventListener("webglcontextcreationerror",Mt,!1),_t.dispose(),Ft.dispose(),bt.dispose(),b.dispose(),H.dispose(),O.dispose(),ce.dispose(),N.dispose(),gt.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",yl),Y.removeEventListener("sessionend",Sl),ri.stop()};function tt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function St(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const E=Nt.autoReset,B=vt.enabled,X=vt.autoUpdate,$=vt.needsUpdate,z=vt.type;xt(),Nt.autoReset=E,vt.enabled=B,vt.autoUpdate=X,vt.needsUpdate=$,vt.type=z}function Mt(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function zt(E){const B=E.target;B.removeEventListener("dispose",zt),_e(B)}function _e(E){Ne(E),bt.remove(E)}function Ne(E){const B=bt.get(E).programs;B!==void 0&&(B.forEach(function(X){gt.releaseProgram(X)}),E.isShaderMaterial&&gt.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,X,$,z,ct){B===null&&(B=Xt);const yt=z.isMesh&&z.matrixWorld.determinant()<0,Tt=Bu(E,B,X,$,z);ut.setMaterial($,yt);let Ct=X.index,Bt=1;if($.wireframe===!0){if(Ct=et.getWireframeAttribute(X),Ct===void 0)return;Bt=2}const kt=X.drawRange,Rt=X.attributes.position;let Kt=kt.start*Bt,he=(kt.start+kt.count)*Bt;ct!==null&&(Kt=Math.max(Kt,ct.start*Bt),he=Math.min(he,(ct.start+ct.count)*Bt)),Ct!==null?(Kt=Math.max(Kt,0),he=Math.min(he,Ct.count)):Rt!=null&&(Kt=Math.max(Kt,0),he=Math.min(he,Rt.count));const ue=he-Kt;if(ue<0||ue===1/0)return;ce.setup(z,$,Tt,X,Ct);let He,te=At;if(Ct!==null&&(He=Z.get(Ct),te=Jt,te.setIndex(He)),z.isMesh)$.wireframe===!0?(ut.setLineWidth($.wireframeLinewidth*lt()),te.setMode(L.LINES)):te.setMode(L.TRIANGLES);else if(z.isLine){let Pt=$.linewidth;Pt===void 0&&(Pt=1),ut.setLineWidth(Pt*lt()),z.isLineSegments?te.setMode(L.LINES):z.isLineLoop?te.setMode(L.LINE_LOOP):te.setMode(L.LINE_STRIP)}else z.isPoints?te.setMode(L.POINTS):z.isSprite&&te.setMode(L.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)te.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))te.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Pt=z._multiDrawStarts,An=z._multiDrawCounts,ee=z._multiDrawCount,nn=Ct?Z.get(Ct).bytesPerElement:1,Ri=bt.get($).currentProgram.getUniforms();for(let qe=0;qe<ee;qe++)Ri.setValue(L,"_gl_DrawID",qe),te.render(Pt[qe]/nn,An[qe])}else if(z.isInstancedMesh)te.renderInstances(Kt,ue,z.count);else if(X.isInstancedBufferGeometry){const Pt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,An=Math.min(X.instanceCount,Pt);te.renderInstances(Kt,ue,An)}else te.render(Kt,ue)};function ne(E,B,X){E.transparent===!0&&E.side===cn&&E.forceSinglePass===!1?(E.side=je,E.needsUpdate=!0,Xs(E,B,X),E.side=si,E.needsUpdate=!0,Xs(E,B,X),E.side=cn):Xs(E,B,X)}this.compile=function(E,B,X=null){X===null&&(X=E),v=Ft.get(X),v.init(B),M.push(v),X.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(v.pushLight(z),z.castShadow&&v.pushShadow(z))}),E!==X&&E.traverseVisible(function(z){z.isLight&&z.layers.test(B.layers)&&(v.pushLight(z),z.castShadow&&v.pushShadow(z))}),v.setupLights();const $=new Set;return E.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const ct=z.material;if(ct)if(Array.isArray(ct))for(let yt=0;yt<ct.length;yt++){const Tt=ct[yt];ne(Tt,X,z),$.add(Tt)}else ne(ct,X,z),$.add(ct)}),M.pop(),v=null,$},this.compileAsync=function(E,B,X=null){const $=this.compile(E,B,X);return new Promise(z=>{function ct(){if($.forEach(function(yt){bt.get(yt).currentProgram.isReady()&&$.delete(yt)}),$.size===0){z(E);return}setTimeout(ct,10)}nt.get("KHR_parallel_shader_compile")!==null?ct():setTimeout(ct,10)})};let en=null;function wn(E){en&&en(E)}function yl(){ri.stop()}function Sl(){ri.start()}const ri=new tu;ri.setAnimationLoop(wn),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(E){en=E,Y.setAnimationLoop(E),E===null?ri.stop():ri.start()},Y.addEventListener("sessionstart",yl),Y.addEventListener("sessionend",Sl),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(B),B=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,B,P),v=Ft.get(E,M.length),v.init(B),M.push(v),Lt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),U.setFromProjectionMatrix(Lt),ft=this.localClippingEnabled,J=it.init(this.clippingPlanes,ft),m=_t.get(E,_.length),m.init(),_.push(m),Y.enabled===!0&&Y.isPresenting===!0){const ct=x.xr.getDepthSensingMesh();ct!==null&&Qr(ct,B,-1/0,x.sortObjects)}Qr(E,B,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(st,rt),Q=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,Q&&Dt.addToRenderList(m,E),this.info.render.frame++,J===!0&&it.beginShadows();const X=v.state.shadowsArray;vt.render(X,E,B),J===!0&&it.endShadows(),this.info.autoReset===!0&&this.info.reset();const $=m.opaque,z=m.transmissive;if(v.setupLights(),B.isArrayCamera){const ct=B.cameras;if(z.length>0)for(let yt=0,Tt=ct.length;yt<Tt;yt++){const Ct=ct[yt];El($,z,E,Ct)}Q&&Dt.render(E);for(let yt=0,Tt=ct.length;yt<Tt;yt++){const Ct=ct[yt];bl(m,E,Ct,Ct.viewport)}}else z.length>0&&El($,z,E,B),Q&&Dt.render(E),bl(m,E,B);P!==null&&(w.updateMultisampleRenderTarget(P),w.updateRenderTargetMipmap(P)),E.isScene===!0&&E.onAfterRender(x,E,B),ce.resetDefaultState(),S=-1,y=null,M.pop(),M.length>0?(v=M[M.length-1],J===!0&&it.setGlobalState(x.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function Qr(E,B,X,$){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLight)v.pushLight(E),E.castShadow&&v.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||U.intersectsSprite(E)){$&&wt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Lt);const yt=O.update(E),Tt=E.material;Tt.visible&&m.push(E,yt,Tt,X,wt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||U.intersectsObject(E))){const yt=O.update(E),Tt=E.material;if($&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),wt.copy(E.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),wt.copy(yt.boundingSphere.center)),wt.applyMatrix4(E.matrixWorld).applyMatrix4(Lt)),Array.isArray(Tt)){const Ct=yt.groups;for(let Bt=0,kt=Ct.length;Bt<kt;Bt++){const Rt=Ct[Bt],Kt=Tt[Rt.materialIndex];Kt&&Kt.visible&&m.push(E,yt,Kt,X,wt.z,Rt)}}else Tt.visible&&m.push(E,yt,Tt,X,wt.z,null)}}const ct=E.children;for(let yt=0,Tt=ct.length;yt<Tt;yt++)Qr(ct[yt],B,X,$)}function bl(E,B,X,$){const z=E.opaque,ct=E.transmissive,yt=E.transparent;v.setupLightsView(X),J===!0&&it.setGlobalState(x.clippingPlanes,X),$&&ut.viewport(A.copy($)),z.length>0&&Ws(z,B,X),ct.length>0&&Ws(ct,B,X),yt.length>0&&Ws(yt,B,X),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function El(E,B,X,$){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[$.id]===void 0&&(v.state.transmissionRenderTarget[$.id]=new bi(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?ks:Bn,minFilter:xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace}));const ct=v.state.transmissionRenderTarget[$.id],yt=$.viewport||A;ct.setSize(yt.z,yt.w);const Tt=x.getRenderTarget();x.setRenderTarget(ct),x.getClearColor(k),j=x.getClearAlpha(),j<1&&x.setClearColor(16777215,.5),x.clear(),Q&&Dt.render(X);const Ct=x.toneMapping;x.toneMapping=ni;const Bt=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),v.setupLightsView($),J===!0&&it.setGlobalState(x.clippingPlanes,$),Ws(E,X,$),w.updateMultisampleRenderTarget(ct),w.updateRenderTargetMipmap(ct),nt.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let Rt=0,Kt=B.length;Rt<Kt;Rt++){const he=B[Rt],ue=he.object,He=he.geometry,te=he.material,Pt=he.group;if(te.side===cn&&ue.layers.test($.layers)){const An=te.side;te.side=je,te.needsUpdate=!0,wl(ue,X,$,He,te,Pt),te.side=An,te.needsUpdate=!0,kt=!0}}kt===!0&&(w.updateMultisampleRenderTarget(ct),w.updateRenderTargetMipmap(ct))}x.setRenderTarget(Tt),x.setClearColor(k,j),Bt!==void 0&&($.viewport=Bt),x.toneMapping=Ct}function Ws(E,B,X){const $=B.isScene===!0?B.overrideMaterial:null;for(let z=0,ct=E.length;z<ct;z++){const yt=E[z],Tt=yt.object,Ct=yt.geometry,Bt=$===null?yt.material:$,kt=yt.group;Tt.layers.test(X.layers)&&wl(Tt,B,X,Ct,Bt,kt)}}function wl(E,B,X,$,z,ct){E.onBeforeRender(x,B,X,$,z,ct),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),z.onBeforeRender(x,B,X,$,E,ct),z.transparent===!0&&z.side===cn&&z.forceSinglePass===!1?(z.side=je,z.needsUpdate=!0,x.renderBufferDirect(X,B,$,z,E,ct),z.side=si,z.needsUpdate=!0,x.renderBufferDirect(X,B,$,z,E,ct),z.side=cn):x.renderBufferDirect(X,B,$,z,E,ct),E.onAfterRender(x,B,X,$,z,ct)}function Xs(E,B,X){B.isScene!==!0&&(B=Xt);const $=bt.get(E),z=v.state.lights,ct=v.state.shadowsArray,yt=z.state.version,Tt=gt.getParameters(E,z.state,ct,B,X),Ct=gt.getProgramCacheKey(Tt);let Bt=$.programs;$.environment=E.isMeshStandardMaterial?B.environment:null,$.fog=B.fog,$.envMap=(E.isMeshStandardMaterial?H:b).get(E.envMap||$.environment),$.envMapRotation=$.environment!==null&&E.envMap===null?B.environmentRotation:E.envMapRotation,Bt===void 0&&(E.addEventListener("dispose",zt),Bt=new Map,$.programs=Bt);let kt=Bt.get(Ct);if(kt!==void 0){if($.currentProgram===kt&&$.lightsStateVersion===yt)return Tl(E,Tt),kt}else Tt.uniforms=gt.getUniforms(E),E.onBeforeCompile(Tt,x),kt=gt.acquireProgram(Tt,Ct),Bt.set(Ct,kt),$.uniforms=Tt.uniforms;const Rt=$.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Rt.clippingPlanes=it.uniform),Tl(E,Tt),$.needsLights=ku(E),$.lightsStateVersion=yt,$.needsLights&&(Rt.ambientLightColor.value=z.state.ambient,Rt.lightProbe.value=z.state.probe,Rt.directionalLights.value=z.state.directional,Rt.directionalLightShadows.value=z.state.directionalShadow,Rt.spotLights.value=z.state.spot,Rt.spotLightShadows.value=z.state.spotShadow,Rt.rectAreaLights.value=z.state.rectArea,Rt.ltc_1.value=z.state.rectAreaLTC1,Rt.ltc_2.value=z.state.rectAreaLTC2,Rt.pointLights.value=z.state.point,Rt.pointLightShadows.value=z.state.pointShadow,Rt.hemisphereLights.value=z.state.hemi,Rt.directionalShadowMap.value=z.state.directionalShadowMap,Rt.directionalShadowMatrix.value=z.state.directionalShadowMatrix,Rt.spotShadowMap.value=z.state.spotShadowMap,Rt.spotLightMatrix.value=z.state.spotLightMatrix,Rt.spotLightMap.value=z.state.spotLightMap,Rt.pointShadowMap.value=z.state.pointShadowMap,Rt.pointShadowMatrix.value=z.state.pointShadowMatrix),$.currentProgram=kt,$.uniformsList=null,kt}function Al(E){if(E.uniformsList===null){const B=E.currentProgram.getUniforms();E.uniformsList=Dr.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function Tl(E,B){const X=bt.get(E);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function Bu(E,B,X,$,z){B.isScene!==!0&&(B=Xt),w.resetTextureUnits();const ct=B.fog,yt=$.isMeshStandardMaterial?B.environment:null,Tt=P===null?x.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:as,Ct=($.isMeshStandardMaterial?H:b).get($.envMap||yt),Bt=$.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,kt=!!X.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),Rt=!!X.morphAttributes.position,Kt=!!X.morphAttributes.normal,he=!!X.morphAttributes.color;let ue=ni;$.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(ue=x.toneMapping);const He=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,te=He!==void 0?He.length:0,Pt=bt.get($),An=v.state.lights;if(J===!0&&(ft===!0||E!==y)){const Ze=E===y&&$.id===S;it.setState($,E,Ze)}let ee=!1;$.version===Pt.__version?(Pt.needsLights&&Pt.lightsStateVersion!==An.state.version||Pt.outputColorSpace!==Tt||z.isBatchedMesh&&Pt.batching===!1||!z.isBatchedMesh&&Pt.batching===!0||z.isBatchedMesh&&Pt.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&Pt.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&Pt.instancing===!1||!z.isInstancedMesh&&Pt.instancing===!0||z.isSkinnedMesh&&Pt.skinning===!1||!z.isSkinnedMesh&&Pt.skinning===!0||z.isInstancedMesh&&Pt.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&Pt.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&Pt.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&Pt.instancingMorph===!1&&z.morphTexture!==null||Pt.envMap!==Ct||$.fog===!0&&Pt.fog!==ct||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==it.numPlanes||Pt.numIntersection!==it.numIntersection)||Pt.vertexAlphas!==Bt||Pt.vertexTangents!==kt||Pt.morphTargets!==Rt||Pt.morphNormals!==Kt||Pt.morphColors!==he||Pt.toneMapping!==ue||Pt.morphTargetsCount!==te)&&(ee=!0):(ee=!0,Pt.__version=$.version);let nn=Pt.currentProgram;ee===!0&&(nn=Xs($,B,z));let Ri=!1,qe=!1,ds=!1;const de=nn.getUniforms(),mn=Pt.uniforms;if(ut.useProgram(nn.program)&&(Ri=!0,qe=!0,ds=!0),$.id!==S&&(S=$.id,qe=!0),Ri||y!==E){ut.buffers.depth.getReversed()?(K.copy(E.projectionMatrix),ef(K),nf(K),de.setValue(L,"projectionMatrix",K)):de.setValue(L,"projectionMatrix",E.projectionMatrix),de.setValue(L,"viewMatrix",E.matrixWorldInverse);const Hn=de.map.cameraPosition;Hn!==void 0&&Hn.setValue(L,It.setFromMatrixPosition(E.matrixWorld)),Et.logarithmicDepthBuffer&&de.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&de.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,qe=!0,ds=!0)}if(z.isSkinnedMesh){de.setOptional(L,z,"bindMatrix"),de.setOptional(L,z,"bindMatrixInverse");const Ze=z.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),de.setValue(L,"boneTexture",Ze.boneTexture,w))}z.isBatchedMesh&&(de.setOptional(L,z,"batchingTexture"),de.setValue(L,"batchingTexture",z._matricesTexture,w),de.setOptional(L,z,"batchingIdTexture"),de.setValue(L,"batchingIdTexture",z._indirectTexture,w),de.setOptional(L,z,"batchingColorTexture"),z._colorsTexture!==null&&de.setValue(L,"batchingColorTexture",z._colorsTexture,w));const fs=X.morphAttributes;if((fs.position!==void 0||fs.normal!==void 0||fs.color!==void 0)&&Ot.update(z,X,nn),(qe||Pt.receiveShadow!==z.receiveShadow)&&(Pt.receiveShadow=z.receiveShadow,de.setValue(L,"receiveShadow",z.receiveShadow)),$.isMeshGouraudMaterial&&$.envMap!==null&&(mn.envMap.value=Ct,mn.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),$.isMeshStandardMaterial&&$.envMap===null&&B.environment!==null&&(mn.envMapIntensity.value=B.environmentIntensity),qe&&(de.setValue(L,"toneMappingExposure",x.toneMappingExposure),Pt.needsLights&&zu(mn,ds),ct&&$.fog===!0&&ht.refreshFogUniforms(mn,ct),ht.refreshMaterialUniforms(mn,$,W,q,v.state.transmissionRenderTarget[E.id]),Dr.upload(L,Al(Pt),mn,w)),$.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Dr.upload(L,Al(Pt),mn,w),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&de.setValue(L,"center",z.center),de.setValue(L,"modelViewMatrix",z.modelViewMatrix),de.setValue(L,"normalMatrix",z.normalMatrix),de.setValue(L,"modelMatrix",z.matrixWorld),$.isShaderMaterial||$.isRawShaderMaterial){const Ze=$.uniformsGroups;for(let Hn=0,Wn=Ze.length;Hn<Wn;Hn++){const Cl=Ze[Hn];N.update(Cl,nn),N.bind(Cl,nn)}}return nn}function zu(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function ku(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(E,B,X){bt.get(E.texture).__webglTexture=B,bt.get(E.depthTexture).__webglTexture=X;const $=bt.get(E);$.__hasExternalTextures=!0,$.__autoAllocateDepthBuffer=X===void 0,$.__autoAllocateDepthBuffer||nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),$.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,B){const X=bt.get(E);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,X=0){P=E,T=B,R=X;let $=!0,z=null,ct=!1,yt=!1;if(E){const Ct=bt.get(E);if(Ct.__useDefaultFramebuffer!==void 0)ut.bindFramebuffer(L.FRAMEBUFFER,null),$=!1;else if(Ct.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(Ct.__hasExternalTextures)w.rebindTextures(E,bt.get(E.texture).__webglTexture,bt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Rt=E.depthTexture;if(Ct.__boundDepthTexture!==Rt){if(Rt!==null&&bt.has(Rt)&&(E.width!==Rt.image.width||E.height!==Rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Bt=E.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(yt=!0);const kt=bt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(kt[B])?z=kt[B][X]:z=kt[B],ct=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?z=bt.get(E).__webglMultisampledFramebuffer:Array.isArray(kt)?z=kt[X]:z=kt,A.copy(E.viewport),V.copy(E.scissor),F=E.scissorTest}else A.copy(dt).multiplyScalar(W).floor(),V.copy(Ut).multiplyScalar(W).floor(),F=Wt;if(ut.bindFramebuffer(L.FRAMEBUFFER,z)&&$&&ut.drawBuffers(E,z),ut.viewport(A),ut.scissor(V),ut.setScissorTest(F),ct){const Ct=bt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ct.__webglTexture,X)}else if(yt){const Ct=bt.get(E.texture),Bt=B||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ct.__webglTexture,X||0,Bt)}S=-1},this.readRenderTargetPixels=function(E,B,X,$,z,ct,yt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=bt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&yt!==void 0&&(Tt=Tt[yt]),Tt){ut.bindFramebuffer(L.FRAMEBUFFER,Tt);try{const Ct=E.texture,Bt=Ct.format,kt=Ct.type;if(!Et.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Et.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-$&&X>=0&&X<=E.height-z&&L.readPixels(B,X,$,z,Gt.convert(Bt),Gt.convert(kt),ct)}finally{const Ct=P!==null?bt.get(P).__webglFramebuffer:null;ut.bindFramebuffer(L.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(E,B,X,$,z,ct,yt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=bt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&yt!==void 0&&(Tt=Tt[yt]),Tt){const Ct=E.texture,Bt=Ct.format,kt=Ct.type;if(!Et.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Et.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=E.width-$&&X>=0&&X<=E.height-z){ut.bindFramebuffer(L.FRAMEBUFFER,Tt);const Rt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Rt),L.bufferData(L.PIXEL_PACK_BUFFER,ct.byteLength,L.STREAM_READ),L.readPixels(B,X,$,z,Gt.convert(Bt),Gt.convert(kt),0);const Kt=P!==null?bt.get(P).__webglFramebuffer:null;ut.bindFramebuffer(L.FRAMEBUFFER,Kt);const he=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await tf(L,he,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Rt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ct),L.deleteBuffer(Rt),L.deleteSync(he),ct}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,B=null,X=0){E.isTexture!==!0&&(Ms("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1]);const $=Math.pow(2,-X),z=Math.floor(E.image.width*$),ct=Math.floor(E.image.height*$),yt=B!==null?B.x:0,Tt=B!==null?B.y:0;w.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,X,0,0,yt,Tt,z,ct),ut.unbindTexture()},this.copyTextureToTexture=function(E,B,X=null,$=null,z=0){E.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture function signature has changed."),$=arguments[0]||null,E=arguments[1],B=arguments[2],z=arguments[3]||0,X=null);let ct,yt,Tt,Ct,Bt,kt,Rt,Kt,he;const ue=E.isCompressedTexture?E.mipmaps[z]:E.image;X!==null?(ct=X.max.x-X.min.x,yt=X.max.y-X.min.y,Tt=X.isBox3?X.max.z-X.min.z:1,Ct=X.min.x,Bt=X.min.y,kt=X.isBox3?X.min.z:0):(ct=ue.width,yt=ue.height,Tt=ue.depth||1,Ct=0,Bt=0,kt=0),$!==null?(Rt=$.x,Kt=$.y,he=$.z):(Rt=0,Kt=0,he=0);const He=Gt.convert(B.format),te=Gt.convert(B.type);let Pt;B.isData3DTexture?(w.setTexture3D(B,0),Pt=L.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(w.setTexture2DArray(B,0),Pt=L.TEXTURE_2D_ARRAY):(w.setTexture2D(B,0),Pt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);const An=L.getParameter(L.UNPACK_ROW_LENGTH),ee=L.getParameter(L.UNPACK_IMAGE_HEIGHT),nn=L.getParameter(L.UNPACK_SKIP_PIXELS),Ri=L.getParameter(L.UNPACK_SKIP_ROWS),qe=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,ue.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ue.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ct),L.pixelStorei(L.UNPACK_SKIP_ROWS,Bt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,kt);const ds=E.isDataArrayTexture||E.isData3DTexture,de=B.isDataArrayTexture||B.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const mn=bt.get(E),fs=bt.get(B),Ze=bt.get(mn.__renderTarget),Hn=bt.get(fs.__renderTarget);ut.bindFramebuffer(L.READ_FRAMEBUFFER,Ze.__webglFramebuffer),ut.bindFramebuffer(L.DRAW_FRAMEBUFFER,Hn.__webglFramebuffer);for(let Wn=0;Wn<Tt;Wn++)ds&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,bt.get(E).__webglTexture,z,kt+Wn),E.isDepthTexture?(de&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,bt.get(B).__webglTexture,z,he+Wn),L.blitFramebuffer(Ct,Bt,ct,yt,Rt,Kt,ct,yt,L.DEPTH_BUFFER_BIT,L.NEAREST)):de?L.copyTexSubImage3D(Pt,z,Rt,Kt,he+Wn,Ct,Bt,ct,yt):L.copyTexSubImage2D(Pt,z,Rt,Kt,he+Wn,Ct,Bt,ct,yt);ut.bindFramebuffer(L.READ_FRAMEBUFFER,null),ut.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else de?E.isDataTexture||E.isData3DTexture?L.texSubImage3D(Pt,z,Rt,Kt,he,ct,yt,Tt,He,te,ue.data):B.isCompressedArrayTexture?L.compressedTexSubImage3D(Pt,z,Rt,Kt,he,ct,yt,Tt,He,ue.data):L.texSubImage3D(Pt,z,Rt,Kt,he,ct,yt,Tt,He,te,ue):E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,z,Rt,Kt,ct,yt,He,te,ue.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,z,Rt,Kt,ue.width,ue.height,He,ue.data):L.texSubImage2D(L.TEXTURE_2D,z,Rt,Kt,ct,yt,He,te,ue);L.pixelStorei(L.UNPACK_ROW_LENGTH,An),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ee),L.pixelStorei(L.UNPACK_SKIP_PIXELS,nn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ri),L.pixelStorei(L.UNPACK_SKIP_IMAGES,qe),z===0&&B.generateMipmaps&&L.generateMipmap(Pt),ut.unbindTexture()},this.copyTextureToTexture3D=function(E,B,X=null,$=null,z=0){return E.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture3D function signature has changed."),X=arguments[0]||null,$=arguments[1]||null,E=arguments[2],B=arguments[3],z=arguments[4]||0),Ms('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,B,X,$,z)},this.initRenderTarget=function(E){bt.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),ut.unbindTexture()},this.resetState=function(){T=0,R=0,P=null,ut.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}}class d0 extends Se{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class f0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ua,this.updateRanges=[],this.version=0,this.uuid=yn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Be=new D;class ti{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=hn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=hn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=hn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=hn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new pn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ti(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ir extends cs{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new jt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Cc=new se,Fa=new ol,fr=new Ci,pr=new D;class Lo extends Se{constructor(t=new Re,e=new Ir){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fr.copy(n.boundingSphere),fr.applyMatrix4(s),fr.radius+=r,t.ray.intersectsSphere(fr)===!1)return;Cc.copy(s).invert(),Fa.copy(t.ray).applyMatrix4(Cc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let p=u,g=f;p<g;p++){const m=c.getX(p);pr.fromBufferAttribute(d,m),Rc(pr,m,l,s,t,e,this)}}else{const u=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let p=u,g=f;p<g;p++)pr.fromBufferAttribute(d,p),Rc(pr,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Rc(i,t,e,n,s,r,o){const a=Fa.distanceSqToPoint(i);if(a<e){const l=new D;Fa.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class ou extends Ge{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class En{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const h=n[s],u=n[s+1]-h,f=(o-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=e||(o.isVector2?new mt:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new D,s=[],r=[],o=[],a=new D,l=new se;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new D)}r[0]=new D,o[0]=new D;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const p=Math.acos(Ce(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,p))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Ce(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),o[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class dl extends En{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new mt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class p0 extends dl{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function fl(){let i=0,t=0,e=0,n=0;function s(r,o,a,l){i=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,s(o,a,u,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const mr=new D,Po=new fl,Do=new fl,Io=new fl;class m0 extends En{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=s[(a-1)%r]:(mr.subVectors(s[0],s[1]).add(s[0]),c=mr);const d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(mr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=mr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);g<1e-4&&(g=1),p<1e-4&&(p=g),m<1e-4&&(m=g),Po.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,g,m),Do.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,g,m),Io.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,g,m)}else this.curveType==="catmullrom"&&(Po.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Do.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Io.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Po.calc(l),Do.calc(l),Io.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Lc(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,l=i*a;return(2*e-2*n+r+o)*l+(-3*e+3*n-2*r-o)*a+r*i+e}function g0(i,t){const e=1-i;return e*e*t}function v0(i,t){return 2*(1-i)*i*t}function _0(i,t){return i*i*t}function Ts(i,t,e,n){return g0(i,t)+v0(i,e)+_0(i,n)}function x0(i,t){const e=1-i;return e*e*e*t}function M0(i,t){const e=1-i;return 3*e*e*i*t}function y0(i,t){return 3*(1-i)*i*i*t}function S0(i,t){return i*i*i*t}function Cs(i,t,e,n,s){return x0(i,t)+M0(i,e)+y0(i,n)+S0(i,s)}class au extends En{constructor(t=new mt,e=new mt,n=new mt,s=new mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cs(t,s.x,r.x,o.x,a.x),Cs(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class b0 extends En{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Cs(t,s.x,r.x,o.x,a.x),Cs(t,s.y,r.y,o.y,a.y),Cs(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class lu extends En{constructor(t=new mt,e=new mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new mt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class E0 extends En{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class cu extends En{constructor(t=new mt,e=new mt,n=new mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new mt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Ts(t,s.x,r.x,o.x),Ts(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class w0 extends En{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(Ts(t,s.x,r.x,o.x),Ts(t,s.y,r.y,o.y),Ts(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hu extends En{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new mt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(Lc(a,l.x,c.x,h.x,d.x),Lc(a,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new mt().fromArray(s))}return this}}var Oa=Object.freeze({__proto__:null,ArcCurve:p0,CatmullRomCurve3:m0,CubicBezierCurve:au,CubicBezierCurve3:b0,EllipseCurve:dl,LineCurve:lu,LineCurve3:E0,QuadraticBezierCurve:cu,QuadraticBezierCurve3:w0,SplineCurve:hu});class A0 extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Oa[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Oa[s.type]().fromJSON(s))}return this}}class Vr extends A0{constructor(t){super(),this.type="Path",this.currentPoint=new mt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new lu(this.currentPoint.clone(),new mt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new cu(this.currentPoint.clone(),new mt(t,e),new mt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new au(this.currentPoint.clone(),new mt(t,e),new mt(n,s),new mt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new hu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,o,a,l),this}absellipse(t,e,n,s,r,o,a,l){const c=new dl(t,e,n,s,r,o,a,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class pl extends Re{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const g=[],m=n/2;let v=0;_(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(u,3)),this.setAttribute("uv",new fe(f,2));function _(){const x=new D,I=new D;let T=0;const R=(e-t)/n;for(let P=0;P<=r;P++){const S=[],y=P/r,A=y*(e-t)+t;for(let V=0;V<=s;V++){const F=V/s,k=F*l+a,j=Math.sin(k),G=Math.cos(k);I.x=A*j,I.y=-y*n+m,I.z=A*G,d.push(I.x,I.y,I.z),x.set(j,R,G).normalize(),u.push(x.x,x.y,x.z),f.push(F,1-y),S.push(p++)}g.push(S)}for(let P=0;P<s;P++)for(let S=0;S<r;S++){const y=g[S][P],A=g[S+1][P],V=g[S+1][P+1],F=g[S][P+1];(t>0||S!==0)&&(h.push(y,A,F),T+=3),(e>0||S!==r-1)&&(h.push(A,V,F),T+=3)}c.addGroup(v,T,0),v+=T}function M(x){const I=p,T=new mt,R=new D;let P=0;const S=x===!0?t:e,y=x===!0?1:-1;for(let V=1;V<=s;V++)d.push(0,m*y,0),u.push(0,y,0),f.push(.5,.5),p++;const A=p;for(let V=0;V<=s;V++){const k=V/s*l+a,j=Math.cos(k),G=Math.sin(k);R.x=S*G,R.y=m*y,R.z=S*j,d.push(R.x,R.y,R.z),u.push(0,y,0),T.x=j*.5+.5,T.y=G*.5*y+.5,f.push(T.x,T.y),p++}for(let V=0;V<s;V++){const F=I+V,k=A+V;x===!0?h.push(k,k+1,F):h.push(k+1,k,F),P+=3}c.addGroup(v,P,x===!0?1:2),v+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pl(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Rs extends pl{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Rs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Zn extends Vr{constructor(t){super(t),this.uuid=yn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Vr().fromJSON(s))}return this}}const T0={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=uu(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,h,d,u,f;if(n&&(r=D0(i,t,r,e)),i.length>80*e){a=c=i[0],l=h=i[1];for(let p=e;p<s;p+=e)d=i[p],u=i[p+1],d<a&&(a=d),u<l&&(l=u),d>c&&(c=d),u>h&&(h=u);f=Math.max(c-a,h-l),f=f!==0?32767/f:0}return Fs(r,o,e,a,l,f,0),o}};function uu(i,t,e,n,s){let r,o;if(s===H0(i,t,e,n)>0)for(r=t;r<e;r+=n)o=Pc(r,i[r],i[r+1],o);else for(r=e-n;r>=t;r-=n)o=Pc(r,i[r],i[r+1],o);return o&&Jr(o,o.next)&&(Bs(o),o=o.next),o}function Ei(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Jr(e,e.next)||ge(e.prev,e,e.next)===0)){if(Bs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Fs(i,t,e,n,s,r,o){if(!i)return;!o&&r&&O0(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?R0(i,n,s,r):C0(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Bs(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=L0(Ei(i),t,e),Fs(i,t,e,n,s,r,2)):o===2&&P0(i,t,e,n,s,r):Fs(Ei(i),t,e,n,s,r,1);break}}}function C0(i){const t=i.prev,e=i,n=i.next;if(ge(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,l=e.y,c=n.y,h=s<r?s<o?s:o:r<o?r:o,d=a<l?a<c?a:c:l<c?l:c,u=s>r?s>o?s:o:r>o?r:o,f=a>l?a>c?a:c:l>c?l:c;let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&Yi(s,a,r,l,o,c,p.x,p.y)&&ge(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function R0(i,t,e,n){const s=i.prev,r=i,o=i.next;if(ge(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,h=s.y,d=r.y,u=o.y,f=a<l?a<c?a:c:l<c?l:c,p=h<d?h<u?h:u:d<u?d:u,g=a>l?a>c?a:c:l>c?l:c,m=h>d?h>u?h:u:d>u?d:u,v=Ba(f,p,t,e,n),_=Ba(g,m,t,e,n);let M=i.prevZ,x=i.nextZ;for(;M&&M.z>=v&&x&&x.z<=_;){if(M.x>=f&&M.x<=g&&M.y>=p&&M.y<=m&&M!==s&&M!==o&&Yi(a,h,l,d,c,u,M.x,M.y)&&ge(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=f&&x.x<=g&&x.y>=p&&x.y<=m&&x!==s&&x!==o&&Yi(a,h,l,d,c,u,x.x,x.y)&&ge(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=v;){if(M.x>=f&&M.x<=g&&M.y>=p&&M.y<=m&&M!==s&&M!==o&&Yi(a,h,l,d,c,u,M.x,M.y)&&ge(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=_;){if(x.x>=f&&x.x<=g&&x.y>=p&&x.y<=m&&x!==s&&x!==o&&Yi(a,h,l,d,c,u,x.x,x.y)&&ge(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function L0(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!Jr(s,r)&&du(s,n,n.next,r)&&Os(s,r)&&Os(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Bs(n),Bs(n.next),n=i=r),n=n.next}while(n!==i);return Ei(n)}function P0(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&k0(o,a)){let l=fu(o,a);o=Ei(o,o.next),l=Ei(l,l.next),Fs(o,t,e,n,s,r,0),Fs(l,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function D0(i,t,e,n){const s=[];let r,o,a,l,c;for(r=0,o=t.length;r<o;r++)a=t[r]*n,l=r<o-1?t[r+1]*n:i.length,c=uu(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(z0(c));for(s.sort(I0),r=0;r<s.length;r++)e=U0(s[r],e);return e}function I0(i,t){return i.x-t.x}function U0(i,t){const e=N0(i,t);if(!e)return t;const n=fu(e,i);return Ei(n,n.next),Ei(e,e.next)}function N0(i,t){let e=t,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const u=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=r&&u>n&&(n=u,s=e.x<e.next.x?e:e.next,u===r))return s}e=e.next}while(e!==t);if(!s)return null;const a=s,l=s.x,c=s.y;let h=1/0,d;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Yi(o<c?r:n,o,l,c,o<c?n:r,o,e.x,e.y)&&(d=Math.abs(o-e.y)/(r-e.x),Os(e,i)&&(d<h||d===h&&(e.x>s.x||e.x===s.x&&F0(s,e)))&&(s=e,h=d)),e=e.next;while(e!==a);return s}function F0(i,t){return ge(i.prev,i,t.prev)<0&&ge(t.next,i,i.next)<0}function O0(i,t,e,n){let s=i;do s.z===0&&(s.z=Ba(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,B0(s)}function B0(i){let t,e,n,s,r,o,a,l,c=1;do{for(e=i,i=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<c&&(a++,n=n.nextZ,!!n);t++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(o>1);return i}function Ba(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function z0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Yi(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function k0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!V0(i,t)&&(Os(i,t)&&Os(t,i)&&G0(i,t)&&(ge(i.prev,i,t.prev)||ge(i,t.prev,t))||Jr(i,t)&&ge(i.prev,i,i.next)>0&&ge(t.prev,t,t.next)>0)}function ge(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Jr(i,t){return i.x===t.x&&i.y===t.y}function du(i,t,e,n){const s=vr(ge(i,t,e)),r=vr(ge(i,t,n)),o=vr(ge(e,n,i)),a=vr(ge(e,n,t));return!!(s!==r&&o!==a||s===0&&gr(i,e,t)||r===0&&gr(i,n,t)||o===0&&gr(e,i,n)||a===0&&gr(e,t,n))}function gr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function vr(i){return i>0?1:i<0?-1:0}function V0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&du(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Os(i,t){return ge(i.prev,i,i.next)<0?ge(i,t,i.next)>=0&&ge(i,i.prev,t)>=0:ge(i,t,i.prev)<0||ge(i,i.next,t)<0}function G0(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function fu(i,t){const e=new za(i.i,i.x,i.y),n=new za(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Pc(i,t,e,n){const s=new za(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Bs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function za(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function H0(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Ls{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ls.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Dc(t),Ic(n,t);let o=t.length;e.forEach(Dc);for(let l=0;l<e.length;l++)s.push(o),o+=e[l].length,Ic(n,e[l]);const a=T0.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function Dc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Ic(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class ml extends Re{constructor(t=new Zn([new mt(.5,.5),new mt(-.5,.5),new mt(-.5,-.5),new mt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new fe(s,3)),this.setAttribute("uv",new fe(r,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const v=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:W0;let M,x=!1,I,T,R,P;v&&(M=v.getSpacedPoints(h),x=!0,u=!1,I=v.computeFrenetFrames(h,!1),T=new D,R=new D,P=new D),u||(m=0,f=0,p=0,g=0);const S=a.extractPoints(c);let y=S.shape;const A=S.holes;if(!Ls.isClockWise(y)){y=y.reverse();for(let Q=0,lt=A.length;Q<lt;Q++){const L=A[Q];Ls.isClockWise(L)&&(A[Q]=L.reverse())}}const F=Ls.triangulateShape(y,A),k=y;for(let Q=0,lt=A.length;Q<lt;Q++){const L=A[Q];y=y.concat(L)}function j(Q,lt,L){return lt||console.error("THREE.ExtrudeGeometry: vec does not exist"),Q.clone().addScaledVector(lt,L)}const G=y.length,q=F.length;function W(Q,lt,L){let at,nt,Et;const ut=Q.x-lt.x,Nt=Q.y-lt.y,bt=L.x-Q.x,w=L.y-Q.y,b=ut*ut+Nt*Nt,H=ut*w-Nt*bt;if(Math.abs(H)>Number.EPSILON){const Z=Math.sqrt(b),et=Math.sqrt(bt*bt+w*w),O=lt.x-Nt/Z,gt=lt.y+ut/Z,ht=L.x-w/et,_t=L.y+bt/et,Ft=((ht-O)*w-(_t-gt)*bt)/(ut*w-Nt*bt);at=O+ut*Ft-Q.x,nt=gt+Nt*Ft-Q.y;const it=at*at+nt*nt;if(it<=2)return new mt(at,nt);Et=Math.sqrt(it/2)}else{let Z=!1;ut>Number.EPSILON?bt>Number.EPSILON&&(Z=!0):ut<-Number.EPSILON?bt<-Number.EPSILON&&(Z=!0):Math.sign(Nt)===Math.sign(w)&&(Z=!0),Z?(at=-Nt,nt=ut,Et=Math.sqrt(b)):(at=ut,nt=Nt,Et=Math.sqrt(b/2))}return new mt(at/Et,nt/Et)}const st=[];for(let Q=0,lt=k.length,L=lt-1,at=Q+1;Q<lt;Q++,L++,at++)L===lt&&(L=0),at===lt&&(at=0),st[Q]=W(k[Q],k[L],k[at]);const rt=[];let dt,Ut=st.concat();for(let Q=0,lt=A.length;Q<lt;Q++){const L=A[Q];dt=[];for(let at=0,nt=L.length,Et=nt-1,ut=at+1;at<nt;at++,Et++,ut++)Et===nt&&(Et=0),ut===nt&&(ut=0),dt[at]=W(L[at],L[Et],L[ut]);rt.push(dt),Ut=Ut.concat(dt)}for(let Q=0;Q<m;Q++){const lt=Q/m,L=f*Math.cos(lt*Math.PI/2),at=p*Math.sin(lt*Math.PI/2)+g;for(let nt=0,Et=k.length;nt<Et;nt++){const ut=j(k[nt],st[nt],at);K(ut.x,ut.y,-L)}for(let nt=0,Et=A.length;nt<Et;nt++){const ut=A[nt];dt=rt[nt];for(let Nt=0,bt=ut.length;Nt<bt;Nt++){const w=j(ut[Nt],dt[Nt],at);K(w.x,w.y,-L)}}}const Wt=p+g;for(let Q=0;Q<G;Q++){const lt=u?j(y[Q],Ut[Q],Wt):y[Q];x?(R.copy(I.normals[0]).multiplyScalar(lt.x),T.copy(I.binormals[0]).multiplyScalar(lt.y),P.copy(M[0]).add(R).add(T),K(P.x,P.y,P.z)):K(lt.x,lt.y,0)}for(let Q=1;Q<=h;Q++)for(let lt=0;lt<G;lt++){const L=u?j(y[lt],Ut[lt],Wt):y[lt];x?(R.copy(I.normals[Q]).multiplyScalar(L.x),T.copy(I.binormals[Q]).multiplyScalar(L.y),P.copy(M[Q]).add(R).add(T),K(P.x,P.y,P.z)):K(L.x,L.y,d/h*Q)}for(let Q=m-1;Q>=0;Q--){const lt=Q/m,L=f*Math.cos(lt*Math.PI/2),at=p*Math.sin(lt*Math.PI/2)+g;for(let nt=0,Et=k.length;nt<Et;nt++){const ut=j(k[nt],st[nt],at);K(ut.x,ut.y,d+L)}for(let nt=0,Et=A.length;nt<Et;nt++){const ut=A[nt];dt=rt[nt];for(let Nt=0,bt=ut.length;Nt<bt;Nt++){const w=j(ut[Nt],dt[Nt],at);x?K(w.x,w.y+M[h-1].y,M[h-1].x+L):K(w.x,w.y,d+L)}}}U(),J();function U(){const Q=s.length/3;if(u){let lt=0,L=G*lt;for(let at=0;at<q;at++){const nt=F[at];Lt(nt[2]+L,nt[1]+L,nt[0]+L)}lt=h+m*2,L=G*lt;for(let at=0;at<q;at++){const nt=F[at];Lt(nt[0]+L,nt[1]+L,nt[2]+L)}}else{for(let lt=0;lt<q;lt++){const L=F[lt];Lt(L[2],L[1],L[0])}for(let lt=0;lt<q;lt++){const L=F[lt];Lt(L[0]+G*h,L[1]+G*h,L[2]+G*h)}}n.addGroup(Q,s.length/3-Q,0)}function J(){const Q=s.length/3;let lt=0;ft(k,lt),lt+=k.length;for(let L=0,at=A.length;L<at;L++){const nt=A[L];ft(nt,lt),lt+=nt.length}n.addGroup(Q,s.length/3-Q,1)}function ft(Q,lt){let L=Q.length;for(;--L>=0;){const at=L;let nt=L-1;nt<0&&(nt=Q.length-1);for(let Et=0,ut=h+m*2;Et<ut;Et++){const Nt=G*Et,bt=G*(Et+1),w=lt+at+Nt,b=lt+nt+Nt,H=lt+nt+bt,Z=lt+at+bt;It(w,b,H,Z)}}}function K(Q,lt,L){l.push(Q),l.push(lt),l.push(L)}function Lt(Q,lt,L){wt(Q),wt(lt),wt(L);const at=s.length/3,nt=_.generateTopUV(n,s,at-3,at-2,at-1);Xt(nt[0]),Xt(nt[1]),Xt(nt[2])}function It(Q,lt,L,at){wt(Q),wt(lt),wt(at),wt(lt),wt(L),wt(at);const nt=s.length/3,Et=_.generateSideWallUV(n,s,nt-6,nt-3,nt-2,nt-1);Xt(Et[0]),Xt(Et[1]),Xt(Et[3]),Xt(Et[1]),Xt(Et[2]),Xt(Et[3])}function wt(Q){s.push(l[Q*3+0]),s.push(l[Q*3+1]),s.push(l[Q*3+2])}function Xt(Q){r.push(Q.x),r.push(Q.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return X0(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Oa[s.type]().fromJSON(s)),new ml(n,t.options)}}const W0={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new mt(r,o),new mt(a,l),new mt(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],p=t[s*3+2],g=t[r*3],m=t[r*3+1],v=t[r*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new mt(o,1-l),new mt(c,1-d),new mt(u,1-p),new mt(g,1-v)]:[new mt(a,1-l),new mt(h,1-d),new mt(f,1-p),new mt(m,1-v)]}};function X0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class gl extends Re{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const h=[],d=new D,u=new D,f=[],p=[],g=[],m=[];for(let v=0;v<=n;v++){const _=[],M=v/n;let x=0;v===0&&o===0?x=.5/e:v===n&&l===Math.PI&&(x=-.5/e);for(let I=0;I<=e;I++){const T=I/e;d.x=-t*Math.cos(s+T*r)*Math.sin(o+M*a),d.y=t*Math.cos(o+M*a),d.z=t*Math.sin(s+T*r)*Math.sin(o+M*a),p.push(d.x,d.y,d.z),u.copy(d).normalize(),g.push(u.x,u.y,u.z),m.push(T+x,1-M),_.push(c++)}h.push(_)}for(let v=0;v<n;v++)for(let _=0;_<e;_++){const M=h[v][_+1],x=h[v][_],I=h[v+1][_],T=h[v+1][_+1];(v!==0||o>0)&&f.push(M,x,T),(v!==n-1||l<Math.PI)&&f.push(x,I,T)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gl(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class $0 extends Re{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new D,r=new D;if(t.index!==null){const o=t.attributes.position,a=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let p=u,g=u+f;p<g;p+=3)for(let m=0;m<3;m++){const v=a.getX(p+m),_=a.getX(p+(m+1)%3);s.fromBufferAttribute(o,v),r.fromBufferAttribute(o,_),Uc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const o=t.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const h=3*a+c,d=3*a+(c+1)%3;s.fromBufferAttribute(o,h),r.fromBufferAttribute(o,d),Uc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new fe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Uc(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class Nc extends cs{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new jt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new jt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class pu extends Se{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new jt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class j0 extends pu{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Se.DEFAULT_UP),this.updateMatrix(),this.groundColor=new jt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Uo=new se,Fc=new D,Oc=new D;class q0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new mt(512,512),this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cl,this._frameExtents=new mt(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Fc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Fc),Oc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Oc),e.updateMatrixWorld(),Uo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Uo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Y0 extends q0{constructor(){super(new hl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class J0 extends pu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Se.DEFAULT_UP),this.updateMatrix(),this.target=new Se,this.shadow=new Y0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Z0 extends Re{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class ka extends f0{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const Bc=new se;class K0{constructor(t,e,n=0,s=1/0){this.ray=new ol(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new al,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Bc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bc),this}intersectObject(t,e=!0,n=[]){return Va(t,this,n,e),n.sort(zc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Va(t[s],this,n,e);return n.sort(zc),n}}function zc(i,t){return i.distance-t.distance}function Va(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)Va(r[o],t,e,!0)}}const kc=new D,_r=new D;class Q0{constructor(t=new D,e=new D){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){kc.subVectors(t,this.start),_r.subVectors(this.end,this.start);const n=_r.dot(_r);let r=_r.dot(kc)/n;return e&&(r=Ce(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ka}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ka);const Vc=new Vn,xr=new D;class mu extends Z0{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new fe(t,3)),this.setAttribute("uv",new fe(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new ka(e,6,1);return this.setAttribute("instanceStart",new ti(n,3,0)),this.setAttribute("instanceEnd",new ti(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new ka(e,6,1);return this.setAttribute("instanceColorStart",new ti(n,3,0)),this.setAttribute("instanceColorEnd",new ti(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new $0(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Vc.setFromBufferAttribute(e),this.boundingBox.union(Vc))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ci),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)xr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(xr)),xr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(xr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}pt.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new mt(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};$e.line={uniforms:ll.merge([pt.common,pt.fog,pt.line]),vertexShader:`
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
		`};class Ga extends zn{static get type(){return"LineMaterial"}constructor(t){super({uniforms:ll.clone($e.line.uniforms),vertexShader:$e.line.vertexShader,fragmentShader:$e.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const No=new le,Gc=new D,Hc=new D,Le=new le,Pe=new le,gn=new le,Fo=new D,Oo=new se,Ie=new Q0,Wc=new D,Mr=new Vn,yr=new Ci,vn=new le;let xn,yi;function Xc(i,t,e){return vn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),vn.multiplyScalar(1/vn.w),vn.x=yi/e.width,vn.y=yi/e.height,vn.applyMatrix4(i.projectionMatrixInverse),vn.multiplyScalar(1/vn.w),Math.abs(Math.max(vn.x,vn.y))}function t_(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,o=Math.min(n.instanceCount,s.count);for(let a=0,l=o;a<l;a++){Ie.start.fromBufferAttribute(s,a),Ie.end.fromBufferAttribute(r,a),Ie.applyMatrix4(e);const c=new D,h=new D;xn.distanceSqToSegment(Ie.start,Ie.end,h,c),h.distanceTo(c)<yi*.5&&t.push({point:h,pointOnLine:c,distance:xn.origin.distanceTo(h),object:i,face:null,faceIndex:a,uv:null,uv1:null})}}function e_(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,o=i.matrixWorld,a=i.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,h=Math.min(a.instanceCount,l.count),d=-t.near;xn.at(1,gn),gn.w=1,gn.applyMatrix4(t.matrixWorldInverse),gn.applyMatrix4(n),gn.multiplyScalar(1/gn.w),gn.x*=r.x/2,gn.y*=r.y/2,gn.z=0,Fo.copy(gn),Oo.multiplyMatrices(t.matrixWorldInverse,o);for(let u=0,f=h;u<f;u++){if(Le.fromBufferAttribute(l,u),Pe.fromBufferAttribute(c,u),Le.w=1,Pe.w=1,Le.applyMatrix4(Oo),Pe.applyMatrix4(Oo),Le.z>d&&Pe.z>d)continue;if(Le.z>d){const M=Le.z-Pe.z,x=(Le.z-d)/M;Le.lerp(Pe,x)}else if(Pe.z>d){const M=Pe.z-Le.z,x=(Pe.z-d)/M;Pe.lerp(Le,x)}Le.applyMatrix4(n),Pe.applyMatrix4(n),Le.multiplyScalar(1/Le.w),Pe.multiplyScalar(1/Pe.w),Le.x*=r.x/2,Le.y*=r.y/2,Pe.x*=r.x/2,Pe.y*=r.y/2,Ie.start.copy(Le),Ie.start.z=0,Ie.end.copy(Pe),Ie.end.z=0;const g=Ie.closestPointToPointParameter(Fo,!0);Ie.at(g,Wc);const m=fi.lerp(Le.z,Pe.z,g),v=m>=-1&&m<=1,_=Fo.distanceTo(Wc)<yi*.5;if(v&&_){Ie.start.fromBufferAttribute(l,u),Ie.end.fromBufferAttribute(c,u),Ie.start.applyMatrix4(o),Ie.end.applyMatrix4(o);const M=new D,x=new D;xn.distanceSqToSegment(Ie.start,Ie.end,x,M),e.push({point:x,pointOnLine:M,distance:xn.origin.distanceTo(x),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class n_ extends Te{constructor(t=new mu,e=new Ga({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let o=0,a=0,l=e.count;o<l;o++,a+=2)Gc.fromBufferAttribute(e,o),Hc.fromBufferAttribute(n,o),s[a]=a===0?0:s[a-1],s[a+1]=s[a]+Gc.distanceTo(Hc);const r=new ka(s,2,1);return t.setAttribute("instanceDistanceStart",new ti(r,1,0)),t.setAttribute("instanceDistanceEnd",new ti(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;xn=t.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;yi=l.linewidth+r,a.boundingSphere===null&&a.computeBoundingSphere(),yr.copy(a.boundingSphere).applyMatrix4(o);let c;if(n)c=yi*.5;else{const d=Math.max(s.near,yr.distanceToPoint(xn.origin));c=Xc(s,d,l.resolution)}if(yr.radius+=c,xn.intersectsSphere(yr)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),Mr.copy(a.boundingBox).applyMatrix4(o);let h;if(n)h=yi*.5;else{const d=Math.max(s.near,Mr.distanceToPoint(xn.origin));h=Xc(s,d,l.resolution)}Mr.expandByScalar(h),xn.intersectsBox(Mr)!==!1&&(n?t_(this,e):e_(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(No),this.material.uniforms.resolution.value.set(No.z,No.w))}}class i_ extends Se{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new mt(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}}const Wi=new D,$c=new se,jc=new se,qc=new D,Yc=new D;class s_{constructor(t={}){const e=this;let n,s,r,o;const a={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:n,height:s}},this.render=function(p,g){p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld(),g.parent===null&&g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),$c.copy(g.matrixWorldInverse),jc.multiplyMatrices(g.projectionMatrix,$c),h(p,p,g),f(p)},this.setSize=function(p,g){n=p,s=g,r=n/2,o=s/2,l.style.width=p+"px",l.style.height=g+"px"};function c(p){p.isCSS2DObject&&(p.element.style.display="none");for(let g=0,m=p.children.length;g<m;g++)c(p.children[g])}function h(p,g,m){if(p.visible===!1){c(p);return}if(p.isCSS2DObject){Wi.setFromMatrixPosition(p.matrixWorld),Wi.applyMatrix4(jc);const v=Wi.z>=-1&&Wi.z<=1&&p.layers.test(m.layers)===!0,_=p.element;_.style.display=v===!0?"":"none",v===!0&&(p.onBeforeRender(e,g,m),_.style.transform="translate("+-100*p.center.x+"%,"+-100*p.center.y+"%)translate("+(Wi.x*r+r)+"px,"+(-Wi.y*o+o)+"px)",_.parentNode!==l&&l.appendChild(_),p.onAfterRender(e,g,m));const M={distanceToCameraSquared:d(m,p)};a.objects.set(p,M)}for(let v=0,_=p.children.length;v<_;v++)h(p.children[v],g,m)}function d(p,g){return qc.setFromMatrixPosition(p.matrixWorld),Yc.setFromMatrixPosition(g.matrixWorld),qc.distanceToSquared(Yc)}function u(p){const g=[];return p.traverseVisible(function(m){m.isCSS2DObject&&g.push(m)}),g}function f(p){const g=u(p).sort(function(v,_){if(v.renderOrder!==_.renderOrder)return _.renderOrder-v.renderOrder;const M=a.objects.get(v).distanceToCameraSquared,x=a.objects.get(_).distanceToCameraSquared;return M-x}),m=g.length;for(let v=0,_=g.length;v<_;v++)g[v].element.style.zIndex=m-v}}}const gu={rect:["Depth d","Width b"],circle:["Diameter D"],pipe:["Outer diameter D","Wall thickness t"],I:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],box:["Depth d","Width b","Flange thick. tf","Web thick. tw"],unp:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],C:["Depth d","Flange width b","Lip length c","Thickness t"],general:["A","I33","I22","J"]},Gr=(i,t)=>i==="general"?t===0?"A":"L4":"L",Ps={rect:"Rectangle",circle:"Circle",pipe:"Pipe",I:"I / Wide flange",box:"Box / Tube",unp:"UNP / Channel",C:"C / Lipped channel",general:"General"};function r_(i,t){const e=Math.max(i,t),n=Math.min(i,t);return e<=0?0:e*n**3*(1/3-.21*(n/e)*(1-n**4/(12*e**4)))}function vu(i){const t=i.dims;if(i.shape==="unp"){const[o,a,l,c]=t;return[[0,c,-o/2+l,o/2-l],[0,a,o/2-l,o/2],[0,a,-o/2,-o/2+l]]}const[e,n,s,r]=t;return[[0,r,-e/2,e/2],[r,n,e/2-r,e/2],[r,n,-e/2,-e/2+r],[n-r,n,e/2-s,e/2-r],[n-r,n,-e/2+r,-e/2+s]]}function _u(i){let t=0,e=0;for(const[a,l,c,h]of i){const d=(l-a)*(h-c);t+=d,e+=d*(a+l)/2}const n=t>0?e/t:0;let s=0,r=0,o=0;for(const[a,l,c,h]of i){const d=l-a,u=h-c,f=d*u,p=(c+h)/2,g=(a+l)/2-n;s+=d*u**3/12+f*p*p,r+=u*d**3/12+f*g*g,o+=Math.max(d,u)*Math.min(d,u)**3/3}return{A:t,I33:s,I22:r,J:o,xc:n}}function o_(i){return i.shape==="unp"||i.shape==="C"?_u(vu(i)).xc:0}function xu(i){if(i.shape!=="unp"&&i.shape!=="C")return null;const t=o_(i);let e;if(i.shape==="unp"){const[n,s,r,o]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[o,-n/2+r],[o,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}else{const[n,s,r,o]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[s-o,-n/2+r],[s-o,-n/2+o],[o,-n/2+o],[o,n/2-o],[s-o,n/2-o],[s-o,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}return e.map(([n,s])=>[n-t,s])}function wi(i){const t=i.dims;switch(i.shape){case"rect":{const[e,n]=t,s=n*e;return{A:s,I33:n*e**3/12,I22:e*n**3/12,J:r_(e,n),As2:5/6*s,As3:5/6*s,depth:e,width:n}}case"circle":{const[e]=t,n=Math.PI*e**4/64,s=Math.PI*e*e/4;return{A:s,I33:n,I22:n,J:2*n,As2:.9*s,As3:.9*s,depth:e,width:e}}case"pipe":{const[e,n]=t,s=Math.max(e-2*n,0),r=Math.PI*(e**4-s**4)/64,o=Math.PI*(e*e-s*s)/4;return{A:o,I33:r,I22:r,J:2*r,As2:o/2,As3:o/2,depth:e,width:e}}case"I":{const[e,n,s,r]=t,o=e-2*s;return{A:2*n*s+o*r,I33:(n*e**3-(n-r)*o**3)/12,I22:2*s*n**3/12+o*r**3/12,J:(2*n*s**3+(e-s)*r**3)/3,As2:e*r,As3:5/3*n*s,depth:e,width:n}}case"box":{const[e,n,s,r]=t,o=e-2*s,a=n-2*r,l=n*r+e*s-r*r-s*s;return{A:n*e-a*o,I33:(n*e**3-a*o**3)/12,I22:(e*n**3-o*a**3)/12,J:l>0?2*r*s*(n-r)**2*(e-s)**2/l:0,As2:2*e*r,As3:2*n*s,depth:e,width:n}}case"unp":case"C":{const e=_u(vu(i)),[n,s]=i.shape==="unp"?[t[2],t[3]]:[t[3],t[3]];return{A:e.A,I33:e.I33,I22:e.I22,J:e.J,As2:t[0]*s,As3:5/3*t[1]*n,depth:t[0],width:t[1]}}case"general":{const[e,n,s,r]=t,o=Math.sqrt(Math.max(e,1e-6));return{A:e,I33:n,I22:s,J:r,As2:0,As3:0,depth:o,width:o}}}}function Jc(i){const t=gu[i.shape].length;if(i.dims.length<t)return"Missing dimensions";if(i.dims.slice(0,t).some(e=>!(e>0)))return"All dimensions must be positive";if(i.shape==="pipe"&&2*i.dims[1]>=i.dims[0])return"Wall too thick for diameter";if((i.shape==="I"||i.shape==="box")&&2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.shape==="I"&&i.dims[3]>=i.dims[1])return"Web thicker than flange width";if(i.shape==="box"&&2*i.dims[3]>=i.dims[1])return"Webs too thick for width";if(i.shape==="unp"){if(2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.dims[3]>=i.dims[1])return"Web thicker than flange width"}if(i.shape==="C"){const[e,n,s,r]=i.dims;if(2*r>=e)return"Thickness too large for depth";if(2*r>=n)return"Thickness too large for flange width";if(s<=r)return"Lip must be longer than the thickness";if(2*s>=e)return"Lips too long for depth"}return null}const Ds=(i,t)=>[i[0]-t[0],i[1]-t[1],i[2]-t[2]],Ur=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],Ss=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],zs=i=>Math.hypot(i[0],i[1],i[2]),ji=(i,t)=>[i[0]*t,i[1]*t,i[2]*t],Zc=(i,t)=>[i[0]+t[0],i[1]+t[1],i[2]+t[2]],Kc=i=>ji(i,1/zs(i));function Ha(i,t,e){const n=Ds(t,i),s=zs(n),r=ji(n,1/s);let o,a;if(Math.hypot(n[0],n[1])<=1e-6*s?(o=[1,0,0],a=Kc(Ss(r,o)),o=Ss(a,r)):(a=Kc(Ss(r,[0,0,1])),o=Ss(a,r)),e){const l=e*Math.PI/180,c=Math.cos(l),h=Math.sin(l),d=Zc(ji(o,c),ji(a,h)),u=Zc(ji(o,-h),ji(a,c));o=d,a=u}return[r,o,a]}function Hr(i,t,e,n,s){return n>0&&t>0?12*i*e/(t*n*s*s):0}function a_(i,t,e,n,s,r,o,a=0,l=0){const c=new Float64Array(144),h=(v,_,M)=>{c[v*12+_]=M,c[_*12+v]=M},d=i*e/o;h(0,0,d),h(0,6,-d),h(6,6,d);const u=t*r/o;h(3,3,u),h(3,9,-u),h(9,9,u);const f=Hr(i,t,s,a,o),p=i*s/(o**3*(1+f));h(1,1,12*p),h(1,5,6*p*o),h(1,7,-12*p),h(1,11,6*p*o),h(5,5,(4+f)*p*o*o),h(5,7,-6*p*o),h(5,11,(2-f)*p*o*o),h(7,7,12*p),h(7,11,-6*p*o),h(11,11,(4+f)*p*o*o);const g=Hr(i,t,n,l,o),m=i*n/(o**3*(1+g));return h(2,2,12*m),h(2,4,-6*m*o),h(2,8,-12*m),h(2,10,-6*m*o),h(4,4,(4+g)*m*o*o),h(4,8,6*m*o),h(4,10,(2-g)*m*o*o),h(8,8,12*m),h(8,10,6*m*o),h(10,10,(4+g)*m*o*o),c}function l_(i){return[...i[0],...i[1],...i[2]]}function c_(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s*3]*t[n*3]+i[s*3+1]*t[n*3+1]+i[s*3+2]*t[n*3+2];return e}function Qc(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s]*t[n*3]+i[3+s]*t[n*3+1]+i[6+s]*t[n*3+2];return e}function h_(i,t){const e=new Float64Array(144);for(let r=0;r<4;r++)for(let o=0;o<3;o++)for(let a=0;a<3;a++)e[(r*3+o)*12+r*3+a]=t[o*3+a];const n=new Float64Array(144);for(let r=0;r<12;r++)for(let o=0;o<12;o++){let a=0;for(let l=0;l<12;l++)a+=i[r*12+l]*e[l*12+o];n[r*12+o]=a}const s=new Float64Array(144);for(let r=0;r<12;r++)for(let o=0;o<12;o++){let a=0;for(let l=0;l<12;l++)a+=e[l*12+r]*n[l*12+o];s[r*12+o]=a}return s}function th(i,t,e,n,s=0,r=0){const o=e-t;n[0]+=-i[0]*o/e,n[6]+=-i[0]*t/e;const a=h=>{const d=e*e*(1+h),u=t*o*(o+h*e/2)/d,f=t*o*(t+h*e/2)/d;return{mi:u,mj:f,vi:o/e+(u-f)/e,vj:t/e-(u-f)/e}},l=a(s);n[1]+=-i[1]*l.vi,n[5]+=-i[1]*l.mi,n[7]+=-i[1]*l.vj,n[11]+=i[1]*l.mj;const c=a(r);n[2]+=-i[2]*c.vi,n[4]+=i[2]*c.mi,n[8]+=-i[2]*c.vj,n[10]+=-i[2]*c.mj}const Mu=[{x:-Math.sqrt(3/5),w:5/9},{x:0,w:8/9},{x:Math.sqrt(3/5),w:5/9}];function u_(i,t){var r;const e=i.length;if(e===0)return[];const n=((r=t[0])==null?void 0:r.length)??0,s=Array.from({length:e},(o,a)=>[...i[a],...t[a]]);for(let o=0;o<e;o++){let a=o,l=Math.abs(s[o][o]);for(let h=o+1;h<e;h++){const d=Math.abs(s[h][o]);d>l&&(l=d,a=h)}if(l<1e-12)return null;if(a!==o){const h=s[o];s[o]=s[a],s[a]=h}const c=s[o][o];for(let h=o;h<e+n;h++)s[o][h]/=c;for(let h=0;h<e;h++){if(h===o)continue;const d=s[h][o];if(!(Math.abs(d)<1e-18))for(let u=o;u<e+n;u++)s[h][u]-=d*s[o][u]}}return s.map(o=>o.slice(e))}function d_(i,t,e){const n=[],s=[];for(let g=0;g<6;g++)t&&t[g]?n.push(g):s.push(g);for(let g=0;g<6;g++)e&&e[g]?n.push(6+g):s.push(6+g);if(n.length===0)return{retained:s,released:n,W:[],invKee:[],klCondensed:new Float64Array(i)};if(s.length===0)return null;const r=n.length,o=s.length,a=Array.from({length:r},(g,m)=>Array.from({length:r},(v,_)=>i[n[m]*12+n[_]])),l=Array.from({length:r},(g,m)=>Array.from({length:o},(v,_)=>i[n[m]*12+s[_]])),c=Array.from({length:r},(g,m)=>Array.from({length:r},(v,_)=>m===_?1:0)),h=l.map((g,m)=>[...g,...c[m]]),d=u_(a,h);if(!d)return null;const u=d.map(g=>g.slice(0,o)),f=d.map(g=>g.slice(o)),p=new Float64Array(144);for(let g=0;g<o;g++){const m=s[g];for(let v=0;v<o;v++){const _=s[v];let M=0;for(let x=0;x<r;x++)M+=l[x][g]*u[x][v];p[m*12+_]=i[m*12+_]-M}}for(let g=0;g<o;g++){const m=s[g];for(let v=g+1;v<o;v++){const _=s[v],M=.5*(p[m*12+_]+p[_*12+m]);p[m*12+_]=M,p[_*12+m]=M}}return{retained:s,released:n,W:u,invKee:f,klCondensed:p}}function f_(i,t){if(t.released.length===0)return new Float64Array(i);const e=t.released.length,n=t.retained.length,s=new Array(e);for(let o=0;o<e;o++)s[o]=i[t.released[o]];const r=new Float64Array(12);for(let o=0;o<n;o++){const a=t.retained[o];let l=0;for(let c=0;c<e;c++)l+=t.W[c][o]*s[c];r[a]=i[a]-l}return r}function p_(i,t,e){if(e.released.length===0)return new Float64Array(i);const n=e.released.length,s=e.retained.length,r=new Array(s);for(let c=0;c<s;c++)r[c]=i[e.retained[c]];const o=new Array(n);for(let c=0;c<n;c++)o[c]=t[e.released[c]];const a=new Array(n);for(let c=0;c<n;c++){let h=0;for(let u=0;u<n;u++)h+=e.invKee[c][u]*o[u];let d=0;for(let u=0;u<s;u++)d+=e.W[c][u]*r[u];a[c]=-h-d}const l=new Float64Array(12);for(let c=0;c<s;c++)l[e.retained[c]]=r[c];for(let c=0;c<n;c++)l[e.released[c]]=a[c];return l}const eh=9.80665,Bo=.0044482216152605,rs=[{id:"kN-m",label:"kN, m",force:"kN",length:"m",kF:1,kL:1,small:"mm",kSmall:.001},{id:"N-mm",label:"N, mm",force:"N",length:"mm",kF:.001,kL:.001,small:"mm",kSmall:.001},{id:"tonf-m",label:"ton, m",force:"tonf",length:"m",kF:eh,kL:1,small:"mm",kSmall:.001},{id:"kgf-mm",label:"kg, mm",force:"kgf",length:"mm",kF:eh/1e3,kL:.001,small:"mm",kSmall:.001},{id:"kip-ft",label:"kip, ft",force:"kip",length:"ft",kF:Bo*1e3,kL:.3048,small:"in",kSmall:.0254},{id:"kip-in",label:"kip, in",force:"kip",length:"in",kF:Bo*1e3,kL:.0254,small:"in",kSmall:.0254},{id:"lb-in",label:"lb, in",force:"lb",length:"in",kF:Bo,kL:.0254,small:"in",kSmall:.0254}],Wa=rs[0],m_={L:[0,1],F:[1,0],M:[1,1],FL:[1,-1],FA:[1,-2],FV:[1,-3],A:[0,2],L4:[0,4]},yu="structapp3d.units";function Su(i){return rs.find(t=>t.id===i)}function g_(){var i;try{return Su((i=globalThis.localStorage)==null?void 0:i.getItem(yu))??Wa}catch{return Wa}}let Ai=g_();const Xa=new Set,ln=()=>Ai;function nh(i){var e;const t=Su(i);if(!(!t||t===Ai)){Ai=t;try{(e=globalThis.localStorage)==null||e.setItem(yu,i)}catch{}for(const n of Xa)n(t)}}function v_(i){return Xa.add(i),()=>Xa.delete(i)}function bu(i,t=Ai){const[e,n]=m_[i];return t.kF**e*t.kL**n}const vl=(i,t,e=Ai)=>i/bu(t,e),Eu=(i,t,e=Ai)=>i*bu(t,e),__={2:"²",3:"³",4:"⁴"};function Yt(i,t=Ai,e=!1){const n=t.force,s=t.length,r=o=>e?String(o):__[o];switch(i){case"L":return s;case"F":return n;case"M":return`${n}${e?"-":"·"}${s}`;case"FL":return`${n}/${s}`;case"FA":return`${n}/${s}${r(2)}`;case"FV":return`${n}/${s}${r(3)}`;case"A":return`${s}${r(2)}`;case"L4":return`${s}${r(4)}`}}function kn(i,t=4){if(!Number.isFinite(i))return"—";if(Math.abs(i)<1e-12)return"0";const e=Math.abs(i);return e>=1e5||e<.001?i.toExponential(t-1):String(Number(i.toPrecision(t)))}const qt=(i,t,e=4)=>kn(vl(i,t),e),Me=(i,t,e=4)=>`${qt(i,t,e)} ${Yt(t)}`,x_=(i,t)=>Number(vl(i,t).toPrecision(10)),Ue=(i,t)=>`${i}:${t}`;function Is(i){const[t,e]=i.split(":");return{kind:t,id:Number(e)}}const $a=["P","V2","V3","T","M2","M3"],wu={bg:988970,grid:1976635,gridMajor:3359061,joint:3718648,frame:14870768,area:2278750,sel:16096779,load:16007006,support:2278750,reaction:11032055,pos:3900150,neg:15680580,deformed:16436245,ghost:4674921},M_={bg:16317180,grid:14870768,gridMajor:13358561,joint:165063,frame:1976635,area:1483594,sel:15357964,load:14753096,support:1409085,reaction:8266446,pos:2450411,neg:14427686,deformed:13273604,ghost:9741240},ih=[9741240,6333946,16020150,3462041,16498468,10980346,16486972,3003583],Qt=i=>Array.isArray(i)?new D(i[0],i[1],i[2]):new D(i.x,i.y,i.z),Sr=i=>[i.x,i.y,i.z];function sh(i,t){switch(i){case"GX":return new D(1,0,0);case"GY":return new D(0,1,0);case"GZ":return new D(0,0,1);case"GRAV":return new D(0,0,-1);case"L1":return Qt(t[0]);case"L2":return Qt(t[1]);case"L3":return Qt(t[2])}}function y_(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d");t.beginPath(),t.arc(32,32,28,0,Math.PI*2),t.fillStyle="#fff",t.fill(),t.lineWidth=6,t.strokeStyle="rgba(0,0,0,0.55)",t.stroke();const e=new ou(i);return e.colorSpace=Xe,e}function S_(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d");t.beginPath(),t.arc(32,32,20,0,Math.PI*2),t.fillStyle="rgba(15, 23, 42, 0.9)",t.fill(),t.lineWidth=8,t.strokeStyle="#38bdf8",t.stroke();const e=new ou(i);return e.colorSpace=Xe,e}function b_(i){const t=i.dims,e=(n,s,r)=>{r.moveTo(-n/2,-s/2),r.lineTo(n/2,-s/2),r.lineTo(n/2,s/2),r.lineTo(-n/2,s/2),r.closePath()};switch(i.shape){case"rect":{const n=new Zn;return e(t[1],t[0],n),n}case"circle":{const n=new Zn;return n.absarc(0,0,t[0]/2,0,Math.PI*2,!1),n}case"pipe":{const n=new Zn;n.absarc(0,0,t[0]/2,0,Math.PI*2,!1);const s=new Vr;return s.absarc(0,0,t[0]/2-t[1],0,Math.PI*2,!0),n.holes.push(s),n}case"box":{const n=new Zn;e(t[1],t[0],n);const s=new Vr;return e(t[1]-2*t[3],t[0]-2*t[2],s),n.holes.push(s),n}case"I":{const[n,s,r,o]=t,a=new Zn,l=[[-s/2,-n/2],[s/2,-n/2],[s/2,-n/2+r],[o/2,-n/2+r],[o/2,n/2-r],[s/2,n/2-r],[s/2,n/2],[-s/2,n/2],[-s/2,n/2-r],[-o/2,n/2-r],[-o/2,-n/2+r],[-s/2,-n/2+r]];a.moveTo(...l[0]);for(const c of l.slice(1))a.lineTo(...c);return a.closePath(),a}case"unp":case"C":{const n=xu(i),s=new Zn;s.moveTo(...n[0]);for(const r of n.slice(1))s.lineTo(...r);return s.closePath(),s}case"general":{const n=wi(i),s=new Zn;return e(n.width,n.depth,s),s}}}class E_{constructor(t){ot(this,"renderer");ot(this,"labels");ot(this,"scene",new d0);ot(this,"persp",new Qe(45,1,.01,1e5));ot(this,"ortho",new hl(-1,1,1,-1,.001,1e6));ot(this,"camera",this.persp);ot(this,"useOrtho",!1);ot(this,"target",new D);ot(this,"azimuth",-Math.PI/3);ot(this,"elevation",Math.PI/6);ot(this,"distance",20);ot(this,"theme",wu);ot(this,"width",1);ot(this,"height",1);ot(this,"lineMats",[]);ot(this,"gridGroup",new _n);ot(this,"modelGroup",new _n);ot(this,"resultGroup",new _n);ot(this,"overlayGroup",new _n);ot(this,"jointTex",y_());ot(this,"hingeTex",S_());ot(this,"renderQueued",!1);ot(this,"animStart",0);ot(this,"deformed",null);ot(this,"data",null);ot(this,"selection",new Set);ot(this,"results",null);ot(this,"display",{jointLabels:!1,frameLabels:!1,areaLabels:!1,showLoads:!0,loadValues:!0,extruded:!1,showSupports:!0});ot(this,"resultOpts",{view:"none",deformScale:1,forceScale:1,animate:!1,showValues:!0});ot(this,"autoDeformScale",1);ot(this,"span",10);ot(this,"overlayObjs",[]);this.host=t,this.renderer=new u0({antialias:!0,alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.domElement.className="viewport-canvas",t.appendChild(this.renderer.domElement),this.labels=new s_,this.labels.domElement.className="viewport-labels",t.appendChild(this.labels.domElement),this.persp.up.set(0,0,1),this.ortho.up.set(0,0,1),this.scene.add(new j0(16777215,3359061,1.6));const e=new J0(16777215,1.4);e.position.set(1,-2,3),this.scene.add(e),this.scene.add(this.gridGroup,this.modelGroup,this.resultGroup,this.overlayGroup),new ResizeObserver(()=>this.resize()).observe(t),this.resize()}get canvas(){return this.renderer.domElement}setTheme(t){this.theme=t,this.rebuildAll()}resize(){const t=this.host.getBoundingClientRect();this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer.setSize(this.width,this.height),this.labels.setSize(this.width,this.height);for(const e of this.lineMats)e.resolution.set(this.width,this.height);this.updateCamera()}viewDir(){const t=Math.cos(this.elevation);return new D(t*Math.cos(this.azimuth),t*Math.sin(this.azimuth),Math.sin(this.elevation))}updateCamera(){const t=this.viewDir(),e=this.width/this.height,n=this.distance*Math.tan(fi.degToRad(this.persp.fov/2));this.persp.aspect=e,this.persp.near=Math.max(this.distance/2e3,1e-4),this.persp.far=this.distance*50+this.span*20,this.persp.position.copy(this.target).addScaledVector(t,this.distance),this.persp.lookAt(this.target),this.persp.updateProjectionMatrix();const s=this.distance+this.span*10;this.ortho.left=-n*e,this.ortho.right=n*e,this.ortho.top=n,this.ortho.bottom=-n,this.ortho.near=.001,this.ortho.far=s*2+this.span*10,this.ortho.position.copy(this.target).addScaledVector(t,s),this.ortho.lookAt(this.target),this.ortho.updateProjectionMatrix(),this.camera=this.useOrtho?this.ortho:this.persp,this.requestRender()}setOrtho(t){this.useOrtho=t,this.updateCamera()}orbit(t,e){this.azimuth-=t*.008,this.elevation=fi.clamp(this.elevation+e*.008,-Math.PI/2+.002,Math.PI/2-.002),this.updateCamera()}worldPerPixel(){return 2*this.distance*Math.tan(fi.degToRad(this.persp.fov/2))/this.height}pan(t,e){const n=this.worldPerPixel(),s=this.camera;s.updateMatrixWorld();const r=new D().setFromMatrixColumn(s.matrixWorld,0),o=new D().setFromMatrixColumn(s.matrixWorld,1);this.target.addScaledVector(r,-t*n).addScaledVector(o,e*n),this.updateCamera()}zoom(t,e,n){t=fi.clamp(t,.2,5);const s=fi.clamp(this.distance*t,this.span*.001+.001,this.span*200+100);if(t=s/this.distance,e!==void 0&&n!==void 0){const r=this.pointOnTargetPlane(e,n);r&&this.target.add(r.sub(this.target).multiplyScalar(1-t))}this.distance=s,this.updateCamera()}ndc(t,e){const n=this.canvas.getBoundingClientRect();return new mt((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1)}ray(t,e){const n=new K0;return n.setFromCamera(this.ndc(t,e),this.camera),n.ray}pointOnTargetPlane(t,e){const n=new In().setFromNormalAndCoplanarPoint(this.viewDir(),this.target);return this.ray(t,e).intersectPlane(n,new D)}workPlanePoint(t,e,n){if(!this.data)return null;const{workPlane:s}=this.data.settings,r=n??this.data.settings.elevation,o=s==="XY"?new D(0,0,1):s==="XZ"?new D(0,1,0):new D(1,0,0),a=new In(o,-r),l=this.ray(t,e);return Math.abs(l.direction.dot(o))<1e-4?null:l.intersectPlane(a,new D)}toScreen(t){const e=this.canvas.getBoundingClientRect(),n=t.clone().project(this.camera);return{x:e.left+(n.x+1)/2*e.width,y:e.top+(1-n.y)/2*e.height,behind:n.z>1||n.z<-1}}bounds(){const t=new Vn;if(this.data&&this.data.joints.length)for(const e of this.data.joints)t.expandByPoint(Qt(e));else{const e=this.data?this.data.settings.gridSpacing*Math.min(this.data.settings.gridLines,5):5;t.set(new D(-e,-e,0),new D(e,e,0))}return t}fit(){const e=this.bounds().getBoundingSphere(new Ci),n=Math.max(e.radius,1);this.target.copy(e.center);const s=fi.degToRad(this.persp.fov/2),r=this.width/this.height,o=n/Math.sin(s),a=n/Math.sin(Math.atan(Math.tan(s)*r));this.distance=Math.max(o,a)*1.08,this.updateCamera()}viewPreset(t){const e={top:[-Math.PI/2,Math.PI/2-.002],front:[-Math.PI/2,0],side:[0,0],iso:[-Math.PI/3,Math.PI/6]};[this.azimuth,this.elevation]=e[t],this.fit()}requestRender(){this.renderQueued||(this.renderQueued=!0,requestAnimationFrame(t=>{if(this.renderQueued=!1,this.resultOpts.animate&&this.deformed){const e=Math.sin((t-this.animStart)/1400*Math.PI*2);this.applyDeformation(e),this.requestRender()}this.renderer.render(this.scene,this.camera),this.labels.render(this.scene,this.camera)}))}clearGroup(t){const e=[...t.children];for(const n of e)t.remove(n),n.traverse(s=>{var a;const r=s;(a=r.geometry)==null||a.dispose();const o=r.material;if(o)for(const l of Array.isArray(o)?o:[o])l!==void 0&&(l instanceof Ga&&(this.lineMats=this.lineMats.filter(c=>c!==l)),l.dispose())})}lineMat(t,e,n={}){const s=new Ga({color:t??16777215,linewidth:e,vertexColors:t===null,transparent:(n.opacity??1)<1,opacity:n.opacity??1,dashed:n.dashed??!1,dashSize:this.span*.02,gapSize:this.span*.015});return s.resolution.set(this.width,this.height),this.lineMats.push(s),s}lines(t,e,n,s,r){const o=new mu;o.setPositions(t),s&&o.setColors(s);const a=new n_(o,this.lineMat(e,n,r));return r!=null&&r.dashed&&a.computeLineDistances(),a}label(t,e,n=""){const s=document.createElement("div");s.className="lbl "+n,s.textContent=t;const r=new i_(s);return r.position.copy(e),r}setData(t,e,n){this.data=t,this.selection=e,this.results=n,this.rebuildAll()}rebuildAll(){if(!this.data)return;this.scene.background=new jt(this.theme.bg);const t=this.bounds();this.span=Math.max(t.getSize(new D).length(),this.data.settings.gridSpacing*2,.001),this.computeAutoScales(),this.buildGrid(),this.buildModel(),this.buildResults(),this.requestRender()}glyph(){return this.span*.035}buildGrid(){this.clearGroup(this.gridGroup);const t=this.data,{gridSpacing:e,gridLines:n,workPlane:s,elevation:r}=t.settings,o=[],a=[],l=e*n,c=(u,f)=>s==="XY"?[u,f,r]:s==="XZ"?[u,r,f]:[r,u,f];for(let u=-n;u<=n;u++)(u===0?a:o).push(...c(u*e,-l),...c(u*e,l),...c(-l,u*e),...c(l,u*e));this.gridGroup.add(this.lines(o,this.theme.grid,1)),this.gridGroup.add(this.lines(a,this.theme.gridMajor,1.5));const h=Math.max(e,this.span*.08),d=this.lines([0,0,0,h,0,0,0,0,0,0,h,0,0,0,0,0,0,h],null,3,[1,.25,.25,1,.25,.25,.3,.85,.3,.3,.85,.3,.3,.5,1,.3,.5,1]);this.gridGroup.add(d),this.gridGroup.add(this.label("X",new D(h*1.15,0,0),"axis x")),this.gridGroup.add(this.label("Y",new D(0,h*1.15,0),"axis y")),this.gridGroup.add(this.label("Z",new D(0,0,h*1.15),"axis z"))}buildModel(){this.clearGroup(this.modelGroup);const t=this.data,e=this.theme,n=this.selection,s=new Map(t.joints.map(h=>[h.id,h])),r=this.results&&this.resultOpts.view!=="none"&&this.resultOpts.view!=="reactions",o=new jt(e.sel);for(const h of t.areas){const d=h.joints.map(m=>s.get(m)).filter(Boolean).map(m=>Qt(m));if(d.length<3)continue;const u=[];for(let m=1;m<d.length-1;m++)u.push(...d[0].toArray(),...d[m].toArray(),...d[m+1].toArray());const f=new Re;f.setAttribute("position",new fe(u,3));const p=n.has(Ue("a",h.id)),g=new Te(f,new As({color:p?e.sel:e.area,transparent:!0,opacity:r?.08:p?.45:.22,side:cn,depthWrite:!1}));if(g.renderOrder=-1,this.modelGroup.add(g),this.display.areaLabels){const m=d.reduce((v,_)=>v.add(_),new D).multiplyScalar(1/d.length);this.modelGroup.add(this.label("A"+h.id,m,"area"))}}const a=[],l=[],c=new jt(r?e.ghost:e.frame);for(const h of t.frames){const d=s.get(h.i),u=s.get(h.j);if(!d||!u)continue;a.push(d.x,d.y,d.z,u.x,u.y,u.z);const f=n.has(Ue("f",h.id))?o:c;l.push(f.r,f.g,f.b,f.r,f.g,f.b),this.display.frameLabels&&this.modelGroup.add(this.label("F"+h.id,Qt(d).add(Qt(u)).multiplyScalar(.5),"frame"))}if(a.length&&(this.display.extruded&&!r?this.buildExtruded(t,s):this.modelGroup.add(this.lines(a,null,3,l)),this.display.extruded&&r&&this.modelGroup.add(this.lines(a,null,2,l)),this.display.extruded&&!r)){const h=[];for(const d of t.frames){if(!n.has(Ue("f",d.id)))continue;const u=s.get(d.i),f=s.get(d.j);h.push(u.x,u.y,u.z,f.x,f.y,f.z)}h.length&&this.modelGroup.add(this.lines(h,e.sel,4))}if(!r){const h=[];for(const d of t.frames){const u=s.get(d.i),f=s.get(d.j);if(!u||!f)continue;const p=f.x-u.x,g=f.y-u.y,m=f.z-u.z,v=Math.hypot(p,g,m);if(v<=1e-6)continue;const _=Math.min(.08,.3/v);d.relI&&d.relI.some(Boolean)&&h.push(u.x+p*_,u.y+g*_,u.z+m*_),d.relJ&&d.relJ.some(Boolean)&&h.push(f.x-p*_,f.y-g*_,f.z-m*_)}if(h.length){const d=new Re;d.setAttribute("position",new fe(h,3));const u=new Lo(d,new Ir({size:11,sizeAttenuation:!1,map:this.hingeTex,transparent:!0,alphaTest:.1,depthTest:!1}));this.modelGroup.add(u)}}if(t.joints.length){const h=[],d=[],u=new jt(e.joint);for(const g of t.joints){h.push(g.x,g.y,g.z);const m=n.has(Ue("j",g.id))?o:u;if(d.push(m.r,m.g,m.b),this.display.jointLabels){const v=this.label(String(g.id),Qt(g),"joint");this.modelGroup.add(v)}}const f=new Re;f.setAttribute("position",new fe(h,3)),f.setAttribute("color",new fe(d,3));const p=new Lo(f,new Ir({size:13,sizeAttenuation:!1,map:this.jointTex,vertexColors:!0,alphaTest:.5,transparent:!0,depthTest:!1}));p.renderOrder=10,this.modelGroup.add(p)}this.display.showSupports&&this.buildSupports(t),this.display.showLoads&&!(this.results&&this.resultOpts.view!=="none")&&this.buildLoads(t,s)}buildExtruded(t,e){const n=new Map(t.sections.map((o,a)=>[o.name,a])),s=new Map,r=(o,a)=>{let l=s.get(o);return l||(l=new Nc({color:a,roughness:.6,metalness:.1}),s.set(o,l)),l};for(const o of t.frames){const a=e.get(o.i),l=e.get(o.j),c=t.sections.find(_=>_.name===o.section);if(!a||!l||!c)continue;const h=b_(c);if(!h)continue;const d=Math.hypot(l.x-a.x,l.y-a.y,l.z-a.z),u=new ml(h,{depth:d,bevelEnabled:!1,curveSegments:16}),f=Ha(Sr(a),Sr(l),o.beta),g=this.selection.has(Ue("f",o.id))?this.theme.sel:ih[(n.get(c.name)??0)%ih.length],m=new Te(u,r(String(g),g)),v=new se().makeBasis(Qt(f[2]).negate(),Qt(f[1]),Qt(f[0]));v.setPosition(a.x,a.y,a.z),m.applyMatrix4(v),this.modelGroup.add(m)}}arrow(t,e,n,s=2,r=!1){const o=new _n,a=e.clone().sub(t),l=a.length();if(l<1e-12)return o;a.normalize();const c=Math.min(l*.35,this.glyph()*.6),h=c*.35,d=e.clone().addScaledVector(a,-c*(r?1.6:.9));o.add(this.lines([...t.toArray(),...d.toArray()],n,s));const u=new As({color:n}),f=r?[e,e.clone().addScaledVector(a,-c*.8)]:[e];for(const p of f){const g=new Te(new Rs(h,c,12),u.clone());g.position.copy(p).addScaledVector(a,-c/2),g.quaternion.setFromUnitVectors(new D(0,1,0),a),o.add(g)}return u.dispose(),o}buildSupports(t){const e=this.glyph(),n=this.theme.support;for(const s of t.joints){if(!s.r.some(Boolean))continue;const r=s.r[0]&&s.r[1]&&s.r[2],o=s.r[3]&&s.r[4]&&s.r[5],a=Qt(s),l=new Nc({color:n,roughness:.7});let c;if(r&&o)c=new Te(new hs(e*1.6,e*1.6,e*.5),l),c.position.copy(a).add(new D(0,0,-e*.25));else if(r){const h=new Te(new Rs(e*.7,e*1.1,4),l);h.rotation.x=Math.PI/2,h.position.copy(a).add(new D(0,0,-e*.55)),c=h}else{const h=new _n,d=new Te(new Rs(e*.55,e*.8,4),l);d.rotation.x=Math.PI/2,d.position.set(0,0,-e*.4);const u=new Te(new gl(e*.22,12,8),l);u.position.set(0,0,-e*1),h.add(d,u),h.position.copy(a),c=h}this.modelGroup.add(c)}}buildLoads(t,e){const n=this.glyph(),s=this.theme.load,r=n*3,o=this.display.loadValues,a=new Map,l=new Map;for(const _ of t.jointLoads){const M=e.get(_.joint);if(!M)continue;const x=Qt(M),I=_.case?`${_.case}: `:"",T=new D(_.f[0],_.f[1],_.f[2]);if(T.lengthSq()>0){const P=T.clone().normalize();this.modelGroup.add(this.arrow(x.clone().addScaledVector(P,-r),x,s,2.5));let S=a.get(_.joint);S||(S={p:x,dir:P,lines:[]},a.set(_.joint,S)),S.lines.push(`${I}${Me(T.length(),"F")}`)}const R=new D(_.f[3],_.f[4],_.f[5]);if(R.lengthSq()>0){const P=R.clone().normalize();this.modelGroup.add(this.arrow(x,x.clone().addScaledVector(P,r*.9),s,2.5,!0));let S=l.get(_.joint);S||(S={p:x,dir:P,lines:[]},l.set(_.joint,S)),S.lines.push(`${I}${Me(R.length(),"M")}`)}}if(o){for(const _ of a.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.p.clone().addScaledVector(_.dir,-r*1.1),"load"));for(const _ of l.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.p.clone().addScaledVector(_.dir,r),"load"))}const c=new Map(t.frames.map(_=>[_.id,_])),h=_=>{const M=e.get(_.i),x=e.get(_.j);return{a:Qt(M),b:Qt(x),ax:Ha(Sr(M),Sr(x),_.beta)}},d=new Map;for(const _ of t.framePointLoads){const M=c.get(_.frame);if(!M||!e.has(M.i)||!e.has(M.j))continue;const{a:x,b:I,ax:T}=h(M),R=x.clone().lerp(I,_.rd),P=sh(_.dir,T).multiplyScalar(Math.sign(_.P)||1);this.modelGroup.add(this.arrow(R.clone().addScaledVector(P,-r),R,s,2.5));const S=`${M.id}_${Math.round(_.rd*1e3)}`;let y=d.get(S);y||(y={p:R,dir:P,lines:[]},d.set(S,y));const A=_.case?`${_.case}: `:"";y.lines.push(`${A}${Me(Math.abs(_.P),"F")}`)}if(o)for(const _ of d.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.p.clone().addScaledVector(_.dir,-r*1.1),"load"));const u=16486972,f=new Map,p=new Map;for(const _ of t.frameUniformLoads){const M=c.get(_.frame);if(!M||!e.has(M.i)||!e.has(M.j))continue;const{a:x,b:I,ax:T}=h(M),R=p.get(M.id)??0;p.set(M.id,R+1);const P=sh(_.dir,T).multiplyScalar(Math.sign(_.w)||1),S=r*.7*(1+R*.25),y=6,A=[];for(let k=0;k<=y;k++){const j=x.clone().lerp(I,k/y),G=j.clone().addScaledVector(P,-S);A.push(...G.toArray()),k>0&&k<y&&A.push(...G.toArray()),this.modelGroup.add(this.arrow(G,j,u,1.5))}this.modelGroup.add(this.lines(A,u,2));let V=f.get(M.id);V||(V={mid:x.clone().lerp(I,.5).addScaledVector(P,-r*.7*1.15),lines:[]},f.set(M.id,V));const F=_.case?`${_.case}: `:"";V.lines.push(`${F}${Me(Math.abs(_.w),"FL")}`)}if(o)for(const _ of f.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.mid,"load uload"));const g=new Map(t.areas.map(_=>[_.id,_])),m=new Map,v=new Set;for(const _ of t.areaLoads){const M=g.get(_.area);if(!M)continue;const x=M.joints.map(S=>e.get(S)).filter(Boolean).map(S=>Qt(S));if(x.length<3)continue;const I=x.reduce((S,y)=>S.add(y),new D).multiplyScalar(1/x.length),T=new D(0,0,Math.sign(_.q)>=0?-1:1);if(!v.has(M.id)){v.add(M.id);const S=[I,...x.map(y=>y.clone().lerp(I,.45))];for(const y of S)this.modelGroup.add(this.arrow(y.clone().addScaledVector(T,-r*.8),y,1357990,1.5))}let R=m.get(M.id);R||(R={c:I,dir:T,lines:[]},m.set(M.id,R));const P=_.case?`${_.case}: `:"";R.lines.push(`${P}${Me(Math.abs(_.q),"FA")}`)}if(o)for(const _ of m.values()){const M=_.c.clone().addScaledVector(_.dir,-r*.95);this.modelGroup.add(this.label(_.lines.join(`
`),M,"load aload"))}}computeAutoScales(){const t=this.results;this.autoDeformScale=t&&t.stats.maxDisp>1e-15?this.span*.08/t.stats.maxDisp:1}setResults(t){this.results=t,this.computeAutoScales()}setResultOptions(t){const e=this.resultOpts.view;Object.assign(this.resultOpts,t),t.animate&&(this.animStart=performance.now()),e!==this.resultOpts.view&&this.buildModel(),!this.resultOpts.animate&&this.deformed&&this.applyDeformation(1),this.buildResults(),this.requestRender()}applyDeformation(t){const e=this.deformed,n=e.geo.attributes.instanceStart,s=n.data.array;for(let r=0;r<s.length;r++)s[r]=e.base[r]+e.delta[r]*t;n.data.needsUpdate=!0,e.geo.computeBoundingSphere()}buildResults(){this.clearGroup(this.resultGroup),this.deformed=null;const t=this.results,e=this.data;if(!t||!e)return;const n=this.resultOpts.view;n==="deformed"?this.buildDeformed(t,e):$a.includes(n)&&this.buildDiagram(t,n),(n==="reactions"||n==="deformed"||$a.includes(n))&&n==="reactions"&&this.buildReactions(t,e)}buildDeformed(t,e){const n=this.resultOpts.deformScale,s=new Map(e.joints.map(c=>[c.id,c])),r=[],o=[];for(const c of t.frames){const h=e.frames.find(f=>f.id===c.id);if(!h)continue;const d=Qt(s.get(h.i)),u=Qt(c.axes[0]);for(let f=0;f<c.x.length-1;f++)for(const p of[f,f+1]){const g=d.clone().addScaledVector(u,c.x[p]);r.push(g.x,g.y,g.z);const m=c.disp[p];o.push(m[0]*n,m[1]*n,m[2]*n)}}if(!r.length)return;const a=r.map((c,h)=>c+o[h]),l=this.lines(a,this.theme.deformed,3);if(this.resultGroup.add(l),this.deformed={geo:l.geometry,base:new Float32Array(r),delta:new Float32Array(o)},this.resultOpts.showValues){let c=-1,h=0;for(const[u,f]of Object.entries(t.disp)){const p=Math.hypot(f[0],f[1],f[2]);p>c&&(c=p,h=Number(u))}const d=s.get(h);if(d&&c>0){const u=t.disp[h],f=Qt(d).add(new D(u[0],u[1],u[2]).multiplyScalar(n));this.resultGroup.add(this.label(`max ${kn(c/ln().kSmall)} ${ln().small} (J${h})`,f,"result"))}}}buildDiagram(t,e){const n=this.data,s=new Map(n.joints.map(g=>[g.id,g]));let r=0;for(const g of t.frames)for(const m of g[e])r=Math.max(r,Math.abs(m));if(r<1e-9){this.resultGroup.add(this.label(`${e} = 0 everywhere`,this.target.clone(),"result"));return}const o=this.span*.12/r*this.resultOpts.forceScale,a=e==="P"||e==="V2"||e==="V3"?"F":"M",l=[],c=[],h=[],d=new jt(this.theme.pos),u=new jt(this.theme.neg);for(const g of t.frames){const m=n.frames.find(P=>P.id===g.id);if(!m)continue;const v=Qt(s.get(m.i)),_=Qt(g.axes[0]),M=e==="M3"?Qt(g.axes[1]).negate():Qt(e==="M2"||e==="V3"?g.axes[2]:g.axes[1]),x=g[e],I=P=>v.clone().addScaledVector(_,g.x[P]),T=P=>I(P).addScaledVector(M,x[P]*o);for(let P=0;P<g.x.length-1;P++){const S=I(P),y=I(P+1),A=T(P),V=T(P+1),F=x[P]>=0?d:u,k=x[P+1]>=0?d:u;l.push(...S.toArray(),...A.toArray(),...y.toArray(),...A.toArray(),...V.toArray(),...y.toArray());for(const j of[F,F,k,F,k,k])c.push(j.r,j.g,j.b);h.push(...A.toArray(),...V.toArray())}h.push(...I(0).toArray(),...T(0).toArray());const R=g.x.length-1;if(h.push(...I(R).toArray(),...T(R).toArray()),this.resultOpts.showValues){const P=new Set([0,R]);let S=0;for(let y=1;y<R;y++)Math.abs(x[y])>Math.abs(x[S])&&(S=y);Math.abs(x[S])>Math.max(Math.abs(x[0]),Math.abs(x[R]))*1.02&&P.add(S);for(const y of P)Math.abs(x[y])<r*.01||this.resultGroup.add(this.label(qt(x[y],a,3),T(y),"result small"))}}const f=new Re;f.setAttribute("position",new fe(l,3)),f.setAttribute("color",new fe(c,3));const p=new Te(f,new As({vertexColors:!0,transparent:!0,opacity:.45,side:cn,depthWrite:!1}));this.resultGroup.add(p),this.resultGroup.add(this.lines(h,this.theme.frame,1.5,void 0,{opacity:.8}))}buildReactions(t,e){const n=new Map(e.joints.map(h=>[h.id,h])),s=this.glyph()*3,r=this.theme.reaction;let o=0;for(const h of Object.values(t.reactions))o=Math.max(o,Math.abs(h[0]),Math.abs(h[1]),Math.abs(h[2]));const a=Math.max(o*1e-6,1e-9),l=[new D(1,0,0),new D(0,1,0),new D(0,0,1)],c=["FX","FY","FZ","MX","MY","MZ"];for(const[h,d]of Object.entries(t.reactions)){const u=n.get(Number(h));if(!u)continue;const f=Qt(u),p=[];for(let g=0;g<3;g++){if(Math.abs(d[g])<=a)continue;const m=l[g].clone().multiplyScalar(Math.sign(d[g]));this.resultGroup.add(this.arrow(f.clone().addScaledVector(m,-s),f,r,3)),p.push(`${c[g]} ${Me(d[g],"F")}`)}for(let g=3;g<6;g++){if(Math.abs(d[g])<=a)continue;const m=l[g-3].clone().multiplyScalar(Math.sign(d[g]));this.resultGroup.add(this.arrow(f,f.clone().addScaledVector(m,s*.8),r,3,!0)),p.push(`${c[g]} ${Me(d[g],"M")}`)}this.resultOpts.showValues&&p.length&&this.resultGroup.add(this.label(`J${h}
`+p.join(`
`),f.clone().add(new D(0,0,-s*.6)),"result react"))}}setOverlay(t,e){for(const n of this.overlayObjs)this.overlayGroup.remove(n);if(this.clearGroup(this.overlayGroup),this.overlayObjs=[],t&&t.length){const n=[];for(const[r,o]of t)n.push(...r.toArray(),...o.toArray());const s=this.lines(n,this.theme.sel,2,void 0,{dashed:!0});this.overlayGroup.add(s)}if(e){const n=new Re;n.setAttribute("position",new fe(e.toArray(),3));const s=new Lo(n,new Ir({size:20,sizeAttenuation:!1,map:this.jointTex,color:this.theme.sel,transparent:!0,opacity:.6,depthTest:!1}));s.renderOrder=20,this.overlayGroup.add(s)}this.requestRender()}pick(t,e,n){const s=this.data;if(!s)return null;let r=null,o=n;for(const h of s.joints){const d=this.toScreen(Qt(h));if(d.behind)continue;const u=Math.hypot(d.x-t,d.y-e);u<o&&(o=u,r=Ue("j",h.id))}if(r)return r;const a=new Map(s.joints.map(h=>[h.id,h]));o=n;for(const h of s.frames){const d=a.get(h.i),u=a.get(h.j);if(!d||!u)continue;const f=this.toScreen(Qt(d)),p=this.toScreen(Qt(u));if(f.behind&&p.behind)continue;const g=w_(t,e,f.x,f.y,p.x,p.y);g<o&&(o=g,r=Ue("f",h.id))}if(r)return r;let l=1/0;const c=this.camera.position;for(const h of s.areas){const d=h.joints.map(g=>a.get(g)).filter(Boolean);if(d.length<3)continue;const u=d.map(g=>this.toScreen(Qt(g)));if(u.some(g=>g.behind)||!A_(t,e,u))continue;const p=d.reduce((g,m)=>g.add(Qt(m)),new D).multiplyScalar(1/d.length).distanceTo(c);p<l&&(l=p,r=Ue("a",h.id))}return r}boxPick(t,e,n,s,r){const o=this.data;if(!o)return[];const a=Math.min(t,n),l=Math.max(t,n),c=Math.min(e,s),h=Math.max(e,s),d=g=>!g.behind&&g.x>=a&&g.x<=l&&g.y>=c&&g.y<=h,u=new Map(o.joints.map(g=>[g.id,this.toScreen(Qt(g))])),f=[];for(const g of o.joints)d(u.get(g.id))&&f.push(Ue("j",g.id));const p=(g,m)=>T_(g.x,g.y,m.x,m.y,a,c,l,h);for(const g of o.frames){const m=u.get(g.i),v=u.get(g.j);!m||!v||(r?d(m)||d(v)||p(m,v):d(m)&&d(v))&&f.push(Ue("f",g.id))}for(const g of o.areas){const m=g.joints.map(_=>u.get(_)).filter(Boolean);if(!m.length)continue;(r?m.some(d)||m.some((_,M)=>p(_,m[(M+1)%m.length])):m.every(d))&&f.push(Ue("a",g.id))}return f}jointScreen(t){return this.toScreen(Qt(t))}dispose(){this.renderer.dispose()}}function w_(i,t,e,n,s,r){const o=s-e,a=r-n,l=o*o+a*a;let c=l>0?((i-e)*o+(t-n)*a)/l:0;return c=Math.max(0,Math.min(1,c)),Math.hypot(i-(e+c*o),t-(n+c*a))}function A_(i,t,e){let n=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const o=e[s],a=e[r];o.y>t!=a.y>t&&i<(a.x-o.x)*(t-o.y)/(a.y-o.y)+o.x&&(n=!n)}return n}function br(i,t,e,n,s,r,o,a){const l=(c,h,d,u,f,p)=>Math.sign((d-c)*(p-h)-(u-h)*(f-c));return l(i,t,e,n,s,r)!==l(i,t,e,n,o,a)&&l(s,r,o,a,i,t)!==l(s,r,o,a,e,n)}function T_(i,t,e,n,s,r,o,a){return br(i,t,e,n,s,r,o,r)||br(i,t,e,n,o,r,o,a)||br(i,t,e,n,o,a,s,a)||br(i,t,e,n,s,a,s,r)}const C_=550;class R_{constructor(t,e){ot(this,"pts",new Map);ot(this,"mode","idle");ot(this,"lpTimer");ot(this,"lastPinch",0);ot(this,"lastMid",{x:0,y:0});ot(this,"down",t=>{var e,n;if(this.el.setPointerCapture(t.pointerId),this.pts.set(t.pointerId,{x:t.clientX,y:t.clientY,sx:t.clientX,sy:t.clientY,t:performance.now(),type:t.pointerType,button:t.button}),this.pts.size===1)this.mode="pending",t.pointerType!=="mouse"&&(this.lpTimer=window.setTimeout(()=>{var s;this.mode==="pending"&&this.pts.size===1&&(this.mode="done",(s=navigator.vibrate)==null||s.call(navigator,15),this.h.longPress(t.clientX,t.clientY,t))},C_));else if(this.pts.size===2){this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.mode="multi";const[s,r]=[...this.pts.values()];this.lastPinch=Math.hypot(s.x-r.x,s.y-r.y),this.lastMid={x:(s.x+r.x)/2,y:(s.y+r.y)/2}}t.preventDefault()});ot(this,"move",t=>{var r,o,a,l;const e=this.pts.get(t.pointerId);if(!e){t.pointerType==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}const n=t.clientX-e.x,s=t.clientY-e.y;if(e.x=t.clientX,e.y=t.clientY,this.mode==="multi"&&this.pts.size>=2){const[c,h]=[...this.pts.values()],d=Math.hypot(c.x-h.x,c.y-h.y),u={x:(c.x+h.x)/2,y:(c.y+h.y)/2};this.h.pan(u.x-this.lastMid.x,u.y-this.lastMid.y),this.lastPinch>0&&d>0&&this.h.zoom(this.lastPinch/d,u.x,u.y),this.lastPinch=d,this.lastMid=u;return}if(this.mode==="pending"){if(Math.hypot(t.clientX-e.sx,t.clientY-e.sy)<this.slop(e.type)){e.type==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}this.clearLP(),!t.shiftKey&&(e.type==="mouse"?e.button===2:!0)&&this.h.drag&&((o=(r=this.h).wantsDrag)!=null&&o.call(r,e.sx,e.sy,t))?(this.mode="drag",this.h.drag(e.sx,e.sy,"start")):e.button===1||e.button===2||t.shiftKey?this.mode="pan":this.h.wantsBox(t)?this.mode="box":this.mode="orbit"}this.mode==="orbit"?this.h.orbit(n,s):this.mode==="pan"?this.h.pan(n,s):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"move"):this.mode==="drag"&&((l=(a=this.h).drag)==null||l.call(a,t.clientX,t.clientY,"move"))});ot(this,"up",t=>{var n,s;const e=this.pts.get(t.pointerId);e&&(this.pts.delete(t.pointerId),this.clearLP(),this.mode==="pending"&&this.pts.size===0?e.button===2&&e.type==="mouse"?this.h.longPress(t.clientX,t.clientY,t):(e.button===0||e.type!=="mouse")&&this.h.tap(t.clientX,t.clientY,t):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"end"):this.mode==="drag"&&((s=(n=this.h).drag)==null||s.call(n,t.clientX,t.clientY,"end")),this.pts.size===0?this.mode="idle":this.mode==="multi"&&this.pts.size===1&&(this.mode="done"))});ot(this,"cancel",t=>{var e,n;this.pts.delete(t.pointerId),this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.pts.size===0&&(this.mode="idle")});ot(this,"wheel",t=>{t.preventDefault();let e=t.deltaY;t.deltaMode===1&&(e*=30);const n=t.ctrlKey?.01:.0015;this.h.zoom(Math.exp(e*n),t.clientX,t.clientY)});this.el=t,this.h=e,t.style.touchAction="none",t.addEventListener("pointerdown",this.down),t.addEventListener("pointermove",this.move),t.addEventListener("pointerup",this.up),t.addEventListener("pointercancel",this.cancel),t.addEventListener("lostpointercapture",n=>this.pts.has(n.pointerId)&&this.cancel(n)),t.addEventListener("wheel",this.wheel,{passive:!1}),t.addEventListener("contextmenu",n=>n.preventDefault());for(const n of["gesturestart","gesturechange","gestureend"])t.addEventListener(n,s=>s.preventDefault())}slop(t){return t==="mouse"?4:10}clearLP(){this.lpTimer!==void 0&&clearTimeout(this.lpTimer),this.lpTimer=void 0}}function C(i,t=null,...e){const n=document.createElement(i);if(t)for(const[s,r]of Object.entries(t))r==null||r===!1||(s.startsWith("on")&&typeof r=="function"?n.addEventListener(s.slice(2).toLowerCase(),r):s==="class"?n.className=String(r):s==="style"&&typeof r=="object"?Object.assign(n.style,r):s in n&&typeof r!="string"?n[s]=r:n.setAttribute(s,r===!0?"":String(r)));for(const s of e)s!=null&&s!==!1&&n.append(s);return n}function rh(i){const t=i.trim().replace(/\s/g,"").replace(",",".");return t===""?NaN:Number(t)}function oe(i,t,e={}){const n=e.q,s=c=>String(n?x_(c,n):c),r=C("input",{type:"text",inputmode:"decimal",autocomplete:"off",spellcheck:"false",value:t===null||!Number.isFinite(t)?"":s(t),placeholder:e.mixed?"(mixed)":e.placeholder??""}),o=C("div",{class:"field-err"}),a=C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},r,e.unit||n?C("span",{class:"unit"},n?Yt(n):e.unit):null),o),l=()=>{const c=rh(r.value);let h="";return r.value.trim()===""&&e.mixed?h="":Number.isFinite(c)?e.positive&&c<=0?h="Must be > 0":e.min!==void 0&&c<e.min?h=`Must be ≥ ${e.min}`:e.max!==void 0&&c>e.max&&(h=`Must be ≤ ${e.max}`):h="Enter a number",o.textContent=h,a.classList.toggle("invalid",!!h),!h};return r.addEventListener("input",l),r.addEventListener("focus",()=>r.select()),{row:a,input:r,get:()=>{if(!l())return NaN;const c=rh(r.value);return n&&Number.isFinite(c)?Eu(c,n):c},set:c=>{r.value=s(c),l()}}}function Gs(i,t){const e=C("input",{type:"text",value:t,autocomplete:"off",spellcheck:"false"});return{row:C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},e)),input:e,get:()=>e.value.trim(),set:s=>e.value=s}}function tn(i,t,e){const n=C("select",null,...t.map(([r,o])=>C("option",{value:r,selected:r===e},o)));return n.addEventListener("change",()=>n.blur()),{row:C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},n)),input:n,get:()=>n.value,set:r=>n.value=r}}function _l(i,t){const e=C("input",{type:"checkbox",checked:t});return{row:C("label",{class:"check"},e,C("span",null,i)),input:e,get:()=>e.checked,set:s=>e.checked=s}}let ja=0;const L_=()=>ja>0;function ae(i){const t=C("div",{class:"dlg-backdrop"}),e=()=>{var l;t.isConnected&&(t.remove(),ja--,document.removeEventListener("keydown",o,!0),(l=i.onClose)==null||l.call(i))},n=async l=>{(l.action?await l.action():void 0)!==!1&&e()},s=i.buttons.map(l=>C("button",{class:"btn "+(l.kind??"plain"),type:"button",onclick:()=>n(l)},l.label)),r=C("div",{class:"dlg"+(i.wide?" wide":""),role:"dialog","aria-modal":"true","aria-label":i.title},C("div",{class:"dlg-head"},C("h2",null,i.title),C("button",{class:"icon-btn","aria-label":"Close",onclick:e},"✕")),C("div",{class:"dlg-body"},i.body),C("div",{class:"dlg-foot"},...s));t.append(r),t.addEventListener("pointerdown",l=>{l.target===t&&e()});const o=l=>{if(l.key==="Escape")l.stopPropagation(),e();else if(l.key==="Enter"&&!(l.target instanceof HTMLTextAreaElement)&&!(l.target instanceof HTMLButtonElement)){const c=i.buttons.find(h=>h.kind==="primary");c&&(l.preventDefault(),l.stopPropagation(),n(c))}};if(document.addEventListener("keydown",o,!0),document.body.append(t),ja++,!("ontouchstart"in window||navigator.maxTouchPoints&&navigator.maxTouchPoints>0)&&matchMedia("(pointer: fine)").matches){const l=r.querySelector('.dlg-body input:not([type="checkbox"]):not([type="radio"])');l==null||l.focus()}return{close:e,el:r}}function os(i,t,e="OK",n=!1){return new Promise(s=>{let r=!1;ae({title:i,body:C("p",{class:"msg"},t),buttons:[{label:"Cancel"},{label:e,kind:n?"danger":"primary",action:()=>void(r=!0)}],onClose:()=>s(r)})})}function vi(i,t){return new Promise(e=>{ae({title:i,body:typeof t=="string"?C("p",{class:"msg"},t):t,buttons:[{label:"OK",kind:"primary"}],onClose:()=>e()})})}let Er=null;function $t(i,t="info",e=3200){Er||(Er=C("div",{class:"toasts","aria-live":"polite"}),document.body.append(Er));const n=C("div",{class:"toast "+t},i);Er.append(n),setTimeout(()=>{n.classList.add("out"),setTimeout(()=>n.remove(),300)},e)}let Qn=null;document.addEventListener("change",i=>{i.target instanceof HTMLSelectElement&&i.target.blur()},!0);function Wr(){var i,t;(t=(i=document.activeElement)==null?void 0:i.blur)==null||t.call(i),Qn==null||Qn.close()}function oh(i,t,e,n){var d,u;Wr();const s=C("div",{class:"popup-menu",role:"menu"});for(const f of i){if(f.separator){s.append(C("div",{class:"sep"}));continue}if(f.heading){s.append(C("div",{class:"menu-heading"},f.heading));continue}const p=((d=f.disabled)==null?void 0:d.call(f))??!1,g=(u=f.checked)==null?void 0:u.call(f),m=C("button",{class:"menu-item",role:"menuitem",type:"button",disabled:p,onclick:()=>{var v;Wr(),(v=f.action)==null||v.call(f)}},C("span",{class:"mi-check"},g===void 0?"":g?"✓":""),C("span",{class:"mi-label"},f.label??""),C("span",{class:"mi-short"},f.shortcut??""));s.append(m)}s.addEventListener("contextmenu",f=>f.preventDefault()),document.body.append(s);const r=s.getBoundingClientRect();let o=t,a=e;if(n){const f=n.getBoundingClientRect();o=f.left,a=f.bottom+2}o=Math.max(4,Math.min(o,window.innerWidth-r.width-4)),a+r.height>window.innerHeight-4&&(a=Math.max(4,(n?n.getBoundingClientRect().top:e)-r.height-2)),s.style.left=o+"px",s.style.top=Math.max(4,a)+"px",s.style.maxHeight=window.innerHeight-8+"px";const l=f=>{!s.contains(f.target)&&f.target!==n&&h()},c=f=>{f.key==="Escape"&&h()},h=()=>{s.remove(),document.removeEventListener("pointerdown",l,!0),document.removeEventListener("keydown",c,!0),n==null||n.classList.remove("open"),(Qn==null?void 0:Qn.el)===s&&(Qn=null)};setTimeout(()=>{document.addEventListener("pointerdown",l,!0),document.addEventListener("keydown",c,!0)},0),n==null||n.classList.add("open"),Qn={el:s,close:h}}const P_=i=>i.classList.contains("open"),Au={select:"Tap an object to select it. Drag to rotate, two fingers to pan/zoom. Long-press for options. Drag a selected joint (right-drag with a mouse) to move it.",joint:"Tap the grid to place joints (snaps to grid and existing joints).",frame:"Tap start and end points to draw frames; drawing continues from the last point. Tap Done to stop.",area:"Tap the corner points of the area, then tap the first point again or Done to close it.",box:"Drag a box: left→right selects objects fully inside, right→left selects anything touched."};class D_{constructor(t){ot(this,"tool","select");ot(this,"multi",!1);ot(this,"chain",[]);ot(this,"hoverSnap",null);ot(this,"boxEl");ot(this,"dragState",null);this.app=t,this.boxEl=document.createElement("div"),this.boxEl.className="select-box",this.boxEl.hidden=!0,document.body.append(this.boxEl)}setTool(t){this.finishChain(!1),this.tool=t,this.hoverSnap=null,this.updateOverlay(),this.app.onToolChanged()}tol(t){return t.pointerType==="mouse"?12:24}snap(t,e,n){const s=this.app.viewer,r=this.app.model.data;let o=null,a=this.tol(n);for(const p of r.joints){const g=s.jointScreen(p);if(g.behind)continue;const m=Math.hypot(g.x-t,g.y-e);m<a&&(a=m,o={pos:new D(p.x,p.y,p.z),joint:p.id})}if(o)return o;const l=s.workPlanePoint(t,e);if(!l)return null;const{gridSpacing:c,workPlane:h,elevation:d}=r.settings,u=p=>Math.round(p/c)*c;h==="XY"?l.set(u(l.x),u(l.y),d):h==="XZ"?l.set(u(l.x),d,u(l.z)):l.set(d,u(l.y),u(l.z));const f=p=>Math.round(p*1e9)/1e9;return l.set(f(l.x),f(l.y),f(l.z)),{pos:l,joint:null}}jointAt(t){return t.joint??this.app.model.addJoint(t.pos.x,t.pos.y,t.pos.z)}tap(t,e,n){const s=this.app.model;switch(this.tool){case"select":case"box":{const r=this.app.viewer.pick(t,e,this.tol(n)),o=this.multi||n.shiftKey||n.ctrlKey||n.metaKey;r?this.app.select([r],o?"toggle":"replace"):o||this.app.select([],"replace");break}case"joint":{const r=this.snap(t,e,n);if(!r)return $t("Point is not on the work plane – rotate the view or change the work plane.","warn");const o=this.jointAt(r);this.app.select([Ue("j",o)],"replace");break}case"frame":{const r=this.snap(t,e,n);if(!r)return $t("Point is not on the work plane – rotate the view or change the work plane.","warn");s.commit("draw frame",()=>{const o=this.jointAt(r),a=this.chain[0];if(a!==void 0&&a!==o){const l=s.addFrame(a,o);l!==null&&this.app.select([Ue("f",l)],"replace")}this.chain=[o]});break}case"area":{const r=this.snap(t,e,n);if(!r)return $t("Point is not on the work plane – rotate the view or change the work plane.","warn");if(r.joint!==null&&this.chain.length>=3&&r.joint===this.chain[0]){this.finishChain(!0);break}if(r.joint!==null&&this.chain.includes(r.joint))return $t("Joint already used in this area","warn");this.chain.push(this.jointAt(r));break}}this.updateOverlay(),this.app.updateStatus()}hover(t,e,n){var s;(this.tool==="joint"||this.tool==="frame"||this.tool==="area")&&(this.hoverSnap=this.snap(t,e,n),this.updateOverlay(),this.app.setCoordReadout(((s=this.hoverSnap)==null?void 0:s.pos)??null))}wantsBox(t){return this.tool==="box"||this.tool==="select"&&t.pointerType==="mouse"&&(t.ctrlKey||t.metaKey)}box(t,e,n,s,r){const o=this.boxEl;if(r==="cancel"){o.hidden=!0;return}const a=n<t;if(r==="move"){o.hidden=!1,o.classList.toggle("crossing",a),Object.assign(o.style,{left:Math.min(t,n)+"px",top:Math.min(e,s)+"px",width:Math.abs(n-t)+"px",height:Math.abs(s-e)+"px"});return}o.hidden=!0;const l=this.app.viewer.boxPick(t,e,n,s,a);this.app.select(l,this.multi?"add":"replace"),$t(`${l.length} object(s) ${a?"touched":"inside box"}`,"info",1500)}wantsDrag(t,e,n){if(this.chain.length)return!1;const s=[...this.app.selection];if(s.length!==1)return!1;const{kind:r,id:o}=Is(s[0]);if(r!=="j")return!1;const a=this.app.model.joint(o);if(!a)return!1;const l=this.app.viewer.jointScreen(a);return!l.behind&&Math.hypot(l.x-t,l.y-e)<=this.tol(n)}dragTarget(t,e,n){const s=this.app.model.joint(t);if(!s)return null;const{gridSpacing:r,workPlane:o}=this.app.model.data.settings,a=o==="XY"?s.z:o==="XZ"?s.y:s.x,l=this.app.viewer.workPlanePoint(e,n,a);if(!l)return null;const c=h=>Math.round(Math.round(h/r)*r*1e9)/1e9;return o==="XY"?l.set(c(l.x),c(l.y),s.z):o==="XZ"?l.set(c(l.x),s.y,c(l.z)):l.set(s.x,c(l.y),c(l.z)),l}drag(t,e,n){if(n==="start"){const{id:d}=Is([...this.app.selection][0]);this.dragState={id:d,target:null};return}const s=this.dragState;if(!s)return;const r=this.app.model;if(n==="cancel"){this.dragState=null,this.updateOverlay(),this.app.setCoordReadout(null);return}if(n==="move"){if(s.target=this.dragTarget(s.id,t,e)??s.target,!s.target)return;const d=[],u=r.jointMap(),f=p=>{const g=u.get(p);return p===s.id?s.target:new D(g.x,g.y,g.z)};for(const p of r.data.frames)(p.i===s.id||p.j===s.id)&&d.push([f(p.i),f(p.j)]);for(const p of r.data.areas){const g=p.joints.indexOf(s.id);if(g<0)continue;const m=p.joints.length;d.push([f(p.joints[(g+m-1)%m]),s.target],[s.target,f(p.joints[(g+1)%m])])}this.app.viewer.setOverlay(d,s.target),this.app.setCoordReadout(s.target);return}this.dragState=null;const o=r.joint(s.id);if(this.updateOverlay(),this.app.setCoordReadout(null),!o||!s.target)return;const a=s.target.x-o.x,l=s.target.y-o.y,c=s.target.z-o.z;if(Math.abs(a)+Math.abs(l)+Math.abs(c)<1e-12)return;const h=r.moveJoints(new Set([s.id]),a,l,c);h&&$t(h,"warn")}finishChain(t=!0){if(this.tool==="area"&&t&&this.chain.length>=3){const e=this.app.model.addArea(this.chain);e!==null&&this.app.select([Ue("a",e)],"replace")}else this.tool==="area"&&t&&this.chain.length>0&&$t("An area needs at least 3 points","warn");this.chain=[],this.updateOverlay(),this.app.updateStatus()}cancel(){this.chain.length?(this.chain=[],this.updateOverlay()):this.app.select([],"replace"),this.app.updateStatus()}updateOverlay(){var a;const t=this.app.viewer,e=this.app.model,n=this.chain.map(l=>e.joint(l)).filter(Boolean).map(l=>new D(l.x,l.y,l.z)),s=[],r=(a=this.hoverSnap)==null?void 0:a.pos;if(this.tool==="frame"&&n.length&&r&&s.push([n[0],r]),this.tool==="area"&&n.length){for(let c=0;c+1<n.length;c++)s.push([n[c],n[c+1]]);const l=r??n[n.length-1];r&&s.push([n[n.length-1],r]),n.length>=2&&s.push([l,n[0]])}let o=null;(this.tool==="joint"||this.tool==="frame"||this.tool==="area")&&(o=r??(n.length?n[n.length-1]:null)),t.setOverlay(s,o)}statusText(){return this.tool==="frame"&&this.chain.length?`Frame from joint ${this.chain[0]} – tap the next point, or Done to stop.`:this.tool==="area"&&this.chain.length?`Area: ${this.chain.length} point(s) [${this.chain.join(", ")}] – tap the next point, the first point, or Done.`:Au[this.tool]}static valid(t,e){const{kind:n,id:s}=Is(e),r=t.model;return n==="j"?!!r.joint(s):n==="f"?!!r.frame(s):!!r.area(s)}}function zo(i,t){let e;switch(i){case"L1":return[1,0,0];case"L2":return[0,1,0];case"L3":return[0,0,1];case"GX":e=[1,0,0];break;case"GY":e=[0,1,0];break;case"GZ":e=[0,0,1];break;case"GRAV":e=[0,0,-1];break}return[Ur(t[0],e),Ur(t[1],e),Ur(t[2],e)]}function I_(i){let t=0,e=0,n=0;for(let s=0;s<i.length;s++){const r=i[s],o=i[(s+1)%i.length];t+=(r[1]-o[1])*(r[2]+o[2]),e+=(r[2]-o[2])*(r[0]+o[0]),n+=(r[0]-o[0])*(r[1]+o[1])}return Math.hypot(t,e,n)/2}function U_(i,t,e){const n=Ds(t,i),s=zs(n),r=[n[0]/s,n[1]/s,n[2]/s],o=Math.min(Math.max(Ur(Ds(e,i),r),0),s),a=zs(Ss(Ds(e,i),r));return[[0,0],[o,a],[s,0]]}function N_(i){let t=0;for(let e=0;e+1<i.length;e++)t+=(i[e+1][0]-i[e][0])*(i[e][1]+i[e+1][1])/2;return t}function F_(i,t,e,n){const s=i.length,r=i.map((c,h)=>zs(Ds(i[(h+1)%s],c)));let o;if(s===4&&t==="one-way"){const c=(r[0]+r[2])/2,h=(r[1]+r[3])/2,d=c>=h,u=d?h:c;o=r.map((f,p)=>p%2===0===d?[[0,u/2],[f,u/2]]:[[0,0],[f,0]])}else if(s===4){const h=Math.min((r[0]+r[2])/2,(r[1]+r[3])/2)/2;o=r.map(d=>d>2*h?[[0,0],[h,h],[d-h,h],[d,0]]:[[0,0],[d/2,d/2],[d,0]])}else{t==="one-way"&&e.push(`Area ${n}: one-way distribution needs 4 joints; two-way used.`);let c;if(s===3){const[h,d,u]=i,f=r[1],p=r[2],g=r[0],m=f+p+g;c=[(f*h[0]+p*d[0]+g*u[0])/m,(f*h[1]+p*d[1]+g*u[1])/m,(f*h[2]+p*d[2]+g*u[2])/m]}else{c=[0,0,0];for(const h of i)c[0]+=h[0]/s,c[1]+=h[1]/s,c[2]+=h[2]/s}o=i.map((h,d)=>U_(h,i[(d+1)%s],c))}const a=o.reduce((c,h)=>c+N_(h),0),l=I_(i);if(a>0){const c=l/a;for(const h of o)for(const d of h)d[1]*=c}return o}function O_(i,t,e){const n=new Map,s=new Map;for(const o of i.frames)s.set(`${o.i}-${o.j}`,o),s.set(`${o.j}-${o.i}`,o);const r=new Map;for(const o of i.areaLoads)r.set(o.area,(r.get(o.area)??0)+o.q);for(const o of i.areas){const a=r.get(o.id)??0;if(!a)continue;const l=o.joints.map(u=>t.get(u));if(l.some(u=>!u)){e.push(`Area ${o.id}: references a missing joint; load ignored.`);continue}const c=l.map(u=>[u.x,u.y,u.z]),h=F_(c,o.distribution,e,o.id),d=c.length;for(let u=0;u<d;u++){const f=h[u];if(f.every(x=>x[1]===0))continue;const p=o.joints[u],g=o.joints[(u+1)%d],m=s.get(`${p}-${g}`);if(!m){e.push(`Area ${o.id}: edge ${p}-${g} has no frame; its share of the load is ignored.`);continue}const v=m.i!==p,_=h[u][f.length-1][0],M=n.get(m.id)??[];for(let x=0;x+1<f.length;x++){const[I,T]=f[x],[R,P]=f[x+1];R-I<=1e-12||(v?M.push({x1:_-R,x2:_-I,w1:a*P,w2:a*T}):M.push({x1:I,x2:R,w1:a*T,w2:a*P}))}n.set(m.id,M)}}return n}class B_{constructor(t){ot(this,"n");ot(this,"maxa");ot(this,"heights");ot(this,"a");ot(this,"diag0",null);this.n=t.length,this.heights=t,this.maxa=new Int32Array(this.n+1);for(let e=0;e<this.n;e++)this.maxa[e+1]=this.maxa[e]+t[e]+1;this.a=new Float64Array(this.maxa[this.n])}add(t,e,n){if(t>e){const r=t;t=e,e=r}const s=e-t;if(s>this.heights[e])throw new Error("Skyline profile violated");this.a[this.maxa[e]+s]+=n}get(t,e){if(t>e){const s=t;t=e,e=s}const n=e-t;return n>this.heights[e]?0:this.a[this.maxa[e]+n]}factor(t=1e-10){const{n:e,maxa:n,heights:s,a:r}=this;this.diag0=new Float64Array(e);let o=0;for(let l=0;l<e;l++)this.diag0[l]=r[n[l]],o=Math.max(o,Math.abs(r[n[l]]));const a=o*1e-15;for(let l=0;l<e;l++){const c=l-s[l],h=n[l];for(let f=c+1;f<l;f++){const p=f-s[f],g=Math.max(p,c),m=n[f];let v=r[h+(l-f)];for(let _=g;_<f;_++)v-=r[m+(f-_)]*r[h+(l-_)];r[h+(l-f)]=v}let d=r[h];for(let f=c;f<l;f++){const p=h+(l-f),g=r[p],m=g/r[n[f]];d-=m*g,r[p]=m}const u=Math.abs(this.diag0[l]);if(!(d>t*u)||!(d>a))return l;r[h]=d}return-1}solve(t){const{n:e,maxa:n,heights:s,a:r}=this;for(let o=0;o<e;o++){const a=n[o];let l=t[o];for(let c=o-s[o];c<o;c++)l-=r[a+(o-c)]*t[c];t[o]=l}for(let o=0;o<e;o++)t[o]/=r[n[o]];for(let o=e-1;o>=0;o--){const a=n[o],l=t[o];for(let c=o-s[o];c<o;c++)t[c]-=r[a+(o-c)]*l}return t}}function z_(i){const t=i.length,e=new Uint8Array(t),n=[],s=i.map(o=>o.length),r=[...Array(t).keys()].sort((o,a)=>s[o]-s[a]);for(const o of r){if(e[o])continue;e[o]=1;const a=[o];for(let l=0;l<a.length;l++){const c=a[l];n.push(c);const h=i[c].filter(d=>!e[d]).sort((d,u)=>s[d]-s[u]);for(const d of h)e[d]=1,a.push(d)}}return n.reverse()}class We extends Error{}const ah=40,ko=1e-9;function k_(i,t,e=0,n=0){const s=new Float64Array(12);for(const r of i.points)th(r.p,r.a,t,s,e,n);for(const r of i.dists){const o=(r.x2-r.x1)/2,a=(r.x1+r.x2)/2;for(const l of Mu){const c=a+l.x*o,h=r.x2>r.x1?(c-r.x1)/(r.x2-r.x1):0,d=(r.w1+(r.w2-r.w1)*h)*l.w*o;th([r.d[0]*d,r.d[1]*d,r.d[2]*d],c,t,s,e,n)}}return s}function V_(i,t,e){const n=[0,0,0],s=[0,0,0],r=(o,a)=>{n[0]+=o[0],n[1]+=o[1],n[2]+=o[2];const l=a-t;s[1]+=-l*o[2],s[2]+=l*o[1]};for(const o of i.points)(o.a<t||e&&o.a===t)&&r(o.p,o.a);for(const o of i.dists){const a=Math.min(o.x2,t);if(a<=o.x1)continue;const l=(a-o.x1)/2,c=(o.x1+a)/2;for(const h of Mu){const d=c+h.x*l,u=o.x2>o.x1?(d-o.x1)/(o.x2-o.x1):0,f=(o.w1+(o.w2-o.w1)*u)*h.w*l;r([o.d[0]*f,o.d[1]*f,o.d[2]*f],d)}}return{F:n,M:s}}function G_(i){const t=i.length,e=i.map(s=>[...s]),n=Array.from({length:t},(s,r)=>Array.from({length:t},(o,a)=>r===a?1:0));for(let s=0;s<50;s++){let r=0;for(let o=0;o<t;o++)for(let a=o+1;a<t;a++)r+=e[o][a]*e[o][a];if(r<1e-30*(1+e.reduce((o,a,l)=>o+a[l]*a[l],0)))break;for(let o=0;o<t;o++)for(let a=o+1;a<t;a++){if(e[o][a]===0)continue;const l=(e[a][a]-e[o][o])/(2*e[o][a]),c=Math.sign(l||1)/(Math.abs(l)+Math.sqrt(l*l+1)),h=1/Math.sqrt(c*c+1),d=c*h;for(let u=0;u<t;u++){const f=e[u][o],p=e[u][a];e[u][o]=h*f-d*p,e[u][a]=d*f+h*p}for(let u=0;u<t;u++){const f=e[o][u],p=e[a][u];e[o][u]=h*f-d*p,e[a][u]=d*f+h*p}for(let u=0;u<t;u++){const f=n[u][o],p=n[u][a];n[u][o]=h*f-d*p,n[u][a]=d*f+h*p}}}return{values:e.map((s,r)=>s[r]),vectors:n}}function qa(i,t){const e=[0];for(let n=1;n<i.length;n++)e.push(e[n-1]+(i[n]-i[n-1])*(t[n]+t[n-1])/2);return e}function lh(i,t,e,n,s){const r=qa(i,t),o=s?r.map((h,d)=>h+s[d]):r,a=qa(i,o),l=i[i.length-1],c=(n-e-a[a.length-1])/l;return a.map((h,d)=>h+e+c*i[d])}const Tu=(i,t)=>[i[0]*t,i[1]*t,i[2]*t];function H_(i,t,e,n,s,r){const o=new Map,a=c=>{var h;return(c.case??((h=i.loadCases[0])==null?void 0:h.name))===t},l=O_({...i,areaLoads:i.areaLoads.filter(a)},s,r);for(const c of n){const h={points:[],dists:[]};for(const u of i.framePointLoads)if(u.frame===c.id&&u.P&&a(u)){const f=zo(u.dir,c.axes);h.points.push({a:Math.min(Math.max(u.rd,0),1)*c.L,p:Tu(f,u.P)})}for(const u of i.frameUniformLoads)u.frame===c.id&&u.w&&a(u)&&h.dists.push({x1:0,x2:c.L,w1:u.w,w2:u.w,d:zo(u.dir,c.axes)});const d=zo("GRAV",c.axes);for(const u of l.get(c.id)??[])h.dists.push({...u,d});e&&c.selfWeight>0&&h.dists.push({x1:0,x2:c.L,w1:c.selfWeight,w2:c.selfWeight,d}),o.set(c.id,h)}return o}function W_(i,t){const e=c=>{const h=c(i);if(!h)return;const d=h.map(()=>0);for(const[u,f]of t){const p=c(u);if(p)for(let g=0;g<d.length;g++)d[g]+=f*p[g]}return d},n={};for(const c of Object.keys(i.disp))n[+c]=e(h=>h.disp[+c]);const s={};for(const c of Object.keys(i.reactions))s[+c]=e(h=>h.reactions[+c]);let r=0;for(const c of Object.values(n))r=Math.max(r,Math.hypot(c[0],c[1],c[2]));const o=i.frames.map((c,h)=>{const d=p=>e(g=>g.frames[h][p]),u=c.disp.map((p,g)=>{const m=[0,0,0];for(const[v,_]of t)for(let M=0;M<3;M++)m[M]+=_*v.frames[h].disp[g][M];return r=Math.max(r,Math.hypot(m[0],m[1],m[2])),m}),f={points:[],dists:[]};for(const[p,g]of t)if(g){for(const m of p.frames[h].loads.points)f.points.push({a:m.a,p:Tu(m.p,g)});for(const m of p.frames[h].loads.dists)f.dists.push({...m,w1:m.w1*g,w2:m.w2*g})}return{id:c.id,L:c.L,axes:c.axes,endForces:e(p=>p.frames[h].endForces),x:[...c.x],P:d("P"),V2:d("V2"),V3:d("V3"),T:d("T"),M2:d("M2"),M3:d("M3"),disp:u,loads:f}}),a=c=>{const h=[0,0,0];for(const[d,u]of t)for(let f=0;f<3;f++)h[f]+=u*c(d)[f];return h},l=[...new Set(t.filter(([,c])=>c!==0).flatMap(([c])=>c.warnings))];return{disp:n,reactions:s,frames:o,warnings:l,stats:{...i.stats,maxDisp:r,sumLoad:a(c=>c.stats.sumLoad),sumReaction:a(c=>c.stats.sumReaction)}}}function X_(i,t){var n;if(!((n=i.loadCases)!=null&&n.length))throw new We("Define at least one load case.");const e=new Set;for(const s of i.loadCases){if(e.has(s.name))throw new We(`Load case name "${s.name}" is used more than once.`);e.add(s.name)}for(const s of t){if(e.has(s.name))throw new We(`Load combination name "${s.name}" is already used by another case or combination.`);e.add(s.name);for(const r of s.factors)if(!i.loadCases.some(o=>o.name===r.case))throw new We(`Load combination ${s.name} refers to unknown load case "${r.case}".`)}}function $_(i,t){var P;const e=[],n=new Map(i.joints.map(S=>[S.id,S])),s=new Map(i.materials.map(S=>[S.name,S])),r=new Map(i.sections.map(S=>[S.name,S]));if(i.frames.length===0)throw new We("The model has no frames to analyze.");X_(i,t);const o=new Set;for(const S of i.frames){if(!n.has(S.i)||!n.has(S.j))throw new We(`Frame ${S.id} references a missing joint.`);o.add(S.i),o.add(S.j)}for(const S of i.joints)!o.has(S.id)&&i.jointLoads.some(y=>y.joint===S.id&&y.f.some(A=>A!==0))&&e.push(`Joint ${S.id} is not connected to any frame; its load is ignored.`);const a=i.joints.filter(S=>o.has(S.id)),l=new Map(a.map((S,y)=>[S.id,y])),c=a.length,h=[];for(const S of i.frames){const y=n.get(S.i),A=n.get(S.j),V=[y.x,y.y,y.z],F=[A.x,A.y,A.z],k=Math.hypot(F[0]-V[0],F[1]-V[1],F[2]-V[2]);if(k<1e-9)throw new We(`Frame ${S.id} has zero length.`);const j=s.get(S.material);if(!j)throw new We(`Frame ${S.id}: material "${S.material}" is not defined.`);const G=r.get(S.section);if(!G)throw new We(`Frame ${S.id}: section "${S.section}" is not defined.`);const q=wi(G);if(!(j.E>0))throw new We(`Material ${j.name}: E must be positive.`);if(!(q.A>0&&q.I22>0&&q.I33>0&&q.J>0))throw new We(`Section ${G.name}: A, I22, I33 and J must be positive.`);const W=j.E/(2*(1+j.nu)),st=Ha(V,F,S.beta),rt=a_(j.E,W,q.A,q.I22,q.I33,q.J,k,q.As2,q.As3),dt=Ja(S.relI,S.relJ);if(dt)throw new We(`Frame ${S.id}: ${dt}`);const Ut=d_(rt,S.relI,S.relJ);if(!Ut)throw new We(`Frame ${S.id}: Invalid end releases cause an element mechanism (e.g. releasing axial or torsion at both ends).`);h.push({id:S.id,ji:l.get(S.i),jj:l.get(S.j),L:k,axes:st,R:l_(st),kl:rt,klCondensed:Ut.klCondensed,condInfo:Ut,relI:S.relI,relJ:S.relJ,E:j.E,A:q.A,I22:q.I22,I33:q.I33,G:W,As2:q.As2,As3:q.As3,phi2:Hr(j.E,W,q.I33,q.As2,k),phi3:Hr(j.E,W,q.I22,q.As3,k),selfWeight:j.gamma>0?j.gamma*q.A:0})}const d=Array.from({length:c},()=>[]);for(const S of h)d[S.ji].push(S.jj),d[S.jj].push(S.ji);const u=z_(d),f=new Int32Array(c*6).fill(-1);let p=0;for(const S of u){const y=a[S];for(let A=0;A<6;A++)y.r[A]||(f[S*6+A]=p++)}const g=S=>{const y=new Int32Array(12);for(let A=0;A<6;A++)y[A]=f[S.ji*6+A],y[6+A]=f[S.jj*6+A];return y};let m=null;if(p>0){const S=new Int32Array(p),y=h.map(g);for(const k of y){let j=1/0;for(const G of k)G>=0&&G<j&&(j=G);for(const G of k)G>=0&&(S[G]=Math.max(S[G],G-j))}m=new B_(S);const A=new Float64Array(c*9);let V=0;if(h.forEach((k,j)=>{const G=h_(k.klCondensed,k.R);for(const[W,st]of[[k.ji,3],[k.jj,9]])for(let rt=0;rt<3;rt++){for(let dt=0;dt<3;dt++)A[W*9+rt*3+dt]+=G[(st+rt)*12+st+dt];V=Math.max(V,Math.abs(k.kl[(st+rt)*12+st+rt]))}const q=y[j];for(let W=0;W<12;W++){const st=q[W];if(!(st<0))for(let rt=0;rt<12;rt++){const dt=q[rt];dt<0||dt<st||m.add(st,dt,G[W*12+rt])}}}),V>0){const k=1e-9*V,j=1e-9*V,G=[];for(let q=0;q<c;q++){const W=[0,1,2].filter(Wt=>f[q*6+3+Wt]>=0);if(!W.length)continue;const st=W.map(Wt=>W.map(U=>A[q*9+Wt*3+U])),{values:rt,vectors:dt}=G_(st);let Ut=!1;rt.forEach((Wt,U)=>{if(!(Wt>=k)){Ut=!0;for(let J=0;J<W.length;J++)for(let ft=0;ft<W.length;ft++){const K=f[q*6+3+W[J]],Lt=f[q*6+3+W[ft]];Lt<K||m.add(K,Lt,j*dt[J][U]*dt[ft][U])}}}),Ut&&G.push(String(a[q].id))}if(G.length){const q=G.length>10?`${G.slice(0,10).join(", ")} … (${G.length} total)`:G.join(", ");e.push(`Joint rotation not resisted by any member at joint(s) ${q}; stabilised automatically (joint moments there are not carried).`)}}const F=m.factor();if(F>=0){let k=`equation ${F}`;for(let j=0;j<c;j++)for(let G=0;G<6;G++)f[j*6+G]===F&&(k=`joint ${a[j].id} (${ii[G]})`);throw new We(`The structure is unstable (mechanism) at ${k}. Check supports and connectivity.`)}}else e.push("All degrees of freedom are restrained.");const v=i.settings.selfWeight?(P=i.loadCases.find(S=>S.type==="Dead"))==null?void 0:P.name:void 0;i.settings.selfWeight&&!v&&e.push("Self weight is on but there is no Dead load case; it was ignored.");const _=new Map,M=new Map;for(const S of i.loadCases){const y=[];M.set(S.name,H_(i,S.name,S.name===v,h,n,y)),_.set(S.name,y)}const x=new Map;for(const S of h){const y=[];for(let V=0;V<=ah;V++)y.push({x:S.L*V/ah,inc:!0});const A=[];for(const V of M.values())for(const F of V.get(S.id).points)F.a>1e-9&&F.a<S.L-1e-9&&!A.some(k=>Math.abs(k-F.a)<1e-12)&&(A.push(F.a),y.push({x:F.a,inc:!1},{x:F.a,inc:!0}));y.sort((V,F)=>V.x-F.x||Number(V.inc)-Number(F.inc)),x.set(S.id,y)}const I={};for(const S of i.loadCases){const y=M.get(S.name),A=[...e,..._.get(S.name)],V=h.map(U=>k_(y.get(U.id),U.L,U.phi2,U.phi3)),F=h.map((U,J)=>f_(V[J],U.condInfo)),k=new Float64Array(c*6);for(const U of i.jointLoads){if((U.case??i.loadCases[0].name)!==S.name)continue;const J=l.get(U.joint);if(J!==void 0)for(let ft=0;ft<6;ft++)k[J*6+ft]+=U.f[ft]}const j=Float64Array.from(k),G=[0,0,0];for(let U=0;U<c;U++)for(let J=0;J<3;J++)G[J]+=k[U*6+J];h.forEach((U,J)=>{const ft=Qc(U.R,F[J]);for(let K=0;K<6;K++)k[U.ji*6+K]-=ft[K],k[U.jj*6+K]-=ft[6+K];for(let K=0;K<3;K++)G[K]-=ft[K]+ft[6+K]});const q=new Float64Array(c*6);if(m){const U=new Float64Array(p);for(let J=0;J<c*6;J++)f[J]>=0&&(U[f[J]]=k[J]);m.solve(U);for(let J=0;J<c*6;J++)f[J]>=0&&(q[J]=U[f[J]])}const W=new Float64Array(c*6),st=[];let rt=0;for(let U=0;U<c;U++)rt=Math.max(rt,Math.hypot(q[U*6],q[U*6+1],q[U*6+2]));h.forEach((U,J)=>{const ft=y.get(U.id),K=new Float64Array(12);for(let O=0;O<6;O++)K[O]=q[U.ji*6+O],K[6+O]=q[U.jj*6+O];const Lt=c_(U.R,K),It=p_(Lt,V[J],U.condInfo),wt=new Float64Array(12);for(let O=0;O<12;O++){let gt=V[J][O];for(let ht=0;ht<12;ht++)gt+=U.kl[O*12+ht]*It[ht];wt[O]=gt}let Xt=0;for(const O of[0,1,2,6,7,8])Xt=Math.max(Xt,Math.abs(wt[O]));let Q=Xt*U.L;for(const O of[3,4,5,9,10,11])Q=Math.max(Q,Math.abs(wt[O]));const lt=O=>ko*(O%6<3?Xt:Q);for(const O of U.condInfo.released)Math.abs(wt[O])<lt(O)&&(wt[O]=0);const L=Qc(U.R,wt);for(let O=0;O<6;O++)W[U.ji*6+O]+=L[O],W[U.jj*6+O]+=L[6+O];const at={id:U.id,L:U.L,axes:U.axes,endForces:Array.from(wt),x:[],P:[],V2:[],V3:[],T:[],M2:[],M3:[],disp:[],loads:ft};for(const{x:O,inc:gt}of x.get(U.id)){const{F:ht,M:_t}=V_(ft,O,gt),Ft=[-(wt[0]+ht[0]),-(wt[1]+ht[1]),-(wt[2]+ht[2])],it=-O,vt=[wt[3],wt[4]+-it*wt[2],wt[5]+it*wt[1]],Dt=[-(vt[0]+_t[0]),-(vt[1]+_t[1]),-(vt[2]+_t[2])];at.x.push(O),at.P.push(Ft[0]),at.V2.push(Ft[1]),at.V3.push(Ft[2]),at.T.push(Dt[0]),at.M2.push(Dt[1]),at.M3.push(Dt[2])}{const O=Ft=>Ft.reduce((it,vt)=>vt.reduce((Dt,Ot)=>Math.max(Dt,Math.abs(Ot)),it),0),gt=Math.max(Xt,O([at.P,at.V2,at.V3])),ht=Math.max(Q,gt*U.L,O([at.T,at.M2,at.M3])),_t=(Ft,it)=>{for(let vt=0;vt<Ft.length;vt++)Math.abs(Ft[vt])<it&&(Ft[vt]=0)};for(const Ft of[at.P,at.V2,at.V3])_t(Ft,ko*gt);for(const Ft of[at.T,at.M2,at.M3])_t(Ft,ko*ht)}const nt=qa(at.x,at.P.map(O=>O/(U.E*U.A))),Et=(It[6]-It[0]-nt[nt.length-1])/U.L,ut=at.x.map((O,gt)=>It[0]+nt[gt]+Et*O),Nt=U.As2>0?at.V2.map(O=>O/(U.G*U.As2)):void 0,bt=U.As3>0?at.V3.map(O=>O/(U.G*U.As3)):void 0,w=lh(at.x,at.M3.map(O=>O/(U.E*U.I33)),It[1],It[7],Nt),b=lh(at.x,at.M2.map(O=>-O/(U.E*U.I22)),It[2],It[8],bt),[H,Z,et]=U.axes;for(let O=0;O<at.x.length;O++){const gt=[H[0]*ut[O]+Z[0]*w[O]+et[0]*b[O],H[1]*ut[O]+Z[1]*w[O]+et[1]*b[O],H[2]*ut[O]+Z[2]*w[O]+et[2]*b[O]];at.disp.push(gt),rt=Math.max(rt,Math.hypot(gt[0],gt[1],gt[2]))}st.push(at)});const dt={},Ut={},Wt=[0,0,0];a.forEach((U,J)=>{if(dt[U.id]=Array.from(q.subarray(J*6,J*6+6)),U.r.some(Boolean)){const ft=[0,0,0,0,0,0];for(let K=0;K<6;K++)U.r[K]&&(ft[K]=W[J*6+K]-j[J*6+K]);Ut[U.id]=ft;for(let K=0;K<3;K++)Wt[K]+=ft[K]}});for(const U of i.joints)dt[U.id]||(dt[U.id]=[0,0,0,0,0,0]);I[S.name]={disp:dt,reactions:Ut,frames:st,warnings:[...new Set(A)],stats:{joints:c,frames:h.length,equations:p,maxDisp:rt,sumLoad:G,sumReaction:Wt}}}const T=i.loadCases.map(S=>({name:S.name,kind:"case"})),R=I[i.loadCases[0].name];for(const S of t){const y=W_(R,S.factors.map(A=>[I[A.case],A.factor]));S.factors.length===0&&y.warnings.push(`Load combination ${S.name} has no load cases.`),I[S.name]=y,T.push({name:S.name,kind:"combo"})}return{items:T,results:I}}function j_(i){const t=Br(JSON.parse(JSON.stringify(i)));return $_(t,t.loadCombos)}let an=null,q_=0;const bs=new Map;function Y_(){if(an)return an;try{an=new Worker(new URL(""+new URL("worker-CfYSwhn0.js",import.meta.url).href,import.meta.url),{type:"module"}),an.onmessage=i=>{const t=bs.get(i.data.id);t&&(bs.delete(i.data.id),i.data.ok?t.resolve(i.data.results):t.reject(new Error(i.data.error)))},an.onerror=i=>{for(const t of bs.values())t.reject(new Error(i.message||"Analysis worker failed"));bs.clear(),an==null||an.terminate(),an=null}}catch{an=null}return an}function J_(i){const t=Y_();if(!t)return new Promise((n,s)=>{setTimeout(()=>{try{n(j_(i))}catch(r){s(r instanceof Error?r:new Error(String(r)))}},0)});const e=++q_;return new Promise((n,s)=>{bs.set(e,{resolve:n,reject:s}),t.postMessage({id:e,data:JSON.parse(JSON.stringify(i))})})}const Z_={TON:"TONF",KG:"KGF",KIPS:"KIP",LBF:"LB",LBS:"LB",FEET:"FT",INCH:"IN"};function K_(i){const[t,e]=i.split(/[\s,;/-]+/).filter(Boolean).map(n=>{const s=n.toUpperCase();return Z_[s]??s});return rs.find(n=>n.force.toUpperCase()===t&&n.length.toUpperCase()===e)}const Q_="StructApp3D",tx="1.0";class ye extends Error{}const Vo=`\r
`,ex=["rect","circle","pipe","I","box","unp","C","general"],nx=["XY","XZ","YZ"];function ix(i){let t=typeof i=="number"?sx(i):typeof i=="boolean"?i?"Yes":"No":i;return(/[",\r\n]/.test(t)||/^\s|\s$/.test(t))&&(t='"'+t.replace(/"/g,'""')+'"'),t}function sx(i){return!Number.isFinite(i)||Math.abs(i)<1e-300?"0":String(Number(i.toPrecision(12)))}function Go(i){return i.map(ix).join(",")}function Ae(i,t,e){return[Go(["TABLE",i]),Go(t),...e.map(Go)].join(Vo)+Vo+Vo}const Ho=i=>i?1:0;function Xi(i,t,e){if(e<=i[0])return t[0];for(let n=1;n<i.length;n++)if(e<=i[n]+1e-12){const s=i[n]-i[n-1];return s<=1e-12?t[n]:t[n-1]+(t[n]-t[n-1])*(e-i[n-1])/s}return t[t.length-1]}function ch(i,t,e=new Date,n=ln()){const s=(u,f)=>vl(u,f,n),r=u=>Yt(u,n,!0),o=r("F"),a=r("M"),l=r("L");let c="";c+=Ae("PROGRAM",["Program","Version","Units","Saved"],[[Q_,tx,`${n.force}, ${n.length}, C`,e.toISOString()]]);const h=i.settings;c+=Ae("SETTINGS",["GridSpacing","GridLines","WorkPlane","Elevation","SelfWeight"],[[s(h.gridSpacing,"L"),h.gridLines,h.workPlane,s(h.elevation,"L"),Ho(h.selfWeight)]]),c+=Ae("MATERIALS",["Name",`E (${r("FA")})`,"Poisson",`UnitWeight (${r("FV")})`],i.materials.map(u=>[u.name,s(u.E,"FA"),u.nu,s(u.gamma,"FV")])),c+=Ae("SECTIONS",["Name","Shape","Dim1","Dim2","Dim3","Dim4",`A (${r("A")})`,`I33 (${r("L4")})`,`I22 (${r("L4")})`,`J (${r("L4")})`,`As2 (${r("A")})`,`As3 (${r("A")})`],i.sections.map(u=>{const f=wi(u),p=[0,1,2,3].map(g=>u.dims[g]===void 0?"":s(u.dims[g],Gr(u.shape,g)));return[u.name,u.shape,...p,s(f.A,"A"),s(f.I33,"L4"),s(f.I22,"L4"),s(f.J,"L4"),s(f.As2,"A"),s(f.As3,"A")]})),c+=Ae("SUPPORT TYPES",["Name",...ii],i.supportTypes.map(u=>[u.name,...u.r.map(Ho)])),c+=Ae("JOINTS",["ID",`X (${l})`,`Y (${l})`,`Z (${l})`],i.joints.map(u=>[u.id,s(u.x,"L"),s(u.y,"L"),s(u.z,"L")])),c+=Ae("JOINT RESTRAINTS",["Joint",...ii],i.joints.filter(u=>u.r.some(Boolean)).map(u=>[u.id,...u.r.map(Ho)]));const d=new Map(i.joints.map(u=>[u.id,u]));if(c+=Ae("FRAMES",["ID","JointI","JointJ","Material","Section","Beta (deg)","Rel_I","Rel_J",`Length (${l})`],i.frames.map(u=>{const f=d.get(u.i),p=d.get(u.j),g=f&&p?Math.hypot(p.x-f.x,p.y-f.y,p.z-f.z):0;return[u.id,u.i,u.j,u.material,u.section,u.beta,Nr(u.relI),Nr(u.relJ),s(g,"L")]})),c+=Ae("AREAS",["ID","Joints","Distribution","NumJoints"],i.areas.map(u=>[u.id,u.joints.join(" "),u.distribution,u.joints.length])),c+=Ae("LOAD CASES",["Name","Type"],i.loadCases.map(u=>[u.name,u.type])),c+=Ae("LOAD COMBOS",["Combo","LoadCase","Factor"],i.loadCombos.flatMap(u=>u.factors.length?u.factors.map(f=>[u.name,f.case,f.factor]):[[u.name,"",""]])),c+=Ae("JOINT LOADS",["Joint",`FX (${o})`,`FY (${o})`,`FZ (${o})`,`MX (${a})`,`MY (${a})`,`MZ (${a})`,"LoadCase"],i.jointLoads.map(u=>[u.joint,...u.f.map((f,p)=>s(f,p<3?"F":"M")),u.case])),c+=Ae("FRAME POINT LOADS",["Frame","Direction",`P (${o})`,"RelDist","LoadCase"],i.framePointLoads.map(u=>[u.frame,u.dir,s(u.P,"F"),u.rd,u.case])),c+=Ae("FRAME UNIFORM LOADS",["Frame","Direction",`W (${r("FL")})`,"LoadCase"],i.frameUniformLoads.map(u=>[u.frame,u.dir,s(u.w,"FL"),u.case])),c+=Ae("AREA LOADS",["Area",`Q (${r("FA")}, downward)`,"LoadCase"],i.areaLoads.map(u=>[u.area,s(u.q,"FA"),u.case])),t){const u=t.items.map(p=>[p.name,t.results[p.name]]).filter(([,p])=>p);c+=Ae("RESULTS JOINT DISPLACEMENTS",["Case","Joint",`UX (${l})`,`UY (${l})`,`UZ (${l})`,"RX (rad)","RY (rad)","RZ (rad)"],u.flatMap(([p,g])=>Object.entries(g.disp).map(([m,v])=>[p,Number(m),...v.map((_,M)=>M<3?s(_,"L"):_)]))),c+=Ae("RESULTS JOINT REACTIONS",["Case","Joint",`FX (${o})`,`FY (${o})`,`FZ (${o})`,`MX (${a})`,`MY (${a})`,`MZ (${a})`],u.flatMap(([p,g])=>Object.entries(g.reactions).map(([m,v])=>[p,Number(m),...v.map((_,M)=>s(_,M<3?"F":"M"))])));const f=[];for(const[p,g]of u)for(const m of g.frames)for(let _=0;_<=10;_++){const M=m.L*_/10;f.push([p,m.id,s(M,"L"),s(Xi(m.x,m.P,M),"F"),s(Xi(m.x,m.V2,M),"F"),s(Xi(m.x,m.V3,M),"F"),s(Xi(m.x,m.T,M),"M"),s(Xi(m.x,m.M2,M),"M"),s(Xi(m.x,m.M3,M),"M")])}c+=Ae("RESULTS FRAME FORCES",["Case","Frame",`Station (${l})`,`P (${o})`,`V2 (${o})`,`V3 (${o})`,`T (${a})`,`M2 (${a})`,`M3 (${a})`],f)}return c}function rx(i){i.charCodeAt(0)===65279&&(i=i.slice(1));const t=i.slice(0,i.search(/\r?\n|$/)),e=!t.includes(",")&&t.includes(";")?";":",",n=[];let s=[],r="",o=!1;for(let a=0;a<i.length;a++){const l=i[a];o?l==='"'?i[a+1]==='"'?(r+='"',a++):o=!1:r+=l:l==='"'?o=!0:l===e?(s.push(r),r=""):l===`
`||l==="\r"?(l==="\r"&&i[a+1]===`
`&&a++,s.push(r),n.push(s),s=[],r=""):r+=l}return(r!==""||s.length)&&(s.push(r),n.push(s)),n}function ox(i){const t=[];let e=null,n=!1;return i.forEach((s,r)=>{const o=s.map(a=>a.trim());for(;o.length&&o[o.length-1]==="";)o.pop();if(!o.length){e=null;return}if(o[0].toUpperCase()==="TABLE"){e={name:(o[1]??"").toUpperCase(),header:[],rows:[]},t.push(e),n=!0;return}if(e){if(n){e.header=o.map(a=>a.replace(/\s*\(.*\)\s*$/,"").trim().toUpperCase()),n=!1;return}e.rows.push({cells:o,line:r+1})}}),t}class ax{constructor(t,e,n){this.t=t,this.cells=e,this.line=n}idx(t,e){const n=this.t.header.indexOf(t.toUpperCase());return n>=0?n:e}str(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new ye(`Line ${this.line} (${this.t.name}): missing ${t}`)}return s}num(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new ye(`Line ${this.line} (${this.t.name}): missing ${t}`)}const r=Number(s.replace(/\s/g,""));if(!Number.isFinite(r))throw new ye(`Line ${this.line} (${this.t.name}): "${s}" is not a number (${t})`);return r}bool(t,e){const n=(this.cells[this.idx(t,e)]??"").toUpperCase();return n==="1"||n==="YES"||n==="TRUE"||n==="Y"}}function hh(i,t){const e=ox(rx(i));if(!e.length)throw new ye('No tables found. A .sav file must contain rows like "TABLE,JOINTS".');const n=_=>e.find(M=>M.name===_),s=_=>{const M=n(_);return M?M.rows.map(x=>new ax(M,x.cells,x.line)):[]},r=Za(),o=s("PROGRAM")[0],a=o?o.str("Units",2,""):"",l=a?K_(a):Wa;if(!l)throw new ye(`PROGRAM: unknown units "${a}". Use one of: ${rs.map(_=>`${_.force}, ${_.length}`).join(" / ")}`);t&&a&&(t.units=l.id);const c=(_,M)=>Eu(_,M,l),h=s("SETTINGS")[0];if(h){r.settings.gridSpacing=h.num("GridSpacing",0,NaN),Number.isFinite(r.settings.gridSpacing)?r.settings.gridSpacing=c(r.settings.gridSpacing,"L"):r.settings.gridSpacing=1,r.settings.gridLines=Math.round(h.num("GridLines",1,10));const _=h.str("WorkPlane",2,"XY").toUpperCase();r.settings.workPlane=nx.includes(_)?_:"XY",r.settings.elevation=c(h.num("Elevation",3,0),"L"),r.settings.selfWeight=h.bool("SelfWeight",4)}n("MATERIALS")&&(r.materials=s("MATERIALS").map(_=>({name:_.str("Name",0),E:c(_.num("E",1),"FA"),nu:_.num("Poisson",2,.3),gamma:c(_.num("UnitWeight",3,0),"FV")}))),n("SECTIONS")&&(r.sections=s("SECTIONS").map(_=>{const M=_.str("Shape",1),x=ex.find(T=>T.toUpperCase()===M.toUpperCase());if(!x)throw new ye(`Line ${_.line} (SECTIONS): unknown shape "${M}"`);const I=[];for(let T=1;T<=4;T++){const R=_.num("Dim"+T,1+T,NaN);if(Number.isFinite(R))I.push(c(R,Gr(x,T-1)));else break}return{name:_.str("Name",0),shape:x,dims:I}})),n("SUPPORT TYPES")&&(r.supportTypes=s("SUPPORT TYPES").map(_=>({name:_.str("Name",0),r:ii.map((M,x)=>_.bool(M,x+1))}))),r.joints=s("JOINTS").map(_=>({id:_.num("ID",0),x:c(_.num("X",1),"L"),y:c(_.num("Y",2),"L"),z:c(_.num("Z",3),"L"),r:[!1,!1,!1,!1,!1,!1]}));const d=new Map(r.joints.map(_=>[_.id,_]));if(d.size!==r.joints.length)throw new ye("JOINTS: duplicate joint IDs");for(const _ of s("JOINT RESTRAINTS")){const M=_.num("Joint",0),x=d.get(M);if(!x)throw new ye(`Line ${_.line} (JOINT RESTRAINTS): joint ${M} does not exist`);x.r=ii.map((I,T)=>_.bool(I,T+1))}const u=(_,M,x)=>{if(!d.has(_))throw new ye(`Line ${M.line} (${x}): joint ${_} does not exist`);return _};r.frames=s("FRAMES").map(_=>{var P,S;const M=y=>{try{return ju(_.str(y,-1,"None"))}catch(A){throw new ye(`Line ${_.line} (FRAMES): ${A.message} (column ${y})`)}},x=M("Rel_I"),I=M("Rel_J"),T=Ja(x,I);if(T)throw new ye(`Line ${_.line} (FRAMES): ${T}`);const R={id:_.num("ID",0),i:u(_.num("JointI",1),_,"FRAMES"),j:u(_.num("JointJ",2),_,"FRAMES"),material:_.str("Material",3,((P=r.materials[0])==null?void 0:P.name)??""),section:_.str("Section",4,((S=r.sections[0])==null?void 0:S.name)??""),beta:_.num("Beta",5,0)};return x&&(R.relI=x),I&&(R.relJ=I),R});const f=new Set(r.frames.map(_=>_.id));if(f.size!==r.frames.length)throw new ye("FRAMES: duplicate frame IDs");r.areas=s("AREAS").map(_=>{const M=_.str("Joints",1).split(/[\s;|]+/).filter(Boolean).map(Number);M.forEach(I=>u(I,_,"AREAS"));const x=_.str("Distribution",2,"two-way").toLowerCase();return{id:_.num("ID",0),joints:M,distribution:x==="one-way"?"one-way":"two-way"}});const p=new Set(r.areas.map(_=>_.id)),g=_=>{const M=_.str("Direction",1).toUpperCase();if(!Eh.includes(M))throw new ye(`Line ${_.line}: unknown load direction "${M}"`);return M},m=(_,M)=>{if(!f.has(_))throw new ye(`Line ${M.line}: frame ${_} does not exist`);return _};if(n("LOAD CASES")&&(r.loadCases=s("LOAD CASES").map(_=>{const M=_.str("Type",1,"Other"),x=wh.find(I=>I.toUpperCase()===M.toUpperCase())??"Other";return{name:_.str("Name",0),type:x}}),new Set(r.loadCases.map(_=>_.name)).size!==r.loadCases.length))throw new ye("LOAD CASES: duplicate names");if(n("LOAD COMBOS")){r.loadCombos=[];for(const _ of s("LOAD COMBOS")){const M=_.str("Combo",0);let x=r.loadCombos.find(T=>T.name===M);x||r.loadCombos.push(x={name:M,factors:[]});const I=_.str("LoadCase",1,"");if(I){if(!r.loadCases.some(T=>T.name===I))throw new ye(`Line ${_.line} (LOAD COMBOS): load case "${I}" does not exist`);x.factors.push({case:I,factor:_.num("Factor",2)})}}}const v=_=>{const M=_.str("LoadCase",99,"");if(M&&!r.loadCases.some(x=>x.name===M))throw new ye(`Line ${_.line}: load case "${M}" does not exist`);return M};return r.jointLoads=s("JOINT LOADS").map(_=>({case:v(_),joint:u(_.num("Joint",0),_,"JOINT LOADS"),f:["FX","FY","FZ","MX","MY","MZ"].map((M,x)=>c(_.num(M,x+1,0),x<3?"F":"M"))})),r.framePointLoads=s("FRAME POINT LOADS").map(_=>({case:v(_),frame:m(_.num("Frame",0),_),dir:g(_),P:c(_.num("P",2),"F"),rd:Math.min(1,Math.max(0,_.num("RelDist",3,.5)))})),r.frameUniformLoads=s("FRAME UNIFORM LOADS").map(_=>({case:v(_),frame:m(_.num("Frame",0),_),dir:g(_),w:c(_.num("W",2),"FL")})),r.areaLoads=s("AREA LOADS").map(_=>{const M=_.num("Area",0);if(!p.has(M))throw new ye(`Line ${_.line} (AREA LOADS): area ${M} does not exist`);return{case:v(_),area:M,q:c(_.num("Q",1),"FA")}}),Br(r),r}const Cu=[{description:"StructApp 3D model",accept:{"text/csv":[".sav"]}}],Ru=i=>i instanceof DOMException&&i.name==="AbortError";function uh(i){return i=i.trim()||"model",/\.sav$/i.test(i)?i:i.replace(/\.[^.]*$/,"")+".sav"}async function lx(i,t,e){const n=window;if(n.showSaveFilePicker)try{const l=e??await n.showSaveFilePicker({suggestedName:uh(t),types:Cu}),c=await l.createWritable();return await c.write(i),await c.close(),{name:l.name,handle:l}}catch(l){if(Ru(l))return null;console.warn("File System Access save failed, falling back to download",l)}const s=uh(t),r=new Blob([i],{type:"text/csv;charset=utf-8"}),o=URL.createObjectURL(r),a=document.createElement("a");return a.href=o,a.download=s,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(o),1e4),{name:s,handle:null}}const cx=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;async function hx(){const i=window;if(i.showOpenFilePicker)try{const[t]=await i.showOpenFilePicker({types:Cu}),e=await t.getFile();return{name:e.name,text:await e.text(),handle:t}}catch(t){if(Ru(t))return null;console.warn("File System Access open failed, falling back to input",t)}return new Promise(t=>{const e=document.createElement("input");e.type="file",cx()||(e.accept=".sav,.csv,text/csv,text/plain"),e.style.display="none",document.body.appendChild(e);let n=!1;e.addEventListener("change",async()=>{var r;n=!0;const s=(r=e.files)==null?void 0:r[0];if(e.remove(),!s)return t(null);t({name:s.name,text:await s.text(),handle:null})}),e.addEventListener("cancel",()=>{n||t(null),e.remove()}),e.click()})}const xl="structapp3d.autosave";function ux(i,t){try{localStorage.setItem(xl,JSON.stringify({text:i,name:t,time:Date.now()}))}catch{}}function dx(){try{const i=localStorage.getItem(xl);return i?JSON.parse(i):null}catch{return null}}function _s(){try{localStorage.removeItem(xl)}catch{}}function fx(i,t,e,n=1e-9){const s=i.length;if(!s)return{left:0,right:0};if(e<=i[0]+n){let r=0;for(;r+1<s&&i[r+1]<=i[0]+n;)r++;return{left:t[0],right:t[r]}}if(e>=i[s-1]-n){let r=s-1;for(;r>0&&i[r-1]>=i[s-1]-n;)r--;return{left:t[r],right:t[s-1]}}for(let r=1;r<s;r++){if(Math.abs(i[r]-e)<=n){let o=r;for(;o+1<s&&Math.abs(i[o+1]-e)<=n;)o++;return{left:t[r],right:t[o]}}if(i[r]>e){const o=i[r]-i[r-1],a=o<=n?t[r]:t[r-1]+(t[r]-t[r-1])*(e-i[r-1])/o;return{left:a,right:a}}}return{left:t[s-1],right:t[s-1]}}function px(i,t,e){const n=i.axes[t],s=i.disp.map(a=>a[0]*n[0]+a[1]*n[1]+a[2]*n[2]);if(!e||s.length<2||i.L<=0)return s;const r=s[0],o=s[s.length-1];return s.map((a,l)=>a-(r+(o-r)*i.x[l]/i.L))}const mx="http://www.w3.org/2000/svg",xs=360,di=96,wr=14,Ar=14;function De(i,t){const e=document.createElementNS(mx,i);for(const[n,s]of Object.entries(t))e.setAttribute(n,String(s));return e}let ke=null,Lu="major",Pu=!1;const $i=(i,t,e)=>({title:i,ys:t,conv:n=>qt(n,e),unit:Yt(e)});function gx(i,t,e){const n=ln(),s=(r,o)=>({title:`Deflection ${o}${e?" (relative to chord)":""}`,ys:px(i,r,e),conv:a=>kn(a/n.kSmall),unit:n.small});return t==="axial"?[$i("Axial force P",i.P,"F"),$i("Torsion T",i.T,"M")]:t==="major"?[$i("Shear V2",i.V2,"F"),{...$i("Moment M3",i.M3,"M"),reversed:!0},s(1,"δ2 (local 2)")]:[$i("Shear V3",i.V3,"F"),{...$i("Moment M2",i.M2,"M"),reversed:!0},s(2,"δ3 (local 3)")]}function vx(i,t,e,n){const s=i.x,r=i.L||1;let o=Math.min(0,...t.ys),a=Math.max(0,...t.ys);a-o<1e-12&&(o=-1,a=1);const l=y=>wr+(xs-2*wr)*y/r,c=y=>t.reversed?Ar+(di-2*Ar)*(y-o)/(a-o):Ar+(di-2*Ar)*(a-y)/(a-o),h=De("svg",{viewBox:`0 0 ${xs} ${di}`,class:"fd-svg",preserveAspectRatio:"none"}),d="fdg_"+Math.random().toString(36).slice(2,9),u=c(0),f=Math.min(Math.max(u/di*100,0),100).toFixed(2),p=t.reversed?"var(--neg)":"var(--pos)",g=t.reversed?"var(--pos)":"var(--neg)",m=De("defs",{}),v=De("linearGradient",{id:`${d}_f`,gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:di});v.append(De("stop",{offset:"0%","stop-color":p,"stop-opacity":.35}),De("stop",{offset:`${f}%`,"stop-color":p,"stop-opacity":.35}),De("stop",{offset:`${f}%`,"stop-color":g,"stop-opacity":.35}),De("stop",{offset:"100%","stop-color":g,"stop-opacity":.35}));const _=De("linearGradient",{id:`${d}_l`,gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:di});_.append(De("stop",{offset:"0%","stop-color":p,"stop-opacity":1}),De("stop",{offset:`${f}%`,"stop-color":p,"stop-opacity":1}),De("stop",{offset:`${f}%`,"stop-color":g,"stop-opacity":1}),De("stop",{offset:"100%","stop-color":g,"stop-opacity":1})),m.append(v,_),h.append(m);const M=s.map((y,A)=>`${l(y).toFixed(2)},${c(t.ys[A]).toFixed(2)}`);h.append(De("polygon",{points:`${l(0)},${c(0)} ${M.join(" ")} ${l(r)},${c(0)}`,class:"fd-fill",fill:`url(#${d}_f)`}),De("line",{x1:l(0),y1:c(0),x2:l(r),y2:c(0),class:"fd-axis"}),De("polyline",{points:M.join(" "),class:"fd-line",stroke:`url(#${d}_l)`}));let x=0,I=0;t.ys.forEach((y,A)=>{y>t.ys[x]&&(x=A),y<t.ys[I]&&(I=A)});const T=(y,A)=>{if(Math.abs(t.ys[y])<1e-12)return;const V=Math.min(Math.max(l(s[y]),30),xs-30),F=De("text",{x:V,y:c(t.ys[y])+(A?-3:11),class:"fd-val","text-anchor":"middle"});F.textContent=t.conv(t.ys[y]),h.append(F)};T(x,!t.reversed),I!==x&&T(I,!!t.reversed),e!==null&&h.append(De("line",{x1:l(e),y1:2,x2:l(e),y2:di-2,class:"fd-cursor"}));const R=y=>{const A=h.getBoundingClientRect(),V=(y.clientX-A.left)/A.width*xs;n(Math.min(Math.max((V-wr)/(xs-2*wr)*r,0),r))};h.addEventListener("pointerdown",y=>{y.preventDefault(),h.setPointerCapture(y.pointerId),R(y);const A=F=>R(F),V=()=>{h.removeEventListener("pointermove",A),h.removeEventListener("pointerup",V),h.removeEventListener("pointercancel",V)};h.addEventListener("pointermove",A),h.addEventListener("pointerup",V),h.addEventListener("pointercancel",V)});let P="",S="";if(e!==null){const y=fx(s,t.ys,e),A=Math.abs(y.left)>=Math.abs(y.right)?y.left:y.right;Math.abs(A)>1e-12&&(S=A>0?"var(--pos)":"var(--neg)"),P=Math.abs(y.left-y.right)>1e-9*Math.max(1,Math.abs(y.left),Math.abs(y.right))?`${t.conv(y.left)} / ${t.conv(y.right)} ${t.unit} (left / right)`:`${t.conv(y.left)} ${t.unit}`}return C("div",{class:"fd-plot"},C("div",{class:"fd-plot-head"},C("span",{class:"fd-plot-title"},`${t.title} [${t.unit}]`),C("span",{class:"fd-readout",style:S?`color: ${S}`:""},P)),h)}function Mi(){var c;if(!ke)return;const i=ke,t=i.app.resultSet;if(!t)return Xr();t.results[i.caseName]||(i.caseName=i.app.resultName);const e=(c=t.results[i.caseName])==null?void 0:c.frames.find(h=>h.id===i.frameId);if(!e)return Xr();i.cursor!==null&&(i.cursor=Math.min(i.cursor,e.L));const n=C("select",{class:"fd-case","aria-label":"Load case or combination"},...t.items.map(h=>C("option",{value:h.name},`${h.kind==="combo"?"Combo":"Case"}: ${h.name}`)));n.value=i.caseName,n.addEventListener("change",()=>{i.caseName=n.value,Mi()});const s=C("select",{class:"fd-view","aria-label":"Diagram"},C("option",{value:"axial"},"Axial P & torsion T"),C("option",{value:"major"},"Major: V2, M3, deflection"),C("option",{value:"minor"},"Minor: V3, M2, deflection"));s.value=i.view,s.addEventListener("change",()=>{i.view=Lu=s.value,Mi()});const r=C("div",{class:"fd-controls"},n,s);if(i.view!=="axial"){const h=C("select",{class:"fd-rel","aria-label":"Deflection reference"},C("option",{value:"abs"},"Absolute deflection"),C("option",{value:"rel"},"Relative to chord"));h.value=i.relative?"rel":"abs",h.addEventListener("change",()=>{i.relative=Pu=h.value==="rel",Mi()}),r.append(h)}const o=h=>{i.cursor=h,Mi()},a=gx(e,i.view,i.relative).map(h=>vx(e,h,i.cursor,o)),l=i.cursor===null?"Tap or drag on a diagram to read values.":`x = ${qt(i.cursor,"L")} ${Yt("L")} from joint i (L = ${qt(e.L,"L")} ${Yt("L")})`;i.body.replaceChildren(r,C("div",{class:"fd-pos muted small"},l),...a),i.el.querySelector(".fd-title").textContent=`Frame ${i.frameId} diagrams`}function _x(i,t){t.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;e.preventDefault();const n=i.getBoundingClientRect(),s=e.clientX-n.left,r=e.clientY-n.top;t.setPointerCapture(e.pointerId);const o=l=>{const c=Math.min(Math.max(l.clientX-s,0),window.innerWidth-60),h=Math.min(Math.max(l.clientY-r,0),window.innerHeight-40);i.style.left=`${c}px`,i.style.top=`${h}px`,i.style.right="auto",i.style.bottom="auto",ke&&(ke.pos={left:c,top:h})},a=()=>{t.removeEventListener("pointermove",o),t.removeEventListener("pointerup",a),t.removeEventListener("pointercancel",a)};t.addEventListener("pointermove",o),t.addEventListener("pointerup",a),t.addEventListener("pointercancel",a)})}function Ya(i,t){if(!i.resultSet)return;if(ke){ke.frameId=t,ke.cursor=null,ke.caseName=i.resultName,Mi();return}const e=C("div",{class:"fd-body"}),n=C("button",{class:"fd-close","aria-label":"Close diagrams",title:"Close"},"✕"),s=C("div",{class:"fd-head"},C("span",{class:"fd-title"}),n),r=C("div",{class:"frame-diagrams",role:"dialog","aria-label":"Frame diagrams"},s,e);for(const o of["contextmenu","selectstart","dragstart"])r.addEventListener(o,a=>a.preventDefault());r.addEventListener("pointerdown",o=>o.stopPropagation()),r.addEventListener("wheel",o=>o.stopPropagation()),n.addEventListener("click",()=>Xr()),_x(r,s),document.body.append(r),ke={app:i,frameId:t,caseName:i.resultName,view:Lu,relative:Pu,cursor:null,el:r,body:e,pos:null},Mi()}function Xr(){ke==null||ke.el.remove(),ke=null}function dh(i){ke&&(ke.app=i,Mi())}const xx=(i,t)=>i.every((e,n)=>e===t[n]),Ml=i=>i.some(Boolean)?ii.filter((t,e)=>i[e]).join(" "):"Free";function Hs(i,t,e){return i?/[,;"\r\n]/.test(i)?`${e} name cannot contain commas, semicolons or quotes`:t.includes(i)?`${e} "${i}" already exists`:null:`${e} name is required`}function Sn(i,t){return C("div",{class:"table-wrap"},C("table",{class:"grid-table"},C("thead",null,C("tr",null,...i.map(e=>C("th",null,e)))),C("tbody",null,...t.map(e=>C("tr",null,...e.map(n=>C("td",null,n)))))))}const ve=i=>($t(i,"error"),!1),me=(i,t,e="small")=>C("button",{class:"btn "+e,type:"button",onclick:t},i);function Mx(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name",`E (${Yt("FA")})`,"ν",`γ (${Yt("FV")})`,"Used by",""],t.data.materials.map(o=>{const a=t.data.frames.filter(l=>l.material===o.name).length;return[document.createTextNode(o.name),document.createTextNode(qt(o.E,"FA",5)),document.createTextNode(String(o.nu)),document.createTextNode(qt(o.gamma,"FV",5)),document.createTextNode(a?`${a} frame(s)`:"–"),C("span",{class:"row-btns"},me("Edit",()=>r(o)),me("Delete",()=>s(o),"small danger"))]})),C("div",{class:"dlg-actions"},me("+ Add material",()=>r(null),"primary")))},s=async o=>{const a=t.data.frames.filter(l=>l.material===o.name).length;if(a)return void vi("Cannot delete",`Material "${o.name}" is assigned to ${a} frame(s). Assign another material to them first.`);await os("Delete material",`Delete material "${o.name}"?`,"Delete",!0)&&(t.commit("delete material",l=>{l.materials=l.materials.filter(c=>c.name!==o.name)}),n())},r=o=>{const a=Gs("Name",(o==null?void 0:o.name)??`MAT${t.data.materials.length+1}`),l=oe("Elastic modulus E",(o==null?void 0:o.E)??2e8,{q:"FA",positive:!0}),c=oe("Poisson's ratio ν",(o==null?void 0:o.nu)??.3,{min:0,max:.4999}),h=oe("Unit weight γ",(o==null?void 0:o.gamma)??78.5,{q:"FV",min:0}),d=C("div",{class:"chips"},C("span",{class:"muted"},"Presets: "),me("Steel",()=>(l.set(2e8),c.set(.3),h.set(76.98))),me("Concrete C30",()=>(l.set(25743e3),c.set(.2),h.set(23.56))),me("Aluminium",()=>(l.set(7e7),c.set(.33),h.set(26.6))),me("Timber",()=>(l.set(11e6),c.set(.3),h.set(5))));ae({title:o?`Edit material ${o.name}`:"Add material",body:C("div",{class:"form"},a.row,l.row,c.row,h.row,d),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const u=a.get(),f=Hs(u,t.data.materials.filter(g=>g!==o).map(g=>g.name),"Material"),p=[l.get(),c.get(),h.get()];if(f)return ve(f);if(p.some(g=>!Number.isFinite(g)))return ve("Fix the highlighted fields");t.commit(o?"edit material":"add material",g=>{const m={name:u,E:p[0],nu:p[1],gamma:p[2]};if(o){const v=o.name,_=g.materials.findIndex(M=>M.name===v);if(g.materials[_]=m,v!==u)for(const M of g.frames)M.material===v&&(M.material=u)}else g.materials.push(m)}),n()}}]})};n(),ae({title:"Define materials",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function yx(i){const t="http://www.w3.org/2000/svg",e=document.createElementNS(t,"svg");e.setAttribute("viewBox","-60 -60 120 120"),e.setAttribute("class","sketch");const n=wi(i),s=i.dims,o=80/Math.max(n.depth,n.width,1e-9),a=(h,d)=>{const u=document.createElementNS(t,h);for(const[f,p]of Object.entries(d))u.setAttribute(f,String(p));return e.append(u),u},l={class:"sk-shape","fill-rule":"evenodd"},c=(h,d,u=0,f=0)=>`M${u-h/2},${f-d/2}h${h}v${d}h${-h}z`;switch(i.shape){case"rect":a("path",{...l,d:c(s[1]*o,s[0]*o)});break;case"circle":a("circle",{...l,r:s[0]/2*o});break;case"pipe":{const h=s[0]/2*o,d=Math.max(h-s[1]*o,0);a("path",{...l,d:`M${-h},0a${h},${h} 0 1,0 ${2*h},0a${h},${h} 0 1,0 ${-2*h},0zM${-d},0a${d},${d} 0 1,0 ${2*d},0a${d},${d} 0 1,0 ${-2*d},0z`});break}case"I":{const[h,d,u,f]=s.map(p=>p*o);a("path",{...l,d:c(d,u,0,-h/2+u/2)+c(d,u,0,h/2-u/2)+c(f,h-2*u)});break}case"box":{const[h,d,u,f]=s.map(p=>p*o);a("path",{...l,d:c(d,h)+c(Math.max(d-2*f,0),Math.max(h-2*u,0))});break}case"unp":case"C":{const h=xu(i);a("path",{...l,d:"M"+h.map(([d,u])=>`${d*o},${-u*o}`).join("L")+"z"});break}case"general":a("text",{x:0,y:4,"text-anchor":"middle",class:"sk-text"}).textContent="General";break}return a("line",{x1:0,y1:0,x2:0,y2:-52,class:"sk-axis"}),a("line",{x1:0,y1:0,x2:-52,y2:0,class:"sk-axis"}),a("text",{x:4,y:-48,class:"sk-text"}).textContent="2",a("text",{x:-54,y:-4,class:"sk-text"}).textContent="3",e}function Sx(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name","Shape",`Dimensions (${Yt("L")})`,`A (${Yt("A")})`,`I33 (${Yt("L4")})`,"Used by",""],t.data.sections.map(o=>{const a=wi(o),l=t.data.frames.filter(c=>c.section===o.name).length;return[document.createTextNode(o.name),document.createTextNode(Ps[o.shape]),document.createTextNode(o.dims.map((c,h)=>qt(c,Gr(o.shape,h),4)).join(" × ")),document.createTextNode(qt(a.A,"A",4)),document.createTextNode(qt(a.I33,"L4",4)),document.createTextNode(l?`${l} frame(s)`:"–"),C("span",{class:"row-btns"},me("Edit",()=>r(o)),me("Delete",()=>s(o),"small danger"))]})),C("div",{class:"dlg-actions"},me("+ Add section",()=>r(null),"primary")))},s=async o=>{const a=t.data.frames.filter(l=>l.section===o.name).length;if(a)return void vi("Cannot delete",`Section "${o.name}" is assigned to ${a} frame(s). Assign another section to them first.`);await os("Delete section",`Delete section "${o.name}"?`,"Delete",!0)&&(t.commit("delete section",l=>{l.sections=l.sections.filter(c=>c.name!==o.name)}),n())},r=o=>{const a=Gs("Name",(o==null?void 0:o.name)??`SEC${t.data.sections.length+1}`),l=Object.keys(Ps),c=tn("Shape",l.map(_=>[_,Ps[_]]),(o==null?void 0:o.shape)??"rect"),h=C("div",{class:"form"}),d=C("div",{class:"props"}),u=C("div",{class:"sketch-box"});let f=[];const p={rect:[.5,.3],circle:[.4],pipe:[.1683,.0071],I:[.3,.15,.009,.0065],box:[.2,.2,.008,.008],unp:[.2,.075,.0115,.0085],C:[.15,.065,.02,.0023],general:[.01,1e-4,1e-5,1e-6]},g=()=>({name:a.get(),shape:c.get(),dims:f.map(_=>_.get())}),m=()=>{const _=g(),M=_.dims.some(I=>!Number.isFinite(I))?"Enter all dimensions":Jc(_);if(u.replaceChildren(M?C("div",{class:"field-err"},M):yx(_)),M)return void d.replaceChildren();const x=wi(_);d.replaceChildren(Sn([`A (${Yt("A")})`,`I33 (${Yt("L4")})`,`I22 (${Yt("L4")})`,`J (${Yt("L4")})`,`As2 (${Yt("A")})`,`As3 (${Yt("A")})`],[[qt(x.A,"A"),qt(x.I33,"L4"),qt(x.I22,"L4"),qt(x.J,"L4"),qt(x.As2,"A"),qt(x.As3,"A")].map(I=>document.createTextNode(I))]))},v=_=>{const M=c.get(),x=_&&o&&o.shape===M?o.dims:p[M];f=gu[M].map((I,T)=>oe(I,x[T],{q:Gr(M,T),positive:!0})),h.replaceChildren(...f.map(I=>I.row));for(const I of f)I.input.addEventListener("input",m);m()};c.input.addEventListener("change",()=>v(!1)),v(!0),ae({title:o?`Edit section ${o.name}`:"Add frame section",wide:!0,body:C("div",{class:"two-col"},C("div",{class:"form"},a.row,c.row,h),C("div",null,u,d,C("p",{class:"muted small"},"Local axis 2 is the section depth direction (up for horizontal members); local 3 is the width direction."))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const _=g(),M=Hs(_.name,t.data.sections.filter(x=>x!==o).map(x=>x.name),"Section")??(_.dims.some(x=>!Number.isFinite(x))?"Enter all dimensions":Jc(_));if(M)return ve(M);t.commit(o?"edit section":"add section",x=>{if(o){const I=o.name;if(x.sections[x.sections.findIndex(T=>T.name===I)]=_,I!==_.name)for(const T of x.frames)T.section===I&&(T.section=_.name)}else x.sections.push(_)}),n()}}]})};n(),ae({title:"Define frame sections",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function Du(i){const t=ii.map((n,s)=>_l(n,i[s]));return{el:C("div",{class:"restraints"},C("div",{class:"muted small"},"Translations"),C("div",{class:"chk-row"},...t.slice(0,3).map(n=>n.row)),C("div",{class:"muted small"},"Rotations"),C("div",{class:"chk-row"},...t.slice(3).map(n=>n.row))),checks:t,get:()=>t.map(n=>n.get()),set:n=>t.forEach((s,r)=>s.set(n[r]))}}function fh(i,t){const e=i?[...i]:[!1,!1,!1,!1,!1,!1],n=bh.map((r,o)=>_l(r,e[o]));return{el:C("div",{class:"releases-group"},t?C("div",{class:"muted small"},t):null,C("div",{class:"chk-row"},...n.map(r=>r.row))),checks:n,get:()=>{const r=n.map(o=>o.get());return r.some(Boolean)?r:void 0},set:r=>{const o=r??[!1,!1,!1,!1,!1,!1];n.forEach((a,l)=>a.set(o[l]))}}}function bx(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name","Restrained DOF",""],t.data.supportTypes.map(o=>[document.createTextNode(o.name),document.createTextNode(Ml(o.r)),C("span",{class:"row-btns"},me("Edit",()=>r(o)),me("Delete",()=>s(o),"small danger"))])),C("div",{class:"dlg-actions"},me("+ Add support type",()=>r(null),"primary")),C("p",{class:"muted small"},"Support types are presets. Assign them to joints with Assign → Joint supports."))},s=o=>{t.commit("delete support type",a=>{a.supportTypes=a.supportTypes.filter(l=>l.name!==o.name)}),n()},r=o=>{const a=Gs("Name",(o==null?void 0:o.name)??`Support${t.data.supportTypes.length+1}`),l=Du((o==null?void 0:o.r)??[!0,!0,!0,!1,!1,!1]);ae({title:o?`Edit support ${o.name}`:"Add support type",body:C("div",{class:"form"},a.row,l.el),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=a.get(),h=Hs(c,t.data.supportTypes.filter(d=>d!==o).map(d=>d.name),"Support");if(h)return ve(h);t.commit("edit support type",d=>{const u={name:c,r:l.get()};o?d.supportTypes[d.supportTypes.findIndex(f=>f.name===o.name)]=u:d.supportTypes.push(u)}),n()}}]})};n(),ae({title:"Define support types",body:e,buttons:[{label:"Close",kind:"primary"}]})}function ph(i){const t=i.model.data.settings,e=oe("Grid spacing",t.gridSpacing,{q:"L",positive:!0}),n=oe("Grid lines each side",t.gridLines,{min:1,max:200}),s=tn("Work plane",[["XY","XY (plan, horizontal)"],["XZ","XZ (elevation)"],["YZ","YZ (elevation)"]],t.workPlane),r=oe("Plane offset (Z for XY, Y for XZ, X for YZ)",t.elevation,{q:"L"});ae({title:"Grid & work plane",body:C("div",{class:"form"},e.row,n.row,s.row,r.row,C("p",{class:"muted small"},"New joints snap to this grid on the work plane. Tap an existing joint to snap to it instead.")),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const o=[e.get(),n.get(),r.get()];if(o.some(a=>!Number.isFinite(a)))return ve("Fix the highlighted fields");i.model.commit("grid",a=>{a.settings.gridSpacing=o[0],a.settings.gridLines=Math.round(o[1]),a.settings.workPlane=s.get(),a.settings.elevation=o[2]})}}]})}function Gn(i,t){const e=i.selected()[t];return e.length?e:($t(`Select one or more ${t} first`,"warn"),null)}function Wo(i,t){const e=Gn(i,"frames");if(!e)return;const n=i.model.data,s=n.frames.filter(a=>e.includes(a.id)),r=a=>s.every(l=>a(l)===a(s[0]))?a(s[0]):null;let o;if(t==="material"){if(!n.materials.length)return void $t("Define a material first","warn");o=tn("Material",n.materials.map(a=>[a.name,a.name]),r(a=>a.material)??n.materials[0].name)}else if(t==="section"){if(!n.sections.length)return void $t("Define a section first","warn");o=tn("Section",n.sections.map(a=>[a.name,`${a.name} (${Ps[a.shape]})`]),r(a=>a.section)??n.sections[0].name)}else o=oe("Local axis angle β",r(a=>a.beta),{unit:"°",mixed:!0});ae({title:`Assign ${t==="beta"?"local axis angle":t} to ${e.length} frame(s)`,body:C("div",{class:"form"},o.row,t==="beta"?C("p",{class:"muted small"},"β rotates the section (local axes 2 and 3) about the member axis 1."):null),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const a=o.get();if(typeof a=="number"&&!Number.isFinite(a))return ve("Enter an angle");i.model.commit("assign "+t,l=>{for(const c of l.frames)e.includes(c.id)&&(c[t]=a)}),$t(`Assigned to ${e.length} frame(s)`,"ok")}}]})}function Iu(i){const t=Gn(i,"frames");if(!t)return;const n=i.model.data.frames.find(l=>l.id===t[0]),s=fh(n.relI,"End I releases (Joint I)"),r=fh(n.relJ,"End J releases (Joint J)"),o=(l,c)=>{s.set(l),r.set(c)},a=C("div",{class:"chips"},me("Rigid - Rigid (Continuous)",()=>o(void 0,void 0)),me("Pin - Pin (Truss)",()=>o(Wu,Xu)),me("Pin - Rigid (Hinge at I)",()=>o([!1,!1,!1,!1,!0,!0],void 0)),me("Rigid - Pin (Hinge at J)",()=>o(void 0,[!1,!1,!1,!1,!0,!0])));ae({title:`Assign end releases to ${t.length} frame(s)`,body:C("div",{class:"form"},C("div",{class:"muted small"},"Presets"),a,s.el,r.el,C("p",{class:"muted small"},"Checked DOFs are released (zero moment / shear / axial / torsion). P, V2, V3 and T cannot be released at both ends. Truss preset releases T at End I only.")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const l=s.get(),c=r.get(),h=Ja(l,c);if(h)return ve(h);i.model.commit("assign releases",d=>{for(const u of d.frames)t.includes(u.id)&&(l?u.relI=[...l]:delete u.relI,c?u.relJ=[...c]:delete u.relJ)}),$t(`Assigned releases to ${t.length} frame(s)`,"ok")}}]})}function Ex(i){const t=Gn(i,"joints");if(!t)return;const e=i.model.data,n=e.joints.find(o=>o.id===t[0]),s=Du(n.r),r=C("div",{class:"chips"},...e.supportTypes.map(o=>me(o.name,()=>s.set(o.r))));ae({title:`Assign supports to ${t.length} joint(s)`,body:C("div",{class:"form"},C("div",{class:"muted small"},"Support type"),r,s.el),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const o=s.get();i.model.commit("assign supports",l=>{for(const c of l.joints)t.includes(c.id)&&(c.r=[...o])});const a=e.supportTypes.find(l=>xx(l.r,o));$t(`${a?a.name:Ml(o)} assigned to ${t.length} joint(s)`,"ok")}}]})}function wx(i){var n;const t=Gn(i,"areas");if(!t)return;const e=tn("Load distribution",[["two-way","Two-way (to all edges, tributary)"],["one-way","One-way (to the two longer edges)"]],((n=i.model.area(t[0]))==null?void 0:n.distribution)??"two-way");ae({title:`Area load distribution (${t.length} area(s))`,body:C("div",{class:"form"},e.row,C("p",{class:"muted small"},"Areas have no stiffness; their loads are transferred to the frames along their edges (or to the corner joints when an edge has no frame).")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{i.model.commit("assign distribution",s=>{for(const r of s.areas)t.includes(r.id)&&(r.distribution=e.get())})}}]})}const Zr=()=>tn("Option",[["add","Add to existing loads"],["replace","Replace loads of this case"],["delete","Delete loads of this case"]],"add");function Kr(i){const t=i.model.data.loadCases,e=t.some(n=>n.name===i.lastLoadCase)?i.lastLoadCase:t[0].name;return tn("Load case",t.map(n=>[n.name,`${n.name} (${n.type})`]),e)}function Uu(i="GRAV"){return tn("Direction",Eh.map(t=>[t,qo[t]]),i)}function Ax(i){const t=Gn(i,"joints");if(!t)return;const n=["Force FX","Force FY","Force FZ","Moment MX","Moment MY","Moment MZ"].map((o,a)=>oe(o,0,{q:a<3?"F":"M"})),s=Kr(i),r=Zr();ae({title:`Joint loads on ${t.length} joint(s)`,body:C("div",{class:"form"},C("p",{class:"muted small"},"Global axes. Use a negative FZ for downward loads."),s.row,C("div",{class:"grid2"},...n.map(o=>o.row)),r.row),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const o=n.map(c=>c.get()),a=r.get(),l=i.lastLoadCase=s.get();if(a!=="delete"&&o.some(c=>!Number.isFinite(c)))return ve("Fix the highlighted fields");i.model.commit("joint loads",c=>{if(a!=="add"&&(c.jointLoads=c.jointLoads.filter(h=>h.case!==l||!t.includes(h.joint))),!(a==="delete"||o.every(h=>h===0)))for(const h of t){const d=a==="add"?c.jointLoads.find(u=>u.joint===h&&u.case===l):void 0;d?d.f=d.f.map((u,f)=>u+o[f]):c.jointLoads.push({case:l,joint:h,f:[...o]})}}),$t(a==="delete"?"Joint loads deleted":`Load applied to ${t.length} joint(s)`,"ok")}}]})}function Tx(i){const t=Gn(i,"frames");if(!t)return;const e=Uu(),n=oe("Load P",10,{q:"F"}),s=oe("Relative distance from end I",.5,{min:0,max:1}),r=Kr(i),o=Zr();ae({title:`Frame point load on ${t.length} frame(s)`,body:C("div",{class:"form"},r.row,e.row,n.row,s.row,o.row,C("p",{class:"muted small"},"Gravity loads act downward (−Z) for positive values. Relative distance 0 = end I, 1 = end J.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const a=n.get(),l=s.get(),c=o.get(),h=i.lastLoadCase=r.get();if(c!=="delete"&&(!Number.isFinite(a)||!Number.isFinite(l)))return ve("Fix the highlighted fields");i.model.commit("frame point loads",d=>{if(c!=="add"&&(d.framePointLoads=d.framePointLoads.filter(u=>u.case!==h||!t.includes(u.frame))),!(c==="delete"||a===0))for(const u of t)d.framePointLoads.push({case:h,frame:u,dir:e.get(),P:a,rd:l})}),$t(c==="delete"?"Point loads deleted":`Point load applied to ${t.length} frame(s)`,"ok")}}]})}function Cx(i){const t=Gn(i,"frames");if(!t)return;const e=Uu(),n=oe("Uniform load w",5,{q:"FL"}),s=Kr(i),r=Zr();ae({title:`Frame uniform load on ${t.length} frame(s)`,body:C("div",{class:"form"},s.row,e.row,n.row,r.row,C("p",{class:"muted small"},"Load per unit length along the full member. Gravity loads act downward for positive values.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const o=n.get(),a=r.get(),l=i.lastLoadCase=s.get();if(a!=="delete"&&!Number.isFinite(o))return ve("Enter a load value");i.model.commit("frame uniform loads",c=>{if(a!=="add"&&(c.frameUniformLoads=c.frameUniformLoads.filter(h=>h.case!==l||!t.includes(h.frame))),!(a==="delete"||o===0))for(const h of t)c.frameUniformLoads.push({case:l,frame:h,dir:e.get(),w:o})}),$t(a==="delete"?"Uniform loads deleted":`Uniform load applied to ${t.length} frame(s)`,"ok")}}]})}function Rx(i){const t=Gn(i,"areas");if(!t)return;const e=oe("Uniform pressure q (gravity)",5,{q:"FA"}),n=Kr(i),s=Zr();ae({title:`Area load on ${t.length} area(s)`,body:C("div",{class:"form"},n.row,e.row,s.row,C("p",{class:"muted small"},"Positive values act downward. The load is distributed to the surrounding frames.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const r=e.get(),o=s.get(),a=i.lastLoadCase=n.get();if(o!=="delete"&&!Number.isFinite(r))return ve("Enter a load value");i.model.commit("area loads",l=>{if(o!=="add"&&(l.areaLoads=l.areaLoads.filter(c=>c.case!==a||!t.includes(c.area))),!(o==="delete"||r===0))for(const c of t){const h=o==="add"?l.areaLoads.find(d=>d.area===c&&d.case===a):void 0;h?h.q+=r:l.areaLoads.push({case:a,area:c,q:r})}}),$t(o==="delete"?"Area loads deleted":`Area load applied to ${t.length} area(s)`,"ok")}}]})}async function mh(i){const t=i.selected(),e=t.joints.length+t.frames.length+t.areas.length;if(!e)return void $t("Select objects first","warn");await os("Clear loads",`Delete all loads (all load cases) on the ${e} selected object(s)?`,"Delete loads",!0)&&i.model.commit("clear loads",n=>{n.jointLoads=n.jointLoads.filter(s=>!t.joints.includes(s.joint)),n.framePointLoads=n.framePointLoads.filter(s=>!t.frames.includes(s.frame)),n.frameUniformLoads=n.frameUniformLoads.filter(s=>!t.frames.includes(s.frame)),n.areaLoads=n.areaLoads.filter(s=>!t.areas.includes(s.area))})}function gh(i){const t=oe("X",0,{q:"L"}),e=oe("Y",0,{q:"L"}),n=oe("Z",0,{q:"L"});ae({title:"Add joint by coordinates",body:C("div",{class:"form"},C("div",{class:"grid3"},t.row,e.row,n.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const s=[t.get(),e.get(),n.get()];if(s.some(a=>!Number.isFinite(a)))return ve("Fix the highlighted fields");const r=i.model.data.joints.length,o=i.model.addJoint(s[0],s[1],s[2]);return $t(i.model.data.joints.length>r?`Joint ${o} added`:`Joint ${o} already exists there`,"ok"),!1}}]})}function Lx(i){const t=oe("Joint I",null,{min:1}),e=oe("Joint J",null,{min:1});ae({title:"Add frame between joints",body:C("div",{class:"form"},C("div",{class:"grid2"},t.row,e.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const n=t.get(),s=e.get();if(!i.model.joint(n)||!i.model.joint(s))return ve("Both joints must exist");const r=i.model.addFrame(n,s);return r===null?ve("Joints I and J must be different"):($t(`Frame ${r} (${n}–${s})`,"ok"),!1)}}]})}function Nu(i){return[oe(i+"X",0,{q:"L"}),oe(i+"Y",0,{q:"L"}),oe(i+"Z",0,{q:"L"})]}function vh(i){const t=i.selected(),e=i.model.jointsOf(t.joints,t.frames,t.areas);if(!e.size)return void $t("Select objects to move","warn");const n=Nu("Δ");ae({title:`Move ${e.size} joint(s)`,body:C("div",{class:"form"},C("div",{class:"grid3"},...n.map(s=>s.row))),buttons:[{label:"Cancel"},{label:"Move",kind:"primary",action:()=>{const s=n.map(o=>o.get());if(s.some(o=>!Number.isFinite(o)))return ve("Fix the highlighted fields");const r=i.model.moveJoints(e,s[0],s[1],s[2]);if(r)return ve(r)}}]})}function _h(i){const t=i.selected();if(!t.joints.length&&!t.frames.length&&!t.areas.length)return void $t("Select objects to replicate","warn");const e=Nu("Δ"),n=oe("Number of copies",1,{min:1,max:100});ae({title:"Replicate (linear copy)",body:C("div",{class:"form"},C("div",{class:"grid3"},...e.map(s=>s.row)),n.row,C("p",{class:"muted small"},"Copies selected objects with their properties, supports and loads.")),buttons:[{label:"Cancel"},{label:"Replicate",kind:"primary",action:()=>{const s=e.map(a=>a.get()),r=Math.round(n.get());if(s.some(a=>!Number.isFinite(a))||!(r>=1))return ve("Fix the highlighted fields");if(s.every(a=>a===0))return ve("Enter a non-zero offset");const o=i.model.replicate(t.joints,t.frames,t.areas,s[0],s[1],s[2],r);$t(`Created ${o.joints.length} joint(s), ${o.frames.length} frame(s), ${o.areas.length} area(s)`,"ok")}}]})}function Px(i){const t=Gn(i,"frames");if(!t)return;const e=oe("Divide each frame into",2,{min:2,max:100});ae({title:`Divide ${t.length} frame(s)`,body:C("div",{class:"form"},e.row),buttons:[{label:"Cancel"},{label:"Divide",kind:"primary",action:()=>{const n=Math.round(e.get());if(!(n>=2))return ve("Enter 2 or more");i.model.commit("divide frames",()=>{for(const s of t)i.model.divideFrame(s,n)}),i.select([],"replace")}}]})}function Xo(i){const t=i.results;if(!t)return void $t("Run the analysis first","warn");const e=[["Joint displacements",()=>Sn(["Joint",...["UX","UY","UZ"].map(l=>`${l} (${Yt("L")})`),"RX (rad)","RY (rad)","RZ (rad)"],i.model.data.joints.map(l=>[String(l.id),...(t.disp[l.id]??[]).map((c,h)=>h<3?qt(c,"L",4):kn(c,4))].map(c=>document.createTextNode(c))))],["Support reactions",()=>Sn(["Joint",...["FX","FY","FZ"].map(l=>`${l} (${Yt("F")})`),...["MX","MY","MZ"].map(l=>`${l} (${Yt("M")})`)],Object.entries(t.reactions).map(([l,c])=>[l,...c.map((h,d)=>qt(h,d<3?"F":"M",4))].map(h=>document.createTextNode(h))))],["Frame end forces",()=>Sn(["Frame","End",...["P","V2","V3"].map(l=>`${l} (${Yt("F")})`),...["T","M2","M3"].map(l=>`${l} (${Yt("M")})`)],t.frames.flatMap(l=>{const c=l.x.length-1,h=d=>[l.P[d],l.V2[d],l.V3[d],l.T[d],l.M2[d],l.M3[d]].map((u,f)=>qt(u,f<3?"F":"M",4));return[[String(l.id),"I",...h(0)].map(d=>document.createTextNode(d)),["","J",...h(c)].map(d=>document.createTextNode(d))]}))]],n=C("div",{class:"tab-content"}),s=C("div",{class:"tabs"}),r=l=>{n.replaceChildren(e[l][1]()),[...s.children].forEach((c,h)=>c.classList.toggle("active",h===l))};e.forEach(([l],c)=>s.append(C("button",{class:"tab",type:"button",onclick:()=>r(c)},l))),r(0);const o=t.stats,a=C("p",{class:"muted small"},`Applied load ΣF = (${o.sumLoad.map(l=>qt(l,"F",4)).join(", ")}) ${Yt("F")} · Reactions ΣR = (${o.sumReaction.map(l=>qt(l,"F",4)).join(", ")}) ${Yt("F")} · Max displacement ${Me(o.maxDisp,"L",4)}`);ae({title:`Analysis results — ${i.resultName}`,wide:!0,body:C("div",null,a,s,n),buttons:[{label:"Close",kind:"primary"}]})}function xh(){const t=C("div",null,Sn(["Action","Touch (iPad/Android)","Mouse & keyboard"],[["Select","Tap object","Click object"],["Add to selection","Multi tool, then tap","Shift/Ctrl + click"],["Box select","Box tool, drag (→ window, ← crossing)","Box tool or Ctrl + drag"],["Rotate view","One-finger drag","Left drag"],["Pan","Two-finger drag","Right/middle drag or Shift + drag"],["Zoom","Pinch","Mouse wheel / trackpad pinch"],["Context menu","Long-press","Right-click"],["Finish frame/area","Done button","Enter or Done"],["Cancel / clear selection","—","Esc"],["Delete","Delete button","Delete key"],["Undo / Redo","Undo / Redo buttons","Ctrl+Z / Ctrl+Y"],["Fit view","Fit button","F"],["Rotate work plane (XY → XZ → YZ)","Plane button (passes through a single selected joint)","P"],["Shift work plane ± grid spacing","Up / Down plane buttons","PgUp / PgDn"]].map(e=>e.map(n=>document.createTextNode(n)))),C("ol",{class:"small"},C("li",null,"Define → Materials, Sections and Support types."),C("li",null,"Draw joints, frames and areas on the grid. Use the plane buttons in the toolbar (or Define → Grid & work plane) to change the plane and its offset."),C("li",null,"Select objects and use Assign to set materials, sections and supports."),C("li",null,"Apply loads from the Loads menu."),C("li",null,"Analyze → Run analysis, then pick a result view and adjust the scale."),C("li",null,"File → Save writes a comma-separated .sav file that opens in Excel.")),C("p",{class:"muted small"},`Current units: ${["F","L","FL","FA","M"].map(e=>Yt(e)).join(", ")} (${ln().label}) — change them with the units selector at the bottom-right. Z is vertical (up).`));ae({title:"Help",wide:!0,body:t,buttons:[{label:"Close",kind:"primary"}]})}const Mh=(i,t)=>i.jointLoads.filter(e=>e.case===t).length+i.framePointLoads.filter(e=>e.case===t).length+i.frameUniformLoads.filter(e=>e.case===t).length+i.areaLoads.filter(e=>e.case===t).length,Dx=i=>i.factors.length?i.factors.map((t,e)=>`${e?t.factor<0?"− ":"+ ":t.factor<0?"−":""}${kn(Math.abs(t.factor),3)} ${t.case}`).join(" "):"(empty)";function Ix(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name","Type","Loads",""],t.data.loadCases.map((o,a)=>[document.createTextNode(o.name),document.createTextNode(o.type+(a===t.data.loadCases.findIndex(l=>l.type==="Dead")&&t.data.settings.selfWeight?" + self weight":"")),document.createTextNode(String(Mh(t.data,o.name))),C("span",{class:"row-btns"},me("Edit",()=>r(o)),me("Delete",()=>void s(o),"small danger"))])),C("div",{class:"dlg-actions"},me("+ Add load case",()=>r(null),"primary")),C("p",{class:"muted small"},"Each load case is analysed separately. Self weight (if enabled) is added to the first Dead case. Combine cases with Loads → Load combinations."))},s=async o=>{if(t.data.loadCases.length<=1)return void $t("At least one load case is required","warn");const a=Mh(t.data,o.name);a&&!await os("Delete load case",`Load case "${o.name}" has ${a} load(s). Delete the case and its loads?`,"Delete",!0)||(t.commit("delete load case",l=>{const c=h=>h.case!==o.name;l.loadCases=l.loadCases.filter(h=>h.name!==o.name),l.jointLoads=l.jointLoads.filter(c),l.framePointLoads=l.framePointLoads.filter(c),l.frameUniformLoads=l.frameUniformLoads.filter(c),l.areaLoads=l.areaLoads.filter(c);for(const h of l.loadCombos)h.factors=h.factors.filter(d=>d.case!==o.name)}),n())},r=o=>{const a=Gs("Name",(o==null?void 0:o.name)??`CASE${t.data.loadCases.length+1}`),l=tn("Type",wh.map(c=>[c,c]),(o==null?void 0:o.type)??"Other");ae({title:o?`Edit load case ${o.name}`:"Add load case",body:C("div",{class:"form"},a.row,l.row),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=a.get(),h=[...t.data.loadCases.filter(u=>u!==o).map(u=>u.name),...t.data.loadCombos.map(u=>u.name)],d=Hs(c,h,"Load case");if(d)return ve(d);t.commit(o?"edit load case":"add load case",u=>{if(!o)return void u.loadCases.push({name:c,type:l.get()});const f=u.loadCases.find(p=>p.name===o.name);if(f.type=l.get(),c!==o.name){f.name=c;for(const p of[u.jointLoads,u.framePointLoads,u.frameUniformLoads,u.areaLoads])for(const g of p)g.case===o.name&&(g.case=c);for(const p of u.loadCombos)for(const g of p.factors)g.case===o.name&&(g.case=c)}}),o&&i.lastLoadCase===o.name&&(i.lastLoadCase=c),n()}}]})};n(),ae({title:"Load cases",body:e,buttons:[{label:"Close",kind:"primary"}]})}function Ux(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(t.data.loadCombos.length?Sn(["Name","Combination",""],t.data.loadCombos.map(o=>[document.createTextNode(o.name),document.createTextNode(Dx(o)),C("span",{class:"row-btns"},me("Edit",()=>r(o)),me("Delete",()=>s(o),"small danger"))])):C("p",{class:"muted"},"No load combinations. Results are shown per load case."),C("div",{class:"dlg-actions"},me("+ Add combination",()=>r(null),"primary")),C("p",{class:"muted small"},"Combination results are the factored sum of the load case results (linear superposition)."))},s=o=>{t.commit("delete load combination",a=>{a.loadCombos=a.loadCombos.filter(l=>l.name!==o.name)}),n()},r=o=>{const a=Gs("Name",(o==null?void 0:o.name)??`COMBO${t.data.loadCombos.length+1}`),l=t.data.loadCases.map(c=>{var h;return{lc:c,f:oe(`× ${c.name}`,o?((h=o.factors.find(d=>d.case===c.name))==null?void 0:h.factor)??0:0,{placeholder:"0"})}});ae({title:o?`Edit combination ${o.name}`:"Add load combination",body:C("div",{class:"form"},a.row,C("p",{class:"muted small"},"Scale factor for each load case (0 = not included)."),C("div",{class:"grid2"},...l.map(c=>c.f.row))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=a.get(),h=[...t.data.loadCombos.filter(p=>p!==o).map(p=>p.name),...t.data.loadCases.map(p=>p.name)],d=Hs(c,h,"Combination");if(d)return ve(d);const u=l.map(p=>({case:p.lc.name,factor:p.f.input.value.trim()===""?0:p.f.get()}));if(u.some(p=>!Number.isFinite(p.factor)))return ve("Fix the highlighted fields");const f=u.filter(p=>p.factor!==0);if(!f.length)return ve("Enter at least one non-zero factor");t.commit(o?"edit load combination":"add load combination",p=>{const g={name:c,factors:f};o?p.loadCombos[p.loadCombos.findIndex(m=>m.name===o.name)]=g:p.loadCombos.push(g)}),n()}}]})};n(),ae({title:"Load combinations",body:e,buttons:[{label:"Close",kind:"primary"}]})}const Ti=i=>C("dl",{class:"kv"},...i.flatMap(([t,e])=>[C("dt",null,t),C("dd",null,e)])),Ve=(i,...t)=>C("section",{class:"insp-sec"},C("h3",null,i),...t),pe=(i,t,e="")=>C("button",{class:"btn small "+e,type:"button",onclick:t},i);function Un(i,t){return C("div",{class:"table-wrap"},C("table",{class:"grid-table compact"},C("thead",null,C("tr",null,...i.map(e=>C("th",null,e)))),C("tbody",null,...t.map(e=>C("tr",null,...e.map(n=>C("td",null,n)))))))}function $o(i,t){const e=i.selected(),n=e.joints.length+e.frames.length+e.areas.length;t.replaceChildren(),n===0?t.append(...Nx(i)):n===1&&e.joints.length?t.append(...Fx(i,e.joints[0])):n===1&&e.frames.length?t.append(...Ox(i,e.frames[0])):n===1&&e.areas.length?t.append(...Bx(i,e.areas[0])):t.append(...zx(i,e))}function Nx(i){const t=i.model.data,e=[Ve("Model",Ti([["Joints",String(t.joints.length)],["Frames",String(t.frames.length)],["Areas",String(t.areas.length)],["Supported joints",String(t.joints.filter(s=>s.r.some(Boolean)).length)],["Loads",String(t.jointLoads.length+t.framePointLoads.length+t.frameUniformLoads.length+t.areaLoads.length)],["Self weight",t.settings.selfWeight?"Included":"Off"]]))],n=i.results;return n&&(e.push(Ve(`Analysis results — ${i.resultName}`,Ti([["Equations",String(n.stats.equations)],["Max displacement",Me(n.stats.maxDisp,"L",4)],["ΣLoad (X,Y,Z)",n.stats.sumLoad.map(s=>qt(s,"F",4)).join(", ")+" "+Yt("F")],["ΣReaction (X,Y,Z)",n.stats.sumReaction.map(s=>qt(s,"F",4)).join(", ")+" "+Yt("F")]]),pe("Show result tables…",()=>i.cmd("resultsTables")))),n.warnings.length&&e.push(Ve("Warnings",C("ul",{class:"warn-list"},...n.warnings.map(s=>C("li",null,s)))))),e.push(C("p",{class:"muted small"},"Tap a joint, frame or area to see and edit its properties.")),e}function Fu(i,t,e){return pe(t,()=>{const n=i.map(r=>r.get());if(n.some(r=>!Number.isFinite(r)))return $t("Fix the highlighted fields","error");const s=e(n);s&&$t(s,"error")},"primary")}function Fx(i,t){const e=i.model,n=e.joint(t),s=oe("X",n.x,{q:"L"}),r=oe("Y",n.y,{q:"L"}),o=oe("Z",n.z,{q:"L"}),a=ii.map((f,p)=>_l(f,n.r[p]));for(const f of a)f.input.addEventListener("change",()=>e.commit("restraint",()=>{e.joint(t).r=a.map(p=>p.get())}));const l=C("div",{class:"chips"},...e.data.supportTypes.map(f=>pe(f.name,()=>e.commit("support",()=>{e.joint(t).r=[...f.r]})))),c=e.data.jointLoads.filter(f=>f.joint===t),h=[C("h2",{class:"insp-title"},`Joint ${t}`),Ve("Coordinates",C("div",{class:"grid3"},s.row,r.row,o.row),Fu([s,r,o],"Apply",f=>e.moveJoints(new Set([t]),f[0]-n.x,f[1]-n.y,f[2]-n.z))),Ve("Support ("+Ml(n.r)+")",l,C("div",{class:"chk-row wrap"},...a.map(f=>f.row))),Ve("Joint loads",c.length?Un(["Case",...["FX","FY","FZ"].map(f=>`${f} (${Yt("F")})`),...["MX","MY","MZ"].map(f=>`${f} (${Yt("M")})`)],c.map(f=>[f.case,...f.f.map((p,g)=>qt(p,g<3?"F":"M",4))])):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},pe("Add load…",()=>i.cmd("jointLoad")),c.length?pe("Delete loads",()=>e.commit("delete joint loads",f=>{f.jointLoads=f.jointLoads.filter(p=>p.joint!==t)}),"danger"):null))],d=e.data.frames.filter(f=>f.i===t||f.j===t).map(f=>f.id);h.push(Ti([["Connected frames",d.length?d.join(", "):"None"]]));const u=i.results;if(u&&u.disp[t]){const f=u.disp[t];h.push(Ve(`Displacement — ${i.resultName}`,Un(["UX","UY","UZ"].map(g=>`${g} (${Yt("L")})`),[f.slice(0,3).map(g=>qt(g,"L",4))]),Un(["RX (rad)","RY (rad)","RZ (rad)"],[f.slice(3).map(g=>kn(g,4))])));const p=u.reactions[t];p&&h.push(Ve("Support reaction",Un(["FX","FY","FZ"].map(g=>`${g} (${Yt("F")})`),[p.slice(0,3).map(g=>qt(g,"F",4))]),Un(["MX","MY","MZ"].map(g=>`${g} (${Yt("M")})`),[p.slice(3).map(g=>qt(g,"M",4))])))}return h}function Ox(i,t){var p;const e=i.model,n=e.data,s=e.frame(t),r=tn("Material",n.materials.map(g=>[g.name,g.name]),s.material),o=tn("Section",n.sections.map(g=>[g.name,`${g.name} (${Ps[g.shape]})`]),s.section),a=oe("Angle β",s.beta,{unit:"°"});r.input.addEventListener("change",()=>e.commit("assign material",()=>void(e.frame(t).material=r.get()))),o.input.addEventListener("change",()=>e.commit("assign section",()=>void(e.frame(t).section=o.get())));const l=n.sections.find(g=>g.name===s.section),c=l?wi(l):null,h=n.framePointLoads.filter(g=>g.frame===t),d=n.frameUniformLoads.filter(g=>g.frame===t),u=[C("h2",{class:"insp-title"},`Frame ${t}`),Ti([["Joints I → J",`${s.i} → ${s.j}`],["Length",Me(e.frameLength(s),"L",4)]]),Ve("Properties",r.row,o.row,c?C("p",{class:"muted small"},`A = ${Me(c.A,"A",4)}, I33 = ${Me(c.I33,"L4",4)}, I22 = ${Me(c.I22,"L4",4)}, J = ${Me(c.J,"L4",4)}, As2 = ${Me(c.As2,"A",4)}, As3 = ${Me(c.As3,"A",4)}`):null,a.row,Fu([a],"Apply β",g=>void e.commit("beta",()=>void(e.frame(t).beta=g[0])))),Ve("End releases",Ti([["End I (Joint "+s.i+")",Nr(s.relI)],["End J (Joint "+s.j+")",Nr(s.relJ)]]),C("div",{class:"row-btns"},pe("Edit releases…",()=>Iu(i)),s.relI||s.relJ?pe("Set continuous",()=>{e.commit("clear releases",()=>{delete e.frame(t).relI,delete e.frame(t).relJ})}):null)),Ve("Frame loads",h.length||d.length?Un(["Case","Type","Direction","Value","Position"],[...h.map(g=>[g.case,"Point",qo[g.dir],Me(g.P,"F",4),"rd = "+kn(g.rd,3)]),...d.map(g=>[g.case,"Uniform",qo[g.dir],Me(g.w,"FL",4),"full length"])]):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},pe("Point load…",()=>i.cmd("framePoint")),pe("Uniform load…",()=>i.cmd("frameUniform")),h.length||d.length?pe("Delete loads",()=>e.commit("delete frame loads",g=>{g.framePointLoads=g.framePointLoads.filter(m=>m.frame!==t),g.frameUniformLoads=g.frameUniformLoads.filter(m=>m.frame!==t)}),"danger"):null))],f=(p=i.results)==null?void 0:p.frames.find(g=>g.id===t);if(f){const g=f.x.length-1,m=["P","V2","V3","T","M2","M3"],v=I=>I<3?"F":"M",_=m.map((I,T)=>{const R=f[I],P=v(T);return[`${I} (${Yt(P)})`,qt(R[0],P,4),qt(R[g],P,4),qt(Math.max(...R),P,4),qt(Math.min(...R),P,4)]});let M=0;for(const I of f.disp)M=Math.max(M,Math.hypot(...I));u.push(Ve(`Internal forces — ${i.resultName}`,Un(["","End I","End J","Max","Min"],_),C("p",{class:"muted small"},`Max displacement along member: ${Me(M,"L",4)}`),pe("Diagrams…",()=>Ya(i,t))));const x=C("details",null,C("summary",null,"Station values"),Un([`x (${Yt("L")})`,...m.map((I,T)=>`${I} (${Yt(v(T))})`)],f.x.map((I,T)=>[qt(I,"L",4),...m.map((R,P)=>qt(f[R][T],v(P),4))])));u.push(x)}return u}function Bx(i,t){const e=i.model,n=e.area(t),s=e.jointMap(),r=n.joints.map(u=>s.get(u)).filter(Boolean);let o=0,a=0,l=0;for(let u=0;u<r.length;u++){const f=r[u],p=r[(u+1)%r.length];o+=(f.y-p.y)*(f.z+p.z),a+=(f.z-p.z)*(f.x+p.x),l+=(f.x-p.x)*(f.y+p.y)}const c=Math.hypot(o,a,l)/2,h=tn("Load distribution",[["two-way","Two-way"],["one-way","One-way"]],n.distribution);h.input.addEventListener("change",()=>e.commit("distribution",()=>void(e.area(t).distribution=h.get())));const d=e.data.areaLoads.filter(u=>u.area===t);return[C("h2",{class:"insp-title"},`Area ${t}`),Ti([["Joints",n.joints.join(", ")],["Area",Me(c,"A",4)]]),Ve("Properties",h.row,C("p",{class:"muted small"},"Areas carry no stiffness; loads are transferred to the edge frames.")),Ve("Area loads",d.length?Un(["Case",`q (${Yt("FA")}, down)`],d.map(u=>[u.case,qt(u.q,"FA",4)])):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},pe("Add load…",()=>i.cmd("areaLoad")),d.length?pe("Delete loads",()=>e.commit("delete area loads",u=>{u.areaLoads=u.areaLoads.filter(f=>f.area!==t)}),"danger"):null))]}function zx(i,t){const e=[C("h2",{class:"insp-title"},"Selection"),Ti([["Joints",t.joints.length?t.joints.join(", "):"–"],["Frames",t.frames.length?t.frames.join(", "):"–"],["Areas",t.areas.length?t.areas.join(", "):"–"]])],n=[];return t.joints.length&&n.push(pe("Supports…",()=>i.cmd("assignSupport")),pe("Joint load…",()=>i.cmd("jointLoad"))),t.frames.length&&n.push(pe("Material…",()=>i.cmd("assignMaterial")),pe("Section…",()=>i.cmd("assignSection")),pe("End releases…",()=>i.cmd("assignReleases")),pe("Point load…",()=>i.cmd("framePoint")),pe("Uniform load…",()=>i.cmd("frameUniform"))),t.areas.length&&n.push(pe("Area load…",()=>i.cmd("areaLoad"))),n.push(pe("Move…",()=>i.cmd("move")),pe("Replicate…",()=>i.cmd("replicate")),pe("Delete",()=>i.cmd("delete"),"danger")),e.push(Ve("Quick actions",C("div",{class:"chips"},...n))),e}const kx="1.1.7",Vx="2026-11-19",Gx=[{version:"1.1.7",date:"2026-11-19",changes:["Pin-jointed trusses no longer need restrained joint rotations: unresisted joint rotations are stabilised automatically (with a warning)","Pin - Pin (Truss) preset now releases T at End I only (M2 M3 at both ends)","Releasing P, V2, V3 or T at both ends is blocked in the dialog, the analysis and the .sav reader","Unknown end-release text in a .sav file is now an error with the line number","Released end values are computed, not forced to zero (only round-off is cleaned)","Support and release dialogs: Translations / Rotations (and End I / End J) checkboxes now sit on their own rows under their labels"]},{version:"1.1.6",date:"2026-11-18",changes:["Prevent Android soft keyboard flashing when selecting dropdown options or opening dialogs"]},{version:"1.1.5",date:"2026-11-18",changes:["Shear deformation (Timoshenko) in frame elements using shear modulus G and shear areas As2/As3","Shear areas As2/As3 shown in section dialog, inspector and .sav SECTIONS table",'"Include self weight" is now checked by default for new models',"New Analyze ▸ Frame diagram… menu item","Fixed diagram fill showing positive colour over negative values","Joint labels are easier to read (background pill, offset from joint dot)","Version history added to the About dialog"]},{version:"1.1.4",date:"2026-11-17",changes:["Compact multiline load labels, grouped like reaction labels"]},{version:"1.1.3",date:"2026-11-17",changes:["Stacked load labels per load case with case-name prefixes","Matching 2D/3D diagram colours","Inverted moment axis in diagrams"]},{version:"1.1.2",date:"2026-11-17",changes:["Isolated 3D viewport stacking context so labels no longer bleed through dialogs"]},{version:"1.1.1",date:"2026-11-16",changes:["Load dialog dropdown shows load case name and type"]},{version:"1.1.0",date:"2026-11-15",changes:["Member end releases (Phase 1.1) with hinge markers in the 3D view"]},{version:"1.0.0",date:"2026-11-12",changes:["Load cases (Dead, Live, custom) and load combinations (default 1.2D + 1.6L)","Frame diagrams window: axial, torsion, V2/M3, V3/M2 and deflection with tap-to-read values","UNP and C frame shapes","Drag a selected joint to move it (snaps to grid)","Unit systems selector (kN-m, N-mm, ton-m, kg-mm, imperial)","Work plane rotate/offset shortcut buttons"]},{version:"Initial",date:"2026-11-07",changes:["Touch-friendly 3D modelling canvas: joints, frames and areas","Materials, sections, supports and joint/frame loads","Linear static 3D frame analysis with forces, reactions and deformed shape","Save/open models as comma-separated .sav files (Excel friendly)"]}],Hx={XY:"Z",XZ:"Y",YZ:"X"},yh=[["none","Undeformed"],["deformed","Deformed shape"],["P","Axial P"],["V2","Shear V2"],["V3","Shear V3"],["T","Torsion T"],["M2","Moment M2"],["M3","Moment M3"],["reactions","Support reactions"]],Wx={select:'<path d="M5 3l14 8-6 2-3 6z"/>',joint:'<circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',frame:'<circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="5" r="2.2"/><path d="M6.5 17.5l11-11"/>',area:'<path d="M4 18l4-12h12l-4 12z" fill="currentColor" fill-opacity=".25"/>',box:'<rect x="4" y="5" width="16" height="14" rx="1" stroke-dasharray="3 2"/>',multi:'<rect x="3" y="7" width="11" height="11" rx="2"/><path d="M10 4h8a2 2 0 0 1 2 2v8"/>',done:'<path d="M5 12.5l4.5 4.5L19 7"/>',fit:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',undo:'<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',redo:'<path d="M15 7l5 5-5 5"/><path d="M20 12H10a6 6 0 0 0 0 12"/>',del:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',plane:'<path d="M3 15l6-5h12l-6 5z" fill="currentColor" fill-opacity=".2"/><path d="M17 4a5 5 0 0 1 3 4.5M20 8.5l.2-2.6M20 8.5l-2.5-.7"/>',planeUp:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 12V3M8.5 6.5L12 3l3.5 3.5"/>',planeDown:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 3v9M8.5 8.5L12 12l3.5-3.5"/>',run:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'},jo=i=>{const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("class","ico"),t.innerHTML=Wx[i],t};class Xx{constructor(t){ot(this,"model",new Rl);ot(this,"viewer");ot(this,"tools");ot(this,"selection",new Set);ot(this,"resultSet",null);ot(this,"resultName","");ot(this,"lastLoadCase","");ot(this,"fileName","Untitled.sav");ot(this,"fileHandle",null);ot(this,"dirty",!1);ot(this,"includeResults",!0);ot(this,"deformRel",0);ot(this,"forceRel",0);ot(this,"theme","light");ot(this,"busy",!1);ot(this,"root");ot(this,"viewport");ot(this,"panel");ot(this,"panelBody");ot(this,"statusEl");ot(this,"coordEl");ot(this,"unitsEl");ot(this,"fileEl");ot(this,"hintEl");ot(this,"resultsBar");ot(this,"toolButtons",new Map);ot(this,"autosaveTimer",0);ot(this,"suppressDirty",!1);ot(this,"rb");ot(this,"planeOffsets",{});ot(this,"commands",{jointLoad:()=>this.need("joints")&&Ax(this),framePoint:()=>this.need("frames")&&Tx(this),frameUniform:()=>this.need("frames")&&Cx(this),areaLoad:()=>this.need("areas")&&Rx(this),assignSupport:()=>this.need("joints")&&Ex(this),assignMaterial:()=>this.need("frames")&&Wo(this,"material"),assignSection:()=>this.need("frames")&&Wo(this,"section"),assignBeta:()=>this.need("frames")&&Wo(this,"beta"),assignReleases:()=>this.need("frames")&&Iu(this),assignArea:()=>this.need("areas")&&wx(this),move:()=>vh(this),replicate:()=>_h(this),divide:()=>this.need("frames")&&Px(this),delete:()=>void this.deleteSelected(),resultsTables:()=>Xo(this)});this.root=t;const e=localStorage.getItem("structapp.theme");(e==="light"||e==="dark")&&(this.theme=e),this.buildLayout(),this.viewer=new E_(this.viewport),this.tools=new D_(this),this.applyTheme(),new R_(this.viewer.canvas,{tap:(n,s,r)=>this.tools.tap(n,s,r),longPress:(n,s)=>this.contextMenu(n,s),hover:(n,s,r)=>this.tools.hover(n,s,r),orbit:(n,s)=>this.viewer.orbit(n,s),pan:(n,s)=>this.viewer.pan(n,s),zoom:(n,s,r)=>this.viewer.zoom(n,s,r),wantsBox:n=>this.tools.wantsBox(n),box:(n,s,r,o,a)=>this.tools.box(n,s,r,o,a),wantsDrag:(n,s,r)=>this.tools.wantsDrag(n,s,r),drag:(n,s,r)=>this.tools.drag(n,s,r)}),this.model.onChange(n=>this.onModelChange(n)),this.installKeyboard(),window.addEventListener("beforeunload",n=>{this.dirty&&(n.preventDefault(),n.returnValue="")}),this.refresh(),this.viewer.fit(),this.onToolChanged(),this.offerRecovery()}get results(){var t;return((t=this.resultSet)==null?void 0:t.results[this.resultName])??null}buildLayout(){const e=[["File",()=>this.fileMenu()],["Edit",()=>this.editMenu()],["Define",()=>this.defineMenu()],["Draw",()=>this.drawMenu()],["Assign",()=>this.assignMenu()],["Loads",()=>this.loadsMenu()],["Analyze",()=>this.analyzeMenu()],["Display",()=>this.displayMenu()],["Help",()=>this.helpMenu()]].map(([u,f])=>{const p=C("button",{class:"menu-btn",type:"button"},u);return p.addEventListener("click",g=>{if(g.stopPropagation(),P_(p))return Wr();const m=p.getBoundingClientRect();oh(f(),m.left,m.bottom+2,p)}),p});this.fileEl=C("span",{class:"file-name"});const n=C("button",{class:"btn primary run-btn",type:"button",title:"Run analysis (F5)",onclick:()=>void this.analyze()},jo("run"),C("span",null,"Run")),s=C("button",{class:"icon-btn",type:"button",title:"Show/hide properties panel",onclick:()=>this.togglePanel()},jo("panel")),r=C("header",{class:"menubar"},C("div",{class:"brand"},"StructApp 3D"),C("nav",{class:"menus"},...e),C("div",{class:"spacer"}),this.fileEl,n,s),o=(u,f,p,g)=>{const m=C("button",{class:"tool-btn",type:"button",title:p,"aria-label":p,onclick:g},jo(u),C("span",null,f));return this.toolButtons.set(u,m),m},a=C("nav",{class:"toolbar"},o("select","Select","Select (S)",()=>this.tools.setTool("select")),o("box","Box","Box/window select (B)",()=>this.tools.setTool("box")),o("multi","Multi","Multi-select: taps add to selection (M)",()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()}),o("done","Done","Finish frame chain / close area (Enter)",()=>this.tools.finishChain(!0)),C("div",{class:"tb-sep"}),o("joint","Joint","Draw joints (J)",()=>this.tools.setTool("joint")),o("frame","Frame","Draw frames (L)",()=>this.tools.setTool("frame")),o("area","Area","Draw areas (A)",()=>this.tools.setTool("area")),C("div",{class:"tb-sep"}),o("fit","Fit","Zoom to fit (F)",()=>this.viewer.fit()),o("undo","Undo","Undo (Ctrl+Z)",()=>this.undo()),o("redo","Redo","Redo (Ctrl+Y)",()=>this.redo()),o("del","Delete","Delete selected (Del)",()=>void this.deleteSelected()),C("div",{class:"tb-sep"}),o("plane","XY","Rotate work plane XY → XZ → YZ (P)",()=>this.rotateWorkPlane()),o("planeUp","Up","Shift work plane +1 grid spacing (PgUp)",()=>this.shiftWorkPlane(1)),o("planeDown","Down","Shift work plane −1 grid spacing (PgDn)",()=>this.shiftWorkPlane(-1)));this.viewport=C("div",{class:"viewport"}),this.hintEl=C("div",{class:"tool-hint"}),this.resultsBar=this.buildResultsBar();const l=C("div",{class:"viewport-wrap"},this.viewport,this.hintEl,this.resultsBar),c=u=>{const f=u.target;f&&(this.viewport.contains(f)||f===this.viewport)&&u.preventDefault()};l.addEventListener("contextmenu",c,!0),l.addEventListener("selectstart",c,!0),l.addEventListener("dragstart",c,!0),this.panelBody=C("div",{class:"panel-body"});const h=C("div",{class:"sheet-grip",onclick:()=>this.togglePanel()});this.panel=C("aside",{class:"panel"},h,C("div",{class:"panel-head"},C("span",null,"Properties"),C("button",{class:"icon-btn small",type:"button",title:"Close",onclick:()=>this.togglePanel(!1)},"✕")),this.panelBody),(localStorage.getItem("structapp.panel")==="closed"||window.innerWidth<700)&&this.panel.classList.add("collapsed"),this.statusEl=C("span",{class:"status-text"}),this.coordEl=C("span",{class:"coord"}),this.unitsEl=C("select",{class:"units",title:"Units for all input and output values","aria-label":"Units"},C("optgroup",{label:"Metric"},...rs.slice(0,4).map(u=>C("option",{value:u.id},u.label))),C("optgroup",{label:"Imperial"},...rs.slice(4).map(u=>C("option",{value:u.id},u.label)))),this.unitsEl.value=ln().id,this.unitsEl.addEventListener("change",()=>nh(this.unitsEl.value)),v_(()=>this.onUnitsChanged());const d=C("footer",{class:"statusbar"},this.statusEl,C("div",{class:"spacer"}),this.coordEl,this.unitsEl);this.root.replaceChildren(r,C("div",{class:"main"},a,l,this.panel),d)}buildResultsBar(){const t=C("select",{class:"rb-view","aria-label":"Result display"},...yh.map(([d,u])=>C("option",{value:d},u)));t.addEventListener("change",()=>this.setResultView(t.value));const e=C("input",{type:"range",min:"-3",max:"3",step:"0.05",value:"0","aria-label":"Deformation scale"});e.addEventListener("input",()=>{this.deformRel=Number(e.value),this.applyDeformScale()});const n=C("input",{type:"text",inputmode:"decimal",class:"rb-scale","aria-label":"Deformation scale factor"});n.addEventListener("change",()=>{const d=Number(n.value.replace(",","."));if(!(d>0)||!Number.isFinite(d)){$t("Scale must be a positive number","error"),this.syncResultsBar();return}this.deformRel=Math.log10(d/this.viewer.autoDeformScale),this.applyDeformScale(!1)});const s=C("button",{class:"btn small",type:"button",onclick:()=>(this.deformRel=0,this.applyDeformScale())},"Auto"),r=C("input",{type:"range",min:"-1",max:"1",step:"0.05",value:"0","aria-label":"Diagram scale"});r.addEventListener("input",()=>{this.forceRel=Number(r.value),this.viewer.setResultOptions({forceScale:10**this.forceRel})});const o=C("input",{type:"checkbox"});o.addEventListener("change",()=>this.viewer.setResultOptions({animate:o.checked}));const a=C("input",{type:"checkbox",checked:!0});a.addEventListener("change",()=>this.viewer.setResultOptions({showValues:a.checked}));const l=C("div",{class:"rb-group"},C("label",null,"Scale"),e,n,s,C("label",{class:"check"},o,C("span",null,"Animate"))),c=C("div",{class:"rb-group"},C("label",null,"Size"),r),h=C("select",{class:"rb-case","aria-label":"Load case or combination"});return h.addEventListener("change",()=>this.setResultCase(h.value)),this.rb={rcase:h,view:t,slider:e,scale:n,forceSlider:r,animate:o,values:a,deformGroup:l,forceGroup:c},C("div",{class:"results-bar",hidden:!0},h,t,l,c,C("label",{class:"check"},a,C("span",null,"Values")),C("button",{class:"btn small",type:"button",onclick:()=>Xo(this)},"Tables"),C("button",{class:"icon-btn small",type:"button",title:"Hide results",onclick:()=>this.setResultView("none")},"✕"))}applyDeformScale(t=!0){this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(t)}syncResultsBar(t=!0){var o;const e=this.rb,n=this.viewer.resultOpts.view,s=((o=this.resultSet)==null?void 0:o.items)??[],r=s.map(a=>a.kind+":"+a.name).join("|");e.rcase.dataset.sig!==r&&(e.rcase.dataset.sig=r,e.rcase.replaceChildren(...s.map(a=>C("option",{value:a.name},(a.kind==="combo"?"Combo: ":"Case: ")+a.name)))),e.rcase.value=this.resultName,e.view.value=n,t&&(e.slider.value=String(Math.max(-3,Math.min(3,this.deformRel)))),e.scale.value=kn(this.viewer.autoDeformScale*10**this.deformRel,4),e.forceSlider.value=String(this.forceRel),e.animate.checked=this.viewer.resultOpts.animate,e.values.checked=this.viewer.resultOpts.showValues,e.deformGroup.hidden=n==="none"||n==="reactions",e.forceGroup.hidden=!$a.includes(n)&&n!=="reactions",this.resultsBar.hidden=!this.results}clearResults(t=!0){this.resultSet=null,this.viewer.setResults(null),this.viewer.setResultOptions({view:"none",animate:!1}),Xr(),t&&this.refresh()}setResultCase(t){var e;(e=this.resultSet)!=null&&e.results[t]&&(this.resultName=t,this.viewer.setResults(this.results),this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.refresh())}setResultView(t){if(!this.results&&t!=="none")return void $t("Run the analysis first","warn");this.viewer.setResultOptions({view:t,deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(),this.viewer.requestRender()}togglePanel(t){const e=t===void 0?!this.panel.classList.contains("collapsed"):!t;this.panel.classList.toggle("collapsed",e),localStorage.setItem("structapp.panel",e?"closed":"open")}applyTheme(){var t;document.documentElement.dataset.theme=this.theme,this.viewer.setTheme(this.theme==="dark"?wu:M_),(t=document.querySelector('meta[name="theme-color"]'))==null||t.setAttribute("content",this.theme==="dark"?"#0f172a":"#f8fafc")}onModelChange(t){this.resultSet&&this.clearResults(!1);for(const e of[...this.selection]){const{kind:n,id:s}=Is(e);(n==="j"?this.model.joint(s):n==="f"?this.model.frame(s):this.model.area(s))||this.selection.delete(e)}t==="load"&&this.tools.cancel(),this.suppressDirty||(this.dirty=!0,this.scheduleAutosave()),this.refresh()}scheduleAutosave(){clearTimeout(this.autosaveTimer),this.autosaveTimer=window.setTimeout(()=>{try{ux(ch(this.model.data),this.fileName)}catch{}},1200)}onUnitsChanged(){this.unitsEl.value=ln().id,this.coordEl.textContent="",this.viewer.rebuildAll(),$o(this,this.panelBody),this.updateStatus(),dh(this),this.dirty&&this.scheduleAutosave(),$t(`Units: ${ln().label}`)}refresh(){this.viewer.setData(this.model.data,this.selection,this.results),$o(this,this.panelBody),this.updateStatus(),this.syncResultsBar(),dh(this)}select(t,e){if(e==="replace")this.selection=new Set(t);else if(e==="add")for(const n of t)this.selection.add(n);else for(const n of t)this.selection.has(n)?this.selection.delete(n):this.selection.add(n);this.viewer.setData(this.model.data,this.selection,this.results),$o(this,this.panelBody),this.selection.size&&window.innerWidth>=700&&localStorage.getItem("structapp.panel")!=="closed"&&this.togglePanel(!0),this.updateStatus()}selected(){const t={joints:[],frames:[],areas:[]};for(const e of this.selection){const{kind:n,id:s}=Is(e);(n==="j"?t.joints:n==="f"?t.frames:t.areas).push(s)}for(const e of Object.values(t))e.sort((n,s)=>n-s);return t}selectAll(){const t=this.model.data;this.select([...t.joints.map(e=>Ue("j",e.id)),...t.frames.map(e=>Ue("f",e.id)),...t.areas.map(e=>Ue("a",e.id))],"replace")}onToolChanged(){var t,e;for(const n of["select","joint","frame","area","box"])(t=this.toolButtons.get(n))==null||t.classList.toggle("active",this.tools.tool===n);(e=this.toolButtons.get("multi"))==null||e.classList.toggle("active",this.tools.multi),this.viewer.canvas.dataset.tool=this.tools.tool,this.hintEl.textContent=Au[this.tools.tool],this.hintEl.hidden=this.tools.tool==="select",this.updateStatus()}updateStatus(){const t=this.model.data,e=this.selected(),n=e.joints.length+e.frames.length+e.areas.length,s=[this.tools.statusText(),`${t.joints.length} joints · ${t.frames.length} frames · ${t.areas.length} areas`];n&&s.push(`${n} selected`),this.results&&s.push(`analysed, max disp ${kn(this.results.stats.maxDisp/ln().kSmall,3)} ${ln().small}`),this.statusEl.textContent=s.filter(Boolean).join("  |  "),this.fileEl.textContent=(this.dirty?"● ":"")+this.fileName,document.title=`${this.dirty?"* ":""}${this.fileName} – StructApp 3D`,this.toolButtons.get("undo").disabled=!this.model.canUndo,this.toolButtons.get("redo").disabled=!this.model.canRedo,this.toolButtons.get("del").disabled=n===0;const r=this.tools.chain.length>0;this.toolButtons.get("done").disabled=!r;const{workPlane:o,elevation:a}=t.settings,l=Hx[o],c=(h,d)=>{var f;const u=(f=this.toolButtons.get(h))==null?void 0:f.querySelector("span");u&&(u.textContent=d)};c("plane",`${o} ${l}=${qt(a,"L",4)}`),c("planeUp",`${l} +`),c("planeDown",`${l} −`)}setWorkPlane(t,e){const n=this.model.data.settings;n.workPlane===t&&n.elevation===e||(n.workPlane=t,n.elevation=e,this.planeOffsets[t]=e,this.dirty=!0,this.scheduleAutosave(),this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}rotateWorkPlane(){const t=["XY","XZ","YZ"],e=this.model.data.settings,n=t[(t.indexOf(e.workPlane)+1)%t.length],{joints:s}=this.selected(),r=s.length===1?this.model.joint(s[0]):void 0,o=r?n==="XY"?r.z:n==="XZ"?r.y:r.x:void 0;this.setWorkPlane(n,o??this.planeOffsets[n]??0)}shiftWorkPlane(t){const e=this.model.data.settings;this.setWorkPlane(e.workPlane,Number((e.elevation+t*e.gridSpacing).toFixed(9)))}setCoordReadout(t){this.coordEl.textContent=t?`X ${qt(t.x,"L",4)}  Y ${qt(t.y,"L",4)}  Z ${qt(t.z,"L",4)} ${Yt("L")}`:""}cmd(t){var e,n;(n=(e=this.commands)[t])==null||n.call(e)}need(t){return this.selected()[t].length?!0:($t(`Select one or more ${t} first`,"warn"),!1)}undo(){this.model.canUndo&&(this.tools.finishChain(!1),this.keepWorkPlane(()=>this.model.undo()))}keepWorkPlane(t){const{workPlane:e,elevation:n}=this.model.data.settings;t();const s=this.model.data.settings;(s.workPlane!==e||s.elevation!==n)&&(s.workPlane=e,s.elevation=n,this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}redo(){this.model.canRedo&&this.keepWorkPlane(()=>this.model.redo())}async deleteSelected(){const t=this.selected(),e=t.joints.length+t.frames.length+t.areas.length;e&&(this.model.commit("delete",()=>this.model.deleteObjects(t.joints,t.frames,t.areas)),this.selection.clear(),this.refresh(),$t(`Deleted ${e} object${e>1?"s":""} (Undo to restore)`,"info"))}async analyze(){if(this.busy)return;this.tools.finishChain(!0);const t=this.model.data;if(!t.frames.length)return void vi("Nothing to analyse","Draw at least one frame and assign supports before running the analysis.");this.busy=!0,document.body.classList.add("busy");const e=performance.now();try{const n=await J_(t),s=n.items.find(a=>a.name===this.resultName);this.resultSet=n,this.resultName=s?s.name:(n.items.find(a=>a.kind==="combo")??n.items[0]).name;const r=this.results;this.viewer.setResults(r),this.deformRel=0,this.viewer.setResultOptions({view:"deformed",deformScale:this.viewer.autoDeformScale}),this.refresh();const o=[...new Set(n.items.flatMap(a=>n.results[a.name].warnings))];$t(`Analysis complete in ${Math.round(performance.now()-e)} ms – ${r.stats.equations} equations, ${n.items.length} cases/combos`,"ok"),o.length&&$t(o.slice(0,3).join(`
`)+(o.length>3?`
(+${o.length-3} more)`:""),"warn",7e3)}catch(n){vi("Analysis failed",n instanceof Error?n.message:String(n))}finally{this.busy=!1,document.body.classList.remove("busy")}}loadData(t,e,n){this.suppressDirty=!0;try{this.selection.clear(),this.model.load(t)}finally{this.suppressDirty=!1}this.fileName=e,this.fileHandle=n,this.planeOffsets={},this.dirty=!1,this.refresh(),this.viewer.fit()}async confirmDiscard(){return this.dirty?os("Unsaved changes",`Discard unsaved changes to ${this.fileName}?`,"Discard",!0):!0}async newModel(){await this.confirmDiscard()&&(this.loadData(Za(),"Untitled.sav",null),_s())}async open(){if(await this.confirmDiscard())try{const t=await hx();if(!t)return;const e={},n=hh(t.text,e);this.loadData(n,t.name,t.handle),_s(),e.units&&nh(e.units),$t(`Opened ${t.name} (${ln().label})`,"ok")}catch(t){vi("Cannot open file",t instanceof ye||t instanceof Error?t.message:String(t))}}async save(t=!1){this.tools.finishChain(!0);try{const e=ch(this.model.data,this.includeResults?this.resultSet:null),n=this.fileName.toLowerCase().endsWith(".sav")?this.fileName:this.fileName+".sav",s=await lx(e,n,t?null:this.fileHandle);if(!s)return;this.fileName=s.name,this.fileHandle=s.handle,this.dirty=!1,_s(),this.updateStatus(),$t(`Saved ${s.name}`,"ok")}catch(e){vi("Save failed",e instanceof Error?e.message:String(e))}}async offerRecovery(){const t=dx();if(!t)return;let e;try{e=hh(t.text)}catch{_s();return}if(!e.joints.length)return;const n=new Date(t.time).toLocaleString();await os("Recover unsaved work?",`An auto-saved copy of "${t.name}" from ${n} was found (${e.joints.length} joints, ${e.frames.length} frames).`,"Recover")?(this.loadData(e,t.name,null),this.dirty=!0,this.updateStatus()):_s()}async loadExample(){if(!await this.confirmDiscard())return;const t=new Rl,e=[0,6,12],n=[0,5],s=[0,3.5,7];t.commit("example",r=>{r.sections.push({name:"WF400",shape:"I",dims:[.4,.2,.013,.008]});const o=(a,l,c)=>t.addJoint(a,l,c);for(let a=0;a<s.length;a++)for(const l of e)for(const c of n){const h=o(l,c,s[a]);a===0&&(t.joint(h).r=[...Th])}for(let a=1;a<s.length;a++){for(const l of e)for(const c of n){const h=t.addFrame(o(l,c,s[a-1]),o(l,c,s[a]));t.frame(h).section="WF400",t.frame(h).material="STEEL"}for(const l of n)for(let c=0;c<e.length-1;c++){const h=t.addFrame(o(e[c],l,s[a]),o(e[c+1],l,s[a]));t.frame(h).section="IWF300",t.frame(h).material="STEEL"}for(const l of e){const c=t.addFrame(o(l,0,s[a]),o(l,5,s[a]));t.frame(c).section="IWF300",t.frame(c).material="STEEL"}for(let l=0;l<e.length-1;l++){const c=t.addArea([o(e[l],0,s[a]),o(e[l+1],0,s[a]),o(e[l+1],5,s[a]),o(e[l],5,s[a])]);r.areaLoads.push({case:Fr,area:c,q:1.5},{case:Or,area:c,q:2.5})}for(const l of n)r.jointLoads.push({case:"WIND",joint:o(0,l,s[a]),f:[5*a,0,0,0,0,0]})}r.loadCases.push({name:"WIND",type:"Other"}),r.loadCombos.push({name:"COMBO2",factors:[{case:Fr,factor:1.2},{case:Or,factor:1},{case:"WIND",factor:1}]}),r.settings.gridSpacing=1,r.settings.gridLines=15,r.settings.selfWeight=!0}),this.loadData(t.data,"Example-2storey.sav",null),$t("Example loaded – tap Run to analyse","ok")}toggle(t,e,n){return{label:t,checked:e,action:()=>n(!e())}}disp(t,e){return this.toggle(t,()=>this.viewer.display[e],n=>{this.viewer.display[e]=n,this.viewer.rebuildAll()})}fileMenu(){return[{label:"New",shortcut:"Ctrl+N",action:()=>void this.newModel()},{label:"Open .sav…",shortcut:"Ctrl+O",action:()=>void this.open()},{label:"Save",shortcut:"Ctrl+S",action:()=>void this.save()},{label:"Save As…",shortcut:"Ctrl+Shift+S",action:()=>void this.save(!0)},{separator:!0},this.toggle("Include results in .sav",()=>this.includeResults,t=>this.includeResults=t),{separator:!0},{label:"Load example model",action:()=>void this.loadExample()}]}editMenu(){const t=()=>this.selection.size===0;return[{label:"Undo",shortcut:"Ctrl+Z",action:()=>this.undo(),disabled:()=>!this.model.canUndo},{label:"Redo",shortcut:"Ctrl+Y",action:()=>this.redo(),disabled:()=>!this.model.canRedo},{separator:!0},{label:"Select all",shortcut:"Ctrl+A",action:()=>this.selectAll()},{label:"Clear selection",shortcut:"Esc",action:()=>this.select([],"replace"),disabled:t},{label:"Delete selected",shortcut:"Del",action:()=>void this.deleteSelected(),disabled:t},{separator:!0},{label:"Move…",action:()=>vh(this),disabled:t},{label:"Replicate…",action:()=>_h(this),disabled:t},{label:"Divide frames…",action:()=>this.cmd("divide"),disabled:()=>!this.selected().frames.length}]}defineMenu(){return[{label:"Materials…",action:()=>Mx(this)},{label:"Frame sections…",action:()=>Sx(this)},{label:"Support types…",action:()=>bx(this)},{separator:!0},{label:"Grid & work plane…",action:()=>ph(this)}]}drawMenu(){const t=(e,n,s)=>({label:n,shortcut:s,checked:()=>this.tools.tool===e,action:()=>this.tools.setTool(e)});return[t("select","Select","S"),t("joint","Draw joint","J"),t("frame","Draw frame","L"),t("area","Draw area","A"),t("box","Box select","B"),{separator:!0},{label:"Add joint by coordinates…",action:()=>gh(this)},{label:"Add frame by joints…",action:()=>Lx(this)},{separator:!0},{label:"Grid & work plane…",action:()=>ph(this)}]}assignMenu(){return[{heading:"Joints"},{label:"Support / restraints…",action:()=>this.cmd("assignSupport")},{heading:"Frames"},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"Local axis angle β…",action:()=>this.cmd("assignBeta")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{heading:"Areas"},{label:"Load distribution…",action:()=>this.cmd("assignArea")}]}loadsMenu(){return[{label:"Joint point load…",action:()=>this.cmd("jointLoad")},{label:"Frame point load…",action:()=>this.cmd("framePoint")},{label:"Frame uniform load…",action:()=>this.cmd("frameUniform")},{label:"Area uniform load…",action:()=>this.cmd("areaLoad")},{separator:!0},{label:"Load cases…",action:()=>Ix(this)},{label:"Load combinations…",action:()=>Ux(this)},{separator:!0},this.toggle("Include self weight",()=>this.model.data.settings.selfWeight,t=>this.model.commit("self weight",e=>void(e.settings.selfWeight=t))),{separator:!0},{label:"Clear loads on selection…",action:()=>void mh(this),disabled:()=>this.selection.size===0}]}analyzeMenu(){const t=()=>!this.results,e=(n,s)=>({label:s,checked:()=>this.viewer.resultOpts.view===n,disabled:t,action:()=>this.setResultView(n)});return[{label:"Run analysis",shortcut:"F5",action:()=>void this.analyze()},{heading:"Show"},...yh.map(([n,s])=>e(n,s)),{separator:!0},{label:"Frame diagram…",disabled:t,action:()=>{const n=this.selected().frames;n.length===1?Ya(this,n[0]):$t(n.length?"Select only one frame to show its diagrams":"Select one frame first, then choose Analyze ▸ Frame diagram","warn")}},{label:"Result tables…",action:()=>Xo(this),disabled:t},{label:"Clear results",disabled:t,action:()=>this.clearResults()}]}displayMenu(){const t=this.viewer;return[{heading:"View"},{label:"Fit all",shortcut:"F",action:()=>t.fit()},{label:"3D (isometric)",shortcut:"0",action:()=>t.viewPreset("iso")},{label:"Top (X-Y)",shortcut:"1",action:()=>t.viewPreset("top")},{label:"Front (X-Z)",shortcut:"2",action:()=>t.viewPreset("front")},{label:"Side (Y-Z)",shortcut:"3",action:()=>t.viewPreset("side")},this.toggle("Orthographic",()=>t.useOrtho,e=>t.setOrtho(e)),{heading:"Show"},this.disp("Joint labels","jointLabels"),this.disp("Frame labels","frameLabels"),this.disp("Area labels","areaLabels"),this.disp("Loads","showLoads"),this.disp("Load values","loadValues"),this.disp("Supports","showSupports"),this.disp("Extruded sections","extruded"),{separator:!0},this.toggle("Dark theme",()=>this.theme==="dark",e=>{this.theme=e?"dark":"light",localStorage.setItem("structapp.theme",this.theme),this.applyTheme()}),this.toggle("Properties panel",()=>!this.panel.classList.contains("collapsed"),e=>this.togglePanel(e))]}helpMenu(){return[{label:"Quick guide",shortcut:"F1",action:()=>xh()},{label:"Load example model",action:()=>void this.loadExample()},{separator:!0},{label:"About",action:()=>void vi("About StructApp 3D",C("div",{class:"about"},C("p",{class:"msg"},`StructApp 3D v${kx} (${Vx})
Touch-friendly 3D frame structural analysis (linear static, 12-DOF space frame elements with member end releases and shear deformation).`),C("h3",null,"Version history"),C("div",{class:"changelog",tabindex:"0","aria-label":"Version history"},...Gx.map(t=>C("section",null,C("h4",null,/^\d/.test(t.version)?`v${t.version}`:`${t.version} release`,C("span",{class:"date"},t.date)),C("ul",null,...t.changes.map(e=>C("li",null,e))))))))}]}contextMenu(t,e){this.tools.finishChain(!0);const n=this.viewer.pick(t,e,24);n&&!this.selection.has(n)&&this.select([n],this.tools.multi?"add":"replace");const s=this.selected(),r=[];if(s.joints.length&&r.push({heading:`Joints (${s.joints.length})`},{label:"Support…",action:()=>this.cmd("assignSupport")},{label:"Joint load…",action:()=>this.cmd("jointLoad")}),s.frames.length===1&&this.results){const o=s.frames[0];r.push({heading:`Frame ${o} results`},{label:"Frame diagrams…",action:()=>Ya(this,o)})}s.frames.length&&r.push({heading:`Frames (${s.frames.length})`},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{label:"Point load…",action:()=>this.cmd("framePoint")},{label:"Uniform load…",action:()=>this.cmd("frameUniform")},{label:"Divide…",action:()=>this.cmd("divide")}),s.areas.length&&r.push({heading:`Areas (${s.areas.length})`},{label:"Area load…",action:()=>this.cmd("areaLoad")},{label:"Distribution…",action:()=>this.cmd("assignArea")}),this.selection.size?r.push({separator:!0},{label:"Properties",action:()=>this.togglePanel(!0)},{label:"Move…",action:()=>this.cmd("move")},{label:"Replicate…",action:()=>this.cmd("replicate")},{label:"Clear loads…",action:()=>void mh(this)},{label:"Delete",action:()=>void this.deleteSelected()},{label:"Clear selection",action:()=>this.select([],"replace")}):r.push({label:"Fit all",action:()=>this.viewer.fit()},{label:"Add joint…",action:()=>gh(this)},{label:"Select all",action:()=>this.selectAll()},{label:"Run analysis",action:()=>void this.analyze()}),oh(r,t,e)}installKeyboard(){window.addEventListener("keydown",t=>{const e=t.target;if(L_()||["INPUT","TEXTAREA","SELECT"].includes(e.tagName)||e.isContentEditable)return;const n=t.key.toLowerCase(),s=t.ctrlKey||t.metaKey,r=o=>{t.preventDefault(),o()};if(s){n==="z"&&!t.shiftKey?r(()=>this.undo()):n==="y"||n==="z"&&t.shiftKey?r(()=>this.redo()):n==="s"?r(()=>void this.save(t.shiftKey)):n==="o"?r(()=>void this.open()):n==="n"?r(()=>void this.newModel()):n==="a"&&r(()=>this.selectAll());return}if(!t.altKey)switch(n){case"delete":case"backspace":return r(()=>void this.deleteSelected());case"escape":return r(()=>{Wr(),this.tools.chain.length?this.tools.cancel():this.tools.tool!=="select"?this.tools.setTool("select"):this.select([],"replace")});case"enter":return r(()=>this.tools.finishChain(!0));case"f":return r(()=>this.viewer.fit());case"p":return r(()=>this.rotateWorkPlane());case"pageup":return r(()=>this.shiftWorkPlane(1));case"pagedown":return r(()=>this.shiftWorkPlane(-1));case"s":return r(()=>this.tools.setTool("select"));case"j":return r(()=>this.tools.setTool("joint"));case"l":return r(()=>this.tools.setTool("frame"));case"a":return r(()=>this.tools.setTool("area"));case"b":return r(()=>this.tools.setTool("box"));case"m":return r(()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()});case"f5":return r(()=>void this.analyze());case"f1":return r(()=>xh());case"0":return r(()=>this.viewer.viewPreset("iso"));case"1":return r(()=>this.viewer.viewPreset("top"));case"2":return r(()=>this.viewer.viewPreset("front"));case"3":return r(()=>this.viewer.viewPreset("side"))}})}}let Sh=0;document.addEventListener("touchend",i=>{const t=Date.now(),e=i.target;t-Sh<350&&!e.closest("input, textarea, select")&&i.preventDefault(),Sh=t},{passive:!1});const Ou=document.getElementById("app");if(!Ou)throw new Error("#app element missing");const $x=new Xx(Ou);window.structApp=$x;
