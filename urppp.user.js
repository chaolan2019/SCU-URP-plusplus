// ==UserScript==
// @name         SCU URP++教务系统美化
// @namespace    https://github.com/chaolan2019/SCU-URP-plusplus
// @version      1.9.7
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
// @connect      127.0.0.1
// @connect      localhost
// @connect      raw.githubusercontent.com
// @connect      github.com
// @connect      cdn.jsdelivr.net
// @connect      gh-proxy.com
// @connect      api.yanjiangrd.site
// @run-at       document-start
// ==/UserScript==

// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) 2026 Chao_Lan

(()=>{function nr(o){let n=String(o).replace("#","").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);return n?{r:parseInt(n[1],16),g:parseInt(n[2],16),b:parseInt(n[3],16)}:{r:30,g:58,b:95}}function zr(o,n,l){return"#"+[o,n,l].map(c=>Math.max(0,Math.min(255,Math.round(c))).toString(16).padStart(2,"0")).join("")}function Vt(o){let n=String(o||"").trim();return n?(n[0]!=="#"&&(n="#"+n),/^#[0-9a-fA-F]{6}$/.test(n)?n.toUpperCase():""):""}function Ao(o,n){let{r:l,g:c,b:d}=nr(o),k=1-n;return zr(l*k,c*k,d*k)}function Se(o,n){let{r:l,g:c,b:d}=nr(o);return`rgba(${l},${c},${d},${n})`}function Bt(o,n,l){let c=nr(Vt(o)||"#FFFFFF"),d=nr(Vt(n)||"#FFFFFF"),k=Math.max(0,Math.min(1,Number(l)||0));return zr(c.r+(d.r-c.r)*k,c.g+(d.g-c.g)*k,c.b+(d.b-c.b)*k)}function So(o,n){if(typeof o!="function")throw new TypeError(`${n} must be a function`)}function da(o){if(!o||typeof o!="object")throw new TypeError("feature definition must be an object");let n=String(o.id||"").trim();if(!n)throw new TypeError("feature id is required");return So(o.matches,`${n}.matches`),So(o.mount,`${n}.mount`),So(o.unmount,`${n}.unmount`),Object.freeze({id:n,matches:o.matches,mount:o.mount,unmount:o.unmount})}function Ip(o){if(!Array.isArray(o))throw new TypeError("features must be an array");let n=o.map(da),l=new Set;n.forEach(A=>{if(l.has(A.id))throw new Error(`duplicate feature id: ${A.id}`);l.add(A.id)});let c=null,d=null;function k(){if(!c)return;let A=c,x=d;c=null,d=null,A.unmount(x)}function C(A={}){let x=n.find(f=>f.matches(A));if(x&&c===x&&A.lifecycleKey!==void 0&&d?.lifecycleKey===A.lifecycleKey)try{return x.mount(A),d=A,x.id}catch(f){throw k(),f}if(k(),!x)return null;try{return x.mount(A),c=x,d=A,x.id}catch(f){try{x.unmount(A)}catch{}throw f}}return Object.freeze({refresh:C,unmount:k,getActiveFeatureId:()=>c?.id||null,listFeatureIds:()=>n.map(A=>A.id)})}function Z(o){return String(o||"").replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function _o(o){let n=String(o||"").match(/@version\s+([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)/i);return n?n[1]:""}function $p(o){return String(o||"0").replace(/^v/i,"").split(/[.+\-]/).filter(Boolean).map(n=>/^\d+$/.test(n)?parseInt(n,10):n)}function Lr(o,n){let l=$p(o),c=$p(n),d=Math.max(l.length,c.length);for(let k=0;k<d;k+=1){let C=l[k]==null?0:l[k],A=c[k]==null?0:c[k];if(typeof C=="number"&&typeof A=="number"){if(C>A)return 1;if(C<A)return-1;continue}let f=String(C),y=String(A);if(f>y)return 1;if(f<y)return-1}return 0}var Nc=typeof TextEncoder<"u"?new TextEncoder:{encode:o=>Uint8Array.from(Buffer.from(o,"utf8"))};function qr(o){return typeof o=="string"?Nc.encode(o):o instanceof Uint8Array?o:ArrayBuffer.isView(o)?new Uint8Array(o.buffer,o.byteOffset,o.byteLength):new Uint8Array(o)}var Bc=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]);function pe(o,n){return o>>>n|o<<32-n}function ua(o){let n=qr(o),l=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),c=n.length,d=Math.floor(c/536870912),k=c<<3>>>0,C=(c+8>>6<<6)+64,A=new Uint8Array(C);A.set(n),A[c]=128;let x=new DataView(A.buffer);x.setUint32(C-8,d),x.setUint32(C-4,k);let S=new Uint32Array(64);for(let y=0;y<C;y+=64){for(let T=0;T<16;T+=1)S[T]=x.getUint32(y+T*4);for(let T=16;T<64;T+=1){let L=pe(S[T-15],7)^pe(S[T-15],18)^S[T-15]>>>3,F=pe(S[T-2],17)^pe(S[T-2],19)^S[T-2]>>>10;S[T]=S[T-16]+L+S[T-7]+F>>>0}let z=l[0],E=l[1],h=l[2],b=l[3],v=l[4],g=l[5],_=l[6],P=l[7];for(let T=0;T<64;T+=1){let L=pe(v,6)^pe(v,11)^pe(v,25),F=v&g^~v&_,I=P+L+F+Bc[T]+S[T]>>>0,D=pe(z,2)^pe(z,13)^pe(z,22),W=z&E^z&h^E&h,H=D+W>>>0;P=_,_=g,g=v,v=b+I>>>0,b=h,h=E,E=z,z=I+H>>>0}l[0]=l[0]+z>>>0,l[1]=l[1]+E>>>0,l[2]=l[2]+h>>>0,l[3]=l[3]+b>>>0,l[4]=l[4]+v>>>0,l[5]=l[5]+g>>>0,l[6]=l[6]+_>>>0,l[7]=l[7]+P>>>0}let f=new Uint8Array(32);for(let y=0;y<8;y+=1)f[y*4]=l[y]>>>24,f[y*4+1]=l[y]>>>16,f[y*4+2]=l[y]>>>8,f[y*4+3]=l[y];return f}var Fc=[0x428a2f98d728ae22n,0x7137449123ef65cdn,0xb5c0fbcfec4d3b2fn,0xe9b5dba58189dbbcn,0x3956c25bf348b538n,0x59f111f1b605d019n,0x923f82a4af194f9bn,0xab1c5ed5da6d8118n,0xd807aa98a3030242n,0x12835b0145706fben,0x243185be4ee4b28cn,0x550c7dc3d5ffb4e2n,0x72be5d74f27b896fn,0x80deb1fe3b1696b1n,0x9bdc06a725c71235n,0xc19bf174cf692694n,0xe49b69c19ef14ad2n,0xefbe4786384f25e3n,0x0fc19dc68b8cd5b5n,0x240ca1cc77ac9c65n,0x2de92c6f592b0275n,0x4a7484aa6ea6e483n,0x5cb0a9dcbd41fbd4n,0x76f988da831153b5n,0x983e5152ee66dfabn,0xa831c66d2db43210n,0xb00327c898fb213fn,0xbf597fc7beef0ee4n,0xc6e00bf33da88fc2n,0xd5a79147930aa725n,0x06ca6351e003826fn,0x142929670a0e6e70n,0x27b70a8546d22ffcn,0x2e1b21385c26c926n,0x4d2c6dfc5ac42aedn,0x53380d139d95b3dfn,0x650a73548baf63den,0x766a0abb3c77b2a8n,0x81c2c92e47edaee6n,0x92722c851482353bn,0xa2bfe8a14cf10364n,0xa81a664bbc423001n,0xc24b8b70d0f89791n,0xc76c51a30654be30n,0xd192e819d6ef5218n,0xd69906245565a910n,0xf40e35855771202an,0x106aa07032bbd1b8n,0x19a4c116b8d2d0c8n,0x1e376c085141ab53n,0x2748774cdf8eeb99n,0x34b0bcb5e19b48a8n,0x391c0cb3c5c95a63n,0x4ed8aa4ae3418acbn,0x5b9cca4f7763e373n,0x682e6ff3d6b2b8a3n,0x748f82ee5defb2fcn,0x78a5636f43172f60n,0x84c87814a1f0ab72n,0x8cc702081a6439ecn,0x90befffa23631e28n,0xa4506cebde82bde9n,0xbef9a3f7b2c67915n,0xc67178f2e372532bn,0xca273eceea26619cn,0xd186b8c721c0c207n,0xeada7dd6cde0eb1en,0xf57d4f7fee6ed178n,0x06f067aa72176fban,0x0a637dc5a2c898a6n,0x113f9804bef90daen,0x1b710b35131c471bn,0x28db77f523047d84n,0x32caab7b40c72493n,0x3c9ebe0a15c9bebcn,0x431d67c49c100d4cn,0x4cc5d4becb3e42b6n,0x597f299cfc657e2an,0x5fcb6fab3ad6faecn,0x6c44198c4a475817n].map(o=>BigInt(o));function ie(o,n){return(o>>BigInt(n)|o<<BigInt(64-n))&0xffffffffffffffffn}function Dc(o){let n=qr(o),l=[0x6a09e667f3bcc908n,0xbb67ae8584caa73bn,0x3c6ef372fe94f82bn,0xa54ff53a5f1d36f1n,0x510e527fade682d1n,0x9b05688c2b3e6c1fn,0x1f83d9abfb41bd6bn,0x5be0cd19137e2179n],c=n.length,d=BigInt(c)*8n,k=c+8+15>>4<<4,C=new Uint8Array(k+16);C.set(n),C[c]=128;let A=new DataView(C.buffer);A.setBigUint64(C.length-8,d);let x=new Array(80);for(let f=0;f<C.length;f+=128){for(let P=0;P<16;P+=1)x[P]=A.getBigUint64(f+P*8);for(let P=16;P<80;P+=1){let T=ie(x[P-15],1)^ie(x[P-15],8)^x[P-15]>>7n,L=ie(x[P-2],19)^ie(x[P-2],61)^x[P-2]>>6n;x[P]=x[P-16]+T+x[P-7]+L&0xffffffffffffffffn}let y=l[0],z=l[1],E=l[2],h=l[3],b=l[4],v=l[5],g=l[6],_=l[7];for(let P=0;P<80;P+=1){let T=ie(b,14)^ie(b,18)^ie(b,41),L=b&v^~b&g,F=_+T+L+Fc[P]+x[P]&0xffffffffffffffffn,I=ie(y,28)^ie(y,34)^ie(y,39),D=y&z^y&E^z&E,W=I+D&0xffffffffffffffffn;_=g,g=v,v=b,b=h+F&0xffffffffffffffffn,h=E,E=z,z=y,y=F+W&0xffffffffffffffffn}l[0]=l[0]+y&0xffffffffffffffffn,l[1]=l[1]+z&0xffffffffffffffffn,l[2]=l[2]+E&0xffffffffffffffffn,l[3]=l[3]+h&0xffffffffffffffffn,l[4]=l[4]+b&0xffffffffffffffffn,l[5]=l[5]+v&0xffffffffffffffffn,l[6]=l[6]+g&0xffffffffffffffffn,l[7]=l[7]+_&0xffffffffffffffffn}let S=new Uint8Array(64);for(let f=0;f<8;f+=1){let y=l[f]&0xffffffffffffffffn;for(let z=0;z<8;z+=1)S[f*8+z]=Number(y>>BigInt(56-z*8)&0xffn)}return S}var ut=2n**255n-19n,Np=2n**252n+27742317777372353535851937790883648493n;function pr(o,n,l){let c=1n;for(o%=l;n;n>>=1n)n&1n&&(c=c*o%l),o=o*o%l;return c}var Fp=(ut-121665n)*pr(121666n,ut-2n,ut)%ut,jc=pr(2n,(ut-1n)/4n,ut);function Eo(o){let n=0n;for(let l=0;l<o.length;l+=1)n|=BigInt(o[l])<<BigInt(8*l);return n}function Oc(o,n){let l=new Uint8Array(n);for(let c=0;c<n;c+=1)l[c]=Number(o&255n),o>>=8n;return l}function Co(o){if(o.length!==32)return null;let n=(o[31]&128)!==0,l=Eo(o)&(1n<<255n)-1n;if(l>=ut)return null;let c=l*l%ut,d=(c-1n+ut)%ut,k=(Fp*c+1n)%ut,C=d*pr(k,ut-2n,ut)%ut,A=pr(C,(ut+3n)/8n,ut);return A*A%ut!==C&&(A=A*jc%ut),A*A%ut!==C?null:(!!(A&1n)!==n&&(A=ut-A),{X:A,Y:l})}function Po(o,n){let l=o.X%ut,c=o.Y%ut,d=n.X%ut,k=n.Y%ut,C=Fp*l%ut*d%ut*c%ut*k%ut,A=(l*k+d*c)%ut*pr((1n+C+ut)%ut,ut-2n,ut)%ut,x=(c*k%ut+l*d%ut)%ut*pr((1n-C+ut)%ut,ut-2n,ut)%ut;return{X:A,Y:x}}function Bp(o,n){let l=null,c={X:o.X%ut,Y:o.Y%ut};for(;n>0n;n>>=1n)n&1n&&(l=l?Po(l,c):c),c=Po(c,c);return l}var Rc=Co(Oc(46316835694926478169428394003475163141307993866256225615783033603165251855960n,32));function zo(o,n,l){if(!o||!n||!l)return!1;let c=qr(o),d=qr(n),k=qr(l);if(c.length!==64||d.length!==32)return!1;let C=Co(d);if(!C)return!1;let A=Co(c.slice(0,32));if(!A)return!1;let x=Eo(c.slice(32));if(x>=Np)return!1;let S=Eo(Dc(Hc(c.slice(0,32),d,k)))%Np,f=Bp(Rc,x),y=Bp(C,S),z=y?{X:(ut-y.X%ut)%ut,Y:y.Y%ut}:null,E=f&&z?Po(f,z):f||z;return!E||!A?!1:E.X%ut===A.X%ut&&E.Y%ut===A.Y%ut}function Hc(...o){let n=0;for(let d of o)n+=d.length;let l=new Uint8Array(n),c=0;for(let d of o)l.set(d,c),c+=d.length;return l}var Mr={base:{},coursesPath:"courses",schedulePath:"schedule",courseFields:{name:"name",teacher:"teacher",position:"position",day:"day",sections:"sections",weeks:"weeks"},scheduleFields:{morningNum:"morningNum",afternoonNum:"afternoonNum",nightNum:"nightNum",sections:"sections"}},Uc=["name","teacher","position","day","sections","weeks","code","sequence","englishName","attribute","category","credit","status","campus","building","classroom","startSection","endSection","weekList"],Wc=["morningNum","afternoonNum","nightNum","sections","sectionList"];function qo(o){return JSON.parse(JSON.stringify(o))}function Rp(o,n){return o===n||o.startsWith(`${n}.`)||n.startsWith(`${o}.`)}function ma(o,n){let l=String(o??"").trim();if(!l){if(n)return"";throw new Error("课程数组输出路径不能为空")}if(l.length>120)throw new Error("JSON 输出路径不能超过 120 个字符");let c=l.split("."),d=new Set(["__proto__","prototype","constructor"]);if(c.some(C=>!C||/^\d+$/.test(C)||/[\[\]\x00-\x1f]/.test(C)||d.has(C)))throw new Error(`JSON 输出路径包含无效片段：${l}`);return c.join(".")}function Gc(o,n){for(let l=0;l<o.length;l+=1)for(let c=l+1;c<o.length;c+=1)if(Rp(o[l],o[c]))throw new Error(`${n}目标路径不能重叠：${o[l]} / ${o[c]}`)}function Dp(o,n,l){let c=n.split("."),d=o;for(let k=0;k<c.length;k+=1){let C=c[k];if(!Object.prototype.hasOwnProperty.call(d,C))return;if(k===c.length-1)throw new Error(`${l}输出路径与 base 字段重叠：${n}`);if(d=d[C],!d||typeof d!="object"||Array.isArray(d)){let A=c.slice(0,k+1).join(".");throw new Error(`${l}输出路径无法穿过 base 中的非对象字段：${A}`)}}}function jp(o,n,l){if(!o||typeof o!="object"||Array.isArray(o))throw new Error(`${l}字段映射必须是对象`);let c={};return Object.entries(o).forEach(([d,k])=>{if(!n.includes(d))throw new Error(`${l}不支持源字段：${d}`);let C=ma(k,!0);C&&(c[d]=C)}),Gc(Object.values(c),`${l}字段`),c}function Be(o){if(!o||typeof o!="object"||Array.isArray(o))throw new Error("自定义 JSON 映射必须是对象");let n=o.base==null?{}:o.base;if(!n||typeof n!="object"||Array.isArray(n))throw new Error("base 必须是 JSON 对象");let l={base:qo(n),coursesPath:ma(o.coursesPath,!1),schedulePath:ma(o.schedulePath,!0),courseFields:jp(o.courseFields,Uc,"课程"),scheduleFields:jp(o.scheduleFields||{},Wc,"时间表")};if(!Object.keys(l.courseFields).length)throw new Error("至少保留一个课程字段映射");if(l.schedulePath&&Rp(l.schedulePath,l.coursesPath))throw new Error("课程与时间表输出路径不能重叠");return Dp(l.base,l.coursesPath,"课程"),l.schedulePath&&Dp(l.base,l.schedulePath,"时间表"),l}function Tr(o){let n=String(o||"").replace(/\D/g,"").padStart(4,"0").slice(-4),l=`${n.slice(0,2)}:${n.slice(2)}`;return/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(l)?l:""}function Lo(o,n,l){let c=ma(n,!1).split("."),d=o;c.forEach((k,C)=>{if(C===c.length-1){d[k]=l;return}(!d[k]||typeof d[k]!="object"||Array.isArray(d[k]))&&(d[k]={}),d=d[k]})}function Op(o,n){let l={};return Object.entries(n||{}).forEach(([c,d])=>{!Object.prototype.hasOwnProperty.call(o,c)||o[c]===void 0||Lo(l,d,qo(o[c]))}),l}function Jc(o){return[o.campus,o.building,o.classroom].map(n=>String(n||"").trim()).filter(Boolean).join(" ")}function Vc(o){let n=Number(o.startSection)||0,l=Number(o.endSection)||n;return n<1||l<n?"":Array.from({length:l-n+1},(c,d)=>n+d).join(",")}function Yc(o,n){let l=Number(n.day)||0,c=Vc(n),d=Array.from(new Set((n.weeks||[]).map(Number).filter(k=>Number.isInteger(k)&&k>=1&&k<=60))).sort((k,C)=>k-C);return l<1||l>7||!c?{error:"invalid"}:d.length?{value:{name:o.name,teacher:o.teacher,position:Jc(n),day:l,sections:c,weeks:d.join(","),code:o.code,sequence:o.sequence,englishName:o.englishName,attribute:o.attribute,category:o.category,credit:o.credit,status:o.status,campus:n.campus,building:n.building,classroom:n.classroom,startSection:n.startSection,endSection:n.endSection,weekList:d}}:{error:"weeks"}}function Qc(o,n){let l=[];return o.courses.forEach(c=>{if(!c.arrangements.length){n.unscheduledCourses+=1;return}c.arrangements.forEach(d=>{let k=Yc(c,d);k.error==="weeks"?n.missingWeeks+=1:k.error?n.invalidArrangements+=1:l.push(k.value)})}),l}function Kc(o){let n=new Map;return(o||[]).forEach(l=>{let c=Number(l.section),d=Tr(l.start),k=Tr(l.end);!Number.isInteger(c)||c<1||c>20||!d||!k||n.set(c,{i:c,s:d,e:k})}),Array.from(n.values()).sort((l,c)=>l.i-c.i)}function Zc(o){let n=Kc(o);if(!n.length)return{};let l={sections:JSON.stringify(n),sectionList:n};if(!n.every((d,k)=>d.i===k+1))return l;let c={morningNum:0,afternoonNum:0,nightNum:0};return n.forEach(d=>{let[k,C]=d.s.split(":").map(Number),A=k*60+C;A<720?c.morningNum+=1:A>=1080?c.nightNum+=1:c.afternoonNum+=1}),c.morningNum&&c.afternoonNum&&c.nightNum?Object.assign(l,c):l}function ba(o){let n={unscheduledCourses:0,missingWeeks:0,invalidArrangements:0},l=Qc(o,n);if(!l.length)throw new Error("没有符合导入格式的已排课课程");return{courses:l,schedule:Zc(o.sections),stats:n}}function ha(o){let n={courses:o.courses.map(c=>({name:c.name,teacher:c.teacher,position:c.position,day:c.day,sections:c.sections,weeks:c.weeks}))},l={};return["morningNum","afternoonNum","nightNum","sections"].forEach(c=>{Object.prototype.hasOwnProperty.call(o.schedule,c)&&(l[c]=o.schedule[c])}),Object.keys(l).length&&(n.schedule=l),n}function fa(o,n){let l=qo(n.base||{}),c=o.courses.map(d=>Op(d,n.courseFields));if(Lo(l,n.coursesPath,c),n.schedulePath&&Object.keys(o.schedule).length){let d=Op(o.schedule,n.scheduleFields);Object.keys(d).length&&Lo(l,n.schedulePath,d)}return l}function Ir(o){return o.getFullYear()+"-"+String(o.getMonth()+1).padStart(2,"0")+"-"+String(o.getDate()).padStart(2,"0")}function ir(o){let n=String(o||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!n)return null;let l=new Date(Number(n[1]),Number(n[2])-1,Number(n[3]));return Number.isNaN(l.getTime())||Ir(l)!==String(o)?null:l}function To(o){let n=new Date(o.getFullYear(),o.getMonth(),o.getDate()),l=n.getDay();return n.setDate(n.getDate()-(l===0?6:l-1)),n}function Up(o){let n=String(o||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return Ir(To(new Date));let l=n[3]==="1"?Number(n[1]):Number(n[2]),c=n[3]==="1"?8:2,d=new Date(l,c,1);for(;d.getDay()!==1;)d.setDate(d.getDate()+1);return Ir(d)}function Hp(o){return o.getFullYear()+String(o.getMonth()+1).padStart(2,"0")+String(o.getDate()).padStart(2,"0")+"T"+String(o.getHours()).padStart(2,"0")+String(o.getMinutes()).padStart(2,"0")+"00"}function ga(o){return String(o||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}function Xc(o){if(typeof TextEncoder!="function")return o;let n=new TextEncoder,l=[],c="",d=73;for(let k of String(o))n.encode(c+k).length>d&&c?(l.push(c),c=" "+k,d=74):c+=k;return c&&l.push(c),l.join(`\r
`)}function td(o){let n=2166136261,l=String(o||"");for(let c=0;c<l.length;c+=1)n=Math.imul(n^l.charCodeAt(c),16777619);return(n>>>0).toString(16)+"@scu-urppp"}function Wp(o){let n=new Map;return o.sections.forEach(l=>n.set(l.section,l)),n}function ed(o){return o.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}function Gp(o,n,l={}){let c=ir(n);if(!c)throw new Error("第一教学周日期无效");let d=Wp(o);if(!d.size)throw new Error("教务接口没有返回节次时间，无法生成 ICS");let k=ed(l.now instanceof Date?l.now:new Date),C=0,A=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//SCU URP++//Schedule Export//CN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+ga(o.semester.label+"课表"),"X-WR-TIMEZONE:Asia/Shanghai","BEGIN:VTIMEZONE","TZID:Asia/Shanghai","X-LIC-LOCATION:Asia/Shanghai","BEGIN:STANDARD","TZOFFSETFROM:+0800","TZOFFSETTO:+0800","TZNAME:CST","DTSTART:19700101T000000","END:STANDARD","END:VTIMEZONE"];if(o.courses.forEach(x=>x.arrangements.forEach(S=>{let f=d.get(S.startSection),y=d.get(S.endSection);!f||!y||S.weeks.forEach(z=>{let E=new Date(c);E.setDate(c.getDate()+(z-1)*7+S.day-1);let h=new Date(E),b=new Date(E),v=f.start.split(":").map(Number),g=y.end.split(":").map(Number);h.setHours(v[0],v[1],0,0),b.setHours(g[0],g[1],0,0);let _=[S.campus,S.building,S.classroom].filter(Boolean).join(" "),P=["教师："+x.teacher,"周次："+S.weekDescription,"课程号："+x.code+(x.sequence?"_"+x.sequence:""),"学分："+x.credit,"课程属性："+x.attribute].filter(L=>!/[：:]$/.test(L)).join(`
`),T=[o.semester.planCode,x.code,x.sequence,S.day,S.startSection,S.endSection,z,S.campus,S.building,S.classroom].join("|");C+=1,A.push("BEGIN:VEVENT","UID:"+td(T),"DTSTAMP:"+k,"SUMMARY:"+ga(x.name),"LOCATION:"+ga(_),"DESCRIPTION:"+ga(P),"DTSTART;TZID=Asia/Shanghai:"+Hp(h),"DTEND;TZID=Asia/Shanghai:"+Hp(b),"END:VEVENT")})})),!C)throw new Error("课表中没有已安排时间的课程，无法生成 ICS");return A.push("END:VCALENDAR"),A.map(Xc).join(`\r
`)+`\r
`}function Jp(o){let n=Wp(o),l=0,c=0;return o.courses.forEach(d=>d.arrangements.forEach(k=>{k.weeks.length||(l+=1),(!n.has(k.startSection)||!n.has(k.endSection))&&(c+=1)})),{missingWeeks:l,missingTimes:c}}function rd(o){let n=String(o||"").replace(/[—–]/g,"-"),l=/单周|单数周|[（(]单[）)]/.test(n)?1:/双周|双数周|[（(]双[）)]/.test(n)?0:-1,c=new Set,d=k=>{let C=Number(k);C>=1&&C<=30&&(l<0||C%2===l)&&c.add(C)};return n.replace(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/g,(k,C,A)=>{let x=Math.min(Number(C),Number(A)),S=Math.max(Number(C),Number(A));for(let f=x;f<=S;f+=1)d(f);return k}),(n.match(/\d{1,2}/g)||[]).forEach(d),Array.from(c).sort((k,C)=>k-C)}function Vp(o,n){let l=String(o||"").trim();if(/^[01]+$/.test(l)){let c=[];for(let d=0;d<l.length;d+=1)l.charAt(d)==="1"&&c.push(d+1);return c}return rd(n||l)}function ad(o){let n=o&&Array.isArray(o.xkxx)?o.xkxx:[];for(let l of n){let c=Object.values(l||{});if(c.length)return c[0]}return null}function sr(o){let n=ad(o);if(!n)return"";let l=Array.isArray(n.timeAndPlaceList)?n.timeAndPlaceList[0]:null;return String(n.zxjxjhh||n.executiveEducationPlanNumber||n.id&&(n.id.zxjxjhh||n.id.executiveEducationPlanNumber)||l&&(l.zxjxjhh||l.executiveEducationPlanNumber)||"").trim()}function od(o){let n=String(o||"").match(/^(\d{4})-(\d{4})-(\d)/);if(!n)return"学生课表";let l=n[3]==="1"?"秋季学期":n[3]==="2"?"春季学期":"学期";return n[1]+"-"+n[2]+"学年"+l}function Yp(o,n,l,c={}){let d=n||sr(o),k=(Array.isArray(o&&o.jcsjbs)?o.jcsjbs:[]).map(x=>({section:Number(x.jc)||0,start:Tr(x.kssj),end:Tr(x.jssj)})).filter(x=>x.section>=1&&x.section<=20&&x.start&&x.end).sort((x,S)=>x.section-S.section),C=[];(Array.isArray(o&&o.xkxx)?o.xkxx:[]).forEach(x=>{Object.keys(x||{}).forEach(S=>{let f=x[S];if(!f)return;let y=f.id||{},z=(f.timeAndPlaceList||[]).map(E=>({day:Number(E.classDay)||0,startSection:Number(E.classSessions)||1,endSection:Math.min(12,(Number(E.classSessions)||1)+Math.max(1,Number(E.continuingSession)||1)-1),weeks:Vp(E.classWeek,E.weekDescription||f.skzcs),weekDescription:String(E.weekDescription||f.skzcs||"").trim(),campus:String(E.campusName||"").trim(),building:String(E.teachingBuildingName||"").trim(),classroom:String(E.classroomName||"").trim()})).filter(E=>E.day>=1&&E.day<=7&&E.startSection>=1&&E.startSection<=12);C.push({code:String(y.coureNumber||f.zkch||"").trim(),sequence:String(y.coureSequenceNumber||f.zkxh||"").trim(),name:String(f.courseName||f.englishCourseName||S).trim(),englishName:String(f.englishCourseName||"").trim(),teacher:String(f.attendClassTeacher||"").trim(),attribute:String(f.coursePropertiesName||"").trim(),category:String(f.courseCategoryName||"").trim(),credit:Number(f.unit)||0,status:String(f.selectCourseStatusName||"").trim(),arrangements:z})})});let A=String(c.firstMonday||"").trim();return{schemaVersion:1,exportedAt:(c.now instanceof Date?c.now:new Date).toISOString(),source:l||"SCU URP++",semester:{planCode:d,label:od(d),firstMonday:ir(A)?A:""},sections:k,courses:C}}function Qp(o,n,l,c=0){let d=Math.max(0,Number(o)||0),k=Math.max(1,Math.floor(Number(n)||1)),C=Math.max(0,Math.min(k-1,Math.floor(Number(l)||0))),A=-Math.max(0,Number(c)||0),x=A+d*C/k,S=A+d*(C+1)/k;return{left:x,width:Math.max(0,S-x)}}function xa(o,n,l){let c=[],d=String(o||""),k=Math.max(4,Number(n)||4);for(;d;)c.push({text:d.slice(0,k),kind:l}),d=d.slice(k);return c}function ya(o,n){let l=o.slice(0,Math.max(0,n)).map(c=>({...c}));if(l.length&&l.length<o.length){let c=l[l.length-1];c.text=c.text.length>1?c.text.slice(0,-1)+"…":"…"}return l}var Kp=["#2563EB","#059669","#D97706","#DC2626","#7C3AED","#0891B2","#DB2777","#4D7C0F","#EA580C","#4F46E5"];function Xp(o){let n=0,l=String(o||"");for(let c=0;c<l.length;c+=1)n=n*31+l.charCodeAt(c)>>>0;return Kp[n%Kp.length]}function Zp(o){let n=[];o.forEach(l=>{let c=n.findIndex(d=>d<l.startSection);c<0&&(c=n.length,n.push(0)),n[c]=l.endSection,l.lane=c}),o.forEach(l=>{l.laneCount=Math.max(1,n.length)})}function ti(o){let n=o.slice().sort((d,k)=>d.startSection-k.startSection||d.endSection-k.endSection||d.course.name.localeCompare(k.course.name)),l=[],c=0;return n.forEach(d=>{l.length&&d.startSection>c&&(Zp(l),l=[],c=0),l.push(d),c=Math.max(c,d.endSection)}),l.length&&Zp(l),n}function ei(o){let n=[];return o.courses.forEach(l=>l.arrangements.forEach(c=>{n.push({course:l,arrangement:c,startSection:c.startSection,endSection:c.endSection,day:c.day})})),n}function ri(o,n){let l=[],c=String(o||"");for(;c;)l.push(c.slice(0,n)),c=c.slice(n);return l}function ai(o,n,l){let c=o.startSection===o.endSection?o.startSection+"节":o.startSection+"-"+o.endSection+"节",d=xa(o.name,Math.max(5,n),"title"),k=xa(o.teacher,Math.max(6,n+2),"teacher"),C=xa([o.weekDescription,c].filter(Boolean).join(" · "),Math.max(6,n+2),"schedule"),A=xa([o.campus,o.building,o.classroom].filter(Boolean).join(" "),Math.max(6,n+2),"location"),x=Math.max(1,Number(l)||1),S=A.length&&x>=2?Math.min(2,A.length):0,f=C.length&&x>=3?1:0,y=k.length&&x>=4?1:0,z=Math.max(1,x-S-f-y),E=ya(d,z),h=x-E.length,b=Math.min(k.length,Math.max(0,h-f-S));E.push(...ya(k,b)),h=x-E.length;let v=Math.min(C.length,Math.max(0,h-S));return E.push(...ya(C,v)),h=x-E.length,E.push(...ya(A,h)),E.slice(0,x)}function nd(o,n){let l=Xp(n),c=o.colors,d=o.skin;return d==="brutal"?{fill:Bt(c.surface,l,.48),stroke:"#000000",text:"#111111",secondary:"#242424",stripe:l}:d==="flat"?{fill:Bt(c.surface,l,o.dark?.24:.16),stroke:c.text,text:c.text,secondary:c.secondary,stripe:l}:d==="editorial"?{fill:Bt(c.surface,l,o.dark?.16:.08),stroke:c.border,text:c.text,secondary:c.secondary,stripe:l}:{fill:Bt(c.surface,l,o.dark?.28:d==="organic"?.2:.14),stroke:Bt(c.border,l,o.dark?.52:.42),text:c.text,secondary:c.secondary,stripe:l}}function oi(o,n,l={}){if(!n||!n.colors||!n.shape)throw new Error("课表图片主题未解析");let c=n.colors,d=n.shape,k=l.now instanceof Date?l.now:new Date,C=1960,A=40,x=136,S=C-A*2,f=A+24,y=64,z=8,E=f+y+12,h=A+S-24,b=(h-E-z*6)/7,v=x+88,g=108,_=102,T=v+g*12-x+24,L=o.courses.filter(at=>!at.arrangements.length).map(at=>at.name),F=ri(L.join("、"),92),I=F.length?74+F.length*27:44,D=x+T+I,W=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],H=d.serif?"Georgia,Noto Serif SC,Songti SC,STSong,SimSun,serif":"Microsoft YaHei,Segoe UI,sans-serif",et="Microsoft YaHei,Segoe UI,sans-serif",pt=["soft","warm","neu"].includes(d.shadow)?' filter="url(#schedule-frame-shadow)"':"",mt=["soft","warm","neu"].includes(d.shadow)?' filter="url(#schedule-card-shadow)"':"",G=[`<svg xmlns="http://www.w3.org/2000/svg" width="${C}" height="${D}" viewBox="0 0 ${C} ${D}">`,"<defs>",`<filter id="schedule-frame-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="${n.dark?10:7}" stdDeviation="${n.dark?16:11}" flood-color="${n.dark?"#000000":c.text}" flood-opacity="${n.dark?.48:.1}"/></filter>`,`<filter id="schedule-card-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="${n.dark?"#000000":c.text}" flood-opacity="${n.dark?.34:.1}"/></filter>`,"</defs>",`<rect width="100%" height="100%" fill="${c.bg}"/>`,`<rect x="${A}" y="32" width="142" height="36" rx="${d.headerRadius}" fill="${c.primary}"/>`,`<text x="${A+71}" y="56" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="700" font-family="${et}">SCU URP++</text>`,`<text x="${A}" y="106" fill="${c.text}" font-size="36" font-weight="700" font-family="${H}">${Z(o.semester.label)}课表</text>`,`<text x="${C-A}" y="54" text-anchor="end" fill="${c.secondary}" font-size="16" font-family="${et}">${Z(n.label)}</text>`,`<text x="${C-A}" y="83" text-anchor="end" fill="${c.muted}" font-size="14" font-family="${et}">${Z(k.toLocaleString("zh-CN",{hour12:!1}))}</text>`];d.shadow==="hard"&&G.push(`<rect x="${A+8}" y="${x+8}" width="${S}" height="${T}" fill="#000000"/>`),G.push(`<rect x="${A}" y="${x}" width="${S}" height="${T}" rx="${d.frameRadius}" fill="${c.surface}" stroke="${d.shadow==="hard"?"#000000":c.border}" stroke-width="${d.frameStroke}"${pt}/>`),W.forEach((at,Q)=>{let lt=E+Q*(b+z);G.push(`<rect x="${lt}" y="${x+22}" width="${b}" height="48" rx="${d.headerRadius}" fill="${c.input}" stroke="${c.border}" stroke-width="${d.frameStroke?1:0}"/>`,`<text x="${lt+b/2}" y="${x+53}" text-anchor="middle" fill="${c.secondary}" font-size="17" font-weight="600" font-family="${et}">${at}</text>`)});for(let at=1;at<=12;at+=1){let Q=v+(at-1)*g;G.push(`<rect x="${f}" y="${Q}" width="${y}" height="${_}" rx="${d.gridRadius}" fill="${c.input}" stroke="${c.border}" stroke-width="${d.frameStroke?1:0}"/>`,`<text x="${f+y/2}" y="${Q+_/2+6}" text-anchor="middle" fill="${c.muted}" font-size="16" font-weight="600" font-family="${et}">${at}</text>`),W.forEach((lt,rt)=>{let it=E+rt*(b+z);G.push(`<rect x="${it}" y="${Q}" width="${b}" height="${_}" rx="${d.gridRadius}" fill="${c.input}" stroke="${c.border}" stroke-width="${d.frameStroke?1:0}"/>`)})}[4,9].forEach(at=>{let Q=v+at*g-3;G.push(`<line x1="${E}" y1="${Q}" x2="${h}" y2="${Q}" stroke="${c.primary}" stroke-opacity=".42" stroke-width="2" stroke-dasharray="10 9"/>`)});for(let at=1;at<=7;at+=1)ti(ei(o).filter(lt=>lt.day===at)).forEach((lt,rt)=>{let it=b/lt.laneCount,gt=E+(at-1)*(b+z)+lt.lane*it,X=v+(lt.startSection-1)*g,ct=it,kt=Math.max(_,(lt.endSection-lt.startSection)*g+_),wt=nd(n,lt.course.name),Ct="course-clip-"+at+"-"+rt,N=Math.max(1,Math.floor((kt-18)/23)),J=ai({name:lt.course.name,teacher:lt.course.teacher,weekDescription:lt.arrangement.weekDescription,startSection:lt.startSection,endSection:lt.endSection,campus:lt.arrangement.campus,building:lt.arrangement.building,classroom:lt.arrangement.classroom},Math.floor((ct-22)/16),N);G.push(`<clipPath id="${Ct}"><rect x="${gt+11}" y="${X+8}" width="${Math.max(10,ct-22)}" height="${Math.max(18,kt-16)}" rx="${Math.max(0,d.cardRadius-5)}"/></clipPath>`,`<rect data-course-card="1" data-day="${at}" data-start="${lt.startSection}" data-end="${lt.endSection}" x="${gt}" y="${X}" width="${ct}" height="${kt}" rx="${d.cardRadius}" fill="${wt.fill}" stroke="${wt.stroke}" stroke-width="${d.cardStroke}"${mt}/>`),n.skin==="brutal"&&G.push(`<path d="M ${gt+ct-4} ${X+4} V ${X+kt-4} H ${gt+4}" fill="none" stroke="#000000" stroke-opacity=".28" stroke-width="5"/>`),n.skin==="editorial"&&G.push(`<rect x="${gt}" y="${X}" width="6" height="${kt}" fill="${wt.stripe}"/>`),n.skin==="neu"&&G.push(`<path d="M ${gt+d.cardRadius} ${X+1} H ${gt+ct-d.cardRadius}" stroke="#FFFFFF" stroke-opacity=".32" stroke-width="2"/>`),G.push('<g clip-path="url(#'+Ct+')">'),J.forEach((tt,ht)=>{let bt=tt.kind==="title";G.push(`<text data-kind="${tt.kind}" x="${gt+14}" y="${X+28+ht*23}" fill="${bt?wt.text:wt.secondary}" font-size="${bt?16:13}" font-weight="${bt?700:500}" font-family="${bt&&d.serif?H:et}">${Z(tt.text)}</text>`)}),G.push("</g>")});let V=x+T+30;return F.length?(G.push(`<text x="${A}" y="${V}" fill="${c.secondary}" font-size="15" font-weight="700" font-family="${et}">未排定时间的课程</text>`),F.forEach((at,Q)=>G.push(`<text x="${A}" y="${V+29+Q*27}" fill="${c.muted}" font-size="14" font-family="${et}">${Z(at)}</text>`))):G.push(`<text x="${A}" y="${V}" fill="${c.muted}" font-size="14" font-family="${et}">由 SCU URP++ 基于结构化课表数据生成</text>`),G.push("</svg>"),{svg:G.join(""),width:C,height:D,background:c.bg,theme:n}}function pd(o,n,l={}){let c=[],d=l.json||null,k=l.ics||null,C=o==="ics"?n.courses.filter(A=>!A.arrangements.length).length:0;return C&&c.push(C+" 门未排定时间的课程未写入日历"),d&&d.unscheduledCourses&&c.push(d.unscheduledCourses+" 门未排定时间的课程未写入 JSON"),d&&d.missingWeeks&&c.push(d.missingWeeks+" 个上课安排缺少周次"),d&&d.invalidArrangements&&c.push(d.invalidArrangements+" 个上课安排缺少日期或节次"),k&&k.missingWeeks&&c.push(k.missingWeeks+" 个上课安排缺少周次"),k&&k.missingTimes&&c.push(k.missingTimes+" 个上课安排缺少节次时间"),c}function va(o,n,l,c,d){return`<button type="button" class="urppp-export-option" role="menuitem" data-export-type="${o}"${d?" disabled":""}><i class="fa ${n}" aria-hidden="true"></i><span><strong>${l}</strong><small>${c}</small></span></button>`}function ni(o){let{document:n,window:l,ensureStyles:c,loadData:d,exportJson:k,exportIcs:C,exportPng:A,showToast:x,nativePageUrl:S,navigate:f,logger:y=console}=o;function z(g){g&&(g.classList.remove("open"),g.querySelector(".urppp-export-trigger")?.setAttribute("aria-expanded","false"))}function E(){l.__urpppExportDismissBound||(l.__urpppExportDismissBound=!0,n.addEventListener("click",g=>{n.querySelectorAll(".urppp-export-wrap.open").forEach(_=>{_.contains(g.target)||z(_)})},!0),n.addEventListener("keydown",g=>{g.key==="Escape"&&n.querySelectorAll(".urppp-export-wrap.open").forEach(z)}))}async function h(g,_,P,T){if(T&&T.disabled)return;let L=T&&T.innerHTML;try{if(T&&(T.disabled=!0,T.innerHTML='<i class="fa fa-spinner fa-spin"></i> 准备中'),g==="pdf"){if(typeof P!="function")throw new Error("当前页面不提供原生 PDF 导出");await P();return}let F=await d(_),I={};if(g==="json")I.json=await k(F);else if(g==="ics")I.ics=await C(F);else if(g==="png")await A(F);else throw new Error("未知导出格式");let D=pd(g,F,I);x("课表已导出："+g.toUpperCase()+(D.length?"；"+D.join("，"):""))}catch(F){if(F&&F.message==="已取消导出")return;y.warn("[URP++] schedule export",F),x(F&&F.message||String(F),!0)}finally{T&&(T.disabled=!1,T.innerHTML=L)}}function b(g={}){c();let _=g.source||"native",P=g.pdfHandler,T=typeof P=="function",L=n.createElement("span"),F=_==="native"?"导出课表":"导出";L.className="urppp-export-wrap",L.innerHTML=`<button type="button" class="urppp-export-trigger" aria-haspopup="menu" aria-expanded="false" title="导出课表"><i class="fa fa-cloud-download" aria-hidden="true"></i><span>${F}</span><i class="fa fa-angle-down" aria-hidden="true"></i></button><div class="urppp-export-menu" role="menu">${va("ics","fa-calendar","ICS 日历","导入系统日历或日历应用",!1)}${va("json","fa-code","JSON 数据","兼容小爱课程导入，可自定义格式",!1)}${va("png","fa-image","PNG 图片","完整学期课表高清图片",!1)}${va("pdf","fa-file-pdf-o","PDF",T?"使用教务系统原生导出":"仅原教务课表页面可用",!T)}${T?"":'<div class="urppp-export-guide">PDF 依赖原教务课表页面。<button type="button" data-export-native="1">前往本学期课表</button></div>'}</div>`;let I=L.querySelector(".urppp-export-trigger");I.addEventListener("click",W=>{W.preventDefault(),W.stopPropagation();let H=!L.classList.contains("open");n.querySelectorAll(".urppp-export-wrap.open").forEach(z),L.classList.toggle("open",H),I.setAttribute("aria-expanded",H?"true":"false")}),L.querySelectorAll("[data-export-type]:not(:disabled)").forEach(W=>{W.addEventListener("click",()=>{z(L),h(W.getAttribute("data-export-type"),_,P,I)})});let D=L.querySelector("[data-export-native]");return D&&D.addEventListener("click",()=>f(S)),E(),L}function v(g){(g&&g.querySelectorAll?g:n).querySelectorAll("[data-schedule-export-host]").forEach(P=>{P.querySelector(".urppp-export-wrap")||P.appendChild(b({source:P.getAttribute("data-schedule-export-host")||"clean"}))})}return{bindHosts:v,closeMenu:z,createMenu:b,run:h}}function pi(o){let n=l=>{o.querySelectorAll(".urppp-set-tab").forEach(c=>{let d=c.dataset.tab===l;c.classList.toggle("ac",d),c.setAttribute("aria-selected",d?"true":"false")}),o.querySelectorAll(".urppp-set-pane").forEach(c=>{c.classList.toggle("ac",c.dataset.pane===l)});try{let c=o.querySelector(".urppp-set-body");c&&(c.scrollTop=0)}catch{}};return o.querySelectorAll(".urppp-set-tab").forEach(l=>{l.addEventListener("click",()=>n(l.dataset.tab))}),o.__urpppSwitchTab=n,n}function ii(o){let{document:n,ensurePanel:l,syncPanel:c,refreshUpdateStatus:d,defaultTab:k="theme"}=o;function C(){l();let x=n.getElementById("urppp-settings-panel"),S=n.getElementById("urppp-settings-mask");if(!x||!S)return!1;c();try{d()}catch{}try{x.__urpppSwitchTab&&x.__urpppSwitchTab(k)}catch{}S.classList.remove("open"),x.classList.remove("open"),x.offsetWidth,S.classList.add("open"),x.classList.add("open");try{let f=x.querySelector(".urppp-set-body");f&&(f.scrollTop=0)}catch{}return!0}function A(){let x=n.getElementById("urppp-settings-panel"),S=n.getElementById("urppp-settings-mask");x&&x.classList.remove("open"),S&&S.classList.remove("open")}return{close:A,open:C}}function si(o){let{logoData:n,repositoryUrl:l,version:c}=o;return['<div class="urppp-set-head">','  <div class="urppp-set-title">设置</div>','  <button type="button" class="urppp-set-close" id="urppp-set-close" aria-label="关闭">×</button>',"</div>",'<div class="urppp-set-tabs" role="tablist">','  <button type="button" class="urppp-set-tab ac" data-tab="theme" role="tab" aria-selected="true">主题设置</button>','  <button type="button" class="urppp-set-tab" data-tab="skin" role="tab" aria-selected="false">主题选择</button>','  <button type="button" class="urppp-set-tab" data-tab="system" role="tab" aria-selected="false">系统设置</button>','  <button type="button" class="urppp-set-tab" data-tab="about" role="tab" aria-selected="false">关于</button>',"</div>",'<div class="urppp-set-body">','  <div class="urppp-set-pane ac" data-pane="theme">','    <section class="urppp-set-sec">',"      <h3>主题模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-modes">','        <button type="button" class="urppp-set-mode" data-theme="default">简约白</button>','        <button type="button" class="urppp-set-mode" data-theme="dark">深邃暗</button>','        <button type="button" class="urppp-set-mode" data-theme="scu-red">动态配色</button>',"      </div>",'      <div class="urppp-set-follow-row">','        <button type="button" class="urppp-set-follow" id="urppp-set-follow" aria-pressed="false">跟随系统：关</button>','        <button type="button" class="urppp-set-follow" id="urppp-set-follow-dynamic" aria-pressed="false">浅色用动态配色：关</button>',"      </div>",'      <button type="button" class="urppp-set-follow" id="urppp-set-clean-default" aria-pressed="false" style="margin-top:12px;width:100%">默认进入清爽模式：关</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-clean-analysis" aria-pressed="false" style="margin-top:12px;width:100%">清爽成绩分析展示：选项卡</button>','      <button type="button" class="urppp-set-follow" id="urppp-set-apple-edge" aria-pressed="true" style="margin-top:12px;width:100%">类Apple边缘线条：开</button>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-dynamic">',"      <h3>种子色</h3>",'      <p class="urppp-set-tip">选一个颜色，自动生成背景、卡片、强调色等多套方案</p>','      <div class="urppp-set-presets" id="urppp-set-presets"></div>','      <div class="urppp-set-custom">','        <input type="color" id="urppp-set-color" value="#B53434" />','        <input type="text" id="urppp-set-hex" maxlength="7" value="#B53434" spellcheck="false" />','        <button type="button" class="urppp-set-btn" id="urppp-set-gen">生成方案</button>','        <button type="button" class="urppp-set-btn ghost" id="urppp-set-save">存为预设</button>',"      </div>",'      <h3 style="margin-top:16px">配色方案</h3>','      <div class="urppp-set-schemes" id="urppp-set-schemes"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-brutal" style="display:none">',"      <h3>高对比配色</h3>",'      <p class="urppp-set-tip">默认圆点使用高能粉；选择一种备用配色后，可由左上第三个圆点快速切换。</p>','      <div class="urppp-set-schemes" id="urppp-set-brutal-palettes"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="skin">','    <section class="urppp-set-sec">',"      <h3>界面风格</h3>",'      <p class="urppp-set-tip">在同一布局上切换视觉气质。因适配规模较大，仅保证清爽模式的完整适配，如有影响请使用默认类Apple风格并选择性开启边缘线条。</p>','      <div class="urppp-theme-store-bar"><button type="button" class="urppp-set-btn ghost" id="urppp-theme-store">主题商店</button></div>','      <div id="urppp-theme-store-inline" class="urppp-store-inline" style="display:none"></div>','      <div class="urppp-skin-list" id="urppp-skin-list"></div>',"    </section>","  </div>",'  <div class="urppp-set-pane" data-pane="system">','    <section class="urppp-set-sec" id="urppp-set-privacy">',"      <h3>隐私模式</h3>",'      <div class="urppp-set-modes" id="urppp-set-privacy-modes">','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="off">关闭</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="one">一键隐私</button>','        <button type="button" class="urppp-set-follow urppp-privacy-mode" data-privacy-mode="custom">自定义</button>',"      </div>",'      <div class="urppp-privacy-groups" id="urppp-set-privacy-custom">','        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">身份信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-identity" type="checkbox" data-privacy-field="identity" aria-label="隐藏学号和证件"><label for="urppp-privacy-identity">学号/证件</label><input class="urppp-feature-input" data-privacy-value="identity" maxlength="40" aria-label="学号和证件替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-organization" type="checkbox" data-privacy-field="organization" aria-label="隐藏学院和专业"><label for="urppp-privacy-organization">学院/专业</label><input class="urppp-feature-input" data-privacy-value="organization" maxlength="40" aria-label="学院和专业替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-contact" type="checkbox" data-privacy-field="contact" aria-label="隐藏联系和个人信息"><label for="urppp-privacy-contact">联系/个人信息</label><input class="urppp-feature-input" data-privacy-value="contact" maxlength="40" aria-label="联系和个人信息替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">学业信息</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-grade" type="checkbox" data-privacy-field="grade" aria-label="隐藏成绩"><label for="urppp-privacy-grade">成绩</label><input class="urppp-feature-input" data-privacy-value="grade" maxlength="40" aria-label="成绩替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-gpa" type="checkbox" data-privacy-field="gpa" aria-label="隐藏绩点"><label for="urppp-privacy-gpa">绩点</label><input class="urppp-feature-input" data-privacy-value="gpa" maxlength="40" aria-label="绩点替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-credit" type="checkbox" data-privacy-field="credit" aria-label="隐藏学分"><label for="urppp-privacy-credit">学分</label><input class="urppp-feature-input" data-privacy-value="credit" maxlength="40" aria-label="学分替换内容"></div>',"          </div>","        </div>",'        <div class="urppp-privacy-group">','          <div class="urppp-privacy-group-title">页面内容</div>','          <div class="urppp-privacy-group-fields">','            <div class="urppp-privacy-field"><input id="urppp-privacy-other" type="checkbox" data-privacy-field="other" aria-label="隐藏其他数据"><label for="urppp-privacy-other">其他数据</label><input class="urppp-feature-input" data-privacy-value="other" maxlength="40" aria-label="其他数据替换内容"></div>','            <div class="urppp-privacy-field"><input id="urppp-privacy-schedule" type="checkbox" data-privacy-field="schedule" aria-label="隐藏课表"><label for="urppp-privacy-schedule">课表</label><input class="urppp-feature-input" data-privacy-value="schedule" maxlength="40" aria-label="课表替换内容"></div>','            <div class="urppp-privacy-field urppp-privacy-field-static"><input id="urppp-privacy-avatar" type="checkbox" data-privacy-field="avatar" aria-label="隐藏头像"><label for="urppp-privacy-avatar">头像</label><span class="urppp-privacy-note">使用统一遮罩</span></div>',"          </div>","        </div>","      </div>",'      <div class="urppp-direct-edit-control">',"        <div><strong>自由修改显示数据</strong><span>开启后，直接点击首页或清爽模式中带标记的数据进行修改</span></div>",'        <button type="button" class="urppp-set-follow" id="urppp-set-direct-edit-toggle" aria-pressed="false">页面内修改：关</button>',"      </div>","    </section>",'    <section class="urppp-set-sec" id="urppp-set-identity">',"      <h3>自定义姓名与头像</h3>",'      <div class="urppp-identity-editor">','        <div class="urppp-identity-fields">','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-name-enabled"> 自定义姓名</label><input class="urppp-feature-input" id="urppp-set-custom-name" maxlength="40" placeholder="输入显示姓名"></div>','          <div class="urppp-feature-row"><label><input type="checkbox" id="urppp-set-avatar-enabled"> 自定义头像</label><input class="urppp-feature-input" id="urppp-set-custom-avatar-url" placeholder="https://... 图片地址"></div>','          <div class="urppp-feature-row"><label for="urppp-set-custom-avatar-file">本地图片</label><input class="urppp-feature-input" type="file" id="urppp-set-custom-avatar-file" accept="image/png,image/jpeg,image/webp,image/gif"></div>',"        </div>",'        <div class="urppp-identity-preview">','          <span class="urppp-identity-preview-label">头像预览</span>','          <div class="urppp-avatar-preview-shell"><span>未设置</span><img class="urppp-avatar-preview" id="urppp-set-avatar-preview" alt="自定义头像预览"></div>',"        </div>","      </div>",'      <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-privacy-save">保存隐私与显示设置</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-avatar-clear">清除自定义头像</button></div>','      <div class="urppp-set-tip" id="urppp-set-privacy-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-json-export">',"      <h3>JSON 导出格式</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-json-custom" aria-pressed="false" style="width:100%">自定义 JSON：关</button>','      <div class="urppp-json-mapping-editor" id="urppp-set-json-editor">','        <label for="urppp-set-json-mapping">字段映射</label>','        <textarea id="urppp-set-json-mapping" spellcheck="false" aria-label="自定义 JSON 字段映射"></textarea>','        <p class="urppp-set-tip">源字段包括 name、teacher、position、day、sections、weeks、code、credit、campus、building、classroom、weekList 等；目标值支持 data.courses 形式的嵌套路径。</p>','        <div class="urppp-feature-actions"><button type="button" class="urppp-set-btn" id="urppp-set-json-save">保存映射</button><button type="button" class="urppp-set-btn ghost" id="urppp-set-json-reset">恢复默认映射</button></div>',"      </div>",'      <div class="urppp-set-tip" id="urppp-set-json-status" style="margin-top:8px"></div>',"    </section>",'    <section class="urppp-set-sec" id="urppp-set-update">',"      <h3>更新</h3>",'      <button type="button" class="urppp-set-follow" id="urppp-set-auto-update" aria-pressed="false" style="width:100%">自动检测更新：关</button>','      <button type="button" class="urppp-set-btn" id="urppp-set-check-update" style="margin-top:12px;width:100%">检查更新</button>','      <div id="urppp-set-update-status" class="urppp-set-tip" style="margin-top:8px"></div>',"    </section>",'    <div id="urppp-set-assist-slot"></div>',"  </div>",'  <div class="urppp-set-pane" data-pane="about">','    <div class="urppp-about">','      <img class="urppp-about-logo" id="urppp-about-logo" src="'+n+'" alt="SCU URP++" referrerpolicy="no-referrer" />','      <a class="urppp-about-ver" id="urppp-about-ver" href="'+l+'" target="_blank" rel="noopener noreferrer">SCU URP++ v'+c+"</a>",'      <p class="urppp-about-author">作者：Chao_Lan · Hanako</p>','      <p class="urppp-about-contact">QQ：2718748334</p>',`      <p class="urppp-about-msg">有任何问题欢迎及时反馈！

<a class="urppp-about-poem-link" href="https://music.163.com/#/song?id=1338064727" target="_blank" rel="noopener noreferrer">《在星星峡遇暴风雨》</a>
刘年
在星星峡，穿过大漠，九死一生的玄奘
遇到了第一个活人
这位高僧，忍不住抱着对方，痛哭流涕
也是在星星峡，风，抱着我不放
沙子在咕咕地喝水
喝饱水的沙子，黄豆一样膨胀
焉支山上，那弯彩虹的出现与消失，意义重大
我认为，它是人生的真相</p>`,"    </div>","  </div>","</div>"].join("")}var re="urppp_plugin_",id="1.0.0";function Mo({GM:o,doc:n,hostInfo:l,uiDeps:c}){let{getValue:d=()=>null,setValue:k=()=>{},xmlHttp:C,addStyle:A}=o||{},x=(typeof c=="function"?c:c&&c.openSubpanel)||null,S=new Map,f=new Map,y=new Map,z=[],E=null;function h(N,J){let tt=y.get(N);tt&&tt.forEach(ht=>{try{ht(J)}catch{}})}function b(N,J){return y.has(N)||y.set(N,new Set),y.get(N).add(J),()=>y.get(N).delete(J)}function v(N,J){return d(`${re}${N}_${J}`)}function g(N,J,tt){k(`${re}${N}_${J}`,tt)}function _(){return N=>({get:J=>v(N,J),set:(J,tt)=>g(N,J,tt),remove:J=>k(`${re}${N}_${J}`,void 0)})}function P(N,J={}){return new Promise((tt,ht)=>{if(typeof C!="function"){ht(new Error("GM_xmlhttpRequest 不可用（未授权跨域？）"));return}C({method:J.method||"GET",url:N,headers:J.headers||{},data:J.data,timeout:J.timeout||8e3,onload:bt=>bt.status>=200&&bt.status<300?tt(bt.responseText):ht(new Error(`HTTP ${bt.status}`)),onerror:()=>ht(new Error("网络错误")),ontimeout:()=>ht(new Error("超时(8s)"))})})}async function T(N,J){let tt=Array.isArray(N)?N:[N],ht=[];for(let bt=0;bt<tt.length;bt+=1){let zt=tt[bt];J&&J({stage:"downloading",index:bt+1,total:tt.length,url:zt});try{let yt=await P(zt);return J&&J({stage:"downloaded",url:zt,size:yt.length}),yt}catch(yt){ht.push(`源${bt+1}(${L(zt)})失败: ${yt&&yt.message?yt.message:yt}`),J&&J({stage:"source_failed",index:bt+1,total:tt.length,error:yt&&yt.message?yt.message:yt})}}throw new Error("所有下载源失败 → "+ht.join(" ｜ "))}function L(N){try{return new URL(N).host}catch{return N}}function F(N){let J=String(N||"").match(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/);return J?N.replace(J[0],""):N}function I(N,J){try{let tt=F(N),ht=["GM_getValue","GM_setValue","GM_xmlhttpRequest","GM_registerMenuCommand","GM_addStyle","unsafeWindow"],bt=[typeof GM_getValue=="function"?GM_getValue:void 0,typeof GM_setValue=="function"?GM_setValue:void 0,typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:void 0,typeof GM_registerMenuCommand=="function"?GM_registerMenuCommand:void 0,typeof GM_addStyle=="function"?GM_addStyle:void 0,typeof unsafeWindow<"u"?unsafeWindow:null];return new Function(...ht,tt)(...bt),!0}catch(tt){return console.warn("[URP++ plugin] 注入失败",J,tt),!1}}function D(N,J){let tt=f.get(N);return tt?(tt.enabled=!!J,k(`${re}${N}_enabled`,tt.enabled),h(J?"enabled":"disabled",N),!0):!1}function W(N){let J=f.get(N);return!!J&&J.enabled}function H(N){if(!N||!N.id)return!1;if(S.has(N.id)&&S.get(N.id).__urpppRegistered)return!0;let J=Object.assign({type:"plugin"},N);J.__urpppRegistered=!0,S.set(N.id,J);let tt=f.get(N.id)||{loaded:!1,enabled:!1,version:N.version||""};return tt.version=J.version||tt.version,f.set(N.id,tt),h("registered",J.id),!0}function et(N){return S.get(N)||null}function pt(N){let J=[];for(let tt of S.values())(!N||tt.type===N)&&J.push(tt);return J}function mt(N){let J=f.get(N);return!!J&&J.loaded}async function G(N,J,tt){tt&&tt({stage:"start",id:N});let ht=Array.isArray(J)?J:J?[J]:rt(N),bt=await T(ht,tt);k(`${re}${N}_code`,bt),tt&&tt({stage:"injecting",id:N});let zt=I(bt,N),yt=f.get(N)||{loaded:!1,enabled:!1,version:""};return yt.loaded=zt,yt.enabled=zt,yt.code=bt,yt.version=yt.version||V(bt),f.set(N,yt),k(`${re}${N}_enabled`,zt),h("loaded",N),zt}function V(N){let J=String(N||"").match(/@version\s+(\S+)/);return J?J[1]:""}async function at(N,J,tt){let ht=Array.isArray(J)?J:J?[J]:rt(N),bt=await T(ht,tt);k(`${re}${N}_code`,bt);let zt=V(bt),yt=f.get(N)||{loaded:!1,enabled:!1,version:""};return yt.version=zt||yt.version,yt.code=bt,f.set(N,yt),h("updated",N),{ok:!0,version:zt||yt.version}}function Q(N){let J=d(`${re}${N}_code`);if(!J)return!1;let tt=f.get(N);if(tt&&tt.loaded)return!0;let ht=I(J,N),bt=f.get(N)||{loaded:!1,enabled:!1,version:V(J)};return bt.loaded=ht,bt.enabled=ht&&d(`${re}${N}_enabled`)!==!1,bt.code=J,f.set(N,bt),h("loaded",N),ht}function lt(N){let J=S.get(N);return S.delete(N),f.delete(N),k(`${re}${N}_enabled`,!1),h("unregistered",N),!!J}function rt(N){return N==="assist"?["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/plugins/urpppp.plugin.js","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/plugins/urpppp.plugin.js"]:[]}let it={protocolVersion:id,register:H,unregister:lt,get:et,list:pt,loaded:mt,isEnabled:W,enable:(N,J=!0)=>D(N,J),disable:N=>D(N,!1),install:G,update:at,bootFromCache:Q,storage:()=>d&&{get:N=>d(N),set:(N,J)=>k(N,J)},pluginStorage:N=>_()(N),request:P,addStyle:N=>{try{A&&A(N)}catch{}},log:(...N)=>{console.log("[URP++ plugin]",...N)},on:b,emit:h,hostInfo:Object.assign({name:"SCU URP++"},l||{}),getSubpanel:()=>x};try{window.__urpppPlugin=it}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppPlugin=it)}catch{}function gt(N){if(!N||!n||N.querySelector(".urppp-plugin-sec, .urpppp-entry-sec"))return;let J=n.createElement("section");J.className="urppp-set-sec urppp-plugin-sec",J.id="urppp-plugin-sec",J.innerHTML=`
      <h3>辅助插件</h3>
      <div class="urppp-plugin-status" id="urppp-plugin-status">检查中…</div>
      <div class="urppp-plugin-actions">
        <button type="button" class="urppp-set-btn" id="urppp-plugin-install">装载辅助插件</button>
        <button type="button" class="urppp-set-btn ghost" id="urppp-plugin-store">插件商店</button>
      </div>
      <div id="urppp-plugin-panels" style="margin-top:10px"></div>
      <div id="urppp-store-inline" class="urppp-store-inline" style="display:none"></div>
      <p class="urppp-set-tip" id="urppp-plugin-tip" style="margin-top:8px"></p>
    `,N.appendChild(J);let tt=J.querySelector("#urppp-plugin-status"),ht=J.querySelector("#urppp-plugin-install"),bt=J.querySelector("#urppp-plugin-store"),zt=J.querySelector("#urppp-plugin-panels"),yt=J.querySelector("#urppp-plugin-tip");function Ft(){let Pt=f.get("assist"),$t=S.has("assist");Pt&&Pt.loaded||$t?(tt.textContent=`辅助插件 v${Pt&&Pt.version?Pt.version:et("assist")&&et("assist").version||""} 已装载`,tt.className="urppp-plugin-status ok",ht.textContent="重新装载",ht.dataset.state="loaded",yt.textContent="已装载。下方为扩展入口。"):(tt.textContent=E||"未装载",tt.className=E?"urppp-plugin-status err":"urppp-plugin-status",ht.textContent="装载辅助插件",ht.dataset.state="notloaded",yt.textContent=E?"装载失败，可就近重试或放回本地安装。下方为装载/商店入口。":"点击装载后，主插件会下载并注入辅助插件（登录助手/评教/会话保持/2FA），无需再单独安装。"),zt.innerHTML="";let te=Ct();if(te&&Object.keys(te).length){let Fe=n.createElement("div");Fe.className="urppp-plugin-sub",Object.keys(te).forEach(ge=>{let Zt=n.createElement("button");Zt.type="button",Zt.className="urppp-set-btn ghost",Zt.textContent=te[ge].label||ge,Zt.addEventListener("click",()=>{try{te[ge]&&typeof te[ge].open=="function"?te[ge].open():x&&x(ge)}catch{}}),Fe.appendChild(Zt)}),zt.appendChild(Fe)}}ht.addEventListener("click",async()=>{ht.disabled=!0,ht.textContent="装载中…",tt.className="urppp-plugin-status",tt.textContent="正在开始装载…";try{if(await G("assist",null,$t=>{try{$t.stage==="downloading"?tt.textContent=`下载中… 源${$t.index}/${$t.total}（${L($t.url)}）`:$t.stage==="downloaded"?tt.textContent=`已下载（${$t.size} 字节），注入中…`:$t.stage==="source_failed"?tt.textContent=`源${$t.index}失败（${$t.error||""}），切换下一源…`:$t.stage==="injecting"?tt.textContent="注入中…":$t.stage==="start"&&(tt.textContent="正在开始装载…"),console.log("[URP++ plugin] assist 装载进度",$t)}catch{}}))E=null,tt.textContent="辅助插件已装载 v"+(et("assist")&&et("assist").version||""),console.log("[URP++ plugin] assist 装载成功");else throw new Error("注入失败")}catch(Pt){E="装载失败："+(Pt&&Pt.message?Pt.message:Pt),tt.textContent=E,tt.className="urppp-plugin-status err",console.warn("[URP++ plugin] assist 装载失败",Pt)}finally{ht.disabled=!1,Ft()}}),bt.addEventListener("click",()=>{x&&x("plugin-store")}),b("loaded",Pt=>{Pt==="assist"&&Ft()}),b("registered",Pt=>{Pt==="assist"&&Ft()}),b("unregistered",Pt=>{Pt==="assist"&&Ft()}),Ft()}function X(N){return String(N??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function ct(N){if(N){if(kt(),N.dataset.rendered==="1"){N.style.display=N.style.display==="none"?"":"none";return}N.dataset.rendered="1",N.innerHTML=`
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
      </div>`,N.querySelectorAll(".urppp-store-tab").forEach(J=>{J.addEventListener("click",()=>{N.querySelectorAll(".urppp-store-tab").forEach(ht=>ht.className="urppp-store-tab"),J.className="urppp-store-tab ac",N.querySelectorAll(".urppp-store-pane").forEach(ht=>ht.style.display="none");let tt=N.querySelector('.urppp-store-pane[data-pane="'+J.dataset.tab+'"]');tt&&(tt.style.display="")})}),wt(N.querySelector("#urppp-store-manage-list")),N.style.display=""}}function kt(){if(n.getElementById("urppp-store-style"))return;let N=n.createElement("style");N.id="urppp-store-style",N.textContent=`
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
    `,(n.head||n.documentElement).appendChild(N)}function wt(N){if(!N)return;N.innerHTML="";let J=Array.from(S.values());if(!J.length){N.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}J.forEach(tt=>{let ht=f.get(tt.id)||{},bt=n.createElement("div");bt.className="urppp-store-item";let zt=n.createElement("div");zt.className="urppp-store-info",zt.innerHTML="<strong>"+X(tt.name||tt.id)+'</strong><span class="urppp-store-ver">'+(tt.version?"v"+X(tt.version):"")+'</span><span class="urppp-store-state'+(ht.loaded?" ok":"")+'">'+(ht.loaded?"已装载":"未装载")+"</span>";let yt=n.createElement("div");yt.className="urppp-store-ops";let Ft=n.createElement("button");Ft.type="button",Ft.textContent="重新装载",Ft.addEventListener("click",async()=>{Ft.disabled=!0,Ft.textContent="装载中…";try{let $t=await G(tt.id,null);Ft.textContent=$t?"已装载":"装载失败",h("loaded",tt.id)}catch{Ft.textContent="装载失败"}setTimeout(()=>{Ft.disabled=!1,Ft.textContent="重新装载"},1400)});let Pt=n.createElement("button");Pt.type="button",Pt.className="danger",Pt.textContent="卸载",Pt.addEventListener("click",()=>{lt(tt.id),k(`${re}${tt.id}_code`,""),k(`${re}${tt.id}_enabled`,!1),h("unregistered",tt.id),wt(N)}),yt.appendChild(Ft),yt.appendChild(Pt),bt.appendChild(zt),bt.appendChild(yt),N.appendChild(bt)})}function Ct(){let N={};return S.forEach(J=>{if(J.subpanels&&typeof J.subpanels=="function"){let tt=J.subpanels();Object.keys(tt||{}).forEach(ht=>{N[ht]=tt[ht]})}else J.subpanels&&typeof J.subpanels=="object"&&Object.keys(J.subpanels).forEach(tt=>{N[tt]=J.subpanels[tt]})}),N}return{api:it,install:G,update:at,renderAssistUi:gt,openPluginStore:ct,bootFromCache:Q,register:H}}function li(o){let{document:n,getSettings:l,setSettings:c,validateMapping:d,defaultMapping:k,getRecoveryMessage:C=()=>""}=o;function A(f,y,z){let E=f&&f.querySelector("#urppp-set-json-status");E&&(E.textContent=y||"",E.classList.toggle("urppp-status-error",!!z),E.style.color=z?"var(--danger,#b91c1c)":"var(--text-muted)")}function x(f,y){if(!f)return;let z=l(),E=f.querySelector("#urppp-set-json-custom"),h=f.querySelector("#urppp-set-json-editor"),b=f.querySelector("#urppp-set-json-mapping");E&&(E.classList.toggle("ac",z.enabled),E.setAttribute("aria-pressed",z.enabled?"true":"false"),E.textContent="自定义 JSON："+(z.enabled?"开":"关")),h&&(h.style.display=z.enabled?"grid":"none"),b&&(y||!f.__urpppJsonMappingDirty&&n.activeElement!==b)&&(b.value=JSON.stringify(z.mapping,null,2),f.__urpppJsonMappingDirty=!1);let v=C();v&&A(f,v,!0)}function S(f){if(!f||f.__urpppJsonSettingsBound)return;f.__urpppJsonSettingsBound=!0;let y=f.querySelector("#urppp-set-json-custom"),z=f.querySelector("#urppp-set-json-mapping"),E=f.querySelector("#urppp-set-json-save"),h=f.querySelector("#urppp-set-json-reset");z&&z.addEventListener("input",()=>{f.__urpppJsonMappingDirty=!0}),y&&y.addEventListener("click",()=>{let b=l();b.enabled=!b.enabled;let v=!!f.__urpppJsonMappingDirty;c(b),x(f,!1);let g=b.enabled?"已启用自定义 JSON 格式":"已恢复小爱课程兼容格式";A(f,v?g+"；未保存草稿已保留":g)}),E&&E.addEventListener("click",()=>{try{let b=JSON.parse(String(z&&z.value||"").trim()),v=l();v.mapping=d(b),c(v),f.__urpppJsonMappingDirty=!1,x(f,!0),A(f,"自定义 JSON 映射已保存")}catch(b){A(f,b&&b.message||String(b),!0)}}),h&&h.addEventListener("click",()=>{let b=l();b.mapping=d(k),c(b),f.__urpppJsonMappingDirty=!1,x(f,!0),A(f,"已恢复默认字段映射")})}return{bind:S,setStatus:A,sync:x}}var $r="••••";var ci={name:{enabled:!1,replacement:"同学"},identity:{enabled:!0,replacement:"已隐藏"},organization:{enabled:!0,replacement:"已隐藏"},contact:{enabled:!0,replacement:"已隐藏"},grade:{enabled:!0,replacement:"已隐藏"},gpa:{enabled:!0,replacement:"••••"},credit:{enabled:!0,replacement:"••••"},other:{enabled:!0,replacement:"已隐藏"},avatar:{enabled:!0,replacement:""},schedule:{enabled:!1,replacement:"课表已隐藏"}},sd=["completedCourses","failedCourses","majorGpa","majorPlan","remainingCourses","passingTotalCredit","passingAvgScore","passingAvgGpa","passingRequiredCredit","passingRequiredAvg","passingRequiredGpa","schemeTotalCredit","schemeAvgScore","schemeAvgGpa","schemeRequiredCredit","schemeRequiredAvg","schemeRequiredGpa"];function Io(o){let n=o&&typeof o=="object"?o:{},l=["off","one","custom"].includes(n.mode)?n.mode:"off",c={},d=n.fields&&typeof n.fields=="object"?n.fields:{},k=d.score&&typeof d.score=="object"?d.score:null;Object.keys(ci).forEach(f=>{let y=ci[f],z=["grade","gpa","credit"].includes(f)?k:null,E=f==="other"&&d.grade&&typeof d.grade=="object"?d.grade:null,h=d[f]&&typeof d[f]=="object"?d[f]:z||E||{};c[f]={enabled:f==="name"?!1:h.enabled==null?y.enabled:!!h.enabled,replacement:String(h.replacement==null?y.replacement:h.replacement).slice(0,80)}});let C=n.homepage&&typeof n.homepage=="object"?n.homepage:{},A=n.directEdit&&typeof n.directEdit=="object"?n.directEdit:C,x=A.values&&typeof A.values=="object"?A.values:{},S={};return sd.forEach(f=>{S[f]=String(x[f]==null?"":x[f]).trim().slice(0,80)}),{mode:l,mask:$r,fields:c,directEdit:{enabled:!!A.enabled,values:S}}}function Nr(o){let n=o&&typeof o=="object"?o:{},l=String(n.avatar||"").trim();return{nameEnabled:!!n.nameEnabled,name:String(n.name||"").trim().slice(0,40),avatarEnabled:!!n.avatarEnabled,avatar:l.length<=3145728?l:"",avatarName:String(n.avatarName||"").trim().slice(0,120)}}function lr(o){let n=String(o||"").trim();return n.length>3145728?"":/^(https?:\/\/|data:image\/(?:png|jpe?g|gif|webp);base64,)/i.test(n)?n:""}function ld(o,n=globalThis.FileReader){return new Promise((l,c)=>{if(!o||!/^image\/(png|jpeg|webp|gif)$/i.test(o.type||"")){c(new Error("请选择 PNG、JPG、WebP 或 GIF 图片"));return}if(o.size>2*1024*1024){c(new Error("本地头像不能超过 2MB"));return}let d=new n;d.onload=()=>l(String(d.result||"")),d.onerror=()=>c(new Error("读取头像失败")),d.readAsDataURL(o)})}function di(o){let{getPrivacySettings:n,setPrivacySettings:l,getCustomIdentity:c,setCustomIdentity:d,applyDisplay:k,refreshCleanDisplay:C,finishActiveDirectEdit:A,readAvatar:x=ld}=o;function S(h,b){let v=b.mode==="custom",g=h.querySelector(".urppp-direct-edit-control"),_=h.querySelector("#urppp-set-direct-edit-toggle");g&&(g.style.display=v?"flex":"none"),_&&(_.dataset.enabled=b.directEdit.enabled?"1":"0",_.classList.toggle("ac",b.directEdit.enabled),_.setAttribute("aria-pressed",b.directEdit.enabled?"true":"false"),_.textContent="页面内修改："+(b.directEdit.enabled?"开":"关"))}function f(h){if(!h)return;let b=n();h.querySelectorAll("[data-privacy-mode]").forEach(I=>{let D=I.getAttribute("data-privacy-mode")===b.mode;I.classList.toggle("ac",D),I.setAttribute("aria-pressed",D?"true":"false")});let v=h.querySelector("#urppp-set-privacy-custom");v&&(v.style.display=b.mode==="custom"?"grid":"none"),Object.keys(b.fields).forEach(I=>{let D=b.fields[I],W=h.querySelector('[data-privacy-field="'+I+'"]'),H=h.querySelector('[data-privacy-value="'+I+'"]');W&&(W.checked=!!D.enabled),H&&(H.value=D.replacement||"",H.disabled=!D.enabled)}),S(h,b);let g=c(),_=h.querySelector("#urppp-set-name-enabled"),P=h.querySelector("#urppp-set-custom-name"),T=h.querySelector("#urppp-set-avatar-enabled"),L=h.querySelector("#urppp-set-custom-avatar-url"),F=h.querySelector("#urppp-set-avatar-preview");if(_&&(_.checked=g.nameEnabled),P&&(P.value=g.name,P.disabled=!g.nameEnabled),T&&(T.checked=g.avatarEnabled),L&&(L.value=/^data:image\//i.test(g.avatar)?"":g.avatar,L.disabled=!g.avatarEnabled),h.__urpppAvatarSource=g.avatar,F){let I=lr(g.avatar);F.style.display=I?"block":"none",I?F.src=I:F.removeAttribute("src")}}function y(h){let b=n();Object.keys(b.fields).forEach(g=>{let _=h.querySelector('[data-privacy-field="'+g+'"]'),P=h.querySelector('[data-privacy-value="'+g+'"]');_&&(b.fields[g].enabled=!!_.checked),P&&(b.fields[g].replacement=String(P.value||"").trim().slice(0,80))});let v=h.querySelector("#urppp-set-direct-edit-toggle");return b.directEdit.enabled=!!(v&&v.dataset.enabled==="1"),b}function z(h,b,v){let g=h&&h.querySelector("#urppp-set-privacy-status");g&&(g.textContent=b||"",g.style.color=v?"#b91c1c":"var(--text-muted)")}function E(h){if(!h||h.__urpppPrivacyBound)return;h.__urpppPrivacyBound=!0,h.querySelectorAll("[data-privacy-mode]").forEach(L=>{L.addEventListener("click",()=>{let F=n();F.mode=L.getAttribute("data-privacy-mode")||"off",l(F),f(h),k()})}),h.querySelectorAll("[data-privacy-field]").forEach(L=>{L.addEventListener("change",()=>{let F=L.getAttribute("data-privacy-field"),I=h.querySelector('[data-privacy-value="'+F+'"]');I&&(I.disabled=!L.checked)})});let b=h.querySelector("#urppp-set-direct-edit-toggle");b&&b.addEventListener("click",()=>{let L=b.dataset.enabled!=="1";b.dataset.enabled=L?"1":"0",b.classList.toggle("ac",L),b.setAttribute("aria-pressed",L?"true":"false"),b.textContent="页面内修改："+(L?"开":"关")});let v=h.querySelector("#urppp-set-name-enabled"),g=h.querySelector("#urppp-set-avatar-enabled");v&&v.addEventListener("change",()=>{let L=h.querySelector("#urppp-set-custom-name");L&&(L.disabled=!v.checked)}),g&&g.addEventListener("change",()=>{let L=h.querySelector("#urppp-set-custom-avatar-url");L&&(L.disabled=!g.checked)});let _=h.querySelector("#urppp-set-custom-avatar-file");_&&_.addEventListener("change",async()=>{try{let L=await x(_.files&&_.files[0]);h.__urpppAvatarSource=L;let F=h.querySelector("#urppp-set-avatar-preview");F&&(F.src=L,F.style.display="block"),g&&(g.checked=!0),z(h,"本地头像已读取，点击保存后生效")}catch(L){z(h,L&&L.message||String(L),!0)}});let P=h.querySelector("#urppp-set-avatar-clear");P&&P.addEventListener("click",()=>{try{let L=c();L.avatarEnabled=!1,L.avatar="",L.avatarName="",d(L),h.__urpppAvatarSource="",f(h),k(),C(),z(h,"已清除自定义头像")}catch(L){z(h,L&&L.message||"清除自定义头像失败",!0)}});let T=h.querySelector("#urppp-set-privacy-save");T&&T.addEventListener("click",()=>{let L=n(),F=c();try{let I=y(h),D=h.querySelector("#urppp-set-custom-avatar-url"),H=String(D&&D.value||"").trim()||h.__urpppAvatarSource||"",et=Nr({nameEnabled:!!(v&&v.checked),name:String(h.querySelector("#urppp-set-custom-name")?.value||"").trim(),avatarEnabled:!!(g&&g.checked),avatar:H,avatarName:F.avatarName});if(et.avatarEnabled&&!lr(et.avatar))throw new Error("头像地址必须是 http(s) 图片或已选择的本地图片");L.directEdit.enabled&&!I.directEdit.enabled&&A(!0);try{d(et),l(I)}catch(pt){try{d(F),l(L)}catch{}throw pt}k(),C(),f(h),z(h,"隐私与显示设置已保存")}catch(I){z(h,I&&I.message||String(I),!0)}})}return{bind:E,collect:y,setStatus:z,sync:f}}function ui(o){let{document:n,theme:l,preferences:c,accent:d,syncPanel:k}=o;function C(){l.getFollowSystem()?l.apply(l.resolveFollowTheme(),{system:!0}):l.apply("scu-red",{manual:!0})}function A(S,f){let y=S.querySelector("#urppp-set-schemes");if(!y)return;let z=d.getScheme();y.innerHTML="",d.listSchemePreviews(f).forEach(E=>{let h=n.createElement("button");h.type="button",h.className="urppp-set-scheme"+(E.id===z?" ac":""),h.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+E.bg+'"></span>','  <span style="background:'+E.surface+";border-color:"+E.border+'"></span>','  <span style="background:'+E.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+E.name+"</strong>","  <em>"+E.desc+"</em>","</div>"].join(""),h.addEventListener("click",()=>{d.setAccent(f),d.setScheme(E.id),C(),k()}),y.appendChild(h)})}function x(S){S.querySelectorAll(".urppp-set-mode").forEach(L=>{L.addEventListener("click",()=>{l.isModeAvailable(L.dataset.theme)&&(l.apply(L.dataset.theme,{manual:!0}),k())})});let f=S.querySelector("#urppp-set-follow");f&&f.addEventListener("click",()=>{if(!l.supportsDark())return;let L=!l.getFollowSystem();l.setFollowSystem(L),L?l.apply(l.resolveFollowTheme(),{system:!0}):l.apply(l.getCurrent(),{manual:!0}),k(),l.syncNavbar()});let y=S.querySelector("#urppp-set-follow-dynamic");y&&y.addEventListener("click",()=>{l.supportsDynamic()&&(l.getFollowSystem()?l.setFollowDynamic(!l.getFollowDynamic()):(l.setFollowSystem(!0),l.setFollowDynamic(!0)),l.apply(l.resolveFollowTheme(),{system:!0}),k(),l.syncNavbar())});let z=S.querySelector("#urppp-set-clean-default");z&&z.addEventListener("click",()=>{c.setCleanDefault(!c.getCleanDefault()),k()});let E=S.querySelector("#urppp-set-clean-analysis");E&&E.addEventListener("click",()=>{let L=c.getCleanAnalysis()==="direct";c.setCleanAnalysis(L?"tab":"direct"),k()});let h=S.querySelector("#urppp-set-apple-edge");h&&h.addEventListener("click",()=>{c.setAppleEdge(!c.getAppleEdge());try{c.applySkin()}catch{}k()});let b=S.querySelector("#urppp-set-auto-update");b&&b.addEventListener("click",()=>{c.setAutoUpdate(!c.getAutoUpdate()),k()});let v=S.querySelector("#urppp-set-check-update");v&&!v.__urpppBound&&(v.__urpppBound=!0,v.addEventListener("click",()=>{c.checkUpdates()}));let g=S.querySelector("#urppp-set-color"),_=S.querySelector("#urppp-set-hex");if(!g||!_)return;g.addEventListener("input",()=>{_.value=g.value.toUpperCase()}),_.addEventListener("change",()=>{let L=d.normalize(_.value);L&&(_.value=L,g.value=L)});let P=S.querySelector("#urppp-set-gen");P&&P.addEventListener("click",()=>{let L=d.normalize(_.value)||g.value;L&&(d.setAccent(d.normalize(L)),C(),k())});let T=S.querySelector("#urppp-set-save");T&&T.addEventListener("click",()=>{let L=d.normalize(_.value)||g.value;L&&(d.savePreset(L),d.setAccent(d.normalize(L)),C(),k())}),g.addEventListener("change",()=>{let L=d.normalize(g.value);L&&(_.value=L,A(S,L))})}return{bind:x,renderSchemeChoices:A}}function mi(o,n){let{seed:l,currentTheme:c,followSystem:d,skinId:k,darkSupported:C,dynamicSupported:A,fixedPalettes:x,followUseDynamic:S,cleanDefault:f,cleanAnalysis:y,appleEdge:z,autoUpdate:E,modeAvailability:h}=n,b=o.querySelector("#urppp-set-color"),v=o.querySelector("#urppp-set-hex");b&&(b.value=l),v&&(v.value=l),o.querySelectorAll(".urppp-set-mode").forEach(H=>{let et=H.dataset.theme,pt=h[et]!==!1,mt=!d&&et===c&&pt;H.disabled=!pt,H.classList.toggle("ac",mt),H.classList.toggle("urppp-dyn-disabled",!pt),H.setAttribute("aria-disabled",pt?"false":"true"),pt?H.removeAttribute("title"):H.title=et==="dark"?"当前界面风格不支持暗色模式":"当前界面风格不支持动态配色"});let g=o.querySelector("#urppp-set-follow");g&&(g.disabled=!C,g.classList.toggle("ac",d&&C),g.classList.toggle("urppp-dyn-disabled",!C),g.setAttribute("aria-pressed",d&&C?"true":"false"),g.textContent=d&&C?"跟随系统：开":"跟随系统：关",g.title=C?"":"当前界面风格不支持暗色模式");let _=o.querySelector("#urppp-set-follow-dynamic");_&&(_.classList.toggle("ac",S&&A),_.setAttribute("aria-pressed",S&&A?"true":"false"),_.textContent=S?"浅色用动态配色：开":"浅色用动态配色：关",_.disabled=!d||!A,_.classList.toggle("urppp-dyn-disabled",!A),_.style.opacity=A&&d?"1":"0.5",_.title=A?"":"当前界面风格不支持动态配色");let P=o.querySelector("#urppp-set-dynamic");P&&(P.style.display=A?"":"none",P.style.opacity="1",P.classList.toggle("urppp-dyn-disabled",!1),P.querySelectorAll("button, input, .urppp-set-scheme, .urppp-set-swatch").forEach(H=>{H.disabled=!1,H.classList.toggle("urppp-dyn-disabled",!1)}),P.querySelectorAll("h3, .urppp-set-tip, label").forEach(H=>{H.classList.toggle("urppp-dyn-disabled",!1)}));let T=o.querySelector("#urppp-set-brutal");T&&(T.style.display=x?"":"none");let L=o.querySelector("#urppp-set-clean-default");L&&(L.classList.toggle("ac",f),L.setAttribute("aria-pressed",f?"true":"false"),L.textContent=f?"默认进入清爽模式：开":"默认进入清爽模式：关");let F=o.querySelector("#urppp-set-clean-analysis");if(F){let H=y==="direct";F.classList.toggle("ac",H),F.setAttribute("aria-pressed",H?"true":"false"),F.textContent=H?"清爽成绩分析展示：直接显示":"清爽成绩分析展示：选项卡"}let I=o.querySelector("#urppp-set-apple-edge"),D=o.querySelector("#urppp-set-apple-edge-tip");if(I){let H=k==="apple";I.style.display=H?"":"none",D&&(D.style.display=H?"":"none"),H&&(I.classList.toggle("ac",z),I.setAttribute("aria-pressed",z?"true":"false"),I.textContent=z?"类Apple边缘线条：开":"类Apple边缘线条：关")}let W=o.querySelector("#urppp-set-auto-update");W&&(W.classList.toggle("ac",E),W.setAttribute("aria-pressed",E?"true":"false"),W.textContent=E?"自动检测更新：开":"自动检测更新：关")}function $o(o){let n=String(o||"").replace(/\s+/g,"");return/^[•·●○▪◆★\-–]$/.test(n)||/^\d{1,4}$/.test(n)}function cd(o){return/\d{4}[-/.年]\d{1,2}([-/.月]\d{1,2})?/.test(String(o||""))}function bi({pathname:o="",href:n="",title:l="",headingText:c=""}={}){return/courseSelectNotice|evaluationNotice|notice\/index/i.test(`${o} ${n}`)?!0:/评估公告|通知公告|选课公告|公告|通知/.test(`${l} ${c}`)}function No(o,{noticePage:n=!1}={}){if(!o)return!1;let c=(o.querySelector("thead")?.textContent||"").replace(/\s+/g,"");if(/标题/.test(c)&&/发布时间|发布日期|日期|时间/.test(c)||n&&/标题|公告|通知/.test(c)&&!/教室|教学楼|课程号|成绩|学号|座位数/.test(c))return!0;let d=o.querySelectorAll("tbody tr, tr"),k=0;if(d.forEach(A=>{let x=A.querySelectorAll("td");x.length<2||x.length>4||$o(x[0].textContent)&&A.querySelector("a")&&cd(A.textContent)&&(k+=1)}),k<1)return!1;if(n||k===d.length)return!0;let C=o.getAttribute("style")||"";return/dashed/i.test(C)||o.classList.contains("no-border-top")||!!o.getAttribute("width")}function hi(o,{noticePage:n=!1}={}){if(!o)return!0;if(o.classList?.contains("urppp-notice-table")||No(o,{noticePage:n}))return!1;let l=`${o.id||""} ${o.getAttribute("class")||""}`;if(/freeClassroom|courseTable|codeTable|jszhpjdf|score|grade|exam|drag|classroom/i.test(l)||o.querySelector('#tbodyFreeClassroom, tbody[id*="FreeClassroom"], tbody[id*="Classroom"], tbody[id*="course"], tbody[id*="Code"]'))return!0;let c=o.querySelector("tbody tr, tr");if(c&&c.querySelectorAll("td,th").length>=5)return!0;let k=(o.querySelector("thead")?.textContent||"").replace(/\s+/g,"");return!!(k&&(/校区|教学楼|教室|座位数|类型|课表|操作|课程号|课程名|成绩|学号|姓名|教师|周次|节次/.test(k)||/序号/.test(k)&&!/标题|公告|通知|发布时间/.test(k))||o.querySelector("a")&&/课表|教室信息|查看/.test(o.textContent||"")&&!n&&/座位数|教学楼|教室号|校区名/.test(o.textContent||""))}function fi({isNativePdfIsolationActive:o,isBusinessDataTable:n,documentRef:l=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,getComputedStyleRef:k=getComputedStyle}){function C(){o()||l.querySelectorAll("table.table, table.table-bordered, table.dataTable").forEach(x=>{if(!x||x.closest(".urppp-table-wrap")||x.id==="courseTable"||x.closest(".modal, .modal-dialog, .modal-content, .modal-body, #work_rest_schedule_modal")||x.classList.contains("urppp-wrs-table")||x.classList.contains("urppp-notice-table"))return;n(x);let S=x.parentElement;if(!S)return;let f=S.style?.overflow||k(S).overflow;if(S.id?.endsWith("_scroll")||f==="auto"||f==="scroll"){S.classList.add("urppp-scroll-table-host");return}let z=l.createElement("div");z.className="urppp-table-wrap",S.insertBefore(z,x),z.appendChild(x)})}function A(){let x=l.getElementById("page-content-template")||l.querySelector(".page-content")||l.body;if(!x)return;let S=c.__urpppTableObsRoot;if(c.__urpppTableObs&&S===x&&x.isConnected)return;c.__urpppTableObs&&c.__urpppTableObs.disconnect();let f=0,y=new d(()=>{clearTimeout(f),f=setTimeout(C,80)});y.observe(x,{childList:!0,subtree:!0}),c.__urpppTableObs=y,c.__urpppTableObsRoot=x}return{bindTableWrapObserver:A,wrapTables:C}}function gi(o){let n=String(o||"").trim().toLowerCase();if(!n||n==="transparent"||n==="inherit"||n==="initial")return!1;if(/#(?:f{3,6}|e[0-9a-f]{5}|d[89a-f][0-9a-f]{4}|c[89a-f][0-9a-f]{4})/i.test(n))return!0;let l=n.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);if(!l)return!1;let c=Number(l[1]),d=Number(l[2]),k=Number(l[3]);return(c+d+k)/3>=200}function dd(o){if(!o?.style)return;let n=o.getAttribute("style")||"";if(!n||!/background/i.test(n))return;let l=o.style.backgroundColor||o.style.background||"";(gi(l)||/background(-color|-image)?\s*:/i.test(n))&&(o.style.removeProperty("background"),o.style.removeProperty("background-color"),o.style.removeProperty("background-image")),["borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"].forEach(c=>{let d=o.style[c];!d||!gi(d)||o.style.removeProperty(c.replace(/[A-Z]/g,k=>`-${k.toLowerCase()}`))}),/border(-color)?\s*:/i.test(n)&&/#e6e6e6|#eee|#ddd|#ccc/i.test(n)&&(o.style.removeProperty("border-color"),o.style.removeProperty("border-top-color"),o.style.removeProperty("border-right-color"),o.style.removeProperty("border-bottom-color"),o.style.removeProperty("border-left-color"))}function xi({isNativePdfIsolationActive:o,documentRef:n=document,windowRef:l=window,MutationObserverRef:c=MutationObserver}){function d(){if(!o())try{let C=n.documentElement.classList.contains("urppp-theme-dark"),A=n.body?.classList.contains("urppp-dark");if(!C&&!A)return;n.querySelectorAll("table, table thead, table thead tr, table thead th, table thead td, table tbody, table tbody tr, table tbody td, table tbody th, .table-box, .table-box table, .table-box td, .table-box th").forEach(dd)}catch{}}function k(){[0,200,800,1600].forEach(C=>setTimeout(()=>{try{d()}catch{}},C));try{let C=n.querySelector(".page-content, #page-content-template, .main-content")||n.body;if(!C)return;let A=l.__urpppTableScrubObs;if(A&&A.root===C&&C.isConnected)return;A?.observer&&A.observer.disconnect();let x=new c(()=>{clearTimeout(l.__urpppTableScrubTimer),l.__urpppTableScrubTimer=setTimeout(()=>{try{d()}catch{}},120)});x.observe(C,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),l.__urpppTableScrubObs={root:C,observer:x}}catch{}}return{scheduleScrubTableInlineBg:k,scrubTableHeaderInlineBg:d}}function yi({beautifyPagebar:o,documentRef:n=document,windowRef:l=window,MutationObserverRef:c=MutationObserver,setTimeoutRef:d=setTimeout,clearTimeoutRef:k=clearTimeout}){function C(){o(),n.querySelectorAll("#urppagebar").forEach(x=>{if(x.__urpppPagebarObs)return;x.__urpppPagebarObs=!0,new c(()=>{k(l.__urpppPagebarTimer),l.__urpppPagebarTimer=d(()=>o(x.parentElement||n),150)}).observe(x,{childList:!0,subtree:!0})})}function A(){if(l.__urpppPagebarBound){d(C,0);return}l.__urpppPagebarBound=!0,[0,300,1e3,2500].forEach(x=>d(C,x))}return{scheduleBeautifyPagebar:A}}function vi({destroyPagebarChosen:o,documentRef:n=document,logger:l=console}){function c(d){try{(d?.querySelectorAll?d.querySelectorAll("#urppagebar"):n.querySelectorAll("#urppagebar")).forEach(C=>{if(!C)return;C.classList.add("urppp-pagebar"),C.style.setProperty("display","block","important"),C.style.setProperty("width","100%","important"),C.style.setProperty("line-height","1.5","important");let A=C.querySelector('.dataTables_paginate, [id^="sample-table-2_paginate_"]')||C,x=Array.from(C.querySelectorAll('[id^="span_page_txt_"]')).map(h=>String(h.textContent||"").trim()).join(""),S=C.querySelector('select[id^="pagination_pageSize_"]'),f=S?String(S.value||""):"",y=C.querySelector('[id^="turnpageto_"]'),z=!!(y&&(y.readOnly||y.hasAttribute("readonly")));if(!(x.includes("转到")&&!z&&!f.includes("_"))){C.classList.add("urppp-pagebar-scroll"),C.classList.remove("urppp-pagebar-jump"),C.querySelectorAll('ul.pagination, [id^="pagination_ul_"]').forEach(h=>{h.style.setProperty("display","none","important")}),C.querySelectorAll("select").forEach(h=>{o(h),h.style.setProperty("width","128px","important"),h.style.setProperty("min-width","128px","important"),h.style.setProperty("max-width","128px","important")}),C.querySelectorAll(".chosen-container").forEach(h=>{try{h.style.setProperty("display","none","important")}catch{}});return}C.classList.add("urppp-pagebar-jump"),C.classList.remove("urppp-pagebar-scroll"),A.style.setProperty("display","flex","important"),A.style.setProperty("align-items","center","important"),A.style.setProperty("flex-wrap","wrap","important"),A.style.setProperty("gap","8px","important"),A.style.setProperty("position","relative","important"),A.style.setProperty("line-height","1.5","important"),C.querySelectorAll("ul.pagination").forEach(h=>{h.classList.add("urppp-pagination"),h.style.cssText=["display:inline-flex !important","align-items:center !important","flex-wrap:wrap !important","gap:4px !important","margin:0 !important","padding:0 !important","list-style:none !important","float:none !important","position:static !important"].join(";")}),C.querySelectorAll("ul.pagination > li").forEach(h=>{let b=h.classList.contains("active"),v=h.classList.contains("disabled"),g=h.classList.contains("previous")||/previous/i.test(h.getAttribute("name")||""),_=h.classList.contains("next")||/next/i.test(h.getAttribute("name")||"");h.classList.add("urppp-page-li"),b&&h.classList.add("urppp-page-li-active"),v&&h.classList.add("urppp-page-li-disabled"),g&&h.classList.add("urppp-page-li-prev"),_&&h.classList.add("urppp-page-li-next"),h.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","float:none !important","position:static !important","margin:0 !important","padding:0 !important","list-style:none !important","border:none !important","background:transparent !important","height:auto !important","min-height:0 !important"].join(";");let P=h.querySelector(":scope > span, :scope > a")||h.firstElementChild;if(!P)return;P.classList.add("urppp-page-chip"),b&&P.classList.add("urppp-page-chip-active"),v&&P.classList.add("urppp-page-chip-disabled"),(g||_)&&P.classList.add("urppp-page-chip-nav");let T=g||_?"72px":"40px",L=b?"var(--pagination-active-bg, var(--primary))":"var(--surface)",F=b?"var(--pagination-active-border, var(--primary))":"var(--border)",I=b?"var(--pagination-active-foreground, var(--primary-foreground, #fff))":v?"var(--text-muted)":"var(--text)";P.style.cssText=["display:inline-flex !important","align-items:center !important","justify-content:center !important","box-sizing:border-box !important","float:none !important","position:static !important","width:auto !important",`min-width:${T} !important`,"height:36px !important","min-height:36px !important","max-height:36px !important","padding:0 12px !important","margin:0 !important","line-height:36px !important","font-size:14px !important","font-weight:600 !important","border-radius:8px !important",`border:1px solid ${F} !important`,`background:${L} !important`,`color:${I} !important`,"box-shadow:none !important","text-decoration:none !important",`cursor:${v?"default":"pointer"} !important`,"white-space:nowrap !important","overflow:hidden !important"].join(";")}),C.querySelectorAll('[id^="btn_turnpageto_"]').forEach(h=>{h.classList.add("urppp-page-confirm"),h.style.setProperty("position","static","important"),h.style.setProperty("left","auto","important"),h.style.setProperty("top","auto","important"),h.style.setProperty("float","none","important"),h.style.setProperty("height","32px","important"),h.style.setProperty("min-width","52px","important"),h.style.setProperty("padding","0 12px","important"),h.style.setProperty("margin","0 4px","important"),h.style.setProperty("font-size","13px","important"),h.style.setProperty("line-height","1","important"),h.style.setProperty("vertical-align","middle","important")}),C.querySelectorAll('[id^="turnpageto_"]').forEach(h=>{h.classList.add("urppp-page-goto"),h.style.setProperty("position","static","important"),h.style.setProperty("display","inline-block","important"),h.style.setProperty("height","32px","important"),h.style.setProperty("width","48px","important"),h.style.setProperty("margin","0 4px","important"),h.style.setProperty("padding","4px 8px","important"),h.style.setProperty("font-size","14px","important"),h.style.setProperty("line-height","1.2","important"),h.style.setProperty("box-sizing","border-box","important"),h.style.setProperty("vertical-align","middle","important");let b=h.parentElement;b?.tagName==="SPAN"&&(b.style.setProperty("position","static","important"),b.style.setProperty("display","inline-flex","important"),b.style.setProperty("align-items","center","important"),b.style.setProperty("width","auto","important"),b.style.setProperty("height","auto","important"),b.style.setProperty("min-height","0","important"),b.style.setProperty("vertical-align","middle","important"))}),C.querySelectorAll('[id^="totalPage_show_"], [id^="span_page_txt_"]').forEach(h=>{h.style.setProperty("display","inline","important"),h.style.setProperty("border","none","important"),h.style.setProperty("background","transparent","important"),h.style.setProperty("padding","0","important"),h.style.setProperty("margin","0","important"),h.style.setProperty("height","auto","important"),h.style.setProperty("line-height","1.5","important"),h.style.setProperty("font-size","13px","important"),h.style.setProperty("color","var(--text-secondary, var(--text-muted))","important")})})}catch(k){l.warn("[URP++] pagebar beautify failed",k)}}return{beautifyPagebar:c}}function wi({beautifyNoticeTables:o,pinNoticeRowSurface:n,documentRef:l=document,windowRef:c=window,MutationObserverRef:d=MutationObserver,requestAnimationFrameRef:k=requestAnimationFrame,setTimeoutRef:C=setTimeout,clearTimeoutRef:A=clearTimeout}){function x(){c.__urpppNoticeHoverScrub||(c.__urpppNoticeHoverScrub=!0,l.addEventListener("mouseout",f=>{let y=f.target?.closest?f.target.closest("table.urppp-notice-table tr.urppp-notice-row"):null;y&&k(()=>n(y))},!0))}function S(){[0,400,1500].forEach(f=>C(()=>{try{o()}catch{}},f));try{let f=l.getElementById("page-content-template")||l.querySelector(".page-content, .main-content")||l.body;if(!f)return;let y=c.__urpppNoticeObs;if(y&&y.root===f&&f.isConnected)return;y?.observer&&y.observer.disconnect();let z=new d(()=>{A(c.__urpppNoticeTimer),c.__urpppNoticeTimer=C(()=>{try{o()}catch{}},180)});z.observe(f,{childList:!0,subtree:!0}),c.__urpppNoticeObs={root:f,observer:z}}catch{}}return{bindNoticeHoverScrub:x,scheduleBeautifyNoticeTables:S}}function ki({getCurrentTheme:o,documentRef:n=document,getComputedStyleRef:l=getComputedStyle}){function c(){try{return l(n.documentElement).getPropertyValue("--surface").trim()||(o()==="dark"?"#151A24":"#FFFFFF")}catch{return o()==="dark"?"#151A24":"#FFFFFF"}}function d(x){if(!x?.classList?.contains("urppp-notice-row"))return;let S=c();x.classList.remove("hover"),x.style.setProperty("background",S,"important"),x.style.setProperty("background-color",S,"important"),x.querySelectorAll("td, th").forEach(f=>{f.classList.remove("hover"),f.style.setProperty("background","transparent","important"),f.style.setProperty("background-color","transparent","important")})}function k(x){try{let S=x||n;if(S.matches?.("tr.urppp-notice-row")){d(S);return}S.querySelectorAll("table.urppp-notice-table tr.urppp-notice-row").forEach(d)}catch{}}function C(x){x&&(x.classList.remove("table-hover","table-striped"),x.classList.add("urppp-notice-nohover"),x.querySelectorAll("tr.urppp-notice-row").forEach(S=>{S.classList.remove("hover"),d(S)}))}function A(x){if(!x)return;x.classList.remove("urppp-notice-table"),delete x.dataset.urpppNoticeScan,x.style.removeProperty("border"),x.style.removeProperty("border-left"),x.style.removeProperty("background");let S=x.closest(".urppp-table-wrap.urppp-notice-wrap");S&&(S.classList.remove("urppp-notice-wrap"),S.style.removeProperty("border"),S.style.removeProperty("background"),S.style.removeProperty("box-shadow"),S.style.removeProperty("overflow"),S.style.removeProperty("border-radius")),x.querySelectorAll("tr.urppp-notice-row, td.urppp-notice-title-cell, td.urppp-notice-date-cell, td.urppp-notice-bullet-cell, a.urppp-notice-link, .urppp-notice-time, .urppp-notice-card").forEach(f=>{f.classList.remove("urppp-notice-row","urppp-notice-title-cell","urppp-notice-date-cell","urppp-notice-bullet-cell","urppp-notice-link","urppp-notice-time","urppp-notice-card","urppp-notice-card-row","urppp-notice-main","urppp-notice-meta","urppp-notice-title","urppp-notice-body"),(f.tagName==="TR"||f.tagName==="TD")&&["display","border","background","padding","margin","width","box-shadow","border-radius","float","position"].forEach(y=>{f.style.getPropertyPriority(y)==="important"&&f.style.removeProperty(y)}),delete f.dataset.urpppNoticeDone})}return{disarmNoticeTableHover:C,pinNoticeRowSurface:d,scrubNoticeInlineBg:k,stripMistakenNoticeTable:A}}function Ai({isNativePdfIsolationActive:o,bindNoticeHoverScrub:n,scrubNoticeInlineBg:l,stripMistakenNoticeTable:c,disarmNoticeTableHover:d,pinNoticeRowSurface:k,isBusinessDataTable:C,isNoticeListTable:A,isNoticePageContext:x,isNoticeBulletText:S,documentRef:f=document,windowRef:y=window,logger:z=console}){function E(){if(!o())try{n(),l(),f.querySelectorAll("table.urppp-notice-table, table.table").forEach(b=>{C(b)&&(b.classList.contains("urppp-notice-table")||b.querySelector(".urppp-notice-row, .urppp-notice-title-cell"))&&c(b)});let h=new Set(f.querySelectorAll('.page-content table, #page-content-template table, .main-content table, table.table, table.urppp-notice-table, table[style*="dashed"], table.no-border-top'));x()?f.querySelectorAll("table").forEach(b=>h.add(b)):f.querySelectorAll("table").forEach(b=>{A(b)&&h.add(b)}),Array.from(h).forEach(b=>{if(!b||C(b))return;if(b.querySelector("thead th")&&b.querySelectorAll("thead th").length>=3){let L=b.querySelector("thead")?.textContent||"";if(!A(b)&&/序号|课程|成绩|教室|校区|学号|姓名|教学楼|座位|操作|类型/.test(L)&&!/标题|公告|通知/.test(L))return}let v=Array.from(b.querySelectorAll("tbody > tr, tr")).filter(L=>L.querySelector("td"));if(!v.length)return;let g=0;v.slice(0,12).forEach(L=>{let F=Array.from(L.children).filter(et=>et.tagName==="TD"||et.tagName==="TH");if(F.length>=5)return;let I=(L.textContent||"").replace(/\s+/g," ").trim(),D=!!L.querySelector("a[href], a[onclick], a"),W=/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(I),H=F.some(et=>S(et.textContent));(D&&W||H&&D||H&&W)&&(g+=1)});let _=b.classList.contains("no-border-top")||/dashed|border-left-style/.test(b.getAttribute("style")||""),P=x();if(g<1){if(P){if(v.slice(0,8).filter(F=>{let I=Array.from(F.children).filter(W=>W.tagName==="TD"||W.tagName==="TH");if(I.length<1||I.length>4)return!1;let D=(F.textContent||"").replace(/\s+/g," ").trim();return!!F.querySelector("a")||/\d{4}/.test(D)}).length<1&&!_)return}else if(!(_&&/公告|通知/.test(f.title||"")))return}if(C(b))return;b.classList.add("urppp-notice-table"),b.dataset.urpppNoticeScan="1",d(b),b.style.setProperty("border","none","important"),b.style.setProperty("border-left","none","important"),b.style.setProperty("background","transparent","important"),b.style.setProperty("width","100%","important");let T=b.closest(".urppp-table-wrap");T&&(T.classList.add("urppp-notice-wrap"),T.style.setProperty("border","none","important"),T.style.setProperty("background","transparent","important"),T.style.setProperty("box-shadow","none","important"),T.style.setProperty("overflow","visible","important"),T.style.setProperty("border-radius","0","important")),v.forEach(L=>{if(L.dataset.urpppNoticeDone==="1")return;let F=Array.from(L.children).filter(G=>G.tagName==="TD"||G.tagName==="TH");if(!F.length)return;let I=G=>(G||"").replace(/\u00AD/g,"").replace(/\u200B/g,"").replace(/\s+/g," ").trim();if(F.length>=2){let G=null,V=null,at=null;if(F.forEach((Q,lt)=>{let rt=I(Q.textContent),it=!!Q.querySelector("a");if(!G&&S(rt)&&(lt===0||F.length>=2)){G=Q;return}if(!at&&(/\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}/.test(rt)||/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}/.test(rt)||/text-align\s*:\s*right/i.test(Q.getAttribute("style")||"")||lt===F.length-1&&rt.length<=28&&/\d{4}/.test(rt))&&/\d{4}/.test(rt)&&rt.length<=32){at=Q;return}!V&&(it||rt.length>4)&&(V=Q)}),V||(V=F.find(Q=>Q!==G&&Q!==at)||F[0]),!at&&F.length>=2){let Q=F[F.length-1];Q!==V&&Q!==G&&(at=Q)}if(L.classList.add("urppp-notice-row"),k(L),L.removeAttribute("width"),L.style.setProperty("flex-wrap","nowrap","important"),F.forEach(Q=>{Q.removeAttribute("width"),Q.removeAttribute("height"),Q.removeAttribute("align"),Q.style.setProperty("border","none","important"),Q.style.setProperty("background","transparent","important"),Q.style.setProperty("vertical-align","middle","important"),Q.style.removeProperty("width"),Q.style.setProperty("width","auto","important")}),G&&(G.classList.add("urppp-notice-bullet-cell"),G.style.setProperty("display","none","important"),G.style.setProperty("width","0","important"),G.style.setProperty("padding","0","important")),V){V.classList.add("urppp-notice-title-cell"),V.removeAttribute("width"),V.style.setProperty("width","auto","important"),V.style.setProperty("max-width","100%","important"),V.style.setProperty("min-width","0","important"),V.style.setProperty("flex","1 1 0%","important"),V.style.setProperty("overflow","hidden","important"),V.style.setProperty("padding","0","important"),V.style.setProperty("pointer-events","auto","important"),V.style.setProperty("white-space","nowrap","important");let Q=V.querySelector("a[href], a[onclick], a");if(Q||(Q=L.querySelector("a[href], a[onclick], a")),Q){V.contains(Q)||(V.innerHTML="",V.appendChild(Q)),Q.classList.add("urppp-notice-link");let lt=Q.getAttribute("href"),rt=Q.getAttribute("onclick"),it=Q.getAttribute("target"),gt=I(Q.textContent);Q.textContent=gt,lt!=null&&Q.setAttribute("href",lt),rt!=null&&Q.setAttribute("onclick",rt),it!=null&&Q.setAttribute("target",it),Q.style.setProperty("color","var(--text)","important"),Q.style.setProperty("text-decoration","none","important"),Q.style.setProperty("font-size","14px","important"),Q.style.setProperty("font-weight","500","important"),Q.style.setProperty("line-height","1.5","important"),Q.style.setProperty("pointer-events","auto","important"),Q.style.setProperty("cursor","pointer","important"),Q.style.setProperty("position","relative","important"),Q.style.setProperty("z-index","2","important"),Q.style.setProperty("display","block","important"),Q.style.setProperty("white-space","nowrap","important"),Q.style.setProperty("overflow","hidden","important"),Q.style.setProperty("text-overflow","ellipsis","important"),L.dataset.urpppNoticeClickBound!=="1"&&(L.dataset.urpppNoticeClickBound="1",L.style.setProperty("cursor","pointer","important"),L.addEventListener("click",X=>{if(X.target&&X.target.closest&&X.target.closest("a,button,input,select,textarea,label"))return;if(Q.getAttribute("onclick")){Q.click();return}let ct=Q.getAttribute("href");if(!ct||ct==="#"||ct.indexOf("javascript:")===0){Q.click();return}Q.target==="_blank"?y.open(ct,"_blank"):y.location.href=ct}))}else{let lt=I(V.textContent);lt&&!V.querySelector("button, input, select")&&(!V.querySelector("*")||V.children.length===0)&&(V.textContent=lt)}}if(at){at.classList.add("urppp-notice-date-cell"),at.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-end !important","flex:0 0 auto !important","width:auto !important","max-width:none !important","white-space:nowrap !important","text-align:right !important","padding:0 !important","margin:0 0 0 auto !important","border:none !important","background:transparent !important","float:none !important","position:static !important","right:auto !important","left:auto !important","top:auto !important"].join(";");let Q=I(at.textContent);at.innerHTML="";let lt=f.createElement("span");lt.className="urppp-notice-time",lt.textContent=Q,at.appendChild(lt)}V&&(V.style.setProperty("flex","1 1 auto","important"),V.style.setProperty("min-width","0","important"),V.style.setProperty("margin","0","important"),V.style.setProperty("float","none","important"),V.style.setProperty("position","static","important")),L.style.setProperty("display","flex","important"),L.style.setProperty("align-items","center","important"),L.style.setProperty("justify-content","space-between","important"),L.style.setProperty("gap","16px","important"),L.style.setProperty("max-width","100%","important"),L.style.setProperty("box-sizing","border-box","important"),L.style.setProperty("overflow","hidden","important"),L.dataset.urpppNoticeDone="1";return}let D=F[0],W=Array.from(D.querySelectorAll(":scope > span"));if(W.length<2){let G=D.querySelector("a"),V=I(D.textContent),at=V.match(/(\d{4}[-/.年]\d{1,2}[-/.月]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?)/);if(G||at){L.classList.add("urppp-notice-row");let Q=f.createElement("div");Q.className="urppp-notice-card urppp-notice-card-row";let lt=f.createElement("div");if(lt.className="urppp-notice-main",G){G.classList.add("urppp-notice-link");let rt=G.getAttribute("href"),it=G.getAttribute("onclick"),gt=I(G.textContent);G.textContent=gt,rt!=null&&G.setAttribute("href",rt),it!=null&&G.setAttribute("onclick",it),G.style.setProperty("pointer-events","auto","important"),G.style.setProperty("cursor","pointer","important"),lt.appendChild(G),L.dataset.urpppNoticeClickBound!=="1"&&(L.dataset.urpppNoticeClickBound="1",L.style.setProperty("cursor","pointer","important"),L.addEventListener("click",X=>{if(!(X.target&&X.target.closest&&X.target.closest("a,button,input,select"))){if(G.getAttribute("onclick")||!G.getAttribute("href")||G.getAttribute("href")==="#"){G.click();return}y.location.href=G.getAttribute("href")}}))}else{let rt=f.createElement("div");rt.className="urppp-notice-title",rt.textContent=at?V.replace(at[0],"").trim():V,lt.appendChild(rt)}if(Q.appendChild(lt),at){let rt=f.createElement("div");rt.className="urppp-notice-meta";let it=f.createElement("span");it.className="urppp-notice-time",it.textContent=at[1],rt.appendChild(it),Q.appendChild(rt)}D.innerHTML="",D.appendChild(Q),D.dataset.urpppNoticeDone="1",L.dataset.urpppNoticeDone="1"}return}let H=null,et=null,pt=[];if(W.forEach(G=>{let V=(G.getAttribute("style")||"")+" "+(G.style.cssText||""),at=I(G.textContent);if(at){if(/font-size\s*:\s*18/i.test(V)||!H&&/font-size\s*:\s*1[6-9]/i.test(V)){H=G;return}if(/font-size\s*:\s*12/i.test(V)||/float\s*:\s*right/i.test(V)||/^\d{4}-\d{2}-\d{2}/.test(at)){et=G;return}pt.push(G)}}),H||(H=W[0]),!et){let G=W[W.length-1];G!==H&&(et=G)}let mt=f.createElement("div");if(mt.className="urppp-notice-card",H){let G=f.createElement("div");G.className="urppp-notice-title",G.textContent=I(H.textContent),mt.appendChild(G)}if((pt.length?pt:W.filter(G=>G!==H&&G!==et)).forEach(G=>{let V=f.createElement("div");V.className="urppp-notice-body",V.textContent=I(G.textContent),V.textContent&&mt.appendChild(V)}),et){let G=f.createElement("div");G.className="urppp-notice-meta";let V=f.createElement("span");V.className="urppp-notice-time",V.textContent=I(et.textContent),G.appendChild(V),mt.appendChild(G)}D.innerHTML="",D.appendChild(mt),D.dataset.urpppNoticeDone="1",L.dataset.urpppNoticeDone="1",L.classList.add("urppp-notice-row")})})}catch(h){z.warn("[URP++] notice table beautify failed",h)}}return{beautifyNoticeTables:E}}var Si={"page-content-template":"urppp-pdf-page",mycoursetable:"urppp-pdf-mycoursetable",courseTable:"urppp-pdf-courseTable",courseTableBody:"urppp-pdf-courseTableBody",h4_id1:"urppp-pdf-h4-1",h4_id2:"urppp-pdf-h4-2",infoTable:"urppp-pdf-info-table","rwskxxbg-course":"urppp-pdf-rwskxxbg","other-course":"urppp-pdf-other-course",temp_title:"urppp-pdf-temp-title",temp_subtitle:"urppp-pdf-temp-subtitle"};function ud(o){return o.querySelectorAll('script, iframe, object, embed, [id^="urppp-"], [data-urppp]').forEach(n=>n.remove()),[o,...o.querySelectorAll("*")].forEach(n=>{Array.from(n.classList||[]).forEach(l=>{/^urppp(?:-|$)/.test(l)&&n.classList.remove(l)}),Array.from(n.attributes||[]).forEach(l=>{/^data-urppp(?:-|$)/.test(l.name)&&n.removeAttribute(l.name)}),n.style&&Array.from(n.style).forEach(l=>{n.style.getPropertyPriority(l)==="important"&&n.style.removeProperty(l)})}),o}function md(o){return[o,...o.querySelectorAll("*")].forEach(n=>{n.id&&Si[n.id]&&(n.id=Si[n.id]),n.classList.contains("class_div")&&(n.classList.remove("class_div"),n.classList.remove("box_font"),n.classList.add("urppp-pdf-card")),n.classList.contains("course")&&(n.classList.remove("course"),n.classList.add("urppp-pdf-course"))}),o}function bd(){let o=[];document.querySelectorAll('style[id^="urppp-"]').forEach(c=>{c.sheet&&!c.sheet.disabled&&(o.push(c),c.sheet.disabled=!0)});let n=0,l=document.getElementById("mycoursetable");return l&&(n=l.getBoundingClientRect().width),o.forEach(c=>{c.sheet.disabled=!1}),n}var hd=`
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
`;function fd(o){o.querySelectorAll("td, th").forEach(n=>{n.style.removeProperty("background"),n.style.removeProperty("background-color")}),o.querySelectorAll("th[rowspan]").forEach(n=>{n.style.removeProperty("width"),n.style.setProperty("white-space","nowrap"),n.style.setProperty("text-align","center")}),o.querySelectorAll("table").forEach(n=>{n.style.setProperty("background","#ffffff","important"),n.style.setProperty("background-color","#ffffff","important"),n.style.setProperty("border","none","important"),n.style.setProperty("color","#000000","important")}),o.querySelectorAll("th").forEach(n=>{if(n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important"),n.style.setProperty("font-weight","normal","important"),n.childNodes.length===1&&n.firstChild&&n.firstChild.nodeType===3){let l=document.createElement("span");l.textContent=n.textContent,n.textContent="",n.appendChild(l)}}),o.querySelectorAll("thead th").forEach(n=>{n.style.setProperty("background","#dddddd","important"),n.style.setProperty("background-color","#dddddd","important")}),o.querySelectorAll("tbody th").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important")}),o.querySelectorAll("td").forEach(n=>{n.style.setProperty("background","transparent","important"),n.style.setProperty("background-color","transparent","important"),n.style.setProperty("color","#000000","important"),n.style.setProperty("border","1px solid #dddddd","important")})}function _i(o){let n=bd(),l=document.createElement("div");l.id="urppp-pdf-stage",l.style.cssText="position:fixed;left:-20000px;top:0;z-index:-1;pointer-events:none;width:"+(n||window.innerWidth||1440)+"px;";let c=document.createElement("div");c.id="urppp-pdf-page",c.style.cssText="position:relative;width:100%;box-sizing:border-box;";let d=o.cloneNode(!0);ud(d),md(d),c.appendChild(d),l.appendChild(c),fd(d);let k=document.createElement("style");k.id="urppp-pdf-reset-style",k.textContent=hd,document.head.appendChild(k),document.body.appendChild(l);let C=l.querySelector("#urppp-pdf-mycoursetable"),A=l.querySelector("#urppp-pdf-page")||l;if(!C)throw l.remove(),new Error("无法建立原生课表捕获节点");return{stage:l,target:C,page:A,sourceHost:o}}var wa=0;function fe(){return wa>0}function gd(o){return!o||o.tagName!=="STYLE"?!1:/^urppp(?:-|$)/.test(o.id||"")||o.hasAttribute("data-urppp-style")?!0:(o.textContent||"").includes("urppp-")}function Ei(){try{if(typeof unsafeWindow<"u"&&unsafeWindow)return unsafeWindow}catch{}return typeof window<"u"?window:null}function Ci(o,n){let l=o&&typeof o.requestAnimationFrame=="function"?o.requestAnimationFrame.bind(o):typeof requestAnimationFrame=="function"?requestAnimationFrame:null;return l?l(n):setTimeout(n,0)}function xd(o={}){let n=o.document||(typeof document<"u"?document:null),l=o.page||Ei();if(!n)throw new Error("原生 PDF 隔离缺少 document");let c=n.getElementById("mycoursetable");if(!c)throw new Error("当前页面没有课表节点");wa+=1;let d=[c,...c.querySelectorAll("*")],k=[],C=n.getElementById("soliderbox");C&&k.push(C);let A=c.parentElement;for(;A&&A!==n.documentElement;){let g=A.classList;(A.id==="page-content-template"||g&&(g.contains("page-content")||g.contains("profile-info-row")||g.contains("profile-info-value")))&&k.push(A),A=A.parentElement}let x=n.getElementById("page-content-template")||n.querySelector(".page-content");x&&!k.includes(x)&&k.push(x);let S=[...d,...k],f=S.map(g=>({element:g,style:g.getAttribute("style")})),y=Array.from(n.querySelectorAll("style")).filter(gd).map(g=>({style:g,disabled:g.sheet?g.sheet.disabled:!1,media:g.getAttribute("media")})),z=Array.from(c.querySelectorAll('[id^="urppp-"], [data-urppp]')),E=l&&l.divBuild,h=l&&l.__urpppOriginalDivBuild,b=!1,v=()=>{b||(b=!0,l&&l.divBuild===h&&typeof E=="function"&&(l.divBuild=E),f.forEach(({element:g,style:_})=>{g.isConnected&&(_===null?g.removeAttribute("style"):g.setAttribute("style",_))}),z.forEach(g=>g.removeAttribute("data-urppp-pdf-hidden")),y.forEach(({style:g,disabled:_,media:P})=>{try{P===null?g.removeAttribute("media"):g.setAttribute("media",P),g.sheet&&(g.sheet.disabled=_)}catch{}}),wa=Math.max(0,wa-1),Ci(l,()=>{try{typeof o.onAfterRestore=="function"&&o.onAfterRestore()}catch{}}))};try{return y.forEach(({style:g})=>{try{g.setAttribute("media","not all"),g.sheet&&(g.sheet.disabled=!0)}catch{}}),S.forEach(g=>{!g.style||!g.style.length||Array.from(g.style).forEach(_=>{g.style.getPropertyPriority(_)==="important"&&(_==="height"&&g.matches("td, th")||g.style.removeProperty(_))})}),c.querySelectorAll("td").forEach(g=>{g.style.removeProperty("background"),g.style.removeProperty("background-color")}),x&&x.style.setProperty("position","relative","important"),c.style.setProperty("position","static","important"),c.querySelectorAll("td").forEach(g=>{g.style.setProperty("position","static","important")}),z.forEach(g=>{g.setAttribute("data-urppp-pdf-hidden","1"),g.style.setProperty("display","none","important")}),l&&typeof h=="function"&&(l.divBuild=h),v}catch(g){throw v(),g}}function Pi(o,n={}){return new Promise((l,c)=>{let d=n.page||Ei(),k=d&&d.back,C=d&&d.html2canvas;if(!o||typeof k!="function"){c(new Error("教务原生导出依赖未就绪"));return}let A=null;try{A=xd(n)}catch(h){c(h);return}let x=0,S=!1,f=null,y=null,z=h=>{if(!S){S=!0,x&&clearTimeout(x),d&&f&&d.back===f&&(d.back=k),y&&d.html2canvas===y&&(d.html2canvas=C);try{A&&A()}catch{}h?c(h):l()}},E=h=>z(h instanceof Error?h:new Error(String(h)));typeof C=="function"&&(y=function(){let h=C.apply(this,arguments);return h&&typeof h.catch=="function"&&h.catch(E),h},d.html2canvas=y),f=function(){try{return k.apply(this,arguments)}finally{setTimeout(()=>z(),0)}},d.back=f,x=setTimeout(()=>{try{k.call(d)}catch{}E(new Error("原生 PDF 生成超时"))},n.timeoutMs||60*1e3),Ci(d,()=>{try{o.click()}catch(h){E(h)}})})}var zi=`.urppp-private-value{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;font-style:inherit!important;line-height:inherit!important;letter-spacing:0!important;color:inherit!important}
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
`;var Li=`      /* 全局 */
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
`;var qi=`/* Personal and resource schedule course cards. Keep table cells and table surfaces untouched. */
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
`;var Ti=`.urppp-export-wrap{position:relative!important;display:inline-flex!important;align-items:center!important;flex:0 0 auto!important;margin-left:7px!important;font-weight:400!important;vertical-align:middle!important;white-space:nowrap!important}
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
`;var Mi=`/* Settings panel shell */
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
  margin: 8px 0 0 !important; font-size: 12px !important; line-height: 1.95 !important;
  color: var(--text-secondary) !important; white-space: pre-line !important;
}
#urppp-settings-panel .urppp-about-msg a.urppp-about-poem-link {
  color: inherit !important; text-decoration: none !important; transition: color 0.15s ease !important;
}
#urppp-settings-panel .urppp-about-msg a.urppp-about-poem-link:hover {
  color: var(--primary) !important; text-decoration: underline !important;
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
#urppp-settings-panel .urppp-src-official{margin-bottom:22px;padding-bottom:16px;border-bottom:1px dashed var(--border,#e6e8ec)}
#urppp-settings-panel .urppp-src-official .urppp-src-hint,
#urppp-settings-panel .urppp-src-mine .urppp-src-hint{margin-bottom:12px}
#urppp-settings-panel .urppp-src-mine .urppp-src-add{margin-top:14px}
html.urppp-theme-dark #urppp-settings-panel .urppp-src-item{background:var(--surface,#1c1c1e)}
#urppp-settings-panel .urppp-src-item .urppp-src-meta{display:flex;flex-direction:column;gap:2px;flex:1 1 auto;min-width:0}
#urppp-settings-panel .urppp-src-item .urppp-src-meta strong{font-size:13px;color:var(--text,#16181d);font-weight:700}
#urppp-settings-panel .urppp-src-url{font-size:12px;color:var(--text-secondary,#5b5f69);word-break:break-all}
#urppp-settings-panel .urppp-src-link{color:var(--accent,#4a6fa5) !important;text-decoration:underline !important}
#urppp-settings-panel .urppp-src-link:hover{opacity:.8}
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
`;var Ii=`      /* 表格美化：业务表格、分页、公告卡片（table-beautify） */
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
`;var $i=`      /* 导航：顶栏、侧栏、面包屑（navigation） */
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
`;var Ni=`/* ===== 插件弹窗统一进入动画：淡入+缩放 + 内容逐条浮现 ===== */
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
`;var Bi=`      /* 首页重构仪表板（dashboard） */
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
`;var Fi=`      /* 成绩分析面板（score-analysis） */
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
`;var Di=`      /* ============================================================
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
`;function ji(){return{open:!1,mobileTab:"home",scoreAnalysisTab:"overview",profile:null,schedule:null,scores:null,catalog:null,occupancy:null,currentBuilding:null,loading:{profile:!1,schedule:!1,scores:!1,room:!1},roomError:"",roomDateOffset:0,selected:{passing:new Set,scheme:new Set},activeSchemeIdx:0,_schemeUserSelected:!1,viewWeek:0,weekLocked:!1,_termWeek:0,_termWeekResolved:!1,uiReady:!1}}function Oi(o){o.profile=null,o.schedule=null,o.scores=null,o.catalog=null,o.occupancy=null,o._termWeekResolved=!1,o._schemeUserSelected=!1,o._schemeInited=!1}function Ri({state:o,deps:n}){async function l(d){if(!d&&o.catalog&&o.catalog.length||o.loading.room)return o.catalog;o.loading.room=!0;try{n.render()}catch{}try{o.catalog=await n.loadClassroomCatalog(),o.roomError=""}catch(k){o.catalog=o.catalog||[],o.roomError=String(k&&k.message||k),console.warn("[URP++] room catalog",k)}finally{o.loading.room=!1;try{n.scheduleRender()}catch{}}return o.catalog}async function c(d){d&&Oi(o),o.loading.profile=o.loading.schedule=o.loading.scores=!0;try{let k=await n.ensureTermWeekResolved();!o.weekLocked&&k>=1&&(o.viewWeek=k)}catch{}if(n.render(),await Promise.all([(async()=>{try{o.profile&&!d||(o.profile=await n.loadProfile()),n.reconcileProfileAndScores()}catch(k){o.profile={name:"同学",majorPlan:"主修方案",majorGpa:"—",avatar:""},console.warn(k)}finally{o.loading.profile=!1,n.scheduleRender()}})(),(async()=>{try{o.schedule&&!d||(o.schedule=await n.loadSchedule())}catch(k){o.schedule={courses:[],error:String(k&&k.message||k)}}finally{if(o.loading.schedule=!1,!o.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(o.viewWeek=k)}n.scheduleRender()}})(),(async()=>{let k=null;try{o.scores&&!d||(o.scores=await n.loadScores(d)),k=o.scores,n.reconcileProfileAndScores(),k&&!k.error&&!k.evaluationReady&&n.enrichScoresWithEvaluation(k).then(()=>{o.scores===k&&(n.reconcileProfileAndScores(),n.scheduleRender())}).catch(C=>{console.warn("[URP++] attach evaluation",C)})}catch(C){o.scores={passing:[],schemes:[],error:String(C&&C.message||C)}}finally{o.loading.scores=!1,n.scheduleRender()}})()]),n.reconcileProfileAndScores(),!o.weekLocked){let k=n.getCurrentWeekNumber()||n.readRememberedTermWeek();k>=1&&(o.viewWeek=k)}n.scheduleRender()}return{ensureRoomCatalogLoaded:l,loadAll:c}}var cr={autumn:{name:"秋季学期",weeks:20,start:"2026-08-31",end:"2027-02-20",events:[{t:"reg",name:"本科生新生报到",start:"2026-08-24",end:"2026-08-25"},{t:"reg",name:"在校生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"研究生新生报到",start:"2026-08-27",end:"2026-08-28"},{t:"reg",name:"在校本科补缓考",start:"2026-08-28",end:"2026-08-30"},{t:"term",name:"本科生开学典礼",start:"2026-09-01"},{t:"term",name:"研究生开学典礼",start:"2026-09-04"},{t:"term",name:"在校生正式行课",start:"2026-08-31",end:"2026-09-06"},{t:"holiday",name:"中秋节",start:"2026-09-25"},{t:"holiday",name:"国庆节假期",start:"2026-10-01",end:"2026-10-07"},{t:"sport",name:"校秋季田径运动会",start:"2026-10-23",end:"2026-10-24"},{t:"exam",name:"本科生期末集中考试周",start:"2027-01-04",end:"2027-01-15"},{t:"holiday",name:"寒假",start:"2027-01-18",end:"2027-02-20"},{t:"holiday",name:"春节",start:"2027-02-06"}]},spring:{name:"春季学期",weeks:18,start:"2027-03-01",end:"2027-07-03",events:[{t:"reg",name:"在校生报到",start:"2027-02-25",end:"2027-02-26"},{t:"term",name:"正式行课",start:"2027-03-01",end:"2027-03-07"},{t:"holiday",name:"清明节",start:"2027-04-05"},{t:"holiday",name:"劳动节假期",start:"2027-05-01",end:"2027-05-05"},{t:"holiday",name:"端午节",start:"2027-06-09"},{t:"exam",name:"期末集中考试",start:"2027-06-21",end:"2027-06-27"},{t:"term",name:"毕业典礼",start:"2027-06-25"},{t:"holiday",name:"暑假开始",start:"2027-07-04"}]}},yd={"2026-08-24":"农历七月十二","2026-08-25":"农历七月十三","2026-08-27":"农历七月十五","2026-08-28":"农历七月十六","2026-08-30":"农历七月十八","2026-08-31":"农历七月十九","2026-09-01":"农历七月二十","2026-09-04":"农历七月廿三","2026-09-25":"农历八月十五","2026-10-01":"农历八月廿一","2026-10-07":"农历八月廿七","2026-10-23":"农历九月十四","2026-10-24":"农历九月十五","2027-01-04":"农历冬月廿七","2027-01-15":"农历腊月初八","2027-01-18":"农历腊月十一","2027-02-06":"农历正月初一","2027-02-20":"农历正月十五","2027-02-25":"农历正月二十","2027-02-26":"农历正月廿一","2027-03-01":"农历正月廿四","2027-04-05":"农历二月廿九","2027-05-01":"农历三月廿五","2027-05-05":"农历三月廿九","2027-06-09":"农历五月初五","2027-06-21":"农历五月十七","2027-06-25":"农历五月廿一","2027-06-27":"农历五月廿三","2027-07-03":"农历五月廿九","2027-07-04":"农历六月初一"},Br={term:{color:"#44616f",label:"教学/开学"},reg:{color:"#8a74bd",label:"报到"},exam:{color:"#c08a3f",label:"考试周"},holiday:{color:"#d0716a",label:"假期"},sport:{color:"#778e63",label:"运动会"}};function Wi(){let o=new Date,n=l=>String(l).padStart(2,"0");return`${o.getFullYear()}-${n(o.getMonth()+1)}-${n(o.getDate())}`}function Do(o,n){return Math.round((Date.parse(n)-Date.parse(o))/864e5)}function jo(o,n){let l=Do(cr[o].start,n);return l<0?0:Math.floor(l/7)+1}function Bo(o){return yd[o]||""}function Hi(o){return String(o||"").slice(5)}function vd(o){let n=o||Wi(),[l,c]=n.split("-").map(Number);return c===8&&n>="2026-08-15"||c>=9||c<=2?"autumn":"spring"}function Oo(o,n){let l=o&&cr[o]?o:"autumn",c=cr[l],d=n||Wi(),k=c.events.map(f=>({e:f,d:Do(d,f.start)})).filter(f=>f.d>=-0).sort((f,y)=>f.d-y.d)[0],C=k?Do(d,k.e.start):null,A=jo(l,d),x=Math.max(0,Math.min(100,A/c.weeks*100)),S=d>=c.start;return{term:c,termId:l,next:k,daysLeft:C,weekNo:A,progress:x,started:S,today:d}}function Gi(o,n){let l=Oo(o,n),c=l.next?Br[l.next.e.t].color:"#c9cdd4",d=l.term;return`<button type="button" class="uc-cal-summary" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-s-left">
      <span class="cal-s-count">${l.daysLeft==null?"—":l.daysLeft}</span>
      <span class="cal-s-unit">天后</span>
    </span>
    <span class="cal-s-right">
      <span class="cal-s-wk">${l.started?`第 ${l.weekNo} 周`:"尚未开学"} · ${l.term.name}</span>
      <span class="cal-s-ev"><i style="background:${c}"></i>${l.next?l.next.e.name:"学期已结束"}</span>
      <span class="cal-s-date">${l.next?l.next.e.start+(l.next.e.end&&l.next.e.end!==l.next.e.start?"~"+l.next.e.end.slice(5):""):""}</span>
      <span class="cal-s-prog"><span>本学期进度</span><span>${Math.min(l.weekNo,d.weeks)}/${d.weeks} 周</span></span>
      <span class="cal-s-bar"><i style="width:${l.progress}%"></i></span>
    </span>
  </button>`}function Ji(o,n){let l=Oo(o,n);return`<button type="button" class="uc-cal-summary uc-cal-summary-compact" data-urppp-cal-open aria-label="打开校历时间线">
    <span class="cal-c-dot" style="background:${l.next?Br[l.next.e.t].color:"#c9cdd4"}"></span>
    <span class="cal-c-count"><b>${l.daysLeft==null?"—":l.daysLeft}</b><em>天后</em></span>
    <span class="cal-c-info">
      <span class="cal-c-name">${l.next?l.next.e.name:"学期已结束"}</span>
      <span class="cal-c-sub">${l.started?`第 ${l.weekNo} 周`:"尚未开学"} · ${l.term.name}</span>
    </span>
    <span class="cal-c-prog"><span class="cal-c-bar"><i style="width:${l.progress}%"></i></span><span class="cal-c-week">本学期进度 ${Math.min(l.weekNo,l.term.weeks)}/${l.term.weeks} 周</span></span>
  </button>`}function Ui(o,n){let l=Oo(o,n),c=l.next?Br[l.next.e.t].color:"#c9cdd4",d=l.term,k=Object.keys(cr).map(y=>`<button type="button" class="cal-term${y===l.termId?" ac":""}" data-cal-term="${y}">${cr[y].name}</button>`).join(""),C=`<div class="cal-widget">
    <div class="cal-w-left">
      <div class="cal-w-label">下一个事件</div>
      <div class="cal-w-ev"><i style="background:${c}"></i><b>${l.next?l.next.e.name:"学期已结束"}</b></div>
      <div class="cal-w-sub">${l.next?l.next.e.start+(l.next.e.end&&l.next.e.end!==l.next.e.start?" ~ "+l.next.e.end:""):""}${l.next&&Bo(l.next.e.start)?" · "+Bo(l.next.e.start):""}</div>
    </div>
    <div class="cal-w-mid">
      <span class="cal-w-num">${l.daysLeft==null?"—":l.daysLeft}</span><span class="cal-w-unit">天</span>
    </div>
    <div class="cal-w-right">
      <div class="cal-w-wk">${l.started?`第 ${l.weekNo} 周`:"尚未开学"}</div>
      <div class="cal-w-prog">
        <div class="cal-w-prog-lbl"><span>本学期进度</span><span>${Math.min(l.weekNo,d.weeks)} / ${d.weeks} 周</span></div>
        <div class="cal-w-prog-bar"><i style="width:${l.progress}%"></i></div>
      </div>
    </div>
  </div>`,A=d.events.slice().sort((y,z)=>y.start<z.start?-1:1),x={};A.forEach(y=>{(x[y.start.slice(0,7)]=x[y.start.slice(0,7)]||[]).push(y)});let S=y=>y===l.today?" cal-today":"",f=Object.keys(x).map(y=>{let[,z]=y.split("-");return`<div class="cal-mon">
      <div class="cal-mon-label">${Number(z)} 月</div>
      <div class="cal-mon-items">${x[y].map(E=>{let h=Br[E.t].color,b=E.end&&E.end!==E.start?"~"+Hi(E.end):"",v=jo(l.termId,E.start)>0?`第 ${jo(l.termId,E.start)} 周`:"开学前";return`<div class="cal-ev${S(E.start)}">
          <span class="cal-ev-dot" style="background:${h}"></span>
          <span class="cal-ev-date">${Hi(E.start)}${b||""}<em>${Bo(E.start)||"&nbsp;"}</em></span>
          <span class="cal-ev-name">${E.name}</span>
          <span class="cal-ev-tag" style="color:${h};background:${h}1a">${Br[E.t].label}</span>
          <span class="cal-ev-wk">${v}</span>
        </div>`}).join("")}</div>
    </div>`}).join("");return`<div class="cal-modal-wrap">
    <div class="cal-modal-top">
      <span class="cal-modal-title">校历时间线</span>
      <span class="cal-right"><span class="cal-term-pills">${k}</span><button type="button" class="cal-close" aria-label="关闭">✕</button></span>
    </div>
    ${C}
    <div class="cal-timeline">${f}</div>
  </div>`}function Vi(o,n){let l=typeof document<"u"?document:null;if(!l)return;Fo();let c=o&&cr[o]?o:vd(n),d=l.createElement("div");d.id="urppp-cal-modal",d.innerHTML=`<div class="cal-overlay"></div>
    <div class="cal-dialog"><div class="cal-body">${Ui(c,n)}</div></div>`,l.documentElement.appendChild(d),setTimeout(()=>d.classList.add("open"),20),d.querySelector(".cal-overlay").addEventListener("click",()=>Fo()),d.addEventListener("click",k=>{let C=k.target;if(C&&C.closest&&C.closest(".cal-close")){Fo();return}let A=C&&C.closest?C.closest("[data-cal-term]"):null;if(A){let x=d.querySelector(".cal-body");x&&(x.innerHTML=Ui(A.dataset.calTerm,n)),d.querySelectorAll("[data-cal-term]").forEach(S=>S.classList.toggle("ac",S.dataset.calTerm===A.dataset.calTerm))}})}function Fo(){let o=typeof document<"u"?document:null;if(!o)return;let n=o.getElementById("urppp-cal-modal");n&&(n.classList.remove("open"),n.classList.add("closing"),setTimeout(()=>{n.remove()},200))}function Yi(o,n){let l=o||(typeof document<"u"?document:null);l&&l.addEventListener("click",c=>{let d=c.target;d&&d.closest&&d.closest("[data-urppp-cal-open]")&&(c.preventDefault(),c.stopPropagation(),Vi())})}var ka=!1;function Ro(){let o=typeof document<"u"?document:null;if(!o||ka)return ka;try{let n=o.createElement("style");if(n&&n.id!==void 0){n.id="urppp-cal-style",n.textContent=`
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
  `,n.id="urppp-cal-style";let l=o.head||o.documentElement;l&&l.appendChild(n),ka=!0}}catch{}return ka}function Qi(){let o=typeof document<"u"?document:null;if(!o)return;let n=o.getElementById("urppp-nav-theme")||o.querySelector("#navbar .navbar-header")||o.getElementById("navbar"),l=o.getElementById("urppp-nav-clean"),c=o.getElementById("urppp-nav-cal");if(!n&&!l)return;let d=l&&l.parentElement||n;c&&c.parentElement===d||(c&&c.remove(),c=o.createElement("button"),c.type="button",c.id="urppp-nav-cal",c.title="校历时间线",c.setAttribute("aria-label","校历时间线"),c.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v3M16 3v3"/><circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/></svg><span>校历</span>',Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none",margin:"0 0 0 8px","vertical-align":"middle"}).forEach(([k,C])=>c.style.setProperty(k,C,"important")),c.addEventListener("click",k=>{k.preventDefault(),k.stopPropagation(),Vi()}),l&&l.parentElement?l.after(c):d&&d.appendChild(c))}function Ki(){let o=typeof document<"u"?document:null;if(!o)return;let n=o.getElementById("urppp-nav-cal");n&&n.remove()}function Zi({state:o,deps:n}){let l=0,c={gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)"};function d(g,_){let P=g||n.summarizeCourses([]);return`<div class="uc-metrics">${[["TotalCredit","总学分",P.totalCredit],["AvgScore","平均成绩",P.avgScore],["AvgGpa","平均绩点",P.avgGpa],["RequiredCredit","必修学分",P.requiredCredit],["RequiredAvg","必修平均",P.requiredAvg],["RequiredGpa","必修绩点",P.requiredGpa]].map(([L,F,I])=>{let D=n.classifyPrivacyLabel(F)||"grade",W=_&&n.DIRECT_EDIT_LABELS[_+L]?` data-urppp-edit-key="${_+L}"`:"";return`<div class="uc-metric"><em>${F}</em><b data-urppp-private="${D}"${W}>${I}</b></div>`}).join("")}</div>`}function k(){let g=o.scores;if(!g||g.error)return`<div class="uc-sa-empty">${n.escapeHtml(g&&g.error||"暂无成绩数据")}</div>`;let _=null;try{_=n.analyzeScores({scorePack:g,profile:o.profile})}catch{}if(!_||_.empty)return'<div class="uc-sa-empty">暂无可用成绩数据，请先查询成绩后再试。</div>';let P=typeof n.scoreChartLayout=="function"?n.scoreChartLayout():null;return`<div class="uc-sa-charts">
      <div class="uc-sa-chart-card"><h5>学期趋势</h5><div class="uc-sa-chart-scroll">${n.trendChartSvg({trend:_.trend,palette:n.scoreChartPalette||c,layout:P})}</div></div>
      <div class="uc-sa-chart-card"><h5>成绩分段分布</h5><div class="uc-sa-chart-scroll">${n.bandsChartSvg({bands:_.bands,palette:n.scoreChartPalette||c,layout:P})}</div></div>
    </div>
    <div class="uc-sa-more-row"><a class="uc-sa-more" data-href="/student/integratedQuery/scoreQuery/allPassingScores/index?urppp=sa">点击此处跳转到详细分析界面 →</a></div>`}function C(g){let _=!!n.isCleanAnalysisDirect(),P=o.scoreAnalysisTab==="analysis";return _?`<div class="uc-hd"><span>成绩总览</span><span class="uc-sub">点击查看明细</span></div>
  <div class="uc-bd">
    <div class="uc-sa-pane">${g}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis">${k()}</div>
  </div>`:`<div class="uc-hd uc-hd-tabs" role="tablist">
    <button type="button" class="uc-sa-tab${P?"":" ac"}" data-sa-tab="overview">成绩总览</button>
    <button type="button" class="uc-sa-tab${P?" ac":""}" data-sa-tab="analysis">成绩分析</button>
  </div>
  <div class="uc-bd">
    <div class="uc-sa-pane"${P?" hidden":""}>${g}</div>
    <div class="uc-sa-pane uc-sa-pane-analysis"${P?"":" hidden"}>${k()}</div>
  </div>`}function A(){try{if(window.matchMedia&&window.matchMedia("(max-width:900px)").matches)return 40}catch{}return 56}function x(g){let _=n.getViewWeekNumber(),P=A(),T=Math.max(P-4,28),L=(g||[]).map(D=>Object.assign({},D,{thisWeek:n.weekBitActive(D.classWeek,_)||!D.classWeek&&String(D.week||"").indexOf(String(_))>=0,span:Math.max(1,D.span||1),color:D.color||n.courseColor(D.name)})),F={};L.forEach(D=>{let W=D.day+"_"+D.section;(F[W]||(F[W]=[])).push(D)});let I=`<div class="uc-week" data-urppp-private="schedule" data-week="${_}" data-row="${P}">`;I+='<div class="uc-week-head"><div class="h"></div>';for(let D=0;D<7;D++)I+=`<div class="h">${n.DAY_NAMES[D]}</div>`;I+='</div><div class="uc-week-body">',I+='<div class="uc-sec-col">';for(let D=1;D<=12;D++)I+=`<div class="s" style="height:${P}px">${D}</div>`;I+="</div>";for(let D=0;D<7;D++){I+=`<div class="uc-day-col" data-day="${D}" style="height:${P*12}px">`;for(let W=1;W<=12;W++)I+=`<div class="uc-grid-cell" data-sec="${W}" style="top:${(W-1)*P}px;height:${T}px"></div>`;I+=`<div class="uc-part-line" style="top:${4*P-2}px"></div>`,I+=`<div class="uc-part-line" style="top:${9*P-2}px"></div>`;for(let W=1;W<=12;W++){let H=(F[D+"_"+W]||[]).slice().sort((gt,X)=>gt.thisWeek!==X.thisWeek?(X.thisWeek?1:0)-(gt.thisWeek?1:0):(X.span||1)-(gt.span||1));if(!H.length)continue;let pt=H.filter(gt=>gt.thisWeek)[0]||H[0],mt=H.filter(gt=>gt!==pt),G=pt.span,V=(W-1)*P+1,at=G*P-6,Q=pt.thisWeek?8:2,lt=pt.thisWeek?`--uc-course-color:${pt.color};top:${V}px;height:${at}px;z-index:${Q};background:${pt.color}26;border-color:${pt.color}80`:`--uc-course-color:${pt.color};top:${V}px;height:${at}px;z-index:${Q};background:color-mix(in srgb,${pt.color} 8%,var(--input-bg));border-color:var(--border);opacity:.48`,rt=mt.length?`<span class="uc-badge">+${mt.length}</span>`:"",it=n.escapeHtml(JSON.stringify({name:pt.name,teacher:pt.teacher,place:pt.place,week:pt.week,day:pt.day,section:pt.section,span:pt.span,thisWeek:pt.thisWeek,others:mt.map(gt=>({name:gt.name,teacher:gt.teacher,place:gt.place,week:gt.week,thisWeek:gt.thisWeek,section:gt.section,span:gt.span}))}));I+=`<div class="uc-lesson${pt.thisWeek?"":" is-fade"}" style="${lt}" data-course='${it}'>
          <b>${n.escapeHtml(pt.name)}</b>
          <i>${n.escapeHtml([pt.place,pt.week].filter(Boolean).join(" · "))}</i>
          ${rt}
        </div>`}I+="</div>"}return I+="</div></div>",I}function S(){try{if(o.loading&&o.loading.schedule)return"";let g=n.calVacation?n.calVacation():"term";if(g==="term"||n.getViewWeekNumber()!==0)return"";let _={summer:{title:"放暑假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'},winter:{title:"放寒假啦~",sub:"课表先歇一歇，好好享受生活",svg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M12 2v20"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>'},springfestival:{title:"春节快乐！",sub:"",svg:'<svg viewBox="0 0 72 72"><rect x="16" y="16" width="40" height="40" rx="7" fill="#b71c1c" stroke="#f5b301" stroke-width="2.4" transform="rotate(45 36 36)"/><path d="M36 16v40M16 36h40" stroke="#f5b301" stroke-width="1" opacity=".5"/><path d="M24 24l24 24M48 24L24 48" stroke="#f5b301" stroke-width="1" opacity=".35"/><text x="36" y="47" text-anchor="middle" font-size="30" font-weight="900" fill="#ffd54f" font-family="Noto Serif SC,STKaiti,KaiTi,serif" transform="rotate(180 36 36)">福</text></svg>',couplet:{scroll:"万象纳祥",right:"望江听雨华西看杏海纳百川享人间烟火",left:"江安漫步眉山泛舟有容乃大过锦绣新年"}}}[g];if(!_)return"";if(g==="springfestival"&&_.couplet){let T=_.couplet;return`<div class="uc-schedule-mask uc-mask-springfestival">
          <span class="uc-mask-scroll">${T.scroll}</span>
          <span class="uc-mask-cl uc-mask-cl-r">${T.right}</span>
          <span class="uc-mask-cl uc-mask-cl-l">${T.left}</span>
          <span class="uc-mask-ico">${_.svg}</span>
          <span class="uc-mask-txt"><b>${_.title}</b></span>
        </div>`}let P=_.sub?`<i>${_.sub}</i>`:"";return`<div class="uc-schedule-mask uc-mask-${g}"><span class="uc-mask-ico">${_.svg}</span><span class="uc-mask-txt"><b>${_.title}</b>${P}</span></div>`}catch{return""}}function f(){return`<div class="uc-services">${[{t:"空闲教室",i:"room",a:"room"},{t:"教学评估",i:"eval",h:"/student/teachingEvaluation/newEvaluation/index"},{t:"培养方案",i:"plan",h:"/student/integratedQuery/planCompletion/index"},{t:"补办学生证",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11082"},{t:"免修申请",i:"apply",h:"/student/personalManagement/individualApplication/exemptionApplication/index"},{t:"替代课申请",i:"apply",h:"/student/personalManagement/personalApplication/curriculumReplacement/index"},{t:"火车票优惠卡",i:"apply",h:"/student/personalManagement/individualApplication/routineWork/busSection/index?ywid=11083"}].map(_=>`
      <button type="button" class="uc-svc" data-action="${_.a||""}" data-href="${_.h||""}">
        ${n.ico(_.i)}<strong>${_.t}</strong>
      </button>`).join("")}</div>`}function y(){let g=n.personalizedProfile(o.profile||{}),_=o.schedule&&o.schedule.courses||[],P=o.scores&&o.scores.passing&&o.scores.passing[0]||{summary:n.summarizeCourses([])},T=o.scores&&o.scores.schemes||[];o.scores&&o.scores.majorIdx!=null&&o._schemeInited!==!0&&(o.activeSchemeIdx=o.scores.majorIdx||0,o._schemeInited=!0);let L=T[o.activeSchemeIdx]||T[0]||{summary:n.summarizeCourses([]),title:"方案成绩"},F=g.avatar?`<img src="${n.escapeHtml(g.avatar)}" alt="">`:`<span>${n.escapeHtml((g.name||"同")[0])}</span>`,I=o.loading.scores?'<div class="uc-loading">成绩加载中</div>':o.scores&&o.scores.error?`<div class="uc-empty">${n.escapeHtml(o.scores.error)}</div>`:`<div class="uc-score-grid">
            <div class="uc-score-pane" data-score="passing"><h5>全部及格成绩</h5>${d(P.summary,"passing")}</div>
            <div class="uc-score-pane" data-score="scheme"><h5>${n.escapeHtml((L.title||"方案成绩").split(/通过|获得|不通过/)[0].trim()||"方案成绩")}</h5>${d(L.summary,"scheme")}</div>
          </div>`,D=C(I);return`<div class="uc-desktop">
      <div class="uc-col">
        <div class="uc-card uc-profile-card"><div class="uc-bd"><div class="uc-profile">
          <div class="uc-avatar" data-urppp-private="avatar">${F}</div>
          <div>
            <div class="uc-name" data-urppp-private="name">${n.escapeHtml(g.name||"同学")}</div>
            <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${n.escapeHtml(g.majorPlan||"—")}</span></div>
            <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${n.escapeHtml(String(g.majorGpa||"—"))}</span></div>
          </div>
        </div>${(()=>{try{return Gi()}catch{return""}})()}</div></div>
        <div class="uc-card grow">
          <div class="uc-hd">
            <span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
            <div class="uc-week-nav">
              <button type="button" class="uc-btn" data-week-delta="-1" title="上一周">‹</button>
              <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
              <button type="button" class="uc-btn" data-week-delta="1" title="下一周">›</button>
              <button type="button" class="uc-btn" data-week-reset="1" title="回到当前周">本周</button>
              <span class="uc-week-cur">${_.length?_.length+" 课次":o.schedule&&o.schedule.error||""}</span>
            </div>
          </div>
          <div class="uc-bd"><div class="uc-schedule-wrap">${o.loading.schedule?'<div class="uc-loading">课表加载中</div>':_.length?x(_):`<div class="uc-empty">${n.escapeHtml(o.schedule&&o.schedule.error||"暂无课表数据")}</div>`}${S()}</div></div>
        </div>
      </div>
      <div class="uc-col">
        <div class="uc-card">
          ${D}
        </div>
        <div class="uc-card services">
          <div class="uc-hd">服务</div>
          <div class="uc-bd">${f()}</div>
        </div>
      </div>
    </div>`}function z(){let g=n.personalizedProfile(o.profile||{}),_=o.schedule&&o.schedule.courses||[],P=o.scores&&o.scores.passing&&o.scores.passing[0]||{summary:n.summarizeCourses([])},T=(o.scores&&o.scores.schemes||[])[o.activeSchemeIdx]||{summary:n.summarizeCourses([])},L=g.avatar?`<img src="${n.escapeHtml(g.avatar)}" alt="">`:`<span>${n.escapeHtml((g.name||"同")[0])}</span>`;if(o.mobileTab==="scores"){let F=`<div class="uc-score-grid uc-score-grid-mobile">
        <div class="uc-score-pane" data-score="passing" style="margin-bottom:12px"><h5>全部及格成绩</h5>${d(P.summary,"passing")}</div>
        <div class="uc-score-pane" data-score="scheme"><h5>方案成绩</h5>${d(T.summary,"scheme")}</div>
      </div>`;return`<div class="uc-mobile"><div class="uc-card">${C(F)}</div></div>`}return o.mobileTab==="room"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-hd">教室查询</div><div class="uc-bd" id="uc-room-panel">${E()}</div></div></div>`:o.mobileTab==="more"?`<div class="uc-mobile"><div class="uc-card"><div class="uc-bd">${f()}</div></div></div>`:`<div class="uc-mobile">
      <div class="uc-card uc-profile-card" style="margin-bottom:12px"><div class="uc-bd"><div class="uc-profile">
        <div class="uc-avatar" data-urppp-private="avatar">${L}</div>
        <div><div class="uc-name" data-urppp-private="name">${n.escapeHtml(g.name||"同学")}</div>
        <div class="uc-sub">主修方案：<span data-urppp-private="organization" data-urppp-edit-key="majorPlan">${n.escapeHtml(g.majorPlan||"—")}</span></div>
        <div class="uc-gpa">主修必修绩点 <span data-urppp-private="gpa" data-urppp-edit-key="majorGpa">${n.escapeHtml(String(g.majorGpa||"—"))}</span></div></div>
      </div>${(()=>{try{return Ji()}catch{return""}})()}</div></div>
      <div class="uc-card"><div class="uc-hd"><span class="uc-hd-title">课表<span data-schedule-export-host="clean"></span></span>
        <div class="uc-week-nav">
          <button type="button" class="uc-btn" data-week-delta="-1">‹</button>
          <span class="uc-week-label">第${n.getViewWeekNumber()}周</span>
          <button type="button" class="uc-btn" data-week-delta="1">›</button>
          <button type="button" class="uc-btn" data-week-reset="1">本周</button>
        </div>
      </div><div class="uc-bd"><div class="uc-schedule-wrap">${o.loading.schedule?'<div class="uc-loading">课表加载中</div>':_.length?x(_):`<div class="uc-empty">${n.escapeHtml(o.schedule&&o.schedule.error||"暂无课表数据")}</div>`}${S()}</div></div></div>
    </div>`}function E(){if(o.loading.room)return'<div class="uc-loading">教学楼加载中</div>';let g=o.catalog||[];return g.length?g.slice().sort((P,T)=>(/江安/.test(P.campus)?-1:0)-(/江安/.test(T.campus)?-1:0)).map(P=>`
      <div style="margin-bottom:14px">
        <div style="font-weight:700;margin:0 0 8px">${n.escapeHtml(P.campus)}</div>
        <div class="uc-build-grid">
          ${P.buildings.map(T=>`<button type="button" data-build-path="${n.escapeHtml(T.path)}" data-cn="${n.escapeHtml(T.campusNumber||"")}" data-bn="${n.escapeHtml(T.buildingNumber||"")}">${n.escapeHtml(T.name)}</button>`).join("")}
        </div>
      </div>`).join(""):`<div class="uc-empty">${n.escapeHtml(o.roomError||"未读到教学楼列表")}<div style="margin-top:10px"><button type="button" class="uc-btn" data-room-reload="1">重新加载</button></div></div>`}function h(g,_){if(!g||!g.rooms||!g.rooms.length)return'<div class="uc-empty">该楼暂无教室占用数据</div>';let P='<tr><th class="sticky">教室</th><th class="sticky2">座位</th>';for(let I=1;I<=12;I++)P+=`<th class="sec">${I}</th>`;P+="</tr>";let T=g.rooms.map(I=>{let D=`<tr><th class="sticky">${n.escapeHtml(I.name)}</th><th class="sticky2">${n.escapeHtml(I.seats)}</th>`;for(let W=1;W<=12;W++){let H=(I.slots||[]).find(et=>et.section===W)||{busy:!1};if(H.busy){let et=H.reason||H.typeLabel||"占用",pt=H.typeLabel||n.occupancyTypeLabel({occupancymoduleId:H.module}),mt=H.displayChar||n.firstContentChar(et)||n.firstContentChar(pt)||"占",G=Object.assign({},H.detail||{room:I.name,section:W,reason:et},{reason:et,typeLabel:pt,contentName:H.contentName||H.detail&&H.detail.contentName||""}),V=n.escapeHtml(JSON.stringify(G));D+=`<td><button type="button" class="uc-slot busy ${n.occupancyKindClass(pt)}" data-occ='${V}' title="${n.escapeHtml(I.name)} 第${W}节 · ${n.escapeHtml(et)}">${n.escapeHtml(mt)}</button></td>`}else D+=`<td><div class="uc-slot free" title="${n.escapeHtml(I.name)} 第${W}节 · 空闲"></div></td>`}return D+"</tr>"}).join(""),L=Number(g.dateOffset!=null?g.dateOffset:o.roomDateOffset)||0,F=(I,D)=>`<button type="button" class="uc-btn${L===I?" primary":""}" data-room-day="${I}">${D}</button>`;return`
      <div class="uc-occ-head">
        <div>
          <div class="uc-occ-title">${n.escapeHtml(_||"")}</div>
          <div class="uc-sub">${n.escapeHtml(g.dateLabel||"")}${g.jxzc?" · 教学第"+g.jxzc+"周":""}</div>
          <div class="uc-room-days">
            ${F(0,"今天")}
            ${F(1,"明天")}
            ${F(2,"后天")}
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
      <div class="uc-occ"><table class="uc-occ-table">${P}${T}</table></div>`}function b(){let g=n.ensureRoot(),_=g.querySelector("#uc-body");n.getViewWeekNumber();let P=typeof window<"u"&&window.matchMedia?window.matchMedia:null,T=P&&P("(max-width:900px)").matches,L=!o.uiReady;_.innerHTML=T?z():y(),L?(o.uiReady=!0,g.classList.remove("uc-settled"),clearTimeout(g.__ucSettleTimer),g.__ucSettleTimer=setTimeout(()=>{o.open&&g.classList.add("uc-settled")},480)):g.classList.add("uc-settled"),n.bindUI(_),n.applyPersonalDisplay(_)}function v(){if(!o.open||l)return;let g=()=>{l=0,o.open&&b()},_=typeof requestAnimationFrame=="function"?requestAnimationFrame:null;l=_?_(g):setTimeout(g,0)}return{analysisHtml:k,metricHtml:d,occupancyHtml:h,render:b,renderScheduleBoard:x,roomPickerHtml:E,scheduleRender:v,scoreSectionHtml:C}}function Xi({state:o,deps:n}){function l(y,z){return!y||(y.__urpppCleanUiBindings||(y.__urpppCleanUiBindings=new Set),y.__urpppCleanUiBindings.has(z))?!1:(y.__urpppCleanUiBindings.add(z),!0)}function c(y){if(!y)return;try{n.bindScheduleExportHosts(y)}catch(E){console.warn("[URP++] schedule export menu",E)}y.querySelectorAll("[data-score]").forEach(E=>{l(E,"score")&&E.addEventListener("click",()=>A(E.getAttribute("data-score")))}),y.querySelectorAll("[data-sa-tab]").forEach(E=>{l(E,"saTab")&&E.addEventListener("click",()=>{o.scoreAnalysisTab=E.getAttribute("data-sa-tab")==="analysis"?"analysis":"overview",n.render()})}),y.querySelectorAll("[data-href]").forEach(E=>{l(E,"href")&&E.addEventListener("click",h=>{let b=E.getAttribute("data-href");b&&(h.preventDefault(),n.closeCleanMode(),location.href=b)})}),y.querySelectorAll("[data-eval-url]").forEach(E=>{l(E,"eval")&&E.addEventListener("click",h=>{let b=E.getAttribute("data-eval-url");b&&(h.preventDefault(),h.stopPropagation(),n.closeCleanMode(),location.href=b)})}),y.querySelectorAll('[data-action="room"]').forEach(E=>{l(E,"room")&&E.addEventListener("click",()=>x())}),y.querySelectorAll("[data-room-reload]").forEach(E=>{l(E,"roomReload")&&E.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),n.ensureRoomCatalogLoaded(!0)})}),y.querySelectorAll("[data-build-path]").forEach(E=>{l(E,"building")&&E.addEventListener("click",async()=>{let h=E.getAttribute("data-build-path"),b=(E.textContent||"").trim(),v=E.getAttribute("data-cn")||"",g=E.getAttribute("data-bn")||"",_=E.closest("#uc-room-panel")||E.closest("#uc-modal-body")||null;o.roomDateOffset=0,await f({path:h,name:b,campusNumber:v,buildingNumber:g,dateOffset:0},b,_)})}),y.querySelectorAll("[data-room-day]").forEach(E=>{l(E,"roomDay")&&E.addEventListener("click",async h=>{h.preventDefault(),h.stopPropagation();let b=parseInt(E.getAttribute("data-room-day")||"0",10)||0;if(!o.currentBuilding)return;o.roomDateOffset=b;let v=Object.assign({},o.currentBuilding,{dateOffset:b}),g=E.closest("#uc-room-panel")||E.closest("#uc-modal-body")||null;await f(v,v.name||"",g)})});let z=y.querySelector("#uc-room-back");z&&(z.onclick=()=>{o.occupancy=null,o.currentBuilding=null;let E=z.closest("#uc-room-panel")||document.querySelector("#uc-room-panel")||document.querySelector("#uc-modal-body");E&&E.id==="uc-modal-body"||E&&E.id==="uc-room-panel"?(E.innerHTML=n.roomPickerHtml(),c(E)):n.render()}),y.querySelectorAll(".uc-slot.busy[data-occ]").forEach(E=>{l(E,"occupancy")&&E.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation();try{let b=JSON.parse(E.getAttribute("data-occ")||"{}");k("占用详情",`
            <div class="uc-occ-detail">
              <div class="uc-name">${n.escapeHtml(b.room||"")}</div>
              <div class="uc-sub" style="margin-top:8px">节次：第${n.escapeHtml(String(b.section||b.start||""))}${b.span>1?"-"+(Number(b.start||b.section)+Number(b.span)-1):""}节</div>
              <div class="uc-sub">占用类型：${n.escapeHtml(b.typeLabel||b.reason||"占用")}</div>
              <div class="uc-sub">具体内容：${n.escapeHtml(b.contentName||b.reason||"—")}</div>
              ${b.teacher?`<div class="uc-sub">教师：${n.escapeHtml(b.teacher)}</div>`:""}
              ${b.weeks?`<div class="uc-sub">周次：${n.escapeHtml(b.weeks)}</div>`:""}
              ${b.courseNo?`<div class="uc-sub">课程号：${n.escapeHtml(b.courseNo)}</div>`:""}
            </div>
          `,"",{stack:!0})}catch{}})}),y.querySelectorAll(".uc-lesson[data-course]").forEach(E=>{l(E,"course")&&E.addEventListener("click",h=>{h.stopPropagation();try{let b=JSON.parse(E.getAttribute("data-course")||"{}"),v=`第${b.section||"?"}${b.span>1?"-"+(Number(b.section)+Number(b.span)-1):""}节`,g=(b.others||[]).map(_=>`<div class="uc-course-sub ${_.thisWeek?"":"is-fade"}">
              <div class="uc-cd-name">${n.escapeHtml(_.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([_.place,_.week,_.teacher].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${_.thisWeek?"当前周有课":"当前周无课"}</div>
            </div>`).join("");k("课程详情",`
            <div class="uc-course-detail">
              <div class="uc-cd-name">${n.escapeHtml(b.name||"")}</div>
              <div class="uc-cd-meta">${n.escapeHtml([b.place,b.teacher,b.week].filter(Boolean).join(" · "))||"—"}</div>
              <div class="uc-cd-chip">${b.thisWeek?"当前周有课":"当前周无课"} · ${n.escapeHtml(v)} · ${n.escapeHtml(n.DAY_NAMES[b.day]||"")}</div>
            </div>
            ${g?'<div class="uc-hd" style="border:0;padding:14px 0 6px">同时段其他课程</div>'+g:""}
          `,"")}catch{}})}),y.querySelectorAll("[data-week-delta]").forEach(E=>{l(E,"weekDelta")&&E.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation();let b=parseInt(E.getAttribute("data-week-delta")||"0",10)||0,v=o.schedule&&o.schedule.courses||[],g=n.inferMaxWeek(v),_=n.getViewWeekNumber();o.weekLocked=!0,o.viewWeek=Math.min(g,Math.max(1,_+b)),n.render();let P=document.querySelector("#urppp-clean-root .uc-week-label");P&&(P.classList.remove("uc-pop"),P.offsetWidth,P.classList.add("uc-pop"))})}),y.querySelectorAll("[data-week-reset]").forEach(E=>{l(E,"weekReset")&&E.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),o.weekLocked=!1;let b=n.getCurrentWeekNumber()||o._termWeek||1;o.viewWeek=b,n.render();let v=document.querySelector("#urppp-clean-root .uc-week-label");v&&(v.classList.remove("uc-pop"),v.offsetWidth,v.classList.add("uc-pop"))})})}let d=[];function k(y,z,E,h){h=h||{};let b=n.ensureRoot(),v=b.querySelector("#uc-mask"),g=b.querySelector("#uc-modal");h.stack&&g.classList.contains("open")?d.push({title:b.querySelector("#uc-modal-title").textContent,body:b.querySelector("#uc-modal-body").innerHTML,ft:b.querySelector("#uc-modal-ft").innerHTML}):h.stack||(d.length=0),v.classList.add("open"),g.classList.add("open"),b.querySelector("#uc-modal-title").textContent=y,b.querySelector("#uc-modal-body").innerHTML=z,b.querySelector("#uc-modal-ft").innerHTML=E||"",c(b.querySelector("#uc-modal-body")),c(b.querySelector("#uc-modal-ft")),n.applyPersonalDisplay(b.querySelector("#uc-modal"))}function C(){let y=n.rootEl();if(y){if(d.length){let z=d.pop();y.querySelector("#uc-modal-title").textContent=z.title,y.querySelector("#uc-modal-body").innerHTML=z.body,y.querySelector("#uc-modal-ft").innerHTML=z.ft||"",c(y.querySelector("#uc-modal-body")),c(y.querySelector("#uc-modal-ft"));return}y.querySelector("#uc-mask").classList.remove("open"),y.querySelector("#uc-modal").classList.remove("open")}}function A(y){let z=o.scores&&o.scores.passing&&o.scores.passing[0]||{courses:[],summary:n.summarizeCourses([])},E=o.scores&&o.scores.schemes||[];y==="scheme"&&o.scores&&o.scores.majorIdx!=null&&o._schemeInited!==!0&&(o.activeSchemeIdx=o.scores.majorIdx||0,o._schemeInited=!0);let h=E[o.activeSchemeIdx]||E[0]||{courses:[],summary:n.summarizeCourses([]),title:"方案成绩"},b=y==="scheme"?h:z,v=y==="scheme"?"scheme":"passing";o.selected[v]||(o.selected[v]=new Set);let g=y==="scheme"&&E.length>1?`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">${E.map((X,ct)=>`<button type="button" class="uc-btn ${ct===o.activeSchemeIdx?"primary":""}" data-scheme-idx="${ct}"><span data-urppp-private="organization">${n.escapeHtml((X.title||"方案").slice(0,28))}</span></button>`).join("")}</div>`:"",_=X=>{let ct=!!(X&&(X.unevaluated||n.isUnevaluatedScore(X.score))),kt=n.scoreToNumber(X&&X.score),wt="";ct?wt=kt!=null&&kt<60?"uneval-fail":"uneval":kt!=null?wt=kt>=60?"pass":"fail":/不及格|不合格|不通过/.test(String(X&&X.score||""))?wt="fail":X&&X.score&&(wt="pass");let Ct=n.escapeHtml(X&&X.score||"—"),N=ct?X.evalUrl||"/student/teachingEvaluation/newEvaluation/index":"";return N?`<span class="uc-score-cell ${wt}" data-eval-url="${n.escapeHtml(N)}" title="未评教，点击前往评教">${Ct}</span>`:`<span class="uc-score-cell ${wt}">${Ct}</span>`},P=(b.courses||[]).map((X,ct)=>{let kt=o.selected[v].has(ct),wt=n.isValidOfficialGpa(X.officialGpa)?X.officialGpa:n.scoreToGpa(X.score),Ct=!!(X.unevaluated||n.isUnevaluatedScore(X.score));return`<tr class="${kt?"is-on":""}${Ct?" is-uneval":""}" data-idx="${ct}">
        <td class="uc-namecell"><span class="uc-selmark" aria-hidden="true">${kt?"✓":""}</span><span class="uc-cname">${n.escapeHtml(X.name)}</span></td>
        <td><span class="uc-attr-pill">${n.escapeHtml(X.attr||"—")}</span></td>
        <td data-urppp-private="credit">${X.credit}</td>
        <td data-urppp-private="grade">${_(X)}</td>
        <td data-urppp-private="gpa">${Ct||wt==null?"—":wt}</td>
      </tr>`}).join("");k(y==="scheme"?"方案成绩 · "+(h.title||""):"全部及格成绩",`
      ${g}${n.metricHtml(b.summary,y==="scheme"?"scheme":"passing")}
      <div id="uc-score-wrap">
        <table class="uc-table" id="uc-score-table"><thead><tr><th>课程</th><th>属性</th><th>学分</th><th>成绩</th><th>绩点</th></tr></thead>
        <tbody>${P||'<tr><td colspan="5">暂无数据</td></tr>'}</tbody></table>
        <div class="uc-select-box" id="uc-select-box"></div>
      </div>`,'<div id="uc-calc">已选 0 门</div><button type="button" class="uc-btn" id="uc-clear">清空</button>');let T=document.querySelector("#uc-modal-title");T&&(y==="scheme"?T.setAttribute("data-urppp-private","organization"):T.removeAttribute("data-urppp-private"),n.applyPersonalDisplay(T.parentElement||T));let L=document.querySelector("#uc-modal-body"),F=document.getElementById("uc-calc"),I=document.getElementById("uc-score-table"),D=document.getElementById("uc-score-wrap"),W=document.getElementById("uc-select-box"),H=()=>{I.querySelectorAll("tbody tr[data-idx]").forEach(kt=>{let wt=parseInt(kt.getAttribute("data-idx"),10),Ct=o.selected[v].has(wt);kt.classList.toggle("is-on",Ct);let N=kt.querySelector(".uc-selmark");N&&(N.textContent=Ct?"✓":"")});let X=[];o.selected[v].forEach(kt=>{b.courses[kt]&&X.push(b.courses[kt])});let ct=n.summarizeCoursesPreferOfficial(X);F&&(F.className="uc-calc",F.innerHTML=X.length?`已选 <b>${X.length}</b> 门 · 学分 <b data-urppp-private="credit">${ct.totalCredit}</b> · 均分 <b data-urppp-private="grade">${ct.avgScore}</b> · 绩点 <b data-urppp-private="gpa">${ct.avgGpa}</b>`:"已选 0 门")},et=(X,ct)=>{ct===!0?o.selected[v].add(X):ct===!1||o.selected[v].has(X)?o.selected[v].delete(X):o.selected[v].add(X)},pt=!1;I.querySelectorAll("tbody tr[data-idx]").forEach(X=>{X.addEventListener("click",ct=>{if(pt){pt=!1;return}let kt=parseInt(X.getAttribute("data-idx"),10);et(kt),H()})});let mt=!1,G=0,V=0,at=null,Q=()=>Array.from(I.querySelectorAll("tbody tr[data-idx]")),lt=(X,ct)=>{if(!W||!D)return{left:0,top:0,right:0,bottom:0,w:0,h:0};let kt=D.getBoundingClientRect(),wt=Math.min(G,X),Ct=Math.min(V,ct),N=Math.max(G,X),J=Math.max(V,ct),tt=N-wt,ht=J-Ct,bt=wt-kt.left+D.scrollLeft,zt=Ct-kt.top+D.scrollTop;return W.style.display=tt>3||ht>3?"block":"none",W.style.left=bt+"px",W.style.top=zt+"px",W.style.width=tt+"px",W.style.height=ht+"px",{left:wt,top:Ct,right:N,bottom:J,w:tt,h:ht}},rt=X=>{if(!mt)return;X.preventDefault();let ct=lt(X.clientX,X.clientY);ct.w<=3&&ct.h<=3||(o.selected[v]=new Set(at),Q().forEach(kt=>{let wt=kt.getBoundingClientRect();if(!!(wt.right<ct.left||wt.left>ct.right||wt.bottom<ct.top||wt.top>ct.bottom))return;let N=parseInt(kt.getAttribute("data-idx"),10);at.has(N)?o.selected[v].delete(N):o.selected[v].add(N)}),H())},it=X=>{let ct=Math.abs(X.clientX-G)>3||Math.abs(X.clientY-V)>3;mt=!1,W&&(W.style.display="none"),document.removeEventListener("mousemove",rt,!0),document.removeEventListener("mouseup",it,!0),ct&&(pt=!0),H()};D.addEventListener("mousedown",X=>{X.button===0&&(mt=!0,G=X.clientX,V=X.clientY,at=new Set(o.selected[v]),lt(G,V),document.addEventListener("mousemove",rt,!0),document.addEventListener("mouseup",it,!0))}),L.querySelectorAll("[data-scheme-idx]").forEach(X=>X.addEventListener("click",()=>{o.activeSchemeIdx=parseInt(X.getAttribute("data-scheme-idx"),10)||0,o._schemeUserSelected=!0,A("scheme")}));let gt=document.getElementById("uc-clear");gt&&(gt.onclick=()=>{o.selected[v]=new Set,H()}),H()}async function x(){k("空闲教室",'<div class="uc-loading">加载教学楼</div>',"");try{await n.ensureRoomCatalogLoaded(!1),k("空闲教室",n.roomPickerHtml(),'<span class="uc-sub">选择楼栋查看教室×节次占用（对齐教室使用状况）</span>')}catch(y){k("空闲教室",`<div class="uc-empty">${n.escapeHtml(y&&y.message||y)}</div>`,"")}}function S(y){if(y&&y.isConnected)return y;let z=document.querySelector("#uc-room-panel");if(z&&z.offsetParent!==null||z&&o.mobileTab==="room")return z;let E=document.querySelector("#uc-modal-body"),h=document.querySelector("#uc-modal");return h&&h.classList.contains("open")&&E?E:z||E||null}async function f(y,z,E){let h=S(E);if(!h){console.warn("[URP++] no room host");return}h.innerHTML='<div class="uc-loading">加载占用网格</div>';try{let b=await n.loadBuildingOccupancy(y);h.innerHTML='<div class="uc-loading">匹配课程名称</div>';let v=b.planNumber||"";if(!v)try{let P=await n.fetchText("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),T=JSON.parse(P);if(v=T&&(T.zxjxjhh||T.xnxq||T.dateList&&T.dateList[0]&&T.dateList[0].zxjxjhh)||"",!v&&T&&T.xkxx&&T.xkxx[0]){let L=Object.keys(T.xkxx[0]||{}),F=L.length?T.xkxx[0][L[0]]:null;v=F&&(F.zxjxjhh||F.executiveEducationPlanNumber)||""}}catch{}v||(v="2025-2026-2-1"),b.planNumber=v;try{b=await n.enrichOccupancyWithCurriculum(b,typeof y=="object"?y:{},v)}catch(P){console.warn("[URP++] enrich occupancy",P)}o.occupancy=b,o.roomDateOffset=Number(b.dateOffset!=null?b.dateOffset:o.roomDateOffset)||0;let g=typeof y=="object"?y:{path:y,name:z};o.currentBuilding=Object.assign({},g,{name:z||g.name||"",dateOffset:o.roomDateOffset}),z=z||y&&y.name||"";let _=S(h)||h;_.innerHTML=n.occupancyHtml(b,z),c(_)}catch(b){let v=S(h)||h;v&&(v.innerHTML=`<div class="uc-empty">${n.escapeHtml(b&&b.message||b)}</div>`)}}return{bindUI:c,closeModal:C,getRoomHost:S,openModal:k,openRoomModal:x,openScoreModal:A,showBuilding:f}}function ts({state:o,deps:n}){function l(){return document.getElementById("urppp-clean-root")}function c(){n.ensureStyle();let x=l();if(x)return x;x=document.createElement("div"),x.id="urppp-clean-root",x.innerHTML=`
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
          <button type="button" class="uc-btn" id="uc-refresh">${n.ico("refresh")}<span>刷新</span></button>
          <button type="button" class="uc-btn primary" id="uc-exit">${n.ico("exit")}<span>退出</span></button>
        </div>
      </div>
      <div class="uc-shell"><div class="uc-shell-inner" id="uc-body"></div></div>
      <div class="uc-tabbar" id="uc-tabbar">
        <button type="button" data-tab="home" class="ac">${n.ico("home")}<span>首页</span></button>
        <button type="button" data-tab="scores">${n.ico("score")}<span>成绩</span></button>
        <button type="button" data-tab="room">${n.ico("room")}<span>教室</span></button>
        <button type="button" data-tab="more">${n.ico("more")}<span>其他</span></button>
      </div>
      <div class="uc-mask" id="uc-mask"></div>
      <div class="uc-modal" id="uc-modal">
        <div class="uc-modal-hd"><span id="uc-modal-title">详情</span><button type="button" class="uc-btn" id="uc-modal-close">${n.ico("close")}</button></div>
        <div class="uc-modal-bd" id="uc-modal-body"></div>
        <div class="uc-modal-ft" id="uc-modal-ft"></div>
      </div>`,document.documentElement.appendChild(x),x.querySelector("#uc-exit").onclick=k,x.querySelector("#uc-refresh").onclick=()=>d(!0),x.querySelector("#uc-mask").onclick=n.closeModal,x.querySelector("#uc-modal-close").onclick=n.closeModal;let S=()=>{n.syncThemeDotGroup(x.querySelector("#uc-top-theme"))};x.querySelectorAll("#uc-top-theme .urppp-nav-dot[data-theme]").forEach(v=>{v.addEventListener("click",()=>{n.handleThemeDotClick(v.dataset.theme),S();try{n.syncNavbarThemeUI()}catch{}try{n.syncSettingsPanelUI()}catch{}})});let f=x.querySelector("#uc-settings");f&&f.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation();try{n.openSettingsPanel()}catch{}});let y=x.querySelector("#uc-menu-toggle"),z=v=>{v.classList.remove("urppp-clean-sidebar");let g=v.__urpppCleanInline;if(g){let P=v.style,T=(L,F)=>{let I=g[F];I&&I.v?P.setProperty(L,I.v,I.p||""):P.removeProperty(L)};T("top","top"),T("height","height"),T("z-index","z"),T("position","pos"),T("transform","transform"),T("visibility","vis"),T("pointer-events","pe"),T("transition","transition"),delete v.__urpppCleanInline}let _=v.__urpppCleanOrigin;_&&_.parent&&v.parentElement!==_.parent&&(_.next&&_.next.parentElement===_.parent?_.parent.insertBefore(v,_.next):_.parent.appendChild(v)),delete v.__urpppCleanOrigin},E=()=>{let v=document.getElementById("sidebar");if(v)if(o.open){if(v.classList.add("urppp-clean-sidebar"),!v.__urpppCleanInline){let F=v.style,I=D=>({v:F.getPropertyValue(D),p:F.getPropertyPriority(D)});v.__urpppCleanInline={top:I("top"),height:I("height"),z:I("z-index"),pos:I("position"),transform:I("transform"),vis:I("visibility"),pe:I("pointer-events"),transition:I("transition")},v.__urpppCleanOrigin={parent:v.parentElement,next:v.nextSibling}}if(v.parentElement!==x){let F=x.querySelector(".uc-shell");x.insertBefore(v,F||null)}let g=x.getBoundingClientRect(),_=x.querySelector(".uc-top"),P=_?_.getBoundingClientRect():null,T=Math.max(44,Math.round(P?P.bottom-g.top:60)),L=Math.max(0,Math.round(g.height-T));v.style.setProperty("top",T+"px","important"),v.style.setProperty("height",L+"px","important"),v.style.setProperty("z-index","12030","important"),v.style.setProperty("position","fixed","important")}else z(v)},h=()=>{let v=document.getElementById("sidebar");if(!v)return;try{n.stopDrawerAnimation(v)}catch{}v.classList.remove("display","urppp-drawer-closing"),z(v),y&&(y.setAttribute("aria-expanded","false"),y.setAttribute("aria-label","打开菜单"));let g=document.getElementById("urppp-mobile-menu-button");g&&(g.setAttribute("aria-expanded","false"),g.setAttribute("aria-label","打开菜单"))};y&&y.addEventListener("click",v=>{v.preventDefault(),v.stopImmediatePropagation();let g=document.getElementById("sidebar");if(!g)return;g.__urpppCleanMenuBound||(g.__urpppCleanMenuBound=!0,g.addEventListener("click",T=>{if(!o.open)return;let L=T.target&&T.target.closest?T.target.closest("a[href]"):null;if(!L||L.closest("#urppp-mobile-search-panel"))return;let F=String(L.getAttribute("href")||"").trim();if(L.closest("#urppp-mobile-quick, #urppp-mobile-user")){if(!F||F==="#"||F.startsWith("javascript")||L.target==="_blank"||/^https?:\/\//i.test(F))return;k();return}!F||F==="#"||F.startsWith("javascript")||L.target==="_blank"||/^https?:\/\//i.test(F)||k()},!0));let _=!g.classList.contains("display");E(),n.setDrawerOpen(g,y,_);let P=document.getElementById("urppp-mobile-menu-button");P&&(P.setAttribute("aria-expanded",_?"true":"false"),P.setAttribute("aria-label",_?"关闭菜单":"打开菜单"))}),x.__closeCleanDrawer=h,x.__syncCleanSidebarZ=E,x.__syncCleanThemeDots=S;let b=globalThis.ResizeObserver;if(typeof b=="function"){let v=new b(()=>{o.open&&E()});v.observe(x);let g=x.querySelector(".uc-top");g&&v.observe(g),x.__cleanSidebarResizeObserver=v}try{let v=window.matchMedia&&window.matchMedia("(max-width: 900px)");if(v){let g=()=>{o.open&&(E(),n.render())};typeof v.addEventListener=="function"?v.addEventListener("change",g):typeof v.addListener=="function"&&v.addListener(g),x.__scoreLayoutMedia=v,x.__scoreLayoutChange=g}}catch{}try{n.applySkinAttr()}catch{}return S(),x.querySelectorAll("#uc-tabbar button").forEach(v=>{v.onclick=()=>{o.mobileTab=v.dataset.tab,x.querySelectorAll("#uc-tabbar button").forEach(g=>g.classList.toggle("ac",g===v)),n.render(),o.mobileTab==="room"&&n.ensureRoomCatalogLoaded()}}),Ro(),Yi(x),x}function d(x){c();let S=o.open;o.open=!0,o.uiReady=!1,o.weekLocked=!1;let f=n.getCurrentWeekNumber()||n.readRememberedTermWeek();o.viewWeek=f>=1?f:o.viewWeek>=1?o.viewWeek:0,document.documentElement.classList.add("urppp-clean-lock",n.CLEAN_FLAG);let y=l();y.classList.remove("closing"),S||(y.classList.remove("uc-settled","open"),y.offsetWidth,y.classList.add("open"));try{n.stopDrawerAnimation(document.getElementById("sidebar"))}catch{}try{y.__syncCleanThemeDots&&y.__syncCleanThemeDots()}catch{}try{y.__syncCleanSidebarZ&&y.__syncCleanSidebarZ()}catch{}try{n.injectCleanSidebarSections(document.getElementById("sidebar"))}catch{}n.loadAll(!!x);try{n.ensureRoomCatalogLoaded()}catch{}}function k(){o.open=!1,o.uiReady=!1,n.closeModal(),document.documentElement.classList.remove("urppp-clean-lock",n.CLEAN_FLAG);let x=l();if(x){x.classList.remove("open","uc-settled","uc-drawer-open"),x.classList.add("closing"),clearTimeout(x.__ucSettleTimer);try{x.__closeCleanDrawer&&x.__closeCleanDrawer()}catch{}setTimeout(()=>{x.classList.remove("closing")},360)}try{n.refreshMobileNavbar()}catch{}}function C(){try{n.ensureStyle();let x=document.getElementById("urppp-nav-clean");if(!n.isHomePage()){x&&x.remove(),Ki();return}let S=document.getElementById("urppp-nav-theme")||document.querySelector("#navbar .navbar-header")||document.querySelector("#navbar");if(!S)return;x||(x=document.createElement("button"),x.type="button",x.id="urppp-nav-clean",x.title="清爽模式",x.innerHTML=`${n.ico("clean")}<span>清爽</span>`,x.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),d(!1)}),S.appendChild(x)),Object.entries({display:"inline-flex","align-items":"center",height:"28px","min-height":"28px",padding:"0 12px","font-size":"12px",gap:"6px",width:"auto",float:"none"}).forEach(([f,y])=>x.style.setProperty(f,y,"important")),Ro();try{Qi()}catch{}}catch(x){console.warn("[URP++] clean entry",x)}}return{cleanModeApi:{open:d,close:k,inject:C,refresh:n.refreshCleanPersonalDisplay,refreshRender:()=>{try{n.render()}catch{}},scoreToGpa:n.scoreToGpa,summarizeCourses:n.summarizeCourses},closeCleanMode:k,ensureRoot:c,injectCleanEntry:C,openCleanMode:d,rootEl:l}}function es({deps:o}){function n(){if(window.__urpppScheduleHoverNear)return;window.__urpppScheduleHoverNear=!0;let C=12,A=16,x=0,S=0,f=!1,y=0,z=()=>document.getElementById("schedule-hover"),E=v=>{if(!v||v.style&&v.style.display==="none")return!1;let g=window.getComputedStyle(v);return g.display!=="none"&&g.visibility!=="hidden"},h=()=>{let v=z();if(!v||!E(v)){f=!1;return}f=!0;let g=window.innerWidth||1200,_=window.innerHeight||800,P=x+C,T=S+A,L=Math.min(320,v.offsetWidth||280),F=Math.min(220,v.offsetHeight||160);P+L>g-8&&(P=g-L-8),T+F>_-8&&(T=_-F-8),P<8&&(P=8),T<8&&(T=8),v.style.setProperty("position","fixed","important"),v.style.setProperty("left",Math.round(P)+"px","important"),v.style.setProperty("top",Math.round(T)+"px","important"),v.style.setProperty("right","auto","important"),v.style.setProperty("bottom","auto","important"),v.style.setProperty("margin","0","important"),v.style.setProperty("z-index","3000","important"),v.style.setProperty("pointer-events","none","important")},b=()=>{y||(y=requestAnimationFrame(()=>{y=0,h()}))};document.addEventListener("mousemove",v=>{if(x=v.clientX,S=v.clientY,!f){let g=z();g&&g.style&&g.style.display&&g.style.display!=="none"&&(f=!0)}f&&b()},!0),document.addEventListener("mouseover",v=>{v.target&&v.target.closest&&v.target.closest(".fc-event, .fc-time-grid-event")&&(x=v.clientX,S=v.clientY,setTimeout(()=>{f=!0,h()},0),setTimeout(h,40))},!0),document.addEventListener("mouseout",v=>{v.target&&v.target.closest&&v.target.closest(".fc-event, .fc-time-grid-event")&&setTimeout(()=>{let _=z();E(_)||(f=!1)},50)},!0)}function l(C){try{let A=!!(C&&C.force),x=typeof unsafeWindow<"u"&&unsafeWindow.jQuery?unsafeWindow.jQuery:window.jQuery||null;if(!x||!x.fn||!x.fn.fullCalendar)return!1;let S=document.getElementById("main-calendar")||document.querySelector("#urppp-left .fc, #urppp-dashboard .fc");if(!S)return!1;if(!A&&S.dataset.urpppFcSized==="1")return!0;let f=x(S);if(!(f.data("fullCalendar")||f.hasClass("fc")))return!1;let z=Array.from(S.querySelectorAll(".fc-scroller")).map(h=>({el:h,top:h.scrollTop,left:h.scrollLeft}));if(A||S.dataset.urpppFcRendered!=="1"){try{f.fullCalendar("render")}catch{}S.dataset.urpppFcRendered="1"}else try{f.fullCalendar("updateSize")}catch{}return requestAnimationFrame(()=>{z.forEach(h=>{try{h.el.scrollTop=h.top,h.el.scrollLeft=h.left}catch{}})}),(S.getBoundingClientRect().height||0)>=300&&(S.dataset.urpppFcSized="1"),!0}catch(A){return console.warn("[URP++] fullCalendar refresh failed",A),!1}}function c(){window.__urpppFcRefreshBound||(window.__urpppFcRefreshBound=!0,setTimeout(()=>l({force:!0}),0),setTimeout(()=>l({force:!1}),300))}function d(C,A,x){let S=C.querySelector(".widget-header"),f=S?S.querySelector(".widget-toolbar"):null,y=document.createElement("div");y.className="urppp-card",y.innerHTML=`
      <div class="urppp-card-header">
        <h4>${x}</h4>
        <div class="urppp-card-tools"></div>
      </div>
      <div class="urppp-card-body"></div>
    `,f&&(f.style.display="inline-block",y.querySelector(".urppp-card-tools").appendChild(f)),y.querySelector(".urppp-card-body").appendChild(C),A.appendChild(y)}function k(){try{n()}catch{}if(document.getElementById("urppp-dashboard"))return;let C=document.querySelector(".page-content");if(!C)return;let A=Array.from(C.querySelectorAll(".widget-box"));if(A.length<6)return;let x=A[4],S=x?Array.from(x.querySelectorAll(".infobox")):[],f=document.createElement("div");f.id="urppp-dashboard",f.innerHTML=`
      <div class="urppp-welcome">
        <h2>欢迎回来</h2>
        <p>四川大学教务管理系统 · 学生端</p>
      </div>
      <div class="urppp-stats-grid" id="urppp-stats"></div>
      <div class="urppp-main-grid">
        <div class="urppp-left" id="urppp-left"></div>
        <div class="urppp-right" id="urppp-right"></div>
      </div>
    `,C.appendChild(f);let y=C.querySelector("#warningInfo");y&&document.body.appendChild(y),A.forEach(g=>{let _=g.closest('.widget-container-col, [class*="col-"]');_&&(_.style.display="none")}),C.querySelectorAll(":scope > .row").forEach(g=>{g.style.display="none"});let z=f.querySelector("#urppp-stats"),E=Math.max(S.length,5);for(let g=0;g<E;g++){let _=document.createElement("div");_.className="urppp-stat-card urppp-stat-skeleton",_.innerHTML='<div class="value">-</div><div class="label">加载中</div>',z.appendChild(_)}function h(){let g=x?Array.from(x.querySelectorAll(".infobox")):[];g.length!==0&&(z.innerHTML="",g.forEach(_=>{let P=_.innerText.trim().split(/\n+/).map(et=>et.trim()).filter(et=>et),T=P[0]||"",L=P.slice(1).join(" ").replace(/更多\.\.\./g,"").trim(),I=/[\u4e00-\u9fa5]/.test(T)||T.length>5?"value urppp-stat-value-text":"value",D=_.closest("a"),W=document.createElement(D?"a":"div");D&&(W.href=D.href||"javascript:void(0)",W.onclick=D.onclick,W.style.textDecoration="none"),W.className="urppp-stat-card";let H=o.statCardPrivacyMarkup(T,L);W.innerHTML=`<div class="${I}">${H.valueHtml}</div><div class="label">${H.labelHtml}</div>`,z.appendChild(W)}))}if(h(),x){let g=new MutationObserver(()=>h());g.observe(x,{childList:!0,subtree:!0}),setTimeout(()=>g.disconnect(),5e3)}let b=f.querySelector("#urppp-left"),v=f.querySelector("#urppp-right");d(A[5],b,"我的日程安排"),d(A[0],v,"通知公告"),d(A[1],v,"我的待办任务"),d(A[2],v,"可申请业务"),d(A[3],v,"常用下载"),x&&(x.style.display="none"),c(),console.log("[URP++] 首页仪表板已重构")}return{rebuildDashboard:k,refreshHomeFullCalendar:l,scheduleHomeFullCalendarRefresh:c,wrapWidget:d}}function _e(o){return Math.round((Number(o)||0)*100)/100}var wd=[{key:"a",level:"A",range:"90-100",gpa:4,min:90,max:100},{key:"am",level:"A-",range:"85-89",gpa:3.7,min:85,max:89.999},{key:"bp",level:"B+",range:"82-84",gpa:3.3,min:82,max:84.999},{key:"b",level:"B",range:"78-81",gpa:3,min:78,max:81.999},{key:"bm",level:"B-",range:"75-77",gpa:2.7,min:75,max:77.999},{key:"cp",level:"C+",range:"72-74",gpa:2.3,min:72,max:74.999},{key:"c",level:"C",range:"68-71",gpa:2,min:68,max:71.999},{key:"cm",level:"C-",range:"64-67",gpa:1.7,min:64,max:67.999},{key:"dp",level:"D+",range:"60-63",gpa:1.3,min:60,max:63.999},{key:"d",level:"D",range:"60-62",gpa:1,min:60,max:62.999},{key:"f",level:"F",range:"<60",gpa:0,min:0,max:59.999}],rs={优秀:95,"A+":98,A:95,"A-":87,良好:85,"B+":83,B:79,"B-":76,中等:73,"C+":73,C:69,"C-":65,及格:62,"D+":62,D:60,不及格:50,F:50},kd=[{key:"required",label:"必修",test:o=>/必修/.test(o)},{key:"elective",label:"任选",test:o=>/任选/.test(o)},{key:"optional",label:"选修",test:o=>/选修/.test(o)},{key:"other",label:"其他",test:()=>!0}];function as(o){let n=String(o||"").match(/^(\d{4})-(\d{4})-(\d+)/);return n?`${n[1].slice(2)}-${n[2].slice(2)}-${n[3]}`:String(o||"")}function Aa({deps:o}){let n=o.scoreToNumber,l=o.scoreToGpa;function c(h){let b=n(h);if(b!=null)return b;let v=String(h||"").trim().toUpperCase();return rs[v]!=null?rs[v]:null}function d(h){return!h||h.unevaluated?!1:c(h.score)!=null}function k(h){let b=String(h||"").match(/^(\d{4})-(\d{4})-(\d+)/);return b?[Number(b[1]),Number(b[3])]:[9999,9999]}function C(h){let b=h&&h.passing&&h.passing[0];return b&&b.courses||[]}function A(h){let b=h&&h.officialGpa,v=Number(b);return b!=null&&Number.isFinite(v)&&v>=0&&v<=5?v:null}function x(h){let b=A(h);return b??l(h.score)}function S({scorePack:h,profile:b}){let v=C(h),g=b&&b.majorGpa?String(b.majorGpa).trim():"",_=0,P=0,T=0,L=0,F=0,I=0;return v.forEach(D=>{if(!d(D))return;let W=Number(D.credit)||0,H=c(D.score);if(H==null||W<=0)return;_+=W,P+=H*W;let et=x(D);et!=null&&(T+=et*W,L+=W,D.required&&(F+=et*W,I+=W))}),{majorGpa:g,requiredGpa:_e(I?F/I:0),avgGpa:_e(L?T/L:0),avgScore:_e(_?P/_:0),totalCredit:_e(_),courseCount:v.length}}function f(h){let b=new Map;return(h||[]).forEach(v=>{if(!d(v))return;let g=v.term||"未分组",_=b.get(g);_||(_={term:g,count:0,credit:0,scoreW:0,gpaW:0,gpaCredit:0},b.set(g,_));let P=Number(v.credit)||0,T=c(v.score);if(T==null||(_.count+=1,P<=0))return;_.credit+=P,_.scoreW+=T*P;let L=x(v);L!=null&&(_.gpaW+=L*P,_.gpaCredit+=P)}),Array.from(b.values()).map(v=>({term:v.term,label:as(v.term),count:v.count,credit:_e(v.credit),avgScore:_e(v.credit?v.scoreW/v.credit:0),avgGpa:_e(v.gpaCredit?v.gpaW/v.gpaCredit:0)})).sort((v,g)=>{let _=k(v.term),P=k(g.term);return _[0]-P[0]||_[1]-P[1]})}function y(h){let b=wd.map(g=>({...g,count:0,credit:0}));(h||[]).forEach(g=>{if(!d(g))return;let _=c(g.score);if(_==null)return;let P=b.find(T=>_>=T.min&&_<=T.max);P&&(P.count+=1,P.credit+=Number(g.credit)||0)});let v=b.reduce((g,_)=>Math.max(g,_.count),1);return b.map(g=>({...g,ratio:Math.round(g.count/v*100)}))}function z(h){let b=kd.map(P=>({...P,credit:0,count:0}));(h||[]).forEach(P=>{if(!d(P))return;let T=String(P.attr||""),L=b.find(F=>F.test(T));L&&(L.credit+=Number(P.credit)||0,L.count+=1)});let v=b.reduce((P,T)=>P+T.credit,0)||1,g=b.filter(P=>P.count>0).map(P=>({key:P.key,label:P.label,credit:_e(P.credit),count:P.count,ratio:Math.round(P.credit/v*100)})),_=g.find(P=>P.key==="required");return{items:g,requiredCredit:_?_.credit:0,requiredRatio:_?_.ratio:0}}function E({scorePack:h,profile:b}){let v=C(h);return{metrics:S({scorePack:h,profile:b}),trend:f(v),bands:y(v),share:z(v),empty:v.length===0}}return{analyzeScores:E,hasScore:d,officialGpa:A,scoreToNumberWithLevels:c,shortTerm:as}}var se="var(--text-secondary)",Uo="var(--border)";function le(o){return Z(String(o??""))}function os(o,n,l){let c=!!(o&&o.variant==="mobile");if(n==="trend"){if(!c)return{mobile:c,width:920,height:330,pad:{top:36,right:30,bottom:46,left:30}};let C={top:58,right:20,bottom:44,left:20},A=Math.max(56,Number(o&&o.slotWidth)||72);return{mobile:c,width:Math.max(300,C.left+C.right+Math.max(1,l)*A),height:286,pad:C}}if(!c)return{mobile:c,width:660,height:236,pad:{top:28,right:14,bottom:44,left:14}};let d={top:28,right:14,bottom:44,left:14},k=Math.max(44,Number(o&&o.slotWidth)||48);return{mobile:c,width:Math.max(320,d.left+d.right+Math.max(1,l)*k),height:236,pad:d}}function Ho({width:o,height:n,mobile:l,kind:c,label:d}){let k=l?` data-urppp-chart-layout="mobile" style="width:max(100%,${o}px);max-width:none;height:auto"`:"";return`<svg viewBox="0 0 ${o} ${n}" class="urppp-sa-chart" role="img" aria-label="${d}" data-urppp-chart-kind="${c}"${k}>`}function Sa({trend:o,palette:n,layout:l}){let c=(o||[]).filter(rt=>rt&&rt.avgScore!=null),d=os(l,"trend",c.length),{width:k,height:C,pad:A,mobile:x}=d,S=k-A.left-A.right,f=C-A.top-A.bottom;if(!c.length)return`${Ho({...d,kind:"trend",label:"学期成绩趋势"})}</svg>`;let y=c.length,z=rt=>A.left+(rt+.5)*(S/y),E=c.map(rt=>Number(rt.avgGpa)||0),h=c.map(rt=>Number(rt.avgScore)||0),b=c.map(rt=>Number(rt.credit)||0),v=Math.max(0,Math.min(...E)-.2),g=Math.min(5,Math.max(...E)+.2),_=Math.max(0,Math.min(...h)-4),P=Math.min(100,Math.max(...h)+4),T=Math.max(1,...b),L=g-v||1,F=P-_||1,I=rt=>A.top+f-(rt-v)/L*f,D=rt=>A.top+f-(rt-_)/F*f,W=rt=>A.top+f-rt/T*f*.9,H=c.map((rt,it)=>`${z(it)},${I(rt.avgGpa)}`).join(" "),et=c.map((rt,it)=>`${z(it)},${D(rt.avgScore)}`).join(" "),pt=[0,.25,.5,.75,1].map(rt=>{let it=A.top+f-rt*f;return`<line x1="${A.left}" y1="${it.toFixed(1)}" x2="${k-A.right}" y2="${it.toFixed(1)}" stroke="${Uo}" stroke-width="1" stroke-dasharray="3 4"/>`}).join(""),mt=c.map((rt,it)=>{let gt=z(it),X=x?Math.min(30,S/y*.42):Math.min(26,S/y*.32),ct=W(rt.credit);return`<rect x="${(gt-X/2).toFixed(1)}" y="${ct.toFixed(1)}" width="${X.toFixed(1)}" height="${(A.top+f-ct).toFixed(1)}" rx="3" fill="${n.credit}" opacity="0.55"/>
<text x="${gt.toFixed(1)}" y="${(ct-4).toFixed(1)}" text-anchor="middle" font-size="12" fill="${se}">${le(rt.credit)}</text>`}).join(""),G=c.map((rt,it)=>`<text x="${z(it).toFixed(1)}" y="${C-16}" text-anchor="middle" font-size="12" fill="${se}">${le(rt.label)}</text>`).join(""),V=c.map((rt,it)=>{let gt=S/y,X=z(it)-gt/2,ct=[`学期 ${rt.label}`,`课程 ${rt.count} 门`,`修读学分 ${rt.credit}`,`加权均分 ${rt.avgScore}`,`平均绩点 ${rt.avgGpa}`].join(`
`);return`<rect class="urppp-sa-hover" x="${X.toFixed(1)}" y="${A.top}" width="${gt.toFixed(1)}" height="${f.toFixed(1)}" fill="transparent"><title>${le(ct)}</title></rect>`}).join(""),at=c.map((rt,it)=>`<circle cx="${z(it).toFixed(1)}" cy="${I(rt.avgGpa).toFixed(1)}" r="3.5" fill="${n.gpaLine}"/><text x="${z(it).toFixed(1)}" y="${(I(rt.avgGpa)-9).toFixed(1)}" text-anchor="middle" font-size="11.5" font-weight="600" fill="${n.gpaLine}">${le(rt.avgGpa)}</text>`).join(""),Q=c.map((rt,it)=>`<circle cx="${z(it).toFixed(1)}" cy="${D(rt.avgScore).toFixed(1)}" r="3" fill="${n.scoreLine}"/><text x="${z(it).toFixed(1)}" y="${(D(rt.avgScore)+17).toFixed(1)}" text-anchor="middle" font-size="11.5" fill="${n.scoreLine}">${le(rt.avgScore)}</text>`).join(""),lt=x?`<g font-size="12">
  <rect x="${A.left}" y="30" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${A.left+18}" y="40" fill="${se}">学期平均绩点</text>
  <rect x="${A.left+132}" y="30" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${A.left+150}" y="40" fill="${se}">加权均分</text>
</g>`:`<g font-size="12">
  <rect x="${k-A.right-176}" y="8" width="12" height="12" rx="3" fill="${n.gpaLine}"/><text x="${k-A.right-158}" y="18" fill="${se}">学期平均绩点</text>
  <rect x="${k-A.right-82}" y="8" width="12" height="12" rx="3" fill="${n.scoreLine}"/><text x="${k-A.right-64}" y="18" fill="${se}">加权均分</text>
</g>`;return`${Ho({...d,kind:"trend",label:"学期成绩趋势"})}
${pt}
${mt}
<g>${V}</g>
<text x="${A.left}" y="18" font-size="12" fill="${se}">每学期修读学分（柱）</text>
<g stroke="${n.gpaLine}" stroke-width="2.2" fill="none"><polyline points="${H}"/></g>
<g stroke="${n.scoreLine}" stroke-width="1.8" stroke-dasharray="5 4" fill="none"><polyline points="${et}"/></g>
<g>${at}</g>
<g>${Q}</g>
<g>${G}</g>
${lt}
</svg>`}function _a({bands:o,palette:n,layout:l}){let c=o||[],d=os(l,"bands",c.length),{width:k,height:C,pad:A,mobile:x}=d,S=k-A.left-A.right,f=C-A.top-A.bottom,y=c.length||1,z=Math.max(1,...c.map(b=>b.count)),E=x?Math.min(32,S/y*.62):Math.min(40,S/y*.52),h=c.map((b,v)=>{let g=A.left+(v+.5)*(S/y),_=b.count?Math.max(8,b.count/z*f):0,P=A.top+f-_,T=(.4+(1-v/(y-1))*.6).toFixed(2),L=b.range||(b.min===0?"<60":`${b.min}-${b.max===100?"100":b.max}`),F=[`${b.level||""}（绩点 ${b.gpa}）`,`百分制 ${L}`,`课程 ${b.count} 门`].join(`
`);return`<rect class="urppp-sa-band" x="${(g-E/2).toFixed(1)}" y="${P.toFixed(1)}" width="${E.toFixed(1)}" height="${_.toFixed(1)}" rx="4" fill="${n.primary}" opacity="${T}"><title>${le(F)}</title></rect>
<text x="${g.toFixed(1)}" y="${(P-6).toFixed(1)}" text-anchor="middle" font-size="12.5" font-weight="600" fill="var(--text)">${le(b.count)}</text>
<text x="${g.toFixed(1)}" y="${C-26}" text-anchor="middle" font-size="11" font-weight="600" fill="${se}">${le(L)}</text>
<text x="${g.toFixed(1)}" y="${C-12}" text-anchor="middle" font-size="12" fill="${se}">${le(b.gpa)}</text>`}).join("");return`${Ho({...d,kind:"bands",label:"成绩分段分布"})}
<line x1="${A.left}" y1="${(A.top+f).toFixed(1)}" x2="${k-A.right}" y2="${(A.top+f).toFixed(1)}" stroke="${Uo}" stroke-width="1"/>
${h}
</svg>`}function ns({items:o,requiredRatio:n,palette:l}){let A=2*Math.PI*56,x=(o||[]).filter(z=>z&&z.ratio>0),S=Math.max(0,Math.min(100,Math.round(Number(n)||0)));if(!x.length)return'<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成"></svg>';let f=-90,y=x.map(z=>{let E=z.ratio/100*A,b=`<circle cx="75" cy="75" r="56" fill="none" stroke="${l.share&&l.share[z.key]||l.required}" stroke-width="24"
  stroke-dasharray="${E.toFixed(2)} ${A.toFixed(2)}"
  stroke-linecap="butt" transform="rotate(${f.toFixed(2)} 75 75)"/>`;return f+=z.ratio/100*360,b}).join("");return`<svg viewBox="0 0 150 150" class="urppp-sa-chart" role="img" aria-label="课程类型构成">
<circle cx="75" cy="75" r="56" fill="none" stroke="${Uo}" stroke-width="24"/>
${y}
<text x="75" y="69" text-anchor="middle" font-size="22" font-weight="700" fill="var(--text)">${le(S)}%</text>
<text x="75" y="91" text-anchor="middle" font-size="11.5" fill="${se}">必修学分占比</text>
</svg>`}var Ad=Object.freeze({gpaLine:"var(--primary)",scoreLine:"var(--text-secondary)",credit:"var(--primary)",primary:"var(--primary)",share:Object.freeze({required:"var(--primary)",elective:"var(--text-muted)",optional:"var(--text-secondary)",other:"var(--border)"})}),Sd='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>',_d='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';function ps({deps:o}){let n=o&&o.palette||Ad;function l(){return`<div id="urppp-score-analysis" class="urppp-sa" data-urppp-sa-state="collapsed">
  <button type="button" class="urppp-sa-toggle" aria-expanded="false">
    <span class="urppp-sa-icon">${Sd}</span>
    <span class="urppp-sa-title">成绩分析</span>
    <span class="urppp-sa-summary" data-urppp-sa-summary>点击展开，查看成绩指标与学期变化</span>
    <span class="urppp-sa-chevron">${_d}</span>
  </button>
  <div class="urppp-sa-body" data-urppp-sa-body hidden>
    <div class="urppp-sa-content" data-urppp-sa-content></div>
  </div>
</div>`}function c(){return'<div class="urppp-sa-loading"><span class="urppp-sa-spinner"></span><span>正在计算成绩分析…</span></div>'}function d(S){return`<div class="urppp-sa-error">${Z(String(S||"成绩数据加载失败"))}
  <button type="button" class="urppp-sa-retry" data-urppp-sa-retry>重试</button></div>`}function k(S){return[{label:"主修必修绩点",value:S.requiredGpa>0?String(S.requiredGpa):"—",hint:"必修课程加权"},{label:"平均绩点",value:S.avgGpa!=null?String(S.avgGpa):"—",hint:"全部及格加权"},{label:"加权均分",value:S.avgScore!=null?String(S.avgScore):"—",hint:"学分加权"},{label:"已修学分",value:S.totalCredit!=null?String(S.totalCredit):"—",hint:"及格课程学分"},{label:"已修课程",value:String(S.courseCount||0),hint:"含未评估"}].map(y=>`<div class="urppp-sa-metric">
  <div class="urppp-sa-metric-value">${Z(y.value)}</div>
  <div class="urppp-sa-metric-label">${Z(y.label)}</div>
  <div class="urppp-sa-metric-hint">${Z(y.hint)}</div>
</div>`).join("")}function C(S){return`<table class="urppp-sa-table">
<thead><tr><th>学期</th><th>课程</th><th>学分</th><th>加权均分</th><th>平均绩点</th></tr></thead>
<tbody>${(S||[]).map(y=>`<tr><td>${Z(y.label)}</td><td>${Z(y.count)}</td><td>${Z(y.credit)}</td><td>${Z(y.avgScore)}</td><td>${Z(y.avgGpa)}</td></tr>`).join("")}</tbody></table>`}function A(S){return(S||[]).map(f=>`<div class="urppp-sa-legend-item"><i class="urppp-sa-legend-dot" style="background:${n.share&&n.share[f.key]||n.primary}"></i>${Z(f.label)} ${Z(f.credit)} 学分 · ${Z(f.count)} 门</div>`).join("")}function x(S,f={}){if(!S||S.empty)return'<div class="urppp-sa-empty">暂无可用成绩数据，请先在教务系统查询成绩后再试。</div>';let y=S.share||{items:[],requiredRatio:0},z=f.chartLayout||null;return`<div class="urppp-sa-metrics">${k(S.metrics)}</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-trend">
    <h5 class="urppp-sa-card-title">学期趋势</h5>
    <div class="urppp-sa-chart-scroll">${Sa({trend:S.trend,palette:n,layout:z})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-share">
    <h5 class="urppp-sa-card-title">课程类型构成</h5>
    <div class="urppp-sa-share-body">
      <div class="urppp-sa-donut">${ns({items:y.items,requiredRatio:y.requiredRatio,palette:n})}</div>
      <div class="urppp-sa-legend">${A(y.items)}</div>
    </div>
  </section>
</div>
<div class="urppp-sa-grid">
  <section class="urppp-sa-card urppp-sa-bands">
    <h5 class="urppp-sa-card-title">成绩分段分布</h5>
    <div class="urppp-sa-chart-scroll">${_a({bands:S.bands,palette:n,layout:z})}</div>
  </section>
  <section class="urppp-sa-card urppp-sa-detail">
    <h5 class="urppp-sa-card-title">各学期明细</h5>
    ${C(S.trend)}
  </section>
</div>`}return{panelShellHtml:l,loadingHtml:c,errorHtml:d,analysisHtml:x,palette:n}}function is(){function o(n,l){let c=n.querySelector(".urppp-sa-toggle"),d=n.querySelector("[data-urppp-sa-body]");if(!c||!d)return{isExpanded:()=>!1,setExpanded:()=>{},syncShareLayout:()=>{}};let k=A=>{let x=A?"expanded":"collapsed";n.dataset.urpppSaState=x,c.setAttribute("aria-expanded",String(A)),d.hidden=!A,A&&typeof l.onExpand=="function"&&l.onExpand()};c.addEventListener("click",()=>{let A=c.getAttribute("aria-expanded")==="true";k(!A)}),d.addEventListener("click",A=>{let x=A.target;x&&x.closest&&x.closest("[data-urppp-sa-retry]")&&typeof l.onRetry=="function"&&l.onRetry()});function C(){let A=n.querySelector(".urppp-sa-donut"),x=n.querySelector(".urppp-sa-legend"),S=!!(A&&x&&x.getBoundingClientRect().top>=A.getBoundingClientRect().bottom);n.classList.toggle("urppp-sa-share-stacked",S)}return{setExpanded:k,syncShareLayout:C,isExpanded:()=>c.getAttribute("aria-expanded")==="true"}}return{bindPanel:o}}var ss="urppp-score-analysis";function ls({deps:o}){let n=Aa({deps:o}),l=ps({deps:o}),c=is(),d=null,k="idle",C=null,A=null,x=null,S=!1,f=0,y="desktop";function z(){if(!o.styles||document.getElementById("urppp-score-analysis-style"))return;let H=document.createElement("style");H.id="urppp-score-analysis-style",H.textContent=o.styles,(document.head||document.documentElement).appendChild(H)}function E(){if(typeof o.getInsertHost=="function"){let H=o.getInsertHost();if(H)return H}return document.querySelector(".page-content")||document.getElementById("page-content-template")||document.body}function h(){return d&&d.querySelector("[data-urppp-sa-content]")}function b(){return C||(k="loading",C=(async()=>{try{let[H,et]=await Promise.all([o.loadScores(),o.loadProfile()]);if(H&&H.error)throw new Error(H.error);let pt=n.analyzeScores({scorePack:H,profile:et});return A=pt,k="ready",pt}catch(H){throw k="error",H}finally{C=null}})(),C)}function v(){k==="idle"&&b().catch(()=>{})}function g(){if(x&&typeof x.syncShareLayout=="function")try{x.syncShareLayout()}catch{}}function _(){try{if(window.matchMedia&&window.matchMedia("(max-width: 720px)").matches)return{variant:"mobile"}}catch{}return null}function P(){let H=h();if(!H||!A)return;let et=_();y=et?et.variant:"desktop",H.innerHTML=l.analysisHtml(A,{chartLayout:et}),g()}function T(){clearTimeout(f),f=setTimeout(()=>{if(g(),!A||!x||!x.isExpanded())return;let H=_();(H?H.variant:"desktop")!==y&&P()},120)}function L(){S||(S=!0,window.addEventListener("resize",T))}function F(){S&&(S=!1,clearTimeout(f),f=0,window.removeEventListener("resize",T))}async function I(){let H=h();if(H){if(k==="ready"&&A){P();return}H.innerHTML=l.loadingHtml();try{await b(),P()}catch(et){H.innerHTML=l.errorHtml(et&&et.message||String(et))}}}function D(){if(z(),d&&d.isConnected)return d;if(document.getElementById(ss))return document.getElementById(ss);let H=E();if(!H)return null;let et=document.createElement("div");return et.innerHTML=l.panelShellHtml(),d=et.firstElementChild,H.insertBefore(d,H.firstChild),x=c.bindPanel(d,{onExpand:I,onRetry:I}),L(),v(),o.shouldAutoExpand&&o.shouldAutoExpand()&&(typeof requestAnimationFrame=="function"?requestAnimationFrame:mt=>setTimeout(mt,0))(()=>{try{x.setExpanded(!0)}catch{}}),d}function W(){F(),d&&d.isConnected&&d.remove(),d=null,x=null,k="idle",C=null,A=null,y="desktop"}return{mount:D,unmount:W,getPanel:()=>d,reset:W}}function cs({documentRef:o=document,locationRef:n=location,windowRef:l=window}){function c(S){return String(S||"").replace(/[\u00a0\s]+/g," ").replace(/^[>\u25b8\u203a·•\u00bb]+/,"").replace(/^\s*[\u25b8>]\s*/,"").trim()}function d(S){if(!S)return"";let f=S.querySelector(":scope > a");if(!f)return"";let y=f.querySelector(".menu-text, .urppp-nav-text");if(y)return c(y.textContent);let z=f.cloneNode(!0);return z.querySelectorAll("i, b, .badge, .arrow, .menu-icon, .urppp-nav-arrow").forEach(E=>E.remove()),c(z.textContent)}function k(S){let f=[],y=S,z=o.getElementById("menus")||o.getElementById("urppp-menus");for(;y&&y!==z;){if(y.tagName==="LI"){let E=d(y);E&&!/^(首页|一级菜单|二级菜单|三级菜单)$/.test(E)&&f.unshift(E)}y=y.parentElement}return f.filter((E,h)=>E&&E!==f[h-1])}function C(){let S=n.pathname.replace(/\/+$/,"")||"/",f=n.search||"",y=[];return[o.getElementById("menus"),o.getElementById("urppp-menus")].filter(Boolean).forEach(E=>{E.querySelectorAll("a[href]").forEach(h=>{let b=h.getAttribute("href")||"";if(!(!b||b==="#"||b.startsWith("javascript")))try{let v=new URL(b,n.origin),g=v.pathname.replace(/\/+$/,"")||"/";if(g==="/"&&S!=="/")return;let _=0;S===g?_=1e3+g.length:S.startsWith(g+"/")?_=500+g.length:S.includes(g)&&g.length>8&&(_=200+g.length),_&&f&&v.search&&f.indexOf(v.search.slice(1))>=0&&(_+=50),_>0&&y.push({score:_,li:h.closest("li")})}catch{}})}),y.sort((E,h)=>h.score-E.score),y.length?y[0].li:null}function A(){let S=C();if(S){let b=k(S);if(b.length)return b}let f="";try{let b=o.cookie.match(/(?:^|;\s*)selectionBar=([^;]+)/);b&&(f=decodeURIComponent(b[1]))}catch{}if(f&&f!=="0"){let b=o.getElementById(f);if(b){let v=k(b);if(v.length)return v}}let y=null,z=Array.from(o.querySelectorAll("#menus li.active"));if(z.length){y=z[z.length-1];for(let b=z.length-1;b>=0;b--)if(!z[b].querySelector("li.active")){y=z[b];break}}if(!y){let b=Array.from(o.querySelectorAll("#urppp-menus .urppp-nav-item.active"));if(b.length){y=b[b.length-1];for(let v=b.length-1;v>=0;v--)if(!b[v].querySelector(".urppp-nav-item.active")){y=b[v];break}}}if(y){let b=k(y);if(b.length)return b}let E=o.getElementById("breadcrumbs")||o.querySelector(".breadcrumbs"),h=E&&(E.querySelector("ul.breadcrumb")||E.querySelector(".breadcrumb"));if(h){let b=[];if(Array.from(h.children).forEach((v,g)=>{if(g===0)return;let _=c(v.textContent);!_||/^(首页|一级菜单|二级菜单|三级菜单)$/.test(_)||b[b.length-1]!==_&&b.push(_)}),b.length)return b}return[]}function x(){let S=o.getElementById("breadcrumbs")||o.querySelector(".breadcrumbs");if(!S)return;S.classList.remove("hide"),S.style.removeProperty("display"),S.style.setProperty("display","flex","important");let f=S.querySelector("ul.breadcrumb")||S.querySelector(".breadcrumb");f||(f=o.createElement("ul"),f.className="breadcrumb",S.appendChild(f));let y=A();if(!y.length&&Array.from(f.children).map(b=>c(b.textContent)).filter(Boolean).some(b=>b!=="首页"&&!/^(一级菜单|二级菜单|三级菜单)$/.test(b)))return;f.innerHTML="";let z=o.createElement("li");z.style.cursor="pointer",z.innerHTML='<span class="urppp-bc-label"><i class="ace-icon fa fa-home home-icon"></i>首页</span>',z.addEventListener("click",()=>{l.location.href="/"}),f.appendChild(z),y.forEach((E,h)=>{let b=o.createElement("li");h===y.length-1&&b.classList.add("active");let v=o.createElement("span");v.className="urppp-bc-label",v.textContent=E,b.appendChild(v),f.appendChild(b)})}return{beautifyBreadcrumbs:x}}function ds({documentRef:o=document,windowRef:n=window,MutationObserverRef:l=MutationObserver,nodeTypeRef:c=Node}){function d(){try{let A=o.getElementById("sidebar"),x=o.querySelectorAll(".main-content");if(!x.length)return;let S=n.matchMedia&&n.matchMedia("(max-width: 991px)").matches,f="260px";S?f="0px":A&&(f=A.classList.contains("menu-min")?"50px":"260px"),x.forEach(y=>y.style.setProperty("margin-left",f,"important"))}catch{}}function k(){try{let A=o.getElementById("sidebar"),x=o.querySelector("#navbar, .navbar.navbar-default, .navbar-fixed-top");if(!A||!x||A.classList.contains("urppp-clean-sidebar"))return;let S=x.getBoundingClientRect(),f=Math.max(45,Math.round(S.height||x.offsetHeight||45));o.documentElement.style.setProperty("--urppp-navbar-height",f+"px"),A.style.setProperty("top",f+"px","important"),A.style.setProperty("height","calc(100vh - "+f+"px)","important"),A.style.setProperty("margin-top","0","important"),x.style.setProperty("z-index","1100","important"),A.style.setProperty("z-index","1030","important"),d()}catch{}}function C(){let A=o.getElementById("sidebar"),x=o.getElementById("menus");if(!A||!x)return;if(n.__urpppSidebarMenuObserver){try{n.__urpppSidebarMenuObserver.disconnect()}catch{}n.__urpppSidebarMenuObserver=null}let S=o.getElementById("urppp-menus"),f=A.querySelector(".urppp-sidebar-header");S&&S.remove(),f&&f.remove(),k();let y=new Set;x.querySelectorAll("li.active").forEach(I=>{I.id&&y.add(I.id)});function z(I){return Array.from(I.children).filter(D=>D.tagName==="LI").map(D=>{let W=D.querySelector(":scope > a"),H=W?.querySelector(".menu-text"),et=H?H.textContent.trim():W?Array.from(W.childNodes).filter(it=>it.nodeType===c.TEXT_NODE).map(it=>it.textContent).join("").trim():"",pt=W?.querySelector(".menu-icon"),mt=pt?Array.from(pt.classList).filter(it=>it!=="menu-icon").join(" "):"",G=D.querySelector(":scope > .submenu"),V=G?z(G):[];V=V.filter(it=>it.text&&(it.text.trim()||it.href&&it.href!=="#"));let at=W?.getAttribute("href")||"#",Q=W?.getAttribute("target")||"",lt=D.getAttribute("onclick")||W?.getAttribute("onclick")||"",rt=D.id;return at!=="#"&&!at.startsWith("javascript")?{id:rt,text:et,iconClass:mt,children:[],href:at,target:Q,onclick:lt}:V.length===1&&V[0].children.length===0?{id:rt||V[0].id,text:et,iconClass:mt||V[0].iconClass,children:[],href:V[0].href||at,target:V[0].target||Q,onclick:V[0].onclick||lt}:{id:rt,text:et,iconClass:mt,children:V,href:at,target:Q,onclick:lt}})}let E=z(x);x.style.display="none";let h=o.createElement("div");h.className="urppp-sidebar-header",h.style.cssText="position:absolute;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:flex-end;padding:14px 14px 12px;border-bottom:1px solid var(--border);background:var(--surface)";let b=o.createElement("button");b.type="button",b.className="urppp-sidebar-toggle",b.innerHTML='<i class="fa fa-angle-left" aria-hidden="true"></i>',b.title="收起侧边栏",typeof b.setAttribute=="function"&&b.setAttribute("aria-label","收起侧边栏");let v=()=>!!(n.matchMedia&&n.matchMedia("(max-width: 991px)").matches),g=I=>{if(I&&(I.preventDefault(),I.stopPropagation()),v()){A.classList.remove("display"),d();return}let D=o.getElementById("sidebar-collapse");D&&D.click()};b.addEventListener("click",g),h.appendChild(b);let _=()=>{let I=v(),D=o.body.classList.contains("menu-min")||A.classList.contains("menu-min"),W=I?"关闭菜单":D?"展开侧边栏":"收起侧边栏";b.innerHTML=I?'<i class="fa fa-times" aria-hidden="true"></i>':D?'<i class="fa fa-angle-right" aria-hidden="true"></i>':'<i class="fa fa-angle-left" aria-hidden="true"></i>',b.title=W,typeof b.setAttribute=="function"&&b.setAttribute("aria-label",W),!I&&D?(h.style.justifyContent="center",h.style.padding="12px 0"):(h.style.justifyContent="flex-end",h.style.padding="")},P=new l(_);P.observe(o.body,{attributes:!0,attributeFilter:["class"]}),P.observe(A,{attributes:!0,attributeFilter:["class"]}),n.__urpppSidebarMenuObserver=P,_();let T=o.createElement("ul");T.id="urppp-menus",T.style.cssText="margin-top:50px;list-style:none;padding:10px 12px 24px;overflow-y:auto;max-height:calc(100vh - 64px)";function L(I){o.querySelectorAll("#urppp-menus .urppp-nav-item").forEach(W=>W.classList.remove("active"));let D=I;for(;D&&D.id!=="urppp-menus";)D.classList.contains("urppp-nav-item")&&D.classList.add("active"),D=D.parentElement}function F(I,D){let W=o.createElement("li");W.className="urppp-nav-item",I.id&&(W.id=I.id);let H=I.children.length>0,et=I.href||"#",pt=et!=="#"&&!et.startsWith("javascript"),mt=o.createElement("a");if(mt.className="urppp-nav-link",mt.href=pt?et:"javascript:void(0)",I.target&&mt.setAttribute("target",I.target),I.iconClass){let V=o.createElement("i");I.iconClass.split(" ").forEach(at=>{at&&V.classList.add(at)}),mt.appendChild(V)}let G=o.createElement("span");if(G.className="urppp-nav-text",G.textContent=I.text,G.title=I.text,mt.appendChild(G),H){let V=o.createElement("i");V.className="urppp-nav-arrow fa fa-angle-down",V.addEventListener("click",at=>{at.preventDefault(),at.stopPropagation(),W.classList.toggle("open")}),mt.appendChild(V)}if(W.appendChild(mt),mt.addEventListener("click",V=>{if(L(W),!pt&&H)V.preventDefault(),W.classList.toggle("open");else if(pt)return}),H){let V=o.createElement("ul");V.className="urppp-nav-submenu",I.children.forEach(at=>F(at,V)),W.appendChild(V)}I.id&&y.has(I.id)&&W.classList.add("active"),D.appendChild(W)}E.forEach(I=>F(I,T)),T.querySelectorAll(".urppp-nav-item.open").forEach(I=>I.classList.remove("open")),A.insertBefore(h,A.firstChild),A.appendChild(T)}return{rebuildSidebarCompletely:C,syncMobileContentOffset:d,syncSidebarUnderNavbar:k}}function us({theme:o,settings:n,documentRef:l=document,windowRef:c=window}){function d(S){if(!S)return;let f=o.getSkin(),y=o.skinSupportsFixedPalettes(f),z=o.getCurrent(),E=y?o.getBrutalActivePalette():null,h=y?o.getBrutalSelectedPalette():null;S.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(b=>{let v=b.dataset.theme,g=v==="dark",_=v==="scu-red",P=g&&!o.skinSupportsDark(f)||_&&!o.skinSupportsDynamic(f)&&!y,T=v===z;if(y&&(T=v==="default"&&E.id===o.BRUTAL_DEFAULT_PALETTE||_&&E.id!==o.BRUTAL_DEFAULT_PALETTE),b.disabled=P,b.classList.toggle("urppp-theme-disabled",P),b.classList.toggle("ac",T&&!P),b.setAttribute("aria-disabled",P?"true":"false"),v==="default")b.style.background=y?o.getBrutalPaletteById(o.BRUTAL_DEFAULT_PALETTE).accent:"#F1F3F5",b.title=y?"默认高能粉":"简约白";else if(g)b.style.background=P?"#A7A7A7":"#0B0F14",b.title=P?"当前界面风格不支持暗色模式":"深邃暗";else if(_)if(P)b.style.background="#A7A7A7",b.title="当前界面风格不支持动态配色";else if(y)b.style.background=h.accent,b.title="高对比配色："+h.name;else{let L=o.getAccent()||o.DEFAULT_SEED;try{let F=o.buildSchemePreview(L,o.getScheme());b.style.background="linear-gradient(135deg, "+F.primary+" 0 55%, "+F.surface+" 55% 100%)"}catch{b.style.background=L}b.title="动态配色"}})}function k(S){let f=o.getSkin();if(o.skinSupportsFixedPalettes(f)){if(S==="dark")return;o.getCurrent()!=="default"&&o.applyTheme("default",{manual:!0}),S==="default"&&o.setBrutalPalette(o.BRUTAL_DEFAULT_PALETTE),S==="scu-red"&&o.setBrutalPalette(o.getBrutalSelectedPalette().id);return}o.isThemeModeAvailable(S,f)&&o.applyTheme(S,{manual:!0})}function C(){d(l.getElementById("urppp-nav-theme"))}function A(){try{let S=l.getElementById("navbar")||l.querySelector(".navbar");if(!S)return;if(l.getElementById("urppp-nav-theme")){C();return}let f=S.querySelector(".navbar-header .navbar-brand")||S.querySelector(".navbar-brand")||S.querySelector(".navbar-header");if(!f)return;let y=l.createElement("div");y.id="urppp-nav-theme",y.innerHTML=['<button type="button" class="urppp-nav-dot" data-theme="default" title="简约白" style="background:#F1F5F9"></button>','<button type="button" class="urppp-nav-dot" data-theme="dark" title="深邃暗" style="background:#0B0F17"></button>','<button type="button" class="urppp-nav-dot" data-theme="scu-red" title="动态配色" style="background:#B53434"></button>','<button type="button" class="urppp-nav-settings" id="urppp-nav-settings" title="设置" aria-label="设置">','  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">','    <circle cx="12" cy="12" r="3"></circle>','    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',"  </svg>","</button>"].join(""),f.parentElement?(f.parentElement.style.setProperty("display","flex","important"),f.parentElement.style.setProperty("align-items","center","important"),f.nextSibling?f.parentElement.insertBefore(y,f.nextSibling):f.parentElement.appendChild(y)):f.appendChild(y),y.style.setProperty("display","inline-flex","important"),y.style.setProperty("align-items","center","important"),y.style.setProperty("height","36px","important"),y.querySelectorAll(".urppp-nav-dot[data-theme]").forEach(z=>{z.addEventListener("click",()=>{k(z.dataset.theme),C();try{n.syncSettingsPanelUI()}catch{}})}),y.querySelector("#urppp-nav-settings").addEventListener("click",z=>{z.preventDefault(),z.stopPropagation(),n.openSettingsPanel()}),n.ensureSettingsPanel(),C();try{c.__urpppCleanMode&&c.__urpppCleanMode.inject()}catch{}}catch(S){console.warn("[URP++] navbar theme switch inject failed",S)}}function x(){let f=l.getElementById("navbar")?.querySelector(".ace-nav");try{A()}catch{}if(!f)return;function y(_,P){Object.entries(P).forEach(([T,L])=>_.style.setProperty(T,L,"important"))}Array.from(f.childNodes).forEach(_=>{_.nodeType===Node.TEXT_NODE&&!_.textContent.trim()&&_.remove()}),f.querySelectorAll(":scope > li").forEach(_=>{y(_,{display:"inline-flex","align-items":"center","vertical-align":"middle",margin:"0",padding:"0","text-align":"left"})}),f.querySelectorAll(":scope > li > a").forEach(_=>{y(_,{display:"inline-flex","align-items":"center","justify-content":"center",height:"36px",padding:"0 4px","flex-wrap":"nowrap","vertical-align":"middle","text-decoration":"none"}),_.style.lineHeight="1"}),f.querySelectorAll(":scope > li > a > .ace-icon, :scope > li > a > .glyphicon, :scope > li > a > .fa").forEach(_=>{y(_,{top:"auto","vertical-align":"middle","line-height":"1","margin-top":"0"})});let z=f.querySelector(':scope > li > a[href*="customerServiceCenter"]');z&&(y(z,{width:"28px","justify-content":"center"}),z.style.padding="0 4px");let E=l.getElementById("clickdiv"),h=l.getElementById("form-search"),b=l.getElementById("search-input"),v=l.getElementById("intellegenceUDiv");if(v&&(v.style.setProperty("position","relative","important"),v.style.setProperty("z-index","30","important"),v.style.setProperty("display","inline-flex","important"),v.style.setProperty("align-items","center","important"),v.style.setProperty("justify-content","center","important"),v.style.setProperty("width","32px","important"),v.style.setProperty("height","36px","important"),v.style.setProperty("vertical-align","middle","important"),v.style.setProperty("margin","0","important"),v.style.setProperty("padding","0","important")),E&&h){E.removeAttribute("onclick"),y(E,{"background-color":"transparent",position:"relative",display:"inline-flex","align-items":"center","justify-content":"center",width:"32px",height:"32px","border-radius":"8px","line-height":"1","z-index":"30"});let _=l.getElementById("clicki");_&&y(_,{color:"var(--text-secondary)","margin-top":"0"}),E.__urpppNavbarClickBound||(E.__urpppNavbarClickBound=!0,E.addEventListener("mouseenter",()=>E.style.setProperty("background-color","var(--input-bg)","important")),E.addEventListener("mouseleave",()=>E.style.setProperty("background-color","transparent","important")),E.addEventListener("click",L=>{L.preventDefault(),L.stopPropagation(),h.dataset.open==="1"?(h.style.width="0px",h.style.opacity="0",h.dataset.open="0"):(h.style.width="180px",h.style.opacity="1",h.dataset.open="1",b&&setTimeout(()=>b.focus(),50))})),c.__urpppNavbarOutsideClickBound||(c.__urpppNavbarOutsideClickBound=!0,l.addEventListener("click",L=>{let F=l.getElementById("clickdiv"),I=l.getElementById("form-search");!F||!I||I.dataset.open!=="1"||!F.contains(L.target)&&!I.contains(L.target)&&(I.style.width="0px",I.style.opacity="0",I.dataset.open="0")})),y(h,{position:"absolute",right:"34px",top:"50%",transform:"translateY(-50%)",left:"auto",margin:"0","z-index":"10",background:"transparent",border:"none","box-shadow":"none",overflow:"hidden",padding:"0",transition:"width .2s ease, opacity .2s ease"});let P=h.dataset.open==="1"?"160px":"0px";h.style.width!==P&&(h.style.width=P,h.style.opacity=h.dataset.open==="1"?"1":"0"),b&&y(b,{"background-color":"var(--input-bg)",border:"1px solid var(--border)",color:"var(--text)","border-radius":"8px",height:"32px",padding:"0 12px","line-height":"32px",width:"100%"});let T=h.querySelector(".input-icon > .ace-icon.fa-search");T&&(T.style.display="none")}let g=f.querySelector(":scope > li.light-blue > a");if(g){y(g,{display:"inline-flex","align-items":"center",gap:"6px"});let _=g.querySelector(".user-info");_&&(y(_,{display:"inline-flex","align-items":"center",gap:"4px","max-width":"none","white-space":"nowrap","vertical-align":"middle","line-height":"1","margin-top":"-12px"}),Array.from(_.childNodes).forEach(T=>{T.nodeType===Node.TEXT_NODE&&(T.textContent=T.textContent.replace(/\s+/g,"").trim())}),Array.from(_.children).forEach(T=>{y(T,{display:"inline","white-space":"nowrap","vertical-align":"middle","line-height":"1",margin:"0",padding:"0"}),T.tagName==="SMALL"&&T.style.setProperty("font-size","inherit","important")}));let P=g.querySelector(".nav-user-photo");P&&(P.alt=(P.alt||"").replace(/\s+/g,"").trim(),y(P,{"vertical-align":"middle",display:"inline-block",width:"30px",height:"30px"}))}}return{handleThemeDotClick:k,injectNavbarThemeSwitch:A,rebuildNavbar:x,syncNavbarThemeUI:C,syncThemeDotGroup:d}}(function(){"use strict";try{let t=typeof navigator<"u"&&navigator.userAgent||"";if(/Android|iPhone|iPad|iPod|Mobile/i.test(t)){document.documentElement&&document.documentElement.classList.add("urppp-mobile");let e=document.querySelector('meta[name="viewport"]');e||(e=document.createElement("meta"),e.name="viewport",e.content="width=device-width, initial-scale=1",(document.head||document.documentElement||document).appendChild(e))}}catch{}let o="1.9.7";if(/^id\./i.test(String(location.hostname||""))){try{let t=Mo({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:o},uiDeps:{openSubpanel:()=>{}}}),e=()=>{try{t.bootFromCache("assist")}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()}catch{}return}let n={mainRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urppp.user.js",assistRaw:"https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/urpppp.user.js",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",changelogPage:"https://github.com/chaolan2019/SCU-URP-plusplus/blob/main/CHANGELOG.md",greasySearch:"https://greasyfork.org/zh-CN/scripts?q=SCU+URP%2B%2B",versionJson:"version.json",sourceUrls:t=>[`https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`,`https://cdn.jsdelivr.net/gh/chaolan2019/SCU-URP-plusplus@main/${t}`,`https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/SCU-URP-plusplus/main/${t}`]},l="urppp_auto_update_check_v1",c="urppp_skin_v1",d=[{id:"apple",name:"类Apple风格",desc:"系统灰底、链接蓝、大圆角与轻阴影，默认精修方向。",ready:!0,dark:!0,dynamic:!0,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"editorial",name:"编辑杂志",desc:"衬线标题、无框版面与淡分割线。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!0,builtin:!0,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"flat",name:"极简扁平",desc:"无阴影、硬边与纯色层次，冷硬清晰。",ready:!0,dark:!0,dynamic:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"organic",name:"自然有机",desc:"奶油底与大地色，温暖圆角。不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"brutal",name:"新野兽派",desc:"高对比画布、粗边框与硬阴影。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,palettes:!0,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}},{id:"neu",name:"新拟物",desc:"同色双阴影凸起/内凹，立体柔和。支持暗色，不支持动态配色。",ready:!0,dark:!0,dynamic:!1,installed:!1,version:"1.0.0",author:"Chao_Lan",repo:"https://github.com/chaolan2019/SCU-URP-plusplus",caps:{scope:"app",allowJS:!1}}],k=GM_addStyle(`
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
  `);k&&(k.id="urppp-early-style");let C=`
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
  `;function A(t){let e=document.createElement("div");return e.className="urppp-inline-loader",e.innerHTML=C+(t?`<div>${t}</div>`:""),e}function x(t){return!t||!t.closest?!1:!!t.closest('[id^="div_page_loading"], [id*="page_loading"], [id*="PageLoading"]')}function S(t){try{(t&&t.querySelectorAll?t:document).querySelectorAll('[id^="div_page_loading"], [id*="page_loading"]').forEach(r=>{r.querySelectorAll(".urppp-inline-loader").forEach(a=>{try{a.remove()}catch{}}),r.classList.remove("urppp-loading-active")})}catch{}}function f(t){try{let e=t&&t.querySelectorAll?t:document;S(e),e.querySelectorAll("img").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1"||x(r))return;let a=(r.getAttribute("src")||r.src||"").toLowerCase();if(!a||!(a.includes("pageloading")||a.includes("page-loading")||a.includes("loading.gif")||a.includes("loading-0")||a.includes("loading-1"))||a.includes("/loading")&&!a.includes("pageloading")&&!a.includes("loading.gif")&&!a.includes("loading-0"))return;r.dataset.urpppReplaced="1";let p=A("");p.style.minHeight="0",p.style.padding="0",r.parentElement&&r.parentElement.replaceChild(p,r)}catch{}}),e.querySelectorAll(".layui-layer-content.layui-layer-loading0, .layui-layer-content.layui-layer-loading1, .layui-layer-content.layui-layer-loading2, .layui-layer-loading .layui-layer-content").forEach(r=>{try{if(!r||r.dataset.urpppReplaced==="1")return;if(r.dataset.urpppReplaced="1",r.style.setProperty("background","transparent","important"),r.style.setProperty("background-image","none","important"),!r.querySelector(".urppp-inline-loader")){let a=A("");a.style.minHeight="0",a.style.padding="0",r.appendChild(a)}}catch{}})}catch{}}if(!window.__urpppLoaderObs){window.__urpppLoaderObs=!0;let t=!1,e=()=>{if(!t){t=!0;try{f(document)}catch{}t=!1}};document.body&&setTimeout(e,0),document.addEventListener("DOMContentLoaded",()=>setTimeout(e,0),{once:!0});let r=()=>{new MutationObserver(()=>{clearTimeout(window.__urpppLoaderTimer),window.__urpppLoaderTimer=setTimeout(e,200)}).observe(document.documentElement,{childList:!0,subtree:!0})};document.body?r():document.addEventListener("DOMContentLoaded",r,{once:!0})}let y="urppp_theme_v3",z="urppp_accent_v1",E="urppp_accent_presets_v1",h="urppp_scheme_v1",b="urppp_theme_follow_system_v1",v="urppp_clean_default_v1",g="urppp_clean_analysis_v1",_="urppp_apple_edge_line_v1",P="urppp_follow_use_dynamic_v1",T="urppp_brutal_palette_v1",L="urppp_brutal_active_palette_v1",F="urppp_privacy_v1",I="urppp_custom_identity_v1",D="urppp_schedule_first_monday_v1",W="urppp_schedule_json_format_v1",H={completedCourses:"已修课程",failedCourses:"未及格课程",majorGpa:"主修绩点",majorPlan:"主修方案",remainingCourses:"待修课程",passingTotalCredit:"全部及格总学分",passingAvgScore:"全部及格平均成绩",passingAvgGpa:"全部及格平均绩点",passingRequiredCredit:"全部及格必修学分",passingRequiredAvg:"全部及格必修平均",passingRequiredGpa:"全部及格必修绩点",schemeTotalCredit:"方案总学分",schemeAvgScore:"方案平均成绩",schemeAvgGpa:"方案平均绩点",schemeRequiredCredit:"方案必修学分",schemeRequiredAvg:"方案必修平均",schemeRequiredGpa:"方案必修绩点"},et="",pt=["#1E3A5F","#B53434","#0F766E","#7C3AED","#C2410C","#0369A1","#BE185D","#365314"],mt="#B53434",G="pink",V=[{id:"pink",name:"高能粉",desc:"默认配色，热粉强调与酸性绿辅助",accent:"#FF006E",secondary:"#CCFF00",info:"#00D9FF",warning:"#FF9500"},{id:"acid",name:"酸性绿",desc:"酸性绿强调与热粉辅助",accent:"#CCFF00",secondary:"#FF006E",info:"#00D9FF",warning:"#FF9500"},{id:"cyan",name:"电子蓝",desc:"电子蓝强调与亮橙辅助",accent:"#00D9FF",secondary:"#FF9500",info:"#CCFF00",warning:"#FF006E"},{id:"orange",name:"亮橙",desc:"亮橙强调与电子蓝辅助",accent:"#FF9500",secondary:"#00D9FF",info:"#CCFF00",warning:"#FF006E"}],at="tonal",Q=[{id:"paper",name:"纯白卡片",desc:"卡片保持白，仅强调色跟种子"},{id:"tonal",name:"色调点缀",desc:"背景轻染，卡片带同色相浅底"},{id:"soft",name:"柔和粉彩",desc:"卡片明显粉彩/浅色，低对比"},{id:"vibrant",name:"鲜艳",desc:"背景与卡片都更有色，主色更饱和"},{id:"expressive",name:"表现力",desc:"双色拼色：卡片跟主色，背景走协调次色"}],{handleThemeDotClick:lt,injectNavbarThemeSwitch:rt,rebuildNavbar:it,syncNavbarThemeUI:gt,syncThemeDotGroup:X}=us({theme:{BRUTAL_DEFAULT_PALETTE:G,DEFAULT_SEED:mt,applyTheme:Gt,buildSchemePreview:te,getAccent:Zt,getBrutalActivePalette:Zo,getBrutalPaletteById:ur,getBrutalSelectedPalette:Ko,getCurrent:Yt,getScheme:De,getSkin:ee,isThemeModeAvailable:dr,setBrutalPalette:Xo,skinSupportsDark:Oe,skinSupportsDynamic:Re,skinSupportsFixedPalettes:Qo},settings:{ensureSettingsPanel:Pn,openSettingsPanel:Sn,syncSettingsPanelUI:Dt}});function ct(){try{if(!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches))return;let e=document.getElementById("navbar"),r=e?.querySelector(".ace-nav");if(!e||!r)return;let a=document.getElementById("intellegenceUDiv"),p=document.getElementById("clickdiv"),i=document.getElementById("form-search");if(!a){let O=document.createElement("li");O.className="green urppp-search-item",a=document.createElement("div"),a.id="intellegenceUDiv",O.appendChild(a),r.appendChild(O)}let s=a.closest("li")||a.parentElement,u=Array.from(r.children).find(O=>{let R=O.querySelector(":scope > a");if(!R)return!1;let B=R.getAttribute("href")||"",K=(R.getAttribute("title")||"")+" "+(R.textContent||"");return B.includes("customerServiceCenter")||/help|service|support/i.test(B)||!!R.querySelector(".glyphicon-headphones, .fa-headphones, .fa-question-circle, .fa-life-ring")||/帮助|客服|服务|帮助中心/i.test(K)}),m=Array.from(r.children).find(O=>O.classList.contains("light-blue")),w=u||m||null;w&&s&&w!==s&&((s.compareDocumentPosition(w)&Node.DOCUMENT_POSITION_FOLLOWING)!==0||r.insertBefore(s,w)),s&&!s.classList.contains("urppp-search-item")&&s.classList.add("urppp-search-item");let q=s;p?(p.removeAttribute("onclick"),p.setAttribute("role","button"),p.setAttribute("aria-label","搜索功能")):(p=document.createElement("button"),p.type="button",p.id="clickdiv",p.setAttribute("aria-label","搜索功能"),p.innerHTML='<i class="fa fa-search" id="clicki" aria-hidden="true"></i>',a.appendChild(p)),p.style.setProperty("left","8px","important"),p.style.setProperty("position","relative","important"),p.style.setProperty("z-index","31","important"),i||(i=document.createElement("div"),i.id="form-search",i.className="nav-search",i.innerHTML='<form class="form-search"><span class="input-icon"><input type="text" placeholder="查找功能..." class="nav-search-input" id="search-input" autocomplete="off"><i class="ace-icon fa fa-search" aria-hidden="true"></i></span></form>'),q&&i.parentElement!==q&&q.appendChild(i),q&&q.style.setProperty("position","relative","important"),i.classList.add("urppp-desktop-search"),i.style.setProperty("position","absolute","important"),i.style.setProperty("top","50%","important"),i.style.setProperty("right","24px","important"),i.style.setProperty("left","auto","important"),i.style.setProperty("transform","translateY(-50%)","important"),i.style.setProperty("width",i.dataset.open==="1"?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("max-width","calc(100vw - 24px)","important"),i.style.setProperty("opacity",i.dataset.open==="1"?"1":"0","important"),i.style.setProperty("pointer-events",i.dataset.open==="1"?"auto":"none","important"),i.style.setProperty("z-index","1200","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("background","transparent","important"),i.style.setProperty("border","0 solid transparent","important"),i.style.setProperty("box-shadow","none","important"),i.style.setProperty("overflow","visible","important"),i.style.setProperty("transition","width .2s ease, opacity .2s ease","important");let $=i.querySelector("#search-input"),M=i.querySelector("form");if(!$||!M)return;M.style.setProperty("display","block","important"),M.style.setProperty("margin","0","important"),M.style.setProperty("padding","10px","important");let j=i.querySelector(".input-icon");j&&(j.style.setProperty("display","block","important"),j.style.setProperty("position","relative","important")),$.style.setProperty("display","block","important"),$.style.setProperty("width","100%","important"),$.style.setProperty("height","36px","important"),$.style.setProperty("box-sizing","border-box","important"),$.style.setProperty("padding","0 12px","important"),$.style.setProperty("border","1px solid var(--border)","important"),$.style.setProperty("border-radius","var(--radius-sm)","important"),$.style.setProperty("background","var(--input-bg)","important"),$.style.setProperty("color","var(--text)","important");let Y=O=>{i.dataset.open=O?"1":"0",i.style.setProperty("width",O?"min(240px, calc(100vw - 24px))":"0px","important"),i.style.setProperty("opacity",O?"1":"0","important"),i.style.setProperty("pointer-events",O?"auto":"none","important"),p.setAttribute("aria-expanded",O?"true":"false"),O&&setTimeout(()=>$.focus(),30)};p.__urpppSearchBound||(p.__urpppSearchBound=!0,p.addEventListener("click",O=>{O.preventDefault(),O.stopImmediatePropagation(),Y(i.dataset.open!=="1")},!0)),document.__urpppDesktopSearchOutsideBound||(document.__urpppDesktopSearchOutsideBound=!0,document.addEventListener("click",O=>{let R=document.getElementById("form-search"),B=document.getElementById("clickdiv");!R||R.dataset.open!=="1"||R.classList.contains("urppp-mobile-form-search")||R.closest("#urppp-mobile-search-panel")||R.contains(O.target)||B?.contains(O.target)||Y(!1)},!0))}catch(t){console.warn("[URP++] desktop search bind failed",t)}}function kt(){if(document.getElementById("urppp-boot-loader"))return;let t=document.createElement("div");t.id="urppp-boot-loader",t.setAttribute("aria-busy","true"),t.innerHTML=`
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
    `;let e=document.documentElement||document.body;e&&e.appendChild(t)}function wt(){try{document.documentElement.classList.add("urppp-ready"),document.body&&(document.body.classList.add("urppp-ready"),document.body.style.removeProperty("opacity"));let t=document.getElementById("urppp-boot-loader");if(!t)return;t.classList.add("urppp-boot-hide"),setTimeout(()=>{try{t.remove()}catch{}},280)}catch{}}try{kt()}catch{}window.__urpppBootSafety||(window.__urpppBootSafety=setTimeout(()=>{try{wt()}catch{}},2500));let Ct={default:{name:"简约白",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"#0071E3","--input-bg":"#F5F5F7","--primary":"#0071E3","--primary-hover":"#0077ED","--ring":"rgba(0,113,227,0.28)","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px","--border-w":"0px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},dark:{name:"深邃暗",vars:{"--bg":"#000000","--surface":"#1C1C1E","--text":"#F5F5F7","--text-secondary":"#A1A1A6","--text-muted":"#8E8E93","--border":"#38383A","--border-focus":"#0A84FF","--input-bg":"#2C2C2E","--primary":"#0A84FF","--primary-hover":"#409CFF","--ring":"rgba(10,132,255,0.32)","--shadow":"0 8px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'},"scu-red":{name:"动态配色",vars:{"--bg":"#F5F5F7","--surface":"#FFFFFF","--text":"#1D1D1F","--text-secondary":"#6E6E73","--text-muted":"#86868B","--border":"#D2D2D7","--border-focus":"var(--urppp-accent, #B53434)","--input-bg":"#F5F5F7","--primary":"var(--urppp-accent, #B53434)","--primary-hover":"var(--urppp-accent-hover, #962929)","--ring":"var(--urppp-accent-ring, rgba(181,52,52,0.18))","--shadow":"0 4px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)","--radius":"18px","--radius-sm":"12px"},font:'-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", "PingFang SC", "Helvetica Neue", "Microsoft YaHei", sans-serif'}};function N(t,e,r){t/=255,e/=255,r/=255;let a=Math.max(t,e,r),p=Math.min(t,e,r),i=0,s=0,u=(a+p)/2;if(a!==p){let m=a-p;switch(s=u>.5?m/(2-a-p):m/(a+p),a){case t:i=(e-r)/m+(e<r?6:0);break;case e:i=(r-t)/m+2;break;default:i=(t-e)/m+4;break}i/=6}return{h:i*360,s,l:u}}function J(t,e,r){t=(t%360+360)%360,e=Math.max(0,Math.min(1,e)),r=Math.max(0,Math.min(1,r));let a=(1-Math.abs(2*r-1))*e,p=a*(1-Math.abs(t/60%2-1)),i=r-a/2,s=0,u=0,m=0;return t<60?(s=a,u=p):t<120?(s=p,u=a):t<180?(u=a,m=p):t<240?(u=p,m=a):t<300?(s=p,m=a):(s=a,m=p),{r:Math.round((s+i)*255),g:Math.round((u+i)*255),b:Math.round((m+i)*255)}}function tt(t,e,r){let{r:a,g:p,b:i}=J(t,e,r);return zr(a,p,i)}function ht(t){let{r:e,g:r,b:a}=nr(Vt(t)||mt),p=N(e,r,a);return p.s<.12&&(p.s=.18),p}function bt(t,e,r){let a=Math.max(0,Math.min(100,r))/100,p=Math.max(0,Math.min(.95,e));return tt(t,p,a)}function zt(t){switch(t){case"paper":case"neutral":return{chroma:1,secShift:0,primaryTone:38,whiteCard:!0,bgSeed:.05,surfaceSeed:0,borderSeed:.08};case"soft":return{chroma:1,secShift:10,primaryTone:42,bgSeed:.14,surfaceSeed:.16,borderSeed:.18};case"vibrant":return{chroma:1.15,secShift:14,primaryTone:36,bgSeed:.2,surfaceSeed:.22,borderSeed:.26};case"expressive":return{chroma:1.08,secShift:0,primaryTone:36,duo:!0,bgSeed:.12,surfaceSeed:.15,borderSeed:.18};default:return{chroma:1,secShift:18,primaryTone:40,bgSeed:.12,surfaceSeed:.13,borderSeed:.16}}}function yt(t,e){let r=Vt(t)||mt,a=Math.max(0,Math.min(.45,Number(e)||0));return a<=.001?"#FFFFFF":Bt("#FFFFFF",r,a)}function Ft(t){return t<25||t>=345?(t+28)%360:t<55?(t+22)%360:t<90?(t+160)%360:t<160?(t+40)%360:t<210?(t+35)%360:t<265?(t+48)%360:t<310?(t+40)%360:(t+24)%360}function Pt(t){let e=Vt(t)||mt,{h:r,s:a}=ht(e),p=Ft(r),i=Math.min(.72,Math.max(.28,a*.78));return bt(p,i,42)}function $t(t,e){let r=Vt(t)||mt,{h:a,s:p}=ht(r),s=zt(e||at),u=Math.min(.92,Math.max(.35,p*s.chroma)),m=Pt(r),{h:w}=ht(m),q=bt(a,u,s.primaryTone),$=bt(a,u,Math.max(24,s.primaryTone-10)),M=Bt("#FFFFFF",r,.18),j,Y,O;s.whiteCard?(j=Bt("#F1F5F9",Bt("#FFFFFF",r,.08),.5),Y="#FFFFFF",O="#E5E7EB"):s.duo?(j=Bt(yt(m,s.bgSeed+.04),"#EEF1F4",.1),Y=Bt(yt(r,s.surfaceSeed),"#FFFFFF",.1),O=Bt("#E5E7EB",m,.16)):(j=Bt(yt(r,s.bgSeed),"#E8EBEF",.12),Y=Bt(yt(r,s.surfaceSeed),"#FFFFFF",.12),O=Bt("#E5E7EB",r,Math.max(.08,s.borderSeed*.7)));let R=s.whiteCard?"#F8FAFC":Bt(Y,yt(s.duo?m:r,Math.max(.05,(s.surfaceSeed||.1)*.55)),.35),B=bt(a,Math.min(.45,u*.55),14),K=Se(bt(a,u*.3,34),.88),dt=Se(bt(a,u*.22,46),.76),vt=Se(q,.18),Et="0 4px 12px "+Se(q,.1)+", 0 1px 2px "+Se(q,.05);return{"--bg":j,"--surface":Y,"--text":B,"--text-secondary":K,"--text-muted":dt,"--border":O,"--border-focus":q,"--input-bg":R,"--primary":q,"--primary-hover":$,"--ring":vt,"--shadow":Et,"--radius":"18px","--radius-sm":"12px","--primary-container":M,"--secondary":m}}function te(t,e){let r=$t(t,e);return{id:e,primary:r["--primary"],bg:r["--bg"],surface:r["--surface"],border:r["--border"],text:r["--text"]}}function Fe(t){let e=Vt(t)||Zt()||mt;return Q.map(r=>Object.assign({},r,te(e,r.id)))}function ge(){let t=document.documentElement;["--primary","--primary-hover","--border-focus","--ring","--bg","--surface","--text","--text-secondary","--text-muted","--border","--input-bg","--shadow","--primary-container","--secondary"].forEach(e=>t.style.removeProperty(e))}function Zt(){return Vt(GM_getValue(z,""))||""}function De(){let t=String(GM_getValue(h,at)||at);return Q.some(e=>e.id===t)?t:at}function Ea(t){let e=Q.some(r=>r.id===t)?t:at;return GM_setValue(h,e),e}function ms(t,e){if(!t)return;let r=Vt(t);if(r){if(GM_setValue(z,r),e&&e.scheme&&Ea(e.scheme),e&&e.skipTheme){let a=Ao(r,.15),p=Se(r,.15);document.documentElement.style.setProperty("--urppp-accent",r),document.documentElement.style.setProperty("--urppp-accent-hover",a),document.documentElement.style.setProperty("--urppp-accent-ring",p);try{gt()}catch{}try{Dt()}catch{}return}Gt("scu-red");try{gt()}catch{}try{Dt()}catch{}}}function Ca(){try{let t=GM_getValue(E,"");if(!t)return pt.slice();let e=JSON.parse(t);return Array.isArray(e)?e.filter(r=>typeof r=="string"&&/^#?[0-9a-fA-F]{6}$/i.test(r.replace("#",""))).map(r=>r.startsWith("#")?r.toUpperCase():"#"+r.toUpperCase()):pt.slice()}catch{return pt.slice()}}function bs(t){let e=Vt(t||Zt()||mt);if(!e)return Ca();let r=Ca();return r=[e].concat(r.filter(a=>a.toLowerCase()!==e.toLowerCase())),r=r.slice(0,12),GM_setValue(E,JSON.stringify(r)),r}function Xt(){try{return!!GM_getValue(b,!1)}catch{return!1}}function Fr(t){return GM_setValue(b,!!t),!!t}function Pa(){try{return!!GM_getValue(v,!1)}catch{return!1}}function hs(t){return GM_setValue(v,!!t),!!t}function za(){try{return GM_getValue(g,"tab")==="direct"}catch{return!1}}function fs(t){return GM_setValue(g,t==="direct"?"direct":"tab"),t==="direct"?"direct":"tab"}function Ee(){try{let t=GM_getValue(_,!0);return t!==!1&&t!==0&&t!=="0"}catch{return!0}}function gs(t){return GM_setValue(_,!!t),!!t}function La(){try{return!!GM_getValue(l,!1)}catch{return!1}}function xs(t){return GM_setValue(l,!!t),!!t}function Dr(t,e){try{let r=GM_getValue(t,"");if(r&&typeof r=="object")return r;if(typeof r=="string"&&r.trim())return JSON.parse(r)}catch{}return e}function jr(t,e){return GM_setValue(t,JSON.stringify(e)),e}function Ce(){return Io(Dr(F,null))}function qa(t){return jr(F,Io(t))}function je(){return Nr(Dr(I,null))}function Wo(t){return jr(I,Nr(t))}function Ta(){let t=Dr(D,{});return t&&typeof t=="object"&&!Array.isArray(t)?t:{}}function Go(t,e){if(!t||!/^\d{4}-\d{2}-\d{2}$/.test(String(e||"")))return;let r=Ta();r[String(t)]=String(e),jr(D,r)}function Or(){let t="";try{t=GM_getValue(W,"")}catch{}let e=!!(t&&(typeof t!="string"||t.trim())),r=Dr(W,null);try{if(e&&(!r||typeof r!="object"||Array.isArray(r)))throw new Error("配置不是 JSON 对象");let a=r&&typeof r=="object"?r:{},p={enabled:!!a.enabled,mapping:Be(a.mapping||Mr)};return et="",p}catch{return et=e?"JSON 映射配置损坏，已回退小爱课程兼容格式":"",{enabled:!1,mapping:Be(Mr)}}}function Jo(t){let e=t&&typeof t=="object"?t:{},r={enabled:!!e.enabled,mapping:Be(e.mapping||Mr)};return et="",jr(W,r)}function Rr(){try{let t=String(location.pathname||"").replace(/\/+$/,"")||"/";return t==="/"||t==="/index"||/\/index\.html?$/i.test(t)}catch{return!1}}function Hr(){try{return!!GM_getValue(P,!1)}catch{return!1}}function Ma(t){return GM_setValue(P,!!t),!!t}function ys(){try{return!!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch{return!1}}function xe(){return ys()&&Oe()?"dark":Hr()&&Re()?"scu-red":"default"}function dr(t,e){return t==="dark"?Oe(e):t==="scu-red"?Re(e):t==="default"}function Gt(t,e){e=e||{},!Oe()&&Xt()&&Fr(!1),!Re()&&Hr()&&Ma(!1),e.manual&&Fr(!1);let r;e.system||Xt()&&!e.manual?r=xe():(r=Ct[t]?t:Yt()||"default",Ct[r]||(r="default")),dr(r)||(r="default");let a=Ct[r]||Ct.default;e.skipPersist||GM_setValue(y,r),ge();let p=document.getElementById("urppp-theme-vars")||(()=>{let w=document.createElement("style");return w.id="urppp-theme-vars",(document.head||document.documentElement).appendChild(w),w})(),i=Zt(),s=Object.assign({},a.vars);if(r==="scu-red"){let w=i||mt,q=De();s=Object.assign(s,$t(w,q));let $=s["--primary"]||w,M=s["--primary-hover"]||Ao($,.12);document.documentElement.style.setProperty("--urppp-accent",$),document.documentElement.style.setProperty("--urppp-accent-hover",M),document.documentElement.style.setProperty("--urppp-accent-ring",s["--ring"]||Se($,.15)),document.documentElement.style.setProperty("--urppp-seed",w),document.documentElement.style.setProperty("--urppp-scheme",q)}else r==="default"?(document.documentElement.style.setProperty("--urppp-accent","#0071E3"),document.documentElement.style.setProperty("--urppp-accent-hover","#0077ED"),document.documentElement.style.setProperty("--urppp-accent-ring","rgba(0,113,227,0.28)"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme")):(document.documentElement.style.removeProperty("--urppp-accent"),document.documentElement.style.removeProperty("--urppp-accent-hover"),document.documentElement.style.removeProperty("--urppp-accent-ring"),document.documentElement.style.removeProperty("--urppp-seed"),document.documentElement.style.removeProperty("--urppp-scheme"));let u=":root {";for(let[w,q]of Object.entries(s))u+=`${w}:${q};`;u+="}",p.textContent=u,document.body&&(document.body.style.fontFamily=a.font);try{let w=document.documentElement;w.dataset.urpppTheme=r,w.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),w.classList.add("urppp-theme-"+r),w.classList.toggle("urppp-theme-follow",Xt()),document.body&&(document.body.dataset.urpppTheme=r,document.body.classList.toggle("urppp-dark",r==="dark"),document.body.classList.toggle("urppp-theme-follow",Xt()))}catch{}try{ae()}catch{}try{gt()}catch{}try{Dt()}catch{}try{fn()}catch{}try{zs()}catch{}let m=document.getElementById("urppp-boot-loader");m&&(m.style.fontFamily=a.font)}function Yt(){return GM_getValue(y,"default")}function ce(t){try{return!!GM_getValue("urppp_theme_css_"+t,"")}catch{return!1}}function ye(){try{let t=GM_getValue("urppp_local_themes","");return t?JSON.parse(t)||{}:{}}catch{return{}}}function Vo(t,e){try{let r=ye();r[t]=e,GM_setValue("urppp_local_themes",JSON.stringify(r))}catch{}}function vs(t){try{let e=ye();delete e[t],GM_setValue("urppp_local_themes",JSON.stringify(e))}catch{}}function ws(){try{if(typeof GM_listValues!="function")return;let t=ye(),e=!1;GM_listValues().forEach(r=>{let a=/^urppp_theme_css_(.+)$/.exec(r);if(!a)return;let p=a[1],i="";try{i=GM_getValue(r,"")||""}catch{}i&&(d.some(s=>s.id===p)||t[p]||(t[p]={name:p,desc:"下载主题",author:"",version:"1.0.0"},e=!0))}),e&&GM_setValue("urppp_local_themes",JSON.stringify(t))}catch{}}function Ia(t){let e=document.getElementById("urppp-store-theme-"+t);return e||(e=document.createElement("style"),e.id="urppp-store-theme-"+t,e.dataset.urpppStoreTheme=t,(document.head||document.documentElement).appendChild(e)),e}function ks(t){let e=document.getElementById("urppp-store-theme-"+t);e&&e.remove()}function Yo(){ws();let t=new Set,e=r=>{if(t.has(r))return;t.add(r);let a="";try{a=GM_getValue("urppp_theme_css_"+r,"")||""}catch{}a&&(Ia(r).textContent=a);let p="";try{p=GM_getValue("urppp_card_css_"+r,"")||""}catch{}p&&Pe([{id:r,cardCss:p}])};d.forEach(r=>e(r.id)),Object.keys(ye()).forEach(r=>e(r));try{ae()}catch{}}function ee(){let t=GM_getValue(c,"apple"),e=d.find(a=>a.id===t);return e&&e.ready&&(e.installed!==!1||ce(e.id))||ye()[t]&&ce(t)?t:"apple"}function $a(t,e){let r=t||ee(),a=d.find(p=>p.id===r);return!!(a&&a[e])}function Oe(t){return $a(t,"dark")}function Re(t){return $a(t,"dynamic")}function Qo(t){return $a(t,"palettes")}function ur(t){return V.find(e=>e.id===t)||V[0]}function Ko(){let t=String(GM_getValue(T,"acid")||"acid"),e=ur(t);return e.id===G?ur("acid"):e}function Zo(){let t=String(GM_getValue(L,G)||G);return ur(t)}function Xo(t,e){let r=e||{},a=ur(t);r.select&&a.id!==G&&GM_setValue(T,a.id),GM_setValue(L,a.id);try{ae()}catch{}try{gt()}catch{}try{Dt()}catch{}try{let p=document.getElementById("urppp-clean-root");p&&typeof p.__syncCleanThemeDots=="function"&&p.__syncCleanThemeDots()}catch{}}function As(t){let e=t||ee();return e==="flat"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"2px","--urppp-card-border":"2px solid var(--text)","--urppp-input-border":"2px solid var(--text)","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="organic"?{"--radius":"22px","--radius-sm":"14px","--shadow":"0 2px 10px rgba(92,64,51,0.06)","--border-w":"1px","--urppp-card-border":"1px solid #E7E0D6","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"1px solid var(--border)","--urppp-action-shadow":"none","--urppp-action-bg":"var(--input-bg)","--urppp-action-color":"var(--primary)","--urppp-menu-radius":"14px","--urppp-menu-border":"1px solid var(--border)","--urppp-menu-shadow":"none","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}:e==="editorial"?{"--radius":"0px","--radius-sm":"0px","--shadow":"none","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"none","--urppp-action-radius":"0px","--urppp-action-border":"none","--urppp-action-shadow":"none","--urppp-action-bg":"transparent","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"1px solid var(--text)","--urppp-menu-shadow":"none","--urppp-menu-bg":"transparent","--urppp-menu-color":"var(--text)"}:e==="brutal"?{"--radius":"0px","--radius-sm":"0px","--shadow":"6px 6px 0 #000","--border-w":"3px","--urppp-card-border":"3px solid #000","--urppp-input-border":"2px solid #000","--urppp-action-radius":"0px","--urppp-action-border":"2px solid var(--text)","--urppp-action-shadow":"3px 3px 0 var(--text)","--urppp-action-bg":"var(--surface)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"0px","--urppp-menu-border":"2px solid var(--text)","--urppp-menu-shadow":"3px 3px 0 var(--text)","--urppp-menu-bg":"var(--surface)","--urppp-menu-color":"var(--text)"}:e==="neu"?{"--radius":"16px","--radius-sm":"12px","--shadow":"5px 5px 10px #BEC3CA, -5px -5px 10px #F7F9FC","--border-w":"0px","--urppp-card-border":"none","--urppp-input-border":"1px solid rgba(38,49,66,.16)","--urppp-input-shadow":"inset 2px 2px 4px rgba(38,49,66,.16), inset -2px -2px 4px rgba(255,255,255,.72)","--urppp-action-radius":"12px","--urppp-action-border":"none","--urppp-action-shadow":"var(--shadow)","--urppp-action-bg":"var(--bg)","--urppp-action-color":"var(--text)","--urppp-menu-radius":"12px","--urppp-menu-border":"none","--urppp-menu-shadow":"var(--shadow)","--urppp-menu-bg":"var(--bg)","--urppp-menu-color":"var(--text)"}:{"--radius":"18px","--radius-sm":"12px","--shadow":"0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)","--border-w":"0px","--urppp-card-border":e==="apple"&&Ee()?"1px solid rgba(0,0,0,0.08)":"none","--urppp-input-border":"1px solid var(--border)","--urppp-action-radius":"999px","--urppp-action-border":"none","--urppp-action-shadow":"0 2px 6px var(--ring)","--urppp-action-bg":"var(--primary)","--urppp-action-color":"var(--surface)","--urppp-menu-radius":"12px","--urppp-menu-border":e==="apple"&&Ee()?"1px solid var(--border)":"none","--urppp-menu-shadow":"0 1px 3px rgba(0,0,0,.08)","--urppp-menu-bg":"var(--input-bg)","--urppp-menu-color":"var(--text)"}}function He(){try{let t=ee();if(t==="apple")return Ee()?"1px solid rgba(0,0,0,0.08)":"none";if(t==="flat")return"2px solid var(--text)";if(t==="organic")return"1px solid #E7E0D6";if(t==="brutal")return"3px solid var(--text)";if(t==="editorial"||t==="neu")return"none"}catch{}return"1px solid var(--border)"}function ae(){let t=ee();try{document.documentElement.setAttribute("data-urppp-skin",t)}catch{}try{document.body&&document.body.setAttribute("data-urppp-skin",t)}catch{}try{let e=t==="apple"&&Ee();document.documentElement.setAttribute("data-urppp-apple-edge",e?"1":"0"),document.body&&document.body.setAttribute("data-urppp-apple-edge",e?"1":"0")}catch{}try{let e=document.getElementById("urppp-skin-vars")||(()=>{let i=document.createElement("style");return i.id="urppp-skin-vars",(document.head||document.documentElement).appendChild(i),i})(),r=As(t),a=":root, html[data-urppp-skin] {";if(Object.keys(r).forEach(i=>{a+=i+":"+r[i]+";"}),a+="}",a+=".urppp-nav-dot.urppp-theme-disabled{opacity:.42!important;cursor:not-allowed!important;box-shadow:none!important;filter:grayscale(1)!important;transform:none!important;}",t==="flat"||t==="organic"||t==="brutal"||t==="neu"){if(t==="brutal"){let i=Zo();a+='html[data-urppp-skin="brutal"]{--brutal-accent:'+i.accent+";--brutal-secondary:"+i.secondary+";--brutal-info:"+i.info+";--brutal-warning:"+i.warning+";}"}e.textContent=a;return}if(t==="apple"){let i=Ee(),s=i?"1px solid rgba(0,0,0,0.08)":"none",u=i?"1px solid rgba(255,255,255,0.10)":"none",m=i?"1px solid rgba(0,0,0,0.06)":"none";a+=['html[data-urppp-skin="apple"]{--shadow:0 6px 20px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.04);--border:'+(i?"rgba(0,0,0,0.08)":"rgba(0,0,0,0.04)")+";}",'html[data-urppp-skin="apple"].urppp-theme-dark,html.urppp-theme-dark[data-urppp-skin="apple"]{--shadow:0 10px 28px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.04);--border:'+(i?"rgba(255,255,255,0.10)":"rgba(255,255,255,0.06)")+";}",'html[data-urppp-skin="apple"] .widget-box,html[data-urppp-skin="apple"] .widget-box.transparent,html[data-urppp-skin="apple"] .panel,html[data-urppp-skin="apple"] .panel-default,html[data-urppp-skin="apple"] .well,html[data-urppp-skin="apple"] .thumbnail,html[data-urppp-skin="apple"] .infobox,html[data-urppp-skin="apple"] .profile-user-info,html[data-urppp-skin="apple"] .profile-user-info-striped,html[data-urppp-skin="apple"] .modal-content,html[data-urppp-skin="apple"] fieldset,html[data-urppp-skin="apple"] .urppp-stat-card,html[data-urppp-skin="apple"] .urppp-db-card,html[data-urppp-skin="apple"] .urppp-db-panel,html[data-urppp-skin="apple"] #urppp-dashboard .widget-box,html[data-urppp-skin="apple"] #urppp-root .uc,html[data-urppp-skin="apple"] #urppp-clean-root .uc-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-modal,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top,html[data-urppp-skin="apple"] #urppp-clean-root .uc-tabbar,html[data-urppp-skin="apple"] .urppp-card,html[data-urppp-skin="apple"] #urppp-dashboard .urppp-card,html[data-urppp-skin="apple"] #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+s+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"].urppp-theme-dark .widget-box,html[data-urppp-skin="apple"].urppp-theme-dark .panel,html[data-urppp-skin="apple"].urppp-theme-dark .profile-user-info,html[data-urppp-skin="apple"].urppp-theme-dark .modal-content,html[data-urppp-skin="apple"].urppp-theme-dark .urppp-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-card,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-clean-root .uc-score-pane,html[data-urppp-skin="apple"].urppp-theme-dark #urppp-root .uc{border:'+u+"!important;}",'html[data-urppp-skin="apple"] .page-content .widget-box,html[data-urppp-skin="apple"] #page-content-template .widget-box,html[data-urppp-skin="apple"] html body .page-content .profile-user-info.setLabelWidth{border:'+s+"!important;box-shadow:var(--shadow)!important;}",'html[data-urppp-skin="apple"] .btn,html[data-urppp-skin="apple"] .btn-default,html[data-urppp-skin="apple"] .btn-white,html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] .btn-success,html[data-urppp-skin="apple"] .btn-warning,html[data-urppp-skin="apple"] .btn-danger,html[data-urppp-skin="apple"] a.btn,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn{border-color:transparent!important;box-shadow:0 1px 2px rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"] .btn-primary,html[data-urppp-skin="apple"] .btn-info,html[data-urppp-skin="apple"] #urppp-clean-root .uc-btn.primary{border:none!important;}','html[data-urppp-skin="apple"] .table,html[data-urppp-skin="apple"] table,html[data-urppp-skin="apple"] .table-bordered,html[data-urppp-skin="apple"] .table-bordered>thead>tr>th,html[data-urppp-skin="apple"] .table-bordered>tbody>tr>td{border-color:rgba(0,0,0,.05)!important;}','html[data-urppp-skin="apple"].urppp-theme-dark .table,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>thead>tr>th,html[data-urppp-skin="apple"].urppp-theme-dark .table-bordered>tbody>tr>td{border-color:rgba(255,255,255,.06)!important;}','html[data-urppp-skin="apple"] .nav-tabs>li>a,html[data-urppp-skin="apple"] .nav-tabs{border-color:transparent!important;}','html[data-urppp-skin="apple"] .urppp-nav-link{border:none!important;}','html[data-urppp-skin="apple"] #urppp-clean-root .uc-lesson,html[data-urppp-skin="apple"] #urppp-clean-root .uc-grid-cell{border-color:'+(i?"rgba(0,0,0,0.06)":"transparent")+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] #urppp-clean-root .uc-svc{border:'+m+"!important;box-shadow:0 2px 8px rgba(0,0,0,.05)!important;}",'html[data-urppp-skin="apple"] .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot,html[data-urppp-skin="apple"] #urppp-dots span{border-radius:50%!important;border:2px solid var(--border)!important;box-shadow:none!important;width:18px!important;height:18px!important;min-width:18px!important;min-height:18px!important;padding:0!important;overflow:hidden!important;background-clip:padding-box!important;flex:0 0 auto!important;}','html[data-urppp-skin="apple"] .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot.ac,html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot.ac{border-color:var(--primary)!important;box-shadow:0 0 0 3px var(--ring)!important;}','html[data-urppp-skin="apple"] #urppp-nav-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-clean-root .uc-top-theme .urppp-nav-dot[data-theme="scu-red"],html[data-urppp-skin="apple"] #urppp-dots span[data-theme="scu-red"]{border-radius:50%!important;border:2px solid var(--border)!important;}'].join("")}else t==="editorial"&&(a+=`
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
        `);e.textContent=a;let p=document.head||document.documentElement;e.parentNode===p&&p.lastElementChild!==e&&p.appendChild(e)}catch(e){try{console.warn("[URP++] applySkinAttr",e)}catch{}}setTimeout(()=>{try{Kt(document)}catch{}},0)}function tn(t){let e=d.find(p=>p.id===t&&p.ready&&(p.installed!==!1||ce(p.id))),r=!e&&ye()[t]&&ce(t)?{id:t,ready:!0,installed:!1}:null,a=e||r;if(!a)return!1;GM_setValue(c,a.id);try{a.dynamic||Ma(!1),!a.dark&&Xt()&&Fr(!1);let p=Xt(),i=p?xe():Yt(),s=dr(i,e.id)?i:"default";ae(),Gt(s,{system:p})}catch{try{ae()}catch{}}try{Dt()}catch{}try{gt()}catch{}try{let p=document.getElementById("urppp-clean-root");p&&typeof p.__syncCleanThemeDots=="function"&&p.__syncCleanThemeDots()}catch{}return!0}function Ss(){if(!window.__urpppSystemThemeBound&&window.matchMedia){window.__urpppSystemThemeBound=!0;try{let t=window.matchMedia("(prefers-color-scheme: dark)"),e=()=>{if(Xt())try{Gt(xe(),{system:!0})}catch{}};t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e)}catch{}}}try{Xt()?Gt(xe(),{system:!0}):Gt(Yt())}catch{}try{ae()}catch{}try{Ss()}catch{}function _s(t){let e=String(document.body&&document.body.innerText||t&&t.innerText||"").replace(/\s+/g," ").trim(),r=[/token\s*校验失败[！!]?/i,/令牌\s*校验失败[！!]?/i,/验证码.{0,12}(?:错误|失败|过期)[！!]?/i,/(?:用户名|账号|学号).{0,12}(?:密码).{0,12}(?:错误|失败)[！!]?/i,/登录.{0,12}(?:错误|失败)[！!]?/i];for(let a of r){let p=e.match(a);if(p)return p[0].trim()}return""}function en(){let t=location.pathname,e=document.getElementById("formContent"),r=document.querySelector(".form-signin");if(!e||!r){setTimeout(en,50);return}if(e.querySelector(":scope > #urppp-root"))return;let a=_s(e),p=r.querySelector('a[onclick*="toModifyPwd"]'),i=(()=>{let R=e.querySelector(".fadeIn.first svg");return R?R.outerHTML:""})(),s=(()=>{let R=document.querySelector("#tocas a");return R?R.href:"https://id.scu.edu.cn/"})();for(let R of e.children)R.style.display="none";e.style.cssText="max-width:420px;width:90%;margin:0 auto;background:transparent;box-shadow:none;border-radius:0;position:relative;z-index:1;";let u=location.pathname==="/loginEn",m=(R,B)=>u?B:R;e.insertAdjacentHTML("afterbegin",`
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
          <div class="ub-logo">${i||""}</div>
          <h1>${m("四川大学教务管理系统","SCU Academic System")}</h1>
          <p>${m("学生端 · 欢迎登录","Student Portal · Welcome")}</p>
        </div>

        <div class="ut" id="urppp-tabs">
          <button class="ac" data-mode="account">${m("账号登录","Account")}</button>
          <button data-mode="sso">${m("统一认证","SSO")}</button>
        </div>

        ${a?`<div class="urppp-login-error" role="alert">${Z(a)}</div>`:""}

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
          <a href="${u?"/login":"/loginEn"}">${u?"中文":"EN"}</a>
        </div>

        <div class="us" id="urppp-dots">
          <span data-theme="default" title="简约白" style="background:#F5F5F7;box-shadow:inset 0 0 0 1px #D2D2D7"></span>
          <span data-theme="dark" title="深邃暗" style="background:#0B0F17"></span>
          <span data-theme="scu-red" title="动态配色" style="background:#B53434"></span>
        </div>
      </div>
    </div>`);let w=e.querySelector("#urppp-root");[["#urppp-user","#input_username"],["#urppp-pass","#input_password"],["#urppp-cap","#input_checkcode"]].forEach(([R,B])=>{let K=w.querySelector(R),dt=document.querySelector(B);K&&dt&&(dt.value&&(K.value=dt.value),K.addEventListener("input",()=>{dt.value=K.value}))});let q=w.querySelector("#urppp-capimg"),$=w.querySelector("#urppp-capwrap"),M=document.querySelector(".form-signin img");if(q&&M){q.src=M.src;let R=()=>{let B=M.src.replace(/\?.*/,"")+"?"+Date.now();M.src=B,q.src=B};$?$.addEventListener("click",R):q.addEventListener("click",R)}w.querySelectorAll(".ut button").forEach(R=>{R.addEventListener("click",()=>{if(R.dataset.mode==="sso"){location.href=s;return}w.querySelectorAll(".ut button").forEach(dt=>dt.classList.remove("ac")),R.classList.add("ac");let B=w.querySelector("#urppp-form"),K=w.querySelector("#urppp-sso");B&&(B.style.display="block"),K&&(K.style.display="none")})});let j=w.querySelector("#urppp-submit");j.addEventListener("click",()=>{if(j.dataset.submitting==="1")return;j.dataset.submitting="1",j.disabled=!0;let R=document.getElementById("loginButton");R?R.click():typeof r.requestSubmit=="function"?r.requestSubmit():r.submit(),setTimeout(()=>{j.dataset.submitting="0",j.disabled=!1},1500)}),w.querySelectorAll(".ui").forEach(R=>{R.addEventListener("keydown",B=>{B.key==="Enter"&&j.click()})}),w.querySelector("#urppp-forgot").addEventListener("click",R=>{R.preventDefault(),p&&p.click()});let Y=w.querySelector("#urppp-dots"),O=()=>{if(!Y)return;let R=Yt();Y.querySelectorAll("span").forEach(K=>{K.classList.toggle("ac",K.dataset.theme===R)});let B=Y.querySelector('span[data-theme="scu-red"]');if(B){let K=Zt()||mt;try{let dt=te(K,De());B.style.background="linear-gradient(135deg, "+dt.primary+" 0 55%, "+dt.surface+" 55% 100%)"}catch{B.style.background=K}}};Y&&(Y.querySelectorAll("span").forEach(R=>{R.addEventListener("click",()=>{Gt(R.dataset.theme,{manual:!0}),O()})}),O()),console.log("[URP++] 登录界面已重建"),setTimeout(()=>{document.body.classList.add("urppp-ready"),wt()},100)}let{beautifyBreadcrumbs:Ur}=cs({});function Na(){try{document.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(t=>{if(t.classList.contains("setLabelWidth")||t.classList.contains("urppp-query-form")||t.querySelector(".urppp-query-pair"))return;let e=Array.from(t.querySelectorAll(":scope > .profile-info-row, .profile-info-row"));!e.length||e.some(a=>Array.from(a.children).filter(p=>p.classList&&p.classList.contains("profile-info-name")).length>=2)||(t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("display","block","important"),Jr(t),e.forEach(a=>{a.classList.remove("urppp-query-row","urppp-dual-pair"),delete a.dataset.urpppQueryDone,delete a.dataset.urpppQueryCols;let p=Array.from(a.querySelectorAll(":scope > .urppp-query-pair"));if(p.length){let i=[];for(p.forEach(s=>Array.from(s.children).forEach(u=>i.push(u)));a.firstChild;)a.removeChild(a.firstChild);i.forEach(s=>a.appendChild(s))}a.style.setProperty("display","grid","important"),a.style.setProperty("grid-template-columns","140px minmax(0,1fr)","important"),a.style.setProperty("align-items","stretch","important"),a.style.setProperty("width","100%","important"),Array.from(a.children).forEach(i=>{i.classList&&(i.style.setProperty("float","none","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("box-sizing","border-box","important"))})}))})}catch(t){console.warn("[URP++] single pair profile fix failed",t)}}function Wr(){let t=document.querySelector(".page-content")||document.getElementById("page-content-template");t&&(t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{if(!e.querySelector(".setLabelWidth"))return;let r=e.querySelector(".setLabelWidth");r&&(e.querySelectorAll("h4.header, h3.header, .header.smaller, .header").forEach(a=>{r.contains(a)||a.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING&&(a.classList.add("urppp-section-label"),["background","background-color","background-image","border","box-shadow","border-radius","padding","margin","min-height"].forEach(p=>{a.style.removeProperty(p)}),a.style.setProperty("background","transparent","important"),a.style.setProperty("background-color","transparent","important"),a.style.setProperty("background-image","none","important"),a.style.setProperty("border","0 none transparent","important"),a.style.setProperty("box-shadow","none","important"),a.style.setProperty("border-radius","0","important"),a.style.setProperty("padding","4px 2px 10px","important"),a.style.setProperty("margin","0 0 8px 0","important"),a.style.setProperty("min-height","0","important"))}),r.classList.remove("urppp-query-form"),r.style.setProperty("padding","0","important"),r.style.setProperty("overflow","hidden","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("border",He(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-shadow","none","important"))}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.querySelectorAll(".profile-info-row").forEach(r=>{r.classList.remove("urppp-query-row"),delete r.dataset.urpppQueryDone,delete r.dataset.urpppQueryCols;let a=Array.from(r.querySelectorAll(":scope > .urppp-query-pair"));if(a.length){let p=[];for(a.forEach(i=>{Array.from(i.children).forEach(s=>p.push(s))});r.firstChild;)r.removeChild(r.firstChild);p.forEach(i=>r.appendChild(i))}})}),t.querySelectorAll(".setLabelWidth .profile-info-row, .profile-user-info.setLabelWidth .profile-info-row, .profile-user-info-striped.setLabelWidth .profile-info-row").forEach(e=>{let r=Array.from(e.querySelectorAll(":scope > .urppp-query-pair"));if(r.length){let i=[];for(r.forEach(s=>{Array.from(s.children).forEach(u=>i.push(u))});e.firstChild;)e.removeChild(e.firstChild);i.forEach(s=>e.appendChild(s))}e.classList.remove("urppp-query-row"),delete e.dataset.urpppQueryDone,delete e.dataset.urpppQueryCols;let a=Array.from(e.children).filter(i=>i.classList&&(i.classList.contains("profile-info-name")||i.classList.contains("profile-info-value")));a.filter(i=>i.classList.contains("profile-info-name")).length>=2?(e.classList.add("urppp-dual-pair"),e.style.setProperty("display","grid","important"),e.style.setProperty("grid-template-columns","112px minmax(140px,1fr) 112px minmax(140px,1fr)","important"),e.style.setProperty("align-items","stretch","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("float","none","important"),a.forEach(i=>{i.style.setProperty("float","none","important"),i.style.setProperty("clear","none","important"),i.style.setProperty("margin","0","important"),i.style.setProperty("margin-left","0","important"),i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","none","important"),i.style.setProperty("min-width","0","important"),i.style.setProperty("box-sizing","border-box","important"),i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.classList.contains("profile-info-value")?(i.style.removeProperty("width"),i.style.setProperty("width","auto","important"),i.style.setProperty("justify-content","flex-start","important"),i.style.setProperty("white-space","normal","important"),i.style.setProperty("word-break","normal","important")):(i.style.setProperty("justify-content","flex-end","important"),i.style.setProperty("white-space","nowrap","important"))})):e.classList.remove("urppp-dual-pair")}),t.querySelectorAll(".profile-user-info.setLabelWidth, .profile-user-info-striped.setLabelWidth").forEach(e=>{e.classList.remove("urppp-query-form"),e.style.cssText=(e.getAttribute("style")||"").replace(/padding\s*:[^;]+;?/gi,""),e.style.setProperty("background","var(--surface)","important"),e.style.setProperty("border-radius","12px","important"),e.style.setProperty("overflow","hidden","important"),e.style.setProperty("border",He(),"important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("width","100%","important"),e.style.setProperty("max-width","100%","important"),e.style.setProperty("box-sizing","border-box","important"),e.style.setProperty("margin","0 0 16px 0","important"),e.style.setProperty("padding","0","important");let r=e.closest(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8")||e.parentElement;r&&Array.from(r.querySelectorAll("h4.header, h3.header, .header.smaller")).forEach(a=>{e.contains(a)||a.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_FOLLOWING&&(a.classList.add("urppp-section-label"),a.style.setProperty("background","transparent","important"),a.style.setProperty("background-color","transparent","important"),a.style.setProperty("background-image","none","important"),a.style.setProperty("border","0 none transparent","important"),a.style.setProperty("box-shadow","none","important"),a.style.setProperty("border-radius","0","important"),a.style.setProperty("padding","4px 2px 10px","important"),a.style.setProperty("margin","0 0 8px 0","important"),a.style.setProperty("min-height","0","important"))})}),t.querySelectorAll(".urppp-col-row").forEach(e=>{e.classList.remove("urppp-col-row"),["display","flex-wrap","gap","align-items","width","box-sizing"].forEach(r=>e.style.removeProperty(r))}),t.querySelectorAll('[class*="col-xs-"], [class*="col-sm-"], [class*="col-md-"], [class*="col-lg-"]').forEach(e=>{["float","flex","width","max-width","padding-left","padding-right","box-sizing"].forEach(r=>{e.style.getPropertyPriority(r)==="important"&&e.style.removeProperty(r)}),e.style.setProperty("padding-left","0","important"),e.style.setProperty("box-sizing","border-box","important")}),t.querySelectorAll(".col-xs-4, .col-sm-4, .col-md-4").forEach(e=>{e.style.setProperty("padding-right","16px","important")}),t.querySelectorAll(".col-xs-8, .col-sm-8, .col-md-8").forEach(e=>{e.style.setProperty("padding-left","0","important"),e.style.setProperty("padding-right","0","important")}),t.querySelectorAll(".col-xs-4, .col-xs-8, .col-sm-4, .col-sm-8, .col-md-4, .col-md-8").forEach(e=>{e.querySelector(".setLabelWidth")&&e.querySelectorAll(":scope > h4.header, :scope > .header, :scope > .header.smaller").forEach(r=>{r.style.cssText+=";background:transparent!important;background-color:transparent!important;border:none!important;box-shadow:none!important;border-radius:0!important;padding:4px 2px 10px!important;margin:0 0 8px 0!important;min-height:0!important;"})}),t.querySelectorAll(".urppp-section-title-wrap").forEach(e=>{let r=e.querySelector("h4.header, h3.header, h5.header, .header.smaller");if(!r){e.remove();return}let a=e.nextElementSibling;for(;a&&!a.querySelector?.('.col-xs-4, .col-sm-4, .col-md-4, [class*="col-xs-"], [class*="col-sm-"]');)a=a.nextElementSibling;let p=a&&(a.querySelector(".col-xs-4, .col-sm-4, .col-md-4")||Array.from(a.children).find(i=>/col-(?:xs|sm|md|lg)-([1-9]|1[01])\b/.test(i.className||"")));p&&(p.insertBefore(r,p.firstChild),delete r.dataset.urpppHoisted,r.style.removeProperty("width"),r.style.removeProperty("max-width"),r.style.removeProperty("margin-left"),r.style.removeProperty("margin-right"),r.style.removeProperty("box-sizing"),r.style.removeProperty("position"),r.style.removeProperty("left")),e.remove()}))}function Gr(){let t=typeof unsafeWindow<"u"?unsafeWindow:window;return t.jQuery||t.$||window.jQuery||window.$||null}function Es(t){return t?t.id&&String(t.id).indexOf("pagination_pageSize_")===0?!0:!!(t.closest&&t.closest('#urppagebar, .urppagebreak, .dataTables_paginate, [id^="sample-table-2_paginate_"]')):!1}function rn(t){if(t){try{let e=Gr();e&&e.fn&&e(t).data("chosen")&&e(t).chosen("destroy")}catch{}try{if(t.parentElement&&t.parentElement.querySelectorAll(":scope > .chosen-container").forEach(e=>{try{e.remove()}catch{}}),t.nextElementSibling&&t.nextElementSibling.classList.contains("chosen-container"))try{t.nextElementSibling.remove()}catch{}}catch{}t.classList.remove("urppp-chosen-hidden","chzn-done","chosen");try{delete t.dataset.urpppChosen}catch{}t.style.setProperty("display","inline-block","important")}}let an=0,on=!1;function Cs(){if(on)return;on=!0;let t=e=>{if(Date.now()<an){try{e.preventDefault()}catch{}try{e.stopPropagation()}catch{}}};document.addEventListener("mousedown",t,!0),document.addEventListener("mouseup",t,!0),document.addEventListener("click",t,!0)}function Ba(t){if(!t||t.__urpppChosenNoPierce)return;t.__urpppChosenNoPierce=!0,Cs();let e=t.querySelector(".chosen-drop"),r=a=>{let p=a.target;!p||!p.closest||!p.closest(".chosen-results li")||(an=Date.now()+350)};t.addEventListener("mouseup",r,!1),t.addEventListener("touchend",r,!1),e&&(e.addEventListener("mouseup",r,!1),e.addEventListener("touchend",r,!1))}function Fa(t=document){try{t.querySelectorAll(".chosen-container").forEach(Ba)}catch{}}function ve(){try{let t=Gr();if(!t||!t.fn||typeof t.fn.chosen!="function")return!1;let e=document.querySelectorAll(".profile-user-info, .urppp-query-form, .profile-info-row, form"),r=new Set,a=[];if(e.forEach(p=>{p.querySelectorAll("select").forEach(i=>{r.has(i)||(r.add(i),a.push(i))})}),document.querySelectorAll("select.value_element, .profile-info-value > select").forEach(p=>{r.has(p)||(r.add(p),a.push(p))}),a.forEach(p=>{if(!p||p.multiple||p.disabled||p.size&&p.size>1)return;if(Es(p)){rn(p);return}let i=t(p);if(!!i.data("chosen")||p.classList.contains("chzn-done")||!!(p.nextElementSibling&&p.nextElementSibling.classList.contains("chosen-container"))||!!(p.parentElement&&p.parentElement.querySelector(":scope > .chosen-container"))){p.dataset.urpppChosen="1",p.classList.add("urppp-chosen-hidden"),p.style.setProperty("display","none","important");let u=p.nextElementSibling&&p.nextElementSibling.classList.contains("chosen-container")?p.nextElementSibling:p.parentElement&&p.parentElement.querySelector(":scope > .chosen-container");u&&Ba(u);return}try{p.classList.contains("select")||p.classList.add("select");try{i.data("chosen")&&i.chosen("destroy")}catch{}i.chosen({allow_single_deselect:!0,search_contains:!0,width:"100%",no_results_text:"无匹配项",disable_search_threshold:0}),p.dataset.urpppChosen="1",p.classList.add("urppp-chosen-hidden"),p.style.setProperty("display","none","important");let u=p.nextElementSibling&&p.nextElementSibling.classList.contains("chosen-container")?p.nextElementSibling:p.parentElement&&p.parentElement.querySelector(".chosen-container");u&&(u.style.setProperty("width","100%","important"),u.style.setProperty("min-width","0","important"),u.style.setProperty("display","block","important")),u&&Ba(u)}catch(u){console.warn("[URP++] chosen init failed",p,u)}}),!window.__urpppChosenHtmlPatch){window.__urpppChosenHtmlPatch=!0;let p=t.fn.html;t.fn.html=function(){let i=p.apply(this,arguments);if(arguments.length)try{this.filter("select").add(this.find("select")).each(function(){let s=t(this);if(s.data("chosen")||s.next(".chosen-container").length)try{s.trigger("chosen:updated")}catch{}})}catch{}return i}}return!0}catch(t){return console.warn("[URP++] ensureQueryChosen failed",t),!1}}function nn(){if(window.__urpppChosenScheduleBound)return;window.__urpppChosenScheduleBound=!0,[0,200,600,1500,3e3].forEach(a=>setTimeout(()=>{ve(),Fa()},a));let e=0,r=setInterval(()=>{e+=1;let a=ve();Fa(),(a&&e>3||e>15)&&clearInterval(r)},500)}let{beautifyPagebar:pn}=vi({destroyPagebarChosen:rn}),{scheduleBeautifyPagebar:sn}=yi({beautifyPagebar:pn});function Da(){try{document.querySelectorAll("#drag-ul, ul#drag-ul").forEach(t=>{if(!t)return;let e=Array.from(t.children).filter(r=>r.tagName==="LI");if(!e.length){t.classList.add("urppp-empty"),t.style.setProperty("display","none","important");let r=t.closest("#xq-section, .widget-main, .widget-body");r&&!r.querySelector("li")&&(r.classList.add("urppp-empty"),r.style.setProperty("display","none","important"));return}t.classList.remove("urppp-empty"),t.classList.add("urppp-drag-ul"),t.style.removeProperty("display"),t.style.setProperty("height","auto","important"),t.style.setProperty("min-height","0","important"),e.forEach(r=>{let a=(r.textContent||"").replace(/\s+/g," ").trim(),p=(r.getAttribute("onclick")||"").includes("goDetail")||r.classList.contains("ui-selectee")||r.classList.contains("jc-future")||!!r.querySelector("a");!p&&/校区/.test(a)&&a.length<=12?(r.classList.add("xq-section"),r.classList.remove("ui-selectee","jc-future","urppp-building-active")):p&&!r.classList.contains("jc-future")&&r.classList.add("ui-selectee")})}),window.__urpppBuildingActiveBound||(window.__urpppBuildingActiveBound=!0,document.addEventListener("click",t=>{let e=t.target&&t.target.closest?t.target.closest("#drag-ul > li"):null;if(!e||e.classList.contains("xq-section")||e.classList.contains("jc-future"))return;let r=e.parentElement;r&&(r.querySelectorAll("li.urppp-building-active, li.ui-selected").forEach(a=>{a.classList.remove("urppp-building-active","ui-selected")}),e.classList.add("urppp-building-active","ui-selected"))},!0))}catch(t){console.warn("[URP++] free classroom list beautify failed",t)}}function Jr(t){if(!t||!t.style)return;if(t.classList.contains("setLabelWidth")){t.classList.remove("urppp-query-form"),t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",He(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 16px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important");return}let e=!!(t.closest&&t.closest(".widget-box, .widget-main, .widget-body, .panel"));t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","100%","important"),t.style.setProperty("min-width","0","important"),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("float","none","important"),t.style.setProperty("display","block","important"),t.style.setProperty("clear","both","important");let r=t.parentElement&&t.parentElement.tagName==="FORM"?t.parentElement:null;r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("max-width","100%","important"),r.style.setProperty("display","block","important"),r.style.setProperty("float","none","important"),r.style.setProperty("box-sizing","border-box","important"),r.style.setProperty("margin","0","important"));let a=t.closest&&t.closest(".tab-pane, .tab-content");if(a&&(a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("box-sizing","border-box","important")),e){t.style.setProperty("background","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("margin","0","important"),t.style.setProperty("box-shadow","none","important");return}t.style.setProperty("background","var(--surface)","important"),t.style.setProperty("border",He(),"important"),t.style.setProperty("border-radius","12px","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("margin","0 0 18px 0","important"),!t.classList.contains("setLabelWidth")&&(t.classList.contains("urppp-query-form")||!!t.querySelector(".urppp-query-pair, .chosen-container"))?(t.style.setProperty("padding","14px 16px","important"),t.style.setProperty("overflow","visible","important")):(t.style.setProperty("padding","0","important"),t.style.setProperty("overflow","hidden","important"))}function mr(){try{ve(),document.querySelectorAll(".page-content .profile-user-info, #page-content-template .profile-user-info").forEach(a=>{Jr(a)});let t=a=>{let p=a.closest(".profile-user-info, .urppp-query-form")||a.parentElement;if(!p)return Math.min(Math.max(a.querySelectorAll(":scope > .urppp-query-pair").length,1),4);let i=0;return p.querySelectorAll(":scope > .profile-info-row, .profile-info-row").forEach(s=>{let u=s.querySelectorAll(":scope > .urppp-query-pair").length;u>i&&(i=u)}),Math.min(Math.max(i,1),4)},e=a=>{let p=Array.from(a.querySelectorAll(":scope > .urppp-query-pair")),i=t(a);a.classList.add("urppp-query-row"),a.style.setProperty("display","grid","important"),a.style.removeProperty("grid-template-columns"),a.style.setProperty("column-gap","14px","important"),a.style.setProperty("row-gap","10px","important"),a.style.setProperty("align-items","center","important"),a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("box-sizing","border-box","important"),a.dataset.urpppQueryCols=String(i),p.forEach(s=>{s.style.removeProperty("grid-column")}),p.forEach(s=>{s.style.setProperty("display","flex","important"),s.style.setProperty("align-items","center","important"),s.style.setProperty("width","100%","important"),s.style.setProperty("min-width","0","important"),s.style.setProperty("max-width","100%","important"),s.style.setProperty("box-sizing","border-box","important"),s.style.removeProperty("flex");let u=s.querySelector(".profile-info-name"),m=s.querySelector(".profile-info-value");u&&(u.style.setProperty("float","none","important"),u.style.setProperty("display","flex","important"),u.style.setProperty("align-items","center","important"),u.style.setProperty("justify-content","flex-end","important"),u.style.setProperty("flex","0 0 var(--urppp-qlabel, 84px)","important"),u.style.setProperty("width","var(--urppp-qlabel, 84px)","important"),u.style.setProperty("min-width","var(--urppp-qlabel, 84px)","important"),u.style.setProperty("max-width","var(--urppp-qlabel-max, 96px)","important"),u.style.setProperty("margin","0","important"),u.style.setProperty("margin-left","0","important"),u.style.setProperty("padding","0 8px 0 0","important"),u.style.setProperty("background","transparent","important"),u.style.setProperty("border","none","important"),u.style.setProperty("border-right","none","important")),m&&(m.style.setProperty("float","none","important"),m.style.setProperty("display","flex","important"),m.style.setProperty("align-items","center","important"),m.style.setProperty("flex","1 1 auto","important"),m.style.setProperty("width","auto","important"),m.style.setProperty("min-width","0","important"),m.style.setProperty("max-width","none","important"),m.style.setProperty("margin","0","important"),m.style.setProperty("margin-left","0","important"),m.style.setProperty("padding","0","important"),m.style.setProperty("background","transparent","important"),m.style.setProperty("border","none","important"),m.querySelectorAll("input, select, .chosen-container, .form-control").forEach(w=>{w.style.setProperty("width","100%","important"),w.style.setProperty("min-width","0","important"),w.style.setProperty("max-width","none","important")})),s.querySelectorAll(".chosen-container").forEach(w=>{let q=w.previousElementSibling;q&&q.tagName==="SELECT"&&(q.style.setProperty("display","none","important"),q.classList.add("urppp-chosen-hidden"));let $=w.parentElement&&w.parentElement.querySelector("select");$&&($.style.setProperty("display","none","important"),$.classList.add("urppp-chosen-hidden")),w.style.setProperty("width","100%","important"),w.style.setProperty("min-width","0","important"),w.style.setProperty("max-width","none","important");let M=w.querySelector(".chosen-single");if(M){M.style.setProperty("width","100%","important"),M.style.setProperty("max-width","none","important"),M.style.setProperty("display","flex","important"),M.style.setProperty("align-items","center","important"),M.style.setProperty("height","34px","important"),M.style.setProperty("line-height","normal","important");let j=M.querySelector(":scope > span, span");j&&(j.style.setProperty("line-height","normal","important"),j.style.setProperty("height","auto","important"),j.style.setProperty("margin-top","0","important"),j.style.setProperty("padding-top","0","important"));let Y=M.querySelector("div");if(Y){Y.style.setProperty("display","flex","important"),Y.style.setProperty("align-items","center","important"),Y.style.setProperty("justify-content","center","important"),Y.style.setProperty("top","0","important"),Y.style.setProperty("bottom","0","important"),Y.style.setProperty("height","auto","important");let O=Y.querySelector("b");O&&(O.style.setProperty("margin","0","important"),O.style.setProperty("background-position","center center","important"),O.style.setProperty("background-size","12px 12px","important"),O.style.setProperty("width","14px","important"),O.style.setProperty("height","14px","important"))}}})})};document.querySelectorAll(".profile-user-info.self, .profile-user-info-striped.self, .profile-user-info:has(.value_element)").forEach(a=>{if(a.classList.contains("setLabelWidth")||a.closest&&a.closest("#curriculumInfo-divcon, #curriculumInfo-divcon1, #curriculumInfo-divcon2, #fajh, #xnxq, #kz, #kc, #kcfa"))return;let p=Array.from(a.querySelectorAll(".profile-info-row")).some(s=>Array.from(s.children).filter(u=>u.classList&&u.classList.contains("profile-info-name")).length>=2),i=!!a.querySelector("select.chosen, select.select, .chosen-container");if(!p&&!i){a.classList.remove("urppp-query-form");return}a.querySelector('select, input:not([type="hidden"]), .chosen-container, .value_element, textarea')&&(a.classList.add("urppp-query-form"),Jr(a),a.querySelectorAll(".profile-info-row").forEach(s=>{if(s.dataset.urpppQueryDone==="1"){s.querySelector(":scope > .urppp-query-pair")&&e(s);return}let u=Array.from(s.children).filter($=>$.classList&&($.classList.contains("profile-info-name")||$.classList.contains("profile-info-value"))),m=[];for(let $=0;$<u.length;){let M=u[$],j=u[$+1];M&&j&&M.classList.contains("profile-info-name")&&j.classList.contains("profile-info-value")?(m.push([M,j]),$+=2):$+=1}if(!m.length){s.dataset.urpppQueryDone="1";return}let w=document.createDocumentFragment(),q=new Set;for(m.forEach(([$,M])=>{let j=document.createElement("div");j.className="urppp-query-pair",j.appendChild($),j.appendChild(M),q.add($),q.add(M),w.appendChild(j)}),u.forEach($=>{q.has($)||w.appendChild($)});s.firstChild;)s.removeChild(s.firstChild);s.appendChild(w),s.dataset.urpppQueryDone="1",e(s)}))}),ve()}catch(t){console.warn("[URP++] query form beautify failed",t)}}function ln(){if(window.__urpppChosenAlignBound)return;window.__urpppChosenAlignBound=!0;let t=!1,e=r=>{if(!t){t=!0;try{let a=r&&r.querySelectorAll?r:document,p=document.getElementById("urppp-chosen-li-style");p||(p=document.createElement("style"),p.id="urppp-chosen-li-style",document.documentElement.appendChild(p)),p.textContent=[".self div.profile-info-value a.chosen-single > span,","body .self div.profile-info-value a.chosen-single > span {","  line-height: normal !important;","  height: auto !important;","  margin-top: 0 !important;","  padding-top: 0 !important;","}",".self div.profile-info-value a.chosen-single,","body .self div.profile-info-value a.chosen-single {","  display: flex !important;","  align-items: center !important;","  height: 34px !important;","  line-height: normal !important;","}","body .chosen-container .chosen-results li,","body .chosen-with-drop .chosen-results li,","html body .chosen-container .chosen-results li.active-result {","  display:flex !important;","  align-items:center !important;","  justify-content:flex-start !important;","  height:36px !important;","  min-height:36px !important;","  max-height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","  margin:0 !important;","  box-sizing:border-box !important;","}","body .chosen-container .chosen-results li.highlighted,","body .chosen-container .chosen-results li.result-selected {","  display:flex !important;","  align-items:center !important;","  height:36px !important;","  line-height:1 !important;","  padding:0 12px !important;","}"].join(""),a.querySelectorAll(".chosen-results li").forEach(i=>{i.style.cssText=["display:flex !important","align-items:center !important","justify-content:flex-start !important","height:36px !important","min-height:36px !important","max-height:36px !important","line-height:1 !important","padding:0 12px !important","margin:0 !important","box-sizing:border-box !important"].join(";")}),a.querySelectorAll("a.chosen-single").forEach(i=>{i.style.setProperty("display","flex","important"),i.style.setProperty("align-items","center","important"),i.style.setProperty("height","34px","important"),i.style.setProperty("min-height","34px","important"),i.style.setProperty("line-height","normal","important"),i.style.setProperty("padding-top","0","important"),i.style.setProperty("padding-bottom","0","important");let s=i.querySelector(":scope > span");s&&(s.style.setProperty("line-height","normal","important"),s.style.setProperty("height","auto","important"),s.style.setProperty("margin-top","0","important"),s.style.setProperty("margin-bottom","0","important"),s.style.setProperty("padding-top","0","important"),s.style.setProperty("padding-bottom","0","important"))}),a.querySelectorAll(".chosen-search").forEach(i=>{if(!i.querySelector(".urppp-chosen-search-icon")){let s=document.createElement("i");s.className="fa fa-search urppp-chosen-search-icon",s.setAttribute("aria-hidden","true"),i.appendChild(s)}})}finally{setTimeout(()=>{t=!1},0)}}};document.addEventListener("mousedown",r=>{let a=r.target&&r.target.closest?r.target.closest(".chosen-container"):null;a&&(setTimeout(()=>e(a),0),setTimeout(()=>e(a),30),setTimeout(()=>e(a),100),setTimeout(()=>e(a),200))},!0);try{let r=window.jQuery||window.$;r&&r.fn&&r(document).off("chosen:showing_dropdown.urppp chosen:updated.urppp").on("chosen:showing_dropdown.urppp chosen:updated.urppp",a=>{let p=a.target&&a.target.parentElement?a.target.parentElement:document;setTimeout(()=>e(p),0),setTimeout(()=>e(p),60)})}catch{}}function ja(){try{let t=document.getElementById("work_rest_schedule_modal");if(!t)return;(t.classList.contains("in")||t.classList.contains("show"))&&t.style.setProperty("display","block","important");let e=t.querySelector(".modal-body")||t,r=Array.from(e.querySelectorAll("table"));if(!r.length)return;let a=s=>(s||"").replace(/\s+/g," ").trim(),p=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");if(e.dataset.urpppWrsDone==="1")return;e.dataset.urpppWrsDone="1",r.forEach(s=>{let u=s.closest(".urppp-table-wrap");u&&t.contains(u)&&u.parentElement&&(u.parentElement.insertBefore(s,u),u.remove()),s.classList.add("urppp-wrs-table"),s.style.setProperty("width","100%","important");let m=Array.from(s.rows||[]);if(!m.length)return;let w=0;m.forEach(q=>{let $=a(q.textContent);if(!/\d{1,2}:\d{2}/.test($))return;let M=0;Array.from(q.cells||[]).forEach(j=>{M+=j.colSpan||1}),M>w&&(w=M)}),w<4&&m.forEach(q=>{let $=0;Array.from(q.cells||[]).forEach(M=>{$+=M.colSpan||1}),$>w&&(w=$)}),w<1&&(w=1),Array.from(s.rows||[]).forEach(q=>{let $=Array.from(q.cells||[]);if(!$.length)return;let M=a(q.textContent);if(!/\d{1,2}:\d{2}/.test(M)&&(/作息时间|学年/.test(M)||/(望江|华西|江安)/.test(M)&&/校区|时间|安排|作息/.test(M))){let O=M;q.className="urppp-wrs-title-row",q.innerHTML='<td class="urppp-wrs-title" colspan="'+w+'" align="center">'+p(O)+"</td>";return}$.forEach(O=>{["border","borderTop","borderRight","borderBottom","borderLeft","textAlign","verticalAlign","width"].forEach(B=>{try{O.style[B]=""}catch{}}),O.classList.remove("urppp-wrs-title","urppp-wrs-period","urppp-wrs-time","urppp-wrs-head");let R=a(O.textContent);R&&(/^(上午|下午|晚上|中午)$/.test(R)||(O.rowSpan||1)>1&&/上午|下午|晚上|中午/.test(R)?O.classList.add("urppp-wrs-period"):/节次|大节|时间|校区/.test(R)&&!/\d{1,2}:\d{2}/.test(R)&&!/第\d/.test(R)?/节次|时间|大节|校区/.test(M)&&!/\d{1,2}:\d{2}/.test(M)&&O.classList.add("urppp-wrs-head"):/\d{1,2}:\d{2}/.test(R)&&O.classList.add("urppp-wrs-time"),O.style.setProperty("text-align","center","important"),O.style.setProperty("vertical-align","middle","important"))})})});let i=t.querySelector(".modal-title");i&&(i.style.setProperty("text-align","center","important"),i.style.setProperty("width","100%","important")),e.dataset.urpppWrsDone="1"}catch{}}let cn="https://jwc.scu.edu.cn/cdxl.htm";function Oa(){let t=['a[onclick*="jwc.scu.edu.cn/article/206"]','a[href*="jwc.scu.edu.cn/article/206"]',".cdsj a",".ace-nav a"],e=new Set;t.forEach(r=>{document.querySelectorAll(r).forEach(a=>{if(e.has(a))return;e.add(a);let p=(a.textContent||"").replace(/\s+/g,""),i=a.getAttribute("onclick")||"",s=a.getAttribute("href")||"";(p.includes("学校校历")||i.includes("article/206")||s.includes("article/206")||i.includes("jwc.scu.edu.cn")&&p.includes("校历"))&&(a.setAttribute("href",cn),a.setAttribute("target","_blank"),a.setAttribute("rel","noopener noreferrer"),a.setAttribute("onclick",`window.open('${cn}');return false;`))})})}function Vr(){document.querySelectorAll("#navbar-example, .page-content .navbar.navbar-static, #page-content-template .navbar.navbar-static").forEach(t=>{if(!t.querySelector(".nav-tabs"))return;["background","background-color","background-image","border","border-radius","box-shadow"].forEach(a=>{t.style.setProperty(a,a.startsWith("background")||a==="box-shadow"?a==="box-shadow"?"none":"transparent":a==="border"?"none":"0","important")}),t.style.setProperty("background","transparent","important"),t.style.setProperty("background-color","transparent","important"),t.style.setProperty("border","none","important"),t.style.setProperty("border-radius","0","important"),t.style.setProperty("box-shadow","none","important"),t.style.setProperty("width","100%","important"),t.style.setProperty("margin","0 0 14px 0","important"),t.style.setProperty("padding","0","important"),t.style.setProperty("min-height","0","important"),t.style.setProperty("box-sizing","border-box","important");let e=t.querySelector(".navbar-inner");e&&(e.style.setProperty("background","transparent","important"),e.style.setProperty("border","none","important"),e.style.setProperty("box-shadow","none","important"),e.style.setProperty("padding","0","important"),e.style.setProperty("min-height","0","important"),e.style.setProperty("filter","none","important"),e.style.setProperty("width","100%","important")),t.querySelectorAll(".container, .container-fluid").forEach(a=>{a.style.setProperty("width","100%","important"),a.style.setProperty("max-width","100%","important"),a.style.setProperty("margin","0","important"),a.style.setProperty("margin-left","0","important"),a.style.setProperty("padding","0","important"),a.style.setProperty("background","transparent","important"),a.style.setProperty("box-sizing","border-box","important")});let r=t.querySelector(".nav-tabs");r&&(r.style.setProperty("width","100%","important"),r.style.setProperty("margin","0","important"),r.style.setProperty("padding","8px 10px","important"),r.style.setProperty("background","var(--surface)","important"),r.style.setProperty("background-color","var(--surface)","important"),r.style.setProperty("border",He(),"important"),r.style.setProperty("border-radius","12px","important"),r.style.setProperty("box-sizing","border-box","important"))})}function Ue(){let t=e=>{let r=NaN,a=[e.getAttribute("data-percent"),e.querySelector("[data-percent]")?.getAttribute("data-percent"),e.querySelector(".percent")?.textContent,e.querySelector(".urppp-pct-text")?.textContent];for(let p of a){if(p==null||p==="")continue;let i=parseFloat(String(p).replace(/[^\d.]/g,""));if(!Number.isNaN(i)){r=i;break}}if(Number.isNaN(r)){let p=(e.textContent||"").match(/(\d+(?:\.\d+)?)\s*%/);p&&(r=parseFloat(p[1]))}if(Number.isNaN(r)){let p=e.querySelector('.progress-bar, .infobox-progress [style*="width"], .urppp-pct-fill');if(p){let i=String(p.style.width||"").match(/([\d.]+)%/);i&&(r=parseFloat(i[1]))}}return Number.isNaN(r)?null:Math.max(0,Math.min(100,r))};document.querySelectorAll(".infobox").forEach(e=>{let r=t(e);if(r==null)return;e.querySelectorAll("canvas").forEach(s=>s.remove()),e.querySelectorAll(".easy-pie-chart, .percentage, .infobox-progress").forEach(s=>{s.classList.contains("urppp-pct-bar")||s.remove()}),e.querySelectorAll(".urppp-pct-text, .urppp-pct-bar").forEach(s=>s.remove());let a=e.querySelector(".infobox-data")||e,p=document.createElement("div");p.className="urppp-pct-text",p.textContent=Math.round(r)+"%";let i=document.createElement("div");if(i.className="urppp-pct-bar"+(r<=0?" is-empty":""),r>0){let s=document.createElement("span");s.className="urppp-pct-fill",s.style.width=r+"%",i.appendChild(s)}a.insertBefore(i,a.firstChild),a.insertBefore(p,a.firstChild),e.dataset.urpppPctDone="1"})}function br(t){let e=document.getElementById("treeDemo");if(!e)return;let r=!!(t&&t.force);if(e.dataset.urpppBusy==="1"&&!(t&&t.ignoreBusy))return;let a=e.closest('div[style*="border"]')||e.closest("#tree_div")?.parentElement||e.parentElement;a&&a.classList.add("urppp-plan-tree-shell"),e.classList.add("urppp-ztree");let p=typeof unsafeWindow<"u"?unsafeWindow:window,i=()=>{try{return(p.jQuery||p.$||window.jQuery||window.$)?.fn?.zTree?.getZTreeObj?.("treeDemo")||null}catch{return null}},s=()=>{let R=Array.from(e.querySelectorAll('span.button.switch[class*="_open"]')).filter(B=>!/_docu\b/.test(B.className));return R.reverse().forEach(B=>{try{B.click()}catch{}}),R.length>0},u=()=>{let R=i();if(R)try{R.expandAll(!1)}catch{}return e.querySelector('span.button.switch[class*="_open"]:not([class*="_docu"])')&&s(),!0};if(!window.__urpppExpandKzPatched){window.__urpppExpandKzPatched=!0;let R=()=>{let B=typeof unsafeWindow<"u"?unsafeWindow:window;try{B.expandKzByRule=function(){e.dataset.urpppUserExpanded||u()}}catch{}};R(),setTimeout(R,0),setTimeout(R,200)}e.dataset.urpppCollapsedOnce||(e.dataset.urpppCollapsedOnce="1",[0,80,200,500,1e3].forEach(R=>setTimeout(()=>{e.dataset.urpppUserExpanded||u()},R)));let m=document.querySelector("#two h4.header, #two .header");if(m&&!m.dataset.urpppLegendDone){let R=m.querySelector("font");if(R){let B=document.createElement("div");B.className="urppp-plan-legend",B.innerHTML=['<span class="urppp-lg done"><i class="ace-icon fa fa-check-square-o"></i>已完成课组</span>','<span class="urppp-lg todo"><i class="ace-icon fa fa-folder-o"></i>尚未完成课组</span>','<span class="urppp-lg pass"><i class="ace-icon fa fa-smile-o"></i>已修读及格</span>','<span class="urppp-lg fail"><i class="ace-icon fa fa-frown-o"></i>已修读未及格</span>','<span class="urppp-lg pending"><i class="ace-icon fa fa-meh-o"></i>尚未修读</span>'].join(""),R.replaceWith(B)}m.classList.add("urppp-plan-header"),m.dataset.urpppLegendDone="1"}let w=()=>{if(e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}},q=()=>{e.dataset.urpppBusy="0";let R=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&R)try{window.__urpppPlanTreeObs.observe(R,{childList:!0,subtree:!0})}catch{}},$=R=>{let B=R;return B=B.replace(/\((最低修读学分:[^)]+)\)/g,(K,dt)=>{let vt=dt.split(",").map(qt=>qt.trim()).filter(Boolean),Et=[];return vt.forEach(qt=>{/最低修读学分|通过学分|必修课未修读|已及格课程门数/.test(qt)&&Et.push(qt)}),`<span class="urppp-sub">${(Et.length?Et:vt).map(qt=>{let jt=qt.match(/^([^:：]+)[:：]\s*(.+)$/);if(!jt)return qt;let Ot=jt[1].trim(),Mt=jt[2].trim(),Ht="neutral";return/通过|已及格/.test(Ot)?Ht="ok":/未修读|未及格/.test(Ot)?Ht=Number(Mt)>0?"warn":"muted":/最低/.test(Ot)&&(Ht="req"),`<span class="urppp-kv ${Ht}"><em>${Ot}</em><b>${Mt}</b></span>`}).join("")}</span>`}),B=B.replace(/\[(\d{6,})\]/g,'<span class="urppp-code">$1</span>'),B=B.replace(/\[(\d+(?:\.\d+)?学分(?:,[^\]\[]*)?)\]/g,'<span class="urppp-meta">$1</span>'),B=B.replace(/\((必修|任选|限选),((?:[^()]|\([^()]*\))*)\)/g,(K,dt,vt)=>{let Et=String(vt).trim(),Lt=Et.match(/^(.+?)(?:\((\d{6,8})\))?$/),qt=(Lt?Lt[1]:Et).trim(),jt=Lt&&Lt[2]?Lt[2]:"",Ot=parseFloat(qt),Mt=!1;Number.isNaN(Ot)?/不及格|未通过|不通过/.test(qt)?Mt=!1:(/^(?:[A-D][+]?|优秀|良好|中等|及格|通过)/.test(qt),Mt=!0):Mt=Ot>=60;let Ht=jt?`<i>${jt}</i>`:"";return`<span class="urppp-score ${Mt?"pass":"fail"}"><b>${dt}</b><em>${qt}</em>${Ht}</span>`}),B=B.replace(/(<span class="urppp-code">[^<]*<\/span>)\s*([^<]+?)(?=\s*(?:<span class="urppp-meta"|<span class="urppp-score"|$))/g,'$1<span class="urppp-title">$2</span>'),B=B.replace(/(<\/i>)(?:&nbsp;|\s)*([^<]+?)(?=<span class="urppp-sub")/g,'$1 <span class="urppp-gname">$2</span>'),B=B.replace(/(<\/i>)(?:&nbsp;|\s)+(?=<span class="urppp-gname")/g,"$1 "),B},M=R=>{let B=R.querySelector("i.fa, i.ace-icon"),K=R.closest("li");K&&(K.classList.remove("urppp-node-done","urppp-node-todo","urppp-node-pass","urppp-node-fail","urppp-node-pending"),B&&(B.classList.contains("fa-check-square-o")?K.classList.add("urppp-node-done"):B.classList.contains("fa-smile-o")?K.classList.add("urppp-node-pass"):B.classList.contains("fa-frown-o")?K.classList.add("urppp-node-fail"):B.classList.contains("fa-meh-o")?K.classList.add("urppp-node-pending"):B.classList.contains("fa-kz")&&K.classList.add("urppp-node-todo")))},j=R=>{if(!R||!r&&R.dataset.urpppNodeDone==="1")return!1;M(R);let B=R.querySelector("span.node_name")||R;if(!B)return!1;if(!r&&B.querySelector(".urppp-score, .urppp-code, .urppp-sub, .urppp-title, .urppp-gname"))R.dataset.urpppNodeDone="1";else{let dt=B.dataset.urpppRaw;dt||(B.querySelector(".urppp-score, .urppp-code, .urppp-sub")?(R.dataset.urpppNodeDone="1",dt=null):(dt=B.innerHTML,dt&&(B.dataset.urpppRaw=dt))),dt&&(B.innerHTML=$(dt),R.dataset.urpppNodeDone="1")}let K=R.parentElement&&R.parentElement.querySelector(":scope > span.button.switch");return K&&(K.dataset.urpppSw||(K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))),/_docu\b/.test(K.className)||K.classList.contains("urppp-switch-leaf")?R.classList.remove("urppp-expandable"):R.classList.add("urppp-expandable")),!0},Y=(R,B)=>{let K=Array.from(R||[]),dt=0,vt=()=>{let Et=Math.min(dt+48,K.length);for(;dt<Et;dt++)j(K[dt]);dt<K.length?window.requestIdleCallback?requestIdleCallback(vt,{timeout:120}):setTimeout(vt,0):B&&B()};vt()},O=R=>{let B=R||e;B.querySelectorAll("span.button.switch:not([data-urppp-sw])").forEach(K=>{K.dataset.urpppSw="1",/_docu\b/.test(K.className)&&(K.classList.add("urppp-switch-leaf"),K.style.setProperty("display","none","important"))}),B.querySelectorAll("li > a").forEach(K=>j(K))};w();try{O(e),e.dataset.urpppExpandClick||(e.dataset.urpppExpandClick="1",e.addEventListener("click",B=>{if(B.target.closest&&B.target.closest("span.button.switch")){let Lt=B.target.closest("span.button.switch"),qt=Lt&&Lt.parentElement;if(!qt||/_docu\b/.test(Lt.className))return;if(e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}setTimeout(()=>{O(qt),e.dataset.urpppBusy="0";let jt=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&jt)try{window.__urpppPlanTreeObs.observe(jt,{childList:!0,subtree:!0})}catch{}},0);return}let K=B.target&&B.target.closest?B.target.closest("li > a"):null;if(!K||!e.contains(K))return;let dt=K.parentElement;if(!dt)return;let vt=dt.querySelector(":scope > span.button.switch");if(!vt||/_docu\b/.test(vt.className)||vt.classList.contains("urppp-switch-leaf")||!K.classList.contains("urppp-expandable")&&!/_open|_close/.test(vt.className))return;if(B.preventDefault(),B.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",e.dataset.urpppBusy="1",window.__urpppPlanTreeObs)try{window.__urpppPlanTreeObs.disconnect()}catch{}vt.click(),O(dt),e.dataset.urpppBusy="0";let Et=document.getElementById("tree_div")||e;if(window.__urpppPlanTreeObs&&Et)try{window.__urpppPlanTreeObs.observe(Et,{childList:!0,subtree:!0})}catch{}},!0));let R=(B,K)=>{let dt=document.getElementById(B);return!dt||dt.dataset.urpppBound==="1"?!1:(dt.dataset.urpppBound="1",dt.addEventListener("click",vt=>{vt.preventDefault(),vt.stopImmediatePropagation(),e.dataset.urpppUserExpanded="1",w();try{let Et=i();if(K){Et?Et.expandAll(!0):e.querySelectorAll('span.button.switch[class*="_close"]').forEach(qt=>{/_docu\b/.test(qt.className)||qt.click()});let Lt=e.querySelectorAll('li > a:not([data-urppp-node-done="1"])');Y(Lt,q)}else{if(Et)try{Et.expandAll(!1)}catch{}s(),setTimeout(()=>{e.querySelector('span.button.switch[class*="_open"]:not([class*="docu"])')&&s(),q()},0)}}catch{K||s(),q()}},!0),!0)};R("expandAllBtn",!0),R("collapseAllBtn",!1),e.dataset.urpppAllBtnsRetry||(e.dataset.urpppAllBtnsRetry="1",setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},300),setTimeout(()=>{R("expandAllBtn",!0),R("collapseAllBtn",!1)},1e3))}finally{requestAnimationFrame(()=>{requestAnimationFrame(q)})}}function hr(){if(!fe())try{let t=document.getElementById("soliderbox");if(t){t.style.setProperty("width","100%","important"),t.style.setProperty("max-width","720px","important"),t.style.setProperty("min-width","0","important"),t.classList.remove("container");let p=t.closest(".profile-info-row");p&&(p.style.setProperty("display","flex","important"),p.style.setProperty("align-items","center","important"),p.style.setProperty("width","100%","important"),p.style.setProperty("max-width","100%","important"));let i=t.closest(".profile-info-value");i&&(i.style.setProperty("width","auto","important"),i.style.setProperty("max-width","100%","important"),i.style.setProperty("flex","1 1 auto","important"),i.style.setProperty("min-width","0","important"))}let e=document.getElementById("mycoursetable");if(!e)return;let r=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches);e.classList.toggle("urppp-mobile-schedule-scroll",r),e.style.setProperty("position","relative","important"),e.style.setProperty("width","100%","important");let a=72;r||e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(p=>{let i=p.offsetHeight||0;i>a&&(a=i)}),a<56&&(a=72),e.querySelectorAll("div.class_div").forEach(p=>{let i=parseInt(p.getAttribute("classNum")||"1",10)||1,s=p.scrollHeight||0;if(s>0){let u=Math.ceil(s/i);a=r?Math.max(a,Math.min(u,88)):Math.max(a,u)}}),r?a=Math.min(Math.max(a,72),88):(a<64&&(a=72),a>160&&(a=120)),e.querySelectorAll("#courseTableBody tr, table tbody tr").forEach(p=>{p.style.setProperty("height",a+"px","important")}),e.querySelectorAll("td").forEach(p=>{let i=Array.from(p.querySelectorAll(":scope > div.class_div"));if(!i.length)return;p.style.setProperty("position","relative","important"),p.style.setProperty("vertical-align","top","important"),p.style.setProperty("overflow","visible","important");let s=p.getBoundingClientRect().width||p.offsetWidth||p.clientWidth||0,u=getComputedStyle(p),m=p.closest("table"),w=m?getComputedStyle(m):null,q=parseFloat(u.borderLeftWidth)||0,$=w&&w.borderCollapse==="collapse"?q/2:q,M=Math.max(1,i.length);i.forEach((j,Y)=>{let O=parseInt(j.getAttribute("classNum")||"1",10)||1,R=Qp(s,M,Y,$),B=R.left,K=R.width;j.style.setProperty("position","absolute","important"),j.style.setProperty("top","0px","important"),j.style.setProperty("left",B+"px","important"),j.style.setProperty("right","auto","important"),j.style.setProperty("bottom","auto","important"),j.style.setProperty("transform","none","important"),j.style.setProperty("width",K+"px","important"),j.style.setProperty("max-width","none","important"),j.style.setProperty("height",a*O+"px","important"),j.style.setProperty("margin","0","important"),j.style.setProperty("box-sizing","border-box","important"),j.style.setProperty("z-index","2","important"),j.style.setProperty("overflow","hidden","important")})})}catch(t){console.warn("[URP++] week schedule fix failed",t)}}function Ra(){try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;if(!t||t.__urpppDivBuildPatched||typeof t.divBuild!="function")return;t.__urpppDivBuildPatched=!0;let e=t.divBuild;t.__urpppOriginalDivBuild=e,t.divBuild=function(){try{hr()}catch{try{return e.apply(this,arguments)}catch{}}};try{t.divBuild._urppp=!0}catch{}}catch(t){console.warn("[URP++] patch divBuild failed",t)}}let We=null,dn=!1;function un(){let t=document.getElementById("mycoursetable")||document.getElementById("page-content-template")||document.body;if(We&&We.root===t&&t?.isConnected){hr();return}We&&We.disconnect(),We=null;let e=!dn;dn=!0;let r=!1,a=()=>{if(!(r||fe())&&!(!document.getElementById("soliderbox")&&!document.getElementById("mycoursetable"))){r=!0;try{Ra(),hr()}finally{setTimeout(()=>{r=!1},40)}}};Ra(),[0,50,150,400,1e3,2e3].forEach(s=>setTimeout(()=>{Ra(),a()},s)),e&&window.addEventListener("resize",()=>{clearTimeout(window.__urpppWeekSchedResize),window.__urpppWeekSchedResize=setTimeout(a,120)});let p=s=>{if(!s||fe())return;let u=[];s.nodeType===1&&(s.matches&&s.matches("div.class_div")&&u.push(s),s.querySelectorAll&&s.querySelectorAll("div.class_div").forEach(m=>u.push(m))),u.forEach(m=>{let w=m.parentElement;w&&w.tagName==="TD"&&w.style.setProperty("position","relative","important"),m.style.setProperty("position","absolute","important"),m.style.setProperty("top","0px","important"),m.style.setProperty("left","0px","important"),m.style.setProperty("right","auto","important"),m.style.setProperty("transform","none","important"),m.style.setProperty("width","100%","important"),m.style.setProperty("margin","0","important"),m.style.setProperty("box-sizing","border-box","important")})},i=new MutationObserver(s=>{if(fe())return;let u=!1;s.forEach(m=>{if(m.type==="childList"&&m.addedNodes.forEach(w=>{p(w),u=!0}),m.type==="attributes"&&m.attributeName==="style"&&m.target&&m.target.classList&&m.target.classList.contains("class_div")){let w=m.target,q=w.style.left||"",$=parseFloat(q);(!q||q==="auto"||Number.isFinite($)&&$>200)&&(w.style.setProperty("left","0px","important"),w.style.setProperty("top","0px","important"),w.style.setProperty("position","absolute","important")),u=!0}}),u&&(clearTimeout(window.__urpppWeekSchedMut),window.__urpppWeekSchedMut=setTimeout(()=>{requestAnimationFrame(a)},16))});if(t){i.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]});let s=null,u=0,m=0;if(t.id==="mycoursetable"&&typeof window.ResizeObserver=="function"){let w=t.getBoundingClientRect().width||0;s=new window.ResizeObserver(q=>{let $=q[0]?.contentRect?.width||t.getBoundingClientRect().width||0;!$||Math.abs($-w)<.5||(w=$,u||(u=requestAnimationFrame(()=>{u=0,a()})),clearTimeout(m),m=setTimeout(a,80))}),s.observe(t)}We={root:t,observer:i,disconnect(){i.disconnect(),s&&s.disconnect(),u&&cancelAnimationFrame(u),clearTimeout(m)}}}e&&document.addEventListener("mouseup",()=>{document.getElementById("soliderbox")&&(setTimeout(a,200),setTimeout(a,500))},!0)}function mn(){try{let t=document.getElementById("curriculumInfo-divcon2");if(!t)return;let e=parseFloat(t.style.width||getComputedStyle(t).width||"0");if(!e||e<40)return;t.classList.add("urppp-curriculum-drawer");let r=t.querySelector(".modal-body");if(!r)return;let a=r.querySelector(":scope > .col-xs-12 > .row")||r.querySelector(".col-xs-12 > .row")||r.querySelector(".row");if(!a)return;a.classList.add("urppp-drawer-layout");let p=a.querySelector(":scope > .urppp-drawer-toolbar, :scope > p");p&&p.tagName==="P"&&p.classList.add("urppp-drawer-toolbar");let i=a.querySelector(":scope > .urppp-drawer-body"),s=a.querySelector(".urppp-drawer-left"),u=a.querySelector(".urppp-drawer-right");i||(i=document.createElement("div"),i.className="urppp-drawer-body"),s||(s=document.createElement("div"),s.className="urppp-drawer-left"),u||(u=document.createElement("div"),u.className="urppp-drawer-right"),i.contains(s)||i.appendChild(s),i.contains(u)||i.appendChild(u),i.parentElement!==a&&(p&&p.parentElement===a?a.insertBefore(i,p.nextSibling):a.appendChild(i)),p&&a.firstElementChild!==p&&a.insertBefore(p,a.firstElementChild);let m=a.querySelector("#treeDemo, .ztree")||t.querySelector("#treeDemo, .ztree"),w=null;if(m){w=m.closest(".col-xs-6, .col-sm-6, .widget-box")||m.parentElement;let Y=m.closest(".col-xs-6, .col-sm-6");Y&&(w=Y)}let q=["fajh","xnxq","kz","kc","kcfa"],$=q.map(Y=>document.getElementById(Y)).filter(Y=>Y&&t.contains(Y));w&&w.parentElement!==s&&s.appendChild(w),Array.from(s.children).forEach(Y=>{(q.includes(Y.id)||Y.id&&q.includes(Y.id)||Y!==w&&Y.querySelector&&!Y.querySelector("#treeDemo, .ztree")&&Y.classList&&Y.classList.contains("col-xs-6"))&&u.appendChild(Y)}),q.forEach(Y=>{let O=document.getElementById(Y);!O||!t.contains(O)||(O.parentElement!==u&&u.appendChild(O),O.style.setProperty("width","100%","important"),O.style.setProperty("max-width","100%","important"),O.style.setProperty("float","none","important"),O.style.setProperty("margin","0","important"),O.style.setProperty("padding","0","important"),O.style.setProperty("box-sizing","border-box","important"),O.style.display!=="none"&&getComputedStyle(O).display!=="none"&&O.style.setProperty("display","block","important"))});let M=document.getElementById("fajh");M&&t.contains(M)&&(M.parentElement!==u&&u.appendChild(M),(!M.innerHTML||!M.innerHTML.trim())&&!M.querySelector(".urppp-drawer-skeleton, .profile-user-info, .widget-box")&&(M.innerHTML=["<div class='widget-box transparent urppp-drawer-skeleton'>","  <div class='widget-header widget-header-small'>","    <h4 class='widget-title smaller grey'>方案计划信息</h4>","  </div>","</div>","<div class='self profile-user-info profile-user-info-striped urppp-drawer-skeleton-card'>","  <div class='profile-info-row'><div class='profile-info-name'>加载中</div><div class='profile-info-value'>正在获取方案信息…</div></div>","</div>"].join(""),M.style.setProperty("display","block","important"),M.dataset.urpppSkeleton="1"),M.dataset.urpppSkeleton==="1"&&M.querySelector(".profile-info-value")&&/方案名称|计划名称|年级|院系/.test(M.textContent||"")&&(delete M.dataset.urpppSkeleton,M.querySelectorAll(".urppp-drawer-skeleton, .urppp-drawer-skeleton-card").forEach(O=>O.remove())),M.innerHTML&&M.innerHTML.trim()&&M.style.display==="none"&&(M.dataset.urpppSkeleton==="1"||M.querySelector(".profile-user-info"))&&M.style.setProperty("display","block","important")),u.style.setProperty("min-height","240px","important"),s.style.setProperty("min-height","240px","important"),w&&(w.style.setProperty("width","100%","important"),w.style.setProperty("max-width","100%","important"),w.style.setProperty("float","none","important"),w.style.setProperty("margin","0","important"),w.style.setProperty("padding","0","important"),w.style.setProperty("border","none","important"),w.style.setProperty("box-sizing","border-box","important"));let j=s.querySelector(".widget-box");j&&(j.style.setProperty("width","100%","important"),j.style.setProperty("margin","0","important"),j.style.setProperty("border",He(),"important"),j.style.setProperty("border-radius","12px","important"),j.style.setProperty("overflow","hidden","important"),j.style.setProperty("background","var(--surface)","important")),t.querySelectorAll(".profile-info-row").forEach(Y=>{Y.classList.remove("urppp-query-row","urppp-dual-pair"),Y.style.setProperty("display","grid","important"),Y.style.setProperty("grid-template-columns","112px minmax(0,1fr)","important"),Y.style.setProperty("width","100%","important"),Array.from(Y.children).forEach(O=>{O.classList&&(O.style.setProperty("float","none","important"),O.style.setProperty("margin-left","0","important"),O.style.setProperty("width","auto","important"),O.style.setProperty("max-width","none","important"))})}),t.querySelectorAll(".profile-user-info, .profile-user-info-striped").forEach(Y=>{Y.classList.remove("urppp-query-form");try{Jr(Y)}catch{}Y.querySelectorAll(".profile-info-value, .profile-info-value span, span.editable").forEach(O=>{O.style.setProperty("color","var(--text)","important"),O.style.setProperty("opacity","1","important"),O.style.setProperty("visibility","visible","important")}),Y.style.setProperty("border-radius","12px","important"),Y.style.setProperty("overflow","hidden","important"),Y.style.setProperty("width","100%","important"),Y.style.setProperty("max-width","100%","important"),Y.style.setProperty("display","block","important"),Y.style.setProperty("box-sizing","border-box","important")})}catch(t){console.warn("[URP++] curriculum drawer beautify failed",t)}}function Ps(){if(window.__urpppCurriculumDrawerBound)return;window.__urpppCurriculumDrawerBound=!0;let t=()=>mn();[0,50,150,350,800,1600].forEach(a=>setTimeout(t,a));let e=new MutationObserver(a=>{a.some(i=>!!(i.type==="childList"||i.type==="attributes"&&i.target&&(i.target.id==="curriculumInfo-divcon2"||i.target.id==="fajh")))&&(clearTimeout(window.__urpppCurriculumDrawerTimer),window.__urpppCurriculumDrawerTimer=setTimeout(()=>requestAnimationFrame(t),16))}),r=document.getElementById("curriculumInfo-divcon2");r&&e.observe(r,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class"]}),document.addEventListener("click",a=>{if(!document.getElementById("curriculumInfo-divcon2"))return;let p=a.target&&a.target.closest?a.target.closest("a,button,span,div"):null,i=(p&&p.textContent||"").replace(/\s+/g,"");(/培养方案|与我相关|方案计划|自动化培养/.test(i)||p&&p.closest&&p.closest("#curriculumInfo-divcon2"))&&(setTimeout(t,0),setTimeout(t,50),setTimeout(t,150),setTimeout(t,400))},!0)}let{scheduleScrubTableInlineBg:bn,scrubTableHeaderInlineBg:zs}=xi({isNativePdfIsolationActive:fe}),{disarmNoticeTableHover:Ls,pinNoticeRowSurface:hn,scrubNoticeInlineBg:fn,stripMistakenNoticeTable:gn}=ki({getCurrentTheme:Yt});function Ha(){try{let t=document.querySelector("h4.header, h3.header, h4, h3, .breadcrumb, .page-header");return bi({pathname:location.pathname,href:location.href,title:document.title,headingText:t?.textContent||""})}catch{return!1}}function qs(t){return No(t,{noticePage:Ha()})}function Ua(t){return hi(t,{noticePage:Ha()})}let xn,{bindNoticeHoverScrub:Ts,scheduleBeautifyNoticeTables:yn}=wi({beautifyNoticeTables:t=>xn(t),pinNoticeRowSurface:hn});({beautifyNoticeTables:xn}=Ai({isNativePdfIsolationActive:fe,bindNoticeHoverScrub:Ts,scrubNoticeInlineBg:fn,stripMistakenNoticeTable:gn,disarmNoticeTableHover:Ls,pinNoticeRowSurface:hn,isBusinessDataTable:Ua,isNoticeListTable:qs,isNoticePageContext:Ha,isNoticeBulletText:$o}));let{wrapTables:vn,bindTableWrapObserver:wn}=fi({isNativePdfIsolationActive:fe,isBusinessDataTable:Ua});function fr(){try{document.querySelectorAll(".modal").forEach(e=>{if(!e||!e.style)return;e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.classList.contains("in")||e.classList.contains("show")?e.style.display==="none"&&e.style.removeProperty("display"):(e.style.display==="block"||getComputedStyle(e).display!=="none")&&(e.style.setProperty("display","none","important"),setTimeout(()=>{try{!e.classList.contains("in")&&!e.classList.contains("show")&&(e.style.getPropertyPriority("display")==="important"&&e.style.removeProperty("display"),e.style.display="none")}catch{}},0))}),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(e=>{try{e.parentElement&&e.parentElement.removeChild(e)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right")))}catch{}}function Ms(){if(window.__urpppModalOpenPatched)return;window.__urpppModalOpenPatched=!0;let t=i=>{!i||!i.style||(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.getPropertyPriority("opacity")==="important"&&i.style.removeProperty("opacity"),i.style.getPropertyPriority("pointer-events")==="important"&&i.style.removeProperty("pointer-events"),i.style.getPropertyPriority("visibility")==="important"&&i.style.removeProperty("visibility"))},e=i=>{if(!(!i||!i.classList))try{i.classList.remove("in","show"),i.setAttribute("aria-hidden","true"),i.style.removeProperty("display"),i.style.setProperty("display","none","important"),setTimeout(()=>{try{!i.classList.contains("in")&&!i.classList.contains("show")&&(i.style.getPropertyPriority("display")==="important"&&i.style.removeProperty("display"),i.style.display="none")}catch{}},30)}catch{}},r=()=>{document.querySelectorAll(".modal-backdrop").forEach(i=>{try{i.parentElement&&i.parentElement.removeChild(i)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"),document.body.style.removeProperty("overflow"))},a=i=>{if(i){if(i.classList&&i.classList.contains("modal-backdrop")&&(i=document.querySelector(".modal.in, .modal.show")||i),!i||!i.classList||!i.classList.contains("modal")){r();return}t(i),e(i),r();try{let s=typeof Gr=="function"&&Gr()||typeof unsafeWindow<"u"&&(unsafeWindow.jQuery||unsafeWindow.$)||window.jQuery||window.$;if(s&&s.fn&&typeof s.fn.modal=="function"){try{s(i).trigger("hide.bs.modal")}catch{}try{s(i).modal("hide")}catch{}try{s(i).trigger("hidden.bs.modal")}catch{}}}catch{}setTimeout(()=>{e(i),document.querySelector(".modal.in, .modal.show")||r();try{fr()}catch{}},0)}};document.addEventListener("show.bs.modal",i=>{let s=i.target;if(!(!s||!s.classList||!s.classList.contains("modal"))){t(s),s.style.display==="none"&&s.style.removeProperty("display");try{s.getAttribute("data-backdrop")==="static"&&s.setAttribute("data-backdrop","true"),s.dataset&&(s.dataset.backdrop="true")}catch{}}},!0),document.addEventListener("hide.bs.modal",i=>{let s=i.target;!s||!s.classList||!s.classList.contains("modal")||t(s)},!0),document.addEventListener("hidden.bs.modal",i=>{let s=i.target;!s||!s.classList||!s.classList.contains("modal")||(e(s),document.querySelector(".modal.in, .modal.show")||(document.querySelectorAll(".modal-backdrop").forEach(u=>{try{u.parentElement&&u.parentElement.removeChild(u)}catch{}}),document.body&&(document.body.classList.remove("modal-open"),document.body.style.removeProperty("padding-right"))))},!0);let p=i=>{let s=i.target;if(!s||!s.closest||s.closest(".modal-dialog, .modal-content, .modal-header, .modal-body, .modal-footer")&&!s.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return;if(s.classList&&s.classList.contains("modal-backdrop")){let q=document.querySelector(".modal.in, .modal.show")||document.querySelector('.modal[style*="display: block"], .modal[style*="display:block"]');q?(i.preventDefault(),i.stopPropagation(),a(q)):(i.preventDefault(),r(),fr());return}let u=null;if(s.classList&&s.classList.contains("modal")?u=s:u=s.closest(".modal.in, .modal.show, .modal"),!u||!u.classList.contains("modal")||!(u.classList.contains("in")||u.classList.contains("show")||getComputedStyle(u).display!=="none"))return;let w=u.querySelector(".modal-dialog");if(w){let q=w.getBoundingClientRect(),$=i.clientX,M=i.clientY;if($>=q.left&&$<=q.right&&M>=q.top&&M<=q.bottom&&!s.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'))return}else if(s.closest(".modal-content"))return;i.preventDefault(),i.stopPropagation(),a(u)};document.addEventListener("pointerdown",p,!0),document.addEventListener("mousedown",p,!0),document.addEventListener("click",p,!0),document.addEventListener("click",i=>{let s=i.target&&i.target.closest?i.target.closest('[data-dismiss="modal"], .modal .close, .modal [aria-label="Close"]'):null;if(!s)return;let u=s.closest(".modal");u&&(i.preventDefault(),i.stopPropagation(),a(u)),setTimeout(()=>{try{fr()}catch{}},50),setTimeout(()=>{try{fr()}catch{}},220)},!0),document.addEventListener("click",i=>{let s=i.target&&i.target.closest?i.target.closest("a,button,td,span,div,i"):null;if(!s)return;["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon","billContainer"].forEach(m=>{let w=document.getElementById(m);w&&(t(w),w.style.opacity==="0"&&w.style.removeProperty("opacity"),w.style.pointerEvents==="none"&&w.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(m=>t(m));let u=s.getAttribute&&(s.getAttribute("data-target")||s.getAttribute("href")||"");if(u&&u.charAt(0)==="#"){let m=document.querySelector(u);m&&t(m)}},!0)}let Ge=null,Wa=0;function Ga(){if(fe())return;let t=document.getElementById("courseTable");t&&t.querySelectorAll("td").forEach(e=>{let r=e.style.backgroundColor;if(!r||!r.includes("rgba"))return;let a=r.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);a&&(e.style.backgroundColor=`rgba(${a[1]},${a[2]},${a[3]},0.5)`)})}function kn(){let t=document.getElementById("mycoursetable")||document.getElementById("courseTable");if(Ge&&Ge.root===t&&t?.isConnected){Ga();return}if(clearTimeout(Wa),Ge&&Ge.observer.disconnect(),Ge=null,!t)return;let e=new MutationObserver(()=>{clearTimeout(Wa),Wa=setTimeout(Ga,60)});e.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style"]}),Ge={root:t,observer:e},Ga()}function Is(){try{let q=Yt();document.documentElement.dataset.urpppTheme=q,document.documentElement.classList.remove("urppp-theme-default","urppp-theme-dark","urppp-theme-scu-red"),document.documentElement.classList.add("urppp-theme-"+q),document.body&&(document.body.dataset.urpppTheme=q,document.body.classList.toggle("urppp-dark",q==="dark"))}catch{}let t=document.getElementById("urppp-internal-style");t||(t=document.createElement("style"),t.id="urppp-internal-style",document.head.appendChild(t));{let q=t;q.textContent=Li}let e=document.getElementById("urppp-table-beautify-style");e||(e=document.createElement("style"),e.id="urppp-table-beautify-style",document.head.appendChild(e)),e.textContent=Ii;let r=document.getElementById("urppp-navigation-style");r||(r=document.createElement("style"),r.id="urppp-navigation-style",document.head.appendChild(r)),r.textContent=$i,Rr()&&co(),document.getElementById("urppp-schedule-card-style")||kr(location)&&uo();try{window.__urpppIsMobileUA&&Qn()}catch{}try{ae()}catch{}fr(),Ms(),["curriculumInfo-divcon","curriculumInfo-divcon1","curriculumInfo-divcon2","calssInfo-divcon","classroomInfo-divcon"].forEach(q=>{let $=document.getElementById(q);!$||!$.style||(["display","opacity","pointer-events","visibility"].forEach(M=>{$.style.getPropertyPriority(M)==="important"&&$.style.removeProperty(M)}),$.style.opacity==="0"&&$.style.removeProperty("opacity"),$.style.pointerEvents==="none"&&$.style.removeProperty("pointer-events"))}),document.querySelectorAll(".modal").forEach(q=>{q.style&&q.style.getPropertyPriority("display")==="important"&&q.style.removeProperty("display")}),vn(),yn(),bn(),setTimeout(()=>document.querySelectorAll("table").forEach(q=>{Ua(q)&&gn(q)}),500),un(),hr(),Ps(),mn(),wn();let p=document.querySelector(".page-content");p&&p.querySelectorAll(".widget-box").length>=4&&setTimeout(ml,500),Jn(),Te(),s();function s(){let q="(max-width: 640px)",$=()=>!!(window.matchMedia&&window.matchMedia(q).matches),M=(U,nt)=>{if(!(!U||!document.body)){if(nt){Object.hasOwn(U.dataset,"urpppDesktopSidebarMin")||(U.dataset.urpppDesktopSidebarMin=U.classList.contains("menu-min")?"1":"0",U.dataset.urpppDesktopBodyMin=document.body.classList.contains("menu-min")?"1":"0"),U.classList.remove("menu-min"),document.body.classList.remove("menu-min");return}Object.hasOwn(U.dataset,"urpppDesktopSidebarMin")&&(U.classList.toggle("menu-min",U.dataset.urpppDesktopSidebarMin==="1"),document.body.classList.toggle("menu-min",U.dataset.urpppDesktopBodyMin==="1"),delete U.dataset.urpppDesktopSidebarMin,delete U.dataset.urpppDesktopBodyMin)}},j=new WeakMap,Y=U=>{let nt=j.get(U);nt&&cancelAnimationFrame(nt),j.delete(U)},O=(U,nt)=>{Y(U);let st=U.getBoundingClientRect(),xt=Math.max(st.width,U.offsetWidth||0,260),ft=Math.max(-xt,Math.min(0,st.left)),St=nt?0:-xt,Tt=Math.abs(St-ft),Rt=Math.max(140,Math.round(260*Tt/xt)),he=performance.now(),Ut=U.classList.contains("urppp-clean-sidebar"),ne=Ut?"12030":"1200",Nt=Ut?"12030":"1030";U.style.setProperty("display","block","important"),U.style.setProperty("transition","none","important"),U.style.setProperty("visibility","visible","important"),U.style.setProperty("pointer-events",nt?"auto":"none","important"),U.style.setProperty("z-index",ne,"important"),U.style.setProperty("transform",`translate3d(${ft}px, 0, 0)`,"important"),U.classList.toggle("urppp-drawer-closing",!nt),U.classList.add("display");let At=()=>{U.style.setProperty("transform",`translate3d(${St}px, 0, 0)`,"important"),nt?(U.classList.remove("urppp-drawer-closing"),U.style.setProperty("pointer-events","auto","important")):(U.classList.remove("display","urppp-drawer-closing"),U.style.setProperty("visibility","hidden","important"),U.style.setProperty("z-index",Nt,"important")),j.delete(U)};if(Tt<1){At();return}let Ae=It=>{if(!U.isConnected){j.delete(U);return}let Wt=Math.min(1,(It-he)/Rt),Mp=Wt<.5?4*Wt*Wt*Wt:1-Math.pow(-2*Wt+2,3)/2,ca=ft+(St-ft)*Mp;if(U.style.setProperty("transform",`translate3d(${ca}px, 0, 0)`,"important"),Wt>=1){At();return}j.set(U,requestAnimationFrame(Ae))};j.set(U,requestAnimationFrame(Ae))},R=(U,nt,st)=>{if(U){O(U,st),nt&&(nt.setAttribute("aria-expanded",st?"true":"false"),nt.setAttribute("aria-label",st?"关闭菜单":"打开菜单"));try{Ye()}catch{}}},B=()=>{R(document.getElementById("sidebar"),document.getElementById("urppp-mobile-menu-button"),!1)},K=()=>{let nt=document.getElementById("urppp-mobile-search-panel")?.querySelector("#form-search");if(!nt)return;Object.entries({position:"relative",right:"auto",top:"auto",left:"auto",transform:"none",width:"100%","min-width":"0","max-width":"none",height:"36px",opacity:"1",margin:"0",overflow:"visible","z-index":"1"}).forEach(([xt,ft])=>nt.style.setProperty(xt,ft,"important")),[nt.querySelector("form"),nt.querySelector(".input-icon")].forEach(xt=>{xt&&Object.entries({display:"block",position:"relative",width:"100%","min-width":"0","max-width":"none",height:"36px",margin:"0",padding:"0","box-sizing":"border-box"}).forEach(([ft,St])=>xt.style.setProperty(ft,St,"important"))});let st=nt.querySelector("#search-input");st&&(st.style.setProperty("display","block","important"),st.style.setProperty("width","100%","important"),st.style.setProperty("min-width","0","important"),st.style.setProperty("max-width","none","important"),st.style.setProperty("height","36px","important"),st.style.setProperty("box-sizing","border-box","important"))},dt=()=>{let U=document.getElementById("form-search");if(!U||!U.__urpppMobileParent)return;let nt=U.__urpppMobileParent,st=U.__urpppMobileNext;nt.isConnected&&(st&&st.parentElement===nt?nt.insertBefore(U,st):nt.appendChild(U)),U.classList.remove("urppp-mobile-form-search"),U.dataset.open="0",U.removeAttribute("style"),delete U.__urpppMobileParent,delete U.__urpppMobileNext;try{ct()}catch{}},vt=()=>{let U=document.querySelector("#navbar .menu-toggler");!U||U.dataset.urpppMobileHidden!=="1"||(U.style.removeProperty("display"),U.removeAttribute("aria-hidden"),U.dataset.urpppPreviousTabindex?U.setAttribute("tabindex",U.dataset.urpppPreviousTabindex):U.removeAttribute("tabindex"),delete U.dataset.urpppPreviousTabindex,delete U.dataset.urpppMobileHidden)},Et=()=>{let U=document.getElementById("urppp-mobile-menu-button");if(!$())return U?.remove(),vt(),null;if(U)return U;let nt=document.getElementById("navbar"),st=document.getElementById("sidebar");if(!nt||!st)return null;let xt=nt.querySelector(".menu-toggler");xt&&(xt.dataset.urpppMobileHidden="1",xt.dataset.urpppPreviousTabindex=xt.getAttribute("tabindex")||"",xt.style.setProperty("display","none","important"),xt.setAttribute("aria-hidden","true"),xt.setAttribute("tabindex","-1"));let ft=document.createElement("button");ft.type="button",ft.id="urppp-mobile-menu-button",ft.className="urppp-mobile-menu-button",ft.setAttribute("aria-label","打开菜单"),ft.setAttribute("aria-expanded","false");let St=nt.querySelector(".navbar-container")||nt;return St.insertBefore(ft,St.firstChild),ft},Lt=U=>{!U||U.dataset.urpppIconReady||(U.dataset.urpppIconReady="1",U.innerHTML=['<span class="urppp-menu-icon" aria-hidden="true">','<svg class="urppp-menu-icon-open" viewBox="0 0 24 24" focusable="false">','<path d="M5 8h14"></path><path d="M5 16h10"></path>',"</svg>",'<svg class="urppp-menu-icon-close" viewBox="0 0 24 24" focusable="false">','<path d="M7 7l10 10"></path><path d="M17 7 7 17"></path>',"</svg>","</span>"].join(""))},qt=()=>{let U=Et(),nt=document.getElementById("sidebar");U&&Lt(U),U&&nt&&!U.__urpppToggleHandler&&(U.setAttribute("aria-label","打开菜单"),U.setAttribute("aria-expanded",nt.classList.contains("display")?"true":"false"),U.__urpppToggleHandler=st=>{st.preventDefault(),st.stopImmediatePropagation(),$()&&M(nt,!0);let xt=U.getAttribute("aria-expanded")!=="true";R(nt,U,xt)},U.addEventListener("click",U.__urpppToggleHandler,!0)),document.__urpppMobileDrawerOutsideBound||(document.__urpppMobileDrawerOutsideBound=!0,document.addEventListener("click",st=>{if(!$()||!st.target.closest)return;let xt=document.getElementById("sidebar");if(!xt||!xt.classList.contains("display"))return;let ft=document.getElementById("urppp-clean-root");ft&&ft.classList.contains("open")||st.target.closest("#sidebar, #urppp-mobile-menu-button")||B()},!0)),document.__urpppMobileRouteCloseBound||(document.__urpppMobileRouteCloseBound=!0,document.addEventListener("click",st=>{if(!$()||!st.target.closest)return;let xt=document.getElementById("urppp-clean-root");if(xt&&xt.classList.contains("open"))return;let ft=st.target.closest("#sidebar a[href]");if(!ft)return;let St=String(ft.getAttribute("href")||"").trim();!St||St==="#"||St.startsWith("javascript")||B()}))},jt=(U,nt)=>{let st=U?U.cloneNode(!0):document.createElement("a");return st.className="urppp-mobile-user-action",st.removeAttribute("style"),st.removeAttribute("id"),!U&&nt&&(st.href=nt.href,nt.onclick&&st.setAttribute("onclick",nt.onclick),st.innerHTML='<i class="ace-icon fa '+nt.icon+'" aria-hidden="true"></i><span>'+nt.label+"</span>"),st},Ot=(U,nt)=>{if(document.getElementById("urppp-mobile-user"))return;let st=U.querySelector(":scope > li.light-blue")||Array.from(U.children).find(Wt=>Wt.querySelector&&Wt.querySelector(".nav-user-photo, .user-menu, .dropdown-menu")),xt=document.createElement("section");xt.id="urppp-mobile-user",xt.className="urppp-mobile-user";let ft=document.createElement("div");ft.className="urppp-mobile-user-identity";let St=st?.querySelector(".nav-user-photo")||document.querySelector("#navbar .nav-user-photo"),Tt=St?St.cloneNode(!0):document.createElement("img");Tt.className="nav-user-photo",Tt.removeAttribute("style"),Tt.getAttribute("src")||Tt.setAttribute("src","/main/queryStudent/img"),Tt.setAttribute("data-urppp-private","avatar"),Tt.alt=St?.alt?.replace(/\s+/g," ").trim()||"用户头像";let Rt=st?.querySelector(".user-info")||document.querySelector("#navbar .user-info"),he=document.createElement("span");he.className="urppp-mobile-user-copy";let Ut=document.createElement("small");Ut.className="urppp-mobile-user-welcome",Ut.textContent="欢迎您，";let ne=document.createElement("span");ne.className="user-info urppp-user-name-value",ne.setAttribute("data-urppp-private","name"),ne.textContent=Rt?.textContent?.replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim()||St?.alt?.replace(/\s+/g," ").trim()||"我的账户",he.append(Ut,ne),ft.append(Tt,he),xt.appendChild(ft);let Nt=document.createElement("div");Nt.className="urppp-mobile-user-actions";let At=st?Array.from(st.querySelectorAll(".user-menu a, .dropdown-menu a")):[],Ae=[{label:"首页",href:"/",icon:"fa-home"},{label:"在线反馈",href:"/main/systemQuestion/index",icon:"fa-question-circle"},{label:"修改密码",href:"javascript:changePassword('/student/rollManagement/personalInfoUpdate/updatePassword')",icon:"fa-user"},{label:"注销",href:"/logout",icon:"fa-power-off"}];At.length?At.forEach(Wt=>Nt.appendChild(jt(Wt))):Ae.forEach(Wt=>Nt.appendChild(jt(null,Wt))),xt.appendChild(Nt);let It=nt.querySelector(".urppp-sidebar-header");It&&It.nextSibling?nt.insertBefore(xt,It.nextSibling):It?nt.appendChild(xt):nt.insertBefore(xt,nt.firstChild);try{Kt(xt)}catch{}},Mt=(U,nt,st,xt={})=>{if(!st||document.getElementById("urppp-mobile-quick"))return;let ft=document.createElement("section");ft.id="urppp-mobile-quick",ft.className="urppp-mobile-quick",ft.innerHTML='<div class="urppp-mobile-quick-title">快捷功能</div>';let St=document.createElement("div");St.className="urppp-mobile-tool-row";let Tt=U.querySelector(':scope > li > a[href*="customerServiceCenter"]'),Rt=Tt?Tt.cloneNode(!0):document.createElement("a");Rt.className="urppp-mobile-tool-button urppp-mobile-help-button",Rt.removeAttribute("style"),Rt.removeAttribute("onclick"),Rt.removeAttribute("data-toggle"),Rt.removeAttribute("target"),Rt.querySelectorAll("[style]").forEach(At=>At.removeAttribute("style"));let he=String(Rt.getAttribute("href")||"").trim();(!he||he==="#"||he.startsWith("javascript"))&&(Rt.href="/main/customerServiceCenter"),Rt.querySelector("i")||(Rt.innerHTML='<i class="ace-icon glyphicon glyphicon-headphones" aria-hidden="true"></i>'),Rt.querySelectorAll("span").forEach(At=>At.remove()),Rt.insertAdjacentHTML("beforeend","<span>帮助</span>"),St.appendChild(Rt);let Ut=document.createElement("button");Ut.type="button",Ut.id="urppp-mobile-search-button",Ut.className="urppp-mobile-tool-button",Ut.setAttribute("aria-expanded","false"),Ut.innerHTML='<i class="ace-icon fa fa-search" aria-hidden="true"></i><span>搜索</span>',St.appendChild(Ut),ft.appendChild(St);let ne=document.createElement("div");ne.className="urppp-mobile-quick-links",Array.from(U.querySelectorAll(":scope > li > a")).forEach(At=>{let Ae=At.closest("li");if(Ae?.classList.contains("light-blue")||Ae?.querySelector("#intellegenceUDiv, #form-search")||At===Tt||At.classList.contains("dropdown-toggle")||!At.getAttribute("href")&&!At.getAttribute("onclick"))return;let It=At.cloneNode(!0);It.className="urppp-mobile-quick-link",It.removeAttribute("style");let Wt=String(At.getAttribute("onclick")||"");if(/openWorkRestSchedule|open\w*Schedule/i.test(Wt)||It.removeAttribute("onclick"),xt.cleanMode){let ca=String(At.getAttribute("href")||"");(ca==="/holiday"||/holiday/i.test(ca)||/假期/.test(At.textContent||""))&&(It.removeAttribute("href"),It.removeAttribute("target"),It.style.cursor="default",It.style.pointerEvents="none")}ne.appendChild(It)});let Nt=document.createElement("div");Nt.id="urppp-mobile-search-panel",Nt.className="urppp-mobile-search-panel",Nt.hidden=!0;{let At=document.getElementById("form-search");At&&(At.__urpppMobileParent||(At.__urpppMobileParent=At.parentElement,At.__urpppMobileNext=At.nextSibling),At.classList.add("urppp-mobile-form-search"),At.dataset.open="0",Nt.appendChild(At),K())}ft.appendChild(Nt),ne.children.length&&ft.appendChild(ne),Ut.addEventListener("click",At=>{if(At.preventDefault(),At.stopPropagation(),Nt.hidden){K();let It=Nt.querySelector("#form-search");It&&(It.dataset.open="0",It.style.setProperty("pointer-events","auto","important"),It.style.setProperty("opacity","1","important"),It.style.setProperty("width","100%","important"),It.style.setProperty("min-width","0","important")),Nt.hidden=!1,Nt.classList.add("open"),setTimeout(()=>Nt.querySelector("#search-input")?.focus(),30),Ut.setAttribute("aria-expanded","true")}else Nt.hidden=!0,Nt.classList.remove("open"),Ut.setAttribute("aria-expanded","false")}),nt.insertBefore(ft,st)},Ht=()=>{let U=$(),nt=document.querySelector("#navbar .navbar-buttons .ace-nav"),st=document.getElementById("sidebar"),xt=document.getElementById("urppp-menus");if(st&&M(st,U),qt(),!U){let ft=document.documentElement.classList.contains("urppp-clean-open");ft||dt(),ft||(document.getElementById("urppp-mobile-quick")?.remove(),document.getElementById("urppp-mobile-user")?.remove());let St=document.getElementById("urppp-nav-clean"),Tt=document.getElementById("urppp-nav-theme");St&&Tt&&St.parentElement!==Tt&&Tt.appendChild(St),Tt&&Tt.style.setProperty("display","inline-flex","important");return}if(!(!nt||!st)){try{let ft=document.getElementById("urppp-nav-clean"),St=document.querySelector("#navbar .navbar-header"),Tt=document.getElementById("urppp-nav-theme");ft&&St&&ft.parentElement!==St&&St.appendChild(ft),Tt&&Tt.style.setProperty("display","inline-flex","important"),document.getElementById("urppp-nav-cal")?.remove()}catch{}Ot(nt,st),Mt(nt,st,xt),K()}};window.__urpppRefreshMobileNavbar=Ht,window.__urpppCloseMobileDrawer=B,window.__urpppSetDrawerOpen=(U,nt,st)=>{R(U,nt,st)},window.__urpppStopDrawerAnimation=U=>{U&&Y(U)},window.__urpppInjectCleanSidebarSections=U=>{let nt=document.querySelector("#navbar .navbar-buttons .ace-nav")||document.querySelector("#navbar .ace-nav"),st=document.getElementById("urppp-menus");if(!nt||!U)return;try{Ot(nt,U)}catch{}let xt=document.getElementById("urppp-mobile-quick");if(xt){let ft=xt.querySelector("#urppp-mobile-search-panel");if(ft&&ft.querySelector("#form-search"))try{dt()}catch{}xt.remove()}try{Mt(nt,U,st,{cleanMode:!0})}catch{}};try{Ht()}catch{}if(setTimeout(Ht,300),setTimeout(Ht,900),setTimeout(Ht,1800),window.matchMedia){let U=window.matchMedia(q),nt=()=>Ht();typeof U.addEventListener=="function"?U.addEventListener("change",nt):typeof U.addListener=="function"&&U.addListener(nt)}try{window.__urpppMobileNavbarObserver&&window.__urpppMobileNavbarObserver.disconnect();let U=0,nt=new MutationObserver(()=>{clearTimeout(U),U=setTimeout(()=>{try{Ht()}catch{}},40)}),st=document.getElementById("navbar"),xt=document.getElementById("sidebar");st&&nt.observe(st,{childList:!0,subtree:!0}),xt&&nt.observe(xt,{childList:!0}),window.__urpppMobileNavbarObserver=nt}catch{}}let m=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches)?"8px 8px 24px":"16px 64px 40px";if(document.querySelectorAll(".page-content, #page-content-template").forEach(q=>{q.style.setProperty("padding",m,"important"),q.style.setProperty("box-sizing","border-box","important")}),Wr(),Na(),Vr(),Ue(),Da(),setTimeout(()=>{Ue(),Da()},300),setTimeout(()=>{Ue(),Da()},1e3),sn(),pn(),nn(),ve(),Fa(),mr(),ln(),setTimeout(()=>{ve(),mr()},200),setTimeout(()=>{ve(),mr()},800),setTimeout(Na,350),setTimeout(Na,1e3),br(),setTimeout(()=>br(),400),!window.__urpppPlanTreeObs){let q=0;window.__urpppPlanTreeObs=new MutationObserver(()=>{let M=document.getElementById("treeDemo");!M||M.dataset.urpppBusy==="1"||M.querySelector('li > a:not([data-urppp-node-done="1"])')&&(clearTimeout(q),q=setTimeout(()=>br(),220))});let $=document.getElementById("tree_div")||document.getElementById("treeDemo");$&&window.__urpppPlanTreeObs.observe($,{childList:!0,subtree:!0})}window.__urpppWrsBound||(window.__urpppWrsBound=!0,document.addEventListener("shown.bs.modal",q=>{q.target&&(q.target.id==="work_rest_schedule_modal"||q.target.querySelector?.("#work_rest_schedule_modal"))&&setTimeout(ja,30)},!0),document.addEventListener("click",q=>{let $=q.target&&q.target.closest?q.target.closest("a,button"):null;if(!$)return;let M=$.getAttribute("onclick")||"",j=($.textContent||"").trim();(M.includes("openWorkRestSchedule")||j.includes("作息时间表"))&&(setTimeout(ja,80),setTimeout(ja,300))},!0)),Ur(),it(),ct(),Oa();let w=()=>{Wr(),Vr(),Ur()};setTimeout(w,200),setTimeout(w,800),window.__urpppLoadBound||(window.__urpppLoadBound=!0,window.addEventListener("load",()=>{it(),ct(),rt(),Oa(),Ur(),Wr(),Vr()})),setTimeout(()=>{document.body.classList.add("urppp-ready"),wt()},600),console.log("[URP++] style applied apple-leaning");try{bindScheduleHoverNearCursor()}catch{}kn()}function $s(t){if(!t)return;let e=t.querySelector("#urppp-set-brutal-palettes");if(!e)return;let r=Ko();e.innerHTML="",V.filter(a=>a.id!==G).forEach(a=>{let p=document.createElement("button");p.type="button",p.className="urppp-set-scheme"+(a.id===r.id?" ac":""),p.dataset.palette=a.id,p.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:#000"></span>','  <span style="background:'+a.accent+'"></span>','  <span style="background:'+a.secondary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+a.name+"</strong>","  <em>"+a.desc+"</em>","</div>"].join(""),p.addEventListener("click",()=>Xo(a.id,{select:!0})),e.appendChild(p)})}let Yr=di({getPrivacySettings:Ce,setPrivacySettings:qa,getCustomIdentity:je,setCustomIdentity:Wo,applyDisplay:()=>Kt(document),refreshCleanDisplay:bo,finishActiveDirectEdit:t=>{ke?.__finish&&ke.__finish(t)}}),Ns=Yr.sync,Ed=Yr.collect,Cd=Yr.setStatus,Bs=Yr.bind,Ja=li({document,getSettings:Or,setSettings:Jo,validateMapping:Be,defaultMapping:Mr,getRecoveryMessage:()=>et}),Pd=Ja.setStatus,Fs=Ja.sync,Ds=Ja.bind;function Dt(){let t=document.getElementById("urppp-settings-panel");if(!t)return;let e=Zt()||mt,r=De(),a=Yt(),p=Xt(),i=ee(),s=Oe(i),u=Re(i),m=Qo(i),w={};t.querySelectorAll(".urppp-set-mode").forEach(M=>{w[M.dataset.theme]=dr(M.dataset.theme,i)}),mi(t,{seed:e,currentTheme:a,followSystem:p,skinId:i,darkSupported:s,dynamicSupported:u,fixedPalettes:m,followUseDynamic:Hr(),cleanDefault:Pa(),cleanAnalysis:za()?"direct":"tab",appleEdge:Ee(),autoUpdate:La(),modeAvailability:w}),m&&$s(t);try{Ns(t)}catch{}try{Fs(t)}catch{}try{window.__urpppCleanMode&&typeof window.__urpppCleanMode.refreshRender=="function"&&window.__urpppCleanMode.refreshRender()}catch{}let q=t.querySelector("#urppp-set-presets");q&&(q.innerHTML="",Ca().forEach(M=>{let j=document.createElement("button");j.type="button",j.className="urppp-set-swatch"+(M.toLowerCase()===e.toLowerCase()?" ac":""),j.title=M,j.style.background=M,j.addEventListener("click",()=>{GM_setValue(z,M),Xt()?Gt(xe(),{system:!0}):Gt("scu-red",{manual:!0}),Dt()}),q.appendChild(j)}));let $=t.querySelector("#urppp-set-schemes");$&&($.innerHTML="",Fe(e).forEach(M=>{let j=document.createElement("button");j.type="button",j.className="urppp-set-scheme"+(M.id===r?" ac":""),j.dataset.scheme=M.id,j.innerHTML=['<div class="urppp-set-scheme-preview">','  <span style="background:'+M.bg+'"></span>','  <span style="background:'+M.surface+";border-color:"+M.border+'"></span>','  <span style="background:'+M.primary+'"></span>',"</div>",'<div class="urppp-set-scheme-meta">',"  <strong>"+M.name+"</strong>","  <em>"+M.desc+"</em>","</div>"].join(""),j.addEventListener("click",()=>{Ea(M.id),GM_setValue(z,e),Xt()?Gt(xe(),{system:!0}):Gt("scu-red",{manual:!0}),Dt()}),$.appendChild(j)}));try{nl(t)}catch(M){try{console.warn("[URP++] renderSkinCards",M)}catch{}}try{let M=t.querySelector(".urppp-about-ver, #urppp-about-ver");M&&(M.textContent="SCU URP++ v"+o,M.tagName==="A"&&(M.setAttribute("href",n.repo),M.setAttribute("target","_blank"),M.setAttribute("rel","noopener noreferrer")))}catch{}try{Cn(t)}catch{}}let An=ii({document,ensurePanel:Pn,syncPanel:Dt,refreshUpdateStatus:Gn}),js=ui({document,theme:{isModeAvailable:dr,apply:Gt,supportsDark:Oe,supportsDynamic:Re,getFollowSystem:Xt,setFollowSystem:Fr,resolveFollowTheme:xe,getCurrent:Yt,getFollowDynamic:Hr,setFollowDynamic:Ma,syncNavbar:gt},preferences:{getCleanDefault:Pa,setCleanDefault:hs,getCleanAnalysis:()=>za()?"direct":"tab",setCleanAnalysis:fs,getAppleEdge:Ee,setAppleEdge:gs,applySkin:ae,getAutoUpdate:La,setAutoUpdate:xs,checkUpdates:po},accent:{normalize:Vt,setAccent:t=>GM_setValue(z,t),savePreset:bs,getScheme:De,setScheme:Ea,listSchemePreviews:Fe},syncPanel:Dt}),_t=Mo({GM:{getValue:typeof GM_getValue=="function"?GM_getValue:null,setValue:typeof GM_setValue=="function"?GM_setValue:null,xmlHttp:typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest:null,addStyle:typeof GM_addStyle=="function"?GM_addStyle:null},doc:document,hostInfo:{version:o},uiDeps:{openSubpanel:t=>{t==="plugin-store"&&Va("plugin")}}});(function(){let e=()=>{try{_t.bootFromCache("assist")}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e):e()})();function Sn(){return An.open()}function _n(){An.close()}let Qr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACSQAAAC0CAYAAACHK7BeAAAIfklEQVR42u3c0Y2DMBBAwecTJbkL6qUL98RVcD/RRXLITAWIrBcFPTHazDXnHbzoXGu4C9g/2D847+bZ/JgfsH/sH8yP+TE/OF/YP9g/7gJ8x3523sF5Z08/bgEAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAPAMxzXn7Tb87VxruAvwHvaP/QMAAAD+v+f9j/kB82P/mB8AIF9IAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAAASJAEAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAAAJkgAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAACgEiQBAAAAAAAAAAAJkgAAAAAAAAAAgA0d51pjpwu65rxdD6/abZ4BAAAAeDbvD/O+Duwf+wfnC7+XfWh+8Hs57/lCEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAVIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAI907HZB51rDz/I5rjlv12OeAQAAAL7Vbu9/vK/zvg77B3C+PN/B/Djv5AtJAAAAAAAAAABAgiQAAAAAAAAAAIAESQAAAAAAAAAAQIIkAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAAIEESAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAkSAIAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAgARJAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAACQIAkAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAAARJAAAAAAAAAADAvxnXnLfbwFOcaw13gVfZh9g/2D/YPwCeX3h+4bybZ/NjfsyP+QH4rP1sH4LzTr6QBAAAAAAAAAAAJEgCAAAAAAAAAABIkAQAAAAAAAAAACRIAgAAAAAAAAAAEiQBAAAAAAAAAAAJkgAAAAAAAAAAABIkAQAAAAAAAAAACZIAAAAAAAAAAIAESQAAAAAAAAAAAAmSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAAAgQRIAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAJEgCAAAAAAAAAAASJAEAAAAAAAAAAAiSAAAAAAAAAACABEkAAAAAAAAAAECCJAAAAAAAAAAAIEESAAAAAAAAAABAgiQAAAAAAAAAACBBEgAAAAAAAAAAkCAJAAAAAAAAAABIkAQAAAAAAAAAAJAgCQAAAAAAAAAASJAEAAAAAAAAAAAkSAIAAAAAAAAAAEiQBAAAAAAAAAAAvNEvT/CbGdNA7ngAAAAASUVORK5CYII=",Os="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAJTElEQVR4nORbfWxbVxW/7773/J6f7SRO07VNGydpkjbJ2qbQURioEkgI/gBpgICpg8EfqIIhxMeAfzoE0gBpoK2D7g8QZRQxxDQhMYkPIYQ0PrQhbaxlS5u0adPEbUKWLEkdO87ze35fO+faz3FcO7Edx7G9n/Ry/T6u43Pu+brnnEfJ2xwC2WK0te0/oDTL36GEDnIcCXIcbSKEUzhKJY7jeHzGcRzLsW0dPqmOY8cch0RsYo8mYvqj8/M3xskWgiNbgI6ug/fxvPgQz9P3Ul4IAKGkHABjiGWZy7ZlvWiaxlPTN6/9lVQYFWVA5/67fy+K4scoz2ckC1aUGIZBbMsktm2zAwlzbIuN7EcAgzjKs5FSCiMlvCASQRQJzWIeMMIwzeTz4Ruj95MKoRIM4ELd/T8RPTKsOC/iBcs0GNEmHvCZ28R/wa9ERoiiB5iS4qtlm0bSMM5O3Rj9Npw6ZBPYFAM6Ovsf9sjS92HBFTxHYhNqHFeKbAVQsGTFRwSB8ZmYlrli6trpW+Gxs6RMlMsAuav30EWPRxrAEwsI1hIrsOJJUg0IIA2yVyGupiV1/VL4xuV3wUedlIiSGbBnT9+AElBeBnEMoD7rmgqHtikxLxceSSaSrDC7YZpmTI3pQ7OzV8OlfAdfysOh0MFPev2+F3iBl3HVV5ajTN+3g3gEeAiwNTqzEYIgSKIkfEXxBUZi0dtXiv2OohnQ0T34uKwoZ4DbFHUdid+k/akMwJOACjC7AFJJQT0+7Q+0+KJLC38vZnpRDOjcP3AGdO5hcFOcridIYmWZ1BqMpM5UARjBgUS8Twm0NMciC3/baN6GDOjo6jspe/2P42ctAfoOR62CGWHQR5QGURDvVXzN12JLC5fXm7Ou9u4O9Q76laZhSjkeOazW4MrnA9gBInokDLqsuLp8ZPbW+GihZ2mhGzt37vT7vb5XkHjU+XohHoG/1TJNVAkeaHi5vb1dKfRsQQYEWvaMQBzvQ1enxmOk1nFyRzP548EuNiJW4lEWdgMNfsnfdqnQvLwMCPUM/hgMSQhjdfwiN2avJ2T/drAH+zu7Bx7N91w+G0B7+4+qID0ShrVJXSO1jB927CKHFe8d1y+pCfLI1BwES17ihfDZtuzE+Nj//HDLzn7uDgno6jl0BokH+1HzxBeDJLjtlCpQb3fPoR/l3l8jAb29vRInBGKQrPCgIUHLXy9A3T/ZFiTPLkTIs4vRNffQI6BngKRL8vpVClJwwXDvrZEAg3ifQuIxzK0n4jcC0oJhM9LW1af/NPveWgnof4cGrkPCMBddXyNBEDzEF2hybUHGLWYkYG/XwHuQeNT9RiMeAZmkjC0IhfqPudczDBAF/us4GlXa028HcOeI4DzCN9xrmdwdT+kH2UPJjRnw+iure4yfnXuG/Pzcb0u+l4uh4x8u6v+VMi8XJtAmgVvkuRStCCYBd3V374KIqZVlYetU/HMjwXxA1UYaYdt8F3i8JrzGGKBw3q/hVheTmI2OVJKW4yxH/CqeMxUA93AvjugqqoX/XnydvHphOHP+pVOfzXzG669eHC5q3vnjR8iO6OpeBWMBPNxIMBeYnofAgDic8AE4/UHKBnDcbhwwh18tIBEFbQd5piADcud94r4PES1a/GbNttO1CNjw4piSAI40p25WjwGVwq5HvsnG6B/+RJae/3PeSDAbLo2gBUEcUwwgXADHakrAdsFxFzm96GkbwMs4blVBIx8eOvUgO1wU687KnefCXWTKUUZzWgUyVVrS6MBIl4FyrLzE3CCUKlN7gsan/w4amQQ4tmNAfljkKFc1KaiUGywV4PLZyGgmLgMcJwGDiCVqp0qxQKXcYKnARUakaU6rgGPHsm82MmjK3GVoTsmD7URSNylpdLgqABxYxMHdDWLMeJgrgwG5bikb9xw7Qsg5UlOgrgrYDouTGcWwB3gJR0HY8p6pbQdNNbGAAJgvsnP8sxxNPglGwcHGg0aHCKV0pPXm5PITeM6WPBKZiAZ3HpmDouJubE7aKCeArsjFzMwcmXljddfFxD6Nf/zzP2vmYYLERa4rK/deKcC8IDZiQRF1Fn45q/JmzH6o5+5fy5L8eez20BJx0ojwKn7WVaJriV/dnBj9Al7LWD3eNs/gKHoaVw1c2iziPOZeyzBgcnJsGOoBKjYZiA1oCwSPh/UfWrYZn564ct29vsbvmbb5NI6y10caDd40TYZp/zL7em7oJ0BxJApSoNRbaWw9oN6j/kMyJDF+dW2BNDfyMS3D+B5+aCQpwFY6BKTFT5Oc6nDe4L/34NAipsmx+REsJqlnIPHYVAnJnsXxsdfacu/njX2TlvFFdzLlS2olrClgJ6kkp3oHDFM/le+Zgtu/7r7D/wZvcAKTiPFYpO6yRRjw+JuCrHUObNm/Jscvvz/vc+t8B+05MDQDVZRdq42R9QN/oIV1l4NRm50YG24nBfJd623/7Oht7Z0gAQb23WGDQb1A8TUx4iH/l4xHlo+SdZJ96+5/FxbGZnRN/RQWE7DLwrWmtQwJvBdGfDZkf7WE+vE335ycW+/5DS1cbGlxLNAc9IAUnMCmZB6MYq2W0FFKJfD5aK8MTfvuVHjs6Y3mFGXio5H5F3yBYBCs6rtBtDgMld1aey0AQ1x/oJm9R4BbXV3Xzt6avHK6qLmkBHR29j8ger2/wQ5MzK+vxGNVLabkA7o6xd/ErD22xuraymemwteeK3Z+yVnQvV19R2XZ9xJPeQWrLNhKp21TA7Uk++CQmcuDrFZc09UT/w9ff62U7ygrDdza2trUsmPfZbAJHXjO3hzBTnK9Om+OZL8pgjANY2p56Y3B+fn5khMZZYV5iURCj9yee9IXaJWB3uM8vi4Gljfdob1afqogWMurRwZxDzAGpFddT2raE+GJkY+oqlqWZa7EeomhnsFfiKL0IA+2AS9gnyH27rPDTG7i3zgsjYV7eRz5dFju2JaZ1I3zNydHvgynm6rkVExg9+3b5xXk5ufAEn+UZlVYMIbAHKNlGZkXJwl7cdJmvhojFJrnxUlBFCAxI635HzDXBob+xdSi909PT1dkl1ZxjW1vP6aIivoAdcTPUZ7ewwu8l2wClmklbMu+YHPmec5UfxcOhyvawLzlJmvv3gNDgiR8C1Z1ABY2CGtc1MvTMF7R1eRjs7PjI2QL0fjFwA3wFgAAAP//9xCJogAAAAZJREFUAwAJZkVSj1sY7gAAAABJRU5ErkJggg==";function En(){try{let t=document.head||document.documentElement;t.querySelectorAll("link[rel]").forEach(r=>{let a=(r.getAttribute("rel")||"").toLowerCase();a.includes("icon")&&!a.includes("apple-touch")&&r.remove()});let e=document.createElement("link");e.rel="shortcut icon",e.href=Os,t.appendChild(e)}catch{}}function Cn(t){let e=t&&t.querySelector?t.querySelector("#urppp-about-logo"):document.getElementById("urppp-about-logo");e&&(e.getAttribute("src")!==Qr&&e.setAttribute("src",Qr),e.removeAttribute("referrerpolicy"),e.alt="SCU URP++",e.style.maxWidth="100%",e.style.height="auto",e.style.display="block")}function Pn(){if(document.getElementById("urppp-settings-panel"))return;fl();try{ae()}catch{}try{Jt&&Jt.length&&Pe(Jt)}catch{}let t=document.createElement("div");t.id="urppp-settings-mask",t.addEventListener("click",_n);let e=document.createElement("div");e.id="urppp-settings-panel",e.setAttribute("role","dialog"),e.setAttribute("aria-label","URP++ 设置");let r=Qr;e.innerHTML=si({logoData:Qr,repositoryUrl:n.repo,version:o}),document.documentElement.appendChild(t),document.documentElement.appendChild(e),pi(e),e.querySelector("#urppp-set-close").addEventListener("click",_n);try{Bs(e)}catch(p){console.warn("[URP++] privacy settings",p)}try{Ds(e)}catch(p){console.warn("[URP++] JSON settings",p)}try{Cn(e)}catch{}let a=e.querySelector("#urppp-about-logo");a&&!a.__urpppFallback&&(a.__urpppFallback=!0,a.addEventListener("error",()=>{a.dataset.fallback!=="1"&&(a.dataset.fallback="1",a.src=r)})),js.bind(e);try{_t.renderAssistUi(e.querySelector("#urppp-set-assist-slot"))}catch(p){console.warn("[URP++] plugin manager",p)}}function Va(t){let e=document.getElementById("urppp-settings-panel");if(!e)return;let r=document.getElementById("urppp-store-subpanel");r||(r=document.createElement("div"),r.id="urppp-store-subpanel",r.className="urppp-store-subpanel",r.innerHTML=`
        <div class="urppp-store-sub-head">
          <button type="button" class="urppp-store-sub-back" id="urppp-store-sub-back" aria-label="返回">←</button>
          <div class="urppp-store-sub-title" id="urppp-store-sub-title"></div>
        </div>
        <div class="urppp-store-sub-body" id="urppp-store-sub-body"></div>`,e.appendChild(r),r.querySelector("#urppp-store-sub-back").onclick=Rs);let a=r.querySelector("#urppp-store-sub-title"),p=r.querySelector("#urppp-store-sub-body");a.textContent=t==="theme"?"主题商店":"插件商店",p.innerHTML="",t==="theme"?Xs(p):jn(p),r.classList.add("open")}function Rs(){let t=document.getElementById("urppp-store-subpanel");if(!t)return;t.classList.remove("open");let e=t.querySelector("#urppp-store-sub-body");e&&(e.innerHTML="")}function zn(t){t.querySelectorAll(".urppp-store-tab").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll(".urppp-store-tab").forEach(a=>a.className="urppp-store-tab"),e.className="urppp-store-tab ac",t.querySelectorAll(".urppp-store-pane").forEach(a=>a.style.display="none");let r=t.querySelector('.urppp-store-pane[data-pane="'+e.dataset.tab+'"]');r&&(r.style.display="")})})}function Pe(t){Array.isArray(t)&&t.forEach(e=>{if(!e||!e.id)return;let r="";try{r=GM_getValue("urppp_card_css_"+e.id,"")||""}catch{}let a=r||e.cardCss||"";if(!a)return;let p=document.getElementById("urppp-store-card-css-"+e.id);p||(p=document.createElement("style"),p.id="urppp-store-card-css-"+e.id,(document.head||document.documentElement).appendChild(p)),p.textContent!==a&&(p.textContent=a)})}function Hs(t,e){let r=(d.find(u=>u.id===t.id)||{}).repo,a=t.repo||r,p=a?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${Z(a)}">仓库</button>`:"",i=t.cardCss||"",s=i?`<style>${i}</style>`:"";return`<div class="urppp-skin-card" data-skin="${Z(t.id)}">
      ${s}
      <div class="urppp-skin-name">${Z(t.name||t.id)}</div>
      <div class="urppp-skin-meta">${Z(t.author||"")}${t.author&&t.version?" · ":""}v${Z(t.version||"")}<span class="urppp-dows" data-dows-id="${Z(t.id)}"></span></div>
      <p class="urppp-skin-desc">${Z(t.description||"")}</p>
      <button type="button" class="urppp-skin-apply" data-store-theme="${Z(t.id)}"${e?" disabled":""}>${e?"已安装":"下载"}</button>
      ${p}
    </div>`}async function gr(t){let e=t.querySelector('[data-pane="download"]');if(!e)return;let r=a=>{if(!a.length){e.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载主题</p><p class="urppp-store-sub">已安装的主题不会再显示在这里。</p></div>';return}Pe(a),e.innerHTML=`<div class="urppp-store-theme-grid">${a.map(p=>Hs(p,!1)).join("")}</div>`,e.querySelectorAll("[data-store-theme]").forEach(p=>{p.addEventListener("click",()=>Us(p.dataset.storeTheme,p))}),e.querySelectorAll("[data-repo]").forEach(p=>p.addEventListener("click",()=>{try{window.open(p.dataset.repo,"_blank","noopener")}catch{}}));try{vr(e)}catch{}};r((Jt||[]).filter(a=>a.type==="theme"&&!ce(a.id)));try{let a=await de(!0);Jt=a,Qa(a),e.isConnected&&r(a.filter(p=>p.type==="theme"&&!ce(p.id)))}catch{}}async function Us(t,e){if(!e||e.disabled)return;e.disabled=!0,e.textContent="下载中…";let r=(await de()).find(s=>s.id===t);if(!r||!Array.isArray(r.entry)||!r.entry.length){e.disabled=!1,e.textContent="下载";return}let a=await Za(r);if(a==="fail"&&!await ta("签名校验失败：该条目可能被篡改。是否仍要安装？")){e.disabled=!1,e.textContent="下载";return}if(a==="unknown"&&r._srcPub&&!await ta("该源无有效签名校验，可能被篡改。是否自担风险继续下载？")){e.disabled=!1,e.textContent="下载";return}let p="";for(let s of r.entry){let u=await Zr(s,6e3);if(u){p=u;break}}if(!p){Le("下载失败：所有源均不可达（本地测试源已关/网络不通）","error"),e.textContent="下载失败",setTimeout(()=>{e.textContent="下载",e.disabled=!1},1400);return}try{GM_setValue("urppp_theme_css_"+t,p)}catch{}if(d.some(s=>s.id===t)||Vo(t,{name:r.name||t,desc:r.desc||"下载主题",author:r.author||"",version:r.version||"1.0.0"}),r.cardCss)try{GM_setValue("urppp_card_css_"+t,r.cardCss)}catch{}try{Ia(t).textContent=p}catch{}try{Pe([{id:t,cardCss:r.cardCss||""}])}catch{}e.textContent="已安装",e.disabled=!0;try{Ka(t,r._srcUrl)}catch{}let i=e.closest&&e.closest(".urppp-store-inline");if(i){try{let s=i.querySelector("#urppp-theme-manage");s&&await Kr(s)}catch{}try{gr(i)}catch{}}try{Dt()}catch{}}function Ws(t,e){let a=t.installed!==!1?"":`<button type="button" class="urppp-skin-apply urppp-store-del" data-theme-del="${Z(t.id)}">删除</button>`,p=e&&e.repo||t.repo,i=p?`<button type="button" class="urppp-skin-apply urppp-store-repo" data-repo="${Z(p)}">仓库</button>`:"",s=ee()===t.id,u=e&&e.cardCss||"";if(!u)try{u=GM_getValue("urppp_card_css_"+t.id,"")||""}catch{}let m=u?`<style>${u}</style>`:"";return`<div class="urppp-skin-card${s?" is-active":""}" data-skin="${Z(t.id)}">
      ${m}
      <div class="urppp-skin-name">${Z(t.name)}</div>
      <div class="urppp-skin-meta">${Z(e&&e.author||"")}${e&&e.author&&t.version?" · ":""}v${Z(t.version||"")}<span class="urppp-dows" data-dows-id="${Z(t.id)}"></span></div>
      <p class="urppp-skin-desc">${Z(t.desc||"")}</p>
      <button type="button" class="urppp-skin-apply${s?" is-current":""}" data-theme-use="${Z(t.id)}"${s?" disabled":""}>${s?"使用中":"使用"}</button>
      ${a}${i}
    </div>`}async function Kr(t){if(!t)return;let e=Jt||[],r=ye(),a=Object.keys(r).map(i=>({id:i,name:r[i].name||i,desc:r[i].desc||"本地主题",version:r[i].version||"1.0.0",author:r[i].author||"本地",installed:!1})),p=d.filter(i=>i.installed!==!1||ce(i.id)).concat(a.filter(i=>!d.some(s=>s.id===i.id)));if(!p.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无已装主题</p></div>';return}Pe(p.map(i=>{let s="";try{s=GM_getValue("urppp_card_css_"+i.id,"")||""}catch{}return{id:i.id,cardCss:s||(e.find(u=>u.id===i.id)||{}).cardCss||""}})),t.innerHTML=`<div class="urppp-store-theme-grid">${p.map(i=>Ws(i,e.find(s=>s.id===i.id))).join("")}</div>`;try{vr(t)}catch{}t.querySelectorAll("[data-theme-use]").forEach(i=>i.addEventListener("click",()=>{if(tn(i.dataset.themeUse)){try{Dt()}catch{}t.querySelectorAll(".urppp-skin-card").forEach(s=>{let u=s.dataset.skin,m=s.querySelector(".urppp-skin-apply"),w=ee()===u;s.classList.toggle("is-active",w),m&&(m.classList.toggle("is-current",w),m.disabled=w,m.textContent=w?"使用中":"使用")})}})),t.querySelectorAll("[data-theme-del]").forEach(i=>i.addEventListener("click",()=>{let s=i.dataset.themeDel,u=ee()===s;try{GM_setValue("urppp_theme_css_"+s,"")}catch{}try{GM_setValue("urppp_card_css_"+s,"")}catch{}vs(s),ks(s);try{if(u){GM_setValue(c,"apple");try{document.documentElement.removeAttribute("data-urppp-skin")}catch{}try{document.body&&document.body.removeAttribute("data-urppp-skin")}catch{}ae();let w=Xt(),q=w?xe():Yt();Gt(q,{system:w})}}catch{}try{Dt()}catch{}let m=t.closest(".urppp-store-inline");if(m){try{Kr(t)}catch{}try{gr(m)}catch{}}})),t.querySelectorAll("[data-repo]").forEach(i=>i.addEventListener("click",()=>{try{window.open(i.dataset.repo,"_blank","noopener")}catch{}}))}function Ln(){return`<div class="urppp-store-settings">
      <button type="button" class="urppp-set-follow" data-store-auto-update>自动检测更新：关</button>
      <button type="button" class="urppp-set-btn" data-store-check-update>检查更新</button>
    </div>`}let qn=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json"],Gs=["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/sources.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/sources.json","https://gh-proxy.com/https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/sources.json"];function Zr(t,e=5e3){return new Promise(r=>{try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:"GET",url:t,timeout:e,cache:"no-store",onload:a=>r(a&&a.responseText||""),onerror:()=>r(""),ontimeout:()=>r("")});return}fetch(t,{cache:"no-store"}).then(a=>a&&a.ok?a.text():"").then(a=>r(a||"")).catch(()=>r(""))}catch{r("")}})}function Tn(t){try{let e=JSON.parse(t);return e&&Array.isArray(e.items)?e:null}catch{return null}}let Ya=null;async function Mn(t){if(Ya&&!t)return Ya;let e=await Promise.allSettled(Gs.map(r=>Zr(r)));for(let r of e)if(!(r.status!=="fulfilled"||!r.value))try{let a=JSON.parse(r.value);if(a&&Array.isArray(a.sources))return Ya=a,a}catch{}return null}let xr=qn[0];function ze(){try{let t=JSON.parse(GM_getValue("urppp_store_sources","[]")),e=Array.isArray(t)?t:[],r=!1;for(let a of e)a&&"hidden"in a&&(delete a.hidden,r=!0);if(GM_getValue("urppp_sources_migrated",!1)||(e.some(a=>a&&a.url===xr)||e.unshift({name:"SCU URP++ 官方商店仓库",url:xr,mirrors:qn.slice(),enabled:!0}),GM_setValue("urppp_sources_migrated",!0),r=!0),r)try{GM_setValue("urppp_store_sources",JSON.stringify(e))}catch{}return e}catch{return[]}}function Xr(t){try{GM_setValue("urppp_store_sources",JSON.stringify(t))}catch{}}function Js(){try{let t=GM_getValue("urppp_catalog_cache","");return t&&JSON.parse(t)||null}catch{return null}}function Qa(t){try{Array.isArray(t)&&t.length&&GM_setValue("urppp_catalog_cache",JSON.stringify(t))}catch{}}let Jt=Js();async function de(t){if(Jt&&!t)return Jt;let e=async s=>Tn(await Zr(s)),r=ze().filter(s=>s&&s.url&&s.enabled!==!1),a=await Promise.allSettled(r.map(async s=>{let u=Array.isArray(s.mirrors)&&s.mirrors.length?s.mirrors:[s.url];u.includes(s.url)||u.unshift(s.url);let m=null;for(let w of u)if(m=await e(w),m)break;return{doc:m,pubkey:m&&m.pubkey||"",srcUrl:s.url}})),p=[],i=new Set;for(let s of a){if(!(s.status==="fulfilled"&&s.value&&s.value.doc))continue;let u=s.value.pubkey||"",m=s.value.srcUrl||"";for(let w of s.value.doc.items)!w||!w.id||i.has(w.id)||(i.add(w.id),u&&(w._srcPub=u),m&&(w._srcUrl=m),p.push(w))}return Jt=p,Qa(p),p}function Vs(){try{if(typeof crypto<"u"&&crypto&&crypto.subtle)return crypto.subtle;let t=typeof unsafeWindow<"u"&&unsafeWindow?unsafeWindow:typeof window<"u"?window:null;if(t&&t.crypto&&t.crypto.subtle)return t.crypto.subtle}catch{}return null}function yr(t){if(Array.isArray(t))return t.map(yr);if(t&&typeof t=="object"){let e={};for(let r of Object.keys(t).filter(a=>a!=="signature"&&a!=="_srcPub").sort())e[r]=yr(t[r]);return e}return t}function Je(t){try{let e=atob(t),r=new Uint8Array(e.length);for(let a=0;a<e.length;a+=1)r[a]=e.charCodeAt(a);return r}catch{return null}}async function Ys(t,e){let r=Vs();if(!r)try{if(!e||!t||!t.signature)return!1;let a=Je(e),p=Je(t.signature);if(!a||!p)return!1;let i=JSON.stringify(yr(t));return zo(p,a,ua(i))}catch{return null}if(!e||!t||!t.signature)return!1;try{let a=Je(e);if(!a)return null;let p=await r.importKey("raw",a,{name:"Ed25519"},!1,["verify"]),i=Je(t.signature);if(!i)return!1;let s=JSON.stringify(yr(t)),u=await r.digest("SHA-256",new TextEncoder().encode(s)),m=new Uint8Array(u);return await r.verify({name:"Ed25519"},p,i,m)}catch{return null}}function Le(t,e){try{let r=document.getElementById("urppp-toast");r||(r=document.createElement("div"),r.id="urppp-toast",r.className="urppp-toast",(document.body||document.documentElement).appendChild(r)),r.textContent=t,r.className="urppp-toast"+(e==="error"?" error":""),r.style.display="",r.style.pointerEvents="auto",r.style.transition="opacity .22s, transform .22s",r.style.opacity="0",r.style.transform="translateY(14px)",requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="none"}),clearTimeout(r._t),r._t=setTimeout(()=>{r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>{r.style.display="none"},260)},3200)}catch{try{window.alert(t)}catch{}}}function ta(t){return new Promise(e=>{try{let r=document.getElementById("urppp-confirm");r||(r=document.createElement("div"),r.id="urppp-confirm",r.className="urppp-confirm",r.innerHTML='<div class="urppp-confirm-card"><div class="urppp-confirm-txt"></div><div class="urppp-confirm-ops"><button type="button" class="urppp-set-btn ghost" data-cac>取消</button><button type="button" class="urppp-set-btn" data-ok>继续</button></div></div>',(document.body||document.documentElement).appendChild(r)),r.style.display="",r.querySelector(".urppp-confirm-txt").textContent=t,r.style.pointerEvents="auto",r.style.transition="opacity .22s, transform .22s",r.style.opacity="0",r.style.transform="translateY(14px)",requestAnimationFrame(()=>{r.style.opacity="1",r.style.transform="none"});let a=p=>{r.querySelector("[data-ok]").onclick=r.querySelector("[data-cac]").onclick=null,r.style.pointerEvents="none",r.style.opacity="0",r.style.transform="translateY(20px)",setTimeout(()=>{r.style.display="none"},260),e(p)};r.querySelector("[data-ok]").onclick=()=>a(!0),r.querySelector("[data-cac]").onclick=()=>a(!1)}catch{try{e(window.confirm(t))}catch{e(!1)}}})}let we="https://api.yanjiangrd.site";function Qs(){return new Promise(t=>{let e=!1,r=a=>{e||(e=!0,t(a))};try{let a=GM_getValue("urppp_downs_salt","");if(a)return r(a);if(!we||typeof GM_xmlhttpRequest!="function")return r("");GM_xmlhttpRequest({method:"GET",url:we+"/downs/salt",timeout:8e3,onload:p=>{try{let i=String((JSON.parse(p.responseText)||{}).salt||"");if(/^[0-9a-f]{16,128}$/.test(i)){try{GM_setValue("urppp_downs_salt",i)}catch{}r(i)}else r("")}catch{r("")}},onerror:()=>r(""),ontimeout:()=>r("")}),setTimeout(()=>r(""),9500)}catch{r("")}})}function Ks(){try{let t=GM_getValue("urppp_downs_sid","");if(t&&/^\d{6,20}$/.test(t))return t;let e=document.getElementById("urppp-user");if(e&&/^\d{6,20}$/.test(String(e.value||"").trim())){let a=String(e.value).trim();try{GM_setValue("urppp_downs_sid",a)}catch{}return a}let r=String(location.search||"").match(/[?&](?:userAccount|sno)=(\d{6,20})/);if(r){try{GM_setValue("urppp_downs_sid",r[1])}catch{}return r[1]}}catch{}return""}async function Ka(t,e){try{if(!we||!t)return;let r=await Mn(),a=r&&Array.isArray(r.sources)?r.sources.map(w=>w&&w.url).filter(Boolean):[];if(!e||!a.includes(e))return;let p=await Qs();if(!p)return;let i=Ks();if(!i)return;let s=ua(new TextEncoder().encode(p+"|"+i+"|"+t)),u="";for(let w=0;w<16;w++)u+=s[w].toString(16).padStart(2,"0");let m=JSON.stringify({id:String(t),uid:u});try{await Promise.race([fetch(we+"/downs",{method:"POST",headers:{"Content-Type":"application/json"},body:m}),new Promise((w,q)=>setTimeout(()=>q(new Error("timeout")),6e3))]);return}catch{}try{typeof GM_xmlhttpRequest=="function"&&GM_xmlhttpRequest({method:"POST",url:we+"/downs",timeout:8e3,headers:{"Content-Type":"application/json"},data:m,onerror:()=>{},ontimeout:()=>{}})}catch{}}catch{}}function In(t){let e=we+"/downs?ids="+encodeURIComponent(t.join(",")),r=()=>new Promise(a=>{let p=!1,i=s=>{p||(p=!0,a(s||{}))};try{if(typeof GM_xmlhttpRequest!="function")return i({});GM_xmlhttpRequest({method:"GET",url:e,timeout:8e3,onload:s=>{try{i(JSON.parse(s.responseText)||{})}catch{i({})}},onerror:()=>i({}),ontimeout:()=>i({})}),setTimeout(()=>i({}),9500)}catch{i({})}});return(async()=>{try{let a=await Promise.race([fetch(e,{cache:"no-store"}),new Promise((p,i)=>setTimeout(()=>i(new Error("timeout")),6e3))]);if(a&&a.ok)return await a.json()||{}}catch{}return r()})()}async function vr(t){let e=(typeof unsafeWindow<"u"?unsafeWindow:window).__urpppDownsLast={t:Date.now(),hasRoot:!!t,api:we||"(empty)"};try{if(!t||!we){e.stop="no-root-or-api";return}let r=t.querySelectorAll("[data-dows-id]");if(e.els=r.length,!r.length){e.stop="no-placeholders";return}let a=Array.from(new Set(Array.from(r).map(s=>s.dataset.dowsId)));e.ids=a;let p=await In(a);if(e.map=p,!t.isConnected){e.stop="root-detached";return}let i=0;t.querySelectorAll("[data-dows-id]").forEach(s=>{let u=p[s.dataset.dowsId];typeof u=="number"&&u>=0&&(s.textContent=" · ↓"+(u>=1e4?(u/1e4).toFixed(1)+"w":String(u)),i++)}),e.filled=i;try{console.log("[URP++ downs]",JSON.stringify(e))}catch{}}catch(r){e.err=String(r);try{console.log("[URP++ downs] err",String(r))}catch{}}}try{let t=typeof unsafeWindow<"u"?unsafeWindow:window;t.__urpppDownsVer="v8",t.__urpppDownsTest=In,t.__urpppDownsRefresh=vr,t.__urpppStoreTest=e=>gr(e),t.__urpppStoreForceRefresh=async()=>{let e=await de(!0);return console.log("[urppp store] force refresh done:",e.map(r=>r.id+":"+(r._srcUrl||"?")).join(", ")),e},t.__urpppStoreProbe=async()=>{let r=(await de(!0)).find(a=>a.id==="test-theme");if(!r){console.log("[probe] test-theme not found");return}console.log("[probe] item:",JSON.stringify({version:r.version,_srcPub:r._srcPub?r._srcPub.slice(0,16)+"...":null,_srcUrl:r._srcUrl,hasSig:!!r.signature,sigLen:(r.signature||"").length},null,2));try{let a=await Za(r);console.log("[probe] guardEntrySignature ->",a)}catch(a){console.log("[probe] guard threw:",a.message)}try{let a=r._srcPub,p=JSON.stringify(yr(r)),i=Je(a),s=Je(r.signature),u=zo(s,i,ua(p));console.log("[probe] ed25519Verify ->",u)}catch(a){console.log("[probe] verify threw:",a.message)}},t.__urpppStoreDiag=async()=>{let e={};try{let r=GM_getValue("urppp_catalog_cache","");e.catalogCache=r?JSON.parse(r).map(a=>a.id+":"+(a._srcUrl||"?")).join(", "):"(empty)"}catch(r){e.catalogCache="ERR "+r.message}try{e.sources=JSON.parse(GM_getValue("urppp_store_sources","[]")).map(r=>({n:r.name,u:r.url,e:r.enabled,m:(r.mirrors||[]).length}))}catch(r){e.sources="ERR "+r.message}e.migrated=GM_getValue("urppp_sources_migrated","unset"),e.cacheInMem=Jt?Jt.map(r=>r.id+":"+(r._srcUrl||"?")).join(", "):"(null)",e.officialURL=xr,console.log("[urppp store diag]",JSON.stringify(e,null,2)),["https://raw.githubusercontent.com/chaolan2019/URP-plusplus-Repository/main/catalog.json","https://cdn.jsdelivr.net/gh/chaolan2019/URP-plusplus-Repository@main/catalog.json"].forEach(r=>{try{GM_xmlhttpRequest({method:"GET",url:r,timeout:8e3,onload:a=>console.log("[urppp probe] GM-OK",r.slice(0,60),(a.responseText||"").length+"B"),onerror:a=>console.log("[urppp probe] GM-ERR",r.slice(0,60)),ontimeout:()=>console.log("[urppp probe] GM-TIMEOUT",r.slice(0,60))})}catch(a){console.log("[urppp probe] EXC",r.slice(0,60),a.message)}})}}catch{}async function Za(t){let e=t&&t._srcPub;if(!e)return"trust";let r=await Ys(t,e);return r===!0?"ok":r===!1?"fail":"unknown"}function $n(t,e){let r=String(t||"0").split(".").map(Number),a=String(e||"0").split(".").map(Number);for(let p=0;p<Math.max(r.length,a.length);p+=1){let i=r[p]||0,s=a[p]||0;if(i!==s)return i>s}return!1}function Zs(t,e){let r=0;return e.forEach(a=>{if(!a.id)return;let p=t.querySelector('[data-theme-use="'+a.id+'"]');p&&$n(a.version,d.find(s=>s.id===a.id)&&d.find(s=>s.id===a.id).version)&&(Nn(p.closest(".urppp-skin-card"),"主题"),r+=1);let i=t.querySelector('[data-plugin-id="'+a.id+'"]');if(i){let s=_t&&_t.api&&_t.api.get&&_t.api.get(a.id);s&&$n(a.version,s.version)&&(Nn(i.closest(".urppp-store-item"),"插件"),r+=1)}}),r}function Nn(t,e){if(!t||t.querySelector(".urppp-store-update"))return;let r=t.querySelector(".urppp-store-ops");if(!r)return;let a=document.createElement("button");a.type="button",a.className="urppp-set-btn urppp-store-update",a.textContent="有新更新",a.addEventListener("click",()=>{try{a.textContent="更新中…"}catch{}}),r.appendChild(a)}function Bn(t){let e=t.querySelector("[data-store-auto-update]"),r=t.querySelector("[data-store-check-update]");if(!e||!r)return;let a=GM_getValue("urppp_store_auto_update",!1),p=()=>{e.textContent="自动检测更新："+(a?"开":"关")};p(),e.addEventListener("click",()=>{a=!a,GM_setValue("urppp_store_auto_update",a),p()}),r.addEventListener("click",async()=>{r.disabled=!0;let i=r.textContent;r.textContent="检查中…";try{let s=await de(),u=Zs(t,s);r.textContent=u?"发现更新":"已是最新"}catch{r.textContent="检查失败"}setTimeout(()=>{r.textContent=i,r.disabled=!1},1600)})}function Xs(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">主题下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">主题管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${Ln()}<button type="button" class="urppp-set-btn ghost" data-add-local-theme style="width:100%;margin:0 0 10px">＋ 添加本地主题</button><input type="file" accept=".css,.txt" data-local-theme-file style="display:none"><div class="urppp-store-bd"><div id="urppp-theme-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${Xa()}</div>
        </div>
      </div>`,zn(t),Bn(t),el(t),to(t),gr(t),setTimeout(()=>{try{vr(t)}catch{}},800),Kr(t.querySelector("#urppp-theme-manage"))}function Xa(){let t=ze();return`<div class="urppp-src-manage">
      <div class="urppp-src-official">
        <p class="urppp-src-hint"><strong>官方收录源</strong>（点击添加；收录申请见 <a class="urppp-src-link" href="https://github.com/chaolan2019/URP-plusplus-Repository/tree/main/contribute" target="_blank" rel="noopener noreferrer">商店仓库投稿指南</a>）</p>
        <div data-src-official-list><div class="urppp-store-empty"><p>正在加载收录列表…</p></div></div>
      </div>
      <div class="urppp-src-mine">
        <p class="urppp-src-hint"><strong>我的仓库源</strong></p>
        ${t.length?t.map((r,a)=>`
      <div class="urppp-src-item">
        <div class="urppp-src-meta"><strong>${Z(r.name||"未命名")}</strong><span class="urppp-src-url">${Z(r.url)}</span></div>
        <div class="urppp-src-ops">
          <button type="button" class="urppp-set-btn ghost" data-src-toggle="${a}">${r.enabled!==!1?"禁用":"启用"}</button>
          <button type="button" class="urppp-set-btn ghost" data-src-del="${a}">删除</button>
        </div>
      </div>`).join(""):'<div class="urppp-store-empty"><p>暂无仓库源</p></div>'}
        <div class="urppp-src-add">
          <input type="text" class="urppp-input" data-src-url placeholder="catalog.json 地址">
          <input type="text" class="urppp-input" data-src-name placeholder="源名称（可选）">
          <button type="button" class="urppp-set-btn" data-src-add>添加仓库源</button>
        </div>
      </div>
    </div>`}function tl(t){t.dataset.srcAutoRefresh||(t.dataset.srcAutoRefresh="1",t.addEventListener("click",e=>{let r=e.target,a=r&&r.closest?r.closest("button"):null;!a||!a.closest('[data-pane="sources"]')||(clearTimeout(window.__urpppSrcAutoRefreshTimer),window.__urpppSrcAutoRefreshTimer=setTimeout(()=>{try{gr(t)}catch{}},400))}))}async function Fn(t){let e=t.querySelector("[data-src-official-list]");if(!e)return;let r=await Mn();if(!r||!e.isConnected)return;let a=ze(),p=(r.sources||[]).filter(i=>i&&i.url&&!a.some(s=>s.url===i.url));if(!p.length){e.innerHTML='<div class="urppp-store-empty"><p>已收录全部可用源</p></div>';return}e.innerHTML=p.map((i,s)=>`
      <div class="urppp-src-item">
        <div class="urppp-src-meta"><strong>${Z(i.name||i.id||"未命名")}</strong><span class="urppp-src-url">${Z(i.author?i.author+" · ":"")}${Z(i.url)}</span>${i.description?`<span class="urppp-src-url">${Z(i.description)}</span>`:""}</div>
        <div class="urppp-src-ops"><button type="button" class="urppp-set-btn ghost" data-src-official="${s}">添加</button></div>
      </div>`).join(""),e.querySelectorAll("[data-src-official]").forEach(i=>i.addEventListener("click",async()=>{let s=p[Number(i.dataset.srcOfficial)];if(!s||!s.url)return;i.disabled=!0;let u=ze();if(u.some(w=>w.url===s.url)){Le("该源已存在");return}let m=Object.assign({name:s.name||s.id||s.url,url:s.url,enabled:!0},Array.isArray(s.mirrors)&&s.mirrors.length?{mirrors:s.mirrors.slice()}:{});s.url===xr?u.unshift(m):u.push(m),Xr(u),Jt=null,Le("已添加仓库源："+(s.name||s.url)),ea(t)}))}function to(t){let e=t.querySelector("[data-src-add]");if(e){let r=t.querySelector("[data-src-url]"),a=t.querySelector("[data-src-name]");e.addEventListener("click",async()=>{let p=(r.value||"").trim();if(!p)return;e.disabled=!0;let i=e.textContent;e.textContent="验证中…";try{if(!Tn(await Zr(p,8e3)))throw new Error("无法访问或不是合法 catalog（无 items）");let u=ze();if(u.some(m=>m.url===p)){Le("该源已存在");return}u.push({name:(a.value||"").trim()||p,url:p,enabled:!0}),Xr(u),Jt=null,ea(t)}catch(s){Le("添加失败："+(s&&s.message?s.message:s),"error")}finally{e.disabled=!1,e.textContent=i}})}t.querySelectorAll("[data-src-toggle]").forEach(r=>r.addEventListener("click",()=>{let a=Number(r.dataset.srcToggle),p=ze();p[a]&&(p[a].enabled=p[a].enabled===!1,Xr(p),ea(t))})),t.querySelectorAll("[data-src-del]").forEach(r=>r.addEventListener("click",()=>{let a=Number(r.dataset.srcDel),p=ze();p[a]&&(p.splice(a,1),Xr(p),ea(t))}));try{Fn(t)}catch{}tl(t)}function ea(t){let e=t.querySelector('[data-pane="sources"]');if(e){let r=t;e.innerHTML=Xa(),to(r),Fn(r)}}function el(t){let e=t.querySelector("[data-add-local-theme]"),r=t.querySelector("[data-local-theme-file]");!e||!r||(e.addEventListener("click",()=>r.click()),r.addEventListener("change",async()=>{let a=r.files&&r.files[0];if(!a)return;let p=await a.text(),i=p.match(/html\[data-urppp-skin="([\w-]+)"\]/);if(!i){Le('未能从 CSS 中识别主题 id（需要 html[data-urppp-skin="…"]）',"error"),r.value="";return}let s=i[1];try{GM_setValue("urppp_theme_css_"+s,p)}catch{}Vo(s,{name:s,desc:"本地主题",author:"本地",version:"1.0.0"});try{Ia(s).textContent=p}catch{}r.value="";try{Kr(t.querySelector("#urppp-theme-manage"))}catch{}}))}function rl(t){let e=t.repo?`<button type="button" class="urppp-store-repo" data-repo="${Z(t.repo)}">仓库</button>`:"";return`<div class="urppp-store-item" data-plugin-card="${Z(t.id)}">
      <div class="urppp-store-info">
        <div><strong>${Z(t.name||t.id)}</strong><span class="urppp-store-meta">${Z(t.author||"")}${t.author&&t.version?" · ":""}v${Z(t.version||"")}<span class="urppp-dows" data-dows-id="${Z(t.id)}"></span></span></div>
        <div class="urppp-store-item-desc">${Z(t.description||"")}</div>
      </div>
      <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-apply="${Z(t.id)}">安装</button>${e}</div>
    </div>`}async function al(t){if(!t)return;let e=a=>{if(!a.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无待下载插件</p><p class="urppp-store-sub">已安装的插件不会再显示在这里。</p></div>';return}t.innerHTML=`${a.map(p=>rl(p)).join("")}`,t.querySelectorAll("[data-plugin-apply]").forEach(p=>p.addEventListener("click",async()=>{p.disabled=!0;let i=p.textContent;p.textContent="下载中…";try{let s=(await de()).find(m=>m.id===p.dataset.pluginApply),u=s?await Za(s):"trust";if(u==="fail"&&!await ta("签名校验失败：该插件可能被篡改。是否仍要装载？")){p.textContent="下载",p.disabled=!1;return}if(u==="unknown"&&s&&s._srcPub&&!await ta("该源无有效签名校验，可能被篡改。是否自担风险继续装载？")){p.textContent="下载",p.disabled=!1;return}_t&&_t.api&&_t.api.install&&await _t.api.install(p.dataset.pluginApply,null),p.textContent="已安装";try{Dt()}catch{}try{Ka(p.dataset.pluginApply)}catch{}}catch{p.textContent="失败"}setTimeout(()=>{p.textContent=i,p.disabled=!1},1200)})),t.querySelectorAll("[data-repo]").forEach(p=>p.addEventListener("click",()=>{try{window.open(p.dataset.repo,"_blank","noopener")}catch{}}));try{vr(t)}catch{}},r=a=>(a||[]).filter(p=>p.type==="plugin"&&!(_t&&_t.api&&_t.api.isEnabled&&_t.api.isEnabled(p.id)));e(r(Jt));try{let a=await de(!0);Jt=a,Qa(a),document.body.contains(t)&&e(r(a))}catch{}}async function Dn(t){if(!t)return;let e=[];try{e=await de()}catch{}let r=_t&&_t.api&&_t.api.list&&_t.api.list()||[];if(!r.length){t.innerHTML='<div class="urppp-store-empty"><p class="urppp-store-empty-title">暂无插件</p><p class="urppp-store-sub">已装载的插件会显示在这里。</p></div>';return}t.innerHTML=r.map(a=>{let p=e.find(u=>u.id===a.id),i=p&&p.downloads!=null?`<span class="urppp-store-dl">↓ ${Z(String(p.downloads))}</span>`:"",s=a.repo||p&&p.repo?`<button type="button" class="urppp-set-btn ghost" data-repo="${Z(a.repo||p.repo)}">仓库</button>`:"";return`<div class="urppp-store-item">
        <div class="urppp-store-row">
          <div class="urppp-store-info"><strong>${Z(a.name||a.id)}</strong>${a.author?`<span class="urppp-store-author">${Z(a.author)}</span>`:""}<span class="urppp-store-ver">${a.version?"v"+Z(a.version):""}</span><span class="urppp-store-state ok">已装</span>${i}</div>
          <div class="urppp-store-ops"><button type="button" class="urppp-set-btn" data-plugin-op="reload" data-plugin-id="${Z(a.id)}">重新装载</button><button type="button" class="urppp-set-btn ghost" data-plugin-op="unload" data-plugin-id="${Z(a.id)}">卸载</button>${s}</div>
        </div>
        ${a.description?`<p class="urppp-store-item-desc">${Z(a.description)}</p>`:""}
      </div>`}).join(""),t.querySelectorAll('[data-plugin-op="reload"]').forEach(a=>a.addEventListener("click",async()=>{a.disabled=!0;let p=a.textContent;a.textContent="装载中…";try{_t&&_t.api&&_t.api.install&&await _t.api.install(a.dataset.pluginId,null),a.textContent="已装载";try{Dt()}catch{}}catch{a.textContent="失败"}setTimeout(()=>{a.textContent=p,a.disabled=!1},1200)})),t.querySelectorAll('[data-plugin-op="unload"]').forEach(a=>a.addEventListener("click",()=>{try{_t&&_t.api&&_t.api.unregister&&_t.api.unregister(a.dataset.pluginId)}catch{}try{Dt()}catch{}let p=t.closest(".urppp-store-inline");try{jn(p)}catch{}})),t.querySelectorAll("[data-repo]").forEach(a=>a.addEventListener("click",()=>{try{window.open(a.dataset.repo,"_blank","noopener")}catch{}}))}function jn(t){t.innerHTML=`
      <div class="urppp-store-inline">
        <div class="urppp-store-tabs">
          <button type="button" class="urppp-store-tab ac" data-tab="download">插件下载</button>
          <button type="button" class="urppp-store-tab" data-tab="manage">插件管理</button>
          <button type="button" class="urppp-store-tab" data-tab="sources">仓库源</button>
        </div>
        <div class="urppp-store-body">
          <div class="urppp-store-pane" data-pane="download"><div class="urppp-store-empty"><p class="urppp-store-empty-title">加载中…</p></div></div>
          <div class="urppp-store-pane" data-pane="manage" style="display:none">${Ln()}<button type="button" class="urppp-set-btn ghost" data-add-local-plugin style="width:100%;margin:0 0 10px">＋ 添加本地插件</button><input type="file" accept=".js,.txt" data-local-plugin-file style="display:none"><div class="urppp-store-bd" id="urppp-plugin-manage"><div class="urppp-store-empty"><p>加载中…</p></div></div></div>
          <div class="urppp-store-pane" data-pane="sources" style="display:none">${Xa()}</div>
        </div>
      </div>`,zn(t),Bn(t),ol(t),to(t),al(t.querySelector('[data-pane="download"]')),Dn(t.querySelector("#urppp-plugin-manage"))}function ol(t){let e=t.querySelector("[data-add-local-plugin]"),r=t.querySelector("[data-local-plugin-file]");!e||!r||(e.addEventListener("click",()=>r.click()),r.addEventListener("change",async()=>{let a=r.files&&r.files[0];if(!a)return;let p=await a.text();r.value="";try{new Function(p)()}catch(i){Le("本地插件加载失败："+(i&&i.message?i.message:i),"error")}try{Dn(t.querySelector("#urppp-plugin-manage"))}catch{}}))}function nl(t){if(!t)return;let e=t.querySelector("#urppp-theme-store");e&&!e.dataset.bound&&(e.dataset.bound="1",e.addEventListener("click",()=>Va("theme")));let r=t.querySelector("#urppp-skin-list");if(!r)return;let a=ee();if(r.innerHTML="",!d||!d.length){r.innerHTML='<p class="urppp-set-tip">暂无可用风格</p>';return}let p=ye(),i=d.filter(s=>s.installed!==!1||ce(s.id)).concat(Object.keys(p).filter(s=>!d.some(u=>u.id===s)).map(s=>({id:s,name:p[s].name||s,desc:p[s].desc||"本地主题",version:p[s].version||"1.0.0",installed:!1})));i.forEach(s=>{let u=!!p[s.id],m=document.createElement("div");m.className="urppp-skin-card"+(s.id===a?" is-active":""),m.dataset.skin=s.id;let w=document.createElement("button");w.type="button",w.className="urppp-skin-apply";let q=s.installed!==!1||ce(s.id)||u;q?s.id===a&&(s.ready||u)?(w.classList.add("is-current"),w.textContent="使用中",w.disabled=!0):w.textContent="应用主题":(w.classList.add("is-disabled"),w.textContent="去下载"),w.addEventListener("click",$=>{if($.preventDefault(),$.stopPropagation(),!q){Va("theme");return}if(!(s.id===a&&s.ready)&&tn(s.id)){Dt();try{window.__urpppCleanMode&&window.__urpppCleanMode.inject&&window.__urpppCleanMode.inject()}catch{}}}),m.innerHTML=['<div class="urppp-skin-name"></div>','<p class="urppp-skin-desc"></p>'].join(""),m.querySelector(".urppp-skin-name").textContent=s.name,m.querySelector(".urppp-skin-desc").textContent=s.desc,m.appendChild(w);try{let $="";try{$=GM_getValue("urppp_card_css_"+s.id,"")||""}catch{}if($){let M=document.createElement("style");M.textContent=$,m.appendChild(M)}}catch{}r.appendChild(m)});try{let s=i.map(u=>{let m="";try{m=GM_getValue("urppp_card_css_"+u.id,"")||""}catch{}return{id:u.id,cardCss:m}});Pe(s)}catch{}}let Ve=[],eo=!1;function On(t,e,r){let a=typeof AbortController=="function"?new AbortController:null,p=a?setTimeout(()=>a.abort(),r):null;return fetch(t,{cache:"no-store",headers:e,signal:a?a.signal:void 0}).then(i=>{if(!i.ok)throw new Error("HTTP "+i.status);return i.text()}).finally(()=>{p&&clearTimeout(p)})}function pl(t,e){return new Promise((r,a)=>{try{GM_xmlhttpRequest({method:"GET",url:t,timeout:12e3,headers:e,onload:p=>{p.status>=200&&p.status<400?r(p.responseText||""):a(new Error("HTTP "+p.status))},onerror:()=>a(new Error("network error")),ontimeout:()=>a(new Error("timeout"))})}catch(p){a(p)}})}function il(t,e){let r={"Cache-Control":"no-cache"};return e&&e.range&&(r.Range=e.range),typeof GM_xmlhttpRequest=="function"?pl(t,r).catch(()=>On(t,r,12e3)):On(t,r,12e3)}async function ro(t,e,r=1e3){let a=[],p=t[0],i=t.slice(1),s=M=>il(M,e).then(j=>({url:M,text:j})).catch(j=>(a.push((M.split("/")[2]||M)+": "+(j&&j.message||j)),null)),u=s(p),m=new Promise(M=>setTimeout(()=>M("__TIMEOUT__"),r)),w=await Promise.race([u,m]);if(w!=="__TIMEOUT__"){if(w&&w.text&&w.text.length>0)return w.text;let j=(await Promise.all(i.map(s))).find(Y=>Y&&Y.text&&Y.text.length>0);if(j)return j.text;throw new Error("所有更新源均不可用（"+a.join("; ")+"）")}let q=Promise.all(i.map(s)).then(M=>{let j=M.find(Y=>Y&&Y.text&&Y.text.length>0);if(j)return j.text;throw new Error("所有更新源均不可用（"+a.join("; ")+"）")}),$=u.then(M=>{if(M&&M.text&&M.text.length>0)return M.text;throw new Error("主源内容无效")}).catch(()=>new Promise(()=>{}));return Promise.race([$,q])}function qe(t,e){let r=document.getElementById("urppp-set-update-status");r&&(r.dataset.locked=t?"1":"",r.innerHTML=t||"",r.style.color=e==="err"?"#b91c1c":e==="ok"?"#15803d":"var(--text-muted)")}async function ao(){let t=o,e="",r=!1,a="";try{let i=await ro(n.sourceUrls(n.versionJson)),s=JSON.parse(i);e=String(s&&s.version||"").trim(),s&&String(s.prevVersion||"").trim()===t&&(r=!0),s&&typeof s.changelog=="string"&&s.changelog.trim()&&(a=s.changelog)}catch{}if(!e){let i=await ro(n.sourceUrls("urppp.user.js"),{range:"bytes=0-2048"});e=_o(i)}if(!e)throw new Error("无法解析远程主插件版本");let p=Lr(e,t);return{id:"main",name:"主插件",local:t,remote:e,status:p>0?"update":p===0?"latest":"ahead",updateUrl:n.mainRaw,pageUrl:n.greasySearch,changelogMd:r?a:""}}function Rn(t,e,r){let a=String(t||"").replace(/\r\n/g,`
`);if(!a.trim())return"";let p=/^##\s*\[?v?([0-9]+(?:\.[0-9]+){0,3}[\w\-]*)\]?[^\n]*$/gim,i=[],s;for(;(s=p.exec(a))!==null;)i.push({ver:s[1],index:s.index,headEnd:p.lastIndex});if(!i.length)return"";for(let m=0;m<i.length;m++){let w=m+1<i.length?i[m+1].index:a.length;i[m].body=a.slice(i[m].index,w).trim()}let u=[];for(let m of i)Lr(m.ver,r)>0||Lr(m.ver,e)<=0||u.push(m.body);return u.join(`

`).trim()}function Hn(){let t=document.getElementById("urppp-update-toast-style");t&&t.remove();let e=document.createElement("style");e.id="urppp-update-toast-style",e.textContent=`
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
    `,document.documentElement.appendChild(e)}function sl(t){let e=String(t||"").replace(/\r\n/g,`
`).trim();if(!e)return'<p class="uuc-meta">暂无更新日志</p>';let r=u=>{let m=Z(u);return m=m.replace(/`([^`]+)`/g,"<code>$1</code>"),m=m.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>"),m=m.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'),m=m.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g,'$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>'),m},a=e.split(`
`),p=[],i=!1,s=()=>{i&&(p.push("</ul>"),i=!1)};for(let u=0;u<a.length;u++){let w=a[u].replace(/\s+$/,"");if(!w.trim()){s();continue}let q=w.match(/^(#{2,3})\s+(.+)$/);if(q){s();let M=q[1].length,j=q[2];p.push(M===2?`<h2>${r(j)}</h2>`:`<h3>${r(j)}</h3>`);continue}let $=w.match(/^[-*]\s+(.+)$/);if($){i||(p.push("<ul>"),i=!0),p.push(`<li>${r($[1])}</li>`);continue}s(),p.push(`<p>${r(w)}</p>`)}return s(),p.join("")||'<p class="uuc-meta">暂无更新日志</p>'}function Un(t){let e=t||document.getElementById("urppp-update-toast");if(!e||!e.classList.contains("open")){e&&e.classList.remove("open","closing");return}if(e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",a)},a=p=>{p&&p.target!==e||p&&p.propertyName&&p.propertyName!=="opacity"&&p.propertyName!=="transform"||r()};e.addEventListener("transitionend",a),setTimeout(r,380)}function ll(t){let e=t||document.getElementById("urppp-update-changelog");if(!e||!e.classList.contains("open")&&!e.classList.contains("closing")||e.__closing)return;e.__closing=!0,e.classList.add("closing"),e.classList.remove("open");let r=()=>{e.classList.remove("closing"),e.__closing=!1,e.removeEventListener("transitionend",a)},a=p=>{p&&p.target!==e||p&&p.propertyName&&p.propertyName!=="opacity"&&p.propertyName!=="background-color"&&p.propertyName!=="background"||r()};e.addEventListener("transitionend",a),setTimeout(r,360)}function Wn(t,e){Hn();let r=document.getElementById("urppp-update-changelog");r||(r=document.createElement("div"),r.id="urppp-update-changelog",r.innerHTML=`
        <div class="uuc-panel" role="dialog" aria-modal="true" aria-label="更新日志">
          <div class="uuc-head">
            <h3></h3>
            <button type="button" class="uut-btn ghost" data-close="1">关闭</button>
          </div>
          <div class="uuc-body"></div>
        </div>`,r.addEventListener("click",a=>{(a.target===r||a.target&&a.target.getAttribute&&a.target.getAttribute("data-close")==="1")&&ll(r)}),document.documentElement.appendChild(r)),r.querySelector("h3").textContent=t||"更新日志",r.querySelector(".uuc-body").innerHTML=e||'<p class="uuc-meta">暂无更新日志</p>',r.__closing=!1,r.classList.remove("open","closing"),r.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>r.classList.add("open"))})}function oo(t){Hn();let e=document.getElementById("urppp-update-toast");e||(e=document.createElement("div"),e.id="urppp-update-toast",e.innerHTML=`
        <button type="button" class="uut-close" aria-label="关闭">×</button>
        <div class="uut-title"></div>
        <div class="uut-sub"></div>
        <div class="uut-actions">
          <button type="button" class="uut-btn" data-act="log">更新日志</button>
          <button type="button" class="uut-btn primary" data-act="go">去更新</button>
          <button type="button" class="uut-btn ghost" data-act="later">稍后</button>
        </div>`,e.querySelector(".uut-close").addEventListener("click",()=>Un(e)),e.addEventListener("click",async r=>{let a=r.target&&r.target.closest?r.target.closest("[data-act]"):null;if(!a)return;let p=a.getAttribute("data-act"),i=e.__pack||{};if(p==="later"){Un(e);return}if(p==="go"){let s=i.updateUrl||n.mainRaw;try{window.open(s,"_blank","noopener,noreferrer")}catch{location.href=s}return}if(p==="log"){a.disabled=!0,a.textContent="加载中…";try{let s=i.changelogMd;s||(s=await ro(n.sourceUrls("CHANGELOG.md")),i.changelogMd=s);let u=Rn(s,i.local,i.remote),m=u?sl(u):'<p class="uuc-meta">未找到区间日志。</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开完整 CHANGELOG</a></p>';Wn("更新日志 "+i.local+" → "+i.remote,m)}catch(s){Wn("更新日志","<p>加载失败："+Z(s&&s.message||s)+'</p><p><a href="'+n.changelogPage+'" target="_blank" rel="noopener noreferrer">打开 GitHub CHANGELOG</a></p>')}finally{a.disabled=!1,a.textContent="更新日志"}}}),document.documentElement.appendChild(e)),e.__pack=t||{},e.querySelector(".uut-title").textContent="发现新版本 "+(t&&t.remote||""),e.querySelector(".uut-sub").textContent="当前 "+(t&&t.local||"")+" · 主插件可更新",e.__closing=!1,e.classList.remove("open","closing"),e.offsetWidth,requestAnimationFrame(()=>{requestAnimationFrame(()=>e.classList.add("open"))})}async function no(){if(La()&&!window.__urpppAutoUpdateTried){window.__urpppAutoUpdateTried=!0;try{let t=await ao();t&&t.status==="update"&&oo(t);let e=await cl();if(e)try{console.log("[URP++] 辅助插件热更新到",e.version)}catch{}}catch(t){try{console.debug("[URP++] auto update check failed",t)}catch{}}}}function cl(){let t=(window.__urpppUpdateCheckers||Ve||[]).find(e=>e&&e.id==="assist");return!t||typeof t.check!="function"?Promise.resolve(null):Promise.resolve().then(()=>t.check()).then(e=>e&&e.status==="update"?_t.update("assist"):null).catch(()=>null)}async function po(){if(eo)return;eo=!0;let t=document.getElementById("urppp-set-check-update");t&&(t.disabled=!0,t.textContent="检查中…"),qe("正在从多源检查更新…");try{let e=[ao()];(Ve||[]).forEach(m=>{m&&typeof m.check=="function"&&e.push(Promise.resolve().then(()=>m.check()).then(w=>w||{id:m.id||"extra",name:m.name||"扩展",status:"err",message:"无结果"}).catch(w=>({id:m.id||"extra",name:m.name||"扩展",status:"err",message:String(w&&w.message||w)})))});let r=await Promise.all(e),a=r.map(m=>{if(!m)return"";if(m.status==="err")return`• <b>${Z(m.name||m.id)}</b>：检查失败（${Z(m.message||"unknown")}）`;if(m.status==="update"){let w="";if(m.id==="assist"&&_t&&_t.loaded("assist"))w=' <a class="urppp-update-relaunch" href="javascript:void(0)" data-urppp-relaunch="assist" rel="nofollow">重新装载</a>';else{let q=m.updateUrl?` <a href="${Z(m.updateUrl)}" target="_blank" rel="noopener noreferrer">打开更新源</a>`:"",$=m.pageUrl?` <a href="${Z(m.pageUrl)}" target="_blank" rel="noopener noreferrer">Greasy Fork</a>`:"";w=q+$}return`• <b>${Z(m.name)}</b>：发现新版本 <b>${Z(m.remote)}</b>（当前 ${Z(m.local)}）${w}`}return m.status==="ahead"?`• <b>${Z(m.name)}</b>：本地 ${Z(m.local)} 新于远程 ${Z(m.remote)}`:`• <b>${Z(m.name)}</b>：已是最新（${Z(m.local)}）`}).filter(Boolean),p=r.some(m=>m&&m.status==="update"),i=r.some(m=>m&&m.status==="err");qe(`${p?"检查完成：发现更新":i?"检查完成：部分失败":"检查完成：全部最新"}<br>${a.join("<br>")}<br><span style="opacity:.85">仓库：<a href="${n.repo}" target="_blank" rel="noopener noreferrer">SCU-URP-plusplus</a></span>`,i?"err":"ok");let u=document.querySelector('#urppp-set-update-status .urppp-update-relaunch[data-urppp-relaunch="assist"]');u&&u.addEventListener("click",()=>{try{qe("正在重新装载辅助插件…",""),_t.install("assist").then(()=>{qe("辅助插件已重新装载，刷新页面后生效。","ok")}).catch(m=>{qe("重新装载失败："+(m&&m.message?m.message:m),"err")})}catch(m){qe("重新装载失败："+(m&&m.message?m.message:m),"err")}})}catch(e){qe("检查失败："+Z(e&&e.message||e),"err")}finally{eo=!1,t&&(t.disabled=!1,t.textContent="检查更新")}}function Gn(){let t=document.getElementById("urppp-set-update-status");if(!t||t.dataset.locked==="1")return;let e="当前主插件："+o,r=t.getAttribute("data-assist-version")||"";r&&(e+="；辅助插件："+r),t.textContent=e,t.style.color="var(--text-muted)"}function dl(t){if(!t||typeof t.check!="function")return!1;let e=String(t.id||t.name||"").trim();if(!e)return!1;let r=Ve.findIndex(p=>p&&p.id===e),a={id:e,name:t.name||e,check:t.check,localVersion:t.localVersion||""};r>=0?Ve[r]=a:Ve.push(a);try{let p=document.getElementById("urppp-set-update-status");p&&a.localVersion&&e==="assist"&&p.setAttribute("data-assist-version",String(a.localVersion))}catch{}try{Gn()}catch{}return!0}function ul(){let t={version:o,urls:n,check:po,checkMain:ao,registerChecker:dl,compareVersions:Lr,parseUserscriptVersion:_o,extractChangelogRange:Rn,showUpdateToast:oo,maybeAutoCheckUpdate:no,listCheckers:()=>Ve.slice()};try{window.__urpppUpdate=t}catch{}try{typeof unsafeWindow<"u"&&unsafeWindow&&(unsafeWindow.__urpppUpdate=t)}catch{}return t}ul();let{rebuildSidebarCompletely:Jn,syncMobileContentOffset:Ye,syncSidebarUnderNavbar:Te}=ds({}),{rebuildDashboard:ml}=es({deps:{statCardPrivacyMarkup:vl}}),bl="urppp-clean-open",io={100:4,99:4,98:4,97:4,96:4,95:4,94:3.9,93:3.8,92:3.7,91:3.6,90:3.5,89:3.4,88:3.3,87:3.2,86:3.1,85:3,84:2.9,83:2.8,82:2.7,81:2.6,80:2.5,79:2.4,78:2.3,77:2.2,76:2.1,75:2,74:1.9,73:1.8,72:1.7,71:1.6,70:1.5,69:1.4,68:1.3,67:1.2,66:1.1,65:1,64:.9,63:.8,62:.7,61:.6,60:.5};function ue(t){if(t==null||t==="")return!1;let e=String(t).trim();if(!e)return!1;if(/未评估|未评教|待评估|待评教/.test(e))return!0;let r=Number(e);return!Number.isNaN(r)&&r<0}function ra(t){if(t==null||t==="")return!1;let e=Number(t);return!Number.isNaN(e)&&e>=0&&e<=5}function aa(t){let e=String(t||"").trim();if(!e)return"";let r=e.match(/[\u4e00-\u9fffA-Za-z0-9]/);return r?r[0]:e.charAt(0)}function so(t,e){let r=String(t||""),a=Number(e)||0;return!r||a<=0||a>r.length?!1:r.charAt(a-1)==="1"}function Qe(t){if(t==null||t==="")return null;let e=String(t).trim();if(!e||ue(e)||/^免修$|^通过$|^取消$|^缓考$|^旷考$|^缺考$/.test(e))return null;if(/^A\+$/i.test(e)||/^A$/i.test(e))return 4;if(/^A-$/i.test(e))return 3.7;if(/^B\+$/i.test(e))return 3.3;if(/^B$/i.test(e))return 3;if(/^B-$/i.test(e))return 2.7;if(/^C\+$/i.test(e))return 2.3;if(/^C$/i.test(e))return 2;if(/^C-$/i.test(e))return 1.7;if(/^D$/i.test(e))return 1.3;if(/^F$/i.test(e))return 0;if(/优秀/.test(e))return 4;if(/良好/.test(e))return 3;if(/中等/.test(e))return 2;if(/及格/.test(e)&&!/不及格/.test(e))return 1;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 1;let r=parseFloat(e.replace(/[^\d.]/g,""));if(Number.isNaN(r)||r<0)return null;let a=Math.round(r);return a<60?0:a>100?4:io[a]!=null?io[a]:io[Math.max(60,Math.min(100,Math.floor(r)))]||0}function Ke(t){let e=String(t||"").trim();if(!e||ue(e))return null;if(/优秀/.test(e))return 95;if(/良好/.test(e))return 85;if(/中等/.test(e))return 75;if(/及格/.test(e)&&!/不及格/.test(e))return 65;if(/不及格|不合格|不通过/.test(e))return 0;if(/合格/.test(e))return 70;if(/^A/i.test(e))return 95;if(/^B/i.test(e))return 85;if(/^C/i.test(e))return 75;if(/^D/i.test(e))return 65;if(/^F/i.test(e))return 0;let r=parseFloat(e.replace(/[^\d.]/g,""));return Number.isNaN(r)||r<0?null:r}function Me(t){return Math.round((Number(t)||0)*100)/100}function Vn(t){return/必修/.test(String(t||""))}function oe(t){let e=0,r=0,a=0,p=0,i=0,s=0,u=0,m=0;return(t||[]).forEach(w=>{if(w&&(w.unevaluated||ue(w.score)))return;let q=Number(w.credit)||0,$=Ke(w.score),M=ra(w.officialGpa)?Number(w.officialGpa):Qe(w.score);$==null||q<=0||(e+=q,r+=$*q,M!=null&&(a+=M*q,p+=q),w.required&&(i+=q,s+=$*q,M!=null&&(u+=M*q,m+=q)))}),{totalCredit:Me(e),avgScore:Me(e?r/e:0),avgGpa:Me(p?a/p:0),requiredCredit:Me(i),requiredGpa:Me(m?u/m:0),requiredAvg:Me(i?s/i:0),count:(t||[]).length}}function lo(t){let e=String(t||"");return/^https?:\/\//i.test(e)?e:e.startsWith("//")?location.protocol+e:e.startsWith("/")?location.origin+e:location.origin+"/"+e.replace(/^\.\//,"")}function Qt(t,e){let r=lo(t),a=e&&e.method||"GET",p=e&&e.data||null;return new Promise((i,s)=>{let u=(m,w)=>m?i(w):s(new Error(w||"fetch failed"));try{if(typeof GM_xmlhttpRequest=="function"){GM_xmlhttpRequest({method:a,url:r,data:p||void 0,headers:e&&e.headers?e.headers:{},withCredentials:!0,onload:m=>{m.status>=200&&m.status<400?u(!0,m.responseText||""):u(!1,"HTTP "+m.status)},onerror:()=>u(!1,"network error")});return}}catch{}fetch(r,{method:a,credentials:"include",cache:"no-store",headers:e&&e.headers?e.headers:{},body:p||void 0}).then(m=>{if(!m.ok)throw new Error("HTTP "+m.status);return m.text()}).then(m=>u(!0,m)).catch(m=>u(!1,m&&m.message))})}function oa(t){return new DOMParser().parseFromString(String(t||""),"text/html")}function Yn(){if(document.getElementById("urppp-feature-style"))return;let t=document.createElement("style");t.id="urppp-feature-style",t.textContent=zi,(document.head||document.documentElement).appendChild(t)}function hl(){if(document.getElementById("urppp-schedule-export-style"))return;let t=document.createElement("style");t.id="urppp-schedule-export-style",t.textContent=Ti,(document.head||document.documentElement).appendChild(t)}function fl(){if(document.getElementById("urppp-settings-style"))return;let t=document.createElement("style");t.id="urppp-settings-style",t.textContent=Mi,(document.head||document.documentElement).appendChild(t)}function co(){if(document.getElementById("urppp-dashboard-style"))return;let t=document.createElement("style");t.id="urppp-dashboard-style",t.textContent=Bi,(document.head||document.documentElement).appendChild(t)}function uo(){if(document.getElementById("urppp-schedule-card-style"))return;let t=document.createElement("style");t.id="urppp-schedule-card-style",t.textContent=qi,(document.head||document.documentElement).appendChild(t)}function Qn(){if(document.getElementById("urppp-mobile-style"))return;let t=document.createElement("style");t.id="urppp-mobile-style",t.textContent=Di,(document.head||document.documentElement).appendChild(t)}function gl(){try{Rr()&&co()}catch{}try{kr(location)&&uo()}catch{}}function xl(){if(window.__urpppDeferredStylesDone)return;window.__urpppDeferredStylesDone=!0;let t=()=>{try{Qn()}catch{}try{co()}catch{}try{uo()}catch{}};try{typeof window.requestIdleCallback=="function"?window.requestIdleCallback(t,{timeout:4e3}):setTimeout(t,2200)}catch{setTimeout(t,2200)}}function Kn(t){let r=(t&&t.querySelector?t:document).querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(!r)return null;let a=r.querySelector(".urppp-user-name-value");if(a)return a;let p=r.cloneNode(!0);p.querySelectorAll("small, i, img, b, .badge").forEach(u=>u.remove());let i=(p.textContent||"").replace(/^\s*欢迎您[，,]?\s*/g,"").replace(/\s+/g," ").trim();Array.from(r.childNodes).forEach(u=>{u.nodeType===Node.TEXT_NODE&&u.textContent.trim()&&u.remove()});let s=document.createElement("span");return s.className="urppp-user-name-value",s.textContent=i||"同学",s.__urpppOriginalText=s.textContent,r.appendChild(s),s}function na(t){let e=String(t||"").replace(/[\s:：]/g,"");return e?/姓名|英文姓名|姓名拼音/.test(e)?"name":/学号|证件|身份证|护照|证书编号|考生号|录取号|学籍号/.test(e)?"identity":/学院|院系|专业|班级|年级|主修方案|培养方案|专业方向|分流方向|毕业中学/.test(e)?"organization":/电话|手机|电子邮件|邮箱|QQ|地址|家长|个人主页|出生日期|入学日期|乘车区间|性别|籍贯|民族|政治面貌|国籍|户口|户籍|生源|出生地|健康|宗教|血型|婚姻|联系人|家庭/.test(e)?"contact":/绩点|GPA/.test(e)?"gpa":/学分/.test(e)?"credit":/成绩|分数|高考总分|均分|平均分|必修平均|课程门数|及格课程|不及格课程|待修读课程|已修读课程/.test(e)?"grade":/课表|日程安排/.test(e)?"schedule":"":""}function yl(t,e){let r=String(t||"")+" "+String(e||"");return/绩点|GPA/.test(r)?"majorGpa":/主修为|培养方案|方案/.test(r)?"majorPlan":/尚不及格|未及格/.test(r)?"failedCourses":/待修读课程/.test(r)?"remainingCourses":/已修读课程/.test(r)?"completedCourses":""}function pa(t,e,r){let a=e?` data-urppp-edit-key="${e}"`:"";return`<span class="urppp-private-value" data-urppp-private="${t}"${a}>${r}</span>`}function vl(t,e){let r=Z(t),a=Z(e),p=yl(t,e),s={completedCourses:"other",failedCourses:"other",majorGpa:"gpa",majorPlan:"organization",remainingCourses:"other"}[p]||na(String(t||"")+" "+String(e||""));if(s==="organization")return e?{valueHtml:r,labelHtml:pa("organization",p,a)}:{valueHtml:pa("organization",p,r),labelHtml:a};if(!["grade","gpa","credit","other"].includes(s))return{valueHtml:r,labelHtml:a};let u=String(e||"").match(/-?\d+(?:\.\d+)?/);if(!(/^-?\d+(?:\.\d+)?$/.test(String(t||"").trim())||/^(优秀|良好|中等|及格|不及格|合格|不合格)$/.test(String(t||"").trim()))&&u){let w=u.index||0,q=String(e).slice(0,w),$=String(e).slice(w+u[0].length);return{valueHtml:r,labelHtml:`${Z(q)}${pa(s,p,Z(u[0]))}${Z($)}`}}return{valueHtml:pa(s,p,r),labelHtml:a}}function Ie(t,e){if(!t||t.mode==="off")return"";if(t.mode==="one")return t.mask||$r;if(e==="name")return"";let r=t.fields&&t.fields[e];return!r||!r.enabled?"":String(r.replacement||t.mask||$r)}function wr(t,e){if(!(!t||!e)&&!(t.querySelector&&t.querySelector("input,select,textarea,button"))){if(!t.classList.contains("urppp-private-text")){let r=getComputedStyle(t).fontSize;r&&r!=="0px"&&t.style.setProperty("--urppp-private-font-size",r)}t.classList.add("urppp-private-text"),t.setAttribute("data-urppp-private-mask",e)}}function Zn(t,e){if(!t||!t.parentElement)return;let r=t.parentElement;t.classList.add("urppp-private-avatar"),r.classList.add("urppp-private-avatar-host"),r.setAttribute("data-urppp-private-mask",e||$r);let a=t.getBoundingClientRect();r.style.setProperty("--urppp-avatar-left",t.offsetLeft+"px"),r.style.setProperty("--urppp-avatar-top",t.offsetTop+"px"),r.style.setProperty("--urppp-avatar-width",Math.max(1,a.width)+"px"),r.style.setProperty("--urppp-avatar-height",Math.max(1,a.height)+"px"),r.style.setProperty("--urppp-avatar-radius",getComputedStyle(t).borderRadius||"50%")}function wl(t,e){if(!t||!e)return;let r=t.matches("table")&&t.closest(".table-responsive, .urppp-table-wrap")||t;r.classList.add("urppp-private-block"),r.setAttribute("data-urppp-private-mask",e)}function kl(t,e){if(!(!t||!H[e])){if(!t.hasAttribute("data-urppp-direct-tabindex")){let r=t.getAttribute("tabindex");t.setAttribute("data-urppp-direct-tabindex",r??"__none__"),t.__urpppDirectTitle=t.getAttribute("title"),t.__urpppDirectAriaLabel=t.getAttribute("aria-label")}t.classList.add("urppp-direct-editable"),t.setAttribute("tabindex","0"),t.setAttribute("data-urppp-edit-key",e),t.setAttribute("aria-label","修改"+H[e]+"显示值"),t.title="点击修改显示值"}}let ke=null;function Xn(t){let e=t&&t.getAttribute("data-urppp-edit-key");if(!e||!H[e])return;ke&&ke.__finish&&ke.__finish(!1);let r=Ce();if(r.mode!=="custom"||!r.directEdit.enabled)return;let p=String(r.directEdit.values[e]||"")||t.getAttribute("data-urppp-private-mask")||String(t.textContent||"").trim(),i=t.getBoundingClientRect(),s=t.parentElement?.getBoundingClientRect(),u=i.height>=8||!s?i:{left:i.left,top:s.top,width:Math.max(i.width,40),height:s.height},m=document.createElement("input"),w=getComputedStyle(t),q=Math.min(Math.max(u.width+64,140),Math.max(140,window.innerWidth-24)),$=Math.min(Math.max(12,u.left),Math.max(12,window.innerWidth-q-12)),M=Math.min(Math.max(12,u.top+(u.height-36)/2),Math.max(12,window.innerHeight-48));m.type="text",m.maxLength=80,m.className="urppp-direct-edit-input",m.value=p,m.setAttribute("aria-label","修改"+H[e]+"显示值"),m.style.left=$+"px",m.style.top=M+"px",m.style.setProperty("--urppp-direct-edit-width",q+"px"),m.style.fontFamily=w.fontFamily,m.style.fontSize=(window.innerWidth<=520?16:Math.min(18,Math.max(13,parseFloat(w.fontSize)||14)))+"px";let j=!1,Y=O=>{if(j||(j=!0,m.remove(),ke===m&&(ke=null),O))return;let R=Ce();R.mode!=="custom"||!R.directEdit.enabled||(R.directEdit.values[e]=String(m.value||"").trim().slice(0,80),qa(R),Kt(document),go(R.directEdit.values[e]?"显示值已更新":"已恢复分类设置"))};m.__finish=Y,m.addEventListener("click",O=>O.stopPropagation()),m.addEventListener("blur",()=>Y(!1)),m.addEventListener("keydown",O=>{O.key==="Enter"&&(O.preventDefault(),Y(!1)),O.key==="Escape"&&(O.preventDefault(),Y(!0))}),document.documentElement.appendChild(m),ke=m,m.focus(),m.select()}function Al(){document.__urpppDirectEditBound||(document.__urpppDirectEditBound=!0,document.addEventListener("click",t=>{let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),Xn(e))},!0),document.addEventListener("keydown",t=>{if(!["Enter"," "].includes(t.key))return;let e=t.target?.closest?.(".urppp-direct-editable");e&&(t.preventDefault(),t.stopPropagation(),Xn(e))},!0))}function Sl(t){let e=t&&t.querySelectorAll?t:document;e.querySelectorAll(".urppp-direct-editable").forEach(r=>{let a=r.getAttribute("data-urppp-direct-tabindex");r.classList.remove("urppp-direct-editable"),r.removeAttribute("data-urppp-direct-tabindex"),a==="__none__"?r.removeAttribute("tabindex"):a!=null&&r.setAttribute("tabindex",a),r.__urpppDirectTitle==null?r.removeAttribute("title"):r.setAttribute("title",r.__urpppDirectTitle),r.__urpppDirectAriaLabel==null?r.removeAttribute("aria-label"):r.setAttribute("aria-label",r.__urpppDirectAriaLabel),delete r.__urpppDirectTitle,delete r.__urpppDirectAriaLabel}),e.querySelectorAll(".urppp-private-text").forEach(r=>{r.classList.remove("urppp-private-text"),r.removeAttribute("data-urppp-private-mask"),r.style.removeProperty("--urppp-private-font-size")}),e.querySelectorAll(".urppp-private-avatar").forEach(r=>r.classList.remove("urppp-private-avatar")),e.querySelectorAll(".urppp-private-avatar-host").forEach(r=>{r.classList.remove("urppp-private-avatar-host"),r.removeAttribute("data-urppp-private-mask"),["--urppp-avatar-left","--urppp-avatar-top","--urppp-avatar-width","--urppp-avatar-height","--urppp-avatar-radius"].forEach(a=>r.style.removeProperty(a))}),e.querySelectorAll(".urppp-private-avatar-block").forEach(r=>{r.classList.remove("urppp-private-avatar-block"),r.removeAttribute("data-urppp-private-mask")}),e.querySelectorAll(".urppp-private-block").forEach(r=>{r.classList.remove("urppp-private-block"),r.removeAttribute("data-urppp-private-mask")})}function tp(t,e,r){if(!t||t.matches?.("input,select,textarea,button")||t.querySelector?.("input,select,textarea,button"))return;if(t.__urpppOriginalText==null){if(!e)return;t.__urpppOriginalText=t.textContent||""}let a=e&&r?r:t.__urpppOriginalText;t.textContent!==a&&(t.textContent=a)}function _l(t){let e=t&&t.querySelectorAll?t:document,r=je(),p=e.querySelector?.(".urppp-user-name-value")||(r.nameEnabled?Kn(e):null);tp(p,r.nameEnabled,r.name),e.querySelectorAll(".profile-info-row").forEach(u=>{let m=u.querySelector(".profile-info-name"),w=u.querySelector(".profile-info-value");!m||!w||String(m.textContent||"").replace(/[\s:：]/g,"")!=="姓名"||tp(w,r.nameEnabled,r.name)});let i=lr(r.avatar),s=r.avatarEnabled&&!!i;e.querySelectorAll("#navbar img.nav-user-photo, #urppp-mobile-user img.nav-user-photo, img#avatar, .profile-picture img").forEach(u=>{let m=u.getAttribute("src")||"";m&&m!==u.__urpppAppliedCustomSrc&&(u.__urpppOriginalSrc=m),s?(u.__urpppOriginalSrc==null&&(u.__urpppOriginalSrc=m),m!==i&&u.setAttribute("src",i),u.__urpppAppliedCustomSrc=i):u.__urpppAppliedCustomSrc!=null&&(u.__urpppOriginalSrc&&u.setAttribute("src",u.__urpppOriginalSrc),delete u.__urpppAppliedCustomSrc)})}function El(t,e){t.querySelectorAll(".profile-info-row").forEach(r=>{let a=r.querySelector(".profile-info-name, th, label"),p=r.querySelector(".profile-info-value, td:last-child");if(!a||!p||a===p)return;let i=na(a.textContent),s=Ie(e,i);s&&wr(p,s)})}function Cl(t,e){t.querySelectorAll("table").forEach(r=>{let a=Array.from(r.querySelectorAll("thead th, thead td, tr:first-child th, tr:first-child td"));if(!a.length)return;let p=a.map(i=>{let s=na(i.textContent);return["grade","gpa","credit"].includes(s)?s:""});p.some(Boolean)&&r.querySelectorAll("tbody tr").forEach(i=>{let s=i.querySelectorAll("td");p.forEach((u,m)=>{let w=Ie(e,u);u&&w&&wr(s[m],w)})})})}function Pl(t){let e=t&&t.querySelectorAll?t:document,r=Ce();if(r.mode==="off")return;let a=Ie(r,"name"),p=Ie(r,"avatar"),i=Ie(r,"schedule"),s=a?Kn(e):e.querySelector?.(".urppp-user-name-value");a&&wr(s,a),[["#courseNum, #coursePas, #xy_kcms","other"],["#gpa","gpa"],["#bottom","organization"]].forEach(([w,q])=>{let $=Ie(r,q);$&&e.querySelectorAll(w).forEach(M=>wr(M,$))}),Cl(e,r);let m=r.mode==="custom"&&r.directEdit.enabled;if(e.querySelectorAll("[data-urppp-private]").forEach(w=>{let q=w.getAttribute("data-urppp-private"),$=w.getAttribute("data-urppp-edit-key"),j=(m&&$?String(r.directEdit.values[$]||"").trim():"")||Ie(r,q);!["avatar","schedule"].includes(q)&&j&&wr(w,j),m&&$&&kl(w,$)}),m&&Al(),El(e,r),p&&(e.querySelectorAll('[data-urppp-private="avatar"]').forEach(w=>{let q=w.matches("img")?w:w.querySelector("img");q?Zn(q,p):(w.classList.add("urppp-private-avatar-block"),w.setAttribute("data-urppp-private-mask",p))}),e.querySelectorAll("#navbar img.nav-user-photo, img#avatar, .profile-picture img, .uc-avatar img").forEach(w=>Zn(w,p))),i){let w=Array.from(e.querySelectorAll('[data-urppp-private="schedule"], #main-calendar, #courseTable'));w.filter(q=>!w.some($=>$!==q&&$.contains(q))).forEach(q=>wl(q,i))}}let mo=0,me=[];function ep(){let t=Ce(),e=je();return t.mode!=="off"||e.nameEnabled||e.avatarEnabled}function zl(){me=me.filter(({root:t})=>t&&t.isConnected),me.forEach(({root:t,observer:e})=>e.observe(t,{childList:!0,subtree:!0}))}function Kt(t){let e=t||document;me.forEach(({observer:r})=>r.disconnect());try{Yn()}catch{}try{Sl(e)}catch{}try{_l(e)}catch(r){console.warn("[URP++] custom identity",r)}try{Pl(e)}catch(r){console.warn("[URP++] privacy",r)}ep()?(zl(),ql()):(clearTimeout(mo),me=[])}function Ll(t){clearTimeout(mo),mo=setTimeout(()=>Kt(t||document),140)}function bo(){try{ot&&ot.open&&ar()}catch{}}function ql(){if(!ep()){me.forEach(({observer:t})=>t.disconnect()),me=[];return}[document.getElementById("navbar"),document.getElementById("page-content-template"),document.getElementById("urppp-clean-root")].filter(Boolean).forEach(t=>{if(me.some(r=>r.root===t))return;let e=new MutationObserver(()=>Ll(document));me.push({root:t,observer:e}),e.observe(t,{childList:!0,subtree:!0})})}function Tl(t){let e=Object.assign({},t||{}),r=je();r.nameEnabled&&r.name&&(e.name=r.name);let a=lr(r.avatar);return r.avatarEnabled&&a&&(e.avatar=a),e}let rp="/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback",Ml="/student/courseSelect/thisSemesterCurriculum/callback",Il="/student/courseSelect/thisSemesterCurriculum/index";async function $l(){let t=document.querySelector("#planCode, #zxjxjhh");if(t&&t.value&&t.value!=="no")return String(t.value);try{let e=new URLSearchParams(location.search),r=e.get("planCode")||e.get("zxjxjhh");if(r)return r}catch{}if(ot&&ot.schedule&&ot.schedule.exportData){let e=ot.schedule.exportData.semester&&ot.schedule.exportData.semester.planCode;if(e)return e}if(/\/student\/courseSelect\/courseSelectResult\//.test(location.pathname))try{let e=await Qt(Ml),r=JSON.parse(e),a=sr(r);if(a)return a}catch{}return""}async function ap(t){let e=await $l(),r=e?{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}}:null,a=await Qt(rp,r),p;try{p=JSON.parse(a)}catch{throw new Error("课表接口返回了非 JSON 内容，请刷新教务页面后重试")}e||(e=sr(p)),(!p.jcsjbs||!p.jcsjbs.length)&&e&&(p=JSON.parse(await Qt(rp,{method:"POST",data:"planCode="+encodeURIComponent(e),headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}})));let i=np(p,e,t);if(!i.courses.length)throw new Error("没有读取到可导出的课表数据");return i}function ho(t){return String(t||"学生课表").replace(/[\\/:*?"<>|]+/g,"-").replace(/\s+/g,"").slice(0,80)||"学生课表"}function fo(t,e){let r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download=e,a.style.display="none",document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(r),1200)}function Nl(t){let e=ba(t),r=Or(),a=r.enabled?fa(e,r.mapping):ha(e),p=JSON.stringify(a,null,2)+`
`;return fo(new Blob([p],{type:"application/json;charset=utf-8"}),ho(t.semester.label)+".json"),Object.assign({customFormat:r.enabled},e.stats)}function op(t){let r=(Array.from(document.querySelectorAll(".span_bbzx")).map(s=>s.textContent||"").join(" ")+" "+(document.querySelector("#navbar")?.textContent||"")).replace(/\s+/g," ").match(/(\d{4})-(\d{4})\s*(春|秋).*?第\s*(\d{1,2})\s*周/);if(!r)return"";let a=r[3]==="秋"?"1":"2";if(t&&!String(t).startsWith(r[1]+"-"+r[2]+"-"+a))return"";let p=Number(r[4]);if(p<1||p>30)return"";let i=To(new Date);return i.setDate(i.getDate()-(p-1)*7),Ir(i)}function np(t,e,r){let a=e||sr(t),p=op(a)||Ta()[a]||"";return Yp(t,a,r,{firstMonday:p})}function Bl(t){let e=t.semester.planCode,r=Ta()[e],a=op(e);return a?(Go(e,a),Promise.resolve(a)):ir(r)?Promise.resolve(r):new Promise((p,i)=>{document.querySelector('.urppp-dialog-mask[data-dialog="schedule-date"]')?.remove();let s=document.createElement("div");s.className="urppp-dialog-mask",s.dataset.dialog="schedule-date",s.innerHTML=`<div class="urppp-dialog" role="dialog" aria-modal="true"><h3>确认第一教学周周一</h3><p>${Z(t.semester.label)}没有可可靠推导的起始日期。该日期决定 ICS 中每节课的实际日历时间；预填值仅为估算，请对照校历核对。</p><input type="date" value="${Z(r||Up(e))}"><div class="urppp-dialog-actions"><button type="button" class="urppp-set-btn ghost" data-action="cancel">取消</button><button type="button" class="urppp-set-btn" data-action="ok">确认并导出</button></div></div>`,document.documentElement.appendChild(s);let u=(m,w)=>{s.remove(),m?i(m):p(w)};s.querySelector('[data-action="cancel"]').addEventListener("click",()=>u(new Error("已取消导出"))),s.querySelector('[data-action="ok"]').addEventListener("click",()=>{let m=s.querySelector("input").value;ir(m)&&(Go(e,m),u(null,m))}),s.addEventListener("click",m=>{m.target===s&&u(new Error("已取消导出"))})})}async function Fl(t){let e=await Bl(t),r=Gp(t,e);return fo(new Blob([r],{type:"text/calendar;charset=utf-8"}),ho(t.semester.label)+".ics"),Jp(t)}let Dl={apple:"类 Apple",flat:"极简扁平",organic:"自然有机",brutal:"新野兽派",editorial:"编辑杂志",neu:"新拟物"};function be(t,e,r){if(typeof document>"u")return Vt(e)||"#000000";let a=document.createElement("span");a.style.cssText="position:fixed;left:-9999px;visibility:hidden;color:var("+t+","+e+")",(document.body||document.documentElement).appendChild(a);let p=getComputedStyle(a).color;a.remove();let i=String(p||"").match(/[\d.]+/g)?.map(Number)||[];if(i.length>=3){let s=zr(i[0],i[1],i[2]),u=i.length>3?Math.max(0,Math.min(1,i[3])):1;return u<1?Bt(r||e,s,u):s}return Vt(p)||Vt(e)||"#000000"}function pp(){let t=Yt(),e=ee(),r=t==="dark",a=r?{bg:"#000000",surface:"#1C1C1E",input:"#2C2C2E",text:"#F5F5F7",secondary:"#A1A1A6",muted:"#8E8E93",border:"#38383A",primary:"#0A84FF"}:{bg:"#F5F5F7",surface:"#FFFFFF",input:"#F5F5F7",text:"#1D1D1F",secondary:"#6E6E73",muted:"#86868B",border:"#D2D2D7",primary:"#0071E3"},p={bg:be("--bg",a.bg),surface:be(e==="neu"?"--neu-base":"--surface",a.surface),input:be("--input-bg",a.input),text:be("--text",a.text),secondary:be("--text-secondary",a.secondary),muted:be("--text-muted",a.muted),border:be("--border",a.border,be(e==="neu"?"--neu-base":"--surface",a.surface)),primary:be("--primary",a.primary)},i={apple:{frameRadius:24,headerRadius:13,gridRadius:10,cardRadius:12,frameStroke:1,cardStroke:1,shadow:"soft"},flat:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:2,cardStroke:2,shadow:"none"},organic:{frameRadius:30,headerRadius:18,gridRadius:14,cardRadius:18,frameStroke:1,cardStroke:1,shadow:"warm"},brutal:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:3,cardStroke:3,shadow:"hard"},editorial:{frameRadius:0,headerRadius:0,gridRadius:0,cardRadius:0,frameStroke:1,cardStroke:1,shadow:"none",serif:!0},neu:{frameRadius:22,headerRadius:14,gridRadius:10,cardRadius:14,frameStroke:0,cardStroke:0,shadow:"neu"}};return{id:t,skin:e,dark:r,label:(Dl[e]||e)+" · "+(Ct[t]&&Ct[t].name||t),colors:p,shape:i[e]||i.apple}}function ip(t,e){return oi(t,e||pp())}function jl(t){return new Promise((e,r)=>{let a=new Blob([t.svg],{type:"image/svg+xml;charset=utf-8"}),p=URL.createObjectURL(a),i=new Image;i.onload=()=>{try{let u=Math.min(2,Math.sqrt(15e6/(t.width*t.height))),m=document.createElement("canvas");m.width=Math.floor(t.width*u),m.height=Math.floor(t.height*u);let w=m.getContext("2d");w.scale(m.width/t.width,m.height/t.height),w.fillStyle=t.background||"#F8FAFC",w.fillRect(0,0,t.width,t.height),w.drawImage(i,0,0,t.width,t.height),m.toBlob(q=>q?e(q):r(new Error("无法生成课表图片")),"image/png")}catch(s){r(s)}finally{URL.revokeObjectURL(p)}},i.onerror=()=>{URL.revokeObjectURL(p),r(new Error("课表图片渲染失败"))},i.src=p})}async function Ol(t){let e=await jl(ip(t));fo(e,ho(t.semester.label)+".png")}function go(t,e){document.getElementById("urppp-feature-toast")?.remove();let r=document.createElement("div");r.id="urppp-feature-toast",r.textContent=String(t||""),r.className=e?"error":"",document.documentElement.appendChild(r),requestAnimationFrame(()=>r.classList.add("open")),setTimeout(()=>{r.classList.remove("open"),setTimeout(()=>r.remove(),220)},e?4200:2400)}let xo=ni({document,window,ensureStyles:hl,loadData:ap,exportJson:Nl,exportIcs:Fl,exportPng:Ol,showToast:go,nativePageUrl:Il,navigate:t=>{location.href=t},logger:console});function Rl(t,e,r,a){return xo.run(t,e,r,a)}function Hl(t){return xo.createMenu(t)}function Ul(t){if(t){try{t.stage.remove()}catch{}try{document.getElementById("urppp-pdf-reset-style")?.remove()}catch{}}}function Wl(){window.__urpppPdfDiagnose||(window.__urpppPdfDiagnose=async()=>{let t={time:new Date().toISOString()},e=document.getElementById("mycoursetable"),r=document.getElementById("page-content-template");t.host=!!e,t.pageSource=!!r,t.hostCards=e?e.querySelectorAll("div.class_div").length:-1,t.hostHasCourseTable=e?!!e.querySelector("#courseTable"):!1,t.hostHasCourseTableBody=e?!!e.querySelector("#courseTableBody"):!1,t.hostTableId=e&&e.querySelector("table")?e.querySelector("table").id:"none";try{let p=_i(e);t.stage="ok",t.stageCards=p.target.querySelectorAll(".urppp-pdf-card").length,t.stageTableId=p.target.querySelector("table")?p.target.querySelector("table").id:"none",Ul(p)}catch(p){t.stage="failed",t.stageError=p&&p.message||String(p)}let a=typeof unsafeWindow<"u"?unsafeWindow:window;return t.deps={dollar:typeof a.$,loadFileList:typeof(a.Import&&a.Import.LoadFileList),back:typeof a.back,html2canvas:typeof a.html2canvas,originalDivBuild:typeof a.__urpppOriginalDivBuild},t})}function Gl(t){return t?(Wl(),async()=>{let e=document.getElementById("urppp-settings-panel"),r=document.getElementById("urppp-settings-mask");e&&e.classList.contains("open")&&e.classList.remove("open"),r&&r.classList.contains("open")&&r.classList.remove("open");try{await Pi(t,{document,page:typeof unsafeWindow<"u"?unsafeWindow:window,onAfterRestore:hr})}catch(a){console.warn("[URP++] isolated native PDF export failed",a),go("原生 PDF 隔离导出失败："+(a&&a.message||String(a))+"，请重试",!0)}}):null}function kr(t=location){return/\/(?:student\/courseSelect\/(?:thisSemesterCurriculum|courseSelectResult|calendarSemesterCurriculum)|student\/personalSenate\/giveLessonInfo\/thisSemesterSchedule)\//.test(t.pathname)}function Jl(t=location){return/\/student\/integratedQuery\/scoreQuery\/[^/]+\/index$/.test(t.pathname)}function yo(){if(!kr())return;let t=document.querySelector("#h4_id1")?.closest("h4")||document.querySelector("h4.header"),e=t?.querySelector(".right_top_oper")||document.querySelector("#mainDIV .right_top_oper, .page-content .right_top_oper"),r=Array.from((e||document).querySelectorAll("button, a")),a=s=>[s.textContent,s.getAttribute("title"),s.getAttribute("onclick")].filter(Boolean).join(" ").replace(/\s+/g," ");if(r.forEach(s=>{/打印.*课表|\bdy\s*\(/i.test(a(s))&&s.setAttribute("data-urppp-native-print-source","1")}),document.getElementById("urppp-native-schedule-export"))return;let p=r.find(s=>/导出.*(?:课表|PDF)|exportTableToPdf|\bdc\s*\(/i.test(a(s))),i=Hl({source:"native",pdfHandler:Gl(p)});if(i.id="urppp-native-schedule-export",p&&p.parentElement){p.__urpppNativeExportState||(p.__urpppNativeExportState={display:p.style.getPropertyValue("display"),displayPriority:p.style.getPropertyPriority("display"),ariaHidden:p.getAttribute("aria-hidden"),tabIndex:p.getAttribute("tabindex")}),p.setAttribute("data-urppp-native-export-source","1"),p.style.setProperty("display","none","important"),p.setAttribute("aria-hidden","true"),p.setAttribute("tabindex","-1"),p.parentElement.insertBefore(i,p.nextSibling);return}if(e)e.appendChild(i);else if(t)t.appendChild(i);else{let s=document.getElementById("page-content-template")||document.querySelector(".page-content");if(s){let u=document.createElement("div");u.className="urppp-export-fallback",u.appendChild(i),s.prepend(u)}}}let Ze=null,ia=0;function vo(){clearTimeout(ia),ia=0,Ze&&Ze.observer.disconnect(),Ze=null}function Vl(){if(!kr()){vo();return}let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;if(!t||Ze&&Ze.root===t&&t.isConnected)return;vo();let e=new MutationObserver(()=>{clearTimeout(ia),ia=setTimeout(()=>yo(),80)});e.observe(t,{childList:!0,subtree:!0}),Ze={root:t,observer:e}}function sp(t,e,r){r===null?t.removeAttribute(e):t.setAttribute(e,r)}function Yl(t=document){let e=t&&t.querySelectorAll?t:document,r=e.matches?.("#urppp-native-schedule-export")?e:e.querySelector("#urppp-native-schedule-export");if(r){let a=r.closest(".urppp-export-fallback");r.remove(),a&&!a.children.length&&a.remove()}e.querySelectorAll("[data-urppp-native-export-source]").forEach(a=>{let p=a.__urpppNativeExportState;p&&(p.display?a.style.setProperty("display",p.display,p.displayPriority):a.style.removeProperty("display"),sp(a,"aria-hidden",p.ariaHidden),sp(a,"tabindex",p.tabIndex)),a.removeAttribute("data-urppp-native-export-source");try{delete a.__urpppNativeExportState}catch{}}),e.querySelectorAll("[data-urppp-native-print-source]").forEach(a=>{a.removeAttribute("data-urppp-native-print-source")})}let lp=ls({deps:{styles:Fi,loadScores:Ap,loadProfile:cp,scoreToNumber:Ke,scoreToGpa:Qe,getInsertHost:()=>document.querySelector(".page-content")||document.getElementById("page-content-template")||null,shouldAutoExpand:()=>{let t=/[?&]urppp=sa(?:&|$)/.test(window.location.search);if(t)try{history.replaceState(null,"",window.location.pathname+window.location.hash)}catch{}return t}}}),Ql=Ip([da({id:"schedule-export",matches:t=>kr(t.location),mount:()=>{yo(),Vl()},unmount:t=>{vo(),Yl(t?.lifecycleKey)}}),da({id:"score-analysis",matches:t=>Jl(t.location),mount:()=>{try{lp.mount()}catch(t){console.warn("[URP++] score analysis mount",t)}},unmount:()=>{try{lp.unmount()}catch{}}})]);function sa(){let t=document.getElementById("page-content-template")||document.querySelector(".page-content")||document.body;return Ql.refresh({document,location,window,lifecycleKey:t})}function Kl(t){xo.bindHosts(t)}function Ar(t){return String(t||"").replace(/\u00a0/g," ").replace(/\s+/g," ").replace(/^[\s:：]+|[\s:：]+$/g,"").trim()}function la(t,e){if(!t||!t.querySelectorAll)return"";let r=(e||[]).map(p=>Ar(p).replace(/[：:]/g,"")),a=t.querySelectorAll(".profile-info-row, tr");for(let p=0;p<a.length;p++){let i=a[p],s=i.querySelector(".profile-info-name, th, label"),u=i.querySelector(".profile-info-value, td:last-child");if(!s||!u||s===u)continue;let m=Ar(s.textContent).replace(/[：:]/g,"");if(!r.some(q=>m===q||m.endsWith(q)))continue;let w=Ar(u.textContent);if(w&&w!=="—"&&w!=="-")return w}return""}function Xe(t){return Ar(t).replace(/^主修为\s*/,"").replace(/培养方案概况.*$/,"").replace(/…+/g,"").split(/主修必修GPA|GPA算法|已修读|尚不及格|本学期/)[0].trim()}function Zl(t){let e={majorPlan:"",majorGpa:""};return!t||!t.querySelectorAll||t.querySelectorAll(".infobox, .widget-box, .urppp-stat-card").forEach(r=>{let a=(r.innerText||r.textContent||"").trim(),p=Ar(a);if(/主修必修GPA/.test(p)){let i=p.match(/(-?\d+(?:\.\d+)?)\s*主修必修GPA/)||p.match(/主修必修GPA[^\d-]{0,20}(-?\d+(?:\.\d+)?)/);if(i){let s=Number(i[1]),u=Number(e.majorGpa);Number.isFinite(s)&&s>=0&&s<=5&&(!e.majorGpa||u===0||s>0)&&(e.majorGpa=i[1])}}if(/主修为|培养方案/.test(p)){let i=p.match(/([\u4e00-\u9fa5A-Za-z0-9（）()·+\-]{2,60}(?:培养方案|教学计划))/)||p.match(/^(.{2,60}?)\s*主修为/)||p.match(/主修为\s*(.{2,60})$/),s=Xe(i&&i[1]);if(s&&!/GPA|已修读|尚不及格|本学期/.test(s)){let u=/培养方案|教学计划/.test(s);(!e.majorPlan||u)&&(e.majorPlan=s)}}}),e}async function cp(){let t={name:"",avatar:"",majorPlan:"",majorGpa:"",studentId:""};try{let r=document.querySelector("#navbar .user-info, .ace-nav .user-info, .user-info");if(r){let i=r.querySelector(".urppp-user-name-value"),s=i&&i.__urpppOriginalText;s&&(t.name=String(s).trim());let u=(r.innerText||r.textContent||"").replace(/\s+/g," ").trim(),m=t.name?null:u.match(/欢迎您[，,]\s*([\u4e00-\u9fa5·]{2,12})/);if(!t.name&&!m){let w=r.cloneNode(!0);w.querySelectorAll("small, i, img, b, .badge").forEach($=>$.remove());let q=(w.textContent||"").replace(/\s+/g," ").trim();q=q.replace(/^欢迎您[，,]\s*/g,"").replace(/\d{8,}/g,"").trim(),m=q.match(/([\u4e00-\u9fa5·]{2,12})/)}m&&m[1]&&!/欢迎|同学|首页|反馈|密码|注销/.test(m[1])&&(t.name=m[1])}let a=document.querySelector("#navbar img.nav-user-photo, .ace-nav img.nav-user-photo");a&&(t.avatar=a.__urpppOriginalSrc||a.src||a.getAttribute("src")||"");let p=Zl(document);t.majorPlan=p.majorPlan,t.majorGpa=p.majorGpa}catch{}try{let r=await Qt("/student/rollManagement/rollInfo/index"),a=oa(r),p=a.body&&(a.body.innerText||a.body.textContent)||"";if(!t.name&&(t.name=la(a,["姓名"]),!t.name)){let m=p.match(/姓名\s*[：:]?\s*([\u4e00-\u9fa5·]{2,20})/);m&&(t.name=m[1].trim())}let i=la(a,["主修方案名称"]),s=la(a,["专业"]);if(t.studentId=la(a,["学号"]),t.studentId&&/^\d{6,20}$/.test(String(t.studentId)))try{GM_setValue("urppp_downs_sid",String(t.studentId))}catch{}i?t.majorPlan=Xe(i):!t.majorPlan&&s&&(t.majorPlan=Xe(s));let u=a.querySelector('.profile-picture img, img#avatar, img[src*="photo" i], img[src*="Photo"]');if(u&&u.getAttribute("src")&&!t.avatar){let m=u.getAttribute("src");t.avatar=/^https?:/i.test(m)?m:lo(m)}}catch{}let e=Number(t.majorGpa);return t.name||(t.name="同学"),t.majorPlan||(t.majorPlan="主修方案"),(!Number.isFinite(e)||e<=0||e>5)&&(t.majorGpa="—"),t}let dp=["周日","周一","周二","周三","周四","周五","周六"];function wo(t){let e=[],r=t.querySelector("#courseTableBody")||t.querySelector("#courseTable tbody");if(!r)return e;r.querySelectorAll("td[id]").forEach(p=>{let i=String(p.id||"").match(/^(\d+)_(\d+)$/);if(!i)return;let s=parseInt(i[1],10),u=parseInt(i[2],10),m=s===7?0:s,w=p.querySelectorAll('.class_div, .div_style, div[class*="div-kcb"]'),q=w.length?w:[];if(!q.length&&(p.textContent||"").trim()){let $=(p.textContent||"").replace(/\s+/g," ").trim();$&&e.push({name:$.slice(0,40),teacher:"",place:"",week:"",day:m,section:u});return}q.forEach($=>{let M=Array.from($.querySelectorAll("p")).map(K=>(K.textContent||"").trim()).filter(Boolean),j=($.querySelector(".p-kcm-1, .p-kcm")||{}).textContent||M[0]||"",Y=($.querySelector('.p-jxl-1, [class*="jxl"]')||{}).textContent||"",O=M.find((K,dt)=>dt>0&&!/周|节/.test(K)&&K!==Y)||"",R=M.find(K=>/周/.test(K))||"",B=String(j).replace(/_\d+\s*$/,"").trim();!B||B.length<2||e.push({name:B,teacher:String(O).trim(),place:String(Y||"").trim(),week:String(R).trim(),day:m,section:u})})});let a=new Set;return e.filter(p=>{let i=[p.day,p.section,p.name,p.place].join("|");return a.has(i)?!1:(a.add(i),!0)})}let up="urppp_term_week_v1";function tr(t){let e=Number(t)||0;if(e<1||e>30)return 0;ot._termWeek=e,ot._termWeekResolved=!0;try{GM_setValue(up,e)}catch{}return e}function Sr(){if(ot&&ot._termWeek>=1)return ot._termWeekResolved=!0,ot._termWeek;try{let t=Number(GM_getValue(up,0))||0;if(t>=1&&t<=30)return tr(t)}catch{}return 0}function _r(t){let e=String(t||"").replace(/\s+/g," ");if(!e)return 0;let r=[/(?:\d{4}\s*[-–]\s*\d{4}).{0,40}?第\s*(\d{1,2})\s*周/,/20\d{2}.{0,40}?第\s*(\d{1,2})\s*周/,/(?:春|秋|夏|冬)\s*第\s*(\d{1,2})\s*周/,/第\s*(\d{1,2})\s*周\s*(?:星期|周[一二三四五六日天])/];for(let a=0;a<r.length;a++){let p=e.match(r[a]);if(p){let i=parseInt(p[1],10);if(i>=1&&i<=30)return i}}return 0}function $e(){if(ot._termWeekResolved&&ot._termWeek>=1&&ot._termWeek<=30)return ot._termWeek;try{let t=[document.querySelector("#navbar"),document.querySelector(".navbar-fixed-top"),document.querySelector(".navbar"),document.querySelector("#navbar .navbar-header"),document.querySelector("#navbar .navbar-buttons"),document.querySelector(".ace-nav"),document.querySelector("#breadcrumbs"),document.querySelector("#page-content-header"),document.querySelector(".page-header"),document.querySelector("header")].filter(Boolean);for(let s=0;s<t.length;s++){let u=t[s],m=_r(u.innerText||u.textContent||"")||_r(u.innerHTML||"");if(m)return tr(m)}let e=document.documentElement&&document.documentElement.innerHTML||"",r=_r(e);if(r)return tr(r);let a=document.body&&document.body.innerText||"",p=_r(a);if(p)return tr(p);let i=Sr();if(i)return i}catch{}return 0}let er=null;function Xl(){let t=new Date,e=r=>String(r).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function tc(t,e){let r=new Date(`${t}T00:00:00`);r.setDate(r.getDate()+e);let a=p=>String(p).padStart(2,"0");return`${r.getFullYear()}-${a(r.getMonth()+1)}-${a(r.getDate())}`}function Er(t){if(er)return er;let e=t||Xl();return e>="2027-02-06"&&e<=tc("2027-02-06",6)?"springfestival":e>="2027-01-18"&&e<"2027-03-01"?"winter":e>="2027-07-04"&&e<"2027-08-31"||e>="2026-07-04"&&e<"2026-08-31"?"summer":"term"}function ec(){let t='<svg viewBox="0 0 52 190"><path d="M26 0v16" stroke="#c8102e" stroke-width="3"/><rect x="16" y="16" width="20" height="8" rx="4" fill="#c8102e"/><ellipse cx="26" cy="62" rx="22" ry="30" fill="#e63946"/><path d="M26 26v72M14 34q12 12 0 24M38 34q-12 12 0 24" stroke="#ffd75e" stroke-width="1.4" fill="none"/><path d="M14 92h24M17 98h18M20 104h12" stroke="#ffd75e" stroke-width="2.4" stroke-linecap="round"/></svg>';return`<div id="urppp-festive-decor" aria-hidden="true"><div class="ufd ufd-left">${t}</div><div class="ufd ufd-right">${t}</div></div>`}function mp(){let t=typeof document<"u"?document:null;if(!t)return;let e=Er()==="springfestival",r=t.getElementById("urppp-festive-decor");e&&!r?t.documentElement.insertAdjacentHTML("beforeend",ec()):!e&&r&&r.remove()}function bp(t){er=t==="summer"||t==="winter"||t==="springfestival"||t==="term"?t:null,er&&er!=="term"&&(ot.weekLocked=!1,ot.viewWeek=0);try{mp()}catch{}try{typeof ar=="function"&&ar()}catch{}return er}function rc(){return Er()}function hp(){if(Er()!=="term")return ot.weekLocked?(!ot.viewWeek||ot.viewWeek<0)&&(ot.viewWeek=0):ot.viewWeek=0,ot.viewWeek;let t=$e()||Sr()||0;return ot.weekLocked?(!ot.viewWeek||ot.viewWeek<1)&&(ot.viewWeek=t>=1?t:1):t>=1?ot.viewWeek=t:(!ot.viewWeek||ot.viewWeek<1)&&(ot.viewWeek=1),!ot.weekLocked&&t>1&&ot.viewWeek===1&&(ot.viewWeek=t),ot.viewWeek}async function ac(){let t=$e();if(t>=1)return t;try{let e=await Qt("/index");if(t=_r(e),t)return tr(t)}catch{}try{let e=new Date,r=e.getFullYear()+"-"+String(e.getMonth()+1).padStart(2,"0")+"-"+String(e.getDate()).padStart(2,"0"),a="xqh=03&jxlh=302&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(r),p=await Qt("/student/teachingResources/classroomUseStatus/jasInfo",{method:"POST",data:a,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),i=JSON.parse(p),s=Number(i&&i.jxzc);if(s>=1&&s<=30)return tr(s)}catch{}return Sr()||0}function oc(t){let e=$e()||20;return(t||[]).forEach(r=>{let a=String(r.classWeek||"");a.length>e&&(e=a.length);let p=String(r.week||"").match(/(\d{1,2})\s*[-~至到]\s*(\d{1,2})/);p&&(e=Math.max(e,parseInt(p[2],10)||0));let i=String(r.week||"").match(/\d{1,2}/g);i&&i.forEach(s=>{e=Math.max(e,parseInt(s,10)||0)})}),Math.min(Math.max(e,1),30)}function fp(t,e){if(!e||!t)return!1;let r=String(t);return r.length>=e?r.charAt(e-1)==="1":!1}let gp=["#3B82F6","#10B981","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#EC4899","#84CC16","#F97316","#6366F1"];function xp(t){let e=0,r=String(t||"");for(let a=0;a<r.length;a++)e=e*31+r.charCodeAt(a)>>>0;return gp[e%gp.length]}function nc(t){let e=[],r=$e();(t&&t.xkxx||[]).forEach(i=>{Object.keys(i||{}).forEach(s=>{let u=i[s];if(!u)return;let m=u.courseName||u.englishCourseName||s,w=u.attendClassTeacher||"";(u.timeAndPlaceList||[]).forEach($=>{let M=Number($.classDay)||0,j=M===7?0:M,Y=Number($.classSessions)||1,O=Math.max(1,Number($.continuingSession)||1),R=[$.campusName,$.teachingBuildingName,$.classroomName].filter(Boolean).join(""),B=$.weekDescription||u.skzcs||"",K=fp($.classWeek,r)||r&&B.indexOf(String(r))>=0;e.push({name:String(m).trim(),teacher:String(w).trim(),place:String(R).trim(),week:String(B).trim(),classWeek:String($.classWeek||""),day:j,section:Y,span:O,thisWeek:!!K,color:xp(m)})})})});let p=new Set;return e.filter(i=>{let s=[i.day,i.section,i.span,i.name,i.place,i.week].join("|");return p.has(s)?!1:(p.add(s),!0)})}async function pc(){try{let t=await Qt("/student/courseSelect/thisSemesterCurriculum/ajaxStudentSchedule/callback"),e=[],r=null;try{r=JSON.parse(t);let p=Number(r&&(r.jxzc||r.zc||r.currentWeek));p>=1&&p<=30&&(ot._termWeek=Math.max(ot._termWeek||0,p),ot.weekLocked||(ot.viewWeek=ot._termWeek)),e=nc(r)}catch{e=wo(oa(t))}e.length||(e=wo(document));let a=r?np(r,sr(r),"clean"):null;return{courses:e,exportData:a,rawOk:e.length>0,error:e.length?"":"课表 JSON 无 timeAndPlaceList"}}catch(t){try{let e=wo(document);if(e.length)return{courses:e,rawOk:!0,error:""}}catch{}return{courses:[],rawOk:!1,error:String(t&&t.message||t)}}}function ic(t,e){let r=String(t||""),a=new RegExp(`url\\s*=\\s*["']([^"']*`+e+`[^"']*)["']`,"i"),p=r.match(a);if(p&&p[1])return p[1];let i=new RegExp(`(\\/student\\/integratedQuery\\/scoreQuery\\/[^"'\\s]+`+e+")","i"),s=r.match(i);return s?s[1]:""}function sc(t){let e=[];return(t&&t.lnList||[]).forEach(a=>{let p=a.cjlx||a.cjbh||a.famc||a.zxjxjhh||"成绩",i=[];(a.cjList||[]).forEach(s=>{let u=s.courseName||s.englishCourseName||"";if(!u)return;let m=s.cj!=null&&s.cj!==""?String(s.cj):"";!m&&s.courseScore!=null&&(m=String(s.courseScore)),!m&&s.gradeName&&(m=String(s.gradeName)),!m&&s.zscj!=null&&(m=String(s.zscj));let w=s.courseAttributeName||s.xkcsxmc||"",q=parseFloat(s.credit)||0,$=s.id&&(s.id.courseNumber||s.id.kch_zj)||"",M=s.id&&(s.id.coureSequenceNumber||s.id.courseSequenceNumber||s.id.kxh)||s.classNo||"",j=s.gradePointScore!=null?Number(s.gradePointScore):null,Y=ue(m)||ue(s.gradeName)||j!=null&&j<0,O=Y?"未评估":m;i.push({code:$,seq:String(M||""),name:u,attr:w,credit:q,score:O,unevaluated:Y,required:Vn(w),officialGpa:ra(j)?j:null,evalUrl:""})}),i.length&&e.push({title:String(p).slice(0,100),courses:i,summary:oe(i),meta:{zxf:a.zxf,tgms:a.tgms,zms:a.zms,famc:a.famc}})}),e}async function yp(t,e){let r=await Qt(t),a=vp(oa(r));if(a.length)return a;let p=ic(r,e);if(!p)return[];let i=await Qt(p);try{let s=JSON.parse(i);a=sc(s).map(u=>(u.summary=oe(u.courses),u))}catch{a=vp(oa(i))}return a}function vp(t){let e=[];return t.querySelectorAll("table").forEach(r=>{let a=Array.from(r.tHead&&r.tHead.rows[0]?r.tHead.rows[0].cells:r.rows[0]&&r.rows[0].cells||[]).map(q=>(q.textContent||"").replace(/\s+/g,""));if(!a.length)return;let p=a.join("|");if(!/课程名/.test(p)||!/成绩/.test(p))return;let i={code:a.findIndex(q=>q==="课程号"),name:a.findIndex(q=>q==="课程名"),attr:a.findIndex(q=>/课程属性|属性/.test(q)),credit:a.findIndex(q=>q==="学分"),score:a.findIndex(q=>q==="成绩")};if(i.name<0||i.score<0)return;let s="成绩",u=r.previousElementSibling;for(let q=0;q<8&&u;q++,u=u.previousElementSibling)if(/^H[1-4]$/.test(u.tagName)||u.classList&&u.classList.contains("header")){s=(u.textContent||"").replace(/\s+/g," ").trim();break}let m=[],w=r.tBodies.length?r.tBodies[0].rows:Array.from(r.rows).slice(1);Array.from(w).forEach(q=>{let $=Array.from(q.cells||q.querySelectorAll("td"));if($.length<4)return;let M=B=>B>=0&&$[B]?($[B].textContent||"").replace(/\s+/g," ").trim():"",j=M(i.name),Y=M(i.score);if(!j||!Y||/课程名|序号/.test(j))return;let O=M(i.attr),R=ue(Y);m.push({code:M(i.code),name:j,attr:O,credit:parseFloat(M(i.credit))||0,score:R?"未评估":Y,unevaluated:R,required:Vn(O),officialGpa:null,evalUrl:""})}),m.length&&e.push({title:s.slice(0,100),courses:m,summary:oe(m)})}),e}function Cr(t){return Xe(t&&t.meta&&t.meta.famc||t&&t.title||"")}function wp(t,e){if(!t||!t.length)return 0;let r=Xe(e),a=t.findIndex(s=>{let u=Cr(s);return/培养方案/.test(u)&&!/微专业|辅修|双学位/.test(u)});if(a>=0&&(!r||Cr(t[a]).includes(r.slice(0,4)))||r&&(a=t.findIndex(s=>{let u=Cr(s);return u.includes(r.replace(/培养方案.*/,"培养方案"))||r.includes(u.slice(0,4))||u.includes(r.slice(0,4))}),a>=0))return a;let p=0,i=-1;return t.forEach((s,u)=>{if(/微专业|辅修/.test(Cr(s)))return;let m=(s.courses||[]).length;m>i&&(i=m,p=u)}),p}async function lc(){let t={};try{let e=await Qt("/student/teachingAssessment/evaluation/queryAll",{method:"POST",data:"pageNum=1&pageSize=200&flag=kt",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"}}),r;try{r=JSON.parse(e)}catch{r=null}(r&&r.data&&r.data.records||[]).forEach(p=>{let i=String(p.KCH||"").trim();if(!i)return;let s=String(p.SFPG)==="1",u=String(p.KTID||"").trim();if(!t[i]){t[i]={ktid:u,kxh:String(p.KXH||""),kcm:p.KCM||"",done:s,pending:s?0:1,total:1,url:!s&&u?"/student/teachingEvaluation/newEvaluation/evaluation/"+u:"/student/teachingEvaluation/newEvaluation/index"};return}t[i].total+=1,s||(t[i].pending+=1,t[i].done=!1,u&&(t[i].ktid=u,t[i].url="/student/teachingEvaluation/newEvaluation/evaluation/"+u))}),Object.keys(t).forEach(p=>{let i=t[p];i.done=!(i.pending>0)})}catch(e){console.warn("[URP++] evaluation map",e)}return t}function cc(t){if(!t)return!1;if(t.officialGpa!=null&&ra(t.officialGpa))return!0;let e=t.score;return e==null||e===""||ue(e)?!1:Ke(e)!=null||Qe(e)!=null?!0:!/未评估|未评教|待评估|待评教/.test(String(e))}function dc(t,e){if(!t||!e)return t;let r=a=>(a||[]).forEach(p=>{if(!p||!p.code)return;let i=e[p.code];if(i){if(cc(p)){p.unevaluated=!1,i.done?p.evalUrl=p.evalUrl||"":p.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index";return}i.done||(p.unevaluated=!0,p.evalUrl=i.url||"/student/teachingEvaluation/newEvaluation/index",(!p.score||p.score===""||ue(p.score))&&(p.score="未评估"))}});return(t.passing||[]).forEach(a=>r(a.courses)),(t.schemes||[]).forEach(a=>r(a.courses)),t}function kp(t){return t&&(t.passing&&t.passing[0]&&(t.passing[0].summary=oe(t.passing[0].courses)),t.schemes=(t.schemes||[]).map(e=>(e.summary=oe(e.courses),e)),t)}async function uc(t){if(!t||t.evaluationLoading)return t;t.evaluationLoading=!0;try{let e=await lc();return dc(t,e),t.evalMap=e,t.evaluationReady=!0,kp(t)}finally{t.evaluationLoading=!1}}function mc(){if(!ot.scores||!ot.scores.schemes)return;let t=ot.scores.schemes,e=ot.profile&&ot.profile.majorPlan,r=wp(t,e);ot.scores.majorIdx=r,ot._schemeUserSelected||(ot.activeSchemeIdx=r,ot._schemeInited=!0);let a=t[r];if(!a||!ot.profile)return;let p=Cr(a),i=Xe(ot.profile.majorPlan);/培养方案|教学计划/.test(p)&&(!/培养方案|教学计划/.test(i)||i==="主修方案")&&(ot.profile.majorPlan=p);let s=a.summary||{},u=Number(s.requiredCredit),m=Number(s.requiredGpa),w=Number(ot.profile.majorGpa);u>0&&Number.isFinite(m)&&m>=0&&m<=5&&(!Number.isFinite(w)||w<=0)&&(ot.profile.majorGpa=String(Me(m)))}let rr=null;async function Ap(t){return t&&(rr=null),rr&&!rr.error||(rr=await bc()),rr}async function bc(){let t={passing:[],schemes:[],error:"",majorIdx:0,evaluationReady:!1,evaluationLoading:!1};try{let[e,r]=await Promise.all([yp("/student/integratedQuery/scoreQuery/allPassingScores/index","allPassingScores/callback"),yp("/student/integratedQuery/scoreQuery/schemeScores/index","schemeScores/callback")]),a=[];e.forEach(p=>p.courses.forEach(i=>{a.push(Object.assign({term:p.title},i))})),t.passing=[{title:"全部及格成绩",courses:a,summary:oe(a),groups:e}],t.schemes=r,!t.schemes.length&&a.length&&(t.schemes=[{title:"方案成绩",courses:a,summary:oe(a)}]),kp(t),t.majorIdx=wp(t.schemes,ot.profile&&ot.profile.majorPlan),!a.length&&!t.schemes.length&&(t.error="成绩 callback 无数据")}catch(e){t.error=String(e&&e.message||e)}return t}function Ne(t){if(!t)return[];let e=String(t).trim();if(!e)return[];e=e.replace(/^['"]|['"]$/g,"");try{return JSON.parse(e)}catch{}try{return JSON.parse(e.replace(/&quot;/g,'"').replace(/&#34;/g,'"'))}catch{}return[]}function Sp(t,e){let r=t.indexOf(e);if(r<0)return"";let a=t.indexOf("[",r);if(a<0)return"";let p=0;for(let i=a;i<t.length&&i<a+3e5;i++){let s=t[i];if(s==="[")p++;else if(s==="]"&&(p--,p===0))return t.slice(a,i+1)}return""}async function hc(){let t=await Qt("/student/teachingResources/classroomUseStatus/index");if(/欢迎登录|name=["']j_username["']|loginEn/i.test(t)&&!/jxlList|teachingBuildingName|classroomUseStatus/i.test(t))throw new Error("登录已失效，请刷新页面后重试");let e=[],r=[];try{let i=(t.match(/id=["']xqList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']xqList["'][^>]*value=["']([^"']*)["']/i)||[])[1],s=(t.match(/id=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||t.match(/name=["']jxlList["'][^>]*value=["']([^"']*)["']/i)||[])[1];if(i&&(e=Ne(i)),s&&(r=Ne(s)),!e.length){let u=t.match(/(?:var\s+)?xqList\s*=\s*(\[[\s\S]*?\])\s*;/);u&&(e=Ne(u[1]))}if(!r.length){let u=t.match(/(?:var\s+)?jxlList\s*=\s*(\[[\s\S]*?\])\s*;/);u&&(r=Ne(u[1]))}if(!r.length){let u=Sp(t,"teachingBuildingName");u&&(r=Ne(u))}if(!e.length){let u=Sp(t,"campusName");u&&(e=Ne(u))}}catch(i){console.warn("[URP++] classroom json parse",i)}if(!r.length){let i=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}];e=i;let s=[];for(let u of i)try{let m=await Qt("/student/teachingResources/classroomCurriculum/"+u.campusNumber+"/teachingBuildingJson");Ne(m).forEach(q=>{s.push({id:{campusNumber:u.campusNumber,teachingBuildingNumber:String(q.id&&q.id.teachingBuildingNumber||q.teachingBuildingNumber||"")},teachingBuildingName:q.teachingBuildingName||q.name||""})})}catch(m){console.warn("[URP++] building json",u.campusNumber,m)}r=s}e.length||(e=[{campusNumber:"01",campusName:"望江"},{campusNumber:"02",campusName:"华西"},{campusNumber:"03",campusName:"江安"}]);let a=e.map(i=>({campus:i.campusName||i.campusNumber,campusNumber:String(i.campusNumber||i.id&&i.id.campusNumber||""),buildings:[]}));r.forEach(i=>{let s=String(i.id&&i.id.campusNumber||i.campusNumber||""),u=String(i.id&&i.id.teachingBuildingNumber||i.teachingBuildingNumber||""),m=i.teachingBuildingName||i.name||u;if(!s||!u||!m)return;let w=a.find($=>$.campusNumber===s);w||(w={campus:s,campusNumber:s,buildings:[]},a.push(w));let q="/student/teachingResources/classroomUseStatus/"+s+"/"+u+"/"+encodeURI(encodeURI(w.campus||s))+"/"+encodeURI(encodeURI(m));w.buildings.push({name:m,path:q,campusNumber:s,buildingNumber:u})});let p=a.filter(i=>i.buildings.length);if(!p.length)throw new Error("未解析到教学楼，请刷新后重试");return p}function Pr(t){let e=String(t&&t.occupancymoduleId||""),r={"06":"有课","07":"考试",14:"实验",room:"借用"};if(r[e])return r[e];if(t&&t.remark){let a=String(t.remark).trim();if(a)return a}return"占用"}function fc(t){if(t&&t.contentName)return String(t.contentName).trim();if(t&&t.remark){let e=String(t.remark).trim();if(e)return e}return Pr(t)}async function gc(t,e,r,a){let p=new URLSearchParams({planNumber:String(t||""),campusNumber:String(e||""),teachingBuildingNumber:String(r||""),classroomNumber:String(a||"")}),i=await Qt("/student/teachingResources/classroomCurriculum/searchCurriculum/callback?"+p.toString());try{let s=JSON.parse(i);return Array.isArray(s)?s.length&&Array.isArray(s[0])?s[0]:s.filter(u=>u&&typeof u=="object"&&(u.kcm||u.id&&u.id.kch)):s&&Array.isArray(s.list)?s.list:[]}catch{return[]}}function xc(t,e,r){let a=t||[],p=Number(e.xq)||0,i=Number(e.start)||0,s=Number(r)||0,u=[];return a.forEach(m=>{let w=m.id||{},q=Number(w.skxq!=null?w.skxq:m.skxq)||0,$=Number(w.skjc!=null?w.skjc:m.skjc)||0,M=Math.max(1,Number(m.cxjc)||1),j=w.skzc||m.skzc||"";p&&q&&p!==q||i&&(i<$||i>=$+M)||s&&j&&!so(j,s)||u.push(m)}),u.length?(u.sort((m,w)=>{let q=so(m.id&&m.id.skzc||m.skzc,s)?0:1,$=so(w.id&&w.id.skzc||w.skzc,s)?0:1;return q-$}),u[0]):null}async function yc(t,e,r){if(!t||!t.rooms||!t.rooms.length)return t;let a=String(e.campusNumber||""),p=String(e.buildingNumber||""),i=r||t.planNumber||"";if(!a||!p||!i)return t;let s=t.rooms.filter(M=>(M.slots||[]).some(j=>j.busy)),u={},m=async M=>{if(u[M])return u[M];try{u[M]=await gc(i,a,p,M)}catch{u[M]=[]}return u[M]},w=4,q=0,$=new Array(Math.min(w,Math.max(s.length,1))).fill(0).map(async()=>{for(;q<s.length;){let M=q++,j=s[M],Y=await m(j.name);(j.slots||[]).forEach(O=>{if(!O.busy)return;let R={xq:O.detail&&O.detail.xq||O.xq||0,start:O.section,week:t.jxzc};O.detail&&O.detail.xq!=null&&(R.xq=O.detail.xq);let B=xc(Y,R,t.jxzc);if(B&&B.kcm){let K=String(B.kcm).trim();O.contentName=K,O.reason=K,O.displayChar=aa(K),O.detail&&(O.detail.contentName=K,O.detail.reason=K,O.detail.teacher=B.jsm||"",O.detail.weeks=B.zcsm||"",O.detail.courseNo=B.id&&B.id.kch||"",O.detail.typeLabel=Pr({occupancymoduleId:O.module}))}else O.displayChar=aa(O.reason||"占用"),O.detail&&(O.detail.typeLabel=Pr({occupancymoduleId:O.module}))})}});return await Promise.all($),t}function vc(t){return t==="有课"?"kind-course":t==="考试"?"kind-exam":t==="实验"?"kind-lab":t==="借用"?"kind-borrow":"kind-busy"}async function wc(t){let e="",r="",a="",p="";if(t&&typeof t=="object")e=String(t.campusNumber||""),r=String(t.buildingNumber||""),a=t.name||"",p=t.path||"";else{p=String(t||"");let B=p.match(/classroomUseStatus\/(\d+)\/(\d+)\//);B&&(e=B[1],r=B[2])}if(!e||!r)throw new Error("缺少校区/楼栋编号");let i=Number(t&&t.dateOffset!=null?t.dateOffset:ot.roomDateOffset)||0,s=kc(_p(new Date,i)),u="xqh="+encodeURIComponent(e)+"&jxlh="+encodeURIComponent(r)+"&jslx=&jasm=&zwFrom=&zwTo=&searchDate="+encodeURIComponent(s),m=await new Promise((B,K)=>{let dt=lo("/student/teachingResources/classroomUseStatus/jasInfo");typeof GM_xmlhttpRequest=="function"?GM_xmlhttpRequest({method:"POST",url:dt,data:u,withCredentials:!0,headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},onload:vt=>vt.status>=200&&vt.status<400?B(vt.responseText||""):K(new Error("HTTP "+vt.status)),onerror:()=>K(new Error("network"))}):fetch(dt,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8","X-Requested-With":"XMLHttpRequest"},body:u}).then(vt=>vt.text()).then(B).catch(K)}),w;try{w=JSON.parse(m)}catch{throw new Error("jasInfo 非 JSON")}let q=(w.classrooms||[]).map(B=>{let K=B.classroomName||B.id&&B.id.classroomNumber||"",dt=B.placeNum||"",vt=B.remark||"",Et=[];for(let Lt=1;Lt<=12;Lt++)Et.push({section:Lt,busy:!1});return{name:K,seats:dt,type:vt,slots:Et,map:{}}}),$={};q.forEach(B=>{$[B.name]=B}),(w.classroomTime||[]).forEach(B=>{let K=B.id||{},dt=K.classroomNumber||"",vt=Number(K.sessionstart)||1,Et=Math.max(1,Number(B.continuingsession)||1),Lt=$[dt];if(!Lt)return;let qt=Pr(B),jt=fc(B);for(let Ot=vt;Ot<vt+Et&&Ot<=12;Ot++){let Mt=Lt.slots.find(Ht=>Ht.section===Ot);Mt&&(Mt.busy=!0,Mt.kind=B.timestatenumber||B.occupancymoduleId||"",Mt.module=B.occupancymoduleId||"",Mt.reason=jt,Mt.typeLabel=qt,Mt.displayChar=aa(jt),Mt.xq=K.xq,Mt.weekBitmap=K.week||"",Mt.detail={room:dt,section:Ot,start:vt,span:Et,reason:jt,typeLabel:qt,week:K.week||"",xq:K.xq||"",state:B.timestatenumber||"",module:B.occupancymoduleId||""})}});let M="";try{let B=w.jhZxjxjhb;typeof B=="string"&&/\d{4}-\d{4}-\d-\d/.test(B)?M=B:B&&typeof B=="object"&&(M=String(B.zxjxjhh||B.jhxnxq||B.executiveEducationPlanNumber||B.planNumber||""))}catch{}if(!M&&w.classrooms&&w.classrooms[0]&&w.classrooms[0].id&&(M=w.classrooms[0].id.executiveEducationPlanNumber||""),w.jxzc!=null&&Number(w.jxzc)>=1){let B=Number(w.jxzc);ot._termWeek=Math.max(ot._termWeek||0,B),ot.weekLocked||(ot.viewWeek=ot._termWeek)}let j=["日","一","二","三","四","五","六"],Y=Ac(w.date||s)||_p(new Date,i),O=w.week!=null?Number(w.week):Y.getDay(),R=i===1?"明天":i===2?"后天":"今天";return{rooms:q,dateLabel:(w.date||s)+"（周"+(j[O]||O)+" · "+R+"）",jxzc:w.jxzc,planNumber:M,week:w.week!=null?w.week:O,searchDate:w.date||s,dateOffset:i}}function _p(t,e){let r=new Date(t.getFullYear(),t.getMonth(),t.getDate());return r.setDate(r.getDate()+(Number(e)||0)),r}function kc(t){return t.getFullYear()+"-"+String(t.getMonth()+1).padStart(2,"0")+"-"+String(t.getDate()).padStart(2,"0")}function Ac(t){let e=String(t||"").match(/(\d{4})-(\d{1,2})-(\d{1,2})/);return e?new Date(Number(e[1]),Number(e[2])-1,Number(e[3])):null}let Ep={clean:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h11M4 17h14"/></svg>',exit:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M14 12H8"/><path d="m14 8 4 4-4 4"/></svg>',refresh:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 12a8 8 0 1 1-2.2-5.5"/><path d="M20 4v5h-5"/></svg>',schedule:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3.5v4M16 3.5v4"/></svg>',score:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h10v17H7z"/><path d="M10 8h4M10 12h4M10 16h3"/></svg>',room:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-7h6v7"/><path d="M9 10h.01M15 10h.01"/></svg>',eval:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8 7h11M8 12h11M8 17h8"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg>',plan:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M7 3.5h8l3 3V20.5H7z"/><path d="M15 3.5V7h3M10 12h5M10 16h5"/></svg>',apply:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',home:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="m4 11 8-7 8 7"/><path d="M7 10.5V20h10v-9.5"/></svg>',more:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/></svg>',close:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'};function Cp(t){return Ep[t]||Ep.more}let ot=ji();function Sc(){if(document.getElementById("urppp-clean-style"))return;let t=document.createElement("style");t.id="urppp-clean-style",t.textContent=Ni,(document.head||document.documentElement).appendChild(t)}let _c=Aa({deps:{scoreToNumber:Ke,scoreToGpa:Qe}}),{metricHtml:Ec,occupancyHtml:Cc,render:ar,renderScheduleBoard:zd,roomPickerHtml:Pc,scheduleRender:zc}=Zi({state:ot,deps:{DIRECT_EDIT_LABELS:H,DAY_NAMES:dp,analyzeScores:t=>_c.analyzeScores(t),applyPersonalDisplay:Kt,bandsChartSvg:_a,bindUI:t=>qc(t),classifyPrivacyLabel:na,courseColor:xp,ensureRoot:()=>zp(),escapeHtml:Z,firstContentChar:aa,getViewWeekNumber:hp,ico:Cp,isCleanAnalysisDirect:za,occupancyKindClass:vc,occupancyTypeLabel:Pr,personalizedProfile:Tl,scoreChartLayout:()=>{try{return window.matchMedia&&window.matchMedia("(max-width: 900px)").matches?{variant:"mobile"}:null}catch{return null}},scoreToNumber:Ke,summarizeCourses:oe,trendChartSvg:Sa,weekBitActive:fp,calVacation:Er,setCalendarPhase:bp}}),{ensureRoomCatalogLoaded:Pp,loadAll:Lc}=Ri({state:ot,deps:{ensureTermWeekResolved:ac,enrichScoresWithEvaluation:uc,getCurrentWeekNumber:$e,loadClassroomCatalog:hc,loadProfile:cp,loadSchedule:pc,loadScores:Ap,readRememberedTermWeek:Sr,reconcileProfileAndScores:mc,render:ar,scheduleRender:zc}}),{bindUI:qc,closeModal:Tc,getRoomHost:Ld,openModal:qd,openRoomModal:Td,openScoreModal:Md,showBuilding:Id}=Xi({state:ot,deps:{DAY_NAMES:dp,applyPersonalDisplay:Kt,bindScheduleExportHosts:Kl,closeCleanMode:()=>Ic(),ensureRoomCatalogLoaded:Pp,enrichOccupancyWithCurriculum:yc,ensureRoot:()=>zp(),escapeHtml:Z,fetchText:Qt,getCurrentWeekNumber:$e,getViewWeekNumber:hp,inferMaxWeek:oc,isUnevaluatedScore:ue,isValidOfficialGpa:ra,loadBuildingOccupancy:wc,metricHtml:Ec,occupancyHtml:Cc,render:ar,rootEl:()=>$c(),roomPickerHtml:Pc,scoreToGpa:Qe,scoreToNumber:Ke,summarizeCourses:oe,summarizeCoursesPreferOfficial:oe}}),{cleanModeApi:Mc,closeCleanMode:Ic,ensureRoot:zp,injectCleanEntry:$d,openCleanMode:Nd,rootEl:$c}=ts({state:ot,deps:{CLEAN_FLAG:bl,applySkinAttr:ae,closeModal:Tc,ensureRoomCatalogLoaded:Pp,ensureStyle:Sc,getCurrentWeekNumber:$e,getSkin:ee,handleThemeDotClick:lt,ico:Cp,injectCleanSidebarSections:t=>{try{window.__urpppInjectCleanSidebarSections?.(t)}catch{}},refreshMobileNavbar:()=>{try{window.__urpppRefreshMobileNavbar?.()}catch{}},setDrawerOpen:(t,e,r)=>{try{window.__urpppSetDrawerOpen?.(t,e,r)}catch{}},stopDrawerAnimation:t=>{try{window.__urpppStopDrawerAnimation?.(t)}catch{}},isHomePage:Rr,loadAll:Lc,openSettingsPanel:Sn,readRememberedTermWeek:Sr,refreshCleanPersonalDisplay:bo,render:ar,scoreToGpa:Qe,summarizeCourses:oe,syncNavbarThemeUI:gt,syncSettingsPanelUI:Dt,syncThemeDotGroup:X}});window.__urpppCleanMode=Mc;function ko(){if(!document.body){setTimeout(ko,10);return}if(Yo(),Gt(Yt()),setTimeout(()=>{try{de().then(e=>Pe(e))}catch{}},0),document.addEventListener("focusin",e=>{let r=e.target;if(!r||!r.matches||!r.matches(".chosen-search input"))return;let a=[],p=r.parentElement;for(;p;){let i=p.scrollTop,s=p.scrollLeft;(i||s||p.scrollHeight>p.clientHeight||p.scrollWidth>p.clientWidth)&&a.push({el:p,top:i,left:s}),p=p.parentElement}requestAnimationFrame(()=>{a.forEach(i=>{i.el.scrollTop=i.top,i.el.scrollLeft=i.left})})},!0),!!document.getElementById("formContent")&&!!document.querySelector(".form-signin")){en();try{En()}catch{}try{Tp()}catch{}}else{try{En()}catch{}try{Tp()}catch{}Is();try{Yn()}catch{}try{sa()}catch(e){console.warn("[URP++] route feature refresh",e)}try{xl()}catch{}try{Kt(document)}catch{}try{mp()}catch{}[350,900,1800].forEach(e=>setTimeout(()=>{try{sa()}catch{}try{Kt(document)}catch{}},e));try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}[400,1200,2500].forEach(e=>setTimeout(()=>{try{window.__urpppCleanMode&&window.__urpppCleanMode.inject()}catch{}},e));try{Pa()&&Rr()&&window.__urpppCleanMode&&setTimeout(()=>{try{window.__urpppCleanMode.open(!1)}catch{}},700)}catch{}}}if(!window.__urpppSidebarSyncBound){window.__urpppSidebarSyncBound=!0,window.addEventListener("resize",()=>{clearTimeout(window.__urpppSidebarSyncTimer),window.__urpppSidebarSyncTimer=setTimeout(Te,50)}),window.addEventListener("load",()=>{Te(),Ye(),setTimeout(Te,100),setTimeout(Te,400)}),document.addEventListener("click",e=>{e.target&&e.target.closest&&e.target.closest("#menu-toggler, .menu-toggler, .navbar-toggle, .urppp-sidebar-toggle, .sidebar-collapse, #sidebar-collapse")&&(setTimeout(Ye,0),setTimeout(Ye,50),setTimeout(Ye,200))},!0);let t=document.getElementById("sidebar");t&&!t.__urpppMarginObs&&(t.__urpppMarginObs=new MutationObserver(()=>{clearTimeout(window.__urpppMarginObsTimer),window.__urpppMarginObsTimer=setTimeout(Ye,30)}),t.__urpppMarginObs.observe(t,{attributes:!0,attributeFilter:["class","style"]}))}function Lp(){if(window.__urpppRouteWatchBound)return;window.__urpppRouteWatchBound=!0;let t=0,e=()=>{try{let p=!!(window.matchMedia&&window.matchMedia("(max-width: 640px)").matches),i=!!(document.getElementById("urppp-clean-root")&&document.getElementById("urppp-clean-root").classList.contains("open"));p&&!i&&window.__urpppCloseMobileDrawer&&window.__urpppCloseMobileDrawer()}catch{}clearTimeout(t),t=setTimeout(()=>{if(ot._termWeekResolved=!1,!!document.getElementById("sidebar")){Te(),Jn(),it(),Te();try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}ct(),[250,700].forEach(i=>setTimeout(()=>{try{window.__urpppRefreshMobileNavbar&&window.__urpppRefreshMobileNavbar()}catch{}},i)),Oa(),vn(),wn(),un(),kn(),yn(),bn(),document.querySelectorAll(".page-content, #page-content-template").forEach(i=>{let s=!!(window.matchMedia&&window.matchMedia("(max-width: 991px)").matches);i.style.setProperty("padding",s?"8px 8px 24px":"16px 64px 40px","important"),i.style.setProperty("box-sizing","border-box","important")}),Wr(),Vr(),Ue(),setTimeout(Ue,300),setTimeout(Ue,1e3),nn(),ve(),mr(),ln(),setTimeout(mr,300),br(),setTimeout(()=>br(),500),Ur(),sn();try{gl()}catch{}try{sa()}catch{}try{Kt(document)}catch{}setTimeout(()=>{try{sa()}catch{}try{Kt(document)}catch{}},500)}},100)};window.addEventListener("popstate",e),window.addEventListener("hashchange",e);let r=history.pushState,a=history.replaceState;history.pushState=function(...p){let i=r.apply(this,p);return e(),i},history.replaceState=function(...p){let i=a.apply(this,p);return e(),i}}let or=typeof unsafeWindow<"u"?unsafeWindow:window;or.__urpppDebug=or.__urpppDebug||{},or.__urpppDebug.setCalendarPhase=t=>bp(t),or.__urpppDebug.getCalendarPhase=()=>rc(),or.__urpppDebug.calVacation=t=>Er(t),or.urppp={version:o,showLogo(t){let e=document.querySelector("#urppp-brand .ub-logo");e&&e.classList.toggle("show",t)},theme:{apply:t=>{Gt(t)},setAccent:ms,getAccent:Zt,getCurrent:Yt,list:()=>Object.entries(Ct).map(([t,e])=>({name:t,displayName:e.name,current:t===Yt()}))},update:{check:po,auto:no,showToast:oo},privacy:{get:Ce,set(t){return qa(t),Kt(document),Ce()},apply:()=>Kt(document),identity:{get:je,set(t){return Wo(t),Kt(document),bo(),je()}}},scheduleExport:{load:()=>ap("api"),run:t=>Rl(t,"api",null,null),patch:yo,image:{theme:pp,build:(t,e)=>ip(t,e)},jsonFormat:{get:Or,set:Jo,validate:Be,build(t,e){let r=ba(t);if(e)return fa(r,Be(e));let a=Or();return a.enabled?fa(r,a.mapping):ha(r)},buildDefault(t){return ha(ba(t))}}}};function qp(){setTimeout(()=>{try{no()}catch{}},1800)}function Tp(){setTimeout(()=>{try{if(GM_getValue("urppp_builtin_downs_reported",!1))return;(typeof d<"u"?d:[]).filter(e=>e&&e.builtin).map(e=>e.id).forEach(e=>{try{Ka(e,xr)}catch{}}),GM_setValue("urppp_builtin_downs_reported",!0)}catch{}},2600)}try{Yo()}catch{}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{ko(),Lp(),qp()}):(ko(),Lp(),qp())})();})();
