var Bu=Object.defineProperty;var zu=(i,t,e)=>t in i?Bu(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var it=(i,t,e)=>zu(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const ku=["P","V2","V3","T","M2","M3"];function Ir(i){if(!i||!i.some(Boolean))return"None";const t=[];return i[0]&&t.push("P"),i[1]&&t.push("V2"),i[2]&&t.push("V3"),i[3]&&t.push("T"),i[4]&&t.push("M2"),i[5]&&t.push("M3"),t.join(" ")}function El(i){if(!i)return;const t=i.trim().toUpperCase();if(!t||t==="NONE"||t==="NO"||t==="FIXED"||t==="RIGID")return;if(t==="PIN"||t==="PINNED"||t==="HINGE")return[!1,!1,!1,!1,!0,!0];const e=new Set(t.split(/[\s,;|+]+/).map(s=>s.trim().toUpperCase())),n=[e.has("P")||e.has("U1")||e.has("AXIAL"),e.has("V2")||e.has("U2"),e.has("V3")||e.has("U3"),e.has("T")||e.has("R1")||e.has("TORSION"),e.has("M2")||e.has("R2"),e.has("M3")||e.has("R3")];return n.some(Boolean)?n:void 0}const Mh=["GRAV","GX","GY","GZ","L1","L2","L3"],Wa={GRAV:"Gravity (−Z)",GX:"Global X",GY:"Global Y",GZ:"Global Z",L1:"Local 1",L2:"Local 2",L3:"Local 3"},yh=["Dead","Live","Other"],Sh=[!1,!1,!1,!1,!1,!1],bh=[!0,!0,!0,!0,!0,!0],Vu=[!0,!0,!0,!1,!1,!1],Gu=[!1,!1,!0,!1,!1,!1],ni=["UX","UY","UZ","RX","RY","RZ"];function $o(){return{settings:{gridSpacing:1,gridLines:10,workPlane:"XY",elevation:0,selfWeight:!1},materials:[{name:"STEEL",E:2e8,nu:.3,gamma:76.98},{name:"C30",E:25743e3,nu:.2,gamma:23.56}],sections:[{name:"R300x500",shape:"rect",dims:[.5,.3]},{name:"IWF300",shape:"I",dims:[.3,.15,.009,.0065]},{name:"PIPE168",shape:"pipe",dims:[.1683,.0071]}],supportTypes:[{name:"Fixed",r:[...bh]},{name:"Pinned",r:[...Vu]},{name:"Roller Z",r:[...Gu]},{name:"Free",r:[...Sh]}],joints:[],frames:[],areas:[],loadCases:Eh(),loadCombos:wh(),jointLoads:[],framePointLoads:[],frameUniformLoads:[],areaLoads:[]}}const Ur="DEAD",Nr="LIVE";function Eh(){return[{name:Ur,type:"Dead"},{name:Nr,type:"Live"}]}function wh(){return[{name:"COMBO1",factors:[{case:Ur,factor:1.2},{case:Nr,factor:1.6}]}]}function Fr(i){(!Array.isArray(i.loadCases)||i.loadCases.length===0)&&(i.loadCases=Eh()),Array.isArray(i.loadCombos)||(i.loadCombos=wh());const t=new Set(i.loadCases.map(n=>n.name)),e=i.loadCases[0].name;for(const n of[i.jointLoads,i.framePointLoads,i.frameUniformLoads,i.areaLoads])for(const s of n??[])(!s.case||!t.has(s.case))&&(s.case=e);for(const n of i.loadCombos)n.factors=(n.factors??[]).filter(s=>t.has(s.case)&&Number.isFinite(s.factor));return i}const Zr=1e-6;class wl{constructor(t){it(this,"data");it(this,"undoStack",[]);it(this,"redoStack",[]);it(this,"listeners",new Set);it(this,"batchDepth",0);it(this,"maxUndo",100);this.data=Fr(t??$o())}onChange(t){return this.listeners.add(t),()=>this.listeners.delete(t)}emit(t){for(const e of this.listeners)e(t)}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}commit(t,e){if(this.batchDepth>0)return e(this.data);const n=JSON.stringify(this.data);this.batchDepth++;let s;try{s=e(this.data)}catch(r){throw this.data=JSON.parse(n),r}finally{this.batchDepth--}return JSON.stringify(this.data)!==n&&(this.undoStack.push(n),this.undoStack.length>this.maxUndo&&this.undoStack.shift(),this.redoStack=[],this.emit(t)),s}undo(){const t=this.undoStack.pop();t&&(this.redoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("undo"))}redo(){const t=this.redoStack.pop();t&&(this.undoStack.push(JSON.stringify(this.data)),this.data=JSON.parse(t),this.emit("redo"))}load(t){this.data=Fr(t),this.undoStack=[],this.redoStack=[],this.emit("load")}joint(t){return this.data.joints.find(e=>e.id===t)}frame(t){return this.data.frames.find(e=>e.id===t)}area(t){return this.data.areas.find(e=>e.id===t)}jointMap(){return new Map(this.data.joints.map(t=>[t.id,t]))}frameLength(t){const e=this.joint(t.i),n=this.joint(t.j);return!e||!n?0:Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z)}nextId(t){let e=0;for(const n of t)n.id>e&&(e=n.id);return e+1}findJointAt(t,e,n){return this.data.joints.find(s=>Math.abs(s.x-t)<Zr&&Math.abs(s.y-e)<Zr&&Math.abs(s.z-n)<Zr)}addJoint(t,e,n){const s=a=>Math.round(a*1e9)/1e9;t=s(t),e=s(e),n=s(n);const r=this.findJointAt(t,e,n);return r?r.id:this.commit("add joint",a=>{const o=this.nextId(a.joints);return a.joints.push({id:o,x:t,y:e,z:n,r:[...Sh]}),o})}addFrame(t,e){if(t===e||!this.joint(t)||!this.joint(e))return null;const n=this.data.frames.find(s=>s.i===t&&s.j===e||s.i===e&&s.j===t);return n?n.id:this.commit("add frame",s=>{var a,o;const r=this.nextId(s.frames);return s.frames.push({id:r,i:t,j:e,material:((a=s.materials[0])==null?void 0:a.name)??"",section:((o=s.sections[0])==null?void 0:o.name)??"",beta:0}),r})}addArea(t){const e=t.filter((n,s)=>t.indexOf(n)===s);return e.length<3?null:this.commit("add area",n=>{const s=this.nextId(n.areas);return n.areas.push({id:s,joints:e,distribution:"two-way"}),s})}deleteObjects(t,e,n){const s=new Set(t),r=new Set(e),a=new Set(n);this.commit("delete",o=>{for(const l of o.frames)(s.has(l.i)||s.has(l.j))&&r.add(l.id);for(const l of o.areas)l.joints.some(c=>s.has(c))&&a.add(l.id);o.joints=o.joints.filter(l=>!s.has(l.id)),o.frames=o.frames.filter(l=>!r.has(l.id)),o.areas=o.areas.filter(l=>!a.has(l.id)),o.jointLoads=o.jointLoads.filter(l=>!s.has(l.joint)),o.framePointLoads=o.framePointLoads.filter(l=>!r.has(l.frame)),o.frameUniformLoads=o.frameUniformLoads.filter(l=>!r.has(l.frame)),o.areaLoads=o.areaLoads.filter(l=>!a.has(l.area))})}jointsOf(t,e,n){var r;const s=new Set(t);for(const a of e){const o=this.frame(a);o&&(s.add(o.i),s.add(o.j))}for(const a of n)(r=this.area(a))==null||r.joints.forEach(o=>s.add(o));return s}moveJoints(t,e,n,s){const r=this.data.joints.filter(a=>t.has(a.id));for(const a of r){const o=this.findJointAt(a.x+e,a.y+n,a.z+s);if(o&&!t.has(o.id))return`Joint ${a.id} would overlap joint ${o.id}`}return this.commit("move",()=>{for(const a of r)a.x+=e,a.y+=n,a.z+=s}),null}replicate(t,e,n,s,r,a,o){const l={joints:[],frames:[],areas:[]};return this.commit("replicate",c=>{const h=this.jointsOf(t,e,n);for(let d=1;d<=o;d++){const u=new Map;for(const f of h){const p=this.joint(f),m=this.addJoint(p.x+s*d,p.y+r*d,p.z+a*d),g=this.joint(m);g.r=[...p.r],u.set(f,m),l.joints.push(m)}for(const f of e){const p=this.frame(f),m=this.addFrame(u.get(p.i),u.get(p.j));if(m!=null){const g=this.frame(m);g.material=p.material,g.section=p.section,g.beta=p.beta,l.frames.push(m);for(const v of c.framePointLoads.filter(_=>_.frame===f))c.framePointLoads.push({...v,frame:m});for(const v of c.frameUniformLoads.filter(_=>_.frame===f))c.frameUniformLoads.push({...v,frame:m})}}for(const f of n){const p=this.area(f),m=this.addArea(p.joints.map(g=>u.get(g)));if(m!=null){this.area(m).distribution=p.distribution,l.areas.push(m);for(const g of c.areaLoads.filter(v=>v.area===f))c.areaLoads.push({...g,area:m})}}for(const f of t)for(const p of c.jointLoads.filter(m=>m.joint===f))c.jointLoads.push({...p,joint:u.get(f),f:[...p.f]})}}),l}divideFrame(t,e){const n=this.frame(t);!n||e<2||this.commit("divide frame",s=>{const r=this.joint(n.i),a=this.joint(n.j),o=[n.i];for(let d=1;d<e;d++){const u=d/e;o.push(this.addJoint(r.x+(a.x-r.x)*u,r.y+(a.y-r.y)*u,r.z+(a.z-r.z)*u))}o.push(n.j);const l=s.frameUniformLoads.filter(d=>d.frame===t);s.frames=s.frames.filter(d=>d.id!==t),s.frameUniformLoads=s.frameUniformLoads.filter(d=>d.frame!==t);const c=s.framePointLoads.filter(d=>d.frame===t);s.framePointLoads=s.framePointLoads.filter(d=>d.frame!==t);const h=[];for(let d=0;d<e;d++){const u=this.addFrame(o[d],o[d+1]),f=this.frame(u);f.material=n.material,f.section=n.section,f.beta=n.beta,h.push(u);for(const p of l)s.frameUniformLoads.push({...p,frame:u})}for(const d of c){const u=d.rd*e,f=Math.min(Math.floor(u),e-1);s.framePointLoads.push({...d,frame:h[f],rd:u-f})}})}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jo="170",Hu=0,Al=1,Wu=2,Ah=1,Xu=2,Pn=3,ii=0,Xe=1,ln=2,ti=0,Yi=1,Tl=2,Cl=3,Rl=4,$u=5,fi=100,ju=101,qu=102,Yu=103,Ju=104,Zu=200,Ku=201,Qu=202,td=203,Xa=204,$a=205,ed=206,nd=207,id=208,sd=209,rd=210,ad=211,od=212,ld=213,cd=214,ja=0,qa=1,Ya=2,Ki=3,Ja=4,Za=5,Ka=6,Qa=7,Th=0,hd=1,ud=2,ei=0,dd=1,fd=2,pd=3,md=4,gd=5,vd=6,_d=7,Ch=300,Qi=301,ts=302,to=303,eo=304,Hr=306,no=1e3,gi=1001,io=1002,dn=1003,xd=1004,Xs=1005,xn=1006,Kr=1007,vi=1008,On=1009,Rh=1010,Lh=1011,Is=1012,qo=1013,Mi=1014,Un=1015,zs=1016,Yo=1017,Jo=1018,es=1020,Ph=35902,Dh=1021,Ih=1022,un=1023,Uh=1024,Nh=1025,Ji=1026,ns=1027,Fh=1028,Zo=1029,Oh=1030,Ko=1031,Qo=1033,wr=33776,Ar=33777,Tr=33778,Cr=33779,so=35840,ro=35841,ao=35842,oo=35843,lo=36196,co=37492,ho=37496,uo=37808,fo=37809,po=37810,mo=37811,go=37812,vo=37813,_o=37814,xo=37815,Mo=37816,yo=37817,So=37818,bo=37819,Eo=37820,wo=37821,Rr=36492,Ao=36494,To=36495,Bh=36283,Co=36284,Ro=36285,Lo=36286,Md=3200,yd=3201,zh=0,Sd=1,Zn="",He="srgb",as="srgb-linear",Wr="linear",re="srgb",Ci=7680,Ll=519,bd=512,Ed=513,wd=514,kh=515,Ad=516,Td=517,Cd=518,Rd=519,Po=35044,Pl="300 es",Nn=2e3,Or=2001;class os{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Dl=1234567;const bs=Math.PI/180,Us=180/Math.PI;function Mn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Te(i,t,e){return Math.max(t,Math.min(e,i))}function tl(i,t){return(i%t+t)%t}function Ld(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Pd(i,t,e){return i!==t?(e-i)/(t-i):0}function Es(i,t,e){return(1-e)*i+e*t}function Dd(i,t,e,n){return Es(i,t,1-Math.exp(-e*n))}function Id(i,t=1){return t-Math.abs(tl(i,t*2)-t)}function Ud(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Nd(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Fd(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Od(i,t){return i+Math.random()*(t-i)}function Bd(i){return i*(.5-Math.random())}function zd(i){i!==void 0&&(Dl=i);let t=Dl+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function kd(i){return i*bs}function Vd(i){return i*Us}function Gd(i){return(i&i-1)===0&&i!==0}function Hd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Wd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Xd(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),d=r((t-n)/2),u=a((t-n)/2),f=r((n-t)/2),p=a((n-t)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*p,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*p,o*c);break;case"ZYZ":i.set(l*p,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function cn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function ie(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const ui={DEG2RAD:bs,RAD2DEG:Us,generateUUID:Mn,clamp:Te,euclideanModulo:tl,mapLinear:Ld,inverseLerp:Pd,lerp:Es,damp:Dd,pingpong:Id,smoothstep:Ud,smootherstep:Nd,randInt:Fd,randFloat:Od,randFloatSpread:Bd,seededRandom:zd,degToRad:kd,radToDeg:Vd,isPowerOfTwo:Gd,ceilPowerOfTwo:Hd,floorPowerOfTwo:Wd,setQuaternionFromProperEuler:Xd,normalize:ie,denormalize:cn};class ft{constructor(t=0,e=0){ft.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class kt{constructor(t,e,n,s,r,a,o,l,c){kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],p=n[8],m=s[0],g=s[3],v=s[6],_=s[1],M=s[4],x=s[7],D=s[2],A=s[5],P=s[8];return r[0]=a*m+o*_+l*D,r[3]=a*g+o*M+l*A,r[6]=a*v+o*x+l*P,r[1]=c*m+h*_+d*D,r[4]=c*g+h*M+d*A,r[7]=c*v+h*x+d*P,r[2]=u*m+f*_+p*D,r[5]=u*g+f*M+p*A,r[8]=u*v+f*x+p*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*r,f=c*r-a*l,p=e*d+n*u+s*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/p;return t[0]=d*m,t[1]=(s*c-h*n)*m,t[2]=(o*n-s*a)*m,t[3]=u*m,t[4]=(h*e-s*l)*m,t[5]=(s*r-o*e)*m,t[6]=f*m,t[7]=(n*l-c*e)*m,t[8]=(a*e-n*r)*m,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Qr.makeScale(t,e)),this}rotate(t){return this.premultiply(Qr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Qr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Qr=new kt;function Vh(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Br(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function $d(){const i=Br("canvas");return i.style.display="block",i}const Il={};function xs(i){i in Il||(Il[i]=!0,console.warn(i))}function jd(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function qd(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Yd(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Zt={enabled:!0,workingColorSpace:as,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===re&&(i.r=Fn(i.r),i.g=Fn(i.g),i.b=Fn(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===re&&(i.r=Zi(i.r),i.g=Zi(i.g),i.b=Zi(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Zn?Wr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function Fn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Zi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Ul=[.64,.33,.3,.6,.15,.06],Nl=[.2126,.7152,.0722],Fl=[.3127,.329],Ol=new kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bl=new kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Zt.define({[as]:{primaries:Ul,whitePoint:Fl,transfer:Wr,toXYZ:Ol,fromXYZ:Bl,luminanceCoefficients:Nl,workingColorSpaceConfig:{unpackColorSpace:He},outputColorSpaceConfig:{drawingBufferColorSpace:He}},[He]:{primaries:Ul,whitePoint:Fl,transfer:re,toXYZ:Ol,fromXYZ:Bl,luminanceCoefficients:Nl,outputColorSpaceConfig:{drawingBufferColorSpace:He}}});let Ri;class Jd{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Ri===void 0&&(Ri=Br("canvas")),Ri.width=t.width,Ri.height=t.height;const n=Ri.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Ri}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Br("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Fn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Fn(e[n]/255)*255):e[n]=Fn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Zd=0;class Gh{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=Mn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ta(s[a].image)):r.push(ta(s[a]))}else r=ta(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function ta(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Jd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Kd=0;class Ve extends os{constructor(t=Ve.DEFAULT_IMAGE,e=Ve.DEFAULT_MAPPING,n=gi,s=gi,r=xn,a=vi,o=un,l=On,c=Ve.DEFAULT_ANISOTROPY,h=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Kd++}),this.uuid=Mn(),this.name="",this.source=new Gh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ft(0,0),this.repeat=new ft(1,1),this.center=new ft(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ch)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case no:t.x=t.x-Math.floor(t.x);break;case gi:t.x=t.x<0?0:1;break;case io:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case no:t.y=t.y-Math.floor(t.y);break;case gi:t.y=t.y<0?0:1;break;case io:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ve.DEFAULT_IMAGE=null;Ve.DEFAULT_MAPPING=Ch;Ve.DEFAULT_ANISOTROPY=1;class le{constructor(t=0,e=0,n=0,s=1){le.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],m=l[2],g=l[6],v=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-m)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+m)<.1&&Math.abs(p+g)<.1&&Math.abs(c+f+v-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,x=(f+1)/2,D=(v+1)/2,A=(h+u)/4,P=(d+m)/4,I=(p+g)/4;return M>x&&M>D?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=A/n,r=P/n):x>D?x<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(x),n=A/s,r=I/s):D<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(D),n=P/r,s=I/r),this.set(n,s,r,e),this}let _=Math.sqrt((g-p)*(g-p)+(d-m)*(d-m)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(g-p)/_,this.y=(d-m)/_,this.z=(u-h)/_,this.w=Math.acos((c+f+v-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Qd extends os{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new le(0,0,t,e),this.scissorTest=!1,this.viewport=new le(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ve(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Gh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yi extends Qd{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Hh extends Ve{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class tf extends Ve{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=dn,this.minFilter=dn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ks{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3];const u=r[a+0],f=r[a+1],p=r[a+2],m=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=u,t[e+1]=f,t[e+2]=p,t[e+3]=m;return}if(d!==m||l!==u||c!==f||h!==p){let g=1-o;const v=l*u+c*f+h*p+d*m,_=v>=0?1:-1,M=1-v*v;if(M>Number.EPSILON){const D=Math.sqrt(M),A=Math.atan2(D,v*_);g=Math.sin(g*A)/D,o=Math.sin(o*A)/D}const x=o*_;if(l=l*g+u*x,c=c*g+f*x,h=h*g+p*x,d=d*g+m*x,g===1-o){const D=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=D,c*=D,h*=D,d*=D}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],f=r[a+2],p=r[a+3];return t[e]=o*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-o*f,t[e+2]=c*p+h*f+o*u-l*d,t[e+3]=h*p-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),f=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(n>o&&n>d){const f=2*Math.sqrt(1+n-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-n-d);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-n-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Te(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=a*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(zl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(zl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),d=2*(r*n-a*e);return this.x=e+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ea.copy(this).projectOnVector(t),this.sub(ea)}reflect(t){return this.sub(ea.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ea=new L,zl=new ks;class kn{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(nn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(nn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=nn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,nn):nn.fromBufferAttribute(r,a),nn.applyMatrix4(t.matrixWorld),this.expandByPoint(nn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$s.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),$s.copy(n.boundingBox)),$s.applyMatrix4(t.matrixWorld),this.union($s)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,nn),nn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(fs),js.subVectors(this.max,fs),Li.subVectors(t.a,fs),Pi.subVectors(t.b,fs),Di.subVectors(t.c,fs),Wn.subVectors(Pi,Li),Xn.subVectors(Di,Pi),ri.subVectors(Li,Di);let e=[0,-Wn.z,Wn.y,0,-Xn.z,Xn.y,0,-ri.z,ri.y,Wn.z,0,-Wn.x,Xn.z,0,-Xn.x,ri.z,0,-ri.x,-Wn.y,Wn.x,0,-Xn.y,Xn.x,0,-ri.y,ri.x,0];return!na(e,Li,Pi,Di,js)||(e=[1,0,0,0,1,0,0,0,1],!na(e,Li,Pi,Di,js))?!1:(qs.crossVectors(Wn,Xn),e=[qs.x,qs.y,qs.z],na(e,Li,Pi,Di,js))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,nn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(nn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(An[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),An[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),An[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),An[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),An[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),An[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),An[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),An[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(An),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const An=[new L,new L,new L,new L,new L,new L,new L,new L],nn=new L,$s=new kn,Li=new L,Pi=new L,Di=new L,Wn=new L,Xn=new L,ri=new L,fs=new L,js=new L,qs=new L,ai=new L;function na(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ai.fromArray(i,r);const o=s.x*Math.abs(ai.x)+s.y*Math.abs(ai.y)+s.z*Math.abs(ai.z),l=t.dot(ai),c=e.dot(ai),h=n.dot(ai);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const ef=new kn,ps=new L,ia=new L;class Ai{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ef.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ps.subVectors(t,this.center);const e=ps.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ps,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ia.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ps.copy(t.center).add(ia)),this.expandByPoint(ps.copy(t.center).sub(ia))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Tn=new L,sa=new L,Ys=new L,$n=new L,ra=new L,Js=new L,aa=new L;class el{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Tn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Tn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Tn.copy(this.origin).addScaledVector(this.direction,e),Tn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){sa.copy(t).add(e).multiplyScalar(.5),Ys.copy(e).sub(t).normalize(),$n.copy(this.origin).sub(sa);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ys),o=$n.dot(this.direction),l=-$n.dot(Ys),c=$n.lengthSq(),h=Math.abs(1-a*a);let d,u,f,p;if(h>0)if(d=a*l-o,u=a*o-l,p=r*h,d>=0)if(u>=-p)if(u<=p){const m=1/h;d*=m,u*=m,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(sa).addScaledVector(Ys,u),f}intersectSphere(t,e){Tn.subVectors(t.center,this.origin);const n=Tn.dot(this.direction),s=Tn.dot(Tn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Tn)!==null}intersectTriangle(t,e,n,s,r){ra.subVectors(e,t),Js.subVectors(n,t),aa.crossVectors(ra,Js);let a=this.direction.dot(aa),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$n.subVectors(this.origin,t);const l=o*this.direction.dot(Js.crossVectors($n,Js));if(l<0)return null;const c=o*this.direction.dot(ra.cross($n));if(c<0||l+c>a)return null;const h=-o*$n.dot(aa);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class se{constructor(t,e,n,s,r,a,o,l,c,h,d,u,f,p,m,g){se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,d,u,f,p,m,g)}set(t,e,n,s,r,a,o,l,c,h,d,u,f,p,m,g){const v=this.elements;return v[0]=t,v[4]=e,v[8]=n,v[12]=s,v[1]=r,v[5]=a,v[9]=o,v[13]=l,v[2]=c,v[6]=h,v[10]=d,v[14]=u,v[3]=f,v[7]=p,v[11]=m,v[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new se().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ii.setFromMatrixColumn(t,0).length(),r=1/Ii.setFromMatrixColumn(t,1).length(),a=1/Ii.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){const u=a*h,f=a*d,p=o*h,m=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-m*c,e[9]=-o*l,e[2]=m-u*c,e[6]=p+f*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,m=c*d;e[0]=u+m*o,e[4]=p*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=m+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,m=c*d;e[0]=u-m*o,e[4]=-a*d,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=m-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,f=a*d,p=o*h,m=o*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+m,e[1]=l*d,e[5]=m*c+u,e[9]=f*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,f=a*c,p=o*l,m=o*c;e[0]=l*h,e[4]=m-u*d,e[8]=p*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-m*d}else if(t.order==="XZY"){const u=a*l,f=a*c,p=o*l,m=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+m,e[5]=a*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=o*h,e[10]=m*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(nf,t,sf)}lookAt(t,e,n){const s=this.elements;return je.subVectors(t,e),je.lengthSq()===0&&(je.z=1),je.normalize(),jn.crossVectors(n,je),jn.lengthSq()===0&&(Math.abs(n.z)===1?je.x+=1e-4:je.z+=1e-4,je.normalize(),jn.crossVectors(n,je)),jn.normalize(),Zs.crossVectors(je,jn),s[0]=jn.x,s[4]=Zs.x,s[8]=je.x,s[1]=jn.y,s[5]=Zs.y,s[9]=je.y,s[2]=jn.z,s[6]=Zs.z,s[10]=je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],p=n[2],m=n[6],g=n[10],v=n[14],_=n[3],M=n[7],x=n[11],D=n[15],A=s[0],P=s[4],I=s[8],y=s[12],S=s[1],C=s[5],V=s[9],F=s[13],z=s[2],q=s[6],G=s[10],K=s[14],X=s[3],at=s[7],ht=s[11],mt=s[15];return r[0]=a*A+o*S+l*z+c*X,r[4]=a*P+o*C+l*q+c*at,r[8]=a*I+o*V+l*G+c*ht,r[12]=a*y+o*F+l*K+c*mt,r[1]=h*A+d*S+u*z+f*X,r[5]=h*P+d*C+u*q+f*at,r[9]=h*I+d*V+u*G+f*ht,r[13]=h*y+d*F+u*K+f*mt,r[2]=p*A+m*S+g*z+v*X,r[6]=p*P+m*C+g*q+v*at,r[10]=p*I+m*V+g*G+v*ht,r[14]=p*y+m*F+g*K+v*mt,r[3]=_*A+M*S+x*z+D*X,r[7]=_*P+M*C+x*q+D*at,r[11]=_*I+M*V+x*G+D*ht,r[15]=_*y+M*F+x*K+D*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],m=t[7],g=t[11],v=t[15];return p*(+r*l*d-s*c*d-r*o*u+n*c*u+s*o*f-n*l*f)+m*(+e*l*f-e*c*u+r*a*u-s*a*f+s*c*h-r*l*h)+g*(+e*c*d-e*o*f-r*a*d+n*a*f+r*o*h-n*c*h)+v*(-s*o*h-e*l*d+e*o*u+s*a*d-n*a*u+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],m=t[13],g=t[14],v=t[15],_=d*g*c-m*u*c+m*l*f-o*g*f-d*l*v+o*u*v,M=p*u*c-h*g*c-p*l*f+a*g*f+h*l*v-a*u*v,x=h*m*c-p*d*c+p*o*f-a*m*f-h*o*v+a*d*v,D=p*d*l-h*m*l-p*o*u+a*m*u+h*o*g-a*d*g,A=e*_+n*M+s*x+r*D;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/A;return t[0]=_*P,t[1]=(m*u*r-d*g*r-m*s*f+n*g*f+d*s*v-n*u*v)*P,t[2]=(o*g*r-m*l*r+m*s*c-n*g*c-o*s*v+n*l*v)*P,t[3]=(d*l*r-o*u*r-d*s*c+n*u*c+o*s*f-n*l*f)*P,t[4]=M*P,t[5]=(h*g*r-p*u*r+p*s*f-e*g*f-h*s*v+e*u*v)*P,t[6]=(p*l*r-a*g*r-p*s*c+e*g*c+a*s*v-e*l*v)*P,t[7]=(a*u*r-h*l*r+h*s*c-e*u*c-a*s*f+e*l*f)*P,t[8]=x*P,t[9]=(p*d*r-h*m*r-p*n*f+e*m*f+h*n*v-e*d*v)*P,t[10]=(a*m*r-p*o*r+p*n*c-e*m*c-a*n*v+e*o*v)*P,t[11]=(h*o*r-a*d*r-h*n*c+e*d*c+a*n*f-e*o*f)*P,t[12]=D*P,t[13]=(h*m*s-p*d*s+p*n*u-e*m*u-h*n*g+e*d*g)*P,t[14]=(p*o*s-a*m*s-p*n*l+e*m*l+a*n*g-e*o*g)*P,t[15]=(a*d*s-h*o*s+h*n*l-e*d*l-a*n*u+e*o*u)*P,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,d=o+o,u=r*c,f=r*h,p=r*d,m=a*h,g=a*d,v=o*d,_=l*c,M=l*h,x=l*d,D=n.x,A=n.y,P=n.z;return s[0]=(1-(m+v))*D,s[1]=(f+x)*D,s[2]=(p-M)*D,s[3]=0,s[4]=(f-x)*A,s[5]=(1-(u+v))*A,s[6]=(g+_)*A,s[7]=0,s[8]=(p+M)*P,s[9]=(g-_)*P,s[10]=(1-(u+m))*P,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ii.set(s[0],s[1],s[2]).length();const a=Ii.set(s[4],s[5],s[6]).length(),o=Ii.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],sn.copy(this);const c=1/r,h=1/a,d=1/o;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=h,sn.elements[5]*=h,sn.elements[6]*=h,sn.elements[8]*=d,sn.elements[9]*=d,sn.elements[10]*=d,e.setFromRotationMatrix(sn),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Nn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-s),d=(e+t)/(e-t),u=(n+s)/(n-s);let f,p;if(o===Nn)f=-(a+r)/(a-r),p=-2*a*r/(a-r);else if(o===Or)f=-a/(a-r),p=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Nn){const l=this.elements,c=1/(e-t),h=1/(n-s),d=1/(a-r),u=(e+t)*c,f=(n+s)*h;let p,m;if(o===Nn)p=(a+r)*d,m=-2*d;else if(o===Or)p=r*d,m=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=m,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ii=new L,sn=new se,nf=new L(0,0,0),sf=new L(1,1,1),jn=new L,Zs=new L,je=new L,kl=new se,Vl=new ks;class Sn{constructor(t=0,e=0,n=0,s=Sn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(Te(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Te(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Te(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Te(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return kl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(kl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Vl.setFromEuler(this),this.setFromQuaternion(Vl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Sn.DEFAULT_ORDER="XYZ";class nl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rf=0;const Gl=new L,Ui=new ks,Cn=new se,Ks=new L,ms=new L,af=new L,of=new ks,Hl=new L(1,0,0),Wl=new L(0,1,0),Xl=new L(0,0,1),$l={type:"added"},lf={type:"removed"},Ni={type:"childadded",child:null},oa={type:"childremoved",child:null};class Me extends os{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rf++}),this.uuid=Mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Me.DEFAULT_UP.clone();const t=new L,e=new Sn,n=new ks,s=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new se},normalMatrix:{value:new kt}}),this.matrix=new se,this.matrixWorld=new se,this.matrixAutoUpdate=Me.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new nl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.premultiply(Ui),this}rotateX(t){return this.rotateOnAxis(Hl,t)}rotateY(t){return this.rotateOnAxis(Wl,t)}rotateZ(t){return this.rotateOnAxis(Xl,t)}translateOnAxis(t,e){return Gl.copy(t).applyQuaternion(this.quaternion),this.position.add(Gl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Hl,t)}translateY(t){return this.translateOnAxis(Wl,t)}translateZ(t){return this.translateOnAxis(Xl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ks.copy(t):Ks.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(ms,Ks,this.up):Cn.lookAt(Ks,ms,this.up),this.quaternion.setFromRotationMatrix(Cn),s&&(Cn.extractRotation(s.matrixWorld),Ui.setFromRotationMatrix(Cn),this.quaternion.premultiply(Ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($l),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(lf),oa.child=t,this.dispatchEvent(oa),oa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($l),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,t,af),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,of,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Me.DEFAULT_UP=new L(0,1,0);Me.DEFAULT_MATRIX_AUTO_UPDATE=!0;Me.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const rn=new L,Rn=new L,la=new L,Ln=new L,Fi=new L,Oi=new L,jl=new L,ca=new L,ha=new L,ua=new L,da=new le,fa=new le,pa=new le;class hn{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),rn.subVectors(t,e),s.cross(rn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){rn.subVectors(s,e),Rn.subVectors(n,e),la.subVectors(t,e);const a=rn.dot(rn),o=rn.dot(Rn),l=rn.dot(la),c=Rn.dot(Rn),h=Rn.dot(la),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-f-p,p,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(a,Ln.y),l.addScaledVector(o,Ln.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return da.setScalar(0),fa.setScalar(0),pa.setScalar(0),da.fromBufferAttribute(t,e),fa.fromBufferAttribute(t,n),pa.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(da,r.x),a.addScaledVector(fa,r.y),a.addScaledVector(pa,r.z),a}static isFrontFacing(t,e,n,s){return rn.subVectors(n,e),Rn.subVectors(t,e),rn.cross(Rn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return rn.subVectors(this.c,this.b),Rn.subVectors(this.a,this.b),rn.cross(Rn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return hn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return hn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return hn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return hn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return hn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Fi.subVectors(s,n),Oi.subVectors(r,n),ca.subVectors(t,n);const l=Fi.dot(ca),c=Oi.dot(ca);if(l<=0&&c<=0)return e.copy(n);ha.subVectors(t,s);const h=Fi.dot(ha),d=Oi.dot(ha);if(h>=0&&d<=h)return e.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Fi,a);ua.subVectors(t,r);const f=Fi.dot(ua),p=Oi.dot(ua);if(p>=0&&f<=p)return e.copy(r);const m=f*c-l*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(Oi,o);const g=h*p-f*d;if(g<=0&&d-h>=0&&f-p>=0)return jl.subVectors(r,s),o=(d-h)/(d-h+(f-p)),e.copy(s).addScaledVector(jl,o);const v=1/(g+m+u);return a=m*v,o=u*v,e.copy(n).addScaledVector(Fi,a).addScaledVector(Oi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Wh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},qn={h:0,s:0,l:0},Qs={h:0,s:0,l:0};function ma(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Ht{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=He){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Zt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Zt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Zt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Zt.workingColorSpace){if(t=tl(t,1),e=Te(e,0,1),n=Te(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ma(a,r,t+1/3),this.g=ma(a,r,t),this.b=ma(a,r,t-1/3)}return Zt.toWorkingColorSpace(this,s),this}setStyle(t,e=He){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=He){const n=Wh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Fn(t.r),this.g=Fn(t.g),this.b=Fn(t.b),this}copyLinearToSRGB(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=He){return Zt.fromWorkingColorSpace(Fe.copy(this),t),Math.round(Te(Fe.r*255,0,255))*65536+Math.round(Te(Fe.g*255,0,255))*256+Math.round(Te(Fe.b*255,0,255))}getHexString(t=He){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Zt.workingColorSpace){Zt.fromWorkingColorSpace(Fe.copy(this),e);const n=Fe.r,s=Fe.g,r=Fe.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Zt.workingColorSpace){return Zt.fromWorkingColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=He){Zt.fromWorkingColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,s=Fe.b;return t!==He?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(qn),this.setHSL(qn.h+t,qn.s+e,qn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(qn),t.getHSL(Qs);const n=Es(qn.h,Qs.h,e),s=Es(qn.s,Qs.s,e),r=Es(qn.l,Qs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new Ht;Ht.NAMES=Wh;let cf=0;class ls extends os{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=Mn(),this.name="",this.blending=Yi,this.side=ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Xa,this.blendDst=$a,this.blendEquation=fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ht(0,0,0),this.blendAlpha=0,this.depthFunc=Ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ll,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ci,this.stencilZFail=Ci,this.stencilZPass=Ci,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Yi&&(n.blending=this.blending),this.side!==ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Xa&&(n.blendSrc=this.blendSrc),this.blendDst!==$a&&(n.blendDst=this.blendDst),this.blendEquation!==fi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ll&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ci&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ci&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ci&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ws extends ls{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Ht(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=Th,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const xe=new L,tr=new ft;class fn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Po,this.updateRanges=[],this.gpuType=Un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)tr.fromBufferAttribute(this,e),tr.applyMatrix3(t),this.setXY(e,tr.x,tr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix3(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix4(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.applyNormalMatrix(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)xe.fromBufferAttribute(this,e),xe.transformDirection(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=cn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=cn(e,this.array)),e}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=cn(e,this.array)),e}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=cn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=cn(e,this.array)),e}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Po&&(t.usage=this.usage),t}}class Xh extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class $h extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class fe extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let hf=0;const Ze=new se,ga=new Me,Bi=new L,qe=new kn,gs=new kn,be=new L;class Ce extends os{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hf++}),this.uuid=Mn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vh(t)?$h:Xh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ze.makeRotationFromQuaternion(t),this.applyMatrix4(Ze),this}rotateX(t){return Ze.makeRotationX(t),this.applyMatrix4(Ze),this}rotateY(t){return Ze.makeRotationY(t),this.applyMatrix4(Ze),this}rotateZ(t){return Ze.makeRotationZ(t),this.applyMatrix4(Ze),this}translate(t,e,n){return Ze.makeTranslation(t,e,n),this.applyMatrix4(Ze),this}scale(t,e,n){return Ze.makeScale(t,e,n),this.applyMatrix4(Ze),this}lookAt(t){return ga.lookAt(t),ga.updateMatrix(),this.applyMatrix4(ga.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new fe(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];qe.setFromBufferAttribute(r),this.morphTargetsRelative?(be.addVectors(this.boundingBox.min,qe.min),this.boundingBox.expandByPoint(be),be.addVectors(this.boundingBox.max,qe.max),this.boundingBox.expandByPoint(be)):(this.boundingBox.expandByPoint(qe.min),this.boundingBox.expandByPoint(qe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ai);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(qe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];gs.setFromBufferAttribute(o),this.morphTargetsRelative?(be.addVectors(qe.min,gs.min),qe.expandByPoint(be),be.addVectors(qe.max,gs.max),qe.expandByPoint(be)):(qe.expandByPoint(gs.min),qe.expandByPoint(gs.max))}qe.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)be.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(be));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)be.fromBufferAttribute(o,c),l&&(Bi.fromBufferAttribute(t,c),be.add(Bi)),s=Math.max(s,n.distanceToSquared(be))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let I=0;I<n.count;I++)o[I]=new L,l[I]=new L;const c=new L,h=new L,d=new L,u=new ft,f=new ft,p=new ft,m=new L,g=new L;function v(I,y,S){c.fromBufferAttribute(n,I),h.fromBufferAttribute(n,y),d.fromBufferAttribute(n,S),u.fromBufferAttribute(r,I),f.fromBufferAttribute(r,y),p.fromBufferAttribute(r,S),h.sub(c),d.sub(c),f.sub(u),p.sub(u);const C=1/(f.x*p.y-p.x*f.y);isFinite(C)&&(m.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(C),g.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(C),o[I].add(m),o[y].add(m),o[S].add(m),l[I].add(g),l[y].add(g),l[S].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let I=0,y=_.length;I<y;++I){const S=_[I],C=S.start,V=S.count;for(let F=C,z=C+V;F<z;F+=3)v(t.getX(F+0),t.getX(F+1),t.getX(F+2))}const M=new L,x=new L,D=new L,A=new L;function P(I){D.fromBufferAttribute(s,I),A.copy(D);const y=o[I];M.copy(y),M.sub(D.multiplyScalar(D.dot(y))).normalize(),x.crossVectors(A,y);const C=x.dot(l[I])<0?-1:1;a.setXYZW(I,M.x,M.y,M.z,C)}for(let I=0,y=_.length;I<y;++I){const S=_[I],C=S.start,V=S.count;for(let F=C,z=C+V;F<z;F+=3)P(t.getX(F+0)),P(t.getX(F+1)),P(t.getX(F+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);const s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,d=new L;if(t)for(let u=0,f=t.count;u<f;u+=3){const p=t.getX(u+0),m=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,m),a.fromBufferAttribute(e,g),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,m),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(m,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)be.fromBufferAttribute(t,e),be.normalize(),t.setXYZ(e,be.x,be.y,be.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,p=0;for(let m=0,g=l.length;m<g;m++){o.isInterleavedBufferAttribute?f=l[m]*o.data.stride+o.offset:f=l[m]*h;for(let v=0;v<h;v++)u[p++]=c[f++]}return new fn(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ce,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ql=new se,oi=new el,er=new Ai,Yl=new L,nr=new L,ir=new L,sr=new L,va=new L,rr=new L,Jl=new L,ar=new L;class we extends Me{constructor(t=new Ce,e=new ws){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){rr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(va.fromBufferAttribute(d,t),a?rr.addScaledVector(va,h):rr.addScaledVector(va.sub(e),h))}e.add(rr)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(r),oi.copy(t.ray).recast(t.near),!(er.containsPoint(oi.origin)===!1&&(oi.intersectSphere(er,Yl)===null||oi.origin.distanceToSquared(Yl)>(t.far-t.near)**2))&&(ql.copy(r).invert(),oi.copy(t.ray).applyMatrix4(ql),!(n.boundingBox!==null&&oi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,oi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,m=u.length;p<m;p++){const g=u[p],v=a[g.materialIndex],_=Math.max(g.start,f.start),M=Math.min(o.count,Math.min(g.start+g.count,f.start+f.count));for(let x=_,D=M;x<D;x+=3){const A=o.getX(x),P=o.getX(x+1),I=o.getX(x+2);s=or(this,v,t,n,c,h,d,A,P,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),m=Math.min(o.count,f.start+f.count);for(let g=p,v=m;g<v;g+=3){const _=o.getX(g),M=o.getX(g+1),x=o.getX(g+2);s=or(this,a,t,n,c,h,d,_,M,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,m=u.length;p<m;p++){const g=u[p],v=a[g.materialIndex],_=Math.max(g.start,f.start),M=Math.min(l.count,Math.min(g.start+g.count,f.start+f.count));for(let x=_,D=M;x<D;x+=3){const A=x,P=x+1,I=x+2;s=or(this,v,t,n,c,h,d,A,P,I),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const p=Math.max(0,f.start),m=Math.min(l.count,f.start+f.count);for(let g=p,v=m;g<v;g+=3){const _=g,M=g+1,x=g+2;s=or(this,a,t,n,c,h,d,_,M,x),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function uf(i,t,e,n,s,r,a,o){let l;if(t.side===Xe?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===ii,o),l===null)return null;ar.copy(o),ar.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(ar);return c<e.near||c>e.far?null:{distance:c,point:ar.clone(),object:i}}function or(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,nr),i.getVertexPosition(l,ir),i.getVertexPosition(c,sr);const h=uf(i,t,e,n,nr,ir,sr,Jl);if(h){const d=new L;hn.getBarycoord(Jl,nr,ir,sr,d),s&&(h.uv=hn.getInterpolatedAttribute(s,o,l,c,d,new ft)),r&&(h.uv1=hn.getInterpolatedAttribute(r,o,l,c,d,new ft)),a&&(h.normal=hn.getInterpolatedAttribute(a,o,l,c,d,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new L,materialIndex:0};hn.getNormal(nr,ir,sr,u.normal),h.face=u,h.barycoord=d}return h}class cs extends Ce{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(d,2));function p(m,g,v,_,M,x,D,A,P,I,y){const S=x/P,C=D/I,V=x/2,F=D/2,z=A/2,q=P+1,G=I+1;let K=0,X=0;const at=new L;for(let ht=0;ht<G;ht++){const mt=ht*C-F;for(let Nt=0;Nt<q;Nt++){const Jt=Nt*S-V;at[m]=Jt*_,at[g]=mt*M,at[v]=z,c.push(at.x,at.y,at.z),at[m]=0,at[g]=0,at[v]=A>0?1:-1,h.push(at.x,at.y,at.z),d.push(Nt/P),d.push(1-ht/I),K+=1}}for(let ht=0;ht<I;ht++)for(let mt=0;mt<P;mt++){const Nt=u+mt+q*ht,Jt=u+mt+q*(ht+1),U=u+(mt+1)+q*(ht+1),Z=u+(mt+1)+q*ht;l.push(Nt,Jt,Z),l.push(Jt,U,Z),X+=6}o.addGroup(f,X,y),f+=X,u+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cs(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function is(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Be(i){const t={};for(let e=0;e<i.length;e++){const n=is(i[e]);for(const s in n)t[s]=n[s]}return t}function df(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function jh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Zt.workingColorSpace}const il={clone:is,merge:Be};var ff=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,pf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Bn extends ls{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ff,this.fragmentShader=pf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=is(t.uniforms),this.uniformsGroups=df(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class qh extends Me{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new se,this.projectionMatrix=new se,this.projectionMatrixInverse=new se,this.coordinateSystem=Nn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Yn=new L,Zl=new ft,Kl=new ft;class Ke extends qh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Us*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(bs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Us*2*Math.atan(Math.tan(bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Yn.x,Yn.y).multiplyScalar(-t/Yn.z),Yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yn.x,Yn.y).multiplyScalar(-t/Yn.z)}getViewSize(t,e){return this.getViewBounds(t,Zl,Kl),e.subVectors(Kl,Zl)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(bs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const zi=-90,ki=1;class mf extends Me{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ke(zi,ki,t,e);s.layers=this.layers,this.add(s);const r=new Ke(zi,ki,t,e);r.layers=this.layers,this.add(r);const a=new Ke(zi,ki,t,e);a.layers=this.layers,this.add(a);const o=new Ke(zi,ki,t,e);o.layers=this.layers,this.add(o);const l=new Ke(zi,ki,t,e);l.layers=this.layers,this.add(l);const c=new Ke(zi,ki,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Nn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Or)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=m,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class Yh extends Ve{constructor(t,e,n,s,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:Qi,super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class gf extends yi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Yh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:xn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new cs(5,5,5),r=new Bn({name:"CubemapFromEquirect",uniforms:is(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xe,blending:ti});r.uniforms.tEquirect.value=e;const a=new we(s,r),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=xn),new mf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const _a=new L,vf=new L,_f=new kt;class Dn{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=_a.subVectors(n,e).cross(vf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(_a),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||_f.getNormalMatrix(t),s=this.coplanarPoint(_a).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new Ai,lr=new L;class sl{constructor(t=new Dn,e=new Dn,n=new Dn,s=new Dn,r=new Dn,a=new Dn){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Nn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],h=s[5],d=s[6],u=s[7],f=s[8],p=s[9],m=s[10],g=s[11],v=s[12],_=s[13],M=s[14],x=s[15];if(n[0].setComponents(l-r,u-c,g-f,x-v).normalize(),n[1].setComponents(l+r,u+c,g+f,x+v).normalize(),n[2].setComponents(l+a,u+h,g+p,x+_).normalize(),n[3].setComponents(l-a,u-h,g-p,x-_).normalize(),n[4].setComponents(l-o,u-d,g-m,x-M).normalize(),e===Nn)n[5].setComponents(l+o,u+d,g+m,x+M).normalize();else if(e===Or)n[5].setComponents(o,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(t){return li.center.set(0,0,0),li.radius=.7071067811865476,li.applyMatrix4(t.matrixWorld),this.intersectsSphere(li)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(lr.x=s.normal.x>0?t.max.x:t.min.x,lr.y=s.normal.y>0?t.max.y:t.min.y,lr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(lr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Jh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function xf(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],m=d[f];m.start<=p.start+p.count+1?p.count=Math.max(p.count,m.start+m.count-p.start):(++u,d[u]=m)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const m=d[f];i.bufferSubData(c,m.start*h.BYTES_PER_ELEMENT,h,m.start,m.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}class Xr extends Ce{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=t/o,u=e/l,f=[],p=[],m=[],g=[];for(let v=0;v<h;v++){const _=v*u-a;for(let M=0;M<c;M++){const x=M*d-r;p.push(x,-_,0),m.push(0,0,1),g.push(M/o),g.push(1-v/l)}}for(let v=0;v<l;v++)for(let _=0;_<o;_++){const M=_+c*v,x=_+c*(v+1),D=_+1+c*(v+1),A=_+1+c*v;f.push(M,x,A),f.push(x,D,A)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(m,3)),this.setAttribute("uv",new fe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xr(t.width,t.height,t.widthSegments,t.heightSegments)}}var Mf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yf=`#ifdef USE_ALPHAHASH
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
#endif`,Sf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,bf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ef=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Af=`#ifdef USE_AOMAP
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
#endif`,Tf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cf=`#ifdef USE_BATCHING
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
#endif`,Rf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Lf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Df=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,If=`#ifdef USE_IRIDESCENCE
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
#endif`,Uf=`#ifdef USE_BUMPMAP
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
#endif`,Nf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ff=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Of=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Bf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Vf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Gf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Hf=`#define PI 3.141592653589793
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
} // validated`,Wf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Xf=`vec3 transformedNormal = objectNormal;
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
#endif`,$f=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Jf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Kf=`#ifdef USE_ENVMAP
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
#endif`,Qf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,tp=`#ifdef USE_ENVMAP
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
#endif`,ep=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,np=`#ifdef USE_ENVMAP
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
#endif`,ip=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,rp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ap=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,op=`#ifdef USE_GRADIENTMAP
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
}`,lp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,up=`uniform bool receiveShadow;
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
#endif`,dp=`#ifdef USE_ENVMAP
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
#endif`,fp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,pp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,vp=`PhysicalMaterial material;
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
#endif`,_p=`struct PhysicalMaterial {
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
}`,xp=`
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
#endif`,Mp=`#if defined( RE_IndirectDiffuse )
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
#endif`,yp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Sp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,bp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ep=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Ap=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Tp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rp=`#if defined( USE_POINTS_UV )
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
#endif`,Lp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Dp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ip=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Up=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Np=`#ifdef USE_MORPHTARGETS
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
#endif`,Fp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Op=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Bp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,zp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gp=`#ifdef USE_NORMALMAP
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
#endif`,Hp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Wp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Xp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,$p=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Yp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Kp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,tm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,em=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,im=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sm=`float getShadowMask() {
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
}`,rm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,am=`#ifdef USE_SKINNING
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
#endif`,om=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lm=`#ifdef USE_SKINNING
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
#endif`,cm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,hm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,um=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,dm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fm=`#ifdef USE_TRANSMISSION
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
#endif`,pm=`#ifdef USE_TRANSMISSION
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
#endif`,mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_m=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Mm=`uniform sampler2D t2D;
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
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Em=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wm=`#include <common>
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
}`,Am=`#if DEPTH_PACKING == 3200
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
}`,Tm=`#define DISTANCE
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
}`,Cm=`#define DISTANCE
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
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Lm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pm=`uniform float scale;
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
}`,Dm=`uniform vec3 diffuse;
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
}`,Im=`#include <common>
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
}`,Um=`uniform vec3 diffuse;
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
}`,Nm=`#define LAMBERT
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
}`,Fm=`#define LAMBERT
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
}`,Om=`#define MATCAP
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
}`,Bm=`#define MATCAP
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
}`,zm=`#define NORMAL
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
}`,km=`#define NORMAL
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
}`,Vm=`#define PHONG
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
}`,Gm=`#define PHONG
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
}`,Hm=`#define STANDARD
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
}`,Wm=`#define STANDARD
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
}`,Xm=`#define TOON
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
}`,$m=`#define TOON
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
}`,jm=`uniform float size;
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
}`,qm=`uniform vec3 diffuse;
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
}`,Ym=`#include <common>
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
}`,Jm=`uniform vec3 color;
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
}`,Zm=`uniform float rotation;
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
}`,Km=`uniform vec3 diffuse;
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
}`,Gt={alphahash_fragment:Mf,alphahash_pars_fragment:yf,alphamap_fragment:Sf,alphamap_pars_fragment:bf,alphatest_fragment:Ef,alphatest_pars_fragment:wf,aomap_fragment:Af,aomap_pars_fragment:Tf,batching_pars_vertex:Cf,batching_vertex:Rf,begin_vertex:Lf,beginnormal_vertex:Pf,bsdfs:Df,iridescence_fragment:If,bumpmap_pars_fragment:Uf,clipping_planes_fragment:Nf,clipping_planes_pars_fragment:Ff,clipping_planes_pars_vertex:Of,clipping_planes_vertex:Bf,color_fragment:zf,color_pars_fragment:kf,color_pars_vertex:Vf,color_vertex:Gf,common:Hf,cube_uv_reflection_fragment:Wf,defaultnormal_vertex:Xf,displacementmap_pars_vertex:$f,displacementmap_vertex:jf,emissivemap_fragment:qf,emissivemap_pars_fragment:Yf,colorspace_fragment:Jf,colorspace_pars_fragment:Zf,envmap_fragment:Kf,envmap_common_pars_fragment:Qf,envmap_pars_fragment:tp,envmap_pars_vertex:ep,envmap_physical_pars_fragment:dp,envmap_vertex:np,fog_vertex:ip,fog_pars_vertex:sp,fog_fragment:rp,fog_pars_fragment:ap,gradientmap_pars_fragment:op,lightmap_pars_fragment:lp,lights_lambert_fragment:cp,lights_lambert_pars_fragment:hp,lights_pars_begin:up,lights_toon_fragment:fp,lights_toon_pars_fragment:pp,lights_phong_fragment:mp,lights_phong_pars_fragment:gp,lights_physical_fragment:vp,lights_physical_pars_fragment:_p,lights_fragment_begin:xp,lights_fragment_maps:Mp,lights_fragment_end:yp,logdepthbuf_fragment:Sp,logdepthbuf_pars_fragment:bp,logdepthbuf_pars_vertex:Ep,logdepthbuf_vertex:wp,map_fragment:Ap,map_pars_fragment:Tp,map_particle_fragment:Cp,map_particle_pars_fragment:Rp,metalnessmap_fragment:Lp,metalnessmap_pars_fragment:Pp,morphinstance_vertex:Dp,morphcolor_vertex:Ip,morphnormal_vertex:Up,morphtarget_pars_vertex:Np,morphtarget_vertex:Fp,normal_fragment_begin:Op,normal_fragment_maps:Bp,normal_pars_fragment:zp,normal_pars_vertex:kp,normal_vertex:Vp,normalmap_pars_fragment:Gp,clearcoat_normal_fragment_begin:Hp,clearcoat_normal_fragment_maps:Wp,clearcoat_pars_fragment:Xp,iridescence_pars_fragment:$p,opaque_fragment:jp,packing:qp,premultiplied_alpha_fragment:Yp,project_vertex:Jp,dithering_fragment:Zp,dithering_pars_fragment:Kp,roughnessmap_fragment:Qp,roughnessmap_pars_fragment:tm,shadowmap_pars_fragment:em,shadowmap_pars_vertex:nm,shadowmap_vertex:im,shadowmask_pars_fragment:sm,skinbase_vertex:rm,skinning_pars_vertex:am,skinning_vertex:om,skinnormal_vertex:lm,specularmap_fragment:cm,specularmap_pars_fragment:hm,tonemapping_fragment:um,tonemapping_pars_fragment:dm,transmission_fragment:fm,transmission_pars_fragment:pm,uv_pars_fragment:mm,uv_pars_vertex:gm,uv_vertex:vm,worldpos_vertex:_m,background_vert:xm,background_frag:Mm,backgroundCube_vert:ym,backgroundCube_frag:Sm,cube_vert:bm,cube_frag:Em,depth_vert:wm,depth_frag:Am,distanceRGBA_vert:Tm,distanceRGBA_frag:Cm,equirect_vert:Rm,equirect_frag:Lm,linedashed_vert:Pm,linedashed_frag:Dm,meshbasic_vert:Im,meshbasic_frag:Um,meshlambert_vert:Nm,meshlambert_frag:Fm,meshmatcap_vert:Om,meshmatcap_frag:Bm,meshnormal_vert:zm,meshnormal_frag:km,meshphong_vert:Vm,meshphong_frag:Gm,meshphysical_vert:Hm,meshphysical_frag:Wm,meshtoon_vert:Xm,meshtoon_frag:$m,points_vert:jm,points_frag:qm,shadow_vert:Ym,shadow_frag:Jm,sprite_vert:Zm,sprite_frag:Km},ct={common:{diffuse:{value:new Ht(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},envMapRotation:{value:new kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new ft(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ht(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ht(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new Ht(16777215)},opacity:{value:1},center:{value:new ft(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},We={basic:{uniforms:Be([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:Be([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:Be([ct.common,ct.specularmap,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,ct.lights,{emissive:{value:new Ht(0)},specular:{value:new Ht(1118481)},shininess:{value:30}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:Be([ct.common,ct.envmap,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.roughnessmap,ct.metalnessmap,ct.fog,ct.lights,{emissive:{value:new Ht(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:Be([ct.common,ct.aomap,ct.lightmap,ct.emissivemap,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.gradientmap,ct.fog,ct.lights,{emissive:{value:new Ht(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:Be([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,ct.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:Be([ct.points,ct.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:Be([ct.common,ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:Be([ct.common,ct.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:Be([ct.common,ct.bumpmap,ct.normalmap,ct.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:Be([ct.sprite,ct.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new kt}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distanceRGBA:{uniforms:Be([ct.common,ct.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distanceRGBA_vert,fragmentShader:Gt.distanceRGBA_frag},shadow:{uniforms:Be([ct.lights,ct.fog,{color:{value:new Ht(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};We.physical={uniforms:Be([We.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new ft(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new Ht(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new ft},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new Ht(0)},specularColor:{value:new Ht(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new ft},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const cr={r:0,b:0,g:0},ci=new Sn,Qm=new se;function tg(i,t,e,n,s,r,a){const o=new Ht(0);let l=r===!0?0:1,c,h,d=null,u=0,f=null;function p(_){let M=_.isScene===!0?_.background:null;return M&&M.isTexture&&(M=(_.backgroundBlurriness>0?e:t).get(M)),M}function m(_){let M=!1;const x=p(_);x===null?v(o,l):x&&x.isColor&&(v(x,1),M=!0);const D=i.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function g(_,M){const x=p(M);x&&(x.isCubeTexture||x.mapping===Hr)?(h===void 0&&(h=new we(new cs(1,1,1),new Bn({name:"BackgroundCubeMaterial",uniforms:is(We.backgroundCube.uniforms),vertexShader:We.backgroundCube.vertexShader,fragmentShader:We.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,A,P){this.matrixWorld.copyPosition(P.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ci.copy(M.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(ci)),h.material.toneMapped=Zt.getTransfer(x.colorSpace)!==re,(d!==x||u!==x.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new we(new Xr(2,2),new Bn({name:"BackgroundMaterial",uniforms:is(We.background.uniforms),vertexShader:We.background.vertexShader,fragmentShader:We.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.toneMapped=Zt.getTransfer(x.colorSpace)!==re,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(d!==x||u!==x.version||f!==i.toneMapping)&&(c.material.needsUpdate=!0,d=x,u=x.version,f=i.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function v(_,M){_.getRGB(cr,jh(i)),n.buffers.color.setClear(cr.r,cr.g,cr.b,M,a)}return{getClearColor:function(){return o},setClearColor:function(_,M=1){o.set(_),l=M,v(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,v(o,l)},render:m,addToRenderList:g}}function eg(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(S,C,V,F,z){let q=!1;const G=d(F,V,C);r!==G&&(r=G,c(r.object)),q=f(S,F,V,z),q&&p(S,F,V,z),z!==null&&t.update(z,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,x(S,C,V,F),z!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return i.createVertexArray()}function c(S){return i.bindVertexArray(S)}function h(S){return i.deleteVertexArray(S)}function d(S,C,V){const F=V.wireframe===!0;let z=n[S.id];z===void 0&&(z={},n[S.id]=z);let q=z[C.id];q===void 0&&(q={},z[C.id]=q);let G=q[F];return G===void 0&&(G=u(l()),q[F]=G),G}function u(S){const C=[],V=[],F=[];for(let z=0;z<e;z++)C[z]=0,V[z]=0,F[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:V,attributeDivisors:F,object:S,attributes:{},index:null}}function f(S,C,V,F){const z=r.attributes,q=C.attributes;let G=0;const K=V.getAttributes();for(const X in K)if(K[X].location>=0){const ht=z[X];let mt=q[X];if(mt===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(mt=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(mt=S.instanceColor)),ht===void 0||ht.attribute!==mt||mt&&ht.data!==mt.data)return!0;G++}return r.attributesNum!==G||r.index!==F}function p(S,C,V,F){const z={},q=C.attributes;let G=0;const K=V.getAttributes();for(const X in K)if(K[X].location>=0){let ht=q[X];ht===void 0&&(X==="instanceMatrix"&&S.instanceMatrix&&(ht=S.instanceMatrix),X==="instanceColor"&&S.instanceColor&&(ht=S.instanceColor));const mt={};mt.attribute=ht,ht&&ht.data&&(mt.data=ht.data),z[X]=mt,G++}r.attributes=z,r.attributesNum=G,r.index=F}function m(){const S=r.newAttributes;for(let C=0,V=S.length;C<V;C++)S[C]=0}function g(S){v(S,0)}function v(S,C){const V=r.newAttributes,F=r.enabledAttributes,z=r.attributeDivisors;V[S]=1,F[S]===0&&(i.enableVertexAttribArray(S),F[S]=1),z[S]!==C&&(i.vertexAttribDivisor(S,C),z[S]=C)}function _(){const S=r.newAttributes,C=r.enabledAttributes;for(let V=0,F=C.length;V<F;V++)C[V]!==S[V]&&(i.disableVertexAttribArray(V),C[V]=0)}function M(S,C,V,F,z,q,G){G===!0?i.vertexAttribIPointer(S,C,V,z,q):i.vertexAttribPointer(S,C,V,F,z,q)}function x(S,C,V,F){m();const z=F.attributes,q=V.getAttributes(),G=C.defaultAttributeValues;for(const K in q){const X=q[K];if(X.location>=0){let at=z[K];if(at===void 0&&(K==="instanceMatrix"&&S.instanceMatrix&&(at=S.instanceMatrix),K==="instanceColor"&&S.instanceColor&&(at=S.instanceColor)),at!==void 0){const ht=at.normalized,mt=at.itemSize,Nt=t.get(at);if(Nt===void 0)continue;const Jt=Nt.buffer,U=Nt.type,Z=Nt.bytesPerElement,ut=U===i.INT||U===i.UNSIGNED_INT||at.gpuType===qo;if(at.isInterleavedBufferAttribute){const Q=at.data,Pt=Q.stride,Dt=at.offset;if(Q.isInstancedInterleavedBuffer){for(let At=0;At<X.locationSize;At++)v(X.location+At,Q.meshPerAttribute);S.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let At=0;At<X.locationSize;At++)g(X.location+At);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let At=0;At<X.locationSize;At++)M(X.location+At,mt/X.locationSize,U,ht,Pt*Z,(Dt+mt/X.locationSize*At)*Z,ut)}else{if(at.isInstancedBufferAttribute){for(let Q=0;Q<X.locationSize;Q++)v(X.location+Q,at.meshPerAttribute);S.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Q=0;Q<X.locationSize;Q++)g(X.location+Q);i.bindBuffer(i.ARRAY_BUFFER,Jt);for(let Q=0;Q<X.locationSize;Q++)M(X.location+Q,mt/X.locationSize,U,ht,mt*Z,mt/X.locationSize*Q*Z,ut)}}else if(G!==void 0){const ht=G[K];if(ht!==void 0)switch(ht.length){case 2:i.vertexAttrib2fv(X.location,ht);break;case 3:i.vertexAttrib3fv(X.location,ht);break;case 4:i.vertexAttrib4fv(X.location,ht);break;default:i.vertexAttrib1fv(X.location,ht)}}}}_()}function D(){I();for(const S in n){const C=n[S];for(const V in C){const F=C[V];for(const z in F)h(F[z].object),delete F[z];delete C[V]}delete n[S]}}function A(S){if(n[S.id]===void 0)return;const C=n[S.id];for(const V in C){const F=C[V];for(const z in F)h(F[z].object),delete F[z];delete C[V]}delete n[S.id]}function P(S){for(const C in n){const V=n[C];if(V[S.id]===void 0)continue;const F=V[S.id];for(const z in F)h(F[z].object),delete F[z];delete V[S.id]}}function I(){y(),a=!0,r!==s&&(r=s,c(r.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:I,resetDefaultState:y,dispose:D,releaseStatesOfGeometry:A,releaseStatesOfProgram:P,initAttributes:m,enableAttribute:g,disableUnusedAttributes:_}}function ng(i,t,e){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),e.update(h,n,d))}function o(c,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let f=0;for(let p=0;p<d;p++)f+=h[p];e.update(f,n,1)}function l(c,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<c.length;p++)a(c[p],h[p],u[p]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let p=0;for(let m=0;m<d;m++)p+=h[m]*u[m];e.update(p,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function ig(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==un&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){const I=P===zs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==On&&n.convert(P)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Un&&!I)}function l(P){if(P==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),_=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),D=p>0,A=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reverseDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:m,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:_,maxVaryings:M,maxFragmentUniforms:x,vertexTextures:D,maxSamples:A}}function sg(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new Dn,o=new kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||n!==0||s;return s=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,m=d.clipIntersection,g=d.clipShadows,v=i.get(d);if(!s||p===null||p.length===0||r&&!g)r?h(null):c();else{const _=r?0:n,M=_*4;let x=v.clippingState||null;l.value=x,x=h(p,u,M,f);for(let D=0;D!==M;++D)x[D]=e[D];v.clippingState=x,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,p){const m=d!==null?d.length:0;let g=null;if(m!==0){if(g=l.value,p!==!0||g===null){const v=f+m*4,_=u.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<v)&&(g=new Float32Array(v));for(let M=0,x=f;M!==m;++M,x+=4)a.copy(d[M]).applyMatrix4(_,o),a.normal.toArray(g,x),g[x+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=m,t.numIntersection=0,g}}function rg(i){let t=new WeakMap;function e(a,o){return o===to?a.mapping=Qi:o===eo&&(a.mapping=ts),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===to||o===eo)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new gf(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class rl extends qh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const ji=4,Ql=[.125,.215,.35,.446,.526,.582],pi=20,xa=new rl,tc=new Ht;let Ma=null,ya=0,Sa=0,ba=!1;const di=(1+Math.sqrt(5))/2,Vi=1/di,ec=[new L(-di,Vi,0),new L(di,Vi,0),new L(-Vi,0,di),new L(Vi,0,di),new L(0,di,-Vi),new L(0,di,Vi),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class nc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ma=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel(),ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ma,ya,Sa),this._renderer.xr.enabled=ba,t.scissorTest=!1,hr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Qi||t.mapping===ts?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ma=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel(),ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:xn,minFilter:xn,generateMipmaps:!1,type:zs,format:un,colorSpace:as,depthBuffer:!1},s=ic(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ic(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=ag(r)),this._blurMaterial=og(r,t,e)}return s}_compileMaterial(t){const e=new we(this._lodPlanes[0],t);this._renderer.compile(e,xa)}_sceneToCubeUV(t,e,n,s){const o=new Ke(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(tc),h.toneMapping=ei,h.autoClear=!1;const f=new ws({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),p=new we(new cs,f);let m=!1;const g=t.background;g?g.isColor&&(f.color.copy(g),t.background=null,m=!0):(f.color.copy(tc),m=!0);for(let v=0;v<6;v++){const _=v%3;_===0?(o.up.set(0,l[v],0),o.lookAt(c[v],0,0)):_===1?(o.up.set(0,0,l[v]),o.lookAt(0,c[v],0)):(o.up.set(0,l[v],0),o.lookAt(0,0,c[v]));const M=this._cubeSize;hr(s,_*M,v>2?M:0,M,M),h.setRenderTarget(s),m&&h.render(p,o),h.render(t,o)}p.geometry.dispose(),p.material.dispose(),h.toneMapping=u,h.autoClear=d,t.background=g}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Qi||t.mapping===ts;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new we(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;hr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,xa)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ec[(s-r-1)%ec.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new we(this._lodPlanes[s],c),u=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*pi-1),m=r/p,g=isFinite(r)?1+Math.floor(h*m):pi;g>pi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${pi}`);const v=[];let _=0;for(let P=0;P<pi;++P){const I=P/m,y=Math.exp(-I*I/2);v.push(y),P===0?_+=y:P<g&&(_+=2*y)}for(let P=0;P<v.length;P++)v[P]=v[P]/_;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=v,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:M}=this;u.dTheta.value=p,u.mipInt.value=M-n;const x=this._sizeLods[s],D=3*x*(s>M-ji?s-M+ji:0),A=4*(this._cubeSize-x);hr(e,D,A,3*x,2*x),l.setRenderTarget(e),l.render(d,xa)}}function ag(i){const t=[],e=[],n=[];let s=i;const r=i-ji+1+Ql.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-ji?l=Ql[a-i+ji-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,p=6,m=3,g=2,v=1,_=new Float32Array(m*p*f),M=new Float32Array(g*p*f),x=new Float32Array(v*p*f);for(let A=0;A<f;A++){const P=A%3*2/3-1,I=A>2?0:-1,y=[P,I,0,P+2/3,I,0,P+2/3,I+1,0,P,I,0,P+2/3,I+1,0,P,I+1,0];_.set(y,m*p*A),M.set(u,g*p*A);const S=[A,A,A,A,A,A];x.set(S,v*p*A)}const D=new Ce;D.setAttribute("position",new fn(_,m)),D.setAttribute("uv",new fn(M,g)),D.setAttribute("faceIndex",new fn(x,v)),t.push(D),s>ji&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function ic(i,t,e){const n=new yi(i,t,e);return n.texture.mapping=Hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function hr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function og(i,t,e){const n=new Float32Array(pi),s=new L(0,1,0);return new Bn({name:"SphericalGaussianBlur",defines:{n:pi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:al(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function sc(){return new Bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:al(),fragmentShader:`

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
		`,blending:ti,depthTest:!1,depthWrite:!1})}function rc(){return new Bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ti,depthTest:!1,depthWrite:!1})}function al(){return`

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
	`}function lg(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===to||l===eo,h=l===Qi||l===ts;if(c||h){let d=t.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return e===null&&(e=new nc(i)),d=c?e.fromEquirectangular(o,d):e.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),d.texture;if(d!==void 0)return d.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new nc(i)),d=c?e.fromEquirectangular(o):e.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,t.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function cg(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&xs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function hg(i,t,e,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);for(const p in u.morphAttributes){const m=u.morphAttributes[p];for(let g=0,v=m.length;g<v;g++)t.remove(m[g])}u.removeEventListener("dispose",a),delete s[u.id];const f=r.get(u);f&&(t.remove(f),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const p in u)t.update(u[p],i.ARRAY_BUFFER);const f=d.morphAttributes;for(const p in f){const m=f[p];for(let g=0,v=m.length;g<v;g++)t.update(m[g],i.ARRAY_BUFFER)}}function c(d){const u=[],f=d.index,p=d.attributes.position;let m=0;if(f!==null){const _=f.array;m=f.version;for(let M=0,x=_.length;M<x;M+=3){const D=_[M+0],A=_[M+1],P=_[M+2];u.push(D,A,A,P,P,D)}}else if(p!==void 0){const _=p.array;m=p.version;for(let M=0,x=_.length/3-1;M<x;M+=3){const D=M+0,A=M+1,P=M+2;u.push(D,A,A,P,P,D)}}else return;const g=new(Vh(u)?$h:Xh)(u,1);g.version=m;const v=r.get(d);v&&t.remove(v),r.set(d,g)}function h(d){const u=r.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function ug(i,t,e){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,f){i.drawElements(n,f,r,u*a),e.update(f,n,1)}function c(u,f,p){p!==0&&(i.drawElementsInstanced(n,f,r,u*a,p),e.update(f,n,p))}function h(u,f,p){if(p===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,u,0,p);let g=0;for(let v=0;v<p;v++)g+=f[v];e.update(g,n,1)}function d(u,f,p,m){if(p===0)return;const g=t.get("WEBGL_multi_draw");if(g===null)for(let v=0;v<u.length;v++)c(u[v]/a,f[v],m[v]);else{g.multiDrawElementsInstancedWEBGL(n,f,0,r,u,0,m,0,p);let v=0;for(let _=0;_<p;_++)v+=f[_]*m[_];e.update(v,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function dg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function fg(i,t,e){const n=new WeakMap,s=new le;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let y=function(){P.dispose(),n.delete(o),o.removeEventListener("dispose",y)};u!==void 0&&u.texture.dispose();const f=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let M=0;f===!0&&(M=1),p===!0&&(M=2),m===!0&&(M=3);let x=o.attributes.position.count*M,D=1;x>t.maxTextureSize&&(D=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const A=new Float32Array(x*D*4*d),P=new Hh(A,x,D,d);P.type=Un,P.needsUpdate=!0;const I=M*4;for(let S=0;S<d;S++){const C=g[S],V=v[S],F=_[S],z=x*D*4*S;for(let q=0;q<C.count;q++){const G=q*I;f===!0&&(s.fromBufferAttribute(C,q),A[z+G+0]=s.x,A[z+G+1]=s.y,A[z+G+2]=s.z,A[z+G+3]=0),p===!0&&(s.fromBufferAttribute(V,q),A[z+G+4]=s.x,A[z+G+5]=s.y,A[z+G+6]=s.z,A[z+G+7]=0),m===!0&&(s.fromBufferAttribute(F,q),A[z+G+8]=s.x,A[z+G+9]=s.y,A[z+G+10]=s.z,A[z+G+11]=F.itemSize===4?s.w:1)}}u={count:d,texture:P,size:new ft(x,D)},n.set(o,u),o.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let f=0;for(let m=0;m<c.length;m++)f+=c[m];const p=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",p),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function pg(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=t.get(l,h);if(s.get(d)!==c&&(t.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class Zh extends Ve{constructor(t,e,n,s,r,a,o,l,c,h=Ji){if(h!==Ji&&h!==ns)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Ji&&(n=Mi),n===void 0&&h===ns&&(n=es),super(null,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:dn,this.minFilter=l!==void 0?l:dn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Kh=new Ve,ac=new Zh(1,1),Qh=new Hh,tu=new tf,eu=new Yh,oc=[],lc=[],cc=new Float32Array(16),hc=new Float32Array(9),uc=new Float32Array(4);function hs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=oc[s];if(r===void 0&&(r=new Float32Array(s),oc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function ye(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Se(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function $r(i,t){let e=lc[t];e===void 0&&(e=new Int32Array(t),lc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function mg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2fv(this.addr,t),Se(e,t)}}function vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ye(e,t))return;i.uniform3fv(this.addr,t),Se(e,t)}}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4fv(this.addr,t),Se(e,t)}}function xg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Se(e,t)}else{if(ye(e,n))return;uc.set(n),i.uniformMatrix2fv(this.addr,!1,uc),Se(e,n)}}function Mg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Se(e,t)}else{if(ye(e,n))return;hc.set(n),i.uniformMatrix3fv(this.addr,!1,hc),Se(e,n)}}function yg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ye(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Se(e,t)}else{if(ye(e,n))return;cc.set(n),i.uniformMatrix4fv(this.addr,!1,cc),Se(e,n)}}function Sg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function bg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2iv(this.addr,t),Se(e,t)}}function Eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3iv(this.addr,t),Se(e,t)}}function wg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4iv(this.addr,t),Se(e,t)}}function Ag(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ye(e,t))return;i.uniform2uiv(this.addr,t),Se(e,t)}}function Cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ye(e,t))return;i.uniform3uiv(this.addr,t),Se(e,t)}}function Rg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ye(e,t))return;i.uniform4uiv(this.addr,t),Se(e,t)}}function Lg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(ac.compareFunction=kh,r=ac):r=Kh,e.setTexture2D(t||r,s)}function Pg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||tu,s)}function Dg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||eu,s)}function Ig(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Qh,s)}function Ug(i){switch(i){case 5126:return mg;case 35664:return gg;case 35665:return vg;case 35666:return _g;case 35674:return xg;case 35675:return Mg;case 35676:return yg;case 5124:case 35670:return Sg;case 35667:case 35671:return bg;case 35668:case 35672:return Eg;case 35669:case 35673:return wg;case 5125:return Ag;case 36294:return Tg;case 36295:return Cg;case 36296:return Rg;case 35678:case 36198:case 36298:case 36306:case 35682:return Lg;case 35679:case 36299:case 36307:return Pg;case 35680:case 36300:case 36308:case 36293:return Dg;case 36289:case 36303:case 36311:case 36292:return Ig}}function Ng(i,t){i.uniform1fv(this.addr,t)}function Fg(i,t){const e=hs(t,this.size,2);i.uniform2fv(this.addr,e)}function Og(i,t){const e=hs(t,this.size,3);i.uniform3fv(this.addr,e)}function Bg(i,t){const e=hs(t,this.size,4);i.uniform4fv(this.addr,e)}function zg(i,t){const e=hs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function kg(i,t){const e=hs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Vg(i,t){const e=hs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Gg(i,t){i.uniform1iv(this.addr,t)}function Hg(i,t){i.uniform2iv(this.addr,t)}function Wg(i,t){i.uniform3iv(this.addr,t)}function Xg(i,t){i.uniform4iv(this.addr,t)}function $g(i,t){i.uniform1uiv(this.addr,t)}function jg(i,t){i.uniform2uiv(this.addr,t)}function qg(i,t){i.uniform3uiv(this.addr,t)}function Yg(i,t){i.uniform4uiv(this.addr,t)}function Jg(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Kh,r[a])}function Zg(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||tu,r[a])}function Kg(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||eu,r[a])}function Qg(i,t,e){const n=this.cache,s=t.length,r=$r(e,s);ye(n,r)||(i.uniform1iv(this.addr,r),Se(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Qh,r[a])}function tv(i){switch(i){case 5126:return Ng;case 35664:return Fg;case 35665:return Og;case 35666:return Bg;case 35674:return zg;case 35675:return kg;case 35676:return Vg;case 5124:case 35670:return Gg;case 35667:case 35671:return Hg;case 35668:case 35672:return Wg;case 35669:case 35673:return Xg;case 5125:return $g;case 36294:return jg;case 36295:return qg;case 36296:return Yg;case 35678:case 36198:case 36298:case 36306:case 35682:return Jg;case 35679:case 36299:case 36307:return Zg;case 35680:case 36300:case 36308:case 36293:return Kg;case 36289:case 36303:case 36311:case 36292:return Qg}}class ev{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Ug(e.type)}}class nv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tv(e.type)}}class iv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Ea=/(\w+)(\])?(\[|\.)?/g;function dc(i,t){i.seq.push(t),i.map[t.id]=t}function sv(i,t,e){const n=i.name,s=n.length;for(Ea.lastIndex=0;;){const r=Ea.exec(n),a=Ea.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){dc(e,c===void 0?new ev(o,i,t):new nv(o,i,t));break}else{let d=e.map[o];d===void 0&&(d=new iv(o),dc(e,d)),e=d}}}class Lr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);sv(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function fc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const rv=37297;let av=0;function ov(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const pc=new kt;function lv(i){Zt._getMatrix(pc,Zt.workingColorSpace,i);const t=`mat3( ${pc.elements.map(e=>e.toFixed(4))} )`;switch(Zt.getTransfer(i)){case Wr:return[t,"LinearTransferOETF"];case re:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function mc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+ov(i.getShaderSource(t),a)}else return s}function cv(i,t){const e=lv(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function hv(i,t){let e;switch(t){case dd:e="Linear";break;case fd:e="Reinhard";break;case pd:e="Cineon";break;case md:e="ACESFilmic";break;case vd:e="AgX";break;case _d:e="Neutral";break;case gd:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ur=new L;function uv(){Zt.getLuminanceCoefficients(ur);const i=ur.x.toFixed(4),t=ur.y.toFixed(4),e=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function dv(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function fv(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function pv(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Ms(i){return i!==""}function gc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function vc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const mv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Do(i){return i.replace(mv,vv)}const gv=new Map;function vv(i,t){let e=Gt[t];if(e===void 0){const n=gv.get(t);if(n!==void 0)e=Gt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Do(e)}const _v=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function _c(i){return i.replace(_v,xv)}function xv(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function xc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function Mv(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Ah?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Xu?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Pn&&(t="SHADOWMAP_TYPE_VSM"),t}function yv(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Qi:case ts:t="ENVMAP_TYPE_CUBE";break;case Hr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Sv(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case ts:t="ENVMAP_MODE_REFRACTION";break}return t}function bv(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Th:t="ENVMAP_BLENDING_MULTIPLY";break;case hd:t="ENVMAP_BLENDING_MIX";break;case ud:t="ENVMAP_BLENDING_ADD";break}return t}function Ev(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function wv(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Mv(e),c=yv(e),h=Sv(e),d=bv(e),u=Ev(e),f=dv(e),p=fv(r),m=s.createProgram();let g,v,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ms).join(`
`),g.length>0&&(g+=`
`),v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Ms).join(`
`),v.length>0&&(v+=`
`)):(g=[xc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),v=[xc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ei?"#define TONE_MAPPING":"",e.toneMapping!==ei?Gt.tonemapping_pars_fragment:"",e.toneMapping!==ei?hv("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,cv("linearToOutputTexel",e.outputColorSpace),uv(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),a=Do(a),a=gc(a,e),a=vc(a,e),o=Do(o),o=gc(o,e),o=vc(o,e),a=_c(a),o=_c(o),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,v=["#define varying in",e.glslVersion===Pl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Pl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+v);const M=_+g+a,x=_+v+o,D=fc(s,s.VERTEX_SHADER,M),A=fc(s,s.FRAGMENT_SHADER,x);s.attachShader(m,D),s.attachShader(m,A),e.index0AttributeName!==void 0?s.bindAttribLocation(m,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(m,0,"position"),s.linkProgram(m);function P(C){if(i.debug.checkShaderErrors){const V=s.getProgramInfoLog(m).trim(),F=s.getShaderInfoLog(D).trim(),z=s.getShaderInfoLog(A).trim();let q=!0,G=!0;if(s.getProgramParameter(m,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,m,D,A);else{const K=mc(s,D,"vertex"),X=mc(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(m,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+V+`
`+K+`
`+X)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(F===""||z==="")&&(G=!1);G&&(C.diagnostics={runnable:q,programLog:V,vertexShader:{log:F,prefix:g},fragmentShader:{log:z,prefix:v}})}s.deleteShader(D),s.deleteShader(A),I=new Lr(s,m),y=pv(s,m)}let I;this.getUniforms=function(){return I===void 0&&P(this),I};let y;this.getAttributes=function(){return y===void 0&&P(this),y};let S=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=s.getProgramParameter(m,rv)),S},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=av++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=D,this.fragmentShader=A,this}let Av=0;class Tv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Cv(t),e.set(t,n)),n}}class Cv{constructor(t){this.id=Av++,this.code=t,this.usedTimes=0}}function Rv(i,t,e,n,s,r,a){const o=new nl,l=new Tv,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let f=s.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(y){return c.add(y),y===0?"uv":`uv${y}`}function g(y,S,C,V,F){const z=V.fog,q=F.geometry,G=y.isMeshStandardMaterial?V.environment:null,K=(y.isMeshStandardMaterial?e:t).get(y.envMap||G),X=K&&K.mapping===Hr?K.image.height:null,at=p[y.type];y.precision!==null&&(f=s.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const ht=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,mt=ht!==void 0?ht.length:0;let Nt=0;q.morphAttributes.position!==void 0&&(Nt=1),q.morphAttributes.normal!==void 0&&(Nt=2),q.morphAttributes.color!==void 0&&(Nt=3);let Jt,U,Z,ut;if(at){const ne=We[at];Jt=ne.vertexShader,U=ne.fragmentShader}else Jt=y.vertexShader,U=y.fragmentShader,l.update(y),Z=l.getVertexShaderID(y),ut=l.getFragmentShaderID(y);const Q=i.getRenderTarget(),Pt=i.state.buffers.depth.getReversed(),Dt=F.isInstancedMesh===!0,At=F.isBatchedMesh===!0,Xt=!!y.map,$=!!y.matcap,st=!!K,R=!!y.aoMap,wt=!!y.lightMap,nt=!!y.bumpMap,xt=!!y.normalMap,lt=!!y.displacementMap,It=!!y.emissiveMap,gt=!!y.metalnessMap,E=!!y.roughnessMap,b=y.anisotropy>0,k=y.clearcoat>0,Y=y.dispersion>0,et=y.iridescence>0,J=y.sheen>0,St=y.transmission>0,dt=b&&!!y.anisotropyMap,yt=k&&!!y.clearcoatMap,$t=k&&!!y.clearcoatNormalMap,rt=k&&!!y.clearcoatRoughnessMap,bt=et&&!!y.iridescenceMap,Ut=et&&!!y.iridescenceThicknessMap,Ft=J&&!!y.sheenColorMap,Et=J&&!!y.sheenRoughnessMap,Yt=!!y.specularMap,Vt=!!y.specularColorMap,ce=!!y.specularIntensityMap,N=St&&!!y.transmissionMap,pt=St&&!!y.thicknessMap,j=!!y.gradientMap,tt=!!y.alphaMap,Mt=y.alphaTest>0,vt=!!y.alphaHash,Bt=!!y.extensions;let ve=ei;y.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(ve=i.toneMapping);const Ue={shaderID:at,shaderType:y.type,shaderName:y.name,vertexShader:Jt,fragmentShader:U,defines:y.defines,customVertexShaderID:Z,customFragmentShaderID:ut,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:At,batchingColor:At&&F._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&F.instanceColor!==null,instancingMorph:Dt&&F.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:Q===null?i.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:as,alphaToCoverage:!!y.alphaToCoverage,map:Xt,matcap:$,envMap:st,envMapMode:st&&K.mapping,envMapCubeUVHeight:X,aoMap:R,lightMap:wt,bumpMap:nt,normalMap:xt,displacementMap:u&&lt,emissiveMap:It,normalMapObjectSpace:xt&&y.normalMapType===Sd,normalMapTangentSpace:xt&&y.normalMapType===zh,metalnessMap:gt,roughnessMap:E,anisotropy:b,anisotropyMap:dt,clearcoat:k,clearcoatMap:yt,clearcoatNormalMap:$t,clearcoatRoughnessMap:rt,dispersion:Y,iridescence:et,iridescenceMap:bt,iridescenceThicknessMap:Ut,sheen:J,sheenColorMap:Ft,sheenRoughnessMap:Et,specularMap:Yt,specularColorMap:Vt,specularIntensityMap:ce,transmission:St,transmissionMap:N,thicknessMap:pt,gradientMap:j,opaque:y.transparent===!1&&y.blending===Yi&&y.alphaToCoverage===!1,alphaMap:tt,alphaTest:Mt,alphaHash:vt,combine:y.combine,mapUv:Xt&&m(y.map.channel),aoMapUv:R&&m(y.aoMap.channel),lightMapUv:wt&&m(y.lightMap.channel),bumpMapUv:nt&&m(y.bumpMap.channel),normalMapUv:xt&&m(y.normalMap.channel),displacementMapUv:lt&&m(y.displacementMap.channel),emissiveMapUv:It&&m(y.emissiveMap.channel),metalnessMapUv:gt&&m(y.metalnessMap.channel),roughnessMapUv:E&&m(y.roughnessMap.channel),anisotropyMapUv:dt&&m(y.anisotropyMap.channel),clearcoatMapUv:yt&&m(y.clearcoatMap.channel),clearcoatNormalMapUv:$t&&m(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&m(y.clearcoatRoughnessMap.channel),iridescenceMapUv:bt&&m(y.iridescenceMap.channel),iridescenceThicknessMapUv:Ut&&m(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ft&&m(y.sheenColorMap.channel),sheenRoughnessMapUv:Et&&m(y.sheenRoughnessMap.channel),specularMapUv:Yt&&m(y.specularMap.channel),specularColorMapUv:Vt&&m(y.specularColorMap.channel),specularIntensityMapUv:ce&&m(y.specularIntensityMap.channel),transmissionMapUv:N&&m(y.transmissionMap.channel),thicknessMapUv:pt&&m(y.thicknessMap.channel),alphaMapUv:tt&&m(y.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(xt||b),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!q.attributes.uv&&(Xt||tt),fog:!!z,useFog:y.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reverseDepthBuffer:Pt,skinning:F.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:Nt,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:ve,decodeVideoTexture:Xt&&y.map.isVideoTexture===!0&&Zt.getTransfer(y.map.colorSpace)===re,decodeVideoTextureEmissive:It&&y.emissiveMap.isVideoTexture===!0&&Zt.getTransfer(y.emissiveMap.colorSpace)===re,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===ln,flipSided:y.side===Xe,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Bt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&y.extensions.multiDraw===!0||At)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Ue.vertexUv1s=c.has(1),Ue.vertexUv2s=c.has(2),Ue.vertexUv3s=c.has(3),c.clear(),Ue}function v(y){const S=[];if(y.shaderID?S.push(y.shaderID):(S.push(y.customVertexShaderID),S.push(y.customFragmentShaderID)),y.defines!==void 0)for(const C in y.defines)S.push(C),S.push(y.defines[C]);return y.isRawShaderMaterial===!1&&(_(S,y),M(S,y),S.push(i.outputColorSpace)),S.push(y.customProgramCacheKey),S.join()}function _(y,S){y.push(S.precision),y.push(S.outputColorSpace),y.push(S.envMapMode),y.push(S.envMapCubeUVHeight),y.push(S.mapUv),y.push(S.alphaMapUv),y.push(S.lightMapUv),y.push(S.aoMapUv),y.push(S.bumpMapUv),y.push(S.normalMapUv),y.push(S.displacementMapUv),y.push(S.emissiveMapUv),y.push(S.metalnessMapUv),y.push(S.roughnessMapUv),y.push(S.anisotropyMapUv),y.push(S.clearcoatMapUv),y.push(S.clearcoatNormalMapUv),y.push(S.clearcoatRoughnessMapUv),y.push(S.iridescenceMapUv),y.push(S.iridescenceThicknessMapUv),y.push(S.sheenColorMapUv),y.push(S.sheenRoughnessMapUv),y.push(S.specularMapUv),y.push(S.specularColorMapUv),y.push(S.specularIntensityMapUv),y.push(S.transmissionMapUv),y.push(S.thicknessMapUv),y.push(S.combine),y.push(S.fogExp2),y.push(S.sizeAttenuation),y.push(S.morphTargetsCount),y.push(S.morphAttributeCount),y.push(S.numDirLights),y.push(S.numPointLights),y.push(S.numSpotLights),y.push(S.numSpotLightMaps),y.push(S.numHemiLights),y.push(S.numRectAreaLights),y.push(S.numDirLightShadows),y.push(S.numPointLightShadows),y.push(S.numSpotLightShadows),y.push(S.numSpotLightShadowsWithMaps),y.push(S.numLightProbes),y.push(S.shadowMapType),y.push(S.toneMapping),y.push(S.numClippingPlanes),y.push(S.numClipIntersection),y.push(S.depthPacking)}function M(y,S){o.disableAll(),S.supportsVertexTextures&&o.enable(0),S.instancing&&o.enable(1),S.instancingColor&&o.enable(2),S.instancingMorph&&o.enable(3),S.matcap&&o.enable(4),S.envMap&&o.enable(5),S.normalMapObjectSpace&&o.enable(6),S.normalMapTangentSpace&&o.enable(7),S.clearcoat&&o.enable(8),S.iridescence&&o.enable(9),S.alphaTest&&o.enable(10),S.vertexColors&&o.enable(11),S.vertexAlphas&&o.enable(12),S.vertexUv1s&&o.enable(13),S.vertexUv2s&&o.enable(14),S.vertexUv3s&&o.enable(15),S.vertexTangents&&o.enable(16),S.anisotropy&&o.enable(17),S.alphaHash&&o.enable(18),S.batching&&o.enable(19),S.dispersion&&o.enable(20),S.batchingColor&&o.enable(21),y.push(o.mask),o.disableAll(),S.fog&&o.enable(0),S.useFog&&o.enable(1),S.flatShading&&o.enable(2),S.logarithmicDepthBuffer&&o.enable(3),S.reverseDepthBuffer&&o.enable(4),S.skinning&&o.enable(5),S.morphTargets&&o.enable(6),S.morphNormals&&o.enable(7),S.morphColors&&o.enable(8),S.premultipliedAlpha&&o.enable(9),S.shadowMapEnabled&&o.enable(10),S.doubleSided&&o.enable(11),S.flipSided&&o.enable(12),S.useDepthPacking&&o.enable(13),S.dithering&&o.enable(14),S.transmission&&o.enable(15),S.sheen&&o.enable(16),S.opaque&&o.enable(17),S.pointsUvs&&o.enable(18),S.decodeVideoTexture&&o.enable(19),S.decodeVideoTextureEmissive&&o.enable(20),S.alphaToCoverage&&o.enable(21),y.push(o.mask)}function x(y){const S=p[y.type];let C;if(S){const V=We[S];C=il.clone(V.uniforms)}else C=y.uniforms;return C}function D(y,S){let C;for(let V=0,F=h.length;V<F;V++){const z=h[V];if(z.cacheKey===S){C=z,++C.usedTimes;break}}return C===void 0&&(C=new wv(i,S,y,r),h.push(C)),C}function A(y){if(--y.usedTimes===0){const S=h.indexOf(y);h[S]=h[h.length-1],h.pop(),y.destroy()}}function P(y){l.remove(y)}function I(){l.dispose()}return{getParameters:g,getProgramCacheKey:v,getUniforms:x,acquireProgram:D,releaseProgram:A,releaseShaderCache:P,programs:h,dispose:I}}function Lv(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Pv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Mc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function yc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(d,u,f,p,m,g){let v=i[t];return v===void 0?(v={id:d.id,object:d,geometry:u,material:f,groupOrder:p,renderOrder:d.renderOrder,z:m,group:g},i[t]=v):(v.id=d.id,v.object=d,v.geometry=u,v.material=f,v.groupOrder=p,v.renderOrder=d.renderOrder,v.z=m,v.group=g),t++,v}function o(d,u,f,p,m,g){const v=a(d,u,f,p,m,g);f.transmission>0?n.push(v):f.transparent===!0?s.push(v):e.push(v)}function l(d,u,f,p,m,g){const v=a(d,u,f,p,m,g);f.transmission>0?n.unshift(v):f.transparent===!0?s.unshift(v):e.unshift(v)}function c(d,u){e.length>1&&e.sort(d||Pv),n.length>1&&n.sort(u||Mc),s.length>1&&s.sort(u||Mc)}function h(){for(let d=t,u=i.length;d<u;d++){const f=i[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Dv(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new yc,i.set(n,[a])):s>=r.length?(a=new yc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Iv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new Ht};break;case"SpotLight":e={position:new L,direction:new L,color:new Ht,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new Ht,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new Ht,groundColor:new Ht};break;case"RectAreaLight":e={color:new Ht,position:new L,halfWidth:new L,halfHeight:new L};break}return i[t.id]=e,e}}}function Uv(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ft,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Nv=0;function Fv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ov(i){const t=new Iv,e=Uv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new L);const s=new L,r=new se,a=new se;function o(c){let h=0,d=0,u=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,p=0,m=0,g=0,v=0,_=0,M=0,x=0,D=0,A=0,P=0;c.sort(Fv);for(let y=0,S=c.length;y<S;y++){const C=c[y],V=C.color,F=C.intensity,z=C.distance,q=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=V.r*F,d+=V.g*F,u+=V.b*F;else if(C.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(C.sh.coefficients[G],F);P++}else if(C.isDirectionalLight){const G=t.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const K=C.shadow,X=e.get(C);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.directionalShadow[f]=X,n.directionalShadowMap[f]=q,n.directionalShadowMatrix[f]=C.shadow.matrix,_++}n.directional[f]=G,f++}else if(C.isSpotLight){const G=t.get(C);G.position.setFromMatrixPosition(C.matrixWorld),G.color.copy(V).multiplyScalar(F),G.distance=z,G.coneCos=Math.cos(C.angle),G.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),G.decay=C.decay,n.spot[m]=G;const K=C.shadow;if(C.map&&(n.spotLightMap[D]=C.map,D++,K.updateMatrices(C),C.castShadow&&A++),n.spotLightMatrix[m]=K.matrix,C.castShadow){const X=e.get(C);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.spotShadow[m]=X,n.spotShadowMap[m]=q,x++}m++}else if(C.isRectAreaLight){const G=t.get(C);G.color.copy(V).multiplyScalar(F),G.halfWidth.set(C.width*.5,0,0),G.halfHeight.set(0,C.height*.5,0),n.rectArea[g]=G,g++}else if(C.isPointLight){const G=t.get(C);if(G.color.copy(C.color).multiplyScalar(C.intensity),G.distance=C.distance,G.decay=C.decay,C.castShadow){const K=C.shadow,X=e.get(C);X.shadowIntensity=K.intensity,X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,X.shadowCameraNear=K.camera.near,X.shadowCameraFar=K.camera.far,n.pointShadow[p]=X,n.pointShadowMap[p]=q,n.pointShadowMatrix[p]=C.shadow.matrix,M++}n.point[p]=G,p++}else if(C.isHemisphereLight){const G=t.get(C);G.skyColor.copy(C.color).multiplyScalar(F),G.groundColor.copy(C.groundColor).multiplyScalar(F),n.hemi[v]=G,v++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ct.LTC_FLOAT_1,n.rectAreaLTC2=ct.LTC_FLOAT_2):(n.rectAreaLTC1=ct.LTC_HALF_1,n.rectAreaLTC2=ct.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const I=n.hash;(I.directionalLength!==f||I.pointLength!==p||I.spotLength!==m||I.rectAreaLength!==g||I.hemiLength!==v||I.numDirectionalShadows!==_||I.numPointShadows!==M||I.numSpotShadows!==x||I.numSpotMaps!==D||I.numLightProbes!==P)&&(n.directional.length=f,n.spot.length=m,n.rectArea.length=g,n.point.length=p,n.hemi.length=v,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=x+D-A,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=P,I.directionalLength=f,I.pointLength=p,I.spotLength=m,I.rectAreaLength=g,I.hemiLength=v,I.numDirectionalShadows=_,I.numPointShadows=M,I.numSpotShadows=x,I.numSpotMaps=D,I.numLightProbes=P,n.version=Nv++)}function l(c,h){let d=0,u=0,f=0,p=0,m=0;const g=h.matrixWorldInverse;for(let v=0,_=c.length;v<_;v++){const M=c[v];if(M.isDirectionalLight){const x=n.directional[d];x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),d++}else if(M.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(g),x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(g),f++}else if(M.isRectAreaLight){const x=n.rectArea[p];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(g),a.identity(),r.copy(M.matrixWorld),r.premultiply(g),a.extractRotation(r),x.halfWidth.set(M.width*.5,0,0),x.halfHeight.set(0,M.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),p++}else if(M.isPointLight){const x=n.point[u];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(g),u++}else if(M.isHemisphereLight){const x=n.hemi[m];x.direction.setFromMatrixPosition(M.matrixWorld),x.direction.transformDirection(g),m++}}}return{setup:o,setupView:l,state:n}}function Sc(i){const t=new Ov(i),e=[],n=[];function s(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Bv(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Sc(i),t.set(s,[o])):r>=a.length?(o=new Sc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class zv extends ls{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Md,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class kv extends ls{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Vv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Gv=`uniform sampler2D shadow_pass;
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
}`;function Hv(i,t,e){let n=new sl;const s=new ft,r=new ft,a=new le,o=new zv({depthPacking:yd}),l=new kv,c={},h=e.maxTextureSize,d={[ii]:Xe,[Xe]:ii,[ln]:ln},u=new Bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ft},radius:{value:4}},vertexShader:Vv,fragmentShader:Gv}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ce;p.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new we(p,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ah;let v=this.type;this.render=function(A,P,I){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||A.length===0)return;const y=i.getRenderTarget(),S=i.getActiveCubeFace(),C=i.getActiveMipmapLevel(),V=i.state;V.setBlending(ti),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const F=v!==Pn&&this.type===Pn,z=v===Pn&&this.type!==Pn;for(let q=0,G=A.length;q<G;q++){const K=A[q],X=K.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const at=X.getFrameExtents();if(s.multiply(at),r.copy(X.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/at.x),s.x=r.x*at.x,X.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/at.y),s.y=r.y*at.y,X.mapSize.y=r.y)),X.map===null||F===!0||z===!0){const mt=this.type!==Pn?{minFilter:dn,magFilter:dn}:{};X.map!==null&&X.map.dispose(),X.map=new yi(s.x,s.y,mt),X.map.texture.name=K.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const ht=X.getViewportCount();for(let mt=0;mt<ht;mt++){const Nt=X.getViewport(mt);a.set(r.x*Nt.x,r.y*Nt.y,r.x*Nt.z,r.y*Nt.w),V.viewport(a),X.updateMatrices(K,mt),n=X.getFrustum(),x(P,I,X.camera,K,this.type)}X.isPointLightShadow!==!0&&this.type===Pn&&_(X,I),X.needsUpdate=!1}v=this.type,g.needsUpdate=!1,i.setRenderTarget(y,S,C)};function _(A,P){const I=t.update(m);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,f.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new yi(s.x,s.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(P,null,I,u,m,null),f.uniforms.shadow_pass.value=A.mapPass.texture,f.uniforms.resolution.value=A.mapSize,f.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(P,null,I,f,m,null)}function M(A,P,I,y){let S=null;const C=I.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(C!==void 0)S=C;else if(S=I.isPointLight===!0?l:o,i.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0){const V=S.uuid,F=P.uuid;let z=c[V];z===void 0&&(z={},c[V]=z);let q=z[F];q===void 0&&(q=S.clone(),z[F]=q,P.addEventListener("dispose",D)),S=q}if(S.visible=P.visible,S.wireframe=P.wireframe,y===Pn?S.side=P.shadowSide!==null?P.shadowSide:P.side:S.side=P.shadowSide!==null?P.shadowSide:d[P.side],S.alphaMap=P.alphaMap,S.alphaTest=P.alphaTest,S.map=P.map,S.clipShadows=P.clipShadows,S.clippingPlanes=P.clippingPlanes,S.clipIntersection=P.clipIntersection,S.displacementMap=P.displacementMap,S.displacementScale=P.displacementScale,S.displacementBias=P.displacementBias,S.wireframeLinewidth=P.wireframeLinewidth,S.linewidth=P.linewidth,I.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const V=i.properties.get(S);V.light=I}return S}function x(A,P,I,y,S){if(A.visible===!1)return;if(A.layers.test(P.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&S===Pn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,A.matrixWorld);const F=t.update(A),z=A.material;if(Array.isArray(z)){const q=F.groups;for(let G=0,K=q.length;G<K;G++){const X=q[G],at=z[X.materialIndex];if(at&&at.visible){const ht=M(A,at,y,S);A.onBeforeShadow(i,A,P,I,F,ht,X),i.renderBufferDirect(I,null,F,ht,A,X),A.onAfterShadow(i,A,P,I,F,ht,X)}}}else if(z.visible){const q=M(A,z,y,S);A.onBeforeShadow(i,A,P,I,F,q,null),i.renderBufferDirect(I,null,F,q,A,null),A.onAfterShadow(i,A,P,I,F,q,null)}}const V=A.children;for(let F=0,z=V.length;F<z;F++)x(V[F],P,I,y,S)}function D(A){A.target.removeEventListener("dispose",D);for(const I in c){const y=c[I],S=A.target.uuid;S in y&&(y[S].dispose(),delete y[S])}}}const Wv={[ja]:qa,[Ya]:Ka,[Ja]:Qa,[Ki]:Za,[qa]:ja,[Ka]:Ya,[Qa]:Ja,[Za]:Ki};function Xv(i,t){function e(){let N=!1;const pt=new le;let j=null;const tt=new le(0,0,0,0);return{setMask:function(Mt){j!==Mt&&!N&&(i.colorMask(Mt,Mt,Mt,Mt),j=Mt)},setLocked:function(Mt){N=Mt},setClear:function(Mt,vt,Bt,ve,Ue){Ue===!0&&(Mt*=ve,vt*=ve,Bt*=ve),pt.set(Mt,vt,Bt,ve),tt.equals(pt)===!1&&(i.clearColor(Mt,vt,Bt,ve),tt.copy(pt))},reset:function(){N=!1,j=null,tt.set(-1,0,0,0)}}}function n(){let N=!1,pt=!1,j=null,tt=null,Mt=null;return{setReversed:function(vt){if(pt!==vt){const Bt=t.get("EXT_clip_control");pt?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT);const ve=Mt;Mt=null,this.setClear(ve)}pt=vt},getReversed:function(){return pt},setTest:function(vt){vt?Q(i.DEPTH_TEST):Pt(i.DEPTH_TEST)},setMask:function(vt){j!==vt&&!N&&(i.depthMask(vt),j=vt)},setFunc:function(vt){if(pt&&(vt=Wv[vt]),tt!==vt){switch(vt){case ja:i.depthFunc(i.NEVER);break;case qa:i.depthFunc(i.ALWAYS);break;case Ya:i.depthFunc(i.LESS);break;case Ki:i.depthFunc(i.LEQUAL);break;case Ja:i.depthFunc(i.EQUAL);break;case Za:i.depthFunc(i.GEQUAL);break;case Ka:i.depthFunc(i.GREATER);break;case Qa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}tt=vt}},setLocked:function(vt){N=vt},setClear:function(vt){Mt!==vt&&(pt&&(vt=1-vt),i.clearDepth(vt),Mt=vt)},reset:function(){N=!1,j=null,tt=null,Mt=null,pt=!1}}}function s(){let N=!1,pt=null,j=null,tt=null,Mt=null,vt=null,Bt=null,ve=null,Ue=null;return{setTest:function(ne){N||(ne?Q(i.STENCIL_TEST):Pt(i.STENCIL_TEST))},setMask:function(ne){pt!==ne&&!N&&(i.stencilMask(ne),pt=ne)},setFunc:function(ne,tn,En){(j!==ne||tt!==tn||Mt!==En)&&(i.stencilFunc(ne,tn,En),j=ne,tt=tn,Mt=En)},setOp:function(ne,tn,En){(vt!==ne||Bt!==tn||ve!==En)&&(i.stencilOp(ne,tn,En),vt=ne,Bt=tn,ve=En)},setLocked:function(ne){N=ne},setClear:function(ne){Ue!==ne&&(i.clearStencil(ne),Ue=ne)},reset:function(){N=!1,pt=null,j=null,tt=null,Mt=null,vt=null,Bt=null,ve=null,Ue=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,f=[],p=null,m=!1,g=null,v=null,_=null,M=null,x=null,D=null,A=null,P=new Ht(0,0,0),I=0,y=!1,S=null,C=null,V=null,F=null,z=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,K=0;const X=i.getParameter(i.VERSION);X.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(X)[1]),G=K>=1):X.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(X)[1]),G=K>=2);let at=null,ht={};const mt=i.getParameter(i.SCISSOR_BOX),Nt=i.getParameter(i.VIEWPORT),Jt=new le().fromArray(mt),U=new le().fromArray(Nt);function Z(N,pt,j,tt){const Mt=new Uint8Array(4),vt=i.createTexture();i.bindTexture(N,vt),i.texParameteri(N,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(N,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Bt=0;Bt<j;Bt++)N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY?i.texImage3D(pt,0,i.RGBA,1,1,tt,0,i.RGBA,i.UNSIGNED_BYTE,Mt):i.texImage2D(pt+Bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Mt);return vt}const ut={};ut[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),ut[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ut[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ut[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(i.DEPTH_TEST),a.setFunc(Ki),nt(!1),xt(Al),Q(i.CULL_FACE),R(ti);function Q(N){h[N]!==!0&&(i.enable(N),h[N]=!0)}function Pt(N){h[N]!==!1&&(i.disable(N),h[N]=!1)}function Dt(N,pt){return d[N]!==pt?(i.bindFramebuffer(N,pt),d[N]=pt,N===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=pt),N===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=pt),!0):!1}function At(N,pt){let j=f,tt=!1;if(N){j=u.get(pt),j===void 0&&(j=[],u.set(pt,j));const Mt=N.textures;if(j.length!==Mt.length||j[0]!==i.COLOR_ATTACHMENT0){for(let vt=0,Bt=Mt.length;vt<Bt;vt++)j[vt]=i.COLOR_ATTACHMENT0+vt;j.length=Mt.length,tt=!0}}else j[0]!==i.BACK&&(j[0]=i.BACK,tt=!0);tt&&i.drawBuffers(j)}function Xt(N){return p!==N?(i.useProgram(N),p=N,!0):!1}const $={[fi]:i.FUNC_ADD,[ju]:i.FUNC_SUBTRACT,[qu]:i.FUNC_REVERSE_SUBTRACT};$[Yu]=i.MIN,$[Ju]=i.MAX;const st={[Zu]:i.ZERO,[Ku]:i.ONE,[Qu]:i.SRC_COLOR,[Xa]:i.SRC_ALPHA,[rd]:i.SRC_ALPHA_SATURATE,[id]:i.DST_COLOR,[ed]:i.DST_ALPHA,[td]:i.ONE_MINUS_SRC_COLOR,[$a]:i.ONE_MINUS_SRC_ALPHA,[sd]:i.ONE_MINUS_DST_COLOR,[nd]:i.ONE_MINUS_DST_ALPHA,[ad]:i.CONSTANT_COLOR,[od]:i.ONE_MINUS_CONSTANT_COLOR,[ld]:i.CONSTANT_ALPHA,[cd]:i.ONE_MINUS_CONSTANT_ALPHA};function R(N,pt,j,tt,Mt,vt,Bt,ve,Ue,ne){if(N===ti){m===!0&&(Pt(i.BLEND),m=!1);return}if(m===!1&&(Q(i.BLEND),m=!0),N!==$u){if(N!==g||ne!==y){if((v!==fi||x!==fi)&&(i.blendEquation(i.FUNC_ADD),v=fi,x=fi),ne)switch(N){case Yi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tl:i.blendFunc(i.ONE,i.ONE);break;case Cl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Rl:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Yi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Tl:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Cl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Rl:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}_=null,M=null,D=null,A=null,P.set(0,0,0),I=0,g=N,y=ne}return}Mt=Mt||pt,vt=vt||j,Bt=Bt||tt,(pt!==v||Mt!==x)&&(i.blendEquationSeparate($[pt],$[Mt]),v=pt,x=Mt),(j!==_||tt!==M||vt!==D||Bt!==A)&&(i.blendFuncSeparate(st[j],st[tt],st[vt],st[Bt]),_=j,M=tt,D=vt,A=Bt),(ve.equals(P)===!1||Ue!==I)&&(i.blendColor(ve.r,ve.g,ve.b,Ue),P.copy(ve),I=Ue),g=N,y=!1}function wt(N,pt){N.side===ln?Pt(i.CULL_FACE):Q(i.CULL_FACE);let j=N.side===Xe;pt&&(j=!j),nt(j),N.blending===Yi&&N.transparent===!1?R(ti):R(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const tt=N.stencilWrite;o.setTest(tt),tt&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),It(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Q(i.SAMPLE_ALPHA_TO_COVERAGE):Pt(i.SAMPLE_ALPHA_TO_COVERAGE)}function nt(N){S!==N&&(N?i.frontFace(i.CW):i.frontFace(i.CCW),S=N)}function xt(N){N!==Hu?(Q(i.CULL_FACE),N!==C&&(N===Al?i.cullFace(i.BACK):N===Wu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pt(i.CULL_FACE),C=N}function lt(N){N!==V&&(G&&i.lineWidth(N),V=N)}function It(N,pt,j){N?(Q(i.POLYGON_OFFSET_FILL),(F!==pt||z!==j)&&(i.polygonOffset(pt,j),F=pt,z=j)):Pt(i.POLYGON_OFFSET_FILL)}function gt(N){N?Q(i.SCISSOR_TEST):Pt(i.SCISSOR_TEST)}function E(N){N===void 0&&(N=i.TEXTURE0+q-1),at!==N&&(i.activeTexture(N),at=N)}function b(N,pt,j){j===void 0&&(at===null?j=i.TEXTURE0+q-1:j=at);let tt=ht[j];tt===void 0&&(tt={type:void 0,texture:void 0},ht[j]=tt),(tt.type!==N||tt.texture!==pt)&&(at!==j&&(i.activeTexture(j),at=j),i.bindTexture(N,pt||ut[N]),tt.type=N,tt.texture=pt)}function k(){const N=ht[at];N!==void 0&&N.type!==void 0&&(i.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Y(){try{i.compressedTexImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function et(){try{i.compressedTexImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function J(){try{i.texSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function St(){try{i.texSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function dt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function yt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function $t(){try{i.texStorage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function rt(){try{i.texStorage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function bt(){try{i.texImage2D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ut(){try{i.texImage3D.apply(i,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ft(N){Jt.equals(N)===!1&&(i.scissor(N.x,N.y,N.z,N.w),Jt.copy(N))}function Et(N){U.equals(N)===!1&&(i.viewport(N.x,N.y,N.z,N.w),U.copy(N))}function Yt(N,pt){let j=c.get(pt);j===void 0&&(j=new WeakMap,c.set(pt,j));let tt=j.get(N);tt===void 0&&(tt=i.getUniformBlockIndex(pt,N.name),j.set(N,tt))}function Vt(N,pt){const tt=c.get(pt).get(N);l.get(pt)!==tt&&(i.uniformBlockBinding(pt,tt,N.__bindingPointIndex),l.set(pt,tt))}function ce(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},at=null,ht={},d={},u=new WeakMap,f=[],p=null,m=!1,g=null,v=null,_=null,M=null,x=null,D=null,A=null,P=new Ht(0,0,0),I=0,y=!1,S=null,C=null,V=null,F=null,z=null,Jt.set(0,0,i.canvas.width,i.canvas.height),U.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:Q,disable:Pt,bindFramebuffer:Dt,drawBuffers:At,useProgram:Xt,setBlending:R,setMaterial:wt,setFlipSided:nt,setCullFace:xt,setLineWidth:lt,setPolygonOffset:It,setScissorTest:gt,activeTexture:E,bindTexture:b,unbindTexture:k,compressedTexImage2D:Y,compressedTexImage3D:et,texImage2D:bt,texImage3D:Ut,updateUBOMapping:Yt,uniformBlockBinding:Vt,texStorage2D:$t,texStorage3D:rt,texSubImage2D:J,texSubImage3D:St,compressedTexSubImage2D:dt,compressedTexSubImage3D:yt,scissor:Ft,viewport:Et,reset:ce}}function bc(i,t,e,n){const s=$v(n);switch(e){case Dh:return i*t;case Uh:return i*t;case Nh:return i*t*2;case Fh:return i*t/s.components*s.byteLength;case Zo:return i*t/s.components*s.byteLength;case Oh:return i*t*2/s.components*s.byteLength;case Ko:return i*t*2/s.components*s.byteLength;case Ih:return i*t*3/s.components*s.byteLength;case un:return i*t*4/s.components*s.byteLength;case Qo:return i*t*4/s.components*s.byteLength;case wr:case Ar:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Tr:case Cr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ro:case oo:return Math.max(i,16)*Math.max(t,8)/4;case so:case ao:return Math.max(i,8)*Math.max(t,8)/2;case lo:case co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ho:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case fo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case po:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case mo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case go:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case vo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case _o:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case xo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Mo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case So:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case bo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Eo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case wo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Rr:case Ao:case To:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Bh:case Co:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Ro:case Lo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function $v(i){switch(i){case On:case Rh:return{byteLength:1,components:1};case Is:case Lh:case zs:return{byteLength:2,components:1};case Yo:case Jo:return{byteLength:2,components:4};case Mi:case qo:case Un:return{byteLength:4,components:1};case Ph:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function jv(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ft,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function p(E,b){return f?new OffscreenCanvas(E,b):Br("canvas")}function m(E,b,k){let Y=1;const et=gt(E);if((et.width>k||et.height>k)&&(Y=k/Math.max(et.width,et.height)),Y<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const J=Math.floor(Y*et.width),St=Math.floor(Y*et.height);d===void 0&&(d=p(J,St));const dt=b?p(J,St):d;return dt.width=J,dt.height=St,dt.getContext("2d").drawImage(E,0,0,J,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+J+"x"+St+")."),dt}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),E;return E}function g(E){return E.generateMipmaps}function v(E){i.generateMipmap(E)}function _(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(E,b,k,Y,et=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let J=b;if(b===i.RED&&(k===i.FLOAT&&(J=i.R32F),k===i.HALF_FLOAT&&(J=i.R16F),k===i.UNSIGNED_BYTE&&(J=i.R8)),b===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.R8UI),k===i.UNSIGNED_SHORT&&(J=i.R16UI),k===i.UNSIGNED_INT&&(J=i.R32UI),k===i.BYTE&&(J=i.R8I),k===i.SHORT&&(J=i.R16I),k===i.INT&&(J=i.R32I)),b===i.RG&&(k===i.FLOAT&&(J=i.RG32F),k===i.HALF_FLOAT&&(J=i.RG16F),k===i.UNSIGNED_BYTE&&(J=i.RG8)),b===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RG8UI),k===i.UNSIGNED_SHORT&&(J=i.RG16UI),k===i.UNSIGNED_INT&&(J=i.RG32UI),k===i.BYTE&&(J=i.RG8I),k===i.SHORT&&(J=i.RG16I),k===i.INT&&(J=i.RG32I)),b===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RGB8UI),k===i.UNSIGNED_SHORT&&(J=i.RGB16UI),k===i.UNSIGNED_INT&&(J=i.RGB32UI),k===i.BYTE&&(J=i.RGB8I),k===i.SHORT&&(J=i.RGB16I),k===i.INT&&(J=i.RGB32I)),b===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),k===i.UNSIGNED_INT&&(J=i.RGBA32UI),k===i.BYTE&&(J=i.RGBA8I),k===i.SHORT&&(J=i.RGBA16I),k===i.INT&&(J=i.RGBA32I)),b===i.RGB&&k===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),b===i.RGBA){const St=et?Wr:Zt.getTransfer(Y);k===i.FLOAT&&(J=i.RGBA32F),k===i.HALF_FLOAT&&(J=i.RGBA16F),k===i.UNSIGNED_BYTE&&(J=St===re?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function x(E,b){let k;return E?b===null||b===Mi||b===es?k=i.DEPTH24_STENCIL8:b===Un?k=i.DEPTH32F_STENCIL8:b===Is&&(k=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Mi||b===es?k=i.DEPTH_COMPONENT24:b===Un?k=i.DEPTH_COMPONENT32F:b===Is&&(k=i.DEPTH_COMPONENT16),k}function D(E,b){return g(E)===!0||E.isFramebufferTexture&&E.minFilter!==dn&&E.minFilter!==xn?Math.log2(Math.max(b.width,b.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?b.mipmaps.length:1}function A(E){const b=E.target;b.removeEventListener("dispose",A),I(b),b.isVideoTexture&&h.delete(b)}function P(E){const b=E.target;b.removeEventListener("dispose",P),S(b)}function I(E){const b=n.get(E);if(b.__webglInit===void 0)return;const k=E.source,Y=u.get(k);if(Y){const et=Y[b.__cacheKey];et.usedTimes--,et.usedTimes===0&&y(E),Object.keys(Y).length===0&&u.delete(k)}n.remove(E)}function y(E){const b=n.get(E);i.deleteTexture(b.__webglTexture);const k=E.source,Y=u.get(k);delete Y[b.__cacheKey],a.memory.textures--}function S(E){const b=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(b.__webglFramebuffer[Y]))for(let et=0;et<b.__webglFramebuffer[Y].length;et++)i.deleteFramebuffer(b.__webglFramebuffer[Y][et]);else i.deleteFramebuffer(b.__webglFramebuffer[Y]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[Y])}else{if(Array.isArray(b.__webglFramebuffer))for(let Y=0;Y<b.__webglFramebuffer.length;Y++)i.deleteFramebuffer(b.__webglFramebuffer[Y]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let Y=0;Y<b.__webglColorRenderbuffer.length;Y++)b.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[Y]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const k=E.textures;for(let Y=0,et=k.length;Y<et;Y++){const J=n.get(k[Y]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),a.memory.textures--),n.remove(k[Y])}n.remove(E)}let C=0;function V(){C=0}function F(){const E=C;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),C+=1,E}function z(E){const b=[];return b.push(E.wrapS),b.push(E.wrapT),b.push(E.wrapR||0),b.push(E.magFilter),b.push(E.minFilter),b.push(E.anisotropy),b.push(E.internalFormat),b.push(E.format),b.push(E.type),b.push(E.generateMipmaps),b.push(E.premultiplyAlpha),b.push(E.flipY),b.push(E.unpackAlignment),b.push(E.colorSpace),b.join()}function q(E,b){const k=n.get(E);if(E.isVideoTexture&&lt(E),E.isRenderTargetTexture===!1&&E.version>0&&k.__version!==E.version){const Y=E.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{U(k,E,b);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+b)}function G(E,b){const k=n.get(E);if(E.version>0&&k.__version!==E.version){U(k,E,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+b)}function K(E,b){const k=n.get(E);if(E.version>0&&k.__version!==E.version){U(k,E,b);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+b)}function X(E,b){const k=n.get(E);if(E.version>0&&k.__version!==E.version){Z(k,E,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+b)}const at={[no]:i.REPEAT,[gi]:i.CLAMP_TO_EDGE,[io]:i.MIRRORED_REPEAT},ht={[dn]:i.NEAREST,[xd]:i.NEAREST_MIPMAP_NEAREST,[Xs]:i.NEAREST_MIPMAP_LINEAR,[xn]:i.LINEAR,[Kr]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},mt={[bd]:i.NEVER,[Rd]:i.ALWAYS,[Ed]:i.LESS,[kh]:i.LEQUAL,[wd]:i.EQUAL,[Cd]:i.GEQUAL,[Ad]:i.GREATER,[Td]:i.NOTEQUAL};function Nt(E,b){if(b.type===Un&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===xn||b.magFilter===Kr||b.magFilter===Xs||b.magFilter===vi||b.minFilter===xn||b.minFilter===Kr||b.minFilter===Xs||b.minFilter===vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,at[b.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,at[b.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,at[b.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,ht[b.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,ht[b.minFilter]),b.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,mt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===dn||b.minFilter!==Xs&&b.minFilter!==vi||b.type===Un&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const k=t.get("EXT_texture_filter_anisotropic");i.texParameterf(E,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function Jt(E,b){let k=!1;E.__webglInit===void 0&&(E.__webglInit=!0,b.addEventListener("dispose",A));const Y=b.source;let et=u.get(Y);et===void 0&&(et={},u.set(Y,et));const J=z(b);if(J!==E.__cacheKey){et[J]===void 0&&(et[J]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,k=!0),et[J].usedTimes++;const St=et[E.__cacheKey];St!==void 0&&(et[E.__cacheKey].usedTimes--,St.usedTimes===0&&y(b)),E.__cacheKey=J,E.__webglTexture=et[J].texture}return k}function U(E,b,k){let Y=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(Y=i.TEXTURE_3D);const et=Jt(E,b),J=b.source;e.bindTexture(Y,E.__webglTexture,i.TEXTURE0+k);const St=n.get(J);if(J.version!==St.__version||et===!0){e.activeTexture(i.TEXTURE0+k);const dt=Zt.getPrimaries(Zt.workingColorSpace),yt=b.colorSpace===Zn?null:Zt.getPrimaries(b.colorSpace),$t=b.colorSpace===Zn||dt===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);let rt=m(b.image,!1,s.maxTextureSize);rt=It(b,rt);const bt=r.convert(b.format,b.colorSpace),Ut=r.convert(b.type);let Ft=M(b.internalFormat,bt,Ut,b.colorSpace,b.isVideoTexture);Nt(Y,b);let Et;const Yt=b.mipmaps,Vt=b.isVideoTexture!==!0,ce=St.__version===void 0||et===!0,N=J.dataReady,pt=D(b,rt);if(b.isDepthTexture)Ft=x(b.format===ns,b.type),ce&&(Vt?e.texStorage2D(i.TEXTURE_2D,1,Ft,rt.width,rt.height):e.texImage2D(i.TEXTURE_2D,0,Ft,rt.width,rt.height,0,bt,Ut,null));else if(b.isDataTexture)if(Yt.length>0){Vt&&ce&&e.texStorage2D(i.TEXTURE_2D,pt,Ft,Yt[0].width,Yt[0].height);for(let j=0,tt=Yt.length;j<tt;j++)Et=Yt[j],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,Et.width,Et.height,bt,Ut,Et.data):e.texImage2D(i.TEXTURE_2D,j,Ft,Et.width,Et.height,0,bt,Ut,Et.data);b.generateMipmaps=!1}else Vt?(ce&&e.texStorage2D(i.TEXTURE_2D,pt,Ft,rt.width,rt.height),N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,rt.width,rt.height,bt,Ut,rt.data)):e.texImage2D(i.TEXTURE_2D,0,Ft,rt.width,rt.height,0,bt,Ut,rt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){Vt&&ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ft,Yt[0].width,Yt[0].height,rt.depth);for(let j=0,tt=Yt.length;j<tt;j++)if(Et=Yt[j],b.format!==un)if(bt!==null)if(Vt){if(N)if(b.layerUpdates.size>0){const Mt=bc(Et.width,Et.height,b.format,b.type);for(const vt of b.layerUpdates){const Bt=Et.data.subarray(vt*Mt/Et.data.BYTES_PER_ELEMENT,(vt+1)*Mt/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,vt,Et.width,Et.height,1,bt,Bt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Et.width,Et.height,rt.depth,bt,Et.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,j,Ft,Et.width,Et.height,rt.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Vt?N&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,j,0,0,0,Et.width,Et.height,rt.depth,bt,Ut,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,j,Ft,Et.width,Et.height,rt.depth,0,bt,Ut,Et.data)}else{Vt&&ce&&e.texStorage2D(i.TEXTURE_2D,pt,Ft,Yt[0].width,Yt[0].height);for(let j=0,tt=Yt.length;j<tt;j++)Et=Yt[j],b.format!==un?bt!==null?Vt?N&&e.compressedTexSubImage2D(i.TEXTURE_2D,j,0,0,Et.width,Et.height,bt,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,j,Ft,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Vt?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,Et.width,Et.height,bt,Ut,Et.data):e.texImage2D(i.TEXTURE_2D,j,Ft,Et.width,Et.height,0,bt,Ut,Et.data)}else if(b.isDataArrayTexture)if(Vt){if(ce&&e.texStorage3D(i.TEXTURE_2D_ARRAY,pt,Ft,rt.width,rt.height,rt.depth),N)if(b.layerUpdates.size>0){const j=bc(rt.width,rt.height,b.format,b.type);for(const tt of b.layerUpdates){const Mt=rt.data.subarray(tt*j/rt.data.BYTES_PER_ELEMENT,(tt+1)*j/rt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,tt,rt.width,rt.height,1,bt,Ut,Mt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,rt.width,rt.height,rt.depth,bt,Ut,rt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ft,rt.width,rt.height,rt.depth,0,bt,Ut,rt.data);else if(b.isData3DTexture)Vt?(ce&&e.texStorage3D(i.TEXTURE_3D,pt,Ft,rt.width,rt.height,rt.depth),N&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,rt.width,rt.height,rt.depth,bt,Ut,rt.data)):e.texImage3D(i.TEXTURE_3D,0,Ft,rt.width,rt.height,rt.depth,0,bt,Ut,rt.data);else if(b.isFramebufferTexture){if(ce)if(Vt)e.texStorage2D(i.TEXTURE_2D,pt,Ft,rt.width,rt.height);else{let j=rt.width,tt=rt.height;for(let Mt=0;Mt<pt;Mt++)e.texImage2D(i.TEXTURE_2D,Mt,Ft,j,tt,0,bt,Ut,null),j>>=1,tt>>=1}}else if(Yt.length>0){if(Vt&&ce){const j=gt(Yt[0]);e.texStorage2D(i.TEXTURE_2D,pt,Ft,j.width,j.height)}for(let j=0,tt=Yt.length;j<tt;j++)Et=Yt[j],Vt?N&&e.texSubImage2D(i.TEXTURE_2D,j,0,0,bt,Ut,Et):e.texImage2D(i.TEXTURE_2D,j,Ft,bt,Ut,Et);b.generateMipmaps=!1}else if(Vt){if(ce){const j=gt(rt);e.texStorage2D(i.TEXTURE_2D,pt,Ft,j.width,j.height)}N&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,bt,Ut,rt)}else e.texImage2D(i.TEXTURE_2D,0,Ft,bt,Ut,rt);g(b)&&v(Y),St.__version=J.version,b.onUpdate&&b.onUpdate(b)}E.__version=b.version}function Z(E,b,k){if(b.image.length!==6)return;const Y=Jt(E,b),et=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+k);const J=n.get(et);if(et.version!==J.__version||Y===!0){e.activeTexture(i.TEXTURE0+k);const St=Zt.getPrimaries(Zt.workingColorSpace),dt=b.colorSpace===Zn?null:Zt.getPrimaries(b.colorSpace),yt=b.colorSpace===Zn||St===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const $t=b.isCompressedTexture||b.image[0].isCompressedTexture,rt=b.image[0]&&b.image[0].isDataTexture,bt=[];for(let tt=0;tt<6;tt++)!$t&&!rt?bt[tt]=m(b.image[tt],!0,s.maxCubemapSize):bt[tt]=rt?b.image[tt].image:b.image[tt],bt[tt]=It(b,bt[tt]);const Ut=bt[0],Ft=r.convert(b.format,b.colorSpace),Et=r.convert(b.type),Yt=M(b.internalFormat,Ft,Et,b.colorSpace),Vt=b.isVideoTexture!==!0,ce=J.__version===void 0||Y===!0,N=et.dataReady;let pt=D(b,Ut);Nt(i.TEXTURE_CUBE_MAP,b);let j;if($t){Vt&&ce&&e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Yt,Ut.width,Ut.height);for(let tt=0;tt<6;tt++){j=bt[tt].mipmaps;for(let Mt=0;Mt<j.length;Mt++){const vt=j[Mt];b.format!==un?Ft!==null?Vt?N&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,0,0,vt.width,vt.height,Ft,vt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,Yt,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,0,0,vt.width,vt.height,Ft,Et,vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt,Yt,vt.width,vt.height,0,Ft,Et,vt.data)}}}else{if(j=b.mipmaps,Vt&&ce){j.length>0&&pt++;const tt=gt(bt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,pt,Yt,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(rt){Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,bt[tt].width,bt[tt].height,Ft,Et,bt[tt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Yt,bt[tt].width,bt[tt].height,0,Ft,Et,bt[tt].data);for(let Mt=0;Mt<j.length;Mt++){const Bt=j[Mt].image[tt].image;Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,0,0,Bt.width,Bt.height,Ft,Et,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,Yt,Bt.width,Bt.height,0,Ft,Et,Bt.data)}}else{Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Ft,Et,bt[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,Yt,Ft,Et,bt[tt]);for(let Mt=0;Mt<j.length;Mt++){const vt=j[Mt];Vt?N&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,0,0,Ft,Et,vt.image[tt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+tt,Mt+1,Yt,Ft,Et,vt.image[tt])}}}g(b)&&v(i.TEXTURE_CUBE_MAP),J.__version=et.version,b.onUpdate&&b.onUpdate(b)}E.__version=b.version}function ut(E,b,k,Y,et,J){const St=r.convert(k.format,k.colorSpace),dt=r.convert(k.type),yt=M(k.internalFormat,St,dt,k.colorSpace),$t=n.get(b),rt=n.get(k);if(rt.__renderTarget=b,!$t.__hasExternalTextures){const bt=Math.max(1,b.width>>J),Ut=Math.max(1,b.height>>J);et===i.TEXTURE_3D||et===i.TEXTURE_2D_ARRAY?e.texImage3D(et,J,yt,bt,Ut,b.depth,0,St,dt,null):e.texImage2D(et,J,yt,bt,Ut,0,St,dt,null)}e.bindFramebuffer(i.FRAMEBUFFER,E),xt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,et,rt.__webglTexture,0,nt(b)):(et===i.TEXTURE_2D||et>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,et,rt.__webglTexture,J),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Q(E,b,k){if(i.bindRenderbuffer(i.RENDERBUFFER,E),b.depthBuffer){const Y=b.depthTexture,et=Y&&Y.isDepthTexture?Y.type:null,J=x(b.stencilBuffer,et),St=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,dt=nt(b);xt(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,J,b.width,b.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,J,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,J,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,St,i.RENDERBUFFER,E)}else{const Y=b.textures;for(let et=0;et<Y.length;et++){const J=Y[et],St=r.convert(J.format,J.colorSpace),dt=r.convert(J.type),yt=M(J.internalFormat,St,dt,J.colorSpace),$t=nt(b);k&&xt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,$t,yt,b.width,b.height):xt(b)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$t,yt,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,yt,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pt(E,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,E),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(b.depthTexture);Y.__renderTarget=b,(!Y.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),q(b.depthTexture,0);const et=Y.__webglTexture,J=nt(b);if(b.depthTexture.format===Ji)xt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(b.depthTexture.format===ns)xt(b)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Dt(E){const b=n.get(E),k=E.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==E.depthTexture){const Y=E.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),Y){const et=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,Y.removeEventListener("dispose",et)};Y.addEventListener("dispose",et),b.__depthDisposeCallback=et}b.__boundDepthTexture=Y}if(E.depthTexture&&!b.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");Pt(b.__webglFramebuffer,E)}else if(k){b.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[Y]),b.__webglDepthbuffer[Y]===void 0)b.__webglDepthbuffer[Y]=i.createRenderbuffer(),Q(b.__webglDepthbuffer[Y],E,!1);else{const et=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=b.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,J)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),Q(b.__webglDepthbuffer,E,!1);else{const Y=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,et=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,et),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,et)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function At(E,b,k){const Y=n.get(E);b!==void 0&&ut(Y.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Dt(E)}function Xt(E){const b=E.texture,k=n.get(E),Y=n.get(b);E.addEventListener("dispose",P);const et=E.textures,J=E.isWebGLCubeRenderTarget===!0,St=et.length>1;if(St||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=b.version,a.memory.textures++),J){k.__webglFramebuffer=[];for(let dt=0;dt<6;dt++)if(b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer[dt]=[];for(let yt=0;yt<b.mipmaps.length;yt++)k.__webglFramebuffer[dt][yt]=i.createFramebuffer()}else k.__webglFramebuffer[dt]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){k.__webglFramebuffer=[];for(let dt=0;dt<b.mipmaps.length;dt++)k.__webglFramebuffer[dt]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(St)for(let dt=0,yt=et.length;dt<yt;dt++){const $t=n.get(et[dt]);$t.__webglTexture===void 0&&($t.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&xt(E)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let dt=0;dt<et.length;dt++){const yt=et[dt];k.__webglColorRenderbuffer[dt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[dt]);const $t=r.convert(yt.format,yt.colorSpace),rt=r.convert(yt.type),bt=M(yt.internalFormat,$t,rt,yt.colorSpace,E.isXRRenderTarget===!0),Ut=nt(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ut,bt,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+dt,i.RENDERBUFFER,k.__webglColorRenderbuffer[dt])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Q(k.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Nt(i.TEXTURE_CUBE_MAP,b);for(let dt=0;dt<6;dt++)if(b.mipmaps&&b.mipmaps.length>0)for(let yt=0;yt<b.mipmaps.length;yt++)ut(k.__webglFramebuffer[dt][yt],E,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,yt);else ut(k.__webglFramebuffer[dt],E,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0);g(b)&&v(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let dt=0,yt=et.length;dt<yt;dt++){const $t=et[dt],rt=n.get($t);e.bindTexture(i.TEXTURE_2D,rt.__webglTexture),Nt(i.TEXTURE_2D,$t),ut(k.__webglFramebuffer,E,$t,i.COLOR_ATTACHMENT0+dt,i.TEXTURE_2D,0),g($t)&&v(i.TEXTURE_2D)}e.unbindTexture()}else{let dt=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(dt=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(dt,Y.__webglTexture),Nt(dt,b),b.mipmaps&&b.mipmaps.length>0)for(let yt=0;yt<b.mipmaps.length;yt++)ut(k.__webglFramebuffer[yt],E,b,i.COLOR_ATTACHMENT0,dt,yt);else ut(k.__webglFramebuffer,E,b,i.COLOR_ATTACHMENT0,dt,0);g(b)&&v(dt),e.unbindTexture()}E.depthBuffer&&Dt(E)}function $(E){const b=E.textures;for(let k=0,Y=b.length;k<Y;k++){const et=b[k];if(g(et)){const J=_(E),St=n.get(et).__webglTexture;e.bindTexture(J,St),v(J),e.unbindTexture()}}}const st=[],R=[];function wt(E){if(E.samples>0){if(xt(E)===!1){const b=E.textures,k=E.width,Y=E.height;let et=i.COLOR_BUFFER_BIT;const J=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=n.get(E),dt=b.length>1;if(dt)for(let yt=0;yt<b.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let yt=0;yt<b.length;yt++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(et|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(et|=i.STENCIL_BUFFER_BIT)),dt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,St.__webglColorRenderbuffer[yt]);const $t=n.get(b[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,$t,0)}i.blitFramebuffer(0,0,k,Y,0,0,k,Y,et,i.NEAREST),l===!0&&(st.length=0,R.length=0,st.push(i.COLOR_ATTACHMENT0+yt),E.depthBuffer&&E.resolveDepthBuffer===!1&&(st.push(J),R.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,R)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,st))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),dt)for(let yt=0;yt<b.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,St.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,St.__webglColorRenderbuffer[yt]);const $t=n.get(b[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,St.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,$t,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const b=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function nt(E){return Math.min(s.maxSamples,E.samples)}function xt(E){const b=n.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function lt(E){const b=a.render.frame;h.get(E)!==b&&(h.set(E,b),E.update())}function It(E,b){const k=E.colorSpace,Y=E.format,et=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||k!==as&&k!==Zn&&(Zt.getTransfer(k)===re?(Y!==un||et!==On)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),b}function gt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=V,this.setTexture2D=q,this.setTexture2DArray=G,this.setTexture3D=K,this.setTextureCube=X,this.rebindTextures=At,this.setupRenderTarget=Xt,this.updateRenderTargetMipmap=$,this.updateMultisampleRenderTarget=wt,this.setupDepthRenderbuffer=Dt,this.setupFrameBufferTexture=ut,this.useMultisampledRTT=xt}function qv(i,t){function e(n,s=Zn){let r;const a=Zt.getTransfer(s);if(n===On)return i.UNSIGNED_BYTE;if(n===Yo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Jo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ph)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Rh)return i.BYTE;if(n===Lh)return i.SHORT;if(n===Is)return i.UNSIGNED_SHORT;if(n===qo)return i.INT;if(n===Mi)return i.UNSIGNED_INT;if(n===Un)return i.FLOAT;if(n===zs)return i.HALF_FLOAT;if(n===Dh)return i.ALPHA;if(n===Ih)return i.RGB;if(n===un)return i.RGBA;if(n===Uh)return i.LUMINANCE;if(n===Nh)return i.LUMINANCE_ALPHA;if(n===Ji)return i.DEPTH_COMPONENT;if(n===ns)return i.DEPTH_STENCIL;if(n===Fh)return i.RED;if(n===Zo)return i.RED_INTEGER;if(n===Oh)return i.RG;if(n===Ko)return i.RG_INTEGER;if(n===Qo)return i.RGBA_INTEGER;if(n===wr||n===Ar||n===Tr||n===Cr)if(a===re)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===wr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Cr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===wr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Cr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===so||n===ro||n===ao||n===oo)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===so)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ro)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ao)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===oo)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===lo||n===co||n===ho)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===lo||n===co)return a===re?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ho)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===uo||n===fo||n===po||n===mo||n===go||n===vo||n===_o||n===xo||n===Mo||n===yo||n===So||n===bo||n===Eo||n===wo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===uo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===po)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===mo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===go)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===vo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===_o)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Mo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===yo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===So)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===bo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Eo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===wo)return a===re?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Rr||n===Ao||n===To)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Rr)return a===re?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===To)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Bh||n===Co||n===Ro||n===Lo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Rr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Lo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===es?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class Yv extends Ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class vn extends Me{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Jv={type:"move"};class wa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new vn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new vn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new vn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const m of t.hand.values()){const g=e.getJointPose(m,n),v=this._getHandJoint(c,m);g!==null&&(v.matrix.fromArray(g.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,v.jointRadius=g.radius),v.visible=g!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Jv)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new vn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Zv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Kv=`
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

}`;class Qv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ve,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Bn({vertexShader:Zv,fragmentShader:Kv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new we(new Xr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class t0 extends os{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null;const m=new Qv,g=e.getContextAttributes();let v=null,_=null;const M=[],x=[],D=new ft;let A=null;const P=new Ke;P.viewport=new le;const I=new Ke;I.viewport=new le;const y=[P,I],S=new Yv;let C=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let Z=M[U];return Z===void 0&&(Z=new wa,M[U]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(U){let Z=M[U];return Z===void 0&&(Z=new wa,M[U]=Z),Z.getGripSpace()},this.getHand=function(U){let Z=M[U];return Z===void 0&&(Z=new wa,M[U]=Z),Z.getHandSpace()};function F(U){const Z=x.indexOf(U.inputSource);if(Z===-1)return;const ut=M[Z];ut!==void 0&&(ut.update(U.inputSource,U.frame,c||a),ut.dispatchEvent({type:U.type,data:U.inputSource}))}function z(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",z),s.removeEventListener("inputsourceschange",q);for(let U=0;U<M.length;U++){const Z=x[U];Z!==null&&(x[U]=null,M[U].disconnect(Z))}C=null,V=null,m.reset(),t.setRenderTarget(v),f=null,u=null,d=null,s=null,_=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(A),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){r=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){o=U,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(U){if(s=U,s!==null){if(v=t.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",z),s.addEventListener("inputsourceschange",q),g.xrCompatible!==!0&&await e.makeXRCompatible(),A=t.getPixelRatio(),t.getSize(D),s.renderState.layers===void 0){const Z={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Z),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new yi(f.framebufferWidth,f.framebufferHeight,{format:un,type:On,colorSpace:t.outputColorSpace,stencilBuffer:g.stencil})}else{let Z=null,ut=null,Q=null;g.depth&&(Q=g.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Z=g.stencil?ns:Ji,ut=g.stencil?es:Mi);const Pt={colorFormat:e.RGBA8,depthFormat:Q,scaleFactor:r};d=new XRWebGLBinding(s,e),u=d.createProjectionLayer(Pt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new yi(u.textureWidth,u.textureHeight,{format:un,type:On,depthTexture:new Zh(u.textureWidth,u.textureHeight,ut,void 0,void 0,void 0,void 0,void 0,void 0,Z),stencilBuffer:g.stencil,colorSpace:t.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function q(U){for(let Z=0;Z<U.removed.length;Z++){const ut=U.removed[Z],Q=x.indexOf(ut);Q>=0&&(x[Q]=null,M[Q].disconnect(ut))}for(let Z=0;Z<U.added.length;Z++){const ut=U.added[Z];let Q=x.indexOf(ut);if(Q===-1){for(let Dt=0;Dt<M.length;Dt++)if(Dt>=x.length){x.push(ut),Q=Dt;break}else if(x[Dt]===null){x[Dt]=ut,Q=Dt;break}if(Q===-1)break}const Pt=M[Q];Pt&&Pt.connect(ut)}}const G=new L,K=new L;function X(U,Z,ut){G.setFromMatrixPosition(Z.matrixWorld),K.setFromMatrixPosition(ut.matrixWorld);const Q=G.distanceTo(K),Pt=Z.projectionMatrix.elements,Dt=ut.projectionMatrix.elements,At=Pt[14]/(Pt[10]-1),Xt=Pt[14]/(Pt[10]+1),$=(Pt[9]+1)/Pt[5],st=(Pt[9]-1)/Pt[5],R=(Pt[8]-1)/Pt[0],wt=(Dt[8]+1)/Dt[0],nt=At*R,xt=At*wt,lt=Q/(-R+wt),It=lt*-R;if(Z.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(It),U.translateZ(lt),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert(),Pt[10]===-1)U.projectionMatrix.copy(Z.projectionMatrix),U.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const gt=At+lt,E=Xt+lt,b=nt-It,k=xt+(Q-It),Y=$*Xt/E*gt,et=st*Xt/E*gt;U.projectionMatrix.makePerspective(b,k,Y,et,gt,E),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}}function at(U,Z){Z===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(Z.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(s===null)return;let Z=U.near,ut=U.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(ut=m.depthFar)),S.near=I.near=P.near=Z,S.far=I.far=P.far=ut,(C!==S.near||V!==S.far)&&(s.updateRenderState({depthNear:S.near,depthFar:S.far}),C=S.near,V=S.far),P.layers.mask=U.layers.mask|2,I.layers.mask=U.layers.mask|4,S.layers.mask=P.layers.mask|I.layers.mask;const Q=U.parent,Pt=S.cameras;at(S,Q);for(let Dt=0;Dt<Pt.length;Dt++)at(Pt[Dt],Q);Pt.length===2?X(S,P,I):S.projectionMatrix.copy(P.projectionMatrix),ht(U,S,Q)};function ht(U,Z,ut){ut===null?U.matrix.copy(Z.matrixWorld):(U.matrix.copy(ut.matrixWorld),U.matrix.invert(),U.matrix.multiply(Z.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(Z.projectionMatrix),U.projectionMatrixInverse.copy(Z.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=Us*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(U){l=U,u!==null&&(u.fixedFoveation=U),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=U)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(S)};let mt=null;function Nt(U,Z){if(h=Z.getViewerPose(c||a),p=Z,h!==null){const ut=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Q=!1;ut.length!==S.cameras.length&&(S.cameras.length=0,Q=!0);for(let Dt=0;Dt<ut.length;Dt++){const At=ut[Dt];let Xt=null;if(f!==null)Xt=f.getViewport(At);else{const st=d.getViewSubImage(u,At);Xt=st.viewport,Dt===0&&(t.setRenderTargetTextures(_,st.colorTexture,u.ignoreDepthValues?void 0:st.depthStencilTexture),t.setRenderTarget(_))}let $=y[Dt];$===void 0&&($=new Ke,$.layers.enable(Dt),$.viewport=new le,y[Dt]=$),$.matrix.fromArray(At.transform.matrix),$.matrix.decompose($.position,$.quaternion,$.scale),$.projectionMatrix.fromArray(At.projectionMatrix),$.projectionMatrixInverse.copy($.projectionMatrix).invert(),$.viewport.set(Xt.x,Xt.y,Xt.width,Xt.height),Dt===0&&(S.matrix.copy($.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),Q===!0&&S.cameras.push($)}const Pt=s.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")){const Dt=d.getDepthInformation(ut[0]);Dt&&Dt.isValid&&Dt.texture&&m.init(t,Dt,s.renderState)}}for(let ut=0;ut<M.length;ut++){const Q=x[ut],Pt=M[ut];Q!==null&&Pt!==void 0&&Pt.update(Q,Z,c||a)}mt&&mt(U,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),p=null}const Jt=new Jh;Jt.setAnimationLoop(Nt),this.setAnimationLoop=function(U){mt=U},this.dispose=function(){}}}const hi=new Sn,e0=new se;function n0(i,t){function e(g,v){g.matrixAutoUpdate===!0&&g.updateMatrix(),v.value.copy(g.matrix)}function n(g,v){v.color.getRGB(g.fogColor.value,jh(i)),v.isFog?(g.fogNear.value=v.near,g.fogFar.value=v.far):v.isFogExp2&&(g.fogDensity.value=v.density)}function s(g,v,_,M,x){v.isMeshBasicMaterial||v.isMeshLambertMaterial?r(g,v):v.isMeshToonMaterial?(r(g,v),d(g,v)):v.isMeshPhongMaterial?(r(g,v),h(g,v)):v.isMeshStandardMaterial?(r(g,v),u(g,v),v.isMeshPhysicalMaterial&&f(g,v,x)):v.isMeshMatcapMaterial?(r(g,v),p(g,v)):v.isMeshDepthMaterial?r(g,v):v.isMeshDistanceMaterial?(r(g,v),m(g,v)):v.isMeshNormalMaterial?r(g,v):v.isLineBasicMaterial?(a(g,v),v.isLineDashedMaterial&&o(g,v)):v.isPointsMaterial?l(g,v,_,M):v.isSpriteMaterial?c(g,v):v.isShadowMaterial?(g.color.value.copy(v.color),g.opacity.value=v.opacity):v.isShaderMaterial&&(v.uniformsNeedUpdate=!1)}function r(g,v){g.opacity.value=v.opacity,v.color&&g.diffuse.value.copy(v.color),v.emissive&&g.emissive.value.copy(v.emissive).multiplyScalar(v.emissiveIntensity),v.map&&(g.map.value=v.map,e(v.map,g.mapTransform)),v.alphaMap&&(g.alphaMap.value=v.alphaMap,e(v.alphaMap,g.alphaMapTransform)),v.bumpMap&&(g.bumpMap.value=v.bumpMap,e(v.bumpMap,g.bumpMapTransform),g.bumpScale.value=v.bumpScale,v.side===Xe&&(g.bumpScale.value*=-1)),v.normalMap&&(g.normalMap.value=v.normalMap,e(v.normalMap,g.normalMapTransform),g.normalScale.value.copy(v.normalScale),v.side===Xe&&g.normalScale.value.negate()),v.displacementMap&&(g.displacementMap.value=v.displacementMap,e(v.displacementMap,g.displacementMapTransform),g.displacementScale.value=v.displacementScale,g.displacementBias.value=v.displacementBias),v.emissiveMap&&(g.emissiveMap.value=v.emissiveMap,e(v.emissiveMap,g.emissiveMapTransform)),v.specularMap&&(g.specularMap.value=v.specularMap,e(v.specularMap,g.specularMapTransform)),v.alphaTest>0&&(g.alphaTest.value=v.alphaTest);const _=t.get(v),M=_.envMap,x=_.envMapRotation;M&&(g.envMap.value=M,hi.copy(x),hi.x*=-1,hi.y*=-1,hi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(hi.y*=-1,hi.z*=-1),g.envMapRotation.value.setFromMatrix4(e0.makeRotationFromEuler(hi)),g.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=v.reflectivity,g.ior.value=v.ior,g.refractionRatio.value=v.refractionRatio),v.lightMap&&(g.lightMap.value=v.lightMap,g.lightMapIntensity.value=v.lightMapIntensity,e(v.lightMap,g.lightMapTransform)),v.aoMap&&(g.aoMap.value=v.aoMap,g.aoMapIntensity.value=v.aoMapIntensity,e(v.aoMap,g.aoMapTransform))}function a(g,v){g.diffuse.value.copy(v.color),g.opacity.value=v.opacity,v.map&&(g.map.value=v.map,e(v.map,g.mapTransform))}function o(g,v){g.dashSize.value=v.dashSize,g.totalSize.value=v.dashSize+v.gapSize,g.scale.value=v.scale}function l(g,v,_,M){g.diffuse.value.copy(v.color),g.opacity.value=v.opacity,g.size.value=v.size*_,g.scale.value=M*.5,v.map&&(g.map.value=v.map,e(v.map,g.uvTransform)),v.alphaMap&&(g.alphaMap.value=v.alphaMap,e(v.alphaMap,g.alphaMapTransform)),v.alphaTest>0&&(g.alphaTest.value=v.alphaTest)}function c(g,v){g.diffuse.value.copy(v.color),g.opacity.value=v.opacity,g.rotation.value=v.rotation,v.map&&(g.map.value=v.map,e(v.map,g.mapTransform)),v.alphaMap&&(g.alphaMap.value=v.alphaMap,e(v.alphaMap,g.alphaMapTransform)),v.alphaTest>0&&(g.alphaTest.value=v.alphaTest)}function h(g,v){g.specular.value.copy(v.specular),g.shininess.value=Math.max(v.shininess,1e-4)}function d(g,v){v.gradientMap&&(g.gradientMap.value=v.gradientMap)}function u(g,v){g.metalness.value=v.metalness,v.metalnessMap&&(g.metalnessMap.value=v.metalnessMap,e(v.metalnessMap,g.metalnessMapTransform)),g.roughness.value=v.roughness,v.roughnessMap&&(g.roughnessMap.value=v.roughnessMap,e(v.roughnessMap,g.roughnessMapTransform)),v.envMap&&(g.envMapIntensity.value=v.envMapIntensity)}function f(g,v,_){g.ior.value=v.ior,v.sheen>0&&(g.sheenColor.value.copy(v.sheenColor).multiplyScalar(v.sheen),g.sheenRoughness.value=v.sheenRoughness,v.sheenColorMap&&(g.sheenColorMap.value=v.sheenColorMap,e(v.sheenColorMap,g.sheenColorMapTransform)),v.sheenRoughnessMap&&(g.sheenRoughnessMap.value=v.sheenRoughnessMap,e(v.sheenRoughnessMap,g.sheenRoughnessMapTransform))),v.clearcoat>0&&(g.clearcoat.value=v.clearcoat,g.clearcoatRoughness.value=v.clearcoatRoughness,v.clearcoatMap&&(g.clearcoatMap.value=v.clearcoatMap,e(v.clearcoatMap,g.clearcoatMapTransform)),v.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=v.clearcoatRoughnessMap,e(v.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),v.clearcoatNormalMap&&(g.clearcoatNormalMap.value=v.clearcoatNormalMap,e(v.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(v.clearcoatNormalScale),v.side===Xe&&g.clearcoatNormalScale.value.negate())),v.dispersion>0&&(g.dispersion.value=v.dispersion),v.iridescence>0&&(g.iridescence.value=v.iridescence,g.iridescenceIOR.value=v.iridescenceIOR,g.iridescenceThicknessMinimum.value=v.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=v.iridescenceThicknessRange[1],v.iridescenceMap&&(g.iridescenceMap.value=v.iridescenceMap,e(v.iridescenceMap,g.iridescenceMapTransform)),v.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=v.iridescenceThicknessMap,e(v.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),v.transmission>0&&(g.transmission.value=v.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),v.transmissionMap&&(g.transmissionMap.value=v.transmissionMap,e(v.transmissionMap,g.transmissionMapTransform)),g.thickness.value=v.thickness,v.thicknessMap&&(g.thicknessMap.value=v.thicknessMap,e(v.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=v.attenuationDistance,g.attenuationColor.value.copy(v.attenuationColor)),v.anisotropy>0&&(g.anisotropyVector.value.set(v.anisotropy*Math.cos(v.anisotropyRotation),v.anisotropy*Math.sin(v.anisotropyRotation)),v.anisotropyMap&&(g.anisotropyMap.value=v.anisotropyMap,e(v.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=v.specularIntensity,g.specularColor.value.copy(v.specularColor),v.specularColorMap&&(g.specularColorMap.value=v.specularColorMap,e(v.specularColorMap,g.specularColorMapTransform)),v.specularIntensityMap&&(g.specularIntensityMap.value=v.specularIntensityMap,e(v.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,v){v.matcap&&(g.matcap.value=v.matcap)}function m(g,v){const _=t.get(v).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function i0(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,M){const x=M.program;n.uniformBlockBinding(_,x)}function c(_,M){let x=s[_.id];x===void 0&&(p(_),x=h(_),s[_.id]=x,_.addEventListener("dispose",g));const D=M.program;n.updateUBOMapping(_,D);const A=t.render.frame;r[_.id]!==A&&(u(_),r[_.id]=A)}function h(_){const M=d();_.__bindingPointIndex=M;const x=i.createBuffer(),D=_.__size,A=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,D,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,x),x}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const M=s[_.id],x=_.uniforms,D=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let A=0,P=x.length;A<P;A++){const I=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,S=I.length;y<S;y++){const C=I[y];if(f(C,A,y,D)===!0){const V=C.__offset,F=Array.isArray(C.value)?C.value:[C.value];let z=0;for(let q=0;q<F.length;q++){const G=F[q],K=m(G);typeof G=="number"||typeof G=="boolean"?(C.__data[0]=G,i.bufferSubData(i.UNIFORM_BUFFER,V+z,C.__data)):G.isMatrix3?(C.__data[0]=G.elements[0],C.__data[1]=G.elements[1],C.__data[2]=G.elements[2],C.__data[3]=0,C.__data[4]=G.elements[3],C.__data[5]=G.elements[4],C.__data[6]=G.elements[5],C.__data[7]=0,C.__data[8]=G.elements[6],C.__data[9]=G.elements[7],C.__data[10]=G.elements[8],C.__data[11]=0):(G.toArray(C.__data,z),z+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,C.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(_,M,x,D){const A=_.value,P=M+"_"+x;if(D[P]===void 0)return typeof A=="number"||typeof A=="boolean"?D[P]=A:D[P]=A.clone(),!0;{const I=D[P];if(typeof A=="number"||typeof A=="boolean"){if(I!==A)return D[P]=A,!0}else if(I.equals(A)===!1)return I.copy(A),!0}return!1}function p(_){const M=_.uniforms;let x=0;const D=16;for(let P=0,I=M.length;P<I;P++){const y=Array.isArray(M[P])?M[P]:[M[P]];for(let S=0,C=y.length;S<C;S++){const V=y[S],F=Array.isArray(V.value)?V.value:[V.value];for(let z=0,q=F.length;z<q;z++){const G=F[z],K=m(G),X=x%D,at=X%K.boundary,ht=X+at;x+=at,ht!==0&&D-ht<K.storage&&(x+=D-ht),V.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=x,x+=K.storage}}}const A=x%D;return A>0&&(x+=D-A),_.__size=x,_.__cache={},this}function m(_){const M={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(M.boundary=4,M.storage=4):_.isVector2?(M.boundary=8,M.storage=8):_.isVector3||_.isColor?(M.boundary=16,M.storage=12):_.isVector4?(M.boundary=16,M.storage=16):_.isMatrix3?(M.boundary=48,M.storage=48):_.isMatrix4?(M.boundary=64,M.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),M}function g(_){const M=_.target;M.removeEventListener("dispose",g);const x=a.indexOf(M.__bindingPointIndex);a.splice(x,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function v(){for(const _ in s)i.deleteBuffer(s[_]);a=[],s={},r={}}return{bind:l,update:c,dispose:v}}class s0{constructor(t={}){const{canvas:e=$d(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reverseDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const p=new Uint32Array(4),m=new Int32Array(4);let g=null,v=null;const _=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=He,this.toneMapping=ei,this.toneMappingExposure=1;const x=this;let D=!1,A=0,P=0,I=null,y=-1,S=null;const C=new le,V=new le;let F=null;const z=new Ht(0);let q=0,G=e.width,K=e.height,X=1,at=null,ht=null;const mt=new le(0,0,G,K),Nt=new le(0,0,G,K);let Jt=!1;const U=new sl;let Z=!1,ut=!1;const Q=new se,Pt=new se,Dt=new L,At=new le,Xt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $=!1;function st(){return I===null?X:1}let R=n;function wt(w,O){return e.getContext(w,O)}try{const w={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${jo}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",Mt,!1),e.addEventListener("webglcontextcreationerror",vt,!1),R===null){const O="webgl2";if(R=wt(O,w),R===null)throw wt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let nt,xt,lt,It,gt,E,b,k,Y,et,J,St,dt,yt,$t,rt,bt,Ut,Ft,Et,Yt,Vt,ce,N;function pt(){nt=new cg(R),nt.init(),Vt=new qv(R,nt),xt=new ig(R,nt,t,Vt),lt=new Xv(R,nt),xt.reverseDepthBuffer&&u&&lt.buffers.depth.setReversed(!0),It=new dg(R),gt=new Lv,E=new jv(R,nt,lt,gt,xt,Vt,It),b=new rg(x),k=new lg(x),Y=new xf(R),ce=new eg(R,Y),et=new hg(R,Y,It,ce),J=new pg(R,et,Y,It),Ft=new fg(R,xt,E),rt=new sg(gt),St=new Rv(x,b,k,nt,xt,ce,rt),dt=new n0(x,gt),yt=new Dv,$t=new Bv(nt),Ut=new tg(x,b,k,lt,J,f,l),bt=new Hv(x,J,xt),N=new i0(R,It,xt,lt),Et=new ng(R,nt,It),Yt=new ug(R,nt,It),It.programs=St.programs,x.capabilities=xt,x.extensions=nt,x.properties=gt,x.renderLists=yt,x.shadowMap=bt,x.state=lt,x.info=It}pt();const j=new t0(x,R);this.xr=j,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const w=nt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=nt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(w){w!==void 0&&(X=w,this.setSize(G,K,!1))},this.getSize=function(w){return w.set(G,K)},this.setSize=function(w,O,H=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=w,K=O,e.width=Math.floor(w*X),e.height=Math.floor(O*X),H===!0&&(e.style.width=w+"px",e.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(G*X,K*X).floor()},this.setDrawingBufferSize=function(w,O,H){G=w,K=O,X=H,e.width=Math.floor(w*H),e.height=Math.floor(O*H),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(C)},this.getViewport=function(w){return w.copy(mt)},this.setViewport=function(w,O,H,W){w.isVector4?mt.set(w.x,w.y,w.z,w.w):mt.set(w,O,H,W),lt.viewport(C.copy(mt).multiplyScalar(X).round())},this.getScissor=function(w){return w.copy(Nt)},this.setScissor=function(w,O,H,W){w.isVector4?Nt.set(w.x,w.y,w.z,w.w):Nt.set(w,O,H,W),lt.scissor(V.copy(Nt).multiplyScalar(X).round())},this.getScissorTest=function(){return Jt},this.setScissorTest=function(w){lt.setScissorTest(Jt=w)},this.setOpaqueSort=function(w){at=w},this.setTransparentSort=function(w){ht=w},this.getClearColor=function(w){return w.copy(Ut.getClearColor())},this.setClearColor=function(){Ut.setClearColor.apply(Ut,arguments)},this.getClearAlpha=function(){return Ut.getClearAlpha()},this.setClearAlpha=function(){Ut.setClearAlpha.apply(Ut,arguments)},this.clear=function(w=!0,O=!0,H=!0){let W=0;if(w){let B=!1;if(I!==null){const ot=I.texture.format;B=ot===Qo||ot===Ko||ot===Zo}if(B){const ot=I.texture.type,_t=ot===On||ot===Mi||ot===Is||ot===es||ot===Yo||ot===Jo,Tt=Ut.getClearColor(),Ct=Ut.getClearAlpha(),Ot=Tt.r,zt=Tt.g,Rt=Tt.b;_t?(p[0]=Ot,p[1]=zt,p[2]=Rt,p[3]=Ct,R.clearBufferuiv(R.COLOR,0,p)):(m[0]=Ot,m[1]=zt,m[2]=Rt,m[3]=Ct,R.clearBufferiv(R.COLOR,0,m))}else W|=R.COLOR_BUFFER_BIT}O&&(W|=R.DEPTH_BUFFER_BIT),H&&(W|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",Mt,!1),e.removeEventListener("webglcontextcreationerror",vt,!1),yt.dispose(),$t.dispose(),gt.dispose(),b.dispose(),k.dispose(),J.dispose(),ce.dispose(),N.dispose(),St.dispose(),j.dispose(),j.removeEventListener("sessionstart",gl),j.removeEventListener("sessionend",vl),si.stop()};function tt(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function Mt(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const w=It.autoReset,O=bt.enabled,H=bt.autoUpdate,W=bt.needsUpdate,B=bt.type;pt(),It.autoReset=w,bt.enabled=O,bt.autoUpdate=H,bt.needsUpdate=W,bt.type=B}function vt(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Bt(w){const O=w.target;O.removeEventListener("dispose",Bt),ve(O)}function ve(w){Ue(w),gt.remove(w)}function Ue(w){const O=gt.get(w).programs;O!==void 0&&(O.forEach(function(H){St.releaseProgram(H)}),w.isShaderMaterial&&St.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,H,W,B,ot){O===null&&(O=Xt);const _t=B.isMesh&&B.matrixWorld.determinant()<0,Tt=Nu(w,O,H,W,B);lt.setMaterial(W,_t);let Ct=H.index,Ot=1;if(W.wireframe===!0){if(Ct=et.getWireframeAttribute(H),Ct===void 0)return;Ot=2}const zt=H.drawRange,Rt=H.attributes.position;let Kt=zt.start*Ot,he=(zt.start+zt.count)*Ot;ot!==null&&(Kt=Math.max(Kt,ot.start*Ot),he=Math.min(he,(ot.start+ot.count)*Ot)),Ct!==null?(Kt=Math.max(Kt,0),he=Math.min(he,Ct.count)):Rt!=null&&(Kt=Math.max(Kt,0),he=Math.min(he,Rt.count));const ue=he-Kt;if(ue<0||ue===1/0)return;ce.setup(B,W,Tt,H,Ct);let Ge,te=Et;if(Ct!==null&&(Ge=Y.get(Ct),te=Yt,te.setIndex(Ge)),B.isMesh)W.wireframe===!0?(lt.setLineWidth(W.wireframeLinewidth*st()),te.setMode(R.LINES)):te.setMode(R.TRIANGLES);else if(B.isLine){let Lt=W.linewidth;Lt===void 0&&(Lt=1),lt.setLineWidth(Lt*st()),B.isLineSegments?te.setMode(R.LINES):B.isLineLoop?te.setMode(R.LINE_LOOP):te.setMode(R.LINE_STRIP)}else B.isPoints?te.setMode(R.POINTS):B.isSprite&&te.setMode(R.TRIANGLES);if(B.isBatchedMesh)if(B._multiDrawInstances!==null)te.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances);else if(nt.get("WEBGL_multi_draw"))te.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Lt=B._multiDrawStarts,wn=B._multiDrawCounts,ee=B._multiDrawCount,en=Ct?Y.get(Ct).bytesPerElement:1,Ti=gt.get(W).currentProgram.getUniforms();for(let $e=0;$e<ee;$e++)Ti.setValue(R,"_gl_DrawID",$e),te.render(Lt[$e]/en,wn[$e])}else if(B.isInstancedMesh)te.renderInstances(Kt,ue,B.count);else if(H.isInstancedBufferGeometry){const Lt=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,wn=Math.min(H.instanceCount,Lt);te.renderInstances(Kt,ue,wn)}else te.render(Kt,ue)};function ne(w,O,H){w.transparent===!0&&w.side===ln&&w.forceSinglePass===!1?(w.side=Xe,w.needsUpdate=!0,Ws(w,O,H),w.side=ii,w.needsUpdate=!0,Ws(w,O,H),w.side=ln):Ws(w,O,H)}this.compile=function(w,O,H=null){H===null&&(H=w),v=$t.get(H),v.init(O),M.push(v),H.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),w!==H&&w.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(v.pushLight(B),B.castShadow&&v.pushShadow(B))}),v.setupLights();const W=new Set;return w.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ot=B.material;if(ot)if(Array.isArray(ot))for(let _t=0;_t<ot.length;_t++){const Tt=ot[_t];ne(Tt,H,B),W.add(Tt)}else ne(ot,H,B),W.add(ot)}),M.pop(),v=null,W},this.compileAsync=function(w,O,H=null){const W=this.compile(w,O,H);return new Promise(B=>{function ot(){if(W.forEach(function(_t){gt.get(_t).currentProgram.isReady()&&W.delete(_t)}),W.size===0){B(w);return}setTimeout(ot,10)}nt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let tn=null;function En(w){tn&&tn(w)}function gl(){si.stop()}function vl(){si.start()}const si=new Jh;si.setAnimationLoop(En),typeof self<"u"&&si.setContext(self),this.setAnimationLoop=function(w){tn=w,j.setAnimationLoop(w),w===null?si.stop():si.start()},j.addEventListener("sessionstart",gl),j.addEventListener("sessionend",vl),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(O),O=j.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,O,I),v=$t.get(w,M.length),v.init(O),M.push(v),Pt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),U.setFromProjectionMatrix(Pt),ut=this.localClippingEnabled,Z=rt.init(this.clippingPlanes,ut),g=yt.get(w,_.length),g.init(),_.push(g),j.enabled===!0&&j.isPresenting===!0){const ot=x.xr.getDepthSensingMesh();ot!==null&&Jr(ot,O,-1/0,x.sortObjects)}Jr(w,O,0,x.sortObjects),g.finish(),x.sortObjects===!0&&g.sort(at,ht),$=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,$&&Ut.addToRenderList(g,w),this.info.render.frame++,Z===!0&&rt.beginShadows();const H=v.state.shadowsArray;bt.render(H,w,O),Z===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=g.opaque,B=g.transmissive;if(v.setupLights(),O.isArrayCamera){const ot=O.cameras;if(B.length>0)for(let _t=0,Tt=ot.length;_t<Tt;_t++){const Ct=ot[_t];xl(W,B,w,Ct)}$&&Ut.render(w);for(let _t=0,Tt=ot.length;_t<Tt;_t++){const Ct=ot[_t];_l(g,w,Ct,Ct.viewport)}}else B.length>0&&xl(W,B,w,O),$&&Ut.render(w),_l(g,w,O);I!==null&&(E.updateMultisampleRenderTarget(I),E.updateRenderTargetMipmap(I)),w.isScene===!0&&w.onAfterRender(x,w,O),ce.resetDefaultState(),y=-1,S=null,M.pop(),M.length>0?(v=M[M.length-1],Z===!0&&rt.setGlobalState(x.clippingPlanes,v.state.camera)):v=null,_.pop(),_.length>0?g=_[_.length-1]:g=null};function Jr(w,O,H,W){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)H=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)v.pushLight(w),w.castShadow&&v.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||U.intersectsSprite(w)){W&&At.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Pt);const _t=J.update(w),Tt=w.material;Tt.visible&&g.push(w,_t,Tt,H,At.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||U.intersectsObject(w))){const _t=J.update(w),Tt=w.material;if(W&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),At.copy(w.boundingSphere.center)):(_t.boundingSphere===null&&_t.computeBoundingSphere(),At.copy(_t.boundingSphere.center)),At.applyMatrix4(w.matrixWorld).applyMatrix4(Pt)),Array.isArray(Tt)){const Ct=_t.groups;for(let Ot=0,zt=Ct.length;Ot<zt;Ot++){const Rt=Ct[Ot],Kt=Tt[Rt.materialIndex];Kt&&Kt.visible&&g.push(w,_t,Kt,H,At.z,Rt)}}else Tt.visible&&g.push(w,_t,Tt,H,At.z,null)}}const ot=w.children;for(let _t=0,Tt=ot.length;_t<Tt;_t++)Jr(ot[_t],O,H,W)}function _l(w,O,H,W){const B=w.opaque,ot=w.transmissive,_t=w.transparent;v.setupLightsView(H),Z===!0&&rt.setGlobalState(x.clippingPlanes,H),W&&lt.viewport(C.copy(W)),B.length>0&&Hs(B,O,H),ot.length>0&&Hs(ot,O,H),_t.length>0&&Hs(_t,O,H),lt.buffers.depth.setTest(!0),lt.buffers.depth.setMask(!0),lt.buffers.color.setMask(!0),lt.setPolygonOffset(!1)}function xl(w,O,H,W){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[W.id]===void 0&&(v.state.transmissionRenderTarget[W.id]=new yi(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float")?zs:On,minFilter:vi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Zt.workingColorSpace}));const ot=v.state.transmissionRenderTarget[W.id],_t=W.viewport||C;ot.setSize(_t.z,_t.w);const Tt=x.getRenderTarget();x.setRenderTarget(ot),x.getClearColor(z),q=x.getClearAlpha(),q<1&&x.setClearColor(16777215,.5),x.clear(),$&&Ut.render(H);const Ct=x.toneMapping;x.toneMapping=ei;const Ot=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),v.setupLightsView(W),Z===!0&&rt.setGlobalState(x.clippingPlanes,W),Hs(w,H,W),E.updateMultisampleRenderTarget(ot),E.updateRenderTargetMipmap(ot),nt.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let Rt=0,Kt=O.length;Rt<Kt;Rt++){const he=O[Rt],ue=he.object,Ge=he.geometry,te=he.material,Lt=he.group;if(te.side===ln&&ue.layers.test(W.layers)){const wn=te.side;te.side=Xe,te.needsUpdate=!0,Ml(ue,H,W,Ge,te,Lt),te.side=wn,te.needsUpdate=!0,zt=!0}}zt===!0&&(E.updateMultisampleRenderTarget(ot),E.updateRenderTargetMipmap(ot))}x.setRenderTarget(Tt),x.setClearColor(z,q),Ot!==void 0&&(W.viewport=Ot),x.toneMapping=Ct}function Hs(w,O,H){const W=O.isScene===!0?O.overrideMaterial:null;for(let B=0,ot=w.length;B<ot;B++){const _t=w[B],Tt=_t.object,Ct=_t.geometry,Ot=W===null?_t.material:W,zt=_t.group;Tt.layers.test(H.layers)&&Ml(Tt,O,H,Ct,Ot,zt)}}function Ml(w,O,H,W,B,ot){w.onBeforeRender(x,O,H,W,B,ot),w.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(x,O,H,W,w,ot),B.transparent===!0&&B.side===ln&&B.forceSinglePass===!1?(B.side=Xe,B.needsUpdate=!0,x.renderBufferDirect(H,O,W,B,w,ot),B.side=ii,B.needsUpdate=!0,x.renderBufferDirect(H,O,W,B,w,ot),B.side=ln):x.renderBufferDirect(H,O,W,B,w,ot),w.onAfterRender(x,O,H,W,B,ot)}function Ws(w,O,H){O.isScene!==!0&&(O=Xt);const W=gt.get(w),B=v.state.lights,ot=v.state.shadowsArray,_t=B.state.version,Tt=St.getParameters(w,B.state,ot,O,H),Ct=St.getProgramCacheKey(Tt);let Ot=W.programs;W.environment=w.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(w.isMeshStandardMaterial?k:b).get(w.envMap||W.environment),W.envMapRotation=W.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Ot===void 0&&(w.addEventListener("dispose",Bt),Ot=new Map,W.programs=Ot);let zt=Ot.get(Ct);if(zt!==void 0){if(W.currentProgram===zt&&W.lightsStateVersion===_t)return Sl(w,Tt),zt}else Tt.uniforms=St.getUniforms(w),w.onBeforeCompile(Tt,x),zt=St.acquireProgram(Tt,Ct),Ot.set(Ct,zt),W.uniforms=Tt.uniforms;const Rt=W.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Rt.clippingPlanes=rt.uniform),Sl(w,Tt),W.needsLights=Ou(w),W.lightsStateVersion=_t,W.needsLights&&(Rt.ambientLightColor.value=B.state.ambient,Rt.lightProbe.value=B.state.probe,Rt.directionalLights.value=B.state.directional,Rt.directionalLightShadows.value=B.state.directionalShadow,Rt.spotLights.value=B.state.spot,Rt.spotLightShadows.value=B.state.spotShadow,Rt.rectAreaLights.value=B.state.rectArea,Rt.ltc_1.value=B.state.rectAreaLTC1,Rt.ltc_2.value=B.state.rectAreaLTC2,Rt.pointLights.value=B.state.point,Rt.pointLightShadows.value=B.state.pointShadow,Rt.hemisphereLights.value=B.state.hemi,Rt.directionalShadowMap.value=B.state.directionalShadowMap,Rt.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Rt.spotShadowMap.value=B.state.spotShadowMap,Rt.spotLightMatrix.value=B.state.spotLightMatrix,Rt.spotLightMap.value=B.state.spotLightMap,Rt.pointShadowMap.value=B.state.pointShadowMap,Rt.pointShadowMatrix.value=B.state.pointShadowMatrix),W.currentProgram=zt,W.uniformsList=null,zt}function yl(w){if(w.uniformsList===null){const O=w.currentProgram.getUniforms();w.uniformsList=Lr.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function Sl(w,O){const H=gt.get(w);H.outputColorSpace=O.outputColorSpace,H.batching=O.batching,H.batchingColor=O.batchingColor,H.instancing=O.instancing,H.instancingColor=O.instancingColor,H.instancingMorph=O.instancingMorph,H.skinning=O.skinning,H.morphTargets=O.morphTargets,H.morphNormals=O.morphNormals,H.morphColors=O.morphColors,H.morphTargetsCount=O.morphTargetsCount,H.numClippingPlanes=O.numClippingPlanes,H.numIntersection=O.numClipIntersection,H.vertexAlphas=O.vertexAlphas,H.vertexTangents=O.vertexTangents,H.toneMapping=O.toneMapping}function Nu(w,O,H,W,B){O.isScene!==!0&&(O=Xt),E.resetTextureUnits();const ot=O.fog,_t=W.isMeshStandardMaterial?O.environment:null,Tt=I===null?x.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:as,Ct=(W.isMeshStandardMaterial?k:b).get(W.envMap||_t),Ot=W.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,zt=!!H.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Rt=!!H.morphAttributes.position,Kt=!!H.morphAttributes.normal,he=!!H.morphAttributes.color;let ue=ei;W.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(ue=x.toneMapping);const Ge=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,te=Ge!==void 0?Ge.length:0,Lt=gt.get(W),wn=v.state.lights;if(Z===!0&&(ut===!0||w!==S)){const Je=w===S&&W.id===y;rt.setState(W,w,Je)}let ee=!1;W.version===Lt.__version?(Lt.needsLights&&Lt.lightsStateVersion!==wn.state.version||Lt.outputColorSpace!==Tt||B.isBatchedMesh&&Lt.batching===!1||!B.isBatchedMesh&&Lt.batching===!0||B.isBatchedMesh&&Lt.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Lt.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Lt.instancing===!1||!B.isInstancedMesh&&Lt.instancing===!0||B.isSkinnedMesh&&Lt.skinning===!1||!B.isSkinnedMesh&&Lt.skinning===!0||B.isInstancedMesh&&Lt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Lt.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Lt.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Lt.instancingMorph===!1&&B.morphTexture!==null||Lt.envMap!==Ct||W.fog===!0&&Lt.fog!==ot||Lt.numClippingPlanes!==void 0&&(Lt.numClippingPlanes!==rt.numPlanes||Lt.numIntersection!==rt.numIntersection)||Lt.vertexAlphas!==Ot||Lt.vertexTangents!==zt||Lt.morphTargets!==Rt||Lt.morphNormals!==Kt||Lt.morphColors!==he||Lt.toneMapping!==ue||Lt.morphTargetsCount!==te)&&(ee=!0):(ee=!0,Lt.__version=W.version);let en=Lt.currentProgram;ee===!0&&(en=Ws(W,O,B));let Ti=!1,$e=!1,us=!1;const de=en.getUniforms(),pn=Lt.uniforms;if(lt.useProgram(en.program)&&(Ti=!0,$e=!0,us=!0),W.id!==y&&(y=W.id,$e=!0),Ti||S!==w){lt.buffers.depth.getReversed()?(Q.copy(w.projectionMatrix),qd(Q),Yd(Q),de.setValue(R,"projectionMatrix",Q)):de.setValue(R,"projectionMatrix",w.projectionMatrix),de.setValue(R,"viewMatrix",w.matrixWorldInverse);const Gn=de.map.cameraPosition;Gn!==void 0&&Gn.setValue(R,Dt.setFromMatrixPosition(w.matrixWorld)),xt.logarithmicDepthBuffer&&de.setValue(R,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&de.setValue(R,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,$e=!0,us=!0)}if(B.isSkinnedMesh){de.setOptional(R,B,"bindMatrix"),de.setOptional(R,B,"bindMatrixInverse");const Je=B.skeleton;Je&&(Je.boneTexture===null&&Je.computeBoneTexture(),de.setValue(R,"boneTexture",Je.boneTexture,E))}B.isBatchedMesh&&(de.setOptional(R,B,"batchingTexture"),de.setValue(R,"batchingTexture",B._matricesTexture,E),de.setOptional(R,B,"batchingIdTexture"),de.setValue(R,"batchingIdTexture",B._indirectTexture,E),de.setOptional(R,B,"batchingColorTexture"),B._colorsTexture!==null&&de.setValue(R,"batchingColorTexture",B._colorsTexture,E));const ds=H.morphAttributes;if((ds.position!==void 0||ds.normal!==void 0||ds.color!==void 0)&&Ft.update(B,H,en),($e||Lt.receiveShadow!==B.receiveShadow)&&(Lt.receiveShadow=B.receiveShadow,de.setValue(R,"receiveShadow",B.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(pn.envMap.value=Ct,pn.flipEnvMap.value=Ct.isCubeTexture&&Ct.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(pn.envMapIntensity.value=O.environmentIntensity),$e&&(de.setValue(R,"toneMappingExposure",x.toneMappingExposure),Lt.needsLights&&Fu(pn,us),ot&&W.fog===!0&&dt.refreshFogUniforms(pn,ot),dt.refreshMaterialUniforms(pn,W,X,K,v.state.transmissionRenderTarget[w.id]),Lr.upload(R,yl(Lt),pn,E)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Lr.upload(R,yl(Lt),pn,E),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&de.setValue(R,"center",B.center),de.setValue(R,"modelViewMatrix",B.modelViewMatrix),de.setValue(R,"normalMatrix",B.normalMatrix),de.setValue(R,"modelMatrix",B.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Je=W.uniformsGroups;for(let Gn=0,Hn=Je.length;Gn<Hn;Gn++){const bl=Je[Gn];N.update(bl,en),N.bind(bl,en)}}return en}function Fu(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function Ou(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(w,O,H){gt.get(w.texture).__webglTexture=O,gt.get(w.depthTexture).__webglTexture=H;const W=gt.get(w);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=H===void 0,W.__autoAllocateDepthBuffer||nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,O){const H=gt.get(w);H.__webglFramebuffer=O,H.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(w,O=0,H=0){I=w,A=O,P=H;let W=!0,B=null,ot=!1,_t=!1;if(w){const Ct=gt.get(w);if(Ct.__useDefaultFramebuffer!==void 0)lt.bindFramebuffer(R.FRAMEBUFFER,null),W=!1;else if(Ct.__webglFramebuffer===void 0)E.setupRenderTarget(w);else if(Ct.__hasExternalTextures)E.rebindTextures(w,gt.get(w.texture).__webglTexture,gt.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const Rt=w.depthTexture;if(Ct.__boundDepthTexture!==Rt){if(Rt!==null&&gt.has(Rt)&&(w.width!==Rt.image.width||w.height!==Rt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(w)}}const Ot=w.texture;(Ot.isData3DTexture||Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)&&(_t=!0);const zt=gt.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(zt[O])?B=zt[O][H]:B=zt[O],ot=!0):w.samples>0&&E.useMultisampledRTT(w)===!1?B=gt.get(w).__webglMultisampledFramebuffer:Array.isArray(zt)?B=zt[H]:B=zt,C.copy(w.viewport),V.copy(w.scissor),F=w.scissorTest}else C.copy(mt).multiplyScalar(X).floor(),V.copy(Nt).multiplyScalar(X).floor(),F=Jt;if(lt.bindFramebuffer(R.FRAMEBUFFER,B)&&W&&lt.drawBuffers(w,B),lt.viewport(C),lt.scissor(V),lt.setScissorTest(F),ot){const Ct=gt.get(w.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+O,Ct.__webglTexture,H)}else if(_t){const Ct=gt.get(w.texture),Ot=O||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,Ct.__webglTexture,H||0,Ot)}y=-1},this.readRenderTargetPixels=function(w,O,H,W,B,ot,_t){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=gt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&_t!==void 0&&(Tt=Tt[_t]),Tt){lt.bindFramebuffer(R.FRAMEBUFFER,Tt);try{const Ct=w.texture,Ot=Ct.format,zt=Ct.type;if(!xt.textureFormatReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!xt.textureTypeReadable(zt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-W&&H>=0&&H<=w.height-B&&R.readPixels(O,H,W,B,Vt.convert(Ot),Vt.convert(zt),ot)}finally{const Ct=I!==null?gt.get(I).__webglFramebuffer:null;lt.bindFramebuffer(R.FRAMEBUFFER,Ct)}}},this.readRenderTargetPixelsAsync=async function(w,O,H,W,B,ot,_t){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=gt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&_t!==void 0&&(Tt=Tt[_t]),Tt){const Ct=w.texture,Ot=Ct.format,zt=Ct.type;if(!xt.textureFormatReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!xt.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=w.width-W&&H>=0&&H<=w.height-B){lt.bindFramebuffer(R.FRAMEBUFFER,Tt);const Rt=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Rt),R.bufferData(R.PIXEL_PACK_BUFFER,ot.byteLength,R.STREAM_READ),R.readPixels(O,H,W,B,Vt.convert(Ot),Vt.convert(zt),0);const Kt=I!==null?gt.get(I).__webglFramebuffer:null;lt.bindFramebuffer(R.FRAMEBUFFER,Kt);const he=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await jd(R,he,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Rt),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,ot),R.deleteBuffer(Rt),R.deleteSync(he),ot}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,O=null,H=0){w.isTexture!==!0&&(xs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,w=arguments[1]);const W=Math.pow(2,-H),B=Math.floor(w.image.width*W),ot=Math.floor(w.image.height*W),_t=O!==null?O.x:0,Tt=O!==null?O.y:0;E.setTexture2D(w,0),R.copyTexSubImage2D(R.TEXTURE_2D,H,0,0,_t,Tt,B,ot),lt.unbindTexture()},this.copyTextureToTexture=function(w,O,H=null,W=null,B=0){w.isTexture!==!0&&(xs("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,w=arguments[1],O=arguments[2],B=arguments[3]||0,H=null);let ot,_t,Tt,Ct,Ot,zt,Rt,Kt,he;const ue=w.isCompressedTexture?w.mipmaps[B]:w.image;H!==null?(ot=H.max.x-H.min.x,_t=H.max.y-H.min.y,Tt=H.isBox3?H.max.z-H.min.z:1,Ct=H.min.x,Ot=H.min.y,zt=H.isBox3?H.min.z:0):(ot=ue.width,_t=ue.height,Tt=ue.depth||1,Ct=0,Ot=0,zt=0),W!==null?(Rt=W.x,Kt=W.y,he=W.z):(Rt=0,Kt=0,he=0);const Ge=Vt.convert(O.format),te=Vt.convert(O.type);let Lt;O.isData3DTexture?(E.setTexture3D(O,0),Lt=R.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(E.setTexture2DArray(O,0),Lt=R.TEXTURE_2D_ARRAY):(E.setTexture2D(O,0),Lt=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,O.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,O.unpackAlignment);const wn=R.getParameter(R.UNPACK_ROW_LENGTH),ee=R.getParameter(R.UNPACK_IMAGE_HEIGHT),en=R.getParameter(R.UNPACK_SKIP_PIXELS),Ti=R.getParameter(R.UNPACK_SKIP_ROWS),$e=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,ue.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ue.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ct),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ot),R.pixelStorei(R.UNPACK_SKIP_IMAGES,zt);const us=w.isDataArrayTexture||w.isData3DTexture,de=O.isDataArrayTexture||O.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const pn=gt.get(w),ds=gt.get(O),Je=gt.get(pn.__renderTarget),Gn=gt.get(ds.__renderTarget);lt.bindFramebuffer(R.READ_FRAMEBUFFER,Je.__webglFramebuffer),lt.bindFramebuffer(R.DRAW_FRAMEBUFFER,Gn.__webglFramebuffer);for(let Hn=0;Hn<Tt;Hn++)us&&R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,gt.get(w).__webglTexture,B,zt+Hn),w.isDepthTexture?(de&&R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,gt.get(O).__webglTexture,B,he+Hn),R.blitFramebuffer(Ct,Ot,ot,_t,Rt,Kt,ot,_t,R.DEPTH_BUFFER_BIT,R.NEAREST)):de?R.copyTexSubImage3D(Lt,B,Rt,Kt,he+Hn,Ct,Ot,ot,_t):R.copyTexSubImage2D(Lt,B,Rt,Kt,he+Hn,Ct,Ot,ot,_t);lt.bindFramebuffer(R.READ_FRAMEBUFFER,null),lt.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else de?w.isDataTexture||w.isData3DTexture?R.texSubImage3D(Lt,B,Rt,Kt,he,ot,_t,Tt,Ge,te,ue.data):O.isCompressedArrayTexture?R.compressedTexSubImage3D(Lt,B,Rt,Kt,he,ot,_t,Tt,Ge,ue.data):R.texSubImage3D(Lt,B,Rt,Kt,he,ot,_t,Tt,Ge,te,ue):w.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,B,Rt,Kt,ot,_t,Ge,te,ue.data):w.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,B,Rt,Kt,ue.width,ue.height,Ge,ue.data):R.texSubImage2D(R.TEXTURE_2D,B,Rt,Kt,ot,_t,Ge,te,ue);R.pixelStorei(R.UNPACK_ROW_LENGTH,wn),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ee),R.pixelStorei(R.UNPACK_SKIP_PIXELS,en),R.pixelStorei(R.UNPACK_SKIP_ROWS,Ti),R.pixelStorei(R.UNPACK_SKIP_IMAGES,$e),B===0&&O.generateMipmaps&&R.generateMipmap(Lt),lt.unbindTexture()},this.copyTextureToTexture3D=function(w,O,H=null,W=null,B=0){return w.isTexture!==!0&&(xs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,W=arguments[1]||null,w=arguments[2],O=arguments[3],B=arguments[4]||0),xs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,O,H,W,B)},this.initRenderTarget=function(w){gt.get(w).__webglFramebuffer===void 0&&E.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?E.setTextureCube(w,0):w.isData3DTexture?E.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?E.setTexture2DArray(w,0):E.setTexture2D(w,0),lt.unbindTexture()},this.resetState=function(){A=0,P=0,I=null,lt.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Nn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Zt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Zt._getUnpackColorSpace()}}class r0 extends Me{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class a0{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Po,this.updateRanges=[],this.version=0,this.uuid=Mn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Oe=new L;class Qn{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyMatrix4(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.applyNormalMatrix(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Oe.fromBufferAttribute(this,e),Oe.transformDirection(t),this.setXYZ(e,Oe.x,Oe.y,Oe.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=cn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ie(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ie(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=cn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=cn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=cn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=cn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=ie(e,this.array),n=ie(n,this.array),s=ie(s,this.array),r=ie(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new fn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Qn(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Pr extends ls{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Ht(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ec=new se,Io=new el,dr=new Ai,fr=new L;class Aa extends Me{constructor(t=new Ce,e=new Pr){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(s),dr.radius+=r,t.ray.intersectsSphere(dr)===!1)return;Ec.copy(s).invert(),Io.copy(t.ray).applyMatrix4(Ec);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,d=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=u,m=f;p<m;p++){const g=c.getX(p);fr.fromBufferAttribute(d,g),wc(fr,g,l,s,t,e,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,m=f;p<m;p++)fr.fromBufferAttribute(d,p),wc(fr,p,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function wc(i,t,e,n,s,r,a){const o=Io.distanceSqToPoint(i);if(o<e){const l=new L;Io.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class nu extends Ve{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class bn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,f=(a-h)/u;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ft:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new L,s=[],r=[],a=[],o=new L,l=new se;for(let f=0;f<=t;f++){const p=f/t;s[f]=this.getTangentAt(p,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Te(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Te(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],f*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ol extends bn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ft){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class o0 extends ol{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ll(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,d){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,s(a,o,u,f)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const pr=new L,Ta=new ll,Ca=new ll,Ra=new ll;class l0 extends bn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new L){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(pr.subVectors(s[0],s[1]).add(s[0]),c=pr);const d=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(pr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=pr),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f),g=Math.pow(u.distanceToSquared(h),f);m<1e-4&&(m=1),p<1e-4&&(p=m),g<1e-4&&(g=m),Ta.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,m,g),Ca.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,m,g),Ra.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,m,g)}else this.curveType==="catmullrom"&&(Ta.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),Ca.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Ra.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(Ta.calc(l),Ca.calc(l),Ra.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new L().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Ac(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function c0(i,t){const e=1-i;return e*e*t}function h0(i,t){return 2*(1-i)*i*t}function u0(i,t){return i*i*t}function As(i,t,e,n){return c0(i,t)+h0(i,e)+u0(i,n)}function d0(i,t){const e=1-i;return e*e*e*t}function f0(i,t){const e=1-i;return 3*e*e*i*t}function p0(i,t){return 3*(1-i)*i*i*t}function m0(i,t){return i*i*i*t}function Ts(i,t,e,n,s){return d0(i,t)+f0(i,e)+p0(i,n)+m0(i,s)}class iu extends bn{constructor(t=new ft,e=new ft,n=new ft,s=new ft){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ts(t,s.x,r.x,a.x,o.x),Ts(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class g0 extends bn{constructor(t=new L,e=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new L){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ts(t,s.x,r.x,a.x,o.x),Ts(t,s.y,r.y,a.y,o.y),Ts(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class su extends bn{constructor(t=new ft,e=new ft){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ft){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ft){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class v0 extends bn{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ru extends bn{constructor(t=new ft,e=new ft,n=new ft){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ft){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(As(t,s.x,r.x,a.x),As(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class _0 extends bn{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(As(t,s.x,r.x,a.x),As(t,s.y,r.y,a.y),As(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class au extends bn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ft){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return n.set(Ac(o,l.x,c.x,h.x,d.x),Ac(o,l.y,c.y,h.y,d.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ft().fromArray(s))}return this}}var Uo=Object.freeze({__proto__:null,ArcCurve:o0,CatmullRomCurve3:l0,CubicBezierCurve:iu,CubicBezierCurve3:g0,EllipseCurve:ol,LineCurve:su,LineCurve3:v0,QuadraticBezierCurve:ru,QuadraticBezierCurve3:_0,SplineCurve:au});class x0 extends bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Uo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Uo[s.type]().fromJSON(s))}return this}}class zr extends x0{constructor(t){super(),this.type="Path",this.currentPoint=new ft,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new su(this.currentPoint.clone(),new ft(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new ru(this.currentPoint.clone(),new ft(t,e),new ft(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new iu(this.currentPoint.clone(),new ft(t,e),new ft(n,s),new ft(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new au(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new ol(t,e,n,s,r,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class cl extends Ce{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],f=[];let p=0;const m=[],g=n/2;let v=0;_(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(u,3)),this.setAttribute("uv",new fe(f,2));function _(){const x=new L,D=new L;let A=0;const P=(e-t)/n;for(let I=0;I<=r;I++){const y=[],S=I/r,C=S*(e-t)+t;for(let V=0;V<=s;V++){const F=V/s,z=F*l+o,q=Math.sin(z),G=Math.cos(z);D.x=C*q,D.y=-S*n+g,D.z=C*G,d.push(D.x,D.y,D.z),x.set(q,P,G).normalize(),u.push(x.x,x.y,x.z),f.push(F,1-S),y.push(p++)}m.push(y)}for(let I=0;I<s;I++)for(let y=0;y<r;y++){const S=m[y][I],C=m[y+1][I],V=m[y+1][I+1],F=m[y][I+1];(t>0||y!==0)&&(h.push(S,C,F),A+=3),(e>0||y!==r-1)&&(h.push(C,V,F),A+=3)}c.addGroup(v,A,0),v+=A}function M(x){const D=p,A=new ft,P=new L;let I=0;const y=x===!0?t:e,S=x===!0?1:-1;for(let V=1;V<=s;V++)d.push(0,g*S,0),u.push(0,S,0),f.push(.5,.5),p++;const C=p;for(let V=0;V<=s;V++){const z=V/s*l+o,q=Math.cos(z),G=Math.sin(z);P.x=y*G,P.y=g*S,P.z=y*q,d.push(P.x,P.y,P.z),u.push(0,S,0),A.x=q*.5+.5,A.y=G*.5*S+.5,f.push(A.x,A.y),p++}for(let V=0;V<s;V++){const F=D+V,z=C+V;x===!0?h.push(z,z+1,F):h.push(z+1,z,F),I+=3}c.addGroup(v,I,x===!0?1:2),v+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cl(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Cs extends cl{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Cs(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Jn extends zr{constructor(t){super(t),this.uuid=Mn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new zr().fromJSON(s))}return this}}const M0={triangulate:function(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=ou(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c,h,d,u,f;if(n&&(r=w0(i,t,r,e)),i.length>80*e){o=c=i[0],l=h=i[1];for(let p=e;p<s;p+=e)d=i[p],u=i[p+1],d<o&&(o=d),u<l&&(l=u),d>c&&(c=d),u>h&&(h=u);f=Math.max(c-o,h-l),f=f!==0?32767/f:0}return Ns(r,a,e,o,l,f,0),a}};function ou(i,t,e,n,s){let r,a;if(s===F0(i,t,e,n)>0)for(r=t;r<e;r+=n)a=Tc(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=Tc(r,i[r],i[r+1],a);return a&&jr(a,a.next)&&(Os(a),a=a.next),a}function Si(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(jr(e,e.next)||ge(e.prev,e,e.next)===0)){if(Os(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ns(i,t,e,n,s,r,a){if(!i)return;!a&&r&&L0(i,n,s,r);let o=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?S0(i,n,s,r):y0(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(c.i/e|0),Os(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=b0(Si(i),t,e),Ns(i,t,e,n,s,r,2)):a===2&&E0(i,t,e,n,s,r):Ns(Si(i),t,e,n,s,r,1);break}}}function y0(i){const t=i.prev,e=i,n=i.next;if(ge(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=s<r?s<a?s:a:r<a?r:a,d=o<l?o<c?o:c:l<c?l:c,u=s>r?s>a?s:a:r>a?r:a,f=o>l?o>c?o:c:l>c?l:c;let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&qi(s,o,r,l,a,c,p.x,p.y)&&ge(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function S0(i,t,e,n){const s=i.prev,r=i,a=i.next;if(ge(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,d=r.y,u=a.y,f=o<l?o<c?o:c:l<c?l:c,p=h<d?h<u?h:u:d<u?d:u,m=o>l?o>c?o:c:l>c?l:c,g=h>d?h>u?h:u:d>u?d:u,v=No(f,p,t,e,n),_=No(m,g,t,e,n);let M=i.prevZ,x=i.nextZ;for(;M&&M.z>=v&&x&&x.z<=_;){if(M.x>=f&&M.x<=m&&M.y>=p&&M.y<=g&&M!==s&&M!==a&&qi(o,h,l,d,c,u,M.x,M.y)&&ge(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=f&&x.x<=m&&x.y>=p&&x.y<=g&&x!==s&&x!==a&&qi(o,h,l,d,c,u,x.x,x.y)&&ge(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=v;){if(M.x>=f&&M.x<=m&&M.y>=p&&M.y<=g&&M!==s&&M!==a&&qi(o,h,l,d,c,u,M.x,M.y)&&ge(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=_;){if(x.x>=f&&x.x<=m&&x.y>=p&&x.y<=g&&x!==s&&x!==a&&qi(o,h,l,d,c,u,x.x,x.y)&&ge(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function b0(i,t,e){let n=i;do{const s=n.prev,r=n.next.next;!jr(s,r)&&lu(s,n,n.next,r)&&Fs(s,r)&&Fs(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Os(n),Os(n.next),n=i=r),n=n.next}while(n!==i);return Si(n)}function E0(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&I0(a,o)){let l=cu(a,o);a=Si(a,a.next),l=Si(l,l.next),Ns(a,t,e,n,s,r,0),Ns(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function w0(i,t,e,n){const s=[];let r,a,o,l,c;for(r=0,a=t.length;r<a;r++)o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=ou(i,o,l,n,!1),c===c.next&&(c.steiner=!0),s.push(D0(c));for(s.sort(A0),r=0;r<s.length;r++)e=T0(s[r],e);return e}function A0(i,t){return i.x-t.x}function T0(i,t){const e=C0(i,t);if(!e)return t;const n=cu(e,i);return Si(n,n.next),Si(e,e.next)}function C0(i,t){let e=t,n=-1/0,s;const r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const u=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=r&&u>n&&(n=u,s=e.x<e.next.x?e:e.next,u===r))return s}e=e.next}while(e!==t);if(!s)return null;const o=s,l=s.x,c=s.y;let h=1/0,d;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&qi(a<c?r:n,a,l,c,a<c?n:r,a,e.x,e.y)&&(d=Math.abs(a-e.y)/(r-e.x),Fs(e,i)&&(d<h||d===h&&(e.x>s.x||e.x===s.x&&R0(s,e)))&&(s=e,h=d)),e=e.next;while(e!==o);return s}function R0(i,t){return ge(i.prev,i,t.prev)<0&&ge(t.next,i,i.next)<0}function L0(i,t,e,n){let s=i;do s.z===0&&(s.z=No(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,P0(s)}function P0(i){let t,e,n,s,r,a,o,l,c=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<c&&(o++,n=n.nextZ,!!n);t++);for(l=c;o>0||l>0&&n;)o!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,c*=2}while(a>1);return i}function No(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function D0(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function qi(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function I0(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!U0(i,t)&&(Fs(i,t)&&Fs(t,i)&&N0(i,t)&&(ge(i.prev,i,t.prev)||ge(i,t.prev,t))||jr(i,t)&&ge(i.prev,i,i.next)>0&&ge(t.prev,t,t.next)>0)}function ge(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function jr(i,t){return i.x===t.x&&i.y===t.y}function lu(i,t,e,n){const s=gr(ge(i,t,e)),r=gr(ge(i,t,n)),a=gr(ge(e,n,i)),o=gr(ge(e,n,t));return!!(s!==r&&a!==o||s===0&&mr(i,e,t)||r===0&&mr(i,n,t)||a===0&&mr(e,i,n)||o===0&&mr(e,t,n))}function mr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function gr(i){return i>0?1:i<0?-1:0}function U0(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&lu(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Fs(i,t){return ge(i.prev,i,i.next)<0?ge(i,t,i.next)>=0&&ge(i,i.prev,t)>=0:ge(i,t,i.prev)<0||ge(i,i.next,t)<0}function N0(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function cu(i,t){const e=new Fo(i.i,i.x,i.y),n=new Fo(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Tc(i,t,e,n){const s=new Fo(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Os(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Fo(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function F0(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Rs{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Rs.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Cc(t),Rc(n,t);let a=t.length;e.forEach(Cc);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Rc(n,e[l]);const o=M0.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Cc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Rc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class hl extends Ce{constructor(t=new Jn([new ft(.5,.5),new ft(-.5,.5),new ft(-.5,-.5),new ft(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new fe(s,3)),this.setAttribute("uv",new fe(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,m=e.bevelOffset!==void 0?e.bevelOffset:0,g=e.bevelSegments!==void 0?e.bevelSegments:3;const v=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:O0;let M,x=!1,D,A,P,I;v&&(M=v.getSpacedPoints(h),x=!0,u=!1,D=v.computeFrenetFrames(h,!1),A=new L,P=new L,I=new L),u||(g=0,f=0,p=0,m=0);const y=o.extractPoints(c);let S=y.shape;const C=y.holes;if(!Rs.isClockWise(S)){S=S.reverse();for(let $=0,st=C.length;$<st;$++){const R=C[$];Rs.isClockWise(R)&&(C[$]=R.reverse())}}const F=Rs.triangulateShape(S,C),z=S;for(let $=0,st=C.length;$<st;$++){const R=C[$];S=S.concat(R)}function q($,st,R){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),$.clone().addScaledVector(st,R)}const G=S.length,K=F.length;function X($,st,R){let wt,nt,xt;const lt=$.x-st.x,It=$.y-st.y,gt=R.x-$.x,E=R.y-$.y,b=lt*lt+It*It,k=lt*E-It*gt;if(Math.abs(k)>Number.EPSILON){const Y=Math.sqrt(b),et=Math.sqrt(gt*gt+E*E),J=st.x-It/Y,St=st.y+lt/Y,dt=R.x-E/et,yt=R.y+gt/et,$t=((dt-J)*E-(yt-St)*gt)/(lt*E-It*gt);wt=J+lt*$t-$.x,nt=St+It*$t-$.y;const rt=wt*wt+nt*nt;if(rt<=2)return new ft(wt,nt);xt=Math.sqrt(rt/2)}else{let Y=!1;lt>Number.EPSILON?gt>Number.EPSILON&&(Y=!0):lt<-Number.EPSILON?gt<-Number.EPSILON&&(Y=!0):Math.sign(It)===Math.sign(E)&&(Y=!0),Y?(wt=-It,nt=lt,xt=Math.sqrt(b)):(wt=lt,nt=It,xt=Math.sqrt(b/2))}return new ft(wt/xt,nt/xt)}const at=[];for(let $=0,st=z.length,R=st-1,wt=$+1;$<st;$++,R++,wt++)R===st&&(R=0),wt===st&&(wt=0),at[$]=X(z[$],z[R],z[wt]);const ht=[];let mt,Nt=at.concat();for(let $=0,st=C.length;$<st;$++){const R=C[$];mt=[];for(let wt=0,nt=R.length,xt=nt-1,lt=wt+1;wt<nt;wt++,xt++,lt++)xt===nt&&(xt=0),lt===nt&&(lt=0),mt[wt]=X(R[wt],R[xt],R[lt]);ht.push(mt),Nt=Nt.concat(mt)}for(let $=0;$<g;$++){const st=$/g,R=f*Math.cos(st*Math.PI/2),wt=p*Math.sin(st*Math.PI/2)+m;for(let nt=0,xt=z.length;nt<xt;nt++){const lt=q(z[nt],at[nt],wt);Q(lt.x,lt.y,-R)}for(let nt=0,xt=C.length;nt<xt;nt++){const lt=C[nt];mt=ht[nt];for(let It=0,gt=lt.length;It<gt;It++){const E=q(lt[It],mt[It],wt);Q(E.x,E.y,-R)}}}const Jt=p+m;for(let $=0;$<G;$++){const st=u?q(S[$],Nt[$],Jt):S[$];x?(P.copy(D.normals[0]).multiplyScalar(st.x),A.copy(D.binormals[0]).multiplyScalar(st.y),I.copy(M[0]).add(P).add(A),Q(I.x,I.y,I.z)):Q(st.x,st.y,0)}for(let $=1;$<=h;$++)for(let st=0;st<G;st++){const R=u?q(S[st],Nt[st],Jt):S[st];x?(P.copy(D.normals[$]).multiplyScalar(R.x),A.copy(D.binormals[$]).multiplyScalar(R.y),I.copy(M[$]).add(P).add(A),Q(I.x,I.y,I.z)):Q(R.x,R.y,d/h*$)}for(let $=g-1;$>=0;$--){const st=$/g,R=f*Math.cos(st*Math.PI/2),wt=p*Math.sin(st*Math.PI/2)+m;for(let nt=0,xt=z.length;nt<xt;nt++){const lt=q(z[nt],at[nt],wt);Q(lt.x,lt.y,d+R)}for(let nt=0,xt=C.length;nt<xt;nt++){const lt=C[nt];mt=ht[nt];for(let It=0,gt=lt.length;It<gt;It++){const E=q(lt[It],mt[It],wt);x?Q(E.x,E.y+M[h-1].y,M[h-1].x+R):Q(E.x,E.y,d+R)}}}U(),Z();function U(){const $=s.length/3;if(u){let st=0,R=G*st;for(let wt=0;wt<K;wt++){const nt=F[wt];Pt(nt[2]+R,nt[1]+R,nt[0]+R)}st=h+g*2,R=G*st;for(let wt=0;wt<K;wt++){const nt=F[wt];Pt(nt[0]+R,nt[1]+R,nt[2]+R)}}else{for(let st=0;st<K;st++){const R=F[st];Pt(R[2],R[1],R[0])}for(let st=0;st<K;st++){const R=F[st];Pt(R[0]+G*h,R[1]+G*h,R[2]+G*h)}}n.addGroup($,s.length/3-$,0)}function Z(){const $=s.length/3;let st=0;ut(z,st),st+=z.length;for(let R=0,wt=C.length;R<wt;R++){const nt=C[R];ut(nt,st),st+=nt.length}n.addGroup($,s.length/3-$,1)}function ut($,st){let R=$.length;for(;--R>=0;){const wt=R;let nt=R-1;nt<0&&(nt=$.length-1);for(let xt=0,lt=h+g*2;xt<lt;xt++){const It=G*xt,gt=G*(xt+1),E=st+wt+It,b=st+nt+It,k=st+nt+gt,Y=st+wt+gt;Dt(E,b,k,Y)}}}function Q($,st,R){l.push($),l.push(st),l.push(R)}function Pt($,st,R){At($),At(st),At(R);const wt=s.length/3,nt=_.generateTopUV(n,s,wt-3,wt-2,wt-1);Xt(nt[0]),Xt(nt[1]),Xt(nt[2])}function Dt($,st,R,wt){At($),At(st),At(wt),At(st),At(R),At(wt);const nt=s.length/3,xt=_.generateSideWallUV(n,s,nt-6,nt-3,nt-2,nt-1);Xt(xt[0]),Xt(xt[1]),Xt(xt[3]),Xt(xt[1]),Xt(xt[2]),Xt(xt[3])}function At($){s.push(l[$*3+0]),s.push(l[$*3+1]),s.push(l[$*3+2])}function Xt($){r.push($.x),r.push($.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return B0(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Uo[s.type]().fromJSON(s)),new hl(n,t.options)}}const O0={generateTopUV:function(i,t,e,n,s){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new ft(r,a),new ft(o,l),new ft(c,h)]},generateSideWallUV:function(i,t,e,n,s,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],d=t[n*3+2],u=t[s*3],f=t[s*3+1],p=t[s*3+2],m=t[r*3],g=t[r*3+1],v=t[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ft(a,1-l),new ft(c,1-d),new ft(u,1-p),new ft(m,1-v)]:[new ft(o,1-l),new ft(h,1-d),new ft(f,1-p),new ft(g,1-v)]}};function B0(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class ul extends Ce{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new L,u=new L,f=[],p=[],m=[],g=[];for(let v=0;v<=n;v++){const _=[],M=v/n;let x=0;v===0&&a===0?x=.5/e:v===n&&l===Math.PI&&(x=-.5/e);for(let D=0;D<=e;D++){const A=D/e;d.x=-t*Math.cos(s+A*r)*Math.sin(a+M*o),d.y=t*Math.cos(a+M*o),d.z=t*Math.sin(s+A*r)*Math.sin(a+M*o),p.push(d.x,d.y,d.z),u.copy(d).normalize(),m.push(u.x,u.y,u.z),g.push(A+x,1-M),_.push(c++)}h.push(_)}for(let v=0;v<n;v++)for(let _=0;_<e;_++){const M=h[v][_+1],x=h[v][_],D=h[v+1][_],A=h[v+1][_+1];(v!==0||a>0)&&f.push(M,x,A),(v!==n-1||l<Math.PI)&&f.push(x,D,A)}this.setIndex(f),this.setAttribute("position",new fe(p,3)),this.setAttribute("normal",new fe(m,3)),this.setAttribute("uv",new fe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ul(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class z0 extends Ce{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],n=new Set,s=new L,r=new L;if(t.index!==null){const a=t.attributes.position,o=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let p=u,m=u+f;p<m;p+=3)for(let g=0;g<3;g++){const v=o.getX(p+g),_=o.getX(p+(g+1)%3);s.fromBufferAttribute(a,v),r.fromBufferAttribute(a,_),Lc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{const a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,d=3*o+(c+1)%3;s.fromBufferAttribute(a,h),r.fromBufferAttribute(a,d),Lc(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new fe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Lc(i,t,e){const n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}class Pc extends ls{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Ht(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ht(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zh,this.normalScale=new ft(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class hu extends Me{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ht(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class k0 extends hu{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Me.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ht(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const La=new se,Dc=new L,Ic=new L;class V0{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ft(512,512),this.map=null,this.mapPass=null,this.matrix=new se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new sl,this._frameExtents=new ft(1,1),this._viewportCount=1,this._viewports=[new le(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Dc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Dc),Ic.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ic),e.updateMatrixWorld(),La.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(La),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(La)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class G0 extends V0{constructor(){super(new rl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class H0 extends hu{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Me.DEFAULT_UP),this.updateMatrix(),this.target=new Me,this.shadow=new G0}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class W0 extends Ce{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Oo extends a0{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}const Uc=new se;class X0{constructor(t,e,n=0,s=1/0){this.ray=new el(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new nl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Uc.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Uc),this}intersectObject(t,e=!0,n=[]){return Bo(t,this,n,e),n.sort(Nc),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Bo(t[s],this,n,e);return n.sort(Nc),n}}function Nc(i,t){return i.distance-t.distance}function Bo(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)Bo(r[a],t,e,!0)}}const Fc=new L,vr=new L;class $0{constructor(t=new L,e=new L){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){Fc.subVectors(t,this.start),vr.subVectors(this.end,this.start);const n=vr.dot(vr);let r=vr.dot(Fc)/n;return e&&(r=Te(r,0,1)),r}closestPointToPoint(t,e,n){const s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jo);const Oc=new kn,_r=new L;class uu extends W0{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new fe(t,3)),this.setAttribute("uv",new fe(e,2))}applyMatrix4(t){const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Oo(e,6,1);return this.setAttribute("instanceStart",new Qn(n,3,0)),this.setAttribute("instanceEnd",new Qn(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));const n=new Oo(e,6,1);return this.setAttribute("instanceColorStart",new Qn(n,3,0)),this.setAttribute("instanceColorEnd",new Qn(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new z0(t.geometry)),this}fromLineSegments(t){const e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new kn);const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Oc.setFromBufferAttribute(e),this.boundingBox.union(Oc))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ai),this.boundingBox===null&&this.computeBoundingBox();const t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){const n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)_r.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(_r)),_r.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(_r));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}}ct.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new ft(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};We.line={uniforms:il.merge([ct.common,ct.fog,ct.line]),vertexShader:`
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
		`};class zo extends Bn{static get type(){return"LineMaterial"}constructor(t){super({uniforms:il.clone(We.line.uniforms),vertexShader:We.line.vertexShader,fragmentShader:We.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const Pa=new le,Bc=new L,zc=new L,Re=new le,Le=new le,mn=new le,Da=new L,Ia=new se,De=new $0,kc=new L,xr=new kn,Mr=new Ai,gn=new le;let _n,xi;function Vc(i,t,e){return gn.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),gn.multiplyScalar(1/gn.w),gn.x=xi/e.width,gn.y=xi/e.height,gn.applyMatrix4(i.projectionMatrixInverse),gn.multiplyScalar(1/gn.w),Math.abs(Math.max(gn.x,gn.y))}function j0(i,t){const e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){De.start.fromBufferAttribute(s,o),De.end.fromBufferAttribute(r,o),De.applyMatrix4(e);const c=new L,h=new L;_n.distanceSqToSegment(De.start,De.end,h,c),h.distanceTo(c)<xi*.5&&t.push({point:h,pointOnLine:c,distance:_n.origin.distanceTo(h),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function q0(i,t,e){const n=t.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,h=Math.min(o.instanceCount,l.count),d=-t.near;_n.at(1,mn),mn.w=1,mn.applyMatrix4(t.matrixWorldInverse),mn.applyMatrix4(n),mn.multiplyScalar(1/mn.w),mn.x*=r.x/2,mn.y*=r.y/2,mn.z=0,Da.copy(mn),Ia.multiplyMatrices(t.matrixWorldInverse,a);for(let u=0,f=h;u<f;u++){if(Re.fromBufferAttribute(l,u),Le.fromBufferAttribute(c,u),Re.w=1,Le.w=1,Re.applyMatrix4(Ia),Le.applyMatrix4(Ia),Re.z>d&&Le.z>d)continue;if(Re.z>d){const M=Re.z-Le.z,x=(Re.z-d)/M;Re.lerp(Le,x)}else if(Le.z>d){const M=Le.z-Re.z,x=(Le.z-d)/M;Le.lerp(Re,x)}Re.applyMatrix4(n),Le.applyMatrix4(n),Re.multiplyScalar(1/Re.w),Le.multiplyScalar(1/Le.w),Re.x*=r.x/2,Re.y*=r.y/2,Le.x*=r.x/2,Le.y*=r.y/2,De.start.copy(Re),De.start.z=0,De.end.copy(Le),De.end.z=0;const m=De.closestPointToPointParameter(Da,!0);De.at(m,kc);const g=ui.lerp(Re.z,Le.z,m),v=g>=-1&&g<=1,_=Da.distanceTo(kc)<xi*.5;if(v&&_){De.start.fromBufferAttribute(l,u),De.end.fromBufferAttribute(c,u),De.start.applyMatrix4(a),De.end.applyMatrix4(a);const M=new L,x=new L;_n.distanceSqToSegment(De.start,De.end,x,M),e.push({point:x,pointOnLine:M,distance:_n.origin.distanceTo(x),object:i,face:null,faceIndex:u,uv:null,uv1:null})}}}class Y0 extends we{constructor(t=new uu,e=new zo({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let a=0,o=0,l=e.count;a<l;a++,o+=2)Bc.fromBufferAttribute(e,a),zc.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Bc.distanceTo(zc);const r=new Oo(s,2,1);return t.setAttribute("instanceDistanceStart",new Qn(r,1,0)),t.setAttribute("instanceDistanceEnd",new Qn(r,1,1)),this}raycast(t,e){const n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;_n=t.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;xi=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),Mr.copy(o.boundingSphere).applyMatrix4(a);let c;if(n)c=xi*.5;else{const d=Math.max(s.near,Mr.distanceToPoint(_n.origin));c=Vc(s,d,l.resolution)}if(Mr.radius+=c,_n.intersectsSphere(Mr)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),xr.copy(o.boundingBox).applyMatrix4(a);let h;if(n)h=xi*.5;else{const d=Math.max(s.near,xr.distanceToPoint(_n.origin));h=Vc(s,d,l.resolution)}xr.expandByScalar(h),_n.intersectsBox(xr)!==!1&&(n?j0(this,e):q0(this,s,e))}onBeforeRender(t){const e=this.material.uniforms;e&&e.resolution&&(t.getViewport(Pa),this.material.uniforms.resolution.value.set(Pa.z,Pa.w))}}class J0 extends Me{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ft(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}}const Gi=new L,Gc=new se,Hc=new se,Wc=new L,Xc=new L;class Z0{constructor(t={}){const e=this;let n,s,r,a;const o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:n,height:s}},this.render=function(p,m){p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld(),m.parent===null&&m.matrixWorldAutoUpdate===!0&&m.updateMatrixWorld(),Gc.copy(m.matrixWorldInverse),Hc.multiplyMatrices(m.projectionMatrix,Gc),h(p,p,m),f(p)},this.setSize=function(p,m){n=p,s=m,r=n/2,a=s/2,l.style.width=p+"px",l.style.height=m+"px"};function c(p){p.isCSS2DObject&&(p.element.style.display="none");for(let m=0,g=p.children.length;m<g;m++)c(p.children[m])}function h(p,m,g){if(p.visible===!1){c(p);return}if(p.isCSS2DObject){Gi.setFromMatrixPosition(p.matrixWorld),Gi.applyMatrix4(Hc);const v=Gi.z>=-1&&Gi.z<=1&&p.layers.test(g.layers)===!0,_=p.element;_.style.display=v===!0?"":"none",v===!0&&(p.onBeforeRender(e,m,g),_.style.transform="translate("+-100*p.center.x+"%,"+-100*p.center.y+"%)translate("+(Gi.x*r+r)+"px,"+(-Gi.y*a+a)+"px)",_.parentNode!==l&&l.appendChild(_),p.onAfterRender(e,m,g));const M={distanceToCameraSquared:d(g,p)};o.objects.set(p,M)}for(let v=0,_=p.children.length;v<_;v++)h(p.children[v],m,g)}function d(p,m){return Wc.setFromMatrixPosition(p.matrixWorld),Xc.setFromMatrixPosition(m.matrixWorld),Wc.distanceToSquared(Xc)}function u(p){const m=[];return p.traverseVisible(function(g){g.isCSS2DObject&&m.push(g)}),m}function f(p){const m=u(p).sort(function(v,_){if(v.renderOrder!==_.renderOrder)return _.renderOrder-v.renderOrder;const M=o.objects.get(v).distanceToCameraSquared,x=o.objects.get(_).distanceToCameraSquared;return M-x}),g=m.length;for(let v=0,_=m.length;v<_;v++)m[v].element.style.zIndex=g-v}}}const du={rect:["Depth d","Width b"],circle:["Diameter D"],pipe:["Outer diameter D","Wall thickness t"],I:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],box:["Depth d","Width b","Flange thick. tf","Web thick. tw"],unp:["Depth d","Flange width bf","Flange thick. tf","Web thick. tw"],C:["Depth d","Flange width b","Lip length c","Thickness t"],general:["A","I33","I22","J"]},kr=(i,t)=>i==="general"?t===0?"A":"L4":"L",Ls={rect:"Rectangle",circle:"Circle",pipe:"Pipe",I:"I / Wide flange",box:"Box / Tube",unp:"UNP / Channel",C:"C / Lipped channel",general:"General"};function K0(i,t){const e=Math.max(i,t),n=Math.min(i,t);return e<=0?0:e*n**3*(1/3-.21*(n/e)*(1-n**4/(12*e**4)))}function fu(i){const t=i.dims;if(i.shape==="unp"){const[a,o,l,c]=t;return[[0,c,-a/2+l,a/2-l],[0,o,a/2-l,a/2],[0,o,-a/2,-a/2+l]]}const[e,n,s,r]=t;return[[0,r,-e/2,e/2],[r,n,e/2-r,e/2],[r,n,-e/2,-e/2+r],[n-r,n,e/2-s,e/2-r],[n-r,n,-e/2+r,-e/2+s]]}function pu(i){let t=0,e=0;for(const[o,l,c,h]of i){const d=(l-o)*(h-c);t+=d,e+=d*(o+l)/2}const n=t>0?e/t:0;let s=0,r=0,a=0;for(const[o,l,c,h]of i){const d=l-o,u=h-c,f=d*u,p=(c+h)/2,m=(o+l)/2-n;s+=d*u**3/12+f*p*p,r+=u*d**3/12+f*m*m,a+=Math.max(d,u)*Math.min(d,u)**3/3}return{A:t,I33:s,I22:r,J:a,xc:n}}function Q0(i){return i.shape==="unp"||i.shape==="C"?pu(fu(i)).xc:0}function mu(i){if(i.shape!=="unp"&&i.shape!=="C")return null;const t=Q0(i);let e;if(i.shape==="unp"){const[n,s,r,a]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[a,-n/2+r],[a,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}else{const[n,s,r,a]=i.dims;e=[[0,-n/2],[s,-n/2],[s,-n/2+r],[s-a,-n/2+r],[s-a,-n/2+a],[a,-n/2+a],[a,n/2-a],[s-a,n/2-a],[s-a,n/2-r],[s,n/2-r],[s,n/2],[0,n/2]]}return e.map(([n,s])=>[n-t,s])}function bi(i){const t=i.dims;switch(i.shape){case"rect":{const[e,n]=t;return{A:n*e,I33:n*e**3/12,I22:e*n**3/12,J:K0(e,n),depth:e,width:n}}case"circle":{const[e]=t,n=Math.PI*e**4/64;return{A:Math.PI*e*e/4,I33:n,I22:n,J:2*n,depth:e,width:e}}case"pipe":{const[e,n]=t,s=Math.max(e-2*n,0),r=Math.PI*(e**4-s**4)/64;return{A:Math.PI*(e*e-s*s)/4,I33:r,I22:r,J:2*r,depth:e,width:e}}case"I":{const[e,n,s,r]=t,a=e-2*s;return{A:2*n*s+a*r,I33:(n*e**3-(n-r)*a**3)/12,I22:2*s*n**3/12+a*r**3/12,J:(2*n*s**3+(e-s)*r**3)/3,depth:e,width:n}}case"box":{const[e,n,s,r]=t,a=e-2*s,o=n-2*r,l=n*r+e*s-r*r-s*s;return{A:n*e-o*a,I33:(n*e**3-o*a**3)/12,I22:(e*n**3-a*o**3)/12,J:l>0?2*r*s*(n-r)**2*(e-s)**2/l:0,depth:e,width:n}}case"unp":case"C":{const e=pu(fu(i));return{A:e.A,I33:e.I33,I22:e.I22,J:e.J,depth:t[0],width:t[1]}}case"general":{const[e,n,s,r]=t,a=Math.sqrt(Math.max(e,1e-6));return{A:e,I33:n,I22:s,J:r,depth:a,width:a}}}}function $c(i){const t=du[i.shape].length;if(i.dims.length<t)return"Missing dimensions";if(i.dims.slice(0,t).some(e=>!(e>0)))return"All dimensions must be positive";if(i.shape==="pipe"&&2*i.dims[1]>=i.dims[0])return"Wall too thick for diameter";if((i.shape==="I"||i.shape==="box")&&2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.shape==="I"&&i.dims[3]>=i.dims[1])return"Web thicker than flange width";if(i.shape==="box"&&2*i.dims[3]>=i.dims[1])return"Webs too thick for width";if(i.shape==="unp"){if(2*i.dims[2]>=i.dims[0])return"Flanges too thick for depth";if(i.dims[3]>=i.dims[1])return"Web thicker than flange width"}if(i.shape==="C"){const[e,n,s,r]=i.dims;if(2*r>=e)return"Thickness too large for depth";if(2*r>=n)return"Thickness too large for flange width";if(s<=r)return"Lip must be longer than the thickness";if(2*s>=e)return"Lips too long for depth"}return null}const Ps=(i,t)=>[i[0]-t[0],i[1]-t[1],i[2]-t[2]],Dr=(i,t)=>i[0]*t[0]+i[1]*t[1]+i[2]*t[2],ys=(i,t)=>[i[1]*t[2]-i[2]*t[1],i[2]*t[0]-i[0]*t[2],i[0]*t[1]-i[1]*t[0]],Bs=i=>Math.hypot(i[0],i[1],i[2]),$i=(i,t)=>[i[0]*t,i[1]*t,i[2]*t],jc=(i,t)=>[i[0]+t[0],i[1]+t[1],i[2]+t[2]],qc=i=>$i(i,1/Bs(i));function ko(i,t,e){const n=Ps(t,i),s=Bs(n),r=$i(n,1/s);let a,o;if(Math.hypot(n[0],n[1])<=1e-6*s?(a=[1,0,0],o=qc(ys(r,a)),a=ys(o,r)):(o=qc(ys(r,[0,0,1])),a=ys(o,r)),e){const l=e*Math.PI/180,c=Math.cos(l),h=Math.sin(l),d=jc($i(a,c),$i(o,h)),u=jc($i(a,-h),$i(o,c));a=d,o=u}return[r,a,o]}function t_(i,t,e,n,s,r,a){const o=new Float64Array(144),l=(f,p,m)=>{o[f*12+p]=m,o[p*12+f]=m},c=i*e/a;l(0,0,c),l(0,6,-c),l(6,6,c);const h=t*r/a;l(3,3,h),l(3,9,-h),l(9,9,h);const d=i*s/a**3;l(1,1,12*d),l(1,5,6*d*a),l(1,7,-12*d),l(1,11,6*d*a),l(5,5,4*d*a*a),l(5,7,-6*d*a),l(5,11,2*d*a*a),l(7,7,12*d),l(7,11,-6*d*a),l(11,11,4*d*a*a);const u=i*n/a**3;return l(2,2,12*u),l(2,4,-6*u*a),l(2,8,-12*u),l(2,10,-6*u*a),l(4,4,4*u*a*a),l(4,8,6*u*a),l(4,10,2*u*a*a),l(8,8,12*u),l(8,10,6*u*a),l(10,10,4*u*a*a),o}function e_(i){return[...i[0],...i[1],...i[2]]}function n_(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s*3]*t[n*3]+i[s*3+1]*t[n*3+1]+i[s*3+2]*t[n*3+2];return e}function Yc(i,t){const e=new Float64Array(12);for(let n=0;n<4;n++)for(let s=0;s<3;s++)e[n*3+s]=i[s]*t[n*3]+i[3+s]*t[n*3+1]+i[6+s]*t[n*3+2];return e}function i_(i,t){const e=new Float64Array(144);for(let r=0;r<4;r++)for(let a=0;a<3;a++)for(let o=0;o<3;o++)e[(r*3+a)*12+r*3+o]=t[a*3+o];const n=new Float64Array(144);for(let r=0;r<12;r++)for(let a=0;a<12;a++){let o=0;for(let l=0;l<12;l++)o+=i[r*12+l]*e[l*12+a];n[r*12+a]=o}const s=new Float64Array(144);for(let r=0;r<12;r++)for(let a=0;a<12;a++){let o=0;for(let l=0;l<12;l++)o+=e[l*12+r]*n[l*12+a];s[r*12+a]=o}return s}function Jc(i,t,e,n){const s=e-t,r=e*e,a=r*e;n[0]+=-i[0]*s/e,n[6]+=-i[0]*t/e;const o=s*s*(3*t+s)/a,l=t*t*(t+3*s)/a,c=t*s*s/r,h=t*t*s/r;n[1]+=-i[1]*o,n[5]+=-i[1]*c,n[7]+=-i[1]*l,n[11]+=i[1]*h,n[2]+=-i[2]*o,n[4]+=i[2]*c,n[8]+=-i[2]*l,n[10]+=-i[2]*h}const gu=[{x:-Math.sqrt(3/5),w:5/9},{x:0,w:8/9},{x:Math.sqrt(3/5),w:5/9}];function s_(i,t){var r;const e=i.length;if(e===0)return[];const n=((r=t[0])==null?void 0:r.length)??0,s=Array.from({length:e},(a,o)=>[...i[o],...t[o]]);for(let a=0;a<e;a++){let o=a,l=Math.abs(s[a][a]);for(let h=a+1;h<e;h++){const d=Math.abs(s[h][a]);d>l&&(l=d,o=h)}if(l<1e-12)return null;if(o!==a){const h=s[a];s[a]=s[o],s[o]=h}const c=s[a][a];for(let h=a;h<e+n;h++)s[a][h]/=c;for(let h=0;h<e;h++){if(h===a)continue;const d=s[h][a];if(!(Math.abs(d)<1e-18))for(let u=a;u<e+n;u++)s[h][u]-=d*s[a][u]}}return s.map(a=>a.slice(e))}function r_(i,t,e){const n=[],s=[];for(let m=0;m<6;m++)t&&t[m]?n.push(m):s.push(m);for(let m=0;m<6;m++)e&&e[m]?n.push(6+m):s.push(6+m);if(n.length===0)return{retained:s,released:n,W:[],invKee:[],klCondensed:new Float64Array(i)};if(s.length===0)return null;const r=n.length,a=s.length,o=Array.from({length:r},(m,g)=>Array.from({length:r},(v,_)=>i[n[g]*12+n[_]])),l=Array.from({length:r},(m,g)=>Array.from({length:a},(v,_)=>i[n[g]*12+s[_]])),c=Array.from({length:r},(m,g)=>Array.from({length:r},(v,_)=>g===_?1:0)),h=l.map((m,g)=>[...m,...c[g]]),d=s_(o,h);if(!d)return null;const u=d.map(m=>m.slice(0,a)),f=d.map(m=>m.slice(a)),p=new Float64Array(144);for(let m=0;m<a;m++){const g=s[m];for(let v=0;v<a;v++){const _=s[v];let M=0;for(let x=0;x<r;x++)M+=l[x][m]*u[x][v];p[g*12+_]=i[g*12+_]-M}}for(let m=0;m<a;m++){const g=s[m];for(let v=m+1;v<a;v++){const _=s[v],M=.5*(p[g*12+_]+p[_*12+g]);p[g*12+_]=M,p[_*12+g]=M}}return{retained:s,released:n,W:u,invKee:f,klCondensed:p}}function a_(i,t){if(t.released.length===0)return new Float64Array(i);const e=t.released.length,n=t.retained.length,s=new Array(e);for(let a=0;a<e;a++)s[a]=i[t.released[a]];const r=new Float64Array(12);for(let a=0;a<n;a++){const o=t.retained[a];let l=0;for(let c=0;c<e;c++)l+=t.W[c][a]*s[c];r[o]=i[o]-l}return r}function o_(i,t,e){if(e.released.length===0)return new Float64Array(i);const n=e.released.length,s=e.retained.length,r=new Array(s);for(let c=0;c<s;c++)r[c]=i[e.retained[c]];const a=new Array(n);for(let c=0;c<n;c++)a[c]=t[e.released[c]];const o=new Array(n);for(let c=0;c<n;c++){let h=0;for(let u=0;u<n;u++)h+=e.invKee[c][u]*a[u];let d=0;for(let u=0;u<s;u++)d+=e.W[c][u]*r[u];o[c]=-h-d}const l=new Float64Array(12);for(let c=0;c<s;c++)l[e.retained[c]]=r[c];for(let c=0;c<n;c++)l[e.released[c]]=o[c];return l}const Zc=9.80665,Ua=.0044482216152605,ss=[{id:"kN-m",label:"kN, m",force:"kN",length:"m",kF:1,kL:1,small:"mm",kSmall:.001},{id:"N-mm",label:"N, mm",force:"N",length:"mm",kF:.001,kL:.001,small:"mm",kSmall:.001},{id:"tonf-m",label:"ton, m",force:"tonf",length:"m",kF:Zc,kL:1,small:"mm",kSmall:.001},{id:"kgf-mm",label:"kg, mm",force:"kgf",length:"mm",kF:Zc/1e3,kL:.001,small:"mm",kSmall:.001},{id:"kip-ft",label:"kip, ft",force:"kip",length:"ft",kF:Ua*1e3,kL:.3048,small:"in",kSmall:.0254},{id:"kip-in",label:"kip, in",force:"kip",length:"in",kF:Ua*1e3,kL:.0254,small:"in",kSmall:.0254},{id:"lb-in",label:"lb, in",force:"lb",length:"in",kF:Ua,kL:.0254,small:"in",kSmall:.0254}],Vo=ss[0],l_={L:[0,1],F:[1,0],M:[1,1],FL:[1,-1],FA:[1,-2],FV:[1,-3],A:[0,2],L4:[0,4]},vu="structapp3d.units";function _u(i){return ss.find(t=>t.id===i)}function c_(){var i;try{return _u((i=globalThis.localStorage)==null?void 0:i.getItem(vu))??Vo}catch{return Vo}}let Ei=c_();const Go=new Set,on=()=>Ei;function Kc(i){var e;const t=_u(i);if(!(!t||t===Ei)){Ei=t;try{(e=globalThis.localStorage)==null||e.setItem(vu,i)}catch{}for(const n of Go)n(t)}}function h_(i){return Go.add(i),()=>Go.delete(i)}function xu(i,t=Ei){const[e,n]=l_[i];return t.kF**e*t.kL**n}const dl=(i,t,e=Ei)=>i/xu(t,e),Mu=(i,t,e=Ei)=>i*xu(t,e),u_={2:"²",3:"³",4:"⁴"};function qt(i,t=Ei,e=!1){const n=t.force,s=t.length,r=a=>e?String(a):u_[a];switch(i){case"L":return s;case"F":return n;case"M":return`${n}${e?"-":"·"}${s}`;case"FL":return`${n}/${s}`;case"FA":return`${n}/${s}${r(2)}`;case"FV":return`${n}/${s}${r(3)}`;case"A":return`${s}${r(2)}`;case"L4":return`${s}${r(4)}`}}function zn(i,t=4){if(!Number.isFinite(i))return"—";if(Math.abs(i)<1e-12)return"0";const e=Math.abs(i);return e>=1e5||e<.001?i.toExponential(t-1):String(Number(i.toPrecision(t)))}const jt=(i,t,e=4)=>zn(dl(i,t),e),Ae=(i,t,e=4)=>`${jt(i,t,e)} ${qt(t)}`,d_=(i,t)=>Number(dl(i,t).toPrecision(10)),Ie=(i,t)=>`${i}:${t}`;function Ds(i){const[t,e]=i.split(":");return{kind:t,id:Number(e)}}const Ho=["P","V2","V3","T","M2","M3"],yu={bg:988970,grid:1976635,gridMajor:3359061,joint:3718648,frame:14870768,area:2278750,sel:16096779,load:16007006,support:2278750,reaction:11032055,pos:3900150,neg:15680580,deformed:16436245,ghost:4674921},f_={bg:16317180,grid:14870768,gridMajor:13358561,joint:165063,frame:1976635,area:1483594,sel:15357964,load:14753096,support:1409085,reaction:8266446,pos:2450411,neg:14427686,deformed:13273604,ghost:9741240},Qc=[9741240,6333946,16020150,3462041,16498468,10980346,16486972,3003583],Qt=i=>Array.isArray(i)?new L(i[0],i[1],i[2]):new L(i.x,i.y,i.z),yr=i=>[i.x,i.y,i.z];function th(i,t){switch(i){case"GX":return new L(1,0,0);case"GY":return new L(0,1,0);case"GZ":return new L(0,0,1);case"GRAV":return new L(0,0,-1);case"L1":return Qt(t[0]);case"L2":return Qt(t[1]);case"L3":return Qt(t[2])}}function p_(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d");t.beginPath(),t.arc(32,32,28,0,Math.PI*2),t.fillStyle="#fff",t.fill(),t.lineWidth=6,t.strokeStyle="rgba(0,0,0,0.55)",t.stroke();const e=new nu(i);return e.colorSpace=He,e}function m_(){const i=document.createElement("canvas");i.width=i.height=64;const t=i.getContext("2d");t.beginPath(),t.arc(32,32,20,0,Math.PI*2),t.fillStyle="rgba(15, 23, 42, 0.9)",t.fill(),t.lineWidth=8,t.strokeStyle="#38bdf8",t.stroke();const e=new nu(i);return e.colorSpace=He,e}function g_(i){const t=i.dims,e=(n,s,r)=>{r.moveTo(-n/2,-s/2),r.lineTo(n/2,-s/2),r.lineTo(n/2,s/2),r.lineTo(-n/2,s/2),r.closePath()};switch(i.shape){case"rect":{const n=new Jn;return e(t[1],t[0],n),n}case"circle":{const n=new Jn;return n.absarc(0,0,t[0]/2,0,Math.PI*2,!1),n}case"pipe":{const n=new Jn;n.absarc(0,0,t[0]/2,0,Math.PI*2,!1);const s=new zr;return s.absarc(0,0,t[0]/2-t[1],0,Math.PI*2,!0),n.holes.push(s),n}case"box":{const n=new Jn;e(t[1],t[0],n);const s=new zr;return e(t[1]-2*t[3],t[0]-2*t[2],s),n.holes.push(s),n}case"I":{const[n,s,r,a]=t,o=new Jn,l=[[-s/2,-n/2],[s/2,-n/2],[s/2,-n/2+r],[a/2,-n/2+r],[a/2,n/2-r],[s/2,n/2-r],[s/2,n/2],[-s/2,n/2],[-s/2,n/2-r],[-a/2,n/2-r],[-a/2,-n/2+r],[-s/2,-n/2+r]];o.moveTo(...l[0]);for(const c of l.slice(1))o.lineTo(...c);return o.closePath(),o}case"unp":case"C":{const n=mu(i),s=new Jn;s.moveTo(...n[0]);for(const r of n.slice(1))s.lineTo(...r);return s.closePath(),s}case"general":{const n=bi(i),s=new Jn;return e(n.width,n.depth,s),s}}}class v_{constructor(t){it(this,"renderer");it(this,"labels");it(this,"scene",new r0);it(this,"persp",new Ke(45,1,.01,1e5));it(this,"ortho",new rl(-1,1,1,-1,.001,1e6));it(this,"camera",this.persp);it(this,"useOrtho",!1);it(this,"target",new L);it(this,"azimuth",-Math.PI/3);it(this,"elevation",Math.PI/6);it(this,"distance",20);it(this,"theme",yu);it(this,"width",1);it(this,"height",1);it(this,"lineMats",[]);it(this,"gridGroup",new vn);it(this,"modelGroup",new vn);it(this,"resultGroup",new vn);it(this,"overlayGroup",new vn);it(this,"jointTex",p_());it(this,"hingeTex",m_());it(this,"renderQueued",!1);it(this,"animStart",0);it(this,"deformed",null);it(this,"data",null);it(this,"selection",new Set);it(this,"results",null);it(this,"display",{jointLabels:!1,frameLabels:!1,areaLabels:!1,showLoads:!0,loadValues:!0,extruded:!1,showSupports:!0});it(this,"resultOpts",{view:"none",deformScale:1,forceScale:1,animate:!1,showValues:!0});it(this,"autoDeformScale",1);it(this,"span",10);it(this,"overlayObjs",[]);this.host=t,this.renderer=new s0({antialias:!0,alpha:!1}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.domElement.className="viewport-canvas",t.appendChild(this.renderer.domElement),this.labels=new Z0,this.labels.domElement.className="viewport-labels",t.appendChild(this.labels.domElement),this.persp.up.set(0,0,1),this.ortho.up.set(0,0,1),this.scene.add(new k0(16777215,3359061,1.6));const e=new H0(16777215,1.4);e.position.set(1,-2,3),this.scene.add(e),this.scene.add(this.gridGroup,this.modelGroup,this.resultGroup,this.overlayGroup),new ResizeObserver(()=>this.resize()).observe(t),this.resize()}get canvas(){return this.renderer.domElement}setTheme(t){this.theme=t,this.rebuildAll()}resize(){const t=this.host.getBoundingClientRect();this.width=Math.max(1,t.width),this.height=Math.max(1,t.height),this.renderer.setSize(this.width,this.height),this.labels.setSize(this.width,this.height);for(const e of this.lineMats)e.resolution.set(this.width,this.height);this.updateCamera()}viewDir(){const t=Math.cos(this.elevation);return new L(t*Math.cos(this.azimuth),t*Math.sin(this.azimuth),Math.sin(this.elevation))}updateCamera(){const t=this.viewDir(),e=this.width/this.height,n=this.distance*Math.tan(ui.degToRad(this.persp.fov/2));this.persp.aspect=e,this.persp.near=Math.max(this.distance/2e3,1e-4),this.persp.far=this.distance*50+this.span*20,this.persp.position.copy(this.target).addScaledVector(t,this.distance),this.persp.lookAt(this.target),this.persp.updateProjectionMatrix();const s=this.distance+this.span*10;this.ortho.left=-n*e,this.ortho.right=n*e,this.ortho.top=n,this.ortho.bottom=-n,this.ortho.near=.001,this.ortho.far=s*2+this.span*10,this.ortho.position.copy(this.target).addScaledVector(t,s),this.ortho.lookAt(this.target),this.ortho.updateProjectionMatrix(),this.camera=this.useOrtho?this.ortho:this.persp,this.requestRender()}setOrtho(t){this.useOrtho=t,this.updateCamera()}orbit(t,e){this.azimuth-=t*.008,this.elevation=ui.clamp(this.elevation+e*.008,-Math.PI/2+.002,Math.PI/2-.002),this.updateCamera()}worldPerPixel(){return 2*this.distance*Math.tan(ui.degToRad(this.persp.fov/2))/this.height}pan(t,e){const n=this.worldPerPixel(),s=this.camera;s.updateMatrixWorld();const r=new L().setFromMatrixColumn(s.matrixWorld,0),a=new L().setFromMatrixColumn(s.matrixWorld,1);this.target.addScaledVector(r,-t*n).addScaledVector(a,e*n),this.updateCamera()}zoom(t,e,n){t=ui.clamp(t,.2,5);const s=ui.clamp(this.distance*t,this.span*.001+.001,this.span*200+100);if(t=s/this.distance,e!==void 0&&n!==void 0){const r=this.pointOnTargetPlane(e,n);r&&this.target.add(r.sub(this.target).multiplyScalar(1-t))}this.distance=s,this.updateCamera()}ndc(t,e){const n=this.canvas.getBoundingClientRect();return new ft((t-n.left)/n.width*2-1,-((e-n.top)/n.height)*2+1)}ray(t,e){const n=new X0;return n.setFromCamera(this.ndc(t,e),this.camera),n.ray}pointOnTargetPlane(t,e){const n=new Dn().setFromNormalAndCoplanarPoint(this.viewDir(),this.target);return this.ray(t,e).intersectPlane(n,new L)}workPlanePoint(t,e,n){if(!this.data)return null;const{workPlane:s}=this.data.settings,r=n??this.data.settings.elevation,a=s==="XY"?new L(0,0,1):s==="XZ"?new L(0,1,0):new L(1,0,0),o=new Dn(a,-r),l=this.ray(t,e);return Math.abs(l.direction.dot(a))<1e-4?null:l.intersectPlane(o,new L)}toScreen(t){const e=this.canvas.getBoundingClientRect(),n=t.clone().project(this.camera);return{x:e.left+(n.x+1)/2*e.width,y:e.top+(1-n.y)/2*e.height,behind:n.z>1||n.z<-1}}bounds(){const t=new kn;if(this.data&&this.data.joints.length)for(const e of this.data.joints)t.expandByPoint(Qt(e));else{const e=this.data?this.data.settings.gridSpacing*Math.min(this.data.settings.gridLines,5):5;t.set(new L(-e,-e,0),new L(e,e,0))}return t}fit(){const e=this.bounds().getBoundingSphere(new Ai),n=Math.max(e.radius,1);this.target.copy(e.center);const s=ui.degToRad(this.persp.fov/2),r=this.width/this.height,a=n/Math.sin(s),o=n/Math.sin(Math.atan(Math.tan(s)*r));this.distance=Math.max(a,o)*1.08,this.updateCamera()}viewPreset(t){const e={top:[-Math.PI/2,Math.PI/2-.002],front:[-Math.PI/2,0],side:[0,0],iso:[-Math.PI/3,Math.PI/6]};[this.azimuth,this.elevation]=e[t],this.fit()}requestRender(){this.renderQueued||(this.renderQueued=!0,requestAnimationFrame(t=>{if(this.renderQueued=!1,this.resultOpts.animate&&this.deformed){const e=Math.sin((t-this.animStart)/1400*Math.PI*2);this.applyDeformation(e),this.requestRender()}this.renderer.render(this.scene,this.camera),this.labels.render(this.scene,this.camera)}))}clearGroup(t){const e=[...t.children];for(const n of e)t.remove(n),n.traverse(s=>{var o;const r=s;(o=r.geometry)==null||o.dispose();const a=r.material;if(a)for(const l of Array.isArray(a)?a:[a])l!==void 0&&(l instanceof zo&&(this.lineMats=this.lineMats.filter(c=>c!==l)),l.dispose())})}lineMat(t,e,n={}){const s=new zo({color:t??16777215,linewidth:e,vertexColors:t===null,transparent:(n.opacity??1)<1,opacity:n.opacity??1,dashed:n.dashed??!1,dashSize:this.span*.02,gapSize:this.span*.015});return s.resolution.set(this.width,this.height),this.lineMats.push(s),s}lines(t,e,n,s,r){const a=new uu;a.setPositions(t),s&&a.setColors(s);const o=new Y0(a,this.lineMat(e,n,r));return r!=null&&r.dashed&&o.computeLineDistances(),o}label(t,e,n=""){const s=document.createElement("div");s.className="lbl "+n,s.textContent=t;const r=new J0(s);return r.position.copy(e),r}setData(t,e,n){this.data=t,this.selection=e,this.results=n,this.rebuildAll()}rebuildAll(){if(!this.data)return;this.scene.background=new Ht(this.theme.bg);const t=this.bounds();this.span=Math.max(t.getSize(new L).length(),this.data.settings.gridSpacing*2,.001),this.computeAutoScales(),this.buildGrid(),this.buildModel(),this.buildResults(),this.requestRender()}glyph(){return this.span*.035}buildGrid(){this.clearGroup(this.gridGroup);const t=this.data,{gridSpacing:e,gridLines:n,workPlane:s,elevation:r}=t.settings,a=[],o=[],l=e*n,c=(u,f)=>s==="XY"?[u,f,r]:s==="XZ"?[u,r,f]:[r,u,f];for(let u=-n;u<=n;u++)(u===0?o:a).push(...c(u*e,-l),...c(u*e,l),...c(-l,u*e),...c(l,u*e));this.gridGroup.add(this.lines(a,this.theme.grid,1)),this.gridGroup.add(this.lines(o,this.theme.gridMajor,1.5));const h=Math.max(e,this.span*.08),d=this.lines([0,0,0,h,0,0,0,0,0,0,h,0,0,0,0,0,0,h],null,3,[1,.25,.25,1,.25,.25,.3,.85,.3,.3,.85,.3,.3,.5,1,.3,.5,1]);this.gridGroup.add(d),this.gridGroup.add(this.label("X",new L(h*1.15,0,0),"axis x")),this.gridGroup.add(this.label("Y",new L(0,h*1.15,0),"axis y")),this.gridGroup.add(this.label("Z",new L(0,0,h*1.15),"axis z"))}buildModel(){this.clearGroup(this.modelGroup);const t=this.data,e=this.theme,n=this.selection,s=new Map(t.joints.map(h=>[h.id,h])),r=this.results&&this.resultOpts.view!=="none"&&this.resultOpts.view!=="reactions",a=new Ht(e.sel);for(const h of t.areas){const d=h.joints.map(g=>s.get(g)).filter(Boolean).map(g=>Qt(g));if(d.length<3)continue;const u=[];for(let g=1;g<d.length-1;g++)u.push(...d[0].toArray(),...d[g].toArray(),...d[g+1].toArray());const f=new Ce;f.setAttribute("position",new fe(u,3));const p=n.has(Ie("a",h.id)),m=new we(f,new ws({color:p?e.sel:e.area,transparent:!0,opacity:r?.08:p?.45:.22,side:ln,depthWrite:!1}));if(m.renderOrder=-1,this.modelGroup.add(m),this.display.areaLabels){const g=d.reduce((v,_)=>v.add(_),new L).multiplyScalar(1/d.length);this.modelGroup.add(this.label("A"+h.id,g,"area"))}}const o=[],l=[],c=new Ht(r?e.ghost:e.frame);for(const h of t.frames){const d=s.get(h.i),u=s.get(h.j);if(!d||!u)continue;o.push(d.x,d.y,d.z,u.x,u.y,u.z);const f=n.has(Ie("f",h.id))?a:c;l.push(f.r,f.g,f.b,f.r,f.g,f.b),this.display.frameLabels&&this.modelGroup.add(this.label("F"+h.id,Qt(d).add(Qt(u)).multiplyScalar(.5),"frame"))}if(o.length&&(this.display.extruded&&!r?this.buildExtruded(t,s):this.modelGroup.add(this.lines(o,null,3,l)),this.display.extruded&&r&&this.modelGroup.add(this.lines(o,null,2,l)),this.display.extruded&&!r)){const h=[];for(const d of t.frames){if(!n.has(Ie("f",d.id)))continue;const u=s.get(d.i),f=s.get(d.j);h.push(u.x,u.y,u.z,f.x,f.y,f.z)}h.length&&this.modelGroup.add(this.lines(h,e.sel,4))}if(!r){const h=[];for(const d of t.frames){const u=s.get(d.i),f=s.get(d.j);if(!u||!f)continue;const p=f.x-u.x,m=f.y-u.y,g=f.z-u.z,v=Math.hypot(p,m,g);if(v<=1e-6)continue;const _=Math.min(.08,.3/v);d.relI&&d.relI.some(Boolean)&&h.push(u.x+p*_,u.y+m*_,u.z+g*_),d.relJ&&d.relJ.some(Boolean)&&h.push(f.x-p*_,f.y-m*_,f.z-g*_)}if(h.length){const d=new Ce;d.setAttribute("position",new fe(h,3));const u=new Aa(d,new Pr({size:11,sizeAttenuation:!1,map:this.hingeTex,transparent:!0,alphaTest:.1,depthTest:!1}));this.modelGroup.add(u)}}if(t.joints.length){const h=[],d=[],u=new Ht(e.joint);for(const m of t.joints){h.push(m.x,m.y,m.z);const g=n.has(Ie("j",m.id))?a:u;if(d.push(g.r,g.g,g.b),this.display.jointLabels){const v=this.label(String(m.id),Qt(m),"joint");this.modelGroup.add(v)}}const f=new Ce;f.setAttribute("position",new fe(h,3)),f.setAttribute("color",new fe(d,3));const p=new Aa(f,new Pr({size:13,sizeAttenuation:!1,map:this.jointTex,vertexColors:!0,alphaTest:.5,transparent:!0,depthTest:!1}));p.renderOrder=10,this.modelGroup.add(p)}this.display.showSupports&&this.buildSupports(t),this.display.showLoads&&!(this.results&&this.resultOpts.view!=="none")&&this.buildLoads(t,s)}buildExtruded(t,e){const n=new Map(t.sections.map((a,o)=>[a.name,o])),s=new Map,r=(a,o)=>{let l=s.get(a);return l||(l=new Pc({color:o,roughness:.6,metalness:.1}),s.set(a,l)),l};for(const a of t.frames){const o=e.get(a.i),l=e.get(a.j),c=t.sections.find(_=>_.name===a.section);if(!o||!l||!c)continue;const h=g_(c);if(!h)continue;const d=Math.hypot(l.x-o.x,l.y-o.y,l.z-o.z),u=new hl(h,{depth:d,bevelEnabled:!1,curveSegments:16}),f=ko(yr(o),yr(l),a.beta),m=this.selection.has(Ie("f",a.id))?this.theme.sel:Qc[(n.get(c.name)??0)%Qc.length],g=new we(u,r(String(m),m)),v=new se().makeBasis(Qt(f[2]).negate(),Qt(f[1]),Qt(f[0]));v.setPosition(o.x,o.y,o.z),g.applyMatrix4(v),this.modelGroup.add(g)}}arrow(t,e,n,s=2,r=!1){const a=new vn,o=e.clone().sub(t),l=o.length();if(l<1e-12)return a;o.normalize();const c=Math.min(l*.35,this.glyph()*.6),h=c*.35,d=e.clone().addScaledVector(o,-c*(r?1.6:.9));a.add(this.lines([...t.toArray(),...d.toArray()],n,s));const u=new ws({color:n}),f=r?[e,e.clone().addScaledVector(o,-c*.8)]:[e];for(const p of f){const m=new we(new Cs(h,c,12),u.clone());m.position.copy(p).addScaledVector(o,-c/2),m.quaternion.setFromUnitVectors(new L(0,1,0),o),a.add(m)}return u.dispose(),a}buildSupports(t){const e=this.glyph(),n=this.theme.support;for(const s of t.joints){if(!s.r.some(Boolean))continue;const r=s.r[0]&&s.r[1]&&s.r[2],a=s.r[3]&&s.r[4]&&s.r[5],o=Qt(s),l=new Pc({color:n,roughness:.7});let c;if(r&&a)c=new we(new cs(e*1.6,e*1.6,e*.5),l),c.position.copy(o).add(new L(0,0,-e*.25));else if(r){const h=new we(new Cs(e*.7,e*1.1,4),l);h.rotation.x=Math.PI/2,h.position.copy(o).add(new L(0,0,-e*.55)),c=h}else{const h=new vn,d=new we(new Cs(e*.55,e*.8,4),l);d.rotation.x=Math.PI/2,d.position.set(0,0,-e*.4);const u=new we(new ul(e*.22,12,8),l);u.position.set(0,0,-e*1),h.add(d,u),h.position.copy(o),c=h}this.modelGroup.add(c)}}buildLoads(t,e){const n=this.glyph(),s=this.theme.load,r=n*3,a=this.display.loadValues;for(const u of t.jointLoads){const f=e.get(u.joint);if(!f)continue;const p=Qt(f),m=new L(u.f[0],u.f[1],u.f[2]);if(m.lengthSq()>0){const v=m.clone().normalize();this.modelGroup.add(this.arrow(p.clone().addScaledVector(v,-r),p,s,2.5)),a&&this.modelGroup.add(this.label(Ae(m.length(),"F"),p.clone().addScaledVector(v,-r*1.1),"load"))}const g=new L(u.f[3],u.f[4],u.f[5]);if(g.lengthSq()>0){const v=g.clone().normalize();this.modelGroup.add(this.arrow(p,p.clone().addScaledVector(v,r*.9),s,2.5,!0)),a&&this.modelGroup.add(this.label(Ae(g.length(),"M"),p.clone().addScaledVector(v,r),"load"))}}const o=new Map(t.frames.map(u=>[u.id,u])),l=u=>{const f=e.get(u.i),p=e.get(u.j);return{a:Qt(f),b:Qt(p),ax:ko(yr(f),yr(p),u.beta)}};for(const u of t.framePointLoads){const f=o.get(u.frame);if(!f||!e.has(f.i)||!e.has(f.j))continue;const{a:p,b:m,ax:g}=l(f),v=p.clone().lerp(m,u.rd),_=th(u.dir,g).multiplyScalar(Math.sign(u.P)||1);this.modelGroup.add(this.arrow(v.clone().addScaledVector(_,-r),v,s,2.5)),a&&this.modelGroup.add(this.label(Ae(Math.abs(u.P),"F"),v.clone().addScaledVector(_,-r*1.1),"load"))}const c=16486972,h=new Map;for(const u of t.frameUniformLoads){const f=o.get(u.frame);if(!f||!e.has(f.i)||!e.has(f.j))continue;const{a:p,b:m,ax:g}=l(f),v=h.get(f.id)??0;h.set(f.id,v+1);const _=th(u.dir,g).multiplyScalar(Math.sign(u.w)||1),M=r*.7*(1+v*.6),x=6,D=[];for(let A=0;A<=x;A++){const P=p.clone().lerp(m,A/x),I=P.clone().addScaledVector(_,-M);D.push(...I.toArray()),A>0&&A<x&&D.push(...I.toArray()),this.modelGroup.add(this.arrow(I,P,c,1.5))}if(this.modelGroup.add(this.lines(D,c,2)),a){const A=p.clone().lerp(m,.5).addScaledVector(_,-M*1.15);this.modelGroup.add(this.label(Ae(Math.abs(u.w),"FL"),A,"load uload"))}}const d=new Map(t.areas.map(u=>[u.id,u]));for(const u of t.areaLoads){const f=d.get(u.area);if(!f)continue;const p=f.joints.map(_=>e.get(_)).filter(Boolean).map(_=>Qt(_));if(p.length<3)continue;const m=p.reduce((_,M)=>_.add(M),new L).multiplyScalar(1/p.length),g=new L(0,0,Math.sign(u.q)>=0?-1:1),v=[m,...p.map(_=>_.clone().lerp(m,.45))];for(const _ of v)this.modelGroup.add(this.arrow(_.clone().addScaledVector(g,-r*.8),_,1357990,1.5));a&&this.modelGroup.add(this.label(Ae(Math.abs(u.q),"FA"),m.clone().addScaledVector(g,-r*.95),"load aload"))}}computeAutoScales(){const t=this.results;this.autoDeformScale=t&&t.stats.maxDisp>1e-15?this.span*.08/t.stats.maxDisp:1}setResults(t){this.results=t,this.computeAutoScales()}setResultOptions(t){const e=this.resultOpts.view;Object.assign(this.resultOpts,t),t.animate&&(this.animStart=performance.now()),e!==this.resultOpts.view&&this.buildModel(),!this.resultOpts.animate&&this.deformed&&this.applyDeformation(1),this.buildResults(),this.requestRender()}applyDeformation(t){const e=this.deformed,n=e.geo.attributes.instanceStart,s=n.data.array;for(let r=0;r<s.length;r++)s[r]=e.base[r]+e.delta[r]*t;n.data.needsUpdate=!0,e.geo.computeBoundingSphere()}buildResults(){this.clearGroup(this.resultGroup),this.deformed=null;const t=this.results,e=this.data;if(!t||!e)return;const n=this.resultOpts.view;n==="deformed"?this.buildDeformed(t,e):Ho.includes(n)&&this.buildDiagram(t,n),(n==="reactions"||n==="deformed"||Ho.includes(n))&&n==="reactions"&&this.buildReactions(t,e)}buildDeformed(t,e){const n=this.resultOpts.deformScale,s=new Map(e.joints.map(c=>[c.id,c])),r=[],a=[];for(const c of t.frames){const h=e.frames.find(f=>f.id===c.id);if(!h)continue;const d=Qt(s.get(h.i)),u=Qt(c.axes[0]);for(let f=0;f<c.x.length-1;f++)for(const p of[f,f+1]){const m=d.clone().addScaledVector(u,c.x[p]);r.push(m.x,m.y,m.z);const g=c.disp[p];a.push(g[0]*n,g[1]*n,g[2]*n)}}if(!r.length)return;const o=r.map((c,h)=>c+a[h]),l=this.lines(o,this.theme.deformed,3);if(this.resultGroup.add(l),this.deformed={geo:l.geometry,base:new Float32Array(r),delta:new Float32Array(a)},this.resultOpts.showValues){let c=-1,h=0;for(const[u,f]of Object.entries(t.disp)){const p=Math.hypot(f[0],f[1],f[2]);p>c&&(c=p,h=Number(u))}const d=s.get(h);if(d&&c>0){const u=t.disp[h],f=Qt(d).add(new L(u[0],u[1],u[2]).multiplyScalar(n));this.resultGroup.add(this.label(`max ${zn(c/on().kSmall)} ${on().small} (J${h})`,f,"result"))}}}buildDiagram(t,e){const n=this.data,s=new Map(n.joints.map(m=>[m.id,m]));let r=0;for(const m of t.frames)for(const g of m[e])r=Math.max(r,Math.abs(g));if(r<1e-9){this.resultGroup.add(this.label(`${e} = 0 everywhere`,this.target.clone(),"result"));return}const a=this.span*.12/r*this.resultOpts.forceScale,o=e==="P"||e==="V2"||e==="V3"?"F":"M",l=[],c=[],h=[],d=new Ht(this.theme.pos),u=new Ht(this.theme.neg);for(const m of t.frames){const g=n.frames.find(I=>I.id===m.id);if(!g)continue;const v=Qt(s.get(g.i)),_=Qt(m.axes[0]),M=e==="M3"?Qt(m.axes[1]).negate():Qt(e==="M2"||e==="V3"?m.axes[2]:m.axes[1]),x=m[e],D=I=>v.clone().addScaledVector(_,m.x[I]),A=I=>D(I).addScaledVector(M,x[I]*a);for(let I=0;I<m.x.length-1;I++){const y=D(I),S=D(I+1),C=A(I),V=A(I+1),F=x[I]>=0?d:u,z=x[I+1]>=0?d:u;l.push(...y.toArray(),...C.toArray(),...S.toArray(),...C.toArray(),...V.toArray(),...S.toArray());for(const q of[F,F,z,F,z,z])c.push(q.r,q.g,q.b);h.push(...C.toArray(),...V.toArray())}h.push(...D(0).toArray(),...A(0).toArray());const P=m.x.length-1;if(h.push(...D(P).toArray(),...A(P).toArray()),this.resultOpts.showValues){const I=new Set([0,P]);let y=0;for(let S=1;S<P;S++)Math.abs(x[S])>Math.abs(x[y])&&(y=S);Math.abs(x[y])>Math.max(Math.abs(x[0]),Math.abs(x[P]))*1.02&&I.add(y);for(const S of I)Math.abs(x[S])<r*.01||this.resultGroup.add(this.label(jt(x[S],o,3),A(S),"result small"))}}const f=new Ce;f.setAttribute("position",new fe(l,3)),f.setAttribute("color",new fe(c,3));const p=new we(f,new ws({vertexColors:!0,transparent:!0,opacity:.45,side:ln,depthWrite:!1}));this.resultGroup.add(p),this.resultGroup.add(this.lines(h,this.theme.frame,1.5,void 0,{opacity:.8}))}buildReactions(t,e){const n=new Map(e.joints.map(h=>[h.id,h])),s=this.glyph()*3,r=this.theme.reaction;let a=0;for(const h of Object.values(t.reactions))a=Math.max(a,Math.abs(h[0]),Math.abs(h[1]),Math.abs(h[2]));const o=Math.max(a*1e-6,1e-9),l=[new L(1,0,0),new L(0,1,0),new L(0,0,1)],c=["FX","FY","FZ","MX","MY","MZ"];for(const[h,d]of Object.entries(t.reactions)){const u=n.get(Number(h));if(!u)continue;const f=Qt(u),p=[];for(let m=0;m<3;m++){if(Math.abs(d[m])<=o)continue;const g=l[m].clone().multiplyScalar(Math.sign(d[m]));this.resultGroup.add(this.arrow(f.clone().addScaledVector(g,-s),f,r,3)),p.push(`${c[m]} ${Ae(d[m],"F")}`)}for(let m=3;m<6;m++){if(Math.abs(d[m])<=o)continue;const g=l[m-3].clone().multiplyScalar(Math.sign(d[m]));this.resultGroup.add(this.arrow(f,f.clone().addScaledVector(g,s*.8),r,3,!0)),p.push(`${c[m]} ${Ae(d[m],"M")}`)}this.resultOpts.showValues&&p.length&&this.resultGroup.add(this.label(`J${h}
`+p.join(`
`),f.clone().add(new L(0,0,-s*.6)),"result react"))}}setOverlay(t,e){for(const n of this.overlayObjs)this.overlayGroup.remove(n);if(this.clearGroup(this.overlayGroup),this.overlayObjs=[],t&&t.length){const n=[];for(const[r,a]of t)n.push(...r.toArray(),...a.toArray());const s=this.lines(n,this.theme.sel,2,void 0,{dashed:!0});this.overlayGroup.add(s)}if(e){const n=new Ce;n.setAttribute("position",new fe(e.toArray(),3));const s=new Aa(n,new Pr({size:20,sizeAttenuation:!1,map:this.jointTex,color:this.theme.sel,transparent:!0,opacity:.6,depthTest:!1}));s.renderOrder=20,this.overlayGroup.add(s)}this.requestRender()}pick(t,e,n){const s=this.data;if(!s)return null;let r=null,a=n;for(const h of s.joints){const d=this.toScreen(Qt(h));if(d.behind)continue;const u=Math.hypot(d.x-t,d.y-e);u<a&&(a=u,r=Ie("j",h.id))}if(r)return r;const o=new Map(s.joints.map(h=>[h.id,h]));a=n;for(const h of s.frames){const d=o.get(h.i),u=o.get(h.j);if(!d||!u)continue;const f=this.toScreen(Qt(d)),p=this.toScreen(Qt(u));if(f.behind&&p.behind)continue;const m=__(t,e,f.x,f.y,p.x,p.y);m<a&&(a=m,r=Ie("f",h.id))}if(r)return r;let l=1/0;const c=this.camera.position;for(const h of s.areas){const d=h.joints.map(m=>o.get(m)).filter(Boolean);if(d.length<3)continue;const u=d.map(m=>this.toScreen(Qt(m)));if(u.some(m=>m.behind)||!x_(t,e,u))continue;const p=d.reduce((m,g)=>m.add(Qt(g)),new L).multiplyScalar(1/d.length).distanceTo(c);p<l&&(l=p,r=Ie("a",h.id))}return r}boxPick(t,e,n,s,r){const a=this.data;if(!a)return[];const o=Math.min(t,n),l=Math.max(t,n),c=Math.min(e,s),h=Math.max(e,s),d=m=>!m.behind&&m.x>=o&&m.x<=l&&m.y>=c&&m.y<=h,u=new Map(a.joints.map(m=>[m.id,this.toScreen(Qt(m))])),f=[];for(const m of a.joints)d(u.get(m.id))&&f.push(Ie("j",m.id));const p=(m,g)=>M_(m.x,m.y,g.x,g.y,o,c,l,h);for(const m of a.frames){const g=u.get(m.i),v=u.get(m.j);!g||!v||(r?d(g)||d(v)||p(g,v):d(g)&&d(v))&&f.push(Ie("f",m.id))}for(const m of a.areas){const g=m.joints.map(_=>u.get(_)).filter(Boolean);if(!g.length)continue;(r?g.some(d)||g.some((_,M)=>p(_,g[(M+1)%g.length])):g.every(d))&&f.push(Ie("a",m.id))}return f}jointScreen(t){return this.toScreen(Qt(t))}dispose(){this.renderer.dispose()}}function __(i,t,e,n,s,r){const a=s-e,o=r-n,l=a*a+o*o;let c=l>0?((i-e)*a+(t-n)*o)/l:0;return c=Math.max(0,Math.min(1,c)),Math.hypot(i-(e+c*a),t-(n+c*o))}function x_(i,t,e){let n=!1;for(let s=0,r=e.length-1;s<e.length;r=s++){const a=e[s],o=e[r];a.y>t!=o.y>t&&i<(o.x-a.x)*(t-a.y)/(o.y-a.y)+a.x&&(n=!n)}return n}function Sr(i,t,e,n,s,r,a,o){const l=(c,h,d,u,f,p)=>Math.sign((d-c)*(p-h)-(u-h)*(f-c));return l(i,t,e,n,s,r)!==l(i,t,e,n,a,o)&&l(s,r,a,o,i,t)!==l(s,r,a,o,e,n)}function M_(i,t,e,n,s,r,a,o){return Sr(i,t,e,n,s,r,a,r)||Sr(i,t,e,n,a,r,a,o)||Sr(i,t,e,n,a,o,s,o)||Sr(i,t,e,n,s,o,s,r)}const y_=550;class S_{constructor(t,e){it(this,"pts",new Map);it(this,"mode","idle");it(this,"lpTimer");it(this,"lastPinch",0);it(this,"lastMid",{x:0,y:0});it(this,"down",t=>{var e,n;if(this.el.setPointerCapture(t.pointerId),this.pts.set(t.pointerId,{x:t.clientX,y:t.clientY,sx:t.clientX,sy:t.clientY,t:performance.now(),type:t.pointerType,button:t.button}),this.pts.size===1)this.mode="pending",t.pointerType!=="mouse"&&(this.lpTimer=window.setTimeout(()=>{var s;this.mode==="pending"&&this.pts.size===1&&(this.mode="done",(s=navigator.vibrate)==null||s.call(navigator,15),this.h.longPress(t.clientX,t.clientY,t))},y_));else if(this.pts.size===2){this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.mode="multi";const[s,r]=[...this.pts.values()];this.lastPinch=Math.hypot(s.x-r.x,s.y-r.y),this.lastMid={x:(s.x+r.x)/2,y:(s.y+r.y)/2}}t.preventDefault()});it(this,"move",t=>{var r,a,o,l;const e=this.pts.get(t.pointerId);if(!e){t.pointerType==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}const n=t.clientX-e.x,s=t.clientY-e.y;if(e.x=t.clientX,e.y=t.clientY,this.mode==="multi"&&this.pts.size>=2){const[c,h]=[...this.pts.values()],d=Math.hypot(c.x-h.x,c.y-h.y),u={x:(c.x+h.x)/2,y:(c.y+h.y)/2};this.h.pan(u.x-this.lastMid.x,u.y-this.lastMid.y),this.lastPinch>0&&d>0&&this.h.zoom(this.lastPinch/d,u.x,u.y),this.lastPinch=d,this.lastMid=u;return}if(this.mode==="pending"){if(Math.hypot(t.clientX-e.sx,t.clientY-e.sy)<this.slop(e.type)){e.type==="mouse"&&this.h.hover(t.clientX,t.clientY,t);return}this.clearLP(),!t.shiftKey&&(e.type==="mouse"?e.button===2:!0)&&this.h.drag&&((a=(r=this.h).wantsDrag)!=null&&a.call(r,e.sx,e.sy,t))?(this.mode="drag",this.h.drag(e.sx,e.sy,"start")):e.button===1||e.button===2||t.shiftKey?this.mode="pan":this.h.wantsBox(t)?this.mode="box":this.mode="orbit"}this.mode==="orbit"?this.h.orbit(n,s):this.mode==="pan"?this.h.pan(n,s):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"move"):this.mode==="drag"&&((l=(o=this.h).drag)==null||l.call(o,t.clientX,t.clientY,"move"))});it(this,"up",t=>{var n,s;const e=this.pts.get(t.pointerId);e&&(this.pts.delete(t.pointerId),this.clearLP(),this.mode==="pending"&&this.pts.size===0?e.button===2&&e.type==="mouse"?this.h.longPress(t.clientX,t.clientY,t):(e.button===0||e.type!=="mouse")&&this.h.tap(t.clientX,t.clientY,t):this.mode==="box"?this.h.box(e.sx,e.sy,t.clientX,t.clientY,"end"):this.mode==="drag"&&((s=(n=this.h).drag)==null||s.call(n,t.clientX,t.clientY,"end")),this.pts.size===0?this.mode="idle":this.mode==="multi"&&this.pts.size===1&&(this.mode="done"))});it(this,"cancel",t=>{var e,n;this.pts.delete(t.pointerId),this.clearLP(),this.mode==="box"&&this.h.box(0,0,0,0,"cancel"),this.mode==="drag"&&((n=(e=this.h).drag)==null||n.call(e,0,0,"cancel")),this.pts.size===0&&(this.mode="idle")});it(this,"wheel",t=>{t.preventDefault();let e=t.deltaY;t.deltaMode===1&&(e*=30);const n=t.ctrlKey?.01:.0015;this.h.zoom(Math.exp(e*n),t.clientX,t.clientY)});this.el=t,this.h=e,t.style.touchAction="none",t.addEventListener("pointerdown",this.down),t.addEventListener("pointermove",this.move),t.addEventListener("pointerup",this.up),t.addEventListener("pointercancel",this.cancel),t.addEventListener("lostpointercapture",n=>this.pts.has(n.pointerId)&&this.cancel(n)),t.addEventListener("wheel",this.wheel,{passive:!1}),t.addEventListener("contextmenu",n=>n.preventDefault());for(const n of["gesturestart","gesturechange","gestureend"])t.addEventListener(n,s=>s.preventDefault())}slop(t){return t==="mouse"?4:10}clearLP(){this.lpTimer!==void 0&&clearTimeout(this.lpTimer),this.lpTimer=void 0}}function T(i,t=null,...e){const n=document.createElement(i);if(t)for(const[s,r]of Object.entries(t))r==null||r===!1||(s.startsWith("on")&&typeof r=="function"?n.addEventListener(s.slice(2).toLowerCase(),r):s==="class"?n.className=String(r):s==="style"&&typeof r=="object"?Object.assign(n.style,r):s in n&&typeof r!="string"?n[s]=r:n.setAttribute(s,r===!0?"":String(r)));for(const s of e)s!=null&&s!==!1&&n.append(s);return n}function eh(i){const t=i.trim().replace(/\s/g,"").replace(",",".");return t===""?NaN:Number(t)}function ae(i,t,e={}){const n=e.q,s=c=>String(n?d_(c,n):c),r=T("input",{type:"text",inputmode:"decimal",autocomplete:"off",spellcheck:"false",value:t===null||!Number.isFinite(t)?"":s(t),placeholder:e.mixed?"(mixed)":e.placeholder??""}),a=T("div",{class:"field-err"}),o=T("label",{class:"field"},T("span",{class:"field-label"},i),T("span",{class:"field-input"},r,e.unit||n?T("span",{class:"unit"},n?qt(n):e.unit):null),a),l=()=>{const c=eh(r.value);let h="";return r.value.trim()===""&&e.mixed?h="":Number.isFinite(c)?e.positive&&c<=0?h="Must be > 0":e.min!==void 0&&c<e.min?h=`Must be ≥ ${e.min}`:e.max!==void 0&&c>e.max&&(h=`Must be ≤ ${e.max}`):h="Enter a number",a.textContent=h,o.classList.toggle("invalid",!!h),!h};return r.addEventListener("input",l),r.addEventListener("focus",()=>r.select()),{row:o,input:r,get:()=>{if(!l())return NaN;const c=eh(r.value);return n&&Number.isFinite(c)?Mu(c,n):c},set:c=>{r.value=s(c),l()}}}function Vs(i,t){const e=T("input",{type:"text",value:t,autocomplete:"off",spellcheck:"false"});return{row:T("label",{class:"field"},T("span",{class:"field-label"},i),T("span",{class:"field-input"},e)),input:e,get:()=>e.value.trim(),set:s=>e.value=s}}function Qe(i,t,e){const n=T("select",null,...t.map(([r,a])=>T("option",{value:r,selected:r===e},a)));return{row:T("label",{class:"field"},T("span",{class:"field-label"},i),T("span",{class:"field-input"},n)),input:n,get:()=>n.value,set:r=>n.value=r}}function fl(i,t){const e=T("input",{type:"checkbox",checked:t});return{row:T("label",{class:"check"},e,T("span",null,i)),input:e,get:()=>e.checked,set:s=>e.checked=s}}let Wo=0;const b_=()=>Wo>0;function oe(i){const t=T("div",{class:"dlg-backdrop"}),e=()=>{var o;t.isConnected&&(t.remove(),Wo--,document.removeEventListener("keydown",a,!0),(o=i.onClose)==null||o.call(i))},n=async o=>{(o.action?await o.action():void 0)!==!1&&e()},s=i.buttons.map(o=>T("button",{class:"btn "+(o.kind??"plain"),type:"button",onclick:()=>n(o)},o.label)),r=T("div",{class:"dlg"+(i.wide?" wide":""),role:"dialog","aria-modal":"true","aria-label":i.title},T("div",{class:"dlg-head"},T("h2",null,i.title),T("button",{class:"icon-btn","aria-label":"Close",onclick:e},"✕")),T("div",{class:"dlg-body"},i.body),T("div",{class:"dlg-foot"},...s));t.append(r),t.addEventListener("pointerdown",o=>{o.target===t&&e()});const a=o=>{if(o.key==="Escape")o.stopPropagation(),e();else if(o.key==="Enter"&&!(o.target instanceof HTMLTextAreaElement)&&!(o.target instanceof HTMLButtonElement)){const l=i.buttons.find(c=>c.kind==="primary");l&&(o.preventDefault(),o.stopPropagation(),n(l))}};if(document.addEventListener("keydown",a,!0),document.body.append(t),Wo++,matchMedia("(pointer: fine)").matches){const o=r.querySelector(".dlg-body input, .dlg-body select");o==null||o.focus()}return{close:e,el:r}}function rs(i,t,e="OK",n=!1){return new Promise(s=>{let r=!1;oe({title:i,body:T("p",{class:"msg"},t),buttons:[{label:"Cancel"},{label:e,kind:n?"danger":"primary",action:()=>void(r=!0)}],onClose:()=>s(r)})})}function mi(i,t){return new Promise(e=>{oe({title:i,body:typeof t=="string"?T("p",{class:"msg"},t):t,buttons:[{label:"OK",kind:"primary"}],onClose:()=>e()})})}let br=null;function Wt(i,t="info",e=3200){br||(br=T("div",{class:"toasts","aria-live":"polite"}),document.body.append(br));const n=T("div",{class:"toast "+t},i);br.append(n),setTimeout(()=>{n.classList.add("out"),setTimeout(()=>n.remove(),300)},e)}let Kn=null;function Vr(){Kn==null||Kn.close()}function nh(i,t,e,n){var d,u;Vr();const s=T("div",{class:"popup-menu",role:"menu"});for(const f of i){if(f.separator){s.append(T("div",{class:"sep"}));continue}if(f.heading){s.append(T("div",{class:"menu-heading"},f.heading));continue}const p=((d=f.disabled)==null?void 0:d.call(f))??!1,m=(u=f.checked)==null?void 0:u.call(f),g=T("button",{class:"menu-item",role:"menuitem",type:"button",disabled:p,onclick:()=>{var v;Vr(),(v=f.action)==null||v.call(f)}},T("span",{class:"mi-check"},m===void 0?"":m?"✓":""),T("span",{class:"mi-label"},f.label??""),T("span",{class:"mi-short"},f.shortcut??""));s.append(g)}s.addEventListener("contextmenu",f=>f.preventDefault()),document.body.append(s);const r=s.getBoundingClientRect();let a=t,o=e;if(n){const f=n.getBoundingClientRect();a=f.left,o=f.bottom+2}a=Math.max(4,Math.min(a,window.innerWidth-r.width-4)),o+r.height>window.innerHeight-4&&(o=Math.max(4,(n?n.getBoundingClientRect().top:e)-r.height-2)),s.style.left=a+"px",s.style.top=Math.max(4,o)+"px",s.style.maxHeight=window.innerHeight-8+"px";const l=f=>{!s.contains(f.target)&&f.target!==n&&h()},c=f=>{f.key==="Escape"&&h()},h=()=>{s.remove(),document.removeEventListener("pointerdown",l,!0),document.removeEventListener("keydown",c,!0),n==null||n.classList.remove("open"),(Kn==null?void 0:Kn.el)===s&&(Kn=null)};setTimeout(()=>{document.addEventListener("pointerdown",l,!0),document.addEventListener("keydown",c,!0)},0),n==null||n.classList.add("open"),Kn={el:s,close:h}}const E_=i=>i.classList.contains("open"),Su={select:"Tap an object to select it. Drag to rotate, two fingers to pan/zoom. Long-press for options. Drag a selected joint (right-drag with a mouse) to move it.",joint:"Tap the grid to place joints (snaps to grid and existing joints).",frame:"Tap start and end points to draw frames; drawing continues from the last point. Tap Done to stop.",area:"Tap the corner points of the area, then tap the first point again or Done to close it.",box:"Drag a box: left→right selects objects fully inside, right→left selects anything touched."};class w_{constructor(t){it(this,"tool","select");it(this,"multi",!1);it(this,"chain",[]);it(this,"hoverSnap",null);it(this,"boxEl");it(this,"dragState",null);this.app=t,this.boxEl=document.createElement("div"),this.boxEl.className="select-box",this.boxEl.hidden=!0,document.body.append(this.boxEl)}setTool(t){this.finishChain(!1),this.tool=t,this.hoverSnap=null,this.updateOverlay(),this.app.onToolChanged()}tol(t){return t.pointerType==="mouse"?12:24}snap(t,e,n){const s=this.app.viewer,r=this.app.model.data;let a=null,o=this.tol(n);for(const p of r.joints){const m=s.jointScreen(p);if(m.behind)continue;const g=Math.hypot(m.x-t,m.y-e);g<o&&(o=g,a={pos:new L(p.x,p.y,p.z),joint:p.id})}if(a)return a;const l=s.workPlanePoint(t,e);if(!l)return null;const{gridSpacing:c,workPlane:h,elevation:d}=r.settings,u=p=>Math.round(p/c)*c;h==="XY"?l.set(u(l.x),u(l.y),d):h==="XZ"?l.set(u(l.x),d,u(l.z)):l.set(d,u(l.y),u(l.z));const f=p=>Math.round(p*1e9)/1e9;return l.set(f(l.x),f(l.y),f(l.z)),{pos:l,joint:null}}jointAt(t){return t.joint??this.app.model.addJoint(t.pos.x,t.pos.y,t.pos.z)}tap(t,e,n){const s=this.app.model;switch(this.tool){case"select":case"box":{const r=this.app.viewer.pick(t,e,this.tol(n)),a=this.multi||n.shiftKey||n.ctrlKey||n.metaKey;r?this.app.select([r],a?"toggle":"replace"):a||this.app.select([],"replace");break}case"joint":{const r=this.snap(t,e,n);if(!r)return Wt("Point is not on the work plane – rotate the view or change the work plane.","warn");const a=this.jointAt(r);this.app.select([Ie("j",a)],"replace");break}case"frame":{const r=this.snap(t,e,n);if(!r)return Wt("Point is not on the work plane – rotate the view or change the work plane.","warn");s.commit("draw frame",()=>{const a=this.jointAt(r),o=this.chain[0];if(o!==void 0&&o!==a){const l=s.addFrame(o,a);l!==null&&this.app.select([Ie("f",l)],"replace")}this.chain=[a]});break}case"area":{const r=this.snap(t,e,n);if(!r)return Wt("Point is not on the work plane – rotate the view or change the work plane.","warn");if(r.joint!==null&&this.chain.length>=3&&r.joint===this.chain[0]){this.finishChain(!0);break}if(r.joint!==null&&this.chain.includes(r.joint))return Wt("Joint already used in this area","warn");this.chain.push(this.jointAt(r));break}}this.updateOverlay(),this.app.updateStatus()}hover(t,e,n){var s;(this.tool==="joint"||this.tool==="frame"||this.tool==="area")&&(this.hoverSnap=this.snap(t,e,n),this.updateOverlay(),this.app.setCoordReadout(((s=this.hoverSnap)==null?void 0:s.pos)??null))}wantsBox(t){return this.tool==="box"||this.tool==="select"&&t.pointerType==="mouse"&&(t.ctrlKey||t.metaKey)}box(t,e,n,s,r){const a=this.boxEl;if(r==="cancel"){a.hidden=!0;return}const o=n<t;if(r==="move"){a.hidden=!1,a.classList.toggle("crossing",o),Object.assign(a.style,{left:Math.min(t,n)+"px",top:Math.min(e,s)+"px",width:Math.abs(n-t)+"px",height:Math.abs(s-e)+"px"});return}a.hidden=!0;const l=this.app.viewer.boxPick(t,e,n,s,o);this.app.select(l,this.multi?"add":"replace"),Wt(`${l.length} object(s) ${o?"touched":"inside box"}`,"info",1500)}wantsDrag(t,e,n){if(this.chain.length)return!1;const s=[...this.app.selection];if(s.length!==1)return!1;const{kind:r,id:a}=Ds(s[0]);if(r!=="j")return!1;const o=this.app.model.joint(a);if(!o)return!1;const l=this.app.viewer.jointScreen(o);return!l.behind&&Math.hypot(l.x-t,l.y-e)<=this.tol(n)}dragTarget(t,e,n){const s=this.app.model.joint(t);if(!s)return null;const{gridSpacing:r,workPlane:a}=this.app.model.data.settings,o=a==="XY"?s.z:a==="XZ"?s.y:s.x,l=this.app.viewer.workPlanePoint(e,n,o);if(!l)return null;const c=h=>Math.round(Math.round(h/r)*r*1e9)/1e9;return a==="XY"?l.set(c(l.x),c(l.y),s.z):a==="XZ"?l.set(c(l.x),s.y,c(l.z)):l.set(s.x,c(l.y),c(l.z)),l}drag(t,e,n){if(n==="start"){const{id:d}=Ds([...this.app.selection][0]);this.dragState={id:d,target:null};return}const s=this.dragState;if(!s)return;const r=this.app.model;if(n==="cancel"){this.dragState=null,this.updateOverlay(),this.app.setCoordReadout(null);return}if(n==="move"){if(s.target=this.dragTarget(s.id,t,e)??s.target,!s.target)return;const d=[],u=r.jointMap(),f=p=>{const m=u.get(p);return p===s.id?s.target:new L(m.x,m.y,m.z)};for(const p of r.data.frames)(p.i===s.id||p.j===s.id)&&d.push([f(p.i),f(p.j)]);for(const p of r.data.areas){const m=p.joints.indexOf(s.id);if(m<0)continue;const g=p.joints.length;d.push([f(p.joints[(m+g-1)%g]),s.target],[s.target,f(p.joints[(m+1)%g])])}this.app.viewer.setOverlay(d,s.target),this.app.setCoordReadout(s.target);return}this.dragState=null;const a=r.joint(s.id);if(this.updateOverlay(),this.app.setCoordReadout(null),!a||!s.target)return;const o=s.target.x-a.x,l=s.target.y-a.y,c=s.target.z-a.z;if(Math.abs(o)+Math.abs(l)+Math.abs(c)<1e-12)return;const h=r.moveJoints(new Set([s.id]),o,l,c);h&&Wt(h,"warn")}finishChain(t=!0){if(this.tool==="area"&&t&&this.chain.length>=3){const e=this.app.model.addArea(this.chain);e!==null&&this.app.select([Ie("a",e)],"replace")}else this.tool==="area"&&t&&this.chain.length>0&&Wt("An area needs at least 3 points","warn");this.chain=[],this.updateOverlay(),this.app.updateStatus()}cancel(){this.chain.length?(this.chain=[],this.updateOverlay()):this.app.select([],"replace"),this.app.updateStatus()}updateOverlay(){var o;const t=this.app.viewer,e=this.app.model,n=this.chain.map(l=>e.joint(l)).filter(Boolean).map(l=>new L(l.x,l.y,l.z)),s=[],r=(o=this.hoverSnap)==null?void 0:o.pos;if(this.tool==="frame"&&n.length&&r&&s.push([n[0],r]),this.tool==="area"&&n.length){for(let c=0;c+1<n.length;c++)s.push([n[c],n[c+1]]);const l=r??n[n.length-1];r&&s.push([n[n.length-1],r]),n.length>=2&&s.push([l,n[0]])}let a=null;(this.tool==="joint"||this.tool==="frame"||this.tool==="area")&&(a=r??(n.length?n[n.length-1]:null)),t.setOverlay(s,a)}statusText(){return this.tool==="frame"&&this.chain.length?`Frame from joint ${this.chain[0]} – tap the next point, or Done to stop.`:this.tool==="area"&&this.chain.length?`Area: ${this.chain.length} point(s) [${this.chain.join(", ")}] – tap the next point, the first point, or Done.`:Su[this.tool]}static valid(t,e){const{kind:n,id:s}=Ds(e),r=t.model;return n==="j"?!!r.joint(s):n==="f"?!!r.frame(s):!!r.area(s)}}function Na(i,t){let e;switch(i){case"L1":return[1,0,0];case"L2":return[0,1,0];case"L3":return[0,0,1];case"GX":e=[1,0,0];break;case"GY":e=[0,1,0];break;case"GZ":e=[0,0,1];break;case"GRAV":e=[0,0,-1];break}return[Dr(t[0],e),Dr(t[1],e),Dr(t[2],e)]}function A_(i){let t=0,e=0,n=0;for(let s=0;s<i.length;s++){const r=i[s],a=i[(s+1)%i.length];t+=(r[1]-a[1])*(r[2]+a[2]),e+=(r[2]-a[2])*(r[0]+a[0]),n+=(r[0]-a[0])*(r[1]+a[1])}return Math.hypot(t,e,n)/2}function T_(i,t,e){const n=Ps(t,i),s=Bs(n),r=[n[0]/s,n[1]/s,n[2]/s],a=Math.min(Math.max(Dr(Ps(e,i),r),0),s),o=Bs(ys(Ps(e,i),r));return[[0,0],[a,o],[s,0]]}function C_(i){let t=0;for(let e=0;e+1<i.length;e++)t+=(i[e+1][0]-i[e][0])*(i[e][1]+i[e+1][1])/2;return t}function R_(i,t,e,n){const s=i.length,r=i.map((c,h)=>Bs(Ps(i[(h+1)%s],c)));let a;if(s===4&&t==="one-way"){const c=(r[0]+r[2])/2,h=(r[1]+r[3])/2,d=c>=h,u=d?h:c;a=r.map((f,p)=>p%2===0===d?[[0,u/2],[f,u/2]]:[[0,0],[f,0]])}else if(s===4){const h=Math.min((r[0]+r[2])/2,(r[1]+r[3])/2)/2;a=r.map(d=>d>2*h?[[0,0],[h,h],[d-h,h],[d,0]]:[[0,0],[d/2,d/2],[d,0]])}else{t==="one-way"&&e.push(`Area ${n}: one-way distribution needs 4 joints; two-way used.`);let c;if(s===3){const[h,d,u]=i,f=r[1],p=r[2],m=r[0],g=f+p+m;c=[(f*h[0]+p*d[0]+m*u[0])/g,(f*h[1]+p*d[1]+m*u[1])/g,(f*h[2]+p*d[2]+m*u[2])/g]}else{c=[0,0,0];for(const h of i)c[0]+=h[0]/s,c[1]+=h[1]/s,c[2]+=h[2]/s}a=i.map((h,d)=>T_(h,i[(d+1)%s],c))}const o=a.reduce((c,h)=>c+C_(h),0),l=A_(i);if(o>0){const c=l/o;for(const h of a)for(const d of h)d[1]*=c}return a}function L_(i,t,e){const n=new Map,s=new Map;for(const a of i.frames)s.set(`${a.i}-${a.j}`,a),s.set(`${a.j}-${a.i}`,a);const r=new Map;for(const a of i.areaLoads)r.set(a.area,(r.get(a.area)??0)+a.q);for(const a of i.areas){const o=r.get(a.id)??0;if(!o)continue;const l=a.joints.map(u=>t.get(u));if(l.some(u=>!u)){e.push(`Area ${a.id}: references a missing joint; load ignored.`);continue}const c=l.map(u=>[u.x,u.y,u.z]),h=R_(c,a.distribution,e,a.id),d=c.length;for(let u=0;u<d;u++){const f=h[u];if(f.every(x=>x[1]===0))continue;const p=a.joints[u],m=a.joints[(u+1)%d],g=s.get(`${p}-${m}`);if(!g){e.push(`Area ${a.id}: edge ${p}-${m} has no frame; its share of the load is ignored.`);continue}const v=g.i!==p,_=h[u][f.length-1][0],M=n.get(g.id)??[];for(let x=0;x+1<f.length;x++){const[D,A]=f[x],[P,I]=f[x+1];P-D<=1e-12||(v?M.push({x1:_-P,x2:_-D,w1:o*I,w2:o*A}):M.push({x1:D,x2:P,w1:o*A,w2:o*I}))}n.set(g.id,M)}}return n}class P_{constructor(t){it(this,"n");it(this,"maxa");it(this,"heights");it(this,"a");it(this,"diag0",null);this.n=t.length,this.heights=t,this.maxa=new Int32Array(this.n+1);for(let e=0;e<this.n;e++)this.maxa[e+1]=this.maxa[e]+t[e]+1;this.a=new Float64Array(this.maxa[this.n])}add(t,e,n){if(t>e){const r=t;t=e,e=r}const s=e-t;if(s>this.heights[e])throw new Error("Skyline profile violated");this.a[this.maxa[e]+s]+=n}get(t,e){if(t>e){const s=t;t=e,e=s}const n=e-t;return n>this.heights[e]?0:this.a[this.maxa[e]+n]}factor(t=1e-10){const{n:e,maxa:n,heights:s,a:r}=this;this.diag0=new Float64Array(e);let a=0;for(let l=0;l<e;l++)this.diag0[l]=r[n[l]],a=Math.max(a,Math.abs(r[n[l]]));const o=a*1e-15;for(let l=0;l<e;l++){const c=l-s[l],h=n[l];for(let f=c+1;f<l;f++){const p=f-s[f],m=Math.max(p,c),g=n[f];let v=r[h+(l-f)];for(let _=m;_<f;_++)v-=r[g+(f-_)]*r[h+(l-_)];r[h+(l-f)]=v}let d=r[h];for(let f=c;f<l;f++){const p=h+(l-f),m=r[p],g=m/r[n[f]];d-=g*m,r[p]=g}const u=Math.abs(this.diag0[l]);if(!(d>t*u)||!(d>o))return l;r[h]=d}return-1}solve(t){const{n:e,maxa:n,heights:s,a:r}=this;for(let a=0;a<e;a++){const o=n[a];let l=t[a];for(let c=a-s[a];c<a;c++)l-=r[o+(a-c)]*t[c];t[a]=l}for(let a=0;a<e;a++)t[a]/=r[n[a]];for(let a=e-1;a>=0;a--){const o=n[a],l=t[a];for(let c=a-s[a];c<a;c++)t[c]-=r[o+(a-c)]*l}return t}}function D_(i){const t=i.length,e=new Uint8Array(t),n=[],s=i.map(a=>a.length),r=[...Array(t).keys()].sort((a,o)=>s[a]-s[o]);for(const a of r){if(e[a])continue;e[a]=1;const o=[a];for(let l=0;l<o.length;l++){const c=o[l];n.push(c);const h=i[c].filter(d=>!e[d]).sort((d,u)=>s[d]-s[u]);for(const d of h)e[d]=1,o.push(d)}}return n.reverse()}class Ye extends Error{}const ih=40;function I_(i,t){const e=new Float64Array(12);for(const n of i.points)Jc(n.p,n.a,t,e);for(const n of i.dists){const s=(n.x2-n.x1)/2,r=(n.x1+n.x2)/2;for(const a of gu){const o=r+a.x*s,l=n.x2>n.x1?(o-n.x1)/(n.x2-n.x1):0,c=(n.w1+(n.w2-n.w1)*l)*a.w*s;Jc([n.d[0]*c,n.d[1]*c,n.d[2]*c],o,t,e)}}return e}function U_(i,t,e){const n=[0,0,0],s=[0,0,0],r=(a,o)=>{n[0]+=a[0],n[1]+=a[1],n[2]+=a[2];const l=o-t;s[1]+=-l*a[2],s[2]+=l*a[1]};for(const a of i.points)(a.a<t||e&&a.a===t)&&r(a.p,a.a);for(const a of i.dists){const o=Math.min(a.x2,t);if(o<=a.x1)continue;const l=(o-a.x1)/2,c=(a.x1+o)/2;for(const h of gu){const d=c+h.x*l,u=a.x2>a.x1?(d-a.x1)/(a.x2-a.x1):0,f=(a.w1+(a.w2-a.w1)*u)*h.w*l;r([a.d[0]*f,a.d[1]*f,a.d[2]*f],d)}}return{F:n,M:s}}function Xo(i,t){const e=[0];for(let n=1;n<i.length;n++)e.push(e[n-1]+(i[n]-i[n-1])*(t[n]+t[n-1])/2);return e}function sh(i,t,e,n){const s=Xo(i,t),r=Xo(i,s),a=i[i.length-1],o=(n-e-r[r.length-1])/a;return r.map((l,c)=>l+e+o*i[c])}const bu=(i,t)=>[i[0]*t,i[1]*t,i[2]*t];function N_(i,t,e,n,s,r){const a=new Map,o=c=>{var h;return(c.case??((h=i.loadCases[0])==null?void 0:h.name))===t},l=L_({...i,areaLoads:i.areaLoads.filter(o)},s,r);for(const c of n){const h={points:[],dists:[]};for(const u of i.framePointLoads)if(u.frame===c.id&&u.P&&o(u)){const f=Na(u.dir,c.axes);h.points.push({a:Math.min(Math.max(u.rd,0),1)*c.L,p:bu(f,u.P)})}for(const u of i.frameUniformLoads)u.frame===c.id&&u.w&&o(u)&&h.dists.push({x1:0,x2:c.L,w1:u.w,w2:u.w,d:Na(u.dir,c.axes)});const d=Na("GRAV",c.axes);for(const u of l.get(c.id)??[])h.dists.push({...u,d});e&&c.selfWeight>0&&h.dists.push({x1:0,x2:c.L,w1:c.selfWeight,w2:c.selfWeight,d}),a.set(c.id,h)}return a}function F_(i,t){const e=c=>{const h=c(i);if(!h)return;const d=h.map(()=>0);for(const[u,f]of t){const p=c(u);if(p)for(let m=0;m<d.length;m++)d[m]+=f*p[m]}return d},n={};for(const c of Object.keys(i.disp))n[+c]=e(h=>h.disp[+c]);const s={};for(const c of Object.keys(i.reactions))s[+c]=e(h=>h.reactions[+c]);let r=0;for(const c of Object.values(n))r=Math.max(r,Math.hypot(c[0],c[1],c[2]));const a=i.frames.map((c,h)=>{const d=p=>e(m=>m.frames[h][p]),u=c.disp.map((p,m)=>{const g=[0,0,0];for(const[v,_]of t)for(let M=0;M<3;M++)g[M]+=_*v.frames[h].disp[m][M];return r=Math.max(r,Math.hypot(g[0],g[1],g[2])),g}),f={points:[],dists:[]};for(const[p,m]of t)if(m){for(const g of p.frames[h].loads.points)f.points.push({a:g.a,p:bu(g.p,m)});for(const g of p.frames[h].loads.dists)f.dists.push({...g,w1:g.w1*m,w2:g.w2*m})}return{id:c.id,L:c.L,axes:c.axes,endForces:e(p=>p.frames[h].endForces),x:[...c.x],P:d("P"),V2:d("V2"),V3:d("V3"),T:d("T"),M2:d("M2"),M3:d("M3"),disp:u,loads:f}}),o=c=>{const h=[0,0,0];for(const[d,u]of t)for(let f=0;f<3;f++)h[f]+=u*c(d)[f];return h},l=[...new Set(t.filter(([,c])=>c!==0).flatMap(([c])=>c.warnings))];return{disp:n,reactions:s,frames:a,warnings:l,stats:{...i.stats,maxDisp:r,sumLoad:o(c=>c.stats.sumLoad),sumReaction:o(c=>c.stats.sumReaction)}}}function O_(i,t){var n;if(!((n=i.loadCases)!=null&&n.length))throw new Ye("Define at least one load case.");const e=new Set;for(const s of i.loadCases){if(e.has(s.name))throw new Ye(`Load case name "${s.name}" is used more than once.`);e.add(s.name)}for(const s of t){if(e.has(s.name))throw new Ye(`Load combination name "${s.name}" is already used by another case or combination.`);e.add(s.name);for(const r of s.factors)if(!i.loadCases.some(a=>a.name===r.case))throw new Ye(`Load combination ${s.name} refers to unknown load case "${r.case}".`)}}function B_(i,t){var I;const e=[],n=new Map(i.joints.map(y=>[y.id,y])),s=new Map(i.materials.map(y=>[y.name,y])),r=new Map(i.sections.map(y=>[y.name,y]));if(i.frames.length===0)throw new Ye("The model has no frames to analyze.");O_(i,t);const a=new Set;for(const y of i.frames){if(!n.has(y.i)||!n.has(y.j))throw new Ye(`Frame ${y.id} references a missing joint.`);a.add(y.i),a.add(y.j)}for(const y of i.joints)!a.has(y.id)&&i.jointLoads.some(S=>S.joint===y.id&&S.f.some(C=>C!==0))&&e.push(`Joint ${y.id} is not connected to any frame; its load is ignored.`);const o=i.joints.filter(y=>a.has(y.id)),l=new Map(o.map((y,S)=>[y.id,S])),c=o.length,h=[];for(const y of i.frames){const S=n.get(y.i),C=n.get(y.j),V=[S.x,S.y,S.z],F=[C.x,C.y,C.z],z=Math.hypot(F[0]-V[0],F[1]-V[1],F[2]-V[2]);if(z<1e-9)throw new Ye(`Frame ${y.id} has zero length.`);const q=s.get(y.material);if(!q)throw new Ye(`Frame ${y.id}: material "${y.material}" is not defined.`);const G=r.get(y.section);if(!G)throw new Ye(`Frame ${y.id}: section "${y.section}" is not defined.`);const K=bi(G);if(!(q.E>0))throw new Ye(`Material ${q.name}: E must be positive.`);if(!(K.A>0&&K.I22>0&&K.I33>0&&K.J>0))throw new Ye(`Section ${G.name}: A, I22, I33 and J must be positive.`);const X=q.E/(2*(1+q.nu)),at=ko(V,F,y.beta),ht=t_(q.E,X,K.A,K.I22,K.I33,K.J,z),mt=r_(ht,y.relI,y.relJ);if(!mt)throw new Ye(`Frame ${y.id}: Invalid end releases cause an element mechanism (e.g. releasing axial or torsion at both ends).`);h.push({id:y.id,ji:l.get(y.i),jj:l.get(y.j),L:z,axes:at,R:e_(at),kl:ht,klCondensed:mt.klCondensed,condInfo:mt,relI:y.relI,relJ:y.relJ,E:q.E,A:K.A,I22:K.I22,I33:K.I33,selfWeight:q.gamma>0?q.gamma*K.A:0})}const d=Array.from({length:c},()=>[]);for(const y of h)d[y.ji].push(y.jj),d[y.jj].push(y.ji);const u=D_(d),f=new Int32Array(c*6).fill(-1);let p=0;for(const y of u){const S=o[y];for(let C=0;C<6;C++)S.r[C]||(f[y*6+C]=p++)}const m=y=>{const S=new Int32Array(12);for(let C=0;C<6;C++)S[C]=f[y.ji*6+C],S[6+C]=f[y.jj*6+C];return S};let g=null;if(p>0){const y=new Int32Array(p),S=h.map(m);for(const V of S){let F=1/0;for(const z of V)z>=0&&z<F&&(F=z);for(const z of V)z>=0&&(y[z]=Math.max(y[z],z-F))}g=new P_(y),h.forEach((V,F)=>{const z=i_(V.klCondensed,V.R),q=S[F];for(let G=0;G<12;G++){const K=q[G];if(!(K<0))for(let X=0;X<12;X++){const at=q[X];at<0||at<K||g.add(K,at,z[G*12+X])}}});const C=g.factor();if(C>=0){let V=`equation ${C}`;for(let F=0;F<c;F++)for(let z=0;z<6;z++)f[F*6+z]===C&&(V=`joint ${o[F].id} (${ni[z]})`);throw new Ye(`The structure is unstable (mechanism) at ${V}. Check supports and connectivity.`)}}else e.push("All degrees of freedom are restrained.");const v=i.settings.selfWeight?(I=i.loadCases.find(y=>y.type==="Dead"))==null?void 0:I.name:void 0;i.settings.selfWeight&&!v&&e.push("Self weight is on but there is no Dead load case; it was ignored.");const _=new Map,M=new Map;for(const y of i.loadCases){const S=[];M.set(y.name,N_(i,y.name,y.name===v,h,n,S)),_.set(y.name,S)}const x=new Map;for(const y of h){const S=[];for(let V=0;V<=ih;V++)S.push({x:y.L*V/ih,inc:!0});const C=[];for(const V of M.values())for(const F of V.get(y.id).points)F.a>1e-9&&F.a<y.L-1e-9&&!C.some(z=>Math.abs(z-F.a)<1e-12)&&(C.push(F.a),S.push({x:F.a,inc:!1},{x:F.a,inc:!0}));S.sort((V,F)=>V.x-F.x||Number(V.inc)-Number(F.inc)),x.set(y.id,S)}const D={};for(const y of i.loadCases){const S=M.get(y.name),C=[...e,..._.get(y.name)],V=h.map(U=>I_(S.get(U.id),U.L)),F=h.map((U,Z)=>a_(V[Z],U.condInfo)),z=new Float64Array(c*6);for(const U of i.jointLoads){if((U.case??i.loadCases[0].name)!==y.name)continue;const Z=l.get(U.joint);if(Z!==void 0)for(let ut=0;ut<6;ut++)z[Z*6+ut]+=U.f[ut]}const q=Float64Array.from(z),G=[0,0,0];for(let U=0;U<c;U++)for(let Z=0;Z<3;Z++)G[Z]+=z[U*6+Z];h.forEach((U,Z)=>{const ut=Yc(U.R,F[Z]);for(let Q=0;Q<6;Q++)z[U.ji*6+Q]-=ut[Q],z[U.jj*6+Q]-=ut[6+Q];for(let Q=0;Q<3;Q++)G[Q]-=ut[Q]+ut[6+Q]});const K=new Float64Array(c*6);if(g){const U=new Float64Array(p);for(let Z=0;Z<c*6;Z++)f[Z]>=0&&(U[f[Z]]=z[Z]);g.solve(U);for(let Z=0;Z<c*6;Z++)f[Z]>=0&&(K[Z]=U[f[Z]])}const X=new Float64Array(c*6),at=[];let ht=0;for(let U=0;U<c;U++)ht=Math.max(ht,Math.hypot(K[U*6],K[U*6+1],K[U*6+2]));h.forEach((U,Z)=>{const ut=S.get(U.id),Q=new Float64Array(12);for(let E=0;E<6;E++)Q[E]=K[U.ji*6+E],Q[6+E]=K[U.jj*6+E];const Pt=n_(U.R,Q),Dt=o_(Pt,V[Z],U.condInfo),At=new Float64Array(12);for(let E=0;E<12;E++){let b=V[Z][E];for(let k=0;k<12;k++)b+=U.kl[E*12+k]*Dt[k];At[E]=b}for(const E of U.condInfo.released)At[E]=0;const Xt=Yc(U.R,At);for(let E=0;E<6;E++)X[U.ji*6+E]+=Xt[E],X[U.jj*6+E]+=Xt[6+E];const $={id:U.id,L:U.L,axes:U.axes,endForces:Array.from(At),x:[],P:[],V2:[],V3:[],T:[],M2:[],M3:[],disp:[],loads:ut};for(const{x:E,inc:b}of x.get(U.id)){const{F:k,M:Y}=U_(ut,E,b),et=[-(At[0]+k[0]),-(At[1]+k[1]),-(At[2]+k[2])],J=-E,St=[At[3],At[4]+-J*At[2],At[5]+J*At[1]],dt=[-(St[0]+Y[0]),-(St[1]+Y[1]),-(St[2]+Y[2])];$.x.push(E),$.P.push(et[0]),$.V2.push(et[1]),$.V3.push(et[2]),$.T.push(dt[0]),$.M2.push(dt[1]),$.M3.push(dt[2])}if($.x.length>0){const E=$.x.length-1;U.relI&&(U.relI[0]&&($.P[0]=0),U.relI[1]&&($.V2[0]=0),U.relI[2]&&($.V3[0]=0),U.relI[3]&&($.T[0]=0),U.relI[4]&&($.M2[0]=0),U.relI[5]&&($.M3[0]=0)),U.relJ&&(U.relJ[0]&&($.P[E]=0),U.relJ[1]&&($.V2[E]=0),U.relJ[2]&&($.V3[E]=0),U.relJ[3]&&($.T[E]=0),U.relJ[4]&&($.M2[E]=0),U.relJ[5]&&($.M3[E]=0))}const st=Xo($.x,$.P.map(E=>E/(U.E*U.A))),R=(Dt[6]-Dt[0]-st[st.length-1])/U.L,wt=$.x.map((E,b)=>Dt[0]+st[b]+R*E),nt=sh($.x,$.M3.map(E=>E/(U.E*U.I33)),Dt[1],Dt[7]),xt=sh($.x,$.M2.map(E=>-E/(U.E*U.I22)),Dt[2],Dt[8]),[lt,It,gt]=U.axes;for(let E=0;E<$.x.length;E++){const b=[lt[0]*wt[E]+It[0]*nt[E]+gt[0]*xt[E],lt[1]*wt[E]+It[1]*nt[E]+gt[1]*xt[E],lt[2]*wt[E]+It[2]*nt[E]+gt[2]*xt[E]];$.disp.push(b),ht=Math.max(ht,Math.hypot(b[0],b[1],b[2]))}at.push($)});const mt={},Nt={},Jt=[0,0,0];o.forEach((U,Z)=>{if(mt[U.id]=Array.from(K.subarray(Z*6,Z*6+6)),U.r.some(Boolean)){const ut=[0,0,0,0,0,0];for(let Q=0;Q<6;Q++)U.r[Q]&&(ut[Q]=X[Z*6+Q]-q[Z*6+Q]);Nt[U.id]=ut;for(let Q=0;Q<3;Q++)Jt[Q]+=ut[Q]}});for(const U of i.joints)mt[U.id]||(mt[U.id]=[0,0,0,0,0,0]);D[y.name]={disp:mt,reactions:Nt,frames:at,warnings:[...new Set(C)],stats:{joints:c,frames:h.length,equations:p,maxDisp:ht,sumLoad:G,sumReaction:Jt}}}const A=i.loadCases.map(y=>({name:y.name,kind:"case"})),P=D[i.loadCases[0].name];for(const y of t){const S=F_(P,y.factors.map(C=>[D[C.case],C.factor]));y.factors.length===0&&S.warnings.push(`Load combination ${y.name} has no load cases.`),D[y.name]=S,A.push({name:y.name,kind:"combo"})}return{items:A,results:D}}function z_(i){const t=Fr(JSON.parse(JSON.stringify(i)));return B_(t,t.loadCombos)}let an=null,k_=0;const Ss=new Map;function V_(){if(an)return an;try{an=new Worker(new URL(""+new URL("worker-BsUq_5tN.js",import.meta.url).href,import.meta.url),{type:"module"}),an.onmessage=i=>{const t=Ss.get(i.data.id);t&&(Ss.delete(i.data.id),i.data.ok?t.resolve(i.data.results):t.reject(new Error(i.data.error)))},an.onerror=i=>{for(const t of Ss.values())t.reject(new Error(i.message||"Analysis worker failed"));Ss.clear(),an==null||an.terminate(),an=null}}catch{an=null}return an}function G_(i){const t=V_();if(!t)return new Promise((n,s)=>{setTimeout(()=>{try{n(z_(i))}catch(r){s(r instanceof Error?r:new Error(String(r)))}},0)});const e=++k_;return new Promise((n,s)=>{Ss.set(e,{resolve:n,reject:s}),t.postMessage({id:e,data:JSON.parse(JSON.stringify(i))})})}const H_={TON:"TONF",KG:"KGF",KIPS:"KIP",LBF:"LB",LBS:"LB",FEET:"FT",INCH:"IN"};function W_(i){const[t,e]=i.split(/[\s,;/-]+/).filter(Boolean).map(n=>{const s=n.toUpperCase();return H_[s]??s});return ss.find(n=>n.force.toUpperCase()===t&&n.length.toUpperCase()===e)}const X_="StructApp3D",$_="1.0";class Pe extends Error{}const Fa=`\r
`,j_=["rect","circle","pipe","I","box","unp","C","general"],q_=["XY","XZ","YZ"];function Y_(i){let t=typeof i=="number"?J_(i):typeof i=="boolean"?i?"Yes":"No":i;return(/[",\r\n]/.test(t)||/^\s|\s$/.test(t))&&(t='"'+t.replace(/"/g,'""')+'"'),t}function J_(i){return!Number.isFinite(i)||Math.abs(i)<1e-300?"0":String(Number(i.toPrecision(12)))}function Oa(i){return i.map(Y_).join(",")}function Ee(i,t,e){return[Oa(["TABLE",i]),Oa(t),...e.map(Oa)].join(Fa)+Fa+Fa}const Ba=i=>i?1:0;function Hi(i,t,e){if(e<=i[0])return t[0];for(let n=1;n<i.length;n++)if(e<=i[n]+1e-12){const s=i[n]-i[n-1];return s<=1e-12?t[n]:t[n-1]+(t[n]-t[n-1])*(e-i[n-1])/s}return t[t.length-1]}function rh(i,t,e=new Date,n=on()){const s=(u,f)=>dl(u,f,n),r=u=>qt(u,n,!0),a=r("F"),o=r("M"),l=r("L");let c="";c+=Ee("PROGRAM",["Program","Version","Units","Saved"],[[X_,$_,`${n.force}, ${n.length}, C`,e.toISOString()]]);const h=i.settings;c+=Ee("SETTINGS",["GridSpacing","GridLines","WorkPlane","Elevation","SelfWeight"],[[s(h.gridSpacing,"L"),h.gridLines,h.workPlane,s(h.elevation,"L"),Ba(h.selfWeight)]]),c+=Ee("MATERIALS",["Name",`E (${r("FA")})`,"Poisson",`UnitWeight (${r("FV")})`],i.materials.map(u=>[u.name,s(u.E,"FA"),u.nu,s(u.gamma,"FV")])),c+=Ee("SECTIONS",["Name","Shape","Dim1","Dim2","Dim3","Dim4",`A (${r("A")})`,`I33 (${r("L4")})`,`I22 (${r("L4")})`,`J (${r("L4")})`],i.sections.map(u=>{const f=bi(u),p=[0,1,2,3].map(m=>u.dims[m]===void 0?"":s(u.dims[m],kr(u.shape,m)));return[u.name,u.shape,...p,s(f.A,"A"),s(f.I33,"L4"),s(f.I22,"L4"),s(f.J,"L4")]})),c+=Ee("SUPPORT TYPES",["Name",...ni],i.supportTypes.map(u=>[u.name,...u.r.map(Ba)])),c+=Ee("JOINTS",["ID",`X (${l})`,`Y (${l})`,`Z (${l})`],i.joints.map(u=>[u.id,s(u.x,"L"),s(u.y,"L"),s(u.z,"L")])),c+=Ee("JOINT RESTRAINTS",["Joint",...ni],i.joints.filter(u=>u.r.some(Boolean)).map(u=>[u.id,...u.r.map(Ba)]));const d=new Map(i.joints.map(u=>[u.id,u]));if(c+=Ee("FRAMES",["ID","JointI","JointJ","Material","Section","Beta (deg)","Rel_I","Rel_J",`Length (${l})`],i.frames.map(u=>{const f=d.get(u.i),p=d.get(u.j),m=f&&p?Math.hypot(p.x-f.x,p.y-f.y,p.z-f.z):0;return[u.id,u.i,u.j,u.material,u.section,u.beta,Ir(u.relI),Ir(u.relJ),s(m,"L")]})),c+=Ee("AREAS",["ID","Joints","Distribution","NumJoints"],i.areas.map(u=>[u.id,u.joints.join(" "),u.distribution,u.joints.length])),c+=Ee("LOAD CASES",["Name","Type"],i.loadCases.map(u=>[u.name,u.type])),c+=Ee("LOAD COMBOS",["Combo","LoadCase","Factor"],i.loadCombos.flatMap(u=>u.factors.length?u.factors.map(f=>[u.name,f.case,f.factor]):[[u.name,"",""]])),c+=Ee("JOINT LOADS",["Joint",`FX (${a})`,`FY (${a})`,`FZ (${a})`,`MX (${o})`,`MY (${o})`,`MZ (${o})`,"LoadCase"],i.jointLoads.map(u=>[u.joint,...u.f.map((f,p)=>s(f,p<3?"F":"M")),u.case])),c+=Ee("FRAME POINT LOADS",["Frame","Direction",`P (${a})`,"RelDist","LoadCase"],i.framePointLoads.map(u=>[u.frame,u.dir,s(u.P,"F"),u.rd,u.case])),c+=Ee("FRAME UNIFORM LOADS",["Frame","Direction",`W (${r("FL")})`,"LoadCase"],i.frameUniformLoads.map(u=>[u.frame,u.dir,s(u.w,"FL"),u.case])),c+=Ee("AREA LOADS",["Area",`Q (${r("FA")}, downward)`,"LoadCase"],i.areaLoads.map(u=>[u.area,s(u.q,"FA"),u.case])),t){const u=t.items.map(p=>[p.name,t.results[p.name]]).filter(([,p])=>p);c+=Ee("RESULTS JOINT DISPLACEMENTS",["Case","Joint",`UX (${l})`,`UY (${l})`,`UZ (${l})`,"RX (rad)","RY (rad)","RZ (rad)"],u.flatMap(([p,m])=>Object.entries(m.disp).map(([g,v])=>[p,Number(g),...v.map((_,M)=>M<3?s(_,"L"):_)]))),c+=Ee("RESULTS JOINT REACTIONS",["Case","Joint",`FX (${a})`,`FY (${a})`,`FZ (${a})`,`MX (${o})`,`MY (${o})`,`MZ (${o})`],u.flatMap(([p,m])=>Object.entries(m.reactions).map(([g,v])=>[p,Number(g),...v.map((_,M)=>s(_,M<3?"F":"M"))])));const f=[];for(const[p,m]of u)for(const g of m.frames)for(let _=0;_<=10;_++){const M=g.L*_/10;f.push([p,g.id,s(M,"L"),s(Hi(g.x,g.P,M),"F"),s(Hi(g.x,g.V2,M),"F"),s(Hi(g.x,g.V3,M),"F"),s(Hi(g.x,g.T,M),"M"),s(Hi(g.x,g.M2,M),"M"),s(Hi(g.x,g.M3,M),"M")])}c+=Ee("RESULTS FRAME FORCES",["Case","Frame",`Station (${l})`,`P (${a})`,`V2 (${a})`,`V3 (${a})`,`T (${o})`,`M2 (${o})`,`M3 (${o})`],f)}return c}function Z_(i){i.charCodeAt(0)===65279&&(i=i.slice(1));const t=i.slice(0,i.search(/\r?\n|$/)),e=!t.includes(",")&&t.includes(";")?";":",",n=[];let s=[],r="",a=!1;for(let o=0;o<i.length;o++){const l=i[o];a?l==='"'?i[o+1]==='"'?(r+='"',o++):a=!1:r+=l:l==='"'?a=!0:l===e?(s.push(r),r=""):l===`
`||l==="\r"?(l==="\r"&&i[o+1]===`
`&&o++,s.push(r),n.push(s),s=[],r=""):r+=l}return(r!==""||s.length)&&(s.push(r),n.push(s)),n}function K_(i){const t=[];let e=null,n=!1;return i.forEach((s,r)=>{const a=s.map(o=>o.trim());for(;a.length&&a[a.length-1]==="";)a.pop();if(!a.length){e=null;return}if(a[0].toUpperCase()==="TABLE"){e={name:(a[1]??"").toUpperCase(),header:[],rows:[]},t.push(e),n=!0;return}if(e){if(n){e.header=a.map(o=>o.replace(/\s*\(.*\)\s*$/,"").trim().toUpperCase()),n=!1;return}e.rows.push({cells:a,line:r+1})}}),t}class Q_{constructor(t,e,n){this.t=t,this.cells=e,this.line=n}idx(t,e){const n=this.t.header.indexOf(t.toUpperCase());return n>=0?n:e}str(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new Pe(`Line ${this.line} (${this.t.name}): missing ${t}`)}return s}num(t,e,n){const s=this.cells[this.idx(t,e)];if(s==null||s===""){if(n!==void 0)return n;throw new Pe(`Line ${this.line} (${this.t.name}): missing ${t}`)}const r=Number(s.replace(/\s/g,""));if(!Number.isFinite(r))throw new Pe(`Line ${this.line} (${this.t.name}): "${s}" is not a number (${t})`);return r}bool(t,e){const n=(this.cells[this.idx(t,e)]??"").toUpperCase();return n==="1"||n==="YES"||n==="TRUE"||n==="Y"}}function ah(i,t){const e=K_(Z_(i));if(!e.length)throw new Pe('No tables found. A .sav file must contain rows like "TABLE,JOINTS".');const n=_=>e.find(M=>M.name===_),s=_=>{const M=n(_);return M?M.rows.map(x=>new Q_(M,x.cells,x.line)):[]},r=$o(),a=s("PROGRAM")[0],o=a?a.str("Units",2,""):"",l=o?W_(o):Vo;if(!l)throw new Pe(`PROGRAM: unknown units "${o}". Use one of: ${ss.map(_=>`${_.force}, ${_.length}`).join(" / ")}`);t&&o&&(t.units=l.id);const c=(_,M)=>Mu(_,M,l),h=s("SETTINGS")[0];if(h){r.settings.gridSpacing=h.num("GridSpacing",0,NaN),Number.isFinite(r.settings.gridSpacing)?r.settings.gridSpacing=c(r.settings.gridSpacing,"L"):r.settings.gridSpacing=1,r.settings.gridLines=Math.round(h.num("GridLines",1,10));const _=h.str("WorkPlane",2,"XY").toUpperCase();r.settings.workPlane=q_.includes(_)?_:"XY",r.settings.elevation=c(h.num("Elevation",3,0),"L"),r.settings.selfWeight=h.bool("SelfWeight",4)}n("MATERIALS")&&(r.materials=s("MATERIALS").map(_=>({name:_.str("Name",0),E:c(_.num("E",1),"FA"),nu:_.num("Poisson",2,.3),gamma:c(_.num("UnitWeight",3,0),"FV")}))),n("SECTIONS")&&(r.sections=s("SECTIONS").map(_=>{const M=_.str("Shape",1),x=j_.find(A=>A.toUpperCase()===M.toUpperCase());if(!x)throw new Pe(`Line ${_.line} (SECTIONS): unknown shape "${M}"`);const D=[];for(let A=1;A<=4;A++){const P=_.num("Dim"+A,1+A,NaN);if(Number.isFinite(P))D.push(c(P,kr(x,A-1)));else break}return{name:_.str("Name",0),shape:x,dims:D}})),n("SUPPORT TYPES")&&(r.supportTypes=s("SUPPORT TYPES").map(_=>({name:_.str("Name",0),r:ni.map((M,x)=>_.bool(M,x+1))}))),r.joints=s("JOINTS").map(_=>({id:_.num("ID",0),x:c(_.num("X",1),"L"),y:c(_.num("Y",2),"L"),z:c(_.num("Z",3),"L"),r:[!1,!1,!1,!1,!1,!1]}));const d=new Map(r.joints.map(_=>[_.id,_]));if(d.size!==r.joints.length)throw new Pe("JOINTS: duplicate joint IDs");for(const _ of s("JOINT RESTRAINTS")){const M=_.num("Joint",0),x=d.get(M);if(!x)throw new Pe(`Line ${_.line} (JOINT RESTRAINTS): joint ${M} does not exist`);x.r=ni.map((D,A)=>_.bool(D,A+1))}const u=(_,M,x)=>{if(!d.has(_))throw new Pe(`Line ${M.line} (${x}): joint ${_} does not exist`);return _};r.frames=s("FRAMES").map(_=>{var A,P;const M=El(_.str("Rel_I",-1,"None")),x=El(_.str("Rel_J",-1,"None")),D={id:_.num("ID",0),i:u(_.num("JointI",1),_,"FRAMES"),j:u(_.num("JointJ",2),_,"FRAMES"),material:_.str("Material",3,((A=r.materials[0])==null?void 0:A.name)??""),section:_.str("Section",4,((P=r.sections[0])==null?void 0:P.name)??""),beta:_.num("Beta",5,0)};return M&&(D.relI=M),x&&(D.relJ=x),D});const f=new Set(r.frames.map(_=>_.id));if(f.size!==r.frames.length)throw new Pe("FRAMES: duplicate frame IDs");r.areas=s("AREAS").map(_=>{const M=_.str("Joints",1).split(/[\s;|]+/).filter(Boolean).map(Number);M.forEach(D=>u(D,_,"AREAS"));const x=_.str("Distribution",2,"two-way").toLowerCase();return{id:_.num("ID",0),joints:M,distribution:x==="one-way"?"one-way":"two-way"}});const p=new Set(r.areas.map(_=>_.id)),m=_=>{const M=_.str("Direction",1).toUpperCase();if(!Mh.includes(M))throw new Pe(`Line ${_.line}: unknown load direction "${M}"`);return M},g=(_,M)=>{if(!f.has(_))throw new Pe(`Line ${M.line}: frame ${_} does not exist`);return _};if(n("LOAD CASES")&&(r.loadCases=s("LOAD CASES").map(_=>{const M=_.str("Type",1,"Other"),x=yh.find(D=>D.toUpperCase()===M.toUpperCase())??"Other";return{name:_.str("Name",0),type:x}}),new Set(r.loadCases.map(_=>_.name)).size!==r.loadCases.length))throw new Pe("LOAD CASES: duplicate names");if(n("LOAD COMBOS")){r.loadCombos=[];for(const _ of s("LOAD COMBOS")){const M=_.str("Combo",0);let x=r.loadCombos.find(A=>A.name===M);x||r.loadCombos.push(x={name:M,factors:[]});const D=_.str("LoadCase",1,"");if(D){if(!r.loadCases.some(A=>A.name===D))throw new Pe(`Line ${_.line} (LOAD COMBOS): load case "${D}" does not exist`);x.factors.push({case:D,factor:_.num("Factor",2)})}}}const v=_=>{const M=_.str("LoadCase",99,"");if(M&&!r.loadCases.some(x=>x.name===M))throw new Pe(`Line ${_.line}: load case "${M}" does not exist`);return M};return r.jointLoads=s("JOINT LOADS").map(_=>({case:v(_),joint:u(_.num("Joint",0),_,"JOINT LOADS"),f:["FX","FY","FZ","MX","MY","MZ"].map((M,x)=>c(_.num(M,x+1,0),x<3?"F":"M"))})),r.framePointLoads=s("FRAME POINT LOADS").map(_=>({case:v(_),frame:g(_.num("Frame",0),_),dir:m(_),P:c(_.num("P",2),"F"),rd:Math.min(1,Math.max(0,_.num("RelDist",3,.5)))})),r.frameUniformLoads=s("FRAME UNIFORM LOADS").map(_=>({case:v(_),frame:g(_.num("Frame",0),_),dir:m(_),w:c(_.num("W",2),"FL")})),r.areaLoads=s("AREA LOADS").map(_=>{const M=_.num("Area",0);if(!p.has(M))throw new Pe(`Line ${_.line} (AREA LOADS): area ${M} does not exist`);return{case:v(_),area:M,q:c(_.num("Q",1),"FA")}}),Fr(r),r}const Eu=[{description:"StructApp 3D model",accept:{"text/csv":[".sav"]}}],wu=i=>i instanceof DOMException&&i.name==="AbortError";function oh(i){return i=i.trim()||"model",/\.sav$/i.test(i)?i:i.replace(/\.[^.]*$/,"")+".sav"}async function tx(i,t,e){const n=window;if(n.showSaveFilePicker)try{const l=e??await n.showSaveFilePicker({suggestedName:oh(t),types:Eu}),c=await l.createWritable();return await c.write(i),await c.close(),{name:l.name,handle:l}}catch(l){if(wu(l))return null;console.warn("File System Access save failed, falling back to download",l)}const s=oh(t),r=new Blob([i],{type:"text/csv;charset=utf-8"}),a=URL.createObjectURL(r),o=document.createElement("a");return o.href=a,o.download=s,document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e4),{name:s,handle:null}}const ex=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1;async function nx(){const i=window;if(i.showOpenFilePicker)try{const[t]=await i.showOpenFilePicker({types:Eu}),e=await t.getFile();return{name:e.name,text:await e.text(),handle:t}}catch(t){if(wu(t))return null;console.warn("File System Access open failed, falling back to input",t)}return new Promise(t=>{const e=document.createElement("input");e.type="file",ex()||(e.accept=".sav,.csv,text/csv,text/plain"),e.style.display="none",document.body.appendChild(e);let n=!1;e.addEventListener("change",async()=>{var r;n=!0;const s=(r=e.files)==null?void 0:r[0];if(e.remove(),!s)return t(null);t({name:s.name,text:await s.text(),handle:null})}),e.addEventListener("cancel",()=>{n||t(null),e.remove()}),e.click()})}const pl="structapp3d.autosave";function ix(i,t){try{localStorage.setItem(pl,JSON.stringify({text:i,name:t,time:Date.now()}))}catch{}}function sx(){try{const i=localStorage.getItem(pl);return i?JSON.parse(i):null}catch{return null}}function vs(){try{localStorage.removeItem(pl)}catch{}}function rx(i,t,e,n=1e-9){const s=i.length;if(!s)return{left:0,right:0};if(e<=i[0]+n){let r=0;for(;r+1<s&&i[r+1]<=i[0]+n;)r++;return{left:t[0],right:t[r]}}if(e>=i[s-1]-n){let r=s-1;for(;r>0&&i[r-1]>=i[s-1]-n;)r--;return{left:t[r],right:t[s-1]}}for(let r=1;r<s;r++){if(Math.abs(i[r]-e)<=n){let a=r;for(;a+1<s&&Math.abs(i[a+1]-e)<=n;)a++;return{left:t[r],right:t[a]}}if(i[r]>e){const a=i[r]-i[r-1],o=a<=n?t[r]:t[r-1]+(t[r]-t[r-1])*(e-i[r-1])/a;return{left:o,right:o}}}return{left:t[s-1],right:t[s-1]}}function ax(i,t,e){const n=i.axes[t],s=i.disp.map(o=>o[0]*n[0]+o[1]*n[1]+o[2]*n[2]);if(!e||s.length<2||i.L<=0)return s;const r=s[0],a=s[s.length-1];return s.map((o,l)=>o-(r+(a-r)*i.x[l]/i.L))}const ox="http://www.w3.org/2000/svg",_s=360,za=96,Er=14,lh=14;function Wi(i,t){const e=document.createElementNS(ox,i);for(const[n,s]of Object.entries(t))e.setAttribute(n,String(s));return e}let ze=null,Au="major",Tu=!1;const Xi=(i,t,e)=>({title:i,ys:t,conv:n=>jt(n,e),unit:qt(e)});function lx(i,t,e){const n=on(),s=(r,a)=>({title:`Deflection ${a}${e?" (relative to chord)":""}`,ys:ax(i,r,e),conv:o=>zn(o/n.kSmall),unit:n.small});return t==="axial"?[Xi("Axial force P",i.P,"F"),Xi("Torsion T",i.T,"M")]:t==="major"?[Xi("Shear V2",i.V2,"F"),Xi("Moment M3",i.M3,"M"),s(1,"δ2 (local 2)")]:[Xi("Shear V3",i.V3,"F"),Xi("Moment M2",i.M2,"M"),s(2,"δ3 (local 3)")]}function cx(i,t,e,n){const s=i.x,r=i.L||1;let a=Math.min(0,...t.ys),o=Math.max(0,...t.ys);o-a<1e-12&&(a=-1,o=1);const l=v=>Er+(_s-2*Er)*v/r,c=v=>lh+(za-2*lh)*(o-v)/(o-a),h=Wi("svg",{viewBox:`0 0 ${_s} ${za}`,class:"fd-svg",preserveAspectRatio:"none"}),d=s.map((v,_)=>`${l(v).toFixed(2)},${c(t.ys[_]).toFixed(2)}`);h.append(Wi("polygon",{points:`${l(0)},${c(0)} ${d.join(" ")} ${l(r)},${c(0)}`,class:"fd-fill"}),Wi("line",{x1:l(0),y1:c(0),x2:l(r),y2:c(0),class:"fd-axis"}),Wi("polyline",{points:d.join(" "),class:"fd-line"}));let u=0,f=0;t.ys.forEach((v,_)=>{v>t.ys[u]&&(u=_),v<t.ys[f]&&(f=_)});const p=(v,_)=>{if(Math.abs(t.ys[v])<1e-12)return;const M=Math.min(Math.max(l(s[v]),30),_s-30),x=Wi("text",{x:M,y:c(t.ys[v])+(_?-3:11),class:"fd-val","text-anchor":"middle"});x.textContent=t.conv(t.ys[v]),h.append(x)};p(u,!0),f!==u&&p(f,!1),e!==null&&h.append(Wi("line",{x1:l(e),y1:2,x2:l(e),y2:za-2,class:"fd-cursor"}));const m=v=>{const _=h.getBoundingClientRect(),M=(v.clientX-_.left)/_.width*_s;n(Math.min(Math.max((M-Er)/(_s-2*Er)*r,0),r))};h.addEventListener("pointerdown",v=>{v.preventDefault(),h.setPointerCapture(v.pointerId),m(v);const _=x=>m(x),M=()=>{h.removeEventListener("pointermove",_),h.removeEventListener("pointerup",M),h.removeEventListener("pointercancel",M)};h.addEventListener("pointermove",_),h.addEventListener("pointerup",M),h.addEventListener("pointercancel",M)});let g="";if(e!==null){const v=rx(s,t.ys,e);g=Math.abs(v.left-v.right)>1e-9*Math.max(1,Math.abs(v.left),Math.abs(v.right))?`${t.conv(v.left)} / ${t.conv(v.right)} ${t.unit} (left / right)`:`${t.conv(v.left)} ${t.unit}`}return T("div",{class:"fd-plot"},T("div",{class:"fd-plot-head"},T("span",{class:"fd-plot-title"},`${t.title} [${t.unit}]`),T("span",{class:"fd-readout"},g)),h)}function _i(){var c;if(!ze)return;const i=ze,t=i.app.resultSet;if(!t)return Gr();t.results[i.caseName]||(i.caseName=i.app.resultName);const e=(c=t.results[i.caseName])==null?void 0:c.frames.find(h=>h.id===i.frameId);if(!e)return Gr();i.cursor!==null&&(i.cursor=Math.min(i.cursor,e.L));const n=T("select",{class:"fd-case","aria-label":"Load case or combination"},...t.items.map(h=>T("option",{value:h.name},`${h.kind==="combo"?"Combo":"Case"}: ${h.name}`)));n.value=i.caseName,n.addEventListener("change",()=>{i.caseName=n.value,_i()});const s=T("select",{class:"fd-view","aria-label":"Diagram"},T("option",{value:"axial"},"Axial P & torsion T"),T("option",{value:"major"},"Major: V2, M3, deflection"),T("option",{value:"minor"},"Minor: V3, M2, deflection"));s.value=i.view,s.addEventListener("change",()=>{i.view=Au=s.value,_i()});const r=T("div",{class:"fd-controls"},n,s);if(i.view!=="axial"){const h=T("select",{class:"fd-rel","aria-label":"Deflection reference"},T("option",{value:"abs"},"Absolute deflection"),T("option",{value:"rel"},"Relative to chord"));h.value=i.relative?"rel":"abs",h.addEventListener("change",()=>{i.relative=Tu=h.value==="rel",_i()}),r.append(h)}const a=h=>{i.cursor=h,_i()},o=lx(e,i.view,i.relative).map(h=>cx(e,h,i.cursor,a)),l=i.cursor===null?"Tap or drag on a diagram to read values.":`x = ${jt(i.cursor,"L")} ${qt("L")} from joint i (L = ${jt(e.L,"L")} ${qt("L")})`;i.body.replaceChildren(r,T("div",{class:"fd-pos muted small"},l),...o),i.el.querySelector(".fd-title").textContent=`Frame ${i.frameId} diagrams`}function hx(i,t){t.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;e.preventDefault();const n=i.getBoundingClientRect(),s=e.clientX-n.left,r=e.clientY-n.top;t.setPointerCapture(e.pointerId);const a=l=>{const c=Math.min(Math.max(l.clientX-s,0),window.innerWidth-60),h=Math.min(Math.max(l.clientY-r,0),window.innerHeight-40);i.style.left=`${c}px`,i.style.top=`${h}px`,i.style.right="auto",i.style.bottom="auto",ze&&(ze.pos={left:c,top:h})},o=()=>{t.removeEventListener("pointermove",a),t.removeEventListener("pointerup",o),t.removeEventListener("pointercancel",o)};t.addEventListener("pointermove",a),t.addEventListener("pointerup",o),t.addEventListener("pointercancel",o)})}function Cu(i,t){if(!i.resultSet)return;if(ze){ze.frameId=t,ze.cursor=null,ze.caseName=i.resultName,_i();return}const e=T("div",{class:"fd-body"}),n=T("button",{class:"fd-close","aria-label":"Close diagrams",title:"Close"},"✕"),s=T("div",{class:"fd-head"},T("span",{class:"fd-title"}),n),r=T("div",{class:"frame-diagrams",role:"dialog","aria-label":"Frame diagrams"},s,e);for(const a of["contextmenu","selectstart","dragstart"])r.addEventListener(a,o=>o.preventDefault());r.addEventListener("pointerdown",a=>a.stopPropagation()),r.addEventListener("wheel",a=>a.stopPropagation()),n.addEventListener("click",()=>Gr()),hx(r,s),document.body.append(r),ze={app:i,frameId:t,caseName:i.resultName,view:Au,relative:Tu,cursor:null,el:r,body:e,pos:null},_i()}function Gr(){ze==null||ze.el.remove(),ze=null}function ch(i){ze&&(ze.app=i,_i())}const ux=(i,t)=>i.every((e,n)=>e===t[n]),ml=i=>i.some(Boolean)?ni.filter((t,e)=>i[e]).join(" "):"Free";function Gs(i,t,e){return i?/[,;"\r\n]/.test(i)?`${e} name cannot contain commas, semicolons or quotes`:t.includes(i)?`${e} "${i}" already exists`:null:`${e} name is required`}function yn(i,t){return T("div",{class:"table-wrap"},T("table",{class:"grid-table"},T("thead",null,T("tr",null,...i.map(e=>T("th",null,e)))),T("tbody",null,...t.map(e=>T("tr",null,...e.map(n=>T("td",null,n)))))))}const _e=i=>(Wt(i,"error"),!1),me=(i,t,e="small")=>T("button",{class:"btn "+e,type:"button",onclick:t},i);function dx(i){const t=i.model,e=T("div"),n=()=>{e.replaceChildren(yn(["Name",`E (${qt("FA")})`,"ν",`γ (${qt("FV")})`,"Used by",""],t.data.materials.map(a=>{const o=t.data.frames.filter(l=>l.material===a.name).length;return[document.createTextNode(a.name),document.createTextNode(jt(a.E,"FA",5)),document.createTextNode(String(a.nu)),document.createTextNode(jt(a.gamma,"FV",5)),document.createTextNode(o?`${o} frame(s)`:"–"),T("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))]})),T("div",{class:"dlg-actions"},me("+ Add material",()=>r(null),"primary")))},s=async a=>{const o=t.data.frames.filter(l=>l.material===a.name).length;if(o)return void mi("Cannot delete",`Material "${a.name}" is assigned to ${o} frame(s). Assign another material to them first.`);await rs("Delete material",`Delete material "${a.name}"?`,"Delete",!0)&&(t.commit("delete material",l=>{l.materials=l.materials.filter(c=>c.name!==a.name)}),n())},r=a=>{const o=Vs("Name",(a==null?void 0:a.name)??`MAT${t.data.materials.length+1}`),l=ae("Elastic modulus E",(a==null?void 0:a.E)??2e8,{q:"FA",positive:!0}),c=ae("Poisson's ratio ν",(a==null?void 0:a.nu)??.3,{min:0,max:.4999}),h=ae("Unit weight γ",(a==null?void 0:a.gamma)??78.5,{q:"FV",min:0}),d=T("div",{class:"chips"},T("span",{class:"muted"},"Presets: "),me("Steel",()=>(l.set(2e8),c.set(.3),h.set(76.98))),me("Concrete C30",()=>(l.set(25743e3),c.set(.2),h.set(23.56))),me("Aluminium",()=>(l.set(7e7),c.set(.33),h.set(26.6))),me("Timber",()=>(l.set(11e6),c.set(.3),h.set(5))));oe({title:a?`Edit material ${a.name}`:"Add material",body:T("div",{class:"form"},o.row,l.row,c.row,h.row,d),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const u=o.get(),f=Gs(u,t.data.materials.filter(m=>m!==a).map(m=>m.name),"Material"),p=[l.get(),c.get(),h.get()];if(f)return _e(f);if(p.some(m=>!Number.isFinite(m)))return _e("Fix the highlighted fields");t.commit(a?"edit material":"add material",m=>{const g={name:u,E:p[0],nu:p[1],gamma:p[2]};if(a){const v=a.name,_=m.materials.findIndex(M=>M.name===v);if(m.materials[_]=g,v!==u)for(const M of m.frames)M.material===v&&(M.material=u)}else m.materials.push(g)}),n()}}]})};n(),oe({title:"Define materials",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function fx(i){const t="http://www.w3.org/2000/svg",e=document.createElementNS(t,"svg");e.setAttribute("viewBox","-60 -60 120 120"),e.setAttribute("class","sketch");const n=bi(i),s=i.dims,a=80/Math.max(n.depth,n.width,1e-9),o=(h,d)=>{const u=document.createElementNS(t,h);for(const[f,p]of Object.entries(d))u.setAttribute(f,String(p));return e.append(u),u},l={class:"sk-shape","fill-rule":"evenodd"},c=(h,d,u=0,f=0)=>`M${u-h/2},${f-d/2}h${h}v${d}h${-h}z`;switch(i.shape){case"rect":o("path",{...l,d:c(s[1]*a,s[0]*a)});break;case"circle":o("circle",{...l,r:s[0]/2*a});break;case"pipe":{const h=s[0]/2*a,d=Math.max(h-s[1]*a,0);o("path",{...l,d:`M${-h},0a${h},${h} 0 1,0 ${2*h},0a${h},${h} 0 1,0 ${-2*h},0zM${-d},0a${d},${d} 0 1,0 ${2*d},0a${d},${d} 0 1,0 ${-2*d},0z`});break}case"I":{const[h,d,u,f]=s.map(p=>p*a);o("path",{...l,d:c(d,u,0,-h/2+u/2)+c(d,u,0,h/2-u/2)+c(f,h-2*u)});break}case"box":{const[h,d,u,f]=s.map(p=>p*a);o("path",{...l,d:c(d,h)+c(Math.max(d-2*f,0),Math.max(h-2*u,0))});break}case"unp":case"C":{const h=mu(i);o("path",{...l,d:"M"+h.map(([d,u])=>`${d*a},${-u*a}`).join("L")+"z"});break}case"general":o("text",{x:0,y:4,"text-anchor":"middle",class:"sk-text"}).textContent="General";break}return o("line",{x1:0,y1:0,x2:0,y2:-52,class:"sk-axis"}),o("line",{x1:0,y1:0,x2:-52,y2:0,class:"sk-axis"}),o("text",{x:4,y:-48,class:"sk-text"}).textContent="2",o("text",{x:-54,y:-4,class:"sk-text"}).textContent="3",e}function px(i){const t=i.model,e=T("div"),n=()=>{e.replaceChildren(yn(["Name","Shape",`Dimensions (${qt("L")})`,`A (${qt("A")})`,`I33 (${qt("L4")})`,"Used by",""],t.data.sections.map(a=>{const o=bi(a),l=t.data.frames.filter(c=>c.section===a.name).length;return[document.createTextNode(a.name),document.createTextNode(Ls[a.shape]),document.createTextNode(a.dims.map((c,h)=>jt(c,kr(a.shape,h),4)).join(" × ")),document.createTextNode(jt(o.A,"A",4)),document.createTextNode(jt(o.I33,"L4",4)),document.createTextNode(l?`${l} frame(s)`:"–"),T("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))]})),T("div",{class:"dlg-actions"},me("+ Add section",()=>r(null),"primary")))},s=async a=>{const o=t.data.frames.filter(l=>l.section===a.name).length;if(o)return void mi("Cannot delete",`Section "${a.name}" is assigned to ${o} frame(s). Assign another section to them first.`);await rs("Delete section",`Delete section "${a.name}"?`,"Delete",!0)&&(t.commit("delete section",l=>{l.sections=l.sections.filter(c=>c.name!==a.name)}),n())},r=a=>{const o=Vs("Name",(a==null?void 0:a.name)??`SEC${t.data.sections.length+1}`),l=Object.keys(Ls),c=Qe("Shape",l.map(_=>[_,Ls[_]]),(a==null?void 0:a.shape)??"rect"),h=T("div",{class:"form"}),d=T("div",{class:"props"}),u=T("div",{class:"sketch-box"});let f=[];const p={rect:[.5,.3],circle:[.4],pipe:[.1683,.0071],I:[.3,.15,.009,.0065],box:[.2,.2,.008,.008],unp:[.2,.075,.0115,.0085],C:[.15,.065,.02,.0023],general:[.01,1e-4,1e-5,1e-6]},m=()=>({name:o.get(),shape:c.get(),dims:f.map(_=>_.get())}),g=()=>{const _=m(),M=_.dims.some(D=>!Number.isFinite(D))?"Enter all dimensions":$c(_);if(u.replaceChildren(M?T("div",{class:"field-err"},M):fx(_)),M)return void d.replaceChildren();const x=bi(_);d.replaceChildren(yn([`A (${qt("A")})`,`I33 (${qt("L4")})`,`I22 (${qt("L4")})`,`J (${qt("L4")})`],[[jt(x.A,"A"),jt(x.I33,"L4"),jt(x.I22,"L4"),jt(x.J,"L4")].map(D=>document.createTextNode(D))]))},v=_=>{const M=c.get(),x=_&&a&&a.shape===M?a.dims:p[M];f=du[M].map((D,A)=>ae(D,x[A],{q:kr(M,A),positive:!0})),h.replaceChildren(...f.map(D=>D.row));for(const D of f)D.input.addEventListener("input",g);g()};c.input.addEventListener("change",()=>v(!1)),v(!0),oe({title:a?`Edit section ${a.name}`:"Add frame section",wide:!0,body:T("div",{class:"two-col"},T("div",{class:"form"},o.row,c.row,h),T("div",null,u,d,T("p",{class:"muted small"},"Local axis 2 is the section depth direction (up for horizontal members); local 3 is the width direction."))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const _=m(),M=Gs(_.name,t.data.sections.filter(x=>x!==a).map(x=>x.name),"Section")??(_.dims.some(x=>!Number.isFinite(x))?"Enter all dimensions":$c(_));if(M)return _e(M);t.commit(a?"edit section":"add section",x=>{if(a){const D=a.name;if(x.sections[x.sections.findIndex(A=>A.name===D)]=_,D!==_.name)for(const A of x.frames)A.section===D&&(A.section=_.name)}else x.sections.push(_)}),n()}}]})};n(),oe({title:"Define frame sections",body:e,wide:!0,buttons:[{label:"Close",kind:"primary"}]})}function Ru(i){const t=ni.map((n,s)=>fl(n,i[s]));return{el:T("div",{class:"restraints"},T("div",{class:"muted small"},"Translations"),T("div",{class:"chk-row"},...t.slice(0,3).map(n=>n.row)),T("div",{class:"muted small"},"Rotations"),T("div",{class:"chk-row"},...t.slice(3).map(n=>n.row))),checks:t,get:()=>t.map(n=>n.get()),set:n=>t.forEach((s,r)=>s.set(n[r]))}}function hh(i,t){const e=i?[...i]:[!1,!1,!1,!1,!1,!1],n=ku.map((r,a)=>fl(r,e[a]));return{el:T("div",{class:"releases-group"},t?T("div",{class:"muted small"},t):null,T("div",{class:"chk-row"},...n.map(r=>r.row))),checks:n,get:()=>{const r=n.map(a=>a.get());return r.some(Boolean)?r:void 0},set:r=>{const a=r??[!1,!1,!1,!1,!1,!1];n.forEach((o,l)=>o.set(a[l]))}}}function mx(i){const t=i.model,e=T("div"),n=()=>{e.replaceChildren(yn(["Name","Restrained DOF",""],t.data.supportTypes.map(a=>[document.createTextNode(a.name),document.createTextNode(ml(a.r)),T("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))])),T("div",{class:"dlg-actions"},me("+ Add support type",()=>r(null),"primary")),T("p",{class:"muted small"},"Support types are presets. Assign them to joints with Assign → Joint supports."))},s=a=>{t.commit("delete support type",o=>{o.supportTypes=o.supportTypes.filter(l=>l.name!==a.name)}),n()},r=a=>{const o=Vs("Name",(a==null?void 0:a.name)??`Support${t.data.supportTypes.length+1}`),l=Ru((a==null?void 0:a.r)??[!0,!0,!0,!1,!1,!1]);oe({title:a?`Edit support ${a.name}`:"Add support type",body:T("div",{class:"form"},o.row,l.el),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=o.get(),h=Gs(c,t.data.supportTypes.filter(d=>d!==a).map(d=>d.name),"Support");if(h)return _e(h);t.commit("edit support type",d=>{const u={name:c,r:l.get()};a?d.supportTypes[d.supportTypes.findIndex(f=>f.name===a.name)]=u:d.supportTypes.push(u)}),n()}}]})};n(),oe({title:"Define support types",body:e,buttons:[{label:"Close",kind:"primary"}]})}function uh(i){const t=i.model.data.settings,e=ae("Grid spacing",t.gridSpacing,{q:"L",positive:!0}),n=ae("Grid lines each side",t.gridLines,{min:1,max:200}),s=Qe("Work plane",[["XY","XY (plan, horizontal)"],["XZ","XZ (elevation)"],["YZ","YZ (elevation)"]],t.workPlane),r=ae("Plane offset (Z for XY, Y for XZ, X for YZ)",t.elevation,{q:"L"});oe({title:"Grid & work plane",body:T("div",{class:"form"},e.row,n.row,s.row,r.row,T("p",{class:"muted small"},"New joints snap to this grid on the work plane. Tap an existing joint to snap to it instead.")),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const a=[e.get(),n.get(),r.get()];if(a.some(o=>!Number.isFinite(o)))return _e("Fix the highlighted fields");i.model.commit("grid",o=>{o.settings.gridSpacing=a[0],o.settings.gridLines=Math.round(a[1]),o.settings.workPlane=s.get(),o.settings.elevation=a[2]})}}]})}function Vn(i,t){const e=i.selected()[t];return e.length?e:(Wt(`Select one or more ${t} first`,"warn"),null)}function ka(i,t){const e=Vn(i,"frames");if(!e)return;const n=i.model.data,s=n.frames.filter(o=>e.includes(o.id)),r=o=>s.every(l=>o(l)===o(s[0]))?o(s[0]):null;let a;if(t==="material"){if(!n.materials.length)return void Wt("Define a material first","warn");a=Qe("Material",n.materials.map(o=>[o.name,o.name]),r(o=>o.material)??n.materials[0].name)}else if(t==="section"){if(!n.sections.length)return void Wt("Define a section first","warn");a=Qe("Section",n.sections.map(o=>[o.name,`${o.name} (${Ls[o.shape]})`]),r(o=>o.section)??n.sections[0].name)}else a=ae("Local axis angle β",r(o=>o.beta),{unit:"°",mixed:!0});oe({title:`Assign ${t==="beta"?"local axis angle":t} to ${e.length} frame(s)`,body:T("div",{class:"form"},a.row,t==="beta"?T("p",{class:"muted small"},"β rotates the section (local axes 2 and 3) about the member axis 1."):null),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const o=a.get();if(typeof o=="number"&&!Number.isFinite(o))return _e("Enter an angle");i.model.commit("assign "+t,l=>{for(const c of l.frames)e.includes(c.id)&&(c[t]=o)}),Wt(`Assigned to ${e.length} frame(s)`,"ok")}}]})}function Lu(i){const t=Vn(i,"frames");if(!t)return;const n=i.model.data.frames.find(l=>l.id===t[0]),s=hh(n.relI,"End I releases (Joint I)"),r=hh(n.relJ,"End J releases (Joint J)"),a=(l,c)=>{s.set(l),r.set(c)},o=T("div",{class:"chips"},me("Rigid - Rigid (Continuous)",()=>a(void 0,void 0)),me("Pin - Pin (Truss)",()=>a([!1,!1,!1,!1,!0,!0],[!1,!1,!1,!1,!0,!0])),me("Pin - Rigid (Hinge at I)",()=>a([!1,!1,!1,!1,!0,!0],void 0)),me("Rigid - Pin (Hinge at J)",()=>a(void 0,[!1,!1,!1,!1,!0,!0])));oe({title:`Assign end releases to ${t.length} frame(s)`,body:T("div",{class:"form"},T("div",{class:"muted small"},"Presets"),o,s.el,r.el,T("p",{class:"muted small"},"Checked DOFs are released (zero moment / shear / axial / torsion).")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const l=s.get(),c=r.get();i.model.commit("assign releases",h=>{for(const d of h.frames)t.includes(d.id)&&(l?d.relI=[...l]:delete d.relI,c?d.relJ=[...c]:delete d.relJ)}),Wt(`Assigned releases to ${t.length} frame(s)`,"ok")}}]})}function gx(i){const t=Vn(i,"joints");if(!t)return;const e=i.model.data,n=e.joints.find(a=>a.id===t[0]),s=Ru(n.r),r=T("div",{class:"chips"},...e.supportTypes.map(a=>me(a.name,()=>s.set(a.r))));oe({title:`Assign supports to ${t.length} joint(s)`,body:T("div",{class:"form"},T("div",{class:"muted small"},"Support type"),r,s.el),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{const a=s.get();i.model.commit("assign supports",l=>{for(const c of l.joints)t.includes(c.id)&&(c.r=[...a])});const o=e.supportTypes.find(l=>ux(l.r,a));Wt(`${o?o.name:ml(a)} assigned to ${t.length} joint(s)`,"ok")}}]})}function vx(i){var n;const t=Vn(i,"areas");if(!t)return;const e=Qe("Load distribution",[["two-way","Two-way (to all edges, tributary)"],["one-way","One-way (to the two longer edges)"]],((n=i.model.area(t[0]))==null?void 0:n.distribution)??"two-way");oe({title:`Area load distribution (${t.length} area(s))`,body:T("div",{class:"form"},e.row,T("p",{class:"muted small"},"Areas have no stiffness; their loads are transferred to the frames along their edges (or to the corner joints when an edge has no frame).")),buttons:[{label:"Cancel"},{label:"Assign",kind:"primary",action:()=>{i.model.commit("assign distribution",s=>{for(const r of s.areas)t.includes(r.id)&&(r.distribution=e.get())})}}]})}const qr=()=>Qe("Option",[["add","Add to existing loads"],["replace","Replace loads of this case"],["delete","Delete loads of this case"]],"add");function Yr(i){const t=i.model.data.loadCases,e=t.some(n=>n.name===i.lastLoadCase)?i.lastLoadCase:t[0].name;return Qe("Load case",t.map(n=>[n.name,`${n.name} (${n.type})`]),e)}function Pu(i="GRAV"){return Qe("Direction",Mh.map(t=>[t,Wa[t]]),i)}function _x(i){const t=Vn(i,"joints");if(!t)return;const n=["Force FX","Force FY","Force FZ","Moment MX","Moment MY","Moment MZ"].map((a,o)=>ae(a,0,{q:o<3?"F":"M"})),s=Yr(i),r=qr();oe({title:`Joint loads on ${t.length} joint(s)`,body:T("div",{class:"form"},T("p",{class:"muted small"},"Global axes. Use a negative FZ for downward loads."),s.row,T("div",{class:"grid2"},...n.map(a=>a.row)),r.row),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const a=n.map(c=>c.get()),o=r.get(),l=i.lastLoadCase=s.get();if(o!=="delete"&&a.some(c=>!Number.isFinite(c)))return _e("Fix the highlighted fields");i.model.commit("joint loads",c=>{if(o!=="add"&&(c.jointLoads=c.jointLoads.filter(h=>h.case!==l||!t.includes(h.joint))),!(o==="delete"||a.every(h=>h===0)))for(const h of t){const d=o==="add"?c.jointLoads.find(u=>u.joint===h&&u.case===l):void 0;d?d.f=d.f.map((u,f)=>u+a[f]):c.jointLoads.push({case:l,joint:h,f:[...a]})}}),Wt(o==="delete"?"Joint loads deleted":`Load applied to ${t.length} joint(s)`,"ok")}}]})}function xx(i){const t=Vn(i,"frames");if(!t)return;const e=Pu(),n=ae("Load P",10,{q:"F"}),s=ae("Relative distance from end I",.5,{min:0,max:1}),r=Yr(i),a=qr();oe({title:`Frame point load on ${t.length} frame(s)`,body:T("div",{class:"form"},r.row,e.row,n.row,s.row,a.row,T("p",{class:"muted small"},"Gravity loads act downward (−Z) for positive values. Relative distance 0 = end I, 1 = end J.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const o=n.get(),l=s.get(),c=a.get(),h=i.lastLoadCase=r.get();if(c!=="delete"&&(!Number.isFinite(o)||!Number.isFinite(l)))return _e("Fix the highlighted fields");i.model.commit("frame point loads",d=>{if(c!=="add"&&(d.framePointLoads=d.framePointLoads.filter(u=>u.case!==h||!t.includes(u.frame))),!(c==="delete"||o===0))for(const u of t)d.framePointLoads.push({case:h,frame:u,dir:e.get(),P:o,rd:l})}),Wt(c==="delete"?"Point loads deleted":`Point load applied to ${t.length} frame(s)`,"ok")}}]})}function Mx(i){const t=Vn(i,"frames");if(!t)return;const e=Pu(),n=ae("Uniform load w",5,{q:"FL"}),s=Yr(i),r=qr();oe({title:`Frame uniform load on ${t.length} frame(s)`,body:T("div",{class:"form"},s.row,e.row,n.row,r.row,T("p",{class:"muted small"},"Load per unit length along the full member. Gravity loads act downward for positive values.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const a=n.get(),o=r.get(),l=i.lastLoadCase=s.get();if(o!=="delete"&&!Number.isFinite(a))return _e("Enter a load value");i.model.commit("frame uniform loads",c=>{if(o!=="add"&&(c.frameUniformLoads=c.frameUniformLoads.filter(h=>h.case!==l||!t.includes(h.frame))),!(o==="delete"||a===0))for(const h of t)c.frameUniformLoads.push({case:l,frame:h,dir:e.get(),w:a})}),Wt(o==="delete"?"Uniform loads deleted":`Uniform load applied to ${t.length} frame(s)`,"ok")}}]})}function yx(i){const t=Vn(i,"areas");if(!t)return;const e=ae("Uniform pressure q (gravity)",5,{q:"FA"}),n=Yr(i),s=qr();oe({title:`Area load on ${t.length} area(s)`,body:T("div",{class:"form"},n.row,e.row,s.row,T("p",{class:"muted small"},"Positive values act downward. The load is distributed to the surrounding frames.")),buttons:[{label:"Cancel"},{label:"Apply",kind:"primary",action:()=>{const r=e.get(),a=s.get(),o=i.lastLoadCase=n.get();if(a!=="delete"&&!Number.isFinite(r))return _e("Enter a load value");i.model.commit("area loads",l=>{if(a!=="add"&&(l.areaLoads=l.areaLoads.filter(c=>c.case!==o||!t.includes(c.area))),!(a==="delete"||r===0))for(const c of t){const h=a==="add"?l.areaLoads.find(d=>d.area===c&&d.case===o):void 0;h?h.q+=r:l.areaLoads.push({case:o,area:c,q:r})}}),Wt(a==="delete"?"Area loads deleted":`Area load applied to ${t.length} area(s)`,"ok")}}]})}async function dh(i){const t=i.selected(),e=t.joints.length+t.frames.length+t.areas.length;if(!e)return void Wt("Select objects first","warn");await rs("Clear loads",`Delete all loads (all load cases) on the ${e} selected object(s)?`,"Delete loads",!0)&&i.model.commit("clear loads",n=>{n.jointLoads=n.jointLoads.filter(s=>!t.joints.includes(s.joint)),n.framePointLoads=n.framePointLoads.filter(s=>!t.frames.includes(s.frame)),n.frameUniformLoads=n.frameUniformLoads.filter(s=>!t.frames.includes(s.frame)),n.areaLoads=n.areaLoads.filter(s=>!t.areas.includes(s.area))})}function fh(i){const t=ae("X",0,{q:"L"}),e=ae("Y",0,{q:"L"}),n=ae("Z",0,{q:"L"});oe({title:"Add joint by coordinates",body:T("div",{class:"form"},T("div",{class:"grid3"},t.row,e.row,n.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const s=[t.get(),e.get(),n.get()];if(s.some(o=>!Number.isFinite(o)))return _e("Fix the highlighted fields");const r=i.model.data.joints.length,a=i.model.addJoint(s[0],s[1],s[2]);return Wt(i.model.data.joints.length>r?`Joint ${a} added`:`Joint ${a} already exists there`,"ok"),!1}}]})}function Sx(i){const t=ae("Joint I",null,{min:1}),e=ae("Joint J",null,{min:1});oe({title:"Add frame between joints",body:T("div",{class:"form"},T("div",{class:"grid2"},t.row,e.row)),buttons:[{label:"Close"},{label:"Add",kind:"primary",action:()=>{const n=t.get(),s=e.get();if(!i.model.joint(n)||!i.model.joint(s))return _e("Both joints must exist");const r=i.model.addFrame(n,s);return r===null?_e("Joints I and J must be different"):(Wt(`Frame ${r} (${n}–${s})`,"ok"),!1)}}]})}function Du(i){return[ae(i+"X",0,{q:"L"}),ae(i+"Y",0,{q:"L"}),ae(i+"Z",0,{q:"L"})]}function ph(i){const t=i.selected(),e=i.model.jointsOf(t.joints,t.frames,t.areas);if(!e.size)return void Wt("Select objects to move","warn");const n=Du("Δ");oe({title:`Move ${e.size} joint(s)`,body:T("div",{class:"form"},T("div",{class:"grid3"},...n.map(s=>s.row))),buttons:[{label:"Cancel"},{label:"Move",kind:"primary",action:()=>{const s=n.map(a=>a.get());if(s.some(a=>!Number.isFinite(a)))return _e("Fix the highlighted fields");const r=i.model.moveJoints(e,s[0],s[1],s[2]);if(r)return _e(r)}}]})}function mh(i){const t=i.selected();if(!t.joints.length&&!t.frames.length&&!t.areas.length)return void Wt("Select objects to replicate","warn");const e=Du("Δ"),n=ae("Number of copies",1,{min:1,max:100});oe({title:"Replicate (linear copy)",body:T("div",{class:"form"},T("div",{class:"grid3"},...e.map(s=>s.row)),n.row,T("p",{class:"muted small"},"Copies selected objects with their properties, supports and loads.")),buttons:[{label:"Cancel"},{label:"Replicate",kind:"primary",action:()=>{const s=e.map(o=>o.get()),r=Math.round(n.get());if(s.some(o=>!Number.isFinite(o))||!(r>=1))return _e("Fix the highlighted fields");if(s.every(o=>o===0))return _e("Enter a non-zero offset");const a=i.model.replicate(t.joints,t.frames,t.areas,s[0],s[1],s[2],r);Wt(`Created ${a.joints.length} joint(s), ${a.frames.length} frame(s), ${a.areas.length} area(s)`,"ok")}}]})}function bx(i){const t=Vn(i,"frames");if(!t)return;const e=ae("Divide each frame into",2,{min:2,max:100});oe({title:`Divide ${t.length} frame(s)`,body:T("div",{class:"form"},e.row),buttons:[{label:"Cancel"},{label:"Divide",kind:"primary",action:()=>{const n=Math.round(e.get());if(!(n>=2))return _e("Enter 2 or more");i.model.commit("divide frames",()=>{for(const s of t)i.model.divideFrame(s,n)}),i.select([],"replace")}}]})}function Va(i){const t=i.results;if(!t)return void Wt("Run the analysis first","warn");const e=[["Joint displacements",()=>yn(["Joint",...["UX","UY","UZ"].map(l=>`${l} (${qt("L")})`),"RX (rad)","RY (rad)","RZ (rad)"],i.model.data.joints.map(l=>[String(l.id),...(t.disp[l.id]??[]).map((c,h)=>h<3?jt(c,"L",4):zn(c,4))].map(c=>document.createTextNode(c))))],["Support reactions",()=>yn(["Joint",...["FX","FY","FZ"].map(l=>`${l} (${qt("F")})`),...["MX","MY","MZ"].map(l=>`${l} (${qt("M")})`)],Object.entries(t.reactions).map(([l,c])=>[l,...c.map((h,d)=>jt(h,d<3?"F":"M",4))].map(h=>document.createTextNode(h))))],["Frame end forces",()=>yn(["Frame","End",...["P","V2","V3"].map(l=>`${l} (${qt("F")})`),...["T","M2","M3"].map(l=>`${l} (${qt("M")})`)],t.frames.flatMap(l=>{const c=l.x.length-1,h=d=>[l.P[d],l.V2[d],l.V3[d],l.T[d],l.M2[d],l.M3[d]].map((u,f)=>jt(u,f<3?"F":"M",4));return[[String(l.id),"I",...h(0)].map(d=>document.createTextNode(d)),["","J",...h(c)].map(d=>document.createTextNode(d))]}))]],n=T("div",{class:"tab-content"}),s=T("div",{class:"tabs"}),r=l=>{n.replaceChildren(e[l][1]()),[...s.children].forEach((c,h)=>c.classList.toggle("active",h===l))};e.forEach(([l],c)=>s.append(T("button",{class:"tab",type:"button",onclick:()=>r(c)},l))),r(0);const a=t.stats,o=T("p",{class:"muted small"},`Applied load ΣF = (${a.sumLoad.map(l=>jt(l,"F",4)).join(", ")}) ${qt("F")} · Reactions ΣR = (${a.sumReaction.map(l=>jt(l,"F",4)).join(", ")}) ${qt("F")} · Max displacement ${Ae(a.maxDisp,"L",4)}`);oe({title:`Analysis results — ${i.resultName}`,wide:!0,body:T("div",null,o,s,n),buttons:[{label:"Close",kind:"primary"}]})}function gh(){const t=T("div",null,yn(["Action","Touch (iPad/Android)","Mouse & keyboard"],[["Select","Tap object","Click object"],["Add to selection","Multi tool, then tap","Shift/Ctrl + click"],["Box select","Box tool, drag (→ window, ← crossing)","Box tool or Ctrl + drag"],["Rotate view","One-finger drag","Left drag"],["Pan","Two-finger drag","Right/middle drag or Shift + drag"],["Zoom","Pinch","Mouse wheel / trackpad pinch"],["Context menu","Long-press","Right-click"],["Finish frame/area","Done button","Enter or Done"],["Cancel / clear selection","—","Esc"],["Delete","Delete button","Delete key"],["Undo / Redo","Undo / Redo buttons","Ctrl+Z / Ctrl+Y"],["Fit view","Fit button","F"],["Rotate work plane (XY → XZ → YZ)","Plane button (passes through a single selected joint)","P"],["Shift work plane ± grid spacing","Up / Down plane buttons","PgUp / PgDn"]].map(e=>e.map(n=>document.createTextNode(n)))),T("ol",{class:"small"},T("li",null,"Define → Materials, Sections and Support types."),T("li",null,"Draw joints, frames and areas on the grid. Use the plane buttons in the toolbar (or Define → Grid & work plane) to change the plane and its offset."),T("li",null,"Select objects and use Assign to set materials, sections and supports."),T("li",null,"Apply loads from the Loads menu."),T("li",null,"Analyze → Run analysis, then pick a result view and adjust the scale."),T("li",null,"File → Save writes a comma-separated .sav file that opens in Excel.")),T("p",{class:"muted small"},`Current units: ${["F","L","FL","FA","M"].map(e=>qt(e)).join(", ")} (${on().label}) — change them with the units selector at the bottom-right. Z is vertical (up).`));oe({title:"Help",wide:!0,body:t,buttons:[{label:"Close",kind:"primary"}]})}const vh=(i,t)=>i.jointLoads.filter(e=>e.case===t).length+i.framePointLoads.filter(e=>e.case===t).length+i.frameUniformLoads.filter(e=>e.case===t).length+i.areaLoads.filter(e=>e.case===t).length,Ex=i=>i.factors.length?i.factors.map((t,e)=>`${e?t.factor<0?"− ":"+ ":t.factor<0?"−":""}${zn(Math.abs(t.factor),3)} ${t.case}`).join(" "):"(empty)";function wx(i){const t=i.model,e=T("div"),n=()=>{e.replaceChildren(yn(["Name","Type","Loads",""],t.data.loadCases.map((a,o)=>[document.createTextNode(a.name),document.createTextNode(a.type+(o===t.data.loadCases.findIndex(l=>l.type==="Dead")&&t.data.settings.selfWeight?" + self weight":"")),document.createTextNode(String(vh(t.data,a.name))),T("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>void s(a),"small danger"))])),T("div",{class:"dlg-actions"},me("+ Add load case",()=>r(null),"primary")),T("p",{class:"muted small"},"Each load case is analysed separately. Self weight (if enabled) is added to the first Dead case. Combine cases with Loads → Load combinations."))},s=async a=>{if(t.data.loadCases.length<=1)return void Wt("At least one load case is required","warn");const o=vh(t.data,a.name);o&&!await rs("Delete load case",`Load case "${a.name}" has ${o} load(s). Delete the case and its loads?`,"Delete",!0)||(t.commit("delete load case",l=>{const c=h=>h.case!==a.name;l.loadCases=l.loadCases.filter(h=>h.name!==a.name),l.jointLoads=l.jointLoads.filter(c),l.framePointLoads=l.framePointLoads.filter(c),l.frameUniformLoads=l.frameUniformLoads.filter(c),l.areaLoads=l.areaLoads.filter(c);for(const h of l.loadCombos)h.factors=h.factors.filter(d=>d.case!==a.name)}),n())},r=a=>{const o=Vs("Name",(a==null?void 0:a.name)??`CASE${t.data.loadCases.length+1}`),l=Qe("Type",yh.map(c=>[c,c]),(a==null?void 0:a.type)??"Other");oe({title:a?`Edit load case ${a.name}`:"Add load case",body:T("div",{class:"form"},o.row,l.row),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=o.get(),h=[...t.data.loadCases.filter(u=>u!==a).map(u=>u.name),...t.data.loadCombos.map(u=>u.name)],d=Gs(c,h,"Load case");if(d)return _e(d);t.commit(a?"edit load case":"add load case",u=>{if(!a)return void u.loadCases.push({name:c,type:l.get()});const f=u.loadCases.find(p=>p.name===a.name);if(f.type=l.get(),c!==a.name){f.name=c;for(const p of[u.jointLoads,u.framePointLoads,u.frameUniformLoads,u.areaLoads])for(const m of p)m.case===a.name&&(m.case=c);for(const p of u.loadCombos)for(const m of p.factors)m.case===a.name&&(m.case=c)}}),a&&i.lastLoadCase===a.name&&(i.lastLoadCase=c),n()}}]})};n(),oe({title:"Load cases",body:e,buttons:[{label:"Close",kind:"primary"}]})}function Ax(i){const t=i.model,e=T("div"),n=()=>{e.replaceChildren(t.data.loadCombos.length?yn(["Name","Combination",""],t.data.loadCombos.map(a=>[document.createTextNode(a.name),document.createTextNode(Ex(a)),T("span",{class:"row-btns"},me("Edit",()=>r(a)),me("Delete",()=>s(a),"small danger"))])):T("p",{class:"muted"},"No load combinations. Results are shown per load case."),T("div",{class:"dlg-actions"},me("+ Add combination",()=>r(null),"primary")),T("p",{class:"muted small"},"Combination results are the factored sum of the load case results (linear superposition)."))},s=a=>{t.commit("delete load combination",o=>{o.loadCombos=o.loadCombos.filter(l=>l.name!==a.name)}),n()},r=a=>{const o=Vs("Name",(a==null?void 0:a.name)??`COMBO${t.data.loadCombos.length+1}`),l=t.data.loadCases.map(c=>{var h;return{lc:c,f:ae(`× ${c.name}`,a?((h=a.factors.find(d=>d.case===c.name))==null?void 0:h.factor)??0:0,{placeholder:"0"})}});oe({title:a?`Edit combination ${a.name}`:"Add load combination",body:T("div",{class:"form"},o.row,T("p",{class:"muted small"},"Scale factor for each load case (0 = not included)."),T("div",{class:"grid2"},...l.map(c=>c.f.row))),buttons:[{label:"Cancel"},{label:"OK",kind:"primary",action:()=>{const c=o.get(),h=[...t.data.loadCombos.filter(p=>p!==a).map(p=>p.name),...t.data.loadCases.map(p=>p.name)],d=Gs(c,h,"Combination");if(d)return _e(d);const u=l.map(p=>({case:p.lc.name,factor:p.f.input.value.trim()===""?0:p.f.get()}));if(u.some(p=>!Number.isFinite(p.factor)))return _e("Fix the highlighted fields");const f=u.filter(p=>p.factor!==0);if(!f.length)return _e("Enter at least one non-zero factor");t.commit(a?"edit load combination":"add load combination",p=>{const m={name:c,factors:f};a?p.loadCombos[p.loadCombos.findIndex(g=>g.name===a.name)]=m:p.loadCombos.push(m)}),n()}}]})};n(),oe({title:"Load combinations",body:e,buttons:[{label:"Close",kind:"primary"}]})}const wi=i=>T("dl",{class:"kv"},...i.flatMap(([t,e])=>[T("dt",null,t),T("dd",null,e)])),ke=(i,...t)=>T("section",{class:"insp-sec"},T("h3",null,i),...t),pe=(i,t,e="")=>T("button",{class:"btn small "+e,type:"button",onclick:t},i);function In(i,t){return T("div",{class:"table-wrap"},T("table",{class:"grid-table compact"},T("thead",null,T("tr",null,...i.map(e=>T("th",null,e)))),T("tbody",null,...t.map(e=>T("tr",null,...e.map(n=>T("td",null,n)))))))}function Ga(i,t){const e=i.selected(),n=e.joints.length+e.frames.length+e.areas.length;t.replaceChildren(),n===0?t.append(...Tx(i)):n===1&&e.joints.length?t.append(...Cx(i,e.joints[0])):n===1&&e.frames.length?t.append(...Rx(i,e.frames[0])):n===1&&e.areas.length?t.append(...Lx(i,e.areas[0])):t.append(...Px(i,e))}function Tx(i){const t=i.model.data,e=[ke("Model",wi([["Joints",String(t.joints.length)],["Frames",String(t.frames.length)],["Areas",String(t.areas.length)],["Supported joints",String(t.joints.filter(s=>s.r.some(Boolean)).length)],["Loads",String(t.jointLoads.length+t.framePointLoads.length+t.frameUniformLoads.length+t.areaLoads.length)],["Self weight",t.settings.selfWeight?"Included":"Off"]]))],n=i.results;return n&&(e.push(ke(`Analysis results — ${i.resultName}`,wi([["Equations",String(n.stats.equations)],["Max displacement",Ae(n.stats.maxDisp,"L",4)],["ΣLoad (X,Y,Z)",n.stats.sumLoad.map(s=>jt(s,"F",4)).join(", ")+" "+qt("F")],["ΣReaction (X,Y,Z)",n.stats.sumReaction.map(s=>jt(s,"F",4)).join(", ")+" "+qt("F")]]),pe("Show result tables…",()=>i.cmd("resultsTables")))),n.warnings.length&&e.push(ke("Warnings",T("ul",{class:"warn-list"},...n.warnings.map(s=>T("li",null,s)))))),e.push(T("p",{class:"muted small"},"Tap a joint, frame or area to see and edit its properties.")),e}function Iu(i,t,e){return pe(t,()=>{const n=i.map(r=>r.get());if(n.some(r=>!Number.isFinite(r)))return Wt("Fix the highlighted fields","error");const s=e(n);s&&Wt(s,"error")},"primary")}function Cx(i,t){const e=i.model,n=e.joint(t),s=ae("X",n.x,{q:"L"}),r=ae("Y",n.y,{q:"L"}),a=ae("Z",n.z,{q:"L"}),o=ni.map((f,p)=>fl(f,n.r[p]));for(const f of o)f.input.addEventListener("change",()=>e.commit("restraint",()=>{e.joint(t).r=o.map(p=>p.get())}));const l=T("div",{class:"chips"},...e.data.supportTypes.map(f=>pe(f.name,()=>e.commit("support",()=>{e.joint(t).r=[...f.r]})))),c=e.data.jointLoads.filter(f=>f.joint===t),h=[T("h2",{class:"insp-title"},`Joint ${t}`),ke("Coordinates",T("div",{class:"grid3"},s.row,r.row,a.row),Iu([s,r,a],"Apply",f=>e.moveJoints(new Set([t]),f[0]-n.x,f[1]-n.y,f[2]-n.z))),ke("Support ("+ml(n.r)+")",l,T("div",{class:"chk-row wrap"},...o.map(f=>f.row))),ke("Joint loads",c.length?In(["Case",...["FX","FY","FZ"].map(f=>`${f} (${qt("F")})`),...["MX","MY","MZ"].map(f=>`${f} (${qt("M")})`)],c.map(f=>[f.case,...f.f.map((p,m)=>jt(p,m<3?"F":"M",4))])):T("p",{class:"muted small"},"None"),T("div",{class:"row-btns"},pe("Add load…",()=>i.cmd("jointLoad")),c.length?pe("Delete loads",()=>e.commit("delete joint loads",f=>{f.jointLoads=f.jointLoads.filter(p=>p.joint!==t)}),"danger"):null))],d=e.data.frames.filter(f=>f.i===t||f.j===t).map(f=>f.id);h.push(wi([["Connected frames",d.length?d.join(", "):"None"]]));const u=i.results;if(u&&u.disp[t]){const f=u.disp[t];h.push(ke(`Displacement — ${i.resultName}`,In(["UX","UY","UZ"].map(m=>`${m} (${qt("L")})`),[f.slice(0,3).map(m=>jt(m,"L",4))]),In(["RX (rad)","RY (rad)","RZ (rad)"],[f.slice(3).map(m=>zn(m,4))])));const p=u.reactions[t];p&&h.push(ke("Support reaction",In(["FX","FY","FZ"].map(m=>`${m} (${qt("F")})`),[p.slice(0,3).map(m=>jt(m,"F",4))]),In(["MX","MY","MZ"].map(m=>`${m} (${qt("M")})`),[p.slice(3).map(m=>jt(m,"M",4))])))}return h}function Rx(i,t){var p;const e=i.model,n=e.data,s=e.frame(t),r=Qe("Material",n.materials.map(m=>[m.name,m.name]),s.material),a=Qe("Section",n.sections.map(m=>[m.name,`${m.name} (${Ls[m.shape]})`]),s.section),o=ae("Angle β",s.beta,{unit:"°"});r.input.addEventListener("change",()=>e.commit("assign material",()=>void(e.frame(t).material=r.get()))),a.input.addEventListener("change",()=>e.commit("assign section",()=>void(e.frame(t).section=a.get())));const l=n.sections.find(m=>m.name===s.section),c=l?bi(l):null,h=n.framePointLoads.filter(m=>m.frame===t),d=n.frameUniformLoads.filter(m=>m.frame===t),u=[T("h2",{class:"insp-title"},`Frame ${t}`),wi([["Joints I → J",`${s.i} → ${s.j}`],["Length",Ae(e.frameLength(s),"L",4)]]),ke("Properties",r.row,a.row,c?T("p",{class:"muted small"},`A = ${Ae(c.A,"A",4)}, I33 = ${Ae(c.I33,"L4",4)}, I22 = ${Ae(c.I22,"L4",4)}, J = ${Ae(c.J,"L4",4)}`):null,o.row,Iu([o],"Apply β",m=>void e.commit("beta",()=>void(e.frame(t).beta=m[0])))),ke("End releases",wi([["End I (Joint "+s.i+")",Ir(s.relI)],["End J (Joint "+s.j+")",Ir(s.relJ)]]),T("div",{class:"row-btns"},pe("Edit releases…",()=>Lu(i)),s.relI||s.relJ?pe("Set continuous",()=>{e.commit("clear releases",()=>{delete e.frame(t).relI,delete e.frame(t).relJ})}):null)),ke("Frame loads",h.length||d.length?In(["Case","Type","Direction","Value","Position"],[...h.map(m=>[m.case,"Point",Wa[m.dir],Ae(m.P,"F",4),"rd = "+zn(m.rd,3)]),...d.map(m=>[m.case,"Uniform",Wa[m.dir],Ae(m.w,"FL",4),"full length"])]):T("p",{class:"muted small"},"None"),T("div",{class:"row-btns"},pe("Point load…",()=>i.cmd("framePoint")),pe("Uniform load…",()=>i.cmd("frameUniform")),h.length||d.length?pe("Delete loads",()=>e.commit("delete frame loads",m=>{m.framePointLoads=m.framePointLoads.filter(g=>g.frame!==t),m.frameUniformLoads=m.frameUniformLoads.filter(g=>g.frame!==t)}),"danger"):null))],f=(p=i.results)==null?void 0:p.frames.find(m=>m.id===t);if(f){const m=f.x.length-1,g=["P","V2","V3","T","M2","M3"],v=D=>D<3?"F":"M",_=g.map((D,A)=>{const P=f[D],I=v(A);return[`${D} (${qt(I)})`,jt(P[0],I,4),jt(P[m],I,4),jt(Math.max(...P),I,4),jt(Math.min(...P),I,4)]});let M=0;for(const D of f.disp)M=Math.max(M,Math.hypot(...D));u.push(ke(`Internal forces — ${i.resultName}`,In(["","End I","End J","Max","Min"],_),T("p",{class:"muted small"},`Max displacement along member: ${Ae(M,"L",4)}`),pe("Diagrams…",()=>Cu(i,t))));const x=T("details",null,T("summary",null,"Station values"),In([`x (${qt("L")})`,...g.map((D,A)=>`${D} (${qt(v(A))})`)],f.x.map((D,A)=>[jt(D,"L",4),...g.map((P,I)=>jt(f[P][A],v(I),4))])));u.push(x)}return u}function Lx(i,t){const e=i.model,n=e.area(t),s=e.jointMap(),r=n.joints.map(u=>s.get(u)).filter(Boolean);let a=0,o=0,l=0;for(let u=0;u<r.length;u++){const f=r[u],p=r[(u+1)%r.length];a+=(f.y-p.y)*(f.z+p.z),o+=(f.z-p.z)*(f.x+p.x),l+=(f.x-p.x)*(f.y+p.y)}const c=Math.hypot(a,o,l)/2,h=Qe("Load distribution",[["two-way","Two-way"],["one-way","One-way"]],n.distribution);h.input.addEventListener("change",()=>e.commit("distribution",()=>void(e.area(t).distribution=h.get())));const d=e.data.areaLoads.filter(u=>u.area===t);return[T("h2",{class:"insp-title"},`Area ${t}`),wi([["Joints",n.joints.join(", ")],["Area",Ae(c,"A",4)]]),ke("Properties",h.row,T("p",{class:"muted small"},"Areas carry no stiffness; loads are transferred to the edge frames.")),ke("Area loads",d.length?In(["Case",`q (${qt("FA")}, down)`],d.map(u=>[u.case,jt(u.q,"FA",4)])):T("p",{class:"muted small"},"None"),T("div",{class:"row-btns"},pe("Add load…",()=>i.cmd("areaLoad")),d.length?pe("Delete loads",()=>e.commit("delete area loads",u=>{u.areaLoads=u.areaLoads.filter(f=>f.area!==t)}),"danger"):null))]}function Px(i,t){const e=[T("h2",{class:"insp-title"},"Selection"),wi([["Joints",t.joints.length?t.joints.join(", "):"–"],["Frames",t.frames.length?t.frames.join(", "):"–"],["Areas",t.areas.length?t.areas.join(", "):"–"]])],n=[];return t.joints.length&&n.push(pe("Supports…",()=>i.cmd("assignSupport")),pe("Joint load…",()=>i.cmd("jointLoad"))),t.frames.length&&n.push(pe("Material…",()=>i.cmd("assignMaterial")),pe("Section…",()=>i.cmd("assignSection")),pe("End releases…",()=>i.cmd("assignReleases")),pe("Point load…",()=>i.cmd("framePoint")),pe("Uniform load…",()=>i.cmd("frameUniform"))),t.areas.length&&n.push(pe("Area load…",()=>i.cmd("areaLoad"))),n.push(pe("Move…",()=>i.cmd("move")),pe("Replicate…",()=>i.cmd("replicate")),pe("Delete",()=>i.cmd("delete"),"danger")),e.push(ke("Quick actions",T("div",{class:"chips"},...n))),e}const Dx="1.1.2",Ix="2026-11-16",Ux={XY:"Z",XZ:"Y",YZ:"X"},_h=[["none","Undeformed"],["deformed","Deformed shape"],["P","Axial P"],["V2","Shear V2"],["V3","Shear V3"],["T","Torsion T"],["M2","Moment M2"],["M3","Moment M3"],["reactions","Support reactions"]],Nx={select:'<path d="M5 3l14 8-6 2-3 6z"/>',joint:'<circle cx="12" cy="12" r="4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',frame:'<circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="5" r="2.2"/><path d="M6.5 17.5l11-11"/>',area:'<path d="M4 18l4-12h12l-4 12z" fill="currentColor" fill-opacity=".25"/>',box:'<rect x="4" y="5" width="16" height="14" rx="1" stroke-dasharray="3 2"/>',multi:'<rect x="3" y="7" width="11" height="11" rx="2"/><path d="M10 4h8a2 2 0 0 1 2 2v8"/>',done:'<path d="M5 12.5l4.5 4.5L19 7"/>',fit:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',undo:'<path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12"/>',redo:'<path d="M15 7l5 5-5 5"/><path d="M20 12H10a6 6 0 0 0 0 12"/>',del:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',plane:'<path d="M3 15l6-5h12l-6 5z" fill="currentColor" fill-opacity=".2"/><path d="M17 4a5 5 0 0 1 3 4.5M20 8.5l.2-2.6M20 8.5l-2.5-.7"/>',planeUp:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 12V3M8.5 6.5L12 3l3.5 3.5"/>',planeDown:'<path d="M3 19l5-4h13l-5 4z" fill="currentColor" fill-opacity=".2"/><path d="M12 3v9M8.5 8.5L12 12l3.5-3.5"/>',run:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',panel:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'},Ha=i=>{const t=document.createElementNS("http://www.w3.org/2000/svg","svg");return t.setAttribute("viewBox","0 0 24 24"),t.setAttribute("class","ico"),t.innerHTML=Nx[i],t};class Fx{constructor(t){it(this,"model",new wl);it(this,"viewer");it(this,"tools");it(this,"selection",new Set);it(this,"resultSet",null);it(this,"resultName","");it(this,"lastLoadCase","");it(this,"fileName","Untitled.sav");it(this,"fileHandle",null);it(this,"dirty",!1);it(this,"includeResults",!0);it(this,"deformRel",0);it(this,"forceRel",0);it(this,"theme","light");it(this,"busy",!1);it(this,"root");it(this,"viewport");it(this,"panel");it(this,"panelBody");it(this,"statusEl");it(this,"coordEl");it(this,"unitsEl");it(this,"fileEl");it(this,"hintEl");it(this,"resultsBar");it(this,"toolButtons",new Map);it(this,"autosaveTimer",0);it(this,"suppressDirty",!1);it(this,"rb");it(this,"planeOffsets",{});it(this,"commands",{jointLoad:()=>this.need("joints")&&_x(this),framePoint:()=>this.need("frames")&&xx(this),frameUniform:()=>this.need("frames")&&Mx(this),areaLoad:()=>this.need("areas")&&yx(this),assignSupport:()=>this.need("joints")&&gx(this),assignMaterial:()=>this.need("frames")&&ka(this,"material"),assignSection:()=>this.need("frames")&&ka(this,"section"),assignBeta:()=>this.need("frames")&&ka(this,"beta"),assignReleases:()=>this.need("frames")&&Lu(this),assignArea:()=>this.need("areas")&&vx(this),move:()=>ph(this),replicate:()=>mh(this),divide:()=>this.need("frames")&&bx(this),delete:()=>void this.deleteSelected(),resultsTables:()=>Va(this)});this.root=t;const e=localStorage.getItem("structapp.theme");(e==="light"||e==="dark")&&(this.theme=e),this.buildLayout(),this.viewer=new v_(this.viewport),this.tools=new w_(this),this.applyTheme(),new S_(this.viewer.canvas,{tap:(n,s,r)=>this.tools.tap(n,s,r),longPress:(n,s)=>this.contextMenu(n,s),hover:(n,s,r)=>this.tools.hover(n,s,r),orbit:(n,s)=>this.viewer.orbit(n,s),pan:(n,s)=>this.viewer.pan(n,s),zoom:(n,s,r)=>this.viewer.zoom(n,s,r),wantsBox:n=>this.tools.wantsBox(n),box:(n,s,r,a,o)=>this.tools.box(n,s,r,a,o),wantsDrag:(n,s,r)=>this.tools.wantsDrag(n,s,r),drag:(n,s,r)=>this.tools.drag(n,s,r)}),this.model.onChange(n=>this.onModelChange(n)),this.installKeyboard(),window.addEventListener("beforeunload",n=>{this.dirty&&(n.preventDefault(),n.returnValue="")}),this.refresh(),this.viewer.fit(),this.onToolChanged(),this.offerRecovery()}get results(){var t;return((t=this.resultSet)==null?void 0:t.results[this.resultName])??null}buildLayout(){const e=[["File",()=>this.fileMenu()],["Edit",()=>this.editMenu()],["Define",()=>this.defineMenu()],["Draw",()=>this.drawMenu()],["Assign",()=>this.assignMenu()],["Loads",()=>this.loadsMenu()],["Analyze",()=>this.analyzeMenu()],["Display",()=>this.displayMenu()],["Help",()=>this.helpMenu()]].map(([u,f])=>{const p=T("button",{class:"menu-btn",type:"button"},u);return p.addEventListener("click",m=>{if(m.stopPropagation(),E_(p))return Vr();const g=p.getBoundingClientRect();nh(f(),g.left,g.bottom+2,p)}),p});this.fileEl=T("span",{class:"file-name"});const n=T("button",{class:"btn primary run-btn",type:"button",title:"Run analysis (F5)",onclick:()=>void this.analyze()},Ha("run"),T("span",null,"Run")),s=T("button",{class:"icon-btn",type:"button",title:"Show/hide properties panel",onclick:()=>this.togglePanel()},Ha("panel")),r=T("header",{class:"menubar"},T("div",{class:"brand"},"StructApp 3D"),T("nav",{class:"menus"},...e),T("div",{class:"spacer"}),this.fileEl,n,s),a=(u,f,p,m)=>{const g=T("button",{class:"tool-btn",type:"button",title:p,"aria-label":p,onclick:m},Ha(u),T("span",null,f));return this.toolButtons.set(u,g),g},o=T("nav",{class:"toolbar"},a("select","Select","Select (S)",()=>this.tools.setTool("select")),a("box","Box","Box/window select (B)",()=>this.tools.setTool("box")),a("multi","Multi","Multi-select: taps add to selection (M)",()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()}),a("done","Done","Finish frame chain / close area (Enter)",()=>this.tools.finishChain(!0)),T("div",{class:"tb-sep"}),a("joint","Joint","Draw joints (J)",()=>this.tools.setTool("joint")),a("frame","Frame","Draw frames (L)",()=>this.tools.setTool("frame")),a("area","Area","Draw areas (A)",()=>this.tools.setTool("area")),T("div",{class:"tb-sep"}),a("fit","Fit","Zoom to fit (F)",()=>this.viewer.fit()),a("undo","Undo","Undo (Ctrl+Z)",()=>this.undo()),a("redo","Redo","Redo (Ctrl+Y)",()=>this.redo()),a("del","Delete","Delete selected (Del)",()=>void this.deleteSelected()),T("div",{class:"tb-sep"}),a("plane","XY","Rotate work plane XY → XZ → YZ (P)",()=>this.rotateWorkPlane()),a("planeUp","Up","Shift work plane +1 grid spacing (PgUp)",()=>this.shiftWorkPlane(1)),a("planeDown","Down","Shift work plane −1 grid spacing (PgDn)",()=>this.shiftWorkPlane(-1)));this.viewport=T("div",{class:"viewport"}),this.hintEl=T("div",{class:"tool-hint"}),this.resultsBar=this.buildResultsBar();const l=T("div",{class:"viewport-wrap"},this.viewport,this.hintEl,this.resultsBar),c=u=>{const f=u.target;f&&(this.viewport.contains(f)||f===this.viewport)&&u.preventDefault()};l.addEventListener("contextmenu",c,!0),l.addEventListener("selectstart",c,!0),l.addEventListener("dragstart",c,!0),this.panelBody=T("div",{class:"panel-body"});const h=T("div",{class:"sheet-grip",onclick:()=>this.togglePanel()});this.panel=T("aside",{class:"panel"},h,T("div",{class:"panel-head"},T("span",null,"Properties"),T("button",{class:"icon-btn small",type:"button",title:"Close",onclick:()=>this.togglePanel(!1)},"✕")),this.panelBody),(localStorage.getItem("structapp.panel")==="closed"||window.innerWidth<700)&&this.panel.classList.add("collapsed"),this.statusEl=T("span",{class:"status-text"}),this.coordEl=T("span",{class:"coord"}),this.unitsEl=T("select",{class:"units",title:"Units for all input and output values","aria-label":"Units"},T("optgroup",{label:"Metric"},...ss.slice(0,4).map(u=>T("option",{value:u.id},u.label))),T("optgroup",{label:"Imperial"},...ss.slice(4).map(u=>T("option",{value:u.id},u.label)))),this.unitsEl.value=on().id,this.unitsEl.addEventListener("change",()=>Kc(this.unitsEl.value)),h_(()=>this.onUnitsChanged());const d=T("footer",{class:"statusbar"},this.statusEl,T("div",{class:"spacer"}),this.coordEl,this.unitsEl);this.root.replaceChildren(r,T("div",{class:"main"},o,l,this.panel),d)}buildResultsBar(){const t=T("select",{class:"rb-view","aria-label":"Result display"},..._h.map(([d,u])=>T("option",{value:d},u)));t.addEventListener("change",()=>this.setResultView(t.value));const e=T("input",{type:"range",min:"-3",max:"3",step:"0.05",value:"0","aria-label":"Deformation scale"});e.addEventListener("input",()=>{this.deformRel=Number(e.value),this.applyDeformScale()});const n=T("input",{type:"text",inputmode:"decimal",class:"rb-scale","aria-label":"Deformation scale factor"});n.addEventListener("change",()=>{const d=Number(n.value.replace(",","."));if(!(d>0)||!Number.isFinite(d)){Wt("Scale must be a positive number","error"),this.syncResultsBar();return}this.deformRel=Math.log10(d/this.viewer.autoDeformScale),this.applyDeformScale(!1)});const s=T("button",{class:"btn small",type:"button",onclick:()=>(this.deformRel=0,this.applyDeformScale())},"Auto"),r=T("input",{type:"range",min:"-1",max:"1",step:"0.05",value:"0","aria-label":"Diagram scale"});r.addEventListener("input",()=>{this.forceRel=Number(r.value),this.viewer.setResultOptions({forceScale:10**this.forceRel})});const a=T("input",{type:"checkbox"});a.addEventListener("change",()=>this.viewer.setResultOptions({animate:a.checked}));const o=T("input",{type:"checkbox",checked:!0});o.addEventListener("change",()=>this.viewer.setResultOptions({showValues:o.checked}));const l=T("div",{class:"rb-group"},T("label",null,"Scale"),e,n,s,T("label",{class:"check"},a,T("span",null,"Animate"))),c=T("div",{class:"rb-group"},T("label",null,"Size"),r),h=T("select",{class:"rb-case","aria-label":"Load case or combination"});return h.addEventListener("change",()=>this.setResultCase(h.value)),this.rb={rcase:h,view:t,slider:e,scale:n,forceSlider:r,animate:a,values:o,deformGroup:l,forceGroup:c},T("div",{class:"results-bar",hidden:!0},h,t,l,c,T("label",{class:"check"},o,T("span",null,"Values")),T("button",{class:"btn small",type:"button",onclick:()=>Va(this)},"Tables"),T("button",{class:"icon-btn small",type:"button",title:"Hide results",onclick:()=>this.setResultView("none")},"✕"))}applyDeformScale(t=!0){this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(t)}syncResultsBar(t=!0){var a;const e=this.rb,n=this.viewer.resultOpts.view,s=((a=this.resultSet)==null?void 0:a.items)??[],r=s.map(o=>o.kind+":"+o.name).join("|");e.rcase.dataset.sig!==r&&(e.rcase.dataset.sig=r,e.rcase.replaceChildren(...s.map(o=>T("option",{value:o.name},(o.kind==="combo"?"Combo: ":"Case: ")+o.name)))),e.rcase.value=this.resultName,e.view.value=n,t&&(e.slider.value=String(Math.max(-3,Math.min(3,this.deformRel)))),e.scale.value=zn(this.viewer.autoDeformScale*10**this.deformRel,4),e.forceSlider.value=String(this.forceRel),e.animate.checked=this.viewer.resultOpts.animate,e.values.checked=this.viewer.resultOpts.showValues,e.deformGroup.hidden=n==="none"||n==="reactions",e.forceGroup.hidden=!Ho.includes(n)&&n!=="reactions",this.resultsBar.hidden=!this.results}clearResults(t=!0){this.resultSet=null,this.viewer.setResults(null),this.viewer.setResultOptions({view:"none",animate:!1}),Gr(),t&&this.refresh()}setResultCase(t){var e;(e=this.resultSet)!=null&&e.results[t]&&(this.resultName=t,this.viewer.setResults(this.results),this.viewer.setResultOptions({deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.refresh())}setResultView(t){if(!this.results&&t!=="none")return void Wt("Run the analysis first","warn");this.viewer.setResultOptions({view:t,deformScale:this.viewer.autoDeformScale*10**this.deformRel}),this.syncResultsBar(),this.viewer.requestRender()}togglePanel(t){const e=t===void 0?!this.panel.classList.contains("collapsed"):!t;this.panel.classList.toggle("collapsed",e),localStorage.setItem("structapp.panel",e?"closed":"open")}applyTheme(){var t;document.documentElement.dataset.theme=this.theme,this.viewer.setTheme(this.theme==="dark"?yu:f_),(t=document.querySelector('meta[name="theme-color"]'))==null||t.setAttribute("content",this.theme==="dark"?"#0f172a":"#f8fafc")}onModelChange(t){this.resultSet&&this.clearResults(!1);for(const e of[...this.selection]){const{kind:n,id:s}=Ds(e);(n==="j"?this.model.joint(s):n==="f"?this.model.frame(s):this.model.area(s))||this.selection.delete(e)}t==="load"&&this.tools.cancel(),this.suppressDirty||(this.dirty=!0,this.scheduleAutosave()),this.refresh()}scheduleAutosave(){clearTimeout(this.autosaveTimer),this.autosaveTimer=window.setTimeout(()=>{try{ix(rh(this.model.data),this.fileName)}catch{}},1200)}onUnitsChanged(){this.unitsEl.value=on().id,this.coordEl.textContent="",this.viewer.rebuildAll(),Ga(this,this.panelBody),this.updateStatus(),ch(this),this.dirty&&this.scheduleAutosave(),Wt(`Units: ${on().label}`)}refresh(){this.viewer.setData(this.model.data,this.selection,this.results),Ga(this,this.panelBody),this.updateStatus(),this.syncResultsBar(),ch(this)}select(t,e){if(e==="replace")this.selection=new Set(t);else if(e==="add")for(const n of t)this.selection.add(n);else for(const n of t)this.selection.has(n)?this.selection.delete(n):this.selection.add(n);this.viewer.setData(this.model.data,this.selection,this.results),Ga(this,this.panelBody),this.selection.size&&window.innerWidth>=700&&localStorage.getItem("structapp.panel")!=="closed"&&this.togglePanel(!0),this.updateStatus()}selected(){const t={joints:[],frames:[],areas:[]};for(const e of this.selection){const{kind:n,id:s}=Ds(e);(n==="j"?t.joints:n==="f"?t.frames:t.areas).push(s)}for(const e of Object.values(t))e.sort((n,s)=>n-s);return t}selectAll(){const t=this.model.data;this.select([...t.joints.map(e=>Ie("j",e.id)),...t.frames.map(e=>Ie("f",e.id)),...t.areas.map(e=>Ie("a",e.id))],"replace")}onToolChanged(){var t,e;for(const n of["select","joint","frame","area","box"])(t=this.toolButtons.get(n))==null||t.classList.toggle("active",this.tools.tool===n);(e=this.toolButtons.get("multi"))==null||e.classList.toggle("active",this.tools.multi),this.viewer.canvas.dataset.tool=this.tools.tool,this.hintEl.textContent=Su[this.tools.tool],this.hintEl.hidden=this.tools.tool==="select",this.updateStatus()}updateStatus(){const t=this.model.data,e=this.selected(),n=e.joints.length+e.frames.length+e.areas.length,s=[this.tools.statusText(),`${t.joints.length} joints · ${t.frames.length} frames · ${t.areas.length} areas`];n&&s.push(`${n} selected`),this.results&&s.push(`analysed, max disp ${zn(this.results.stats.maxDisp/on().kSmall,3)} ${on().small}`),this.statusEl.textContent=s.filter(Boolean).join("  |  "),this.fileEl.textContent=(this.dirty?"● ":"")+this.fileName,document.title=`${this.dirty?"* ":""}${this.fileName} – StructApp 3D`,this.toolButtons.get("undo").disabled=!this.model.canUndo,this.toolButtons.get("redo").disabled=!this.model.canRedo,this.toolButtons.get("del").disabled=n===0;const r=this.tools.chain.length>0;this.toolButtons.get("done").disabled=!r;const{workPlane:a,elevation:o}=t.settings,l=Ux[a],c=(h,d)=>{var f;const u=(f=this.toolButtons.get(h))==null?void 0:f.querySelector("span");u&&(u.textContent=d)};c("plane",`${a} ${l}=${jt(o,"L",4)}`),c("planeUp",`${l} +`),c("planeDown",`${l} −`)}setWorkPlane(t,e){const n=this.model.data.settings;n.workPlane===t&&n.elevation===e||(n.workPlane=t,n.elevation=e,this.planeOffsets[t]=e,this.dirty=!0,this.scheduleAutosave(),this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}rotateWorkPlane(){const t=["XY","XZ","YZ"],e=this.model.data.settings,n=t[(t.indexOf(e.workPlane)+1)%t.length],{joints:s}=this.selected(),r=s.length===1?this.model.joint(s[0]):void 0,a=r?n==="XY"?r.z:n==="XZ"?r.y:r.x:void 0;this.setWorkPlane(n,a??this.planeOffsets[n]??0)}shiftWorkPlane(t){const e=this.model.data.settings;this.setWorkPlane(e.workPlane,Number((e.elevation+t*e.gridSpacing).toFixed(9)))}setCoordReadout(t){this.coordEl.textContent=t?`X ${jt(t.x,"L",4)}  Y ${jt(t.y,"L",4)}  Z ${jt(t.z,"L",4)} ${qt("L")}`:""}cmd(t){var e,n;(n=(e=this.commands)[t])==null||n.call(e)}need(t){return this.selected()[t].length?!0:(Wt(`Select one or more ${t} first`,"warn"),!1)}undo(){this.model.canUndo&&(this.tools.finishChain(!1),this.keepWorkPlane(()=>this.model.undo()))}keepWorkPlane(t){const{workPlane:e,elevation:n}=this.model.data.settings;t();const s=this.model.data.settings;(s.workPlane!==e||s.elevation!==n)&&(s.workPlane=e,s.elevation=n,this.viewer.setData(this.model.data,this.selection,this.results),this.updateStatus())}redo(){this.model.canRedo&&this.keepWorkPlane(()=>this.model.redo())}async deleteSelected(){const t=this.selected(),e=t.joints.length+t.frames.length+t.areas.length;e&&(this.model.commit("delete",()=>this.model.deleteObjects(t.joints,t.frames,t.areas)),this.selection.clear(),this.refresh(),Wt(`Deleted ${e} object${e>1?"s":""} (Undo to restore)`,"info"))}async analyze(){if(this.busy)return;this.tools.finishChain(!0);const t=this.model.data;if(!t.frames.length)return void mi("Nothing to analyse","Draw at least one frame and assign supports before running the analysis.");this.busy=!0,document.body.classList.add("busy");const e=performance.now();try{const n=await G_(t),s=n.items.find(o=>o.name===this.resultName);this.resultSet=n,this.resultName=s?s.name:(n.items.find(o=>o.kind==="combo")??n.items[0]).name;const r=this.results;this.viewer.setResults(r),this.deformRel=0,this.viewer.setResultOptions({view:"deformed",deformScale:this.viewer.autoDeformScale}),this.refresh();const a=[...new Set(n.items.flatMap(o=>n.results[o.name].warnings))];Wt(`Analysis complete in ${Math.round(performance.now()-e)} ms – ${r.stats.equations} equations, ${n.items.length} cases/combos`,"ok"),a.length&&Wt(a.slice(0,3).join(`
`)+(a.length>3?`
(+${a.length-3} more)`:""),"warn",7e3)}catch(n){mi("Analysis failed",n instanceof Error?n.message:String(n))}finally{this.busy=!1,document.body.classList.remove("busy")}}loadData(t,e,n){this.suppressDirty=!0;try{this.selection.clear(),this.model.load(t)}finally{this.suppressDirty=!1}this.fileName=e,this.fileHandle=n,this.planeOffsets={},this.dirty=!1,this.refresh(),this.viewer.fit()}async confirmDiscard(){return this.dirty?rs("Unsaved changes",`Discard unsaved changes to ${this.fileName}?`,"Discard",!0):!0}async newModel(){await this.confirmDiscard()&&(this.loadData($o(),"Untitled.sav",null),vs())}async open(){if(await this.confirmDiscard())try{const t=await nx();if(!t)return;const e={},n=ah(t.text,e);this.loadData(n,t.name,t.handle),vs(),e.units&&Kc(e.units),Wt(`Opened ${t.name} (${on().label})`,"ok")}catch(t){mi("Cannot open file",t instanceof Pe||t instanceof Error?t.message:String(t))}}async save(t=!1){this.tools.finishChain(!0);try{const e=rh(this.model.data,this.includeResults?this.resultSet:null),n=this.fileName.toLowerCase().endsWith(".sav")?this.fileName:this.fileName+".sav",s=await tx(e,n,t?null:this.fileHandle);if(!s)return;this.fileName=s.name,this.fileHandle=s.handle,this.dirty=!1,vs(),this.updateStatus(),Wt(`Saved ${s.name}`,"ok")}catch(e){mi("Save failed",e instanceof Error?e.message:String(e))}}async offerRecovery(){const t=sx();if(!t)return;let e;try{e=ah(t.text)}catch{vs();return}if(!e.joints.length)return;const n=new Date(t.time).toLocaleString();await rs("Recover unsaved work?",`An auto-saved copy of "${t.name}" from ${n} was found (${e.joints.length} joints, ${e.frames.length} frames).`,"Recover")?(this.loadData(e,t.name,null),this.dirty=!0,this.updateStatus()):vs()}async loadExample(){if(!await this.confirmDiscard())return;const t=new wl,e=[0,6,12],n=[0,5],s=[0,3.5,7];t.commit("example",r=>{r.sections.push({name:"WF400",shape:"I",dims:[.4,.2,.013,.008]});const a=(o,l,c)=>t.addJoint(o,l,c);for(let o=0;o<s.length;o++)for(const l of e)for(const c of n){const h=a(l,c,s[o]);o===0&&(t.joint(h).r=[...bh])}for(let o=1;o<s.length;o++){for(const l of e)for(const c of n){const h=t.addFrame(a(l,c,s[o-1]),a(l,c,s[o]));t.frame(h).section="WF400",t.frame(h).material="STEEL"}for(const l of n)for(let c=0;c<e.length-1;c++){const h=t.addFrame(a(e[c],l,s[o]),a(e[c+1],l,s[o]));t.frame(h).section="IWF300",t.frame(h).material="STEEL"}for(const l of e){const c=t.addFrame(a(l,0,s[o]),a(l,5,s[o]));t.frame(c).section="IWF300",t.frame(c).material="STEEL"}for(let l=0;l<e.length-1;l++){const c=t.addArea([a(e[l],0,s[o]),a(e[l+1],0,s[o]),a(e[l+1],5,s[o]),a(e[l],5,s[o])]);r.areaLoads.push({case:Ur,area:c,q:1.5},{case:Nr,area:c,q:2.5})}for(const l of n)r.jointLoads.push({case:"WIND",joint:a(0,l,s[o]),f:[5*o,0,0,0,0,0]})}r.loadCases.push({name:"WIND",type:"Other"}),r.loadCombos.push({name:"COMBO2",factors:[{case:Ur,factor:1.2},{case:Nr,factor:1},{case:"WIND",factor:1}]}),r.settings.gridSpacing=1,r.settings.gridLines=15,r.settings.selfWeight=!0}),this.loadData(t.data,"Example-2storey.sav",null),Wt("Example loaded – tap Run to analyse","ok")}toggle(t,e,n){return{label:t,checked:e,action:()=>n(!e())}}disp(t,e){return this.toggle(t,()=>this.viewer.display[e],n=>{this.viewer.display[e]=n,this.viewer.rebuildAll()})}fileMenu(){return[{label:"New",shortcut:"Ctrl+N",action:()=>void this.newModel()},{label:"Open .sav…",shortcut:"Ctrl+O",action:()=>void this.open()},{label:"Save",shortcut:"Ctrl+S",action:()=>void this.save()},{label:"Save As…",shortcut:"Ctrl+Shift+S",action:()=>void this.save(!0)},{separator:!0},this.toggle("Include results in .sav",()=>this.includeResults,t=>this.includeResults=t),{separator:!0},{label:"Load example model",action:()=>void this.loadExample()}]}editMenu(){const t=()=>this.selection.size===0;return[{label:"Undo",shortcut:"Ctrl+Z",action:()=>this.undo(),disabled:()=>!this.model.canUndo},{label:"Redo",shortcut:"Ctrl+Y",action:()=>this.redo(),disabled:()=>!this.model.canRedo},{separator:!0},{label:"Select all",shortcut:"Ctrl+A",action:()=>this.selectAll()},{label:"Clear selection",shortcut:"Esc",action:()=>this.select([],"replace"),disabled:t},{label:"Delete selected",shortcut:"Del",action:()=>void this.deleteSelected(),disabled:t},{separator:!0},{label:"Move…",action:()=>ph(this),disabled:t},{label:"Replicate…",action:()=>mh(this),disabled:t},{label:"Divide frames…",action:()=>this.cmd("divide"),disabled:()=>!this.selected().frames.length}]}defineMenu(){return[{label:"Materials…",action:()=>dx(this)},{label:"Frame sections…",action:()=>px(this)},{label:"Support types…",action:()=>mx(this)},{separator:!0},{label:"Grid & work plane…",action:()=>uh(this)}]}drawMenu(){const t=(e,n,s)=>({label:n,shortcut:s,checked:()=>this.tools.tool===e,action:()=>this.tools.setTool(e)});return[t("select","Select","S"),t("joint","Draw joint","J"),t("frame","Draw frame","L"),t("area","Draw area","A"),t("box","Box select","B"),{separator:!0},{label:"Add joint by coordinates…",action:()=>fh(this)},{label:"Add frame by joints…",action:()=>Sx(this)},{separator:!0},{label:"Grid & work plane…",action:()=>uh(this)}]}assignMenu(){return[{heading:"Joints"},{label:"Support / restraints…",action:()=>this.cmd("assignSupport")},{heading:"Frames"},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"Local axis angle β…",action:()=>this.cmd("assignBeta")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{heading:"Areas"},{label:"Load distribution…",action:()=>this.cmd("assignArea")}]}loadsMenu(){return[{label:"Joint point load…",action:()=>this.cmd("jointLoad")},{label:"Frame point load…",action:()=>this.cmd("framePoint")},{label:"Frame uniform load…",action:()=>this.cmd("frameUniform")},{label:"Area uniform load…",action:()=>this.cmd("areaLoad")},{separator:!0},{label:"Load cases…",action:()=>wx(this)},{label:"Load combinations…",action:()=>Ax(this)},{separator:!0},this.toggle("Include self weight",()=>this.model.data.settings.selfWeight,t=>this.model.commit("self weight",e=>void(e.settings.selfWeight=t))),{separator:!0},{label:"Clear loads on selection…",action:()=>void dh(this),disabled:()=>this.selection.size===0}]}analyzeMenu(){const t=()=>!this.results,e=(n,s)=>({label:s,checked:()=>this.viewer.resultOpts.view===n,disabled:t,action:()=>this.setResultView(n)});return[{label:"Run analysis",shortcut:"F5",action:()=>void this.analyze()},{heading:"Show"},..._h.map(([n,s])=>e(n,s)),{separator:!0},{label:"Result tables…",action:()=>Va(this),disabled:t},{label:"Clear results",disabled:t,action:()=>this.clearResults()}]}displayMenu(){const t=this.viewer;return[{heading:"View"},{label:"Fit all",shortcut:"F",action:()=>t.fit()},{label:"3D (isometric)",shortcut:"0",action:()=>t.viewPreset("iso")},{label:"Top (X-Y)",shortcut:"1",action:()=>t.viewPreset("top")},{label:"Front (X-Z)",shortcut:"2",action:()=>t.viewPreset("front")},{label:"Side (Y-Z)",shortcut:"3",action:()=>t.viewPreset("side")},this.toggle("Orthographic",()=>t.useOrtho,e=>t.setOrtho(e)),{heading:"Show"},this.disp("Joint labels","jointLabels"),this.disp("Frame labels","frameLabels"),this.disp("Area labels","areaLabels"),this.disp("Loads","showLoads"),this.disp("Load values","loadValues"),this.disp("Supports","showSupports"),this.disp("Extruded sections","extruded"),{separator:!0},this.toggle("Dark theme",()=>this.theme==="dark",e=>{this.theme=e?"dark":"light",localStorage.setItem("structapp.theme",this.theme),this.applyTheme()}),this.toggle("Properties panel",()=>!this.panel.classList.contains("collapsed"),e=>this.togglePanel(e))]}helpMenu(){return[{label:"Quick guide",shortcut:"F1",action:()=>gh()},{label:"Load example model",action:()=>void this.loadExample()},{separator:!0},{label:"About",action:()=>void mi("About StructApp 3D",`StructApp 3D v${Dx} (${Ix})
Touch-friendly 3D frame structural analysis (linear static, 12-DOF space frame elements with member end releases).`)}]}contextMenu(t,e){this.tools.finishChain(!0);const n=this.viewer.pick(t,e,24);n&&!this.selection.has(n)&&this.select([n],this.tools.multi?"add":"replace");const s=this.selected(),r=[];if(s.joints.length&&r.push({heading:`Joints (${s.joints.length})`},{label:"Support…",action:()=>this.cmd("assignSupport")},{label:"Joint load…",action:()=>this.cmd("jointLoad")}),s.frames.length===1&&this.results){const a=s.frames[0];r.push({heading:`Frame ${a} results`},{label:"Frame diagrams…",action:()=>Cu(this,a)})}s.frames.length&&r.push({heading:`Frames (${s.frames.length})`},{label:"Material…",action:()=>this.cmd("assignMaterial")},{label:"Section…",action:()=>this.cmd("assignSection")},{label:"End releases…",action:()=>this.cmd("assignReleases")},{label:"Point load…",action:()=>this.cmd("framePoint")},{label:"Uniform load…",action:()=>this.cmd("frameUniform")},{label:"Divide…",action:()=>this.cmd("divide")}),s.areas.length&&r.push({heading:`Areas (${s.areas.length})`},{label:"Area load…",action:()=>this.cmd("areaLoad")},{label:"Distribution…",action:()=>this.cmd("assignArea")}),this.selection.size?r.push({separator:!0},{label:"Properties",action:()=>this.togglePanel(!0)},{label:"Move…",action:()=>this.cmd("move")},{label:"Replicate…",action:()=>this.cmd("replicate")},{label:"Clear loads…",action:()=>void dh(this)},{label:"Delete",action:()=>void this.deleteSelected()},{label:"Clear selection",action:()=>this.select([],"replace")}):r.push({label:"Fit all",action:()=>this.viewer.fit()},{label:"Add joint…",action:()=>fh(this)},{label:"Select all",action:()=>this.selectAll()},{label:"Run analysis",action:()=>void this.analyze()}),nh(r,t,e)}installKeyboard(){window.addEventListener("keydown",t=>{const e=t.target;if(b_()||["INPUT","TEXTAREA","SELECT"].includes(e.tagName)||e.isContentEditable)return;const n=t.key.toLowerCase(),s=t.ctrlKey||t.metaKey,r=a=>{t.preventDefault(),a()};if(s){n==="z"&&!t.shiftKey?r(()=>this.undo()):n==="y"||n==="z"&&t.shiftKey?r(()=>this.redo()):n==="s"?r(()=>void this.save(t.shiftKey)):n==="o"?r(()=>void this.open()):n==="n"?r(()=>void this.newModel()):n==="a"&&r(()=>this.selectAll());return}if(!t.altKey)switch(n){case"delete":case"backspace":return r(()=>void this.deleteSelected());case"escape":return r(()=>{Vr(),this.tools.chain.length?this.tools.cancel():this.tools.tool!=="select"?this.tools.setTool("select"):this.select([],"replace")});case"enter":return r(()=>this.tools.finishChain(!0));case"f":return r(()=>this.viewer.fit());case"p":return r(()=>this.rotateWorkPlane());case"pageup":return r(()=>this.shiftWorkPlane(1));case"pagedown":return r(()=>this.shiftWorkPlane(-1));case"s":return r(()=>this.tools.setTool("select"));case"j":return r(()=>this.tools.setTool("joint"));case"l":return r(()=>this.tools.setTool("frame"));case"a":return r(()=>this.tools.setTool("area"));case"b":return r(()=>this.tools.setTool("box"));case"m":return r(()=>{this.tools.multi=!this.tools.multi,this.onToolChanged()});case"f5":return r(()=>void this.analyze());case"f1":return r(()=>gh());case"0":return r(()=>this.viewer.viewPreset("iso"));case"1":return r(()=>this.viewer.viewPreset("top"));case"2":return r(()=>this.viewer.viewPreset("front"));case"3":return r(()=>this.viewer.viewPreset("side"))}})}}let xh=0;document.addEventListener("touchend",i=>{const t=Date.now(),e=i.target;t-xh<350&&!e.closest("input, textarea, select")&&i.preventDefault(),xh=t},{passive:!1});const Uu=document.getElementById("app");if(!Uu)throw new Error("#app element missing");const Ox=new Fx(Uu);window.structApp=Ox;
