// ==UserScript==
// @name         SCU URP++教务系统美化
// @namespace    https://github.com/chaolan2019/SCU-URP-plusplus
// @version      1.9.6
// @description  四川大学 URP 教务系统美化 + 清爽模式 | 课表/成绩/教室聚合
// @author       Chao_Lan,Hanako
// @license      GPL-3.0-only
// @icon         https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/docs/icon.png
// @updateURL    https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js
// @downloadURL  https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js
// @match        http://zhjw.scu.edu.cn/*
// @match        http://202.115.47.141/*
// @match        https://id.scu.edu.cn/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      cdn.jsdelivr.net
// @connect      gh-proxy.com
// @connect      api.yanjiangrd.site
// @run-at       document-start
// ==/UserScript==

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

(()=>{var Ac=Object.defineProperty;var a=(n,p)=>Ac(n,"name",{value:p,configurable:!0});function or(n){let p=String(n).replace("#","").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return p?{r:parseInt(p[1],16),g:parseInt(p[2],16),b:parseInt(p[3],16)}:{r:30,g:58,b:95}}a(or,"hexToRgb");function _r(n,p,c){return"#"+[n,p,c].map(d=>Math.max(0,Math.min(255,Math.round(d))).toString(16).padStart(2,"0")).join("")}a(_r,"rgbToHex");function Vt(n){let p=String(n||"").trim();return p?(p[0]!=="#"&&(p="#"+p),/^#[0-9a-fA-F]{6}$/.test(p)?p.toUpperCase():""):""}a(Vt,"normalizeHexColor");function fo(n,p){let{r:c,g:d,b:u}=or(n),k=1-p;return _r(c*k,d*k,u*k)}a(fo,"darken");function Ae(n,p){let{r:c,g:d,b:u}=or(n);return`rgba(${c},${d},${u},${p})`}a(Ae,"alpha");function Ft(n,p,c){let d=or(Vt(n)||"#FFFFFF"),u=or(Vt(p)||"#FFFFFF"),k=Math.max(0,Math.min(1,Number(c)||0));return _r(d.r+(u.r-d.r)*k,d.g+(u.g-d.g)*k,d.b+(u.b-d.b)*k)}a(Ft,"mixHex");function go(n,p){if(typeof n!="function")throw new TypeError(`${p} must be a function`)}a(go,"assertFunction");function pa(n){if(!n||typeof n!="object")throw new TypeError("feature definition must be an object");let p=String(n.id||"").trim();if(!p)throw new TypeError("feature id is required");return go(n.matches,`${p}.matches`),go(n.mount,`${p}.mount`),go(n.unmount,`${p}.unmount`),Object.freeze({id:p,matches:n.matches,mount:n.mount,unmount:n.unmount})}a(pa,"defineFeature");function kp(n){if(!Array.isArray(n))throw new TypeError("features must be an array");let p=n.map(pa),c=new Set;p.forEach(A=>{if(c.has(A.id))throw new Error(`duplicate feature id: ${A.id}`);c.add(A.id)});let d=null,u=null;function k(){if(!d)return;let A=d,y=u;d=null,u=null,A.unmount(y)}a(k,"unmount");function P(A={}){let y=p.find(g=>g.matches(A));if(y&&d===y&&A.lifecycleKey!==void 0&&u?.lifecycleKey===A.lifecycleKey)try{return y.mount(A),u=A,y.id}catch(g){throw k(),g}if(k(),!y)return null;try{return y.mount(A),d=y,u=A,y.id}catch(g){try{y.unmount(A)}catch{}throw g}}return a(P,"refresh"),Object.freeze({refresh:P,unmount:k,getActiveFeatureId:a(()=>d?.id||null,"getActiveFeatureId"),listFeatureIds:a(()=>p.map(A=>A.id),"listFeatureIds")})}a(kp,"createFeatureRuntime");function at(n){return String(n||"").replace(/[&<>"']/g,p=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[p])}a(at,"escapeHtml");function xo(n){let p=String(n||"").match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);return p?p[1]:""}a(xo,"parseUserscriptVersion");function Ap(n){return String(n||"0").replace(/^v/i,"").split(/[.+\-]/).filter(Boolean).map(p=>/^\d+$/.test(p)?parseInt(p,10):p)}a(Ap,"normalizeVersionParts");function Er(n,p){let c=Ap(n),d=Ap(p),u=Math.max(c.length,d.length);for(let k=0;k<u;k+=1){let P=c[k]==null?0:c[k],A=d[k]==null?0:d[k];if(typeof P=="number"&&typeof A=="number"){if(P>A)return 1;if(P<A)return-1;continue}let g=String(P),v=String(A);if(g>v)return 1;if(g<v)return-1}return 0}a(Er,"compareVersions");var Sc=typeof TextEncoder<"u"?new TextEncoder:{encode:a(n=>Uint8Array.from(Buffer.from(n,"utf8")),"encode")};function Cr(n){return typeof n=="string"?Sc.encode(n):n instanceof Uint8Array?n:ArrayBuffer.isView(n)?new Uint8Array(n.buffer,n.byteOffset,n.byteLength):new Uint8Array(n)}a(Cr,"toBytes");var _c=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function ie(n,p){return n>>>p|n<<32-p}a(ie,"rotr");function ko(n){let p=Cr(n),c=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),d=p.length,u=Math.floor(d/536870912),k=d<<3>>>0,P=(d+8>>6<<6)+64,A=new Uint8Array(P);A.set(p),A[d]=128;let y=new DataView(A.buffer);y.setUint32(P-8,u),y.setUint32(P-4,k);let S=new Uint32Array(64);for(let v=0;v<P;v+=64){for(let $=0;$<16;$+=1)S[$]=y.getUint32(v+$*4);for(let $=16;$<64;$+=1){let T=ie(S[$-15],7)^ie(S[$-15],18)^S[$-15]>>>3,j=ie(S[$-2],17)^ie(S[$-2],19)^S[$-2]>>>10;S[$]=S[$-16]+T+S[$-7]+j>>>0}let q=c[0],C=c[1],f=c[2],h=c[3],w=c[4],x=c[5],E=c[6],L=c[7];for(let $=0;$<64;$+=1){let T=ie(w,6)^ie(w,11)^ie(w,25),j=w&x^~w&E,I=L+T+j+_c[$]+S[$]>>>0,H=ie(q,2)^ie(q,13)^ie(q,22),G=q&C^q&f^C&f,U=H+G>>>0;L=E,E=x,x=w,w=h+I>>>0,h=f,f=C,C=q,q=I+U>>>0}c[0]=c[0]+q>>>0,c[1]=c[1]+C>>>0,c[2]=c[2]+f>>>0,c[3]=c[3]+h>>>0,c[4]=c[4]+w>>>0,c[5]=c[5]+x>>>0,c[6]=c[6]+E>>>0,c[7]=c[7]+L>>>0}let g=new Uint8Array(32);for(let v=0;v<8;v+=1)g[v*4]=c[v]>>>24,g[v*4+1]=c[v]>>>16,g[v*4+2]=c[v]>>>8,g[v*4+3]=c[v];return g}a(ko,"sha256Bytes");var Ec=[0x428a2f98d728ae22n,0x7137449123ef65cdn,0xb5c0fbcfec4d3b2fn,0xe9b5dba58189dbbcn,0x3956c25bf348b538n,0x59f111f1b605d019n,0x923f82a4af194f9bn,0xab1c5ed5da6d8118n,0xd807aa98a3030242n,0x12835b0145706fben,0x243185be4ee4b28cn,0x550c7dc3d5ffb4e2n,0x72be5d74f27b896fn,0x80deb1fe3b1696b1n,0x9bdc06a725c71235n,0xc19bf174cf692694n,0xe49b69c19ef14ad2n,0xefbe4786384f25e3n,0x0fc19dc68b8cd5b5n,0x240ca1cc77ac9c65n,0x2de92c6f592b0275n,0x4a7484aa6ea6e483n,0x5cb0a9dcbd41fbd4n,0x76f988da831153b5n,0x983e5152ee66dfabn,0xa831c66d2db43210n,0xb00327c898fb213fn,0xbf597fc7beef0ee4n,0xc6e00bf33da88fc2n,0xd5a79147930aa725n,0x06ca6351e003826fn,0x142929670a0e6e70n,0x27b70a8546d22ffcn,0x2e1b21385c26c926n,0x4d2c6dfc5ac42aedn,0x53380d139d95b3dfn,0x650a73548baf63den,0x766a0abb3c77b2a8n,0x81c2c92e47edaee6n,0x92722c851482353bn,0xa2bfe8a14cf10364n,0xa81a664bbc423001n,0xc24b8b70d0f89791n,0xc76c51a30654be30n,0xd192e819d6ef5218n,0xd69906245565a910n,0xf40e35855771202an,0x106aa07032bbd1b8n,0x19a4c116b8d2d0c8n,0x1e376c085141ab53n,0x2748774cdf8eeb99n,0x34b0bcb5e19b48a8n,0x391c0cb3c5c95a63n,0x4ed8aa4ae3418acbn,0x5b9cca4f7763e373n,0x682e6ff3d6b2b8a3n,0x748f82ee5defb2fcn,0x78a5636f43172f60n,0x84c87814a1f0ab72n,0x8cc702081a6439ecn,0x90befffa23631e28n,0xa4506cebde82bde9n,0xbef9a3f7b2c67915n,0xc67178f2e372532bn,0xca273eceea26619cn,0xd186b8c721c0c207n,0xeada7dd6cde0eb1en,0xf57d4f7fee6ed178n,0x06f067aa72176fban,0x0a637dc5a2c898a6n,0x113f9804bef90daen,0x1b710b35131c471bn,0x28db77f523047d84n,0x32caab7b40c72493n,0x3c9ebe0a15c9bebcn,0x431d67c49c100d4cn,0x4cc5d4becb3e42b6n,0x597f299cfc657e2an,0x5fcb6fab3ad6faecn,0x6c44198c4a475817n].map(n=>BigInt(n));function se(n,p){return(n>>BigInt(p)|n<<BigInt(64-p))&0xffffffffffffffffn}a(se,"rotr64");function Cc(n){let p=Cr(n),c=[0x6a09e667f3bcc908n,0xbb67ae8584caa73bn,0x3c6ef372fe94f82bn,0xa54ff53a5f1d36f1n,0x510e527fade682d1n,0x9b05688c2b3e6c1fn,0x1f83d9abfb41bd6bn,0x5be0cd19137e2179n],d=p.length,u=BigInt(d)*8n,k=d+8+15>>4<<4,P=new Uint8Array(k+16);P.set(p),P[d]=128;let A=new DataView(P.buffer);A.setBigUint64(P.length-8,u);let y=new Array(80);for(let g=0;g<P.length;g+=128){for(let L=0;L<16;L+=1)y[L]=A.getBigUint64(g+L*8);for(let L=16;L<80;L+=1){let $=se(y[L-15],1)^se(y[L-15],8)^y[L-15]>>7n,T=se(y[L-2],19)^se(y[L-2],61)^y[L-2]>>6n;y[L]=y[L-16]+$+y[L-7]+T&0xffffffffffffffffn}let v=c[0],q=c[1],C=c[2],f=c[3],h=c[4],w=c[5],x=c[6],E=c[7];for(let L=0;L<80;L+=1){let $=se(h,14)^se(h,18)^se(h,41),T=h&w^~h&x,j=E+$+T+Ec[L]+y[L]&0xffffffffffffffffn,I=se(v,28)^se(v,34)^se(v,39),H=v&q^v&C^q&C,G=I+H&0xffffffffffffffffn;E=x,x=w,w=h,h=f+j&0xffffffffffffffffn,f=C,C=q,q=v,v=j+G&0xffffffffffffffffn}c[0]=c[0]+v&0xffffffffffffffffn,c[1]=c[1]+q&0xffffffffffffffffn,c[2]=c[2]+C&0xffffffffffffffffn,c[3]=c[3]+f&0xffffffffffffffffn,c[4]=c[4]+h&0xffffffffffffffffn,c[5]=c[5]+w&0xffffffffffffffffn,c[6]=c[6]+x&0xffffffffffffffffn,c[7]=c[7]+E&0xffffffffffffffffn}let S=new Uint8Array(64);for(let g=0;g<8;g+=1){let v=c[g]&0xffffffffffffffffn;for(let q=0;q<8;q+=1)S[g*8+q]=Number(v>>BigInt(56-q*8)&0xffn)}return S}a(Cc,"sha512Bytes");var mt=2n**255n-19n,Sp=2n**252n+27742317777372353535851937790883648493n;function nr(n,p,c){let d=1n;for(n%=c;p;p>>=1n)p&1n&&(d=d*n%c),n=n*n%c;return d}a(nr,"powmod");var Ep=(mt-121665n)*nr(121666n,mt-2n,mt)%mt,Pc=nr(2n,(mt-1n)/4n,mt);function yo(n){let p=0n;for(let c=0;c<n.length;c+=1)p|=BigInt(n[c])<<BigInt(8*c);return p}a(yo,"fromLE");function zc(n,p){let c=new Uint8Array(p);for(let d=0;d<p;d+=1)c[d]=Number(n&255n),n>>=8n;return c}a(zc,"toLE");function vo(n){if(n.length!==32)return null;let p=(n[31]&128)!==0,c=yo(n)&(1n<<255n)-1n;if(c>=mt)return null;let d=c*c%mt,u=(d-1n+mt)%mt,k=(Ep*d+1n)%mt,P=u*nr(k,mt-2n,mt)%mt,A=nr(P,(mt+3n)/8n,mt);return A*A%mt!==P&&(A=A*Pc%mt),A*A%mt!==P?null:(!!(A&1n)!==p&&(A=mt-A),{X:A,Y:c})}a(vo,"edDecompress");function wo(n,p){let c=n.X%mt,d=n.Y%mt,u=p.X%mt,k=p.Y%mt,P=Ep*c%mt*u%mt*d%mt*k%mt,A=(c*k+u*d)%mt*nr((1n+P+mt)%mt,mt-2n,mt)%mt,y=(d*k%mt+c*u%mt)%mt*nr((1n-P+mt)%mt,mt-2n,mt)%mt;return{X:A,Y:y}}a(wo,"edAdd");function _p(n,p){let c=null,d={X:n.X%mt,Y:n.Y%mt};for(;p>0n;p>>=1n)p&1n&&(c=c?wo(c,d):d),d=wo(d,d);return c}a(_p,"edMul");var Lc=vo(zc(46316835694926478169428394003475163141307993866256225615783033603165251855960n,32));function Cp(n,p,c){if(!n||!p||!c)return!1;let d=Cr(n),u=Cr(p),k=Cr(c);if(d.length!==64||u.length!==32)return!1;let P=vo(u);if(!P)return!1;let A=vo(d.slice(0,32));if(!A)return!1;let y=yo(d.slice(32));if(y>=Sp)return!1;let S=yo(Cc(qc(d.slice(0,32),u,k)))%Sp,g=_p(Lc,y),v=_p(P,S),q=v?{X:(mt-v.X%mt)%mt,Y:v.Y%mt}:null,C=g&&q?wo(g,q):g||q;return!C||!A?!1:C.X%mt===A.X%mt&&C.Y%mt===A.Y%mt}a(Cp,"ed25519Verify");function qc(...n){let p=0;for(let u of n)p+=u.length;let c=new Uint8Array(p),d=0;for(let u of n)c.set(u,d),d+=u.length;return c}a(qc,"concatBytes");var zr={base:{},coursesPath:"courses",schedulePath:"schedule",courseFields:{name:"name",teacher:"teacher",position:"position",day:"day",sections:"sections",weeks:"weeks"},scheduleFields:{morningNum:"morningNum",afternoonNum:"afternoonNum",nightNum:"nightNum",sections:"sections"}},Tc=["name","teacher","position","day","sections","weeks","code","sequence","englishName","attribute","category","credit","status","campus","building","classroom","startSection","endSection","weekList"],Mc=["morningNum","afternoonNum","nightNum","sections","sectionList"];function So(n){return JSON.parse(JSON.stringify(n))}a(So,"cloneJsonValue");function qp(n,p){return n===p||n.startsWith(`${p}.`)||p.startsWith(`${n}.`)}a(qp,"scheduleJsonPathsOverlap");function ia(n,p){let c=String(n??"").trim();if(!c){if(p)return"";throw new Error("课程数组输出路径不能为空")}if(c.length>120)throw new Error("JSON 输出路径不能超过 120 个字符");let d=c.split("."),u=new Set(["__proto__","prototype","constructor"]);if(d.some(P=>!P||/^\d+$/.test(P)||/[\[\]\x00-\x1f]/.test(P)||u.has(P)))throw new Error(`JSON 输出路径包含无效片段：${c}`);return d.join(".")}a(ia,"validateScheduleJsonPath");function $c(n,p){for(let c=0;c<n.length;c+=1)for(let d=c+1;d<n.length;d+=1)if(qp(n[c],n[d]))throw new Error(`${p}目标路径不能重叠：${n[c]} / ${n[d]}`)}a($c,"validateScheduleJsonTargetPaths");function Pp(n,p,c){let d=p.split("."),u=n;for(let k=0;k<d.length;k+=1){let P=d[k];if(!Object.prototype.hasOwnProperty.call(u,P))return;if(k===d.length-1)throw new Error(`${c}输出路径与 base 字段重叠：${p}`);if(u=u[P],!u||typeof u!="object"||Array.isArray(u)){let A=d.slice(0,k+1).join(".");throw new Error(`${c}输出路径无法穿过 base 中的非对象字段：${A}`)}}}a(Pp,"validateScheduleJsonBasePath");function zp(n,p,c){if(!n||typeof n!="object"||Array.isArray(n))throw new Error(`${c}字段映射必须是对象`);let d={};return Object.entries(n).forEach(([u,k])=>{if(!p.includes(u))throw new Error(`${c}不支持源字段：${u}`);let P=ia(k,!0);P&&(d[u]=P)}),$c(Object.values(d),`${c}字段`),d}a(zp,"validateScheduleJsonFieldMap");function Be(n){if(!n||typeof n!="object"||Array.isArray(n))throw new Error("自定义 JSON 映射必须是对象");let p=n.base==null?{}:n.base;if(!p||typeof p!="object"||Array.isArray(p))throw new Error("base 必须是 JSON 对象");let c={base:So(p),coursesPath:ia(n.coursesPath,!1),schedulePath:ia(n.schedulePath,!0),courseFields:zp(n.courseFields,Tc,"课程"),scheduleFields:zp(n.scheduleFields||{},Mc,"时间表")};if(!Object.keys(c.courseFields).length)throw new Error("至少保留一个课程字段映射");if(c.schedulePath&&qp(c.schedulePath,c.coursesPath))throw new Error("课程与时间表输出路径不能重叠");return Pp(c.base,c.coursesPath,"课程"),c.schedulePath&&Pp(c.base,c.schedulePath,"时间表"),c}a(Be,"validateScheduleJsonMapping");function Pr(n){let p=String(n||"").replace(/\D/g,"").padStart(4,"0").slice(-4),c=`${p.slice(0,2)}:${p.slice(2)}`;return/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(c)?c:""}a(Pr,"normalizeSectionTime");function Ao(n,p,c){let d=ia(p,!1).split("."),u=n;d.forEach((k,P)=>{if(P===d.length-1){u[k]=c;return}(!u[k]||typeof u[k]!="object"||Array.isArray(u[k]))&&(u[k]={}),u=u[k]})}a(Ao,"setScheduleJsonPath");function Lp(n,p){let c={};return Object.entries(p||{}).forEach(([d,u])=>{!Object.prototype.hasOwnProperty.call(n,d)||n[d]===void 0||Ao(c,u,So(n[d]))}),c}a(Lp,"mappedScheduleJsonObject");function Ic(n){return[n.campus,n.building,n.classroom].map(p=>String(p||"").trim()).filter(Boolean).join(" ")}a(Ic,"scheduleJsonPosition");function Nc(n){let p=Number(n.startSection)||0,c=Number(n.endSection)||p;return p<1||c<p?"":Array.from({length:c-p+1},(d,u)=>p+u).join(",")}a(Nc,"scheduleJsonSectionString");function Bc(n,p){let c=Number(p.day)||0,d=Nc(p),u=Array.from(new Set((p.weeks||[]).map(Number).filter(k=>Number.isInteger(k)&&k>=1&&k<=60))).sort((k,P)=>k-P);return c<1||c>7||!d?{error:"invalid"}:u.length?{value:{name:n.name,teacher:n.teacher,position:Ic(p),day:c,sections:d,weeks:u.join(","),code:n.code,sequence:n.sequence,englishName:n.englishName,attribute:n.attribute,category:n.category,credit:n.credit,status:n.status,campus:p.campus,building:p.building,classroom:p.classroom,startSection:p.startSection,endSection:p.endSection,weekList:u}}:{error:"weeks"}}a(Bc,"scheduleJsonCourseRecord");function Fc(n,p){let c=[];return n.courses.forEach(d=>{if(!d.arrangements.length){p.unscheduledCourses+=1;return}d.arrangements.forEach(u=>{let k=Bc(d,u);k.error==="weeks"?p.missingWeeks+=1:k.error?p.invalidArrangements+=1:c.push(k.value)})}),c}a(Fc,"buildScheduleJsonCourses");function Dc(n){let p=new Map;return(n||[]).forEach(c=>{let d=Number(c.section),u=Pr(c.start),k=Pr(c.end);!Number.isInteger(d)||d<1||d>20||!u||!k||p.set(d,{i:d,s:u,e:k})}),Array.from(p.values()).sort((c,d)=>c.i-d.i)}a(Dc,"buildScheduleJsonSections");function jc(n){let p=Dc(n);if(!p.length)return{};let c={sections:JSON.stringify(p),sectionList:p};if(!p.every((u,k)=>u.i===k+1))return c;let d={morningNum:0,afternoonNum:0,nightNum:0};return p.forEach(u=>{let[k,P]=u.s.split(":").map(Number),A=k*60+P;A<720?d.morningNum+=1:A>=1080?d.nightNum+=1:d.afternoonNum+=1}),d.morningNum&&d.afternoonNum&&d.nightNum?Object.assign(c,d):c}a(jc,"buildScheduleJsonSchedule");function sa(n){let p={unscheduledCourses:0,missingWeeks:0,invalidArrangements:0},c=Fc(n,p);if(!c.length)throw new Error("没有符合导入格式的已排课课程");return{courses:c,schedule:jc(n.sections),stats:p}}a(sa,"buildScheduleJsonSource");function la(n){let p={courses:n.courses.map(d=>({name:d.name,teacher:d.teacher,position:d.position,day:d.day,sections:d.sections,weeks:d.weeks}))},c={};return["morningNum","afternoonNum","nightNum","sections"].forEach(d=>{Object.prototype.hasOwnProperty.call(n.schedule,d)&&(c[d]=n.schedule[d])}),Object.keys(c).length&&(p.schedule=c),p}a(la,"buildXiaoAiScheduleJson");function ca(n,p){let c=So(p.base||{}),d=n.courses.map(u=>Lp(u,p.courseFields));if(Ao(c,p.coursesPath,d),p.schedulePath&&Object.keys(n.schedule).length){let u=Lp(n.schedule,p.scheduleFields);Object.keys(u).length&&Ao(c,p.schedulePath,u)}return c}a(ca,"buildCustomScheduleJson");function Lr(n){return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0")}a(Lr,"localDateIso");function pr(n){let p=String(n||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!p)return null;let c=new Date(Number(p[1]),Number(p[2])-1,Number(p[3]));return Number.isNaN(c.getTime())||Lr(c)!==String(n)?null:c}a(pr,"parseLocalIsoDate");function _o(n){let p=new Date(n.getFullYear(),n.getMonth(),n.getDate()),c=p.getDay();return p.setDate(p.getDate()-(c===0?6:c-1)),p}a(_o,"mondayOfDate");function Mp(n){let p=String(n||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!p)return Lr(_o(new Date));let c=p[3]==="1"?Number(p[1]):Number(p[2]),d=p[3]==="1"?8:2,u=new Date(c,d,1);for(;u.getDay()!==1;)u.setDate(u.getDate()+1);return Lr(u)}a(Mp,"defaultSemesterMonday");function Tp(n){return n.getFullYear()+String(n.getMonth()+1).padStart(2,"0")+String(n.getDate()).padStart(2,"0")+"T"+String(n.getHours()).padStart(2,"0")+String(n.getMinutes()).padStart(2,"0")+"00"}a(Tp,"formatIcsLocal");function da(n){return String(n||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}a(da,"escapeIcsText");function Oc(n){if(typeof TextEncoder!="function")return n;let p=new TextEncoder,c=[],d="",u=73;for(let k of String(n))p.encode(d+k).length>u&&d?(c.push(d),d=" "+k,u=74):d+=k;return d&&c.push(d),c.join(`\r
`)}a(Oc,"foldIcsLine");function Hc(n){let p=2166136261,c=String(n||"");for(let d=0;d<c.length;d+=1)p=Math.imul(p^c.charCodeAt(d),16777619);return(p>>>0).toString(16)+"@scu-urppp"}a(Hc,"scheduleUid");function $p(n){let p=new Map;return n.sections.forEach(c=>p.set(c.section,c)),p}a($p,"scheduleSectionMap");function Rc(n){return n.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}a(Rc,"formatTimestamp");function Ip(n,p,c={}){let d=pr(p);if(!d)throw new Error("第一教学周日期无效");let u=$p(n);if(!u.size)throw new Error("教务接口没有返回节次时间，无法生成 ICS");let k=Rc(c.now instanceof Date?c.now:new Date),P=0,A=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SCU URP++//Schedule Export//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+da(n.semester.label+"课表"),"X-WR-TIMEZONE:Asia/Shanghai","BEGIN:VTIMEZONE","TZID:Asia/Shanghai","X-LIC-LOCATION:Asia/Shanghai","BEGIN:STANDARD","TZOFFSETFROM:+0800","TZOFFSETTO:+0800","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD","END:VTIMEZONE"];if(n.courses.forEach(y=>y.arrangements.forEach(S=>{let g=u.get(S.startSection),v=u.get(S.endSection);!g||!v||S.weeks.forEach(q=>{let C=new Date(d);C.setDate(d.getDate()+(q-1)*7+S.day-1);let f=new Date(C),h=new Date(C),w=g.start.split(":").map(Number),x=v.end.split(":").map(Number);f.setHours(w[0],w[1],0,0),h.setHours(x[0],x[1],0,0);let E=[S.campus,S.building,S.classroom].filter(Boolean).join(" "),L=["教师："+y.teacher,"周次："+S.weekDescription,"课程号："+y.code+(y.sequence?"_"+y.sequence:""),"学分："+y.credit,"课程属性："+y.attribute].filter(T=>!/[：:]$/.test(T)).join(`
`),$=[n.semester.planCode,y.code,y.sequence,S.day,S.startSection,S.endSection,q,S.campus,S.building,S.classroom].join("|");P+=1,A.push("BEGIN:VEVENT","UID:"+Hc($),"DTSTAMP:"+k,"SUMMARY:"+da(y.name),"LOCATION:"+da(E),"DESCRIPTION:"+da(L),"DTSTART;TZID=Asia/Shanghai:"+Tp(f),"DTEND;TZID=Asia/Shanghai:"+Tp(h),"END:VEVENT")})})),!P)throw new Error("课表中没有已安排时间的课程，无法生成 ICS");return A.push("END:VCALENDAR"),A.map(Oc).join(`\r
`)+`\r
`}a(Ip,"buildScheduleIcs");function Np(n){let p=$p(n),c=0,d=0;return n.courses.forEach(u=>u.arrangements.forEach(k=>{k.weeks.length||(c+=1),(!p.has(k.startSection)||!p.has(k.endSection))&&(d+=1)})),{missingWeeks:c,missingTimes:d}}a(Np,"scheduleIcsOmissionStats");function Uc(n){let p=String(n||"").replace(/[—–]/g,"-"),c=/单周|单数周|[（(]单[）)]/.test(p)?1:/双周|双数周|[（(]双[）)]/.test(p)?0:-1,d=new Set,u=a(k=>{let P=Number(k);P>=1&&P<=30&&(c<0||P%2===c)&&d.add(P)},"add");return p.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g,(k,P,A)=>{let y=Math.min(Number(P),Number(A)),S=Math.max(Number(P),Number(A));for(let g=y;g<=S;g+=1)u(g);return k}),(p.match(/\d{1,2}/g)||[]).forEach(u),Array.from(d).sort((k,P)=>k-P)}a(Uc,"scheduleWeeksFromDescription");function Bp(n,p){let c=String(n||"").trim();if(/^[01]+$/.test(c)){let d=[];for(let u=0;u<c.length;u+=1)c.charAt(u)==="1"&&d.push(u+1);return d}return Uc(p||c)}a(Bp,"scheduleWeeks");function Wc(n){let p=n&&Array.isArray(n.xkxx)?n.xkxx:[];for(let c of p){let d=Object.values(c||{});if(d.length)return d[0]}return null}a(Wc,"firstScheduleCourse");function ir(n){let p=Wc(n);if(!p)return"";let c=Array.isArray(p.timeAndPlaceList)?p.timeAndPlaceList[0]:null;return String(p.zxjxjhh||p.executiveEducationPlanNumber||p.id&&(p.id.zxjxjhh||p.id.executiveEducationPlanNumber)||c&&(c.zxjxjhh||c.executiveEducationPlanNumber)||"").trim()}a(ir,"schedulePlanCodeFromData");function Gc(n){let p=String(n||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!p)return"学生课表";let c=p[3]==="1"?"秋季学期":p[3]==="2"?"春季学期":"学期";return p[1]+"-"+p[2]+"学年"+c}a(Gc,"semesterLabelFromPlanCode");function Fp(n,p,c,d={}){let u=p||ir(n),k=(Array.isArray(n&&n.jcsjbs)?n.jcsjbs:[]).map(y=>({section:Number(y.jc)||0,start:Pr(y.kssj),end:Pr(y.jssj)})).filter(y=>y.section>=1&&y.section<=20&&y.start&&y.end).sort((y,S)=>y.section-S.section),P=[];(Array.isArray(n&&n.xkxx)?n.xkxx:[]).forEach(y=>{Object.keys(y||{}).forEach(S=>{let g=y[S];if(!g)return;let v=g.id||{},q=(g.timeAndPlaceList||[]).map(C=>({day:Number(C.classDay)||0,startSection:Number(C.classSessions)||1,endSection:Math.min(12,(Number(C.classSessions)||1)+Math.max(1,Number(C.continuingSession)||1)-1),weeks:Bp(C.classWeek,C.weekDescription||g.skzcs),weekDescription:String(C.weekDescription||g.skzcs||"").trim(),campus:String(C.campusName||"").trim(),building:String(C.teachingBuildingName||"").trim(),classroom:String(C.classroomName||"").trim()})).filter(C=>C.day>=1&&C.day<=7&&C.startSection>=1&&C.startSection<=12);P.push({code:String(v.coureNumber||g.zkch||"").trim(),sequence:String(v.coureSequenceNumber||g.zkxh||"").trim(),name:String(g.courseName||g.englishCourseName||S).trim(),englishName:String(g.englishCourseName||"").trim(),teacher:String(g.attendClassTeacher||"").trim(),attribute:String(g.coursePropertiesName||"").trim(),category:String(g.courseCategoryName||"").trim(),credit:Number(g.unit)||0,status:String(g.selectCourseStatusName||"").trim(),arrangements:q})})});let A=String(d.firstMonday||"").trim();return{schemaVersion:1,exportedAt:(d.now instanceof Date?d.now:new Date).toISOString(),source:c||"SCU URP++",semester:{planCode:u,label:Gc(u),firstMonday:pr(A)?A:""},sections:k,courses:P}}a(Fp,"normalizeScheduleExportData");function Dp(n,p,c,d=0){let u=Math.max(0,Number(n)||0),k=Math.max(1,Math.floor(Number(p)||1)),P=Math.max(0,Math.min(k-1,Math.floor(Number(c)||0))),A=-Math.max(0,Number(d)||0),y=A+u*P/k,S=A+u*(P+1)/k;return{left:y,width:Math.max(0,S-y)}}a(Dp,"scheduleCardLaneGeometry");function ua(n,p,c){let d=[],u=String(n||""),k=Math.max(4,Number(p)||4);for(;u;)d.push({text:u.slice(0,k),kind:c}),u=u.slice(k);return d}a(ua,"wrapField");function ma(n,p){let c=n.slice(0,Math.max(0,p)).map(d=>({...d}));if(c.length&&c.length<n.length){let d=c[c.length-1];d.text=d.text.length>1?d.text.slice(0,-1)+"…":"…"}return c}a(ma,"takeLines");var jp=["#2563EB","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#DB2777","#4D7C0F","#EA580C","#4F46E5"];function Hp(n){let p=0,c=String(n||"");for(let d=0;d<c.length;d+=1)p=p*31+c.charCodeAt(d)>>>0;return jp[p%jp.length]}a(Hp,"exportCourseColor");function Op(n){let p=[];n.forEach(c=>{let d=p.findIndex(u=>u<c.startSection);d<0&&(d=p.length,p.push(0)),p[d]=c.endSection,c.lane=d}),n.forEach(c=>{c.laneCount=Math.max(1,p.length)})}a(Op,"assignScheduleLanes");function Rp(n){let p=n.slice().sort((u,k)=>u.startSection-k.startSection||u.endSection-k.endSection||u.course.name.localeCompare(k.course.name)),c=[],d=0;return p.forEach(u=>{c.length&&u.startSection>d&&(Op(c),c=[],d=0),c.push(u),d=Math.max(d,u.endSection)}),c.length&&Op(c),p}a(Rp,"layoutScheduleDay");function Up(n){let p=[];return n.courses.forEach(c=>c.arrangements.forEach(d=>{p.push({course:c,arrangement:d,startSection:d.startSection,endSection:d.endSection,day:d.day})})),p}a(Up,"scheduleExportEvents");function Wp(n,p){let c=[],d=String(n||"");for(;d;)c.push(d.slice(0,p)),d=d.slice(p);return c}a(Wp,"wrapScheduleFooter");function Gp(n,p,c){let d=n.startSection===n.endSection?n.startSection+"节":n.startSection+"-"+n.endSection+"节",u=ua(n.name,Math.max(5,p),"title"),k=ua(n.teacher,Math.max(6,p+2),"teacher"),P=ua([n.weekDescription,d].filter(Boolean).join(" · "),Math.max(6,p+2),"schedule"),A=ua([n.campus,n.building,n.classroom].filter(Boolean).join(" "),Math.max(6,p+2),"location"),y=Math.max(1,Number(c)||1),S=A.length&&y>=2?Math.min(2,A.length):0,g=P.length&&y>=3?1:0,v=k.length&&y>=4?1:0,q=Math.max(1,y-S-g-v),C=ma(u,q),f=y-C.length,h=Math.min(k.length,Math.max(0,f-g-S));C.push(...ma(k,h)),f=y-C.length;let w=Math.min(P.length,Math.max(0,f-S));return C.push(...ma(P,w)),f=y-C.length,C.push(...ma(A,f)),C.slice(0,y)}a(Gp,"scheduleImageTextLines");function Vc(n,p){let c=Hp(p),d=n.colors,u=n.skin;return u==="brutal"?{fill:Ft(d.surface,c,.48),stroke:"#000000",text:"#111111",secondary:"#242424",stripe:c}:u==="flat"?{fill:Ft(d.surface,c,n.dark?.24:.16),stroke:d.text,text:d.text,secondary:d.secondary,stripe:c}:u==="editorial"?{fill:Ft(d.surface,c,n.dark?.16:.08),stroke:d.border,text:d.text,secondary:d.secondary,stripe:c}:{fill:Ft(d.surface,c,n.dark?.28:u==="organic"?.2:.14),stroke:Ft(d.border,c,n.dark?.52:.42),text:d.text,secondary:d.secondary,stripe:c}}a(Vc,"scheduleImageCourseStyle");function Vp(n,p,c={}){if(!p||!p.colors||!p.shape)throw new Error("课表图片主题未解析");let d=p.colors,u=p.shape,k=c.now instanceof Date?c.now:new Date,P=1960,A=40,y=136,S=P-A*2,g=A+24,v=64,q=8,C=g+v+12,f=A+S-24,h=(f-C-q*6)/7,w=y+88,x=108,E=102,$=w+x*12-y+24,T=n.courses.filter(ot=>!ot.arrangements.length).map(ot=>ot.name),j=Wp(T.join("、"),92),I=j.length?74+j.length*27:44,H=y+$+I,G=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],U=u.serif?"Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif":"Microsoft YaHei,Segoe UI,sans-serif",et="Microsoft YaHei,Segoe UI,sans-serif",it=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-frame-shadow)"':"",bt=["soft","warm","neu"].includes(u.shadow)?' filter="url(#schedule-card-shadow)"':"",J=[`<svg xmlns="http://www.w3.org/2000/svg" width="${P}" height="${H}" viewBox="0 0 ${P} ${H}">`,"<defs>",`<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${p.dark?10:7}" stdDeviation="${p.dark?16:11}" flood-color="${p.dark?"#000000":d.text}" flood-opacity="${p.dark?.48:.1}"/></filter>`,`<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${p.dark?"#000000":d.text}" flood-opacity="${p.dark?.34:.1}"/></filter>`,"</defs>",`<rect width="100%" height="100%" fill="${d.bg}"/>`,`<rect x="${A}" y="32" width="142" height="36" rx="${u.headerRadius}" fill="${d.primary}"/>`,`<text x="${A+71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${et}">SCU URP++</text>`,`<text x="${A}" y="106" fill="${d.text}" font-size="36" font-weight="700" font-family="${U}">${at(n.semester.label)}课表</text>`,`<text x="${P-A}" y="54" text-anchor="end" fill="${d.secondary}" font-size="16" font-family="${et}">${at(p.label)}</text>`,`<text x="${P-A}" y="83" text-anchor="end" fill="${d.muted}" font-size="14" font-family="${et}">${at(k.toLocaleString("zh-CN",{hour12:!1}))}</text>`];u.shadow==="hard"&&J.push(`<rect x="${A+8}" y="${y+8}" width="${S}" height="${$}" fill="#000000"/>`),J.push(`<rect x="${A}" y="${y}" width="${S}" height="${$}" rx="${u.frameRadius}" fill="${d.surface}" stroke="${u.shadow==="hard"?"#000000":d.border}" stroke-width="${u.frameStroke}"${it}/>`),G.forEach((ot,X)=>{let ct=C+X*(h+q);J.push(`<rect x="${ct}" y="${y+22}" width="${h}" height="48" rx="${u.headerRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${ct+h/2}" y="${y+53}" text-anchor="middle" fill="${d.secondary}" font-size="17" font-weight="600" font-family="${et}">${ot}</text>`)});for(let ot=1;ot<=12;ot+=1){let X=w+(ot-1)*x;J.push(`<rect x="${g}" y="${X}" width="${v}" height="${E}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`,`<text x="${g+v/2}" y="${X+E/2+6}" text-anchor="middle" fill="${d.muted}" font-size="16" font-weight="600" font-family="${et}">${ot}</text>`),G.forEach((ct,rt)=>{let st=C+rt*(h+q);J.push(`<rect x="${st}" y="${X}" width="${h}" height="${E}" rx="${u.gridRadius}" fill="${d.input}" stroke="${d.border}" stroke-width="${u.frameStroke?1:0}"/>`)})}[4,9].forEach(ot=>{let X=w+ot*x-3;J.push(`<line x1="${C}" y1="${X}" x2="${f}" y2="${X}" stroke="${d.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`)});for(let ot=1;ot<=7;ot+=1)Rp(Up(n).filter(ct=>ct.day===ot)).forEach((ct,rt)=>{let st=h/ct.laneCount,xt=C+(ot-1)*(h+q)+ct.lane*st,Z=w+(ct.startSection-1)*x,dt=st,At=Math.max(E,(ct.endSection-ct.startSection)*x+E),kt=Vc(p,ct.course.name),Pt="course-clip-"+ot+"-"+rt,B=Math.max(1,Math.floor((At-18)/23)),Y=Gp({name:ct.course.name,teacher:ct.course.teacher,weekDescription:ct.arrangement.weekDescription,startSection:ct.startSection,endSection:ct.endSection,campus:ct.arrangement.campus,building:ct.arrangement.building,classroom:ct.arrangement.classroom},Math.floor((dt-22)/16),B);J.push(`<clipPath id="${Pt}"><rect x="${xt+11}" y="${Z+8}" width="${Math.max(10,dt-22)}" height="${Math.max(18,At-16)}" rx="${Math.max(0,u.cardRadius-5)}"/></clipPath>`,`<rect data-course-card="1" data-day="${ot}" data-start="${ct.startSection}" data-end="${ct.endSection}" x="${xt}" y="${Z}" width="${dt}" height="${At}" rx="${u.cardRadius}" fill="${kt.fill}" stroke="${kt.stroke}" stroke-width="${u.cardStroke}"${bt}/>`),p.skin==="brutal"&&J.push(`<path d="M ${xt+dt-4} ${Z+4} V ${Z+At-4} H ${xt+4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`),p.skin==="editorial"&&J.push(`<rect x="${xt}" y="${Z}" width="6" height="${At}" fill="${kt.stripe}"/>`),p.skin==="neu"&&J.push(`<path d="M ${xt+u.cardRadius} ${Z+1} H ${xt+dt-u.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`),J.push('<g clip-path="url(#'+Pt+')">'),Y.forEach((tt,ft)=>{let ht=tt.kind==="title";J.push(`<text data-kind="${tt.kind}" x="${xt+14}" y="${Z+28+ft*23}" fill="${ht?kt.text:kt.secondary}" font-size="${ht?16:13}" font-weight="${ht?700:500}" font-family="${ht&&u.serif?U:et}">${at(tt.text)}</text>`)}),J.push("</g>")});let Q=y+$+30;return j.length?(J.push(`<text x="${A}" y="${Q}" fill="${d.secondary}" font-size="15" font-weight="700" font-family="${et}">未排定时间的课程</text>`),j.forEach((ot,X)=>J.push(`<text x="${A}" y="${Q+29+X*27}" fill="${d.muted}" font-size="14" font-family="${et}">${at(ot)}</text>`))):J.push(`<text x="${A}" y="${Q}" fill="${d.muted}" font-size="14" font-family="${et}">由 SCU URP++ 基于结构化课表数据生成</text>`),J.push("</svg>"),{svg:J.join(""),width:P,height:H,background:d.bg,theme:p}}a(Vp,"buildScheduleSvg");function Jc(n,p,c={}){let d=[],u=c.json||null,k=c.ics||null,P=n==="ics"?p.courses.filter(A=>!A.arrangements.length).length:0;return P&&d.push(P+" 门未排定时间的课程未写入日历"),u&&u.unscheduledCourses&&d.push(u.unscheduledCourses+" 门未排定时间的课程未写入 JSON"),u&&u.missingWeeks&&d.push(u.missingWeeks+" 个上课安排缺少周次"),u&&u.invalidArrangements&&d.push(u.invalidArrangements+" 个上课安排缺少日期或节次"),k&&k.missingWeeks&&d.push(k.missingWeeks+" 个上课安排缺少周次"),k&&k.missingTimes&&d.push(k.missingTimes+" 个上课安排缺少节次时间"),d}a(Jc,"scheduleExportCompletionNotes");function ba(n,p,c,d,u){return`<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${n}"${u?" disabled":""}><i class="fa ${p}" aria-hidden="true"></i><span><strong>${c}</strong><small>${d}</small></span></button>`}a(ba,"exportOptionHtml");function Jp(n){let{document:p,window:c,ensureStyles:d,loadData:u,exportJson:k,exportIcs:P,exportPng:A,showToast:y,nativePageUrl:S,navigate:g,logger:v=console}=n;function q(x){x&&(x.classList.remove("open"),x.querySelector(".urppp-export-trigger")?.setAttribute("aria-expanded","false"))}a(q,"closeMenu");function C(){c.__urpppExportDismissBound||(c.__urpppExportDismissBound=!0,p.addEventListener("click",x=>{p.querySelectorAll(".urppp-export-wrap.open").forEach(E=>{E.contains(x.target)||q(E)})},!0),p.addEventListener("keydown",x=>{x.key==="Escape"&&p.querySelectorAll(".urppp-export-wrap.open").forEach(q)}))}a(C,"bindDismiss");async function f(x,E,L,$){if($&&$.disabled)return;let T=$&&$.innerHTML;try{if($&&($.disabled=!0,$.innerHTML='<i class="fa fa-spinner fa-spin"></i> 准备中'),x==="pdf"){if(typeof L!="function")throw new Error("当前页面不提供原生 PDF 导出");await L();return}let j=await u(E),I={};if(x==="json")I.json=await k(j);else if(x==="ics")I.ics=await P(j);else if(x==="png")await A(j);else throw new Error("未知导出格式");let H=Jc(x,j,I);y("课表已导出："+x.toUpperCase()+(H.length?"；"+H.join("，"):""))}catch(j){if(j&&j.message==="已取消导出")return;v.warn("[URP++] schedule export",j),y(j&&j.message||String(j),!0)}finally{$&&($.disabled=!1,$.innerHTML=T)}}a(f,"run");function h(x={}){d();let E=x.source||"native",L=x.pdfHandler,$=typeof L=="function",T=p.createElement("span"),j=E==="native"?"导出课表":"导出";T.className="urppp-export-wrap",T.innerHTML=`<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${j}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${ba("ics","fa-calendar","ICS 日历","导入系统日历或日历应用",!1)}${ba("json","fa-code","JSON 数据","兼容小爱课程导入，可自定义格式",!1)}${ba("png","fa-image","PNG 图片","完整学期课表高清图片",!1)}${ba("pdf","fa-file-pdf-o","PDF",$?"使用教务系统原生导出":"仅原教务课表页面可用",!$)}${$?"":'<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;let I=T.querySelector(".urppp-export-trigger");I.addEventListener("click",G=>{G.preventDefault(),G.stopPropagation();let U=!T.classList.contains("open");p.querySelectorAll(".urppp-export-wrap.open").forEach(q),T.classList.toggle("open",U),I.setAttribute("aria-expanded",U?"true":"false")}),T.querySelectorAll("[data-export-type]:not(:disabled)").forEach(G=>{G.addEventListener("click",()=>{q(T),f(G.getAttribute("data-export-type"),E,L,I)})});let H=T.querySelector("[data-export-native]");return H&&H.addEventListener("click",()=>g(S)),C(),T}a(h,"createMenu");function w(x){(x&&x.querySelectorAll?x:p).querySelectorAll("[data-schedule-export-host]").forEach(L=>{L.querySelector(".urppp-export-wrap")||L.appendChild(h({source:L.getAttribute("data-schedule-export-host")||"clean"}))})}return a(w,"bindHosts"),{bindHosts:w,closeMenu:q,createMenu:h,run:f}}a(Jp,"createScheduleExportUi");function Yp(n){let p=a(c=>{n.querySelectorAll(".urppp-set-tab").forEach(d=>{let u=d.dataset.tab===c;d.classList.toggle("ac",u),d.setAttribute("aria-selected",u?"true":"false")}),n.querySelectorAll(".urppp-set-pane").forEach(d=>{d.classList.toggle("ac",d.dataset.pane===c)});try{let d=n.querySelector(".urppp-set-body");d&&(d.scrollTop=0)}catch{}},"switchTab");return n.querySelectorAll(".urppp-set-tab").forEach(c=>{c.addEventListener("click",()=>p(c.dataset.tab))}),n.__urpppSwitchTab=p,p}a(Yp,"bindSettingsTabs");function Qp(n){let{document:p,ensurePanel:c,syncPanel:d,refreshUpdateStatus:u,defaultTab:k="theme"}=n;function P(){c();let y=p.getElementById("urppp-settings-panel"),S=p.getElementById("urppp-settings-mask");if(!y||!S)return!1;d();try{u()}catch{}try{y.__urpppSwitchTab&&y.__urpppSwitchTab(k)}catch{}S.classList.remove("open"),y.classList.remove("open"),y.offsetWidth,S.classList.add("open"),y.classList.add("open");try{let g=y.querySelector(".urppp-set-body");g&&(g.scrollTop=0)}catch{}return!0}a(P,"open");function A(){let y=p.getElementById("urppp-settings-panel"),S=p.getElementById("urppp-settings-mask");y&&y.classList.remove("open"),S&&S.classList.remove("open")}return a(A,"close"),{close:A,open:P}}a(Qp,"createSettingsPanelController");function Xp(n){let{logoData:p,repositoryUrl:c,version:d}=n;return['<div class="urppp-set-head">','  <div class="urppp-set-title">设置</div>','  <button type="button" class="urppp-set-close" id="urppp-set-close" aria-label="关闭">×</button>',"</div>",'<div class="urppp-set-tabs" role="tablist">','  <button type="button" class="urppp-set-tab ac" data-tab="theme" role="tab" aria-selected="true">主题设置</button>','  <button type="button" class="urppp-set-tab" data-tab="skin" role="tab" aria-selected="false">主题选择</button>','  <button type="button" class="urppp-set-tab" data-tab="system" role="tab" aria-selected="false">系统设置</button>','  <button type="button" class="urppp-set-tab" data-tab="about" role="tab" aria-selected="false">关于</button>',"</div>",'<div class="urppp-set-body">','  <div class="urppp-set-pane ac" data-pane="theme">','    <section class="urppp-set-sec">',"      <h3>主题模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-modes">','        <button type="button" class="urppp-set-mode" data-theme="default">简约白</button>','        <button type="button" class="urppp-set-mode" data-theme="dark">深邃暗</button>','        <button type="button" class="urppp-set-mode" data-theme="scu-red">动态配色</button>',"      </div>",'      <div class="urppp-set-follow-row">','        <button type="button" class="urppp-set-follow" id="urppp-set-follow" aria-pressed="false">跟随系统：关</button>','        <button type="button" class="urppp-set-follow" id="urppp-set-follow-dynamic" aria-pressed="false">浅色用动态配色：关</button>',"      </div>",'      <button type="button" class="urppp-set-follow" id="urppp-set-clean-default" aria-pressed="false" style="margin-top:12px;width:100%">默认进入清爽模式：关</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-clean-analysis" aria-pressed="false" style="margin-top:12px;width:100%">清爽成绩分析展示：选项卡</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-apple-edge" aria-pressed="true" style="margin-top:12px;width:100%">类Apple边缘线条：开</button>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-dynamic">',"      <h3>种子色</h3>",'      <p class="urppp-set-tip">选一个颜色，自动生成背景、卡片、强调色等多套方案</p>','      <div class="urppp-set-presets" id="urppp-set-presets"></div>','      <div class="urppp-set-custom">','        <input type="color" id="urppp-set-color" value="#B53434" />','        <input type="text" id="urppp-set-hex" maxlength="7" value="#B53434" spellcheck="false" />','        <button type="button" class="urppp-set-btn" id="urppp-set-gen">生成方案</button>','        <button type="button" class="urppp-set-btn ghost" id="urppp-set-save">存为预设</button>',"      </div>",'      <h3 style="margin-top:16px">配色方案</h3>','      <div class="urppp-set-schemes" id="urppp-set-schemes"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-brutal" style="display:none">',"      <h3>高对比配色</h3>",'      <p class="urppp-set-tip">默认圆点使用高能粉；选择一种备用配色后，可由左上第三个圆点快速切换。</p>','      <div class="urppp-set-schemes" id="urppp-set-brutal-palettes"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="skin">','    <section class="urppp-set-sec">',"      <h3>界面风格</h3>",'      <p class="urppp-set-tip">在同一布局上切换视觉气质。因适配规模较大，仅保证清爽模式的完整适配，如有影响请使用默认类Apple风格并选择性开启边缘线条。</p>','      <div class="urppp-theme-store-bar"><button type="button" class="urppp-set-btn ghost" id="urppp-theme-store">主题商店</button></div>','      <div id="urppp-theme-store-inline" class="urppp-store-inline" style="display:none"></div>','      <div class="urppp-skin-list" id="urppp-skin-list"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="system">','    <section class="urppp-set-sec" id="urppp-set-privacy">',"      <h3>隐私模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-privacy-modes">','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="off">关闭</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="one">一键隐私</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="custom">自定义</button>',"      </div>",'      <div class="urppp-privacy-groups" id="urppp-set-privacy-custom">','        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">身份信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-identity" type="checkbox" data-privacy-field="identity" aria-label="隐藏学号和证件"><label for="urppp-privacy-identity">学号/证件</label><input class="urppp-feature-input" data-privacy-value="identity" maxlength="40" aria-label="学号和证件替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-organization" type="checkbox" data-privacy-field="organization" aria-label="隐藏学院和专业"><label for="urppp-privacy-organization">学院/专业</label><input class="urppp-feature-input" data-privacy-value="organization" maxlength="40" aria-label="学院和专业替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-contact" type="checkbox" data-privacy-field="contact" aria-label="隐藏联系和个人信息"><label for="urppp-privacy-contact">联系/个人信息</label><input class="urppp-feature-input" data-privacy-value="contact" maxlength="40" aria-label="联系和个人信息替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">学业信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-grade" type="checkbox" data-privacy-field="grade" aria-label="隐藏成绩"><label for="urppp-privacy-grade">成绩</label><input class="urppp-feature-input" data-privacy-value="grade" maxlength="40" aria-label="成绩替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-gpa" type="checkbox" data-privacy-field="gpa" aria-label="隐藏绩点"><label for="urppp-privacy-gpa">绩点</label><input class="urppp-feature-input" data-privacy-value="gpa" maxlength="40" aria-label="绩点替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-credit" type="checkbox" data-privacy-field="credit" aria-label="隐藏学分"><label for="urppp-privacy-credit">学分</label><input class="urppp-feature-input" data-privacy-value="credit" maxlength="40" aria-label="学分替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">页面内容</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-other" type="checkbox" data-privacy-field="other" aria-label="隐藏其他数据"><label for="urppp-privacy-other">其他数据</label><input class="urppp-feature-input" data-privacy-value="other" maxlength="40" aria-label="其他数据替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-schedule" type="checkbox" data-privacy-field="schedule" aria-label="隐藏课表"><label for="urppp-privacy-schedule">课表</label><input class="urppp-feature-input" data-privacy-value="schedule" maxlength="40" aria-label="课表替换内容"></div>','            <div class="urppp-privacy-field urppp-privacy-field-static"><input id="urppp-privacy-avatar" type="checkbox" data-privacy-field="avatar" aria-label="隐藏头像"><label for="urppp-privacy-avatar">头像</label><span class="urppp-privacy-note">使用统一遮罩</span></div>',"          </div>","        </div>","      </div>",'      <div class="urppp-direct-edit-control">',"        <div><strong>自由修改显示数据</strong><span>开启后，直接点击首页或清爽模式中带标记的数据进行修改</span></div>",'        <button type="button" class="urppp-set-follow" id="urppp-set-direct-edit-toggle" aria-pressed="false">页面内修改：关</button>',"      </div>","    </section>",'    <section class="urppp-set-sec" id="urppp-set-identity">',"      <h3>自定义姓名与头像</h3>",'      <div class="urppp-identity-editor">','        <div class="urppp-identity-fields">','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-name-enabled"> 自定义姓名</label><input class="urppp-feature-input" id="urppp-set-custom-name" maxlength="40" placeholder="输入显示姓名"></div>','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-avatar-enabled"> 自定义头像</label><input class="urppp-feature-input" id="urppp-set-custom-avatar-url" placeholder="https://... 图片地址"></div>','          <div class="urppp-feature-row"><label for="urppp-set-custom-avatar-file">本地图片</label><input class="urppp-feature-input" type="file" id="urppp-set-custom-avatar-file" accept="image/png,image/jpeg,image/webp,image/gif"></div>',"        </div>",'        <div class="urppp-identity-preview">','          <span class="urppp-identity-preview-label">头像预览</span>','          <div class="urppp-avatar-preview-shell"><span>未设置</span><img class="urppp-avatar-preview" id="urppp-set-avatar-preview" alt="自定义头像预览"></div>',"        </div>","      </div>",'      <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-privacy-save">保存隐私与显示设置</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-avatar-clear">清除自定义头像</button></div>','      <div class="urppp-set-tip" id="urppp-set-privacy-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-json-export">',"      <h3>JSON 导出格式</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-json-custom" aria-pressed="false" style="width:100%">自定义 JSON：关</button>','      <div class="urppp-json-mapping-editor" id="urppp-set-json-editor">','        <label for="urppp-set-json-mapping">字段映射</label>','        <textarea id="urppp-set-json-mapping" spellcheck="false" aria-label="自定义 JSON 字段映射"></textarea>','        <p class="urppp-set-tip">源字段包括 name、teacher、position、day、sections、weeks、code、credit、campus、building、classroom、weekList 等；目标值支持 data.courses 形式的嵌套路径。</p>','        <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-json-save">保存映射</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-json-reset">恢复默认映射</button></div>',"      </div>",'      <div class="urppp-set-tip" id="urppp-set-json-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-update">',"      <h3>更新</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-auto-update" aria-pressed="false" style="width:100%">自动检测更新：关</button>','      <button type="button" class="urppp-set-btn" id="urppp-set-check-update" style="margin-top:12px;width:100%">检查更新</button>','      <div id="urppp-set-update-status" class="urppp-set-tip" style="margin-top:8px"></div>',"    </section>",'    <div id="urppp-set-assist-slot"></div>',"  </div>",'  <div class="urppp-set-pane" data-pane="about">','    <div class="urppp-about">','      <img class="urppp-about-logo" id="urppp-about-logo" src="'+p+'" alt="SCU URP++" referrerpolicy="no-referrer" />','      <a class="urppp-about-ver" id="urppp-about-ver" href="'+c+'" target="_blank" rel="noopener noreferrer">SCU URP++ v'+d+"</a>",'      <p class="urppp-about-author">作者：Chao_Lan · Hanako</p>','      <p class="urppp-about-contact">QQ：2718748334</p>',`      <p class="urppp-about-msg">有任何问题欢迎及时反馈！
半夜Vibe有点爽怎么回事。</p>`,"    </div>","  </div>","</div>"].join("")}a(Xp,"buildSettingsPanelHtml");var re="urppp_plugin_",Yc="1.0.0";function Eo({GM:n,doc:p,hostInfo:c,uiDeps:d}){let{getValue:u=a(()=>null,"getValue"),setValue:k=a(()=>{},"setValue"),xmlHttp:P,addStyle:A}=n||{},y=(typeof d=="function"?d:d&&d.openSubpanel)||null,S=new Map,g=new Map,v=new Map,q=[],C=null;function f(B,Y){let tt=v.get(B);tt&&tt.forEach(ft=>{try{ft(Y)}catch{}})}a(f,"emit");function h(B,Y){return v.has(B)||v.set(B,new Set),v.get(B).add(Y),()=>v.get(B).delete(Y)}a(h,"on");function w(B,Y){return u(`${re}${B}_${Y}`)}a(w,"storageGet");function x(B,Y,tt){k(`${re}${B}_${Y}`,tt)}a(x,"storageSet");function E(){return B=>({get:a(Y=>w(B,Y),"get"),set:a((Y,tt)=>x(B,Y,tt),"set"),remove:a(Y=>k(`${re}${B}_${Y}`,void 0),"remove")})}a(E,"storage");function L(B,Y={}){return new Promise((tt,ft)=>{if(typeof P!="function"){ft(new Error("GM_xmlhttpRequest 不可用（未授权跨域？）"));return}P({method:Y.method||"GET",url:B,headers:Y.headers||{},data:Y.data,timeout:Y.timeout||8e3,onload:a(ht=>ht.status>=200&&ht.status<300?tt(ht.responseText):ft(new Error(`HTTP ${ht.status}`)),"onload"),onerror:a(()=>ft(new Error("网络错误")),"onerror"),ontimeout:a(()=>ft(new Error("超时(8s)")),"ontimeout")})})}a(L,"request");async function $(B,Y){let tt=Array.isArray(B)?B:[B],ft=[];for(let ht=0;ht<tt.length;ht+=1){let Lt=tt[ht];Y&&Y({stage:"downloading",index:ht+1,total:tt.length,url:Lt});try{let vt=await L(Lt);return Y&&Y({stage:"downloaded",url:Lt,size:vt.length}),vt}catch(vt){ft.push(`源${ht+1}(${T(Lt)})失败: ${vt&&vt.message?vt.message:vt}`),Y&&Y({stage:"source_failed",index:ht+1,total:tt.length,error:vt&&vt.message?vt.message:vt})}}throw new Error("所有下载源失败 → "+ft.join(" ｜ "))}a($,"fetchWithFallback");function T(B){try{return new URL(B).host}catch{return B}}a(T,"shortHost");function j(B){let Y=String(B||"").match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);return Y?B.replace(Y[0],""):B}a(j,"stripMetadata");function I(B,Y){try{let tt=j(B),ft=["GM_getValue","GM_setValue","GM_xmlhttpRequest","GM_registerMenuCommand","GM_addStyle","unsafeWindow"],ht=[typeof GM_getValue=="function"?GM_getValue:void 0,typeof GM_setValue=="function"?GM_setValue:void 0,typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:void 0,typeof GM_registerMenuCommand=="function"?GM_registerMenuCommand:void 0,typeof GM_addStyle=="function"?GM_addStyle:void 0,typeof unsafeWindow<"u"?unsafeWindow:null];return new Function(...ft,tt)(...ht),!0}catch(tt){return console.warn("[URP++ plugin] 注入失败",Y,tt),!1}}a(I,"inject");function H(B,Y){let tt=g.get(B);return tt?(tt.enabled=!!Y,k(`${re}${B}_enabled`,tt.enabled),f(Y?"enabled":"disabled",B),!0):!1}a(H,"setEnabled");function G(B){let Y=g.get(B);return!!Y&&Y.enabled}a(G,"isEnabled");function U(B){if(!B||!B.id)return!1;if(S.has(B.id)&&S.get(B.id).__urpppRegistered)return!0;let Y=Object.assign({type:"plugin"},B);Y.__urpppRegistered=!0,S.set(B.id,Y);let tt=g.get(B.id)||{loaded:!1,enabled:!1,version:B.version||""};return tt.version=Y.version||tt.version,g.set(B.id,tt),f("registered",Y.id),!0}a(U,"register");function et(B){return S.get(B)||null}a(et,"get");function it(B){let Y=[];for(let tt of S.values())(!B||tt.type===B)&&Y.push(tt);return Y}a(it,"list");function bt(B){let Y=g.get(B);return!!Y&&Y.loaded}a(bt,"loaded");async function J(B,Y,tt){tt&&tt({stage:"start",id:B});let ft=Array.isArray(Y)?Y:Y?[Y]:rt(B),ht=await $(ft,tt);k(`${re}${B}_code`,ht),tt&&tt({stage:"injecting",id:B});let Lt=I(ht,B),vt=g.get(B)||{loaded:!1,enabled:!1,version:""};return vt.loaded=Lt,vt.enabled=Lt,vt.code=ht,vt.version=vt.version||Q(ht),g.set(B,vt),k(`${re}${B}_enabled`,Lt),f("loaded",B),Lt}a(J,"install");function Q(B){let Y=String(B||"").match(/@version\s+(\S+)/);return Y?Y[1]:""}a(Q,"detectVersion");async function ot(B,Y,tt){let ft=Array.isArray(Y)?Y:Y?[Y]:rt(B),ht=await $(ft,tt);k(`${re}${B}_code`,ht);let Lt=Q(ht),vt=g.get(B)||{loaded:!1,enabled:!1,version:""};return vt.version=Lt||vt.version,vt.code=ht,g.set(B,vt),f("updated",B),{ok:!0,version:Lt||vt.version}}a(ot,"update");function X(B){let Y=u(`${re}${B}_code`);if(!Y)return!1;let tt=g.get(B);if(tt&&tt.loaded)return!0;let ft=I(Y,B),ht=g.get(B)||{loaded:!1,enabled:!1,version:Q(Y)};return ht.loaded=ft,ht.enabled=ft&&u(`${re}${B}_enabled`)!==!1,ht.code=Y,g.set(B,ht),f("loaded",B),ft}a(X,"bootFromCache");function ct(B){let Y=S.get(B);return S.delete(B),g.delete(B),k(`${re}${B}_enabled`,!1),f("unregistered",B),!!Y}a(ct,"unregister");function rt(B){return B==="assist"?["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/plugins/urpppp.plugin.js","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js"]:[]}a(rt,"pluginSource");let st={protocolVersion:Yc,register:U,unregister:ct,get:et,list:it,loaded:bt,isEnabled:G,enable:a((B,Y=!0)=>H(B,Y),"enable"),disable:a(B=>H(B,!1),"disable"),install:J,update:ot,bootFromCache:X,storage:a(()=>u&&{get:a(B=>u(B),"get"),set:a((B,Y)=>k(B,Y),"set")},"storage"),pluginStorage:a(B=>E()(B),"pluginStorage"),request:L,addStyle:a(B=>{try{A&&A(B)}catch{}},"addStyle"),log:a((...B)=>{console.log("[URP++ plugin]",...B)},"log"),on:h,emit:f,hostInfo:Object.assign({name:"SCU URP++"},c||{}),getSubpanel:a(()=>y,"getSubpanel")};try{window.__urpppPlugin=st}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppPlugin=st)}catch{}function xt(B){if(!B||!p||B.querySelector(".urppp-plugin-sec, .urpppp-entry-sec"))return;let Y=p.createElement("section");Y.className="urppp-set-sec urppp-plugin-sec",Y.id="urppp-plugin-sec",Y.innerHTML=`
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urppp-plugin-actions">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <div id="urppp-store-inline" class="urppp-store-inline" style="display:none"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `,B.appendChild(Y);let tt=Y.querySelector("#urppp-plugin-status"),ft=Y.querySelector("#urppp-plugin-install"),ht=Y.querySelector("#urppp-plugin-store"),Lt=Y.querySelector("#urppp-plugin-panels"),vt=Y.querySelector("#urppp-plugin-tip");function Dt(){let zt=g.get("assist"),Nt=S.has("assist");zt&&zt.loaded||Nt?(tt.textContent=`辅助插件 v${zt&&zt.version?zt.version:et("assist")&&et("assist").version||""} 已装载`,tt.className="urppp-plugin-status ok",ft.textContent="重新装载",ft.dataset.state="loaded",vt.textContent="已装载。下方为扩展入口。"):(tt.textContent=C||"未装载",tt.className=C?"urppp-plugin-status err":"urppp-plugin-status",ft.textContent="装载辅助插件",ft.dataset.state="notloaded",vt.textContent=C?"装载失败，可就近重试或放回本地安装。下方为装载/商店入口。":"点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。"),Lt.innerHTML="";let Zt=Pt();if(Zt&&Object.keys(Zt).length){let Fe=p.createElement("div");Fe.className="urppp-plugin-sub",Object.keys(Zt).forEach(ge=>{let Xt=p.createElement("button");Xt.type="button",Xt.className="urppp-set-btn ghost",Xt.textContent=Zt[ge].label||ge,Xt.addEventListener("click",()=>{try{Zt[ge]&&typeof Zt[ge].open=="function"?Zt[ge].open():y&&y(ge)}catch{}}),Fe.appendChild(Xt)}),Lt.appendChild(Fe)}}a(Dt,"refresh"),ft.addEventListener("click",async()=>{ft.disabled=!0,ft.textContent="装载中…",tt.className="urppp-plugin-status",tt.textContent="正在开始装载…";try{if(await J("assist",null,Nt=>{try{Nt.stage==="downloading"?tt.textContent=`下载中… 源${Nt.index}/${Nt.total}（${T(Nt.url)}）`:Nt.stage==="downloaded"?tt.textContent=`已下载（${Nt.size} 字节），注入中…`:Nt.stage==="source_failed"?tt.textContent=`源${Nt.index}失败（${Nt.error||""}），切换下一源…`:Nt.stage==="injecting"?tt.textContent="注入中…":Nt.stage==="start"&&(tt.textContent="正在开始装载…"),console.log("[URP++ plugin] assist 装载进度",Nt)}catch{}}))C=null,tt.textContent="辅助插件已装载 v"+(et("assist")&&et("assist").version||""),console.log("[URP++ plugin] assist 装载成功");else throw new Error("注入失败")}catch(zt){C="装载失败："+(zt&&zt.message?zt.message:zt),tt.textContent=C,tt.className="urppp-plugin-status err",console.warn("[URP++ plugin] assist 装载失败",zt)}finally{ft.disabled=!1,Dt()}}),ht.addEventListener("click",()=>{y&&y("plugin-store")}),h("loaded",zt=>{zt==="assist"&&Dt()}),h("registered",zt=>{zt==="assist"&&Dt()}),h("unregistered",zt=>{zt==="assist"&&Dt()}),Dt()}a(xt,"renderAssistUi");function Z(B){return String(B??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}a(Z,"escapeHtml");function dt(B){if(B){if(At(),B.dataset.rendered==="1"){B.style.display=B.style.display==="none"?"":"none";return}B.dataset.rendered="1",B.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download">
            <div class="urppp-store-empty"><p class="urppp-store-empty-title">敬请期待</p><p class="urppp-store-sub">插件市场正在筹备中，后续可从这里在线安装更多功能插件。</p></div>
          </div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">
            <div id="urppp-store-manage-list"></div>
          </div>
        </div>
      </div>`,B.querySelectorAll(".urppp-store-tab").forEach(Y=>{Y.addEventListener("click",()=>{B.querySelectorAll(".urppp-store-tab").forEach(ft=>ft.className="urppp-store-tab"),Y.className="urppp-store-tab ac",B.querySelectorAll(".urppp-store-pane").forEach(ft=>ft.style.display="none");let tt=B.querySelector('.urppp-store-pane[data-pane="'+Y.dataset.tab+'"]');tt&&(tt.style.display="")})}),kt(B.querySelector("#urppp-store-manage-list")),B.style.display=""}}a(dt,"togglePluginStore");function At(){if(p.getElementById("urppp-store-style"))return;let B=p.createElement("style");B.id="urppp-store-style",B.textContent=`
      .urppp-store-inline{margin-top:12px;border-top:1px solid var(--border,#e5e5ea);padding-top:14px}
      .urppp-store-tabs{display:flex;gap:8px;margin-bottom:12px;border-bottom:1px solid var(--border,#e5e5ea)}
      .urppp-store-tab{flex:1;height:34px;border:0;background:transparent;color:var(--text-secondary,#5b5f69);font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent}
      .urppp-store-tab.ac{color:var(--text,#16181d);border-bottom-color:var(--primary,#2563eb)}
      .urppp-store-body{min-height:0;overflow:auto}
      .urppp-store-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:120px;text-align:center;gap:6px;color:var(--text-secondary,#5b5f69);padding:16px 0}
      .urppp-store-empty-title{font-size:15px;font-weight:700;color:var(--text,#16181d)}
      .urppp-store-sub{font-size:12px;line-height:1.6;max-width:80%}
      .urppp-store-item{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px solid var(--border,#e5e5ea);border-radius:12px;margin-bottom:8px}
      .urppp-store-item:last-child{margin-bottom:0}
      .urppp-store-info{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .urppp-store-info strong{font-size:14px;font-weight:700}
      .urppp-store-ver{font-size:11px;color:var(--text-secondary,#5b5f69)}
      .urppp-store-state{font-size:11px;color:var(--text-secondary,#5b5f69);padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--primary,#2563eb) 10%,transparent)}
      .urppp-store-state.ok{color:var(--success,#1a7f37);background:color-mix(in srgb,var(--success,#1a7f37) 12%,transparent)}
      .urppp-store-ops{display:flex;gap:8px;flex:0 0 auto}
      .urppp-store-ops button{height:30px;padding:0 12px;font-size:12px;font-weight:650;cursor:pointer;border:1px solid var(--border,#e5e5ea);border-radius:8px;background:var(--input-bg,#f5f6f8);color:var(--text,#16181d)}
      .urppp-store-ops button.danger{color:#c0392b;border-color:color-mix(in srgb,#c0392b 40%,transparent);background:transparent}
      .urppp-store-ops button:hover{border-color:var(--primary,#2563eb)}
      .urppp-store-ops button:disabled{opacity:.55;cursor:not-allowed}
    `,(p.head||p.documentElement).appendChild(B)}a(At,"ensureStoreStyle");function kt(B){if(!B)return;B.innerHTML="";let Y=Array.from(S.values());if(!Y.length){B.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}Y.forEach(tt=>{let ft=g.get(tt.id)||{},ht=p.createElement("div");ht.className="urppp-store-item";let Lt=p.createElement("div");Lt.className="urppp-store-info",Lt.innerHTML="<strong>"+Z(tt.name||tt.id)+'</strong><span class="urppp-store-ver">'+(tt.version?"v"+Z(tt.version):"")+'</span><span class="urppp-store-state'+(ft.loaded?" ok":"")+'">'+(ft.loaded?"已装载":"未装载")+"</span>";let vt=p.createElement("div");vt.className="urppp-store-ops";let Dt=p.createElement("button");Dt.type="button",Dt.textContent="重新装载",Dt.addEventListener("click",async()=>{Dt.disabled=!0,Dt.textContent="装载中…";try{let Nt=await J(tt.id,null);Dt.textContent=Nt?"已装载":"装载失败",f("loaded",tt.id)}catch{Dt.textContent="装载失败"}setTimeout(()=>{Dt.disabled=!1,Dt.textContent="重新装载"},1400)});let zt=p.createElement("button");zt.type="button",zt.className="danger",zt.textContent="卸载",zt.addEventListener("click",()=>{ct(tt.id),k(`${re}${tt.id}_code`,""),k(`${re}${tt.id}_enabled`,!1),f("unregistered",tt.id),kt(B)}),vt.appendChild(Dt),vt.appendChild(zt),ht.appendChild(Lt),ht.appendChild(vt),B.appendChild(ht)})}a(kt,"renderStoreManage");function Pt(){let B={};return S.forEach(Y=>{if(Y.subpanels&&typeof Y.subpanels=="function"){let tt=Y.subpanels();Object.keys(tt||{}).forEach(ft=>{B[ft]=tt[ft]})}else Y.subpanels&&typeof Y.subpanels=="object"&&Object.keys(Y.subpanels).forEach(tt=>{B[tt]=Y.subpanels[tt]})}),B}return a(Pt,"collectSubpanels"),{api:st,install:J,update:ot,renderAssistUi:xt,openPluginStore:dt,bootFromCache:X,register:U}}a(Eo,"createPluginManager");function Kp(n){let{document:p,getSettings:c,setSettings:d,validateMapping:u,defaultMapping:k,getRecoveryMessage:P=a(()=>"","getRecoveryMessage")}=n;function A(g,v,q){let C=g&&g.querySelector("#urppp-set-json-status");C&&(C.textContent=v||"",C.classList.toggle("urppp-status-error",!!q),C.style.color=q?"var(--danger,#b91c1c)":"var(--text-muted)")}a(A,"setStatus");function y(g,v){if(!g)return;let q=c(),C=g.querySelector("#urppp-set-json-custom"),f=g.querySelector("#urppp-set-json-editor"),h=g.querySelector("#urppp-set-json-mapping");C&&(C.classList.toggle("ac",q.enabled),C.setAttribute("aria-pressed",q.enabled?"true":"false"),C.textContent="自定义 JSON："+(q.enabled?"开":"关")),f&&(f.style.display=q.enabled?"grid":"none"),h&&(v||!g.__urpppJsonMappingDirty&&p.activeElement!==h)&&(h.value=JSON.stringify(q.mapping,null,2),g.__urpppJsonMappingDirty=!1);let w=P();w&&A(g,w,!0)}a(y,"sync");function S(g){if(!g||g.__urpppJsonSettingsBound)return;g.__urpppJsonSettingsBound=!0;let v=g.querySelector("#urppp-set-json-custom"),q=g.querySelector("#urppp-set-json-mapping"),C=g.querySelector("#urppp-set-json-save"),f=g.querySelector("#urppp-set-json-reset");q&&q.addEventListener("input",()=>{g.__urpppJsonMappingDirty=!0}),v&&v.addEventListener("click",()=>{let h=c();h.enabled=!h.enabled;let w=!!g.__urpppJsonMappingDirty;d(h),y(g,!1);let x=h.enabled?"已启用自定义 JSON 格式":"已恢复小爱课程兼容格式";A(g,w?x+"；未保存草稿已保留":x)}),C&&C.addEventListener("click",()=>{try{let h=JSON.parse(String(q&&q.value||"").trim()),w=c();w.mapping=u(h),d(w),g.__urpppJsonMappingDirty=!1,y(g,!0),A(g,"自定义 JSON 映射已保存")}catch(h){A(g,h&&h.message||String(h),!0)}}),f&&f.addEventListener("click",()=>{let h=c();h.mapping=u(k),d(h),g.__urpppJsonMappingDirty=!1,y(g,!0),A(g,"已恢复默认字段映射")})}return a(S,"bind"),{bind:S,setStatus:A,sync:y}}a(Kp,"createJsonSettingsController");var qr="••••";var Zp={name:{enabled:!1,replacement:"同学"},identity:{enabled:!0,replacement:"已隐藏"},organization:{enabled:!0,replacement:"已隐藏"},contact:{enabled:!0,replacement:"已隐藏"},grade:{enabled:!0,replacement:"已隐藏"},gpa:{enabled:!0,replacement:"••••"},credit:{enabled:!0,replacement:"••••"},other:{enabled:!0,replacement:"已隐藏"},avatar:{enabled:!0,replacement:""},schedule:{enabled:!1,replacement:"课表已隐藏"}},Qc=["completedCourses","failedCourses","majorGpa","majorPlan","remainingCourses","passingTotalCredit","passingAvgScore","passingAvgGpa","passingRequiredCredit","passingRequiredAvg","passingRequiredGpa","schemeTotalCredit","schemeAvgScore","schemeAvgGpa","schemeRequiredCredit","schemeRequiredAvg","schemeRequiredGpa"];function Co(n){let p=n&&typeof n=="object"?n:{},c=["off","one","custom"].includes(p.mode)?p.mode:"off",d={},u=p.fields&&typeof p.fields=="object"?p.fields:{},k=u.score&&typeof u.score=="object"?u.score:null;Object.keys(Zp).forEach(g=>{let v=Zp[g],q=["grade","gpa","credit"].includes(g)?k:null,C=g==="other"&&u.grade&&typeof u.grade=="object"?u.grade:null,f=u[g]&&typeof u[g]=="object"?u[g]:q||C||{};d[g]={enabled:g==="name"?!1:f.enabled==null?v.enabled:!!f.enabled,replacement:String(f.replacement==null?v.replacement:f.replacement).slice(0,80)}});let P=p.homepage&&typeof p.homepage=="object"?p.homepage:{},A=p.directEdit&&typeof p.directEdit=="object"?p.directEdit:P,y=A.values&&typeof A.values=="object"?A.values:{},S={};return Qc.forEach(g=>{S[g]=String(y[g]==null?"":y[g]).trim().slice(0,80)}),{mode:c,mask:qr,fields:d,directEdit:{enabled:!!A.enabled,values:S}}}a(Co,"normalizePrivacySettings");function Tr(n){let p=n&&typeof n=="object"?n:{},c=String(p.avatar||"").trim();return{nameEnabled:!!p.nameEnabled,name:String(p.name||"").trim().slice(0,40),avatarEnabled:!!p.avatarEnabled,avatar:c.length<=3145728?c:"",avatarName:String(p.avatarName||"").trim().slice(0,120)}}a(Tr,"normalizeCustomIdentity");function sr(n){let p=String(n||"").trim();return p.length>3145728?"":/^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(p)?p:""}a(sr,"validCustomAvatar");function Xc(n,p=globalThis.FileReader){return new Promise((c,d)=>{if(!n||!/^image\/(png|jpeg|webp|gif)$/i.test(n.type||"")){d(new Error("请选择 PNG、JPG、WebP 或 GIF 图片"));return}if(n.size>2*1024*1024){d(new Error("本地头像不能超过 2MB"));return}let u=new p;u.onload=()=>c(String(u.result||"")),u.onerror=()=>d(new Error("读取头像失败")),u.readAsDataURL(n)})}a(Xc,"readAvatarFile");function ti(n){let{getPrivacySettings:p,setPrivacySettings:c,getCustomIdentity:d,setCustomIdentity:u,applyDisplay:k,refreshCleanDisplay:P,finishActiveDirectEdit:A,readAvatar:y=Xc}=n;function S(f,h){let w=h.mode==="custom",x=f.querySelector(".urppp-direct-edit-control"),E=f.querySelector("#urppp-set-direct-edit-toggle");x&&(x.style.display=w?"flex":"none"),E&&(E.dataset.enabled=h.directEdit.enabled?"1":"0",E.classList.toggle("ac",h.directEdit.enabled),E.setAttribute("aria-pressed",h.directEdit.enabled?"true":"false"),E.textContent="页面内修改："+(h.directEdit.enabled?"开":"关"))}a(S,"syncDirectEdit");function g(f){if(!f)return;let h=p();f.querySelectorAll("[data-privacy-mode]").forEach(I=>{let H=I.getAttribute("data-privacy-mode")===h.mode;I.classList.toggle("ac",H),I.setAttribute("aria-pressed",H?"true":"false")});let w=f.querySelector("#urppp-set-privacy-custom");w&&(w.style.display=h.mode==="custom"?"grid":"none"),Object.keys(h.fields).forEach(I=>{let H=h.fields[I],G=f.querySelector('[data-privacy-field="'+I+'"]'),U=f.querySelector('[data-privacy-value="'+I+'"]');G&&(G.checked=!!H.enabled),U&&(U.value=H.replacement||"",U.disabled=!H.enabled)}),S(f,h);let x=d(),E=f.querySelector("#urppp-set-name-enabled"),L=f.querySelector("#urppp-set-custom-name"),$=f.querySelector("#urppp-set-avatar-enabled"),T=f.querySelector("#urppp-set-custom-avatar-url"),j=f.querySelector("#urppp-set-avatar-preview");if(E&&(E.checked=x.nameEnabled),L&&(L.value=x.name,L.disabled=!x.nameEnabled),$&&($.checked=x.avatarEnabled),T&&(T.value=/^data:image\//i.test(x.avatar)?"":x.avatar,T.disabled=!x.avatarEnabled),f.__urpppAvatarSource=x.avatar,j){let I=sr(x.avatar);j.style.display=I?"block":"none",I?j.src=I:j.removeAttribute("src")}}a(g,"sync");function v(f){let h=p();Object.keys(h.fields).forEach(x=>{let E=f.querySelector('[data-privacy-field="'+x+'"]'),L=f.querySelector('[data-privacy-value="'+x+'"]');E&&(h.fields[x].enabled=!!E.checked),L&&(h.fields[x].replacement=String(L.value||"").trim().slice(0,80))});let w=f.querySelector("#urppp-set-direct-edit-toggle");return h.directEdit.enabled=!!(w&&w.dataset.enabled==="1"),h}a(v,"collect");function q(f,h,w){let x=f&&f.querySelector("#urppp-set-privacy-status");x&&(x.textContent=h||"",x.style.color=w?"#b91c1c":"var(--text-muted)")}a(q,"setStatus");function C(f){if(!f||f.__urpppPrivacyBound)return;f.__urpppPrivacyBound=!0,f.querySelectorAll("[data-privacy-mode]").forEach(T=>{T.addEventListener("click",()=>{let j=p();j.mode=T.getAttribute("data-privacy-mode")||"off",c(j),g(f),k()})}),f.querySelectorAll("[data-privacy-field]").forEach(T=>{T.addEventListener("change",()=>{let j=T.getAttribute("data-privacy-field"),I=f.querySelector('[data-privacy-value="'+j+'"]');I&&(I.disabled=!T.checked)})});let h=f.querySelector("#urppp-set-direct-edit-toggle");h&&h.addEventListener("click",()=>{let T=h.dataset.enabled!=="1";h.dataset.enabled=T?"1":"0",h.classList.toggle("ac",T),h.setAttribute("aria-pressed",T?"true":"false"),h.textContent="页面内修改："+(T?"开":"关")});let w=f.querySelector("#urppp-set-name-enabled"),x=f.querySelector("#urppp-set-avatar-enabled");w&&w.addEventListener("change",()=>{let T=f.querySelector("#urppp-set-custom-name");T&&(T.disabled=!w.checked)}),x&&x.addEventListener("change",()=>{let T=f.querySelector("#urppp-set-custom-avatar-url");T&&(T.disabled=!x.checked)});let E=f.querySelector("#urppp-set-custom-avatar-file");E&&E.addEventListener("change",async()=>{try{let T=await y(E.files&&E.files[0]);f.__urpppAvatarSource=T;let j=f.querySelector("#urppp-set-avatar-preview");j&&(j.src=T,j.style.display="block"),x&&(x.checked=!0),q(f,"本地头像已读取，点击保存后生效")}catch(T){q(f,T&&T.message||String(T),!0)}});let L=f.querySelector("#urppp-set-avatar-clear");L&&L.addEventListener("click",()=>{try{let T=d();T.avatarEnabled=!1,T.avatar="",T.avatarName="",u(T),f.__urpppAvatarSource="",g(f),k(),P(),q(f,"已清除自定义头像")}catch(T){q(f,T&&T.message||"清除自定义头像失败",!0)}});let $=f.querySelector("#urppp-set-privacy-save");$&&$.addEventListener("click",()=>{let T=p(),j=d();try{let I=v(f),H=f.querySelector("#urppp-set-custom-avatar-url"),U=String(H&&H.value||"").trim()||f.__urpppAvatarSource||"",et=Tr({nameEnabled:!!(w&&w.checked),name:String(f.querySelector("#urppp-set-custom-name")?.value||"").trim(),avatarEnabled:!!(x&&x.checked),avatar:U,avatarName:j.avatarName});if(et.avatarEnabled&&!sr(et.avatar))throw new Error("头像地址必须是 http(s) 图片或已选择的本地图片");T.directEdit.enabled&&!I.directEdit.enabled&&A(!0);try{u(et),c(I)}catch(it){try{u(j),c(T)}catch{}throw it}k(),P(),g(f),q(f,"隐私与显示设置已保存")}catch(I){q(f,I&&I.message||String(I),!0)}})}return a(C,"bind"),{bind:C,collect:v,setStatus:q,sync:g}}a(ti,"createPrivacySettingsController");function ei(n){let{document:p,theme:c,preferences:d,accent:u,syncPanel:k}=n;function P(){c.getFollowSystem()?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply("scu-red",{manual:!0})}a(P,"applyAccentTheme");function A(S,g){let v=S.querySelector("#urppp-set-schemes");if(!v)return;let q=u.getScheme();v.innerHTML="",u.listSchemePreviews(g).forEach(C=>{let f=p.createElement("button");f.type="button",f.className="urppp-set-scheme"+(C.id===q?" ac":""),f.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+C.bg+'"></span>','  <span style="background:'+C.surface+";border-color:"+C.border+'"></span>','  <span style="background:'+C.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+C.name+"</strong>","  <em>"+C.desc+"</em>","</div>"].join(""),f.addEventListener("click",()=>{u.setAccent(g),u.setScheme(C.id),P(),k()}),v.appendChild(f)})}a(A,"renderSchemeChoices");function y(S){S.querySelectorAll(".urppp-set-mode").forEach(T=>{T.addEventListener("click",()=>{c.isModeAvailable(T.dataset.theme)&&(c.apply(T.dataset.theme,{manual:!0}),k())})});let g=S.querySelector("#urppp-set-follow");g&&g.addEventListener("click",()=>{if(!c.supportsDark())return;let T=!c.getFollowSystem();c.setFollowSystem(T),T?c.apply(c.resolveFollowTheme(),{system:!0}):c.apply(c.getCurrent(),{manual:!0}),k(),c.syncNavbar()});let v=S.querySelector("#urppp-set-follow-dynamic");v&&v.addEventListener("click",()=>{c.supportsDynamic()&&(c.getFollowSystem()?c.setFollowDynamic(!c.getFollowDynamic()):(c.setFollowSystem(!0),c.setFollowDynamic(!0)),c.apply(c.resolveFollowTheme(),{system:!0}),k(),c.syncNavbar())});let q=S.querySelector("#urppp-set-clean-default");q&&q.addEventListener("click",()=>{d.setCleanDefault(!d.getCleanDefault()),k()});let C=S.querySelector("#urppp-set-clean-analysis");C&&C.addEventListener("click",()=>{let T=d.getCleanAnalysis()==="direct";d.setCleanAnalysis(T?"tab":"direct"),k()});let f=S.querySelector("#urppp-set-apple-edge");f&&f.addEventListener("click",()=>{d.setAppleEdge(!d.getAppleEdge());try{d.applySkin()}catch{}k()});let h=S.querySelector("#urppp-set-auto-update");h&&h.addEventListener("click",()=>{d.setAutoUpdate(!d.getAutoUpdate()),k()});let w=S.querySelector("#urppp-set-check-update");w&&!w.__urpppBound&&(w.__urpppBound=!0,w.addEventListener("click",()=>{d.checkUpdates()}));let x=S.querySelector("#urppp-set-color"),E=S.querySelector("#urppp-set-hex");if(!x||!E)return;x.addEventListener("input",()=>{E.value=x.value.toUpperCase()}),E.addEventListener("change",()=>{let T=u.normalize(E.value);T&&(E.value=T,x.value=T)});let L=S.querySelector("#urppp-set-gen");L&&L.addEventListener("click",()=>{let T=u.normalize(E.value)||x.value;T&&(u.setAccent(u.normalize(T)),P(),k())});let $=S.querySelector("#urppp-set-save");$&&$.addEventListener("click",()=>{let T=u.normalize(E.value)||x.value;T&&(u.savePreset(T),u.setAccent(u.normalize(T)),P(),k())}),x.addEventListener("change",()=>{let T=u.normalize(x.value);T&&(E.value=T,A(S,T))})}return a(y,"bind"),{bind:y,renderSchemeChoices:A}}a(ei,"createThemeSettingsController");function ri(n,p){let{seed:c,currentTheme:d,followSystem:u,skinId:k,darkSupported:P,dynamicSupported:A,fixedPalettes:y,followUseDynamic:S,cleanDefault:g,cleanAnalysis:v,appleEdge:q,autoUpdate:C,modeAvailability:f}=p,h=n.querySelector("#urppp-set-color"),w=n.querySelector("#urppp-set-hex");h&&(h.value=c),w&&(w.value=c),n.querySelectorAll(".urppp-set-mode").forEach(U=>{let et=U.dataset.theme,it=f[et]!==!1,bt=!u&&et===d&&it;U.disabled=!it,U.classList.toggle("ac",bt),U.classList.toggle("urppp-dyn-disabled",!it),U.setAttribute("aria-disabled",it?"false":"true"),it?U.removeAttribute("title"):U.title=et==="dark"?"当前界面风格不支持暗色模式":"当前界面风格不支持动态配色"});let x=n.querySelector("#urppp-set-follow");x&&(x.disabled=!P,x.classList.toggle("ac",u&&P),x.classList.toggle("urppp-dyn-disabled",!P),x.setAttribute("aria-pressed",u&&P?"true":"false"),x.textContent=u&&P?"跟随系统：开":"跟随系统：关",x.title=P?"":"当前界面风格不支持暗色模式");let E=n.querySelector("#urppp-set-follow-dynamic");E&&(E.classList.toggle("ac",S&&A),E.setAttribute("aria-pressed",S&&A?"true":"false"),E.textContent=S?"浅色用动态配色：开":"浅色用动态配色：关",E.disabled=!u||!A,E.classList.toggle("urppp-dyn-disabled",!A),E.style.opacity=A&&u?"1":"0.5",E.title=A?"":"当前界面风格不支持动态配色");let L=n.querySelector("#urppp-set-dynamic");L&&(L.style.display=A?"":"none",L.style.opacity="1",L.classList.toggle("urppp-dyn-disabled",!1),L.querySelectorAll("button, input, .urppp-set-scheme, .urppp-set-swatch").forEach(U=>{U.disabled=!1,U.classList.toggle("urppp-dyn-disabled",!1)}),L.querySelectorAll("h3, .urppp-set-tip, label").forEach(U=>{U.classList.toggle("urppp-dyn-disabled",!1)}));let $=n.querySelector("#urppp-set-brutal");$&&($.style.display=y?"":"none");let T=n.querySelector("#urppp-set-clean-default");T&&(T.classList.toggle("ac",g),T.setAttribute("aria-pressed",g?"true":"false"),T.textContent=g?"默认进入清爽模式：开":"默认进入清爽模式：关");let j=n.querySelector("#urppp-set-clean-analysis");if(j){let U=v==="direct";j.classList.toggle("ac",U),j.setAttribute("aria-pressed",U?"true":"false"),j.textContent=U?"清爽成绩分析展示：直接显示":"清爽成绩分析展示：选项卡"}let I=n.querySelector("#urppp-set-apple-edge"),H=n.querySelector("#urppp-set-apple-edge-tip");if(I){let U=k==="apple";I.style.display=U?"":"none",H&&(H.style.display=U?"":"none"),U&&(I.classList.toggle("ac",q),I.setAttribute("aria-pressed",q?"true":"false"),I.textContent=q?"类Apple边缘线条：开":"类Apple边缘线条：关")}let G=n.querySelector("#urppp-set-auto-update");G&&(G.classList.toggle("ac",C),G.setAttribute("aria-pressed",C?"true":"false"),G.textContent=C?"自动检测更新：开":"自动检测更新：关")}a(ri,"syncThemeSettingsControls");function Po(n){let p=String(n||"").replace(/\s+/g,"");return/^[•·●○▪◆★\-–]$/.test(p)||/^\d{1,4}$/.test(p)}a(Po,"isNoticeBulletText");function Kc(n){return/\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(n||""))}a(Kc,"isNoticeDateText");function ai({pathname:n="",href:p="",title:c="",headingText:d=""}={}){return/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${n} ${p}`)?!0:/评估公告|通知公告|选课公告|公告|通知/.test(`${c} ${d}`)}a(ai,"isNoticePageContext");function zo(n,{noticePage:p=!1}={}){if(!n)return!1;let d=(n.querySelector("thead")?.textContent||"").replace(/\s+/g,"");if(/标题/.test(d)&&/发布时间|发布日期|日期|时间/.test(d)||p&&/标题|公告|通知/.test(d)&&!/教室|教学楼|课程号|成绩|学号|座位数/.test(d))return!0;let u=n.querySelectorAll("tbody tr, tr"),k=0;if(u.forEach(A=>{let y=A.querySelectorAll("td");y.length<2||y.length>4||Po(y[0].textContent)&&A.querySelector("a")&&Kc(A.textContent)&&(k+=1)}),k<1)return!1;if(p||k===u.length)return!0;let P=n.getAttribute("style")||"";return/dashed/i.test(P)||n.classList.contains("no-border-top")||!!n.getAttribute("width")}a(zo,"isNoticeListTable");function oi(n,{noticePage:p=!1}={}){if(!n)return!0;if(n.classList?.contains("urppp-notice-table")||zo(n,{noticePage:p}))return!1;let c=`${n.id||""} ${n.getAttribute("class")||""}`;if(/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(c)||n.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]'))return!0;let d=n.querySelector("tbody tr, tr");if(d&&d.querySelectorAll("td,th").length>=5)return!0;let k=(n.querySelector("thead")?.textContent||"").replace(/\s+/g,"");return!!(k&&(/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(k)||/序号/.test(k)&&!/标题|公告|通知|发布时间/.test(k))||n.querySelector("a")&&/课表|教室信息|查看/.test(n.textContent||"")&&!p&&/座位数|教学楼|教室号|校区名/.test(n.textContent||""))}a(oi,"isBusinessDataTable");function ni({isNativePdfIsolationActive:n,isBusinessDataTable:p,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,getComputedStyleRef:k=getComputedStyle}){function P(){n()||c.querySelectorAll("table.table, table.table-bordered, table.dataTable").forEach(y=>{if(!y||y.closest(".urppp-table-wrap")||y.id==="courseTable"||y.closest(".modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal")||y.classList.contains("urppp-wrs-table")||y.classList.contains("urppp-notice-table"))return;p(y);let S=y.parentElement;if(!S)return;let g=S.style?.overflow||k(S).overflow;if(S.id?.endsWith("_scroll")||g==="auto"||g==="scroll"){S.classList.add("urppp-scroll-table-host");return}let q=c.createElement("div");q.className="urppp-table-wrap",S.insertBefore(q,y),q.appendChild(y)})}a(P,"wrapTables");function A(){let y=c.getElementById("page-content-template")||c.querySelector(".page-content")||c.body;if(!y)return;let S=d.__urpppTableObsRoot;if(d.__urpppTableObs&&S===y&&y.isConnected)return;d.__urpppTableObs&&d.__urpppTableObs.disconnect();let g=0,v=new u(()=>{clearTimeout(g),g=setTimeout(P,80)});v.observe(y,{childList:!0,subtree:!0}),d.__urpppTableObs=v,d.__urpppTableObsRoot=y}return a(A,"bindTableWrapObserver"),{bindTableWrapObserver:A,wrapTables:P}}a(ni,"createTableWrapper");function pi(n){let p=String(n||"").trim().toLowerCase();if(!p||p==="transparent"||p==="inherit"||p==="initial")return!1;if(/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(p))return!0;let c=p.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);if(!c)return!1;let d=Number(c[1]),u=Number(c[2]),k=Number(c[3]);return(d+u+k)/3>=200}a(pi,"isLightInlineColor");function Zc(n){if(!n?.style)return;let p=n.getAttribute("style")||"";if(!p||!/background/i.test(p))return;let c=n.style.backgroundColor||n.style.background||"";(pi(c)||/background(-color|-image)?\s*:/i.test(p))&&(n.style.removeProperty("background"),n.style.removeProperty("background-color"),n.style.removeProperty("background-image")),["borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"].forEach(d=>{let u=n.style[d];!u||!pi(u)||n.style.removeProperty(d.replace(/[A-Z]/g,k=>`-${k.toLowerCase()}`))}),/border(-color)?\s*:/i.test(p)&&/#e6e6e6|#eee|#ddd|#ccc/i.test(p)&&(n.style.removeProperty("border-color"),n.style.removeProperty("border-top-color"),n.style.removeProperty("border-right-color"),n.style.removeProperty("border-bottom-color"),n.style.removeProperty("border-left-color"))}a(Zc,"scrubLightInlineBackground");function ii({isNativePdfIsolationActive:n,documentRef:p=document,windowRef:c=window,MutationObserverRef:d=MutationObserver}){function u(){if(!n())try{let P=p.documentElement.classList.contains("urppp-theme-dark"),A=p.body?.classList.contains("urppp-dark");if(!P&&!A)return;p.querySelectorAll("table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th").forEach(Zc)}catch{}}a(u,"scrubTableHeaderInlineBg");function k(){[0,200,800,1600].forEach(P=>setTimeout(()=>{try{u()}catch{}},P));try{let P=p.querySelector(".page-content, #page-content-template, .main-content")||p.body;if(!P)return;let A=c.__urpppTableScrubObs;if(A&&A.root===P&&P.isConnected)return;A?.observer&&A.observer.disconnect();let y=new d(()=>{clearTimeout(c.__urpppTableScrubTimer),c.__urpppTableScrubTimer=setTimeout(()=>{try{u()}catch{}},120)});y.observe(P,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),c.__urpppTableScrubObs={root:P,observer:y}}catch{}}return a(k,"scheduleScrubTableInlineBg"),{scheduleScrubTableInlineBg:k,scrubTableHeaderInlineBg:u}}a(ii,"createTableInlineStyleScrubber");function si({beautifyPagebar:n,documentRef:p=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,setTimeoutRef:u=setTimeout,clearTimeoutRef:k=clearTimeout}){function P(){n(),p.querySelectorAll("#urppagebar").forEach(y=>{if(y.__urpppPagebarObs)return;y.__urpppPagebarObs=!0,new d(()=>{k(c.__urpppPagebarTimer),c.__urpppPagebarTimer=u(()=>n(y.parentElement||p),150)}).observe(y,{childList:!0,subtree:!0})})}a(P,"run");function A(){if(c.__urpppPagebarBound){u(P,0);return}c.__urpppPagebarBound=!0,[0,300,1e3,2500].forEach(y=>u(P,y))}return a(A,"scheduleBeautifyPagebar"),{scheduleBeautifyPagebar:A}}a(si,"createPagebarLifecycle");function li({destroyPagebarChosen:n,documentRef:p=document,logger:c=console}){function d(u){try{(u?.querySelectorAll?u.querySelectorAll("#urppagebar"):p.querySelectorAll("#urppagebar")).forEach(P=>{if(!P)return;P.classList.add("urppp-pagebar"),P.style.setProperty("display","block","important"),P.style.setProperty("width","100%","important"),P.style.setProperty("line-height","1.5","important");let A=P.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]')||P,y=Array.from(P.querySelectorAll('[id^="span_page_txt_"]')).map(f=>String(f.textContent||"").trim()).join(""),S=P.querySelector('select[id^="pagination_pageSize_"]'),g=S?String(S.value||""):"",v=P.querySelector('[id^="turnpageto_"]'),q=!!(v&&(v.readOnly||v.hasAttribute("readonly")));if(!(y.includes("转到")&&!q&&!g.includes("_"))){P.classList.add("urppp-pagebar-scroll"),P.classList.remove("urppp-pagebar-jump"),P.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach(f=>{f.style.setProperty("display","none","important")}),P.querySelectorAll("select").forEach(f=>{n(f),f.style.setProperty("width","128px","important"),f.style.setProperty("min-width","128px","important"),f.style.setProperty("max-width","128px","important")}),P.querySelectorAll(".chosen-container").forEach(f=>{try{f.style.setProperty("display","none","important")}catch{}});return}P.classList.add("urppp-pagebar-jump"),P.classList.remove("urppp-pagebar-scroll"),A.style.setProperty("display","flex","important"),A.style.setProperty("align-items","center","important"),A.style.setProperty("flex-wrap","wrap","important"),A.style.setProperty("gap","8px","important"),A.style.setProperty("position","relative","important"),A.style.setProperty("line-height","1.5","important"),P.querySelectorAll("ul.pagination").forEach(f=>{f.classList.add("urppp-pagination"),f.style.cssText=["display:inline-flex !important","align-items:center !important","flex-wrap:wrap !important","gap:4px !important","margin:0 !important","padding:0 !important","list-style:none !important","float:none !important","position:static !important"].join(";")}),P.querySelectorAll("ul.pagination > li").forEach(f=>{let h=f.classList.contains("active"),w=f.classList.contains("disabled"),x=f.classList.contains("previous")||/previous/i.test(f.getAttribute("name")||""),E=f.classList.contains("next")||/next/i.test(f.getAttribute("name")||"");f.classList.add("urppp-page-li"),h&&f.classList.add("urppp-page-li-active"),w&&f.classList.add("urppp-page-li-disabled"),x&&f.classList.add("urppp-page-li-prev"),E&&f.classList.add("urppp-page-li-next"),f.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","float:none !important","position:static !important","margin:0 !important","padding:0 !important","list-style:none !important","border:none !important","background:transparent !important","height:auto !important","min-height:0 !important"].join(";");let L=f.querySelector(":scope > span, :scope > a")||f.firstElementChild;if(!L)return;L.classList.add("urppp-page-chip"),h&&L.classList.add("urppp-page-chip-active"),w&&L.classList.add("urppp-page-chip-disabled"),(x||E)&&L.classList.add("urppp-page-chip-nav");let $=x||E?"72px":"40px",T=h?"var(--pagination-active-bg, var(--primary))":"var(--surface)",j=h?"var(--pagination-active-border, var(--primary))":"var(--border)",I=h?"var(--pagination-active-foreground, var(--primary-foreground, #fff))":w?"var(--text-muted)":"var(--text)";L.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","box-sizing:border-box !important","float:none !important","position:static !important","width:auto !important",`min-width:${$} !important`,"height:36px !important","min-height:36px !important","max-height:36px !important","padding:0 12px !important","margin:0 !important","line-height:36px !important","font-size:14px !important","font-weight:600 !important","border-radius:8px !important",`border:1px solid ${j} !important`,`background:${T} !important`,`color:${I} !important`,"box-shadow:none !important","text-decoration:none !important",`cursor:${w?"default":"pointer"} !important`,"white-space:nowrap !important","overflow:hidden !important"].join(";")}),P.querySelectorAll('[id^="btn_turnpageto_"]').forEach(f=>{f.classList.add("urppp-page-confirm"),f.style.setProperty("position","static","important"),f.style.setProperty("left","auto","important"),f.style.setProperty("top","auto","important"),f.style.setProperty("float","none","important"),f.style.setProperty("height","32px","important"),f.style.setProperty("min-width","52px","important"),f.style.setProperty("padding","0 12px","important"),f.style.setProperty("margin","0 4px","important"),f.style.setProperty("font-size","13px","important"),f.style.setProperty("line-height","1","important"),f.style.setProperty("vertical-align","middle","important")}),P.querySelectorAll('[id^="turnpageto_"]').forEach(f=>{f.classList.add("urppp-page-goto"),f.style.setProperty("position","static","important"),f.style.setProperty("display","inline-block","important"),f.style.setProperty("height","32px","important"),f.style.setProperty("width","48px","important"),f.style.setProperty("margin","0 4px","important"),f.style.setProperty("padding","4px 8px","important"),f.style.setProperty("font-size","14px","important"),f.style.setProperty("line-height","1.2","important"),f.style.setProperty("box-sizing","border-box","important"),f.style.setProperty("vertical-align","middle","important");let h=f.parentElement;h?.tagName==="SPAN"&&(h.style.setProperty("position","static","important"),h.style.setProperty("display","inline-flex","important"),h.style.setProperty("align-items","center","important"),h.style.setProperty("width","auto","important"),h.style.setProperty("height","auto","important"),h.style.setProperty("min-height","0","important"),h.style.setProperty("vertical-align","middle","important"))}),P.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach(f=>{f.style.setProperty("display","inline","important"),f.style.setProperty("border","none","important"),f.style.setProperty("background","transparent","important"),f.style.setProperty("padding","0","important"),f.style.setProperty("margin","0","important"),f.style.setProperty("height","auto","important"),f.style.setProperty("line-height","1.5","important"),f.style.setProperty("font-size","13px","important"),f.style.setProperty("color","var(--text-secondary, var(--text-muted))","important")})})}catch(k){c.warn("[URP++] pagebar beautify failed",k)}}return a(d,"beautifyPagebar"),{beautifyPagebar:d}}a(li,"createPagebarBeautifier");function ci({beautifyNoticeTables:n,pinNoticeRowSurface:p,documentRef:c=document,windowRef:d=window,MutationObserverRef:u=MutationObserver,requestAnimationFrameRef:k=requestAnimationFrame,setTimeoutRef:P=setTimeout,clearTimeoutRef:A=clearTimeout}){function y(){d.__urpppNoticeHoverScrub||(d.__urpppNoticeHoverScrub=!0,c.addEventListener("mouseout",g=>{let v=g.target?.closest?g.target.closest("table.urppp-notice-table tr.urppp-notice-row"):null;v&&k(()=>p(v))},!0))}a(y,"bindNoticeHoverScrub");function S(){[0,400,1500].forEach(g=>P(()=>{try{n()}catch{}},g));try{let g=c.getElementById("page-content-template")||c.querySelector(".page-content, .main-content")||c.body;if(!g)return;let v=d.__urpppNoticeObs;if(v&&v.root===g&&g.isConnected)return;v?.observer&&v.observer.disconnect();let q=new u(()=>{A(d.__urpppNoticeTimer),d.__urpppNoticeTimer=P(()=>{try{n()}catch{}},180)});q.observe(g,{childList:!0,subtree:!0}),d.__urpppNoticeObs={root:g,observer:q}}catch{}}return a(S,"scheduleBeautifyNoticeTables"),{bindNoticeHoverScrub:y,scheduleBeautifyNoticeTables:S}}a(ci,"createNoticeTableLifecycle");function di({getCurrentTheme:n,documentRef:p=document,getComputedStyleRef:c=getComputedStyle}){function d(){try{return c(p.documentElement).getPropertyValue("--surface").trim()||(n()==="dark"?"#151A24":"#FFFFFF")}catch{return n()==="dark"?"#151A24":"#FFFFFF"}}a(d,"noticeSurfaceColor");function u(y){if(!y?.classList?.contains("urppp-notice-row"))return;let S=d();y.classList.remove("hover"),y.style.setProperty("background",S,"important"),y.style.setProperty("background-color",S,"important"),y.querySelectorAll("td, th").forEach(g=>{g.classList.remove("hover"),g.style.setProperty("background","transparent","important"),g.style.setProperty("background-color","transparent","important")})}a(u,"pinNoticeRowSurface");function k(y){try{let S=y||p;if(S.matches?.("tr.urppp-notice-row")){u(S);return}S.querySelectorAll("table.urppp-notice-table tr.urppp-notice-row").forEach(u)}catch{}}a(k,"scrubNoticeInlineBg");function P(y){y&&(y.classList.remove("table-hover","table-striped"),y.classList.add("urppp-notice-nohover"),y.querySelectorAll("tr.urppp-notice-row").forEach(S=>{S.classList.remove("hover"),u(S)}))}a(P,"disarmNoticeTableHover");function A(y){if(!y)return;y.classList.remove("urppp-notice-table"),delete y.dataset.urpppNoticeScan,y.style.removeProperty("border"),y.style.removeProperty("border-left"),y.style.removeProperty("background");let S=y.closest(".urppp-table-wrap.urppp-notice-wrap");S&&(S.classList.remove("urppp-notice-wrap"),S.style.removeProperty("border"),S.style.removeProperty("background"),S.style.removeProperty("box-shadow"),S.style.removeProperty("overflow"),S.style.removeProperty("border-radius")),y.querySelectorAll("tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card").forEach(g=>{g.classList.remove("urppp-notice-row","urppp-notice-title-cell","urppp-notice-date-cell","urppp-notice-bullet-cell","urppp-notice-link","urppp-notice-time","urppp-notice-card","urppp-notice-card-row","urppp-notice-main","urppp-notice-meta","urppp-notice-title","urppp-notice-body"),(g.tagName==="TR"||g.tagName==="TD")&&["display","border","background","padding","margin","width","box-shadow","border-radius","float","position"].forEach(v=>{g.style.getPropertyPriority(v)==="important"&&g.style.removeProperty(v)}),delete g.dataset.urpppNoticeDone})}return a(A,"stripMistakenNoticeTable"),{disarmNoticeTableHover:P,pinNoticeRowSurface:u,scrubNoticeInlineBg:k,stripMistakenNoticeTable:A}}a(di,"createNoticeTableSurface");function ui({isNativePdfIsolationActive:n,bindNoticeHoverScrub:p,scrubNoticeInlineBg:c,stripMistakenNoticeTable:d,disarmNoticeTableHover:u,pinNoticeRowSurface:k,isBusinessDataTable:P,isNoticeListTable:A,isNoticePageContext:y,isNoticeBulletText:S,documentRef:g=document,windowRef:v=window,logger:q=console}){function C(){if(!n())try{p(),c(),g.querySelectorAll("table.urppp-notice-table, table.table").forEach(h=>{P(h)&&(h.classList.contains("urppp-notice-table")||h.querySelector(".urppp-notice-row, .urppp-notice-title-cell"))&&d(h)});let f=new Set(g.querySelectorAll('.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'));y()?g.querySelectorAll("table").forEach(h=>f.add(h)):g.querySelectorAll("table").forEach(h=>{A(h)&&f.add(h)}),Array.from(f).forEach(h=>{if(!h||P(h))return;if(h.querySelector("thead th")&&h.querySelectorAll("thead th").length>=3){let T=h.querySelector("thead")?.textContent||"";if(!A(h)&&/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(T)&&!/标题|公告|通知/.test(T))return}let w=Array.from(h.querySelectorAll("tbody > tr, tr")).filter(T=>T.querySelector("td"));if(!w.length)return;let x=0;w.slice(0,12).forEach(T=>{let j=Array.from(T.children).filter(et=>et.tagName==="TD"||et.tagName==="TH");if(j.length>=5)return;let I=(T.textContent||"").replace(/\s+/g," ").trim(),H=!!T.querySelector("a[href], a[onclick], a"),G=/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(I),U=j.some(et=>S(et.textContent));(H&&G||U&&H||U&&G)&&(x+=1)});let E=h.classList.contains("no-border-top")||/dashed|border-left-style/.test(h.getAttribute("style")||""),L=y();if(x<1){if(L){if(w.slice(0,8).filter(j=>{let I=Array.from(j.children).filter(G=>G.tagName==="TD"||G.tagName==="TH");if(I.length<1||I.length>4)return!1;let H=(j.textContent||"").replace(/\s+/g," ").trim();return!!j.querySelector("a")||/\d{4}/.test(H)}).length<1&&!E)return}else if(!(E&&/公告|通知/.test(g.title||"")))return}if(P(h))return;h.classList.add("urppp-notice-table"),h.dataset.urpppNoticeScan="1",u(h),h.style.setProperty("border","none","important"),h.style.setProperty("border-left","none","important"),h.style.setProperty("background","transparent","important"),h.style.setProperty("width","100%","important");let $=h.closest(".urppp-table-wrap");$&&($.classList.add("urppp-notice-wrap"),$.style.setProperty("border","none","important"),$.style.setProperty("background","transparent","important"),$.style.setProperty("box-shadow","none","important"),$.style.setProperty("overflow","visible","important"),$.style.setProperty("border-radius","0","important")),w.forEach(T=>{if(T.dataset.urpppNoticeDone==="1")return;let j=Array.from(T.children).filter(J=>J.tagName==="TD"||J.tagName==="TH");if(!j.length)return;let I=a(J=>(J||"").replace(/\u00AD/g,"").replace(/\u200B/g,"").replace(/\s+/g," ").trim(),"clean");if(j.length>=2){let J=null,Q=null,ot=null;if(j.forEach((X,ct)=>{let rt=I(X.textContent),st=!!X.querySelector("a");if(!J&&S(rt)&&(ct===0||j.length>=2)){J=X;return}if(!ot&&(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(rt)||/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(rt)||/text-align\s*:\s*right/i.test(X.getAttribute("style")||"")||ct===j.length-1&&rt.length<=28&&/\d{4}/.test(rt))&&/\d{4}/.test(rt)&&rt.length<=32){ot=X;return}!Q&&(st||rt.length>4)&&(Q=X)}),Q||(Q=j.find(X=>X!==J&&X!==ot)||j[0]),!ot&&j.length>=2){let X=j[j.length-1];X!==Q&&X!==J&&(ot=X)}if(T.classList.add("urppp-notice-row"),k(T),T.removeAttribute("width"),T.style.setProperty("flex-wrap","nowrap","important"),j.forEach(X=>{X.removeAttribute("width"),X.removeAttribute("height"),X.removeAttribute("align"),X.style.setProperty("border","none","important"),X.style.setProperty("background","transparent","important"),X.style.setProperty("vertical-align","middle","important"),X.style.removeProperty("width"),X.style.setProperty("width","auto","important")}),J&&(J.classList.add("urppp-notice-bullet-cell"),J.style.setProperty("display","none","important"),J.style.setProperty("width","0","important"),J.style.setProperty("padding","0","important")),Q){Q.classList.add("urppp-notice-title-cell"),Q.removeAttribute("width"),Q.style.setProperty("width","auto","important"),Q.style.setProperty("max-width","100%","important"),Q.style.setProperty("min-width","0","important"),Q.style.setProperty("flex","1 1 0%","important"),Q.style.setProperty("overflow","hidden","important"),Q.style.setProperty("padding","0","important"),Q.style.setProperty("pointer-events","auto","important"),Q.style.setProperty("white-space","nowrap","important");let X=Q.querySelector("a[href], a[onclick], a");if(X||(X=T.querySelector("a[href], a[onclick], a")),X){Q.contains(X)||(Q.innerHTML="",Q.appendChild(X)),X.classList.add("urppp-notice-link");let ct=X.getAttribute("href"),rt=X.getAttribute("onclick"),st=X.getAttribute("target"),xt=I(X.textContent);X.textContent=xt,ct!=null&&X.setAttribute("href",ct),rt!=null&&X.setAttribute("onclick",rt),st!=null&&X.setAttribute("target",st),X.style.setProperty("color","var(--text)","important"),X.style.setProperty("text-decoration","none","important"),X.style.setProperty("font-size","14px","important"),X.style.setProperty("font-weight","500","important"),X.style.setProperty("line-height","1.5","important"),X.style.setProperty("pointer-events","auto","important"),X.style.setProperty("cursor","pointer","important"),X.style.setProperty("position","relative","important"),X.style.setProperty("z-index","2","important"),X.style.setProperty("display","block","important"),X.style.setProperty("white-space","nowrap","important"),X.style.setProperty("overflow","hidden","important"),X.style.setProperty("text-overflow","ellipsis","important"),T.dataset.urpppNoticeClickBound!=="1"&&(T.dataset.urpppNoticeClickBound="1",T.style.setProperty("cursor","pointer","important"),T.addEventListener("click",Z=>{if(Z.target&&Z.target.closest&&Z.target.closest("a,button,input,select,textarea,label"))return;if(X.getAttribute("onclick")){X.click();return}let dt=X.getAttribute("href");if(!dt||dt==="#"||dt.indexOf("javascript:")===0){X.click();return}X.target==="_blank"?v.open(dt,"_blank"):v.location.href=dt}))}else{let ct=I(Q.textContent);ct&&!Q.querySelector("button, input, select")&&(!Q.querySelector("*")||Q.children.length===0)&&(Q.textContent=ct)}}if(ot){ot.classList.add("urppp-notice-date-cell"),ot.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-end !important","flex:0 0 auto !important","width:auto !important","max-width:none !important","white-space:nowrap !important","text-align:right !important","padding:0 !important","margin:0 0 0 auto !important","border:none !important","background:transparent !important","float:none !important","position:static !important","right:auto !important","left:auto !important","top:auto !important"].join(";");let X=I(ot.textContent);ot.innerHTML="";let ct=g.createElement("span");ct.className="urppp-notice-time",ct.textContent=X,ot.appendChild(ct)}Q&&(Q.style.setProperty("flex","1 1 auto","important"),Q.style.setProperty("min-width","0","important"),Q.style.setProperty("margin","0","important"),Q.style.setProperty("float","none","important"),Q.style.setProperty("position","static","important")),T.style.setProperty("display","flex","important"),T.style.setProperty("align-items","center","important"),T.style.setProperty("justify-content","space-between","important"),T.style.setProperty("gap","16px","important"),T.style.setProperty("max-width","100%","important"),T.style.setProperty("box-sizing","border-box","important"),T.style.setProperty("overflow","hidden","important"),T.dataset.urpppNoticeDone="1";return}let H=j[0],G=Array.from(H.querySelectorAll(":scope > span"));if(G.length<2){let J=H.querySelector("a"),Q=I(H.textContent),ot=Q.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);if(J||ot){T.classList.add("urppp-notice-row");let X=g.createElement("div");X.className="urppp-notice-card urppp-notice-card-row";let ct=g.createElement("div");if(ct.className="urppp-notice-main",J){J.classList.add("urppp-notice-link");let rt=J.getAttribute("href"),st=J.getAttribute("onclick"),xt=I(J.textContent);J.textContent=xt,rt!=null&&J.setAttribute("href",rt),st!=null&&J.setAttribute("onclick",st),J.style.setProperty("pointer-events","auto","important"),J.style.setProperty("cursor","pointer","important"),ct.appendChild(J),T.dataset.urpppNoticeClickBound!=="1"&&(T.dataset.urpppNoticeClickBound="1",T.style.setProperty("cursor","pointer","important"),T.addEventListener("click",Z=>{if(!(Z.target&&Z.target.closest&&Z.target.closest("a,button,input,select"))){if(J.getAttribute("onclick")||!J.getAttribute("href")||J.getAttribute("href")==="#"){J.click();return}v.location.href=J.getAttribute("href")}}))}else{let rt=g.createElement("div");rt.className="urppp-notice-title",rt.textContent=ot?Q.replace(ot[0],"").trim():Q,ct.appendChild(rt)}if(X.appendChild(ct),ot){let rt=g.createElement("div");rt.className="urppp-notice-meta";let st=g.createElement("span");st.className="urppp-notice-time",st.textContent=ot[1],rt.appendChild(st),X.appendChild(rt)}H.innerHTML="",H.appendChild(X),H.dataset.urpppNoticeDone="1",T.dataset.urpppNoticeDone="1"}return}let U=null,et=null,it=[];if(G.forEach(J=>{let Q=(J.getAttribute("style")||"")+" "+(J.style.cssText||""),ot=I(J.textContent);if(ot){if(/font-size\s*:\s*18/i.test(Q)||!U&&/font-size\s*:\s*1[6-9]/i.test(Q)){U=J;return}if(/font-size\s*:\s*12/i.test(Q)||/float\s*:\s*right/i.test(Q)||/^\d{4}-\d{2}-\d{2}/.test(ot)){et=J;return}it.push(J)}}),U||(U=G[0]),!et){let J=G[G.length-1];J!==U&&(et=J)}let bt=g.createElement("div");if(bt.className="urppp-notice-card",U){let J=g.createElement("div");J.className="urppp-notice-title",J.textContent=I(U.textContent),bt.appendChild(J)}if((it.length?it:G.filter(J=>J!==U&&J!==et)).forEach(J=>{let Q=g.createElement("div");Q.className="urppp-notice-body",Q.textContent=I(J.textContent),Q.textContent&&bt.appendChild(Q)}),et){let J=g.createElement("div");J.className="urppp-notice-meta";let Q=g.createElement("span");Q.className="urppp-notice-time",Q.textContent=I(et.textContent),J.appendChild(Q),bt.appendChild(J)}H.innerHTML="",H.appendChild(bt),H.dataset.urpppNoticeDone="1",T.dataset.urpppNoticeDone="1",T.classList.add("urppp-notice-row")})})}catch(f){q.warn("[URP++] notice table beautify failed",f)}}return a(C,"beautifyNoticeTables"),{beautifyNoticeTables:C}}a(ui,"createNoticeTableBeautifier");var mi={"page-content-template":"urppp-pdf-page",mycoursetable:"urppp-pdf-mycoursetable",courseTable:"urppp-pdf-courseTable",courseTableBody:"urppp-pdf-courseTableBody",h4_id1:"urppp-pdf-h4-1",h4_id2:"urppp-pdf-h4-2",infoTable:"urppp-pdf-info-table","rwskxxbg-course":"urppp-pdf-rwskxxbg","other-course":"urppp-pdf-other-course",temp_title:"urppp-pdf-temp-title",temp_subtitle:"urppp-pdf-temp-subtitle"};function td(n){return n.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach(p=>p.remove()),[n,...n.querySelectorAll("*")].forEach(p=>{Array.from(p.classList||[]).forEach(c=>{/^urppp(?:-|$)/.test(c)&&p.classList.remove(c)}),Array.from(p.attributes||[]).forEach(c=>{/^data-urppp(?:-|$)/.test(c.name)&&p.removeAttribute(c.name)}),p.style&&Array.from(p.style).forEach(c=>{p.style.getPropertyPriority(c)==="important"&&p.style.removeProperty(c)})}),n}a(td,"sanitizeNativePdfClone");function ed(n){return[n,...n.querySelectorAll("*")].forEach(p=>{p.id&&mi[p.id]&&(p.id=mi[p.id]),p.classList.contains("class_div")&&(p.classList.remove("class_div"),p.classList.remove("box_font"),p.classList.add("urppp-pdf-card")),p.classList.contains("course")&&(p.classList.remove("course"),p.classList.add("urppp-pdf-course"))}),n}a(ed,"renameNativePdfClone");function rd(){let n=[];document.querySelectorAll('style[id^="urppp-"]').forEach(d=>{d.sheet&&!d.sheet.disabled&&(n.push(d),d.sheet.disabled=!0)});let p=0,c=document.getElementById("mycoursetable");return c&&(p=c.getBoundingClientRect().width),n.forEach(d=>{d.sheet.disabled=!1}),p}a(rd,"measureNativeScheduleWidth");var ad=`
  #urppp-pdf-stage table.table,
  #urppp-pdf-stage table.table-bordered,
  #urppp-pdf-stage table.table-striped,
  #urppp-pdf-stage table.table-hover {
    background: #ffffff !important;
    border: none !important;
    box-shadow: none !important;
    color: #000000 !important;
  }
  #urppp-pdf-stage .table > thead > tr > th,
  #urppp-pdf-stage .table-bordered > thead > tr > th,
  #urppp-pdf-stage .table-striped > thead > tr > th,
  #urppp-pdf-stage .table-hover > thead > tr > th {
    background: #dddddd !important;
    background-color: #dddddd !important;
    color: #000000 !important;
    font-weight: normal !important;
    white-space: normal !important;
    border: 1px solid #dddddd !important;
  }
  #urppp-pdf-stage .table > tbody > tr > td,
  #urppp-pdf-stage .table > tbody > tr > th,
  #urppp-pdf-stage .table-bordered > tbody > tr > td,
  #urppp-pdf-stage .table-bordered > tbody > tr > th,
  #urppp-pdf-stage .table-striped > tbody > tr > td,
  #urppp-pdf-stage .table-striped > tbody > tr > th,
  #urppp-pdf-stage .table-hover > tbody > tr > td,
  #urppp-pdf-stage .table-hover > tbody > tr > th {
    background: transparent !important;
    background-color: transparent !important;
    color: #000000 !important;
    border: 1px solid #dddddd !important;
  }
  #urppp-pdf-stage .table-striped > tbody > tr:nth-of-type(odd) > td,
  #urppp-pdf-stage .table-striped > tbody > tr:nth-of-type(odd) > th {
    background: transparent !important;
    background-color: transparent !important;
  }
`;function od(n){n.querySelectorAll("td, th").forEach(p=>{p.style.removeProperty("background"),p.style.removeProperty("background-color")}),n.querySelectorAll("th[rowspan]").forEach(p=>{p.style.removeProperty("width"),p.style.setProperty("white-space","nowrap"),p.style.setProperty("text-align","center")}),n.querySelectorAll("table").forEach(p=>{p.style.setProperty("background","#ffffff","important"),p.style.setProperty("background-color","#ffffff","important"),p.style.setProperty("border","none","important"),p.style.setProperty("color","#000000","important")}),n.querySelectorAll("th").forEach(p=>{if(p.style.setProperty("color","#000000","important"),p.style.setProperty("border","1px solid #dddddd","important"),p.style.setProperty("font-weight","normal","important"),p.childNodes.length===1&&p.firstChild&&p.firstChild.nodeType===3){let c=document.createElement("span");c.textContent=p.textContent,p.textContent="",p.appendChild(c)}}),n.querySelectorAll("thead th").forEach(p=>{p.style.setProperty("background","#dddddd","important"),p.style.setProperty("background-color","#dddddd","important")}),n.querySelectorAll("tbody th").forEach(p=>{p.style.setProperty("background","transparent","important"),p.style.setProperty("background-color","transparent","important")}),n.querySelectorAll("td").forEach(p=>{p.style.setProperty("background","transparent","important"),p.style.setProperty("background-color","transparent","important"),p.style.setProperty("color","#000000","important"),p.style.setProperty("border","1px solid #dddddd","important")})}a(od,"normalizeNativePdfStage");function bi(n){let p=rd(),c=document.createElement("div");c.id="urppp-pdf-stage",c.style.cssText="position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:"+(p||window.innerWidth||1440)+"px;";let d=document.createElement("div");d.id="urppp-pdf-page",d.style.cssText="position:relative;width:100%;box-sizing:border-box;";let u=n.cloneNode(!0);td(u),ed(u),d.appendChild(u),c.appendChild(d),od(u);let k=document.createElement("style");k.id="urppp-pdf-reset-style",k.textContent=ad,document.head.appendChild(k),document.body.appendChild(c);let P=c.querySelector("#urppp-pdf-mycoursetable"),A=c.querySelector("#urppp-pdf-page")||c;if(!P)throw c.remove(),new Error("无法建立原生课表捕获节点");return{stage:c,target:P,page:A,sourceHost:n}}a(bi,"cloneNativePdfStage");var ha=0;function fe(){return ha>0}a(fe,"isNativePdfIsolationActive");function nd(n){return!n||n.tagName!=="STYLE"?!1:/^urppp(?:-|$)/.test(n.id||"")||n.hasAttribute("data-urppp-style")?!0:(n.textContent||"").includes("urppp-")}a(nd,"isUrpppOwnedStyle");function hi(){try{if(typeof unsafeWindow<"u"&&unsafeWindow)return unsafeWindow}catch{}return typeof window<"u"?window:null}a(hi,"defaultPage");function fi(n,p){let c=n&&typeof n.requestAnimationFrame=="function"?n.requestAnimationFrame.bind(n):typeof requestAnimationFrame=="function"?requestAnimationFrame:null;return c?c(p):setTimeout(p,0)}a(fi,"scheduleFrame");function pd(n={}){let p=n.document||(typeof document<"u"?document:null),c=n.page||hi();if(!p)throw new Error("原生 PDF 隔离缺少 document");let d=p.getElementById("mycoursetable");if(!d)throw new Error("当前页面没有课表节点");ha+=1;let u=[d,...d.querySelectorAll("*")],k=[],P=p.getElementById("soliderbox");P&&k.push(P);let A=d.parentElement;for(;A&&A!==p.documentElement;){let x=A.classList;(A.id==="page-content-template"||x&&(x.contains("page-content")||x.contains("profile-info-row")||x.contains("profile-info-value")))&&k.push(A),A=A.parentElement}let y=p.getElementById("page-content-template")||p.querySelector(".page-content");y&&!k.includes(y)&&k.push(y);let S=[...u,...k],g=S.map(x=>({element:x,style:x.getAttribute("style")})),v=Array.from(p.querySelectorAll("style")).filter(nd).map(x=>({style:x,disabled:x.sheet?x.sheet.disabled:!1,media:x.getAttribute("media")})),q=Array.from(d.querySelectorAll('[id^="urppp-"], [data-urppp]')),C=c&&c.divBuild,f=c&&c.__urpppOriginalDivBuild,h=!1,w=a(()=>{h||(h=!0,c&&c.divBuild===f&&typeof C=="function"&&(c.divBuild=C),g.forEach(({element:x,style:E})=>{x.isConnected&&(E===null?x.removeAttribute("style"):x.setAttribute("style",E))}),q.forEach(x=>x.removeAttribute("data-urppp-pdf-hidden")),v.forEach(({style:x,disabled:E,media:L})=>{try{L===null?x.removeAttribute("media"):x.setAttribute("media",L),x.sheet&&(x.sheet.disabled=E)}catch{}}),ha=Math.max(0,ha-1),fi(c,()=>{try{typeof n.onAfterRestore=="function"&&n.onAfterRestore()}catch{}}))},"restore");try{return v.forEach(({style:x})=>{try{x.setAttribute("media","not all"),x.sheet&&(x.sheet.disabled=!0)}catch{}}),S.forEach(x=>{!x.style||!x.style.length||Array.from(x.style).forEach(E=>{x.style.getPropertyPriority(E)==="important"&&(E==="height"&&x.matches("td, th")||x.style.removeProperty(E))})}),d.querySelectorAll("td").forEach(x=>{x.style.removeProperty("background"),x.style.removeProperty("background-color")}),y&&y.style.setProperty("position","relative","important"),d.style.setProperty("position","static","important"),d.querySelectorAll("td").forEach(x=>{x.style.setProperty("position","static","important")}),q.forEach(x=>{x.setAttribute("data-urppp-pdf-hidden","1"),x.style.setProperty("display","none","important")}),c&&typeof f=="function"&&(c.divBuild=f),w}catch(x){throw w(),x}}a(pd,"isolateScheduleForNativeExport");function gi(n,p={}){return new Promise((c,d)=>{let u=p.page||hi(),k=u&&u.back,P=u&&u.html2canvas;if(!n||typeof k!="function"){d(new Error("教务原生导出依赖未就绪"));return}let A=null;try{A=pd(p)}catch(f){d(f);return}let y=0,S=!1,g=null,v=null,q=a(f=>{if(!S){S=!0,y&&clearTimeout(y),u&&g&&u.back===g&&(u.back=k),v&&u.html2canvas===v&&(u.html2canvas=P);try{A&&A()}catch{}f?d(f):c()}},"settle"),C=a(f=>q(f instanceof Error?f:new Error(String(f))),"fail");typeof P=="function"&&(v=a(function(){let f=P.apply(this,arguments);return f&&typeof f.catch=="function"&&f.catch(C),f},"scopedCanvas"),u.html2canvas=v),g=a(function(){try{return k.apply(this,arguments)}finally{setTimeout(()=>q(),0)}},"wrappedBack"),u.back=g,y=setTimeout(()=>{try{k.call(u)}catch{}C(new Error("原生 PDF 生成超时"))},p.timeoutMs||60*1e3),fi(u,()=>{try{n.click()}catch(f){C(f)}})})}a(gi,"exportNativePdfIsolated");var xi=`.urppp-private-value{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;font-style:inherit!important;line-height:inherit!important;letter-spacing:0!important;color:inherit!important}
.urppp-private-text{position:relative!important;font-size:0!important;text-shadow:none!important;user-select:none!important;pointer-events:none!important;min-height:1em}
.urppp-private-text>*{visibility:hidden!important}
.urppp-private-text::after{content:attr(data-urppp-private-mask)!important;visibility:visible!important;display:inline!important;color:inherit!important;font-family:inherit!important;font-size:var(--urppp-private-font-size,12px)!important;font-weight:inherit!important;font-style:inherit!important;font-stretch:inherit!important;line-height:inherit!important;font-variant-numeric:inherit!important;letter-spacing:0!important;text-transform:inherit!important;white-space:nowrap!important}
.urppp-direct-editable{pointer-events:auto!important;cursor:text!important;user-select:none!important;text-decoration-line:underline!important;text-decoration-style:dotted!important;text-decoration-color:color-mix(in srgb,var(--primary,#b53434) 52%,transparent)!important;text-underline-offset:3px!important}
.urppp-private-text.urppp-direct-editable::after{text-decoration-line:underline!important;text-decoration-style:dotted!important;text-decoration-color:color-mix(in srgb,var(--primary,#b53434) 52%,transparent)!important;text-underline-offset:3px!important}
.urppp-direct-editable:focus-visible{outline:2px solid color-mix(in srgb,var(--primary,#b53434) 52%,transparent)!important;outline-offset:3px!important}
.urppp-direct-edit-input{position:fixed!important;z-index:14500!important;width:var(--urppp-direct-edit-width,140px)!important;height:36px!important;min-width:110px!important;max-width:calc(100vw - 24px)!important;margin:0!important;padding:0 10px!important;box-sizing:border-box!important;border:1px solid var(--primary,#b53434)!important;border-radius:8px!important;background:var(--surface,#fff)!important;color:var(--text,#1d1d1f)!important;box-shadow:0 10px 28px rgba(15,23,42,.18)!important;outline:0!important;letter-spacing:0!important}
html[data-urppp-skin="flat"] .urppp-direct-edit-input,html[data-urppp-skin="brutal"] .urppp-direct-edit-input,html[data-urppp-skin="editorial"] .urppp-direct-edit-input{border-radius:0!important}
.urppp-private-avatar{visibility:hidden!important}
.urppp-private-avatar-host{position:relative!important}
.urppp-private-avatar-host::after{content:attr(data-urppp-private-mask)!important;position:absolute!important;inset:auto!important;left:var(--urppp-avatar-left,0)!important;top:var(--urppp-avatar-top,0)!important;width:var(--urppp-avatar-width,40px)!important;height:var(--urppp-avatar-height,40px)!important;display:flex!important;align-items:center!important;justify-content:center!important;color:var(--text-muted,#7c8491)!important;background:var(--input-bg,#eef1f5)!important;border-radius:var(--urppp-avatar-radius,50%)!important;font:700 8px/1 sans-serif!important;letter-spacing:0!important;white-space:nowrap!important;overflow:hidden!important;z-index:4!important;pointer-events:none!important}
#urppp-clean-root .uc-avatar.urppp-private-avatar-host::after,.profile-picture.urppp-private-avatar-host::after{font-size:12px!important}
.urppp-private-avatar-block{position:relative!important;overflow:hidden!important;background:var(--input-bg,#eef1f5)!important}
.urppp-private-avatar-block>*{visibility:hidden!important}
.urppp-private-avatar-block::after{content:attr(data-urppp-private-mask)!important;position:absolute!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;color:var(--text-muted,#7c8491)!important;background:var(--input-bg,#eef1f5)!important;font:700 12px/1 sans-serif!important;letter-spacing:0!important;z-index:4!important}
.urppp-private-block{position:relative!important;isolation:isolate!important;min-height:84px!important;overflow:hidden!important}
.urppp-private-block>*{visibility:hidden!important}
.urppp-private-block::after{content:attr(data-urppp-private-mask)!important;position:absolute!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;color:var(--text-muted,#7c8491)!important;background:var(--input-bg,#eef1f5)!important;border:1px solid var(--border,#dfe3e8)!important;border-radius:inherit!important;font:650 13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif!important;letter-spacing:0!important;z-index:8!important;pointer-events:none!important}
#urppp-clean-root .uc-hd-title{display:inline-flex!important;align-items:center!important;min-width:0!important}
#urppp-feature-toast{position:fixed!important;left:50%!important;top:22px!important;z-index:14200!important;max-width:min(420px,calc(100vw - 32px))!important;padding:9px 14px!important;border:1px solid var(--border,#dfe3e8)!important;border-radius:9px!important;background:var(--surface,#fff)!important;color:var(--text,#1d1d1f)!important;box-shadow:0 12px 30px rgba(15,23,42,.16)!important;font:600 12px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif!important;opacity:0!important;transform:translate(-50%,-10px)!important;transition:opacity .2s ease,transform .2s ease!important;pointer-events:none!important}
#urppp-feature-toast.open{opacity:1!important;transform:translate(-50%,0)!important}
#urppp-feature-toast.error{border-color:#FCA5A5!important;color:#B91C1C!important;background:#FEF2F2!important}
`;var yi=`      /* 全局 */
      html, body { background: var(--bg) !important; color: var(--text) !important; }
      a, a:link, a:visited { color: var(--primary) !important; }
      a:hover, a:focus { color: var(--primary-hover) !important; }
      h1, h2, h3, h4, h5, h6, .page-header { color: var(--text) !important; border-color: var(--border) !important; }
      hr { border-color: var(--border) !important; }
      .text-muted, .muted, .help-block { color: var(--text-muted) !important; }

      /*
       * 简约白 / 深邃暗：主文案强制黑/白体系
       * 数字、标题、侧栏、面包屑不再吃 primary
       * 链接仍保留 primary
       */
      /* 标题图标点缀可保留 primary；标题文字本体必须是 text */
      html.urppp-theme-default .widget-header .widget-title,
      html.urppp-theme-dark .widget-header .widget-title {
        color: var(--text) !important;
      }



      /* 全局过渡和滚动条 */
      ::selection { background: var(--primary); color: #fff; }
      html { scroll-behavior: smooth; }
      :focus-visible { outline: 2px solid var(--primary) !important; outline-offset: 2px; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

      /* 主内容区 */
      .main-container, .main-container::before { background: var(--bg) !important; }
      .main-content, .page-content { background: var(--bg) !important; }
      /* 内容区：明显加大左右留白，高优先级覆盖 ACE */
      .main-content .page-content,
      #page-content-template.page-content,
      div.page-content {
        padding: 16px 64px 40px !important;
        box-sizing: border-box !important;
        max-width: 1600px !important;
        margin-left: auto !important;
        margin-right: auto !important;
      }
      .breadcrumbs, #breadcrumbs {
        max-width: 1600px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        box-sizing: border-box !important;
      }
      .main-content .page-content > .row,
      #page-content-template > .row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .main-content .page-content > .row > [class*="col-"],
      .main-content .page-content [class*="col-xs-"],
      .main-content .page-content [class*="col-sm-"],
      .main-content .page-content [class*="col-md-"],
      .main-content .page-content [class*="col-lg-"],
      .main-content .page-content .self-margin,
      #page-content-template .self-margin {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      #left_layout, .page-content .widget, .page-content form {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      /* 学籍双栏：保留 col-xs-4 / col-xs-8 结构，只清外侧 gutter 并在中间留缝 */
      /* 学籍双栏父级常不是 .row：补 clearfix，保持左右并排且不塌陷 */
      .page-content .col-xs-4,
      .page-content .col-sm-4 {
        float: left !important;
        width: 33.33333333% !important;
      }
      .page-content .col-xs-8,
      .page-content .col-sm-8 {
        float: left !important;
        width: 66.66666667% !important;
      }
      .page-content .col-xs-4::after,
      .page-content .col-xs-8::after { display: none !important; }
      /* 包住 float 的父级 */
      .page-content form #left_layout > div > div:has(> .col-xs-4),
      .page-content div:has(> .col-xs-4):has(> .col-xs-8) {
        display: block !important;
        width: 100% !important;
        overflow: hidden !important; /* clearfix */
      }
      .page-content .row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      .page-content .col-xs-4,
      .page-content .col-sm-4,
      .page-content .col-md-4 {
        padding-left: 0 !important;
        padding-right: 16px !important;
        box-sizing: border-box !important;
      }
      .page-content .col-xs-8,
      .page-content .col-sm-8,
      .page-content .col-md-8 {
        padding-left: 0 !important;
        padding-right: 0 !important;
        box-sizing: border-box !important;
      }
      .page-content .col-xs-12,
      .page-content .col-sm-12,
      .page-content .col-md-12 {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      /* 列内标题/卡片自然 100%，不再 DOM 提升 */
      .page-content .col-xs-4 > .header,
      .page-content .col-xs-8 > .header,
      .page-content .col-xs-4 > h4.header,
      .page-content .col-xs-8 > h4.header {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        box-sizing: border-box !important;
      }
      /*
       * 学籍信息页：col 内 h4.header + setLabelWidth 信息卡
       * 标题不做第二张圆角卡，只保留信息卡一张壳，避免套娃
       */
      .page-content .col-xs-4 > h4.header,
      .page-content .col-xs-8 > h4.header,
      .page-content .col-xs-4 > .header.smaller,
      .page-content .col-xs-8 > .header.smaller,
      .page-content .col-sm-4 > h4.header,
      .page-content .col-sm-8 > h4.header,
      .page-content .col-md-4 > h4.header,
      .page-content .col-md-8 > h4.header {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 2px 2px 10px !important;
        margin: 0 0 8px !important;
        min-height: 0 !important;
      }
      /* 学籍信息卡：唯一外壳，无内边距（与个人信息信息表一致，避免套娃感） */
      html body .page-content .profile-user-info.setLabelWidth,
      html body .page-content .profile-user-info-striped.setLabelWidth,
      html body .page-content .self.profile-user-info.setLabelWidth {
        background: var(--surface) !important;
        border: var(--urppp-card-border, none) !important;
        border-radius: var(--radius) !important;
        box-shadow: var(--shadow) !important;
        overflow: hidden !important;
        margin: 0 0 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        box-sizing: border-box !important;
      }
      /* 压过查询卡 .self:has(...) { padding:14px } */
      html body .page-content .profile-user-info.setLabelWidth.urppp-query-form,
      html body .page-content .profile-user-info.setLabelWidth:has(.urppp-query-pair),
      html body .page-content .profile-user-info.setLabelWidth:has(.chosen-container) {
        padding: 0 !important;
        overflow: hidden !important;
      }
      .main-content .page-content .tabbable,
      .page-content .tabbable {
        margin-left: 0 !important;
        margin-right: 0 !important;
        margin-bottom: 16px !important;
        padding: 0 !important;
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .main-content .tabbable .tab-content,
      .tabbable > .tab-content,
      .page-content .tab-content {
        padding: 0 !important;
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      /*
       * 站点滚动分页容器（kctd_scroll 等）：
       * urp.fixedheader + pageSize 带 _sl 时滚到底加载下一页。
       * 必须保留 overflow:auto / max-height，禁止被 .widget-box 改成 overflow:visible。
       */
      .main-content #code_scroll,
      .page-content [id$="_scroll"],
      #kctd_scroll,
      #page_scroll,
      div[id$="_scroll"].widget-box,
      div[id$="_scroll"].widget-content {
        box-sizing: border-box !important;
        overflow: auto !important;
        /* max-height 交给站点 inline / fixedheader，不要覆盖 */
        width: 100% !important;
        max-width: 100% !important;
        position: relative !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        background: var(--surface) !important;
      }

      /* 页面区块标题：全宽条，与内容左右对齐，下边距拉开 */
      h4.header, h3.header, h5.header, .header.smaller, .header.lighter, .page-header {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-bottom: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        color: var(--text) !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        margin: 8px 0 18px !important;
        padding: 12px 18px !important;
        min-height: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        position: relative !important;
        clear: both !important;
        float: none !important;
      }
      /* 标题后的第一个内容块拉开间距 */
      h4.header + *,
      h3.header + *,
      h5.header + *,
      .header.smaller + *,
      .page-header + * {
        margin-top: 4px !important;
      }
      h4.header + .space, h4.header + .hr, h4.header + .space-6, h4.header + .space-10,
      h3.header + .space, .header.smaller + .space {
        display: none !important;
      }
      h4.header::before, h3.header::before, .header.smaller::before {
        content: '' !important;
        display: inline-block !important;
        width: 3px !important;
        height: 16px !important;
        border-radius: 2px !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      h4.header::after, h3.header::after, .header.smaller::after {
        content: none !important;
        display: none !important;
      }
      /* 旧 header 图标隐藏；widget-title 保留并做成主题小标 */
      h4.header > .glyphicon,
      h4.header > .fa,
      h4.header > .ace-icon,
      h3.header > .glyphicon,
      h3.header > .fa,
      .header.smaller > .glyphicon,
      .header.smaller > .fa {
        display: none !important;
      }

      h4.header .right_top_oper,
      .header .right_top_oper {
        margin-left: auto !important;
        margin-right: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 8px !important;
        float: none !important;
        position: static !important;
        top: auto !important;
        right: auto !important;
        height: auto !important;
        line-height: 1 !important;
      }
      h4.header > .btn,
      h4.header > a.btn,
      h3.header > .btn,
      .header.smaller > .btn,
      h4.header .right_top_oper > .btn,
      h4.header .right_top_oper > a,
      .header .right_top_oper > .btn,
      .header .right_top_oper > a {
        margin: 0 0 0 auto !important;
        float: none !important;
        position: static !important;
        top: auto !important;
        right: auto !important;
        vertical-align: middle !important;
        align-self: center !important;
      }
      /* 标题旁操作按钮略放大，保证垂直居中 */
      h4.header .btn,
      h3.header .btn,
      .header.smaller .btn,
      h4.header .right_top_oper .btn,
      .header .right_top_oper .btn {
        font-size: 12px !important;
        padding: 0 12px !important;
        line-height: 1 !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        border-radius: var(--radius-sm) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
      }
      h4.header.grey, .header.lighter.grey, .header.smaller.lighter {
        color: var(--text) !important;
      }

      /*
       * 学籍双栏标题去卡壳（必须写在全局 h4.header 卡片规则之后，才能压过）
       * 结构：.col-xs-8 > h4.header + div > .setLabelWidth
       */
      html body .page-content .col-xs-4 > h4.header,
      html body .page-content .col-xs-8 > h4.header,
      html body .page-content .col-sm-4 > h4.header,
      html body .page-content .col-sm-8 > h4.header,
      html body .page-content .col-md-4 > h4.header,
      html body .page-content .col-md-8 > h4.header,
      html body .page-content .col-xs-4 > h4.header.smaller,
      html body .page-content .col-xs-8 > h4.header.smaller,
      html body .page-content .col-xs-4 > h4.header.smaller.lighter.grey,
      html body .page-content .col-xs-8 > h4.header.smaller.lighter.grey,
      html body .page-content .col-xs-4 > .header.smaller,
      html body .page-content .col-xs-8 > .header.smaller,
      html body #page-content-template .col-xs-4 > h4.header,
      html body #page-content-template .col-xs-8 > h4.header {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border: none !important;
        border-width: 0 !important;
        border-color: transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 4px 2px 10px !important;
        margin: 0 0 8px !important;
        min-height: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      html body .page-content .col-xs-4 > h4.header::before,
      html body .page-content .col-xs-8 > h4.header::before,
      html body .page-content .col-xs-4 > h4.header.smaller.lighter.grey::before,
      html body .page-content .col-xs-8 > h4.header.smaller.lighter.grey::before {
        /* 保留主色小竖条，但不做卡片 */
        content: '' !important;
        display: inline-block !important;
        width: 3px !important;
        height: 16px !important;
        border-radius: 2px !important;
        background: var(--primary) !important;
      }
      /* 卡片 / 面板 */
      .widget-box:not(#curriculumInfo-divcon):not(#curriculumInfo-divcon1):not(#curriculumInfo-divcon2):not(#calssInfo-divcon):not(#classroomInfo-divcon):not(#billContainer):not([id$="_scroll"]),
      .widget-box.transparent:not(#curriculumInfo-divcon):not(#curriculumInfo-divcon1):not(#curriculumInfo-divcon2):not(#calssInfo-divcon):not(#classroomInfo-divcon):not(#billContainer):not([id$="_scroll"]),
      .panel,
      .panel-default,
      .panel-primary,
      .panel-info,
      .well,
      .thumbnail,
      .infobox,
      .profile-user-info,
      .profile-user-info-striped,
      .dd,
      fieldset {
        background: var(--surface) !important;
        border: var(--urppp-card-border, none) !important;
        border-radius: var(--radius) !important;
        box-shadow: var(--shadow) !important;
        overflow: hidden !important;
      }
      .widget-box:not(#curriculumInfo-divcon):not(#curriculumInfo-divcon1):not(#curriculumInfo-divcon2):not(#calssInfo-divcon):not(#classroomInfo-divcon):not(#billContainer):not([id$="_scroll"]) {
        margin-bottom: 18px !important;
      }
      .widget-header,
      .panel-heading {
        background: transparent !important;
        border-bottom: 1px solid var(--border) !important;
        color: var(--text) !important;
        padding: 12px 16px !important;
        border-radius: 0 !important;
        display: flex !important;
        align-items: center !important;
        min-height: 48px !important;
      }
      /* widget-title 只做标题排版，不套整页 header 大卡片样式 */
      .widget-header .widget-title,
      h4.widget-title,
      h3.widget-title,
      .widget-title {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
        width: auto !important;
        max-width: 100% !important;
        min-height: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        float: none !important;
        clear: none !important;
        color: var(--text) !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
      }
      .widget-header .widget-title::before,
      h4.widget-title::before,
      .widget-title::before {
        content: none !important;
        display: none !important;
      }
      .widget-header .widget-title > .glyphicon,
      .widget-header .widget-title > .fa,
      .widget-header .widget-title > .ace-icon,
      h4.widget-title > .glyphicon,
      h4.widget-title > .fa,
      h4.widget-title > .ace-icon,
      .widget-title > .glyphicon,
      .widget-title > .fa,
      .widget-title > .ace-icon {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 26px !important;
        height: 26px !important;
        margin: 0 !important;
        border-radius: var(--radius-sm) !important;
        background: var(--input-bg) !important;
        color: var(--primary) !important;
        font-size: 13px !important;
        line-height: 1 !important;
        flex: 0 0 26px !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .widget-header .widget-title > img,
      h4.widget-title > img,
      .widget-title > img {
        display: inline-block !important;
        width: 16px !important;
        height: 16px !important;
        margin: 0 !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .widget-body,
      .panel-body {
        background: var(--surface) !important;
        color: var(--text) !important;
        padding: 16px 18px !important;
      }
      .well {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        border-radius: var(--radius) !important;
        padding: 16px 18px !important;
        margin-bottom: 18px !important;
        box-shadow: none !important;
      }
      /* 统计卡片 infobox：统一表面色与可读性；仅容器内才做网格 */
      /* infobox-container grid defined below */

      /* 所有 infobox 统一尺寸（上下卡片一致） */
      .infobox {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        padding: 14px 16px !important;
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        height: 112px !important;
        min-height: 112px !important;
        max-height: 112px !important;
        margin: 0 12px 12px 0 !important;
        float: left !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        box-sizing: border-box !important;
        color: var(--text) !important;
        position: relative !important;
        overflow: hidden !important;
      }
      .infobox[style] {
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        height: 112px !important;
        min-height: 112px !important;
        max-height: 112px !important;
      }
      .infobox-container {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 0 16px !important;
      }
      .infobox-container > .infobox,
      .infobox-container > .infobox[style] {
        float: none !important;
        margin: 0 !important;
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        height: 112px !important;
        min-height: 112px !important;
        max-height: 112px !important;
        flex: 0 0 220px !important;
      }
      /* 下方课组统计卡也统一成同样尺寸 */
      .page-content .profile-user-info,
      .page-content .profile-user-info-striped {
        width: 220px !important;
        min-width: 220px !important;
        max-width: 220px !important;
        min-height: 112px !important;
        height: auto !important;
        margin: 0 12px 12px 0 !important;
        float: left !important;
        box-sizing: border-box !important;
      }
      /* 去掉 ACE 彩色底/渐变，避免白字/深色字不可读 */
      .infobox.infobox-dark,
      .infobox.infobox-green,
      .infobox.infobox-blue,
      .infobox.infobox-pink,
      .infobox.infobox-red,
      .infobox.infobox-orange,
      .infobox.infobox-purple,
      .infobox.infobox-grey,
      .infobox.infobox-black {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
      }
      .infobox:before,
      .infobox:after {
        display: none !important;
        content: none !important;
        background: none !important;
      }
      /* ACE 左侧色条图标区：改为小色点，避免占宽导致竖排 */
      .infobox > .infobox-icon {
        display: none !important;
      }
      .infobox-container > .infobox > .infobox-icon {
        display: none !important;
      }
      .infobox > .infobox-data {
        border: none !important;
        min-width: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        color: var(--text) !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      .infobox .infobox-data-number,
      .infobox .infobox-content {
        color: var(--text) !important;
        text-shadow: none !important;
      }
      .infobox .infobox-data-number {
        font-size: 22px !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;
        margin: 0 0 6px !important;
        display: block !important;
        color: var(--text) !important;
      }
      .infobox .infobox-content {
        font-size: 13px !important;
        font-weight: 500 !important;
        line-height: 1.35 !important;
        color: var(--text-secondary) !important;
        white-space: normal !important;
        word-break: break-word !important;
      }
      /* 进度条：主文字下方；适中粗细；0% 空轨道 */
      .infobox .infobox-data {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: flex-start !important;
        gap: 0 !important;
        width: 100% !important;
      }
      .infobox .urppp-pct-text {
        order: 1 !important;
        display: block !important;
        margin: 0 0 6px !important;
        font-size: 16px !important;
        font-weight: 700 !important;
        line-height: 1.2 !important;
        color: var(--text) !important;
      }
      .infobox .urppp-pct-bar {
        order: 2 !important;
        display: block !important;
        width: 100% !important;
        height: 8px !important;
        border-radius: 999px !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        margin: 0 0 8px !important;
        padding: 0 !important;
      }
      .infobox .infobox-data-number,
      .infobox .infobox-content,
      .infobox .infobox-text {
        order: 3 !important;
      }
      .infobox .urppp-pct-fill {
        display: block !important;
        height: 100% !important;
        border-radius: 999px !important;
        background: var(--primary) !important;
        opacity: 1 !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
      .infobox .urppp-pct-bar.is-empty .urppp-pct-fill { display: none !important; }
      /* 表格 progress：细条 + data-percent 伪元素居中（最稳） */
      .progress,
      .progress.pos-rel,
      div.progress {
        position: relative !important;
        border-radius: 999px !important;
        overflow: hidden !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        box-shadow: none !important;
        height: 16px !important;
        min-height: 16px !important;
        max-height: 16px !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 16px !important;
      }
      .progress .progress-bar,
      .progress > .progress-bar {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        height: 100% !important;
        border-radius: 999px !important;
        background: var(--primary) !important;
        box-shadow: none !important;
        font-size: 0 !important;
        color: transparent !important;
        text-indent: -9999px !important;
      }
      /* 隐藏原生 span 文字，改用伪元素，保证垂直水平都居中 */
      .progress > span,
      .progress .progress-bar + span {
        display: none !important;
      }
      .progress.pos-rel::after,
      .progress[data-percent]::after {
        content: attr(data-percent) !important;
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        z-index: 4 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin: 0 !important;
        padding: 0 !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        color: var(--text) !important;
        text-shadow: 0 0 0 transparent !important;
        pointer-events: none !important;
        white-space: nowrap !important;
        mix-blend-mode: difference !important;
      }
      .infobox .easy-pie-chart,
      .infobox .percentage,
      .infobox .infobox-progress,
      .infobox canvas {
        display: none !important;
      }
      .infobox-container::after,
      .page-content .infobox:last-of-type::after {
        content: '' !important;
        display: table !important;
        clear: both !important;
      }
      /* ========== 培养方案展示：zTree 安静可读 ========== */
      /* 保留全局 h4.header 卡片高度，只补布局 */
      #two .header.urppp-plan-header,
      .urppp-plan-header {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 8px 12px !important;
        min-height: 48px !important;
        margin: 8px 0 18px !important;
        padding: 12px 18px !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        background: var(--surface) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        line-height: 1.4 !important;
      }
      .urppp-plan-header > .glyphicon,
      .urppp-plan-header > .ace-icon {
        display: none !important; /* 与全局 header 一致，左侧用主色竖条 */
      }
      .urppp-plan-legend {
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 10px 14px !important;
        margin: 0 !important;
        color: var(--text-muted) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
      }
      .urppp-plan-legend .urppp-lg {
        display: inline-flex !important;
        align-items: center !important;
        gap: 5px !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        color: var(--text-muted) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        white-space: nowrap !important;
      }
      .urppp-plan-legend .urppp-lg i {
        font-size: 13px !important;
        margin: 0 !important;
        width: auto !important;
        height: auto !important;
        background: none !important;
      }
      .urppp-plan-legend .urppp-lg.done i,
      .urppp-plan-legend .urppp-lg.pass i { color: #16a34a !important; }
      .urppp-plan-legend .urppp-lg.todo i { color: var(--primary) !important; }
      .urppp-plan-legend .urppp-lg.fail i { color: #dc2626 !important; }
      .urppp-plan-legend .urppp-lg.pending i { color: var(--text-muted) !important; }
      .urppp-plan-header .right_top_oper {
        margin-left: auto !important;
        display: inline-flex !important;
        gap: 8px !important;
      }

      /* 树外壳：透明容器，不再用大卡片裁切圆角 */
      .urppp-plan-tree-shell,
      #two .row > div[style*="border"] {
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        overflow: visible !important;
        padding: 0 !important;
      }
      #tree_div,
      .urppp-plan-tree-shell #tree_div,
      .urppp-plan-tree-shell .widget-body {
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        overflow: visible !important;
      }

      /* zTree：每个顶级课组独立卡片 */
      .ztree.urppp-ztree,
      #treeDemo.ztree {
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        color: var(--text) !important;
      }
      .ztree.urppp-ztree li,
      #treeDemo.ztree li {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: flex-start !important;
        padding: 0 !important;
        margin: 0 !important;
        line-height: 1.25 !important;
        list-style: none !important;
      }
      .ztree.urppp-ztree li + li,
      #treeDemo.ztree li + li {
        margin-top: 0 !important;
      }
      /* 顶级课组卡片：底部更贴；展开钮与标题首行对齐 */
      .ztree.urppp-ztree > li,
      #treeDemo.ztree > li {
        display: grid !important;
        grid-template-columns: 16px 1fr !important;
        column-gap: 6px !important;
        row-gap: 0 !important;
        align-items: start !important;
        margin: 0 0 8px 0 !important;
        padding: 5px 10px 1px !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        background: var(--surface) !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        min-height: 0 !important;
        height: auto !important;
      }
      .ztree.urppp-ztree > li:last-child,
      #treeDemo.ztree > li:last-child {
        margin-bottom: 0 !important;
      }
      /* 展开钮：对齐标题第一行中心 */
      .ztree.urppp-ztree > li > span.button.switch,
      #treeDemo.ztree > li > span.button.switch {
        grid-column: 1 !important;
        grid-row: 1 !important;
        align-self: start !important;
        justify-self: center !important;
        margin: 4px 0 0 0 !important;
        flex: none !important;
      }
      .ztree.urppp-ztree > li > a,
      #treeDemo.ztree > li > a {
        grid-column: 2 !important;
        grid-row: 1 !important;
        display: block !important;
        width: auto !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 1.4 !important;
        min-height: 0 !important;
        height: auto !important;
      }
      /* 折叠态：空 ul 绝不能占位/留底 */
      .ztree.urppp-ztree li > ul[style*="display: none"],
      .ztree.urppp-ztree li > ul[style*="display:none"],
      #treeDemo.ztree li > ul[style*="display: none"],
      #treeDemo.ztree li > ul[style*="display:none"] {
        display: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        height: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
      }
      /* 展开态课程列表：紧贴标题，不垫高 */
      .ztree.urppp-ztree li > ul,
      #treeDemo.ztree li > ul {
        flex: 0 0 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 0 0 8px !important;
        border-left: 1px solid var(--border) !important;
        box-sizing: border-box !important;
        background: transparent !important;
      }
      .ztree.urppp-ztree > li > ul,
      #treeDemo.ztree > li > ul {
        grid-column: 1 / -1 !important;
        grid-row: 2 !important;
        margin: 2px 0 0 0 !important;
        padding: 2px 0 0 22px !important;
        border-left: none !important;
        border-top: 1px solid var(--border) !important;
      }
      .ztree.urppp-ztree > li > a .urppp-sub,
      #treeDemo.ztree > li > a .urppp-sub {
        margin: 1px 0 0 0 !important;
        padding: 0 !important;
        line-height: 1.35 !important;
      }
      /* 原生 ico 占位干掉 */
      .ztree.urppp-ztree li span.button.ico_open,
      .ztree.urppp-ztree li span.button.ico_close,
      .ztree.urppp-ztree li span.button.ico_docu,
      #treeDemo.ztree li span.button.ico_open,
      #treeDemo.ztree li span.button.ico_close,
      #treeDemo.ztree li span.button.ico_docu {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      /* 状态图标与标题首行对齐 */
      .ztree.urppp-ztree li a i.ace-icon,
      .ztree.urppp-ztree li a i.fa,
      #treeDemo.ztree li a i.ace-icon,
      #treeDemo.ztree li a i.fa {
        font-size: 14px !important;
        line-height: 1.4 !important;
        vertical-align: baseline !important;
        margin: 0 6px 0 0 !important;
      }
      /* 展开钮：子节点用，顶级由 grid 对齐 */
      .ztree.urppp-ztree li > span.button.switch,
      #treeDemo.ztree li > span.button.switch {
        flex: 0 0 14px !important;
        width: 14px !important;
        height: 14px !important;
        margin: 3px 4px 0 0 !important;
      }
      .ztree.urppp-ztree > li > span.button.switch,
      #treeDemo.ztree > li > span.button.switch {
        width: 14px !important;
        height: 14px !important;
        margin: 4px 0 0 0 !important;
      }
      /* 叶子节点无子级：隐藏无效展开钮 */
      .ztree.urppp-ztree li > span.button.switch.urppp-switch-leaf,
      .ztree.urppp-ztree li > span.button.switch[class*="_docu"],
      #treeDemo.ztree li > span.button.switch.urppp-switch-leaf,
      #treeDemo.ztree li > span.button.switch[class*="_docu"] {
        display: none !important;
      }
      /* 叶子节点文字左缩进，与有展开钮的内容列对齐 */
      .ztree.urppp-ztree li:has(> span.button.switch[class*="_docu"]) > a,
      .ztree.urppp-ztree li:has(> span.button.switch.urppp-switch-leaf) > a,
      #treeDemo.ztree li:has(> span.button.switch[class*="_docu"]) > a,
      #treeDemo.ztree li:has(> span.button.switch.urppp-switch-leaf) > a {
        padding-left: 14px !important;
      }
      .ztree.urppp-ztree li a,
      #treeDemo.ztree li a {
        display: block !important;
        flex: 1 1 0 !important;
        min-width: 0 !important;
        height: auto !important;
        min-height: 0 !important;
        padding: 2px 6px !important;
        margin: 0 !important;
        border: none !important;
        border-radius: var(--radius-sm) !important;
        background: transparent !important;
        color: var(--text) !important;
        text-decoration: none !important;
        white-space: normal !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        transition: background .12s !important;
      }
      .ztree.urppp-ztree li a:hover,
      #treeDemo.ztree li a:hover {
        background: var(--input-bg) !important;
      }
      .ztree.urppp-ztree li a.curSelectedNode,
      #treeDemo.ztree li a.curSelectedNode {
        background: var(--input-bg) !important;
        border: none !important;
        color: var(--text) !important;
        opacity: 1 !important;
        height: auto !important;
        box-shadow: none !important;
      }

      /* 展开按钮：更小更安静 */
      .ztree.urppp-ztree li span.button,
      #treeDemo.ztree li span.button {
        width: 12px !important;
        height: 12px !important;
        margin: 0 3px 0 0 !important;
        vertical-align: middle !important;
      }
      .ztree.urppp-ztree li a.urppp-expandable,
      #treeDemo.ztree li a.urppp-expandable {
        cursor: pointer !important;
      }
      .ztree.urppp-ztree li span.button.switch,
      #treeDemo.ztree li span.button.switch {
        background-image: none !important;
        position: relative !important;
        border-radius: 4px !important;
        background: transparent !important;
        border: 1px solid var(--border) !important;
      }
      .ztree.urppp-ztree li span.button.noline_open::before,
      .ztree.urppp-ztree li span.button.roots_open::before,
      .ztree.urppp-ztree li span.button.center_open::before,
      .ztree.urppp-ztree li span.button.bottom_open::before,
      .ztree.urppp-ztree li span.button.root_open::before,
      #treeDemo.ztree li span.button.noline_open::before,
      #treeDemo.ztree li span.button.roots_open::before,
      #treeDemo.ztree li span.button.center_open::before,
      #treeDemo.ztree li span.button.bottom_open::before,
      #treeDemo.ztree li span.button.root_open::before {
        content: '' !important;
        position: absolute !important;
        left: 50% !important; top: 50% !important;
        width: 5px !important; height: 5px !important;
        border-right: 1.5px solid var(--text-muted) !important;
        border-bottom: 1.5px solid var(--text-muted) !important;
        transform: translate(-50%, -65%) rotate(45deg) !important;
      }
      .ztree.urppp-ztree li span.button.noline_close::before,
      .ztree.urppp-ztree li span.button.roots_close::before,
      .ztree.urppp-ztree li span.button.center_close::before,
      .ztree.urppp-ztree li span.button.bottom_close::before,
      .ztree.urppp-ztree li span.button.root_close::before,
      #treeDemo.ztree li span.button.noline_close::before,
      #treeDemo.ztree li span.button.roots_close::before,
      #treeDemo.ztree li span.button.center_close::before,
      #treeDemo.ztree li span.button.bottom_close::before,
      #treeDemo.ztree li span.button.root_close::before {
        content: '' !important;
        position: absolute !important;
        left: 50% !important; top: 50% !important;
        width: 5px !important; height: 5px !important;
        border-right: 1.5px solid var(--text-muted) !important;
        border-bottom: 1.5px solid var(--text-muted) !important;
        transform: translate(-65%, -50%) rotate(-45deg) !important;
      }
      /* 状态只体现在图标色，节点不再铺大色块 */
      .ztree.urppp-ztree li a i.ace-icon,
      .ztree.urppp-ztree li a i.fa,
      #treeDemo.ztree li a i.ace-icon,
      #treeDemo.ztree li a i.fa {
        width: auto !important;
        height: auto !important;
        border-radius: 0 !important;
        display: inline !important;
        font-size: 14px !important;
        margin: 0 6px 0 0 !important;
        background: none !important;
        flex: none !important;
        line-height: 1 !important;
      }
      .ztree.urppp-ztree li.urppp-node-done > a i,
      #treeDemo.ztree li.urppp-node-done > a i,
      .ztree.urppp-ztree li.urppp-node-pass > a i,
      #treeDemo.ztree li.urppp-node-pass > a i { color: #16a34a !important; }
      .ztree.urppp-ztree li.urppp-node-todo > a i,
      #treeDemo.ztree li.urppp-node-todo > a i { color: var(--primary) !important; }
      .ztree.urppp-ztree li.urppp-node-fail > a i,
      #treeDemo.ztree li.urppp-node-fail > a i { color: #dc2626 !important; }
      .ztree.urppp-ztree li.urppp-node-pending > a i,
      #treeDemo.ztree li.urppp-node-pending > a i { color: var(--text-muted) !important; }
      .ztree.urppp-ztree li.urppp-node-done > a,
      .ztree.urppp-ztree li.urppp-node-todo > a,
      #treeDemo.ztree li.urppp-node-done > a,
      #treeDemo.ztree li.urppp-node-todo > a {
        background: transparent !important;
        border: none !important;
      }

      /* 文本层级：恢复正常字号，不拿缩小字体当压缩间距 */
      .ztree.urppp-ztree li a span.node_name,
      #treeDemo.ztree li a span.node_name {
        display: inline !important;
        white-space: normal !important;
        line-height: 1.4 !important;
        font-size: 13.5px !important;
        color: var(--text) !important;
      }
      .ztree.urppp-ztree > li > a span.node_name,
      #treeDemo.ztree > li > a span.node_name {
        font-weight: 600 !important;
        font-size: 14px !important;
      }
      .urppp-sub {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 4px 8px !important;
        width: auto !important;
        margin: 1px 0 0 0 !important;
        padding: 0 !important;
        font-size: 12px !important;
        font-weight: 400 !important;
        line-height: 1.35 !important;
        color: var(--text-muted) !important;
      }
      .urppp-kv {
        display: inline-flex !important;
        align-items: baseline !important;
        gap: 3px !important;
        white-space: nowrap !important;
      }
      .urppp-kv em {
        font-style: normal !important;
        color: var(--text-muted) !important;
        font-weight: 400 !important;
      }
      .urppp-kv b {
        font-weight: 700 !important;
        color: var(--text) !important;
        font-variant-numeric: tabular-nums !important;
      }
      .urppp-kv.req b { color: var(--primary) !important; }
      .urppp-kv.ok b { color: #15803d !important; }
      .urppp-kv.warn b { color: #ca8a04 !important; }
      .urppp-kv.muted b { color: var(--text-muted) !important; font-weight: 600 !important; }

      .urppp-code {
        display: inline !important;
        padding: 0 !important;
        margin-right: 6px !important;
        border: none !important;
        background: none !important;
        border-radius: 0 !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        color: var(--text-muted) !important;
      }
      .urppp-title,
      .urppp-gname {
        display: inline !important;
        font-weight: 600 !important;
        color: var(--text) !important;
      }
      .urppp-meta {
        display: inline !important;
        padding: 0 !important;
        margin-left: 6px !important;
        border: none !important;
        background: none !important;
        border-radius: 0 !important;
        font-size: 12px !important;
        color: var(--text-muted) !important;
      }
      .urppp-score {
        display: inline-flex !important;
        align-items: baseline !important;
        gap: 5px !important;
        margin-left: 8px !important;
        padding: 0 7px !important;
        border-radius: 999px !important;
        border: 1px solid transparent !important;
        font-size: 12.5px !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        white-space: nowrap !important;
        vertical-align: baseline !important;
      }
      .urppp-score b {
        font-weight: 600 !important;
        opacity: 0.9 !important;
      }
      .urppp-score em {
        font-style: normal !important;
        font-weight: 700 !important;
        font-variant-numeric: tabular-nums !important;
      }
      .urppp-score i {
        font-style: normal !important;
        font-weight: 500 !important;
        font-size: 11px !important;
        opacity: 0.75 !important;
        font-variant-numeric: tabular-nums !important;
      }
      .urppp-score.pass {
        color: #15803d !important;
        background: rgba(22,163,74,0.10) !important;
        border-color: rgba(22,163,74,0.22) !important;
      }
      .urppp-score.fail {
        color: #b91c1c !important;
        background: rgba(220,38,38,0.10) !important;
        border-color: rgba(220,38,38,0.22) !important;
      }

      /* 主节点：卡片在 li 上；不缩 padding 挤压文字 */
      .ztree.urppp-ztree > li > a,
      #treeDemo.ztree > li > a {
        font-weight: 600 !important;
        background: transparent !important;
        border: none !important;
        border-radius: var(--radius-sm) !important;
        cursor: pointer !important;
      }
      .ztree.urppp-ztree > li > a:hover,
      #treeDemo.ztree > li > a:hover {
        background: var(--input-bg) !important;
        border: none !important;
      }
      .ztree.urppp-ztree > li + li,
      #treeDemo.ztree > li + li {
        margin-top: 0 !important;
      }

      /* 课组要求等表格恢复正常横向表格布局 */
      .page-content .profile-user-info,
      .page-content .profile-user-info-striped {
        display: block !important;
        width: 100% !important;
      }
      .page-content .profile-user-info.self,
      .page-content .profile-user-info:has(.value_element) {
        overflow: visible !important;
      }
      /* 查询条件：pair 化后必须 flex 横排 */
      .page-content .profile-user-info.self .profile-info-row.urppp-query-row,
      .page-content .profile-user-info:has(.value_element) .profile-info-row.urppp-query-row,
      .page-content .profile-info-row.urppp-query-row {
        display: grid !important;
        align-items: center !important;
      }

      /* profile 卡片：默认一张壳；若已在 widget-box 内则拆掉内壳，避免套娃 */
      .profile-user-info,
      .profile-user-info-striped {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
        margin: 0 0 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        box-shadow: none !important;
      }
      /* 培养方案完成情况：下方课组卡片统一尺寸节奏（排除查询条件表单） */
      .page-content .profile-user-info:not(.self):not(.urppp-query-form):not(:has(.value_element)),
      .page-content .profile-user-info-striped:not(.self):not(.urppp-query-form):not(:has(.value_element)) {
        min-height: 108px !important;
      }
      .page-content .col-xs-6 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-sm-6 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-md-6 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-xs-4 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-sm-4 > .profile-user-info:not(.self):not(.urppp-query-form),
      .page-content .col-xs-3 > .profile-user-info:not(.self):not(.urppp-query-form) {
        height: 100% !important;
        min-height: 108px !important;
      }
      /* 独立查询/表单卡：一张圆角卡，全宽（排除学籍 setLabelWidth，否则 14px 内边距像套娃） */
      .page-content .profile-user-info.self:not(.setLabelWidth),
      .page-content .profile-user-info.urppp-query-form:not(.setLabelWidth),
      .page-content .profile-user-info:has(.value_element):not(.setLabelWidth),
      .profile-user-info.self:not(.setLabelWidth),
      .profile-user-info.urppp-query-form:not(.setLabelWidth) {
        min-height: 0 !important;
        height: auto !important;
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        float: none !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        padding: 14px 16px !important;
        margin: 0 0 16px !important;
        box-sizing: border-box !important;
      }
      /* 关键：widget-box 已是外卡时，内层 profile 去壳，禁止套娃 */
      .widget-box .profile-user-info,
      .widget-box .profile-user-info-striped,
      .widget-box .profile-user-info.self,
      .widget-box .profile-user-info.urppp-query-form,
      .widget-main .profile-user-info,
      .widget-body .profile-user-info,
      .panel .profile-user-info,
      .panel-body .profile-user-info {
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      /* widget 本体保证是唯一卡片壳（排除右侧滑出抽屉，它们也带 widget-box class） */
      .page-content .widget-box:not(#curriculumInfo-divcon):not(#curriculumInfo-divcon1):not(#curriculumInfo-divcon2):not(#calssInfo-divcon):not(#classroomInfo-divcon):not(#billContainer):not([id$="_scroll"]),
      #page-content-template .widget-box:not(#curriculumInfo-divcon):not(#curriculumInfo-divcon1):not(#curriculumInfo-divcon2):not(#calssInfo-divcon):not(#classroomInfo-divcon):not(#billContainer):not([id$="_scroll"]) {
        background: var(--surface) !important;
        border: var(--urppp-card-border, none) !important;
        border-radius: var(--radius) !important;
        box-shadow: var(--shadow) !important;
        overflow: visible !important; /* Chosen 下拉 */
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .page-content .widget-box .widget-main,
      .page-content .widget-box .widget-body {
        background: transparent !important;
        border: none !important;
        padding: 14px 16px !important;
        overflow: visible !important;
      }
      .page-content .widget-box .widget-header {
        background: transparent !important;
        border-bottom: 1px solid var(--border) !important;
      }
      .page-content .row:has(> [class*="col-"] > .profile-user-info) {
        display: flex !important;
        flex-wrap: wrap !important;
      }
      .page-content .row:has(> [class*="col-"] > .profile-user-info) > [class*="col-"] {
        display: flex !important;
        flex-direction: column !important;
      }
      /* ============================================================
       * profile-info 布局（对齐 ACE 原版）
       * - 学籍等：一行一对 name/value
       * - 查询条件 .self：一行多对 name/value（float 横向排列）
       * 不能全局 float:none / display:flex，否则查询表会竖着堆
       * ============================================================ */
      /* Chosen 下拉需要可见 */
      .profile-user-info:has(.chosen-container),
      .profile-user-info.self:not(.setLabelWidth),
      .profile-user-info-striped.self:not(.setLabelWidth),
      .profile-user-info:has(.value_element):not(.setLabelWidth),
      .profile-user-info.urppp-query-form {
        overflow: visible !important;
      }
      /*
       * 独立表单/信息卡统一形态（对照 rules.htm / index_5.htm）:
       *   .self-margin.col-xs-12 > h4.header + .profile-user-info.self
       *   .col-xs-12.self-margin > h4.header + form > .profile-user-info
       * 标题保持独立条；表单单独一张全宽圆角卡，不与标题粘连。
       */
      .page-content .self-margin,
      .page-content .col-xs-12.self-margin,
      .page-content .self-margin.col-xs-12,
      #page-content-template .self-margin {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        display: block !important;
        box-sizing: border-box !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .page-content .self-margin > form,
      .page-content .col-xs-12 > form,
      .page-content form:has(> .profile-user-info) {
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        float: none !important;
        box-sizing: border-box !important;
        margin: 0 !important;
      }
      /* 独立 profile 卡（不在 .widget-box 内）——与 h4.header 同宽同壳 */
      .page-content .self-margin > .profile-user-info,
      .page-content .self-margin > .profile-user-info.self,
      .page-content .self-margin > .profile-user-info-striped,
      .page-content .col-xs-12 > .profile-user-info,
      .page-content .col-xs-12 > .profile-user-info.self,
      .page-content form > .profile-user-info,
      .page-content form > .profile-user-info.self,
      .page-content form > .profile-user-info-striped,
      .page-content form > .self.profile-user-info,
      #page-content-template .self-margin > .profile-user-info,
      #page-content-template form > .profile-user-info,
      .page-content .col-xs-12.self-margin > form > .profile-user-info,
      .page-content .self-margin.col-xs-12 > form > .profile-user-info {
        display: block !important;
        float: none !important;
        clear: both !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: none !important;
        margin: 0 0 18px !important;
        overflow: hidden !important;
        padding: 0 !important;
      }
      /* 查询横排：内边距 + 可溢出（Chosen） */
      .page-content .self-margin > .profile-user-info.urppp-query-form,
      .page-content form > .profile-user-info.urppp-query-form,
      .page-content .self-margin > .profile-user-info.self.urppp-query-form,
      .page-content .profile-user-info.self:has(.urppp-query-pair),
      .page-content .profile-user-info.self:has(.chosen-container) {
        overflow: visible !important;
        padding: 14px 16px !important;
      }

      /*
       * Tab 内独立查询卡（空闲教室 custom.htm）:
       *   .tabbable > .tab-content > .tab-pane > form > .profile-user-info.self
       * 与规则页 self-margin 下查询卡同形态：全宽 / surface / 12px 圆角
       */
      .page-content .tab-content,
      .page-content .tabbable > .tab-content,
      .page-content .tab-pane,
      .page-content .tab-pane.active,
      .page-content .tab-pane > form {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        float: none !important;
      }
      .page-content .tab-pane > form,
      .page-content .tab-content form:has(> .profile-user-info) {
        display: block !important;
        margin: 0 !important;
      }
      .page-content .tab-pane > form > .profile-user-info,
      .page-content .tab-pane > form > .profile-user-info.self,
      .page-content .tab-pane > form > .profile-user-info-striped,
      .page-content .tab-pane .profile-user-info.self,
      .page-content .tab-content .profile-user-info.self,
      .page-content .tab-content .profile-user-info.urppp-query-form,
      #faq-tab-1 .profile-user-info,
      #faq-tab-4 .profile-user-info,
      [id^="faq-tab-"] > form > .profile-user-info {
        display: block !important;
        float: none !important;
        clear: both !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: none !important;
        margin: 0 0 14px !important;
        padding: 14px 16px !important;
        overflow: visible !important;
      }
      /* 查询按钮区：跟卡对齐，不飘 */
      .page-content .tab-pane > form > .center,
      .page-content .tab-pane form .center:has(#queryFreeClassRoom),
      .page-content .tab-pane form .center:has(.btn) {
        width: 100% !important;
        text-align: center !important;
        margin: 0 0 14px !important;
      }
      /* 结果表区域：全宽卡，与上方查询卡统一 */
      .page-content .tab-pane .self-margin,
      .page-content .tab-pane .col-xs-12.self-margin,
      .page-content .tab-pane form .row,
      .page-content .tab-pane form .row > .col-xs-12 {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        box-sizing: border-box !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      /* 标题与下方独立卡间距统一（同 header 下边距节奏） */
      .page-content h4.header + form,
      .page-content h4.header + .profile-user-info,
      .page-content h4.header + .profile-user-info-striped,
      .page-content .header.smaller + form,
      .page-content .header.smaller + .profile-user-info {
        margin-top: 0 !important;
      }
      .page-content h4.header,
      .page-content .header.smaller {
        margin-bottom: 12px !important;
      }
      /* 学籍卡裁圆角 */
      .profile-user-info.setLabelWidth,
      .profile-user-info-striped.setLabelWidth {
        overflow: hidden !important;
        background: var(--surface) !important;
        border-radius: var(--radius) !important;
      }
      /* 仅「查询横排」去标签底/行分割；单列信息表保留标签列底，和学籍卡一致 */
      .profile-user-info.urppp-query-form .profile-info-name,
      .profile-user-info.self:has(.urppp-query-pair) .profile-info-name,
      .profile-user-info.self:has(.chosen-container) .profile-info-name {
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
      }
      .profile-user-info.urppp-query-form .profile-info-value,
      .profile-user-info.self:has(.urppp-query-pair) .profile-info-value,
      .profile-user-info.self:has(.chosen-container) .profile-info-value {
        background: transparent !important;
        border: none !important;
      }
      .profile-user-info.urppp-query-form .profile-info-row,
      .profile-user-info.self:has(.urppp-query-pair) .profile-info-row,
      .profile-user-info.self:has(.chosen-container) .profile-info-row {
        border-bottom: none !important;
        background: transparent !important;
      }

      /* 所有 profile / 外层 form / 内容列拉满 */
      .page-content .profile-user-info,
      .page-content .profile-user-info-striped,
      .page-content .profile-user-info.self,
      .page-content .profile-user-info.urppp-query-form,
      .page-content form .profile-user-info,
      .page-content form .profile-user-info-striped,
      #page-content-template .profile-user-info,
      .page-content form:has(.profile-user-info),
      .page-content .self-margin,
      .page-content .self-margin > form,
      .page-content .col-xs-12:has(.profile-user-info),
      .page-content .col-xs-12:has(> .profile-user-info),
      .page-content .col-xs-12:has(> form) {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        float: none !important;
      }
      .page-content .profile-user-info,
      .page-content form > .profile-user-info {
        display: block !important;
      }
      /* 查询卡内的行绝不走信息表 140px 灰底布局 */
      .profile-user-info.urppp-query-form > .profile-info-row:not(.urppp-query-row),
      .profile-user-info.self.urppp-query-form .profile-info-row:not(.urppp-query-row) {
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        border-bottom: none !important;
        min-height: 0 !important;
        background: transparent !important;
      }
      .profile-user-info.urppp-query-form .profile-info-name,
      .profile-user-info.urppp-query-form .profile-info-value {
        background: transparent !important;
        border: none !important;
      }
      /*
       * 查询表 .self 多字段行：在 JS 包 pair 之前就按横排显示，避免
       * 先被下面 140px 信息表网格打成竖排（刷新闪 竖→横→竖）
       * 判定：同一行内至少 2 个 .profile-info-name
       */
      .page-content .profile-user-info.self:not(.setLabelWidth) > .profile-info-row:has(> .profile-info-name ~ .profile-info-name),
      .page-content .profile-user-info.self:not(.setLabelWidth) .profile-info-row:has(> .profile-info-name ~ .profile-info-name):not(.urppp-dual-pair),
      #page-content-template .profile-user-info.self:not(.setLabelWidth) > .profile-info-row:has(> .profile-info-name ~ .profile-info-name) {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        column-gap: 14px !important;
        row-gap: 10px !important;
        border-bottom: none !important;
        min-height: 0 !important;
        background: transparent !important;
        grid-template-columns: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
        float: none !important;
      }
      .page-content .profile-user-info.self:not(.setLabelWidth) > .profile-info-row:has(> .profile-info-name ~ .profile-info-name) > .profile-info-name,
      .page-content .profile-user-info.self:not(.setLabelWidth) .profile-info-row:has(> .profile-info-name ~ .profile-info-name) > .profile-info-name {
        float: none !important;
        flex: 0 0 84px !important;
        width: 84px !important;
        min-width: 84px !important;
        max-width: 96px !important;
        margin: 0 !important;
        padding: 0 8px 0 0 !important;
        background: transparent !important;
        border: none !important;
        border-right: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        color: var(--text-secondary) !important;
        box-sizing: border-box !important;
      }
      .page-content .profile-user-info.self:not(.setLabelWidth) > .profile-info-row:has(> .profile-info-name ~ .profile-info-name) > .profile-info-value,
      .page-content .profile-user-info.self:not(.setLabelWidth) .profile-info-row:has(> .profile-info-name ~ .profile-info-name) > .profile-info-value {
        float: none !important;
        flex: 1 1 calc(25% - 110px) !important;
        width: auto !important;
        min-width: 120px !important;
        max-width: calc(25% - 24px) !important;
        margin: 0 !important;
        margin-left: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        min-height: 34px !important;
        display: flex !important;
        align-items: center !important;
        box-sizing: border-box !important;
      }
      /* 已包 pair 后仍用既有 query-row 规则，上面 flex 只作用于未包 pair 的瞬间 */

      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) {
        display: grid !important;
        grid-template-columns: 140px minmax(0, 1fr) !important;
        align-items: stretch !important;
        width: 100% !important;
        max-width: 100% !important;
        border-bottom: 1px solid var(--border) !important;
        min-height: 42px !important;
        position: relative !important;
        box-sizing: border-box !important;
        float: none !important;
      }
      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair):before,
      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair):after {
        content: none !important;
        display: none !important;
      }
      .profile-info-row:last-child { border-bottom: none !important; }

      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) > .profile-info-name,
      .profile-info-name {
        float: none !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 10px 12px !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        border: none !important;
        border-right: 1px solid var(--border) !important;
        text-align: right !important;
        font-weight: 500 !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        white-space: nowrap !important;
      }
      /* 单对：value 占右侧剩余宽度，禁止 margin-left 把布局打成竖排 */
      .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) > .profile-info-value,
      .profile-info-value {
        float: none !important;
        margin: 0 !important;
        margin-left: 0 !important;
        min-height: 42px !important;
        padding: 6px 12px !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        border: none !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        position: relative !important;
        width: auto !important;
        max-width: none !important;
        min-width: 0 !important;
      }
      .profile-info-value > span,
      .profile-info-value > span.editable,
      .profile-info-value span.editable,
      span.editable {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        color: var(--text) !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      /* 培养方案抽屉：方案/学期/课组详情文字必须可读 */
      #curriculumInfo-divcon2 .profile-info-value,
      #curriculumInfo-divcon2 .profile-info-value > span,
      #curriculumInfo-divcon2 span.editable,
      #fajh .profile-info-value,
      #fajh .profile-info-value > span,
      #xnxq .profile-info-value,
      #xnxq .profile-info-value > span,
      #xnxq span.editable,
      #kz .profile-info-value,
      #kz .profile-info-value > span,
      #kz span.editable,
      #kc .profile-info-value,
      #kcfa .profile-info-value {
        color: var(--text) !important;
        background: transparent !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      #curriculumInfo-divcon2 .profile-info-name,
      #fajh .profile-info-name,
      #xnxq .profile-info-name,
      #kz .profile-info-name {
        color: var(--text-secondary) !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .profile-info-value .form-control,
      .profile-info-value input.form-control,
      .profile-info-value textarea.form-control,
      .profile-info-value input[type="text"],
      .profile-info-value textarea {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
      }
      /* 个人信息修改页输入区更宽、更易填 */
      .page-content form .profile-info-value .form-control,
      .page-content form .profile-info-value input.form-control,
      .page-content form .profile-info-value textarea.form-control {
        max-width: 720px !important;
      }
      /* 学籍 setLabelWidth：单对时标签 150px */
      .setLabelWidth .profile-info-row:not(.urppp-query-row):not(.urppp-dual-pair) {
        grid-template-columns: 150px minmax(0, 1fr) !important;
      }
      /*
       * 学籍右侧「一行两对」：标记 .urppp-dual-pair 后用 4 列 grid
       * 不用 :has 作为唯一手段，避免兼容/覆盖失败
       */
      html body .page-content .profile-info-row.urppp-dual-pair,
      html body .page-content .setLabelWidth .profile-info-row.urppp-dual-pair,
      .profile-info-row.urppp-dual-pair {
        display: grid !important;
        grid-template-columns: 112px minmax(140px, 1fr) 112px minmax(140px, 1fr) !important;
        align-items: stretch !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        border-bottom: 1px solid var(--border) !important;
        min-height: 42px !important;
        float: none !important;
        clear: both !important;
        position: relative !important;
      }
      html body .page-content .profile-info-row.urppp-dual-pair::before,
      html body .page-content .profile-info-row.urppp-dual-pair::after,
      .profile-info-row.urppp-dual-pair::before,
      .profile-info-row.urppp-dual-pair::after {
        content: none !important;
        display: none !important;
      }
      html body .page-content .profile-info-row.urppp-dual-pair > .profile-info-name,
      .profile-info-row.urppp-dual-pair > .profile-info-name {
        float: none !important;
        clear: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 10px 12px !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        text-align: right !important;
      }
      html body .page-content .profile-info-row.urppp-dual-pair > .profile-info-value,
      .profile-info-row.urppp-dual-pair > .profile-info-value {
        float: none !important;
        clear: none !important;
        display: flex !important;
        align-items: center !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        margin: 0 !important;
        margin-left: 0 !important;
        padding: 8px 12px !important;
        min-height: 42px !important;
        box-sizing: border-box !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
        white-space: normal !important;
      }
      /* 学籍信息卡圆角：必须 hidden 才能裁切 */
      html body .page-content .profile-user-info.setLabelWidth,
      html body .page-content .profile-user-info-striped.setLabelWidth,
      .profile-user-info.setLabelWidth,
      .profile-user-info-striped.setLabelWidth {
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
        background: var(--surface) !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        box-shadow: none !important;
      }
      html body .page-content .col-xs-4 > .profile-user-info.setLabelWidth,
      html body .page-content .col-xs-8 > .profile-user-info.setLabelWidth,
      html body .page-content .col-xs-4 > .profile-user-info-striped.setLabelWidth,
      html body .page-content .col-xs-8 > .profile-user-info-striped.setLabelWidth {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
      }
      /* 查询 pair 内的 value 绝不能 margin-left:140px */
      .urppp-query-pair .profile-info-value,
      .profile-info-row.urppp-query-row .profile-info-value {
        margin-left: 0 !important;
        float: none !important;
        width: auto !important;
        max-width: none !important;
      }
      .urppp-query-pair .profile-info-name,
      .profile-info-row.urppp-query-row .profile-info-name {
        float: none !important;
        width: 84px !important;
        min-width: 84px !important;
        max-width: none !important;
        margin: 0 !important;
        border-right: none !important;
        background: transparent !important;
      }

      /* 查询条件：JS 包成 pair 后用 flex 横排（彻底摆脱 float 打架） */
      .profile-user-info.urppp-query-form,
      .profile-user-info.self.urppp-query-form,
      .profile-user-info-striped.self.urppp-query-form {
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        background: var(--surface) !important;
        padding: 12px 14px 6px !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .page-content .profile-info-row.urppp-query-row,
      .profile-user-info.urppp-query-form .profile-info-row.urppp-query-row,
      .profile-info-row.urppp-query-row {
        display: grid !important;
        column-gap: 14px !important;
        row-gap: 10px !important;
        align-items: center !important;
        border-bottom: none !important;
        min-height: 0 !important;
        padding: 2px 0 8px !important;
        margin: 0 !important;
        overflow: visible !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      /* 按本行 pair 数动态列数，避免 4 字段硬套 3 列留下空洞 */
      .profile-info-row.urppp-query-row[data-urppp-query-cols="1"] {
        /* 真·单字段整表才满宽；多行查询卡会写成 4，不会误伤 */
        grid-template-columns: minmax(0, 1fr) !important;
      }
      .profile-info-row.urppp-query-row > .urppp-query-pair {
        min-width: 0 !important;
        max-width: 100% !important;
      }
      .profile-info-row.urppp-query-row[data-urppp-query-cols="2"] {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .profile-info-row.urppp-query-row[data-urppp-query-cols="3"] {
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
      }
      .profile-info-row.urppp-query-row[data-urppp-query-cols="4"] {
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
      }
      .profile-info-row.urppp-query-row:before,
      .profile-info-row.urppp-query-row:after,
      .page-content .profile-info-row.urppp-query-row:before,
      .page-content .profile-info-row.urppp-query-row:after {
        content: none !important;
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        clear: none !important;
      }
      .page-content .urppp-query-pair,
      .profile-user-info.urppp-query-form .urppp-query-pair,
      .urppp-query-pair {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        flex: none !important;
        box-sizing: border-box !important;
        float: none !important;
        clear: none !important;
        margin: 0 !important;
      }
      .urppp-query-pair .profile-info-name {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex: 0 0 84px !important;
        width: 84px !important;
        min-width: 84px !important;
        max-width: 84px !important;
        height: 36px !important;
        min-height: 36px !important;
        margin: 0 !important;
        padding: 0 8px 0 0 !important;
        background: transparent !important;
        border: none !important;
        border-right: none !important;
        text-align: right !important;
        line-height: 1.3 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        color: var(--text-secondary) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .profile-info-value {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 36px !important;
        min-height: 36px !important;
        margin: 0 !important;
        margin-left: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .profile-info-value > input,
      .urppp-query-pair .profile-info-value > select:not(.urppp-chosen-hidden):not(.chzn-done):not(.chosen),
      .urppp-query-pair .profile-info-value > .form-control:not(select.urppp-chosen-hidden),
      .urppp-query-pair .profile-info-value > .chosen-container,
      .urppp-query-pair .value_element:not(select.urppp-chosen-hidden):not(select.chzn-done),
      .urppp-query-pair input.value_element,
      .urppp-query-pair select.value_element:not(.urppp-chosen-hidden):not(.chzn-done):not(.chosen) {
        display: block !important;
        float: none !important;
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .chosen-container,
      .urppp-query-pair .chosen-container-single {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
        top: 0 !important;
        height: 34px !important;
        position: relative !important;
      }
      .urppp-query-pair .chosen-single {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 34px !important;
        padding: 0 28px 0 10px !important;
        display: flex !important;
        align-items: center !important;
        box-sizing: border-box !important;
      }
      .urppp-query-pair .chosen-single span {
        display: block !important;
        line-height: normal !important;
        margin-right: 22px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .urppp-query-pair .chosen-single div {
        position: absolute !important;
        top: 0 !important;
        right: 0 !important;
        width: 26px !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .urppp-query-pair .chosen-single div b {
        display: block !important;
        width: 12px !important;
        height: 12px !important;
        margin: 0 !important;
        background-position: 0 0 !important;
      }

      /* Chosen 启用后隐藏原生 select，避免双层/撑破布局 */
      .urppp-query-pair select.chosen,
      .urppp-query-pair select.value_element.chosen,
      .urppp-query-pair select.urppp-chosen-hidden,
      .urppp-query-pair .chosen-container + select,
      .urppp-query-pair select + .chosen-container + select,
      .urppp-query-pair select.chzn-done,
      .profile-user-info select.urppp-chosen-hidden,
      .profile-user-info select.chzn-done,
      .profile-user-info select.chosen,
      .profile-user-info.urppp-query-form select.chosen,
      .profile-user-info.urppp-query-form select.urppp-chosen-hidden,
      .profile-user-info.urppp-query-form .chosen-container + select,
      .profile-info-value > select.urppp-chosen-hidden,
      .profile-info-value > select.chzn-done,
      select.urppp-chosen-hidden {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        position: absolute !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
      }
      .urppp-query-pair .chosen-container {
        display: block !important;
      }
      @media (max-width: 1200px) {
        .profile-info-row.urppp-query-row[data-urppp-query-cols="4"],
        .profile-info-row.urppp-query-row[data-urppp-query-cols="3"] {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }
      /* 移动端：查询表单每行最多两个筛选项，一个就占一行 */
      @media (max-width: 991px) {
        .page-content .profile-info-row.urppp-query-row,
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols],
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols="2"],
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols="3"],
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols="4"],
        .profile-user-info.urppp-query-form .profile-info-row.urppp-query-row {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        /* 单字段行（只有一项）：占满整行，不孤零零站半格 */
        .page-content .profile-info-row.urppp-query-row > .urppp-query-pair:only-child {
          grid-column: 1 / -1 !important;
        }
      }
      @media (max-width: 640px) {
        .profile-user-info.urppp-query-form,
        .profile-user-info.self.urppp-query-form,
        .profile-user-info-striped.self.urppp-query-form {
          padding: 10px 12px 6px !important;
        }
        /* 640px 以下一行一个筛选项：标签与控件完整显示，不截断 */
        .page-content .profile-info-row.urppp-query-row,
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols],
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols="2"],
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols="3"],
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols="4"],
        .profile-user-info.urppp-query-form .profile-info-row.urppp-query-row {
          grid-template-columns: minmax(0, 1fr) !important;
        }
        /* 标签恢复完整宽度，选项/输入框拿剩余全宽 */
        .urppp-query-row {
          --urppp-qlabel: 84px !important;
          --urppp-qlabel-max: 96px !important;
        }
        .profile-info-row.urppp-query-row {
          column-gap: 10px !important;
          row-gap: 10px !important;
        }
        .urppp-query-pair {
          flex-direction: row !important;
          align-items: center !important;
          gap: 6px !important;
        }
        .urppp-query-pair .profile-info-name {
          flex: 0 0 auto !important;
          width: auto !important;
          min-width: 0 !important;
          max-width: 42% !important;
          height: auto !important;
          min-height: 0 !important;
          padding: 0 6px 0 0 !important;
          justify-content: flex-start !important;
          text-align: left !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
        .urppp-query-pair .profile-info-value {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          max-width: 100% !important;
        }
      }
      @media (max-width: 359px) {
        .page-content .profile-info-row.urppp-query-row,
        .page-content .profile-info-row.urppp-query-row[data-urppp-query-cols] {
          grid-template-columns: minmax(0, 1fr) !important;
        }
      }

      /* Neu 输入控件：静态态必须有可见边界，焦点态再增强为主色 */
      html[data-urppp-skin="neu"] .profile-info-value input[type="text"],
      html[data-urppp-skin="neu"] .profile-info-value input[type="search"],
      html[data-urppp-skin="neu"] .profile-info-value input[type="number"],
      html[data-urppp-skin="neu"] .profile-info-value input[type="password"],
      html[data-urppp-skin="neu"] #form-search .nav-search-input {
        border: 1px solid rgba(38, 49, 66, .18) !important;
        box-shadow: inset 2px 2px 4px rgba(38, 49, 66, .16), inset -2px -2px 4px rgba(255, 255, 255, .72) !important;
      }
      html[data-urppp-skin="neu"] .profile-info-value input:focus,
      html[data-urppp-skin="neu"] #form-search .nav-search-input:focus {
        border-color: var(--primary) !important;
        box-shadow: inset 4px 4px 8px rgba(38, 49, 66, .22), inset -4px -4px 8px rgba(255, 255, 255, .72) !important;
      }

      /* 查询 pair：最后覆盖 commoncss / 旧规则的 150px 固定宽 */
      .profile-user-info.urppp-query-form .urppp-query-pair .chosen-container,
      .profile-user-info.urppp-query-form .urppp-query-pair .chosen-container-single,
      .profile-user-info.urppp-query-form .urppp-query-pair .value_element,
      .profile-user-info.urppp-query-form .urppp-query-pair input,
      .profile-user-info.urppp-query-form .urppp-query-pair select,
      .profile-user-info.urppp-query-form .urppp-query-pair .form-control,
      .urppp-query-pair .chosen-container,
      .urppp-query-pair .chosen-container-single {
        width: 100% !important;
        min-width: 0 !important;
        max-width: none !important;
      }
      .profile-user-info.urppp-query-form .urppp-query-pair .chosen-single {
        width: 100% !important;
        max-width: none !important;
      }

      /* 通用控件高度（学籍等单对结构） */
      .profile-info-value > input,
      .profile-info-value > select,
      .profile-info-value > textarea,
      .profile-info-value > .form-control,
      .profile-info-value > .chosen-container,
      .profile-info-value input.form-control,
      .profile-info-value select.form-control {
        margin: 0 !important;
        vertical-align: middle !important;
      }
      .profile-info-value .chosen-container {
        display: block !important;
        width: 100% !important;
        max-width: 360px !important;
        top: 0 !important;
      }
      .profile-info-value .chosen-container .chosen-single {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 32px !important;
        display: block !important;
        padding: 0 30px 0 12px !important;
      }
      .profile-info-value select,
      .profile-info-value input[type="text"],
      .profile-info-value input[type="number"],
      .profile-info-value input:not([type]) {
        width: 100% !important;
        max-width: 360px !important;
        height: 34px !important;
        min-height: 34px !important;
        line-height: 1.35 !important;
      }
      /* 学籍/个人头像：固定小尺寸 + 圆角（覆盖内联 width/height） */
      #avatar,
      .profile-picture img,
      img.editable.img-responsive,
      .page-content img#avatar {
        width: 96px !important;
        max-width: 96px !important;
        height: 118px !important;
        object-fit: cover !important;
        border-radius: var(--radius) !important;
        border: 1px solid var(--border) !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06) !important;
      }
      .profile-picture {
        display: block !important;
        width: 96px !important;
        max-width: 96px !important;
        margin: 0 0 12px !important;
        padding: 0 !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
        line-height: 0 !important;
        background: var(--surface) !important;
      }

      /* 学籍页常见布局：列间距与对齐 */
      .page-content .row + .row { margin-top: 8px !important; }
      .page-content .widget-container-col,
      .page-content .col-xs-12,
      .page-content .col-sm-6,
      .page-content .col-md-6,
      .page-content .col-lg-6 {
        margin-bottom: 8px !important;
      }
      legend {
        color: var(--text) !important;
        border-bottom: 1px solid var(--border) !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        padding-bottom: 8px !important;
        margin-bottom: 14px !important;
        width: 100% !important;
      }
      fieldset {
        padding: 16px 18px !important;
        margin-bottom: 18px !important;
      }

      /* 按钮 */
      .btn, .btn.btn-xs, .btn.btn-sm, .btn.btn-lg, .btn.btn-minier,
      .btn-group .btn, .btn-group > .btn, .input-group .btn, .btn-toolbar .btn,
      .btn-app {
        border-radius: var(--radius-sm) !important;
      }
      .btn:not(.btn-app), .btn.btn-xs:not(.btn-app), .btn.btn-sm:not(.btn-app), .btn.btn-lg:not(.btn-app), .btn.btn-minier:not(.btn-app),
      .btn.btn-round:not(.btn-app), .btn.btn-white:not(.btn-app), .btn.btn-info:not(.btn-app), .btn.btn-bold:not(.btn-app) {
        font-size: 12px !important;
        line-height: 1 !important;
        padding: 0 12px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
        transition: all .15s ease !important;
      }
      .btn:not(.btn-app) > .ace-icon,
      .btn:not(.btn-app) > .fa,
      .btn:not(.btn-app) > .glyphicon {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        line-height: 1 !important;
        margin: 0 !important;
        position: static !important;
        top: auto !important;
        vertical-align: middle !important;
      }
      .btn.btn-xs:not(.btn-app) {
        height: 26px !important;
        min-height: 26px !important;
        max-height: 26px !important;
        padding: 0 10px !important;
        font-size: 12px !important;
      }
      /* 首页/应用方块按钮：独立尺寸，不受 28px 限制 */
      .btn.btn-app,
      a.btn-app,
      button.btn-app {
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        width: 90px !important;
        min-width: 90px !important;
        padding: 10px 8px !important;
        line-height: 1.25 !important;
        font-size: 12px !important;
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        white-space: normal !important;
        text-align: center !important;
        vertical-align: top !important;
      }
      .btn.btn-app > .ace-icon,
      .btn.btn-app > .fa,
      .btn.btn-app > .glyphicon,
      a.btn-app > .ace-icon,
      a.btn-app > .fa {
        display: block !important;
        margin: 0 0 2px !important;
        font-size: 24px !important;
        line-height: 1 !important;
        width: auto !important;
        height: auto !important;
      }
      .btn:not(.btn-app) {
        border-radius: 999px !important;
        font-weight: 500 !important;
        letter-spacing: -0.01em !important;
        transition: background .18s ease, border-color .18s ease, color .18s ease, box-shadow .18s ease, transform .12s ease !important;
      }
      .btn:hover { transform: none; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      .btn:active,
      .btn.active,
      .btn:focus,
      .btn:focus-visible {
        transform: scale(0.98) !important;
        outline: none !important;
      }
      .btn-primary:not(.btn-app), .btn-info:not(.btn-app) {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        border-radius: 999px !important;
      }
      .btn-primary:hover, .btn-info:hover,
      .btn-primary:focus, .btn-info:focus,
      .btn-primary:active, .btn-info:active,
      .btn-primary.active, .btn-info.active,
      .btn-primary:active:focus, .btn-info:active:focus,
      .btn-primary:active:hover, .btn-info:active:hover,
      .open > .dropdown-toggle.btn-primary,
      .open > .dropdown-toggle.btn-info {
        background: var(--primary-hover) !important;
        border-color: var(--primary-hover) !important;
        color: #fff !important;
        box-shadow: 0 0 0 4px var(--ring) !important;
      }
      .btn-success {
        background: #34C759 !important;
        border-color: #34C759 !important;
        color: #fff !important;
        border-radius: 999px !important;
      }
      .btn-success:hover, .btn-success:focus, .btn-success:active, .btn-success.active,
      .btn-success:active:focus, .btn-success:active:hover {
        background: #2DB84D !important;
        border-color: #2DB84D !important;
        color: #fff !important;
        box-shadow: 0 0 0 4px rgba(52,199,89,0.28) !important;
      }
      .btn-warning {
        background: #FF9F0A !important;
        border-color: #FF9F0A !important;
        color: #fff !important;
        border-radius: 999px !important;
      }
      .btn-warning:hover, .btn-warning:focus, .btn-warning:active, .btn-warning.active,
      .btn-warning:active:focus, .btn-warning:active:hover {
        background: #E68A00 !important;
        border-color: #E68A00 !important;
        color: #fff !important;
        box-shadow: 0 0 0 4px rgba(255,159,10,0.28) !important;
      }
      .btn-danger {
        background: #FF3B30 !important;
        border-color: #FF3B30 !important;
        color: #fff !important;
        border-radius: 999px !important;
      }
      .btn-danger:hover, .btn-danger:focus, .btn-danger:active, .btn-danger.active,
      .btn-danger:active:focus, .btn-danger:active:hover {
        background: #E0342C !important;
        border-color: #E0342C !important;
        color: #fff !important;
        box-shadow: 0 0 0 4px rgba(255,59,48,0.28) !important;
      }
      .btn-default, .btn-white,
      .btn.btn-default, .btn.btn-white,
      .btn.btn-white.btn-primary,
      .btn.btn-white.btn-info,
      .btn.btn-white.btn-success,
      .btn.btn-white.btn-warning,
      .btn.btn-white.btn-danger,
      .btn.btn-white.btn-purple,
      .btn-group > .btn.btn-white,
      .btn-group > .btn.btn-default,
      .dropdown-toggle.btn-white,
      .btn.dropdown-toggle.btn-white {
        background: var(--input-bg) !important;
        background-image: none !important;
        background-color: var(--input-bg) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        border-radius: 999px !important;
        text-shadow: none !important;
      }
      .btn-default:hover, .btn-white:hover,
      .btn-default:focus, .btn-white:focus,
      .btn-default:active, .btn-white:active,
      .btn-default.active, .btn-white.active,
      .btn-default:active:focus, .btn-white:active:focus,
      .btn.btn-white.btn-primary:hover,
      .btn.btn-white.btn-primary:focus,
      .btn.btn-white.btn-primary:active,
      .btn.btn-white.btn-info:hover,
      .open > .dropdown-toggle.btn-white,
      .open > .btn.btn-white.dropdown-toggle {
        background: color-mix(in srgb, var(--primary) 12%, var(--input-bg)) !important;
        background-image: none !important;
        background-color: color-mix(in srgb, var(--primary) 12%, var(--input-bg)) !important;
        border-color: var(--primary) !important;
        color: var(--text) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
        text-shadow: none !important;
      }
      /* 暗色：再压一层 ACE btn-white 硬编码白底 */
      html.urppp-theme-dark .btn-white,
      html.urppp-theme-dark .btn.btn-white,
      html.urppp-theme-dark .btn.btn-white.btn-primary,
      html.urppp-theme-dark .btn.btn-white.btn-info,
      html.urppp-theme-dark .btn.btn-white.no-border,
      html.urppp-theme-dark .btn-group > .btn.btn-white,
      html.urppp-theme-dark a.btn.btn-white,
      html.urppp-theme-dark button.btn.btn-white {
        background: #1C2330 !important;
        background-color: #1C2330 !important;
        background-image: none !important;
        border-color: #1E293B !important;
        color: #E2E8F0 !important;
      }
      html.urppp-theme-dark .btn-white:hover,
      html.urppp-theme-dark .btn.btn-white:hover,
      html.urppp-theme-dark .btn.btn-white.btn-primary:hover,
      html.urppp-theme-dark .open > .dropdown-toggle.btn-white {
        background: #243044 !important;
        background-color: #243044 !important;
        border-color: #93A8C7 !important;
        color: #F1F5F9 !important;
      }
      html.urppp-theme-dark .btn-white .ace-icon,
      html.urppp-theme-dark .btn-white .fa,
      html.urppp-theme-dark .btn-white .caret {
        color: inherit !important;
        border-top-color: currentColor !important;
      }
      .btn-link:active, .btn-link:focus, .btn-link.active {
        color: var(--primary-hover) !important;
      }
      /* 紫色等站点自定义按钮：点击态也贴主题 */
      .btn-purple, .btn.btn-purple {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
      }
      .btn-purple:hover, .btn-purple:focus, .btn-purple:active, .btn-purple.active,
      .btn.btn-purple:hover, .btn.btn-purple:focus, .btn.btn-purple:active {
        background: var(--primary-hover) !important;
        border-color: var(--primary-hover) !important;
        color: #fff !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
/* btn-app 必须压过 .btn-info 实心蓝，否则可申请业务页仍是 ACE 蓝块 */
      .btn-app,
      .btn.btn-app,
      a.btn-app,
      button.btn-app,
      .btn.btn-app.btn-info,
      .btn.btn-app.btn-primary,
      .btn.btn-app.btn-success,
      .btn.btn-app.btn-warning,
      .btn.btn-app.btn-danger,
      a.btn.btn-app.btn-info,
      a.btn.btn-app.btn-primary,
      button.btn.btn-app.btn-info {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        border-radius: var(--radius-sm) !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      .btn-app:hover,
      .btn.btn-app:hover,
      a.btn-app:hover,
      button.btn-app:hover,
      .btn.btn-app.btn-info:hover,
      .btn.btn-app.btn-primary:hover,
      a.btn.btn-app.btn-info:hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        box-shadow: 0 4px 14px color-mix(in srgb, var(--primary) 28%, transparent) !important;
        transform: translateY(-2px) !important;
      }
      .btn-app > .ace-icon,
      .btn-app > .fa,
      .btn-app > .glyphicon,
      .btn.btn-app > .ace-icon,
      .btn.btn-app > .fa,
      a.btn-app > .fa,
      a.btn-app > .ace-icon {
        color: var(--primary) !important;
      }
      .btn-app:hover > .ace-icon,
      .btn-app:hover > .fa,
      .btn-app:hover > .glyphicon,
      .btn.btn-app:hover > .ace-icon,
      .btn.btn-app:hover > .fa,
      a.btn-app:hover > .fa {
        color: #fff !important;
      }
      /* 可申请业务等页：大按钮容器横排换行 */
      .page-content .widget-main:has(> .btn-app),
      .page-content .widget-body .widget-main:has(.btn-app),
      .page-content #personalApplication,
      .page-content .tab-content .widget-main:has(.btn-app),
      .page-content .tab-pane:has(.btn-app) {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
        align-content: flex-start !important;
      }
      .page-content .btn.btn-app,
      .page-content a.btn-app,
      .page-content button.btn-app {
        width: 104px !important;
        min-width: 104px !important;
        height: 100px !important;
        min-height: 100px !important;
        margin: 0 !important;
        padding: 12px 10px !important;
        border-radius: var(--radius) !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        line-height: 1.3 !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
      }
      .page-content .btn.btn-app:hover,
      .page-content a.btn-app:hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
      }
      .page-content .btn.btn-app > .ace-icon,
      .page-content .btn.btn-app > .fa,
      .page-content a.btn-app > .fa,
      .page-content a.btn-app > .ace-icon {
        display: block !important;
        margin: 0 0 8px !important;
        font-size: 28px !important;
        line-height: 1 !important;
        color: var(--primary) !important;
      }
      .page-content .btn.btn-app:hover > .ace-icon,
      .page-content .btn.btn-app:hover > .fa,
      .page-content a.btn-app:hover > .fa {
        color: #fff !important;
      }

      /* 表单：统一圆角；select 单独控制，避免小宽度分页下拉文字被 padding 截断 */
      input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="file"]):not([type="hidden"]):not([type="image"]):not([type="submit"]):not([type="button"]):not([type="reset"]),
      textarea,
      .form-control:not(select),
      .input-icon > input,
      .input-group .form-control:not(select),
      .chosen-single,
      .chosen-choices,
      .ace-spinner .input-group,
      .tags,
      .bootstrap-tagsinput,
      .editable-input input,
      .editable-input textarea {
        background: var(--input-bg) !important;
        border: var(--urppp-input-border, 1px solid var(--border)) !important;
        color: var(--text) !important;
        border-radius: var(--radius-sm) !important;
        padding: 6px 12px !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        height: auto !important;
        min-height: 32px !important;
        box-shadow: var(--urppp-input-shadow, none) !important;
        box-sizing: border-box !important;
      }
      select,
      select.form-control,
      .editable-input select {
        background-color: var(--input-bg) !important;
        border: var(--urppp-input-border, 1px solid var(--border)) !important;
        color: var(--text) !important;
        border-radius: var(--radius-sm) !important;
        padding: 4px 8px !important;
        font-size: 13px !important;
        line-height: 1.35 !important;
        height: 32px !important;
        min-height: 32px !important;
        max-width: 100% !important;
        box-shadow: var(--urppp-input-shadow, none) !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
        -webkit-appearance: menulist !important;
        appearance: menulist !important;
        text-overflow: ellipsis !important;
      }
      textarea {
        resize: vertical !important;
        min-height: 80px !important;
        padding: 10px 12px !important;
      }
      input[type="checkbox"], input[type="radio"] {
        border-radius: 4px !important;
        width: 15px !important;
        height: 15px !important;
        min-height: 0 !important;
        padding: 0 !important;
        accent-color: var(--primary) !important;
      }
      .input-group {
        border-radius: var(--radius-sm) !important;
      }
      .input-group .form-control {
        border-radius: 8px 0 0 8px !important;
      }
      .input-group .form-control:last-child,
      .input-group-btn:last-child > .btn {
        border-radius: 0 8px 8px 0 !important;
      }
      .input-group-addon {
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text-secondary) !important;
        border-radius: var(--radius-sm) !important;
      }
      .chosen-single, .chosen-choices {
        min-height: 34px !important;
        line-height: 34px !important;
        padding: 0 30px 0 12px !important;
        border-radius: var(--radius-sm) !important;
        box-sizing: border-box !important;
      }
      .chosen-single {
        display: block !important;
        height: 34px !important;
        position: relative !important;
      }
      .chosen-single span {
        display: block !important;
        margin-right: 26px !important;
        line-height: normal !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      /*
       * commoncss 原文：
       * .self div.profile-info-value a.chosen-single > span { line-height: 25px !important; }
       * 必须用同等或更高 specificity 才能压过
       */
      .self div.profile-info-value a.chosen-single > span,
      .self .profile-info-value a.chosen-single > span,
      .profile-user-info.self div.profile-info-value a.chosen-single > span,
      .profile-user-info.self .profile-info-value a.chosen-single > span,
      .urppp-query-form .urppp-query-pair .profile-info-value a.chosen-single > span,
      .urppp-query-pair .profile-info-value a.chosen-single > span,
      body .self div.profile-info-value a.chosen-single > span,
      html body .self div.profile-info-value a.chosen-single > span {
        line-height: normal !important;
        height: auto !important;
        margin: 0 26px 0 0 !important;
        padding: 0 !important;
        vertical-align: middle !important;
        display: block !important;
      }
      .self div.profile-info-value a.chosen-single,
      .profile-user-info.self .profile-info-value a.chosen-single,
      .urppp-query-pair a.chosen-single,
      body .self div.profile-info-value a.chosen-single,
      html body .chosen-container a.chosen-single {
        display: flex !important;
        align-items: center !important;
        height: 34px !important;
        min-height: 34px !important;
        line-height: normal !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        box-sizing: border-box !important;
      }
      .chosen-single div,
      .chosen-container-single .chosen-single div,
      body .chosen-container-single .chosen-single div,
      .urppp-query-pair .chosen-single div,
      .self .chosen-single div {
        position: absolute !important;
        top: 0 !important;
        bottom: 0 !important;
        right: 0 !important;
        width: 28px !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
      }
      /* 不用猜 sprite 偏移：把 b 变成居中盒子，背景图放中心 */
      .chosen-single div b,
      .chosen-container-single .chosen-single div b,
      body .chosen-container-single .chosen-single div b,
      .urppp-query-pair .chosen-single div b,
      .self .chosen-single div b {
        display: block !important;
        width: 14px !important;
        height: 14px !important;
        margin: 0 !important;
        padding: 0 !important;
        background-repeat: no-repeat !important;
        background-position: center center !important;
        background-size: 12px 12px !important;
      }
      .chosen-container {
        height: auto !important;
        min-height: 34px !important;
        vertical-align: middle !important;
        position: relative !important;
        box-sizing: border-box !important;
        font-size: 13px !important;
      }
      .chosen-container-single {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;
      }
      .chosen-drop {
        position: absolute !important;
        top: calc(100% + 6px) !important; /* 下移，避免挡住触发框 */
        left: 0 !important;
        z-index: 2000 !important; /* 高于相邻表单控件，点击选项不会穿透到下层 */
        box-sizing: border-box !important;
        border-radius: var(--radius-sm) !important;
        background: var(--surface) !important;
        border-color: var(--border) !important;
        box-shadow: var(--shadow) !important;
        margin-top: 0 !important;
        /* 不要写 display:block，否则关闭态也会一直露出来 */
      }
      .chosen-container,
      .chosen-container-single,
      .chosen-container-active {
        overflow: visible !important;
      }
      .chosen-container.chosen-with-drop .chosen-drop,
      .chosen-container-active.chosen-with-drop .chosen-drop {
        top: calc(100% + 6px) !important;
      }

      /* ============================================================
       * 空闲教室查询：右侧楼栋列表 #drag-ul
       * 一体式实心列表；高度随内容；当前项实色高亮
       * ============================================================ */
      #xq-section,
      #xq-section:has(#drag-ul) {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
        padding: 0 !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        align-self: flex-start !important;
      }
      /* 空列表 / 空容器不占位 */
      #drag-ul:empty,
      #xq-section:empty,
      #xq-section:not(:has(li)),
      #drag-ul.urppp-empty {
        display: none !important;
        height: 0 !important;
        min-height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        overflow: hidden !important;
      }
      #drag-ul,
      #drag-ul.urppp-drag-ul,
      #xq-section #drag-ul {
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        background: var(--surface) !important;
        border: none !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }
      /* 清掉站点 #drag-ul .border-common 的 float/固定宽高 */
      #drag-ul > li,
      #drag-ul > li.border-common,
      #drag-ul > li.ui-selectee,
      #drag-ul > li.jc-future,
      #drag-ul .border-common,
      #xq-section #drag-ul > li,
      #xq-section #drag-ul .border-common {
        float: none !important;
        clear: both !important;
        display: block !important;
        list-style: none !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        margin: 0 !important;
        padding: 0 12px !important;
        line-height: 36px !important;
        border: none !important;
        border-bottom: 1px solid var(--border) !important;
        border-left: 3px solid transparent !important;
        border-radius: 0 !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        text-align: left !important;
        cursor: pointer !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        opacity: 1 !important;
        transition: background .12s ease, color .12s ease, border-color .12s ease !important;
      }
      #drag-ul > li:last-child,
      #xq-section #drag-ul > li:last-child {
        border-bottom: none !important;
      }
      /* 校区标题（若有） */
      #drag-ul > li.xq-section,
      #xq-section #drag-ul > li.xq-section {
        height: 32px !important;
        min-height: 32px !important;
        max-height: 32px !important;
        line-height: 32px !important;
        padding: 0 12px !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary, var(--text-muted)) !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        cursor: default !important;
        border-bottom: 1px solid var(--border) !important;
        border-left-color: transparent !important;
      }
      #drag-ul > li.ui-selectee:hover,
      #drag-ul > li.border-common:hover,
      #drag-ul .border-common:hover,
      #xq-section #drag-ul > li:not(.xq-section):not(.jc-future):hover {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
        border-left-color: var(--primary) !important;
      }
      /* 当前选中：实色高亮，一眼能认 */
      #drag-ul > li.ui-selecting,
      #drag-ul > li.ui-selected,
      #drag-ul > li.urppp-building-active,
      #xq-section #drag-ul > li.ui-selected,
      #xq-section #drag-ul > li.urppp-building-active,
      body #drag-ul > li.ui-selected,
      body #drag-ul > li.urppp-building-active {
        background: var(--primary) !important;
        color: #fff !important;
        font-weight: 600 !important;
        border-left-color: var(--primary) !important;
        border-bottom-color: transparent !important;
      }
      #drag-ul > li.ui-selected:hover,
      #drag-ul > li.urppp-building-active:hover {
        background: var(--primary) !important;
        color: #fff !important;
      }
      /* 不可选：仍实心，弱化文字即可 */
      #drag-ul > li.jc-future,
      #xq-section #drag-ul > li.jc-future {
        color: var(--text-muted) !important;
        background: var(--surface) !important;
        cursor: default !important;
        opacity: 1 !important;
        border-left-color: transparent !important;
      }
      #drag-ul > li.jc-future:hover,
      #xq-section #drag-ul > li.jc-future:hover {
        background: var(--surface) !important;
        color: var(--text-muted) !important;
      }
      /* 覆盖站点 today.css 等对 .border-common 的固定宽高 */
      body #drag-ul .border-common,
      html body #xq-section #drag-ul .border-common {
        width: 100% !important;
        height: 36px !important;
        line-height: 36px !important;
        float: none !important;
        text-align: left !important;
        border: none !important;
        border-bottom: 1px solid var(--border) !important;
        border-left: 3px solid transparent !important;
        background: var(--surface) !important;
      }
      body #drag-ul .border-common.ui-selected,
      body #drag-ul .border-common.urppp-building-active {
        background: var(--primary) !important;
        color: #fff !important;
        border-left-color: var(--primary) !important;
      }

      /* ============================================================
       * 空闲教室：节次选择 #drag-ol（1-12）
       * ============================================================ */
      #drag-area,
      #drag-section {
        background: transparent !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      #drag-ol,
      ol#drag-ol {
        list-style: none !important;
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: stretch !important;
        gap: 0 !important;
        margin: 0 0 12px !important;
        padding: 0 !important;
        float: none !important;
        width: auto !important;
        max-width: 100% !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      /* 压过 today.css: #drag-ol .border-common {width:35/50px;height:30px;float:left;border:1px solid #aaa} */
      #drag-ol > li,
      #drag-ol > li.border-common,
      #drag-ol .border-common,
      ol#drag-ol > li.border-common,
      body #drag-ol .border-common,
      html body #drag-ol li.border-common {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        list-style: none !important;
        width: 40px !important;
        min-width: 40px !important;
        max-width: 48px !important;
        height: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 34px !important;
        text-align: center !important;
        border: none !important;
        border-right: 1px solid var(--border) !important;
        border-radius: 0 !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        user-select: none !important;
        transition: background .12s ease, color .12s ease !important;
      }
      #drag-ol > li:last-child,
      #drag-ol > li.drag-border-right,
      #drag-ol .border-common:last-child {
        border-right: none !important;
      }
      /* 已过节次：明显弱化，和可选区分开 */
      #drag-ol > li.jc-back,
      body #drag-ol li.jc-back,
      html body #drag-ol li.jc-back.border-common {
        background: color-mix(in srgb, var(--text-muted) 14%, var(--surface)) !important;
        color: var(--text-muted) !important;
        font-weight: 500 !important;
        opacity: 0.55 !important;
        text-decoration: line-through !important;
        text-decoration-thickness: 1px !important;
        cursor: default !important;
      }
      #drag-ol > li.jc-back:hover,
      body #drag-ol li.jc-back:hover {
        background: color-mix(in srgb, var(--text-muted) 14%, var(--surface)) !important;
        color: var(--text-muted) !important;
      }
      /* 可选 / 未来 */
      #drag-ol > li.jc-future,
      #drag-ol > li.ui-selectee,
      body #drag-ol li.jc-future {
        background: var(--surface) !important;
        color: var(--text) !important;
        cursor: pointer !important;
      }
      #drag-ol > li.ui-selectee:hover,
      #drag-ol > li.jc-future:hover,
      #drag-ol > li.border-common:hover {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
      }
      /* 框选中 / 选中 */
      #drag-ol > li.ui-selecting,
      #drag-ol > li.ui-selected,
      #drag-ol > li.current-week,
      body #drag-ol li.ui-selected,
      body #drag-ol li.ui-selecting {
        background: var(--primary) !important;
        color: #fff !important;
        font-weight: 700 !important;
        border-right-color: color-mix(in srgb, var(--primary) 70%, #000) !important;
      }
      /* ============================================================
       * 空闲教室 custom：星期/节次输入 + 垃圾桶、周次条 #test-drag
       * ============================================================ */
      /* 输入框 + 垃圾桶横排，垃圾桶在输入框后 */
      .profile-info-value > .dropdown,
      .profile-info-value .dropdown:has(#wSection),
      .profile-info-value .dropdown:has(#clearzc) {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        width: 100% !important;
        max-width: 100% !important;
        position: relative !important;
        float: none !important;
      }
      .profile-info-value .dropdown > #wSection,
      .profile-info-value .dropdown > input#wSection,
      .profile-info-value .dropdown > input.value_element {
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        order: 1 !important;
      }
      .profile-info-value .dropdown > #clearzc,
      .profile-info-value .dropdown > span#clearzc,
      #clearzc.btn {
        order: 2 !important;
        flex: 0 0 auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 34px !important;
        min-width: 34px !important;
        height: 34px !important;
        min-height: 34px !important;
        max-height: 34px !important;
        margin: 0 !important;
        padding: 0 !important;
        border-radius: var(--radius-sm) !important;
        float: none !important;
        position: static !important;
        vertical-align: middle !important;
      }
      .profile-info-value .dropdown > #clearzc > i,
      #clearzc .ace-icon,
      #clearzc .fa {
        margin: 0 !important;
        line-height: 1 !important;
      }
      /* 下拉面板仍绝对定位，不参与 flex 占位 */
      .profile-info-value .dropdown > .dropdown-menu,
      .profile-info-value .dropdown > #div-xqjc,
      .dropdown-menu.dropdown-self {
        order: 3 !important;
        position: absolute !important;
        top: calc(100% + 4px) !important;
        left: 0 !important;
        z-index: 1050 !important;
        min-width: 170px !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        box-shadow: var(--shadow) !important;
        padding: 6px !important;
        margin: 0 !important;
      }

      /* 周次条 #test-drag：与节次 #drag-ol 同风格 */
      #drag-select-div {
        overflow: visible !important;
      }
      #test-drag,
      ol#test-drag {
        list-style: none !important;
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: stretch !important;
        gap: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        float: none !important;
        width: auto !important;
        max-width: 100% !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      #test-drag > li,
      #test-drag > li.ui-widget-content,
      #test-drag li.ui-widget-content,
      ol#test-drag > li,
      body #test-drag li {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        list-style: none !important;
        width: 22px !important;
        min-width: 22px !important;
        max-width: 26px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        margin: 0 !important;
        padding: 0 !important;
        line-height: 28px !important;
        text-align: center !important;
        border: none !important;
        border-right: 1px solid var(--border) !important;
        border-radius: 0 !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
        user-select: none !important;
        transition: background .12s ease, color .12s ease !important;
      }
      #test-drag > li:last-child,
      #test-drag li:last-child {
        border-right: none !important;
      }
      /* 已过周次 */
      #test-drag > li.zc-back,
      body #test-drag li.zc-back {
        background: color-mix(in srgb, var(--text-muted) 14%, var(--surface)) !important;
        color: var(--text-muted) !important;
        font-weight: 500 !important;
        opacity: 0.55 !important;
        text-decoration: line-through !important;
        cursor: default !important;
      }
      /* 可选周次 */
      #test-drag > li.zc-future,
      #test-drag > li.ui-selectee,
      body #test-drag li.zc-future {
        background: var(--surface) !important;
        color: var(--text) !important;
        opacity: 1 !important;
        text-decoration: none !important;
        cursor: pointer !important;
      }
      #test-drag > li.zc-future:hover,
      #test-drag > li.ui-selectee:hover {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
      }
      /* 选中周次 */
      #test-drag > li.ui-selecting,
      #test-drag > li.ui-selected,
      body #test-drag li.ui-selected,
      body #test-drag li.ui-selecting {
        background: var(--primary) !important;
        color: #fff !important;
        font-weight: 700 !important;
        opacity: 1 !important;
        text-decoration: none !important;
        border-right-color: color-mix(in srgb, var(--primary) 70%, #000) !important;
      }

      /* Chosen 下拉：压过 commoncss/phone.css 的 25px，真正垂直居中 */
      .chosen-container .chosen-results,
      body .chosen-container .chosen-results {
        margin: 0 !important;
        padding: 4px 0 !important;
      }
      .chosen-container .chosen-results li,
      .chosen-container .chosen-results li.active-result,
      .chosen-container-single .chosen-results li,
      .chosen-container-multi .chosen-results li,
      body .chosen-container .chosen-results li,
      body .chosen-with-drop .chosen-results li {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
        width: 100% !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        margin: 0 !important;
        padding: 0 12px !important;
        line-height: 1 !important;
        font-size: 13px !important;
        color: var(--text) !important;
        box-sizing: border-box !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      body .chosen-container .chosen-results li em,
      .chosen-container .chosen-results li em {
        font-style: normal !important;
        line-height: 1 !important;
        vertical-align: middle !important;
      }
      body .chosen-container .chosen-results li.highlighted,
      body .chosen-container .chosen-results li.result-selected,
      .chosen-container .chosen-results li.highlighted,
      .chosen-container .chosen-results li.result-selected {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        line-height: 1 !important;
        padding: 0 12px !important;
        background: var(--primary) !important;
        color: #fff !important;
      }
      body .chosen-container .chosen-results li.highlighted em,
      body .chosen-container .chosen-results li.result-selected em {
        background: transparent !important;
        color: #fff !important;
        line-height: 1 !important;
      }
      .chosen-results li.no-results {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: 36px !important;
        line-height: 1 !important;
        background: var(--input-bg) !important;
        color: var(--text-muted) !important;
      }

      /* 搜索框：图标相对输入框垂直居中，不是相对整块 padding 区域 */
      .chosen-container .chosen-search,
      .chosen-container-single .chosen-search,
      .chosen-with-drop .chosen-search,
      .chosen-search {
        position: relative !important;
        margin: 0 !important;
        padding: 8px !important;
        box-sizing: border-box !important;
      }
      .chosen-container .chosen-search input[type="text"],
      .chosen-container-single .chosen-search input[type="text"],
      .chosen-container .chosen-search input,
      .chosen-container-single .chosen-search input,
      .chosen-with-drop .chosen-search input,
      body .chosen-container .chosen-search input {
        width: 100% !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        padding: 0 34px 0 10px !important;
        line-height: 34px !important;
        font-size: 13px !important;
        border-radius: var(--radius-sm) !important;
        border: 1px solid var(--border) !important;
        background-color: var(--input-bg) !important;
        background-image: none !important;
        color: var(--text) !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
      }
      /* 关掉伪元素图标 */
      .chosen-container .chosen-search:after,
      .chosen-container-single .chosen-search:after,
      .chosen-with-drop .chosen-search:after,
      body .chosen-container .chosen-search:after,
      .chosen-search:before,
      .chosen-search:after {
        content: none !important;
        display: none !important;
      }
      /* 图标盒子与 input 同高同顶，内容垂直居中 */
      .chosen-container .chosen-search,
      .chosen-container-single .chosen-search,
      .chosen-with-drop .chosen-search {
        position: relative !important;
        padding: 8px !important;
        box-sizing: border-box !important;
      }
      .urppp-chosen-search-icon {
        position: absolute !important;
        top: 8px !important;          /* 与 search padding-top 对齐 */
        right: 18px !important;
        width: 14px !important;
        height: 34px !important;      /* 与 input 高度一致 */
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 13px !important;
        line-height: 1 !important;
        color: var(--text-muted) !important;
        pointer-events: none !important;
        z-index: 5 !important;
        transform: none !important;
      }

      input:focus, select:focus, textarea:focus, .form-control:focus,
      .chosen-container-active .chosen-single, .chosen-container-active .chosen-choices {
        border-color: var(--border-focus) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
        outline: none !important;
      }
      label { color: var(--text-secondary) !important; font-weight: 500 !important; font-size: 13px !important; }

      /* 查询表单：保留 Bootstrap 栅格，只做垂直居中与统一高度 */
      .form-horizontal .form-group,
      form .form-group,
      .form-group {
        display: block !important;
        margin-left: -12px !important;
        margin-right: -12px !important;
        margin-bottom: 12px !important;
      }
      .form-group:before,
      .form-group:after,
      .form-horizontal .form-group:before,
      .form-horizontal .form-group:after {
        content: " " !important;
        display: table !important;
      }
      .form-group:after,
      .form-horizontal .form-group:after {
        clear: both !important;
      }
      .form-group > [class*="col-"],
      .form-horizontal .form-group > [class*="col-"] {
        float: left !important;
        display: block !important;
        position: relative !important;
        min-height: 1px !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        box-sizing: border-box !important;
      }
      .form-group > .col-sm-3,
      .form-group > .col-xs-3,
      .form-group > .col-md-3,
      .form-horizontal .form-group > .col-sm-3,
      .form-horizontal .form-group > .col-xs-3,
      .form-horizontal .form-group > .col-md-3 {
        width: 25% !important;
        text-align: right !important;
      }
      .form-group > .col-sm-9,
      .form-group > .col-xs-9,
      .form-group > .col-md-9,
      .form-horizontal .form-group > .col-sm-9,
      .form-horizontal .form-group > .col-xs-9,
      .form-horizontal .form-group > .col-md-9 {
        width: 75% !important;
        text-align: left !important;
      }
      .form-horizontal .control-label,
      .form-group .control-label,
      label.control-label,
      .form-group > [class*="col-"] > label {
        display: block !important;
        float: none !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        height: 34px !important;
        line-height: 34px !important;
        text-align: right !important;
        color: var(--text-secondary) !important;
        font-weight: 500 !important;
        font-size: 13px !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        box-sizing: border-box !important;
      }
      .form-group input:not([type="checkbox"]):not([type="radio"]),
      .form-group select,
      .form-group .form-control,
      .form-horizontal input:not([type="checkbox"]):not([type="radio"]),
      .form-horizontal select,
      .form-horizontal .form-control {
        display: inline-block !important;
        width: 100% !important;
        max-width: 100% !important;
        height: 34px !important;
        min-height: 34px !important;
        margin: 0 !important;
        vertical-align: middle !important;
        box-sizing: border-box !important;
      }
      .form-group textarea,
      .form-horizontal textarea {
        height: auto !important;
        min-height: 80px !important;
      }
      .form-group .chosen-container,
      .form-horizontal .chosen-container {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        top: 0 !important;
        vertical-align: middle !important;
      }
      .form-group .chosen-container .chosen-single,
      .form-horizontal .chosen-container .chosen-single,
      .form-group .chosen-container-single .chosen-single,
      .form-horizontal .chosen-container-single .chosen-single {
        height: 34px !important;
        min-height: 34px !important;
        line-height: 32px !important;
        padding: 0 30px 0 12px !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      .form-group .chosen-container-single .chosen-single span,
      .form-horizontal .chosen-container-single .chosen-single span {
        display: block !important;
        line-height: 32px !important;
        margin-right: 26px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      .form-group .chosen-container-single .chosen-single div,
      .form-horizontal .chosen-container-single .chosen-single div {
        top: 0 !important;
        height: 100% !important;
        width: 28px !important;
      }
      .form-group .chosen-container-single .chosen-single div b,
      .form-horizontal .chosen-container-single .chosen-single div b {
        background-position: 0 0 !important;
      }
      /* 查询区两列时更稳 */
      .form-horizontal .col-sm-6 .form-group > .col-sm-3,
      .form-horizontal .col-xs-6 .form-group > .col-sm-3 {
        width: 33.333333% !important;
      }
      .form-horizontal .col-sm-6 .form-group > .col-sm-9,
      .form-horizontal .col-xs-6 .form-group > .col-sm-9 {
        width: 66.666667% !important;
      }

      /* Alert 关闭叉：垂直居中对齐 */
      .alert {
        position: relative !important;
        padding: 12px 40px 12px 16px !important;
        border-radius: 10px !important;
        display: block !important;
        line-height: 1.5 !important;
      }
      .alert .close,
      .alert button.close {
        position: absolute !important;
        top: 50% !important;
        right: 12px !important;
        transform: translateY(-50%) !important;
        float: none !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 24px !important;
        height: 24px !important;
        line-height: 22px !important;
        text-align: center !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        color: inherit !important;
        opacity: 0.55 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        cursor: pointer !important;
      }
      .alert .close:hover,
      .alert button.close:hover {
        opacity: 0.9 !important;
        color: inherit !important;
      }

      /* 标签页：只保留一条圆角条，避免 navbar 外壳 + nav-tabs 双层色块 */
      .tabbable,
      .tabbable-custom,
      .tabbable-line,
      .widget-body > .tabbable,
      .page-content .tabbable {
        margin: 0 0 16px !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }

      /* ACE 外壳 #navbar-example：完全透明，不画第二条 */
      .page-content .navbar.navbar-static,
      .page-content #navbar-example,
      .page-content .navbar-example,
      #page-content-template .navbar.navbar-static,
      #page-content-template #navbar-example {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        margin: 0 0 14px !important;
        padding: 0 !important;
        min-height: 0 !important;
        height: auto !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        position: relative !important;
        left: 0 !important;
        z-index: 1 !important;
      }
      .page-content .navbar.navbar-static .navbar-inner,
      .page-content #navbar-example .navbar-inner,
      #page-content-template .navbar.navbar-static .navbar-inner {
        background: transparent !important;
        background-image: none !important;
        border: none !important;
        box-shadow: none !important;
        filter: none !important;
        padding: 0 !important;
        margin: 0 !important;
        min-height: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .page-content .navbar.navbar-static .container,
      .page-content #navbar-example .container,
      #page-content-template .navbar.navbar-static .container,
      .page-content .navbar.navbar-static .container-fluid,
      .page-content #navbar-example .container-fluid {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        box-sizing: border-box !important;
      }

      /* 唯一色块：nav-tabs 自身 */
      .page-content .navbar.navbar-static .nav-tabs,
      .page-content #navbar-example .nav-tabs,
      .page-content ul.nav.nav-tabs,
      .page-content .nav.nav-tabs,
      .tabbable > .nav-tabs,
      .widget-body > .nav-tabs,
      .self-margin > .nav-tabs,
      ul.nav.nav-tabs {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 6px !important;
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 14px !important;
        padding: 8px 10px !important;
        box-sizing: border-box !important;
        list-style: none !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        background-image: none !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        position: static !important;
        top: auto !important;
      }
      /* 外壳已有下边距时，内部 tabs 不再重复 margin-bottom */
      .page-content .navbar.navbar-static .nav-tabs,
      .page-content #navbar-example .nav-tabs {
        margin-bottom: 0 !important;
      }
      .nav-tabs > li,
      .nav.nav-tabs > li {
        float: none !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
      }
      .nav-tabs > li > a,
      .nav-tabs > li > a:link,
      .nav-tabs > li > a:visited {
        color: var(--text-secondary) !important;
        background: transparent !important;
        border: 1px solid transparent !important;
        border-radius: var(--radius-sm) !important;
        margin: 0 !important;
        padding: 7px 14px !important;
        line-height: 1.35 !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        box-shadow: none !important;
        position: static !important;
        top: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        white-space: nowrap !important;
      }
      .nav-tabs > li > a:hover,
      .nav-tabs > li > a:focus {
        color: var(--text) !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
      }
      .nav-tabs > li.active > a,
      .nav-tabs > li.active > a:hover,
      .nav-tabs > li.active > a:focus,
      .nav-tabs > li.active > a:active {
        color: var(--primary) !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        font-weight: 600 !important;
        box-shadow: none !important;
        z-index: auto !important;
      }
      .tab-content,
      .tabbable > .tab-content,
      .page-content .tab-content {
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .tab-content > .tab-pane {
        padding: 0 !important;
        background: transparent !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }

      /* layui 页面提示 toast / msg */
      .layui-layer.layui-layer-dialog.layui-layer-msg,
      .layui-layer.layui-layer-msg,
      .layui-layer-msg {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      .layui-layer-msg .layui-layer-content,
      .layui-layer-dialog.layui-layer-msg .layui-layer-content {
        background: var(--surface) !important;
        color: var(--text) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.03) !important;
        padding: 12px 18px !important;
        min-height: 0 !important;
        line-height: 1.5 !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        max-width: min(420px, 86vw) !important;
        word-break: break-word !important;
      }
      .layui-layer-msg .layui-layer-content .layui-layer-ico,
      .layui-layer-msg .layui-layer-ico {
        position: static !important;
        display: inline-block !important;
        width: 18px !important;
        height: 18px !important;
        margin: 0 !important;
        background-size: 18px 18px !important;
        flex: 0 0 18px !important;
      }
      .layui-layer-hui .layui-layer-content {
        background: rgba(15, 23, 42, 0.88) !important;
        color: #fff !important;
        border: none !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.22) !important;
        padding: 12px 18px !important;
      }

      /* 弹窗：只美化外观；display 尽量交给 Bootstrap */
      /* 仅兜底关闭态 fade 且无 in/show，避免假弹窗常驻；不要强制 .in{display:block} 以免干扰打开动画 */
      .modal.fade:not(.in):not(.show) {
        display: none !important;
      }
      .modal-dialog {
        z-index: 1051 !important;
      }
      .modal-content {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 8px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04) !important;
      }
      .modal-header {
        border-bottom: 1px solid var(--border) !important;
        padding: 16px 20px !important;
        background: var(--surface) !important;
      }
      .modal-header .close,
      .modal-header button.close {
        color: var(--text-secondary) !important;
        opacity: 0.75 !important;
        text-shadow: none !important;
      }
      .modal-header .close:hover,
      .modal-header button.close:hover {
        opacity: 1 !important;
        color: var(--text) !important;
      }
      .modal-title {
        color: var(--text) !important;
        font-weight: 600 !important;
        font-size: 16px !important;
      }
      .modal-body { padding: 20px !important; background: var(--surface) !important; color: var(--text) !important; }
      .modal-footer { border-top: 1px solid var(--border) !important; padding: 16px 20px !important; background: var(--surface) !important; }
      .modal-backdrop {
        z-index: 1040 !important;
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      .modal-backdrop.in,
      .modal-backdrop.show {
        opacity: 0.45 !important;
        pointer-events: auto !important;
      }
      /* 打开态 modal 外壳可点空白关闭；内容 dialog 正常接收点击 */
      .modal.in,
      .modal.show {
        pointer-events: auto !important;
      }
      .modal.in .modal-dialog,
      .modal.show .modal-dialog {
        pointer-events: auto !important;
      }
      /* 保证 modal 全屏层可点到两侧空白（不要让子元素铺满拦截） */
      .modal.in > .modal-dialog,
      .modal.show > .modal-dialog {
        pointer-events: auto !important;
      }


      /* ============================================================
       * 学籍页右侧滑出面板：培养方案 / 课表信息抽屉
       * #curriculumInfo-divcon / #curriculumInfo-divcon1 / #curriculumInfo-divcon2
       * ============================================================ */
      /*
       * 右侧滑出面板：只改颜色/阴影，绝不锁 right/width/opacity/display
       * 站点关闭态是 right:-70% / width:0 等 inline；教室/培养方案依赖 jQuery animate
       */
      #curriculumInfo-divcon,
      #curriculumInfo-divcon1,
      #curriculumInfo-divcon2,
      #calssInfo-divcon,
      #classroomInfo-divcon,
      #billContainer {
        background: var(--bg) !important;
        border-left: 1px solid var(--border) !important;
        box-shadow: -12px 0 40px rgba(15, 23, 42, 0.14) !important;
        z-index: 1050 !important;
        box-sizing: border-box !important;
        border-radius: 0 !important;
        float: none !important;
        /* 标题按钮需要可见：不要裁切顶部操作区 */
        overflow-x: hidden !important;
        overflow-y: auto !important;
        /* 不写 position/top/right/bottom/width/height !important */
      }

      /* 教学评估结果侧滑抽屉：站点 position:fixed + right 动画，绝不能当普通卡片 */
      #billContainer {
        position: fixed !important;
        top: 0 !important;
        bottom: 0 !important;
        height: 100% !important;
        max-height: 100vh !important;
        width: 50% !important;
        margin: 0 !important;
        border: none !important;
        border-left: 1px solid var(--border) !important;
        border-radius: 0 !important;
        background: var(--surface) !important;
        box-shadow: -12px 0 40px rgba(15, 23, 42, 0.14) !important;
        overflow-x: hidden !important;
        overflow-y: auto !important;
        z-index: 1050 !important;
        box-sizing: border-box !important;
        float: none !important;
        /* 不写 right/left/display：关闭态 right:-100%，打开 animate right:0% */
      }
      #billContainer .div-title {
        width: 100% !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 5 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        min-height: 56px !important;
        margin: 0 !important;
        padding: 10px 16px 10px 20px !important;
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
        box-sizing: border-box !important;
      }
      #billContainer .div-title h3,
      #billContainer .div-title h4,
      #billContainer .div-title h5 {
        margin: 0 !important;
        padding: 0 !important;
        color: var(--text) !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        text-indent: 0 !important;
      }
      #billContainer .div-title span {
        position: static !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: auto !important;
        min-width: 32px !important;
        height: 28px !important;
        margin: 0 !important;
        padding: 0 8px !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        cursor: pointer !important;
        line-height: 1 !important;
      }
      #billContainer .row {
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
      #billContainer .col-xs-12 {
        width: 100% !important;
        float: none !important;
        padding-left: 12px !important;
        padding-right: 12px !important;
      }

      /* 培养方案查询页抽屉 #curriculumInfo-divcon：只美化，不重组 DOM */
      #curriculumInfo-divcon .div-title,
      #curriculumInfo-divcon > .row > .div-title {
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
      }
      #curriculumInfo-divcon .div-title h5,
      #curriculumInfo-divcon .div-title a,
      #curriculumInfo-divcon .div-title i {
        color: var(--text-secondary) !important;
      }
      #curriculumInfo-divcon .col-xs-6 {
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon #treeDemo.ztree,
      #curriculumInfo-divcon .ztree {
        color: var(--text) !important;
      }
      #curriculumInfo-divcon .profile-user-info,
      #curriculumInfo-divcon .profile-user-info-striped {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon .profile-info-value,
      #curriculumInfo-divcon .profile-info-value > span,
      #curriculumInfo-divcon span.editable {
        color: var(--text) !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      #curriculumInfo-divcon .profile-info-name {
        color: var(--text-secondary) !important;
      }
      #curriculumInfo-divcon h4.header {
        margin-bottom: 10px !important;
      }
      #curriculumInfo-divcon > .div-title,
      #curriculumInfo-divcon1 > .div-title,
      #curriculumInfo-divcon2 > .div-title,
      #calssInfo-divcon > .div-title,
      #classroomInfo-divcon > .div-title {
        width: 100% !important;
        position: sticky !important;
        top: 0 !important;
        z-index: 5 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        flex-wrap: nowrap !important;
        min-height: 56px !important;
        height: auto !important;
        padding: 10px 16px 10px 20px !important;
        margin: 0 !important;
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        gap: 10px !important;
      }
      /* 课表信息抽屉标题行：右侧按钮完整可见，不被裁切 */
      #calssInfo-divcon > .div-title,
      #classroomInfo-divcon > .div-title {
        padding-right: 18px !important;
      }
      #calssInfo-divcon > .div-title .right_top_oper,
      #classroomInfo-divcon > .div-title .right_top_oper,
      #curriculumInfo-divcon > .div-title .right_top_oper,
      #curriculumInfo-divcon1 > .div-title .right_top_oper,
      #curriculumInfo-divcon2 > .div-title .right_top_oper,
      #calssInfo-divcon .div-title .right_top_oper,
      #classroomInfo-divcon .div-title .right_top_oper {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex: 0 0 auto !important;
        gap: 8px !important;
        float: none !important;
        position: static !important;
        margin: 0 !important;
        max-width: none !important;
        overflow: visible !important;
        white-space: nowrap !important;
      }
      #calssInfo-divcon > .div-title .right_top_oper .btn,
      #classroomInfo-divcon > .div-title .right_top_oper .btn,
      #calssInfo-divcon .div-title .btn,
      #classroomInfo-divcon .div-title .btn,
      #calssInfo-divcon > .div-title a.btn,
      #classroomInfo-divcon > .div-title a.btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 30px !important;
        min-height: 30px !important;
        max-height: 30px !important;
        padding: 0 12px !important;
        margin: 0 !important;
        float: none !important;
        position: static !important;
        overflow: visible !important;
        white-space: nowrap !important;
        line-height: 1 !important;
        font-size: 12px !important;
        border-radius: var(--radius-sm) !important;
        flex: 0 0 auto !important;
      }
      #calssInfo-divcon > .div-title h3,
      #classroomInfo-divcon > .div-title h3,
      #calssInfo-divcon > .div-title h4,
      #classroomInfo-divcon > .div-title h4,
      #calssInfo-divcon > .div-title h5,
      #classroomInfo-divcon > .div-title h5 {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
      }
      #curriculumInfo-divcon > .div-title h3,
      #curriculumInfo-divcon1 > .div-title h3,
      #curriculumInfo-divcon2 > .div-title h3 {
        margin: 0 !important;
        padding: 0 !important;
        text-indent: 0 !important;
        font-size: 16px !important;
        font-weight: 650 !important;
        line-height: 1.3 !important;
        color: var(--text) !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      #curriculumInfo-divcon > .div-title h3::before,
      #curriculumInfo-divcon1 > .div-title h3::before,
      #curriculumInfo-divcon2 > .div-title h3::before {
        content: '' !important;
        display: inline-block !important;
        width: 3px !important;
        height: 16px !important;
        border-radius: 2px !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      #curriculumInfo-divcon > .div-title span,
      #curriculumInfo-divcon1 > .div-title span,
      #curriculumInfo-divcon2 > .div-title span {
        position: static !important;
        right: auto !important;
        top: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 32px !important;
        height: 32px !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        cursor: pointer !important;
        line-height: 1 !important;
        text-indent: 0 !important;
      }
      #curriculumInfo-divcon > .div-title span:hover,
      #curriculumInfo-divcon1 > .div-title span:hover,
      #curriculumInfo-divcon2 > .div-title span:hover {
        border-color: var(--primary) !important;
        color: var(--primary) !important;
        background: color-mix(in srgb, var(--primary) 8%, var(--surface)) !important;
      }
      #curriculumInfo-divcon > .modal-body,
      #curriculumInfo-divcon1 > .modal-body,
      #curriculumInfo-divcon2 > .modal-body,
      #curriculumInfo-divcon2 .modal-body.no-padding {
        height: calc(100% - 56px) !important;
        max-height: calc(100vh - 56px) !important;
        overflow: auto !important;
        padding: 16px !important;
        background: var(--bg) !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .modal-body.no-padding > .col-xs-12 {
        width: 100% !important;
        float: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      #curriculumInfo-divcon2 .modal-body .row,
      #curriculumInfo-divcon2 .modal-body .row.urppp-drawer-layout {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .modal-body .row > p,
      #curriculumInfo-divcon2 .urppp-drawer-toolbar {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        color: var(--text-secondary) !important;
        font-size: 13px !important;
      }
      #curriculumInfo-divcon2 .modal-body .row > p a,
      #curriculumInfo-divcon2 .urppp-drawer-toolbar a {
        color: var(--primary) !important;
        text-decoration: none !important;
        font-weight: 500 !important;
      }
      #curriculumInfo-divcon2 .modal-body .row > p a:hover,
      #curriculumInfo-divcon2 .urppp-drawer-toolbar a:hover {
        text-decoration: underline !important;
      }
      /* 固定左右两栏：左树 | 右详情（详情内部只纵向一列） */
      #curriculumInfo-divcon2 .urppp-drawer-body {
        display: flex !important;
        flex-direction: row !important;
        align-items: flex-start !important;
        gap: 14px !important;
        width: 100% !important;
        min-height: 0 !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-left,
      #curriculumInfo-divcon2 .urppp-drawer-right {
        float: none !important;
        flex: 1 1 0 !important;
        width: 0 !important; /* 配合 flex:1 均分，避免内容撑破 */
        max-width: none !important;
        min-width: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-left {
        position: sticky !important;
        top: 0 !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-right {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
      }
      /* 右栏子块绝不再 50% 并排 */
      #curriculumInfo-divcon2 .urppp-drawer-right > * {
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .urppp-drawer-right > .col-xs-6,
      #curriculumInfo-divcon2 .urppp-drawer-right > #fajh,
      #curriculumInfo-divcon2 .urppp-drawer-right > #xnxq,
      #curriculumInfo-divcon2 .urppp-drawer-right > #kz,
      #curriculumInfo-divcon2 .urppp-drawer-right > #kc,
      #curriculumInfo-divcon2 .urppp-drawer-right > #kcfa {
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-sizing: border-box !important;
      }
      /* 兼容未包 wrapper 的旧结构：直接子级 col 不再并排交错 */
      #curriculumInfo-divcon2 .modal-body .row:not(.urppp-drawer-layout) > .col-xs-6 {
        float: none !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 12px !important;
        padding: 0 !important;
      }
      #curriculumInfo-divcon2 .modal-body .widget-box,
      #curriculumInfo-divcon2 #fajh .widget-box,
      #curriculumInfo-divcon2 #xnxq .widget-box,
      #curriculumInfo-divcon2 #kz .widget-box,
      #curriculumInfo-divcon2 #kc .widget-box,
      #curriculumInfo-divcon2 #kcfa .widget-box {
        margin: 0 0 12px !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        background: var(--surface) !important;
        box-shadow: none !important;
        overflow: hidden !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .modal-body .widget-box.transparent,
      #curriculumInfo-divcon2 #fajh .widget-box.transparent {
        border: none !important;
        background: transparent !important;
        overflow: visible !important;
        margin-bottom: 8px !important;
      }
      #curriculumInfo-divcon2 .widget-header,
      #curriculumInfo-divcon2 .widget-header-small {
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
        padding: 10px 14px !important;
        min-height: 0 !important;
      }
      #curriculumInfo-divcon2 .widget-box.transparent,
      #curriculumInfo-divcon2 #fajh .widget-box.transparent,
      #curriculumInfo-divcon2 #xnxq .widget-box.transparent,
      #curriculumInfo-divcon2 #kz .widget-box.transparent,
      #curriculumInfo-divcon2 #kc .widget-box.transparent,
      #curriculumInfo-divcon2 #kcfa .widget-box.transparent {
        border: none !important;
        background: transparent !important;
        overflow: visible !important;
        margin: 0 0 8px !important;
        box-shadow: none !important;
        border-radius: 0 !important;
      }
      #curriculumInfo-divcon2 .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #fajh .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #xnxq .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #kz .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #kc .widget-box.transparent .widget-header,
      #curriculumInfo-divcon2 #kcfa .widget-box.transparent .widget-header {
        border: none !important;
        border-bottom: none !important;
        padding: 0 !important;
        margin: 0 0 8px !important;
        min-height: 0 !important;
        background: transparent !important;
        display: flex !important;
        align-items: center !important;
      }
      #curriculumInfo-divcon2 .widget-title,
      #curriculumInfo-divcon2 h4.widget-title,
      #curriculumInfo-divcon2 h4.widget-title.smaller,
      #curriculumInfo-divcon2 h4.widget-title.grey {
        margin: 0 !important;
        padding: 0 !important;
        color: var(--text) !important;
        font-size: 14px !important;
        font-weight: 650 !important;
        line-height: 1.35 !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        float: none !important;
        width: auto !important;
        max-width: 100% !important;
        background: transparent !important;
        border: none !important;
      }
      #curriculumInfo-divcon2 .widget-box.transparent .widget-title::before,
      #curriculumInfo-divcon2 #fajh .widget-title::before,
      #curriculumInfo-divcon2 #xnxq .widget-title::before,
      #curriculumInfo-divcon2 #kz .widget-title::before,
      #curriculumInfo-divcon2 #kc .widget-title::before,
      #curriculumInfo-divcon2 #kcfa .widget-title::before {
        content: '' !important;
        display: inline-block !important;
        width: 3px !important;
        height: 14px !important;
        border-radius: 2px !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      /* 左树标题栏若为空，压低高度 */
      #curriculumInfo-divcon2 .urppp-drawer-left .widget-header:has(h4:empty),
      #curriculumInfo-divcon2 .urppp-drawer-left .widget-header:has(.widget-title:empty) {
        display: none !important;
      }
      #curriculumInfo-divcon2 .widget-body {
        background: var(--surface) !important;
        padding: 8px 10px 12px !important;
      }
      #curriculumInfo-divcon2 #treeDemo.ztree,
      #curriculumInfo-divcon2 .ztree {
        padding: 4px 2px !important;
        background: transparent !important;
        max-height: calc(100vh - 180px) !important;
        overflow: auto !important;
      }
      /* 右侧详情卡：方案计划 / 课组 / 课程 / 课程方案 — 全部拉满右栏 */
      #curriculumInfo-divcon2 #fajh,
      #curriculumInfo-divcon2 #xnxq,
      #curriculumInfo-divcon2 #kz,
      #curriculumInfo-divcon2 #kc,
      #curriculumInfo-divcon2 #kcfa {
        min-width: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 #fajh .profile-user-info,
      #curriculumInfo-divcon2 #fajh .profile-user-info-striped,
      #curriculumInfo-divcon2 #xnxq .profile-user-info,
      #curriculumInfo-divcon2 #xnxq .profile-user-info-striped,
      #curriculumInfo-divcon2 #kz .profile-user-info,
      #curriculumInfo-divcon2 #kz .profile-user-info-striped,
      #curriculumInfo-divcon2 #kc .profile-user-info,
      #curriculumInfo-divcon2 #kc .profile-user-info-striped,
      #curriculumInfo-divcon2 #kcfa .profile-user-info,
      #curriculumInfo-divcon2 #kcfa .profile-user-info-striped,
      #curriculumInfo-divcon2 .profile-user-info.self,
      #curriculumInfo-divcon2 .profile-user-info-striped {
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
        background: var(--surface) !important;
        margin: 0 0 12px !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        display: block !important;
      }
      #curriculumInfo-divcon2 .profile-info-row {
        display: grid !important;
        grid-template-columns: 112px minmax(0, 1fr) !important;
        align-items: stretch !important;
        border-bottom: 1px solid var(--border) !important;
        min-height: 40px !important;
        width: 100% !important;
        max-width: 100% !important;
        float: none !important;
        box-sizing: border-box !important;
      }
      #curriculumInfo-divcon2 .profile-info-row:last-child {
        border-bottom: none !important;
      }
      #curriculumInfo-divcon2 .profile-info-row::before,
      #curriculumInfo-divcon2 .profile-info-row::after {
        content: none !important;
        display: none !important;
      }
      #curriculumInfo-divcon2 .profile-info-name {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        width: auto !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 8px 12px !important;
        background: var(--input-bg) !important;
        border-right: 1px solid var(--border) !important;
        color: var(--text-secondary) !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        white-space: nowrap !important;
      }
      #curriculumInfo-divcon2 .profile-info-value {
        float: none !important;
        display: flex !important;
        align-items: center !important;
        margin: 0 !important;
        margin-left: 0 !important;
        width: auto !important;
        min-width: 0 !important;
        padding: 8px 12px !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        font-size: 13px !important;
        line-height: 1.45 !important;
        word-break: break-word !important;
        white-space: normal !important;
      }
      @media (max-width: 1100px) {
        #curriculumInfo-divcon2 .urppp-drawer-body {
          flex-direction: column !important;
        }
        #curriculumInfo-divcon2 .urppp-drawer-left,
        #curriculumInfo-divcon2 .urppp-drawer-right {
          width: 100% !important;
          flex: 1 1 auto !important;
        }
      }

      /* 作息时间表：干净利落 + 全居中（不改 DOM 结构） */

      /* ============================================================
       * 本学期周课表：周次滑条 + 课程块对齐
       * ============================================================ */
      /* 站点写死 #soliderbox.container {width:300%} 会把滑条拖到全宽外 */
      #soliderbox.container,
      #soliderbox,
      .profile-info-value > #soliderbox,
      .profile-info-row #soliderbox {
        width: 100% !important;
        max-width: 720px !important;
        min-width: 0 !important;
        margin: 8px 0 4px !important;
        padding: 8px 12px 22px !important;
        box-sizing: border-box !important;
        float: none !important;
        overflow: visible !important;
      }
      .profile-info-row:has(#soliderbox) {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 0 16px !important;
        padding: 12px 16px !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-sizing: border-box !important;
      }
      .profile-info-row:has(#soliderbox) .profile-info-name {
        float: none !important;
        width: auto !important;
        min-width: 72px !important;
        flex: 0 0 auto !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        margin: 0 !important;
        color: var(--text) !important;
        font-weight: 600 !important;
      }
      .profile-info-row:has(#soliderbox) .profile-info-value {
        float: none !important;
        flex: 1 1 auto !important;
        width: auto !important;
        min-width: 0 !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
      }
      /* r-slider 主题色 */
      #soliderbox .r-slider-line {
        background: var(--border) !important;
        height: 6px !important;
        border-radius: 999px !important;
      }
      #soliderbox .r-slider-fill {
        background: var(--primary) !important;
        height: 6px !important;
        border-radius: 999px !important;
      }
      #soliderbox .r-slider-button {
        background: var(--primary) !important;
        border: 2px solid #fff !important;
        box-shadow: 0 1px 4px rgba(15,23,42,0.2) !important;
        width: 16px !important;
        height: 16px !important;
      }
      #soliderbox .r-slider-label,
      #soliderbox .r-slider-text {
        color: var(--text-muted) !important;
        font-size: 11px !important;
      }
      #soliderbox .r-slider-number {
        background: var(--text) !important;
        color: #fff !important;
      }
      /* 课表：td 作为定位容器，课程块相对单元格对齐 */
      #mycoursetable {
        position: relative !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow-x: auto !important;
        box-sizing: border-box !important;
      }
      #mycoursetable > table,
      #mycoursetable table#courseTable,
      #courseTable {
        width: 100% !important;
        max-width: 100% !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        box-sizing: border-box !important;
      }
      #mycoursetable td,
      #mycoursetable th,
      #courseTable td,
      #courseTable th {
        position: relative !important;
        vertical-align: top !important;
        box-sizing: border-box !important;
        overflow: visible !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      #mycoursetable th,
      #courseTable th {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        color: var(--text) !important;
      }
      /* 课程块相对父 td：默认 left/top=0，避免站点先写大 offset 再纠正造成右闪 */
      #mycoursetable div.class_div,
      #courseTable div.class_div {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: auto !important;
        bottom: auto !important;
        transform: none !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        border-radius: var(--radius-sm) !important;
        z-index: 2 !important;
        margin: 0 !important;
      }
      /* 同格两门课时由 JS 写 left/width；未写前也先铺满格，不飞到页右侧 */
      #mycoursetable td > div.class_div:only-of-type,
      #courseTable td > div.class_div:only-of-type {
        left: 0 !important;
        width: 100% !important;
      }
      #mycoursetable div.class_div p,
      #courseTable div.class_div p {
        margin: 2px 4px !important;
        line-height: 1.35 !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        white-space: normal !important;
      }
      /* 作息表弹窗：禁止锁 display，否则 Bootstrap 关不掉 */
      #work_rest_schedule_modal.modal {
        /* display 完全交给 .in/.show 与 Bootstrap */
      }
      #work_rest_schedule_modal.modal.fade:not(.in):not(.show) {
        display: none !important;
      }
      #work_rest_schedule_modal .modal-dialog {
        width: 720px !important;
        max-width: 94vw !important;
        margin: 48px auto !important;
      }
      #work_rest_schedule_modal .modal-content {
        position: relative !important;
        border-radius: 14px !important;
        border: 1px solid var(--border) !important;
        box-shadow: 0 16px 48px rgba(0,0,0,0.14) !important;
        background: var(--surface) !important;
        overflow: hidden !important;
      }
      #work_rest_schedule_modal .modal-header {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 52px !important;
        padding: 14px 48px !important;
        background: var(--surface) !important;
        border-bottom: 1px solid var(--border) !important;
        position: relative !important;
      }
      #work_rest_schedule_modal .modal-title {
        margin: 0 auto !important;
        width: 100% !important;
        text-align: center !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        color: var(--text) !important;
        line-height: 1.3 !important;
      }
      #work_rest_schedule_modal .modal-header .close {
        position: absolute !important;
        right: 16px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        margin: 0 !important;
        opacity: 0.6 !important;
        float: none !important;
      }
      #work_rest_schedule_modal .modal-body {
        padding: 16px 18px 18px !important;
        background: var(--bg) !important;
        max-height: 75vh !important;
        overflow: auto !important;
      }
      #work_rest_schedule_modal .modal-body > h3,
      #work_rest_schedule_modal .modal-body > h4,
      #work_rest_schedule_modal .modal-body > p,
      #work_rest_schedule_modal .modal-body > .center {
        text-align: center !important;
        color: var(--text) !important;
        font-weight: 600 !important;
        margin: 0 0 10px !important;
      }

      /* 完整网格，覆盖全局 .table 残缺边框 */
      #work_rest_schedule_modal table,
      #work_rest_schedule_modal table.table,
      #work_rest_schedule_modal table.table-bordered,
      #work_rest_schedule_modal table.urppp-wrs-table {
        width: 100% !important;
        margin: 0 auto !important;
        border: 1px solid var(--border) !important;
        border-collapse: collapse !important;
        border-spacing: 0 !important;
        border-radius: var(--radius) !important;
        overflow: hidden !important;
        background: var(--surface) !important;
        box-shadow: none !important;
      }
      #work_rest_schedule_modal table th,
      #work_rest_schedule_modal table td,
      #work_rest_schedule_modal table.table > thead > tr > th,
      #work_rest_schedule_modal table.table > tbody > tr > th,
      #work_rest_schedule_modal table.table > tbody > tr > td,
      #work_rest_schedule_modal table.table-bordered > thead > tr > th,
      #work_rest_schedule_modal table.table-bordered > tbody > tr > td,
      #work_rest_schedule_modal table.table > tbody > tr > td:last-child,
      #work_rest_schedule_modal table.table > tbody > tr:last-child > td {
        border: 1px solid var(--border) !important;
        padding: 10px 12px !important;
        text-align: center !important;
        vertical-align: middle !important;
        font-size: 13px !important;
        line-height: 1.4 !important;
        color: var(--text) !important;
        background: var(--surface) !important;
        white-space: nowrap !important;
        box-sizing: border-box !important;
        font-weight: 400 !important;
      }
      #work_rest_schedule_modal table {
        width: 100% !important;
        table-layout: fixed !important;
      }
      #work_rest_schedule_modal table tr.urppp-wrs-title-row > td.urppp-wrs-title,
      #work_rest_schedule_modal table .urppp-wrs-title {
        display: table-cell !important;
        width: 100% !important;
        text-align: center !important;
        vertical-align: middle !important;
        font-size: 15px !important;
        font-weight: 700 !important;
        color: var(--text) !important;
        background: color-mix(in srgb, var(--primary) 8%, var(--surface)) !important;
        padding: 12px 14px !important;
        border: 1px solid var(--border) !important;
      }
      #work_rest_schedule_modal table tr.urppp-wrs-title-row {
        text-align: center !important;
      }
      #work_rest_schedule_modal table th[colspan],
      #work_rest_schedule_modal table td[colspan] {
        text-align: center !important;
        vertical-align: middle !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-head,
      #work_rest_schedule_modal table thead th {
        text-align: center !important;
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        font-weight: 600 !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-period,
      #work_rest_schedule_modal table td[rowspan],
      #work_rest_schedule_modal table th[rowspan] {
        text-align: center !important;
        vertical-align: middle !important;
        background: var(--input-bg) !important;
        color: var(--primary) !important;
        font-weight: 700 !important;
      }
      #work_rest_schedule_modal table .urppp-wrs-time {
        text-align: center !important;
        font-variant-numeric: tabular-nums !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-weight: 500 !important;
      }

      /* 时间轴 */
      .timeline-container { background: var(--surface) !important; border-color: var(--border) !important; }
      .timeline-item { border-color: var(--border) !important; }
      .timeline-item .timeline-indicator { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .timeline-item h5 { color: var(--text) !important; }


      /* ========== 学籍双栏：标题去卡壳（class 标记，优先级拉满） ========== */
      html body h4.header.urppp-section-label,
      html body .header.urppp-section-label,
      html body h4.header.smaller.lighter.grey.urppp-section-label,
      html body .page-content h4.header.urppp-section-label,
      html body #page-content-template h4.header.urppp-section-label {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border: 0 none transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 4px 2px 10px !important;
        margin: 0 0 8px !important;
        min-height: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      html body .profile-user-info.setLabelWidth,
      html body .profile-user-info-striped.setLabelWidth,
      html body .self.profile-user-info.setLabelWidth {
        padding: 0 !important;
        margin: 0 0 16px !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: none !important;
        overflow: hidden !important;
      }
      /* FullCalendar：颜色 + 首行时间标签，禁止改 scroller overflow/height */
      .fc,
      #main-calendar .fc {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
      }
      .fc th,
      .fc td,
      .fc-unthemed th,
      .fc-unthemed td,
      .fc-unthemed .fc-divider,
      .fc-unthemed .fc-row,
      .fc .fc-axis,
      .fc .fc-divider,
      .fc .fc-row,
      .fc hr,
      .fc table {
        border-color: var(--border) !important;
      }
      .fc-day-header,
      .fc-widget-header {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        border-color: var(--border) !important;
      }
      /* 时间轴与格子同色，避免左侧出现一块突兀色条 */
      .fc-bg,
      .fc-bg table,
      .fc-bg td,
      .fc-bg th,
      .fc-slats td,
      .fc-time-grid .fc-slats td,
      .fc-axis,
      .fc-time-grid .fc-axis,
      .fc .fc-axis.fc-widget-content,
      .fc .fc-axis.fc-time {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text-secondary) !important;
        border-color: var(--border) !important;
      }
      .fc-time-grid .fc-slats .fc-minor td {
        border-top-color: color-mix(in srgb, var(--border) 72%, transparent) !important;
      }
      /*
       * FullCalendar 默认把时间文字 margin-top 上移半格，贴顶时 00:00 会被 scroller 裁掉一半。
       * 仅修正首行标签，不改滚动容器。
       */
      .fc-time-grid .fc-slats tr:first-child > .fc-axis span,
      .fc-time-grid .fc-slats tr:first-child > td.fc-axis span,
      #main-calendar .fc-time-grid .fc-slats tr:first-child .fc-axis span {
        margin-top: 0 !important;
        transform: none !important;
        position: relative !important;
        top: 2px !important;
      }
      .fc-time-grid-event,
      .fc-event {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        border-radius: var(--radius-sm) !important;
        margin: 2px 4px !important;
      }
      .fc-event-container { padding: 2px !important; }
      .fc-toolbar {
        margin-top: 8px !important;
        margin-bottom: 12px !important;
        padding: 0 8px !important;
      }
      .fc-button {
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      .fc-button.fc-state-active,
      .fc-button.fc-state-hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
      }
      .fc-today {
        background: color-mix(in srgb, var(--primary) 10%, var(--surface)) !important;
      }
      html.urppp-theme-dark .fc,
      html.urppp-theme-dark #main-calendar .fc,
      html.urppp-theme-dark .fc-bg,
      html.urppp-theme-dark .fc-bg td,
      html.urppp-theme-dark .fc-slats td,
      html.urppp-theme-dark .fc-axis,
      html.urppp-theme-dark .fc-time-grid .fc-axis {
        background: #151A24 !important;
        background-color: #151A24 !important;
      }
      html.urppp-theme-dark .fc th,
      html.urppp-theme-dark .fc td,
      html.urppp-theme-dark .fc-unthemed th,
      html.urppp-theme-dark .fc-unthemed td,
      html.urppp-theme-dark .fc-unthemed .fc-divider,
      html.urppp-theme-dark .fc-unthemed .fc-row,
      html.urppp-theme-dark .fc .fc-axis,
      html.urppp-theme-dark .fc .fc-divider,
      html.urppp-theme-dark .fc hr {
        border-color: #1E293B !important;
      }
      html.urppp-theme-dark .fc-day-header,
      html.urppp-theme-dark .fc-widget-header {
        background: #1C2330 !important;
        background-color: #1C2330 !important;
        color: #94A3B8 !important;
        border-color: #1E293B !important;
      }
      html.urppp-theme-dark .fc-axis,
      html.urppp-theme-dark .fc-time-grid .fc-axis {
        color: #94A3B8 !important;
        border-color: #1E293B !important;
      }
      html.urppp-theme-dark .fc-time-grid .fc-slats .fc-minor td {
        border-top-color: rgba(30, 41, 59, 0.72) !important;
      }
      html.urppp-theme-dark .fc-today {
        background: rgba(147, 168, 199, 0.08) !important;
      }

      /* ========== 学籍页最终形态（对齐左侧基本信息：标题无壳 + 表零内边距） ========== */
      html body .page-content .col-xs-4 > h4.header,
      html body .page-content .col-xs-8 > h4.header,
      html body .page-content .col-sm-4 > h4.header,
      html body .page-content .col-sm-8 > h4.header,
      html body .page-content .col-md-4 > h4.header,
      html body .page-content .col-md-8 > h4.header,
      html body .page-content .col-xs-4 > h4.header.smaller.lighter.grey,
      html body .page-content .col-xs-8 > h4.header.smaller.lighter.grey,
      html body #page-content-template .col-xs-4 > h4.header,
      html body #page-content-template .col-xs-8 > h4.header,
      html body h4.header.urppp-section-label,
      html body .page-content h4.header.urppp-section-label {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border: 0 none transparent !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 4px 2px 10px !important;
        margin: 0 0 8px !important;
        min-height: 0 !important;
      }
      html body .page-content .profile-user-info.setLabelWidth,
      html body .page-content .profile-user-info-striped.setLabelWidth,
      html body .page-content .self.profile-user-info.setLabelWidth,
      html body .page-content .self.profile-user-info-striped.setLabelWidth,
      html body .page-content .profile-user-info.setLabelWidth.urppp-query-form {
        padding: 0 !important;
        margin: 0 0 16px !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: none !important;
        overflow: hidden !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      /* FullCalendar 事件悬停弹窗：保留虚线框风格，仅主题色化 */
      #schedule-hover {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        pointer-events: none !important;
        z-index: 3000 !important;
      }
      #schedule-hover .promptedmessage-a,
      #promptedmessage-div.promptedmessage-a {
        background: var(--surface) !important;
        border: 2px solid color-mix(in srgb, var(--primary) 45%, var(--border)) !important;
        border-radius: 10px !important;
        box-shadow: 0 8px 24px rgba(0,0,0,0.14) !important;
        padding: 6px !important;
        pointer-events: none !important;
        position: static !important; /* 由外层 #schedule-hover 统一定位，避免双重 absolute 闪跳 */
        top: auto !important;
        left: auto !important;
      }
      #schedule-hover .promptedmessage,
      #promptedmessage-div .promptedmessage {
        background: color-mix(in srgb, var(--primary) 12%, var(--surface)) !important;
        border: 1px solid var(--surface) !important;
        outline: 2px dashed color-mix(in srgb, var(--primary) 40%, var(--border)) !important;
        outline-offset: 0 !important;
        border-radius: var(--radius-sm) !important;
        box-shadow: none !important;
        padding: 10px 12px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
        color: var(--text-secondary) !important;
        pointer-events: none !important;
      }
      #schedule-hover .promptedmessage span:first-child {
        font-weight: 600 !important;
        color: var(--primary) !important;
        font-size: 14px !important;
      }
      #schedule-hover .promptedmessage .ace-icon {
        color: var(--text-muted) !important;
      }

      .fc-today { background: var(--input-bg) !important; }

      /* 课表页面 #courseTable */
      #courseTable { background: transparent !important; }
      /* 隐藏打印/导出按钮工具栏 */
      .page-content .tools,
      .widget-toolbar .btn-group { display: none !important; }

      /* 标签：箭头矩形 → 圆角矩形 + 80% 不透明度 */
      .label.arrowed-in,
      .label.arrowed,
      .label[class*="arrowed"] {
        border-radius: var(--radius-sm) !important;
        opacity: 0.8 !important;
      }
      .label.arrowed-in::before,
      .label.arrowed-in::after,
      .label.arrowed::before,
      .label.arrowed::after {
        display: none !important;
      }
      .label[class*="arrowed"] {
        vertical-align: middle !important;
        position: relative !important;
        top: -1px !important;
      }
      #courseTable th {
        background: var(--input-bg) !important; color: var(--text-secondary) !important;
        font-weight: 500 !important; border: none !important;
        padding: 10px 8px !important; text-align: center !important; font-size: 13px !important;
      }
      #courseTable td {
        border: 0.5px solid var(--border) !important;
        padding: 4px !important; vertical-align: top !important;
        font-size: 13px !important; line-height: 1.6 !important;
        color: var(--text) !important;
      }
      #courseTable td:first-child {
        background: var(--input-bg) !important; color: var(--text-secondary) !important;
        font-weight: 500 !important; text-align: center !important; font-size: 11px !important;
      }
      /* 课程卡片圆角 + 不透明度 */
      #courseTable .class_div.box_font,
      #courseTable div[class*="div-kcb"] {
        border-radius: var(--radius) !important;
        opacity: 0.88 !important;
      }

      /* 列表 / 通知 */
      .list-group-item { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text) !important; }
      .list-group-item:hover { background: var(--input-bg) !important; }
      .list-group-item.active { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }
      .alert, .alert-info { background: var(--input-bg) !important; border-color: var(--border) !important; color: var(--text) !important; border-radius: 10px !important; }
      .alert-success { background: rgba(34,197,94,0.1) !important; border-color: rgba(34,197,94,0.2) !important; color: #22c55e !important; }
      .alert-warning { background: rgba(245,158,11,0.1) !important; border-color: rgba(245,158,11,0.2) !important; color: #f59e0b !important; }
      .alert-danger { background: rgba(239,68,68,0.1) !important; border-color: rgba(239,68,68,0.2) !important; color: #ef4444 !important; }

      /* 标签 / 徽章 */
      .label-info, .badge-info { background: var(--primary) !important; }
      .label-success, .badge-success { background: #22c55e !important; }
      .label-warning, .badge-warning { background: #f59e0b !important; }
      .label-danger, .badge-danger { background: #ef4444 !important; }
      .badge, .label { border-radius: var(--radius-sm) !important; }
      /* ============================================================
       * 深邃暗：压过 ACE 白底 / 浅字 / 硬编码灰底
       * ============================================================ */
      html.urppp-theme-dark,
      html.urppp-theme-dark body,
      body.urppp-dark {
        color-scheme: dark !important;
      }
      html.urppp-theme-dark .page-content,
      html.urppp-theme-dark #page-content-template,
      html.urppp-theme-dark .main-content,
      body.urppp-dark .page-content,
      body.urppp-dark .main-content {
        background: var(--bg) !important;
        color: var(--text) !important;
      }
      /* 空闲教室楼栋列表 / 校区标题 */
      html.urppp-theme-dark #drag-ul,
      html.urppp-theme-dark #drag-ul.urppp-drag-ul,
      html.urppp-theme-dark #xq-section #drag-ul {
        background: var(--surface) !important;
      }
      html.urppp-theme-dark #drag-ul > li,
      html.urppp-theme-dark #drag-ul > li.border-common,
      html.urppp-theme-dark #drag-ul .border-common {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-bottom-color: var(--border) !important;
      }
      html.urppp-theme-dark #drag-ul > li.xq-section {
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
      }
      html.urppp-theme-dark #drag-ul > li.ui-selected,
      html.urppp-theme-dark #drag-ul > li.urppp-building-active {
        background: var(--primary) !important;
        color: #0B0F17 !important;
      }
      /* 节次 / 周次条 */
      html.urppp-theme-dark #drag-ol > li,
      html.urppp-theme-dark #drag-ol .border-common,
      html.urppp-theme-dark #test-drag > li,
      html.urppp-theme-dark #test-drag .ui-widget-content {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* Chosen 多选标签（教学楼等）：去掉白底浅字 */
      html.urppp-theme-dark .chosen-container-multi .chosen-choices,
      html.urppp-theme-dark .chosen-choices {
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .chosen-container-multi .chosen-choices li.search-choice,
      html.urppp-theme-dark .chosen-choices .search-choice,
      html.urppp-theme-dark .search-choice {
        background: color-mix(in srgb, var(--primary) 22%, var(--surface)) !important;
        background-image: none !important;
        border: 1px solid color-mix(in srgb, var(--primary) 35%, var(--border)) !important;
        color: var(--text) !important;
        box-shadow: none !important;
      }
      html.urppp-theme-dark .chosen-container-multi .chosen-choices li.search-choice span,
      html.urppp-theme-dark .search-choice span {
        color: var(--text) !important;
      }
      html.urppp-theme-dark .chosen-container-multi .chosen-choices li.search-choice .search-choice-close {
        opacity: 0.75 !important;
      }
      /* 标签 badge/label 在暗色下文字更清晰 */
      html.urppp-theme-dark .label,
      html.urppp-theme-dark .badge {
        color: #fff !important;
      }
      html.urppp-theme-dark .label-info,
      html.urppp-theme-dark .badge-info {
        background: color-mix(in srgb, var(--primary) 70%, #1e293b) !important;
        color: #e2e8f0 !important;
      }
      /* 周课表格子 */
      html.urppp-theme-dark #mycoursetable,
      html.urppp-theme-dark #mycoursetable > table,
      html.urppp-theme-dark #courseTable {
        background: var(--surface) !important;
        color: var(--text) !important;
      }
      html.urppp-theme-dark #mycoursetable td,
      html.urppp-theme-dark #mycoursetable th,
      html.urppp-theme-dark #courseTable td,
      html.urppp-theme-dark #courseTable th {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark #mycoursetable th,
      html.urppp-theme-dark #courseTable th {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
      }
      html.urppp-theme-dark #mycoursetable div.class_div,
      html.urppp-theme-dark #courseTable div.class_div {
        color: #fff !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
      }
      html.urppp-theme-dark #mycoursetable div.class_div p,
      html.urppp-theme-dark #courseTable div.class_div p {
        color: inherit !important;
      }
      /* 进度条百分比：暗色下用亮字 + 阴影，避免白底条上几乎看不见 */
      html.urppp-theme-dark .progress.pos-rel::after,
      html.urppp-theme-dark .progress[data-percent]::after {
        color: #F8FAFC !important;
        mix-blend-mode: normal !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.65) !important;
      }
      html.urppp-theme-dark .progress,
      html.urppp-theme-dark div.progress {
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
      }
      /* 星期/节次下拉：站点写死 #efefef */
      html.urppp-theme-dark #div-xqjc,
      html.urppp-theme-dark .dropdown-self,
      html.urppp-theme-dark .profile-info-value .dropdown > #div-xqjc {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        box-shadow: var(--shadow) !important;
      }
      html.urppp-theme-dark #div-xqjc table,
      html.urppp-theme-dark #div-xqjc td,
      html.urppp-theme-dark #div-xqjc th {
        background: transparent !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* profile 信息行：name 列暗色区分 */
      html.urppp-theme-dark .profile-info-name {
        background: var(--input-bg) !important;
        color: var(--text-secondary) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .profile-info-value {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .profile-user-info,
      html.urppp-theme-dark .profile-user-info-striped {
        background: var(--surface) !important;
        border-color: var(--border) !important;
      }
      /* widget / 卡片 */
      html.urppp-theme-dark .widget-box,
      html.urppp-theme-dark .widget-main,
      html.urppp-theme-dark .widget-body {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .widget-header {
        background: var(--input-bg) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* 输入/分页等残留白底 */
      html.urppp-theme-dark input,
      html.urppp-theme-dark textarea,
      html.urppp-theme-dark select,
      html.urppp-theme-dark .form-control {
        background-color: var(--input-bg) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .ztree li a:hover,
      html.urppp-theme-dark .ztree li a.curSelectedNode {
        background: var(--input-bg) !important;
        color: var(--primary) !important;
      }


      /* 杂项 */
      .btn-scroll-up { background: var(--surface) !important; border-color: var(--border) !important; color: var(--text-secondary) !important; box-shadow: var(--shadow) !important; }
      .ui-jqgrid, .ui-jqgrid-view, .ui-jqgrid-bdiv, .ui-jqgrid-hdiv { background: var(--surface) !important; border-color: var(--border) !important; }
      .ui-jqgrid .ui-jqgrid-htable th { background: var(--input-bg) !important; color: var(--text) !important; border-color: var(--border) !important; }
      .ui-jqgrid tr.jqgrow td { color: var(--text) !important; border-color: var(--border) !important; }
      .ui-jqgrid tr.ui-row-ltr:hover { background: var(--input-bg) !important; }
`;var vi=`/* Personal and resource schedule course cards. Keep table cells and table surfaces untouched. */
#courseTable .class_div.box_font {
  box-sizing: border-box !important;
  isolation: isolate !important;
  overflow: hidden !important;
  opacity: 1 !important;
  transition: box-shadow 160ms ease-out, filter 160ms ease-out !important;
}

#courseTable .class_div.box_font::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: rgba(14, 23, 42, 0.12);
}

#courseTable .class_div.box_font > p {
  position: relative;
  z-index: 1;
  margin: 1px 6px !important;
  color: rgba(255, 255, 255, 0.94) !important;
  font-size: 12px !important;
  line-height: 1.35 !important;
  overflow-wrap: anywhere !important;
  word-break: break-word !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.42) !important;
}

#courseTable .class_div.box_font > p[class*="p-kcm-"] {
  margin-top: 4px !important;
  margin-bottom: 2px !important;
  color: #fff !important;
  font-size: 14px !important;
  font-weight: 750 !important;
  line-height: 1.3 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5) !important;
}

html[data-urppp-skin="apple"] body #courseTable .class_div.box_font {
  border: 1px solid rgba(255, 255, 255, 0.36) !important;
  border-radius: 18px !important;
  box-shadow:
    0 5px 14px rgba(15, 23, 42, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
}

html[data-urppp-skin="flat"] body #courseTable .class_div.box_font {
  border: 2px solid var(--text, #111) !important;
  border-radius: 0 !important;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.28) !important;
}

html[data-urppp-skin="organic"] body #courseTable .class_div.box_font {
  border: 1px solid rgba(255, 255, 255, 0.32) !important;
  border-radius: 20px !important;
  box-shadow:
    0 6px 13px rgba(92, 64, 51, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.24) !important;
}

html.urppp-theme-dark[data-urppp-skin="organic"] body #courseTable .class_div.box_font {
  box-shadow:
    0 6px 14px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.16) !important;
}

html[data-urppp-skin="brutal"] body #courseTable .class_div.box_font {
  border: 3px solid #000 !important;
  border-radius: 0 !important;
  box-shadow: inset -4px -4px 0 rgba(0, 0, 0, 0.32) !important;
}

html[data-urppp-skin="editorial"] body #courseTable .class_div.box_font {
  border: 1px solid rgba(255, 255, 255, 0.38) !important;
  border-left: 4px solid rgba(255, 255, 255, 0.72) !important;
  border-radius: 0 !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25) !important;
  filter: saturate(0.78) !important;
}

html[data-urppp-skin="editorial"] body #courseTable .class_div.box_font > p[class*="p-kcm-"] {
  font-family: Georgia, "Noto Serif SC", "Songti SC", STSong, SimSun, serif !important;
  letter-spacing: 0 !important;
}

html[data-urppp-skin="neu"] body #courseTable .class_div.box_font {
  border: 0 !important;
  border-radius: 16px !important;
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.42),
    inset -3px -3px 5px rgba(0, 0, 0, 0.25),
    0 2px 5px rgba(0, 0, 0, 0.12) !important;
}

html.urppp-theme-dark[data-urppp-skin="neu"] body #courseTable .class_div.box_font {
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.2),
    inset -3px -3px 5px rgba(0, 0, 0, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.28) !important;
}

@media (prefers-reduced-motion: reduce) {
  #courseTable .class_div.box_font {
    transition: none !important;
  }
}
`;var wi=`.urppp-export-wrap{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin-left:7px!important;font-weight:400!important;vertical-align:middle!important;white-space:nowrap!important}
.urppp-export-trigger{height:28px!important;min-width:28px!important;padding:0 9px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;gap:5px!important;border:1px solid var(--border,#dfe3e8)!important;border-radius:8px!important;background:var(--input-bg,#f7f8fa)!important;color:var(--text,#1d1d1f)!important;font-size:12px!important;line-height:1!important;white-space:nowrap!important;cursor:pointer!important;box-shadow:none!important;transform:none!important}
.urppp-export-trigger:hover{border-color:var(--primary,#b53434)!important;color:var(--primary,#b53434)!important;background:var(--surface,#fff)!important}
.urppp-export-trigger i{font-size:12px!important;margin:0!important;color:inherit!important}
.urppp-export-menu{position:absolute!important;top:calc(100% + 7px)!important;left:0!important;z-index:14040!important;width:220px!important;padding:6px!important;box-sizing:border-box!important;border:1px solid var(--border,#dfe3e8)!important;border-radius:10px!important;background:var(--surface,#fff)!important;box-shadow:0 14px 34px rgba(15,23,42,.16)!important;display:none!important}
#urppp-native-schedule-export>.urppp-export-menu{left:auto!important;right:0!important}
.urppp-export-fallback{display:flex!important;justify-content:flex-end!important;margin:0 0 10px!important}
.urppp-export-wrap.open>.urppp-export-menu{display:block!important}
.urppp-export-option{width:100%!important;min-height:38px!important;padding:7px 9px!important;display:grid!important;grid-template-columns:20px minmax(0,1fr)!important;gap:8px!important;align-items:center!important;border:0!important;border-radius:7px!important;background:transparent!important;color:var(--text,#1d1d1f)!important;text-align:left!important;cursor:pointer!important;box-shadow:none!important;transform:none!important}
.urppp-export-option:hover:not(:disabled){background:var(--input-bg,#f5f6f8)!important;color:var(--primary,#b53434)!important}
.urppp-export-option:disabled{opacity:.45!important;cursor:not-allowed!important}
.urppp-export-option i{width:18px!important;text-align:center!important;color:inherit!important}
.urppp-export-option strong{display:block!important;font-size:12px!important;font-weight:650!important;line-height:1.2!important}
.urppp-export-option small{display:block!important;margin-top:2px!important;color:var(--text-muted,#7c8491)!important;font-size:10px!important;line-height:1.3!important;white-space:normal!important}
.urppp-export-guide{margin:5px 5px 2px!important;padding-top:6px!important;border-top:1px solid var(--border,#e2e5e9)!important;color:var(--text-muted,#7c8491)!important;font-size:10px!important;line-height:1.4!important}
.urppp-export-guide button{display:block!important;margin-top:5px!important;padding:0!important;border:0!important;background:transparent!important;color:var(--primary,#b53434)!important;font-size:10px!important;font-weight:650!important;cursor:pointer!important;box-shadow:none!important}
html[data-urppp-skin="apple"] .urppp-export-trigger{border-radius:999px!important}
html[data-urppp-skin="flat"] .urppp-export-trigger{border:2px solid var(--text)!important;border-radius:0!important;background:var(--surface)!important;color:var(--text)!important}
html[data-urppp-skin="flat"] .urppp-export-trigger:hover{background:var(--text)!important;color:var(--surface)!important}
html[data-urppp-skin="flat"] .urppp-export-menu{border:2px solid var(--text)!important;border-radius:0!important;box-shadow:none!important}
html[data-urppp-skin="flat"] .urppp-export-option{border-radius:0!important}
html[data-urppp-skin="flat"] .urppp-export-option:hover:not(:disabled){background:var(--text)!important;color:var(--surface)!important}
html[data-urppp-skin="brutal"].urppp-theme-dark .urppp-export-trigger{border:3px solid #fff!important;border-radius:0!important;background:#0a0a0a!important;color:#fff!important;box-shadow:4px 4px 0 #fff!important}
html[data-urppp-skin="brutal"].urppp-theme-dark .urppp-export-menu{background:#0a0a0a!important;border:3px solid #fff!important;border-radius:0!important;box-shadow:6px 6px 0 #000!important}
html[data-urppp-skin="brutal"].urppp-theme-dark .urppp-export-option{color:#fff!important}
html[data-urppp-skin="brutal"].urppp-theme-dark .urppp-export-option strong{color:#fff!important}
html[data-urppp-skin="brutal"].urppp-theme-dark .urppp-export-option small{color:#eee!important}
html[data-urppp-skin="brutal"].urppp-theme-dark .urppp-export-option:hover:not(:disabled){background:#1c1c1c!important;color:var(--brutal-accent)!important}
html[data-urppp-skin="brutal"].urppp-theme-dark .urppp-export-option:hover:not(:disabled) strong{color:var(--brutal-accent)!important}
html[data-urppp-skin="brutal"] .urppp-export-trigger{border:3px solid #000!important;border-radius:0!important;background:#fff!important;color:#000!important;box-shadow:3px 3px 0 #000!important}
html[data-urppp-skin="brutal"] .urppp-export-trigger:hover{background:var(--brutal-accent,#ff006e)!important;color:#000!important}
html[data-urppp-skin="brutal"] .urppp-export-trigger:active{box-shadow:none!important;transform:none!important}
html[data-urppp-skin="brutal"] .urppp-export-menu{border:3px solid #000!important;border-radius:0!important;background:#fff!important;color:#000!important;box-shadow:6px 6px 0 #000!important}
html[data-urppp-skin="brutal"] .urppp-export-option{border-radius:0!important;color:#000!important}
html[data-urppp-skin="brutal"] .urppp-export-option:hover:not(:disabled){background:var(--brutal-accent,#ff006e)!important;color:#000!important}
html[data-urppp-skin="editorial"] .urppp-export-trigger{border:0!important;border-bottom:1px solid var(--border)!important;border-radius:0!important;background:transparent!important;color:var(--text)!important;padding-inline:4px!important}
html[data-urppp-skin="editorial"] .urppp-export-trigger:hover{border-color:var(--text)!important;background:transparent!important;color:var(--text)!important}
html[data-urppp-skin="editorial"] .urppp-export-menu{border:1px solid var(--border)!important;border-radius:0!important;box-shadow:none!important}
html[data-urppp-skin="editorial"] .urppp-export-option{border-radius:0!important}
html[data-urppp-skin="organic"] .urppp-export-trigger{border-radius:999px!important;background:var(--input-bg)!important}
html[data-urppp-skin="organic"] .urppp-export-menu{border-radius:18px!important}
html[data-urppp-skin="organic"] .urppp-export-option{border-radius:12px!important}
html[data-urppp-skin="neu"] .urppp-export-trigger{border:0!important;border-radius:10px!important;background:var(--neu-base,var(--surface))!important;color:var(--text)!important;box-shadow:var(--neu-raised-xs,3px 3px 7px rgba(0,0,0,.16),-3px -3px 7px rgba(255,255,255,.65))!important}
html[data-urppp-skin="neu"] .urppp-export-trigger:hover{background:var(--neu-base,var(--surface))!important;color:var(--primary)!important;box-shadow:var(--neu-hover,var(--neu-raised-xs))!important}
html[data-urppp-skin="neu"] .urppp-export-trigger:active{box-shadow:var(--neu-inset-soft,inset 2px 2px 5px rgba(0,0,0,.14),inset -2px -2px 5px rgba(255,255,255,.55))!important;transform:none!important}
html[data-urppp-skin="neu"] .urppp-export-menu{border:0!important;border-radius:12px!important;background:var(--neu-base,var(--surface))!important;box-shadow:var(--neu-raised-sm,var(--shadow))!important}
html[data-urppp-skin="neu"] .urppp-export-option{border-radius:8px!important}
@media (max-width:991px){
[data-urppp-native-print-source="1"],
#h4_id1 .right_top_oper>button[onclick*="dy("],
#h4_id1 .right_top_oper>a[onclick*="dy("]{display:none!important}
#urppp-native-schedule-export{margin-left:0!important}
}
.urppp-dialog-mask{position:fixed!important;inset:0!important;z-index:14100!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;background:rgba(15,23,42,.44)!important}
.urppp-dialog{width:min(420px,100%)!important;padding:18px!important;border:1px solid var(--border,#dfe3e8)!important;border-radius:12px!important;background:var(--surface,#fff)!important;color:var(--text,#1d1d1f)!important;box-shadow:0 22px 60px rgba(15,23,42,.24)!important}
.urppp-dialog h3{margin:0 0 8px!important;font-size:15px!important;color:var(--text)!important}
.urppp-dialog p{margin:0 0 14px!important;color:var(--text-secondary)!important;font-size:12px!important;line-height:1.55!important}
.urppp-dialog input{width:100%!important;height:38px!important;border:1px solid var(--border)!important;border-radius:8px!important;background:var(--input-bg)!important;color:var(--text)!important;padding:0 10px!important;box-sizing:border-box!important}
.urppp-dialog-actions{display:flex!important;justify-content:flex-end!important;gap:8px!important;margin-top:16px!important}
`;var ki=`/* Settings panel shell */
#urppp-settings-mask {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(15, 23, 42, 0.28) !important;
  z-index: 13050 !important;
  display: block !important;
  opacity: 0 !important;
  pointer-events: none !important;
  backdrop-filter: blur(0px) !important;
  transition: opacity .22s ease, backdrop-filter .28s ease !important;
}
#urppp-settings-mask.open {
  opacity: 1 !important;
  pointer-events: auto !important;
  backdrop-filter: blur(3px) !important;
}
#urppp-settings-panel {
  position: fixed !important;
  top: 56px !important;
  left: 18px !important;
  right: auto !important;
  bottom: auto !important;
  max-height: calc(100vh - 80px) !important;
  max-height: calc(100dvh - 80px) !important;
  height: calc(100vh - 80px) !important;
  height: calc(100dvh - 80px) !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  background: var(--surface) !important;
  color: var(--text) !important;
  border: 1px solid var(--border) !important;
  border-radius: 16px !important;
  box-shadow: 0 18px 48px rgba(15,23,42,0.18) !important;
  z-index: 13060 !important;
  box-sizing: border-box !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transform: translateY(-10px) scale(.96) !important;
  transform-origin: top left !important;
  transition: opacity .24s cubic-bezier(.22,1,.36,1), transform .28s cubic-bezier(.22,1,.36,1), box-shadow .22s ease !important;
}
#urppp-settings-panel.open {
  opacity: 1 !important;
  pointer-events: auto !important;
  transform: translateY(0) scale(1) !important;
  box-shadow: 0 22px 56px rgba(15,23,42,0.22) !important;
}
@media (max-width: 640px) {
  #urppp-settings-panel {
    top: max(10px, env(safe-area-inset-top, 0px)) !important;
    left: 10px !important;
    right: 10px !important;
    bottom: max(10px, env(safe-area-inset-bottom, 0px)) !important;
    width: auto !important;
    max-height: none !important;
    height: auto !important;
    transform-origin: center center !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  #urppp-settings-mask, #urppp-settings-panel {
    transition: none !important;
    transform: none !important;
  }
  #urppp-settings-mask:not(.open),
  #urppp-settings-panel:not(.open) {
    display: none !important;
    opacity: 0 !important;
  }
  #urppp-settings-mask.open {
    display: block !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
  #urppp-settings-panel.open {
    display: flex !important;
    opacity: 1 !important;
    pointer-events: auto !important;
  }
}
#urppp-settings-panel .urppp-set-head {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 14px 16px 10px !important;
  border-bottom: 1px solid var(--border) !important;
  position: relative !important;
  flex: 0 0 auto !important;
  background: var(--surface) !important;
  z-index: 1 !important;
}
#urppp-settings-panel .urppp-set-title {
  font-size: 15px !important;
  font-weight: 700 !important;
  color: var(--text) !important;
}
#urppp-settings-panel .urppp-set-close {
  width: 28px !important;
  height: 28px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex: 0 0 28px !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  border: none !important;
  border-radius: var(--radius-sm) !important;
  background: transparent !important;
  color: var(--text-muted) !important;
  font-family: Arial, sans-serif !important;
  font-size: 20px !important;
  cursor: pointer !important;
  line-height: 1 !important;
}
#urppp-settings-panel .urppp-set-close:hover {
  background: var(--input-bg) !important;
  color: var(--text) !important;
}
#urppp-settings-panel .urppp-set-body {
  padding: 12px 16px 24px !important;
  flex: 1 1 auto !important;
  min-height: 0 !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior: contain !important;
  padding-bottom: max(28px, calc(16px + env(safe-area-inset-bottom, 0px))) !important;
}
#urppp-settings-panel #urppp-set-check-update {
  width: 100% !important;
  min-height: 36px !important;
}
#urppp-settings-panel #urppp-set-update-status a {
  color: var(--primary) !important;
  text-decoration: underline !important;
}
#urppp-settings-panel .urppp-set-sec {
  margin: 0 0 18px !important;
}
#urppp-settings-panel .urppp-set-sec h3 {
  margin: 0 0 8px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
  color: var(--text-secondary) !important;
  text-transform: none !important;
}
#urppp-settings-panel .urppp-set-tip {
  margin: 0 0 10px !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
}

/* Shared settings controls */
#urppp-settings-panel .urppp-set-modes {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 8px !important;
}
#urppp-settings-panel .urppp-set-mode {
  height: 34px !important;
  border-radius: 10px !important;
  border: 1px solid var(--border) !important;
  background: var(--input-bg) !important;
  color: var(--text) !important;
  font-size: 12px !important;
  cursor: pointer !important;
}
#urppp-settings-panel .urppp-set-mode:hover { border-color: var(--primary) !important; }
#urppp-settings-panel .urppp-set-mode.ac,
html.urppp-theme-default:not(.urppp-theme-follow) #urppp-settings-panel .urppp-set-mode[data-theme="default"],
html.urppp-theme-dark:not(.urppp-theme-follow) #urppp-settings-panel .urppp-set-mode[data-theme="dark"],
html.urppp-theme-scu-red:not(.urppp-theme-follow) #urppp-settings-panel .urppp-set-mode[data-theme="scu-red"] {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #fff !important;
}
#urppp-settings-panel .urppp-set-follow-row {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 8px !important;
  margin-top: 8px !important;
}
#urppp-settings-panel .urppp-set-follow {
  width: 100% !important;
  margin-top: 10px !important;
  height: 34px !important;
  border-radius: 10px !important;
  border: 1px solid var(--border) !important;
  background: var(--input-bg) !important;
  color: var(--text) !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  padding: 0 8px !important;
  white-space: nowrap !important;
}
#urppp-settings-panel .urppp-set-follow-row .urppp-set-follow{margin-top:0 !important}
#urppp-settings-panel .urppp-set-follow:hover:not(:disabled) { border-color: var(--primary) !important; }
#urppp-settings-panel .urppp-set-follow.ac {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  color: #fff !important;
}
#urppp-settings-panel .urppp-set-follow:disabled { cursor: not-allowed !important; }
#urppp-settings-panel .urppp-dyn-disabled,
#urppp-settings-panel .urppp-dyn-disabled * {
  text-decoration: line-through !important;
  opacity: 0.55 !important;
  pointer-events: none !important;
  cursor: not-allowed !important;
  user-select: none !important;
}
#urppp-settings-panel .urppp-set-mode.urppp-dyn-disabled,
#urppp-settings-panel .urppp-set-follow.urppp-dyn-disabled,
#urppp-settings-panel .urppp-set-btn.urppp-dyn-disabled {
  text-decoration: line-through !important;
  opacity: 0.5 !important;
  pointer-events: none !important;
  filter: grayscale(0.4) !important;
}
#urppp-settings-panel .urppp-set-presets {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  margin: 0 0 12px !important;
}
#urppp-settings-panel .urppp-set-swatch {
  width: 26px !important;
  height: 26px !important;
  border-radius: 50% !important;
  border: 2px solid var(--border) !important;
  cursor: pointer !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}
#urppp-settings-panel .urppp-set-swatch.ac {
  box-shadow: 0 0 0 3px var(--ring) !important;
  border-color: var(--primary) !important;
}
#urppp-settings-panel .urppp-set-custom {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  gap: 8px !important;
}
#urppp-settings-panel #urppp-set-color {
  width: 40px !important;
  height: 32px !important;
  padding: 0 !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-sm) !important;
  background: var(--input-bg) !important;
  cursor: pointer !important;
}
#urppp-settings-panel #urppp-set-hex {
  width: 96px !important;
  height: 32px !important;
  border: 1px solid var(--border) !important;
  border-radius: var(--radius-sm) !important;
  background: var(--input-bg) !important;
  color: var(--text) !important;
  padding: 0 8px !important;
  font-size: 12px !important;
  box-sizing: border-box !important;
}
#urppp-settings-panel .urppp-set-btn {
  height: 32px !important;
  padding: 0 12px !important;
  border-radius: var(--radius-sm) !important;
  border: 1px solid var(--primary) !important;
  background: var(--primary) !important;
  color: #fff !important;
  font-size: 12px !important;
  cursor: pointer !important;
}
#urppp-settings-panel .urppp-set-schemes {
  display: flex !important;
  flex-direction: column !important;
  gap: 8px !important;
}
#urppp-settings-panel .urppp-set-scheme {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  width: 100% !important;
  text-align: left !important;
  padding: 10px !important;
  border-radius: var(--radius) !important;
  border: 1px solid var(--border) !important;
  background: var(--input-bg) !important;
  cursor: pointer !important;
  box-sizing: border-box !important;
}
#urppp-settings-panel .urppp-set-scheme:hover { border-color: var(--primary) !important; }
#urppp-settings-panel .urppp-set-scheme.ac {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px var(--ring) !important;
  background: var(--surface) !important;
}
#urppp-settings-panel .urppp-set-scheme-preview {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  flex: 0 0 auto !important;
}
#urppp-settings-panel .urppp-set-scheme-preview span {
  display: block !important;
  width: 22px !important;
  height: 22px !important;
  border-radius: var(--radius-sm) !important;
  border: 1px solid rgba(0,0,0,0.06) !important;
  box-sizing: border-box !important;
}
#urppp-settings-panel .urppp-set-scheme-preview span:nth-child(2) {
  width: 28px !important;
  height: 28px !important;
  border-radius: var(--radius-sm) !important;
}
#urppp-settings-panel .urppp-set-scheme-meta { min-width: 0 !important; flex: 1 1 auto !important; }
#urppp-settings-panel .urppp-set-scheme-meta strong {
  display: block !important;
  font-size: 13px !important;
  color: var(--text) !important;
  font-weight: 700 !important;
  margin: 0 0 2px !important;
}
#urppp-settings-panel .urppp-set-scheme-meta em {
  display: block !important;
  font-style: normal !important;
  font-size: 11px !important;
  line-height: 1.4 !important;
  color: var(--text-muted) !important;
}

/* Settings tabs and skin list layout */
#urppp-settings-panel { width: min(460px, calc(100vw - 24px)) !important; }
#urppp-settings-panel .urppp-set-tabs {
  display: grid !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  gap: 4px !important;
  padding: 8px 12px 0 !important;
  flex: 0 0 auto !important;
  background: var(--surface) !important;
  border-bottom: 1px solid var(--border) !important;
}
#urppp-settings-panel .urppp-set-tab {
  height: 34px !important;
  border: none !important;
  border-radius: var(--radius-sm, 10px) var(--radius-sm, 10px) 0 0 !important;
  background: transparent !important;
  color: var(--text-secondary) !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  cursor: pointer !important;
  position: relative !important;
  padding: 0 4px !important;
  white-space: nowrap !important;
}
#urppp-settings-panel .urppp-set-tab:hover {
  color: var(--text) !important;
  background: var(--input-bg) !important;
}
#urppp-settings-panel .urppp-set-tab.ac {
  color: var(--primary) !important;
  background: color-mix(in srgb, var(--primary) 8%, var(--surface)) !important;
}
#urppp-settings-panel .urppp-set-tab.ac::after {
  content: '' !important;
  position: absolute !important;
  left: 18% !important;
  right: 18% !important;
  bottom: 0 !important;
  height: 2px !important;
  border-radius: 2px 2px 0 0 !important;
  background: var(--primary) !important;
}
#urppp-settings-panel .urppp-set-pane { display: none !important; }
#urppp-settings-panel .urppp-set-pane.ac { display: block !important; }
#urppp-settings-panel .urppp-skin-list {
  display: flex !important;
  flex-direction: column !important;
  gap: 32px !important;
  padding: 4px 10px 12px 4px !important;
}
#urppp-settings-panel .urppp-skin-card {
  position: relative !important;
  min-height: 118px !important;
  padding: 14px 14px 48px !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  filter: none !important;
  opacity: 1 !important;
  transition: transform 180ms ease-out, box-shadow 180ms ease-out, background-color 180ms ease-out, border-color 180ms ease-out !important;
}
#urppp-settings-panel .urppp-skin-name {
  font-size: 15px !important;
  font-weight: 700 !important;
  margin: 0 0 6px !important;
  color: inherit !important;
}
#urppp-settings-panel .urppp-skin-desc {
  margin: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  max-width: 72% !important;
  color: inherit !important;
  opacity: .88 !important;
}
#urppp-settings-panel .urppp-skin-card > .urppp-skin-apply {
  position: absolute !important;
  right: 12px !important;
  bottom: 12px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  height: 30px !important;
  padding: 0 12px !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  text-decoration: none !important;
  transition: transform 150ms ease-out, box-shadow 150ms ease-out, color 150ms ease-out, background-color 150ms ease-out !important;
}
#urppp-settings-panel .urppp-skin-card > .urppp-skin-apply.is-disabled {
  text-decoration: line-through !important;
  opacity: .62 !important;
}
#urppp-settings-panel .urppp-skin-card > .urppp-skin-apply.is-current {
  cursor: default !important;
  opacity: 1 !important;
}

/* Skin preview cards */
#urppp-settings-panel .urppp-skin-card[data-skin="apple"] {
  background: #f5f5f7 !important; color: #1d1d1f !important; border: 1px solid rgba(0,0,0,.06) !important;
  border-radius: 18px !important; box-shadow: 0 8px 24px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.04) !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="apple"]:hover {
  background: #fff !important; transform: translateY(-2px) !important;
  box-shadow: 0 14px 32px rgba(0,0,0,.12), 0 3px 8px rgba(0,0,0,.05) !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="apple"].is-active { box-shadow: 0 0 0 2px #0071e3, 0 12px 30px rgba(0,113,227,.14) !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="apple"] > .urppp-skin-apply {
  border: 1px solid #0071e3 !important; border-radius: 999px !important; background: rgba(255,255,255,.86) !important;
  color: #0071e3 !important; box-shadow: none !important; transform: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="apple"] > .urppp-skin-apply:not(:disabled):hover,
#urppp-settings-panel .urppp-skin-card[data-skin="apple"] > .urppp-skin-apply.is-current {
  background: #0071e3 !important; border-color: #0071e3 !important; color: #fff !important; box-shadow: none !important; transform: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="editorial"] {
  background: #f5f4f1 !important; color: #1c1c1c !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="editorial"]:hover { background: #efeeea !important; transform: none !important; box-shadow: none !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="editorial"].is-active { background: #e8e7e2 !important; outline: none !important; }
#urppp-settings-panel .urppp-skin-card[data-skin="editorial"] .urppp-skin-name {
  font-family: Georgia, "Noto Serif SC", "Songti SC", STSong, SimSun, "Times New Roman", serif !important; font-weight: 500 !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="editorial"] > .urppp-skin-apply {
  width: auto !important; min-height: 28px !important; height: auto !important; padding: 0 0 3px !important; border: 0 !important;
  border-radius: 0 !important; background: transparent !important; color: #1c1c1c !important; box-shadow: none !important; transform: none !important;
  text-decoration-line: underline !important; text-decoration-color: transparent !important; text-underline-offset: 3px !important;
  text-decoration-thickness: 1px !important; transition: text-decoration-color 180ms ease-out !important;
}
#urppp-settings-panel .urppp-skin-card[data-skin="editorial"] > .urppp-skin-apply:not(:disabled):hover,
#urppp-settings-panel .urppp-skin-card[data-skin="editorial"] > .urppp-skin-apply.is-current {
  background: transparent !important; color: #1c1c1c !important; text-decoration-color: currentColor !important; box-shadow: none !important; transform: none !important;
}
/* 暗色下编辑杂志按钮 hover：保持浅字，不做反色处理（避免黑字深底不可读） */
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"] > .urppp-skin-apply:not(:disabled):hover,
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"] > .urppp-skin-apply.is-current {
  background: transparent !important; color: #e8e8e4 !important; text-decoration-color: currentColor !important;
}

/* 暗色模式：主题卡片适配（深底浅字，保留各主题辨识主色） */
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="apple"] {
  background: #1d1d1f !important; color: #f5f5f7 !important; border-color: rgba(255,255,255,.14) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,.5), 0 2px 6px rgba(0,0,0,.3) !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="apple"]:hover { background: #2c2c2e !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="apple"] > .urppp-skin-apply {
  background: rgba(255,255,255,.12) !important; color: #7aa2ff !important; border-color: #4a6cf7 !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="apple"] > .urppp-skin-apply:not(:disabled):hover,
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="apple"] > .urppp-skin-apply.is-current {
  background: #4a6cf7 !important; border-color: #4a6cf7 !important; color: #fff !important;
}

html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"] {
  background: #1e1e1c !important; color: #e8e8e4 !important; border: 0 !important; box-shadow: none !important;
}
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"]:hover { background: #262624 !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"].is-active { background: #2c2c28 !important; }
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="editorial"] > .urppp-skin-apply { color: #e8e8e4 !important; }

/* About pane */
#urppp-settings-panel .urppp-about {
  display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important;
  padding: 18px 8px 10px !important; gap: 10px !important;
}
#urppp-settings-panel .urppp-about-logo {
  width: min(320px, 92%) !important; max-width: 100% !important; height: auto !important; display: block !important;
  border-radius: 0 !important; object-fit: contain !important; background: transparent !important;
  image-rendering: pixelated !important; image-rendering: crisp-edges !important;
}
#urppp-settings-panel .urppp-about-ver,
#urppp-settings-panel a.urppp-about-ver {
  margin: 4px 0 0 !important; font-size: 13px !important; font-weight: 700 !important; color: var(--text) !important;
  text-decoration: none !important; cursor: pointer !important;
}
#urppp-settings-panel a.urppp-about-ver:hover { color: var(--primary) !important; text-decoration: underline !important; }
#urppp-settings-panel .urppp-about-author,
#urppp-settings-panel .urppp-about-contact { margin: 0 !important; font-size: 12px !important; color: var(--text-secondary) !important; }
#urppp-settings-panel .urppp-about-msg {
  margin: 8px 0 0 !important; font-size: 12px !important; line-height: 1.65 !important;
  color: var(--text-secondary) !important; white-space: pre-line !important;
}
#urppp-settings-panel #urppp-set-assist-slot:empty { display: none !important; }
#urppp-settings-panel #urppp-set-assist-slot .urppp-set-sec { margin-top: 14px !important; }

#urppp-settings-panel .urppp-feature-grid{display:grid;gap:10px;margin-top:12px}
#urppp-settings-panel .urppp-feature-row{display:grid;grid-template-columns:minmax(98px,.72fr) minmax(0,1.5fr);gap:12px;align-items:center;min-width:0}
#urppp-settings-panel .urppp-feature-row>label{margin:0;color:var(--text-secondary);font-size:12px;font-weight:650;line-height:1.35;cursor:pointer}
#urppp-settings-panel .urppp-feature-row>label input{margin:0 5px 0 0;vertical-align:-2px;accent-color:var(--primary)}
#urppp-settings-panel .urppp-feature-input{width:100%;min-width:0;height:36px;border:1px solid var(--border);border-radius:8px;background:var(--input-bg);color:var(--text);padding:0 10px;outline:none;box-sizing:border-box;letter-spacing:0}
#urppp-settings-panel .urppp-feature-input[type="file"]{height:auto;min-height:36px;padding:6px 8px;font-size:11px}
#urppp-settings-panel .urppp-feature-input:focus{border-color:var(--primary);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary) 16%,transparent)}
#urppp-settings-panel .urppp-privacy-groups{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:stretch;margin-top:14px;border:1px solid var(--border);border-radius:12px;background:color-mix(in srgb,var(--surface) 78%,var(--input-bg));overflow:hidden}
#urppp-settings-panel .urppp-privacy-group{min-width:0;padding:11px}
#urppp-settings-panel .urppp-privacy-group+.urppp-privacy-group{border-left:1px solid var(--border)}
#urppp-settings-panel .urppp-privacy-group-title{margin:0 0 7px;color:var(--text);font-size:12px;font-weight:750;line-height:1.4}
#urppp-settings-panel .urppp-privacy-group-fields{display:grid;gap:3px}
#urppp-settings-panel .urppp-privacy-field{display:grid;grid-template-columns:18px minmax(0,1fr);gap:5px 6px;align-items:center;min-width:0;padding:2px 0 7px}
#urppp-settings-panel .urppp-privacy-field>input[type="checkbox"]{width:16px;height:16px;margin:0;accent-color:var(--primary);cursor:pointer}
#urppp-settings-panel .urppp-privacy-field>label{min-width:0;margin:0;color:var(--text-secondary);font-size:12px;font-weight:600;line-height:1.35;cursor:pointer;white-space:normal}
#urppp-settings-panel .urppp-privacy-field>.urppp-feature-input{grid-column:1/-1;height:32px;padding:0 8px;font-size:12px}
#urppp-settings-panel .urppp-privacy-note{grid-column:1/-1;padding-left:24px;font-size:10px;color:var(--text-muted);line-height:1.4}
#urppp-settings-panel .urppp-direct-edit-control{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:10px;padding:10px 2px 0;border-top:1px solid var(--border)}
#urppp-settings-panel .urppp-direct-edit-control>div{display:grid;gap:2px;min-width:0}
#urppp-settings-panel .urppp-direct-edit-control strong{color:var(--text);font-size:12px;line-height:1.35}
#urppp-settings-panel .urppp-direct-edit-control span{color:var(--text-muted);font-size:10px;line-height:1.4}
#urppp-settings-panel #urppp-set-direct-edit-toggle{flex:0 0 auto;width:auto!important;min-width:116px;margin:0!important}
#urppp-settings-panel .urppp-json-mapping-editor{display:none;gap:8px;margin-top:12px}
#urppp-settings-panel .urppp-json-mapping-editor>label{margin:0;color:var(--text-secondary);font-size:12px;font-weight:650}
#urppp-settings-panel #urppp-set-json-mapping{width:100%!important;min-width:0!important;min-height:260px!important;max-height:460px!important;margin:0!important;padding:10px 12px!important;box-sizing:border-box!important;resize:vertical!important;border:1px solid var(--border)!important;border-radius:8px!important;background:var(--input-bg)!important;color:var(--text)!important;outline:0!important;font-family:"JetBrains Mono","Cascadia Mono","Microsoft YaHei UI",monospace!important;font-size:11px!important;font-weight:400!important;line-height:1.55!important;letter-spacing:0!important;white-space:pre!important;overflow:auto!important}
#urppp-settings-panel #urppp-set-json-mapping:focus{border-color:var(--primary)!important;box-shadow:0 0 0 2px color-mix(in srgb,var(--primary) 16%,transparent)!important}
#urppp-settings-panel #urppp-set-json-status.urppp-status-error{color:color-mix(in srgb,var(--danger,#b91c1c) 60%,var(--text))!important}
#urppp-settings-panel .urppp-identity-editor{display:grid;grid-template-columns:minmax(0,1fr) 76px;gap:16px;align-items:start;margin-top:14px;padding:13px;border:1px solid var(--border);border-radius:12px;background:color-mix(in srgb,var(--surface) 78%,var(--input-bg))}
#urppp-settings-panel .urppp-identity-fields{display:grid;gap:10px;min-width:0}
#urppp-settings-panel .urppp-identity-preview{display:grid;justify-items:center;gap:7px;min-width:0}
#urppp-settings-panel .urppp-identity-preview-label{color:var(--text-muted);font-size:10px;font-weight:650;line-height:1.3;white-space:nowrap}
#urppp-settings-panel .urppp-avatar-preview-shell{position:relative;width:64px;height:64px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:10px;background:var(--input-bg);color:var(--text-muted);font-size:10px;overflow:hidden}
#urppp-settings-panel .urppp-avatar-preview{position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:inherit;background:var(--input-bg);object-fit:cover;display:none}
#urppp-settings-panel .urppp-feature-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
/* brutal 暗色：清爽服务卡文字/图标强制白字（补办学生证等黑底黑字可见） */
/* brutal 暗色：校历弹窗'下一个事件'卡黑底白字(默认近白背景+白字) */
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-privacy-groups,html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-identity-editor{border-width:1px 0;border-radius:0;background:transparent}
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-feature-input,html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-avatar-preview-shell{border-width:0 0 1px;border-radius:0;background:transparent}
html[data-urppp-skin="editorial"] #urppp-settings-panel #urppp-set-json-mapping{border-width:1px 0!important;border-radius:0!important;background:transparent!important}
/* editorial：选中态按钮倒置(--text底+--surface字)，避免 --primary 浅色导致白底白字 */
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode.ac,
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode.ac:not(:disabled),
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow.ac,
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow.ac:not(:disabled),
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac,
html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn.primary{
  background:var(--text)!important;border-color:var(--text)!important;color:var(--surface)!important;
}
html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-privacy-groups,html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-identity-editor{border:0;border-radius:16px;background:var(--neu-base);box-shadow:var(--neu-inset-soft)}
html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-privacy-group+.urppp-privacy-group{border-left-color:var(--neu-edge-soft)}
html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-feature-input,html[data-urppp-skin="neu"] #urppp-settings-panel .urppp-avatar-preview-shell{border:0;background:var(--neu-base);box-shadow:var(--neu-inset-soft)}
html[data-urppp-skin="neu"] #urppp-settings-panel #urppp-set-json-mapping{border:0!important;background:var(--neu-base)!important;box-shadow:var(--neu-inset-soft)!important}
@media(max-width:520px){#urppp-settings-panel .urppp-privacy-groups{grid-template-columns:1fr}#urppp-settings-panel .urppp-privacy-group{padding:10px}#urppp-settings-panel .urppp-privacy-group+.urppp-privacy-group{border-left:0;border-top:1px solid var(--border)}#urppp-settings-panel .urppp-privacy-field{grid-template-columns:18px minmax(92px,.72fr) minmax(0,1.28fr);min-height:44px;gap:7px;padding:0}#urppp-settings-panel .urppp-privacy-field>.urppp-feature-input{grid-column:auto;height:36px;font-size:12px}#urppp-settings-panel .urppp-privacy-note{grid-column:auto;padding-left:0;font-size:11px}html[data-urppp-skin="flat"] #urppp-settings-panel .urppp-privacy-group+.urppp-privacy-group{border-top:2px solid var(--text)}html[data-urppp-skin="brutal"] #urppp-settings-panel .urppp-privacy-group+.urppp-privacy-group{border-top:3px solid #000}#urppp-settings-panel .urppp-direct-edit-control{align-items:flex-start}#urppp-settings-panel .urppp-direct-edit-control span{max-width:170px}#urppp-settings-panel .urppp-identity-editor{grid-template-columns:1fr;padding:11px}#urppp-settings-panel .urppp-identity-preview{grid-template-columns:auto 64px;justify-content:start;align-items:center}#urppp-settings-panel .urppp-feature-row{grid-template-columns:minmax(96px,.72fr) minmax(0,1.28fr);gap:8px}#urppp-settings-panel .urppp-feature-actions>.urppp-set-btn{flex:1 1 100%}}
@media(max-width:700px){#urppp-settings-panel .urppp-feature-row{grid-template-columns:1fr}}

/* 辅助插件装载区（主插件侧，不依赖辅助 assist.css，首次加载即生效） */
#urppp-settings-panel .urppp-plugin-sec{margin-top:12px}
#urppp-settings-panel .urppp-plugin-status{font-size:12px;color:var(--text-secondary,#667085);margin:4px 0 6px}
#urppp-settings-panel .urppp-plugin-status.ok{color:#15803d}
#urppp-settings-panel .urppp-plugin-status.err{color:#b91c1c}
#urppp-settings-panel .urppp-plugin-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
#urppp-settings-panel .urppp-plugin-sub{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
#urppp-settings-panel .urppp-plugin-sec .urppp-set-btn{width:100%;justify-content:center}

/* 主题商店 / 插件商店：二级页（铺满设置面板，带返回按钮，非就地展开） */
#urppp-settings-panel .urppp-theme-store-bar{margin:14px 0 26px}
#urppp-settings-panel .urppp-theme-store-bar .urppp-set-btn{width:100%;justify-content:center}
#urppp-settings-panel .urppp-store-subpanel{position:absolute;top:0;left:0;width:100%;height:100%;max-height:none;display:none;flex-direction:column;background:var(--surface,#fff);z-index:6;animation:urpppStoreSubIn .16s ease}
#urppp-settings-panel .urppp-store-subpanel.open{display:flex}
@keyframes urpppStoreSubIn{from{opacity:0}to{opacity:1}}
#urppp-settings-panel .urppp-store-sub-head{display:flex;align-items:center;gap:10px;padding:13px 16px;border-bottom:1px solid var(--border,#e5e5ea)}
#urppp-settings-panel .urppp-store-sub-back{width:30px;height:30px;border:none;background:transparent;color:var(--text,#16181d);cursor:pointer;font-size:17px;line-height:1;display:grid;place-items:center;flex:none;border-radius:var(--radius-sm)}
#urppp-settings-panel .urppp-store-sub-back:hover{background:color-mix(in srgb,var(--primary,#2563eb) 10%,transparent)}
#urppp-settings-panel .urppp-store-sub-title{font-size:16px;font-weight:750;flex:1}
#urppp-settings-panel .urppp-store-sub-body{flex:1;min-height:0;overflow:auto;padding:16px 22px}
#urppp-settings-panel .urppp-store-sub-body .urppp-store-inline{margin-top:0;border-top:0;padding-top:0}
#urppp-settings-panel .urppp-store-sub-body .urppp-store-empty{min-height:180px}
#urppp-settings-panel .urppp-store-inline{margin-top:12px;border-top:1px solid var(--border,#e5e5ea);padding-top:14px}
#urppp-settings-panel .urppp-store-tabs{display:flex;gap:8px;margin-bottom:12px;border-bottom:1px solid var(--border,#e5e5ea)}
#urppp-settings-panel .urppp-store-tab{flex:1;height:34px;border:0;background:transparent;color:var(--text-secondary,#5b5f69);font-size:13px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent;padding:0}
#urppp-settings-panel .urppp-store-tab.ac{color:var(--text,#16181d);border-bottom-color:var(--primary,#2563eb)}
#urppp-settings-panel .urppp-store-body{min-height:0}
#urppp-settings-panel .urppp-store-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:120px;text-align:center;gap:6px;color:var(--text-secondary,#5b5f69);padding:16px 0}
#urppp-settings-panel .urppp-store-empty-title{font-size:15px;font-weight:700;color:var(--text,#16181d)}
#urppp-settings-panel .urppp-store-sub{font-size:12px;line-height:1.6;max-width:80%}
#urppp-settings-panel .urppp-store-item{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border:1px solid var(--border,#e5e5ea);border-radius:var(--radius-sm);margin-bottom:8px}
#urppp-settings-panel .urppp-store-item:last-child{margin-bottom:0}
#urppp-settings-panel .urppp-store-info{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#urppp-settings-panel .urppp-store-info strong{font-size:14px;font-weight:700}
#urppp-settings-panel .urppp-store-author{font-size:11px;color:var(--text-secondary,#5b5f69)}
#urppp-settings-panel .urppp-store-bd{display:flex;flex-direction:column;gap:8px}
#urppp-settings-panel .urppp-store-row{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
#urppp-settings-panel .urppp-store-dl{font-size:11px;color:var(--text-muted,#8a8378)}
#urppp-settings-panel .urppp-store-item-desc{font-size:12px;color:var(--text-secondary,#5b5f69);line-height:1.5}
#urppp-settings-panel .urppp-skin-meta{font-size:11px;color:var(--text-secondary,#5b5f69);margin:0 0 4px}
#urppp-settings-panel .urppp-store-item{display:flex;flex-direction:column;align-items:stretch;gap:8px}
#urppp-settings-panel .urppp-store-item .urppp-store-ops{justify-content:flex-end}
#urppp-settings-panel .urppp-store-item-desc{font-size:12px;color:var(--text-secondary,#5b5f69);line-height:1.5}
#urppp-settings-panel .urppp-skin-meta{font-size:11px;color:var(--text-secondary,#5b5f69);margin:0 0 4px}
#urppp-settings-panel .urppp-store-item{display:flex;flex-direction:column;align-items:stretch;gap:8px}
#urppp-settings-panel .urppp-store-ver{font-size:11px;color:var(--text-secondary,#5b5f69)}
#urppp-settings-panel .urppp-store-state{font-size:11px;color:var(--text-secondary,#5b5f69);padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--primary,#2563eb) 10%,transparent)}
#urppp-settings-panel .urppp-store-state.ok{color:#15803d;background:color-mix(in srgb,#15803d 12%,transparent)}
#urppp-settings-panel .urppp-store-ops{display:flex;gap:8px;flex:0 0 auto}
#urppp-settings-panel .urppp-store-ops .urppp-set-btn,#urppp-settings-panel .urppp-store-ops button{height:30px;padding:0 12px;font-size:12px;font-weight:650;border-radius:var(--radius-sm)}
#urppp-settings-panel .urppp-store-theme-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:26px}
#urppp-settings-panel .urppp-store-theme-grid .urppp-skin-card{margin:0}
#urppp-settings-panel .urppp-store-settings{display:flex;flex-direction:column;gap:10px;padding:0;margin:0 0 12px}
#urppp-settings-panel .urppp-store-settings .urppp-set-follow,#urppp-settings-panel .urppp-store-settings .urppp-set-btn{width:100%;margin-top:0}
#urppp-settings-panel .urppp-store-version{font-size:12px;color:var(--text-secondary,#5b5f69);padding:0 2px}
#urppp-settings-panel .urppp-store-ops{display:flex;gap:8px;flex:0 0 auto}

/* 仓库源管理 */
#urppp-settings-panel .urppp-src-manage{display:flex;flex-direction:column;gap:10px;padding:0;margin:0}
#urppp-settings-panel .urppp-src-hint{font-size:12px;color:var(--text-secondary,#5b5f69);margin:0;padding:0 2px}
#urppp-settings-panel .urppp-src-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--radius,8px);background:var(--surface,#f6f7f9);border:1px solid var(--border,#e6e8ec)}
html.urppp-theme-dark #urppp-settings-panel .urppp-src-item{background:var(--surface,#1c1c1e)}
#urppp-settings-panel .urppp-src-item .urppp-src-meta{display:flex;flex-direction:column;gap:2px;flex:1 1 auto;min-width:0}
#urppp-settings-panel .urppp-src-item .urppp-src-meta strong{font-size:13px;color:var(--text,#16181d);font-weight:700}
#urppp-settings-panel .urppp-src-url{font-size:12px;color:var(--text-secondary,#5b5f69);word-break:break-all}
#urppp-settings-panel .urppp-src-ops{display:flex;gap:8px;flex:0 0 auto}
#urppp-settings-panel .urppp-src-add{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
#urppp-settings-panel .urppp-src-add .urppp-set-btn{grid-column:1/-1}
#urppp-settings-panel .urppp-src-add .urppp-input{width:100%;box-sizing:border-box;padding:8px 10px;font-size:13px;color:var(--text,#16181d);background:var(--bg-input,#fff);border:1px solid var(--border,#e6e8ec);border-radius:8px;outline:none}
#urppp-settings-panel .urppp-src-add .urppp-input:focus{border-color:var(--accent,var(--link,#4a7bfa))}

/* 底部浮动提示 / 确认条（替代原生 alert/confirm） */
#urppp-toast{position:fixed;left:18px;right:auto;bottom:24px;z-index:99999;width:min(460px,calc(100vw - 36px));box-sizing:border-box;padding:10px 18px;border-radius:var(--radius,10px);background:var(--surface,#2b2f36);color:var(--text,#fff);font-size:13px;font-family:inherit;opacity:0;pointer-events:none;box-shadow:var(--shadow,0 -6px 18px rgba(0,0,0,.16))}
#urppp-toast.error{background:var(--danger,#b2392f);color:var(--primary-foreground,#fff)}
#urppp-confirm{position:fixed;left:18px;right:auto;bottom:24px;z-index:99999;width:min(460px,calc(100vw - 36px));box-sizing:border-box;opacity:0;pointer-events:none}
#urppp-confirm .urppp-confirm-card{padding:14px 16px;border-radius:var(--radius,12px);background:var(--surface,#fff);border:1px solid var(--border,#e6e8ec);box-shadow:var(--shadow,0 -6px 18px rgba(0,0,0,.14));font-family:inherit}
#urppp-confirm .urppp-confirm-txt{font-size:15px;color:var(--text,#16181d);line-height:1.5;font-weight:500}
#urppp-confirm .urppp-confirm-ops{display:flex;gap:10px;margin-top:14px}
#urppp-confirm .urppp-confirm-ops button{flex:1;min-height:32px;padding:6px 12px;font-size:13px;font-family:inherit;border-radius:var(--radius-sm,6px);border:1px solid var(--border,#e6e8ec);background:var(--surface,#fff);color:var(--text,#16181d);cursor:pointer;transition:.15s}
#urppp-confirm .urppp-confirm-ops button:hover{background:var(--primary-hover,#f0f1f3)}
#urppp-confirm .urppp-confirm-ops button[data-ok]{border-color:var(--primary,#4a7bfa);background:var(--primary,#4a7bfa);color:var(--primary-foreground,#fff)}
#urppp-confirm .urppp-confirm-ops button[data-ok]:hover{background:var(--primary-hover,#3a69e3)}
#urppp-confirm .urppp-confirm-ops button[data-cac]:hover{background:var(--primary,#4a7bfa);border-color:var(--primary,#4a7bfa);color:var(--primary-foreground,#fff)}

/* 仓库/删除按钮复用 apply 样式后的定位（覆盖 apply 默认 right:12px） */
#urppp-settings-panel .urppp-skin-card > .urppp-skin-apply.urppp-store-repo { right:auto!important; left:12px!important; }
#urppp-settings-panel .urppp-skin-card > .urppp-skin-apply.urppp-store-del { right:78px!important; }

/* 类Apple风格暗色卡兜底（最后声明，确保暗色下深卡，不再白卡） */
html.urppp-theme-dark #urppp-settings-panel .urppp-skin-card[data-skin="apple"] {
  background: #1d1d1f !important; color: #f5f5f7 !important; border-color: rgba(255,255,255,.14) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,.5), 0 2px 6px rgba(0,0,0,.3) !important;
}
`;var Ai=`      /* 表格美化：业务表格、分页、公告卡片（table-beautify） */
      /* 公告卡片：彻底切断 table-hover / ACE hover 白底 */
      table.urppp-notice-table,
      table.urppp-notice-table.table,
      table.urppp-notice-table.table-hover,
      table.urppp-notice-table.table-striped {
        background: transparent !important;
        background-color: transparent !important;
      }
      html body table.urppp-notice-table > tbody > tr,
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row,
      html body table.urppp-notice-table.table-hover > tbody > tr,
      html body table.urppp-notice-table.table-hover > tbody > tr:hover,
      html body table.urppp-notice-table.table-hover > tbody > tr.hover,
      html body table.urppp-notice-table.table-striped > tbody > tr,
      html body table.urppp-notice-table.table-striped > tbody > tr:nth-of-type(odd),
      html body table.urppp-notice-table.table-striped > tbody > tr:nth-of-type(even),
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row:hover,
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row.hover,
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row:nth-of-type(odd),
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row:nth-of-type(even) {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
      }
      html body table.urppp-notice-table > tbody > tr > td,
      html body table.urppp-notice-table > tbody > tr > th,
      html body table.urppp-notice-table.table-hover > tbody > tr > td,
      html body table.urppp-notice-table.table-hover > tbody > tr:hover > td,
      html body table.urppp-notice-table.table-hover > tbody > tr.hover > td,
      html body table.urppp-notice-table.table-striped > tbody > tr > td,
      html body table.urppp-notice-table.table-striped > tbody > tr:nth-of-type(odd) > td,
      html body table.urppp-notice-table.table-striped > tbody > tr:nth-of-type(even) > td,
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row > td,
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row:hover > td,
      html body table.urppp-notice-table > tbody > tr.urppp-notice-row.hover > td {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* ============================================================
      /* ============================================================
      /* ============================================================
       * 评估公告 / 通知列表：紧凑卡片，日期在卡内右侧
       * ============================================================ */
      table.urppp-notice-table,
      .page-content table.urppp-notice-table,
      .urppp-table-wrap.urppp-notice-wrap,
      .urppp-table-wrap:has(table.urppp-notice-table) {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        overflow: visible !important;
        border-radius: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        display: block !important;
        box-sizing: border-box !important;
      }
      table.urppp-notice-table > tbody,
      table.urppp-notice-table > thead,
      table.urppp-notice-table > tfoot {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      table.urppp-notice-table > tbody > tr.urppp-notice-row,
      table.urppp-notice-table > tbody > tr {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 16px !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 0 10px !important;
        padding: 12px 18px !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04) !important;
        position: relative !important;
        overflow: hidden !important;
        transition: border-color .15s ease, box-shadow .15s ease !important;
      }
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover,
      table.urppp-notice-table > tbody > tr.urppp-notice-row.hover,
      table.urppp-notice-table.table-hover > tbody > tr.urppp-notice-row:hover {
        flex-wrap: nowrap !important;
        flex-direction: row !important;
        align-items: center !important;
        border-color: color-mix(in srgb, var(--primary) 35%, var(--border)) !important;
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08) !important;
      }
      table.urppp-notice-table > tbody > tr > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover > td,
      table.urppp-notice-table > tbody > tr.urppp-notice-row.hover > td {
        display: block !important;
        border: none !important;
        background: transparent !important;
        background-color: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        vertical-align: middle !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        float: none !important;
        position: static !important;
      }
      table.urppp-notice-table > tbody > tr > td.urppp-notice-bullet-cell {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        padding: 0 !important;
        margin: 0 !important;
        flex: 0 0 0 !important;
      }
      table.urppp-notice-table > tbody > tr > td.urppp-notice-title-cell,
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover > td.urppp-notice-title-cell,
      table.urppp-notice-table > tbody > tr.hover > td.urppp-notice-title-cell {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        flex: 1 1 0% !important;
        min-width: 0 !important;
        max-width: none !important;
        width: auto !important;
        overflow: hidden !important;
        position: static !important;
        order: 1 !important;
        white-space: nowrap !important;
      }
      table.urppp-notice-table > tbody > tr > td.urppp-notice-title-cell::before {
        content: '' !important;
        display: block !important;
        width: 7px !important;
        height: 7px !important;
        min-width: 7px !important;
        border-radius: 50% !important;
        background: var(--primary) !important;
        margin: 0 !important;
        flex: 0 0 auto !important;
      }
      table.urppp-notice-table .urppp-notice-link,
      table.urppp-notice-table a.urppp-notice-link,
      table.urppp-notice-table td.urppp-notice-title-cell a,
      table.urppp-notice-table td.urppp-notice-title-cell a:link,
      table.urppp-notice-table td.urppp-notice-title-cell a:visited,
      table.urppp-notice-table td.urppp-notice-title-cell a:hover,
      table.urppp-notice-table td.urppp-notice-title-cell a:focus,
      table.urppp-notice-table a {
        color: var(--text) !important;
        text-decoration: none !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        line-height: 1.5 !important;
        border: none !important;
        background: transparent !important;
        flex: 1 1 auto !important;
        min-width: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
        pointer-events: auto !important;
        cursor: pointer !important;
        position: relative !important;
        z-index: 3 !important;
        /* inline 无法稳定 ellipsis；block 才能单行截断 */
        display: block !important;
      }
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover .urppp-notice-link,
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover td.urppp-notice-title-cell a,
      table.urppp-notice-table > tbody > tr.hover .urppp-notice-link {
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        display: block !important;
      }
      table.urppp-notice-table > tbody > tr.urppp-notice-row,
      table.urppp-notice-table td.urppp-notice-title-cell {
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      /* ::before 圆点不拦截点击 */
      table.urppp-notice-table > tbody > tr > td.urppp-notice-title-cell::before {
        pointer-events: none !important;
      }
      table.urppp-notice-table .urppp-notice-link:hover,
      table.urppp-notice-table td.urppp-notice-title-cell a:hover,
      table.urppp-notice-table > tbody > tr:hover td.urppp-notice-title-cell a,
      table.urppp-notice-table > tbody > tr.hover td.urppp-notice-title-cell a {
        color: var(--primary) !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        display: block !important;
        max-width: 100% !important;
      }
      table.urppp-notice-table td.urppp-notice-date-cell,
      table.urppp-notice-table > tbody > tr.urppp-notice-row:hover > td.urppp-notice-date-cell {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        flex: 0 0 auto !important;
        flex-shrink: 0 !important;
        width: auto !important;
        max-width: none !important;
        white-space: nowrap !important;
        text-align: right !important;
        order: 2 !important;
        margin-left: auto !important;
        float: none !important;
        position: static !important;
        right: auto !important;
        left: auto !important;
      }
      .urppp-notice-time {
        display: inline-flex !important;
        align-items: center !important;
        font-size: 12px !important;
        line-height: 1.4 !important;
        color: var(--text-muted) !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        border-radius: 999px !important;
        padding: 4px 10px !important;
        white-space: nowrap !important;
        position: static !important;
        float: none !important;
      }
      .urppp-notice-card {
        display: block !important;
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        padding: 16px 18px 14px !important;
        box-sizing: border-box !important;
        max-width: 100% !important;
      }
      .urppp-notice-card-row {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 16px !important;
        padding: 12px 16px !important;
        max-width: 100% !important;
      }
      .urppp-notice-card-row .urppp-notice-main {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        min-width: 0 !important;
        flex: 1 1 auto !important;
      }
      .urppp-notice-card-row .urppp-notice-main::before {
        content: '' !important;
        width: 7px !important;
        height: 7px !important;
        border-radius: 50% !important;
        background: var(--primary) !important;
        flex: 0 0 auto !important;
      }
      .urppp-notice-title {
        display: block !important;
        font-size: 15px !important;
        font-weight: 600 !important;
        line-height: 1.45 !important;
        color: var(--text) !important;
        margin: 0 0 8px !important;
      }
      .urppp-notice-body {
        display: block !important;
        font-size: 14px !important;
        line-height: 1.75 !important;
        color: var(--text) !important;
        margin: 0 0 10px !important;
        white-space: pre-wrap !important;
      }
      .urppp-notice-meta {
        display: flex !important;
        justify-content: flex-end !important;
        align-items: center !important;
        margin: 0 !important;
        flex: 0 0 auto !important;
      }
      table.urppp-notice-table a,
      table.urppp-notice-table a:link,
      table.urppp-notice-table a:visited {
        color: var(--text) !important;
        text-decoration: none !important;
      }
      table.urppp-notice-table a:hover {
        color: var(--primary) !important;
      }

      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.urppp-notice-row,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr:hover,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr.hover,
      html.urppp-theme-dark table.urppp-notice-table.table-striped > tbody > tr,
      html.urppp-theme-dark table.urppp-notice-table.table-striped > tbody > tr:nth-of-type(odd),
      html.urppp-theme-dark table.urppp-notice-table.table-striped > tbody > tr:nth-of-type(even),
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.urppp-notice-row:hover,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.urppp-notice-row.hover,
      html.urppp-theme-dark .urppp-notice-card {
        background: #151A24 !important;
        background-color: #151A24 !important;
        border-color: var(--border) !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.25) !important;
      }
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr > td,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr:hover > td,
      html.urppp-theme-dark table.urppp-notice-table > tbody > tr.hover > td,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr > td,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr:hover > td,
      html.urppp-theme-dark table.urppp-notice-table.table-hover > tbody > tr.hover > td {
        background: transparent !important;
        background-color: transparent !important;
      }

      /* 公告日期胶囊：暗色下更柔和 */
      html.urppp-theme-dark .urppp-notice-time {
        background: color-mix(in srgb, var(--primary) 16%, var(--input-bg)) !important;
        border-color: color-mix(in srgb, var(--primary) 28%, var(--border)) !important;
        color: var(--text-secondary) !important;
      }
      /* 分页条在滚动区外：始终在表格容器下方 */
      #urppagebar,
      #urppagebar.urppp-pagebar {
        position: relative !important;
        clear: both !important;
        z-index: 2 !important;
      }
      /* 滚动加载遮罩（div_page_loading_urppagebar）：完全隐藏不占位，
       * 避免列表下方的空白条；站点加载指示已由 img/伪元素规则处理。 */
      #urppagebar [id^="div_page_loading"][id*="urppagebar"],
      #urppagebar [id*="page_loading"][id*="urppagebar"],
      [id^="div_page_loading"][id*="urppagebar"],
      [id*="page_loading"][id*="urppagebar"],
      div[id*="page_loading"][id*="urppagebar"] {
        display: none !important;
        position: static !important;
        width: auto !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* 分页「确定」：禁止全局 .btn 的 display:inline-flex 盖掉 display:none */
      #urppagebar [id^="btn_turnpageto_"].btn,
      #urppagebar input.btn[id^="btn_turnpageto_"],
      body #urppagebar .btn[id^="btn_turnpageto_"] {
        /* display 留给内联 style / 站点 JS；只定尺寸 */
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        min-width: 56px !important;
        padding: 0 12px !important;
        font-size: 13px !important;
        line-height: 1 !important;
        box-sizing: border-box !important;
      }
      #urppagebar [id^="btn_turnpageto_"][style*="display: none"],
      #urppagebar [id^="btn_turnpageto_"][style*="display:none"],
      body #urppagebar .btn[id^="btn_turnpageto_"][style*="display: none"],
      body #urppagebar .btn[id^="btn_turnpageto_"][style*="display:none"] {
        display: none !important;
      }

      /* 分页「确定」：用更高优先级盖过全局 .btn display:inline-flex */
      #urppagebar .btn.urppp-page-confirm,
      #urppagebar button.urppp-page-confirm,
      #urppagebar a.btn.urppp-page-confirm,
      #urppagebar input.urppp-page-confirm,
      .urppagebreak .btn.urppp-page-confirm,
      .urppagebreak button.urppp-page-confirm,
      body #urppagebar .urppp-page-confirm {
        display: none !important;
        height: 32px !important;
        min-height: 32px !important;
        max-height: 32px !important;
        min-width: 52px !important;
        padding: 0 12px !important;
        font-size: 13px !important;
      }
      #urppagebar .btn.urppp-page-confirm.urppp-page-confirm-show,
      #urppagebar button.urppp-page-confirm.urppp-page-confirm-show,
      #urppagebar a.btn.urppp-page-confirm.urppp-page-confirm-show,
      #urppagebar input.urppp-page-confirm.urppp-page-confirm-show,
      .urppagebreak .btn.urppp-page-confirm.urppp-page-confirm-show,
      body #urppagebar .urppp-page-confirm.urppp-page-confirm-show {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      /* 分页/每页条数：不截断，不强制压扁 */
      .urppagebreak select,
      .urppagebreak #pagesize,
      #urppagebar select,
      select#pagesize,
      .pagination select,
      .dataTables_length select {
        width: auto !important;
        min-width: 0 !important;
        max-width: none !important;
        height: 28px !important;
        min-height: 28px !important;
        padding: 2px 6px !important;
        font-size: 13px !important;
        line-height: 1.2 !important;
        border-radius: var(--radius-sm) !important;
        -webkit-appearance: menulist !important;
        appearance: menulist !important;
        background-image: none !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
      }

      /* ============================================================
       * 分页（pagination.js 真实结构）
       * ul.pagination > li.paginate_button > span[padding:3px 7px]
       * 当前页 li.active；确定 #btn_turnpageto_* focus 显示
       * ============================================================ */
      #urppagebar,
      #urppagebar.urppp-pagebar {
        display: block !important;
        width: 100% !important;
        margin-top: 10px !important;
        line-height: 1.5 !important;
        font-size: 13px !important;
        color: var(--text-secondary) !important;
        box-sizing: border-box !important;
      }
      /* 「共 x 条」等纯文本：正常行高，禁止被 36px chip 行高带歪 */
      #urppagebar.urppp-pagebar-jump,
      #urppagebar.urppp-pagebar-jump .dataTables_paginate {
        white-space: normal !important;
      }
      /* 默认不强制 flex；真跳转才 flex */
      #urppagebar .dataTables_paginate,
      #urppagebar [id^="sample-table-2_paginate_"] {
        position: relative !important;
        width: 100% !important;
        line-height: 1.5 !important;
      }
      #urppagebar.urppp-pagebar-jump .dataTables_paginate,
      #urppagebar.urppp-pagebar-jump [id^="sample-table-2_paginate_"] {
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 8px 10px !important;
      }
      /*
       * 滚动态：单行右对齐。
       * class 由 JS 打标；:has(readonly) 覆盖重建瞬间、class 尚未挂上时。
       */
      #urppagebar.urppp-pagebar-scroll,
      #urppagebar.urppp-pagebar-scroll .dataTables_paginate,
      #urppagebar.urppp-pagebar-scroll [id^="sample-table-2_paginate_"],
      #urppagebar:has([id^="turnpageto_"][readonly]),
      #urppagebar:has([id^="turnpageto_"][readonly]) .dataTables_paginate,
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="sample-table-2_paginate_"] {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        justify-content: flex-end !important;
        align-items: center !important;
        gap: 0 4px !important;
        width: 100% !important;
        white-space: nowrap !important;
        line-height: 1.5 !important;
        text-align: right !important;
      }
      #urppagebar.urppp-pagebar-scroll .dataTables_paginate > div,
      #urppagebar.urppp-pagebar-scroll [id^="sample-table-2_paginate_"] > div,
      #urppagebar:has([id^="turnpageto_"][readonly]) .dataTables_paginate > div,
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="sample-table-2_paginate_"] > div {
        display: inline-flex !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: flex-end !important;
        float: none !important;
        width: auto !important;
        white-space: nowrap !important;
        flex: 0 0 auto !important;
      }
      #urppagebar.urppp-pagebar-scroll [id^="currNum_"],
      #urppagebar.urppp-pagebar-scroll [id^="selectNum_"],
      #urppagebar.urppp-pagebar-scroll ul.pagination,
      #urppagebar.urppp-pagebar-scroll [id^="pagination_ul_"],
      #urppagebar.urppp-pagebar-scroll [id^="btn_turnpageto_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="currNum_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="selectNum_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) ul.pagination,
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="pagination_ul_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="btn_turnpageto_"] {
        display: none !important;
      }
      #urppagebar.urppp-pagebar-scroll [id^="span_page_txt_"],
      #urppagebar.urppp-pagebar-scroll [id^="totalPage_show_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="span_page_txt_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="totalPage_show_"] {
        display: inline !important;
        float: none !important;
        white-space: nowrap !important;
        vertical-align: middle !important;
      }
      #urppagebar.urppp-pagebar-scroll span:has(> [id^="turnpageto_"]),
      #urppagebar:has([id^="turnpageto_"][readonly]) span:has(> [id^="turnpageto_"]) {
        display: inline-flex !important;
        align-items: center !important;
        position: static !important;
        width: auto !important;
        height: auto !important;
        float: none !important;
      }
      #urppagebar.urppp-pagebar-scroll [id^="turnpageto_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) [id^="turnpageto_"] {
        display: inline-block !important;
        float: none !important;
        vertical-align: middle !important;
        width: 40px !important;
        min-width: 40px !important;
        max-width: 40px !important;
        height: 26px !important;
        min-height: 26px !important;
        margin: 0 2px !important;
        padding: 0 4px !important;
        line-height: 24px !important;
        font-size: 12px !important;
        box-sizing: border-box !important;
      }
      /* 每页条数：固定 128px，完整显示「滚动加载(30)」 */
      #urppagebar.urppp-pagebar-scroll select,
      #urppagebar.urppp-pagebar-scroll select[id^="pagination_pageSize_"],
      #urppagebar:has([id^="turnpageto_"][readonly]) select,
      html body #urppagebar.urppp-pagebar-scroll select {
        display: inline-block !important;
        float: none !important;
        vertical-align: middle !important;
        width: 128px !important;
        min-width: 128px !important;
        max-width: 128px !important;
        height: 28px !important;
        min-height: 28px !important;
        max-height: 28px !important;
        margin: 0 4px !important;
        padding: 0 8px !important;
        flex: 0 0 128px !important;
        box-sizing: border-box !important;
        text-overflow: clip !important;
        overflow: hidden !important;
        white-space: nowrap !important;
      }

      /* 清掉旧 pagination 全局小按钮样式在页码条上的影响 */
      #urppagebar.urppp-pagebar-jump ul.pagination,
      #urppagebar.urppp-pagebar-jump ul.urppp-pagination {
        display: inline-flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 4px !important;
        margin: 0 !important;
        padding: 0 !important;
        list-style: none !important;
        float: none !important;
        position: static !important;
        border: none !important;
        background: transparent !important;
      }
      #urppagebar ul.pagination > li,
      #urppagebar .paginate_button,
      #urppagebar .urppp-page-li {
        display: inline-flex !important;
        float: none !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: transparent !important;
        list-style: none !important;
      }
      /* 真正的可点 chip = 内层 span（站点写死 padding:3px 7px，必须覆盖） */
      #urppagebar ul.pagination > li > span,
      #urppagebar ul.pagination > li > a,
      #urppagebar .paginate_button > span,
      #urppagebar .paginate_button > a,
      #urppagebar .urppp-page-chip,
      body #urppagebar .pagination > li > span,
      body #urppagebar .pagination > li > a {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        float: none !important;
        position: static !important;
        box-sizing: border-box !important;
        width: auto !important;
        min-width: 40px !important;
        height: 36px !important;
        min-height: 36px !important;
        max-height: 36px !important;
        padding: 0 12px !important;
        margin: 0 !important;
        line-height: 36px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        border-radius: var(--radius-sm) !important;
        border: 1px solid var(--border) !important;
        background: var(--surface) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        cursor: pointer !important;
      }
      #urppagebar ul.pagination > li.previous > span,
      #urppagebar ul.pagination > li.next > span,
      #urppagebar .urppp-page-chip-nav {
        min-width: 72px !important;
      }
      /* 分页条里的说明文字 / 每页条数：正常排版 */
      #urppagebar > span,
      #urppagebar .dataTables_paginate > span,
      #urppagebar label,
      #urppagebar font,
      #urppagebar {
        font-size: 13px !important;
      }
      #urppagebar select {
        height: 32px !important;
        min-height: 32px !important;
        line-height: 1.3 !important;
        vertical-align: middle !important;
      }
      #urppagebar.urppp-pagebar-jump [id^="turnpageto_"] {
        height: 32px !important;
        min-height: 32px !important;
        line-height: 1.3 !important;
        width: 48px !important;
        vertical-align: middle !important;
      }
      #urppagebar.urppp-pagebar-jump [id^="btn_turnpageto_"] {
        height: 32px !important;
        min-height: 32px !important;
        line-height: 1 !important;
        vertical-align: middle !important;
      }
      /* 当前页 */
      #urppagebar ul.pagination > li.active > span,
      #urppagebar ul.pagination > li.active > a,
      #urppagebar .paginate_button.active > span,
      #urppagebar .urppp-page-chip-active,
      body #urppagebar .pagination > li.active > span,
      body #urppagebar .pagination > li.active > a {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        font-weight: 700 !important;
      }
      /* 禁用 */
      #urppagebar ul.pagination > li.disabled > span,
      #urppagebar .urppp-page-chip-disabled {
        color: var(--text-muted) !important;
        background: var(--input-bg) !important;
        border-color: var(--border) !important;
        cursor: default !important;
        opacity: 0.75 !important;
      }
      #urppagebar ul.pagination > li > span:hover,
      #urppagebar ul.pagination > li.pagebarhand > span:hover {
        border-color: var(--primary) !important;
        color: var(--primary) !important;
      }
      #urppagebar ul.pagination > li.active > span:hover {
        color: #fff !important;
        border-color: var(--primary) !important;
      }
      /* 跳转输入：仅真跳转分页改尺寸；滚动态跟站点，避免闪 */
      #urppagebar.urppp-pagebar-jump [id^="turnpageto_"],
      #urppagebar.urppp-pagebar-jump input.urppp-page-goto {
        display: inline-block !important;
        position: static !important;
        height: 36px !important;
        width: 48px !important;
        margin: 0 4px !important;
        padding: 4px 8px !important;
        font-size: 14px !important;
        line-height: 1.2 !important;
        box-sizing: border-box !important;
        vertical-align: middle !important;
      }
      #urppagebar [id^="btn_turnpageto_"],
      #urppagebar .urppp-page-confirm {
        position: static !important;
        left: auto !important;
        top: auto !important;
        height: 36px !important;
        min-width: 56px !important;
        margin: 0 4px !important;
        padding: 0 12px !important;
        font-size: 13px !important;
        line-height: 1 !important;
        vertical-align: middle !important;
        float: none !important;
      }
      /* 站点默认 display:none；focus 时 inline-block —— 不要用全局 .btn 盖掉 none */
      #urppagebar [id^="btn_turnpageto_"][style*="display: none"],
      #urppagebar [id^="btn_turnpageto_"][style*="display:none"] {
        display: none !important;
      }
      #urppagebar [id^="btn_turnpageto_"][style*="inline-block"],
      #urppagebar [id^="btn_turnpageto_"][style*="inline-flex"] {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      /* 每页条数：真跳转分页可用稍大尺寸；滚动态保持紧凑行内 */
      #urppagebar.urppp-pagebar-jump select[id^="pagination_pageSize_"],
      #urppagebar.urppp-pagebar-jump select {
        height: 36px !important;
        min-height: 36px !important;
        width: auto !important;
        min-width: 64px !important;
        max-width: none !important;
        padding: 2px 8px !important;
        font-size: 13px !important;
        vertical-align: middle !important;
        border-radius: var(--radius-sm) !important;
      }
      #urppagebar [id^="totalPage_show_"],
      #urppagebar [id^="span_page_txt_"] {
        display: inline !important;
        border: none !important;
        background: transparent !important;
        padding: 0 !important;
        margin: 0 !important;
        height: auto !important;
        line-height: 36px !important;
        font-size: 13px !important;
        color: var(--text-secondary, var(--text-muted)) !important;
      }
      /* 兼容旧 class 名（若残留） */
      .urppagebreak {
        display: flex !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 6px 8px !important;
      }

      /* 分页（通用；#urppagebar 内由上方专用规则覆盖为 36px 整颗 chip） */
      .pagination > li > a, .pagination > li > span {
        background: var(--surface) !important;
        border-color: var(--border) !important;
        color: var(--text) !important;
        border-radius: var(--radius-sm) !important;
        margin: 0 2px !important;
      }
      .pagination > li > a:hover { background: var(--input-bg) !important; color: var(--primary) !important; }
      .pagination > li.active > a, .pagination > li.active > span, .pagination > li.active > a:hover { background: var(--primary) !important; border-color: var(--primary) !important; color: #fff !important; }

      html.urppp-theme-dark .pagination > li > a,
      html.urppp-theme-dark .pagination > li > span,
      html.urppp-theme-dark .urppp-page-chip {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .pagination > li.active > a,
      html.urppp-theme-dark .pagination > li.active > span,
      html.urppp-theme-dark .urppp-page-chip-active {
        background: var(--primary) !important;
        color: #0B0F17 !important;
        border-color: var(--primary) !important;
      }
      /* modal */
      html.urppp-theme-dark .modal-content,
      html.urppp-theme-dark .modal-header,
      html.urppp-theme-dark .modal-body,
      html.urppp-theme-dark .modal-footer {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* zTree */
      html.urppp-theme-dark .ztree li a,
      html.urppp-theme-dark .urppp-ztree li a {
        color: var(--text) !important;
      }

      /* 分页条每页条数：禁止 ellipsis；禁止 Chosen 接管 */
      #urppagebar select,
      #urppagebar select.form-control,
      .urppagebreak select {
        text-overflow: clip !important;
        max-width: none !important;
      }
      #urppagebar .chosen-container,
      #urppagebar .chosen-container-single,
      .urppagebreak .chosen-container {
        display: none !important;
        width: 0 !important;
        min-width: 0 !important;
        max-width: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
      #urppagebar select[id^="pagination_pageSize_"],
      #urppagebar select.urppp-chosen-hidden,
      #urppagebar select.chzn-done {
        display: inline-block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: static !important;
        width: 128px !important;
        min-width: 128px !important;
        max-width: 128px !important;
        height: 28px !important;
        min-height: 28px !important;
        pointer-events: auto !important;
      }
      /* scroll 容器内表格：不要再套一层 overflow:auto 双滚动 */
      [id$="_scroll"].urppp-table-wrap,
      [id$="_scroll"] .urppp-table-wrap {
        overflow: visible !important;
        border: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
        background: transparent !important;
      }

      .page-content .tab-pane .urppp-table-wrap,
      .page-content .tab-pane form .urppp-table-wrap,
      .page-content .tab-pane #sample-table-2,
      .page-content .tab-pane form .table {
        width: 100% !important;
        max-width: 100% !important;
      }

      /* 表格：外框交给 wrapper，表格本身只负责内部网格 */
      .urppp-table-wrap {
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        overflow: auto !important;
        background: var(--surface) !important;
        margin: 0 0 8px !important;
      }
      .table, .table-bordered, .table-striped, .table-hover, .dataTable {
        background: var(--surface) !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        color: var(--text) !important;
        border-collapse: collapse !important;
        margin-bottom: 0 !important;
        width: 100% !important;
      }
      /* 只画 right/bottom，top/left 由 wrapper 提供，避免与 Bootstrap thead border-top:0 冲突 */
      .table > thead > tr > th, .table-bordered > thead > tr > th, .dataTable > thead > tr > th,
      .table > tbody > tr > th, .table > tbody > tr > td,
      .table-bordered > tbody > tr > td, .dataTable > tbody > tr > td,
      .table > tfoot > tr > th, .table > tfoot > tr > td {
        border: none !important;
        border-right: 1px solid var(--border) !important;
        border-bottom: 1px solid var(--border) !important;
        color: var(--text) !important;
        padding: 10px 12px !important;
        font-size: 13px !important;
        vertical-align: middle !important;
      }
      .table > thead > tr > th:last-child,
      .table > tbody > tr > td:last-child,
      .table > tbody > tr > th:last-child,
      .table > tfoot > tr > th:last-child,
      .table > tfoot > tr > td:last-child,
      .table-bordered > thead > tr > th:last-child,
      .table-bordered > tbody > tr > td:last-child {
        border-right: none !important;
      }
      .table > tbody > tr:last-child > td,
      .table > tbody > tr:last-child > th,
      .table > tfoot > tr:last-child > td,
      .table > tfoot > tr:last-child > th,
      .table-bordered > tbody > tr:last-child > td {
        border-bottom: none !important;
      }
      .table > thead > tr > th, .table-bordered > thead > tr > th, .dataTable > thead > tr > th {
        background: var(--input-bg) !important;
        color: var(--text) !important;
        font-weight: 600 !important;
        white-space: nowrap !important;
      }
      .table > tbody > tr,
      .table > tbody > tr > td,
      .table > tbody > tr > th,
      .table-bordered > tbody > tr,
      .table-bordered > tbody > tr > td,
      .dataTable > tbody > tr,
      .dataTable > tbody > tr > td {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
      }
      .table-striped > tbody > tr:nth-of-type(odd),
      .table-striped > tbody > tr:nth-of-type(odd) > td,
      .table-striped > tbody > tr:nth-of-type(odd) > th,
      .dataTable > tbody > tr:nth-of-type(odd),
      .dataTable > tbody > tr:nth-of-type(odd) > td,
      .dataTable > tbody > tr:nth-of-type(odd) > th {
        background: var(--bg) !important;
        background-color: var(--bg) !important;
      }
      .table-hover > tbody > tr:not(.urppp-notice-row):hover,
      .table-hover > tbody > tr:not(.urppp-notice-row):hover > td,
      .table-hover > tbody > tr:not(.urppp-notice-row):hover > th,
      .table-hover > tbody > tr.hover:not(.urppp-notice-row),
      .table-hover > tbody > tr.hover:not(.urppp-notice-row) > td,
      .dataTable > tbody > tr:hover,
      .dataTable > tbody > tr:hover > td {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
      }
      /*
       * 成绩表站点标记：
       *   td.green_background = 及格/通过
       *   td.red_background / .pink 等 = 不及格（若有）
       * 必须压过上面 tbody td 的 surface !important
       */
      html body .table > tbody > tr > td.green_background,
      html body .table-bordered > tbody > tr > td.green_background,
      html body .table-striped > tbody > tr > td.green_background,
      html body .table-hover > tbody > tr > td.green_background,
      html body .dataTable > tbody > tr > td.green_background,
      html body td.green_background,
      html body .green_background {
        background: #d9f5d6 !important;
        background-color: #d9f5d6 !important;
        color: #166534 !important;
      }
      html body .table-hover > tbody > tr:hover > td.green_background,
      html body .table-hover > tbody > tr.hover > td.green_background {
        background: #c6efc0 !important;
        background-color: #c6efc0 !important;
        color: #14532d !important;
      }
      html body .table > tbody > tr > td.red_background,
      html body .table-bordered > tbody > tr > td.red_background,
      html body .dataTable > tbody > tr > td.red_background,
      html body td.red_background,
      html body .red_background {
        background: #fde2e1 !important;
        background-color: #fde2e1 !important;
        color: #991b1b !important;
      }
      html body .table-hover > tbody > tr:hover > td.red_background,
      html body .table-hover > tbody > tr.hover > td.red_background {
        background: #fbcaca !important;
        background-color: #fbcaca !important;
        color: #7f1d1d !important;
      }
      .tab-content .urppp-table-wrap,
      .tab-content .table,
      .tab-content .table-bordered {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }

      #billContainer .table-box,
      #billContainer table {
        background: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }

      /* 表格：强制 td/th 吃主题色，盖掉 Bootstrap #fff / 评教 table-box #EDF3F4 */
      html.urppp-theme-dark .table,
      html.urppp-theme-dark .table-bordered,
      html.urppp-theme-dark .table-striped,
      html.urppp-theme-dark .dataTable,
      html.urppp-theme-dark .urppp-table-wrap,
      html.urppp-theme-dark table.table-box,
      html.urppp-theme-dark .table-box,
      html.urppp-theme-dark table[style*='background'],
      html.urppp-theme-dark table[style*='EDF3F4'],
      html.urppp-theme-dark table[style*='edf3f4'],
      body.urppp-dark .table,
      body.urppp-dark table.table-box,
      body.urppp-dark .table-box {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* 评教问卷等：无 .table class 的裸 table / table-box */
      html.urppp-theme-dark .page-content table,
      html.urppp-theme-dark #page-content-template table,
      html.urppp-theme-dark .main-content table,
      html.urppp-theme-dark .widget-body table,
      html.urppp-theme-dark .widget-main table,
      body.urppp-dark .page-content table {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .page-content table td,
      html.urppp-theme-dark .page-content table th,
      html.urppp-theme-dark #page-content-template table td,
      html.urppp-theme-dark #page-content-template table th,
      html.urppp-theme-dark .main-content table td,
      html.urppp-theme-dark .main-content table th,
      html.urppp-theme-dark .widget-body table td,
      html.urppp-theme-dark .widget-body table th,
      html.urppp-theme-dark table.table-box td,
      html.urppp-theme-dark table.table-box th,
      html.urppp-theme-dark .table-box td,
      html.urppp-theme-dark .table-box th,
      body.urppp-dark .page-content table td,
      body.urppp-dark .page-content table th {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .page-content table thead th,
      html.urppp-theme-dark .page-content table thead td,
      html.urppp-theme-dark table.table-box thead th,
      html.urppp-theme-dark .table-box thead th {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      /* 表头：压过 ACE/Bootstrap 的 #f2f2f2 / .center / 内联浅色 */
      html.urppp-theme-dark .table > thead > tr > th,
      html.urppp-theme-dark .table-bordered > thead > tr > th,
      html.urppp-theme-dark .dataTable > thead > tr > th,
      html.urppp-theme-dark table.table > thead > tr > th,
      html.urppp-theme-dark table.table-striped > thead > tr > th,
      html.urppp-theme-dark table.table-bordered > thead > tr > th,
      html.urppp-theme-dark .table thead th,
      html.urppp-theme-dark .table thead td,
      html.urppp-theme-dark table thead th,
      html.urppp-theme-dark table thead td,
      html.urppp-theme-dark .table > thead > tr,
      html.urppp-theme-dark .table-bordered > thead > tr,
      html.urppp-theme-dark table > thead > tr.center,
      html.urppp-theme-dark table > thead > tr.center > th,
      html body.urppp-dark .table > thead > tr > th,
      html body.urppp-dark table thead th,
      html body.urppp-dark .table thead th {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        background-image: none !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .table > thead,
      html.urppp-theme-dark .table-bordered > thead,
      html.urppp-theme-dark table > thead {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        background-image: none !important;
      }
      html.urppp-theme-dark .table > tbody > tr > td:not(.green_background):not(.red_background),
      html.urppp-theme-dark .table > tbody > tr > th,
      html.urppp-theme-dark .table-bordered > tbody > tr > td:not(.green_background):not(.red_background),
      html.urppp-theme-dark .dataTable > tbody > tr > td:not(.green_background):not(.red_background),
      html.urppp-theme-dark .table > tfoot > tr > td {
        background: var(--surface) !important;
        background-color: var(--surface) !important;
        color: var(--text) !important;
        border-color: var(--border) !important;
      }
      html.urppp-theme-dark .table-striped > tbody > tr:nth-of-type(odd) > td:not(.green_background):not(.red_background),
      html.urppp-theme-dark .table-striped > tbody > tr:nth-of-type(odd) > th,
      html.urppp-theme-dark .dataTable > tbody > tr:nth-of-type(odd) > td:not(.green_background):not(.red_background) {
        background: color-mix(in srgb, var(--bg) 70%, var(--surface)) !important;
        background-color: color-mix(in srgb, var(--bg) 70%, var(--surface)) !important;
        color: var(--text) !important;
      }
      html.urppp-theme-dark .table-hover > tbody > tr:hover > td:not(.green_background):not(.red_background),
      html.urppp-theme-dark .dataTable > tbody > tr:hover > td:not(.green_background):not(.red_background) {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
      }
      /* ACE 离开悬停时常把 td 写回 #fff：暗色下强制清掉 */
      html.urppp-theme-dark .table-hover > tbody > tr:not(.urppp-notice-row).hover > td:not(.green_background):not(.red_background),
      html.urppp-theme-dark .table-hover > tbody > tr:not(.urppp-notice-row) > td:not(.green_background):not(.red_background) {
        background-color: var(--surface) !important;
      }
      html.urppp-theme-dark .table-striped > tbody > tr:nth-of-type(odd):not(.urppp-notice-row) > td:not(.green_background):not(.red_background) {
        background-color: color-mix(in srgb, var(--bg) 70%, var(--surface)) !important;
      }
      /* 暗色成绩语义色：必须写在上面 surface 规则之后 */
      html.urppp-theme-dark body .table > tbody > tr > td.green_background,
      html.urppp-theme-dark body .table-bordered > tbody > tr > td.green_background,
      html.urppp-theme-dark body .table-striped > tbody > tr > td.green_background,
      html.urppp-theme-dark body .table-hover > tbody > tr > td.green_background,
      html.urppp-theme-dark body .table-hover > tbody > tr:hover > td.green_background,
      html.urppp-theme-dark body .table-hover > tbody > tr.hover > td.green_background,
      html.urppp-theme-dark body .dataTable > tbody > tr > td.green_background,
      html.urppp-theme-dark body td.green_background,
      html.urppp-theme-dark body .green_background {
        background: rgba(34, 197, 94, 0.28) !important;
        background-color: rgba(34, 197, 94, 0.28) !important;
        color: #86efac !important;
      }
      html.urppp-theme-dark body .table > tbody > tr > td.red_background,
      html.urppp-theme-dark body .table-bordered > tbody > tr > td.red_background,
      html.urppp-theme-dark body .table-hover > tbody > tr > td.red_background,
      html.urppp-theme-dark body .table-hover > tbody > tr:hover > td.red_background,
      html.urppp-theme-dark body td.red_background,
      html.urppp-theme-dark body .red_background {
        background: rgba(239, 68, 68, 0.28) !important;
        background-color: rgba(239, 68, 68, 0.28) !important;
        color: #fca5a5 !important;
      }
`;var Si=`      /* 导航：顶栏、侧栏、面包屑（navigation） */
      /* 顶栏 —— 基于真实 DOM */
      .navbar.navbar-default,
      .navbar.navbar-default.navbar-fixed-top,
      .navbar-default {
        background: var(--surface) !important;
        border: none !important;
        box-shadow: var(--shadow) !important;
        min-height: 45px !important;
        z-index: 1100 !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
      }
      .navbar.navbar-default .navbar-brand,
      .navbar-default .navbar-brand {
        color: var(--text) !important;
        text-shadow: none !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 10px !important;
        height: 45px !important;
        line-height: 45px !important;
        vertical-align: middle !important;
      }
      .navbar-header {
        display: flex !important;
        align-items: center !important;
        min-height: 45px !important;
      }
      /* 顶栏主题色切换 */
      #urppp-nav-theme {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        margin-left: 12px !important;
        height: 100% !important;
        min-height: 36px !important;
        vertical-align: middle !important;
        position: relative !important;
        top: 0 !important;
        transform: none !important;
        z-index: 20 !important;
        line-height: 1 !important;
      }
      #urppp-nav-theme .urppp-nav-dot,
      #urppp-nav-theme button.urppp-nav-dot,
      #urppp-clean-root .uc-top-theme .urppp-nav-dot,
      #urppp-clean-root .uc-top-theme button.urppp-nav-dot {
        width: 16px !important;
        height: 16px !important;
        min-width: 16px !important;
        min-height: 16px !important;
        border-radius: 50% !important;
        border: 2px solid var(--border) !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
        padding: 0 !important;
        margin: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 16px !important;
        box-shadow: none !important;
        transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease !important;
        background-clip: padding-box !important;
        -webkit-appearance: none !important;
        appearance: none !important;
        vertical-align: middle !important;
        position: relative !important;
        top: 0 !important;
        line-height: 0 !important;
        font-size: 0 !important;
        overflow: hidden !important;
        text-indent: 0 !important;
      }
      /* 动态配色渐变点：避免被 .btn 全局规则压成胶囊/透明边 */
      #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],
      #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"] {
        border-radius: 50% !important;
        border: 2px solid var(--border) !important;
        background-size: cover !important;
        background-repeat: no-repeat !important;
      }
      #urppp-nav-theme .urppp-nav-dot:hover {
        transform: scale(1.08) !important;
        border-color: var(--text-muted) !important;
      }
      #urppp-nav-theme .urppp-nav-dot.ac {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
      #urppp-nav-theme .urppp-nav-settings {
        width: 22px !important;
        height: 22px !important;
        border-radius: var(--radius-sm) !important;
        border: none !important;
        background: transparent !important;
        color: var(--text-secondary) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        padding: 0 !important;
        margin: 0 0 0 4px !important;
        box-shadow: none !important;
        transition: color .15s ease, background .15s ease, transform .15s ease !important;
        vertical-align: middle !important;
      }
      #urppp-nav-theme .urppp-nav-settings:hover {
        color: var(--primary) !important;
        background: var(--ring) !important;
        transform: scale(1.05) !important;
      }
      #urppp-nav-theme .urppp-nav-settings:focus {
        outline: none !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
      #urppp-nav-theme .urppp-nav-settings svg {
        display: block !important;
        width: 14px !important;
        height: 14px !important;
      }


      /* 导航项 */
      .ace-nav { margin: 0 !important; }
      .ace-nav > li {
        text-align: left !important;
        vertical-align: middle !important;
        background: transparent !important;
        border: none !important;
      }
      .ace-nav > li > a {
        background: transparent !important;
        color: var(--text-secondary) !important;
        border-radius: var(--radius-sm) !important;
        padding: 7px 10px !important;
        line-height: 1.4 !important;
        height: auto !important;
        display: inline-flex !important;
        align-items: center;
        gap: 5px;
        white-space: nowrap !important;
        transition: background .15s;
      }
      .ace-nav > li > a:hover,
      .ace-nav > li.open > a {
        background: var(--input-bg) !important;
        color: var(--text) !important;
        box-shadow: none !important;
      }

      /* 覆盖 ACE 颜色类 */
      #navbar .ace-nav > li.green > a,
      #navbar .ace-nav > li.grey > a,
      #navbar .ace-nav > li.light-red > a,
      #navbar .ace-nav > li.light-blue > a,
      #navbar .ace-nav > li.green.open > a,
      #navbar .ace-nav > li.grey.open > a,
      #navbar .ace-nav > li.light-red.open > a,
      #navbar .ace-nav > li.light-blue.open > a {
        background: transparent !important;
        color: var(--text-secondary) !important;
      }
      #navbar .ace-nav > li.green > a:hover,
      #navbar .ace-nav > li.grey > a:hover,
      #navbar .ace-nav > li.light-red > a:hover,
      #navbar .ace-nav > li.light-blue > a:hover {
        background: var(--input-bg) !important;
        color: var(--text) !important;
      }

      /* 图标统一颜色 */
      #navbar .ace-nav > li > a > .ace-icon,
      #navbar .ace-nav > li > a > .glyphicon {
        color: var(--text-secondary) !important;
        font-size: 15px;
        transition: color .15s;
      }
      #navbar .ace-nav > li > a:hover > .ace-icon,
      #navbar .ace-nav > li > a:hover > .glyphicon,
      #navbar .ace-nav > li.open > a > .ace-icon,
      #navbar .ace-nav > li.open > a > .glyphicon { color: var(--text) !important; }

      /* 强制所有顶栏项对齐 */
      #navbar .ace-nav > li {
        display: inline-block !important;
        vertical-align: middle !important;
        text-align: left !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #navbar .ace-nav > li > a {
        display: inline-flex !important;
        align-items: center !important;
        height: 36px !important;
        padding: 0 4px !important;
        flex-wrap: nowrap !important;
        vertical-align: middle !important;
      }
      #navbar .ace-nav > li > a > .ace-icon,
      #navbar .ace-nav > li > a > .glyphicon,
      #navbar .ace-nav > li > a > .fa {
        top: auto !important;
        vertical-align: middle !important;
        line-height: 1 !important;
        margin-top: 0 !important;
      }

      /* 限制搜索容器宽度 */
      #navbar #intellegenceUDiv {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 32px !important;
        height: 36px !important;
        vertical-align: middle !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      /* 搜索按钮与帮助/客服项紧贴，去掉多余间距 */
      #navbar .ace-nav > li.urppp-search-item {
        margin: 0 !important;
        padding: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
      }
      #navbar .ace-nav > li.urppp-search-item + li,
      #navbar .ace-nav > li + li.urppp-search-item {
        margin-left: 0 !important;
      }
      #navbar #intellegenceUDiv #clickdiv {
        transform: none !important;
      }

      /* 用户项：头像和文字一行 */
      #navbar .ace-nav > li.light-blue > a {
        display: inline-flex !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        gap: 6px !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info {
        margin-top: -12px !important;
      }
      #navbar .ace-nav > li.light-blue > a .nav-user-photo {
        margin-right: 6px;
        vertical-align: middle !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info {
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px;
        max-width: none !important;
        white-space: nowrap !important;
        color: var(--text-secondary) !important;
        line-height: 1 !important;
        vertical-align: middle !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info * {
        display: inline !important;
        white-space: nowrap !important;
        color: inherit !important;
        vertical-align: middle !important;
        line-height: 1 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      #navbar .ace-nav > li.light-blue > a .user-info small { color: var(--text-muted) !important; font-size: inherit !important; }

      /* 头像：中间截取矩形再裁圆 */
      #navbar .ace-nav .nav-user-photo {
        width: 30px !important;
        height: 30px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        object-position: center center !important;
        border: 2px solid var(--border) !important;
        margin-right: 6px;
        flex-shrink: 0;
        vertical-align: middle !important;
      }

      /* 搜索按钮 #clickdiv */
      #clickdiv {
        background: transparent !important;
        color: var(--text-secondary) !important;
        position: relative !important;
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        width: 32px !important;
        height: 32px !important;
        border-radius: var(--radius-sm) !important;
        line-height: 1 !important;
        transition: background .15s;
        z-index: 30 !important;
      }
      #clickdiv:hover { background: var(--input-bg) !important; color: var(--text) !important; }
      #clickdiv #clicki,
      #clickdiv .fa-search {
        color: var(--text-secondary) !important;
        margin-top: 0 !important;
        transition: color .15s;
      }
      #clickdiv:hover #clicki,
      #clickdiv:hover .fa-search { color: var(--text) !important; }

      /* 搜索表单 —— 在按钮左侧紧邻展开，无背景卡片 */
      #form-search.nav-search {
        position: absolute !important;
        right: 40px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        margin: 0 !important;
        z-index: 10 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        overflow: visible !important;
        padding: 0 !important;
        transition: width .2s ease, opacity .2s ease;
      }
      #form-search.nav-search[style*="width: 0px"] {
        opacity: 0;
        pointer-events: none;
      }
      #form-search.nav-search .form-search,
      #form-search.nav-search .input-icon {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      #form-search.nav-search .nav-search-input,
      input#search-input.nav-search-input {
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        border-radius: var(--radius-sm) !important;
        height: 32px !important;
        padding: 0 12px !important;
        line-height: 32px !important;
      }
      #form-search.nav-search .nav-search-input:focus { border-color: var(--border-focus) !important; box-shadow: 0 0 0 3px var(--ring) !important; }
      #form-search.nav-search .ace-icon.fa-search { color: var(--text-secondary) !important; }
      #form-search.nav-search .nav-search-input:focus + .ace-icon.fa-search { color: var(--text) !important; }

      /* 桌面搜索：form-search 即原生弹出窗口（背景/圆角/阴影），结果列表内嵌 */
      #form-search.urppp-desktop-search {
        box-sizing: border-box !important;
        min-width: 0 !important;
        border: 0 solid transparent !important;
        border-radius: var(--radius-sm) !important;
      }
      #form-search.urppp-desktop-search .form-search,
      #form-search.urppp-desktop-search .input-icon {
        width: 100% !important;
        box-sizing: border-box !important;
      }
      #form-search.urppp-desktop-search .nav-search-input {
        outline: none !important;
        box-shadow: none !important;
      }
      /* 搜索 typeahead 结果框（桌面首页 navbar）：圆角卡片、分隔、选中态 */
      #form-search ul.typeahead.dropdown-menu {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        top: 100% !important;
        margin: 4px 0 0 !important;
        padding: 6px !important;
        list-style: none !important;
        background: var(--surface, #fff) !important;
        border: 1px solid var(--border, #e8eaed) !important;
        border-radius: var(--radius-sm, 8px) !important;
        box-shadow: var(--shadow, 0 8px 24px rgba(15, 23, 42, 0.12)) !important;
        z-index: 12045 !important;
        max-height: 280px !important;
        overflow-y: auto !important;
        width: auto !important;
        min-width: 100% !important;
      }
      #form-search ul.typeahead.dropdown-menu > li {
        padding: 0 !important;
        margin: 0 !important;
      }
      #form-search ul.typeahead.dropdown-menu > li > a {
        display: block !important;
        padding: 8px 10px !important;
        border-radius: 6px !important;
        color: var(--text, #1d1d1f) !important;
        font-size: 13px !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
      }
      #form-search ul.typeahead.dropdown-menu > li.active > a,
      #form-search ul.typeahead.dropdown-menu > li > a:hover {
        background: var(--input-bg, #f5f5f7) !important;
        color: var(--text, #1d1d1f) !important;
      }
      #form-search ul.typeahead.dropdown-menu > li > a strong {
        color: var(--primary, #b53434) !important;
        font-weight: 600 !important;
      }

      /* 用户下拉菜单 */
      .ace-nav > li.light-blue .dropdown-menu {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        box-shadow: var(--shadow) !important;
        border-radius: var(--radius-sm) !important;
      }
      .ace-nav > li.light-blue .dropdown-menu > li > a {
        color: var(--text-secondary) !important;
        background: transparent !important;
        border-radius: 0 !important;
      }
      .ace-nav > li.light-blue .dropdown-menu > li > a:hover {
        background: var(--input-bg) !important;
        color: var(--text) !important;
      }
      .ace-nav > li.light-blue .dropdown-menu .divider { background: var(--border) !important; }

      /* 侧边栏 —— Hanako 风格完全重构 */
      :root { --urppp-navbar-height: 45px; }
      /* 内容左边距只跟随侧栏状态，不跟随汉堡按钮 */
      .sidebar:not(.menu-min) {
        width: 260px !important;
        min-width: 260px !important;
        max-width: 260px !important;
      }
      .sidebar.menu-min,
      .sidebar.menu-min.display,
      body.menu-min .sidebar,
      body.menu-min .sidebar.display {
        width: 50px !important;
        min-width: 50px !important;
        max-width: 50px !important;
      }
      .sidebar:not(.menu-min) ~ .main-content { margin-left: 260px !important; }
      .sidebar.menu-min ~ .main-content,
      body.menu-min .main-content { margin-left: 50px !important; }
      .main-content {
        margin-top: var(--urppp-navbar-height) !important;
        transition: margin-left .25s ease !important;
      }
      /* 小屏：侧栏默认隐藏为覆盖层，内容贴左；展开侧栏也不挤占内容 */
      @media (max-width: 991px) {
        /* 顶栏元素向左聚拢（汉堡+主题点+设置+清爽 紧凑靠左） */
        #navbar .navbar-header{justify-content:flex-start !important;gap:8px !important;width:auto !important;}
        #navbar .navbar-header > *{flex:0 0 auto !important;}
        .sidebar:not(.display) ~ .main-content,
        .sidebar.menu-min:not(.display) ~ .main-content,
        .sidebar:not(.menu-min):not(.display) ~ .main-content,
        body.menu-min .main-content {
          margin-left: 0 !important;
        }
        .sidebar.display ~ .main-content {
          margin-left: 0 !important; /* 覆盖层模式，不推内容 */
        }
        /* 小屏点开汉堡：完整宽度抽屉 */
        .sidebar.display:not(.menu-min) {
          display: block !important;
          position: fixed !important;
          left: 0 !important;
          top: var(--urppp-navbar-height) !important;
          width: 260px !important;
          min-width: 260px !important;
          max-width: 260px !important;
          z-index: 1045 !important;
          height: calc(100vh - var(--urppp-navbar-height)) !important;
        }
        /* 小屏若处于 menu-min，保持 50px，不要被 .display 的 260 盖掉 */
        .sidebar.display.menu-min,
        body.menu-min .sidebar.display {
          display: block !important;
          position: fixed !important;
          left: 0 !important;
          top: var(--urppp-navbar-height) !important;
          width: 50px !important;
          min-width: 50px !important;
          max-width: 50px !important;
          z-index: 1045 !important;
          height: calc(100vh - var(--urppp-navbar-height)) !important;
        }
      }
      .navbar.navbar-default.navbar-fixed-top,
      .navbar-fixed-top,
      .navbar-fixed-bottom { left: 0 !important; right: 0 !important; }
      .sidebar {
        position: fixed !important; /* 固定定位上下文：sidebar-header 的 absolute 子元素不会溢出覆盖顶栏 */
        z-index: 1030 !important; /* 低于顶栏，避免盖住 navbar 底边 */
        top: var(--urppp-navbar-height) !important;
        height: calc(100vh - var(--urppp-navbar-height)) !important;
        margin-top: 0 !important;
        padding-top: 0 !important;
        background: var(--surface) !important;
        border-right: 1px solid var(--border) !important;
        border-top: none !important;
        /* 阴影只向右，不向上侵入顶栏 */
        box-shadow: 2px 0 10px rgba(15, 23, 42, 0.06) !important;
        overflow-x: hidden !important;
        transition: width .26s cubic-bezier(.4, 0, .2, 1), min-width .26s cubic-bezier(.4, 0, .2, 1), max-width .26s cubic-bezier(.4, 0, .2, 1) !important;
      }
      .sidebar:before { display: none !important; }
      .main-content { transition: margin-left .25s ease; }
      .sidebar .nav-wrap { padding: 0 !important; height: 100% !important; }
      .sidebar .nav-wrap > div { position: static !important; }
      .sidebar .ace-scroll.nav-scroll { display: none !important; }
      #menus { display: none !important; }
      .sidebar-collapse { display: none !important; }

      /* 侧边栏顶部 header */
      .urppp-sidebar-header {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        display: flex !important;
        align-items: center;
        justify-content: flex-end;
        padding: 14px 14px 12px;
        border-bottom: 1px solid var(--border);
        transition: padding .2s;
        z-index: 100 !important;
        background: var(--surface) !important;
      }
      #urppp-menus { margin-top: 50px !important; }
      .urppp-sidebar-toggle {
        width: 30px;
        height: 30px;
        border-radius: var(--radius-sm);
        background: var(--input-bg);
        border: 1px solid var(--border);
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 15px;
        transition: all .15s;
      }
      .urppp-sidebar-toggle:hover { background: var(--border); color: var(--text); }

      /* apple / flat：侧边栏菜单文字跟随主题黑/白，避免主题强调色（系统蓝）
         覆盖两套结构：原始 ACE 菜单（全局 a 规则染色）与重构版 urppp-nav-link
         （其非 important 灰色文字同样被全局 a !important 压成主题色） */
      html[data-urppp-skin="apple"] .sidebar .nav-list > li > a,
      html[data-urppp-skin="apple"] .sidebar .nav-list > li.active > a,
      html[data-urppp-skin="apple"] .sidebar .nav-list > li.open > a,
      html[data-urppp-skin="apple"] .sidebar .nav-list .submenu > li > a,
      html[data-urppp-skin="apple"] .sidebar .nav-list > li > a:hover,
      html[data-urppp-skin="apple"] .sidebar .nav-list > li.active > a:hover,
      html[data-urppp-skin="apple"] .urppp-nav-link,
      html[data-urppp-skin="apple"] .urppp-nav-link:hover,
      html[data-urppp-skin="apple"] .urppp-nav-item.active > .urppp-nav-link,
      html[data-urppp-skin="apple"] .urppp-nav-item.open.active > .urppp-nav-link,
      html[data-urppp-skin="flat"] .sidebar .nav-list > li > a,
      html[data-urppp-skin="flat"] .sidebar .nav-list > li.active > a,
      html[data-urppp-skin="flat"] .sidebar .nav-list > li.open > a,
      html[data-urppp-skin="flat"] .sidebar .nav-list .submenu > li > a,
      html[data-urppp-skin="flat"] .sidebar .nav-list > li > a:hover,
      html[data-urppp-skin="flat"] .sidebar .nav-list > li.active > a:hover,
      html[data-urppp-skin="flat"] .urppp-nav-link,
      html[data-urppp-skin="flat"] .urppp-nav-link:hover,
      html[data-urppp-skin="flat"] .urppp-nav-item.active > .urppp-nav-link,
      html[data-urppp-skin="flat"] .urppp-nav-item.open.active > .urppp-nav-link {
        color: var(--text) !important;
      }

      /* 小屏汉堡按钮：贴合主题，不再用 ACE 默认灰/蓝 */
      /* 桌面隐藏汉堡；仅小屏显示（不要全局 display:flex 常驻） */
      @media (min-width: 992px) {
        #menu-toggler,
        .navbar-toggle.menu-toggler,
        button.navbar-toggle.menu-toggler,
        .navbar .menu-toggler {
          display: none !important;
        }
      }
      @media (max-width: 991px) {
        #menu-toggler,
        .navbar-toggle.menu-toggler,
        button.navbar-toggle.menu-toggler,
        .navbar .menu-toggler {
          background: var(--input-bg) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px !important;
          box-shadow: none !important;
          padding: 8px 10px !important;
          margin: 6px 8px !important;
          min-width: 40px !important;
          min-height: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-direction: column !important;
          gap: 4px !important;
        }
      }
      #menu-toggler:hover,
      .navbar-toggle.menu-toggler:hover,
      button.navbar-toggle.menu-toggler:hover {
        background: color-mix(in srgb, var(--primary) 12%, var(--surface)) !important;
        border-color: var(--primary) !important;
      }
      #menu-toggler:focus,
      .navbar-toggle.menu-toggler:focus,
      #menu-toggler:active,
      .navbar-toggle.menu-toggler:active {
        outline: none !important;
        background: color-mix(in srgb, var(--primary) 16%, var(--surface)) !important;
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
      }
      #menu-toggler .icon-bar,
      .navbar-toggle.menu-toggler .icon-bar,
      .menu-toggler .icon-bar {
        display: block !important;
        width: 18px !important;
        height: 2px !important;
        margin: 0 !important;
        background: var(--text) !important;
        border-radius: 2px !important;
        opacity: 1 !important;
        box-shadow: none !important;
      }
      #menu-toggler:hover .icon-bar,
      .navbar-toggle.menu-toggler:hover .icon-bar {
        background: var(--primary) !important;
      }
      /* ACE 有时用伪元素画三条线 */
      #menu-toggler:before,
      #menu-toggler:after,
      .menu-toggler:before,
      .menu-toggler:after {
        background: var(--text) !important;
        border-color: var(--text) !important;
      }

      /* 新菜单 */
      #urppp-menus {
        list-style: none;
        margin: 50px 0 0 0;
        padding: 10px 12px 24px;
        overflow-y: auto;
        max-height: calc(100vh - 64px);
      }
      #urppp-menus::-webkit-scrollbar { width: 4px; }
      #urppp-menus::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

      .urppp-nav-item { margin: 4px 0; }
      .urppp-nav-link {
        display: flex;
        align-items: center;
        padding: 11px 13px;
        border-radius: var(--radius-sm);
        color: var(--text-secondary);
        transition: background .15s, color .15s;
        text-decoration: none;
        position: relative;
      }
      .urppp-nav-link { cursor: default !important; text-decoration: none !important; }
      .urppp-nav-link .urppp-nav-text { cursor: pointer; }
      .urppp-nav-link .fa, .urppp-nav-link .ace-icon { pointer-events: none !important; cursor: default !important; }
      .urppp-nav-link:hover { background: var(--input-bg); color: var(--text); }
      .urppp-nav-link:hover .urppp-nav-text { text-decoration: underline; }
      .urppp-nav-item.active > .urppp-nav-link,
      .urppp-nav-item.open.active > .urppp-nav-link {
        background: var(--input-bg);
        color: var(--text);
        font-weight: 600;
      }
      .urppp-nav-link > .fa {
        width: 22px;
        text-align: center;
        margin-right: 11px;
        font-size: 18px;
        color: inherit;
        flex-shrink: 0;
        transition: margin .25s ease;
      }
      .urppp-nav-text {
        display: block;
        flex: 1;
        width: auto;
        font-size: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        opacity: 1;
        max-width: 200px;
        transition: opacity .2s ease, max-width .26s cubic-bezier(.4, 0, .2, 1), margin .26s cubic-bezier(.4, 0, .2, 1);
      }
      .urppp-nav-arrow {
        display: block;
        width: auto;
        font-size: 13px;
        color: var(--text-muted);
        margin-left: 8px;
        opacity: 1;
        max-width: 20px;
        overflow: hidden;
        transition: transform .2s, opacity .2s ease, max-width .26s cubic-bezier(.4, 0, .2, 1), margin .26s cubic-bezier(.4, 0, .2, 1);
        flex-shrink: 0;
      }
      .urppp-nav-item.open > .urppp-nav-link .urppp-nav-arrow { transform: rotate(180deg); }

      .urppp-nav-submenu {
        list-style: none;
        margin: 0;
        padding: 0 0 0 20px;
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        transition: max-height .3s cubic-bezier(.4,0,.2,1), opacity .25s ease, padding .3s ease;
      }
      .urppp-nav-item.open > .urppp-nav-submenu {
        max-height: 800px;
        opacity: 1;
        padding: 3px 0 3px 20px;
      }
      .urppp-nav-submenu .urppp-nav-link { padding: 9px 13px; font-size: 14px; }
      .urppp-nav-submenu .urppp-nav-submenu { padding-left: 16px; }

      /* 折叠状态 */
      .sidebar.menu-min .urppp-sidebar-header,
      body.menu-min .sidebar .urppp-sidebar-header { justify-content: center; padding: 14px 0 12px; }
      .sidebar.menu-min #urppp-menus,
      body.menu-min .sidebar #urppp-menus { padding: 10px 6px 24px; }
      .sidebar.menu-min .urppp-nav-link,
      body.menu-min .sidebar .urppp-nav-link { padding: 12px 0; justify-content: center; }
      .sidebar.menu-min .urppp-nav-text,
      .sidebar.menu-min .urppp-nav-arrow,
      body.menu-min .sidebar .urppp-nav-text,
      body.menu-min .sidebar .urppp-nav-arrow {
        opacity: 0 !important;
        max-width: 0 !important;
        width: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        overflow: hidden !important;
        pointer-events: none !important;
      }
      .urppp-nav-link > .fa {
        transition: margin-right .26s cubic-bezier(.4, 0, .2, 1), font-size .26s cubic-bezier(.4, 0, .2, 1);
      }
      .sidebar.menu-min .urppp-nav-link > .fa,
      body.menu-min .sidebar .urppp-nav-link > .fa { margin-right: 0; font-size: 18px; }
      .sidebar.menu-min .urppp-nav-submenu,
      body.menu-min .sidebar .urppp-nav-submenu { max-height: 0 !important; opacity: 0 !important; display: none !important; }

      /* 面包屑：胶囊路径条，加大字号，与顶栏/侧栏留白 */
      .breadcrumbs, #breadcrumbs {
        display: flex !important;
        align-items: center !important;
        background: transparent !important;
        border: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
        padding: 16px 64px 12px !important;
        min-height: 0 !important;
        line-height: 1.4 !important;
        position: relative !important;
        top: auto !important;
        left: auto !important;
        right: auto !important;
        z-index: 1 !important;
        margin: 0 !important;
      }
      .breadcrumbs.breadcrumbs-fixed {
        position: relative !important;
        top: auto !important;
        left: auto !important;
        right: auto !important;
      }
      .main-content { padding-top: 0 !important; }
      body.breadcrumbs-fixed .main-content { padding-top: 0 !important; }
      .breadcrumb {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius) !important;
        margin: 0 !important;
        padding: 10px 16px !important;
        display: inline-flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        gap: 2px !important;
        font-size: 16px !important;
        list-style: none !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03) !important;
        width: auto !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
      }
      .breadcrumb > li {
        color: var(--text-secondary) !important;
        display: inline-flex !important;
        align-items: center !important;
        float: none !important;
        padding: 0 !important;
        text-shadow: none !important;
        font-size: 16px !important;
        line-height: 1.35 !important;
      }
      .breadcrumb > li + li:before {
        content: '' !important;
        display: inline-block !important;
        width: 6px !important;
        height: 6px !important;
        margin: 0 10px !important;
        border-right: 1.5px solid var(--text-muted) !important;
        border-top: 1.5px solid var(--text-muted) !important;
        transform: rotate(45deg) !important;
        opacity: 0.7 !important;
        padding: 0 !important;
        float: none !important;
        font-size: 0 !important;
      }
      .breadcrumb > li > a,
      .breadcrumb > li > span,
      .breadcrumb > li .urppp-bc-label {
        color: inherit !important;
        text-decoration: none !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 7px !important;
        font-size: 16px !important;
        padding: 4px 10px !important;
        border-radius: var(--radius-sm) !important;
        transition: background .15s, color .15s !important;
      }
      .breadcrumb > li > a:hover,
      .breadcrumb > li:not(.active):not(:last-child) .urppp-bc-label:hover {
        color: var(--primary) !important;
        background: var(--input-bg) !important;
      }
      .breadcrumb > li.active,
      .breadcrumb > li:last-child {
        color: var(--primary) !important;
        font-weight: 600 !important;
        font-size: 16px !important;
      }
      .breadcrumb > li.active > span,
      .breadcrumb > li.active .urppp-bc-label,
      .breadcrumb > li:last-child > span,
      .breadcrumb > li:last-child .urppp-bc-label {
        background: var(--ring) !important;
        color: var(--primary) !important;
        font-weight: 600 !important;
      }
      .breadcrumb .home-icon,
      .breadcrumb .fa-home {
        color: var(--primary) !important;
        margin-right: 0 !important;
        font-size: 16px !important;
      }
      .breadcrumb > li.hide-item { display: none !important; }


      /* 简约白 / 深邃暗：导航与面包屑主文案 */
      /* 侧栏默认项：简约白更深、深邃暗更亮 */
      html.urppp-theme-default .urppp-nav-link {
        color: #111111 !important;
      }
      html.urppp-theme-dark .urppp-nav-link {
        color: #f5f5f5 !important;
      }
      html.urppp-theme-default .urppp-nav-link:hover,
      html.urppp-theme-dark .urppp-nav-link:hover {
        color: var(--text) !important;
      }
`;var _i=`/* ===== 插件弹窗统一进入动画：淡入+缩放 + 内容逐条浮现 ===== */
#urppp-clean-root .uc-modal,
#urppp-settings-panel,
#urppp-update-changelog{opacity:0;transform:scale(.95)}
#urppp-clean-root .uc-modal.open,
#urppp-settings-panel.open,
#urppp-update-changelog.open{opacity:1;transform:scale(1);transition:opacity .24s cubic-bezier(.16,1,.3,1),transform .26s cubic-bezier(.16,1,.3,1)}
#urppp-clean-root .uc-modal.open>*,
#urppp-settings-panel.open>*,
#urppp-update-changelog.open>*{opacity:0;transform:translateY(10px);animation:ucPopStag .3s cubic-bezier(.16,1,.3,1) forwards}
#urppp-clean-root .uc-modal.open>*:nth-child(1),#urppp-settings-panel.open>*:nth-child(1),#urppp-update-changelog.open>*:nth-child(1){animation-delay:.05s}
#urppp-clean-root .uc-modal.open>*:nth-child(2),#urppp-settings-panel.open>*:nth-child(2),#urppp-update-changelog.open>*:nth-child(2){animation-delay:.12s}
#urppp-clean-root .uc-modal.open>*:nth-child(3),#urppp-settings-panel.open>*:nth-child(3),#urppp-update-changelog.open>*:nth-child(3){animation-delay:.19s}
@keyframes ucPopStag{to{opacity:1;transform:translateY(0)}}
/* 弹窗退出动画（与进入对称） */
#urppp-clean-root .uc-modal.closing,#urppp-settings-panel.closing,#urppp-update-changelog.closing{opacity:0;transform:scale(.94);transition:opacity .18s ease,transform .18s ease}
/* 更新 toast：淡入上滑 */
#urppp-update-toast{opacity:0;transform:translateY(14px)}
#urppp-update-toast.open{opacity:1;transform:translateY(0);transition:opacity .24s cubic-bezier(.16,1,.3,1),transform .26s cubic-bezier(.16,1,.3,1)}
/* 尊重 reduced-motion */
@media (prefers-reduced-motion:reduce){
  #urppp-clean-root .uc-modal,#urppp-settings-panel,#urppp-update-changelog,#urppp-update-toast,#urppp-clean-root,#urppp-cal-modal .cal-dialog{transition:none!important;animation:none!important;opacity:1!important;transform:none!important}
  #urppp-clean-root .uc-modal.open>*,#urppp-settings-panel.open>*,#urppp-update-changelog.open>*,#urppp-cal-modal.open .cal-modal-wrap>*,#urppp-clean-root.open .uc-card,#urppp-clean-root.open .uc-top{opacity:1!important;transform:none!important;animation:none!important}
}
#urppp-clean-root{position:fixed;inset:0;z-index:12000;display:none;flex-direction:column;background:var(--bg,#F4F6F9);color:var(--text,#111);font-family:inherit;clip-path:inset(0 0 100% 0);opacity:.6;transform:translateY(10px)}
#urppp-clean-root.open{display:flex;clip-path:inset(0 0 0 0);opacity:1;transform:none;animation:cleanExpand .38s cubic-bezier(.22,1,.36,1) forwards;will-change:clip-path,opacity}
@keyframes cleanExpand{from{clip-path:inset(0 0 100% 0);opacity:.6;transform:translateY(10px)}to{clip-path:inset(0 0 0 0);opacity:1;transform:none}}
/* 清爽模式退出：矩形收回 + 淡出。closing 保持 display:flex，动画总播 */
#urppp-clean-root.closing{display:flex;clip-path:inset(0 0 100% 0);opacity:0;transform:translateY(10px);animation:cleanCollapse .3s cubic-bezier(.4,0,.2,1) forwards;will-change:clip-path,opacity}
@keyframes cleanCollapse{from{clip-path:inset(0 0 0 0);opacity:1}to{clip-path:inset(0 0 100% 0);opacity:0}}
#urppp-clean-root *{box-sizing:border-box}
#urppp-clean-root .uc-brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:18px}
#urppp-clean-root .uc-top-actions{display:flex;gap:8px}
#urppp-clean-root .uc-btn{height:32px;padding:0 12px;border-radius:10px;border:1px solid var(--border);background:var(--input-bg,#f7f7f8);color:var(--text);font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:transform .18s ease,box-shadow .18s ease,background .18s ease,border-color .18s ease,color .18s ease}
#urppp-clean-root .uc-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.06)}
#urppp-clean-root .uc-btn:active{transform:translateY(0) scale(.98);box-shadow:none}
#urppp-clean-root .uc-btn.primary{background:var(--primary);border-color:var(--primary);color:#fff}
#urppp-clean-root .uc-shell{flex:1;min-height:0;overflow:auto;padding:20px 28px 28px;display:flex;align-items:center;justify-content:center}
#urppp-clean-root .uc-shell-inner{max-width:1520px;margin:0 auto;width:100%;max-height:100%;overflow:auto}
#urppp-clean-root .uc-desktop{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr;gap:16px;min-height:640px}
#urppp-clean-root .uc-col{display:flex;flex-direction:column;gap:16px;min-height:0}
#urppp-clean-root .uc-card{background:var(--surface,#fff);border:1px solid var(--border,#e7e7ea);border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.04);opacity:0;transform:translateY(14px) scale(.985);animation:ucCardIn .36s cubic-bezier(.22,1,.36,1) forwards;transition:box-shadow .22s ease,transform .22s ease,border-color .22s ease;will-change:transform,opacity}
#urppp-clean-root .uc-card:hover{box-shadow:0 8px 24px rgba(0,0,0,.06),0 0 0 1px color-mix(in srgb,var(--primary) 8%,var(--border))}
#urppp-clean-root .uc-desktop > .uc-col:first-child > .uc-card:nth-child(1){animation-delay:.05s}
#urppp-clean-root .uc-desktop > .uc-col:first-child > .uc-card:nth-child(2){animation-delay:.12s}
#urppp-clean-root .uc-desktop > .uc-col:last-child > .uc-card:nth-child(1){animation-delay:.09s}
#urppp-clean-root .uc-desktop > .uc-col:last-child > .uc-card:nth-child(2){animation-delay:.16s}
#urppp-clean-root .uc-mobile > .uc-card{animation-delay:.05s}
#urppp-clean-root .uc-mobile > .uc-card:nth-child(2){animation-delay:.12s}
#urppp-clean-root .uc-mobile > .uc-card:nth-child(3){animation-delay:.19s}
#urppp-clean-root .uc-card.grow{flex:0 0 auto;min-height:0;display:flex;flex-direction:column}
#urppp-clean-root .uc-hd{padding:12px 14px;border-bottom:1px solid var(--border);font-weight:700;font-size:16px;display:flex;justify-content:space-between;align-items:center}
#urppp-clean-root .uc-bd{padding:14px}
#urppp-clean-root .uc-card.grow .uc-bd{flex:1;overflow:auto}
#urppp-clean-root .uc-profile{display:flex;gap:14px;align-items:center}
#urppp-clean-root .uc-avatar{width:auto;height:72px;max-width:96px;min-width:56px;border-radius:12px;background:var(--input-bg);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:var(--primary);flex:0 0 auto}
#urppp-clean-root .uc-avatar img{height:72px;width:auto;max-width:96px;object-fit:contain;display:block;border-radius:12px}
#urppp-clean-root .uc-name{font-size:18px;font-weight:700;margin:0 0 4px}
#urppp-clean-root .uc-sub{font-size:12px;color:var(--text-secondary,#667085);line-height:1.5}
#urppp-clean-root .uc-gpa{margin-top:6px;display:inline-flex;padding:4px 10px;border-radius:999px;background:color-mix(in srgb,var(--primary) 12%,var(--input-bg));font-weight:700;font-size:13px}
#urppp-clean-root .uc-schedule-wrap{position:relative}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:30;background:color-mix(in srgb,var(--surface) 72%,var(--bg-card));backdrop-filter:blur(3px)}
#urppp-clean-root .uc-schedule-wrap .uc-mask-ico{width:52px;height:52px;color:var(--primary);line-height:0}
#urppp-clean-root .uc-schedule-wrap .uc-mask-ico svg{width:100%;height:100%}
#urppp-clean-root .uc-schedule-wrap .uc-mask-txt{text-align:center}
#urppp-clean-root .uc-schedule-wrap .uc-mask-txt b{display:block;font-size:18px;font-weight:750;color:var(--text)}
#urppp-clean-root .uc-schedule-wrap .uc-mask-txt i{display:block;font-style:normal;font-size:12px;color:var(--text-secondary);margin-top:4px}
/* 春节彩蛋：遮罩红色调 + 四角装饰 + 倒福 */
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival{background-image:linear-gradient(rgba(183,28,28,.05),rgba(183,28,28,.05));min-height:380px}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival .uc-mask-ico{width:72px;height:72px}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival .uc-mask-txt b{color:#b71c1c;font-size:22px}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival .uc-mask-ico{width:72px;height:72px}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask .uc-mask-ico svg{width:100%;height:100%}
/* 春节对联：横批顶部居中 + 左右竖联（红底金字） */
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival .uc-mask-scroll{position:absolute;top:20px;left:50%;transform:translateX(-50%);background:#b71c1c;color:#ffd54f;font-family:Noto Serif SC,STKaiti,serif;font-weight:700;font-size:15px;letter-spacing:8px;padding:7px 26px;border-radius:4px;border:2px solid #f5b301;box-shadow:0 3px 10px rgba(183,28,28,.15);white-space:nowrap}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival .uc-mask-cl{position:absolute;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;white-space:nowrap;background:#b71c1c;color:#ffd54f;font-family:Noto Serif SC,STKaiti,serif;font-size:13px;line-height:1.6;letter-spacing:1px;padding:16px 11px;border-radius:6px;border:2px solid #f5b301;box-shadow:0 3px 12px rgba(183,28,28,.12);max-height:none}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival .uc-mask-cl-r{right:2.5%}
#urppp-clean-root .uc-schedule-wrap .uc-schedule-mask.uc-mask-springfestival .uc-mask-cl-l{left:2.5%}
/* 全局春节挂饰：顶部两侧垂挂小灯笼，pointer-events 穿透，不影响阅读与操作 */
#urppp-festive-decor{position:fixed;inset:0;pointer-events:none;z-index:60}
#urppp-festive-decor .ufd{position:absolute;top:0}
#urppp-festive-decor .ufd-left{left:0}
#urppp-festive-decor .ufd-right{right:0}
#urppp-festive-decor .ufd svg{display:block;width:52px;height:auto;filter:drop-shadow(0 2px 5px rgba(200,16,46,.18))}
#urppp-festive-decor .ufd-right svg{transform:scaleX(-1)}
#urppp-clean-root .uc-week{min-width:720px}
#urppp-clean-root .uc-week-head{display:grid;grid-template-columns:36px repeat(7,minmax(0,1fr));gap:6px;margin-bottom:6px}
#urppp-clean-root .uc-week-head .h{font-size:11px;text-align:center;color:var(--text-secondary)}
#urppp-clean-root .uc-week-body{display:grid;grid-template-columns:36px repeat(7,minmax(0,1fr));gap:6px;align-items:start}
#urppp-clean-root .uc-sec-col .s{height:56px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--text-muted,#98a2b3)}
#urppp-clean-root .uc-day-col{position:relative;height:calc(56px * 12);background:transparent}
#urppp-clean-root .uc-grid-cell{position:absolute;left:0;right:0;height:52px;border-radius:10px;background:var(--input-bg);border:1px solid color-mix(in srgb,var(--border) 65%,transparent)}
#urppp-clean-root .uc-day-col .uc-grid-cell{width:100%}
#urppp-clean-root .uc-lesson{position:absolute;left:0;right:0;z-index:2;border:1px solid color-mix(in srgb,var(--primary) 24%,var(--border));border-radius:10px;padding:6px 7px 16px;cursor:pointer;overflow:hidden;box-sizing:border-box;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease;will-change:transform}
#urppp-clean-root .uc-lesson:hover{transform:translateY(-1px) scale(1.01);box-shadow:0 6px 16px rgba(0,0,0,.08);z-index:12!important}
#urppp-clean-root .uc-lesson:active{transform:scale(.99)}
#urppp-clean-root .uc-lesson.is-fade{filter:saturate(.4);z-index:2!important}
#urppp-clean-root .uc-lesson:not(.is-fade){z-index:8}
#urppp-clean-root .uc-lesson b{display:block;font-size:12px;line-height:1.25;font-weight:700}
#urppp-clean-root .uc-lesson i{display:block;font-style:normal;font-size:10px;color:var(--text-secondary);margin-top:3px}
#urppp-clean-root .uc-course-detail{position:relative;padding:4px 2px 8px}
#urppp-clean-root .uc-course-detail .uc-cd-name{font-size:16px;font-weight:700;line-height:1.35;margin:0 0 8px;color:var(--text)}
#urppp-clean-root .uc-course-detail .uc-cd-meta{font-size:13px;color:var(--text-secondary);line-height:1.55;margin:0 0 6px}
#urppp-clean-root .uc-course-detail .uc-cd-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:var(--input-bg);border:1px solid var(--border);font-size:12px;color:var(--text-secondary);margin-top:4px}
#urppp-clean-root .uc-course-sub{margin-top:10px;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--input-bg)}
#urppp-clean-root .uc-course-sub .uc-cd-name{font-size:14px;margin-bottom:4px}
#urppp-clean-root .uc-course-sub.is-fade{opacity:.72}
#urppp-clean-root .uc-week-nav{display:inline-flex;align-items:center;gap:6px}
#urppp-clean-root .uc-week-nav .uc-btn{height:28px;padding:0 10px;font-size:12px}
#urppp-clean-root .uc-week-nav .uc-week-label{min-width:64px;text-align:center;font-size:13px;font-weight:700;color:var(--text)}
#urppp-clean-root .uc-week-nav .uc-week-cur{font-size:11px;color:var(--text-muted);font-weight:500}
#urppp-clean-root .uc-badge{position:absolute;right:5px;bottom:4px;min-width:16px;height:16px;padding:0 4px;border-radius:999px;background:var(--primary);color:#fff;font-size:10px;line-height:16px;text-align:center;font-weight:700}
#urppp-clean-root .uc-part-line{position:absolute;left:0;right:0;height:0;border-top:2px dashed color-mix(in srgb,var(--primary) 35%,var(--border));z-index:1;pointer-events:none;opacity:.9}
#urppp-clean-root .uc-score-cell{display:inline-flex;align-items:center;justify-content:center;min-width:52px;padding:3px 8px;border-radius:8px;font-weight:700;line-height:1.3}
#urppp-clean-root .uc-score-cell.pass{background:rgba(34,197,94,.18);color:#15803d}
#urppp-clean-root .uc-score-cell.fail{background:rgba(239,68,68,.16);color:#b91c1c}
#urppp-clean-root .uc-score-cell.uneval{background:rgba(59,130,246,.18);color:#1d4ed8;cursor:pointer;text-decoration:none}
#urppp-clean-root .uc-score-cell.uneval-fail{background:rgba(249,115,22,.18);color:#c2410c;cursor:pointer}
#urppp-clean-root .uc-score-cell.uneval:hover,#urppp-clean-root .uc-score-cell.uneval-fail:hover{filter:brightness(1.05);box-shadow:0 0 0 1px color-mix(in srgb,currentColor 35%,transparent)}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.pass,body.urppp-dark #urppp-clean-root .uc-score-cell.pass{background:rgba(34,197,94,.28);color:#86efac}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.fail,body.urppp-dark #urppp-clean-root .uc-score-cell.fail{background:rgba(239,68,68,.28);color:#fca5a5}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.uneval,body.urppp-dark #urppp-clean-root .uc-score-cell.uneval{background:rgba(59,130,246,.28);color:#93c5fd}
html.urppp-theme-dark #urppp-clean-root .uc-score-cell.uneval-fail,body.urppp-dark #urppp-clean-root .uc-score-cell.uneval-fail{background:rgba(249,115,22,.28);color:#fdba74}
#urppp-clean-root .uc-selmark{position:absolute;left:6px;top:50%;transform:translateY(-50%);width:14px;height:14px;line-height:14px;text-align:center;font-size:12px;font-weight:700;color:var(--primary);opacity:0}
#urppp-clean-root table.uc-table tbody tr.is-on .uc-selmark{opacity:1}
#urppp-clean-root .uc-calc{font-size:16px;font-weight:600;color:var(--text);line-height:1.55}
#urppp-clean-root .uc-calc b{font-size:18px;font-weight:800;color:var(--primary);margin:0 2px}
#urppp-clean-root .uc-slot.kind-course{background:#7be0f6;border-color:#4ec8e0;color:#0b3b4a}
#urppp-clean-root .uc-slot.kind-exam{background:#fbb9e1;border-color:#f472b6;color:#831843}
#urppp-clean-root .uc-slot.kind-lab{background:#f5f67b;border-color:#eab308;color:#713f12}
#urppp-clean-root .uc-slot.kind-borrow{background:#90feaa;border-color:#4ade80;color:#14532d}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-course,body.urppp-dark #urppp-clean-root .uc-slot.kind-course{background:#2dd4bf;border-color:#14b8a6;color:#042f2e}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-exam,body.urppp-dark #urppp-clean-root .uc-slot.kind-exam{background:#f472b6;border-color:#db2777;color:#4c0519}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-lab,body.urppp-dark #urppp-clean-root .uc-slot.kind-lab{background:#facc15;border-color:#eab308;color:#422006}
html.urppp-theme-dark #urppp-clean-root .uc-slot.kind-borrow,body.urppp-dark #urppp-clean-root .uc-slot.kind-borrow{background:#4ade80;border-color:#22c55e;color:#052e16}
#urppp-clean-root .uc-modal-stack-hint{font-size:12px;color:var(--text-muted)}

#urppp-clean-root .uc-top-theme{display:inline-flex;align-items:center;gap:8px;margin-left:12px}
#urppp-clean-root .uc-top-theme .urppp-nav-dot{width:18px;height:18px;border-radius:50%;border:2px solid var(--border);padding:0;cursor:pointer}
#urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary);box-shadow:0 0 0 3px var(--ring)}
#urppp-clean-root .uc-top-theme .urppp-nav-settings{width:26px;height:26px;border:0;background:transparent;color:var(--text-secondary);cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
#urppp-clean-root .uc-top-theme .urppp-nav-settings svg{width:16px;height:16px}
#urppp-clean-root .uc-top-left{display:flex;align-items:center;gap:10px}
#urppp-clean-root .uc-menu-toggle{width:34px;height:34px;border:0;background:transparent;color:var(--text);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;transition:background .15s ease}
#urppp-clean-root .uc-menu-toggle:hover{background:var(--input-bg,#f7f7f8)}
#urppp-clean-root .uc-menu-toggle .urppp-menu-icon,
#urppp-clean-root .uc-menu-toggle .urppp-menu-icon svg{display:block;width:18px;height:18px}
#urppp-clean-root .uc-menu-toggle .urppp-menu-icon svg{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
#urppp-clean-root .uc-menu-toggle .urppp-menu-icon svg.urppp-menu-icon-close{display:none}
#urppp-clean-root .uc-menu-toggle[aria-expanded="true"] .urppp-menu-icon svg.urppp-menu-icon-open{display:none}
#urppp-clean-root .uc-menu-toggle[aria-expanded="true"] .urppp-menu-icon svg.urppp-menu-icon-close{display:block}
/* 清爽模式下复用站点侧边栏抽屉：固定左侧 260px 滑出，z-index 在清爽模式之上 */
#sidebar.urppp-clean-sidebar{
  position: fixed !important;
  top: 60px !important;
  left: 0 !important;
  bottom: 0 !important;
  width: 260px !important;
  min-width: 260px !important;
  max-width: 260px !important;
  height: calc(100vh - 60px) !important;
  z-index: 12030 !important;
  transform: translate3d(-100%, 0, 0) !important;
  visibility: hidden !important;
  pointer-events: none !important;
  transition: transform .26s cubic-bezier(.4, 0, .2, 1), visibility 0s linear .26s !important;
  margin: 0 !important;
  box-shadow: 8px 0 28px rgba(15,23,42,.14) !important;
}
#sidebar.urppp-clean-sidebar.display{
  transform: translate3d(0, 0, 0) !important;
  visibility: visible !important;
  pointer-events: auto !important;
  transition: transform .26s cubic-bezier(.4, 0, .2, 1), visibility 0s linear 0s !important;
}
/* 清爽模式下侧边栏套用移动端抽屉菜单样式（桌面端同样生效，点菜单项直接跳转无需先退出） */
#sidebar.urppp-clean-sidebar .urppp-sidebar-header{display:none !important}
#sidebar.urppp-clean-sidebar .sidebar-collapse{display:none !important}
#sidebar.urppp-clean-sidebar #menus{display:none !important}
#sidebar.urppp-clean-sidebar #urppp-menus{margin-top:0 !important;padding:10px 12px 24px !important}
#sidebar.urppp-clean-sidebar .urppp-nav-link{padding:11px 13px !important;justify-content:flex-start !important}
#sidebar.urppp-clean-sidebar .urppp-nav-text,
#sidebar.urppp-clean-sidebar .urppp-nav-arrow{display:block !important;width:auto !important;max-width:200px !important;margin-left:0 !important;opacity:1 !important;overflow:hidden !important;pointer-events:auto !important}
#sidebar.urppp-clean-sidebar .urppp-nav-link > .fa{margin-right:11px !important}
#sidebar.urppp-clean-sidebar .urppp-nav-submenu{display:block !important}
/* 清爽模式侧边栏：移动端用户卡与快捷区（桌面清爽模式同样渲染，样式随作用域生效） */
#sidebar.urppp-clean-sidebar #urppp-mobile-user{margin-top:0 !important;padding:12px !important;border-bottom:1px solid var(--border,#e8eaed) !important;background:var(--surface,#fff) !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .urppp-mobile-user-identity{display:flex !important;align-items:center !important;gap:10px !important;min-height:38px !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .nav-user-photo{width:38px !important;height:38px !important;min-width:38px !important;max-width:38px !important;min-height:38px !important;max-height:38px !important;display:block !important;margin:0 !important;padding:0 !important;border-radius:50% !important;border:1px solid var(--border,#e8eaed) !important;object-fit:cover !important;object-position:center !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .urppp-mobile-user-copy{display:flex !important;min-width:0 !important;flex-direction:column !important;justify-content:center !important;gap:1px !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .urppp-mobile-user-welcome{display:block !important;color:var(--text-secondary,#6b7280) !important;font-size:11px !important;font-weight:400 !important;line-height:1.2 !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .user-info{display:block !important;position:relative !important;top:-1px !important;min-width:0 !important;color:var(--text,#1d1d1f) !important;font-size:16px !important;font-weight:600 !important;line-height:1.35 !important;white-space:normal !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .urppp-mobile-user-actions{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:6px !important;margin-top:10px !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .urppp-mobile-user-action{display:flex !important;align-items:center !important;justify-content:flex-start !important;gap:7px !important;min-width:0 !important;min-height:34px !important;padding:7px 9px !important;border-radius:var(--radius-sm,8px) !important;border:1px solid var(--border,#e8eaed) !important;background:var(--input-bg,#f5f5f7) !important;color:var(--text,#1d1d1f) !important;font-size:12px !important;line-height:1.2 !important;text-decoration:none !important}
#sidebar.urppp-clean-sidebar #urppp-mobile-user .urppp-mobile-user-action i{width:14px !important;color:var(--primary,#b53434) !important;text-align:center !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-quick{padding:10px 12px !important;border-bottom:1px solid var(--border,#e8eaed) !important;background:var(--surface,#fff) !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-quick-title{margin-bottom:7px !important;color:var(--text-secondary,#6b7280) !important;font-size:12px !important;letter-spacing:0 !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-tool-row{display:grid !important;grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:8px !important;margin-bottom:6px !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-tool-button{display:inline-flex !important;align-items:center !important;justify-content:center !important;gap:7px !important;min-height:36px !important;padding:0 10px !important;border-radius:var(--radius-sm,8px) !important;border:1px solid var(--border,#e8eaed) !important;background:var(--input-bg,#f5f5f7) !important;color:var(--text,#1d1d1f) !important;font-size:12px !important;text-decoration:none !important;cursor:pointer !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-tool-button i{position:static !important;top:auto !important;width:16px !important;height:16px !important;margin:0 !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;color:var(--primary,#b53434) !important;font-size:14px !important;line-height:1 !important;vertical-align:middle !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-quick-links{display:grid !important;gap:2px !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-quick-link{display:flex !important;align-items:center !important;gap:8px !important;min-height:32px !important;padding:6px 4px !important;color:var(--text,#1d1d1f) !important;font-size:13px !important;line-height:1.3 !important;text-decoration:none !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-quick-link i{width:18px !important;color:var(--primary,#b53434) !important;font-size:14px !important;text-align:center !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-quick .span_bbzx{display:inline !important;font-size:13px !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel[hidden]{display:none !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel{width:100% !important;min-width:0 !important;max-width:none !important;box-sizing:border-box !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel.open{display:block !important;margin:8px 0 !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel #form-search.nav-search{position:relative !important;inset:auto !important;width:100% !important;min-width:0 !important;max-width:none !important;height:36px !important;margin:0 !important;opacity:1 !important;overflow:visible !important;transform:none !important;z-index:1 !important;pointer-events:auto !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel #search-input{width:100% !important;min-width:0 !important;max-width:none !important;height:36px !important;box-sizing:border-box !important}
/* 清爽模式侧边栏搜索：复用站点 form-search（Bootstrap typeahead），结果框美化 */
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel .form-search,
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel .input-icon{display:block !important;position:relative !important;width:100% !important;min-width:0 !important;max-width:none !important;height:36px !important;margin:0 !important;padding:0 !important;box-sizing:border-box !important;background:transparent !important;border:none !important;box-shadow:none !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel .nav-search-input{width:100% !important;height:36px !important;box-sizing:border-box !important;padding:0 12px !important;line-height:36px !important;background:var(--input-bg,#f5f5f7) !important;border:1px solid var(--border,#e8eaed) !important;border-radius:var(--radius-sm,8px) !important;color:var(--text,#1d1d1f) !important;font-size:13px !important;outline:none !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel .nav-search-input:focus{border-color:var(--border-focus,#b53434) !important;box-shadow:0 0 0 3px var(--ring,rgba(181,52,52,.15)) !important}
/* typeahead 结果框：圆角卡片、分隔线、选中态 */
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel ul.typeahead.dropdown-menu{position:absolute !important;left:0 !important;right:0 !important;top:100% !important;margin:4px 0 0 !important;padding:6px !important;list-style:none !important;background:var(--surface,#fff) !important;border:1px solid var(--border,#e8eaed) !important;border-radius:var(--radius-sm,8px) !important;box-shadow:var(--shadow,0 8px 24px rgba(15,23,42,.12)) !important;z-index:12045 !important;max-height:280px !important;overflow-y:auto !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel ul.typeahead.dropdown-menu > li{padding:0 !important;margin:0 !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel ul.typeahead.dropdown-menu > li > a{display:block !important;padding:8px 10px !important;border-radius:6px !important;color:var(--text,#1d1d1f) !important;font-size:13px !important;text-decoration:none !important;white-space:nowrap !important;overflow:hidden !important;text-overflow:ellipsis !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel ul.typeahead.dropdown-menu > li.active > a,
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel ul.typeahead.dropdown-menu > li > a:hover{background:var(--input-bg,#f5f5f7) !important;color:var(--text,#1d1d1f) !important}
#sidebar.urppp-clean-sidebar .urppp-mobile-search-panel ul.typeahead.dropdown-menu > li > a strong{color:var(--primary,#b53434) !important;font-weight:600 !important}
/* 清爽模式下站点弹窗（作息时间表等）置于清爽模式之上 */
html.urppp-clean-open .modal{z-index:12050 !important}
html.urppp-clean-open .modal-backdrop{z-index:12045 !important}
#urppp-clean-root .uc-top{flex:0 0 60px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;border-bottom:1px solid var(--border);background:var(--surface,#fff);animation:ucTopIn .36s cubic-bezier(.22,1,.36,1) both;position:relative;z-index:12040}
#urppp-clean-root .uc-score-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#urppp-clean-root .uc-score-pane{border:1px solid var(--border);border-radius:14px;padding:12px;cursor:pointer;background:var(--input-bg);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease}
#urppp-clean-root .uc-score-pane:hover{border-color:var(--primary);transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,.06);background:color-mix(in srgb,var(--primary) 5%,var(--input-bg))}
#urppp-clean-root .uc-score-pane:active{transform:translateY(0) scale(.99)}
#urppp-clean-root .uc-score-pane h5{margin:0 0 10px;font-size:16px;font-weight:700}
#urppp-clean-root .uc-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
#urppp-clean-root .uc-metric{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:8px;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
#urppp-clean-root .uc-metric:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--primary) 30%,var(--border));box-shadow:0 4px 12px rgba(0,0,0,.04)}
#urppp-clean-root .uc-metric em{display:block;font-style:normal;font-size:13px;color:var(--text-muted);margin-bottom:3px}
#urppp-clean-root .uc-metric b{font-size:20px;display:inline-block;transition:transform .2s ease}
#urppp-clean-root .uc-metric:hover b{transform:scale(1.04)}
#urppp-clean-root .uc-services{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;align-items:stretch}
#urppp-clean-root .uc-svc{width:100%;min-width:0;aspect-ratio:1/1;height:auto;border-radius:12px;border:1px solid var(--border);background:var(--input-bg);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;cursor:pointer;color:var(--text);padding:8px 4px;text-align:center;margin:0;box-sizing:border-box;opacity:0;transform:translateY(10px) scale(.96);animation:ucSvcIn .36s cubic-bezier(.22,1,.36,1) forwards;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease,background .18s ease}
#urppp-clean-root .uc-svc:nth-child(1){animation-delay:.12s}
#urppp-clean-root .uc-svc:nth-child(2){animation-delay:.15s}
#urppp-clean-root .uc-svc:nth-child(3){animation-delay:.18s}
#urppp-clean-root .uc-svc:nth-child(4){animation-delay:.21s}
#urppp-clean-root .uc-svc:nth-child(5){animation-delay:.24s}
#urppp-clean-root .uc-svc:nth-child(6){animation-delay:.27s}
#urppp-clean-root .uc-svc:nth-child(7){animation-delay:.3s}
#urppp-clean-root .uc-svc:hover{border-color:var(--primary);background:color-mix(in srgb,var(--primary) 8%,var(--input-bg));transform:translateY(-3px) scale(1.03);box-shadow:0 10px 22px rgba(0,0,0,.08)}
#urppp-clean-root .uc-svc:active{transform:translateY(-1px) scale(.98)}
#urppp-clean-root .uc-svc svg{width:26px;height:26px;color:var(--primary);flex:0 0 auto;transition:transform .2s ease}
#urppp-clean-root .uc-svc:hover svg{transform:scale(1.08) rotate(-3deg)}
#urppp-clean-root .uc-svc strong{font-size:12px;line-height:1.15;font-weight:700;max-width:100%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#urppp-clean-root .uc-empty,#urppp-clean-root .uc-loading{padding:18px;text-align:center;color:var(--text-secondary);font-size:13px}
#urppp-clean-root .uc-note{font-size:12px;color:var(--text-muted);margin-top:8px;line-height:1.55}
#urppp-clean-root .uc-mobile{display:none}
#urppp-clean-root .uc-tabbar{display:none}
#urppp-clean-root .uc-mask{position:fixed;inset:0;background:rgba(15,23,42,.36);z-index:12010;display:block;opacity:0;pointer-events:none;transition:opacity .22s ease;backdrop-filter:blur(0px)}
#urppp-clean-root .uc-mask.open{opacity:1;pointer-events:auto;backdrop-filter:blur(2px)}
#urppp-clean-root .uc-modal{position:fixed;z-index:12020;left:50%;top:50%;transform:translate(-50%,-46%) scale(.96);width:min(980px,92vw);max-height:86vh;background:var(--surface);border:1px solid var(--border);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.2);opacity:0;pointer-events:none;transition:opacity .24s cubic-bezier(.22,1,.36,1),transform .28s cubic-bezier(.22,1,.36,1)}
#urppp-clean-root .uc-modal.open{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}
#urppp-clean-root .uc-modal-hd{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:17px;flex:0 0 auto}
#urppp-clean-root .uc-modal-bd{padding:12px 14px;overflow:auto;flex:1 1 auto;min-height:0}
#urppp-clean-root .uc-modal-ft{padding:10px 14px;border-top:1px solid var(--border);background:var(--input-bg);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center;flex:0 0 auto;position:relative;z-index:2}
#urppp-clean-root .uc-modal-ft #uc-calc{flex:1 1 auto;min-width:0;font-size:14px}
#urppp-clean-root .uc-modal-ft #uc-clear{flex:0 0 auto}
#urppp-clean-root #uc-score-wrap{position:relative!important;isolation:isolate;overflow:auto;max-height:min(46vh,420px);margin-top:10px;border:1px solid var(--border);border-radius:14px;background:var(--surface);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--border) 50%,transparent)}
#urppp-clean-root #uc-score-wrap table.uc-table{position:relative;width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px;background:transparent}
#urppp-clean-root table.uc-table{width:100%;border-collapse:separate;border-spacing:0;font-size:12.5px;background:transparent}
#urppp-clean-root table.uc-table th,#urppp-clean-root table.uc-table td{padding:10px 12px;border-bottom:1px solid color-mix(in srgb,var(--border) 85%,transparent);text-align:left;vertical-align:middle;background:var(--surface);color:var(--text);line-height:1.45;white-space:normal;word-break:break-word}
#urppp-clean-root table.uc-table thead th{position:sticky;top:0;z-index:6;background:color-mix(in srgb,var(--input-bg) 88%,var(--surface))!important;color:var(--text-secondary);font-weight:700;font-size:12px;letter-spacing:.02em;box-shadow:0 1px 0 var(--border)}
#urppp-clean-root table.uc-table tbody td{background:var(--surface)}
#urppp-clean-root table.uc-table tbody tr{cursor:pointer;user-select:none;transition:background .12s ease}
#urppp-clean-root table.uc-table tbody tr:nth-child(even) td{background:color-mix(in srgb,var(--input-bg) 45%,var(--surface))}
#urppp-clean-root table.uc-table tbody tr:hover td{background:color-mix(in srgb,var(--primary) 8%,var(--surface))!important}
#urppp-clean-root table.uc-table tbody tr.is-on td{background:color-mix(in srgb,var(--primary) 14%,var(--surface))!important}
#urppp-clean-root table.uc-table tbody tr.is-on{box-shadow:inset 3px 0 0 var(--primary)}
#urppp-clean-root table.uc-table tbody tr:last-child td{border-bottom:0}
#urppp-clean-root table.uc-table th:nth-child(2),#urppp-clean-root table.uc-table td:nth-child(2){width:72px;text-align:center;white-space:nowrap}
#urppp-clean-root table.uc-table th:nth-child(3),#urppp-clean-root table.uc-table td:nth-child(3){width:56px;text-align:center;font-variant-numeric:tabular-nums}
#urppp-clean-root table.uc-table th:nth-child(4),#urppp-clean-root table.uc-table td:nth-child(4){width:88px;text-align:center}
#urppp-clean-root table.uc-table th:nth-child(5),#urppp-clean-root table.uc-table td:nth-child(5){width:64px;text-align:center;font-variant-numeric:tabular-nums;font-weight:600;color:var(--text-secondary)}
#urppp-clean-root .uc-namecell{padding-left:28px!important;position:relative}
#urppp-clean-root .uc-cname{display:inline;position:relative;z-index:0;font-weight:600}
#urppp-clean-root .uc-selmark{z-index:1;left:8px}
#urppp-clean-root .uc-attr-pill{display:inline-flex;align-items:center;justify-content:center;min-width:40px;padding:2px 8px;border-radius:999px;background:color-mix(in srgb,var(--primary) 10%,var(--input-bg));color:var(--text-secondary);font-size:11px;font-weight:600;line-height:1.4}
#urppp-clean-root .uc-score-cell{min-width:48px;padding:3px 9px;border-radius:999px;font-size:12px}
#urppp-clean-root .uc-select-box{position:absolute;border:1.5px solid var(--primary);background:color-mix(in srgb,var(--primary) 16%,transparent);pointer-events:none;z-index:20;display:none;border-radius:6px;box-sizing:border-box}
html.urppp-theme-dark #urppp-clean-root table.uc-table th,
html.urppp-theme-dark #urppp-clean-root table.uc-table td,
body.urppp-dark #urppp-clean-root table.uc-table th,
body.urppp-dark #urppp-clean-root table.uc-table td{background:var(--surface)!important;color:var(--text)!important;border-color:var(--border)!important}
html.urppp-theme-dark #urppp-clean-root table.uc-table tbody tr:hover td,
body.urppp-dark #urppp-clean-root table.uc-table tbody tr:hover td{background:var(--input-bg)!important}
html.urppp-theme-dark #urppp-clean-root table.uc-table tbody tr.is-on td,
body.urppp-dark #urppp-clean-root table.uc-table tbody tr.is-on td{background:color-mix(in srgb,var(--primary) 22%,var(--surface))!important}
#urppp-clean-root .uc-build-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
#urppp-clean-root .uc-build-grid button{border:1px solid var(--border);background:var(--input-bg);border-radius:12px;padding:10px;cursor:pointer;color:var(--text);font-size:12px;text-align:left}
#urppp-clean-root .uc-build-grid button:hover{border-color:var(--primary)}
#urppp-clean-root .uc-occ{overflow:auto;border:1px solid var(--border);border-radius:14px;background:var(--surface);padding:8px}
#urppp-clean-root .uc-occ-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}
#urppp-clean-root .uc-occ-title{font-size:16px;font-weight:700}
#urppp-clean-root .uc-room-days{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#urppp-clean-root .uc-room-days .uc-btn{height:28px;padding:0 10px;font-size:12px}
#urppp-clean-root .uc-occ-table{border-collapse:separate;border-spacing:4px;font-size:11px;min-width:760px}
#urppp-clean-root .uc-occ-table th{background:var(--input-bg);color:var(--text);z-index:1;padding:6px 8px;text-align:left;white-space:nowrap;border-radius:8px}
#urppp-clean-root .uc-occ-table th.sticky{position:sticky;left:0;z-index:3}
#urppp-clean-root .uc-occ-table th.sticky2{position:sticky;left:64px;z-index:3}
#urppp-clean-root .uc-occ-table .sec{min-width:30px;text-align:center;color:var(--text-secondary);font-weight:600;background:transparent}
#urppp-clean-root .uc-slot{width:30px;height:26px;border-radius:7px;border:1px solid var(--border);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;padding:0;cursor:default}
#urppp-clean-root .uc-slot.free{background:color-mix(in srgb,var(--input-bg) 88%,var(--surface));color:transparent}
#urppp-clean-root .uc-slot.busy{cursor:pointer;color:#0b3b4a;background:#7be0f6;border-color:#4ec8e0}
#urppp-clean-root .uc-slot.busy:hover{filter:brightness(1.05);transform:scale(1.04)}
#urppp-clean-root .uc-legend{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:4px 0 10px;font-size:12px;color:var(--text-secondary)}
#urppp-clean-root .uc-legend i{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:middle;margin-right:4px;border:1px solid var(--border)}
#urppp-clean-root .uc-legend .lg-busy{background:#7be0f6;border-color:#4ec8e0}
#urppp-clean-root .uc-legend .lg-exam{background:#fbbf24;border-color:#f59e0b}
#urppp-clean-root .uc-legend .lg-lab{background:#a78bfa;border-color:#8b5cf6}
#urppp-clean-root .uc-legend .lg-borrow{background:#fb7185;border-color:#f43f5e}
#urppp-clean-root .uc-legend .lg-free{background:var(--input-bg)}
html.urppp-theme-dark #urppp-clean-root .uc-slot.free,
body.urppp-dark #urppp-clean-root .uc-slot.free{background:#1c2330;border-color:#2a3548}
html.urppp-theme-dark #urppp-clean-root .uc-slot.busy,
body.urppp-dark #urppp-clean-root .uc-slot.busy{background:#2dd4bf;border-color:#14b8a6;color:#042f2e}
html.urppp-theme-dark #urppp-clean-root .uc-occ,
body.urppp-dark #urppp-clean-root .uc-occ{background:var(--surface);border-color:var(--border)}
html.urppp-theme-dark #urppp-clean-root .uc-occ-table th,
body.urppp-dark #urppp-clean-root .uc-occ-table th{background:var(--input-bg);color:var(--text)}
html.urppp-clean-lock,html.urppp-clean-lock body{overflow:hidden!important}
#urppp-clean-root .uc-loading{position:relative}
#urppp-clean-root .uc-loading::after{content:'';display:inline-block;width:1.1em;margin-left:2px;animation:ucDots 1s steps(4,end) infinite}
#urppp-clean-root .uc-week-label.uc-pop{animation:ucPop .28s cubic-bezier(.22,1,.36,1)}
#urppp-clean-root .uc-build-grid button{transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease}
#urppp-clean-root .uc-build-grid button:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.05)}
#urppp-clean-root .uc-slot.busy{transition:transform .15s ease,filter .15s ease}
#urppp-clean-root .uc-avatar{transition:transform .22s ease,box-shadow .22s ease}
#urppp-clean-root .uc-card:hover .uc-avatar{transform:scale(1.02)}
#urppp-clean-root.uc-settled .uc-top,
#urppp-clean-root.uc-settled .uc-card,
#urppp-clean-root.uc-settled .uc-svc{animation:none!important;opacity:1!important;transform:none!important}
#urppp-clean-root.uc-settled .uc-svc:hover{transform:translateY(-3px) scale(1.03)!important}
#urppp-clean-root.uc-settled .uc-card:hover{transform:none}
@keyframes ucTopIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@keyframes ucCardIn{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}
@keyframes ucSvcIn{from{opacity:0;transform:translateY(10px) scale(.96)}to{opacity:1;transform:none}}
@keyframes ucPop{0%{transform:scale(.92);opacity:.7}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
@keyframes ucDots{0%{content:''}25%{content:'.'}50%{content:'..'}75%{content:'...'}}
@media (prefers-reduced-motion:reduce){
  #urppp-clean-root,#urppp-clean-root *{animation:none!important;transition:none!important}
  /* 侧边栏抽屉滑入滑出是核心交互，reduced-motion 下保留（否则收回无动画看起来像 bug） */
  #sidebar.urppp-clean-sidebar,#sidebar.urppp-clean-sidebar.display{transition:transform .26s cubic-bezier(.4,0,.2,1) !important}
  #urppp-clean-root,#urppp-clean-root .uc-card,#urppp-clean-root .uc-svc,#urppp-clean-root .uc-top,#urppp-clean-root .uc-mask,#urppp-clean-root .uc-modal{opacity:1!important;transform:none!important;pointer-events:auto}
  #urppp-clean-root .uc-mask{display:none}
  #urppp-clean-root .uc-mask.open{display:block}
  #urppp-clean-root .uc-modal{display:none}
  #urppp-clean-root .uc-modal.open{display:flex}
}
html body #navbar #urppp-nav-clean,#urppp-nav-cal,html body #urppp-nav-theme #urppp-nav-clean,#urppp-nav-cal,#urppp-nav-clean,#urppp-nav-cal{
  margin-left:8px!important;height:28px!important;min-height:28px!important;max-height:28px!important;
  padding:0 10px!important;border-radius:var(--urppp-action-radius,999px)!important;
  border:var(--urppp-action-border,none)!important;
  background:var(--urppp-action-bg,var(--primary))!important;
  color:var(--urppp-action-color,var(--surface))!important;font-size:12px!important;
  display:inline-flex!important;align-items:center!important;gap:6px!important;width:auto!important;
  box-shadow:var(--urppp-action-shadow,0 2px 6px var(--ring))!important;
  line-height:26px!important;cursor:pointer!important;float:none!important
}
#urppp-nav-clean svg,#urppp-nav-cal svg{width:14px!important;height:14px!important;display:block!important}
@media (max-width:900px){
  #urppp-clean-root .uc-top{flex:0 0 52px;padding:0 12px}
  #sidebar.urppp-clean-sidebar{top:52px !important;height:calc(100vh - 52px) !important}
  #urppp-clean-root .uc-top-actions .uc-btn span{display:none}
  #urppp-clean-root .uc-top-actions .uc-btn{width:34px;padding:0;justify-content:center}
  #urppp-clean-root .uc-shell{padding:10px 10px 90px;align-items:stretch;justify-content:flex-start}
  #urppp-clean-root .uc-desktop{display:none}
  #urppp-clean-root .uc-mobile{display:block}
  #urppp-clean-root .uc-tabbar{display:flex;position:fixed;left:0;right:0;bottom:0;height:68px;background:var(--surface);border-top:1px solid var(--border);z-index:12005;padding:4px 0 calc(4px + env(safe-area-inset-bottom))}
  #urppp-clean-root .uc-tabbar button{flex:1;border:0;background:transparent;color:var(--text-secondary);font-size:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}
  #urppp-clean-root .uc-tabbar button svg{width:28px!important;height:28px!important;display:block;flex:0 0 auto}
  #urppp-clean-root .uc-tabbar button.ac{color:var(--primary);font-weight:700}
  /* 皮肤协调：flat/brutal 下标签栏按钮去掉独立矩形边框与硬阴影，避免与容器矩形嵌套冲突（用 [type] 属性选择器提高优先级，覆盖 entry 皮肤规则） */
  html[data-urppp-skin="flat"] #urppp-clean-root .uc-tabbar button[type],
  html[data-urppp-skin="brutal"] #urppp-clean-root .uc-tabbar button[type]{border:0!important;box-shadow:none!important;background:transparent!important}
  html[data-urppp-skin="flat"] #urppp-clean-root .uc-tabbar button[type].ac{background:transparent!important;color:var(--primary)!important}
  html[data-urppp-skin="brutal"] #urppp-clean-root .uc-tabbar button[type].ac{background:var(--brutal-accent)!important;color:#000!important}
  #urppp-clean-root .uc-score-grid{grid-template-columns:1fr}
  #urppp-clean-root .uc-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}
  #urppp-clean-root .uc-services{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
  #urppp-clean-root .uc-svc{width:100%;height:auto}
  #urppp-clean-root .uc-modal{inset:0;left:0;top:52px;right:0;bottom:0;width:100%;height:auto;max-height:none;border-radius:0;transform:translateY(16px)}
  #urppp-clean-root .uc-modal.open{transform:translateY(0) scale(1)}
  #urppp-clean-root .uc-modal-hd{padding:12px 12px;padding-top:calc(12px + env(safe-area-inset-top))}
  #urppp-clean-root .uc-modal-bd{padding:10px 12px;flex:1 1 auto;min-height:0}
  #urppp-clean-root .uc-modal-ft{padding:10px 12px;padding-bottom:calc(12px + env(safe-area-inset-bottom));position:sticky;bottom:0;background:var(--input-bg);box-shadow:0 -6px 16px rgba(0,0,0,.06)}
  #urppp-clean-root .uc-modal-ft #uc-calc{font-size:13px;line-height:1.4}
  #urppp-clean-root #uc-score-wrap{max-height:none;flex:1 1 auto;min-height:180px}
  #urppp-clean-root .uc-modal-bd{display:flex;flex-direction:column}
  #urppp-clean-root .uc-modal-bd > #uc-score-wrap{flex:1 1 auto}
  /* 小屏课表：更紧凑 */
  #urppp-clean-root .uc-week{min-width:0;width:100%}
  #urppp-clean-root .uc-week-head{grid-template-columns:24px repeat(7,minmax(0,1fr));gap:3px;margin-bottom:4px}
  #urppp-clean-root .uc-week-head .h{font-size:10px}
  #urppp-clean-root .uc-week-body{grid-template-columns:24px repeat(7,minmax(0,1fr));gap:3px}
  #urppp-clean-root .uc-sec-col .s{font-size:9px}
  #urppp-clean-root .uc-grid-cell{border-radius:7px}
  #urppp-clean-root .uc-lesson{padding:3px 3px 12px;border-radius:7px}
  #urppp-clean-root .uc-lesson b{font-size:10px;line-height:1.15}
  #urppp-clean-root .uc-lesson i{font-size:8px;margin-top:1px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  #urppp-clean-root .uc-badge{right:2px;bottom:2px;min-width:14px;height:14px;font-size:9px;line-height:14px;padding:0 3px}
  #urppp-clean-root .uc-week-nav{gap:4px;flex-wrap:wrap;justify-content:flex-end}
  #urppp-clean-root .uc-week-nav .uc-btn{height:26px;padding:0 8px;font-size:11px}
  #urppp-clean-root .uc-week-nav .uc-week-label{min-width:52px;font-size:12px}
  #urppp-clean-root .uc-card .uc-hd{padding:10px 10px;font-size:14px}
  #urppp-clean-root .uc-card .uc-bd{padding:10px}
  #urppp-clean-root .uc-profile{gap:10px}
  #urppp-clean-root .uc-avatar,#urppp-clean-root .uc-avatar img{height:56px;max-width:72px}
  #urppp-clean-root .uc-name{font-size:16px}
}

      /* 清爽模式成绩分析（uc-sa） */
      #urppp-clean-root .uc-sa-pane[hidden]{display:none}
      #urppp-clean-root .uc-sa-pane-analysis{margin-top:10px}
      #urppp-clean-root .uc-sa-charts{display:grid;grid-template-columns:1fr;gap:10px}
      #urppp-clean-root .uc-sa-chart-card{
        border:1px solid var(--border);border-radius:12px;padding:12px 14px;
        background:var(--surface);color:var(--text);
      }
      #urppp-clean-root .uc-sa-chart-card h5{margin:0 0 8px;font-size:13px;font-weight:700;color:var(--text)}
      #urppp-clean-root .uc-sa-chart-scroll{width:100%;min-width:0;overflow:visible}
      #urppp-clean-root .uc-sa-chart-card svg{width:100%;height:auto;display:block}
      #urppp-clean-root .uc-sa-empty{padding:18px 8px;color:var(--text-muted);font-size:13px;text-align:center}
      #urppp-clean-root .uc-sa-more-row{margin-top:10px;text-align:right}
      #urppp-clean-root .uc-sa-more{
        display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border-radius:999px;
        color:var(--primary);font-size:12.5px;font-weight:600;cursor:pointer;text-decoration:none;
        background:color-mix(in srgb,var(--primary) 8%,transparent);transition:background .15s;
      }
      #urppp-clean-root .uc-sa-more:hover{background:color-mix(in srgb,var(--primary) 16%,transparent);text-decoration:none}
      @media (max-width:900px){
        #urppp-clean-root .uc-sa-chart-card{padding:10px}
        #urppp-clean-root .uc-sa-chart-scroll{
          overflow-x:auto;overflow-y:hidden;overscroll-behavior-inline:contain;
          scrollbar-width:thin;-webkit-overflow-scrolling:touch
        }
        #urppp-clean-root .uc-sa-chart-scroll svg[data-urppp-chart-layout="mobile"]{flex:0 0 auto}
        #urppp-clean-root .uc-sa-more-row{text-align:stretch}
        #urppp-clean-root .uc-sa-more{width:100%;justify-content:center;box-sizing:border-box}
      }

      /* 成绩总览/成绩分析：标题位 tab（参考设置界面） */
      #urppp-clean-root .uc-hd.uc-hd-tabs{padding:6px 8px 0;gap:6px;display:flex;justify-content:flex-start;align-items:flex-end;border-bottom:1px solid var(--border)}
      #urppp-clean-root .uc-hd-tabs .uc-sa-tab{
        height:36px;padding:0 18px;border:none;background:transparent;color:var(--text-secondary);
        font-size:13px;font-weight:600;cursor:pointer;position:relative;border-radius:var(--radius-sm, 10px) var(--radius-sm, 10px) 0 0;
        transition:color .15s,background .15s;
      }
      #urppp-clean-root .uc-hd-tabs .uc-sa-tab:hover{color:var(--text);background:var(--input-bg)}
      #urppp-clean-root .uc-hd-tabs .uc-sa-tab.ac{
        color:var(--primary);background:color-mix(in srgb,var(--primary) 13%,var(--surface));
        font-weight:700;
      }
      #urppp-clean-root .uc-hd-tabs .uc-sa-tab.ac::after{
        content:'';position:absolute;left:12%;right:12%;bottom:0;height:2.5px;border-radius:2.5px 2.5px 0 0;background:var(--primary);
      }

      /* 成绩分析图表 hover 遮罩跟随主题 */
      #urppp-clean-root .urppp-sa-hover{cursor:pointer}
      #urppp-clean-root .urppp-sa-hover:hover{fill:color-mix(in srgb,var(--primary) 7%,transparent)}
`;var Ei=`      /* 首页重构仪表板（dashboard） */
      /* 首页重构仪表板 */
      /* 与面包屑/page-content 同宽同边，不再二次缩进 */
      #urppp-dashboard { padding: 0 !important; max-width: none !important; width: 100% !important; margin: 0 !important; box-sizing: border-box !important; }
      .urppp-welcome { margin: 4px 0 24px; }
      .urppp-welcome h2 { font-size: 26px; font-weight: 600; color: var(--text); margin: 0 0 6px; letter-spacing: 1px; }
      .urppp-welcome p { color: var(--text-secondary); margin: 0; font-size: 14px; }
      .urppp-stats-grid { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 24px; }
      .urppp-stat-card {
        display: flex;
        align-items: center;
        gap: 14px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 20px 24px;
        box-shadow: var(--shadow);
        cursor: pointer;
        text-decoration: none;
        transition: transform .2s, box-shadow .2s;
      }
      .urppp-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--ring); }
      .urppp-stat-card .value {
        font-size: 34px;
        font-weight: 700;
        color: var(--text);
        line-height: 1;
        flex-shrink: 0;
      }
      .urppp-stat-card .value.urppp-stat-value-text {
        font-size: 30px;
        font-weight: 600;
      }
      .urppp-stat-card .label {
        font-size: 16px;
        color: var(--text-secondary) !important;
        line-height: 1.4;
        white-space: normal;
        max-width: 150px;
        background: transparent !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .urppp-stat-skeleton { cursor: default; pointer-events: none; }
      .urppp-stat-skeleton .value { background: var(--input-bg); color: transparent !important; border-radius: 4px; width: 48px; height: 34px; }
      .urppp-stat-skeleton .label { background: var(--input-bg); color: transparent !important; border-radius: 4px; width: 80px; height: 20px; }
      .urppp-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; align-items: start; }
      @media (max-width: 1100px) { .urppp-main-grid { grid-template-columns: minmax(0, 1fr); } }
      /* 日程卡：必须 overflow:hidden 才能裁出底角圆角；滚动交给 FC 内部 .fc-scroller */
      #urppp-left .urppp-card {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius, 16px) !important;
        box-shadow: var(--shadow) !important;
        overflow: hidden !important;
      }
      #urppp-left .urppp-card-body {
        background: var(--surface) !important;
        overflow: hidden !important;
        padding: 12px 16px 16px !important;
        border-radius: 0 0 var(--radius, 16px) var(--radius, 16px) !important;
      }
      #urppp-left .fc,
      #urppp-left #main-calendar {
        background: var(--surface) !important;
        border-radius: 0 0 12px 12px !important;
        overflow: hidden !important;
        width: 100% !important;
      }
      /* 内部滚动层保持可滚，不要被外层圆角规则改成 visible 导致直角穿出 */
      #urppp-left .fc .fc-scroller,
      #urppp-left .fc-time-grid-container {
        border-radius: 0 0 10px 10px !important;
      }
      #urppp-left .fc-toolbar { margin: 0 0 12px 0 !important; padding: 8px 8px 0 8px !important; }
      #urppp-left .fc-toolbar .fc-center h2,
      #urppp-left .fc-toolbar h2 { display: inline-block !important; background: var(--surface) !important; border: 1px solid var(--border) !important; border-radius: var(--radius) !important; padding: 6px 14px !important; font-size: 14px !important; color: var(--text) !important; box-shadow: var(--shadow) !important; }
      .urppp-card {
        background: var(--surface) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius, 16px) !important;
        box-shadow: var(--shadow) !important;
        overflow: hidden !important;
        margin-bottom: 20px !important;
      }
      .urppp-card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
      .urppp-card-header h4 { font-size: 16px; font-weight: 600; color: var(--text); margin: 0; }
      .urppp-card-tools .widget-toolbar { padding: 0; line-height: 1; }
      .urppp-card-tools .widget-toolbar a { color: var(--text-secondary) !important; margin-left: 12px; font-size: 14px; }
      .urppp-card-tools .widget-toolbar a:hover { color: var(--primary) !important; }
      .urppp-card-body { padding: 16px 20px; }
      #urppp-dashboard .widget-box { background: transparent; border: none; border-radius: 0; box-shadow: none; margin-bottom: 0; }
      #urppp-dashboard .widget-header { display: none; }
      #urppp-dashboard .widget-body { background: transparent; border: none; padding: 0; }
      #urppp-dashboard .tabContent { counter-reset: urppp-notice; }
      /* 站点会给 h3.click-item 写 inline white；CSS !important 可压过非 !important 的 inline */
      #urppp-dashboard .tabContent h3,
      #urppp-dashboard .tabContent h3.click-item,
      #urppp-dashboard #notices h3,
      #urppp-dashboard #notices h3.click-item,
      #notices h3,
      #notices h3.click-item,
      #notices h3[style],
      #notices h3.click-item[style],
      .tabContent h3.click-item,
      .tabContent h3.click-item[style] {
        position: relative !important;
        margin: 0 0 6px !important;
        padding-left: 32px !important;
        height: auto !important;
        min-height: 0 !important;
        display: flex !important;
        align-items: center !important;
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
      }
      #urppp-dashboard .tabContent h3:last-child { margin-bottom: 0 !important; }
      #urppp-dashboard .tabContent h3::before {
        counter-increment: urppp-notice;
        content: counter(urppp-notice);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--primary);
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px var(--ring);
      }
      #urppp-dashboard .tabContent h3 a,
      #urppp-dashboard #notices h3 a,
      #notices h3 a,
      #notices h3.click-item a {
        color: var(--text) !important;
        font-weight: 500 !important;
        font-size: 13.5px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        width: 100% !important;
        padding: 8px 10px !important;
        border-radius: var(--radius-sm) !important;
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        transition: background .2s;
        line-height: 1.35 !important;
        min-height: 0 !important;
        height: auto !important;
        max-height: none !important;
      }
      #urppp-dashboard .tabContent h3 a:hover,
      #urppp-dashboard #notices h3 a:hover,
      #notices h3 a:hover,
      #notices h3.click-item a:hover {
        background: var(--border) !important;
        background-color: var(--border) !important;
      }
      /* 暗色：列表行更贴 surface，避免发灰发白 */
      html.urppp-theme-dark #urppp-dashboard .tabContent h3 a,
      html.urppp-theme-dark #notices h3 a,
      html.urppp-theme-dark #notices h3.click-item a {
        background: var(--input-bg) !important;
        background-color: var(--input-bg) !important;
        color: var(--text) !important;
      }
      html.urppp-theme-dark #urppp-dashboard .tabContent h3 a:hover,
      html.urppp-theme-dark #notices h3 a:hover {
        background: color-mix(in srgb, var(--primary) 16%, var(--input-bg)) !important;
        background-color: color-mix(in srgb, var(--primary) 16%, var(--input-bg)) !important;
      }
      #urppp-dashboard .tabContent h3 label { font-weight: inherit !important; color: inherit !important; margin: 0 !important; }
      #urppp-dashboard .tabContent h3 a > span { display: flex !important; justify-content: space-between !important; align-items: center !important; width: 100% !important; }
      #urppp-dashboard .tabContent h3 .hide_note { flex: 1 !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; margin-right: 10px !important; }
      #urppp-dashboard .tabContent h3 .fa-clock-o { margin-right: 4px !important; color: var(--text-muted) !important; }
      /* 覆盖原站 .tabContent h3 a:link { line-height:34px } 造成的过大行距 */
      #urppp-dashboard .tabContent h3 a:link,
      #urppp-dashboard .tabContent h3 a:visited,
      #urppp-dashboard .tabContent h3 a:hover,
      #urppp-dashboard .tabContent h3 a:active {
        line-height: 1.35 !important;
        padding: 8px 10px !important;
        height: auto !important;
      }
      #urppp-dashboard .urppp-card-body:has(.btn-app),
      #urppp-dashboard .widget-main:has(.btn-app),
      #urppp-dashboard #personalApplication {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
        padding: 14px !important;
        font-size: 13px !important;
      }
      #urppp-dashboard .btn-app,
      #urppp-dashboard a.btn-app,
      #urppp-dashboard button.btn-app {
        display: inline-flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        width: 96px !important;
        min-width: 96px !important;
        height: 92px !important;
        min-height: 92px !important;
        max-height: none !important;
        margin: 0 !important;
        border-radius: var(--radius-sm) !important;
        background: var(--input-bg) !important;
        border: 1px solid var(--border) !important;
        color: var(--text) !important;
        box-shadow: none !important;
        padding: 10px 8px !important;
        font-size: 12px !important;
        line-height: 1.25 !important;
        white-space: normal !important;
        text-align: center !important;
        transition: all .2s;
        word-break: keep-all !important;
        vertical-align: top !important;
      }
      #urppp-dashboard .btn-app:hover {
        background: var(--primary) !important;
        border-color: var(--primary) !important;
        color: #fff !important;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px var(--ring);
      }
      #urppp-dashboard .btn-app > .ace-icon,
      #urppp-dashboard .btn-app > .fa,
      #urppp-dashboard .btn-app > .glyphicon {
        color: inherit !important;
        display: block !important;
        margin: 0 0 6px !important;
        font-size: 26px !important;
        line-height: 1 !important;
        width: auto !important;
        height: auto !important;
      }
      /* 不锁 FC 高度/overflow，尺寸交给 fullCalendar 自己算 */
      #urppp-left #main-calendar,
      #urppp-dashboard #main-calendar {
        width: 100% !important;
      }
`;var Ci=`      /* 成绩分析面板（score-analysis） */
      #urppp-score-analysis.urppp-sa {
        margin: 14px 0 20px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius, 14px);
        box-shadow: var(--shadow);
        overflow: hidden;
      }
      #urppp-score-analysis .urppp-sa-toggle {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 13px 18px;
        background: transparent;
        border: 0;
        cursor: pointer;
        text-align: left;
        font: inherit;
        color: var(--text);
      }
      #urppp-score-analysis .urppp-sa-toggle:hover { background: color-mix(in srgb, var(--primary, #2563eb) 6%, transparent); }
      #urppp-score-analysis .urppp-sa-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: var(--radius-sm, 9px);
        background: color-mix(in srgb, var(--primary, #2563eb) 14%, transparent);
        color: var(--primary, #2563eb);
        flex: 0 0 auto;
        transition: background-color .2s, color .2s;
      }
      #urppp-score-analysis .urppp-sa-icon svg { display: block; }
      #urppp-score-analysis .urppp-sa-title { font-size: 15px; font-weight: 700; flex: 0 0 auto; }
      #urppp-score-analysis .urppp-sa-summary {
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: var(--text-muted);
        font-size: 12.5px;
      }
      #urppp-score-analysis .urppp-sa-chevron {
        display: inline-flex;
        color: var(--text-secondary);
        transition: transform .22s;
        flex: 0 0 auto;
      }
      #urppp-score-analysis.urppp-sa[data-urppp-sa-state="expanded"] .urppp-sa-chevron { transform: rotate(180deg); }
      #urppp-score-analysis .urppp-sa-body { border-top: 1px solid var(--border); background: color-mix(in srgb, var(--input-bg) 34%, var(--surface)); }
      #urppp-score-analysis .urppp-sa-body[hidden] { display: none; }
      #urppp-score-analysis .urppp-sa-content { padding: 16px 18px 18px; }

      #urppp-score-analysis .urppp-sa-loading,
      #urppp-score-analysis .urppp-sa-error,
      #urppp-score-analysis .urppp-sa-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 26px 12px;
        color: var(--text-secondary);
        font-size: 13.5px;
      }
      #urppp-score-analysis .urppp-sa-spinner {
        width: 16px; height: 16px;
        border: 2px solid var(--border);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: urppp-sa-spin .8s linear infinite;
        flex: 0 0 auto;
      }
      @keyframes urppp-sa-spin { to { transform: rotate(360deg); } }
      #urppp-score-analysis .urppp-sa-retry {
        padding: 5px 14px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: var(--surface);
        color: var(--primary);
        font-size: 12.5px;
        font-weight: 600;
        cursor: pointer;
      }
      #urppp-score-analysis .urppp-sa-retry:hover { border-color: var(--primary); }

      #urppp-score-analysis .urppp-sa-metrics {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 14px;
      }
      #urppp-score-analysis .urppp-sa-metric {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius, 12px);
        padding: 12px 14px;
        min-width: 0;
      }
      #urppp-score-analysis .urppp-sa-metric-value { font-size: 24px; font-weight: 700; color: var(--primary); line-height: 1.2; }
      #urppp-score-analysis .urppp-sa-metric-label { font-size: 12.5px; font-weight: 600; color: var(--text); margin-top: 3px; }
      #urppp-score-analysis .urppp-sa-metric-hint { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

      #urppp-score-analysis .urppp-sa-grid {
        display: grid;
        grid-template-columns: 7fr 4fr;
        gap: 12px;
        margin-bottom: 12px;
        align-items: stretch;
      }
      #urppp-score-analysis .urppp-sa-grid:last-child { margin-bottom: 0; }
      #urppp-score-analysis .urppp-sa-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius, 12px);
        padding: 14px 16px;
        min-width: 0;
      }
      #urppp-score-analysis .urppp-sa-card-title {
        margin: 0 0 10px;
        font-size: 13px;
        font-weight: 700;
        color: var(--text);
      }
      #urppp-score-analysis .urppp-sa-chart-scroll { width: 100%; min-width: 0; overflow: visible; }
      #urppp-score-analysis .urppp-sa-chart { width: 100%; height: auto; display: block; }
      #urppp-score-analysis .urppp-sa-hover { cursor: pointer; }
      #urppp-score-analysis .urppp-sa-hover:hover { fill: color-mix(in srgb, var(--primary) 7%, transparent); }

      #urppp-score-analysis .urppp-sa-share-body { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      #urppp-score-analysis.urppp-sa-share-stacked .urppp-sa-share-body { justify-content: center; }
      #urppp-score-analysis.urppp-sa-share-stacked .urppp-sa-legend { align-items: center; }
      #urppp-score-analysis .urppp-sa-donut { flex: 0 0 auto; }
      #urppp-score-analysis .urppp-sa-legend { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
      #urppp-score-analysis .urppp-sa-legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12.5px;
        color: var(--text-secondary);
        line-height: 1.5;
      }
      #urppp-score-analysis .urppp-sa-legend-dot { width: 12px; height: 12px; border-radius: 4px; flex: 0 0 auto; }

      #urppp-score-analysis .urppp-sa-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
      #urppp-score-analysis .urppp-sa-table th,
      #urppp-score-analysis .urppp-sa-table td {
        padding: 7px 10px;
        border-bottom: 1px solid var(--border);
        text-align: right;
        color: var(--text);
        white-space: nowrap;
      }
      #urppp-score-analysis .urppp-sa-table th:first-child,
      #urppp-score-analysis .urppp-sa-table td:first-child { text-align: left; }
      #urppp-score-analysis .urppp-sa-table th {
        color: var(--text-muted);
        font-weight: 600;
        font-size: 11.5px;
        position: sticky;
        top: 0;
        background: var(--surface);
      }
      #urppp-score-analysis .urppp-sa-table tbody tr:last-child td { border-bottom: 0; }
      #urppp-score-analysis .urppp-sa-detail { overflow: auto; max-height: 320px; }

      @media (max-width: 1100px) {
        #urppp-score-analysis .urppp-sa-metrics { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }
      @media (max-width: 900px) {
        #urppp-score-analysis .urppp-sa-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        #urppp-score-analysis .urppp-sa-grid { grid-template-columns: 1fr; }
        #urppp-score-analysis .urppp-sa-summary { display: none; }
      }
      @media (max-width: 720px) {
        #urppp-score-analysis .urppp-sa-toggle { padding: 12px 14px; }
        #urppp-score-analysis .urppp-sa-content { padding: 12px; }
        #urppp-score-analysis .urppp-sa-metrics { gap: 8px; margin-bottom: 10px; }
        #urppp-score-analysis .urppp-sa-metric { padding: 10px 11px; }
        #urppp-score-analysis .urppp-sa-metric-value { font-size: 20px; }
        #urppp-score-analysis .urppp-sa-card { padding: 12px; }
        #urppp-score-analysis .urppp-sa-chart-scroll {
          overflow-x: auto;
          overflow-y: hidden;
          overscroll-behavior-inline: contain;
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }
        #urppp-score-analysis .urppp-sa-chart[data-urppp-chart-layout="mobile"] { flex: 0 0 auto; }
        #urppp-score-analysis .urppp-sa-share-body { align-items: flex-start; }
        #urppp-score-analysis .urppp-sa-legend { width: 100%; }
        #urppp-score-analysis .urppp-sa-detail { max-height: 280px; }
        #urppp-score-analysis .urppp-sa-table { font-size: 11.5px; }
        #urppp-score-analysis .urppp-sa-table th,
        #urppp-score-analysis .urppp-sa-table td { padding: 7px 8px; }
      }
      @media (max-width: 420px) {
        #urppp-score-analysis .urppp-sa-metric:last-child { grid-column: 1 / -1; }
      }
`;var Pi=`      /* ============================================================
       * 移动端 / 窄视口适配（纯媒体查询，不依赖 JS 标记）
       *
       * 教务系统部分页面无 viewport meta：真实手机 UA 时脚本会注入
       * viewport（见 entry），视口 = 设备宽度；桌面 Chrome 用 Responsive
       * 模拟或拖窄窗口时，浏览器直接以窄视口渲染。
       * 两种情况都由本文件的媒体查询接管，保证窄视口下布局可读。
       * ============================================================ */

      /* --- 0. 窄视口通用：禁止页面级横向滚动，垂直滚动保持正常 --- */
      @media (max-width: 991px) {
        html {
          overflow-x: hidden !important;
        }
        body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        .main-container,
        .main-content {
          overflow-x: hidden !important;
        }
        /* 抽屉内容过长时可滚动 */
        .sidebar {
          overflow-y: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        .widget-body,
        .widget-main,
        #main-calendar,
        #urppp-dashboard .urppp-card-body {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }
        /* 通知 / 待办列表：垂直堆叠，文字可换行，消除横向滚动根源 */
        .tabContent {
          overflow-x: hidden !important;
        }
        .tabContent h3,
        .tabContent h3 a {
          display: block !important;
          white-space: normal !important;
          line-height: 1.5 !important;
        }
        #tasks.item-list > li {
          display: flex !important;
          flex-wrap: wrap !important;
          white-space: normal !important;
        }
      }

      /* --- 0b. 超窄视口：顶栏标题让位，清爽按钮保持可见 --- */
      @media (max-width: 340px) {
        #navbar .navbar-brand {
          display: none !important;
        }
        #navbar .navbar-header.pull-left,
        #navbar .navbar-header:not(.navbar-buttons) {
          right: auto !important;
          left: 34px !important;
        }
      }

      /* --- 1. 内容容器加宽 + 元素整体缩小（窄视口） --- */
      @media (max-width: 991px) {
        .main-content .page-content,
        #page-content-template.page-content,
        div.page-content {
          padding: 8px 8px 24px !important;
          max-width: 100% !important;
        }
        .breadcrumbs,
        #breadcrumbs,
        .breadcrumb {
          padding-left: 8px !important;
          padding-right: 8px !important;
          margin-top: 0 !important;
          margin-bottom: 4px !important;
        }
        body {
          font-size: 13px !important;
          line-height: 1.5 !important;
        }
        .page-content h1,
        .page-content h2,
        .page-content .panel-title,
        .page-content .box-title {
          font-size: 17px !important;
        }
        .page-content h3,
        .page-content h4,
        .page-content h5 {
          font-size: 14px !important;
        }
        /* 移动端：区块标题独占一行，操作按钮/提示标签换行，防止长内容溢出 */
        .page-content h4.header,
        .page-content h3.header,
        .page-content .header.smaller,
        .page-content .header.lighter {
          flex-wrap: wrap !important;
          gap: 8px 12px !important;
          row-gap: 8px !important;
        }
        .page-content h4.header > .label,
        .page-content h3.header > .label,
        .page-content .header.smaller > .label,
        .page-content .header > .label,
        .page-content h4.header .label,
        .page-content .header .label {
          white-space: normal !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
          min-width: 0 !important;
          flex: 0 1 auto !important;
          height: auto !important;
          line-height: 1.5 !important;
          opacity: 1 !important;
          top: auto !important;
          vertical-align: middle !important;
        }
        .page-content .panel,
        .page-content .widget,
        .page-content form {
          padding: 8px 8px !important;
        }
        .page-content form:has(.urppp-query-row),
        #page-content-template form:has(.urppp-query-row) {
          display: block !important;
          float: none !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          box-sizing: border-box !important;
        }
        .table > thead > tr > th,
        .table > tbody > tr > td,
        .table-box td,
        .table-box th {
          padding: 6px 8px !important;
          white-space: nowrap !important;
        }
        .pagination,
        .pagebar {
          flex-wrap: wrap !important;
          gap: 4px !important;
        }
        /* 滚动态分页条：窄屏下换行、左对齐，避免左侧信息被截断 */
        #urppagebar.urppp-pagebar-scroll,
        #urppagebar.urppp-pagebar-scroll .dataTables_paginate,
        #urppagebar:has([id^="turnpageto_"][readonly]),
        #urppagebar:has([id^="turnpageto_"][readonly]) .dataTables_paginate {
          flex-wrap: wrap !important;
          justify-content: flex-start !important;
          text-align: left !important;
          white-space: normal !important;
        }
        #urppagebar.urppp-pagebar-scroll .dataTables_paginate > div,
        #urppagebar:has([id^="turnpageto_"][readonly]) .dataTables_paginate > div {
          flex-wrap: wrap !important;
          justify-content: flex-start !important;
        }
        /* 纯 CSS 兜底：JS 未打 class 的页脚也在窄屏换行、不截断 */
        #urppagebar,
        #urppagebar .dataTables_paginate {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          white-space: normal !important;
          text-align: left !important;
        }
        #urppagebar .dataTables_paginate > div,
        #urppagebar [id^="sample-table-2_paginate_"] > div,
        #urppagebar > div {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: flex-start !important;
          align-items: center !important;
          gap: 4px 10px !important;
          white-space: normal !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        #urppagebar span,
        #urppagebar label,
        #urppagebar em,
        #urppagebar b,
        #urppagebar p {
          white-space: normal !important;
        }
        #urppagebar select,
        #urppagebar input {
          max-width: 120px !important;
        }
        /* pagebar 内无内容的子容器不占位，消除列表下方空白 */
        #urppagebar [id^="currNum_"],
        #urppagebar [id^="selectNum_"],
        #urppagebar [id^="endflag_"],
        #urppagebar div:empty {
          display: none !important;
        }
        /* 移动端登录页：卡片自适应，输入控件紧凑不拉长 */
        .wrapper.fadeInDown #formContent,
        .form-signin {
          width: auto !important;
          max-width: 88vw !important;
          min-width: 0 !important;
          padding: 12px 12px 8px !important;
          box-sizing: border-box !important;
        }
        .form-signin input[type="text"],
        .form-signin input[type="password"],
        .form-signin input[type="submit"] {
          height: 38px !important;
          min-height: 38px !important;
          padding: 6px 12px !important;
          margin-top: 3px !important;
          margin-bottom: 3px !important;
          box-sizing: border-box !important;
          font-size: 13px !important;
        }
        .form-signin .form-group {
          margin-bottom: 5px !important;
        }
        /* 验证码行：输入框全宽，验证码图片/登录按钮/EN 链接独立成行，避免 390px 下重叠挤压 */
        .form-signin input#input_checkcode {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        .form-signin a.fadeIn.fourth,
        .form-signin a.fadeInFourth,
        .form-signin a[href*="checkcode"],
        .form-signin a:has(> img[src*="captcha"]),
        .form-signin img[src*="captcha"] {
          display: inline-block !important;
          max-width: 100% !important;
          height: 34px !important;
          margin: 3px 3px 3px 0 !important;
          vertical-align: middle !important;
          box-sizing: border-box !important;
        }
        .form-signin input#loginButton {
          display: block !important;
          width: 100% !important;
          max-width: 100% !important;
          margin-top: 5px !important;
          box-sizing: border-box !important;
        }
        /* 收紧表格与分页条之间的空白，空容器隐藏后底栏跟随上移 */
        #urppagebar {
          margin-top: 2px !important;
        }
        .dataTables_wrapper > table,
        .page-content table.table {
          margin-bottom: 2px !important;
        }
        #urppp-dashboard .urppp-welcome h2 {
          font-size: 19px !important;
        }
        #urppp-dashboard .urppp-stats-grid {
          gap: 8px !important;
        }
      }

      /* ============================================================
       * 首页移动端重构（≤640px）：单行顶栏 + 内容卡片流
       * 功能按钮（校历/作息/假期/搜索/帮助）由 JS 收进汉堡抽屉，
       * 顶栏保持 44px 单行简洁；内容区随顶栏高度让位。
       * ============================================================ */
      @media (max-width: 640px) {
        /* ---------- 布局骨架：顶栏 44px，内容区让位，不重叠 ---------- */
        .main-container,
        #main-container,
        .navbar-fixed-top + .main-container {
          padding-top: 0 !important;
        }
        .navbar-fixed-top {
          padding-top: 0 !important;
        }
        /* ---------- 顶栏：单行 44px，汉堡 + 品牌 + 清爽按钮 ----------
         * 功能按钮与用户区由 JS 收进抽屉（原生 sidebar 用户区已在抽屉内），
         * 顶栏保持极简。 */
        #navbar {
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          left: 0 !important;
          z-index: 1100 !important;
          width: 100% !important;
          height: 44px !important;
          min-height: 44px !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        #navbar .navbar-container {
          width: 100% !important;
          height: 44px !important;
          min-height: 44px !important;
        }
        #navbar .menu-toggler {
          display: none !important;
        }
        #navbar #urppp-mobile-menu-button {
          position: absolute !important;
          top: 8px !important;
          left: 6px !important;
          z-index: 5 !important;
          width: 28px !important;
          height: 28px !important;
          min-width: 28px !important;
          min-height: 28px !important;
          line-height: 28px !important;
          padding: 0 !important;
          margin: 0 !important;
          border-radius: var(--urppp-menu-radius, 12px) !important;
          background: var(--urppp-menu-bg, var(--input-bg, #f5f5f7)) !important;
          color: var(--urppp-menu-color, var(--text, #1d1d1f)) !important;
          border: var(--urppp-menu-border, 1px solid var(--border, #e2e8f0)) !important;
          box-shadow: var(--urppp-menu-shadow, none) !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          appearance: none !important;
          touch-action: manipulation;
        }
        /* 新菜单图标：两条错落圆线；打开后切换为关闭图标 */
        #navbar #urppp-mobile-menu-button .urppp-menu-icon,
        #navbar #urppp-mobile-menu-button .urppp-menu-icon svg {
          display: block !important;
          width: 16px !important;
          height: 16px !important;
          margin: 0 auto !important;
        }
        #navbar #urppp-mobile-menu-button .urppp-menu-icon svg {
          fill: none !important;
          stroke: currentColor !important;
          stroke-width: 1.8 !important;
          stroke-linecap: round !important;
          stroke-linejoin: round !important;
        }
        #navbar #urppp-mobile-menu-button .urppp-menu-icon svg.urppp-menu-icon-close {
          display: none !important;
        }
        #navbar #urppp-mobile-menu-button[aria-expanded="true"] .urppp-menu-icon svg.urppp-menu-icon-open {
          display: none !important;
        }
        #navbar #urppp-mobile-menu-button[aria-expanded="true"] .urppp-menu-icon svg.urppp-menu-icon-close {
          display: block !important;
        }
        #navbar .navbar-header.pull-left,
        #navbar .navbar-header:not(.navbar-buttons) {
          position: absolute !important;
          top: 0 !important;
          right: 0 !important;
          left: 38px !important;
          z-index: 4 !important;
          width: auto !important;
          min-width: 0 !important;
          height: 44px !important;
          min-height: 44px !important;
          margin: 0 !important;
          display: flex !important;
          align-items: center !important;
          overflow: hidden !important;
        }
        #navbar .navbar-brand {
          flex: 1 1 auto !important;
          min-width: 0 !important;
          padding: 0 4px !important;
          height: 44px !important;
          line-height: 44px !important;
          font-size: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
        }
        #navbar .navbar-brand small {
          display: block !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          font-size: 13px !important;
          line-height: 44px !important;
        }
        /* 清爽按钮：移动端紧凑 */
        #navbar #urppp-nav-clean,#urppp-nav-cal,
        #urppp-nav-theme #urppp-nav-clean,#urppp-nav-cal {
          height: 30px !important;
          min-height: 30px !important;
          margin: 0 8px 0 4px !important;
          padding: 0 10px !important;
          font-size: 12px !important;
        }
        /* 主题配色与设置保留在顶栏，移动端压缩间距和控件尺寸 */
        #navbar #urppp-nav-theme {
          display: inline-flex !important;
          flex: 0 0 auto !important;
          align-items: center !important;
          gap: 4px !important;
          height: 44px !important;
          min-height: 44px !important;
          margin: 0 0 0 4px !important;
        }
        #navbar #urppp-nav-theme .urppp-nav-dot,
        #navbar #urppp-nav-theme button.urppp-nav-dot {
          width: 14px !important;
          height: 14px !important;
          min-width: 14px !important;
          min-height: 14px !important;
          flex-basis: 14px !important;
        }
        #navbar #urppp-nav-theme .urppp-nav-settings {
          width: 22px !important;
          height: 22px !important;
          margin-left: 2px !important;
        }
        /* 功能按钮区（含用户头像）整体隐藏：收进抽屉 */
        #navbar .navbar-buttons {
          display: none !important;
        }
        /* 搜索滑块隐藏 */
        #navbar #intellegenceUDiv {
          display: none !important;
        }
        /* 移动抽屉常驻渲染，以 transform 实现可逆的滑入/滑出动画 */
        #sidebar {
          display: block !important;
          position: fixed !important;
          left: 0 !important;
          top: var(--urppp-navbar-height, 44px) !important;
          width: 260px !important;
          min-width: 260px !important;
          max-width: 260px !important;
          height: calc(100vh - var(--urppp-navbar-height, 44px)) !important;
          transform: translate3d(-100%, 0, 0) !important;
          visibility: hidden !important;
          pointer-events: none !important;
          will-change: transform;
          transition: transform .26s cubic-bezier(.4, 0, .2, 1), visibility 0s linear .26s !important;
        }
        #sidebar.display {
          transform: translate3d(0, 0, 0) !important;
          visibility: visible !important;
          pointer-events: auto !important;
          transition: transform .26s cubic-bezier(.4, 0, .2, 1), visibility 0s linear 0s !important;
        }
        #sidebar.display.urppp-drawer-closing {
          transform: translate3d(-100%, 0, 0) !important;
          visibility: visible !important;
          pointer-events: none !important;
          z-index: 1200 !important;
        }
        /* 移动抽屉始终使用完整宽度；menu-min 仅属于桌面折叠状态 */
        #sidebar.display,
        #sidebar.display.menu-min,
        body.menu-min #sidebar.display {
          width: 260px !important;
          min-width: 260px !important;
          max-width: 260px !important;
          z-index: 1200 !important;
        }
        #sidebar.display #urppp-menus,
        body.menu-min #sidebar.display #urppp-menus {
          padding: 10px 12px 24px !important;
        }
        #sidebar.display .urppp-nav-link,
        body.menu-min #sidebar.display .urppp-nav-link {
          padding: 11px 13px !important;
          justify-content: flex-start !important;
        }
        #sidebar.display .urppp-nav-text,
        #sidebar.display .urppp-nav-arrow,
        body.menu-min #sidebar.display .urppp-nav-text,
        body.menu-min #sidebar.display .urppp-nav-arrow {
          display: block !important;
          width: auto !important;
          max-width: 200px !important;
          margin-left: 0 !important;
          opacity: 1 !important;
          overflow: hidden !important;
          pointer-events: auto !important;
        }
        #sidebar.display .urppp-nav-link > .fa,
        body.menu-min #sidebar.display .urppp-nav-link > .fa {
          margin-right: 11px !important;
        }
        #sidebar.display .urppp-nav-submenu,
        body.menu-min #sidebar.display .urppp-nav-submenu {
          display: block !important;
        }
        /* 移动端由顶栏菜单按钮双向开合，移除抽屉内重复关闭头 */
        #sidebar .urppp-sidebar-header {
          display: none !important;
        }
        #sidebar #urppp-menus {
          margin-top: 0 !important;
        }

        /* 抽屉内用户资料与四个原始操作按钮 */
        #urppp-mobile-user {
          margin-top: 0 !important;
          padding: 12px !important;
          border-bottom: 1px solid var(--border, #e8eaed) !important;
          background: var(--surface, #fff) !important;
        }
        #urppp-mobile-user .urppp-mobile-user-identity {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          min-height: 38px !important;
        }
        #urppp-mobile-user .nav-user-photo {
          width: 38px !important;
          height: 38px !important;
          min-width: 38px !important;
          max-width: 38px !important;
          min-height: 38px !important;
          max-height: 38px !important;
          display: block !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 50% !important;
          border: 1px solid var(--border, #e8eaed) !important;
          object-fit: cover !important;
          object-position: center !important;
        }
        #urppp-mobile-user .urppp-mobile-user-copy {
          display: flex !important;
          min-width: 0 !important;
          flex-direction: column !important;
          justify-content: center !important;
          gap: 1px !important;
        }
        #urppp-mobile-user .urppp-mobile-user-welcome {
          display: block !important;
          color: var(--text-secondary, #6b7280) !important;
          font-size: 11px !important;
          font-weight: 400 !important;
          line-height: 1.2 !important;
        }
        #urppp-mobile-user .user-info {
          display: block !important;
          position: relative !important;
          top: -1px !important;
          min-width: 0 !important;
          color: var(--text, #1d1d1f) !important;
          font-size: 16px !important;
          font-weight: 600 !important;
          line-height: 1.35 !important;
          white-space: normal !important;
        }
        #urppp-mobile-user .urppp-mobile-user-actions {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 6px !important;
          margin-top: 10px !important;
        }
        #urppp-mobile-user .urppp-mobile-user-action {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          gap: 7px !important;
          min-width: 0 !important;
          min-height: 34px !important;
          padding: 7px 9px !important;
          border-radius: var(--radius-sm, 8px) !important;
          border: 1px solid var(--border, #e8eaed) !important;
          background: var(--input-bg, #f5f5f7) !important;
          color: var(--text, #1d1d1f) !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          text-decoration: none !important;
        }
        #urppp-mobile-user .urppp-mobile-user-action i {
          width: 14px !important;
          color: var(--primary, #b53434) !important;
          text-align: center !important;
        }

        /* 抽屉内快捷功能：帮助与搜索同一行，搜索框紧随其后 */
        #sidebar .urppp-mobile-quick {
          padding: 10px 12px !important;
          border-bottom: 1px solid var(--border, #e8eaed) !important;
          background: var(--surface, #fff) !important;
        }
        #sidebar .urppp-mobile-quick-title {
          margin-bottom: 7px !important;
          color: var(--text-secondary, #6b7280) !important;
          font-size: 12px !important;
          letter-spacing: 0 !important;
        }
        #sidebar .urppp-mobile-tool-row {
          display: grid !important;
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          gap: 8px !important;
          margin-bottom: 6px !important;
        }
        #sidebar .urppp-mobile-tool-button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 7px !important;
          min-height: 36px !important;
          padding: 0 10px !important;
          border-radius: var(--radius-sm, 8px) !important;
          border: 1px solid var(--border, #e8eaed) !important;
          background: var(--input-bg, #f5f5f7) !important;
          color: var(--text, #1d1d1f) !important;
          font-size: 12px !important;
          text-decoration: none !important;
          cursor: pointer !important;
        }
        #sidebar .urppp-mobile-tool-button i {
          position: static !important;
          top: auto !important;
          width: 16px !important;
          height: 16px !important;
          margin: 0 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: var(--primary, #b53434) !important;
          font-size: 14px !important;
          line-height: 1 !important;
          vertical-align: middle !important;
        }
        #sidebar .urppp-mobile-quick-links {
          display: grid !important;
          gap: 2px !important;
        }
        #sidebar .urppp-mobile-quick-link {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          min-height: 32px !important;
          padding: 6px 4px !important;
          color: var(--text, #1d1d1f) !important;
          font-size: 13px !important;
          line-height: 1.3 !important;
          text-decoration: none !important;
        }
        #sidebar .urppp-mobile-quick-link i {
          width: 18px !important;
          color: var(--primary, #b53434) !important;
          font-size: 14px !important;
          text-align: center !important;
        }
        #sidebar .urppp-mobile-quick .span_bbzx {
          display: inline !important;
          font-size: 13px !important;
        }
        #sidebar .urppp-mobile-search-panel[hidden] {
          display: none !important;
        }
        #sidebar .urppp-mobile-search-panel {
          width: 100% !important;
          box-sizing: border-box !important;
        }
        #sidebar .urppp-mobile-search-panel.open {
          display: block !important;
          margin: 8px 0 !important;
        }
        #sidebar .urppp-mobile-search-panel #form-search.nav-search {
          position: relative !important;
          inset: auto !important;
          width: 100% !important;
          height: 34px !important;
          margin: 0 !important;
          opacity: 1 !important;
          overflow: visible !important;
          transform: none !important;
          z-index: 1 !important;
          pointer-events: auto !important;
        }
        #sidebar .urppp-mobile-search-panel #search-input {
          width: 100% !important;
          height: 34px !important;
          box-sizing: border-box !important;
        }

        /* ---------- 内容区：双列合并单列、卡片流 ---------- */
        .page-content .row {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .page-content [class*="col-"] {
          padding-left: 4px !important;
          padding-right: 4px !important;
        }
        .page-content .widget-container-col {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        .widget-box {
          margin-bottom: 10px !important;
          border-radius: 12px !important;
          border: 1px solid var(--border, #e8eaed) !important;
          overflow: hidden !important;
        }
        .widget-header {
          padding: 6px 10px !important;
          min-height: 34px !important;
        }
        .widget-title {
          font-size: 14px !important;
          line-height: 20px !important;
        }
        .widget-body,
        .widget-main {
          padding: 8px 10px !important;
        }

        /* ---------- 学业信息 infobox：两列网格 ---------- */
        .studyinfo-width {
          width: calc(50% - 4px) !important;
          min-width: calc(50% - 4px) !important; /* 覆盖 ace 的 min-width: 95% */
          max-width: calc(50% - 4px) !important;
          margin: 0 !important;
          padding: 8px 10px !important;
          box-sizing: border-box !important;
          display: inline-block !important;
          vertical-align: top !important;
        }
        .infobox-icon {
          width: 26px !important;
          font-size: 16px !important;
        }
        .infobox-data-number {
          font-size: 20px !important;
          line-height: 1.1 !important;
        }
        .infobox-content {
          font-size: 12px !important;
          line-height: 1.4 !important;
        }
        .infobox > a {
          float: none !important;
          display: block !important;
          margin-top: 2px !important;
          font-size: 11px !important;
        }
        /* 双列之间的行间距 */
        .widget-main {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 8px !important;
        }

        /* ---------- 日程卡片 ---------- */
        #main-calendar {
          overflow-x: auto !important;
          -webkit-overflow-scrolling: touch;
        }

        /* ---------- 本学期课表：保持列宽，在局部视口内横向滑动（纯媒体查询，不依赖 JS class） ---------- */
        #mycoursetable {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          overflow-y: auto !important;
          overscroll-behavior-x: contain;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }
        #mycoursetable #courseTable {
          width: 760px !important;
          min-width: 760px !important;
          max-width: none !important;
          table-layout: fixed !important;
        }
        #mycoursetable #courseTable tr > :first-child {
          position: sticky !important;
          left: 0 !important;
          z-index: 4 !important;
          width: 58px !important;
          min-width: 58px !important;
          max-width: 58px !important;
          background: var(--surface, #fff) !important;
          box-shadow: 1px 0 0 var(--border, #e8eaed) !important;
        }
        #mycoursetable #courseTable thead tr > :first-child {
          z-index: 6 !important;
          background: var(--input-bg, #f5f5f7) !important;
        }

        /* ---------- 插件仪表板（#urppp-dashboard）移动端重构 ----------
         * 首页主体是插件重构后的 dashboard：欢迎区 + 统计卡 + 日程/通知卡片。
         * 移动端：统计卡两列网格、卡片紧凑、日程日历适配窄屏。 */
        #urppp-dashboard .urppp-welcome {
          margin: 2px 0 10px !important;
        }
        #urppp-dashboard .urppp-welcome h2 {
          font-size: 18px !important;
          margin: 0 0 2px !important;
        }
        #urppp-dashboard .urppp-welcome p {
          font-size: 12px !important;
          margin: 0 !important;
        }
        /* 统计卡：两列网格，卡片纵向紧凑排布 */
        #urppp-dashboard .urppp-stats-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 8px !important;
          margin-bottom: 12px !important;
        }
        #urppp-dashboard .urppp-stat-card {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
          justify-content: center !important;
          gap: 3px !important;
          padding: 10px 12px !important;
          border-radius: var(--radius, 12px) !important;
          min-height: 54px !important;
        }
        html[data-urppp-skin="flat"] #urppp-dashboard .urppp-stat-card {
          border-radius: 0 !important;
          border: 2px solid var(--text) !important;
          box-shadow: none !important;
        }
        #urppp-dashboard .urppp-stat-card .value {
          font-size: 22px !important;
          line-height: 1.1 !important;
        }
        #urppp-dashboard .urppp-stat-card .value.urppp-stat-value-text {
          font-size: 16px !important;
          line-height: 1.2 !important;
        }
        #urppp-dashboard .urppp-stat-card .label {
          font-size: 12px !important;
          line-height: 1.3 !important;
          max-width: none !important;
        }
        /* 奇数个统计卡时最后一个跨整行 */
        #urppp-dashboard .urppp-stats-grid .urppp-stat-card:last-child:nth-child(odd) {
          grid-column: 1 / -1 !important;
        }
        /* 主网格单列 + 卡片紧凑（minmax(0,1fr) 防止宽内容把列撑出视口） */
        #urppp-dashboard .urppp-main-grid {
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 10px !important;
        }
        #urppp-dashboard .urppp-left,
        #urppp-dashboard .urppp-right {
          min-width: 0 !important;
          max-width: 100% !important;
        }
        #urppp-dashboard .urppp-card {
          border-radius: 12px !important;
          overflow: hidden !important;
        }
        #urppp-dashboard .urppp-card-header {
          padding: 8px 12px !important;
        }
        #urppp-dashboard .urppp-card-header h4 {
          font-size: 14px !important;
          margin: 0 !important;
        }
        #urppp-dashboard .urppp-card-body {
          padding: 6px 12px 12px !important;
        }
        /* 日程日历适配窄屏：容器限宽 100%，宽内容在卡片内滚动 */
        #urppp-dashboard .fc,
        #urppp-dashboard .fc-view-container,
        #urppp-dashboard #main-calendar {
          max-width: 100% !important;
          min-width: 0 !important;
        }
        #urppp-dashboard .fc-toolbar {
          margin-bottom: 6px !important;
        }
        #urppp-dashboard .fc-toolbar h2 {
          font-size: 13px !important;
        }
        #urppp-dashboard .fc-button {
          padding: 2px 8px !important;
          font-size: 11px !important;
          height: 24px !important;
          line-height: 20px !important;
        }
        #urppp-dashboard .fc-scroller {
          max-height: 320px !important;
          overflow-x: auto !important;
        }
        /* 卡片内列表紧凑 */
        #urppp-dashboard .item-list > li {
          padding: 6px 0 !important;
          font-size: 13px !important;
        }
      }
`;function zi(){return{open:!1,mobileTab:"home",scoreAnalysisTab:"overview",profile:null,schedule:null,scores:null,catalog:null,occupancy:null,currentBuilding:null,loading:{profile:!1,schedule:!1,scores:!1,room:!1},roomError:"",roomDateOffset:0,selected:{passing:new Set,scheme:new Set},activeSchemeIdx:0,_schemeUserSelected:!1,viewWeek:0,weekLocked:!1,_termWeek:0,_termWeekResolved:!1,uiReady:!1}}a(zi,"createCleanModeState");function Li(n){n.profile=null,n.schedule=null,n.scores=null,n.catalog=null,n.occupancy=null,n._termWeekResolved=!1,n._schemeUserSelected=!1,n._schemeInited=!1}a(Li,"resetCleanModeData");function qi({state:n,deps:p}){async function c(u){if(!u&&n.catalog&&n.catalog.length||n.loading.room)return n.catalog;n.loading.room=!0;try{p.render()}catch{}try{n.catalog=await p.loadClassroomCatalog(),n.roomError=""}catch(k){n.catalog=n.catalog||[],n.roomError=String(k&&k.message||k),console.warn("[URP++] room catalog",k)}finally{n.loading.room=!1;try{p.scheduleRender()}catch{}}return n.catalog}a(c,"ensureRoomCatalogLoaded");async function d(u){u&&Li(n),n.loading.profile=n.loading.schedule=n.loading.scores=!0;try{let k=await p.ensureTermWeekResolved();!n.weekLocked&&k>=1&&(n.viewWeek=k)}catch{}if(p.render(),await Promise.all([(async()=>{try{n.profile&&!u||(n.profile=await p.loadProfile()),p.reconcileProfileAndScores()}catch(k){n.profile={name:"同学",majorPlan:"主修方案",majorGpa:"—",avatar:""},console.warn(k)}finally{n.loading.profile=!1,p.scheduleRender()}})(),(async()=>{try{n.schedule&&!u||(n.schedule=await p.loadSchedule())}catch(k){n.schedule={courses:[],error:String(k&&k.message||k)}}finally{if(n.loading.schedule=!1,!n.weekLocked){let k=p.getCurrentWeekNumber()||p.readRememberedTermWeek();k>=1&&(n.viewWeek=k)}p.scheduleRender()}})(),(async()=>{let k=null;try{n.scores&&!u||(n.scores=await p.loadScores(u)),k=n.scores,p.reconcileProfileAndScores(),k&&!k.error&&!k.evaluationReady&&p.enrichScoresWithEvaluation(k).then(()=>{n.scores===k&&(p.reconcileProfileAndScores(),p.scheduleRender())}).catch(P=>{console.warn("[URP++] attach evaluation",P)})}catch(P){n.scores={passing:[],schemes:[],error:String(P&&P.message||P)}}finally{n.loading.scores=!1,p.scheduleRender()}})()]),p.reconcileProfileAndScores(),!n.weekLocked){let k=p.getCurrentWeekNumber()||p.readRememberedTermWeek();k>=1&&(n.viewWeek=k)}p.scheduleRender()}return a(d,"loadAll"),{ensureRoomCatalogLoaded:c,loadAll:d}}a(qi,"createCleanModeDataLoader");var lr={autumn:{name:"秋季学期",weeks:20,start:"2026-08-31",end:"2027-02-20",events:[{t:"reg",name:"本科生新生报到",start:"2026-08-24",end:"2026-08-25"},{t:"reg",name:"在校生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"研究生新生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"在校本科补缓考",start:"2026-08-28",end:"2026-08-30"},{t:"term",name:"本科生开学典礼",start:"2026-09-01"},{t:"term",name:"研究生开学典礼",start:"2026-09-04"},{t:"term",name:"在校生正式行课",start:"2026-08-31",end:"2026-09-06"},{t:"holiday",name:"中秋节",start:"2026-09-25"},{t:"holiday",name:"国庆节假期",start:"2026-10-01",end:"2026-10-07"},{t:"sport",name:"校秋季田径运动会",start:"2026-10-23",end:"2026-10-24"},{t:"exam",name:"本科生期末集中考试周",start:"2027-01-04",end:"2027-01-15"},{t:"holiday",name:"寒假",start:"2027-01-18",end:"2027-02-20"},{t:"holiday",name:"春节",start:"2027-02-06"}]},spring:{name:"春季学期",weeks:18,start:"2027-03-01",end:"2027-07-03",events:[{t:"reg",name:"在校生报到",start:"2027-02-25",end:"2027-02-26"},{t:"term",name:"正式行课",start:"2027-03-01",end:"2027-03-07"},{t:"holiday",name:"清明节",start:"2027-04-05"},{t:"holiday",name:"劳动节假期",start:"2027-05-01",end:"2027-05-05"},{t:"holiday",name:"端午节",start:"2027-06-09"},{t:"exam",name:"期末集中考试",start:"2027-06-21",end:"2027-06-27"},{t:"term",name:"毕业典礼",start:"2027-06-25"},{t:"holiday",name:"暑假开始",start:"2027-07-04"}]}},id={"2026-08-24":"农历七月十二","2026-08-25":"农历七月十三","2026-08-27":"农历七月十五","2026-08-28":"农历七月十六","2026-08-30":"农历七月十八","2026-08-31":"农历七月十九","2026-09-01":"农历七月二十","2026-09-04":"农历七月廿三","2026-09-25":"农历八月十五","2026-10-01":"农历八月廿一","2026-10-07":"农历八月廿七","2026-10-23":"农历九月十四","2026-10-24":"农历九月十五","2027-01-04":"农历冬月廿七","2027-01-15":"农历腊月初八","2027-01-18":"农历腊月十一","2027-02-06":"农历正月初一","2027-02-20":"农历正月十五","2027-02-25":"农历正月二十","2027-02-26":"农历正月廿一","2027-03-01":"农历正月廿四","2027-04-05":"农历二月廿九","2027-05-01":"农历三月廿五","2027-05-05":"农历三月廿九","2027-06-09":"农历五月初五","2027-06-21":"农历五月十七","2027-06-25":"农历五月廿一","2027-06-27":"农历五月廿三","2027-07-03":"农历五月廿九","2027-07-04":"农历六月初一"},Mr={term:{color:"#44616f",label:"教学/开学"},reg:{color:"#8a74bd",label:"报到"},exam:{color:"#c08a3f",label:"考试周"},holiday:{color:"#d0716a",label:"假期"},sport:{color:"#778e63",label:"运动会"}};function $i(){let n=new Date,p=a(c=>String(c).padStart(2,"0"),"p");return`${n.getFullYear()}-${p(n.getMonth()+1)}-${p(n.getDate())}`}a($i,"calToday");function To(n,p){return Math.round((Date.parse(p)-Date.parse(n))/864e5)}a(To,"calDayDiff");function Mo(n,p){let c=To(lr[n].start,p);return c<0?0:Math.floor(c/7)+1}a(Mo,"calWeekNo");function Lo(n){return id[n]||""}a(Lo,"calLunar");function Ti(n){return String(n||"").slice(5)}a(Ti,"calYY");function sd(n){let p=n||$i(),[c,d]=p.split("-").map(Number);return d===8&&p>="2026-08-15"||d>=9||d<=2?"autumn":"spring"}a(sd,"calActiveTerm");function $o(n,p){let c=n&&lr[n]?n:"autumn",d=lr[c],u=p||$i(),k=d.events.map(g=>({e:g,d:To(u,g.start)})).filter(g=>g.d>=-0).sort((g,v)=>g.d-v.d)[0],P=k?To(u,k.e.start):null,A=Mo(c,u),y=Math.max(0,Math.min(100,A/d.weeks*100)),S=u>=d.start;return{term:d,termId:c,next:k,daysLeft:P,weekNo:A,progress:y,started:S,today:u}}a($o,"calStatus");function Ii(n,p){let c=$o(n,p),d=c.next?Mr[c.next.e.t].color:"#c9cdd4",u=c.term;return`<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-s-left">
      <span class="cal-s-count">${c.daysLeft==null?"—":c.daysLeft}</span>
      <span class="cal-s-unit">天后</span>
    </span>
    <span class="cal-s-right">
      <span class="cal-s-wk">${c.started?`第 ${c.weekNo} 周`:"尚未开学"} · ${c.term.name}</span>
      <span class="cal-s-ev"><i style="background:${d}"></i>${c.next?c.next.e.name:"学期已结束"}</span>
      <span class="cal-s-date">${c.next?c.next.e.start+(c.next.e.end&&c.next.e.end!==c.next.e.start?"~"+c.next.e.end.slice(5):""):""}</span>
      <span class="cal-s-prog"><span>本学期进度</span><span>${Math.min(c.weekNo,u.weeks)}/${u.weeks} 周</span></span>
      <span class="cal-s-bar"><i style="width:${c.progress}%"></i></span>
    </span>
  </button>`}a(Ii,"calendarSummaryHtml");function Ni(n,p){let c=$o(n,p);return`<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${c.next?Mr[c.next.e.t].color:"#c9cdd4"}"></span>
    <span class="cal-c-count"><b>${c.daysLeft==null?"—":c.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${c.next?c.next.e.name:"学期已结束"}</span>
      <span class="cal-c-sub">${c.started?`第 ${c.weekNo} 周`:"尚未开学"} · ${c.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${c.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(c.weekNo,c.term.weeks)}/${c.term.weeks} 周</span></span>
  </button>`}a(Ni,"calendarSummaryCompactHtml");function Mi(n,p){let c=$o(n,p),d=c.next?Mr[c.next.e.t].color:"#c9cdd4",u=c.term,k=Object.keys(lr).map(v=>`<button type="button" class="cal-term${v===c.termId?" ac":""}" data-cal-term="${v}">${lr[v].name}</button>`).join(""),P=`<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${d}"></i><b>${c.next?c.next.e.name:"学期已结束"}</b></div>
      <div class="cal-w-sub">${c.next?c.next.e.start+(c.next.e.end&&c.next.e.end!==c.next.e.start?" ~ "+c.next.e.end:""):""}${c.next&&Lo(c.next.e.start)?" · "+Lo(c.next.e.start):""}</div>
    </div>
    <div class="cal-w-mid">
      <span class="cal-w-num">${c.daysLeft==null?"—":c.daysLeft}</span><span class="cal-w-unit">天</span>
    </div>
    <div class="cal-w-right">
      <div class="cal-w-wk">${c.started?`第 ${c.weekNo} 周`:"尚未开学"}</div>
      <div class="cal-w-prog">
        <div class="cal-w-prog-lbl"><span>本学期进度</span><span>${Math.min(c.weekNo,u.weeks)} / ${u.weeks} 周</span></div>
        <div class="cal-w-prog-bar"><i style="width:${c.progress}%"></i></div>
      </div>
    </div>
  </div>`,A=u.events.slice().sort((v,q)=>v.start<q.start?-1:1),y={};A.forEach(v=>{(y[v.start.slice(0,7)]=y[v.start.slice(0,7)]||[]).push(v)});let S=a(v=>v===c.today?" cal-today":"","todayFlag"),g=Object.keys(y).map(v=>{let[,q]=v.split("-");return`<div class="cal-mon">
      <div class="cal-mon-label">${Number(q)} 月</div>
      <div class="cal-mon-items">${y[v].map(C=>{let f=Mr[C.t].color,h=C.end&&C.end!==C.start?"~"+Ti(C.end):"",w=Mo(c.termId,C.start)>0?`第 ${Mo(c.termId,C.start)} 周`:"开学前";return`<div class="cal-ev${S(C.start)}">
          <span class="cal-ev-dot" style="background:${f}"></span>
          <span class="cal-ev-date">${Ti(C.start)}${h||""}<em>${Lo(C.start)||"&nbsp;"}</em></span>
          <span class="cal-ev-name">${C.name}</span>
          <span class="cal-ev-tag" style="color:${f};background:${f}1a">${Mr[C.t].label}</span>
          <span class="cal-ev-wk">${w}</span>
        </div>`}).join("")}</div>
    </div>`}).join("");return`<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${k}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${P}
    <div class="cal-timeline">${g}</div>
  </div>`}a(Mi,"calendarModalHtml");function Bi(n,p){let c=typeof document<"u"?document:null;if(!c)return;qo();let d=n&&lr[n]?n:sd(p),u=c.createElement("div");u.id="urppp-cal-modal",u.innerHTML=`<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${Mi(d,p)}</div></div>`,c.documentElement.appendChild(u),setTimeout(()=>u.classList.add("open"),20),u.querySelector(".cal-overlay").addEventListener("click",()=>qo()),u.addEventListener("click",k=>{let P=k.target;if(P&&P.closest&&P.closest(".cal-close")){qo();return}let A=P&&P.closest?P.closest("[data-cal-term]"):null;if(A){let y=u.querySelector(".cal-body");y&&(y.innerHTML=Mi(A.dataset.calTerm,p)),u.querySelectorAll("[data-cal-term]").forEach(S=>S.classList.toggle("ac",S.dataset.calTerm===A.dataset.calTerm))}})}a(Bi,"openCalendarModal");function qo(){let n=typeof document<"u"?document:null;if(!n)return;let p=n.getElementById("urppp-cal-modal");p&&(p.classList.remove("open"),p.classList.add("closing"),setTimeout(()=>{p.remove()},200))}a(qo,"closeCalendarModal");function Fi(n,p){let c=n||(typeof document<"u"?document:null);c&&c.addEventListener("click",d=>{let u=d.target;u&&u.closest&&u.closest("[data-urppp-cal-open]")&&(d.preventDefault(),d.stopPropagation(),Bi())})}a(Fi,"bindCalendarOpen");var fa=!1;function Io(){let n=typeof document<"u"?document:null;if(!n||fa)return fa;try{let p=n.createElement("style");if(p&&p.id!==void 0){p.id="urppp-cal-style",p.textContent=`
    /* 清爽模式个人资料卡：左资料 + 右校历简览并排 */
    #urppp-clean-root .uc-profile-card .uc-bd{display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}
    /* 清爽模式个人资料卡右侧简略块 */
    .uc-profile{flex:1 1 auto}
    #urppp-clean-root .uc-cal-summary{display:flex;align-items:center;gap:14px;flex:0 0 auto;cursor:pointer;
      background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:10px 16px;
      color:var(--text);box-shadow:0 1px 2px rgba(0,0,0,.04);transition:transform .18s,box-shadow .18s,background .18s}
    #urppp-clean-root .uc-cal-summary:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.08)}
    #urppp-clean-root .uc-cal-summary .cal-s-left{display:flex;align-items:baseline;gap:3px;flex:none}
    #urppp-clean-root .uc-cal-summary .cal-s-count{font-size:30px;font-weight:800;line-height:1;color:var(--primary);font-variant-numeric:tabular-nums}
    #urppp-clean-root .uc-cal-summary .cal-s-unit{font-size:11px;color:var(--text-secondary);margin-bottom:3px}
    #urppp-clean-root .uc-cal-summary .cal-s-right{display:flex;flex-direction:column;justify-content:center;gap:4px;min-width:150px;text-align:left}
    #urppp-clean-root .uc-cal-summary .cal-s-wk{font-size:11px;color:var(--text-secondary)}
    #urppp-clean-root .uc-cal-summary .cal-s-ev{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600}
    #urppp-clean-root .uc-cal-summary .cal-s-ev i{width:8px;height:8px;border-radius:50%;flex:none}
    #urppp-clean-root .uc-cal-summary .cal-s-date{font-size:11px;color:var(--text-secondary)}
    #urppp-clean-root .uc-cal-summary .cal-s-prog{display:flex;justify-content:space-between;font-size:10px;color:var(--text-secondary);margin-top:1px}
    #urppp-clean-root .uc-cal-summary .cal-s-bar{height:4px;background:var(--border);border-radius:4px;overflow:hidden}
    #urppp-clean-root .uc-cal-summary .cal-s-bar i{display:block;height:100%;background:var(--primary);border-radius:4px}
    /* 移动端紧凑版：单行有层次，不换行 */
    #urppp-clean-root .uc-cal-summary-compact{display:flex;align-items:center;gap:10px;width:100%;min-width:0;margin-top:2px;padding:9px 12px;border:1px solid var(--border);border-radius:14px;background:var(--surface);color:var(--text);cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,.05)}
    #urppp-clean-root .uc-cal-summary-compact:hover{background:color-mix(in srgb,var(--primary) 5%,var(--surface))}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-dot{width:9px;height:9px;border-radius:50%;flex:none}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-count{display:flex;align-items:baseline;gap:3px;flex:none}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-count b{font-size:22px;font-weight:800;line-height:1;color:var(--primary);font-variant-numeric:tabular-nums}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-count em{font-style:normal;font-size:10px;color:var(--text-secondary)}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-info{flex:1;min-width:0;text-align:left}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-name{display:block;font-size:13.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-sub{display:block;font-size:10.5px;color:var(--text-secondary);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-prog{flex:none;display:flex;flex-direction:column;align-items:flex-end;gap:4px}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-bar{width:52px;height:4px;background:var(--border);border-radius:4px;overflow:hidden}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-bar i{display:block;height:100%;background:var(--primary);border-radius:4px}
    #urppp-clean-root .uc-cal-summary-compact .cal-c-week{font-size:9.5px;color:var(--text-secondary);white-space:nowrap}
    /* 详细窗口浮层 */
    #urppp-cal-modal{position:fixed;inset:0;z-index:2147483000;font-family:inherit;color:var(--text,#16181d)}
    #urppp-cal-modal .cal-overlay{position:absolute;inset:0;background:rgba(15,20,28,.45);backdrop-filter:blur(2px)}
    /* 进入动画：容器淡入+缩放用 animation（总播，不依赖 initial 态渲染），内容逐条浮现 */
    #urppp-cal-modal .cal-dialog{opacity:0;transform:translate(-50%,-50%) scale(.95)}
    #urppp-cal-modal.open .cal-dialog{opacity:1;transform:translate(-50%,-50%) scale(1);animation:calPopIn .24s cubic-bezier(.16,1,.3,1) forwards}
    @keyframes calPopIn{from{opacity:0;transform:translate(-50%,-50%) scale(.95)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
    /* 退出动画：与进入对称（反向），用 animation 总播 */
    #urppp-cal-modal.closing .cal-dialog{opacity:0;transform:translate(-50%,-50%) scale(.94);animation:calPopOut .18s ease forwards}
    @keyframes calPopOut{from{opacity:1;transform:translate(-50%,-50%) scale(1)}to{opacity:0;transform:translate(-50%,-50%) scale(.94)}}
    #urppp-cal-modal.open .cal-modal-wrap>*{opacity:0;transform:translateY(10px);animation:cal-stagger .26s cubic-bezier(.16,1,.3,1) forwards;will-change:transform,opacity}
    #urppp-cal-modal.open .cal-modal-wrap>*:nth-child(1){animation-delay:.05s}
    #urppp-cal-modal.open .cal-modal-wrap>*:nth-child(2){animation-delay:.11s}
    #urppp-cal-modal.open .cal-modal-wrap>*:nth-child(3){animation-delay:.17s}
    @keyframes cal-stagger{to{opacity:1;transform:translateY(0)}}
    #urppp-cal-modal .cal-dialog{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
      width:min(880px,calc(100vw - 120px));max-width:calc(100vw - 120px);max-height:min(82vh,860px);
      display:flex;flex-direction:column;overflow:hidden;
      background:var(--surface,#fff);color:var(--text,#16181d);border:1px solid var(--border,#e5e5ea);border-radius:18px;
      box-shadow:0 24px 60px rgba(0,0,0,.28);padding:24px 28px 30px}
    #urppp-cal-modal .cal-close{width:30px;height:30px;border-radius:9px;border:1px solid var(--border,#e5e5ea);background:transparent;color:var(--text,#16181d);cursor:pointer;font-size:14px;line-height:1;display:grid;place-items:center;flex:none}
    #urppp-cal-modal .cal-close:hover{background:color-mix(in srgb,var(--primary,#2563eb) 10%,transparent)}
    #urppp-cal-modal .cal-body{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden;overflow-x:hidden;max-width:100%;width:100%}
    #urppp-cal-modal .cal-modal-wrap{display:flex;flex-direction:column;gap:16px;flex:1;min-height:0;overflow-x:hidden;max-width:100%;width:100%}
    #urppp-cal-modal .cal-widget{width:100%}
    /* 防弹窗内容边界裁剪：允许收缩 + 长文本断行 */
    #urppp-cal-modal .cal-dialog,#urppp-cal-modal .cal-body,#urppp-cal-modal .cal-modal-wrap,#urppp-cal-modal .cal-modal-top,
    #urppp-cal-modal .cal-widget,#urppp-cal-modal .cal-timeline,#urppp-cal-modal .cal-ev{box-sizing:border-box}
    #urppp-cal-modal .cal-modal-wrap>*,#urppp-cal-modal .cal-widget>*,#urppp-cal-modal .cal-ev>*{min-width:0}
    #urppp-cal-modal .cal-ev,#urppp-cal-modal .cal-ev span,#urppp-cal-modal .cal-ev b,#urppp-cal-modal .cal-w-sub,
    #urppp-cal-modal .cal-mon-label{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important;}
    #urppp-cal-modal .cal-modal-top{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
    #urppp-cal-modal .cal-modal-title{font-size:17px;font-weight:750}
    #urppp-cal-modal .cal-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
    #urppp-cal-modal .cal-term-pills{display:flex;gap:6px}
    #urppp-cal-modal .cal-term{font-size:12px;padding:5px 13px;border-radius:999px;border:1px solid var(--border,#e5e5ea);background:transparent;color:var(--text-secondary,#5b5f69);cursor:pointer;font-weight:600;flex:none}
    #urppp-cal-modal .cal-term.ac{background:var(--primary,#2563eb);color:#fff;border-color:transparent}
    /* 横置小组件 */
    #urppp-cal-modal .cal-widget{display:flex;align-items:center;gap:22px;background:color-mix(in srgb,var(--primary,#2563eb) 5%,#fff);
      border:1px solid var(--border,#e5e5ea);border-radius:16px;padding:18px 22px;flex-wrap:wrap}
    /* 非 brutal 主题暗色：校历小部件背景改深色，避免白底+白字(brutal 另有覆盖) */
    html.urppp-theme-dark #urppp-cal-modal .cal-widget{background:color-mix(in srgb,var(--primary,#2563eb) 12%,var(--surface,#0a0a0a))!important;}
    #urppp-cal-modal .cal-w-left{flex:1;min-width:200px}
    #urppp-cal-modal .cal-w-label{font-size:11px;color:var(--text-secondary,#5b5f69);letter-spacing:.03em}
    #urppp-cal-modal .cal-w-ev{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;margin-top:3px}
    #urppp-cal-modal .cal-w-ev i{width:11px;height:11px;border-radius:50%;flex:none}
    #urppp-cal-modal .cal-w-sub{margin-top:4px;font-size:12px;color:var(--text-secondary,#5b5f69)}
    #urppp-cal-modal .cal-w-mid{display:flex;align-items:baseline;gap:4px;flex:none}
    #urppp-cal-modal .cal-w-num{font-size:46px;font-weight:820;line-height:.9;color:var(--primary,#2563eb);font-variant-numeric:tabular-nums}
    #urppp-cal-modal .cal-w-unit{font-size:14px;color:var(--text-secondary,#5b5f69);font-weight:600}
    #urppp-cal-modal .cal-w-right{flex:1;min-width:180px;display:flex;flex-direction:column;gap:6px}
    #urppp-cal-modal .cal-w-wk{font-size:12px;color:var(--text-secondary,#5b5f69)}
    #urppp-cal-modal .cal-w-prog-lbl{display:flex;justify-content:space-between;font-size:11px;color:var(--text-secondary,#5b5f69)}
    #urppp-cal-modal .cal-w-prog-bar{height:7px;border-radius:7px;background:var(--border,#e5e5ea);overflow:hidden}
    #urppp-cal-modal .cal-w-prog-bar i{display:block;height:100%;background:var(--primary,#2563eb);border-radius:7px}
    /* 时间线：按月分组（独立滚动区，顶栏/下一个事件固定不滚） */
    #urppp-cal-modal .cal-timeline{display:flex;flex-direction:column;gap:6px;margin-top:2px;padding:0 8px;overflow:auto;overflow-x:hidden;flex:1;min-height:0;overscroll-behavior:contain;scrollbar-gutter:stable;scrollbar-width:thin}
    #urppp-cal-modal .cal-timeline::-webkit-scrollbar{width:8px}
    #urppp-cal-modal .cal-timeline::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--text-secondary,#5b5f69) 45%,transparent);border-radius:8px}
    #urppp-cal-modal .cal-mon{border-top:1px solid var(--border,#e5e5ea)}
    #urppp-cal-modal .cal-mon:first-child{border-top:0}
    #urppp-cal-modal .cal-mon-label{font-size:11px;font-weight:700;color:var(--text-secondary,#5b5f69);padding:12px 0 6px;letter-spacing:.05em}
    #urppp-cal-modal .cal-mon-items{display:flex;flex-direction:column}
    #urppp-cal-modal .cal-ev{display:flex;align-items:center;gap:12px;padding:9px 10px;border-radius:10px;transition:background .15s;width:100%;min-width:0;box-sizing:border-box}
    #urppp-cal-modal .cal-ev:hover{background:color-mix(in srgb,var(--primary,#2563eb) 5%,transparent)}
    #urppp-cal-modal .cal-ev.cal-today{outline:2px solid color-mix(in srgb,var(--primary,#2563eb) 40%,transparent)}
    #urppp-cal-modal .cal-ev-dot{width:8px;height:8px;border-radius:50%;flex:none}
    #urppp-cal-modal .cal-ev-date{min-width:82px;font-size:13px;font-weight:650;font-variant-numeric:tabular-nums}
    #urppp-cal-modal .cal-ev-date em{display:block;font-style:normal;font-size:10px;color:var(--text-secondary,#5b5f69);font-weight:400}
    #urppp-cal-modal .cal-ev-name{flex:1;min-width:0;font-size:13.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #urppp-cal-modal .cal-ev-tag{font-size:10.5px;font-weight:600;padding:1px 8px;border-radius:999px;flex:none}
    #urppp-cal-modal .cal-ev-wk{font-size:11px;color:var(--text-secondary,#5b5f69);flex:none;min-width:56px;text-align:right}
    /* 移动端：时间+事件属性+周进度一行，事件名称换行整行 */
    @media (max-width:700px){
      #urppp-cal-modal .cal-ev{flex-wrap:wrap;row-gap:3px}
      #urppp-cal-modal .cal-ev-date{min-width:0;text-align:left}
      #urppp-cal-modal .cal-ev-name{flex-basis:100%;order:5;margin-left:20px}
      #urppp-cal-modal .cal-ev-wk{min-width:0;text-align:right;margin-left:auto}
    }

    /* 皮肤适配：随各主题保持一致性（圆角/边框/材质由 Skin token 控制） */
    /* 当前事件选中框(cal-today)跟各主题直角/圆角：editorial/flat/brutal 直角 */
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-ev,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-ev,
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-ev{border-radius:0!important}
    /* 编辑杂志：当前事件选中框矩形+黑描边，贴近 editorial 极简 */
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-ev.cal-today{outline:2px solid var(--text)!important;outline-offset:-2px!important;border-radius:0!important}
    /* 编辑杂志：学期切换选中按钮倒置(--text底+--surface字), 避免--primary浅色白底白字 */
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-term.ac{background:var(--text)!important;color:var(--surface)!important;border-color:var(--text)!important}
    html[data-urppp-skin="flat"] #urppp-clean-root .uc-cal-summary,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-dialog,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-widget,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-ev,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-close{border-radius:0!important;box-shadow:none!important}
    html[data-urppp-skin="flat"] #urppp-clean-root .uc-cal-summary,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-dialog,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="flat"] #urppp-cal-modal .cal-close{border:2px solid var(--text,#16181d)!important}
    html[data-urppp-skin="brutal"] #urppp-clean-root .uc-cal-summary,
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-dialog{border-radius:0!important;border:3px solid var(--text,#16181d)!important;box-shadow:6px 6px 0 var(--text,#16181d)!important}
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-widget,
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-ev,
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-close{border-radius:0!important}
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="brutal"] #urppp-cal-modal .cal-close{border:3px solid #000!important;box-shadow:4px 4px 0 #000!important}
    html[data-urppp-skin="editorial"] #urppp-clean-root .uc-cal-summary,
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-dialog{border-radius:0!important;box-shadow:none!important;border:1px solid var(--border,#e5e5ea)!important}
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-widget{border-radius:0!important;box-shadow:none!important;border-color:var(--border,#e5e5ea)!important;background:var(--surface,#fff)!important}
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="editorial"] #urppp-cal-modal .cal-close{border-radius:0!important;box-shadow:none!important;border:0!important;text-decoration-line:underline!important;text-decoration-color:transparent!important}
    html[data-urppp-skin="neu"] #urppp-clean-root .uc-cal-summary,
    html[data-urppp-skin="neu"] #urppp-cal-modal .cal-dialog{box-shadow:4px 4px 10px rgba(0,0,0,.08),-4px -4px 12px #fff!important}
    html[data-urppp-skin="neu"] #urppp-cal-modal .cal-term,
    html[data-urppp-skin="neu"] #urppp-cal-modal .cal-close{box-shadow:2px 2px 6px rgba(0,0,0,.08),-2px -2px 6px #fff!important}
    html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-clean-root .uc-cal-summary,
    html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-clean-root .uc-cal-summary-compact,
    html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-cal-modal .cal-dialog,
    html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-cal-modal .cal-term,
    html.urppp-theme-dark[data-urppp-skin="neu"] #urppp-cal-modal .cal-close{box-shadow:4px 4px 10px var(--neu-shadow-dark),-4px -4px 12px var(--neu-shadow-light)!important}
    @media (max-width:560px){
      #urppp-cal-modal .cal-widget{gap:12px}
      #urppp-cal-modal .cal-dialog{padding:16px;width:calc(100vw - 48px)!important;max-width:calc(100vw - 48px)!important;border-radius:14px}
    }
  `,p.id="urppp-cal-style";let c=n.head||n.documentElement;c&&c.appendChild(p),fa=!0}}catch{}return fa}a(Io,"ensureCalendarStyle");function Di(){let n=typeof document<"u"?document:null;if(!n)return;let p=n.getElementById("urppp-nav-theme")||n.querySelector("#navbar .navbar-header")||n.getElementById("navbar"),c=n.getElementById("urppp-nav-clean"),d=n.getElementById("urppp-nav-cal");if(!p&&!c)return;let u=c&&c.parentElement||p;d&&d.parentElement===u||(d&&d.remove(),d=n.createElement("button"),d.type="button",d.id="urppp-nav-cal",d.title="校历时间线",d.setAttribute("aria-label","校历时间线"),d.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>',Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none",margin:"0 0 0 8px","vertical-align":"middle"}).forEach(([k,P])=>d.style.setProperty(k,P,"important")),d.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),Bi()}),c&&c.parentElement?c.after(d):u&&u.appendChild(d))}a(Di,"mountCalendarButton");function ji(){let n=typeof document<"u"?document:null;if(!n)return;let p=n.getElementById("urppp-nav-cal");p&&p.remove()}a(ji,"removeCalendarButton");function Oi({state:n,deps:p}){let c=0,d={gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)"};function u(x,E){let L=x||p.summarizeCourses([]);return`<div class="uc-metrics">${[["TotalCredit","总学分",L.totalCredit],["AvgScore","平均成绩",L.avgScore],["AvgGpa","平均绩点",L.avgGpa],["RequiredCredit","必修学分",L.requiredCredit],["RequiredAvg","必修平均",L.requiredAvg],["RequiredGpa","必修绩点",L.requiredGpa]].map(([T,j,I])=>{let H=p.classifyPrivacyLabel(j)||"grade",G=E&&p.DIRECT_EDIT_LABELS[E+T]?` data-urppp-edit-key="${E+T}"`:"";return`<div class="uc-metric"><em>${j}</em><b data-urppp-private="${H}"${G}>${I}</b></div>`}).join("")}</div>`}a(u,"metricHtml");function k(){let x=n.scores;if(!x||x.error)return`<div class="uc-sa-empty">${p.escapeHtml(x&&x.error||"暂无成绩数据")}</div>`;let E=null;try{E=p.analyzeScores({scorePack:x,profile:n.profile})}catch{}if(!E||E.empty)return'<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';let L=typeof p.scoreChartLayout=="function"?p.scoreChartLayout():null;return`<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${p.trendChartSvg({trend:E.trend,palette:p.scoreChartPalette||d,layout:L})}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${p.bandsChartSvg({bands:E.bands,palette:p.scoreChartPalette||d,layout:L})}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`}a(k,"analysisHtml");function P(x){let E=!!p.isCleanAnalysisDirect(),L=n.scoreAnalysisTab==="analysis";return E?`<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
  <div class="uc-bd">
    <div class="uc-sa-pane">${x}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis">${k()}</div>
  </div>`:`<div class="uc-hd uc-hd-tabs" role="tablist">
    <button type="button" class="uc-sa-tab${L?"":" ac"}" data-sa-tab="overview">成绩总览</button>
    <button type="button" class="uc-sa-tab${L?" ac":""}" data-sa-tab="analysis">成绩分析</button>
  </div>
  <div class="uc-bd">
    <div class="uc-sa-pane"${L?" hidden":""}>${x}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis"${L?"":" hidden"}>${k()}</div>
  </div>`}a(P,"scoreSectionHtml");function A(){try{if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches)return 40}catch{}return 56}a(A,"getScheduleRowHeight");function y(x){let E=p.getViewWeekNumber(),L=A(),$=Math.max(L-4,28),T=(x||[]).map(H=>Object.assign({},H,{thisWeek:p.weekBitActive(H.classWeek,E)||!H.classWeek&&String(H.week||"").indexOf(String(E))>=0,span:Math.max(1,H.span||1),color:H.color||p.courseColor(H.name)})),j={};T.forEach(H=>{let G=H.day+"_"+H.section;(j[G]||(j[G]=[])).push(H)});let I=`<div class="uc-week" data-urppp-private="schedule" data-week="${E}" data-row="${L}">`;I+='<div class="uc-week-head"><div class="h"></div>';for(let H=0;H<7;H++)I+=`<div class="h">${p.DAY_NAMES[H]}</div>`;I+='</div><div class="uc-week-body">',I+='<div class="uc-sec-col">';for(let H=1;H<=12;H++)I+=`<div class="s" style="height:${L}px">${H}</div>`;I+="</div>";for(let H=0;H<7;H++){I+=`<div class="uc-day-col" data-day="${H}" style="height:${L*12}px">`;for(let G=1;G<=12;G++)I+=`<div class="uc-grid-cell" data-sec="${G}" style="top:${(G-1)*L}px;height:${$}px"></div>`;I+=`<div class="uc-part-line" style="top:${4*L-2}px"></div>`,I+=`<div class="uc-part-line" style="top:${9*L-2}px"></div>`;for(let G=1;G<=12;G++){let U=(j[H+"_"+G]||[]).slice().sort((xt,Z)=>xt.thisWeek!==Z.thisWeek?(Z.thisWeek?1:0)-(xt.thisWeek?1:0):(Z.span||1)-(xt.span||1));if(!U.length)continue;let it=U.filter(xt=>xt.thisWeek)[0]||U[0],bt=U.filter(xt=>xt!==it),J=it.span,Q=(G-1)*L+1,ot=J*L-6,X=it.thisWeek?8:2,ct=it.thisWeek?`--uc-course-color:${it.color};top:${Q}px;height:${ot}px;z-index:${X};background:${it.color}26;border-color:${it.color}80`:`--uc-course-color:${it.color};top:${Q}px;height:${ot}px;z-index:${X};background:color-mix(in srgb,${it.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`,rt=bt.length?`<span class="uc-badge">+${bt.length}</span>`:"",st=p.escapeHtml(JSON.stringify({name:it.name,teacher:it.teacher,place:it.place,week:it.week,day:it.day,section:it.section,span:it.span,thisWeek:it.thisWeek,others:bt.map(xt=>({name:xt.name,teacher:xt.teacher,place:xt.place,week:xt.week,thisWeek:xt.thisWeek,section:xt.section,span:xt.span}))}));I+=`<div class="uc-lesson${it.thisWeek?"":" is-fade"}" style="${ct}" data-course='${st}'>
          <b>${p.escapeHtml(it.name)}</b>
          <i>${p.escapeHtml([it.place,it.week].filter(Boolean).join(" · "))}</i>
          ${rt}
        </div>`}I+="</div>"}return I+="</div></div>",I}a(y,"renderScheduleBoard");function S(){try{if(n.loading&&n.loading.schedule)return"";let x=p.calVacation?p.calVacation():"term";if(x==="term"||p.getViewWeekNumber()!==0)return"";let E={summer:{title:"放暑假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'},winter:{title:"放寒假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>'},springfestival:{title:"春节快乐！",sub:"",svg:'<svg viewBox="0 0 72 72"><rect x="16" y="16" width="40" height="40" rx="7" fill="#b71c1c" stroke="#f5b301" stroke-width="2.4" transform="rotate(45 36 36)"/><path d="M36 16v40M16 36h40" stroke="#f5b301" stroke-width="1" opacity=".5"/><path d="M24 24l24 24M48 24L24 48" stroke="#f5b301" stroke-width="1" opacity=".35"/><text x="36" y="47" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd54f" font-family="Noto Serif SC,STKaiti,KaiTi,serif" transform="rotate(180 36 36)">福</text></svg>',couplet:{scroll:"万象纳祥",right:"望江听雨华西看杏海纳百川享人间烟火",left:"江安漫步眉山泛舟有容乃大过锦绣新年"}}}[x];if(!E)return"";if(x==="springfestival"&&E.couplet){let $=E.couplet;return`<div class="uc-schedule-mask uc-mask-springfestival">
          <span class="uc-mask-scroll">${$.scroll}</span>
          <span class="uc-mask-cl uc-mask-cl-r">${$.right}</span>
          <span class="uc-mask-cl uc-mask-cl-l">${$.left}</span>
          <span class="uc-mask-ico">${E.svg}</span>
          <span class="uc-mask-txt"><b>${E.title}</b></span>
        </div>`}let L=E.sub?`<i>${E.sub}</i>`:"";return`<div class="uc-schedule-mask uc-mask-${x}"><span class="uc-mask-ico">${E.svg}</span><span class="uc-mask-txt"><b>${E.title}</b>${L}</span></div>`}catch{return""}}a(S,"vacationMark");function g(){return`<div class="uc-services">${[{t:"空闲教室",i:"room",a:"room"},{t:"教学评估",i:"eval",h:"/student/teachingEvaluation/newEvaluation/index"},{t:"培养方案",i:"plan",h:"/student/integratedQuery/planCompletion/index"},{t:"补办学生证",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082"},{t:"免修申请",i:"apply",h:"/student/personalManagement/individualApplication/exemptionApplication/index"},{t:"替代课申请",i:"apply",h:"/student/personalManagement/personalApplication/curriculumReplacement/index"},{t:"火车票优惠卡",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083"}].map(E=>`
      <button type="button" class="uc-svc" data-action="${E.a||""}" data-href="${E.h||""}">
        ${p.ico(E.i)}<strong>${E.t}</strong>
      </button>`).join("")}</div>`}a(g,"servicesHtml");function v(){let x=p.personalizedProfile(n.profile||{}),E=n.schedule&&n.schedule.courses||[],L=n.scores&&n.scores.passing&&n.scores.passing[0]||{summary:p.summarizeCourses([])},$=n.scores&&n.scores.schemes||[];n.scores&&n.scores.majorIdx!=null&&n._schemeInited!==!0&&(n.activeSchemeIdx=n.scores.majorIdx||0,n._schemeInited=!0);let T=$[n.activeSchemeIdx]||$[0]||{summary:p.summarizeCourses([]),title:"方案成绩"},j=x.avatar?`<img src="${p.escapeHtml(x.avatar)}" alt="">`:`<span>${p.escapeHtml((x.name||"同")[0])}</span>`,I=n.loading.scores?'<div class="uc-loading">成绩加载中</div>':n.scores&&n.scores.error?`<div class="uc-empty">${p.escapeHtml(n.scores.error)}</div>`:`<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${u(L.summary,"passing")}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${p.escapeHtml((T.title||"方案成绩").split(/通过|获得|不通过/)[0].trim()||"方案成绩")}</h5>${u(T.summary,"scheme")}</div>
          </div>`,H=P(I);return`<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card uc-profile-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${j}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${p.escapeHtml(x.name||"同学")}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${p.escapeHtml(x.majorPlan||"—")}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${p.escapeHtml(String(x.majorGpa||"—"))}</span></div>
          </div>
        </div>${(()=>{try{return Ii()}catch{return""}})()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${p.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${E.length?E.length+" 课次":n.schedule&&n.schedule.error||""}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${n.loading.schedule?'<div class="uc-loading">课表加载中</div>':E.length?y(E):`<div class="uc-empty">${p.escapeHtml(n.schedule&&n.schedule.error||"暂无课表数据")}</div>`}${S()}</div></div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          ${H}
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${g()}</div>
        </div>
      </div>
    </div>`}a(v,"renderDesktop");function q(){let x=p.personalizedProfile(n.profile||{}),E=n.schedule&&n.schedule.courses||[],L=n.scores&&n.scores.passing&&n.scores.passing[0]||{summary:p.summarizeCourses([])},$=(n.scores&&n.scores.schemes||[])[n.activeSchemeIdx]||{summary:p.summarizeCourses([])},T=x.avatar?`<img src="${p.escapeHtml(x.avatar)}" alt="">`:`<span>${p.escapeHtml((x.name||"同")[0])}</span>`;if(n.mobileTab==="scores"){let j=`<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${u(L.summary,"passing")}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${u($.summary,"scheme")}</div>
      </div>`;return`<div class="uc-mobile"><div class="uc-card">${P(j)}</div></div>`}return n.mobileTab==="room"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${C()}</div></div></div>`:n.mobileTab==="more"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${g()}</div></div></div>`:`<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${T}</div>
        <div><div class="uc-name" data-urppp-private="name">${p.escapeHtml(x.name||"同学")}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${p.escapeHtml(x.majorPlan||"—")}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${p.escapeHtml(String(x.majorGpa||"—"))}</span></div></div>
      </div>${(()=>{try{return Ni()}catch{return""}})()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${p.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${n.loading.schedule?'<div class="uc-loading">课表加载中</div>':E.length?y(E):`<div class="uc-empty">${p.escapeHtml(n.schedule&&n.schedule.error||"暂无课表数据")}</div>`}${S()}</div></div></div>
    </div>`}a(q,"renderMobile");function C(){if(n.loading.room)return'<div class="uc-loading">教学楼加载中</div>';let x=n.catalog||[];return x.length?x.slice().sort((L,$)=>(/江安/.test(L.campus)?-1:0)-(/江安/.test($.campus)?-1:0)).map(L=>`
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${p.escapeHtml(L.campus)}</div>
        <div class="uc-build-grid">
          ${L.buildings.map($=>`<button type="button" data-build-path="${p.escapeHtml($.path)}" data-cn="${p.escapeHtml($.campusNumber||"")}" data-bn="${p.escapeHtml($.buildingNumber||"")}">${p.escapeHtml($.name)}</button>`).join("")}
        </div>
      </div>`).join(""):`<div class="uc-empty">${p.escapeHtml(n.roomError||"未读到教学楼列表")}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`}a(C,"roomPickerHtml");function f(x,E){if(!x||!x.rooms||!x.rooms.length)return'<div class="uc-empty">该楼暂无教室占用数据</div>';let L='<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';for(let I=1;I<=12;I++)L+=`<th class="sec">${I}</th>`;L+="</tr>";let $=x.rooms.map(I=>{let H=`<tr><th class="sticky">${p.escapeHtml(I.name)}</th><th class="sticky2">${p.escapeHtml(I.seats)}</th>`;for(let G=1;G<=12;G++){let U=(I.slots||[]).find(et=>et.section===G)||{busy:!1};if(U.busy){let et=U.reason||U.typeLabel||"占用",it=U.typeLabel||p.occupancyTypeLabel({occupancymoduleId:U.module}),bt=U.displayChar||p.firstContentChar(et)||p.firstContentChar(it)||"占",J=Object.assign({},U.detail||{room:I.name,section:G,reason:et},{reason:et,typeLabel:it,contentName:U.contentName||U.detail&&U.detail.contentName||""}),Q=p.escapeHtml(JSON.stringify(J));H+=`<td><button type="button" class="uc-slot busy ${p.occupancyKindClass(it)}" data-occ='${Q}' title="${p.escapeHtml(I.name)} 第${G}节 · ${p.escapeHtml(et)}">${p.escapeHtml(bt)}</button></td>`}else H+=`<td><div class="uc-slot free" title="${p.escapeHtml(I.name)} 第${G}节 · 空闲"></div></td>`}return H+"</tr>"}).join(""),T=Number(x.dateOffset!=null?x.dateOffset:n.roomDateOffset)||0,j=a((I,H)=>`<button type="button" class="uc-btn${T===I?" primary":""}" data-room-day="${I}">${H}</button>`,"dayBtn");return`
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${p.escapeHtml(E||"")}</div>
          <div class="uc-sub">${p.escapeHtml(x.dateLabel||"")}${x.jxzc?" · 教学第"+x.jxzc+"周":""}</div>
          <div class="uc-room-days">
            ${j(0,"今天")}
            ${j(1,"明天")}
            ${j(2,"后天")}
          </div>
        </div>
        <button type="button" class="uc-btn" id="uc-room-back">返回楼栋</button>
      </div>
      <div class="uc-legend">
        <span><i class="lg-busy"></i>有课</span>
        <span><i class="lg-exam"></i>考试</span>
        <span><i class="lg-lab"></i>实验</span>
        <span><i class="lg-borrow"></i>借用</span>
        <span><i class="lg-free"></i>空闲</span>
        <span class="uc-sub">色块为首字：有课/考试显示课程或考试名首字，点击查看详情</span>
      </div>
      <div class="uc-occ"><table class="uc-occ-table">${L}${$}</table></div>`}a(f,"occupancyHtml");function h(){let x=p.ensureRoot(),E=x.querySelector("#uc-body");p.getViewWeekNumber();let L=typeof window<"u"&&window.matchMedia?window.matchMedia:null,$=L&&L("(max-width:900px)").matches,T=!n.uiReady;E.innerHTML=$?q():v(),T?(n.uiReady=!0,x.classList.remove("uc-settled"),clearTimeout(x.__ucSettleTimer),x.__ucSettleTimer=setTimeout(()=>{n.open&&x.classList.add("uc-settled")},480)):x.classList.add("uc-settled"),p.bindUI(E),p.applyPersonalDisplay(E)}a(h,"render");function w(){if(!n.open||c)return;let x=a(()=>{c=0,n.open&&h()},"run"),E=typeof requestAnimationFrame=="function"?requestAnimationFrame:null;c=E?E(x):setTimeout(x,0)}return a(w,"scheduleRender"),{analysisHtml:k,metricHtml:u,occupancyHtml:f,render:h,renderScheduleBoard:y,roomPickerHtml:C,scheduleRender:w,scoreSectionHtml:P}}a(Oi,"createCleanModeRenderer");function Hi({state:n,deps:p}){function c(v,q){return!v||(v.__urpppCleanUiBindings||(v.__urpppCleanUiBindings=new Set),v.__urpppCleanUiBindings.has(q))?!1:(v.__urpppCleanUiBindings.add(q),!0)}a(c,"markCleanUiBound");function d(v){if(!v)return;try{p.bindScheduleExportHosts(v)}catch(C){console.warn("[URP++] schedule export menu",C)}v.querySelectorAll("[data-score]").forEach(C=>{c(C,"score")&&C.addEventListener("click",()=>A(C.getAttribute("data-score")))}),v.querySelectorAll("[data-sa-tab]").forEach(C=>{c(C,"saTab")&&C.addEventListener("click",()=>{n.scoreAnalysisTab=C.getAttribute("data-sa-tab")==="analysis"?"analysis":"overview",p.render()})}),v.querySelectorAll("[data-href]").forEach(C=>{c(C,"href")&&C.addEventListener("click",f=>{let h=C.getAttribute("data-href");h&&(f.preventDefault(),p.closeCleanMode(),location.href=h)})}),v.querySelectorAll("[data-eval-url]").forEach(C=>{c(C,"eval")&&C.addEventListener("click",f=>{let h=C.getAttribute("data-eval-url");h&&(f.preventDefault(),f.stopPropagation(),p.closeCleanMode(),location.href=h)})}),v.querySelectorAll('[data-action="room"]').forEach(C=>{c(C,"room")&&C.addEventListener("click",()=>y())}),v.querySelectorAll("[data-room-reload]").forEach(C=>{c(C,"roomReload")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),p.ensureRoomCatalogLoaded(!0)})}),v.querySelectorAll("[data-build-path]").forEach(C=>{c(C,"building")&&C.addEventListener("click",async()=>{let f=C.getAttribute("data-build-path"),h=(C.textContent||"").trim(),w=C.getAttribute("data-cn")||"",x=C.getAttribute("data-bn")||"",E=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;n.roomDateOffset=0,await g({path:f,name:h,campusNumber:w,buildingNumber:x,dateOffset:0},h,E)})}),v.querySelectorAll("[data-room-day]").forEach(C=>{c(C,"roomDay")&&C.addEventListener("click",async f=>{f.preventDefault(),f.stopPropagation();let h=parseInt(C.getAttribute("data-room-day")||"0",10)||0;if(!n.currentBuilding)return;n.roomDateOffset=h;let w=Object.assign({},n.currentBuilding,{dateOffset:h}),x=C.closest("#uc-room-panel")||C.closest("#uc-modal-body")||null;await g(w,w.name||"",x)})});let q=v.querySelector("#uc-room-back");q&&(q.onclick=()=>{n.occupancy=null,n.currentBuilding=null;let C=q.closest("#uc-room-panel")||document.querySelector("#uc-room-panel")||document.querySelector("#uc-modal-body");C&&C.id==="uc-modal-body"||C&&C.id==="uc-room-panel"?(C.innerHTML=p.roomPickerHtml(),d(C)):p.render()}),v.querySelectorAll(".uc-slot.busy[data-occ]").forEach(C=>{c(C,"occupancy")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();try{let h=JSON.parse(C.getAttribute("data-occ")||"{}");k("占用详情",`
            <div class="uc-occ-detail">
              <div class="uc-name">${p.escapeHtml(h.room||"")}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${p.escapeHtml(String(h.section||h.start||""))}${h.span>1?"-"+(Number(h.start||h.section)+Number(h.span)-1):""}节</div>
              <div class="uc-sub">占用类型：${p.escapeHtml(h.typeLabel||h.reason||"占用")}</div>
              <div class="uc-sub">具体内容：${p.escapeHtml(h.contentName||h.reason||"—")}</div>
              ${h.teacher?`<div class="uc-sub">教师：${p.escapeHtml(h.teacher)}</div>`:""}
              ${h.weeks?`<div class="uc-sub">周次：${p.escapeHtml(h.weeks)}</div>`:""}
              ${h.courseNo?`<div class="uc-sub">课程号：${p.escapeHtml(h.courseNo)}</div>`:""}
            </div>
          `,"",{stack:!0})}catch{}})}),v.querySelectorAll(".uc-lesson[data-course]").forEach(C=>{c(C,"course")&&C.addEventListener("click",f=>{f.stopPropagation();try{let h=JSON.parse(C.getAttribute("data-course")||"{}"),w=`第${h.section||"?"}${h.span>1?"-"+(Number(h.section)+Number(h.span)-1):""}节`,x=(h.others||[]).map(E=>`<div class="uc-course-sub ${E.thisWeek?"":"is-fade"}">
              <div class="uc-cd-name">${p.escapeHtml(E.name||"")}</div>
              <div class="uc-cd-meta">${p.escapeHtml([E.place,E.week,E.teacher].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${E.thisWeek?"当前周有课":"当前周无课"}</div>
            </div>`).join("");k("课程详情",`
            <div class="uc-course-detail">
              <div class="uc-cd-name">${p.escapeHtml(h.name||"")}</div>
              <div class="uc-cd-meta">${p.escapeHtml([h.place,h.teacher,h.week].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${h.thisWeek?"当前周有课":"当前周无课"} · ${p.escapeHtml(w)} · ${p.escapeHtml(p.DAY_NAMES[h.day]||"")}</div>
            </div>
            ${x?'<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>'+x:""}
          `,"")}catch{}})}),v.querySelectorAll("[data-week-delta]").forEach(C=>{c(C,"weekDelta")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation();let h=parseInt(C.getAttribute("data-week-delta")||"0",10)||0,w=n.schedule&&n.schedule.courses||[],x=p.inferMaxWeek(w),E=p.getViewWeekNumber();n.weekLocked=!0,n.viewWeek=Math.min(x,Math.max(1,E+h)),p.render();let L=document.querySelector("#urppp-clean-root .uc-week-label");L&&(L.classList.remove("uc-pop"),L.offsetWidth,L.classList.add("uc-pop"))})}),v.querySelectorAll("[data-week-reset]").forEach(C=>{c(C,"weekReset")&&C.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),n.weekLocked=!1;let h=p.getCurrentWeekNumber()||n._termWeek||1;n.viewWeek=h,p.render();let w=document.querySelector("#urppp-clean-root .uc-week-label");w&&(w.classList.remove("uc-pop"),w.offsetWidth,w.classList.add("uc-pop"))})})}a(d,"bindUI");let u=[];function k(v,q,C,f){f=f||{};let h=p.ensureRoot(),w=h.querySelector("#uc-mask"),x=h.querySelector("#uc-modal");f.stack&&x.classList.contains("open")?u.push({title:h.querySelector("#uc-modal-title").textContent,body:h.querySelector("#uc-modal-body").innerHTML,ft:h.querySelector("#uc-modal-ft").innerHTML}):f.stack||(u.length=0),w.classList.add("open"),x.classList.add("open"),h.querySelector("#uc-modal-title").textContent=v,h.querySelector("#uc-modal-body").innerHTML=q,h.querySelector("#uc-modal-ft").innerHTML=C||"",d(h.querySelector("#uc-modal-body")),d(h.querySelector("#uc-modal-ft")),p.applyPersonalDisplay(h.querySelector("#uc-modal"))}a(k,"openModal");function P(){let v=p.rootEl();if(v){if(u.length){let q=u.pop();v.querySelector("#uc-modal-title").textContent=q.title,v.querySelector("#uc-modal-body").innerHTML=q.body,v.querySelector("#uc-modal-ft").innerHTML=q.ft||"",d(v.querySelector("#uc-modal-body")),d(v.querySelector("#uc-modal-ft"));return}v.querySelector("#uc-mask").classList.remove("open"),v.querySelector("#uc-modal").classList.remove("open")}}a(P,"closeModal");function A(v){let q=n.scores&&n.scores.passing&&n.scores.passing[0]||{courses:[],summary:p.summarizeCourses([])},C=n.scores&&n.scores.schemes||[];v==="scheme"&&n.scores&&n.scores.majorIdx!=null&&n._schemeInited!==!0&&(n.activeSchemeIdx=n.scores.majorIdx||0,n._schemeInited=!0);let f=C[n.activeSchemeIdx]||C[0]||{courses:[],summary:p.summarizeCourses([]),title:"方案成绩"},h=v==="scheme"?f:q,w=v==="scheme"?"scheme":"passing";n.selected[w]||(n.selected[w]=new Set);let x=v==="scheme"&&C.length>1?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${C.map((Z,dt)=>`<button type="button" class="uc-btn ${dt===n.activeSchemeIdx?"primary":""}" data-scheme-idx="${dt}"><span data-urppp-private="organization">${p.escapeHtml((Z.title||"方案").slice(0,28))}</span></button>`).join("")}</div>`:"",E=a(Z=>{let dt=!!(Z&&(Z.unevaluated||p.isUnevaluatedScore(Z.score))),At=p.scoreToNumber(Z&&Z.score),kt="";dt?kt=At!=null&&At<60?"uneval-fail":"uneval":At!=null?kt=At>=60?"pass":"fail":/不及格|不合格|不通过/.test(String(Z&&Z.score||""))?kt="fail":Z&&Z.score&&(kt="pass");let Pt=p.escapeHtml(Z&&Z.score||"—"),B=dt?Z.evalUrl||"/student/teachingEvaluation/newEvaluation/index":"";return B?`<span class="uc-score-cell ${kt}" data-eval-url="${p.escapeHtml(B)}" title="未评教，点击前往评教">${Pt}</span>`:`<span class="uc-score-cell ${kt}">${Pt}</span>`},"scoreCellHtml"),L=(h.courses||[]).map((Z,dt)=>{let At=n.selected[w].has(dt),kt=p.isValidOfficialGpa(Z.officialGpa)?Z.officialGpa:p.scoreToGpa(Z.score),Pt=!!(Z.unevaluated||p.isUnevaluatedScore(Z.score));return`<tr class="${At?"is-on":""}${Pt?" is-uneval":""}" data-idx="${dt}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${At?"✓":""}</span><span class="uc-cname">${p.escapeHtml(Z.name)}</span></td>
        <td><span class="uc-attr-pill">${p.escapeHtml(Z.attr||"—")}</span></td>
        <td data-urppp-private="credit">${Z.credit}</td>
        <td data-urppp-private="grade">${E(Z)}</td>
        <td data-urppp-private="gpa">${Pt||kt==null?"—":kt}</td>
      </tr>`}).join("");k(v==="scheme"?"方案成绩 · "+(f.title||""):"全部及格成绩",`
      ${x}${p.metricHtml(h.summary,v==="scheme"?"scheme":"passing")}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${L||'<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`,'<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>');let $=document.querySelector("#uc-modal-title");$&&(v==="scheme"?$.setAttribute("data-urppp-private","organization"):$.removeAttribute("data-urppp-private"),p.applyPersonalDisplay($.parentElement||$));let T=document.querySelector("#uc-modal-body"),j=document.getElementById("uc-calc"),I=document.getElementById("uc-score-table"),H=document.getElementById("uc-score-wrap"),G=document.getElementById("uc-select-box"),U=a(()=>{I.querySelectorAll("tbody tr[data-idx]").forEach(At=>{let kt=parseInt(At.getAttribute("data-idx"),10),Pt=n.selected[w].has(kt);At.classList.toggle("is-on",Pt);let B=At.querySelector(".uc-selmark");B&&(B.textContent=Pt?"✓":"")});let Z=[];n.selected[w].forEach(At=>{h.courses[At]&&Z.push(h.courses[At])});let dt=p.summarizeCoursesPreferOfficial(Z);j&&(j.className="uc-calc",j.innerHTML=Z.length?`已选 <b>${Z.length}</b> 门 · 学分 <b data-urppp-private="credit">${dt.totalCredit}</b> · 均分 <b data-urppp-private="grade">${dt.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${dt.avgGpa}</b>`:"已选 0 门")},"paint"),et=a((Z,dt)=>{dt===!0?n.selected[w].add(Z):dt===!1||n.selected[w].has(Z)?n.selected[w].delete(Z):n.selected[w].add(Z)},"toggleIdx"),it=!1;I.querySelectorAll("tbody tr[data-idx]").forEach(Z=>{Z.addEventListener("click",dt=>{if(it){it=!1;return}let At=parseInt(Z.getAttribute("data-idx"),10);et(At),U()})});let bt=!1,J=0,Q=0,ot=null,X=a(()=>Array.from(I.querySelectorAll("tbody tr[data-idx]")),"rowsEls"),ct=a((Z,dt)=>{if(!G||!H)return{left:0,top:0,right:0,bottom:0,w:0,h:0};let At=H.getBoundingClientRect(),kt=Math.min(J,Z),Pt=Math.min(Q,dt),B=Math.max(J,Z),Y=Math.max(Q,dt),tt=B-kt,ft=Y-Pt,ht=kt-At.left+H.scrollLeft,Lt=Pt-At.top+H.scrollTop;return G.style.display=tt>3||ft>3?"block":"none",G.style.left=ht+"px",G.style.top=Lt+"px",G.style.width=tt+"px",G.style.height=ft+"px",{left:kt,top:Pt,right:B,bottom:Y,w:tt,h:ft}},"placeBox"),rt=a(Z=>{if(!bt)return;Z.preventDefault();let dt=ct(Z.clientX,Z.clientY);dt.w<=3&&dt.h<=3||(n.selected[w]=new Set(ot),X().forEach(At=>{let kt=At.getBoundingClientRect();if(!!(kt.right<dt.left||kt.left>dt.right||kt.bottom<dt.top||kt.top>dt.bottom))return;let B=parseInt(At.getAttribute("data-idx"),10);ot.has(B)?n.selected[w].delete(B):n.selected[w].add(B)}),U())},"onMoveSel"),st=a(Z=>{let dt=Math.abs(Z.clientX-J)>3||Math.abs(Z.clientY-Q)>3;bt=!1,G&&(G.style.display="none"),document.removeEventListener("mousemove",rt,!0),document.removeEventListener("mouseup",st,!0),dt&&(it=!0),U()},"onUpSel");H.addEventListener("mousedown",Z=>{Z.button===0&&(bt=!0,J=Z.clientX,Q=Z.clientY,ot=new Set(n.selected[w]),ct(J,Q),document.addEventListener("mousemove",rt,!0),document.addEventListener("mouseup",st,!0))}),T.querySelectorAll("[data-scheme-idx]").forEach(Z=>Z.addEventListener("click",()=>{n.activeSchemeIdx=parseInt(Z.getAttribute("data-scheme-idx"),10)||0,n._schemeUserSelected=!0,A("scheme")}));let xt=document.getElementById("uc-clear");xt&&(xt.onclick=()=>{n.selected[w]=new Set,U()}),U()}a(A,"openScoreModal");async function y(){k("空闲教室",'<div class="uc-loading">加载教学楼</div>',"");try{await p.ensureRoomCatalogLoaded(!1),k("空闲教室",p.roomPickerHtml(),'<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>')}catch(v){k("空闲教室",`<div class="uc-empty">${p.escapeHtml(v&&v.message||v)}</div>`,"")}}a(y,"openRoomModal");function S(v){if(v&&v.isConnected)return v;let q=document.querySelector("#uc-room-panel");if(q&&q.offsetParent!==null||q&&n.mobileTab==="room")return q;let C=document.querySelector("#uc-modal-body"),f=document.querySelector("#uc-modal");return f&&f.classList.contains("open")&&C?C:q||C||null}a(S,"getRoomHost");async function g(v,q,C){let f=S(C);if(!f){console.warn("[URP++] no room host");return}f.innerHTML='<div class="uc-loading">加载占用网格</div>';try{let h=await p.loadBuildingOccupancy(v);f.innerHTML='<div class="uc-loading">匹配课程名称</div>';let w=h.planNumber||"";if(!w)try{let L=await p.fetchText("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),$=JSON.parse(L);if(w=$&&($.zxjxjhh||$.xnxq||$.dateList&&$.dateList[0]&&$.dateList[0].zxjxjhh)||"",!w&&$&&$.xkxx&&$.xkxx[0]){let T=Object.keys($.xkxx[0]||{}),j=T.length?$.xkxx[0][T[0]]:null;w=j&&(j.zxjxjhh||j.executiveEducationPlanNumber)||""}}catch{}w||(w="2025-2026-2-1"),h.planNumber=w;try{h=await p.enrichOccupancyWithCurriculum(h,typeof v=="object"?v:{},w)}catch(L){console.warn("[URP++] enrich occupancy",L)}n.occupancy=h,n.roomDateOffset=Number(h.dateOffset!=null?h.dateOffset:n.roomDateOffset)||0;let x=typeof v=="object"?v:{path:v,name:q};n.currentBuilding=Object.assign({},x,{name:q||x.name||"",dateOffset:n.roomDateOffset}),q=q||v&&v.name||"";let E=S(f)||f;E.innerHTML=p.occupancyHtml(h,q),d(E)}catch(h){let w=S(f)||f;w&&(w.innerHTML=`<div class="uc-empty">${p.escapeHtml(h&&h.message||h)}</div>`)}}return a(g,"showBuilding"),{bindUI:d,closeModal:P,getRoomHost:S,openModal:k,openRoomModal:y,openScoreModal:A,showBuilding:g}}a(Hi,"createCleanModeUI");function Ri({state:n,deps:p}){function c(){return document.getElementById("urppp-clean-root")}a(c,"rootEl");function d(){p.ensureStyle();let y=c();if(y)return y;y=document.createElement("div"),y.id="urppp-clean-root",y.innerHTML=`
      <div class="uc-top">
        <div class="uc-top-left">
          <button type="button" class="uc-menu-toggle" id="uc-menu-toggle" title="侧边栏" aria-label="打开菜单" aria-expanded="false">
            <span class="urppp-menu-icon" aria-hidden="true">
              <svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false"><path d="M5 8h14"></path><path d="M5 16h10"></path></svg>
              <svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false"><path d="M7 7l10 10"></path><path d="M17 7 7 17"></path></svg>
            </span>
          </button>
          <div class="uc-top-theme" id="uc-top-theme">
            <button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>
            <button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>
            <button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>
            <button type="button" class="urppp-nav-settings" id="uc-settings" title="设置" aria-label="设置">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
          </div>
        </div>
        <div class="uc-top-actions">
          <button type="button" class="uc-btn" id="uc-refresh">${p.ico("refresh")}<span>刷新</span></button>
          <button type="button" class="uc-btn primary" id="uc-exit">${p.ico("exit")}<span>退出</span></button>
        </div>
      </div>
      <div class="uc-shell"><div class="uc-shell-inner" id="uc-body"></div></div>
      <div class="uc-tabbar" id="uc-tabbar">
        <button type="button" data-tab="home" class="ac">${p.ico("home")}<span>首页</span></button>
        <button type="button" data-tab="scores">${p.ico("score")}<span>成绩</span></button>
        <button type="button" data-tab="room">${p.ico("room")}<span>教室</span></button>
        <button type="button" data-tab="more">${p.ico("more")}<span>其他</span></button>
      </div>
      <div class="uc-mask" id="uc-mask"></div>
      <div class="uc-modal" id="uc-modal">
        <div class="uc-modal-hd"><span id="uc-modal-title">详情</span><button type="button" class="uc-btn" id="uc-modal-close">${p.ico("close")}</button></div>
        <div class="uc-modal-bd" id="uc-modal-body"></div>
        <div class="uc-modal-ft" id="uc-modal-ft"></div>
      </div>`,document.documentElement.appendChild(y),y.querySelector("#uc-exit").onclick=k,y.querySelector("#uc-refresh").onclick=()=>u(!0),y.querySelector("#uc-mask").onclick=p.closeModal,y.querySelector("#uc-modal-close").onclick=p.closeModal;let S=a(()=>{p.syncThemeDotGroup(y.querySelector("#uc-top-theme"))},"syncCleanThemeDots");y.querySelectorAll("#uc-top-theme .urppp-nav-dot[data-theme]").forEach(w=>{w.addEventListener("click",()=>{p.handleThemeDotClick(w.dataset.theme),S();try{p.syncNavbarThemeUI()}catch{}try{p.syncSettingsPanelUI()}catch{}})});let g=y.querySelector("#uc-settings");g&&g.addEventListener("click",w=>{w.preventDefault(),w.stopPropagation();try{p.openSettingsPanel()}catch{}});let v=y.querySelector("#uc-menu-toggle"),q=a(w=>{w.classList.remove("urppp-clean-sidebar");let x=w.__urpppCleanInline;if(x){let L=w.style,$=a((T,j)=>{let I=x[j];I&&I.v?L.setProperty(T,I.v,I.p||""):L.removeProperty(T)},"restore");$("top","top"),$("height","height"),$("z-index","z"),$("position","pos"),$("transform","transform"),$("visibility","vis"),$("pointer-events","pe"),$("transition","transition"),delete w.__urpppCleanInline}let E=w.__urpppCleanOrigin;E&&E.parent&&w.parentElement!==E.parent&&(E.next&&E.next.parentElement===E.parent?E.parent.insertBefore(w,E.next):E.parent.appendChild(w)),delete w.__urpppCleanOrigin},"restoreCleanSidebarInline"),C=a(()=>{let w=document.getElementById("sidebar");if(w)if(n.open){if(w.classList.add("urppp-clean-sidebar"),!w.__urpppCleanInline){let j=w.style,I=a(H=>({v:j.getPropertyValue(H),p:j.getPropertyPriority(H)}),"grab");w.__urpppCleanInline={top:I("top"),height:I("height"),z:I("z-index"),pos:I("position"),transform:I("transform"),vis:I("visibility"),pe:I("pointer-events"),transition:I("transition")},w.__urpppCleanOrigin={parent:w.parentElement,next:w.nextSibling}}if(w.parentElement!==y){let j=y.querySelector(".uc-shell");y.insertBefore(w,j||null)}let x=y.getBoundingClientRect(),E=y.querySelector(".uc-top"),L=E?E.getBoundingClientRect():null,$=Math.max(44,Math.round(L?L.bottom-x.top:60)),T=Math.max(0,Math.round(x.height-$));w.style.setProperty("top",$+"px","important"),w.style.setProperty("height",T+"px","important"),w.style.setProperty("z-index","12030","important"),w.style.setProperty("position","fixed","important")}else q(w)},"syncCleanSidebarZ"),f=a(()=>{let w=document.getElementById("sidebar");if(!w)return;try{p.stopDrawerAnimation(w)}catch{}w.classList.remove("display","urppp-drawer-closing"),q(w),v&&(v.setAttribute("aria-expanded","false"),v.setAttribute("aria-label","打开菜单"));let x=document.getElementById("urppp-mobile-menu-button");x&&(x.setAttribute("aria-expanded","false"),x.setAttribute("aria-label","打开菜单"))},"closeCleanSidebar");v&&v.addEventListener("click",w=>{w.preventDefault(),w.stopImmediatePropagation();let x=document.getElementById("sidebar");if(!x)return;x.__urpppCleanMenuBound||(x.__urpppCleanMenuBound=!0,x.addEventListener("click",$=>{if(!n.open)return;let T=$.target&&$.target.closest?$.target.closest("a[href]"):null;if(!T||T.closest("#urppp-mobile-search-panel"))return;let j=String(T.getAttribute("href")||"").trim();if(T.closest("#urppp-mobile-quick, #urppp-mobile-user")){if(!j||j==="#"||j.startsWith("javascript")||T.target==="_blank"||/^https?:\/\//i.test(j))return;k();return}!j||j==="#"||j.startsWith("javascript")||T.target==="_blank"||/^https?:\/\//i.test(j)||k()},!0));let E=!x.classList.contains("display");C(),p.setDrawerOpen(x,v,E);let L=document.getElementById("urppp-mobile-menu-button");L&&(L.setAttribute("aria-expanded",E?"true":"false"),L.setAttribute("aria-label",E?"关闭菜单":"打开菜单"))}),y.__closeCleanDrawer=f,y.__syncCleanSidebarZ=C,y.__syncCleanThemeDots=S;let h=globalThis.ResizeObserver;if(typeof h=="function"){let w=new h(()=>{n.open&&C()});w.observe(y);let x=y.querySelector(".uc-top");x&&w.observe(x),y.__cleanSidebarResizeObserver=w}try{let w=window.matchMedia&&window.matchMedia("(max-width: 900px)");if(w){let x=a(()=>{n.open&&(C(),p.render())},"onLayoutChange");typeof w.addEventListener=="function"?w.addEventListener("change",x):typeof w.addListener=="function"&&w.addListener(x),y.__scoreLayoutMedia=w,y.__scoreLayoutChange=x}}catch{}try{p.applySkinAttr()}catch{}return S(),y.querySelectorAll("#uc-tabbar button").forEach(w=>{w.onclick=()=>{n.mobileTab=w.dataset.tab,y.querySelectorAll("#uc-tabbar button").forEach(x=>x.classList.toggle("ac",x===w)),p.render(),n.mobileTab==="room"&&p.ensureRoomCatalogLoaded()}}),Io(),Fi(y),y}a(d,"ensureRoot");function u(y){d();let S=n.open;n.open=!0,n.uiReady=!1,n.weekLocked=!1;let g=p.getCurrentWeekNumber()||p.readRememberedTermWeek();n.viewWeek=g>=1?g:n.viewWeek>=1?n.viewWeek:0,document.documentElement.classList.add("urppp-clean-lock",p.CLEAN_FLAG);let v=c();v.classList.remove("closing"),S||(v.classList.remove("uc-settled","open"),v.offsetWidth,v.classList.add("open"));try{p.stopDrawerAnimation(document.getElementById("sidebar"))}catch{}try{v.__syncCleanThemeDots&&v.__syncCleanThemeDots()}catch{}try{v.__syncCleanSidebarZ&&v.__syncCleanSidebarZ()}catch{}try{p.injectCleanSidebarSections(document.getElementById("sidebar"))}catch{}p.loadAll(!!y);try{p.ensureRoomCatalogLoaded()}catch{}}a(u,"openCleanMode");function k(){n.open=!1,n.uiReady=!1,p.closeModal(),document.documentElement.classList.remove("urppp-clean-lock",p.CLEAN_FLAG);let y=c();if(y){y.classList.remove("open","uc-settled","uc-drawer-open"),y.classList.add("closing"),clearTimeout(y.__ucSettleTimer);try{y.__closeCleanDrawer&&y.__closeCleanDrawer()}catch{}setTimeout(()=>{y.classList.remove("closing")},360)}try{p.refreshMobileNavbar()}catch{}}a(k,"closeCleanMode");function P(){try{p.ensureStyle();let y=document.getElementById("urppp-nav-clean");if(!p.isHomePage()){y&&y.remove(),ji();return}let S=document.getElementById("urppp-nav-theme")||document.querySelector("#navbar .navbar-header")||document.querySelector("#navbar");if(!S)return;y||(y=document.createElement("button"),y.type="button",y.id="urppp-nav-clean",y.title="清爽模式",y.innerHTML=`${p.ico("clean")}<span>清爽</span>`,y.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),u(!1)}),S.appendChild(y)),Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none"}).forEach(([g,v])=>y.style.setProperty(g,v,"important")),Io();try{Di()}catch{}}catch(y){console.warn("[URP++] clean entry",y)}}return a(P,"injectCleanEntry"),{cleanModeApi:{open:u,close:k,inject:P,refresh:p.refreshCleanPersonalDisplay,refreshRender:a(()=>{try{p.render()}catch{}},"refreshRender"),scoreToGpa:p.scoreToGpa,summarizeCourses:p.summarizeCourses},closeCleanMode:k,ensureRoot:d,injectCleanEntry:P,openCleanMode:u,rootEl:c}}a(Ri,"createCleanModeController");function Ui({deps:n}){function p(){if(window.__urpppScheduleHoverNear)return;window.__urpppScheduleHoverNear=!0;let P=12,A=16,y=0,S=0,g=!1,v=0,q=a(()=>document.getElementById("schedule-hover"),"hoverEl"),C=a(w=>{if(!w||w.style&&w.style.display==="none")return!1;let x=window.getComputedStyle(w);return x.display!=="none"&&x.visibility!=="hidden"},"isShown"),f=a(()=>{let w=q();if(!w||!C(w)){g=!1;return}g=!0;let x=window.innerWidth||1200,E=window.innerHeight||800,L=y+P,$=S+A,T=Math.min(320,w.offsetWidth||280),j=Math.min(220,w.offsetHeight||160);L+T>x-8&&(L=x-T-8),$+j>E-8&&($=E-j-8),L<8&&(L=8),$<8&&($=8),w.style.setProperty("position","fixed","important"),w.style.setProperty("left",Math.round(L)+"px","important"),w.style.setProperty("top",Math.round($)+"px","important"),w.style.setProperty("right","auto","important"),w.style.setProperty("bottom","auto","important"),w.style.setProperty("margin","0","important"),w.style.setProperty("z-index","3000","important"),w.style.setProperty("pointer-events","none","important")},"place"),h=a(()=>{v||(v=requestAnimationFrame(()=>{v=0,f()}))},"schedulePlace");document.addEventListener("mousemove",w=>{if(y=w.clientX,S=w.clientY,!g){let x=q();x&&x.style&&x.style.display&&x.style.display!=="none"&&(g=!0)}g&&h()},!0),document.addEventListener("mouseover",w=>{w.target&&w.target.closest&&w.target.closest(".fc-event, .fc-time-grid-event")&&(y=w.clientX,S=w.clientY,setTimeout(()=>{g=!0,f()},0),setTimeout(f,40))},!0),document.addEventListener("mouseout",w=>{w.target&&w.target.closest&&w.target.closest(".fc-event, .fc-time-grid-event")&&setTimeout(()=>{let E=q();C(E)||(g=!1)},50)},!0)}a(p,"bindScheduleHoverNearCursor");function c(P){try{let A=!!(P&&P.force),y=typeof unsafeWindow<"u"&&unsafeWindow.jQuery?unsafeWindow.jQuery:window.jQuery||null;if(!y||!y.fn||!y.fn.fullCalendar)return!1;let S=document.getElementById("main-calendar")||document.querySelector("#urppp-left .fc, #urppp-dashboard .fc");if(!S)return!1;if(!A&&S.dataset.urpppFcSized==="1")return!0;let g=y(S);if(!(g.data("fullCalendar")||g.hasClass("fc")))return!1;let q=Array.from(S.querySelectorAll(".fc-scroller")).map(f=>({el:f,top:f.scrollTop,left:f.scrollLeft}));if(A||S.dataset.urpppFcRendered!=="1"){try{g.fullCalendar("render")}catch{}S.dataset.urpppFcRendered="1"}else try{g.fullCalendar("updateSize")}catch{}return requestAnimationFrame(()=>{q.forEach(f=>{try{f.el.scrollTop=f.top,f.el.scrollLeft=f.left}catch{}})}),(S.getBoundingClientRect().height||0)>=300&&(S.dataset.urpppFcSized="1"),!0}catch(A){return console.warn("[URP++] fullCalendar refresh failed",A),!1}}a(c,"refreshHomeFullCalendar");function d(){window.__urpppFcRefreshBound||(window.__urpppFcRefreshBound=!0,setTimeout(()=>c({force:!0}),0),setTimeout(()=>c({force:!1}),300))}a(d,"scheduleHomeFullCalendarRefresh");function u(P,A,y){let S=P.querySelector(".widget-header"),g=S?S.querySelector(".widget-toolbar"):null,v=document.createElement("div");v.className="urppp-card",v.innerHTML=`
      <div class="urppp-card-header">
        <h4>${y}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `,g&&(g.style.display="inline-block",v.querySelector(".urppp-card-tools").appendChild(g)),v.querySelector(".urppp-card-body").appendChild(P),A.appendChild(v)}a(u,"wrapWidget");function k(){try{p()}catch{}if(document.getElementById("urppp-dashboard"))return;let P=document.querySelector(".page-content");if(!P)return;let A=Array.from(P.querySelectorAll(".widget-box"));if(A.length<6)return;let y=A[4],S=y?Array.from(y.querySelectorAll(".infobox")):[],g=document.createElement("div");g.id="urppp-dashboard",g.innerHTML=`
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `,P.appendChild(g);let v=P.querySelector("#warningInfo");v&&document.body.appendChild(v),A.forEach(x=>{let E=x.closest('.widget-container-col, [class*="col-"]');E&&(E.style.display="none")}),P.querySelectorAll(":scope > .row").forEach(x=>{x.style.display="none"});let q=g.querySelector("#urppp-stats"),C=Math.max(S.length,5);for(let x=0;x<C;x++){let E=document.createElement("div");E.className="urppp-stat-card urppp-stat-skeleton",E.innerHTML='<div class="value">-</div><div class="label">加载中</div>',q.appendChild(E)}function f(){let x=y?Array.from(y.querySelectorAll(".infobox")):[];x.length!==0&&(q.innerHTML="",x.forEach(E=>{let L=E.innerText.trim().split(/\n+/).map(et=>et.trim()).filter(et=>et),$=L[0]||"",T=L.slice(1).join(" ").replace(/更多\.\.\./g,"").trim(),I=/[\u4e00-\u9fa5]/.test($)||$.length>5?"value urppp-stat-value-text":"value",H=E.closest("a"),G=document.createElement(H?"a":"div");H&&(G.href=H.href||"javascript:void(0)",G.onclick=H.onclick,G.style.textDecoration="none"),G.className="urppp-stat-card";let U=n.statCardPrivacyMarkup($,T);G.innerHTML=`<div class="${I}">${U.valueHtml}</div><div class="label">${U.labelHtml}</div>`,q.appendChild(G)}))}if(a(f,"updateStats"),f(),y){let x=new MutationObserver(()=>f());x.observe(y,{childList:!0,subtree:!0}),setTimeout(()=>x.disconnect(),5e3)}let h=g.querySelector("#urppp-left"),w=g.querySelector("#urppp-right");u(A[5],h,"我的日程安排"),u(A[0],w,"通知公告"),u(A[1],w,"我的待办任务"),u(A[2],w,"可申请业务"),u(A[3],w,"常用下载"),y&&(y.style.display="none"),d(),console.log("[URP++] 首页仪表板已重构")}return a(k,"rebuildDashboard"),{rebuildDashboard:k,refreshHomeFullCalendar:c,scheduleHomeFullCalendarRefresh:d,wrapWidget:u}}a(Ui,"createDashboardController");function Se(n){return Math.round((Number(n)||0)*100)/100}a(Se,"round2");var ld=[{key:"a",level:"A",range:"90-100",gpa:4,min:90,max:100},{key:"am",level:"A-",range:"85-89",gpa:3.7,min:85,max:89.999},{key:"bp",level:"B+",range:"82-84",gpa:3.3,min:82,max:84.999},{key:"b",level:"B",range:"78-81",gpa:3,min:78,max:81.999},{key:"bm",level:"B-",range:"75-77",gpa:2.7,min:75,max:77.999},{key:"cp",level:"C+",range:"72-74",gpa:2.3,min:72,max:74.999},{key:"c",level:"C",range:"68-71",gpa:2,min:68,max:71.999},{key:"cm",level:"C-",range:"64-67",gpa:1.7,min:64,max:67.999},{key:"dp",level:"D+",range:"60-63",gpa:1.3,min:60,max:63.999},{key:"d",level:"D",range:"60-62",gpa:1,min:60,max:62.999},{key:"f",level:"F",range:"<60",gpa:0,min:0,max:59.999}],Wi={优秀:95,"A+":98,A:95,"A-":87,良好:85,"B+":83,B:79,"B-":76,中等:73,"C+":73,C:69,"C-":65,及格:62,"D+":62,D:60,不及格:50,F:50},cd=[{key:"required",label:"必修",test:a(n=>/必修/.test(n),"test")},{key:"elective",label:"任选",test:a(n=>/任选/.test(n),"test")},{key:"optional",label:"选修",test:a(n=>/选修/.test(n),"test")},{key:"other",label:"其他",test:a(()=>!0,"test")}];function Gi(n){let p=String(n||"").match(/^(\d{4})-(\d{4})-(\d+)/);return p?`${p[1].slice(2)}-${p[2].slice(2)}-${p[3]}`:String(n||"")}a(Gi,"shortTerm");function ga({deps:n}){let p=n.scoreToNumber,c=n.scoreToGpa;function d(f){let h=p(f);if(h!=null)return h;let w=String(f||"").trim().toUpperCase();return Wi[w]!=null?Wi[w]:null}a(d,"scoreToNumberWithLevels");function u(f){return!f||f.unevaluated?!1:d(f.score)!=null}a(u,"hasScore");function k(f){let h=String(f||"").match(/^(\d{4})-(\d{4})-(\d+)/);return h?[Number(h[1]),Number(h[3])]:[9999,9999]}a(k,"termOrderKey");function P(f){let h=f&&f.passing&&f.passing[0];return h&&h.courses||[]}a(P,"allCourses");function A(f){let h=f&&f.officialGpa,w=Number(h);return h!=null&&Number.isFinite(w)&&w>=0&&w<=5?w:null}a(A,"officialGpa");function y(f){let h=A(f);return h??c(f.score)}a(y,"courseGpa");function S({scorePack:f,profile:h}){let w=P(f),x=h&&h.majorGpa?String(h.majorGpa).trim():"",E=0,L=0,$=0,T=0,j=0,I=0;return w.forEach(H=>{if(!u(H))return;let G=Number(H.credit)||0,U=d(H.score);if(U==null||G<=0)return;E+=G,L+=U*G;let et=y(H);et!=null&&($+=et*G,T+=G,H.required&&(j+=et*G,I+=G))}),{majorGpa:x,requiredGpa:Se(I?j/I:0),avgGpa:Se(T?$/T:0),avgScore:Se(E?L/E:0),totalCredit:Se(E),courseCount:w.length}}a(S,"computeMetrics");function g(f){let h=new Map;return(f||[]).forEach(w=>{if(!u(w))return;let x=w.term||"未分组",E=h.get(x);E||(E={term:x,count:0,credit:0,scoreW:0,gpaW:0,gpaCredit:0},h.set(x,E));let L=Number(w.credit)||0,$=d(w.score);if($==null||(E.count+=1,L<=0))return;E.credit+=L,E.scoreW+=$*L;let T=y(w);T!=null&&(E.gpaW+=T*L,E.gpaCredit+=L)}),Array.from(h.values()).map(w=>({term:w.term,label:Gi(w.term),count:w.count,credit:Se(w.credit),avgScore:Se(w.credit?w.scoreW/w.credit:0),avgGpa:Se(w.gpaCredit?w.gpaW/w.gpaCredit:0)})).sort((w,x)=>{let E=k(w.term),L=k(x.term);return E[0]-L[0]||E[1]-L[1]})}a(g,"computeTrend");function v(f){let h=ld.map(x=>({...x,count:0,credit:0}));(f||[]).forEach(x=>{if(!u(x))return;let E=d(x.score);if(E==null)return;let L=h.find($=>E>=$.min&&E<=$.max);L&&(L.count+=1,L.credit+=Number(x.credit)||0)});let w=h.reduce((x,E)=>Math.max(x,E.count),1);return h.map(x=>({...x,ratio:Math.round(x.count/w*100)}))}a(v,"computeBands");function q(f){let h=cd.map(L=>({...L,credit:0,count:0}));(f||[]).forEach(L=>{if(!u(L))return;let $=String(L.attr||""),T=h.find(j=>j.test($));T&&(T.credit+=Number(L.credit)||0,T.count+=1)});let w=h.reduce((L,$)=>L+$.credit,0)||1,x=h.filter(L=>L.count>0).map(L=>({key:L.key,label:L.label,credit:Se(L.credit),count:L.count,ratio:Math.round(L.credit/w*100)})),E=x.find(L=>L.key==="required");return{items:x,requiredCredit:E?E.credit:0,requiredRatio:E?E.ratio:0}}a(q,"computeShare");function C({scorePack:f,profile:h}){let w=P(f);return{metrics:S({scorePack:f,profile:h}),trend:g(w),bands:v(w),share:q(w),empty:w.length===0}}return a(C,"analyzeScores"),{analyzeScores:C,hasScore:u,officialGpa:A,scoreToNumberWithLevels:d,shortTerm:Gi}}a(ga,"createScoreAnalysisData");var le="var(--text-secondary)",Bo="var(--border)";function ce(n){return at(String(n??""))}a(ce,"escapeLabel");function Vi(n,p,c){let d=!!(n&&n.variant==="mobile");if(p==="trend"){if(!d)return{mobile:d,width:920,height:330,pad:{top:36,right:30,bottom:46,left:30}};let P={top:58,right:20,bottom:44,left:20},A=Math.max(56,Number(n&&n.slotWidth)||72);return{mobile:d,width:Math.max(300,P.left+P.right+Math.max(1,c)*A),height:286,pad:P}}if(!d)return{mobile:d,width:660,height:236,pad:{top:28,right:14,bottom:44,left:14}};let u={top:28,right:14,bottom:44,left:14},k=Math.max(44,Number(n&&n.slotWidth)||48);return{mobile:d,width:Math.max(320,u.left+u.right+Math.max(1,c)*k),height:236,pad:u}}a(Vi,"resolveChartLayout");function No({width:n,height:p,mobile:c,kind:d,label:u}){let k=c?` data-urppp-chart-layout="mobile" style="width:max(100%,${n}px);max-width:none;height:auto"`:"";return`<svg viewBox="0 0 ${n} ${p}" class="urppp-sa-chart" role="img" aria-label="${u}" data-urppp-chart-kind="${d}"${k}>`}a(No,"openSvg");function xa({trend:n,palette:p,layout:c}){let d=(n||[]).filter(rt=>rt&&rt.avgScore!=null),u=Vi(c,"trend",d.length),{width:k,height:P,pad:A,mobile:y}=u,S=k-A.left-A.right,g=P-A.top-A.bottom;if(!d.length)return`${No({...u,kind:"trend",label:"学期成绩趋势"})}</svg>`;let v=d.length,q=a(rt=>A.left+(rt+.5)*(S/v),"xAt"),C=d.map(rt=>Number(rt.avgGpa)||0),f=d.map(rt=>Number(rt.avgScore)||0),h=d.map(rt=>Number(rt.credit)||0),w=Math.max(0,Math.min(...C)-.2),x=Math.min(5,Math.max(...C)+.2),E=Math.max(0,Math.min(...f)-4),L=Math.min(100,Math.max(...f)+4),$=Math.max(1,...h),T=x-w||1,j=L-E||1,I=a(rt=>A.top+g-(rt-w)/T*g,"yGpa"),H=a(rt=>A.top+g-(rt-E)/j*g,"yScore"),G=a(rt=>A.top+g-rt/$*g*.9,"yCredit"),U=d.map((rt,st)=>`${q(st)},${I(rt.avgGpa)}`).join(" "),et=d.map((rt,st)=>`${q(st)},${H(rt.avgScore)}`).join(" "),it=[0,.25,.5,.75,1].map(rt=>{let st=A.top+g-rt*g;return`<line x1="${A.left}" y1="${st.toFixed(1)}" x2="${k-A.right}" y2="${st.toFixed(1)}" stroke="${Bo}" stroke-width="1" stroke-dasharray="3 4"/>`}).join(""),bt=d.map((rt,st)=>{let xt=q(st),Z=y?Math.min(30,S/v*.42):Math.min(26,S/v*.32),dt=G(rt.credit);return`<rect x="${(xt-Z/2).toFixed(1)}" y="${dt.toFixed(1)}" width="${Z.toFixed(1)}" height="${(A.top+g-dt).toFixed(1)}" rx="3" fill="${p.credit}" opacity="0.55"/>
<text x="${xt.toFixed(1)}" y="${(dt-4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${le}">${ce(rt.credit)}</text>`}).join(""),J=d.map((rt,st)=>`<text x="${q(st).toFixed(1)}" y="${P-16}" text-anchor="middle" font-size="12" fill="${le}">${ce(rt.label)}</text>`).join(""),Q=d.map((rt,st)=>{let xt=S/v,Z=q(st)-xt/2,dt=[`学期 ${rt.label}`,`课程 ${rt.count} 门`,`修读学分 ${rt.credit}`,`加权均分 ${rt.avgScore}`,`平均绩点 ${rt.avgGpa}`].join(`
`);return`<rect class="urppp-sa-hover" x="${Z.toFixed(1)}" y="${A.top}" width="${xt.toFixed(1)}" height="${g.toFixed(1)}" fill="transparent"><title>${ce(dt)}</title></rect>`}).join(""),ot=d.map((rt,st)=>`<circle cx="${q(st).toFixed(1)}" cy="${I(rt.avgGpa).toFixed(1)}" r="3.5" fill="${p.gpaLine}"/><text x="${q(st).toFixed(1)}" y="${(I(rt.avgGpa)-9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${p.gpaLine}">${ce(rt.avgGpa)}</text>`).join(""),X=d.map((rt,st)=>`<circle cx="${q(st).toFixed(1)}" cy="${H(rt.avgScore).toFixed(1)}" r="3" fill="${p.scoreLine}"/><text x="${q(st).toFixed(1)}" y="${(H(rt.avgScore)+17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${p.scoreLine}">${ce(rt.avgScore)}</text>`).join(""),ct=y?`<g font-size="12">
  <rect x="${A.left}" y="30" width="12" height="12" rx="3" fill="${p.gpaLine}"/><text x="${A.left+18}" y="40" fill="${le}">学期平均绩点</text>
  <rect x="${A.left+132}" y="30" width="12" height="12" rx="3" fill="${p.scoreLine}"/><text x="${A.left+150}" y="40" fill="${le}">加权均分</text>
</g>`:`<g font-size="12">
  <rect x="${k-A.right-176}" y="8" width="12" height="12" rx="3" fill="${p.gpaLine}"/><text x="${k-A.right-158}" y="18" fill="${le}">学期平均绩点</text>
  <rect x="${k-A.right-82}" y="8" width="12" height="12" rx="3" fill="${p.scoreLine}"/><text x="${k-A.right-64}" y="18" fill="${le}">加权均分</text>
</g>`;return`${No({...u,kind:"trend",label:"学期成绩趋势"})}
${it}
${bt}
<g>${Q}</g>
<text x="${A.left}" y="18" font-size="12" fill="${le}">每学期修读学分（柱）</text>
<g stroke="${p.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${U}"/></g>
<g stroke="${p.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${et}"/></g>
<g>${ot}</g>
<g>${X}</g>
<g>${J}</g>
${ct}
</svg>`}a(xa,"trendChartSvg");function ya({bands:n,palette:p,layout:c}){let d=n||[],u=Vi(c,"bands",d.length),{width:k,height:P,pad:A,mobile:y}=u,S=k-A.left-A.right,g=P-A.top-A.bottom,v=d.length||1,q=Math.max(1,...d.map(h=>h.count)),C=y?Math.min(32,S/v*.62):Math.min(40,S/v*.52),f=d.map((h,w)=>{let x=A.left+(w+.5)*(S/v),E=h.count?Math.max(8,h.count/q*g):0,L=A.top+g-E,$=(.4+(1-w/(v-1))*.6).toFixed(2),T=h.range||(h.min===0?"<60":`${h.min}-${h.max===100?"100":h.max}`),j=[`${h.level||""}（绩点 ${h.gpa}）`,`百分制 ${T}`,`课程 ${h.count} 门`].join(`
`);return`<rect class="urppp-sa-band" x="${(x-C/2).toFixed(1)}" y="${L.toFixed(1)}" width="${C.toFixed(1)}" height="${E.toFixed(1)}" rx="4" fill="${p.primary}" opacity="${$}"><title>${ce(j)}</title></rect>
<text x="${x.toFixed(1)}" y="${(L-6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${ce(h.count)}</text>
<text x="${x.toFixed(1)}" y="${P-26}" text-anchor="middle" font-size="11" font-weight="600" fill="${le}">${ce(T)}</text>
<text x="${x.toFixed(1)}" y="${P-12}" text-anchor="middle" font-size="12" fill="${le}">${ce(h.gpa)}</text>`}).join("");return`${No({...u,kind:"bands",label:"成绩分段分布"})}
<line x1="${A.left}" y1="${(A.top+g).toFixed(1)}" x2="${k-A.right}" y2="${(A.top+g).toFixed(1)}" stroke="${Bo}" stroke-width="1"/>
${f}
</svg>`}a(ya,"bandsChartSvg");function Ji({items:n,requiredRatio:p,palette:c}){let A=2*Math.PI*56,y=(n||[]).filter(q=>q&&q.ratio>0),S=Math.max(0,Math.min(100,Math.round(Number(p)||0)));if(!y.length)return'<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>';let g=-90,v=y.map(q=>{let C=q.ratio/100*A,h=`<circle cx="75" cy="75" r="56" fill="none" stroke="${c.share&&c.share[q.key]||c.required}" stroke-width="24"
  stroke-dasharray="${C.toFixed(2)} ${A.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${g.toFixed(2)} 75 75)"/>`;return g+=q.ratio/100*360,h}).join("");return`<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="75" cy="75" r="56" fill="none" stroke="${Bo}" stroke-width="24"/>
${v}
<text x="75" y="69" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${ce(S)}%</text>
<text x="75" y="91" text-anchor="middle" font-size="11.5" fill="${le}">必修学分占比</text>
</svg>`}a(Ji,"donutSvg");var dd=Object.freeze({gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)",share:Object.freeze({required:"var(--primary)",elective:"var(--text-muted)",optional:"var(--text-secondary)",other:"var(--border)"})}),ud='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>',md='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';function Yi({deps:n}){let p=n&&n.palette||dd;function c(){return`<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${ud}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${md}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`}a(c,"panelShellHtml");function d(){return'<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>'}a(d,"loadingHtml");function u(S){return`<div class="urppp-sa-error">${at(String(S||"成绩数据加载失败"))}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`}a(u,"errorHtml");function k(S){return[{label:"主修必修绩点",value:S.requiredGpa>0?String(S.requiredGpa):"—",hint:"必修课程加权"},{label:"平均绩点",value:S.avgGpa!=null?String(S.avgGpa):"—",hint:"全部及格加权"},{label:"加权均分",value:S.avgScore!=null?String(S.avgScore):"—",hint:"学分加权"},{label:"已修学分",value:S.totalCredit!=null?String(S.totalCredit):"—",hint:"及格课程学分"},{label:"已修课程",value:String(S.courseCount||0),hint:"含未评估"}].map(v=>`<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${at(v.value)}</div>
  <div class="urppp-sa-metric-label">${at(v.label)}</div>
  <div class="urppp-sa-metric-hint">${at(v.hint)}</div>
</div>`).join("")}a(k,"metricCards");function P(S){return`<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${(S||[]).map(v=>`<tr><td>${at(v.label)}</td><td>${at(v.count)}</td><td>${at(v.credit)}</td><td>${at(v.avgScore)}</td><td>${at(v.avgGpa)}</td></tr>`).join("")}</tbody></table>`}a(P,"detailTable");function A(S){return(S||[]).map(g=>`<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${p.share&&p.share[g.key]||p.primary}"></i>${at(g.label)} ${at(g.credit)} 学分 · ${at(g.count)} 门</div>`).join("")}a(A,"shareLegend");function y(S,g={}){if(!S||S.empty)return'<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';let v=S.share||{items:[],requiredRatio:0},q=g.chartLayout||null;return`<div class="urppp-sa-metrics">${k(S.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    <div class="urppp-sa-chart-scroll">${xa({trend:S.trend,palette:p,layout:q})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${Ji({items:v.items,requiredRatio:v.requiredRatio,palette:p})}</div>
      <div class="urppp-sa-legend">${A(v.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    <div class="urppp-sa-chart-scroll">${ya({bands:S.bands,palette:p,layout:q})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${P(S.trend)}
  </section>
</div>`}return a(y,"analysisHtml"),{panelShellHtml:c,loadingHtml:d,errorHtml:u,analysisHtml:y,palette:p}}a(Yi,"createScoreAnalysisRenderer");function Qi(){function n(p,c){let d=p.querySelector(".urppp-sa-toggle"),u=p.querySelector("[data-urppp-sa-body]");if(!d||!u)return{isExpanded:a(()=>!1,"isExpanded"),setExpanded:a(()=>{},"setExpanded"),syncShareLayout:a(()=>{},"syncShareLayout")};let k=a(A=>{let y=A?"expanded":"collapsed";p.dataset.urpppSaState=y,d.setAttribute("aria-expanded",String(A)),u.hidden=!A,A&&typeof c.onExpand=="function"&&c.onExpand()},"setExpanded");d.addEventListener("click",()=>{let A=d.getAttribute("aria-expanded")==="true";k(!A)}),u.addEventListener("click",A=>{let y=A.target;y&&y.closest&&y.closest("[data-urppp-sa-retry]")&&typeof c.onRetry=="function"&&c.onRetry()});function P(){let A=p.querySelector(".urppp-sa-donut"),y=p.querySelector(".urppp-sa-legend"),S=!!(A&&y&&y.getBoundingClientRect().top>=A.getBoundingClientRect().bottom);p.classList.toggle("urppp-sa-share-stacked",S)}return a(P,"syncShareLayout"),{setExpanded:k,syncShareLayout:P,isExpanded:a(()=>d.getAttribute("aria-expanded")==="true","isExpanded")}}return a(n,"bindPanel"),{bindPanel:n}}a(Qi,"createScoreAnalysisUI");var Xi="urppp-score-analysis";function Ki({deps:n}){let p=ga({deps:n}),c=Yi({deps:n}),d=Qi(),u=null,k="idle",P=null,A=null,y=null,S=!1,g=0,v="desktop";function q(){if(!n.styles||document.getElementById("urppp-score-analysis-style"))return;let U=document.createElement("style");U.id="urppp-score-analysis-style",U.textContent=n.styles,(document.head||document.documentElement).appendChild(U)}a(q,"ensureStyle");function C(){if(typeof n.getInsertHost=="function"){let U=n.getInsertHost();if(U)return U}return document.querySelector(".page-content")||document.getElementById("page-content-template")||document.body}a(C,"findHost");function f(){return u&&u.querySelector("[data-urppp-sa-content]")}a(f,"contentEl");function h(){return P||(k="loading",P=(async()=>{try{let[U,et]=await Promise.all([n.loadScores(),n.loadProfile()]);if(U&&U.error)throw new Error(U.error);let it=p.analyzeScores({scorePack:U,profile:et});return A=it,k="ready",it}catch(U){throw k="error",U}finally{P=null}})(),P)}a(h,"startLoad");function w(){k==="idle"&&h().catch(()=>{})}a(w,"warmup");function x(){if(y&&typeof y.syncShareLayout=="function")try{y.syncShareLayout()}catch{}}a(x,"syncShareLayout");function E(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return{variant:"mobile"}}catch{}return null}a(E,"currentChartLayout");function L(){let U=f();if(!U||!A)return;let et=E();v=et?et.variant:"desktop",U.innerHTML=c.analysisHtml(A,{chartLayout:et}),x()}a(L,"renderReadyAnalysis");function $(){clearTimeout(g),g=setTimeout(()=>{if(x(),!A||!y||!y.isExpanded())return;let U=E();(U?U.variant:"desktop")!==v&&L()},120)}a($,"handleResize");function T(){S||(S=!0,window.addEventListener("resize",$))}a(T,"bindResize");function j(){S&&(S=!1,clearTimeout(g),g=0,window.removeEventListener("resize",$))}a(j,"unbindResize");async function I(){let U=f();if(U){if(k==="ready"&&A){L();return}U.innerHTML=c.loadingHtml();try{await h(),L()}catch(et){U.innerHTML=c.errorHtml(et&&et.message||String(et))}}}a(I,"handleExpand");function H(){if(q(),u&&u.isConnected)return u;if(document.getElementById(Xi))return document.getElementById(Xi);let U=C();if(!U)return null;let et=document.createElement("div");return et.innerHTML=c.panelShellHtml(),u=et.firstElementChild,U.insertBefore(u,U.firstChild),y=d.bindPanel(u,{onExpand:I,onRetry:I}),T(),w(),n.shouldAutoExpand&&n.shouldAutoExpand()&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:bt=>setTimeout(bt,0))(()=>{try{y.setExpanded(!0)}catch{}}),u}a(H,"mount");function G(){j(),u&&u.isConnected&&u.remove(),u=null,y=null,k="idle",P=null,A=null,v="desktop"}return a(G,"unmount"),{mount:H,unmount:G,getPanel:a(()=>u,"getPanel"),reset:G}}a(Ki,"createScoreAnalysisController");function Zi({documentRef:n=document,locationRef:p=location,windowRef:c=window}){function d(S){return String(S||"").replace(/[\u00a0\s]+/g," ").replace(/^[>\u25b8\u203a·•\u00bb]+/,"").replace(/^\s*[\u25b8>]\s*/,"").trim()}a(d,"cleanMenuLabel");function u(S){if(!S)return"";let g=S.querySelector(":scope > a");if(!g)return"";let v=g.querySelector(".menu-text, .urppp-nav-text");if(v)return d(v.textContent);let q=g.cloneNode(!0);return q.querySelectorAll("i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow").forEach(C=>C.remove()),d(q.textContent)}a(u,"getMenuLiLabel");function k(S){let g=[],v=S,q=n.getElementById("menus")||n.getElementById("urppp-menus");for(;v&&v!==q;){if(v.tagName==="LI"){let C=u(v);C&&!/^(首页|一级菜单|二级菜单|三级菜单)$/.test(C)&&g.unshift(C)}v=v.parentElement}return g.filter((C,f)=>C&&C!==g[f-1])}a(k,"walkMenuAncestors");function P(){let S=p.pathname.replace(/\/+$/,"")||"/",g=p.search||"",v=[];return[n.getElementById("menus"),n.getElementById("urppp-menus")].filter(Boolean).forEach(C=>{C.querySelectorAll("a[href]").forEach(f=>{let h=f.getAttribute("href")||"";if(!(!h||h==="#"||h.startsWith("javascript")))try{let w=new URL(h,p.origin),x=w.pathname.replace(/\/+$/,"")||"/";if(x==="/"&&S!=="/")return;let E=0;S===x?E=1e3+x.length:S.startsWith(x+"/")?E=500+x.length:S.includes(x)&&x.length>8&&(E=200+x.length),E&&g&&w.search&&g.indexOf(w.search.slice(1))>=0&&(E+=50),E>0&&v.push({score:E,li:f.closest("li")})}catch{}})}),v.sort((C,f)=>f.score-C.score),v.length?v[0].li:null}a(P,"findMenuLiByPath");function A(){let S=P();if(S){let h=k(S);if(h.length)return h}let g="";try{let h=n.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);h&&(g=decodeURIComponent(h[1]))}catch{}if(g&&g!=="0"){let h=n.getElementById(g);if(h){let w=k(h);if(w.length)return w}}let v=null,q=Array.from(n.querySelectorAll("#menus li.active"));if(q.length){v=q[q.length-1];for(let h=q.length-1;h>=0;h--)if(!q[h].querySelector("li.active")){v=q[h];break}}if(!v){let h=Array.from(n.querySelectorAll("#urppp-menus .urppp-nav-item.active"));if(h.length){v=h[h.length-1];for(let w=h.length-1;w>=0;w--)if(!h[w].querySelector(".urppp-nav-item.active")){v=h[w];break}}}if(v){let h=k(v);if(h.length)return h}let C=n.getElementById("breadcrumbs")||n.querySelector(".breadcrumbs"),f=C&&(C.querySelector("ul.breadcrumb")||C.querySelector(".breadcrumb"));if(f){let h=[];if(Array.from(f.children).forEach((w,x)=>{if(x===0)return;let E=d(w.textContent);!E||/^(首页|一级菜单|二级菜单|三级菜单)$/.test(E)||h[h.length-1]!==E&&h.push(E)}),h.length)return h}return[]}a(A,"getBreadcrumbTrail");function y(){let S=n.getElementById("breadcrumbs")||n.querySelector(".breadcrumbs");if(!S)return;S.classList.remove("hide"),S.style.removeProperty("display"),S.style.setProperty("display","flex","important");let g=S.querySelector("ul.breadcrumb")||S.querySelector(".breadcrumb");g||(g=n.createElement("ul"),g.className="breadcrumb",S.appendChild(g));let v=A();if(!v.length&&Array.from(g.children).map(h=>d(h.textContent)).filter(Boolean).some(h=>h!=="首页"&&!/^(一级菜单|二级菜单|三级菜单)$/.test(h)))return;g.innerHTML="";let q=n.createElement("li");q.style.cursor="pointer",q.innerHTML='<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>',q.addEventListener("click",()=>{c.location.href="/"}),g.appendChild(q),v.forEach((C,f)=>{let h=n.createElement("li");f===v.length-1&&h.classList.add("active");let w=n.createElement("span");w.className="urppp-bc-label",w.textContent=C,h.appendChild(w),g.appendChild(h)})}return a(y,"beautifyBreadcrumbs"),{beautifyBreadcrumbs:y}}a(Zi,"createBreadcrumbController");function ts({documentRef:n=document,windowRef:p=window,MutationObserverRef:c=MutationObserver,nodeTypeRef:d=Node}){function u(){try{let A=n.getElementById("sidebar"),y=n.querySelectorAll(".main-content");if(!y.length)return;let S=p.matchMedia&&p.matchMedia("(max-width: 991px)").matches,g="260px";S?g="0px":A&&(g=A.classList.contains("menu-min")?"50px":"260px"),y.forEach(v=>v.style.setProperty("margin-left",g,"important"))}catch{}}a(u,"syncMobileContentOffset");function k(){try{let A=n.getElementById("sidebar"),y=n.querySelector("#navbar, .navbar.navbar-default, .navbar-fixed-top");if(!A||!y||A.classList.contains("urppp-clean-sidebar"))return;let S=y.getBoundingClientRect(),g=Math.max(45,Math.round(S.height||y.offsetHeight||45));n.documentElement.style.setProperty("--urppp-navbar-height",g+"px"),A.style.setProperty("top",g+"px","important"),A.style.setProperty("height","calc(100vh - "+g+"px)","important"),A.style.setProperty("margin-top","0","important"),y.style.setProperty("z-index","1100","important"),A.style.setProperty("z-index","1030","important"),u()}catch{}}a(k,"syncSidebarUnderNavbar");function P(){let A=n.getElementById("sidebar"),y=n.getElementById("menus");if(!A||!y)return;if(p.__urpppSidebarMenuObserver){try{p.__urpppSidebarMenuObserver.disconnect()}catch{}p.__urpppSidebarMenuObserver=null}let S=n.getElementById("urppp-menus"),g=A.querySelector(".urppp-sidebar-header");S&&S.remove(),g&&g.remove(),k();let v=new Set;y.querySelectorAll("li.active").forEach(I=>{I.id&&v.add(I.id)});function q(I){return Array.from(I.children).filter(H=>H.tagName==="LI").map(H=>{let G=H.querySelector(":scope > a"),U=G?.querySelector(".menu-text"),et=U?U.textContent.trim():G?Array.from(G.childNodes).filter(st=>st.nodeType===d.TEXT_NODE).map(st=>st.textContent).join("").trim():"",it=G?.querySelector(".menu-icon"),bt=it?Array.from(it.classList).filter(st=>st!=="menu-icon").join(" "):"",J=H.querySelector(":scope > .submenu"),Q=J?q(J):[];Q=Q.filter(st=>st.text&&(st.text.trim()||st.href&&st.href!=="#"));let ot=G?.getAttribute("href")||"#",X=G?.getAttribute("target")||"",ct=H.getAttribute("onclick")||G?.getAttribute("onclick")||"",rt=H.id;return ot!=="#"&&!ot.startsWith("javascript")?{id:rt,text:et,iconClass:bt,children:[],href:ot,target:X,onclick:ct}:Q.length===1&&Q[0].children.length===0?{id:rt||Q[0].id,text:et,iconClass:bt||Q[0].iconClass,children:[],href:Q[0].href||ot,target:Q[0].target||X,onclick:Q[0].onclick||ct}:{id:rt,text:et,iconClass:bt,children:Q,href:ot,target:X,onclick:ct}})}a(q,"parseMenu");let C=q(y);y.style.display="none";let f=n.createElement("div");f.className="urppp-sidebar-header",f.style.cssText="position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)";let h=n.createElement("button");h.type="button",h.className="urppp-sidebar-toggle",h.innerHTML='<i class="fa fa-angle-left" aria-hidden="true"></i>',h.title="收起侧边栏",typeof h.setAttribute=="function"&&h.setAttribute("aria-label","收起侧边栏");let w=a(()=>!!(p.matchMedia&&p.matchMedia("(max-width: 991px)").matches),"isNarrow"),x=a(I=>{if(I&&(I.preventDefault(),I.stopPropagation()),w()){A.classList.remove("display"),u();return}let H=n.getElementById("sidebar-collapse");H&&H.click()},"doToggle");h.addEventListener("click",x),f.appendChild(h);let E=a(()=>{let I=w(),H=n.body.classList.contains("menu-min")||A.classList.contains("menu-min"),G=I?"关闭菜单":H?"展开侧边栏":"收起侧边栏";h.innerHTML=I?'<i class="fa fa-times" aria-hidden="true"></i>':H?'<i class="fa fa-angle-right" aria-hidden="true"></i>':'<i class="fa fa-angle-left" aria-hidden="true"></i>',h.title=G,typeof h.setAttribute=="function"&&h.setAttribute("aria-label",G),!I&&H?(f.style.justifyContent="center",f.style.padding="12px 0"):(f.style.justifyContent="flex-end",f.style.padding="")},"syncToggle"),L=new c(E);L.observe(n.body,{attributes:!0,attributeFilter:["class"]}),L.observe(A,{attributes:!0,attributeFilter:["class"]}),p.__urpppSidebarMenuObserver=L,E();let $=n.createElement("ul");$.id="urppp-menus",$.style.cssText="margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)";function T(I){n.querySelectorAll("#urppp-menus .urppp-nav-item").forEach(G=>G.classList.remove("active"));let H=I;for(;H&&H.id!=="urppp-menus";)H.classList.contains("urppp-nav-item")&&H.classList.add("active"),H=H.parentElement}a(T,"setActiveBranch");function j(I,H){let G=n.createElement("li");G.className="urppp-nav-item",I.id&&(G.id=I.id);let U=I.children.length>0,et=I.href||"#",it=et!=="#"&&!et.startsWith("javascript"),bt=n.createElement("a");if(bt.className="urppp-nav-link",bt.href=it?et:"javascript:void(0)",I.target&&bt.setAttribute("target",I.target),I.iconClass){let Q=n.createElement("i");I.iconClass.split(" ").forEach(ot=>{ot&&Q.classList.add(ot)}),bt.appendChild(Q)}let J=n.createElement("span");if(J.className="urppp-nav-text",J.textContent=I.text,J.title=I.text,bt.appendChild(J),U){let Q=n.createElement("i");Q.className="urppp-nav-arrow fa fa-angle-down",Q.addEventListener("click",ot=>{ot.preventDefault(),ot.stopPropagation(),G.classList.toggle("open")}),bt.appendChild(Q)}if(G.appendChild(bt),bt.addEventListener("click",Q=>{if(T(G),!it&&U)Q.preventDefault(),G.classList.toggle("open");else if(it)return}),U){let Q=n.createElement("ul");Q.className="urppp-nav-submenu",I.children.forEach(ot=>j(ot,Q)),G.appendChild(Q)}I.id&&v.has(I.id)&&G.classList.add("active"),H.appendChild(G)}a(j,"buildItem"),C.forEach(I=>j(I,$)),$.querySelectorAll(".urppp-nav-item.open").forEach(I=>I.classList.remove("open")),A.insertBefore(f,A.firstChild),A.appendChild($)}return a(P,"rebuildSidebarCompletely"),{rebuildSidebarCompletely:P,syncMobileContentOffset:u,syncSidebarUnderNavbar:k}}a(ts,"createSidebarController");function es({theme:n,settings:p,documentRef:c=document,windowRef:d=window}){function u(S){if(!S)return;let g=n.getSkin(),v=n.skinSupportsFixedPalettes(g),q=n.getCurrent(),C=v?n.getBrutalActivePalette():null,f=v?n.getBrutalSelectedPalette():null;S.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(h=>{let w=h.dataset.theme,x=w==="dark",E=w==="scu-red",L=x&&!n.skinSupportsDark(g)||E&&!n.skinSupportsDynamic(g)&&!v,$=w===q;if(v&&($=w==="default"&&C.id===n.BRUTAL_DEFAULT_PALETTE||E&&C.id!==n.BRUTAL_DEFAULT_PALETTE),h.disabled=L,h.classList.toggle("urppp-theme-disabled",L),h.classList.toggle("ac",$&&!L),h.setAttribute("aria-disabled",L?"true":"false"),w==="default")h.style.background=v?n.getBrutalPaletteById(n.BRUTAL_DEFAULT_PALETTE).accent:"#F1F3F5",h.title=v?"默认高能粉":"简约白";else if(x)h.style.background=L?"#A7A7A7":"#0B0F14",h.title=L?"当前界面风格不支持暗色模式":"深邃暗";else if(E)if(L)h.style.background="#A7A7A7",h.title="当前界面风格不支持动态配色";else if(v)h.style.background=f.accent,h.title="高对比配色："+f.name;else{let T=n.getAccent()||n.DEFAULT_SEED;try{let j=n.buildSchemePreview(T,n.getScheme());h.style.background="linear-gradient(135deg, "+j.primary+" 0 55%, "+j.surface+" 55% 100%)"}catch{h.style.background=T}h.title="动态配色"}})}a(u,"syncThemeDotGroup");function k(S){let g=n.getSkin();if(n.skinSupportsFixedPalettes(g)){if(S==="dark")return;n.getCurrent()!=="default"&&n.applyTheme("default",{manual:!0}),S==="default"&&n.setBrutalPalette(n.BRUTAL_DEFAULT_PALETTE),S==="scu-red"&&n.setBrutalPalette(n.getBrutalSelectedPalette().id);return}n.isThemeModeAvailable(S,g)&&n.applyTheme(S,{manual:!0})}a(k,"handleThemeDotClick");function P(){u(c.getElementById("urppp-nav-theme"))}a(P,"syncNavbarThemeUI");function A(){try{let S=c.getElementById("navbar")||c.querySelector(".navbar");if(!S)return;if(c.getElementById("urppp-nav-theme")){P();return}let g=S.querySelector(".navbar-header .navbar-brand")||S.querySelector(".navbar-brand")||S.querySelector(".navbar-header");if(!g)return;let v=c.createElement("div");v.id="urppp-nav-theme",v.innerHTML=['<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>','<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>','<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>','<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">','  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">','    <circle cx="12" cy="12" r="3"></circle>','    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"  </svg>","</button>"].join(""),g.parentElement?(g.parentElement.style.setProperty("display","flex","important"),g.parentElement.style.setProperty("align-items","center","important"),g.nextSibling?g.parentElement.insertBefore(v,g.nextSibling):g.parentElement.appendChild(v)):g.appendChild(v),v.style.setProperty("display","inline-flex","important"),v.style.setProperty("align-items","center","important"),v.style.setProperty("height","36px","important"),v.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(q=>{q.addEventListener("click",()=>{k(q.dataset.theme),P();try{p.syncSettingsPanelUI()}catch{}})}),v.querySelector("#urppp-nav-settings").addEventListener("click",q=>{q.preventDefault(),q.stopPropagation(),p.openSettingsPanel()}),p.ensureSettingsPanel(),P();try{d.__urpppCleanMode&&d.__urpppCleanMode.inject()}catch{}}catch(S){console.warn("[URP++] navbar theme switch inject failed",S)}}a(A,"injectNavbarThemeSwitch");function y(){let g=c.getElementById("navbar")?.querySelector(".ace-nav");try{A()}catch{}if(!g)return;function v(E,L){Object.entries(L).forEach(([$,T])=>E.style.setProperty($,T,"important"))}a(v,"force"),Array.from(g.childNodes).forEach(E=>{E.nodeType===Node.TEXT_NODE&&!E.textContent.trim()&&E.remove()}),g.querySelectorAll(":scope > li").forEach(E=>{v(E,{display:"inline-flex","align-items":"center","vertical-align":"middle",margin:"0",padding:"0","text-align":"left"})}),g.querySelectorAll(":scope > li > a").forEach(E=>{v(E,{display:"inline-flex","align-items":"center","justify-content":"center",height:"36px",padding:"0 4px","flex-wrap":"nowrap","vertical-align":"middle","text-decoration":"none"}),E.style.lineHeight="1"}),g.querySelectorAll(":scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa").forEach(E=>{v(E,{top:"auto","vertical-align":"middle","line-height":"1","margin-top":"0"})});let q=g.querySelector(':scope > li > a[href*="customerServiceCenter"]');q&&(v(q,{width:"28px","justify-content":"center"}),q.style.padding="0 4px");let C=c.getElementById("clickdiv"),f=c.getElementById("form-search"),h=c.getElementById("search-input"),w=c.getElementById("intellegenceUDiv");if(w&&(w.style.setProperty("position","relative","important"),w.style.setProperty("z-index","30","important"),w.style.setProperty("display","inline-flex","important"),w.style.setProperty("align-items","center","important"),w.style.setProperty("justify-content","center","important"),w.style.setProperty("width","32px","important"),w.style.setProperty("height","36px","important"),w.style.setProperty("vertical-align","middle","important"),w.style.setProperty("margin","0","important"),w.style.setProperty("padding","0","important")),C&&f){C.removeAttribute("onclick"),v(C,{"background-color":"transparent",position:"relative",display:"inline-flex","align-items":"center","justify-content":"center",width:"32px",height:"32px","border-radius":"8px","line-height":"1","z-index":"30"});let E=c.getElementById("clicki");E&&v(E,{color:"var(--text-secondary)","margin-top":"0"}),C.__urpppNavbarClickBound||(C.__urpppNavbarClickBound=!0,C.addEventListener("mouseenter",()=>C.style.setProperty("background-color","var(--input-bg)","important")),C.addEventListener("mouseleave",()=>C.style.setProperty("background-color","transparent","important")),C.addEventListener("click",T=>{T.preventDefault(),T.stopPropagation(),f.dataset.open==="1"?(f.style.width="0px",f.style.opacity="0",f.dataset.open="0"):(f.style.width="180px",f.style.opacity="1",f.dataset.open="1",h&&setTimeout(()=>h.focus(),50))})),d.__urpppNavbarOutsideClickBound||(d.__urpppNavbarOutsideClickBound=!0,c.addEventListener("click",T=>{let j=c.getElementById("clickdiv"),I=c.getElementById("form-search");!j||!I||I.dataset.open!=="1"||!j.contains(T.target)&&!I.contains(T.target)&&(I.style.width="0px",I.style.opacity="0",I.dataset.open="0")})),v(f,{position:"absolute",right:"34px",top:"50%",transform:"translateY(-50%)",left:"auto",margin:"0","z-index":"10",background:"transparent",border:"none","box-shadow":"none",overflow:"hidden",padding:"0",transition:"width .2s ease, opacity .2s ease"});let L=f.dataset.open==="1"?"160px":"0px";f.style.width!==L&&(f.style.width=L,f.style.opacity=f.dataset.open==="1"?"1":"0"),h&&v(h,{"background-color":"var(--input-bg)",border:"1px solid var(--border)",color:"var(--text)","border-radius":"8px",height:"32px",padding:"0 12px","line-height":"32px",width:"100%"});let $=f.querySelector(".input-icon > .ace-icon.fa-search");$&&($.style.display="none")}let x=g.querySelector(":scope > li.light-blue > a");if(x){v(x,{display:"inline-flex","align-items":"center",gap:"6px"});let E=x.querySelector(".user-info");E&&(v(E,{display:"inline-flex","align-items":"center",gap:"4px","max-width":"none","white-space":"nowrap","vertical-align":"middle","line-height":"1","margin-top":"-12px"}),Array.from(E.childNodes).forEach($=>{$.nodeType===Node.TEXT_NODE&&($.textContent=$.textContent.replace(/\s+/g,"").trim())}),Array.from(E.children).forEach($=>{v($,{display:"inline","white-space":"nowrap","vertical-align":"middle","line-height":"1",margin:"0",padding:"0"}),$.tagName==="SMALL"&&$.style.setProperty("font-size","inherit","important")}));let L=x.querySelector(".nav-user-photo");L&&(L.alt=(L.alt||"").replace(/\s+/g,"").trim(),v(L,{"vertical-align":"middle",display:"inline-block",width:"30px",height:"30px"}))}}return a(y,"rebuildNavbar"),{handleThemeDotClick:k,injectNavbarThemeSwitch:A,rebuildNavbar:y,syncNavbarThemeUI:P,syncThemeDotGroup:u}}a(es,"createNavbarController");(function(){"use strict";try{let t=typeof navigator<"u"&&navigator.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t)){document.documentElement&&document.documentElement.classList.add("urppp-mobile");let e=document.querySelector('meta[name="viewport"]');e||(e=document.createElement("meta"),e.name="viewport",e.content="width=device-width, initial-scale=1",(document.head||document.documentElement||document).appendChild(e))}}catch{}let n="1.9.6";if(/^id\./i.test(String(location.hostname||""))){try{let t=Eo({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:n},uiDeps:{openSubpanel:a(()=>{},"openSubpanel")}}),e=a(()=>{try{t.bootFromCache("assist")}catch{}},"boot");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}catch{}return}let p={mainRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js",assistRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",changelogPage:"https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md",greasySearch:"https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B",versionJson:"version.json",sourceUrls:a(t=>[`https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`,`https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${t}`,`https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`],"sourceUrls")},c="urppp_auto_update_check_v1",d="urppp_skin_v1",u=[{id:"apple",name:"类Apple风格",desc:"系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。",ready:!0,dark:!0,dynamic:!0,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"editorial",name:"编辑杂志",desc:"衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"flat",name:"极简扁平",desc:"无阴影、硬边与纯色层次，冷硬清晰。",ready:!0,dark:!0,dynamic:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"organic",name:"自然有机",desc:"奶油底与大地色，温暖圆角。不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"brutal",name:"新野兽派",desc:"高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,palettes:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"neu",name:"新拟物",desc:"同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}}],k=GM_addStyle(`
    html, body { background: var(--bg, #F5F5F7) !important; color: var(--text, #1D1D1F) !important; }
    /* 未就绪时隐藏页面主体，避免 ACE 原样式闪现 */
    html:not(.urppp-ready) body {
      opacity: 0 !important;
      pointer-events: none !important;
    }
    html.urppp-ready body,
    body.urppp-ready {
      opacity: 1 !important;
      pointer-events: auto !important;
      transition: opacity .2s ease !important;
    }
    #urppp-boot-loader {
      position: fixed !important;
      inset: 0 !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-direction: column !important;
      gap: 14px !important;
      margin: 0 !important;
      padding: 0 !important;
      background: var(--bg, #F5F5F7) !important;
      color: var(--text, #0F172A) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif !important;
      transition: opacity .25s ease, visibility .25s ease, background-color .2s ease !important;
      pointer-events: all !important;
    }
    #urppp-boot-loader.urppp-boot-hide {
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    #urppp-boot-loader .urppp-boot-text {
      font-size: 13px !important;
      color: var(--text-secondary, #64748B) !important;
      letter-spacing: 0.4px !important;
    }
    /* 立方体旋转 loading：浅色、扁平 */
    .urppp-cube-scene {
      width: 48px;
      height: 48px;
      perspective: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .urppp-cube {
      width: 26px;
      height: 26px;
      position: relative;
      transform-style: preserve-3d;
      animation: urppp-cube-spin 1.35s linear infinite;
    }
    .urppp-cube-face {
      position: absolute;
      inset: 0;
      border: 1.5px solid var(--border, #E2E8F0);
      background: var(--surface, #FFFFFF);
      border-radius: 2px;
      box-sizing: border-box;
      box-shadow: none;
      opacity: 0.95;
    }
    .urppp-cube-face.front  { transform: translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--text-muted, #94A3B8); }
    .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(13px); background: var(--surface, #FFFFFF); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(13px); background: var(--input-bg, #F8FAFC); border-color: var(--border, #E2E8F0); }
    .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(13px); background: var(--surface, #FFFFFF); border-color: var(--text-muted, #94A3B8); }
    .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(13px); background: var(--bg, #F5F5F7); border-color: var(--border, #E2E8F0); }
    #urppp-boot-loader .urppp-cube-scene { width: 64px; height: 64px; perspective: 280px; }
    #urppp-boot-loader .urppp-cube { width: 34px; height: 34px; }
    #urppp-boot-loader .urppp-cube-face {
      border-width: 1.5px;
      border-color: var(--border, #E2E8F0);
    }
    #urppp-boot-loader .urppp-cube-face.front  { transform: translateZ(17px); background: var(--input-bg, #F8FAFC); border-color: var(--text-muted, #94A3B8); }
    #urppp-boot-loader .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(17px); background: var(--surface, #FFFFFF); }
    #urppp-boot-loader .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(17px); background: var(--input-bg, #F8FAFC); }
    #urppp-boot-loader .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(17px); background: var(--input-bg, #F8FAFC); }
    #urppp-boot-loader .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(17px); background: var(--surface, #FFFFFF); border-color: var(--text-muted, #94A3B8); }
    #urppp-boot-loader .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(17px); background: var(--bg, #F5F5F7); }
    @keyframes urppp-cube-spin {
      0%   { transform: rotateX(-12deg) rotateY(0deg); }
      100% { transform: rotateX(-12deg) rotateY(360deg); }
    }
    @keyframes urppp-spin {
      to { transform: rotate(360deg); }
    }
    /* 原生 loading 图：先藏起来，JS 会替换成 SVG */
    img[src*="pageloading" i],
    img[src*="page-loading" i],
    img[src*="/loading" i],
    img[src*="Loading.gif"],
    .view-pre-loading,
    .pageloading,
    .pre-loading {
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
      position: absolute !important;
      pointer-events: none !important;
    }
    .urppp-inline-loader {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      min-height: 64px;
      color: #64748B !important;
      font-size: 13px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif !important;
      box-sizing: border-box !important;
    }
    /* 分页/表格遮罩：绝不注入 DOM；只在可见时用 CSS 转圈，站点 display:none 即可彻底消失 */
    [id^="div_page_loading"],
    [id*="page_loading"],
    [id$="_loading"],
    div[id*="page_loading"] {
      background: transparent !important;
      background-image: none !important;
    }
    [id^="div_page_loading"] img,
    [id*="page_loading"] img {
      display: none !important;
      opacity: 0 !important;
      width: 0 !important;
      height: 0 !important;
    }
    /* 清掉我们误注入的节点视觉 */
    [id^="div_page_loading"] .urppp-inline-loader,
    [id*="page_loading"] .urppp-inline-loader,
    [id^="div_page_loading"] svg,
    [id*="page_loading"] svg {
      display: none !important;
      visibility: hidden !important;
      width: 0 !important;
      height: 0 !important;
      opacity: 0 !important;
    }
    /* 分页遮罩：不注入、不伪元素转圈，只藏原生 gif，避免卡住/卡死 */
    [id^="div_page_loading"]::before,
    [id*="page_loading"]::before {
      content: none !important;
      display: none !important;
    }
    .urppp-inline-loader .urppp-cube-scene {
      width: 40px !important;
      height: 40px !important;
      perspective: 200px !important;
    }
    .urppp-inline-loader .urppp-cube {
      width: 20px !important;
      height: 20px !important;
    }
    .urppp-inline-loader .urppp-cube-face {
      border-color: var(--border, #E2E8F0) !important;
      border-width: 1.5px !important;
      background: var(--surface, #FFFFFF) !important;
    }
    .urppp-inline-loader .urppp-cube-face.front  { transform: translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; border-color: var(--text-muted, #94A3B8) !important; }
    .urppp-inline-loader .urppp-cube-face.back   { transform: rotateY(180deg) translateZ(10px) !important; background: var(--surface, #FFFFFF) !important; }
    .urppp-inline-loader .urppp-cube-face.right  { transform: rotateY(90deg) translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; }
    .urppp-inline-loader .urppp-cube-face.left   { transform: rotateY(-90deg) translateZ(10px) !important; background: var(--input-bg, #F8FAFC) !important; }
    .urppp-inline-loader .urppp-cube-face.top    { transform: rotateX(90deg) translateZ(10px) !important; background: var(--surface, #FFFFFF) !important; border-color: var(--text-muted, #94A3B8) !important; }
    .urppp-inline-loader .urppp-cube-face.bottom { transform: rotateX(-90deg) translateZ(10px) !important; background: var(--bg, #F5F5F7) !important; }
    .center:has(> img[src*="pageloading" i]),
    .center:has(> .urppp-inline-loader),
    .modal-content .center {
      min-height: 80px !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
    }
    /* layui-layer 原生 loading（背景图 loading-0.gif） */
    .layui-layer-loading,
    .layui-layer-loading0,
    .layui-layer-loading1,
    .layui-layer-loading2,
    .layui-layer-dialog.layui-layer-loading,
    .layui-layer-content.layui-layer-loading0,
    .layui-layer-content.layui-layer-loading1,
    .layui-layer-content.layui-layer-loading2 {
      background: transparent !important;
      background-image: none !important;
      background-color: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }
    .layui-layer-dialog.layui-layer-loading,
    .layui-layer.layui-layer-loading {
      background: transparent !important;
      background-image: none !important;
      box-shadow: none !important;
      border: none !important;
    }
    .layui-layer-loading .layui-layer-content,
    .layui-layer-content.layui-layer-loading0,
    .layui-layer-content.layui-layer-loading1,
    .layui-layer-content.layui-layer-loading2 {
      width: 72px !important;
      height: 72px !important;
      background: transparent !important;
      background-image: none !important;
      position: relative !important;
    }
    /* 未注入时，伪元素兜底：旋转方块 */
    .layui-layer-content.layui-layer-loading0:not(:has(.urppp-inline-loader))::before,
    .layui-layer-content.layui-layer-loading1:not(:has(.urppp-inline-loader))::before,
    .layui-layer-content.layui-layer-loading2:not(:has(.urppp-inline-loader))::before,
    .layui-layer-loading .layui-layer-content:not(:has(.urppp-inline-loader))::before {
      content: '' !important;
      position: absolute !important;
      left: 50% !important;
      top: 50% !important;
      width: 20px !important;
      height: 20px !important;
      margin: -10px 0 0 -10px !important;
      border: 1.5px solid var(--border, #E2E8F0) !important;
      border-radius: 2px !important;
      background: var(--input-bg, #F8FAFC) !important;
      box-sizing: border-box !important;
      animation: urppp-cube-spin 1.15s linear infinite !important;
      transform-style: preserve-3d !important;
    }
    .layui-layer-loading .urppp-inline-loader,
    .layui-layer-content .urppp-inline-loader {
      width: 100% !important;
      height: 100% !important;
      min-height: 0 !important;
      padding: 0 !important;
      gap: 0 !important;
    }
  `);k&&(k.id="urppp-early-style");let P=`
    <div class="urppp-cube-scene" aria-hidden="true">
      <div class="urppp-cube">
        <div class="urppp-cube-face front"></div>
        <div class="urppp-cube-face back"></div>
        <div class="urppp-cube-face right"></div>
        <div class="urppp-cube-face left"></div>
        <div class="urppp-cube-face top"></div>
        <div class="urppp-cube-face bottom"></div>
      </div>
    </div>
  `;function A(t){let e=document.createElement("div");return e.className="urppp-inline-loader",e.innerHTML=P+(t?`<div>${t}</div>`:""),e}a(A,"makeInlineLoader");function y(t){return!t||!t.closest?!1:!!t.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]')}a(y,"isPageLoadingOverlay");function S(t){try{(t&&t.querySelectorAll?t:document).querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach(r=>{r.querySelectorAll(".urppp-inline-loader").forEach(o=>{try{o.remove()}catch{}}),r.classList.remove("urppp-loading-active")})}catch{}}a(S,"cleanupPageLoadingOverlays");function g(t){try{let e=t&&t.querySelectorAll?t:document;S(e),e.querySelectorAll("img").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1"||y(r))return;let o=(r.getAttribute("src")||r.src||"").toLowerCase();if(!o||!(o.includes("pageloading")||o.includes("page-loading")||o.includes("loading.gif")||o.includes("loading-0")||o.includes("loading-1"))||o.includes("/loading")&&!o.includes("pageloading")&&!o.includes("loading.gif")&&!o.includes("loading-0"))return;r.dataset.urpppReplaced="1";let i=A("");i.style.minHeight="0",i.style.padding="0",r.parentElement&&r.parentElement.replaceChild(i,r)}catch{}}),e.querySelectorAll(".layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1")return;if(r.dataset.urpppReplaced="1",r.style.setProperty("background","transparent","important"),r.style.setProperty("background-image","none","important"),!r.querySelector(".urppp-inline-loader")){let o=A("");o.style.minHeight="0",o.style.padding="0",r.appendChild(o)}}catch{}})}catch{}}if(a(g,"replaceNativeLoaders"),!window.__urpppLoaderObs){window.__urpppLoaderObs=!0;let t=!1,e=a(()=>{if(!t){t=!0;try{g(document)}catch{}t=!1}},"run");document.body&&setTimeout(e,0),document.addEventListener("DOMContentLoaded",()=>setTimeout(e,0),{once:!0});let r=a(()=>{new MutationObserver(()=>{clearTimeout(window.__urpppLoaderTimer),window.__urpppLoaderTimer=setTimeout(e,200)}).observe(document.documentElement,{childList:!0,subtree:!0})},"startObs");document.body?r():document.addEventListener("DOMContentLoaded",r,{once:!0})}let v="urppp_theme_v3",q="urppp_accent_v1",C="urppp_accent_presets_v1",f="urppp_scheme_v1",h="urppp_theme_follow_system_v1",w="urppp_clean_default_v1",x="urppp_clean_analysis_v1",E="urppp_apple_edge_line_v1",L="urppp_follow_use_dynamic_v1",$="urppp_brutal_palette_v1",T="urppp_brutal_active_palette_v1",j="urppp_privacy_v1",I="urppp_custom_identity_v1",H="urppp_schedule_first_monday_v1",G="urppp_schedule_json_format_v1",U={completedCourses:"已修课程",failedCourses:"未及格课程",majorGpa:"主修绩点",majorPlan:"主修方案",remainingCourses:"待修课程",passingTotalCredit:"全部及格总学分",passingAvgScore:"全部及格平均成绩",passingAvgGpa:"全部及格平均绩点",passingRequiredCredit:"全部及格必修学分",passingRequiredAvg:"全部及格必修平均",passingRequiredGpa:"全部及格必修绩点",schemeTotalCredit:"方案总学分",schemeAvgScore:"方案平均成绩",schemeAvgGpa:"方案平均绩点",schemeRequiredCredit:"方案必修学分",schemeRequiredAvg:"方案必修平均",schemeRequiredGpa:"方案必修绩点"},et="",it=["#1E3A5F","#B53434","#0F766E","#7C3AED","#C2410C","#0369A1","#BE185D","#365314"],bt="#B53434",J="pink",Q=[{id:"pink",name:"高能粉",desc:"默认配色，热粉强调与酸性绿辅助",accent:"#FF006E",secondary:"#CCFF00",info:"#00D9FF",warning:"#FF9500"},{id:"acid",name:"酸性绿",desc:"酸性绿强调与热粉辅助",accent:"#CCFF00",secondary:"#FF006E",info:"#00D9FF",warning:"#FF9500"},{id:"cyan",name:"电子蓝",desc:"电子蓝强调与亮橙辅助",accent:"#00D9FF",secondary:"#FF9500",info:"#CCFF00",warning:"#FF006E"},{id:"orange",name:"亮橙",desc:"亮橙强调与电子蓝辅助",accent:"#FF9500",secondary:"#00D9FF",info:"#CCFF00",warning:"#FF006E"}],ot="tonal",X=[{id:"paper",name:"纯白卡片",desc:"卡片保持白，仅强调色跟种子"},{id:"tonal",name:"色调点缀",desc:"背景轻染，卡片带同色相浅底"},{id:"soft",name:"柔和粉彩",desc:"卡片明显粉彩/浅色，低对比"},{id:"vibrant",name:"鲜艳",desc:"背景与卡片都更有色，主色更饱和"},{id:"expressive",name:"表现力",desc:"双色拼色：卡片跟主色，背景走协调次色"}],{handleThemeDotClick:ct,injectNavbarThemeSwitch:rt,rebuildNavbar:st,syncNavbarThemeUI:xt,syncThemeDotGroup:Z}=es({theme:{BRUTAL_DEFAULT_PALETTE:J,DEFAULT_SEED:bt,applyTheme:Gt,buildSchemePreview:Zt,getAccent:Xt,getBrutalActivePalette:Go,getBrutalPaletteById:dr,getBrutalSelectedPalette:Wo,getCurrent:Jt,getScheme:De,getSkin:te,isThemeModeAvailable:cr,setBrutalPalette:Vo,skinSupportsDark:Oe,skinSupportsDynamic:He,skinSupportsFixedPalettes:Uo},settings:{ensureSettingsPanel:wn,openSettingsPanel:xn,syncSettingsPanelUI:jt}});function dt(){try{if(!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches))return;let e=document.getElementById("navbar"),r=e?.querySelector(".ace-nav");if(!e||!r)return;let o=document.getElementById("intellegenceUDiv"),i=document.getElementById("clickdiv"),s=document.getElementById("form-search");if(!o){let O=document.createElement("li");O.className="green urppp-search-item",o=document.createElement("div"),o.id="intellegenceUDiv",O.appendChild(o),r.appendChild(O)}let l=o.closest("li")||o.parentElement,b=Array.from(r.children).find(O=>{let R=O.querySelector(":scope > a");if(!R)return!1;let F=R.getAttribute("href")||"",K=(R.getAttribute("title")||"")+" "+(R.textContent||"");return F.includes("customerServiceCenter")||/help|service|support/i.test(F)||!!R.querySelector(".glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring")||/帮助|客服|服务|帮助中心/i.test(K)}),m=Array.from(r.children).find(O=>O.classList.contains("light-blue")),_=b||m||null;_&&l&&_!==l&&((l.compareDocumentPosition(_)&Node.DOCUMENT_POSITION_FOLLOWING)!==0||r.insertBefore(l,_)),l&&!l.classList.contains("urppp-search-item")&&l.classList.add("urppp-search-item");let M=l;i?(i.removeAttribute("onclick"),i.setAttribute("role","button"),i.setAttribute("aria-label","搜索功能")):(i=document.createElement("button"),i.type="button",i.id="clickdiv",i.setAttribute("aria-label","搜索功能"),i.innerHTML='<i class="fa fa-search" id="clicki" aria-hidden="true"></i>',o.appendChild(i)),i.style.setProperty("left","8px","important"),i.style.setProperty("position","relative","important"),i.style.setProperty("z-index","31","important"),s||(s=document.createElement("div"),s.id="form-search",s.className="nav-search",s.innerHTML='<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>'),M&&s.parentElement!==M&&M.appendChild(s),M&&M.style.setProperty("position","relative","important"),s.classList.add("urppp-desktop-search"),s.style.setProperty("position","absolute","important"),s.style.setProperty("top","50%","important"),s.style.setProperty("right","24px","important"),s.style.setProperty("left","auto","important"),s.style.setProperty("transform","translateY(-50%)","important"),s.style.setProperty("width",s.dataset.open==="1"?"min(240px, calc(100vw - 24px))":"0px","important"),s.style.setProperty("max-width","calc(100vw - 24px)","important"),s.style.setProperty("opacity",s.dataset.open==="1"?"1":"0","important"),s.style.setProperty("pointer-events",s.dataset.open==="1"?"auto":"none","important"),s.style.setProperty("z-index","1200","important"),s.style.setProperty("margin","0","important"),s.style.setProperty("background","transparent","important"),s.style.setProperty("border","0 solid transparent","important"),s.style.setProperty("box-shadow","none","important"),s.style.setProperty("overflow","visible","important"),s.style.setProperty("transition","width .2s ease, opacity .2s ease","important");let N=s.querySelector("#search-input"),z=s.querySelector("form");if(!N||!z)return;z.style.setProperty("display","block","important"),z.style.setProperty("margin","0","important"),z.style.setProperty("padding","10px","important");let D=s.querySelector(".input-icon");D&&(D.style.setProperty("display","block","important"),D.style.setProperty("position","relative","important")),N.style.setProperty("display","block","important"),N.style.setProperty("width","100%","important"),N.style.setProperty("height","36px","important"),N.style.setProperty("box-sizing","border-box","important"),N.style.setProperty("padding","0 12px","important"),N.style.setProperty("border","1px solid var(--border)","important"),N.style.setProperty("border-radius","var(--radius-sm)","important"),N.style.setProperty("background","var(--input-bg)","important"),N.style.setProperty("color","var(--text)","important");let V=a(O=>{s.dataset.open=O?"1":"0",s.style.setProperty("width",O?"min(240px, calc(100vw - 24px))":"0px","important"),s.style.setProperty("opacity",O?"1":"0","important"),s.style.setProperty("pointer-events",O?"auto":"none","important"),i.setAttribute("aria-expanded",O?"true":"false"),O&&setTimeout(()=>N.focus(),30)},"setOpen");i.__urpppSearchBound||(i.__urpppSearchBound=!0,i.addEventListener("click",O=>{O.preventDefault(),O.stopImmediatePropagation(),V(s.dataset.open!=="1")},!0)),document.__urpppDesktopSearchOutsideBound||(document.__urpppDesktopSearchOutsideBound=!0,document.addEventListener("click",O=>{let R=document.getElementById("form-search"),F=document.getElementById("clickdiv");!R||R.dataset.open!=="1"||R.classList.contains("urppp-mobile-form-search")||R.closest("#urppp-mobile-search-panel")||R.contains(O.target)||F?.contains(O.target)||V(!1)},!0))}catch(t){console.warn("[URP++] desktop search bind failed",t)}}a(dt,"bindDesktopNavbarSearch");function At(){if(document.getElementById("urppp-boot-loader"))return;let t=document.createElement("div");t.id="urppp-boot-loader",t.setAttribute("aria-busy","true"),t.innerHTML=`
      <div class="urppp-cube-scene" aria-hidden="true">
        <div class="urppp-cube">
          <div class="urppp-cube-face front"></div>
          <div class="urppp-cube-face back"></div>
          <div class="urppp-cube-face right"></div>
          <div class="urppp-cube-face left"></div>
          <div class="urppp-cube-face top"></div>
          <div class="urppp-cube-face bottom"></div>
        </div>
      </div>
      <div class="urppp-boot-text">URP++ 加载中</div>
    `;let e=document.documentElement||document.body;e&&e.appendChild(t)}a(At,"ensureBootLoader");function kt(){try{document.documentElement.classList.add("urppp-ready"),document.body&&(document.body.classList.add("urppp-ready"),document.body.style.removeProperty("opacity"));let t=document.getElementById("urppp-boot-loader");if(!t)return;t.classList.add("urppp-boot-hide"),setTimeout(()=>{try{t.remove()}catch{}},280)}catch{}}a(kt,"hideBootLoader");try{At()}catch{}window.__urpppBootSafety||(window.__urpppBootSafety=setTimeout(()=>{try{kt()}catch{}},2500));let Pt={default:{name:"简约白",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"#0071E3","--input-bg":"#F5F5F7","--primary":"#0071E3","--primary-hover":"#0077ED","--ring":"rgba(0,113,227,0.28)","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px","--border-w":"0px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},dark:{name:"深邃暗",vars:{"--bg":"#000000","--surface":"#1C1C1E","--text":"#F5F5F7","--text-secondary":"#A1A1A6","--text-muted":"#8E8E93","--border":"#38383A","--border-focus":"#0A84FF","--input-bg":"#2C2C2E","--primary":"#0A84FF","--primary-hover":"#409CFF","--ring":"rgba(10,132,255,0.32)","--shadow":"0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},"scu-red":{name:"动态配色",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"var(--urppp-accent, #B53434)","--input-bg":"#F5F5F7","--primary":"var(--urppp-accent, #B53434)","--primary-hover":"var(--urppp-accent-hover, #962929)","--ring":"var(--urppp-accent-ring, rgba(181,52,52,0.18))","--shadow":"0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'}};function B(t,e,r){t/=255,e/=255,r/=255;let o=Math.max(t,e,r),i=Math.min(t,e,r),s=0,l=0,b=(o+i)/2;if(o!==i){let m=o-i;switch(l=b>.5?m/(2-o-i):m/(o+i),o){case t:s=(e-r)/m+(e<r?6:0);break;case e:s=(r-t)/m+2;break;default:s=(t-e)/m+4;break}s/=6}return{h:s*360,s:l,l:b}}a(B,"rgbToHsl");function Y(t,e,r){t=(t%360+360)%360,e=Math.max(0,Math.min(1,e)),r=Math.max(0,Math.min(1,r));let o=(1-Math.abs(2*r-1))*e,i=o*(1-Math.abs(t/60%2-1)),s=r-o/2,l=0,b=0,m=0;return t<60?(l=o,b=i):t<120?(l=i,b=o):t<180?(b=o,m=i):t<240?(b=i,m=o):t<300?(l=i,m=o):(l=o,m=i),{r:Math.round((l+s)*255),g:Math.round((b+s)*255),b:Math.round((m+s)*255)}}a(Y,"hslToRgb");function tt(t,e,r){let{r:o,g:i,b:s}=Y(t,e,r);return _r(o,i,s)}a(tt,"hslHex");function ft(t){let{r:e,g:r,b:o}=or(Vt(t)||bt),i=B(e,r,o);return i.s<.12&&(i.s=.18),i}a(ft,"seedHsl");function ht(t,e,r){let o=Math.max(0,Math.min(100,r))/100,i=Math.max(0,Math.min(.95,e));return tt(t,i,o)}a(ht,"tone");function Lt(t){switch(t){case"paper":case"neutral":return{chroma:1,secShift:0,primaryTone:38,whiteCard:!0,bgSeed:.05,surfaceSeed:0,borderSeed:.08};case"soft":return{chroma:1,secShift:10,primaryTone:42,bgSeed:.14,surfaceSeed:.16,borderSeed:.18};case"vibrant":return{chroma:1.15,secShift:14,primaryTone:36,bgSeed:.2,surfaceSeed:.22,borderSeed:.26};case"expressive":return{chroma:1.08,secShift:0,primaryTone:36,duo:!0,bgSeed:.12,surfaceSeed:.15,borderSeed:.18};default:return{chroma:1,secShift:18,primaryTone:40,bgSeed:.12,surfaceSeed:.13,borderSeed:.16}}}a(Lt,"schemeProfile");function vt(t,e){let r=Vt(t)||bt,o=Math.max(0,Math.min(.45,Number(e)||0));return o<=.001?"#FFFFFF":Ft("#FFFFFF",r,o)}a(vt,"tintFromHex");function Dt(t){return t<25||t>=345?(t+28)%360:t<55?(t+22)%360:t<90?(t+160)%360:t<160?(t+40)%360:t<210?(t+35)%360:t<265?(t+48)%360:t<310?(t+40)%360:(t+24)%360}a(Dt,"companionHue");function zt(t){let e=Vt(t)||bt,{h:r,s:o}=ft(e),i=Dt(r),s=Math.min(.72,Math.max(.28,o*.78));return ht(i,s,42)}a(zt,"companionColor");function Nt(t,e){let r=Vt(t)||bt,{h:o,s:i}=ft(r),l=Lt(e||ot),b=Math.min(.92,Math.max(.35,i*l.chroma)),m=zt(r),{h:_}=ft(m),M=ht(o,b,l.primaryTone),N=ht(o,b,Math.max(24,l.primaryTone-10)),z=Ft("#FFFFFF",r,.18),D,V,O;l.whiteCard?(D=Ft("#F1F5F9",Ft("#FFFFFF",r,.08),.5),V="#FFFFFF",O="#E5E7EB"):l.duo?(D=Ft(vt(m,l.bgSeed+.04),"#EEF1F4",.1),V=Ft(vt(r,l.surfaceSeed),"#FFFFFF",.1),O=Ft("#E5E7EB",m,.16)):(D=Ft(vt(r,l.bgSeed),"#E8EBEF",.12),V=Ft(vt(r,l.surfaceSeed),"#FFFFFF",.12),O=Ft("#E5E7EB",r,Math.max(.08,l.borderSeed*.7)));let R=l.whiteCard?"#F8FAFC":Ft(V,vt(l.duo?m:r,Math.max(.05,(l.surfaceSeed||.1)*.55)),.35),F=ht(o,Math.min(.45,b*.55),14),K=Ae(ht(o,b*.3,34),.88),ut=Ae(ht(o,b*.22,46),.76),wt=Ae(M,.18),Ct="0 4px 12px "+Ae(M,.1)+", 0 1px 2px "+Ae(M,.05);return{"--bg":D,"--surface":V,"--text":F,"--text-secondary":K,"--text-muted":ut,"--border":O,"--border-focus":M,"--input-bg":R,"--primary":M,"--primary-hover":N,"--ring":wt,"--shadow":Ct,"--radius":"18px","--radius-sm":"12px","--primary-container":z,"--secondary":m}}a(Nt,"buildMaterialSchemeVars");function Zt(t,e){let r=Nt(t,e);return{id:e,primary:r["--primary"],bg:r["--bg"],surface:r["--surface"],border:r["--border"],text:r["--text"]}}a(Zt,"buildSchemePreview");function Fe(t){let e=Vt(t)||Xt()||bt;return X.map(r=>Object.assign({},r,Zt(e,r.id)))}a(Fe,"listSchemePreviews");function ge(){let t=document.documentElement;["--primary","--primary-hover","--border-focus","--ring","--bg","--surface","--text","--text-secondary","--text-muted","--border","--input-bg","--shadow","--primary-container","--secondary"].forEach(e=>t.style.removeProperty(e))}a(ge,"clearInlinePrimaryOverrides");function Xt(){return Vt(GM_getValue(q,""))||""}a(Xt,"getAccent");function De(){let t=String(GM_getValue(f,ot)||ot);return X.some(e=>e.id===t)?t:ot}a(De,"getScheme");function va(t){let e=X.some(r=>r.id===t)?t:ot;return GM_setValue(f,e),e}a(va,"setScheme");function rs(t,e){if(!t)return;let r=Vt(t);if(r){if(GM_setValue(q,r),e&&e.scheme&&va(e.scheme),e&&e.skipTheme){let o=fo(r,.15),i=Ae(r,.15);document.documentElement.style.setProperty("--urppp-accent",r),document.documentElement.style.setProperty("--urppp-accent-hover",o),document.documentElement.style.setProperty("--urppp-accent-ring",i);try{xt()}catch{}try{jt()}catch{}return}Gt("scu-red");try{xt()}catch{}try{jt()}catch{}}}a(rs,"applyAccent");function wa(){try{let t=GM_getValue(C,"");if(!t)return it.slice();let e=JSON.parse(t);return Array.isArray(e)?e.filter(r=>typeof r=="string"&&/^#?[0-9a-fA-F]{6}$/i.test(r.replace("#",""))).map(r=>r.startsWith("#")?r.toUpperCase():"#"+r.toUpperCase()):it.slice()}catch{return it.slice()}}a(wa,"getAccentPresets");function as(t){let e=Vt(t||Xt()||bt);if(!e)return wa();let r=wa();return r=[e].concat(r.filter(o=>o.toLowerCase()!==e.toLowerCase())),r=r.slice(0,12),GM_setValue(C,JSON.stringify(r)),r}a(as,"saveAccentPreset");function Kt(){try{return!!GM_getValue(h,!1)}catch{return!1}}a(Kt,"isThemeFollowSystem");function $r(t){return GM_setValue(h,!!t),!!t}a($r,"setThemeFollowSystem");function ka(){try{return!!GM_getValue(w,!1)}catch{return!1}}a(ka,"isCleanDefault");function os(t){return GM_setValue(w,!!t),!!t}a(os,"setCleanDefault");function Aa(){try{return GM_getValue(x,"tab")==="direct"}catch{return!1}}a(Aa,"isCleanAnalysisDirect");function ns(t){return GM_setValue(x,t==="direct"?"direct":"tab"),t==="direct"?"direct":"tab"}a(ns,"setCleanAnalysis");function _e(){try{let t=GM_getValue(E,!0);return t!==!1&&t!==0&&t!=="0"}catch{return!0}}a(_e,"isAppleEdgeLine");function ps(t){return GM_setValue(E,!!t),!!t}a(ps,"setAppleEdgeLine");function Sa(){try{return!!GM_getValue(c,!1)}catch{return!1}}a(Sa,"isAutoUpdateCheck");function is(t){return GM_setValue(c,!!t),!!t}a(is,"setAutoUpdateCheck");function Ir(t,e){try{let r=GM_getValue(t,"");if(r&&typeof r=="object")return r;if(typeof r=="string"&&r.trim())return JSON.parse(r)}catch{}return e}a(Ir,"readJsonSetting");function Nr(t,e){return GM_setValue(t,JSON.stringify(e)),e}a(Nr,"writeJsonSetting");function Ee(){return Co(Ir(j,null))}a(Ee,"getPrivacySettings");function _a(t){return Nr(j,Co(t))}a(_a,"setPrivacySettings");function je(){return Tr(Ir(I,null))}a(je,"getCustomIdentity");function Fo(t){return Nr(I,Tr(t))}a(Fo,"setCustomIdentity");function Ea(){let t=Ir(H,{});return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}a(Ea,"getScheduleFirstMondayMap");function Do(t,e){if(!t||!/^\d{4}-\d{2}-\d{2}$/.test(String(e||"")))return;let r=Ea();r[String(t)]=String(e),Nr(H,r)}a(Do,"rememberScheduleFirstMonday");function Br(){let t="";try{t=GM_getValue(G,"")}catch{}let e=!!(t&&(typeof t!="string"||t.trim())),r=Ir(G,null);try{if(e&&(!r||typeof r!="object"||Array.isArray(r)))throw new Error("配置不是 JSON 对象");let o=r&&typeof r=="object"?r:{},i={enabled:!!o.enabled,mapping:Be(o.mapping||zr)};return et="",i}catch{return et=e?"JSON 映射配置损坏，已回退小爱课程兼容格式":"",{enabled:!1,mapping:Be(zr)}}}a(Br,"getScheduleJsonFormatSettings");function jo(t){let e=t&&typeof t=="object"?t:{},r={enabled:!!e.enabled,mapping:Be(e.mapping||zr)};return et="",Nr(G,r)}a(jo,"setScheduleJsonFormatSettings");function Oo(){try{let t=String(location.pathname||"").replace(/\/+$/,"")||"/";return t==="/"||t==="/index"||/\/index\.html?$/i.test(t)}catch{return!1}}a(Oo,"isHomePage");function Fr(){try{return!!GM_getValue(L,!1)}catch{return!1}}a(Fr,"isFollowUseDynamic");function Ca(t){return GM_setValue(L,!!t),!!t}a(Ca,"setFollowUseDynamic");function ss(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}a(ss,"systemPrefersDark");function xe(){return ss()&&Oe()?"dark":Fr()&&He()?"scu-red":"default"}a(xe,"resolveFollowThemeName");function cr(t,e){return t==="dark"?Oe(e):t==="scu-red"?He(e):t==="default"}a(cr,"isThemeModeAvailable");function Gt(t,e){e=e||{},!Oe()&&Kt()&&$r(!1),!He()&&Fr()&&Ca(!1),e.manual&&$r(!1);let r;e.system||Kt()&&!e.manual?r=xe():(r=Pt[t]?t:Jt()||"default",Pt[r]||(r="default")),cr(r)||(r="default");let o=Pt[r]||Pt.default;e.skipPersist||GM_setValue(v,r),ge();let i=document.getElementById("urppp-theme-vars")||(()=>{let _=document.createElement("style");return _.id="urppp-theme-vars",(document.head||document.documentElement).appendChild(_),_})(),s=Xt(),l=Object.assign({},o.vars);if(r==="scu-red"){let _=s||bt,M=De();l=Object.assign(l,Nt(_,M));let N=l["--primary"]||_,z=l["--primary-hover"]||fo(N,.12);document.documentElement.style.setProperty("--urppp-accent",N),document.documentElement.style.setProperty("--urppp-accent-hover",z),document.documentElement.style.setProperty("--urppp-accent-ring",l["--ring"]||Ae(N,.15)),document.documentElement.style.setProperty("--urppp-seed",_),document.documentElement.style.setProperty("--urppp-scheme",M)}else r==="default"?(document.documentElement.style.setProperty("--urppp-accent","#0071E3"),document.documentElement.style.setProperty("--urppp-accent-hover","#0077ED"),document.documentElement.style.setProperty("--urppp-accent-ring","rgba(0,113,227,0.28)"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme")):(document.documentElement.style.removeProperty("--urppp-accent"),document.documentElement.style.removeProperty("--urppp-accent-hover"),document.documentElement.style.removeProperty("--urppp-accent-ring"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme"));let b=":root {";for(let[_,M]of Object.entries(l))b+=`${_}:${M};`;b+="}",i.textContent=b,document.body&&(document.body.style.fontFamily=o.font);try{let _=document.documentElement;_.dataset.urpppTheme=r,_.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),_.classList.add("urppp-theme-"+r),_.classList.toggle("urppp-theme-follow",Kt()),document.body&&(document.body.dataset.urpppTheme=r,document.body.classList.toggle("urppp-dark",r==="dark"),document.body.classList.toggle("urppp-theme-follow",Kt()))}catch{}try{ae()}catch{}try{xt()}catch{}try{jt()}catch{}try{cn()}catch{}try{xs()}catch{}let m=document.getElementById("urppp-boot-loader");m&&(m.style.fontFamily=o.font)}a(Gt,"applyTheme");function Jt(){return GM_getValue(v,"default")}a(Jt,"getCurrent");function de(t){try{return!!GM_getValue("urppp_theme_css_"+t,"")}catch{return!1}}a(de,"themeDownloaded");function ye(){try{let t=GM_getValue("urppp_local_themes","");return t?JSON.parse(t)||{}:{}}catch{return{}}}a(ye,"localThemes");function Ho(t,e){try{let r=ye();r[t]=e,GM_setValue("urppp_local_themes",JSON.stringify(r))}catch{}}a(Ho,"saveLocalTheme");function ls(t){try{let e=ye();delete e[t],GM_setValue("urppp_local_themes",JSON.stringify(e))}catch{}}a(ls,"removeLocalTheme");function cs(){try{if(typeof GM_listValues!="function")return;let t=ye(),e=!1;GM_listValues().forEach(r=>{let o=/^urppp_theme_css_(.+)$/.exec(r);if(!o)return;let i=o[1],s="";try{s=GM_getValue(r,"")||""}catch{}s&&(u.some(l=>l.id===i)||t[i]||(t[i]={name:i,desc:"下载主题",author:"",version:"1.0.0"},e=!0))}),e&&GM_setValue("urppp_local_themes",JSON.stringify(t))}catch{}}a(cs,"migrateDownloadedThemes");function Pa(t){let e=document.getElementById("urppp-store-theme-"+t);return e||(e=document.createElement("style"),e.id="urppp-store-theme-"+t,e.dataset.urpppStoreTheme=t,(document.head||document.documentElement).appendChild(e)),e}a(Pa,"storeThemeStyleEl");function ds(t){let e=document.getElementById("urppp-store-theme-"+t);e&&e.remove()}a(ds,"removeStoreThemeStyle");function Ro(){cs();let t=new Set,e=a(r=>{if(t.has(r))return;t.add(r);let o="";try{o=GM_getValue("urppp_theme_css_"+r,"")||""}catch{}o&&(Pa(r).textContent=o);let i="";try{i=GM_getValue("urppp_card_css_"+r,"")||""}catch{}i&&Ce([{id:r,cardCss:i}])},"injectOne");u.forEach(r=>e(r.id)),Object.keys(ye()).forEach(r=>e(r));try{ae()}catch{}}a(Ro,"injectAllStoreThemeStyles");function te(){let t=GM_getValue(d,"apple"),e=u.find(o=>o.id===t);return e&&e.ready&&(e.installed!==!1||de(e.id))||ye()[t]&&de(t)?t:"apple"}a(te,"getSkin");function za(t,e){let r=t||te(),o=u.find(i=>i.id===r);return!!(o&&o[e])}a(za,"getSkinCapability");function Oe(t){return za(t,"dark")}a(Oe,"skinSupportsDark");function He(t){return za(t,"dynamic")}a(He,"skinSupportsDynamic");function Uo(t){return za(t,"palettes")}a(Uo,"skinSupportsFixedPalettes");function dr(t){return Q.find(e=>e.id===t)||Q[0]}a(dr,"getBrutalPaletteById");function Wo(){let t=String(GM_getValue($,"acid")||"acid"),e=dr(t);return e.id===J?dr("acid"):e}a(Wo,"getBrutalSelectedPalette");function Go(){let t=String(GM_getValue(T,J)||J);return dr(t)}a(Go,"getBrutalActivePalette");function Vo(t,e){let r=e||{},o=dr(t);r.select&&o.id!==J&&GM_setValue($,o.id),GM_setValue(T,o.id);try{ae()}catch{}try{xt()}catch{}try{jt()}catch{}try{let i=document.getElementById("urppp-clean-root");i&&typeof i.__syncCleanThemeDots=="function"&&i.__syncCleanThemeDots()}catch{}}a(Vo,"setBrutalPalette");function us(t){let e=t||te();return e==="flat"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"2px","--urppp-card-border":"2px solid var(--text)","--urppp-input-border":"2px solid var(--text)","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="organic"?{"--radius":"22px","--radius-sm":"14px","--shadow":"0 2px 10px rgba(92,64,51,0.06)","--border-w":"1px","--urppp-card-border":"1px solid #E7E0D6","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"1px solid var(--border)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--input-bg)","--urppp-action-color":"var(--primary)","--urppp-menu-radius":"14px","--urppp-menu-border":"1px solid var(--border)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}:e==="editorial"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"none","--urppp-action-radius":"0px","--urppp-action-border":"none","--urppp-action-shadow":"none","--urppp-action-bg":"transparent","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"1px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"transparent","--urppp-menu-color":"var(--text)"}:e==="brutal"?{"--radius":"0px","--radius-sm":"0px","--shadow":"6px 6px 0 #000","--border-w":"3px","--urppp-card-border":"3px solid #000","--urppp-input-border":"2px solid #000","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"3px 3px 0 var(--text)","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"3px 3px 0 var(--text)","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="neu"?{"--radius":"16px","--radius-sm":"12px","--shadow":"5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"1px solid rgba(38,49,66,.16)","--urppp-input-shadow":"inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)","--urppp-action-radius":"12px","--urppp-action-border":"none","--urppp-action-shadow":"var(--shadow)","--urppp-action-bg":"var(--bg)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"12px","--urppp-menu-border":"none","--urppp-menu-shadow":"var(--shadow)","--urppp-menu-bg":"var(--bg)","--urppp-menu-color":"var(--text)"}:{"--radius":"18px","--radius-sm":"12px","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--border-w":"0px","--urppp-card-border":e==="apple"&&_e()?"1px solid rgba(0,0,0,0.08)":"none","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"none","--urppp-action-shadow":"0 2px 6px var(--ring)","--urppp-action-bg":"var(--primary)","--urppp-action-color":"var(--surface)","--urppp-menu-radius":"12px","--urppp-menu-border":e==="apple"&&_e()?"1px solid var(--border)":"none","--urppp-menu-shadow":"0 1px 3px rgba(0,0,0,.08)","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}}a(us,"getSkinShapeOverrides");function Re(){try{let t=te();if(t==="apple")return _e()?"1px solid rgba(0,0,0,0.08)":"none";if(t==="flat")return"2px solid var(--text)";if(t==="organic")return"1px solid #E7E0D6";if(t==="brutal")return"3px solid var(--text)";if(t==="editorial"||t==="neu")return"none"}catch{}return"1px solid var(--border)"}a(Re,"urpppCardBorderValue");function ae(){let t=te();try{document.documentElement.setAttribute("data-urppp-skin",t)}catch{}try{document.body&&document.body.setAttribute("data-urppp-skin",t)}catch{}try{let e=t==="apple"&&_e();document.documentElement.setAttribute("data-urppp-apple-edge",e?"1":"0"),document.body&&document.body.setAttribute("data-urppp-apple-edge",e?"1":"0")}catch{}try{let e=document.getElementById("urppp-skin-vars")||(()=>{let s=document.createElement("style");return s.id="urppp-skin-vars",(document.head||document.documentElement).appendChild(s),s})(),r=us(t),o=":root, html[data-urppp-skin] {";if(Object.keys(r).forEach(s=>{o+=s+":"+r[s]+";"}),o+="}",o+=".urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}",t==="flat"||t==="organic"||t==="brutal"||t==="neu"){if(t==="brutal"){let s=Go();o+='html[data-urppp-skin="brutal"]{--brutal-accent:'+s.accent+";--brutal-secondary:"+s.secondary+";--brutal-info:"+s.info+";--brutal-warning:"+s.warning+";}"}e.textContent=o;return}if(t==="apple"){let s=_e(),l=s?"1px solid rgba(0,0,0,0.08)":"none",b=s?"1px solid rgba(255,255,255,0.10)":"none",m=s?"1px solid rgba(0,0,0,0.06)":"none";o+=['html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:'+(s?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.04)")+";}",'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:'+(s?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)")+";}",'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:'+b+"!important;}",'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:'+l+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}','html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}','html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}','html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}','html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:'+(s?"rgba(0,0,0,0.06)":"transparent")+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+m+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}','html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}','html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'].join("")}else t==="editorial"&&(o+=`
          html[data-urppp-skin="editorial"]{
            --radius:0px!important;--radius-sm:0px!important;--shadow:none!important;
            --bg:#F9F8F6!important;--surface:#F5F4F1!important;--input-bg:#EFEEEA!important;
            --text:#1C1C1C!important;--text-secondary:#56534F!important;--text-muted:#73706A!important;
            --border:rgba(28,28,28,.08)!important;--border-focus:rgba(28,28,28,.35)!important;
            --primary:#1C1C1C!important;--primary-hover:#000!important;--primary-foreground:var(--bg)!important;--ring:rgba(28,28,28,.12)!important;
            --success:#4A7C5F!important;--info:#5A7A8F!important;--warning:#B8924B!important;--danger:#A05E5C!important;
            --editorial-line:rgba(28,28,28,.08);--editorial-line-strong:rgba(28,28,28,.15);
            --editorial-hover-soft:rgba(28,28,28,.025);--editorial-hover:rgba(28,28,28,.035);
            --editorial-active:rgba(28,28,28,.055);--editorial-overlay:rgba(28,28,28,.30);
            --editorial-on-status:#FFF;--editorial-on-warning:#1C1C1C;--editorial-warning-text:#735D32;
            --editorial-alert-success-bg:rgba(74,124,95,.08);--editorial-alert-info-bg:rgba(90,122,143,.08);
            --editorial-alert-warning-bg:rgba(184,146,75,.10);--editorial-alert-danger-bg:rgba(160,94,92,.08);
            --editorial-pass-bg:#E5ECE6;--editorial-pass-text:#3F644D;
            --editorial-fail-bg:#F1E5E3;--editorial-fail-text:#8A4E4C;
            --editorial-info-bg:#E4EAED;--editorial-info-text:#506A78;
            --editorial-warn-bg:#EFE8D8;--editorial-warn-text:#735D32;
            --editorial-slot-course-bg:#DDE8E7;--editorial-slot-course-border:#A8C0BC;--editorial-slot-course-text:#31534F;
            --editorial-slot-exam-bg:#EADDE5;--editorial-slot-exam-border:#C7AAB9;--editorial-slot-exam-text:#684352;
            --editorial-slot-lab-bg:#EEE9D6;--editorial-slot-lab-border:#CFC59C;--editorial-slot-lab-text:#675F35;
            --editorial-slot-borrow-bg:#DDE9DF;--editorial-slot-borrow-border:#AFC5B3;--editorial-slot-borrow-text:#355D3C;
            --editorial-paper:#F9F8F6;--editorial-display:Georgia,"Noto Serif SC","Songti SC",STSong,SimSun,"Times New Roman",serif;
            --editorial-body:"Microsoft YaHei UI","PingFang SC","Segoe UI",Arial,sans-serif;color-scheme:light!important;
          }
          html.urppp-theme-dark[data-urppp-skin="editorial"],
          html[data-urppp-skin="editorial"].urppp-theme-dark,
          body.urppp-dark[data-urppp-skin="editorial"]{
            --bg:#11110F!important;--surface:#181714!important;--input-bg:#201F1B!important;
            --text:#F3F0EA!important;--text-secondary:#C4BFB6!important;--text-muted:#A39D93!important;
            --border:rgba(243,240,234,.08)!important;--border-focus:rgba(243,240,234,.38)!important;
            --primary:#F3F0EA!important;--primary-hover:#FFF!important;--primary-foreground:var(--bg)!important;--ring:rgba(243,240,234,.14)!important;
            --success:#8FB19A!important;--info:#91AAB9!important;--warning:#C8A76C!important;--danger:#C9908D!important;
            --editorial-line:rgba(243,240,234,.08);--editorial-line-strong:rgba(243,240,234,.14);
            --editorial-hover-soft:rgba(243,240,234,.035);--editorial-hover:rgba(243,240,234,.05);
            --editorial-active:rgba(243,240,234,.075);--editorial-overlay:rgba(0,0,0,.66);
            --editorial-on-status:#11110F;--editorial-on-warning:#11110F;--editorial-warning-text:#D6BD89;
            --editorial-alert-success-bg:rgba(143,177,154,.13);--editorial-alert-info-bg:rgba(145,170,185,.13);
            --editorial-alert-warning-bg:rgba(200,167,108,.14);--editorial-alert-danger-bg:rgba(201,144,141,.13);
            --editorial-pass-bg:#1F2A22;--editorial-pass-text:#A3C5AD;
            --editorial-fail-bg:#2C2120;--editorial-fail-text:#D9A39F;
            --editorial-info-bg:#1E282D;--editorial-info-text:#A9BFCA;
            --editorial-warn-bg:#2B271D;--editorial-warn-text:#D4BD88;
            --editorial-slot-course-bg:#24302F;--editorial-slot-course-border:#526A67;--editorial-slot-course-text:#B8CFCC;
            --editorial-slot-exam-bg:#30262D;--editorial-slot-exam-border:#745C69;--editorial-slot-exam-text:#D8BEC9;
            --editorial-slot-lab-bg:#302D22;--editorial-slot-lab-border:#736D50;--editorial-slot-lab-text:#D8D0A7;
            --editorial-slot-borrow-bg:#243028;--editorial-slot-borrow-border:#576D5D;--editorial-slot-borrow-text:#BDD1C2;
            --editorial-paper:#181714;color-scheme:dark!important;
          }
          html[data-urppp-skin="editorial"] ::selection{
            background:var(--text)!important;color:var(--bg)!important;
          }
          html[data-urppp-skin="editorial"] body,
          html[data-urppp-skin="editorial"] .main-container,
          html[data-urppp-skin="editorial"] .main-content,
          html[data-urppp-skin="editorial"] .main-content-inner,
          html[data-urppp-skin="editorial"] .page-content,
          html[data-urppp-skin="editorial"] #page-content-template,
          html[data-urppp-skin="editorial"] #urppp-clean-root{
            background:var(--bg)!important;background-image:none!important;color:var(--text)!important;
            font-family:var(--editorial-body)!important;-webkit-font-smoothing:antialiased!important;
            -moz-osx-font-smoothing:grayscale!important;
          }
          html[data-urppp-skin="editorial"] h1,
          html[data-urppp-skin="editorial"] h2,
          html[data-urppp-skin="editorial"] h3,
          html[data-urppp-skin="editorial"] h4,
          html[data-urppp-skin="editorial"] h5,
          html[data-urppp-skin="editorial"] .page-header,
          html[data-urppp-skin="editorial"] .widget-title,
          html[data-urppp-skin="editorial"] .urppp-card-title,
          html[data-urppp-skin="editorial"] #urppp-root .ub h1,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-brand,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-name,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-hd,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-title,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-sec h3{
            font-family:var(--editorial-display)!important;font-weight:500!important;
            color:var(--text)!important;letter-spacing:0!important;
          }
          html[data-urppp-skin="editorial"] #navbar,
          html[data-urppp-skin="editorial"] .navbar{
            background:var(--surface)!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #sidebar,
          html[data-urppp-skin="editorial"] .sidebar{
            background:var(--surface)!important;border:0!important;border-right:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .breadcrumbs,
          html[data-urppp-skin="editorial"] #breadcrumbs{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-mask,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-mask,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-mask.open,
          html[data-urppp-skin="editorial"] #urppp-update-changelog.open{
            background:var(--editorial-overlay)!important;backdrop-filter:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uuc-panel{
            background:var(--surface)!important;color:var(--text)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uuc-head{
            background:var(--surface)!important;border-bottom:1px solid var(--editorial-line-strong)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uuc-body code{
            background:var(--input-bg)!important;border:0!important;border-bottom:1px solid var(--editorial-line-strong)!important;border-radius:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast .uut-btn,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uut-btn{
            background:transparent!important;color:var(--text)!important;border:0!important;border-bottom:1px solid transparent!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast .uut-btn:hover,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uut-btn:hover{
            border-bottom-color:currentColor!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-update-toast .uut-btn.primary,
          html[data-urppp-skin="editorial"] #urppp-update-changelog .uut-btn.primary{
            background:var(--text)!important;color:var(--bg)!important;border:1px solid var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .page-content p a,
          html[data-urppp-skin="editorial"] .page-content td a,
          html[data-urppp-skin="editorial"] .page-content .profile-info-value a,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-course-detail a{
            color:var(--text)!important;text-decoration-line:underline!important;
            text-decoration-color:transparent!important;text-underline-offset:3px!important;
            text-decoration-thickness:1px!important;transition:text-decoration-color 180ms ease-out!important;
          }
          html[data-urppp-skin="editorial"] .page-content p a:hover,
          html[data-urppp-skin="editorial"] .page-content td a:hover,
          html[data-urppp-skin="editorial"] .page-content .profile-info-value a:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-course-detail a:hover{
            text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] .widget-box,
          html[data-urppp-skin="editorial"] .widget-box.transparent,
          html[data-urppp-skin="editorial"] .panel,
          html[data-urppp-skin="editorial"] .panel-default,
          html[data-urppp-skin="editorial"] .well,
          html[data-urppp-skin="editorial"] .thumbnail,
          html[data-urppp-skin="editorial"] .infobox,
          html[data-urppp-skin="editorial"] .profile-user-info,
          html[data-urppp-skin="editorial"] .profile-user-info-striped,
          html[data-urppp-skin="editorial"] fieldset,
          html[data-urppp-skin="editorial"] .urppp-card,
          html[data-urppp-skin="editorial"] .urppp-stat-card,
          html[data-urppp-skin="editorial"] .urppp-db-card,
          html[data-urppp-skin="editorial"] .urppp-db-panel,
          html[data-urppp-skin="editorial"] #urppp-dashboard .widget-box{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] body .page-content .widget-box,
          html[data-urppp-skin="editorial"] body #page-content-template .widget-box,
          html[data-urppp-skin="editorial"] body .page-content .profile-user-info.setLabelWidth,
          html[data-urppp-skin="editorial"] body .page-content .profile-user-info-striped.setLabelWidth,
          html[data-urppp-skin="editorial"] #urppp-dashboard .urppp-card,
          html[data-urppp-skin="editorial"] #urppp-left .urppp-card{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .profile-info-row{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] .profile-info-name,
          html[data-urppp-skin="editorial"] .profile-info-value{
            background:transparent!important;color:var(--text)!important;border:0!important;
          }
          html[data-urppp-skin="editorial"] .modal-content,
          html[data-urppp-skin="editorial"] #urppp-settings-panel,
          html[data-urppp-skin="editorial"] #urppp-root .uc{
            background:var(--surface)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .dropdown-menu,
          html[data-urppp-skin="editorial"] .popover,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-drop{
            background:var(--surface)!important;color:var(--text)!important;border:0!important;
            border-top:1px solid var(--editorial-line)!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #drag-ul>li.ui-selecting,
          html[data-urppp-skin="editorial"] #drag-ul>li.ui-selected,
          html[data-urppp-skin="editorial"] #drag-ul>li.urppp-building-active,
          html[data-urppp-skin="editorial"] #drag-ol>li.ui-selecting,
          html[data-urppp-skin="editorial"] #drag-ol>li.ui-selected,
          html[data-urppp-skin="editorial"] #drag-ol>li.current-week,
          html[data-urppp-skin="editorial"] #test-drag>li.ui-selecting,
          html[data-urppp-skin="editorial"] #test-drag>li.ui-selected,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.highlighted,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.result-selected,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.highlighted em,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.result-selected em{
            background:var(--text)!important;color:var(--bg)!important;border-color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .dropdown-menu>li>a:hover,
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li{
            background:var(--surface)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .chosen-container .chosen-results li.highlighted{
            background:var(--input-bg)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .alert{
            border:0!important;border-left:2px solid currentColor!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .alert-success{background:var(--editorial-alert-success-bg)!important;color:var(--success)!important;}
          html[data-urppp-skin="editorial"] .alert-info{background:var(--editorial-alert-info-bg)!important;color:var(--info)!important;}
          html[data-urppp-skin="editorial"] .alert-warning{background:var(--editorial-alert-warning-bg)!important;color:var(--editorial-warning-text)!important;}
          html[data-urppp-skin="editorial"] .alert-danger{background:var(--editorial-alert-danger-bg)!important;color:var(--danger)!important;}
          html[data-urppp-skin="editorial"] .label,
          html[data-urppp-skin="editorial"] .badge{
            background:var(--text)!important;color:var(--bg)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .label-success,
          html[data-urppp-skin="editorial"] .badge-success{background:var(--success)!important;color:var(--editorial-on-status)!important;}
          html[data-urppp-skin="editorial"] .label-info,
          html[data-urppp-skin="editorial"] .badge-info{background:var(--info)!important;color:var(--editorial-on-status)!important;}
          html[data-urppp-skin="editorial"] .label-warning,
          html[data-urppp-skin="editorial"] .badge-warning{background:var(--warning)!important;color:var(--editorial-on-warning)!important;}
          html[data-urppp-skin="editorial"] .label-danger,
          html[data-urppp-skin="editorial"] .badge-danger{background:var(--danger)!important;color:var(--editorial-on-status)!important;}
          html[data-urppp-skin="editorial"] .page-header,
          html[data-urppp-skin="editorial"] .page-header h1{
            font-size:24px!important;line-height:1.25!important;
          }
          html[data-urppp-skin="editorial"] .widget-title,
          html[data-urppp-skin="editorial"] .urppp-card-title,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd{
            font-size:18px!important;line-height:1.3!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-title{
            font-size:24px!important;line-height:1.2!important;
          }
          html[data-urppp-skin="editorial"] .widget-header,
          html[data-urppp-skin="editorial"] .page-content .widget-box .widget-header,
          html[data-urppp-skin="editorial"] .panel-heading,
          html[data-urppp-skin="editorial"] .urppp-card-header,
          html[data-urppp-skin="editorial"] .modal-header{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .btn,
          html[data-urppp-skin="editorial"] a.btn,
          html[data-urppp-skin="editorial"] button.btn,
          html[data-urppp-skin="editorial"] .btn-default,
          html[data-urppp-skin="editorial"] .btn.btn-default,
          html[data-urppp-skin="editorial"] button.btn.btn-default,
          html[data-urppp-skin="editorial"] a.btn.btn-default,
          html[data-urppp-skin="editorial"] .btn-white,
          html[data-urppp-skin="editorial"] .btn.btn-white,
          html[data-urppp-skin="editorial"] button.btn.btn-white,
          html[data-urppp-skin="editorial"] a.btn.btn-white,
          html[data-urppp-skin="editorial"] #urppp-nav-clean,#urppp-nav-cal,
          html[data-urppp-skin="editorial"] #urppp-root .ut button,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar button,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd-tabs .uc-sa-tab,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab{
            border:0!important;border-radius:0!important;background:transparent!important;color:var(--text)!important;
            box-shadow:none!important;transform:none!important;text-decoration-line:underline!important;
            text-decoration-color:transparent!important;text-underline-offset:3px!important;text-decoration-thickness:1px!important;
            transition:color 180ms ease-out,text-decoration-color 180ms ease-out,opacity 120ms ease-out!important;
          }
          html[data-urppp-skin="editorial"] .btn:hover,
          html[data-urppp-skin="editorial"] a.btn:hover,
          html[data-urppp-skin="editorial"] button.btn:hover,
          html[data-urppp-skin="editorial"] .btn-default:hover,
          html[data-urppp-skin="editorial"] .btn.btn-default:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-default:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-default:hover,
          html[data-urppp-skin="editorial"] .btn-white:hover,
          html[data-urppp-skin="editorial"] .btn.btn-white:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-white:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-white:hover,
          html[data-urppp-skin="editorial"] #urppp-nav-clean:hover,#urppp-nav-cal:hover,
          html[data-urppp-skin="editorial"] #urppp-root .ut button:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn:hover{
            background:transparent!important;color:var(--primary-hover)!important;text-decoration-color:currentColor!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] .btn:active,
          html[data-urppp-skin="editorial"] a.btn:active,
          html[data-urppp-skin="editorial"] button.btn:active,
          html[data-urppp-skin="editorial"] #urppp-nav-clean:active,#urppp-nav-cal:active,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn:active{
            opacity:.65!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] .btn.btn-primary,
          html[data-urppp-skin="editorial"] button.btn.btn-primary,
          html[data-urppp-skin="editorial"] a.btn.btn-primary,
          html[data-urppp-skin="editorial"] .btn.btn-info,
          html[data-urppp-skin="editorial"] button.btn.btn-info,
          html[data-urppp-skin="editorial"] a.btn.btn-info,
          html[data-urppp-skin="editorial"] #urppp-root .ubtn,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn.primary,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn:not(.ghost){
            background:var(--text)!important;color:var(--surface)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;text-decoration:none!important;
          }
          html[data-urppp-skin="editorial"] .btn.btn-primary:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-primary:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-primary:hover,
          html[data-urppp-skin="editorial"] .btn.btn-info:hover,
          html[data-urppp-skin="editorial"] button.btn.btn-info:hover,
          html[data-urppp-skin="editorial"] a.btn.btn-info:hover,
          html[data-urppp-skin="editorial"] #urppp-root .ubtn:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-btn.primary:hover,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn:not(.ghost):hover{
            background:var(--primary-hover)!important;color:var(--bg)!important;border:0!important;box-shadow:none!important;
            transform:none!important;text-decoration:none!important;opacity:1!important;
          }
          html[data-urppp-skin="editorial"] .btn.btn-success{background:var(--success)!important;color:var(--editorial-on-status)!important;border:0!important;text-decoration:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-warning{background:var(--warning)!important;color:var(--editorial-on-warning)!important;border:0!important;text-decoration:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-danger{background:var(--danger)!important;color:var(--editorial-on-status)!important;border:0!important;text-decoration:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-success:hover,
          html[data-urppp-skin="editorial"] .btn.btn-success:focus{background:color-mix(in srgb,var(--success) 88%,var(--bg))!important;box-shadow:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-warning:hover,
          html[data-urppp-skin="editorial"] .btn.btn-warning:focus{background:color-mix(in srgb,var(--warning) 88%,var(--bg))!important;box-shadow:none!important;}
          html[data-urppp-skin="editorial"] .btn.btn-danger:hover,
          html[data-urppp-skin="editorial"] .btn.btn-danger:focus{background:color-mix(in srgb,var(--danger) 88%,var(--bg))!important;box-shadow:none!important;}
          html[data-urppp-skin="editorial"] .btn-app,
          html[data-urppp-skin="editorial"] .btn.btn-app.btn-info,
          html[data-urppp-skin="editorial"] #urppp-dashboard .btn-app,
          html[data-urppp-skin="editorial"] #personalApplication .btn-app{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] .btn-app:hover,
          html[data-urppp-skin="editorial"] .btn.btn-app.btn-info:hover,
          html[data-urppp-skin="editorial"] #urppp-dashboard .btn-app:hover,
          html[data-urppp-skin="editorial"] #personalApplication .btn-app:hover{
            background:var(--input-bg)!important;color:var(--text)!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] input.form-control,
          html[data-urppp-skin="editorial"] select.form-control,
          html[data-urppp-skin="editorial"] textarea.form-control,
          html[data-urppp-skin="editorial"] input[type="text"],
          html[data-urppp-skin="editorial"] input[type="search"],
          html[data-urppp-skin="editorial"] input[type="number"],
          html[data-urppp-skin="editorial"] input[type="password"],
          html[data-urppp-skin="editorial"] input[type="email"],
          html[data-urppp-skin="editorial"] input[type="tel"],
          html[data-urppp-skin="editorial"] input[type="url"],
          html[data-urppp-skin="editorial"] select,
          html[data-urppp-skin="editorial"] textarea,
          html[data-urppp-skin="editorial"] #urppp-root .ui,
          html[data-urppp-skin="editorial"] .chosen-container-single .chosen-single{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] input.form-control:focus,
          html[data-urppp-skin="editorial"] input[type="text"]:focus,
          html[data-urppp-skin="editorial"] input[type="search"]:focus,
          html[data-urppp-skin="editorial"] input[type="number"]:focus,
          html[data-urppp-skin="editorial"] input[type="password"]:focus,
          html[data-urppp-skin="editorial"] input[type="email"]:focus,
          html[data-urppp-skin="editorial"] input[type="tel"]:focus,
          html[data-urppp-skin="editorial"] input[type="url"]:focus,
          html[data-urppp-skin="editorial"] select:focus,
          html[data-urppp-skin="editorial"] textarea:focus,
          html[data-urppp-skin="editorial"] .chosen-container-active .chosen-single{
            border:0!important;border-bottom:1px solid var(--border-focus)!important;outline:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-root .ut{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;padding:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-root .ut button.ac{
            background:transparent!important;color:var(--text)!important;border-bottom:1px solid var(--text)!important;
            box-shadow:none!important;text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] .urppp-table-wrap,
          html[data-urppp-skin="editorial"] .table-responsive{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .table,
          html[data-urppp-skin="editorial"] table,
          html[data-urppp-skin="editorial"] .table-bordered,
          html[data-urppp-skin="editorial"] .dataTable{
            background:transparent!important;border:0!important;border-radius:0!important;border-collapse:collapse!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .table>thead>tr>th,
          html[data-urppp-skin="editorial"] .table>tbody>tr>th,
          html[data-urppp-skin="editorial"] .table>tbody>tr>td,
          html[data-urppp-skin="editorial"] .table>tfoot>tr>th,
          html[data-urppp-skin="editorial"] .table>tfoot>tr>td,
          html[data-urppp-skin="editorial"] .table-bordered>thead>tr>th,
          html[data-urppp-skin="editorial"] .table-bordered>tbody>tr>td,
          html[data-urppp-skin="editorial"] .dataTable>thead>tr>th,
          html[data-urppp-skin="editorial"] .dataTable>tbody>tr>td{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] .table>thead>tr>th,
          html[data-urppp-skin="editorial"] .table-bordered>thead>tr>th,
          html[data-urppp-skin="editorial"] .dataTable>thead>tr>th{
            background:transparent!important;color:var(--text-secondary)!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;font-weight:500!important;font-size:13px!important;
          }
          html[data-urppp-skin="editorial"] .table-hover>tbody>tr:hover>td,
          html[data-urppp-skin="editorial"] .table>tbody>tr:hover>td,
          html[data-urppp-skin="editorial"] .dataTable>tbody>tr:hover>td{
            background:var(--editorial-hover-soft)!important;
          }
          html[data-urppp-skin="editorial"] body .table>tbody>tr>td.green_background,
          html[data-urppp-skin="editorial"] body .table-bordered>tbody>tr>td.green_background,
          html[data-urppp-skin="editorial"] body .dataTable>tbody>tr>td.green_background,
          html[data-urppp-skin="editorial"] body td.green_background{
            background:var(--editorial-pass-bg)!important;color:var(--editorial-pass-text)!important;
          }
          html[data-urppp-skin="editorial"] body .table-hover>tbody>tr:hover>td.green_background{
            background:var(--editorial-pass-bg)!important;color:var(--editorial-pass-text)!important;
          }
          html[data-urppp-skin="editorial"] body .table>tbody>tr>td.red_background,
          html[data-urppp-skin="editorial"] body .table-bordered>tbody>tr>td.red_background,
          html[data-urppp-skin="editorial"] body .dataTable>tbody>tr>td.red_background,
          html[data-urppp-skin="editorial"] body td.red_background{
            background:var(--editorial-fail-bg)!important;color:var(--editorial-fail-text)!important;
          }
          html[data-urppp-skin="editorial"] body .table-hover>tbody>tr:hover>td.red_background{
            background:var(--editorial-fail-bg)!important;color:var(--editorial-fail-text)!important;
          }
          html[data-urppp-skin="editorial"] .list-group{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .list-group-item{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .list-group-item:hover{
            background:var(--input-bg)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .list-group-item.active{
            background:var(--editorial-active)!important;color:var(--text)!important;border-color:var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] .nav-tabs{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .nav-tabs>li>a{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;
            border-bottom:1px solid transparent!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .nav-tabs>li.active>a,
          html[data-urppp-skin="editorial"] .nav-tabs>li>a:hover{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--text)!important;
          }
          html[data-urppp-skin="editorial"] .pagination>li>a,
          html[data-urppp-skin="editorial"] .pagination>li>span{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .pagination>.active>a,
          html[data-urppp-skin="editorial"] .pagination>li>a:hover{
            background:var(--text)!important;color:var(--surface)!important;
          }
          html[data-urppp-skin="editorial"] .nav-list>li>a,
          html[data-urppp-skin="editorial"] .urppp-nav-link{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .nav-list>li.active>a,
          html[data-urppp-skin="editorial"] .nav-list>li>a:hover,
          html[data-urppp-skin="editorial"] .urppp-nav-link:hover{
            background:var(--editorial-hover)!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .urppp-stat-card{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            padding-top:18px!important;padding-bottom:18px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .urppp-stat-card .label{
            background:transparent!important;color:var(--text-secondary)!important;
          }
          html[data-urppp-skin="editorial"] .urppp-stat-card:hover{
            background:var(--editorial-hover-soft)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .tabContent h3::before{
            background:transparent!important;color:var(--text-muted)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;font-family:var(--editorial-display)!important;font-size:13px!important;font-weight:500!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .tabContent h3 a,
          html[data-urppp-skin="editorial"] #urppp-dashboard #notices h3 a,
          html[data-urppp-skin="editorial"] #notices h3 a{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-dashboard .tabContent h3 a:hover,
          html[data-urppp-skin="editorial"] #urppp-dashboard #notices h3 a:hover,
          html[data-urppp-skin="editorial"] #notices h3 a:hover{
            background:var(--editorial-hover-soft)!important;border-bottom-color:var(--editorial-line-strong)!important;
          }
          html[data-urppp-skin="editorial"] body table.urppp-notice-table>tbody>tr,
          html[data-urppp-skin="editorial"] body table.urppp-notice-table.table-striped>tbody>tr:nth-of-type(odd),
          html[data-urppp-skin="editorial"] body table.urppp-notice-table.table-striped>tbody>tr:nth-of-type(even),
          html[data-urppp-skin="editorial"] body .urppp-notice-card{
            background:transparent!important;background-color:transparent!important;
            border:0!important;border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] body table.urppp-notice-table>tbody>tr.urppp-notice-row:hover,
          html[data-urppp-skin="editorial"] body table.urppp-notice-table>tbody>tr.urppp-notice-row.hover{
            background:var(--editorial-hover-soft)!important;background-color:var(--editorial-hover-soft)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable{
            background:transparent!important;border:0!important;border-collapse:collapse!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #courseTable th{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable td{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable td:first-child{
            background:transparent!important;color:var(--text-secondary)!important;
            border-right:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #courseTable .class_div.box_font,
          html[data-urppp-skin="editorial"] #courseTable div[class*="div-kcb"]{
            border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc,
          html[data-urppp-skin="editorial"] #urppp-left #main-calendar,
          html[data-urppp-skin="editorial"] #urppp-left .fc-view{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-widget-header,
          html[data-urppp-skin="editorial"] #urppp-left .fc-widget-content{
            background:transparent!important;border-color:var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-button,
          html[data-urppp-skin="editorial"] #urppp-left button.fc-button,
          html[data-urppp-skin="editorial"] #urppp-left .fc-state-default{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;text-decoration-line:underline!important;text-decoration-color:transparent!important;
            text-underline-offset:3px!important;text-decoration-thickness:1px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-button:hover,
          html[data-urppp-skin="editorial"] #urppp-left .fc-state-active{
            background:transparent!important;color:var(--text)!important;text-decoration-color:currentColor!important;
            box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-left .fc-toolbar .fc-center h2,
          html[data-urppp-skin="editorial"] #urppp-left .fc-toolbar h2{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;font-family:var(--editorial-display)!important;font-weight:500!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-head,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tabs{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab:hover{
            background:transparent!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac::after{
            height:1px!important;background:var(--text)!important;border-radius:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-sec{
            border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            padding-bottom:22px!important;margin-bottom:22px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn.ghost{
            background:transparent!important;color:var(--text)!important;border:0!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode:hover:not(:disabled),
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow:hover:not(:disabled),
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-btn.ghost:hover:not(:disabled){
            background:var(--editorial-hover)!important;border-bottom-color:var(--text)!important;color:var(--primary-hover)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-mode.ac,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-follow.ac{
            background:var(--editorial-active)!important;color:var(--text)!important;
            border-bottom:1px solid var(--text)!important;
          }
          html.urppp-theme-dark[data-urppp-skin="editorial"] body #urppp-settings-panel .urppp-set-mode.ac,
          html.urppp-theme-dark[data-urppp-skin="editorial"] body #urppp-settings-panel .urppp-set-mode[data-theme="dark"]{
            background:var(--editorial-active)!important;color:var(--text)!important;
            border:0!important;border-bottom:1px solid var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme:hover,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme.ac{
            background:var(--editorial-hover-soft)!important;border-bottom-color:var(--text)!important;outline:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-scheme-preview span{
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-top,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar{
            background:var(--surface)!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar{
            border-bottom:0!important;border-top:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-tabbar button.ac{
            text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd-tabs .uc-sa-tab.ac,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac{
            color:var(--primary)!important;text-decoration-color:currentColor!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd-tabs .uc-sa-tab.ac::after,
          html[data-urppp-skin="editorial"] #urppp-settings-panel .urppp-set-tab.ac::after{display:none!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-shell{
            padding:28px 36px 36px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-desktop,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-col{
            gap:24px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-card{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          /* 编辑杂志：分析图表卡去掉背景框，融入版面 */
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-sa-chart-card,
          html[data-urppp-skin="editorial"] #urppp-score-analysis .urppp-sa-card{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          /* 编辑杂志：跳转按钮去背景块，改细线文字链接 */
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-sa-more{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
            color:var(--primary)!important;text-decoration:underline!important;text-underline-offset:3px!important;text-decoration-thickness:1px!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-sa-more:hover{
            background:transparent!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-card:hover{
            border:0!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-hd,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-hd,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-ft{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-ft{
            border-bottom:0!important;border-top:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-avatar,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-avatar img{
            border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-card:hover .uc-avatar{transform:none!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-gpa{
            background:var(--text)!important;color:var(--surface)!important;border:0!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-grid-cell{
            background:transparent!important;border:0!important;border-bottom:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-lesson{
            border:0!important;border-left:3px solid var(--uc-course-color,var(--text))!important;
            border-radius:0!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-lesson:hover{
            box-shadow:none!important;transform:none!important;filter:contrast(1.02)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-course-sub{
            background:transparent!important;border:0!important;border-top:1px solid var(--editorial-line)!important;
            border-radius:0!important;box-shadow:none!important;padding-left:0!important;padding-right:0!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-cd-chip,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-attr-pill{
            background:transparent!important;color:var(--text-secondary)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-badge{
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-badge{
            background:var(--text)!important;color:var(--bg)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.pass{
            background:var(--editorial-pass-bg)!important;color:var(--editorial-pass-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.fail{
            background:var(--editorial-fail-bg)!important;color:var(--editorial-fail-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.uneval{
            background:var(--editorial-info-bg)!important;color:var(--editorial-info-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell.uneval-fail{
            background:var(--editorial-warn-bg)!important;color:var(--editorial-warn-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-grid{gap:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
            padding:16px!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane:nth-child(even){
            border-left:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane:hover{
            background:var(--editorial-hover-soft)!important;border-color:var(--editorial-line)!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane h5{
            font-family:var(--editorial-display)!important;font-weight:500!important;color:var(--text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metrics{gap:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
            padding:8px 12px!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric+.uc-metric{
            border-left:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric:hover,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric:hover b{
            border-color:var(--editorial-line)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric b{
            font-family:var(--editorial-display)!important;font-weight:500!important;
          }
          html[data-urppp-skin="editorial"] .urppp-stat-card .value,
          html[data-urppp-skin="editorial"] .table td,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-metric b,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-cell{
            font-variant-numeric:tabular-nums!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-services{gap:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-left:1px solid var(--editorial-line)!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:nth-child(7n+1){border-left:0!important;}
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:hover{
            background:var(--editorial-hover)!important;color:var(--text)!important;
            border-color:var(--editorial-line)!important;box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc svg,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:hover svg{
            color:var(--text)!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal{
            background:var(--surface)!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root #uc-score-wrap,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-occ{
            background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table th,
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table td{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table thead th{
            background:var(--bg)!important;color:var(--text-secondary)!important;
            border-bottom:1px solid var(--editorial-line-strong)!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table tbody tr:nth-child(even) td{
            background:transparent!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table tbody tr:hover td{
            background:var(--editorial-hover-soft)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root table.uc-table tbody tr.is-on td{
            background:var(--editorial-active)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-build-grid button{
            background:transparent!important;color:var(--text)!important;border:0!important;
            border-bottom:1px solid var(--editorial-line)!important;border-radius:0!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-build-grid button:hover{
            background:var(--editorial-hover)!important;border-bottom-color:var(--text)!important;
            box-shadow:none!important;transform:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-occ-table th{
            background:transparent!important;border-radius:0!important;border-bottom:1px solid var(--editorial-line)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-legend i{
            border-radius:0!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.free{
            background:var(--input-bg)!important;border-color:var(--editorial-line-strong)!important;color:var(--text-muted)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-course,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.busy{
            background:var(--editorial-slot-course-bg)!important;border-color:var(--editorial-slot-course-border)!important;color:var(--editorial-slot-course-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-exam{
            background:var(--editorial-slot-exam-bg)!important;border-color:var(--editorial-slot-exam-border)!important;color:var(--editorial-slot-exam-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-lab{
            background:var(--editorial-slot-lab-bg)!important;border-color:var(--editorial-slot-lab-border)!important;color:var(--editorial-slot-lab-text)!important;
          }
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-slot.kind-borrow{
            background:var(--editorial-slot-borrow-bg)!important;border-color:var(--editorial-slot-borrow-border)!important;color:var(--editorial-slot-borrow-text)!important;
          }
          html[data-urppp-skin="editorial"] .urppp-nav-dot,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-top-theme .urppp-nav-dot{
            border-radius:50%!important;box-shadow:none!important;
          }
          html[data-urppp-skin="editorial"] .urppp-nav-dot.ac,
          html[data-urppp-skin="editorial"] #urppp-nav-theme .urppp-nav-dot.ac,
          html[data-urppp-skin="editorial"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{
            border-color:var(--text)!important;outline:1px solid var(--text)!important;outline-offset:2px!important;
          }
          html[data-urppp-skin="editorial"] a:focus-visible,
          html[data-urppp-skin="editorial"] button:focus-visible,
          html[data-urppp-skin="editorial"] [tabindex]:focus-visible{
            outline:1px solid var(--text)!important;outline-offset:3px!important;
          }
          @media (max-width:900px){
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-shell{
              padding:14px 12px 88px!important;
            }
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-desktop,
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-col{
              gap:18px!important;
            }
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-score-pane:nth-child(even){
              border-left:0!important;border-top:1px solid var(--editorial-line)!important;
            }
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:nth-child(7n+1){border-left:1px solid var(--editorial-line)!important;}
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-svc:nth-child(4n+1){border-left:0!important;}
            html[data-urppp-skin="editorial"] #urppp-clean-root .uc-modal-ft{box-shadow:none!important;}
          }
          @media (prefers-reduced-motion:reduce){
            html[data-urppp-skin="editorial"] *,
            html[data-urppp-skin="editorial"] *::before,
            html[data-urppp-skin="editorial"] *::after{transition:none!important;}
          }
        `);e.textContent=o;let i=document.head||document.documentElement;e.parentNode===i&&i.lastElementChild!==e&&i.appendChild(e)}catch(e){try{console.warn("[URP++] applySkinAttr",e)}catch{}}setTimeout(()=>{try{Qt(document)}catch{}},0)}a(ae,"applySkinAttr");function Jo(t){let e=u.find(i=>i.id===t&&i.ready&&(i.installed!==!1||de(i.id))),r=!e&&ye()[t]&&de(t)?{id:t,ready:!0,installed:!1}:null,o=e||r;if(!o)return!1;GM_setValue(d,o.id);try{o.dynamic||Ca(!1),!o.dark&&Kt()&&$r(!1);let i=Kt(),s=i?xe():Jt(),l=cr(s,e.id)?s:"default";ae(),Gt(l,{system:i})}catch{try{ae()}catch{}}try{jt()}catch{}try{xt()}catch{}try{let i=document.getElementById("urppp-clean-root");i&&typeof i.__syncCleanThemeDots=="function"&&i.__syncCleanThemeDots()}catch{}return!0}a(Jo,"setSkin");function ms(){if(!window.__urpppSystemThemeBound&&window.matchMedia){window.__urpppSystemThemeBound=!0;try{let t=window.matchMedia("(prefers-color-scheme: dark)"),e=a(()=>{if(Kt())try{Gt(xe(),{system:!0})}catch{}},"onChange");t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}catch{}}}a(ms,"bindSystemThemeListener");try{Kt()?Gt(xe(),{system:!0}):Gt(Jt())}catch{}try{ae()}catch{}try{ms()}catch{}function bs(t){let e=String(document.body&&document.body.innerText||t&&t.innerText||"").replace(/\s+/g," ").trim(),r=[/token\s*校验失败[！!]?/i,/令牌\s*校验失败[！!]?/i,/验证码.{0,12}(?:错误|失败|过期)[！!]?/i,/(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,/登录.{0,12}(?:错误|失败)[！!]?/i];for(let o of r){let i=e.match(o);if(i)return i[0].trim()}return""}a(bs,"extractLoginErrorMessage");function Yo(){let t=location.pathname,e=document.getElementById("formContent"),r=document.querySelector(".form-signin");if(!e||!r){setTimeout(Yo,50);return}if(e.querySelector(":scope > #urppp-root"))return;let o=bs(e),i=r.querySelector('a[onclick*="toModifyPwd"]'),s=(()=>{let R=e.querySelector(".fadeIn.first svg");return R?R.outerHTML:""})(),l=(()=>{let R=document.querySelector("#tocas a");return R?R.href:"https://id.scu.edu.cn/"})();for(let R of e.children)R.style.display="none";e.style.cssText="max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;";let b=location.pathname==="/loginEn",m=a((R,F)=>b?F:R,"t");e.insertAdjacentHTML("afterbegin",`
    <div id="urppp-root">
      <style>
        #urppp-root,#urppp-root *{box-sizing:border-box;}
        #urppp-root *{border:0;outline:0;}

        /* 全局背景同步主题 */
        html,body{background:var(--bg)!important;min-height:100vh}
        .wrapper{background:transparent!important}

        /* 卡片入场 */
        @keyframes uf{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .uc{animation:uf .4s ease-out}

        .uc{
          background:var(--surface);
          border-radius:var(--radius);
          box-shadow:var(--shadow);
          padding:48px 44px 36px;
        }

        /* === Brand === */
        .ub-logo{
          width:80px;height:80px;margin:0 auto 24px;
          display:none;
        }
        .ub-logo.show{display:flex;align-items:center;justify-content:center}
        .ub-logo svg{width:100%!important;height:100%!important;display:block}
        .ub h1{
          font-size:22px;font-weight:600;color:var(--text);
          text-align:center;letter-spacing:2px;line-height:1.4;margin:0;
        }
        .ub p{
          font-size:13px;color:var(--text-secondary);
          text-align:center;margin-top:6px;letter-spacing:1px;
        }

        /* === Tabs === */
        .ut{
          display:flex;margin:36px 0 32px;
          background:var(--input-bg);border-radius:var(--radius-sm);
          padding:4px;gap:4px;
        }
        .ut button{
          flex:1;padding:10px 0;
          border-radius:8px;cursor:pointer;
          font-size:14px;font-weight:500;
          color:var(--text-secondary);
          background:transparent;transition:all .2s;
          font-family:inherit;
        }
        .ut button.ac{
          background:var(--surface);color:var(--text);
          font-weight:600;box-shadow:0 1px 3px rgba(0,0,0,.05);
        }
        .ut button:hover:not(.ac){color:var(--text)}

        #urppp-root .urppp-login-error{
          margin:-16px 0 22px;padding:11px 13px;
          border:1px solid color-mix(in srgb,var(--danger,#b42318) 34%,var(--border));
          border-radius:var(--radius-sm);
          background:color-mix(in srgb,var(--danger,#b42318) 8%,var(--surface));
          color:var(--danger,#b42318);font-size:13px;line-height:1.5;text-align:center;
        }

        /* === Form === */
        .ufg{margin-bottom:20px}
        .ufg:last-of-type{margin-bottom:0}
        .ufl{
          display:block;font-size:13px;font-weight:500;
          color:var(--text);margin-bottom:8px;letter-spacing:.5px;
        }
        #urppp-root .ui{
          display:block;width:100%;height:46px;padding:0 14px;
          background:var(--input-bg) !important;
          border:1.5px solid var(--border) !important;
          border-radius:var(--radius-sm);
          font-size:15px;color:var(--text) !important;
          font-family:inherit;
          transition:border-color .2s,box-shadow .2s;
        }
        #urppp-root .ui:focus{
          border-color:var(--border-focus) !important;
          box-shadow:0 0 0 3px var(--ring) !important;
        }
        #urppp-root .ui::placeholder{color:var(--text-muted)}

        /* 验证码行：图片放在输入框内部右侧，确保总长度与其他输入框一致 */
        #urppp-root .ucr{
          width:100% !important;
          margin-bottom:0 !important;
        }
        #urppp-root .ufg-cap{
          margin-bottom:0 !important;
        }
        #urppp-root .ucap-input-wrap{
          position:relative !important;
          width:100% !important;
        }
        #urppp-root .ucap-input-wrap .ui{
          padding-right:148px !important;
        }
        #urppp-root .uci-wrap{
          position:absolute !important;
          right:-2px !important;
          top:50% !important;
          transform:translateY(-50%) !important;
          width:144px !important;
          height:41px !important;
          border-radius:var(--radius-sm) !important;
          overflow:hidden !important;
          background:var(--input-bg) !important;
          cursor:pointer !important;
          box-shadow:0 0 0 1px var(--border) !important;
        }
        #urppp-root .uci{
          display:block !important;
          width:100% !important;
          height:100% !important;
          object-fit:cover !important;
          transform:scale(1.16) !important;
        }

        /* === Button（Apple 胶囊主按钮）===
         */
        .ubtn{
          display:flex;align-items:center;justify-content:center;
          width:100%;height:48px;margin-top:28px;
          background:var(--primary);color:#fff;
          border-radius:999px;
          font-size:15px;font-weight:500;
          font-family:inherit;
          cursor:pointer;letter-spacing:0.2px;
          transition:background .2s ease,transform .15s ease,box-shadow .2s ease;
        }
        .ubtn:hover{
          background:var(--primary-hover);
          box-shadow:0 4px 14px var(--ring);
        }
        .ubtn:active{transform:scale(.98)}

        /* === Footer === */
        .uft{
          display:flex;justify-content:center;gap:20px;
          margin-top:20px;font-size:13px;
        }
        .uft a{
          color:var(--text-secondary);text-decoration:none;
          transition:color .2s;
        }
        .uft a:hover{color:var(--primary)}

        /* === 主题 === */
        .us{
          display:flex;justify-content:center;gap:8px;margin-top:24px;
          padding-top:20px;border-top:1px solid var(--border);
        }
        .us span{
          width:22px;height:22px;border-radius:50%;
          cursor:pointer;border:2px solid var(--border);
          transition:all .2s;
        }
        .us span.ac{
          border-color:var(--primary);
          transform:scale(1.15);
        }
        .us span:hover{border-color:var(--text-secondary)}
      </style>

      <div class="uc">
        <div class="ub" id="urppp-brand">
          <div class="ub-logo">${s||""}</div>
          <h1>${m("四川大学教务管理系统","SCU Academic System")}</h1>
          <p>${m("学生端 · 欢迎登录","Student Portal · Welcome")}</p>
        </div>

        <div class="ut" id="urppp-tabs">
          <button class="ac" data-mode="account">${m("账号登录","Account")}</button>
          <button data-mode="sso">${m("统一认证","SSO")}</button>
        </div>

        ${o?`<div class="urppp-login-error" role="alert">${at(o)}</div>`:""}

        <div class="ufb" id="urppp-form">
          <div class="ufg">
            <label class="ufl" for="urppp-user">${m("学号","Student ID")}</label>
            <input class="ui" id="urppp-user" type="text" placeholder="${m("请输入学号","Enter student ID")}" autocomplete="username">
          </div>
          <div class="ufg">
            <label class="ufl" for="urppp-pass">${m("密码","Password")}</label>
            <input class="ui" id="urppp-pass" type="password" placeholder="${m("请输入密码","Enter password")}" autocomplete="current-password">
          </div>
          <div class="ucr">
            <div class="ufg ufg-cap">
              <label class="ufl" for="urppp-cap">${m("验证码","Captcha")}</label>
              <div class="ucap-input-wrap">
                <input class="ui" id="urppp-cap" type="text" placeholder="${m("请输入","Enter")}" maxlength="4" autocomplete="off">
                <div class="uci-wrap" id="urppp-capwrap" title="${m("点击刷新","Refresh")}">
                  <img class="uci" id="urppp-capimg" src="" alt="Captcha">
                </div>
              </div>
            </div>
          </div>
          <button class="ubtn" id="urppp-submit">${m("登 录","Sign In")}</button>
        </div>

        <div class="uft">
          <a href="javascript:void(0)" id="urppp-forgot">${m("忘记密码？","Forgot password?")}</a>
          <a href="${b?"/login":"/loginEn"}">${b?"中文":"EN"}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F5F5F7;box-shadow:inset 0 0 0 1px #D2D2D7"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="动态配色" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);let _=e.querySelector("#urppp-root");[["#urppp-user","#input_username"],["#urppp-pass","#input_password"],["#urppp-cap","#input_checkcode"]].forEach(([R,F])=>{let K=_.querySelector(R),ut=document.querySelector(F);K&&ut&&(ut.value&&(K.value=ut.value),K.addEventListener("input",()=>{ut.value=K.value}))});let M=_.querySelector("#urppp-capimg"),N=_.querySelector("#urppp-capwrap"),z=document.querySelector(".form-signin img");if(M&&z){M.src=z.src;let R=a(()=>{let F=z.src.replace(/\?.*/,"")+"?"+Date.now();z.src=F,M.src=F},"refreshCap");N?N.addEventListener("click",R):M.addEventListener("click",R)}_.querySelectorAll(".ut button").forEach(R=>{R.addEventListener("click",()=>{if(R.dataset.mode==="sso"){location.href=l;return}_.querySelectorAll(".ut button").forEach(ut=>ut.classList.remove("ac")),R.classList.add("ac");let F=_.querySelector("#urppp-form"),K=_.querySelector("#urppp-sso");F&&(F.style.display="block"),K&&(K.style.display="none")})});let D=_.querySelector("#urppp-submit");D.addEventListener("click",()=>{if(D.dataset.submitting==="1")return;D.dataset.submitting="1",D.disabled=!0;let R=document.getElementById("loginButton");R?R.click():typeof r.requestSubmit=="function"?r.requestSubmit():r.submit(),setTimeout(()=>{D.dataset.submitting="0",D.disabled=!1},1500)}),_.querySelectorAll(".ui").forEach(R=>{R.addEventListener("keydown",F=>{F.key==="Enter"&&D.click()})}),_.querySelector("#urppp-forgot").addEventListener("click",R=>{R.preventDefault(),i&&i.click()});let V=_.querySelector("#urppp-dots"),O=a(()=>{if(!V)return;let R=Jt();V.querySelectorAll("span").forEach(K=>{K.classList.toggle("ac",K.dataset.theme===R)});let F=V.querySelector('span[data-theme="scu-red"]');if(F){let K=Xt()||bt;try{let ut=Zt(K,De());F.style.background="linear-gradient(135deg, "+ut.primary+" 0 55%, "+ut.surface+" 55% 100%)"}catch{F.style.background=K}}},"syncLoginDots");V&&(V.querySelectorAll("span").forEach(R=>{R.addEventListener("click",()=>{Gt(R.dataset.theme,{manual:!0}),O()})}),O()),console.log("[URP++] 登录界面已重建"),setTimeout(()=>{document.body.classList.add("urppp-ready"),kt()},100)}a(Yo,"rebuild");let{beautifyBreadcrumbs:Dr}=Zi({});function La(){try{document.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(t=>{if(t.classList.contains("setLabelWidth")||t.classList.contains("urppp-query-form")||t.querySelector(".urppp-query-pair"))return;let e=Array.from(t.querySelectorAll(":scope > .profile-info-row, .profile-info-row"));!e.length||e.some(o=>Array.from(o.children).filter(i=>i.classList&&i.classList.contains("profile-info-name")).length>=2)||(t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("display","block","important"),Hr(t),e.forEach(o=>{o.classList.remove("urppp-query-row","urppp-dual-pair"),delete o.dataset.urpppQueryDone,delete o.dataset.urpppQueryCols;let i=Array.from(o.querySelectorAll(":scope > .urppp-query-pair"));if(i.length){let s=[];for(i.forEach(l=>Array.from(l.children).forEach(b=>s.push(b)));o.firstChild;)o.removeChild(o.firstChild);s.forEach(l=>o.appendChild(l))}o.style.setProperty("display","grid","important"),o.style.setProperty("grid-template-columns","140px minmax(0,1fr)","important"),o.style.setProperty("align-items","stretch","important"),o.style.setProperty("width","100%","important"),Array.from(o.children).forEach(s=>{s.classList&&(s.style.setProperty("float","none","important"),s.style.setProperty("margin-left","0","important"),s.style.setProperty("width","auto","important"),s.style.setProperty("max-width","none","important"),s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.style.setProperty("box-sizing","border-box","important"))})}))})}catch(t){console.warn("[URP++] single pair profile fix failed",t)}}a(La,"fixSinglePairProfileForms");function jr(){let t=document.querySelector(".page-content")||document.getElementById("page-content-template");t&&(t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{if(!e.querySelector(".setLabelWidth"))return;let r=e.querySelector(".setLabelWidth");r&&(e.querySelectorAll("h4.header, h3.header, .header.smaller, .header").forEach(o=>{r.contains(o)||o.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING&&(o.classList.add("urppp-section-label"),["background","background-color","background-image","border","box-shadow","border-radius","padding","margin","min-height"].forEach(i=>{o.style.removeProperty(i)}),o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("background-image","none","important"),o.style.setProperty("border","0 none transparent","important"),o.style.setProperty("box-shadow","none","important"),o.style.setProperty("border-radius","0","important"),o.style.setProperty("padding","4px 2px 10px","important"),o.style.setProperty("margin","0 0 8px 0","important"),o.style.setProperty("min-height","0","important"))}),r.classList.remove("urppp-query-form"),r.style.setProperty("padding","0","important"),r.style.setProperty("overflow","hidden","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("border",Re(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-shadow","none","important"))}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.querySelectorAll(".profile-info-row").forEach(r=>{r.classList.remove("urppp-query-row"),delete r.dataset.urpppQueryDone,delete r.dataset.urpppQueryCols;let o=Array.from(r.querySelectorAll(":scope > .urppp-query-pair"));if(o.length){let i=[];for(o.forEach(s=>{Array.from(s.children).forEach(l=>i.push(l))});r.firstChild;)r.removeChild(r.firstChild);i.forEach(s=>r.appendChild(s))}})}),t.querySelectorAll(".setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row").forEach(e=>{let r=Array.from(e.querySelectorAll(":scope > .urppp-query-pair"));if(r.length){let s=[];for(r.forEach(l=>{Array.from(l.children).forEach(b=>s.push(b))});e.firstChild;)e.removeChild(e.firstChild);s.forEach(l=>e.appendChild(l))}e.classList.remove("urppp-query-row"),delete e.dataset.urpppQueryDone,delete e.dataset.urpppQueryCols;let o=Array.from(e.children).filter(s=>s.classList&&(s.classList.contains("profile-info-name")||s.classList.contains("profile-info-value")));o.filter(s=>s.classList.contains("profile-info-name")).length>=2?(e.classList.add("urppp-dual-pair"),e.style.setProperty("display","grid","important"),e.style.setProperty("grid-template-columns","112px minmax(140px,1fr) 112px minmax(140px,1fr)","important"),e.style.setProperty("align-items","stretch","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("float","none","important"),o.forEach(s=>{s.style.setProperty("float","none","important"),s.style.setProperty("clear","none","important"),s.style.setProperty("margin","0","important"),s.style.setProperty("margin-left","0","important"),s.style.setProperty("width","auto","important"),s.style.setProperty("max-width","none","important"),s.style.setProperty("min-width","0","important"),s.style.setProperty("box-sizing","border-box","important"),s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.classList.contains("profile-info-value")?(s.style.removeProperty("width"),s.style.setProperty("width","auto","important"),s.style.setProperty("justify-content","flex-start","important"),s.style.setProperty("white-space","normal","important"),s.style.setProperty("word-break","normal","important")):(s.style.setProperty("justify-content","flex-end","important"),s.style.setProperty("white-space","nowrap","important"))})):e.classList.remove("urppp-dual-pair")}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.style.cssText=(e.getAttribute("style")||"").replace(/padding\s*:[^;]+;?/gi,""),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("overflow","hidden","important"),e.style.setProperty("border",Re(),"important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("box-sizing","border-box","important"),e.style.setProperty("margin","0 0 16px 0","important"),e.style.setProperty("padding","0","important");let r=e.closest(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8")||e.parentElement;r&&Array.from(r.querySelectorAll("h4.header, h3.header, .header.smaller")).forEach(o=>{e.contains(o)||o.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING&&(o.classList.add("urppp-section-label"),o.style.setProperty("background","transparent","important"),o.style.setProperty("background-color","transparent","important"),o.style.setProperty("background-image","none","important"),o.style.setProperty("border","0 none transparent","important"),o.style.setProperty("box-shadow","none","important"),o.style.setProperty("border-radius","0","important"),o.style.setProperty("padding","4px 2px 10px","important"),o.style.setProperty("margin","0 0 8px 0","important"),o.style.setProperty("min-height","0","important"))})}),t.querySelectorAll(".urppp-col-row").forEach(e=>{e.classList.remove("urppp-col-row"),["display","flex-wrap","gap","align-items","width","box-sizing"].forEach(r=>e.style.removeProperty(r))}),t.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach(e=>{["float","flex","width","max-width","padding-left","padding-right","box-sizing"].forEach(r=>{e.style.getPropertyPriority(r)==="important"&&e.style.removeProperty(r)}),e.style.setProperty("padding-left","0","important"),e.style.setProperty("box-sizing","border-box","important")}),t.querySelectorAll(".col-xs-4, .col-sm-4, .col-md-4").forEach(e=>{e.style.setProperty("padding-right","16px","important")}),t.querySelectorAll(".col-xs-8, .col-sm-8, .col-md-8").forEach(e=>{e.style.setProperty("padding-left","0","important"),e.style.setProperty("padding-right","0","important")}),t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{e.querySelector(".setLabelWidth")&&e.querySelectorAll(":scope > h4.header, :scope > .header, :scope > .header.smaller").forEach(r=>{r.style.cssText+=";background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;"})}),t.querySelectorAll(".urppp-section-title-wrap").forEach(e=>{let r=e.querySelector("h4.header, h3.header, h5.header, .header.smaller");if(!r){e.remove();return}let o=e.nextElementSibling;for(;o&&!o.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]');)o=o.nextElementSibling;let i=o&&(o.querySelector(".col-xs-4, .col-sm-4, .col-md-4")||Array.from(o.children).find(s=>/col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(s.className||"")));i&&(i.insertBefore(r,i.firstChild),delete r.dataset.urpppHoisted,r.style.removeProperty("width"),r.style.removeProperty("max-width"),r.style.removeProperty("margin-left"),r.style.removeProperty("margin-right"),r.style.removeProperty("box-sizing"),r.style.removeProperty("position"),r.style.removeProperty("left")),e.remove()}))}a(jr,"alignRollInfoLayout");function Or(){let t=typeof unsafeWindow<"u"?unsafeWindow:window;return t.jQuery||t.$||window.jQuery||window.$||null}a(Or,"pageJQuery");function hs(t){return t?t.id&&String(t.id).indexOf("pagination_pageSize_")===0?!0:!!(t.closest&&t.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]')):!1}a(hs,"isPagebarSelect");function Qo(t){if(t){try{let e=Or();e&&e.fn&&e(t).data("chosen")&&e(t).chosen("destroy")}catch{}try{if(t.parentElement&&t.parentElement.querySelectorAll(":scope > .chosen-container").forEach(e=>{try{e.remove()}catch{}}),t.nextElementSibling&&t.nextElementSibling.classList.contains("chosen-container"))try{t.nextElementSibling.remove()}catch{}}catch{}t.classList.remove("urppp-chosen-hidden","chzn-done","chosen");try{delete t.dataset.urpppChosen}catch{}t.style.setProperty("display","inline-block","important")}}a(Qo,"destroyPagebarChosen");let Xo=0,Ko=!1;function fs(){if(Ko)return;Ko=!0;let t=a(e=>{if(Date.now()<Xo){try{e.preventDefault()}catch{}try{e.stopPropagation()}catch{}}},"guard");document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",t,!0),document.addEventListener("click",t,!0)}a(fs,"bindChosenPickGuard");function qa(t){if(!t||t.__urpppChosenNoPierce)return;t.__urpppChosenNoPierce=!0,fs();let e=t.querySelector(".chosen-drop"),r=a(o=>{let i=o.target;!i||!i.closest||!i.closest(".chosen-results li")||(Xo=Date.now()+350)},"onPick");t.addEventListener("mouseup",r,!1),t.addEventListener("touchend",r,!1),e&&(e.addEventListener("mouseup",r,!1),e.addEventListener("touchend",r,!1))}a(qa,"bindChosenNoPierce");function Ta(t=document){try{t.querySelectorAll(".chosen-container").forEach(qa)}catch{}}a(Ta,"bindAllChosenNoPierce");function ve(){try{let t=Or();if(!t||!t.fn||typeof t.fn.chosen!="function")return!1;let e=document.querySelectorAll(".profile-user-info, .urppp-query-form, .profile-info-row, form"),r=new Set,o=[];if(e.forEach(i=>{i.querySelectorAll("select").forEach(s=>{r.has(s)||(r.add(s),o.push(s))})}),document.querySelectorAll("select.value_element, .profile-info-value > select").forEach(i=>{r.has(i)||(r.add(i),o.push(i))}),o.forEach(i=>{if(!i||i.multiple||i.disabled||i.size&&i.size>1)return;if(hs(i)){Qo(i);return}let s=t(i);if(!!s.data("chosen")||i.classList.contains("chzn-done")||!!(i.nextElementSibling&&i.nextElementSibling.classList.contains("chosen-container"))||!!(i.parentElement&&i.parentElement.querySelector(":scope > .chosen-container"))){i.dataset.urpppChosen="1",i.classList.add("urppp-chosen-hidden"),i.style.setProperty("display","none","important");let b=i.nextElementSibling&&i.nextElementSibling.classList.contains("chosen-container")?i.nextElementSibling:i.parentElement&&i.parentElement.querySelector(":scope > .chosen-container");b&&qa(b);return}try{i.classList.contains("select")||i.classList.add("select");try{s.data("chosen")&&s.chosen("destroy")}catch{}s.chosen({allow_single_deselect:!0,search_contains:!0,width:"100%",no_results_text:"无匹配项",disable_search_threshold:0}),i.dataset.urpppChosen="1",i.classList.add("urppp-chosen-hidden"),i.style.setProperty("display","none","important");let b=i.nextElementSibling&&i.nextElementSibling.classList.contains("chosen-container")?i.nextElementSibling:i.parentElement&&i.parentElement.querySelector(".chosen-container");b&&(b.style.setProperty("width","100%","important"),b.style.setProperty("min-width","0","important"),b.style.setProperty("display","block","important")),b&&qa(b)}catch(b){console.warn("[URP++] chosen init failed",i,b)}}),!window.__urpppChosenHtmlPatch){window.__urpppChosenHtmlPatch=!0;let i=t.fn.html;t.fn.html=function(){let s=i.apply(this,arguments);if(arguments.length)try{this.filter("select").add(this.find("select")).each(function(){let l=t(this);if(l.data("chosen")||l.next(".chosen-container").length)try{l.trigger("chosen:updated")}catch{}})}catch{}return s}}return!0}catch(t){return console.warn("[URP++] ensureQueryChosen failed",t),!1}}a(ve,"ensureQueryChosen");function Zo(){if(window.__urpppChosenScheduleBound)return;window.__urpppChosenScheduleBound=!0,[0,200,600,1500,3e3].forEach(o=>setTimeout(()=>{ve(),Ta()},o));let e=0,r=setInterval(()=>{e+=1;let o=ve();Ta(),(o&&e>3||e>15)&&clearInterval(r)},500)}a(Zo,"scheduleEnsureQueryChosen");let{beautifyPagebar:tn}=li({destroyPagebarChosen:Qo}),{scheduleBeautifyPagebar:en}=si({beautifyPagebar:tn});function Ma(){try{document.querySelectorAll("#drag-ul, ul#drag-ul").forEach(t=>{if(!t)return;let e=Array.from(t.children).filter(r=>r.tagName==="LI");if(!e.length){t.classList.add("urppp-empty"),t.style.setProperty("display","none","important");let r=t.closest("#xq-section, .widget-main, .widget-body");r&&!r.querySelector("li")&&(r.classList.add("urppp-empty"),r.style.setProperty("display","none","important"));return}t.classList.remove("urppp-empty"),t.classList.add("urppp-drag-ul"),t.style.removeProperty("display"),t.style.setProperty("height","auto","important"),t.style.setProperty("min-height","0","important"),e.forEach(r=>{let o=(r.textContent||"").replace(/\s+/g," ").trim(),i=(r.getAttribute("onclick")||"").includes("goDetail")||r.classList.contains("ui-selectee")||r.classList.contains("jc-future")||!!r.querySelector("a");!i&&/校区/.test(o)&&o.length<=12?(r.classList.add("xq-section"),r.classList.remove("ui-selectee","jc-future","urppp-building-active")):i&&!r.classList.contains("jc-future")&&r.classList.add("ui-selectee")})}),window.__urpppBuildingActiveBound||(window.__urpppBuildingActiveBound=!0,document.addEventListener("click",t=>{let e=t.target&&t.target.closest?t.target.closest("#drag-ul > li"):null;if(!e||e.classList.contains("xq-section")||e.classList.contains("jc-future"))return;let r=e.parentElement;r&&(r.querySelectorAll("li.urppp-building-active, li.ui-selected").forEach(o=>{o.classList.remove("urppp-building-active","ui-selected")}),e.classList.add("urppp-building-active","ui-selected"))},!0))}catch(t){console.warn("[URP++] free classroom list beautify failed",t)}}a(Ma,"beautifyFreeClassroomList");function Hr(t){if(!t||!t.style)return;if(t.classList.contains("setLabelWidth")){t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Re(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 16px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important");return}let e=!!(t.closest&&t.closest(".widget-box, .widget-main, .widget-body, .panel"));t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("min-width","0","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("clear","both","important");let r=t.parentElement&&t.parentElement.tagName==="FORM"?t.parentElement:null;r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("display","block","important"),r.style.setProperty("float","none","important"),r.style.setProperty("box-sizing","border-box","important"),r.style.setProperty("margin","0","important"));let o=t.closest&&t.closest(".tab-pane, .tab-content");if(o&&(o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("box-sizing","border-box","important")),e){t.style.setProperty("background","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("margin","0","important"),t.style.setProperty("box-shadow","none","important");return}t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",Re(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 18px 0","important"),!t.classList.contains("setLabelWidth")&&(t.classList.contains("urppp-query-form")||!!t.querySelector(".urppp-query-pair, .chosen-container"))?(t.style.setProperty("padding","14px 16px","important"),t.style.setProperty("overflow","visible","important")):(t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important"))}a(Hr,"ensureProfileCardShell");function ur(){try{ve(),document.querySelectorAll(".page-content .profile-user-info, #page-content-template .profile-user-info").forEach(o=>{Hr(o)});let t=a(o=>{let i=o.closest(".profile-user-info, .urppp-query-form")||o.parentElement;if(!i)return Math.min(Math.max(o.querySelectorAll(":scope > .urppp-query-pair").length,1),4);let s=0;return i.querySelectorAll(":scope > .profile-info-row, .profile-info-row").forEach(l=>{let b=l.querySelectorAll(":scope > .urppp-query-pair").length;b>s&&(s=b)}),Math.min(Math.max(s,1),4)},"getFormQueryCols"),e=a(o=>{let i=Array.from(o.querySelectorAll(":scope > .urppp-query-pair")),s=t(o);o.classList.add("urppp-query-row"),o.style.setProperty("display","grid","important"),o.style.removeProperty("grid-template-columns"),o.style.setProperty("column-gap","14px","important"),o.style.setProperty("row-gap","10px","important"),o.style.setProperty("align-items","center","important"),o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("box-sizing","border-box","important"),o.dataset.urpppQueryCols=String(s),i.forEach(l=>{l.style.removeProperty("grid-column")}),i.forEach(l=>{l.style.setProperty("display","flex","important"),l.style.setProperty("align-items","center","important"),l.style.setProperty("width","100%","important"),l.style.setProperty("min-width","0","important"),l.style.setProperty("max-width","100%","important"),l.style.setProperty("box-sizing","border-box","important"),l.style.removeProperty("flex");let b=l.querySelector(".profile-info-name"),m=l.querySelector(".profile-info-value");b&&(b.style.setProperty("float","none","important"),b.style.setProperty("display","flex","important"),b.style.setProperty("align-items","center","important"),b.style.setProperty("justify-content","flex-end","important"),b.style.setProperty("flex","0 0 var(--urppp-qlabel, 84px)","important"),b.style.setProperty("width","var(--urppp-qlabel, 84px)","important"),b.style.setProperty("min-width","var(--urppp-qlabel, 84px)","important"),b.style.setProperty("max-width","var(--urppp-qlabel-max, 96px)","important"),b.style.setProperty("margin","0","important"),b.style.setProperty("margin-left","0","important"),b.style.setProperty("padding","0 8px 0 0","important"),b.style.setProperty("background","transparent","important"),b.style.setProperty("border","none","important"),b.style.setProperty("border-right","none","important")),m&&(m.style.setProperty("float","none","important"),m.style.setProperty("display","flex","important"),m.style.setProperty("align-items","center","important"),m.style.setProperty("flex","1 1 auto","important"),m.style.setProperty("width","auto","important"),m.style.setProperty("min-width","0","important"),m.style.setProperty("max-width","none","important"),m.style.setProperty("margin","0","important"),m.style.setProperty("margin-left","0","important"),m.style.setProperty("padding","0","important"),m.style.setProperty("background","transparent","important"),m.style.setProperty("border","none","important"),m.querySelectorAll("input, select, .chosen-container, .form-control").forEach(_=>{_.style.setProperty("width","100%","important"),_.style.setProperty("min-width","0","important"),_.style.setProperty("max-width","none","important")})),l.querySelectorAll(".chosen-container").forEach(_=>{let M=_.previousElementSibling;M&&M.tagName==="SELECT"&&(M.style.setProperty("display","none","important"),M.classList.add("urppp-chosen-hidden"));let N=_.parentElement&&_.parentElement.querySelector("select");N&&(N.style.setProperty("display","none","important"),N.classList.add("urppp-chosen-hidden")),_.style.setProperty("width","100%","important"),_.style.setProperty("min-width","0","important"),_.style.setProperty("max-width","none","important");let z=_.querySelector(".chosen-single");if(z){z.style.setProperty("width","100%","important"),z.style.setProperty("max-width","none","important"),z.style.setProperty("display","flex","important"),z.style.setProperty("align-items","center","important"),z.style.setProperty("height","34px","important"),z.style.setProperty("line-height","normal","important");let D=z.querySelector(":scope > span, span");D&&(D.style.setProperty("line-height","normal","important"),D.style.setProperty("height","auto","important"),D.style.setProperty("margin-top","0","important"),D.style.setProperty("padding-top","0","important"));let V=z.querySelector("div");if(V){V.style.setProperty("display","flex","important"),V.style.setProperty("align-items","center","important"),V.style.setProperty("justify-content","center","important"),V.style.setProperty("top","0","important"),V.style.setProperty("bottom","0","important"),V.style.setProperty("height","auto","important");let O=V.querySelector("b");O&&(O.style.setProperty("margin","0","important"),O.style.setProperty("background-position","center center","important"),O.style.setProperty("background-size","12px 12px","important"),O.style.setProperty("width","14px","important"),O.style.setProperty("height","14px","important"))}}})})},"applyRowLayout");document.querySelectorAll(".profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)").forEach(o=>{if(o.classList.contains("setLabelWidth")||o.closest&&o.closest("#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa"))return;let i=Array.from(o.querySelectorAll(".profile-info-row")).some(l=>Array.from(l.children).filter(b=>b.classList&&b.classList.contains("profile-info-name")).length>=2),s=!!o.querySelector("select.chosen, select.select, .chosen-container");if(!i&&!s){o.classList.remove("urppp-query-form");return}o.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')&&(o.classList.add("urppp-query-form"),Hr(o),o.querySelectorAll(".profile-info-row").forEach(l=>{if(l.dataset.urpppQueryDone==="1"){l.querySelector(":scope > .urppp-query-pair")&&e(l);return}let b=Array.from(l.children).filter(N=>N.classList&&(N.classList.contains("profile-info-name")||N.classList.contains("profile-info-value"))),m=[];for(let N=0;N<b.length;){let z=b[N],D=b[N+1];z&&D&&z.classList.contains("profile-info-name")&&D.classList.contains("profile-info-value")?(m.push([z,D]),N+=2):N+=1}if(!m.length){l.dataset.urpppQueryDone="1";return}let _=document.createDocumentFragment(),M=new Set;for(m.forEach(([N,z])=>{let D=document.createElement("div");D.className="urppp-query-pair",D.appendChild(N),D.appendChild(z),M.add(N),M.add(z),_.appendChild(D)}),b.forEach(N=>{M.has(N)||_.appendChild(N)});l.firstChild;)l.removeChild(l.firstChild);l.appendChild(_),l.dataset.urpppQueryDone="1",e(l)}))}),ve()}catch(t){console.warn("[URP++] query form beautify failed",t)}}a(ur,"beautifyQueryForms");function rn(){if(window.__urpppChosenAlignBound)return;window.__urpppChosenAlignBound=!0;let t=!1,e=a(r=>{if(!t){t=!0;try{let o=r&&r.querySelectorAll?r:document,i=document.getElementById("urppp-chosen-li-style");i||(i=document.createElement("style"),i.id="urppp-chosen-li-style",document.documentElement.appendChild(i)),i.textContent=[".self div.profile-info-value a.chosen-single > span,","body .self div.profile-info-value a.chosen-single > span {","  line-height: normal !important;","  height: auto !important;","  margin-top: 0 !important;","  padding-top: 0 !important;","}",".self div.profile-info-value a.chosen-single,","body .self div.profile-info-value a.chosen-single {","  display: flex !important;","  align-items: center !important;","  height: 34px !important;","  line-height: normal !important;","}","body .chosen-container .chosen-results li,","body .chosen-with-drop .chosen-results li,","html body .chosen-container .chosen-results li.active-result {","  display:flex !important;","  align-items:center !important;","  justify-content:flex-start !important;","  height:36px !important;","  min-height:36px !important;","  max-height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","  margin:0 !important;","  box-sizing:border-box !important;","}","body .chosen-container .chosen-results li.highlighted,","body .chosen-container .chosen-results li.result-selected {","  display:flex !important;","  align-items:center !important;","  height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","}"].join(""),o.querySelectorAll(".chosen-results li").forEach(s=>{s.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-start !important","height:36px !important","min-height:36px !important","max-height:36px !important","line-height:1 !important","padding:0 12px !important","margin:0 !important","box-sizing:border-box !important"].join(";")}),o.querySelectorAll("a.chosen-single").forEach(s=>{s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.style.setProperty("height","34px","important"),s.style.setProperty("min-height","34px","important"),s.style.setProperty("line-height","normal","important"),s.style.setProperty("padding-top","0","important"),s.style.setProperty("padding-bottom","0","important");let l=s.querySelector(":scope > span");l&&(l.style.setProperty("line-height","normal","important"),l.style.setProperty("height","auto","important"),l.style.setProperty("margin-top","0","important"),l.style.setProperty("margin-bottom","0","important"),l.style.setProperty("padding-top","0","important"),l.style.setProperty("padding-bottom","0","important"))}),o.querySelectorAll(".chosen-search").forEach(s=>{if(!s.querySelector(".urppp-chosen-search-icon")){let l=document.createElement("i");l.className="fa fa-search urppp-chosen-search-icon",l.setAttribute("aria-hidden","true"),s.appendChild(l)}})}finally{setTimeout(()=>{t=!1},0)}}},"apply");document.addEventListener("mousedown",r=>{let o=r.target&&r.target.closest?r.target.closest(".chosen-container"):null;o&&(setTimeout(()=>e(o),0),setTimeout(()=>e(o),30),setTimeout(()=>e(o),100),setTimeout(()=>e(o),200))},!0);try{let r=window.jQuery||window.$;r&&r.fn&&r(document).off("chosen:showing_dropdown.urppp chosen:updated.urppp").on("chosen:showing_dropdown.urppp chosen:updated.urppp",o=>{let i=o.target&&o.target.parentElement?o.target.parentElement:document;setTimeout(()=>e(i),0),setTimeout(()=>e(i),60)})}catch{}}a(rn,"patchChosenDropdownAlign");function $a(){try{let t=document.getElementById("work_rest_schedule_modal");if(!t)return;(t.classList.contains("in")||t.classList.contains("show"))&&t.style.setProperty("display","block","important");let e=t.querySelector(".modal-body")||t,r=Array.from(e.querySelectorAll("table"));if(!r.length)return;let o=a(l=>(l||"").replace(/\s+/g," ").trim(),"norm"),i=a(l=>String(l??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),"esc");if(e.dataset.urpppWrsDone==="1")return;e.dataset.urpppWrsDone="1",r.forEach(l=>{let b=l.closest(".urppp-table-wrap");b&&t.contains(b)&&b.parentElement&&(b.parentElement.insertBefore(l,b),b.remove()),l.classList.add("urppp-wrs-table"),l.style.setProperty("width","100%","important");let m=Array.from(l.rows||[]);if(!m.length)return;let _=0;m.forEach(M=>{let N=o(M.textContent);if(!/\d{1,2}:\d{2}/.test(N))return;let z=0;Array.from(M.cells||[]).forEach(D=>{z+=D.colSpan||1}),z>_&&(_=z)}),_<4&&m.forEach(M=>{let N=0;Array.from(M.cells||[]).forEach(z=>{N+=z.colSpan||1}),N>_&&(_=N)}),_<1&&(_=1),Array.from(l.rows||[]).forEach(M=>{let N=Array.from(M.cells||[]);if(!N.length)return;let z=o(M.textContent);if(!/\d{1,2}:\d{2}/.test(z)&&(/作息时间|学年/.test(z)||/(望江|华西|江安)/.test(z)&&/校区|时间|安排|作息/.test(z))){let O=z;M.className="urppp-wrs-title-row",M.innerHTML='<td class="urppp-wrs-title" colspan="'+_+'" align="center">'+i(O)+"</td>";return}N.forEach(O=>{["border","borderTop","borderRight","borderBottom","borderLeft","textAlign","verticalAlign","width"].forEach(F=>{try{O.style[F]=""}catch{}}),O.classList.remove("urppp-wrs-title","urppp-wrs-period","urppp-wrs-time","urppp-wrs-head");let R=o(O.textContent);R&&(/^(上午|下午|晚上|中午)$/.test(R)||(O.rowSpan||1)>1&&/上午|下午|晚上|中午/.test(R)?O.classList.add("urppp-wrs-period"):/节次|大节|时间|校区/.test(R)&&!/\d{1,2}:\d{2}/.test(R)&&!/第\d/.test(R)?/节次|时间|大节|校区/.test(z)&&!/\d{1,2}:\d{2}/.test(z)&&O.classList.add("urppp-wrs-head"):/\d{1,2}:\d{2}/.test(R)&&O.classList.add("urppp-wrs-time"),O.style.setProperty("text-align","center","important"),O.style.setProperty("vertical-align","middle","important"))})})});let s=t.querySelector(".modal-title");s&&(s.style.setProperty("text-align","center","important"),s.style.setProperty("width","100%","important")),e.dataset.urpppWrsDone="1"}catch{}}a($a,"beautifyWorkRestSchedule");let an="https://jwc.scu.edu.cn/cdxl.htm";function Ia(){let t=['a[onclick*="jwc.scu.edu.cn/article/206"]','a[href*="jwc.scu.edu.cn/article/206"]',".cdsj a",".ace-nav a"],e=new Set;t.forEach(r=>{document.querySelectorAll(r).forEach(o=>{if(e.has(o))return;e.add(o);let i=(o.textContent||"").replace(/\s+/g,""),s=o.getAttribute("onclick")||"",l=o.getAttribute("href")||"";(i.includes("学校校历")||s.includes("article/206")||l.includes("article/206")||s.includes("jwc.scu.edu.cn")&&i.includes("校历"))&&(o.setAttribute("href",an),o.setAttribute("target","_blank"),o.setAttribute("rel","noopener noreferrer"),o.setAttribute("onclick",`window.open('${an}');return false;`))})})}a(Ia,"patchSchoolCalendarLink");function Rr(){document.querySelectorAll("#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static").forEach(t=>{if(!t.querySelector(".nav-tabs"))return;["background","background-color","background-image","border","border-radius","box-shadow"].forEach(o=>{t.style.setProperty(o,o.startsWith("background")||o==="box-shadow"?o==="box-shadow"?"none":"transparent":o==="border"?"none":"0","important")}),t.style.setProperty("background","transparent","important"),t.style.setProperty("background-color","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("width","100%","important"),t.style.setProperty("margin","0 0 14px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("min-height","0","important"),t.style.setProperty("box-sizing","border-box","important");let e=t.querySelector(".navbar-inner");e&&(e.style.setProperty("background","transparent","important"),e.style.setProperty("border","none","important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("padding","0","important"),e.style.setProperty("min-height","0","important"),e.style.setProperty("filter","none","important"),e.style.setProperty("width","100%","important")),t.querySelectorAll(".container, .container-fluid").forEach(o=>{o.style.setProperty("width","100%","important"),o.style.setProperty("max-width","100%","important"),o.style.setProperty("margin","0","important"),o.style.setProperty("margin-left","0","important"),o.style.setProperty("padding","0","important"),o.style.setProperty("background","transparent","important"),o.style.setProperty("box-sizing","border-box","important")});let r=t.querySelector(".nav-tabs");r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("margin","0","important"),r.style.setProperty("padding","8px 10px","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("background-color","var(--surface)","important"),r.style.setProperty("border",Re(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-sizing","border-box","important"))})}a(Rr,"patchAceTabNavbars");function Ue(){let t=a(e=>{let r=NaN,o=[e.getAttribute("data-percent"),e.querySelector("[data-percent]")?.getAttribute("data-percent"),e.querySelector(".percent")?.textContent,e.querySelector(".urppp-pct-text")?.textContent];for(let i of o){if(i==null||i==="")continue;let s=parseFloat(String(i).replace(/[^\d.]/g,""));if(!Number.isNaN(s)){r=s;break}}if(Number.isNaN(r)){let i=(e.textContent||"").match(/(\d+(?:\.\d+)?)\s*%/);i&&(r=parseFloat(i[1]))}if(Number.isNaN(r)){let i=e.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');if(i){let s=String(i.style.width||"").match(/([\d.]+)%/);s&&(r=parseFloat(s[1]))}}return Number.isNaN(r)?null:Math.max(0,Math.min(100,r))},"readPct");document.querySelectorAll(".infobox").forEach(e=>{let r=t(e);if(r==null)return;e.querySelectorAll("canvas").forEach(l=>l.remove()),e.querySelectorAll(".easy-pie-chart, .percentage, .infobox-progress").forEach(l=>{l.classList.contains("urppp-pct-bar")||l.remove()}),e.querySelectorAll(".urppp-pct-text, .urppp-pct-bar").forEach(l=>l.remove());let o=e.querySelector(".infobox-data")||e,i=document.createElement("div");i.className="urppp-pct-text",i.textContent=Math.round(r)+"%";let s=document.createElement("div");if(s.className="urppp-pct-bar"+(r<=0?" is-empty":""),r>0){let l=document.createElement("span");l.className="urppp-pct-fill",l.style.width=r+"%",s.appendChild(l)}o.insertBefore(s,o.firstChild),o.insertBefore(i,o.firstChild),e.dataset.urpppPctDone="1"})}a(Ue,"restyleInfoboxPercentages");function mr(t){let e=document.getElementById("treeDemo");if(!e)return;let r=!!(t&&t.force);if(e.dataset.urpppBusy==="1"&&!(t&&t.ignoreBusy))return;let o=e.closest('div[style*="border"]')||e.closest("#tree_div")?.parentElement||e.parentElement;o&&o.classList.add("urppp-plan-tree-shell"),e.classList.add("urppp-ztree");let i=typeof unsafeWindow<"u"?unsafeWindow:window,s=a(()=>{try{return(i.jQuery||i.$||window.jQuery||window.$)?.fn?.zTree?.getZTreeObj?.("treeDemo")||null}catch{return null}},"getZTree"),l=a(()=>{let R=Array.from(e.querySelectorAll('span.button.switch[class*="_open"]')).filter(F=>!/_docu\b/.test(F.className));return R.reverse().forEach(F=>{try{F.click()}catch{}}),R.length>0},"collapseAllDom"),b=a(()=>{let R=s();if(R)try{R.expandAll(!1)}catch{}return e.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')&&l(),!0},"collapseAll");if(!window.__urpppExpandKzPatched){window.__urpppExpandKzPatched=!0;let R=a(()=>{let F=typeof unsafeWindow<"u"?unsafeWindow:window;try{F.expandKzByRule=function(){e.dataset.urpppUserExpanded||b()}}catch{}},"patch");R(),setTimeout(R,0),setTimeout(R,200)}e.dataset.urpppCollapsedOnce||(e.dataset.urpppCollapsedOnce="1",[0,80,200,500,1e3].forEach(R=>setTimeout(()=>{e.dataset.urpppUserExpanded||b()},R)));let m=document.querySelector("#two h4.header, #two .header");if(m&&!m.dataset.urpppLegendDone){let R=m.querySelector("font");if(R){let F=document.createElement("div");F.className="urppp-plan-legend",F.innerHTML=['<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>','<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>','<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>','<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>','<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>'].join(""),R.replaceWith(F)}m.classList.add("urppp-plan-header"),m.dataset.urpppLegendDone="1"}let _=a(()=>{if(e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}},"pauseObs"),M=a(()=>{e.dataset.urpppBusy="0";let R=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&R)try{window.__urpppPlanTreeObs.observe(R,{childList:!0,subtree:!0})}catch{}},"resumeObs"),N=a(R=>{let F=R;return F=F.replace(/\((最低修读学分:[^)]+)\)/g,(K,ut)=>{let wt=ut.split(",").map(Tt=>Tt.trim()).filter(Boolean),Ct=[];return wt.forEach(Tt=>{/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(Tt)&&Ct.push(Tt)}),`<span class="urppp-sub">${(Ct.length?Ct:wt).map(Tt=>{let Ht=Tt.match(/^([^:：]+)[:：]\s*(.+)$/);if(!Ht)return Tt;let Rt=Ht[1].trim(),$t=Ht[2].trim(),ne="neutral";return/通过|已及格/.test(Rt)?ne="ok":/未修读|未及格/.test(Rt)?ne=Number($t)>0?"warn":"muted":/最低/.test(Rt)&&(ne="req"),`<span class="urppp-kv ${ne}"><em>${Rt}</em><b>${$t}</b></span>`}).join("")}</span>`}),F=F.replace(/\[(\d{6,})\]/g,'<span class="urppp-code">$1</span>'),F=F.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g,'<span class="urppp-meta">$1</span>'),F=F.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g,(K,ut,wt)=>{let Ct=String(wt).trim(),qt=Ct.match(/^(.+?)(?:\((\d{6,8})\))?$/),Tt=(qt?qt[1]:Ct).trim(),Ht=qt&&qt[2]?qt[2]:"",Rt=parseFloat(Tt),$t=!1;Number.isNaN(Rt)?/不及格|未通过|不通过/.test(Tt)?$t=!1:(/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(Tt),$t=!0):$t=Rt>=60;let ne=Ht?`<i>${Ht}</i>`:"";return`<span class="urppp-score ${$t?"pass":"fail"}"><b>${ut}</b><em>${Tt}</em>${ne}</span>`}),F=F.replace(/(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,'$1<span class="urppp-title">$2</span>'),F=F.replace(/(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,'$1 <span class="urppp-gname">$2</span>'),F=F.replace(/(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,"$1 "),F},"formatNodeHtml"),z=a(R=>{let F=R.querySelector("i.fa, i.ace-icon"),K=R.closest("li");K&&(K.classList.remove("urppp-node-done","urppp-node-todo","urppp-node-pass","urppp-node-fail","urppp-node-pending"),F&&(F.classList.contains("fa-check-square-o")?K.classList.add("urppp-node-done"):F.classList.contains("fa-smile-o")?K.classList.add("urppp-node-pass"):F.classList.contains("fa-frown-o")?K.classList.add("urppp-node-fail"):F.classList.contains("fa-meh-o")?K.classList.add("urppp-node-pending"):F.classList.contains("fa-kz")&&K.classList.add("urppp-node-todo")))},"markStatus"),D=a(R=>{if(!R||!r&&R.dataset.urpppNodeDone==="1")return!1;z(R);let F=R.querySelector("span.node_name")||R;if(!F)return!1;if(!r&&F.querySelector(".urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname"))R.dataset.urpppNodeDone="1";else{let ut=F.dataset.urpppRaw;ut||(F.querySelector(".urppp-score, .urppp-code, .urppp-sub")?(R.dataset.urpppNodeDone="1",ut=null):(ut=F.innerHTML,ut&&(F.dataset.urpppRaw=ut))),ut&&(F.innerHTML=N(ut),R.dataset.urpppNodeDone="1")}let K=R.parentElement&&R.parentElement.querySelector(":scope > span.button.switch");return K&&(K.dataset.urpppSw||(K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))),/_docu\b/.test(K.className)||K.classList.contains("urppp-switch-leaf")?R.classList.remove("urppp-expandable"):R.classList.add("urppp-expandable")),!0},"paintOne"),V=a((R,F)=>{let K=Array.from(R||[]),ut=0,wt=a(()=>{let Ct=Math.min(ut+48,K.length);for(;ut<Ct;ut++)D(K[ut]);ut<K.length?window.requestIdleCallback?requestIdleCallback(wt,{timeout:120}):setTimeout(wt,0):F&&F()},"step");wt()},"paintList"),O=a(R=>{let F=R||e;F.querySelectorAll("span.button.switch:not([data-urppp-sw])").forEach(K=>{K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))}),F.querySelectorAll("li > a").forEach(K=>D(K))},"paintScopeSync");_();try{O(e),e.dataset.urpppExpandClick||(e.dataset.urpppExpandClick="1",e.addEventListener("click",F=>{if(F.target.closest&&F.target.closest("span.button.switch")){let qt=F.target.closest("span.button.switch"),Tt=qt&&qt.parentElement;if(!Tt||/_docu\b/.test(qt.className))return;if(e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}setTimeout(()=>{O(Tt),e.dataset.urpppBusy="0";let Ht=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&Ht)try{window.__urpppPlanTreeObs.observe(Ht,{childList:!0,subtree:!0})}catch{}},0);return}let K=F.target&&F.target.closest?F.target.closest("li > a"):null;if(!K||!e.contains(K))return;let ut=K.parentElement;if(!ut)return;let wt=ut.querySelector(":scope > span.button.switch");if(!wt||/_docu\b/.test(wt.className)||wt.classList.contains("urppp-switch-leaf")||!K.classList.contains("urppp-expandable")&&!/_open|_close/.test(wt.className))return;if(F.preventDefault(),F.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}wt.click(),O(ut),e.dataset.urpppBusy="0";let Ct=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&Ct)try{window.__urpppPlanTreeObs.observe(Ct,{childList:!0,subtree:!0})}catch{}},!0));let R=a((F,K)=>{let ut=document.getElementById(F);return!ut||ut.dataset.urpppBound==="1"?!1:(ut.dataset.urpppBound="1",ut.addEventListener("click",wt=>{wt.preventDefault(),wt.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",_();try{let Ct=s();if(K){Ct?Ct.expandAll(!0):e.querySelectorAll('span.button.switch[class*="_close"]').forEach(Tt=>{/_docu\b/.test(Tt.className)||Tt.click()});let qt=e.querySelectorAll('li > a:not([data-urppp-node-done="1"])');V(qt,M)}else{if(Ct)try{Ct.expandAll(!1)}catch{}l(),setTimeout(()=>{e.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')&&l(),M()},0)}}catch{K||l(),M()}},!0),!0)},"bindAll");R("expandAllBtn",!0),R("collapseAllBtn",!1),e.dataset.urpppAllBtnsRetry||(e.dataset.urpppAllBtnsRetry="1",setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},300),setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},1e3))}finally{requestAnimationFrame(()=>{requestAnimationFrame(M)})}}a(mr,"beautifyPlanTree");function br(){if(!fe())try{let t=document.getElementById("soliderbox");if(t){t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","720px","important"),t.style.setProperty("min-width","0","important"),t.classList.remove("container");let i=t.closest(".profile-info-row");i&&(i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("width","100%","important"),i.style.setProperty("max-width","100%","important"));let s=t.closest(".profile-info-value");s&&(s.style.setProperty("width","auto","important"),s.style.setProperty("max-width","100%","important"),s.style.setProperty("flex","1 1 auto","important"),s.style.setProperty("min-width","0","important"))}let e=document.getElementById("mycoursetable");if(!e)return;let r=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches);e.classList.toggle("urppp-mobile-schedule-scroll",r),e.style.setProperty("position","relative","important"),e.style.setProperty("width","100%","important");let o=72;r||e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(i=>{let s=i.offsetHeight||0;s>o&&(o=s)}),o<56&&(o=72),e.querySelectorAll("div.class_div").forEach(i=>{let s=parseInt(i.getAttribute("classNum")||"1",10)||1,l=i.scrollHeight||0;if(l>0){let b=Math.ceil(l/s);o=r?Math.max(o,Math.min(b,88)):Math.max(o,b)}}),r?o=Math.min(Math.max(o,72),88):(o<64&&(o=72),o>160&&(o=120)),e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(i=>{i.style.setProperty("height",o+"px","important")}),e.querySelectorAll("td").forEach(i=>{let s=Array.from(i.querySelectorAll(":scope > div.class_div"));if(!s.length)return;i.style.setProperty("position","relative","important"),i.style.setProperty("vertical-align","top","important"),i.style.setProperty("overflow","visible","important");let l=i.getBoundingClientRect().width||i.offsetWidth||i.clientWidth||0,b=getComputedStyle(i),m=i.closest("table"),_=m?getComputedStyle(m):null,M=parseFloat(b.borderLeftWidth)||0,N=_&&_.borderCollapse==="collapse"?M/2:M,z=Math.max(1,s.length);s.forEach((D,V)=>{let O=parseInt(D.getAttribute("classNum")||"1",10)||1,R=Dp(l,z,V,N),F=R.left,K=R.width;D.style.setProperty("position","absolute","important"),D.style.setProperty("top","0px","important"),D.style.setProperty("left",F+"px","important"),D.style.setProperty("right","auto","important"),D.style.setProperty("bottom","auto","important"),D.style.setProperty("transform","none","important"),D.style.setProperty("width",K+"px","important"),D.style.setProperty("max-width","none","important"),D.style.setProperty("height",o*O+"px","important"),D.style.setProperty("margin","0","important"),D.style.setProperty("box-sizing","border-box","important"),D.style.setProperty("z-index","2","important"),D.style.setProperty("overflow","hidden","important")})})}catch(t){console.warn("[URP++] week schedule fix failed",t)}}a(br,"fixWeekScheduleLayout");function Na(){try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;if(!t||t.__urpppDivBuildPatched||typeof t.divBuild!="function")return;t.__urpppDivBuildPatched=!0;let e=t.divBuild;t.__urpppOriginalDivBuild=e,t.divBuild=function(){try{br()}catch{try{return e.apply(this,arguments)}catch{}}};try{t.divBuild._urppp=!0}catch{}}catch(t){console.warn("[URP++] patch divBuild failed",t)}}a(Na,"patchSiteDivBuild");let We=null,on=!1;function nn(){let t=document.getElementById("mycoursetable")||document.getElementById("page-content-template")||document.body;if(We&&We.root===t&&t?.isConnected){br();return}We&&We.disconnect(),We=null;let e=!on;on=!0;let r=!1,o=a(()=>{if(!(r||fe())&&!(!document.getElementById("soliderbox")&&!document.getElementById("mycoursetable"))){r=!0;try{Na(),br()}finally{setTimeout(()=>{r=!1},40)}}},"run");Na(),[0,50,150,400,1e3,2e3].forEach(l=>setTimeout(()=>{Na(),o()},l)),e&&window.addEventListener("resize",()=>{clearTimeout(window.__urpppWeekSchedResize),window.__urpppWeekSchedResize=setTimeout(o,120)});let i=a(l=>{if(!l||fe())return;let b=[];l.nodeType===1&&(l.matches&&l.matches("div.class_div")&&b.push(l),l.querySelectorAll&&l.querySelectorAll("div.class_div").forEach(m=>b.push(m))),b.forEach(m=>{let _=m.parentElement;_&&_.tagName==="TD"&&_.style.setProperty("position","relative","important"),m.style.setProperty("position","absolute","important"),m.style.setProperty("top","0px","important"),m.style.setProperty("left","0px","important"),m.style.setProperty("right","auto","important"),m.style.setProperty("transform","none","important"),m.style.setProperty("width","100%","important"),m.style.setProperty("margin","0","important"),m.style.setProperty("box-sizing","border-box","important")})},"pinNew"),s=new MutationObserver(l=>{if(fe())return;let b=!1;l.forEach(m=>{if(m.type==="childList"&&m.addedNodes.forEach(_=>{i(_),b=!0}),m.type==="attributes"&&m.attributeName==="style"&&m.target&&m.target.classList&&m.target.classList.contains("class_div")){let _=m.target,M=_.style.left||"",N=parseFloat(M);(!M||M==="auto"||Number.isFinite(N)&&N>200)&&(_.style.setProperty("left","0px","important"),_.style.setProperty("top","0px","important"),_.style.setProperty("position","absolute","important")),b=!0}}),b&&(clearTimeout(window.__urpppWeekSchedMut),window.__urpppWeekSchedMut=setTimeout(()=>{requestAnimationFrame(o)},16))});if(t){s.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});let l=null,b=0,m=0;if(t.id==="mycoursetable"&&typeof window.ResizeObserver=="function"){let _=t.getBoundingClientRect().width||0;l=new window.ResizeObserver(M=>{let N=M[0]?.contentRect?.width||t.getBoundingClientRect().width||0;!N||Math.abs(N-_)<.5||(_=N,b||(b=requestAnimationFrame(()=>{b=0,o()})),clearTimeout(m),m=setTimeout(o,80))}),l.observe(t)}We={root:t,observer:s,disconnect(){s.disconnect(),l&&l.disconnect(),b&&cancelAnimationFrame(b),clearTimeout(m)}}}e&&document.addEventListener("mouseup",()=>{document.getElementById("soliderbox")&&(setTimeout(o,200),setTimeout(o,500))},!0)}a(nn,"scheduleWeekScheduleFix");function pn(){try{let t=document.getElementById("curriculumInfo-divcon2");if(!t)return;let e=parseFloat(t.style.width||getComputedStyle(t).width||"0");if(!e||e<40)return;t.classList.add("urppp-curriculum-drawer");let r=t.querySelector(".modal-body");if(!r)return;let o=r.querySelector(":scope > .col-xs-12 > .row")||r.querySelector(".col-xs-12 > .row")||r.querySelector(".row");if(!o)return;o.classList.add("urppp-drawer-layout");let i=o.querySelector(":scope > .urppp-drawer-toolbar, :scope > p");i&&i.tagName==="P"&&i.classList.add("urppp-drawer-toolbar");let s=o.querySelector(":scope > .urppp-drawer-body"),l=o.querySelector(".urppp-drawer-left"),b=o.querySelector(".urppp-drawer-right");s||(s=document.createElement("div"),s.className="urppp-drawer-body"),l||(l=document.createElement("div"),l.className="urppp-drawer-left"),b||(b=document.createElement("div"),b.className="urppp-drawer-right"),s.contains(l)||s.appendChild(l),s.contains(b)||s.appendChild(b),s.parentElement!==o&&(i&&i.parentElement===o?o.insertBefore(s,i.nextSibling):o.appendChild(s)),i&&o.firstElementChild!==i&&o.insertBefore(i,o.firstElementChild);let m=o.querySelector("#treeDemo, .ztree")||t.querySelector("#treeDemo, .ztree"),_=null;if(m){_=m.closest(".col-xs-6, .col-sm-6, .widget-box")||m.parentElement;let V=m.closest(".col-xs-6, .col-sm-6");V&&(_=V)}let M=["fajh","xnxq","kz","kc","kcfa"],N=M.map(V=>document.getElementById(V)).filter(V=>V&&t.contains(V));_&&_.parentElement!==l&&l.appendChild(_),Array.from(l.children).forEach(V=>{(M.includes(V.id)||V.id&&M.includes(V.id)||V!==_&&V.querySelector&&!V.querySelector("#treeDemo, .ztree")&&V.classList&&V.classList.contains("col-xs-6"))&&b.appendChild(V)}),M.forEach(V=>{let O=document.getElementById(V);!O||!t.contains(O)||(O.parentElement!==b&&b.appendChild(O),O.style.setProperty("width","100%","important"),O.style.setProperty("max-width","100%","important"),O.style.setProperty("float","none","important"),O.style.setProperty("margin","0","important"),O.style.setProperty("padding","0","important"),O.style.setProperty("box-sizing","border-box","important"),O.style.display!=="none"&&getComputedStyle(O).display!=="none"&&O.style.setProperty("display","block","important"))});let z=document.getElementById("fajh");z&&t.contains(z)&&(z.parentElement!==b&&b.appendChild(z),(!z.innerHTML||!z.innerHTML.trim())&&!z.querySelector(".urppp-drawer-skeleton, .profile-user-info, .widget-box")&&(z.innerHTML=["<div class='widget-box transparent urppp-drawer-skeleton'>","  <div class='widget-header widget-header-small'>","    <h4 class='widget-title smaller grey'>方案计划信息</h4>","  </div>","</div>","<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>","  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>","</div>"].join(""),z.style.setProperty("display","block","important"),z.dataset.urpppSkeleton="1"),z.dataset.urpppSkeleton==="1"&&z.querySelector(".profile-info-value")&&/方案名称|计划名称|年级|院系/.test(z.textContent||"")&&(delete z.dataset.urpppSkeleton,z.querySelectorAll(".urppp-drawer-skeleton, .urppp-drawer-skeleton-card").forEach(O=>O.remove())),z.innerHTML&&z.innerHTML.trim()&&z.style.display==="none"&&(z.dataset.urpppSkeleton==="1"||z.querySelector(".profile-user-info"))&&z.style.setProperty("display","block","important")),b.style.setProperty("min-height","240px","important"),l.style.setProperty("min-height","240px","important"),_&&(_.style.setProperty("width","100%","important"),_.style.setProperty("max-width","100%","important"),_.style.setProperty("float","none","important"),_.style.setProperty("margin","0","important"),_.style.setProperty("padding","0","important"),_.style.setProperty("border","none","important"),_.style.setProperty("box-sizing","border-box","important"));let D=l.querySelector(".widget-box");D&&(D.style.setProperty("width","100%","important"),D.style.setProperty("margin","0","important"),D.style.setProperty("border",Re(),"important"),D.style.setProperty("border-radius","12px","important"),D.style.setProperty("overflow","hidden","important"),D.style.setProperty("background","var(--surface)","important")),t.querySelectorAll(".profile-info-row").forEach(V=>{V.classList.remove("urppp-query-row","urppp-dual-pair"),V.style.setProperty("display","grid","important"),V.style.setProperty("grid-template-columns","112px minmax(0,1fr)","important"),V.style.setProperty("width","100%","important"),Array.from(V.children).forEach(O=>{O.classList&&(O.style.setProperty("float","none","important"),O.style.setProperty("margin-left","0","important"),O.style.setProperty("width","auto","important"),O.style.setProperty("max-width","none","important"))})}),t.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(V=>{V.classList.remove("urppp-query-form");try{Hr(V)}catch{}V.querySelectorAll(".profile-info-value, .profile-info-value span, span.editable").forEach(O=>{O.style.setProperty("color","var(--text)","important"),O.style.setProperty("opacity","1","important"),O.style.setProperty("visibility","visible","important")}),V.style.setProperty("border-radius","12px","important"),V.style.setProperty("overflow","hidden","important"),V.style.setProperty("width","100%","important"),V.style.setProperty("max-width","100%","important"),V.style.setProperty("display","block","important"),V.style.setProperty("box-sizing","border-box","important")})}catch(t){console.warn("[URP++] curriculum drawer beautify failed",t)}}a(pn,"beautifyCurriculumDrawer");function gs(){if(window.__urpppCurriculumDrawerBound)return;window.__urpppCurriculumDrawerBound=!0;let t=a(()=>pn(),"run");[0,50,150,350,800,1600].forEach(o=>setTimeout(t,o));let e=new MutationObserver(o=>{o.some(s=>!!(s.type==="childList"||s.type==="attributes"&&s.target&&(s.target.id==="curriculumInfo-divcon2"||s.target.id==="fajh")))&&(clearTimeout(window.__urpppCurriculumDrawerTimer),window.__urpppCurriculumDrawerTimer=setTimeout(()=>requestAnimationFrame(t),16))}),r=document.getElementById("curriculumInfo-divcon2");r&&e.observe(r,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),document.addEventListener("click",o=>{if(!document.getElementById("curriculumInfo-divcon2"))return;let i=o.target&&o.target.closest?o.target.closest("a,button,span,div"):null,s=(i&&i.textContent||"").replace(/\s+/g,"");(/培养方案|与我相关|方案计划|自动化培养/.test(s)||i&&i.closest&&i.closest("#curriculumInfo-divcon2"))&&(setTimeout(t,0),setTimeout(t,50),setTimeout(t,150),setTimeout(t,400))},!0)}a(gs,"scheduleCurriculumDrawerBeautify");let{scheduleScrubTableInlineBg:sn,scrubTableHeaderInlineBg:xs}=ii({isNativePdfIsolationActive:fe}),{disarmNoticeTableHover:ys,pinNoticeRowSurface:ln,scrubNoticeInlineBg:cn,stripMistakenNoticeTable:dn}=di({getCurrentTheme:Jt});function Ba(){try{let t=document.querySelector("h4.header, h3.header, h4, h3, .breadcrumb, .page-header");return ai({pathname:location.pathname,href:location.href,title:document.title,headingText:t?.textContent||""})}catch{return!1}}a(Ba,"isNoticePageContext");function vs(t){return zo(t,{noticePage:Ba()})}a(vs,"isNoticeListTable");function Fa(t){return oi(t,{noticePage:Ba()})}a(Fa,"isBusinessDataTable");let un,{bindNoticeHoverScrub:ws,scheduleBeautifyNoticeTables:mn}=ci({beautifyNoticeTables:a(t=>un(t),"beautifyNoticeTables"),pinNoticeRowSurface:ln});({beautifyNoticeTables:un}=ui({isNativePdfIsolationActive:fe,bindNoticeHoverScrub:ws,scrubNoticeInlineBg:cn,stripMistakenNoticeTable:dn,disarmNoticeTableHover:ys,pinNoticeRowSurface:ln,isBusinessDataTable:Fa,isNoticeListTable:vs,isNoticePageContext:Ba,isNoticeBulletText:Po}));let{wrapTables:bn,bindTableWrapObserver:hn}=ni({isNativePdfIsolationActive:fe,isBusinessDataTable:Fa});function hr(){try{document.querySelectorAll(".modal").forEach(e=>{if(!e||!e.style)return;e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.classList.contains("in")||e.classList.contains("show")?e.style.display==="none"&&e.style.removeProperty("display"):(e.style.display==="block"||getComputedStyle(e).display!=="none")&&(e.style.setProperty("display","none","important"),setTimeout(()=>{try{!e.classList.contains("in")&&!e.classList.contains("show")&&(e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.style.display="none")}catch{}},0))}),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(e=>{try{e.parentElement&&e.parentElement.removeChild(e)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right")))}catch{}}a(hr,"cleanupStuckModals");function ks(){if(window.__urpppModalOpenPatched)return;window.__urpppModalOpenPatched=!0;let t=a(s=>{!s||!s.style||(s.style.getPropertyPriority("display")==="important"&&s.style.removeProperty("display"),s.style.getPropertyPriority("opacity")==="important"&&s.style.removeProperty("opacity"),s.style.getPropertyPriority("pointer-events")==="important"&&s.style.removeProperty("pointer-events"),s.style.getPropertyPriority("visibility")==="important"&&s.style.removeProperty("visibility"))},"unlock"),e=a(s=>{if(!(!s||!s.classList))try{s.classList.remove("in","show"),s.setAttribute("aria-hidden","true"),s.style.removeProperty("display"),s.style.setProperty("display","none","important"),setTimeout(()=>{try{!s.classList.contains("in")&&!s.classList.contains("show")&&(s.style.getPropertyPriority("display")==="important"&&s.style.removeProperty("display"),s.style.display="none")}catch{}},30)}catch{}},"forceHide"),r=a(()=>{document.querySelectorAll(".modal-backdrop").forEach(s=>{try{s.parentElement&&s.parentElement.removeChild(s)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"),document.body.style.removeProperty("overflow"))},"clearBackdrops"),o=a(s=>{if(s){if(s.classList&&s.classList.contains("modal-backdrop")&&(s=document.querySelector(".modal.in, .modal.show")||s),!s||!s.classList||!s.classList.contains("modal")){r();return}t(s),e(s),r();try{let l=typeof Or=="function"&&Or()||typeof unsafeWindow<"u"&&(unsafeWindow.jQuery||unsafeWindow.$)||window.jQuery||window.$;if(l&&l.fn&&typeof l.fn.modal=="function"){try{l(s).trigger("hide.bs.modal")}catch{}try{l(s).modal("hide")}catch{}try{l(s).trigger("hidden.bs.modal")}catch{}}}catch{}setTimeout(()=>{e(s),document.querySelector(".modal.in, .modal.show")||r();try{hr()}catch{}},0)}},"hideModalEl");document.addEventListener("show.bs.modal",s=>{let l=s.target;if(!(!l||!l.classList||!l.classList.contains("modal"))){t(l),l.style.display==="none"&&l.style.removeProperty("display");try{l.getAttribute("data-backdrop")==="static"&&l.setAttribute("data-backdrop","true"),l.dataset&&(l.dataset.backdrop="true")}catch{}}},!0),document.addEventListener("hide.bs.modal",s=>{let l=s.target;!l||!l.classList||!l.classList.contains("modal")||t(l)},!0),document.addEventListener("hidden.bs.modal",s=>{let l=s.target;!l||!l.classList||!l.classList.contains("modal")||(e(l),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(b=>{try{b.parentElement&&b.parentElement.removeChild(b)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"))))},!0);let i=a(s=>{let l=s.target;if(!l||!l.closest||l.closest(".modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer")&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return;if(l.classList&&l.classList.contains("modal-backdrop")){let M=document.querySelector(".modal.in, .modal.show")||document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');M?(s.preventDefault(),s.stopPropagation(),o(M)):(s.preventDefault(),r(),hr());return}let b=null;if(l.classList&&l.classList.contains("modal")?b=l:b=l.closest(".modal.in, .modal.show, .modal"),!b||!b.classList.contains("modal")||!(b.classList.contains("in")||b.classList.contains("show")||getComputedStyle(b).display!=="none"))return;let _=b.querySelector(".modal-dialog");if(_){let M=_.getBoundingClientRect(),N=s.clientX,z=s.clientY;if(N>=M.left&&N<=M.right&&z>=M.top&&z<=M.bottom&&!l.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return}else if(l.closest(".modal-content"))return;s.preventDefault(),s.stopPropagation(),o(b)},"onBlankClose");document.addEventListener("pointerdown",i,!0),document.addEventListener("mousedown",i,!0),document.addEventListener("click",i,!0),document.addEventListener("click",s=>{let l=s.target&&s.target.closest?s.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'):null;if(!l)return;let b=l.closest(".modal");b&&(s.preventDefault(),s.stopPropagation(),o(b)),setTimeout(()=>{try{hr()}catch{}},50),setTimeout(()=>{try{hr()}catch{}},220)},!0),document.addEventListener("click",s=>{let l=s.target&&s.target.closest?s.target.closest("a,button,td,span,div,i"):null;if(!l)return;["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon","billContainer"].forEach(m=>{let _=document.getElementById(m);_&&(t(_),_.style.opacity==="0"&&_.style.removeProperty("opacity"),_.style.pointerEvents==="none"&&_.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(m=>t(m));let b=l.getAttribute&&(l.getAttribute("data-target")||l.getAttribute("href")||"");if(b&&b.charAt(0)==="#"){let m=document.querySelector(b);m&&t(m)}},!0)}a(ks,"patchModalOpenPath");let Ge=null,Da=0;function ja(){if(fe())return;let t=document.getElementById("courseTable");t&&t.querySelectorAll("td").forEach(e=>{let r=e.style.backgroundColor;if(!r||!r.includes("rgba"))return;let o=r.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);o&&(e.style.backgroundColor=`rgba(${o[1]},${o[2]},${o[3]},0.5)`)})}a(ja,"applyCourseTableOpacity");function fn(){let t=document.getElementById("mycoursetable")||document.getElementById("courseTable");if(Ge&&Ge.root===t&&t?.isConnected){ja();return}if(clearTimeout(Da),Ge&&Ge.observer.disconnect(),Ge=null,!t)return;let e=new MutationObserver(()=>{clearTimeout(Da),Da=setTimeout(ja,60)});e.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]}),Ge={root:t,observer:e},ja()}a(fn,"bindCourseTableOpacityObserver");function As(){try{let z=Jt();document.documentElement.dataset.urpppTheme=z,document.documentElement.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),document.documentElement.classList.add("urppp-theme-"+z),document.body&&(document.body.dataset.urpppTheme=z,document.body.classList.toggle("urppp-dark",z==="dark"))}catch{}let t=document.getElementById("urppp-internal-style");t||(t=document.createElement("style"),t.id="urppp-internal-style",document.head.appendChild(t));{let z=t;z.textContent=yi}let e=document.getElementById("urppp-table-beautify-style");e||(e=document.createElement("style"),e.id="urppp-table-beautify-style",document.head.appendChild(e)),e.textContent=Ai;let r=document.getElementById("urppp-navigation-style");r||(r=document.createElement("style"),r.id="urppp-navigation-style",document.head.appendChild(r)),r.textContent=Si;let o=document.getElementById("urppp-dashboard-style");o||(o=document.createElement("style"),o.id="urppp-dashboard-style",document.head.appendChild(o)),o.textContent=Ei;let i=document.getElementById("urppp-schedule-card-style");i||(i=document.createElement("style"),i.id="urppp-schedule-card-style",document.head.appendChild(i)),i.textContent=vi;let s=document.getElementById("urppp-mobile-style");s||(s=document.createElement("style"),s.id="urppp-mobile-style",document.head.appendChild(s)),s.textContent=Pi;try{ae()}catch{}hr(),ks(),["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon"].forEach(z=>{let D=document.getElementById(z);!D||!D.style||(["display","opacity","pointer-events","visibility"].forEach(V=>{D.style.getPropertyPriority(V)==="important"&&D.style.removeProperty(V)}),D.style.opacity==="0"&&D.style.removeProperty("opacity"),D.style.pointerEvents==="none"&&D.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(z=>{z.style&&z.style.getPropertyPriority("display")==="important"&&z.style.removeProperty("display")}),bn(),mn(),sn(),setTimeout(()=>document.querySelectorAll("table").forEach(z=>{Fa(z)&&dn(z)}),500),nn(),br(),gs(),pn(),hn();let l=document.querySelector(".page-content");l&&l.querySelectorAll(".widget-box").length>=4&&setTimeout(rl,500),Nn(),qe(),m();function m(){let z="(max-width: 640px)",D=a(()=>!!(window.matchMedia&&window.matchMedia(z).matches),"isNarrow"),V=a((W,pt)=>{if(!(!W||!document.body)){if(pt){Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")||(W.dataset.urpppDesktopSidebarMin=W.classList.contains("menu-min")?"1":"0",W.dataset.urpppDesktopBodyMin=document.body.classList.contains("menu-min")?"1":"0"),W.classList.remove("menu-min"),document.body.classList.remove("menu-min");return}Object.hasOwn(W.dataset,"urpppDesktopSidebarMin")&&(W.classList.toggle("menu-min",W.dataset.urpppDesktopSidebarMin==="1"),document.body.classList.toggle("menu-min",W.dataset.urpppDesktopBodyMin==="1"),delete W.dataset.urpppDesktopSidebarMin,delete W.dataset.urpppDesktopBodyMin)}},"syncMobileSidebarMode"),O=new WeakMap,R=a(W=>{let pt=O.get(W);pt&&cancelAnimationFrame(pt),O.delete(W)},"stopDrawerAnimation"),F=a((W,pt)=>{R(W);let lt=W.getBoundingClientRect(),yt=Math.max(lt.width,W.offsetWidth||0,260),gt=Math.max(-yt,Math.min(0,lt.left)),_t=pt?0:-yt,Mt=Math.abs(_t-gt),Ot=Math.max(140,Math.round(260*Mt/yt)),he=performance.now(),Ut=W.classList.contains("urppp-clean-sidebar"),pe=Ut?"12030":"1200",Bt=Ut?"12030":"1030";W.style.setProperty("display","block","important"),W.style.setProperty("transition","none","important"),W.style.setProperty("visibility","visible","important"),W.style.setProperty("pointer-events",pt?"auto":"none","important"),W.style.setProperty("z-index",pe,"important"),W.style.setProperty("transform",`translate3d(${gt}px, 0, 0)`,"important"),W.classList.toggle("urppp-drawer-closing",!pt),W.classList.add("display");let St=a(()=>{W.style.setProperty("transform",`translate3d(${_t}px, 0, 0)`,"important"),pt?(W.classList.remove("urppp-drawer-closing"),W.style.setProperty("pointer-events","auto","important")):(W.classList.remove("display","urppp-drawer-closing"),W.style.setProperty("visibility","hidden","important"),W.style.setProperty("z-index",Bt,"important")),O.delete(W)},"finish");if(Mt<1){St();return}let ke=a(It=>{if(!W.isConnected){O.delete(W);return}let Wt=Math.min(1,(It-he)/Ot),wp=Wt<.5?4*Wt*Wt*Wt:1-Math.pow(-2*Wt+2,3)/2,na=gt+(_t-gt)*wp;if(W.style.setProperty("transform",`translate3d(${na}px, 0, 0)`,"important"),Wt>=1){St();return}O.set(W,requestAnimationFrame(ke))},"step");O.set(W,requestAnimationFrame(ke))},"animateDrawer"),K=a((W,pt,lt)=>{if(W){F(W,lt),pt&&(pt.setAttribute("aria-expanded",lt?"true":"false"),pt.setAttribute("aria-label",lt?"关闭菜单":"打开菜单"));try{Je()}catch{}}},"setDrawerOpen"),ut=a(()=>{K(document.getElementById("sidebar"),document.getElementById("urppp-mobile-menu-button"),!1)},"closeDrawer"),wt=a(()=>{let pt=document.getElementById("urppp-mobile-search-panel")?.querySelector("#form-search");if(!pt)return;Object.entries({position:"relative",right:"auto",top:"auto",left:"auto",transform:"none",width:"100%","min-width":"0","max-width":"none",height:"36px",opacity:"1",margin:"0",overflow:"visible","z-index":"1"}).forEach(([yt,gt])=>pt.style.setProperty(yt,gt,"important")),[pt.querySelector("form"),pt.querySelector(".input-icon")].forEach(yt=>{yt&&Object.entries({display:"block",position:"relative",width:"100%","min-width":"0","max-width":"none",height:"36px",margin:"0",padding:"0","box-sizing":"border-box"}).forEach(([gt,_t])=>yt.style.setProperty(gt,_t,"important"))});let lt=pt.querySelector("#search-input");lt&&(lt.style.setProperty("display","block","important"),lt.style.setProperty("width","100%","important"),lt.style.setProperty("min-width","0","important"),lt.style.setProperty("max-width","none","important"),lt.style.setProperty("height","36px","important"),lt.style.setProperty("box-sizing","border-box","important"))},"syncMobileSearchLayout"),Ct=a(()=>{let W=document.getElementById("form-search");if(!W||!W.__urpppMobileParent)return;let pt=W.__urpppMobileParent,lt=W.__urpppMobileNext;pt.isConnected&&(lt&&lt.parentElement===pt?pt.insertBefore(W,lt):pt.appendChild(W)),W.classList.remove("urppp-mobile-form-search"),W.dataset.open="0",W.removeAttribute("style"),delete W.__urpppMobileParent,delete W.__urpppMobileNext;try{dt()}catch{}},"restoreMobileSearch"),qt=a(()=>{let W=document.querySelector("#navbar .menu-toggler");!W||W.dataset.urpppMobileHidden!=="1"||(W.style.removeProperty("display"),W.removeAttribute("aria-hidden"),W.dataset.urpppPreviousTabindex?W.setAttribute("tabindex",W.dataset.urpppPreviousTabindex):W.removeAttribute("tabindex"),delete W.dataset.urpppPreviousTabindex,delete W.dataset.urpppMobileHidden)},"restoreNativeMenuToggler"),Tt=a(()=>{let W=document.getElementById("urppp-mobile-menu-button");if(!D())return W?.remove(),qt(),null;if(W)return W;let pt=document.getElementById("navbar"),lt=document.getElementById("sidebar");if(!pt||!lt)return null;let yt=pt.querySelector(".menu-toggler");yt&&(yt.dataset.urpppMobileHidden="1",yt.dataset.urpppPreviousTabindex=yt.getAttribute("tabindex")||"",yt.style.setProperty("display","none","important"),yt.setAttribute("aria-hidden","true"),yt.setAttribute("tabindex","-1"));let gt=document.createElement("button");gt.type="button",gt.id="urppp-mobile-menu-button",gt.className="urppp-mobile-menu-button",gt.setAttribute("aria-label","打开菜单"),gt.setAttribute("aria-expanded","false");let _t=pt.querySelector(".navbar-container")||pt;return _t.insertBefore(gt,_t.firstChild),gt},"ensureMenuToggler"),Ht=a(W=>{!W||W.dataset.urpppIconReady||(W.dataset.urpppIconReady="1",W.innerHTML=['<span class="urppp-menu-icon" aria-hidden="true">','<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">','<path d="M5 8h14"></path><path d="M5 16h10"></path>',"</svg>",'<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">','<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',"</svg>","</span>"].join(""))},"ensureMenuButtonIcon"),Rt=a(()=>{let W=Tt(),pt=document.getElementById("sidebar");W&&Ht(W),W&&pt&&!W.__urpppToggleHandler&&(W.setAttribute("aria-label","打开菜单"),W.setAttribute("aria-expanded",pt.classList.contains("display")?"true":"false"),W.__urpppToggleHandler=lt=>{lt.preventDefault(),lt.stopImmediatePropagation(),D()&&V(pt,!0);let yt=W.getAttribute("aria-expanded")!=="true";K(pt,W,yt)},W.addEventListener("click",W.__urpppToggleHandler,!0)),document.__urpppMobileDrawerOutsideBound||(document.__urpppMobileDrawerOutsideBound=!0,document.addEventListener("click",lt=>{if(!D()||!lt.target.closest)return;let yt=document.getElementById("sidebar");if(!yt||!yt.classList.contains("display"))return;let gt=document.getElementById("urppp-clean-root");gt&&gt.classList.contains("open")||lt.target.closest("#sidebar, #urppp-mobile-menu-button")||ut()},!0)),document.__urpppMobileRouteCloseBound||(document.__urpppMobileRouteCloseBound=!0,document.addEventListener("click",lt=>{if(!D()||!lt.target.closest)return;let yt=document.getElementById("urppp-clean-root");if(yt&&yt.classList.contains("open"))return;let gt=lt.target.closest("#sidebar a[href]");if(!gt)return;let _t=String(gt.getAttribute("href")||"").trim();!_t||_t==="#"||_t.startsWith("javascript")||ut()}))},"bindDrawerControls"),$t=a((W,pt)=>{let lt=W?W.cloneNode(!0):document.createElement("a");return lt.className="urppp-mobile-user-action",lt.removeAttribute("style"),lt.removeAttribute("id"),!W&&pt&&(lt.href=pt.href,pt.onclick&&lt.setAttribute("onclick",pt.onclick),lt.innerHTML='<i class="ace-icon fa '+pt.icon+'" aria-hidden="true"></i><span>'+pt.label+"</span>"),lt},"createActionLink"),ne=a((W,pt)=>{if(document.getElementById("urppp-mobile-user"))return;let lt=W.querySelector(":scope > li.light-blue")||Array.from(W.children).find(Wt=>Wt.querySelector&&Wt.querySelector(".nav-user-photo, .user-menu, .dropdown-menu")),yt=document.createElement("section");yt.id="urppp-mobile-user",yt.className="urppp-mobile-user";let gt=document.createElement("div");gt.className="urppp-mobile-user-identity";let _t=lt?.querySelector(".nav-user-photo")||document.querySelector("#navbar .nav-user-photo"),Mt=_t?_t.cloneNode(!0):document.createElement("img");Mt.className="nav-user-photo",Mt.removeAttribute("style"),Mt.getAttribute("src")||Mt.setAttribute("src","/main/queryStudent/img"),Mt.setAttribute("data-urppp-private","avatar"),Mt.alt=_t?.alt?.replace(/\s+/g," ").trim()||"用户头像";let Ot=lt?.querySelector(".user-info")||document.querySelector("#navbar .user-info"),he=document.createElement("span");he.className="urppp-mobile-user-copy";let Ut=document.createElement("small");Ut.className="urppp-mobile-user-welcome",Ut.textContent="欢迎您，";let pe=document.createElement("span");pe.className="user-info urppp-user-name-value",pe.setAttribute("data-urppp-private","name"),pe.textContent=Ot?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim()||_t?.alt?.replace(/\s+/g," ").trim()||"我的账户",he.append(Ut,pe),gt.append(Mt,he),yt.appendChild(gt);let Bt=document.createElement("div");Bt.className="urppp-mobile-user-actions";let St=lt?Array.from(lt.querySelectorAll(".user-menu a, .dropdown-menu a")):[],ke=[{label:"首页",href:"/",icon:"fa-home"},{label:"在线反馈",href:"/main/systemQuestion/index",icon:"fa-question-circle"},{label:"修改密码",href:"javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')",icon:"fa-user"},{label:"注销",href:"/logout",icon:"fa-power-off"}];St.length?St.forEach(Wt=>Bt.appendChild($t(Wt))):ke.forEach(Wt=>Bt.appendChild($t(null,Wt))),yt.appendChild(Bt);let It=pt.querySelector(".urppp-sidebar-header");It&&It.nextSibling?pt.insertBefore(yt,It.nextSibling):It?pt.appendChild(yt):pt.insertBefore(yt,pt.firstChild);try{Qt(yt)}catch{}},"ensureMobileUser"),vp=a((W,pt,lt,yt={})=>{if(!lt||document.getElementById("urppp-mobile-quick"))return;let gt=document.createElement("section");gt.id="urppp-mobile-quick",gt.className="urppp-mobile-quick",gt.innerHTML='<div class="urppp-mobile-quick-title">快捷功能</div>';let _t=document.createElement("div");_t.className="urppp-mobile-tool-row";let Mt=W.querySelector(':scope > li > a[href*="customerServiceCenter"]'),Ot=Mt?Mt.cloneNode(!0):document.createElement("a");Ot.className="urppp-mobile-tool-button urppp-mobile-help-button",Ot.removeAttribute("style"),Ot.removeAttribute("onclick"),Ot.removeAttribute("data-toggle"),Ot.removeAttribute("target"),Ot.querySelectorAll("[style]").forEach(St=>St.removeAttribute("style"));let he=String(Ot.getAttribute("href")||"").trim();(!he||he==="#"||he.startsWith("javascript"))&&(Ot.href="/main/customerServiceCenter"),Ot.querySelector("i")||(Ot.innerHTML='<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>'),Ot.querySelectorAll("span").forEach(St=>St.remove()),Ot.insertAdjacentHTML("beforeend","<span>帮助</span>"),_t.appendChild(Ot);let Ut=document.createElement("button");Ut.type="button",Ut.id="urppp-mobile-search-button",Ut.className="urppp-mobile-tool-button",Ut.setAttribute("aria-expanded","false"),Ut.innerHTML='<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>',_t.appendChild(Ut),gt.appendChild(_t);let pe=document.createElement("div");pe.className="urppp-mobile-quick-links",Array.from(W.querySelectorAll(":scope > li > a")).forEach(St=>{let ke=St.closest("li");if(ke?.classList.contains("light-blue")||ke?.querySelector("#intellegenceUDiv, #form-search")||St===Mt||St.classList.contains("dropdown-toggle")||!St.getAttribute("href")&&!St.getAttribute("onclick"))return;let It=St.cloneNode(!0);It.className="urppp-mobile-quick-link",It.removeAttribute("style");let Wt=String(St.getAttribute("onclick")||"");if(/openWorkRestSchedule|open\w*Schedule/i.test(Wt)||It.removeAttribute("onclick"),yt.cleanMode){let na=String(St.getAttribute("href")||"");(na==="/holiday"||/holiday/i.test(na)||/假期/.test(St.textContent||""))&&(It.removeAttribute("href"),It.removeAttribute("target"),It.style.cursor="default",It.style.pointerEvents="none")}pe.appendChild(It)});let Bt=document.createElement("div");Bt.id="urppp-mobile-search-panel",Bt.className="urppp-mobile-search-panel",Bt.hidden=!0;{let St=document.getElementById("form-search");St&&(St.__urpppMobileParent||(St.__urpppMobileParent=St.parentElement,St.__urpppMobileNext=St.nextSibling),St.classList.add("urppp-mobile-form-search"),St.dataset.open="0",Bt.appendChild(St),wt())}gt.appendChild(Bt),pe.children.length&&gt.appendChild(pe),Ut.addEventListener("click",St=>{if(St.preventDefault(),St.stopPropagation(),Bt.hidden){wt();let It=Bt.querySelector("#form-search");It&&(It.dataset.open="0",It.style.setProperty("pointer-events","auto","important"),It.style.setProperty("opacity","1","important"),It.style.setProperty("width","100%","important"),It.style.setProperty("min-width","0","important")),Bt.hidden=!1,Bt.classList.add("open"),setTimeout(()=>Bt.querySelector("#search-input")?.focus(),30),Ut.setAttribute("aria-expanded","true")}else Bt.hidden=!0,Bt.classList.remove("open"),Ut.setAttribute("aria-expanded","false")}),pt.insertBefore(gt,lt)},"ensureMobileQuick"),Ne=a(()=>{let W=D(),pt=document.querySelector("#navbar .navbar-buttons .ace-nav"),lt=document.getElementById("sidebar"),yt=document.getElementById("urppp-menus");if(lt&&V(lt,W),Rt(),!W){let gt=document.documentElement.classList.contains("urppp-clean-open");gt||Ct(),gt||(document.getElementById("urppp-mobile-quick")?.remove(),document.getElementById("urppp-mobile-user")?.remove());let _t=document.getElementById("urppp-nav-clean"),Mt=document.getElementById("urppp-nav-theme");_t&&Mt&&_t.parentElement!==Mt&&Mt.appendChild(_t),Mt&&Mt.style.setProperty("display","inline-flex","important");return}if(!(!pt||!lt)){try{let gt=document.getElementById("urppp-nav-clean"),_t=document.querySelector("#navbar .navbar-header"),Mt=document.getElementById("urppp-nav-theme");gt&&_t&&gt.parentElement!==_t&&_t.appendChild(gt),Mt&&Mt.style.setProperty("display","inline-flex","important"),document.getElementById("urppp-nav-cal")?.remove()}catch{}ne(pt,lt),vp(pt,lt,yt),wt()}},"apply");window.__urpppRefreshMobileNavbar=Ne,window.__urpppCloseMobileDrawer=ut,window.__urpppSetDrawerOpen=(W,pt,lt)=>{K(W,pt,lt)},window.__urpppStopDrawerAnimation=W=>{W&&R(W)},window.__urpppInjectCleanSidebarSections=W=>{let pt=document.querySelector("#navbar .navbar-buttons .ace-nav")||document.querySelector("#navbar .ace-nav"),lt=document.getElementById("urppp-menus");if(!pt||!W)return;try{ne(pt,W)}catch{}let yt=document.getElementById("urppp-mobile-quick");if(yt){let gt=yt.querySelector("#urppp-mobile-search-panel");if(gt&&gt.querySelector("#form-search"))try{Ct()}catch{}yt.remove()}try{vp(pt,W,lt,{cleanMode:!0})}catch{}};try{Ne()}catch{}if(setTimeout(Ne,300),setTimeout(Ne,900),setTimeout(Ne,1800),window.matchMedia){let W=window.matchMedia(z),pt=a(()=>Ne(),"onChange");typeof W.addEventListener=="function"?W.addEventListener("change",pt):typeof W.addListener=="function"&&W.addListener(pt)}try{window.__urpppMobileNavbarObserver&&window.__urpppMobileNavbarObserver.disconnect();let W=0,pt=new MutationObserver(()=>{clearTimeout(W),W=setTimeout(()=>{try{Ne()}catch{}},40)}),lt=document.getElementById("navbar"),yt=document.getElementById("sidebar");lt&&pt.observe(lt,{childList:!0,subtree:!0}),yt&&pt.observe(yt,{childList:!0}),window.__urpppMobileNavbarObserver=pt}catch{}}a(m,"setupMobileNavbar");let M=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches)?"8px 8px 24px":"16px 64px 40px";if(document.querySelectorAll(".page-content, #page-content-template").forEach(z=>{z.style.setProperty("padding",M,"important"),z.style.setProperty("box-sizing","border-box","important")}),jr(),La(),Rr(),Ue(),Ma(),setTimeout(()=>{Ue(),Ma()},300),setTimeout(()=>{Ue(),Ma()},1e3),en(),tn(),Zo(),ve(),Ta(),ur(),rn(),setTimeout(()=>{ve(),ur()},200),setTimeout(()=>{ve(),ur()},800),setTimeout(La,350),setTimeout(La,1e3),mr(),setTimeout(()=>mr(),400),!window.__urpppPlanTreeObs){let z=0;window.__urpppPlanTreeObs=new MutationObserver(()=>{let V=document.getElementById("treeDemo");!V||V.dataset.urpppBusy==="1"||V.querySelector('li > a:not([data-urppp-node-done="1"])')&&(clearTimeout(z),z=setTimeout(()=>mr(),220))});let D=document.getElementById("tree_div")||document.getElementById("treeDemo");D&&window.__urpppPlanTreeObs.observe(D,{childList:!0,subtree:!0})}window.__urpppWrsBound||(window.__urpppWrsBound=!0,document.addEventListener("shown.bs.modal",z=>{z.target&&(z.target.id==="work_rest_schedule_modal"||z.target.querySelector?.("#work_rest_schedule_modal"))&&setTimeout($a,30)},!0),document.addEventListener("click",z=>{let D=z.target&&z.target.closest?z.target.closest("a,button"):null;if(!D)return;let V=D.getAttribute("onclick")||"",O=(D.textContent||"").trim();(V.includes("openWorkRestSchedule")||O.includes("作息时间表"))&&(setTimeout($a,80),setTimeout($a,300))},!0)),Dr(),st(),dt(),Ia();let N=a(()=>{jr(),Rr(),Dr()},"layoutWave");setTimeout(N,200),setTimeout(N,800),window.__urpppLoadBound||(window.__urpppLoadBound=!0,window.addEventListener("load",()=>{st(),dt(),rt(),Ia(),Dr(),jr(),Rr()})),setTimeout(()=>{document.body.classList.add("urppp-ready"),kt()},600),console.log("[URP++] style applied apple-leaning");try{bindScheduleHoverNearCursor()}catch{}fn()}a(As,"beautifyInternal");function Ss(t){if(!t)return;let e=t.querySelector("#urppp-set-brutal-palettes");if(!e)return;let r=Wo();e.innerHTML="",Q.filter(o=>o.id!==J).forEach(o=>{let i=document.createElement("button");i.type="button",i.className="urppp-set-scheme"+(o.id===r.id?" ac":""),i.dataset.palette=o.id,i.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:#000"></span>','  <span style="background:'+o.accent+'"></span>','  <span style="background:'+o.secondary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+o.name+"</strong>","  <em>"+o.desc+"</em>","</div>"].join(""),i.addEventListener("click",()=>Vo(o.id,{select:!0})),e.appendChild(i)})}a(Ss,"renderBrutalPaletteCards");let Ur=ti({getPrivacySettings:Ee,setPrivacySettings:_a,getCustomIdentity:je,setCustomIdentity:Fo,applyDisplay:a(()=>Qt(document),"applyDisplay"),refreshCleanDisplay:no,finishActiveDirectEdit:a(t=>{we?.__finish&&we.__finish(t)},"finishActiveDirectEdit")}),_s=Ur.sync,bd=Ur.collect,hd=Ur.setStatus,Es=Ur.bind,Oa=Kp({document,getSettings:Br,setSettings:jo,validateMapping:Be,defaultMapping:zr,getRecoveryMessage:a(()=>et,"getRecoveryMessage")}),fd=Oa.setStatus,Cs=Oa.sync,Ps=Oa.bind;function jt(){let t=document.getElementById("urppp-settings-panel");if(!t)return;let e=Xt()||bt,r=De(),o=Jt(),i=Kt(),s=te(),l=Oe(s),b=He(s),m=Uo(s),_={};t.querySelectorAll(".urppp-set-mode").forEach(z=>{_[z.dataset.theme]=cr(z.dataset.theme,s)}),ri(t,{seed:e,currentTheme:o,followSystem:i,skinId:s,darkSupported:l,dynamicSupported:b,fixedPalettes:m,followUseDynamic:Fr(),cleanDefault:ka(),cleanAnalysis:Aa()?"direct":"tab",appleEdge:_e(),autoUpdate:Sa(),modeAvailability:_}),m&&Ss(t);try{_s(t)}catch{}try{Cs(t)}catch{}try{window.__urpppCleanMode&&typeof window.__urpppCleanMode.refreshRender=="function"&&window.__urpppCleanMode.refreshRender()}catch{}let M=t.querySelector("#urppp-set-presets");M&&(M.innerHTML="",wa().forEach(z=>{let D=document.createElement("button");D.type="button",D.className="urppp-set-swatch"+(z.toLowerCase()===e.toLowerCase()?" ac":""),D.title=z,D.style.background=z,D.addEventListener("click",()=>{GM_setValue(q,z),Kt()?Gt(xe(),{system:!0}):Gt("scu-red",{manual:!0}),jt()}),M.appendChild(D)}));let N=t.querySelector("#urppp-set-schemes");N&&(N.innerHTML="",Fe(e).forEach(z=>{let D=document.createElement("button");D.type="button",D.className="urppp-set-scheme"+(z.id===r?" ac":""),D.dataset.scheme=z.id,D.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+z.bg+'"></span>','  <span style="background:'+z.surface+";border-color:"+z.border+'"></span>','  <span style="background:'+z.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+z.name+"</strong>","  <em>"+z.desc+"</em>","</div>"].join(""),D.addEventListener("click",()=>{va(z.id),GM_setValue(q,e),Kt()?Gt(xe(),{system:!0}):Gt("scu-red",{manual:!0}),jt()}),N.appendChild(D)}));try{Vs(t)}catch(z){try{console.warn("[URP++] renderSkinCards",z)}catch{}}try{let z=t.querySelector(".urppp-about-ver, #urppp-about-ver");z&&(z.textContent="SCU URP++ v"+n,z.tagName==="A"&&(z.setAttribute("href",p.repo),z.setAttribute("target","_blank"),z.setAttribute("rel","noopener noreferrer")))}catch{}try{vn(t)}catch{}}a(jt,"syncSettingsPanelUI");let gn=Qp({document,ensurePanel:wn,syncPanel:jt,refreshUpdateStatus:In}),zs=ei({document,theme:{isModeAvailable:cr,apply:Gt,supportsDark:Oe,supportsDynamic:He,getFollowSystem:Kt,setFollowSystem:$r,resolveFollowTheme:xe,getCurrent:Jt,getFollowDynamic:Fr,setFollowDynamic:Ca,syncNavbar:xt},preferences:{getCleanDefault:ka,setCleanDefault:os,getCleanAnalysis:a(()=>Aa()?"direct":"tab","getCleanAnalysis"),setCleanAnalysis:ns,getAppleEdge:_e,setAppleEdge:ps,applySkin:ae,getAutoUpdate:Sa,setAutoUpdate:is,checkUpdates:to},accent:{normalize:Vt,setAccent:a(t=>GM_setValue(q,t),"setAccent"),savePreset:as,getScheme:De,setScheme:va,listSchemePreviews:Fe},syncPanel:jt}),Et=Eo({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:n},uiDeps:{openSubpanel:a(t=>{t==="plugin-store"&&Ha("plugin")},"openSubpanel")}});a((function(){let e=a(()=>{try{Et.bootFromCache("assist")}catch{}},"run");document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}),"bootstrapPlugins")();function xn(){return gn.open()}a(xn,"openSettingsPanel");function yn(){gn.close()}a(yn,"closeSettingsPanel");let Wr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=";function vn(t){let e=t&&t.querySelector?t.querySelector("#urppp-about-logo"):document.getElementById("urppp-about-logo");e&&(e.getAttribute("src")!==Wr&&e.setAttribute("src",Wr),e.removeAttribute("referrerpolicy"),e.alt="SCU URP++",e.style.maxWidth="100%",e.style.height="auto",e.style.display="block")}a(vn,"ensureAboutLogo");function wn(){if(document.getElementById("urppp-settings-panel"))return;nl();try{ae()}catch{}try{ee&&ee.length&&Ce(ee)}catch{}let t=document.createElement("div");t.id="urppp-settings-mask",t.addEventListener("click",yn);let e=document.createElement("div");e.id="urppp-settings-panel",e.setAttribute("role","dialog"),e.setAttribute("aria-label","URP++ 设置");let r=Wr;e.innerHTML=Xp({logoData:Wr,repositoryUrl:p.repo,version:n}),document.documentElement.appendChild(t),document.documentElement.appendChild(e),Yp(e),e.querySelector("#urppp-set-close").addEventListener("click",yn);try{Es(e)}catch(i){console.warn("[URP++] privacy settings",i)}try{Ps(e)}catch(i){console.warn("[URP++] JSON settings",i)}try{vn(e)}catch{}let o=e.querySelector("#urppp-about-logo");o&&!o.__urpppFallback&&(o.__urpppFallback=!0,o.addEventListener("error",()=>{o.dataset.fallback!=="1"&&(o.dataset.fallback="1",o.src=r)})),zs.bind(e);try{Et.renderAssistUi(e.querySelector("#urppp-set-assist-slot"))}catch(i){console.warn("[URP++] plugin manager",i)}}a(wn,"ensureSettingsPanel");function Ha(t){let e=document.getElementById("urppp-settings-panel");if(!e)return;let r=document.getElementById("urppp-store-subpanel");r||(r=document.createElement("div"),r.id="urppp-store-subpanel",r.className="urppp-store-subpanel",r.innerHTML=`
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`,e.appendChild(r),r.querySelector("#urppp-store-sub-back").onclick=Ls);let o=r.querySelector("#urppp-store-sub-title"),i=r.querySelector("#urppp-store-sub-body");o.textContent=t==="theme"?"主题商店":"插件商店",i.innerHTML="",t==="theme"?Hs(i):Ln(i),r.classList.add("open")}a(Ha,"openStoreSubPanel");function Ls(){let t=document.getElementById("urppp-store-subpanel");if(!t)return;t.classList.remove("open");let e=t.querySelector("#urppp-store-sub-body");e&&(e.innerHTML="")}a(Ls,"closeStoreSubPanel");function kn(t){t.querySelectorAll(".urppp-store-tab").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll(".urppp-store-tab").forEach(o=>o.className="urppp-store-tab"),e.className="urppp-store-tab ac",t.querySelectorAll(".urppp-store-pane").forEach(o=>o.style.display="none");let r=t.querySelector('.urppp-store-pane[data-pane="'+e.dataset.tab+'"]');r&&(r.style.display="")})})}a(kn,"bindStoreTabs");function Ce(t){Array.isArray(t)&&t.forEach(e=>{if(!e||!e.id)return;let r="";try{r=GM_getValue("urppp_card_css_"+e.id,"")||""}catch{}let o=r||e.cardCss||"";if(!o)return;let i=document.getElementById("urppp-store-card-css-"+e.id);i||(i=document.createElement("style"),i.id="urppp-store-card-css-"+e.id,(document.head||document.documentElement).appendChild(i)),i.textContent!==o&&(i.textContent=o)})}a(Ce,"ensureStoreCardStyles");function qs(t,e){let r=(u.find(b=>b.id===t.id)||{}).repo,o=t.repo||r,i=o?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${at(o)}">仓库</button>`:"",s=t.cardCss||"",l=s?`<style>${s}</style>`:"";return`<div class="urppp-skin-card" data-skin="${at(t.id)}">
      ${l}
      <div class="urppp-skin-name">${at(t.name||t.id)}</div>
      <div class="urppp-skin-meta">${at(t.author||"")}${t.author&&t.version?" · ":""}v${at(t.version||"")}<span class="urppp-dows" data-dows-id="${at(t.id)}"></span></div>
      <p class="urppp-skin-desc">${at(t.description||"")}</p>
      <button type="button" class="urppp-skin-apply" data-store-theme="${at(t.id)}"${e?" disabled":""}>${e?"已安装":"下载"}</button>
      ${i}
    </div>`}a(qs,"themeStoreCard");async function Ra(t){let e=t.querySelector('[data-pane="download"]');if(!e)return;let r=a(o=>{if(!o.length){e.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载主题</p><p class="urppp-store-sub">已安装的主题不会再显示在这里。</p></div>';return}Ce(o),e.innerHTML=`<div class="urppp-store-theme-grid">${o.map(i=>qs(i,!1)).join("")}</div>`,e.querySelectorAll("[data-store-theme]").forEach(i=>{i.addEventListener("click",()=>Ts(i.dataset.storeTheme,i))}),e.querySelectorAll("[data-repo]").forEach(i=>i.addEventListener("click",()=>{try{window.open(i.dataset.repo,"_blank","noopener")}catch{}}));try{Qr(e)}catch{}},"render");r((ee||[]).filter(o=>o.type==="theme"&&!de(o.id)));try{let o=await Pe(!0);ee=o,Wa(o),document.body.contains(e)&&r(o.filter(i=>i.type==="theme"&&!de(i.id)))}catch{}}a(Ra,"fetchCatalogThemes");async function Ts(t,e){if(!e||e.disabled)return;e.disabled=!0,e.textContent="下载中…";let r=(await Pe()).find(l=>l.id===t);if(!r||!Array.isArray(r.entry)||!r.entry.length){e.disabled=!1,e.textContent="下载";return}let o=await _n(r);if(o==="fail"&&!await Yr("签名校验失败：该条目可能被篡改。是否仍要安装？")){e.disabled=!1,e.textContent="下载";return}if(o==="unknown"&&r._srcPub&&!await Yr("该源无有效签名校验，可能被篡改。是否自担风险继续下载？")){e.disabled=!1,e.textContent="下载";return}let i="";for(let l of r.entry)try{let b=await Promise.race([fetch(l,{cache:"no-store"}),new Promise((m,_)=>setTimeout(()=>_(new Error("timeout")),6e3))]);if(b&&b.ok){i=await b.text();break}}catch{}if(!i){gr("下载失败：所有源均不可达（本地测试源已关/网络不通）","error"),e.textContent="下载失败",setTimeout(()=>{e.textContent="下载",e.disabled=!1},1400);return}try{GM_setValue("urppp_theme_css_"+t,i)}catch{}if(u.some(l=>l.id===t)||Ho(t,{name:r.name||t,desc:r.desc||"下载主题",author:r.author||"",version:r.version||"1.0.0"}),r.cardCss)try{GM_setValue("urppp_card_css_"+t,r.cardCss)}catch{}try{Pa(t).textContent=i}catch{}try{Ce([{id:t,cardCss:r.cardCss||""}])}catch{}e.textContent="已安装",e.disabled=!0;try{Sn(t)}catch{}let s=e.closest&&e.closest(".urppp-store-inline");if(s){try{let l=s.querySelector("#urppp-theme-manage");l&&await Gr(l)}catch{}try{Ra(s)}catch{}}try{jt()}catch{}}a(Ts,"downloadStoreTheme");function Ms(t,e){let o=t.installed!==!1?"":`<button type="button" class="urppp-skin-apply urppp-store-del" data-theme-del="${at(t.id)}">删除</button>`,i=e&&e.repo||t.repo,s=i?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${at(i)}">仓库</button>`:"",l=te()===t.id,b=e&&e.cardCss||"";if(!b)try{b=GM_getValue("urppp_card_css_"+t.id,"")||""}catch{}let m=b?`<style>${b}</style>`:"";return`<div class="urppp-skin-card${l?" is-active":""}" data-skin="${at(t.id)}">
      ${m}
      <div class="urppp-skin-name">${at(t.name)}</div>
      <div class="urppp-skin-meta">${at(e&&e.author||"")}${e&&e.author&&t.version?" · ":""}v${at(t.version||"")}<span class="urppp-dows" data-dows-id="${at(t.id)}"></span></div>
      <p class="urppp-skin-desc">${at(t.desc||"")}</p>
      <button type="button" class="urppp-skin-apply${l?" is-current":""}" data-theme-use="${at(t.id)}"${l?" disabled":""}>${l?"使用中":"使用"}</button>
      ${o}${s}
    </div>`}a(Ms,"themeManageCardHtml");async function Gr(t){if(!t)return;let e=ee||[],r=ye(),o=Object.keys(r).map(s=>({id:s,name:r[s].name||s,desc:r[s].desc||"本地主题",version:r[s].version||"1.0.0",author:r[s].author||"本地",installed:!1})),i=u.filter(s=>s.installed!==!1||de(s.id)).concat(o.filter(s=>!u.some(l=>l.id===s.id)));if(!i.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无已装主题</p></div>';return}Ce(i.map(s=>{let l="";try{l=GM_getValue("urppp_card_css_"+s.id,"")||""}catch{}return{id:s.id,cardCss:l||(e.find(b=>b.id===s.id)||{}).cardCss||""}})),t.innerHTML=`<div class="urppp-store-theme-grid">${i.map(s=>Ms(s,e.find(l=>l.id===s.id))).join("")}</div>`;try{Qr(t)}catch{}t.querySelectorAll("[data-theme-use]").forEach(s=>s.addEventListener("click",()=>{if(Jo(s.dataset.themeUse)){try{jt()}catch{}t.querySelectorAll(".urppp-skin-card").forEach(l=>{let b=l.dataset.skin,m=l.querySelector(".urppp-skin-apply"),_=te()===b;l.classList.toggle("is-active",_),m&&(m.classList.toggle("is-current",_),m.disabled=_,m.textContent=_?"使用中":"使用")})}})),t.querySelectorAll("[data-theme-del]").forEach(s=>s.addEventListener("click",()=>{let l=s.dataset.themeDel,b=te()===l;try{GM_setValue("urppp_theme_css_"+l,"")}catch{}try{GM_setValue("urppp_card_css_"+l,"")}catch{}ls(l),ds(l);try{if(b){GM_setValue(d,"apple");try{document.documentElement.removeAttribute("data-urppp-skin")}catch{}try{document.body&&document.body.removeAttribute("data-urppp-skin")}catch{}ae();let _=Kt(),M=_?xe():Jt();Gt(M,{system:_})}}catch{}try{jt()}catch{}let m=t.closest(".urppp-store-inline");if(m){try{Gr(t)}catch{}try{Ra(m)}catch{}}})),t.querySelectorAll("[data-repo]").forEach(s=>s.addEventListener("click",()=>{try{window.open(s.dataset.repo,"_blank","noopener")}catch{}}))}a(Gr,"fetchThemeManage");function An(){return`<div class="urppp-store-settings">
      <button type="button" class="urppp-set-follow" data-store-auto-update>自动检测更新：关</button>
      <button type="button" class="urppp-set-btn" data-store-check-update>检查更新</button>
    </div>`}a(An,"storeManageSettingsHtml");let $s=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json"];function fr(){try{let t=JSON.parse(GM_getValue("urppp_store_sources","[]"));return Array.isArray(t)?t:[]}catch{return[]}}a(fr,"getCustomSources");function Ua(t){try{GM_setValue("urppp_store_sources",JSON.stringify(t))}catch{}}a(Ua,"saveCustomSources");function Is(){try{let t=GM_getValue("urppp_catalog_cache","");return t&&JSON.parse(t)||null}catch{return null}}a(Is,"catalogCacheRead");function Wa(t){try{Array.isArray(t)&&t.length&&GM_setValue("urppp_catalog_cache",JSON.stringify(t))}catch{}}a(Wa,"catalogCacheWrite");let ee=Is();async function Pe(t){if(ee&&!t)return ee;let e=a((M,N)=>Promise.race([M,new Promise((z,D)=>setTimeout(()=>D(new Error("timeout")),N))]),"withTimeout"),r=a(async M=>{try{let N=await e(fetch(M,{cache:"no-store"}),5e3);if(!(N&&N.ok))return null;let z=await N.json();return z&&Array.isArray(z.items)?z:null}catch{return null}},"fetchCatalogDoc"),o=await Promise.allSettled($s.map(M=>r(M))),i=null;for(let M of o){if(!(M.status==="fulfilled"&&M.value&&Array.isArray(M.value.items)))continue;let N=M.value.items.some(z=>z.type==="theme"&&z.cardCss);(!i||N&&!i.items.some(z=>z.type==="theme"&&z.cardCss))&&(i=M.value)}let s=i&&i.items||[],l=fr().filter(M=>M&&M.url&&M.enabled!==!1),b=await Promise.allSettled(l.map(async M=>{let N=await r(M.url);return{doc:N,pubkey:N?N.pubkey:""}})),m=[...s],_=new Set(m.map(M=>M&&M.id).filter(Boolean));for(let M of b){if(!(M.status==="fulfilled"&&M.value&&M.value.doc))continue;let N=M.value.pubkey||"";for(let z of M.value.doc.items)!z||!z.id||_.has(z.id)||(_.add(z.id),N&&(z._srcPub=N),m.push(z))}return ee=m,Wa(m),m}a(Pe,"fetchCatalogList");function Ns(){try{if(typeof crypto<"u"&&crypto&&crypto.subtle)return crypto.subtle;let t=typeof unsafeWindow<"u"&&unsafeWindow?unsafeWindow:typeof window<"u"?window:null;if(t&&t.crypto&&t.crypto.subtle)return t.crypto.subtle}catch{}return null}a(Ns,"getWebCrypto");function Vr(t){if(Array.isArray(t))return t.map(Vr);if(t&&typeof t=="object"){let e={};for(let r of Object.keys(t).filter(o=>o!=="signature"&&o!=="_srcPub").sort())e[r]=Vr(t[r]);return e}return t}a(Vr,"normalizeEntry");function Jr(t){try{let e=atob(t),r=new Uint8Array(e.length);for(let o=0;o<e.length;o+=1)r[o]=e.charCodeAt(o);return r}catch{return null}}a(Jr,"b64ToU8");async function Bs(t,e){let r=Ns();if(!r)try{if(!e||!t||!t.signature)return!1;let o=Jr(e),i=Jr(t.signature);if(!o||!i)return!1;let s=JSON.stringify(Vr(t));return Cp(i,o,ko(s))}catch{return null}if(!e||!t||!t.signature)return!1;try{let o=Jr(e);if(!o)return null;let i=await r.importKey("raw",o,{name:"Ed25519"},!1,["verify"]),s=Jr(t.signature);if(!s)return!1;let l=JSON.stringify(Vr(t)),b=await r.digest("SHA-256",new TextEncoder().encode(l)),m=new Uint8Array(b);return await r.verify({name:"Ed25519"},i,s,m)}catch{return null}}a(Bs,"verifyEntrySignature");function gr(t,e){try{let r=document.getElementById("urppp-toast");r||(r=document.createElement("div"),r.id="urppp-toast",r.className="urppp-toast",(document.body||document.documentElement).appendChild(r)),r.textContent=t,r.className="urppp-toast"+(e==="error"?" error":""),r.style.display="",r.style.pointerEvents="auto",r.style.transition="opacity .22s, transform .22s",r.style.opacity="0",r.style.transform="translateY(14px)",requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="none"}),clearTimeout(r._t),r._t=setTimeout(()=>{r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>{r.style.display="none"},260)},3200)}catch{try{window.alert(t)}catch{}}}a(gr,"toast");function Yr(t){return new Promise(e=>{try{let r=document.getElementById("urppp-confirm");r||(r=document.createElement("div"),r.id="urppp-confirm",r.className="urppp-confirm",r.innerHTML='<div class="urppp-confirm-card"><div class="urppp-confirm-txt"></div><div class="urppp-confirm-ops"><button type="button" class="urppp-set-btn ghost" data-cac>取消</button><button type="button" class="urppp-set-btn" data-ok>继续</button></div></div>',(document.body||document.documentElement).appendChild(r)),r.style.display="",r.querySelector(".urppp-confirm-txt").textContent=t,r.style.pointerEvents="auto",r.style.transition="opacity .22s, transform .22s",r.style.opacity="0",r.style.transform="translateY(14px)",requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="none"});let o=a(i=>{r.querySelector("[data-ok]").onclick=r.querySelector("[data-cac]").onclick=null,r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>{r.style.display="none"},260),e(i)},"done");r.querySelector("[data-ok]").onclick=()=>o(!0),r.querySelector("[data-cac]").onclick=()=>o(!1)}catch{try{e(window.confirm(t))}catch{e(!1)}}})}a(Yr,"confirmBottom");let ze="https://api.yanjiangrd.site";function Fs(){return new Promise(t=>{try{let e=GM_getValue("urppp_downs_salt","");if(e)return t(e);if(!ze||typeof GM_xmlhttpRequest!="function")return t("");GM_xmlhttpRequest({method:"GET",url:ze+"/downs/salt",timeout:8e3,onload:a(r=>{try{let o=String((JSON.parse(r.responseText)||{}).salt||"");if(/^[0-9a-f]{16,128}$/.test(o)){try{GM_setValue("urppp_downs_salt",o)}catch{}t(o)}else t("")}catch{t("")}},"onload"),onerror:a(()=>t(""),"onerror"),ontimeout:a(()=>t(""),"ontimeout")})}catch{t("")}})}a(Fs,"getDownsSalt");function Ds(){try{let t=GM_getValue("urppp_downs_sid","");if(t&&/^\d{6,20}$/.test(t))return t;let e=document.getElementById("urppp-user");if(e&&/^\d{6,20}$/.test(String(e.value||"").trim())){let o=String(e.value).trim();try{GM_setValue("urppp_downs_sid",o)}catch{}return o}let r=String(location.search||"").match(/[?&](?:userAccount|sno)=(\d{6,20})/);if(r){try{GM_setValue("urppp_downs_sid",r[1])}catch{}return r[1]}}catch{}return""}a(Ds,"getCurrentStudentId");async function Sn(t){try{if(!ze||!t||typeof GM_xmlhttpRequest!="function")return;let e=await Fs();if(!e)return;let r=Ds();if(!r)return;let o=ko(new TextEncoder().encode(e+"|"+r+"|"+t)),i="";for(let s=0;s<16;s++)i+=o[s].toString(16).padStart(2,"0");GM_xmlhttpRequest({method:"POST",url:ze+"/downs",timeout:8e3,headers:{"Content-Type":"application/json"},data:JSON.stringify({id:String(t),uid:i}),onerror:a(()=>{},"onerror"),ontimeout:a(()=>{},"ontimeout")})}catch{}}a(Sn,"reportStoreDownload");function js(t){return new Promise(e=>{try{if(!ze||!t||!t.length||typeof GM_xmlhttpRequest!="function")return e({});GM_xmlhttpRequest({method:"GET",url:ze+"/downs?ids="+encodeURIComponent(t.join(",")),timeout:8e3,onload:a(r=>{try{e(JSON.parse(r.responseText)||{})}catch{e({})}},"onload"),onerror:a(()=>e({}),"onerror"),ontimeout:a(()=>e({}),"ontimeout")})}catch{e({})}})}a(js,"fetchStoreDowns");async function Qr(t){try{if(!t||!ze)return;let e=t.querySelectorAll("[data-dows-id]");if(!e.length)return;let r=Array.from(new Set(Array.from(e).map(i=>i.dataset.dowsId))),o=await js(r);if(!document.body.contains(t))return;t.querySelectorAll("[data-dows-id]").forEach(i=>{let s=o[i.dataset.dowsId];typeof s=="number"&&s>=0&&(i.textContent=" · ↓"+(s>=1e4?(s/1e4).toFixed(1)+"w":String(s)))})}catch{}}a(Qr,"refreshStoreDowns"),setInterval(()=>{try{let t=document.getElementById("urppp-settings-panel");t&&getComputedStyle(t).display!=="none"&&Qr(t)}catch{}},3e4);async function _n(t){let e=t&&t._srcPub;if(!e)return"trust";let r=await Bs(t,e);return r===!0?"ok":r===!1?"fail":"unknown"}a(_n,"guardEntrySignature");function En(t,e){let r=String(t||"0").split(".").map(Number),o=String(e||"0").split(".").map(Number);for(let i=0;i<Math.max(r.length,o.length);i+=1){let s=r[i]||0,l=o[i]||0;if(s!==l)return s>l}return!1}a(En,"versionGt");function Os(t,e){let r=0;return e.forEach(o=>{if(!o.id)return;let i=t.querySelector('[data-theme-use="'+o.id+'"]');i&&En(o.version,u.find(l=>l.id===o.id)&&u.find(l=>l.id===o.id).version)&&(Cn(i.closest(".urppp-skin-card"),"主题"),r+=1);let s=t.querySelector('[data-plugin-id="'+o.id+'"]');if(s){let l=Et&&Et.api&&Et.api.get&&Et.api.get(o.id);l&&En(o.version,l.version)&&(Cn(s.closest(".urppp-store-item"),"插件"),r+=1)}}),r}a(Os,"applyStoreUpdateBadges");function Cn(t,e){if(!t||t.querySelector(".urppp-store-update"))return;let r=t.querySelector(".urppp-store-ops");if(!r)return;let o=document.createElement("button");o.type="button",o.className="urppp-set-btn urppp-store-update",o.textContent="有新更新",o.addEventListener("click",()=>{try{o.textContent="更新中…"}catch{}}),r.appendChild(o)}a(Cn,"addUpdateBadge");function Pn(t){let e=t.querySelector("[data-store-auto-update]"),r=t.querySelector("[data-store-check-update]");if(!e||!r)return;let o=GM_getValue("urppp_store_auto_update",!1),i=a(()=>{e.textContent="自动检测更新："+(o?"开":"关")},"sync");i(),e.addEventListener("click",()=>{o=!o,GM_setValue("urppp_store_auto_update",o),i()}),r.addEventListener("click",async()=>{r.disabled=!0;let s=r.textContent;r.textContent="检查中…";try{let l=await Pe(),b=Os(t,l);r.textContent=b?"发现更新":"已是最新"}catch{r.textContent="检查失败"}setTimeout(()=>{r.textContent=s,r.disabled=!1},1600)})}a(Pn,"bindStoreManageSettings");function Hs(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">主题下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">主题管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${An()}<button type="button" class="urppp-set-btn ghost" data-add-local-theme style="width:100%;margin:0 0 10px">＋ 添加本地主题</button><input type="file" accept=".css,.txt" data-local-theme-file style="display:none"><div class="urppp-store-bd"><div id="urppp-theme-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${Ga()}</div>
        </div>
      </div>`,kn(t),Pn(t),Rs(t),Va(t),Ra(t),Gr(t.querySelector("#urppp-theme-manage"))}a(Hs,"renderThemeStoreBody");function Ga(){let t=fr();return`<div class="urppp-src-manage">
      <p class="urppp-src-hint">自定义仓库源：添加第三方 catalog 一起拉取，官方源始终优先（同 id 取官方）。签名源安装前自动校验。</p>
      ${t.length?t.map((r,o)=>`
      <div class="urppp-src-item">
        <div class="urppp-src-meta"><strong>${at(r.name||"未命名")}</strong><span class="urppp-src-url">${at(r.url)}</span></div>
        <div class="urppp-src-ops">
          <button type="button" class="urppp-set-btn ghost" data-src-toggle="${o}">${r.enabled!==!1?"禁用":"启用"}</button>
          <button type="button" class="urppp-set-btn ghost" data-src-del="${o}">删除</button>
        </div>
      </div>`).join(""):'<div class="urppp-store-empty"><p>暂无自定义仓库源</p></div>'}
      <div class="urppp-src-add">
        <input type="text" class="urppp-input" data-src-url placeholder="catalog.json 地址">
        <input type="text" class="urppp-input" data-src-name placeholder="源名称（可选）">
        <button type="button" class="urppp-set-btn" data-src-add>添加仓库源</button>
      </div>
    </div>`}a(Ga,"storeSourcesHtml");function Va(t){let e=t.querySelector("[data-src-add]");if(e){let r=t.querySelector("[data-src-url]"),o=t.querySelector("[data-src-name]");e.addEventListener("click",async()=>{let i=(r.value||"").trim();if(!i)return;e.disabled=!0;let s=e.textContent;e.textContent="验证中…";try{let l=await fetch(i,{cache:"no-store"});if(!(l&&l.ok))throw new Error("无法访问");let b=await l.json();if(!(b&&Array.isArray(b.items)))throw new Error("不是合法 catalog（无 items）");let m=fr();if(m.some(_=>_.url===i)){gr("该源已存在");return}m.push({name:(o.value||"").trim()||i,url:i,enabled:!0}),Ua(m),ee=null,Ja(t)}catch(l){gr("添加失败："+(l&&l.message?l.message:l),"error")}finally{e.disabled=!1,e.textContent=s}})}t.querySelectorAll("[data-src-toggle]").forEach(r=>r.addEventListener("click",()=>{let o=Number(r.dataset.srcToggle),i=fr();i[o]&&(i[o].enabled=i[o].enabled===!1,Ua(i),Ja(t))})),t.querySelectorAll("[data-src-del]").forEach(r=>r.addEventListener("click",()=>{let o=Number(r.dataset.srcDel),i=fr();i[o]&&(i.splice(o,1),Ua(i),Ja(t))}))}a(Va,"bindStoreSources");function Ja(t){let e=t.querySelector('[data-pane="sources"]');if(e){let r=t;e.innerHTML=Ga(),Va(r)}}a(Ja,"refreshStoreSources");function Rs(t){let e=t.querySelector("[data-add-local-theme]"),r=t.querySelector("[data-local-theme-file]");!e||!r||(e.addEventListener("click",()=>r.click()),r.addEventListener("change",async()=>{let o=r.files&&r.files[0];if(!o)return;let i=await o.text(),s=i.match(/html\[data-urppp-skin="([\w-]+)"\]/);if(!s){gr('未能从 CSS 中识别主题 id（需要 html[data-urppp-skin="…"]）',"error"),r.value="";return}let l=s[1];try{GM_setValue("urppp_theme_css_"+l,i)}catch{}Ho(l,{name:l,desc:"本地主题",author:"本地",version:"1.0.0"});try{Pa(l).textContent=i}catch{}r.value="";try{Gr(t.querySelector("#urppp-theme-manage"))}catch{}}))}a(Rs,"bindLocalThemeImport");function Us(t){let e=t.repo?`<button type="button" class="urppp-store-repo" data-repo="${at(t.repo)}">仓库</button>`:"";return`<div class="urppp-store-item" data-plugin-card="${at(t.id)}">
      <div class="urppp-store-info">
        <div><strong>${at(t.name||t.id)}</strong><span class="urppp-store-meta">${at(t.author||"")}${t.author&&t.version?" · ":""}v${at(t.version||"")}<span class="urppp-dows" data-dows-id="${at(t.id)}"></span></span></div>
        <div class="urppp-store-item-desc">${at(t.description||"")}</div>
      </div>
      <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-apply="${at(t.id)}">安装</button>${e}</div>
    </div>`}a(Us,"pluginStoreCard");async function Ws(t){if(!t)return;let e=a(o=>{if(!o.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载插件</p><p class="urppp-store-sub">已安装的插件不会再显示在这里。</p></div>';return}t.innerHTML=`${o.map(i=>Us(i)).join("")}`,t.querySelectorAll("[data-plugin-apply]").forEach(i=>i.addEventListener("click",async()=>{i.disabled=!0;let s=i.textContent;i.textContent="下载中…";try{let l=(await Pe()).find(m=>m.id===i.dataset.pluginApply),b=l?await _n(l):"trust";if(b==="fail"&&!await Yr("签名校验失败：该插件可能被篡改。是否仍要装载？")){i.textContent="下载",i.disabled=!1;return}if(b==="unknown"&&l&&l._srcPub&&!await Yr("该源无有效签名校验，可能被篡改。是否自担风险继续装载？")){i.textContent="下载",i.disabled=!1;return}Et&&Et.api&&Et.api.install&&await Et.api.install(i.dataset.pluginApply,null),i.textContent="已安装";try{jt()}catch{}try{Sn(i.dataset.pluginApply)}catch{}}catch{i.textContent="失败"}setTimeout(()=>{i.textContent=s,i.disabled=!1},1200)})),t.querySelectorAll("[data-repo]").forEach(i=>i.addEventListener("click",()=>{try{window.open(i.dataset.repo,"_blank","noopener")}catch{}}));try{Qr(t)}catch{}},"render"),r=a(o=>(o||[]).filter(i=>i.type==="plugin"&&!(Et&&Et.api&&Et.api.isEnabled&&Et.api.isEnabled(i.id))),"filter");e(r(ee));try{let o=await Pe(!0);ee=o,Wa(o),document.body.contains(t)&&e(r(o))}catch{}}a(Ws,"fetchCatalogPlugins");async function zn(t){if(!t)return;let e=[];try{e=await Pe()}catch{}let r=Et&&Et.api&&Et.api.list&&Et.api.list()||[];if(!r.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}t.innerHTML=r.map(o=>{let i=e.find(b=>b.id===o.id),s=i&&i.downloads!=null?`<span class="urppp-store-dl">↓ ${at(String(i.downloads))}</span>`:"",l=o.repo||i&&i.repo?`<button type="button" class="urppp-set-btn ghost" data-repo="${at(o.repo||i.repo)}">仓库</button>`:"";return`<div class="urppp-store-item">
        <div class="urppp-store-row">
          <div class="urppp-store-info"><strong>${at(o.name||o.id)}</strong>${o.author?`<span class="urppp-store-author">${at(o.author)}</span>`:""}<span class="urppp-store-ver">${o.version?"v"+at(o.version):""}</span><span class="urppp-store-state ok">已装</span>${s}</div>
          <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-op="reload" data-plugin-id="${at(o.id)}">重新装载</button><button type="button" class="urppp-set-btn ghost" data-plugin-op="unload" data-plugin-id="${at(o.id)}">卸载</button>${l}</div>
        </div>
        ${o.description?`<p class="urppp-store-item-desc">${at(o.description)}</p>`:""}
      </div>`}).join(""),t.querySelectorAll('[data-plugin-op="reload"]').forEach(o=>o.addEventListener("click",async()=>{o.disabled=!0;let i=o.textContent;o.textContent="装载中…";try{Et&&Et.api&&Et.api.install&&await Et.api.install(o.dataset.pluginId,null),o.textContent="已装载";try{jt()}catch{}}catch{o.textContent="失败"}setTimeout(()=>{o.textContent=i,o.disabled=!1},1200)})),t.querySelectorAll('[data-plugin-op="unload"]').forEach(o=>o.addEventListener("click",()=>{try{Et&&Et.api&&Et.api.unregister&&Et.api.unregister(o.dataset.pluginId)}catch{}try{jt()}catch{}let i=t.closest(".urppp-store-inline");try{Ln(i)}catch{}})),t.querySelectorAll("[data-repo]").forEach(o=>o.addEventListener("click",()=>{try{window.open(o.dataset.repo,"_blank","noopener")}catch{}}))}a(zn,"fetchPluginManage");function Ln(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${An()}<button type="button" class="urppp-set-btn ghost" data-add-local-plugin style="width:100%;margin:0 0 10px">＋ 添加本地插件</button><input type="file" accept=".js,.txt" data-local-plugin-file style="display:none"><div class="urppp-store-bd" id="urppp-plugin-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${Ga()}</div>
        </div>
      </div>`,kn(t),Pn(t),Gs(t),Va(t),Ws(t.querySelector('[data-pane="download"]')),zn(t.querySelector("#urppp-plugin-manage"))}a(Ln,"renderPluginStoreBody");function Gs(t){let e=t.querySelector("[data-add-local-plugin]"),r=t.querySelector("[data-local-plugin-file]");!e||!r||(e.addEventListener("click",()=>r.click()),r.addEventListener("change",async()=>{let o=r.files&&r.files[0];if(!o)return;let i=await o.text();r.value="";try{new Function(i)()}catch(s){gr("本地插件加载失败："+(s&&s.message?s.message:s),"error")}try{zn(t.querySelector("#urppp-plugin-manage"))}catch{}}))}a(Gs,"bindLocalPluginImport");function Vs(t){if(!t)return;let e=t.querySelector("#urppp-theme-store");e&&!e.dataset.bound&&(e.dataset.bound="1",e.addEventListener("click",()=>Ha("theme")));let r=t.querySelector("#urppp-skin-list");if(!r)return;let o=te();if(r.innerHTML="",!u||!u.length){r.innerHTML='<p class="urppp-set-tip">暂无可用风格</p>';return}let i=ye(),s=u.filter(l=>l.installed!==!1||de(l.id)).concat(Object.keys(i).filter(l=>!u.some(b=>b.id===l)).map(l=>({id:l,name:i[l].name||l,desc:i[l].desc||"本地主题",version:i[l].version||"1.0.0",installed:!1})));s.forEach(l=>{let b=!!i[l.id],m=document.createElement("div");m.className="urppp-skin-card"+(l.id===o?" is-active":""),m.dataset.skin=l.id;let _=document.createElement("button");_.type="button",_.className="urppp-skin-apply";let M=l.installed!==!1||de(l.id)||b;M?l.id===o&&(l.ready||b)?(_.classList.add("is-current"),_.textContent="使用中",_.disabled=!0):_.textContent="应用主题":(_.classList.add("is-disabled"),_.textContent="去下载"),_.addEventListener("click",N=>{if(N.preventDefault(),N.stopPropagation(),!M){Ha("theme");return}if(!(l.id===o&&l.ready)&&Jo(l.id)){jt();try{window.__urpppCleanMode&&window.__urpppCleanMode.inject&&window.__urpppCleanMode.inject()}catch{}}}),m.innerHTML=['<div class="urppp-skin-name"></div>','<p class="urppp-skin-desc"></p>'].join(""),m.querySelector(".urppp-skin-name").textContent=l.name,m.querySelector(".urppp-skin-desc").textContent=l.desc,m.appendChild(_);try{let N="";try{N=GM_getValue("urppp_card_css_"+l.id,"")||""}catch{}if(N){let z=document.createElement("style");z.textContent=N,m.appendChild(z)}}catch{}r.appendChild(m)});try{let l=s.map(b=>{let m="";try{m=GM_getValue("urppp_card_css_"+b.id,"")||""}catch{}return{id:b.id,cardCss:m}});Ce(l)}catch{}}a(Vs,"renderSkinCards");let Ve=[],Ya=!1;function Js(t,e,r){let o=typeof AbortController=="function"?new AbortController:null,i=o?setTimeout(()=>o.abort(),r):null;return fetch(t,{cache:"no-store",headers:e,signal:o?o.signal:void 0}).then(s=>{if(!s.ok)throw new Error("HTTP "+s.status);return s.text()}).finally(()=>{i&&clearTimeout(i)})}a(Js,"fetchWithTimeout");function Ys(t,e){return new Promise((r,o)=>{try{GM_xmlhttpRequest({method:"GET",url:t,timeout:12e3,headers:e,onload:a(i=>{i.status>=200&&i.status<400?r(i.responseText||""):o(new Error("HTTP "+i.status))},"onload"),onerror:a(()=>o(new Error("network error")),"onerror"),ontimeout:a(()=>o(new Error("timeout")),"ontimeout")})}catch(i){o(i)}})}a(Ys,"gmRequestForUpdate");function Qs(t,e){let r={"Cache-Control":"no-cache"};return e&&e.range&&(r.Range=e.range),Js(t,r,12e3).catch(o=>{if(typeof GM_xmlhttpRequest=="function")return Ys(t,r);throw o})}a(Qs,"fetchTextForUpdate");async function Qa(t,e,r=1e3){let o=[],i=t[0],s=t.slice(1),l=a(z=>Qs(z,e).then(D=>({url:z,text:D})).catch(D=>(o.push((z.split("/")[2]||z)+": "+(D&&D.message||D)),null)),"grab"),b=l(i),m=new Promise(z=>setTimeout(()=>z("__TIMEOUT__"),r)),_=await Promise.race([b,m]);if(_!=="__TIMEOUT__"){if(_&&_.text&&_.text.length>0)return _.text;let D=(await Promise.all(s.map(l))).find(V=>V&&V.text&&V.text.length>0);if(D)return D.text;throw new Error("所有更新源均不可用（"+o.join("; ")+"）")}let M=Promise.all(s.map(l)).then(z=>{let D=z.find(V=>V&&V.text&&V.text.length>0);if(D)return D.text;throw new Error("所有更新源均不可用（"+o.join("; ")+"）")}),N=b.then(z=>{if(z&&z.text&&z.text.length>0)return z.text;throw new Error("主源内容无效")}).catch(()=>new Promise(()=>{}));return Promise.race([N,M])}a(Qa,"fetchFirstAvailable");function Le(t,e){let r=document.getElementById("urppp-set-update-status");r&&(r.dataset.locked=t?"1":"",r.innerHTML=t||"",r.style.color=e==="err"?"#b91c1c":e==="ok"?"#15803d":"var(--text-muted)")}a(Le,"setUpdateStatus");async function Xa(){let t=n,e="",r=!1,o="";try{let s=await Qa(p.sourceUrls(p.versionJson)),l=JSON.parse(s);e=String(l&&l.version||"").trim(),l&&String(l.prevVersion||"").trim()===t&&(r=!0),l&&typeof l.changelog=="string"&&l.changelog.trim()&&(o=l.changelog)}catch{}if(!e){let s=await Qa(p.sourceUrls("urppp.user.js"),{range:"bytes=0-2048"});e=xo(s)}if(!e)throw new Error("无法解析远程主插件版本");let i=Er(e,t);return{id:"main",name:"主插件",local:t,remote:e,status:i>0?"update":i===0?"latest":"ahead",updateUrl:p.mainRaw,pageUrl:p.greasySearch,changelogMd:r?o:""}}a(Xa,"checkMainUpdate");function qn(t,e,r){let o=String(t||"").replace(/\r\n/g,`
`);if(!o.trim())return"";let i=/^##\s*\[?v?([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)\]?[^\n]*$/gim,s=[],l;for(;(l=i.exec(o))!==null;)s.push({ver:l[1],index:l.index,headEnd:i.lastIndex});if(!s.length)return"";for(let m=0;m<s.length;m++){let _=m+1<s.length?s[m+1].index:o.length;s[m].body=o.slice(s[m].index,_).trim()}let b=[];for(let m of s)Er(m.ver,r)>0||Er(m.ver,e)<=0||b.push(m.body);return b.join(`

`).trim()}a(qn,"extractChangelogRange");function Tn(){let t=document.getElementById("urppp-update-toast-style");t&&t.remove();let e=document.createElement("style");e.id="urppp-update-toast-style",e.textContent=`
      #urppp-update-toast{
        position:fixed!important;left:16px!important;bottom:16px!important;z-index:14080!important;
        width:min(360px,calc(100vw - 32px))!important;
        background:var(--surface,#fff)!important;color:var(--text,#0f172a)!important;
        border:1px solid var(--border,#e2e8f0)!important;border-radius:14px!important;
        box-shadow:0 16px 40px rgba(15,23,42,.18)!important;
        padding:14px 14px 12px!important;box-sizing:border-box!important;
        font:13px/1.45 system-ui,-apple-system,Segoe UI,sans-serif!important;
        opacity:0;transform:translateY(18px) scale(.96);
        pointer-events:none;visibility:hidden;
        transition:
          opacity .28s cubic-bezier(.22,1,.36,1),
          transform .34s cubic-bezier(.22,1,.36,1),
          visibility 0s linear .34s;
        will-change:opacity,transform;
      }
      #urppp-update-toast.open{
        opacity:1;transform:translateY(0) scale(1);
        pointer-events:auto;visibility:visible;
        transition:
          opacity .28s cubic-bezier(.22,1,.36,1),
          transform .34s cubic-bezier(.22,1,.36,1),
          visibility 0s linear 0s;
      }
      #urppp-update-toast.closing{
        opacity:0;transform:translateY(14px) scale(.97);
        pointer-events:none;visibility:visible;
      }
      #urppp-update-toast .uut-title{font-weight:700!important;font-size:14px!important;margin:0 0 4px!important;padding-right:28px!important;color:var(--text)!important}
      #urppp-update-toast .uut-sub{color:var(--text-muted,#64748b)!important;font-size:12px!important;margin:0 0 10px!important}
      #urppp-update-toast .uut-actions{display:flex!important;gap:8px!important;flex-wrap:wrap!important}
      #urppp-update-toast .uut-btn,
      #urppp-update-changelog .uut-btn{
        appearance:none!important;-webkit-appearance:none!important;
        border:1px solid var(--border,#e2e8f0)!important;
        background:var(--input-bg,#f8fafc)!important;
        color:var(--text,#0f172a)!important;
        border-radius:10px!important;padding:7px 12px!important;cursor:pointer!important;
        font-size:12px!important;font-weight:600!important;line-height:1.2!important;
        box-shadow:none!important;margin:0!important;min-height:0!important;
        transition:transform .15s ease,opacity .15s ease,background .15s ease,border-color .15s ease!important;
      }
      #urppp-update-toast .uut-btn:hover,
      #urppp-update-changelog .uut-btn:hover{
        transform:translateY(-1px);border-color:var(--primary,#b53434)!important;
      }
      #urppp-update-toast .uut-btn.primary,
      #urppp-update-changelog .uut-btn.primary{
        background:var(--primary,#b53434)!important;border-color:var(--primary,#b53434)!important;color:#fff!important;
      }
      #urppp-update-toast .uut-btn.ghost,
      #urppp-update-changelog .uut-btn.ghost{
        background:transparent!important;
      }
      #urppp-update-toast .uut-close{
        position:absolute!important;top:8px!important;right:8px!important;width:28px!important;height:28px!important;border:none!important;
        background:transparent!important;color:var(--text-muted,#64748b)!important;border-radius:8px!important;cursor:pointer!important;font-size:16px!important;
      }
      #urppp-update-toast .uut-close:hover{background:var(--input-bg,#f8fafc)!important;color:var(--text,#0f172a)!important}
      #urppp-update-changelog{
        position:fixed!important;inset:0!important;z-index:14090!important;
        display:flex!important;align-items:center!important;justify-content:center!important;
        background:rgba(15,23,42,0)!important;padding:16px!important;box-sizing:border-box!important;
        opacity:0;pointer-events:none;visibility:hidden;
        transition:opacity .26s ease,background .26s ease,visibility 0s linear .26s;
      }
      #urppp-update-changelog.open{
        opacity:1;pointer-events:auto;visibility:visible;background:rgba(15,23,42,.42)!important;
        transition:opacity .26s ease,background .26s ease,visibility 0s linear 0s;
      }
      #urppp-update-changelog.closing{
        opacity:0;pointer-events:none;visibility:visible;background:rgba(15,23,42,0)!important;
      }
      #urppp-update-changelog .uuc-panel{
        width:min(520px,100%)!important;max-height:min(72vh,640px)!important;overflow:auto!important;
        background:var(--surface,#fff)!important;color:var(--text,#0f172a)!important;
        border:1px solid var(--border,#e2e8f0)!important;border-radius:14px!important;
        box-shadow:0 20px 50px rgba(15,23,42,.24)!important;padding:16px!important;box-sizing:border-box!important;
        transform:translateY(16px) scale(.96);opacity:0;
        transition:transform .32s cubic-bezier(.22,1,.36,1),opacity .26s ease;
      }
      #urppp-update-changelog.open .uuc-panel{transform:translateY(0) scale(1);opacity:1}
      #urppp-update-changelog.closing .uuc-panel{transform:translateY(12px) scale(.97);opacity:0}
      #urppp-update-changelog .uuc-head{
        display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin-bottom:12px!important;
        position:sticky!important;top:0!important;background:var(--surface,#fff)!important;z-index:1!important;padding-bottom:8px!important;
        border-bottom:1px solid var(--border,#e2e8f0)!important;
      }
      #urppp-update-changelog .uuc-head h3{margin:0!important;font-size:15px!important;font-weight:700!important;color:var(--text)!important}
      #urppp-update-changelog .uuc-body{
        font-size:13px!important;line-height:1.6!important;color:var(--text,#0f172a)!important;
        white-space:normal!important;
      }
      #urppp-update-changelog .uuc-body h2{
        margin:0 0 10px!important;font-size:16px!important;font-weight:700!important;color:var(--text)!important;
        border:none!important;padding:0!important;
      }
      #urppp-update-changelog .uuc-body h3{
        margin:14px 0 8px!important;font-size:13px!important;font-weight:700!important;
        color:var(--primary,#b53434)!important;letter-spacing:.02em!important;
      }
      #urppp-update-changelog .uuc-body p{
        margin:0 0 8px!important;color:var(--text)!important;
      }
      #urppp-update-changelog .uuc-body ul{
        margin:0 0 10px!important;padding:0 0 0 1.15em!important;list-style:disc!important;
      }
      #urppp-update-changelog .uuc-body li{
        margin:0 0 6px!important;color:var(--text)!important;
      }
      #urppp-update-changelog .uuc-body code{
        font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;
        font-size:12px!important;background:var(--input-bg,#f1f5f9)!important;
        border:1px solid var(--border,#e2e8f0)!important;border-radius:6px!important;
        padding:1px 5px!important;color:var(--text)!important;
      }
      #urppp-update-changelog .uuc-body a{color:var(--primary,#b53434)!important;text-decoration:underline!important}
      #urppp-update-changelog .uuc-body .uuc-meta{
        color:var(--text-muted,#64748b)!important;font-size:12px!important;margin-bottom:12px!important;
      }
      @media (prefers-reduced-motion: reduce) {
        #urppp-update-toast,#urppp-update-toast.open,#urppp-update-toast.closing,
        #urppp-update-changelog,#urppp-update-changelog.open,#urppp-update-changelog.closing,
        #urppp-update-changelog .uuc-panel{transition:none!important;transform:none!important}
      }
    `,document.documentElement.appendChild(e)}a(Tn,"ensureUpdateToastStyles");function Xs(t){let e=String(t||"").replace(/\r\n/g,`
`).trim();if(!e)return'<p class="uuc-meta">暂无更新日志</p>';let r=a(b=>{let m=at(b);return m=m.replace(/`([^`]+)`/g,"<code>$1</code>"),m=m.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),m=m.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),m=m.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'),m},"inline"),o=e.split(`
`),i=[],s=!1,l=a(()=>{s&&(i.push("</ul>"),s=!1)},"closeList");for(let b=0;b<o.length;b++){let _=o[b].replace(/\s+$/,"");if(!_.trim()){l();continue}let M=_.match(/^(#{2,3})\s+(.+)$/);if(M){l();let z=M[1].length,D=M[2];i.push(z===2?`<h2>${r(D)}</h2>`:`<h3>${r(D)}</h3>`);continue}let N=_.match(/^[-*]\s+(.+)$/);if(N){s||(i.push("<ul>"),s=!0),i.push(`<li>${r(N[1])}</li>`);continue}l(),i.push(`<p>${r(_)}</p>`)}return l(),i.join("")||'<p class="uuc-meta">暂无更新日志</p>'}a(Xs,"renderChangelogMarkdown");function Mn(t){let e=t||document.getElementById("urppp-update-toast");if(!e||!e.classList.contains("open")){e&&e.classList.remove("open","closing");return}if(e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=a(()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",o)},"done"),o=a(i=>{i&&i.target!==e||i&&i.propertyName&&i.propertyName!=="opacity"&&i.propertyName!=="transform"||r()},"onEnd");e.addEventListener("transitionend",o),setTimeout(r,380)}a(Mn,"hideUpdateToast");function Ks(t){let e=t||document.getElementById("urppp-update-changelog");if(!e||!e.classList.contains("open")&&!e.classList.contains("closing")||e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=a(()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",o)},"done"),o=a(i=>{i&&i.target!==e||i&&i.propertyName&&i.propertyName!=="opacity"&&i.propertyName!=="background-color"&&i.propertyName!=="background"||r()},"onEnd");e.addEventListener("transitionend",o),setTimeout(r,360)}a(Ks,"hideChangelogModal");function $n(t,e){Tn();let r=document.getElementById("urppp-update-changelog");r||(r=document.createElement("div"),r.id="urppp-update-changelog",r.innerHTML=`
        <div class="uuc-panel" role="dialog" aria-modal="true" aria-label="更新日志">
          <div class="uuc-head">
            <h3></h3>
            <button type="button" class="uut-btn ghost" data-close="1">关闭</button>
          </div>
          <div class="uuc-body"></div>
        </div>`,r.addEventListener("click",o=>{(o.target===r||o.target&&o.target.getAttribute&&o.target.getAttribute("data-close")==="1")&&Ks(r)}),document.documentElement.appendChild(r)),r.querySelector("h3").textContent=t||"更新日志",r.querySelector(".uuc-body").innerHTML=e||'<p class="uuc-meta">暂无更新日志</p>',r.__closing=!1,r.classList.remove("open","closing"),r.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>r.classList.add("open"))})}a($n,"openChangelogModal");function Ka(t){Tn();let e=document.getElementById("urppp-update-toast");e||(e=document.createElement("div"),e.id="urppp-update-toast",e.innerHTML=`
        <button type="button" class="uut-close" aria-label="关闭">×</button>
        <div class="uut-title"></div>
        <div class="uut-sub"></div>
        <div class="uut-actions">
          <button type="button" class="uut-btn" data-act="log">更新日志</button>
          <button type="button" class="uut-btn primary" data-act="go">去更新</button>
          <button type="button" class="uut-btn ghost" data-act="later">稍后</button>
        </div>`,e.querySelector(".uut-close").addEventListener("click",()=>Mn(e)),e.addEventListener("click",async r=>{let o=r.target&&r.target.closest?r.target.closest("[data-act]"):null;if(!o)return;let i=o.getAttribute("data-act"),s=e.__pack||{};if(i==="later"){Mn(e);return}if(i==="go"){let l=s.updateUrl||p.mainRaw;try{window.open(l,"_blank","noopener,noreferrer")}catch{location.href=l}return}if(i==="log"){o.disabled=!0,o.textContent="加载中…";try{let l=s.changelogMd;l||(l=await Qa(p.sourceUrls("CHANGELOG.md")),s.changelogMd=l);let b=qn(l,s.local,s.remote),m=b?Xs(b):'<p class="uuc-meta">未找到区间日志。</p><p><a href="'+p.changelogPage+'" target="_blank" rel="noopener noreferrer">打开完整 CHANGELOG</a></p>';$n("更新日志 "+s.local+" → "+s.remote,m)}catch(l){$n("更新日志","<p>加载失败："+at(l&&l.message||l)+'</p><p><a href="'+p.changelogPage+'" target="_blank" rel="noopener noreferrer">打开 GitHub CHANGELOG</a></p>')}finally{o.disabled=!1,o.textContent="更新日志"}}}),document.documentElement.appendChild(e)),e.__pack=t||{},e.querySelector(".uut-title").textContent="发现新版本 "+(t&&t.remote||""),e.querySelector(".uut-sub").textContent="当前 "+(t&&t.local||"")+" · 主插件可更新",e.__closing=!1,e.classList.remove("open","closing"),e.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>e.classList.add("open"))})}a(Ka,"showUpdateToast");async function Za(){if(Sa()&&!window.__urpppAutoUpdateTried){window.__urpppAutoUpdateTried=!0;try{let t=await Xa();t&&t.status==="update"&&Ka(t);let e=await Zs();if(e)try{console.log("[URP++] 辅助插件热更新到",e.version)}catch{}}catch(t){try{console.debug("[URP++] auto update check failed",t)}catch{}}}}a(Za,"maybeAutoCheckUpdate");function Zs(){let t=(window.__urpppUpdateCheckers||Ve||[]).find(e=>e&&e.id==="assist");return!t||typeof t.check!="function"?Promise.resolve(null):Promise.resolve().then(()=>t.check()).then(e=>e&&e.status==="update"?Et.update("assist"):null).catch(()=>null)}a(Zs,"hotUpdateAssist");async function to(){if(Ya)return;Ya=!0;let t=document.getElementById("urppp-set-check-update");t&&(t.disabled=!0,t.textContent="检查中…"),Le("正在从多源检查更新…");try{let e=[Xa()];(Ve||[]).forEach(m=>{m&&typeof m.check=="function"&&e.push(Promise.resolve().then(()=>m.check()).then(_=>_||{id:m.id||"extra",name:m.name||"扩展",status:"err",message:"无结果"}).catch(_=>({id:m.id||"extra",name:m.name||"扩展",status:"err",message:String(_&&_.message||_)})))});let r=await Promise.all(e),o=r.map(m=>{if(!m)return"";if(m.status==="err")return`• <b>${at(m.name||m.id)}</b>：检查失败（${at(m.message||"unknown")}）`;if(m.status==="update"){let _="";if(m.id==="assist"&&Et&&Et.loaded("assist"))_=' <a class="urppp-update-relaunch" href="javascript:void(0)" data-urppp-relaunch="assist" rel="nofollow">重新装载</a>';else{let M=m.updateUrl?` <a href="${at(m.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`:"",N=m.pageUrl?` <a href="${at(m.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`:"";_=M+N}return`• <b>${at(m.name)}</b>：发现新版本 <b>${at(m.remote)}</b>（当前 ${at(m.local)}）${_}`}return m.status==="ahead"?`• <b>${at(m.name)}</b>：本地 ${at(m.local)} 新于远程 ${at(m.remote)}`:`• <b>${at(m.name)}</b>：已是最新（${at(m.local)}）`}).filter(Boolean),i=r.some(m=>m&&m.status==="update"),s=r.some(m=>m&&m.status==="err");Le(`${i?"检查完成：发现更新":s?"检查完成：部分失败":"检查完成：全部最新"}<br>${o.join("<br>")}<br><span style="opacity:.85">仓库：<a href="${p.repo}" target="_blank" rel="noopener noreferrer">SCU-URP-plusplus</a></span>`,s?"err":"ok");let b=document.querySelector('#urppp-set-update-status .urppp-update-relaunch[data-urppp-relaunch="assist"]');b&&b.addEventListener("click",()=>{try{Le("正在重新装载辅助插件…",""),Et.install("assist").then(()=>{Le("辅助插件已重新装载，刷新页面后生效。","ok")}).catch(m=>{Le("重新装载失败："+(m&&m.message?m.message:m),"err")})}catch(m){Le("重新装载失败："+(m&&m.message?m.message:m),"err")}})}catch(e){Le("检查失败："+at(e&&e.message||e),"err")}finally{Ya=!1,t&&(t.disabled=!1,t.textContent="检查更新")}}a(to,"checkForUpdates");function In(){let t=document.getElementById("urppp-set-update-status");if(!t||t.dataset.locked==="1")return;let e="当前主插件："+n,r=t.getAttribute("data-assist-version")||"";r&&(e+="；辅助插件："+r),t.textContent=e,t.style.color="var(--text-muted)"}a(In,"refreshUpdateStatusHint");function tl(t){if(!t||typeof t.check!="function")return!1;let e=String(t.id||t.name||"").trim();if(!e)return!1;let r=Ve.findIndex(i=>i&&i.id===e),o={id:e,name:t.name||e,check:t.check,localVersion:t.localVersion||""};r>=0?Ve[r]=o:Ve.push(o);try{let i=document.getElementById("urppp-set-update-status");i&&o.localVersion&&e==="assist"&&i.setAttribute("data-assist-version",String(o.localVersion))}catch{}try{In()}catch{}return!0}a(tl,"registerUpdateChecker");function el(){let t={version:n,urls:p,check:to,checkMain:Xa,registerChecker:tl,compareVersions:Er,parseUserscriptVersion:xo,extractChangelogRange:qn,showUpdateToast:Ka,maybeAutoCheckUpdate:Za,listCheckers:a(()=>Ve.slice(),"listCheckers")};try{window.__urpppUpdate=t}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppUpdate=t)}catch{}return t}a(el,"publishUpdateApi"),el();let{rebuildSidebarCompletely:Nn,syncMobileContentOffset:Je,syncSidebarUnderNavbar:qe}=ts({}),{rebuildDashboard:rl}=Ui({deps:{statCardPrivacyMarkup:il}}),al="urppp-clean-open",eo={100:4,99:4,98:4,97:4,96:4,95:4,94:3.9,93:3.8,92:3.7,91:3.6,90:3.5,89:3.4,88:3.3,87:3.2,86:3.1,85:3,84:2.9,83:2.8,82:2.7,81:2.6,80:2.5,79:2.4,78:2.3,77:2.2,76:2.1,75:2,74:1.9,73:1.8,72:1.7,71:1.6,70:1.5,69:1.4,68:1.3,67:1.2,66:1.1,65:1,64:.9,63:.8,62:.7,61:.6,60:.5};function ue(t){if(t==null||t==="")return!1;let e=String(t).trim();if(!e)return!1;if(/未评估|未评教|待评估|待评教/.test(e))return!0;let r=Number(e);return!Number.isNaN(r)&&r<0}a(ue,"isUnevaluatedScore");function Xr(t){if(t==null||t==="")return!1;let e=Number(t);return!Number.isNaN(e)&&e>=0&&e<=5}a(Xr,"isValidOfficialGpa");function Kr(t){let e=String(t||"").trim();if(!e)return"";let r=e.match(/[\u4e00-\u9fffA-Za-z0-9]/);return r?r[0]:e.charAt(0)}a(Kr,"firstContentChar");function ro(t,e){let r=String(t||""),o=Number(e)||0;return!r||o<=0||o>r.length?!1:r.charAt(o-1)==="1"}a(ro,"weekBitmapActive");function Ye(t){if(t==null||t==="")return null;let e=String(t).trim();if(!e||ue(e)||/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(e))return null;if(/^A\+$/i.test(e)||/^A$/i.test(e))return 4;if(/^A-$/i.test(e))return 3.7;if(/^B\+$/i.test(e))return 3.3;if(/^B$/i.test(e))return 3;if(/^B-$/i.test(e))return 2.7;if(/^C\+$/i.test(e))return 2.3;if(/^C$/i.test(e))return 2;if(/^C-$/i.test(e))return 1.7;if(/^D$/i.test(e))return 1.3;if(/^F$/i.test(e))return 0;if(/优秀/.test(e))return 4;if(/良好/.test(e))return 3;if(/中等/.test(e))return 2;if(/及格/.test(e)&&!/不及格/.test(e))return 1;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 1;let r=parseFloat(e.replace(/[^\d.]/g,""));if(Number.isNaN(r)||r<0)return null;let o=Math.round(r);return o<60?0:o>100?4:eo[o]!=null?eo[o]:eo[Math.max(60,Math.min(100,Math.floor(r)))]||0}a(Ye,"scoreToGpa");function Qe(t){let e=String(t||"").trim();if(!e||ue(e))return null;if(/优秀/.test(e))return 95;if(/良好/.test(e))return 85;if(/中等/.test(e))return 75;if(/及格/.test(e)&&!/不及格/.test(e))return 65;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 70;if(/^A/i.test(e))return 95;if(/^B/i.test(e))return 85;if(/^C/i.test(e))return 75;if(/^D/i.test(e))return 65;if(/^F/i.test(e))return 0;let r=parseFloat(e.replace(/[^\d.]/g,""));return Number.isNaN(r)||r<0?null:r}a(Qe,"scoreToNumber");function Te(t){return Math.round((Number(t)||0)*100)/100}a(Te,"round2");function Bn(t){return/必修/.test(String(t||""))}a(Bn,"isRequiredAttr");function oe(t){let e=0,r=0,o=0,i=0,s=0,l=0,b=0,m=0;return(t||[]).forEach(_=>{if(_&&(_.unevaluated||ue(_.score)))return;let M=Number(_.credit)||0,N=Qe(_.score),z=Xr(_.officialGpa)?Number(_.officialGpa):Ye(_.score);N==null||M<=0||(e+=M,r+=N*M,z!=null&&(o+=z*M,i+=M),_.required&&(s+=M,l+=N*M,z!=null&&(b+=z*M,m+=M)))}),{totalCredit:Te(e),avgScore:Te(e?r/e:0),avgGpa:Te(i?o/i:0),requiredCredit:Te(s),requiredGpa:Te(m?b/m:0),requiredAvg:Te(s?l/s:0),count:(t||[]).length}}a(oe,"summarizeCourses");function ao(t){let e=String(t||"");return/^https?:\/\//i.test(e)?e:e.startsWith("//")?location.protocol+e:e.startsWith("/")?location.origin+e:location.origin+"/"+e.replace(/^\.\//,"")}a(ao,"absUrl");function Yt(t,e){let r=ao(t),o=e&&e.method||"GET",i=e&&e.data||null;return new Promise((s,l)=>{let b=a((m,_)=>m?s(_):l(new Error(_||"fetch failed")),"done");try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:o,url:r,data:i||void 0,headers:e&&e.headers?e.headers:{},withCredentials:!0,onload:a(m=>{m.status>=200&&m.status<400?b(!0,m.responseText||""):b(!1,"HTTP "+m.status)},"onload"),onerror:a(()=>b(!1,"network error"),"onerror")});return}}catch{}fetch(r,{method:o,credentials:"include",cache:"no-store",headers:e&&e.headers?e.headers:{},body:i||void 0}).then(m=>{if(!m.ok)throw new Error("HTTP "+m.status);return m.text()}).then(m=>b(!0,m)).catch(m=>b(!1,m&&m.message))})}a(Yt,"fetchText");function Zr(t){return new DOMParser().parseFromString(String(t||""),"text/html")}a(Zr,"parseHtml");function Fn(){if(document.getElementById("urppp-feature-style"))return;let t=document.createElement("style");t.id="urppp-feature-style",t.textContent=xi,(document.head||document.documentElement).appendChild(t)}a(Fn,"ensureFeatureStyles");function ol(){if(document.getElementById("urppp-schedule-export-style"))return;let t=document.createElement("style");t.id="urppp-schedule-export-style",t.textContent=wi,(document.head||document.documentElement).appendChild(t)}a(ol,"ensureScheduleExportStyles");function nl(){if(document.getElementById("urppp-settings-style"))return;let t=document.createElement("style");t.id="urppp-settings-style",t.textContent=ki,(document.head||document.documentElement).appendChild(t)}a(nl,"ensureSettingsStyles");function Dn(t){let r=(t&&t.querySelector?t:document).querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(!r)return null;let o=r.querySelector(".urppp-user-name-value");if(o)return o;let i=r.cloneNode(!0);i.querySelectorAll("small, i, img, b, .badge").forEach(b=>b.remove());let s=(i.textContent||"").replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim();Array.from(r.childNodes).forEach(b=>{b.nodeType===Node.TEXT_NODE&&b.textContent.trim()&&b.remove()});let l=document.createElement("span");return l.className="urppp-user-name-value",l.textContent=s||"同学",l.__urpppOriginalText=l.textContent,r.appendChild(l),l}a(Dn,"ensureNavNameTarget");function ta(t){let e=String(t||"").replace(/[\s:：]/g,"");return e?/姓名|英文姓名|姓名拼音/.test(e)?"name":/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(e)?"identity":/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(e)?"organization":/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(e)?"contact":/绩点|GPA/.test(e)?"gpa":/学分/.test(e)?"credit":/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(e)?"grade":/课表|日程安排/.test(e)?"schedule":"":""}a(ta,"classifyPrivacyLabel");function pl(t,e){let r=String(t||"")+" "+String(e||"");return/绩点|GPA/.test(r)?"majorGpa":/主修为|培养方案|方案/.test(r)?"majorPlan":/尚不及格|未及格/.test(r)?"failedCourses":/待修读课程/.test(r)?"remainingCourses":/已修读课程/.test(r)?"completedCourses":""}a(pl,"classifyHomeDataKey");function ea(t,e,r){let o=e?` data-urppp-edit-key="${e}"`:"";return`<span class="urppp-private-value" data-urppp-private="${t}"${o}>${r}</span>`}a(ea,"homePrivateValueSpan");function il(t,e){let r=at(t),o=at(e),i=pl(t,e),l={completedCourses:"other",failedCourses:"other",majorGpa:"gpa",majorPlan:"organization",remainingCourses:"other"}[i]||ta(String(t||"")+" "+String(e||""));if(l==="organization")return e?{valueHtml:r,labelHtml:ea("organization",i,o)}:{valueHtml:ea("organization",i,r),labelHtml:o};if(!["grade","gpa","credit","other"].includes(l))return{valueHtml:r,labelHtml:o};let b=String(e||"").match(/-?\d+(?:\.\d+)?/);if(!(/^-?\d+(?:\.\d+)?$/.test(String(t||"").trim())||/^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(t||"").trim()))&&b){let _=b.index||0,M=String(e).slice(0,_),N=String(e).slice(_+b[0].length);return{valueHtml:r,labelHtml:`${at(M)}${ea(l,i,at(b[0]))}${at(N)}`}}return{valueHtml:ea(l,i,r),labelHtml:o}}a(il,"statCardPrivacyMarkup");function Me(t,e){if(!t||t.mode==="off")return"";if(t.mode==="one")return t.mask||qr;if(e==="name")return"";let r=t.fields&&t.fields[e];return!r||!r.enabled?"":String(r.replacement||t.mask||qr)}a(Me,"privacyReplacement");function xr(t,e){if(!(!t||!e)&&!(t.querySelector&&t.querySelector("input,select,textarea,button"))){if(!t.classList.contains("urppp-private-text")){let r=getComputedStyle(t).fontSize;r&&r!=="0px"&&t.style.setProperty("--urppp-private-font-size",r)}t.classList.add("urppp-private-text"),t.setAttribute("data-urppp-private-mask",e)}}a(xr,"markPrivateText");function jn(t,e){if(!t||!t.parentElement)return;let r=t.parentElement;t.classList.add("urppp-private-avatar"),r.classList.add("urppp-private-avatar-host"),r.setAttribute("data-urppp-private-mask",e||qr);let o=t.getBoundingClientRect();r.style.setProperty("--urppp-avatar-left",t.offsetLeft+"px"),r.style.setProperty("--urppp-avatar-top",t.offsetTop+"px"),r.style.setProperty("--urppp-avatar-width",Math.max(1,o.width)+"px"),r.style.setProperty("--urppp-avatar-height",Math.max(1,o.height)+"px"),r.style.setProperty("--urppp-avatar-radius",getComputedStyle(t).borderRadius||"50%")}a(jn,"markPrivateAvatar");function sl(t,e){if(!t||!e)return;let r=t.matches("table")&&t.closest(".table-responsive, .urppp-table-wrap")||t;r.classList.add("urppp-private-block"),r.setAttribute("data-urppp-private-mask",e)}a(sl,"markPrivateBlock");function ll(t,e){if(!(!t||!U[e])){if(!t.hasAttribute("data-urppp-direct-tabindex")){let r=t.getAttribute("tabindex");t.setAttribute("data-urppp-direct-tabindex",r??"__none__"),t.__urpppDirectTitle=t.getAttribute("title"),t.__urpppDirectAriaLabel=t.getAttribute("aria-label")}t.classList.add("urppp-direct-editable"),t.setAttribute("tabindex","0"),t.setAttribute("data-urppp-edit-key",e),t.setAttribute("aria-label","修改"+U[e]+"显示值"),t.title="点击修改显示值"}}a(ll,"markDirectEditable");let we=null;function On(t){let e=t&&t.getAttribute("data-urppp-edit-key");if(!e||!U[e])return;we&&we.__finish&&we.__finish(!1);let r=Ee();if(r.mode!=="custom"||!r.directEdit.enabled)return;let i=String(r.directEdit.values[e]||"")||t.getAttribute("data-urppp-private-mask")||String(t.textContent||"").trim(),s=t.getBoundingClientRect(),l=t.parentElement?.getBoundingClientRect(),b=s.height>=8||!l?s:{left:s.left,top:l.top,width:Math.max(s.width,40),height:l.height},m=document.createElement("input"),_=getComputedStyle(t),M=Math.min(Math.max(b.width+64,140),Math.max(140,window.innerWidth-24)),N=Math.min(Math.max(12,b.left),Math.max(12,window.innerWidth-M-12)),z=Math.min(Math.max(12,b.top+(b.height-36)/2),Math.max(12,window.innerHeight-48));m.type="text",m.maxLength=80,m.className="urppp-direct-edit-input",m.value=i,m.setAttribute("aria-label","修改"+U[e]+"显示值"),m.style.left=N+"px",m.style.top=z+"px",m.style.setProperty("--urppp-direct-edit-width",M+"px"),m.style.fontFamily=_.fontFamily,m.style.fontSize=(window.innerWidth<=520?16:Math.min(18,Math.max(13,parseFloat(_.fontSize)||14)))+"px";let D=!1,V=a(O=>{if(D||(D=!0,m.remove(),we===m&&(we=null),O))return;let R=Ee();R.mode!=="custom"||!R.directEdit.enabled||(R.directEdit.values[e]=String(m.value||"").trim().slice(0,80),_a(R),Qt(document),so(R.directEdit.values[e]?"显示值已更新":"已恢复分类设置"))},"finish");m.__finish=V,m.addEventListener("click",O=>O.stopPropagation()),m.addEventListener("blur",()=>V(!1)),m.addEventListener("keydown",O=>{O.key==="Enter"&&(O.preventDefault(),V(!1)),O.key==="Escape"&&(O.preventDefault(),V(!0))}),document.documentElement.appendChild(m),we=m,m.focus(),m.select()}a(On,"openDirectEditInput");function cl(){document.__urpppDirectEditBound||(document.__urpppDirectEditBound=!0,document.addEventListener("click",t=>{let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),On(e))},!0),document.addEventListener("keydown",t=>{if(!["Enter"," "].includes(t.key))return;let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),On(e))},!0))}a(cl,"bindDirectEditInteraction");function dl(t){let e=t&&t.querySelectorAll?t:document;e.querySelectorAll(".urppp-direct-editable").forEach(r=>{let o=r.getAttribute("data-urppp-direct-tabindex");r.classList.remove("urppp-direct-editable"),r.removeAttribute("data-urppp-direct-tabindex"),o==="__none__"?r.removeAttribute("tabindex"):o!=null&&r.setAttribute("tabindex",o),r.__urpppDirectTitle==null?r.removeAttribute("title"):r.setAttribute("title",r.__urpppDirectTitle),r.__urpppDirectAriaLabel==null?r.removeAttribute("aria-label"):r.setAttribute("aria-label",r.__urpppDirectAriaLabel),delete r.__urpppDirectTitle,delete r.__urpppDirectAriaLabel}),e.querySelectorAll(".urppp-private-text").forEach(r=>{r.classList.remove("urppp-private-text"),r.removeAttribute("data-urppp-private-mask"),r.style.removeProperty("--urppp-private-font-size")}),e.querySelectorAll(".urppp-private-avatar").forEach(r=>r.classList.remove("urppp-private-avatar")),e.querySelectorAll(".urppp-private-avatar-host").forEach(r=>{r.classList.remove("urppp-private-avatar-host"),r.removeAttribute("data-urppp-private-mask"),["--urppp-avatar-left","--urppp-avatar-top","--urppp-avatar-width","--urppp-avatar-height","--urppp-avatar-radius"].forEach(o=>r.style.removeProperty(o))}),e.querySelectorAll(".urppp-private-avatar-block").forEach(r=>{r.classList.remove("urppp-private-avatar-block"),r.removeAttribute("data-urppp-private-mask")}),e.querySelectorAll(".urppp-private-block").forEach(r=>{r.classList.remove("urppp-private-block"),r.removeAttribute("data-urppp-private-mask")})}a(dl,"clearPrivacyDisplay");function Hn(t,e,r){if(!t||t.matches?.("input,select,textarea,button")||t.querySelector?.("input,select,textarea,button"))return;if(t.__urpppOriginalText==null){if(!e)return;t.__urpppOriginalText=t.textContent||""}let o=e&&r?r:t.__urpppOriginalText;t.textContent!==o&&(t.textContent=o)}a(Hn,"applyCustomText");function ul(t){let e=t&&t.querySelectorAll?t:document,r=je(),i=e.querySelector?.(".urppp-user-name-value")||(r.nameEnabled?Dn(e):null);Hn(i,r.nameEnabled,r.name),e.querySelectorAll(".profile-info-row").forEach(b=>{let m=b.querySelector(".profile-info-name"),_=b.querySelector(".profile-info-value");!m||!_||String(m.textContent||"").replace(/[\s:：]/g,"")!=="姓名"||Hn(_,r.nameEnabled,r.name)});let s=sr(r.avatar),l=r.avatarEnabled&&!!s;e.querySelectorAll("#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img").forEach(b=>{let m=b.getAttribute("src")||"";m&&m!==b.__urpppAppliedCustomSrc&&(b.__urpppOriginalSrc=m),l?(b.__urpppOriginalSrc==null&&(b.__urpppOriginalSrc=m),m!==s&&b.setAttribute("src",s),b.__urpppAppliedCustomSrc=s):b.__urpppAppliedCustomSrc!=null&&(b.__urpppOriginalSrc&&b.setAttribute("src",b.__urpppOriginalSrc),delete b.__urpppAppliedCustomSrc)})}a(ul,"applyCustomIdentityDisplay");function ml(t,e){t.querySelectorAll(".profile-info-row").forEach(r=>{let o=r.querySelector(".profile-info-name, th, label"),i=r.querySelector(".profile-info-value, td:last-child");if(!o||!i||o===i)return;let s=ta(o.textContent),l=Me(e,s);l&&xr(i,l)})}a(ml,"applyProfilePrivacy");function bl(t,e){t.querySelectorAll("table").forEach(r=>{let o=Array.from(r.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td"));if(!o.length)return;let i=o.map(s=>{let l=ta(s.textContent);return["grade","gpa","credit"].includes(l)?l:""});i.some(Boolean)&&r.querySelectorAll("tbody tr").forEach(s=>{let l=s.querySelectorAll("td");i.forEach((b,m)=>{let _=Me(e,b);b&&_&&xr(l[m],_)})})})}a(bl,"applyScoreTablePrivacy");function hl(t){let e=t&&t.querySelectorAll?t:document,r=Ee();if(r.mode==="off")return;let o=Me(r,"name"),i=Me(r,"avatar"),s=Me(r,"schedule"),l=o?Dn(e):e.querySelector?.(".urppp-user-name-value");o&&xr(l,o),[["#courseNum, #coursePas, #xy_kcms","other"],["#gpa","gpa"],["#bottom","organization"]].forEach(([_,M])=>{let N=Me(r,M);N&&e.querySelectorAll(_).forEach(z=>xr(z,N))}),bl(e,r);let m=r.mode==="custom"&&r.directEdit.enabled;if(e.querySelectorAll("[data-urppp-private]").forEach(_=>{let M=_.getAttribute("data-urppp-private"),N=_.getAttribute("data-urppp-edit-key"),D=(m&&N?String(r.directEdit.values[N]||"").trim():"")||Me(r,M);!["avatar","schedule"].includes(M)&&D&&xr(_,D),m&&N&&ll(_,N)}),m&&cl(),ml(e,r),i&&(e.querySelectorAll('[data-urppp-private="avatar"]').forEach(_=>{let M=_.matches("img")?_:_.querySelector("img");M?jn(M,i):(_.classList.add("urppp-private-avatar-block"),_.setAttribute("data-urppp-private-mask",i))}),e.querySelectorAll("#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img").forEach(_=>jn(_,i))),s){let _=Array.from(e.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));_.filter(M=>!_.some(N=>N!==M&&N.contains(M))).forEach(M=>sl(M,s))}}a(hl,"applyPrivacyDisplay");let oo=0,me=[];function Rn(){let t=Ee(),e=je();return t.mode!=="off"||e.nameEnabled||e.avatarEnabled}a(Rn,"personalDisplayIsEnabled");function fl(){me=me.filter(({root:t})=>t&&t.isConnected),me.forEach(({root:t,observer:e})=>e.observe(t,{childList:!0,subtree:!0}))}a(fl,"resumePersonalDisplayObservers");function Qt(t){let e=t||document;me.forEach(({observer:r})=>r.disconnect());try{Fn()}catch{}try{dl(e)}catch{}try{ul(e)}catch(r){console.warn("[URP++] custom identity",r)}try{hl(e)}catch(r){console.warn("[URP++] privacy",r)}Rn()?(fl(),xl()):(clearTimeout(oo),me=[])}a(Qt,"applyPersonalDisplay");function gl(t){clearTimeout(oo),oo=setTimeout(()=>Qt(t||document),140)}a(gl,"schedulePersonalDisplay");function no(){try{nt&&nt.open&&rr()}catch{}}a(no,"refreshCleanPersonalDisplay");function xl(){if(!Rn()){me.forEach(({observer:t})=>t.disconnect()),me=[];return}[document.getElementById("navbar"),document.getElementById("page-content-template"),document.getElementById("urppp-clean-root")].filter(Boolean).forEach(t=>{if(me.some(r=>r.root===t))return;let e=new MutationObserver(()=>gl(document));me.push({root:t,observer:e}),e.observe(t,{childList:!0,subtree:!0})})}a(xl,"bindPersonalDisplayObservers");function yl(t){let e=Object.assign({},t||{}),r=je();r.nameEnabled&&r.name&&(e.name=r.name);let o=sr(r.avatar);return r.avatarEnabled&&o&&(e.avatar=o),e}a(yl,"personalizedProfile");let Un="/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback",vl="/student/courseSelect/thisSemesterCurriculum/callback",wl="/student/courseSelect/thisSemesterCurriculum/index";async function kl(){let t=document.querySelector("#planCode, #zxjxjhh");if(t&&t.value&&t.value!=="no")return String(t.value);try{let e=new URLSearchParams(location.search),r=e.get("planCode")||e.get("zxjxjhh");if(r)return r}catch{}if(nt&&nt.schedule&&nt.schedule.exportData){let e=nt.schedule.exportData.semester&&nt.schedule.exportData.semester.planCode;if(e)return e}if(/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname))try{let e=await Yt(vl),r=JSON.parse(e),o=ir(r);if(o)return o}catch{}return""}a(kl,"resolveSchedulePlanCode");async function Wn(t){let e=await kl(),r=e?{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}:null,o=await Yt(Un,r),i;try{i=JSON.parse(o)}catch{throw new Error("课表接口返回了非 JSON 内容，请刷新教务页面后重试")}e||(e=ir(i)),(!i.jcsjbs||!i.jcsjbs.length)&&e&&(i=JSON.parse(await Yt(Un,{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})));let s=Vn(i,e,t);if(!s.courses.length)throw new Error("没有读取到可导出的课表数据");return s}a(Wn,"loadScheduleExportData");function po(t){return String(t||"学生课表").replace(/[\\/:*?"<>|]+/g,"-").replace(/\s+/g,"").slice(0,80)||"学生课表"}a(po,"safeScheduleFilename");function io(t,e){let r=URL.createObjectURL(t),o=document.createElement("a");o.href=r,o.download=e,o.style.display="none",document.body.appendChild(o),o.click(),o.remove(),setTimeout(()=>URL.revokeObjectURL(r),1200)}a(io,"downloadBlob");function Al(t){let e=sa(t),r=Br(),o=r.enabled?ca(e,r.mapping):la(e),i=JSON.stringify(o,null,2)+`
`;return io(new Blob([i],{type:"application/json;charset=utf-8"}),po(t.semester.label)+".json"),Object.assign({customFormat:r.enabled},e.stats)}a(Al,"exportScheduleJson");function Gn(t){let r=(Array.from(document.querySelectorAll(".span_bbzx")).map(l=>l.textContent||"").join(" ")+" "+(document.querySelector("#navbar")?.textContent||"")).replace(/\s+/g," ").match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);if(!r)return"";let o=r[3]==="秋"?"1":"2";if(t&&!String(t).startsWith(r[1]+"-"+r[2]+"-"+o))return"";let i=Number(r[4]);if(i<1||i>30)return"";let s=_o(new Date);return s.setDate(s.getDate()-(i-1)*7),Lr(s)}a(Gn,"deriveCurrentSemesterMonday");function Vn(t,e,r){let o=e||ir(t),i=Gn(o)||Ea()[o]||"";return Fp(t,o,r,{firstMonday:i})}a(Vn,"normalizeScheduleDataForPage");function Sl(t){let e=t.semester.planCode,r=Ea()[e],o=Gn(e);return o?(Do(e,o),Promise.resolve(o)):pr(r)?Promise.resolve(r):new Promise((i,s)=>{document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();let l=document.createElement("div");l.className="urppp-dialog-mask",l.dataset.dialog="schedule-date",l.innerHTML=`<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${at(t.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${at(r||Mp(e))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`,document.documentElement.appendChild(l);let b=a((m,_)=>{l.remove(),m?s(m):i(_)},"close");l.querySelector('[data-action="cancel"]').addEventListener("click",()=>b(new Error("已取消导出"))),l.querySelector('[data-action="ok"]').addEventListener("click",()=>{let m=l.querySelector("input").value;pr(m)&&(Do(e,m),b(null,m))}),l.addEventListener("click",m=>{m.target===l&&b(new Error("已取消导出"))})})}a(Sl,"requestScheduleFirstMonday");async function _l(t){let e=await Sl(t),r=Ip(t,e);return io(new Blob([r],{type:"text/calendar;charset=utf-8"}),po(t.semester.label)+".ics"),Np(t)}a(_l,"exportScheduleIcs");let El={apple:"类 Apple",flat:"极简扁平",organic:"自然有机",brutal:"新野兽派",editorial:"编辑杂志",neu:"新拟物"};function be(t,e,r){if(typeof document>"u")return Vt(e)||"#000000";let o=document.createElement("span");o.style.cssText="position:fixed;left:-9999px;visibility:hidden;color:var("+t+","+e+")",(document.body||document.documentElement).appendChild(o);let i=getComputedStyle(o).color;o.remove();let s=String(i||"").match(/[\d.]+/g)?.map(Number)||[];if(s.length>=3){let l=_r(s[0],s[1],s[2]),b=s.length>3?Math.max(0,Math.min(1,s[3])):1;return b<1?Ft(r||e,l,b):l}return Vt(i)||Vt(e)||"#000000"}a(be,"resolvedScheduleImageColor");function Jn(){let t=Jt(),e=te(),r=t==="dark",o=r?{bg:"#000000",surface:"#1C1C1E",input:"#2C2C2E",text:"#F5F5F7",secondary:"#A1A1A6",muted:"#8E8E93",border:"#38383A",primary:"#0A84FF"}:{bg:"#F5F5F7",surface:"#FFFFFF",input:"#F5F5F7",text:"#1D1D1F",secondary:"#6E6E73",muted:"#86868B",border:"#D2D2D7",primary:"#0071E3"},i={bg:be("--bg",o.bg),surface:be(e==="neu"?"--neu-base":"--surface",o.surface),input:be("--input-bg",o.input),text:be("--text",o.text),secondary:be("--text-secondary",o.secondary),muted:be("--text-muted",o.muted),border:be("--border",o.border,be(e==="neu"?"--neu-base":"--surface",o.surface)),primary:be("--primary",o.primary)},s={apple:{frameRadius:24,headerRadius:13,gridRadius:10,cardRadius:12,frameStroke:1,cardStroke:1,shadow:"soft"},flat:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:2,cardStroke:2,shadow:"none"},organic:{frameRadius:30,headerRadius:18,gridRadius:14,cardRadius:18,frameStroke:1,cardStroke:1,shadow:"warm"},brutal:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:3,cardStroke:3,shadow:"hard"},editorial:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:1,cardStroke:1,shadow:"none",serif:!0},neu:{frameRadius:22,headerRadius:14,gridRadius:10,cardRadius:14,frameStroke:0,cardStroke:0,shadow:"neu"}};return{id:t,skin:e,dark:r,label:(El[e]||e)+" · "+(Pt[t]&&Pt[t].name||t),colors:i,shape:s[e]||s.apple}}a(Jn,"currentScheduleImageTheme");function Yn(t,e){return Vp(t,e||Jn())}a(Yn,"buildScheduleSvg");function Cl(t){return new Promise((e,r)=>{let o=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"}),i=URL.createObjectURL(o),s=new Image;s.onload=()=>{try{let b=Math.min(2,Math.sqrt(15e6/(t.width*t.height))),m=document.createElement("canvas");m.width=Math.floor(t.width*b),m.height=Math.floor(t.height*b);let _=m.getContext("2d");_.scale(m.width/t.width,m.height/t.height),_.fillStyle=t.background||"#F8FAFC",_.fillRect(0,0,t.width,t.height),_.drawImage(s,0,0,t.width,t.height),m.toBlob(M=>M?e(M):r(new Error("无法生成课表图片")),"image/png")}catch(l){r(l)}finally{URL.revokeObjectURL(i)}},s.onerror=()=>{URL.revokeObjectURL(i),r(new Error("课表图片渲染失败"))},s.src=i})}a(Cl,"svgToPngBlob");async function Pl(t){let e=await Cl(Yn(t));io(e,po(t.semester.label)+".png")}a(Pl,"exportSchedulePng");function so(t,e){document.getElementById("urppp-feature-toast")?.remove();let r=document.createElement("div");r.id="urppp-feature-toast",r.textContent=String(t||""),r.className=e?"error":"",document.documentElement.appendChild(r),requestAnimationFrame(()=>r.classList.add("open")),setTimeout(()=>{r.classList.remove("open"),setTimeout(()=>r.remove(),220)},e?4200:2400)}a(so,"showFeatureToast");let lo=Jp({document,window,ensureStyles:ol,loadData:Wn,exportJson:Al,exportIcs:_l,exportPng:Pl,showToast:so,nativePageUrl:wl,navigate:a(t=>{location.href=t},"navigate"),logger:console});function zl(t,e,r,o){return lo.run(t,e,r,o)}a(zl,"runScheduleExport");function Ll(t){return lo.createMenu(t)}a(Ll,"createScheduleExportMenu");function ql(t){if(t){try{t.stage.remove()}catch{}try{document.getElementById("urppp-pdf-reset-style")?.remove()}catch{}}}a(ql,"disposeNativePdfCapture");function Tl(){window.__urpppPdfDiagnose||(window.__urpppPdfDiagnose=async()=>{let t={time:new Date().toISOString()},e=document.getElementById("mycoursetable"),r=document.getElementById("page-content-template");t.host=!!e,t.pageSource=!!r,t.hostCards=e?e.querySelectorAll("div.class_div").length:-1,t.hostHasCourseTable=e?!!e.querySelector("#courseTable"):!1,t.hostHasCourseTableBody=e?!!e.querySelector("#courseTableBody"):!1,t.hostTableId=e&&e.querySelector("table")?e.querySelector("table").id:"none";try{let i=bi(e);t.stage="ok",t.stageCards=i.target.querySelectorAll(".urppp-pdf-card").length,t.stageTableId=i.target.querySelector("table")?i.target.querySelector("table").id:"none",ql(i)}catch(i){t.stage="failed",t.stageError=i&&i.message||String(i)}let o=typeof unsafeWindow<"u"?unsafeWindow:window;return t.deps={dollar:typeof o.$,loadFileList:typeof(o.Import&&o.Import.LoadFileList),back:typeof o.back,html2canvas:typeof o.html2canvas,originalDivBuild:typeof o.__urpppOriginalDivBuild},t})}a(Tl,"bindNativePdfDiagnose");function Ml(t){return t?(Tl(),async()=>{let e=document.getElementById("urppp-settings-panel"),r=document.getElementById("urppp-settings-mask");e&&e.classList.contains("open")&&e.classList.remove("open"),r&&r.classList.contains("open")&&r.classList.remove("open");try{await gi(t,{document,page:typeof unsafeWindow<"u"?unsafeWindow:window,onAfterRestore:br})}catch(o){console.warn("[URP++] isolated native PDF export failed",o),so("原生 PDF 隔离导出失败："+(o&&o.message||String(o))+"，请重试",!0)}}):null}a(Ml,"pagePdfExportHandler");function co(t=location){return/\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(t.pathname)}a(co,"isPersonalSchedulePage");function $l(t=location){return/\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(t.pathname)}a($l,"isScoreQueryPage");function uo(){if(!co())return;let t=document.querySelector("#h4_id1")?.closest("h4")||document.querySelector("h4.header"),e=t?.querySelector(".right_top_oper")||document.querySelector("#mainDIV .right_top_oper, .page-content .right_top_oper"),r=Array.from((e||document).querySelectorAll("button, a")),o=a(l=>[l.textContent,l.getAttribute("title"),l.getAttribute("onclick")].filter(Boolean).join(" ").replace(/\s+/g," "),"signatureOf");if(r.forEach(l=>{/打印.*课表|\bdy\s*\(/i.test(o(l))&&l.setAttribute("data-urppp-native-print-source","1")}),document.getElementById("urppp-native-schedule-export"))return;let i=r.find(l=>/导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(o(l))),s=Ll({source:"native",pdfHandler:Ml(i)});if(s.id="urppp-native-schedule-export",i&&i.parentElement){i.__urpppNativeExportState||(i.__urpppNativeExportState={display:i.style.getPropertyValue("display"),displayPriority:i.style.getPropertyPriority("display"),ariaHidden:i.getAttribute("aria-hidden"),tabIndex:i.getAttribute("tabindex")}),i.setAttribute("data-urppp-native-export-source","1"),i.style.setProperty("display","none","important"),i.setAttribute("aria-hidden","true"),i.setAttribute("tabindex","-1"),i.parentElement.insertBefore(s,i.nextSibling);return}if(e)e.appendChild(s);else if(t)t.appendChild(s);else{let l=document.getElementById("page-content-template")||document.querySelector(".page-content");if(l){let b=document.createElement("div");b.className="urppp-export-fallback",b.appendChild(s),l.prepend(b)}}}a(uo,"patchNativeScheduleExport");let Xe=null,ra=0;function mo(){clearTimeout(ra),ra=0,Xe&&Xe.observer.disconnect(),Xe=null}a(mo,"disconnectNativeScheduleExportObserver");function Il(){if(!co()){mo();return}let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;if(!t||Xe&&Xe.root===t&&t.isConnected)return;mo();let e=new MutationObserver(()=>{clearTimeout(ra),ra=setTimeout(()=>uo(),80)});e.observe(t,{childList:!0,subtree:!0}),Xe={root:t,observer:e}}a(Il,"bindNativeScheduleExportObserver");function Qn(t,e,r){r===null?t.removeAttribute(e):t.setAttribute(e,r)}a(Qn,"restoreOptionalAttribute");function Nl(t=document){let e=t&&t.querySelectorAll?t:document,r=e.matches?.("#urppp-native-schedule-export")?e:e.querySelector("#urppp-native-schedule-export");if(r){let o=r.closest(".urppp-export-fallback");r.remove(),o&&!o.children.length&&o.remove()}e.querySelectorAll("[data-urppp-native-export-source]").forEach(o=>{let i=o.__urpppNativeExportState;i&&(i.display?o.style.setProperty("display",i.display,i.displayPriority):o.style.removeProperty("display"),Qn(o,"aria-hidden",i.ariaHidden),Qn(o,"tabindex",i.tabIndex)),o.removeAttribute("data-urppp-native-export-source");try{delete o.__urpppNativeExportState}catch{}}),e.querySelectorAll("[data-urppp-native-print-source]").forEach(o=>{o.removeAttribute("data-urppp-native-print-source")})}a(Nl,"removeNativeScheduleExport");let Xn=Ki({deps:{styles:Ci,loadScores:dp,loadProfile:Kn,scoreToNumber:Qe,scoreToGpa:Ye,getInsertHost:a(()=>document.querySelector(".page-content")||document.getElementById("page-content-template")||null,"getInsertHost"),shouldAutoExpand:a(()=>{let t=/[?&]urppp=sa(?:&|$)/.test(window.location.search);if(t)try{history.replaceState(null,"",window.location.pathname+window.location.hash)}catch{}return t},"shouldAutoExpand")}}),Bl=kp([pa({id:"schedule-export",matches:a(t=>co(t.location),"matches"),mount:a(()=>{uo(),Il()},"mount"),unmount:a(t=>{mo(),Nl(t?.lifecycleKey)},"unmount")}),pa({id:"score-analysis",matches:a(t=>$l(t.location),"matches"),mount:a(()=>{try{Xn.mount()}catch(t){console.warn("[URP++] score analysis mount",t)}},"mount"),unmount:a(()=>{try{Xn.unmount()}catch{}},"unmount")})]);function aa(){let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;return Bl.refresh({document,location,window,lifecycleKey:t})}a(aa,"refreshRouteFeatures");function Fl(t){lo.bindHosts(t)}a(Fl,"bindScheduleExportHosts");function yr(t){return String(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").replace(/^[\s:：]+|[\s:：]+$/g,"").trim()}a(yr,"normalizeProfileValue");function oa(t,e){if(!t||!t.querySelectorAll)return"";let r=(e||[]).map(i=>yr(i).replace(/[：:]/g,"")),o=t.querySelectorAll(".profile-info-row, tr");for(let i=0;i<o.length;i++){let s=o[i],l=s.querySelector(".profile-info-name, th, label"),b=s.querySelector(".profile-info-value, td:last-child");if(!l||!b||l===b)continue;let m=yr(l.textContent).replace(/[：:]/g,"");if(!r.some(M=>m===M||m.endsWith(M)))continue;let _=yr(b.textContent);if(_&&_!=="—"&&_!=="-")return _}return""}a(oa,"readLabeledProfileValue");function Ke(t){return yr(t).replace(/^主修为\s*/,"").replace(/培养方案概况.*$/,"").replace(/…+/g,"").split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0].trim()}a(Ke,"cleanMajorPlanName");function Dl(t){let e={majorPlan:"",majorGpa:""};return!t||!t.querySelectorAll||t.querySelectorAll(".infobox, .widget-box, .urppp-stat-card").forEach(r=>{let o=(r.innerText||r.textContent||"").trim(),i=yr(o);if(/主修必修GPA/.test(i)){let s=i.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)||i.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);if(s){let l=Number(s[1]),b=Number(e.majorGpa);Number.isFinite(l)&&l>=0&&l<=5&&(!e.majorGpa||b===0||l>0)&&(e.majorGpa=s[1])}}if(/主修为|培养方案/.test(i)){let s=i.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)||i.match(/^(.{2,60}?)\s*主修为/)||i.match(/主修为\s*(.{2,60})$/),l=Ke(s&&s[1]);if(l&&!/GPA|已修读|尚不及格|本学期/.test(l)){let b=/培养方案|教学计划/.test(l);(!e.majorPlan||b)&&(e.majorPlan=l)}}}),e}a(Dl,"extractAcademicOverview");async function Kn(){let t={name:"",avatar:"",majorPlan:"",majorGpa:"",studentId:""};try{let r=document.querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(r){let s=r.querySelector(".urppp-user-name-value"),l=s&&s.__urpppOriginalText;l&&(t.name=String(l).trim());let b=(r.innerText||r.textContent||"").replace(/\s+/g," ").trim(),m=t.name?null:b.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);if(!t.name&&!m){let _=r.cloneNode(!0);_.querySelectorAll("small, i, img, b, .badge").forEach(N=>N.remove());let M=(_.textContent||"").replace(/\s+/g," ").trim();M=M.replace(/^欢迎您[，,]\s*/g,"").replace(/\d{8,}/g,"").trim(),m=M.match(/([\u4e00-\u9fa5·]{2,12})/)}m&&m[1]&&!/欢迎|同学|首页|反馈|密码|注销/.test(m[1])&&(t.name=m[1])}let o=document.querySelector("#navbar img.nav-user-photo, .ace-nav img.nav-user-photo");o&&(t.avatar=o.__urpppOriginalSrc||o.src||o.getAttribute("src")||"");let i=Dl(document);t.majorPlan=i.majorPlan,t.majorGpa=i.majorGpa}catch{}try{let r=await Yt("/student/rollManagement/rollInfo/index"),o=Zr(r),i=o.body&&(o.body.innerText||o.body.textContent)||"";if(!t.name&&(t.name=oa(o,["姓名"]),!t.name)){let m=i.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);m&&(t.name=m[1].trim())}let s=oa(o,["主修方案名称"]),l=oa(o,["专业"]);if(t.studentId=oa(o,["学号"]),t.studentId&&/^\d{6,20}$/.test(String(t.studentId)))try{GM_setValue("urppp_downs_sid",String(t.studentId))}catch{}s?t.majorPlan=Ke(s):!t.majorPlan&&l&&(t.majorPlan=Ke(l));let b=o.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');if(b&&b.getAttribute("src")&&!t.avatar){let m=b.getAttribute("src");t.avatar=/^https?:/i.test(m)?m:ao(m)}}catch{}let e=Number(t.majorGpa);return t.name||(t.name="同学"),t.majorPlan||(t.majorPlan="主修方案"),(!Number.isFinite(e)||e<=0||e>5)&&(t.majorGpa="—"),t}a(Kn,"loadProfile");let Zn=["周日","周一","周二","周三","周四","周五","周六"];function bo(t){let e=[],r=t.querySelector("#courseTableBody")||t.querySelector("#courseTable tbody");if(!r)return e;r.querySelectorAll("td[id]").forEach(i=>{let s=String(i.id||"").match(/^(\d+)_(\d+)$/);if(!s)return;let l=parseInt(s[1],10),b=parseInt(s[2],10),m=l===7?0:l,_=i.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]'),M=_.length?_:[];if(!M.length&&(i.textContent||"").trim()){let N=(i.textContent||"").replace(/\s+/g," ").trim();N&&e.push({name:N.slice(0,40),teacher:"",place:"",week:"",day:m,section:b});return}M.forEach(N=>{let z=Array.from(N.querySelectorAll("p")).map(K=>(K.textContent||"").trim()).filter(Boolean),D=(N.querySelector(".p-kcm-1, .p-kcm")||{}).textContent||z[0]||"",V=(N.querySelector('.p-jxl-1, [class*="jxl"]')||{}).textContent||"",O=z.find((K,ut)=>ut>0&&!/周|节/.test(K)&&K!==V)||"",R=z.find(K=>/周/.test(K))||"",F=String(D).replace(/_\d+\s*$/,"").trim();!F||F.length<2||e.push({name:F,teacher:String(O).trim(),place:String(V||"").trim(),week:String(R).trim(),day:m,section:b})})});let o=new Set;return e.filter(i=>{let s=[i.day,i.section,i.name,i.place].join("|");return o.has(s)?!1:(o.add(s),!0)})}a(bo,"parseScheduleFromDoc");let tp="urppp_term_week_v1";function Ze(t){let e=Number(t)||0;if(e<1||e>30)return 0;nt._termWeek=e,nt._termWeekResolved=!0;try{GM_setValue(tp,e)}catch{}return e}a(Ze,"rememberTermWeek");function vr(){if(nt&&nt._termWeek>=1)return nt._termWeekResolved=!0,nt._termWeek;try{let t=Number(GM_getValue(tp,0))||0;if(t>=1&&t<=30)return Ze(t)}catch{}return 0}a(vr,"readRememberedTermWeek");function wr(t){let e=String(t||"").replace(/\s+/g," ");if(!e)return 0;let r=[/(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,/20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,/(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,/第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/];for(let o=0;o<r.length;o++){let i=e.match(r[o]);if(i){let s=parseInt(i[1],10);if(s>=1&&s<=30)return s}}return 0}a(wr,"extractTermWeekFromText");function $e(){if(nt._termWeekResolved&&nt._termWeek>=1&&nt._termWeek<=30)return nt._termWeek;try{let t=[document.querySelector("#navbar"),document.querySelector(".navbar-fixed-top"),document.querySelector(".navbar"),document.querySelector("#navbar .navbar-header"),document.querySelector("#navbar .navbar-buttons"),document.querySelector(".ace-nav"),document.querySelector("#breadcrumbs"),document.querySelector("#page-content-header"),document.querySelector(".page-header"),document.querySelector("header")].filter(Boolean);for(let l=0;l<t.length;l++){let b=t[l],m=wr(b.innerText||b.textContent||"")||wr(b.innerHTML||"");if(m)return Ze(m)}let e=document.documentElement&&document.documentElement.innerHTML||"",r=wr(e);if(r)return Ze(r);let o=document.body&&document.body.innerText||"",i=wr(o);if(i)return Ze(i);let s=vr();if(s)return s}catch{}return 0}a($e,"getCurrentWeekNumber");let tr=null;function jl(){let t=new Date,e=a(r=>String(r).padStart(2,"0"),"p");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}a(jl,"calTodayStr");function Ol(t,e){let r=new Date(`${t}T00:00:00`);r.setDate(r.getDate()+e);let o=a(i=>String(i).padStart(2,"0"),"p");return`${r.getFullYear()}-${o(r.getMonth()+1)}-${o(r.getDate())}`}a(Ol,"calAddDays");function kr(t){if(tr)return tr;let e=t||jl();return e>="2027-02-06"&&e<=Ol("2027-02-06",6)?"springfestival":e>="2027-01-18"&&e<"2027-03-01"?"winter":e>="2027-07-04"&&e<"2027-08-31"||e>="2026-07-04"&&e<"2026-08-31"?"summer":"term"}a(kr,"calVacation");function Hl(){let t='<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';return`<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${t}</div><div class="ufd ufd-right">${t}</div></div>`}a(Hl,"festiveDecorHtml");function ep(){let t=typeof document<"u"?document:null;if(!t)return;let e=kr()==="springfestival",r=t.getElementById("urppp-festive-decor");e&&!r?t.documentElement.insertAdjacentHTML("beforeend",Hl()):!e&&r&&r.remove()}a(ep,"syncFestiveDecor");function rp(t){tr=t==="summer"||t==="winter"||t==="springfestival"||t==="term"?t:null,tr&&tr!=="term"&&(nt.weekLocked=!1,nt.viewWeek=0);try{ep()}catch{}try{typeof rr=="function"&&rr()}catch{}return tr}a(rp,"setCalendarPhase");function Rl(){return kr()}a(Rl,"getCalendarPhase");function ap(){if(kr()!=="term")return nt.weekLocked?(!nt.viewWeek||nt.viewWeek<0)&&(nt.viewWeek=0):nt.viewWeek=0,nt.viewWeek;let t=$e()||vr()||0;return nt.weekLocked?(!nt.viewWeek||nt.viewWeek<1)&&(nt.viewWeek=t>=1?t:1):t>=1?nt.viewWeek=t:(!nt.viewWeek||nt.viewWeek<1)&&(nt.viewWeek=1),!nt.weekLocked&&t>1&&nt.viewWeek===1&&(nt.viewWeek=t),nt.viewWeek}a(ap,"getViewWeekNumber");async function Ul(){let t=$e();if(t>=1)return t;try{let e=await Yt("/index");if(t=wr(e),t)return Ze(t)}catch{}try{let e=new Date,r=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0"),o="xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(r),i=await Yt("/student/teachingResources/classroomUseStatus/jasInfo",{method:"POST",data:o,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),s=JSON.parse(i),l=Number(s&&s.jxzc);if(l>=1&&l<=30)return Ze(l)}catch{}return vr()||0}a(Ul,"ensureTermWeekResolved");function Wl(t){let e=$e()||20;return(t||[]).forEach(r=>{let o=String(r.classWeek||"");o.length>e&&(e=o.length);let i=String(r.week||"").match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);i&&(e=Math.max(e,parseInt(i[2],10)||0));let s=String(r.week||"").match(/\d{1,2}/g);s&&s.forEach(l=>{e=Math.max(e,parseInt(l,10)||0)})}),Math.min(Math.max(e,1),30)}a(Wl,"inferMaxWeek");function op(t,e){if(!e||!t)return!1;let r=String(t);return r.length>=e?r.charAt(e-1)==="1":!1}a(op,"weekBitActive");let np=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];function pp(t){let e=0,r=String(t||"");for(let o=0;o<r.length;o++)e=e*31+r.charCodeAt(o)>>>0;return np[e%np.length]}a(pp,"courseColor");function Gl(t){let e=[],r=$e();(t&&t.xkxx||[]).forEach(s=>{Object.keys(s||{}).forEach(l=>{let b=s[l];if(!b)return;let m=b.courseName||b.englishCourseName||l,_=b.attendClassTeacher||"";(b.timeAndPlaceList||[]).forEach(N=>{let z=Number(N.classDay)||0,D=z===7?0:z,V=Number(N.classSessions)||1,O=Math.max(1,Number(N.continuingSession)||1),R=[N.campusName,N.teachingBuildingName,N.classroomName].filter(Boolean).join(""),F=N.weekDescription||b.skzcs||"",K=op(N.classWeek,r)||r&&F.indexOf(String(r))>=0;e.push({name:String(m).trim(),teacher:String(_).trim(),place:String(R).trim(),week:String(F).trim(),classWeek:String(N.classWeek||""),day:D,section:V,span:O,thisWeek:!!K,color:pp(m)})})})});let i=new Set;return e.filter(s=>{let l=[s.day,s.section,s.span,s.name,s.place,s.week].join("|");return i.has(l)?!1:(i.add(l),!0)})}a(Gl,"parseScheduleFromJson");async function Vl(){try{let t=await Yt("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),e=[],r=null;try{r=JSON.parse(t);let i=Number(r&&(r.jxzc||r.zc||r.currentWeek));i>=1&&i<=30&&(nt._termWeek=Math.max(nt._termWeek||0,i),nt.weekLocked||(nt.viewWeek=nt._termWeek)),e=Gl(r)}catch{e=bo(Zr(t))}e.length||(e=bo(document));let o=r?Vn(r,ir(r),"clean"):null;return{courses:e,exportData:o,rawOk:e.length>0,error:e.length?"":"课表 JSON 无 timeAndPlaceList"}}catch(t){try{let e=bo(document);if(e.length)return{courses:e,rawOk:!0,error:""}}catch{}return{courses:[],rawOk:!1,error:String(t&&t.message||t)}}}a(Vl,"loadSchedule");function Jl(t,e){let r=String(t||""),o=new RegExp(`url\\s*=\\s*["']([^"']*`+e+`[^"']*)["']`,"i"),i=r.match(o);if(i&&i[1])return i[1];let s=new RegExp(`(\\/student\\/integratedQuery\\/scoreQuery\\/[^"'\\s]+`+e+")","i"),l=r.match(s);return l?l[1]:""}a(Jl,"extractScoreCallback");function Yl(t){let e=[];return(t&&t.lnList||[]).forEach(o=>{let i=o.cjlx||o.cjbh||o.famc||o.zxjxjhh||"成绩",s=[];(o.cjList||[]).forEach(l=>{let b=l.courseName||l.englishCourseName||"";if(!b)return;let m=l.cj!=null&&l.cj!==""?String(l.cj):"";!m&&l.courseScore!=null&&(m=String(l.courseScore)),!m&&l.gradeName&&(m=String(l.gradeName)),!m&&l.zscj!=null&&(m=String(l.zscj));let _=l.courseAttributeName||l.xkcsxmc||"",M=parseFloat(l.credit)||0,N=l.id&&(l.id.courseNumber||l.id.kch_zj)||"",z=l.id&&(l.id.coureSequenceNumber||l.id.courseSequenceNumber||l.id.kxh)||l.classNo||"",D=l.gradePointScore!=null?Number(l.gradePointScore):null,V=ue(m)||ue(l.gradeName)||D!=null&&D<0,O=V?"未评估":m;s.push({code:N,seq:String(z||""),name:b,attr:_,credit:M,score:O,unevaluated:V,required:Bn(_),officialGpa:Xr(D)?D:null,evalUrl:""})}),s.length&&e.push({title:String(i).slice(0,100),courses:s,summary:oe(s),meta:{zxf:o.zxf,tgms:o.tgms,zms:o.zms,famc:o.famc}})}),e}a(Yl,"parseScoreJson");async function ip(t,e){let r=await Yt(t),o=sp(Zr(r));if(o.length)return o;let i=Jl(r,e);if(!i)return[];let s=await Yt(i);try{let l=JSON.parse(s);o=Yl(l).map(b=>(b.summary=oe(b.courses),b))}catch{o=sp(Zr(s))}return o}a(ip,"loadScoreByIndex");function sp(t){let e=[];return t.querySelectorAll("table").forEach(r=>{let o=Array.from(r.tHead&&r.tHead.rows[0]?r.tHead.rows[0].cells:r.rows[0]&&r.rows[0].cells||[]).map(M=>(M.textContent||"").replace(/\s+/g,""));if(!o.length)return;let i=o.join("|");if(!/课程名/.test(i)||!/成绩/.test(i))return;let s={code:o.findIndex(M=>M==="课程号"),name:o.findIndex(M=>M==="课程名"),attr:o.findIndex(M=>/课程属性|属性/.test(M)),credit:o.findIndex(M=>M==="学分"),score:o.findIndex(M=>M==="成绩")};if(s.name<0||s.score<0)return;let l="成绩",b=r.previousElementSibling;for(let M=0;M<8&&b;M++,b=b.previousElementSibling)if(/^H[1-4]$/.test(b.tagName)||b.classList&&b.classList.contains("header")){l=(b.textContent||"").replace(/\s+/g," ").trim();break}let m=[],_=r.tBodies.length?r.tBodies[0].rows:Array.from(r.rows).slice(1);Array.from(_).forEach(M=>{let N=Array.from(M.cells||M.querySelectorAll("td"));if(N.length<4)return;let z=a(F=>F>=0&&N[F]?(N[F].textContent||"").replace(/\s+/g," ").trim():"","get"),D=z(s.name),V=z(s.score);if(!D||!V||/课程名|序号/.test(D))return;let O=z(s.attr),R=ue(V);m.push({code:z(s.code),name:D,attr:O,credit:parseFloat(z(s.credit))||0,score:R?"未评估":V,unevaluated:R,required:Bn(O),officialGpa:null,evalUrl:""})}),m.length&&e.push({title:l.slice(0,100),courses:m,summary:oe(m)})}),e}a(sp,"parseScoreTables");function Ar(t){return Ke(t&&t.meta&&t.meta.famc||t&&t.title||"")}a(Ar,"schemePlanName");function lp(t,e){if(!t||!t.length)return 0;let r=Ke(e),o=t.findIndex(l=>{let b=Ar(l);return/培养方案/.test(b)&&!/微专业|辅修|双学位/.test(b)});if(o>=0&&(!r||Ar(t[o]).includes(r.slice(0,4)))||r&&(o=t.findIndex(l=>{let b=Ar(l);return b.includes(r.replace(/培养方案.*/,"培养方案"))||r.includes(b.slice(0,4))||b.includes(r.slice(0,4))}),o>=0))return o;let i=0,s=-1;return t.forEach((l,b)=>{if(/微专业|辅修/.test(Ar(l)))return;let m=(l.courses||[]).length;m>s&&(s=m,i=b)}),i}a(lp,"pickMajorSchemeIndex");async function Ql(){let t={};try{let e=await Yt("/student/teachingAssessment/evaluation/queryAll",{method:"POST",data:"pageNum=1&pageSize=200&flag=kt",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),r;try{r=JSON.parse(e)}catch{r=null}(r&&r.data&&r.data.records||[]).forEach(i=>{let s=String(i.KCH||"").trim();if(!s)return;let l=String(i.SFPG)==="1",b=String(i.KTID||"").trim();if(!t[s]){t[s]={ktid:b,kxh:String(i.KXH||""),kcm:i.KCM||"",done:l,pending:l?0:1,total:1,url:!l&&b?"/student/teachingEvaluation/newEvaluation/evaluation/"+b:"/student/teachingEvaluation/newEvaluation/index"};return}t[s].total+=1,l||(t[s].pending+=1,t[s].done=!1,b&&(t[s].ktid=b,t[s].url="/student/teachingEvaluation/newEvaluation/evaluation/"+b))}),Object.keys(t).forEach(i=>{let s=t[i];s.done=!(s.pending>0)})}catch(e){console.warn("[URP++] evaluation map",e)}return t}a(Ql,"loadEvaluationMap");function Xl(t){if(!t)return!1;if(t.officialGpa!=null&&Xr(t.officialGpa))return!0;let e=t.score;return e==null||e===""||ue(e)?!1:Qe(e)!=null||Ye(e)!=null?!0:!/未评估|未评教|待评估|待评教/.test(String(e))}a(Xl,"hasDisplayableScore");function Kl(t,e){if(!t||!e)return t;let r=a(o=>(o||[]).forEach(i=>{if(!i||!i.code)return;let s=e[i.code];if(s){if(Xl(i)){i.unevaluated=!1,s.done?i.evalUrl=i.evalUrl||"":i.evalUrl=s.url||"/student/teachingEvaluation/newEvaluation/index";return}s.done||(i.unevaluated=!0,i.evalUrl=s.url||"/student/teachingEvaluation/newEvaluation/index",(!i.score||i.score===""||ue(i.score))&&(i.score="未评估"))}}),"apply");return(t.passing||[]).forEach(o=>r(o.courses)),(t.schemes||[]).forEach(o=>r(o.courses)),t}a(Kl,"attachEvaluationLinks");function cp(t){return t&&(t.passing&&t.passing[0]&&(t.passing[0].summary=oe(t.passing[0].courses)),t.schemes=(t.schemes||[]).map(e=>(e.summary=oe(e.courses),e)),t)}a(cp,"refreshScoreSummaries");async function Zl(t){if(!t||t.evaluationLoading)return t;t.evaluationLoading=!0;try{let e=await Ql();return Kl(t,e),t.evalMap=e,t.evaluationReady=!0,cp(t)}finally{t.evaluationLoading=!1}}a(Zl,"enrichScoresWithEvaluation");function tc(){if(!nt.scores||!nt.scores.schemes)return;let t=nt.scores.schemes,e=nt.profile&&nt.profile.majorPlan,r=lp(t,e);nt.scores.majorIdx=r,nt._schemeUserSelected||(nt.activeSchemeIdx=r,nt._schemeInited=!0);let o=t[r];if(!o||!nt.profile)return;let i=Ar(o),s=Ke(nt.profile.majorPlan);/培养方案|教学计划/.test(i)&&(!/培养方案|教学计划/.test(s)||s==="主修方案")&&(nt.profile.majorPlan=i);let l=o.summary||{},b=Number(l.requiredCredit),m=Number(l.requiredGpa),_=Number(nt.profile.majorGpa);b>0&&Number.isFinite(m)&&m>=0&&m<=5&&(!Number.isFinite(_)||_<=0)&&(nt.profile.majorGpa=String(Te(m)))}a(tc,"reconcileProfileAndScores");let er=null;async function dp(t){return t&&(er=null),er&&!er.error||(er=await ec()),er}a(dp,"loadScores");async function ec(){let t={passing:[],schemes:[],error:"",majorIdx:0,evaluationReady:!1,evaluationLoading:!1};try{let[e,r]=await Promise.all([ip("/student/integratedQuery/scoreQuery/allPassingScores/index","allPassingScores/callback"),ip("/student/integratedQuery/scoreQuery/schemeScores/index","schemeScores/callback")]),o=[];e.forEach(i=>i.courses.forEach(s=>{o.push(Object.assign({term:i.title},s))})),t.passing=[{title:"全部及格成绩",courses:o,summary:oe(o),groups:e}],t.schemes=r,!t.schemes.length&&o.length&&(t.schemes=[{title:"方案成绩",courses:o,summary:oe(o)}]),cp(t),t.majorIdx=lp(t.schemes,nt.profile&&nt.profile.majorPlan),!o.length&&!t.schemes.length&&(t.error="成绩 callback 无数据")}catch(e){t.error=String(e&&e.message||e)}return t}a(ec,"loadScoresImpl");function Ie(t){if(!t)return[];let e=String(t).trim();if(!e)return[];e=e.replace(/^['"]|['"]$/g,"");try{return JSON.parse(e)}catch{}try{return JSON.parse(e.replace(/&quot;/g,'"').replace(/&#34;/g,'"'))}catch{}return[]}a(Ie,"parseJsonArrayLoose");function up(t,e){let r=t.indexOf(e);if(r<0)return"";let o=t.indexOf("[",r);if(o<0)return"";let i=0;for(let s=o;s<t.length&&s<o+3e5;s++){let l=t[s];if(l==="[")i++;else if(l==="]"&&(i--,i===0))return t.slice(o,s+1)}return""}a(up,"extractBalancedArray");async function rc(){let t=await Yt("/student/teachingResources/classroomUseStatus/index");if(/欢迎登录|name=["']j_username["']|loginEn/i.test(t)&&!/jxlList|teachingBuildingName|classroomUseStatus/i.test(t))throw new Error("登录已失效，请刷新页面后重试");let e=[],r=[];try{let s=(t.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i)||[])[1],l=(t.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||[])[1];if(s&&(e=Ie(s)),l&&(r=Ie(l)),!e.length){let b=t.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);b&&(e=Ie(b[1]))}if(!r.length){let b=t.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);b&&(r=Ie(b[1]))}if(!r.length){let b=up(t,"teachingBuildingName");b&&(r=Ie(b))}if(!e.length){let b=up(t,"campusName");b&&(e=Ie(b))}}catch(s){console.warn("[URP++] classroom json parse",s)}if(!r.length){let s=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}];e=s;let l=[];for(let b of s)try{let m=await Yt("/student/teachingResources/classroomCurriculum/"+b.campusNumber+"/teachingBuildingJson");Ie(m).forEach(M=>{l.push({id:{campusNumber:b.campusNumber,teachingBuildingNumber:String(M.id&&M.id.teachingBuildingNumber||M.teachingBuildingNumber||"")},teachingBuildingName:M.teachingBuildingName||M.name||""})})}catch(m){console.warn("[URP++] building json",b.campusNumber,m)}r=l}e.length||(e=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}]);let o=e.map(s=>({campus:s.campusName||s.campusNumber,campusNumber:String(s.campusNumber||s.id&&s.id.campusNumber||""),buildings:[]}));r.forEach(s=>{let l=String(s.id&&s.id.campusNumber||s.campusNumber||""),b=String(s.id&&s.id.teachingBuildingNumber||s.teachingBuildingNumber||""),m=s.teachingBuildingName||s.name||b;if(!l||!b||!m)return;let _=o.find(N=>N.campusNumber===l);_||(_={campus:l,campusNumber:l,buildings:[]},o.push(_));let M="/student/teachingResources/classroomUseStatus/"+l+"/"+b+"/"+encodeURI(encodeURI(_.campus||l))+"/"+encodeURI(encodeURI(m));_.buildings.push({name:m,path:M,campusNumber:l,buildingNumber:b})});let i=o.filter(s=>s.buildings.length);if(!i.length)throw new Error("未解析到教学楼，请刷新后重试");return i}a(rc,"loadClassroomCatalog");function Sr(t){let e=String(t&&t.occupancymoduleId||""),r={"06":"有课","07":"考试",14:"实验",room:"借用"};if(r[e])return r[e];if(t&&t.remark){let o=String(t.remark).trim();if(o)return o}return"占用"}a(Sr,"occupancyTypeLabel");function ac(t){if(t&&t.contentName)return String(t.contentName).trim();if(t&&t.remark){let e=String(t.remark).trim();if(e)return e}return Sr(t)}a(ac,"occupancyReason");async function oc(t,e,r,o){let i=new URLSearchParams({planNumber:String(t||""),campusNumber:String(e||""),teachingBuildingNumber:String(r||""),classroomNumber:String(o||"")}),s=await Yt("/student/teachingResources/classroomCurriculum/searchCurriculum/callback?"+i.toString());try{let l=JSON.parse(s);return Array.isArray(l)?l.length&&Array.isArray(l[0])?l[0]:l.filter(b=>b&&typeof b=="object"&&(b.kcm||b.id&&b.id.kch)):l&&Array.isArray(l.list)?l.list:[]}catch{return[]}}a(oc,"fetchClassroomCurriculum");function nc(t,e,r){let o=t||[],i=Number(e.xq)||0,s=Number(e.start)||0,l=Number(r)||0,b=[];return o.forEach(m=>{let _=m.id||{},M=Number(_.skxq!=null?_.skxq:m.skxq)||0,N=Number(_.skjc!=null?_.skjc:m.skjc)||0,z=Math.max(1,Number(m.cxjc)||1),D=_.skzc||m.skzc||"";i&&M&&i!==M||s&&(s<N||s>=N+z)||l&&D&&!ro(D,l)||b.push(m)}),b.length?(b.sort((m,_)=>{let M=ro(m.id&&m.id.skzc||m.skzc,l)?0:1,N=ro(_.id&&_.id.skzc||_.skzc,l)?0:1;return M-N}),b[0]):null}a(nc,"matchCurriculumCourse");async function pc(t,e,r){if(!t||!t.rooms||!t.rooms.length)return t;let o=String(e.campusNumber||""),i=String(e.buildingNumber||""),s=r||t.planNumber||"";if(!o||!i||!s)return t;let l=t.rooms.filter(z=>(z.slots||[]).some(D=>D.busy)),b={},m=a(async z=>{if(b[z])return b[z];try{b[z]=await oc(s,o,i,z)}catch{b[z]=[]}return b[z]},"queue"),_=4,M=0,N=new Array(Math.min(_,Math.max(l.length,1))).fill(0).map(async()=>{for(;M<l.length;){let z=M++,D=l[z],V=await m(D.name);(D.slots||[]).forEach(O=>{if(!O.busy)return;let R={xq:O.detail&&O.detail.xq||O.xq||0,start:O.section,week:t.jxzc};O.detail&&O.detail.xq!=null&&(R.xq=O.detail.xq);let F=nc(V,R,t.jxzc);if(F&&F.kcm){let K=String(F.kcm).trim();O.contentName=K,O.reason=K,O.displayChar=Kr(K),O.detail&&(O.detail.contentName=K,O.detail.reason=K,O.detail.teacher=F.jsm||"",O.detail.weeks=F.zcsm||"",O.detail.courseNo=F.id&&F.id.kch||"",O.detail.typeLabel=Sr({occupancymoduleId:O.module}))}else O.displayChar=Kr(O.reason||"占用"),O.detail&&(O.detail.typeLabel=Sr({occupancymoduleId:O.module}))})}});return await Promise.all(N),t}a(pc,"enrichOccupancyWithCurriculum");function ic(t){return t==="有课"?"kind-course":t==="考试"?"kind-exam":t==="实验"?"kind-lab":t==="借用"?"kind-borrow":"kind-busy"}a(ic,"occupancyKindClass");async function sc(t){let e="",r="",o="",i="";if(t&&typeof t=="object")e=String(t.campusNumber||""),r=String(t.buildingNumber||""),o=t.name||"",i=t.path||"";else{i=String(t||"");let F=i.match(/classroomUseStatus\/(\d+)\/(\d+)\//);F&&(e=F[1],r=F[2])}if(!e||!r)throw new Error("缺少校区/楼栋编号");let s=Number(t&&t.dateOffset!=null?t.dateOffset:nt.roomDateOffset)||0,l=lc(mp(new Date,s)),b="xqh="+encodeURIComponent(e)+"&jxlh="+encodeURIComponent(r)+"&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(l),m=await new Promise((F,K)=>{let ut=ao("/student/teachingResources/classroomUseStatus/jasInfo");typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest({method:"POST",url:ut,data:b,withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},onload:a(wt=>wt.status>=200&&wt.status<400?F(wt.responseText||""):K(new Error("HTTP "+wt.status)),"onload"),onerror:a(()=>K(new Error("network")),"onerror")}):fetch(ut,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:b}).then(wt=>wt.text()).then(F).catch(K)}),_;try{_=JSON.parse(m)}catch{throw new Error("jasInfo 非 JSON")}let M=(_.classrooms||[]).map(F=>{let K=F.classroomName||F.id&&F.id.classroomNumber||"",ut=F.placeNum||"",wt=F.remark||"",Ct=[];for(let qt=1;qt<=12;qt++)Ct.push({section:qt,busy:!1});return{name:K,seats:ut,type:wt,slots:Ct,map:{}}}),N={};M.forEach(F=>{N[F.name]=F}),(_.classroomTime||[]).forEach(F=>{let K=F.id||{},ut=K.classroomNumber||"",wt=Number(K.sessionstart)||1,Ct=Math.max(1,Number(F.continuingsession)||1),qt=N[ut];if(!qt)return;let Tt=Sr(F),Ht=ac(F);for(let Rt=wt;Rt<wt+Ct&&Rt<=12;Rt++){let $t=qt.slots.find(ne=>ne.section===Rt);$t&&($t.busy=!0,$t.kind=F.timestatenumber||F.occupancymoduleId||"",$t.module=F.occupancymoduleId||"",$t.reason=Ht,$t.typeLabel=Tt,$t.displayChar=Kr(Ht),$t.xq=K.xq,$t.weekBitmap=K.week||"",$t.detail={room:ut,section:Rt,start:wt,span:Ct,reason:Ht,typeLabel:Tt,week:K.week||"",xq:K.xq||"",state:F.timestatenumber||"",module:F.occupancymoduleId||""})}});let z="";try{let F=_.jhZxjxjhb;typeof F=="string"&&/\d{4}-\d{4}-\d-\d/.test(F)?z=F:F&&typeof F=="object"&&(z=String(F.zxjxjhh||F.jhxnxq||F.executiveEducationPlanNumber||F.planNumber||""))}catch{}if(!z&&_.classrooms&&_.classrooms[0]&&_.classrooms[0].id&&(z=_.classrooms[0].id.executiveEducationPlanNumber||""),_.jxzc!=null&&Number(_.jxzc)>=1){let F=Number(_.jxzc);nt._termWeek=Math.max(nt._termWeek||0,F),nt.weekLocked||(nt.viewWeek=nt._termWeek)}let D=["日","一","二","三","四","五","六"],V=cc(_.date||l)||mp(new Date,s),O=_.week!=null?Number(_.week):V.getDay(),R=s===1?"明天":s===2?"后天":"今天";return{rooms:M,dateLabel:(_.date||l)+"（周"+(D[O]||O)+" · "+R+"）",jxzc:_.jxzc,planNumber:z,week:_.week!=null?_.week:O,searchDate:_.date||l,dateOffset:s}}a(sc,"loadBuildingOccupancy");function mp(t,e){let r=new Date(t.getFullYear(),t.getMonth(),t.getDate());return r.setDate(r.getDate()+(Number(e)||0)),r}a(mp,"addDays");function lc(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}a(lc,"formatLocalDate");function cc(t){let e=String(t||"").match(/(\d{4})-(\d{1,2})-(\d{1,2})/);return e?new Date(Number(e[1]),Number(e[2])-1,Number(e[3])):null}a(cc,"parseLocalDate");let bp={clean:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',exit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',schedule:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',score:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',room:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',eval:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',plan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',apply:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',home:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',more:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',close:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'};function hp(t){return bp[t]||bp.more}a(hp,"ico");let nt=zi();function dc(){if(document.getElementById("urppp-clean-style"))return;let t=document.createElement("style");t.id="urppp-clean-style",t.textContent=_i,(document.head||document.documentElement).appendChild(t)}a(dc,"ensureStyle");let uc=ga({deps:{scoreToNumber:Qe,scoreToGpa:Ye}}),{metricHtml:mc,occupancyHtml:bc,render:rr,renderScheduleBoard:gd,roomPickerHtml:hc,scheduleRender:fc}=Oi({state:nt,deps:{DIRECT_EDIT_LABELS:U,DAY_NAMES:Zn,analyzeScores:a(t=>uc.analyzeScores(t),"analyzeScores"),applyPersonalDisplay:Qt,bandsChartSvg:ya,bindUI:a(t=>xc(t),"bindUI"),classifyPrivacyLabel:ta,courseColor:pp,ensureRoot:a(()=>gp(),"ensureRoot"),escapeHtml:at,firstContentChar:Kr,getViewWeekNumber:ap,ico:hp,isCleanAnalysisDirect:Aa,occupancyKindClass:ic,occupancyTypeLabel:Sr,personalizedProfile:yl,scoreChartLayout:a(()=>{try{return window.matchMedia&&window.matchMedia("(max-width: 900px)").matches?{variant:"mobile"}:null}catch{return null}},"scoreChartLayout"),scoreToNumber:Qe,summarizeCourses:oe,trendChartSvg:xa,weekBitActive:op,calVacation:kr,setCalendarPhase:rp}}),{ensureRoomCatalogLoaded:fp,loadAll:gc}=qi({state:nt,deps:{ensureTermWeekResolved:Ul,enrichScoresWithEvaluation:Zl,getCurrentWeekNumber:$e,loadClassroomCatalog:rc,loadProfile:Kn,loadSchedule:Vl,loadScores:dp,readRememberedTermWeek:vr,reconcileProfileAndScores:tc,render:rr,scheduleRender:fc}}),{bindUI:xc,closeModal:yc,getRoomHost:xd,openModal:yd,openRoomModal:vd,openScoreModal:wd,showBuilding:kd}=Hi({state:nt,deps:{DAY_NAMES:Zn,applyPersonalDisplay:Qt,bindScheduleExportHosts:Fl,closeCleanMode:a(()=>wc(),"closeCleanMode"),ensureRoomCatalogLoaded:fp,enrichOccupancyWithCurriculum:pc,ensureRoot:a(()=>gp(),"ensureRoot"),escapeHtml:at,fetchText:Yt,getCurrentWeekNumber:$e,getViewWeekNumber:ap,inferMaxWeek:Wl,isUnevaluatedScore:ue,isValidOfficialGpa:Xr,loadBuildingOccupancy:sc,metricHtml:mc,occupancyHtml:bc,render:rr,rootEl:a(()=>kc(),"rootEl"),roomPickerHtml:hc,scoreToGpa:Ye,scoreToNumber:Qe,summarizeCourses:oe,summarizeCoursesPreferOfficial:oe}}),{cleanModeApi:vc,closeCleanMode:wc,ensureRoot:gp,injectCleanEntry:Ad,openCleanMode:Sd,rootEl:kc}=Ri({state:nt,deps:{CLEAN_FLAG:al,applySkinAttr:ae,closeModal:yc,ensureRoomCatalogLoaded:fp,ensureStyle:dc,getCurrentWeekNumber:$e,getSkin:te,handleThemeDotClick:ct,ico:hp,injectCleanSidebarSections:a(t=>{try{window.__urpppInjectCleanSidebarSections?.(t)}catch{}},"injectCleanSidebarSections"),refreshMobileNavbar:a(()=>{try{window.__urpppRefreshMobileNavbar?.()}catch{}},"refreshMobileNavbar"),setDrawerOpen:a((t,e,r)=>{try{window.__urpppSetDrawerOpen?.(t,e,r)}catch{}},"setDrawerOpen"),stopDrawerAnimation:a(t=>{try{window.__urpppStopDrawerAnimation?.(t)}catch{}},"stopDrawerAnimation"),isHomePage:Oo,loadAll:gc,openSettingsPanel:xn,readRememberedTermWeek:vr,refreshCleanPersonalDisplay:no,render:rr,scoreToGpa:Ye,summarizeCourses:oe,syncNavbarThemeUI:xt,syncSettingsPanelUI:jt,syncThemeDotGroup:Z}});window.__urpppCleanMode=vc;function ho(){if(!document.body){setTimeout(ho,10);return}if(Ro(),Gt(Jt()),setTimeout(()=>{try{Pe().then(e=>Ce(e))}catch{}},0),document.addEventListener("focusin",e=>{let r=e.target;if(!r||!r.matches||!r.matches(".chosen-search input"))return;let o=[],i=r.parentElement;for(;i;){let s=i.scrollTop,l=i.scrollLeft;(s||l||i.scrollHeight>i.clientHeight||i.scrollWidth>i.clientWidth)&&o.push({el:i,top:s,left:l}),i=i.parentElement}requestAnimationFrame(()=>{o.forEach(s=>{s.el.scrollTop=s.top,s.el.scrollLeft=s.left})})},!0),!!document.getElementById("formContent")&&!!document.querySelector(".form-signin"))Yo();else{As();try{Fn()}catch{}try{aa()}catch(e){console.warn("[URP++] route feature refresh",e)}try{Qt(document)}catch{}try{ep()}catch{}[350,900,1800].forEach(e=>setTimeout(()=>{try{aa()}catch{}try{Qt(document)}catch{}},e));try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}[400,1200,2500].forEach(e=>setTimeout(()=>{try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}},e));try{ka()&&Oo()&&window.__urpppCleanMode&&setTimeout(()=>{try{window.__urpppCleanMode.open(!1)}catch{}},700)}catch{}}}if(a(ho,"init"),!window.__urpppSidebarSyncBound){window.__urpppSidebarSyncBound=!0,window.addEventListener("resize",()=>{clearTimeout(window.__urpppSidebarSyncTimer),window.__urpppSidebarSyncTimer=setTimeout(qe,50)}),window.addEventListener("load",()=>{qe(),Je(),setTimeout(qe,100),setTimeout(qe,400)}),document.addEventListener("click",e=>{e.target&&e.target.closest&&e.target.closest("#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse")&&(setTimeout(Je,0),setTimeout(Je,50),setTimeout(Je,200))},!0);let t=document.getElementById("sidebar");t&&!t.__urpppMarginObs&&(t.__urpppMarginObs=new MutationObserver(()=>{clearTimeout(window.__urpppMarginObsTimer),window.__urpppMarginObsTimer=setTimeout(Je,30)}),t.__urpppMarginObs.observe(t,{attributes:!0,attributeFilter:["class","style"]}))}function xp(){if(window.__urpppRouteWatchBound)return;window.__urpppRouteWatchBound=!0;let t=0,e=a(()=>{try{let i=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches),s=!!(document.getElementById("urppp-clean-root")&&document.getElementById("urppp-clean-root").classList.contains("open"));i&&!s&&window.__urpppCloseMobileDrawer&&window.__urpppCloseMobileDrawer()}catch{}clearTimeout(t),t=setTimeout(()=>{if(nt._termWeekResolved=!1,!!document.getElementById("sidebar")){qe(),Nn(),st(),qe();try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}dt(),[250,700].forEach(s=>setTimeout(()=>{try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}},s)),Ia(),bn(),hn(),nn(),fn(),mn(),sn(),document.querySelectorAll(".page-content, #page-content-template").forEach(s=>{let l=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches);s.style.setProperty("padding",l?"8px 8px 24px":"16px 64px 40px","important"),s.style.setProperty("box-sizing","border-box","important")}),jr(),Rr(),Ue(),setTimeout(Ue,300),setTimeout(Ue,1e3),Zo(),ve(),ur(),rn(),setTimeout(ur,300),mr(),setTimeout(()=>mr(),500),Dr(),en();try{aa()}catch{}try{Qt(document)}catch{}setTimeout(()=>{try{aa()}catch{}try{Qt(document)}catch{}},500)}},100)},"run");window.addEventListener("popstate",e),window.addEventListener("hashchange",e);let r=history.pushState,o=history.replaceState;history.pushState=function(...i){let s=r.apply(this,i);return e(),s},history.replaceState=function(...i){let s=o.apply(this,i);return e(),s}}a(xp,"watchRouteChanges");let ar=typeof unsafeWindow<"u"?unsafeWindow:window;ar.__urpppDebug=ar.__urpppDebug||{},ar.__urpppDebug.setCalendarPhase=t=>rp(t),ar.__urpppDebug.getCalendarPhase=()=>Rl(),ar.__urpppDebug.calVacation=t=>kr(t),ar.urppp={version:n,showLogo(t){let e=document.querySelector("#urppp-brand .ub-logo");e&&e.classList.toggle("show",t)},theme:{apply:a(t=>{Gt(t)},"apply"),setAccent:rs,getAccent:Xt,getCurrent:Jt,list:a(()=>Object.entries(Pt).map(([t,e])=>({name:t,displayName:e.name,current:t===Jt()})),"list")},update:{check:to,auto:Za,showToast:Ka},privacy:{get:Ee,set(t){return _a(t),Qt(document),Ee()},apply:a(()=>Qt(document),"apply"),identity:{get:je,set(t){return Fo(t),Qt(document),no(),je()}}},scheduleExport:{load:a(()=>Wn("api"),"load"),run:a(t=>zl(t,"api",null,null),"run"),patch:uo,image:{theme:Jn,build:a((t,e)=>Yn(t,e),"build")},jsonFormat:{get:Br,set:jo,validate:Be,build(t,e){let r=sa(t);if(e)return ca(r,Be(e));let o=Br();return o.enabled?ca(r,o.mapping):la(r)},buildDefault(t){return la(sa(t))}}}};function yp(){setTimeout(()=>{try{Za()}catch{}},1800)}a(yp,"scheduleAutoUpdateCheck");try{Ro()}catch{}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{ho(),xp(),yp()}):(ho(),xp(),yp())})();})();
