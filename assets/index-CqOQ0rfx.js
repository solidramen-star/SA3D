var zu=Object.defineProperty;var ku=(i,t,e)=>t in i?zu(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var it=(i,t,e)=>ku(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Vu=["P","V2","V3","T","M2","M3"];function Nr(i){if(!i||!i.some(Boolean))return"None";const t=[];return i[0]&&t.push("P"),i[1]&&t.push("V2"),i[2]&&t.push("V3"),i[3]&&t.push("T"),i[4]&&t.push("M2"),i[5]&&t.push("M3"),t.join(" ")}function Tl(i){if(!i)return;const t=i.trim().toUpperCase();if(!t||t==="NONE"||t==="NO"||t==="FIXED"||t==="RIGID")return;if(t==="PIN"||t==="PINNED"||t==="HINGE")return[!1,!1,!1,!1,!0,!0];const e=new Set(t.split(/[\s,;|+]+/).map(s=>s.trim().toUpperCase())),n=[e.has("P")||e.has("U1")||e.has("AXIAL"),e.has("V2")||e.has("U2"),e.has("V3")||e.has("U3"),e.has("T")||e.has("R1")||e.has("TORSION"),e.has("M2")||e.has("R2"),e.has("M3")||e.has("R3")];return n.some(Boolean)?n:void 0}const Sh=["GRAV","GX","GY","GZ","L1","L2","L3"],$a={GRAV:"Gravity (−Z)",GX:"Global X",GY:"Global Y",GZ:"Global Z",L1:"Local 1",L2:"Local 2",L3:"Local 3"},bh=["Dead","Live","Other"],Eh=[!1,!1,!1,!1,!1,!1],wh=[!0,!0,!0,!0,!0,!0],Gu=[!0,!0,!0,!1,!1,!1],Hu=[!1,!1,!0,!1,!1,!1],ii=["UX","UY","UZ","RX","RY","RZ"];function Yo(){return{settings:{gridSpacing:1,gridLines:10,workPlane:"XY",elevation:0,selfWeight:!0},materials:[{name:"STEEL",E:2e8,nu:.3,gamma:76.98},{name:"C30",E:25743e3,nu:.2,gamma:23.56}],sections:[{name:"R300x500",shape:"rect",dims:[.5,.3]},{name:"IWF300",shape:"I",dims:[.3,.15,.009,.0065]},{name:"PIPE168",shape:"pipe",dims:[.1683,.0071]}],supportTypes:[{name:"Fixed",r:[...wh]},{name:"Pinned",r:[...Gu]},{name:"Roller Z",r:[...Hu]},{name:"Free",r:[...Eh]}],joints:[],frames:[],areas:[],loadCases:Ah(),loadCombos:Th(),jointLoads:[],framePointLoads:[],frameUniformLoads:[],areaLoads:[]}}const Fr="DEAD",Or="LIVE";function Ah(){return[{name:Fr,type:"Dead"},{name:Or,type:"Live"}]}function Th(){return[{name:"COMBO1",factors:[{case:Fr,factor:1.2},{case:Or,factor:1.6}]}]}function Br(i){(!Array.isArray(i.loadCases)||i.loadCases.length===0)&&(i.loadCases=Ah()),Array.isArray(i.loadCombos)||(i.loadCombos=Th());const t=new Set(i.loadCases.map(n=>n.name)),e=i.loadCases[0].name;for(const n of[i.jointLoads,i.framePointLoads,i.frameUniformLoads,i.areaLoads])for(const s of n??[])(!s.case||!t.has(s.case))&&(s.case=e);for(const n of i.loadCombos)n.factors=(n.factors??[]).filter(s=>t.has(s.case)&&Number.isFinite(s.factor));return i}const ta=1e-6;class Cl{constructor(t){it(this,"data");it(this,"undoStack",[]);it(this,"redoStack",[]);it(this,"listeners",new Set);it(this,"batchDepth",0);it(this,"maxUndo",100);this.data=Br(t??Yo())}onChange(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(t){for(const e of this.listeners)e(t)}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}commit(t,e){if(this.batchDepth>0)return e(this.data);const n=JSON.stringify(this.data);this.batchDepth++;let s;try{s=e(this.data)}catch(r){throw this.data=JSON.parse(n),r}finally{this.batchDepth--}return JSON.stringify(this.data)!==n&&(this.undoStack.push(n),this.undoStack.length>this.maxUndo&&this.undoStack.shift(),this.redoStack=[],this.emit(t)),s}undo(){const t=this.undoStack.pop();t&&(this.redoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("undo"))}redo(){const t=this.redoStack.pop();t&&(this.undoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("redo"))}load(t){this.data=Br(t),this.undoStack=[],this.redoStack=[],this.emit("load")}joint(t){return this.data.joints.find(e=>e.id===t)}frame(t){return this.data.frames.find(e=>e.id===t)}area(t){return this.data.areas.find(e=>e.id===t)}jointMap(){return new Map(this.data.joints.map(t=>[t.id,t]))}frameLength(t){const e=this.joint(t.i),n=this.joint(t.j);return!e||!n?0:Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z)}nextId(t){let e=0;for(const n of t)n.id>e&&(e=n.id);return e+1}findJointAt(t,e,n){return this.data.joints.find(s=>Math.abs(s.x-t)<ta&&Math.abs(s.y-e)<ta&&Math.abs(s.z-n)<ta)}addJoint(t,e,n){const s=a=>Math.round(a*1e9)/1e9;t=s(t),e=s(e),n=s(n);const r=this.findJointAt(t,e,n);return r?r.id:this.commit("add joint",a=>{const o=this.nextId(a.joints);return a.joints.push({id:o,x:t,y:e,z:n,r:[...Eh]}),o})}addFrame(t,e){if(t===e||!this.joint(t)||!this.joint(e))return null;const n=this.data.frames.find(s=>s.i===t&&s.j===e||s.i===e&&s.j===t);return n?n.id:this.commit("add frame",s=>{var a,o;const r=this.nextId(s.frames);return s.frames.push({id:r,i:t,j:e,material:((a=s.materials[0])==null?void 0:a.name)??"",section:((o=s.sections[0])==null?void 0:o.name)??"",beta:0}),r})}addArea(t){const e=t.filter((n,s)=>t.indexOf(n)===s);return e.length<3?null:this.commit("add area",n=>{const s=this.nextId(n.areas);return n.areas.push({id:s,joints:e,distribution:"two-way"}),s})}deleteObjects(t,e,n){const s=new Set(t),r=new Set(e),a=new Set(n);this.commit("delete",o=>{for(const l of o.frames)(s.has(l.i)||s.has(l.j))&&r.add(l.id);for(const l of o.areas)l.joints.some(c=>s.has(c))&&a.add(l.id);o.joints=o.joints.filter(l=>!s.has(l.id)),o.frames=o.frames.filter(l=>!r.has(l.id)),o.areas=o.areas.filter(l=>!a.has(l.id)),o.jointLoads=o.jointLoads.filter(l=>!s.has(l.joint)),o.framePointLoads=o.framePointLoads.filter(l=>!r.has(l.frame)),o.frameUniformLoads=o.frameUniformLoads.filter(l=>!r.has(l.frame)),o.areaLoads=o.areaLoads.filter(l=>!a.has(l.area))})}jointsOf(t,e,n){var r;const s=new Set(t);for(const a of e){const o=this.frame(a);o&&(s.add(o.i),s.add(o.j))}for(const a of n)(r=this.area(a))==null||r.joints.forEach(o=>s.add(o));return s}moveJoints(t,e,n,s){const r=this.data.joints.filter(a=>t.has(a.id));for(const a of r){const o=this.findJointAt(a.x+e,a.y+n,a.z+s);if(o&&!t.has(o.id))return`Joint ${a.id} would overlap joint ${o.id}`}return this.commit("move",()=>{for(const a of r)a.x+=e,a.y+=n,a.z+=s}),null}replicate(t,e,n,s,r,a,o){const l={joints:[],frames:[],areas:[]};return this.commit("replicate",c=>{const h=this.jointsOf(t,e,n);for(let d=1;d<=o;d++){const u=new Map;for(const f of h){const p=this.joint(f),g=this.addJoint(p.x+s*d,p.y+r*d,p.z+a*d),m=this.joint(g);m.r=[...p.r],u.set(f,g),l.joints.push(g)}for(const f of e){const p=this.frame(f),g=this.addFrame(u.get(p.i),u.get(p.j));if(g!=null){const m=this.frame(g);m.material=p.material,m.section=p.section,m.beta=p.beta,l.frames.push(g);for(const v of c.framePointLoads.filter(_=>_.frame===f))c.framePointLoads.push({...v,frame:g});for(const v of c.frameUniformLoads.filter(_=>_.frame===f))c.frameUniformLoads.push({...v,frame:g})}}for(const f of n){const p=this.area(f),g=this.addArea(p.joints.map(m=>u.get(m)));if(g!=null){this.area(g).distribution=p.distribution,l.areas.push(g);for(const m of c.areaLoads.filter(v=>v.area===f))c.areaLoads.push({...m,area:g})}}for(const f of t)for(const p of c.jointLoads.filter(g=>g.joint===f))c.jointLoads.push({...p,joint:u.get(f),f:[...p.f]})}}),l}divideFrame(t,e){const n=this.frame(t);!n||e<2||this.commit("divide frame",s=>{const r=this.joint(n.i),a=this.joint(n.j),o=[n.i];for(let d=1;d<e;d++){const u=d/e;o.push(this.addJoint(r.x+(a.x-r.x)*u,r.y+(a.y-r.y)*u,r.z+(a.z-r.z)*u))}o.push(n.j);const l=s.frameUniformLoads.filter(d=>d.frame===t);s.frames=s.frames.filter(d=>d.id!==t),s.frameUniformLoads=s.frameUniformLoads.filter(d=>d.frame!==t);const c=s.framePointLoads.filter(d=>d.frame===t);s.framePointLoads=s.framePointLoads.filter(d=>d.frame!==t);const h=[];for(let d=0;d<e;d++){const u=this.addFrame(o[d],o[d+1]),f=this.frame(u);f.material=n.material,f.section=n.section,f.beta=n.beta,h.push(u);for(const p of l)s.frameUniformLoads.push({...p,frame:u})}for(const d of c){const u=d.rd*e,f=Math.min(Math.floor(u),e-1);s.framePointLoads.push({...d,frame:h[f],rd:u-f})}})}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Jo="170",Wu=0,Rl=1,Xu=2,Ch=1,$u=2,Dn=3,si=0,$e=1,cn=2,ei=0,Ji=1,Ll=2,Pl=3,Dl=4,ju=5,mi=100,qu=101,Yu=102,Ju=103,Zu=104,Ku=200,Qu=201,td=202,ed=203,ja=204,qa=205,nd=206,id=207,sd=208,rd=209,ad=210,od=211,ld=212,cd=213,hd=214,Ya=0,Ja=1,Za=2,Qi=3,Ka=4,Qa=5,to=6,eo=7,Rh=0,ud=1,dd=2,ni=0,fd=1,pd=2,md=3,gd=4,vd=5,_d=6,xd=7,Lh=300,ts=301,es=302,no=303,io=304,$r=306,so=1e3,_i=1001,ro=1002,fn=1003,Md=1004,$s=1005,Mn=1006,ea=1007,xi=1008,Bn=1009,Ph=1010,Dh=1011,Us=1012,Zo=1013,Si=1014,Nn=1015,ks=1016,Ko=1017,Qo=1018,ns=1020,Ih=35902,Uh=1021,Nh=1022,dn=1023,Fh=1024,Oh=1025,Zi=1026,is=1027,Bh=1028,tl=1029,zh=1030,el=1031,nl=1033,Tr=33776,Cr=33777,Rr=33778,Lr=33779,ao=35840,oo=35841,lo=35842,co=35843,ho=36196,uo=37492,fo=37496,po=37808,mo=37809,go=37810,vo=37811,_o=37812,xo=37813,Mo=37814,yo=37815,So=37816,bo=37817,Eo=37818,wo=37819,Ao=37820,To=37821,Pr=36492,Co=36494,Ro=36495,kh=36283,Lo=36284,Po=36285,Do=36286,yd=3200,Sd=3201,Vh=0,bd=1,Kn="",We="srgb",os="srgb-linear",jr="linear",re="srgb",Li=7680,Il=519,Ed=512,wd=513,Ad=514,Gh=515,Td=516,Cd=517,Rd=518,Ld=519,Io=35044,Ul="300 es",Fn=2e3,zr=2001;class ls{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Nl=1234567;const Es=Math.PI/180,Ns=180/Math.PI;function yn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]).toLowerCase()}function Te(i,t,e){return Math.max(t,Math.min(e,i))}function il(i,t){return(i%t+t)%t}function Pd(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Dd(i,t,e){return i!==t?(e-i)/(t-i):0}function ws(i,t,e){return(1-e)*i+e*t}function Id(i,t,e,n){return ws(i,t,1-Math.exp(-e*n))}function Ud(i,t=1){return t-Math.abs(il(i,t*2)-t)}function Nd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Fd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Od(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Bd(i,t){return i+Math.random()*(t-i)}function zd(i){return i*(.5-Math.random())}function kd(i){i!==void 0&&(Nl=i);let t=Nl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Vd(i){return i*Es}function Gd(i){return i*Ns}function Hd(i){return(i&i-1)===0&&i!==0}function Wd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Xd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function $d(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function hn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const fi={DEG2RAD:Es,RAD2DEG:Ns,generateUUID:yn,clamp:Te,euclideanModulo:il,mapLinear:Pd,inverseLerp:Dd,lerp:ws,damp:Id,pingpong:Ud,smoothstep:Nd,smootherstep:Fd,randInt:Od,randFloat:Bd,randFloatSpread:zd,seededRandom:kd,degToRad:Vd,radToDeg:Gd,isPowerOfTwo:Hd,ceilPowerOfTwo:Wd,floorPowerOfTwo:Xd,setQuaternionFromProperEuler:$d,normalize:ie,denormalize:hn};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class kt{constructor(t,e,n,s,r,a,o,l,c){kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],g=s[0],m=s[3],v=s[6],_=s[1],M=s[4],x=s[7],D=s[2],T=s[5],R=s[8];return r[0]=a*g+o*_+l*D,r[3]=a*m+o*M+l*T,r[6]=a*v+o*x+l*R,r[1]=c*g+h*_+d*D,r[4]=c*m+h*M+d*T,r[7]=c*v+h*x+d*R,r[2]=u*g+f*_+p*D,r[5]=u*m+f*M+p*T,r[8]=u*v+f*x+p*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,p=e*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/p;return t[0]=d*g,t[1]=(s*c-h*n)*g,t[2]=(o*n-s*a)*g,t[3]=u*g,t[4]=(h*e-s*l)*g,t[5]=(s*r-o*e)*g,t[6]=f*g,t[7]=(n*l-c*e)*g,t[8]=(a*e-n*r)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(na.makeScale(t,e)),this}rotate(t){return this.premultiply(na.makeRotation(-t)),this}translate(t,e){return this.premultiply(na.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const na=new kt;function Hh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function jd(){const i=kr("canvas");return i.style.display="block",i}const Fl={};function Ms(i){i in Fl||(Fl[i]=!0,console.warn(i))}function qd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Yd(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Jd(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Zt={enabled:!0,workingColorSpace:os,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===re&&(i.r=On(i.r),i.g=On(i.g),i.b=On(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===re&&(i.r=Ki(i.r),i.g=Ki(i.g),i.b=Ki(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Kn?jr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function On(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Ol=[.64,.33,.3,.6,.15,.06],Bl=[.2126,.7152,.0722],zl=[.3127,.329],kl=new kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vl=new kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Zt.define({[os]:{primaries:Ol,whitePoint:zl,transfer:jr,toXYZ:kl,fromXYZ:Vl,luminanceCoefficients:Bl,workingColorSpaceConfig:{unpackColorSpace:We},outputColorSpaceConfig:{drawingBufferColorSpace:We}},[We]:{primaries:Ol,whitePoint:zl,transfer:re,toXYZ:kl,fromXYZ:Vl,luminanceCoefficients:Bl,outputColorSpaceConfig:{drawingBufferColorSpace:We}}});let Pi;class Zd{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Pi===void 0&&(Pi=kr("canvas")),Pi.width=t.width,Pi.height=t.height;const n=Pi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Pi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=kr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=On(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(On(e[n]/255)*255):e[n]=On(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Kd=0;class Wh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=yn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ia(s[a].image)):r.push(ia(s[a]))}else r=ia(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ia(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Zd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qd=0;class Ge extends ls{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,n=_i,s=_i,r=Mn,a=xi,o=dn,l=Bn,c=Ge.DEFAULT_ANISOTROPY,h=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qd++}),this.uuid=yn(),this.name="",this.source=new Wh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Lh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case so:t.x=t.x-Math.floor(t.x);break;case _i:t.x=t.x<0?0:1;break;case ro:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case so:t.y=t.y-Math.floor(t.y);break;case _i:t.y=t.y<0?0:1;break;case ro:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Lh;Ge.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],g=l[2],m=l[6],v=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+v-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,x=(f+1)/2,D=(v+1)/2,T=(h+u)/4,R=(d+g)/4,I=(p+m)/4;return M>x&&M>D?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=R/n):x>D?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=T/s,r=I/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=R/r,s=I/r),this.set(n,s,r,e),this}let _=Math.sqrt((m-p)*(m-p)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(m-p)/_,this.y=(d-g)/_,this.z=(u-h)/_,this.w=Math.acos((c+f+v-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tf extends ls{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ge(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Wh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends tf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Xh extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ef extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Vs{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=r[a+0],f=r[a+1],p=r[a+2],g=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=u,t[e+1]=f,t[e+2]=p,t[e+3]=g;return}if(d!==g||l!==u||c!==f||h!==p){let m=1-o;const v=l*u+c*f+h*p+d*g,_=v>=0?1:-1,M=1-v*v;if(M>Number.EPSILON){const D=Math.sqrt(M),T=Math.atan2(D,v*_);m=Math.sin(m*T)/D,o=Math.sin(o*T)/D}const x=o*_;if(l=l*m+u*x,c=c*m+f*x,h=h*m+p*x,d=d*m+g*x,m===1-o){const D=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=D,c*=D,h*=D,d*=D}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return t[e]=o*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-o*f,t[e+2]=c*p+h*f+o*u-l*d,t[e+3]=h*p-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Te(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=a*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Gl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Gl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return sa.copy(this).projectOnVector(t),this.sub(sa)}reflect(t){return this.sub(sa.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const sa=new P,Gl=new Vs;class Vn{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,sn):sn.fromBufferAttribute(r,a),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),js.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),js.copy(n.boundingBox)),js.applyMatrix4(t.matrixWorld),this.union(js)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ps),qs.subVectors(this.max,ps),Di.subVectors(t.a,ps),Ii.subVectors(t.b,ps),Ui.subVectors(t.c,ps),Xn.subVectors(Ii,Di),$n.subVectors(Ui,Ii),ai.subVectors(Di,Ui);let e=[0,-Xn.z,Xn.y,0,-$n.z,$n.y,0,-ai.z,ai.y,Xn.z,0,-Xn.x,$n.z,0,-$n.x,ai.z,0,-ai.x,-Xn.y,Xn.x,0,-$n.y,$n.x,0,-ai.y,ai.x,0];return!ra(e,Di,Ii,Ui,qs)||(e=[1,0,0,0,1,0,0,0,1],!ra(e,Di,Ii,Ui,qs))?!1:(Ys.crossVectors(Xn,$n),e=[Ys.x,Ys.y,Ys.z],ra(e,Di,Ii,Ui,qs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Tn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const Tn=[new P,new P,new P,new P,new P,new P,new P,new P],sn=new P,js=new Vn,Di=new P,Ii=new P,Ui=new P,Xn=new P,$n=new P,ai=new P,ps=new P,qs=new P,Ys=new P,oi=new P;function ra(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){oi.fromArray(i,r);const o=s.x*Math.abs(oi.x)+s.y*Math.abs(oi.y)+s.z*Math.abs(oi.z),l=t.dot(oi),c=e.dot(oi),h=n.dot(oi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const nf=new Vn,ms=new P,aa=new P;class Ci{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):nf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ms.subVectors(t,this.center);const e=ms.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ms,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(aa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ms.copy(t.center).add(aa)),this.expandByPoint(ms.copy(t.center).sub(aa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Cn=new P,oa=new P,Js=new P,jn=new P,la=new P,Zs=new P,ca=new P;class sl{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){oa.copy(t).add(e).multiplyScalar(.5),Js.copy(e).sub(t).normalize(),jn.copy(this.origin).sub(oa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Js),o=jn.dot(this.direction),l=-jn.dot(Js),c=jn.lengthSq(),h=Math.abs(1-a*a);let d,u,f,p;if(h>0)if(d=a*l-o,u=a*o-l,p=r*h,d>=0)if(u>=-p)if(u<=p){const g=1/h;d*=g,u*=g,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(oa).addScaledVector(Js,u),f}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,r){la.subVectors(e,t),Zs.subVectors(n,t),ca.crossVectors(la,Zs);let a=this.direction.dot(ca),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;jn.subVectors(this.origin,t);const l=o*this.direction.dot(Zs.crossVectors(jn,Zs));if(l<0)return null;const c=o*this.direction.dot(la.cross(jn));if(c<0||l+c>a)return null;const h=-o*jn.dot(ca);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,n,s,r,a,o,l,c,h,d,u,f,p,g,m){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,u,f,p,g,m)}set(t,e,n,s,r,a,o,l,c,h,d,u,f,p,g,m){const v=this.elements;return v[0]=t,v[4]=e,v[8]=n,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=h,v[10]=d,v[14]=u,v[3]=f,v[7]=p,v[11]=g,v[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ni.setFromMatrixColumn(t,0).length(),r=1/Ni.setFromMatrixColumn(t,1).length(),a=1/Ni.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=a*h,f=a*d,p=o*h,g=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-g*c,e[9]=-o*l,e[2]=g-u*c,e[6]=p+f*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u+g*o,e[4]=p*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=g+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,g=c*d;e[0]=u-g*o,e[4]=-a*d,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=g-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,f=a*d,p=o*h,g=o*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+g,e[1]=l*d,e[5]=g*c+u,e[9]=f*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,f=a*c,p=o*l,g=o*c;e[0]=l*h,e[4]=g-u*d,e[8]=p*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-g*d}else if(t.order==="XZY"){const u=a*l,f=a*c,p=o*l,g=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+g,e[5]=a*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=o*h,e[10]=g*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(sf,t,rf)}lookAt(t,e,n){const s=this.elements;return qe.subVectors(t,e),qe.lengthSq()===0&&(qe.z=1),qe.normalize(),qn.crossVectors(n,qe),qn.lengthSq()===0&&(Math.abs(n.z)===1?qe.x+=1e-4:qe.z+=1e-4,qe.normalize(),qn.crossVectors(n,qe)),qn.normalize(),Ks.crossVectors(qe,qn),s[0]=qn.x,s[4]=Ks.x,s[8]=qe.x,s[1]=qn.y,s[5]=Ks.y,s[9]=qe.y,s[2]=qn.z,s[6]=Ks.z,s[10]=qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],g=n[6],m=n[10],v=n[14],_=n[3],M=n[7],x=n[11],D=n[15],T=s[0],R=s[4],I=s[8],S=s[12],y=s[1],A=s[5],V=s[9],F=s[13],z=s[2],j=s[6],G=s[10],J=s[14],W=s[3],at=s[7],ht=s[11],mt=s[15];return r[0]=a*T+o*y+l*z+c*W,r[4]=a*R+o*A+l*j+c*at,r[8]=a*I+o*V+l*G+c*ht,r[12]=a*S+o*F+l*J+c*mt,r[1]=h*T+d*y+u*z+f*W,r[5]=h*R+d*A+u*j+f*at,r[9]=h*I+d*V+u*G+f*ht,r[13]=h*S+d*F+u*J+f*mt,r[2]=p*T+g*y+m*z+v*W,r[6]=p*R+g*A+m*j+v*at,r[10]=p*I+g*V+m*G+v*ht,r[14]=p*S+g*F+m*J+v*mt,r[3]=_*T+M*y+x*z+D*W,r[7]=_*R+M*A+x*j+D*at,r[11]=_*I+M*V+x*G+D*ht,r[15]=_*S+M*F+x*J+D*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],g=t[7],m=t[11],v=t[15];return p*(+r*l*d-s*c*d-r*o*u+n*c*u+s*o*f-n*l*f)+g*(+e*l*f-e*c*u+r*a*u-s*a*f+s*c*h-r*l*h)+m*(+e*c*d-e*o*f-r*a*d+n*a*f+r*o*h-n*c*h)+v*(-s*o*h-e*l*d+e*o*u+s*a*d-n*a*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],g=t[13],m=t[14],v=t[15],_=d*m*c-g*u*c+g*l*f-o*m*f-d*l*v+o*u*v,M=p*u*c-h*m*c-p*l*f+a*m*f+h*l*v-a*u*v,x=h*g*c-p*d*c+p*o*f-a*g*f-h*o*v+a*d*v,D=p*d*l-h*g*l-p*o*u+a*g*u+h*o*m-a*d*m,T=e*_+n*M+s*x+r*D;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return t[0]=_*R,t[1]=(g*u*r-d*m*r-g*s*f+n*m*f+d*s*v-n*u*v)*R,t[2]=(o*m*r-g*l*r+g*s*c-n*m*c-o*s*v+n*l*v)*R,t[3]=(d*l*r-o*u*r-d*s*c+n*u*c+o*s*f-n*l*f)*R,t[4]=M*R,t[5]=(h*m*r-p*u*r+p*s*f-e*m*f-h*s*v+e*u*v)*R,t[6]=(p*l*r-a*m*r-p*s*c+e*m*c+a*s*v-e*l*v)*R,t[7]=(a*u*r-h*l*r+h*s*c-e*u*c-a*s*f+e*l*f)*R,t[8]=x*R,t[9]=(p*d*r-h*g*r-p*n*f+e*g*f+h*n*v-e*d*v)*R,t[10]=(a*g*r-p*o*r+p*n*c-e*g*c-a*n*v+e*o*v)*R,t[11]=(h*o*r-a*d*r-h*n*c+e*d*c+a*n*f-e*o*f)*R,t[12]=D*R,t[13]=(h*g*s-p*d*s+p*n*u-e*g*u-h*n*m+e*d*m)*R,t[14]=(p*o*s-a*g*s-p*n*l+e*g*l+a*n*m-e*o*m)*R,t[15]=(a*d*s-h*o*s+h*n*l-e*d*l-a*n*u+e*o*u)*R,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,p=r*d,g=a*h,m=a*d,v=o*d,_=l*c,M=l*h,x=l*d,D=n.x,T=n.y,R=n.z;return s[0]=(1-(g+v))*D,s[1]=(f+x)*D,s[2]=(p-M)*D,s[3]=0,s[4]=(f-x)*T,s[5]=(1-(u+v))*T,s[6]=(m+_)*T,s[7]=0,s[8]=(p+M)*R,s[9]=(m-_)*R,s[10]=(1-(u+g))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ni.set(s[0],s[1],s[2]).length();const a=Ni.set(s[4],s[5],s[6]).length(),o=Ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],rn.copy(this);const c=1/r,h=1/a,d=1/o;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=h,rn.elements[5]*=h,rn.elements[6]*=h,rn.elements[8]*=d,rn.elements[9]*=d,rn.elements[10]*=d,e.setFromRotationMatrix(rn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Fn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let f,p;if(o===Fn)f=-(a+r)/(a-r),p=-2*a*r/(a-r);else if(o===zr)f=-a/(a-r),p=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Fn){const l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(a-r),u=(e+t)*c,f=(n+s)*h;let p,g;if(o===Fn)p=(a+r)*d,g=-2*d;else if(o===zr)p=r*d,g=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=g,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ni=new P,rn=new se,sf=new P(0,0,0),rf=new P(1,1,1),qn=new P,Ks=new P,qe=new P,Hl=new se,Wl=new Vs;class bn{constructor(t=0,e=0,n=0,s=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Te(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Te(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Te(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Wl.setFromEuler(this),this.setFromQuaternion(Wl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class rl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let af=0;const Xl=new P,Fi=new Vs,Rn=new se,Qs=new P,gs=new P,of=new P,lf=new Vs,$l=new P(1,0,0),jl=new P(0,1,0),ql=new P(0,0,1),Yl={type:"added"},cf={type:"removed"},Oi={type:"childadded",child:null},ha={type:"childremoved",child:null};class ye extends ls{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=yn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new P,e=new bn,n=new Vs,s=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new kt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis($l,t)}rotateY(t){return this.rotateOnAxis(jl,t)}rotateZ(t){return this.rotateOnAxis(ql,t)}translateOnAxis(t,e){return Xl.copy(t).applyQuaternion(this.quaternion),this.position.add(Xl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis($l,t)}translateY(t){return this.translateOnAxis(jl,t)}translateZ(t){return this.translateOnAxis(ql,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Qs.copy(t):Qs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(gs,Qs,this.up):Rn.lookAt(Qs,gs,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Rn),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yl),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(cf),ha.child=t,this.dispatchEvent(ha),ha.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yl),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,t,of),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,lf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}ye.DEFAULT_UP=new P(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const an=new P,Ln=new P,ua=new P,Pn=new P,Bi=new P,zi=new P,Jl=new P,da=new P,fa=new P,pa=new P,ma=new le,ga=new le,va=new le;class un{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),an.subVectors(t,e),s.cross(an);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){an.subVectors(s,e),Ln.subVectors(n,e),ua.subVectors(t,e);const a=an.dot(an),o=an.dot(Ln),l=an.dot(ua),c=Ln.dot(Ln),h=Ln.dot(ua),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pn)===null?!1:Pn.x>=0&&Pn.y>=0&&Pn.x+Pn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Pn.x),l.addScaledVector(a,Pn.y),l.addScaledVector(o,Pn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return ma.setScalar(0),ga.setScalar(0),va.setScalar(0),ma.fromBufferAttribute(t,e),ga.fromBufferAttribute(t,n),va.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(ma,r.x),a.addScaledVector(ga,r.y),a.addScaledVector(va,r.z),a}static isFrontFacing(t,e,n,s){return an.subVectors(n,e),Ln.subVectors(t,e),an.cross(Ln).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return an.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),an.cross(Ln).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return un.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return un.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Bi.subVectors(s,n),zi.subVectors(r,n),da.subVectors(t,n);const l=Bi.dot(da),c=zi.dot(da);if(l<=0&&c<=0)return e.copy(n);fa.subVectors(t,s);const h=Bi.dot(fa),d=zi.dot(fa);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Bi,a);pa.subVectors(t,r);const f=Bi.dot(pa),p=zi.dot(pa);if(p>=0&&f<=p)return e.copy(r);const g=f*c-l*p;if(g<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(zi,o);const m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return Jl.subVectors(r,s),o=(d-h)/(d-h+(f-p)),e.copy(s).addScaledVector(Jl,o);const v=1/(m+g+u);return a=g*v,o=u*v,e.copy(n).addScaledVector(Bi,a).addScaledVector(zi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const $h={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},tr={h:0,s:0,l:0};function _a(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=We){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Zt.workingColorSpace){if(t=il(t,1),e=Te(e,0,1),n=Te(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=_a(a,r,t+1/3),this.g=_a(a,r,t),this.b=_a(a,r,t-1/3)}return Zt.toWorkingColorSpace(this,s),this}setStyle(t,e=We){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=We){const n=$h[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=On(t.r),this.g=On(t.g),this.b=On(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=We){return Zt.fromWorkingColorSpace(Oe.copy(this),t),Math.round(Te(Oe.r*255,0,255))*65536+Math.round(Te(Oe.g*255,0,255))*256+Math.round(Te(Oe.b*255,0,255))}getHexString(t=We){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.fromWorkingColorSpace(Oe.copy(this),e);const n=Oe.r,s=Oe.g,r=Oe.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Zt.workingColorSpace){return Zt.fromWorkingColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=We){Zt.fromWorkingColorSpace(Oe.copy(this),t);const e=Oe.r,n=Oe.g,s=Oe.b;return t!==We?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(tr);const n=ws(Yn.h,tr.h,e),s=ws(Yn.s,tr.s,e),r=ws(Yn.l,tr.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new Xt;Xt.NAMES=$h;let hf=0;class cs extends ls{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=yn(),this.name="",this.blending=Ji,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ja,this.blendDst=qa,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Il,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ji&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ja&&(n.blendSrc=this.blendSrc),this.blendDst!==qa&&(n.blendDst=this.blendDst),this.blendEquation!==mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Il&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class As extends cs{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=Rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const xe=new P,er=new ft;class pn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Io,this.updateRanges=[],this.gpuType=Nn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)er.fromBufferAttribute(this,e),er.applyMatrix3(t),this.setXY(e,er.x,er.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix3(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix4(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyNormalMatrix(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.transformDirection(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Io&&(t.usage=this.usage),t}}class jh extends pn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class qh extends pn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class fe extends pn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let uf=0;const Ke=new se,xa=new ye,ki=new P,Ye=new Vn,vs=new Vn,Ee=new P;class Ce extends ls{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:uf++}),this.uuid=yn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Hh(t)?qh:jh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return xa.lookAt(t),xa.updateMatrix(),this.applyMatrix4(xa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new fe(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ye.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,Ye.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,Ye.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(Ye.min),this.boundingBox.expandByPoint(Ye.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ci);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(Ye.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];vs.setFromBufferAttribute(o),this.morphTargetsRelative?(Ee.addVectors(Ye.min,vs.min),Ye.expandByPoint(Ee),Ee.addVectors(Ye.max,vs.max),Ye.expandByPoint(Ee)):(Ye.expandByPoint(vs.min),Ye.expandByPoint(vs.max))}Ye.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Ee.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ee));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ee.fromBufferAttribute(o,c),l&&(ki.fromBufferAttribute(t,c),Ee.add(ki)),s=Math.max(s,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new pn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let I=0;I<n.count;I++)o[I]=new P,l[I]=new P;const c=new P,h=new P,d=new P,u=new ft,f=new ft,p=new ft,g=new P,m=new P;function v(I,S,y){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,S),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,I),f.fromBufferAttribute(r,S),p.fromBufferAttribute(r,y),h.sub(c),d.sub(c),f.sub(u),p.sub(u);const A=1/(f.x*p.y-p.x*f.y);isFinite(A)&&(g.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(A),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(A),o[I].add(g),o[S].add(g),o[y].add(g),l[I].add(m),l[S].add(m),l[y].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let I=0,S=_.length;I<S;++I){const y=_[I],A=y.start,V=y.count;for(let F=A,z=A+V;F<z;F+=3)v(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const M=new P,x=new P,D=new P,T=new P;function R(I){D.fromBufferAttribute(s,I),T.copy(D);const S=o[I];M.copy(S),M.sub(D.multiplyScalar(D.dot(S))).normalize(),x.crossVectors(T,S);const A=x.dot(l[I])<0?-1:1;a.setXYZW(I,M.x,M.y,M.z,A)}for(let I=0,S=_.length;I<S;++I){const y=_[I],A=y.start,V=y.count;for(let F=A,z=A+V;F<z;F+=3)R(t.getX(F+0)),R(t.getX(F+1)),R(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new pn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,d=new P;if(t)for(let u=0,f=t.count;u<f;u+=3){const p=t.getX(u+0),g=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,g),a.fromBufferAttribute(e,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,p=0;for(let g=0,m=l.length;g<m;g++){o.isInterleavedBufferAttribute?f=l[g]*o.data.stride+o.offset:f=l[g]*h;for(let v=0;v<h;v++)u[p++]=c[f++]}return new pn(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Zl=new se,li=new sl,nr=new Ci,Kl=new P,ir=new P,sr=new P,rr=new P,Ma=new P,ar=new P,Ql=new P,or=new P;class Ae extends ye{constructor(t=new Ce,e=new As){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){ar.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(Ma.fromBufferAttribute(d,t),a?ar.addScaledVector(Ma,h):ar.addScaledVector(Ma.sub(e),h))}e.add(ar)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),nr.copy(n.boundingSphere),nr.applyMatrix4(r),li.copy(t.ray).recast(t.near),!(nr.containsPoint(li.origin)===!1&&(li.intersectSphere(nr,Kl)===null||li.origin.distanceToSquared(Kl)>(t.far-t.near)**2))&&(Zl.copy(r).invert(),li.copy(t.ray).applyMatrix4(Zl),!(n.boundingBox!==null&&li.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,li)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,g=u.length;p<g;p++){const m=u[p],v=a[m.materialIndex],_=Math.max(m.start,f.start),M=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let x=_,D=M;x<D;x+=3){const T=o.getX(x),R=o.getX(x+1),I=o.getX(x+2);s=lr(this,v,t,n,c,h,d,T,R,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),g=Math.min(o.count,f.start+f.count);for(let m=p,v=g;m<v;m+=3){const _=o.getX(m),M=o.getX(m+1),x=o.getX(m+2);s=lr(this,a,t,n,c,h,d,_,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,g=u.length;p<g;p++){const m=u[p],v=a[m.materialIndex],_=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=_,D=M;x<D;x+=3){const T=x,R=x+1,I=x+2;s=lr(this,v,t,n,c,h,d,T,R,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),g=Math.min(l.count,f.start+f.count);for(let m=p,v=g;m<v;m+=3){const _=m,M=m+1,x=m+2;s=lr(this,a,t,n,c,h,d,_,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function df(i,t,e,n,s,r,a,o){let l;if(t.side===$e?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===si,o),l===null)return null;or.copy(o),or.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(or);return c<e.near||c>e.far?null:{distance:c,point:or.clone(),object:i}}function lr(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,ir),i.getVertexPosition(l,sr),i.getVertexPosition(c,rr);const h=df(i,t,e,n,ir,sr,rr,Ql);if(h){const d=new P;un.getBarycoord(Ql,ir,sr,rr,d),s&&(h.uv=un.getInterpolatedAttribute(s,o,l,c,d,new ft)),r&&(h.uv1=un.getInterpolatedAttribute(r,o,l,c,d,new ft)),a&&(h.normal=un.getInterpolatedAttribute(a,o,l,c,d,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new P,materialIndex:0};un.getNormal(ir,sr,rr,u.normal),h.face=u,h.barycoord=d}return h}class hs extends Ce{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(d,2));function p(g,m,v,_,M,x,D,T,R,I,S){const y=x/R,A=D/I,V=x/2,F=D/2,z=T/2,j=R+1,G=I+1;let J=0,W=0;const at=new P;for(let ht=0;ht<G;ht++){const mt=ht*A-F;for(let Nt=0;Nt<j;Nt++){const Jt=Nt*y-V;at[g]=Jt*_,at[m]=mt*M,at[v]=z,c.push(at.x,at.y,at.z),at[g]=0,at[m]=0,at[v]=T>0?1:-1,h.push(at.x,at.y,at.z),d.push(Nt/R),d.push(1-ht/I),J+=1}}for(let ht=0;ht<I;ht++)for(let mt=0;mt<R;mt++){const Nt=u+mt+j*ht,Jt=u+mt+j*(ht+1),N=u+(mt+1)+j*(ht+1),K=u+(mt+1)+j*ht;l.push(Nt,Jt,K),l.push(Jt,N,K),W+=6}o.addGroup(f,W,S),f+=W,u+=J}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ss(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=ss(i[e]);for(const s in n)t[s]=n[s]}return t}function ff(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Yh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}const al={clone:ss,merge:ze};var pf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class zn extends cs{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pf,this.fragmentShader=mf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ss(t.uniforms),this.uniformsGroups=ff(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Jh extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=Fn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new P,tc=new ft,ec=new ft;class Qe extends Jh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ns*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Es*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ns*2*Math.atan(Math.tan(Es*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z)}getViewSize(t,e){return this.getViewBounds(t,tc,ec),e.subVectors(ec,tc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Es*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vi=-90,Gi=1;class gf extends ye{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Qe(Vi,Gi,t,e);s.layers=this.layers,this.add(s);const r=new Qe(Vi,Gi,t,e);r.layers=this.layers,this.add(r);const a=new Qe(Vi,Gi,t,e);a.layers=this.layers,this.add(a);const o=new Qe(Vi,Gi,t,e);o.layers=this.layers,this.add(o);const l=new Qe(Vi,Gi,t,e);l.layers=this.layers,this.add(l);const c=new Qe(Vi,Gi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===zr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=g,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Zh extends Ge{constructor(t,e,n,s,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:ts,super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class vf extends bi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Zh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Mn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new hs(5,5,5),r=new zn({name:"CubemapFromEquirect",uniforms:ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:$e,blending:ei});r.uniforms.tEquirect.value=e;const a=new Ae(s,r),o=e.minFilter;return e.minFilter===xi&&(e.minFilter=Mn),new gf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const ya=new P,_f=new P,xf=new kt;class In{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ya.subVectors(n,e).cross(_f.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ya),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||xf.getNormalMatrix(t),s=this.coplanarPoint(ya).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ci=new Ci,cr=new P;class ol{constructor(t=new In,e=new In,n=new In,s=new In,r=new In,a=new In){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Fn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],f=s[8],p=s[9],g=s[10],m=s[11],v=s[12],_=s[13],M=s[14],x=s[15];if(n[0].setComponents(l-r,u-c,m-f,x-v).normalize(),n[1].setComponents(l+r,u+c,m+f,x+v).normalize(),n[2].setComponents(l+a,u+h,m+p,x+_).normalize(),n[3].setComponents(l-a,u-h,m-p,x-_).normalize(),n[4].setComponents(l-o,u-d,m-g,x-M).normalize(),e===Fn)n[5].setComponents(l+o,u+d,m+g,x+M).normalize();else if(e===zr)n[5].setComponents(o,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ci.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ci)}intersectsSprite(t){return ci.center.set(0,0,0),ci.radius=.7071067811865476,ci.applyMatrix4(t.matrixWorld),this.intersectsSphere(ci)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(cr.x=s.normal.x>0?t.max.x:t.min.x,cr.y=s.normal.y>0?t.max.y:t.min.y,cr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(cr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Kh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Mf(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],g=d[f];g.start<=p.start+p.count+1?p.count=Math.max(p.count,g.start+g.count-p.start):(++u,d[u]=g)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const g=d[f];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}class qr extends Ce{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,u=e/l,f=[],p=[],g=[],m=[];for(let v=0;v<h;v++){const _=v*u-a;for(let M=0;M<c;M++){const x=M*d-r;p.push(x,-_,0),g.push(0,0,1),m.push(M/o),m.push(1-v/l)}}for(let v=0;v<l;v++)for(let _=0;_<o;_++){const M=_+c*v,x=_+c*(v+1),D=_+1+c*(v+1),T=_+1+c*v;f.push(M,x,T),f.push(x,D,T)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new qr(t.width,t.height,t.widthSegments,t.heightSegments)}}var yf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Sf=`#ifdef USE_ALPHAHASH
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
#endif`,bf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ef=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,wf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Af=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Tf=`#ifdef USE_AOMAP
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
#endif`,Cf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Rf=`#ifdef USE_BATCHING
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
#endif`,Lf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Pf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Df=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,If=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Uf=`#ifdef USE_IRIDESCENCE
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
#endif`,Nf=`#ifdef USE_BUMPMAP
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
#endif`,Ff=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Of=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Wf=`#define PI 3.141592653589793
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
} // validated`,Xf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,$f=`vec3 transformedNormal = objectNormal;
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
#endif`,jf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Yf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Jf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Zf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Qf=`#ifdef USE_ENVMAP
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
#endif`,tp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ep=`#ifdef USE_ENVMAP
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
#endif`,np=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ip=`#ifdef USE_ENVMAP
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
#endif`,sp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,rp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ap=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,op=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lp=`#ifdef USE_GRADIENTMAP
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
}`,cp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,hp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,up=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,dp=`uniform bool receiveShadow;
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
#endif`,fp=`#ifdef USE_ENVMAP
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
#endif`,pp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,mp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,gp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_p=`PhysicalMaterial material;
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
#endif`,xp=`struct PhysicalMaterial {
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
}`,Mp=`
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
#endif`,yp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Sp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,bp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ep=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wp=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ap=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Rp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Lp=`#if defined( USE_POINTS_UV )
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
#endif`,Pp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Dp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ip=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Up=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Np=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fp=`#ifdef USE_MORPHTARGETS
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
#endif`,Op=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Bp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,zp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Hp=`#ifdef USE_NORMALMAP
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
#endif`,Wp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Xp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,$p=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Yp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Jp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Kp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Qp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,tm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,em=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,nm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,im=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,sm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,rm=`float getShadowMask() {
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
}`,am=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,om=`#ifdef USE_SKINNING
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
#endif`,lm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,cm=`#ifdef USE_SKINNING
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
#endif`,hm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,um=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,dm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,fm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,pm=`#ifdef USE_TRANSMISSION
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
#endif`,mm=`#ifdef USE_TRANSMISSION
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
#endif`,gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Mm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ym=`uniform sampler2D t2D;
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
}`,Sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Em=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,wm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Am=`#include <common>
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
}`,Tm=`#if DEPTH_PACKING == 3200
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
}`,Cm=`#define DISTANCE
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
}`,Rm=`#define DISTANCE
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
}`,Lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dm=`uniform float scale;
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
}`,Im=`uniform vec3 diffuse;
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
}`,Um=`#include <common>
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
}`,Nm=`uniform vec3 diffuse;
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
}`,Fm=`#define LAMBERT
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
}`,Om=`#define LAMBERT
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
}`,Bm=`#define MATCAP
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
}`,zm=`#define MATCAP
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
}`,km=`#define NORMAL
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
}`,Vm=`#define NORMAL
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
}`,Gm=`#define PHONG
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
}`,Hm=`#define PHONG
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
}`,Wm=`#define STANDARD
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
}`,Xm=`#define STANDARD
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
}`,$m=`#define TOON
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
}`,jm=`#define TOON
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
}`,qm=`uniform float size;
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
}`,Ym=`uniform vec3 diffuse;
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
}`,Jm=`#include <common>
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
}`,Zm=`uniform vec3 color;
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
}`,Km=`uniform float rotation;
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
}`,Qm=`uniform vec3 diffuse;
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
}`,Ht={alphahash_fragment:yf,alphahash_pars_fragment:Sf,alphamap_fragment:bf,alphamap_pars_fragment:Ef,alphatest_fragment:wf,alphatest_pars_fragment:Af,aomap_fragment:Tf,aomap_pars_fragment:Cf,batching_pars_vertex:Rf,batching_vertex:Lf,begin_vertex:Pf,beginnormal_vertex:Df,bsdfs:If,iridescence_fragment:Uf,bumpmap_pars_fragment:Nf,clipping_planes_fragment:Ff,clipping_planes_pars_fragment:Of,clipping_planes_pars_vertex:Bf,clipping_planes_vertex:zf,color_fragment:kf,color_pars_fragment:Vf,color_pars_vertex:Gf,color_vertex:Hf,common:Wf,cube_uv_reflection_fragment:Xf,defaultnormal_vertex:$f,displacementmap_pars_vertex:jf,displacementmap_vertex:qf,emissivemap_fragment:Yf,emissivemap_pars_fragment:Jf,colorspace_fragment:Zf,colorspace_pars_fragment:Kf,envmap_fragment:Qf,envmap_common_pars_fragment:tp,envmap_pars_fragment:ep,envmap_pars_vertex:np,envmap_physical_pars_fragment:fp,envmap_vertex:ip,fog_vertex:sp,fog_pars_vertex:rp,fog_fragment:ap,fog_pars_fragment:op,gradientmap_pars_fragment:lp,lightmap_pars_fragment:cp,lights_lambert_fragment:hp,lights_lambert_pars_fragment:up,lights_pars_begin:dp,lights_toon_fragment:pp,lights_toon_pars_fragment:mp,lights_phong_fragment:gp,lights_phong_pars_fragment:vp,lights_physical_fragment:_p,lights_physical_pars_fragment:xp,lights_fragment_begin:Mp,lights_fragment_maps:yp,lights_fragment_end:Sp,logdepthbuf_fragment:bp,logdepthbuf_pars_fragment:Ep,logdepthbuf_pars_vertex:wp,logdepthbuf_vertex:Ap,map_fragment:Tp,map_pars_fragment:Cp,map_particle_fragment:Rp,map_particle_pars_fragment:Lp,metalnessmap_fragment:Pp,metalnessmap_pars_fragment:Dp,morphinstance_vertex:Ip,morphcolor_vertex:Up,morphnormal_vertex:Np,morphtarget_pars_vertex:Fp,morphtarget_vertex:Op,normal_fragment_begin:Bp,normal_fragment_maps:zp,normal_pars_fragment:kp,normal_pars_vertex:Vp,normal_vertex:Gp,normalmap_pars_fragment:Hp,clearcoat_normal_fragment_begin:Wp,clearcoat_normal_fragment_maps:Xp,clearcoat_pars_fragment:$p,iridescence_pars_fragment:jp,opaque_fragment:qp,packing:Yp,premultiplied_alpha_fragment:Jp,project_vertex:Zp,dithering_fragment:Kp,dithering_pars_fragment:Qp,roughnessmap_fragment:tm,roughnessmap_pars_fragment:em,shadowmap_pars_fragment:nm,shadowmap_pars_vertex:im,shadowmap_vertex:sm,shadowmask_pars_fragment:rm,skinbase_vertex:am,skinning_pars_vertex:om,skinning_vertex:lm,skinnormal_vertex:cm,specularmap_fragment:hm,specularmap_pars_fragment:um,tonemapping_fragment:dm,tonemapping_pars_fragment:fm,transmission_fragment:pm,transmission_pars_fragment:mm,uv_pars_fragment:gm,uv_pars_vertex:vm,uv_vertex:_m,worldpos_vertex:xm,background_vert:Mm,background_frag:ym,backgroundCube_vert:Sm,backgroundCube_frag:bm,cube_vert:Em,cube_frag:wm,depth_vert:Am,depth_frag:Tm,distanceRGBA_vert:Cm,distanceRGBA_frag:Rm,equirect_vert:Lm,equirect_frag:Pm,linedashed_vert:Dm,linedashed_frag:Im,meshbasic_vert:Um,meshbasic_frag:Nm,meshlambert_vert:Fm,meshlambert_frag:Om,meshmatcap_vert:Bm,meshmatcap_frag:zm,meshnormal_vert:km,meshnormal_frag:Vm,meshphong_vert:Gm,meshphong_frag:Hm,meshphysical_vert:Wm,meshphysical_frag:Xm,meshtoon_vert:$m,meshtoon_frag:jm,points_vert:qm,points_frag:Ym,shadow_vert:Jm,shadow_frag:Zm,sprite_vert:Km,sprite_frag:Qm},ct={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},envMapRotation:{value:new kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},Xe={basic:{uniforms:ze([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:ze([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:ze([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:ze([ct.common,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.roughnessmap,ct.metalnessmap,ct.fog,ct.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:ze([ct.common,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.gradientmap,ct.fog,ct.lights,{emissive:{value:new Xt(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:ze([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:ze([ct.points,ct.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:ze([ct.common,ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:ze([ct.common,ct.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:ze([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:ze([ct.sprite,ct.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new kt}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distanceRGBA:{uniforms:ze([ct.common,ct.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distanceRGBA_vert,fragmentShader:Ht.distanceRGBA_frag},shadow:{uniforms:ze([ct.lights,ct.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};Xe.physical={uniforms:ze([Xe.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};const hr={r:0,b:0,g:0},hi=new bn,tg=new se;function eg(i,t,e,n,s,r,a){const o=new Xt(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function p(_){let M=_.isScene===!0?_.background:null;return M&&M.isTexture&&(M=(_.backgroundBlurriness>0?e:t).get(M)),M}function g(_){let M=!1;const x=p(_);x===null?v(o,l):x&&x.isColor&&(v(x,1),M=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(_,M){const x=p(M);x&&(x.isCubeTexture||x.mapping===$r)?(h===void 0&&(h=new Ae(new hs(1,1,1),new zn({name:"BackgroundCubeMaterial",uniforms:ss(Xe.backgroundCube.uniforms),vertexShader:Xe.backgroundCube.vertexShader,fragmentShader:Xe.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),hi.copy(M.backgroundRotation),hi.x*=-1,hi.y*=-1,hi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(tg.makeRotationFromEuler(hi)),h.material.toneMapped=Zt.getTransfer(x.colorSpace)!==re,(d!==x||u!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Ae(new qr(2,2),new zn({name:"BackgroundMaterial",uniforms:ss(Xe.background.uniforms),vertexShader:Xe.background.vertexShader,fragmentShader:Xe.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Zt.getTransfer(x.colorSpace)!==re,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||u!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function v(_,M){_.getRGB(hr,Yh(i)),n.buffers.color.setClear(hr.r,hr.g,hr.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(_,M=1){o.set(_),l=M,v(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,v(o,l)},render:g,addToRenderList:m}}function ng(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(y,A,V,F,z){let j=!1;const G=d(F,V,A);r!==G&&(r=G,c(r.object)),j=f(y,F,V,z),j&&p(y,F,V,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,x(y,A,V,F),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function d(y,A,V){const F=V.wireframe===!0;let z=n[y.id];z===void 0&&(z={},n[y.id]=z);let j=z[A.id];j===void 0&&(j={},z[A.id]=j);let G=j[F];return G===void 0&&(G=u(l()),j[F]=G),G}function u(y){const A=[],V=[],F=[];for(let z=0;z<e;z++)A[z]=0,V[z]=0,F[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:V,attributeDivisors:F,object:y,attributes:{},index:null}}function f(y,A,V,F){const z=r.attributes,j=A.attributes;let G=0;const J=V.getAttributes();for(const W in J)if(J[W].location>=0){const ht=z[W];let mt=j[W];if(mt===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(mt=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(mt=y.instanceColor)),ht===void 0||ht.attribute!==mt||mt&&ht.data!==mt.data)return!0;G++}return r.attributesNum!==G||r.index!==F}function p(y,A,V,F){const z={},j=A.attributes;let G=0;const J=V.getAttributes();for(const W in J)if(J[W].location>=0){let ht=j[W];ht===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(ht=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(ht=y.instanceColor));const mt={};mt.attribute=ht,ht&&ht.data&&(mt.data=ht.data),z[W]=mt,G++}r.attributes=z,r.attributesNum=G,r.index=F}function g(){const y=r.newAttributes;for(let A=0,V=y.length;A<V;A++)y[A]=0}function m(y){v(y,0)}function v(y,A){const V=r.newAttributes,F=r.enabledAttributes,z=r.attributeDivisors;V[y]=1,F[y]===0&&(i.enableVertexAttribArray(y),F[y]=1),z[y]!==A&&(i.vertexAttribDivisor(y,A),z[y]=A)}function _(){const y=r.newAttributes,A=r.enabledAttributes;for(let V=0,F=A.length;V<F;V++)A[V]!==y[V]&&(i.disableVertexAttribArray(V),A[V]=0)}function M(y,A,V,F,z,j,G){G===!0?i.vertexAttribIPointer(y,A,V,z,j):i.vertexAttribPointer(y,A,V,F,z,j)}function x(y,A,V,F){g();const z=F.attributes,j=V.getAttributes(),G=A.defaultAttributeValues;for(const J in j){const W=j[J];if(W.location>=0){let at=z[J];if(at===void 0&&(J==="instanceMatrix"&&y.instanceMatrix&&(at=y.instanceMatrix),J==="instanceColor"&&y.instanceColor&&(at=y.instanceColor)),at!==void 0){const ht=at.normalized,mt=at.itemSize,Nt=t.get(at);if(Nt===void 0)continue;const Jt=Nt.buffer,N=Nt.type,K=Nt.bytesPerElement,ut=N===i.INT||N===i.UNSIGNED_INT||at.gpuType===Zo;if(at.isInterleavedBufferAttribute){const Q=at.data,Pt=Q.stride,Dt=at.offset;if(Q.isInstancedInterleavedBuffer){for(let At=0;At<W.locationSize;At++)v(W.location+At,Q.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let At=0;At<W.locationSize;At++)m(W.location+At);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let At=0;At<W.locationSize;At++)M(W.location+At,mt/W.locationSize,N,ht,Pt*K,(Dt+mt/W.locationSize*At)*K,ut)}else{if(at.isInstancedBufferAttribute){for(let Q=0;Q<W.locationSize;Q++)v(W.location+Q,at.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Q=0;Q<W.locationSize;Q++)m(W.location+Q);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let Q=0;Q<W.locationSize;Q++)M(W.location+Q,mt/W.locationSize,N,ht,mt*K,mt/W.locationSize*Q*K,ut)}}else if(G!==void 0){const ht=G[J];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(W.location,ht);break;case 3:i.vertexAttrib3fv(W.location,ht);break;case 4:i.vertexAttrib4fv(W.location,ht);break;default:i.vertexAttrib1fv(W.location,ht)}}}}_()}function D(){I();for(const y in n){const A=n[y];for(const V in A){const F=A[V];for(const z in F)h(F[z].object),delete F[z];delete A[V]}delete n[y]}}function T(y){if(n[y.id]===void 0)return;const A=n[y.id];for(const V in A){const F=A[V];for(const z in F)h(F[z].object),delete F[z];delete A[V]}delete n[y.id]}function R(y){for(const A in n){const V=n[A];if(V[y.id]===void 0)continue;const F=V[y.id];for(const z in F)h(F[z].object),delete F[z];delete V[y.id]}}function I(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:S,dispose:D,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:g,enableAttribute:m,disableUnusedAttributes:_}}function ig(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function o(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let p=0;p<d;p++)f+=h[p];e.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)a(c[p],h[p],u[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g]*u[g];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function sg(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==dn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const I=R===ks&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Bn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Nn&&!I)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=p>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:m,maxAttributes:v,maxVertexUniforms:_,maxVaryings:M,maxFragmentUniforms:x,vertexTextures:D,maxSamples:T}}function rg(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new In,o=new kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,v=i.get(d);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const _=r?0:n,M=_*4;let x=v.clippingState||null;l.value=x,x=h(p,u,M,f);for(let D=0;D!==M;++D)x[D]=e[D];v.clippingState=x,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){const g=d!==null?d.length:0;let m=null;if(g!==0){if(m=l.value,p!==!0||m===null){const v=f+g*4,_=u.matrixWorldInverse;o.getNormalMatrix(_),(m===null||m.length<v)&&(m=new Float32Array(v));for(let M=0,x=f;M!==g;++M,x+=4)a.copy(d[M]).applyMatrix4(_,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,m}}function ag(i){let t=new WeakMap;function e(a,o){return o===no?a.mapping=ts:o===io&&(a.mapping=es),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===no||o===io)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new vf(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class ll extends Jh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const qi=4,nc=[.125,.215,.35,.446,.526,.582],gi=20,Sa=new ll,ic=new Xt;let ba=null,Ea=0,wa=0,Aa=!1;const pi=(1+Math.sqrt(5))/2,Hi=1/pi,sc=[new P(-pi,Hi,0),new P(pi,Hi,0),new P(-Hi,0,pi),new P(Hi,0,pi),new P(0,pi,-Hi),new P(0,pi,Hi),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class rc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){ba=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),wa=this._renderer.getActiveMipmapLevel(),Aa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=lc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=oc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ba,Ea,wa),this._renderer.xr.enabled=Aa,t.scissorTest=!1,ur(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ts||t.mapping===es?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ba=this._renderer.getRenderTarget(),Ea=this._renderer.getActiveCubeFace(),wa=this._renderer.getActiveMipmapLevel(),Aa=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:ks,format:dn,colorSpace:os,depthBuffer:!1},s=ac(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ac(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=og(r)),this._blurMaterial=lg(r,t,e)}return s}_compileMaterial(t){const e=new Ae(this._lodPlanes[0],t);this._renderer.compile(e,Sa)}_sceneToCubeUV(t,e,n,s){const o=new Qe(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(ic),h.toneMapping=ni,h.autoClear=!1;const f=new As({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),p=new Ae(new hs,f);let g=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,g=!0):(f.color.copy(ic),g=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(o.up.set(0,l[v],0),o.lookAt(c[v],0,0)):_===1?(o.up.set(0,0,l[v]),o.lookAt(0,c[v],0)):(o.up.set(0,l[v],0),o.lookAt(0,0,c[v]));const M=this._cubeSize;ur(s,_*M,v>2?M:0,M,M),h.setRenderTarget(s),g&&h.render(p,o),h.render(t,o)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===ts||t.mapping===es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=lc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=oc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ae(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;ur(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Sa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=sc[(s-r-1)%sc.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Ae(this._lodPlanes[s],c),u=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*gi-1),g=r/p,m=isFinite(r)?1+Math.floor(h*g):gi;m>gi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${gi}`);const v=[];let _=0;for(let R=0;R<gi;++R){const I=R/g,S=Math.exp(-I*I/2);v.push(S),R===0?_+=S:R<m&&(_+=2*S)}for(let R=0;R<v.length;R++)v[R]=v[R]/_;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=v,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:M}=this;u.dTheta.value=p,u.mipInt.value=M-n;const x=this._sizeLods[s],D=3*x*(s>M-qi?s-M+qi:0),T=4*(this._cubeSize-x);ur(e,D,T,3*x,2*x),l.setRenderTarget(e),l.render(d,Sa)}}function og(i){const t=[],e=[],n=[];let s=i;const r=i-qi+1+nc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-qi?l=nc[a-i+qi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,p=6,g=3,m=2,v=1,_=new Float32Array(g*p*f),M=new Float32Array(m*p*f),x=new Float32Array(v*p*f);for(let T=0;T<f;T++){const R=T%3*2/3-1,I=T>2?0:-1,S=[R,I,0,R+2/3,I,0,R+2/3,I+1,0,R,I,0,R+2/3,I+1,0,R,I+1,0];_.set(S,g*p*T),M.set(u,m*p*T);const y=[T,T,T,T,T,T];x.set(y,v*p*T)}const D=new Ce;D.setAttribute("position",new pn(_,g)),D.setAttribute("uv",new pn(M,m)),D.setAttribute("faceIndex",new pn(x,v)),t.push(D),s>qi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ac(i,t,e){const n=new bi(i,t,e);return n.texture.mapping=$r,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ur(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function lg(i,t,e){const n=new Float32Array(gi),s=new P(0,1,0);return new zn({name:"SphericalGaussianBlur",defines:{n:gi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:cl(),fragmentShader:`

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
		`,blending:ei,depthTest:!1,depthWrite:!1})}function oc(){return new zn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cl(),fragmentShader:`

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
		`,blending:ei,depthTest:!1,depthWrite:!1})}function lc(){return new zn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function cl(){return`

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
	`}function cg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===no||l===io,h=l===ts||l===es;if(c||h){let d=t.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return e===null&&(e=new rc(i)),d=c?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new rc(i)),d=c?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function hg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ms("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ug(i,t,e,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);for(const p in u.morphAttributes){const g=u.morphAttributes[p];for(let m=0,v=g.length;m<v;m++)t.remove(g[m])}u.removeEventListener("dispose",a),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const p in u)t.update(u[p],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const p in f){const g=f[p];for(let m=0,v=g.length;m<v;m++)t.update(g[m],i.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,p=d.attributes.position;let g=0;if(f!==null){const _=f.array;g=f.version;for(let M=0,x=_.length;M<x;M+=3){const D=_[M+0],T=_[M+1],R=_[M+2];u.push(D,T,T,R,R,D)}}else if(p!==void 0){const _=p.array;g=p.version;for(let M=0,x=_.length/3-1;M<x;M+=3){const D=M+0,T=M+1,R=M+2;u.push(D,T,T,R,R,D)}}else return;const m=new(Hh(u)?qh:jh)(u,1);m.version=g;const v=r.get(d);v&&t.remove(v),r.set(d,m)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function dg(i,t,e){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,f){i.drawElements(n,f,r,u*a),e.update(f,n,1)}function c(u,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,u*a,p),e.update(f,n,p))}function h(u,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,p);let m=0;for(let v=0;v<p;v++)m+=f[v];e.update(m,n,1)}function d(u,f,p,g){if(p===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<u.length;v++)c(u[v]/a,f[v],g[v]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,g,0,p);let v=0;for(let _=0;_<p;_++)v+=f[_]*g[_];e.update(v,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function fg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function pg(i,t,e){const n=new WeakMap,s=new le;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let S=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",S)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let M=0;f===!0&&(M=1),p===!0&&(M=2),g===!0&&(M=3);let x=o.attributes.position.count*M,D=1;x>t.maxTextureSize&&(D=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const T=new Float32Array(x*D*4*d),R=new Xh(T,x,D,d);R.type=Nn,R.needsUpdate=!0;const I=M*4;for(let y=0;y<d;y++){const A=m[y],V=v[y],F=_[y],z=x*D*4*y;for(let j=0;j<A.count;j++){const G=j*I;f===!0&&(s.fromBufferAttribute(A,j),T[z+G+0]=s.x,T[z+G+1]=s.y,T[z+G+2]=s.z,T[z+G+3]=0),p===!0&&(s.fromBufferAttribute(V,j),T[z+G+4]=s.x,T[z+G+5]=s.y,T[z+G+6]=s.z,T[z+G+7]=0),g===!0&&(s.fromBufferAttribute(F,j),T[z+G+8]=s.x,T[z+G+9]=s.y,T[z+G+10]=s.z,T[z+G+11]=F.itemSize===4?s.w:1)}}u={count:d,texture:R,size:new ft(x,D)},n.set(o,u),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let g=0;g<c.length;g++)f+=c[g];const p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function mg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class Qh extends Ge{constructor(t,e,n,s,r,a,o,l,c,h=Zi){if(h!==Zi&&h!==is)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Zi&&(n=Si),n===void 0&&h===is&&(n=ns),super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:fn,this.minFilter=l!==void 0?l:fn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const tu=new Ge,cc=new Qh(1,1),eu=new Xh,nu=new ef,iu=new Zh,hc=[],uc=[],dc=new Float32Array(16),fc=new Float32Array(9),pc=new Float32Array(4);function us(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=hc[s];if(r===void 0&&(r=new Float32Array(s),hc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Se(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Yr(i,t){let e=uc[t];e===void 0&&(e=new Int32Array(t),uc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function gg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2fv(this.addr,t),be(e,t)}}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Se(e,t))return;i.uniform3fv(this.addr,t),be(e,t)}}function xg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4fv(this.addr,t),be(e,t)}}function Mg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Se(e,n))return;pc.set(n),i.uniformMatrix2fv(this.addr,!1,pc),be(e,n)}}function yg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Se(e,n))return;fc.set(n),i.uniformMatrix3fv(this.addr,!1,fc),be(e,n)}}function Sg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Se(e,n))return;dc.set(n),i.uniformMatrix4fv(this.addr,!1,dc),be(e,n)}}function bg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2iv(this.addr,t),be(e,t)}}function wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3iv(this.addr,t),be(e,t)}}function Ag(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4iv(this.addr,t),be(e,t)}}function Tg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2uiv(this.addr,t),be(e,t)}}function Rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3uiv(this.addr,t),be(e,t)}}function Lg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4uiv(this.addr,t),be(e,t)}}function Pg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(cc.compareFunction=Gh,r=cc):r=tu,e.setTexture2D(t||r,s)}function Dg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||nu,s)}function Ig(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||iu,s)}function Ug(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||eu,s)}function Ng(i){switch(i){case 5126:return gg;case 35664:return vg;case 35665:return _g;case 35666:return xg;case 35674:return Mg;case 35675:return yg;case 35676:return Sg;case 5124:case 35670:return bg;case 35667:case 35671:return Eg;case 35668:case 35672:return wg;case 35669:case 35673:return Ag;case 5125:return Tg;case 36294:return Cg;case 36295:return Rg;case 36296:return Lg;case 35678:case 36198:case 36298:case 36306:case 35682:return Pg;case 35679:case 36299:case 36307:return Dg;case 35680:case 36300:case 36308:case 36293:return Ig;case 36289:case 36303:case 36311:case 36292:return Ug}}function Fg(i,t){i.uniform1fv(this.addr,t)}function Og(i,t){const e=us(t,this.size,2);i.uniform2fv(this.addr,e)}function Bg(i,t){const e=us(t,this.size,3);i.uniform3fv(this.addr,e)}function zg(i,t){const e=us(t,this.size,4);i.uniform4fv(this.addr,e)}function kg(i,t){const e=us(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Vg(i,t){const e=us(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Gg(i,t){const e=us(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Hg(i,t){i.uniform1iv(this.addr,t)}function Wg(i,t){i.uniform2iv(this.addr,t)}function Xg(i,t){i.uniform3iv(this.addr,t)}function $g(i,t){i.uniform4iv(this.addr,t)}function jg(i,t){i.uniform1uiv(this.addr,t)}function qg(i,t){i.uniform2uiv(this.addr,t)}function Yg(i,t){i.uniform3uiv(this.addr,t)}function Jg(i,t){i.uniform4uiv(this.addr,t)}function Zg(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||tu,r[a])}function Kg(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||nu,r[a])}function Qg(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||iu,r[a])}function tv(i,t,e){const n=this.cache,s=t.length,r=Yr(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||eu,r[a])}function ev(i){switch(i){case 5126:return Fg;case 35664:return Og;case 35665:return Bg;case 35666:return zg;case 35674:return kg;case 35675:return Vg;case 35676:return Gg;case 5124:case 35670:return Hg;case 35667:case 35671:return Wg;case 35668:case 35672:return Xg;case 35669:case 35673:return $g;case 5125:return jg;case 36294:return qg;case 36295:return Yg;case 36296:return Jg;case 35678:case 36198:case 36298:case 36306:case 35682:return Zg;case 35679:case 36299:case 36307:return Kg;case 35680:case 36300:case 36308:case 36293:return Qg;case 36289:case 36303:case 36311:case 36292:return tv}}class nv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ng(e.type)}}class iv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ev(e.type)}}class sv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Ta=/(\w+)(\])?(\[|\.)?/g;function mc(i,t){i.seq.push(t),i.map[t.id]=t}function rv(i,t,e){const n=i.name,s=n.length;for(Ta.lastIndex=0;;){const r=Ta.exec(n),a=Ta.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){mc(e,c===void 0?new nv(o,i,t):new iv(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new sv(o),mc(e,d)),e=d}}}class Dr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);rv(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function gc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const av=37297;let ov=0;function lv(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const vc=new kt;function cv(i){Zt._getMatrix(vc,Zt.workingColorSpace,i);const t=`mat3( ${vc.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(i)){case jr:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function _c(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+lv(i.getShaderSource(t),a)}else return s}function hv(i,t){const e=cv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function uv(i,t){let e;switch(t){case fd:e="Linear";break;case pd:e="Reinhard";break;case md:e="Cineon";break;case gd:e="ACESFilmic";break;case _d:e="AgX";break;case xd:e="Neutral";break;case vd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const dr=new P;function dv(){Zt.getLuminanceCoefficients(dr);const i=dr.x.toFixed(4),t=dr.y.toFixed(4),e=dr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ys).join(`
`)}function pv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function mv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function ys(i){return i!==""}function xc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Mc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const gv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uo(i){return i.replace(gv,_v)}const vv=new Map;function _v(i,t){let e=Ht[t];if(e===void 0){const n=vv.get(t);if(n!==void 0)e=Ht[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Uo(e)}const xv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yc(i){return i.replace(xv,Mv)}function Mv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function yv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ch?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===$u?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Dn&&(t="SHADOWMAP_TYPE_VSM"),t}function Sv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ts:case es:t="ENVMAP_TYPE_CUBE";break;case $r:t="ENVMAP_TYPE_CUBE_UV";break}return t}function bv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case es:t="ENVMAP_MODE_REFRACTION";break}return t}function Ev(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Rh:t="ENVMAP_BLENDING_MULTIPLY";break;case ud:t="ENVMAP_BLENDING_MIX";break;case dd:t="ENVMAP_BLENDING_ADD";break}return t}function wv(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Av(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=yv(e),c=Sv(e),h=bv(e),d=Ev(e),u=wv(e),f=fv(e),p=pv(r),g=s.createProgram();let m,v,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ys).join(`
`),m.length>0&&(m+=`
`),v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ys).join(`
`),v.length>0&&(v+=`
`)):(m=[Sc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ys).join(`
`),v=[Sc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ni?"#define TONE_MAPPING":"",e.toneMapping!==ni?Ht.tonemapping_pars_fragment:"",e.toneMapping!==ni?uv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,hv("linearToOutputTexel",e.outputColorSpace),dv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ys).join(`
`)),a=Uo(a),a=xc(a,e),a=Mc(a,e),o=Uo(o),o=xc(o,e),o=Mc(o,e),a=yc(a),o=yc(o),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,v=["#define varying in",e.glslVersion===Ul?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ul?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=_+m+a,x=_+v+o,D=gc(s,s.VERTEX_SHADER,M),T=gc(s,s.FRAGMENT_SHADER,x);s.attachShader(g,D),s.attachShader(g,T),e.index0AttributeName!==void 0?s.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function R(A){if(i.debug.checkShaderErrors){const V=s.getProgramInfoLog(g).trim(),F=s.getShaderInfoLog(D).trim(),z=s.getShaderInfoLog(T).trim();let j=!0,G=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,D,T);else{const J=_c(s,D,"vertex"),W=_c(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+V+`
`+J+`
`+W)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(F===""||z==="")&&(G=!1);G&&(A.diagnostics={runnable:j,programLog:V,vertexShader:{log:F,prefix:m},fragmentShader:{log:z,prefix:v}})}s.deleteShader(D),s.deleteShader(T),I=new Dr(s,g),S=mv(s,g)}let I;this.getUniforms=function(){return I===void 0&&R(this),I};let S;this.getAttributes=function(){return S===void 0&&R(this),S};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(g,av)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ov++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=D,this.fragmentShader=T,this}let Tv=0;class Cv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Rv(t),e.set(t,n)),n}}class Rv{constructor(t){this.id=Tv++,this.code=t,this.usedTimes=0}}function Lv(i,t,e,n,s,r,a){const o=new rl,l=new Cv,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,y,A,V,F){const z=V.fog,j=F.geometry,G=S.isMeshStandardMaterial?V.environment:null,J=(S.isMeshStandardMaterial?e:t).get(S.envMap||G),W=J&&J.mapping===$r?J.image.height:null,at=p[S.type];S.precision!==null&&(f=s.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));const ht=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,mt=ht!==void 0?ht.length:0;let Nt=0;j.morphAttributes.position!==void 0&&(Nt=1),j.morphAttributes.normal!==void 0&&(Nt=2),j.morphAttributes.color!==void 0&&(Nt=3);let Jt,N,K,ut;if(at){const ne=Xe[at];Jt=ne.vertexShader,N=ne.fragmentShader}else Jt=S.vertexShader,N=S.fragmentShader,l.update(S),K=l.getVertexShaderID(S),ut=l.getFragmentShaderID(S);const Q=i.getRenderTarget(),Pt=i.state.buffers.depth.getReversed(),Dt=F.isInstancedMesh===!0,At=F.isBatchedMesh===!0,qt=!!S.map,$=!!S.matcap,st=!!J,L=!!S.aoMap,wt=!!S.lightMap,nt=!!S.bumpMap,yt=!!S.normalMap,lt=!!S.displacementMap,It=!!S.emissiveMap,gt=!!S.metalnessMap,w=!!S.roughnessMap,b=S.anisotropy>0,U=S.clearcoat>0,q=S.dispersion>0,tt=S.iridescence>0,Z=S.sheen>0,St=S.transmission>0,dt=b&&!!S.anisotropyMap,vt=U&&!!S.clearcoatMap,Vt=U&&!!S.clearcoatNormalMap,rt=U&&!!S.clearcoatRoughnessMap,bt=tt&&!!S.iridescenceMap,Ut=tt&&!!S.iridescenceThicknessMap,Ft=Z&&!!S.sheenColorMap,Et=Z&&!!S.sheenRoughnessMap,Yt=!!S.specularMap,Gt=!!S.specularColorMap,ce=!!S.specularIntensityMap,O=St&&!!S.transmissionMap,pt=St&&!!S.thicknessMap,Y=!!S.gradientMap,et=!!S.alphaMap,Mt=S.alphaTest>0,_t=!!S.alphaHash,Bt=!!S.extensions;let ve=ni;S.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(ve=i.toneMapping);const Ne={shaderID:at,shaderType:S.type,shaderName:S.name,vertexShader:Jt,fragmentShader:N,defines:S.defines,customVertexShaderID:K,customFragmentShaderID:ut,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:At,batchingColor:At&&F._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&F.instanceColor!==null,instancingMorph:Dt&&F.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:Q===null?i.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:os,alphaToCoverage:!!S.alphaToCoverage,map:qt,matcap:$,envMap:st,envMapMode:st&&J.mapping,envMapCubeUVHeight:W,aoMap:L,lightMap:wt,bumpMap:nt,normalMap:yt,displacementMap:u&&lt,emissiveMap:It,normalMapObjectSpace:yt&&S.normalMapType===bd,normalMapTangentSpace:yt&&S.normalMapType===Vh,metalnessMap:gt,roughnessMap:w,anisotropy:b,anisotropyMap:dt,clearcoat:U,clearcoatMap:vt,clearcoatNormalMap:Vt,clearcoatRoughnessMap:rt,dispersion:q,iridescence:tt,iridescenceMap:bt,iridescenceThicknessMap:Ut,sheen:Z,sheenColorMap:Ft,sheenRoughnessMap:Et,specularMap:Yt,specularColorMap:Gt,specularIntensityMap:ce,transmission:St,transmissionMap:O,thicknessMap:pt,gradientMap:Y,opaque:S.transparent===!1&&S.blending===Ji&&S.alphaToCoverage===!1,alphaMap:et,alphaTest:Mt,alphaHash:_t,combine:S.combine,mapUv:qt&&g(S.map.channel),aoMapUv:L&&g(S.aoMap.channel),lightMapUv:wt&&g(S.lightMap.channel),bumpMapUv:nt&&g(S.bumpMap.channel),normalMapUv:yt&&g(S.normalMap.channel),displacementMapUv:lt&&g(S.displacementMap.channel),emissiveMapUv:It&&g(S.emissiveMap.channel),metalnessMapUv:gt&&g(S.metalnessMap.channel),roughnessMapUv:w&&g(S.roughnessMap.channel),anisotropyMapUv:dt&&g(S.anisotropyMap.channel),clearcoatMapUv:vt&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:Vt&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ut&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ft&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Et&&g(S.sheenRoughnessMap.channel),specularMapUv:Yt&&g(S.specularMap.channel),specularColorMapUv:Gt&&g(S.specularColorMap.channel),specularIntensityMapUv:ce&&g(S.specularIntensityMap.channel),transmissionMapUv:O&&g(S.transmissionMap.channel),thicknessMapUv:pt&&g(S.thicknessMap.channel),alphaMapUv:et&&g(S.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(yt||b),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!j.attributes.uv&&(qt||et),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Pt,skinning:F.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:Nt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:ve,decodeVideoTexture:qt&&S.map.isVideoTexture===!0&&Zt.getTransfer(S.map.colorSpace)===re,decodeVideoTextureEmissive:It&&S.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(S.emissiveMap.colorSpace)===re,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===cn,flipSided:S.side===$e,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Bt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&S.extensions.multiDraw===!0||At)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function v(S){const y=[];if(S.shaderID?y.push(S.shaderID):(y.push(S.customVertexShaderID),y.push(S.customFragmentShaderID)),S.defines!==void 0)for(const A in S.defines)y.push(A),y.push(S.defines[A]);return S.isRawShaderMaterial===!1&&(_(y,S),M(y,S),y.push(i.outputColorSpace)),y.push(S.customProgramCacheKey),y.join()}function _(S,y){S.push(y.precision),S.push(y.outputColorSpace),S.push(y.envMapMode),S.push(y.envMapCubeUVHeight),S.push(y.mapUv),S.push(y.alphaMapUv),S.push(y.lightMapUv),S.push(y.aoMapUv),S.push(y.bumpMapUv),S.push(y.normalMapUv),S.push(y.displacementMapUv),S.push(y.emissiveMapUv),S.push(y.metalnessMapUv),S.push(y.roughnessMapUv),S.push(y.anisotropyMapUv),S.push(y.clearcoatMapUv),S.push(y.clearcoatNormalMapUv),S.push(y.clearcoatRoughnessMapUv),S.push(y.iridescenceMapUv),S.push(y.iridescenceThicknessMapUv),S.push(y.sheenColorMapUv),S.push(y.sheenRoughnessMapUv),S.push(y.specularMapUv),S.push(y.specularColorMapUv),S.push(y.specularIntensityMapUv),S.push(y.transmissionMapUv),S.push(y.thicknessMapUv),S.push(y.combine),S.push(y.fogExp2),S.push(y.sizeAttenuation),S.push(y.morphTargetsCount),S.push(y.morphAttributeCount),S.push(y.numDirLights),S.push(y.numPointLights),S.push(y.numSpotLights),S.push(y.numSpotLightMaps),S.push(y.numHemiLights),S.push(y.numRectAreaLights),S.push(y.numDirLightShadows),S.push(y.numPointLightShadows),S.push(y.numSpotLightShadows),S.push(y.numSpotLightShadowsWithMaps),S.push(y.numLightProbes),S.push(y.shadowMapType),S.push(y.toneMapping),S.push(y.numClippingPlanes),S.push(y.numClipIntersection),S.push(y.depthPacking)}function M(S,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reverseDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),S.push(o.mask)}function x(S){const y=p[S.type];let A;if(y){const V=Xe[y];A=al.clone(V.uniforms)}else A=S.uniforms;return A}function D(S,y){let A;for(let V=0,F=h.length;V<F;V++){const z=h[V];if(z.cacheKey===y){A=z,++A.usedTimes;break}}return A===void 0&&(A=new Av(i,y,S,r),h.push(A)),A}function T(S){if(--S.usedTimes===0){const y=h.indexOf(S);h[y]=h[h.length-1],h.pop(),S.destroy()}}function R(S){l.remove(S)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:v,getUniforms:x,acquireProgram:D,releaseProgram:T,releaseShaderCache:R,programs:h,dispose:I}}function Pv(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Dv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function bc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ec(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(d,u,f,p,g,m){let v=i[t];return v===void 0?(v={id:d.id,object:d,geometry:u,material:f,groupOrder:p,renderOrder:d.renderOrder,z:g,group:m},i[t]=v):(v.id=d.id,v.object=d,v.geometry=u,v.material=f,v.groupOrder=p,v.renderOrder=d.renderOrder,v.z=g,v.group=m),t++,v}function o(d,u,f,p,g,m){const v=a(d,u,f,p,g,m);f.transmission>0?n.push(v):f.transparent===!0?s.push(v):e.push(v)}function l(d,u,f,p,g,m){const v=a(d,u,f,p,g,m);f.transmission>0?n.unshift(v):f.transparent===!0?s.unshift(v):e.unshift(v)}function c(d,u){e.length>1&&e.sort(d||Dv),n.length>1&&n.sort(u||bc),s.length>1&&s.sort(u||bc)}function h(){for(let d=t,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Iv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Ec,i.set(n,[a])):s>=r.length?(a=new Ec,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Uv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new Xt};break;case"SpotLight":e={position:new P,direction:new P,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new P,halfWidth:new P,halfHeight:new P};break}return i[t.id]=e,e}}}function Nv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Fv=0;function Ov(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Bv(i){const t=new Uv,e=Nv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new se,a=new se;function o(c){let h=0,d=0,u=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,p=0,g=0,m=0,v=0,_=0,M=0,x=0,D=0,T=0,R=0;c.sort(Ov);for(let S=0,y=c.length;S<y;S++){const A=c[S],V=A.color,F=A.intensity,z=A.distance,j=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=V.r*F,d+=V.g*F,u+=V.b*F;else if(A.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(A.sh.coefficients[G],F);R++}else if(A.isDirectionalLight){const G=t.get(A);if(G.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const J=A.shadow,W=e.get(A);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.directionalShadow[f]=W,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=A.shadow.matrix,_++}n.directional[f]=G,f++}else if(A.isSpotLight){const G=t.get(A);G.position.setFromMatrixPosition(A.matrixWorld),G.color.copy(V).multiplyScalar(F),G.distance=z,G.coneCos=Math.cos(A.angle),G.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),G.decay=A.decay,n.spot[g]=G;const J=A.shadow;if(A.map&&(n.spotLightMap[D]=A.map,D++,J.updateMatrices(A),A.castShadow&&T++),n.spotLightMatrix[g]=J.matrix,A.castShadow){const W=e.get(A);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,n.spotShadow[g]=W,n.spotShadowMap[g]=j,x++}g++}else if(A.isRectAreaLight){const G=t.get(A);G.color.copy(V).multiplyScalar(F),G.halfWidth.set(A.width*.5,0,0),G.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=G,m++}else if(A.isPointLight){const G=t.get(A);if(G.color.copy(A.color).multiplyScalar(A.intensity),G.distance=A.distance,G.decay=A.decay,A.castShadow){const J=A.shadow,W=e.get(A);W.shadowIntensity=J.intensity,W.shadowBias=J.bias,W.shadowNormalBias=J.normalBias,W.shadowRadius=J.radius,W.shadowMapSize=J.mapSize,W.shadowCameraNear=J.camera.near,W.shadowCameraFar=J.camera.far,n.pointShadow[p]=W,n.pointShadowMap[p]=j,n.pointShadowMatrix[p]=A.shadow.matrix,M++}n.point[p]=G,p++}else if(A.isHemisphereLight){const G=t.get(A);G.skyColor.copy(A.color).multiplyScalar(F),G.groundColor.copy(A.groundColor).multiplyScalar(F),n.hemi[v]=G,v++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ct.LTC_FLOAT_1,n.rectAreaLTC2=ct.LTC_FLOAT_2):(n.rectAreaLTC1=ct.LTC_HALF_1,n.rectAreaLTC2=ct.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const I=n.hash;(I.directionalLength!==f||I.pointLength!==p||I.spotLength!==g||I.rectAreaLength!==m||I.hemiLength!==v||I.numDirectionalShadows!==_||I.numPointShadows!==M||I.numSpotShadows!==x||I.numSpotMaps!==D||I.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=g,n.rectArea.length=m,n.point.length=p,n.hemi.length=v,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=x+D-T,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,I.directionalLength=f,I.pointLength=p,I.spotLength=g,I.rectAreaLength=m,I.hemiLength=v,I.numDirectionalShadows=_,I.numPointShadows=M,I.numSpotShadows=x,I.numSpotMaps=D,I.numLightProbes=R,n.version=Fv++)}function l(c,h){let d=0,u=0,f=0,p=0,g=0;const m=h.matrixWorldInverse;for(let v=0,_=c.length;v<_;v++){const M=c[v];if(M.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),d++}else if(M.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const x=n.rectArea[p];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),a.identity(),r.copy(M.matrixWorld),r.premultiply(m),a.extractRotation(r),x.halfWidth.set(M.width*.5,0,0),x.halfHeight.set(0,M.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),p++}else if(M.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),u++}else if(M.isHemisphereLight){const x=n.hemi[g];x.direction.setFromMatrixPosition(M.matrixWorld),x.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function wc(i){const t=new Bv(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function zv(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new wc(i),t.set(s,[o])):r>=a.length?(o=new wc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class kv extends cs{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=yd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Vv extends cs{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Gv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Hv=`uniform sampler2D shadow_pass;
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
}`;function Wv(i,t,e){let n=new ol;const s=new ft,r=new ft,a=new le,o=new kv({depthPacking:Sd}),l=new Vv,c={},h=e.maxTextureSize,d={[si]:$e,[$e]:si,[cn]:cn},u=new zn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Gv,fragmentShader:Hv}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ce;p.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new Ae(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ch;let v=this.type;this.render=function(T,R,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const S=i.getRenderTarget(),y=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),V=i.state;V.setBlending(ei),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const F=v!==Dn&&this.type===Dn,z=v===Dn&&this.type!==Dn;for(let j=0,G=T.length;j<G;j++){const J=T[j],W=J.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const at=W.getFrameExtents();if(s.multiply(at),r.copy(W.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/at.x),s.x=r.x*at.x,W.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/at.y),s.y=r.y*at.y,W.mapSize.y=r.y)),W.map===null||F===!0||z===!0){const mt=this.type!==Dn?{minFilter:fn,magFilter:fn}:{};W.map!==null&&W.map.dispose(),W.map=new bi(s.x,s.y,mt),W.map.texture.name=J.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const ht=W.getViewportCount();for(let mt=0;mt<ht;mt++){const Nt=W.getViewport(mt);a.set(r.x*Nt.x,r.y*Nt.y,r.x*Nt.z,r.y*Nt.w),V.viewport(a),W.updateMatrices(J,mt),n=W.getFrustum(),x(R,I,W.camera,J,this.type)}W.isPointLightShadow!==!0&&this.type===Dn&&_(W,I),W.needsUpdate=!1}v=this.type,m.needsUpdate=!1,i.setRenderTarget(S,y,A)};function _(T,R){const I=t.update(g);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new bi(s.x,s.y)),u.uniforms.shadow_pass.value=T.map.texture,u.uniforms.resolution.value=T.mapSize,u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(R,null,I,u,g,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(R,null,I,f,g,null)}function M(T,R,I,S){let y=null;const A=I.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(A!==void 0)y=A;else if(y=I.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0){const V=y.uuid,F=R.uuid;let z=c[V];z===void 0&&(z={},c[V]=z);let j=z[F];j===void 0&&(j=y.clone(),z[F]=j,R.addEventListener("dispose",D)),y=j}if(y.visible=R.visible,y.wireframe=R.wireframe,S===Dn?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:d[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,I.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const V=i.properties.get(y);V.light=I}return y}function x(T,R,I,S,y){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===Dn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,T.matrixWorld);const F=t.update(T),z=T.material;if(Array.isArray(z)){const j=F.groups;for(let G=0,J=j.length;G<J;G++){const W=j[G],at=z[W.materialIndex];if(at&&at.visible){const ht=M(T,at,S,y);T.onBeforeShadow(i,T,R,I,F,ht,W),i.renderBufferDirect(I,null,F,ht,T,W),T.onAfterShadow(i,T,R,I,F,ht,W)}}}else if(z.visible){const j=M(T,z,S,y);T.onBeforeShadow(i,T,R,I,F,j,null),i.renderBufferDirect(I,null,F,j,T,null),T.onAfterShadow(i,T,R,I,F,j,null)}}const V=T.children;for(let F=0,z=V.length;F<z;F++)x(V[F],R,I,S,y)}function D(T){T.target.removeEventListener("dispose",D);for(const I in c){const S=c[I],y=T.target.uuid;y in S&&(S[y].dispose(),delete S[y])}}}const Xv={[Ya]:Ja,[Za]:to,[Ka]:eo,[Qi]:Qa,[Ja]:Ya,[to]:Za,[eo]:Ka,[Qa]:Qi};function $v(i,t){function e(){let O=!1;const pt=new le;let Y=null;const et=new le(0,0,0,0);return{setMask:function(Mt){Y!==Mt&&!O&&(i.colorMask(Mt,Mt,Mt,Mt),Y=Mt)},setLocked:function(Mt){O=Mt},setClear:function(Mt,_t,Bt,ve,Ne){Ne===!0&&(Mt*=ve,_t*=ve,Bt*=ve),pt.set(Mt,_t,Bt,ve),et.equals(pt)===!1&&(i.clearColor(Mt,_t,Bt,ve),et.copy(pt))},reset:function(){O=!1,Y=null,et.set(-1,0,0,0)}}}function n(){let O=!1,pt=!1,Y=null,et=null,Mt=null;return{setReversed:function(_t){if(pt!==_t){const Bt=t.get("EXT_clip_control");pt?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT);const ve=Mt;Mt=null,this.setClear(ve)}pt=_t},getReversed:function(){return pt},setTest:function(_t){_t?Q(i.DEPTH_TEST):Pt(i.DEPTH_TEST)},setMask:function(_t){Y!==_t&&!O&&(i.depthMask(_t),Y=_t)},setFunc:function(_t){if(pt&&(_t=Xv[_t]),et!==_t){switch(_t){case Ya:i.depthFunc(i.NEVER);break;case Ja:i.depthFunc(i.ALWAYS);break;case Za:i.depthFunc(i.LESS);break;case Qi:i.depthFunc(i.LEQUAL);break;case Ka:i.depthFunc(i.EQUAL);break;case Qa:i.depthFunc(i.GEQUAL);break;case to:i.depthFunc(i.GREATER);break;case eo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}et=_t}},setLocked:function(_t){O=_t},setClear:function(_t){Mt!==_t&&(pt&&(_t=1-_t),i.clearDepth(_t),Mt=_t)},reset:function(){O=!1,Y=null,et=null,Mt=null,pt=!1}}}function s(){let O=!1,pt=null,Y=null,et=null,Mt=null,_t=null,Bt=null,ve=null,Ne=null;return{setTest:function(ne){O||(ne?Q(i.STENCIL_TEST):Pt(i.STENCIL_TEST))},setMask:function(ne){pt!==ne&&!O&&(i.stencilMask(ne),pt=ne)},setFunc:function(ne,en,wn){(Y!==ne||et!==en||Mt!==wn)&&(i.stencilFunc(ne,en,wn),Y=ne,et=en,Mt=wn)},setOp:function(ne,en,wn){(_t!==ne||Bt!==en||ve!==wn)&&(i.stencilOp(ne,en,wn),_t=ne,Bt=en,ve=wn)},setLocked:function(ne){O=ne},setClear:function(ne){Ne!==ne&&(i.clearStencil(ne),Ne=ne)},reset:function(){O=!1,pt=null,Y=null,et=null,Mt=null,_t=null,Bt=null,ve=null,Ne=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],p=null,g=!1,m=null,v=null,_=null,M=null,x=null,D=null,T=null,R=new Xt(0,0,0),I=0,S=!1,y=null,A=null,V=null,F=null,z=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,J=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(W)[1]),G=J>=1):W.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),G=J>=2);let at=null,ht={};const mt=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),Jt=new le().fromArray(mt),N=new le().fromArray(Nt);function K(O,pt,Y,et){const Mt=new Uint8Array(4),_t=i.createTexture();i.bindTexture(O,_t),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Bt=0;Bt<Y;Bt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,et,0,i.RGBA,i.UNSIGNED_BYTE,Mt):i.texImage2D(pt+Bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Mt);return _t}const ut={};ut[i.TEXTURE_2D]=K(i.TEXTURE_2D,i.TEXTURE_2D,1),ut[i.TEXTURE_CUBE_MAP]=K(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ut[i.TEXTURE_2D_ARRAY]=K(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ut[i.TEXTURE_3D]=K(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(i.DEPTH_TEST),a.setFunc(Qi),nt(!1),yt(Rl),Q(i.CULL_FACE),L(ei);function Q(O){h[O]!==!0&&(i.enable(O),h[O]=!0)}function Pt(O){h[O]!==!1&&(i.disable(O),h[O]=!1)}function Dt(O,pt){return d[O]!==pt?(i.bindFramebuffer(O,pt),d[O]=pt,O===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=pt),O===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function At(O,pt){let Y=f,et=!1;if(O){Y=u.get(pt),Y===void 0&&(Y=[],u.set(pt,Y));const Mt=O.textures;if(Y.length!==Mt.length||Y[0]!==i.COLOR_ATTACHMENT0){for(let _t=0,Bt=Mt.length;_t<Bt;_t++)Y[_t]=i.COLOR_ATTACHMENT0+_t;Y.length=Mt.length,et=!0}}else Y[0]!==i.BACK&&(Y[0]=i.BACK,et=!0);et&&i.drawBuffers(Y)}function qt(O){return p!==O?(i.useProgram(O),p=O,!0):!1}const $={[mi]:i.FUNC_ADD,[qu]:i.FUNC_SUBTRACT,[Yu]:i.FUNC_REVERSE_SUBTRACT};$[Ju]=i.MIN,$[Zu]=i.MAX;const st={[Ku]:i.ZERO,[Qu]:i.ONE,[td]:i.SRC_COLOR,[ja]:i.SRC_ALPHA,[ad]:i.SRC_ALPHA_SATURATE,[sd]:i.DST_COLOR,[nd]:i.DST_ALPHA,[ed]:i.ONE_MINUS_SRC_COLOR,[qa]:i.ONE_MINUS_SRC_ALPHA,[rd]:i.ONE_MINUS_DST_COLOR,[id]:i.ONE_MINUS_DST_ALPHA,[od]:i.CONSTANT_COLOR,[ld]:i.ONE_MINUS_CONSTANT_COLOR,[cd]:i.CONSTANT_ALPHA,[hd]:i.ONE_MINUS_CONSTANT_ALPHA};function L(O,pt,Y,et,Mt,_t,Bt,ve,Ne,ne){if(O===ei){g===!0&&(Pt(i.BLEND),g=!1);return}if(g===!1&&(Q(i.BLEND),g=!0),O!==ju){if(O!==m||ne!==S){if((v!==mi||x!==mi)&&(i.blendEquation(i.FUNC_ADD),v=mi,x=mi),ne)switch(O){case Ji:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ll:i.blendFunc(i.ONE,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Ji:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ll:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Pl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Dl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}_=null,M=null,D=null,T=null,R.set(0,0,0),I=0,m=O,S=ne}return}Mt=Mt||pt,_t=_t||Y,Bt=Bt||et,(pt!==v||Mt!==x)&&(i.blendEquationSeparate($[pt],$[Mt]),v=pt,x=Mt),(Y!==_||et!==M||_t!==D||Bt!==T)&&(i.blendFuncSeparate(st[Y],st[et],st[_t],st[Bt]),_=Y,M=et,D=_t,T=Bt),(ve.equals(R)===!1||Ne!==I)&&(i.blendColor(ve.r,ve.g,ve.b,Ne),R.copy(ve),I=Ne),m=O,S=!1}function wt(O,pt){O.side===cn?Pt(i.CULL_FACE):Q(i.CULL_FACE);let Y=O.side===$e;pt&&(Y=!Y),nt(Y),O.blending===Ji&&O.transparent===!1?L(ei):L(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),r.setMask(O.colorWrite);const et=O.stencilWrite;o.setTest(et),et&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),It(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?Q(i.SAMPLE_ALPHA_TO_COVERAGE):Pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function nt(O){y!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),y=O)}function yt(O){O!==Wu?(Q(i.CULL_FACE),O!==A&&(O===Rl?i.cullFace(i.BACK):O===Xu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pt(i.CULL_FACE),A=O}function lt(O){O!==V&&(G&&i.lineWidth(O),V=O)}function It(O,pt,Y){O?(Q(i.POLYGON_OFFSET_FILL),(F!==pt||z!==Y)&&(i.polygonOffset(pt,Y),F=pt,z=Y)):Pt(i.POLYGON_OFFSET_FILL)}function gt(O){O?Q(i.SCISSOR_TEST):Pt(i.SCISSOR_TEST)}function w(O){O===void 0&&(O=i.TEXTURE0+j-1),at!==O&&(i.activeTexture(O),at=O)}function b(O,pt,Y){Y===void 0&&(at===null?Y=i.TEXTURE0+j-1:Y=at);let et=ht[Y];et===void 0&&(et={type:void 0,texture:void 0},ht[Y]=et),(et.type!==O||et.texture!==pt)&&(at!==Y&&(i.activeTexture(Y),at=Y),i.bindTexture(O,pt||ut[O]),et.type=O,et.texture=pt)}function U(){const O=ht[at];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function q(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function tt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Z(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function St(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function dt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function vt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Vt(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function rt(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function bt(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ut(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ft(O){Jt.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),Jt.copy(O))}function Et(O){N.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),N.copy(O))}function Yt(O,pt){let Y=c.get(pt);Y===void 0&&(Y=new WeakMap,c.set(pt,Y));let et=Y.get(O);et===void 0&&(et=i.getUniformBlockIndex(pt,O.name),Y.set(O,et))}function Gt(O,pt){const et=c.get(pt).get(O);l.get(pt)!==et&&(i.uniformBlockBinding(pt,et,O.__bindingPointIndex),l.set(pt,et))}function ce(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},at=null,ht={},d={},u=new WeakMap,f=[],p=null,g=!1,m=null,v=null,_=null,M=null,x=null,D=null,T=null,R=new Xt(0,0,0),I=0,S=!1,y=null,A=null,V=null,F=null,z=null,Jt.set(0,0,i.canvas.width,i.canvas.height),N.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Q,disable:Pt,bindFramebuffer:Dt,drawBuffers:At,useProgram:qt,setBlending:L,setMaterial:wt,setFlipSided:nt,setCullFace:yt,setLineWidth:lt,setPolygonOffset:It,setScissorTest:gt,activeTexture:w,bindTexture:b,unbindTexture:U,compressedTexImage2D:q,compressedTexImage3D:tt,texImage2D:bt,texImage3D:Ut,updateUBOMapping:Yt,uniformBlockBinding:Gt,texStorage2D:Vt,texStorage3D:rt,texSubImage2D:Z,texSubImage3D:St,compressedTexSubImage2D:dt,compressedTexSubImage3D:vt,scissor:Ft,viewport:Et,reset:ce}}function Ac(i,t,e,n){const s=jv(n);switch(e){case Uh:return i*t;case Fh:return i*t;case Oh:return i*t*2;case Bh:return i*t/s.components*s.byteLength;case tl:return i*t/s.components*s.byteLength;case zh:return i*t*2/s.components*s.byteLength;case el:return i*t*2/s.components*s.byteLength;case Nh:return i*t*3/s.components*s.byteLength;case dn:return i*t*4/s.components*s.byteLength;case nl:return i*t*4/s.components*s.byteLength;case Tr:case Cr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Rr:case Lr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case oo:case co:return Math.max(i,16)*Math.max(t,8)/4;case ao:case lo:return Math.max(i,8)*Math.max(t,8)/2;case ho:case uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case fo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case mo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case go:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case vo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case _o:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case xo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Mo:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case yo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case So:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Eo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case wo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ao:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case To:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Pr:case Co:case Ro:return Math.ceil(i/4)*Math.ceil(t/4)*16;case kh:case Lo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Po:case Do:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function jv(i){switch(i){case Bn:case Ph:return{byteLength:1,components:1};case Us:case Dh:case ks:return{byteLength:2,components:1};case Ko:case Qo:return{byteLength:2,components:4};case Si:case Zo:case Nn:return{byteLength:4,components:1};case Ih:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function qv(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(w,b){return f?new OffscreenCanvas(w,b):kr("canvas")}function g(w,b,U){let q=1;const tt=gt(w);if((tt.width>U||tt.height>U)&&(q=U/Math.max(tt.width,tt.height)),q<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const Z=Math.floor(q*tt.width),St=Math.floor(q*tt.height);d===void 0&&(d=p(Z,St));const dt=b?p(Z,St):d;return dt.width=Z,dt.height=St,dt.getContext("2d").drawImage(w,0,0,Z,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+Z+"x"+St+")."),dt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),w;return w}function m(w){return w.generateMipmaps}function v(w){i.generateMipmap(w)}function _(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(w,b,U,q,tt=!1){if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let Z=b;if(b===i.RED&&(U===i.FLOAT&&(Z=i.R32F),U===i.HALF_FLOAT&&(Z=i.R16F),U===i.UNSIGNED_BYTE&&(Z=i.R8)),b===i.RED_INTEGER&&(U===i.UNSIGNED_BYTE&&(Z=i.R8UI),U===i.UNSIGNED_SHORT&&(Z=i.R16UI),U===i.UNSIGNED_INT&&(Z=i.R32UI),U===i.BYTE&&(Z=i.R8I),U===i.SHORT&&(Z=i.R16I),U===i.INT&&(Z=i.R32I)),b===i.RG&&(U===i.FLOAT&&(Z=i.RG32F),U===i.HALF_FLOAT&&(Z=i.RG16F),U===i.UNSIGNED_BYTE&&(Z=i.RG8)),b===i.RG_INTEGER&&(U===i.UNSIGNED_BYTE&&(Z=i.RG8UI),U===i.UNSIGNED_SHORT&&(Z=i.RG16UI),U===i.UNSIGNED_INT&&(Z=i.RG32UI),U===i.BYTE&&(Z=i.RG8I),U===i.SHORT&&(Z=i.RG16I),U===i.INT&&(Z=i.RG32I)),b===i.RGB_INTEGER&&(U===i.UNSIGNED_BYTE&&(Z=i.RGB8UI),U===i.UNSIGNED_SHORT&&(Z=i.RGB16UI),U===i.UNSIGNED_INT&&(Z=i.RGB32UI),U===i.BYTE&&(Z=i.RGB8I),U===i.SHORT&&(Z=i.RGB16I),U===i.INT&&(Z=i.RGB32I)),b===i.RGBA_INTEGER&&(U===i.UNSIGNED_BYTE&&(Z=i.RGBA8UI),U===i.UNSIGNED_SHORT&&(Z=i.RGBA16UI),U===i.UNSIGNED_INT&&(Z=i.RGBA32UI),U===i.BYTE&&(Z=i.RGBA8I),U===i.SHORT&&(Z=i.RGBA16I),U===i.INT&&(Z=i.RGBA32I)),b===i.RGB&&U===i.UNSIGNED_INT_5_9_9_9_REV&&(Z=i.RGB9_E5),b===i.RGBA){const St=tt?jr:Zt.getTransfer(q);U===i.FLOAT&&(Z=i.RGBA32F),U===i.HALF_FLOAT&&(Z=i.RGBA16F),U===i.UNSIGNED_BYTE&&(Z=St===re?i.SRGB8_ALPHA8:i.RGBA8),U===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),U===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function x(w,b){let U;return w?b===null||b===Si||b===ns?U=i.DEPTH24_STENCIL8:b===Nn?U=i.DEPTH32F_STENCIL8:b===Us&&(U=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Si||b===ns?U=i.DEPTH_COMPONENT24:b===Nn?U=i.DEPTH_COMPONENT32F:b===Us&&(U=i.DEPTH_COMPONENT16),U}function D(w,b){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==fn&&w.minFilter!==Mn?Math.log2(Math.max(b.width,b.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?b.mipmaps.length:1}function T(w){const b=w.target;b.removeEventListener("dispose",T),I(b),b.isVideoTexture&&h.delete(b)}function R(w){const b=w.target;b.removeEventListener("dispose",R),y(b)}function I(w){const b=n.get(w);if(b.__webglInit===void 0)return;const U=w.source,q=u.get(U);if(q){const tt=q[b.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&S(w),Object.keys(q).length===0&&u.delete(U)}n.remove(w)}function S(w){const b=n.get(w);i.deleteTexture(b.__webglTexture);const U=w.source,q=u.get(U);delete q[b.__cacheKey],a.memory.textures--}function y(w){const b=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(b.__webglFramebuffer[q]))for(let tt=0;tt<b.__webglFramebuffer[q].length;tt++)i.deleteFramebuffer(b.__webglFramebuffer[q][tt]);else i.deleteFramebuffer(b.__webglFramebuffer[q]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[q])}else{if(Array.isArray(b.__webglFramebuffer))for(let q=0;q<b.__webglFramebuffer.length;q++)i.deleteFramebuffer(b.__webglFramebuffer[q]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let q=0;q<b.__webglColorRenderbuffer.length;q++)b.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[q]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const U=w.textures;for(let q=0,tt=U.length;q<tt;q++){const Z=n.get(U[q]);Z.__webglTexture&&(i.deleteTexture(Z.__webglTexture),a.memory.textures--),n.remove(U[q])}n.remove(w)}let A=0;function V(){A=0}function F(){const w=A;return w>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),A+=1,w}function z(w){const b=[];return b.push(w.wrapS),b.push(w.wrapT),b.push(w.wrapR||0),b.push(w.magFilter),b.push(w.minFilter),b.push(w.anisotropy),b.push(w.internalFormat),b.push(w.format),b.push(w.type),b.push(w.generateMipmaps),b.push(w.premultiplyAlpha),b.push(w.flipY),b.push(w.unpackAlignment),b.push(w.colorSpace),b.join()}function j(w,b){const U=n.get(w);if(w.isVideoTexture&&lt(w),w.isRenderTargetTexture===!1&&w.version>0&&U.__version!==w.version){const q=w.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{N(U,w,b);return}}e.bindTexture(i.TEXTURE_2D,U.__webglTexture,i.TEXTURE0+b)}function G(w,b){const U=n.get(w);if(w.version>0&&U.__version!==w.version){N(U,w,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,U.__webglTexture,i.TEXTURE0+b)}function J(w,b){const U=n.get(w);if(w.version>0&&U.__version!==w.version){N(U,w,b);return}e.bindTexture(i.TEXTURE_3D,U.__webglTexture,i.TEXTURE0+b)}function W(w,b){const U=n.get(w);if(w.version>0&&U.__version!==w.version){K(U,w,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,U.__webglTexture,i.TEXTURE0+b)}const at={[so]:i.REPEAT,[_i]:i.CLAMP_TO_EDGE,[ro]:i.MIRRORED_REPEAT},ht={[fn]:i.NEAREST,[Md]:i.NEAREST_MIPMAP_NEAREST,[$s]:i.NEAREST_MIPMAP_LINEAR,[Mn]:i.LINEAR,[ea]:i.LINEAR_MIPMAP_NEAREST,[xi]:i.LINEAR_MIPMAP_LINEAR},mt={[Ed]:i.NEVER,[Ld]:i.ALWAYS,[wd]:i.LESS,[Gh]:i.LEQUAL,[Ad]:i.EQUAL,[Rd]:i.GEQUAL,[Td]:i.GREATER,[Cd]:i.NOTEQUAL};function Nt(w,b){if(b.type===Nn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Mn||b.magFilter===ea||b.magFilter===$s||b.magFilter===xi||b.minFilter===Mn||b.minFilter===ea||b.minFilter===$s||b.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,at[b.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,at[b.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,at[b.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,ht[b.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,ht[b.minFilter]),b.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,mt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===fn||b.minFilter!==$s&&b.minFilter!==xi||b.type===Nn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const U=t.get("EXT_texture_filter_anisotropic");i.texParameterf(w,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Jt(w,b){let U=!1;w.__webglInit===void 0&&(w.__webglInit=!0,b.addEventListener("dispose",T));const q=b.source;let tt=u.get(q);tt===void 0&&(tt={},u.set(q,tt));const Z=z(b);if(Z!==w.__cacheKey){tt[Z]===void 0&&(tt[Z]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,U=!0),tt[Z].usedTimes++;const St=tt[w.__cacheKey];St!==void 0&&(tt[w.__cacheKey].usedTimes--,St.usedTimes===0&&S(b)),w.__cacheKey=Z,w.__webglTexture=tt[Z].texture}return U}function N(w,b,U){let q=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(q=i.TEXTURE_3D);const tt=Jt(w,b),Z=b.source;e.bindTexture(q,w.__webglTexture,i.TEXTURE0+U);const St=n.get(Z);if(Z.version!==St.__version||tt===!0){e.activeTexture(i.TEXTURE0+U);const dt=Zt.getPrimaries(Zt.workingColorSpace),vt=b.colorSpace===Kn?null:Zt.getPrimaries(b.colorSpace),Vt=b.colorSpace===Kn||dt===vt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);let rt=g(b.image,!1,s.maxTextureSize);rt=It(b,rt);const bt=r.convert(b.format,b.colorSpace),Ut=r.convert(b.type);let Ft=M(b.internalFormat,bt,Ut,b.colorSpace,b.isVideoTexture);Nt(q,b);let Et;const Yt=b.mipmaps,Gt=b.isVideoTexture!==!0,ce=St.__version===void 0||tt===!0,O=Z.dataReady,pt=D(b,rt);if(b.isDepthTexture)Ft=x(b.format===is,b.type),ce&&(Gt?e.texStorage2D(i.TEXTURE_2D,1,Ft,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,Ft,rt.width,rt.height,0,bt,Ut,null));else if(b.isDataTexture)if(Yt.length>0){Gt&&ce&&e.texStorage2D(i.TEXTURE_2D,pt,Ft,Yt[0].width,Yt[0].height);for(let Y=0,et=Yt.length;Y<et;Y++)Et=Yt[Y],Gt?O&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,Et.width,Et.height,bt,Ut,Et.data):e.texImage2D(i.TEXTURE_2D,Y,Ft,Et.width,Et.height,0,bt,Ut,Et.data);b.generateMipmaps=!1}else Gt?(ce&&e.texStorage2D(i.TEXTURE_2D,pt,Ft,rt.width,rt.height),O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt.width,rt.height,bt,Ut,rt.data)):e.texImage2D(i.TEXTURE_2D,0,Ft,rt.width,rt.height,0,bt,Ut,rt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Gt&&ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ft,Yt[0].width,Yt[0].height,rt.depth);for(let Y=0,et=Yt.length;Y<et;Y++)if(Et=Yt[Y],b.format!==dn)if(bt!==null)if(Gt){if(O)if(b.layerUpdates.size>0){const Mt=Ac(Et.width,Et.height,b.format,b.type);for(const _t of b.layerUpdates){const Bt=Et.data.subarray(_t*Mt/Et.data.BYTES_PER_ELEMENT,(_t+1)*Mt/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,_t,Et.width,Et.height,1,bt,Bt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Et.width,Et.height,rt.depth,bt,Et.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Ft,Et.width,Et.height,rt.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Gt?O&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,Et.width,Et.height,rt.depth,bt,Ut,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,Ft,Et.width,Et.height,rt.depth,0,bt,Ut,Et.data)}else{Gt&&ce&&e.texStorage2D(i.TEXTURE_2D,pt,Ft,Yt[0].width,Yt[0].height);for(let Y=0,et=Yt.length;Y<et;Y++)Et=Yt[Y],b.format!==dn?bt!==null?Gt?O&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,Et.width,Et.height,bt,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,Ft,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Gt?O&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,Et.width,Et.height,bt,Ut,Et.data):e.texImage2D(i.TEXTURE_2D,Y,Ft,Et.width,Et.height,0,bt,Ut,Et.data)}else if(b.isDataArrayTexture)if(Gt){if(ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ft,rt.width,rt.height,rt.depth),O)if(b.layerUpdates.size>0){const Y=Ac(rt.width,rt.height,b.format,b.type);for(const et of b.layerUpdates){const Mt=rt.data.subarray(et*Y/rt.data.BYTES_PER_ELEMENT,(et+1)*Y/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,et,rt.width,rt.height,1,bt,Ut,Mt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,bt,Ut,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ft,rt.width,rt.height,rt.depth,0,bt,Ut,rt.data);else if(b.isData3DTexture)Gt?(ce&&e.texStorage3D(i.TEXTURE_3D,pt,Ft,rt.width,rt.height,rt.depth),O&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,bt,Ut,rt.data)):e.texImage3D(i.TEXTURE_3D,0,Ft,rt.width,rt.height,rt.depth,0,bt,Ut,rt.data);else if(b.isFramebufferTexture){if(ce)if(Gt)e.texStorage2D(i.TEXTURE_2D,pt,Ft,rt.width,rt.height);else{let Y=rt.width,et=rt.height;for(let Mt=0;Mt<pt;Mt++)e.texImage2D(i.TEXTURE_2D,Mt,Ft,Y,et,0,bt,Ut,null),Y>>=1,et>>=1}}else if(Yt.length>0){if(Gt&&ce){const Y=gt(Yt[0]);e.texStorage2D(i.TEXTURE_2D,pt,Ft,Y.width,Y.height)}for(let Y=0,et=Yt.length;Y<et;Y++)Et=Yt[Y],Gt?O&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,bt,Ut,Et):e.texImage2D(i.TEXTURE_2D,Y,Ft,bt,Ut,Et);b.generateMipmaps=!1}else if(Gt){if(ce){const Y=gt(rt);e.texStorage2D(i.TEXTURE_2D,pt,Ft,Y.width,Y.height)}O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,Ut,rt)}else e.texImage2D(i.TEXTURE_2D,0,Ft,bt,Ut,rt);m(b)&&v(q),St.__version=Z.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function K(w,b,U){if(b.image.length!==6)return;const q=Jt(w,b),tt=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+U);const Z=n.get(tt);if(tt.version!==Z.__version||q===!0){e.activeTexture(i.TEXTURE0+U);const St=Zt.getPrimaries(Zt.workingColorSpace),dt=b.colorSpace===Kn?null:Zt.getPrimaries(b.colorSpace),vt=b.colorSpace===Kn||St===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,vt);const Vt=b.isCompressedTexture||b.image[0].isCompressedTexture,rt=b.image[0]&&b.image[0].isDataTexture,bt=[];for(let et=0;et<6;et++)!Vt&&!rt?bt[et]=g(b.image[et],!0,s.maxCubemapSize):bt[et]=rt?b.image[et].image:b.image[et],bt[et]=It(b,bt[et]);const Ut=bt[0],Ft=r.convert(b.format,b.colorSpace),Et=r.convert(b.type),Yt=M(b.internalFormat,Ft,Et,b.colorSpace),Gt=b.isVideoTexture!==!0,ce=Z.__version===void 0||q===!0,O=tt.dataReady;let pt=D(b,Ut);Nt(i.TEXTURE_CUBE_MAP,b);let Y;if(Vt){Gt&&ce&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Yt,Ut.width,Ut.height);for(let et=0;et<6;et++){Y=bt[et].mipmaps;for(let Mt=0;Mt<Y.length;Mt++){const _t=Y[Mt];b.format!==dn?Ft!==null?Gt?O&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt,0,0,_t.width,_t.height,Ft,_t.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt,Yt,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Gt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt,0,0,_t.width,_t.height,Ft,Et,_t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt,Yt,_t.width,_t.height,0,Ft,Et,_t.data)}}}else{if(Y=b.mipmaps,Gt&&ce){Y.length>0&&pt++;const et=gt(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Yt,et.width,et.height)}for(let et=0;et<6;et++)if(rt){Gt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,bt[et].width,bt[et].height,Ft,Et,bt[et].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Yt,bt[et].width,bt[et].height,0,Ft,Et,bt[et].data);for(let Mt=0;Mt<Y.length;Mt++){const Bt=Y[Mt].image[et].image;Gt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt+1,0,0,Bt.width,Bt.height,Ft,Et,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt+1,Yt,Bt.width,Bt.height,0,Ft,Et,Bt.data)}}else{Gt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,Ft,Et,bt[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,Yt,Ft,Et,bt[et]);for(let Mt=0;Mt<Y.length;Mt++){const _t=Y[Mt];Gt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt+1,0,0,Ft,Et,_t.image[et]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+et,Mt+1,Yt,Ft,Et,_t.image[et])}}}m(b)&&v(i.TEXTURE_CUBE_MAP),Z.__version=tt.version,b.onUpdate&&b.onUpdate(b)}w.__version=b.version}function ut(w,b,U,q,tt,Z){const St=r.convert(U.format,U.colorSpace),dt=r.convert(U.type),vt=M(U.internalFormat,St,dt,U.colorSpace),Vt=n.get(b),rt=n.get(U);if(rt.__renderTarget=b,!Vt.__hasExternalTextures){const bt=Math.max(1,b.width>>Z),Ut=Math.max(1,b.height>>Z);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,Z,vt,bt,Ut,b.depth,0,St,dt,null):e.texImage2D(tt,Z,vt,bt,Ut,0,St,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),yt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,tt,rt.__webglTexture,0,nt(b)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,tt,rt.__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Q(w,b,U){if(i.bindRenderbuffer(i.RENDERBUFFER,w),b.depthBuffer){const q=b.depthTexture,tt=q&&q.isDepthTexture?q.type:null,Z=x(b.stencilBuffer,tt),St=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=nt(b);yt(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,Z,b.width,b.height):U?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,Z,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Z,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,St,i.RENDERBUFFER,w)}else{const q=b.textures;for(let tt=0;tt<q.length;tt++){const Z=q[tt],St=r.convert(Z.format,Z.colorSpace),dt=r.convert(Z.type),vt=M(Z.internalFormat,St,dt,Z.colorSpace),Vt=nt(b);U&&yt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,vt,b.width,b.height):yt(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Vt,vt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,vt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pt(w,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(b.depthTexture);q.__renderTarget=b,(!q.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),j(b.depthTexture,0);const tt=q.__webglTexture,Z=nt(b);if(b.depthTexture.format===Zi)yt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,tt,0);else if(b.depthTexture.format===is)yt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0,Z):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,tt,0);else throw new Error("Unknown depthTexture format")}function Dt(w){const b=n.get(w),U=w.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==w.depthTexture){const q=w.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),q){const tt=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,q.removeEventListener("dispose",tt)};q.addEventListener("dispose",tt),b.__depthDisposeCallback=tt}b.__boundDepthTexture=q}if(w.depthTexture&&!b.__autoAllocateDepthBuffer){if(U)throw new Error("target.depthTexture not supported in Cube render targets");Pt(b.__webglFramebuffer,w)}else if(U){b.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[q]),b.__webglDepthbuffer[q]===void 0)b.__webglDepthbuffer[q]=i.createRenderbuffer(),Q(b.__webglDepthbuffer[q],w,!1);else{const tt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=b.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,Z)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),Q(b.__webglDepthbuffer,w,!1);else{const q=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,tt=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,tt),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,tt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function At(w,b,U){const q=n.get(w);b!==void 0&&ut(q.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),U!==void 0&&Dt(w)}function qt(w){const b=w.texture,U=n.get(w),q=n.get(b);w.addEventListener("dispose",R);const tt=w.textures,Z=w.isWebGLCubeRenderTarget===!0,St=tt.length>1;if(St||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=b.version,a.memory.textures++),Z){U.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(b.mipmaps&&b.mipmaps.length>0){U.__webglFramebuffer[dt]=[];for(let vt=0;vt<b.mipmaps.length;vt++)U.__webglFramebuffer[dt][vt]=i.createFramebuffer()}else U.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){U.__webglFramebuffer=[];for(let dt=0;dt<b.mipmaps.length;dt++)U.__webglFramebuffer[dt]=i.createFramebuffer()}else U.__webglFramebuffer=i.createFramebuffer();if(St)for(let dt=0,vt=tt.length;dt<vt;dt++){const Vt=n.get(tt[dt]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&yt(w)===!1){U.__webglMultisampledFramebuffer=i.createFramebuffer(),U.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let dt=0;dt<tt.length;dt++){const vt=tt[dt];U.__webglColorRenderbuffer[dt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,U.__webglColorRenderbuffer[dt]);const Vt=r.convert(vt.format,vt.colorSpace),rt=r.convert(vt.type),bt=M(vt.internalFormat,Vt,rt,vt.colorSpace,w.isXRRenderTarget===!0),Ut=nt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,bt,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,U.__webglColorRenderbuffer[dt])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(U.__webglDepthRenderbuffer=i.createRenderbuffer(),Q(U.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Z){e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,b);for(let dt=0;dt<6;dt++)if(b.mipmaps&&b.mipmaps.length>0)for(let vt=0;vt<b.mipmaps.length;vt++)ut(U.__webglFramebuffer[dt][vt],w,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,vt);else ut(U.__webglFramebuffer[dt],w,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);m(b)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let dt=0,vt=tt.length;dt<vt;dt++){const Vt=tt[dt],rt=n.get(Vt);e.bindTexture(i.TEXTURE_2D,rt.__webglTexture),Nt(i.TEXTURE_2D,Vt),ut(U.__webglFramebuffer,w,Vt,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,0),m(Vt)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(dt=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,q.__webglTexture),Nt(dt,b),b.mipmaps&&b.mipmaps.length>0)for(let vt=0;vt<b.mipmaps.length;vt++)ut(U.__webglFramebuffer[vt],w,b,i.COLOR_ATTACHMENT0,dt,vt);else ut(U.__webglFramebuffer,w,b,i.COLOR_ATTACHMENT0,dt,0);m(b)&&v(dt),e.unbindTexture()}w.depthBuffer&&Dt(w)}function $(w){const b=w.textures;for(let U=0,q=b.length;U<q;U++){const tt=b[U];if(m(tt)){const Z=_(w),St=n.get(tt).__webglTexture;e.bindTexture(Z,St),v(Z),e.unbindTexture()}}}const st=[],L=[];function wt(w){if(w.samples>0){if(yt(w)===!1){const b=w.textures,U=w.width,q=w.height;let tt=i.COLOR_BUFFER_BIT;const Z=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(w),dt=b.length>1;if(dt)for(let vt=0;vt<b.length;vt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let vt=0;vt<b.length;vt++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),dt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[vt]);const Vt=n.get(b[vt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Vt,0)}i.blitFramebuffer(0,0,U,q,0,0,U,q,tt,i.NEAREST),l===!0&&(st.length=0,L.length=0,st.push(i.COLOR_ATTACHMENT0+vt),w.depthBuffer&&w.resolveDepthBuffer===!1&&(st.push(Z),L.push(Z),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,L)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),dt)for(let vt=0;vt<b.length;vt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.RENDERBUFFER,St.__webglColorRenderbuffer[vt]);const Vt=n.get(b[vt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+vt,i.TEXTURE_2D,Vt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const b=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function nt(w){return Math.min(s.maxSamples,w.samples)}function yt(w){const b=n.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function lt(w){const b=a.render.frame;h.get(w)!==b&&(h.set(w,b),w.update())}function It(w,b){const U=w.colorSpace,q=w.format,tt=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||U!==os&&U!==Kn&&(Zt.getTransfer(U)===re?(q!==dn||tt!==Bn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",U)),b}function gt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=V,this.setTexture2D=j,this.setTexture2DArray=G,this.setTexture3D=J,this.setTextureCube=W,this.rebindTextures=At,this.setupRenderTarget=qt,this.updateRenderTargetMipmap=$,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=yt}function Yv(i,t){function e(n,s=Kn){let r;const a=Zt.getTransfer(s);if(n===Bn)return i.UNSIGNED_BYTE;if(n===Ko)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ih)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ph)return i.BYTE;if(n===Dh)return i.SHORT;if(n===Us)return i.UNSIGNED_SHORT;if(n===Zo)return i.INT;if(n===Si)return i.UNSIGNED_INT;if(n===Nn)return i.FLOAT;if(n===ks)return i.HALF_FLOAT;if(n===Uh)return i.ALPHA;if(n===Nh)return i.RGB;if(n===dn)return i.RGBA;if(n===Fh)return i.LUMINANCE;if(n===Oh)return i.LUMINANCE_ALPHA;if(n===Zi)return i.DEPTH_COMPONENT;if(n===is)return i.DEPTH_STENCIL;if(n===Bh)return i.RED;if(n===tl)return i.RED_INTEGER;if(n===zh)return i.RG;if(n===el)return i.RG_INTEGER;if(n===nl)return i.RGBA_INTEGER;if(n===Tr||n===Cr||n===Rr||n===Lr)if(a===re)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Tr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Lr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Tr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Rr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Lr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ao||n===oo||n===lo||n===co)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ao)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===oo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===lo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===co)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ho||n===uo||n===fo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ho||n===uo)return a===re?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===fo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===po||n===mo||n===go||n===vo||n===_o||n===xo||n===Mo||n===yo||n===So||n===bo||n===Eo||n===wo||n===Ao||n===To)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===po)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===mo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===go)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===vo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===_o)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===xo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Mo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===yo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===So)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===bo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Eo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===wo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ao)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===To)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Pr||n===Co||n===Ro)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Pr)return a===re?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Co)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ro)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===kh||n===Lo||n===Po||n===Do)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Pr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Lo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Po)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Do)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ns?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Jv extends Qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class _n extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Zv={type:"move"};class Ca{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new _n,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new _n,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new _n,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const m=e.getJointPose(g,n),v=this._getHandJoint(c,g);m!==null&&(v.matrix.fromArray(m.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=m.radius),v.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Zv)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new _n;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Kv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Qv=`
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

}`;class t0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ge,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new zn({vertexShader:Kv,fragmentShader:Qv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ae(new qr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class e0 extends ls{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null;const g=new t0,m=e.getContextAttributes();let v=null,_=null;const M=[],x=[],D=new ft;let T=null;const R=new Qe;R.viewport=new le;const I=new Qe;I.viewport=new le;const S=[R,I],y=new Jv;let A=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(N){let K=M[N];return K===void 0&&(K=new Ca,M[N]=K),K.getTargetRaySpace()},this.getControllerGrip=function(N){let K=M[N];return K===void 0&&(K=new Ca,M[N]=K),K.getGripSpace()},this.getHand=function(N){let K=M[N];return K===void 0&&(K=new Ca,M[N]=K),K.getHandSpace()};function F(N){const K=x.indexOf(N.inputSource);if(K===-1)return;const ut=M[K];ut!==void 0&&(ut.update(N.inputSource,N.frame,c||a),ut.dispatchEvent({type:N.type,data:N.inputSource}))}function z(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",j);for(let N=0;N<M.length;N++){const K=x[N];K!==null&&(x[N]=null,M[N].disconnect(K))}A=null,V=null,g.reset(),t.setRenderTarget(v),f=null,u=null,d=null,s=null,_=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(N){r=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(N){o=N,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(N){c=N},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(N){if(s=N,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",z),s.addEventListener("inputsourceschange",j),m.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(D),s.renderState.layers===void 0){const K={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,K),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new bi(f.framebufferWidth,f.framebufferHeight,{format:dn,type:Bn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let K=null,ut=null,Q=null;m.depth&&(Q=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,K=m.stencil?is:Zi,ut=m.stencil?ns:Si);const Pt={colorFormat:e.RGBA8,depthFormat:Q,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(Pt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new bi(u.textureWidth,u.textureHeight,{format:dn,type:Bn,depthTexture:new Qh(u.textureWidth,u.textureHeight,ut,void 0,void 0,void 0,void 0,void 0,void 0,K),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function j(N){for(let K=0;K<N.removed.length;K++){const ut=N.removed[K],Q=x.indexOf(ut);Q>=0&&(x[Q]=null,M[Q].disconnect(ut))}for(let K=0;K<N.added.length;K++){const ut=N.added[K];let Q=x.indexOf(ut);if(Q===-1){for(let Dt=0;Dt<M.length;Dt++)if(Dt>=x.length){x.push(ut),Q=Dt;break}else if(x[Dt]===null){x[Dt]=ut,Q=Dt;break}if(Q===-1)break}const Pt=M[Q];Pt&&Pt.connect(ut)}}const G=new P,J=new P;function W(N,K,ut){G.setFromMatrixPosition(K.matrixWorld),J.setFromMatrixPosition(ut.matrixWorld);const Q=G.distanceTo(J),Pt=K.projectionMatrix.elements,Dt=ut.projectionMatrix.elements,At=Pt[14]/(Pt[10]-1),qt=Pt[14]/(Pt[10]+1),$=(Pt[9]+1)/Pt[5],st=(Pt[9]-1)/Pt[5],L=(Pt[8]-1)/Pt[0],wt=(Dt[8]+1)/Dt[0],nt=At*L,yt=At*wt,lt=Q/(-L+wt),It=lt*-L;if(K.matrixWorld.decompose(N.position,N.quaternion,N.scale),N.translateX(It),N.translateZ(lt),N.matrixWorld.compose(N.position,N.quaternion,N.scale),N.matrixWorldInverse.copy(N.matrixWorld).invert(),Pt[10]===-1)N.projectionMatrix.copy(K.projectionMatrix),N.projectionMatrixInverse.copy(K.projectionMatrixInverse);else{const gt=At+lt,w=qt+lt,b=nt-It,U=yt+(Q-It),q=$*qt/w*gt,tt=st*qt/w*gt;N.projectionMatrix.makePerspective(b,U,q,tt,gt,w),N.projectionMatrixInverse.copy(N.projectionMatrix).invert()}}function at(N,K){K===null?N.matrixWorld.copy(N.matrix):N.matrixWorld.multiplyMatrices(K.matrixWorld,N.matrix),N.matrixWorldInverse.copy(N.matrixWorld).invert()}this.updateCamera=function(N){if(s===null)return;let K=N.near,ut=N.far;g.texture!==null&&(g.depthNear>0&&(K=g.depthNear),g.depthFar>0&&(ut=g.depthFar)),y.near=I.near=R.near=K,y.far=I.far=R.far=ut,(A!==y.near||V!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),A=y.near,V=y.far),R.layers.mask=N.layers.mask|2,I.layers.mask=N.layers.mask|4,y.layers.mask=R.layers.mask|I.layers.mask;const Q=N.parent,Pt=y.cameras;at(y,Q);for(let Dt=0;Dt<Pt.length;Dt++)at(Pt[Dt],Q);Pt.length===2?W(y,R,I):y.projectionMatrix.copy(R.projectionMatrix),ht(N,y,Q)};function ht(N,K,ut){ut===null?N.matrix.copy(K.matrixWorld):(N.matrix.copy(ut.matrixWorld),N.matrix.invert(),N.matrix.multiply(K.matrixWorld)),N.matrix.decompose(N.position,N.quaternion,N.scale),N.updateMatrixWorld(!0),N.projectionMatrix.copy(K.projectionMatrix),N.projectionMatrixInverse.copy(K.projectionMatrixInverse),N.isPerspectiveCamera&&(N.fov=Ns*2*Math.atan(1/N.projectionMatrix.elements[5]),N.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(N){l=N,u!==null&&(u.fixedFoveation=N),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=N)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(y)};let mt=null;function Nt(N,K){if(h=K.getViewerPose(c||a),p=K,h!==null){const ut=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Q=!1;ut.length!==y.cameras.length&&(y.cameras.length=0,Q=!0);for(let Dt=0;Dt<ut.length;Dt++){const At=ut[Dt];let qt=null;if(f!==null)qt=f.getViewport(At);else{const st=d.getViewSubImage(u,At);qt=st.viewport,Dt===0&&(t.setRenderTargetTextures(_,st.colorTexture,u.ignoreDepthValues?void 0:st.depthStencilTexture),t.setRenderTarget(_))}let $=S[Dt];$===void 0&&($=new Qe,$.layers.enable(Dt),$.viewport=new le,S[Dt]=$),$.matrix.fromArray(At.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(At.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(qt.x,qt.y,qt.width,qt.height),Dt===0&&(y.matrix.copy($.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),Q===!0&&y.cameras.push($)}const Pt=s.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")){const Dt=d.getDepthInformation(ut[0]);Dt&&Dt.isValid&&Dt.texture&&g.init(t,Dt,s.renderState)}}for(let ut=0;ut<M.length;ut++){const Q=x[ut],Pt=M[ut];Q!==null&&Pt!==void 0&&Pt.update(Q,K,c||a)}mt&&mt(N,K),K.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:K}),p=null}const Jt=new Kh;Jt.setAnimationLoop(Nt),this.setAnimationLoop=function(N){mt=N},this.dispose=function(){}}}const ui=new bn,n0=new se;function i0(i,t){function e(m,v){m.matrixAutoUpdate===!0&&m.updateMatrix(),v.value.copy(m.matrix)}function n(m,v){v.color.getRGB(m.fogColor.value,Yh(i)),v.isFog?(m.fogNear.value=v.near,m.fogFar.value=v.far):v.isFogExp2&&(m.fogDensity.value=v.density)}function s(m,v,_,M,x){v.isMeshBasicMaterial||v.isMeshLambertMaterial?r(m,v):v.isMeshToonMaterial?(r(m,v),d(m,v)):v.isMeshPhongMaterial?(r(m,v),h(m,v)):v.isMeshStandardMaterial?(r(m,v),u(m,v),v.isMeshPhysicalMaterial&&f(m,v,x)):v.isMeshMatcapMaterial?(r(m,v),p(m,v)):v.isMeshDepthMaterial?r(m,v):v.isMeshDistanceMaterial?(r(m,v),g(m,v)):v.isMeshNormalMaterial?r(m,v):v.isLineBasicMaterial?(a(m,v),v.isLineDashedMaterial&&o(m,v)):v.isPointsMaterial?l(m,v,_,M):v.isSpriteMaterial?c(m,v):v.isShadowMaterial?(m.color.value.copy(v.color),m.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(m,v){m.opacity.value=v.opacity,v.color&&m.diffuse.value.copy(v.color),v.emissive&&m.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(m.map.value=v.map,e(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.bumpMap&&(m.bumpMap.value=v.bumpMap,e(v.bumpMap,m.bumpMapTransform),m.bumpScale.value=v.bumpScale,v.side===$e&&(m.bumpScale.value*=-1)),v.normalMap&&(m.normalMap.value=v.normalMap,e(v.normalMap,m.normalMapTransform),m.normalScale.value.copy(v.normalScale),v.side===$e&&m.normalScale.value.negate()),v.displacementMap&&(m.displacementMap.value=v.displacementMap,e(v.displacementMap,m.displacementMapTransform),m.displacementScale.value=v.displacementScale,m.displacementBias.value=v.displacementBias),v.emissiveMap&&(m.emissiveMap.value=v.emissiveMap,e(v.emissiveMap,m.emissiveMapTransform)),v.specularMap&&(m.specularMap.value=v.specularMap,e(v.specularMap,m.specularMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest);const _=t.get(v),M=_.envMap,x=_.envMapRotation;M&&(m.envMap.value=M,ui.copy(x),ui.x*=-1,ui.y*=-1,ui.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ui.y*=-1,ui.z*=-1),m.envMapRotation.value.setFromMatrix4(n0.makeRotationFromEuler(ui)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=v.reflectivity,m.ior.value=v.ior,m.refractionRatio.value=v.refractionRatio),v.lightMap&&(m.lightMap.value=v.lightMap,m.lightMapIntensity.value=v.lightMapIntensity,e(v.lightMap,m.lightMapTransform)),v.aoMap&&(m.aoMap.value=v.aoMap,m.aoMapIntensity.value=v.aoMapIntensity,e(v.aoMap,m.aoMapTransform))}function a(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,v.map&&(m.map.value=v.map,e(v.map,m.mapTransform))}function o(m,v){m.dashSize.value=v.dashSize,m.totalSize.value=v.dashSize+v.gapSize,m.scale.value=v.scale}function l(m,v,_,M){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.size.value=v.size*_,m.scale.value=M*.5,v.map&&(m.map.value=v.map,e(v.map,m.uvTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function c(m,v){m.diffuse.value.copy(v.color),m.opacity.value=v.opacity,m.rotation.value=v.rotation,v.map&&(m.map.value=v.map,e(v.map,m.mapTransform)),v.alphaMap&&(m.alphaMap.value=v.alphaMap,e(v.alphaMap,m.alphaMapTransform)),v.alphaTest>0&&(m.alphaTest.value=v.alphaTest)}function h(m,v){m.specular.value.copy(v.specular),m.shininess.value=Math.max(v.shininess,1e-4)}function d(m,v){v.gradientMap&&(m.gradientMap.value=v.gradientMap)}function u(m,v){m.metalness.value=v.metalness,v.metalnessMap&&(m.metalnessMap.value=v.metalnessMap,e(v.metalnessMap,m.metalnessMapTransform)),m.roughness.value=v.roughness,v.roughnessMap&&(m.roughnessMap.value=v.roughnessMap,e(v.roughnessMap,m.roughnessMapTransform)),v.envMap&&(m.envMapIntensity.value=v.envMapIntensity)}function f(m,v,_){m.ior.value=v.ior,v.sheen>0&&(m.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),m.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(m.sheenColorMap.value=v.sheenColorMap,e(v.sheenColorMap,m.sheenColorMapTransform)),v.sheenRoughnessMap&&(m.sheenRoughnessMap.value=v.sheenRoughnessMap,e(v.sheenRoughnessMap,m.sheenRoughnessMapTransform))),v.clearcoat>0&&(m.clearcoat.value=v.clearcoat,m.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(m.clearcoatMap.value=v.clearcoatMap,e(v.clearcoatMap,m.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,e(v.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(m.clearcoatNormalMap.value=v.clearcoatNormalMap,e(v.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===$e&&m.clearcoatNormalScale.value.negate())),v.dispersion>0&&(m.dispersion.value=v.dispersion),v.iridescence>0&&(m.iridescence.value=v.iridescence,m.iridescenceIOR.value=v.iridescenceIOR,m.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(m.iridescenceMap.value=v.iridescenceMap,e(v.iridescenceMap,m.iridescenceMapTransform)),v.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=v.iridescenceThicknessMap,e(v.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),v.transmission>0&&(m.transmission.value=v.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),v.transmissionMap&&(m.transmissionMap.value=v.transmissionMap,e(v.transmissionMap,m.transmissionMapTransform)),m.thickness.value=v.thickness,v.thicknessMap&&(m.thicknessMap.value=v.thicknessMap,e(v.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=v.attenuationDistance,m.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(m.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(m.anisotropyMap.value=v.anisotropyMap,e(v.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=v.specularIntensity,m.specularColor.value.copy(v.specularColor),v.specularColorMap&&(m.specularColorMap.value=v.specularColorMap,e(v.specularColorMap,m.specularColorMapTransform)),v.specularIntensityMap&&(m.specularIntensityMap.value=v.specularIntensityMap,e(v.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,v){v.matcap&&(m.matcap.value=v.matcap)}function g(m,v){const _=t.get(v).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function s0(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,M){const x=M.program;n.uniformBlockBinding(_,x)}function c(_,M){let x=s[_.id];x===void 0&&(p(_),x=h(_),s[_.id]=x,_.addEventListener("dispose",m));const D=M.program;n.updateUBOMapping(_,D);const T=t.render.frame;r[_.id]!==T&&(u(_),r[_.id]=T)}function h(_){const M=d();_.__bindingPointIndex=M;const x=i.createBuffer(),D=_.__size,T=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,D,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,x),x}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const M=s[_.id],x=_.uniforms,D=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,R=x.length;T<R;T++){const I=Array.isArray(x[T])?x[T]:[x[T]];for(let S=0,y=I.length;S<y;S++){const A=I[S];if(f(A,T,S,D)===!0){const V=A.__offset,F=Array.isArray(A.value)?A.value:[A.value];let z=0;for(let j=0;j<F.length;j++){const G=F[j],J=g(G);typeof G=="number"||typeof G=="boolean"?(A.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,V+z,A.__data)):G.isMatrix3?(A.__data[0]=G.elements[0],A.__data[1]=G.elements[1],A.__data[2]=G.elements[2],A.__data[3]=0,A.__data[4]=G.elements[3],A.__data[5]=G.elements[4],A.__data[6]=G.elements[5],A.__data[7]=0,A.__data[8]=G.elements[6],A.__data[9]=G.elements[7],A.__data[10]=G.elements[8],A.__data[11]=0):(G.toArray(A.__data,z),z+=J.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(_,M,x,D){const T=_.value,R=M+"_"+x;if(D[R]===void 0)return typeof T=="number"||typeof T=="boolean"?D[R]=T:D[R]=T.clone(),!0;{const I=D[R];if(typeof T=="number"||typeof T=="boolean"){if(I!==T)return D[R]=T,!0}else if(I.equals(T)===!1)return I.copy(T),!0}return!1}function p(_){const M=_.uniforms;let x=0;const D=16;for(let R=0,I=M.length;R<I;R++){const S=Array.isArray(M[R])?M[R]:[M[R]];for(let y=0,A=S.length;y<A;y++){const V=S[y],F=Array.isArray(V.value)?V.value:[V.value];for(let z=0,j=F.length;z<j;z++){const G=F[z],J=g(G),W=x%D,at=W%J.boundary,ht=W+at;x+=at,ht!==0&&D-ht<J.storage&&(x+=D-ht),V.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=x,x+=J.storage}}}const T=x%D;return T>0&&(x+=D-T),_.__size=x,_.__cache={},this}function g(_){const M={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(M.boundary=4,M.storage=4):_.isVector2?(M.boundary=8,M.storage=8):_.isVector3||_.isColor?(M.boundary=16,M.storage=12):_.isVector4?(M.boundary=16,M.storage=16):_.isMatrix3?(M.boundary=48,M.storage=48):_.isMatrix4?(M.boundary=64,M.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),M}function m(_){const M=_.target;M.removeEventListener("dispose",m);const x=a.indexOf(M.__bindingPointIndex);a.splice(x,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function v(){for(const _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:v}}class r0{constructor(t={}){const{canvas:e=jd(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const p=new Uint32Array(4),g=new Int32Array(4);let m=null,v=null;const _=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=We,this.toneMapping=ni,this.toneMappingExposure=1;const x=this;let D=!1,T=0,R=0,I=null,S=-1,y=null;const A=new le,V=new le;let F=null;const z=new Xt(0);let j=0,G=e.width,J=e.height,W=1,at=null,ht=null;const mt=new le(0,0,G,J),Nt=new le(0,0,G,J);let Jt=!1;const N=new ol;let K=!1,ut=!1;const Q=new se,Pt=new se,Dt=new P,At=new le,qt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $=!1;function st(){return I===null?W:1}let L=n;function wt(E,B){return e.getContext(E,B)}try{const E={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Jo}`),e.addEventListener("webglcontextlost",et,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",_t,!1),L===null){const B="webgl2";if(L=wt(B,E),L===null)throw wt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let nt,yt,lt,It,gt,w,b,U,q,tt,Z,St,dt,vt,Vt,rt,bt,Ut,Ft,Et,Yt,Gt,ce,O;function pt(){nt=new hg(L),nt.init(),Gt=new Yv(L,nt),yt=new sg(L,nt,t,Gt),lt=new $v(L,nt),yt.reverseDepthBuffer&&u&&lt.buffers.depth.setReversed(!0),It=new fg(L),gt=new Pv,w=new qv(L,nt,lt,gt,yt,Gt,It),b=new ag(x),U=new cg(x),q=new Mf(L),ce=new ng(L,q),tt=new ug(L,q,It,ce),Z=new mg(L,tt,q,It),Ft=new pg(L,yt,w),rt=new rg(gt),St=new Lv(x,b,U,nt,yt,ce,rt),dt=new i0(x,gt),vt=new Iv,Vt=new zv(nt),Ut=new eg(x,b,U,lt,Z,f,l),bt=new Wv(x,Z,yt),O=new s0(L,It,yt,lt),Et=new ig(L,nt,It),Yt=new dg(L,nt,It),It.programs=St.programs,x.capabilities=yt,x.extensions=nt,x.properties=gt,x.renderLists=vt,x.shadowMap=bt,x.state=lt,x.info=It}pt();const Y=new e0(x,L);this.xr=Y,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const E=nt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=nt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(E){E!==void 0&&(W=E,this.setSize(G,J,!1))},this.getSize=function(E){return E.set(G,J)},this.setSize=function(E,B,H=!0){if(Y.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=E,J=B,e.width=Math.floor(E*W),e.height=Math.floor(B*W),H===!0&&(e.style.width=E+"px",e.style.height=B+"px"),this.setViewport(0,0,E,B)},this.getDrawingBufferSize=function(E){return E.set(G*W,J*W).floor()},this.setDrawingBufferSize=function(E,B,H){G=E,J=B,W=H,e.width=Math.floor(E*H),e.height=Math.floor(B*H),this.setViewport(0,0,E,B)},this.getCurrentViewport=function(E){return E.copy(A)},this.getViewport=function(E){return E.copy(mt)},this.setViewport=function(E,B,H,X){E.isVector4?mt.set(E.x,E.y,E.z,E.w):mt.set(E,B,H,X),lt.viewport(A.copy(mt).multiplyScalar(W).round())},this.getScissor=function(E){return E.copy(Nt)},this.setScissor=function(E,B,H,X){E.isVector4?Nt.set(E.x,E.y,E.z,E.w):Nt.set(E,B,H,X),lt.scissor(V.copy(Nt).multiplyScalar(W).round())},this.getScissorTest=function(){return Jt},this.setScissorTest=function(E){lt.setScissorTest(Jt=E)},this.setOpaqueSort=function(E){at=E},this.setTransparentSort=function(E){ht=E},this.getClearColor=function(E){return E.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor.apply(Ut,arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha.apply(Ut,arguments)},this.clear=function(E=!0,B=!0,H=!0){let X=0;if(E){let k=!1;if(I!==null){const ot=I.texture.format;k=ot===nl||ot===el||ot===tl}if(k){const ot=I.texture.type,xt=ot===Bn||ot===Si||ot===Us||ot===ns||ot===Ko||ot===Qo,Tt=Ut.getClearColor(),Ct=Ut.getClearAlpha(),Ot=Tt.r,zt=Tt.g,Rt=Tt.b;xt?(p[0]=Ot,p[1]=zt,p[2]=Rt,p[3]=Ct,L.clearBufferuiv(L.COLOR,0,p)):(g[0]=Ot,g[1]=zt,g[2]=Rt,g[3]=Ct,L.clearBufferiv(L.COLOR,0,g))}else X|=L.COLOR_BUFFER_BIT}B&&(X|=L.DEPTH_BUFFER_BIT),H&&(X|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",et,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),vt.dispose(),Vt.dispose(),gt.dispose(),b.dispose(),U.dispose(),Z.dispose(),ce.dispose(),O.dispose(),St.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",xl),Y.removeEventListener("sessionend",Ml),ri.stop()};function et(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const E=It.autoReset,B=bt.enabled,H=bt.autoUpdate,X=bt.needsUpdate,k=bt.type;pt(),It.autoReset=E,bt.enabled=B,bt.autoUpdate=H,bt.needsUpdate=X,bt.type=k}function _t(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Bt(E){const B=E.target;B.removeEventListener("dispose",Bt),ve(B)}function ve(E){Ne(E),gt.remove(E)}function Ne(E){const B=gt.get(E).programs;B!==void 0&&(B.forEach(function(H){St.releaseProgram(H)}),E.isShaderMaterial&&St.releaseShaderCache(E))}this.renderBufferDirect=function(E,B,H,X,k,ot){B===null&&(B=qt);const xt=k.isMesh&&k.matrixWorld.determinant()<0,Tt=Fu(E,B,H,X,k);lt.setMaterial(X,xt);let Ct=H.index,Ot=1;if(X.wireframe===!0){if(Ct=tt.getWireframeAttribute(H),Ct===void 0)return;Ot=2}const zt=H.drawRange,Rt=H.attributes.position;let Kt=zt.start*Ot,he=(zt.start+zt.count)*Ot;ot!==null&&(Kt=Math.max(Kt,ot.start*Ot),he=Math.min(he,(ot.start+ot.count)*Ot)),Ct!==null?(Kt=Math.max(Kt,0),he=Math.min(he,Ct.count)):Rt!=null&&(Kt=Math.max(Kt,0),he=Math.min(he,Rt.count));const ue=he-Kt;if(ue<0||ue===1/0)return;ce.setup(k,X,Tt,H,Ct);let He,te=Et;if(Ct!==null&&(He=q.get(Ct),te=Yt,te.setIndex(He)),k.isMesh)X.wireframe===!0?(lt.setLineWidth(X.wireframeLinewidth*st()),te.setMode(L.LINES)):te.setMode(L.TRIANGLES);else if(k.isLine){let Lt=X.linewidth;Lt===void 0&&(Lt=1),lt.setLineWidth(Lt*st()),k.isLineSegments?te.setMode(L.LINES):k.isLineLoop?te.setMode(L.LINE_LOOP):te.setMode(L.LINE_STRIP)}else k.isPoints?te.setMode(L.POINTS):k.isSprite&&te.setMode(L.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)te.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))te.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Lt=k._multiDrawStarts,An=k._multiDrawCounts,ee=k._multiDrawCount,nn=Ct?q.get(Ct).bytesPerElement:1,Ri=gt.get(X).currentProgram.getUniforms();for(let je=0;je<ee;je++)Ri.setValue(L,"_gl_DrawID",je),te.render(Lt[je]/nn,An[je])}else if(k.isInstancedMesh)te.renderInstances(Kt,ue,k.count);else if(H.isInstancedBufferGeometry){const Lt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,An=Math.min(H.instanceCount,Lt);te.renderInstances(Kt,ue,An)}else te.render(Kt,ue)};function ne(E,B,H){E.transparent===!0&&E.side===cn&&E.forceSinglePass===!1?(E.side=$e,E.needsUpdate=!0,Xs(E,B,H),E.side=si,E.needsUpdate=!0,Xs(E,B,H),E.side=cn):Xs(E,B,H)}this.compile=function(E,B,H=null){H===null&&(H=E),v=Vt.get(H),v.init(B),M.push(v),H.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),E!==H&&E.traverseVisible(function(k){k.isLight&&k.layers.test(B.layers)&&(v.pushLight(k),k.castShadow&&v.pushShadow(k))}),v.setupLights();const X=new Set;return E.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ot=k.material;if(ot)if(Array.isArray(ot))for(let xt=0;xt<ot.length;xt++){const Tt=ot[xt];ne(Tt,H,k),X.add(Tt)}else ne(ot,H,k),X.add(ot)}),M.pop(),v=null,X},this.compileAsync=function(E,B,H=null){const X=this.compile(E,B,H);return new Promise(k=>{function ot(){if(X.forEach(function(xt){gt.get(xt).currentProgram.isReady()&&X.delete(xt)}),X.size===0){k(E);return}setTimeout(ot,10)}nt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let en=null;function wn(E){en&&en(E)}function xl(){ri.stop()}function Ml(){ri.start()}const ri=new Kh;ri.setAnimationLoop(wn),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(E){en=E,Y.setAnimationLoop(E),E===null?ri.stop():ri.start()},Y.addEventListener("sessionstart",xl),Y.addEventListener("sessionend",Ml),this.render=function(E,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(B),B=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(x,E,B,I),v=Vt.get(E,M.length),v.init(B),M.push(v),Pt.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),N.setFromProjectionMatrix(Pt),ut=this.localClippingEnabled,K=rt.init(this.clippingPlanes,ut),m=vt.get(E,_.length),m.init(),_.push(m),Y.enabled===!0&&Y.isPresenting===!0){const ot=x.xr.getDepthSensingMesh();ot!==null&&Qr(ot,B,-1/0,x.sortObjects)}Qr(E,B,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(at,ht),$=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,$&&Ut.addToRenderList(m,E),this.info.render.frame++,K===!0&&rt.beginShadows();const H=v.state.shadowsArray;bt.render(H,E,B),K===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=m.opaque,k=m.transmissive;if(v.setupLights(),B.isArrayCamera){const ot=B.cameras;if(k.length>0)for(let xt=0,Tt=ot.length;xt<Tt;xt++){const Ct=ot[xt];Sl(X,k,E,Ct)}$&&Ut.render(E);for(let xt=0,Tt=ot.length;xt<Tt;xt++){const Ct=ot[xt];yl(m,E,Ct,Ct.viewport)}}else k.length>0&&Sl(X,k,E,B),$&&Ut.render(E),yl(m,E,B);I!==null&&(w.updateMultisampleRenderTarget(I),w.updateRenderTargetMipmap(I)),E.isScene===!0&&E.onAfterRender(x,E,B),ce.resetDefaultState(),S=-1,y=null,M.pop(),M.length>0?(v=M[M.length-1],K===!0&&rt.setGlobalState(x.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?m=_[_.length-1]:m=null};function Qr(E,B,H,X){if(E.visible===!1)return;if(E.layers.test(B.layers)){if(E.isGroup)H=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(B);else if(E.isLight)v.pushLight(E),E.castShadow&&v.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||N.intersectsSprite(E)){X&&At.setFromMatrixPosition(E.matrixWorld).applyMatrix4(Pt);const xt=Z.update(E),Tt=E.material;Tt.visible&&m.push(E,xt,Tt,H,At.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||N.intersectsObject(E))){const xt=Z.update(E),Tt=E.material;if(X&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),At.copy(E.boundingSphere.center)):(xt.boundingSphere===null&&xt.computeBoundingSphere(),At.copy(xt.boundingSphere.center)),At.applyMatrix4(E.matrixWorld).applyMatrix4(Pt)),Array.isArray(Tt)){const Ct=xt.groups;for(let Ot=0,zt=Ct.length;Ot<zt;Ot++){const Rt=Ct[Ot],Kt=Tt[Rt.materialIndex];Kt&&Kt.visible&&m.push(E,xt,Kt,H,At.z,Rt)}}else Tt.visible&&m.push(E,xt,Tt,H,At.z,null)}}const ot=E.children;for(let xt=0,Tt=ot.length;xt<Tt;xt++)Qr(ot[xt],B,H,X)}function yl(E,B,H,X){const k=E.opaque,ot=E.transmissive,xt=E.transparent;v.setupLightsView(H),K===!0&&rt.setGlobalState(x.clippingPlanes,H),X&&lt.viewport(A.copy(X)),k.length>0&&Ws(k,B,H),ot.length>0&&Ws(ot,B,H),xt.length>0&&Ws(xt,B,H),lt.buffers.depth.setTest(!0),lt.buffers.depth.setMask(!0),lt.buffers.color.setMask(!0),lt.setPolygonOffset(!1)}function Sl(E,B,H,X){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new bi(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?ks:Bn,minFilter:xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace}));const ot=v.state.transmissionRenderTarget[X.id],xt=X.viewport||A;ot.setSize(xt.z,xt.w);const Tt=x.getRenderTarget();x.setRenderTarget(ot),x.getClearColor(z),j=x.getClearAlpha(),j<1&&x.setClearColor(16777215,.5),x.clear(),$&&Ut.render(H);const Ct=x.toneMapping;x.toneMapping=ni;const Ot=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),K===!0&&rt.setGlobalState(x.clippingPlanes,X),Ws(E,H,X),w.updateMultisampleRenderTarget(ot),w.updateRenderTargetMipmap(ot),nt.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let Rt=0,Kt=B.length;Rt<Kt;Rt++){const he=B[Rt],ue=he.object,He=he.geometry,te=he.material,Lt=he.group;if(te.side===cn&&ue.layers.test(X.layers)){const An=te.side;te.side=$e,te.needsUpdate=!0,bl(ue,H,X,He,te,Lt),te.side=An,te.needsUpdate=!0,zt=!0}}zt===!0&&(w.updateMultisampleRenderTarget(ot),w.updateRenderTargetMipmap(ot))}x.setRenderTarget(Tt),x.setClearColor(z,j),Ot!==void 0&&(X.viewport=Ot),x.toneMapping=Ct}function Ws(E,B,H){const X=B.isScene===!0?B.overrideMaterial:null;for(let k=0,ot=E.length;k<ot;k++){const xt=E[k],Tt=xt.object,Ct=xt.geometry,Ot=X===null?xt.material:X,zt=xt.group;Tt.layers.test(H.layers)&&bl(Tt,B,H,Ct,Ot,zt)}}function bl(E,B,H,X,k,ot){E.onBeforeRender(x,B,H,X,k,ot),E.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),k.onBeforeRender(x,B,H,X,E,ot),k.transparent===!0&&k.side===cn&&k.forceSinglePass===!1?(k.side=$e,k.needsUpdate=!0,x.renderBufferDirect(H,B,X,k,E,ot),k.side=si,k.needsUpdate=!0,x.renderBufferDirect(H,B,X,k,E,ot),k.side=cn):x.renderBufferDirect(H,B,X,k,E,ot),E.onAfterRender(x,B,H,X,k,ot)}function Xs(E,B,H){B.isScene!==!0&&(B=qt);const X=gt.get(E),k=v.state.lights,ot=v.state.shadowsArray,xt=k.state.version,Tt=St.getParameters(E,k.state,ot,B,H),Ct=St.getProgramCacheKey(Tt);let Ot=X.programs;X.environment=E.isMeshStandardMaterial?B.environment:null,X.fog=B.fog,X.envMap=(E.isMeshStandardMaterial?U:b).get(E.envMap||X.environment),X.envMapRotation=X.environment!==null&&E.envMap===null?B.environmentRotation:E.envMapRotation,Ot===void 0&&(E.addEventListener("dispose",Bt),Ot=new Map,X.programs=Ot);let zt=Ot.get(Ct);if(zt!==void 0){if(X.currentProgram===zt&&X.lightsStateVersion===xt)return wl(E,Tt),zt}else Tt.uniforms=St.getUniforms(E),E.onBeforeCompile(Tt,x),zt=St.acquireProgram(Tt,Ct),Ot.set(Ct,zt),X.uniforms=Tt.uniforms;const Rt=X.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Rt.clippingPlanes=rt.uniform),wl(E,Tt),X.needsLights=Bu(E),X.lightsStateVersion=xt,X.needsLights&&(Rt.ambientLightColor.value=k.state.ambient,Rt.lightProbe.value=k.state.probe,Rt.directionalLights.value=k.state.directional,Rt.directionalLightShadows.value=k.state.directionalShadow,Rt.spotLights.value=k.state.spot,Rt.spotLightShadows.value=k.state.spotShadow,Rt.rectAreaLights.value=k.state.rectArea,Rt.ltc_1.value=k.state.rectAreaLTC1,Rt.ltc_2.value=k.state.rectAreaLTC2,Rt.pointLights.value=k.state.point,Rt.pointLightShadows.value=k.state.pointShadow,Rt.hemisphereLights.value=k.state.hemi,Rt.directionalShadowMap.value=k.state.directionalShadowMap,Rt.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Rt.spotShadowMap.value=k.state.spotShadowMap,Rt.spotLightMatrix.value=k.state.spotLightMatrix,Rt.spotLightMap.value=k.state.spotLightMap,Rt.pointShadowMap.value=k.state.pointShadowMap,Rt.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=zt,X.uniformsList=null,zt}function El(E){if(E.uniformsList===null){const B=E.currentProgram.getUniforms();E.uniformsList=Dr.seqWithValue(B.seq,E.uniforms)}return E.uniformsList}function wl(E,B){const H=gt.get(E);H.outputColorSpace=B.outputColorSpace,H.batching=B.batching,H.batchingColor=B.batchingColor,H.instancing=B.instancing,H.instancingColor=B.instancingColor,H.instancingMorph=B.instancingMorph,H.skinning=B.skinning,H.morphTargets=B.morphTargets,H.morphNormals=B.morphNormals,H.morphColors=B.morphColors,H.morphTargetsCount=B.morphTargetsCount,H.numClippingPlanes=B.numClippingPlanes,H.numIntersection=B.numClipIntersection,H.vertexAlphas=B.vertexAlphas,H.vertexTangents=B.vertexTangents,H.toneMapping=B.toneMapping}function Fu(E,B,H,X,k){B.isScene!==!0&&(B=qt),w.resetTextureUnits();const ot=B.fog,xt=X.isMeshStandardMaterial?B.environment:null,Tt=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:os,Ct=(X.isMeshStandardMaterial?U:b).get(X.envMap||xt),Ot=X.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,zt=!!H.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Rt=!!H.morphAttributes.position,Kt=!!H.morphAttributes.normal,he=!!H.morphAttributes.color;let ue=ni;X.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ue=x.toneMapping);const He=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,te=He!==void 0?He.length:0,Lt=gt.get(X),An=v.state.lights;if(K===!0&&(ut===!0||E!==y)){const Ze=E===y&&X.id===S;rt.setState(X,E,Ze)}let ee=!1;X.version===Lt.__version?(Lt.needsLights&&Lt.lightsStateVersion!==An.state.version||Lt.outputColorSpace!==Tt||k.isBatchedMesh&&Lt.batching===!1||!k.isBatchedMesh&&Lt.batching===!0||k.isBatchedMesh&&Lt.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Lt.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Lt.instancing===!1||!k.isInstancedMesh&&Lt.instancing===!0||k.isSkinnedMesh&&Lt.skinning===!1||!k.isSkinnedMesh&&Lt.skinning===!0||k.isInstancedMesh&&Lt.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Lt.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Lt.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Lt.instancingMorph===!1&&k.morphTexture!==null||Lt.envMap!==Ct||X.fog===!0&&Lt.fog!==ot||Lt.numClippingPlanes!==void 0&&(Lt.numClippingPlanes!==rt.numPlanes||Lt.numIntersection!==rt.numIntersection)||Lt.vertexAlphas!==Ot||Lt.vertexTangents!==zt||Lt.morphTargets!==Rt||Lt.morphNormals!==Kt||Lt.morphColors!==he||Lt.toneMapping!==ue||Lt.morphTargetsCount!==te)&&(ee=!0):(ee=!0,Lt.__version=X.version);let nn=Lt.currentProgram;ee===!0&&(nn=Xs(X,B,k));let Ri=!1,je=!1,ds=!1;const de=nn.getUniforms(),mn=Lt.uniforms;if(lt.useProgram(nn.program)&&(Ri=!0,je=!0,ds=!0),X.id!==S&&(S=X.id,je=!0),Ri||y!==E){lt.buffers.depth.getReversed()?(Q.copy(E.projectionMatrix),Yd(Q),Jd(Q),de.setValue(L,"projectionMatrix",Q)):de.setValue(L,"projectionMatrix",E.projectionMatrix),de.setValue(L,"viewMatrix",E.matrixWorldInverse);const Hn=de.map.cameraPosition;Hn!==void 0&&Hn.setValue(L,Dt.setFromMatrixPosition(E.matrixWorld)),yt.logarithmicDepthBuffer&&de.setValue(L,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&de.setValue(L,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,je=!0,ds=!0)}if(k.isSkinnedMesh){de.setOptional(L,k,"bindMatrix"),de.setOptional(L,k,"bindMatrixInverse");const Ze=k.skeleton;Ze&&(Ze.boneTexture===null&&Ze.computeBoneTexture(),de.setValue(L,"boneTexture",Ze.boneTexture,w))}k.isBatchedMesh&&(de.setOptional(L,k,"batchingTexture"),de.setValue(L,"batchingTexture",k._matricesTexture,w),de.setOptional(L,k,"batchingIdTexture"),de.setValue(L,"batchingIdTexture",k._indirectTexture,w),de.setOptional(L,k,"batchingColorTexture"),k._colorsTexture!==null&&de.setValue(L,"batchingColorTexture",k._colorsTexture,w));const fs=H.morphAttributes;if((fs.position!==void 0||fs.normal!==void 0||fs.color!==void 0)&&Ft.update(k,H,nn),(je||Lt.receiveShadow!==k.receiveShadow)&&(Lt.receiveShadow=k.receiveShadow,de.setValue(L,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(mn.envMap.value=Ct,mn.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&B.environment!==null&&(mn.envMapIntensity.value=B.environmentIntensity),je&&(de.setValue(L,"toneMappingExposure",x.toneMappingExposure),Lt.needsLights&&Ou(mn,ds),ot&&X.fog===!0&&dt.refreshFogUniforms(mn,ot),dt.refreshMaterialUniforms(mn,X,W,J,v.state.transmissionRenderTarget[E.id]),Dr.upload(L,El(Lt),mn,w)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(Dr.upload(L,El(Lt),mn,w),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&de.setValue(L,"center",k.center),de.setValue(L,"modelViewMatrix",k.modelViewMatrix),de.setValue(L,"normalMatrix",k.normalMatrix),de.setValue(L,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Ze=X.uniformsGroups;for(let Hn=0,Wn=Ze.length;Hn<Wn;Hn++){const Al=Ze[Hn];O.update(Al,nn),O.bind(Al,nn)}}return nn}function Ou(E,B){E.ambientLightColor.needsUpdate=B,E.lightProbe.needsUpdate=B,E.directionalLights.needsUpdate=B,E.directionalLightShadows.needsUpdate=B,E.pointLights.needsUpdate=B,E.pointLightShadows.needsUpdate=B,E.spotLights.needsUpdate=B,E.spotLightShadows.needsUpdate=B,E.rectAreaLights.needsUpdate=B,E.hemisphereLights.needsUpdate=B}function Bu(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(E,B,H){gt.get(E.texture).__webglTexture=B,gt.get(E.depthTexture).__webglTexture=H;const X=gt.get(E);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=H===void 0,X.__autoAllocateDepthBuffer||nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,B){const H=gt.get(E);H.__webglFramebuffer=B,H.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(E,B=0,H=0){I=E,T=B,R=H;let X=!0,k=null,ot=!1,xt=!1;if(E){const Ct=gt.get(E);if(Ct.__useDefaultFramebuffer!==void 0)lt.bindFramebuffer(L.FRAMEBUFFER,null),X=!1;else if(Ct.__webglFramebuffer===void 0)w.setupRenderTarget(E);else if(Ct.__hasExternalTextures)w.rebindTextures(E,gt.get(E.texture).__webglTexture,gt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Rt=E.depthTexture;if(Ct.__boundDepthTexture!==Rt){if(Rt!==null&&gt.has(Rt)&&(E.width!==Rt.image.width||E.height!==Rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");w.setupDepthRenderbuffer(E)}}const Ot=E.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(xt=!0);const zt=gt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(zt[B])?k=zt[B][H]:k=zt[B],ot=!0):E.samples>0&&w.useMultisampledRTT(E)===!1?k=gt.get(E).__webglMultisampledFramebuffer:Array.isArray(zt)?k=zt[H]:k=zt,A.copy(E.viewport),V.copy(E.scissor),F=E.scissorTest}else A.copy(mt).multiplyScalar(W).floor(),V.copy(Nt).multiplyScalar(W).floor(),F=Jt;if(lt.bindFramebuffer(L.FRAMEBUFFER,k)&&X&&lt.drawBuffers(E,k),lt.viewport(A),lt.scissor(V),lt.setScissorTest(F),ot){const Ct=gt.get(E.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ct.__webglTexture,H)}else if(xt){const Ct=gt.get(E.texture),Ot=B||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ct.__webglTexture,H||0,Ot)}S=-1},this.readRenderTargetPixels=function(E,B,H,X,k,ot,xt){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=gt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&xt!==void 0&&(Tt=Tt[xt]),Tt){lt.bindFramebuffer(L.FRAMEBUFFER,Tt);try{const Ct=E.texture,Ot=Ct.format,zt=Ct.type;if(!yt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=E.width-X&&H>=0&&H<=E.height-k&&L.readPixels(B,H,X,k,Gt.convert(Ot),Gt.convert(zt),ot)}finally{const Ct=I!==null?gt.get(I).__webglFramebuffer:null;lt.bindFramebuffer(L.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(E,B,H,X,k,ot,xt){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=gt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&xt!==void 0&&(Tt=Tt[xt]),Tt){const Ct=E.texture,Ot=Ct.format,zt=Ct.type;if(!yt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(B>=0&&B<=E.width-X&&H>=0&&H<=E.height-k){lt.bindFramebuffer(L.FRAMEBUFFER,Tt);const Rt=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,Rt),L.bufferData(L.PIXEL_PACK_BUFFER,ot.byteLength,L.STREAM_READ),L.readPixels(B,H,X,k,Gt.convert(Ot),Gt.convert(zt),0);const Kt=I!==null?gt.get(I).__webglFramebuffer:null;lt.bindFramebuffer(L.FRAMEBUFFER,Kt);const he=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await qd(L,he,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,Rt),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,ot),L.deleteBuffer(Rt),L.deleteSync(he),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,B=null,H=0){E.isTexture!==!0&&(Ms("WebGLRenderer: copyFramebufferToTexture function signature has changed."),B=arguments[0]||null,E=arguments[1]);const X=Math.pow(2,-H),k=Math.floor(E.image.width*X),ot=Math.floor(E.image.height*X),xt=B!==null?B.x:0,Tt=B!==null?B.y:0;w.setTexture2D(E,0),L.copyTexSubImage2D(L.TEXTURE_2D,H,0,0,xt,Tt,k,ot),lt.unbindTexture()},this.copyTextureToTexture=function(E,B,H=null,X=null,k=0){E.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,E=arguments[1],B=arguments[2],k=arguments[3]||0,H=null);let ot,xt,Tt,Ct,Ot,zt,Rt,Kt,he;const ue=E.isCompressedTexture?E.mipmaps[k]:E.image;H!==null?(ot=H.max.x-H.min.x,xt=H.max.y-H.min.y,Tt=H.isBox3?H.max.z-H.min.z:1,Ct=H.min.x,Ot=H.min.y,zt=H.isBox3?H.min.z:0):(ot=ue.width,xt=ue.height,Tt=ue.depth||1,Ct=0,Ot=0,zt=0),X!==null?(Rt=X.x,Kt=X.y,he=X.z):(Rt=0,Kt=0,he=0);const He=Gt.convert(B.format),te=Gt.convert(B.type);let Lt;B.isData3DTexture?(w.setTexture3D(B,0),Lt=L.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(w.setTexture2DArray(B,0),Lt=L.TEXTURE_2D_ARRAY):(w.setTexture2D(B,0),Lt=L.TEXTURE_2D),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,B.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,B.unpackAlignment);const An=L.getParameter(L.UNPACK_ROW_LENGTH),ee=L.getParameter(L.UNPACK_IMAGE_HEIGHT),nn=L.getParameter(L.UNPACK_SKIP_PIXELS),Ri=L.getParameter(L.UNPACK_SKIP_ROWS),je=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,ue.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ue.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Ct),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ot),L.pixelStorei(L.UNPACK_SKIP_IMAGES,zt);const ds=E.isDataArrayTexture||E.isData3DTexture,de=B.isDataArrayTexture||B.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const mn=gt.get(E),fs=gt.get(B),Ze=gt.get(mn.__renderTarget),Hn=gt.get(fs.__renderTarget);lt.bindFramebuffer(L.READ_FRAMEBUFFER,Ze.__webglFramebuffer),lt.bindFramebuffer(L.DRAW_FRAMEBUFFER,Hn.__webglFramebuffer);for(let Wn=0;Wn<Tt;Wn++)ds&&L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,gt.get(E).__webglTexture,k,zt+Wn),E.isDepthTexture?(de&&L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,gt.get(B).__webglTexture,k,he+Wn),L.blitFramebuffer(Ct,Ot,ot,xt,Rt,Kt,ot,xt,L.DEPTH_BUFFER_BIT,L.NEAREST)):de?L.copyTexSubImage3D(Lt,k,Rt,Kt,he+Wn,Ct,Ot,ot,xt):L.copyTexSubImage2D(Lt,k,Rt,Kt,he+Wn,Ct,Ot,ot,xt);lt.bindFramebuffer(L.READ_FRAMEBUFFER,null),lt.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else de?E.isDataTexture||E.isData3DTexture?L.texSubImage3D(Lt,k,Rt,Kt,he,ot,xt,Tt,He,te,ue.data):B.isCompressedArrayTexture?L.compressedTexSubImage3D(Lt,k,Rt,Kt,he,ot,xt,Tt,He,ue.data):L.texSubImage3D(Lt,k,Rt,Kt,he,ot,xt,Tt,He,te,ue):E.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,k,Rt,Kt,ot,xt,He,te,ue.data):E.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,k,Rt,Kt,ue.width,ue.height,He,ue.data):L.texSubImage2D(L.TEXTURE_2D,k,Rt,Kt,ot,xt,He,te,ue);L.pixelStorei(L.UNPACK_ROW_LENGTH,An),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,ee),L.pixelStorei(L.UNPACK_SKIP_PIXELS,nn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ri),L.pixelStorei(L.UNPACK_SKIP_IMAGES,je),k===0&&B.generateMipmaps&&L.generateMipmap(Lt),lt.unbindTexture()},this.copyTextureToTexture3D=function(E,B,H=null,X=null,k=0){return E.isTexture!==!0&&(Ms("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,X=arguments[1]||null,E=arguments[2],B=arguments[3],k=arguments[4]||0),Ms('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,B,H,X,k)},this.initRenderTarget=function(E){gt.get(E).__webglFramebuffer===void 0&&w.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?w.setTextureCube(E,0):E.isData3DTexture?w.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?w.setTexture2DArray(E,0):w.setTexture2D(E,0),lt.unbindTexture()},this.resetState=function(){T=0,R=0,I=null,lt.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}}class a0 extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class o0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Io,this.updateRanges=[],this.version=0,this.uuid=yn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=yn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Be=new P;class ti{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=hn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=hn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=hn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=hn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=hn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new pn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ti(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Ir extends cs{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Xt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Tc=new se,No=new sl,fr=new Ci,pr=new P;class Ra extends ye{constructor(t=new Ce,e=new Ir){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),fr.copy(n.boundingSphere),fr.applyMatrix4(s),fr.radius+=r,t.ray.intersectsSphere(fr)===!1)return;Tc.copy(s).invert(),No.copy(t.ray).applyMatrix4(Tc);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=u,g=f;p<g;p++){const m=c.getX(p);pr.fromBufferAttribute(d,m),Cc(pr,m,l,s,t,e,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,g=f;p<g;p++)pr.fromBufferAttribute(d,p),Cc(pr,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Cc(i,t,e,n,s,r,a){const o=No.distanceSqToPoint(i);if(o<e){const l=new P;No.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class su extends Ge{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class En{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ft:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new P,s=[],r=[],a=[],o=new P,l=new se;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Te(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Te(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class hl extends En{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ft){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class l0 extends hl{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ul(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const mr=new P,La=new ul,Pa=new ul,Da=new ul;class c0 extends En{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new P){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(mr.subVectors(s[0],s[1]).add(s[0]),c=mr);const d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(mr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=mr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),g=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);g<1e-4&&(g=1),p<1e-4&&(p=g),m<1e-4&&(m=g),La.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,g,m),Pa.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,g,m),Da.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,g,m)}else this.curveType==="catmullrom"&&(La.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Pa.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Da.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(La.calc(l),Pa.calc(l),Da.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new P().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Rc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function h0(i,t){const e=1-i;return e*e*t}function u0(i,t){return 2*(1-i)*i*t}function d0(i,t){return i*i*t}function Ts(i,t,e,n){return h0(i,t)+u0(i,e)+d0(i,n)}function f0(i,t){const e=1-i;return e*e*e*t}function p0(i,t){const e=1-i;return 3*e*e*i*t}function m0(i,t){return 3*(1-i)*i*i*t}function g0(i,t){return i*i*i*t}function Cs(i,t,e,n,s){return f0(i,t)+p0(i,e)+m0(i,n)+g0(i,s)}class ru extends En{constructor(t=new ft,e=new ft,n=new ft,s=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Cs(t,s.x,r.x,a.x,o.x),Cs(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class v0 extends En{constructor(t=new P,e=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Cs(t,s.x,r.x,a.x,o.x),Cs(t,s.y,r.y,a.y,o.y),Cs(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class au extends En{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _0 extends En{constructor(t=new P,e=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new P){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new P){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ou extends En{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ts(t,s.x,r.x,a.x),Ts(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class x0 extends En{constructor(t=new P,e=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new P){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(Ts(t,s.x,r.x,a.x),Ts(t,s.y,r.y,a.y),Ts(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lu extends En{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Rc(o,l.x,c.x,h.x,d.x),Rc(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ft().fromArray(s))}return this}}var Fo=Object.freeze({__proto__:null,ArcCurve:l0,CatmullRomCurve3:c0,CubicBezierCurve:ru,CubicBezierCurve3:v0,EllipseCurve:hl,LineCurve:au,LineCurve3:_0,QuadraticBezierCurve:ou,QuadraticBezierCurve3:x0,SplineCurve:lu});class M0 extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Fo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Fo[s.type]().fromJSON(s))}return this}}class Vr extends M0{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new au(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new ou(this.currentPoint.clone(),new ft(t,e),new ft(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new ru(this.currentPoint.clone(),new ft(t,e),new ft(n,s),new ft(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new lu(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new hl(t,e,n,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class dl extends Ce{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const g=[],m=n/2;let v=0;_(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(u,3)),this.setAttribute("uv",new fe(f,2));function _(){const x=new P,D=new P;let T=0;const R=(e-t)/n;for(let I=0;I<=r;I++){const S=[],y=I/r,A=y*(e-t)+t;for(let V=0;V<=s;V++){const F=V/s,z=F*l+o,j=Math.sin(z),G=Math.cos(z);D.x=A*j,D.y=-y*n+m,D.z=A*G,d.push(D.x,D.y,D.z),x.set(j,R,G).normalize(),u.push(x.x,x.y,x.z),f.push(F,1-y),S.push(p++)}g.push(S)}for(let I=0;I<s;I++)for(let S=0;S<r;S++){const y=g[S][I],A=g[S+1][I],V=g[S+1][I+1],F=g[S][I+1];(t>0||S!==0)&&(h.push(y,A,F),T+=3),(e>0||S!==r-1)&&(h.push(A,V,F),T+=3)}c.addGroup(v,T,0),v+=T}function M(x){const D=p,T=new ft,R=new P;let I=0;const S=x===!0?t:e,y=x===!0?1:-1;for(let V=1;V<=s;V++)d.push(0,m*y,0),u.push(0,y,0),f.push(.5,.5),p++;const A=p;for(let V=0;V<=s;V++){const z=V/s*l+o,j=Math.cos(z),G=Math.sin(z);R.x=S*G,R.y=m*y,R.z=S*j,d.push(R.x,R.y,R.z),u.push(0,y,0),T.x=j*.5+.5,T.y=G*.5*y+.5,f.push(T.x,T.y),p++}for(let V=0;V<s;V++){const F=D+V,z=A+V;x===!0?h.push(z,z+1,F):h.push(z+1,z,F),I+=3}c.addGroup(v,I,x===!0?1:2),v+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dl(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Rs extends dl{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Rs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Zn extends Vr{constructor(t){super(t),this.uuid=yn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Vr().fromJSON(s))}return this}}const y0={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=cu(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c,h,d,u,f;if(n&&(r=A0(i,t,r,e)),i.length>80*e){o=c=i[0],l=h=i[1];for(let p=e;p<s;p+=e)d=i[p],u=i[p+1],d<o&&(o=d),u<l&&(l=u),d>c&&(c=d),u>h&&(h=u);f=Math.max(c-o,h-l),f=f!==0?32767/f:0}return Fs(r,a,e,o,l,f,0),a}};function cu(i,t,e,n,s){let r,a;if(s===O0(i,t,e,n)>0)for(r=t;r<e;r+=n)a=Lc(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=Lc(r,i[r],i[r+1],a);return a&&Jr(a,a.next)&&(Bs(a),a=a.next),a}function Ei(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Jr(e,e.next)||ge(e.prev,e,e.next)===0)){if(Bs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Fs(i,t,e,n,s,r,a){if(!i)return;!a&&r&&P0(i,n,s,r);let o=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?b0(i,n,s,r):S0(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Bs(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=E0(Ei(i),t,e),Fs(i,t,e,n,s,r,2)):a===2&&w0(i,t,e,n,s,r):Fs(Ei(i),t,e,n,s,r,1);break}}}function S0(i){const t=i.prev,e=i,n=i.next;if(ge(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=s<r?s<a?s:a:r<a?r:a,d=o<l?o<c?o:c:l<c?l:c,u=s>r?s>a?s:a:r>a?r:a,f=o>l?o>c?o:c:l>c?l:c;let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&Yi(s,o,r,l,a,c,p.x,p.y)&&ge(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function b0(i,t,e,n){const s=i.prev,r=i,a=i.next;if(ge(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,f=o<l?o<c?o:c:l<c?l:c,p=h<d?h<u?h:u:d<u?d:u,g=o>l?o>c?o:c:l>c?l:c,m=h>d?h>u?h:u:d>u?d:u,v=Oo(f,p,t,e,n),_=Oo(g,m,t,e,n);let M=i.prevZ,x=i.nextZ;for(;M&&M.z>=v&&x&&x.z<=_;){if(M.x>=f&&M.x<=g&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&Yi(o,h,l,d,c,u,M.x,M.y)&&ge(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=f&&x.x<=g&&x.y>=p&&x.y<=m&&x!==s&&x!==a&&Yi(o,h,l,d,c,u,x.x,x.y)&&ge(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=v;){if(M.x>=f&&M.x<=g&&M.y>=p&&M.y<=m&&M!==s&&M!==a&&Yi(o,h,l,d,c,u,M.x,M.y)&&ge(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=_;){if(x.x>=f&&x.x<=g&&x.y>=p&&x.y<=m&&x!==s&&x!==a&&Yi(o,h,l,d,c,u,x.x,x.y)&&ge(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function E0(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!Jr(s,r)&&hu(s,n,n.next,r)&&Os(s,r)&&Os(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Bs(n),Bs(n.next),n=i=r),n=n.next}while(n!==i);return Ei(n)}function w0(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&U0(a,o)){let l=uu(a,o);a=Ei(a,a.next),l=Ei(l,l.next),Fs(a,t,e,n,s,r,0),Fs(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function A0(i,t,e,n){const s=[];let r,a,o,l,c;for(r=0,a=t.length;r<a;r++)o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=cu(i,o,l,n,!1),c===c.next&&(c.steiner=!0),s.push(I0(c));for(s.sort(T0),r=0;r<s.length;r++)e=C0(s[r],e);return e}function T0(i,t){return i.x-t.x}function C0(i,t){const e=R0(i,t);if(!e)return t;const n=uu(e,i);return Ei(n,n.next),Ei(e,e.next)}function R0(i,t){let e=t,n=-1/0,s;const r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const u=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=r&&u>n&&(n=u,s=e.x<e.next.x?e:e.next,u===r))return s}e=e.next}while(e!==t);if(!s)return null;const o=s,l=s.x,c=s.y;let h=1/0,d;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Yi(a<c?r:n,a,l,c,a<c?n:r,a,e.x,e.y)&&(d=Math.abs(a-e.y)/(r-e.x),Os(e,i)&&(d<h||d===h&&(e.x>s.x||e.x===s.x&&L0(s,e)))&&(s=e,h=d)),e=e.next;while(e!==o);return s}function L0(i,t){return ge(i.prev,i,t.prev)<0&&ge(t.next,i,i.next)<0}function P0(i,t,e,n){let s=i;do s.z===0&&(s.z=Oo(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,D0(s)}function D0(i){let t,e,n,s,r,a,o,l,c=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<c&&(o++,n=n.nextZ,!!n);t++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(a>1);return i}function Oo(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function I0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Yi(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function U0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!N0(i,t)&&(Os(i,t)&&Os(t,i)&&F0(i,t)&&(ge(i.prev,i,t.prev)||ge(i,t.prev,t))||Jr(i,t)&&ge(i.prev,i,i.next)>0&&ge(t.prev,t,t.next)>0)}function ge(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Jr(i,t){return i.x===t.x&&i.y===t.y}function hu(i,t,e,n){const s=vr(ge(i,t,e)),r=vr(ge(i,t,n)),a=vr(ge(e,n,i)),o=vr(ge(e,n,t));return!!(s!==r&&a!==o||s===0&&gr(i,e,t)||r===0&&gr(i,n,t)||a===0&&gr(e,i,n)||o===0&&gr(e,t,n))}function gr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function vr(i){return i>0?1:i<0?-1:0}function N0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&hu(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Os(i,t){return ge(i.prev,i,i.next)<0?ge(i,t,i.next)>=0&&ge(i,i.prev,t)>=0:ge(i,t,i.prev)<0||ge(i,i.next,t)<0}function F0(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function uu(i,t){const e=new Bo(i.i,i.x,i.y),n=new Bo(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Lc(i,t,e,n){const s=new Bo(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Bs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Bo(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function O0(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Ls{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ls.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Pc(t),Dc(n,t);let a=t.length;e.forEach(Pc);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Dc(n,e[l]);const o=y0.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Pc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Dc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class fl extends Ce{constructor(t=new Zn([new ft(.5,.5),new ft(-.5,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new fe(s,3)),this.setAttribute("uv",new fe(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,g=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const v=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:B0;let M,x=!1,D,T,R,I;v&&(M=v.getSpacedPoints(h),x=!0,u=!1,D=v.computeFrenetFrames(h,!1),T=new P,R=new P,I=new P),u||(m=0,f=0,p=0,g=0);const S=o.extractPoints(c);let y=S.shape;const A=S.holes;if(!Ls.isClockWise(y)){y=y.reverse();for(let $=0,st=A.length;$<st;$++){const L=A[$];Ls.isClockWise(L)&&(A[$]=L.reverse())}}const F=Ls.triangulateShape(y,A),z=y;for(let $=0,st=A.length;$<st;$++){const L=A[$];y=y.concat(L)}function j($,st,L){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),$.clone().addScaledVector(st,L)}const G=y.length,J=F.length;function W($,st,L){let wt,nt,yt;const lt=$.x-st.x,It=$.y-st.y,gt=L.x-$.x,w=L.y-$.y,b=lt*lt+It*It,U=lt*w-It*gt;if(Math.abs(U)>Number.EPSILON){const q=Math.sqrt(b),tt=Math.sqrt(gt*gt+w*w),Z=st.x-It/q,St=st.y+lt/q,dt=L.x-w/tt,vt=L.y+gt/tt,Vt=((dt-Z)*w-(vt-St)*gt)/(lt*w-It*gt);wt=Z+lt*Vt-$.x,nt=St+It*Vt-$.y;const rt=wt*wt+nt*nt;if(rt<=2)return new ft(wt,nt);yt=Math.sqrt(rt/2)}else{let q=!1;lt>Number.EPSILON?gt>Number.EPSILON&&(q=!0):lt<-Number.EPSILON?gt<-Number.EPSILON&&(q=!0):Math.sign(It)===Math.sign(w)&&(q=!0),q?(wt=-It,nt=lt,yt=Math.sqrt(b)):(wt=lt,nt=It,yt=Math.sqrt(b/2))}return new ft(wt/yt,nt/yt)}const at=[];for(let $=0,st=z.length,L=st-1,wt=$+1;$<st;$++,L++,wt++)L===st&&(L=0),wt===st&&(wt=0),at[$]=W(z[$],z[L],z[wt]);const ht=[];let mt,Nt=at.concat();for(let $=0,st=A.length;$<st;$++){const L=A[$];mt=[];for(let wt=0,nt=L.length,yt=nt-1,lt=wt+1;wt<nt;wt++,yt++,lt++)yt===nt&&(yt=0),lt===nt&&(lt=0),mt[wt]=W(L[wt],L[yt],L[lt]);ht.push(mt),Nt=Nt.concat(mt)}for(let $=0;$<m;$++){const st=$/m,L=f*Math.cos(st*Math.PI/2),wt=p*Math.sin(st*Math.PI/2)+g;for(let nt=0,yt=z.length;nt<yt;nt++){const lt=j(z[nt],at[nt],wt);Q(lt.x,lt.y,-L)}for(let nt=0,yt=A.length;nt<yt;nt++){const lt=A[nt];mt=ht[nt];for(let It=0,gt=lt.length;It<gt;It++){const w=j(lt[It],mt[It],wt);Q(w.x,w.y,-L)}}}const Jt=p+g;for(let $=0;$<G;$++){const st=u?j(y[$],Nt[$],Jt):y[$];x?(R.copy(D.normals[0]).multiplyScalar(st.x),T.copy(D.binormals[0]).multiplyScalar(st.y),I.copy(M[0]).add(R).add(T),Q(I.x,I.y,I.z)):Q(st.x,st.y,0)}for(let $=1;$<=h;$++)for(let st=0;st<G;st++){const L=u?j(y[st],Nt[st],Jt):y[st];x?(R.copy(D.normals[$]).multiplyScalar(L.x),T.copy(D.binormals[$]).multiplyScalar(L.y),I.copy(M[$]).add(R).add(T),Q(I.x,I.y,I.z)):Q(L.x,L.y,d/h*$)}for(let $=m-1;$>=0;$--){const st=$/m,L=f*Math.cos(st*Math.PI/2),wt=p*Math.sin(st*Math.PI/2)+g;for(let nt=0,yt=z.length;nt<yt;nt++){const lt=j(z[nt],at[nt],wt);Q(lt.x,lt.y,d+L)}for(let nt=0,yt=A.length;nt<yt;nt++){const lt=A[nt];mt=ht[nt];for(let It=0,gt=lt.length;It<gt;It++){const w=j(lt[It],mt[It],wt);x?Q(w.x,w.y+M[h-1].y,M[h-1].x+L):Q(w.x,w.y,d+L)}}}N(),K();function N(){const $=s.length/3;if(u){let st=0,L=G*st;for(let wt=0;wt<J;wt++){const nt=F[wt];Pt(nt[2]+L,nt[1]+L,nt[0]+L)}st=h+m*2,L=G*st;for(let wt=0;wt<J;wt++){const nt=F[wt];Pt(nt[0]+L,nt[1]+L,nt[2]+L)}}else{for(let st=0;st<J;st++){const L=F[st];Pt(L[2],L[1],L[0])}for(let st=0;st<J;st++){const L=F[st];Pt(L[0]+G*h,L[1]+G*h,L[2]+G*h)}}n.addGroup($,s.length/3-$,0)}function K(){const $=s.length/3;let st=0;ut(z,st),st+=z.length;for(let L=0,wt=A.length;L<wt;L++){const nt=A[L];ut(nt,st),st+=nt.length}n.addGroup($,s.length/3-$,1)}function ut($,st){let L=$.length;for(;--L>=0;){const wt=L;let nt=L-1;nt<0&&(nt=$.length-1);for(let yt=0,lt=h+m*2;yt<lt;yt++){const It=G*yt,gt=G*(yt+1),w=st+wt+It,b=st+nt+It,U=st+nt+gt,q=st+wt+gt;Dt(w,b,U,q)}}}function Q($,st,L){l.push($),l.push(st),l.push(L)}function Pt($,st,L){At($),At(st),At(L);const wt=s.length/3,nt=_.generateTopUV(n,s,wt-3,wt-2,wt-1);qt(nt[0]),qt(nt[1]),qt(nt[2])}function Dt($,st,L,wt){At($),At(st),At(wt),At(st),At(L),At(wt);const nt=s.length/3,yt=_.generateSideWallUV(n,s,nt-6,nt-3,nt-2,nt-1);qt(yt[0]),qt(yt[1]),qt(yt[3]),qt(yt[1]),qt(yt[2]),qt(yt[3])}function At($){s.push(l[$*3+0]),s.push(l[$*3+1]),s.push(l[$*3+2])}function qt($){r.push($.x),r.push($.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return z0(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Fo[s.type]().fromJSON(s)),new fl(n,t.options)}}const B0={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ft(r,a),new ft(o,l),new ft(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],p=t[s*3+2],g=t[r*3],m=t[r*3+1],v=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ft(a,1-l),new ft(c,1-d),new ft(u,1-p),new ft(g,1-v)]:[new ft(o,1-l),new ft(h,1-d),new ft(f,1-p),new ft(m,1-v)]}};function z0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class pl extends Ce{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new P,u=new P,f=[],p=[],g=[],m=[];for(let v=0;v<=n;v++){const _=[],M=v/n;let x=0;v===0&&a===0?x=.5/e:v===n&&l===Math.PI&&(x=-.5/e);for(let D=0;D<=e;D++){const T=D/e;d.x=-t*Math.cos(s+T*r)*Math.sin(a+M*o),d.y=t*Math.cos(a+M*o),d.z=t*Math.sin(s+T*r)*Math.sin(a+M*o),p.push(d.x,d.y,d.z),u.copy(d).normalize(),g.push(u.x,u.y,u.z),m.push(T+x,1-M),_.push(c++)}h.push(_)}for(let v=0;v<n;v++)for(let _=0;_<e;_++){const M=h[v][_+1],x=h[v][_],D=h[v+1][_],T=h[v+1][_+1];(v!==0||a>0)&&f.push(M,x,T),(v!==n-1||l<Math.PI)&&f.push(x,D,T)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(g,3)),this.setAttribute("uv",new fe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pl(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class k0 extends Ce{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new P,r=new P;if(t.index!==null){const a=t.attributes.position,o=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let p=u,g=u+f;p<g;p+=3)for(let m=0;m<3;m++){const v=o.getX(p+m),_=o.getX(p+(m+1)%3);s.fromBufferAttribute(a,v),r.fromBufferAttribute(a,_),Ic(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,d=3*o+(c+1)%3;s.fromBufferAttribute(a,h),r.fromBufferAttribute(a,d),Ic(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new fe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Ic(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class Uc extends cs{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vh,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class du extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class V0 extends du{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ia=new se,Nc=new P,Fc=new P;class G0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ol,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Nc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Nc),Fc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Fc),e.updateMatrixWorld(),Ia.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ia),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ia)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class H0 extends G0{constructor(){super(new ll(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class W0 extends du{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new H0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class X0 extends Ce{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class zo extends o0{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const Oc=new se;class $0{constructor(t,e,n=0,s=1/0){this.ray=new sl(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new rl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Oc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Oc),this}intersectObject(t,e=!0,n=[]){return ko(t,this,n,e),n.sort(Bc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)ko(t[s],this,n,e);return n.sort(Bc),n}}function Bc(i,t){return i.distance-t.distance}function ko(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)ko(r[a],t,e,!0)}}const zc=new P,_r=new P;class j0{constructor(t=new P,e=new P){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){zc.subVectors(t,this.start),_r.subVectors(this.end,this.start);const n=_r.dot(_r);let r=_r.dot(zc)/n;return e&&(r=Te(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Jo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Jo);const kc=new Vn,xr=new P;class fu extends X0{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new fe(t,3)),this.setAttribute("uv",new fe(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new zo(e,6,1);return this.setAttribute("instanceStart",new ti(n,3,0)),this.setAttribute("instanceEnd",new ti(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new zo(e,6,1);return this.setAttribute("instanceColorStart",new ti(n,3,0)),this.setAttribute("instanceColorEnd",new ti(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new k0(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),kc.setFromBufferAttribute(e),this.boundingBox.union(kc))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ci),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)xr.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(xr)),xr.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(xr));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}ct.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ft(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Xe.line={uniforms:al.merge([ct.common,ct.fog,ct.line]),vertexShader:`
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
		`};class Vo extends zn{static get type(){return"LineMaterial"}constructor(t){super({uniforms:al.clone(Xe.line.uniforms),vertexShader:Xe.line.vertexShader,fragmentShader:Xe.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Ua=new le,Vc=new P,Gc=new P,Re=new le,Le=new le,gn=new le,Na=new P,Fa=new se,Ie=new j0,Hc=new P,Mr=new Vn,yr=new Ci,vn=new le;let xn,yi;function Wc(i,t,e){return vn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),vn.multiplyScalar(1/vn.w),vn.x=yi/e.width,vn.y=yi/e.height,vn.applyMatrix4(i.projectionMatrixInverse),vn.multiplyScalar(1/vn.w),Math.abs(Math.max(vn.x,vn.y))}function q0(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){Ie.start.fromBufferAttribute(s,o),Ie.end.fromBufferAttribute(r,o),Ie.applyMatrix4(e);const c=new P,h=new P;xn.distanceSqToSegment(Ie.start,Ie.end,h,c),h.distanceTo(c)<yi*.5&&t.push({point:h,pointOnLine:c,distance:xn.origin.distanceTo(h),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function Y0(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,h=Math.min(o.instanceCount,l.count),d=-t.near;xn.at(1,gn),gn.w=1,gn.applyMatrix4(t.matrixWorldInverse),gn.applyMatrix4(n),gn.multiplyScalar(1/gn.w),gn.x*=r.x/2,gn.y*=r.y/2,gn.z=0,Na.copy(gn),Fa.multiplyMatrices(t.matrixWorldInverse,a);for(let u=0,f=h;u<f;u++){if(Re.fromBufferAttribute(l,u),Le.fromBufferAttribute(c,u),Re.w=1,Le.w=1,Re.applyMatrix4(Fa),Le.applyMatrix4(Fa),Re.z>d&&Le.z>d)continue;if(Re.z>d){const M=Re.z-Le.z,x=(Re.z-d)/M;Re.lerp(Le,x)}else if(Le.z>d){const M=Le.z-Re.z,x=(Le.z-d)/M;Le.lerp(Re,x)}Re.applyMatrix4(n),Le.applyMatrix4(n),Re.multiplyScalar(1/Re.w),Le.multiplyScalar(1/Le.w),Re.x*=r.x/2,Re.y*=r.y/2,Le.x*=r.x/2,Le.y*=r.y/2,Ie.start.copy(Re),Ie.start.z=0,Ie.end.copy(Le),Ie.end.z=0;const g=Ie.closestPointToPointParameter(Na,!0);Ie.at(g,Hc);const m=fi.lerp(Re.z,Le.z,g),v=m>=-1&&m<=1,_=Na.distanceTo(Hc)<yi*.5;if(v&&_){Ie.start.fromBufferAttribute(l,u),Ie.end.fromBufferAttribute(c,u),Ie.start.applyMatrix4(a),Ie.end.applyMatrix4(a);const M=new P,x=new P;xn.distanceSqToSegment(Ie.start,Ie.end,x,M),e.push({point:x,pointOnLine:M,distance:xn.origin.distanceTo(x),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class J0 extends Ae{constructor(t=new fu,e=new Vo({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let a=0,o=0,l=e.count;a<l;a++,o+=2)Vc.fromBufferAttribute(e,a),Gc.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Vc.distanceTo(Gc);const r=new zo(s,2,1);return t.setAttribute("instanceDistanceStart",new ti(r,1,0)),t.setAttribute("instanceDistanceEnd",new ti(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;xn=t.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;yi=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),yr.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=yi*.5;else{const d=Math.max(s.near,yr.distanceToPoint(xn.origin));c=Wc(s,d,l.resolution)}if(yr.radius+=c,xn.intersectsSphere(yr)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Mr.copy(o.boundingBox).applyMatrix4(a);let h;if(n)h=yi*.5;else{const d=Math.max(s.near,Mr.distanceToPoint(xn.origin));h=Wc(s,d,l.resolution)}Mr.expandByScalar(h),xn.intersectsBox(Mr)!==!1&&(n?q0(this,e):Y0(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(Ua),this.material.uniforms.resolution.value.set(Ua.z,Ua.w))}}class Z0 extends ye{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ft(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}}const Wi=new P,Xc=new se,$c=new se,jc=new P,qc=new P;class K0{constructor(t={}){const e=this;let n,s,r,a;const o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:n,height:s}},this.render=function(p,g){p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld(),g.parent===null&&g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),Xc.copy(g.matrixWorldInverse),$c.multiplyMatrices(g.projectionMatrix,Xc),h(p,p,g),f(p)},this.setSize=function(p,g){n=p,s=g,r=n/2,a=s/2,l.style.width=p+"px",l.style.height=g+"px"};function c(p){p.isCSS2DObject&&(p.element.style.display="none");for(let g=0,m=p.children.length;g<m;g++)c(p.children[g])}function h(p,g,m){if(p.visible===!1){c(p);return}if(p.isCSS2DObject){Wi.setFromMatrixPosition(p.matrixWorld),Wi.applyMatrix4($c);const v=Wi.z>=-1&&Wi.z<=1&&p.layers.test(m.layers)===!0,_=p.element;_.style.display=v===!0?"":"none",v===!0&&(p.onBeforeRender(e,g,m),_.style.transform="translate("+-100*p.center.x+"%,"+-100*p.center.y+"%)translate("+(Wi.x*r+r)+"px,"+(-Wi.y*a+a)+"px)",_.parentNode!==l&&l.appendChild(_),p.onAfterRender(e,g,m));const M={distanceToCameraSquared:d(m,p)};o.objects.set(p,M)}for(let v=0,_=p.children.length;v<_;v++)h(p.children[v],g,m)}function d(p,g){return jc.setFromMatrixPosition(p.matrixWorld),qc.setFromMatrixPosition(g.matrixWorld),jc.distanceToSquared(qc)}function u(p){const g=[];return p.traverseVisible(function(m){m.isCSS2DObject&&g.push(m)}),g}function f(p){const g=u(p).sort(function(v,_){if(v.renderOrder!==_.renderOrder)return _.renderOrder-v.renderOrder;const M=o.objects.get(v).distanceToCameraSquared,x=o.objects.get(_).distanceToCameraSquared;return M-x}),m=g.length;for(let v=0,_=g.length;v<_;v++)g[v].element.style.zIndex=m-v}}}const pu={rect:["Depth d","Width b"],circle:["Diameter D"],pipe:["Outer diameter D","Wall thickness t"],I:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],box:["Depth d","Width b","Flange thick. tf","Web thick. tw"],unp:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],C:["Depth d","Flange width b","Lip length c","Thickness t"],general:["A","I33","I22","J"]},Gr=(i,t)=>i==="general"?t===0?"A":"L4":"L",Ps={rect:"Rectangle",circle:"Circle",pipe:"Pipe",I:"I / Wide flange",box:"Box / Tube",unp:"UNP / Channel",C:"C / Lipped channel",general:"General"};function Q0(i,t){const e=Math.max(i,t),n=Math.min(i,t);return e<=0?0:e*n**3*(1/3-.21*(n/e)*(1-n**4/(12*e**4)))}function mu(i){const t=i.dims;if(i.shape==="unp"){const[a,o,l,c]=t;return[[0,c,-a/2+l,a/2-l],[0,o,a/2-l,a/2],[0,o,-a/2,-a/2+l]]}const[e,n,s,r]=t;return[[0,r,-e/2,e/2],[r,n,e/2-r,e/2],[r,n,-e/2,-e/2+r],[n-r,n,e/2-s,e/2-r],[n-r,n,-e/2+r,-e/2+s]]}function gu(i){let t=0,e=0;for(const[o,l,c,h]of i){const d=(l-o)*(h-c);t+=d,e+=d*(o+l)/2}const n=t>0?e/t:0;let s=0,r=0,a=0;for(const[o,l,c,h]of i){const d=l-o,u=h-c,f=d*u,p=(c+h)/2,g=(o+l)/2-n;s+=d*u**3/12+f*p*p,r+=u*d**3/12+f*g*g,a+=Math.max(d,u)*Math.min(d,u)**3/3}return{A:t,I33:s,I22:r,J:a,xc:n}}function t_(i){return i.shape==="unp"||i.shape==="C"?gu(mu(i)).xc:0}function vu(i){if(i.shape!=="unp"&&i.shape!=="C")return null;const t=t_(i);let e;if(i.shape==="unp"){const[n,s,r,a]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[a,-n/2+r],[a,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}else{const[n,s,r,a]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[s-a,-n/2+r],[s-a,-n/2+a],[a,-n/2+a],[a,n/2-a],[s-a,n/2-a],[s-a,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}return e.map(([n,s])=>[n-t,s])}function wi(i){const t=i.dims;switch(i.shape){case"rect":{const[e,n]=t,s=n*e;return{A:s,I33:n*e**3/12,I22:e*n**3/12,J:Q0(e,n),As2:5/6*s,As3:5/6*s,depth:e,width:n}}case"circle":{const[e]=t,n=Math.PI*e**4/64,s=Math.PI*e*e/4;return{A:s,I33:n,I22:n,J:2*n,As2:.9*s,As3:.9*s,depth:e,width:e}}case"pipe":{const[e,n]=t,s=Math.max(e-2*n,0),r=Math.PI*(e**4-s**4)/64,a=Math.PI*(e*e-s*s)/4;return{A:a,I33:r,I22:r,J:2*r,As2:a/2,As3:a/2,depth:e,width:e}}case"I":{const[e,n,s,r]=t,a=e-2*s;return{A:2*n*s+a*r,I33:(n*e**3-(n-r)*a**3)/12,I22:2*s*n**3/12+a*r**3/12,J:(2*n*s**3+(e-s)*r**3)/3,As2:e*r,As3:5/3*n*s,depth:e,width:n}}case"box":{const[e,n,s,r]=t,a=e-2*s,o=n-2*r,l=n*r+e*s-r*r-s*s;return{A:n*e-o*a,I33:(n*e**3-o*a**3)/12,I22:(e*n**3-a*o**3)/12,J:l>0?2*r*s*(n-r)**2*(e-s)**2/l:0,As2:2*e*r,As3:2*n*s,depth:e,width:n}}case"unp":case"C":{const e=gu(mu(i)),[n,s]=i.shape==="unp"?[t[2],t[3]]:[t[3],t[3]];return{A:e.A,I33:e.I33,I22:e.I22,J:e.J,As2:t[0]*s,As3:5/3*t[1]*n,depth:t[0],width:t[1]}}case"general":{const[e,n,s,r]=t,a=Math.sqrt(Math.max(e,1e-6));return{A:e,I33:n,I22:s,J:r,As2:0,As3:0,depth:a,width:a}}}}function Yc(i){const t=pu[i.shape].length;if(i.dims.length<t)return"Missing dimensions";if(i.dims.slice(0,t).some(e=>!(e>0)))return"All dimensions must be positive";if(i.shape==="pipe"&&2*i.dims[1]>=i.dims[0])return"Wall too thick for diameter";if((i.shape==="I"||i.shape==="box")&&2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.shape==="I"&&i.dims[3]>=i.dims[1])return"Web thicker than flange width";if(i.shape==="box"&&2*i.dims[3]>=i.dims[1])return"Webs too thick for width";if(i.shape==="unp"){if(2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.dims[3]>=i.dims[1])return"Web thicker than flange width"}if(i.shape==="C"){const[e,n,s,r]=i.dims;if(2*r>=e)return"Thickness too large for depth";if(2*r>=n)return"Thickness too large for flange width";if(s<=r)return"Lip must be longer than the thickness";if(2*s>=e)return"Lips too long for depth"}return null}const Ds=(i,t)=>[i[0]-t[0],i[1]-t[1],i[2]-t[2]],Ur=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],Ss=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],zs=i=>Math.hypot(i[0],i[1],i[2]),ji=(i,t)=>[i[0]*t,i[1]*t,i[2]*t],Jc=(i,t)=>[i[0]+t[0],i[1]+t[1],i[2]+t[2]],Zc=i=>ji(i,1/zs(i));function Go(i,t,e){const n=Ds(t,i),s=zs(n),r=ji(n,1/s);let a,o;if(Math.hypot(n[0],n[1])<=1e-6*s?(a=[1,0,0],o=Zc(Ss(r,a)),a=Ss(o,r)):(o=Zc(Ss(r,[0,0,1])),a=Ss(o,r)),e){const l=e*Math.PI/180,c=Math.cos(l),h=Math.sin(l),d=Jc(ji(a,c),ji(o,h)),u=Jc(ji(a,-h),ji(o,c));a=d,o=u}return[r,a,o]}function Hr(i,t,e,n,s){return n>0&&t>0?12*i*e/(t*n*s*s):0}function e_(i,t,e,n,s,r,a,o=0,l=0){const c=new Float64Array(144),h=(v,_,M)=>{c[v*12+_]=M,c[_*12+v]=M},d=i*e/a;h(0,0,d),h(0,6,-d),h(6,6,d);const u=t*r/a;h(3,3,u),h(3,9,-u),h(9,9,u);const f=Hr(i,t,s,o,a),p=i*s/(a**3*(1+f));h(1,1,12*p),h(1,5,6*p*a),h(1,7,-12*p),h(1,11,6*p*a),h(5,5,(4+f)*p*a*a),h(5,7,-6*p*a),h(5,11,(2-f)*p*a*a),h(7,7,12*p),h(7,11,-6*p*a),h(11,11,(4+f)*p*a*a);const g=Hr(i,t,n,l,a),m=i*n/(a**3*(1+g));return h(2,2,12*m),h(2,4,-6*m*a),h(2,8,-12*m),h(2,10,-6*m*a),h(4,4,(4+g)*m*a*a),h(4,8,6*m*a),h(4,10,(2-g)*m*a*a),h(8,8,12*m),h(8,10,6*m*a),h(10,10,(4+g)*m*a*a),c}function n_(i){return[...i[0],...i[1],...i[2]]}function i_(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s*3]*t[n*3]+i[s*3+1]*t[n*3+1]+i[s*3+2]*t[n*3+2];return e}function Kc(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s]*t[n*3]+i[3+s]*t[n*3+1]+i[6+s]*t[n*3+2];return e}function s_(i,t){const e=new Float64Array(144);for(let r=0;r<4;r++)for(let a=0;a<3;a++)for(let o=0;o<3;o++)e[(r*3+a)*12+r*3+o]=t[a*3+o];const n=new Float64Array(144);for(let r=0;r<12;r++)for(let a=0;a<12;a++){let o=0;for(let l=0;l<12;l++)o+=i[r*12+l]*e[l*12+a];n[r*12+a]=o}const s=new Float64Array(144);for(let r=0;r<12;r++)for(let a=0;a<12;a++){let o=0;for(let l=0;l<12;l++)o+=e[l*12+r]*n[l*12+a];s[r*12+a]=o}return s}function Qc(i,t,e,n,s=0,r=0){const a=e-t;n[0]+=-i[0]*a/e,n[6]+=-i[0]*t/e;const o=h=>{const d=e*e*(1+h),u=t*a*(a+h*e/2)/d,f=t*a*(t+h*e/2)/d;return{mi:u,mj:f,vi:a/e+(u-f)/e,vj:t/e-(u-f)/e}},l=o(s);n[1]+=-i[1]*l.vi,n[5]+=-i[1]*l.mi,n[7]+=-i[1]*l.vj,n[11]+=i[1]*l.mj;const c=o(r);n[2]+=-i[2]*c.vi,n[4]+=i[2]*c.mi,n[8]+=-i[2]*c.vj,n[10]+=-i[2]*c.mj}const _u=[{x:-Math.sqrt(3/5),w:5/9},{x:0,w:8/9},{x:Math.sqrt(3/5),w:5/9}];function r_(i,t){var r;const e=i.length;if(e===0)return[];const n=((r=t[0])==null?void 0:r.length)??0,s=Array.from({length:e},(a,o)=>[...i[o],...t[o]]);for(let a=0;a<e;a++){let o=a,l=Math.abs(s[a][a]);for(let h=a+1;h<e;h++){const d=Math.abs(s[h][a]);d>l&&(l=d,o=h)}if(l<1e-12)return null;if(o!==a){const h=s[a];s[a]=s[o],s[o]=h}const c=s[a][a];for(let h=a;h<e+n;h++)s[a][h]/=c;for(let h=0;h<e;h++){if(h===a)continue;const d=s[h][a];if(!(Math.abs(d)<1e-18))for(let u=a;u<e+n;u++)s[h][u]-=d*s[a][u]}}return s.map(a=>a.slice(e))}function a_(i,t,e){const n=[],s=[];for(let g=0;g<6;g++)t&&t[g]?n.push(g):s.push(g);for(let g=0;g<6;g++)e&&e[g]?n.push(6+g):s.push(6+g);if(n.length===0)return{retained:s,released:n,W:[],invKee:[],klCondensed:new Float64Array(i)};if(s.length===0)return null;const r=n.length,a=s.length,o=Array.from({length:r},(g,m)=>Array.from({length:r},(v,_)=>i[n[m]*12+n[_]])),l=Array.from({length:r},(g,m)=>Array.from({length:a},(v,_)=>i[n[m]*12+s[_]])),c=Array.from({length:r},(g,m)=>Array.from({length:r},(v,_)=>m===_?1:0)),h=l.map((g,m)=>[...g,...c[m]]),d=r_(o,h);if(!d)return null;const u=d.map(g=>g.slice(0,a)),f=d.map(g=>g.slice(a)),p=new Float64Array(144);for(let g=0;g<a;g++){const m=s[g];for(let v=0;v<a;v++){const _=s[v];let M=0;for(let x=0;x<r;x++)M+=l[x][g]*u[x][v];p[m*12+_]=i[m*12+_]-M}}for(let g=0;g<a;g++){const m=s[g];for(let v=g+1;v<a;v++){const _=s[v],M=.5*(p[m*12+_]+p[_*12+m]);p[m*12+_]=M,p[_*12+m]=M}}return{retained:s,released:n,W:u,invKee:f,klCondensed:p}}function o_(i,t){if(t.released.length===0)return new Float64Array(i);const e=t.released.length,n=t.retained.length,s=new Array(e);for(let a=0;a<e;a++)s[a]=i[t.released[a]];const r=new Float64Array(12);for(let a=0;a<n;a++){const o=t.retained[a];let l=0;for(let c=0;c<e;c++)l+=t.W[c][a]*s[c];r[o]=i[o]-l}return r}function l_(i,t,e){if(e.released.length===0)return new Float64Array(i);const n=e.released.length,s=e.retained.length,r=new Array(s);for(let c=0;c<s;c++)r[c]=i[e.retained[c]];const a=new Array(n);for(let c=0;c<n;c++)a[c]=t[e.released[c]];const o=new Array(n);for(let c=0;c<n;c++){let h=0;for(let u=0;u<n;u++)h+=e.invKee[c][u]*a[u];let d=0;for(let u=0;u<s;u++)d+=e.W[c][u]*r[u];o[c]=-h-d}const l=new Float64Array(12);for(let c=0;c<s;c++)l[e.retained[c]]=r[c];for(let c=0;c<n;c++)l[e.released[c]]=o[c];return l}const th=9.80665,Oa=.0044482216152605,rs=[{id:"kN-m",label:"kN, m",force:"kN",length:"m",kF:1,kL:1,small:"mm",kSmall:.001},{id:"N-mm",label:"N, mm",force:"N",length:"mm",kF:.001,kL:.001,small:"mm",kSmall:.001},{id:"tonf-m",label:"ton, m",force:"tonf",length:"m",kF:th,kL:1,small:"mm",kSmall:.001},{id:"kgf-mm",label:"kg, mm",force:"kgf",length:"mm",kF:th/1e3,kL:.001,small:"mm",kSmall:.001},{id:"kip-ft",label:"kip, ft",force:"kip",length:"ft",kF:Oa*1e3,kL:.3048,small:"in",kSmall:.0254},{id:"kip-in",label:"kip, in",force:"kip",length:"in",kF:Oa*1e3,kL:.0254,small:"in",kSmall:.0254},{id:"lb-in",label:"lb, in",force:"lb",length:"in",kF:Oa,kL:.0254,small:"in",kSmall:.0254}],Ho=rs[0],c_={L:[0,1],F:[1,0],M:[1,1],FL:[1,-1],FA:[1,-2],FV:[1,-3],A:[0,2],L4:[0,4]},xu="structapp3d.units";function Mu(i){return rs.find(t=>t.id===i)}function h_(){var i;try{return Mu((i=globalThis.localStorage)==null?void 0:i.getItem(xu))??Ho}catch{return Ho}}let Ai=h_();const Wo=new Set,ln=()=>Ai;function eh(i){var e;const t=Mu(i);if(!(!t||t===Ai)){Ai=t;try{(e=globalThis.localStorage)==null||e.setItem(xu,i)}catch{}for(const n of Wo)n(t)}}function u_(i){return Wo.add(i),()=>Wo.delete(i)}function yu(i,t=Ai){const[e,n]=c_[i];return t.kF**e*t.kL**n}const ml=(i,t,e=Ai)=>i/yu(t,e),Su=(i,t,e=Ai)=>i*yu(t,e),d_={2:"²",3:"³",4:"⁴"};function jt(i,t=Ai,e=!1){const n=t.force,s=t.length,r=a=>e?String(a):d_[a];switch(i){case"L":return s;case"F":return n;case"M":return`${n}${e?"-":"·"}${s}`;case"FL":return`${n}/${s}`;case"FA":return`${n}/${s}${r(2)}`;case"FV":return`${n}/${s}${r(3)}`;case"A":return`${s}${r(2)}`;case"L4":return`${s}${r(4)}`}}function kn(i,t=4){if(!Number.isFinite(i))return"—";if(Math.abs(i)<1e-12)return"0";const e=Math.abs(i);return e>=1e5||e<.001?i.toExponential(t-1):String(Number(i.toPrecision(t)))}const $t=(i,t,e=4)=>kn(ml(i,t),e),Me=(i,t,e=4)=>`${$t(i,t,e)} ${jt(t)}`,f_=(i,t)=>Number(ml(i,t).toPrecision(10)),Ue=(i,t)=>`${i}:${t}`;function Is(i){const[t,e]=i.split(":");return{kind:t,id:Number(e)}}const Xo=["P","V2","V3","T","M2","M3"],bu={bg:988970,grid:1976635,gridMajor:3359061,joint:3718648,frame:14870768,area:2278750,sel:16096779,load:16007006,support:2278750,reaction:11032055,pos:3900150,neg:15680580,deformed:16436245,ghost:4674921},p_={bg:16317180,grid:14870768,gridMajor:13358561,joint:165063,frame:1976635,area:1483594,sel:15357964,load:14753096,support:1409085,reaction:8266446,pos:2450411,neg:14427686,deformed:13273604,ghost:9741240},nh=[9741240,6333946,16020150,3462041,16498468,10980346,16486972,3003583],Qt=i=>Array.isArray(i)?new P(i[0],i[1],i[2]):new P(i.x,i.y,i.z),Sr=i=>[i.x,i.y,i.z];function ih(i,t){switch(i){case"GX":return new P(1,0,0);case"GY":return new P(0,1,0);case"GZ":return new P(0,0,1);case"GRAV":return new P(0,0,-1);case"L1":return Qt(t[0]);case"L2":return Qt(t[1]);case"L3":return Qt(t[2])}}function m_(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d");t.beginPath(),t.arc(32,32,28,0,Math.PI*2),t.fillStyle="#fff",t.fill(),t.lineWidth=6,t.strokeStyle="rgba(0,0,0,0.55)",t.stroke();const e=new su(i);return e.colorSpace=We,e}function g_(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d");t.beginPath(),t.arc(32,32,20,0,Math.PI*2),t.fillStyle="rgba(15, 23, 42, 0.9)",t.fill(),t.lineWidth=8,t.strokeStyle="#38bdf8",t.stroke();const e=new su(i);return e.colorSpace=We,e}function v_(i){const t=i.dims,e=(n,s,r)=>{r.moveTo(-n/2,-s/2),r.lineTo(n/2,-s/2),r.lineTo(n/2,s/2),r.lineTo(-n/2,s/2),r.closePath()};switch(i.shape){case"rect":{const n=new Zn;return e(t[1],t[0],n),n}case"circle":{const n=new Zn;return n.absarc(0,0,t[0]/2,0,Math.PI*2,!1),n}case"pipe":{const n=new Zn;n.absarc(0,0,t[0]/2,0,Math.PI*2,!1);const s=new Vr;return s.absarc(0,0,t[0]/2-t[1],0,Math.PI*2,!0),n.holes.push(s),n}case"box":{const n=new Zn;e(t[1],t[0],n);const s=new Vr;return e(t[1]-2*t[3],t[0]-2*t[2],s),n.holes.push(s),n}case"I":{const[n,s,r,a]=t,o=new Zn,l=[[-s/2,-n/2],[s/2,-n/2],[s/2,-n/2+r],[a/2,-n/2+r],[a/2,n/2-r],[s/2,n/2-r],[s/2,n/2],[-s/2,n/2],[-s/2,n/2-r],[-a/2,n/2-r],[-a/2,-n/2+r],[-s/2,-n/2+r]];o.moveTo(...l[0]);for(const c of l.slice(1))o.lineTo(...c);return o.closePath(),o}case"unp":case"C":{const n=vu(i),s=new Zn;s.moveTo(...n[0]);for(const r of n.slice(1))s.lineTo(...r);return s.closePath(),s}case"general":{const n=wi(i),s=new Zn;return e(n.width,n.depth,s),s}}}class __{constructor(t){it(this,"renderer");it(this,"labels");it(this,"scene",new a0);it(this,"persp",new Qe(45,1,.01,1e5));it(this,"ortho",new ll(-1,1,1,-1,.001,1e6));it(this,"camera",this.persp);it(this,"useOrtho",!1);it(this,"target",new P);it(this,"azimuth",-Math.PI/3);it(this,"elevation",Math.PI/6);it(this,"distance",20);it(this,"theme",bu);it(this,"width",1);it(this,"height",1);it(this,"lineMats",[]);it(this,"gridGroup",new _n);it(this,"modelGroup",new _n);it(this,"resultGroup",new _n);it(this,"overlayGroup",new _n);it(this,"jointTex",m_());it(this,"hingeTex",g_());it(this,"renderQueued",!1);it(this,"animStart",0);it(this,"deformed",null);it(this,"data",null);it(this,"selection",new Set);it(this,"results",null);it(this,"display",{jointLabels:!1,frameLabels:!1,areaLabels:!1,showLoads:!0,loadValues:!0,extruded:!1,showSupports:!0});it(this,"resultOpts",{view:"none",deformScale:1,forceScale:1,animate:!1,showValues:!0});it(this,"autoDeformScale",1);it(this,"span",10);it(this,"overlayObjs",[]);this.host=t,this.renderer=new r0({antialias:!0,alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.domElement.className="viewport-canvas",t.appendChild(this.renderer.domElement),this.labels=new K0,this.labels.domElement.className="viewport-labels",t.appendChild(this.labels.domElement),this.persp.up.set(0,0,1),this.ortho.up.set(0,0,1),this.scene.add(new V0(16777215,3359061,1.6));const e=new W0(16777215,1.4);e.position.set(1,-2,3),this.scene.add(e),this.scene.add(this.gridGroup,this.modelGroup,this.resultGroup,this.overlayGroup),new ResizeObserver(()=>this.resize()).observe(t),this.resize()}get canvas(){return this.renderer.domElement}setTheme(t){this.theme=t,this.rebuildAll()}resize(){const t=this.host.getBoundingClientRect();this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer.setSize(this.width,this.height),this.labels.setSize(this.width,this.height);for(const e of this.lineMats)e.resolution.set(this.width,this.height);this.updateCamera()}viewDir(){const t=Math.cos(this.elevation);return new P(t*Math.cos(this.azimuth),t*Math.sin(this.azimuth),Math.sin(this.elevation))}updateCamera(){const t=this.viewDir(),e=this.width/this.height,n=this.distance*Math.tan(fi.degToRad(this.persp.fov/2));this.persp.aspect=e,this.persp.near=Math.max(this.distance/2e3,1e-4),this.persp.far=this.distance*50+this.span*20,this.persp.position.copy(this.target).addScaledVector(t,this.distance),this.persp.lookAt(this.target),this.persp.updateProjectionMatrix();const s=this.distance+this.span*10;this.ortho.left=-n*e,this.ortho.right=n*e,this.ortho.top=n,this.ortho.bottom=-n,this.ortho.near=.001,this.ortho.far=s*2+this.span*10,this.ortho.position.copy(this.target).addScaledVector(t,s),this.ortho.lookAt(this.target),this.ortho.updateProjectionMatrix(),this.camera=this.useOrtho?this.ortho:this.persp,this.requestRender()}setOrtho(t){this.useOrtho=t,this.updateCamera()}orbit(t,e){this.azimuth-=t*.008,this.elevation=fi.clamp(this.elevation+e*.008,-Math.PI/2+.002,Math.PI/2-.002),this.updateCamera()}worldPerPixel(){return 2*this.distance*Math.tan(fi.degToRad(this.persp.fov/2))/this.height}pan(t,e){const n=this.worldPerPixel(),s=this.camera;s.updateMatrixWorld();const r=new P().setFromMatrixColumn(s.matrixWorld,0),a=new P().setFromMatrixColumn(s.matrixWorld,1);this.target.addScaledVector(r,-t*n).addScaledVector(a,e*n),this.updateCamera()}zoom(t,e,n){t=fi.clamp(t,.2,5);const s=fi.clamp(this.distance*t,this.span*.001+.001,this.span*200+100);if(t=s/this.distance,e!==void 0&&n!==void 0){const r=this.pointOnTargetPlane(e,n);r&&this.target.add(r.sub(this.target).multiplyScalar(1-t))}this.distance=s,this.updateCamera()}ndc(t,e){const n=this.canvas.getBoundingClientRect();return new ft((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1)}ray(t,e){const n=new $0;return n.setFromCamera(this.ndc(t,e),this.camera),n.ray}pointOnTargetPlane(t,e){const n=new In().setFromNormalAndCoplanarPoint(this.viewDir(),this.target);return this.ray(t,e).intersectPlane(n,new P)}workPlanePoint(t,e,n){if(!this.data)return null;const{workPlane:s}=this.data.settings,r=n??this.data.settings.elevation,a=s==="XY"?new P(0,0,1):s==="XZ"?new P(0,1,0):new P(1,0,0),o=new In(a,-r),l=this.ray(t,e);return Math.abs(l.direction.dot(a))<1e-4?null:l.intersectPlane(o,new P)}toScreen(t){const e=this.canvas.getBoundingClientRect(),n=t.clone().project(this.camera);return{x:e.left+(n.x+1)/2*e.width,y:e.top+(1-n.y)/2*e.height,behind:n.z>1||n.z<-1}}bounds(){const t=new Vn;if(this.data&&this.data.joints.length)for(const e of this.data.joints)t.expandByPoint(Qt(e));else{const e=this.data?this.data.settings.gridSpacing*Math.min(this.data.settings.gridLines,5):5;t.set(new P(-e,-e,0),new P(e,e,0))}return t}fit(){const e=this.bounds().getBoundingSphere(new Ci),n=Math.max(e.radius,1);this.target.copy(e.center);const s=fi.degToRad(this.persp.fov/2),r=this.width/this.height,a=n/Math.sin(s),o=n/Math.sin(Math.atan(Math.tan(s)*r));this.distance=Math.max(a,o)*1.08,this.updateCamera()}viewPreset(t){const e={top:[-Math.PI/2,Math.PI/2-.002],front:[-Math.PI/2,0],side:[0,0],iso:[-Math.PI/3,Math.PI/6]};[this.azimuth,this.elevation]=e[t],this.fit()}requestRender(){this.renderQueued||(this.renderQueued=!0,requestAnimationFrame(t=>{if(this.renderQueued=!1,this.resultOpts.animate&&this.deformed){const e=Math.sin((t-this.animStart)/1400*Math.PI*2);this.applyDeformation(e),this.requestRender()}this.renderer.render(this.scene,this.camera),this.labels.render(this.scene,this.camera)}))}clearGroup(t){const e=[...t.children];for(const n of e)t.remove(n),n.traverse(s=>{var o;const r=s;(o=r.geometry)==null||o.dispose();const a=r.material;if(a)for(const l of Array.isArray(a)?a:[a])l!==void 0&&(l instanceof Vo&&(this.lineMats=this.lineMats.filter(c=>c!==l)),l.dispose())})}lineMat(t,e,n={}){const s=new Vo({color:t??16777215,linewidth:e,vertexColors:t===null,transparent:(n.opacity??1)<1,opacity:n.opacity??1,dashed:n.dashed??!1,dashSize:this.span*.02,gapSize:this.span*.015});return s.resolution.set(this.width,this.height),this.lineMats.push(s),s}lines(t,e,n,s,r){const a=new fu;a.setPositions(t),s&&a.setColors(s);const o=new J0(a,this.lineMat(e,n,r));return r!=null&&r.dashed&&o.computeLineDistances(),o}label(t,e,n=""){const s=document.createElement("div");s.className="lbl "+n,s.textContent=t;const r=new Z0(s);return r.position.copy(e),r}setData(t,e,n){this.data=t,this.selection=e,this.results=n,this.rebuildAll()}rebuildAll(){if(!this.data)return;this.scene.background=new Xt(this.theme.bg);const t=this.bounds();this.span=Math.max(t.getSize(new P).length(),this.data.settings.gridSpacing*2,.001),this.computeAutoScales(),this.buildGrid(),this.buildModel(),this.buildResults(),this.requestRender()}glyph(){return this.span*.035}buildGrid(){this.clearGroup(this.gridGroup);const t=this.data,{gridSpacing:e,gridLines:n,workPlane:s,elevation:r}=t.settings,a=[],o=[],l=e*n,c=(u,f)=>s==="XY"?[u,f,r]:s==="XZ"?[u,r,f]:[r,u,f];for(let u=-n;u<=n;u++)(u===0?o:a).push(...c(u*e,-l),...c(u*e,l),...c(-l,u*e),...c(l,u*e));this.gridGroup.add(this.lines(a,this.theme.grid,1)),this.gridGroup.add(this.lines(o,this.theme.gridMajor,1.5));const h=Math.max(e,this.span*.08),d=this.lines([0,0,0,h,0,0,0,0,0,0,h,0,0,0,0,0,0,h],null,3,[1,.25,.25,1,.25,.25,.3,.85,.3,.3,.85,.3,.3,.5,1,.3,.5,1]);this.gridGroup.add(d),this.gridGroup.add(this.label("X",new P(h*1.15,0,0),"axis x")),this.gridGroup.add(this.label("Y",new P(0,h*1.15,0),"axis y")),this.gridGroup.add(this.label("Z",new P(0,0,h*1.15),"axis z"))}buildModel(){this.clearGroup(this.modelGroup);const t=this.data,e=this.theme,n=this.selection,s=new Map(t.joints.map(h=>[h.id,h])),r=this.results&&this.resultOpts.view!=="none"&&this.resultOpts.view!=="reactions",a=new Xt(e.sel);for(const h of t.areas){const d=h.joints.map(m=>s.get(m)).filter(Boolean).map(m=>Qt(m));if(d.length<3)continue;const u=[];for(let m=1;m<d.length-1;m++)u.push(...d[0].toArray(),...d[m].toArray(),...d[m+1].toArray());const f=new Ce;f.setAttribute("position",new fe(u,3));const p=n.has(Ue("a",h.id)),g=new Ae(f,new As({color:p?e.sel:e.area,transparent:!0,opacity:r?.08:p?.45:.22,side:cn,depthWrite:!1}));if(g.renderOrder=-1,this.modelGroup.add(g),this.display.areaLabels){const m=d.reduce((v,_)=>v.add(_),new P).multiplyScalar(1/d.length);this.modelGroup.add(this.label("A"+h.id,m,"area"))}}const o=[],l=[],c=new Xt(r?e.ghost:e.frame);for(const h of t.frames){const d=s.get(h.i),u=s.get(h.j);if(!d||!u)continue;o.push(d.x,d.y,d.z,u.x,u.y,u.z);const f=n.has(Ue("f",h.id))?a:c;l.push(f.r,f.g,f.b,f.r,f.g,f.b),this.display.frameLabels&&this.modelGroup.add(this.label("F"+h.id,Qt(d).add(Qt(u)).multiplyScalar(.5),"frame"))}if(o.length&&(this.display.extruded&&!r?this.buildExtruded(t,s):this.modelGroup.add(this.lines(o,null,3,l)),this.display.extruded&&r&&this.modelGroup.add(this.lines(o,null,2,l)),this.display.extruded&&!r)){const h=[];for(const d of t.frames){if(!n.has(Ue("f",d.id)))continue;const u=s.get(d.i),f=s.get(d.j);h.push(u.x,u.y,u.z,f.x,f.y,f.z)}h.length&&this.modelGroup.add(this.lines(h,e.sel,4))}if(!r){const h=[];for(const d of t.frames){const u=s.get(d.i),f=s.get(d.j);if(!u||!f)continue;const p=f.x-u.x,g=f.y-u.y,m=f.z-u.z,v=Math.hypot(p,g,m);if(v<=1e-6)continue;const _=Math.min(.08,.3/v);d.relI&&d.relI.some(Boolean)&&h.push(u.x+p*_,u.y+g*_,u.z+m*_),d.relJ&&d.relJ.some(Boolean)&&h.push(f.x-p*_,f.y-g*_,f.z-m*_)}if(h.length){const d=new Ce;d.setAttribute("position",new fe(h,3));const u=new Ra(d,new Ir({size:11,sizeAttenuation:!1,map:this.hingeTex,transparent:!0,alphaTest:.1,depthTest:!1}));this.modelGroup.add(u)}}if(t.joints.length){const h=[],d=[],u=new Xt(e.joint);for(const g of t.joints){h.push(g.x,g.y,g.z);const m=n.has(Ue("j",g.id))?a:u;if(d.push(m.r,m.g,m.b),this.display.jointLabels){const v=this.label(String(g.id),Qt(g),"joint");this.modelGroup.add(v)}}const f=new Ce;f.setAttribute("position",new fe(h,3)),f.setAttribute("color",new fe(d,3));const p=new Ra(f,new Ir({size:13,sizeAttenuation:!1,map:this.jointTex,vertexColors:!0,alphaTest:.5,transparent:!0,depthTest:!1}));p.renderOrder=10,this.modelGroup.add(p)}this.display.showSupports&&this.buildSupports(t),this.display.showLoads&&!(this.results&&this.resultOpts.view!=="none")&&this.buildLoads(t,s)}buildExtruded(t,e){const n=new Map(t.sections.map((a,o)=>[a.name,o])),s=new Map,r=(a,o)=>{let l=s.get(a);return l||(l=new Uc({color:o,roughness:.6,metalness:.1}),s.set(a,l)),l};for(const a of t.frames){const o=e.get(a.i),l=e.get(a.j),c=t.sections.find(_=>_.name===a.section);if(!o||!l||!c)continue;const h=v_(c);if(!h)continue;const d=Math.hypot(l.x-o.x,l.y-o.y,l.z-o.z),u=new fl(h,{depth:d,bevelEnabled:!1,curveSegments:16}),f=Go(Sr(o),Sr(l),a.beta),g=this.selection.has(Ue("f",a.id))?this.theme.sel:nh[(n.get(c.name)??0)%nh.length],m=new Ae(u,r(String(g),g)),v=new se().makeBasis(Qt(f[2]).negate(),Qt(f[1]),Qt(f[0]));v.setPosition(o.x,o.y,o.z),m.applyMatrix4(v),this.modelGroup.add(m)}}arrow(t,e,n,s=2,r=!1){const a=new _n,o=e.clone().sub(t),l=o.length();if(l<1e-12)return a;o.normalize();const c=Math.min(l*.35,this.glyph()*.6),h=c*.35,d=e.clone().addScaledVector(o,-c*(r?1.6:.9));a.add(this.lines([...t.toArray(),...d.toArray()],n,s));const u=new As({color:n}),f=r?[e,e.clone().addScaledVector(o,-c*.8)]:[e];for(const p of f){const g=new Ae(new Rs(h,c,12),u.clone());g.position.copy(p).addScaledVector(o,-c/2),g.quaternion.setFromUnitVectors(new P(0,1,0),o),a.add(g)}return u.dispose(),a}buildSupports(t){const e=this.glyph(),n=this.theme.support;for(const s of t.joints){if(!s.r.some(Boolean))continue;const r=s.r[0]&&s.r[1]&&s.r[2],a=s.r[3]&&s.r[4]&&s.r[5],o=Qt(s),l=new Uc({color:n,roughness:.7});let c;if(r&&a)c=new Ae(new hs(e*1.6,e*1.6,e*.5),l),c.position.copy(o).add(new P(0,0,-e*.25));else if(r){const h=new Ae(new Rs(e*.7,e*1.1,4),l);h.rotation.x=Math.PI/2,h.position.copy(o).add(new P(0,0,-e*.55)),c=h}else{const h=new _n,d=new Ae(new Rs(e*.55,e*.8,4),l);d.rotation.x=Math.PI/2,d.position.set(0,0,-e*.4);const u=new Ae(new pl(e*.22,12,8),l);u.position.set(0,0,-e*1),h.add(d,u),h.position.copy(o),c=h}this.modelGroup.add(c)}}buildLoads(t,e){const n=this.glyph(),s=this.theme.load,r=n*3,a=this.display.loadValues,o=new Map,l=new Map;for(const _ of t.jointLoads){const M=e.get(_.joint);if(!M)continue;const x=Qt(M),D=_.case?`${_.case}: `:"",T=new P(_.f[0],_.f[1],_.f[2]);if(T.lengthSq()>0){const I=T.clone().normalize();this.modelGroup.add(this.arrow(x.clone().addScaledVector(I,-r),x,s,2.5));let S=o.get(_.joint);S||(S={p:x,dir:I,lines:[]},o.set(_.joint,S)),S.lines.push(`${D}${Me(T.length(),"F")}`)}const R=new P(_.f[3],_.f[4],_.f[5]);if(R.lengthSq()>0){const I=R.clone().normalize();this.modelGroup.add(this.arrow(x,x.clone().addScaledVector(I,r*.9),s,2.5,!0));let S=l.get(_.joint);S||(S={p:x,dir:I,lines:[]},l.set(_.joint,S)),S.lines.push(`${D}${Me(R.length(),"M")}`)}}if(a){for(const _ of o.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.p.clone().addScaledVector(_.dir,-r*1.1),"load"));for(const _ of l.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.p.clone().addScaledVector(_.dir,r),"load"))}const c=new Map(t.frames.map(_=>[_.id,_])),h=_=>{const M=e.get(_.i),x=e.get(_.j);return{a:Qt(M),b:Qt(x),ax:Go(Sr(M),Sr(x),_.beta)}},d=new Map;for(const _ of t.framePointLoads){const M=c.get(_.frame);if(!M||!e.has(M.i)||!e.has(M.j))continue;const{a:x,b:D,ax:T}=h(M),R=x.clone().lerp(D,_.rd),I=ih(_.dir,T).multiplyScalar(Math.sign(_.P)||1);this.modelGroup.add(this.arrow(R.clone().addScaledVector(I,-r),R,s,2.5));const S=`${M.id}_${Math.round(_.rd*1e3)}`;let y=d.get(S);y||(y={p:R,dir:I,lines:[]},d.set(S,y));const A=_.case?`${_.case}: `:"";y.lines.push(`${A}${Me(Math.abs(_.P),"F")}`)}if(a)for(const _ of d.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.p.clone().addScaledVector(_.dir,-r*1.1),"load"));const u=16486972,f=new Map,p=new Map;for(const _ of t.frameUniformLoads){const M=c.get(_.frame);if(!M||!e.has(M.i)||!e.has(M.j))continue;const{a:x,b:D,ax:T}=h(M),R=p.get(M.id)??0;p.set(M.id,R+1);const I=ih(_.dir,T).multiplyScalar(Math.sign(_.w)||1),S=r*.7*(1+R*.25),y=6,A=[];for(let z=0;z<=y;z++){const j=x.clone().lerp(D,z/y),G=j.clone().addScaledVector(I,-S);A.push(...G.toArray()),z>0&&z<y&&A.push(...G.toArray()),this.modelGroup.add(this.arrow(G,j,u,1.5))}this.modelGroup.add(this.lines(A,u,2));let V=f.get(M.id);V||(V={mid:x.clone().lerp(D,.5).addScaledVector(I,-r*.7*1.15),lines:[]},f.set(M.id,V));const F=_.case?`${_.case}: `:"";V.lines.push(`${F}${Me(Math.abs(_.w),"FL")}`)}if(a)for(const _ of f.values())this.modelGroup.add(this.label(_.lines.join(`
`),_.mid,"load uload"));const g=new Map(t.areas.map(_=>[_.id,_])),m=new Map,v=new Set;for(const _ of t.areaLoads){const M=g.get(_.area);if(!M)continue;const x=M.joints.map(S=>e.get(S)).filter(Boolean).map(S=>Qt(S));if(x.length<3)continue;const D=x.reduce((S,y)=>S.add(y),new P).multiplyScalar(1/x.length),T=new P(0,0,Math.sign(_.q)>=0?-1:1);if(!v.has(M.id)){v.add(M.id);const S=[D,...x.map(y=>y.clone().lerp(D,.45))];for(const y of S)this.modelGroup.add(this.arrow(y.clone().addScaledVector(T,-r*.8),y,1357990,1.5))}let R=m.get(M.id);R||(R={c:D,dir:T,lines:[]},m.set(M.id,R));const I=_.case?`${_.case}: `:"";R.lines.push(`${I}${Me(Math.abs(_.q),"FA")}`)}if(a)for(const _ of m.values()){const M=_.c.clone().addScaledVector(_.dir,-r*.95);this.modelGroup.add(this.label(_.lines.join(`
`),M,"load aload"))}}computeAutoScales(){const t=this.results;this.autoDeformScale=t&&t.stats.maxDisp>1e-15?this.span*.08/t.stats.maxDisp:1}setResults(t){this.results=t,this.computeAutoScales()}setResultOptions(t){const e=this.resultOpts.view;Object.assign(this.resultOpts,t),t.animate&&(this.animStart=performance.now()),e!==this.resultOpts.view&&this.buildModel(),!this.resultOpts.animate&&this.deformed&&this.applyDeformation(1),this.buildResults(),this.requestRender()}applyDeformation(t){const e=this.deformed,n=e.geo.attributes.instanceStart,s=n.data.array;for(let r=0;r<s.length;r++)s[r]=e.base[r]+e.delta[r]*t;n.data.needsUpdate=!0,e.geo.computeBoundingSphere()}buildResults(){this.clearGroup(this.resultGroup),this.deformed=null;const t=this.results,e=this.data;if(!t||!e)return;const n=this.resultOpts.view;n==="deformed"?this.buildDeformed(t,e):Xo.includes(n)&&this.buildDiagram(t,n),(n==="reactions"||n==="deformed"||Xo.includes(n))&&n==="reactions"&&this.buildReactions(t,e)}buildDeformed(t,e){const n=this.resultOpts.deformScale,s=new Map(e.joints.map(c=>[c.id,c])),r=[],a=[];for(const c of t.frames){const h=e.frames.find(f=>f.id===c.id);if(!h)continue;const d=Qt(s.get(h.i)),u=Qt(c.axes[0]);for(let f=0;f<c.x.length-1;f++)for(const p of[f,f+1]){const g=d.clone().addScaledVector(u,c.x[p]);r.push(g.x,g.y,g.z);const m=c.disp[p];a.push(m[0]*n,m[1]*n,m[2]*n)}}if(!r.length)return;const o=r.map((c,h)=>c+a[h]),l=this.lines(o,this.theme.deformed,3);if(this.resultGroup.add(l),this.deformed={geo:l.geometry,base:new Float32Array(r),delta:new Float32Array(a)},this.resultOpts.showValues){let c=-1,h=0;for(const[u,f]of Object.entries(t.disp)){const p=Math.hypot(f[0],f[1],f[2]);p>c&&(c=p,h=Number(u))}const d=s.get(h);if(d&&c>0){const u=t.disp[h],f=Qt(d).add(new P(u[0],u[1],u[2]).multiplyScalar(n));this.resultGroup.add(this.label(`max ${kn(c/ln().kSmall)} ${ln().small} (J${h})`,f,"result"))}}}buildDiagram(t,e){const n=this.data,s=new Map(n.joints.map(g=>[g.id,g]));let r=0;for(const g of t.frames)for(const m of g[e])r=Math.max(r,Math.abs(m));if(r<1e-9){this.resultGroup.add(this.label(`${e} = 0 everywhere`,this.target.clone(),"result"));return}const a=this.span*.12/r*this.resultOpts.forceScale,o=e==="P"||e==="V2"||e==="V3"?"F":"M",l=[],c=[],h=[],d=new Xt(this.theme.pos),u=new Xt(this.theme.neg);for(const g of t.frames){const m=n.frames.find(I=>I.id===g.id);if(!m)continue;const v=Qt(s.get(m.i)),_=Qt(g.axes[0]),M=e==="M3"?Qt(g.axes[1]).negate():Qt(e==="M2"||e==="V3"?g.axes[2]:g.axes[1]),x=g[e],D=I=>v.clone().addScaledVector(_,g.x[I]),T=I=>D(I).addScaledVector(M,x[I]*a);for(let I=0;I<g.x.length-1;I++){const S=D(I),y=D(I+1),A=T(I),V=T(I+1),F=x[I]>=0?d:u,z=x[I+1]>=0?d:u;l.push(...S.toArray(),...A.toArray(),...y.toArray(),...A.toArray(),...V.toArray(),...y.toArray());for(const j of[F,F,z,F,z,z])c.push(j.r,j.g,j.b);h.push(...A.toArray(),...V.toArray())}h.push(...D(0).toArray(),...T(0).toArray());const R=g.x.length-1;if(h.push(...D(R).toArray(),...T(R).toArray()),this.resultOpts.showValues){const I=new Set([0,R]);let S=0;for(let y=1;y<R;y++)Math.abs(x[y])>Math.abs(x[S])&&(S=y);Math.abs(x[S])>Math.max(Math.abs(x[0]),Math.abs(x[R]))*1.02&&I.add(S);for(const y of I)Math.abs(x[y])<r*.01||this.resultGroup.add(this.label($t(x[y],o,3),T(y),"result small"))}}const f=new Ce;f.setAttribute("position",new fe(l,3)),f.setAttribute("color",new fe(c,3));const p=new Ae(f,new As({vertexColors:!0,transparent:!0,opacity:.45,side:cn,depthWrite:!1}));this.resultGroup.add(p),this.resultGroup.add(this.lines(h,this.theme.frame,1.5,void 0,{opacity:.8}))}buildReactions(t,e){const n=new Map(e.joints.map(h=>[h.id,h])),s=this.glyph()*3,r=this.theme.reaction;let a=0;for(const h of Object.values(t.reactions))a=Math.max(a,Math.abs(h[0]),Math.abs(h[1]),Math.abs(h[2]));const o=Math.max(a*1e-6,1e-9),l=[new P(1,0,0),new P(0,1,0),new P(0,0,1)],c=["FX","FY","FZ","MX","MY","MZ"];for(const[h,d]of Object.entries(t.reactions)){const u=n.get(Number(h));if(!u)continue;const f=Qt(u),p=[];for(let g=0;g<3;g++){if(Math.abs(d[g])<=o)continue;const m=l[g].clone().multiplyScalar(Math.sign(d[g]));this.resultGroup.add(this.arrow(f.clone().addScaledVector(m,-s),f,r,3)),p.push(`${c[g]} ${Me(d[g],"F")}`)}for(let g=3;g<6;g++){if(Math.abs(d[g])<=o)continue;const m=l[g-3].clone().multiplyScalar(Math.sign(d[g]));this.resultGroup.add(this.arrow(f,f.clone().addScaledVector(m,s*.8),r,3,!0)),p.push(`${c[g]} ${Me(d[g],"M")}`)}this.resultOpts.showValues&&p.length&&this.resultGroup.add(this.label(`J${h}
`+p.join(`
`),f.clone().add(new P(0,0,-s*.6)),"result react"))}}setOverlay(t,e){for(const n of this.overlayObjs)this.overlayGroup.remove(n);if(this.clearGroup(this.overlayGroup),this.overlayObjs=[],t&&t.length){const n=[];for(const[r,a]of t)n.push(...r.toArray(),...a.toArray());const s=this.lines(n,this.theme.sel,2,void 0,{dashed:!0});this.overlayGroup.add(s)}if(e){const n=new Ce;n.setAttribute("position",new fe(e.toArray(),3));const s=new Ra(n,new Ir({size:20,sizeAttenuation:!1,map:this.jointTex,color:this.theme.sel,transparent:!0,opacity:.6,depthTest:!1}));s.renderOrder=20,this.overlayGroup.add(s)}this.requestRender()}pick(t,e,n){const s=this.data;if(!s)return null;let r=null,a=n;for(const h of s.joints){const d=this.toScreen(Qt(h));if(d.behind)continue;const u=Math.hypot(d.x-t,d.y-e);u<a&&(a=u,r=Ue("j",h.id))}if(r)return r;const o=new Map(s.joints.map(h=>[h.id,h]));a=n;for(const h of s.frames){const d=o.get(h.i),u=o.get(h.j);if(!d||!u)continue;const f=this.toScreen(Qt(d)),p=this.toScreen(Qt(u));if(f.behind&&p.behind)continue;const g=x_(t,e,f.x,f.y,p.x,p.y);g<a&&(a=g,r=Ue("f",h.id))}if(r)return r;let l=1/0;const c=this.camera.position;for(const h of s.areas){const d=h.joints.map(g=>o.get(g)).filter(Boolean);if(d.length<3)continue;const u=d.map(g=>this.toScreen(Qt(g)));if(u.some(g=>g.behind)||!M_(t,e,u))continue;const p=d.reduce((g,m)=>g.add(Qt(m)),new P).multiplyScalar(1/d.length).distanceTo(c);p<l&&(l=p,r=Ue("a",h.id))}return r}boxPick(t,e,n,s,r){const a=this.data;if(!a)return[];const o=Math.min(t,n),l=Math.max(t,n),c=Math.min(e,s),h=Math.max(e,s),d=g=>!g.behind&&g.x>=o&&g.x<=l&&g.y>=c&&g.y<=h,u=new Map(a.joints.map(g=>[g.id,this.toScreen(Qt(g))])),f=[];for(const g of a.joints)d(u.get(g.id))&&f.push(Ue("j",g.id));const p=(g,m)=>y_(g.x,g.y,m.x,m.y,o,c,l,h);for(const g of a.frames){const m=u.get(g.i),v=u.get(g.j);!m||!v||(r?d(m)||d(v)||p(m,v):d(m)&&d(v))&&f.push(Ue("f",g.id))}for(const g of a.areas){const m=g.joints.map(_=>u.get(_)).filter(Boolean);if(!m.length)continue;(r?m.some(d)||m.some((_,M)=>p(_,m[(M+1)%m.length])):m.every(d))&&f.push(Ue("a",g.id))}return f}jointScreen(t){return this.toScreen(Qt(t))}dispose(){this.renderer.dispose()}}function x_(i,t,e,n,s,r){const a=s-e,o=r-n,l=a*a+o*o;let c=l>0?((i-e)*a+(t-n)*o)/l:0;return c=Math.max(0,Math.min(1,c)),Math.hypot(i-(e+c*a),t-(n+c*o))}function M_(i,t,e){let n=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const a=e[s],o=e[r];a.y>t!=o.y>t&&i<(o.x-a.x)*(t-a.y)/(o.y-a.y)+a.x&&(n=!n)}return n}function br(i,t,e,n,s,r,a,o){const l=(c,h,d,u,f,p)=>Math.sign((d-c)*(p-h)-(u-h)*(f-c));return l(i,t,e,n,s,r)!==l(i,t,e,n,a,o)&&l(s,r,a,o,i,t)!==l(s,r,a,o,e,n)}function y_(i,t,e,n,s,r,a,o){return br(i,t,e,n,s,r,a,r)||br(i,t,e,n,a,r,a,o)||br(i,t,e,n,a,o,s,o)||br(i,t,e,n,s,o,s,r)}const S_=550;class b_{constructor(t,e){it(this,"pts",new Map);it(this,"mode","idle");it(this,"lpTimer");it(this,"lastPinch",0);it(this,"lastMid",{x:0,y:0});it(this,"down",t=>{var e,n;if(this.el.setPointerCapture(t.pointerId),this.pts.set(t.pointerId,{x:t.clientX,y:t.clientY,sx:t.clientX,sy:t.clientY,t:performance.now(),type:t.pointerType,button:t.button}),this.pts.size===1)this.mode="pending",t.pointerType!=="mouse"&&(this.lpTimer=window.setTimeout(()=>{var s;this.mode==="pending"&&this.pts.size===1&&(this.mode="done",(s=navigator.vibrate)==null||s.call(navigator,15),this.h.longPress(t.clientX,t.clientY,t))},S_));else if(this.pts.size===2){this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.mode="multi";const[s,r]=[...this.pts.values()];this.lastPinch=Math.hypot(s.x-r.x,s.y-r.y),this.lastMid={x:(s.x+r.x)/2,y:(s.y+r.y)/2}}t.preventDefault()});it(this,"move",t=>{var r,a,o,l;const e=this.pts.get(t.pointerId);if(!e){t.pointerType==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}const n=t.clientX-e.x,s=t.clientY-e.y;if(e.x=t.clientX,e.y=t.clientY,this.mode==="multi"&&this.pts.size>=2){const[c,h]=[...this.pts.values()],d=Math.hypot(c.x-h.x,c.y-h.y),u={x:(c.x+h.x)/2,y:(c.y+h.y)/2};this.h.pan(u.x-this.lastMid.x,u.y-this.lastMid.y),this.lastPinch>0&&d>0&&this.h.zoom(this.lastPinch/d,u.x,u.y),this.lastPinch=d,this.lastMid=u;return}if(this.mode==="pending"){if(Math.hypot(t.clientX-e.sx,t.clientY-e.sy)<this.slop(e.type)){e.type==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}this.clearLP(),!t.shiftKey&&(e.type==="mouse"?e.button===2:!0)&&this.h.drag&&((a=(r=this.h).wantsDrag)!=null&&a.call(r,e.sx,e.sy,t))?(this.mode="drag",this.h.drag(e.sx,e.sy,"start")):e.button===1||e.button===2||t.shiftKey?this.mode="pan":this.h.wantsBox(t)?this.mode="box":this.mode="orbit"}this.mode==="orbit"?this.h.orbit(n,s):this.mode==="pan"?this.h.pan(n,s):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"move"):this.mode==="drag"&&((l=(o=this.h).drag)==null||l.call(o,t.clientX,t.clientY,"move"))});it(this,"up",t=>{var n,s;const e=this.pts.get(t.pointerId);e&&(this.pts.delete(t.pointerId),this.clearLP(),this.mode==="pending"&&this.pts.size===0?e.button===2&&e.type==="mouse"?this.h.longPress(t.clientX,t.clientY,t):(e.button===0||e.type!=="mouse")&&this.h.tap(t.clientX,t.clientY,t):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"end"):this.mode==="drag"&&((s=(n=this.h).drag)==null||s.call(n,t.clientX,t.clientY,"end")),this.pts.size===0?this.mode="idle":this.mode==="multi"&&this.pts.size===1&&(this.mode="done"))});it(this,"cancel",t=>{var e,n;this.pts.delete(t.pointerId),this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.pts.size===0&&(this.mode="idle")});it(this,"wheel",t=>{t.preventDefault();let e=t.deltaY;t.deltaMode===1&&(e*=30);const n=t.ctrlKey?.01:.0015;this.h.zoom(Math.exp(e*n),t.clientX,t.clientY)});this.el=t,this.h=e,t.style.touchAction="none",t.addEventListener("pointerdown",this.down),t.addEventListener("pointermove",this.move),t.addEventListener("pointerup",this.up),t.addEventListener("pointercancel",this.cancel),t.addEventListener("lostpointercapture",n=>this.pts.has(n.pointerId)&&this.cancel(n)),t.addEventListener("wheel",this.wheel,{passive:!1}),t.addEventListener("contextmenu",n=>n.preventDefault());for(const n of["gesturestart","gesturechange","gestureend"])t.addEventListener(n,s=>s.preventDefault())}slop(t){return t==="mouse"?4:10}clearLP(){this.lpTimer!==void 0&&clearTimeout(this.lpTimer),this.lpTimer=void 0}}function C(i,t=null,...e){const n=document.createElement(i);if(t)for(const[s,r]of Object.entries(t))r==null||r===!1||(s.startsWith("on")&&typeof r=="function"?n.addEventListener(s.slice(2).toLowerCase(),r):s==="class"?n.className=String(r):s==="style"&&typeof r=="object"?Object.assign(n.style,r):s in n&&typeof r!="string"?n[s]=r:n.setAttribute(s,r===!0?"":String(r)));for(const s of e)s!=null&&s!==!1&&n.append(s);return n}function sh(i){const t=i.trim().replace(/\s/g,"").replace(",",".");return t===""?NaN:Number(t)}function ae(i,t,e={}){const n=e.q,s=c=>String(n?f_(c,n):c),r=C("input",{type:"text",inputmode:"decimal",autocomplete:"off",spellcheck:"false",value:t===null||!Number.isFinite(t)?"":s(t),placeholder:e.mixed?"(mixed)":e.placeholder??""}),a=C("div",{class:"field-err"}),o=C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},r,e.unit||n?C("span",{class:"unit"},n?jt(n):e.unit):null),a),l=()=>{const c=sh(r.value);let h="";return r.value.trim()===""&&e.mixed?h="":Number.isFinite(c)?e.positive&&c<=0?h="Must be > 0":e.min!==void 0&&c<e.min?h=`Must be ≥ ${e.min}`:e.max!==void 0&&c>e.max&&(h=`Must be ≤ ${e.max}`):h="Enter a number",a.textContent=h,o.classList.toggle("invalid",!!h),!h};return r.addEventListener("input",l),r.addEventListener("focus",()=>r.select()),{row:o,input:r,get:()=>{if(!l())return NaN;const c=sh(r.value);return n&&Number.isFinite(c)?Su(c,n):c},set:c=>{r.value=s(c),l()}}}function Gs(i,t){const e=C("input",{type:"text",value:t,autocomplete:"off",spellcheck:"false"});return{row:C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},e)),input:e,get:()=>e.value.trim(),set:s=>e.value=s}}function tn(i,t,e){const n=C("select",null,...t.map(([r,a])=>C("option",{value:r,selected:r===e},a)));return n.addEventListener("change",()=>n.blur()),{row:C("label",{class:"field"},C("span",{class:"field-label"},i),C("span",{class:"field-input"},n)),input:n,get:()=>n.value,set:r=>n.value=r}}function gl(i,t){const e=C("input",{type:"checkbox",checked:t});return{row:C("label",{class:"check"},e,C("span",null,i)),input:e,get:()=>e.checked,set:s=>e.checked=s}}let $o=0;const E_=()=>$o>0;function oe(i){const t=C("div",{class:"dlg-backdrop"}),e=()=>{var l;t.isConnected&&(t.remove(),$o--,document.removeEventListener("keydown",a,!0),(l=i.onClose)==null||l.call(i))},n=async l=>{(l.action?await l.action():void 0)!==!1&&e()},s=i.buttons.map(l=>C("button",{class:"btn "+(l.kind??"plain"),type:"button",onclick:()=>n(l)},l.label)),r=C("div",{class:"dlg"+(i.wide?" wide":""),role:"dialog","aria-modal":"true","aria-label":i.title},C("div",{class:"dlg-head"},C("h2",null,i.title),C("button",{class:"icon-btn","aria-label":"Close",onclick:e},"✕")),C("div",{class:"dlg-body"},i.body),C("div",{class:"dlg-foot"},...s));t.append(r),t.addEventListener("pointerdown",l=>{l.target===t&&e()});const a=l=>{if(l.key==="Escape")l.stopPropagation(),e();else if(l.key==="Enter"&&!(l.target instanceof HTMLTextAreaElement)&&!(l.target instanceof HTMLButtonElement)){const c=i.buttons.find(h=>h.kind==="primary");c&&(l.preventDefault(),l.stopPropagation(),n(c))}};if(document.addEventListener("keydown",a,!0),document.body.append(t),$o++,!("ontouchstart"in window||navigator.maxTouchPoints&&navigator.maxTouchPoints>0)&&matchMedia("(pointer: fine)").matches){const l=r.querySelector('.dlg-body input:not([type="checkbox"]):not([type="radio"])');l==null||l.focus()}return{close:e,el:r}}function as(i,t,e="OK",n=!1){return new Promise(s=>{let r=!1;oe({title:i,body:C("p",{class:"msg"},t),buttons:[{label:"Cancel"},{label:e,kind:n?"danger":"primary",action:()=>void(r=!0)}],onClose:()=>s(r)})})}function vi(i,t){return new Promise(e=>{oe({title:i,body:typeof t=="string"?C("p",{class:"msg"},t):t,buttons:[{label:"OK",kind:"primary"}],onClose:()=>e()})})}let Er=null;function Wt(i,t="info",e=3200){Er||(Er=C("div",{class:"toasts","aria-live":"polite"}),document.body.append(Er));const n=C("div",{class:"toast "+t},i);Er.append(n),setTimeout(()=>{n.classList.add("out"),setTimeout(()=>n.remove(),300)},e)}let Qn=null;document.addEventListener("change",i=>{i.target instanceof HTMLSelectElement&&i.target.blur()},!0);function Wr(){var i,t;(t=(i=document.activeElement)==null?void 0:i.blur)==null||t.call(i),Qn==null||Qn.close()}function rh(i,t,e,n){var d,u;Wr();const s=C("div",{class:"popup-menu",role:"menu"});for(const f of i){if(f.separator){s.append(C("div",{class:"sep"}));continue}if(f.heading){s.append(C("div",{class:"menu-heading"},f.heading));continue}const p=((d=f.disabled)==null?void 0:d.call(f))??!1,g=(u=f.checked)==null?void 0:u.call(f),m=C("button",{class:"menu-item",role:"menuitem",type:"button",disabled:p,onclick:()=>{var v;Wr(),(v=f.action)==null||v.call(f)}},C("span",{class:"mi-check"},g===void 0?"":g?"✓":""),C("span",{class:"mi-label"},f.label??""),C("span",{class:"mi-short"},f.shortcut??""));s.append(m)}s.addEventListener("contextmenu",f=>f.preventDefault()),document.body.append(s);const r=s.getBoundingClientRect();let a=t,o=e;if(n){const f=n.getBoundingClientRect();a=f.left,o=f.bottom+2}a=Math.max(4,Math.min(a,window.innerWidth-r.width-4)),o+r.height>window.innerHeight-4&&(o=Math.max(4,(n?n.getBoundingClientRect().top:e)-r.height-2)),s.style.left=a+"px",s.style.top=Math.max(4,o)+"px",s.style.maxHeight=window.innerHeight-8+"px";const l=f=>{!s.contains(f.target)&&f.target!==n&&h()},c=f=>{f.key==="Escape"&&h()},h=()=>{s.remove(),document.removeEventListener("pointerdown",l,!0),document.removeEventListener("keydown",c,!0),n==null||n.classList.remove("open"),(Qn==null?void 0:Qn.el)===s&&(Qn=null)};setTimeout(()=>{document.addEventListener("pointerdown",l,!0),document.addEventListener("keydown",c,!0)},0),n==null||n.classList.add("open"),Qn={el:s,close:h}}const w_=i=>i.classList.contains("open"),Eu={select:"Tap an object to select it. Drag to rotate, two fingers to pan/zoom. Long-press for options. Drag a selected joint (right-drag with a mouse) to move it.",joint:"Tap the grid to place joints (snaps to grid and existing joints).",frame:"Tap start and end points to draw frames; drawing continues from the last point. Tap Done to stop.",area:"Tap the corner points of the area, then tap the first point again or Done to close it.",box:"Drag a box: left→right selects objects fully inside, right→left selects anything touched."};class A_{constructor(t){it(this,"tool","select");it(this,"multi",!1);it(this,"chain",[]);it(this,"hoverSnap",null);it(this,"boxEl");it(this,"dragState",null);this.app=t,this.boxEl=document.createElement("div"),this.boxEl.className="select-box",this.boxEl.hidden=!0,document.body.append(this.boxEl)}setTool(t){this.finishChain(!1),this.tool=t,this.hoverSnap=null,this.updateOverlay(),this.app.onToolChanged()}tol(t){return t.pointerType==="mouse"?12:24}snap(t,e,n){const s=this.app.viewer,r=this.app.model.data;let a=null,o=this.tol(n);for(const p of r.joints){const g=s.jointScreen(p);if(g.behind)continue;const m=Math.hypot(g.x-t,g.y-e);m<o&&(o=m,a={pos:new P(p.x,p.y,p.z),joint:p.id})}if(a)return a;const l=s.workPlanePoint(t,e);if(!l)return null;const{gridSpacing:c,workPlane:h,elevation:d}=r.settings,u=p=>Math.round(p/c)*c;h==="XY"?l.set(u(l.x),u(l.y),d):h==="XZ"?l.set(u(l.x),d,u(l.z)):l.set(d,u(l.y),u(l.z));const f=p=>Math.round(p*1e9)/1e9;return l.set(f(l.x),f(l.y),f(l.z)),{pos:l,joint:null}}jointAt(t){return t.joint??this.app.model.addJoint(t.pos.x,t.pos.y,t.pos.z)}tap(t,e,n){const s=this.app.model;switch(this.tool){case"select":case"box":{const r=this.app.viewer.pick(t,e,this.tol(n)),a=this.multi||n.shiftKey||n.ctrlKey||n.metaKey;r?this.app.select([r],a?"toggle":"replace"):a||this.app.select([],"replace");break}case"joint":{const r=this.snap(t,e,n);if(!r)return Wt("Point is not on the work plane – rotate the view or change the work plane.","warn");const a=this.jointAt(r);this.app.select([Ue("j",a)],"replace");break}case"frame":{const r=this.snap(t,e,n);if(!r)return Wt("Point is not on the work plane – rotate the view or change the work plane.","warn");s.commit("draw frame",()=>{const a=this.jointAt(r),o=this.chain[0];if(o!==void 0&&o!==a){const l=s.addFrame(o,a);l!==null&&this.app.select([Ue("f",l)],"replace")}this.chain=[a]});break}case"area":{const r=this.snap(t,e,n);if(!r)return Wt("Point is not on the work plane – rotate the view or change the work plane.","warn");if(r.joint!==null&&this.chain.length>=3&&r.joint===this.chain[0]){this.finishChain(!0);break}if(r.joint!==null&&this.chain.includes(r.joint))return Wt("Joint already used in this area","warn");this.chain.push(this.jointAt(r));break}}this.updateOverlay(),this.app.updateStatus()}hover(t,e,n){var s;(this.tool==="joint"||this.tool==="frame"||this.tool==="area")&&(this.hoverSnap=this.snap(t,e,n),this.updateOverlay(),this.app.setCoordReadout(((s=this.hoverSnap)==null?void 0:s.pos)??null))}wantsBox(t){return this.tool==="box"||this.tool==="select"&&t.pointerType==="mouse"&&(t.ctrlKey||t.metaKey)}box(t,e,n,s,r){const a=this.boxEl;if(r==="cancel"){a.hidden=!0;return}const o=n<t;if(r==="move"){a.hidden=!1,a.classList.toggle("crossing",o),Object.assign(a.style,{left:Math.min(t,n)+"px",top:Math.min(e,s)+"px",width:Math.abs(n-t)+"px",height:Math.abs(s-e)+"px"});return}a.hidden=!0;const l=this.app.viewer.boxPick(t,e,n,s,o);this.app.select(l,this.multi?"add":"replace"),Wt(`${l.length} object(s) ${o?"touched":"inside box"}`,"info",1500)}wantsDrag(t,e,n){if(this.chain.length)return!1;const s=[...this.app.selection];if(s.length!==1)return!1;const{kind:r,id:a}=Is(s[0]);if(r!=="j")return!1;const o=this.app.model.joint(a);if(!o)return!1;const l=this.app.viewer.jointScreen(o);return!l.behind&&Math.hypot(l.x-t,l.y-e)<=this.tol(n)}dragTarget(t,e,n){const s=this.app.model.joint(t);if(!s)return null;const{gridSpacing:r,workPlane:a}=this.app.model.data.settings,o=a==="XY"?s.z:a==="XZ"?s.y:s.x,l=this.app.viewer.workPlanePoint(e,n,o);if(!l)return null;const c=h=>Math.round(Math.round(h/r)*r*1e9)/1e9;return a==="XY"?l.set(c(l.x),c(l.y),s.z):a==="XZ"?l.set(c(l.x),s.y,c(l.z)):l.set(s.x,c(l.y),c(l.z)),l}drag(t,e,n){if(n==="start"){const{id:d}=Is([...this.app.selection][0]);this.dragState={id:d,target:null};return}const s=this.dragState;if(!s)return;const r=this.app.model;if(n==="cancel"){this.dragState=null,this.updateOverlay(),this.app.setCoordReadout(null);return}if(n==="move"){if(s.target=this.dragTarget(s.id,t,e)??s.target,!s.target)return;const d=[],u=r.jointMap(),f=p=>{const g=u.get(p);return p===s.id?s.target:new P(g.x,g.y,g.z)};for(const p of r.data.frames)(p.i===s.id||p.j===s.id)&&d.push([f(p.i),f(p.j)]);for(const p of r.data.areas){const g=p.joints.indexOf(s.id);if(g<0)continue;const m=p.joints.length;d.push([f(p.joints[(g+m-1)%m]),s.target],[s.target,f(p.joints[(g+1)%m])])}this.app.viewer.setOverlay(d,s.target),this.app.setCoordReadout(s.target);return}this.dragState=null;const a=r.joint(s.id);if(this.updateOverlay(),this.app.setCoordReadout(null),!a||!s.target)return;const o=s.target.x-a.x,l=s.target.y-a.y,c=s.target.z-a.z;if(Math.abs(o)+Math.abs(l)+Math.abs(c)<1e-12)return;const h=r.moveJoints(new Set([s.id]),o,l,c);h&&Wt(h,"warn")}finishChain(t=!0){if(this.tool==="area"&&t&&this.chain.length>=3){const e=this.app.model.addArea(this.chain);e!==null&&this.app.select([Ue("a",e)],"replace")}else this.tool==="area"&&t&&this.chain.length>0&&Wt("An area needs at least 3 points","warn");this.chain=[],this.updateOverlay(),this.app.updateStatus()}cancel(){this.chain.length?(this.chain=[],this.updateOverlay()):this.app.select([],"replace"),this.app.updateStatus()}updateOverlay(){var o;const t=this.app.viewer,e=this.app.model,n=this.chain.map(l=>e.joint(l)).filter(Boolean).map(l=>new P(l.x,l.y,l.z)),s=[],r=(o=this.hoverSnap)==null?void 0:o.pos;if(this.tool==="frame"&&n.length&&r&&s.push([n[0],r]),this.tool==="area"&&n.length){for(let c=0;c+1<n.length;c++)s.push([n[c],n[c+1]]);const l=r??n[n.length-1];r&&s.push([n[n.length-1],r]),n.length>=2&&s.push([l,n[0]])}let a=null;(this.tool==="joint"||this.tool==="frame"||this.tool==="area")&&(a=r??(n.length?n[n.length-1]:null)),t.setOverlay(s,a)}statusText(){return this.tool==="frame"&&this.chain.length?`Frame from joint ${this.chain[0]} – tap the next point, or Done to stop.`:this.tool==="area"&&this.chain.length?`Area: ${this.chain.length} point(s) [${this.chain.join(", ")}] – tap the next point, the first point, or Done.`:Eu[this.tool]}static valid(t,e){const{kind:n,id:s}=Is(e),r=t.model;return n==="j"?!!r.joint(s):n==="f"?!!r.frame(s):!!r.area(s)}}function Ba(i,t){let e;switch(i){case"L1":return[1,0,0];case"L2":return[0,1,0];case"L3":return[0,0,1];case"GX":e=[1,0,0];break;case"GY":e=[0,1,0];break;case"GZ":e=[0,0,1];break;case"GRAV":e=[0,0,-1];break}return[Ur(t[0],e),Ur(t[1],e),Ur(t[2],e)]}function T_(i){let t=0,e=0,n=0;for(let s=0;s<i.length;s++){const r=i[s],a=i[(s+1)%i.length];t+=(r[1]-a[1])*(r[2]+a[2]),e+=(r[2]-a[2])*(r[0]+a[0]),n+=(r[0]-a[0])*(r[1]+a[1])}return Math.hypot(t,e,n)/2}function C_(i,t,e){const n=Ds(t,i),s=zs(n),r=[n[0]/s,n[1]/s,n[2]/s],a=Math.min(Math.max(Ur(Ds(e,i),r),0),s),o=zs(Ss(Ds(e,i),r));return[[0,0],[a,o],[s,0]]}function R_(i){let t=0;for(let e=0;e+1<i.length;e++)t+=(i[e+1][0]-i[e][0])*(i[e][1]+i[e+1][1])/2;return t}function L_(i,t,e,n){const s=i.length,r=i.map((c,h)=>zs(Ds(i[(h+1)%s],c)));let a;if(s===4&&t==="one-way"){const c=(r[0]+r[2])/2,h=(r[1]+r[3])/2,d=c>=h,u=d?h:c;a=r.map((f,p)=>p%2===0===d?[[0,u/2],[f,u/2]]:[[0,0],[f,0]])}else if(s===4){const h=Math.min((r[0]+r[2])/2,(r[1]+r[3])/2)/2;a=r.map(d=>d>2*h?[[0,0],[h,h],[d-h,h],[d,0]]:[[0,0],[d/2,d/2],[d,0]])}else{t==="one-way"&&e.push(`Area ${n}: one-way distribution needs 4 joints; two-way used.`);let c;if(s===3){const[h,d,u]=i,f=r[1],p=r[2],g=r[0],m=f+p+g;c=[(f*h[0]+p*d[0]+g*u[0])/m,(f*h[1]+p*d[1]+g*u[1])/m,(f*h[2]+p*d[2]+g*u[2])/m]}else{c=[0,0,0];for(const h of i)c[0]+=h[0]/s,c[1]+=h[1]/s,c[2]+=h[2]/s}a=i.map((h,d)=>C_(h,i[(d+1)%s],c))}const o=a.reduce((c,h)=>c+R_(h),0),l=T_(i);if(o>0){const c=l/o;for(const h of a)for(const d of h)d[1]*=c}return a}function P_(i,t,e){const n=new Map,s=new Map;for(const a of i.frames)s.set(`${a.i}-${a.j}`,a),s.set(`${a.j}-${a.i}`,a);const r=new Map;for(const a of i.areaLoads)r.set(a.area,(r.get(a.area)??0)+a.q);for(const a of i.areas){const o=r.get(a.id)??0;if(!o)continue;const l=a.joints.map(u=>t.get(u));if(l.some(u=>!u)){e.push(`Area ${a.id}: references a missing joint; load ignored.`);continue}const c=l.map(u=>[u.x,u.y,u.z]),h=L_(c,a.distribution,e,a.id),d=c.length;for(let u=0;u<d;u++){const f=h[u];if(f.every(x=>x[1]===0))continue;const p=a.joints[u],g=a.joints[(u+1)%d],m=s.get(`${p}-${g}`);if(!m){e.push(`Area ${a.id}: edge ${p}-${g} has no frame; its share of the load is ignored.`);continue}const v=m.i!==p,_=h[u][f.length-1][0],M=n.get(m.id)??[];for(let x=0;x+1<f.length;x++){const[D,T]=f[x],[R,I]=f[x+1];R-D<=1e-12||(v?M.push({x1:_-R,x2:_-D,w1:o*I,w2:o*T}):M.push({x1:D,x2:R,w1:o*T,w2:o*I}))}n.set(m.id,M)}}return n}class D_{constructor(t){it(this,"n");it(this,"maxa");it(this,"heights");it(this,"a");it(this,"diag0",null);this.n=t.length,this.heights=t,this.maxa=new Int32Array(this.n+1);for(let e=0;e<this.n;e++)this.maxa[e+1]=this.maxa[e]+t[e]+1;this.a=new Float64Array(this.maxa[this.n])}add(t,e,n){if(t>e){const r=t;t=e,e=r}const s=e-t;if(s>this.heights[e])throw new Error("Skyline profile violated");this.a[this.maxa[e]+s]+=n}get(t,e){if(t>e){const s=t;t=e,e=s}const n=e-t;return n>this.heights[e]?0:this.a[this.maxa[e]+n]}factor(t=1e-10){const{n:e,maxa:n,heights:s,a:r}=this;this.diag0=new Float64Array(e);let a=0;for(let l=0;l<e;l++)this.diag0[l]=r[n[l]],a=Math.max(a,Math.abs(r[n[l]]));const o=a*1e-15;for(let l=0;l<e;l++){const c=l-s[l],h=n[l];for(let f=c+1;f<l;f++){const p=f-s[f],g=Math.max(p,c),m=n[f];let v=r[h+(l-f)];for(let _=g;_<f;_++)v-=r[m+(f-_)]*r[h+(l-_)];r[h+(l-f)]=v}let d=r[h];for(let f=c;f<l;f++){const p=h+(l-f),g=r[p],m=g/r[n[f]];d-=m*g,r[p]=m}const u=Math.abs(this.diag0[l]);if(!(d>t*u)||!(d>o))return l;r[h]=d}return-1}solve(t){const{n:e,maxa:n,heights:s,a:r}=this;for(let a=0;a<e;a++){const o=n[a];let l=t[a];for(let c=a-s[a];c<a;c++)l-=r[o+(a-c)]*t[c];t[a]=l}for(let a=0;a<e;a++)t[a]/=r[n[a]];for(let a=e-1;a>=0;a--){const o=n[a],l=t[a];for(let c=a-s[a];c<a;c++)t[c]-=r[o+(a-c)]*l}return t}}function I_(i){const t=i.length,e=new Uint8Array(t),n=[],s=i.map(a=>a.length),r=[...Array(t).keys()].sort((a,o)=>s[a]-s[o]);for(const a of r){if(e[a])continue;e[a]=1;const o=[a];for(let l=0;l<o.length;l++){const c=o[l];n.push(c);const h=i[c].filter(d=>!e[d]).sort((d,u)=>s[d]-s[u]);for(const d of h)e[d]=1,o.push(d)}}return n.reverse()}class Je extends Error{}const ah=40;function U_(i,t,e=0,n=0){const s=new Float64Array(12);for(const r of i.points)Qc(r.p,r.a,t,s,e,n);for(const r of i.dists){const a=(r.x2-r.x1)/2,o=(r.x1+r.x2)/2;for(const l of _u){const c=o+l.x*a,h=r.x2>r.x1?(c-r.x1)/(r.x2-r.x1):0,d=(r.w1+(r.w2-r.w1)*h)*l.w*a;Qc([r.d[0]*d,r.d[1]*d,r.d[2]*d],c,t,s,e,n)}}return s}function N_(i,t,e){const n=[0,0,0],s=[0,0,0],r=(a,o)=>{n[0]+=a[0],n[1]+=a[1],n[2]+=a[2];const l=o-t;s[1]+=-l*a[2],s[2]+=l*a[1]};for(const a of i.points)(a.a<t||e&&a.a===t)&&r(a.p,a.a);for(const a of i.dists){const o=Math.min(a.x2,t);if(o<=a.x1)continue;const l=(o-a.x1)/2,c=(a.x1+o)/2;for(const h of _u){const d=c+h.x*l,u=a.x2>a.x1?(d-a.x1)/(a.x2-a.x1):0,f=(a.w1+(a.w2-a.w1)*u)*h.w*l;r([a.d[0]*f,a.d[1]*f,a.d[2]*f],d)}}return{F:n,M:s}}function jo(i,t){const e=[0];for(let n=1;n<i.length;n++)e.push(e[n-1]+(i[n]-i[n-1])*(t[n]+t[n-1])/2);return e}function oh(i,t,e,n,s){const r=jo(i,t),a=s?r.map((h,d)=>h+s[d]):r,o=jo(i,a),l=i[i.length-1],c=(n-e-o[o.length-1])/l;return o.map((h,d)=>h+e+c*i[d])}const wu=(i,t)=>[i[0]*t,i[1]*t,i[2]*t];function F_(i,t,e,n,s,r){const a=new Map,o=c=>{var h;return(c.case??((h=i.loadCases[0])==null?void 0:h.name))===t},l=P_({...i,areaLoads:i.areaLoads.filter(o)},s,r);for(const c of n){const h={points:[],dists:[]};for(const u of i.framePointLoads)if(u.frame===c.id&&u.P&&o(u)){const f=Ba(u.dir,c.axes);h.points.push({a:Math.min(Math.max(u.rd,0),1)*c.L,p:wu(f,u.P)})}for(const u of i.frameUniformLoads)u.frame===c.id&&u.w&&o(u)&&h.dists.push({x1:0,x2:c.L,w1:u.w,w2:u.w,d:Ba(u.dir,c.axes)});const d=Ba("GRAV",c.axes);for(const u of l.get(c.id)??[])h.dists.push({...u,d});e&&c.selfWeight>0&&h.dists.push({x1:0,x2:c.L,w1:c.selfWeight,w2:c.selfWeight,d}),a.set(c.id,h)}return a}function O_(i,t){const e=c=>{const h=c(i);if(!h)return;const d=h.map(()=>0);for(const[u,f]of t){const p=c(u);if(p)for(let g=0;g<d.length;g++)d[g]+=f*p[g]}return d},n={};for(const c of Object.keys(i.disp))n[+c]=e(h=>h.disp[+c]);const s={};for(const c of Object.keys(i.reactions))s[+c]=e(h=>h.reactions[+c]);let r=0;for(const c of Object.values(n))r=Math.max(r,Math.hypot(c[0],c[1],c[2]));const a=i.frames.map((c,h)=>{const d=p=>e(g=>g.frames[h][p]),u=c.disp.map((p,g)=>{const m=[0,0,0];for(const[v,_]of t)for(let M=0;M<3;M++)m[M]+=_*v.frames[h].disp[g][M];return r=Math.max(r,Math.hypot(m[0],m[1],m[2])),m}),f={points:[],dists:[]};for(const[p,g]of t)if(g){for(const m of p.frames[h].loads.points)f.points.push({a:m.a,p:wu(m.p,g)});for(const m of p.frames[h].loads.dists)f.dists.push({...m,w1:m.w1*g,w2:m.w2*g})}return{id:c.id,L:c.L,axes:c.axes,endForces:e(p=>p.frames[h].endForces),x:[...c.x],P:d("P"),V2:d("V2"),V3:d("V3"),T:d("T"),M2:d("M2"),M3:d("M3"),disp:u,loads:f}}),o=c=>{const h=[0,0,0];for(const[d,u]of t)for(let f=0;f<3;f++)h[f]+=u*c(d)[f];return h},l=[...new Set(t.filter(([,c])=>c!==0).flatMap(([c])=>c.warnings))];return{disp:n,reactions:s,frames:a,warnings:l,stats:{...i.stats,maxDisp:r,sumLoad:o(c=>c.stats.sumLoad),sumReaction:o(c=>c.stats.sumReaction)}}}function B_(i,t){var n;if(!((n=i.loadCases)!=null&&n.length))throw new Je("Define at least one load case.");const e=new Set;for(const s of i.loadCases){if(e.has(s.name))throw new Je(`Load case name "${s.name}" is used more than once.`);e.add(s.name)}for(const s of t){if(e.has(s.name))throw new Je(`Load combination name "${s.name}" is already used by another case or combination.`);e.add(s.name);for(const r of s.factors)if(!i.loadCases.some(a=>a.name===r.case))throw new Je(`Load combination ${s.name} refers to unknown load case "${r.case}".`)}}function z_(i,t){var I;const e=[],n=new Map(i.joints.map(S=>[S.id,S])),s=new Map(i.materials.map(S=>[S.name,S])),r=new Map(i.sections.map(S=>[S.name,S]));if(i.frames.length===0)throw new Je("The model has no frames to analyze.");B_(i,t);const a=new Set;for(const S of i.frames){if(!n.has(S.i)||!n.has(S.j))throw new Je(`Frame ${S.id} references a missing joint.`);a.add(S.i),a.add(S.j)}for(const S of i.joints)!a.has(S.id)&&i.jointLoads.some(y=>y.joint===S.id&&y.f.some(A=>A!==0))&&e.push(`Joint ${S.id} is not connected to any frame; its load is ignored.`);const o=i.joints.filter(S=>a.has(S.id)),l=new Map(o.map((S,y)=>[S.id,y])),c=o.length,h=[];for(const S of i.frames){const y=n.get(S.i),A=n.get(S.j),V=[y.x,y.y,y.z],F=[A.x,A.y,A.z],z=Math.hypot(F[0]-V[0],F[1]-V[1],F[2]-V[2]);if(z<1e-9)throw new Je(`Frame ${S.id} has zero length.`);const j=s.get(S.material);if(!j)throw new Je(`Frame ${S.id}: material "${S.material}" is not defined.`);const G=r.get(S.section);if(!G)throw new Je(`Frame ${S.id}: section "${S.section}" is not defined.`);const J=wi(G);if(!(j.E>0))throw new Je(`Material ${j.name}: E must be positive.`);if(!(J.A>0&&J.I22>0&&J.I33>0&&J.J>0))throw new Je(`Section ${G.name}: A, I22, I33 and J must be positive.`);const W=j.E/(2*(1+j.nu)),at=Go(V,F,S.beta),ht=e_(j.E,W,J.A,J.I22,J.I33,J.J,z,J.As2,J.As3),mt=a_(ht,S.relI,S.relJ);if(!mt)throw new Je(`Frame ${S.id}: Invalid end releases cause an element mechanism (e.g. releasing axial or torsion at both ends).`);h.push({id:S.id,ji:l.get(S.i),jj:l.get(S.j),L:z,axes:at,R:n_(at),kl:ht,klCondensed:mt.klCondensed,condInfo:mt,relI:S.relI,relJ:S.relJ,E:j.E,A:J.A,I22:J.I22,I33:J.I33,G:W,As2:J.As2,As3:J.As3,phi2:Hr(j.E,W,J.I33,J.As2,z),phi3:Hr(j.E,W,J.I22,J.As3,z),selfWeight:j.gamma>0?j.gamma*J.A:0})}const d=Array.from({length:c},()=>[]);for(const S of h)d[S.ji].push(S.jj),d[S.jj].push(S.ji);const u=I_(d),f=new Int32Array(c*6).fill(-1);let p=0;for(const S of u){const y=o[S];for(let A=0;A<6;A++)y.r[A]||(f[S*6+A]=p++)}const g=S=>{const y=new Int32Array(12);for(let A=0;A<6;A++)y[A]=f[S.ji*6+A],y[6+A]=f[S.jj*6+A];return y};let m=null;if(p>0){const S=new Int32Array(p),y=h.map(g);for(const V of y){let F=1/0;for(const z of V)z>=0&&z<F&&(F=z);for(const z of V)z>=0&&(S[z]=Math.max(S[z],z-F))}m=new D_(S),h.forEach((V,F)=>{const z=s_(V.klCondensed,V.R),j=y[F];for(let G=0;G<12;G++){const J=j[G];if(!(J<0))for(let W=0;W<12;W++){const at=j[W];at<0||at<J||m.add(J,at,z[G*12+W])}}});const A=m.factor();if(A>=0){let V=`equation ${A}`;for(let F=0;F<c;F++)for(let z=0;z<6;z++)f[F*6+z]===A&&(V=`joint ${o[F].id} (${ii[z]})`);throw new Je(`The structure is unstable (mechanism) at ${V}. Check supports and connectivity.`)}}else e.push("All degrees of freedom are restrained.");const v=i.settings.selfWeight?(I=i.loadCases.find(S=>S.type==="Dead"))==null?void 0:I.name:void 0;i.settings.selfWeight&&!v&&e.push("Self weight is on but there is no Dead load case; it was ignored.");const _=new Map,M=new Map;for(const S of i.loadCases){const y=[];M.set(S.name,F_(i,S.name,S.name===v,h,n,y)),_.set(S.name,y)}const x=new Map;for(const S of h){const y=[];for(let V=0;V<=ah;V++)y.push({x:S.L*V/ah,inc:!0});const A=[];for(const V of M.values())for(const F of V.get(S.id).points)F.a>1e-9&&F.a<S.L-1e-9&&!A.some(z=>Math.abs(z-F.a)<1e-12)&&(A.push(F.a),y.push({x:F.a,inc:!1},{x:F.a,inc:!0}));y.sort((V,F)=>V.x-F.x||Number(V.inc)-Number(F.inc)),x.set(S.id,y)}const D={};for(const S of i.loadCases){const y=M.get(S.name),A=[...e,..._.get(S.name)],V=h.map(N=>U_(y.get(N.id),N.L,N.phi2,N.phi3)),F=h.map((N,K)=>o_(V[K],N.condInfo)),z=new Float64Array(c*6);for(const N of i.jointLoads){if((N.case??i.loadCases[0].name)!==S.name)continue;const K=l.get(N.joint);if(K!==void 0)for(let ut=0;ut<6;ut++)z[K*6+ut]+=N.f[ut]}const j=Float64Array.from(z),G=[0,0,0];for(let N=0;N<c;N++)for(let K=0;K<3;K++)G[K]+=z[N*6+K];h.forEach((N,K)=>{const ut=Kc(N.R,F[K]);for(let Q=0;Q<6;Q++)z[N.ji*6+Q]-=ut[Q],z[N.jj*6+Q]-=ut[6+Q];for(let Q=0;Q<3;Q++)G[Q]-=ut[Q]+ut[6+Q]});const J=new Float64Array(c*6);if(m){const N=new Float64Array(p);for(let K=0;K<c*6;K++)f[K]>=0&&(N[f[K]]=z[K]);m.solve(N);for(let K=0;K<c*6;K++)f[K]>=0&&(J[K]=N[f[K]])}const W=new Float64Array(c*6),at=[];let ht=0;for(let N=0;N<c;N++)ht=Math.max(ht,Math.hypot(J[N*6],J[N*6+1],J[N*6+2]));h.forEach((N,K)=>{const ut=y.get(N.id),Q=new Float64Array(12);for(let U=0;U<6;U++)Q[U]=J[N.ji*6+U],Q[6+U]=J[N.jj*6+U];const Pt=i_(N.R,Q),Dt=l_(Pt,V[K],N.condInfo),At=new Float64Array(12);for(let U=0;U<12;U++){let q=V[K][U];for(let tt=0;tt<12;tt++)q+=N.kl[U*12+tt]*Dt[tt];At[U]=q}for(const U of N.condInfo.released)At[U]=0;const qt=Kc(N.R,At);for(let U=0;U<6;U++)W[N.ji*6+U]+=qt[U],W[N.jj*6+U]+=qt[6+U];const $={id:N.id,L:N.L,axes:N.axes,endForces:Array.from(At),x:[],P:[],V2:[],V3:[],T:[],M2:[],M3:[],disp:[],loads:ut};for(const{x:U,inc:q}of x.get(N.id)){const{F:tt,M:Z}=N_(ut,U,q),St=[-(At[0]+tt[0]),-(At[1]+tt[1]),-(At[2]+tt[2])],dt=-U,vt=[At[3],At[4]+-dt*At[2],At[5]+dt*At[1]],Vt=[-(vt[0]+Z[0]),-(vt[1]+Z[1]),-(vt[2]+Z[2])];$.x.push(U),$.P.push(St[0]),$.V2.push(St[1]),$.V3.push(St[2]),$.T.push(Vt[0]),$.M2.push(Vt[1]),$.M3.push(Vt[2])}if($.x.length>0){const U=$.x.length-1;N.relI&&(N.relI[0]&&($.P[0]=0),N.relI[1]&&($.V2[0]=0),N.relI[2]&&($.V3[0]=0),N.relI[3]&&($.T[0]=0),N.relI[4]&&($.M2[0]=0),N.relI[5]&&($.M3[0]=0)),N.relJ&&(N.relJ[0]&&($.P[U]=0),N.relJ[1]&&($.V2[U]=0),N.relJ[2]&&($.V3[U]=0),N.relJ[3]&&($.T[U]=0),N.relJ[4]&&($.M2[U]=0),N.relJ[5]&&($.M3[U]=0))}const st=jo($.x,$.P.map(U=>U/(N.E*N.A))),L=(Dt[6]-Dt[0]-st[st.length-1])/N.L,wt=$.x.map((U,q)=>Dt[0]+st[q]+L*U),nt=N.As2>0?$.V2.map(U=>U/(N.G*N.As2)):void 0,yt=N.As3>0?$.V3.map(U=>U/(N.G*N.As3)):void 0,lt=oh($.x,$.M3.map(U=>U/(N.E*N.I33)),Dt[1],Dt[7],nt),It=oh($.x,$.M2.map(U=>-U/(N.E*N.I22)),Dt[2],Dt[8],yt),[gt,w,b]=N.axes;for(let U=0;U<$.x.length;U++){const q=[gt[0]*wt[U]+w[0]*lt[U]+b[0]*It[U],gt[1]*wt[U]+w[1]*lt[U]+b[1]*It[U],gt[2]*wt[U]+w[2]*lt[U]+b[2]*It[U]];$.disp.push(q),ht=Math.max(ht,Math.hypot(q[0],q[1],q[2]))}at.push($)});const mt={},Nt={},Jt=[0,0,0];o.forEach((N,K)=>{if(mt[N.id]=Array.from(J.subarray(K*6,K*6+6)),N.r.some(Boolean)){const ut=[0,0,0,0,0,0];for(let Q=0;Q<6;Q++)N.r[Q]&&(ut[Q]=W[K*6+Q]-j[K*6+Q]);Nt[N.id]=ut;for(let Q=0;Q<3;Q++)Jt[Q]+=ut[Q]}});for(const N of i.joints)mt[N.id]||(mt[N.id]=[0,0,0,0,0,0]);D[S.name]={disp:mt,reactions:Nt,frames:at,warnings:[...new Set(A)],stats:{joints:c,frames:h.length,equations:p,maxDisp:ht,sumLoad:G,sumReaction:Jt}}}const T=i.loadCases.map(S=>({name:S.name,kind:"case"})),R=D[i.loadCases[0].name];for(const S of t){const y=O_(R,S.factors.map(A=>[D[A.case],A.factor]));S.factors.length===0&&y.warnings.push(`Load combination ${S.name} has no load cases.`),D[S.name]=y,T.push({name:S.name,kind:"combo"})}return{items:T,results:D}}function k_(i){const t=Br(JSON.parse(JSON.stringify(i)));return z_(t,t.loadCombos)}let on=null,V_=0;const bs=new Map;function G_(){if(on)return on;try{on=new Worker(new URL(""+new URL("worker-CPuJUfrW.js",import.meta.url).href,import.meta.url),{type:"module"}),on.onmessage=i=>{const t=bs.get(i.data.id);t&&(bs.delete(i.data.id),i.data.ok?t.resolve(i.data.results):t.reject(new Error(i.data.error)))},on.onerror=i=>{for(const t of bs.values())t.reject(new Error(i.message||"Analysis worker failed"));bs.clear(),on==null||on.terminate(),on=null}}catch{on=null}return on}function H_(i){const t=G_();if(!t)return new Promise((n,s)=>{setTimeout(()=>{try{n(k_(i))}catch(r){s(r instanceof Error?r:new Error(String(r)))}},0)});const e=++V_;return new Promise((n,s)=>{bs.set(e,{resolve:n,reject:s}),t.postMessage({id:e,data:JSON.parse(JSON.stringify(i))})})}const W_={TON:"TONF",KG:"KGF",KIPS:"KIP",LBF:"LB",LBS:"LB",FEET:"FT",INCH:"IN"};function X_(i){const[t,e]=i.split(/[\s,;/-]+/).filter(Boolean).map(n=>{const s=n.toUpperCase();return W_[s]??s});return rs.find(n=>n.force.toUpperCase()===t&&n.length.toUpperCase()===e)}const $_="StructApp3D",j_="1.0";class De extends Error{}const za=`\r
`,q_=["rect","circle","pipe","I","box","unp","C","general"],Y_=["XY","XZ","YZ"];function J_(i){let t=typeof i=="number"?Z_(i):typeof i=="boolean"?i?"Yes":"No":i;return(/[",\r\n]/.test(t)||/^\s|\s$/.test(t))&&(t='"'+t.replace(/"/g,'""')+'"'),t}function Z_(i){return!Number.isFinite(i)||Math.abs(i)<1e-300?"0":String(Number(i.toPrecision(12)))}function ka(i){return i.map(J_).join(",")}function we(i,t,e){return[ka(["TABLE",i]),ka(t),...e.map(ka)].join(za)+za+za}const Va=i=>i?1:0;function Xi(i,t,e){if(e<=i[0])return t[0];for(let n=1;n<i.length;n++)if(e<=i[n]+1e-12){const s=i[n]-i[n-1];return s<=1e-12?t[n]:t[n-1]+(t[n]-t[n-1])*(e-i[n-1])/s}return t[t.length-1]}function lh(i,t,e=new Date,n=ln()){const s=(u,f)=>ml(u,f,n),r=u=>jt(u,n,!0),a=r("F"),o=r("M"),l=r("L");let c="";c+=we("PROGRAM",["Program","Version","Units","Saved"],[[$_,j_,`${n.force}, ${n.length}, C`,e.toISOString()]]);const h=i.settings;c+=we("SETTINGS",["GridSpacing","GridLines","WorkPlane","Elevation","SelfWeight"],[[s(h.gridSpacing,"L"),h.gridLines,h.workPlane,s(h.elevation,"L"),Va(h.selfWeight)]]),c+=we("MATERIALS",["Name",`E (${r("FA")})`,"Poisson",`UnitWeight (${r("FV")})`],i.materials.map(u=>[u.name,s(u.E,"FA"),u.nu,s(u.gamma,"FV")])),c+=we("SECTIONS",["Name","Shape","Dim1","Dim2","Dim3","Dim4",`A (${r("A")})`,`I33 (${r("L4")})`,`I22 (${r("L4")})`,`J (${r("L4")})`,`As2 (${r("A")})`,`As3 (${r("A")})`],i.sections.map(u=>{const f=wi(u),p=[0,1,2,3].map(g=>u.dims[g]===void 0?"":s(u.dims[g],Gr(u.shape,g)));return[u.name,u.shape,...p,s(f.A,"A"),s(f.I33,"L4"),s(f.I22,"L4"),s(f.J,"L4"),s(f.As2,"A"),s(f.As3,"A")]})),c+=we("SUPPORT TYPES",["Name",...ii],i.supportTypes.map(u=>[u.name,...u.r.map(Va)])),c+=we("JOINTS",["ID",`X (${l})`,`Y (${l})`,`Z (${l})`],i.joints.map(u=>[u.id,s(u.x,"L"),s(u.y,"L"),s(u.z,"L")])),c+=we("JOINT RESTRAINTS",["Joint",...ii],i.joints.filter(u=>u.r.some(Boolean)).map(u=>[u.id,...u.r.map(Va)]));const d=new Map(i.joints.map(u=>[u.id,u]));if(c+=we("FRAMES",["ID","JointI","JointJ","Material","Section","Beta (deg)","Rel_I","Rel_J",`Length (${l})`],i.frames.map(u=>{const f=d.get(u.i),p=d.get(u.j),g=f&&p?Math.hypot(p.x-f.x,p.y-f.y,p.z-f.z):0;return[u.id,u.i,u.j,u.material,u.section,u.beta,Nr(u.relI),Nr(u.relJ),s(g,"L")]})),c+=we("AREAS",["ID","Joints","Distribution","NumJoints"],i.areas.map(u=>[u.id,u.joints.join(" "),u.distribution,u.joints.length])),c+=we("LOAD CASES",["Name","Type"],i.loadCases.map(u=>[u.name,u.type])),c+=we("LOAD COMBOS",["Combo","LoadCase","Factor"],i.loadCombos.flatMap(u=>u.factors.length?u.factors.map(f=>[u.name,f.case,f.factor]):[[u.name,"",""]])),c+=we("JOINT LOADS",["Joint",`FX (${a})`,`FY (${a})`,`FZ (${a})`,`MX (${o})`,`MY (${o})`,`MZ (${o})`,"LoadCase"],i.jointLoads.map(u=>[u.joint,...u.f.map((f,p)=>s(f,p<3?"F":"M")),u.case])),c+=we("FRAME POINT LOADS",["Frame","Direction",`P (${a})`,"RelDist","LoadCase"],i.framePointLoads.map(u=>[u.frame,u.dir,s(u.P,"F"),u.rd,u.case])),c+=we("FRAME UNIFORM LOADS",["Frame","Direction",`W (${r("FL")})`,"LoadCase"],i.frameUniformLoads.map(u=>[u.frame,u.dir,s(u.w,"FL"),u.case])),c+=we("AREA LOADS",["Area",`Q (${r("FA")}, downward)`,"LoadCase"],i.areaLoads.map(u=>[u.area,s(u.q,"FA"),u.case])),t){const u=t.items.map(p=>[p.name,t.results[p.name]]).filter(([,p])=>p);c+=we("RESULTS JOINT DISPLACEMENTS",["Case","Joint",`UX (${l})`,`UY (${l})`,`UZ (${l})`,"RX (rad)","RY (rad)","RZ (rad)"],u.flatMap(([p,g])=>Object.entries(g.disp).map(([m,v])=>[p,Number(m),...v.map((_,M)=>M<3?s(_,"L"):_)]))),c+=we("RESULTS JOINT REACTIONS",["Case","Joint",`FX (${a})`,`FY (${a})`,`FZ (${a})`,`MX (${o})`,`MY (${o})`,`MZ (${o})`],u.flatMap(([p,g])=>Object.entries(g.reactions).map(([m,v])=>[p,Number(m),...v.map((_,M)=>s(_,M<3?"F":"M"))])));const f=[];for(const[p,g]of u)for(const m of g.frames)for(let _=0;_<=10;_++){const M=m.L*_/10;f.push([p,m.id,s(M,"L"),s(Xi(m.x,m.P,M),"F"),s(Xi(m.x,m.V2,M),"F"),s(Xi(m.x,m.V3,M),"F"),s(Xi(m.x,m.T,M),"M"),s(Xi(m.x,m.M2,M),"M"),s(Xi(m.x,m.M3,M),"M")])}c+=we("RESULTS FRAME FORCES",["Case","Frame",`Station (${l})`,`P (${a})`,`V2 (${a})`,`V3 (${a})`,`T (${o})`,`M2 (${o})`,`M3 (${o})`],f)}return c}function K_(i){i.charCodeAt(0)===65279&&(i=i.slice(1));const t=i.slice(0,i.search(/\r?\n|$/)),e=!t.includes(",")&&t.includes(";")?";":",",n=[];let s=[],r="",a=!1;for(let o=0;o<i.length;o++){const l=i[o];a?l==='"'?i[o+1]==='"'?(r+='"',o++):a=!1:r+=l:l==='"'?a=!0:l===e?(s.push(r),r=""):l===`
`||l==="\r"?(l==="\r"&&i[o+1]===`
`&&o++,s.push(r),n.push(s),s=[],r=""):r+=l}return(r!==""||s.length)&&(s.push(r),n.push(s)),n}function Q_(i){const t=[];let e=null,n=!1;return i.forEach((s,r)=>{const a=s.map(o=>o.trim());for(;a.length&&a[a.length-1]==="";)a.pop();if(!a.length){e=null;return}if(a[0].toUpperCase()==="TABLE"){e={name:(a[1]??"").toUpperCase(),header:[],rows:[]},t.push(e),n=!0;return}if(e){if(n){e.header=a.map(o=>o.replace(/\s*\(.*\)\s*$/,"").trim().toUpperCase()),n=!1;return}e.rows.push({cells:a,line:r+1})}}),t}class tx{constructor(t,e,n){this.t=t,this.cells=e,this.line=n}idx(t,e){const n=this.t.header.indexOf(t.toUpperCase());return n>=0?n:e}str(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new De(`Line ${this.line} (${this.t.name}): missing ${t}`)}return s}num(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new De(`Line ${this.line} (${this.t.name}): missing ${t}`)}const r=Number(s.replace(/\s/g,""));if(!Number.isFinite(r))throw new De(`Line ${this.line} (${this.t.name}): "${s}" is not a number (${t})`);return r}bool(t,e){const n=(this.cells[this.idx(t,e)]??"").toUpperCase();return n==="1"||n==="YES"||n==="TRUE"||n==="Y"}}function ch(i,t){const e=Q_(K_(i));if(!e.length)throw new De('No tables found. A .sav file must contain rows like "TABLE,JOINTS".');const n=_=>e.find(M=>M.name===_),s=_=>{const M=n(_);return M?M.rows.map(x=>new tx(M,x.cells,x.line)):[]},r=Yo(),a=s("PROGRAM")[0],o=a?a.str("Units",2,""):"",l=o?X_(o):Ho;if(!l)throw new De(`PROGRAM: unknown units "${o}". Use one of: ${rs.map(_=>`${_.force}, ${_.length}`).join(" / ")}`);t&&o&&(t.units=l.id);const c=(_,M)=>Su(_,M,l),h=s("SETTINGS")[0];if(h){r.settings.gridSpacing=h.num("GridSpacing",0,NaN),Number.isFinite(r.settings.gridSpacing)?r.settings.gridSpacing=c(r.settings.gridSpacing,"L"):r.settings.gridSpacing=1,r.settings.gridLines=Math.round(h.num("GridLines",1,10));const _=h.str("WorkPlane",2,"XY").toUpperCase();r.settings.workPlane=Y_.includes(_)?_:"XY",r.settings.elevation=c(h.num("Elevation",3,0),"L"),r.settings.selfWeight=h.bool("SelfWeight",4)}n("MATERIALS")&&(r.materials=s("MATERIALS").map(_=>({name:_.str("Name",0),E:c(_.num("E",1),"FA"),nu:_.num("Poisson",2,.3),gamma:c(_.num("UnitWeight",3,0),"FV")}))),n("SECTIONS")&&(r.sections=s("SECTIONS").map(_=>{const M=_.str("Shape",1),x=q_.find(T=>T.toUpperCase()===M.toUpperCase());if(!x)throw new De(`Line ${_.line} (SECTIONS): unknown shape "${M}"`);const D=[];for(let T=1;T<=4;T++){const R=_.num("Dim"+T,1+T,NaN);if(Number.isFinite(R))D.push(c(R,Gr(x,T-1)));else break}return{name:_.str("Name",0),shape:x,dims:D}})),n("SUPPORT TYPES")&&(r.supportTypes=s("SUPPORT TYPES").map(_=>({name:_.str("Name",0),r:ii.map((M,x)=>_.bool(M,x+1))}))),r.joints=s("JOINTS").map(_=>({id:_.num("ID",0),x:c(_.num("X",1),"L"),y:c(_.num("Y",2),"L"),z:c(_.num("Z",3),"L"),r:[!1,!1,!1,!1,!1,!1]}));const d=new Map(r.joints.map(_=>[_.id,_]));if(d.size!==r.joints.length)throw new De("JOINTS: duplicate joint IDs");for(const _ of s("JOINT RESTRAINTS")){const M=_.num("Joint",0),x=d.get(M);if(!x)throw new De(`Line ${_.line} (JOINT RESTRAINTS): joint ${M} does not exist`);x.r=ii.map((D,T)=>_.bool(D,T+1))}const u=(_,M,x)=>{if(!d.has(_))throw new De(`Line ${M.line} (${x}): joint ${_} does not exist`);return _};r.frames=s("FRAMES").map(_=>{var T,R;const M=Tl(_.str("Rel_I",-1,"None")),x=Tl(_.str("Rel_J",-1,"None")),D={id:_.num("ID",0),i:u(_.num("JointI",1),_,"FRAMES"),j:u(_.num("JointJ",2),_,"FRAMES"),material:_.str("Material",3,((T=r.materials[0])==null?void 0:T.name)??""),section:_.str("Section",4,((R=r.sections[0])==null?void 0:R.name)??""),beta:_.num("Beta",5,0)};return M&&(D.relI=M),x&&(D.relJ=x),D});const f=new Set(r.frames.map(_=>_.id));if(f.size!==r.frames.length)throw new De("FRAMES: duplicate frame IDs");r.areas=s("AREAS").map(_=>{const M=_.str("Joints",1).split(/[\s;|]+/).filter(Boolean).map(Number);M.forEach(D=>u(D,_,"AREAS"));const x=_.str("Distribution",2,"two-way").toLowerCase();return{id:_.num("ID",0),joints:M,distribution:x==="one-way"?"one-way":"two-way"}});const p=new Set(r.areas.map(_=>_.id)),g=_=>{const M=_.str("Direction",1).toUpperCase();if(!Sh.includes(M))throw new De(`Line ${_.line}: unknown load direction "${M}"`);return M},m=(_,M)=>{if(!f.has(_))throw new De(`Line ${M.line}: frame ${_} does not exist`);return _};if(n("LOAD CASES")&&(r.loadCases=s("LOAD CASES").map(_=>{const M=_.str("Type",1,"Other"),x=bh.find(D=>D.toUpperCase()===M.toUpperCase())??"Other";return{name:_.str("Name",0),type:x}}),new Set(r.loadCases.map(_=>_.name)).size!==r.loadCases.length))throw new De("LOAD CASES: duplicate names");if(n("LOAD COMBOS")){r.loadCombos=[];for(const _ of s("LOAD COMBOS")){const M=_.str("Combo",0);let x=r.loadCombos.find(T=>T.name===M);x||r.loadCombos.push(x={name:M,factors:[]});const D=_.str("LoadCase",1,"");if(D){if(!r.loadCases.some(T=>T.name===D))throw new De(`Line ${_.line} (LOAD COMBOS): load case "${D}" does not exist`);x.factors.push({case:D,factor:_.num("Factor",2)})}}}const v=_=>{const M=_.str("LoadCase",99,"");if(M&&!r.loadCases.some(x=>x.name===M))throw new De(`Line ${_.line}: load case "${M}" does not exist`);return M};return r.jointLoads=s("JOINT LOADS").map(_=>({case:v(_),joint:u(_.num("Joint",0),_,"JOINT LOADS"),f:["FX","FY","FZ","MX","MY","MZ"].map((M,x)=>c(_.num(M,x+1,0),x<3?"F":"M"))})),r.framePointLoads=s("FRAME POINT LOADS").map(_=>({case:v(_),frame:m(_.num("Frame",0),_),dir:g(_),P:c(_.num("P",2),"F"),rd:Math.min(1,Math.max(0,_.num("RelDist",3,.5)))})),r.frameUniformLoads=s("FRAME UNIFORM LOADS").map(_=>({case:v(_),frame:m(_.num("Frame",0),_),dir:g(_),w:c(_.num("W",2),"FL")})),r.areaLoads=s("AREA LOADS").map(_=>{const M=_.num("Area",0);if(!p.has(M))throw new De(`Line ${_.line} (AREA LOADS): area ${M} does not exist`);return{case:v(_),area:M,q:c(_.num("Q",1),"FA")}}),Br(r),r}const Au=[{description:"StructApp 3D model",accept:{"text/csv":[".sav"]}}],Tu=i=>i instanceof DOMException&&i.name==="AbortError";function hh(i){return i=i.trim()||"model",/\.sav$/i.test(i)?i:i.replace(/\.[^.]*$/,"")+".sav"}async function ex(i,t,e){const n=window;if(n.showSaveFilePicker)try{const l=e??await n.showSaveFilePicker({suggestedName:hh(t),types:Au}),c=await l.createWritable();return await c.write(i),await c.close(),{name:l.name,handle:l}}catch(l){if(Tu(l))return null;console.warn("File System Access save failed, falling back to download",l)}const s=hh(t),r=new Blob([i],{type:"text/csv;charset=utf-8"}),a=URL.createObjectURL(r),o=document.createElement("a");return o.href=a,o.download=s,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e4),{name:s,handle:null}}const nx=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;async function ix(){const i=window;if(i.showOpenFilePicker)try{const[t]=await i.showOpenFilePicker({types:Au}),e=await t.getFile();return{name:e.name,text:await e.text(),handle:t}}catch(t){if(Tu(t))return null;console.warn("File System Access open failed, falling back to input",t)}return new Promise(t=>{const e=document.createElement("input");e.type="file",nx()||(e.accept=".sav,.csv,text/csv,text/plain"),e.style.display="none",document.body.appendChild(e);let n=!1;e.addEventListener("change",async()=>{var r;n=!0;const s=(r=e.files)==null?void 0:r[0];if(e.remove(),!s)return t(null);t({name:s.name,text:await s.text(),handle:null})}),e.addEventListener("cancel",()=>{n||t(null),e.remove()}),e.click()})}const vl="structapp3d.autosave";function sx(i,t){try{localStorage.setItem(vl,JSON.stringify({text:i,name:t,time:Date.now()}))}catch{}}function rx(){try{const i=localStorage.getItem(vl);return i?JSON.parse(i):null}catch{return null}}function _s(){try{localStorage.removeItem(vl)}catch{}}function ax(i,t,e,n=1e-9){const s=i.length;if(!s)return{left:0,right:0};if(e<=i[0]+n){let r=0;for(;r+1<s&&i[r+1]<=i[0]+n;)r++;return{left:t[0],right:t[r]}}if(e>=i[s-1]-n){let r=s-1;for(;r>0&&i[r-1]>=i[s-1]-n;)r--;return{left:t[r],right:t[s-1]}}for(let r=1;r<s;r++){if(Math.abs(i[r]-e)<=n){let a=r;for(;a+1<s&&Math.abs(i[a+1]-e)<=n;)a++;return{left:t[r],right:t[a]}}if(i[r]>e){const a=i[r]-i[r-1],o=a<=n?t[r]:t[r-1]+(t[r]-t[r-1])*(e-i[r-1])/a;return{left:o,right:o}}}return{left:t[s-1],right:t[s-1]}}function ox(i,t,e){const n=i.axes[t],s=i.disp.map(o=>o[0]*n[0]+o[1]*n[1]+o[2]*n[2]);if(!e||s.length<2||i.L<=0)return s;const r=s[0],a=s[s.length-1];return s.map((o,l)=>o-(r+(a-r)*i.x[l]/i.L))}const lx="http://www.w3.org/2000/svg",xs=360,di=96,wr=14,Ar=14;function Pe(i,t){const e=document.createElementNS(lx,i);for(const[n,s]of Object.entries(t))e.setAttribute(n,String(s));return e}let ke=null,Cu="major",Ru=!1;const $i=(i,t,e)=>({title:i,ys:t,conv:n=>$t(n,e),unit:jt(e)});function cx(i,t,e){const n=ln(),s=(r,a)=>({title:`Deflection ${a}${e?" (relative to chord)":""}`,ys:ox(i,r,e),conv:o=>kn(o/n.kSmall),unit:n.small});return t==="axial"?[$i("Axial force P",i.P,"F"),$i("Torsion T",i.T,"M")]:t==="major"?[$i("Shear V2",i.V2,"F"),{...$i("Moment M3",i.M3,"M"),reversed:!0},s(1,"δ2 (local 2)")]:[$i("Shear V3",i.V3,"F"),{...$i("Moment M2",i.M2,"M"),reversed:!0},s(2,"δ3 (local 3)")]}function hx(i,t,e,n){const s=i.x,r=i.L||1;let a=Math.min(0,...t.ys),o=Math.max(0,...t.ys);o-a<1e-12&&(a=-1,o=1);const l=y=>wr+(xs-2*wr)*y/r,c=y=>t.reversed?Ar+(di-2*Ar)*(y-a)/(o-a):Ar+(di-2*Ar)*(o-y)/(o-a),h=Pe("svg",{viewBox:`0 0 ${xs} ${di}`,class:"fd-svg",preserveAspectRatio:"none"}),d="fdg_"+Math.random().toString(36).slice(2,9),u=c(0),f=Math.min(Math.max(u/di*100,0),100).toFixed(2),p=t.reversed?"var(--neg)":"var(--pos)",g=t.reversed?"var(--pos)":"var(--neg)",m=Pe("defs",{}),v=Pe("linearGradient",{id:`${d}_f`,gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:di});v.append(Pe("stop",{offset:"0%","stop-color":p,"stop-opacity":.35}),Pe("stop",{offset:`${f}%`,"stop-color":p,"stop-opacity":.35}),Pe("stop",{offset:`${f}%`,"stop-color":g,"stop-opacity":.35}),Pe("stop",{offset:"100%","stop-color":g,"stop-opacity":.35}));const _=Pe("linearGradient",{id:`${d}_l`,gradientUnits:"userSpaceOnUse",x1:0,y1:0,x2:0,y2:di});_.append(Pe("stop",{offset:"0%","stop-color":p,"stop-opacity":1}),Pe("stop",{offset:`${f}%`,"stop-color":p,"stop-opacity":1}),Pe("stop",{offset:`${f}%`,"stop-color":g,"stop-opacity":1}),Pe("stop",{offset:"100%","stop-color":g,"stop-opacity":1})),m.append(v,_),h.append(m);const M=s.map((y,A)=>`${l(y).toFixed(2)},${c(t.ys[A]).toFixed(2)}`);h.append(Pe("polygon",{points:`${l(0)},${c(0)} ${M.join(" ")} ${l(r)},${c(0)}`,class:"fd-fill",fill:`url(#${d}_f)`}),Pe("line",{x1:l(0),y1:c(0),x2:l(r),y2:c(0),class:"fd-axis"}),Pe("polyline",{points:M.join(" "),class:"fd-line",stroke:`url(#${d}_l)`}));let x=0,D=0;t.ys.forEach((y,A)=>{y>t.ys[x]&&(x=A),y<t.ys[D]&&(D=A)});const T=(y,A)=>{if(Math.abs(t.ys[y])<1e-12)return;const V=Math.min(Math.max(l(s[y]),30),xs-30),F=Pe("text",{x:V,y:c(t.ys[y])+(A?-3:11),class:"fd-val","text-anchor":"middle"});F.textContent=t.conv(t.ys[y]),h.append(F)};T(x,!t.reversed),D!==x&&T(D,!!t.reversed),e!==null&&h.append(Pe("line",{x1:l(e),y1:2,x2:l(e),y2:di-2,class:"fd-cursor"}));const R=y=>{const A=h.getBoundingClientRect(),V=(y.clientX-A.left)/A.width*xs;n(Math.min(Math.max((V-wr)/(xs-2*wr)*r,0),r))};h.addEventListener("pointerdown",y=>{y.preventDefault(),h.setPointerCapture(y.pointerId),R(y);const A=F=>R(F),V=()=>{h.removeEventListener("pointermove",A),h.removeEventListener("pointerup",V),h.removeEventListener("pointercancel",V)};h.addEventListener("pointermove",A),h.addEventListener("pointerup",V),h.addEventListener("pointercancel",V)});let I="",S="";if(e!==null){const y=ax(s,t.ys,e),A=Math.abs(y.left)>=Math.abs(y.right)?y.left:y.right;Math.abs(A)>1e-12&&(S=A>0?"var(--pos)":"var(--neg)"),I=Math.abs(y.left-y.right)>1e-9*Math.max(1,Math.abs(y.left),Math.abs(y.right))?`${t.conv(y.left)} / ${t.conv(y.right)} ${t.unit} (left / right)`:`${t.conv(y.left)} ${t.unit}`}return C("div",{class:"fd-plot"},C("div",{class:"fd-plot-head"},C("span",{class:"fd-plot-title"},`${t.title} [${t.unit}]`),C("span",{class:"fd-readout",style:S?`color: ${S}`:""},I)),h)}function Mi(){var c;if(!ke)return;const i=ke,t=i.app.resultSet;if(!t)return Xr();t.results[i.caseName]||(i.caseName=i.app.resultName);const e=(c=t.results[i.caseName])==null?void 0:c.frames.find(h=>h.id===i.frameId);if(!e)return Xr();i.cursor!==null&&(i.cursor=Math.min(i.cursor,e.L));const n=C("select",{class:"fd-case","aria-label":"Load case or combination"},...t.items.map(h=>C("option",{value:h.name},`${h.kind==="combo"?"Combo":"Case"}: ${h.name}`)));n.value=i.caseName,n.addEventListener("change",()=>{i.caseName=n.value,Mi()});const s=C("select",{class:"fd-view","aria-label":"Diagram"},C("option",{value:"axial"},"Axial P & torsion T"),C("option",{value:"major"},"Major: V2, M3, deflection"),C("option",{value:"minor"},"Minor: V3, M2, deflection"));s.value=i.view,s.addEventListener("change",()=>{i.view=Cu=s.value,Mi()});const r=C("div",{class:"fd-controls"},n,s);if(i.view!=="axial"){const h=C("select",{class:"fd-rel","aria-label":"Deflection reference"},C("option",{value:"abs"},"Absolute deflection"),C("option",{value:"rel"},"Relative to chord"));h.value=i.relative?"rel":"abs",h.addEventListener("change",()=>{i.relative=Ru=h.value==="rel",Mi()}),r.append(h)}const a=h=>{i.cursor=h,Mi()},o=cx(e,i.view,i.relative).map(h=>hx(e,h,i.cursor,a)),l=i.cursor===null?"Tap or drag on a diagram to read values.":`x = ${$t(i.cursor,"L")} ${jt("L")} from joint i (L = ${$t(e.L,"L")} ${jt("L")})`;i.body.replaceChildren(r,C("div",{class:"fd-pos muted small"},l),...o),i.el.querySelector(".fd-title").textContent=`Frame ${i.frameId} diagrams`}function ux(i,t){t.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;e.preventDefault();const n=i.getBoundingClientRect(),s=e.clientX-n.left,r=e.clientY-n.top;t.setPointerCapture(e.pointerId);const a=l=>{const c=Math.min(Math.max(l.clientX-s,0),window.innerWidth-60),h=Math.min(Math.max(l.clientY-r,0),window.innerHeight-40);i.style.left=`${c}px`,i.style.top=`${h}px`,i.style.right="auto",i.style.bottom="auto",ke&&(ke.pos={left:c,top:h})},o=()=>{t.removeEventListener("pointermove",a),t.removeEventListener("pointerup",o),t.removeEventListener("pointercancel",o)};t.addEventListener("pointermove",a),t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o)})}function qo(i,t){if(!i.resultSet)return;if(ke){ke.frameId=t,ke.cursor=null,ke.caseName=i.resultName,Mi();return}const e=C("div",{class:"fd-body"}),n=C("button",{class:"fd-close","aria-label":"Close diagrams",title:"Close"},"✕"),s=C("div",{class:"fd-head"},C("span",{class:"fd-title"}),n),r=C("div",{class:"frame-diagrams",role:"dialog","aria-label":"Frame diagrams"},s,e);for(const a of["contextmenu","selectstart","dragstart"])r.addEventListener(a,o=>o.preventDefault());r.addEventListener("pointerdown",a=>a.stopPropagation()),r.addEventListener("wheel",a=>a.stopPropagation()),n.addEventListener("click",()=>Xr()),ux(r,s),document.body.append(r),ke={app:i,frameId:t,caseName:i.resultName,view:Cu,relative:Ru,cursor:null,el:r,body:e,pos:null},Mi()}function Xr(){ke==null||ke.el.remove(),ke=null}function uh(i){ke&&(ke.app=i,Mi())}const dx=(i,t)=>i.every((e,n)=>e===t[n]),_l=i=>i.some(Boolean)?ii.filter((t,e)=>i[e]).join(" "):"Free";function Hs(i,t,e){return i?/[,;"\r\n]/.test(i)?`${e} name cannot contain commas, semicolons or quotes`:t.includes(i)?`${e} "${i}" already exists`:null:`${e} name is required`}function Sn(i,t){return C("div",{class:"table-wrap"},C("table",{class:"grid-table"},C("thead",null,C("tr",null,...i.map(e=>C("th",null,e)))),C("tbody",null,...t.map(e=>C("tr",null,...e.map(n=>C("td",null,n)))))))}const _e=i=>(Wt(i,"error"),!1),me=(i,t,e="small")=>C("button",{class:"btn "+e,type:"button",onclick:t},i);function fx(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name",`E (${jt("FA")})`,"ν",`γ (${jt("FV")})`,"Used by",""],t.data.materials.map(a=>{const o=t.data.frames.filter(l=>l.material===a.name).length;return[document.createTextNode(a.name),document.createTextNode($t(a.E,"FA",5)),document.createTextNode(String(a.nu)),document.createTextNode($t(a.gamma,"FV",5)),document.createTextNode(o?`${o} frame(s)`:"–"),C("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))]})),C("div",{class:"dlg-actions"},me("+ Add material",()=>r(null),"primary")))},s=async a=>{const o=t.data.frames.filter(l=>l.material===a.name).length;if(o)return void vi("Cannot delete",`Material "${a.name}" is assigned to ${o} frame(s). Assign another material to them first.`);await as("Delete material",`Delete material "${a.name}"?`,"Delete",!0)&&(t.commit("delete material",l=>{l.materials=l.materials.filter(c=>c.name!==a.name)}),n())},r=a=>{const o=Gs("Name",(a==null?void 0:a.name)??`MAT${t.data.materials.length+1}`),l=ae("Elastic modulus E",(a==null?void 0:a.E)??2e8,{q:"FA",positive:!0}),c=ae("Poisson's ratio ν",(a==null?void 0:a.nu)??.3,{min:0,max:.4999}),h=ae("Unit weight γ",(a==null?void 0:a.gamma)??78.5,{q:"FV",min:0}),d=C("div",{class:"chips"},C("span",{class:"muted"},"Presets: "),me("Steel",()=>(l.set(2e8),c.set(.3),h.set(76.98))),me("Concrete C30",()=>(l.set(25743e3),c.set(.2),h.set(23.56))),me("Aluminium",()=>(l.set(7e7),c.set(.33),h.set(26.6))),me("Timber",()=>(l.set(11e6),c.set(.3),h.set(5))));oe({title:a?`Edit material ${a.name}`:"Add material",body:C("div",{class:"form"},o.row,l.row,c.row,h.row,d),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const u=o.get(),f=Hs(u,t.data.materials.filter(g=>g!==a).map(g=>g.name),"Material"),p=[l.get(),c.get(),h.get()];if(f)return _e(f);if(p.some(g=>!Number.isFinite(g)))return _e("Fix the highlighted fields");t.commit(a?"edit material":"add material",g=>{const m={name:u,E:p[0],nu:p[1],gamma:p[2]};if(a){const v=a.name,_=g.materials.findIndex(M=>M.name===v);if(g.materials[_]=m,v!==u)for(const M of g.frames)M.material===v&&(M.material=u)}else g.materials.push(m)}),n()}}]})};n(),oe({title:"Define materials",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function px(i){const t="http://www.w3.org/2000/svg",e=document.createElementNS(t,"svg");e.setAttribute("viewBox","-60 -60 120 120"),e.setAttribute("class","sketch");const n=wi(i),s=i.dims,a=80/Math.max(n.depth,n.width,1e-9),o=(h,d)=>{const u=document.createElementNS(t,h);for(const[f,p]of Object.entries(d))u.setAttribute(f,String(p));return e.append(u),u},l={class:"sk-shape","fill-rule":"evenodd"},c=(h,d,u=0,f=0)=>`M${u-h/2},${f-d/2}h${h}v${d}h${-h}z`;switch(i.shape){case"rect":o("path",{...l,d:c(s[1]*a,s[0]*a)});break;case"circle":o("circle",{...l,r:s[0]/2*a});break;case"pipe":{const h=s[0]/2*a,d=Math.max(h-s[1]*a,0);o("path",{...l,d:`M${-h},0a${h},${h} 0 1,0 ${2*h},0a${h},${h} 0 1,0 ${-2*h},0zM${-d},0a${d},${d} 0 1,0 ${2*d},0a${d},${d} 0 1,0 ${-2*d},0z`});break}case"I":{const[h,d,u,f]=s.map(p=>p*a);o("path",{...l,d:c(d,u,0,-h/2+u/2)+c(d,u,0,h/2-u/2)+c(f,h-2*u)});break}case"box":{const[h,d,u,f]=s.map(p=>p*a);o("path",{...l,d:c(d,h)+c(Math.max(d-2*f,0),Math.max(h-2*u,0))});break}case"unp":case"C":{const h=vu(i);o("path",{...l,d:"M"+h.map(([d,u])=>`${d*a},${-u*a}`).join("L")+"z"});break}case"general":o("text",{x:0,y:4,"text-anchor":"middle",class:"sk-text"}).textContent="General";break}return o("line",{x1:0,y1:0,x2:0,y2:-52,class:"sk-axis"}),o("line",{x1:0,y1:0,x2:-52,y2:0,class:"sk-axis"}),o("text",{x:4,y:-48,class:"sk-text"}).textContent="2",o("text",{x:-54,y:-4,class:"sk-text"}).textContent="3",e}function mx(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name","Shape",`Dimensions (${jt("L")})`,`A (${jt("A")})`,`I33 (${jt("L4")})`,"Used by",""],t.data.sections.map(a=>{const o=wi(a),l=t.data.frames.filter(c=>c.section===a.name).length;return[document.createTextNode(a.name),document.createTextNode(Ps[a.shape]),document.createTextNode(a.dims.map((c,h)=>$t(c,Gr(a.shape,h),4)).join(" × ")),document.createTextNode($t(o.A,"A",4)),document.createTextNode($t(o.I33,"L4",4)),document.createTextNode(l?`${l} frame(s)`:"–"),C("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))]})),C("div",{class:"dlg-actions"},me("+ Add section",()=>r(null),"primary")))},s=async a=>{const o=t.data.frames.filter(l=>l.section===a.name).length;if(o)return void vi("Cannot delete",`Section "${a.name}" is assigned to ${o} frame(s). Assign another section to them first.`);await as("Delete section",`Delete section "${a.name}"?`,"Delete",!0)&&(t.commit("delete section",l=>{l.sections=l.sections.filter(c=>c.name!==a.name)}),n())},r=a=>{const o=Gs("Name",(a==null?void 0:a.name)??`SEC${t.data.sections.length+1}`),l=Object.keys(Ps),c=tn("Shape",l.map(_=>[_,Ps[_]]),(a==null?void 0:a.shape)??"rect"),h=C("div",{class:"form"}),d=C("div",{class:"props"}),u=C("div",{class:"sketch-box"});let f=[];const p={rect:[.5,.3],circle:[.4],pipe:[.1683,.0071],I:[.3,.15,.009,.0065],box:[.2,.2,.008,.008],unp:[.2,.075,.0115,.0085],C:[.15,.065,.02,.0023],general:[.01,1e-4,1e-5,1e-6]},g=()=>({name:o.get(),shape:c.get(),dims:f.map(_=>_.get())}),m=()=>{const _=g(),M=_.dims.some(D=>!Number.isFinite(D))?"Enter all dimensions":Yc(_);if(u.replaceChildren(M?C("div",{class:"field-err"},M):px(_)),M)return void d.replaceChildren();const x=wi(_);d.replaceChildren(Sn([`A (${jt("A")})`,`I33 (${jt("L4")})`,`I22 (${jt("L4")})`,`J (${jt("L4")})`,`As2 (${jt("A")})`,`As3 (${jt("A")})`],[[$t(x.A,"A"),$t(x.I33,"L4"),$t(x.I22,"L4"),$t(x.J,"L4"),$t(x.As2,"A"),$t(x.As3,"A")].map(D=>document.createTextNode(D))]))},v=_=>{const M=c.get(),x=_&&a&&a.shape===M?a.dims:p[M];f=pu[M].map((D,T)=>ae(D,x[T],{q:Gr(M,T),positive:!0})),h.replaceChildren(...f.map(D=>D.row));for(const D of f)D.input.addEventListener("input",m);m()};c.input.addEventListener("change",()=>v(!1)),v(!0),oe({title:a?`Edit section ${a.name}`:"Add frame section",wide:!0,body:C("div",{class:"two-col"},C("div",{class:"form"},o.row,c.row,h),C("div",null,u,d,C("p",{class:"muted small"},"Local axis 2 is the section depth direction (up for horizontal members); local 3 is the width direction."))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const _=g(),M=Hs(_.name,t.data.sections.filter(x=>x!==a).map(x=>x.name),"Section")??(_.dims.some(x=>!Number.isFinite(x))?"Enter all dimensions":Yc(_));if(M)return _e(M);t.commit(a?"edit section":"add section",x=>{if(a){const D=a.name;if(x.sections[x.sections.findIndex(T=>T.name===D)]=_,D!==_.name)for(const T of x.frames)T.section===D&&(T.section=_.name)}else x.sections.push(_)}),n()}}]})};n(),oe({title:"Define frame sections",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function Lu(i){const t=ii.map((n,s)=>gl(n,i[s]));return{el:C("div",{class:"restraints"},C("div",{class:"muted small"},"Translations"),C("div",{class:"chk-row"},...t.slice(0,3).map(n=>n.row)),C("div",{class:"muted small"},"Rotations"),C("div",{class:"chk-row"},...t.slice(3).map(n=>n.row))),checks:t,get:()=>t.map(n=>n.get()),set:n=>t.forEach((s,r)=>s.set(n[r]))}}function dh(i,t){const e=i?[...i]:[!1,!1,!1,!1,!1,!1],n=Vu.map((r,a)=>gl(r,e[a]));return{el:C("div",{class:"releases-group"},t?C("div",{class:"muted small"},t):null,C("div",{class:"chk-row"},...n.map(r=>r.row))),checks:n,get:()=>{const r=n.map(a=>a.get());return r.some(Boolean)?r:void 0},set:r=>{const a=r??[!1,!1,!1,!1,!1,!1];n.forEach((o,l)=>o.set(a[l]))}}}function gx(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name","Restrained DOF",""],t.data.supportTypes.map(a=>[document.createTextNode(a.name),document.createTextNode(_l(a.r)),C("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))])),C("div",{class:"dlg-actions"},me("+ Add support type",()=>r(null),"primary")),C("p",{class:"muted small"},"Support types are presets. Assign them to joints with Assign → Joint supports."))},s=a=>{t.commit("delete support type",o=>{o.supportTypes=o.supportTypes.filter(l=>l.name!==a.name)}),n()},r=a=>{const o=Gs("Name",(a==null?void 0:a.name)??`Support${t.data.supportTypes.length+1}`),l=Lu((a==null?void 0:a.r)??[!0,!0,!0,!1,!1,!1]);oe({title:a?`Edit support ${a.name}`:"Add support type",body:C("div",{class:"form"},o.row,l.el),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=o.get(),h=Hs(c,t.data.supportTypes.filter(d=>d!==a).map(d=>d.name),"Support");if(h)return _e(h);t.commit("edit support type",d=>{const u={name:c,r:l.get()};a?d.supportTypes[d.supportTypes.findIndex(f=>f.name===a.name)]=u:d.supportTypes.push(u)}),n()}}]})};n(),oe({title:"Define support types",body:e,buttons:[{label:"Close",kind:"primary"}]})}function fh(i){const t=i.model.data.settings,e=ae("Grid spacing",t.gridSpacing,{q:"L",positive:!0}),n=ae("Grid lines each side",t.gridLines,{min:1,max:200}),s=tn("Work plane",[["XY","XY (plan, horizontal)"],["XZ","XZ (elevation)"],["YZ","YZ (elevation)"]],t.workPlane),r=ae("Plane offset (Z for XY, Y for XZ, X for YZ)",t.elevation,{q:"L"});oe({title:"Grid & work plane",body:C("div",{class:"form"},e.row,n.row,s.row,r.row,C("p",{class:"muted small"},"New joints snap to this grid on the work plane. Tap an existing joint to snap to it instead.")),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const a=[e.get(),n.get(),r.get()];if(a.some(o=>!Number.isFinite(o)))return _e("Fix the highlighted fields");i.model.commit("grid",o=>{o.settings.gridSpacing=a[0],o.settings.gridLines=Math.round(a[1]),o.settings.workPlane=s.get(),o.settings.elevation=a[2]})}}]})}function Gn(i,t){const e=i.selected()[t];return e.length?e:(Wt(`Select one or more ${t} first`,"warn"),null)}function Ga(i,t){const e=Gn(i,"frames");if(!e)return;const n=i.model.data,s=n.frames.filter(o=>e.includes(o.id)),r=o=>s.every(l=>o(l)===o(s[0]))?o(s[0]):null;let a;if(t==="material"){if(!n.materials.length)return void Wt("Define a material first","warn");a=tn("Material",n.materials.map(o=>[o.name,o.name]),r(o=>o.material)??n.materials[0].name)}else if(t==="section"){if(!n.sections.length)return void Wt("Define a section first","warn");a=tn("Section",n.sections.map(o=>[o.name,`${o.name} (${Ps[o.shape]})`]),r(o=>o.section)??n.sections[0].name)}else a=ae("Local axis angle β",r(o=>o.beta),{unit:"°",mixed:!0});oe({title:`Assign ${t==="beta"?"local axis angle":t} to ${e.length} frame(s)`,body:C("div",{class:"form"},a.row,t==="beta"?C("p",{class:"muted small"},"β rotates the section (local axes 2 and 3) about the member axis 1."):null),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const o=a.get();if(typeof o=="number"&&!Number.isFinite(o))return _e("Enter an angle");i.model.commit("assign "+t,l=>{for(const c of l.frames)e.includes(c.id)&&(c[t]=o)}),Wt(`Assigned to ${e.length} frame(s)`,"ok")}}]})}function Pu(i){const t=Gn(i,"frames");if(!t)return;const n=i.model.data.frames.find(l=>l.id===t[0]),s=dh(n.relI,"End I releases (Joint I)"),r=dh(n.relJ,"End J releases (Joint J)"),a=(l,c)=>{s.set(l),r.set(c)},o=C("div",{class:"chips"},me("Rigid - Rigid (Continuous)",()=>a(void 0,void 0)),me("Pin - Pin (Truss)",()=>a([!1,!1,!1,!1,!0,!0],[!1,!1,!1,!1,!0,!0])),me("Pin - Rigid (Hinge at I)",()=>a([!1,!1,!1,!1,!0,!0],void 0)),me("Rigid - Pin (Hinge at J)",()=>a(void 0,[!1,!1,!1,!1,!0,!0])));oe({title:`Assign end releases to ${t.length} frame(s)`,body:C("div",{class:"form"},C("div",{class:"muted small"},"Presets"),o,s.el,r.el,C("p",{class:"muted small"},"Checked DOFs are released (zero moment / shear / axial / torsion).")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const l=s.get(),c=r.get();i.model.commit("assign releases",h=>{for(const d of h.frames)t.includes(d.id)&&(l?d.relI=[...l]:delete d.relI,c?d.relJ=[...c]:delete d.relJ)}),Wt(`Assigned releases to ${t.length} frame(s)`,"ok")}}]})}function vx(i){const t=Gn(i,"joints");if(!t)return;const e=i.model.data,n=e.joints.find(a=>a.id===t[0]),s=Lu(n.r),r=C("div",{class:"chips"},...e.supportTypes.map(a=>me(a.name,()=>s.set(a.r))));oe({title:`Assign supports to ${t.length} joint(s)`,body:C("div",{class:"form"},C("div",{class:"muted small"},"Support type"),r,s.el),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const a=s.get();i.model.commit("assign supports",l=>{for(const c of l.joints)t.includes(c.id)&&(c.r=[...a])});const o=e.supportTypes.find(l=>dx(l.r,a));Wt(`${o?o.name:_l(a)} assigned to ${t.length} joint(s)`,"ok")}}]})}function _x(i){var n;const t=Gn(i,"areas");if(!t)return;const e=tn("Load distribution",[["two-way","Two-way (to all edges, tributary)"],["one-way","One-way (to the two longer edges)"]],((n=i.model.area(t[0]))==null?void 0:n.distribution)??"two-way");oe({title:`Area load distribution (${t.length} area(s))`,body:C("div",{class:"form"},e.row,C("p",{class:"muted small"},"Areas have no stiffness; their loads are transferred to the frames along their edges (or to the corner joints when an edge has no frame).")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{i.model.commit("assign distribution",s=>{for(const r of s.areas)t.includes(r.id)&&(r.distribution=e.get())})}}]})}const Zr=()=>tn("Option",[["add","Add to existing loads"],["replace","Replace loads of this case"],["delete","Delete loads of this case"]],"add");function Kr(i){const t=i.model.data.loadCases,e=t.some(n=>n.name===i.lastLoadCase)?i.lastLoadCase:t[0].name;return tn("Load case",t.map(n=>[n.name,`${n.name} (${n.type})`]),e)}function Du(i="GRAV"){return tn("Direction",Sh.map(t=>[t,$a[t]]),i)}function xx(i){const t=Gn(i,"joints");if(!t)return;const n=["Force FX","Force FY","Force FZ","Moment MX","Moment MY","Moment MZ"].map((a,o)=>ae(a,0,{q:o<3?"F":"M"})),s=Kr(i),r=Zr();oe({title:`Joint loads on ${t.length} joint(s)`,body:C("div",{class:"form"},C("p",{class:"muted small"},"Global axes. Use a negative FZ for downward loads."),s.row,C("div",{class:"grid2"},...n.map(a=>a.row)),r.row),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const a=n.map(c=>c.get()),o=r.get(),l=i.lastLoadCase=s.get();if(o!=="delete"&&a.some(c=>!Number.isFinite(c)))return _e("Fix the highlighted fields");i.model.commit("joint loads",c=>{if(o!=="add"&&(c.jointLoads=c.jointLoads.filter(h=>h.case!==l||!t.includes(h.joint))),!(o==="delete"||a.every(h=>h===0)))for(const h of t){const d=o==="add"?c.jointLoads.find(u=>u.joint===h&&u.case===l):void 0;d?d.f=d.f.map((u,f)=>u+a[f]):c.jointLoads.push({case:l,joint:h,f:[...a]})}}),Wt(o==="delete"?"Joint loads deleted":`Load applied to ${t.length} joint(s)`,"ok")}}]})}function Mx(i){const t=Gn(i,"frames");if(!t)return;const e=Du(),n=ae("Load P",10,{q:"F"}),s=ae("Relative distance from end I",.5,{min:0,max:1}),r=Kr(i),a=Zr();oe({title:`Frame point load on ${t.length} frame(s)`,body:C("div",{class:"form"},r.row,e.row,n.row,s.row,a.row,C("p",{class:"muted small"},"Gravity loads act downward (−Z) for positive values. Relative distance 0 = end I, 1 = end J.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const o=n.get(),l=s.get(),c=a.get(),h=i.lastLoadCase=r.get();if(c!=="delete"&&(!Number.isFinite(o)||!Number.isFinite(l)))return _e("Fix the highlighted fields");i.model.commit("frame point loads",d=>{if(c!=="add"&&(d.framePointLoads=d.framePointLoads.filter(u=>u.case!==h||!t.includes(u.frame))),!(c==="delete"||o===0))for(const u of t)d.framePointLoads.push({case:h,frame:u,dir:e.get(),P:o,rd:l})}),Wt(c==="delete"?"Point loads deleted":`Point load applied to ${t.length} frame(s)`,"ok")}}]})}function yx(i){const t=Gn(i,"frames");if(!t)return;const e=Du(),n=ae("Uniform load w",5,{q:"FL"}),s=Kr(i),r=Zr();oe({title:`Frame uniform load on ${t.length} frame(s)`,body:C("div",{class:"form"},s.row,e.row,n.row,r.row,C("p",{class:"muted small"},"Load per unit length along the full member. Gravity loads act downward for positive values.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const a=n.get(),o=r.get(),l=i.lastLoadCase=s.get();if(o!=="delete"&&!Number.isFinite(a))return _e("Enter a load value");i.model.commit("frame uniform loads",c=>{if(o!=="add"&&(c.frameUniformLoads=c.frameUniformLoads.filter(h=>h.case!==l||!t.includes(h.frame))),!(o==="delete"||a===0))for(const h of t)c.frameUniformLoads.push({case:l,frame:h,dir:e.get(),w:a})}),Wt(o==="delete"?"Uniform loads deleted":`Uniform load applied to ${t.length} frame(s)`,"ok")}}]})}function Sx(i){const t=Gn(i,"areas");if(!t)return;const e=ae("Uniform pressure q (gravity)",5,{q:"FA"}),n=Kr(i),s=Zr();oe({title:`Area load on ${t.length} area(s)`,body:C("div",{class:"form"},n.row,e.row,s.row,C("p",{class:"muted small"},"Positive values act downward. The load is distributed to the surrounding frames.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const r=e.get(),a=s.get(),o=i.lastLoadCase=n.get();if(a!=="delete"&&!Number.isFinite(r))return _e("Enter a load value");i.model.commit("area loads",l=>{if(a!=="add"&&(l.areaLoads=l.areaLoads.filter(c=>c.case!==o||!t.includes(c.area))),!(a==="delete"||r===0))for(const c of t){const h=a==="add"?l.areaLoads.find(d=>d.area===c&&d.case===o):void 0;h?h.q+=r:l.areaLoads.push({case:o,area:c,q:r})}}),Wt(a==="delete"?"Area loads deleted":`Area load applied to ${t.length} area(s)`,"ok")}}]})}async function ph(i){const t=i.selected(),e=t.joints.length+t.frames.length+t.areas.length;if(!e)return void Wt("Select objects first","warn");await as("Clear loads",`Delete all loads (all load cases) on the ${e} selected object(s)?`,"Delete loads",!0)&&i.model.commit("clear loads",n=>{n.jointLoads=n.jointLoads.filter(s=>!t.joints.includes(s.joint)),n.framePointLoads=n.framePointLoads.filter(s=>!t.frames.includes(s.frame)),n.frameUniformLoads=n.frameUniformLoads.filter(s=>!t.frames.includes(s.frame)),n.areaLoads=n.areaLoads.filter(s=>!t.areas.includes(s.area))})}function mh(i){const t=ae("X",0,{q:"L"}),e=ae("Y",0,{q:"L"}),n=ae("Z",0,{q:"L"});oe({title:"Add joint by coordinates",body:C("div",{class:"form"},C("div",{class:"grid3"},t.row,e.row,n.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const s=[t.get(),e.get(),n.get()];if(s.some(o=>!Number.isFinite(o)))return _e("Fix the highlighted fields");const r=i.model.data.joints.length,a=i.model.addJoint(s[0],s[1],s[2]);return Wt(i.model.data.joints.length>r?`Joint ${a} added`:`Joint ${a} already exists there`,"ok"),!1}}]})}function bx(i){const t=ae("Joint I",null,{min:1}),e=ae("Joint J",null,{min:1});oe({title:"Add frame between joints",body:C("div",{class:"form"},C("div",{class:"grid2"},t.row,e.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const n=t.get(),s=e.get();if(!i.model.joint(n)||!i.model.joint(s))return _e("Both joints must exist");const r=i.model.addFrame(n,s);return r===null?_e("Joints I and J must be different"):(Wt(`Frame ${r} (${n}–${s})`,"ok"),!1)}}]})}function Iu(i){return[ae(i+"X",0,{q:"L"}),ae(i+"Y",0,{q:"L"}),ae(i+"Z",0,{q:"L"})]}function gh(i){const t=i.selected(),e=i.model.jointsOf(t.joints,t.frames,t.areas);if(!e.size)return void Wt("Select objects to move","warn");const n=Iu("Δ");oe({title:`Move ${e.size} joint(s)`,body:C("div",{class:"form"},C("div",{class:"grid3"},...n.map(s=>s.row))),buttons:[{label:"Cancel"},{label:"Move",kind:"primary",action:()=>{const s=n.map(a=>a.get());if(s.some(a=>!Number.isFinite(a)))return _e("Fix the highlighted fields");const r=i.model.moveJoints(e,s[0],s[1],s[2]);if(r)return _e(r)}}]})}function vh(i){const t=i.selected();if(!t.joints.length&&!t.frames.length&&!t.areas.length)return void Wt("Select objects to replicate","warn");const e=Iu("Δ"),n=ae("Number of copies",1,{min:1,max:100});oe({title:"Replicate (linear copy)",body:C("div",{class:"form"},C("div",{class:"grid3"},...e.map(s=>s.row)),n.row,C("p",{class:"muted small"},"Copies selected objects with their properties, supports and loads.")),buttons:[{label:"Cancel"},{label:"Replicate",kind:"primary",action:()=>{const s=e.map(o=>o.get()),r=Math.round(n.get());if(s.some(o=>!Number.isFinite(o))||!(r>=1))return _e("Fix the highlighted fields");if(s.every(o=>o===0))return _e("Enter a non-zero offset");const a=i.model.replicate(t.joints,t.frames,t.areas,s[0],s[1],s[2],r);Wt(`Created ${a.joints.length} joint(s), ${a.frames.length} frame(s), ${a.areas.length} area(s)`,"ok")}}]})}function Ex(i){const t=Gn(i,"frames");if(!t)return;const e=ae("Divide each frame into",2,{min:2,max:100});oe({title:`Divide ${t.length} frame(s)`,body:C("div",{class:"form"},e.row),buttons:[{label:"Cancel"},{label:"Divide",kind:"primary",action:()=>{const n=Math.round(e.get());if(!(n>=2))return _e("Enter 2 or more");i.model.commit("divide frames",()=>{for(const s of t)i.model.divideFrame(s,n)}),i.select([],"replace")}}]})}function Ha(i){const t=i.results;if(!t)return void Wt("Run the analysis first","warn");const e=[["Joint displacements",()=>Sn(["Joint",...["UX","UY","UZ"].map(l=>`${l} (${jt("L")})`),"RX (rad)","RY (rad)","RZ (rad)"],i.model.data.joints.map(l=>[String(l.id),...(t.disp[l.id]??[]).map((c,h)=>h<3?$t(c,"L",4):kn(c,4))].map(c=>document.createTextNode(c))))],["Support reactions",()=>Sn(["Joint",...["FX","FY","FZ"].map(l=>`${l} (${jt("F")})`),...["MX","MY","MZ"].map(l=>`${l} (${jt("M")})`)],Object.entries(t.reactions).map(([l,c])=>[l,...c.map((h,d)=>$t(h,d<3?"F":"M",4))].map(h=>document.createTextNode(h))))],["Frame end forces",()=>Sn(["Frame","End",...["P","V2","V3"].map(l=>`${l} (${jt("F")})`),...["T","M2","M3"].map(l=>`${l} (${jt("M")})`)],t.frames.flatMap(l=>{const c=l.x.length-1,h=d=>[l.P[d],l.V2[d],l.V3[d],l.T[d],l.M2[d],l.M3[d]].map((u,f)=>$t(u,f<3?"F":"M",4));return[[String(l.id),"I",...h(0)].map(d=>document.createTextNode(d)),["","J",...h(c)].map(d=>document.createTextNode(d))]}))]],n=C("div",{class:"tab-content"}),s=C("div",{class:"tabs"}),r=l=>{n.replaceChildren(e[l][1]()),[...s.children].forEach((c,h)=>c.classList.toggle("active",h===l))};e.forEach(([l],c)=>s.append(C("button",{class:"tab",type:"button",onclick:()=>r(c)},l))),r(0);const a=t.stats,o=C("p",{class:"muted small"},`Applied load ΣF = (${a.sumLoad.map(l=>$t(l,"F",4)).join(", ")}) ${jt("F")} · Reactions ΣR = (${a.sumReaction.map(l=>$t(l,"F",4)).join(", ")}) ${jt("F")} · Max displacement ${Me(a.maxDisp,"L",4)}`);oe({title:`Analysis results — ${i.resultName}`,wide:!0,body:C("div",null,o,s,n),buttons:[{label:"Close",kind:"primary"}]})}function _h(){const t=C("div",null,Sn(["Action","Touch (iPad/Android)","Mouse & keyboard"],[["Select","Tap object","Click object"],["Add to selection","Multi tool, then tap","Shift/Ctrl + click"],["Box select","Box tool, drag (→ window, ← crossing)","Box tool or Ctrl + drag"],["Rotate view","One-finger drag","Left drag"],["Pan","Two-finger drag","Right/middle drag or Shift + drag"],["Zoom","Pinch","Mouse wheel / trackpad pinch"],["Context menu","Long-press","Right-click"],["Finish frame/area","Done button","Enter or Done"],["Cancel / clear selection","—","Esc"],["Delete","Delete button","Delete key"],["Undo / Redo","Undo / Redo buttons","Ctrl+Z / Ctrl+Y"],["Fit view","Fit button","F"],["Rotate work plane (XY → XZ → YZ)","Plane button (passes through a single selected joint)","P"],["Shift work plane ± grid spacing","Up / Down plane buttons","PgUp / PgDn"]].map(e=>e.map(n=>document.createTextNode(n)))),C("ol",{class:"small"},C("li",null,"Define → Materials, Sections and Support types."),C("li",null,"Draw joints, frames and areas on the grid. Use the plane buttons in the toolbar (or Define → Grid & work plane) to change the plane and its offset."),C("li",null,"Select objects and use Assign to set materials, sections and supports."),C("li",null,"Apply loads from the Loads menu."),C("li",null,"Analyze → Run analysis, then pick a result view and adjust the scale."),C("li",null,"File → Save writes a comma-separated .sav file that opens in Excel.")),C("p",{class:"muted small"},`Current units: ${["F","L","FL","FA","M"].map(e=>jt(e)).join(", ")} (${ln().label}) — change them with the units selector at the bottom-right. Z is vertical (up).`));oe({title:"Help",wide:!0,body:t,buttons:[{label:"Close",kind:"primary"}]})}const xh=(i,t)=>i.jointLoads.filter(e=>e.case===t).length+i.framePointLoads.filter(e=>e.case===t).length+i.frameUniformLoads.filter(e=>e.case===t).length+i.areaLoads.filter(e=>e.case===t).length,wx=i=>i.factors.length?i.factors.map((t,e)=>`${e?t.factor<0?"− ":"+ ":t.factor<0?"−":""}${kn(Math.abs(t.factor),3)} ${t.case}`).join(" "):"(empty)";function Ax(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(Sn(["Name","Type","Loads",""],t.data.loadCases.map((a,o)=>[document.createTextNode(a.name),document.createTextNode(a.type+(o===t.data.loadCases.findIndex(l=>l.type==="Dead")&&t.data.settings.selfWeight?" + self weight":"")),document.createTextNode(String(xh(t.data,a.name))),C("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>void s(a),"small danger"))])),C("div",{class:"dlg-actions"},me("+ Add load case",()=>r(null),"primary")),C("p",{class:"muted small"},"Each load case is analysed separately. Self weight (if enabled) is added to the first Dead case. Combine cases with Loads → Load combinations."))},s=async a=>{if(t.data.loadCases.length<=1)return void Wt("At least one load case is required","warn");const o=xh(t.data,a.name);o&&!await as("Delete load case",`Load case "${a.name}" has ${o} load(s). Delete the case and its loads?`,"Delete",!0)||(t.commit("delete load case",l=>{const c=h=>h.case!==a.name;l.loadCases=l.loadCases.filter(h=>h.name!==a.name),l.jointLoads=l.jointLoads.filter(c),l.framePointLoads=l.framePointLoads.filter(c),l.frameUniformLoads=l.frameUniformLoads.filter(c),l.areaLoads=l.areaLoads.filter(c);for(const h of l.loadCombos)h.factors=h.factors.filter(d=>d.case!==a.name)}),n())},r=a=>{const o=Gs("Name",(a==null?void 0:a.name)??`CASE${t.data.loadCases.length+1}`),l=tn("Type",bh.map(c=>[c,c]),(a==null?void 0:a.type)??"Other");oe({title:a?`Edit load case ${a.name}`:"Add load case",body:C("div",{class:"form"},o.row,l.row),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=o.get(),h=[...t.data.loadCases.filter(u=>u!==a).map(u=>u.name),...t.data.loadCombos.map(u=>u.name)],d=Hs(c,h,"Load case");if(d)return _e(d);t.commit(a?"edit load case":"add load case",u=>{if(!a)return void u.loadCases.push({name:c,type:l.get()});const f=u.loadCases.find(p=>p.name===a.name);if(f.type=l.get(),c!==a.name){f.name=c;for(const p of[u.jointLoads,u.framePointLoads,u.frameUniformLoads,u.areaLoads])for(const g of p)g.case===a.name&&(g.case=c);for(const p of u.loadCombos)for(const g of p.factors)g.case===a.name&&(g.case=c)}}),a&&i.lastLoadCase===a.name&&(i.lastLoadCase=c),n()}}]})};n(),oe({title:"Load cases",body:e,buttons:[{label:"Close",kind:"primary"}]})}function Tx(i){const t=i.model,e=C("div"),n=()=>{e.replaceChildren(t.data.loadCombos.length?Sn(["Name","Combination",""],t.data.loadCombos.map(a=>[document.createTextNode(a.name),document.createTextNode(wx(a)),C("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))])):C("p",{class:"muted"},"No load combinations. Results are shown per load case."),C("div",{class:"dlg-actions"},me("+ Add combination",()=>r(null),"primary")),C("p",{class:"muted small"},"Combination results are the factored sum of the load case results (linear superposition)."))},s=a=>{t.commit("delete load combination",o=>{o.loadCombos=o.loadCombos.filter(l=>l.name!==a.name)}),n()},r=a=>{const o=Gs("Name",(a==null?void 0:a.name)??`COMBO${t.data.loadCombos.length+1}`),l=t.data.loadCases.map(c=>{var h;return{lc:c,f:ae(`× ${c.name}`,a?((h=a.factors.find(d=>d.case===c.name))==null?void 0:h.factor)??0:0,{placeholder:"0"})}});oe({title:a?`Edit combination ${a.name}`:"Add load combination",body:C("div",{class:"form"},o.row,C("p",{class:"muted small"},"Scale factor for each load case (0 = not included)."),C("div",{class:"grid2"},...l.map(c=>c.f.row))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=o.get(),h=[...t.data.loadCombos.filter(p=>p!==a).map(p=>p.name),...t.data.loadCases.map(p=>p.name)],d=Hs(c,h,"Combination");if(d)return _e(d);const u=l.map(p=>({case:p.lc.name,factor:p.f.input.value.trim()===""?0:p.f.get()}));if(u.some(p=>!Number.isFinite(p.factor)))return _e("Fix the highlighted fields");const f=u.filter(p=>p.factor!==0);if(!f.length)return _e("Enter at least one non-zero factor");t.commit(a?"edit load combination":"add load combination",p=>{const g={name:c,factors:f};a?p.loadCombos[p.loadCombos.findIndex(m=>m.name===a.name)]=g:p.loadCombos.push(g)}),n()}}]})};n(),oe({title:"Load combinations",body:e,buttons:[{label:"Close",kind:"primary"}]})}const Ti=i=>C("dl",{class:"kv"},...i.flatMap(([t,e])=>[C("dt",null,t),C("dd",null,e)])),Ve=(i,...t)=>C("section",{class:"insp-sec"},C("h3",null,i),...t),pe=(i,t,e="")=>C("button",{class:"btn small "+e,type:"button",onclick:t},i);function Un(i,t){return C("div",{class:"table-wrap"},C("table",{class:"grid-table compact"},C("thead",null,C("tr",null,...i.map(e=>C("th",null,e)))),C("tbody",null,...t.map(e=>C("tr",null,...e.map(n=>C("td",null,n)))))))}function Wa(i,t){const e=i.selected(),n=e.joints.length+e.frames.length+e.areas.length;t.replaceChildren(),n===0?t.append(...Cx(i)):n===1&&e.joints.length?t.append(...Rx(i,e.joints[0])):n===1&&e.frames.length?t.append(...Lx(i,e.frames[0])):n===1&&e.areas.length?t.append(...Px(i,e.areas[0])):t.append(...Dx(i,e))}function Cx(i){const t=i.model.data,e=[Ve("Model",Ti([["Joints",String(t.joints.length)],["Frames",String(t.frames.length)],["Areas",String(t.areas.length)],["Supported joints",String(t.joints.filter(s=>s.r.some(Boolean)).length)],["Loads",String(t.jointLoads.length+t.framePointLoads.length+t.frameUniformLoads.length+t.areaLoads.length)],["Self weight",t.settings.selfWeight?"Included":"Off"]]))],n=i.results;return n&&(e.push(Ve(`Analysis results — ${i.resultName}`,Ti([["Equations",String(n.stats.equations)],["Max displacement",Me(n.stats.maxDisp,"L",4)],["ΣLoad (X,Y,Z)",n.stats.sumLoad.map(s=>$t(s,"F",4)).join(", ")+" "+jt("F")],["ΣReaction (X,Y,Z)",n.stats.sumReaction.map(s=>$t(s,"F",4)).join(", ")+" "+jt("F")]]),pe("Show result tables…",()=>i.cmd("resultsTables")))),n.warnings.length&&e.push(Ve("Warnings",C("ul",{class:"warn-list"},...n.warnings.map(s=>C("li",null,s)))))),e.push(C("p",{class:"muted small"},"Tap a joint, frame or area to see and edit its properties.")),e}function Uu(i,t,e){return pe(t,()=>{const n=i.map(r=>r.get());if(n.some(r=>!Number.isFinite(r)))return Wt("Fix the highlighted fields","error");const s=e(n);s&&Wt(s,"error")},"primary")}function Rx(i,t){const e=i.model,n=e.joint(t),s=ae("X",n.x,{q:"L"}),r=ae("Y",n.y,{q:"L"}),a=ae("Z",n.z,{q:"L"}),o=ii.map((f,p)=>gl(f,n.r[p]));for(const f of o)f.input.addEventListener("change",()=>e.commit("restraint",()=>{e.joint(t).r=o.map(p=>p.get())}));const l=C("div",{class:"chips"},...e.data.supportTypes.map(f=>pe(f.name,()=>e.commit("support",()=>{e.joint(t).r=[...f.r]})))),c=e.data.jointLoads.filter(f=>f.joint===t),h=[C("h2",{class:"insp-title"},`Joint ${t}`),Ve("Coordinates",C("div",{class:"grid3"},s.row,r.row,a.row),Uu([s,r,a],"Apply",f=>e.moveJoints(new Set([t]),f[0]-n.x,f[1]-n.y,f[2]-n.z))),Ve("Support ("+_l(n.r)+")",l,C("div",{class:"chk-row wrap"},...o.map(f=>f.row))),Ve("Joint loads",c.length?Un(["Case",...["FX","FY","FZ"].map(f=>`${f} (${jt("F")})`),...["MX","MY","MZ"].map(f=>`${f} (${jt("M")})`)],c.map(f=>[f.case,...f.f.map((p,g)=>$t(p,g<3?"F":"M",4))])):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},pe("Add load…",()=>i.cmd("jointLoad")),c.length?pe("Delete loads",()=>e.commit("delete joint loads",f=>{f.jointLoads=f.jointLoads.filter(p=>p.joint!==t)}),"danger"):null))],d=e.data.frames.filter(f=>f.i===t||f.j===t).map(f=>f.id);h.push(Ti([["Connected frames",d.length?d.join(", "):"None"]]));const u=i.results;if(u&&u.disp[t]){const f=u.disp[t];h.push(Ve(`Displacement — ${i.resultName}`,Un(["UX","UY","UZ"].map(g=>`${g} (${jt("L")})`),[f.slice(0,3).map(g=>$t(g,"L",4))]),Un(["RX (rad)","RY (rad)","RZ (rad)"],[f.slice(3).map(g=>kn(g,4))])));const p=u.reactions[t];p&&h.push(Ve("Support reaction",Un(["FX","FY","FZ"].map(g=>`${g} (${jt("F")})`),[p.slice(0,3).map(g=>$t(g,"F",4))]),Un(["MX","MY","MZ"].map(g=>`${g} (${jt("M")})`),[p.slice(3).map(g=>$t(g,"M",4))])))}return h}function Lx(i,t){var p;const e=i.model,n=e.data,s=e.frame(t),r=tn("Material",n.materials.map(g=>[g.name,g.name]),s.material),a=tn("Section",n.sections.map(g=>[g.name,`${g.name} (${Ps[g.shape]})`]),s.section),o=ae("Angle β",s.beta,{unit:"°"});r.input.addEventListener("change",()=>e.commit("assign material",()=>void(e.frame(t).material=r.get()))),a.input.addEventListener("change",()=>e.commit("assign section",()=>void(e.frame(t).section=a.get())));const l=n.sections.find(g=>g.name===s.section),c=l?wi(l):null,h=n.framePointLoads.filter(g=>g.frame===t),d=n.frameUniformLoads.filter(g=>g.frame===t),u=[C("h2",{class:"insp-title"},`Frame ${t}`),Ti([["Joints I → J",`${s.i} → ${s.j}`],["Length",Me(e.frameLength(s),"L",4)]]),Ve("Properties",r.row,a.row,c?C("p",{class:"muted small"},`A = ${Me(c.A,"A",4)}, I33 = ${Me(c.I33,"L4",4)}, I22 = ${Me(c.I22,"L4",4)}, J = ${Me(c.J,"L4",4)}, As2 = ${Me(c.As2,"A",4)}, As3 = ${Me(c.As3,"A",4)}`):null,o.row,Uu([o],"Apply β",g=>void e.commit("beta",()=>void(e.frame(t).beta=g[0])))),Ve("End releases",Ti([["End I (Joint "+s.i+")",Nr(s.relI)],["End J (Joint "+s.j+")",Nr(s.relJ)]]),C("div",{class:"row-btns"},pe("Edit releases…",()=>Pu(i)),s.relI||s.relJ?pe("Set continuous",()=>{e.commit("clear releases",()=>{delete e.frame(t).relI,delete e.frame(t).relJ})}):null)),Ve("Frame loads",h.length||d.length?Un(["Case","Type","Direction","Value","Position"],[...h.map(g=>[g.case,"Point",$a[g.dir],Me(g.P,"F",4),"rd = "+kn(g.rd,3)]),...d.map(g=>[g.case,"Uniform",$a[g.dir],Me(g.w,"FL",4),"full length"])]):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},pe("Point load…",()=>i.cmd("framePoint")),pe("Uniform load…",()=>i.cmd("frameUniform")),h.length||d.length?pe("Delete loads",()=>e.commit("delete frame loads",g=>{g.framePointLoads=g.framePointLoads.filter(m=>m.frame!==t),g.frameUniformLoads=g.frameUniformLoads.filter(m=>m.frame!==t)}),"danger"):null))],f=(p=i.results)==null?void 0:p.frames.find(g=>g.id===t);if(f){const g=f.x.length-1,m=["P","V2","V3","T","M2","M3"],v=D=>D<3?"F":"M",_=m.map((D,T)=>{const R=f[D],I=v(T);return[`${D} (${jt(I)})`,$t(R[0],I,4),$t(R[g],I,4),$t(Math.max(...R),I,4),$t(Math.min(...R),I,4)]});let M=0;for(const D of f.disp)M=Math.max(M,Math.hypot(...D));u.push(Ve(`Internal forces — ${i.resultName}`,Un(["","End I","End J","Max","Min"],_),C("p",{class:"muted small"},`Max displacement along member: ${Me(M,"L",4)}`),pe("Diagrams…",()=>qo(i,t))));const x=C("details",null,C("summary",null,"Station values"),Un([`x (${jt("L")})`,...m.map((D,T)=>`${D} (${jt(v(T))})`)],f.x.map((D,T)=>[$t(D,"L",4),...m.map((R,I)=>$t(f[R][T],v(I),4))])));u.push(x)}return u}function Px(i,t){const e=i.model,n=e.area(t),s=e.jointMap(),r=n.joints.map(u=>s.get(u)).filter(Boolean);let a=0,o=0,l=0;for(let u=0;u<r.length;u++){const f=r[u],p=r[(u+1)%r.length];a+=(f.y-p.y)*(f.z+p.z),o+=(f.z-p.z)*(f.x+p.x),l+=(f.x-p.x)*(f.y+p.y)}const c=Math.hypot(a,o,l)/2,h=tn("Load distribution",[["two-way","Two-way"],["one-way","One-way"]],n.distribution);h.input.addEventListener("change",()=>e.commit("distribution",()=>void(e.area(t).distribution=h.get())));const d=e.data.areaLoads.filter(u=>u.area===t);return[C("h2",{class:"insp-title"},`Area ${t}`),Ti([["Joints",n.joints.join(", ")],["Area",Me(c,"A",4)]]),Ve("Properties",h.row,C("p",{class:"muted small"},"Areas carry no stiffness; loads are transferred to the edge frames.")),Ve("Area loads",d.length?Un(["Case",`q (${jt("FA")}, down)`],d.map(u=>[u.case,$t(u.q,"FA",4)])):C("p",{class:"muted small"},"None"),C("div",{class:"row-btns"},pe("Add load…",()=>i.cmd("areaLoad")),d.length?pe("Delete loads",()=>e.commit("delete area loads",u=>{u.areaLoads=u.areaLoads.filter(f=>f.area!==t)}),"danger"):null))]}function Dx(i,t){const e=[C("h2",{class:"insp-title"},"Selection"),Ti([["Joints",t.joints.length?t.joints.join(", "):"–"],["Frames",t.frames.length?t.frames.join(", "):"–"],["Areas",t.areas.length?t.areas.join(", "):"–"]])],n=[];return t.joints.length&&n.push(pe("Supports…",()=>i.cmd("assignSupport")),pe("Joint load…",()=>i.cmd("jointLoad"))),t.frames.length&&n.push(pe("Material…",()=>i.cmd("assignMaterial")),pe("Section…",()=>i.cmd("assignSection")),pe("End releases…",()=>i.cmd("assignReleases")),pe("Point load…",()=>i.cmd("framePoint")),pe("Uniform load…",()=>i.cmd("frameUniform"))),t.areas.length&&n.push(pe("Area load…",()=>i.cmd("areaLoad"))),n.push(pe("Move…",()=>i.cmd("move")),pe("Replicate…",()=>i.cmd("replicate")),pe("Delete",()=>i.cmd("delete"),"danger")),e.push(Ve("Quick actions",C("div",{class:"chips"},...n))),e}const Ix="1.1.6",Ux="2026-11-18",Nx=[{version:"1.1.6",date:"2026-11-18",changes:["Prevent Android soft keyboard flashing when selecting dropdown options or opening dialogs"]},{version:"1.1.5",date:"2026-11-18",changes:["Shear deformation (Timoshenko) in frame elements using shear modulus G and shear areas As2/As3","Shear areas As2/As3 shown in section dialog, inspector and .sav SECTIONS table",'"Include self weight" is now checked by default for new models',"New Analyze ▸ Frame diagram… menu item","Fixed diagram fill showing positive colour over negative values","Joint labels are easier to read (background pill, offset from joint dot)","Version history added to the About dialog"]},{version:"1.1.4",date:"2026-11-17",changes:["Compact multiline load labels, grouped like reaction labels"]},{version:"1.1.3",date:"2026-11-17",changes:["Stacked load labels per load case with case-name prefixes","Matching 2D/3D diagram colours","Inverted moment axis in diagrams"]},{version:"1.1.2",date:"2026-11-17",changes:["Isolated 3D viewport stacking context so labels no longer bleed through dialogs"]},{version:"1.1.1",date:"2026-11-16",changes:["Load dialog dropdown shows load case name and type"]},{version:"1.1.0",date:"2026-11-15",changes:["Member end releases (Phase 1.1) with hinge markers in the 3D view"]},{version:"1.0.0",date:"2026-11-12",changes:["Load cases (Dead, Live, custom) and load combinations (default 1.2D + 1.6L)","Frame diagrams window: axial, torsion, V2/M3, V3/M2 and deflection with tap-to-read values","UNP and C frame shapes","Drag a selected joint to move it (snaps to grid)","Unit systems selector (kN-m, N-mm, ton-m, kg-mm, imperial)","Work plane rotate/offset shortcut buttons"]},{version:"Initial",date:"2026-11-07",changes:["Touch-friendly 3D modelling canvas: joints, frames and areas","Materials, sections, supports and joint/frame loads","Linear static 3D frame analysis with forces, reactions and deformed shape","Save/open models as comma-separated .sav files (Excel friendly)"]}],Fx={XY:"Z",XZ:"Y",YZ:"X"},Mh=[["none","Undeformed"],["deformed","Deformed shape"],["P","Axial P"],["V2","Shear V2"],["V3","Shear V3"],["T","Torsion T"],["M2","Moment M2"],["M3","Moment M3"],["reactions","Support reactions"]],Ox={select:'<path d="M5 3l14 8-6 2-3 6z"/>',joint:'<circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',frame:'<circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="5" r="2.2"/><path d="M6.5 17.5l11-11"/>',area:'<path d="M4 18l4-12h12l-4 12z" fill="currentColor" fill-opacity=".25"/>',box:'<rect x="4" y="5" width="16" height="14" rx="1" stroke-dasharray="3 2"/>',multi:'<rect x="3" y="7" width="11" height="11" rx="2"/><path d="M10 4h8a2 2 0 0 1 2 2v8"/>',done:'<path d="M5 12.5l4.5 4.5L19 7"/>',fit:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',undo:'<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',redo:'<path d="M15 7l5 5-5 5"/><path d="M20 12H10a6 6 0 0 0 0 12"/>',del:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',plane:'<path d="M3 15l6-5h12l-6 5z" fill="currentColor" fill-opacity=".2"/><path d="M17 4a5 5 0 0 1 3 4.5M20 8.5l.2-2.6M20 8.5l-2.5-.7"/>',planeUp:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 12V3M8.5 6.5L12 3l3.5 3.5"/>',planeDown:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 3v9M8.5 8.5L12 12l3.5-3.5"/>',run:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'},Xa=i=>{const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("class","ico"),t.innerHTML=Ox[i],t};class Bx{constructor(t){it(this,"model",new Cl);it(this,"viewer");it(this,"tools");it(this,"selection",new Set);it(this,"resultSet",null);it(this,"resultName","");it(this,"lastLoadCase","");it(this,"fileName","Untitled.sav");it(this,"fileHandle",null);it(this,"dirty",!1);it(this,"includeResults",!0);it(this,"deformRel",0);it(this,"forceRel",0);it(this,"theme","light");it(this,"busy",!1);it(this,"root");it(this,"viewport");it(this,"panel");it(this,"panelBody");it(this,"statusEl");it(this,"coordEl");it(this,"unitsEl");it(this,"fileEl");it(this,"hintEl");it(this,"resultsBar");it(this,"toolButtons",new Map);it(this,"autosaveTimer",0);it(this,"suppressDirty",!1);it(this,"rb");it(this,"planeOffsets",{});it(this,"commands",{jointLoad:()=>this.need("joints")&&xx(this),framePoint:()=>this.need("frames")&&Mx(this),frameUniform:()=>this.need("frames")&&yx(this),areaLoad:()=>this.need("areas")&&Sx(this),assignSupport:()=>this.need("joints")&&vx(this),assignMaterial:()=>this.need("frames")&&Ga(this,"material"),assignSection:()=>this.need("frames")&&Ga(this,"section"),assignBeta:()=>this.need("frames")&&Ga(this,"beta"),assignReleases:()=>this.need("frames")&&Pu(this),assignArea:()=>this.need("areas")&&_x(this),move:()=>gh(this),replicate:()=>vh(this),divide:()=>this.need("frames")&&Ex(this),delete:()=>void this.deleteSelected(),resultsTables:()=>Ha(this)});this.root=t;const e=localStorage.getItem("structapp.theme");(e==="light"||e==="dark")&&(this.theme=e),this.buildLayout(),this.viewer=new __(this.viewport),this.tools=new A_(this),this.applyTheme(),new b_(this.viewer.canvas,{tap:(n,s,r)=>this.tools.tap(n,s,r),longPress:(n,s)=>this.contextMenu(n,s),hover:(n,s,r)=>this.tools.hover(n,s,r),orbit:(n,s)=>this.viewer.orbit(n,s),pan:(n,s)=>this.viewer.pan(n,s),zoom:(n,s,r)=>this.viewer.zoom(n,s,r),wantsBox:n=>this.tools.wantsBox(n),box:(n,s,r,a,o)=>this.tools.box(n,s,r,a,o),wantsDrag:(n,s,r)=>this.tools.wantsDrag(n,s,r),drag:(n,s,r)=>this.tools.drag(n,s,r)}),this.model.onChange(n=>this.onModelChange(n)),this.installKeyboard(),window.addEventListener("beforeunload",n=>{this.dirty&&(n.preventDefault(),n.returnValue="")}),this.refresh(),this.viewer.fit(),this.onToolChanged(),this.offerRecovery()}get results(){var t;return((t=this.resultSet)==null?void 0:t.results[this.resultName])??null}buildLayout(){const e=[["File",()=>this.fileMenu()],["Edit",()=>this.editMenu()],["Define",()=>this.defineMenu()],["Draw",()=>this.drawMenu()],["Assign",()=>this.assignMenu()],["Loads",()=>this.loadsMenu()],["Analyze",()=>this.analyzeMenu()],["Display",()=>this.displayMenu()],["Help",()=>this.helpMenu()]].map(([u,f])=>{const p=C("button",{class:"menu-btn",type:"button"},u);return p.addEventListener("click",g=>{if(g.stopPropagation(),w_(p))return Wr();const m=p.getBoundingClientRect();rh(f(),m.left,m.bottom+2,p)}),p});this.fileEl=C("span",{class:"file-name"});const n=C("button",{class:"btn primary run-btn",type:"button",title:"Run analysis (F5)",onclick:()=>void this.analyze()},Xa("run"),C("span",null,"Run")),s=C("button",{class:"icon-btn",type:"button",title:"Show/hide properties panel",onclick:()=>this.togglePanel()},Xa("panel")),r=C("header",{class:"menubar"},C("div",{class:"brand"},"StructApp 3D"),C("nav",{class:"menus"},...e),C("div",{class:"spacer"}),this.fileEl,n,s),a=(u,f,p,g)=>{const m=C("button",{class:"tool-btn",type:"button",title:p,"aria-label":p,onclick:g},Xa(u),C("span",null,f));return this.toolButtons.set(u,m),m},o=C("nav",{class:"toolbar"},a("select","Select","Select (S)",()=>this.tools.setTool("select")),a("box","Box","Box/window select (B)",()=>this.tools.setTool("box")),a("multi","Multi","Multi-select: taps add to selection (M)",()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()}),a("done","Done","Finish frame chain / close area (Enter)",()=>this.tools.finishChain(!0)),C("div",{class:"tb-sep"}),a("joint","Joint","Draw joints (J)",()=>this.tools.setTool("joint")),a("frame","Frame","Draw frames (L)",()=>this.tools.setTool("frame")),a("area","Area","Draw areas (A)",()=>this.tools.setTool("area")),C("div",{class:"tb-sep"}),a("fit","Fit","Zoom to fit (F)",()=>this.viewer.fit()),a("undo","Undo","Undo (Ctrl+Z)",()=>this.undo()),a("redo","Redo","Redo (Ctrl+Y)",()=>this.redo()),a("del","Delete","Delete selected (Del)",()=>void this.deleteSelected()),C("div",{class:"tb-sep"}),a("plane","XY","Rotate work plane XY → XZ → YZ (P)",()=>this.rotateWorkPlane()),a("planeUp","Up","Shift work plane +1 grid spacing (PgUp)",()=>this.shiftWorkPlane(1)),a("planeDown","Down","Shift work plane −1 grid spacing (PgDn)",()=>this.shiftWorkPlane(-1)));this.viewport=C("div",{class:"viewport"}),this.hintEl=C("div",{class:"tool-hint"}),this.resultsBar=this.buildResultsBar();const l=C("div",{class:"viewport-wrap"},this.viewport,this.hintEl,this.resultsBar),c=u=>{const f=u.target;f&&(this.viewport.contains(f)||f===this.viewport)&&u.preventDefault()};l.addEventListener("contextmenu",c,!0),l.addEventListener("selectstart",c,!0),l.addEventListener("dragstart",c,!0),this.panelBody=C("div",{class:"panel-body"});const h=C("div",{class:"sheet-grip",onclick:()=>this.togglePanel()});this.panel=C("aside",{class:"panel"},h,C("div",{class:"panel-head"},C("span",null,"Properties"),C("button",{class:"icon-btn small",type:"button",title:"Close",onclick:()=>this.togglePanel(!1)},"✕")),this.panelBody),(localStorage.getItem("structapp.panel")==="closed"||window.innerWidth<700)&&this.panel.classList.add("collapsed"),this.statusEl=C("span",{class:"status-text"}),this.coordEl=C("span",{class:"coord"}),this.unitsEl=C("select",{class:"units",title:"Units for all input and output values","aria-label":"Units"},C("optgroup",{label:"Metric"},...rs.slice(0,4).map(u=>C("option",{value:u.id},u.label))),C("optgroup",{label:"Imperial"},...rs.slice(4).map(u=>C("option",{value:u.id},u.label)))),this.unitsEl.value=ln().id,this.unitsEl.addEventListener("change",()=>eh(this.unitsEl.value)),u_(()=>this.onUnitsChanged());const d=C("footer",{class:"statusbar"},this.statusEl,C("div",{class:"spacer"}),this.coordEl,this.unitsEl);this.root.replaceChildren(r,C("div",{class:"main"},o,l,this.panel),d)}buildResultsBar(){const t=C("select",{class:"rb-view","aria-label":"Result display"},...Mh.map(([d,u])=>C("option",{value:d},u)));t.addEventListener("change",()=>this.setResultView(t.value));const e=C("input",{type:"range",min:"-3",max:"3",step:"0.05",value:"0","aria-label":"Deformation scale"});e.addEventListener("input",()=>{this.deformRel=Number(e.value),this.applyDeformScale()});const n=C("input",{type:"text",inputmode:"decimal",class:"rb-scale","aria-label":"Deformation scale factor"});n.addEventListener("change",()=>{const d=Number(n.value.replace(",","."));if(!(d>0)||!Number.isFinite(d)){Wt("Scale must be a positive number","error"),this.syncResultsBar();return}this.deformRel=Math.log10(d/this.viewer.autoDeformScale),this.applyDeformScale(!1)});const s=C("button",{class:"btn small",type:"button",onclick:()=>(this.deformRel=0,this.applyDeformScale())},"Auto"),r=C("input",{type:"range",min:"-1",max:"1",step:"0.05",value:"0","aria-label":"Diagram scale"});r.addEventListener("input",()=>{this.forceRel=Number(r.value),this.viewer.setResultOptions({forceScale:10**this.forceRel})});const a=C("input",{type:"checkbox"});a.addEventListener("change",()=>this.viewer.setResultOptions({animate:a.checked}));const o=C("input",{type:"checkbox",checked:!0});o.addEventListener("change",()=>this.viewer.setResultOptions({showValues:o.checked}));const l=C("div",{class:"rb-group"},C("label",null,"Scale"),e,n,s,C("label",{class:"check"},a,C("span",null,"Animate"))),c=C("div",{class:"rb-group"},C("label",null,"Size"),r),h=C("select",{class:"rb-case","aria-label":"Load case or combination"});return h.addEventListener("change",()=>this.setResultCase(h.value)),this.rb={rcase:h,view:t,slider:e,scale:n,forceSlider:r,animate:a,values:o,deformGroup:l,forceGroup:c},C("div",{class:"results-bar",hidden:!0},h,t,l,c,C("label",{class:"check"},o,C("span",null,"Values")),C("button",{class:"btn small",type:"button",onclick:()=>Ha(this)},"Tables"),C("button",{class:"icon-btn small",type:"button",title:"Hide results",onclick:()=>this.setResultView("none")},"✕"))}applyDeformScale(t=!0){this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(t)}syncResultsBar(t=!0){var a;const e=this.rb,n=this.viewer.resultOpts.view,s=((a=this.resultSet)==null?void 0:a.items)??[],r=s.map(o=>o.kind+":"+o.name).join("|");e.rcase.dataset.sig!==r&&(e.rcase.dataset.sig=r,e.rcase.replaceChildren(...s.map(o=>C("option",{value:o.name},(o.kind==="combo"?"Combo: ":"Case: ")+o.name)))),e.rcase.value=this.resultName,e.view.value=n,t&&(e.slider.value=String(Math.max(-3,Math.min(3,this.deformRel)))),e.scale.value=kn(this.viewer.autoDeformScale*10**this.deformRel,4),e.forceSlider.value=String(this.forceRel),e.animate.checked=this.viewer.resultOpts.animate,e.values.checked=this.viewer.resultOpts.showValues,e.deformGroup.hidden=n==="none"||n==="reactions",e.forceGroup.hidden=!Xo.includes(n)&&n!=="reactions",this.resultsBar.hidden=!this.results}clearResults(t=!0){this.resultSet=null,this.viewer.setResults(null),this.viewer.setResultOptions({view:"none",animate:!1}),Xr(),t&&this.refresh()}setResultCase(t){var e;(e=this.resultSet)!=null&&e.results[t]&&(this.resultName=t,this.viewer.setResults(this.results),this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.refresh())}setResultView(t){if(!this.results&&t!=="none")return void Wt("Run the analysis first","warn");this.viewer.setResultOptions({view:t,deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(),this.viewer.requestRender()}togglePanel(t){const e=t===void 0?!this.panel.classList.contains("collapsed"):!t;this.panel.classList.toggle("collapsed",e),localStorage.setItem("structapp.panel",e?"closed":"open")}applyTheme(){var t;document.documentElement.dataset.theme=this.theme,this.viewer.setTheme(this.theme==="dark"?bu:p_),(t=document.querySelector('meta[name="theme-color"]'))==null||t.setAttribute("content",this.theme==="dark"?"#0f172a":"#f8fafc")}onModelChange(t){this.resultSet&&this.clearResults(!1);for(const e of[...this.selection]){const{kind:n,id:s}=Is(e);(n==="j"?this.model.joint(s):n==="f"?this.model.frame(s):this.model.area(s))||this.selection.delete(e)}t==="load"&&this.tools.cancel(),this.suppressDirty||(this.dirty=!0,this.scheduleAutosave()),this.refresh()}scheduleAutosave(){clearTimeout(this.autosaveTimer),this.autosaveTimer=window.setTimeout(()=>{try{sx(lh(this.model.data),this.fileName)}catch{}},1200)}onUnitsChanged(){this.unitsEl.value=ln().id,this.coordEl.textContent="",this.viewer.rebuildAll(),Wa(this,this.panelBody),this.updateStatus(),uh(this),this.dirty&&this.scheduleAutosave(),Wt(`Units: ${ln().label}`)}refresh(){this.viewer.setData(this.model.data,this.selection,this.results),Wa(this,this.panelBody),this.updateStatus(),this.syncResultsBar(),uh(this)}select(t,e){if(e==="replace")this.selection=new Set(t);else if(e==="add")for(const n of t)this.selection.add(n);else for(const n of t)this.selection.has(n)?this.selection.delete(n):this.selection.add(n);this.viewer.setData(this.model.data,this.selection,this.results),Wa(this,this.panelBody),this.selection.size&&window.innerWidth>=700&&localStorage.getItem("structapp.panel")!=="closed"&&this.togglePanel(!0),this.updateStatus()}selected(){const t={joints:[],frames:[],areas:[]};for(const e of this.selection){const{kind:n,id:s}=Is(e);(n==="j"?t.joints:n==="f"?t.frames:t.areas).push(s)}for(const e of Object.values(t))e.sort((n,s)=>n-s);return t}selectAll(){const t=this.model.data;this.select([...t.joints.map(e=>Ue("j",e.id)),...t.frames.map(e=>Ue("f",e.id)),...t.areas.map(e=>Ue("a",e.id))],"replace")}onToolChanged(){var t,e;for(const n of["select","joint","frame","area","box"])(t=this.toolButtons.get(n))==null||t.classList.toggle("active",this.tools.tool===n);(e=this.toolButtons.get("multi"))==null||e.classList.toggle("active",this.tools.multi),this.viewer.canvas.dataset.tool=this.tools.tool,this.hintEl.textContent=Eu[this.tools.tool],this.hintEl.hidden=this.tools.tool==="select",this.updateStatus()}updateStatus(){const t=this.model.data,e=this.selected(),n=e.joints.length+e.frames.length+e.areas.length,s=[this.tools.statusText(),`${t.joints.length} joints · ${t.frames.length} frames · ${t.areas.length} areas`];n&&s.push(`${n} selected`),this.results&&s.push(`analysed, max disp ${kn(this.results.stats.maxDisp/ln().kSmall,3)} ${ln().small}`),this.statusEl.textContent=s.filter(Boolean).join("  |  "),this.fileEl.textContent=(this.dirty?"● ":"")+this.fileName,document.title=`${this.dirty?"* ":""}${this.fileName} – StructApp 3D`,this.toolButtons.get("undo").disabled=!this.model.canUndo,this.toolButtons.get("redo").disabled=!this.model.canRedo,this.toolButtons.get("del").disabled=n===0;const r=this.tools.chain.length>0;this.toolButtons.get("done").disabled=!r;const{workPlane:a,elevation:o}=t.settings,l=Fx[a],c=(h,d)=>{var f;const u=(f=this.toolButtons.get(h))==null?void 0:f.querySelector("span");u&&(u.textContent=d)};c("plane",`${a} ${l}=${$t(o,"L",4)}`),c("planeUp",`${l} +`),c("planeDown",`${l} −`)}setWorkPlane(t,e){const n=this.model.data.settings;n.workPlane===t&&n.elevation===e||(n.workPlane=t,n.elevation=e,this.planeOffsets[t]=e,this.dirty=!0,this.scheduleAutosave(),this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}rotateWorkPlane(){const t=["XY","XZ","YZ"],e=this.model.data.settings,n=t[(t.indexOf(e.workPlane)+1)%t.length],{joints:s}=this.selected(),r=s.length===1?this.model.joint(s[0]):void 0,a=r?n==="XY"?r.z:n==="XZ"?r.y:r.x:void 0;this.setWorkPlane(n,a??this.planeOffsets[n]??0)}shiftWorkPlane(t){const e=this.model.data.settings;this.setWorkPlane(e.workPlane,Number((e.elevation+t*e.gridSpacing).toFixed(9)))}setCoordReadout(t){this.coordEl.textContent=t?`X ${$t(t.x,"L",4)}  Y ${$t(t.y,"L",4)}  Z ${$t(t.z,"L",4)} ${jt("L")}`:""}cmd(t){var e,n;(n=(e=this.commands)[t])==null||n.call(e)}need(t){return this.selected()[t].length?!0:(Wt(`Select one or more ${t} first`,"warn"),!1)}undo(){this.model.canUndo&&(this.tools.finishChain(!1),this.keepWorkPlane(()=>this.model.undo()))}keepWorkPlane(t){const{workPlane:e,elevation:n}=this.model.data.settings;t();const s=this.model.data.settings;(s.workPlane!==e||s.elevation!==n)&&(s.workPlane=e,s.elevation=n,this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}redo(){this.model.canRedo&&this.keepWorkPlane(()=>this.model.redo())}async deleteSelected(){const t=this.selected(),e=t.joints.length+t.frames.length+t.areas.length;e&&(this.model.commit("delete",()=>this.model.deleteObjects(t.joints,t.frames,t.areas)),this.selection.clear(),this.refresh(),Wt(`Deleted ${e} object${e>1?"s":""} (Undo to restore)`,"info"))}async analyze(){if(this.busy)return;this.tools.finishChain(!0);const t=this.model.data;if(!t.frames.length)return void vi("Nothing to analyse","Draw at least one frame and assign supports before running the analysis.");this.busy=!0,document.body.classList.add("busy");const e=performance.now();try{const n=await H_(t),s=n.items.find(o=>o.name===this.resultName);this.resultSet=n,this.resultName=s?s.name:(n.items.find(o=>o.kind==="combo")??n.items[0]).name;const r=this.results;this.viewer.setResults(r),this.deformRel=0,this.viewer.setResultOptions({view:"deformed",deformScale:this.viewer.autoDeformScale}),this.refresh();const a=[...new Set(n.items.flatMap(o=>n.results[o.name].warnings))];Wt(`Analysis complete in ${Math.round(performance.now()-e)} ms – ${r.stats.equations} equations, ${n.items.length} cases/combos`,"ok"),a.length&&Wt(a.slice(0,3).join(`
`)+(a.length>3?`
(+${a.length-3} more)`:""),"warn",7e3)}catch(n){vi("Analysis failed",n instanceof Error?n.message:String(n))}finally{this.busy=!1,document.body.classList.remove("busy")}}loadData(t,e,n){this.suppressDirty=!0;try{this.selection.clear(),this.model.load(t)}finally{this.suppressDirty=!1}this.fileName=e,this.fileHandle=n,this.planeOffsets={},this.dirty=!1,this.refresh(),this.viewer.fit()}async confirmDiscard(){return this.dirty?as("Unsaved changes",`Discard unsaved changes to ${this.fileName}?`,"Discard",!0):!0}async newModel(){await this.confirmDiscard()&&(this.loadData(Yo(),"Untitled.sav",null),_s())}async open(){if(await this.confirmDiscard())try{const t=await ix();if(!t)return;const e={},n=ch(t.text,e);this.loadData(n,t.name,t.handle),_s(),e.units&&eh(e.units),Wt(`Opened ${t.name} (${ln().label})`,"ok")}catch(t){vi("Cannot open file",t instanceof De||t instanceof Error?t.message:String(t))}}async save(t=!1){this.tools.finishChain(!0);try{const e=lh(this.model.data,this.includeResults?this.resultSet:null),n=this.fileName.toLowerCase().endsWith(".sav")?this.fileName:this.fileName+".sav",s=await ex(e,n,t?null:this.fileHandle);if(!s)return;this.fileName=s.name,this.fileHandle=s.handle,this.dirty=!1,_s(),this.updateStatus(),Wt(`Saved ${s.name}`,"ok")}catch(e){vi("Save failed",e instanceof Error?e.message:String(e))}}async offerRecovery(){const t=rx();if(!t)return;let e;try{e=ch(t.text)}catch{_s();return}if(!e.joints.length)return;const n=new Date(t.time).toLocaleString();await as("Recover unsaved work?",`An auto-saved copy of "${t.name}" from ${n} was found (${e.joints.length} joints, ${e.frames.length} frames).`,"Recover")?(this.loadData(e,t.name,null),this.dirty=!0,this.updateStatus()):_s()}async loadExample(){if(!await this.confirmDiscard())return;const t=new Cl,e=[0,6,12],n=[0,5],s=[0,3.5,7];t.commit("example",r=>{r.sections.push({name:"WF400",shape:"I",dims:[.4,.2,.013,.008]});const a=(o,l,c)=>t.addJoint(o,l,c);for(let o=0;o<s.length;o++)for(const l of e)for(const c of n){const h=a(l,c,s[o]);o===0&&(t.joint(h).r=[...wh])}for(let o=1;o<s.length;o++){for(const l of e)for(const c of n){const h=t.addFrame(a(l,c,s[o-1]),a(l,c,s[o]));t.frame(h).section="WF400",t.frame(h).material="STEEL"}for(const l of n)for(let c=0;c<e.length-1;c++){const h=t.addFrame(a(e[c],l,s[o]),a(e[c+1],l,s[o]));t.frame(h).section="IWF300",t.frame(h).material="STEEL"}for(const l of e){const c=t.addFrame(a(l,0,s[o]),a(l,5,s[o]));t.frame(c).section="IWF300",t.frame(c).material="STEEL"}for(let l=0;l<e.length-1;l++){const c=t.addArea([a(e[l],0,s[o]),a(e[l+1],0,s[o]),a(e[l+1],5,s[o]),a(e[l],5,s[o])]);r.areaLoads.push({case:Fr,area:c,q:1.5},{case:Or,area:c,q:2.5})}for(const l of n)r.jointLoads.push({case:"WIND",joint:a(0,l,s[o]),f:[5*o,0,0,0,0,0]})}r.loadCases.push({name:"WIND",type:"Other"}),r.loadCombos.push({name:"COMBO2",factors:[{case:Fr,factor:1.2},{case:Or,factor:1},{case:"WIND",factor:1}]}),r.settings.gridSpacing=1,r.settings.gridLines=15,r.settings.selfWeight=!0}),this.loadData(t.data,"Example-2storey.sav",null),Wt("Example loaded – tap Run to analyse","ok")}toggle(t,e,n){return{label:t,checked:e,action:()=>n(!e())}}disp(t,e){return this.toggle(t,()=>this.viewer.display[e],n=>{this.viewer.display[e]=n,this.viewer.rebuildAll()})}fileMenu(){return[{label:"New",shortcut:"Ctrl+N",action:()=>void this.newModel()},{label:"Open .sav…",shortcut:"Ctrl+O",action:()=>void this.open()},{label:"Save",shortcut:"Ctrl+S",action:()=>void this.save()},{label:"Save As…",shortcut:"Ctrl+Shift+S",action:()=>void this.save(!0)},{separator:!0},this.toggle("Include results in .sav",()=>this.includeResults,t=>this.includeResults=t),{separator:!0},{label:"Load example model",action:()=>void this.loadExample()}]}editMenu(){const t=()=>this.selection.size===0;return[{label:"Undo",shortcut:"Ctrl+Z",action:()=>this.undo(),disabled:()=>!this.model.canUndo},{label:"Redo",shortcut:"Ctrl+Y",action:()=>this.redo(),disabled:()=>!this.model.canRedo},{separator:!0},{label:"Select all",shortcut:"Ctrl+A",action:()=>this.selectAll()},{label:"Clear selection",shortcut:"Esc",action:()=>this.select([],"replace"),disabled:t},{label:"Delete selected",shortcut:"Del",action:()=>void this.deleteSelected(),disabled:t},{separator:!0},{label:"Move…",action:()=>gh(this),disabled:t},{label:"Replicate…",action:()=>vh(this),disabled:t},{label:"Divide frames…",action:()=>this.cmd("divide"),disabled:()=>!this.selected().frames.length}]}defineMenu(){return[{label:"Materials…",action:()=>fx(this)},{label:"Frame sections…",action:()=>mx(this)},{label:"Support types…",action:()=>gx(this)},{separator:!0},{label:"Grid & work plane…",action:()=>fh(this)}]}drawMenu(){const t=(e,n,s)=>({label:n,shortcut:s,checked:()=>this.tools.tool===e,action:()=>this.tools.setTool(e)});return[t("select","Select","S"),t("joint","Draw joint","J"),t("frame","Draw frame","L"),t("area","Draw area","A"),t("box","Box select","B"),{separator:!0},{label:"Add joint by coordinates…",action:()=>mh(this)},{label:"Add frame by joints…",action:()=>bx(this)},{separator:!0},{label:"Grid & work plane…",action:()=>fh(this)}]}assignMenu(){return[{heading:"Joints"},{label:"Support / restraints…",action:()=>this.cmd("assignSupport")},{heading:"Frames"},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"Local axis angle β…",action:()=>this.cmd("assignBeta")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{heading:"Areas"},{label:"Load distribution…",action:()=>this.cmd("assignArea")}]}loadsMenu(){return[{label:"Joint point load…",action:()=>this.cmd("jointLoad")},{label:"Frame point load…",action:()=>this.cmd("framePoint")},{label:"Frame uniform load…",action:()=>this.cmd("frameUniform")},{label:"Area uniform load…",action:()=>this.cmd("areaLoad")},{separator:!0},{label:"Load cases…",action:()=>Ax(this)},{label:"Load combinations…",action:()=>Tx(this)},{separator:!0},this.toggle("Include self weight",()=>this.model.data.settings.selfWeight,t=>this.model.commit("self weight",e=>void(e.settings.selfWeight=t))),{separator:!0},{label:"Clear loads on selection…",action:()=>void ph(this),disabled:()=>this.selection.size===0}]}analyzeMenu(){const t=()=>!this.results,e=(n,s)=>({label:s,checked:()=>this.viewer.resultOpts.view===n,disabled:t,action:()=>this.setResultView(n)});return[{label:"Run analysis",shortcut:"F5",action:()=>void this.analyze()},{heading:"Show"},...Mh.map(([n,s])=>e(n,s)),{separator:!0},{label:"Frame diagram…",disabled:t,action:()=>{const n=this.selected().frames;n.length===1?qo(this,n[0]):Wt(n.length?"Select only one frame to show its diagrams":"Select one frame first, then choose Analyze ▸ Frame diagram","warn")}},{label:"Result tables…",action:()=>Ha(this),disabled:t},{label:"Clear results",disabled:t,action:()=>this.clearResults()}]}displayMenu(){const t=this.viewer;return[{heading:"View"},{label:"Fit all",shortcut:"F",action:()=>t.fit()},{label:"3D (isometric)",shortcut:"0",action:()=>t.viewPreset("iso")},{label:"Top (X-Y)",shortcut:"1",action:()=>t.viewPreset("top")},{label:"Front (X-Z)",shortcut:"2",action:()=>t.viewPreset("front")},{label:"Side (Y-Z)",shortcut:"3",action:()=>t.viewPreset("side")},this.toggle("Orthographic",()=>t.useOrtho,e=>t.setOrtho(e)),{heading:"Show"},this.disp("Joint labels","jointLabels"),this.disp("Frame labels","frameLabels"),this.disp("Area labels","areaLabels"),this.disp("Loads","showLoads"),this.disp("Load values","loadValues"),this.disp("Supports","showSupports"),this.disp("Extruded sections","extruded"),{separator:!0},this.toggle("Dark theme",()=>this.theme==="dark",e=>{this.theme=e?"dark":"light",localStorage.setItem("structapp.theme",this.theme),this.applyTheme()}),this.toggle("Properties panel",()=>!this.panel.classList.contains("collapsed"),e=>this.togglePanel(e))]}helpMenu(){return[{label:"Quick guide",shortcut:"F1",action:()=>_h()},{label:"Load example model",action:()=>void this.loadExample()},{separator:!0},{label:"About",action:()=>void vi("About StructApp 3D",C("div",{class:"about"},C("p",{class:"msg"},`StructApp 3D v${Ix} (${Ux})
Touch-friendly 3D frame structural analysis (linear static, 12-DOF space frame elements with member end releases and shear deformation).`),C("h3",null,"Version history"),C("div",{class:"changelog",tabindex:"0","aria-label":"Version history"},...Nx.map(t=>C("section",null,C("h4",null,/^\d/.test(t.version)?`v${t.version}`:`${t.version} release`,C("span",{class:"date"},t.date)),C("ul",null,...t.changes.map(e=>C("li",null,e))))))))}]}contextMenu(t,e){this.tools.finishChain(!0);const n=this.viewer.pick(t,e,24);n&&!this.selection.has(n)&&this.select([n],this.tools.multi?"add":"replace");const s=this.selected(),r=[];if(s.joints.length&&r.push({heading:`Joints (${s.joints.length})`},{label:"Support…",action:()=>this.cmd("assignSupport")},{label:"Joint load…",action:()=>this.cmd("jointLoad")}),s.frames.length===1&&this.results){const a=s.frames[0];r.push({heading:`Frame ${a} results`},{label:"Frame diagrams…",action:()=>qo(this,a)})}s.frames.length&&r.push({heading:`Frames (${s.frames.length})`},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{label:"Point load…",action:()=>this.cmd("framePoint")},{label:"Uniform load…",action:()=>this.cmd("frameUniform")},{label:"Divide…",action:()=>this.cmd("divide")}),s.areas.length&&r.push({heading:`Areas (${s.areas.length})`},{label:"Area load…",action:()=>this.cmd("areaLoad")},{label:"Distribution…",action:()=>this.cmd("assignArea")}),this.selection.size?r.push({separator:!0},{label:"Properties",action:()=>this.togglePanel(!0)},{label:"Move…",action:()=>this.cmd("move")},{label:"Replicate…",action:()=>this.cmd("replicate")},{label:"Clear loads…",action:()=>void ph(this)},{label:"Delete",action:()=>void this.deleteSelected()},{label:"Clear selection",action:()=>this.select([],"replace")}):r.push({label:"Fit all",action:()=>this.viewer.fit()},{label:"Add joint…",action:()=>mh(this)},{label:"Select all",action:()=>this.selectAll()},{label:"Run analysis",action:()=>void this.analyze()}),rh(r,t,e)}installKeyboard(){window.addEventListener("keydown",t=>{const e=t.target;if(E_()||["INPUT","TEXTAREA","SELECT"].includes(e.tagName)||e.isContentEditable)return;const n=t.key.toLowerCase(),s=t.ctrlKey||t.metaKey,r=a=>{t.preventDefault(),a()};if(s){n==="z"&&!t.shiftKey?r(()=>this.undo()):n==="y"||n==="z"&&t.shiftKey?r(()=>this.redo()):n==="s"?r(()=>void this.save(t.shiftKey)):n==="o"?r(()=>void this.open()):n==="n"?r(()=>void this.newModel()):n==="a"&&r(()=>this.selectAll());return}if(!t.altKey)switch(n){case"delete":case"backspace":return r(()=>void this.deleteSelected());case"escape":return r(()=>{Wr(),this.tools.chain.length?this.tools.cancel():this.tools.tool!=="select"?this.tools.setTool("select"):this.select([],"replace")});case"enter":return r(()=>this.tools.finishChain(!0));case"f":return r(()=>this.viewer.fit());case"p":return r(()=>this.rotateWorkPlane());case"pageup":return r(()=>this.shiftWorkPlane(1));case"pagedown":return r(()=>this.shiftWorkPlane(-1));case"s":return r(()=>this.tools.setTool("select"));case"j":return r(()=>this.tools.setTool("joint"));case"l":return r(()=>this.tools.setTool("frame"));case"a":return r(()=>this.tools.setTool("area"));case"b":return r(()=>this.tools.setTool("box"));case"m":return r(()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()});case"f5":return r(()=>void this.analyze());case"f1":return r(()=>_h());case"0":return r(()=>this.viewer.viewPreset("iso"));case"1":return r(()=>this.viewer.viewPreset("top"));case"2":return r(()=>this.viewer.viewPreset("front"));case"3":return r(()=>this.viewer.viewPreset("side"))}})}}let yh=0;document.addEventListener("touchend",i=>{const t=Date.now(),e=i.target;t-yh<350&&!e.closest("input, textarea, select")&&i.preventDefault(),yh=t},{passive:!1});const Nu=document.getElementById("app");if(!Nu)throw new Error("#app element missing");const zx=new Bx(Nu);window.structApp=zx;
